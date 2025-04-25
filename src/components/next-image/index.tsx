import { ComponentProps, type CSSProperties, RefObject } from 'react';
import type { Property } from 'csstype';
import type { ImageProps, StaticImageData } from 'next/image';
import Image from 'next/image';
import styles from './index.module.scss';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import classNames from 'classnames';

interface Props extends Omit<ImageProps, 'width' | 'height' | 'src' | 'alt' | 'objectFit'> {
  width?: Property.Width | number;
  height?: Property.Height | number;
  maxWidth?: Property.MaxWidth | number;
  maxHeight?: Property.MaxHeight | number;
  minWidth?: Property.MinWidth | number;
  minHeight?: Property.MinHeight | number;
  responsiveRatio?: Property.PaddingBottom;
  src?: string | StaticImport;
  alt?: string;
  objectFit?: Property.ObjectFit;
  containerClass?: string;
  containerStyle?: CSSProperties;
  imageBoxClass?: string;
  imageClass?: string;
  imageStyle?: CSSProperties;
  onClick?: () => void;
  containerRef?: RefObject<HTMLDivElement | null> | null;
}

const Index = ({
  width = '100%',
  height = 'auto',
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  responsiveRatio,
  objectFit = 'contain',
  src,
  alt = '',
  containerClass,
  containerStyle,
  imageBoxClass,
  imageClass,
  imageStyle,
  fill = !!responsiveRatio,
  priority = false,
  unoptimized,
  onClick,
  containerRef,
  draggable = false,
  placeholder = 'blur',
  quality = 100,
  ...props
}: Props) => {
  const isRemoteImage = typeof src === 'string' && src.startsWith('http');
  const isLocalSvgImage = typeof src !== 'string' && !!(src as StaticImageData)?.src?.endsWith?.('svg');
  const style: CSSProperties = (() => {
    const obj: CSSProperties = { objectFit, ...imageStyle };
    if (!fill) {
      obj.width = width;
      obj.height = height;
    }
    return obj;
  })();
  const element = src ? (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : 0}
      height={fill ? undefined : 0}
      style={style}
      fill={fill}
      priority={priority}
      sizes="100%"
      className={imageClass}
      unoptimized={unoptimized !== undefined ? unoptimized : isRemoteImage}
      placeholder={isLocalSvgImage ? 'empty' : placeholder}
      blurDataURL={
        isRemoteImage || typeof src === 'string'
          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP89h8AAvEB93wyFi8AAAAASUVORK5CYII='
          : undefined
      }
      draggable={draggable}
      quality={quality}
      {...props}
    />
  ) : null;

  if (!src) {
    return null;
  }

  return (
    <div
      className={containerClass}
      style={{ width, height, maxWidth, maxHeight, minWidth, minHeight, ...containerStyle }}
      onClick={onClick}
      ref={containerRef}
    >
      <div className={styles.imageBox} style={{ paddingBottom: responsiveRatio }}>
        {responsiveRatio ? <picture className={styles.responsiveBox}>{element}</picture> : element}
      </div>
    </div>
  );
};

/**
 * A React component that wraps the `NextImage` component,
 * applying copy anti-logic
 */
function Protected({ imageClass, ...props }: ComponentProps<typeof Index>) {
  return (
    <Index
      {...props}
      imageClass={classNames(imageClass, 'select-none pointer-events-none [-webkit-touch-callout: none]')}
    />
  );
}

export default Object.assign(Index, { Protected });
