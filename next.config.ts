import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly — an unrelated package-lock.json
  // in a parent directory was causing Turbopack to warn and guess.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
