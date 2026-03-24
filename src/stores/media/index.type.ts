export type MediaStore = MediaStoreGetter & MediaStoreSetter;

export type MediaStoreGetter = {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
};

export type MediaStoreSetter = {
  setMedia: (media: Partial<MediaStoreGetter>) => void;
};
