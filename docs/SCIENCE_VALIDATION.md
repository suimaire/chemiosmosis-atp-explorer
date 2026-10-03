# 과학 검증

검증일: 2026-10-03 (Asia/Seoul). 범위: 진핵세포 호흡, 산소발생 광합성, H⁺ 전기화학 퍼텐셜, 제한 정상상태 모형. 아래의 “확인”은 문헌 및 구현 검토를 뜻하며 생물학적 실험 검증을 뜻하지 않는다.

## Claim별 검증

| Claim | Implementation location | Verification source | Status | Simplification / limitation |
| --- | --- | --- | --- | --- |
| 해당과정은 세포질에서 진행 | `content.ts`, `Respiration.tsx` overview | [Cooper, Mitochondria](https://www.ncbi.nlm.nih.gov/books/NBK9896/) | 확인 | 진핵세포 기준 |
| 포도당당 pyruvate 2, 순 ATP 2, NADH 2 | `respirationSteps[0]`, 단계 01 | [Cooper, Metabolic Energy](https://www.ncbi.nlm.nih.gov/books/NBK9903/) | 확인 | ATP 2 투자·4 생성. 해당과정의 효소 10개는 생략 |
| pyruvate oxidation은 기질에서 acetyl-CoA·CO₂·NADH 생성 | `respirationSteps[1]`, 단계 02 | [Cooper, Mitochondria](https://www.ncbi.nlm.nih.gov/books/NBK9896/), [Alberts, Food energy](https://www.ncbi.nlm.nih.gov/books/NBK26882/) | 확인 | pyruvate 2 기준 CO₂ 2, NADH 2 |
| TCA 두 회전: CO₂ 4, NADH 6, FADH₂ 2, GTP/ATP 2 | `respirationSteps[2]`, `TcaCycle` | [Alberts, Food energy](https://www.ncbi.nlm.nih.gov/books/NBK26882/), [Citric Acid Cycle](https://www.ncbi.nlm.nih.gov/books/NBK541072/) | 확인 | GTP/ATP는 동위효소·조직 차이. 아세틸 탄소가 첫 회전에 바로 CO₂가 된다고 가정하지 않음 |
| TCA는 주로 기질, succinate dehydrogenase는 내막 결합 | 단계 03 심화 | [Citric Acid Cycle](https://www.ncbi.nlm.nih.gov/books/NBK541072/) | 확인 | 기질 측 촉매 부위 |
| NADH는 I, succinate 산화의 효소 결합 FAD는 II에서 전자 공급 | `Membrane.tsx`, 단계 04 해설 | [Cooper, Oxidative phosphorylation](https://www.ncbi.nlm.nih.gov/books/NBK9885/), [Alberts, Proton pumps](https://www.ncbi.nlm.nih.gov/books/NBK26904/) | 확인 | 자유 FADH₂가 떠다니며 II에 들어간다는 뜻이 아님. 세포질 NADH는 셔틀 경유 |
| I·III·IV가 H⁺ 기울기에 기여, II는 펌프가 아님 | `Membrane`, `respirationSteps[3]` | [Alberts, Proton pumps](https://www.ncbi.nlm.nih.gov/books/NBK26904/) | 확인 | III의 Q cycle을 순 H⁺ 이동 화살표로 요약. 개별 복합체의 수송 수지는 미표시 |
| O₂는 IV에서 최종 전자수용체로 쓰이며 물 생성 | 단계 04 텍스트·SVG | [Alberts, Proton pumps](https://www.ncbi.nlm.nih.gov/books/NBK26904/) | 확인 | 반응식의 전자·H⁺ 전체 화학량론은 축약 |
| 미토콘드리아 ATP 합성 시 H⁺는 IMS → matrix | `compartments`, `Membrane`, 퀴즈 | [Cooper, Oxidative phosphorylation](https://www.ncbi.nlm.nih.gov/books/NBK9885/) | 확인 | 합성 방향만 그리며 역회전·ATP 가수분해는 생략 |
| 명반응은 틸라코이드 막, Calvin cycle은 stroma | `Photosynthesis.tsx`, `photoFacts` | [Alberts, Chloroplasts](https://www.ncbi.nlm.nih.gov/books/NBK26819/) | 확인 | 엽록체 세부 막 구조·효소 국소화는 생략 |
| Linear: 물 → PSII → PQ → b₆f → PC → PSI → Fd → FNR → NADPH | `LightFlow(false)` | [Johnson 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/) | 확인 | 광계 내부 전달체와 Z-scheme의 에너지 축은 생략 |
| PSII 물 산화가 O₂·전자·내강 H⁺를 공급 | `LightFlow(false)` | [Alberts, Chloroplasts](https://www.ncbi.nlm.nih.gov/books/NBK26819/) | 확인 | 상세 산소발생 복합체 생략 |
| PQ/b₆f가 내강 H⁺ 축적에 기여, 합성 시 lumen → stroma | `LightFlow`, `Membrane(plant)` | [Johnson 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/) | 확인 | 전기적 성분도 존재. 그림의 H⁺ 개수는 농도비 아님 |
| Cyclic: PSI 중심, Fd 이후 PQ/b₆f 계통 복귀 | `LightFlow(true)` | [Alberts, Chloroplasts](https://www.ncbi.nlm.nih.gov/books/NBK26819/), [Johnson 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/) | 확인 | 식물·조건별 실제 경로와 조절 복잡성 명시 |
| 순환 회로 자체에 PSII 참여·O₂ 및 NADPH 순생성 없음 | `photoFacts`, 비교 표, 퀴즈 | [Alberts, Chloroplasts](https://www.ncbi.nlm.nih.gov/books/NBK26819/) | 확인 | 실제 엽록체에서 linear와 cyclic이 동시에 일어날 수 있음 |
| Rubisco 탄소 고정 → ATP/NADPH 사용 환원 → ATP 사용 RuBP 재생 | `CalvinCycle` | [Johnson 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/) | 확인 | 3 CO₂ 기준 탄소 수지를 표시 |
| 3 CO₂·9 ATP·6 NADPH 소비, 순 G3P 1 | `CalvinCycle` 심화·퀴즈 | [Johnson 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/) | 확인 | G3P는 당 합성 전구체. 광호흡·부가 수송 비용 제외 |
| H⁺ 이동 에너지는 화학항과 전기항의 합 | `science.ts:protonEnergy` | [Alberts, Mitochondrion](https://www.ncbi.nlm.nih.gov/books/NBK26894/), [UW–Eau Claire 강의](https://www.chem.uwec.edu/Chem352_Resources/pages/lecture_materials/unit_III/lecture-10/overheads/Chem352-Lecture_10-Part_III-view.pdf) | 식 유도·수치 검사 | 아래 부호와 단위 정의 사용 |
| 결합 에너지 nΔG_H + 양의 ATP 합성 에너지 | `coupledEnergy`, 모듈 03 | [Alberts, Mitochondrion](https://www.ncbi.nlm.nih.gov/books/NBK26894/) | 확인 | 열역학적 유리함은 속도를 결정하지 않음 |
| H⁺/ATP는 모든 생물에서 같은 상수가 아님 | 모듈 03 | [Watt et al. 2010, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC2947889/) | 확인 | c-ring 구조·수송 비용에 따라 달라짐. 조절값은 유효 모형 파라미터 |
| ATP 경로 억제: 기울기 상승, 호흡·ATP 저하 가능 | `steadyState`, preset inhibited | [Alberts, Proton pumps](https://www.ncbi.nlm.nih.gov/books/NBK26904/) | 정성 관계 확인 | 충분한 공급·정상상태·단일 처리라는 조건에 한함 |
| H⁺ 누출: 기울기·ATP 감소, 충분한 공급에서 산소 소비 증가 가능 | `steadyState`, preset leak | [Alberts, Proton pumps](https://www.ncbi.nlm.nih.gov/books/NBK26904/) | 정성 관계 확인 | 수치는 모형 생성. 실제 조건 전반의 절대 법칙이 아님 |
| R·F의 SI 단위와 값 | `science.ts` constants | [NIST CODATA](https://physics.nist.gov/cuu/Constants/) | 확인 | 표시 자릿수에 맞게 반올림 |

일부 오래된 교재의 고정 ATP 수율(예: NADH당 3 ATP, 포도당당 38 ATP)은 채택하지 않았다. 여기서는 안정적으로 확립된 경로·구획·물질 수지와 최신 구조 기반 결합비의 비보편성을 구분한다.

## 에너지식 부호와 단위

H⁺의 전하 z=+1, 출발 구획 A, 도착 구획 B:

```text
ΔG = RT ln(a_H,B / a_H,A) + F(ψ_B − ψ_A)
pH = −log10(a_H)
∴ ΔG_H = ln(10) RT(pH_A − pH_B) + F(ψ_B − ψ_A)
```

화면의 2.303은 ln(10)의 근사 표기이며 구현은 `Math.LN10` 사용. R=8.314462618 J·mol⁻¹·K⁻¹, F=96485.33212 C·mol⁻¹. °C→K에는 273.15를 더하고, mV→V 및 J→kJ를 각각 변환한다. pH는 활동도로 해석하고 개별 활동도 계수는 계산하지 않는다.

- pH_A=6, pH_B=7, Δψ=0, 25 °C: 약 −5.708 kJ/mol H⁺.
- pH_A=pH_B, Δψ=−100 mV: 약 −9.649 kJ/mol H⁺.
- 양쪽 기여가 반대면 합계로 방향 판단. 0이면 순 구동력 없음.
- ΔG_cycle<0는 지정 방향의 결합된 합성이 유리함을 뜻한다. 실제 ATP 생산률은 별도 문제이다.

## 막 실험의 교육용 제한 모형

원자료를 회귀한 모형이 아니다. 문헌의 정성 관계를 표현하기 위해 다음 정상상태 균형을 설계했다.

```text
s = 0.75 × ADP availability × synthase activity
g = input / (input + leak + s)
electron flux J = input × (1 − g)
leak flux = leak × g
ATP-pathway flux = s × g
```

J = leak flux + ATP-pathway flux. 산소 소비는 J에, 산화적 ATP 합성은 ATP-pathway flux에 비례한다. 각각 정상 조건의 동일 지표로 나누어 100을 곱한다. 0.75·0.12 등의 값은 교육용 무차원 파라미터이며 생리학적 측정값이 아니다. 가상 자료 세 조건도 동일 모형에서 생성한다. 가상 조건마다 다른 원인을 숨기며 단일 처리만 가정한다.

모듈 02–03의 자유에너지와 이 모형의 속도는 연결하지 않는다. 이 모형에는 역 ATPase 반응·합성 임계 구동력·유한 저장 용량·시간 과도응답·기질과 산소 고갈·활성산소·조직별 조절이 없다. 입력을 0으로 하면 남아 있던 기울기가 소진된 장기 상태를 표시한다. 실제 실험 해석에는 추가 측정과 대조군이 필요하다.

## 검사 근거

`src/science.test.ts` 24개: 부호·단위·온도·0 기울기·상쇄·방향 역전·ATP 결합 경계·모형 정성 관계·질량/유량 균형·입력 경계. `src/content.test.tsx` 12개: 학습 수지·구획·II 비펌프·광합성 모드·실제 렌더링된 SVG 설명. 브라우저 검사와 스크린샷 결과는 `verification/QA_REPORT.md` 참조.
