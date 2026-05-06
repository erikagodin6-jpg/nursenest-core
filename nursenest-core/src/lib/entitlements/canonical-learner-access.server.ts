import "server-only";

import { SubscriptionStatus, type TierCode } from "@prisma/client";
import {
  accessScopeFromUserAccess,
  getUserAccess,
  type UserAccess,
} from "@/lib/entitlements/get-user-access";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

/**
 * Where this canonical snapshot was derived (for admin diagnostics and audits).
 * Does not change entitlement math — all paths use {@link getUserAccess} + {@link accessScopeFromUserAccess}.
 */
export type CanonicalEntitlementResolutionSource =
  | "get_user_access"
  | "subscriber_session_ok"
  | "resolve_entitlement_chain"
  | "ecg_module_public";

/** Single cross-platform contract for learner-protected surfaces (web + future native shells calling the same APIs). */
export type CanonicalLearnerAccess = {
  tier: TierCode | null;
  pathwayId: string | null;
  hasAccess: boolean;
  /** Same codes as {@link AccessScope.reason} / {@link UserAccess.reason} — no new tier or reason names. */
  reasonCode: AccessScope["reason"];
  resolutionSource: CanonicalEntitlementResolutionSource;
  country: AccessScope["country"];
  alliedCareer: AccessScope["alliedCareer"];
  adminLearnerQaSimulation?: true;
};

const ACTIVE_LIKE: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.GRACE,
  SubscriptionStatus.PAST_DUE,
];

/**
 * Maps an already-resolved {@link UserAccess} row into the canonical learner contract.
 * Prefer this over re-deriving tier/pathway from disconnected fields.
 */
export function toCanonicalLearnerAccess(
  userAccess: UserAccess,
  resolutionSource: CanonicalEntitlementResolutionSource,
): CanonicalLearnerAccess {
  const scope = accessScopeFromUserAccess(userAccess);
  return {
    tier: scope.tier,
    pathwayId: userAccess.allowedExam.pathwayId,
    hasAccess: scope.hasAccess,
    reasonCode: scope.reason,
    resolutionSource,
    country: scope.country,
    alliedCareer: scope.alliedCareer,
    ...(scope.adminLearnerQaSimulation ? { adminLearnerQaSimulation: true as const } : {}),
  };
}

/** Loads canonical access for a user id (one `getUserAccess` round-trip). */
export async function loadCanonicalLearnerAccessForUserId(userId: string): Promise<CanonicalLearnerAccess> {
  const ua = await getUserAccess(userId);
  return toCanonicalLearnerAccess(ua, "get_user_access");
}

export type CanonicalLearnerDiagnosticsMismatchCode = "subscription_planTier_ne_user_tier";

export type CanonicalLearnerDiagnostics = {
  resolutionHelper: "getUserAccess→accessScopeFromUserAccess→toCanonicalLearnerAccess";
  grantOrDeny: "grant" | "deny";
  reasonCode: AccessScope["reason"];
  tier: TierCode | null;
  pathwayId: string | null;
  tierPathwayMismatchWarning: boolean;
  mismatchCodes: CanonicalLearnerDiagnosticsMismatchCode[];
};

/**
 * Non-sensitive admin/support fields — no Stripe customer ids, no full emails.
 * Uses one `getUserAccess` plus a bounded user/subscription read for mismatch heuristics.
 */
export async function loadCanonicalLearnerDiagnosticsForUserId(
  userId: string,
): Promise<CanonicalLearnerDiagnostics | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const ua = await getUserAccess(userId);
  const canonical = toCanonicalLearnerAccess(ua, "get_user_access");
  const grantOrDeny = canonical.hasAccess ? ("grant" as const) : ("deny" as const);

  const [userRow, subRow] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    }),
    prisma.subscription.findFirst({
      where: { userId, status: { in: ACTIVE_LIKE } },
      orderBy: { updatedAt: "desc" },
      select: { planTier: true },
    }),
  ]);

  const mismatchCodes: CanonicalLearnerDiagnosticsMismatchCode[] = [];
  if (subRow?.planTier && userRow?.tier && subRow.planTier !== userRow.tier) {
    mismatchCodes.push("subscription_planTier_ne_user_tier");
  }

  return {
    resolutionHelper: "getUserAccess→accessScopeFromUserAccess→toCanonicalLearnerAccess",
    grantOrDeny,
    reasonCode: canonical.reasonCode,
    tier: canonical.tier,
    pathwayId: canonical.pathwayId,
    tierPathwayMismatchWarning: mismatchCodes.length > 0,
    mismatchCodes,
  };
}
