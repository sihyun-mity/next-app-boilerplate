export type MobileStore = MobileStoreGetter & MobileStoreSetter;

export type MobileStoreGetter = {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isReady: boolean;
};

export type MobileStoreSetter = {
  setIsMobile: (isMobile: boolean) => void;
  setIsAndroid: (isAndroid: boolean) => void;
  setIsIOS: (isIOS: boolean) => void;
  setIsReady: (isReady: boolean) => void;
};
