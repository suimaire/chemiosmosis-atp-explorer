import { useState } from 'react'
import { pdhEquation } from '../respirationPathways'

export function PyruvateOxidationMap() {
  const [count, setCount] = useState<1 | 2>(1)
  return <div className="respiration-pathway pdh-map"><div className="pathway-heading"><h3>피루브산 탈수소효소 복합체(PDH)</h3></div>
    <div className="pathway-filters" role="group" aria-label="PDH 반응 기준"><button aria-pressed={count === 1} onClick={() => setCount(1)}>Pyruvate 1</button><button aria-pressed={count === 2} onClick={() => setCount(2)}>×2 / Glucose 1</button></div>
    <p className="pdh-equation" aria-live="polite">{pdhEquation(count)}</p>
    <figure className="pdh-complex"><figcaption><strong>Pyruvate dehydrogenase complex</strong></figcaption>
      <div className="pdh-events">
        <div><h4>E1 / Decarboxylation</h4><svg viewBox="0 0 280 110" role="img" aria-label="피루브산(3C)의 탄소 하나가 CO₂로 방출된다."><g className="carbon-beads"><circle cx={34} cy={40} r={13} /><circle cx={66} cy={40} r={13} /><circle cx={98} cy={40} r={13} /><path d="M117 40 H163 L155 34 M163 40 L155 46" /><circle cx={192} cy={40} r={13} /><circle cx={224} cy={40} r={13} /></g><path d="M98 55 Q98 87 150 87" className="co2-release" /><text x={160} y={93}>CO₂ ↑</text><text x={17} y={18}>3C</text><text x={185} y={18}>2C</text></svg><p>TPP를 이용한 탈탄산<br /><strong>{count} CO₂ 방출</strong></p></div>
        <div><h4>E2 / Acetyl transfer to CoA</h4><svg viewBox="0 0 280 110" role="img" aria-label="리포아마이드의 아세틸기가 CoA로 전달되어 아세틸-CoA가 생성된다."><text x={18} y={33}>Acetyl-lipoamide + CoA-SH</text><path d="M139 47 V65 L133 59 M139 65 L145 59" className="co2-release" /><text x={64} y={95}>Acetyl-CoA</text></svg><p>Lipoamide에서 CoA로 아세틸기 전달<br /><strong>{count} Acetyl-CoA 생성</strong></p></div>
        <div><h4>E3 / Cofactor reoxidation</h4><svg viewBox="0 0 280 110" role="img" aria-label="리포아마이드가 재산화될 때 전자는 효소 결합 FAD를 거쳐 NAD⁺로 전달된다."><text x={22} y={40}>NAD⁺</text><path d="M97 35 H170 L162 29 M170 35 L162 41" className="redox-line" /><text x={190} y={40}>NADH</text><text x={90} y={83}>NADH + H⁺ 생성</text></svg><p>효소 결합 FAD를 거친 전자 전달<br /><strong>{count} NADH 생성</strong></p></div>
      </div>
    </figure>
    <p className="note">E2에 결합된 리포아마이드가 반응 중간체를 활성 부위 사이로 운반한다.</p>
    <p className="pathway-caption">포도당 1분자에서 나온 피루브산 2분자가 산화될 때 위 총반응이 두 번 일어난다. ATP는 직접 생성되지 않는다.</p>
    <section className="pdh-cofactors" aria-label="PDH 보조인자와 반응 순서"><p><strong>보조인자: TPP, 리포아마이드, CoA, FAD, NAD⁺</strong></p><ol><li>E1은 TPP를 이용해 피루브산을 탈탄산한다. 남은 2탄소 단위가 산화되면서 E2의 리포아마이드에 아세틸기로 전달된다.</li><li>E2는 아세틸기를 CoA에 전달하여 아세틸-CoA를 생성한다.</li><li>E3는 환원된 리포아마이드를 재산화한다. 전자는 효소 결합 FAD를 거쳐 NAD⁺로 전달되고 NADH가 생성된다.</li></ol></section>
    <details><summary>보조인자의 재생</summary><p>TPP, 리포아마이드, FAD는 촉매 주기에서 재생된다. CoA와 NAD⁺는 총반응에서 소비된다. TCA 회로의 α-케토글루타르산 탈수소효소 복합체도 같은 종류의 보조인자를 사용한다.</p></details>
  </div>
}
