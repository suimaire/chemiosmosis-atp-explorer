import { useState } from 'react'
import { Bridge, PageTitle, Quiz } from './components/Shared'
import { Membrane, compartments } from './components/Membrane'
import { EtcComparison3D } from './components/step04/EtcComparison3D'
import { ConceptMembrane } from './components/explorer/ConceptMembrane'
import { CouplingLesson, GradientLesson, Range } from './components/explorer/EnergyLessons'
import { defaultGradient, normal, presets, relativeState, type Condition, type Gradient, type PresetKey } from './science'
import './components/explorer/EarlyExplorer.css'

const explorerModules = ['전자전달과 H⁺ 축적', 'H⁺ 기울기의 에너지', 'ATP 합성에 충분한가?', '막을 조작하기', '어떤 설명이 자료와 맞는가?', '광합성으로 옮겨 보기']
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
  return <>
    <PageTitle eyebrow="03 / CHEMIOSMOSIS EXPLORER" title="화학삼투와 ATP 합성 탐색기">어디에 쌓이는가 → 왜 에너지인가 → ATP를 만들기에 충분한가. H⁺의 흐름을 따라 탐색합니다.</PageTitle>
    <div className="module-layout early-explorer"><nav className="module-nav" aria-label="탐색기 모듈">{explorerModules.map((m, i) => <button key={m} aria-pressed={module === i} onClick={() => setModule(i)}><span>0{i}</span>{m}</button>)}</nav><section className="module-content" aria-label="선택한 탐색기 모듈"><div className="module-title"><p className="eyebrow">INVESTIGATION / 0{module}</p><h2>0{module} · {explorerModules[module]}</h2></div>
      {module === 0 && <>
        <p className="step-question">전자는 흐르고, H⁺는 쌓입니다.</p>
        <p>전자전달에서 얻는 에너지로 H⁺를 막 건너편에 모읍니다. H⁺가 ATP 합성효소를 통해 돌아오면, 그 이동이 ATP 합성에 연결됩니다.</p>
        <div className="context-switch" aria-label="막 문맥"><button aria-pressed={context === 'mito'} onClick={() => setContext('mito')}>미토콘드리아</button><button aria-pressed={context === 'plant'} onClick={() => setContext('plant')}>엽록체 틸라코이드</button></div>
        <div className="path-toggles">{(['electrons', 'protons', 'atp'] as const).map((key, i) => <label key={key}><input type="checkbox" checked={paths[key]} onChange={e => setPaths({ ...paths, [key]: e.target.checked })} />{['전자 경로 보기', 'H⁺ 이동 보기', 'ATP 합성 경로 보기'][i]}</label>)}</div>
        {context === 'mito' ? <ConceptMembrane paths={paths} /> : <div className="diagram-panel"><Membrane context="plant" {...paths} /></div>}
        <div className="concept-takeaway"><div><small>H⁺가 높은 쪽</small><strong>{context === 'mito' ? '막사이공간' : '틸라코이드 내강'}</strong></div><div><small>ATP 합성과 연결된 귀환</small><strong>{context === 'mito' ? compartment.direction : '내강 → 스트로마'}</strong></div><p>전자와 H⁺는 <strong>같은 길을 이동하지 않습니다.</strong></p></div>
        <p>전자는 운반체 사이에서 전달되고, H⁺는 막을 가로질러 이동합니다. ATP 합성효소를 통한 H⁺의 귀환은 ADP와 무기 인산으로 ATP를 만드는 데 연결됩니다.</p>
        <p className="quiet">모양·입자 수·움직임은 큰 흐름을 보여 주는 교육적 단순화입니다. 실제 분자 구조·농도비·반응 속도를 나타내지 않습니다. H⁺ 기울기에는 농도 차와 전위 차가 모두 포함됩니다.</p>
        {context === 'mito' && <details><summary>+ 심화 · 실제 전자전달계</summary><p>전자전달계의 Complex I·III·IV는 H⁺ 기울기 형성에 기여합니다. Complex II는 H⁺ 펌프가 아닙니다. NADH의 전자는 I에서, succinate 산화로 효소 결합 FAD가 받은 전자는 II에서 들어와 Q로 전달됩니다. III에서 cyt c를 거쳐 IV로 전달된 전자는 최종적으로 O₂를 환원해 물을 만듭니다.</p><p>기본 모형은 I·III·IV의 H⁺ 이동과 NADH 쪽 전자 진입을 묶어 보여 주며 II 진입 경로는 생략합니다. III의 Q cycle과 ATP 합성효소 내부의 회전·촉매 과정도 단순화했습니다. 전자가 자유 입자로 관을 따라 이동한다는 뜻은 아닙니다.</p></details>}
        <p className="step-bridge">다음에는 막 양쪽의 농도 차와 전위 차가 왜 에너지가 되는지 확인합니다.</p>
      </>}
      {module === 1 && <GradientLesson gradient={gradient} setGradient={setGradient} />}
      {module === 2 && <CouplingLesson gradient={gradient} ratio={ratio} requirement={requirement} setRatio={setRatio} setRequirement={setRequirement} onGradient={() => setModule(1)} />}
      {module === 3 && <><p>먼저 A와 B의 처리 조건을 고르세요. 각 조건의 입력·누출·ADP를 바꿔 정상상태의 결과를 비교할 수 있습니다.</p><p className="note"><strong>교육용 제한 모형 · relative units</strong><br />미토콘드리아 산소 소비를 다룹니다. 산소·기질 공급이 충분하고 손상이 없는 범위에서, 높은 기울기가 전자전달을 억제하는 관계를 단순화했습니다. 각 지표는 정상 조건 = 100입니다.</p><EtcComparison3D a={a} b={b} /><div className="ab-grid"><ConditionControls name="A" value={a} setValue={setA} /><ConditionControls name="B" value={b} setValue={setB} /></div><Results a={a} b={b} /><p className="quiet">ATP는 산화적 ATP 합성만 나타냅니다. 해당과정 등의 ATP는 포함하지 않습니다. 입력 중단의 결과는 기존 기울기가 소진된 정상상태이며 즉시 일어나는 변화가 아닙니다. 이 모형의 수치는 모듈 01·02의 자유에너지 계산과 별개입니다.</p><details><summary>모형의 계산과 해석</summary><p>기울기 g에서 전자전달 입력 J = input × (1 − g), 누출 = leak × g, ATP 합성 경로 유량 = 0.75 × ADP × synthase × g로 둡니다. 유입 = 유출을 풀어 g = input / (input + leak + 0.75 × ADP × synthase)를 얻습니다.</p><p>산소 소비는 J에, ATP 합성은 ATP 경로 유량에 비례시킵니다. 속도상수·시간축·임계 자유에너지는 보정하지 않은 개념 모형입니다. 모든 조건에 보편적으로 적용되는 생리 법칙이나 예측기가 아닙니다.</p></details></>}
      {module === 4 && <Inference />}
      {module === 5 && <><p>미토콘드리아에서 이해한 화학삼투 원리 중 무엇이 틸라코이드에서도 그대로 적용될까?</p><Membrane context="plant" /><Bridge /><Quiz questions={[
        { prompt: '틸라코이드에서 ATP 합성과 연결되는 H⁺ 방향은?', options: ['Lumen → Stroma', 'Stroma → Lumen'], answer: 0, explanation: 'ATP synthase를 통한 H⁺ 귀환 방향은 내강에서 스트로마입니다. 미토콘드리아의 막사이공간 → 기질과 같은 원리입니다.' },
        { prompt: '두 시스템에 공통으로 필요한 것은?', options: ['O₂를 최종 전자수용체로 사용', '막을 사이에 둔 H⁺ 전기화학적 기울기'], answer: 1, explanation: '같은 원리는 H⁺ 기울기와 ATP synthase의 결합입니다. 에너지 공급과 최종 전자수용체는 다릅니다.' },
        { prompt: '틸라코이드 전자전달을 구동하는 주된 입력은?', options: ['빛', 'TCA cycle에서 생성한 NADH'], answer: 0, explanation: '광계가 흡수한 빛이 전자의 에너지를 높입니다. 미토콘드리아에서는 환원된 전자 운반체의 산화가 주된 입력입니다.' },
      ]} onComplete={() => {}} /></>}
      <div className="module-next"><button className="button" disabled={module === 0} onClick={() => setModule(module - 1)}>← 이전</button>{module < 5 ? <button className="button primary" onClick={() => setModule(module + 1)}>다음 단계 →</button> : <a className="button primary" href="#/">학습 홈으로 →</a>}</div>
    </section></div>
  </>
}
function ConditionControls({ name, value, setValue }: { name: string; value: Condition; setValue: (v: Condition) => void }) {
  const preset = (Object.keys(presets) as PresetKey[]).find(k => Object.entries(presets[k].condition).every(([key, v]) => value[key as keyof Condition] === v)) || 'custom'
  return <section className="condition" aria-label={`조건 ${name}`}><h3>조건 {name}</h3><label className="select-label">처리 조건<select aria-label={`조건 ${name} 처리`} value={preset} onChange={e => setValue({ ...presets[e.target.value as PresetKey].condition })}><option value="custom" disabled>사용자 조절 조건</option>{Object.entries(presets).map(([key, p]) => <option key={key} value={key}>{p.label}</option>)}</select></label><Range label={`${name} · 전자전달 입력`} min={0} max={1} step={0.05} value={value.input} onChange={v => setValue({ ...value, input: v })} /><Range label={`${name} · ATP 합성 경로 활성`} min={0} max={1} step={0.01} value={value.synthase} onChange={v => setValue({ ...value, synthase: v })} /><Range label={`${name} · H⁺ 누출 전도도`} min={0.02} max={2} step={0.01} value={value.leak} onChange={v => setValue({ ...value, leak: v })} /><Range label={`${name} · ADP 가용성`} min={0} max={1} step={0.05} value={value.adp} onChange={v => setValue({ ...value, adp: v })} /></section>
}
const metricLabels = { oxygen: '산소 소비 · Oxygen consumption', gradient: '전기화학적 H⁺ 기울기', atp: '산화적 ATP 합성 속도' }
function Results({ a, b, masked = false }: { a: Condition; b?: Condition; masked?: boolean }) {
  const values = [relativeState(a), ...(b ? [relativeState(b)] : [])]
  return <div className={`model-results ${b ? '' : 'single-bars'}`} aria-label="모형 결과"><p className="quiet">{masked ? 'model-generated data' : 'relative units'} · 정상 조건 = 100 · 공통 눈금 0–220 · 점선 = 100</p>{(Object.keys(metricLabels) as (keyof typeof metricLabels)[]).map(key => <div className="bar-row" key={key}><p className="bar-title">{metricLabels[key]}</p>{values.map((v, i) => <div className="bar-line" key={i}>{b && <span>{i ? 'B' : 'A'}</span>}<div className="bar-track"><div className={`bar-fill ${i ? 'b' : ''}`} style={{ width: `${v[key] / 2.2}%` }} /></div><output aria-label={`${b ? i ? 'B ' : 'A ' : ''}${metricLabels[key]}`}>{v[key].toFixed(1)}</output></div>)}</div>)}</div>
}
function Inference() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const cases = [
    { key: 'leak' as const, reason: '기울기와 ATP는 낮지만 산소 소비는 높습니다. ATP 합성 경로를 우회하는 H⁺ 누출은 기울기를 낮추고 전자전달의 억제를 완화합니다. 입력 억제라면 산소 소비도 낮아집니다.' },
    { key: 'inhibited' as const, reason: 'ATP는 크게 낮고 기울기는 높습니다. ATP synthase를 통한 귀환이 막혀 기울기가 쌓이고, 전자전달과 산소 소비가 억제됩니다. 누출과는 기울기의 변화 방향이 다릅니다.' },
    { key: 'reduced' as const, reason: '산소 소비·기울기·ATP가 모두 낮습니다. 전자전달 입력 자체가 부족한 결과입니다. 누출은 이 공급 조건에서 산소 소비를 높이고, ATP 경로 억제는 기울기를 높인다는 점에서 구별됩니다.' },
  ]
  return <><p>처리명이 가려진 세 조건입니다. 어떤 설명이 세 지표를 함께 설명하는지 선택하세요.</p><p className="note">model-generated data · 가상 모형 데이터<br />이 문제는 한 번에 한 처리만 바꾼 제한 모형입니다. 실제 자료에서는 이 세 지표만으로 원인을 확정할 수 없습니다.</p>{cases.map((c, i) => <section className="data-case" key={i}><h3>가상 조건 {i + 1}</h3><Results a={presets[c.key].condition} masked /><div className="quiz-options">{(['inhibited', 'leak', 'reduced'] as const).map(key => <button key={key} aria-pressed={answers[i] === key} onClick={() => setAnswers({ ...answers, [i]: key })}>{presets[key].label}</button>)}</div>{answers[i] && <p className={`feedback ${answers[i] === c.key ? 'correct' : 'retry'}`} role="status"><strong>{answers[i] === c.key ? '맞아요.' : '다시 비교해 보세요.'}</strong> {c.reason}</p>}</section>)}</>
}
