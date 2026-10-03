import { describe, expect, it } from 'vitest'
import { coupledEnergy, defaultGradient, F, normal, presets, protonEnergy, relativeState, steadyState } from './science'

describe('proton electrochemical energy, A → B', () => {
  it('zero gradient has zero energy and no preferred direction', () => {
    expect(protonEnergy({ pHA: 7, pHB: 7, deltaPsiMv: 0, temperatureC: 25 })).toEqual({ chemical: 0, electrical: 0, total: 0, direction: 'equilibrium' })
  })
  it('ΔpH only: pH 6 → 7 releases about 5.71 kJ/mol at 25 °C', () => {
    const e = protonEnergy({ pHA: 6, pHB: 7, deltaPsiMv: 0, temperatureC: 25 })
    expect(e.chemical).toBeCloseTo(-5.708, 2)
    expect(e.electrical).toBe(0)
    expect(e.direction).toBe('A→B')
  })
  it('Δψ only converts mV and J correctly', () => {
    const e = protonEnergy({ pHA: 7, pHB: 7, deltaPsiMv: -100, temperatureC: 25 })
    expect(e.total).toBeCloseTo(-9.648533212, 7)
    expect(e.direction).toBe('A→B')
  })
  it('a positive destination voltage resists proton entry', () => {
    expect(protonEnergy({ pHA: 7, pHB: 7, deltaPsiMv: 100, temperatureC: 25 }).direction).toBe('B→A')
  })
  it('opposing contributions can reverse chemical driving force', () => {
    const e = protonEnergy({ pHA: 6, pHB: 7, deltaPsiMv: 100, temperatureC: 25 })
    expect(e.chemical).toBeLessThan(0)
    expect(e.electrical).toBeGreaterThan(0)
    expect(e.total).toBeCloseTo(3.941, 2)
    expect(e.direction).toBe('B→A')
  })
  it('equal opposing contributions give electrochemical equilibrium', () => {
    const chemical = protonEnergy({ ...defaultGradient, deltaPsiMv: 0 }).chemical
    expect(protonEnergy({ ...defaultGradient, deltaPsiMv: -chemical * 1e6 / F }).direction).toBe('equilibrium')
  })
  it('reversing both pH and voltage reverses energy', () => {
    const e = protonEnergy(defaultGradient)
    expect(protonEnergy({ ...defaultGradient, pHA: 8, pHB: 7, deltaPsiMv: 150 }).total).toBeCloseTo(-e.total, 9)
  })
  it('temperature changes the chemical term, not the electrical term', () => {
    const cold = protonEnergy(defaultGradient), warm = protonEnergy({ ...defaultGradient, temperatureC: 37 })
    expect(warm.chemical / cold.chemical).toBeCloseTo(310.15 / 298.15, 9)
    expect(warm.electrical).toBe(cold.electrical)
  })
  it('rejects invalid temperature and nonfinite parameters', () => {
    expect(() => protonEnergy({ ...defaultGradient, temperatureC: -273.15 })).toThrow(RangeError)
    expect(() => protonEnergy({ ...defaultGradient, pHA: NaN })).toThrow(RangeError)
  })
})
describe('ATP thermodynamic coupling', () => {
  it('adds positive synthesis requirement to downhill proton transport', () => expect(coupledEnergy(-20, 3, 50)).toBe(-10))
  it('is unfavorable without sufficient driving force', () => expect(coupledEnergy(-10, 3, 50)).toBe(20))
  it('has a zero-energy boundary', () => expect(coupledEnergy(-20, 2.5, 50)).toBe(0))
  it('does not make ATP energetically free at zero gradient', () => expect(coupledEnergy(0, 4, 50)).toBe(50))
  it('rejects invalid ratios', () => expect(() => coupledEnergy(-20, 0, 50)).toThrow(RangeError))
})
describe('limited steady-state teaching model', () => {
  it('normalizes normal to 100 for every indicator', () => expect(relativeState(normal)).toEqual({ oxygen: 100, gradient: 100, atp: 100 }))
  it('inhibition raises gradient and lowers oxygen and ATP', () => {
    const v = relativeState(presets.inhibited.condition)
    expect(v.gradient).toBeGreaterThan(100); expect(v.oxygen).toBeLessThan(100); expect(v.atp).toBeLessThan(100)
  })
  it('leak raises oxygen and lowers gradient and ATP with sufficient supply', () => {
    const v = relativeState(presets.leak.condition)
    expect(v.gradient).toBeLessThan(100); expect(v.oxygen).toBeGreaterThan(100); expect(v.atp).toBeLessThan(100)
  })
  it('input suppression lowers all indicators', () => { for (const v of Object.values(relativeState(presets.reduced.condition))) expect(v).toBeLessThan(100) })
  it('stopped input has zero steady-state gradient, oxygen and ATP', () => expect(steadyState(presets.stopped.condition)).toEqual({ gradient: 0, oxygen: 0, atp: 0 }))
  it('zero ADP prevents oxidative ATP synthesis', () => expect(steadyState({ ...normal, adp: 0 }).atp).toBe(0))
  it('zero synthase activity prevents oxidative ATP synthesis', () => expect(steadyState({ ...normal, synthase: 0 }).atp).toBe(0))
  it('steady state balances pumping with proton return for all presets', () => {
    for (const { condition: c } of Object.values(presets)) {
      const v = steadyState(c)
      expect(v.oxygen).toBeCloseTo(c.leak * v.gradient + v.atp, 10)
    }
  })
  it('the control domain produces finite nonnegative values and fits common graph scale', () => {
    for (const input of [0, 0.5, 1]) for (const synthase of [0, 0.5, 1]) for (const adp of [0, 0.5, 1]) for (const leak of [0.02, 0.12, 2]) {
      for (const v of Object.values(relativeState({ input, synthase, adp, leak }))) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(220) }
    }
  })
  it('rejects outside-domain inputs and a nonunique closed-system equilibrium', () => {
    expect(() => steadyState({ ...normal, leak: -1 })).toThrow(RangeError)
    expect(() => steadyState({ input: 0, leak: 0, synthase: 0, adp: 0 })).toThrow(RangeError)
  })
})
