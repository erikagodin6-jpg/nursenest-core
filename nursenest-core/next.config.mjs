/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  experimental: {
    cpus: 2,
    externalDir: true,
  },

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
