'use client';

import { ReactNode, useLayoutEffect } from 'react';
import MobileDetect from 'mobile-detect';
import { useSetRecoilState } from 'recoil';
import { isMobileState } from '@/stores';

const MobileDetector = ({ children }: { children: ReactNode }) => {
  const setIsMobile = useSetRecoilState(isMobileState);

  useLayoutEffect(() => {
    const userAgent = new MobileDetect(window.navigator.userAgent),
      isMobile = !!userAgent.mobile();
    setIsMobile(isMobile);
  }, [setIsMobile]);

  return children;
};

export default MobileDetector;
