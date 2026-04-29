import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";

/**
 * Session-derived fields used to decide whether Prisma-backed pathway lesson progress may render
 * on **marketing** lesson hubs. Implementation order across product tiers: **RN → RPN/PN → NP → Allied → New Grad**;
 * all share this gate and the same downstream UI (`PathwayLessonsCurriculumHub`, category hubs, etc.).
 */
export type MarketingPathwayLessonProgressSessionContext = {
  userId: string;
  learnerPath: string | null;
  scope: AccessScope;
};

/** Subscriber (or equivalent) with full pathway lesson access — progress UI is allowed (maps still load separately). */
export function canShowPaidPathwayLessonProgress(
  ctx: MarketingPathwayLessonProgressSessionContext,
  pathway: ExamPathwayDefinition,
): boolean {
  return Boolean(ctx.userId) && ctx.scope.hasAccess && canViewFullPathwayLesson(ctx.scope, pathway, ctx.learnerPath);
}
