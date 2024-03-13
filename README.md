# next-app-boilerplate

Typescript 기반 [Create Next App](https://github.com/vercel/next.js) 템플릿입니다.<br />
Recoil, NormalizeCSS, Prettier, Git Pre-Hook 라이브러리 및 기타 패키지를 포함하고 있습니다.
Visual Studio Code와 IntelliJ Idea용 사전 실행 구성이 있습니다.

---

## Required

- NodeJS 버전을 18.19.1 이상, 19 이하로 사용해야 합니다.

## 프로젝트 설정

- 프로젝트 패키지를 설치합니다.
  ```shell
  npm ci
  ```

---

## Scripts

사전 설정된 프로파일을 선택하거나 아래 명령어를 터미널에 입력합니다.

- 개발 환경 디버그
  - Debug - Development
  - ```shell
    npm run dev
    ```
- 운영 환경 디버그
  - Debug - Production
  - ```shell
    npm run dev-prod
    ```
- 개발 환경 빌드
  - Build - Development
  - ```shell
    npm run build-dev
    ```
- 개발 환경 빌드
  - Build - Production
  - ```shell
    npm run build-prod
    ```
