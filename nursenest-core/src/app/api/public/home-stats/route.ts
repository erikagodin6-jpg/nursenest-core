import { NextResponse, type NextRequest } from "next/server";
import { CACHE_HEADER_HOME_STATS } from "@/lib/cache/public-edge-cache";
import {
  getCachedPublicHomeStats,
  getDegradedPublicHomeStatsFallback,
} from "@/lib/marketing/public-home-stats";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { API_ROUTE_MAX_DURATION_PUBLIC_MARKETING_SEC } from "@/lib/server/api-route-constants";
import { safeJsonRoute } from "@/lib/server/safe-api-route";

export const maxDuration = API_ROUTE_MAX_DURATION_PUBLIC_MARKETING_SEC;

/** Public marketing stats — freemium-visible scope only. Same data as homepage SSR (`getCachedPublicHomeStats`). */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/public/home-stats", "public", async () => {
    return safeJsonRoute("GET /api/public/home-stats", async () => {
      try {
        const data = await getCachedPublicHomeStats();
        return NextResponse.json(data, { headers: CACHE_HEADER_HOME_STATS });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        safeServerLog("api", "public_home_stats_route_failed", { message: msg.slice(0, 200) });
        return NextResponse.json(getDegradedPublicHomeStatsFallback("route_uncaught"), {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        });
      }
    });
  });
}
