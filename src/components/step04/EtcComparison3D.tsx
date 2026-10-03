import { useEffect, useMemo, useState } from 'react'
import type { Condition } from '../../science'
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
export function EtcComparison3D({ a, b }: { a: Condition; b: Condition }) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const compact = useMedia('(max-width: 760px)')
  const preferences = useMemo(() => ({ reducedMotion, compact }), [reducedMotion, compact])
  const [paused, setPaused] = useState(false)
  const [staticMode, setStaticMode] = useState(false)
  return <section className="etc-comparison" aria-label="전자전달과 산화적 인산화 3D 비교" data-testid="etc-comparison">
    <div className="etc-toolbar"><div><p className="eyebrow">MEMBRANE IN MOTION</p><h3>막에서 일어나는 일을 비교해 보세요</h3></div><div className="etc-view-controls">
      <button type="button" aria-pressed={paused} disabled={staticMode} onClick={() => setPaused(v => !v)}>{paused ? '▶ 움직임 재개' : 'Ⅱ 움직임 일시정지'}</button>
      <button type="button" aria-pressed={staticMode} onClick={() => setStaticMode(v => !v)}>{staticMode ? '3D 보기' : '정적 보기'}</button>
    </div></div>
    <p className="etc-intro">미토콘드리아 내막 일부를 단순화한 교육용 개념 모형입니다. 조건을 바꾸며 전자전달, H⁺ 누출, ATP synthase 회전과 ATP 생성을 살펴보세요.</p>
    <EtcLegend />
    {reducedMotion && <p className="etc-motion-note">기기의 동작 줄이기 설정에 따라 이동·회전 속도를 20%로 줄였습니다. 수치와 상태 비교는 동일합니다.</p>}
    <div className="etc-grid"><EtcPanel key={`A-${staticMode}`} name="A" condition={a} preferences={preferences} paused={paused} staticMode={staticMode} /><EtcPanel key={`B-${staticMode}`} name="B" condition={b} preferences={preferences} paused={paused} staticMode={staticMode} /></div>
    <p className="etc-footnote">같은 시점의 상대값을 같은 척도로 비교합니다 · 정상 = 100<br />입자 수·회전은 상대적 세기를 나타내며, 실제 농도·분자 수·반응 시간은 아닙니다. H⁺ 기울기에는 전위 차이도 포함됩니다. *FADH₂는 교과서식 요약이며, II에서는 효소에 결합된 FAD의 전자가 Q로 전달됩니다.</p>
  </section>
}
