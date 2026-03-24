'use client';

import { create } from 'zustand';
import { MobileStore } from '.';

export * from './index.type';

export const useMobileStore = create<MobileStore>()((set) => ({
  isMobile: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),

  isAndroid: false,
  setIsAndroid: (isAndroid: boolean) => set({ isAndroid }),

  isIOS: false,
  setIsIOS: (isIOS: boolean) => set({ isIOS }),

  isReady: false,
  setIsReady: (isReady: boolean) => set({ isReady }),
}));
