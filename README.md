# Chemiosmosis & ATP Synthase Explorer

HAFS Basic Biochemistry 학생을 위한 세포호흡·광합성 사전학습과 화학삼투 탐색기. 제작자: CH Park.

- 공개 주소: https://suimaire.github.io/chemiosmosis-atp-explorer/
- 저장소: https://github.com/suimaire/chemiosmosis-atp-explorer
- 로컬 위치: `D:\Codex\chemiosmosis-atp-explorer`

## 학습 흐름

`#/` 사전학습 허브 → `#/respiration` 탄소·전자 흐름 → `#/photosynthesis` 명반응·탄소 고정 → `#/explorer` 막 구획, H⁺ 에너지, ATP 결합, A/B 실험, 가상 자료 해석.

사전학습은 강제하지 않습니다. 세포호흡 네 단계와 광합성 세 탭을 선택하면 해당 overview의 강조도 함께 바뀝니다. 세포호흡·광합성 각각 3문항과 탐색기의 자료 해석·전이 문제에서 즉시 피드백을 제공합니다.

## 환경과 실행

Node.js 24 LTS, npm 11에서 검증했습니다. React 19, TypeScript 6, Vite 8, Vitest 5, Playwright를 사용합니다. 외부 UI 프레임워크·Three.js·런타임 서버는 필요하지 않습니다.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

개발 서버의 기본 경로는 `/chemiosmosis-atp-explorer/`입니다. 포트가 이미 사용 중이면 `npm run dev -- --port 5186`처럼 지정합니다. 재현 가능한 설치에는 `npm ci`를 사용합니다.

## 브라우저 테스트

```sh
npm run build
npm run test:e2e
```

로컬 Windows에서는 설치된 Google Chrome을 사용합니다. CI에서는 `npx playwright install --with-deps chromium` 후 `CI=true`로 실행합니다. 테스트가 운영 빌드용 preview 서버를 42863 포트에 띄웁니다.

공개 배포 점검 (PowerShell):

```powershell
$env:BASE_URL = 'https://suimaire.github.io/chemiosmosis-atp-explorer/'
npm run test:e2e
Remove-Item Env:BASE_URL
```

4개 viewport: 1440×900, 1024×768, 768×1024, 390×844. 전체 학습 동선, 단계·모듈 전환, 퀴즈, 상태 저장, 키보드 입력, hash 새로고침·history, reduced motion, 저장소 차단, 조회수 모듈 실패를 검사합니다. 스크린샷은 `verification/screenshots/`, 검증 요약은 `verification/QA_REPORT.md`에 있습니다.

## 프로젝트 구조

| 위치 | 역할 |
| --- | --- |
| `src/App.tsx` | 공통 헤더, hash 화면 전환, 사전학습 허브, 출처 |
| `src/Respiration.tsx` | 해당과정, 아세틸-CoA 생성, TCA, ETC |
| `src/Photosynthesis.tsx` | linear/cyclic 전자 흐름, Calvin cycle |
| `src/Explorer.tsx` | 00–05 모듈, 에너지 조절, 조건 A/B, 추론 |
| `src/components/` | SVG 경로·막·구획, 퀴즈, 비교 패널 |
| `src/science.ts` | 순수 계산 함수와 정상상태 모형 |
| `src/content.ts` | 검증된 학습 데이터와 출처 |
| `src/progress.ts` | 브라우저 학습 상태 네 항목 |
| `src/pageViews.ts` | 포털 공통 조회수 API 연동과 실패 격리 |
| `src/*.test.*`, `tests/` | 계산·내용·브라우저 검사 |
| `docs/SCIENCE_VALIDATION.md` | claim별 과학 근거와 한계 |
| `.github/workflows/deploy.yml` | 검사·빌드 후 GitHub Pages 배포 |

## 과학적 범위와 한계

진핵세포의 포도당 산화와 산소발생 광합성의 핵심 기능 관계를 다룹니다. 모든 그림은 축척·분자 구조·상세 효소 반응을 생략한 교육적 단순화입니다.

H⁺ 이동 에너지는 A→B에 대해 `ln(10) RT (pH_A − pH_B) + F(ψ_B − ψ_A)`를 계산합니다. 온도는 K, 전위는 V로 변환하고 kJ/mol H⁺로 표시합니다. ATP 합성의 열역학적 유리함은 실제 속도와 구분합니다. 결합비·ATP 요구 에너지는 조절 가능한 예시이며 보편 상수가 아닙니다.

막 실험은 전자전달과 기울기의 피드백을 보여 주는 독립적인 정상상태 모형입니다. 모듈 01·02의 에너지로부터 실제 속도를 예측하지 않습니다. 각 출력은 정상=100 relative units입니다. 산소 부족, 손상, 활성산소, 효소 포화, 구획 완충, 시간 변화, ATP 가수분해 역회전은 포함하지 않습니다. 입력 차단 시 잔류 기울기가 소진된 뒤의 상태를 표시합니다.

## 저장과 외부 연결

앱이 localStorage에 저장하는 것은 `respirationViewed`, `photosynthesisViewed`, `respirationQuizCompleted`, `photosynthesisQuizCompleted`의 네 boolean뿐입니다. 학습 확인 버튼과 세 문항 정답 확인으로 갱신합니다. 개인정보를 입력받지 않으며 저장소를 차단해도 학습은 가능합니다. A/B 값은 현재 화면 세션에서만 유지됩니다.

포털의 실제 `page-views.js` 공개 API (`resolveMode`, `normalizePageKey`, `loadCounts`, `renderCounts`)를 사용합니다. 중복 집계 상태는 sessionStorage에 두고, 자동 초기화를 끄므로 네 학습 상태 외에 localStorage 키를 추가하지 않습니다. 개발 환경은 집계하지 않습니다. 외부 모듈이나 집계 서버가 실패해도 앱은 계속 동작합니다.

## 배포

Vite base는 `/chemiosmosis-atp-explorer/`입니다. GitHub 저장소의 Pages source를 GitHub Actions로 설정한 뒤 `main`을 push합니다. 워크플로는 `npm ci → npm test → npm run build → Chromium E2E → Pages artifact → deploy`를 실행합니다. hash 기반 화면이므로 Pages에서 새로고침에 서버 라우팅 설정이 필요 없습니다.

공개 주소에서 자산·라우트·브라우저 테스트를 확인한 다음에만 `suimaire/suimaire.github.io`의 `_data/molecular_explorers.yml`에 링크를 추가합니다. 포털의 미커밋 작업은 수정·stash·reset하지 않습니다. 운영 절차와 최종 상태는 `docs/DEPLOYMENT.md`에 기록합니다.
