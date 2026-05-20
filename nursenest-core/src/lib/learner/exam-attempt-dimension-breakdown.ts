import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type DimensionStat = {
  label: string;
  correct: number;
  total: number;
  accuracyPct: number;
};

export type DimensionBreakdown = {
  byBodySystem: DimensionStat[];
  byCognitiveLevel: DimensionStat[];
  byQuestionType: DimensionStat[];
  byClientNeeds: DimensionStat[];
};

export const EMPTY_EXAM_DIMENSION_BREAKDOWN: DimensionBreakdown = {
  byBodySystem: [],
  byCognitiveLevel: [],
  byQuestionType: [],
  byClientNeeds: [],
};

const MAX_SESSIONS = 30;
const MAX_QUESTIONS = 600;

type RawResultItem = Record<string, unknown>;

function parseResultItems(results: unknown): { questionId: string; isCorrect: boolean }[] {
  if (!Array.isArray(results)) return [];
  const out: { questionId: string; isCorrect: boolean }[] = [];
  for (const item of results) {
    if (!item || typeof item !== "object") continue;
    const r = item as RawResultItem;
    const questionId =
      typeof r.questionId === "string" ? r.questionId
      : typeof r.id === "string" ? r.id
      : typeof r.qid === "string" ? r.qid
      : null;
    if (!questionId) continue;
    const isCorrect =
      typeof r.isCorrect === "boolean" ? r.isCorrect
      : typeof r.correct === "boolean" ? r.correct
      : null;
    if (isCorrect === null) continue;
    out.push({ questionId, isCorrect });
  }
  return out;
}

/**
 * Bounded exam-attempt → question-metadata rollup for dashboard / report card.
 * Kept free of `load-readiness-page-payload` / premium snapshot imports to avoid circular graphs.
 */
export async function loadExamAttemptDimensionBreakdown(userId: string): Promise<DimensionBreakdown> {
  const empty = EMPTY_EXAM_DIMENSION_BREAKDOWN;
  if (!userId || !isDatabaseUrlConfigured()) return empty;

  try {
    const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const recentAttempts = await prisma.examAttempt.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { results: true },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    const attempts = recentAttempts.slice(0, MAX_SESSIONS);

    const questionMap = new Map<string, { correct: number; total: number }>();
    for (const attempt of attempts) {
      const items = parseResultItems(attempt.results);
      for (const item of items) {
        const existing = questionMap.get(item.questionId) ?? { correct: 0, total: 0 };
        existing.total++;
        if (item.isCorrect) existing.correct++;
        questionMap.set(item.questionId, existing);
        if (questionMap.size >= MAX_QUESTIONS) break;
      }
      if (questionMap.size >= MAX_QUESTIONS) break;
    }

    if (questionMap.size === 0) return empty;

    const questionIds = [...questionMap.keys()];
    const questions = await prisma.examQuestion.findMany({
      where: { id: { in: questionIds } },
      select: {
        id: true,
        bodySystem: true,
        cognitiveLevel: true,
        questionType: true,
        nclexClientNeedsCategory: true,
      },
    });

    const bodyMap = new Map<string, { correct: number; total: number }>();
    const cogMap = new Map<string, { correct: number; total: number }>();
    const typeMap = new Map<string, { correct: number; total: number }>();
    const clientMap = new Map<string, { correct: number; total: number }>();

    for (const q of questions) {
      const perf = questionMap.get(q.id);
      if (!perf) continue;

      for (const [key, map] of [
        [q.bodySystem, bodyMap],
        [q.cognitiveLevel, cogMap],
        [q.questionType, typeMap],
        [q.nclexClientNeedsCategory, clientMap],
      ] as [string | null | undefined, typeof bodyMap][]) {
        if (!key) continue;
        const label = key.trim();
        if (!label) continue;
        const existing = map.get(label) ?? { correct: 0, total: 0 };
        existing.correct += perf.correct;
        existing.total += perf.total;
        map.set(label, existing);
      }
    }

    const toStats = (map: Map<string, { correct: number; total: number }>): DimensionStat[] =>
      [...map.entries()]
        .filter(([, v]) => v.total >= 2)
        .map(([label, v]) => ({
          label,
          correct: v.correct,
          total: v.total,
          accuracyPct: Math.round((v.correct / v.total) * 100),
        }))
        .sort((a, b) => b.accuracyPct - a.accuracyPct);

    return {
      byBodySystem: toStats(bodyMap),
      byCognitiveLevel: toStats(cogMap),
      byQuestionType: toStats(typeMap),
      byClientNeeds: toStats(clientMap),
    };
  } catch {
    safeServerLog("learner_readiness", "dimension_breakdown_block_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
    return empty;
  }
}
