import { Metadata } from 'next';

export function staticMetadata(meta: Metadata) {
  return { ...meta, title: `${meta.title}` };
}
