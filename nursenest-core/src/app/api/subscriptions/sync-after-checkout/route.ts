import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

function sessionUserId(session: unknown): string | undefined {
  const u = (session as { user?: unknown } | null)?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id?: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

function sessionHasUserIdentityLocal(session: unknown): boolean {
  const u = (session as { user?: unknown } | null)?.user;
  if (!u || typeof u !== "object") return false;
  const maybe = u as { id?: unknown; email?: unknown };
  return Boolean(
    (typeof maybe.id === "string" && maybe.id.trim()) ||
      (typeof maybe.email === "string" && maybe.email.trim()),
  );
}

function hasConfiguredAuthSecret(): boolean {
  return Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0),
  );
}

async function loadSessionWithFallback(): Promise<unknown> {
  if (!hasConfiguredAuthSecret()) {
    safeServerLog("stripe_checkout", "checkout_success_sync_auth_skipped_missing_secret", {
      route: "/api/subscriptions/sync-after-checkout",
    });
    return null;
  }
  const primary = await import("@/lib/auth")
    .then((m) => m.auth())
    .catch(() => null);
  if (sessionHasUserIdentityLocal(primary)) return primary;
  return import("@/lib/auth/server-session-jwt-fallback")
    .then((m) => m.getAuthSessionWithJwtCookieFallback())
    .catch(() => primary);
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/subscriptions/sync-after-checkout", "billing", async () => {
    const correlation = correlationIdFromRequest(req) ?? undefined;
    const session = await loadSessionWithFallback();
    const userId = sessionUserId(session);
    if (!userId) {
      return NextResponse.json({ ok: false, code: "UNAUTHORIZED", error: "Unauthorized" }, { status: 401 });
    }

    const [{ maybeRecoverUserAccessFromStripe }, { accessScopeFromUserAccess, getUserAccessFresh }] =
      await Promise.all([
        import("@/lib/entitlements/recover-user-access-from-stripe.server"),
        import("@/lib/entitlements/get-user-access"),
      ]);

    const recovery = await maybeRecoverUserAccessFromStripe({
      userId,
      surface: "checkout_success_sync",
      correlation,
    });
    const userAccess = recovery.userAccess ?? (await getUserAccessFresh(userId));
    const entitlement = accessScopeFromUserAccess(userAccess);

    safeServerLog("stripe_checkout", "checkout_success_sync_completed", {
      userIdPrefix: userId.slice(0, 8),
      recovered: recovery.recovered ? 1 : 0,
      recoveryReason: recovery.reason,
      hasPremium: userAccess.hasPremium ? 1 : 0,
      entitlementReason: userAccess.reason,
      planStatus: userAccess.plan.status,
      correlation: correlation ?? "",
    });

    return NextResponse.json({
      ok: true,
      recovered: recovery.recovered,
      recoveryReason: recovery.reason,
      entitlement: {
        hasAccess: entitlement.hasAccess,
        reason: entitlement.reason,
        tier: entitlement.tier,
        country: entitlement.country,
        alliedCareer: entitlement.alliedCareer,
      },
      plan: {
        status: userAccess.plan.status,
        planCode: userAccess.plan.planCode,
        expiresAt: userAccess.plan.expiresAt?.toISOString() ?? null,
        cancelAtPeriodEnd: userAccess.plan.cancelAtPeriodEnd,
      },
    });
  });
}
