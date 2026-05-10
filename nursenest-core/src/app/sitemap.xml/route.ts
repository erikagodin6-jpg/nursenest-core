import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { buildSitemapIndexXmlForOrigin } from "@/lib/seo/sitemap-index-children";
import { normalizeOrigin } from "@/lib/seo/sitemap-static-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Public **sitemap index** listing child urlsets (`sitemap-core`, `sitemap-blog`, `sitemap-lessons`,
 * `sitemap-allied`, `sitemap-new-grad`). No DB — always 200 with valid XML (never 503).
 * Child routes enforce {@link filterPublicSitemapEntries} and DB fallbacks.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());
  const xml = buildSitemapIndexXmlForOrigin(origin);

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
