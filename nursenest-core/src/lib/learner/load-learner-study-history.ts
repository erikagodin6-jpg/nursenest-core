import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import type { LearnerProfileActivity } from "@/lib/learner/load-learner-profile-activity";
import { loadLearnerProfileActivity } from "@/lib/learner/load-learner-profile-activity";

const MOCKS_TAKE = 15;
const TESTS_TAKE = 25;
const LESSONS_TAKE = 25;

/**
 * Extended study history for `/app/account/study-history` (server-only).
 * Same shape as profile activity with larger limits for a dedicated view.
 */
export async function loadLearnerStudyHistory(userId: string): Promise<LearnerProfileActivity> {
  const base = await loadLearnerProfileActivity(userId);
  if (!userId || !isDatabaseUrlConfigured()) return base;

  try {
    const [attempts, tests, progressRows] = await Promise.all([
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: MOCKS_TAKE,
        select: {
          id: true,
          score: true,
          total: true,
          createdAt: true,
          exam: { select: { id: true, title: true } },
        },
      }),
      prisma.practiceTest.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: TESTS_TAKE,
        select: {
          id: true,
          title: true,
          status: true,
          results: true,
          updatedAt: true,
        },
      }),
      prisma.progress.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: LESSONS_TAKE,
        select: { lessonId: true, completed: true, updatedAt: true },
      }),
    ]);

    const { buildProfileActivityFromRows } = await import("@/lib/learner/load-learner-profile-activity-internal");
    return buildProfileActivityFromRows(attempts, tests, progressRows);
  } catch {
    return base;
  }
}
