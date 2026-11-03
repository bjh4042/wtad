# 안드로이드 탐험대 — GitHub Pages 브랜치 배포

이 배포본은 미리 빌드한 정적 웹앱입니다. GitHub에서 npm 명령을 실행하거나 별도 배포 워크플로를 작성할 필요가 없습니다.

## 업로드 순서

1. `wtad_GitHub_Pages_Branch.zip`을 새 폴더에 압축 해제합니다.
2. GitHub의 `wtad` 저장소에서 `main` 브랜치를 선택합니다.
3. 저장소 첫 화면에서 `Add file → Upload files`를 누릅니다.
4. 압축을 푼 폴더 **안쪽**의 `index.html`, `assets` 폴더, `.nojekyll`, 이 안내 파일을 함께 올립니다. 바깥의 압축 해제 폴더나 ZIP 파일 자체를 올리지 않습니다.
5. `Commit changes`로 저장합니다. 기존 `index.html`이 있으면 이번 파일로 교체합니다. 기존 `src`, `dist`, `package.json`은 그대로 있어도 실행에 영향을 주지 않습니다.

저장소 첫 화면에 `index.html`과 `assets`가 직접 보여야 합니다. 파일 수는 100개 미만이라 한 번에 올릴 수 있습니다.

## Pages 설정

`Settings → Pages → Build and deployment`에서 다음과 같이 선택합니다.

| 항목 | 선택할 값 |
|---|---|
| Source | Deploy from a branch |
| Branch | main |
| Folder | /(root) |

`Save`를 누릅니다. 다른 이름의 브랜치에 올렸다면 `main` 대신 실제 업로드한 브랜치를 선택합니다. 이 배포본은 `/docs`를 선택하는 구성이나 `dist` 폴더를 선택하는 구성이 아닙니다.

배포가 완료되면 같은 Pages 화면의 `Visit site`를 누릅니다. 주소 형식은 `https://깃허브아이디.github.io/wtad/`입니다. 저장소 이름이 다르면 마지막 경로도 달라집니다. `github.com` 저장소 주소나 `blob/main/index.html` 주소는 웹앱 접속 주소가 아닙니다.

GitHub 안내상 반영에 최대 10분이 걸릴 수 있습니다. 예전 화면이 보이면 `Ctrl + F5`로 새로고침하세요. 새 GitHub Pages 주소에서는 기존 다른 사이트의 학습 기록이 자동으로 옮겨지지 않습니다.

## 문제가 있을 때

- **404**: 업로드한 브랜치와 Pages에서 선택한 브랜치가 같은지, 폴더가 `/(root)`인지, 저장소 첫 화면에 소문자 `index.html`이 있는지 확인합니다.
- **빈 화면 / 아이콘 누락**: `index.html`뿐 아니라 같은 ZIP의 `assets` 폴더 전체를 올렸는지 확인합니다. 소스용 `index.html`로 다시 덮어쓰지 않습니다.
- **`.nojekyll`이 안 보임**: 압축 프로그램에서 점으로 시작하는 파일을 표시하거나 GitHub의 `Add file → Create new file`에서 파일명을 `.nojekyll`로 지정하고 빈 파일로 커밋합니다.
- **배포 실패**: 저장소의 `Actions`에서 `pages build and deployment` 결과를 확인합니다. 별도의 커스텀 Actions 파일은 필요하지 않습니다.
- HTML 파일을 PC에서 더블클릭하는 실행 방식은 지원하지 않습니다. GitHub Pages 주소로 접속합니다.

## 개발용 원본에서 다시 만들기

개발용 원본 ZIP에는 React/TypeScript 소스가 보존되어 있습니다. Node.js 20.19 이상 또는 22.12 이상에서:

```sh
npm ci
npm run typecheck
npm test
npm run build:pages
```

생성된 `github-pages` 폴더 **안쪽** 파일을 GitHub 저장소 루트에 올리면 됩니다. Vite의 `base: './'` 설정을 유지해야 저장소 하위 경로에서도 자산이 로드됩니다.

이 패키지는 2026-11-03 기준 스마트폰 19.5:9 반응형 화면과 기존 학습 기능을 포함합니다. 실제 GitHub 저장소 업로드 및 Pages 활성화는 사용자가 위 절차로 진행합니다.

## 검수 기록

2026-11-03: TypeScript 검사, 29개 자동 회귀 테스트, 정적 빌드 통과. GitHub Pages와 같은 `/wtad/` 하위 경로의 정적 서버에서 1366×768 태블릿 화면과 390×844 스마트폰 화면, 아이콘 로딩 및 빠른 설정 열기를 확인했습니다. 실제 GitHub Pages 배포 완료 여부는 업로드 후 Pages 화면에서 확인합니다.

## 공식 안내

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://vite.dev/guide/build#relative-base

- 배포확인
