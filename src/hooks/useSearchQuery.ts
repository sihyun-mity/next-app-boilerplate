'use client';

import { usePathname, useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useAllSearchParams } from './index';
import { useCallback } from 'react';

const useSearchQuery = <T extends ParsedUrlQuery>(): [T, (query: Partial<T>) => void, () => void] => {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useAllSearchParams();

  const setQuery = useCallback(
    (query: Partial<T>) =>
      router.replace(`${pathname}?${queryString.stringify({ ...queries, ...query })}`, {
        scroll: false,
      }),
    [pathname, queries, router],
  );

  const resetQuery = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router]);

  return [queries as T, setQuery, resetQuery];
};

export default useSearchQuery;
