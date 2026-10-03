// Quantities in glycolysis are per glucose; TCA quantities are per acetyl-CoA.
// Sources and deliberate omissions: docs/SCIENCE_VALIDATION.md.
export type PathwayFilter = 'all' | 'carbon' | 'atp' | 'nadh' | 'irreversible' | 'fad' | 'co2' | 'gtp'
export type Metabolite = { short: string; name: string; carbon: number }
export type Reaction = {
  id: number; enzyme: string; lines: string[]; from: Metabolite; to: Metabolite
  atp: number; nadh: number; co2: number; qh2: number; gtp: number
  irreversible?: boolean; committed?: boolean; slp?: boolean; complexII?: boolean
  event?: string; note: string
}
const m = (short: string, name: string, carbon: number): Metabolite => ({ short, name, carbon })
const base = { atp: 0, nadh: 0, co2: 0, qh2: 0, gtp: 0 }
const glucose = m('Glucose', '포도당 · Glucose', 6)
const g6p = m('G6P', '포도당-6-인산 · Glucose-6-phosphate', 6)
const f6p = m('F6P', '과당-6-인산 · Fructose-6-phosphate', 6)
const fbp = m('F1,6BP', '과당-1,6-이중인산 · Fructose-1,6-bisphosphate', 6)
const g3p = m('G3P', 'Glyceraldehyde-3-phosphate', 3)
const dhap = m('DHAP', 'Dihydroxyacetone phosphate', 3)
const bpg = m('1,3-BPG', '1,3-bisphosphoglycerate', 3)
const pg3 = m('3-PG', '3-phosphoglycerate', 3)
const pg2 = m('2-PG', '2-phosphoglycerate', 3)
const pep = m('PEP', 'Phosphoenolpyruvate', 3)
const pyruvate = m('Pyruvate', '피루브산 · Pyruvate', 3)
export const glycolysisReactions: Reaction[] = [
  { ...base, id: 1, enzyme: 'Hexokinase', lines: ['Hexokinase'], from: glucose, to: g6p, atp: -1, irreversible: true, event: 'ATP → ADP · −1 ATP', note: 'ATP의 인산기를 포도당에 전달합니다. 세포 내 조건에서 사실상 비가역적입니다.' },
  { ...base, id: 2, enzyme: 'Phosphoglucose isomerase', lines: ['Phosphoglucose isomerase'], from: g6p, to: f6p, note: '6C 골격을 유지하면서 알도스가 케토스로 이성질화됩니다.' },
  { ...base, id: 3, enzyme: 'Phosphofructokinase-1 (PFK-1)', lines: ['Phosphofructokinase-1 (PFK-1)'], from: f6p, to: fbp, atp: -1, irreversible: true, committed: true, event: 'ATP → ADP · −1 ATP', note: '해당과정으로 향하는 committed step입니다. 여러 조절 지점 중 하나이며 모든 조직·조건에서 하나의 절대적인 속도 결정 단계라는 뜻은 아닙니다.' },
  { ...base, id: 4, enzyme: 'Aldolase', lines: ['Aldolase'], from: fbp, to: g3p, note: '6C F1,6BP가 3C G3P 1분자와 3C DHAP 1분자로 나뉩니다. 두 분자가 즉시 모두 G3P가 되는 것은 아닙니다.' },
  { ...base, id: 5, enzyme: 'Triose phosphate isomerase', lines: ['Triose phosphate isomerase'], from: dhap, to: g3p, note: 'DHAP가 G3P로 전환됩니다. 원래의 G3P와 합쳐 2 × G3P가 다음 단계로 갑니다.' },
  { ...base, id: 6, enzyme: 'Glyceraldehyde-3-phosphate dehydrogenase (GAPDH)', lines: ['Glyceraldehyde-3-phosphate', 'dehydrogenase (GAPDH)'], from: g3p, to: bpg, nadh: 2, event: '2 NAD⁺ + 2 Pi → 2 NADH + 2 H⁺', note: 'G3P의 산화와 무기 인산(Pi)의 첨가가 결합됩니다. 이 단계에서 NADH가 만들어지며 ATP를 소비하지 않습니다.' },
  { ...base, id: 7, enzyme: 'Phosphoglycerate kinase', lines: ['Phosphoglycerate kinase'], from: bpg, to: pg3, atp: 2, slp: true, event: '2 ADP → 2 ATP · +2 ATP', note: '1,3-BPG의 인산기가 ADP에 직접 전달됩니다. G3P 두 분자에서 각각 ATP 1개를 얻습니다.' },
  { ...base, id: 8, enzyme: 'Phosphoglycerate mutase', lines: ['Phosphoglycerate mutase'], from: pg3, to: pg2, note: '인산기의 위치가 3번 탄소에서 2번 탄소로 바뀝니다.' },
  { ...base, id: 9, enzyme: 'Enolase', lines: ['Enolase'], from: pg2, to: pep, event: '2 H₂O release · 물 방출', note: '물 두 분자가 빠져나가며 인산기 전달 잠재력이 높은 PEP가 형성됩니다.' },
  { ...base, id: 10, enzyme: 'Pyruvate kinase', lines: ['Pyruvate kinase'], from: pep, to: pyruvate, atp: 2, slp: true, irreversible: true, event: '2 ADP → 2 ATP · +2 ATP', note: 'PEP의 인산기가 ADP로 직접 전달됩니다. 세포 내 조건에서 사실상 비가역적이며 조절을 받습니다.' },
]
export const glycolysisLedger = glycolysisReactions.reduce((sum, r) => ({
  invested: sum.invested + Math.max(-r.atp, 0), produced: sum.produced + Math.max(r.atp, 0), net: sum.net + r.atp,
}), { invested: 0, produced: 0, net: 0 })

const oaa = m('Oxaloacetate', '옥살로아세트산 · Oxaloacetate (OAA)', 4)
const citrate = m('Citrate', '시트르산 · Citrate', 6)
const isocitrate = m('Isocitrate', '아이소시트르산 · Isocitrate', 6)
const akg = m('α-Ketoglutarate', 'α-Ketoglutarate (α-KG)', 5)
const succinyl = m('Succinyl-CoA', 'Succinyl-CoA', 4)
const succinate = m('Succinate', '숙신산 · Succinate', 4)
const fumarate = m('Fumarate', '푸마르산 · Fumarate', 4)
const malate = m('Malate', '말산 · Malate', 4)
export const tcaReactions: Reaction[] = [
  { ...base, id: 1, enzyme: 'Citrate synthase', lines: ['Citrate synthase'], from: oaa, to: citrate, event: '+ Acetyl-CoA (2C) + H₂O → CoA-SH 방출', note: 'OAA 4C와 acetyl-CoA의 아세틸기 2C가 결합해 citrate 6C가 됩니다. CoA-SH가 방출됩니다.' },
  { ...base, id: 2, enzyme: 'Aconitase', lines: ['Aconitase'], from: citrate, to: isocitrate, note: '탈수와 재수화를 거쳐 이성질화합니다. cis-aconitate 중간 단계는 지도에서 생략합니다.' },
  { ...base, id: 3, enzyme: 'Isocitrate dehydrogenase', lines: ['Isocitrate', 'dehydrogenase'], from: isocitrate, to: akg, nadh: 1, co2: 1, note: 'Oxidative decarboxylation · 산화적 탈탄산. 탄소 하나가 CO₂로 방출되고 NAD⁺가 NADH로 환원됩니다. 이 회로는 NAD⁺ 의존성 효소를 표시합니다.' },
  { ...base, id: 4, enzyme: 'α-Ketoglutarate dehydrogenase complex', lines: ['α-Ketoglutarate', 'dehydrogenase complex'], from: akg, to: succinyl, nadh: 1, co2: 1, event: '+ CoA-SH', note: 'Oxidative decarboxylation · 산화적 탈탄산. CO₂와 NADH가 생기며 CoA가 결합합니다. PDH와 유사한 보조인자 원리를 이용합니다.' },
  { ...base, id: 5, enzyme: 'Succinyl-CoA synthetase', lines: ['Succinyl-CoA synthetase'], from: succinyl, to: succinate, gtp: 1, slp: true, event: 'CoA-SH 방출', note: 'GDP + Pi → GTP: 기질수준 인산화입니다. 여기서는 GDP형 효소를 표시합니다. ADP형 동위효소도 있으며 GTP는 nucleoside diphosphate kinase를 통해 ATP 상당량으로 연결될 수 있습니다.' },
  { ...base, id: 6, enzyme: 'Succinate dehydrogenase', lines: ['Succinate', 'dehydrogenase'], from: succinate, to: fumarate, qh2: 1, complexII: true, note: '효소 결합 FAD → 효소 결합 FADH₂ → 전자 전달 → QH₂. FAD는 효소에 남아 재생됩니다. ETC Complex II는 H⁺를 펌프하지 않습니다.' },
  { ...base, id: 7, enzyme: 'Fumarase', lines: ['Fumarase'], from: fumarate, to: malate, event: '+ H₂O', note: '물의 첨가로 fumarate가 malate로 바뀝니다.' },
  { ...base, id: 8, enzyme: 'Malate dehydrogenase', lines: ['Malate', 'dehydrogenase'], from: malate, to: oaa, nadh: 1, note: 'Malate가 산화되어 NADH가 생성되고 OAA가 재생됩니다. OAA는 다음 아세틸기를 받아들일 수 있습니다.' },
]
export function tcaBalance(turns: 1 | 2) {
  return tcaReactions.reduce((sum, r) => ({ nadh: sum.nadh + r.nadh * turns, co2: sum.co2 + r.co2 * turns, qh2: sum.qh2 + r.qh2 * turns, gtp: sum.gtp + r.gtp * turns }), { nadh: 0, co2: 0, qh2: 0, gtp: 0 })
}
export function matchesFilter(r: Reaction, filter: PathwayFilter) {
  if (filter === 'all' || filter === 'carbon') return true
  if (filter === 'irreversible') return !!r.irreversible
  if (filter === 'fad') return r.qh2 > 0
  return r[filter] !== 0
}
export function pdhEquation(count: 1 | 2) {
  const n = count === 2 ? '2 ' : ''
  return `${n}Pyruvate + ${n}CoA-SH + ${n}NAD⁺ → ${n}Acetyl-CoA + ${n}CO₂ + ${n}NADH + ${n}H⁺`
}
