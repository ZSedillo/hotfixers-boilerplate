import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase limit to 10MB
    },
  },
  // Allow external images from Supabase and Placehold.co
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.supabase.co" }, 
    ],
  },
};

export default nextConfig;