import "server-only";

/**
 * Wraps Route Handler bodies so failures return JSON instead of throwing through Next.js.
 */
import { NextResponse } from "next/server";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export async function safeJsonRoute(
  routeLabel: string,
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (e) {
    safeServerLogCritical("api", "safe_route_error", { route: routeLabel.slice(0, 120) }, e);
    return NextResponse.json(
      { error: "Service temporarily unavailable", code: "internal_error" },
      { status: 503 },
    );
  }
}
