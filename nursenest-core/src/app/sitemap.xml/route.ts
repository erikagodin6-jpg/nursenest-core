import {
  crawlSurfaceErrorCode,
  logCrawlSurfaceEvent,
} from "@/lib/observability/crawl-surface-observability";
import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { buildSingleSitemapXmlSafe } from "@/lib/seo/sitemap-all-xml";
import { minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { SeoHttpValidationStrictError } from "@/lib/seo/seo-http-emit-validation";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

/**
 * Single sitemap urlset at `/sitemap.xml` (canonical crawler entrypoint).
 *
 * Force runtime generation: build-time prerender of this route can hang or fail
 * when optional DB-backed sitemap enrichment cannot reach Postgres in CI/App Platform.
 * Freshness is still controlled by explicit sitemap cache headers.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Log when generation crosses this — sitemap work includes optional Prisma (blog + pathway URLs). */
const SITEMAP_SLOW_MS = 1500;

const SITEMAP_PATHNAME = "/sitemap.xml";

function cachedSitemapXmlResponse(req: Request, xml: string): Response {
  const response = sitemapXmlResponse(xml);
  const headers = new Headers(response.headers);
  const etag = buildPublicResponseEtag(xml);
  headers.set("ETag", etag);
  if (requestMatchesEtag(req, etag)) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(xml, { status: 200, headers });
}

export async function GET(req: Request) {
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
      return cachedSitemapXmlResponse(req, minimalUrlsetSingleHome());
    }
    return cachedSitemapXmlResponse(req, xml);
  } catch (e) {
    if (e instanceof SeoHttpValidationStrictError) {
      const ms = Date.now() - t0;
      safeServerLog("seo", "sitemap_xml_strict_validation_failed", {
        count: String(e.failures.length),
        firstUrl: e.failures[0]?.url?.slice(0, 500) ?? "",
        firstStatus: String(e.failures[0]?.status ?? ""),
      });
      logCrawlSurfaceEvent({
        routeType: "marketing.sitemap_xml",
        pathname: SITEMAP_PATHNAME,
        durationMs: ms,
        outcome: "error",
        httpStatus: 503,
        fallback: false,
        errorCode: "seo_http_validation_strict",
      });
      return new Response(
        `Sitemap withheld: HTTP validation failed for ${e.failures.length} URL(s). See logs (seo_http_validation_strict).`,
        { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
      );
    }
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
      return cachedSitemapXmlResponse(req, minimalUrlsetSingleHome());
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
      return cachedSitemapXmlResponse(
        req,
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.nursenest.ca/</loc></url></urlset>`,
      );
    }
  }
}
