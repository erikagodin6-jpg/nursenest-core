import "server-only";

import { prisma } from "@/lib/db";
import { sameUtcCalendarDay, startOfUtcDay } from "@/lib/time/utc-calendar";

/**
 * Counts each successful POST /api/questions/grade (subscriber path) toward the learner's UTC-day bank tally.
 */
export async function incrementBankQuestionsGradedToday(userId: string): Promise<void> {
  const today = startOfUtcDay();
  try {
    await prisma.$transaction(async (tx) => {
      const u = await tx.user.findUnique({
        where: { id: userId },
        select: { bankQuestionsGradedUtcDay: true, bankQuestionsGradedCount: true },
      });
      if (!u) return;
      const day = u.bankQuestionsGradedUtcDay;
      const nextCount =
        day && sameUtcCalendarDay(day, today) ? u.bankQuestionsGradedCount + 1 : 1;
      await tx.user.update({
        where: { id: userId },
        data: {
          bankQuestionsGradedUtcDay: today,
          bankQuestionsGradedCount: nextCount,
        },
      });
    });
  } catch {
    /* best-effort — grading response still succeeds */
  }
}
