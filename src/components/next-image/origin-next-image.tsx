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

/** `56` / `'56px'` 처럼 px 로 확정되는 길이만 숫자로 해석 — `'100%'`·`'auto'`·`calc()` 는 undefined. */
const toPxLength = (value: Property.Width | Property.Height | number | undefined): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const parsed = Number(/^\s*(\d+(?:\.\d+)?)px\s*$/.exec(value)?.[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/** 그려지는 이미지 폭이 박스 폭을 넘지 않는 objectFit — 이때만 박스 폭이 디코딩 폭의 상한이 된다. */
const isWidthBoundedFit = (objectFit: Property.ObjectFit): boolean =>
  objectFit === 'contain' || objectFit === 'scale-down';

/**
 * 디코딩 해상도 힌트인 `sizes` 를 컴포넌트가 이미 받은 박스 크기 props 에서 유도한다.
 *
 * 디코딩 비트맵 RAM 은 `폭 × 높이 × 4B` 이고, `sizes` 가 없거나 무효면 브라우저는 srcset 후보를
 * **뷰포트 폭** 기준으로 고른다 — 44px 아이콘도 DPR3 기기에서 1200px 로 디코딩된다(동일 srcset
 * 에서 `sizes="44px"` 는 96px, `sizes="100%"`(무효값 → `100vw` 폴백) 는 750px @DPR2·375px 뷰포트
 * = 면적 61 배). 호출부마다 손으로 `sizes` 를 다는 대신 여기서 유도한다.
 *
 * **유도하지 않고 폴백 `sizes="100%"` 를 그대로 두는 경우 (의도된 보수적 동작):**
 * - 박스 폭이 px 로 확정되지 않는 경우. 특히 `width`/`height` 없이 `responsiveRatio` 만 주는
 *   반응형 채움 모드는 실제 폭을 부모가 정하므로 컴포넌트가 알 수 없다 — 여기서 폭을 잘못
 *   좁히면 이미지가 저해상도로 깨진다. **폭 근거가 없으면 손대지 않는다** 가 제1 원칙.
 * - `objectFit` 이 `cover`/`fill`/`none` 인데 높이를 모르는 경우. 이들은 박스보다 넓게 확대돼
 *   그려질 수 있어 박스 폭이 상한이 아니다. 높이까지 확정될 때만 긴 변으로 유도한다.
 */
const deriveSizesFromBox = ({
  width,
  height,
  maxWidth,
  maxHeight,
  objectFit,
}: {
  width: Property.Width | number;
  height: Property.Height | number;
  maxWidth: Property.MaxWidth | number | undefined;
  maxHeight: Property.MaxHeight | number | undefined;
  objectFit: Property.ObjectFit;
}): string | undefined => {
  const widthCap = toPxLength(maxWidth);
  const boxWidth = toPxLength(width) ?? widthCap;
  if (boxWidth === undefined) return undefined;

  const slotWidth = widthCap === undefined ? boxWidth : Math.min(boxWidth, widthCap);
  if (isWidthBoundedFit(objectFit)) return `${Math.ceil(slotWidth)}px`;

  const boxHeight = toPxLength(height) ?? toPxLength(maxHeight);
  if (boxHeight === undefined) return undefined;
  return `${Math.ceil(Math.max(slotWidth, boxHeight))}px`;
};

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
  containerClassName?: string;
  containerStyle?: CSSProperties;
  imageBoxClassName?: string;
  imageBoxStyle?: CSSProperties;
  imageStyle?: CSSProperties;
  onClick?: () => void;
  containerRef?: RefObject<HTMLDivElement | null> | null;
  fallbackAspectRatio?: 'square' | 'landscape';
  fallbackSrc?: ComponentProps<typeof Image>['src'] | null;
};

/**
 * `next/image` 를 감싸 컨테이너 + 박스 + 이미지 3 단 구조를 자동 구성하는 이미지 컴포넌트.
 *
 * 주요 동작
 * - `responsiveRatio` (예: `'56.25%'`) 가 주어지면 자동으로 `fill` 모드 + `padding-bottom` 트릭으로
 *   가로:세로 비율을 유지한다.
 * - `width`/`height` 는 `Property.Width`/`Property.Height` 타입을 받으므로 `'100%'`, `'auto'`,
 *   숫자(px) 등 CSS 값이 모두 가능하다.
 * - `src` 가 없거나 로드에 실패하면 `fallbackSrc` 또는 비율별 기본 이미지를 시도한다 (`fallbackAspectRatio`).
 *   기본 이미지는 프로젝트에 추가한 뒤 import 해서 활성화하도록 주석으로 표시되어 있다.
 * - 외부 URL(`http`), 절대 경로(`/...`), 로컬 SVG, blob URL 처럼 `next/image` 의 blur placeholder 가
 *   적용되지 않는 케이스는 자동으로 `placeholder='empty'` 로 강제된다.
 * - 외부 URL 은 기본적으로 `unoptimized` 가 활성화된다 (호출 측에서 명시적으로 덮어쓸 수 있음).
 * - `sizes` 를 주지 않아도 `width`/`maxWidth` 가 px 로 확정되면 슬롯 폭으로 `sizes` 를 자동
 *   유도해 과대 디코딩을 막는다 (`deriveSizesFromBox`). 정확한 값을 알고 있거나 부모가 폭을
 *   정하는 경우엔 `sizes` 를 직접 넘기면 그것이 우선한다.
 *
 * 일반적인 페이지 이미지에는 이 컴포넌트를, 우클릭/드래그 저장을 막아야 하는 이미지에는
 * `NextImage.Protected` (`ProtectedNextImage`) 를 사용한다.
 */
export function OriginNextImage({
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
  containerClassName,
  containerStyle,
  imageBoxClassName,
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
  sizes,
  ...props
}: Readonly<Props>): ReactNode {
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
  const isBlobImage = typeof renderSrc === 'string' && renderSrc.startsWith('blob:');
  const isUnsupportedPlaceholder = isRemoteImage || isPathImage || isLocalSvgImage || isBlobImage;

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      setIsError(true);
      onError?.(e);
    },
    [onError]
  );

  // 호출부가 명시한 sizes 가 항상 우선. 없으면 박스 크기에서 유도하고, 유도 근거가 없으면
  // 폴백 `100%` 를 유지한다 (deriveSizesFromBox 주석의 폴백 원칙 참고).
  //
  // 폴백은 반드시 `100%` 문자열이어야 한다 — 무효값이라 브라우저는 `100vw` 로 폴백하지만,
  // Next 의 getWidths 는 sizes 문자열에 `vw` 가 매치될 때만 srcset 후보를 deviceSizes[0](640)
  // 이상으로 필터한다. 실제로 `100vw` 를 적어 넣으면 16~384px 후보가 사라져 작은 아이콘이
  // 오히려 악화된다.
  const resolvedSizes = sizes ?? deriveSizesFromBox({ width, height, maxWidth, maxHeight, objectFit }) ?? '100%';

  const element = renderSrc ? (
    <Image
      src={renderSrc}
      alt={alt}
      width={fill ? undefined : 0}
      height={fill ? undefined : 0}
      style={style}
      fill={fill}
      sizes={resolvedSizes}
      className={cn({ 'bg-gray-300': isError }, className)}
      unoptimized={unoptimized !== undefined ? unoptimized : isRemoteImage}
      placeholder={isUnsupportedPlaceholder ? 'empty' : placeholder}
      quality={quality}
      onError={handleError}
      {...props}
    />
  ) : null;

  if (!renderSrc) return null;

  return (
    <div
      className={containerClassName}
      style={{ width, height, maxWidth, maxHeight, minWidth, minHeight, ...containerStyle }}
      onClick={onClick}
      ref={containerRef}
    >
      <div
        className={cn('relative h-full w-full', imageBoxClassName)}
        style={{ paddingBottom: responsiveRatio, ...imageBoxStyle }}
      >
        {responsiveRatio ? <picture className="absolute top-0 left-0 h-full w-full">{element}</picture> : element}
      </div>
    </div>
  );
}
