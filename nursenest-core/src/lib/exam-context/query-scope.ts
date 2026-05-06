import type { Prisma } from "@prisma/client";
import { TierCode } from "@prisma/client";
import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";
import { expandedExamKeysForPathwayPool } from "@/lib/content-quality/exam-question-exam-normalization";
import { examQuestionTierStringsForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

/**
 * Pathway lessons — **never** omit `pathwayId`; country is implied by pathway.
 */
export function pathwayLessonWhere(ctx: GlobalExamContext): Prisma.PathwayLessonWhereInput {
  return {
    pathwayId: ctx.pathwayId,
    locale: ctx.language,
  };
}

/**
 * Exam questions — require explicit exam column + tier; **no** silent fallback to another country.
 * Pool membership uses `contentExamKeys` from the pathway registry.
 */
export function examQuestionPoolWhereForContext(ctx: GlobalExamContext): {
  examIn: string[];
  tierMatches: string[];
} {
  const p = getExamPathwayById(ctx.pathwayId);
  if (!p) {
    return { examIn: [], tierMatches: [] };
  }
  /** `ctx.tier` comes from pathway role label (RN/NP/…); Pre-Nursing rows use `stripeTier` for `exam_questions.tier`. */
  if (p.stripeTier === TierCode.PRE_NURSING) {
    return {
      examIn: expandedExamKeysForPathwayPool(p.contentExamKeys),
      tierMatches: examQuestionTierStringsForProfileTier("PRE_NURSING"),
    };
  }
  const tierLower = ctx.tier.toLowerCase();
  const tierMatches =
    tierLower === "rpn" || tierLower === "pn"
      ? ["rpn", "lvn", "lpn", "pn"]
      : tierLower === "rn"
        ? ["rn"]
        : tierLower === "np"
          ? ["np", "fnp", "agpcnp"]
          : [tierLower];
  return {
    examIn: expandedExamKeysForPathwayPool(p.contentExamKeys),
    tierMatches,
  };
}
