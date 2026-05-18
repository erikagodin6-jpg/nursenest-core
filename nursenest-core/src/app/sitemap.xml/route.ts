import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { buildSitemapIndexXmlForOrigin } from "@/lib/seo/sitemap-index-children";
import { normalizeOrigin } from "@/lib/seo/sitemap-static-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

const STATIC_SITEMAP_PATHS = ["/sitemap.xml"] as const;

/**
 * Public **sitemap index** listing child urlsets (`sitemap-core`, `sitemap-blog`, `sitemap-pathways`, `sitemap-lessons`,
 * `sitemap-localized`, `sitemap-clinical-modules`, `sitemap-allied`, `sitemap-new-grad`). No DB — always 200 with valid XML (never 503).
 * Child routes enforce {@link filterPublicSitemapEntries} and DB fallbacks.
 * Response content-type is application/xml via {@link SITEMAP_XML_HEADERS}.
 *
 * Critical SEO invariant: the sitemap index must always emit the canonical HTTPS www origin. Do not read
 * NEXT_PUBLIC_APP_URL here; production env drift has previously made the root index advertise non-www child sitemaps.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  void STATIC_SITEMAP_PATHS;
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const xml = buildSitemapIndexXmlForOrigin(origin);

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
