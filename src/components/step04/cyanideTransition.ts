// Illustrative keyframes, in presentation seconds. Rates are fractions of normal.
export const cyanideStages = [
  { time: 0,   title: '처리 직전',      note: '복합체 IV가 O₂에 전자를 전달하고, H⁺ 기울기에 의해 ATP가 합성된다.', oxygen: 1, electrons: 1, gradient: 1 },
  { time: 0.8, title: '복합체 IV 억제', note: '시안화합물이 시토크롬 c 산화효소에 결합하면서 O₂ 환원과 복합체 IV의 H⁺ 수송이 감소한다.', oxygen: 1, electrons: 1, gradient: 1 },
  { time: 2,   title: '산소 소비 중단', note: 'O₂로의 전자 전달과 복합체 IV의 H⁺ 수송이 멈춘다. 상류에는 아직 전자를 받을 수 있는 운반체가 남아 있다.', oxygen: 0, electrons: 1, gradient: 1 },
  { time: 3.1, title: '상류 전자전달 감소', note: '시토크롬 c와 유비퀴논 풀에서 환원형 비중이 커진다. 전자를 받을 산화형 운반체가 줄어 상류 전자전달과 H⁺ 수송이 감소한다.', oxygen: 0, electrons: 0.72, gradient: 0.96 },
  { time: 4.6, title: '펌핑 중단과 H⁺ 귀환', note: 'H⁺ 펌핑은 멈췄지만 막사이공간에는 기울기가 남아 있다. H⁺가 ATP 합성효소와 누출 경로를 통해 기질로 계속 돌아온다.', oxygen: 0, electrons: 0, gradient: 0.80 },
  { time: 6.2, title: 'ATP 합성 감소', note: '남은 H⁺ 기울기가 작아질수록 ATP 합성효소를 통한 H⁺ 이동과 ATP 합성 속도가 함께 감소한다.', oxygen: 0, electrons: 0, gradient: 0.44 },
  { time: 8,   title: '최종 정상상태', note: '복합체 IV의 산소 소비는 0이다. H⁺ 기울기가 소실되어 산화적 ATP 합성도 멈춘다.', oxygen: 0, electrons: 0, gradient: 0 },
] as const

export const cyanideDuration = cyanideStages[cyanideStages.length - 1].time

// Drawing progress on the presentation clock, not concentrations or redox fractions.
export function cyanideCarrierShift(seconds: number) {
  const oxygenStop = cyanideStages[2].time
  if (seconds <= oxygenStop) return null
  const pumpStop = cyanideStages[4].time
  const rise = (start: number, end: number) => {
    const t = Math.max(0, Math.min(1, (seconds - start) / (end - start)))
    return t * t * (3 - 2 * t)
  }
  return { cytC: rise(oxygenStop, pumpStop - 0.45), q: rise(oxygenStop + 0.35, pumpStop) }
}

export function cyanideFrame(seconds: number) {
  const elapsed = Math.max(0, Math.min(seconds, cyanideDuration))
  const index = cyanideStages.findLastIndex(stage => stage.time <= elapsed)
  const stage = cyanideStages[index]
  const next = cyanideStages[index + 1] ?? stage
  const fraction = stage === next ? 0 : (elapsed - stage.time) / (next.time - stage.time)
  const interpolate = (key: 'oxygen' | 'electrons' | 'gradient') => stage[key] + (next[key] - stage[key]) * fraction
  // ADP, synthase and basal leak conductances are constant throughout this treatment.
  const gradient = interpolate('gradient')
  return { index, stage, elapsed, electrons: interpolate('electrons'), oxygen: interpolate('oxygen'), gradient, atp: gradient }
}
export type CyanideFrame = ReturnType<typeof cyanideFrame>
