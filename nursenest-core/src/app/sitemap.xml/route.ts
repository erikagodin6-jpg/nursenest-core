import { buildSitemapIndexXmlSafe, minimalSitemapIndexXml } from "@/lib/seo/sitemap-static-xml";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

/**
 * Sitemap index at `/sitemap.xml` — references `/sitemaps/*.xml` child sitemaps.
 * No Prisma; always 200 with application/xml.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const xml = buildSitemapIndexXmlSafe();
    if (!xml || typeof xml !== "string" || xml.length < 80) {
      return sitemapXmlResponse(minimalSitemapIndexXml());
    }
    return sitemapXmlResponse(xml);
  } catch {
    try {
      return sitemapXmlResponse(minimalSitemapIndexXml());
    } catch {
      return sitemapXmlResponse(
        `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.nursenest.ca/sitemaps/core.xml</loc></sitemap></sitemapindex>`,
      );
    }
  }
}
