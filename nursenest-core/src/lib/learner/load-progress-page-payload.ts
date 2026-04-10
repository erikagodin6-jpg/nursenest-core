import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import { loadPathwayStudySummaries } from "@/lib/learner/load-learner-dashboard";
import type { RecentMock } from "@/lib/learner/load-learner-dashboard";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { loadSessionGradingAggregate } from "@/lib/learner/session-grading-aggregate";
import { loadPathwayTopicCoverageBatch } from "@/lib/lessons/pathway-topic-coverage";

const PRACTICE_RECENT_LIMIT = 6;
const MOCK_RECENT_LIMIT = 5;

export type LessonsPoolProgress = {
  /** Content + pathway lessons available in plan scope (same basis as dashboard). */
  available: number;
  completed: number;
  inProgress: number;
  notStarted: number;
};

export type QuestionBankProgress = {
  /** Sum of graded attempts in topic ledger (question bank + graded flows that write stats). */
  ledgerAttempted: number;
  ledgerAccuracyPct: number | null;
  /** Distinct topics this user has attempted at least one question in. */
  topicsPracticed: number;
  /** Recent completed exam sessions, tier-scoped graded items. */
  recentGraded: {
    correct: number;
    total: number;
    sessionCount: number;
    accuracyPct: number | null;
  };
};

export type PracticeExamProgress = {
  completedPracticeTests: number;
  recentPracticeTests: Array<{
    id: string;
    title: string | null;
    completedAt: Date;
    accuracyPct: number | null;
    isCat: boolean;
  }>;
  recentMocks: RecentMock[];
};

export type PathwayProgressTrackKey = "rn" | "rpn_lpn" | "np" | "allied" | "other";

export type PathwayProgressCardModel = {
  pathwayId: string;
  shortLabel: string;
  trackKey: PathwayProgressTrackKey;
  lessonsTotal: number;
  lessonsCompleted: number;
  lessonsInProgress: number;
  notStarted: number;
  /** Lesson-completion % (0–100). */
  pct: number;
  /** Distinct topics with at least one completed lesson (0 if not yet computed). */
  topicsCovered: number;
  /** Total distinct published topics in this pathway (0 = unknown / catalog-only). */
  topicsTotal: number;
  /** topicsCovered / topicsTotal expressed as 0–100 integer. */
  topicCoveragePct: number;
};

export type ProgressPagePayload = {
  lessonsPool: LessonsPoolProgress;
  pathways: PathwayProgressCardModel[];
  questionBank: QuestionBankProgress;
  exams: PracticeExamProgress;
  continueLesson: { title: string; href: string } | null;
};

const TRACK_ORDER: RoleTrackSlug[] = ["rn", "rpn", "lpn", "np", "allied"];

function pathwayTrackKey(roleTrack: RoleTrackSlug | undefined): PathwayProgressTrackKey {
  switch (roleTrack) {
    case "rn":
      return "rn";
    case "rpn":
    case "lpn":
      return "rpn_lpn";
    case "np":
      return "np";
    case "allied":
      return "allied";
    default:
      return "other";
  }
}

function sortPathways(a: PathwayProgressCardModel, b: PathwayProgressCardModel): number {
  const defA = getExamPathwayById(a.pathwayId);
  const defB = getExamPathwayById(b.pathwayId);
  const ia = defA ? TRACK_ORDER.indexOf(defA.roleTrack) : 99;
  const ib = defB ? TRACK_ORDER.indexOf(defB.roleTrack) : 99;
  if (ia !== ib) return ia - ib;
  return a.shortLabel.localeCompare(b.shortLabel);
}

/**
 * Focused aggregates for the Progress page — avoids full learner dashboard (readiness, topic perf, etc.).
 */
export async function loadProgressPagePayload(userId: string, entitlement: AccessScope): Promise<ProgressPagePayload | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });
  const learnerPath = user?.learnerPath ?? null;
  const lessonWhere = lessonAccessWhere(entitlement);
  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  const [
    pathwayRows,
    contentLessonTotal,
    pathwayLessonTotal,
    lessonsCompleted,
    lessonsInProgressCount,
    topicSums,
    questionTopicsPracticed,
    recentGraded,
    mocksRaw,
    practiceCompletedCount,
    practiceRecent,
    incompleteProgress,
  ] = await Promise.all([
    loadPathwayStudySummaries(userId, entitlement),
    prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } }),
    prisma.pathwayLesson.count({ where: pathwayWhere }),
    prisma.progress.count({ where: { userId, completed: true } }),
    prisma.progress.count({ where: { userId, completed: false } }),
    prisma.userTopicStat
      .aggregate({
        where: { userId },
        _sum: { correctCount: true, wrongCount: true },
      })
      .catch(() => ({ _sum: { correctCount: null as number | null, wrongCount: null as number | null } })),
    prisma.userTopicStat.count({ where: { userId } }).catch(() => 0),
    loadSessionGradingAggregate(userId, entitlement, 8),
    prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: MOCK_RECENT_LIMIT,
      select: {
        id: true,
        score: true,
        total: true,
        createdAt: true,
        exam: { select: { title: true } },
      },
    }),
    prisma.practiceTest.count({ where: { userId, status: PracticeTestStatus.COMPLETED } }).catch(() => 0),
    prisma.practiceTest
      .findMany({
        where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: PRACTICE_RECENT_LIMIT,
        select: { id: true, title: true, completedAt: true, config: true, results: true },
      })
      .catch(() => []),
    prisma.progress.findFirst({
      where: { userId, completed: false },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true },
    }),
  ]);

  const lessonsAvailable = contentLessonTotal + pathwayLessonTotal;
  const notStartedPool = Math.max(0, lessonsAvailable - lessonsCompleted - lessonsInProgressCount);

  const correctSum = topicSums._sum.correctCount ?? 0;
  const wrongSum = topicSums._sum.wrongCount ?? 0;
  const ledgerAttempted = correctSum + wrongSum;
  const ledgerAccuracyPct =
    ledgerAttempted > 0 ? Math.round((correctSum / ledgerAttempted) * 100) : null;

  const recentMocks: RecentMock[] = mocksRaw.map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    at: a.createdAt.toISOString(),
  }));

  const recentPracticeTests = practiceRecent.map((row) => {
    const cfg = row.config as PracticeTestConfigJson | null;
    const res = row.results as PracticeTestResultsJson | null;
    const isCat = cfg?.selectionMode === "cat";
    const accuracyPct =
      res && typeof res.accuracyPct === "number" && Number.isFinite(res.accuracyPct)
        ? Math.round(res.accuracyPct)
        : res && res.scoreTotal > 0
          ? Math.round((res.scoreCorrect / res.scoreTotal) * 100)
          : null;
    return {
      id: row.id,
      title: row.title,
      completedAt: row.completedAt!,
      accuracyPct,
      isCat,
    };
  });

  let continueLesson: ProgressPagePayload["continueLesson"] = null;
  if (incompleteProgress?.lessonId) {
    try {
      const ref = await resolveLessonRefFromProgressId({
        lessonId: incompleteProgress.lessonId,
        entitlement,
        learnerPath,
      });
      if (ref) continueLesson = { title: ref.title, href: ref.href };
    } catch {
      continueLesson = null;
    }
  }

  const pathwayIdList = pathwayRows.map((p) => p.pathwayId);
  const topicCoverageMap = await loadPathwayTopicCoverageBatch(userId, pathwayIdList);

  const pathways: PathwayProgressCardModel[] = pathwayRows.map((p) => {
    const def = getExamPathwayById(p.pathwayId);
    const notStarted = Math.max(0, p.lessonsTotal - p.lessonsCompleted - p.lessonsInProgress);
    const pct = p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0;
    const coverage = topicCoverageMap.get(p.pathwayId);
    return {
      pathwayId: p.pathwayId,
      shortLabel: p.shortLabel,
      trackKey: pathwayTrackKey(def?.roleTrack),
      lessonsTotal: p.lessonsTotal,
      lessonsCompleted: p.lessonsCompleted,
      lessonsInProgress: p.lessonsInProgress,
      notStarted,
      pct,
      topicsCovered: coverage?.topicsCovered ?? 0,
      topicsTotal: coverage?.topicsTotal ?? 0,
      topicCoveragePct: coverage?.coveragePct ?? 0,
    };
  });
  pathways.sort(sortPathways);

  return {
    lessonsPool: {
      available: lessonsAvailable,
      completed: lessonsCompleted,
      inProgress: lessonsInProgressCount,
      notStarted: notStartedPool,
    },
    pathways,
    questionBank: {
      ledgerAttempted,
      ledgerAccuracyPct,
      topicsPracticed: questionTopicsPracticed,
      recentGraded: {
        correct: recentGraded.correct,
        total: recentGraded.total,
        sessionCount: recentGraded.sessionCount,
        accuracyPct: recentGraded.total > 0 ? Math.round((recentGraded.correct / recentGraded.total) * 100) : null,
      },
    },
    exams: {
      completedPracticeTests: practiceCompletedCount,
      recentPracticeTests,
      recentMocks,
    },
    continueLesson,
  };
}
