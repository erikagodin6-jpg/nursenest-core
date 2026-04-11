import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadTodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import { loadStudyStreakDays } from "@/lib/learner/premium-dashboard-snapshot";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import {
  computeEngagementNudges,
  loadHoursSinceLastActivity,
  type EngagementContext,
} from "@/lib/retention/engagement-triggers";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const { userId, entitlement } = gate;
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ nudges: [] });
  }

  try {
    const [todayGoal, streakDays, hoursSince, userRow] = await Promise.all([
      loadTodayGoalProgress(userId),
      loadStudyStreakDays(userId),
      loadHoursSinceLastActivity(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: { examDate: true, learnerPath: true },
      }),
    ]);

    const topicStats = await prisma.userTopicStat.findMany({
      where: { userId },
      orderBy: { wrongCount: "desc" },
      take: 10,
      select: { topic: true, correctCount: true, wrongCount: true },
    });

    const withRates = topicStats.map((t) => {
      const total = t.correctCount + t.wrongCount;
      return { topic: t.topic, missRate: total > 0 ? t.wrongCount / total : 0, total };
    });

    const weakTopicName =
      withRates.find((t) => t.missRate > 0.4 && t.total >= 3)?.topic ?? null;
    const improvingTopicName =
      withRates.find((t) => t.missRate < 0.3 && t.total >= 5)?.topic ?? null;

    let flashcardDueToday = 0;
    let flashcardOverdue = 0;
    try {
      const now = new Date();
      const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

      [flashcardDueToday, flashcardOverdue] = await Promise.all([
        prisma.flashcardProgress.count({
          where: { userId, nextReviewAt: { gte: todayStart, lte: todayEnd } },
        }),
        prisma.flashcardProgress.count({
          where: { userId, nextReviewAt: { lt: todayStart } },
        }),
      ]);
    } catch {
      // Flashcard tables may not exist
    }

    let continueLesson: { title: string; href: string } | null = null;
    try {
      const incompleteProgress = await prisma.progress.findFirst({
        where: { userId, completedAt: null },
        orderBy: { updatedAt: "desc" },
        select: { lessonId: true },
      });

      if (incompleteProgress?.lessonId) {
        const resolved = await resolveLessonRefFromProgressId({
          lessonId: incompleteProgress.lessonId,
          entitlement,
          learnerPath: userRow?.learnerPath ?? null,
        });
        if (resolved) {
          continueLesson = { title: resolved.title, href: resolved.href };
        }
      }
    } catch {
      // Non-critical
    }

    const ctx: EngagementContext = {
      streakDays,
      todayGoal,
      weakTopicName,
      improvingTopicName,
      examDate: userRow?.examDate ?? null,
      flashcardDueToday,
      flashcardOverdue,
      continueLesson,
      hoursSinceLastActivity: hoursSince,
    };

    const nudges = computeEngagementNudges(ctx);

    return NextResponse.json({ nudges });
  } catch {
    return NextResponse.json({ nudges: [] });
  }
}
