import OriginNextImage from './next-image';
import { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils';

/**
 * A React component that wraps the `NextImage` component,
 * applying copy anti-logic
 */
export default function Protected({ className, ...props }: ComponentProps<typeof OriginNextImage>): ReactNode {
  return (
    <OriginNextImage
      {...props}
      className={cn(className, '[-webkit-touch-callout: none] pointer-events-none select-none')}
      draggable={false}
    />
  );
}
