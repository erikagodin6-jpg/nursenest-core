import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const TODAY_GOAL_CREDIT_TARGET = 3;

export type TodayGoalBreakdown = {
  /** Any exam attempt logged today (UTC day). */
  hasExamActivity: boolean;
  /** Any completed practice / CAT session today. */
  hasPracticeCompleted: boolean;
  /** Any pathway lesson progress touch today. */
  hasLessonTouch: boolean;
};

export type TodayGoalProgress = {
  credits: number;
  target: typeof TODAY_GOAL_CREDIT_TARGET;
  breakdown: TodayGoalBreakdown;
  /** ISO date (UTC) for display + client dedupe keys. */
  utcDate: string;
};

function startOfUtcDay(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Soft "today's goal" = 3 lightweight study credits (UTC calendar day, same basis as streak signals):
 * one credit each for exam activity, completed adaptive practice, and lesson work.
 */
export async function loadTodayGoalProgress(userId: string): Promise<TodayGoalProgress | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const since = startOfUtcDay();
  const utcDate = since.toISOString().slice(0, 10);

  try {
    const [examHit, practiceHit, lessonHit] = await Promise.all([
      prisma.examAttempt.findFirst({
        where: { userId, createdAt: { gte: since } },
        select: { id: true },
      }),
      prisma.practiceTest.findFirst({
        where: {
          userId,
          status: PracticeTestStatus.COMPLETED,
          completedAt: { not: null, gte: since },
        },
        select: { id: true },
      }),
      prisma.progress.findFirst({
        where: { userId, updatedAt: { gte: since } },
        select: { id: true },
      }),
    ]);

    const hasExamActivity = examHit != null;
    const hasPracticeCompleted = practiceHit != null;
    const hasLessonTouch = lessonHit != null;

    const credits =
      (hasExamActivity ? 1 : 0) + (hasPracticeCompleted ? 1 : 0) + (hasLessonTouch ? 1 : 0);

    return {
      credits,
      target: TODAY_GOAL_CREDIT_TARGET,
      breakdown: { hasExamActivity, hasPracticeCompleted, hasLessonTouch },
      utcDate,
    };
  } catch {
    return null;
  }
}
