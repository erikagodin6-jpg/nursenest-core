import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { buildCountdownCopy } from "@/lib/learner/exam-timeline";
import { recommendNextActions } from "@/lib/learner/recommend-next-actions";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";

export type LearnerStudyNextBlockModel = {
  countdownPrimary: string;
  countdownSecondary: string | null;
  plannerHref: string;
  primary: StudyNextRecommendation;
  secondary: StudyNextRecommendation[];
};

/**
 * Subscriber dashboard strip: bounded snapshot + deterministic recommendations + exam countdown.
 */
export async function loadLearnerStudyNextBlock(
  userId: string,
  entitlement: AccessScope,
): Promise<LearnerStudyNextBlockModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { examDate: true, examDatePlanType: true, learnerPath: true },
  });
  if (!user) return null;

  const snapshot = await buildLearnerStudySnapshot(userId, entitlement, user.learnerPath);
  if (!snapshot) return null;

  const actions = recommendNextActions(snapshot, { maxTotal: 3 });
  if (actions.length === 0) return null;

  const countdown = buildCountdownCopy({
    examDatePlanType: user.examDatePlanType,
    examDate: user.examDate,
  });

  return {
    countdownPrimary: countdown.primary,
    countdownSecondary: countdown.secondary,
    plannerHref: "/app/study-plan",
    primary: actions[0]!,
    secondary: actions.slice(1),
  };
}
