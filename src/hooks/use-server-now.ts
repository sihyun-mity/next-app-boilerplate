'use client';

import useSWR from 'swr';
import { getServerTime } from '@/actions';
import { useCallback, useEffect, useState } from 'react';

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
  const [offset, setOffset] = useState<number>(0);
  const { data, isLoading, isValidating, mutate, error } = useSWR('use-server-now', getServerTime, {
    dedupingInterval: 1000,
    focusThrottleInterval: 1000,
    keepPreviousData: true,
    onSuccess: (data) => {
      calculateOffset(data);
      calculateNow();
    },
  });

  const calculateOffset = (data: number) => setOffset(data - Date.now());

  const calculateNow = useCallback(() => {
    if (!data) return;
    setNow(Date.now() + offset);
  }, [data, offset]);

  useEffect(() => {
    if (!autoUpdate) {
      calculateNow();
      return;
    }

    const timer = setInterval(calculateNow, 1000);
    return () => clearInterval(timer);
  }, [calculateNow, autoUpdate]);

  return { data, now, isLoading, isValidating, mutate, error };
}
