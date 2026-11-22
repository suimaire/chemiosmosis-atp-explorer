import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { presetKeyFor, presets, relativeState, type Condition } from '../../science'
import { mapAnimationState, relativeTrend, type DisplayPreferences } from './animationState'
import { EtcDiagram } from './EtcDiagram'
import type { ConditionFrame } from './conditionTransition'
import type { SceneController } from './EtcScene'

type Props = { name: 'A' | 'B'; condition: Condition; preferences: DisplayPreferences; paused: boolean; staticMode: boolean; frame: ConditionFrame; children?: ReactNode }
export function EtcPanel({ name, condition, preferences, paused, staticMode, frame, children }: Props) {
  const output = useMemo(() => relativeState(condition), [condition])
  const state = useMemo(() => mapAnimationState(condition, output, preferences, frame), [condition, output, preferences, frame])
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<SceneController | null>(null)
  const latest = useRef({ state, paused })
  const [mode, setMode] = useState<'loading' | '3d' | 'fallback'>('loading')
  const [lowDetail, setLowDetail] = useState(false)
  useEffect(() => {
    latest.current = { state, paused }
    scene.current?.update(state, paused)
  }, [state, paused])
  useEffect(() => {
    if (staticMode) return
    let cancelled = false
    let instance: SceneController | undefined
    import('./EtcScene').then(({ createEtcScene }) => {
      if (cancelled || !canvas.current) return
      instance = createEtcScene(canvas.current, latest.current.state, {
        onFailure: () => { if (!cancelled) setMode('fallback') },
        onLowDetail: () => { if (!cancelled) setLowDetail(true) },
      })
      scene.current = instance
      instance.update(latest.current.state, latest.current.paused)
      setMode('3d')
    }).catch(() => { if (!cancelled) setMode('fallback') })
    return () => { cancelled = true; instance?.dispose(); scene.current = null }
  }, [staticMode])

  const fallback = staticMode || mode !== '3d'
  const preset = presetKeyFor(condition)
  const viewStatus = staticMode ? '정적 보기' : mode === 'fallback' ? '3D를 사용할 수 없어 정적 개념도를 표시합니다.' : mode === 'loading' ? '3D 모형 준비 중' : paused ? '움직임 일시정지' : ''
  const sceneDescription = frame.stage.title + '. ' + frame.stage.note
  const trends = [
    ['전자전달', 100 * state.electronFlowSpeed], ['H⁺ 기울기', 100 * state.protonDensity], ['ATP 합성', 100 * state.atpPulseRate], ['산소 소비', 100 * state.oxygenRate],
  ] as const
  return <section className={`etc-panel etc-panel-${name.toLowerCase()}`} aria-label={`조건 ${name} 3D 개념 모형`}
    data-stage={frame.index} data-complete={frame.complete} data-oxygen-rate={state.oxygenRate} data-testid={`etc-panel-${name.toLowerCase()}`} data-render-mode={staticMode ? 'static' : mode}
    data-electron-speed={state.electronFlowSpeed} data-pump-rate={state.protonPumpRate}
    data-leak-active={state.leakActive} data-leak-rate={state.protonLeakRate}
    data-rotation-speed={state.synthaseRotationSpeed} data-atp-rate={state.atpPulseRate}
    data-density={state.protonDensity} data-motion-intensity={state.motionIntensity} data-particle-budget={state.particleBudget}>
    <header className="etc-panel-heading"><span className="etc-condition-letter">{name}</span><div><span>조건 {name}</span><h4>{preset ? presets[preset].label : '사용자 조절 조건'}</h4></div><span className="etc-render-label">{fallback ? '정적 개념도' : lowDetail || preferences.compact ? '3D (간략)' : '3D'}</span></header>
    <div className="etc-scene" role="img" aria-label={`조건 ${name}: 미토콘드리아 내막. ${sceneDescription}`}>
      {!staticMode && <canvas ref={canvas} className={mode === '3d' ? '' : 'etc-canvas-hidden'} aria-hidden="true" />}
      <EtcDiagram state={state} fallback={fallback} />
    </div>
    <div className="etc-scene-caption">
      <strong>{frame.stage.title}</strong>
    </div>
    <dl className="etc-summary" aria-label={`조건 ${name} 시각화 요약`} aria-live="off" aria-atomic="true">
      {trends.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{label === 'H⁺ 기울기' && value === 0 ? '소실' : relativeTrend(value)} <small>{value.toFixed(1)}</small></dd></div>)}
    </dl>
    <p className="etc-state-note" role="status">{viewStatus && <span className="etc-view-status">{viewStatus}</span>}{frame.stage.note}</p>
    {children}
  </section>
}
