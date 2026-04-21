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
 *
 * **BUILD_WEBPACK_PARALLELISM:** optional positive integer (default `1`). Webpack `parallelism` and
 * `experimental.cpus` use this value capped by `os.cpus().length` — keeps small-builder memory safety by
 * default; set `2`–`4` on larger CI runners / higher `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` to cut compile time.
 *
 * **`experimental.webpackBuildWorker`:** keep `false` for reliable webpack **filesystem** cache under
 * `.next/cache/webpack` (needed for Heroku/DO `cacheDirectories`). Setting `true` forces forked compiler
 * workers even when a custom `webpack()` exists, which can leave `.next/cache` empty between builds.
 *
 * **Bundler env:** Next 16 defaults to Turbopack when no CLI flag applies (`next/dist/lib/bundler.js`). A host
 * `TURBOPACK` env var can force Turbopack, which uses `turbopackBuild` and **does not** fill `.next/cache/webpack`.
 * Production compile uses `scripts/run-next-prod-build.mjs` to strip `TURBOPACK` / rspack test env before `next build --webpack`.
 *
 * **Build / compile cache (DigitalOcean App Platform):** Next.js writes `.next/cache` during `next build`.
 * `heroku-postbuild` runs bootstrap guard + `NN_POSTBUILD_NEXT_BUILD=1 npm run build` **before** buildpack prune/cache
 * so `.next/cache` is snapshotted (`validate:marketing-production-surface` is CI-only — see `.github/workflows/verify-build.yml`).
 * With both `heroku-postbuild` and `build`, the Heroku buildpack only runs
 * `heroku-postbuild` (the `build` script is not invoked by the buildpack). `build_command` runs `build:deploy` → post-compile verify only.
 * `cacheDirectories` must list **both** `node_modules` and `.next/cache`. `post-build-prune.mjs` preserves
 * `.next/cache` by default (opt out with `NN_POST_BUILD_PRUNE_NEXT_CACHE=1`). Droplet one-shot: `build:deploy:full`.
 * Remote task cache (Turborepo/Nx) is not wired: deploy vertical is `nursenest-core/` + DO build cache.
 */
import { createRequire } from "module";
import os from "node:os";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

/** Parent of `nursenest-core/` (repo root); avoids `path` in config bundle (fixes ESM load). */
const monorepoRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

/** Default 1 for memory-bound builders; opt-in via `BUILD_WEBPACK_PARALLELISM` on larger runners. */
function resolveBuildWebpackParallelism(): number {
  const raw = process.env.BUILD_WEBPACK_PARALLELISM?.trim();
  if (!raw) return 1;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, Math.max(1, os.cpus().length));
}

const buildWebpackParallelism = resolveBuildWebpackParallelism();

// Default off so plain `next build` does not require TS-only route generators from config evaluation.
const runHeavyBuildTasks = process.env.RUN_HEAVY_BUILD_TASKS === "true";
const sentryEnabled = process.env.SENTRY_ENABLED === "true";
const sentryClientEnabled =
  process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" ||
  (process.env.NEXT_PUBLIC_SENTRY_ENABLED == null && sentryEnabled);
const sentryEnvironment =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
  process.env.SENTRY_ENVIRONMENT ||
  process.env.NEXT_PUBLIC_VERCEL_ENV ||
  process.env.VERCEL_ENV ||
  process.env.NODE_ENV ||
  "";
const sentryRelease =
  process.env.NEXT_PUBLIC_SENTRY_RELEASE ||
  process.env.SENTRY_RELEASE ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  "";
const sentrySourceMapsEnabled =
  sentryEnabled &&
  Boolean(
    process.env.SENTRY_AUTH_TOKEN?.trim() &&
      process.env.SENTRY_ORG?.trim() &&
      process.env.SENTRY_PROJECT?.trim(),
  );

type SentryNextConfigModule = typeof import("@sentry/nextjs");

type RedirectEntry = {
  source: string;
  destination: string;
  permanent: boolean;
};

type HeavyRoutingDeps = {
  CORE_HOSTED_MARKETING_LOCALES: readonly string[];
  PROGRAMMATIC_SLUG_TO_PATHWAY_PATH: Record<string, string>;
  LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT: ReadonlySet<string>;
  buildLegacyProgrammaticSeoRedirectsToPathwayHubs: (locales: readonly string[]) => RedirectEntry[];
  buildPathwayLessonSlugRedirectsForNextConfig: () => RedirectEntry[];
  getAllProgrammaticSlugs: () => readonly string[];
};

let heavyRoutingDepsPromise: Promise<HeavyRoutingDeps> | null = null;
let heavyProgrammaticSlugsPromise: Promise<readonly string[]> | null = null;

function loadHeavyRoutingDeps(): Promise<HeavyRoutingDeps> {
  if (!heavyRoutingDepsPromise) {
    heavyRoutingDepsPromise = Promise.all([
      import("./src/lib/i18n/marketing-locale-policy"),
      import("./src/lib/exam-pathways/programmatic-slug-redirects"),
      import("./src/lib/marketing/canonical-pathway-hubs"),
      import("./src/lib/lessons/pathway-lesson-slug-redirects"),
      import("./src/lib/seo/programmatic-registry"),
    ]).then(([i18n, pathways, canonical, lessons, seo]) => ({
      CORE_HOSTED_MARKETING_LOCALES: i18n.CORE_HOSTED_MARKETING_LOCALES,
      PROGRAMMATIC_SLUG_TO_PATHWAY_PATH: pathways.PROGRAMMATIC_SLUG_TO_PATHWAY_PATH,
      LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT: canonical.LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT,
      buildLegacyProgrammaticSeoRedirectsToPathwayHubs: canonical.buildLegacyProgrammaticSeoRedirectsToPathwayHubs,
      buildPathwayLessonSlugRedirectsForNextConfig: lessons.buildPathwayLessonSlugRedirectsForNextConfig,
      getAllProgrammaticSlugs: seo.getAllProgrammaticSlugs,
    }));
  }
  return heavyRoutingDepsPromise;
}

async function loadHeavyProgrammaticSlugs(): Promise<readonly string[]> {
  if (!heavyProgrammaticSlugsPromise) {
    heavyProgrammaticSlugsPromise = loadHeavyRoutingDeps().then(({ getAllProgrammaticSlugs }) => getAllProgrammaticSlugs());
  }
  return heavyProgrammaticSlugsPromise;
}

const legacyMedMathRedirect = {
  source: "/med-math",
  destination: "/tools/med-math",
  permanent: true,
} as const;

/** Matches `/api/marketing-assets/*` success responses and recommended DO Spaces CDN object metadata (see marketing-cdn.catalog.json). */
const STATIC_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable" as const;

/** HTTP-level indexability — complements `<meta name="robots">` and `/robots.txt` (defense in depth for crawlers that execute JS or ignore one signal). */
const X_ROBOTS_NOINDEX_NOFOLLOW = "noindex, nofollow" as const;

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
  //
  // DigitalOcean / CI: this `env` block is evaluated at **`next build` only**. Values here are compiled
  // into the client bundle for `NEXT_PUBLIC_*`. Mirror the same vars on the **build** component/job
  // as on runtime if DO splits env scopes; otherwise Sentry browser flags/release drift after deploy.
  env: {
    // Use || so empty string (often set by hosts with no value) defaults to trusted.
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "true",
    NEXT_PUBLIC_SENTRY_ENABLED: sentryClientEnabled ? "true" : "",
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: sentryEnvironment,
    NEXT_PUBLIC_SENTRY_RELEASE: sentryRelease,
  },
  // Allow importing shared monolith modules (`../shared/*`) without publishing a package.
  experimental: {
    cpus: buildWebpackParallelism,
    memoryBasedWorkersCount: true,
    /** `true` forces `webpack-build` child workers and can prevent populating `.next/cache` for DO/Heroku cache restore. */
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    externalDir: true,
  },
  webpack: (config) => {
    config.parallelism = buildWebpackParallelism;
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
    const {
      CORE_HOSTED_MARKETING_LOCALES,
      PROGRAMMATIC_SLUG_TO_PATHWAY_PATH,
      LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT,
      buildLegacyProgrammaticSeoRedirectsToPathwayHubs,
      buildPathwayLessonSlugRedirectsForNextConfig,
    } = await loadHeavyRoutingDeps();
    const programmaticSlugs = await loadHeavyProgrammaticSlugs();
    const seoCanonicalRedirects = programmaticSlugs
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
      /**
       * Legacy child sitemap URLs (`/sitemaps/core.xml`, `/sitemaps/blog.xml`, `/sitemaps/locale-*.xml`, …)
       * → single merged `/sitemap.xml`. One catch-all avoids maintaining parallel lists; crawlers should only
       * use `/sitemap.xml` (see `robots.txt`).
       */
      { source: "/sitemaps/:path*", destination: "/sitemap.xml", permanent: true },
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
    const { LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT } = await loadHeavyRoutingDeps();
    const programmaticSlugs = await loadHeavyProgrammaticSlugs();
    const programmaticSeoRewrites = programmaticSlugs
      .filter((slug) => !LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT.has(slug))
      .map((slug) => ({
        source: `/${slug}`,
        destination: `/seo/${slug}`,
      }));

    return {
      beforeFiles: [
        /**
         * Serve merged locale JSON from the same handler as `/api/assets/i18n/*` so we can ship
         * `public/i18n/{locale}/*.json` shards without a monolithic `public/i18n/{locale}.json` on disk.
         */
        { source: "/i18n/:file", destination: "/api/assets/i18n/:file" },
        ...programmaticSeoRewrites,
      ],
    };
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }
    return [
      /**
       * Do not set Cache-Control on `/_next/static/*`: Next.js already applies fingerprinted immutable caching.
       * DigitalOcean / CDN in front should pass through `/_next/static/*` and `/favicon.ico` with long TTL.
       * We do not set a blanket `no-store` on all `/api/*` — it would override `/api/public/*` edge caching;
       * authenticated routes rely on dynamic handlers + `no-store` where needed.
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
       * Anonymous public JSON (`/api/public/*`) — CDN may cache; handlers also set `Cache-Control`.
       * Listed explicitly (no blanket `/api/*` Cache-Control rule) so this policy is not overridden.
       */
      {
        source: "/api/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      /**
       * APIs are not HTML landing pages; keep them out of the index even if discovered outside `robots.txt`.
       * (`Disallow: /api/` is still emitted in `/robots.txt`.)
       */
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW }],
      },
      /** Staff UI — matches `(admin)/layout.tsx` metadata `robots: noindex`. */
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW }],
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
          { key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW },
        ],
      },
      {
        source: "/app/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
          { key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW },
        ],
      },
    ];
  },
};

function withOptionalSentryConfig(baseConfig: NextConfig): NextConfig {
  if (!sentryEnabled) {
    return baseConfig;
  }
  const { withSentryConfig } = require("@sentry/nextjs") as SentryNextConfigModule;
  return withSentryConfig(baseConfig, {
    org: sentrySourceMapsEnabled ? process.env.SENTRY_ORG : undefined,
    project: sentrySourceMapsEnabled ? process.env.SENTRY_PROJECT : undefined,
    authToken: sentrySourceMapsEnabled ? process.env.SENTRY_AUTH_TOKEN : undefined,
    silent: true,
    telemetry: false,
    sourcemaps: {
      disable: !sentrySourceMapsEnabled,
    },
  });
}

const exportedConfig = withOptionalSentryConfig(nextConfig);

export default exportedConfig;
