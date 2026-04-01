import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { computeTopicMomentum, topicTrendSummary, type TopicMomentum } from "@/lib/learner/topic-momentum";
import { formatTopicLabelForDisplay, normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { examQuestionDbTopicsMatchingCanonicals } from "@/lib/learner/weak-topic-db-match";
import {
  classifyTopicStrength,
  computeDecaySignals,
  computeWeakPriorityScore,
  fallbackWeakPriorityFromSessionRow,
  ledgerSourceConfidence,
  THIN_LEDGER_MIN_TOPICS,
  THIN_LEDGER_TOTAL_ATTEMPTS,
} from "@/lib/learner/weak-topic-priority";
import {
  loadWeakTopicsFromExamSessions,
  type TopicStrength,
  type WeakTopicRow,
} from "@/lib/learner/weak-topics-from-sessions";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

function stableWeakPrioritySortKey(a: WeakTopicRow, b: WeakTopicRow): number {
  const pa = Math.round((a.weakPriorityScore ?? 0) * 1000) / 1000;
  const pb = Math.round((b.weakPriorityScore ?? 0) * 1000) / 1000;
  if (pb !== pa) return pb - pa;
  const ta = a.normalizedTopic ?? normalizeTopicKey(a.topic);
  const tb = b.normalizedTopic ?? normalizeTopicKey(b.topic);
  return ta.localeCompare(tb);
}

function statRowToWeakTopicRow(
  s: {
    topic: string;
    correctCount: number;
    wrongCount: number;
    wrongStreak: number;
    lastWrongAt: Date | null;
    lastAttemptAt: Date | null;
  },
): WeakTopicRow {
  const normalizedTopic = s.topic;
  const attempted = s.correctCount + s.wrongCount;
  const missed = s.wrongCount;
  const missRate = attempted > 0 ? Math.round((missed / attempted) * 100) : 0;
  const statLike = {
    correctCount: s.correctCount,
    wrongCount: s.wrongCount,
    wrongStreak: s.wrongStreak,
    lastWrongAt: s.lastWrongAt,
    lastAttemptAt: s.lastAttemptAt,
  };
  const weakPriorityScore = computeWeakPriorityScore(statLike);
  const signals = computeDecaySignals(statLike);
  const strength = classifyTopicStrength({
    correctCount: s.correctCount,
    wrongCount: s.wrongCount,
    wrongStreak: s.wrongStreak,
    lastWrongAt: s.lastWrongAt,
  });
  return {
    topic: formatTopicLabelForDisplay(normalizedTopic),
    normalizedTopic,
    missed,
    attempted,
    missRate,
    strength,
    lastWrongAt: s.lastWrongAt?.toISOString() ?? null,
    wrongStreak: s.wrongStreak,
    weakPriorityScore,
    sourceConfidence: ledgerSourceConfidence(statLike),
    decayAdjustedWrongSignal: signals.decayAdjustedWrongSignal,
    decayAdjustedCorrectSignal: signals.decayAdjustedCorrectSignal,
    topicSource: "ledger",
    evidenceCount: attempted,
  };
}

function mergeLedgerAndFallbackWeak(args: {
  ledgerWeak: WeakTopicRow[];
  ledgerAll: WeakTopicRow[];
  fallback: WeakTopicRow[];
  limit: number;
  totalLedgerAttempts: number;
  ledgerTopicCount: number;
}): WeakTopicRow[] {
  const { ledgerWeak, ledgerAll, fallback, limit, totalLedgerAttempts, ledgerTopicCount } = args;

  const weakCount = ledgerWeak.length;
  const ledgerAdequate =
    totalLedgerAttempts >= THIN_LEDGER_TOTAL_ATTEMPTS && ledgerTopicCount >= THIN_LEDGER_MIN_TOPICS;
  /** Adequate ledger + enough weak labels: do not blend session fallback (avoids stale mock pollution). */
  const skipFallback = ledgerAdequate && weakCount >= 2;

  const byNorm = new Map<string, WeakTopicRow>();
  for (const r of ledgerWeak) {
    const k = r.normalizedTopic ?? normalizeTopicKey(r.topic);
    byNorm.set(k, { ...r });
  }

  const ledgerByNorm = new Map<string, WeakTopicRow>();
  for (const r of ledgerAll) {
    ledgerByNorm.set(r.normalizedTopic ?? normalizeTopicKey(r.topic), r);
  }

  if (!skipFallback) {
    for (const f of fallback) {
      const canon = f.normalizedTopic ?? normalizeTopicKey(f.topic);
      const fp = fallbackWeakPriorityFromSessionRow(f.missRate, f.attempted, f.missed);
      const existing = byNorm.get(canon);
      const ledgerPeer = ledgerByNorm.get(canon);
      const wL = ledgerPeer?.sourceConfidence ?? 0;

      if (ledgerPeer && ledgerPeer.strength === "strong" && wL >= 0.45) {
        continue;
      }

      if (existing) {
        const wF = (1 - wL) * 0.85;
        const mergedScore = Math.min(1, wL * (existing.weakPriorityScore ?? 0) + wF * fp);
        if (mergedScore <= (existing.weakPriorityScore ?? 0) + 0.001) continue;
        byNorm.set(canon, {
          ...existing,
          weakPriorityScore: mergedScore,
          topicSource: "mixed",
          sourceConfidence: Math.min(1, wL + 0.12),
        });
      } else {
        const cap = 0.62;
        byNorm.set(canon, {
          topic: f.topic,
          normalizedTopic: canon,
          missed: f.missed,
          attempted: f.attempted,
          missRate: f.missRate,
          strength: "weak",
          weakPriorityScore: Math.min(cap, fp),
          sourceConfidence: 0.35,
          topicSource: "session_fallback",
          evidenceCount: f.evidenceCount ?? f.attempted,
          decayAdjustedWrongSignal: fp * 0.85,
          decayAdjustedCorrectSignal: (1 - fp) * 0.35,
        });
      }
    }
  }

  return [...byNorm.values()].sort(stableWeakPrioritySortKey).slice(0, limit);
}

export async function recordTopicOutcomesSequential(
  userId: string,
  outcomes: { topic: string; correct: boolean }[],
): Promise<void> {
  if (outcomes.length === 0) return;
  const now = new Date();
  for (const o of outcomes) {
    const topic = normalizeTopicKey(o.topic);
    try {
      await prisma.$transaction(async (tx) => {
        const row = await tx.userTopicStat.findUnique({
          where: { userId_topic: { userId, topic } },
        });
        if (!row) {
          await tx.userTopicStat.create({
            data: {
              userId,
              topic,
              correctCount: o.correct ? 1 : 0,
              wrongCount: o.correct ? 0 : 1,
              wrongStreak: o.correct ? 0 : 1,
              lastWrongAt: o.correct ? null : now,
              lastAttemptAt: now,
            },
          });
          return;
        }
        await tx.userTopicStat.update({
          where: { id: row.id },
          data: {
            correctCount: o.correct ? { increment: 1 } : undefined,
            wrongCount: !o.correct ? { increment: 1 } : undefined,
            wrongStreak: o.correct ? 0 : { increment: 1 },
            lastWrongAt: !o.correct ? now : undefined,
            lastAttemptAt: now,
          },
        });
      });
    } catch (e) {
      safeServerLogCritical("topic_performance", "record_failed", { userId, topic }, e);
    }
  }
}

export async function recordTopicOutcomesFromPracticeTest(
  userId: string,
  questionIds: string[],
  answers: Record<string, unknown>,
  entitlement: AccessScope,
): Promise<void> {
  const base = questionAccessWhere(entitlement);
  const qs = await prisma.examQuestion.findMany({
    where: { AND: [{ id: { in: questionIds } }, base] },
    select: { id: true, topic: true, questionType: true, correctAnswer: true },
  });
  const byId = new Map(qs.map((q) => [q.id, q]));
  const outcomes: { topic: string; correct: boolean }[] = [];
  for (const id of questionIds) {
    const q = byId.get(id);
    if (!q) continue;
    const ok = answerMatches(q.questionType, q.correctAnswer as Prisma.JsonValue, answers[id]);
    outcomes.push({ topic: normalizeTopicKey(q.topic), correct: ok });
  }
  await recordTopicOutcomesSequential(userId, outcomes);
}

export type TopicTrendRow = {
  topic: string;
  momentum: TopicMomentum;
  summary: string;
};

export type TopicPerformanceSnapshot = {
  weakTopics: WeakTopicRow[];
  /** Highest-accuracy topics with enough attempts — for reinforcement messaging. */
  strongTopics: WeakTopicRow[];
  /** Recent trajectory heuristics (declining / improving / stable). */
  trends: TopicTrendRow[];
  byStrength: { strong: WeakTopicRow[]; moderate: WeakTopicRow[]; weak: WeakTopicRow[] };
  recommendedQuizTopic: string | null;
  source: "ledger" | "mixed" | "fallback";
};

/**
 * Unified weak-area list: prefers persisted topic stats; falls back to mock session aggregation when
 * ledger evidence is thin.
 */
export async function loadUnifiedTopicPerformance(
  userId: string,
  entitlement: AccessScope,
  limit = 8,
): Promise<TopicPerformanceSnapshot> {
  if (!entitlement.hasAccess) {
    return {
      weakTopics: [],
      strongTopics: [],
      trends: [],
      byStrength: { strong: [], moderate: [], weak: [] },
      recommendedQuizTopic: null,
      source: "fallback",
    };
  }

  const stats = await prisma.userTopicStat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  const rows = stats.map((s) =>
    statRowToWeakTopicRow({
      topic: s.topic,
      correctCount: s.correctCount,
      wrongCount: s.wrongCount,
      wrongStreak: s.wrongStreak,
      lastWrongAt: s.lastWrongAt,
      lastAttemptAt: s.lastAttemptAt,
    }),
  );

  const totalLedgerAttempts = rows.reduce((sum, r) => sum + r.attempted, 0);

  const byStrength: TopicPerformanceSnapshot["byStrength"] = {
    strong: [],
    moderate: [],
    weak: [],
  };
  for (const r of rows) {
    const tier = (r.strength ?? "moderate") as TopicStrength;
    byStrength[tier].push(r);
  }
  for (const k of Object.keys(byStrength) as (keyof typeof byStrength)[]) {
    byStrength[k].sort(stableWeakPrioritySortKey);
  }

  const ledgerWeak = rows.filter((r) => r.strength === "weak").sort(stableWeakPrioritySortKey);

  const fallback = await loadWeakTopicsFromExamSessions(userId, entitlement, limit);
  const mergedWeak = mergeLedgerAndFallbackWeak({
    ledgerWeak,
    ledgerAll: rows,
    fallback,
    limit,
    totalLedgerAttempts,
    ledgerTopicCount: rows.length,
  });

  let source: TopicPerformanceSnapshot["source"] = "ledger";
  if (mergedWeak.some((w) => w.topicSource === "session_fallback" || w.topicSource === "mixed")) {
    source = "mixed";
  }
  if (mergedWeak.length > 0 && mergedWeak.every((m) => m.topicSource === "session_fallback")) {
    source = "fallback";
  }

  const recommendedQuizTopic =
    pickRecommendedQuizTopic(mergedWeak, ledgerWeak) ??
    rows.find((r) => r.strength === "weak")?.topic ??
    null;

  const strongTopics = [...rows]
    .filter((r) => r.attempted >= 3)
    .sort((a, b) => a.missRate - b.missRate || b.attempted - a.attempted)
    .slice(0, 6);

  const momentumRank: Record<TopicMomentum, number> = { declining: 0, stable: 1, improving: 2 };
  const trends: TopicTrendRow[] = [...rows]
    .filter((r) => r.attempted >= 3)
    .map((r) => {
      const momentum = computeTopicMomentum(r);
      return { topic: r.topic, momentum, summary: topicTrendSummary(r, momentum) };
    })
    .sort((a, b) => momentumRank[a.momentum] - momentumRank[b.momentum] || a.topic.localeCompare(b.topic))
    .slice(0, 8);

  return {
    weakTopics: mergedWeak,
    strongTopics,
    trends,
    byStrength,
    recommendedQuizTopic,
    source,
  };
}

function pickRecommendedQuizTopic(mergedWeak: WeakTopicRow[], ledgerWeak: WeakTopicRow[]): string | null {
  const pool = mergedWeak.length ? mergedWeak : ledgerWeak;
  if (pool.length === 0) return null;
  const sorted = [...pool].sort(stableWeakPrioritySortKey);
  const best = sorted[0];
  if (!best) return null;
  const ledgerBacked = sorted.filter((r) => r.topicSource !== "session_fallback" || (r.sourceConfidence ?? 0) >= 0.35);
  const top = ledgerBacked[0] ?? best;
  return top.topic;
}

export type WeakTopicPracticePlan = {
  /** Raw DB topic strings for `ExamQuestion.topic` queries. */
  dbTopicNames: string[];
  /** Canonical topic key → weak priority 0–1 */
  priorityByCanonical: Map<string, number>;
};

/**
 * Resolves DB topic strings and priority map for weak-mode pools and CAT boosts.
 */
export async function loadWeakTopicPracticePlan(
  userId: string,
  entitlement: AccessScope,
  max = 16,
): Promise<WeakTopicPracticePlan> {
  const snap = await loadUnifiedTopicPerformance(userId, entitlement, max);
  const weak = snap.weakTopics;
  const priorityByCanonical = new Map<string, number>();
  for (const w of weak) {
    const k = w.normalizedTopic ?? normalizeTopicKey(w.topic);
    priorityByCanonical.set(k, w.weakPriorityScore ?? 0);
  }

  if (weak.length === 0) {
    const fb = await loadWeakTopicsFromExamSessions(userId, entitlement, 12);
    for (const f of fb) {
      const k = f.normalizedTopic ?? normalizeTopicKey(f.topic);
      priorityByCanonical.set(k, fallbackWeakPriorityFromSessionRow(f.missRate, f.attempted, f.missed));
    }
  }

  const canonicals = [...priorityByCanonical.keys()].slice(0, max);
  const base = questionAccessWhere(entitlement);
  const dbTopicNames = await examQuestionDbTopicsMatchingCanonicals(base, canonicals);

  return { dbTopicNames, priorityByCanonical };
}

/** Topic names for practice-test weak pool selection (DB-aligned strings). */
export async function getWeakTopicNamesForPractice(
  userId: string,
  entitlement: AccessScope,
  max = 16,
): Promise<string[]> {
  const plan = await loadWeakTopicPracticePlan(userId, entitlement, max);
  return plan.dbTopicNames.slice(0, max);
}
