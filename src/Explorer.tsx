import { useId, useState } from 'react'
import { Bridge, PageTitle, Quiz } from './components/Shared'
import { Membrane, compartments } from './components/Membrane'
import { coupledEnergy, defaultGradient, normal, presets, protonEnergy, relativeState, type Condition, type Gradient, type PresetKey } from './science'

const modules = ['어디에 축적되는가?', '전자와 H⁺는 같은 길을 가는가?', '기울기의 에너지', 'ATP 합성과 결합', '막을 조작하기', '어떤 설명이 자료와 맞는가?', '광합성으로 옮겨 보기']
export function Explorer() {
  const [module, setModule] = useState(0)
  const [context, setContext] = useState<'mito' | 'plant'>('mito')
  const [paths, setPaths] = useState({ electrons: true, protons: true, atp: true })
  const [gradient, setGradient] = useState<Gradient>(defaultGradient)
  const [ratio, setRatio] = useState(3.3)
  const [requirement, setRequirement] = useState(50)
  const [a, setA] = useState<Condition>({ ...normal })
  const [b, setB] = useState<Condition>({ ...presets.inhibited.condition })
  const energy = protonEnergy(gradient)
  const cycle = coupledEnergy(energy.total, ratio, requirement)
  const compartment = compartments[context]
  return <>
    <PageTitle eyebrow="03 / CHEMIOSMOSIS EXPLORER" title="화학삼투와 ATP 합성 탐색기">전자전달이 만든 H⁺ 기울기가 ATP 합성과 어떻게 연결되는지 조건을 바꾸어 확인합니다.</PageTitle>
    <div className="module-layout"><nav className="module-nav" aria-label="탐색기 모듈">{modules.map((m, i) => <button key={m} aria-pressed={module === i} onClick={() => setModule(i)}><span>0{i}</span>{m}</button>)}</nav><section className="module-content" aria-label="선택한 탐색기 모듈"><div className="module-title"><p className="eyebrow">INVESTIGATION / 0{module}</p><h2>0{module} · {modules[module]}</h2></div>
      {(module === 0 || module === 1) && <>
        <div className="context-switch" aria-label="막 문맥"><button aria-pressed={context === 'mito'} onClick={() => setContext('mito')}>미토콘드리아</button><button aria-pressed={context === 'plant'} onClick={() => setContext('plant')}>엽록체 틸라코이드</button></div>
        {module === 1 && <div className="path-toggles">{(['electrons', 'protons', 'atp'] as const).map((key, i) => <label key={key}><input type="checkbox" checked={paths[key]} onChange={e => setPaths({ ...paths, [key]: e.target.checked })} />{['전자 경로 (e⁻ · 점선)', 'H⁺ 이동 경로', 'ATP 합성 경로'][i]}</label>)}</div>}
        <div className="diagram-panel"><Membrane context={context} {...(module === 1 ? paths : {})} /></div><p className="note"><strong>H⁺가 높은 쪽:</strong> {compartment.high}<br /><strong>ATP 합성과 연결된 귀환:</strong> {compartment.direction}</p><p className="quiet">{module === 0 ? '막은 두 공간을 나눕니다. H⁺ 농도 차이와 전위 차이 모두가 전기화학적 기울기에 기여합니다. 그림의 H⁺ 개수는 실제 농도비를 나타내지 않습니다.' : '점선은 전자의 전달, H⁺ 화살표는 양성자의 막 횡단 이동입니다. 두 입자가 같은 경로로 움직이는 것이 아닙니다. 운반체의 산화·환원과 양성자화는 서로 연결될 수 있습니다.'}</p>
      </>}
      {(module === 2 || module === 3) && <>
        <p>A → B 방향의 H⁺ 이동을 계산합니다. <strong>Δψ = ψ_B − ψ_A</strong>이며, 음수이면 B 쪽 전위가 더 낮습니다.</p>
        <div className="context-switch"><button onClick={() => setGradient(defaultGradient)}>미토콘드리아 예시</button><button onClick={() => setGradient({ pHA: 6, pHB: 8, deltaPsiMv: 0, temperatureC: 25 })}>틸라코이드 예시</button><button onClick={() => setGradient({ pHA: 7, pHB: 7, deltaPsiMv: 0, temperatureC: 25 })}>기울기 0</button></div>
        <p className="quiet">예시 설정은 대표적인 학습 조건입니다. 실제 세포에서 측정한 고정값이 아닙니다. A = 막사이공간/내강, B = 기질/스트로마로 대응시킵니다.</p>
        <div className="controls-grid"><Range label="pH_A" min={4} max={10} step={0.1} value={gradient.pHA} onChange={v => setGradient({ ...gradient, pHA: v })} /><Range label="pH_B" min={4} max={10} step={0.1} value={gradient.pHB} onChange={v => setGradient({ ...gradient, pHB: v })} /><Range label="Δψ = ψ_B − ψ_A" unit="mV" min={-200} max={200} step={5} value={gradient.deltaPsiMv} onChange={v => setGradient({ ...gradient, deltaPsiMv: v })} /><Range label="온도" unit="°C" min={0} max={50} step={1} value={gradient.temperatureC} onChange={v => setGradient({ ...gradient, temperatureC: v })} /></div>
        <div className="formula">ΔG_H = 2.303 RT(pH_A − pH_B) + F(ψ_B − ψ_A)</div><p className="quiet">T = { (gradient.temperatureC + 273.15).toFixed(2) } K · 화면의 mV는 계산 시 V로 변환합니다. 2.303은 ln(10)의 반올림 표기입니다.</p>
        <div className="metrics" aria-live="polite"><Metric label="화학적 기여" value={energy.chemical} unit="kJ·mol⁻¹ H⁺" /><Metric label="전기적 기여" value={energy.electrical} unit="kJ·mol⁻¹ H⁺" /><Metric label="전체 ΔG_H" value={energy.total} unit="kJ·mol⁻¹ H⁺" /></div><p className="result-direction" role="status">{energy.direction === 'equilibrium' ? '전기화학적 평형: 어느 방향에도 순 구동력이 없습니다.' : `열역학적으로 유리한 이동 방향: ${energy.direction === 'A→B' ? 'A → B' : 'B → A'}`}</p>
        {module === 3 && <><div className="controls-grid"><Range label="유효 H⁺/ATP 결합비 n" min={2} max={6} step={0.1} value={ratio} onChange={setRatio} /><Range label="ATP 합성 에너지 요구량" unit="kJ·mol⁻¹ ATP" min={30} max={65} step={1} value={requirement} onChange={setRequirement} /></div><div className="energy-track"><div>H⁺ {ratio.toFixed(1)}개 상당의 이동<b>{(ratio * energy.total).toFixed(2)}</b>kJ·mol⁻¹ ATP</div><span>＋</span><div>ATP 합성 요구량<b>+{requirement.toFixed(2)}</b>kJ·mol⁻¹ ATP</div><span>→</span><div>결합된 과정<b>{cycle.toFixed(2)}</b>kJ·mol⁻¹ ATP</div></div><div className="formula">ΔG_cycle = n × ΔG_H + ΔG_ATP synthesis</div><div className="coupling-result" aria-live="polite"><span>결합된 A → B 이동 + ATP 합성</span><strong>{cycle.toFixed(2)} kJ·mol⁻¹ ATP</strong><p>{Math.abs(cycle) < 1e-9 ? '평형 조건입니다.' : cycle < 0 ? '이 조건에서 결합된 ATP 합성은 열역학적으로 유리합니다.' : '이 조건에서는 결합된 ATP 합성에 추가 구동력이 필요합니다.'}</p></div><p className="note">결합비는 모든 생물에서 같은 상수가 아닙니다. 회전자의 구조와 수송 비용 등에 따라 달라집니다. ΔG &lt; 0이라는 사실만으로 ATP 생성 속도는 결정되지 않습니다. 효소의 활성과 ADP·Pi 공급이 함께 필요합니다.</p></>}
      </>}
      {module === 4 && <><p>먼저 A와 B의 처리 조건을 고르세요. 각 조건의 입력·누출·ADP를 바꿔 정상상태의 결과를 비교할 수 있습니다.</p><p className="note"><strong>교육용 제한 모형 · relative units</strong><br />미토콘드리아 산소 소비를 다룹니다. 산소·기질 공급이 충분하고 손상이 없는 범위에서, 높은 기울기가 전자전달을 억제하는 관계를 단순화했습니다. 각 지표는 정상 조건 = 100입니다.</p><div className="ab-grid"><ConditionControls name="A" value={a} setValue={setA} /><ConditionControls name="B" value={b} setValue={setB} /></div><Results a={a} b={b} /><p className="quiet">ATP는 산화적 ATP 합성만 나타냅니다. 해당과정 등의 ATP는 포함하지 않습니다. 입력 중단의 결과는 기존 기울기가 소진된 정상상태이며 즉시 일어나는 변화가 아닙니다. 이 모형의 수치는 모듈 02·03의 자유에너지 계산과 별개입니다.</p><details><summary>모형의 계산과 해석</summary><p>기울기 g에서 전자전달 입력 J = input × (1 − g), 누출 = leak × g, ATP 합성 경로 유량 = 0.75 × ADP × synthase × g로 둡니다. 유입 = 유출을 풀어 g = input / (input + leak + 0.75 × ADP × synthase)를 얻습니다.</p><p>산소 소비는 J에, ATP 합성은 ATP 경로 유량에 비례시킵니다. 속도상수·시간축·임계 자유에너지는 보정하지 않은 개념 모형입니다. 모든 조건에 보편적으로 적용되는 생리 법칙이나 예측기가 아닙니다.</p></details></>}
      {module === 5 && <Inference />}
      {module === 6 && <><p>미토콘드리아에서 이해한 화학삼투 원리 중 무엇이 틸라코이드에서도 그대로 적용될까?</p><Membrane context="plant" /><Bridge /><Quiz questions={[
        { prompt: '틸라코이드에서 ATP 합성과 연결되는 H⁺ 방향은?', options: ['Lumen → Stroma', 'Stroma → Lumen'], answer: 0, explanation: 'ATP synthase를 통한 H⁺ 귀환 방향은 내강에서 스트로마입니다. 미토콘드리아의 막사이공간 → 기질과 같은 원리입니다.' },
        { prompt: '두 시스템에 공통으로 필요한 것은?', options: ['O₂를 최종 전자수용체로 사용', '막을 사이에 둔 H⁺ 전기화학적 기울기'], answer: 1, explanation: '같은 원리는 H⁺ 기울기와 ATP synthase의 결합입니다. 에너지 공급과 최종 전자수용체는 다릅니다.' },
        { prompt: '틸라코이드 전자전달을 구동하는 주된 입력은?', options: ['빛', 'TCA cycle에서 생성한 NADH'], answer: 0, explanation: '광계가 흡수한 빛이 전자의 에너지를 높입니다. 미토콘드리아에서는 환원된 전자 운반체의 산화가 주된 입력입니다.' },
      ]} onComplete={() => {}} /></>}
      <div className="module-next"><button className="button" disabled={module === 0} onClick={() => setModule(module - 1)}>← 이전</button>{module < 6 ? <button className="button primary" onClick={() => setModule(module + 1)}>다음 단계 →</button> : <a className="button primary" href="#/">학습 홈으로 →</a>}</div>
    </section></div>
  </>
}
function Range({ label, unit = '', min, max, step, value, onChange }: { label: string; unit?: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const id = useId()
  return <label className="range-control" htmlFor={id}><span className="range-label"><span>{label}</span><output htmlFor={id}>{value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)} {unit}</output></span><input id={id} aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>
}
function Metric({ label, value, unit }: { label: string; value: number; unit: string }) { return <div className="metric"><small>{label}</small><strong>{Math.abs(value) < 0.005 ? '0.00' : value.toFixed(2)}</strong><span>{unit}</span></div> }
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
