import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [100, 75],
    remotePatterns: [
      { hostname: "flagcdn.com" },
      { hostname: "upload.wikimedia.org" },
      { hostname: "nigerianbanks.xyz" },
      { hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
