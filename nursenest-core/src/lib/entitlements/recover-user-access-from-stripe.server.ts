import "server-only";

import { emitBillingAudit, prefixUserId } from "@/lib/observability/billing-entitlement-audit";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { reconcileUserSubscriptionFromStripe } from "@/lib/subscriptions/stripe-subscription-reconcile";
import { getUserAccessFresh, invalidateRuntimeUserAccessCache, type UserAccess } from "@/lib/entitlements/get-user-access";

const RECOVERY_THROTTLE_MS = 60_000;
const recoveryAttempts = new Map<string, number>();

export type StripeAccessRecoveryResult =
  | {
      attempted: true;
      recovered: boolean;
      reason: "stripe_subscription_reconciled" | "no_stripe_subscription" | "fresh_access_still_inactive";
      userAccess: UserAccess | null;
    }
  | {
      attempted: false;
      recovered: false;
      reason: "recently_attempted";
      userAccess: null;
    }
  | {
      attempted: true;
      recovered: false;
      reason: "reconcile_failed";
      userAccess: null;
    };

function throttleKey(userId: string, surface: string): string {
  return `${surface}:${userId}`;
}

export async function maybeRecoverUserAccessFromStripe(args: {
  userId: string;
  surface: string;
  correlation?: string;
}): Promise<StripeAccessRecoveryResult> {
  const key = throttleKey(args.userId, args.surface);
  const now = Date.now();
  const last = recoveryAttempts.get(key);
  if (last && now - last < RECOVERY_THROTTLE_MS) {
    return { attempted: false, recovered: false, reason: "recently_attempted", userAccess: null };
  }
  if (recoveryAttempts.size > 5000) recoveryAttempts.clear();
  recoveryAttempts.set(key, now);

  safeServerLog("entitlement", "stripe_access_recovery_started", {
    surface: args.surface,
    userIdPrefix: args.userId.slice(0, 8),
    correlation: args.correlation ?? "",
  });

  try {
    const result = await reconcileUserSubscriptionFromStripe(args.userId, {
      surface: args.surface,
    });

    if (!result.stripeSubscription) {
      emitBillingAudit("reconciliation_mismatch_found", {
        correlationId: args.correlation,
        userIdPrefix: prefixUserId(args.userId),
        source: "reconciliation",
        reason: "no_controlling_stripe_subscription",
        operation: args.surface,
        severity: "warn",
      });
      return { attempted: true, recovered: false, reason: "no_stripe_subscription", userAccess: null };
    }

    invalidateRuntimeUserAccessCache(args.userId);
    const fresh = await getUserAccessFresh(args.userId);
    const recovered = fresh.hasPremium === true;

    emitBillingAudit(recovered ? "reconciliation_repaired" : "reconciliation_mismatch_found", {
      correlationId: args.correlation,
      userIdPrefix: prefixUserId(args.userId),
      subscriptionIdPrefix: result.stripeSubscription.id.slice(0, 14),
      source: "reconciliation",
      reason: recovered ? "subscriber_access_recovered" : "stripe_mirror_present_but_no_access",
      operation: args.surface,
      severity: recovered ? "info" : "warn",
    });

    safeServerLog("entitlement", "stripe_access_recovery_completed", {
      surface: args.surface,
      userIdPrefix: args.userId.slice(0, 8),
      stripeSubscriptionIdPrefix: result.stripeSubscription.id.slice(0, 14),
      recovered: recovered ? 1 : 0,
      freshReason: fresh.reason,
      freshPlanStatus: fresh.plan.status,
      correlation: args.correlation ?? "",
      severity: recovered ? "info" : "warning",
    });

    return {
      attempted: true,
      recovered,
      reason: recovered ? "stripe_subscription_reconciled" : "fresh_access_still_inactive",
      userAccess: fresh,
    };
  } catch (error) {
    safeServerLogCritical(
      "entitlement",
      "stripe_access_recovery_failed",
      {
        surface: args.surface,
        userIdPrefix: args.userId.slice(0, 8),
        correlation: args.correlation ?? "",
        severity: "error",
      },
      error,
    );
    return { attempted: true, recovered: false, reason: "reconcile_failed", userAccess: null };
  }
}
