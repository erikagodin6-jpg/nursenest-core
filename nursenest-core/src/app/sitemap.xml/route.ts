import {
  crawlSurfaceErrorCode,
  logCrawlSurfaceEvent,
} from "@/lib/observability/crawl-surface-observability";
import { buildSingleSitemapXmlSafe } from "@/lib/seo/sitemap-all-xml";
import { minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

/**
 * Single sitemap urlset at `/sitemap.xml` (canonical crawler entrypoint).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Log when generation crosses this — sitemap work includes optional Prisma (blog + pathway URLs). */
const SITEMAP_SLOW_MS = 1500;

const SITEMAP_PATHNAME = "/sitemap.xml";

export async function GET() {
  const t0 = Date.now();
  try {
    const xml = await buildSingleSitemapXmlSafe();
    const ms = Date.now() - t0;
    const approxLen = typeof xml === "string" ? xml.length : 0;
    if (ms > SITEMAP_SLOW_MS) {
      logCrawlSurfaceEvent({
        routeType: "marketing.sitemap_xml",
        pathname: SITEMAP_PATHNAME,
        durationMs: ms,
        outcome: "ok_slow",
        httpStatus: 200,
        approxResponseLen: approxLen,
        slow: true,
      });
    }
    if (!xml || typeof xml !== "string" || xml.length < 80) {
      logCrawlSurfaceEvent({
        routeType: "marketing.sitemap_xml",
        pathname: SITEMAP_PATHNAME,
        durationMs: ms,
        outcome: "fallback",
        httpStatus: 200,
        fallback: true,
        approxResponseLen: approxLen,
        errorCode: "sitemap_degenerate_body",
      });
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    return sitemapXmlResponse(xml);
  } catch (e) {
    const ms = Date.now() - t0;
    logCrawlSurfaceEvent({
      routeType: "marketing.sitemap_xml",
      pathname: SITEMAP_PATHNAME,
      durationMs: ms,
      outcome: "fallback",
      httpStatus: 200,
      fallback: true,
      errorCode: crawlSurfaceErrorCode(e),
    });
    try {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    } catch (inner) {
      logCrawlSurfaceEvent({
        routeType: "marketing.sitemap_xml",
        pathname: SITEMAP_PATHNAME,
        durationMs: Date.now() - t0,
        outcome: "fallback",
        httpStatus: 200,
        fallback: true,
        errorCode: crawlSurfaceErrorCode(inner),
      });
      return sitemapXmlResponse(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.nursenest.ca/</loc></url></urlset>`,
      );
    }
  }
}
