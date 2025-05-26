import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(process.env.NODE_ENV === 'production' ? { allow: '/' } : { disallow: '/' }),
    },
  };
}
