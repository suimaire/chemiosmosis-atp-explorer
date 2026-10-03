import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Explorer } from './Explorer'
import { CouplingLesson, GradientLesson } from './components/explorer/EnergyLessons'
import { ConceptMembrane } from './components/explorer/ConceptMembrane'
import { defaultGradient } from './science'

const noop = () => {}
describe('early Explorer teaching structure', () => {
  it('merges the first two investigations into six numbered destinations', () => {
    const html = renderToStaticMarkup(<Explorer />)
    expect(html.match(/<nav class="module-nav"[\s\S]*?<\/nav>/)![0].match(/<button/g)).toHaveLength(6)
    expect(html).toContain('00 · 전자전달과 H⁺ 축적')
    expect(html).toContain('단계 00 / 05')
    expect(html).not.toContain('어디에 축적되는가?')
    expect(html).not.toContain('전자와 H⁺는 같은 길을 가는가?')
    expect(html).toContain('같은 길을 이동하지 않습니다.')
  })
  it('provides an accessible single 3D canvas and a matching fallback for path toggles', () => {
    const visible = renderToStaticMarkup(<ConceptMembrane paths={{ electrons: true, protons: true, atp: true }} />)
    expect(visible.match(/<canvas/g)).toHaveLength(1)
    for (const id of ['electron-path','proton-path','atp-path']) expect(visible).toContain(`data-testid="${id}"`)
    const hidden = renderToStaticMarkup(<ConceptMembrane paths={{ electrons: false, protons: false, atp: false }} />)
    for (const id of ['electron-path','proton-path','atp-path']) expect(hidden).not.toContain(`data-testid="${id}"`)
    expect(visible).not.toContain('Complex I')
  })
  it('puts concepts before controls and results before the collapsed semantic equation', () => {
    const html = renderToStaticMarkup(<GradientLesson gradient={defaultGradient} setGradient={noop} />)
    expect(html.indexOf('contribution-cards')).toBeLessThan(html.indexOf('controls-grid'))
    expect(html.indexOf('class="metrics"')).toBeLessThan(html.indexOf('<details'))
    expect(html).toContain('pH<sub>A</sub>')
    expect(html).toContain('ψ<sub>B</sub>')
    expect(html).toContain('ΔG<sub>H<sup>+</sup></sub>')
    expect(html).not.toMatch(/pH_|ψ_|ΔG_|<details[^>]* open/)
    const basic = html.slice(0, html.indexOf('<details'))
    for (const label of ['A 구획의 pH', 'B 구획의 pH', '막 양쪽 전위 차', '전체 기울기 에너지']) expect(basic).toContain(label)
    expect(basic).not.toMatch(/pH<sub>|Δψ|ψ<sub>/)
  })
  it('explains gradient release, coupling, energy comparison, and outcome in order', () => {
    const html = renderToStaticMarkup(<CouplingLesson gradient={defaultGradient} ratio={3.3} requirement={50} setRatio={noop} setRequirement={noop} onGradient={noop} />)
    const stages = ['H⁺가 기울기를 따라 이동하면', '여러 H⁺의 이동은 ATP synthase', '얻는 에너지와 필요한 에너지 비교하기', '결합 결과']
    for (let i=1; i<stages.length; i++) expect(html.indexOf(stages[i])).toBeGreaterThan(html.indexOf(stages[i-1]))
    expect(html).toContain('data-outcome="sufficient"')
    expect(html).toContain('ATP 합성에 필요한 에너지 · 예시 조건')
    expect(html).toContain('이 조건에서는 H⁺ 기울기가 ATP 합성을 구동할 만큼 충분합니다.')
  })
  it('does not misrepresent uphill proton transfer as available energy', () => {
    const html = renderToStaticMarkup(<CouplingLesson gradient={{ ...defaultGradient, pHA: 8, pHB: 7, deltaPsiMv: 100 }} ratio={3} requirement={50} setRatio={noop} setRequirement={noop} onGradient={noop} />)
    expect(html).toContain('style="width:0%"')
    expect(html).toContain('data-active="false"')
    expect(html).toContain('data-outcome="insufficient"')
  })
  it('defaults to basic without molar calculations or a per-particle energy claim', () => {
    const html = renderToStaticMarkup(<CouplingLesson gradient={defaultGradient} ratio={3.3} requirement={50} setRatio={noop} setRequirement={noop} onGradient={noop} />)
    expect(html).toContain('data-mode="basic"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('+ 심화')
    expect(html).not.toMatch(/3\.3|H⁺ 1개당|ΔG|H⁺\/ATP|kJ·mol⁻¹|type="range"/)
  })
  it('does not call an equilibrium cycle sufficient or animate ATP synthesis', () => {
    const html = renderToStaticMarkup(<CouplingLesson gradient={{ ...defaultGradient, pHA: 7, pHB: 7, deltaPsiMv: 0 }} ratio={3.3} requirement={0} setRatio={noop} setRequirement={noop} onGradient={noop} />)
    expect(html).toContain('data-outcome="equilibrium"')
    expect(html).toContain('<strong>부족</strong>')
    expect(html).toContain('data-active="false"')
    expect(html).toContain('순 구동력이 없습니다.')
  })
})
