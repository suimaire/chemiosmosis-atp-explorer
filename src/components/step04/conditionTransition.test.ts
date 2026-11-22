import { describe, expect, it } from 'vitest'
import { normal, presets, relativeState, steadyState, type PresetKey } from '../../science'
import { equilibrium, makeTransition } from './conditionTransition'
const keys = Object.keys(presets) as PresetKey[]
const baseline = equilibrium(normal)
const ref = steadyState(normal)
const start = (key: PresetKey) => makeTransition(baseline, presets[key].condition, 'preset', 'normal')

describe('condition playback and proton balance', () => {
  for (const previous of keys) {
    it.each(keys)(previous + ' → %s preserves the first frame and converges without a final jump', key => {
      const from = equilibrium(presets[previous].condition)
      const target = presets[key].condition
      const plan = makeTransition(from, target, 'preset', previous)
      expect(plan.frameAt(0)).toMatchObject(from)
      expect(plan.frameAt(plan.duration).values).toEqual(relativeState(target))
      const before = plan.frameAt(plan.duration - 0.001)
      for (const k of ['gradient', 'atp', 'oxygen'] as const)
        expect(Math.abs(before.values[k] - relativeState(target)[k])).toBeLessThan(0.2)
      let last = plan.frameAt(0)
      for (let i = 1; i < plan.duration * 20; i++) {
        const f = plan.frameAt(i / 20)
        expect(f.g).toBeGreaterThanOrEqual(0)
        expect(f.g).toBeLessThanOrEqual(1)
        expect(f.values.atp).toBeCloseTo(0.75 * f.controls.adp * f.controls.synthase * f.g / ref.atp * 100)
        expect(f.values.oxygen).toBeCloseTo(f.controls.terminal * (1 - f.g) / ref.oxygen * 100)
        expect(f.leakRate).toBeCloseTo(f.controls.leak * f.g / ref.oxygen)
        for (const k of ['gradient', 'atp', 'oxygen'] as const) {
          expect(f.values[k]).toBeGreaterThanOrEqual(0)
          expect(Math.abs(f.values[k] - last.values[k])).toBeLessThan(15)
        }
        last = f
      }
    })
  }
  it('separates the immediate cause from gradient feedback', () => {
    for (const key of ['adp', 'inhibited'] as const) {
      const f = start(key).frameAt(0.5)
      expect(100 - f.values.atp).toBeGreaterThan(f.values.gradient - 100)
      expect(f.values.gradient).toBeGreaterThan(100)
      expect(f.values.oxygen).toBeLessThan(100)
      expect(f.controls.synthase < 1).toBe(key === 'inhibited')
    }
    const leak = start('leak').frameAt(0.5)
    expect(leak.leakRate).toBeGreaterThan(baseline.leakRate)
    expect(leak.values.oxygen).toBeGreaterThan(100)
    expect(leak.values.atp).toBeLessThan(100)
    for (const k of ['stopped','reduced'] as const) {
      const f = start(k).frameAt(0.5)
      expect(f.values.oxygen).toBeLessThan(f.values.gradient)
      expect(f.values.gradient).toBeGreaterThan(90)
    }
    expect(start('stopped').frameAt(1).values.oxygen).toBe(0)
    expect(start('stopped').frameAt(1).values.atp).toBeGreaterThan(50)
  })
  it('resets a high or low gradient in opposite directions', () => {
    for (const previous of ['inhibited','leak'] as const) {
      const from = equilibrium(presets[previous].condition)
      const plan = makeTransition(from, normal, 'preset', previous)
      const delta = plan.frameAt(3).g - from.g
      expect(Math.sign(delta)).toBe(previous === 'leak' ? 1 : -1)
    }
  })
  it('shows the cyt c shift before the Q shift and retains both after pumping stops', () => {
    const plan = start('cyanide')
    expect(plan.frameAt(2).carrierShift).toBeNull()
    expect(plan.frameAt(2.2).carrierShift?.cytC).toBeGreaterThan(0)
    expect(plan.frameAt(2.2).carrierShift?.q).toBe(0)
    const middle = plan.frameAt(3.1).carrierShift!
    expect(middle.q).toBeGreaterThan(0)
    expect(middle.cytC).toBeGreaterThan(middle.q)
    const stopped = plan.frameAt(4.6)
    expect(stopped.electrons).toBe(0)
    expect(stopped.carrierShift!.q).toBeGreaterThan(middle.q)
    expect(plan.frameAt(8).carrierShift).toEqual(stopped.carrierShift)
    expect(plan.frameAt(3.1).carrierShift).toEqual(middle)
    expect(plan.frameAt(0).carrierShift).toBeNull()
    for (const key of keys.filter(k => k !== 'cyanide')) {
      const reset = makeTransition(stopped, presets[key].condition, 'preset', 'cyanide')
      expect(reset.frameAt(0).carrierShift).toBeNull()
      expect(reset.frameAt(reset.duration).carrierShift).toBeNull()
    }
  })
  it('does not build reduced carriers when supply stopped, even with a residual gradient', () => {
    for (const time of [1, 7]) {
      const stopped = start('stopped').frameAt(time)
      expect(stopped.g > 0).toBe(time === 1)
      const plan = makeTransition(stopped, presets.cyanide.condition, 'preset', 'stopped')
      for (const stage of plan.stages) {
        const frame = plan.frameAt(stage.time)
        expect(frame.carrierShift).toBeNull()
        expect(frame.electrons).toBe(0)
      }
    }
  })
  it('retargets interrupted terminal blockade and repeated slider input from the displayed rates', () => {
    let current = start('cyanide').frameAt(3.4)
    expect(current.electrons).toBeGreaterThan(0)
    expect(current.values.oxygen).toBe(0)
    for (let i = 0; i < 80; i++) {
      const target = { ...normal, leak: 0.02 + i / 50, adp: i / 100 }
      const plan = makeTransition(current, target, 'slider')
      expect(plan.duration).toBeLessThan(1)
      expect(plan.frameAt(0).values).toEqual(current.values)
      expect(plan.frameAt(0).electrons).toBe(current.electrons)
      expect(plan.frameAt(plan.duration).values).toEqual(relativeState(target))
      current = plan.frameAt(0.05)
    }
  })
})
