import { useId, useState, type ReactNode } from 'react'
import { coupledEnergy, defaultGradient, protonEnergy, type Gradient } from '../../science'
import { CouplingVisual } from './CouplingVisual'

export function Range({ label, accessibleLabel, unit = '', min, max, step, value, onChange }: { label: ReactNode; accessibleLabel?: string; unit?: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const id = useId()
  return <label className="range-control" htmlFor={id}><span className="range-label"><span>{label}</span><output htmlFor={id}>{value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)} {unit}</output></span><input id={id} aria-label={accessibleLabel ?? (typeof label === 'string' ? label : undefined)} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>
}
function Metric({ label, value, unit = 'kJ mol⁻¹ H⁺' }: { label: ReactNode; value: number; unit?: string }) { return <div className="metric"><small>{label}</small><strong>{Math.abs(value) < 0.005 ? '0.00' : value.toFixed(2)}</strong><span>{unit}</span></div> }
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
    <p className="quiet">미토콘드리아에서 A는 막사이공간, B는 기질이다. 엽록체에서 A는 틸라코이드 내강, B는 스트로마다. 전위 차는 B의 전위에서 A의 전위를 뺀 값이다.</p>
  </>
}

export function GradientLesson({ gradient, setGradient }: { gradient: Gradient; setGradient: (g: Gradient) => void }) {
  const energy = protonEnergy(gradient)
  const tendency = (value: number) => Math.abs(value) < 1e-9 ? '차이 없음' : value < 0 ? 'A → B' : 'B → A'
  return <div className="early-lesson" data-testid="gradient-lesson">
    <p>막의 지질 이중층은 H⁺를 잘 통과시키지 않으므로 막 양쪽에 H⁺의 전기화학적 기울기가 유지될 수 있다. 이 기울기에는 농도 차와 전위 차가 모두 기여한다. 두 효과가 반대 방향으로 작용할 때에는 두 자유에너지 항의 합이 H⁺의 자발적인 이동 방향을 결정한다.</p>
    <div className="contribution-cards">
      <article className="chemical-card"><h3>농도 차의 기여</h3><p>같은 전위에서는 H⁺ 농도가 높은 쪽(낮은 pH)에서 낮은 쪽(높은 pH)으로 이동할 때 자유에너지가 감소한다.</p></article>
      <article className="electrical-card"><h3>막전위의 기여</h3><p>H⁺는 양전하를 띤다. 같은 pH에서는 전위가 높은 쪽에서 낮은 쪽으로 이동할 때 자유에너지가 감소한다.</p></article>
    </div>
    <div className="gradient-stage">
    <div className="gradient-result">
    <div className="gradient-map" aria-label="두 구획과 H⁺ 이동 방향">
      <div className="gradient-compartment"><b>A 구획</b><span>pH {gradient.pHA.toFixed(1)}</span><div className="proton-dots" aria-hidden="true">{Array.from({ length: Math.round(2 + (10 - gradient.pHA) * 2) }, (_, i) => <i key={i} />)}</div></div>
      <div className="gradient-arrows"><span>농도 차 <b>{tendency(energy.chemical)}</b></span><span>전위 차 <b>{tendency(energy.electrical)}</b></span><strong>{energy.direction === 'equilibrium' ? '순 구동력 없음' : energy.direction === 'A→B' ? '전체 A → B' : '전체 B → A'}</strong><small>전위 차 {gradient.deltaPsiMv} mV</small></div>
      <div className="gradient-compartment"><b>B 구획</b><span>pH {gradient.pHB.toFixed(1)}</span><div className="proton-dots" aria-hidden="true">{Array.from({ length: Math.round(2 + (10 - gradient.pHB) * 2) }, (_, i) => <i key={i} />)}</div></div>
    </div>

    <h3 className="lesson-section-title">H⁺ 1몰의 이동 자유에너지 (A → B)</h3>
    <div className="metrics" aria-live="polite"><Metric label="화학적 기여" value={energy.chemical} /><Metric label="전기적 기여" value={energy.electrical} /><Metric label="총 자유에너지 변화" value={energy.total} /></div>
    <p className="result-direction" role="status">{energy.direction === 'equilibrium' ? '전기화학적 평형 (순 구동력 0)' : `열역학적으로 유리한 이동 방향: ${energy.direction === 'A→B' ? 'A → B' : 'B → A'}`}</p>
    </div>
    <div className="gradient-controls"><h3 className="lesson-section-title">막 양쪽의 조건</h3><GradientControls gradient={gradient} setGradient={setGradient} /></div>
    </div>
    <p className="note"><strong>A → B 이동</strong>에서 ΔG &lt; 0이면 자유에너지가 방출된다. ΔG &gt; 0이면 같은 방향의 이동에 에너지를 공급해야 한다.</p>
    <details className="formal-equation"><summary>H⁺ 이동의 자유에너지 식</summary>
      <p>A 구획의 pH = pH<sub>A</sub>, B 구획의 pH = pH<sub>B</sub>. 막 양쪽 전위 차는 <Psi /> = {gradient.deltaPsiMv} mV이다.</p>
      <div className="formula"><GH /> = <span>2.303RT(pH<sub>A</sub> − pH<sub>B</sub>)</span> + <span>F(ψ<sub>B</sub> − ψ<sub>A</sub>)</span></div>
      <dl className="formula-terms"><div><dt>2.303RT(pH<sub>A</sub> − pH<sub>B</sub>)</dt><dd>농도 차이의 기여</dd></div><div><dt>F(ψ<sub>B</sub> − ψ<sub>A</sub>)</dt><dd>전위 차이의 기여</dd></div></dl>
      <p>기체 상수 R = 8.314462618 J mol⁻¹ K⁻¹, 패러데이 상수 F = 96485.33212 C mol⁻¹이다. 절대온도 T = {(gradient.temperatureC + 273.15).toFixed(2)} K. 전위 차를 V로 대입하면 결과는 J/mol이다. 표시값은 이를 kJ/mol로 환산한다. 2.303은 계산에 사용한 ln(10)의 근삿값이다.</p>
    </details>
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
    <div className="coupling-mode"><p className="step-question">ATP 1몰을 합성하려면 H⁺ 이동에서 얼마의 자유에너지를 얻어야 하는가?</p><button className="button" aria-expanded={advanced} aria-controls={advancedId} onClick={() => setAdvanced(!advanced)}>{advanced ? '− 기본으로' : '+ 심화'}</button></div>
    <p>H⁺가 ATP 합성효소의 막 부분을 통과하면 c 고리와 중심축이 회전한다. 중심축의 회전은 촉매 부위의 입체 구조를 바꾸어 ADP와 무기 인산을 결합시키고, 생성된 ATP를 효소에서 방출시킨다.</p>
    <div className="inherited-gradient"><span>모듈 01의 조건 / A 구획의 pH {gradient.pHA.toFixed(1)} / B 구획의 pH {gradient.pHB.toFixed(1)} / 막 양쪽 전위 차 {gradient.deltaPsiMv} mV / {gradient.temperatureC} °C</span><button className="button" onClick={onGradient}>기울기 조건 바꾸기</button></div>
    <div className="coupling-stage">
    <div className="coupling-main">
    {!advanced && <CouplingVisual sufficient={sufficient} />}
    <div id={advancedId} hidden={!advanced}>
      {advanced && <>
        <ol className="coupling-story">
          <li><div className="story-heading"><span>1</span><h3>H⁺ 1몰의 이동 자유에너지</h3></div><p>1 mol의 H⁺ 이동 기준</p><div className="story-value"><GH /> = <b>{energy.total.toFixed(2)}</b><small>kJ mol⁻¹ H⁺</small></div><p className="quiet">A → B 이동에서 음수는 자유에너지 방출, 양수는 에너지 투입을 뜻한다.</p></li>
          <li><div className="story-heading"><span>2</span><h3>ATP 1몰당 H⁺ 이동 자유에너지</h3></div><Range label="유효 H⁺/ATP 결합비 n" unit="H⁺/ATP" min={2} max={6} step={0.1} value={ratio} onChange={setRatio} /><p className="quiet">n은 ATP 1몰 합성에 결합된 H⁺의 몰수이다.</p><p className="coupling-symbol">n × <GH /></p><div className="coupling-equation" aria-label="H⁺ 이동 에너지의 n배"><span>{ratio.toFixed(1)} H⁺/ATP</span><b>×</b><span>{energy.total.toFixed(2)}</span><b>=</b><strong>{total.toFixed(2)}</strong><small>kJ mol⁻¹ ATP</small></div><p>{total < 0 ? `ATP 1 mol 합성에 연결되는 H⁺ 이동에서 얻을 수 있는 에너지: ${available.toFixed(2)} kJ mol⁻¹ ATP` : '이 조건에서 A → B 이동으로 방출되는 자유에너지는 0이다.'}</p><p className="quiet">효소 자체의 결합비는 회전자의 c 소단위 수에 따라 달라진다. ATP 공급 비용을 구할 때에는 대사물 수송에 쓰인 에너지도 고려한다.</p></li>
          <li><div className="story-heading"><span>3</span><h3>ATP 합성에 필요한 에너지</h3></div><Range label="ATP 합성 자유에너지" unit="kJ mol⁻¹ ATP" min={30} max={65} step={1} value={requirement} onChange={setRequirement} /><p className="quiet">ATP 합성의 자유에너지 변화는 ATP, ADP, 무기 인산의 농도에 따라 달라진다.</p></li>
        </ol>
        <div className="formula">ΔG<sub>cycle</sub> = n × <GH /> + ΔG<sub>ATP 합성</sub></div><p className="quiet">부호를 포함한 H⁺ 이동 자유에너지에 ATP 합성 자유에너지를 더한다. 합이 음수이면 ATP 합성 방향이 열역학적으로 유리하다.</p>
        {total > 0 && <p className="quiet">A → B 이동에 {total.toFixed(2)} kJ mol⁻¹ ATP가 추가로 필요하다.</p>}
      </>}
    </div>
    </div>
    <div className="coupling-aside">
    <h3 className="lesson-section-title">ATP 1몰당 에너지 비교</h3>
    <div className="energy-comparison" role="img" aria-label={advanced ? `H⁺ 이동에서 얻을 수 있는 에너지 ${available.toFixed(2)}, ATP 합성에 필요한 에너지 ${requirement.toFixed(2)} kJ mol⁻¹ ATP` : `같은 ATP 합성량을 기준으로 비교: H⁺ 이동에서 얻을 수 있는 에너지가 ATP 합성에 필요한 에너지${equilibrium ? '와 같습니다' : sufficient ? '보다 큽니다' : '보다 작습니다'}`}>
      <div><span>H⁺ 이동에서 얻을 수 있는 에너지</span>{advanced && <strong>{available.toFixed(2)}</strong>}<div className="comparison-track"><i style={{ width: `${available / scale * 100}%` }} /></div></div>
      <div><span>ATP 합성에 필요한 에너지</span>{advanced && <strong>{requirement.toFixed(2)}</strong>}<div className="comparison-track cost"><i style={{ width: `${requirement / scale * 100}%` }} /></div></div>
      <small>{advanced ? '단위 / kJ mol⁻¹ ATP' : 'ATP 1몰 기준'}</small>
    </div>
    <section className="coupling-result" data-outcome={equilibrium ? 'equilibrium' : sufficient ? 'sufficient' : 'insufficient'} aria-live="polite"><span>결합 결과{advanced && ' (총 자유에너지 변화)'}</span><strong>{advanced ? <>ΔG<sub>cycle</sub> = {Math.abs(cycle) < .005 ? '0.00' : cycle.toFixed(2)} <small>kJ mol⁻¹ ATP</small></> : equilibrium ? '평형' : sufficient ? '충분' : '부족'}</strong><p>{equilibrium ? '두 에너지가 같아 ATP 합성 방향의 순 구동력이 없다.' : sufficient ? 'H⁺ 이동에서 방출되는 자유에너지가 ATP 합성에 필요한 양보다 크다.' : 'H⁺ 이동으로 얻는 자유에너지가 ATP 합성에 필요한 양보다 작다.'}</p></section>
    {advanced && <p className="note">이 계산은 반응의 방향을 판정한다. 합성 속도는 ATP 합성효소의 활성과 ADP 및 무기 인산의 공급에도 좌우된다.</p>}
    </div>
    </div>
  </div>
}
