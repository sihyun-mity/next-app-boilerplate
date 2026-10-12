<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Agent Guide (next-app-boilerplate)

이 문서는 본 보일러플레이트(혹은 이를 기반으로 시작한 신규 프로젝트)에서 작업하는 코드 에이전트
(예: Claude Code, Cursor, 기타 LLM 기반 도구)를 위한 안내입니다. 보일러플레이트의 **문법 / 스타일 /
흐름 / 구조 / 컨벤션** 을 한 자리에서 파악할 수 있도록 정리되어 있습니다. 새 프로젝트로 복제해
사용하더라도, 이 문서를 그대로 유지하고 프로젝트 고유 규칙만 아래에 덧붙이는 것을 권장합니다.

`CLAUDE.md` 는 이 파일을 그대로 import (`@AGENTS.md`) 하므로, Claude Code 에서도 동일한 규칙이 적용됩니다.

---

## 0. Always-do

1. **Next.js 관련 작업 전에는 반드시 `node_modules/next/dist/docs/` 를 확인한다.** (위 섹션 참고)
2. **`utils`, `hooks`, `components` 의 `index.ts` 재수출을 확인한 뒤**, 새 파일을 만들기 전에
   동일/유사 기능이 이미 있는지 검색한다 (예: `cn`, `staticMetadata`, `mergeRefs`, `useMedia`).
3. **alias 를 일관되게 사용한다.** `@/...` 는 프로젝트 루트, `#/...` 는 `public/`. 상대 경로 (`../../`) 는 같은
   기능 폴더 내부에서만 사용한다.
4. 기능을 추가하면 해당 폴더의 `index.ts` 에 export 를 잊지 않는다.

---

## 1. 프로젝트 한눈에

- **프레임워크**: Next.js 16 (App Router) / React 19 / React Compiler 활성화
- **언어**: TypeScript 5, `strict: true`, `target: ES2017`, `moduleResolution: bundler`
- **스타일**: Tailwind CSS 4 (`@tailwindcss/turbopack` 로더, PostCSS 미사용) + `cn(clsx + tailwind-merge)` 패턴
- **상태**: zustand (모든 store 는 `'use client'`)
- **데이터**: `@tanstack/react-query` + `@lukemorales/query-key-factory` + `fetchExtended` (`return-fetch`)
- **모션**: framer-motion, GSAP (ScrollTrigger 등록은 `useScrollFadeIn` 에서 1회)
- **렌더링**: Cache Components(`cacheComponents`) + Partial Prefetching(`partialPrefetching`) 활성화
- **품질 게이트**: ESLint(`eslint-config-next`) + Prettier + husky pre-commit (lint-staged)

런타임 / 패키지 매니저:
- Node.js `>=24.12.0 <25.0.0`
- npm `>=11.6.2 <12.0.0`
- 의존성 설치는 `npm ci` (lockfile 보존). 새 의존성은 `npm install` 로 추가하되, lockfile 변경을 함께
  커밋한다.

---

## 2. 디렉터리 구조와 책임

최신 `create-next-app` 기본값과 동일하게 **`src/` 디렉터리를 쓰지 않고** 프로젝트 루트에 소스 폴더를 둔다.

```
(root)
├── app/        App Router 진입점. layout.tsx 는 Polyfill / QueryProvider / MobileDetector / #next-app-portal 마운트.
├── actions/    'use server' Server Action. 파일명은 *.actions.ts.
├── components/ 재사용 컴포넌트. 'use client' 또는 서버 컴포넌트. index.ts 재수출.
├── hooks/      커스텀 훅. 모두 'use client'. 파일명은 use-*.ts(또는 use-*/index.ts).
├── providers/  앱 전역 Provider 와 react-query 키 팩토리 (`QueryProvider`, `queries`).
├── stores/     zustand store. 도메인별 폴더 + index.ts/index.type.ts/index.constants.ts.
├── core/       인프라 레벨 모듈 (fetchExtended 등). 비즈니스 로직 금지.
├── styles/     전역 CSS. globals.css 가 나머지를 import.
├── types/      전역 타입 / 환경 변수 선언 / 공유 타입.
└── utils/      순수 함수. 사이드 이펙트와 React import 최소화.
public/
└── *.svg       정적 자산.
```

`tsconfig.json` 의 path alias:

| Alias | 대상 |
| --- | --- |
| `@/*` | `./*` |
| `#/*` | `./public/*` |

새 파일을 만들 때 다른 폴더로 임포트가 필요하면 항상 alias 를 사용한다.

---

## 3. 코드 스타일 / 문법 컨벤션

### 3.1 TypeScript

- **strict 모드**. `any` 회피, 불가피하면 `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
  를 같은 줄/위 줄에 단다 (`utils/array.ts`, `utils/object.ts` 의 패턴 참고).
- **타입 임포트는 가능하면 `import type` 또는 inline `type` 키워드 사용** (`import { type RefObject }`).
- 컴포넌트/훅 props 는 `Readonly<Props>` 로 받는다.
  ```ts
  export function Foo({ value, ...props }: Readonly<Props>) { ... }
  ```
- 객체 인자가 3 개 이상이거나 boolean flag 가 섞이면 **이름 있는 객체 파라미터**를 선호한다.
  ```ts
  export const getChunkedArray = <T>({ data, size }: { data: T; size: number }): T[] => { ... }
  ```
- 제네릭 기본 타입은 `<T extends HTMLElement = HTMLElement>` 처럼 명시한다.

### 3.2 React

- **`'use client'` 디렉티브는 파일 첫 줄에 위치**시키고, 빈 줄로 구분한 다음 import 를 시작한다.
- **함수 컴포넌트는 `export function Foo() {}` 형태**가 기본. `export default` 는 `app/` 의 라우트 파일
  (`page.tsx`, `layout.tsx`, `robots.ts` 등) 같이 Next.js 가 default export 를 요구하는 곳에서만 사용한다.
- `useId` 는 동일 키 충돌이 우려될 때 (예: 리스트가 아닌 단일 컴포넌트 내부 framer-motion key) 적극 사용한다.
- ref 콜백 + 내부 ref 동시에 필요하면 `mergeRefs` (`@/utils`) 를 사용.
- DOM 측정은 `useLayoutEffect` 로, 단순 사이드이펙트는 `useEffect` 로.
- React Compiler 가 활성화되어 있으므로, **수동 메모(`useMemo`, `useCallback`)는 측정 가능한 이득이
  있을 때만** 추가한다. 컴파일러가 특정 경우 경고하면 (`react-hooks/preserve-manual-memoization`,
  `react-hooks/set-state-in-effect`) 의도된 코드라도 그 줄에 한정해 disable 주석을 단다.

### 3.3 className / 스타일

- 항상 `cn(...)` 으로 합친다. 단일 정적 문자열이면 그대로 두고, 조건/외부 className 이 끼면 `cn` 사용.
  ```tsx
  <div className={cn('relative overflow-hidden', className)} />
  ```
- Tailwind 충돌은 `tailwind-merge` 가 알아서 정리하므로, 사용자 className 을 마지막에 둔다.
- Prettier `tailwindStylesheet` 가 `./styles/globals.css` 로 설정되어 있어 클래스 정렬이 자동
  적용된다. 정렬 결과를 수동으로 흩뜨리지 말 것.
- 인식되는 함수: `cn`, `clsx`, `tw`, `twMerge`, `cva` (`prettier.config.mjs`).

### 3.4 ESM / Import 규칙

- 외부 라이브러리 → 절대 alias (`@/...`) → 상대 경로 순서로 그룹을 나눈다 (Prettier가 강제하진 않으나
  기존 코드의 흐름).
- 같은 도메인 내부의 형제 파일은 `from '.'` 또는 `from './index.type'` 처럼 명시.
- 폴더의 `index.ts` 가 `export * from './...'` 으로 재수출하고 있으므로, 외부에서는 `@/utils`,
  `@/hooks`, `@/components`, `@/stores`, `@/types`, `@/actions`, `@/core`, `@/providers` 형태로 임포트한다.

### 3.5 Prettier

- `printWidth: 120`, `tabWidth: 2`, `singleQuote: true`, `trailingComma: 'es5'`, `endOfLine: 'lf'`,
  `semi: true`. 임의로 변경하지 않는다.

### 3.6 ESLint

- `eslint-config-next/core-web-vitals` + `.../typescript` 기반. 별도 추가 규칙은 없으므로,
  React Compiler / Next.js 권장 규칙을 그대로 따른다.

### 3.7 주석 / JSDoc

- 모든 export 함수 / 훅 / 컴포넌트 / store 는 **한국어 JSDoc** 으로 동작과 주의사항을 설명한다.
  파라미터, 반환값, 엣지 케이스(SSR, IME, 비어 있는 입력 등)를 빠뜨리지 않는다.
- "WHAT" 보다 "WHY" / "주의해야 하는 동작" 위주. 기존 파일들의 JSDoc 톤을 참고.
- 새 모듈을 만들었으면 **동일 폴더의 `index.ts` 에서 재수출** + JSDoc 작성.

---

## 4. 데이터 흐름 / 자주 쓰는 패턴

### 4.1 Server Action 호출

`actions/*.actions.ts` 의 함수는 `'use server'`. 클라이언트에서는 `@tanstack/react-query` 의 `useQuery`
(혹은 `useMutation`) 와 함께 사용한다. 쿼리 키는 `@lukemorales/query-key-factory` 로 생성하여
`@/providers` 의 `queries` 트리에 등록한다.

```ts
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/providers';

const { data } = useQuery(queries.serverTime.now());
```

새 도메인 쿼리를 추가할 때는:

1. `providers/query-provider/query-keys/<domain>-query-keys.ts` 에 `createQueryKeys('<domain>', { ... })`
   로 키 팩토리를 정의한다 (`queryKey` + `queryFn`).
2. 같은 폴더의 `index.ts` 에서 `export * from './<domain>-query-keys'` 로 재수출하고,
   `mergeQueryKeys(...)` 인자에 추가한다.
3. 호출 측에서는 `useQuery({ ...queries.<domain>.<query>(args), enabled, staleTime, ... })` 형태로 사용한다.

`QueryClient` 의 기본 `staleTime` 은 2초로 설정되어 있어 짧은 시간 내 중복 요청이 자연스럽게 합쳐진다.
캐시를 더 길게 유지하고 싶다면 호출부에서 `staleTime` 을 직접 지정한다.

### 4.2 외부 API 호출

`@/core` 의 `fetchExtended` 를 사용한다.
- 4xx/5xx 응답은 자동으로 `Error` 가 throw 된다.
- `multipart/form-data` 가 필요하면 `createFormData` 로 본문을 만든다.

```ts
import { fetchExtended, createFormData } from '@/core';

const res = await fetchExtended('/api/upload', {
  method: 'POST',
  body: createFormData({ name, file }),
});
```

CORS 가 필요한 Route Handler 는 `allowCors` (`@/utils`) 로 감싼다.

```ts
export const GET = allowCors(async (req) => NextResponse.json({ ok: true }));
export const OPTIONS = allowCors(async () => new NextResponse());
```

### 4.3 URL 쿼리 관리

- 읽기 전용: `useAllSearchParams()`
- 읽기/쓰기/리셋: `useSearchQuery<T>()` (튜플 / 객체 양쪽 비구조화 지원)
- 문자열 변환: `createHrefQuery({ pathname, query })`

### 4.4 디바이스 / 미디어 분기

- 미디어 쿼리: `const { sm, md, lg, xl } = useMedia();` (zustand 와 자동 동기화)
- User-Agent: `useMobileStore()` 에서 `isMobile / isAndroid / isIOS / isReady` 사용. `isReady` 가 `true` 가
  된 시점부터 분기 UI 를 그린다 (SSR/CSR 일치 보장).

### 4.5 모션

- 단순 등장 모션은 framer-motion 의 `motion.*` 컴포넌트 사용 (`AnimatedTimer`, `TextMotion` 참고).
- 스크롤 기반 트리거는 `useScrollFadeIn(selector)`. ScrollTrigger 플러그인은 모듈 스코프에서 1회 등록되어 있다.

### 4.6 포털

`#next-app-portal` 노드는 `app/layout.tsx` 가 마운트한다. 모달/토스트/드롭다운은 `<Portal>` 컴포넌트로
감싼다.

---

## 5. 상태 관리 (zustand) 컨벤션

도메인별 폴더 구조:

```
stores/<domain>/
├── index.ts           // 'use client' + create<Store>()((set) => (...))
├── index.type.ts      // <Store> = <Getter> & <Setter>
└── index.constants.ts // 기본값 (선택)
```

- 모든 store 파일은 `'use client'`.
- 상태는 평탄하게 (중첩 객체 회피). 액션은 `setX(value)` 시그니처가 기본. 일괄 업데이트가 필요하면
  `setMedia(partial)` 처럼 `Partial<Getter>` 를 받는 단일 액션을 둔다.
- 외부에서 직접 `set` 을 호출하지 않는다 — 항상 store 의 액션을 통해 갱신.

---

## 6. 컴포넌트 패턴

- **`'use client'` 가 필요한지 먼저 판단.** 브라우저 API / 이벤트 / 상태가 없으면 서버 컴포넌트로 둔다.
- **합성(composition) > 옵션 폭발.** 옵션 prop 이 많아지면 `withSubComponents(Parent, { Child })`
  (`@/utils`) 로 `Parent.Child` 형태로 분리한다 (`NextImage` / `NextImage.Protected` 참고).
- **이미지**는 가능한 한 `NextImage` 를 사용. 직접 `next/image` 를 쓰는 경우 `OriginNextImage` 와 동일한
  fallback / placeholder 처리 흐름을 따른다.
- **Polyfill / MobileDetector** 는 루트 layout 에 단 한 번만 마운트한다. 페이지/하위 트리에서 다시
  마운트하지 않는다.

---

## 7. 훅 작성 가이드

- 파일/폴더 명: `use-<kebab-case>.ts` 또는 `use-<kebab-case>/index.ts` (SCSS 모듈처럼 함께 묶어야 할 때).
- 첫 줄은 `'use client'`.
- 외부 의존성을 줄이고, 조합으로 해결되면 새 훅 대신 기존 훅 위에 작은 래퍼를 쓴다.
- DOM 측정 / 동기 작업은 `useLayoutEffect`, 비동기는 `useEffect`.
- 정리(cleanup) 함수가 필요하면 절대 빠뜨리지 않는다 (이벤트 리스너, GSAP ScrollTrigger, ResizeObserver,
  setInterval 등).

---

## 8. Next.js / App Router 규칙

- `app/layout.tsx` 의 마운트 순서를 임의로 바꾸지 않는다 (`Polyfill` → `QueryProvider{children}` →
  `MobileDetector` → `#next-app-portal`).
- **루트 layout 에 `<Suspense>` 를 다시 추가하지 않는다.** 루트 경계는 blocking-route 빌드 검증을 무력화하고,
  빈 fallback 으로 정적 셸을 빈 화면으로 만든다. 경계는 동적 데이터를 읽는 컴포넌트 바로 바깥에 둔다.
- 메타데이터는 `staticMetadata` 로 감싼다. `viewport` 는 `Viewport` 타입을 명시.
- 새 라우트의 metadata 는 페이지 / 레이아웃 단위로 가까이 둔다 (App Router 권장 방식).
- Route Handler 는 `app/api/.../route.ts`. CORS 는 `allowCors` 로 통일.
- `images.qualities` 가 5 단위로 모두 허용되어 있으므로 `quality` prop 을 자유롭게 지정할 수 있다.
- `experimental.scrollRestoration: true` 와 `reactCompiler: true` 가 활성화되어 있다는 점을 염두에 둔다.
- **`cacheComponents: true` + `partialPrefetching: true`** (최신 create-next-app 기본값).
  - 데이터 패칭은 기본이 동적이다. 캐시가 필요하면 `'use cache'` + `cacheLife` / `cacheTag` 를 사용한다
    (`node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`).
  - `export const dynamic` / `revalidate` / `fetchCache` 같은 기존 route segment config 는 사용하지 않는다.
  - `cookies()` / `headers()` / `searchParams` / `Date.now()` 등 요청 시점 값을 읽는 서버 컴포넌트는 `<Suspense>` 안에
    둬야 빌드가 통과한다. 루트 경계가 없으므로 빠뜨리면 빌드가 실패해 조기에 발견된다 — `instant = false` 로
    회피하기보다 의미 있는 fallback 을 가진 `<Suspense>` / `loading.tsx` 를 추가한다.
  - `useSearchParams` 를 쓰는 훅(`useSearchQuery`, `useAllSearchParams`) 을 사용하는 클라이언트 컴포넌트도
    호출 측에서 `<Suspense>` 로 감싼다.
  - 클라이언트 내비게이션 시 이전 라우트는 언마운트 대신 `<Activity mode="hidden">` 으로 보존된다. effect 는
    정리 후 재실행되므로 cleanup 을 반드시 작성한다.
- Tailwind 는 PostCSS 가 아닌 `turbopack.rules['*.css']` 의 `@tailwindcss/turbopack` 로더로 처리된다.
  `postcss.config.*` 를 다시 추가하지 않는다.
- 루트 레이아웃은 `html.h-full` + `body.flex.min-h-full.flex-col` 구조다. 페이지 최상위 요소는 `min-h-screen` 대신
  `flex-1` 로 남은 높이를 채운다. 상속되는 타이포그래피 클래스(폰트 / 줄바꿈 / `antialiased`)는 html 에, 레이아웃 /
  색상 / `touch-action` / `select-none` 은 body 에 둔다.
- 폰트: 기본 본문은 Pretendard(`font-pretendard`, html 에 적용). Geist / Geist Mono 는 `next/font/google` 로 로드해
  `font-sans` / `font-mono` 유틸리티에 연결되어 있다 (`styles/fonts.css` 의 `@theme inline`).
- Tailwind 테마 토큰은 모두 `@theme inline` 으로 선언한다. 유틸리티가 값을 직접 품고(예: `.bg-background{background-color:var(--background)}`)
  사용 요소에서 변수를 해석하므로, `next/font` 변수나 하위 요소에서 재정의한 `--background` 등도 그대로 반영된다.
  inline 토큰은 유틸리티에서만 쓰이면 `:root` 에 변수가 출력되지 않고, 소스(CSS / 클래스 / TS 문자열)에
  `--container-md` 처럼 **변수명이 그대로 등장할 때만** 출력된다. 따라서 직접 쓸 때는
  - CSS 값: `--theme(--container-md)` (빌드 시 `48rem` 으로 치환, 런타임 변수 불필요) 또는 `var(--container-md)`
  - 클래스: `w-(--container-md)` / 컨테이너 쿼리는 `@md:` 변형
  - JS (`getComputedStyle(...).getPropertyValue`): 변수명을 문자열 리터럴로 적는다. `'--container-' + size` 처럼
    조합하면 감지되지 않으므로, 런타임에 항상 필요하면 해당 토큰을 `@theme inline static` 블록에 둔다.

---

## 9. 커밋 / Lint / 타입 체크 흐름

- husky `pre-commit` → `npx lint-staged`
  - `*.{js,jsx,ts,tsx}` : `eslint --fix` + `prettier --write`
  - `*.{css,scss,json,html}` : `prettier --write`
- 큰 변경을 푸시하기 전에는 다음을 수동으로 한 번 돌리는 것을 권장한다.
  ```shell
  npm run lint
  npx tsc --noEmit  # tsconfig 에 noEmit: true 가 설정되어 있어 타입 체크만 수행
  npm run build     # 실제 번들/타입까지 통합 검증
  ```
- 커밋 메시지 컨벤션은 별도 강제는 없으나, 기존 git log 가 `feat:` / `fix:` / `chore:` 류의 Conventional
  Commits 에 가까운 형식을 사용한다 — 새 프로젝트도 그 톤을 유지하면 깔끔하다.

---

## 10. 새 기능 추가 체크리스트

1. `node_modules/next/dist/docs/` 에서 관련 문서를 확인했는가?
2. 같은 기능이 `@/utils`, `@/hooks`, `@/components` 에 이미 있는가?
3. 클라이언트/서버 경계를 정확히 잡았는가? (`'use client'` / `'use server'` 위치)
4. props 는 `Readonly<...>`, 객체 파라미터 패턴을 따랐는가?
5. className 은 `cn(...)` 으로 합쳤는가?
6. JSDoc(한국어, WHY 중심) 을 추가했는가?
7. 같은 폴더의 `index.ts` 재수출에 등록했는가?
8. 사이드이펙트 정리(unsubscribe / clearTimeout / kill) 가 빠지지 않았는가?
9. SSR 첫 페인트에서 깜빡임이나 hydration mismatch 위험이 없는가? 디바이스/미디어 분기는
   `isReady` / `useMedia` 패턴을 사용했는가?
10. 새 환경 변수가 필요하면 `types/environments.d.ts` 의 `ProcessEnv` 인터페이스에 타입을 추가했는가?

---

## 11. 안 하기로 한 것 (Don'ts)

- `dangerouslySetInnerHTML` 은 사용 전에 반드시 의도/이스케이프를 검토.
- `console.log` 를 production 코드에 남기지 않는다 (이미 `console.error` 만 의도적으로 사용 중).
- 직접 `document.documentElement.style.overflow` 를 만지지 않는다 — 배경 스크롤을 잠가야 하면 `usehooks-ts` 의 `useScrollLock` 훅을 사용한다.
- 전역 ref / 전역 변수로 컴포넌트 간 통신하지 않는다 — zustand store 또는 context 사용.
- 의미 없는 주석(`// 변수 선언`)이나 task tracker 주석(`// 추후 수정 예정`) 을 남기지 않는다. 필요하면
  TODO 대신 이슈 트래커로 옮긴다.
- IDE 가 자동 정렬한 import / className 을 임의로 다시 정렬하지 않는다.

---

## 12. 보일러플레이트에서 신규 프로젝트로 옮길 때

이 보일러플레이트를 fork 하거나 그대로 새 저장소의 시드로 사용했다면, 처음 한 번만 다음을 정리한다.

1. `package.json` 의 `name`, `version`, `private` / `engines` 검토.
2. `app/layout.tsx` 의 `metadata` (`title`, `description`) 갱신.
3. `app/robots.ts` 정책을 운영 환경에 맞게 조정.
4. `vercel.json` 의 `regions` 가 서비스 권역과 맞는지 확인 (기본값 `icn1`).
5. 사용하지 않는 컴포넌트/훅(예: `useGrabSlide`, `useScrollFadeIn`) 은 `index.ts` 에서 export 만 빼는 식으로
   "삭제" 가 아닌 "비활성화" 처리해 보일러플레이트의 학습 자료 가치를 보존하는 것을 권장한다.
6. 본 `AGENTS.md` / `CLAUDE.md` 는 가능하면 그대로 둔 채, 프로젝트 고유 규칙은 파일 끝에
   `## Project-specific notes` 섹션으로 추가한다.
