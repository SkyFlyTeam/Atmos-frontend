import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/photon/:path*',
        destination: 'https://photon.komoot.io/:path*',
      },
    ];
  },
};

export default nextConfig;
