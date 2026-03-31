import { ExamSessionStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";

/** Derived tier for dashboard / planner copy (centralized weak-area system). */
export type TopicStrength = "strong" | "moderate" | "weak";

export type WeakTopicRow = {
  topic: string;
  missed: number;
  attempted: number;
  missRate: number;
  strength?: TopicStrength;
  /** ISO timestamp of last incorrect attempt when known. */
  lastWrongAt?: string | null;
  wrongStreak?: number;
};

export function normalizeTopicLabel(topic: string | null | undefined): string {
  return (topic?.trim() || "General").slice(0, 80);
}

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
      const label = normalizeTopicLabel(q.topic);
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
      topic,
      missed: m,
      attempted: att,
      missRate: att > 0 ? Math.round((m / att) * 100) : 0,
    });
  }

  rows.sort((a, b) => b.missed - a.missed || b.missRate - a.missRate);
  return rows.slice(0, 6);
}
