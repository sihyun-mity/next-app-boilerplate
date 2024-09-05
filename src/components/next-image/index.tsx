import { type CSSProperties, RefObject, useId, useMemo } from 'react';
import type { Property } from 'csstype';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import styles from './index.module.scss';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

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
  containerRef?: RefObject<HTMLDivElement> | null;
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
  ...props
}: Props) => {
  const componentId = useId();
  const imageId = `next-image-${componentId}`;
  const isRemoteImage = useMemo(() => typeof src === 'string' && src.startsWith('http'), [src]);
  const style: CSSProperties = useMemo(() => {
    const obj: CSSProperties = { objectFit, ...imageStyle };
    if (!fill) {
      obj.width = width;
      obj.height = height;
    }
    return obj;
  }, [fill, height, imageStyle, objectFit, width]);
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
      id={imageId}
      className={imageClass}
      unoptimized={unoptimized !== undefined ? unoptimized : isRemoteImage}
      placeholder="blur"
      blurDataURL={
        isRemoteImage
          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP89h8AAvEB93wyFi8AAAAASUVORK5CYII='
          : undefined
      }
      draggable={draggable}
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

export default Index;
