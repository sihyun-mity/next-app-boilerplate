import { useMediaQuery } from 'usehooks-ts';
import { useCallback, useLayoutEffect } from 'react';
import { useRecoilState } from 'recoil';
import { mediaState } from '@/stores';

const useMedia = () => {
  const smQuery = useMediaQuery('(min-width: 640px)');
  const mdQuery = useMediaQuery('(min-width: 768px)');
  const lgQuery = useMediaQuery('(min-width: 1024px');
  const xlQuery = useMediaQuery('(min-width: 1280px)');
  const [media, setMedia] = useRecoilState(mediaState);
  const { sm, md, lg, xl } = media;

  const updateMediaState = useCallback(
    () => setMedia({ sm: smQuery, md: mdQuery, lg: lgQuery, xl: xlQuery }),
    [setMedia, smQuery, mdQuery, lgQuery, xlQuery],
  );

  useLayoutEffect(updateMediaState, [updateMediaState]);

  return { sm, md, lg, xl };
};

export default useMedia;
