/** @type {import('next').NextConfig} */
// `ci:verify` runs `npm run typecheck` before `next build`. Skipping the second integrated pass
// avoids a large RSS spike after webpack on memory-tight hosts (OOM during "Linting and checking…").
// Production image / DO builds must not set `SKIP_NEXT_BUILD_TYPECHECK` unless you run typecheck separately.
const skipNextBuildTypecheck = process.env.SKIP_NEXT_BUILD_TYPECHECK === "1";

const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: skipNextBuildTypecheck,
  },

  experimental: {
    // Fewer workers → lower peak RSS during `next build` (helps 8GiB VMs avoid OOM kills).
    cpus: 1,
    externalDir: true,
  },

  webpack: (config) => {
    // Default parallelism can spike memory; cap so native allocations + V8 heap fit small hosts.
    config.parallelism = 1;
    return config;
  },
};

export default nextConfig;
