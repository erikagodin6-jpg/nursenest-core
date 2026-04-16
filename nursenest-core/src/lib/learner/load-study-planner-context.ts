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

  const bundle = await loadPathwayLessonProgressBundle(userId, entitlement, { source: "loadStudyPlannerContext" });
  if (!bundle) return null;

  const visibleLessonScope = await buildVisibleLessonScopeForLearner(entitlement, bundle.pathwayLessonRows);

  const [dashboard, pathways] = await Promise.all([
    loadLearnerDashboard(userId, entitlement, {
      source: "loadStudyPlannerContext",
      userProfile: bundle.user,
      visibleLessonScope,
      pathwayRowsForScope: bundle.pathwayLessonRows,
      pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
      pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
    }),
    loadPathwayStudySummaries(userId, entitlement, {
      lessonRows: bundle.pathwayLessonRows,
      pathwayProgress: bundle.pathwayProgressScoped,
      learnerPath: bundle.user.learnerPath,
    }),
  ]);

  return {
    dashboard,
    pathways,
    dailyStudyMinutes: bundle.user.dailyStudyMinutes,
    examFocus: bundle.user.examFocus,
    studyGoal: bundle.user.studyGoal,
  };
}
