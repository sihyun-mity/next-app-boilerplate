'use client';

import { usePathname, useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useAllSearchParams } from './index';

const useSearchQuery = <T extends ParsedUrlQuery>(): [T, (query: Partial<T>) => void] => {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useAllSearchParams();

  const setQuery = (query: Partial<T>) =>
    router.replace(`${pathname}?${queryString.stringify({ ...queries, ...query })}`, { scroll: false });

  return [queries as T, setQuery];
};

export default useSearchQuery;
