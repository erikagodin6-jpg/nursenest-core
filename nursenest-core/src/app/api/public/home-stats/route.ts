import { NextResponse } from "next/server";
import {
  getCachedPublicHomeStats,
  getDegradedPublicHomeStatsFallback,
} from "@/lib/marketing/public-home-stats";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Bounded work — slow DB must not hang the edge function indefinitely. */
export const maxDuration = 30;

/** Public marketing stats — freemium-visible scope only. Same data as homepage SSR (`getCachedPublicHomeStats`). */
export async function GET() {
  try {
    const data = await getCachedPublicHomeStats();
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("api", "public_home_stats_route_failed", { message: msg.slice(0, 200) });
    return NextResponse.json(getDegradedPublicHomeStatsFallback("route_uncaught"), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
