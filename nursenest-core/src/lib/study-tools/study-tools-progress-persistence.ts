"use client";

import { recordQuestionPerformanceEvent } from "@/lib/learner/question-performance-events";

export type StudyToolProgressRow = {
  itemKey: string;
  pathwayId: string;
  mode: string;
  correct: number;
  incorrect: number;
  streakCorrect: number;
  lastAt: string;
  weak: boolean;
  mastered: boolean;
  canonicalCategory?: string;
};

type StoreFile = { rows: Record<string, StudyToolProgressRow> };

function storageKey(userId: string) {
  return `nn_study_tools_progress_v1:${userId}`;
}

function readStore(userId: string): StoreFile {
  if (typeof window === "undefined") return { rows: {} };
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return { rows: {} };
    const parsed = JSON.parse(raw) as StoreFile;
    return parsed?.rows && typeof parsed.rows === "object" ? parsed : { rows: {} };
  } catch {
    return { rows: {} };
  }
}

function writeStore(userId: string, file: StoreFile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(file));
  } catch {
    /* ignore */
  }
}

/**
 * Records a study-tool attempt, updates weak/mastered heuristics, and mirrors question-backed tools
 * into {@link recordQuestionPerformanceEvent} so downstream analytics stay aligned with practice.
 */
export function recordStudyToolAttempt(args: {
  userId: string;
  itemKey: string;
  pathwayId: string;
  mode: string;
  correct: boolean;
  canonicalCategory?: string;
  sourceQuestionId?: string | null;
}): StudyToolProgressRow {
  const file = readStore(args.userId);
  const prev = file.rows[args.itemKey] ?? {
    itemKey: args.itemKey,
    pathwayId: args.pathwayId,
    mode: args.mode,
    correct: 0,
    incorrect: 0,
    streakCorrect: 0,
    lastAt: new Date().toISOString(),
    weak: false,
    mastered: false,
    canonicalCategory: args.canonicalCategory,
  };

  const correct = prev.correct + (args.correct ? 1 : 0);
  const incorrect = prev.incorrect + (args.correct ? 0 : 1);
  const streakCorrect = args.correct ? prev.streakCorrect + 1 : 0;
  const weak = incorrect >= 2 && correct / Math.max(1, correct + incorrect) < 0.65;
  const mastered = streakCorrect >= 3 && correct >= 4 && incorrect <= 1;
  const next: StudyToolProgressRow = {
    ...prev,
    pathwayId: args.pathwayId,
    mode: args.mode,
    correct,
    incorrect,
    streakCorrect,
    lastAt: new Date().toISOString(),
    weak,
    mastered,
    canonicalCategory: args.canonicalCategory ?? prev.canonicalCategory,
  };
  file.rows[args.itemKey] = next;
  writeStore(args.userId, file);

  if (args.sourceQuestionId?.trim()) {
    recordQuestionPerformanceEvent(args.userId, {
      questionId: args.sourceQuestionId.trim(),
      topic: args.canonicalCategory ?? null,
      subtopic: null,
      pathwayId: args.pathwayId,
      exam: null,
      correct: args.correct,
      practiceSessionMode: `study_tool:${args.mode}`,
    });
  }

  return next;
}

export function summarizeStudyToolsProgress(userId: string): {
  totalAttempts: number;
  mastered: number;
  weak: number;
} {
  const rows = Object.values(readStore(userId).rows);
  let totalAttempts = 0;
  let mastered = 0;
  let weak = 0;
  for (const r of rows) {
    totalAttempts += r.correct + r.incorrect;
    if (r.mastered) mastered += 1;
    if (r.weak) weak += 1;
  }
  return { totalAttempts, mastered, weak };
}
