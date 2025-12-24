import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Support for glassmorphism and CSS-in-JS
  compiler: {
    styledComponents: false,
  },
};

export default nextConfig;
