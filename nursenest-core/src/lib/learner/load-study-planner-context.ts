import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  loadLearnerDashboard,
  loadPathwayLessonProgressBundle,
  loadPathwayStudySummaries,
  type LearnerDashboardModel,
} from "@/lib/learner/load-learner-dashboard";

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

  const [dashboard, pathways, user] = await Promise.all([
    loadLearnerDashboard(userId, entitlement, {
      userProfile: bundle.user,
    }),
    loadPathwayStudySummaries(userId, entitlement, {
      lessonRows: bundle.pathwayLessonRows,
      pathwayProgress: bundle.pathwayProgressScoped,
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
