import { TierCode } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import { PATHWAY_CATALOG_LIST_HARD_CAP } from "@/lib/lessons/pathway-lesson-scale";
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
import { safeServerLog } from "@/lib/observability/safe-server-log";
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

/** Row shape for dashboard + pathway summaries (full `sections` JSON — required for structural gate). */
export type PathwayLessonDashboardRow = {
  id: string;
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
};

export type LearnerDashboardPreload = {
  pathwayLessonRows: PathwayLessonDashboardRow[];
  /** When provided with pathway rows, avoids a duplicate `user` query. */
  userProfile?: {
    learnerPath: string | null;
    tier: TierCode | null;
    alliedProfessionKey: string | null;
  };
};

export type PathwayStudySummariesPreload = {
  lessonRows: PathwayLessonDashboardRow[];
  pathwayProgress: { lessonId: string; completed: boolean }[];
};

const PATHWAY_LESSON_SELECT: Prisma.PathwayLessonSelect = {
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
};

/**
 * Single pathway-lesson list for learner dashboard scope (bounded, same cap as catalog hub math).
 */
export async function fetchPathwayLessonRowsForDashboard(
  where: Prisma.PathwayLessonWhereInput,
): Promise<PathwayLessonDashboardRow[]> {
  const rows = await prisma.pathwayLesson.findMany({
    where,
    select: PATHWAY_LESSON_SELECT,
    take: PATHWAY_CATALOG_LIST_HARD_CAP,
  });
  return rows as PathwayLessonDashboardRow[];
}

/**
 * Progress rows only for synthetic ids present in the current pathway lesson inventory (not unbounded `pathway:%`).
 */
export async function fetchProgressForPathwayLessonRows(
  userId: string,
  rows: Pick<PathwayLessonDashboardRow, "pathwayId" | "slug">[],
): Promise<{ lessonId: string; completed: boolean }[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => syntheticPathwayLessonId(r.pathwayId, r.slug));
  return prisma.progress.findMany({
    where: { userId, lessonId: { in: ids } },
    select: { lessonId: true, completed: true },
  });
}

/**
 * One user read + pathway inventory + scoped progress — reuse across dashboard + summaries to avoid duplicate heavy queries.
 */
export async function loadPathwayLessonProgressBundle(
  userId: string,
  entitlement: AccessScope,
): Promise<{
  user: {
    learnerPath: string | null;
    tier: TierCode | null;
    alliedProfessionKey: string | null;
  };
  pathwayLessonRows: PathwayLessonDashboardRow[];
  pathwayProgressScoped: { lessonId: string; completed: boolean }[];
} | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true, tier: true, alliedProfessionKey: true },
  });
  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, user?.learnerPath ?? null);
  const pathwayLessonRows = await fetchPathwayLessonRowsForDashboard(pathwayWhere);
  const pathwayProgressScoped = await fetchProgressForPathwayLessonRows(userId, pathwayLessonRows);

  return {
    user: {
      learnerPath: user?.learnerPath ?? null,
      tier: user?.tier ?? null,
      alliedProfessionKey: user?.alliedProfessionKey ?? null,
    },
    pathwayLessonRows,
    pathwayProgressScoped,
  };
}

export async function loadLearnerDashboard(
  userId: string,
  entitlement: AccessScope,
  preload?: LearnerDashboardPreload | null,
): Promise<LearnerDashboardModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) {
    return null;
  }

  const tier = String(entitlement.tier ?? "");
  const country = String(entitlement.country ?? "");

  const user =
    preload?.userProfile ??
    (await prisma.user.findUnique({
      where: { id: userId },
      select: { learnerPath: true, tier: true, alliedProfessionKey: true },
    }));
  const learnerPath = user?.learnerPath ?? null;

  const lessonWhere = lessonAccessWhere(entitlement);

  const pathwayLessonRows =
    preload?.pathwayLessonRows ??
    (await fetchPathwayLessonRowsForDashboard(pathwayLessonsAppListWhere(entitlement, learnerPath)));

  const [contentLessonTotal, lessonsCompleted, incompleteProgress, exam14dSum, recentMocksRaw] =
    await Promise.all([
      prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } }),
      prisma.progress.count({ where: { userId, completed: true } }),
      prisma.progress.findFirst({
        where: { userId, completed: false },
        orderBy: { updatedAt: "desc" },
        select: { lessonId: true },
      }),
      prisma.examAttempt.aggregate({
        where: {
          userId,
          createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        },
        _sum: { total: true },
      }),
      prisma.examAttempt.findMany({
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
      }),
    ]);

  const pathwayLessonTotal = pathwayLessonRows.filter((row) =>
    normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId).structuralQuality?.publicComplete,
  ).length;
  const lessonsAvailable = contentLessonTotal + pathwayLessonTotal;

  const questionsInMocksLast14d = exam14dSum._sum.total ?? 0;

  const recentMocks: RecentMock[] = recentMocksRaw.map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    at: a.createdAt.toISOString(),
  }));

  const skipHeavy = shouldSkipNonCriticalLearnerWork();

  let weakTopics: WeakTopicRow[] = [];
  let strongTopics: WeakTopicRow[] = [];
  let topicTrends: TopicTrendRow[] = [];
  let topicPerformance: TopicPerformanceSnapshot | null = null;
  let recommendedQuizTopic: string | null = null;
  let practiceAgg = { correct: 0, total: 0, sessionCount: 0 };

  if (skipHeavy) {
    safeServerLog("learner_dashboard", "optional_aggregates_skipped", {
      reason: "durability_degraded",
      surface: "topic_performance_and_session_grading",
    });
  } else {
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
  preload?: PathwayStudySummariesPreload | null,
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

  const pathways = listPathwaysCompatibleWithSubscription(entitlement);
  if (pathways.length === 0) return [];

  let lessonRows: PathwayLessonDashboardRow[];
  let allPathwayProgress: { lessonId: string; completed: boolean }[];

  if (preload?.lessonRows && preload.pathwayProgress) {
    lessonRows = preload.lessonRows;
    allPathwayProgress = preload.pathwayProgress;
  } else {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { learnerPath: true },
    });
    const learnerPath = user?.learnerPath ?? null;
    const baseWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);
    lessonRows = await fetchPathwayLessonRowsForDashboard(baseWhere).catch(
      () => [] as PathwayLessonDashboardRow[],
    );
    allPathwayProgress = await fetchProgressForPathwayLessonRows(userId, lessonRows).catch(
      () => [] as { lessonId: string; completed: boolean }[],
    );
  }

  const totalsByPathway = new Map<string, number>();
  for (const row of lessonRows) {
    if (!normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId).structuralQuality?.publicComplete) {
      continue;
    }
    totalsByPathway.set(row.pathwayId, (totalsByPathway.get(row.pathwayId) ?? 0) + 1);
  }

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
