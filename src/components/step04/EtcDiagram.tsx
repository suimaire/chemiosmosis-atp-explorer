import { useId } from 'react'
import type { AnimationState } from './animationState'
import { complexes, electronPaths, leakX, project, synthaseX, type Point } from './sceneLayout'

// The SVG shares the 3D camera projection. In WebGL mode it only adds clear labels;
// in static mode it also renders the membrane, paths and proteins.
export function EtcDiagram({ state, fallback }: { state: AnimationState; fallback: boolean }) {
  const id = useId().replace(/:/g, '')
  const path = (points: readonly Point[]) => points.map((p, i) => { const v = project(p); return `${i ? 'L' : 'M'}${v.x},${v.y}` }).join(' ')
  const label = (p: Point, text: string, className = '', anchor: 'start' | 'middle' | 'end' = 'middle') => {
    const v = project(p)
    return <text x={v.x} y={v.y} textAnchor={anchor} className={className}>{text}</text>
  }
  return <svg viewBox="0 0 680 450" className="etc-overlay" aria-hidden="true">
    <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke" /></marker></defs>
    {fallback && <g>
      <path d="M20 198L640 198L660 223L40 223Z" fill="#e0dbc0" stroke="#b6b194" />
      <path d="M40 223H660V262H40Z" fill="#c5cdb5" stroke="#a6b59c" />
      {complexes.map(c => { const v = project([c.x, 0, 0]); return <rect key={c.name} x={v.x - 21} y={v.y - (c.pump ? 42 : 5)} width="42" height={c.pump ? 90 : 46} rx="17" fill="#82a9a4" stroke="#416f6d" strokeWidth="2" /> })}
      <g fill="#83ab74" stroke="#43733f" strokeWidth="3"><rect x="528" y="203" width="28" height="53" rx="10" /><path d="M542 240V321" /><ellipse cx="542" cy="312" rx="37" ry="23" /><path d="M515 312H569M542 294V330" /></g>
      {electronPaths.map((points, i) => <path key={i} d={path(points)} fill="none" stroke="#3379a0" strokeWidth="3" strokeDasharray="6 6" opacity={state.electronFlowSpeed > 0 ? 1 : 0.2} markerEnd={`url(#${id}-arrow)`} />)}
      {complexes.filter(c => c.pump).map(c => <path key={c.name} d={path([[c.x - 0.45, -0.8, 1.3], [c.x - 0.45, 1.85, 1.3]])} stroke="#bc683a" strokeWidth="3" opacity={state.protonPumpRate > 0 ? 1 : 0.2} markerEnd={`url(#${id}-arrow)`} />)}
      <path d={path([[synthaseX, 1.8, 1.3], [synthaseX, -1.4, 1.3]])} stroke="#bc683a" strokeWidth="3" opacity={state.atpPulseRate > 0 ? 1 : 0.2} markerEnd={`url(#${id}-arrow)`} />
      {Array.from({ length: Math.round(state.protonDensity * 13) }, (_, i) => <text key={i} x={66 + (i * 71) % 537} y={85 + (i % 3) * 23} className="etc-h-symbol">+</text>)}
    </g>}
    {state.leakActive && <g className="etc-leak-path" data-testid="leak-path" opacity={state.protonDensity > 0 ? 1 : 0.4}>
      <path d={path([[leakX, 1.65, 1.15], [leakX, -1.4, 1.15]])} fill="none" stroke="#ad6036" strokeWidth="4" strokeDasharray="5 4" markerEnd={`url(#${id}-arrow)`} />
      {label([leakX - 0.05, -2, 0.4], '누출', 'etc-leak-symbol')}
    </g>}
    <text x="22" y="31" className="etc-region">H⁺ 기울기</text>
    <text x="22" y="54" className="etc-region-sub">막사이공간 · H⁺ 축적</text>
    <text x="22" y="421" className="etc-region-sub">기질 · Matrix</text>
    {label([-5.25, -0.58, 1.6], '내막', 'etc-membrane-label', 'end')}
    {complexes.map(c => <g key={c.name}>
      {label([c.x, c.pump ? -1.38 : -1.27, 0.6], `Complex ${c.name}`, 'etc-complex-label')}
    </g>)}
    {label([-5.55, -2.42, 0.6], 'NADH', 'etc-source', 'start')}
    {label([-2.8, -2.42, 0.6], 'FADH₂*', 'etc-source')}
    {label([-1.8, 0.42, 1.5], 'Q', 'etc-carrier')}
    {label([0.5, 1.57, 0.6], 'cyt c', 'etc-carrier')}
    {label([1.5, -2.55, 0.6], 'O₂ → H₂O', 'etc-oxygen')}
    {label([synthaseX, -2.55, 0.6], 'ATP', 'etc-atp-label')}
    {label([synthaseX, -3.18, 0.6], 'ATP synthase', 'etc-complex-label')}
    {label([-4.5, 2.1, 0.6], 'H⁺ ↑', 'etc-pump-label')}
    {label([-0.95, 2.1, 0.6], 'H⁺ ↑', 'etc-pump-label')}
    {label([1.6, 2.1, 0.6], 'H⁺ ↑', 'etc-pump-label')}
    {label([synthaseX, 2.1, 0.6], 'H⁺ ↓', 'etc-pump-label')}
  </svg>
}
