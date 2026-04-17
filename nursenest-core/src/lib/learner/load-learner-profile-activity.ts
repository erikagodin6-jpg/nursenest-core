import { loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import type { LearnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { learnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";

export type ProfileActivityMock = {
  kind: "mock";
  id: string;
  title: string;
  score: number;
  total: number;
  pct: number;
  at: string;
  href: string;
};

export type ProfileActivityPracticeTest = {
  kind: "practice_test";
  id: string;
  title: string | null;
  status: string;
  accuracyPct: number | null;
  at: string;
  href: string;
};

export type ProfileActivityLesson = {
  kind: "lesson";
  lessonId: string;
  title: string;
  completed: boolean;
  updatedAt: string;
  href: string;
};

export type LearnerProfileActivity = {
  mocks: ProfileActivityMock[];
  practiceTests: ProfileActivityPracticeTest[];
  lessons: ProfileActivityLesson[];
  degraded?: LearnerAggregateDegradedState;
};

export type LearnerProfileActivityLimits = {
  mocks?: number;
  practiceTests?: number;
  lessons?: number;
};

async function loadLearnerProfileActivityUncached(
  userId: string,
  limits?: LearnerProfileActivityLimits,
): Promise<LearnerProfileActivity> {
  const empty: LearnerProfileActivity = { mocks: [], practiceTests: [], lessons: [] };
  if (!userId || !isDatabaseUrlConfigured()) return empty;
  if (shouldSkipNonCriticalLearnerWork()) {
    return {
      ...empty,
      degraded: learnerAggregateDegradedState("durability_degraded", [
        "mocks",
        "practice_tests",
        "lessons",
      ]),
    };
  }

  const mockTake = limits?.mocks ?? 5;
  const testTake = limits?.practiceTests ?? 5;
  const lessonTake = limits?.lessons ?? 8;

  try {
    const [attemptsResult, testsResult, progressResult] = await Promise.allSettled([
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 60,
        select: {
          id: true,
          score: true,
          total: true,
          createdAt: true,
          exam: { select: { id: true, title: true } },
        },
      }),
      prisma.practiceTest.findMany({
        where: { userId },
        orderBy: [{ updatedAt: "desc" }],
        take: 12,
        select: {
          id: true,
          title: true,
          status: true,
          results: true,
          updatedAt: true,
        },
      }),
      prisma.progress.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: lessonTake,
        select: { lessonId: true, completed: true, updatedAt: true },
      }),
    ]);
    const degradedPanels: string[] = [];
    const attempts = attemptsResult.status === "fulfilled" ? attemptsResult.value : (degradedPanels.push("mocks"), []);
    const tests = testsResult.status === "fulfilled" ? testsResult.value : (degradedPanels.push("practice_tests"), []);
    const progressRows = progressResult.status === "fulfilled" ? progressResult.value : (degradedPanels.push("lessons"), []);

    const mocks: ProfileActivityMock[] = attempts.slice(0, mockTake).map((a) => {
      const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
      return {
        kind: "mock" as const,
        id: a.id,
        title: a.exam?.title ?? "Practice exam",
        score: a.score,
        total: a.total,
        pct,
        at: a.createdAt.toISOString(),
        href: "/app/exams",
      };
    });

    const practiceTests: ProfileActivityPracticeTest[] = tests.slice(0, testTake).map((t) => {
      const res = t.results as { accuracyPct?: number } | null;
      return {
        kind: "practice_test" as const,
        id: t.id,
        title: t.title,
        status: t.status,
        accuracyPct: res?.accuracyPct ?? null,
        at: t.updatedAt.toISOString(),
        href: `/app/practice-tests/${t.id}`,
      };
    });

    const lessonActivity: ProfileActivityLesson[] = [];
    for (const p of progressRows.slice(0, Math.min(lessonTake, 50))) {
      try {
        const resolved = await resolveLessonRefFromProgressId({ lessonId: p.lessonId });
        lessonActivity.push({
          kind: "lesson",
          lessonId: p.lessonId,
          title: resolved?.title ?? "Lesson",
          completed: p.completed,
          updatedAt: p.updatedAt.toISOString(),
          href: resolved?.href ?? `/app/lessons/${encodeURIComponent(p.lessonId)}`,
        });
      } catch {
        degradedPanels.push("lessons");
        lessonActivity.push({
          kind: "lesson",
          lessonId: p.lessonId,
          title: "Lesson",
          completed: p.completed,
          updatedAt: p.updatedAt.toISOString(),
          href: `/app/lessons/${encodeURIComponent(p.lessonId)}`,
        });
      }
    }

    return {
      mocks,
      practiceTests,
      lessons: lessonActivity,
      degraded: degradedPanels.length > 0
        ? learnerAggregateDegradedState("temporarily_unavailable", degradedPanels)
        : undefined,
    };
  } catch {
    return {
      ...empty,
      degraded: learnerAggregateDegradedState("temporarily_unavailable", [
        "mocks",
        "practice_tests",
        "lessons",
      ]),
    };
  }
}

export async function loadLearnerProfileActivity(
  userId: string,
  limits?: LearnerProfileActivityLimits,
): Promise<LearnerProfileActivity> {
  return loadWithLearnerPrivateReadCache(
    {
      surface: "profile-activity",
      userId,
      ttlSeconds: 60,
      keyParts: [
        {
          mocks: limits?.mocks ?? 5,
          practiceTests: limits?.practiceTests ?? 5,
          lessons: limits?.lessons ?? 8,
        },
      ],
    },
    () => loadLearnerProfileActivityUncached(userId, limits),
  );
}
