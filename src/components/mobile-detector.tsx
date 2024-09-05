'use client';

import { ReactNode, useLayoutEffect } from 'react';
import MobileDetect from 'mobile-detect';
import { useMobileStore } from '@/stores';

const MobileDetector = ({ children }: { children: ReactNode }) => {
  const { setIsMobile } = useMobileStore();

  useLayoutEffect(() => {
    const userAgent = new MobileDetect(window.navigator.userAgent),
      isMobile = !!userAgent.mobile();
    setIsMobile(isMobile);
  }, [setIsMobile]);

  return children;
};

export default MobileDetector;
