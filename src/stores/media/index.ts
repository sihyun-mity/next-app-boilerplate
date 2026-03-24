'use client';

import { create } from 'zustand';
import { MEDIA_STORE_DEFAULT_VALUE, MediaStore } from '.';

export * from './index.type';
export * from './index.constants';

export const useMediaStore = create<MediaStore>()((set) => ({
  ...MEDIA_STORE_DEFAULT_VALUE,
  setMedia: (media) => set({ ...media }),
}));
