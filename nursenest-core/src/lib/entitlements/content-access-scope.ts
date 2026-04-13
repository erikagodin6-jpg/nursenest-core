import type { CountryCode, Prisma, TierCode } from "@prisma/client";
import { ContentStatus, FlashcardDeckVisibility, TierCode as TierCodeEnum } from "@prisma/client";
import {
  contentItemTierStringsForProfileTier,
  examQuestionTierStringsForProfileTier,
  prismaTierCodesForProfileTier,
} from "@/lib/entitlements/accessible-tiers";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

/** Production DB uses lowercase status strings on `exam_questions` / `content_items`. */
export const DB_PUBLISHED = "published" as const;
const DB_PUBLISHED_VARIANTS = [DB_PUBLISHED, "PUBLISHED"] as const;

export { getAccessibleTiers } from "@/lib/entitlements/accessible-tiers";

/**
 * Tier ladder for `exam_questions.tier` (lowercase), aligned with main app pools.
 * @deprecated Prefer {@link getAccessibleTiers} or {@link examQuestionTierStringsForProfileTier}.
 */
export function examQuestionTiersForUserTier(userTier: TierCode): string[] {
  return examQuestionTierStringsForProfileTier(userTier);
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
export function lessonAccessWhere(entitlement: AccessScope): Prisma.ContentItemWhereInput {
  if (!entitlement.hasAccess) return { id: { in: [] } };
  if (entitlement.reason === "admin_override") {
    const country = entitlement.country as CountryCode | null;
    if (!country) return lessonPublishedWhere();
    return {
      AND: [lessonPublishedWhere(), { OR: regionScopeOrForCountry(country) }],
    };
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
    status: DB_PUBLISHED,
    tier: { in: ["rpn", "lvn", "allied"] },
  };
}

/** Published flashcards in public-marketing tiers (no RN/NP-only depth). */
export function publicMarketingFlashcardWhere(): Prisma.FlashcardWhereInput {
  return {
    status: ContentStatus.PUBLISHED,
    tier: { in: [TierCodeEnum.RPN, TierCodeEnum.LVN_LPN, TierCodeEnum.ALLIED] },
  };
}

/** Published decks visible for aggregate marketing counts (exclude hidden). */
export function publicMarketingFlashcardDeckWhere(): Prisma.FlashcardDeckWhereInput {
  return {
    status: ContentStatus.PUBLISHED,
    visibility: { not: FlashcardDeckVisibility.HIDDEN },
  };
}

/** Prisma filter for `exam_questions` rows the entitlement may load. */
export function questionAccessWhere(entitlement: AccessScope): Prisma.ExamQuestionWhereInput {
  if (!entitlement.hasAccess) return { id: { in: [] } };
  if (entitlement.reason === "admin_override") {
    const country = entitlement.country as CountryCode | null;
    if (!country) return { status: { in: [...DB_PUBLISHED_VARIANTS] } };
    return {
      status: { in: [...DB_PUBLISHED_VARIANTS] },
      OR: examQuestionRegionOr(country),
    };
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return { id: { in: [] } };
  return {
    status: { in: [...DB_PUBLISHED_VARIANTS] },
    tier: { in: examQuestionTiersForUserTier(tier) },
    OR: examQuestionRegionOr(country),
  };
}

/**
 * Tier-scoped question pool for analytics/audit (simulates a subscriber at `tier`).
 * Not for freemium preview — use {@link freemiumQuestionWhereForProfile}.
 */
export function questionBankWhereForProfile(country: CountryCode, tier: TierCode): Prisma.ExamQuestionWhereInput {
  return {
    status: { in: [...DB_PUBLISHED_VARIANTS] },
    tier: { in: examQuestionTiersForUserTier(tier) },
    OR: examQuestionRegionOr(country),
  };
}

/**
 * Complimentary question previews: LVN_LPN ladder (rpn + lvn) for nursing paths; ALLIED only for allied.
 * Does not use profile tier depth (avoids NP/RN preview leaks for unpaid users).
 */
export function freemiumQuestionWhereForProfile(country: CountryCode, tier: TierCode): Prisma.ExamQuestionWhereInput {
  const tiers = tier === "ALLIED" ? examQuestionTiersForUserTier("ALLIED") : examQuestionTiersForUserTier("LVN_LPN");
  return {
    status: { in: [...DB_PUBLISHED_VARIANTS] },
    tier: { in: tiers },
    OR: examQuestionRegionOr(country),
  };
}

/** Flashcards: schema still uses ContentStatus + country/tier (may not match `flashcard_bank` until remapped). */
export function flashcardAccessWhere(entitlement: AccessScope): Prisma.FlashcardWhereInput {
  if (!entitlement.hasAccess) return { id: { in: [] } };
  if (entitlement.reason === "admin_override") {
    const country = entitlement.country as CountryCode | null;
    if (!country) return { status: ContentStatus.PUBLISHED };
    return { status: ContentStatus.PUBLISHED, country };
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return { id: { in: [] } };
  return {
    status: ContentStatus.PUBLISHED,
    country,
    tier: { in: prismaTierCodesForProfileTier(tier) },
  };
}

export function flashcardBankWhereForProfile(country: CountryCode, tier: TierCode): Prisma.FlashcardWhereInput {
  return {
    status: ContentStatus.PUBLISHED,
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
  exam: { status: ContentStatus; country: CountryCode; tier: TierCode },
): boolean {
  if (exam.status !== ContentStatus.PUBLISHED || !entitlement.hasAccess) return false;
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (entitlement.reason === "admin_override") {
    if (!country) return true;
    return exam.country === country;
  }
  if (!country || !tier) return false;
  if (exam.country !== country) return false;
  return accessibleTiersForUserTier(tier).includes(exam.tier);
}
