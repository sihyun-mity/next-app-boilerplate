'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

export * from './query-keys';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 2, // 2초 이내 중복 요청 방지
    },
  },
});

/**
 * 앱 전역에서 `@tanstack/react-query` 를 사용할 수 있도록 `QueryClientProvider` 를 마운트하는 Provider.
 *
 * - `queryClient` 는 모듈 스코프 싱글턴으로 생성된다 — 같은 클라이언트 세션 동안 캐시가 유지된다.
 * - `staleTime` 기본값을 2초로 두어, 짧은 시간 내 같은 키로 들어오는 중복 요청이 자연스럽게 합쳐진다.
 *   페이지/훅 단위로 더 길게 캐시하고 싶다면 `useQuery` 호출부에서 `staleTime` 을 덮어쓴다.
 * - `app/layout.tsx` 의 마운트 순서는 `Polyfill` → `QueryProvider` → `Suspense{children}` → `MobileDetector`
 *   → `#next-app-portal` 이 표준이다. (Provider 는 Suspense 보다 바깥에 위치)
 */
export function QueryProvider({ children }: Readonly<PropsWithChildren>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
