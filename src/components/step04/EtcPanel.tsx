import { useEffect, useMemo, useRef, useState } from 'react'
import { relativeState, type Condition } from '../../science'
import { conditionLabel, mapAnimationState, relativeTrend, type DisplayPreferences } from './animationState'
import { EtcDiagram } from './EtcDiagram'
import type { SceneController } from './EtcScene'

type Props = { name: 'A' | 'B'; condition: Condition; preferences: DisplayPreferences; paused: boolean; staticMode: boolean }
export function EtcPanel({ name, condition, preferences, paused, staticMode }: Props) {
  const output = useMemo(() => relativeState(condition), [condition])
  const state = useMemo(() => mapAnimationState(condition, output, preferences), [condition, output, preferences])
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<SceneController | null>(null)
  const latest = useRef({ state, paused })
  const [mode, setMode] = useState<'loading' | '3d' | 'fallback'>('loading')
  const [transition, setTransition] = useState(false)
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
        onFailure: () => { if (!cancelled) { setMode('fallback'); setTransition(false) } },
        onTransition: active => { if (!cancelled) setTransition(active) },
        onLowDetail: () => { if (!cancelled) setLowDetail(true) },
      })
      scene.current = instance
      instance.update(latest.current.state, latest.current.paused)
      setMode('3d')
    }).catch(() => { if (!cancelled) setMode('fallback') })
    return () => { cancelled = true; instance?.dispose(); scene.current = null }
  }, [staticMode])

  const fallback = staticMode || mode !== '3d'
  const trends = [
    ['전자전달', output.oxygen], ['H⁺ 기울기', output.gradient], ['ATP 합성', output.atp], ['산소 소비', output.oxygen],
  ] as const
  return <section className={`etc-panel etc-panel-${name.toLowerCase()}`} aria-label={`조건 ${name} 3D 개념 모형`}
    data-testid={`etc-panel-${name.toLowerCase()}`} data-render-mode={staticMode ? 'static' : mode}
    data-electron-speed={state.electronFlowSpeed} data-pump-rate={state.protonPumpRate}
    data-leak-active={state.leakActive} data-leak-rate={state.protonLeakRate}
    data-rotation-speed={state.synthaseRotationSpeed} data-atp-rate={state.atpPulseRate}
    data-density={state.protonDensity} data-motion-intensity={state.motionIntensity} data-particle-budget={state.particleBudget}>
    <header className="etc-panel-heading"><span className="etc-condition-letter">{name}</span><div><span>조건 {name}</span><h4>{conditionLabel(condition)}</h4></div><span className="etc-render-label">{fallback ? '정적 개념도' : lowDetail || preferences.compact ? '3D · 간소화' : '3D'}</span></header>
    <div className="etc-scene" role="img" aria-label={`조건 ${name}: 미토콘드리아 내막. I·III·IV에서 H⁺를 위로 펌핑하고, ATP synthase에서 아래로 귀환. II는 펌프 아님.`}>
      {!staticMode && <canvas ref={canvas} className={mode === '3d' ? '' : 'etc-canvas-hidden'} aria-hidden="true" />}
      <EtcDiagram state={state} fallback={fallback} />
    </div>
    <div className="etc-scene-caption">
      <span>↑ H⁺ 펌핑 · I, III, IV</span><span>↓ ATP 합성과 연결된 귀환</span>
      <strong>{state.leakActive ? '↓ 별도 누출 경로 활성' : 'II는 H⁺ 펌프가 아닙니다'}</strong>
    </div>
    <p className="etc-state-note" role="status">{staticMode ? '정적 보기 · 조건을 바꾸면 그림과 요약도 갱신됩니다.' : mode === 'fallback' ? '3D를 사용할 수 없어 정적 개념도를 표시합니다.' : mode === 'loading' ? '3D 모형 준비 중 · 현재 조건의 개념도입니다.' : transition ? '기울기 소실 전환 중 · 아래 수치는 소진 후 정상상태입니다.' : paused ? '움직임 일시정지 · 조건 비교는 계속할 수 있습니다.' : state.inputStopped ? '입력 중단 · 기울기가 소진된 정상상태입니다.' : state.adpLimited ? 'ADP 부족 · H⁺ 기울기를 ATP 합성으로 연결하기 어렵습니다.' : state.synthaseInhibited ? 'ATP 경로 억제 · 기울기가 높아도 회전은 느려집니다.' : state.leakActive ? 'H⁺가 ATP synthase를 우회하여 기질로 돌아갑니다.' : '전자전달 → H⁺ 기울기 → 회전과 ATP 생성'}</p>
    <dl className="etc-summary" aria-label={`조건 ${name} 시각화 요약`} aria-live="polite" aria-atomic="true">
      {trends.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{relativeTrend(value)} <small>{value.toFixed(1)}</small></dd></div>)}
    </dl>
  </section>
}
