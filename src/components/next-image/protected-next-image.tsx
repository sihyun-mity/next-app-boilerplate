import { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils';
import { OriginNextImage } from '@/components';

/**
 * A React component that wraps the `NextImage` component,
 * applying copy anti-logic
 */
export function ProtectedNextImage({
  className,
  ...props
}: Readonly<ComponentProps<typeof OriginNextImage>>): ReactNode {
  return (
    <OriginNextImage
      {...props}
      className={cn(className, '[-webkit-touch-callout: none] pointer-events-none select-none')}
      draggable={false}
    />
  );
}
