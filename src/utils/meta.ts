import { Metadata } from 'next';

export function staticMetadata(meta: Metadata) {
  return { ...meta, title: `${meta.title}` };
}

export const shareCurrentPage = async () => {
  const data: ShareData = { title: document.title, url: window.location.href };
  if (!!navigator?.share && navigator?.canShare?.(data)) {
    try {
      await navigator.share(data);
    } catch (err) {
      console.error(err);
    }
  }
};
