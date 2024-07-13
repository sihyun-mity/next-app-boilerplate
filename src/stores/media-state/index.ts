import { atom } from 'recoil';
import { MEDIA_STATE_DEFAULT_VALUE } from '@/stores/media-state/media-state.constant';
import { MediaStateEntity } from '@/stores/media-state/media-state.type';

export const mediaState = atom<MediaStateEntity>({
  key: 'mediaState',
  default: MEDIA_STATE_DEFAULT_VALUE,
});
