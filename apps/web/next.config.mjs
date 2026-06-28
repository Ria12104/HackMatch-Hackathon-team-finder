/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
