import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { glycolysisLedger, glycolysisReactions as glycolysis, matchesFilter, pdhEquation, tcaBalance, tcaReactions as tca } from './respirationPathways'
import { GlycolysisMap } from './components/GlycolysisMap'
import { PyruvateOxidationMap } from './components/PyruvateOxidationMap'
import { TcaCycleMap } from './components/TcaCycleMap'

describe('expanded glycolysis: reaction sites and glucose accounting', () => {
  it('has the canonical ten enzymes in reaction order', () => {
    expect(glycolysis.map(r => r.enzyme)).toEqual(['Hexokinase', 'Phosphoglucose isomerase', 'Phosphofructokinase-1 (PFK-1)', 'Aldolase', 'Triose phosphate isomerase', 'Glyceraldehyde-3-phosphate dehydrogenase (GAPDH)', 'Phosphoglycerate kinase', 'Phosphoglycerate mutase', 'Enolase', 'Pyruvate kinase'])
    expect(glycolysis.filter(r => r.committed).map(r => r.id)).toEqual([3])
  })
  it('connects intermediates, preserving six carbons through the triose split', () => {
    for (const i of [0, 1, 2, 4, 5, 6, 7, 8]) expect(glycolysis[i].to).toEqual(glycolysis[i + 1].from)
    expect(glycolysis[3].from.carbon).toBe(glycolysis[3].to.carbon + glycolysis[4].from.carbon)
    expect(glycolysis[4].from.short).toBe('DHAP')
    expect(glycolysis[4].to.short).toBe('G3P')
    for (const r of glycolysis.slice(5)) expect(r.from.carbon).toBe(3)
    expect(2 * glycolysis[9].to.carbon).toBe(glycolysis[0].from.carbon)
  })
  it('invests at HK/PFK, recovers at PGK/PK, and conserves the ATP ledger', () => {
    expect(glycolysis.filter(r => r.atp < 0).map(r => [r.id, r.atp])).toEqual([[1, -1], [3, -1]])
    expect(glycolysis.filter(r => r.atp > 0).map(r => [r.id, r.atp])).toEqual([[7, 2], [10, 2]])
    expect(glycolysisLedger).toEqual({ invested: 2, produced: 4, net: 2 })
    expect(glycolysis.filter(r => r.slp).map(r => r.id)).toEqual([7, 10])
  })
  it('assigns NADH only to GAPDH and irreversibility only to three sites', () => {
    expect(glycolysis.filter(r => r.nadh).map(r => [r.id, r.nadh])).toEqual([[6, 2]])
    expect(glycolysis.filter(r => r.irreversible).map(r => r.id)).toEqual([1, 3, 10])
    expect(glycolysis.filter(r => matchesFilter(r, 'atp')).map(r => r.id)).toEqual([1, 3, 7, 10])
    expect(glycolysis.filter(r => matchesFilter(r, 'nadh')).map(r => r.id)).toEqual([6])
  })
  it('renders the phosphate-transfer insets, payoff multiplicity, NADH and water events', () => {
    const html = renderToStaticMarkup(<GlycolysisMap />)
    for (const text of ['2 NAD⁺ + 2 Pi', '2 NADH + 2 H⁺', '2 H₂O release', '모든 물질·반응 ×2', 'Committed step', 'substrate-level phosphorylation', '1,3-BPG의 인산기가 ADP로 전달', 'PEP의 인산기가 ADP로 전달', '심화 · 해당과정의 조절']) expect(html).toContain(text)
    expect(html).toContain('반응 중간체의 인산기가 ADP에 직접 전달')
  })
})
describe('PDH: coupled oxidative decarboxylation', () => {
  it('balances pyruvate, CoA, NAD and carbon products at both scales', () => {
    expect(pdhEquation(1)).toBe('Pyruvate + CoA-SH + NAD⁺ → Acetyl-CoA + CO₂ + NADH + H⁺')
    expect(pdhEquation(2)).toBe('2 Pyruvate + 2 CoA-SH + 2 NAD⁺ → 2 Acetyl-CoA + 2 CO₂ + 2 NADH + 2 H⁺')
  })
  it('explains the conceptual decomposition and all five cofactors', () => {
    const html = renderToStaticMarkup(<PyruvateOxidationMap />)
    for (const text of ['Decarboxylation', 'Acetyl transfer to CoA', 'Cofactor reoxidation', '교육적 분해', 'TPP · lipoamide · CoA · FAD · NAD⁺', 'E1:', 'E2:', 'E3:', '×2 · Glucose 1', 'ATP는 직접 생성하지 않습니다']) expect(html).toContain(text)
  })
})
describe('TCA: a closed eight-reaction cycle, with site-specific products', () => {
  it('connects all eight intermediates and closes at OAA', () => {
    expect(tca.map(r => r.from.short)).toEqual(['Oxaloacetate', 'Citrate', 'Isocitrate', 'α-Ketoglutarate', 'Succinyl-CoA', 'Succinate', 'Fumarate', 'Malate'])
    expect(tca.map(r => r.enzyme)).toEqual(['Citrate synthase', 'Aconitase', 'Isocitrate dehydrogenase', 'α-Ketoglutarate dehydrogenase complex', 'Succinyl-CoA synthetase', 'Succinate dehydrogenase', 'Fumarase', 'Malate dehydrogenase'])
    tca.forEach((r, i) => expect(r.to).toEqual(tca[(i + 1) % 8].from))
  })
  it('conserves carbon at every reaction, including acetyl entry and both CO₂ exits', () => {
    tca.forEach(r => expect(r.from.carbon + (r.id === 1 ? 2 : 0)).toBe(r.to.carbon + r.co2))
    expect(tca.filter(r => r.co2).map(r => r.id)).toEqual([3, 4])
    expect(tca.map(r => r.from.carbon)).toEqual([4, 6, 6, 5, 4, 4, 4, 4])
  })
  it('makes NADH at IDH, α-KGDH, MDH; GTP at SCS; and QH₂ via SDH', () => {
    expect(tca.filter(r => r.nadh).map(r => r.id)).toEqual([3, 4, 8])
    expect(tca.filter(r => r.gtp).map(r => r.id)).toEqual([5])
    expect(tca.filter(r => r.qh2).map(r => r.id)).toEqual([6])
    expect(tca[4].slp).toBe(true)
    expect(tca[5].complexII).toBe(true)
    expect(tca[5].note).toContain('H⁺를 펌프하지 않습니다')
  })
  it('doubles only the turn balance, never intermediate carbon counts', () => {
    expect(tcaBalance(1)).toEqual({ nadh: 3, co2: 2, qh2: 1, gtp: 1 })
    expect(tcaBalance(2)).toEqual({ nadh: 6, co2: 4, qh2: 2, gtp: 2 })
    expect(tca[0].from.carbon).toBe(4)
  })
  it('highlights only product-generating reactions for each filter', () => {
    for (const [filter, ids] of [['nadh', [3, 4, 8]], ['co2', [3, 4]], ['fad', [6]], ['gtp', [5]]] as const) expect(tca.filter(r => matchesFilter(r, filter)).map(r => r.id)).toEqual(ids)
  })
  it('renders one-turn default, enzyme-bound FAD, membrane site and carbon-fate caveats', () => {
    const html = renderToStaticMarkup(<TcaCycleMap onOpenEtc={() => {}} />)
    for (const text of ['aria-pressed="true">1 turn', 'FAD-linked reducing equivalent', '효소 결합 FADH₂', '전자가 Q로 전달', 'ETC Complex II', 'inner mitochondrial membrane', 'H⁺ 펌프 작용은 없습니다', 'OAA regenerated', '첫 회전에서 방출되는 CO₂', 'nucleoside diphosphate kinase']) expect(html.toLowerCase()).toContain(text.toLowerCase())
  })
})
