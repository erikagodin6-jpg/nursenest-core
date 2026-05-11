/**
 * Centralized rules for Allied occupation scoping (single shared Stripe price; occupation from checkout/profile).
 *
 * - Purchased occupation is immutable after purchase (enforced at billing/checkout elsewhere).
 * - Staff/admin learner QA bypass sees all occupations (no SQL narrowing); label in UI where relevant.
 * - Shared Allied core content: pathway lessons / decks / questions with no occupation discriminator stay visible to every Allied subscriber.
 * - Occupation-specific rows require a matching canonical profession key.
 */

import type { Prisma } from "@prisma/client";
import { TierCode } from "@prisma/client";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { canonicalProfessionKeyForAlliedCareer } from "@/lib/allied/allied-billing-career-resolution";
import { ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-professions-registry";

/** Canonical marketing/profession key for the subscriber's purchased Allied career (e.g. `respiratory`, `mlt`). */
export function subscriberCanonicalAlliedProfessionKey(scope: AccessScope): string | null {
  if (scope.tier !== TierCode.ALLIED) return null;
  if (!scope.alliedCareer) return null;
  return canonicalProfessionKeyForAlliedCareer(scope.alliedCareer as AlliedCareerKey);
}

/** True when this subscriber should have occupation-specific surfaces narrowed (not staff QA bypass). */
export function alliedSubscriberNeedsOccupationScopedContent(scope: AccessScope): boolean {
  return (
    scope.hasAccess &&
    scope.tier === TierCode.ALLIED &&
    !accessScopeIsStaffLearnerEntitlementBypass(scope)
  );
}

/**
 * Whether incomplete occupation metadata should block occupation-specific premium content.
 * Premium Allied without a resolved career should only see shared-core rows (lists enforce via WHERE;
 * single-row gates use {@link pathwayLessonAlliedProfessionAllowsSubscriber}).
 */
export function alliedOccupationMetadataIncompleteForPremium(scope: AccessScope): boolean {
  return (
    alliedSubscriberNeedsOccupationScopedContent(scope) && subscriberCanonicalAlliedProfessionKey(scope) === null
  );
}

/** List/query filter: shared lessons (`alliedProfessionKey` null) OR same occupation as subscriber. */
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

/** Single-row gate after pathway/tier/country checks. */
export function pathwayLessonAlliedProfessionAllowsSubscriber(
  scope: AccessScope,
  rowAlliedProfessionKey: string | null | undefined,
): boolean {
  if (!alliedSubscriberNeedsOccupationScopedContent(scope)) return true;
  const rk = rowAlliedProfessionKey?.trim().toLowerCase() ?? null;
  if (!rk) return true;
  const pk = subscriberCanonicalAlliedProfessionKey(scope);
  if (!pk) return false;
  return rk === pk;
}

/**
 * Flashcard deck list: decks without any allied-profession tag, OR decks tagged with the subscriber profession.
 */
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

/** Deck detail / study: deny if deck is tagged for another Allied profession. */
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
