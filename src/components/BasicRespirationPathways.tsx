import { useState } from 'react'
import { glycolysisLedger, tcaBalance } from '../respirationPathways'

export function BasicGlycolysis() {
  return <div className="respiration-pathway basic-pathway basic-glycolysis">
    <div className="pathway-heading"><h3>해당과정의 탄소와 ATP 수지</h3><span>포도당 1분자 기준</span></div>
    <p className="basic-lead">포도당 1분자는 세포질에서 두 분자의 피루브산으로 전환된다.</p>
    <ol className="basic-flow" aria-label="해당과정의 네 가지 핵심 사건">
      <li><span className="basic-phase">에너지 투자 단계</span><h4><span>①</span> 두 차례의 인산화</h4><div className="basic-molecule">포도당 <b>6C</b><span className="basic-arrow">↓</span>6탄당 인산화 중간체</div><strong className="basic-product investment">ATP {glycolysisLedger.invested}개 사용</strong><p>포도당과 과당-6-인산이 각각 ATP 한 분자로부터 인산기를 받는다.</p></li>
      <li><span className="basic-phase">탄소 골격 나누기</span><h4><span>②</span> 두 개의 3탄당으로 분리</h4><div className="basic-molecule">6C<span className="basic-arrow">↓</span><span className="carbon-pair"><b>3C</b> + <b>3C</b></span></div><p>두 3탄당은 모두 G3P가 되어 이후 반응을 거친다.</p></li>
      <li><span className="basic-phase">전자 운반체의 환원</span><h4><span>③</span> 3탄당 산화</h4><div className="basic-molecule">G3P 2분자 산화<span className="basic-arrow">↓</span>2 NAD⁺ → 2 NADH</div><strong className="basic-product carrier">NADH 2개 생성</strong><p>산화 과정에서 무기 인산이 첨가되어 1,3-이중인산글리세르산이 형성된다.</p></li>
      <li><span className="basic-phase">에너지 회수 단계</span><h4><span>④</span> ATP 회수와 피루브산 생성</h4><div className="basic-molecule">3탄당 중간체 2분자<span className="basic-arrow">↓</span>피루브산 2분자 <b>각 3C</b></div><strong className="basic-product">ATP {glycolysisLedger.produced}개 생성</strong></li>
    </ol>
    <div className="pathway-ledger basic-ledger" aria-label="해당과정 기본 수지"><span>ATP 사용 <b>{glycolysisLedger.invested}</b></span><span>ATP 생성 <b>{glycolysisLedger.produced}</b></span><strong>순 ATP {glycolysisLedger.net}</strong><span>NADH <b>2</b></span><span>피루브산 <b>2</b></span></div>
    <p className="basic-footnote">이 과정의 ATP는 반응 중간체의 인산기가 ADP에 직접 전달되는 <strong>기질수준 인산화</strong>로 생성된다.</p>
  </div>
}

export function BasicPyruvateOxidation() {
  return <div className="respiration-pathway basic-pathway basic-pdh">
    <div className="pathway-heading"><h3>피루브산의 산화적 탈탄산</h3><span>피루브산 1분자의 변화</span></div>
    <p className="basic-lead">미토콘드리아 기질의 피루브산 탈수소효소 복합체가 피루브산의 탈탄산과 아세틸-CoA 생성을 촉매한다.</p>
    <figure className="basic-pdh-diagram">
      <div className="basic-pdh-flow">
        <div className="basic-endpoint">피루브산<strong>3C</strong></div><span className="basic-connector" aria-hidden="true">→</span>
        <div className="basic-coupled-events"><span className="basic-phase">복합체의 반응 산물</span><ul><li>CO₂ <strong>1개 방출</strong></li><li>NADH <strong>1개 생성</strong></li><li><strong>아세틸기 전달</strong></li></ul></div><span className="basic-connector" aria-hidden="true">→</span>
        <div className="basic-endpoint">아세틸-CoA<strong>아세틸기 2C</strong></div>
      </div>

    </figure>
    <div className="basic-equation" aria-label="아세틸-CoA 생성 기본 수지"><span>포도당 1분자 기준</span><p>피루브산 2분자 + CoA 2개 + NAD⁺ 2개 <span aria-hidden="true">→</span> 아세틸-CoA 2분자 + CO₂ 2개 + NADH 2개 + H⁺ 2개</p></div>
    <p className="basic-footnote">이 반응에서 ATP는 직접 생성되지 않는다. 아세틸-CoA는 TCA 회로에 아세틸기를 공급한다.</p>
  </div>
}

export function BasicTca() {
  const [turns, setTurns] = useState<1 | 2>(1)
  const balance = tcaBalance(turns)
  return <div className="respiration-pathway basic-pathway basic-tca">
    <div className="pathway-heading"><h3>TCA 회로의 반응과 수지</h3><span>아세틸기 1개당 1회전</span></div>
    <div className="basic-cycle">
      <div className="basic-cycle-center"><span aria-hidden="true">↻</span><strong>TCA 회로</strong><small>1회전</small></div>
      <ol className="basic-cycle-events" aria-label="TCA 회로의 네 가지 핵심 사건">
        <li><h4><span>①</span> 아세틸-CoA 유입</h4><p className="basic-molecule">아세틸기 <b>2C</b> + 옥살로아세트산 <b>4C</b><span className="basic-arrow">↓</span>시트르산 <b>6C</b></p></li>
        <li><h4><span>②</span> 탄소 방출</h4><p className="basic-molecule">6C → 5C → 4C</p><strong className="basic-product investment">CO₂ 2개 방출</strong></li>
        <li><h4><span>③</span> 전자 운반체의 환원</h4><div className="basic-carriers"><strong>NADH 3개</strong><strong>FADH₂ 1개</strong></div></li>
        <li><h4><span>④</span> 기질수준 인산화와 수용체 재생</h4><strong className="basic-product">ATP 1개 상당 생성</strong><p className="basic-molecule">옥살로아세트산(4C) 재생</p></li>
      </ol>
    </div>
    <div className="pathway-filters basic-basis" role="group" aria-label="TCA 기본 수지 기준"><button aria-pressed={turns === 1} onClick={() => setTurns(1)}>아세틸-CoA 1분자</button><button aria-pressed={turns === 2} onClick={() => setTurns(2)}>포도당 1분자</button></div>
    <div className="pathway-ledger basic-ledger" aria-label="TCA 기본 산물 수지" aria-live="polite"><strong>{turns === 1 ? '아세틸-CoA 1분자 기준 / 1회전' : '포도당 1분자 기준 / 2회전'}</strong><span>CO₂ <b>{balance.co2}</b></span><span>NADH <b>{balance.nadh}</b></span><span>FADH₂ <b>{balance.qh2}</b></span><span>ATP <b>{balance.gtp} 상당</b></span></div>
    <p className="basic-footnote">숙시닐-CoA가 숙신산으로 전환될 때 GTP 또는 ATP가 생성된다. GTP 1분자는 ATP 1분자에 해당한다.</p>
    <p className="basic-footnote">숙신산이 산화되면 효소에 결합된 FAD가 FADH₂로 환원된다. 이 전자는 유비퀴논으로 전달된다.</p>
  </div>
}
