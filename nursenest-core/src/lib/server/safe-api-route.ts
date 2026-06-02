import "server-only";

/**
 * Wraps Route Handler bodies so failures return JSON instead of throwing through Next.js.
 */
import { NextResponse } from "next/server";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" } as const;

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
      { status: 503, headers: JSON_HEADERS },
    );
  }
}

/**
 * Read-heavy routes: uncaught failures return **200 + degraded payload** so clients can render
 * empty states instead of hard error screens (non-critical / list / tag endpoints).
 * Do **not** use for auth or mutations — prefer {@link safeJsonRoute} + explicit 4xx/5xx.
 */
export async function safeJsonReadRoute<T extends Record<string, unknown>>(
  routeLabel: string,
  handler: () => Promise<Response>,
  degradedBody: T,
): Promise<Response> {
  try {
    return await handler();
  } catch (e) {
    safeServerLogCritical("api", "safe_read_route_degraded", { route: routeLabel.slice(0, 120) }, e);
    return NextResponse.json(
      { ...degradedBody, degraded: true, code: "degraded_read" as const },
      { status: 200, headers: { ...JSON_HEADERS, "Cache-Control": "no-store" } },
    );
  }
}
