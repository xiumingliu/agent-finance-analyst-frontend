import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // 🔑 Make the app a static export (SWA will serve /out)
  output: 'export',

  // 🖼️ If you use next/image without a custom loader during export,
  // set unoptimized so images are emitted as plain <img>.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;