import { useState } from 'react'
import { glycolysisLedger, glycolysisReactions as reactions, matchesFilter, type PathwayFilter } from '../respirationPathways'
import { Arrow, Figure } from './Shared'
import { MetaboliteNode, PathwayFilters, ReactionBadges, ReactionPicker } from './PathwayShared'

const filters = [['all', '전체'], ['carbon', '탄소'], ['atp', 'ATP'], ['nadh', 'NADH'], ['irreversible', '비가역 단계']] as const
export function GlycolysisMap() {
  const [filter, setFilter] = useState<PathwayFilter>('all')
  const [selected, setSelected] = useState(1)
  const focusText = { all: '10개 반응 전체 / 포도당 1분자 기준', carbon: '6C → 3C + 3C / 탄소의 총수는 6개로 유지', atp: '01, 03에서 ATP 투자, 07, 10에서 ATP 회수', nadh: '06 GAPDH에서 2 NAD⁺ → 2 NADH', irreversible: '01 Hexokinase / 03 PFK-1 / 10 Pyruvate kinase' }
  return <div className="respiration-pathway glycolysis-map" data-filter={filter}>
    <div className="pathway-heading"><h3>해당과정의 10개 반응</h3><span>Glucose 1 → Pyruvate 2</span></div>
    <PathwayFilters options={filters} value={filter} onChange={setFilter} label="해당과정 강조" />
    <p className="filter-status" role="status">{focusText[filter as keyof typeof focusText]}</p>
    <p className="pathway-scroll-hint">↔ 그림 안에서 좌우로 스크롤하면 전체 경로를 볼 수 있습니다.</p>
    <div className="pathway-desktop"><Figure title="해당과정 10반응 지도" description="과당-1,6-이중인산이 G3P와 DHAP로 갈라진다. DHAP도 G3P로 전환되므로 포도당 한 분자당 06–10 반응은 두 번씩 일어난다. 번호를 선택하면 해당 반응의 효소와 생성물을 볼 수 있다." height={620}>
      <text x={24} y={24} className="phase-label">ENERGY INVESTMENT / ATP 2 투자</text>
      <text x={550} y={24} className="phase-label">ENERGY PAYOFF / 모든 물질과 반응 ×2</text>
      <path d="M509 45 V586" className="phase-divider" />
      <MetaboliteNode x={118} y={64} metabolite={reactions[0].from} carbon={filter === 'carbon'} />
      {reactions.slice(0, 3).map((r, i) => {
        const y = 64 + i * 112
        return <g key={r.id} className={`reaction-site ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
          <rect className="reaction-halo" x={12} y={y + 23} width={482} height={79} rx={5} />
          <Arrow d={`M118 ${y + 20} V${y + 90}`} />
          <text x={225} y={y + 42} className="enzyme-label">{String(r.id).padStart(2, '0')} / {r.lines[0]}</text>
          {r.event && <text x={225} y={y + 62} className="energy-event">{r.event}</text>}
          {r.irreversible && <text x={225} y={y + 82} className="small-label">⇒ 비가역{r.committed ? ' / Committed step' : ''}</text>}
          <MetaboliteNode x={118} y={y + 112} metabolite={r.to} carbon={filter === 'carbon'} />
        </g>
      })}
      <g className={`reaction-site ${matchesFilter(reactions[3], filter) ? 'is-highlighted' : ''}`} data-reaction={4} data-highlighted={matchesFilter(reactions[3], filter)}>
        <text x={225} y={438} className="enzyme-label">04 / Aldolase</text>
        <Arrow d="M118 421 V453 H295 V475" /><Arrow d="M118 453 V475" />
        <MetaboliteNode x={118} y={498} width={160} metabolite={reactions[3].to} carbon={filter === 'carbon'} />
        <MetaboliteNode x={310} y={498} width={160} metabolite={reactions[4].from} carbon={filter === 'carbon'} />
        <text x={210} y={503}>+</text>
      </g>
      <g className={`reaction-site ${matchesFilter(reactions[4], filter) ? 'is-highlighted' : ''}`} data-reaction={5} data-highlighted={matchesFilter(reactions[4], filter)}>
        <Arrow d="M310 518 V561 H201" /><Arrow d="M118 518 V538" />
        <text x={225} y={541} className="enzyme-label">05 / Triose phosphate isomerase</text>
        <MetaboliteNode x={118} y={562} width={164} metabolite={reactions[4].to} count={2} carbon={filter === 'carbon'} />
      </g>
      <Arrow d="M118 582 V606 H516 V64 H551" />
      <MetaboliteNode x={640} y={64} metabolite={reactions[5].from} count={2} carbon={filter === 'carbon'} />
      {reactions.slice(5).map((r, i) => {
        const y = 64 + i * 104
        return <g key={r.id} className={`reaction-site ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
          <rect className="reaction-halo" x={546} y={y + 23} width={450} height={78} rx={5} />
          <Arrow d={`M640 ${y + 20} V${y + 82}`} />
          <text x={735} y={y + 37} className="enzyme-label">{String(r.id).padStart(2, '0')} / {r.lines[0]}{r.lines[1] && <tspan x={735} dy={17}>{r.lines[1]}</tspan>}</text>
          {r.event && <text x={735} y={y + (r.lines.length > 1 ? 73 : 59)} className={r.nadh ? 'redox-event' : 'energy-event'}>{r.id === 6 ? <><tspan>2 NAD⁺ + 2 Pi →</tspan><tspan x={735} dy={18}>2 NADH + 2 H⁺</tspan></> : r.event}</text>}
          {r.slp && <text x={735} y={y + 79} className="small-label">⊕ 기질수준 인산화{r.irreversible ? ' / 비가역' : ''}</text>}
          <MetaboliteNode x={640} y={y + 104} metabolite={r.to} count={2} carbon={filter === 'carbon'} />
        </g>
      })}
    </Figure></div>
    <ol className="pathway-mobile" aria-label="해당과정 10반응 세로 경로">{reactions.map(r => <li key={r.id} className={`mobile-reaction ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
      {(r.id === 1 || r.id === 6) && <h4 className="phase-label">{r.id === 1 ? 'ENERGY INVESTMENT / 투자' : '↓ ENERGY PAYOFF / 모든 반응 ×2'}</h4>}
      {r.id === 6 && <p className="split-note">G3P 1 + DHAP에서 온 G3P 1 = <strong>2 × G3P</strong></p>}
      <div className={`mobile-metabolite ${filter === 'carbon' ? 'carbon-highlight' : ''}`}>{r.id >= 6 ? '2 × ' : ''}{r.from.short} <b>{r.from.carbon}C</b></div>
      <div className="mobile-enzyme"><span aria-hidden="true">↓</span><div><strong>{String(r.id).padStart(2, '0')} / {r.enzyme}</strong><ReactionBadges reaction={r} />{r.event && <p className={r.nadh ? 'redox-event' : 'energy-event'}>{r.event}</p>}</div></div>
      <div className={`mobile-metabolite ${filter === 'carbon' ? 'carbon-highlight' : ''}`}>{r.id >= 6 ? '2 × ' : ''}{r.to.short} <b>{r.to.carbon}C</b>{r.id === 4 && <> + DHAP <b>3C</b></>}</div>
    </li>)}</ol>
    <div className="pathway-ledger" aria-label="ATP ledger"><span>포도당 1분자</span><span>ATP 투자 <b>−{glycolysisLedger.invested}</b></span><span>ATP 생성 <b>+{glycolysisLedger.produced}</b></span><strong>NET +{glycolysisLedger.net} ATP</strong><span>+ 2 NADH</span></div>
    <ReactionPicker reactions={reactions} selected={selected} onSelect={setSelected} />
    <PhosphateTransfer />
    <details><summary>심화 / 해당과정의 조절</summary><p>간의 글루코키나아제와 여러 조직의 헥소키나아제는 포도당에 대한 친화도가 다르다. PFK-1과 피루브산 키나아제도 해당과정의 조절 지점이다.</p><p>포유류의 PFK-1은 ATP 농도가 높을 때와 시트르산이 풍부할 때 억제된다. AMP와 과당-2,6-이중인산은 효소를 활성화한다. 조절의 크기는 동위효소와 조직에 따라 달라진다.</p></details>
  </div>
}
function PhosphateTransfer() {
  return <section className="phosphate-inset" aria-label="기질수준 인산화 확대"><h4>인산기 공여체와 수용체</h4><div className="phosphate-examples">{[['07 / Phosphoglycerate kinase', '1,3-BPG', '3-PG'], ['10 / Pyruvate kinase', 'PEP', 'Pyruvate']].map(([label, donor, product]) => <div key={label}><strong>{label}</strong><svg viewBox="0 0 360 140" role="img" aria-label={`${donor}의 인산기가 ADP로 전달되어 ATP와 ${product}가 생성된다.`}><text x={20} y={35}>{donor}</text><circle cx={132} cy={30} r={15} /><text x={132} y={35} textAnchor="middle">P</text><Arrow d="M150 30 H240 Q265 30 265 59" kind="energy" /><text x={218} y={84}>ADP → ATP</text><Arrow d="M62 52 V92" /><text x={20} y={121}>{product}</text><text x={174} y={22} className="transfer-label">인산기 직접 전달</text></svg><span className="pathway-badge slp">substrate-level phosphorylation</span></div>)}</div><p>각 반응에서 기질의 인산기가 ADP로 직접 전달된다. 포도당 한 분자당 두 반응이 각각 두 번 일어나 총 ATP 4분자가 생성된다.</p></section>
}
