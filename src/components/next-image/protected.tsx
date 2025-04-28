import OriginNextImage from './next-image';
import classNames from 'classnames';
import { ComponentProps, ReactNode } from 'react';

/**
 * A React component that wraps the `NextImage` component,
 * applying copy anti-logic
 */
export default function Protected({ imageClass, ...props }: ComponentProps<typeof OriginNextImage>): ReactNode {
  return (
    <OriginNextImage
      {...props}
      imageClass={classNames(imageClass, '[-webkit-touch-callout: none] pointer-events-none select-none')}
      draggable={false}
    />
  );
}
