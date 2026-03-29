import { buildCoreSitemapXml, minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const xml = buildCoreSitemapXml();
    if (!xml || typeof xml !== "string" || xml.length < 50) {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    return sitemapXmlResponse(xml);
  } catch {
    return sitemapXmlResponse(minimalUrlsetSingleHome());
  }
}
