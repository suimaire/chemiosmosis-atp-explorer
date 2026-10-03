import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { normal, presets, relativeState, steadyState, type Condition } from '../../science'
import { mapAnimationState, STOP_TRANSITION_SECONDS, stopTransition } from './animationState'
import { EtcComparison3D } from './EtcComparison3D'
import { complexes, electronPaths } from './sceneLayout'

const preferences = { reducedMotion: false, compact: false }
const map = (condition: Condition) => mapAnimationState(condition, relativeState(condition), preferences)
const reference = map(normal)
describe('Step 04 output-to-animation mapping', () => {
  it('renders two independently labelled comparison panels and static diagrams before WebGL is ready', () => {
    const html = renderToStaticMarkup(<EtcComparison3D a={normal} b={presets.leak.condition} />)
    expect(html).toContain('전자전달과 산화적 인산화 3D 비교')
    expect(html).toContain('조건 A 3D 개념 모형')
    expect(html).toContain('조건 B 3D 개념 모형')
    expect(html).toContain('data-leak-active="true"')
    expect(html).toContain('II는 H⁺ 펌프가 아닙니다')
  })
  it.each(Object.entries(presets))('%s uses the exact shared graph outputs, without per-panel rescaling', (_, preset) => {
    const output = relativeState(preset.condition), state = map(preset.condition)
    expect(state.electronFlowSpeed * 100).toBeCloseTo(output.oxygen)
    expect(state.protonPumpRate).toBe(state.electronFlowSpeed)
    expect(state.oxygenRate).toBe(state.electronFlowSpeed)
    expect(state.protonDensity * 100).toBeCloseTo(output.gradient)
    expect(state.synthaseRotationSpeed * 100).toBeCloseTo(output.atp)
    expect(state.atpPulseRate).toBe(state.synthaseRotationSpeed)
    expect(state.protonLeakRate).toBeCloseTo(preset.condition.leak * steadyState(preset.condition).gradient / steadyState(normal).oxygen)
  })
  it('shows faster input and a distinct leaking route with a lower gradient and ATP output', () => {
    const state = map(presets.leak.condition)
    expect(state.leakActive).toBe(true)
    expect(state.electronFlowSpeed).toBeGreaterThan(reference.electronFlowSpeed)
    expect(state.protonLeakRate).toBeGreaterThan(reference.protonLeakRate)
    expect(state.protonDensity).toBeLessThan(reference.protonDensity)
    expect(state.atpPulseRate).toBeLessThan(reference.atpPulseRate)
  })
  it('inhibition slows rotation despite a higher gradient and leaves nonzero electron flow', () => {
    const state = map(presets.inhibited.condition)
    expect(state.synthaseRotationSpeed).toBeLessThan(0.1)
    expect(state.electronFlowSpeed).toBeGreaterThan(0)
    expect(state.electronFlowSpeed).toBeLessThan(1)
    expect(state.protonDensity).toBeGreaterThan(1)
  })
  it('reduced and stopped input decrease electron flow, pumping, density, and ATP', () => {
    for (const key of ['electronFlowSpeed', 'protonPumpRate', 'protonDensity', 'atpPulseRate'] as const) {
      expect(map(presets.reduced.condition)[key]).toBeLessThan(reference[key])
      expect(map(presets.stopped.condition)[key]).toBe(0)
    }
  })
  it('low ADP is distinguished from blocked synthase, with slower ATP production', () => {
    const state = map(presets.adp.condition)
    expect(state.adpLimited).toBe(true)
    expect(state.synthaseInhibited).toBe(false)
    expect(state.atpPulseRate).toBeLessThan(reference.atpPulseRate)
    expect(state.protonDensity).toBeGreaterThan(reference.protonDensity)
  })
  it('A and B are independent, including user-adjusted combinations and zero ADP', () => {
    const a = { ...normal, input: 0.4, adp: 0 }, b = { ...normal, leak: 1.7, synthase: 0.2 }
    const aState = map(a), bState = map(b)
    expect(aState.atpPulseRate).toBe(0)
    expect(bState.atpPulseRate).toBeGreaterThan(0)
    expect(map(a)).toEqual(aState)
    expect(a).toEqual({ ...normal, input: 0.4, adp: 0 })
  })
  it('reduced motion and mobile reduce animation work while retaining the scientific output', () => {
    const state = mapAnimationState(normal, relativeState(normal), { reducedMotion: true, compact: true })
    expect(state.motionIntensity).toBe(0.2)
    expect(state.particleBudget).toBeLessThan(1)
    expect(state.protonDensity).toBe(reference.protonDensity)
    expect(state.atpPulseRate).toBe(reference.atpPulseRate)
  })
  it('stops new pumping immediately, fades the prior reservoir, and reaches exactly zero', () => {
    const stopped = map(presets.stopped.condition)
    const halfway = stopTransition(reference, stopped, STOP_TRANSITION_SECONDS / 2)
    expect(halfway.electronFlowSpeed).toBe(0)
    expect(halfway.protonPumpRate).toBe(0)
    expect(halfway.protonDensity).toBeGreaterThan(0)
    expect(halfway.protonDensity).toBeLessThan(reference.protonDensity)
    expect(halfway.synthaseRotationSpeed).toBeGreaterThan(0)
    expect(stopTransition(reference, stopped, STOP_TRANSITION_SECONDS)).toEqual(stopped)
    expect(stopTransition(reference, stopped, 10)).toEqual(stopped)
  })
  it('only I, III and IV pump; electron paths include II without flowing to ATP synthase', () => {
    expect(complexes.filter(c => c.pump).map(c => c.name)).toEqual(['I', 'III', 'IV'])
    expect(electronPaths[1][0][0]).toBe(complexes[1].x)
    expect(electronPaths.flat().every(p => p[0] < 4)).toBe(true)
  })
})
