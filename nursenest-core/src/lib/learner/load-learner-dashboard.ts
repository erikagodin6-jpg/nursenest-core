import { TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  filterTopicRowsForAlliedProfession,
  filterWeakTopicsForAlliedProfession,
} from "@/lib/allied/allied-weak-topic-filter";
import { computeReadiness, type ReadinessResult } from "@/lib/learner/readiness-score";
import { loadSessionGradingAggregate, type SessionGradingAggregate } from "@/lib/learner/session-grading-aggregate";
import {
  loadUnifiedTopicPerformance,
  type TopicPerformanceSnapshot,
  type TopicTrendRow,
} from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { normalizeLesson, pathwayLessonRowToInput } from "@/lib/lessons/pathway-lesson-loader";

export type ContinueLesson = {
  title: string;
  href: string;
  kind: "content" | "pathway" | "pre_nursing";
};

export type RecentMock = {
  id: string;
  examTitle: string;
  score: number;
  total: number;
  pct: number;
  at: string;
};

export type LearnerDashboardModel = {
  scope: { tier: string; country: string };
  /** Saved exam pathway on the user profile (for deep links). */
  learnerPath: string | null;
  lessonsCompleted: number;
  lessonsAvailable: number;
  questionsInMocksLast14d: number;
  recentMocks: RecentMock[];
  weakTopics: WeakTopicRow[];
  /** Highest-accuracy topics (≥3 attempts) for reinforcement copy. */
  strongTopics: WeakTopicRow[];
  /** Momentum heuristics for planner + adaptive copy. */
  topicTrends: TopicTrendRow[];
  /** Full snapshot when topic perf loaded (optional for callers that need breakdown). */
  topicPerformance: TopicPerformanceSnapshot | null;
  continueLesson: ContinueLesson | null;
  recommendedQuizTopic: string | null;
  readiness: ReadinessResult;
  /** Recent completed exam-session grading (tier-scoped); reused by premium snapshot. */
  sessionGrading: SessionGradingAggregate;
};

export async function loadLearnerDashboard(
  userId: string,
  entitlement: AccessScope,
): Promise<LearnerDashboardModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) {
    return null;
  }

  const tier = String(entitlement.tier ?? "");
  const country = String(entitlement.country ?? "");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true, tier: true, alliedProfessionKey: true },
  });
  const learnerPath = user?.learnerPath ?? null;

  const lessonWhere = lessonAccessWhere(entitlement);
  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  const [contentLessonTotal, pathwayLessonRows, lessonsCompleted, incompleteProgress] = await Promise.all([
    prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } }),
    prisma.pathwayLesson.findMany({
      where: pathwayWhere,
      select: {
        id: true,
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        previewSectionCount: true,
        seoTitle: true,
        seoDescription: true,
        sections: true,
        locale: true,
      },
      take: 2000,
    }),
    prisma.progress.count({ where: { userId, completed: true } }),
    prisma.progress.findFirst({
      where: { userId, completed: false },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true },
    }),
  ]);

  const pathwayLessonTotal = pathwayLessonRows.filter((row) =>
    normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId).structuralQuality?.publicComplete,
  ).length;
  const lessonsAvailable = contentLessonTotal + pathwayLessonTotal;

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const recentAttempts = await prisma.examAttempt.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { total: true },
  });
  const questionsInMocksLast14d = recentAttempts.reduce((sum, a) => sum + a.total, 0);

  const recentMocksRaw = await prisma.examAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      score: true,
      total: true,
      createdAt: true,
      exam: { select: { title: true } },
    },
  });

  const recentMocks: RecentMock[] = recentMocksRaw.map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    at: a.createdAt.toISOString(),
  }));

  let weakTopics: WeakTopicRow[] = [];
  let strongTopics: WeakTopicRow[] = [];
  let topicTrends: TopicTrendRow[] = [];
  let topicPerformance: TopicPerformanceSnapshot | null = null;
  let recommendedQuizTopic: string | null = null;
  let practiceAgg = { correct: 0, total: 0, sessionCount: 0 };
  try {
    const perf = await loadUnifiedTopicPerformance(userId, entitlement, 8);
    topicPerformance = perf;
    weakTopics = perf.weakTopics;
    strongTopics = perf.strongTopics;
    topicTrends = perf.trends;
    recommendedQuizTopic = perf.recommendedQuizTopic ?? perf.weakTopics[0]?.topic ?? null;
  } catch {
    weakTopics = [];
    strongTopics = [];
    topicTrends = [];
    topicPerformance = null;
    recommendedQuizTopic = null;
  }

  if (user?.tier === TierCode.ALLIED && user.alliedProfessionKey) {
    const ap = getAlliedProfessionByProfessionKey(user.alliedProfessionKey);
    weakTopics = filterWeakTopicsForAlliedProfession(weakTopics, ap);
    strongTopics = filterWeakTopicsForAlliedProfession(strongTopics, ap);
    topicTrends = filterTopicRowsForAlliedProfession(topicTrends, ap);
    recommendedQuizTopic = weakTopics[0]?.topic ?? null;
    if (topicPerformance) {
      topicPerformance = {
        ...topicPerformance,
        weakTopics,
        strongTopics,
        trends: topicTrends,
      };
    }
  }
  try {
    practiceAgg = await loadSessionGradingAggregate(userId, entitlement, 8);
  } catch {
    practiceAgg = { correct: 0, total: 0, sessionCount: 0 };
  }

  let continueLesson: ContinueLesson | null = null;
  if (incompleteProgress?.lessonId) {
    try {
      continueLesson = await resolveLessonRefFromProgressId({
        lessonId: incompleteProgress.lessonId,
        entitlement,
        learnerPath,
      });
    } catch {
      continueLesson = null;
    }
  }

  const readiness = computeReadiness({
    practiceCorrect: practiceAgg.correct,
    practiceTotal: practiceAgg.total,
    recentMocks: recentMocks.map((m) => ({ score: m.score, total: m.total })),
    weakTopics,
    lessonsCompleted,
    lessonsAvailable,
    scope: { tier, country },
  });

  return {
    scope: { tier, country },
    learnerPath,
    lessonsCompleted,
    lessonsAvailable,
    questionsInMocksLast14d,
    recentMocks,
    weakTopics,
    strongTopics,
    topicTrends,
    topicPerformance,
    continueLesson,
    recommendedQuizTopic,
    readiness,
    sessionGrading: practiceAgg,
  };
}

/** Pathway summaries for study planner (same tier/country scope). */
export async function loadPathwayStudySummaries(
  userId: string,
  entitlement: AccessScope,
): Promise<
  {
    pathwayId: string;
    label: string;
    shortLabel: string;
    lessonsTotal: number;
    lessonsCompleted: number;
    lessonsInProgress: number;
  }[]
> {
  if (!entitlement.hasAccess || !isDatabaseUrlConfigured()) return [];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });
  const learnerPath = user?.learnerPath ?? null;

  const pathways = listPathwaysCompatibleWithSubscription(entitlement);
  if (pathways.length === 0) return [];

  // `baseWhere` already includes `pathwayId: { in: [...] }` so the groupBy is pathway-scoped.
  const baseWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  // Two queries regardless of pathway count (was 3N sequential).
  const [lessonRows, allPathwayProgress] = await Promise.all([
    prisma.pathwayLesson.findMany({
      where: baseWhere,
      select: {
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        previewSectionCount: true,
        seoTitle: true,
        seoDescription: true,
        sections: true,
        locale: true,
      },
      take: 2500,
    }).catch(() => [] as Array<{
      pathwayId: string;
      slug: string;
      title: string;
      topic: string;
      topicSlug: string;
      bodySystem: string;
      previewSectionCount: number;
      seoTitle: string;
      seoDescription: string;
      sections: unknown;
      locale: string;
    }>),
    // Batch: all completed/in-progress pathway lessons for this user, aggregated in memory.
    prisma.progress.findMany({
      where: { userId, lessonId: { startsWith: "pathway:" } },
      select: { lessonId: true, completed: true },
    }).catch(() => [] as { lessonId: string; completed: boolean }[]),
  ]);

  const totalsByPathway = new Map<string, number>();
  for (const row of lessonRows) {
    if (!normalizeLesson(pathwayLessonRowToInput({ ...row, id: `${row.pathwayId}:${row.slug}` }), row.pathwayId).structuralQuality?.publicComplete) {
      continue;
    }
    totalsByPathway.set(row.pathwayId, (totalsByPathway.get(row.pathwayId) ?? 0) + 1);
  }

  // Parse "pathway:{pathwayId}:{slug}" and tally per pathwayId.
  const progressByPathway = new Map<string, { completed: number; inProgress: number }>();
  for (const r of allPathwayProgress) {
    const rest = r.lessonId.slice("pathway:".length);
    const colonIdx = rest.indexOf(":");
    if (colonIdx < 0) continue;
    const pid = rest.slice(0, colonIdx);
    if (!progressByPathway.has(pid)) progressByPathway.set(pid, { completed: 0, inProgress: 0 });
    const entry = progressByPathway.get(pid)!;
    if (r.completed) entry.completed++;
    else entry.inProgress++;
  }

  return pathways.map((p) => ({
    pathwayId: p.id,
    label: p.displayName,
    shortLabel: p.shortName || p.displayName,
    lessonsTotal: totalsByPathway.get(p.id) ?? 0,
    lessonsCompleted: progressByPathway.get(p.id)?.completed ?? 0,
    lessonsInProgress: progressByPathway.get(p.id)?.inProgress ?? 0,
  }));
}
