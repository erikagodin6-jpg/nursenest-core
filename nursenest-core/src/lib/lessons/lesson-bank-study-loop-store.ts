/**
 * Persist lesson bank study-loop attempts using PracticeTest rows (no extra tables).
 * Config.mode: lesson_bank_pre | lesson_bank_post
 */

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type LessonBankLoopMode = "lesson_bank_pre" | "lesson_bank_post";

export type LessonBankStudyConfig = {
  mode: LessonBankLoopMode;
  lessonId: string;
  pathwayId: string;
  topic: string;
  questionIds: string[];
};

export type LessonBankStudyResults = {
  score: number;
  total: number;
  accuracyPct: number;
  completedAt: string;
  /** questionId -> selected option index */
  answers: Record<string, number>;
  wrongQuestionIds: string[];
};

export type LessonBankStudyScore = {
  score: number;
  total: number;
  accuracyPct: number;
  completedAt: string;
  practiceTestId: string;
  wrongQuestionIds: string[];
};

export type LessonBankStudyRecord = {
  pre: LessonBankStudyScore | null;
  post: LessonBankStudyScore | null;
};

export async function recordLessonBankStudyLoop(args: {
  userId: string;
  lessonId: string;
  pathwayId: string;
  topic: string;
  type: "pre" | "post";
  questionIds: string[];
  score: number;
  total: number;
  answers: Record<string, number>;
  wrongQuestionIds: string[];
}): Promise<string> {
  const { userId, lessonId, pathwayId, topic, type, questionIds, score, total, answers, wrongQuestionIds } = args;
  if (total < 1) throw new Error("total must be at least 1");
  const clampedScore = Math.min(score, total);
  const accuracyPct = Math.round((clampedScore / total) * 100);
  const completedAt = new Date().toISOString();
  const mode: LessonBankLoopMode = type === "pre" ? "lesson_bank_pre" : "lesson_bank_post";

  const config: LessonBankStudyConfig = {
    mode,
    lessonId,
    pathwayId,
    topic,
    questionIds,
  };

  const results: LessonBankStudyResults = {
    score: clampedScore,
    total,
    accuracyPct,
    completedAt,
    answers,
    wrongQuestionIds,
  };

  const row = await prisma.practiceTest.create({
    data: {
      userId,
      config: config as object,
      questionIds: questionIds as object,
      answers: answers as object,
      status: PracticeTestStatus.COMPLETED,
      results: results as object,
      completedAt: new Date(),
    },
    select: { id: true },
  });

  return row.id;
}

export async function loadLatestLessonBankStudyRecord(
  userId: string,
  lessonId: string,
): Promise<LessonBankStudyRecord> {
  const rows = await prisma.practiceTest.findMany({
    where: {
      userId,
      status: PracticeTestStatus.COMPLETED,
      config: { path: ["lessonId"], equals: lessonId },
    },
    select: { id: true, config: true, results: true, completedAt: true },
    orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
    take: 40,
  });

  let pre: LessonBankStudyScore | null = null;
  let post: LessonBankStudyScore | null = null;

  for (const row of rows) {
    const cfg = row.config as Partial<LessonBankStudyConfig> & { mode?: string };
    const res = row.results as Partial<LessonBankStudyResults> | null;
    if (!cfg?.mode || !res) continue;
    if (cfg.mode !== "lesson_bank_pre" && cfg.mode !== "lesson_bank_post") continue;

    const score: LessonBankStudyScore = {
      score: res.score ?? 0,
      total: res.total ?? 0,
      accuracyPct: res.accuracyPct ?? 0,
      completedAt: res.completedAt ?? row.completedAt?.toISOString() ?? new Date().toISOString(),
      practiceTestId: row.id,
      wrongQuestionIds: Array.isArray(res.wrongQuestionIds) ? res.wrongQuestionIds.map(String) : [],
    };

    if (cfg.mode === "lesson_bank_pre" && !pre) {
      pre = score;
    } else if (cfg.mode === "lesson_bank_post" && !post) {
      post = score;
    }

    if (pre && post) break;
  }

  return { pre, post };
}
