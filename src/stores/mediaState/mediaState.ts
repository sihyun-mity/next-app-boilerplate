import { atom } from 'recoil';
import { IMediaState } from '@/stores/mediaState/mediaState.type';
import { MEDIA_STATE_DEFAULT_VALUE } from '@/stores/mediaState/mediaState.constant';

export const mediaState = atom<IMediaState>({
  key: 'mediaState',
  default: MEDIA_STATE_DEFAULT_VALUE,
});
