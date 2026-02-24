'use client';

import { usePathname, useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useCallback } from 'react';
import { useAllSearchParams } from '@/hooks';

type UseSearchQuerySetOptions = {
  replace?: boolean;
};

type UseSearchQueryResultTuple<T> = [T, (query: Partial<T>, options?: UseSearchQuerySetOptions) => void, () => void];

type UseSearchQueryResultObject<T> = {
  query: T;
  setQuery: (query: Partial<T>, options?: UseSearchQuerySetOptions) => void;
  resetQuery: () => void;
};

type UseSearchQueryResult<T> = UseSearchQueryResultTuple<T> & UseSearchQueryResultObject<T>;

/**
 * URL 쿼리 관리 Hook
 *
 * @returns {UseSearchQueryResult} 현재 URL 쿼리와 쿼리 설정, 쿼리 초기화, Array 또는 Object로 가져올 수 있음
 * @example const [query, setQuery, resetQuery] = useSearchQuery();
 * @example const { query, setQuery, resetQuery } = useSearchQuery();
 */
export default function useSearchQuery<T extends ParsedUrlQuery>(): UseSearchQueryResult<T> {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useAllSearchParams();

  const setQuery = useCallback(
    (query: Partial<T>, options?: UseSearchQuerySetOptions) => {
      const { replace = true } = { ...options };
      const mergedQuery = { ...queries, ...query };

      // falsy 한 값을 가진 key 삭제
      const filteredQuery = Object.fromEntries(Object.entries(mergedQuery).filter(([, value]) => Boolean(value)));

      const href = `${pathname}?${queryString.stringify(filteredQuery)}`;

      // 쿼리 업데이트
      if (replace) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    },
    [pathname, queries, router]
  );

  const resetQuery = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router]);

  const result = [queries as T, setQuery, resetQuery] as UseSearchQueryResult<T>;
  result.query = queries as T;
  result.setQuery = setQuery;
  result.resetQuery = resetQuery;

  return result;
}
