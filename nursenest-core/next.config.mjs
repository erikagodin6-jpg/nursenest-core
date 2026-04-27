/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

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
