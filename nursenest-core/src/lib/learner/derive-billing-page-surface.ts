import { SubscriptionStatus, TrialStatus } from "@prisma/client";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import type { BillingSubscriptionRow, BillingUserRow } from "@/lib/learner/billing-page-payload-types";

export type BillingStatusSurface =
  | "active_paid"
  | "grace"
  | "past_due_grace"
  | "past_due"
  | "cancelled"
  | "trial"
  | "trial_ending"
  | "inactive"
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
  trialEndsAt: Date | null;
}): BillingStatusSurface {
  if (isLearnerEntitlementStaffBypassRole(args.user.role)) return "admin";

  const sub = args.subscription;
  const now = Date.now();
  const trialActive = args.user.trialStatus === TrialStatus.ACTIVE && args.trialEndsAt && args.trialEndsAt.getTime() > now;
  const reason = args.entitlementReason === "error" ? ("no_access" as const) : args.entitlementReason;

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
