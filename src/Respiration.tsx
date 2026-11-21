import { useState } from 'react'
import { respirationSteps, respirationQuestions } from './content'
import type { ProgressKey } from './progress'
import { Arrow, Figure, Legend, Node, PageTitle, Quiz } from './components/Shared'
import { Membrane } from './components/Membrane'
import { GlycolysisMap as AdvancedGlycolysis } from './components/GlycolysisMap'
import { PyruvateOxidationMap as AdvancedPyruvateOxidation } from './components/PyruvateOxidationMap'
import { TcaCycleMap as AdvancedTca } from './components/TcaCycleMap'
import { BasicGlycolysis, BasicPyruvateOxidation, BasicTca } from './components/BasicRespirationPathways'
import './components/RespirationPathways.css'

const modeHints = ['효소 이름과 10단계 반응까지 보기', '효소 복합체의 세 단계까지 보기', '8단계 반응과 전자 운반까지 보기']
export function Respiration({ mark }: { mark: (key: ProgressKey) => void }) {
  const [step, setStep] = useState(0)
  const [viewed, setViewed] = useState(false)
  const [advancedSteps, setAdvancedSteps] = useState<Record<number, boolean>>({})
  const selected = respirationSteps[step]
  const advanced = advancedSteps[step] ?? false
  return <>
    <PageTitle eyebrow="사전학습 01" title="세포호흡">포도당의 산화로 얻은 전자는 NADH와 효소 결합 FADH₂를 거쳐 미토콘드리아 내막의 전자전달계로 전달된다.</PageTitle>
    <section className="diagram-panel"><div className="section-heading"><h2>진핵세포의 세포호흡</h2></div><Legend /><RespirationOverview step={step} /></section>
    <div className="step-tabs" aria-label="세포호흡 단계">{respirationSteps.map((s, i) => <button key={s.title} aria-pressed={step === i} onClick={() => setStep(i)}><span>0{i + 1}</span>{s.title}</button>)}</div>
    <section className="step-detail respiration-detail" aria-label="선택한 세포호흡 단계" data-mode={advanced ? 'advanced' : 'basic'}><div className="detail-intro"><div className="respiration-detail-heading"><div><p className="eyebrow">{selected.location}</p><h2>0{step + 1} {advanced ? selected.english : selected.title}</h2></div>{step < 3 && <div className="mode-control"><span className="mode-hint" id="respiration-mode-hint">{advanced ? '기본 반응 보기' : modeHints[step]}</span><button className="respiration-mode-toggle" aria-expanded={advanced} aria-controls="respiration-pathway-layer" aria-describedby="respiration-mode-hint" onClick={() => setAdvancedSteps(previous => ({ ...previous, [step]: !previous[step] }))}>{advanced ? '− 기본으로' : '+ 심화'}</button></div>}</div>{(advanced || step === 3) && <><p>{selected.detail}</p>{selected.key && <p>{selected.key}</p>}</>}</div>
      <div id="respiration-pathway-layer">
      {step === 0 && (advanced ? <AdvancedGlycolysis /> : <BasicGlycolysis />)}
      {step === 1 && (advanced ? <AdvancedPyruvateOxidation /> : <BasicPyruvateOxidation />)}
      {step === 2 && (advanced ? <AdvancedTca onOpenEtc={() => { setStep(3); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.step-tabs button:nth-child(4)')?.focus()) }} /> : <BasicTca />)}
      {step === 3 && <><Membrane context="mito" /><p className="quiet">해당과정에서 생성된 세포질 NADH의 전자는 셔틀을 통해 전달된다. 셔틀에 따라 전자가 복합체 I 또는 유비퀴논에서 진입하므로 ATP 수율도 달라진다.</p></>}
      </div>
    </section>
    <section className="summary-section"><h2>세포호흡 전체 요약</h2><p className="quiet">포도당 1분자 기준. TCA 회로에서 효소 결합 FADH₂가 전자를 전달하면 유비퀴논이 환원된다. 두 표기는 같은 전자쌍을 가리킨다.</p><div className="table-scroll stack-table" tabIndex={0} role="region" aria-label="세포호흡 요약 표"><table><thead><tr>{['단계', '위치', '주요 입력', '주요 출력', 'ATP 생성 방식', '화학삼투와의 관계'].map(v => <th key={v}>{v}</th>)}</tr></thead><tbody>{respirationSteps.map(s => <tr key={s.title}><th scope="row">{s.title}</th><td data-label="위치">{s.location}</td><td data-label="주요 입력">{s.input}</td><td data-label="주요 출력">{s.output}</td><td data-label="ATP 생성 방식">{s.method}</td><td data-label="화학삼투와의 관계">{s.relation}</td></tr>)}</tbody></table></div></section>
    <Quiz questions={respirationQuestions} onComplete={() => mark('respirationQuizCompleted')} />
    <div className="lesson-end"><button className="button primary" onClick={() => { mark('respirationViewed'); setViewed(true) }}>{viewed ? '✓ 학습 확인 완료' : '✓ 세포호흡 학습 확인'}</button><a className="button" href="#/photosynthesis">광합성 →</a><a href="#/explorer">탐색기로 이동 →</a></div>
  </>
}
function RespirationOverview({ step }: { step: number }) {
  return <Figure title="세포호흡 구획과 전체 경로" description="세포질에서 생성된 피루브산은 미토콘드리아 기질로 들어간다. 피루브산 산화와 TCA 회로에서 얻은 전자는 내막의 전자전달계로 전달된다." height={465}>
    <text x="25" y="30" className="region-label">세포질</text>
    <rect x="245" y="48" width="735" height="370" rx="85" className="outer-membrane" /><text x="630" y="37" className="sub-label">미토콘드리아 외막</text>
    <rect x="277" y="117" width="670" height="269" rx="60" className="matrix" /><text x="375" y="78" className="region-label">막사이공간</text><text x="438" y="365" className="region-label">미토콘드리아 기질</text><text x="737" y="407" className="sub-label">미토콘드리아 내막</text>
    <Node x={24} y={106} width={172} label="포도당 (6C)" sub="01 해당과정" active={step === 0} /><Arrow d="M110 166 V207" /><Node x={24} y={216} width={172} label="피루브산 2 (각 3C)" /><Arrow d="M196 240 H317" />
    <Node x={330} y={210} width={166} label="02 아세틸-CoA 생성" sub="아세틸기 2개 (각 2C)" active={step === 1} /><Arrow d="M496 240 H543" /><circle cx="610" cy="240" r="58" className={`cycle-ring ${step === 2 ? 'selected' : ''}`} /><text x="610" y="236" textAnchor="middle">03 TCA 회로</text><text x="610" y="261" textAnchor="middle" className="sub-label">2회전</text>
    <text x="338" y="297" className="sub-label">2 CO₂ + 2 NADH</text><text x="524" y="327" className="sub-label">4 CO₂ / 6 NADH / 2 FADH₂</text>
    <Arrow d="M641 184 V150" kind="electron" label="NADH / FADH₂ / e⁻" x={687} y={251} /><Node x={581} y={91} width={152} label="04 전자전달계" sub="내막에서 전자 전달" active={step === 3} />
    <Arrow d="M752 196 V63" kind="proton" label="H⁺" x={727} y={78} /><Arrow d="M853 68 V207" kind="proton" label="H⁺" x={868} y={82} /><Node x={771} y={94} width={158} label="ATP 합성효소" /><text x="782" y="229">ADP + 인산 → ATP</text>
    <Arrow d="M110 277 V318 H312 V170 H602 V155" kind="electron" label="2 NADH / 환원력은 셔틀 경유" x={32} y={344} /><Arrow d="M415 210 V186 H574 V155" kind="electron" />
    <text x="38" y="384" className="sub-label">기질수준 인산화: 순 ATP 2</text><text x="500" y="446" className="sub-label">실선은 탄소 이동, 점선은 전자 전달</text>
  </Figure>
}
