'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: ReactNode;
};

const Portal = ({ children }: Props) => {
  const node = document?.querySelector('#next-app-portal');

  if (node) return createPortal(children, node);

  return null;
};

export default Portal;
