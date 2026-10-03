import { useState } from 'react'
import { photoFacts, photosynthesisQuestions } from './content'
import type { ProgressKey } from './progress'
import { Arrow, Bridge, Figure, Legend, Node, PageTitle, Quiz } from './components/Shared'

export function Photosynthesis({ mark }: { mark: (key: ProgressKey) => void }) {
  const [mode, setMode] = useState<'linear' | 'cyclic' | 'calvin'>('linear')
  const [viewed, setViewed] = useState(false)
  return <>
    <PageTitle eyebrow="사전학습 02" title="광합성: 빛에서 화학적 에너지까지">빛이 전자의 에너지를 높이고, 막을 사이에 H⁺ 기울기를 만듭니다. 만들어진 ATP와 NADPH는 탄소 고정에 사용됩니다.</PageTitle>
    <section className="diagram-panel"><div className="section-heading"><h2>한눈에 보는 광합성</h2><span className="figure-note">엽록체 · 교육적 단순화</span></div><Legend /><PhotoOverview mode={mode} /></section>
    <div className="segment" aria-label="광합성 단계">{(['linear', 'cyclic', 'calvin'] as const).map((m, i) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{['비순환적 전자 흐름', '순환적 전자 흐름', 'Calvin cycle'][i]}</button>)}</div>
    <section className="photo-detail" aria-label="선택한 광합성 단계"><p className="eyebrow">{mode === 'calvin' ? '스트로마 · Stroma' : '틸라코이드 막 · Thylakoid membrane'}</p><h2>{mode === 'calvin' ? 'Calvin cycle · 탄소 고정' : mode === 'cyclic' ? 'Cyclic electron flow · 전자가 돌아오는 길' : 'Linear electron flow · 물에서 NADPH까지'}</h2>
      {mode === 'calvin' ? <><p className="mode-copy">Rubisco가 CO₂를 RuBP에 결합시킵니다. ATP와 NADPH를 사용해 탄소를 환원하고, 일부 G3P는 빠져나가며 나머지는 RuBP 재생에 사용됩니다.</p><CalvinCycle /><details><summary>심화 · 3 CO₂ 기준의 순계산</summary><p>3 CO₂ + 9 ATP + 6 NADPH → 순 G3P 1개. 환원 단계에서 6 ATP·6 NADPH, RuBP 재생에 3 ATP를 사용합니다. ADP, Pi, NADP⁺는 명반응으로 돌아갑니다.</p><p>G3P는 탄수화물 합성의 전구체입니다. Calvin cycle이 곧바로 포도당 한 분자를 내놓는 것은 아닙니다. 광호흡·수송·조절 비용은 이 순수지에서 생략합니다.</p></details></> : <><p className="mode-copy">{mode === 'linear' ? 'PSII와 PSI가 차례로 빛을 흡수합니다. 물이 전자의 공급원이며, NADP⁺가 전자를 받아 NADPH가 됩니다. H⁺의 lumen → stroma 귀환은 ATP 합성으로 연결됩니다.' : 'PSI에서 에너지를 얻은 전자가 ferredoxin 이후 PQ/cytochrome b₆f 계통으로 돌아옵니다. PSII를 거치지 않으므로 이 회로 자체는 O₂와 NADPH를 순생성하지 않습니다. 실제 엽록체에서는 비순환적 흐름과 함께 작동하며 ATP와 NADPH의 공급 균형에 기여합니다.'}</p><LightFlow cyclic={mode === 'cyclic'} /><p className="note">{mode === 'cyclic' ? '순환적 전자 흐름의 실제 경로와 조절은 식물과 조건에 따라 더 복잡할 수 있으며, 여기서는 핵심 기능 관계를 보여주는 교육용 단순화이다.' : '물 산화는 lumen에 H⁺를 공급하고, PQ/cytochrome b₆f 계통은 막을 가로지르는 H⁺ 이동에 기여합니다. ATP synthase는 이 기울기에 저장된 에너지를 이용합니다.'}</p><PhotoComparison mode={mode} /></>}
    </section>
    <section className="summary-section"><h2>광합성 전체 요약</h2><div className="table-scroll stack-table" tabIndex={0} role="region" aria-label="광합성 요약 표"><table><thead><tr>{['단계', '위치', '주요 입력', '주요 출력', 'H⁺ 기울기와의 관계'].map(v => <th key={v}>{v}</th>)}</tr></thead><tbody><tr><th scope="row">Linear light reactions</th><td data-label="위치">틸라코이드 막</td><td data-label="주요 입력">빛 · H₂O · NADP⁺ · ADP + Pi</td><td data-label="주요 출력">O₂ · NADPH · ATP</td><td data-label="H⁺ 기울기와의 관계">내강에 H⁺ 축적, ATP 합성에 사용</td></tr><tr><th scope="row">Cyclic electron flow</th><td data-label="위치">틸라코이드 막</td><td data-label="주요 입력">빛 · ADP + Pi</td><td data-label="주요 출력">ATP 생성에 기여<br />NADPH·O₂ 순생성 없음</td><td data-label="H⁺ 기울기와의 관계">PSI 중심 순환으로 기울기 형성에 기여</td></tr><tr><th scope="row">Calvin cycle</th><td data-label="위치">{photoFacts.calvinLocation} · 스트로마</td><td data-label="주요 입력">CO₂ · ATP · NADPH</td><td data-label="주요 출력">순 G3P · ADP + Pi · NADP⁺</td><td data-label="H⁺ 기울기와의 관계">기울기에서 얻은 ATP를 소비</td></tr></tbody></table></div></section>
    <Bridge />
    <Quiz questions={photosynthesisQuestions} onComplete={() => mark('photosynthesisQuizCompleted')} />
    <div className="lesson-end"><button className="button primary" onClick={() => { mark('photosynthesisViewed'); setViewed(true) }}>{viewed ? '✓ 학습 확인 완료' : '✓ 광합성 학습 확인'}</button><a className="button" href="#/explorer">다음 · 화학삼투 탐색기 →</a></div>
  </>
}
function PhotoOverview({ mode }: { mode: string }) {
  return <Figure title="엽록체에서 명반응과 Calvin cycle의 연결" description="틸라코이드 막의 명반응에서 ATP·NADPH를 만들고 스트로마의 Calvin cycle에서 사용합니다. 순환 모드에서는 ATP 보충 경로만 강조합니다." height={365}><rect x="20" y="18" width="960" height="321" rx="78" className="matrix" /><text x="66" y="52" className="region-label">CHLOROPLAST / STROMA · 스트로마</text><rect x="58" y="104" width="433" height="157" rx="56" className="high-side" stroke="#93ac7b" strokeWidth="6" /><text x="115" y="143" className="region-label">THYLAKOID LUMEN · 내강</text><text x="133" y="192" className="proton-symbol">H⁺　 H⁺　 H⁺　 H⁺</text><Node x={124} y={231} width={245} label={mode === 'cyclic' ? 'PSI 중심 순환' : '명반응 · Light reactions'} active={mode !== 'calvin'} /><text x="72" y="304" className="sub-label">틸라코이드 막 · Thylakoid membrane</text><Arrow d="M254 64 V108" kind="energy" label="Light" x={271} y={85} /><Arrow d="M491 210 H616" kind="energy" label={mode === 'cyclic' ? 'ATP 보충' : 'ATP + NADPH'} x={494} y={193} /><circle cx="725" cy="215" r="90" className={`cycle-ring ${mode === 'calvin' ? 'selected' : ''}`} /><text x="725" y="210" textAnchor="middle">Calvin cycle</text><text x="725" y="238" textAnchor="middle" className="sub-label">탄소 고정 · 환원 · 재생</text><Arrow d="M725 63 V120" label="CO₂" x={740} y={90} /><Arrow d="M815 215 H920" label="G3P" x={845} y={196} /><text x="839" y="252" className="sub-label">탄수화물의 전구체</text>{mode !== 'cyclic' && <text x="112" y="219" className="sub-label">PSII: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻</text>}<Arrow d="M637 278 Q536 327 379 279" kind="energy" label="ADP + Pi / NADP⁺" x={468} y={329} /></Figure>
}
export function LightFlow({ cyclic }: { cyclic: boolean }) {
  return <Figure title={cyclic ? 'PSI 중심의 순환적 전자 흐름' : 'PSII에서 NADPH까지 비순환적 전자 흐름'} description={cyclic ? 'PSI → ferredoxin → PQ/cytochrome b₆f → plastocyanin → PSI. H⁺ 기울기와 ATP 합성에 기여하며, NADPH·O₂ 순생성 없음.' : 'H₂O → PSII → PQ → cytochrome b₆f → PC → PSI → Fd → NADP⁺ reductase → NADPH. H⁺는 내강에 축적되고 ATP synthase를 통해 스트로마로 이동.'} height={440}>
    <rect x="15" y="20" width="970" height="125" rx="16" className="low-side" /><rect x="15" y="228" width="970" height="181" rx="16" className="high-side" /><rect x="15" y="160" width="970" height="61" rx="10" className="membrane-band" /><text x="36" y="45" className="region-label">STROMA · 스트로마</text><text x="35" y="393" className="region-label">THYLAKOID LUMEN · 내강 / H⁺ HIGH</text><text x="25" y="432" className="sub-label">단순화된 모형 · 막 위 = stroma, 막 아래 = lumen</text>
    {!cyclic && <><Node x={40} y={163} width={110} label="PSII" active /><Arrow d="M95 71 V158" kind="energy" label="빛" x={109} y={124} /><Arrow d="M88 293 V221" kind="electron" /><text x="32" y="320" className="sub-label">2 H₂O → O₂ + 4 H⁺ + 4 e⁻</text><text x="32" y="345" className="sub-label">물 산화 · 전자 공급</text><Arrow d="M150 188 H210" kind="electron" /></>}
    {cyclic && <text x="39" y="203" className="sub-label">PSII 미참여</text>}
    <Node x={215} y={166} width={61} label="PQ" /><Node x={333} y={163} width={113} label="cyt b₆f" active /><Node x={510} y={188} width={59} label="PC" /><Node x={624} y={163} width={87} label="PSI" active />
    <Arrow d="M277 188 H328" kind="electron" /><Arrow d="M446 201 H505" kind="electron" /><Arrow d="M569 210 H620" kind="electron" /><Arrow d="M667 90 V158" kind="energy" label="빛" x={679} y={127} />
    <Arrow d="M667 162 V65 H740" kind="electron" /><Node x={746} y={43} width={56} label="Fd" />
    {cyclic ? <><Arrow d="M775 41 V18 H246 V159" kind="electron" /><text x="353" y="45" className="sub-label">Fd → PQ/b₆f 계통으로 재진입 · e⁻</text><text x="807" y="70" className="sub-label">NADPH 순생성 없음</text><text x="33" y="298" className="sub-label">이 회로의 물 산화·O₂ 순생성 없음</text></> : <><Arrow d="M802 65 H821" kind="electron" /><Node x={825} y={40} width={157} label="NADP⁺ reductase" /><text x="835" y="24" className="sub-label">NADP⁺ → NADPH</text></>}
    <Arrow d="M432 113 V310" kind="proton" label="H⁺" x={445} y={277} /><text x="285" y="340" className="sub-label">PQ / b₆f: H⁺ 축적에 기여</text>
    {[472, 543, 615, 686, 757, 917].map(x => <text x={x} y="306" key={x} className="proton-symbol">H⁺</text>)}
    <g className="synthase"><rect x="830" y="154" width="63" height="91" rx="12" /><path d="M861 155 V140" /><ellipse cx="861" cy="132" rx="75" ry="29" /><text x="861" y="137" textAnchor="middle">ATP synthase</text></g>
    <Arrow d="M861 288 V146" kind="proton" label="H⁺" x={882} y={273} /><text x="752" y="98" className="sub-label">ADP + Pi → ATP (stroma)</text><text x="447" y="361" className="sub-label">PQ: plastoquinone / PC: plastocyanin / Fd: ferredoxin</text>
  </Figure>
}
function PhotoComparison({ mode }: { mode: 'linear' | 'cyclic' }) {
  const labels = { psii: 'PSII 참여', psi: 'PSI 참여', oxygen: 'O₂ 순생성', nadph: 'NADPH 순생성', pmf: 'H⁺ 기울기 / ATP에 기여' }
  return <div className="photo-comparison table-scroll" tabIndex={0} role="region" aria-label="비순환과 순환 전자 흐름 비교"><table><thead><tr><th>비교 항목</th><th>Linear electron flow</th><th>Cyclic electron flow</th></tr></thead><tbody>{(Object.keys(labels) as (keyof typeof labels)[]).map(key => <tr key={key}><th scope="row">{labels[key]}</th>{(['linear', 'cyclic'] as const).map(m => <td key={m} className={mode === m ? 'current' : ''}>{photoFacts[m][key] ? '○ 있음' : '× 없음'}</td>)}</tr>)}</tbody></table></div>
}
function CalvinCycle() {
  return <Figure title="Calvin cycle의 세 단계와 에너지 소비" description="스트로마에서 CO₂ 고정 → ATP·NADPH를 쓰는 환원 → ATP를 쓰는 RuBP 재생. 3 CO₂당 G3P 1개 순생성. G3P는 탄수화물 합성의 전구체입니다." height={435}>
    <circle cx="474" cy="228" r="125" className="cycle-ring" /><text x="474" y="220" textAnchor="middle" className="large-label">Calvin cycle</text><text x="474" y="248" textAnchor="middle">STROMA</text>
    <Node x={240} y={75} width={148} label="3 RuBP · 5C" /><Arrow d="M389 97 H560" label="Rubisco · 탄소 고정" x={394} y={78} /><Node x={568} y={75} width={159} label="6 3-PGA · 3C" /><Arrow d="M548 25 V91" label="3 CO₂" x={560} y={38} />
    <Arrow d="M648 121 V268" label="02 환원" x={660} y={262} /><Node x={568} y={284} width={159} label="6 G3P · 3C" />
    <Arrow d="M894 160 H658" kind="energy" label="6 ATP → 6 ADP" x={749} y={145} /><Arrow d="M894 200 H658" kind="electron" label="6 NADPH → 6 NADP⁺" x={744} y={239} />
    <Arrow d="M727 305 H884" label="순 G3P 1개" x={754} y={286} /><text x="773" y="352" className="sub-label">탄수화물 합성으로</text><Arrow d="M567 305 H388" label="5 G3P" x={434} y={330} /><Node x={240} y={284} width={148} label="RuBP 재생" />
    <Arrow d="M312 283 V123" label="03 재생" x={228} y={219} /><Arrow d="M90 193 H300" kind="energy" label="3 ATP → 3 ADP" x={84} y={170} /><text x="393" y="394" className="sub-label">01 탄소 고정 → 02 환원 → 03 RuBP 재생</text>
  </Figure>
}
