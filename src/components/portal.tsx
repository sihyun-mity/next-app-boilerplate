'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: ReactNode;
};

const Portal = ({ children }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const node = mounted ? document?.querySelector('#next-app-portal') : null;

  if (mounted && node) {
    return createPortal(children, node);
  }

  return null;
};

export default Portal;
