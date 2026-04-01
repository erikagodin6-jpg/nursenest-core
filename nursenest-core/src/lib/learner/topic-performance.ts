import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { computeTopicMomentum, topicTrendSummary, type TopicMomentum } from "@/lib/learner/topic-momentum";
import {
  loadWeakTopicsFromExamSessions,
  normalizeTopicLabel,
  type TopicStrength,
  type WeakTopicRow,
} from "@/lib/learner/weak-topics-from-sessions";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

function classifyTopicStrength(args: {
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastWrongAt: Date | null;
}): TopicStrength {
  const total = args.correctCount + args.wrongCount;
  if (total === 0) return "moderate";
  const acc = args.correctCount / total;
  const daysSinceWrong = args.lastWrongAt
    ? (Date.now() - args.lastWrongAt.getTime()) / 86400000
    : 999;

  if (total < 3) {
    if (args.wrongCount >= 2 && acc < 0.5) return "weak";
    if (args.correctCount === total && total >= 2) return "strong";
    return "moderate";
  }

  if (acc >= 0.78 && args.wrongStreak <= 1 && args.wrongCount / total <= 0.28) return "strong";
  if (acc < 0.55 || args.wrongStreak >= 3 || (acc < 0.65 && daysSinceWrong < 3 && args.wrongCount >= 2)) {
    return "weak";
  }
  return "moderate";
}

function statRowToWeakTopicRow(
  s: {
    topic: string;
    correctCount: number;
    wrongCount: number;
    wrongStreak: number;
    lastWrongAt: Date | null;
  },
): WeakTopicRow {
  const attempted = s.correctCount + s.wrongCount;
  const missed = s.wrongCount;
  const missRate = attempted > 0 ? Math.round((missed / attempted) * 100) : 0;
  return {
    topic: s.topic,
    missed,
    attempted,
    missRate,
    strength: classifyTopicStrength({
      correctCount: s.correctCount,
      wrongCount: s.wrongCount,
      wrongStreak: s.wrongStreak,
      lastWrongAt: s.lastWrongAt,
    }),
    lastWrongAt: s.lastWrongAt?.toISOString() ?? null,
    wrongStreak: s.wrongStreak,
  };
}

export async function recordTopicOutcomesSequential(
  userId: string,
  outcomes: { topic: string; correct: boolean }[],
): Promise<void> {
  if (outcomes.length === 0) return;
  const now = new Date();
  for (const o of outcomes) {
    const topic = normalizeTopicLabel(o.topic);
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
    outcomes.push({ topic: normalizeTopicLabel(q.topic), correct: ok });
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
 * the ledger is still sparse.
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

  const rows = stats.map(statRowToWeakTopicRow);
  const byStrength: TopicPerformanceSnapshot["byStrength"] = {
    strong: [],
    moderate: [],
    weak: [],
  };
  for (const r of rows) {
    const tier = r.strength ?? "moderate";
    byStrength[tier].push(r);
  }
  for (const k of Object.keys(byStrength) as (keyof typeof byStrength)[]) {
    byStrength[k].sort((a, b) => b.missRate - a.missRate || b.missed - a.missed);
  }

  let weakFromLedger = rows.filter((r) => r.strength === "weak").slice(0, limit);
  let source: TopicPerformanceSnapshot["source"] = "ledger";

  if (weakFromLedger.length < 2) {
    const fallback = await loadWeakTopicsFromExamSessions(userId, entitlement, limit);
    const seen = new Set(weakFromLedger.map((w) => w.topic));
    for (const f of fallback) {
      if (weakFromLedger.length >= limit) break;
      if (seen.has(f.topic)) continue;
      seen.add(f.topic);
      weakFromLedger.push({
        ...f,
        strength: "weak" as const,
      });
    }
    source = weakFromLedger.length ? "mixed" : "fallback";
  }

  weakFromLedger = weakFromLedger.slice(0, limit);

  const recommendedQuizTopic = weakFromLedger[0]?.topic ?? rows.find((r) => r.strength === "weak")?.topic ?? null;

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
    weakTopics: weakFromLedger,
    strongTopics,
    trends,
    byStrength,
    recommendedQuizTopic,
    source,
  };
}

/** Topic names for practice-test “weak” pool selection (linear + CAT). */
export async function getWeakTopicNamesForPractice(
  userId: string,
  entitlement: AccessScope,
  max = 16,
): Promise<string[]> {
  const snap = await loadUnifiedTopicPerformance(userId, entitlement, max);
  const names = [...new Set(snap.weakTopics.map((w) => w.topic).filter(Boolean))];
  if (names.length > 0) return names.slice(0, max);

  const fallback = await loadWeakTopicsFromExamSessions(userId, entitlement, 12);
  return [...new Set(fallback.map((w) => w.topic).filter(Boolean))].slice(0, max);
}
