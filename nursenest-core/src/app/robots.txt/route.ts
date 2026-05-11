import { crawlSurfaceErrorCode, logCrawlSurfaceEvent } from "@/lib/observability/crawl-surface-observability";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";

/**
 * Explicit `text/plain` robots.txt — no DB; always 200 for crawlers.
 *
 * **Sitemap:** one `Sitemap:` line pointing at `/sitemap.xml` (**sitemap index**). Child urlsets are listed inside the
 * index (`sitemap-core.xml`, `sitemap-blog.xml`, `sitemap-lessons.xml`, `sitemap-allied.xml`, `sitemap-new-grad.xml`).
 * All use `${CANONICAL_PRODUCTION_ORIGIN}` (https `www` in production). No `http:`, no legacy hostnames.
 *
 * ## Locale readiness — robots.txt is intentionally permissive for marketing locales
 *
 * Every routable marketing locale (`/{code}/…`) is **crawlable**. Locale-tier indexing control
 * lives entirely in page metadata via `<meta name="robots" content="noindex,follow">` (see
 * `safeGenerateMetadata` + `localeRobotsOverride`) and in sitemap/hreflang exclusion via the
 * `getLocaleSeoTier` helpers.
 *
 * Previously this route emitted `Disallow: /{code}/` for `incomplete`/blocked locales. That
 * directly produced Google Search Console "Indexed, though blocked by robots.txt" warnings
 * for URLs like `/pa/terms`, `/zh-tw/guides/...`, `/it/forgot-password`, `/ko/`, `/tr/`,
 * `/ur/clinical-clarity/...`, `/ht/lessons/...` because Googlebot was prevented from fetching
 * those pages to read the `noindex` tag (the only valid de-indexing signal). The fix — per
 * Google's own docs — is to remove the robots.txt Disallow and let Googlebot read `noindex`.
 *
 * See `docs/reports/locale-seo-leakage-remediation.md` for the full remediation history.
 *
 * **Authenticated / internal surfaces:** `Disallow: /app/`, `/admin/`, `/internal/`, `/api/` — learner shell and gated flows;
 * these are also blocked from sitemap emission via URL validation (see `public-url-validator`).
 *
 * Internal `/seo/*` rewrite targets are disallowed to avoid duplicate indexing
 * with the public `/{slug}` URLs they back.
 *
 * **Static:** body has no per-request data and no per-locale variation — serving as static
 * reduces cold-start variance for crawlers vs `force-dynamic`.
 */
export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

const ROBOTS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

const CANONICAL_SITEMAP_LINES = [`Sitemap: ${CANONICAL_PRODUCTION_ORIGIN}/sitemap.xml`] as const;

/**
 * Body is identical for every request — no per-locale Disallow lines.
 *
 * Marketing locale paths (`/fr/…`, `/pa/…`, etc.) are intentionally crawlable so Googlebot
 * can read each page's `<meta name="robots" content="noindex,follow">`. The page-level noindex
 * is the **only** correct mechanism to keep `preview`-tier locales out of the index.
 */
const STATIC_BODY = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /app/",
  "Disallow: /admin/",
  "Disallow: /internal/",
  "Disallow: /api/",
  "Disallow: /seo/",
  "",
  ...CANONICAL_SITEMAP_LINES,
].join("\n");

const FALLBACK_BODY = STATIC_BODY;

const ROBOTS_PATHNAME = "/robots.txt";

function assertCanonicalSitemapDirectives(body: string): void {
  const lines = body.split(/\r?\n/);
  const sitemapLines = lines.filter((l) => /^\s*Sitemap:\s*/i.test(l)).map((l) => l.trim());
  if (sitemapLines.length !== CANONICAL_SITEMAP_LINES.length) {
    throw new Error(`robots.txt must contain exactly ${CANONICAL_SITEMAP_LINES.length} Sitemap directives, got ${sitemapLines.length}`);
  }
  for (let i = 0; i < CANONICAL_SITEMAP_LINES.length; i++) {
    const expected = CANONICAL_SITEMAP_LINES[i].trim();
    if (sitemapLines[i] !== expected) {
      throw new Error(`robots.txt Sitemap line ${i + 1} must be exactly: ${expected} (got ${sitemapLines[i]})`);
    }
  }
  for (const l of sitemapLines) {
    if (/\bhttp:\/\//i.test(l)) {
      throw new Error("robots.txt Sitemap directives must not use http://");
    }
    if (/allied\.nursenest\.ca/i.test(l)) {
      throw new Error("robots.txt must not advertise allied.nursenest.ca sitemap URLs");
    }
  }
}

export async function GET() {
  const t0 = Date.now();
  try {
    assertCanonicalSitemapDirectives(STATIC_BODY);

    return new Response(STATIC_BODY, { status: 200, headers: ROBOTS_HEADERS });
  } catch (e) {
    logCrawlSurfaceEvent({
      routeType: "marketing.robots_txt",
      pathname: ROBOTS_PATHNAME,
      durationMs: Date.now() - t0,
      outcome: "fallback",
      httpStatus: 200,
      fallback: true,
      errorCode: crawlSurfaceErrorCode(e),
    });
    return new Response(FALLBACK_BODY, { status: 200, headers: ROBOTS_HEADERS });
  }
}
