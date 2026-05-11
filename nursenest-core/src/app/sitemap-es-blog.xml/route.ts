import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  let xml: string;
  try {
    const { buildMultilingualBlogSitemapXmlForLocale } = await import("@/lib/seo/sitemap-multilingual-blog-xml");
    xml = await buildMultilingualBlogSitemapXmlForLocale("es");
  } catch {
    xml = minimalUrlsetSingleHome();
  }

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
