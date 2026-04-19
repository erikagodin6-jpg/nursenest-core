import type { NextRequest } from "next/server";
import { CACHE_HEADER_HOME_STATS } from "@/lib/cache/public-edge-cache";
import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import {
  getCachedPublicHomeStats,
  getDegradedPublicHomeStatsFallback,
} from "@/lib/marketing/public-home-stats";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import {
  captureSentrySoftError,
  withSentryServerSpan,
} from "@/lib/observability/sentry-route-observability";
import { getOrSetJsonCache } from "@/lib/server/cache";
import { safeJsonRoute } from "@/lib/server/safe-api-route";

/** Keep numeric literal — Next segment config must be statically analyzable (see `API_ROUTE_MAX_DURATION_PUBLIC_MARKETING_SEC`). */
export const maxDuration = 30;

/** Public marketing stats — freemium-visible scope only. Same data as homepage SSR (`getCachedPublicHomeStats`). */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/public/home-stats", "public", async () => {
    return safeJsonRoute("GET /api/public/home-stats", async () => {
      setSentryServerContext({ route: "/api/public/home-stats", feature: SERVER_FEATURE.api });
      try {
        const data = await withSentryServerSpan(
          {
            name: "api.public.home_stats.load",
            op: "http.server",
            attributes: { route: "/api/public/home-stats" },
          },
          async () =>
            getOrSetJsonCache(
              "cache:api:public-home-stats:v1",
              async () => getCachedPublicHomeStats(),
              { ttlSeconds: 120 },
            ),
        );
        const body = JSON.stringify(data);
        const etag = buildPublicResponseEtag(body);
        const headers = new Headers(CACHE_HEADER_HOME_STATS);
        headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("ETag", etag);
        if (requestMatchesEtag(req, etag)) {
          return new Response(null, { status: 304, headers });
        }
        return new Response(body, { status: 200, headers });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        safeServerLog("api", "public_home_stats_route_failed", { message: msg.slice(0, 200) });
        captureSentrySoftError({
          scope: "api_public_home_stats",
          event: "route_failed",
          error: e,
          route: "/api/public/home-stats",
          feature: SERVER_FEATURE.api,
          meta: { message: msg.slice(0, 200) },
        });
        const degradedBody = JSON.stringify(getDegradedPublicHomeStatsFallback("route_uncaught"));
        const etag = buildPublicResponseEtag(degradedBody);
        const headers = new Headers(CACHE_HEADER_HOME_STATS);
        headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("ETag", etag);
        if (requestMatchesEtag(req, etag)) {
          return new Response(null, { status: 304, headers });
        }
        return new Response(degradedBody, { status: 200, headers });
      }
    });
  });
}
