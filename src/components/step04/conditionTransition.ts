import { normal, presetKeyFor, relativeState, steadyState, type Condition, type PresetKey } from '../../science'
import { cyanideCarrierShift, cyanideFrame } from './cyanideTransition'
import { stagesFor, type Stage } from './transitionStages'

const reference = steadyState(normal)
const referenceOut = normal.leak + 0.75 * normal.adp * normal.synthase
type Controls = { input: number; synthase: number; leak: number; adp: number; iv: number; upper: number; terminal: number }
type Snapshot = { controls: Controls; g: number; values: ReturnType<typeof relativeState>; electrons: number; leakRate: number }
export type ConditionFrame = Snapshot & { terminalBlock: boolean; carrierShift: ReturnType<typeof cyanideCarrierShift>; elapsed: number; duration: number; index: number; stage: Stage; complete: boolean }
export type ChangeSource = 'preset' | 'slider'

function controlsFor(c: Condition): Controls {
  const iv = c.complexIVActivity ?? 1
  return { input: c.input, synthase: c.synthase, adp: c.adp, leak: c.leak, iv, upper: c.input * iv, terminal: c.input * iv }
}
function snapshot(controls: Controls, g: number): Snapshot {
  const oxygen = controls.terminal * (1 - g)
  return { controls, g, electrons: controls.upper * (1 - g) / reference.oxygen,
    leakRate: controls.leak * g / reference.oxygen,
    values: { oxygen: oxygen / reference.oxygen * 100, gradient: g / reference.gradient * 100,
      atp: 0.75 * controls.adp * controls.synthase * g / reference.atp * 100 } }
}
export function equilibrium(c: Condition): Snapshot {
  const state = snapshot(controlsFor(c), steadyState(c).gradient)
  return { ...state, values: relativeState(c) }
}
const mix = (a: number, b: number, t: number) => t === 1 ? b : a + (b - a) * t
function smooth(x: number) {
  const t = Math.max(0, Math.min(1, x))
  return t * t * (3 - 2 * t)
}
// These are teaching-clock gates for the residual upstream carriers after terminal blockade.
// Calibrate the gate capacities to the published classroom sequence from a normal start.
function cyanideGates(time: number) {
  const f = cyanideFrame(time)
  const scale = reference.oxygen / (1 - reference.gradient * f.gradient)
  return { upper: f.electrons * scale, terminal: f.oxygen * scale, gradient: reference.gradient * f.gradient }
}

export function makeTransition(start: Snapshot, target: Condition, source: ChangeSource, previous?: PresetKey) {
  const key = source === 'slider' ? 'custom' : presetKeyFor(target) ?? 'custom'
  const upstreamAvailable = start.controls.input > 0 && start.controls.upper > 0
  const stages = stagesFor(key, previous, start.g === 0 && start.electrons === 0, upstreamAvailable)
  const duration = stages[stages.length - 1].time
  const end = equilibrium(target)
  const from = start.controls, to = end.controls
  const step = 0.05
  function controlsAt(t: number): Controls {
    const u = smooth(t / (key === 'custom' ? 0.18 : key === 'stopped' ? 1 : 1.4))
    const c = { input: mix(from.input, to.input, u), synthase: mix(from.synthase, to.synthase, u),
      leak: mix(from.leak, to.leak, u), adp: mix(from.adp, to.adp, u), iv: mix(from.iv, to.iv, u),
      upper: mix(from.upper, to.upper, u), terminal: mix(from.terminal, to.terminal, u) }
    if (key === 'cyanide') {
      const gates = cyanideGates(t)
      c.upper = from.upper * gates.upper
      c.terminal = from.terminal * gates.terminal
      c.iv = from.iv * (1 - smooth((t - 0.8) / 1.2))
    }
    return c
  }
  function integrate(g: number, t0: number, t1: number) {
    if (t1 <= t0) return g
    const mid = (t0 + t1) / 2
    const c = controlsAt(mid)
    // I and III together transport 8 of the 10 H+ on the illustrated NADH route.
    const pump = 0.8 * c.upper + 0.2 * c.terminal
    const total = pump + c.leak + 0.75 * c.adp * c.synthase
    if (!total) return g
    const balancePoint = pump / total
    let exposure: number
    if (key === 'cyanide') {
      // Infer only the presentation timescale from the existing normal-start keyframes.
      // At other starts the same clock operates on that panel's own pump and outflow.
      const ref = cyanideGates(mid)
      const refPump = 0.8 * ref.upper + 0.2 * ref.terminal
      const refTotal = refPump + referenceOut
      const refBalance = refPump / refTotal
      const g0 = cyanideGates(t0).gradient, g1 = cyanideGates(t1).gradient
      const fraction = g0 === g1 ? 0 : Math.max(0, Math.min(1, (g0 - g1) / (g0 - refBalance)))
      exposure = -Math.log1p(-fraction) / refTotal
    } else {
      // Exact frozen-coefficient balance over this slice. Compress the final tail
      // so even low-conductance slider settings reach their precise steady state.
      const tail = (t: number) => Math.max(0.00000001, Math.min(1, (duration - t) / (duration * 0.45)))
      exposure = (t1 - t0) * 3 / duration + 4 * Math.log(tail(t0) / tail(t1)) / total
    }
    return g + (balancePoint - g) * -Math.expm1(-total * exposure)
  }
  // A bounded table permits exact stage seeking without history-dependent integration.
  const gradients = [start.g]
  for (let i = 1; i < Math.ceil(duration / step); i++)
    gradients.push(integrate(gradients[i - 1], (i - 1) * step, i * step))
  function frameAt(seconds: number): ConditionFrame {
    const elapsed = Math.max(0, Math.min(duration, seconds))
    const complete = elapsed === duration
    const index = stages.findLastIndex(s => elapsed >= s.time)
    const i = Math.min(gradients.length - 1, Math.floor(elapsed / step))
    const state = complete ? end : elapsed === 0 ? start :
      snapshot(controlsAt(elapsed), integrate(gradients[i], i * step, elapsed))
    const terminalBlock = state.controls.iv < 0.999999 || (key === 'cyanide' && index > 0)
    const carrierShift = key === 'cyanide' && upstreamAvailable ? cyanideCarrierShift(elapsed) : null
    return { ...state, terminalBlock, carrierShift, elapsed, duration, index, stage: stages[index], complete }
  }
  return { duration, stages, frameAt }
}
