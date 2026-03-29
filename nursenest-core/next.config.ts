/**
 * Build context: run `npm run build` from this directory (`nursenest-core`), or set DigitalOcean App Platform
 * **Source directory** to `nursenest-core` so `process.cwd()` and `@shared/*` → `../shared` resolve like local dev.
 *
 * **Disk / TMPDIR:** `package.json` sets `TMPDIR=${TMPDIR:-/tmp}` for `next build` so Turbopack/Next write
 * temp artifacts to a writable path when the default location is full (avoids ENOSPC during `.next` writes).
 * `turbopack.root` / `outputFileTracingRoot` point at the **repo root** (parent of this package), not at
 * `nursenest-core` alone — the latter breaks `@shared/*` resolution; the parent matches the primary lockfile
 * and silences “multiple lockfiles” warnings without changing import paths.
 */
import { fileURLToPath } from "url";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { PROGRAMMATIC_SLUG_TO_PATHWAY_PATH } from "./src/lib/exam-pathways/programmatic-slug-redirects";
import { CORE_HOSTED_MARKETING_LOCALES } from "./src/lib/i18n/marketing-locale-policy";
import { getAllProgrammaticSlugs } from "./src/lib/seo/programmatic-registry";

/** Parent of `nursenest-core/` (repo root); avoids `path` in config bundle (fixes ESM load). */
const monorepoRoot = fileURLToPath(new URL("..", import.meta.url));
const programmaticSeoRewrites = getAllProgrammaticSlugs().map((slug) => ({
  source: `/${slug}`,
  destination: `/seo/${slug}`,
}));

const legacyMedMathRedirect = {
  source: "/med-math",
  destination: "/tools/med-math",
  permanent: true,
} as const;

/** Consolidate on public programmatic URLs (`/{slug}`); `/seo/{slug}` is internal rewrite target only. */
const seoCanonicalRedirects = getAllProgrammaticSlugs().map((slug) => ({
  source: `/seo/${slug}`,
  destination: `/${slug}`,
  permanent: true,
}));

const examPathwayFromProgrammaticRedirects = Object.entries(PROGRAMMATIC_SLUG_TO_PATHWAY_PATH).map(([slug, dest]) => ({
  source: `/${slug}`,
  destination: dest,
  permanent: true,
}));

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
  images: {
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
  },
  // Allow importing shared monolith modules (`../shared/*`) without publishing a package.
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      legacyMedMathRedirect,
      /** Older Next split-sitemap routes → unified `/sitemap.xml` for GSC + bookmarks. */
      { source: "/sitemap/0.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap/1.xml", destination: "/sitemap.xml", permanent: true },
      ...seoCanonicalRedirects,
      /** Institutional pricing: canonical path `/for-institutions` (footer + marketing). */
      { source: "/institutional-pricing", destination: "/for-institutions", permanent: true },
      { source: "/pricing/institutional", destination: "/for-institutions", permanent: true },
      { source: "/for-schools", destination: "/for-institutions", permanent: true },
      ...examPathwayFromProgrammaticRedirects,
    ];
  },
  async rewrites() {
    const localeSitemapRewrites = CORE_HOSTED_MARKETING_LOCALES.map((locale) => ({
      source: `/sitemaps/locale-${locale}.xml`,
      destination: `/sitemaps/locales/${locale}`,
    }));
    return { beforeFiles: [...programmaticSeoRewrites, ...localeSitemapRewrites] };
  },
};

const sentryWebpackPluginEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN?.trim());

export default withSentryConfig(nextConfig, {
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
});
