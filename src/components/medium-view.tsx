'use client';

import { ReactNode } from 'react';
import { useMedia } from '@/hooks';

const MediumView = ({ children }: { children: ReactNode }) => {
  const { md } = useMedia();

  return md ? children : <></>;
};

export default MediumView;
