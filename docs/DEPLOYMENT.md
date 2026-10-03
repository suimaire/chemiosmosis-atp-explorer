# 배포 절차와 상태

목표 저장소: `suimaire/chemiosmosis-atp-explorer` (public)

목표 공개 주소: https://suimaire.github.io/chemiosmosis-atp-explorer/

## 확인 순서

1. `npm test`, `npm run build`, `npm run test:e2e` 통과.
2. GitHub CLI에서 인증 계정 확인. 목표 저장소가 이미 존재하면 내용·branch 상태를 먼저 확인.
3. 새 저장소 생성 후 main push. 기존 저장소라면 강제 push하지 않고 호환성 조사.
4. Pages build type을 GitHub Actions (`workflow`)로 설정.
5. `Verify and deploy Pages` workflow와 Pages deployment가 성공했는지 확인.
6. 공개 주소에서 HTTP·자산·hash route·새로고침·브라우저 전체 동선 검사.
7. 그 뒤에만 포털 `_data/molecular_explorers.yml`에 항목을 추가. 기존 네 항목 보존.
8. 포털의 로컬 검사와 GitHub Pages 배포를 확인하고 공개 포털 링크를 점검.

## 인증

GitHub CLI 설치 완료: 2.102.0. `gh auth login --hostname github.com --git-protocol https --web`의 공식 사용자 인증을 사용한다. 인증정보를 프로젝트 파일에 기록하지 않는다.

## 공개 배포 확인 결과 · 2026-10-03

- 로컬 계산·콘텐츠 검사: 36/36 통과.
- 로컬 production build: 통과.
- 로컬 browser E2E: 6/6 통과.
- GitHub 공식 로그인: suimaire 계정 확인 완료.
- 공개 저장소: https://github.com/suimaire/chemiosmosis-atp-explorer
- 공개 앱: https://suimaire.github.io/chemiosmosis-atp-explorer/ — HTTP 200, JS·CSS·favicon 정상 로드.
- 최초 공개 앱 커밋: `a65e0fd9af4a7fd26d1f2ac3b1be8827b03587a6` (main).
- 최초 Pages workflow: [37090969720](https://github.com/suimaire/chemiosmosis-atp-explorer/actions/runs/37090969720) — 단위 검사·빌드·Chromium E2E·배포 전부 성공.
- 공개 origin에서 동일한 브라우저 시나리오 6/6 통과. 일반 동선에서 console error·pageerror 0.
- 공개 앱 정상 작동을 확인한 다음에만 포털 작업 시작.
- 포털 checkout: `D:\Codex\suimaire.github.io`. 새 clone 후 clean / main / origin/main 일치 확인.
- 포털 변경은 `_data/molecular_explorers.yml`의 새 항목 11줄 추가뿐. 기존 네 항목 보존.
- 포털 로컬 검증: 기존 테스트 93/93, 실제 Jekyll 3.10.0 + remote theme 빌드 16페이지, 1440·390px 브라우저 확인 통과.
- 포털 commit: `052cb75d1d38f110089dd81e62a44af14d916a62`.
- 포털 Pages workflow: [37091474424](https://github.com/suimaire/suimaire.github.io/actions/runs/37091474424) — 성공.
- 공개 포털: https://suimaire.github.io/#molecular — 1.2.5 자동 번호, 운영 중 표시, 실제 앱 링크 이동을 1440·390px에서 확인.
- 미완료 기능·배포 항목 없음. 생리학적 측정 모형이 아니라는 과학적 한계는 `SCIENCE_VALIDATION.md`에 별도 기록.

`verification/screenshots/live-*`는 공개 앱의 32개 검증 화면이다. `portal-live-*`는 공개 포털 확인 화면이다. 이후 문서·증거 커밋은 동일한 배포 workflow로 다시 검사되며 위 최초 공개 앱의 구현을 변경하지 않는다.
