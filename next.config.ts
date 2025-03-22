import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/yearly-analysis",
        permanent: true, // Set to false if it's temporary
      },
    ];
  },
};

export default nextConfig;
