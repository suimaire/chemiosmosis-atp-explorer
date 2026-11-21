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
const glucose = m('Glucose', '포도당 / Glucose', 6)
const g6p = m('G6P', '포도당-6-인산 / Glucose-6-phosphate', 6)
const f6p = m('F6P', '과당-6-인산 / Fructose-6-phosphate', 6)
const fbp = m('F1,6BP', '과당-1,6-이중인산 / Fructose-1,6-bisphosphate', 6)
const g3p = m('G3P', 'Glyceraldehyde-3-phosphate', 3)
const dhap = m('DHAP', 'Dihydroxyacetone phosphate', 3)
const bpg = m('1,3-BPG', '1,3-bisphosphoglycerate', 3)
const pg3 = m('3-PG', '3-phosphoglycerate', 3)
const pg2 = m('2-PG', '2-phosphoglycerate', 3)
const pep = m('PEP', 'Phosphoenolpyruvate', 3)
const pyruvate = m('Pyruvate', '피루브산 / Pyruvate', 3)
export const glycolysisReactions: Reaction[] = [
  { ...base, id: 1, enzyme: 'Hexokinase', lines: ['Hexokinase'], from: glucose, to: g6p, atp: -1, irreversible: true, event: 'ATP → ADP (−1 ATP)', note: 'ATP의 인산기를 포도당으로 전달한다. 세포 내 조건에서 사실상 비가역적인 반응이다.' },
  { ...base, id: 2, enzyme: 'Phosphoglucose isomerase', lines: ['Phosphoglucose isomerase'], from: g6p, to: f6p, note: '6탄소 골격을 유지하면서 알도스가 케토스로 이성질화된다.' },
  { ...base, id: 3, enzyme: 'Phosphofructokinase-1 (PFK-1)', lines: ['Phosphofructokinase-1 (PFK-1)'], from: f6p, to: fbp, atp: -1, irreversible: true, committed: true, event: 'ATP → ADP (−1 ATP)', note: 'PFK-1이 과당-6-인산을 인산화하면 탄소 골격이 해당과정으로 들어선다. 이 반응은 해당과정에 특이적인 첫 비가역 단계이다.' },
  { ...base, id: 4, enzyme: 'Aldolase', lines: ['Aldolase'], from: fbp, to: g3p, note: '과당-1,6-이중인산(6C)이 G3P와 DHAP(각 3C)로 갈라진다.' },
  { ...base, id: 5, enzyme: 'Triose phosphate isomerase', lines: ['Triose phosphate isomerase'], from: dhap, to: g3p, note: 'DHAP가 G3P로 전환된다. 포도당 한 분자에서 생긴 G3P 두 분자 모두 이후 반응을 거친다.' },
  { ...base, id: 6, enzyme: 'Glyceraldehyde-3-phosphate dehydrogenase (GAPDH)', lines: ['Glyceraldehyde-3-phosphate', 'dehydrogenase (GAPDH)'], from: g3p, to: bpg, nadh: 2, event: '2 NAD⁺ + 2 Pi → 2 NADH + 2 H⁺', note: 'G3P가 산화될 때 NAD⁺가 환원되고, 무기 인산(Pi)이 첨가되어 1,3-BPG가 생성된다.' },
  { ...base, id: 7, enzyme: 'Phosphoglycerate kinase', lines: ['Phosphoglycerate kinase'], from: bpg, to: pg3, atp: 2, slp: true, event: '2 ADP → 2 ATP (+2 ATP)', note: '1,3-BPG에서 ADP로 인산기가 전달된다. 1,3-BPG 한 분자당 ATP 한 분자가 생성된다.' },
  { ...base, id: 8, enzyme: 'Phosphoglycerate mutase', lines: ['Phosphoglycerate mutase'], from: pg3, to: pg2, note: '인산기의 위치가 3번 탄소에서 2번 탄소로 바뀐다.' },
  { ...base, id: 9, enzyme: 'Enolase', lines: ['Enolase'], from: pg2, to: pep, event: '2 H₂O release / 물 방출', note: '2-포스포글리세르산 한 분자에서 물 한 분자가 빠져나가 인산기 전달 잠재력이 높은 PEP가 형성된다.' },
  { ...base, id: 10, enzyme: 'Pyruvate kinase', lines: ['Pyruvate kinase'], from: pep, to: pyruvate, atp: 2, slp: true, irreversible: true, event: '2 ADP → 2 ATP (+2 ATP)', note: 'PEP의 인산기가 ADP로 전달되어 ATP와 피루브산이 생성된다. 이 반응은 세포 내에서 사실상 비가역적이다.' },
]
export const glycolysisLedger = glycolysisReactions.reduce((sum, r) => ({
  invested: sum.invested + Math.max(-r.atp, 0), produced: sum.produced + Math.max(r.atp, 0), net: sum.net + r.atp,
}), { invested: 0, produced: 0, net: 0 })

const oaa = m('Oxaloacetate', '옥살로아세트산 / Oxaloacetate (OAA)', 4)
const citrate = m('Citrate', '시트르산 / Citrate', 6)
const isocitrate = m('Isocitrate', '아이소시트르산 / Isocitrate', 6)
const akg = m('α-Ketoglutarate', 'α-Ketoglutarate (α-KG)', 5)
const succinyl = m('Succinyl-CoA', 'Succinyl-CoA', 4)
const succinate = m('Succinate', '숙신산 / Succinate', 4)
const fumarate = m('Fumarate', '푸마르산 / Fumarate', 4)
const malate = m('Malate', '말산 / Malate', 4)
export const tcaReactions: Reaction[] = [
  { ...base, id: 1, enzyme: 'Citrate synthase', lines: ['Citrate synthase'], from: oaa, to: citrate, event: '+ Acetyl-CoA (2C) + H₂O → CoA-SH 방출', note: '옥살로아세트산(4C)과 아세틸기(2C)가 결합해 시트르산(6C)이 생성되고 CoA-SH가 방출된다.' },
  { ...base, id: 2, enzyme: 'Aconitase', lines: ['Aconitase'], from: citrate, to: isocitrate, note: '시트르산이 물을 잃어 시스-아코니트산이 되고, 물이 다시 첨가되어 아이소시트르산이 된다.' },
  { ...base, id: 3, enzyme: 'Isocitrate dehydrogenase', lines: ['Isocitrate', 'dehydrogenase'], from: isocitrate, to: akg, nadh: 1, co2: 1, note: 'NAD⁺ 의존성 아이소시트르산 탈수소효소가 산화적 탈탄산을 촉매한다. CO₂가 방출되고 NAD⁺가 NADH로 환원된다.' },
  { ...base, id: 4, enzyme: 'α-Ketoglutarate dehydrogenase complex', lines: ['α-Ketoglutarate', 'dehydrogenase complex'], from: akg, to: succinyl, nadh: 1, co2: 1, event: '+ CoA-SH', note: 'α-케토글루타르산의 산화적 탈탄산으로 CO₂와 NADH가 생성된다. 남은 숙시닐기가 CoA에 전달된다.' },
  { ...base, id: 5, enzyme: 'Succinyl-CoA synthetase', lines: ['Succinyl-CoA synthetase'], from: succinyl, to: succinate, gtp: 1, slp: true, event: 'CoA-SH 방출', note: '숙시닐-CoA의 티오에스터 결합에 저장된 자유에너지를 이용해 GDP와 무기 인산으로부터 GTP를 합성한다. ADP형 동위효소는 ATP를 합성한다.' },
  { ...base, id: 6, enzyme: 'Succinate dehydrogenase', lines: ['Succinate', 'dehydrogenase'], from: succinate, to: fumarate, qh2: 1, complexII: true, note: '효소 결합 FAD가 받은 전자는 유비퀴논(Q)으로 전달되어 QH₂가 생성된다. 복합체 II는 H⁺를 수송하지 않는다.' },
  { ...base, id: 7, enzyme: 'Fumarase', lines: ['Fumarase'], from: fumarate, to: malate, event: '+ H₂O', note: '푸마르산에 물이 첨가되어 말산이 생성된다.' },
  { ...base, id: 8, enzyme: 'Malate dehydrogenase', lines: ['Malate', 'dehydrogenase'], from: malate, to: oaa, nadh: 1, note: '말산이 산화되어 옥살로아세트산이 재생되고 NAD⁺가 NADH로 환원된다.' },
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
