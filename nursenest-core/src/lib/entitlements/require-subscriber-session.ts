import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveEntitlement, type AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export type SubscriberSessionOk = { ok: true; userId: string; entitlement: AccessScope };
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
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 }),
    };
  }

  setSentryServerContext({ route: "requireSubscriberSession", feature: SERVER_FEATURE.entitlement, userId });

  let entitlement: AccessScope;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("entitlement", "resolve_failed", { api: "subscriber_gate" }, e);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unable to verify access. Try again shortly.", code: "access_verify_failed" },
        { status: 503 },
      ),
    };
  }

  if (!entitlement.hasAccess) {
    safeServerLog("access", "denied", {
      reason: "no_active_entitlement",
      surface: "subscriber_gate",
      userIdPrefix: userId.slice(0, 8),
      tier: String(entitlement.tier ?? ""),
      country: String(entitlement.country ?? ""),
    });
    return {
      ok: false,
      response: notSubscribedResponse(),
    };
  }

  return { ok: true, userId, entitlement };
}
