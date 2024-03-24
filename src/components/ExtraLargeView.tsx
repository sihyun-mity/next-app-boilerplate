'use client';

import { ReactNode } from 'react';
import { useMedia } from '@/hooks';

const ExtraLargeView = ({ children }: { children: ReactNode }) => {
  const { xl } = useMedia();

  return xl ? children : <></>;
};

export default ExtraLargeView;
