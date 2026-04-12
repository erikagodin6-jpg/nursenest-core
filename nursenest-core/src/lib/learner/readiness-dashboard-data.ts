/**
 * Readiness Dashboard Data
 *
 * Extended server-side data loader for the premium readiness dashboard.
 * Builds on the existing ReadinessPagePayload and adds:
 *
 *   1. Dimension breakdown — accuracy by body system, cognitive level, question type
 *      Derived from ExamAttempt.results JSON × ExamQuestion metadata join.
 *
 *   2. CAT trend — per-session readiness scores for the sparkline trajectory card.
 *
 *   3. Benchmark — percentile rank (conditional on 100+ qualified learners).
 *
 * Performance protections:
 *   - ExamAttempt: capped at MAX_SESSIONS (30) / MAX_QUESTIONS (600)
 *   - ExamQuestion join: `id in [...]` — N bounded at MAX_QUESTIONS
 *   - CAT trend: last 10 completed CAT sessions only
 *   - All sources run concurrently with Promise.all
 *   - Each source is wrapped in try/catch — one failing source never breaks the page
 */

import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  loadReadinessPagePayload,
  type ReadinessPagePayload,
} from "@/lib/learner/load-readiness-page-payload";
import { computeBenchmarkData, type BenchmarkData } from "@/lib/learner/benchmark-engine";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DimensionStat = {
  /** Display label — body system name, cognitive level, or question type. */
  label: string;
  correct: number;
  total: number;
  /** 0–100 */
  accuracyPct: number;
};

export type DimensionBreakdown = {
  byBodySystem: DimensionStat[];
  byCognitiveLevel: DimensionStat[];
  byQuestionType: DimensionStat[];
};

export type CatTrendPoint = {
  id: string;
  score: number;
  /** ISO string */
  completedAt: string;
  /** "CAT #N" */
  sessionLabel: string;
};

export type ReadinessDashboardPayload = ReadinessPagePayload & {
  dimensions: DimensionBreakdown;
  catTrend: CatTrendPoint[];
  benchmark: BenchmarkData | null;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_SESSIONS = 30;
const MAX_QUESTIONS = 600;
const MAX_CAT_TREND = 10;

// ── Results JSON parsing ──────────────────────────────────────────────────────

type RawResultItem = Record<string, unknown>;

function parseResultItems(
  results: unknown,
): { questionId: string; isCorrect: boolean }[] {
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

// ── Readiness score from PracticeTest results ─────────────────────────────────

function parseReadinessScore(results: unknown): number | null {
  if (!results || typeof results !== "object") return null;
  const r = results as Record<string, unknown>;
  const catReport = r.catReport as Record<string, unknown> | undefined;
  if (catReport?.readinessScore != null && typeof catReport.readinessScore === "number") {
    return Math.round(catReport.readinessScore);
  }
  if (typeof r.accuracyPct === "number") return Math.round(r.accuracyPct);
  if (typeof r.scoreCorrect === "number" && typeof r.scoreTotal === "number" && r.scoreTotal > 0) {
    return Math.round(((r.scoreCorrect as number) / (r.scoreTotal as number)) * 100);
  }
  return null;
}

// ── Dimension breakdown loader ────────────────────────────────────────────────

async function loadDimensionBreakdown(userId: string): Promise<DimensionBreakdown> {
  const empty: DimensionBreakdown = {
    byBodySystem: [], byCognitiveLevel: [], byQuestionType: [],
  };

  try {
    const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // last 60 days
    const attempts = await prisma.examAttempt.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { results: true },
      orderBy: { createdAt: "desc" },
      take: MAX_SESSIONS,
    });

    // Aggregate per-question correct/total across sessions
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

    // Fetch question metadata for the IDs we encountered
    const questionIds = [...questionMap.keys()];
    const questions = await prisma.examQuestion.findMany({
      where: { id: { in: questionIds } },
      select: {
        id: true,
        bodySystem: true,
        cognitiveLevel: true,
        questionType: true,
      },
    });

    // Group by each dimension
    const bodyMap = new Map<string, { correct: number; total: number }>();
    const cogMap  = new Map<string, { correct: number; total: number }>();
    const typeMap = new Map<string, { correct: number; total: number }>();

    for (const q of questions) {
      const perf = questionMap.get(q.id);
      if (!perf) continue;

      for (const [key, map] of [
        [q.bodySystem, bodyMap],
        [q.cognitiveLevel, cogMap],
        [q.questionType, typeMap],
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
      byBodySystem:     toStats(bodyMap),
      byCognitiveLevel: toStats(cogMap),
      byQuestionType:   toStats(typeMap),
    };
  } catch {
    return empty;
  }
}

// ── CAT trend loader ──────────────────────────────────────────────────────────

async function loadCatTrend(userId: string): Promise<CatTrendPoint[]> {
  try {
    const rows = await prisma.practiceTest.findMany({
      where: {
        userId,
        status: PracticeTestStatus.COMPLETED,
        completedAt: { not: null },
      },
      orderBy: { completedAt: "asc" },
      select: { id: true, config: true, results: true, completedAt: true },
      take: 50,
    });

    const catRows = rows.filter((r) => {
      const cfg = r.config as PracticeTestConfigJson | null;
      return cfg?.selectionMode === "cat";
    });

    const trend: CatTrendPoint[] = [];
    let sessionNum = 1;
    for (const row of catRows.slice(-MAX_CAT_TREND)) {
      const score = parseReadinessScore(row.results as PracticeTestResultsJson | null);
      if (score === null) { sessionNum++; continue; }
      trend.push({
        id: row.id,
        score,
        completedAt: row.completedAt!.toISOString(),
        sessionLabel: `CAT #${sessionNum}`,
      });
      sessionNum++;
    }
    return trend;
  } catch {
    return [];
  }
}

// ── Benchmark loader ──────────────────────────────────────────────────────────

async function loadBenchmark(
  userId: string,
  payload: ReadinessPagePayload,
): Promise<BenchmarkData | null> {
  try {
    return await computeBenchmarkData(userId, payload.snapshot.readiness);
  } catch {
    return null;
  }
}

// ── Main entry ────────────────────────────────────────────────────────────────

export async function loadReadinessDashboardData(
  userId: string,
  entitlement: AccessScope,
): Promise<ReadinessDashboardPayload | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  // Load base payload first (required) then augment concurrently
  const base = await loadReadinessPagePayload(userId, entitlement);
  if (!base) return null;

  const [dimensions, catTrend, benchmark] = await Promise.all([
    loadDimensionBreakdown(userId),
    loadCatTrend(userId),
    loadBenchmark(userId, base),
  ]);

  return { ...base, dimensions, catTrend, benchmark };
}
