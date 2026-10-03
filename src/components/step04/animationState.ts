import { normal, presets, relativeState, steadyState, type Condition } from '../../science'

export type AnimationState = {
  electronFlowSpeed: number
  protonPumpRate: number
  protonLeakRate: number
  synthaseRotationSpeed: number
  atpPulseRate: number
  protonDensity: number
  oxygenRate: number
  leakActive: boolean
  inputStopped: boolean
  adpLimited: boolean
  synthaseInhibited: boolean
  motionIntensity: number
  particleBudget: number
}
export type DisplayPreferences = { reducedMotion: boolean; compact: boolean }
export function mapAnimationState(condition: Condition, output: ReturnType<typeof relativeState>, preferences: DisplayPreferences): AnimationState {
  const flux = steadyState(condition)
  const reference = steadyState(normal)
  // Normal = 1. One shared scale per process across both panels, never per-panel normalization.
  return {
    electronFlowSpeed: output.oxygen / 100,
    protonPumpRate: output.oxygen / 100,
    oxygenRate: output.oxygen / 100,
    protonDensity: output.gradient / 100,
    synthaseRotationSpeed: output.atp / 100,
    atpPulseRate: output.atp / 100,
    protonLeakRate: condition.leak * flux.gradient / reference.oxygen,
    leakActive: condition.leak > normal.leak,
    inputStopped: condition.input === 0,
    adpLimited: condition.adp < 0.5,
    synthaseInhibited: condition.synthase < 0.2,
    motionIntensity: preferences.reducedMotion ? 0.2 : 1,
    particleBudget: preferences.compact ? 0.55 : 1,
  }
}
export function conditionLabel(condition: Condition) {
  return Object.values(presets).find(p => Object.entries(p.condition).every(([key, value]) => condition[key as keyof Condition] === value))?.label ?? '사용자 조절 조건'
}
export function relativeTrend(value: number) {
  return value < 0.01 ? '정지' : Math.abs(value - 100) < 0.05 ? '정상 수준' : value > 100 ? '증가 ↑' : '감소 ↓'
}

// A short display interpolation, not a calibrated kinetic model. Electron supply/pumping
// stop immediately; only the previously displayed reservoir/ATP motion fades to the target.
export const STOP_TRANSITION_SECONDS = 2.4
export function stopTransition(previous: AnimationState, target: AnimationState, elapsed: number): AnimationState {
  const remaining = Math.max(0, 1 - elapsed / STOP_TRANSITION_SECONDS) ** 2
  return { ...target,
    protonDensity: target.protonDensity + (previous.protonDensity - target.protonDensity) * remaining,
    synthaseRotationSpeed: target.synthaseRotationSpeed + (previous.synthaseRotationSpeed - target.synthaseRotationSpeed) * remaining,
    atpPulseRate: target.atpPulseRate + (previous.atpPulseRate - target.atpPulseRate) * remaining,
    protonLeakRate: target.protonLeakRate + (previous.protonLeakRate - target.protonLeakRate) * remaining,
  }
}
