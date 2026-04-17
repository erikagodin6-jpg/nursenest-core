import { buildSingleSitemapXmlSafe } from "@/lib/seo/sitemap-all-xml";
import { minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { safeServerLog } from "@/lib/observability/safe-server-log";
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
      safeServerLog("seo", "sitemap_xml_response_degenerate_fallback", { len: typeof xml === "string" ? xml.length : 0 });
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    return sitemapXmlResponse(xml);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    safeServerLog("seo", "sitemap_xml_route_caught_error", { detail: detail.slice(0, 400) });
    try {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    } catch (inner) {
      const innerDetail = inner instanceof Error ? inner.message : String(inner);
      safeServerLog("seo", "sitemap_xml_route_minimal_failed", { detail: innerDetail.slice(0, 200) });
      return sitemapXmlResponse(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.nursenest.ca/</loc></url></urlset>`,
      );
    }
  }
}
