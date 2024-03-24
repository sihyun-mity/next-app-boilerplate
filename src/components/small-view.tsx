'use client';

import { ReactNode } from 'react';
import { useMedia } from '@/hooks';

const SmallView = ({ children }: { children: ReactNode }) => {
  const { sm } = useMedia();

  return sm ? children : <></>;
};

export default SmallView;
