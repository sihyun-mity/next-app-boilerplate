import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
