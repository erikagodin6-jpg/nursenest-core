import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectNewGradMarketingUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * New Grad–only public urlset: `/new-grad` and unit pages (see {@link collectNewGradMarketingUrls}).
 * Never 503 — if filtering removes everything, falls back to `/new-grad` alone.
 */
export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());
  const raw: SitemapUrlEntry[] = collectNewGradMarketingUrls(origin).map((loc) => ({ loc }));
  let entries = filterPublicSitemapEntries(raw, origin);
  if (entries.length === 0) {
    entries = filterPublicSitemapEntries([{ loc: `${origin}/new-grad` }], origin);
  }
  const xml = buildSitemapUrlsetFromAbsoluteUrls(entries.length > 0 ? entries : [{ loc: `${origin}/new-grad` }]);

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
