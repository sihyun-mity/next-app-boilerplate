'use client';

import { ReactNode } from 'react';
import { useMedia } from '@/hooks';

const LargeView = ({ children }: { children: ReactNode }) => {
  const { lg } = useMedia();

  return lg ? children : <></>;
};

export default LargeView;
