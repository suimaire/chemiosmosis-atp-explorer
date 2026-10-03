import { useState } from 'react'
import { respirationSteps, respirationQuestions } from './content'
import type { ProgressKey } from './progress'
import { Arrow, Figure, Legend, Node, PageTitle, Quiz } from './components/Shared'
import { Membrane } from './components/Membrane'

export function Respiration({ mark }: { mark: (key: ProgressKey) => void }) {
  const [step, setStep] = useState(0)
  const [viewed, setViewed] = useState(false)
  const selected = respirationSteps[step]
  return <>
    <PageTitle eyebrow="01 / CELLULAR RESPIRATION" title="세포호흡: 탄소의 흐름에서 전자의 흐름까지">포도당의 탄소를 따라간 뒤, 전자가 어디로 옮겨 가는지 살펴보세요. 수량은 포도당 1분자를 기준으로 합니다.</PageTitle>
    <section className="diagram-panel"><div className="section-heading"><h2>한눈에 보는 세포호흡</h2><span className="pill">진핵세포 · 교육적 단순화</span></div><Legend /><RespirationOverview step={step} /></section>
    <div className="step-tabs" aria-label="세포호흡 단계">{respirationSteps.map((s, i) => <button key={s.title} aria-pressed={step === i} onClick={() => setStep(i)}><span>0{i + 1}</span>{s.title}</button>)}</div>
    <section className="step-detail" aria-label="선택한 세포호흡 단계"><div className="detail-intro"><p className="eyebrow">{selected.location}</p><h2>0{step + 1} · {selected.title}</h2><p>{selected.detail}</p><p className="note">{selected.key}</p></div>
      {step < 2 && <Figure title={selected.title} description={step === 0 ? 'ATP 2 투자 → ATP 4 생성: 순 ATP 2. NADH 2 생성.' : '피루브산 두 분자에서 CO₂ 2개와 NADH 2개 생성. CoA가 아세틸기에 결합.'} height={225}>{step === 0 ? <><Node x={70} y={70} label="Glucose" sub="6C × 1" active /><Arrow d="M215 100 H410" label="탄소 분리" x={285} y={82} /><Node x={440} y={35} label="Pyruvate" sub="3C" /><Node x={440} y={125} label="Pyruvate" sub="3C" /><text x="700" y="85" className="large-label">2 NADH</text><text x="700" y="127" className="large-label">순 ATP 2</text></> : <><Node x={70} y={65} label="Pyruvate" sub="3C × 2" /><Arrow d="M215 95 H455" label="− 2 CO₂ / + 2 NADH" x={260} y={64} /><Node x={485} y={65} width={190} label="Acetyl-CoA" sub="2C acetyl × 2" active /><Arrow d="M760 95 H680" label="+ CoA" x={735} y={65} /></>}</Figure>}
      {step === 2 && <><TcaCycle /><details><summary>심화 · 회로의 중간체와 위치</summary><p>citrate → isocitrate → α-ketoglutarate → succinyl-CoA → succinate → fumarate → malate → oxaloacetate.</p><p>대부분의 반응은 기질에서 일어나지만 succinate dehydrogenase (Complex II)는 내막에 결합되어 기질 쪽에서 작용합니다. 방출되는 CO₂의 탄소가 첫 회전부터 새로 들어온 아세틸기의 탄소인 것은 아닙니다.</p></details></>}
      {step === 3 && <><Membrane context="mito" /><p className="quiet">FAD는 Complex II에 결합된 보조인자입니다. FADH₂라는 표기는 TCA에서 얻는 환원력의 요약입니다. 세포질 NADH의 환원력은 셔틀을 거쳐 전달되며, 총 ATP 수율은 조건에 따라 달라집니다.</p></>}
    </section>
    <section className="summary-section"><h2>세포호흡 전체 요약</h2><div className="table-scroll" tabIndex={0} role="region" aria-label="세포호흡 요약 표"><table><thead><tr>{['단계', '위치', '주요 입력', '주요 출력', 'ATP 생성 방식', '화학삼투와의 관계'].map(v => <th key={v}>{v}</th>)}</tr></thead><tbody>{respirationSteps.map(s => <tr key={s.title}><th scope="row">{s.english}</th><td>{s.location}</td><td>{s.input}</td><td>{s.output}</td><td>{s.method}</td><td>{s.relation}</td></tr>)}</tbody></table></div></section>
    <Quiz questions={respirationQuestions} onComplete={() => mark('respirationQuizCompleted')} />
    <div className="lesson-end"><button className="button primary" onClick={() => { mark('respirationViewed'); setViewed(true) }}>{viewed ? '✓ 학습 확인 완료' : '✓ 세포호흡 학습 확인'}</button><a className="button" href="#/photosynthesis">다음 · 광합성 →</a><a href="#/explorer">탐색기로 이동 →</a></div>
  </>
}
function RespirationOverview({ step }: { step: number }) {
  return <Figure title="세포호흡 구획과 전체 경로" description="세포질의 해당과정 → 기질의 아세틸-CoA 생성·TCA → 내막의 전자전달·H⁺ 기울기 → ATP. 아래 단계 버튼으로 강조 부분을 바꾸세요." height={465}>
    <text x="25" y="30" className="region-label">CYTOSOL · 세포질</text>
    <rect x="245" y="48" width="735" height="370" rx="85" className="outer-membrane" /><text x="630" y="37" className="sub-label">미토콘드리아 외막 · Outer membrane</text>
    <rect x="277" y="117" width="670" height="269" rx="60" className="matrix" /><text x="375" y="78" className="region-label">막사이공간 · INTERMEMBRANE SPACE</text><text x="438" y="365" className="region-label">MATRIX · 기질</text><text x="737" y="407" className="sub-label">미토콘드리아 내막 · Inner membrane</text>
    <Node x={24} y={106} width={172} label="Glucose · 6C" sub="01 해당과정" active={step === 0} /><Arrow d="M110 166 V207" /><Node x={24} y={216} width={172} label="2 Pyruvate · 3C" /><Arrow d="M196 240 H317" />
    <Node x={330} y={210} width={166} label="02 아세틸-CoA 생성" sub="2 Acetyl-CoA · 2C" active={step === 1} /><Arrow d="M496 240 H543" /><circle cx="610" cy="240" r="58" className={`cycle-ring ${step === 2 ? 'selected' : ''}`} /><text x="610" y="236" textAnchor="middle">03 TCA cycle</text><text x="610" y="261" textAnchor="middle" className="sub-label">회로 2회</text>
    <text x="338" y="297" className="sub-label">2 CO₂ + 2 NADH</text><text x="524" y="327" className="sub-label">4 CO₂ · 6 NADH · 2 FADH₂</text>
    <Arrow d="M641 184 V150" kind="electron" label="NADH / FADH₂ · e⁻" x={687} y={251} /><Node x={581} y={91} width={166} label="04 전자전달계" sub="내막에서 전자 전달" active={step === 3} />
    <Arrow d="M714 196 V63" kind="proton" label="H⁺" x={723} y={78} /><Arrow d="M853 68 V207" kind="proton" label="H⁺" x={868} y={82} /><Node x={771} y={94} width={158} label="ATP synthase" /><text x="782" y="229">ADP + Pi → ATP</text>
    <Arrow d="M110 277 V318 H312 V170 H602 V155" kind="electron" label="2 NADH · 환원력은 셔틀 경유" x={32} y={344} /><Arrow d="M415 210 V186 H574 V155" kind="electron" />
    <text x="38" y="384" className="sub-label">기질수준 인산화: 순 ATP 2</text><text x="500" y="446" className="sub-label">실선 = 탄소 · 점선 = 전자/환원력 · H⁺ 표기 = 막 횡단 이동</text>
  </Figure>
}
function TcaCycle() {
  return <Figure title="TCA cycle 두 회전의 수지" description="아세틸-CoA의 탄소가 회로에 들어오고 옥살로아세트산이 재생됩니다. 포도당 1분자 기준: 4 CO₂, 6 NADH, 2 FADH₂, 2 GTP 또는 ATP 상당량." height={340}><circle cx="480" cy="172" r="109" className="cycle-ring" /><Arrow d="M430 74 A109 109 0 0 1 586 150" /><Arrow d="M582 210 A109 109 0 0 1 397 240" /><Arrow d="M377 206 A109 109 0 0 1 401 100" /><text x="480" y="160" className="large-label" textAnchor="middle">TCA CYCLE</text><text x="480" y="188" textAnchor="middle">2회 / glucose 1</text><Node x={49} y={33} width={198} label="2 Acetyl-CoA" sub="2C × 2" /><Arrow d="M247 63 H384" /><text x="268" y="98" className="sub-label">옥살로아세트산 + 아세틸기</text><Arrow d="M590 135 H713" kind="electron" /><text x="735" y="137">6 NADH + 2 FADH₂</text><Arrow d="M578 224 H713" /><text x="735" y="230">4 CO₂ 방출</text><Arrow d="M380 247 H244" kind="energy" /><text x="59" y="254">2 GTP / ATP 상당량</text><text x="399" y="311" className="sub-label">옥살로아세트산 재생</text></Figure>
}
