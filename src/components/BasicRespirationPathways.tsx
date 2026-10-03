import { useState } from 'react'
import { glycolysisLedger, tcaBalance } from '../respirationPathways'

export function BasicGlycolysis() {
  return <div className="respiration-pathway basic-pathway basic-glycolysis">
    <div className="pathway-heading"><h3>해당과정의 큰 흐름</h3><span>포도당 1분자 기준</span></div>
    <p className="basic-lead">포도당 1분자는 세포질에서 두 분자의 피루브산으로 전환됩니다.<br />초기에 ATP를 사용하고, 이후 ATP와 NADH를 얻습니다.</p>
    <ol className="basic-flow" aria-label="해당과정의 네 가지 핵심 사건">
      <li><span className="basic-phase">에너지 투자 단계</span><h4><span>①</span> 포도당에 인산기 부착</h4><div className="basic-molecule">포도당 <b>6C</b><span className="basic-arrow">↓</span>6탄당 인산화 중간체</div><strong className="basic-product investment">ATP {glycolysisLedger.invested}개 사용</strong><p>반응을 진행하기 위해 먼저 에너지를 투자합니다.</p></li>
      <li><span className="basic-phase">탄소 골격 나누기</span><h4><span>②</span> 두 개의 3탄당으로 분리</h4><div className="basic-molecule">6C<span className="basic-arrow">↓</span><span className="carbon-pair"><b>3C</b> + <b>3C</b></span></div><p>이후 반응은 두 분자에 대해 각각 진행됩니다.</p></li>
      <li><span className="basic-phase">전자 운반체 생성</span><h4><span>③</span> 3탄당 산화</h4><div className="basic-molecule">3탄당 중간체 2분자<span className="basic-arrow">↓</span>NAD⁺ → NADH</div><strong className="basic-product carrier">NADH 2개 생성</strong><p>전자와 수소가 NAD⁺로 전달되어 NADH가 만들어집니다.</p></li>
      <li><span className="basic-phase">에너지 회수 단계</span><h4><span>④</span> ATP 회수와 피루브산 생성</h4><div className="basic-molecule">3탄당 중간체 2분자<span className="basic-arrow">↓</span>피루브산 2분자 <b>각 3C</b></div><strong className="basic-product">ATP {glycolysisLedger.produced}개 생성</strong><p>인산기가 ADP에 직접 전달되어 ATP를 얻습니다.</p></li>
    </ol>
    <div className="pathway-ledger basic-ledger" aria-label="해당과정 기본 수지"><span>ATP 사용 <b>{glycolysisLedger.invested}</b></span><span>ATP 생성 <b>{glycolysisLedger.produced}</b></span><strong>순 ATP {glycolysisLedger.net}</strong><span>NADH <b>2</b></span><span>피루브산 <b>2</b></span></div>
    <p className="basic-footnote">이 과정의 ATP는 반응 중간체의 인산기가 ADP에 직접 전달되는 <strong>기질수준 인산화</strong>로 생성됩니다. ATP 합성효소를 이용하는 화학삼투와는 다릅니다.</p>
  </div>
}

export function BasicPyruvateOxidation() {
  return <div className="respiration-pathway basic-pathway basic-pdh">
    <div className="pathway-heading"><h3>피루브산에서 아세틸-CoA로</h3><span>피루브산 1분자의 변화</span></div>
    <p className="basic-lead">탄소 하나는 CO₂로 빠져나가고, 남은 2C 아세틸기가 CoA와 결합합니다.</p>
    <figure className="basic-pdh-diagram">
      <div className="basic-pdh-flow">
        <div className="basic-endpoint">피루브산<strong>3C</strong></div><span className="basic-connector" aria-hidden="true">→</span>
        <div className="basic-coupled-events"><span className="basic-phase">하나로 연결된 변화</span><ul><li>CO₂ <strong>1개 방출</strong></li><li>NADH <strong>1개 생성</strong></li><li><strong>CoA 결합</strong></li></ul></div><span className="basic-connector" aria-hidden="true">→</span>
        <div className="basic-endpoint">아세틸-CoA<strong>2C</strong></div>
      </div>
      <figcaption>실제로는 피루브산 탈수소효소 복합체 안에서 여러 반응이 서로 연결되어 진행됩니다.</figcaption>
    </figure>
    <div className="basic-equation" aria-label="아세틸-CoA 생성 기본 수지"><span>포도당 1분자 기준</span><p>피루브산 2분자 <span aria-hidden="true">→</span> 아세틸-CoA 2분자 + CO₂ 2개 + NADH 2개</p></div>
    <p className="basic-footnote">이 단계에서는 ATP를 직접 생성하지 않습니다. 만들어진 아세틸-CoA는 TCA 회로로 들어갑니다.</p>
  </div>
}

export function BasicTca() {
  const [turns, setTurns] = useState<1 | 2>(1)
  const balance = tcaBalance(turns)
  return <div className="respiration-pathway basic-pathway basic-tca">
    <div className="pathway-heading"><h3>돌고, 내보내고, 다시 준비하는 회로</h3><span>그림은 1회전의 흐름</span></div>
    <div className="basic-cycle">
      <div className="basic-cycle-center"><span aria-hidden="true">↻</span><strong>TCA 회로</strong><small>1회전</small></div>
      <ol className="basic-cycle-events" aria-label="TCA 회로의 네 가지 핵심 사건">
        <li><h4><span>①</span> 아세틸-CoA 유입</h4><p className="basic-molecule">아세틸-CoA <b>2C</b> + <b>4C</b> 물질<span className="basic-arrow">↓</span><b>6C</b> 물질</p></li>
        <li><h4><span>②</span> 탄소 방출</h4><p className="basic-molecule">6C → 5C → 4C</p><strong className="basic-product investment">CO₂ 2개 방출</strong></li>
        <li><h4><span>③</span> 전자 운반체 생성</h4><div className="basic-carriers"><strong>NADH 3개</strong><strong>FADH₂ 1개</strong></div><p>회로의 여러 반응에서 전자를 회수합니다.</p></li>
        <li><h4><span>④</span> ATP 생성과 4C 물질 재생</h4><strong className="basic-product">ATP 1개 상당 생성</strong><p className="basic-molecule">4C 물질 재생 → 다음 회전</p></li>
      </ol>
    </div>
    <div className="pathway-filters basic-basis" role="group" aria-label="TCA 기본 수지 기준"><button aria-pressed={turns === 1} onClick={() => setTurns(1)}>아세틸-CoA 1분자</button><button aria-pressed={turns === 2} onClick={() => setTurns(2)}>포도당 1분자</button></div>
    <div className="pathway-ledger basic-ledger" aria-label="TCA 기본 산물 수지" aria-live="polite"><strong>{turns === 1 ? '아세틸-CoA 1분자 기준 · 1회전' : '포도당 1분자 기준 · 2회전'}</strong><span>CO₂ <b>{balance.co2}</b></span><span>NADH <b>{balance.nadh}</b></span><span>FADH₂ <b>{balance.qh2}</b></span><span>ATP <b>{balance.gtp} 상당</b></span></div>
    <p className="basic-footnote">그림은 회로의 여러 반응을 네 가지 핵심 사건으로 묶은 것입니다. 일부 세포에서는 GTP 형태로 먼저 생성됩니다. 위 수지는 TCA 회로에서 얻은 양만 나타냅니다.</p>
    <p className="basic-footnote">※ FADH₂는 교과서식 요약입니다. 실제 반응에서 FAD는 효소에 결합되어 작용합니다. 자세한 내용은 + 심화에서 확인할 수 있습니다.</p>
  </div>
}
