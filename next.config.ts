// next.config.mjs (অথবা .js/.ts)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true, (আপনার অন্যান্য কনফিগ)
  
  // এই অংশটি যোগ করুন
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // আপনার ইমেজ হোস্টের ডোমেইন
      },
      // আপনি যদি অন্য হোস্ট (যেমন efoodis.com) ব্যবহার করেন, সেটিও যোগ করুন
      {
        protocol: 'https',
        hostname: 'efoodis.com',
      },
      // ... (অন্যান্য ডোমেইন)
    ],
  },
};

export default nextConfig;