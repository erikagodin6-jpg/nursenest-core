import { crawlSurfaceErrorCode, logCrawlSurfaceEvent } from "@/lib/observability/crawl-surface-observability";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import { isLocaleRobotsPathDisallowed } from "@/lib/i18n/language-readiness";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

/**
 * Explicit `text/plain` robots.txt — no DB; always 200 for crawlers.
 *
 * **Sitemap:** exactly one `Sitemap:` line pointing at `${CANONICAL_PRODUCTION_ORIGIN}/sitemap.xml`
 * (single GSC / crawler entry; no sitemap index or child sitemap URLs here).
 *
 * SEO indexing policy per language status:
 * - active (full tier): allowed — Google indexes the locale pages normally.
 * - partial (partial tier): pages are served with `noindex` meta (injected by
 *   safeGenerateMetadata); crawling is **allowed** (no `Disallow` for `/{code}/`) so bots
 *   can fetch pages and honor hreflang + noindex consistently.
 * - disabled (incomplete tier): `Disallow: /{code}/` to save crawl budget on mostly-English
 *   URLs that are also excluded from hreflang and locale sitemaps. Routes still serve 200 for humans.
 *
 * Internal `/seo/*` rewrite targets are disallowed to avoid duplicate indexing
 * with the public `/{slug}` URLs they back.
 *
 * **Static:** body depends only on shipped locale tier config — no per-request data. Serving as
 * static reduces cold-start variance for crawlers vs `force-dynamic`.
 */
export const runtime = "nodejs";
export const dynamic = "force-static";

const ROBOTS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
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

const CANONICAL_SITEMAP_LINE = `Sitemap: ${CANONICAL_PRODUCTION_ORIGIN}/sitemap.xml` as const;

const FALLBACK_BODY = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /app/",
  "Disallow: /admin/",
  "Disallow: /api/",
  "Disallow: /seo/",
  "",
  CANONICAL_SITEMAP_LINE,
].join("\n");

const ROBOTS_PATHNAME = "/robots.txt";

function assertSingleCanonicalSitemapDirective(body: string): void {
  const lines = body.split(/\r?\n/);
  const sitemapLines = lines.filter((l) => /^\s*Sitemap:\s*/i.test(l));
  if (sitemapLines.length !== 1) {
    throw new Error(`robots.txt must contain exactly one Sitemap directive, got ${sitemapLines.length}`);
  }
  const expected = CANONICAL_SITEMAP_LINE.trim();
  if (sitemapLines[0].trim() !== expected) {
    throw new Error(`robots.txt Sitemap must be exactly: ${expected}`);
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
      "Disallow: /api/",
      "Disallow: /seo/",
      ...(disallowedLocales ? [disallowedLocales] : []),
      "",
      CANONICAL_SITEMAP_LINE,
    ].join("\n");

    assertSingleCanonicalSitemapDirective(body);

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
