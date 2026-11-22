import { useEffect, useMemo, useRef, useState } from 'react'
import { presets, relativeState, type Condition } from '../../science'
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
  const cause = state.complexIVBlocked ? presets.cyanide.description : state.inputStopped
    ? 'NADH와 효소 결합 FADH₂에서 전자전달계로 들어오는 전자 공급이 끊겨 O₂로 전달될 전자가 없다. 기존 H⁺ 기울기가 소실되면 산화적 ATP 합성도 멈춘다.'
    : ''
  const trends = [
    ['전자전달', output.oxygen], ['H⁺ 기울기', output.gradient], ['ATP 합성', output.atp], ['산소 소비', output.oxygen],
  ] as const
  return <section className={`etc-panel etc-panel-${name.toLowerCase()}`} aria-label={`조건 ${name} 3D 개념 모형`}
    data-testid={`etc-panel-${name.toLowerCase()}`} data-render-mode={staticMode ? 'static' : mode}
    data-electron-speed={state.electronFlowSpeed} data-pump-rate={state.protonPumpRate}
    data-leak-active={state.leakActive} data-leak-rate={state.protonLeakRate}
    data-rotation-speed={state.synthaseRotationSpeed} data-atp-rate={state.atpPulseRate}
    data-density={state.protonDensity} data-motion-intensity={state.motionIntensity} data-particle-budget={state.particleBudget}>
    <header className="etc-panel-heading"><span className="etc-condition-letter">{name}</span><div><span>조건 {name}</span><h4>{conditionLabel(condition)}</h4></div><span className="etc-render-label">{fallback ? '정적 개념도' : lowDetail || preferences.compact ? '3D (간략)' : '3D'}</span></header>
    <div className="etc-scene" role="img" aria-label={`조건 ${name}: 미토콘드리아 내막. ${state.complexIVBlocked ? '복합체 IV 억제. O₂ 환원과 H⁺ 수송 중단.' : state.inputStopped ? '전자 공급 중단. O₂ 환원과 H⁺ 수송 중단.' : '복합체 I, III, IV의 H⁺ 수송 경로와 ATP 합성효소를 통한 H⁺ 귀환 경로.'}`}>
      {!staticMode && <canvas ref={canvas} className={mode === '3d' ? '' : 'etc-canvas-hidden'} aria-hidden="true" />}
      <EtcDiagram state={state} fallback={fallback} />
    </div>
    <div className="etc-scene-caption">
      {cause ? <span>{cause}</span> : <>
        <span>↑ H⁺ 수송 (I, III, IV)</span><span>↓ ATP 합성효소를 통한 H⁺ 이동</span>
        <strong>{state.leakActive ? '↓ H⁺ 누출' : '복합체 II의 H⁺ 수송 없음'}</strong>
      </>}
    </div>
    <p className="etc-state-note" role="status">{staticMode ? '정적 보기' : mode === 'fallback' ? '3D를 사용할 수 없어 정적 개념도를 표시합니다.' : mode === 'loading' ? '3D 모형 준비 중' : transition ? '기울기 소실 중 (수치는 소진 후 정상상태)' : paused ? '움직임 일시정지' : state.complexIVBlocked ? '복합체 IV 억제 후 정상상태' : state.inputStopped ? '전자전달 중단 후 H⁺ 기울기가 소진된 상태' : state.adpLimited ? 'ADP 부족으로 ATP 합성 속도가 감소한다.' : state.synthaseInhibited ? 'ATP 합성효소를 통한 H⁺ 이동이 억제된다.' : state.leakActive ? 'H⁺가 ATP 합성효소를 우회해 기질로 돌아간다.' : 'H⁺ 유입량과 유출량이 같은 정상상태'}</p>
    <dl className="etc-summary" aria-label={`조건 ${name} 시각화 요약`} aria-live="polite" aria-atomic="true">
      {trends.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{label === 'H⁺ 기울기' && value === 0 ? '소실' : relativeTrend(value)} <small>{value.toFixed(1)}</small></dd></div>)}
    </dl>
  </section>
}
