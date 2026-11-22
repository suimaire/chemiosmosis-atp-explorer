export function EtcLegend() {
  return <ul className="etc-legend" aria-label="3D 모형 범례">
    <li><b className="etc-electron">e⁻ →</b> 전자전달</li>
    <li><b className="etc-proton">H⁺ ↑↓</b> 복합체 I, III, IV의 수송 (복합체 II의 H⁺ 수송 없음)</li>
    <li><b className="etc-atp">↻ ATP</b> 회전자와 ATP 합성</li>
    <li><b>O₂ → H₂O</b> 산소 소비</li>
  </ul>
}
