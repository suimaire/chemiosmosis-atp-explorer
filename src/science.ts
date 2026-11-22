export const R = 8.314462618
export const F = 96485.33212
export type Gradient = { pHA: number; pHB: number; deltaPsiMv: number; temperatureC: number }
export const defaultGradient: Gradient = { pHA: 7, pHB: 8, deltaPsiMv: -150, temperatureC: 25 }
export function protonEnergy({ pHA, pHB, deltaPsiMv, temperatureC }: Gradient) {
  if (![pHA, pHB, deltaPsiMv, temperatureC].every(Number.isFinite) || temperatureC <= -273.15) throw new RangeError('Finite inputs and positive absolute temperature required')
  // Δψ is explicitly ψ_B − ψ_A. Convert mV to V and J to kJ.
  const chemical = Math.LN10 * R * (temperatureC + 273.15) * (pHA - pHB) / 1000
  const electrical = F * deltaPsiMv / 1_000_000
  const total = chemical + electrical
  return { chemical, electrical, total, direction: Math.abs(total) < 1e-9 ? 'equilibrium' : total < 0 ? 'A→B' : 'B→A' }
}
export function coupledEnergy(protonDeltaG: number, ratio: number, atpRequirement: number) {
  if (![protonDeltaG, ratio, atpRequirement].every(Number.isFinite) || ratio <= 0 || atpRequirement < 0) throw new RangeError('Invalid coupling parameters')
  return ratio * protonDeltaG + atpRequirement
}
export type Condition = { input: number; synthase: number; leak: number; adp: number; complexIVActivity?: 0 | 1 }
export const normal: Condition = { input: 1, synthase: 1, leak: 0.12, adp: 1, complexIVActivity: 1 }
export const presets = {
  normal: { label: '정상 결합 상태', condition: normal },
  inhibited: { label: 'ATP 합성 경로 억제', condition: { ...normal, synthase: 0.03 } },
  leak: { label: 'H⁺ 누출 증가', condition: { ...normal, leak: 1.2 } },
  reduced: { label: '전자전달 입력 감소', condition: { ...normal, input: 0.25 } },
  stopped: { label: '전자전달 입력 중단', condition: { ...normal, input: 0 } },
  cyanide: {
    label: '시안화합물 처리',
    condition: { ...normal, complexIVActivity: 0 } as const,
    explanation: '시안화합물이 복합체 IV(시토크롬 c 산화효소)를 완전히 억제하면 최종 전자수용체인 O₂가 H₂O로 환원되지 않아 산소 소비가 멈춘다. 순 전자전달이 멈추면 H⁺ 수송도 중단된다. 남은 H⁺ 기울기는 누출과 ATP 합성효소를 통한 H⁺ 이동으로 소실되어 정상상태에서 산화적 ATP 합성이 멈춘다.',
  },
  adp: { label: 'ADP 가용성 감소', condition: { ...normal, adp: 0.15 } },
}
export type PresetKey = keyof typeof presets
export function presetKeyFor(condition: Condition): PresetKey | undefined {
  const current = { ...condition, complexIVActivity: condition.complexIVActivity ?? 1 }
  return (Object.keys(presets) as PresetKey[]).find(key =>
    Object.entries(presets[key].condition).every(([field, value]) => current[field as keyof Condition] === value)
  )
}
export function steadyState(c: Condition) {
  if (![c.input, c.synthase, c.leak, c.adp].every(v => Number.isFinite(v) && v >= 0) || c.input > 1 || c.synthase > 1 || c.adp > 1 || c.leak > 2) throw new RangeError('Condition outside teaching model domain')
  const complexIVActivity = c.complexIVActivity ?? 1
  if (complexIVActivity !== 0 && complexIVActivity !== 1) throw new RangeError('Complex IV must be active or blocked')
  const effectiveInput = c.input * complexIVActivity
  const conductance = 0.75 * c.adp * c.synthase
  const denominator = effectiveInput + c.leak + conductance
  if (denominator === 0) throw new RangeError('No unique steady state in a closed, unpowered membrane')
  // Teaching balance: effectiveInput*(1-g) = (leak + synthase conductance)*g.
  // Oxygen is proportional to mitochondrial electron flux; ATP to synthase flux.
  const gradient = effectiveInput / denominator
  return { gradient, oxygen: effectiveInput * (1 - gradient), atp: conductance * gradient }
}
export function relativeState(c: Condition) {
  const result = steadyState(c), reference = steadyState(normal)
  return { oxygen: result.oxygen / reference.oxygen * 100, gradient: result.gradient / reference.gradient * 100, atp: result.atp / reference.atp * 100 }
}
