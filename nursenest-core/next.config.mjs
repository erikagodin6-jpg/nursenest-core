/** @type {import('next').NextConfig} */
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.TURBOPACK = "1";
process.env.NEXT_TURBOPACK = "1";
process.env.NEXT_DISABLE_TURBOPACK = undefined;
process.env.NEXT_FORCE_TURBOPACK = "1";

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
const coreSrcRoot = path.join(packageRoot, "src");
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
      webpackPersistentCache: false,
      webpackBuildWorker: false,
      workerThreads: false,
      memoryBasedWorkersCount: false,
      parallelServerCompiles: false,
      parallelServerBuildTraces: false,
      skipNextIntegratedLintAndTypes: true,
    }),
  );
}

const experimental = {
  externalDir: true,
  /**
   * Tree-shake barrel-export packages so only the imported symbols are bundled.
   * Each entry here eliminates dead code from that library across the entire app.
   * lucide-react and @radix-ui/* are the two biggest wins given the icon + UI-component usage.
   */
  optimizePackageImports: [
    "lucide-react",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slider",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toast",
    "@radix-ui/react-toggle",
    "@radix-ui/react-toggle-group",
    "@radix-ui/react-tooltip",
    "date-fns",
  ],
  webpackBuildWorker: false,
};

/**
 * Generic NP discovery pages are canonical public URLs (`/{slug}`) but render through the internal
 * programmatic route implementation at `/seo/[slug]`.
 *
 * Keep this list intentionally scoped to the NP discoverability pass so we do not broaden unrelated
 * routing behavior while restoring specialty-first public entry points.
 */
const NP_PROGRAMMATIC_SEO_REWRITES = [
  "np-exam-prep",
  "np-exam-practice-questions",
  "np-clinical-cases",
  "canada-np-exam-prep",
  "cnple-practice-questions",
  "np-study-guide-canada",
];

class NextServerCommonJsBoundaryPlugin {
  apply(compiler) {
    const pluginName = "NextServerCommonJsBoundaryPlugin";
    const { Compilation, sources } = compiler.webpack;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          // Next emits CommonJS server chunks under `.next/server`, but this app is ESM at the package
          // root. Emit a local package boundary so build-time `require()` of generated app pages works.
          compilation.emitAsset("server/package.json", new sources.RawSource('{"type":"commonjs"}\n'));
        },
      );
    });
  }
}

const nextConfig = {
  output: "standalone",
  // Cloudflare/DigitalOcean handle response compression at the edge. Keeping
  // Next origin compression enabled adds a redundant TransformStream layer that
  // has been unstable in the hosted standalone runtime.
  compress: false,

  /** Legacy crawler bookmarks → single canonical sitemap (avoid duplicate sitemap index signals). */
  async redirects() {
    return [
      { source: "/sitemap-index.xml", destination: "/sitemap.xml", permanent: true },
      /** Learner canonical routes (consolidation); query strings preserved by Next.js. */
      { source: "/app/command-center", destination: "/app", permanent: false },
      { source: "/app/practice", destination: "/app/practice-tests", permanent: false },
      { source: "/app/cat", destination: "/app/practice-tests", permanent: false },
      { source: "/app/practice-exams", destination: "/app/practice-tests", permanent: false },
      /** New Grad public marketing canonical lives on newgrad.nursenest.ca. */
      {
        source: "/",
        has: [{ type: "host", value: "newgrad.nursenest.ca" }],
        destination: "/new-grad",
        permanent: false,
      },
      {
        source: "/new-grad",
        has: [{ type: "host", value: "www.nursenest.ca" }],
        destination: "https://newgrad.nursenest.ca/new-grad",
        permanent: true,
      },
      {
        source: "/new-grad/:path*",
        has: [{ type: "host", value: "www.nursenest.ca" }],
        destination: "https://newgrad.nursenest.ca/new-grad/:path*",
        permanent: true,
      },
      {
        source: "/newgrad",
        destination: "https://newgrad.nursenest.ca/new-grad",
        permanent: true,
      },
      {
        source: "/newgrad/:path*",
        destination: "https://newgrad.nursenest.ca/new-grad/:path*",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/new-grad",
        destination: "https://newgrad.nursenest.ca/new-grad",
        permanent: true,
      },
      {
        source: "/:locale(en|fr)/new-grad/:path*",
        destination: "https://newgrad.nursenest.ca/new-grad/:path*",
        permanent: true,
      },
      /** Legacy allied host bookmarked sitemap → canonical apex HTTPS urlset. */
      {
        source: "/sitemap-allied.xml",
        has: [{ type: "host", value: "allied.nursenest.ca" }],
        destination: "https://nursenest.ca/sitemap-allied.xml",
        permanent: true,
      },
      /** Legacy www host bookmarks → canonical apex host. */
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nursenest.ca" }],
        destination: "https://nursenest.ca/:path*",
        permanent: true,
      },
      /** Production HTTP bookmarks → canonical HTTPS apex (requires `x-forwarded-proto` from the edge). */
      {
        source: "/:path*",
        has: [
          { type: "header", key: "x-forwarded-proto", value: "http" },
          { type: "host", value: "www.nursenest.ca" },
        ],
        destination: "https://nursenest.ca/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "header", key: "x-forwarded-proto", value: "http" },
          { type: "host", value: "nursenest.ca" },
        ],
        destination: "https://nursenest.ca/:path*",
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
      /** RPN authority aliases → canonical PN/RPN product study surfaces. */
      { source: "/canada/rpn/rex-pn", destination: "/canada/pn/rex-pn", permanent: true },
      { source: "/canada/rpn/rex-pn/:path*", destination: "/canada/pn/rex-pn/:path*", permanent: true },
      /** Legacy Canada NCLEX bookmark → canonical RN pathway hub (query strings preserved). */
      { source: "/canada-nclex-rn", destination: "/canada/rn/nclex-rn", permanent: true },
      { source: "/canada-nclex-rn/overview", destination: "/canada/rn/nclex-rn", permanent: true },
      {
        source: "/canada-nclex-rn/:topic",
        destination: "/canada/rn/nclex-rn/guide/:topic",
        permanent: true,
      },

      // ── SEO Remediation 2026-05-30: Legacy practice URL patterns (5xx audit fix) ──
      // Old route patterns that existed before the dynamic [locale]/[slug]/[examCode] migration.
      // Do not redirect `/lessons/:slug`: that path is the canonical lesson detail/category route.
      { source: "/canada/rn/nclex-rn/practice-exams/:path*", destination: "/canada/rn/nclex-rn/cat", permanent: true },
      { source: "/canada/rpn/rex-pn/practice-exams/:path*", destination: "/canada/pn/rex-pn/cat", permanent: true },
      { source: "/canada/np/cnple/practice-exams/:path*", destination: "/canada/np/cnple/cat", permanent: true },
      { source: "/us/lpn/nclex-pn/practice-exams/:path*", destination: "/us/lpn/nclex-pn/cat", permanent: true },
      { source: "/us/rn/nclex-rn/practice-exams/:path*", destination: "/us/rn/nclex-rn/cat", permanent: true },

      // ── SEO Remediation: Unsupported locale sub-paths → English equivalent (2,800+ 404s) ──
      // Non-hosted marketing locales call notFound() for all sub-paths. Redirect to English path
      // so link equity flows to indexed English content. Does not affect full-tier or core-hosted locales.
      // Full-tier: en, es, tl, hi, pt — never match this redirect.
      // Core-hosted (partial): fr — excluded below.
      {
        source: "/:locale(ko|tr|it|de|ar|zh-tw|zh|ja|fa|hu|ru|id|th|ur|ht|vi|ta|te|bn|mr|gu|pa)/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/:locale(ko|tr|it|de|ar|zh-tw|zh|ja|fa|hu|ru|id|th|ur|ht|vi|ta|te|bn|mr|gu|pa)",
        destination: "/",
        permanent: true,
      },

      // ── SEO Remediation: /sign-up → /signup canonical (duplicate auth route) ──
      { source: "/sign-up", destination: "/signup", permanent: true },
      { source: "/:locale/sign-up", destination: "/:locale/signup", permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: NP_PROGRAMMATIC_SEO_REWRITES.map((slug) => ({
        source: `/${slug}`,
        destination: `/seo/${slug}`,
      })),
    };
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
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.posthog.com https://*.i.posthog.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://nursenest-images.tor1.digitaloceanspaces.com https://nursenest-images.tor1.cdn.digitaloceanspaces.com https://*.digitaloceanspaces.com https://*.stripe.com https://*.posthog.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api.stripe.com https://*.stripe.com https://*.posthog.com https://*.i.posthog.com https://nursenest-images.tor1.digitaloceanspaces.com https://nursenest-images.tor1.cdn.digitaloceanspaces.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
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
      /**
       * CACHE BYPASS — authenticated and private routes.
       * These headers tell Cloudflare (and any CDN) to NEVER cache these responses.
       * Combined with the cookie-based bypass rules in Cloudflare Cache Rules, this
       * provides defence-in-depth: the origin itself instructs the CDN not to cache,
       * and Cloudflare's cookie rules add a second layer of bypass.
       *
       * Covered routes:
       *   /app/*       — learner shell (session-gated, personalised progress data)
       *   /admin/*     — staff admin (RBAC-gated)
       *   /account/*   — billing + profile (private)
       *   /checkout/*  — Stripe checkout (session + payment state)
       *   /login       — auth flow
       *   /signup      — auth flow
       *   /modules/*   — gated content shell (entitlement-based, per-user state)
       */
      {
        source: "/app",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/app/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/account/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/checkout/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/login",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/signup",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/modules/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
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
      /**
       * EDGE CACHING: Static SEO content pages — no user-specific data in the HTML body.
       * s-maxage=3600 tells Cloudflare (or any CDN in front of DO) to cache the full HTML
       * response for 1 hour, serving subsequent requests from the edge (~10ms TTFB instead
       * of ~1000ms origin round-trip). stale-while-revalidate allows serving stale content
       * while revalidating in the background (zero downtime cache refresh).
       *
       * Vary: Cookie ensures that if a user has a region cookie, they get the correct
       * region-specific cache variant rather than the default anonymous response.
       *
       * These routes produce identical HTML for the vast majority of anonymous visitors
       * (no session, no region preference). Anonymous traffic → 100% CDN hit rate after
       * first request per Cloudflare PoP.
       */
      {
        source: "/advanced-ecg-nursing",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        source: "/ecg/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        source: "/clinical-modules",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        source: "/ecg-interpretation",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        source: "/ecg-telemetry-mastery",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      /**
       * CNPLE / NP SEO cluster — static content, same HTML for all users.
       * 1-hour CDN cache with 24-hour SWR background revalidation.
       */
      {
        source: "/cnple-:slug",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        source: "/advanced-ecg-nursing/:subpath*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      /**
       * Blog posts — ISR revalidated at 3600s (1h). CDN can cache for up to 1h.
       * SWR allows stale serving during background revalidation.
       */
      {
        source: "/blog/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=120, s-maxage=3600, stale-while-revalidate=7200" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        /** Next.js build fingerprints — safe immutable long cache for desktop PageSpeed "cache lifetime". */
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        /** Versioned tab icon — safe to cache long-term while breaking old favicon cache. */
        source: "/favicon-pink-v3.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }],
      },
      {
        source: "/apple-touch-icon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }],
      },
      {
        source: "/icon-192.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }],
      },
      {
        source: "/icon-512.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }],
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

  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [68, 75],
    // Next image optimizer cache. Source assets are versioned/remote CDN-backed;
    // a longer floor reduces repeat image fetches and PageSpeed cache-lifetime noise.
    minimumCacheTTL: 2678400,
    localPatterns: [
      {
        pathname: "/branding/blossom-leaf/**",
        search: "?v=2026-05-21-opt1",
      },
      {
        pathname: "/marketing/**",
      },
      {
        pathname: "/landing-polish-preview/png/**",
      },
      {
        pathname: "/dashboard-redesign-preview/**",
      },
    ],
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
      "@": coreSrcRoot,
      "@shared": sharedRoot,
      "@legacy-client": legacyClientRoot,
    },
  },

  webpack: (config, { dev, isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": coreSrcRoot,
      "@shared": sharedRoot,
      "@legacy-client": legacyClientRoot,
    };
    // PackFileCacheStrategy can throw ENOENT under load; disabling persistent cache trims disk + mmap pressure.
    if (!dev) {
      config.cache = false;
      config.devtool = false;
    }
    if (!dev && isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(new NextServerCommonJsBoundaryPlugin());
    }
    return config;
  },
};

export default nextConfig;
