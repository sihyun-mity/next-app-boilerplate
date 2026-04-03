'use client';

import useSWR from 'swr';
import { getServerTime } from '@/actions';
import { useEffect, useState } from 'react';

type Props = {
  autoUpdate?: boolean;
};

/**
 * 현재 서버 시간을 가져오는 Hook
 *
 * @param {Props} props - Properties
 * @param {Props['autoUpdate']} [props.autoUpdate = true] - 서버 시간을 매초마다 갱신
 */
export function useServerNow(props?: Props) {
  const { autoUpdate = true } = { ...props };
  const [now, setNow] = useState<number>();
  const { data, isLoading, isValidating, mutate, error } = useSWR('use-server-now', getServerTime, {
    dedupingInterval: 1000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!data) return;

    /** 로컬 시간과 오차 계산 */
    const offset = data - Date.now();

    /** 현재 서버시간 계산 */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now() + offset);

    if (!autoUpdate) return;

    /** 매초마다 자동 갱신 */
    const timer = setInterval(() => {
      setNow(Date.now() + offset);
    }, 1000);

    return () => clearInterval(timer);
  }, [data, autoUpdate]);

  return { data, now, isLoading, isValidating, mutate, error };
}
