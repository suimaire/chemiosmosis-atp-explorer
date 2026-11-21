import { useState } from 'react'
import { photoFacts, photosynthesisQuestions } from './content'
import type { ProgressKey } from './progress'
import { Arrow, Bridge, Figure, Legend, Node, PageTitle, Quiz } from './components/Shared'

export function Photosynthesis({ mark }: { mark: (key: ProgressKey) => void }) {
  const [mode, setMode] = useState<'linear' | 'cyclic' | 'calvin'>('linear')
  const [viewed, setViewed] = useState(false)
  return <>
    <PageTitle eyebrow="사전학습 02" title="광합성">틸라코이드 막의 명반응은 ATP와 NADPH를 공급한다. 스트로마의 캘빈 회로는 이를 사용해 CO₂로부터 탄수화물의 전구체를 합성한다.</PageTitle>
    <section className="diagram-panel"><div className="section-heading"><h2>엽록체의 반응 구획</h2></div><Legend /><PhotoOverview mode={mode} /></section>
    <div className="segment" aria-label="광합성 단계">{(['linear', 'cyclic', 'calvin'] as const).map((m, i) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{['비순환적 전자 흐름', '순환적 전자 흐름', '캘빈 회로'][i]}</button>)}</div>
    <section className="photo-detail" aria-label="선택한 광합성 단계"><p className="eyebrow">{mode === 'calvin' ? '스트로마' : '틸라코이드 막'}</p><h2>{mode === 'calvin' ? '캘빈 회로의 탄소 고정과 환원' : mode === 'cyclic' ? '광계 I의 순환적 전자 흐름' : '물에서 NADP⁺까지의 전자전달'}</h2>
      {mode === 'calvin' ? <>
        <p className="mode-copy">루비스코가 CO₂를 RuBP(5C)에 결합시키면 불안정한 6탄소 중간체가 3-포스포글리세르산(3-PGA) 두 분자로 나뉜다. 3-PGA는 ATP로 인산화된 뒤 NADPH에 의해 글리세르알데하이드-3-인산(G3P)으로 환원된다.</p>
        <CalvinCycle />
        <details>
          <summary>CO₂ 3분자당 탄소와 에너지 수지</summary>
          <p>CO₂ 3분자가 고정될 때 3-PGA 6분자의 환원에 ATP 6분자와 NADPH 6분자가 쓰인다. 생성된 G3P 6분자 중 5분자와 ATP 3분자가 RuBP 3분자의 재생에 쓰이고 G3P 1분자가 순생성된다.</p>
          <p>이 수지는 캘빈 회로의 반응만 합산한 값으로, 광호흡과 수송에 필요한 에너지는 제외한다.</p>
        </details>
      </> : <>
        <p className="mode-copy">
          {mode === 'linear'
            ? '광계 II(PSII)의 반응 중심은 빛을 흡수한 뒤 들뜬 전자를 수용체에 전달하고, 잃은 전자는 물의 산화로 보충한다. 전자는 플라스토퀴논(PQ), 시토크롬 b₆f, 플라스토시아닌(PC)을 거쳐 광계 I(PSI)에 도달한다. PSI에서 빛에 의해 다시 전하 분리가 일어나고, 전자는 페레독신(Fd)으로 전달된다. 페레독신-NADP⁺ 환원효소(FNR)는 환원된 Fd 두 분자로부터 전자를 하나씩 받아 NADP⁺를 NADPH로 환원한다.'
            : '환원된 페레독신(Fd)의 전자가 NADP⁺ 대신 플라스토퀴논(PQ)으로 전달된다. 전자는 시토크롬 b₆f와 플라스토시아닌(PC)을 거쳐 PSI로 돌아온다. 이 과정에서 내강으로 H⁺가 이동하므로 물을 추가로 산화하거나 NADPH를 순생성하지 않고도 ATP 합성을 뒷받침한다.'}
        </p>
        <LightFlow cyclic={mode === 'cyclic'} />
        <PhotoComparison mode={mode} />
      </>}
    </section>
    <section className="summary-section"><h2>광합성 전체 요약</h2><div className="table-scroll stack-table" tabIndex={0} role="region" aria-label="광합성 요약 표"><table><thead><tr>{['단계', '위치', '주요 입력', '주요 출력', 'H⁺ 기울기와의 관계'].map(v => <th key={v}>{v}</th>)}</tr></thead><tbody><tr><th scope="row">비순환적 전자 흐름</th><td data-label="위치">틸라코이드 막</td><td data-label="주요 입력">빛, H₂O, NADP⁺, ADP + Pi</td><td data-label="주요 출력">O₂, NADPH, ATP</td><td data-label="H⁺ 기울기와의 관계">내강에 H⁺ 축적, ATP 합성에 사용</td></tr><tr><th scope="row">순환적 전자 흐름</th><td data-label="위치">틸라코이드 막</td><td data-label="주요 입력">빛, ADP + Pi</td><td data-label="주요 출력">ATP 합성<br />NADPH와 O₂ 순생성 없음</td><td data-label="H⁺ 기울기와의 관계">PSI 중심 순환으로 기울기 형성에 기여</td></tr><tr><th scope="row">캘빈 회로</th><td data-label="위치">{photoFacts.calvinLocation}</td><td data-label="주요 입력">CO₂, ATP, NADPH</td><td data-label="주요 출력">순 G3P, ADP + Pi, NADP⁺</td><td data-label="H⁺ 기울기와의 관계">기울기에서 얻은 ATP를 소비</td></tr></tbody></table></div></section>
    <Bridge />
    <Quiz questions={photosynthesisQuestions} onComplete={() => mark('photosynthesisQuizCompleted')} />
    <div className="lesson-end"><button className="button primary" onClick={() => { mark('photosynthesisViewed'); setViewed(true) }}>{viewed ? '✓ 학습 확인 완료' : '✓ 광합성 학습 확인'}</button><a className="button" href="#/explorer">화학삼투 탐색기 →</a></div>
  </>
}
function PhotoOverview({ mode }: { mode: string }) {
  return <Figure title="엽록체에서 명반응과 캘빈 회로의 연결" description={mode === 'cyclic' ? '순환적 전자 흐름은 캘빈 회로에 필요한 ATP를 추가로 공급한다. NADPH는 비순환적 전자 흐름에서 공급된다.' : '캘빈 회로에서 생성된 ADP, 무기 인산, NADP⁺는 스트로마 쪽에서 다시 ATP와 NADPH를 만드는 데 쓰인다.'} height={365}><rect x="20" y="18" width="960" height="321" rx="78" className="matrix" /><text x="66" y="52" className="region-label">스트로마</text><rect x="58" y="104" width="433" height="157" rx="56" className="high-side" stroke="#93ac7b" strokeWidth="6" /><text x="115" y="143" className="region-label">틸라코이드 내강</text><text x="133" y="192" className="proton-symbol">H⁺　 H⁺　 H⁺　 H⁺</text><Node x={124} y={231} width={245} label={mode === 'cyclic' ? 'PSI 중심 순환' : '명반응'} active={mode !== 'calvin'} /><text x="72" y="304" className="sub-label">틸라코이드 막</text><Arrow d="M254 64 V108" kind="energy" label="빛" x={271} y={85} /><Arrow d="M491 210 H616" kind="energy" label={mode === 'cyclic' ? 'ATP 보충' : 'ATP + NADPH'} x={494} y={193} /><circle cx="725" cy="215" r="90" className={`cycle-ring ${mode === 'calvin' ? 'selected' : ''}`} /><text x="725" y="210" textAnchor="middle">캘빈 회로</text><text x="725" y="238" textAnchor="middle" className="sub-label">고정 → 환원 → 재생</text><Arrow d="M725 63 V120" label="CO₂" x={740} y={90} /><Arrow d="M815 215 H920" label="G3P" x={845} y={196} /><text x="839" y="252" className="sub-label">탄수화물의 전구체</text>{mode !== 'cyclic' && <text x="112" y="219" className="sub-label">PSII: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻</text>}<Arrow d="M637 278 Q536 327 379 279" kind="energy" label={mode === 'cyclic' ? 'ADP + Pi' : 'ADP + Pi / NADP⁺'} x={468} y={329} /></Figure>
}
export function LightFlow({ cyclic }: { cyclic: boolean }) {
  return <Figure title={cyclic ? 'PSI 중심의 순환적 전자 흐름' : 'PSII에서 NADPH까지 비순환적 전자 흐름'} description={cyclic ? '순환 경로에서는 PSI가 받은 전자를 다시 들뜨게 한다. PQ와 시토크롬 b₆f를 거치는 동안 형성된 H⁺ 기울기는 ATP 합성에 이용된다.' : 'PSII에서 물이 산화될 때 H⁺가 내강에 방출된다. PQ는 환원될 때 스트로마에서 H⁺를 받아들이며, 생성된 PQH₂가 시토크롬 b₆f에서 산화될 때 내강으로 H⁺를 방출한다. H⁺는 ATP 합성효소를 통해 스트로마로 돌아온다.'} height={415}>
    <rect x="15" y="20" width="970" height="125" rx="16" className="low-side" /><rect x="15" y="228" width="970" height="181" rx="16" className="high-side" /><rect x="15" y="160" width="970" height="61" rx="10" className="membrane-band" /><text x="36" y="45" className="region-label">스트로마</text><text x="35" y="393" className="region-label">틸라코이드 내강 (높은 H⁺ 농도)</text>
    {!cyclic && <><Node x={40} y={163} width={110} label="PSII" active /><Arrow d="M95 71 V158" kind="energy" label="빛" x={109} y={124} /><Arrow d="M88 293 V221" kind="electron" /><text x="32" y="320" className="sub-label">2 H₂O → O₂ + 4 H⁺ + 4 e⁻</text><text x="32" y="345" className="sub-label">물의 산화</text><Arrow d="M150 188 H210" kind="electron" /></>}
    {cyclic && <text x="39" y="203" className="sub-label">PSII 미참여</text>}
    <Node x={215} y={166} width={61} label="PQ" /><Node x={333} y={163} width={113} label="cyt b₆f" active /><Node x={510} y={188} width={59} label="PC" /><Node x={624} y={163} width={87} label="PSI" active />
    <Arrow d="M277 188 H328" kind="electron" /><Arrow d="M446 201 H505" kind="electron" /><Arrow d="M569 210 H620" kind="electron" /><Arrow d="M667 90 V158" kind="energy" label="빛" x={679} y={127} />
    <Arrow d="M667 162 V65 H740" kind="electron" /><Node x={746} y={43} width={56} label="Fd" />
    {cyclic ? <><Arrow d="M775 41 V18 H246 V159" kind="electron" /><text x="353" y="45" className="sub-label">Fd → PQ로 전자 전달</text><text x="807" y="70" className="sub-label">NADPH 순생성 없음</text><text x="33" y="298" className="sub-label">물의 산화와 O₂ 발생 없음</text></> : <><Arrow d="M802 65 H821" kind="electron" /><Node x={825} y={40} width={157} label="FNR" /><text x="835" y="24" className="sub-label">NADP⁺ → NADPH</text></>}
    <Arrow d="M432 113 V310" kind="proton" label="H⁺" x={445} y={277} /><text x="285" y="340" className="sub-label">PQH₂ 산화로 H⁺ 방출</text>
    {[472, 543, 615, 686, 757, 917].map(x => <text x={x} y="306" key={x} className="proton-symbol">H⁺</text>)}
    <g className="synthase"><rect x="830" y="154" width="63" height="91" rx="12" /><path d="M861 155 V140" /><ellipse cx="861" cy="132" rx="75" ry="29" /><text x="861" y="137" textAnchor="middle">ATP 합성효소</text></g>
    <Arrow d="M861 288 V146" kind="proton" label="H⁺" x={882} y={273} /><text x="752" y="98" className="sub-label">ADP + Pi → ATP (스트로마)</text><text x="447" y="361" className="sub-label">PQ = plastoquinone / PC = plastocyanin / Fd = ferredoxin</text>
  </Figure>
}
function PhotoComparison({ mode }: { mode: 'linear' | 'cyclic' }) {
  const labels = { psii: 'PSII 참여', psi: 'PSI 참여', oxygen: 'O₂ 순생성', nadph: 'NADPH 순생성', pmf: 'H⁺ 기울기 형성과 ATP 합성' }
  return <div className="photo-comparison table-scroll" tabIndex={0} role="region" aria-label="비순환과 순환 전자 흐름 비교"><table><thead><tr><th>비교 항목</th><th>비순환적 전자 흐름</th><th>순환적 전자 흐름</th></tr></thead><tbody>{(Object.keys(labels) as (keyof typeof labels)[]).map(key => <tr key={key}><th scope="row">{labels[key]}</th>{(['linear', 'cyclic'] as const).map(m => <td key={m} className={mode === m ? 'current' : ''}>{photoFacts[m][key] ? '○ 있음' : '× 없음'}</td>)}</tr>)}</tbody></table></div>
}
function CalvinCycle() {
  return <Figure title="캘빈 회로의 세 단계와 에너지 소비" description="CO₂ 3분자에서 G3P 1분자가 순생성된다. 이때 ATP 9분자와 NADPH 6분자가 소비된다." height={435}>
    <circle cx="474" cy="228" r="125" className="cycle-ring" /><text x="474" y="220" textAnchor="middle" className="large-label">캘빈 회로</text><text x="474" y="248" textAnchor="middle">스트로마</text>
    <Node x={240} y={75} width={148} label="3 RuBP (5C)" /><Arrow d="M389 97 H560" label="루비스코" x={394} y={78} /><Node x={568} y={75} width={159} label="6 3-PGA (3C)" /><Arrow d="M548 25 V91" label="3 CO₂" x={560} y={38} />
    <Arrow d="M648 121 V268" label="02 환원" x={660} y={262} /><Node x={568} y={284} width={159} label="6 G3P (3C)" />
    <Arrow d="M894 160 H658" kind="energy" label="6 ATP → 6 ADP" x={749} y={145} /><Arrow d="M894 200 H658" kind="electron" label="6 NADPH → 6 NADP⁺" x={744} y={239} />
    <Arrow d="M727 305 H884" label="순 G3P 1개" x={754} y={286} /><text x="773" y="352" className="sub-label">탄수화물 합성으로</text><Arrow d="M567 305 H388" label="5 G3P" x={434} y={330} /><Node x={240} y={284} width={148} label="RuBP 재생" />
    <Arrow d="M312 283 V123" label="03 재생" x={228} y={219} /><Arrow d="M90 193 H300" kind="energy" label="3 ATP → 3 ADP" x={84} y={170} /><text x="393" y="394" className="sub-label">01 탄소 고정 → 02 환원 → 03 RuBP 재생</text>
  </Figure>
}
