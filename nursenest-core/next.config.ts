/**
 * Build context: run `npm run build` from this directory (`nursenest-core`), or set DigitalOcean App Platform
 * **Source directory** to `nursenest-core` so `process.cwd()` and `@shared/*` → `../shared` resolve like local dev.
 *
 * **Disk / TMPDIR:** `package.json` sets `TMPDIR=${TMPDIR:-/tmp}` for `next build` so Turbopack/Next write
 * temp artifacts to a writable path when the default location is full (avoids ENOSPC during `.next` writes).
 * `turbopack.root` / `outputFileTracingRoot` point at the **repo root** (parent of this package), not at
 * `nursenest-core` alone — the latter breaks `@shared/*` resolution; the parent matches the primary lockfile
 * and silences “multiple lockfiles” warnings without changing import paths.
 *
 * **RUN_HEAVY_BUILD_TASKS:** set to `false` to skip loading large redirect/rewrite graphs during `next build`
 * (lower memory — production deploys should set this in CI/build env). See `docs/OPERATOR_DATA_IMPORT_AND_BUILD.md`.
 */
import { fileURLToPath } from "url";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/** Parent of `nursenest-core/` (repo root); avoids `path` in config bundle (fixes ESM load). */
const monorepoRoot = fileURLToPath(new URL("..", import.meta.url));

const runHeavyBuildTasks = process.env.RUN_HEAVY_BUILD_TASKS !== "false";

const legacyMedMathRedirect = {
  source: "/med-math",
  destination: "/tools/med-math",
  permanent: true,
} as const;

/** Matches `/api/marketing-assets/*` success responses and recommended DO Spaces CDN object metadata (see marketing-cdn.catalog.json). */
const STATIC_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable" as const;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  /** Playwright / alternate hosts loading `/_next/*` in dev (default blocks cross-origin). */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
  images: {
    /** Long TTL for `/_next/image` output; uses max(this, upstream Cache-Control) per Next image optimizer. */
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
  // Auth.js reads AUTH_TRUST_HOST in proxied environments (e.g. DigitalOcean).
  // Ensures UntrustedHost does not occur if platform env is missing at deploy time.
  env: {
    // Use || so empty string (often set by hosts with no value) defaults to trusted.
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "true",
    NEXT_PUBLIC_SENTRY_ENABLED: process.env.SENTRY_ENABLED === "true" ? "true" : "",
  },
  // Allow importing shared monolith modules (`../shared/*`) without publishing a package.
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: true,
    externalDir: true,
    optimizePackageImports: ["@prisma/client"],
  },
  webpack: (config) => {
    config.parallelism = 1;
    return config;
  },
  // next.config.ts is evaluated at build time only; exclude it from server-component NFT so
  // dynamic process.cwd() usage in load-marketing-messages.ts does not trigger the
  // "unexpected file in NFT list" Turbopack warning.
  outputFileTracingExcludes: {
    "/**": ["./next.config.ts", "./next.config.js", "./next.config.mjs"],
  },
  // Explicitly include merged i18n bundles so server components can readFileSync them at runtime.
  outputFileTracingIncludes: {
    "/**": ["./public/i18n/**/*.json", "./i18n-admin-only/**/*.json"],
  },
  async redirects() {
    if (!runHeavyBuildTasks) {
      return [legacyMedMathRedirect];
    }
    const [
      { PROGRAMMATIC_SLUG_TO_PATHWAY_PATH },
      { buildPathwayLessonSlugRedirectsForNextConfig },
      { CORE_HOSTED_MARKETING_LOCALES },
      { buildLegacyProgrammaticSeoRedirectsToPathwayHubs, LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT },
      { getAllProgrammaticSlugs },
    ] = await Promise.all([
      import("./src/lib/exam-pathways/programmatic-slug-redirects"),
      import("./src/lib/lessons/pathway-lesson-slug-redirects"),
      import("./src/lib/i18n/marketing-locale-policy"),
      import("./src/lib/marketing/canonical-pathway-hubs"),
      import("./src/lib/seo/programmatic-registry"),
    ]);

    const seoCanonicalRedirects = getAllProgrammaticSlugs()
      .filter((slug) => !LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT.has(slug))
      .map((slug) => ({
        source: `/seo/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      }));

    const examPathwayFromProgrammaticRedirects = Object.entries(PROGRAMMATIC_SLUG_TO_PATHWAY_PATH).map(([slug, dest]) => ({
      source: `/${slug}`,
      destination: dest,
      permanent: true,
    }));

    return [
      legacyMedMathRedirect,
      /**
       * Legacy programmatic SEO slugs (`/{slug}`, `/seo/{slug}`, `/{locale}/{slug}`) → canonical pathway hubs.
       * Runs before rewrites so broken umbrella landings never 500; backlinks consolidate on exam hubs.
       */
      ...buildLegacyProgrammaticSeoRedirectsToPathwayHubs(CORE_HOSTED_MARKETING_LOCALES),
      /** Older Next split-sitemap routes → unified `/sitemap.xml` for GSC + bookmarks. */
      { source: "/sitemap/0.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap/1.xml", destination: "/sitemap.xml", permanent: true },
      ...seoCanonicalRedirects,
      /** Institutional pricing: canonical path `/for-institutions` (footer + marketing). */
      { source: "/institutional-pricing", destination: "/for-institutions", permanent: true },
      { source: "/pricing/institutional", destination: "/for-institutions", permanent: true },
      { source: "/for-schools", destination: "/for-institutions", permanent: true },
      /** Allied hub canonical URL. */
      { source: "/allied-health-exam-prep", destination: "/allied-health", permanent: true },
      { source: "/allied-health-exam-prep/:path*", destination: "/allied-health/:path*", permanent: true },
      /** Canonical public study hubs (avoid duplicate URLs / ad landing confusion). */
      { source: "/mock-exams", destination: "/practice-exams", permanent: true },
      { source: "/mock-exam", destination: "/practice-exams", permanent: true },
      { source: "/test-bank", destination: "/question-bank", permanent: true },
      ...examPathwayFromProgrammaticRedirects,
      /** Pathway lesson slug renames — see `PATHWAY_LESSON_SLUG_REDIRECTS`. */
      ...buildPathwayLessonSlugRedirectsForNextConfig(),
    ];
  },
  async rewrites() {
    if (!runHeavyBuildTasks) {
      return { beforeFiles: [] };
    }
    const [{ getAllProgrammaticSlugs }, { LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT }, { CORE_HOSTED_MARKETING_LOCALES }] =
      await Promise.all([
        import("./src/lib/seo/programmatic-registry"),
        import("./src/lib/marketing/canonical-pathway-hubs"),
        import("./src/lib/i18n/marketing-locale-policy"),
      ]);

    const programmaticSeoRewrites = getAllProgrammaticSlugs()
      .filter((slug) => !LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT.has(slug))
      .map((slug) => ({
        source: `/${slug}`,
        destination: `/seo/${slug}`,
      }));

    const localeSitemapRewrites = CORE_HOSTED_MARKETING_LOCALES.map((locale) => ({
      source: `/sitemaps/locale-${locale}.xml`,
      destination: `/sitemaps/locales/${locale}`,
    }));
    return {
      beforeFiles: [
        /**
         * Serve merged locale JSON from the same handler as `/api/assets/i18n/*` so we can ship
         * `public/i18n/{locale}/*.json` shards without a monolithic `public/i18n/{locale}.json` on disk.
         */
        { source: "/i18n/:file", destination: "/api/assets/i18n/:file" },
        ...programmaticSeoRewrites,
        ...localeSitemapRewrites,
      ],
    };
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }
    return [
      /**
       * Do not set Cache-Control on `/_next/static/*`: Next.js already applies fingerprinted immutable caching,
       * and overriding it triggers framework warnings without improving behavior.
       */
      /** Public marketing fallbacks + static marks (`/marketing/*`). */
      {
        source: "/marketing/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
      /**
       * Subscriber shell: avoid shared CDN/edge caches serving personalized HTML from one session to another.
       * Complements `dynamic = "force-dynamic"` on `/app` layouts; does not apply to public marketing routes.
       */
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
      /**
       * Authenticated API responses must not be cached by shared proxies/CDNs.
       * Route handlers still set per-response headers where needed; this is a baseline.
       */
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

const sentryEnabled = process.env.SENTRY_ENABLED === "true";

const sentryWebpackPluginEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN?.trim());

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      ...(sentryWebpackPluginEnabled
        ? {}
        : {
            sourcemaps: {
              disable: true,
            },
          }),
    })
  : nextConfig;
