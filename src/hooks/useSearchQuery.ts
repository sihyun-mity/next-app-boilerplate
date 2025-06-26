'use client';

import { usePathname, useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useAllSearchParams } from './index';

const useSearchQuery = <T extends ParsedUrlQuery>(): [T, (query: Partial<T>) => void, () => void] => {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useAllSearchParams();

  const setQuery = (query: Partial<T>) =>
    router.replace(`${pathname}?${queryString.stringify({ ...queries, ...query }, { arrayFormat: 'bracket' })}`, {
      scroll: false,
    });

  const resetQuery = () => router.replace(pathname, { scroll: false });

  return [queries as T, setQuery, resetQuery];
};

export default useSearchQuery;
