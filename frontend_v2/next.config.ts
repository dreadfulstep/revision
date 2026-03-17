import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.discordapp.com",
      },
      {
        hostname: "avatars.githubusercontent.com"
      }
    ],
  },
};

export default nextConfig;
