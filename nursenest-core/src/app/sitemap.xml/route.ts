import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries, mergeCoreUrlsWithBlogEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Public sitemap: {@link collectCoreUrls} (marketing + pathway hubs + verified lessons, etc.) plus
 * published blog URLs. DB failures fall back to a minimal static urlset — never 503.
 * Every `loc` is filtered with {@link filterPublicSitemapEntries} (no `/login`, `/app`, `/api`, `/seo/`, …).
 * Origin follows {@link resolveCanonicalSiteOrigin}. Returns valid `application/xml` (200 or 304).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimal fallback when DB / heavy collectors fail — indexable marketing only (no auth noindex paths). */
const FALLBACK_SITEMAP_PATHS = [
  "/",
  "/pricing",
  "/blog",
  "/about",
  "/question-bank",
  "/practice-exams",
  "/lessons",
  "/us/rn/nclex-rn",
  "/us/rn/nclex-rn/lessons",
  "/us/pn/nclex-pn",
  "/us/pn/nclex-pn/lessons",
  "/us/np/fnp",
  "/us/np/fnp/lessons",
  "/canada/rn/nclex-rn",
  "/canada/rn/nclex-rn/lessons",
  "/canada/pn/rex-pn",
  "/canada/pn/rex-pn/lessons",
  "/canada/np/cnple",
  "/canada/np/cnple/lessons",
] as const;

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  let xml: string;

  try {
    const { listBlogSitemapEntriesSafe } = await import("@/lib/seo/sitemap-blog-xml");

    const [coreUrls, blogEntries] = await Promise.all([collectCoreUrls(origin), listBlogSitemapEntriesSafe()]);

    const merged: SitemapUrlEntry[] = mergeCoreUrlsWithBlogEntries(coreUrls, blogEntries);
    const filtered = filterPublicSitemapEntries(merged, origin);

    const seen = new Set<string>();
    const unique = filtered.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(unique);
  } catch {
    const fallbackEntries: SitemapUrlEntry[] = FALLBACK_SITEMAP_PATHS.map((path) => ({
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
