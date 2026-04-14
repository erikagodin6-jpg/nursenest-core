import type { UserAccess } from "./user-access-types";

export type SessionSubscriptionStatus = "active" | "grace" | "past_due_grace" | "none" | "past_due";

/**
 * Coarse JWT / client mirror of learner access. Server gates must still use {@link getUserAccess} / entitlements.
 * Distinguishes Stripe `GRACE` (`grace_period`) from billing past-due grace (`past_due_grace`).
 */
export function subscriptionStatusForSession(ua: UserAccess): SessionSubscriptionStatus {
  if (ua.hasPremium) {
    if (ua.reason === "past_due_grace") return "past_due_grace";
    if (ua.reason === "grace_period") return "grace";
    return "active";
  }
  if (ua.plan.status === "past_due") return "past_due";
  return "none";
}
