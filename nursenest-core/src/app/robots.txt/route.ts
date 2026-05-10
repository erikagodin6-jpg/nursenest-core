import { crawlSurfaceErrorCode, logCrawlSurfaceEvent } from "@/lib/observability/crawl-surface-observability";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import { isLocaleRobotsPathDisallowed } from "@/lib/i18n/language-readiness";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

/**
 * Explicit `text/plain` robots.txt — no DB; always 200 for crawlers.
 *
 * **Sitemap:** four `Sitemap:` lines — merged marketing/urlset at `/sitemap.xml` (no blog post URLs; those are in
 * `/sitemap-blog.xml`), blog urlset at `/sitemap-blog.xml`, allied occupation hubs at `/sitemap-allied.xml`, and New Grad
 * marketing at `/sitemap-new-grad.xml`. All use `${CANONICAL_PRODUCTION_ORIGIN}`
 * (https `www` in production). No `http:`, no legacy hostnames.
 *
 * SEO indexing policy per language status:
 * - active (full tier): allowed — Google indexes the locale pages normally; locale URLs may appear in `/sitemap.xml`.
 * - partial (partial tier): `noindex` meta (via safeGenerateMetadata); crawling **allowed** (no `Disallow` for
 *   `/{code}/`) so bots can fetch pages and honor hreflang + noindex; **not** listed in `/sitemap.xml`.
 * - disabled (incomplete tier): `Disallow: /{code}/` plus `noindex`; excluded from hreflang and sitemaps.
 *   Routes may still return 200 for humans.
 *
 * **Authenticated / internal surfaces:** `Disallow: /app/`, `/admin/`, `/internal/`, `/api/` — learner shell and gated flows;
 * these are also blocked from sitemap emission via URL validation (see `public-url-validator`).
 *
 * Internal `/seo/*` rewrite targets are disallowed to avoid duplicate indexing
 * with the public `/{slug}` URLs they back.
 *
 * **Static:** body depends only on shipped locale tier config — no per-request data. Serving as
 * static reduces cold-start variance for crawlers vs `force-dynamic`.
 */
export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

const ROBOTS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

function buildDisallowedLocaleLines(): string {
  const lines: string[] = [];
  for (const lang of MARKETING_LANGUAGES) {
    if (lang.code === DEFAULT_MARKETING_LOCALE) continue;
    if (isLocaleRobotsPathDisallowed(lang.code)) {
      lines.push(`Disallow: /${lang.code}/`);
    }
  }
  return lines.join("\n");
}

const CANONICAL_SITEMAP_LINES = [
  `Sitemap: ${CANONICAL_PRODUCTION_ORIGIN}/sitemap.xml`,
  `Sitemap: ${CANONICAL_PRODUCTION_ORIGIN}/sitemap-blog.xml`,
  `Sitemap: ${CANONICAL_PRODUCTION_ORIGIN}/sitemap-allied.xml`,
  `Sitemap: ${CANONICAL_PRODUCTION_ORIGIN}/sitemap-new-grad.xml`,
] as const;

const FALLBACK_BODY = [
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
    const disallowedLocales = buildDisallowedLocaleLines();

    const body = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /app/",
      "Disallow: /admin/",
      "Disallow: /internal/",
      "Disallow: /api/",
      "Disallow: /seo/",
      ...(disallowedLocales ? [disallowedLocales] : []),
      "",
      ...CANONICAL_SITEMAP_LINES,
    ].join("\n");

    assertCanonicalSitemapDirectives(body);

    return new Response(body, { status: 200, headers: ROBOTS_HEADERS });
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
