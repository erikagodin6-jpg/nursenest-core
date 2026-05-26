import { NextResponse } from "next/server";
import type { AccessScope, UserAccess } from "@/lib/entitlements/get-user-access";
import { requireSubscriberSessionDeps } from "@/lib/entitlements/require-subscriber-session-deps";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { recordEntitlementResolveFailureSignal } from "@/lib/observability/production-signal-metrics";
import { productEvent } from "@/lib/observability/product-events";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import {
  getAuthSessionWithJwtCookieFallback,
  sessionHasUserIdentity,
} from "@/lib/auth/server-session-jwt-fallback";

export type SubscriberSessionOk = { ok: true; userId: string; entitlement: AccessScope; userAccess: UserAccess };
export type SubscriberSessionFail = { ok: false; response: NextResponse };
export type SubscriberSessionResult = SubscriberSessionOk | SubscriberSessionFail;

export function notSubscribedResponse() {
  return NextResponse.json(
    { code: "not_subscribed", message: "Subscription required" },
    { status: 403, headers: mergeSubscriberPrivateCacheHeaders() },
  );
}

/**
 * Single gate for subscriber-only APIs: session + entitlement resolution.
 * Avoid duplicating auth/403 logic across route handlers.
 */
export async function requireSubscriberSession(): Promise<SubscriberSessionResult> {
  const correlation = (await requireSubscriberSessionDeps.correlationIdFromHeaders()) ?? "";

  let session: unknown = null;
  try {
    session = await requireSubscriberSessionDeps.auth();
  } catch (error) {
    safeServerLog("auth", "subscriber_gate_session_read_failed", {
      surface: "subscriber_gate",
      correlation,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
      severity: "warning",
    });
    session = null;
  }

  // Parity with `getProtectedRouteSession`: Node `auth()` can miss cookies under proxy/secure-cookie
  // variation or throw under load. Use a JWT fallback before treating a request as unauthenticated.
  if (!sessionHasUserIdentity(session as never)) {
    try {
      const fallback = await getAuthSessionWithJwtCookieFallback();
      if (sessionHasUserIdentity(fallback)) session = fallback;
    } catch {
      // ignore
    }
  }

  const userId = (session as { user?: { id?: string } } | null)?.user?.id;
  if (!userId) {
    safeServerLog("access", "unauthorized_no_session", {
      surface: "subscriber_gate",
      correlation,
      severity: "expected_denial",
    });
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized", code: "unauthorized" },
        { status: 401, headers: mergeSubscriberPrivateCacheHeaders() },
      ),
    };
  }

  setSentryServerContext({ route: "requireSubscriberSession", feature: SERVER_FEATURE.entitlement, userId });

  let userAccess: UserAccess;
  try {
    userAccess = await requireSubscriberSessionDeps.getUserAccess(userId);
  } catch (e) {
    productEvent("entitlement_resolve_failed", { surface: "subscriber_api" });
    recordEntitlementResolveFailureSignal("subscriber_api", correlation || undefined);
    emitStructuredLog("entitlement_resolve_failed", "error", {
      correlationId: correlation || undefined,
      route: "api:requireSubscriberSession",
      method: "GET",
      flow: "content",
      errorClass: e instanceof Error ? e.name : typeof e,
      message: "getUserAccess failed in subscriber gate",
    });
    safeServerLogCritical(
      "entitlement",
      "resolve_failed",
      { api: "subscriber_gate", correlation, severity: "error" },
      e,
    );
    const headers = mergeSubscriberPrivateCacheHeaders();
    headers.set("Retry-After", "3");
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unable to verify access. Try again shortly.", code: "access_verify_failed", retryable: true },
        { status: 503, headers },
      ),
    };
  }

  const entitlement = requireSubscriberSessionDeps.accessScopeFromUserAccess(userAccess);

  if (!entitlement.hasAccess) {
    safeServerLog("access", "denied", {
      reason: "no_active_entitlement",
      surface: "subscriber_gate",
      outcome: "premium_api_403",
      userIdPrefix: userId.slice(0, 8),
      tier: String(entitlement.tier ?? ""),
      country: String(entitlement.country ?? ""),
      accessReason: userAccess.reason,
      planStatus: userAccess.plan.status,
      expiresAt: userAccess.plan.expiresAt?.toISOString() ?? "",
      correlation,
      severity: "expected_denial",
    });
    return {
      ok: false,
      response: notSubscribedResponse(),
    };
  }

  const block = await requireSubscriberSessionDeps.maybeBlockOrTouchAccountSharingAfterSubscriberOk(userId, userAccess);
  if (block) {
    return { ok: false, response: block };
  }

  safeServerLog("access", "subscriber_gate_allowed", {
    surface: "subscriber_gate",
    outcome: "premium_api_allowed",
    userIdPrefix: userId.slice(0, 8),
    tier: String(entitlement.tier ?? ""),
    country: String(entitlement.country ?? ""),
    accessReason: userAccess.reason,
    planStatus: userAccess.plan.status,
    expiresAt: userAccess.plan.expiresAt?.toISOString() ?? "",
    correlation,
  });

  return { ok: true, userId, entitlement, userAccess };
}
