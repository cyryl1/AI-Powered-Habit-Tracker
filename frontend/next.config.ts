import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rewrites are useful for local development to avoid CORS issues if not using the full URL.
  // In production, we typically use the NEXT_PUBLIC_API_URL environment variable directly.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api/v1/', '')}/api/:path*` 
          : "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
