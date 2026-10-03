import { useId, useState, type ReactNode } from 'react'
import { coupledEnergy, defaultGradient, protonEnergy, type Gradient } from '../../science'
import { CouplingVisual } from './CouplingVisual'

export function Range({ label, accessibleLabel, unit = '', min, max, step, value, onChange }: { label: ReactNode; accessibleLabel?: string; unit?: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const id = useId()
  return <label className="range-control" htmlFor={id}><span className="range-label"><span>{label}</span><output htmlFor={id}>{value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)} {unit}</output></span><input id={id} aria-label={accessibleLabel ?? (typeof label === 'string' ? label : undefined)} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>
}
function Metric({ label, value, unit = 'kJ·mol⁻¹ H⁺' }: { label: ReactNode; value: number; unit?: string }) { return <div className="metric"><small>{label}</small><strong>{Math.abs(value) < 0.005 ? '0.00' : value.toFixed(2)}</strong><span>{unit}</span></div> }
const GH = () => <>ΔG<sub>H<sup>+</sup></sub></>
const Psi = () => <>Δψ = ψ<sub>B</sub> − ψ<sub>A</sub></>

export function GradientControls({ gradient, setGradient }: { gradient: Gradient; setGradient: (g: Gradient) => void }) {
  return <>
    <div className="context-switch"><button onClick={() => setGradient(defaultGradient)}>미토콘드리아 예시</button><button onClick={() => setGradient({ pHA: 6, pHB: 8, deltaPsiMv: 0, temperatureC: 25 })}>틸라코이드 예시</button><button onClick={() => setGradient({ pHA: 7, pHB: 7, deltaPsiMv: 0, temperatureC: 25 })}>기울기 0</button></div>
    <div className="controls-grid">
      <Range label="A 구획의 pH" min={4} max={10} step={0.1} value={gradient.pHA} onChange={v => setGradient({ ...gradient, pHA: v })} />
      <Range label="B 구획의 pH" min={4} max={10} step={0.1} value={gradient.pHB} onChange={v => setGradient({ ...gradient, pHB: v })} />
      <Range label="막 양쪽 전위 차" unit="mV" min={-200} max={200} step={5} value={gradient.deltaPsiMv} onChange={v => setGradient({ ...gradient, deltaPsiMv: v })} />
      <Range label="온도" unit="°C" min={0} max={50} step={1} value={gradient.temperatureC} onChange={v => setGradient({ ...gradient, temperatureC: v })} />
    </div>
    <p className="quiet">A = 막사이공간/내강, B = 기질/스트로마. 예시는 학습 조건이며 실제 세포의 고정값이 아닙니다. 전위 차가 음수이면 B 쪽 전위가 더 낮습니다.</p>
  </>
}

export function GradientLesson({ gradient, setGradient }: { gradient: Gradient; setGradient: (g: Gradient) => void }) {
  const energy = protonEnergy(gradient)
  const tendency = (value: number) => Math.abs(value) < 1e-9 ? '차이 없음' : value < 0 ? 'A → B' : 'B → A'
  return <div className="early-lesson" data-testid="gradient-lesson">
    <p className="step-question">한쪽에 쌓인 H⁺는 왜 ATP 합성을 구동할 수 있을까요?</p>
    <p>H⁺는 농도가 높은 곳에서 낮은 곳으로, 그리고 전기적으로 더 유리한 쪽으로 이동하려는 경향이 있습니다. 막이 두 구획의 차이를 유지하면, 그 차이를 줄이는 이동에서 에너지를 얻을 수 있습니다.</p>
    <div className="contribution-cards">
      <article className="chemical-card"><span className="concept-kicker">01 · 농도 차</span><h3>화학적 기여</h3><p>H⁺가 많은 쪽에서 적은 쪽으로.</p><small>pH가 낮을수록 H⁺ 농도는 높습니다.</small></article>
      <article className="electrical-card"><span className="concept-kicker">02 · 전위 차</span><h3>전기적 기여</h3><p>양전하를 띤 H⁺는 낮은 전위 쪽으로.</p><small>두 구획의 전위 차가 이동에 기여합니다.</small></article>
    </div>
    <div className="gradient-map" aria-label="두 구획과 H⁺ 이동 방향">
      <div className="gradient-compartment"><b>A 구획</b><span>pH {gradient.pHA.toFixed(1)}</span><div className="proton-dots" aria-hidden="true">{Array.from({ length: Math.round(2 + (10 - gradient.pHA) * 2) }, (_, i) => <i key={i} />)}</div></div>
      <div className="gradient-arrows"><span>농도 차 <b>{tendency(energy.chemical)}</b></span><span>전위 차 <b>{tendency(energy.electrical)}</b></span><strong>{energy.direction === 'equilibrium' ? '순 구동력 없음' : energy.direction === 'A→B' ? '전체 A → B' : '전체 B → A'}</strong><small>전위 차 {gradient.deltaPsiMv} mV</small></div>
      <div className="gradient-compartment"><b>B 구획</b><span>pH {gradient.pHB.toFixed(1)}</span><div className="proton-dots" aria-hidden="true">{Array.from({ length: Math.round(2 + (10 - gradient.pHB) * 2) }, (_, i) => <i key={i} />)}</div></div>
    </div>
    <p className="quiet">점의 개수는 많고 적음만 나타냅니다. 실제 농도비가 아닙니다. 두 기여가 반대 방향이면 합계로 판단합니다.</p>
    <h3 className="lesson-section-title">직접 바꿔 보세요</h3><GradientControls gradient={gradient} setGradient={setGradient} />
    <h3 className="lesson-section-title">두 기여를 더하면, 전체 기울기의 에너지</h3>
    <div className="metrics" aria-live="polite"><Metric label="화학적 기여" value={energy.chemical} /><Metric label="전기적 기여" value={energy.electrical} /><Metric label="전체 기울기 에너지" value={energy.total} /></div>
    <p className="result-direction" role="status">{energy.direction === 'equilibrium' ? '전기화학적 평형: 어느 방향에도 순 구동력이 없습니다.' : `열역학적으로 유리한 이동 방향: ${energy.direction === 'A→B' ? 'A → B' : 'B → A'}`}</p>
    <p className="note">표시한 값은 <strong>A → B 이동</strong>의 에너지 변화입니다. ΔG &lt; 0이면 그 방향으로 이동하며 에너지를 내놓을 수 있습니다. ΔG &gt; 0이면 그 방향의 이동에 에너지가 필요합니다.</p>
    <details className="formal-equation"><summary>+ 정식 식으로 정리하기</summary>
      <p>A 구획의 pH = pH<sub>A</sub>, B 구획의 pH = pH<sub>B</sub>. 막 양쪽 전위 차는 <Psi /> = {gradient.deltaPsiMv} mV입니다.</p>
      <div className="formula"><GH /> = <span>2.303RT(pH<sub>A</sub> − pH<sub>B</sub>)</span> + <span>F(ψ<sub>B</sub> − ψ<sub>A</sub>)</span></div>
      <dl className="formula-terms"><div><dt>2.303RT(pH<sub>A</sub> − pH<sub>B</sub>)</dt><dd>농도 차이의 기여</dd></div><div><dt>F(ψ<sub>B</sub> − ψ<sub>A</sub>)</dt><dd>전위 차이의 기여</dd></div></dl>
      <p>R은 기체 상수, F는 패러데이 상수입니다. T = {(gradient.temperatureC + 273.15).toFixed(2)} K. 계산할 때 mV를 V로, J를 kJ로 바꿉니다. 2.303은 ln(10)의 반올림 표기이며 계산에는 ln(10)을 사용합니다.</p>
    </details>
    <p className="step-bridge">다음에는 이 에너지를 여러 H⁺에 대해 합쳐, ATP 합성에 충분한지 비교합니다.</p>
  </div>
}

export function CouplingLesson({ gradient, ratio, requirement, setRatio, setRequirement, onGradient }: { gradient: Gradient; ratio: number; requirement: number; setRatio: (n: number) => void; setRequirement: (n: number) => void; onGradient: () => void }) {
  const [advanced, setAdvanced] = useState(false)
  const advancedId = useId()
  const energy = protonEnergy(gradient), total = ratio * energy.total
  const cycle = coupledEnergy(energy.total, ratio, requirement)
  const available = Math.max(0, -total), scale = Math.max(available, requirement, 1)
  const equilibrium = Math.abs(cycle) < 1e-9
  const sufficient = cycle < 0 && !equilibrium
  return <div className="early-lesson" data-testid="coupling-lesson" data-mode={advanced ? 'advanced' : 'basic'}>
    <div className="coupling-mode"><p className="step-question">H⁺가 돌아오며 내놓는 에너지로 ATP를 만들 수 있을까요?</p><button className="button" aria-expanded={advanced} aria-controls={advancedId} onClick={() => setAdvanced(!advanced)}>{advanced ? '− 기본으로' : '+ 심화'}</button></div>
    <ol className="coupling-intro"><li>H⁺가 기울기를 따라 이동하면 에너지를 방출합니다.</li><li>여러 H⁺의 이동은 ATP synthase의 회전과 ATP 합성에 연결됩니다.</li></ol>
    <div className="inherited-gradient"><span>01의 조건을 이어받음 · A 구획의 pH {gradient.pHA.toFixed(1)} / B 구획의 pH {gradient.pHB.toFixed(1)} · 막 양쪽 전위 차 {gradient.deltaPsiMv} mV · {gradient.temperatureC} °C</span><button className="button" onClick={onGradient}>기울기 조건 바꾸기</button></div>
    {!advanced && <CouplingVisual sufficient={sufficient} />}
    <div id={advancedId} hidden={!advanced}>
      {advanced && <>
        <ol className="coupling-story">
          <li><div className="story-heading"><span>1</span><h3>H⁺가 이동할 때 얻을 수 있는 에너지</h3></div><p>1 mol의 H⁺ 이동 기준</p><div className="story-value"><GH /> = <b>{energy.total.toFixed(2)}</b><small>kJ·mol⁻¹ H⁺</small></div><p className="quiet">A → B 이동의 자유에너지 변화입니다. 음수이면 에너지를 방출하고, 양수이면 이동에 에너지가 필요합니다.</p></li>
          <li><div className="story-heading"><span>2</span><h3>여러 H⁺의 이동 에너지를 합치기</h3></div><Range label="유효 H⁺/ATP 결합비 n" unit="H⁺/ATP" min={2} max={6} step={0.1} value={ratio} onChange={setRatio} /><p className="quiet">ATP 1개를 만드는 데 연결되는 H⁺ 수의 근사값입니다. 소수는 많은 ATP에 대한 평균을 뜻합니다.</p><p className="coupling-symbol">n × <GH /></p><div className="coupling-equation" aria-label="H⁺ 이동 에너지의 n배"><span>{ratio.toFixed(1)} H⁺/ATP</span><b>×</b><span>{energy.total.toFixed(2)}</span><b>=</b><strong>{total.toFixed(2)}</strong><small>kJ·mol⁻¹ ATP</small></div><p>{total < 0 ? `ATP 1 mol 합성에 연결되는 H⁺ 이동에서 얻을 수 있는 에너지: ${available.toFixed(2)} kJ·mol⁻¹ ATP` : '이 조건에서는 H⁺의 A → B 이동 자체에 에너지가 필요하거나, 내놓을 에너지가 없습니다.'}</p><p className="quiet">결합비는 모든 생물에서 같은 상수가 아닙니다. 회전자 구조와 수송 비용 등에 따라 달라집니다.</p></li>
          <li><div className="story-heading"><span>3</span><h3>ATP 합성에 필요한 에너지</h3></div><Range label="ATP 합성 자유에너지" unit="kJ·mol⁻¹ ATP" min={30} max={65} step={1} value={requirement} onChange={setRequirement} /><p className="quiet">현재 수치는 예시 조건입니다. 실제 값은 ATP/ADP/Pi 상태와 세포 조건에 따라 달라진다.</p></li>
        </ol>
        <div className="formula">ΔG<sub>cycle</sub> = n × <GH /> + ΔG<sub>ATP 합성</sub></div><p className="quiet">H⁺ 이동의 부호를 그대로 사용하고, 양수인 ATP 합성 비용을 더합니다. 합계가 음수이면 결합된 과정이 열역학적으로 유리합니다.</p>
        {total > 0 && <p className="quiet">A → B 이동에도 {total.toFixed(2)} kJ·mol⁻¹ ATP가 필요하므로, 이 비용까지 더해야 합니다.</p>}
      </>}
    </div>
    <h3 className="lesson-section-title">얻는 에너지와 필요한 에너지 비교하기</h3>
    <div className="energy-comparison" role="img" aria-label={advanced ? `H⁺ 이동에서 얻을 수 있는 에너지 ${available.toFixed(2)}, ATP 합성에 필요한 에너지 ${requirement.toFixed(2)} kJ·mol⁻¹ ATP` : `같은 ATP 합성량을 기준으로 비교: H⁺ 이동에서 얻을 수 있는 에너지가 ATP 합성에 필요한 에너지${equilibrium ? '와 같습니다' : sufficient ? '보다 큽니다' : '보다 작습니다'}`}>
      <div><span>H⁺ 이동에서 얻을 수 있는 에너지</span>{advanced && <strong>{available.toFixed(2)}</strong>}<div className="comparison-track"><i style={{ width: `${available / scale * 100}%` }} /></div></div>
      <div><span>ATP 합성에 필요한 에너지 · 예시 조건</span>{advanced && <strong>{requirement.toFixed(2)}</strong>}<div className="comparison-track cost"><i style={{ width: `${requirement / scale * 100}%` }} /></div></div>
      <small>{advanced ? '같은 눈금 · kJ·mol⁻¹ ATP' : '같은 ATP 합성량을 기준으로, 같은 눈금에서 비교합니다.'}</small>
    </div>
    <section className="coupling-result" data-outcome={equilibrium ? 'equilibrium' : sufficient ? 'sufficient' : 'insufficient'} aria-live="polite"><span>결합 결과{advanced && ' · 열역학적으로 유리한가?'}</span><strong>{advanced ? <>ΔG<sub>cycle</sub> = {Math.abs(cycle) < .005 ? '0.00' : cycle.toFixed(2)} <small>kJ·mol⁻¹ ATP</small></> : sufficient ? '충분' : '부족'}</strong><p>{sufficient ? '이 조건에서는 H⁺ 기울기가 ATP 합성을 구동할 만큼 충분합니다.' : '이 조건에서는 H⁺ 기울기만으로 ATP 합성을 구동하기 어렵습니다.'}</p>{equilibrium && <p>두 에너지가 같아 ATP 합성 방향의 순 구동력이 없습니다.</p>}</section>
    {advanced && <p className="note">에너지가 충분해도 실제 합성에는 작동하는 효소와 ADP·무기 인산이 필요하며, 이 계산만으로 ATP 생성 속도를 알 수는 없습니다.</p>}
    <p className="step-bridge">다음에는 막의 조건을 바꾸며 전자전달·H⁺ 기울기·ATP 합성의 관계를 비교합니다.</p>
  </div>
}
