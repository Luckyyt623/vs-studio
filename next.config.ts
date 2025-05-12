
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       { // Added for potential local assets or future dev needs
        protocol: 'http',
        hostname: 'localhost',
        port: '9002', // Match your dev server port if needed
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

    