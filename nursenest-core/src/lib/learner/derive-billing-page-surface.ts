import { SubscriptionStatus, TierCode, TrialStatus } from "@prisma/client";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import type { BillingSubscriptionRow, BillingUserRow } from "@/lib/learner/billing-page-payload-types";

export type BillingStatusSurface =
  | "active_scheduled_cancel"
  | "active_paid"
  | "grace"
  | "past_due_grace"
  | "past_due"
  /** Subscription is canceled in billing records but paid access continues until `billingPeriodEndDisplay`. */
  | "canceled_access_until"
  | "cancelled"
  | "trial"
  | "trial_ending"
  | "inactive"
  /** Paid Allied subscription exists but occupation scope is missing — study tools stay gated until repaired. */
  | "allied_occupation_incomplete"
  | "admin";

/**
 * Maps subscription row + entitlement reason to the billing page status banner.
 * Kept free of `server-only` so unit tests can import it.
 */
export function deriveBillingSurface(args: {
  user: BillingUserRow;
  subscription: BillingSubscriptionRow | null;
  hasAccess: boolean;
  entitlementReason: AccessScope["reason"] | "error";
  /** Effective tier after Stripe mirror (used for Allied occupation gate banner). */
  effectiveTier?: TierCode;
  trialEndsAt: Date | null;
  /**
   * When staff use signed **admin learner QA** simulation, entitlement reflects the simulated learner.
   * Skip the unconditional `"admin"` billing banner so surfaces match {@link getUserAccess} / paywall state.
   */
  skipStaffAdminSurface?: boolean;
}): BillingStatusSurface {
  if (isLearnerEntitlementStaffBypassRole(args.user.role) && !args.skipStaffAdminSurface) return "admin";

  const sub = args.subscription;
  const now = Date.now();
  const trialActive = args.user.trialStatus === TrialStatus.ACTIVE && args.trialEndsAt && args.trialEndsAt.getTime() > now;
  const reason = args.entitlementReason === "error" ? ("no_access" as const) : args.entitlementReason;

  if (
    sub?.status === SubscriptionStatus.ACTIVE &&
    !args.hasAccess &&
    reason === "allied_occupation_required" &&
    args.effectiveTier === TierCode.ALLIED
  ) {
    return "allied_occupation_incomplete";
  }

  if (sub?.status === SubscriptionStatus.ACTIVE && args.hasAccess && sub.cancelAtPeriodEnd) {
    return "active_scheduled_cancel";
  }
  if (sub?.status === SubscriptionStatus.ACTIVE && args.hasAccess) {
    return "active_paid";
  }
  if (sub?.status === SubscriptionStatus.GRACE && args.hasAccess) {
    return "grace";
  }

  if (sub?.status === SubscriptionStatus.PAST_DUE) {
    if (args.hasAccess && reason === "past_due_grace") {
      return "past_due_grace";
    }
    if (args.hasAccess && reason === "active_trial" && trialActive && args.trialEndsAt) {
      const daysLeft = (args.trialEndsAt.getTime() - now) / 86400000;
      if (daysLeft <= 14) return "trial_ending";
      return "trial";
    }
    return "past_due";
  }

  if (
    sub?.status === SubscriptionStatus.CANCELLED &&
    args.hasAccess &&
    reason === "canceled_paid_through"
  ) {
    return "canceled_access_until";
  }

  if (sub?.status === SubscriptionStatus.CANCELLED) {
    return "cancelled";
  }

  if (trialActive && args.trialEndsAt) {
    const daysLeft = (args.trialEndsAt.getTime() - now) / 86400000;
    if (daysLeft <= 14) return "trial_ending";
    return "trial";
  }

  if (args.hasAccess) return "active_paid";

  return "inactive";
}
