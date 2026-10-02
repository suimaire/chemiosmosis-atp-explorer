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
export type Condition = { input: number; synthase: number; leak: number; adp: number }
export const normal: Condition = { input: 1, synthase: 1, leak: 0.12, adp: 1 }
export const presets = {
  normal: { label: '정상 결합 상태', condition: normal },
  inhibited: { label: 'ATP 합성 경로 억제', condition: { ...normal, synthase: 0.03 } },
  leak: { label: 'H⁺ 누출 증가', condition: { ...normal, leak: 1.2 } },
  reduced: { label: '전자전달 입력 감소', condition: { ...normal, input: 0.25 } },
  stopped: { label: '전자전달 입력 중단', condition: { ...normal, input: 0 } },
  adp: { label: 'ADP 가용성 감소', condition: { ...normal, adp: 0.15 } },
}
export type PresetKey = keyof typeof presets
export function steadyState(c: Condition) {
  if (!Object.values(c).every(v => Number.isFinite(v) && v >= 0) || c.input > 1 || c.synthase > 1 || c.adp > 1 || c.leak > 2) throw new RangeError('Condition outside teaching model domain')
  const conductance = 0.75 * c.adp * c.synthase
  const denominator = c.input + c.leak + conductance
  if (denominator === 0) throw new RangeError('No unique steady state in a closed, unpowered membrane')
  // Teaching balance: input*(1-g) = (leak + synthase conductance)*g.
  // Oxygen is proportional to mitochondrial electron flux; ATP to synthase flux.
  const gradient = c.input / denominator
  return { gradient, oxygen: c.input * (1 - gradient), atp: conductance * gradient }
}
export function relativeState(c: Condition) {
  const result = steadyState(c), reference = steadyState(normal)
  return { oxygen: result.oxygen / reference.oxygen * 100, gradient: result.gradient / reference.gradient * 100, atp: result.atp / reference.atp * 100 }
}
