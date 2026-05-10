/** @type {import('next').NextConfig} */
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

function envTruthy(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? "").trim());
}

/** `NN_LOW_MEMORY_BUILD=0` opts out of auto low-RAM heuristics (large self-hosted builders). */
function envExplicitlyFalse(name) {
  const v = String(process.env[name] ?? "").trim();
  return v === "0" || /^false$/i.test(v);
}

const totalRamMb = Math.max(512, Math.floor(os.totalmem() / 1024 / 1024));
const packageRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));
const sharedRoot = path.join(workspaceRoot, "shared");
const legacyClientRoot = path.join(workspaceRoot, "client", "src");
/** ~9GiB or less — logged for operators; build concurrency stays fixed low regardless. */
const autoLowMemoryHost = totalRamMb <= 9216;

const lowMemoryOptOut = envExplicitlyFalse("NN_LOW_MEMORY_BUILD");
const isLowMemoryBuild =
  !lowMemoryOptOut &&
  (envTruthy("NN_LOW_MEMORY_BUILD") ||
    envTruthy("CI") ||
    process.env.GITHUB_ACTIONS === "true" ||
    envTruthy("NN_APP_PLATFORM_BUILD") ||
    autoLowMemoryHost);

/**
 * Production Next config: avoid duplicate validation inside `next build`.
 *
 * `next build` runs an integrated "Linting and checking validity of types" pass by default.
 * That duplicates `tsc` + ESLint and can SIGKILL the process on memory-tight builders after compile.
 *
 * `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` below are **safe only because**
 * CI / deploy must run strict checks **before** `npm run build`, in order:
 *   1. `npm run typecheck`
 *   2. `npm run test:reliability` (and any other suites your pipeline requires)
 *   3. then `npm run build`
 *
 * Shortcut for (1)+(2): `npm run validate:prebuild`
 *
 * Note: Next.js 14.2 resolves `next.config.js` / `next.config.mjs` only (not `next.config.ts`).
 */
/** Fixed low parallelism for all environments (local, CI, production compile) — avoids RAM spikes and duplicate workers. */
const webpackParallelism = 1;

function shouldEmitBuildConfigDiagnostics() {
  if (String(process.env.NN_NEXT_BUILD_CONFIG_LOG ?? "").trim() === "0") return false;
  return (
    process.env.npm_lifecycle_event === "build" ||
    (Array.isArray(process.argv) && process.argv.includes("build"))
  );
}

if (shouldEmitBuildConfigDiagnostics()) {
  console.log(
    "[nn-next-build-config]",
    JSON.stringify({
      lowMemoryHeuristic: isLowMemoryBuild,
      totalRamMb,
      autoLowMemoryHost,
      NN_LOW_MEMORY_BUILD: process.env.NN_LOW_MEMORY_BUILD ?? null,
      CI: process.env.CI ?? null,
      GITHUB_ACTIONS: process.env.GITHUB_ACTIONS ?? null,
      NN_APP_PLATFORM_BUILD: process.env.NN_APP_PLATFORM_BUILD ?? null,
      NN_FORCE_SINGLE_BUILD_WORKER: process.env.NN_FORCE_SINGLE_BUILD_WORKER ?? null,
      experimentalCpus: 1,
      webpackParallelism,
      webpackPersistentCache: false,
      webpackBuildWorker: false,
      workerThreads: false,
      memoryBasedWorkersCount: false,
      parallelServerCompiles: false,
      parallelServerBuildTraces: false,
      experimentalStaticGenerationMaxConcurrency: 1,
      skipNextIntegratedLintAndTypes: true,
    }),
  );
}

const experimental = {
  externalDir: true,
  cpus: 1,
  /** Prevents Next from scaling static workers from free RAM (can overshoot on small VMs). */
  memoryBasedWorkersCount: false,
  parallelServerCompiles: false,
  parallelServerBuildTraces: false,
  workerThreads: false,
  /** Next 16 reads this under `experimental` (see `next/dist/server/config-schema.js`). */
  staticGenerationMaxConcurrency: 1,
  /**
   * `false`: keep webpack in the main Node process (avoids a second heap during `next build`).
   */
  webpackBuildWorker: false,
};

const nextConfig = {
  output: "standalone",

  /** Legacy crawler bookmarks → single canonical sitemap (avoid duplicate sitemap index signals). */
  async redirects() {
    return [
      { source: "/sitemap-index.xml", destination: "/sitemap.xml", permanent: true },
      /** Legacy allied host bookmarked sitemap → canonical www HTTPS urlset. */
      {
        source: "/sitemap-allied.xml",
        has: [{ type: "host", value: "allied.nursenest.ca" }],
        destination: "https://www.nursenest.ca/sitemap-allied.xml",
        permanent: true,
      },
      /** Production HTTP bookmarks → canonical HTTPS www (requires `x-forwarded-proto` from the edge). */
      {
        source: "/:path*",
        has: [
          { type: "header", key: "x-forwarded-proto", value: "http" },
          { type: "host", value: "www.nursenest.ca" },
        ],
        destination: "https://www.nursenest.ca/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "header", key: "x-forwarded-proto", value: "http" },
          { type: "host", value: "nursenest.ca" },
        ],
        destination: "https://www.nursenest.ca/:path*",
        permanent: true,
      },
      /** RN blog hub canonical path is `/blog/rn/*` (lesson-derived SEO posts). */
      { source: "/nursing/rn/blog", destination: "/blog/rn", permanent: true },
      { source: "/nursing/rn/blog/:slug", destination: "/blog/rn/:slug", permanent: true },
      /** Allied Health: single global marketing pathway (no country segment). */
      { source: "/us/allied/allied-health", destination: "/allied/allied-health", permanent: true },
      { source: "/us/allied/allied-health/:path*", destination: "/allied/allied-health/:path*", permanent: true },
      { source: "/canada/allied/allied-health", destination: "/allied/allied-health", permanent: true },
      { source: "/canada/allied/allied-health/:path*", destination: "/allied/allied-health/:path*", permanent: true },
    ];
  },

  /**
   * do not set a blanket `no-store` on all `/api/*` — authenticated routes set their own Cache-Control;
   * marketing JSON under `/api/public/*` is allowed to edge-cache.
   *
   * no blanket `/api/*` Cache-Control rule; route handlers own other `/api/*` policies.
   */
  async headers() {
    return [
      {
        source: "/fr",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, follow",
          },
        ],
      },
      {
        source: "/fr/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, follow",
          },
        ],
      },
      {
        source: "/app",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/app/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/api/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=120, stale-while-revalidate=600",
          },
        ],
      },
      {
        /**
         * Static public assets. Keep this as a single Next-compatible matcher:
         * `/:path*.png` parses as an invalid modified wildcard, while the
         * separate `:assetExt(...)` param constrains only the extension.
         */
        source: "/:path*\\.:assetExt(png|jpg|jpeg|webp|avif|svg|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    qualities: [68, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nursenest-images.tor1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "nursenest-images.tor1.cdn.digitaloceanspaces.com",
      },
    ],
  },

  experimental,

  /**
   * Next 16 defaults `next build` to Turbopack. Keep an explicit turbopack stanza so
   * the plain build command remains valid even while we retain a webpack hook for
   * optional `--webpack` builds and memory tuning on older/explicit webpack paths.
   */
  turbopack: {
    root: packageRoot,
    resolveAlias: {
      "@shared": sharedRoot,
      "@legacy-client": legacyClientRoot,
    },
  },

  webpack: (config, { dev }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@shared": sharedRoot,
      "@legacy-client": legacyClientRoot,
    };
    config.parallelism = webpackParallelism;
    // PackFileCacheStrategy can throw ENOENT under load; disabling persistent cache trims disk + mmap pressure.
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
