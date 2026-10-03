import { useState } from 'react'

/** Conceptual motion only: particle count and animation speed do not encode stoichiometry or flux. */
export function CouplingVisual({ sufficient }: { sufficient: boolean }) {
  const [paused, setPaused] = useState(false)
  return <figure className="coupling-visual" data-active={sufficient} data-paused={paused} aria-label="여러 H⁺의 이동, ATP 합성효소의 회전, ATP 합성의 연결">
    <div className="coupling-visual-heading"><strong>H⁺ 이동에서 ATP 합성으로</strong><button className="button" onClick={() => setPaused(!paused)} disabled={!sufficient}>{paused ? '그림 움직임 재개' : '그림 움직임 멈추기'}</button></div>
    <div className="coupling-visual-body">
      <div className="coupling-machine"><span>A 구획 · H⁺가 돌아오는 쪽</span>
        <svg viewBox="0 0 480 230" aria-hidden="true">
          <rect width="480" height="97" rx="12" fill="#faf0e4" />
          <rect y="133" width="480" height="97" rx="12" fill="#edf3e7" />
          <path d="M0 106H480M0 124H480" stroke="#b5c49c" strokeWidth="12" />
          {[55, 105, 365, 415].map((x, i) => <g key={x} transform={`translate(${x} ${35 + i % 2 * 24})`}><circle r="17" fill="#b46d40" /><text textAnchor="middle" y="6">H⁺</text></g>)}
          <rect x="204" y="91" width="72" height="48" rx="16" fill="#dce8ce" stroke="#59834b" strokeWidth="3" />
          <path d="M240 132V178" stroke="#59834b" strokeWidth="14" />
          <ellipse cx="240" cy="183" rx="57" ry="32" fill="#dce8ce" stroke="#59834b" strokeWidth="3" />
          <g className="coupling-rotor"><path d="M217 183H263M240 160V206" stroke="#52815a" strokeWidth="7" strokeLinecap="round" /><circle cx="240" cy="183" r="8" fill="#fffefa" /></g>
          {[0, 1, 2].map(i => <g key={i} className="coupling-proton" style={{ animationDelay: `${-i * 1.2}s` }}><circle cx="240" cy={26 + i * 34} r="13" fill="#a85b31" /><text x="240" y={31 + i * 34} textAnchor="middle">H⁺</text></g>)}
        </svg>
        <strong>ATP synthase · ATP 합성효소</strong><span>B 구획 · ATP 합성이 연결되는 쪽</span>
      </div>
      <div className="coupling-reaction"><span>여러 H⁺의 이동</span><span className="coupling-reaction-arrow" aria-hidden="true">↓</span><span>ATP 합성효소의 회전</span><span className="coupling-reaction-arrow" aria-hidden="true">↓</span><strong>ADP + Pi → <b className="coupling-atp">ATP</b></strong><small>Pi = 무기 인산</small></div>
    </div>
    <figcaption>{sufficient ? 'H⁺의 이동이 회전과 ATP 합성에 연결되는 모습을 나타냅니다.' : '현재 조건은 에너지가 부족해 ATP 합성 연결 그림을 멈췄습니다.'} 입자 수와 움직임은 실제 결합비나 반응 속도를 나타내지 않습니다.</figcaption>
  </figure>
}
