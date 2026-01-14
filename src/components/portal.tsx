'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IS_SERVER } from 'swr/_internal';

type Props = {
  children: ReactNode;
};

const Portal = ({ children }: Props) => {
  const node = IS_SERVER ? null : document.querySelector('#next-app-portal');

  if (node) return createPortal(children, node);

  return null;
};

export default Portal;
