import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import { isLocaleSeoIndexable } from "@/lib/i18n/language-readiness";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

/**
 * Explicit `text/plain` robots.txt — no DB; always 200 for crawlers.
 *
 * SEO indexing policy per language status:
 * - active (full tier): allowed — Google indexes the locale pages normally.
 * - partial (partial tier): pages are served with `noindex` meta (injected by
 *   safeGenerateMetadata), but crawling is allowed so bots can see the noindex directive.
 * - disabled (incomplete tier): Disallowed here to prevent unnecessary crawl budget
 *   consumption on mostly-English pages. Routes still serve 200 for human visitors.
 *
 * Internal `/seo/*` rewrite targets are disallowed to avoid duplicate indexing
 * with the public `/{slug}` URLs they back.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROBOTS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
} as const;

function buildDisallowedLocaleLines(): string {
  const lines: string[] = [];
  for (const lang of MARKETING_LANGUAGES) {
    if (lang.code === DEFAULT_MARKETING_LOCALE) continue;
    if (!isLocaleSeoIndexable(lang.code)) {
      // Disallow crawlers from consuming budget on pages with noindex.
      lines.push(`Disallow: /${lang.code}/`);
    }
  }
  return lines.join("\n");
}

const FALLBACK_BODY = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /app/",
  "Disallow: /admin/",
  "Disallow: /api/",
  "Disallow: /seo/",
  "",
  "Sitemap: https://www.nursenest.ca/sitemap.xml",
].join("\n");

export async function GET() {
  try {
    const origin = resolveCanonicalSiteOrigin();
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
      `Sitemap: ${origin}/sitemap.xml`,
    ].join("\n");

    return new Response(body, { status: 200, headers: ROBOTS_HEADERS });
  } catch {
    return new Response(FALLBACK_BODY, { status: 200, headers: ROBOTS_HEADERS });
  }
}
