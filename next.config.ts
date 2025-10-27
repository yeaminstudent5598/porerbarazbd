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
        hostname: 'efoodis.com',
        port: '',
        pathname: '/**',
      },
      // ... অন্যান্য ডোমেইন ...
    ],
  },
};

export default nextConfig;