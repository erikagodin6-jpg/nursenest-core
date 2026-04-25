import { createRequire } from "module";
import os from "node:os";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import { CACHE_HEADER_HOME_STATS, CACHE_HEADER_PUBLIC_LIST } from "./src/lib/cache/public-edge-cache-headers";
import { CORE_HOSTED_MARKETING_LOCALES } from "./src/lib/i18n/marketing-locale-policy";

function cacheControlFromHeadersInit(h: HeadersInit): string {
  if (h && typeof h === "object" && !Array.isArray(h) && "Cache-Control" in h) {
    return String((h as { "Cache-Control": string })["Cache-Control"]);
  }
  throw new Error("next.config headers: expected Cache-Control on HeadersInit");
}

const monorepoRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

function resolveBuildWebpackParallelism(): number {
  const raw = process.env.BUILD_WEBPACK_PARALLELISM?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 2;
  if (!Number.isFinite(parsed) || parsed < 1) return 2;
  return Math.min(parsed, Math.max(2, os.cpus().length));
}

const effectiveParallelism = resolveBuildWebpackParallelism();

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  output: "standalone",

  turbopack: {
    root: monorepoRoot,
  },

  outputFileTracingRoot: monorepoRoot,

  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nursenest-images.tor1.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nursenest-images.tor1.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.nursenest.ca",
        pathname: "/**",
      },
    ],
  },

  env: {
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "true",
  },

  experimental: {
    cpus: effectiveParallelism,
    memoryBasedWorkersCount: false,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    externalDir: true,
  },

  /**
   * 🔥 CRITICAL FIX:
   * Disables broken Webpack minifier causing:
   * "WebpackError is not a constructor"
   */
  webpack: (config, { isServer }) => {
    config.parallelism = effectiveParallelism;

    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.minimize = false;
    }

    return config;
  },

  async redirects() {
    return [
      {
        source: "/med-math",
        destination: "/tools/med-math",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      ...CORE_HOSTED_MARKETING_LOCALES.map((loc) => ({
        source: `/${loc}/terms-of-service`,
        destination: `/${loc}/terms`,
        permanent: true,
      })),
      {
        source: "/institutions",
        destination: "/for-institutions",
        permanent: true,
      },
      {
        source: "/schools",
        destination: "/for-institutions",
        permanent: true,
      },
    ];
  },

  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/api/public/home-stats",
        headers: [{ key: "Cache-Control", value: cacheControlFromHeadersInit(CACHE_HEADER_HOME_STATS) }],
      },
      {
        source: "/api/public/flashcard-tags",
        headers: [{ key: "Cache-Control", value: cacheControlFromHeadersInit(CACHE_HEADER_PUBLIC_LIST) }],
      },
    ];
  },
};

export default nextConfig;