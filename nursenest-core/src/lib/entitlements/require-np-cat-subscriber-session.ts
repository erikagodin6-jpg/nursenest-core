import { NextResponse } from "next/server";
import type { SubscriberSessionFail, SubscriberSessionOk } from "@/lib/entitlements/require-subscriber-session";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { assertNpCatPathwayEntitlement } from "@/lib/entitlements/np-cat-pathway-guard";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type NpCatSubscriberSessionResult = SubscriberSessionOk | SubscriberSessionFail;

/**
 * Subscriber API gate for NP CAT routes.
 *
 * Generic subscriber access is not enough for NP CAT: RN, RPN, and Allied paid users
 * must not be able to continue or read NP-only CAT sessions through direct API calls.
 */
export async function requireNpCatSubscriberSession(surface: string): Promise<NpCatSubscriberSessionResult> {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate;

  const npGuard = assertNpCatPathwayEntitlement(gate.entitlement);
  if (!npGuard.ok) {
    safeServerLog("access", "denied", {
      reason: "np_cat_pathway_not_in_plan",
      surface,
      tier: String(gate.entitlement.tier ?? ""),
      country: String(gate.entitlement.country ?? ""),
      userIdPrefix: gate.userId.slice(0, 8),
      severity: "expected_denial",
    });
    return {
      ok: false,
      response: NextResponse.json(
        { error: "NP pathway subscription required", code: "pathway_not_in_plan" },
        { status: 403, headers: mergeSubscriberPrivateCacheHeaders() },
      ),
    };
  }

  if (npGuard.isAdminOverride) {
    safeServerLog("access", "admin_override_np_cat", {
      surface,
      userIdPrefix: gate.userId.slice(0, 8),
      severity: "audit",
    });
  }

  return gate;
}
