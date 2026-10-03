# 과학 검증

## 2026-10-03 · Explorer 00–02 개편

현재 Explorer는 00 전자전달과 H⁺ 축적 / 01 H⁺ 기울기의 에너지 / 02 ATP 합성에 충분한가? / 03 막을 조작하기 / 04 자료 추론 / 05 광합성 전이의 6단계다. 기존 문서의 ‘Step 04 3D 비교’는 현재 Explorer 03에 대응하며, 세포호흡 페이지의 Step 04 번호는 그대로다.

- **경로와 구획:** 새 00은 운반체 사이의 전자 전달과 막을 가로지르는 H⁺ 이동을 구분한다. 펌핑은 기질 → 막사이공간, 합성과 연결된 귀환은 막사이공간 → 기질이다. [전자전달계와 양성자 펌프](https://www.ncbi.nlm.nih.gov/books/NBK26904/), [미토콘드리아의 에너지 전환](https://www.ncbi.nlm.nih.gov/books/NBK26894/)의 기존 근거와 대조했다. 직접 열기는 브라우저 확인 화면이 반환되어 해당 문헌의 검색 제공 본문도 확인했다.
- **교육적 단순화:** 단일 3D 모형은 NADH 쪽 진입을 대표로 삼고 I·III·IV의 순 H⁺ 이동을 표현한다. II 가지는 기본 장면에서 생략하며, 심화에는 II 비펌프·효소 결합 FAD·Q·cyt c를 명시한다. 점의 개수, 회전, ATP pulse는 농도·화학량론·반응 속도의 실제 값이 아니다. 전자가 자유 입자로 관 안을 흐른다는 뜻이 아니다.
- **에너지 부호:** 새 01의 화학항·전기항·합계는 기존 `protonEnergy` 그대로다. A → B 기준이며 Δψ = ψ<sub>B</sub> − ψ<sub>A</sub>. ΔG가 음수면 해당 방향이 유리하다. 상쇄·방향 역전·온도와 단위 변환은 기존 과학 테스트를 유지한다.
- **수식 표기:** UI의 아랫첨자·윗첨자는 HTML `sub`/`sup`로 렌더링한다. 수식은 개념·조작·결과 뒤의 펼침 영역에 둔다. 표시값 2.303, 실제 계산 `Math.LN10`의 기존 정책을 유지했다.
- **입자와 몰 단위:** 새 02의 ‘H⁺ 1개당’은 개념 설명이며, 수치는 H⁺ 1몰 기준 kJ·mol⁻¹ H⁺임을 명시한다. n은 ATP 1개당 연결되는 H⁺의 유효 평균수다. n을 곱한 값과 ATP 요구량은 모두 kJ·mol⁻¹ ATP로 비교한다.
- **결합 결과:** ΔG<sub>cycle</sub> = n × ΔG<sub>H⁺</sub> + ΔG<sub>ATP 합성</sub>. 에너지 막대는 방출 가능한 크기 max(0, −nΔG<sub>H⁺</sub>)를 표시하지만, 실제 결합 계산은 항상 부호 있는 nΔG를 사용한다. 오르막 이동에는 ATP 비용 외에 이동 비용도 필요함을 표시한다. 평형은 충분으로 분류하지 않는다.
- **보호 범위:** `science.ts`, 광합성 페이지·경로·퀴즈 데이터, 기존 A/B 상태 매핑·정상상태 모형은 유지한다. 새 03의 속도는 새 01·02의 자유에너지 계산으로부터 예측한 값이 아니다.

설계 상세: [초반 구조 개편](EXPLORER_EARLY_REDESIGN.md). 당시 구현 검증: 단위·과학 74/74, 브라우저 29/29(네 viewport) 통과. 현재 최종 검증은 [디자인 QA](../verification/DESIGN_OPUS55_QA.md)에 있다. 아래의 이전 검증 기록과 단순화 경계도 계속 적용한다.

검증일: 2026-10-03 (Asia/Seoul). 범위: 진핵세포 호흡, 산소발생 광합성, H⁺ 전기화학 퍼텐셜, 제한 정상상태 모형. 아래의 “확인”은 문헌 및 구현 검토를 뜻하며 생물학적 실험 검증을 뜻하지 않는다.

## Claim별 검증

| Claim | Implementation location | Verification source | Status | Simplification / limitation |
| --- | --- | --- | --- | --- |
| 해당과정은 세포질에서 진행 | `content.ts`, `Respiration.tsx` overview | [Cooper, Mitochondria](https://www.ncbi.nlm.nih.gov/books/NBK9896/) | 확인 | 진핵세포 기준 |
| 포도당당 pyruvate 2, 순 ATP 2, NADH 2 | `respirationSteps[0]`, `GlycolysisMap` | [Cooper, Metabolic Energy](https://www.ncbi.nlm.nih.gov/books/NBK9903/) | 확인 | ATP 2 투자·4 생성. 효소 10개와 생성 위치는 상세 지도에 표시 |
| pyruvate oxidation은 기질에서 acetyl-CoA·CO₂·NADH 생성 | `respirationSteps[1]`, 단계 02 | [Cooper, Mitochondria](https://www.ncbi.nlm.nih.gov/books/NBK9896/), [Alberts, Food energy](https://www.ncbi.nlm.nih.gov/books/NBK26882/) | 확인 | pyruvate 2 기준 CO₂ 2, NADH 2 |
| TCA 두 회전: CO₂ 4, NADH 6, FAD-linked 환원력 2 → QH₂ 2, GTP 2 | `respirationSteps[2]`, `TcaCycleMap` | [Alberts, Food energy](https://www.ncbi.nlm.nih.gov/books/NBK26882/), [Citric Acid Cycle](https://www.ncbi.nlm.nih.gov/books/NBK541072/) | 확인 | GTP형 표시, ADP형 동위효소는 심화 설명. 아세틸 탄소를 첫 회전 CO₂에 바로 대응시키지 않음 |
| TCA는 주로 기질, succinate dehydrogenase는 내막 결합 | 단계 03 심화 지도·위치 note | [Citric Acid Cycle](https://www.ncbi.nlm.nih.gov/books/NBK541072/) | 확인 | 기질 측 촉매 부위 |
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
| 결합 에너지 nΔG_H + 양의 ATP 합성 에너지 | `coupledEnergy`, 모듈 02 | [Alberts, Mitochondrion](https://www.ncbi.nlm.nih.gov/books/NBK26894/) | 확인 | 열역학적 유리함은 속도를 결정하지 않음 |
| H⁺/ATP는 모든 생물에서 같은 상수가 아님 | 모듈 02 | [Watt et al. 2010, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC2947889/) | 확인 | c-ring 구조·수송 비용에 따라 달라짐. 조절값은 유효 모형 파라미터 |
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

모듈 01–02의 자유에너지와 이 모형의 속도는 연결하지 않는다. 이 모형에는 역 ATPase 반응·합성 임계 구동력·유한 저장 용량·시간 과도응답·기질과 산소 고갈·활성산소·조직별 조절이 없다. 입력을 0으로 하면 남아 있던 기울기가 소진된 장기 상태를 표시한다. 실제 실험 해석에는 추가 측정과 대조군이 필요하다.

## 검사 근거

`src/science.test.ts` 24개: 부호·단위·온도·0 기울기·상쇄·방향 역전·ATP 결합 경계·모형 정성 관계·질량/유량 균형·입력 경계. `src/content.test.tsx` 12개: 학습 수지·구획·II 비펌프·광합성 모드·실제 렌더링된 SVG 설명. 브라우저 검사와 스크린샷 결과는 `verification/QA_REPORT.md` 참조.

## 2026-10-03 · Respiration Step 01–03 상세 경로 확장

Overview는 기존 시스템 지도를 유지했다. 아래 검증은 새 `respirationPathways.ts` 데이터와 이를 읽는 상세 컴포넌트에 해당한다. 교육 경로의 반응 순서와 화학량론을 NCBI 교재, Reactome의 검토된 인간 경로, 보조인자 관련 연구로 대조했다. NCBI 일부 직접 열기는 브라우저 확인 화면을 반환하여 검색으로 제공된 해당 문서 본문도 이용했다. 출처의 오래된 고정 ATP 환산값은 채택하지 않았다.

| Claim | UI location | Source | Simplification | Status |
| --- | --- | --- | --- | --- |
| 해당과정 10반응과 효소 순서 | `GlycolysisMap`, 반응 01–10 | [Glycolysis][gly], [Alberts][food] | 구조식 대신 약어, 전체 이름은 반응 버튼·설명에 제공 | 확인 |
| Hexokinase·PFK-1에서 ATP 각각 1 투자; PGK·PK에서 포도당당 각각 2 회수 | 지도 반응 01·03·07·10, ATP ledger | [Glycolysis][gly] | 포도당 1분자 기준 −2 +4 = net +2 | 확인 |
| Aldolase: G3P + DHAP; TPI: DHAP → G3P; 이후 2 × G3P | 해당과정 분기·회수 구간 | [Alberts][food] | 순 진행 방향 표시, 평형 화살표는 생략 | 확인 |
| GAPDH: 2 NAD⁺ + 2 Pi → 2 NADH + 2 H⁺ | 해당과정 06, NADH 필터 | [Glycolysis][gly] | 산화와 무기 인산 첨가를 한 사건으로 요약 | 확인 |
| PGK·PK의 ATP는 중간체 인산기를 ADP에 전달하는 기질수준 인산화 | 반응 07·10, 인산기 전달 inset | [Alberts][food], [PGK 반응 연구][pgk] | inset은 1반응 기준, 포도당당 각각 ×2 | 확인 |
| 해당과정의 사실상 비가역 단계는 HK·PFK-1·PK | 비가역 필터·반응 설명 | [Glycolysis][gly] | 세포 내 조건에서의 방향성; 촉매 기작의 절대 비가역성이라는 뜻이 아님 | 확인 |
| PFK-1은 committed step; 조절은 조직·동위효소·조건 의존 | 반응 03, 접힌 조절 심화 | [인간 PFK 동위효소 비교 연구][pfk], [Aerobic Glycolysis][aerobic] | 단일한 보편적 rate-limiting 주장 제외 | 확인 |
| PFK-1의 대표적인 ATP·citrate 억제, AMP·F-2,6-BP 활성화; HK/GK 차이, PK 조절 | 해당과정 조절 심화 | [PFK 조절][regulation], [Aerobic Glycolysis][aerobic] | 전체 조절 네트워크를 가르치는 화면은 아님 | 확인 |
| PDH 총반응은 pyruvate + CoA-SH + NAD⁺ → acetyl-CoA + CO₂ + NADH + H⁺ | `PyruvateOxidationMap` 반응식·×2 토글 | [Reactome PDH][pdh], [PDH 전체 수지][pdh-net] | 포도당 기준 모든 계수 ×2, ATP 직접 생성 없음 | 확인 |
| PDH는 결합된 다효소 반응이며 TPP·lipoamide·CoA·FAD·NAD⁺ 이용 | PDH 기본 교육적 분해 note 및 심화 E1/E2/E3 | [Reactome PDH][pdh], [PDH 효소 강의][pdh-mechanism] | 그림 3개는 기작의 독립 3단계나 실제 시간 순서가 아님; 채널링·세부 구조 생략 | 확인 |
| TCA 8반응과 8중간체, OAA 4C + acetyl 2C → citrate 6C | `TcaCycleMap` 원형 지도·모바일 세로 지도 | [Citric Acid Cycle][tca], [Reactome TCA][reactome-tca] | cis-aconitate, 보충·유출 경로 생략; acyl-CoA의 C는 CoA 자체를 제외한 acyl 탄소 | 확인 |
| NADH는 IDH·α-KGDH·MDH, CO₂는 IDH·α-KGDH에서 생성 | 반응 03·04·08과 NADH/CO₂ 필터 | [Citric Acid Cycle][tca] | NAD⁺ 의존 IDH3의 정방향 회로, TCA의 H⁺는 기본 지도에서 생략 | 확인 |
| Succinyl-CoA synthetase에서 GDP + Pi → GTP; ATP 상당량과 이중 합산 금지 | TCA 05·GTP 필터·심화 | [Reactome TCA][reactome-tca], [IUBMB NDP kinase][ndpk] | GDP형 표시, ADP형 동위효소와 NDP kinase는 설명만 | 확인 |
| SDH = ETC Complex II; 효소 결합 FAD에서 Q로 전자가 전달되어 QH₂ 생성 | TCA 06·FAD/Q 필터·Step 04 연결 | [SDH flavinylation 연구][sdh], [Complex II 표현의 정확성][sdh-nuance] | Fe-S 중심과 Q 결합부위 내부 기작 생략; 자유 FADH₂ 산물로 표현하지 않음 | 확인 |
| SDH는 내막에 결합, 활성 부위는 기질 측; H⁺ 펌프가 아님 | Complex II 위치 note·기존 Step 04 | [SDH flavinylation 연구][sdh], [Alberts proton pumps][pumps] | 막 연결을 badge와 설명으로 표시 | 확인 |
| 1 turn = 3 NADH, 1 FAD-linked 환원력/QH₂, 1 GTP, 2 CO₂; 두 회전은 각각 두 배 | TCA 기본 1 turn·2 turns 토글·산물 ledger | [Reactome TCA][reactome-tca], [Citric Acid Cycle][tca] | TCA만의 수지. 해당과정·PDH 산물을 중복 포함하지 않음 | 확인 |
| OAA는 회전마다 재생; 첫 회전 CO₂를 새 acetyl 두 탄소로 대응시키지 않음 | 회로 중앙·탄소 운명 note | [Citric Acid Cycle][tca], [MLSU TCA 강의의 탄소 추적][carbon-fate] | 총탄소 수지만 표시, 원자별 동위원소 추적 없음 | 확인 |

[gly]: https://www.ncbi.nlm.nih.gov/books/NBK482303/
[food]: https://www.ncbi.nlm.nih.gov/books/NBK26882/
[aerobic]: https://www.ncbi.nlm.nih.gov/books/NBK470170/
[pgk]: https://pubmed.ncbi.nlm.nih.gov/16274241/
[pfk]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7702303/
[regulation]: https://www.ncbi.nlm.nih.gov/books/NBK500351/
[pdh]: https://reactome.org/content/detail/R-HSA-9861559
[pdh-net]: https://reactome.org/content/detail/R-GGA-373177
[pdh-mechanism]: https://guweb2.gonzaga.edu/faculty/cronk/CHEM245pub/L26.html
[tca]: https://www.ncbi.nlm.nih.gov/books/NBK541072/
[reactome-tca]: https://reactome.org/content/detail/R-HSA-71403
[ndpk]: https://iubmb.qmul.ac.uk/enzyme/EC2/7/4/6.html
[sdh]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3504780/
[sdh-nuance]: https://pubmed.ncbi.nlm.nih.gov/38118236/
[pumps]: https://www.ncbi.nlm.nih.gov/books/NBK26904/
[carbon-fate]: https://mlsu.ac.in/econtents/2242_Unit%204%20TCA%20Cycle.pdf

### 구현 검증 및 남긴 단순화

- `src/respirationPathways.test.tsx` 13개 추가: 반응 순서, 연결, 분기와 탄소 보존, ATP 수지, 환원력·CO₂ 생성 위치, PDH 계수, TCA 배수와 기본값, 실제 렌더링된 설명을 검사한다. 기존 36개와 합쳐 49개 통과.
- `tests/respiration-expanded.spec.ts` 5개 추가: 네 viewport에서 모든 필터·반응 버튼·PDH 계수·TCA 회전 수·Complex II 연결, 키보드·focus·reduced-motion 확인. 기존 여정 검사 6개와 합쳐 11개 통과.
- 필터는 시각적 강조이며 계산 실험이나 효소 활성 조절 기능이 아니다. ledger의 배수는 물질 수지용이다.
- 화살표는 학습 순서와 정방향 탄소 흐름을 뜻한다. 모든 TCA 반응의 비가역성, 같은 속도, 자유에너지의 크기 또는 생리적 flux를 뜻하지 않는다.
- 물·H⁺·CoA의 전체 이온화 상태와 모든 출입을 TCA 기본 지도에 넣지 않았다. 해당과정의 GAPDH·enolase 및 PDH 총반응은 요청한 보조반응을 명시했다.
- 구조식·동위원소 추적·PDH 미세 기작·전체 조절·TCA 보충/유출·셔틀 비용과 총 ATP 환산은 이번 확장 범위 밖이다.
- 당시 검증: production build·`git diff --check` 통과, 네 viewport에서 상세 경로의 가로 넘침 없음. 단계별 스크린샷은 로컬 QA 자료로만 보존한다. 현재 최종 검증은 [디자인 QA](../verification/DESIGN_OPUS55_QA.md)에 있다.

## 2026-10-03 · Basic mode / Advanced mode 분리

이 절은 위 상세 경로 확장 이후의 현재 UI를 설명한다. 위에서 ‘기본 지도’라고 부른 기존 10반응·8반응 지도는 이제 **Advanced mode**에서 제공한다. 기존 과학 데이터, 수지 계산, 반응별 설명과 검증 근거는 유지했다.

| 항목 | Basic mode: 고등학생용 기본 화면 | Advanced mode: 생화학 기전 |
| --- | --- | --- |
| 해당과정 | 세포질, 포도당 1 → 피루브산 2; 인산기 부착 → 두 3탄당으로 분리 → 산화 → ATP 회수의 네 사건 | 기존 10반응, 중간체·효소 영어 이름, PFK-1 committed step, 조절 설명, 반응별 필터 |
| 해당과정 ATP | ATP 2 사용 / 4 생성 / 순 2, NADH 2; 기질수준 인산화 설명 | HK·PFK-1의 투자와 PGK·PK의 회수, 인산기 전달 그림과 ledger |
| 아세틸-CoA 생성 | 피루브산 3C → 아세틸-CoA 2C; CO₂ 방출·NADH 생성·CoA 결합을 한 상자 안에 묶음 | E1 Decarboxylation → E2 Acetyl transfer to CoA → E3 Cofactor reoxidation. 보조인자 TPP·lipoamide·CoA·FAD·NAD⁺ 표시 |
| TCA 탄소 | 아세틸기 2C + 수용체 4C → 6C → 5C → 4C; 4C 물질 재생 | 기존 OAA부터 OAA까지의 8반응과 효소, 첫 회전 CO₂의 탄소 기원 주의문 |
| TCA 환원력 | **FADH₂ 1개**, NADH 3개 / 회전 | **Succinate dehydrogenase-bound FAD → Q**: 효소 결합 FAD → 환원된 FAD → Q로 전자 전달 → QH₂. SDH = ETC Complex II, 비펌프·내막 위치 설명 |
| TCA 에너지 | **ATP 1개 상당 생성**. ‘일부 세포에서는 GTP 형태로 먼저 생성됩니다.’ | GDP형 SCS의 GTP 생성. ADP형 동위효소와 NDP kinase는 심화의 details에서만 설명 |
| TCA 수지 | 기본값 아세틸-CoA 1분자: CO₂ 2 / NADH 3 / FADH₂ 1 / ATP 1 상당. 포도당 1분자 선택: 각각 4 / 6 / 2 / 2 | 기존 1 turn / 2 turns의 FAD-linked reducing equivalent → QH₂ 및 GTP 수지 |

**고등학생 기본 화면에서는 교육적 단순화로 FADH₂라는 교과서식 표현을 사용하며, 실제 효소 결합 FAD와 Q로의 전자 전달은 심화 모드에서 설명한다.** 기본 화면에는 ‘FADH₂는 교과서식 요약’이라는 짧은 한국어 주석을 둔다. FADH₂를 자유롭게 이동하는 분자로 그리거나 QH₂와 별도 산물로 더하지 않는다. 기본 전체 요약 표도 같은 정책을 적용하며, `FAD-linked reducing equivalent`, `QH₂`, 동위효소 상세 설명은 기본 화면에 노출하지 않는다.

### 유지한 정확성과 단순화의 경계

- 해당과정 네 사건은 여러 실제 반응을 묶은 것이다. 두 3탄당으로 분리된 뒤 각각 진행된다는 점, 탄소 6개 보존, ATP 사용·생성·순수지와 NADH 수지를 유지한다. 기질수준 인산화를 화학삼투와 구분한다.
- PDH 기본 그림의 CO₂ 방출·NADH 생성·CoA 결합은 독립적인 세 반응의 시간 순서가 아니다. 하나의 복합체에서 연결된 변화임을 바로 명시했다. 심화는 E1/E2/E3 순서로 재배치했고, NADH가 E3의 보조인자 재생 과정 뒤쪽에서 만들어짐을 항상 보이게 했다. 이 순서를 [Reactome의 인간 PDH 경로](https://reactome.org/content/detail/R-HSA-9861559)와 다시 대조했다.
- TCA의 네 항목은 핵심 사건 묶음이다. NADH와 ATP가 각각 한 시점에 몰려 생성된다는 뜻이 아니다. 그림에는 1회전임을 명시하고, 수지 버튼은 아래 산물 수지만 1/2회전으로 전환한다. 분자당 탄소 수는 바뀌지 않는다. 수지는 해당과정·PDH를 제외한 TCA만의 산물이다.
- TCA ATP 상당량과 GTP를 이중 합산하지 않는다. FADH₂ 교과서 표기와 실제 SDH의 Q 환원은 같은 환원력의 서로 다른 설명 수준이다. [Reactome의 SDH 반응](https://reactome.org/content/detail/R-HSA-70994), [SDH와 결합된 FAD의 반응](https://www.reactome.org/content/detail/R-GGA-373147), 기존 SDH 연구 출처를 근거로 유지했다.
- Basic/Advanced는 표시 계층이다. 과학 계산 엔진, 광합성 경로, 총 ATP 수율의 가변성은 바꾸지 않았다.

### 전환·검증

- Step 01–03은 모두 기본 화면으로 시작한다. `+ 심화` / `− 기본으로`는 React state로 즉시 전환하며 단계별 선택을 독립적으로 유지한다. 다른 학습 페이지로 이동하거나 새로고침하면 기본값으로 돌아간다. localStorage에는 저장하지 않는다.
- `src/respirationLevels.test.tsx`의 기본 렌더링·전문 용어 비노출·수지·PDH 순서 5개 추가. 기존 science/content/pathway 검사 49개를 유지해 **54개 통과**.
- `tests/respiration-basic-advanced.spec.ts`의 4개 viewport 및 키보드·독립 상태 검사 5개 추가. 기존 학습 여정·심화 경로 11개를 유지해 **16개 통과**. 기존 심화 경로 검사는 `+ 심화`로 진입한 뒤 그대로 수행한다.
- 당시 production build·`git diff --check` 통과. 단계별 스크린샷은 로컬 QA 자료로만 보존한다. 현재 화면과 최종 검증은 [디자인 QA](../verification/DESIGN_OPUS55_QA.md)와 대표 스크린샷 `verification/screenshots/design-opus55/representative/`에 있다.

## 2026-10-03 · 전자 운반체 표기의 문맥 분리

- **발견:** `Membrane` 그림 설명(figcaption·`<desc>`)이 미토콘드리아와 엽록체 틸라코이드에 같은 문자열을 써서, 틸라코이드 그림(탐색기 00의 엽록체 문맥, 05)에도 `Q = ubiquinone, cyt c = cytochrome c`가 표시되었다. 틸라코이드 전자전달계에는 ubiquinone과 cytochrome c가 없다.
- **수정:** `compartments`에 문맥별 `carriers`를 두었다. 미토콘드리아 내막은 `Q = ubiquinone, cyt c = cytochrome c`, 틸라코이드 막은 `PQ = plastoquinone, PC = plastocyanin, Fd = ferredoxin`(그림에 `Fd → NADPH`가 있어 Fd도 함께 정의). 그림 속 노드·화살표 라벨(I–IV, Q, cyt c / PSII, PQ, cyt b₆f, PC, PSI, Fd)은 원래 문맥에 맞았으므로 바꾸지 않았다.
- **재발 방지:** `src/carrierLabels.test.tsx` 5개. 문맥별 매핑, 미토콘드리아 그림에 PQ·PC·plastoquinone·plastocyanin·ferredoxin 없음, 틸라코이드 그림·광합성 페이지(비순환·순환)에 ubiquinone·cytochrome c·cyt c 없음, 미토콘드리아 전용 3D 오버레이(`EtcDiagram`, `ConceptMembrane`)에 엽록체 운반체 없음. 이전 문자열로 되돌리면 틸라코이드 검사가 실패함을 확인했다.
