import {
  crawlSurfaceErrorCode,
  logCrawlSurfaceEvent,
} from "@/lib/observability/crawl-surface-observability";
import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { buildSingleSitemapXmlSafe } from "@/lib/seo/sitemap-all-xml";
import { SeoHttpValidationStrictError } from "@/lib/seo/seo-http-emit-validation";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

/**
 * Single sitemap urlset at `/sitemap.xml` (canonical crawler entrypoint).
 *
 * Force runtime generation. On generation failure (DB unreachable, merge invariants, etc.) this route
 * returns **503** with a short plain-text body — it does **not** fall back to a misleading home-only
 * urlset (crawlers must see failure, not a false “single URL” success).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Large merged urlsets (pathway lessons + locales + blog) can exceed default platform limits. */
export const maxDuration = 120;

/** Log when generation crosses this — sitemap work includes optional Prisma (blog + pathway URLs). */
const SITEMAP_SLOW_MS = 1500;

const SITEMAP_PATHNAME = "/sitemap.xml";

function sitemapFailureResponse(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store, must-revalidate",
    },
  });
}

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
    safeServerLog("seo", "sitemap_xml_request_complete", {
      durationMs: String(ms),
      approxLen: String(approxLen),
    });
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
      safeServerLog("seo", "sitemap_xml_invalid_body", { approxLen: String(approxLen) });
      logCrawlSurfaceEvent({
        routeType: "marketing.sitemap_xml",
        pathname: SITEMAP_PATHNAME,
        durationMs: ms,
        outcome: "error",
        httpStatus: 503,
        fallback: false,
        approxResponseLen: approxLen,
        errorCode: "sitemap_degenerate_body",
      });
      return sitemapFailureResponse(
        503,
        "Sitemap generation produced an empty or truncated body. See logs (sitemap_degenerate_body).",
      );
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
        {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "private, no-store",
          },
        },
      );
    }
    const ms = Date.now() - t0;
    const detail = e instanceof Error ? e.message : String(e);
    safeServerLog("seo", "sitemap_xml_generation_failed", {
      detail: detail.slice(0, 800),
      code: crawlSurfaceErrorCode(e),
    });
    logCrawlSurfaceEvent({
      routeType: "marketing.sitemap_xml",
      pathname: SITEMAP_PATHNAME,
      durationMs: ms,
      outcome: "error",
      httpStatus: 503,
      fallback: false,
      errorCode: crawlSurfaceErrorCode(e),
    });
    return sitemapFailureResponse(
      503,
      `Sitemap generation failed: ${detail.slice(0, 500)}. See server logs (sitemap_xml_generation_failed / sitemap_merged_build_failed).`,
    );
  }
}
