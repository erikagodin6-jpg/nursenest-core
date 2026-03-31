import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { computeReadiness, type ReadinessResult } from "@/lib/learner/readiness-score";
import { loadSessionGradingAggregate } from "@/lib/learner/session-grading-aggregate";
import { loadWeakTopicsFromExamSessions, type WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

export type ContinueLesson = {
  title: string;
  href: string;
  kind: "content" | "pathway";
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
  lessonsCompleted: number;
  lessonsAvailable: number;
  questionsInMocksLast14d: number;
  recentMocks: RecentMock[];
  weakTopics: WeakTopicRow[];
  continueLesson: ContinueLesson | null;
  recommendedQuizTopic: string | null;
  readiness: ReadinessResult;
};

function parsePathwaySyntheticId(lessonId: string): { pathwayId: string; slug: string } | null {
  if (!lessonId.startsWith("pathway:")) return null;
  const rest = lessonId.slice("pathway:".length);
  const idx = rest.indexOf(":");
  if (idx <= 0) return null;
  const pathwayId = rest.slice(0, idx);
  const slug = rest.slice(idx + 1);
  if (!pathwayId || !slug) return null;
  return { pathwayId, slug };
}

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
    select: { learnerPath: true },
  });
  const learnerPath = user?.learnerPath ?? null;

  const lessonWhere = lessonAccessWhere(entitlement);
  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  const [contentLessonTotal, pathwayLessonTotal, lessonsCompleted, incompleteProgress] = await Promise.all([
    prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } }),
    prisma.pathwayLesson.count({ where: pathwayWhere }),
    prisma.progress.count({ where: { userId, completed: true } }),
    prisma.progress.findFirst({
      where: { userId, completed: false },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true },
    }),
  ]);

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
  let practiceAgg = { correct: 0, total: 0, sessionCount: 0 };
  try {
    weakTopics = await loadWeakTopicsFromExamSessions(userId, entitlement, 6);
  } catch {
    weakTopics = [];
  }
  try {
    practiceAgg = await loadSessionGradingAggregate(userId, entitlement, 8);
  } catch {
    practiceAgg = { correct: 0, total: 0, sessionCount: 0 };
  }

  let continueLesson: ContinueLesson | null = null;
  if (incompleteProgress?.lessonId) {
    const lid = incompleteProgress.lessonId;
    try {
      const parsed = parsePathwaySyntheticId(lid);
      if (parsed) {
        const pathwayFilter = pathwayLessonsAppListWhere(entitlement, learnerPath);
        const row = await prisma.pathwayLesson.findFirst({
          where: {
            AND: [
              pathwayFilter,
              {
                pathwayId: parsed.pathwayId,
                slug: parsed.slug,
                locale: "en",
                status: ContentStatus.PUBLISHED,
              },
            ],
          },
          select: { id: true, title: true },
        });
        if (row) {
          continueLesson = {
            title: row.title,
            href: `/app/lessons/${row.id}`,
            kind: "pathway",
          };
        }
      } else {
        const row = await prisma.contentItem.findFirst({
          where: { AND: [{ id: lid, type: "lesson" }, lessonWhere] },
          select: { id: true, title: true },
        });
        if (row) {
          continueLesson = { title: row.title, href: `/app/lessons/${row.id}`, kind: "content" };
        } else {
          const pwById = await prisma.pathwayLesson.findFirst({
            where: { AND: [pathwayWhere, { id: lid }] },
            select: { id: true, title: true },
          });
          if (pwById) {
            continueLesson = {
              title: pwById.title,
              href: `/app/lessons/${pwById.id}`,
              kind: "pathway",
            };
          }
        }
      }
    } catch {
      continueLesson = null;
    }
  }

  const recommendedQuizTopic = weakTopics[0]?.topic ?? null;

  const readiness = computeReadiness({
    practiceCorrect: practiceAgg.correct,
    practiceTotal: practiceAgg.total,
    recentMocks: recentMocks.map((m) => ({ score: m.score, total: m.total })),
    weakTopics,
    lessonsCompleted,
    lessonsAvailable,
  });

  return {
    scope: { tier, country },
    lessonsCompleted,
    lessonsAvailable,
    questionsInMocksLast14d,
    recentMocks,
    weakTopics,
    continueLesson,
    recommendedQuizTopic,
    readiness,
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
  }[]
> {
  if (!entitlement.hasAccess || !isDatabaseUrlConfigured()) return [];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });
  const learnerPath = user?.learnerPath ?? null;

  const pathways = listPathwaysCompatibleWithSubscription(entitlement);
  const baseWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  const out: {
    pathwayId: string;
    label: string;
    shortLabel: string;
    lessonsTotal: number;
    lessonsCompleted: number;
  }[] = [];

  for (const p of pathways) {
    const lessonsTotal = await prisma.pathwayLesson.count({
      where: {
        AND: [baseWhere, { pathwayId: p.id }],
      },
    });
    const prefix = `pathway:${p.id}:`;
    const lessonsCompleted = await prisma.progress.count({
      where: { userId, completed: true, lessonId: { startsWith: prefix } },
    });
    out.push({
      pathwayId: p.id,
      label: p.displayName,
      shortLabel: p.shortName || p.displayName,
      lessonsTotal,
      lessonsCompleted,
    });
  }

  return out;
}
