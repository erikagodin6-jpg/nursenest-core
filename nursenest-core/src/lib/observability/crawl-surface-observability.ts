/**
 * Unified, low-cardinality observability for crawl-critical public routes.
 * No PII — pathname segments only, bounded strings, stderr via {@link safeServerLog}.
 */
import { safeServerLog, type SafeLogMeta } from "@/lib/observability/safe-server-log";

export type CrawlSurfaceRouteType =
  | "marketing.home"
  | "marketing.sitemap_xml"
  | "marketing.robots_txt"
  | "marketing.exam_hub"
  | "marketing.pathway_lesson"
  | "marketing.blog_post"
  | "metadata.generation";

/**
 * High-level result for triage (search: `crawl_surface public_route`):
 * - **ok** — normal 200 HTML or small XML/text
 * - **ok_slow** — succeeded but exceeded latency threshold (separate field `slow: true`)
 * - **error** — uncaught exception or HTTP 5xx-class where applicable
 * - **not_found** — Next.js `notFound()` (404)
 * - **fallback** — degraded body (sitemap minimal xml, robots fallback, or FALLBACK_SITE_METADATA)
 * - **redirect** — reserved for explicit redirect instrumentation (optional)
 */
export type CrawlSurfaceOutcome = "ok" | "ok_slow" | "error" | "not_found" | "fallback" | "redirect";

const PATH_MAX = 220;

export function durationBucketMs(ms: number): "lt_200ms" | "lt_1s" | "lt_3s" | "gte_3s" {
  if (ms < 200) return "lt_200ms";
  if (ms < 1000) return "lt_1s";
  if (ms < 3000) return "lt_3s";
  return "gte_3s";
}

/** Bounded error token for logs (no stack traces). */
export function crawlSurfaceErrorCode(e: unknown): string {
  if (e instanceof Error) {
    const name = e.name?.replace(/\s+/g, "_").slice(0, 40) || "Error";
    const firstLine = e.message.split("\n")[0]?.trim().slice(0, 80) || "unknown";
    return `${name}:${firstLine}`;
  }
  return String(e).slice(0, 100);
}

function isNextNotFoundError(e: unknown): boolean {
  if (typeof e !== "object" || e === null) return false;
  const digest = "digest" in e ? String((e as { digest?: unknown }).digest) : "";
  return digest === "NEXT_NOT_FOUND" || digest.includes("NOT_FOUND");
}

export type CrawlSurfaceEvent = {
  routeType: CrawlSurfaceRouteType;
  pathname: string;
  durationMs: number;
  outcome: CrawlSurfaceOutcome;
  httpStatus?: number;
  errorCode?: string;
  fallback?: boolean;
  notFound?: boolean;
  redirect?: boolean;
  /** Set when work succeeded but exceeded `slowMs` threshold (HTML/data phases). */
  slow?: boolean;
};

function toMeta(e: CrawlSurfaceEvent): SafeLogMeta {
  const path = e.pathname.trim().slice(0, PATH_MAX);
  const out: SafeLogMeta = {
    route_type: e.routeType,
    pathname: path || "/",
    duration_ms: Math.min(Math.max(0, Math.floor(e.durationMs)), 600_000),
    duration_bucket: durationBucketMs(e.durationMs),
    outcome: e.outcome,
  };
  if (e.httpStatus !== undefined) out.http_status = e.httpStatus;
  if (e.errorCode) out.error_code = e.errorCode.slice(0, 120);
  if (e.fallback === true) out.fallback = true;
  if (e.notFound === true) out.not_found = true;
  if (e.redirect === true) out.redirect = true;
  if (e.slow === true) out.slow = true;
  return out;
}

/** Single structured line per call — use for crawl-critical paths only. */
export function logCrawlSurfaceEvent(event: CrawlSurfaceEvent): void {
  safeServerLog("crawl_surface", "public_route", toMeta(event));
}

/**
 * Wraps a server component render: logs **not_found**, **error**, and **ok_slow** (default ≥ 2500 ms).
 * Re-throws after logging.
 */
export async function withCrawlSurfacePageRender<T>(
  routeType: Exclude<CrawlSurfaceRouteType, "metadata.generation">,
  pathname: string,
  fn: () => Promise<T>,
  options?: { slowOkMs?: number },
): Promise<T> {
  const t0 = Date.now();
  const slowMs = options?.slowOkMs ?? 2500;
  try {
    const result = await fn();
    const durationMs = Date.now() - t0;
    if (durationMs >= slowMs) {
      logCrawlSurfaceEvent({
        routeType,
        pathname,
        durationMs,
        outcome: "ok_slow",
        httpStatus: 200,
        slow: true,
      });
    }
    return result;
  } catch (e) {
    const durationMs = Date.now() - t0;
    if (isNextNotFoundError(e)) {
      logCrawlSurfaceEvent({
        routeType,
        pathname,
        durationMs,
        outcome: "not_found",
        httpStatus: 404,
        notFound: true,
      });
    } else {
      logCrawlSurfaceEvent({
        routeType,
        pathname,
        durationMs,
        outcome: "error",
        errorCode: crawlSurfaceErrorCode(e),
      });
    }
    throw e;
  }
}
