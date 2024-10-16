/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true
  },
  images: {
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;
