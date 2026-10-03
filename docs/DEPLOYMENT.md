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

## 현재 상태

- 로컬 계산·콘텐츠 검사: 36/36 통과.
- 로컬 production build: 통과.
- 로컬 browser E2E: 6/6 통과.
- 공개 저장소·Pages·포털: 공식 GitHub 로그인 이후 진행 예정. 공개 배포 확인 전 포털을 수정하지 않음.

배포가 끝나면 이 상태를 실제 URL·workflow·commit으로 갱신한다.
