import type { Metabolite, PathwayFilter, Reaction } from '../respirationPathways'

export function PathwayFilters({ options, value, onChange, label }: { options: readonly (readonly [PathwayFilter, string])[]; value: PathwayFilter; onChange: (v: PathwayFilter) => void; label: string }) {
  return <div className="pathway-filters" role="group" aria-label={label}>{options.map(([key, text]) => <button key={key} aria-pressed={value === key} onClick={() => onChange(key)}>{text}</button>)}</div>
}
export function MetaboliteNode({ x, y, metabolite, count = 1, width = 174, carbon }: { x: number; y: number; metabolite: Metabolite; count?: number; width?: number; carbon: boolean }) {
  return <g className={`metabolite-node ${carbon ? 'carbon-highlight' : ''}`}><title>{metabolite.name} · {metabolite.carbon}C{count > 1 ? ` × ${count}` : ''}</title><rect x={x - width / 2} y={y - 19} width={width} height={38} rx={6} /><text x={x} y={y + 5} textAnchor="middle">{count > 1 ? `${count} × ` : ''}{metabolite.short}<tspan className="carbon-count"> · {metabolite.carbon}C</tspan></text></g>
}
export function ReactionPicker({ reactions, selected, onSelect }: { reactions: Reaction[]; selected: number; onSelect: (id: number) => void }) {
  const reaction = reactions.find(r => r.id === selected)!
  return <div className="reaction-explainer"><div className="reaction-navigation" role="group" aria-label="반응별 이름과 설명"><span>반응 자세히</span>{reactions.map(r => <button key={r.id} aria-label={`${r.id}. ${r.enzyme}`} aria-pressed={selected === r.id} onClick={() => onSelect(r.id)}>{String(r.id).padStart(2, '0')}</button>)}</div><div className="reaction-description" aria-live="polite"><strong>{reaction.id}. {reaction.enzyme}</strong><p>{reaction.from.name} → {reaction.to.name}{reaction.id === 4 && reaction.enzyme === 'Aldolase' ? ' + Dihydroxyacetone phosphate (DHAP)' : ''}</p><p>{reaction.note}</p></div></div>
}
export function ReactionBadges({ reaction }: { reaction: Reaction }) {
  return <>{reaction.committed && <span className="pathway-badge">Committed step</span>}{reaction.irreversible && <span className="pathway-badge irreversible">비가역 · irreversible</span>}{reaction.slp && <span className="pathway-badge slp">substrate-level phosphorylation</span>}{reaction.complexII && <span className="pathway-badge">ETC Complex II</span>}</>
}
