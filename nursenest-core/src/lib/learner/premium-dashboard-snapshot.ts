import { ContentStatus, ExamDatePlanType, FlashcardDeckVisibility, Prisma, TierCode } from "@prisma/client";
import { learnerPrivateReadAccessScopeKey, loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildLearnerInsightSnapshot } from "@/lib/insights/learner-insight-engine";
import type { LearnerInsightSnapshot } from "@/lib/insights/types";
import {
  loadLessonContinuationRows,
  type LessonContinuationRow,
} from "@/lib/learner/pathway-lesson-continuation";
import { buildVisibleLessonScopeForLearner } from "@/lib/learner/learner-visible-lesson-scope";
import {
  loadLearnerDashboard,
  loadPathwayLessonProgressBundle,
  loadPathwayStudySummaries,
  type RecentMock,
} from "@/lib/learner/load-learner-dashboard";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { LearnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { learnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";

export type PathwayProgressRow = {
  pathwayId: string;
  label: string;
  shortLabel: string;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** Rows with completed=false (opened / in progress, not finished). */
  lessonsInProgress: number;
  /** 0–100 */
  pct: number;
};

export type PracticePerformanceSummary = {
  gradedCorrect: number;
  gradedTotal: number;
  sessionCount: number;
  accuracyPct: number | null;
};

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDaysYmd(day: string, delta: number): string {
  const [y, m, dd] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, dd!));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

/**
 * Consecutive calendar days (UTC) with any study signal, anchored to today or yesterday.
 */
export async function loadStudyStreakDays(userId: string, lookbackDays = 90): Promise<number> {
  if (!userId || !isDatabaseUrlConfigured()) return 0;
  const since = new Date(Date.now() - lookbackDays * 86400000);
  try {
    /** One round-trip: distinct UTC calendar days with activity (replaces three unbounded findMany scans). */
    const dayRows = await prisma.$queryRaw<Array<{ day: string }>>(Prisma.sql`
      SELECT DISTINCT to_char(d, 'YYYY-MM-DD') AS day
      FROM (
        SELECT ("createdAt" AT TIME ZONE 'UTC')::date AS d FROM "ExamAttempt"
        WHERE "userId" = ${userId} AND "createdAt" >= ${since}
        UNION ALL
        SELECT ("updatedAt" AT TIME ZONE 'UTC')::date AS d FROM "Progress"
        WHERE "userId" = ${userId} AND "updatedAt" >= ${since}
        UNION ALL
        SELECT ("completedAt" AT TIME ZONE 'UTC')::date AS d FROM "practice_tests"
        WHERE "userId" = ${userId}
          AND "status" = 'COMPLETED'::"PracticeTestStatus"
          AND "completedAt" IS NOT NULL
          AND "completedAt" >= ${since}
      ) u
    `);

    const dates = new Set<string>(dayRows.map((r) => r.day));
    safeServerLog("learner_dashboard", "study_streak_activity_days_sql", {
      distinctDayCount: dates.size,
      lookbackDays,
    });

    const today = ymd(new Date());
    let cursor = dates.has(today) ? today : addDaysYmd(today, -1);
    if (!dates.has(cursor)) return 0;

    let streak = 0;
    while (dates.has(cursor)) {
      streak += 1;
      cursor = addDaysYmd(cursor, -1);
    }
    return streak;
  } catch {
    return 0;
  }
}

function topStrongTopicFromLedger(userId: string): Promise<string | null> {
  return prisma.userTopicStat
    .findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { topic: true, correctCount: true, wrongCount: true },
      take: 120,
    })
    .then((rows) => {
      let best: { topic: string; acc: number; n: number } | null = null;
      for (const s of rows) {
        const n = s.correctCount + s.wrongCount;
        if (n < 5) continue;
        const acc = s.correctCount / n;
        if (acc < 0.72) continue;
        if (!best || acc > best.acc || (acc === best.acc && n > best.n)) {
          best = { topic: s.topic, acc, n };
        }
      }
      return best?.topic ?? null;
    })
    .catch(() => null);
}

function buildMomentumMessages(args: {
  recentMocks: RecentMock[];
  topStrongTopic: string | null;
  readiness: ReadinessResult;
  streakDays: number;
  lessonPct: number;
}): string[] {
  const out: string[] = [];

  if (args.streakDays >= 3) {
    out.push(
      args.streakDays >= 7
        ? `${args.streakDays}-day study streak. Consistency like this compounds.`
        : `${args.streakDays} days in a row. Keep it going.`,
    );
  }

  if (args.recentMocks.length >= 2) {
    const latest = args.recentMocks[0]!;
    const prev = args.recentMocks[1]!;
    if (latest.pct > prev.pct) {
      out.push(`Latest mock improved: ${latest.pct}% vs ${prev.pct}% prior.`);
    }
  }

  if (args.topStrongTopic) {
    out.push(`Performing well in ${args.topStrongTopic}. Mix in a weak-topic set to balance.`);
  }

  if (args.lessonPct >= 40 && args.lessonPct < 85) {
    out.push(`${args.lessonPct}% of your lesson plan complete.`);
  }

  if (args.readiness.band === "near_ready") {
    out.push("Getting close to exam-ready. Focus on weak topics and run another mock.");
  } else if (args.readiness.band === "ready") {
    out.push("Looking strong. Stay sharp with spaced review and rest.");
  } else if (args.readiness.band === "improving") {
    out.push("Trending in the right direction. One more scored session this week will help.");
  }

  return [...new Set(out)].slice(0, 4);
}

function examReadyHeadline(readiness: ReadinessResult): string | null {
  if (readiness.band === "near_ready") {
    return "Close to exam-ready";
  }
  if (readiness.band === "ready") {
    return "In strong exam shape";
  }
  if (readiness.band === "improving" && readiness.score != null && readiness.score >= 55) {
    return "Gaining ground toward exam readiness";
  }
  return null;
}

function milestoneLines(args: {
  pathways: PathwayProgressRow[];
  lessonPct: number;
  practice: PracticePerformanceSummary;
  streakDays: number;
  mockCount: number;
}): string[] {
  const lines: string[] = [];

  if (args.lessonPct >= 25 && args.lessonPct < 100) {
    lines.push(`${args.lessonPct}% of your lesson pool complete`);
  } else if (args.lessonPct >= 100) {
    lines.push("Lesson pool complete for your plan. Rotate mocks and weak-topic drills.");
  }

  const bestPath = [...args.pathways].sort((a, b) => b.pct - a.pct)[0];
  if (bestPath && bestPath.lessonsTotal > 0) {
    if (bestPath.pct >= 50 && bestPath.pct < 100) {
      lines.push(`Halfway through ${bestPath.shortLabel} pathway lessons`);
    } else if (bestPath.pct >= 100) {
      lines.push(`${bestPath.shortLabel} pathway lessons complete`);
    } else if (bestPath.pct >= 25) {
      lines.push(`${bestPath.pct}% through ${bestPath.shortLabel} pathway`);
    }
  }

  if (args.practice.gradedTotal >= 25) {
    lines.push(`${args.practice.gradedTotal} scored items in recent sessions`);
  }

  if (args.streakDays >= 5) {
    lines.push(`${args.streakDays}-day activity streak`);
  }

  if (args.mockCount >= 3) {
    lines.push(`${args.mockCount} mock exams logged. Use trends, not single scores`);
  }

  return lines.slice(0, 5);
}

export type PremiumDashboardSnapshot = {
  /** User's selected exam track from profile — drives pathway-specific CAT shortcuts when unambiguous. */
  learnerPath: string | null;
  pathways: PathwayProgressRow[];
  overallLessons: { completed: number; total: number; pct: number };
  readiness: ReadinessResult;
  practice: PracticePerformanceSummary;
  recentMocks: RecentMock[];
  studyStreakDays: number;
  momentumMessages: string[];
  examReadyHeadline: string | null;
  milestones: string[];
  mockCount: number;
  /** Next incomplete lesson in tier/country scope (for adaptive next-step). */
  continueLesson: { title: string; href: string } | null;
  recommendedQuizTopic: string | null;
  /** Flashcard stats + suggested decks (optional if tables missing). */
  flashcards: {
    cardsReviewedTotal: number;
    reviewStreak: number;
    suggestedDecks: { slug: string; title: string; cardCount: number }[];
  } | null;
  /** Central interpretation engine: performance, gaps, explainable next steps. */
  insights: LearnerInsightSnapshot | null;
  /** Marketing deep links to last pathway lesson per track (RN / PN / NP). */
  lessonContinuations: LessonContinuationRow[];
  /** Pass to {@link buildLearnerStudySnapshot} to avoid a second topic-performance query on the home dashboard. */
  topicPerformance: TopicPerformanceSnapshot | null;
  /**
   * Profile slice from the pathway bundle (same request as dashboard) — avoids a redundant `User`
   * read on the home page for study snapshot + exam countdown.
   */
  studyBootstrap: {
    alliedProfessionKey: string | null;
    tier: TierCode | null;
    learnerPath: string | null;
    examDate: Date | null;
    examDatePlanType: ExamDatePlanType | null;
  };
  degraded?: LearnerAggregateDegradedState;
};

async function loadPremiumDashboardSnapshotUncached(
  userId: string,
  entitlement: AccessScope,
): Promise<PremiumDashboardSnapshot | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;
  try {
    const bundle = await loadPathwayLessonProgressBundle(userId, entitlement, { source: "loadPremiumDashboardSnapshot" });
    if (!bundle) return null;

    const visibleLessonScope = await buildVisibleLessonScopeForLearner(userId, entitlement, {
      learnerPath: bundle.user.learnerPath,
      pathwayLessonRows: bundle.pathwayLessonRows,
    });

    const dash = await loadLearnerDashboard(userId, entitlement, {
      source: "loadPremiumDashboardSnapshot",
      userProfile: bundle.user,
      visibleLessonScope,
      pathwayRowsForScope: bundle.pathwayLessonRows,
      pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
      pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
    });
    if (!dash) return null;

    const skipOptional = shouldSkipNonCriticalLearnerWork();

    const [pathwayRaw, streakDays, topStrongTopic] = await Promise.all([
      loadPathwayStudySummaries(userId, entitlement, {
        lessonRows: bundle.pathwayLessonRows,
        pathwayProgress: bundle.pathwayProgressScoped,
        learnerPath: bundle.user.learnerPath,
      }),
      skipOptional ? Promise.resolve(0) : loadStudyStreakDays(userId),
      skipOptional ? Promise.resolve(null) : topStrongTopicFromLedger(userId),
    ]);

    const lessonContinuations = skipOptional
      ? []
      : await loadLessonContinuationRows(userId, entitlement, bundle.user.learnerPath ?? null);

    const pathways: PathwayProgressRow[] = pathwayRaw.map((p) => {
      const pct = p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0;
      return { ...p, pct };
    });

    const lessonPct =
      dash.lessonsAvailable > 0 ? Math.round((dash.lessonsCompleted / dash.lessonsAvailable) * 100) : 0;

    const agg = dash.sessionGrading;
    const practice: PracticePerformanceSummary = {
      gradedCorrect: agg.correct,
      gradedTotal: agg.total,
      sessionCount: agg.sessionCount,
      accuracyPct: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : null,
    };

    const momentumMessages = buildMomentumMessages({
      recentMocks: dash.recentMocks,
      topStrongTopic,
      readiness: dash.readiness,
      streakDays,
      lessonPct,
    });

    const headline = examReadyHeadline(dash.readiness);

    /** Full-table counts are expensive at scale; in degraded mode use recent mock list length only. */
    const mockCount = skipOptional
      ? dash.recentMocks.length
      : await prisma.examAttempt.count({ where: { userId } }).catch(() => dash.recentMocks.length);

    const milestones = milestoneLines({
      pathways,
      lessonPct,
      practice,
      streakDays,
      mockCount,
    });

    let flashcards: PremiumDashboardSnapshot["flashcards"] = null;
    if (!skipOptional) {
      try {
        const [fcStats, suggested] = await Promise.all([
          prisma.flashcardUserStats.findUnique({
            where: { userId },
            select: { cardsReviewedTotal: true, currentStreak: true },
          }),
          prisma.flashcardDeck.findMany({
            where: {
              status: ContentStatus.PUBLISHED,
              visibility: { not: FlashcardDeckVisibility.HIDDEN },
            },
            orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
            take: 4,
            select: { slug: true, title: true, cardCount: true },
          }),
        ]);
        flashcards = {
          cardsReviewedTotal: fcStats?.cardsReviewedTotal ?? 0,
          reviewStreak: fcStats?.currentStreak ?? 0,
          suggestedDecks: suggested.map((d) => ({
            slug: d.slug,
            title: d.title,
            cardCount: d.cardCount,
          })),
        };
      } catch {
        flashcards = null;
      }
    }

    let insights: LearnerInsightSnapshot | null = null;
    if (!skipOptional) {
      try {
        insights = await buildLearnerInsightSnapshot(userId, entitlement, dash, {
          streakDays,
          mockCount,
          examDate: bundle.user.examDate,
          examDatePlanType: bundle.user.examDatePlanType,
        });
      } catch {
        insights = null;
      }
    }

    return {
      learnerPath: bundle.user.learnerPath?.trim() || null,
      pathways,
      overallLessons: {
        completed: dash.lessonsCompleted,
        total: dash.lessonsAvailable,
        pct: lessonPct,
      },
      readiness: dash.readiness,
      practice,
      recentMocks: dash.recentMocks,
      studyStreakDays: streakDays,
      momentumMessages,
      examReadyHeadline: headline,
      milestones,
      mockCount,
      continueLesson: dash.continueLesson ? { title: dash.continueLesson.title, href: dash.continueLesson.href } : null,
      recommendedQuizTopic: dash.recommendedQuizTopic,
      flashcards,
      insights,
      lessonContinuations,
      topicPerformance: dash.topicPerformance,
      studyBootstrap: {
        alliedProfessionKey: bundle.user.alliedProfessionKey ?? null,
        tier: bundle.user.tier ?? null,
        learnerPath: bundle.user.learnerPath ?? null,
        examDate: bundle.user.examDate ?? null,
        examDatePlanType: bundle.user.examDatePlanType ?? null,
      },
      degraded: skipOptional
        ? learnerAggregateDegradedState("durability_degraded", [
            "study_streak",
            "strong_topic",
            "lesson_continuations",
            "flashcards",
            "insights",
          ])
        : undefined,
    };
  } catch {
    safeServerLog("learner_dashboard", "premium_snapshot_load_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
    return null;
  }
}

export async function loadPremiumDashboardSnapshot(
  userId: string,
  entitlement: AccessScope,
): Promise<PremiumDashboardSnapshot | null> {
  return loadWithLearnerPrivateReadCache(
    {
      surface: "premium-dashboard-snapshot",
      userId,
      ttlSeconds: 45,
      keyParts: [
        learnerPrivateReadAccessScopeKey(entitlement),
        { degraded: shouldSkipNonCriticalLearnerWork() },
      ],
      bypass: !entitlement.hasAccess || entitlement.reason === "admin_override",
    },
    () => loadPremiumDashboardSnapshotUncached(userId, entitlement),
  );
}
