import { useState } from 'react'
import { pdhEquation } from '../respirationPathways'

export function PyruvateOxidationMap() {
  const [count, setCount] = useState<1 | 2>(1)
  return <div className="respiration-pathway pdh-map"><div className="pathway-heading"><h3>탄소 하나를 내보내고, 전자를 회수하고, CoA에 연결</h3></div>
    <div className="pathway-filters" role="group" aria-label="PDH 반응 기준"><button aria-pressed={count === 1} onClick={() => setCount(1)}>Pyruvate 1</button><button aria-pressed={count === 2} onClick={() => setCount(2)}>×2 · Glucose 1</button></div>
    <p className="pdh-equation" aria-live="polite">{pdhEquation(count)}</p>
    <figure className="pdh-complex"><figcaption><strong>Pyruvate dehydrogenase complex</strong><span>PDH complex · 하나의 결합된 반응</span></figcaption>
      <div className="pdh-events">
        <div><h4>E1 · Decarboxylation</h4><svg viewBox="0 0 280 110" role="img" aria-label="3C pyruvate에서 탄소 하나가 CO₂로 방출됩니다."><g className="carbon-beads"><circle cx={34} cy={40} r={13} /><circle cx={66} cy={40} r={13} /><circle cx={98} cy={40} r={13} /><path d="M117 40 H163 L155 34 M163 40 L155 46" /><circle cx={192} cy={40} r={13} /><circle cx={224} cy={40} r={13} /></g><path d="M98 55 Q98 87 150 87" className="co2-release" /><text x={160} y={93}>CO₂ ↑</text><text x={17} y={18}>3C</text><text x={185} y={18}>2C</text></svg><p>TPP를 이용한 탈탄산<br /><strong>{count} CO₂ 방출</strong></p></div>
        <div><h4>E2 · Acetyl transfer to CoA</h4><svg viewBox="0 0 280 110" role="img" aria-label="lipoamide에 결합된 아세틸기가 CoA로 전달되어 acetyl-CoA가 됩니다."><text x={18} y={33}>2C acetyl + CoA-SH</text><path d="M139 47 V65 L133 59 M139 65 L145 59" className="co2-release" /><text x={64} y={95}>Acetyl-CoA · 2C</text></svg><p>Lipoamide에서 CoA로 아세틸기 전달<br /><strong>{count} Acetyl-CoA 생성</strong></p></div>
        <div><h4>E3 · Cofactor reoxidation</h4><svg viewBox="0 0 280 110" role="img" aria-label="lipoamide 재산화 과정에서 효소 결합 FAD를 거친 전자가 NAD⁺로 전달되어 NADH가 됩니다."><text x={22} y={40}>NAD⁺</text><path d="M97 35 H170 L162 29 M170 35 L162 41" className="redox-line" /><text x={190} y={40}>NADH</text><text x={90} y={83}>전자 회수 · + H⁺</text></svg><p>효소 결합 FAD를 거친 전자 전달<br /><strong>{count} NADH 생성</strong></p></div>
      </div>
    </figure>
    <p className="note">교육적 분해: 세 그림은 PDH complex 안에서 서로 결합된 사건을 나누어 보여 줍니다. 세 개의 독립 반응이나 자유로운 2C 중간체가 차례로 떠다니는 경로를 뜻하지 않습니다.</p>
    <p className="pathway-caption">포도당 1분자는 pyruvate 2분자를 만듭니다. 따라서 위 반응이 ×2: acetyl-CoA 2, CO₂ 2, NADH 2, H⁺ 2. ATP는 직접 생성하지 않습니다.</p>
    <section className="pdh-cofactors" aria-label="PDH 보조인자와 반응 순서"><p><strong>보조인자: TPP · lipoamide · CoA · FAD · NAD⁺</strong></p><ol><li>E1: TPP를 이용해 pyruvate를 탈탄산합니다. 이어 E2의 lipoamide로 아세틸기와 환원력이 전달됩니다.</li><li>E2: 아세틸기를 CoA로 옮겨 acetyl-CoA를 만듭니다.</li><li>E3: 환원된 lipoamide를 재산화합니다. 전자는 효소 결합 FAD를 거쳐 NAD⁺로 전달되어 NADH가 됩니다.</li></ol><p>NADH는 이 보조인자 재생 과정의 뒤쪽에서 생성됩니다.</p></section>
    <details><summary>심화 · PDH complex</summary><p>TPP·lipoamide·FAD는 촉매 주기에서 재생됩니다. CoA와 NAD⁺는 총반응의 입력입니다. 다음 TCA의 α-ketoglutarate dehydrogenase complex도 유사한 보조인자 원리를 사용합니다.</p></details>
  </div>
}
