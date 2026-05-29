import "server-only";

/**
 * Question psychometric computation.
 *
 * Reads ExamQuestionPerformanceAggregate + ExamQuestionAnswerOptionAggregate,
 * computes p-value and distractor performance, flags outliers, and writes
 * qualityScore back to ExamQuestion.
 *
 * Called by the nightly cron at POST /api/cron/compute-question-quality.
 */

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const MIN_ATTEMPTS_FOR_PVALUE = 50;
const MIN_ATTEMPTS_FOR_DISTRACTORS = 50;

export type QuestionPsychometricFlags = {
  too_easy: boolean;          // p-value > 0.90
  too_difficult: boolean;     // p-value < 0.20
  non_functional_distractor: boolean;  // any distractor < 5% selection
  misleading_distractor: boolean;      // any wrong option > 60% selection
  answer_key_error: boolean;  // correct option 0% AND totalAttempts ≥ 20
  low_educational_value: boolean;      // p-value > 0.92 OR few attempts
};

export type QuestionPsychometrics = {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  pValue: number;                       // correctAttempts / totalAttempts
  distractorRates: Record<string, number>; // optionKey → selection rate (0–1)
  flags: QuestionPsychometricFlags;
  qualityScore: number;                 // 0–100 composite
  highestSeverity: "none" | "low" | "medium" | "high" | "critical";
};

function computeFlags(
  pValue: number,
  totalAttempts: number,
  distractorRates: Record<string, number>,
  correctOptionKey: string | null,
): QuestionPsychometricFlags {
  const distractorValues = Object.entries(distractorRates)
    .filter(([k]) => k !== correctOptionKey)
    .map(([, v]) => v);

  const correctRate = correctOptionKey ? (distractorRates[correctOptionKey] ?? 0) : pValue;

  return {
    too_easy: pValue > 0.90,
    too_difficult: pValue < 0.20,
    non_functional_distractor: distractorValues.some((r) => r < 0.05),
    misleading_distractor: distractorValues.some((r) => r > 0.60),
    answer_key_error: totalAttempts >= 20 && correctRate === 0,
    low_educational_value: pValue > 0.92,
  };
}

function computeHighestSeverity(flags: QuestionPsychometricFlags): QuestionPsychometrics["highestSeverity"] {
  if (flags.answer_key_error || flags.misleading_distractor) return "critical";
  if (flags.too_difficult) return "high";
  if (flags.too_easy || flags.non_functional_distractor || flags.low_educational_value) return "medium";
  return "none";
}

function computeQualityScore(pValue: number, flags: QuestionPsychometricFlags): number {
  // Start at 100, deduct for issues
  let score = 100;
  if (flags.answer_key_error) score -= 50;
  if (flags.misleading_distractor) score -= 30;
  if (flags.too_difficult) score -= 20;
  if (flags.too_easy) score -= 10;
  if (flags.non_functional_distractor) score -= 10;
  if (flags.low_educational_value) score -= 5;
  // p-value in 0.4–0.8 range gets a bonus
  if (pValue >= 0.40 && pValue <= 0.80) score = Math.min(100, score + 5);
  return Math.max(0, score);
}

export type PsychometricBatchResult = {
  computed: number;
  flagged: number;
  criticalFlags: number;
  autoDisabled: number;
  errors: number;
};

/**
 * Compute psychometrics for all questions with ≥ MIN_ATTEMPTS_FOR_PVALUE total attempts.
 * Updates ExamQuestion.qualityScore and disables critically flagged questions from CAT/mock pools.
 */
export async function computeQuestionPsychometricsBatch(opts: {
  limit?: number;
}): Promise<PsychometricBatchResult> {
  if (!isDatabaseUrlConfigured()) {
    return { computed: 0, flagged: 0, criticalFlags: 0, autoDisabled: 0, errors: 0 };
  }

  const limit = opts.limit ?? 1000;
  const result: PsychometricBatchResult = {
    computed: 0, flagged: 0, criticalFlags: 0, autoDisabled: 0, errors: 0,
  };

  // Load performance aggregates for questions with sufficient data
  const perfRows = await prisma.examQuestionPerformanceAggregate.findMany({
    where: { totalAttempts: { gte: MIN_ATTEMPTS_FOR_PVALUE } },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });

  if (perfRows.length === 0) return result;

  const questionIds = perfRows.map((r) => r.questionId);

  // Load option aggregates for these questions
  const optionRows = await prisma.examQuestionAnswerOptionAggregate.findMany({
    where: { questionId: { in: questionIds } },
  });
  const optionsByQuestion = new Map<string, { optionKey: string; selectionCount: number }[]>();
  for (const row of optionRows) {
    const existing = optionsByQuestion.get(row.questionId) ?? [];
    existing.push({ optionKey: row.optionKey, selectionCount: row.selectionCount });
    optionsByQuestion.set(row.questionId, existing);
  }

  // Load correct answer keys for each question
  const questionDetails = await prisma.examQuestion.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, correctAnswer: true },
  });
  const correctKeyByQuestion = new Map<string, string | null>();
  for (const q of questionDetails) {
    const raw = q.correctAnswer;
    if (typeof raw === "string") correctKeyByQuestion.set(q.id, raw);
    else if (Array.isArray(raw) && raw.length > 0) correctKeyByQuestion.set(q.id, String(raw[0]));
    else correctKeyByQuestion.set(q.id, null);
  }

  // Compute psychometrics for each question
  for (const perf of perfRows) {
    try {
      const total = perf.totalAttempts;
      const correct = perf.correctAttempts;
      const pValue = total > 0 ? correct / total : 0;

      const options = optionsByQuestion.get(perf.questionId) ?? [];
      const distractorRates: Record<string, number> = {};
      if (total >= MIN_ATTEMPTS_FOR_DISTRACTORS) {
        for (const opt of options) {
          distractorRates[opt.optionKey] = total > 0 ? opt.selectionCount / total : 0;
        }
      }

      const correctKey = correctKeyByQuestion.get(perf.questionId) ?? null;
      const flags = computeFlags(pValue, total, distractorRates, correctKey);
      const severity = computeHighestSeverity(flags);
      const qualityScore = computeQualityScore(pValue, flags);

      const activeFlags = (Object.keys(flags) as Array<keyof typeof flags>)
        .filter((k) => flags[k]);

      result.computed++;

      if (severity !== "none") {
        result.flagged++;
        if (severity === "critical") result.criticalFlags++;
      }

      // Auto-disable critical questions from CAT and mock exam pools
      if (severity === "critical" && (flags.answer_key_error || flags.misleading_distractor)) {
        await prisma.examQuestion.update({
          where: { id: perf.questionId },
          data: {
            isAdaptiveEligible: false,
            isMockExamEligible: false,
            qualityScore,
            qualityFeedback: { activeFlags, severity, pValue, distractorRates },
          },
        });
        result.autoDisabled++;
        safeServerLog("quality", "question_auto_disabled", {
          questionId: perf.questionId.slice(0, 16),
          severity,
          flags: activeFlags.join(","),
          pValue: pValue.toFixed(3),
        });
      } else {
        // Update quality score only (don't change eligibility for non-critical)
        await prisma.examQuestion.update({
          where: { id: perf.questionId },
          data: {
            qualityScore,
            qualityFeedback: { activeFlags, severity, pValue, distractorRates },
          },
        });
      }
    } catch (e) {
      result.errors++;
      safeServerLog("quality", "psychometric_compute_error", {
        questionId: perf.questionId.slice(0, 16),
        error: e instanceof Error ? e.message.slice(0, 200) : String(e),
      });
    }
  }

  return result;
}

/**
 * Load flagged questions for the admin review queue.
 */
export async function loadFlaggedQuestionsForReview(opts: {
  severity?: "low" | "medium" | "high" | "critical";
  limit?: number;
}): Promise<Array<{
  id: string;
  stem: string;
  topic: string | null;
  exam: string;
  qualityScore: number | null;
  qualityFeedback: unknown;
  isAdaptiveEligible: boolean;
  isMockExamEligible: boolean;
  totalAttempts: number | null;
  pValue: number | null;
}>> {
  if (!isDatabaseUrlConfigured()) return [];

  const feedbackFilter = opts.severity
    ? { path: ["severity"], equals: opts.severity }
    : undefined;

  const flaggedQuestions = await prisma.examQuestion.findMany({
    where: {
      qualityScore: { lt: 80 },
      ...(feedbackFilter ? { qualityFeedback: feedbackFilter } : {}),
    },
    select: {
      id: true,
      stem: true,
      topic: true,
      exam: true,
      qualityScore: true,
      qualityFeedback: true,
      isAdaptiveEligible: true,
      isMockExamEligible: true,
      performanceAggregate: {
        select: { totalAttempts: true, correctAttempts: true },
      },
    },
    orderBy: { qualityScore: "asc" },
    take: opts.limit ?? 100,
  });

  return flaggedQuestions.map((q) => ({
    id: q.id,
    stem: q.stem.slice(0, 200),
    topic: q.topic,
    exam: q.exam,
    qualityScore: q.qualityScore,
    qualityFeedback: q.qualityFeedback,
    isAdaptiveEligible: q.isAdaptiveEligible,
    isMockExamEligible: q.isMockExamEligible,
    totalAttempts: q.performanceAggregate?.totalAttempts ?? null,
    pValue: q.performanceAggregate
      ? q.performanceAggregate.correctAttempts / q.performanceAggregate.totalAttempts
      : null,
  }));
}
