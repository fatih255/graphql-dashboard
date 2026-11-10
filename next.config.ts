import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the project root so a lockfile in a parent folder isn't picked up.
  outputFileTracingRoot: import.meta.dirname,
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
