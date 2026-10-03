# Step 04 · 전자전달과 산화적 인산화 3D 개념 모형

검증일: 2026-10-03 (Asia/Seoul).

**3D 패널은 교육용 개념 모형이며, 기존 정상상태 계산의 상대값을 시각화한 것이다.** 구조생물학 모델, 분자 동역학, 실제 농도·반응 시간·ATP 생산량의 예측기가 아니다. 기존 `science.ts`, `relativeState`, 막대그래프 계산과 모듈 02–03 자유에너지 계산은 변경하지 않았다.

## 구성과 데이터 흐름

`Explorer`의 기존 조건 A/B → 각각 `relativeState(condition)` → `mapAnimationState` → `EtcPanel`의 Three.js 장면. 기존 `Results`도 같은 `relativeState`를 사용한다. 프리셋 이름별로 애니메이션을 재생하는 방식이 아니라, 슬라이더 조합까지 실제 계산값으로 매핑한다.

- `EtcComparison3D`: 범례, 움직임 일시정지, 정적 보기, 화면 크기·동작 줄이기 설정.
- `EtcPanel`: 개별 조건의 결과·텍스트 요약·WebGL 생명주기. A/B는 서로 독립적이다.
- `animationState`: 과학 계산과 분리한 출력 → 시각화 변환, 입력 중단의 표시 전환.
- `EtcScene`: 기본 geometry와 재질만 사용하는 Three.js/WebGL2 장면. 외부 3D 모델·텍스처 다운로드 없음.
- `sceneLayout`: 고정 카메라 투영, 복합체 좌표, 전자 경로. SVG와 WebGL이 공유한다.
- `EtcDiagram`: 텍스트 오버레이 및 정적 SVG 대체 개념도.

넓은 화면은 A/B 병렬, 비교 영역의 실제 폭이 720px 이하이면 세로 배치한다. 카메라는 `(0, 5, 12)`에서 원점을 보는 고정 사선 직교 투영이며, 두 패널이 같은 각도·척도를 사용한다. A는 기존 정상 조건, B는 기존 ATP 경로 억제 조건으로 시작한다. A와 B 모두 사용자가 바꿀 수 있다.

## 계산값과 시각 요소의 대응

모든 상대 출력의 정상값은 100이며, 애니메이션 속도 기준값은 1이다. 정상값을 패널별로 재정규화하지 않는다.

| 계산값 | AnimationState | 시각 표현 |
| --- | --- | --- |
| `oxygen / 100` | `electronFlowSpeed`, `protonPumpRate`, `oxygenRate` | 파란 전자 점의 진행과 빈도, I·III·IV의 위쪽 H⁺ 이동, IV 주변 O₂→H₂O 주기 |
| `gradient / 100` | `protonDensity` | 막사이공간 H⁺ 점의 수. 데스크톱 정상 기준 30개, 최대 60개로 제한 |
| `atp / 100` | `synthaseRotationSpeed`, `atpPulseRate` | ATP synthase 축·회전자 회전, 아래쪽 ATP 표식 주변의 짧은 생성 입자 빈도 |
| `condition.leak × steadyState(condition).gradient / steadyState(normal).oxygen` | `protonLeakRate` | 별도 통로의 위→아래 H⁺ 이동 |
| `condition.leak > normal.leak` | `leakActive` | 내막 오른쪽 누출 통로, 점선 귀환 화살표·누출 라벨 |
| `condition.adp < 0.5` | `adpLimited` | ADP 부족 설명. 실제 속도는 임곗값이 아니라 연속적인 계산 출력으로 결정 |
| `condition.synthase < 0.2` | `synthaseInhibited` | 합성 경로 억제 설명. 실제 회전은 연속적인 ATP 출력으로 결정 |

입자의 이동 방향과 상대 속도·발생 빈도, 숫자 및 텍스트를 함께 제공한다. 기본 누출 0.12는 계산에 계속 포함하지만, 기본 화면의 복잡도를 줄이기 위해 별도 누출 통로는 기본값보다 누출 전도도가 높을 때만 강조한다. 누출 전도도가 높아도 입력 중단 후 기울기가 0이면 누출 입자도 멈춘다.

ATP 생성 입자는 속도가 낮다고 오래 정지해 떠 있지 않는다. 짧게 보이는 표식이 드물게 생기도록 가시 시간을 조절한다. 구획에 그린 H⁺ 개수는 실제 농도비가 아니며, 전기화학적 기울기는 농도 차이와 전위 차이를 포함한다. 각 펌프의 정확한 H⁺ 화학량론, NADH/FAD 입력 분율과 분자별 전자 수는 표현하지 않는다.

## 각 프리셋의 결과와 움직임

| 조건 | 산소 소비 | H⁺ 기울기 | ATP 합성 | 장면의 핵심 변화 |
| --- | ---: | ---: | ---: | --- |
| 정상 | 100.0 | 100.0 | 100.0 | 전자전달·펌핑·회전·ATP 생성이 연결됨 |
| ATP 합성 경로 억제 | 26.8 | 163.7 | 4.9 | H⁺ 축적 증가, 회전·ATP 생성 거의 정지, 전자전달·산소 소비 감소 |
| H⁺ 누출 증가 | 142.1 | 63.4 | 63.4 | 펌핑·전자전달 증가, 별도 통로로 귀환, 낮은 기울기와 ATP 생성 |
| 전자전달 입력 감소 | 41.7 | 41.7 | 41.7 | 전체 흐름과 축적 감소 |
| 전자전달 입력 중단 | 0.0 | 0.0 | 0.0 | 새 전자·펌핑 즉시 정지, 표시된 저장 기울기 소실 후 회전·ATP 생성 정지 |
| ADP 가용성 감소 | 40.5 | 151.7 | 22.8 | 기울기는 증가하나 회전·ATP 생성·산소 소비 감소, ADP 부족 설명 |

기존 계산은 경로 억제 조건의 산소 소비를 정상의 약 27%로 계산한다. 따라서 요청의 정성적 예시인 ‘약간 감소’ 대신 **기존 모형의 실제 출력과 같은 비율**로 시각화한다.

## 입력 중단 전환의 제한

정상상태 계산은 입력 중단을 기울기가 소진된 장기 상태로 처리한다. 장면에서는 사용자가 보고 있던 기울기·회전·ATP 표식·누출을 2.4초 동안 `(1 − elapsed / 2.4)²`로 감소시켜 최종 0에 맞춘다. 새 전자 공급과 펌핑은 바로 0이다.

이 전환은 **이해를 돕는 화면 보간이며, 생리적 반응 시간이나 동역학 계산이 아니다.** 전환 동안 ‘기울기 소실 전환 중 · 아래 수치는 소진 후 정상상태’라는 안내가 나온다. 그래프·접근성 요약은 항상 계산된 최종 정상상태 값이다. 초기 진입부터 입력이 0이거나, 정적 보기·일시정지·동작 줄이기·화면 밖에서 조건을 바꾸면 잔여 저장량을 새로 만들어내지 않고 최종 상태를 표시한다. 화면을 벗어나거나 탭을 숨기면 장면 시간도 정지한다.

## 과학적 검증

- I·III·IV만 H⁺를 기질 → 막사이공간으로 펌핑한다. `complexes.filter(c => c.pump)`를 실제 펌핑 도형·경로 생성에 사용하며 II를 제외하는 테스트가 있다.
- II는 전자 전달 경로에 참여하지만 H⁺ 펌프가 아니다. FADH₂는 교과서식 표기로, 실제로는 효소 결합 FAD에서 Q로 전달되는 환원력을 뜻한다. 자유 FADH₂ 분자가 II로 떠다니는 모습은 그리지 않는다.
- I와 II에서 들어오는 전자가 Q에서 합류하고 III → cyt c → IV → O₂ 방향으로 흐른다. ATP synthase로 전자가 전달되는 경로는 없다.
- ATP synthase의 H⁺ 귀환은 막사이공간 → 기질이며, 회전자와 ATP 생성 부위는 기질 쪽에 있다.
- 산소는 IV 주변에서 최종 전자수용체로 표현한다. O₂→H₂O는 전자·H⁺ 전체 화학량론을 생략한 요약이다.
- ADP 제한·ATP 경로 억제·누출·입력 감소의 방향성은 기존 정상상태 식과 단위 테스트를 유지한다. 모든 생리 조건에 적용되는 보편적 비율로 주장하지 않는다.
- ATP는 산화적 ATP 합성만 뜻한다. 기질수준 인산화, ATP 가수분해 방향의 역회전, 수송 비용, 산소 고갈·막 손상은 생략한다.

대조 근거: [Reactome, Respiratory electron transport](https://www.reactome.org/content/detail/611105), [Reactome, Formation of ATP by chemiosmotic coupling](https://reactome.org/content/detail/R-HSA-163210), 기존 `SCIENCE_VALIDATION.md`의 I·III·IV / II 구분 근거. Reactome의 전체 ATP 환산값이나 오래된 고정 수율은 이 화면에 채택하지 않았다.

## 성능·접근성·실패 처리

- Step 04 진입 시에만 Three.js 장면을 동적으로 가져온다. 회전 도형은 기본 geometry이며 외부 대형 asset은 없다.
- 모바일: 입자 예산 55%, DPR 최대 1, 약 15fps. 데스크톱: DPR 최대 1.5, 약 30fps. 화면 밖과 숨겨진 탭은 렌더링 중지.
- `prefers-reduced-motion: reduce`: 이동·회전 20%, 약 15fps, 기울기와 수치 출력 유지. 전체 일시정지와 정적 보기 버튼 제공.
- 느린 프레임(130ms 초과)이 지속되면 입자 예산을 추가로 절반으로 줄이고 DPR 1로 낮춘다. 계속되면 정적 SVG로 전환한다. 실기기 성능의 보증치가 아닌 간단한 완화 정책이다.
- WebGL2 초기화 실패, 동적 import/첫 render 실패, 실행 중 context loss는 해당 패널만 정적 SVG로 전환. 다른 패널과 제어·그래프·다른 모듈은 유지한다.
- unmount 때 프레임·관찰자·이벤트를 해제하고 geometry·material·instanced mesh·renderer·WebGL context를 정리한다. 구현 참고: [Three.js renderer](https://threejs.org/docs/pages/WebGLRenderer.html), [자원 해제](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).
- 각 패널에 이름과 구획·방향 설명, 색 외의 라벨·화살표, 현재 상태 설명, `aria-live="polite"` 수치 요약을 둔다. 애니메이션 프레임마다 스크린리더 안내를 갱신하지 않는다.

당시 검증: Vitest 69개(신규 15), Playwright 23개(신규 7) 통과. 6개 프리셋, A/B 독립 조작, 24개 viewport·조건 조합의 수치–시각화 일치, context loss·WebGL 불가 대체, reduced motion, 네 viewport의 가로 넘침 없음을 확인했다. 스크린샷은 로컬 QA 자료로만 보존한다. 현재 화면(조건 선택 → 3D → 슬라이더 열 구성)의 최종 검증은 [디자인 QA](../verification/DESIGN_OPUS55_QA.md)에 있다.
