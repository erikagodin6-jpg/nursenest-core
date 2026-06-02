import { Prisma, SocialStatKey, type PrismaClient } from "@prisma/client";
import { buildSanitizedSocialSnapshots } from "@/lib/social-study/social-stat-snapshot";

function percent(correct: number | null | undefined, total: number | null | undefined): number | null {
  if (!total || total <= 0 || correct == null) return null;
  return Math.round((correct / total) * 100);
}

export async function refreshSocialStatSnapshots(prisma: PrismaClient, userId: string): Promise<void> {
  const [profile, readiness, weakTopics] = await Promise.all([
    prisma.student_study_profiles.findUnique({ where: { user_id: userId } }),
    prisma.readiness_history.findFirst({ where: { user_id: userId }, orderBy: { created_at: "desc" } }),
    prisma.userTopicStat.findMany({
      where: { userId, wrongCount: { gt: 0 } },
      orderBy: [{ wrongStreak: "desc" }, { wrongCount: "desc" }, { updatedAt: "desc" }],
      take: 8,
      select: { topic: true },
    }),
  ]);

  const totalAnswered = profile?.total_questions_answered ?? null;
  const rows = buildSanitizedSocialSnapshots(userId, {
    readinessScore: readiness?.readiness_score ?? profile?.readiness_score ?? null,
    readinessBand: readiness?.readiness_tier ?? profile?.readiness_level ?? null,
    weeklyStudyStreak: profile?.current_streak ?? null,
    practiceAccuracyPct: percent(profile?.total_correct, totalAnswered),
    flashcardProgressPct: null,
    flashcardsStudiedCount: profile?.flashcards_studied ?? null,
    weakTopicCodes: weakTopics.map((topic) => topic.topic),
    catCompletedCount: profile?.adaptive_exams_completed ?? null,
  });

  if (rows.length === 0) return;

  await prisma.$transaction([
    prisma.socialStatSnapshot.deleteMany({
      where: {
        userId,
        statKey: { in: rows.map((row) => row.statKey) as SocialStatKey[] },
      },
    }),
    prisma.socialStatSnapshot.createMany({
      data: rows.map((row) => ({ ...row, value: row.value as Prisma.InputJsonValue })),
    }),
  ]);
}
