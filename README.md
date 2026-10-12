# next-app-boilerplate

TypeScript 기반 Next.js (App Router) 보일러플레이트입니다. 새 프로젝트를 빠르게 시작할 수 있도록
자주 쓰는 커스텀 훅, 디바이스 / 미디어 쿼리 감지, 유틸리티 함수, 상태 관리, 코드 품질 도구가 미리
구성되어 있습니다.

---

## 요구 사항

| 항목 | 버전 |
| --- | --- |
| Node.js | `>=24.12.0 <25.0.0` |
| npm | `>=11.6.2 <12.0.0` |

`package.json` 의 `engines` 필드에 강제 범위가 지정되어 있으므로, 다른 버전에서는 `npm ci` 가 실패할 수 있습니다.

---

## 빠른 시작

```shell
npm ci         # 의존성 설치 (husky pre-commit 도 동시에 활성화)
npm run dev    # 개발 서버 실행 (Turbopack / React Compiler)
npm run build  # 프로덕션 빌드
npm start      # 빌드된 결과물로 서버 실행
npm run lint   # ESLint
```

VS Code / IntelliJ Idea 용 사전 실행 구성(`scripts/Build.run.xml`, `scripts/Debug.run.xml`)이 포함되어
있으므로, IDE 의 Run / Debug 패널에서 바로 실행할 수 있습니다.

---

## 기술 스택

- **프레임워크**: Next.js 16 (App Router) + React 19 + React Compiler
- **언어 / 빌드**: TypeScript 5, `target: ES2017`, `module: esnext`, `moduleResolution: bundler`
- **렌더링**: Cache Components + Partial Prefetching
- **스타일**: Tailwind CSS 4 (`@tailwindcss/turbopack` 로더) + `tailwind-merge` + `clsx` + `tailwindcss-safe-area`
- **상태**: zustand (전역 client-only store)
- **데이터 패칭**: `@tanstack/react-query` + `@lukemorales/query-key-factory` + `return-fetch` 기반 `fetchExtended`
- **애니메이션**: framer-motion + GSAP (ScrollTrigger 포함)
- **유틸**: `date-fns`, `query-string`, `mobile-detect`, `usehooks-ts`, `core-js`
- **품질**: ESLint(`eslint-config-next`), Prettier (+ `prettier-plugin-tailwindcss`), husky + lint-staged + tsc-files

---

## 디렉터리 구조

최신 `create-next-app` 기본값과 동일하게 `src/` 디렉터리 없이 프로젝트 루트에 소스 폴더를 둡니다.

```
(root)
├── app/                # App Router 진입점 (layout, page, robots, ...)
├── actions/            # 'use server' Server Actions (예: getServerTime)
├── components/         # 재사용 컴포넌트 (Polyfill, MobileDetector, NextImage, Portal, ...)
├── hooks/              # 커스텀 훅 (useMedia, useSearchQuery, useScrollPage, ...)
├── providers/          # 앱 전역 Provider (QueryProvider, react-query 키 팩토리)
├── stores/             # zustand store (media, mobile)
├── core/               # 인프라 레벨 모듈 (fetchExtended, createFormData)
├── styles/             # 전역 CSS (globals, variables, colors, fonts, layout, utility, gsap)
├── types/              # 전역 타입 / 환경 변수 / 쿼리 타입
└── utils/              # 순수 유틸리티 (array, class(cn), date, query, ...)
public/
└── *.svg
```

`tsconfig.json` 의 path alias 가 다음과 같이 설정되어 있습니다.

| Alias | 대상 |
| --- | --- |
| `@/*` | `./*` |
| `#/*` | `./public/*` |

각 폴더의 `index.ts` 가 하위 모듈을 재수출하므로, 일반적으로 `@/utils`, `@/hooks`, `@/components`,
`@/stores`, `@/actions`, `@/core`, `@/types`, `@/providers` 형태로 임포트합니다.

---

## 핵심 기능 한눈에 보기

### Components (`components`)

| 컴포넌트 | 설명 |
| --- | --- |
| `Polyfill` | core-js 폴리필을 클라이언트 번들에 주입 (렌더 결과 없음). |
| `MobileDetector` | User-Agent 분석 결과를 `useMobileStore` 에 기록. |
| `Portal` | `#next-app-portal` 노드로 children 을 포털링. SSR 비활성화. |
| `NextImage` / `NextImage.Protected` | `next/image` 래퍼, 비율 / Fallback / 우클릭 보호 변형 제공. |
| `AnimatedTimer` | 두 자리 숫자 카운터의 슬라이드 애니메이션. |
| `TextMotion` | 여러 텍스트를 일정 간격으로 순환 + 글자 단위 스태거 모션. |
| `Skeleton` | `react-loading-skeleton` 의 얇은 래퍼. |

### Hooks (`hooks`)

| 훅 | 설명 |
| --- | --- |
| `useMedia` | Tailwind 의 `sm/md/lg/xl` 매칭을 zustand 와 동기화. |
| `useContainer` | 와이드 화면(>1920px)에서 좌우 균등 여백 계산. |
| `useFocusScroll` | 가로 스크롤 컨테이너에서 특정 자식으로 스크롤. |
| `useOnClickOutside` | ref 외부 클릭(`mouseup`) 감지. |
| `useScrollPage` | 가로 스크롤 캐러셀의 페이지 인덱스 추적 / 이동. |
| `useScrollFadeIn` | GSAP ScrollTrigger 기반 페이드 인 모션. |
| `useGrabSlide` | 마우스 드래그로 가로 스크롤 조작. |
| `useAllSearchParams` | `URLSearchParams` → `ParsedUrlQuery` 변환. |
| `useSearchQuery` | URL 쿼리 읽기/쓰기/리셋 (`router.replace` 기본). |
| `useServerNow` | Server Action 으로 받은 서버 시간을 매 초 갱신. |

### Utils (`utils`)

| 모듈 | 주요 export |
| --- | --- |
| `array` | `shuffle`, `getChunkedArray`, `filterDuplicateItem`, `deepCopy` |
| `boolean` | `isTrue` |
| `class` | `cn` (clsx + tailwind-merge) |
| `date` | `secondsToMinutes`, `getElapsedTime` |
| `device` | `isTouchDevice` |
| `element` | `getHighlightedText` |
| `keyboard` | `isEnter` (IME 조합 대응) |
| `meta` | `staticMetadata`, `shareCurrentPage` |
| `next` | `allowCors` (Route Handler CORS 래퍼) |
| `object` | `compareAllKeys`, `hasAllValues`, `withSubComponents` |
| `promise` | `getFulfilledResults`, `getRejectedResults`, `sleep` |
| `query` | `isValidQuery`, `isIncludedInQuery`, `addToQuery`, `removeFromQuery`, `createHrefQuery` |
| `ref` | `mergeRefs` |

### Stores (`stores`)

- `useMediaStore` — `sm / md / lg / xl` boolean. `useMedia` 훅이 갱신.
- `useMobileStore` — `isMobile / isAndroid / isIOS / isReady`. `<MobileDetector />` 가 채워 넣음.

### Core / Actions

- `core/fetch.ts` — `fetchExtended` (4xx/5xx 자동 throw), `createFormData` (`File`/`Blob` 인식).
- `actions/time.actions.ts` — `getServerTime` (`'use server'`, `Date.now()` 반환).

---

## 설정 / 도구

- **Next.js** (`next.config.ts`)
  - `experimental.scrollRestoration: true`
  - `experimental.agentFeedback: false`
  - `reactCompiler: true`
  - `cacheComponents: true`, `partialPrefetching: true`
  - `turbopack.rules['*.css']` → `@tailwindcss/turbopack` 로더 (PostCSS 설정 파일 없음)
  - `images.formats: ['image/avif', 'image/webp']`
  - `images.qualities: [5..100]` 5 단위 전체 허용
- **TypeScript** (`tsconfig.json`)
  - `strict: true`, `target: ES2017`, `module: esnext`, `moduleResolution: bundler`
  - `paths`: `@/* → ./*`, `#/* → public/*`
- **ESLint** (`eslint.config.mjs`)
  - `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- **Prettier** (`prettier.config.mjs`)
  - `printWidth: 120`, `singleQuote: true`, `trailingComma: 'es5'`, `endOfLine: 'lf'`
  - `prettier-plugin-tailwindcss` 활성화 (`cn`, `clsx`, `tw`, `twMerge`, `cva` 인식)
- **husky + lint-staged** (`.husky/pre-commit`, `.lintstagedrc.mjs`)
  - 커밋 직전 `eslint --fix` + `prettier --write` 자동 적용
- **Vercel 배포** (`vercel.json`)
  - 기본 region 은 `icn1` (Seoul) 단일 지정

---

## 글로벌 스타일

`styles/globals.css` 가 다음 모듈을 한 번에 임포트합니다.

- `variables.css` — 전역 CSS 커스텀 프로퍼티
- `colors.css` — Tailwind 와 연동되는 색상 토큰
- `fonts.css` — Pretendard 가변 폰트(`font-pretendard`) 정의 + Geist / Geist Mono 를 `font-sans` / `font-mono` 에 연결
  (Pretendard 는 `pretendard` npm 패키지의 dynamic subset CSS, Geist 는 루트 layout 의 `next/font/google` 로 로드)
- `layout.css` — 페이지 레이아웃용 클래스
- `utility.css` — 자체 유틸리티 클래스
- `gsap.css` — ScrollTrigger 등 GSAP 관련 보정

루트 layout 은 최신 `create-next-app` 템플릿과 같이 `<html class="h-full">` + `<body class="flex min-h-full flex-col">`
구조이며, 페이지 최상위 요소는 `flex-1` 로 남은 높이를 채웁니다. 상속되는 타이포그래피 설정(Geist 폰트 변수,
Pretendard 기본 폰트 `font-pretendard`, 한글 줄바꿈 `break-keep wrap-anywhere`, `antialiased`)은 `<html>` 에,
배경/전경색, 사용자 텍스트 선택 비활성화 (`select-none`), 터치 팬 제스처 제한 (`touch-pan-x touch-pan-y`) 은 `<body>` 에
적용됩니다. 기본 본문 폰트는 Pretendard 이며, Geist 는 `font-sans` / `font-mono` 를 지정한 요소(첫 화면 등)에만 쓰입니다.

---

## 디버그 / 빌드 프로파일

`scripts/Debug.run.xml`, `scripts/Build.run.xml` 은 IntelliJ Platform 의 npm Run Configuration 정의 파일로,
"Debug" / "Build" 라는 사전 정의된 프로파일을 IDE 에 자동 등록합니다. CLI 에서 동일하게 실행하려면
`npm run dev` / `npm run build` 를 사용하세요.

---

## 라이선스

별도 라이선스가 부여되지 않은 사내/개인 보일러플레이트입니다. 프로젝트 시작 시 필요에 따라 추가하세요.
