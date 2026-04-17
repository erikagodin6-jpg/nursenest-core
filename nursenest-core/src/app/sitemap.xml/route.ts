import { buildSingleSitemapXmlSafe } from "@/lib/seo/sitemap-all-xml";
import { minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

/**
 * Single sitemap urlset at `/sitemap.xml` (canonical crawler entrypoint).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Log when generation crosses this — sitemap work includes optional Prisma (blog + pathway URLs). */
const SITEMAP_SLOW_MS = 1500;

export async function GET() {
  const t0 = Date.now();
  try {
    const xml = await buildSingleSitemapXmlSafe();
    const ms = Date.now() - t0;
    if (ms > SITEMAP_SLOW_MS) {
      safeServerLog("crawl_surface", "sitemap_xml_build_slow", {
        ms,
        approxLen: typeof xml === "string" ? xml.length : 0,
      });
    }
    if (!xml || typeof xml !== "string" || xml.length < 80) {
      safeServerLog("seo", "sitemap_xml_response_degenerate_fallback", {
        len: typeof xml === "string" ? xml.length : 0,
        ms,
      });
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    return sitemapXmlResponse(xml);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    safeServerLog("seo", "sitemap_xml_route_caught_error", {
      detail: detail.slice(0, 400),
      ms: Date.now() - t0,
    });
    try {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    } catch (inner) {
      const innerDetail = inner instanceof Error ? inner.message : String(inner);
      safeServerLog("seo", "sitemap_xml_route_minimal_failed", {
        detail: innerDetail.slice(0, 200),
        ms: Date.now() - t0,
      });
      return sitemapXmlResponse(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.nursenest.ca/</loc></url></urlset>`,
      );
    }
  }
}
