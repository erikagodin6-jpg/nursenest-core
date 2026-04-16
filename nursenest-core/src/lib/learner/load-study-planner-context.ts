import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildVisibleLessonScopeForLearner } from "@/lib/learner/learner-visible-lesson-scope";
import {
  loadLearnerDashboard,
  loadPathwayLessonProgressBundle,
  loadPathwayStudySummaries,
  type LearnerDashboardModel,
} from "@/lib/learner/load-learner-dashboard";

/**
 * Loads the pathway catalog bundle once, then threads it into dashboard + summaries (no duplicate User / slug-list reads).
 */
export type StudyPlannerContext = {
  dashboard: LearnerDashboardModel | null;
  pathways: Awaited<ReturnType<typeof loadPathwayStudySummaries>>;
  dailyStudyMinutes: number | null;
  examFocus: string | null;
  studyGoal: string | null;
};

export async function loadStudyPlannerContext(
  userId: string,
  entitlement: AccessScope,
): Promise<StudyPlannerContext | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const bundle = await loadPathwayLessonProgressBundle(userId, entitlement);
  if (!bundle) return null;

  const visibleLessonScope = await buildVisibleLessonScopeForLearner(entitlement, bundle.pathwayLessonRows);

  const [dashboard, pathways, user] = await Promise.all([
    loadLearnerDashboard(userId, entitlement, {
      userProfile: bundle.user,
      visibleLessonScope,
      pathwayRowsForScope: bundle.pathwayLessonRows,
    }),
    loadPathwayStudySummaries(userId, entitlement, {
      lessonRows: bundle.pathwayLessonRows,
      pathwayProgress: bundle.pathwayProgressScoped,
      learnerPath: bundle.user.learnerPath,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStudyMinutes: true, examFocus: true, studyGoal: true },
    }),
  ]);

  return {
    dashboard,
    pathways,
    dailyStudyMinutes: user?.dailyStudyMinutes ?? null,
    examFocus: user?.examFocus ?? null,
    studyGoal: user?.studyGoal ?? null,
  };
}
