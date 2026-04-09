import type { Prisma } from "@prisma/client";
import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";
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
    examIn: [...p.contentExamKeys],
    tierMatches,
  };
}
