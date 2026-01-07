'use client';

import { type RefObject, useCallback } from 'react';

interface Props {
  focusedRef: RefObject<HTMLElement | null>;
  parentRef: RefObject<HTMLElement | null>;
  scrollOffset?: number;
  initialScroll?: boolean;
}

export default function useFocusScroll({ focusedRef, parentRef, scrollOffset = 0, initialScroll }: Props) {
  const scroll = useCallback(
    (behavior?: ScrollBehavior) => {
      if (parentRef.current && focusedRef.current) {
        const startPadding = parseInt(getComputedStyle(parentRef.current).paddingLeft);
        const targetPosition = focusedRef.current.offsetLeft;

        // 첫번째 노드 예외 처리
        if (startPadding === targetPosition && parentRef.current.scrollLeft === 0) {
          return;
        }

        const targetOffset = targetPosition - scrollOffset;
        const currentOffset = parentRef.current.scrollLeft;
        const moveOffset = Math.abs(targetOffset - currentOffset);

        parentRef.current.scrollTo({
          left: targetOffset,
          behavior: (behavior ?? moveOffset > document.documentElement.clientWidth) ? 'instant' : 'smooth',
        });
      }
    },
    [focusedRef, parentRef, scrollOffset],
  );

  if (typeof window !== 'undefined' && initialScroll) {
    // Paint 완료 후 실행
    // useEffect로 실행 시 긴 스크롤 위치를 찾아가지 못하는 문제있음
    // eslint-disable-next-line react-hooks/immutability
    window.onload = () => scroll();
  }

  return { scroll };
}
