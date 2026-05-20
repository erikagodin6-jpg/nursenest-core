import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildGlobalExamContext, examContextAnalyticsProps } from "@/lib/exam-context";
import { captureLearnerProductEvent } from "@/lib/observability/learner-product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

function lessonKeyForAnalytics(lessonId: string): string {
  return lessonId.length > 64 ? `${lessonId.slice(0, 32)}…` : lessonId;
}

/**
 * Emits at most one “started” per lesson row (first DB progress row) and one “completed” when `completed`
 * flips false → true. Server-side only; ties to authenticated learners.
 */
export function captureLessonProgressAnalytics(
  userId: string,
  entitlement: AccessScope,
  args: {
    lessonId: string;
    pathwayId?: string;
    lessonSlug?: string;
    source: "pathway_synthetic" | "pathway_lesson_row" | "cms_lesson";
    hadExistingRow: boolean;
    priorCompleted: boolean;
    nextCompleted: boolean;
  },
): void {
  const lesson_key = lessonKeyForAnalytics(args.lessonId);
  const examCtx = buildGlobalExamContext(args.pathwayId ?? null, "en");
  const examProps = examCtx ? examContextAnalyticsProps(examCtx) : {};

  if (!args.hadExistingRow) {
    captureLearnerProductEvent(userId, entitlement, PH.learnerLessonStarted, {
      source: args.source,
      pathway_id: args.pathwayId,
      lesson_slug: args.lessonSlug,
      lesson_key,
      ...examProps,
    });
  }

  if (args.nextCompleted && !args.priorCompleted) {
    captureLearnerProductEvent(userId, entitlement, PH.learnerLessonCompleted, {
      source: args.source,
      pathway_id: args.pathwayId,
      lesson_slug: args.lessonSlug,
      lesson_key,
      ...examProps,
    });
  }
}
