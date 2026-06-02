import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { SITEMAP_FALLBACK_PATHWAYS_PATHS } from "@/lib/seo/sitemap-index-children";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectPathwaysSegmentUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Exam pathway hubs, pathway-topic programmatic long-tail, `/lessons` + per-pathway lesson hubs + topic clusters.
 * Lesson **detail** URLs (`…/lessons/{slug}`) are emitted only from `/sitemap-lessons.xml`.
 */
export const runtime = "nodejs";
export const revalidate = 3600;

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

    const pathwayStrings = await collectPathwaysSegmentUrls(origin, { deadlineEpochMs: pathwayLessonDeadlineMs });
    const entries: SitemapUrlEntry[] = pathwayStrings.map((loc) => ({ loc }));
    const filtered = filterPublicSitemapEntries(entries, origin);

    const seen = new Set<string>();
    const unique = filtered.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(
      unique.length > 0 ? unique : [{ loc: `${origin}/lessons` }],
    );
  } catch {
    const fallbackEntries: SitemapUrlEntry[] = SITEMAP_FALLBACK_PATHWAYS_PATHS.map((path) => ({
      loc: `${origin}${path}`,
    }));
    const filteredFallback = filterPublicSitemapEntries(fallbackEntries, origin);
    xml = buildSitemapUrlsetFromAbsoluteUrls(
      filteredFallback.length > 0 ? filteredFallback : [{ loc: `${origin}/lessons` }],
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
