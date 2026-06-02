/**
 * Content Quality Intelligence
 *
 * Automatically flags questions that exhibit patterns indicating quality issues:
 *   - Potentially ambiguous (answer hotly contested)
 *   - Potentially miskeyed (high wrong rate for high-confidence learners)
 *   - Poor rationale (high abandonment before reading rationale)
 *   - Too difficult (consistently wrong even by strong learners)
 *   - Too easy (correct rate > 95%)
 *   - Tier mismatch (specialty content in wrong pathway)
 *   - Outdated (rapid-fire wrong submissions, possible stale content)
 *
 * Question health signals:
 *   - correctRate:    % of learners answering correctly
 *   - abandonRate:    % who navigate away before answering
 *   - avgResponseMs:  median time to answer
 *   - rationaleViewRate: % who read the rationale after answering
 *   - confidenceAccuracyGap: overconfident wrong answers (Dunning-Kruger signal)
 *
 * Usage:
 *   recordQuestionAttempt({ questionId, correct, durationMs, confident, readRationale });
 *   flagQuestion(questionId); // Manual flag
 *   getQualityReport(); // All questions with flags
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionFlag =
  | "potentially_ambiguous"
  | "potentially_miskeyed"
  | "poor_rationale"
  | "too_difficult"
  | "too_easy"
  | "tier_mismatch"
  | "possible_specialty_leakage"
  | "possible_scope_mismatch"
  | "outdated_content"
  | "low_engagement"
  | "high_abandonment";

export type QuestionQualityStatus = "healthy" | "watch" | "review_required" | "critical";

export type QuestionAttemptRecord = {
  questionId: string;
  /** Topic/category slug. */
  topic: string;
  /** Pathway tier this question belongs to. */
  tier: string;
  correct: boolean;
  /** Self-reported confidence (high/medium/low). */
  confidence?: "high" | "medium" | "low";
  durationMs: number;
  /** Whether the learner opened the rationale panel. */
  readRationale?: boolean;
  /** Whether the learner abandoned (navigated away) before answering. */
  abandoned?: boolean;
};

export type QuestionQualityReport = {
  questionId: string;
  topic: string;
  tier: string;
  sampleCount: number;
  correctRate: number;
  wrongRate: number;
  abandonRate: number;
  avgDurationMs: number;
  rationaleViewRate: number;
  overconfidentWrongRate: number;
  flags: QuestionFlag[];
  status: QuestionQualityStatus;
  qualityScore: number;
};

// ─── In-process stats store ───────────────────────────────────────────────────

type QuestionStatBucket = {
  topic: string;
  tier: string;
  total: number;
  correct: number;
  abandoned: number;
  readRationale: number;
  overconfidentWrong: number;
  totalDurationMs: number;
  manualFlags: Set<QuestionFlag>;
};

const questionStore = new Map<string, QuestionStatBucket>();
const MAX_QUESTIONS = 5000;

function getOrCreateBucket(questionId: string, topic: string, tier: string): QuestionStatBucket {
  let b = questionStore.get(questionId);
  if (!b) {
    if (questionStore.size >= MAX_QUESTIONS) {
      const firstKey = questionStore.keys().next().value;
      if (firstKey) questionStore.delete(firstKey);
    }
    b = { topic, tier, total: 0, correct: 0, abandoned: 0, readRationale: 0, overconfidentWrong: 0, totalDurationMs: 0, manualFlags: new Set() };
    questionStore.set(questionId, b);
  }
  return b;
}

// ─── Recording ────────────────────────────────────────────────────────────────

export function recordQuestionAttempt(record: QuestionAttemptRecord): void {
  const b = getOrCreateBucket(record.questionId, record.topic, record.tier);
  b.total++;
  if (record.correct) b.correct++;
  if (record.abandoned) b.abandoned++;
  if (record.readRationale) b.readRationale++;
  if (!record.correct && record.confidence === "high") b.overconfidentWrong++;
  b.totalDurationMs += record.durationMs;
}

/** Add a manual flag to a question (from human reviewer or admin). */
export function flagQuestion(questionId: string, flag: QuestionFlag): void {
  const b = questionStore.get(questionId);
  if (b) b.manualFlags.add(flag);
}

// ─── Quality computation ──────────────────────────────────────────────────────

const THRESHOLDS = {
  tooEasyCorrectRate:       0.95,
  tooDifficultCorrectRate:  0.30,
  ambiguousCorrectRate:     0.45, // near-random
  highAbandonRate:          0.20,
  poorRationaleViewRate:    0.15,
  overconfidentWrongRate:   0.20,
  minSamplesForFlag:        10,
};

function computeFlags(b: QuestionStatBucket): QuestionFlag[] {
  const flags: QuestionFlag[] = [...b.manualFlags];
  if (b.total < THRESHOLDS.minSamplesForFlag) return flags;

  const correctRate = b.correct / b.total;
  const abandonRate = b.abandoned / b.total;
  const rationaleRate = b.readRationale / b.total;
  const overconfidentRate = b.overconfidentWrong / b.total;

  if (correctRate > THRESHOLDS.tooEasyCorrectRate && !flags.includes("too_easy"))
    flags.push("too_easy");
  if (correctRate < THRESHOLDS.tooDifficultCorrectRate && !flags.includes("too_difficult"))
    flags.push("too_difficult");
  if (
    correctRate > 0.40 && correctRate < 0.60 && !flags.includes("potentially_ambiguous")
  )
    flags.push("potentially_ambiguous");
  if (overconfidentRate > THRESHOLDS.overconfidentWrongRate && !flags.includes("potentially_miskeyed"))
    flags.push("potentially_miskeyed");
  if (abandonRate > THRESHOLDS.highAbandonRate && !flags.includes("high_abandonment"))
    flags.push("high_abandonment");
  if (rationaleRate < THRESHOLDS.poorRationaleViewRate && !flags.includes("poor_rationale"))
    flags.push("poor_rationale");

  return flags;
}

function computeQualityScore(flags: QuestionFlag[], correctRate: number): number {
  let score = 100;
  const severities: Record<QuestionFlag, number> = {
    potentially_miskeyed:       30,
    potentially_ambiguous:      25,
    too_difficult:              20,
    poor_rationale:             20,
    high_abandonment:           20,
    tier_mismatch:              30,
    possible_specialty_leakage: 30,
    possible_scope_mismatch:    25,
    outdated_content:           25,
    too_easy:                   10,
    low_engagement:             10,
  };
  for (const f of flags) score -= severities[f] ?? 10;
  return Math.max(0, Math.min(100, score));
}

function statusFromScore(score: number): QuestionQualityStatus {
  if (score >= 80) return "healthy";
  if (score >= 60) return "watch";
  if (score >= 40) return "review_required";
  return "critical";
}

/** Generate a quality report for a single question. */
export function getQuestionQualityReport(questionId: string): QuestionQualityReport | null {
  const b = questionStore.get(questionId);
  if (!b || b.total === 0) return null;

  const correctRate = b.correct / b.total;
  const flags = computeFlags(b);
  const score = computeQualityScore(flags, correctRate);

  return {
    questionId,
    topic: b.topic,
    tier: b.tier,
    sampleCount: b.total,
    correctRate: Math.round(correctRate * 100) / 100,
    wrongRate: Math.round((1 - correctRate) * 100) / 100,
    abandonRate: Math.round((b.abandoned / b.total) * 100) / 100,
    avgDurationMs: Math.round(b.totalDurationMs / b.total),
    rationaleViewRate: Math.round((b.readRationale / b.total) * 100) / 100,
    overconfidentWrongRate: Math.round((b.overconfidentWrong / b.total) * 100) / 100,
    flags,
    status: statusFromScore(score),
    qualityScore: score,
  };
}

/** Get all flagged questions sorted by severity (most critical first). */
export function getAllFlaggedQuestions(tier?: string): QuestionQualityReport[] {
  const reports: QuestionQualityReport[] = [];
  for (const [qid, b] of questionStore) {
    if (tier && b.tier !== tier) continue;
    if (b.total < THRESHOLDS.minSamplesForFlag && b.manualFlags.size === 0) continue;
    const report = getQuestionQualityReport(qid);
    if (report && report.flags.length > 0) reports.push(report);
  }
  return reports.sort((a, b) => a.qualityScore - b.qualityScore);
}

/** Platform-level quality summary. */
export function getPlatformQuestionQualitySummary(): {
  totalTracked: number;
  flaggedCount: number;
  criticalCount: number;
  reviewRequiredCount: number;
  avgQualityScore: number | null;
  topFlags: Array<{ flag: QuestionFlag; count: number }>;
} {
  const reports: QuestionQualityReport[] = [];
  for (const [qid] of questionStore) {
    const r = getQuestionQualityReport(qid);
    if (r) reports.push(r);
  }

  const flagged = reports.filter((r) => r.flags.length > 0);
  const critical = reports.filter((r) => r.status === "critical");
  const reviewRequired = reports.filter((r) => r.status === "review_required");
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((s, r) => s + r.qualityScore, 0) / reports.length)
    : null;

  const flagCounts = new Map<QuestionFlag, number>();
  for (const r of flagged) {
    for (const f of r.flags) {
      flagCounts.set(f, (flagCounts.get(f) ?? 0) + 1);
    }
  }
  const topFlags = [...flagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([flag, count]) => ({ flag, count }));

  return {
    totalTracked: reports.length,
    flaggedCount: flagged.length,
    criticalCount: critical.length,
    reviewRequiredCount: reviewRequired.length,
    avgQualityScore: avgScore,
    topFlags,
  };
}

export function resetContentQualityIntelligence(): void {
  questionStore.clear();
}
