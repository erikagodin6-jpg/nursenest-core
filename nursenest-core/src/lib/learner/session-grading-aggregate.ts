import { ExamSessionStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";

/**
 * Tier/country-scoped graded outcomes from completed exam sessions (same source as weak-topic analysis).
 */
export type SessionGradingAggregate = {
  correct: number;
  total: number;
  sessionCount: number;
};

/**
 * Aggregates correct/total across recent completed sessions (in-scope questions only).
 */
export async function loadSessionGradingAggregate(
  userId: string,
  entitlement: AccessScope,
  limitSessions = 8,
): Promise<SessionGradingAggregate> {
  if (!entitlement.hasAccess) {
    return { correct: 0, total: 0, sessionCount: 0 };
  }

  const sessions = await prisma.examSession.findMany({
    where: { userId, status: ExamSessionStatus.COMPLETED },
    orderBy: { updatedAt: "desc" },
    take: limitSessions,
    select: { questionIds: true, answers: true },
  });

  if (sessions.length === 0) {
    return { correct: 0, total: 0, sessionCount: 0 };
  }

  const baseWhere = questionAccessWhere(entitlement);
  let correct = 0;
  let total = 0;

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
      select: { id: true, questionType: true, correctAnswer: true },
    });

    for (const q of qs) {
      total += 1;
      if (answerMatches(q.questionType, q.correctAnswer as Prisma.JsonValue, answers[q.id])) {
        correct += 1;
      }
    }
  }

  return { correct, total, sessionCount: sessions.length };
}
