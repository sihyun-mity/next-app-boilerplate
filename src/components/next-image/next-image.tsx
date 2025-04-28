import Image, { type ImageProps, StaticImageData } from 'next/image';
import { CSSProperties, ReactNode, RefObject } from 'react';
import styles from './next-image.module.scss';
import type { Property } from 'csstype';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type Props = Omit<ImageProps, 'width' | 'height' | 'src' | 'alt' | 'objectFit'> & {
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
};

export default function NextImage({
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
  unoptimized,
  onClick,
  containerRef,
  placeholder = 'blur',
  quality = 100,
  ...props
}: Props): ReactNode {
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
      sizes="100%"
      className={imageClass}
      unoptimized={unoptimized !== undefined ? unoptimized : isRemoteImage}
      placeholder={isLocalSvgImage ? 'empty' : placeholder}
      blurDataURL={
        isRemoteImage || typeof src === 'string'
          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP89h8AAvEB93wyFi8AAAAASUVORK5CYII='
          : undefined
      }
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
}
