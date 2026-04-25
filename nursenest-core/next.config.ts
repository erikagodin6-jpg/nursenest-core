import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  reactStrictMode: true,

  experimental: {
    cpus: 2,
    externalDir: true,
  },

  // REMOVE ALL OF THESE (they are breaking your build):
  // swcMinify ❌ (removed in Next 15)
  // webpackBuildWorker ❌
  // memoryBasedWorkersCount ❌

  webpack: (config, { isServer }) => {
    // SAFETY: do not override Next internals
    return config;
  },
};

export default nextConfig;
