import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  computeQuestionQualityAnalytics,
  type QuestionQualityAnalytics,
  type QuestionQualityFlag,
  type QuestionQualitySeverity,
} from "@/lib/questions/question-quality-analytics";
import { canonicalCorrectKeysForGrade } from "@/lib/questions/grade-answer-match";

export type QuestionQualityDashboardRow = {
  id: string;
  stem: string;
  exam: string;
  tier: string;
  topic: string | null;
  bodySystem: string | null;
  questionType: string;
  isAdaptiveEligible: boolean;
  isMockExamEligible: boolean;
  totalAttempts: number;
  healthScore: number;
  difficultyIndex: number | null;
  correctResponseRate: number | null;
  discriminationIndex: number | null;
  averageResponseTimeMs: number | null;
  mostSelectedWrongAnswer: string | null;
  mostSelectedWrongAnswerRate: number | null;
  reportFrequency: number;
  flags: QuestionQualityFlag[];
  severity: QuestionQualitySeverity;
  reviewPriority: QuestionQualityAnalytics["reviewPriority"];
  retirementCandidate: boolean;
  distractors: QuestionQualityAnalytics["distractors"];
};

export type QuestionQualityDashboardData = {
  generatedAt: string;
  summary: {
    analyzedQuestions: number;
    flaggedQuestions: number;
    retirementCandidates: number;
    averageHealthScore: number;
    averageCorrectResponseRate: number | null;
    averageDiscriminationIndex: number | null;
    frequentlyReported: number;
  };
  flagCounts: Record<QuestionQualityFlag, number>;
  flaggedQuestions: QuestionQualityDashboardRow[];
  retirementCandidates: QuestionQualityDashboardRow[];
  reviewQueue: QuestionQualityDashboardRow[];
  healthySample: QuestionQualityDashboardRow[];
};

const ALL_FLAGS: QuestionQualityFlag[] = [
  "too_easy",
  "too_difficult",
  "ambiguous",
  "poor_discrimination",
  "frequently_reported",
  "non_functional_distractor",
  "misleading_distractor",
  "possible_answer_key_issue",
];

type DiscriminationRow = {
  question_id: string;
  discrimination_index: number | null;
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number | null, places = 1): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

async function loadDiscriminationByQuestion(questionIds: string[]): Promise<Map<string, number>> {
  if (questionIds.length === 0) return new Map();

  const rows = await prisma.$queryRaw<DiscriminationRow[]>(Prisma.sql`
    WITH user_scores AS (
      SELECT
        user_id,
        AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) AS score,
        COUNT(*) AS attempts
      FROM exam_question_practice_answer_attempts
      GROUP BY user_id
      HAVING COUNT(*) >= 5
    ),
    scored_users AS (
      SELECT
        user_id,
        score,
        NTILE(4) OVER (ORDER BY score DESC) AS quartile
      FROM user_scores
    ),
    scoped_attempts AS (
      SELECT
        a.question_id,
        a.user_id,
        CASE WHEN a.is_correct THEN 1.0 ELSE 0.0 END AS correct_value
      FROM exam_question_practice_answer_attempts a
      WHERE a.question_id IN (${Prisma.join(questionIds)})
    )
    SELECT
      s.question_id,
      AVG(CASE WHEN u.quartile = 1 THEN s.correct_value END)
        - AVG(CASE WHEN u.quartile = 4 THEN s.correct_value END) AS discrimination_index
    FROM scoped_attempts s
    JOIN scored_users u ON u.user_id = s.user_id
    WHERE u.quartile IN (1, 4)
    GROUP BY s.question_id
  `);

  return new Map(
    rows
      .filter((row) => row.discrimination_index != null)
      .map((row) => [row.question_id, Number(row.discrimination_index)]),
  );
}

async function loadReportCountsByQuestion(questionIds: string[]): Promise<Map<string, number>> {
  if (questionIds.length === 0) return new Map();
  const questionSet = new Set(questionIds);
  const reports = await prisma.userFeedbackReport.findMany({
    where: { category: "CONFUSING_QUESTION" },
    select: { examContextJson: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const counts = new Map<string, number>();
  for (const report of reports) {
    const ctx = report.examContextJson;
    if (!ctx || typeof ctx !== "object" || Array.isArray(ctx)) continue;
    const rawQuestionId = (ctx as Record<string, unknown>).questionId ?? (ctx as Record<string, unknown>).id;
    const questionId = typeof rawQuestionId === "string" ? rawQuestionId : null;
    if (!questionId || !questionSet.has(questionId)) continue;
    counts.set(questionId, (counts.get(questionId) ?? 0) + 1);
  }
  return counts;
}

export async function loadQuestionQualityDashboard(opts: { limit?: number } = {}): Promise<QuestionQualityDashboardData> {
  const now = new Date().toISOString();
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return {
      generatedAt: now,
      summary: {
        analyzedQuestions: 0,
        flaggedQuestions: 0,
        retirementCandidates: 0,
        averageHealthScore: 100,
        averageCorrectResponseRate: null,
        averageDiscriminationIndex: null,
        frequentlyReported: 0,
      },
      flagCounts: Object.fromEntries(ALL_FLAGS.map((flag) => [flag, 0])) as Record<QuestionQualityFlag, number>,
      flaggedQuestions: [],
      retirementCandidates: [],
      reviewQueue: [],
      healthySample: [],
    };
  }

  const take = Math.min(Math.max(opts.limit ?? 300, 50), 1000);
  const questions = await prisma.examQuestion.findMany({
    where: {
      performanceAggregate: { isNot: null },
    },
    select: {
      id: true,
      stem: true,
      exam: true,
      tier: true,
      topic: true,
      bodySystem: true,
      questionType: true,
      correctAnswer: true,
      isAdaptiveEligible: true,
      isMockExamEligible: true,
      performanceAggregate: {
        select: {
          totalAttempts: true,
          correctAttempts: true,
          responseTimeTotalMs: true,
          responseTimeSamples: true,
        },
      },
      answerOptionAggregates: {
        select: { optionKey: true, selectionCount: true },
      },
    },
    orderBy: [{ performanceAggregate: { totalAttempts: "desc" } }, { updatedAt: "desc" }],
    take,
  });

  const questionIds = questions.map((q) => q.id);
  const [discriminationByQuestion, reportCountsByQuestion] = await Promise.all([
    loadDiscriminationByQuestion(questionIds),
    loadReportCountsByQuestion(questionIds),
  ]);

  const rows = questions
    .map((question): QuestionQualityDashboardRow | null => {
      const perf = question.performanceAggregate;
      if (!perf) return null;
      const averageResponseTimeMs =
        perf.responseTimeSamples > 0 ? Math.round(perf.responseTimeTotalMs / perf.responseTimeSamples) : null;
      const analytics = computeQuestionQualityAnalytics({
        totalAttempts: perf.totalAttempts,
        correctAttempts: perf.correctAttempts,
        correctOptionKeys: canonicalCorrectKeysForGrade(question.questionType, question.correctAnswer),
        optionSelections: question.answerOptionAggregates,
        discriminationIndex: discriminationByQuestion.get(question.id) ?? null,
        averageResponseTimeMs,
        reportCount: reportCountsByQuestion.get(question.id) ?? 0,
      });

      return {
        id: question.id,
        stem: question.stem.slice(0, 260),
        exam: question.exam,
        tier: question.tier,
        topic: question.topic,
        bodySystem: question.bodySystem,
        questionType: question.questionType,
        isAdaptiveEligible: question.isAdaptiveEligible,
        isMockExamEligible: question.isMockExamEligible,
        totalAttempts: perf.totalAttempts,
        healthScore: analytics.healthScore,
        difficultyIndex: analytics.difficultyIndex,
        correctResponseRate: analytics.correctResponseRate,
        discriminationIndex: analytics.discriminationIndex,
        averageResponseTimeMs: analytics.averageResponseTimeMs,
        mostSelectedWrongAnswer: analytics.mostSelectedWrongAnswer,
        mostSelectedWrongAnswerRate: analytics.mostSelectedWrongAnswerRate,
        reportFrequency: analytics.reportFrequency,
        flags: analytics.flags,
        severity: analytics.severity,
        reviewPriority: analytics.reviewPriority,
        retirementCandidate: analytics.retirementCandidate,
        distractors: analytics.distractors,
      };
    })
    .filter((row): row is QuestionQualityDashboardRow => row != null);

  const flaggedQuestions = rows
    .filter((row) => row.flags.length > 0)
    .sort((a, b) => a.healthScore - b.healthScore || b.totalAttempts - a.totalAttempts);
  const retirementCandidates = rows
    .filter((row) => row.retirementCandidate)
    .sort((a, b) => a.healthScore - b.healthScore || b.reportFrequency - a.reportFrequency);
  const reviewQueue = flaggedQuestions.slice(0, 80);
  const healthySample = rows
    .filter((row) => row.flags.length === 0)
    .sort((a, b) => b.healthScore - a.healthScore || b.totalAttempts - a.totalAttempts)
    .slice(0, 12);

  const flagCounts = Object.fromEntries(ALL_FLAGS.map((flag) => [flag, 0])) as Record<QuestionQualityFlag, number>;
  for (const row of rows) {
    for (const flag of row.flags) flagCounts[flag] += 1;
  }

  return {
    generatedAt: now,
    summary: {
      analyzedQuestions: rows.length,
      flaggedQuestions: flaggedQuestions.length,
      retirementCandidates: retirementCandidates.length,
      averageHealthScore: Math.round(average(rows.map((row) => row.healthScore)) ?? 100),
      averageCorrectResponseRate: round(average(rows.flatMap((row) => (row.correctResponseRate == null ? [] : [row.correctResponseRate * 100])))),
      averageDiscriminationIndex: round(average(rows.flatMap((row) => (row.discriminationIndex == null ? [] : [row.discriminationIndex]))), 3),
      frequentlyReported: flagCounts.frequently_reported,
    },
    flagCounts,
    flaggedQuestions,
    retirementCandidates,
    reviewQueue,
    healthySample,
  };
}
