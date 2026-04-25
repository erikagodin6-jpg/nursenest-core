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

function truthyEnv(name: string): boolean {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? "").trim());
}

function resolveBuildWebpackParallelism(): number {
  const raw = process.env.BUILD_WEBPACK_PARALLELISM?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 2;
  if (!Number.isFinite(parsed) || parsed < 1) return 2;
  return Math.min(parsed, Math.max(1, os.cpus().length));
}

/**
 * Important:
 * Do NOT force single-worker mode here. Next 16 + webpack can crash in FlightClientEntryPlugin
 * when the build graph is forced too narrowly. Docker already controls memory with NODE_OPTIONS.
 */
const shouldForceLowMemoryWorkers = false;
const effectiveParallelism = Math.max(2, resolveBuildWebpackParallelism());

if (process.argv.includes("build")) {
  console.log(
    `[build-workers] forceLow=0 effectiveParallelism=${effectiveParallelism} staticGenConcurrency=default`,
  );
}

const outputFileTracingInstrumentationExcludes = [
  "**/@opentelemetry/**",
  "**/@sentry/**",
  "**/@prisma/instrumentation/**",
  "**/node_modules/@sentry/cli/**",
  "**/node_modules/@sentry/bundler-plugin-core/**",
] as const;

const outputFileTracingMonorepoNonRuntimeExcludes = [
  "./.git/**",
  "./.worktrees/**",
  "./.cursor/**",
  "./.legacy-extract/**",
  "./backup-system/**",
] as const;

const outputFileTracingHeavyExcludes = [
  ...outputFileTracingInstrumentationExcludes,
  ...outputFileTracingMonorepoNonRuntimeExcludes,
] as const;

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
      import("./src/lib/seo/programmatic-registry-slugs"),
    ]).then(([i18n, pathways, canonical, lessons, progSlugs]) => ({
      CORE_HOSTED_MARKETING_LOCALES: i18n.CORE_HOSTED_MARKETING_LOCALES,
      PROGRAMMATIC_SLUG_TO_PATHWAY_PATH: pathways.PROGRAMMATIC_SLUG_TO_PATHWAY_PATH,
      LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT: canonical.LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT,
      buildLegacyProgrammaticSeoRedirectsToPathwayHubs: canonical.buildLegacyProgrammaticSeoRedirectsToPathwayHubs,
      buildPathwayLessonSlugRedirectsForNextConfig: lessons.buildPathwayLessonSlugRedirectsForNextConfig,
      getAllProgrammaticSlugs: progSlugs.getAllProgrammaticSlugs,
    }));
  }
  return heavyRoutingDepsPromise;
}

async function loadHeavyProgrammaticSlugs(): Promise<readonly string[]> {
  if (!heavyProgrammaticSlugsPromise) {
    heavyProgrammaticSlugsPromise = loadHeavyRoutingDeps().then(({ getAllProgrammaticSlugs }) =>
      getAllProgrammaticSlugs(),
    );
  }
  return heavyProgrammaticSlugsPromise;
}

const legacyMedMathRedirect: RedirectEntry = {
  source: "/med-math",
  destination: "/tools/med-math",
  permanent: true,
};

function buildTermsOfServiceRedirects(): RedirectEntry[] {
  return [
    { source: "/terms-of-service", destination: "/terms", permanent: true },
    ...CORE_HOSTED_MARKETING_LOCALES.map((loc) => ({
      source: `/${loc}/terms-of-service`,
      destination: `/${loc}/terms`,
      permanent: true,
    })),
  ];
}

function buildInstitutionalMarketingRedirects(): RedirectEntry[] {
  const rows: RedirectEntry[] = [
    { source: "/institutions", destination: "/for-institutions", permanent: true },
    { source: "/schools", destination: "/for-institutions", permanent: true },
  ];

  for (const loc of CORE_HOSTED_MARKETING_LOCALES) {
    rows.push(
      { source: `/${loc}/institutions`, destination: `/${loc}/for-institutions`, permanent: true },
      { source: `/${loc}/schools`, destination: `/${loc}/for-institutions`, permanent: true },
    );
  }

  return rows;
}

const STATIC_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable" as const;
const X_ROBOTS_NOINDEX_NOFOLLOW = "noindex, nofollow" as const;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],

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
    NEXT_PUBLIC_SENTRY_ENABLED: sentryClientEnabled ? "true" : "",
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: sentryEnvironment,
    NEXT_PUBLIC_SENTRY_RELEASE: sentryRelease,
  },

  experimental: {
    cpus: effectiveParallelism,
    memoryBasedWorkersCount: false,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    externalDir: true,
  },

  webpack: (config) => {
    config.parallelism = effectiveParallelism;
    return config;
  },

  outputFileTracingExcludes: {
    "*": [...outputFileTracingHeavyExcludes],
    "/**": [
      "./next.config.ts",
      "./next.config.js",
      "./next.config.mjs",
      ...outputFileTracingHeavyExcludes,
    ],
  },

  outputFileTracingIncludes: {
    "/**": ["./public/i18n/**/*.json", "./i18n-admin-only/**/*.json"],
  },

  async redirects() {
    if (!runHeavyBuildTasks) {
      return [
        legacyMedMathRedirect,
        ...buildTermsOfServiceRedirects(),
        ...buildInstitutionalMarketingRedirects(),
      ];
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

    const examPathwayFromProgrammaticRedirects = Object.entries(
      PROGRAMMATIC_SLUG_TO_PATHWAY_PATH,
    ).map(([slug, dest]) => ({
      source: `/${slug}`,
      destination: dest,
      permanent: true,
    }));

    return [
      legacyMedMathRedirect,
      ...buildTermsOfServiceRedirects(),
      ...buildInstitutionalMarketingRedirects(),
      ...buildLegacyProgrammaticSeoRedirectsToPathwayHubs(CORE_HOSTED_MARKETING_LOCALES),
      { source: "/sitemap/0.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap/1.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemaps/:path*", destination: "/sitemap.xml", permanent: true },
      ...seoCanonicalRedirects,
      { source: "/institutional-pricing", destination: "/for-institutions", permanent: true },
      { source: "/pricing/institutional", destination: "/for-institutions", permanent: true },
      { source: "/for-schools", destination: "/for-institutions", permanent: true },
      { source: "/allied-health-exam-prep", destination: "/allied-health", permanent: true },
      { source: "/allied-health-exam-prep/:path*", destination: "/allied-health/:path*", permanent: true },
      { source: "/mock-exams", destination: "/practice-exams", permanent: true },
      { source: "/mock-exam", destination: "/practice-exams", permanent: true },
      { source: "/test-bank", destination: "/question-bank", permanent: true },
      ...examPathwayFromProgrammaticRedirects,
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
      {
        source: "/marketing/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
      {
        source: "/api/public/home-stats",
        headers: [{ key: "Cache-Control", value: cacheControlFromHeadersInit(CACHE_HEADER_HOME_STATS) }],
      },
      {
        source: "/api/public/flashcard-tags",
        headers: [{ key: "Cache-Control", value: cacheControlFromHeadersInit(CACHE_HEADER_PUBLIC_LIST) }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW }],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW }],
      },
      {
        source: "/app",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX_NOFOLLOW },
        ],
      },
      {
        source: "/app/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
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

export default withOptionalSentryConfig(nextConfig);