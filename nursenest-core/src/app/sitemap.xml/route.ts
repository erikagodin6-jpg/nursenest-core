import { buildSingleSitemapXmlSafe } from "@/lib/seo/sitemap-all-xml";
import { minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

/**
 * Single sitemap urlset at `/sitemap.xml` (canonical crawler entrypoint).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const xml = await buildSingleSitemapXmlSafe();
    if (!xml || typeof xml !== "string" || xml.length < 80) {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    return sitemapXmlResponse(xml);
  } catch {
    try {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    } catch {
      return sitemapXmlResponse(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.nursenest.ca/</loc></url></urlset>`,
      );
    }
  }
}
