# 브라우저·계산 검증 기록

2026-10-03, Windows / Node 24.20.0 / npm 11.19.0 / installed Google Chrome (Playwright channel `chrome`).

## 결과

| 검증 | 결과 |
| --- | --- |
| Vitest 계산 검사 | 24개 통과 |
| Vitest 과학 콘텐츠·SVG 렌더 검사 | 12개 통과 |
| TypeScript + Vite production build | 통과 |
| 1440×900 전체 학습 동선 | 통과 |
| 1024×768 전체 학습 동선 | 통과 |
| 768×1024 전체 학습 동선 | 통과 |
| 390×844 전체 학습 동선 | 통과 |
| 새로고침·history·skip link·키보드·reduced motion·저장 차단 | 통과 |
| production origin에서 조회수 모듈 import 차단 | 앱 정상, uncaught error 없음 |

브라우저 시나리오는 총 6개. 각 viewport에서 홈, 세포호흡 overview, 네 단계 전환, Complex II 표시, 양쪽 퀴즈·완료 저장, 광합성 linear/cyclic/Calvin 전환, 탐색기 00–06, 막 문맥 전환, 전자 경로 토글, pH 키보드 조절, 에너지 방향, ATP 결합, A/B 누출·입력 중단, 가상 자료 답변을 검사했다.

전체 페이지 가로 넘침: 네 viewport 모두 없음. 넓은 SVG·표는 내부 영역만 좌우 스크롤한다. 일반 동선의 console error·pageerror: 0. 의도적인 외부 스크립트 차단 시에는 브라우저 네트워크 실패 로그가 생길 수 있으나 uncaught exception 없이 정상 기능을 유지한다.

## 시각 점검

`screenshots/`에 4개 viewport × 8개 장면 = 32장 저장. 각 파일명은 viewport 폭과 장면을 표시한다. 홈, 호흡 overview, ETC, linear, cyclic, Calvin, 에너지, A/B 실험 장면. 교육적 흐름·구획·텍스트·화살표를 점검하고 ETC의 Q 경로와 막 위치, 광합성 NADPH 라벨을 보정했다.

스크린샷은 실제 운영 빌드를 실행한 브라우저에서 생성했다. 접근성 자동 검사는 키보드와 의미 있는 레이블에 한하며, 모든 스크린리더 조합의 인증을 의미하지 않는다. `prefers-reduced-motion`은 모든 animation/transition을 끈다.

## 공개 배포 검증

공개 URL https://suimaire.github.io/chemiosmosis-atp-explorer/ 에서 동일한 6개 시나리오 전부 통과 (4 viewport 학습 동선 + history/저장 차단 + 조회수 모듈 실패 격리). HTML HTTP 200과 자산 로딩을 확인했다. 일반 동선의 console error·pageerror는 0개다.

공개 origin에서도 localStorage에는 요청한 학습 boolean 네 항목만 남았다. 조회수 모듈의 sessionStorage 중복 방지값이 학습 상태와 분리됨을 확인했다. 초기 Pages workflow에서도 Linux Chromium의 6개 시나리오가 통과했다.

`screenshots/live-*` 32장을 추가해 앱 스크린샷은 로컬 32장 + 공개 32장 = 64장이다.

## 포털 통합 검증

- 앱 공개 배포·브라우저 확인 완료 후에만 포털에 새 항목 추가.
- 원본 네 항목 및 순서 보존, 다섯 번째 항목은 자동 번호 1.2.5.
- 변경 파일은 `_data/molecular_explorers.yml` 한 개, 11줄 추가.
- 기존 포털 단위 검사 93/93 통과.
- 설치되어 있던 Ruby 3.3.12와 실제 Jekyll 3.10.0 `Site#process`로 원격 테마를 포함한 16페이지 빌드 성공. 선택적 개발 서버의 native dependency는 사용하지 않았고 Jekyll·테마 소스를 수정하지 않았다.
- 로컬 빌드와 공개 포털 각각 1440×900, 390×900에서 기존 항목·번호·링크·가로 넘침 검사 통과.
- 공개 포털의 새 링크를 클릭해 공개 앱의 첫 화면이 열리는 것을 두 viewport에서 확인. pageerror 0.
- 증거: `screenshots/portal-live-1440.png`, `screenshots/portal-live-390.png`.
- 앱과 포털의 workflow·commit은 `docs/DEPLOYMENT.md`에 기록.
