import type { TierCode } from "@prisma/client";

/**
 * Single source of truth for tier ladders (NP → RN+PN, RN → PN, PN-only, Allied isolated).
 * PN = practical-nurse track: RPN + LVN_LPN content tiers (`rpn` + `lvn` in `exam_questions`).
 */

const FREE_GENERAL = ["free", "general"] as const;

/** Lowercase `exam_questions.tier` values the subscriber may access. */
export function examQuestionTierStringsForProfileTier(userTier: TierCode): string[] {
  switch (userTier) {
    case "RPN":
      return ["rpn"];
    case "LVN_LPN":
      return ["rpn", "lvn"];
    case "RN":
      return ["rpn", "lvn", "rn"];
    case "NP":
      return ["rpn", "lvn", "rn", "np"];
    case "ALLIED":
      return ["allied"];
    default:
      return [];
  }
}

/**
 * Prisma `TierCode` on `Flashcard` / `Exam`: same ladder as questions (subscriber sees own tier + lower rungs).
 */
export function prismaTierCodesForProfileTier(userTier: TierCode): TierCode[] {
  switch (userTier) {
    case "RPN":
      return ["RPN"];
    case "LVN_LPN":
      return ["RPN", "LVN_LPN"];
    case "RN":
      return ["RPN", "LVN_LPN", "RN"];
    case "NP":
      return ["RPN", "LVN_LPN", "RN", "NP"];
    case "ALLIED":
      return ["ALLIED"];
    default:
      return [];
  }
}

/** `content_items.tier` allowlist: free/general plus every exam-tier string on the ladder. */
export function contentItemTierStringsForProfileTier(userTier: TierCode): string[] {
  return [...new Set([...FREE_GENERAL, ...examQuestionTierStringsForProfileTier(userTier)])];
}

export type AccessibleTiersBundle = {
  examQuestionTierStrings: string[];
  prismaTierCodes: TierCode[];
  contentItemTierStrings: string[];
};

/**
 * Central helper: effective ladder for lessons, questions, flashcards, and exams.
 * Pass the **effective** tier (e.g. from {@link resolveEntitlement}, not stale profile alone).
 */
export function getAccessibleTiers(user: { tier: TierCode | null | undefined }): AccessibleTiersBundle | null {
  if (user.tier == null) return null;
  const tier = user.tier;
  return {
    examQuestionTierStrings: examQuestionTierStringsForProfileTier(tier),
    prismaTierCodes: prismaTierCodesForProfileTier(tier),
    contentItemTierStrings: contentItemTierStringsForProfileTier(tier),
  };
}
