import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { relativeState, type Condition } from '../../science'
import { useConditionPlayback } from './useConditionPlayback'
import type { ChangeSource } from './conditionTransition'
import { EtcLegend } from './EtcLegend'
import { EtcPanel } from './EtcPanel'
import './EtcComparison3D.css'

function useMedia(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}
// Each condition column keeps its picker above and its sliders below its own scene,
// so a change and its effect stay on screen together.
type ColumnControls = Partial<Record<'A' | 'B', { preset?: ReactNode; adjust?: ReactNode }>>
type ComparisonProps = {
  a: Condition
  b: Condition
  aSource?: ChangeSource
  bSource?: ChangeSource
  controls?: ColumnControls
  renderResults?: (values: ReturnType<typeof relativeState>[], transient: boolean) => ReactNode
}
export function EtcComparison3D({ a, b, aSource = 'preset', bSource = 'preset', controls, renderResults }: ComparisonProps) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const compact = useMedia('(max-width: 760px)')
  const preferences = useMemo(() => ({ reducedMotion, compact }), [reducedMotion, compact])
  const [paused, setPaused] = useState(false)
  const [staticMode, setStaticMode] = useState(false)
  const held = paused || staticMode
  const aPlayback = useConditionPlayback(a, aSource, held, staticMode)
  const bPlayback = useConditionPlayback(b, bSource, held, staticMode)
  const transient = !aPlayback.frame.complete || !bPlayback.frame.complete
  return <><section className="etc-comparison" aria-label="전자전달과 산화적 인산화 3D 비교" data-testid="etc-comparison">
    <div className="etc-toolbar"><div><h3>미토콘드리아 내막의 A/B 조건</h3></div><div className="etc-view-controls">
      <button type="button" aria-pressed={paused} disabled={staticMode} onClick={() => setPaused(v => !v)}>{paused ? '▶ 움직임 재개' : 'Ⅱ 움직임 일시정지'}</button>
      <button type="button" aria-pressed={staticMode} onClick={() => setStaticMode(v => !v)}>{staticMode ? '3D 보기' : '정적 보기'}</button>
    </div></div>
    <EtcLegend />
    {reducedMotion && <p className="etc-motion-note">동작 줄이기 설정으로 애니메이션을 20% 속도로 표시합니다.</p>}
    <div className="etc-grid">{([['A', a, aPlayback], ['B', b, bPlayback]] as const).map(([name, condition, playback]) =>
      <div className={`etc-column etc-column-${name.toLowerCase()}`} key={name}>
        {controls?.[name]?.preset}
        <EtcPanel key={`${name}-${staticMode}`} name={name} condition={condition} preferences={preferences} paused={playback.frozen} staticMode={staticMode} frame={playback.frame}>
          {playback.frame && <div className="etc-playback">
            <progress aria-label={`조건 ${name} 처리 과정 진행도`} value={playback.frame.elapsed} max={playback.frame.duration} />
            <div><button type="button" onClick={playback.restart}>{held ? '처음으로' : '다시 재생'}</button>
            <button type="button" disabled={playback.frame.complete} onClick={playback.advance}>다음 단계</button>{playback.stepHold && !held && !playback.frame.complete && <button type="button" onClick={playback.resume}>이어서 재생</button>}</div>
          </div>}
        </EtcPanel>
        {controls?.[name]?.adjust}
      </div>)}</div>
    <p className="etc-footnote">각 지표의 정상 조건을 100으로 환산한 모형 계산값이다.</p>
  </section>{renderResults?.([aPlayback.frame.values, bPlayback.frame.values], transient)}</>
}
