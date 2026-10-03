import { useState } from 'react'
import { glycolysisLedger, glycolysisReactions as reactions, matchesFilter, type PathwayFilter } from '../respirationPathways'
import { Arrow, Figure } from './Shared'
import { MetaboliteNode, PathwayFilters, ReactionBadges, ReactionPicker } from './PathwayShared'

const filters = [['all', '전체'], ['carbon', '탄소'], ['atp', 'ATP'], ['nadh', 'NADH'], ['irreversible', '비가역 단계']] as const
export function GlycolysisMap() {
  const [filter, setFilter] = useState<PathwayFilter>('all')
  const [selected, setSelected] = useState(1)
  const focusText = { all: '10개 반응 전체 · 포도당 1분자 기준', carbon: '6C → 3C + 3C · 탄소의 총수는 6개로 유지', atp: '01·03에서 ATP 투자, 07·10에서 ATP 회수', nadh: '06 GAPDH에서 2 NAD⁺ → 2 NADH', irreversible: '01 Hexokinase · 03 PFK-1 · 10 Pyruvate kinase' }
  return <div className="respiration-pathway glycolysis-map" data-filter={filter}>
    <div className="pathway-heading"><h3>어디에서 쓰고, 어디에서 얻을까?</h3><span>Glucose 1 → Pyruvate 2</span></div>
    <PathwayFilters options={filters} value={filter} onChange={setFilter} label="해당과정 강조" />
    <p className="filter-status" role="status">{focusText[filter as keyof typeof focusText]}</p>
    <p className="pathway-scroll-hint">↔ 그림 안에서 좌우로 스크롤하면 전체 경로를 볼 수 있습니다.</p>
    <div className="pathway-desktop"><Figure title="해당과정 10반응 지도" description="왼쪽 투자 단계에서 아래로 내려가 G3P와 DHAP의 분기를 확인한 뒤, 연결선을 따라 오른쪽 회수 단계로 갑니다. 06–10의 물질과 반응은 모두 ×2입니다. 번호 버튼에서 전체 이름과 설명을 확인하세요." height={620}>
      <text x={24} y={24} className="phase-label">ENERGY INVESTMENT · ATP 2 투자</text>
      <text x={550} y={24} className="phase-label">ENERGY PAYOFF · 모든 물질·반응 ×2</text>
      <path d="M509 45 V586" className="phase-divider" />
      <MetaboliteNode x={118} y={64} metabolite={reactions[0].from} carbon={filter === 'carbon'} />
      {reactions.slice(0, 3).map((r, i) => {
        const y = 64 + i * 112
        return <g key={r.id} className={`reaction-site ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
          <rect className="reaction-halo" x={12} y={y + 23} width={482} height={79} rx={5} />
          <Arrow d={`M118 ${y + 20} V${y + 90}`} />
          <text x={225} y={y + 42} className="enzyme-label">{String(r.id).padStart(2, '0')} · {r.lines[0]}</text>
          {r.event && <text x={225} y={y + 62} className="energy-event">{r.event}</text>}
          {r.irreversible && <text x={225} y={y + 82} className="small-label">⇒ 비가역{r.committed ? ' · Committed step' : ''}</text>}
          <MetaboliteNode x={118} y={y + 112} metabolite={r.to} carbon={filter === 'carbon'} />
        </g>
      })}
      <g className={`reaction-site ${matchesFilter(reactions[3], filter) ? 'is-highlighted' : ''}`} data-reaction={4} data-highlighted={matchesFilter(reactions[3], filter)}>
        <text x={225} y={438} className="enzyme-label">04 · Aldolase</text>
        <Arrow d="M118 421 V453 H295 V475" /><Arrow d="M118 453 V475" />
        <MetaboliteNode x={118} y={498} width={160} metabolite={reactions[3].to} carbon={filter === 'carbon'} />
        <MetaboliteNode x={310} y={498} width={160} metabolite={reactions[4].from} carbon={filter === 'carbon'} />
        <text x={210} y={503}>+</text>
      </g>
      <g className={`reaction-site ${matchesFilter(reactions[4], filter) ? 'is-highlighted' : ''}`} data-reaction={5} data-highlighted={matchesFilter(reactions[4], filter)}>
        <Arrow d="M310 518 V561 H201" /><Arrow d="M118 518 V538" />
        <text x={225} y={541} className="enzyme-label">05 · Triose phosphate isomerase</text>
        <MetaboliteNode x={118} y={562} width={164} metabolite={reactions[4].to} count={2} carbon={filter === 'carbon'} />
      </g>
      <Arrow d="M118 582 V606 H516 V64 H551" />
      <MetaboliteNode x={640} y={64} metabolite={reactions[5].from} count={2} carbon={filter === 'carbon'} />
      {reactions.slice(5).map((r, i) => {
        const y = 64 + i * 104
        return <g key={r.id} className={`reaction-site ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
          <rect className="reaction-halo" x={546} y={y + 23} width={450} height={78} rx={5} />
          <Arrow d={`M640 ${y + 20} V${y + 82}`} />
          <text x={735} y={y + 37} className="enzyme-label">{String(r.id).padStart(2, '0')} · {r.lines[0]}{r.lines[1] && <tspan x={735} dy={17}>{r.lines[1]}</tspan>}</text>
          {r.event && <text x={735} y={y + (r.lines.length > 1 ? 73 : 59)} className={r.nadh ? 'redox-event' : 'energy-event'}>{r.id === 6 ? <><tspan>2 NAD⁺ + 2 Pi →</tspan><tspan x={735} dy={18}>2 NADH + 2 H⁺</tspan></> : r.event}</text>}
          {r.slp && <text x={735} y={y + 79} className="small-label">⊕ 기질수준 인산화{r.irreversible ? ' · 비가역' : ''}</text>}
          <MetaboliteNode x={640} y={y + 104} metabolite={r.to} count={2} carbon={filter === 'carbon'} />
        </g>
      })}
    </Figure></div>
    <ol className="pathway-mobile" aria-label="해당과정 10반응 세로 경로">{reactions.map(r => <li key={r.id} className={`mobile-reaction ${matchesFilter(r, filter) ? 'is-highlighted' : ''}`} data-reaction={r.id} data-highlighted={matchesFilter(r, filter)}>
      {(r.id === 1 || r.id === 6) && <h4 className="phase-label">{r.id === 1 ? 'ENERGY INVESTMENT · 투자' : '↓ ENERGY PAYOFF · 모든 반응 ×2'}</h4>}
      {r.id === 6 && <p className="split-note">G3P 1 + DHAP에서 온 G3P 1 = <strong>2 × G3P</strong></p>}
      <div className={`mobile-metabolite ${filter === 'carbon' ? 'carbon-highlight' : ''}`}>{r.id >= 6 ? '2 × ' : ''}{r.from.short} <b>{r.from.carbon}C</b></div>
      <div className="mobile-enzyme"><span aria-hidden="true">↓</span><div><strong>{String(r.id).padStart(2, '0')} · {r.enzyme}</strong><ReactionBadges reaction={r} />{r.event && <p className={r.nadh ? 'redox-event' : 'energy-event'}>{r.event}</p>}</div></div>
      <div className={`mobile-metabolite ${filter === 'carbon' ? 'carbon-highlight' : ''}`}>{r.id >= 6 ? '2 × ' : ''}{r.to.short} <b>{r.to.carbon}C</b>{r.id === 4 && <> + DHAP <b>3C</b></>}</div>
    </li>)}</ol>
    <div className="pathway-ledger" aria-label="ATP ledger"><span>포도당 1분자</span><span>ATP 투자 <b>−{glycolysisLedger.invested}</b></span><span>ATP 생성 <b>+{glycolysisLedger.produced}</b></span><strong>NET +{glycolysisLedger.net} ATP</strong><span>+ 2 NADH</span></div>
    <ReactionPicker reactions={reactions} selected={selected} onSelect={setSelected} />
    <PhosphateTransfer />
    <details><summary>심화 · 해당과정의 조절</summary><p>Hexokinase와 glucokinase의 발현과 성질은 조직에 따라 다릅니다. PFK-1은 해당과정의 핵심 조절 지점이고 pyruvate kinase도 조절됩니다.</p><p>PFK-1의 대표적인 조절: ATP·citrate는 억제 경향, AMP는 활성화, F-2,6-BP는 강한 활성화. 효과는 조직·동위효소·조건에 따라 달라지며 조절 메커니즘 전체는 이번 사전학습의 핵심 범위가 아닙니다.</p></details>
  </div>
}
function PhosphateTransfer() {
  return <section className="phosphate-inset" aria-label="기질수준 인산화 확대"><h4>⊕ 인산기가 ADP로 직접 전달됩니다</h4><div className="phosphate-examples">{[['07 · Phosphoglycerate kinase', '1,3-BPG', '3-PG'], ['10 · Pyruvate kinase', 'PEP', 'Pyruvate']].map(([label, donor, product]) => <div key={label}><strong>{label}</strong><svg viewBox="0 0 360 140" role="img" aria-label={`${donor}의 인산기가 ADP로 전달되어 ATP와 ${product}가 됩니다.`}><text x={20} y={35}>{donor}</text><circle cx={132} cy={30} r={15} /><text x={132} y={35} textAnchor="middle">P</text><Arrow d="M150 30 H240 Q265 30 265 59" kind="energy" /><text x={218} y={84}>ADP → ATP</text><Arrow d="M62 52 V92" /><text x={20} y={121}>{product}</text><text x={174} y={22} className="transfer-label">인산기 직접 전달</text></svg><span className="pathway-badge slp">substrate-level phosphorylation</span></div>)}</div><p>ATP synthase를 이용하는 산화적 인산화와 달리, 기질수준 인산화에서는 반응 중간체의 인산기가 ADP에 직접 전달됩니다. 위 그림은 각 반응 1회이며, 포도당 1분자에서는 각각 두 번 일어납니다.</p></section>
}
