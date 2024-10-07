'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Property } from 'csstype';

import { useMedia } from './index';

export default function useContainer() {
  const [overflowPadding, setOverflowPadding] = useState<number>(0);
  const { lg } = useMedia();
  const padding: Property.Padding = useMemo(
    () => (lg ? `0 calc(32px + ${overflowPadding}px)` : `0 20px`),
    [overflowPadding, lg],
  );

  const calculateOverflowPadding = useCallback(() => {
    const { clientWidth } = document.documentElement;

    if (clientWidth <= 1920) {
      setOverflowPadding(0);
    } else {
      setOverflowPadding((clientWidth - 1920) / 2);
    }
  }, []);

  useEffect(() => {
    calculateOverflowPadding();
    window.addEventListener('resize', calculateOverflowPadding);
    return () => window.removeEventListener('resize', calculateOverflowPadding);
  }, [calculateOverflowPadding]);

  return { padding };
}
