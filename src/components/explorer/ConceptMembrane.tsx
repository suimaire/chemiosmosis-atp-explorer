import { useEffect, useMemo, useRef, useState } from 'react'
import { normal, relativeState } from '../../science'
import { mapAnimationState } from '../step04/animationState'
import { complexes, electronPaths, project, synthaseX, type Point } from '../step04/sceneLayout'
import type { PathVisibility, SceneController } from '../step04/EtcScene'

export function ConceptMembrane({ paths }: { paths: PathVisibility }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const controller = useRef<SceneController | null>(null)
  const [mode, setMode] = useState<'loading' | '3d' | 'fallback'>('loading')
  const [paused, setPaused] = useState(false)
  const [preferences, setPreferences] = useState({ reducedMotion: false, compact: false })
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)'), width = matchMedia('(max-width: 760px)')
    const update = () => setPreferences({ reducedMotion: motion.matches, compact: width.matches })
    update(); motion.addEventListener('change', update); width.addEventListener('change', update)
    return () => { motion.removeEventListener('change', update); width.removeEventListener('change', update) }
  }, [])
  const state = useMemo(() => mapAnimationState(normal, relativeState(normal), preferences), [preferences])
  const latest = useRef({ state, paths, paused })
  useEffect(() => {
    latest.current = { state, paths, paused }
    controller.current?.update(state, paused || preferences.reducedMotion)
    controller.current?.setPaths(paths)
  }, [state, paths, paused, preferences.reducedMotion])
  useEffect(() => {
    let cancelled = false, instance: SceneController | undefined
    import('../step04/EtcScene').then(({ createEtcScene }) => {
      if (cancelled || !canvas.current) return
      instance = createEtcScene(canvas.current, latest.current.state, {
        onFailure: () => { if (!cancelled) setMode('fallback') },
        onTransition: () => {}, onLowDetail: () => {},
      }, { concept: true, paths: latest.current.paths })
      controller.current = instance
      instance.update(latest.current.state, latest.current.paused || latest.current.state.motionIntensity < 1)
      setMode('3d')
    }).catch(() => { if (!cancelled) setMode('fallback') })
    return () => { cancelled = true; instance?.dispose(); controller.current = null }
  }, [])
  return <section className="concept-model" aria-label="전자전달과 H⁺ 축적의 움직이는 3D 개념 모형" data-testid="concept-model" data-render-mode={mode} data-paused={paused || preferences.reducedMotion}>
    <header><p className="concept-kicker">내막에서 일어나는 세 가지 흐름</p><button className="button" disabled={mode !== '3d' || preferences.reducedMotion} aria-pressed={paused || preferences.reducedMotion} onClick={() => setPaused(v => !v)}>{paused ? '움직임 재개' : '움직임 일시정지'}</button></header>
    <div className="concept-scene" role="img" aria-label="위는 막사이공간, 가운데는 내막, 아래는 기질. 전자는 운반체를 따라 전달됩니다. H⁺는 위로 펌핑되어 축적되고 ATP 합성효소를 통해 아래로 돌아옵니다.">
      <canvas ref={canvas} aria-hidden="true" style={{ visibility: mode === '3d' ? 'visible' : 'hidden' }} />
      <ConceptLabels paths={paths} fallback={mode !== '3d'} />
    </div>
    <div className="concept-legend"><span className="electron-key">● e⁻ · 운반체를 따라</span><span className="proton-key">● H⁺ · 막을 가로질러</span><span className="atp-key">● ATP · 기질 쪽에서 생성</span></div>
    <p className="concept-status" role="status">{mode === 'fallback' ? '3D를 사용할 수 없어 같은 경로의 정적 개념도를 표시합니다.' : preferences.reducedMotion ? '동작 줄이기 설정에 따라 정지된 3D 모형을 표시합니다.' : paused ? '움직임 일시정지 · 경로를 켜고 끄며 비교해 보세요.' : mode === 'loading' ? '3D 모형 준비 중' : '움직이는 3D 개념 모형 · 경로 토글은 표시만 바꿉니다.'}</p>
  </section>
}

function ConceptLabels({ paths, fallback }: { paths: PathVisibility; fallback: boolean }) {
  const path = (points: readonly Point[]) => points.map((p, i) => { const v = project(p); return `${i ? 'L' : 'M'}${v.x},${v.y}` }).join(' ')
  return <svg viewBox="0 0 680 450" className="concept-overlay" aria-hidden="true">
    {fallback && <g>
      <path d="M20 197H640L660 222H40Z" fill="#e0dbc0" stroke="#b6b194" /><path d="M40 222H660V263H40Z" fill="#c5cdb5" stroke="#a6b59c" />
      {complexes.filter(c => c.pump).map(c => <rect key={c.name} x={project([c.x, 0, 0]).x - 21} y="183" width="42" height="85" rx="18" fill="#659490" />)}
      <g fill="#83ab74" stroke="#43733f" strokeWidth="3"><rect x="527" y="200" width="30" height="57" rx="10" /><path d="M542 250V310" /><ellipse cx="542" cy="311" rx="32" ry="21" /></g>
    </g>}
    <rect x="10" y="8" width="640" height="42" fill="#faf5eb" />
    <text x="24" y="35" className="region">막사이공간</text><text x="653" y="35" textAnchor="end" className="region-note">H⁺가 높은 쪽</text>
    <text x="24" y="426" className="region">기질</text><text x="27" y="252" className="membrane-label">내막</text>
    {paths.electrons && <g data-testid="electron-path" className="electron-key">
      {fallback && electronPaths.filter((_, i) => i !== 1).map((p, i) => <path key={i} d={path(p)} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />)}
      <text x="260" y="236" textAnchor="middle" className="electron-text">e⁻ →</text>
      <text x="102" y="324">전자전달계</text><text x="102" y="347" className="small">전자를 운반체로 전달</text>
      <text x="370" y="377" textAnchor="middle" className="small">O₂가 전자를 받음 → 물 생성</text>
    </g>}
    {paths.protons && <g data-testid="proton-path" className="proton-key">
      {fallback && <>
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={50 + (i * 79) % 565} cy={65 + (i % 3) * 20} r="4" fill="currentColor" />)}
        {complexes.filter(c => c.pump).map(c => <path key={c.name} d={path([[c.x - .42, -1, 1.3], [c.x - .42, 1.85, 1.3]])} stroke="currentColor" strokeWidth="3" />)}
      </>}
      <text x="252" y="142" textAnchor="middle">↑ H⁺ 펌핑 · 축적</text>
      {[80, 240, 410].map(x => <circle key={x} cx={x} cy="397" r="4" fill="currentColor" />)}
    </g>}
    {paths.atp && <g data-testid="atp-path" className="atp-key">
      {fallback && <path d={path([[synthaseX, 1.7, 1.15], [synthaseX, -1.35, 1.15]])} stroke="#b86a3c" strokeWidth="4" />}
      <text x="545" y="142" textAnchor="middle" className="proton-text">H⁺ ↓ 귀환</text>
      <text x="545" y="359" textAnchor="middle">ATP 합성효소</text>
      <text x="545" y="426" textAnchor="middle" className="atp-product">ADP + Pᵢ → ATP</text>
    </g>}
  </svg>
}
