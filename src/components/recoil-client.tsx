'use client';

import { RecoilRoot } from 'recoil';
import { ReactNode } from 'react';

export default function RecoilClient({ children }: { children: ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
