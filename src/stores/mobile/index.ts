import { create } from 'zustand';

interface MobileStore {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

const useMobileStore = create<MobileStore>()((set) => ({
  isMobile: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
}));

export default useMobileStore;
