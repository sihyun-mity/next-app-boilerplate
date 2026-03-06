'use client';

import Image, { type ImageProps, StaticImageData } from 'next/image';
import {
  ComponentProps,
  CSSProperties,
  ReactNode,
  RefObject,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import type { Property } from 'csstype';
import { cn } from '@/utils';

type Props = Omit<ImageProps, 'width' | 'height' | 'src' | 'alt' | 'objectFit'> & {
  width?: Property.Width | number;
  height?: Property.Height | number;
  maxWidth?: Property.MaxWidth | number;
  maxHeight?: Property.MaxHeight | number;
  minWidth?: Property.MinWidth | number;
  minHeight?: Property.MinHeight | number;
  responsiveRatio?: Property.PaddingBottom;
  src?: ComponentProps<typeof Image>['src'];
  alt?: string;
  objectFit?: Property.ObjectFit;
  containerClass?: string;
  containerStyle?: CSSProperties;
  imageBoxClass?: string;
  imageBoxStyle?: CSSProperties;
  imageStyle?: CSSProperties;
  onClick?: () => void;
  containerRef?: RefObject<HTMLDivElement | null> | null;
  fallbackAspectRatio?: 'square' | 'landscape';
  fallbackSrc?: ComponentProps<typeof Image>['src'] | null;
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
  imageBoxStyle,
  imageStyle,
  className,
  fill = !!responsiveRatio,
  unoptimized,
  onClick,
  containerRef,
  placeholder = 'blur',
  quality = 100,
  onError,
  fallbackAspectRatio = 'square',
  fallbackSrc,
  ...props
}: Props): ReactNode {
  const isRemoteOriginImage = typeof src === 'string' && src.startsWith('http');
  const [isError, setIsError] = useState<boolean>(!src);

  const style: CSSProperties = useMemo(() => {
    const obj: CSSProperties = { objectFit: isError ? 'contain' : objectFit, ...imageStyle };
    if (!fill) {
      obj.width = width;
      obj.height = height;
    }
    return obj;
  }, [fill, height, imageStyle, isError, objectFit, width]);

  const renderSrc = useMemo(() => {
    if (!isError) return src;

    // 이미지 오류 시 처리
    if (fallbackSrc) {
      return fallbackSrc; // 지정된 Fallback 이미지 로드, 필요시 이미지 추가 후 사용
    } else if (fallbackAspectRatio === 'square') {
      // return fallbackSquare; // 정사각형 Fallback 이미지 로드, 필요시 이미지 추가 후 사용
      return fallbackSrc;
    } else if (fallbackAspectRatio === 'landscape') {
      // return fallbackLandscape; // 가로 직사각형 Fallback 이미지 로드, 필요시 이미지 추가 후 사용
      return fallbackSrc;
    }
  }, [fallbackAspectRatio, fallbackSrc, isError, src]);

  const isRemoteImage = typeof renderSrc === 'string' && renderSrc.startsWith('http');
  const isPathImage = typeof renderSrc === 'string' && renderSrc.startsWith('/');
  const isLocalSvgImage =
    (typeof renderSrc !== 'string' && !!(renderSrc as StaticImageData)?.src?.endsWith?.('svg')) ||
    (typeof renderSrc === 'string' && !renderSrc.startsWith('http') && renderSrc.endsWith('svg'));

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      setIsError(true);
      onError?.(e);
    },
    [onError]
  );

  const element = renderSrc ? (
    <Image
      src={renderSrc}
      alt={alt}
      width={fill ? undefined : 0}
      height={fill ? undefined : 0}
      style={style}
      fill={fill}
      sizes="100%"
      className={cn({ 'bg-gray-300': isError }, className)}
      unoptimized={unoptimized !== undefined ? unoptimized : isRemoteImage}
      placeholder={isRemoteImage || isPathImage || isLocalSvgImage ? 'empty' : placeholder}
      quality={quality}
      onError={handleError}
      {...props}
    />
  ) : null;

  if (!renderSrc) return null;

  return (
    <div
      className={containerClass}
      style={{ width, height, maxWidth, maxHeight, minWidth, minHeight, ...containerStyle }}
      onClick={onClick}
      ref={containerRef}
    >
      <div
        className={cn('relative h-full w-full', imageBoxClass)}
        style={{ paddingBottom: responsiveRatio, ...imageBoxStyle }}
      >
        {responsiveRatio ? <picture className="absolute top-0 left-0 h-full w-full">{element}</picture> : element}
      </div>
    </div>
  );
}
