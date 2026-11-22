import { normal, relativeState, steadyState, type Condition } from '../../science'

import type { ConditionFrame } from './conditionTransition'
import { cyanideCarrierShift, cyanideDuration } from './cyanideTransition'

export type AnimationState = {
  electronFlowSpeed: number
  protonPumpRate: number
  protonLeakRate: number
  synthaseRotationSpeed: number
  atpPulseRate: number
  protonDensity: number
  oxygenRate: number
  leakActive: boolean
  complexIVBlocked: boolean
  carrierShift: ConditionFrame['carrierShift']
  inputStopped: boolean
  inputReduced?: boolean
  adpLimited: boolean
  synthaseInhibited: boolean
  motionIntensity: number
  particleBudget: number
}
export type DisplayPreferences = { reducedMotion: boolean; compact: boolean }
export function mapAnimationState(condition: Condition, output: ReturnType<typeof relativeState>, preferences: DisplayPreferences, frame: ConditionFrame | null = null): AnimationState {
  const controls = frame?.controls ?? condition
  const values = frame?.values ?? output
  const flux = steadyState(condition)
  const reference = steadyState(normal)
  // Normal = 1. One shared scale per process across both panels, never per-panel normalization.
  return {
    electronFlowSpeed: frame?.electrons ?? output.oxygen / 100,
    protonPumpRate: frame?.electrons ?? output.oxygen / 100,
    oxygenRate: values.oxygen / 100,
    protonDensity: values.gradient / 100,
    synthaseRotationSpeed: values.atp / 100,
    atpPulseRate: values.atp / 100,
    protonLeakRate: frame?.leakRate ?? condition.leak * flux.gradient / reference.oxygen,
    leakActive: controls.leak > normal.leak + 0.000001,
    complexIVBlocked: frame?.terminalBlock ?? (condition.complexIVActivity === 0),
    carrierShift: frame ? frame.carrierShift :
      condition.complexIVActivity === 0 && condition.input > 0 ? cyanideCarrierShift(cyanideDuration) : null,
    inputStopped: controls.input === 0,
    inputReduced: controls.input > 0 && controls.input < 0.999999,
    adpLimited: controls.adp < 0.5,
    synthaseInhibited: controls.synthase < 0.2,
    motionIntensity: preferences.reducedMotion ? 0.2 : 1,
    particleBudget: preferences.compact ? 0.55 : 1,
  }
}
export function relativeTrend(value: number) {
  return value < 0.01 ? '정지' : Math.abs(value - 100) < 0.05 ? '정상 수준' : value > 100 ? '증가 ↑' : '감소 ↓'
}
