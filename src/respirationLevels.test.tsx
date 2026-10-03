import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Respiration } from './Respiration'
import { BasicGlycolysis, BasicPyruvateOxidation, BasicTca } from './components/BasicRespirationPathways'
import { PyruvateOxidationMap } from './components/PyruvateOxidationMap'
import { glycolysisReactions, tcaReactions } from './respirationPathways'

describe('basic and advanced respiration layers', () => {
  it('starts in basic mode without mounting the advanced reaction maps or leaking jargon through the summary', () => {
    const html = renderToStaticMarkup(<Respiration mark={() => {}} />)
    expect(html).toContain('data-mode="basic"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('+ 심화')
    for (const text of ['reaction-navigation', 'FAD-linked', 'QH₂', 'enzyme-bound', 'Glucose', 'Pyruvate', ...glycolysisReactions.map(r => r.enzyme)]) expect(html).not.toContain(text)
  })
  it('teaches the glycolysis carbon split and full ATP accounting with four events', () => {
    const html = renderToStaticMarkup(<BasicGlycolysis />)
    expect(html.match(/<li>/g)).toHaveLength(4)
    for (const text of ['세포질', '두 분자의 피루브산', 'ATP 2개 사용', 'ATP 4개 생성', '순 ATP 2', 'NADH 2개 생성', '기질수준 인산화']) expect(html).toContain(text)
    for (const text of ['G6P', 'F6P', 'F1,6BP', 'DHAP', '1,3-BPG', '3-PG', '2-PG', 'PEP', ...glycolysisReactions.map(r => r.enzyme)]) expect(html).not.toContain(text)
  })
  it('keeps basic PDH coupled and uses the two-pyruvate glucose balance', () => {
    const html = renderToStaticMarkup(<BasicPyruvateOxidation />)
    for (const text of ['3C', '2C', '복합체 안에서 여러 반응이 서로 연결', '아세틸-CoA 2분자 + CO₂ 2개 + NADH 2개', 'ATP를 직접 생성하지 않습니다']) expect(html).toContain(text)
    for (const text of ['E1', 'E2', 'E3', 'TPP', 'lipoamide', 'FAD', 'Cofactor']) expect(html).not.toContain(text)
  })
  it('defaults TCA to one turn with textbook carrier and ATP-equivalent wording', () => {
    const html = renderToStaticMarkup(<BasicTca />)
    expect(html.match(/<li>/g)).toHaveLength(4)
    for (const text of ['aria-pressed="true">아세틸-CoA 1분자', 'FADH₂ 1개', 'NADH 3개', 'CO₂ 2개 방출', 'ATP 1개 상당 생성', '4C 물질 재생', '일부 세포에서는 GTP 형태로 먼저 생성']) expect(html).toContain(text)
    for (const text of ['FAD-linked', 'QH₂', 'enzyme-bound', 'isoform', ...tcaReactions.map(r => r.enzyme)]) expect(html).not.toContain(text)
  })
  it('presents the advanced PDH mechanism in E1/E2/E3 order, with NADH at regeneration', () => {
    const html = renderToStaticMarkup(<PyruvateOxidationMap />)
    const e1 = html.indexOf('E1 · Decarboxylation')
    const e2 = html.indexOf('E2 · Acetyl transfer to CoA')
    const e3 = html.indexOf('E3 · Cofactor reoxidation')
    expect(e1).toBeGreaterThan(-1)
    expect(e2).toBeGreaterThan(e1)
    expect(e3).toBeGreaterThan(e2)
    expect(html.indexOf('1 NADH 생성')).toBeGreaterThan(e3)
    expect(html).toContain('NADH는 이 보조인자 재생 과정의 뒤쪽에서 생성')
  })
})
