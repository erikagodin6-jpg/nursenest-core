import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectAlliedMarketingUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Allied-only public urlset: canonical occupation marketing hubs on www (see {@link collectAlliedMarketingUrls}).
 * Never 503 — if filtering removes everything, falls back to `/allied-health` alone.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());
  const raw: SitemapUrlEntry[] = collectAlliedMarketingUrls(origin).map((loc) => ({ loc }));
  let entries = filterPublicSitemapEntries(raw, origin);
  if (entries.length === 0) {
    entries = filterPublicSitemapEntries([{ loc: `${origin}/allied-health` }], origin);
  }
  const xml = buildSitemapUrlsetFromAbsoluteUrls(entries.length > 0 ? entries : [{ loc: `${origin}/allied-health` }]);

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
