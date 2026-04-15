import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { accessScopeFromUserAccess, getUserAccess, type AccessScope, type UserAccess } from "@/lib/entitlements/get-user-access";
import { correlationIdFromHeaders } from "@/lib/observability/request-correlation";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export type SubscriberSessionOk = { ok: true; userId: string; entitlement: AccessScope; userAccess: UserAccess };
export type SubscriberSessionFail = { ok: false; response: NextResponse };
export type SubscriberSessionResult = SubscriberSessionOk | SubscriberSessionFail;

export function notSubscribedResponse() {
  return NextResponse.json({ code: "not_subscribed", message: "Subscription required" }, { status: 403 });
}

/**
 * Single gate for subscriber-only APIs: session + entitlement resolution.
 * Avoid duplicating auth/403 logic across route handlers.
 */
export async function requireSubscriberSession(): Promise<SubscriberSessionResult> {
  const correlation = (await correlationIdFromHeaders()) ?? "";
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    safeServerLog("access", "unauthorized_no_session", {
      surface: "subscriber_gate",
      correlation,
      severity: "expected_denial",
    });
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 }),
    };
  }

  setSentryServerContext({ route: "requireSubscriberSession", feature: SERVER_FEATURE.entitlement, userId });

  let userAccess: UserAccess;
  try {
    userAccess = await getUserAccess(userId);
  } catch (e) {
    safeServerLogCritical(
      "entitlement",
      "resolve_failed",
      { api: "subscriber_gate", correlation, severity: "error" },
      e,
    );
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unable to verify access. Try again shortly.", code: "access_verify_failed" },
        { status: 503 },
      ),
    };
  }

  const entitlement = accessScopeFromUserAccess(userAccess);

  if (!entitlement.hasAccess) {
    safeServerLog("access", "denied", {
      reason: "no_active_entitlement",
      surface: "subscriber_gate",
      userIdPrefix: userId.slice(0, 8),
      tier: String(entitlement.tier ?? ""),
      country: String(entitlement.country ?? ""),
      correlation,
      severity: "expected_denial",
    });
    return {
      ok: false,
      response: notSubscribedResponse(),
    };
  }

  return { ok: true, userId, entitlement, userAccess };
}
