/**
 * Allied occupation access (single shared Stripe Allied price; occupation from checkout / profile).
 *
 * Canonical profession keys align with `allied-professions-registry` (`professionKey`) and
 * billing `alliedCareer` via {@link canonicalProfessionKeyForAlliedCareer}.
 */

import type { Prisma } from "@prisma/client";
import { TierCode } from "@prisma/client";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { canonicalProfessionKeyForAlliedCareer } from "@/lib/allied/allied-billing-career-resolution";
import { ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-professions-registry";

export type AlliedOccupationAccessReason =
  | "not_allied"
  | "shared_allied_core"
  | "occupation_match"
  | "occupation_mismatch"
  | "missing_user_occupation"
  | "missing_content_occupation"
  | "staff_preview";

export type AlliedOccupationAccessResult = {
  allowed: boolean;
  reason: AlliedOccupationAccessReason;
  userOccupation?: string | null;
  contentOccupation?: string | null;
  staffPreview?: boolean;
};

/** Normalize registry/profession slug for comparisons (lowercase trim). */
export function normalizeCanonicalAlliedProfessionKey(raw: string | null | undefined): string | null {
  const s = raw?.trim().toLowerCase();
  return s && s.length > 0 ? s : null;
}

/** Purchased occupation as canonical profession key, or null if not an Allied subscriber / unresolved. */
export function subscriberCanonicalAlliedProfessionKey(scope: AccessScope): string | null {
  if (scope.tier !== TierCode.ALLIED) return null;
  if (!scope.alliedCareer) return null;
  return canonicalProfessionKeyForAlliedCareer(scope.alliedCareer as AlliedCareerKey);
}

export function alliedSubscriberNeedsOccupationScopedContent(scope: AccessScope): boolean {
  return (
    scope.hasAccess &&
    scope.tier === TierCode.ALLIED &&
    !accessScopeIsStaffLearnerEntitlementBypass(scope)
  );
}

export function alliedOccupationMetadataIncompleteForPremium(scope: AccessScope): boolean {
  return (
    alliedSubscriberNeedsOccupationScopedContent(scope) && subscriberCanonicalAlliedProfessionKey(scope) === null
  );
}

/**
 * Single decision point for Allied vs occupation-labeled content.
 *
 * - Non–ALLIED tier: allowed, `not_allied` (occupation labels ignored for gating).
 * - Staff / admin learner QA bypass: allowed, `staff_preview`.
 * - Shared core content: `contentOccupationKey` null/empty → allowed, `shared_allied_core`.
 * - ALLIED + premium + occupation on content: must match subscriber occupation.
 */
export function evaluateAlliedOccupationAccess(
  scope: AccessScope,
  contentOccupationKey: string | null | undefined,
): AlliedOccupationAccessResult {
  const contentOcc = normalizeCanonicalAlliedProfessionKey(contentOccupationKey);
  const userOcc = subscriberCanonicalAlliedProfessionKey(scope);

  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    return {
      allowed: true,
      reason: "staff_preview",
      userOccupation: userOcc,
      contentOccupation: contentOcc,
      staffPreview: true,
    };
  }

  if (scope.tier !== TierCode.ALLIED) {
    return {
      allowed: true,
      reason: "not_allied",
      userOccupation: userOcc,
      contentOccupation: contentOcc,
    };
  }

  if (!scope.hasAccess) {
    if (!contentOcc) {
      return {
        allowed: true,
        reason: "shared_allied_core",
        userOccupation: userOcc,
        contentOccupation: null,
      };
    }
    return {
      allowed: false,
      reason: "missing_user_occupation",
      userOccupation: userOcc,
      contentOccupation: contentOcc,
    };
  }

  if (!contentOcc) {
    return {
      allowed: true,
      reason: "shared_allied_core",
      userOccupation: userOcc,
      contentOccupation: null,
    };
  }

  if (!userOcc) {
    return {
      allowed: false,
      reason: "missing_user_occupation",
      userOccupation: null,
      contentOccupation: contentOcc,
    };
  }

  if (userOcc === contentOcc) {
    return {
      allowed: true,
      reason: "occupation_match",
      userOccupation: userOcc,
      contentOccupation: contentOcc,
    };
  }

  return {
    allowed: false,
    reason: "occupation_mismatch",
    userOccupation: userOcc,
    contentOccupation: contentOcc,
  };
}

/** Strict: content must declare an occupation key but none is present — deny (unsafe to infer). */
export function evaluateAlliedOccupationAccessStrictContent(
  scope: AccessScope,
  contentOccupationKey: string | null | undefined,
  contentRequiresOccupationTag: boolean,
): AlliedOccupationAccessResult {
  if (!contentRequiresOccupationTag) {
    return evaluateAlliedOccupationAccess(scope, contentOccupationKey);
  }
  const raw = normalizeCanonicalAlliedProfessionKey(contentOccupationKey);
  if (!raw) {
    if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
      return {
        allowed: true,
        reason: "staff_preview",
        userOccupation: subscriberCanonicalAlliedProfessionKey(scope),
        contentOccupation: null,
        staffPreview: true,
      };
    }
    return {
      allowed: false,
      reason: "missing_content_occupation",
      userOccupation: subscriberCanonicalAlliedProfessionKey(scope),
      contentOccupation: null,
    };
  }
  return evaluateAlliedOccupationAccess(scope, raw);
}

export function pathwayLessonAlliedProfessionWhere(scope: AccessScope): Prisma.PathwayLessonWhereInput | null {
  if (!alliedSubscriberNeedsOccupationScopedContent(scope)) return null;
  const pk = subscriberCanonicalAlliedProfessionKey(scope);
  if (!pk) {
    return { alliedProfessionKey: null };
  }
  return {
    OR: [{ alliedProfessionKey: null }, { alliedProfessionKey: pk }],
  };
}

export function pathwayLessonAlliedProfessionAllowsSubscriber(
  scope: AccessScope,
  rowAlliedProfessionKey: string | null | undefined,
): boolean {
  return evaluateAlliedOccupationAccess(scope, rowAlliedProfessionKey).allowed;
}

export function alliedFlashcardDeckListWhere(scope: AccessScope): Prisma.FlashcardDeckWhereInput | null {
  if (!alliedSubscriberNeedsOccupationScopedContent(scope)) return null;
  const pk = subscriberCanonicalAlliedProfessionKey(scope);
  const keys = ALLIED_PROFESSION_KEYS;
  if (!pk) {
    return { tags: { none: { tag: { slug: { in: keys } } } } };
  }
  return {
    OR: [
      { tags: { none: { tag: { slug: { in: keys } } } } },
      { tags: { some: { tag: { slug: pk } } } },
    ],
  };
}

export function alliedDeckStudyAllowedByProfessionTagSlugs(
  scope: AccessScope,
  deckTagSlugs: readonly string[],
): boolean {
  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) return true;
  if (!alliedSubscriberNeedsOccupationScopedContent(scope)) return true;
  const pk = subscriberCanonicalAlliedProfessionKey(scope);
  const keys = ALLIED_PROFESSION_KEYS as readonly string[];
  const professionTagsOnDeck = deckTagSlugs.filter((s) => keys.includes(s));
  if (professionTagsOnDeck.length === 0) return true;
  if (!pk) return false;
  return professionTagsOnDeck.includes(pk);
}
