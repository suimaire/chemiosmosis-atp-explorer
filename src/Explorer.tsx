import { useEffect, useRef, useState } from 'react'
import { Bridge, PageTitle, Quiz } from './components/Shared'
import { Membrane, compartments } from './components/Membrane'
import { EtcComparison3D } from './components/step04/EtcComparison3D'
import { ConceptMembrane } from './components/explorer/ConceptMembrane'
import { CouplingLesson, GradientLesson, Range } from './components/explorer/EnergyLessons'
import { defaultGradient, normal, presetKeyFor, presets, relativeState, type Condition, type Gradient, type PresetKey } from './science'
import './components/explorer/EarlyExplorer.css'

const explorerModules = ['전자전달계와 H⁺ 기울기 형성', 'H⁺ 이동의 자유에너지', 'ATP 합성의 에너지 조건', '미토콘드리아 조건 비교', '산소 소비와 ATP 합성 자료 해석', '틸라코이드의 화학삼투']
export function Explorer() {
  const [module, setModule] = useState(0)
  const [context, setContext] = useState<'mito' | 'plant'>('mito')
  const [paths, setPaths] = useState({ electrons: true, protons: true, atp: true })
  const [gradient, setGradient] = useState<Gradient>(defaultGradient)
  const [ratio, setRatio] = useState(3.3)
  const [requirement, setRequirement] = useState(50)
  const [a, setA] = useState<Condition>({ ...normal })
  const [b, setB] = useState<Condition>({ ...presets.inhibited.condition })
  const compartment = compartments[context]
  const top = useRef<HTMLDivElement>(null)
  const firstModule = useRef(true)
  useEffect(() => {
    // Keep the active step visible in the scrollable phone stepper, and start a newly
    // opened step at its question instead of wherever the previous step was scrolled.
    const nav = top.current?.querySelector<HTMLElement>('.module-nav')
    const active = nav?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (nav && active && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2
    if (firstModule.current) { firstModule.current = false; return }
    if ((top.current?.getBoundingClientRect().top ?? 0) < 0) top.current?.scrollIntoView({ block: 'start' })
  }, [module])
  return <>
    <PageTitle eyebrow="탐구" title="화학삼투와 ATP 합성 탐색기" />
    <div className="module-layout early-explorer" ref={top}><nav className="module-nav" aria-label="탐색기 모듈">{explorerModules.map((m, i) => <button key={m} aria-pressed={module === i} onClick={() => setModule(i)}><span>0{i}</span>{m}</button>)}</nav><section className="module-content" aria-label="선택한 탐색기 모듈"><div className="module-title"><h2>0{module} {explorerModules[module]}</h2></div>
      {module === 0 && <>
        <div className="lesson-stage">
          <div className="stage-switch"><span className="stage-switch-label">관찰할 막 선택</span><div className="context-switch" aria-label="관찰할 막"><button aria-pressed={context === 'mito'} onClick={() => setContext('mito')}>미토콘드리아</button><button aria-pressed={context === 'plant'} onClick={() => setContext('plant')}>엽록체 틸라코이드</button></div></div>
          <div className="stage-figure">
            <ConceptMembrane key={context} context={context} paths={paths} />
          </div>
          <div className="stage-side">
            <p className="step-lead">{context === 'mito' ? '복합체 I, III, IV는 전자전달에서 방출되는 자유에너지를 이용해 H⁺를 기질에서 막사이공간으로 이동시킨다.' : '광계 II에서 물이 산화되면 틸라코이드 내강에 H⁺가 방출된다. 플라스토퀴논을 통한 전자전달은 스트로마의 H⁺를 내강으로 옮긴다.'}</p>
            <fieldset className="path-toggles"><legend>그림에 표시할 경로</legend>{(['electrons', 'protons', 'atp'] as const).map((key, i) => <label key={key} className={`path-toggle-${key}`}><input type="checkbox" checked={paths[key]} onChange={e => setPaths({ ...paths, [key]: e.target.checked })} />{['전자 경로 보기', 'H⁺ 이동 보기', 'ATP 합성 경로 보기'][i]}</label>)}</fieldset>
            <div className="concept-takeaway"><div><small>H⁺ 농도가 높은 구획</small><strong>{context === 'mito' ? '막사이공간' : '틸라코이드 내강'}</strong></div><div><small>ATP 합성효소를 통한 H⁺ 이동</small><strong>{context === 'mito' ? compartment.direction : '틸라코이드 내강 → 스트로마'}</strong></div></div>
          </div>
        </div>
        {context === 'mito' && <details><summary>전자 운반체와 최종 전자수용체</summary><p>NADH에서 복합체 I로 들어온 전자와 숙신산에서 복합체 II의 효소 결합 FAD로 들어온 전자는 모두 유비퀴논(Q)으로 전달된다. 복합체 II는 H⁺를 수송하지 않는다.</p><p>막 안에서 이동하는 환원형 유비퀴논(QH₂)은 복합체 III에 전자를 준다. 시토크롬 c는 막사이공간 쪽에서 전자를 하나씩 복합체 IV로 운반한다. 여기서 O₂ 한 분자가 전자 4개와 기질의 H⁺ 4개를 받아 물 두 분자가 된다.</p></details>}
        {context === 'plant' && <details><summary>광계 II에서 NADP⁺까지의 전자전달</summary><p>광계 II(PSII)에서 빛에 들뜬 전자가 수용체로 이동하면 물의 산화로 전자가 보충되고 O₂가 발생한다. 전자는 플라스토퀴논(PQ), 시토크롬 b₆f, 플라스토시아닌(PC)을 거쳐 광계 I(PSI)에 전달된다.</p><p>PSI에서 빛에 의해 다시 들뜬 전자는 페레독신(Fd)으로 전달된다. 스트로마 쪽에서 페레독신-NADP⁺ 환원효소가 전자 두 개와 H⁺ 하나를 이용해 NADP⁺를 NADPH로 환원한다.</p></details>}
      </>}
      {module === 1 && <GradientLesson gradient={gradient} setGradient={setGradient} />}
      {module === 2 && <CouplingLesson gradient={gradient} ratio={ratio} requirement={requirement} setRatio={setRatio} setRequirement={setRequirement} onGradient={() => setModule(1)} />}
      {module === 3 && <>
        <p className="step-lead">A와 B의 처리 조건을 선택하세요. 개별 변수는 각 그림 아래에서 조절할 수 있습니다.</p>
        <EtcComparison3D a={a} b={b} controls={{
          A: { preset: <PresetPicker name="A" value={a} setValue={setA} />, adjust: <ConditionControls name="A" value={a} setValue={setA} /> },
          B: { preset: <PresetPicker name="B" value={b} setValue={setB} />, adjust: <ConditionControls name="B" value={b} setValue={setB} /> },
        }} renderResults={(values, transient) => <section className="results-block" aria-labelledby="ab-results-title">
          <h3 id="ab-results-title" className="lesson-section-title">{transient ? '처리 과정의 산소 소비, H⁺ 기울기, ATP 합성' : '정상상태의 산소 소비, H⁺ 기울기, ATP 합성'}</h3>
          <Results values={values} />
        </section>} />
        <p className="quiet">시안화합물 처리 과정은 정상 결합 상태에서 시작한다. 재생 시간은 변화 순서를 관찰하기 위한 교육용 시간이다. ATP 합성 속도에는 산화적 인산화만 포함한다.</p><details><summary>정상상태 계산식</summary><p>유효 전자전달 입력 E는 전자 공급량(input)과 복합체 IV 활성(작동 시 1, 완전 억제 시 0)의 곱이다. 무차원 기울기 g에서 전자전달에 의한 H⁺ 유입은 J = E × (1 − g), 누출은 leak × g, ATP 합성효소를 통한 유출은 0.75 × ADP × synthase × g이다. 정상상태에서는 유입과 총유출이 같으므로 g = E / (E + leak + 0.75 × ADP × synthase)이다.</p><p>leak는 H⁺ 누출 전도도, ADP와 synthase는 각각 ADP 가용성과 ATP 합성 경로 활성이다. 산소 소비는 J에, 산화적 ATP 합성 속도는 ATP 합성효소를 통한 유출에 비례한다. 이 속도 계산은 모듈 01과 02의 자유에너지 계산과 독립적이다.</p></details>
      </>}
      {module === 4 && <Inference />}
      {module === 5 && <><p className="step-lead">두 막에서 ATP 합성효소의 촉매 부위는 어느 쪽을 향하며, H⁺는 어느 방향으로 이동하는가?</p><div className="diagram-panel"><Membrane context="plant" /></div><Bridge /><Quiz questions={[
        { prompt: '틸라코이드에서 ATP 합성과 연결되는 H⁺ 방향은?', options: ['틸라코이드 내강 → 스트로마', '스트로마 → 틸라코이드 내강'], answer: 0, explanation: 'H⁺는 틸라코이드 내강에서 ATP 합성효소를 통해 스트로마로 이동한다. ATP가 합성되는 촉매 부위도 스트로마 쪽에 있다.' },
        { prompt: '두 막에서 ATP 합성효소의 회전을 구동하는 것은?', options: ['O₂를 최종 전자수용체로 사용', '막을 사이에 둔 H⁺ 전기화학적 기울기'], answer: 1, explanation: '두 막에서 모두 H⁺가 전기화학적 기울기를 따라 이동할 때 방출되는 자유에너지가 ATP 합성을 구동한다.' },
        { prompt: '틸라코이드 전자전달을 구동하는 에너지원은?', options: ['빛', 'TCA 회로에서 생성한 NADH'], answer: 0, explanation: '반응 중심의 엽록소가 빛을 흡수한 뒤 들뜬 전자가 수용체로 전달된다. 비순환적 전자 흐름에서 물은 전자를 공급한다.' },
      ]} onComplete={() => {}} /></>}
      <div className="module-next"><button className="button" disabled={module === 0} onClick={() => setModule(module - 1)}>← 이전</button>{module < 5 ? <button className="button primary" onClick={() => setModule(module + 1)}>다음 단계 →</button> : <a className="button primary" href="#/">학습 홈으로 →</a>}</div>
    </section></div>
  </>
}
function PresetPicker({ name, value, setValue }: { name: string; value: Condition; setValue: (v: Condition) => void }) {
  return <label className="preset-picker"><span><b className={`preset-letter preset-letter-${name.toLowerCase()}`}>{name}</b> 처리 조건</span><select aria-label={`조건 ${name} 처리`} value={presetKeyFor(value) ?? 'custom'} onChange={e => setValue({ ...presets[e.target.value as PresetKey].condition })}><option value="custom" disabled>사용자 조절 조건</option>{Object.entries(presets).map(([key, p]) => <option key={key} value={key}>{p.label}</option>)}</select></label>
}
function ConditionControls({ name, value, setValue }: { name: string; value: Condition; setValue: (v: Condition) => void }) {
  return <section className="condition" aria-label={`조건 ${name}`}><h3>조건 {name} 세부 조절</h3><div className="condition-sliders"><Range label={`${name} / 전자전달 입력`} min={0} max={1} step={0.05} value={value.input} onChange={v => setValue({ ...value, input: v })} /><Range label={`${name} / ATP 합성 경로 활성`} min={0} max={1} step={0.01} value={value.synthase} onChange={v => setValue({ ...value, synthase: v })} /><Range label={`${name} / H⁺ 누출 전도도`} min={0.02} max={2} step={0.01} value={value.leak} onChange={v => setValue({ ...value, leak: v })} /><Range label={`${name} / ADP 가용성`} min={0} max={1} step={0.05} value={value.adp} onChange={v => setValue({ ...value, adp: v })} /></div></section>
}
const metricLabels = { oxygen: '산소 소비', gradient: '전기화학적 H⁺ 기울기', atp: '산화적 ATP 합성 속도' }
function Results({ values, masked = false }: { values: ReturnType<typeof relativeState>[]; masked?: boolean }) {
  const b = values.length > 1
  return <div className={`model-results ${b ? '' : 'single-bars'}`} aria-label="모형 결과"><p className="quiet">{masked ? '가상 자료' : '모형 계산값'} / 점선은 정상 조건(100), 눈금은 0–220</p>{(Object.keys(metricLabels) as (keyof typeof metricLabels)[]).map(key => <div className="bar-row" key={key}><p className="bar-title">{metricLabels[key]}</p>{values.map((v, i) => <div className="bar-line" key={i}>{b && <span>{i ? 'B' : 'A'}</span>}<div className="bar-track"><div className={`bar-fill ${i ? 'b' : ''}`} style={{ width: `${v[key] / 2.2}%` }} /></div><output aria-label={`${b ? i ? 'B ' : 'A ' : ''}${metricLabels[key]}`}>{v[key].toFixed(1)}</output></div>)}</div>)}</div>
}
function Inference() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const cases = [
    { key: 'leak' as const, reason: 'H⁺가 ATP 합성효소를 우회해 기질로 돌아가면 기울기와 ATP 합성 속도가 낮아진다. H⁺ 수송에 필요한 일이 줄어 전자전달이 빨라지므로 산소 소비는 증가한다.' },
    { key: 'inhibited' as const, reason: 'ATP 합성효소를 통한 H⁺ 이동이 감소하면 ATP 합성 속도는 낮아지고 기울기는 커진다. 이 기울기에 맞서 H⁺를 수송해야 하므로 전자전달과 산소 소비도 감소한다.' },
    { key: 'reduced' as const, reason: '전자전달 입력이 감소하면 O₂로 전달되는 전자와 막사이공간으로 수송되는 H⁺가 모두 줄어든다. 그 결과 산소 소비, 기울기, ATP 합성 속도가 함께 감소한다.' },
  ]
  return <><p className="step-lead">산소 소비, H⁺ 기울기, ATP 합성 속도를 근거로 각 조건의 처리를 선택하세요.</p><p className="note">각 조건에서 산소와 호흡 기질은 충분하다. 정상 조건에서 변수 하나만 바꾼 뒤 정상상태를 비교했다.</p><div className="inference-cases">{cases.map((c, i) => <section className="data-case" key={i}><h3>가상 조건 {i + 1}</h3><Results values={[relativeState(presets[c.key].condition)]} masked /><div className="quiz-options">{(['inhibited', 'leak', 'reduced'] as const).map(key => <button key={key} aria-pressed={answers[i] === key} onClick={() => setAnswers({ ...answers, [i]: key })}>{presets[key].label}</button>)}</div>{answers[i] && <p className={`feedback ${answers[i] === c.key ? 'correct' : 'retry'}`} role="status"><strong>{answers[i] === c.key ? '정답입니다.' : '오답입니다.'}</strong> {c.reason}</p>}</section>)}</div></>
}
