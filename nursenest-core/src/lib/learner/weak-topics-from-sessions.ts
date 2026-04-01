import { ExamSessionStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";
import { formatTopicLabelForDisplay, normalizeTopicKey } from "@/lib/learner/topic-normalize";

/** Derived tier for dashboard / planner copy (centralized weak-area system). */
export type TopicStrength = "strong" | "moderate" | "weak";

export type WeakTopicRow = {
  /** Display label (from canonical key; stable title-style casing). */
  topic: string;
  missed: number;
  attempted: number;
  missRate: number;
  strength?: TopicStrength;
  /** ISO timestamp of last incorrect attempt when known. */
  lastWrongAt?: string | null;
  wrongStreak?: number;
  /** Canonical normalized key — use for dedup and matching question bank topics. */
  normalizedTopic?: string;
  /** 0 = low … 1 = high — ledger evidence vs session fallback. */
  sourceConfidence?: number;
  /** 0–1 higher = drill sooner (CAT / weak pools use this; UI may ignore). */
  weakPriorityScore?: number;
  decayAdjustedWrongSignal?: number;
  decayAdjustedCorrectSignal?: number;
  /** "ledger" | "session_fallback" | "mixed" */
  topicSource?: "ledger" | "session_fallback" | "mixed";
  /** Total scored attempts backing this row (ledger or session aggregate). */
  evidenceCount?: number;
  /** Recommendation confidence for topic-level remediation links. */
  recommendationConfidence?: "high" | "medium" | "low";
};

export function normalizeTopicLabel(topic: string | null | undefined): string {
  return normalizeTopicKey(topic);
}

export { formatTopicLabelForDisplay, normalizeTopicKey };

/**
 * Aggregates missed items by topic from recent completed exam sessions (tier + country scoped questions only).
 */
export async function loadWeakTopicsFromExamSessions(
  userId: string,
  entitlement: AccessScope,
  limitSessions = 6,
): Promise<WeakTopicRow[]> {
  if (!entitlement.hasAccess) return [];

  const sessions = await prisma.examSession.findMany({
    where: { userId, status: ExamSessionStatus.COMPLETED },
    orderBy: { updatedAt: "desc" },
    take: limitSessions,
    select: { questionIds: true, answers: true },
  });

  if (sessions.length === 0) return [];

  const missed = new Map<string, number>();
  const attempted = new Map<string, number>();
  const baseWhere = questionAccessWhere(entitlement);

  for (const s of sessions) {
    const sanitized = sanitizeSessionQuestionIds(s.questionIds);
    const ids = sanitized.ids;
    if (ids.length === 0) continue;

    const answers =
      typeof s.answers === "object" && s.answers !== null && !Array.isArray(s.answers)
        ? (s.answers as Record<string, unknown>)
        : {};

    const qs = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: ids } }, baseWhere] },
      select: { id: true, topic: true, questionType: true, correctAnswer: true },
    });

    for (const q of qs) {
      const label = normalizeTopicKey(q.topic);
      attempted.set(label, (attempted.get(label) ?? 0) + 1);
      const ok = answerMatches(q.questionType, q.correctAnswer as Prisma.JsonValue, answers[q.id]);
      if (!ok) {
        missed.set(label, (missed.get(label) ?? 0) + 1);
      }
    }
  }

  const rows: WeakTopicRow[] = [];
  for (const [topic, att] of attempted) {
    const m = missed.get(topic) ?? 0;
    if (m === 0) continue;
    rows.push({
      topic: formatTopicLabelForDisplay(topic),
      normalizedTopic: topic,
      missed: m,
      attempted: att,
      missRate: att > 0 ? Math.round((m / att) * 100) : 0,
      topicSource: "session_fallback",
      sourceConfidence: 0.35,
    });
  }

  rows.sort((a, b) => b.missed - a.missed || b.missRate - a.missRate);
  return rows.slice(0, 6);
}
