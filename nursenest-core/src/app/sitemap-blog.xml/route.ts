import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { listBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-blog-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { buildSitemapUrlsetFromAbsoluteUrls, normalizeOrigin } from "@/lib/seo/sitemap-static-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Blog-only public urlset: `/blog`, published posts, RN hub when applicable — same rows as merged sitemap used,
 * but emitted separately for segmented discovery (see `/sitemap.xml` excluding these locs).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  let xml: string;
  try {
    const entries = await listBlogSitemapEntriesSafe();
    const filtered = filterPublicSitemapEntries(entries, origin);
    xml = buildSitemapUrlsetFromAbsoluteUrls(
      filtered.length > 0 ? filtered : [{ loc: `${origin}/blog` }],
    );
  } catch {
    xml = buildSitemapUrlsetFromAbsoluteUrls([{ loc: `${origin}/blog` }]);
  }

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
