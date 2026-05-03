import "server-only";

import type { PrismaClient } from "@prisma/client";
import { PracticeQuestionAnswerMode } from "@prisma/client";

/** Server flag — default off. No peer stats recorded or returned when unset/false. */
export function isQuestionPeerAnalyticsEnabled(): boolean {
  const v = process.env.QUESTION_PEER_ANALYTICS_ENABLED?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

const MIN_SAMPLE = 10;

const INSUFFICIENT_MSG =
  "Not enough attempts yet to show reliable class performance.";

export type QuestionPeerStatsPayload = {
  totalAttempts: number;
  correctPercentage: number | null;
  optionPercentages: Record<string, number> | null;
  selectedOptionKeys: string[];
  correctOptionKeys: string[];
  insufficientSample: boolean;
  insufficientSampleMessage: string | null;
};

export function parseGradeAttemptMode(raw: unknown): PracticeQuestionAnswerMode {
  if (raw === "cat" || raw === "quiz" || raw === "remediation" || raw === "practice") {
    return raw;
  }
  return PracticeQuestionAnswerMode.practice;
}

function selectedKeysFromAnswer(questionType: string, answer: unknown): string[] {
  const t = questionType.toUpperCase();
  if (t === "SATA" || t === "SELECT_ALL_THAT_APPLY") {
    if (!Array.isArray(answer)) return [];
    return answer.map((x) => String(x)).filter(Boolean);
  }
  if (answer == null) return [];
  const s = String(answer).trim();
  return s ? [s] : [];
}

/** Stable, non-PII blob for attempt row (SATA: joined unit-separator). */
export function persistSelectedOptionKey(keys: string[]): string {
  const sorted = [...keys].map((k) => k.trim()).filter(Boolean).sort();
  const s = sorted.join("\u001f");
  return s.length > 12_000 ? s.slice(0, 12_000) : s || "(none)";
}

function roundPct(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Persists one attempt + bumps aggregates, then returns aggregate-only peer stats for the grading response.
 * CAT mode skips recording and returns null (no mid-adaptive leakage via this path).
 */
export async function recordQuestionPeerAnalyticsAndBuildPayload(
  prisma: PrismaClient,
  params: {
    userId: string;
    questionId: string;
    questionType: string;
    pathwayId: string | null;
    answer: unknown;
    isCorrect: boolean;
    correctKeys: string[];
    attemptMode: PracticeQuestionAnswerMode;
  },
): Promise<QuestionPeerStatsPayload | null> {
  if (!isQuestionPeerAnalyticsEnabled()) return null;
  if (params.attemptMode === PracticeQuestionAnswerMode.cat) return null;

  const selectedKeys = selectedKeysFromAnswer(params.questionType, params.answer);
  const selectedPersist = persistSelectedOptionKey(selectedKeys);
  const bumpKeys = selectedKeys.length > 0 ? [...new Set(selectedKeys)] : ["(none)"];

  const payload = await prisma.$transaction(async (tx) => {
    await tx.examQuestionPracticeAnswerAttempt.create({
      data: {
        userId: params.userId,
        questionId: params.questionId,
        selectedOptionKey: selectedPersist,
        isCorrect: params.isCorrect,
        mode: params.attemptMode,
        pathwayId: params.pathwayId,
      },
    });

    for (const key of bumpKeys) {
      await tx.examQuestionAnswerOptionAggregate.upsert({
        where: {
          questionId_optionKey: { questionId: params.questionId, optionKey: key },
        },
        create: {
          questionId: params.questionId,
          optionKey: key,
          selectionCount: 1,
        },
        update: { selectionCount: { increment: 1 } },
      });
    }

    await tx.examQuestionPerformanceAggregate.upsert({
      where: { questionId: params.questionId },
      create: {
        questionId: params.questionId,
        totalAttempts: 1,
        correctAttempts: params.isCorrect ? 1 : 0,
      },
      update: {
        totalAttempts: { increment: 1 },
        ...(params.isCorrect ? { correctAttempts: { increment: 1 } } : {}),
      },
    });

    const perf = await tx.examQuestionPerformanceAggregate.findUnique({
      where: { questionId: params.questionId },
    });
    const optionRows = await tx.examQuestionAnswerOptionAggregate.findMany({
      where: { questionId: params.questionId },
    });

    const total = perf?.totalAttempts ?? 0;
    const insufficient = total < MIN_SAMPLE;
    const correctPct =
      !insufficient && total > 0 && perf
        ? roundPct((100 * perf.correctAttempts) / total)
        : null;

    const optionPercentages: Record<string, number> = {};
    for (const row of optionRows) {
      optionPercentages[row.optionKey] =
        total > 0 ? roundPct((100 * row.selectionCount) / total) : 0;
    }

    const out: QuestionPeerStatsPayload = {
      totalAttempts: total,
      correctPercentage: insufficient ? null : correctPct,
      optionPercentages: insufficient ? null : optionPercentages,
      selectedOptionKeys: selectedKeys,
      correctOptionKeys: [...params.correctKeys],
      insufficientSample: insufficient,
      insufficientSampleMessage: insufficient ? INSUFFICIENT_MSG : null,
    };
    return out;
  });

  return payload;
}
