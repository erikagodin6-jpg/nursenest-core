import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { sameUtcCalendarDay, startOfUtcDay } from "@/lib/time/utc-calendar";

export const DEFAULT_DAILY_QUESTION_GOAL = 20;
const MIN_GOAL = 5;
const MAX_GOAL = 120;

export type DailyQuestionGoalProgress = {
  gradedToday: number;
  target: number;
  utcDate: string;
  complete: boolean;
};

function clampTarget(n: number | null | undefined): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return DEFAULT_DAILY_QUESTION_GOAL;
  return Math.min(MAX_GOAL, Math.max(MIN_GOAL, Math.round(n)));
}

/**
 * Graded question-bank progress for the current UTC day vs the learner's target (default 20).
 */
export async function loadDailyQuestionGoalProgress(userId: string): Promise<DailyQuestionGoalProgress | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const today = startOfUtcDay();
  const utcDate = today.toISOString().slice(0, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyQuestionGoal: true,
        bankQuestionsGradedUtcDay: true,
        bankQuestionsGradedCount: true,
      },
    });
    if (!user) return null;

    const gradedToday =
      user.bankQuestionsGradedUtcDay && sameUtcCalendarDay(user.bankQuestionsGradedUtcDay, today)
        ? user.bankQuestionsGradedCount
        : 0;

    const target = clampTarget(user.dailyQuestionGoal);
    const complete = gradedToday >= target;

    return { gradedToday, target, utcDate, complete };
  } catch {
    return null;
  }
}
