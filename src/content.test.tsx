import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { photoFacts, respirationSteps, respirationQuestions, photosynthesisQuestions } from './content'
import { Membrane, compartments } from './components/Membrane'
import { Respiration } from './Respiration'
import { Photosynthesis, LightFlow } from './Photosynthesis'

describe('scientific content invariants', () => {
  it('locates glycolysis in cytosol and pyruvate oxidation in matrix', () => {
    expect(respirationSteps[0].location).toBe('세포질')
    expect(respirationSteps[1].location).toBe('미토콘드리아 기질')
  })
  it('preserves carbon and carrier totals for one glucose', () => {
    expect(respirationSteps[0].output).toContain('순 ATP 2')
    expect(respirationSteps[1].output).toContain('CO₂ 2')
    expect(respirationSteps[2].output).toBe('CO₂ 4 · NADH 6 · FADH₂ 2 · ATP 2 상당')
  })
  it('explicitly excludes Complex II pumping and locates O₂ use at IV', () => {
    expect(respirationSteps[3].detail).toContain('Complex II는 전자를 전달하지만 H⁺를 펌프하지 않습니다')
    expect(respirationSteps[3].detail).toContain('O₂는 Complex IV에서 최종 전자수용체')
  })
  it('locates Calvin cycle in the stroma', () => expect(photoFacts.calvinLocation).toBe('Stroma'))
  it('linear flow uses both photosystems and generates NADPH and O₂', () => expect(photoFacts.linear).toEqual({ psii: true, psi: true, oxygen: true, nadph: true, pmf: true }))
  it('cyclic flow omits PSII and net NADPH/O₂ but supports pmf', () => expect(photoFacts.cyclic).toEqual({ psii: false, psi: true, oxygen: false, nadph: false, pmf: true }))
  it('specifies the correct return compartments', () => {
    expect(compartments.mito.direction).toBe('막사이공간 → 기질')
    expect(compartments.plant.direction).toBe('Lumen → Stroma')
  })
  it('renders Complex II with a no-pump label and distinct carriers', () => {
    const html = renderToStaticMarkup(<Membrane context="mito" />)
    for (const label of ['H⁺ 펌프 아님', 'NADH', 'FADH₂ 유래', 'cyt c', 'O₂ → H₂O', 'Complex I', 'Complex III', 'Complex IV']) expect(html).toContain(label)
  })
  it('cyclic graphic does not render PSII water splitting or NADP reductase', () => {
    const html = renderToStaticMarkup(<LightFlow cyclic />)
    expect(html).not.toContain('2 H₂O →')
    expect(html).not.toContain('NADP⁺ reductase')
    expect(html).toContain('NADPH 순생성 없음')
  })
  it('linear graphic contains water oxidation and NADPH endpoint', () => {
    const html = renderToStaticMarkup(<LightFlow cyclic={false} />)
    expect(html).toContain('2 H₂O → O₂ + 4 H⁺ + 4 e⁻')
    expect(html).toContain('NADP⁺ reductase')
  })
  it('rendered lessons retain teaching distinctions and the G3P precursor', () => {
    expect(renderToStaticMarkup(<Respiration mark={() => {}} />)).toContain('ATP 합성효소를 이용하는 화학삼투와는 다릅니다')
    expect(renderToStaticMarkup(<Photosynthesis mark={() => {}} />)).toContain('탄수화물의 전구체')
  })
  it('each quiz has three valid, explained answers', () => {
    for (const questions of [respirationQuestions, photosynthesisQuestions]) {
      expect(questions).toHaveLength(3)
      for (const q of questions) { expect(q.options[q.answer]).toBeTruthy(); expect(q.explanation.length).toBeGreaterThan(30) }
    }
  })
})
