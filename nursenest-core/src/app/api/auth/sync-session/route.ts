import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { loadSessionIdentityResult } from "@/lib/auth/session-identity-from-db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";

export const dynamic = "force-dynamic";

/**
 * Returns DB-backed tier / country / subscription mirror for JWT refresh after checkout (webhook updates User + Subscription).
 * Identity matches {@link loadSessionIdentityResult} — same source as the Node `session.update()` merge.
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/auth/sync-session", "auth", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identity = await loadSessionIdentityResult(userId);
    if (identity.status === "db_unavailable") {
      const correlationId = correlationIdFromRequest(req);
      emitStructuredLog("entitlement_resolve_failed", "error", {
        correlationId,
        route: "/api/auth/sync-session",
        method: "GET",
        flow: "auth",
        errorClass: "session_identity_db",
        message: "getUserAccess failed during sync-session",
      });
      return NextResponse.json(
        { error: "Unable to verify billing state. Try again shortly.", code: "access_verify_failed" },
        { status: 503 },
      );
    }
    if (identity.status === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { payload } = identity;
    return NextResponse.json({
      tier: payload.tier,
      country: payload.country,
      subscriptionStatus: payload.subscriptionStatus,
      role: payload.role,
      credentialVersion: payload.credentialVersion,
      subscription: payload.subscription,
    });
  });
}
