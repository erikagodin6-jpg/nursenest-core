import type { CountryCode, Prisma, TierCode } from "@prisma/client";
import {
  contentItemTierStringsForProfileTier,
  examQuestionTierStringsForProfileTier,
  prismaTierCodesForProfileTier,
} from "@/lib/entitlements/accessible-tiers";
import type { FlashcardPathwayAccessOptions } from "@/lib/flashcards/flashcard-pathway-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  standardExamPrepFlashcardScopeWhere,
  standardExamPrepQuestionScopeWhere,
} from "@/lib/questions/difficulty-scope-filter";

/** Production DB uses lowercase status strings on `exam_questions` / `content_items`. */
export const DB_PUBLISHED = "published" as const;
const DB_PUBLISHED_VARIANTS = [DB_PUBLISHED, "PUBLISHED"] as const;
const CONTENT_PUBLISHED = "PUBLISHED" as const;
const DECK_HIDDEN = "HIDDEN" as const;
const DECK_PUBLIC_PREVIEW = "PUBLIC_PREVIEW" as const;

export { getAccessibleTiers } from "@/lib/entitlements/accessible-tiers";

/**
 * Tier ladder for `exam_questions.tier` (lowercase), aligned with main app pools.
 * @deprecated Prefer {@link getAccessibleTiers} or {@link examQuestionTierStringsForProfileTier}.
 */
export function examQuestionTiersForUserTier(userTier: TierCode): string[] {
  return examQuestionTierStringsForProfileTier(userTier);
}

export function examQuestionTierCaseInsensitiveWhere(tiers: readonly string[]): Prisma.ExamQuestionWhereInput {
  const normalized = [...new Set(tiers.map((tier) => tier.trim().toLowerCase()).filter(Boolean))];
  if (normalized.length === 0) return { id: { in: [] } };
  return {
    OR: normalized.map((tier) => ({
      tier: { equals: tier, mode: "insensitive" as const },
    })),
  };
}

/** `content_items.tier` allowlist — same ladder as questions (not only the subscriber’s nominal tier). */
export function contentItemTiersForUserTier(userTier: TierCode): string[] {
  return contentItemTierStringsForProfileTier(userTier);
}

/** Region gate: Canada subscribers never see US_ONLY rows (and vice versa). */
export function regionScopeOrForCountry(country: CountryCode): Prisma.ContentItemWhereInput[] {
  return [{ regionScope: "BOTH" }, { regionScope: country === "CA" ? "CA_ONLY" : "US_ONLY" }];
}

function examQuestionRegionOr(country: CountryCode) {
  return [{ regionScope: "BOTH" }, { regionScope: country === "CA" ? "CA_ONLY" : "US_ONLY" }];
}

function lessonPublishedWhere(): Prisma.ContentItemWhereInput {
  return {
    type: "lesson",
    status: { in: [...DB_PUBLISHED_VARIANTS] },
  };
}

/** Prisma filter for `content_items` lessons the entitlement may load. */
export function lessonAccessWhere(
  entitlement: AccessScope,
  options?: { staffDbFullCatalog?: boolean },
): Prisma.ContentItemWhereInput {
  if (options?.staffDbFullCatalog) {
    return lessonPublishedWhere();
  }
  if (!entitlement.hasAccess) return { id: { in: [] } };
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return lessonPublishedWhere();
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return { id: { in: [] } };
  const tiers = contentItemTiersForUserTier(tier);
  return {
    AND: [
      lessonPublishedWhere(),
      {
        OR: regionScopeOrForCountry(country),
      },
      {
        OR: [{ tier: null }, { tier: { in: tiers } }],
      },
    ],
  };
}

/**
 * Tier-scoped lesson pool for analytics/audit (simulates a subscriber at `tier`).
 * Not for freemium preview — use {@link freemiumLessonWhereForProfile}.
 */
export function lessonBankWhereForProfile(country: CountryCode, tier: TierCode): Prisma.ContentItemWhereInput {
  const tiers = contentItemTiersForUserTier(tier);
  return {
    AND: [
      lessonPublishedWhere(),
      {
        OR: regionScopeOrForCountry(country),
      },
      {
        OR: [{ tier: null }, { tier: { in: tiers } }],
      },
    ],
  };
}

/**
 * Complimentary lesson rows: public/starter tiers only (never RN/NP depth from profile `tier`).
 * ALLIED learners stay on allied + free/general; nursing uses rpn/lvn + free/general.
 */
export function freemiumLessonWhereForProfile(country: CountryCode, tier: TierCode): Prisma.ContentItemWhereInput {
  const tiers =
    tier === "ALLIED"
      ? contentItemTiersForUserTier("ALLIED")
      : (["free", "general", "rpn", "lvn"] as const);
  return {
    AND: [
      lessonPublishedWhere(),
      {
        OR: regionScopeOrForCountry(country),
      },
      {
        OR: [{ tier: null }, { tier: { in: [...tiers] } }],
      },
    ],
  };
}

/** Published lessons in freemium-visible tiers only (no RN/NP-only depth). For public marketing aggregates. */
export function publicMarketingLessonWhere(): Prisma.ContentItemWhereInput {
  return {
    AND: [
      lessonPublishedWhere(),
      {
        OR: [
          { tier: null },
          { tier: { in: ["free", "general", "rpn", "lvn", "allied"] } },
        ],
      },
    ],
  };
}

/** Published questions in freemium preview pools (rpn/lvn ladder + allied; no RN/NP subscriber depth). */
export function publicMarketingExamQuestionWhere(): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      { status: DB_PUBLISHED },
      { tier: { in: ["rpn", "lvn", "allied"] } },
      standardExamPrepQuestionScopeWhere(),
    ],
  };
}

/** Published flashcards in public-marketing tiers (no RN/NP-only depth). */
export function publicMarketingFlashcardWhere(): Prisma.FlashcardWhereInput {
  return {
    AND: [
      {
        status: CONTENT_PUBLISHED,
        tier: { in: ["RPN", "LVN_LPN", "ALLIED"] },
      },
      standardExamPrepFlashcardScopeWhere(),
    ],
  };
}

/** Published decks visible for aggregate marketing counts (exclude hidden). */
export function publicMarketingFlashcardDeckWhere(): Prisma.FlashcardDeckWhereInput {
  return {
    status: CONTENT_PUBLISHED,
    visibility: { not: DECK_HIDDEN },
  };
}

/**
 * Published **Pre-Nursing** preview decks for the marketing `/flashcards` hub and `/flashcards/[slug]` SEO entry.
 * Intentionally **does not** include RN/PN/NP exam pathway decks — avoids silent mixing with NCLEX pools.
 * Matches anonymous learner listing rules: {@link userCanListPublicPreviewDeck}.
 */
export function publicPreNursingMarketingFlashcardHubDeckWhere(): Prisma.FlashcardDeckWhereInput {
  return {
    status: CONTENT_PUBLISHED,
    visibility: DECK_PUBLIC_PREVIEW,
    tier: "PRE_NURSING",
    cardCount: { gt: 0 },
  };
}

/** Prisma filter for `exam_questions` rows the entitlement may load. */
export function questionAccessWhere(entitlement: AccessScope): Prisma.ExamQuestionWhereInput {
  if (!entitlement.hasAccess) return { id: { in: [] } };
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return { status: { in: [...DB_PUBLISHED_VARIANTS] } };
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return { id: { in: [] } };
  return {
    AND: [
      { status: { in: [...DB_PUBLISHED_VARIANTS] } },
      examQuestionTierCaseInsensitiveWhere(examQuestionTiersForUserTier(tier)),
      { OR: examQuestionRegionOr(country) },
    ],
  };
}

/**
 * Tier-scoped question pool for analytics/audit (simulates a subscriber at `tier`).
 * Not for freemium preview — use {@link freemiumQuestionWhereForProfile}.
 */
export function questionBankWhereForProfile(country: CountryCode, tier: TierCode): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      { status: { in: [...DB_PUBLISHED_VARIANTS] } },
      examQuestionTierCaseInsensitiveWhere(examQuestionTiersForUserTier(tier)),
      { OR: examQuestionRegionOr(country) },
    ],
  };
}

/**
 * Complimentary question previews: LVN_LPN ladder (rpn + lvn) for nursing paths; ALLIED only for allied.
 * Does not use profile tier depth (avoids NP/RN preview leaks for unpaid users).
 */
export function freemiumQuestionWhereForProfile(country: CountryCode, tier: TierCode): Prisma.ExamQuestionWhereInput {
  const tiers = tier === "ALLIED" ? examQuestionTiersForUserTier("ALLIED") : examQuestionTiersForUserTier("LVN_LPN");
  return {
    AND: [
      { status: { in: [...DB_PUBLISHED_VARIANTS] } },
      examQuestionTierCaseInsensitiveWhere(tiers),
      { OR: examQuestionRegionOr(country) },
    ],
  };
}

/** Flashcards: schema still uses ContentStatus + country/tier (may not match `flashcard_bank` until remapped). */
export function flashcardAccessWhere(
  entitlement: AccessScope,
  pathway?: FlashcardPathwayAccessOptions | null,
): Prisma.FlashcardWhereInput {
  if (!entitlement.hasAccess) return { id: { in: [] } };
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    const base: Prisma.FlashcardWhereInput = { status: CONTENT_PUBLISHED };
    if (!pathway?.deckPathwayId && !pathway?.tierIntersectWith?.length && !pathway?.includePreNursingFoundation) {
      return base;
    }
    const parts: Prisma.FlashcardWhereInput[] = [base];
    if (pathway.deckPathwayId) parts.push({ deck: { pathwayId: pathway.deckPathwayId } });
    if (pathway.includePreNursingFoundation) parts.push({ tier: "PRE_NURSING" });
    else if (pathway.tierIntersectWith?.length) parts.push({ tier: { in: [...pathway.tierIntersectWith] } });
    return parts.length === 1 ? base : { AND: parts };
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return { id: { in: [] } };
  const userLadder = prismaTierCodesForProfileTier(tier);
  let tierIn: TierCode[];
  if (pathway?.includePreNursingFoundation) {
    tierIn = ["PRE_NURSING"];
  } else if (pathway?.tierIntersectWith?.length) {
    const cap = [...pathway.tierIntersectWith];
    tierIn = userLadder.filter((t) => cap.includes(t));
  } else {
    tierIn = userLadder;
  }
  if (tierIn.length === 0) return { id: { in: [] } };
  const scoped: Prisma.FlashcardWhereInput = {
    status: CONTENT_PUBLISHED,
    country,
    tier: { in: tierIn },
  };
  const scopeGate =
    tier === "RPN" || tier === "LVN_LPN" || tier === "RN"
      ? standardExamPrepFlashcardScopeWhere()
      : null;
  const parts: Prisma.FlashcardWhereInput[] = [scoped];
  if (scopeGate) parts.push(scopeGate);
  if (pathway?.deckPathwayId) {
    return { AND: [...parts, { deck: { pathwayId: pathway.deckPathwayId } }] };
  }
  return parts.length === 1 ? scoped : { AND: parts };
}

export function flashcardBankWhereForProfile(country: CountryCode, tier: TierCode): Prisma.FlashcardWhereInput {
  return {
    status: CONTENT_PUBLISHED,
    country,
    tier: { in: prismaTierCodesForProfileTier(tier) },
  };
}

/**
 * Prisma `TierCode` ladder for flashcards / exams (matches {@link examQuestionTiersForUserTier}).
 */
export function accessibleTiersForUserTier(userTier: TierCode): TierCode[] {
  return prismaTierCodesForProfileTier(userTier);
}

/** Whether the learner may record an attempt for this exam row (backend paywall). */
export function userCanAccessExam(
  entitlement: AccessScope,
  exam: { status: "PUBLISHED" | string; country: CountryCode; tier: TierCode },
): boolean {
  if (exam.status !== CONTENT_PUBLISHED || !entitlement.hasAccess) return false;
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return false;
  if (exam.country !== country) return false;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return true;
  }
  return accessibleTiersForUserTier(tier).includes(exam.tier);
}
