import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { SITEMAP_FALLBACK_CORE_PATHS } from "@/lib/seo/sitemap-index-children";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectExamPathwayUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import {
  excludeAbsoluteUrlsMatchingBlogSitemapEntries,
  filterPublicSitemapEntries,
  mergeCoreUrlsWithBlogEntries,
  normalizeSitemapLoc,
} from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

const CHILD_SEGMENT_OWNED_CORE_EXCLUSIONS = new Set([
  "/canada/np/cnple/simulation",
  "/canada/np/cnple/flashcards",
  "/canada/np/cnple/report-card",
  "/cnple-practice-questions",
  "/cnple-simulation-exam",
  "/cnple-study-guide",
  "/cnple-flashcards",
  "/cnple-case-studies",
  "/cnple-clinical-judgment",
  "/cnple-prescribing-questions",
  "/cnple-lab-interpretation",
  "/cnple-differential-diagnosis",
  "/cnple-primary-care",
  "/cnple-pediatrics",
  "/cnple-womens-health",
  "/cnple-geriatrics",
  "/cnple-mental-health",
]);

function isChildSegmentOwnedCoreUrl(url: string, origin: string): boolean {
  const normalized = normalizeSitemapLoc(url);
  const o = origin.endsWith("/") ? origin.slice(0, -1) : origin;
  if (!normalized.startsWith(o)) return false;
  const pathname = normalized.slice(o.length) || "/";
  return CHILD_SEGMENT_OWNED_CORE_EXCLUSIONS.has(pathname);
}

/**
 * Core marketing/programmatic urlset (everything from {@link collectCoreUrls} except DB pathway-lesson rows).
 * Blog `<loc>`s are excluded via {@link excludeAbsoluteUrlsMatchingBlogSitemapEntries} — blog posts remain in
 * `/sitemap-blog.xml`. Pathway lesson **detail** URLs live in `/sitemap-lessons.xml`. Exam hubs, programmatic topics,
 * and lesson hubs/clusters live in `/sitemap-pathways.xml`. Tier-full `/{locale}/…` marketing URLs live in
 * `/sitemap-localized.xml`. OSCE/clinical-scenario hubs and `/tools/*` clinical teasers live in
 * `/sitemap-clinical-modules.xml`.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  let xml: string;

  try {
    const [coreUrls, pathwayExamOwnedUrls] = await Promise.all([
      collectCoreUrls(origin, {
        productionSafeStatic: true,
        omitPathwayLessonSeoUrls: true,
        omitLocalizedMarketingUrls: true,
        omitExamPathwayAndTopicProgrammaticUrls: true,
      }),
      collectExamPathwayUrls(origin),
    ]);
    const pathwayExamOwned = new Set(pathwayExamOwnedUrls.map((u) => normalizeSitemapLoc(u)));
    const coreUrlsWithoutPathwayExamOverlap = coreUrls.filter(
      (u) => !pathwayExamOwned.has(normalizeSitemapLoc(u)) && !isChildSegmentOwnedCoreUrl(u, origin),
    );

    const coreWithoutBlog = excludeAbsoluteUrlsMatchingBlogSitemapEntries(coreUrlsWithoutPathwayExamOverlap, []);

    const merged: SitemapUrlEntry[] = mergeCoreUrlsWithBlogEntries(coreWithoutBlog, []);
    const filtered = filterPublicSitemapEntries(merged, origin);

    const seen = new Set<string>();
    const unique = filtered.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(unique);
  } catch {
    const fallbackEntries: SitemapUrlEntry[] = SITEMAP_FALLBACK_CORE_PATHS
      .filter((path) => !CHILD_SEGMENT_OWNED_CORE_EXCLUSIONS.has(path))
      .map((path) => ({
        loc: `${origin}${path === "/" ? "" : path}`,
      }));
    const filteredFallback = filterPublicSitemapEntries(fallbackEntries, origin);
    xml = buildSitemapUrlsetFromAbsoluteUrls(
      filteredFallback.length > 0 ? filteredFallback : [{ loc: `${origin}/` }],
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
