import { createRequire } from "module";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import {
  CACHE_HEADER_HOME_STATS,
  CACHE_HEADER_PUBLIC_LIST,
} from "./src/lib/cache/public-edge-cache-headers";
import { CORE_HOSTED_MARKETING_LOCALES } from "./src/lib/i18n/marketing-locale-policy";

function cacheControlFromHeadersInit(h: HeadersInit): string {
  if (h && typeof h === "object" && !Array.isArray(h) && "Cache-Control" in h) {
    return String((h as { "Cache-Control": string })["Cache-Control"]);
  }
  throw new Error("next.config headers: expected Cache-Control on HeadersInit");
}

const monorepoRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

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

  /**
   * Keep this minimal and stable — no forced worker hacks
   */
  experimental: {
    cpus: 2,
    memoryBasedWorkersCount: false,
    webpackBuildWorker: false,
    externalDir: true,
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
        headers: [
          {
            key: "Cache-Control",
            value: cacheControlFromHeadersInit(CACHE_HEADER_HOME_STATS),
          },
        ],
      },
      {
        source: "/api/public/flashcard-tags",
        headers: [
          {
            key: "Cache-Control",
            value: cacheControlFromHeadersInit(CACHE_HEADER_PUBLIC_LIST),
          },
        ],
      },
    ];
  },
};

export default nextConfig;