import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { buildLanguageSitemapXml } from "@/lib/seo/language-sitemap-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const xml = await buildLanguageSitemapXml("en");
  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
