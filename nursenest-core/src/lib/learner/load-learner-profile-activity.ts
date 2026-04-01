import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
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
};

export async function loadLearnerProfileActivity(userId: string): Promise<LearnerProfileActivity> {
  const empty: LearnerProfileActivity = { mocks: [], practiceTests: [], lessons: [] };
  if (!userId || !isDatabaseUrlConfigured()) return empty;

  try {
    const [attempts, tests, progressRows] = await Promise.all([
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
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
        orderBy: { updatedAt: "desc" },
        take: 5,
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
        take: 8,
        select: { lessonId: true, completed: true, updatedAt: true },
      }),
    ]);

    const mocks: ProfileActivityMock[] = attempts.map((a) => {
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

    const practiceTests: ProfileActivityPracticeTest[] = tests.map((t) => {
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

    const lessonActivity: ProfileActivityLesson[] = (
      await Promise.all(
        progressRows.map(async (p) => {
          const resolved = await resolveLessonRefFromProgressId({ lessonId: p.lessonId });
          return {
            kind: "lesson" as const,
            lessonId: p.lessonId,
            title: resolved?.title ?? "Lesson",
            completed: p.completed,
            updatedAt: p.updatedAt.toISOString(),
            href: resolved?.href ?? `/app/lessons/${encodeURIComponent(p.lessonId)}`,
          };
        }),
      )
    ).slice(0, 6);

    return { mocks, practiceTests, lessons: lessonActivity };
  } catch {
    return empty;
  }
}
