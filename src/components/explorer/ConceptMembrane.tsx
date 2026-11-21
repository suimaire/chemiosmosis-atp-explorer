import { useEffect, useMemo, useRef, useState } from 'react'
import { normal, relativeState } from '../../science'
import { mapAnimationState } from '../step04/animationState'
import { complexes, electronPaths, project, synthaseX, type Point } from '../step04/sceneLayout'
import type { PathVisibility, SceneController } from '../step04/EtcScene'
import { b6fProtonPath, lightRays, lightWave, thylakoidComplexes, thylakoidElectronPaths, waterProtonPath } from './thylakoidLayout'

type MembraneContext = 'mito' | 'plant'
type CreateScene = typeof import('../step04/EtcScene').createEtcScene
const copy = {
  mito: { kicker: '미토콘드리아 내막', scene: '막사이공간은 위, 기질은 아래에 있다. 전자는 운반체를 거쳐 O₂로 전달된다. 기질에서 막사이공간으로 수송된 H⁺는 ATP 합성효소를 통해 기질로 돌아온다.', atp: '● ATP (기질)' },
  plant: { kicker: '틸라코이드 막', scene: '내강은 위, 스트로마는 아래에 있다. 물에서 나온 전자는 두 광계를 거쳐 NADP⁺로 전달된다. 내강에 축적된 H⁺는 ATP 합성효소를 통해 스트로마로 돌아온다.', atp: '● ATP (스트로마)' },
}

export function ConceptMembrane({ paths, context = 'mito' }: { paths: PathVisibility; context?: MembraneContext }) {
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
    const load: Promise<CreateScene> = context === 'plant' ? import('./ThylakoidScene').then(m => m.createThylakoidScene) : import('../step04/EtcScene').then(m => m.createEtcScene)
    load.then(createScene => {
      if (cancelled || !canvas.current) return
      instance = createScene(canvas.current, latest.current.state, {
        onFailure: () => { if (!cancelled) setMode('fallback') },
        onTransition: () => {}, onLowDetail: () => {},
      }, { concept: true, paths: latest.current.paths })
      controller.current = instance
      instance.update(latest.current.state, latest.current.paused || latest.current.state.motionIntensity < 1)
      setMode('3d')
    }).catch(() => { if (!cancelled) setMode('fallback') })
    return () => { cancelled = true; instance?.dispose(); controller.current = null }
  }, [context])
  const text = copy[context]
  return <section className="concept-model" aria-label="전자전달과 H⁺ 축적의 움직이는 3D 개념 모형" data-testid="concept-model" data-context={context} data-render-mode={mode} data-paused={paused || preferences.reducedMotion}>
    <header><p className="concept-kicker">{text.kicker}</p><button className="button" disabled={mode !== '3d' || preferences.reducedMotion} aria-pressed={paused || preferences.reducedMotion} onClick={() => setPaused(v => !v)}>{paused ? '움직임 재개' : '움직임 일시정지'}</button></header>
    <div className="concept-scene" role="img" aria-label={text.scene}>
      <canvas ref={canvas} aria-hidden="true" style={{ visibility: mode === '3d' ? 'visible' : 'hidden' }} />
      {context === 'plant' ? <ThylakoidLabels paths={paths} fallback={mode !== '3d'} /> : <ConceptLabels paths={paths} fallback={mode !== '3d'} />}
    </div>
    <div className="concept-legend">{context === 'plant' && <span className="light-key">〰 광계가 흡수하는 빛</span>}<span className="electron-key">● 전자 전달</span><span className="proton-key">● H⁺ 이동</span><span className="atp-key">{text.atp}</span></div>
    {(mode !== '3d' || preferences.reducedMotion || paused) && <p className="concept-status" role="status">{mode === 'fallback' ? '3D를 사용할 수 없어 정적 그림을 표시합니다.' : preferences.reducedMotion ? '동작 줄이기 설정으로 정지됨' : paused ? '움직임 일시정지' : '3D 모형 준비 중'}</p>}
  </section>
}

const path = (points: readonly Point[]) => points.map((p, i) => { const v = project(p); return `${i ? 'L' : 'M'}${v.x},${v.y}` }).join(' ')
function ConceptLabels({ paths, fallback }: { paths: PathVisibility; fallback: boolean }) {
  return <svg viewBox="0 0 680 450" className="concept-overlay" aria-hidden="true">
    {fallback && <g>
      <path d="M20 197H640L660 222H40Z" fill="#e0dbc0" stroke="#b6b194" /><path d="M40 222H660V263H40Z" fill="#c5cdb5" stroke="#a6b59c" />
      {complexes.filter(c => c.pump).map(c => <rect key={c.name} x={project([c.x, 0, 0]).x - 21} y="183" width="42" height="85" rx="18" fill="#659490" />)}
      <g fill="#83ab74" stroke="#43733f" strokeWidth="3"><rect x="527" y="200" width="30" height="57" rx="10" /><path d="M542 250V310" /><ellipse cx="542" cy="311" rx="32" ry="21" /></g>
    </g>}
    <rect x="10" y="8" width="640" height="42" fill="#faf5eb" />
    <text x="24" y="35" className="region">막사이공간</text><text x="653" y="35" textAnchor="end" className="region-note">높은 H⁺ 농도</text>
    <text x="24" y="426" className="region">기질</text><text x="27" y="252" className="membrane-label">내막</text>
    {paths.electrons && <g data-testid="electron-path" className="electron-key">
      {fallback && electronPaths.filter((_, i) => i !== 1).map((p, i) => <path key={i} d={path(p)} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />)}
      {complexes.filter(c => c.pump).map(c => <text key={c.name} x={project([c.x, 0, 0]).x} y="300" textAnchor="middle" className="complex-name">{c.name}</text>)}
      <text x="260" y="236" textAnchor="middle" className="electron-text">e⁻ →</text>
      <text x="75" y="333" textAnchor="middle" className="small">NADH → NAD⁺</text>
      <text x="370" y="377" textAnchor="middle" className="small">O₂가 전자를 받음 → 물 생성</text>
    </g>}
    {paths.protons && <g data-testid="proton-path" className="proton-key">
      {fallback && <>
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={50 + (i * 79) % 565} cy={65 + (i % 3) * 20} r="4" fill="currentColor" />)}
        {complexes.filter(c => c.pump).map(c => <path key={c.name} d={path([[c.x - .42, -1, 1.3], [c.x - .42, 1.85, 1.3]])} stroke="currentColor" strokeWidth="3" />)}
      </>}
      <text x="252" y="142" textAnchor="middle">↑ H⁺ 수송</text>
      {[80, 240, 410].map(x => <circle key={x} cx={x} cy="397" r="4" fill="currentColor" />)}
    </g>}
    <SynthaseLabels show={paths.atp} fallback={fallback} />
  </svg>
}

function ThylakoidLabels({ paths, fallback }: { paths: PathVisibility; fallback: boolean }) {
  return <svg viewBox="0 0 680 450" className="concept-overlay" aria-hidden="true">
    {fallback && <g>
      <path d="M20 197H640L660 222H40Z" fill="#e0dbc0" stroke="#b6b194" /><path d="M40 222H660V263H40Z" fill="#c5cdb5" stroke="#a6b59c" />
      {thylakoidComplexes.map(c => <rect key={c.name} x={project([c.x, 0, 0]).x - (c.light ? 25 : 21)} y="183" width={c.light ? 50 : 42} height="85" rx="18" fill={c.light ? '#4f8f6a' : '#659490'} />)}
      <g fill="#83ab74" stroke="#43733f" strokeWidth="3"><rect x="527" y="200" width="30" height="57" rx="10" /><path d="M542 250V310" /><ellipse cx="542" cy="311" rx="32" ry="21" /></g>
    </g>}
    <rect x="10" y="8" width="640" height="42" fill="#faf5eb" />
    <text x="24" y="35" className="region">틸라코이드 내강</text><text x="653" y="35" textAnchor="end" className="region-note">높은 H⁺ 농도</text>
    <text x="24" y="426" className="region">스트로마</text><text x="668" y="252" textAnchor="end" className="membrane-label"><tspan className="membrane-prefix">틸라코이드 </tspan>막</text>
    {thylakoidComplexes.map(c => <text key={c.name} x={project([c.x, 0, 0]).x} y="305" textAnchor="middle" className="complex-name">{c.name}</text>)}
    {paths.electrons && <g data-testid="electron-path" className="electron-key">
      {fallback && thylakoidElectronPaths.map((p, i) => <path key={i} d={path(p)} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />)}
      <g className="light-key">
        {fallback && lightRays.map((ray, i) => <path key={i} d={path(lightWave(ray))} fill="none" stroke="#d9a21b" strokeWidth="3" />)}
        <text x="26" y="356" className="light-text">빛</text><text x="342" y="354" textAnchor="end" className="light-text">빛</text>
      </g>
      <text x="117" y="146" textAnchor="middle" className="small">물의 산화</text>
      <text x="232" y="232" textAnchor="middle" className="electron-text">e⁻ →</text>
      <text x="360" y="380" textAnchor="middle" className="small">NADP⁺가 전자를 받음 → NADPH</text>
    </g>}
    {paths.protons && <g data-testid="proton-path" className="proton-key">
      {fallback && <>
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={50 + (i * 79) % 565} cy={65 + (i % 3) * 20} r="4" fill="currentColor" />)}
        {[waterProtonPath, b6fProtonPath].map((p, i) => <path key={i} d={path(p)} stroke="currentColor" strokeWidth="3" />)}
      </>}
      <text x="330" y="142" textAnchor="middle">↑ H⁺ 수송</text>
      {[80, 240, 410].map(x => <circle key={x} cx={x} cy="397" r="4" fill="currentColor" />)}
    </g>}
    <SynthaseLabels show={paths.atp} fallback={fallback} />
  </svg>
}

function SynthaseLabels({ show, fallback }: { show: boolean; fallback: boolean }) {
  return show && <g data-testid="atp-path" className="atp-key">
    {fallback && <path d={path([[synthaseX, 1.7, 1.15], [synthaseX, -1.35, 1.15]])} stroke="#b86a3c" strokeWidth="4" />}
    <text x="545" y="142" textAnchor="middle" className="proton-text">H⁺ 이동 ↓</text>
    <text x="545" y="359" textAnchor="middle">ATP 합성효소</text>
    <text x="545" y="426" textAnchor="middle" className="atp-product">ADP + Pᵢ → ATP</text>
  </g>
}
