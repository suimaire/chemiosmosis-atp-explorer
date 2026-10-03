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

공식 GitHub 로그인 및 Pages 배포 후 공개 origin에서 동일 시나리오를 실행하고 여기에 결과를 추가한다. 현재 기록은 로컬 production build에 대한 검증이다.
