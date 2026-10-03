# Design QA · Opus 5.5 (2026-10-03)

디자인·UX·정보 위계 작업의 검증 기록입니다. 진단과 설계 판단은 `docs/DESIGN_AUDIT_OPUS55.md`에 있습니다.

- 디자인 작업 시작 시점 HEAD `0c8bcea`, origin/main `ab32e74` (로컬 기록: `verification/design-opus55-baseline-status.txt`).
- 디자인 승인 후 정리: 외부 백업 → `git fetch` → `git reset --mixed origin/main`(작업 트리 무변경 확인) → PQ/PC 표기 수정 → 선택 stage → 브랜치 `claude/design-opus55-final`에 커밋. **push·배포하지 않았습니다.** 7절 참고.

## 1. 수정 파일

### 이번 작업에서 수정한 tracked 파일 (0c8bcea 기준 분류)

| 파일 | 내용 |
|---|---|
| `src/index.css` | 색·선 토큰(`--accent`, `--line` …), 흰 배경, 본문 16px, 서체 스택(Pretendard → 맑은 고딕) |
| `src/App.css` | 전체 재작성: 머리말·탭·홈 번호 목록·그림 패널·통일된 탭·표(≤900px 라벨/값 목록)·퀴즈·버튼·푸터·태블릿 그림 맞춤 |
| `src/App.tsx` | breadcrumb 머리말, `← 메인 포털`, 홈 01→02→03 구조, 한국어 라벨, 푸터 문구 |
| `src/Respiration.tsx` | `+ 심화` 옆 목적 문구(`aria-describedby`), pill → 캡션, 표 `data-label`, 개요 그림의 04 노드 폭·H⁺ 화살표 x 좌표 |
| `src/Photosynthesis.tsx` | 한국어 위치 라벨, 공통 원리 블록을 확인 문제 앞으로, 표 `data-label`, Calvin 라벨·CO₂ 화살표 좌표 |
| `src/Explorer.tsx` | 가로 스텝퍼용 구조, 단계 전환 시 위치 이동, 00 그림+옆 열, 03 열 구성(선택 → 3D → 슬라이더), 04 사례 그리드, eyebrow 문구 |
| `src/components/Shared.tsx` | 그림 아래 모바일 스크롤 안내, 퀴즈·공통 원리 eyebrow 한국어화 |
| `src/components/Membrane.tsx` | 흩어진 H⁺ 기호 행의 y 좌표(화살표 라벨과 겹침 해소) |

### 이번 작업에서 수정한 기존 미커밋 파일 (0c8bcea 기준 untracked)

이전 세션에서 만들어진 파일이며, 이번 작업에서 아래 부분만 바꿨습니다. explorer·step04 파일은 `ab32e74`에 이미 들어 있으므로, 정렬 후에는 이 표의 변경만 diff로 남습니다.

| 파일 | 내용 |
|---|---|
| `src/components/RespirationPathways.css` | 심화 토글·목적 문구, 카드 선·글자 크기, 수지 왼쪽 정렬(모바일 2열), ‘전체’ 필터의 강조 상자 제거 |
| `src/components/GlycolysisMap.tsx`, `src/components/TcaCycleMap.tsx` | 루트에 `data-filter={filter}` 속성 1개 추가(CSS 전용) |
| `src/components/explorer/EarlyExplorer.css` | 전체 재작성: 스텝퍼, 00/01/02 나란히 배치, 3D 오버레이 글자 크기(좁은 화면 확대) |
| `src/components/explorer/EnergyLessons.tsx` | 01·02의 래퍼 div 추가(`gradient-stage`, `coupling-stage` 등). 계산·문구·상태 변경 없음 |
| `src/components/explorer/ConceptMembrane.tsx` | 3D 머리말에서 질문과 중복된 문장 1개 삭제 |
| `src/components/step04/EtcComparison3D.tsx` | 선택적 `controls` prop(열마다 위·아래 슬롯), `MEMBRANE IN MOTION` 삭제. 3D·상태 로직 변경 없음 |
| `src/components/step04/EtcComparison3D.css` | 전체 재작성: 열 레이아웃, 패널 글자 12px 이상, 좁은 패널 라벨 확대 |
| `src/components/step04/EtcDiagram.tsx` | `Complex ` 접두어를 `<tspan>`으로 분리(좁은 패널에서 CSS로 숨김) |
| `src/explorerEarly.test.tsx` | `'INVESTIGATION / 0'` → `'단계 00 / 05'` (1줄) |
| `tests/explorer-early-redesign.spec.ts` | `` `INVESTIGATION / 0${step}` `` → `` `단계 0${step} / 05` `` (1줄) |

테스트 변경은 위 두 줄뿐이며, 둘 다 장식용 영문 eyebrow 문구를 바꾼 데 따른 기대값 수정입니다. 기능·과학 검증 단언은 바꾸지 않았습니다.

### 새로 만든 파일

- `docs/DESIGN_AUDIT_OPUS55.md`, `verification/DESIGN_OPUS55_QA.md`
- `src/carrierLabels.test.tsx` — 전자 운반체 표기 문맥 검사(6절)
- `verification/screenshots/design-opus55/representative/` — 대표 13장(저장소 포함용, 4절)
- 로컬 전용(커밋 제외): `verification/design-opus55-capture.mjs`(캡처 스크립트), `verification/design-opus55-{baseline,final}-status.txt`, `verification/screenshots/design-opus55/{before,after,public-before}/`(368장 + 공개 사이트 28장), `.claude/launch.json`(개발 서버 포트 5180)
- `.cache/pw-design.config.ts` — gitignore 대상. 아래 3절 참고

### 바꾸지 않은 것

`science.ts`, `content.ts`, `respirationPathways.ts`, `animationState.ts`, `EtcScene.ts`, `EtcPanel.tsx`, `progress.ts`, `pageViews.ts`, `vite.config.ts`, `.github/`, `package.json`.

## 2. 브라우저 확인

| 방법 | 내용 |
|---|---|
| 내장 브라우저(Claude 앱, 1280×720) | 공개 포털·공개 앱·로컬 앱 열람. 로컬에서 Step 03 조건 B를 `H⁺ 누출 증가`로 변경, B 누출 슬라이더를 키보드 End로 이동, Step 01 슬라이더와 그림 위치 측정, ‘다음 단계 →’ 착지 위치 측정 |
| Chrome(Playwright) 학습 동선 | 로컬 전용 캡처 스크립트 `verification/design-opus55-capture.mjs --deep`: 홈 → 세포호흡 4단계 × 기본/심화 → 광합성 비순환/순환/Calvin/퀴즈 응답 → 탐색기 00–05, 02 심화, 03 프리셋 6종 전부. 4개 viewport |
| WebGL 차단 | 00 개념 모형·03 A/B 정적 개념도가 새 글자 크기로 정상 표시(1440, 390) |
| 형제 자료 | 포털, 탄수화물·지질·단백질 3D, 효소 탐색기를 1440에서 캡처해 시각 언어 비교 |

### 측정값 (같은 측정 스크립트, 공개 사이트 = 수정 전 Step 03 구성과 동일)

| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| B 누출 슬라이더에 막 도달했을 때 B 3D 장면이 보이는 높이 | 1440: 233/281px · 1280×720: 53/281px · 1024: **0** · 768: **0** · 390: **0** | 1440: 375/375 · 1280×720: 335/375 · 1024: 314/314 · 768: 475/475 · 390: 236/236 |
| 1280×720에서 B 슬라이더 조작 중 B 패널 상단 | −635px (내장 브라우저 직접 측정) | B 장면 일부 화면 안(중앙 정렬 스크롤 기준 −430px, 장면 하단은 화면 안) |
| 조건 B 선택 상자 ↔ B 패널 거리 | 767px 아래 | 10px 위 |
| ‘다음 단계 →’ 직후 새 단계 제목 위치 | −1087px | 93px(1440) · 113px(1024) · 103px(390) |
| 탐색기 00 3D 시작 y (1440×900) | ≈750 | 498 |
| Step 03 패널 폭 | 1440 ≈430 · 1024 ≈240 | 1440 568 · 1024 476 |
| 가로 넘침이 있는 캡처 | 0 | 0 (184장) |

## 3. 테스트

| 종류 | 명령 | 결과 |
|---|---|---|
| 단위·과학 | `npm test` | **81/81 통과** (7 files; 디자인 직후 76/76 + 운반체 표기 5개) |
| 브라우저 | `npm run test:e2e` (원래 설정 그대로) | **34/34 통과** (정렬·표기 수정 후 최종 빌드, 1.3분) |
| 타입 | `npx tsc -b` (빌드에 포함) | 통과 |
| Lint | `npm run lint` | 오류 0, 경고 1 — `Membrane.tsx`의 `compartments` export(기존 경고, 주석 추가로 줄 번호만 2→3) |
| 공백 | `git diff --cached --check` | 문제 없음(7절) |
| 빌드 | `npm run build` | 성공. three.js 청크 크기 경고는 기존과 동일(의존성·import 변경 없음) |

브라우저 테스트가 확인한 항목: 기본/심화 전환(단계별 독립·키보드), 세포호흡 반응 지도·필터·반응 설명, 광합성 비순환/순환/Calvin, 탐색기 6단계 이동·이전/다음, 3D 렌더링·회전, 일시정지/재개, A/B 독립 조건과 프리셋 6종, 슬라이더 조합, 입력 중단 전환, WebGL context loss·미지원 fallback, 정적 보기, reduced motion, 저장 차단, 해시 새로고침·뒤로 가기·skip link, 조회수 모듈 실패 격리, 4개 viewport 가로 넘침 없음.

첫 실행에서 1건 실패: 상단 탭 링크를 `display:flex`로 바꾸자 접근 가능한 이름이 `03화학삼투 탐색기` → `03 화학삼투 탐색기`로 바뀌어 `learning.spec.ts`의 링크 탐색이 실패. 레이아웃을 inline으로 되돌려 이름을 보존한 뒤 재실행해 통과.

**기존 QA 스크린샷 보존:** 디자인 작업 중에는 각 spec은 `verification/screenshots/<이전 작업 폴더>/`에 스크린샷을 덮어씁니다. 이전 세션의 QA 근거를 지우지 않도록, 같은 설정에 출력 위치만 바꾼 `.cache/pw-design.config.ts`로 실행해 spec 스크린샷은 세션 임시 폴더에 쓰게 했습니다. 기존 `verification/screenshots/*` 파일은 수정되지 않았습니다. 승인 후 최종 검증은 `npm run test:e2e`를 원래 설정 그대로 실행했고, 실행 직전 `verification/`(1082개 파일)을 복사해 두었다가 실행 후 되돌려 SHA-1 기준으로 완전히 같음을 확인했습니다.

## 4. Before / After 스크린샷

위치: `verification/screenshots/design-opus55/`

- `before/` — 수정 전 로컬, `after/` — 수정 후 로컬. 같은 스크립트·같은 동작·같은 viewport.
- `public-before/` — 공개 사이트(1440, 390) 참고용.
- 파일 이름: `<viewport>-<화면>.png`(첫 화면) / `<viewport>-<화면>-full.png`(전체 페이지).

| 화면 | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| home | ✓ | ✓ | ✓ | ✓ |
| respiration (+ `resp-1…4-basic`, `resp-1…3-advanced`) | ✓ | ✓ | ✓ | ✓ |
| photosynthesis (+ `photo-cyclic`, `photo-calvin`, `photo-quiz`) | ✓ | ✓ | ✓ | ✓ |
| explorer-00 … explorer-05, `explorer-02-advanced` | ✓ | ✓ | ✓ | ✓ |
| `explorer-03-B-<preset>` (normal, inhibited, leak, reduced, stopped, adp) | ✓ | ✓ | ✓ | ✓ |

대표 13장(`representative/`, 저장소 포함): `before-/after-1440-home`, `before-/after-1440-resp-1-basic`, `before-/after-1440-explorer-00`, `before-/after-1440-explorer-03-B-leak`, `before-/after-390-explorer-03-B-leak`, `after-390-home`, `after-390-photo-cyclic`, `after-1440-explorer-00-thylakoid-pq-pc`(PQ/PC 표기 확인).

요청된 최소 목록(1440: home/respiration/photosynthesis/explorer 00–03, 1024: home/respiration/explorer 03, 768: respiration/explorer 00/explorer 03, 390: home/respiration/photosynthesis/explorer 00–03)을 모두 포함합니다.

## 5. 알려진 문제

1. 390px 개요 그림은 좌우 스크롤이 필요(안내 문구 표시). 모바일 전용 그림은 별도 작업 필요.
2. 768px에서 Step 03 B 열은 A 열 아래(테스트 계약 유지). B 조작 시 B 장면은 화면 안에 있음.
3. 3D 장면 자체(카메라·입자 크기)는 변경하지 않음.
4. 심화 반응 지도는 정보 밀도가 높음.
5. ~~틸라코이드 확대도 설명의 `Q = ubiquinone, cyt c = cytochrome c`~~ → 수정 완료: 문맥별 PQ/PC/Fd 표기, `src/carrierLabels.test.tsx`로 검증(아래 6절).
6. Pretendard 미설치 PC에서는 맑은 고딕으로 표시(형제 자료와 동일한 방식).

## 6. 과학 표기 수정 (디자인 승인 후)

- 문제: `Membrane`의 그림 설명이 두 막에 같은 문자열을 써서 틸라코이드 그림(탐색기 00 엽록체 문맥, 05)에도 `Q = ubiquinone, cyt c = cytochrome c`가 표시됨.
- 수정: `compartments.{mito,plant}.carriers` — 미토콘드리아 `Q = ubiquinone, cyt c = cytochrome c`, 틸라코이드 `PQ = plastoquinone, PC = plastocyanin, Fd = ferredoxin`. 그림 노드·화살표 라벨은 원래 문맥에 맞았으므로 변경 없음.
- 검증: `src/carrierLabels.test.tsx` 5개(문맥별 매핑, 두 막 그림, 광합성 페이지·비순환·순환, 미토콘드리아 전용 3D 오버레이). 옛 문자열로 되돌리면 실패함을 확인. 내장 브라우저에서 탐색기 00(엽록체)·05의 캡션이 PQ/PC/Fd, 세포호흡 04의 캡션이 Q/cyt c로 표시되고 페이지에 ubiquinone이 없음을 확인. 기록: `docs/SCIENCE_VALIDATION.md` ‘전자 운반체 표기의 문맥 분리’.

## 7. Git 정리와 커밋 범위

- 외부 백업: 저장소 바깥의 로컬 폴더 (작업 트리 전체 + `.git`, node_modules·dist 제외; 2549개 파일 SHA-1 일치 확인, git status/diff/untracked/HEAD 기록 포함).
- `git reset --mixed origin/main` 후 HEAD = `ab32e74`, 작업 트리 2549개 파일 SHA-1 변화 없음.
- origin에만 있고 로컬에 checkout된 적 없던 `verification/EXPLORER_ENERGY_POLISH_PUSH.md`를 `git checkout --`으로 복원해 삭제가 stage되지 않게 함.
- 커밋: 브랜치 `claude/design-opus55-final`, 부모 `ab32e74`. **push하지 않음.**
- 커밋에 남긴 검증 문서: 이 보고서, `docs/DESIGN_AUDIT_OPUS55.md`, `docs/SCIENCE_VALIDATION.md`, 대표 스크린샷 13장. 설계·모형 문서 `docs/EXPLORER_EARLY_REDESIGN.md`, `docs/STEP04_3D_MODEL.md`도 유지.
- 커밋하지 않은 로컬 QA 자료: 이전 개발 단계 QA 보고서 5개(`EXPLORER_EARLY_REDESIGN_QA`, `EXPLORER_ENERGY_POLISH_QA`, `RESPIRATION_BASIC_ADVANCED_QA`, `RESPIRATION_EXPANDED_QA`, `STEP04_3D_QA`), 대량 스크린샷, 상태·해시 파일, 캡처 스크립트, `.claude/`. 이전 보고서의 핵심 검사 결과는 위 문서들에 짧게 옮겨 링크가 끊기지 않게 했다.
