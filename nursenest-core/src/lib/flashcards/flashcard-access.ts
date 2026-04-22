import {
  ContentStatus,
  FlashcardDeckVisibility,
  type CountryCode,
  type FlashcardDeck,
  type Prisma,
  type TierCode,
} from "@prisma/client";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

const PUBLISHED = ContentStatus.PUBLISHED;

/** Truncate back of card for anonymous preview surfaces. */
export const FLASHCARD_PREVIEW_BACK_MAX_CHARS = 140;

export function truncateForPreview(back: string): string {
  const t = back.trim();
  if (t.length <= FLASHCARD_PREVIEW_BACK_MAX_CHARS) return t;
  return `${t.slice(0, FLASHCARD_PREVIEW_BACK_MAX_CHARS).trim()}…`;
}

/**
 * Subscriber / admin access to a deck (not individual card ladder — cards checked separately).
 */
export function userCanAccessDeckForStudy(
  deck: Pick<FlashcardDeck, "status" | "visibility" | "country" | "tier">,
  entitlement: AccessScope,
): boolean {
  if (deck.status !== PUBLISHED) {
    if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) return deck.visibility !== FlashcardDeckVisibility.HIDDEN;
    return false;
  }
  if (deck.visibility === FlashcardDeckVisibility.HIDDEN) {
    return accessScopeIsStaffLearnerEntitlementBypass(entitlement);
  }
  if (deck.visibility === FlashcardDeckVisibility.PUBLIC_PREVIEW) {
    return true;
  }
  if (!entitlement.hasAccess) return false;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return true;
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return false;
  if (deck.country !== country) return false;
  return prismaTierCodesForProfileTier(tier).includes(deck.tier);
}

/** Anonymous or signed-in learner: may list/browse preview metadata only. */
export function userCanListPublicPreviewDeck(
  deck: Pick<FlashcardDeck, "status" | "visibility">,
): boolean {
  return deck.status === PUBLISHED && deck.visibility === FlashcardDeckVisibility.PUBLIC_PREVIEW;
}

export function prismaDeckListWhere(args: {
  hasSession: boolean;
  isSubscriber: boolean;
  entitlement: AccessScope | null;
}): Prisma.FlashcardDeckWhereInput {
  const { hasSession, isSubscriber, entitlement } = args;

  if (!hasSession) {
    return { status: PUBLISHED, visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW };
  }

  if (!isSubscriber || !entitlement?.hasAccess) {
    return { status: PUBLISHED, visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW };
  }

  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return {
      OR: [
        { status: PUBLISHED, visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW },
        { status: PUBLISHED, visibility: { not: FlashcardDeckVisibility.HIDDEN } },
      ],
    };
  }

  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) {
    return { status: PUBLISHED, visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW };
  }

  const allowedTiers = prismaTierCodesForProfileTier(tier);

  return {
    OR: [
      { status: PUBLISHED, visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW },
      {
        status: PUBLISHED,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        country,
        tier: { in: allowedTiers },
      },
    ],
  };
}

export function cardInDeckWhere(
  deckId: string,
  cardWhere: Prisma.FlashcardWhereInput,
): Prisma.FlashcardWhereInput {
  return { AND: [{ deckId }, cardWhere] };
}

/** Staff learner bypass (hidden decks, etc.) — prefer {@link accessScopeIsStaffLearnerEntitlementBypass}. */
export function isAdminEntitlement(entitlement: AccessScope | null): boolean {
  return accessScopeIsStaffLearnerEntitlementBypass(entitlement);
}
