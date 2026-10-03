import { useState } from 'react'
import { matchesFilter, tcaBalance, tcaReactions as reactions, type PathwayFilter, type Reaction } from '../respirationPathways'
import { Arrow, Figure } from './Shared'
import { MetaboliteNode, PathwayFilters, ReactionBadges, ReactionPicker } from './PathwayShared'

const filters = [['all', '전체'], ['carbon', '탄소'], ['nadh', 'NADH'], ['fad', 'FAD/Q'], ['co2', 'CO₂'], ['gtp', 'GTP']] as const
const positions = [[350, 65], [650, 65], [810, 210], [810, 365], [650, 500], [350, 500], [190, 365], [190, 210]]
const labels = [[500, 23], [853, 118], [863, 263], [803, 412], [500, 538], [173, 398], [140, 280], [170, 118]]
const edges = ['M447 65 H552', 'M703 87 Q760 126 796 186', 'M810 231 V341', 'M796 388 Q755 447 703 476', 'M554 500 H447', 'M298 476 Q234 435 204 388', 'M190 343 V233', 'M204 186 Q246 126 298 89']
function products(r: Reaction, turns: 1 | 2) {
  const n = turns === 2 ? '2 ' : ''
  if (r.nadh) return `${n}NAD⁺ → ${n}NADH${r.co2 ? ` · ${n}CO₂ ↑` : ''}`
  if (r.qh2) return `FAD-linked → ${n}QH₂`
  if (r.gtp) return `${n}GDP + ${n}Pi → ${n}GTP`
  return ''
}
export function TcaCycleMap({ onOpenEtc }: { onOpenEtc: () => void }) {
  const [turns, setTurns] = useState<1 | 2>(1)
  const [filter, setFilter] = useState<PathwayFilter>('all')
  const [selected, setSelected] = useState(1)
  const balance = tcaBalance(turns)
  const focusText = { all: '8개 반응을 따라 OAA가 재생되는 지점까지', carbon: 'Acetyl-CoA 2C + OAA 4C → Citrate 6C · 탄소 수는 분자당', nadh: '03·04·08에서 NADH 생성', fad: '06 Succinate dehydrogenase · 효소 결합 FAD에서 Q로', co2: '03·04에서만 CO₂ 방출 · 산화적 탈탄산', gtp: '05 Succinyl-CoA synthetase · 기질수준 인산화' }
  return <div className="respiration-pathway tca-map" data-filter={filter}>
    <div className="pathway-heading"><h3>탄소는 회로를 돌고, 전자는 전달됩니다</h3><span>Mitochondrial matrix · 기질*</span></div>
    <div className="pathway-filters turn-toggle" role="group" aria-label="TCA 회전 수"><button aria-pressed={turns === 1} onClick={() => setTurns(1)}>1 turn · Acetyl-CoA 1</button><button aria-pressed={turns === 2} onClick={() => setTurns(2)}>2 turns · Glucose 1 equivalent</button></div>
    <PathwayFilters options={filters} value={filter} onChange={setFilter} label="TCA 강조" />
    <p className="filter-status" role="status">{focusText[filter as keyof typeof focusText]}{turns === 2 ? ' · 산물 수지 ×2' : ''}</p>
    <p className="pathway-scroll-hint">↔ 그림 안에서 좌우로 스크롤하면 전체 경로를 볼 수 있습니다.</p>
    <div className="pathway-desktop"><Figure title="TCA 8단계 원형 경로" description="OAA에서 시작해 시계 방향으로 01–08을 따라갑니다. NADH·CO₂·GTP·QH₂는 생성 반응 바로 옆에 표시됩니다. 탄소 수는 분자당이며 두 회전 선택 시 산물 수지가 두 배가 됩니다." height={600}>
      <ellipse cx={500} cy={283} rx={297} ry={219} className="tca-guide" />
      <text x={500} y={245} textAnchor="middle" className="cycle-title">TCA CYCLE</text>
      <text x={500} y={277} textAnchor="middle">{turns === 1 ? '1 turn · Acetyl-CoA 1' : '2 turns · Glucose 1 equivalent'}</text>
      <text x={500} y={317} textAnchor="middle" className="oaa-regenerated">↻ OAA regenerated</text>
      <text x={500} y={345} textAnchor="middle" className="small-label">옥살로아세트산 재생 → 다음 회전</text>
      <text x={500} y={380} textAnchor="middle" className="small-label">숫자 = 반응 순서 · C = 분자당 탄소 수</text>
      <text x={500} y={116} textAnchor="middle" className={filter === 'carbon' ? 'carbon-input active' : 'carbon-input'}>+ Acetyl-CoA · 2C{turns === 2 ? ' ×2' : ''}</text><Arrow d="M500 94 V68" />
      {reactions.map((r, i) => {
        const [x, y] = labels[i]
        return <g key={r.id} className={`reaction-site ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
          <Arrow d={edges[i]} />
          <rect className="reaction-halo" x={x - 133} y={y - 20} width={266} height={r.id === 1 ? 46 : r.complexII ? 110 : r.co2 ? 97 : 77} rx={5} />
          <text x={x} y={y} textAnchor="middle" className="enzyme-label">{String(r.id).padStart(2, '0')} · {r.lines[0]}{r.lines[1] && <tspan x={x} dy={18}>{r.lines[1]}</tspan>}</text>
          {products(r, turns) && <text x={x} y={y + (r.lines.length > 1 ? 42 : 25)} textAnchor="middle" className={r.gtp ? 'energy-event' : 'redox-event'}>{products(r, turns)}</text>}
          {!!r.co2 && <text x={x} y={y + 65} textAnchor="middle" className="small-label">oxidative decarboxylation</text>}
          {r.slp && <text x={x} y={y + 47} textAnchor="middle" className="small-label">⊕ substrate-level phosphorylation</text>}
          {r.complexII && <><text x={x} y={y + 62} textAnchor="middle" className="small-label">FAD-linked reducing equivalent</text><text x={x} y={y + 79} textAnchor="middle" className="complex-badge">ETC Complex II · 내막 결합</text></>}
          {r.id === 7 && <text x={x} y={y + 26} textAnchor="middle" className="small-label">+ H₂O</text>}
        </g>
      })}
      {reactions.map((r, i) => <MetaboliteNode key={r.id} x={positions[i][0]} y={positions[i][1]} metabolite={r.from} width={190} carbon={filter === 'carbon'} />)}
    </Figure></div>
    <ol className="pathway-mobile" aria-label="TCA 8반응 세로 경로">{reactions.map(r => <li key={r.id} className={`mobile-reaction ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
      {r.id === 1 && <p className="split-note">Acetyl-CoA <strong>2C</strong> + OAA <strong>4C</strong></p>}
      <div className={`mobile-metabolite ${filter === 'carbon' ? 'carbon-highlight' : ''}`}>{r.from.short} <b>{r.from.carbon}C</b></div>
      <div className="mobile-enzyme"><span aria-hidden="true">↓</span><div><strong>{String(r.id).padStart(2, '0')} · {r.enzyme}</strong><ReactionBadges reaction={r} />{products(r, turns) && <p className={r.gtp ? 'energy-event' : 'redox-event'}>{products(r, turns)}</p>}{!!r.co2 && <span className="pathway-badge">oxidative decarboxylation</span>}{r.event && <p>{r.event}</p>}</div></div>
      <div className={`mobile-metabolite ${filter === 'carbon' ? 'carbon-highlight' : ''}`}>{r.to.short} <b>{r.to.carbon}C</b>{r.id === 8 && <span> ↻ OAA regenerated</span>}</div>
    </li>)}</ol>
    <div className="pathway-ledger tca-ledger" aria-label="TCA 산물 수지" aria-live="polite"><strong>{turns} {turns === 1 ? 'turn' : 'turns'}</strong><span>{balance.co2} CO₂</span><span>{balance.nadh} NADH</span><span>{balance.qh2} FAD-linked reducing {turns === 1 ? 'equivalent' : 'equivalents'} → {balance.qh2} QH₂</span><span>{balance.gtp} GTP</span><span>↻ OAA regenerated</span></div>
    <p className="pathway-caption">산물은 TCA만의 수지입니다. 해당과정과 PDH의 산물은 포함하지 않습니다. 두 회전에서도 분자당 탄소 수는 같으며, OAA는 매 회전 재생됩니다.</p>
    <ReactionPicker reactions={reactions} selected={selected} onSelect={setSelected} />
    <aside className="sdh-note"><div><span className="pathway-badge">ETC Complex II</span><strong>Succinate dehydrogenase: TCA와 전자전달계의 접점</strong></div><p>효소 결합 FAD → 효소 결합 FADH₂ → 전자가 Q로 전달 → QH₂</p><p>교과서에서는 흔히 ‘FADH₂ 1개 생성’으로 요약하지만, succinate dehydrogenase의 FAD는 효소에 결합되어 있으며 전자는 Q로 전달됩니다. 자유 FADH₂가 이동하는 것은 아닙니다.</p><p>* 대부분의 TCA 효소는 기질에 있습니다. Succinate dehydrogenase는 <strong>inner mitochondrial membrane · 내막</strong>에 결합하고, 활성 부위는 <strong>matrix · 기질 측</strong>에 있습니다. H⁺ 펌프 작용은 없습니다.</p><button className="button" onClick={onOpenEtc}>→ Complex II · Step 04에서 보기</button></aside>
    <p className="note">첫 회전에서 방출되는 CO₂가 곧바로 이번에 들어온 acetyl-CoA의 두 탄소라는 뜻은 아닙니다. 탄소 원자의 운명은 회로를 여러 번 돌며 추적해야 합니다.</p>
    <details><summary>심화 · GTP와 ATP 상당량</summary><p>Succinyl-CoA synthetase의 GDP형 반응을 표시했습니다. 조직과 동위효소에 따라 ADP형 반응으로 ATP를 만들기도 합니다. Nucleoside diphosphate kinase는 GTP + ADP ⇌ GDP + ATP 반응을 연결합니다. 여기서 GTP와 ATP를 별도의 추가 수율로 이중 합산하지 않습니다.</p><p>지도는 반응 순서를 보여 주며, 화살표가 모든 반응의 비가역성이나 동일한 속도를 뜻하지는 않습니다. 물·H⁺·CoA의 모든 출입, 보충·유출 경로와 원자별 표지는 기본 지도에서 생략했습니다.</p></details>
  </div>
}
