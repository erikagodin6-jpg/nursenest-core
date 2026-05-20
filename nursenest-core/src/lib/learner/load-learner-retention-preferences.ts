import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";

/**
 * Soft preferences only — no new tables. Used for copy on the dashboard (daily goal + motivation).
 */
export type LearnerRetentionPreferences = {
  studyGoal: string | null;
  dailyStudyMinutes: number | null;
};

export async function loadLearnerRetentionPreferences(userId: string): Promise<LearnerRetentionPreferences | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  return withDatabaseFallback(
    async () => {
      const row = await prisma.user.findUnique({
        where: { id: userId },
        select: { studyGoal: true, dailyStudyMinutes: true },
      });
      if (!row) return null;
      return {
        studyGoal: row.studyGoal?.trim() || null,
        dailyStudyMinutes: typeof row.dailyStudyMinutes === "number" && row.dailyStudyMinutes > 0 ? row.dailyStudyMinutes : null,
      };
    },
    null,
  );
}
