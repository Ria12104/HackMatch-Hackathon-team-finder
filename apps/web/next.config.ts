import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // images: {
  //   remotePatterns: [
  //     { protocol: 'https', hostname: 'your-cdn.example.com' },
  //   ],
  // },
};

export default nextConfig;
