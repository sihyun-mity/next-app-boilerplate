'use client';

import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { isMobileState } from '@/stores';

const Desktop = ({ children }: { children: ReactNode }) => {
  const isMobile = useRecoilValue(isMobileState);

  return isMobile ? <></> : children;
};

export default Desktop;
