import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { SITEMAP_FALLBACK_LESSON_DETAIL_PATHS } from "@/lib/seo/sitemap-index-children";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectPathwayLessonDetailSeoUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Pathway lesson **detail** URLs (`…/lessons/{slug}`) only — hubs and topic clusters live in `/sitemap-pathways.xml`.
 * Uses `SITEMAP_PATHWAY_BUDGET_MS` wall clock budget.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  let xml: string;

  try {
    const pathwayBudgetMs = (() => {
      const raw = process.env.SITEMAP_PATHWAY_BUDGET_MS?.trim();
      const n = raw ? Number.parseInt(raw, 10) : 8000;
      if (!Number.isFinite(n)) return 8000;
      return Math.min(60_000, Math.max(2000, n));
    })();
    const pathwayLessonDeadlineMs = Date.now() + pathwayBudgetMs;

    const lessonStrings = await collectPathwayLessonDetailSeoUrls(origin, { deadlineEpochMs: pathwayLessonDeadlineMs });
    const entries: SitemapUrlEntry[] = lessonStrings.map((loc) => ({ loc }));
    const filtered = filterPublicSitemapEntries(entries, origin);

    const seen = new Set<string>();
    const unique = filtered.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(
      unique.length > 0 ? unique : [{ loc: `${origin}${SITEMAP_FALLBACK_LESSON_DETAIL_PATHS[0]}` }],
    );
  } catch {
    const fallbackEntries: SitemapUrlEntry[] = SITEMAP_FALLBACK_LESSON_DETAIL_PATHS.map((path) => ({
      loc: `${origin}${path}`,
    }));
    const filteredFallback = filterPublicSitemapEntries(fallbackEntries, origin);
    xml = buildSitemapUrlsetFromAbsoluteUrls(
      filteredFallback.length > 0 ? filteredFallback : [{ loc: `${origin}${SITEMAP_FALLBACK_LESSON_DETAIL_PATHS[0]}` }],
    );
  }

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
