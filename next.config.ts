// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... আপনার অন্যান্য কনফিগারেশন ...
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com', // <-- এটি যোগ করুন
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // <-- এটি যোগ করুন
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'efoodis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.stockcake.com',
      },
      {
        protocol: 'https',
        hostname: 'pin.it', // <-- Pinterest URL Shortener
      },
      // ... অন্যান্য ডোমেইন ...
    ],
  },
};

export default nextConfig;