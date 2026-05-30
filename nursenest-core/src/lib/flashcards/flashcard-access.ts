import {
  type CountryCode,
  type FlashcardDeck,
  type Prisma,
  type TierCode,
} from "@prisma/client";
import { alliedFlashcardDeckListWhere, alliedDeckStudyAllowedByProfessionTagSlugs } from "@/lib/entitlements/allied-occupation-entitlement";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

const PUBLISHED = "PUBLISHED" as const;
const HIDDEN = "HIDDEN" as const;
const PUBLIC_PREVIEW = "PUBLIC_PREVIEW" as const;
const SUBSCRIBER = "SUBSCRIBER" as const;

/** Truncate back of card for anonymous preview surfaces. */
export const FLASHCARD_PREVIEW_BACK_MAX_CHARS = 140;

export function truncateForPreview(back: string): string {
  const t = back.trim();
  if (t.length <= FLASHCARD_PREVIEW_BACK_MAX_CHARS) return t;
  return `${t.slice(0, FLASHCARD_PREVIEW_BACK_MAX_CHARS).trim()}…`;
}

/** Lesson-linked or catalog-derived study rows — not persisted `Flashcard` PKs (skip spaced-repetition POST). */
export function isSyntheticFlashcardStudyId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return (
    id.startsWith("lq:") ||
    id.startsWith("lrp:") ||
    id.startsWith("lrf:") ||
    id.startsWith("lrc:") ||
    id.startsWith("ltk:") ||
    id.startsWith("lta:") ||
    id.startsWith("lls:") ||
    id.startsWith("llp:")
  );
}

/**
 * Subscriber / admin access to a deck (not individual card ladder — cards checked separately).
 * When `tags` is loaded (e.g. from {@link findPublishedDeckByRef}), occupation-specific allied decks are gated.
 */
export function userCanAccessDeckForStudy(
  deck: Pick<FlashcardDeck, "status" | "visibility" | "country" | "tier"> & {
    tagSlugs?: readonly string[];
    tags?: { tag: { slug: string } }[];
  },
  entitlement: AccessScope,
): boolean {
  if (deck.status !== PUBLISHED) {
    if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) return deck.visibility !== HIDDEN;
    return false;
  }
  if (deck.visibility === HIDDEN) {
    return accessScopeIsStaffLearnerEntitlementBypass(entitlement);
  }
  if (deck.visibility === PUBLIC_PREVIEW) {
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
  if (!prismaTierCodesForProfileTier(tier).includes(deck.tier)) {
    return false;
  }
  const fromJoin = deck.tags?.map((t) => t.tag.slug) ?? [];
  const slugs = deck.tagSlugs ?? fromJoin;
  if (slugs.length > 0) {
    return alliedDeckStudyAllowedByProfessionTagSlugs(entitlement, slugs);
  }
  return true;
}

/** Anonymous or signed-in learner: may list/browse preview metadata only. */
export function userCanListPublicPreviewDeck(
  deck: Pick<FlashcardDeck, "status" | "visibility">,
): boolean {
  return deck.status === PUBLISHED && deck.visibility === PUBLIC_PREVIEW;
}

export function prismaDeckListWhere(args: {
  hasSession: boolean;
  isSubscriber: boolean;
  entitlement: AccessScope | null;
}): Prisma.FlashcardDeckWhereInput {
  const { hasSession, isSubscriber, entitlement } = args;

  if (!hasSession) {
    return { status: PUBLISHED, visibility: PUBLIC_PREVIEW };
  }

  if (!isSubscriber || !entitlement?.hasAccess) {
    return { status: PUBLISHED, visibility: PUBLIC_PREVIEW };
  }

  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return {
      OR: [
        { status: PUBLISHED, visibility: PUBLIC_PREVIEW },
        { status: PUBLISHED, visibility: { not: HIDDEN } },
      ],
    };
  }

  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) {
    return { status: PUBLISHED, visibility: PUBLIC_PREVIEW };
  }

  const allowedTiers = prismaTierCodesForProfileTier(tier);

  const subscriberBranch: Prisma.FlashcardDeckWhereInput = {
    status: PUBLISHED,
    visibility: SUBSCRIBER,
    country,
    tier: { in: allowedTiers },
  };

  const alliedOccupation = alliedFlashcardDeckListWhere(entitlement);
  const gatedSubscriber = alliedOccupation ? { AND: [subscriberBranch, alliedOccupation] } : subscriberBranch;

  return {
    OR: [{ status: PUBLISHED, visibility: PUBLIC_PREVIEW }, gatedSubscriber],
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
