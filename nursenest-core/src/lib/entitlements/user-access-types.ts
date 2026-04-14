import type { CountryCode, TierCode } from "@prisma/client";
import type { AlliedCareerKey } from "../pricing/display-catalog";

/** Narrow legacy shape for question/lesson SQL helpers (shared type; avoid circular imports). */
export type AccessScope = {
  hasAccess: boolean;
  reason:
    | "active_subscription"
    | "admin_override"
    | "grace_period"
    | "past_due_grace"
    | "active_trial"
    | "no_access";
  tier: TierCode | null;
  country: CountryCode | null;
  /** When tier is ALLIED, the specific career line the user purchased. */
  alliedCareer: AlliedCareerKey | null;
};

/** Normalized subscription lifecycle for product UI and server gates. */
export type SubscriptionPlanStatus = "none" | "active" | "canceled" | "grace" | "past_due";

/**
 * Canonical access snapshot for a learner: mirrors Stripe `Subscription` + `User` profile.
 * Use {@link accessScopeFromUserAccess} / `resolveEntitlement` when only tier/country/`hasAccess` is needed.
 */
export type UserAccess = {
  userId: string;
  /** True when the learner may use premium lessons, bank, CAT, etc. */
  hasPremium: boolean;
  /** Same semantics as {@link AccessScope.reason}. */
  reason: AccessScope["reason"];
  allowedRegion: {
    country: CountryCode | null;
    /** Global pricing region from checkout metadata, when set. */
    billingRegionSlug: string | null;
  };
  allowedProfession: {
    tier: TierCode | null;
    alliedCareer: AlliedCareerKey | null;
  };
  allowedExam: {
    /** Learner goal pathway; optional future hard-lock from subscription metadata. */
    pathwayId: string | null;
  };
  plan: {
    planCode: string | null;
    duration: string | null;
    status: SubscriptionPlanStatus;
    /** Best-effort access end: current period end, else trial end. */
    expiresAt: Date | null;
    cancelAtPeriodEnd: boolean;
  };
};
