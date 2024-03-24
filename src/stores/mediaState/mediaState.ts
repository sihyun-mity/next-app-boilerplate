import { atom } from 'recoil';
import { MEDIA_STATE_DEFAULT_VALUE } from '@/stores/mediaState/mediaState.constant';
import { IMediaState } from '@/stores';

export const mediaState = atom<IMediaState>({
  key: 'mediaState',
  default: MEDIA_STATE_DEFAULT_VALUE,
});
