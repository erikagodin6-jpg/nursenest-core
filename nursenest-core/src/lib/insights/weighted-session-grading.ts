import { ExamSessionStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";

/** λ per day — recent sessions dominate. */
const DECAY = 0.12;

function sessionWeight(updatedAt: Date): number {
  const ageDays = (Date.now() - updatedAt.getTime()) / 86400000;
  return Math.exp(-DECAY * ageDays);
}

/**
 * Exp-weighted correct/total across completed sessions (same scope as aggregate).
 * Cheap: one batch of sessions, same per-session question fetch pattern as aggregate.
 */
export async function loadRecencyWeightedSessionGrading(
  userId: string,
  entitlement: AccessScope,
  limitSessions = 12,
): Promise<{ correct: number; total: number } | null> {
  if (!entitlement.hasAccess) return null;

  const recentSessions = await prisma.examSession.findMany({
    where: { userId, status: ExamSessionStatus.COMPLETED },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 12,
    select: { questionIds: true, answers: true, updatedAt: true },
  });
  const sessions = recentSessions.slice(0, limitSessions);

  if (sessions.length === 0) return null;

  const baseWhere = questionAccessWhere(entitlement);
  let wCorrect = 0;
  let wTotal = 0;

  for (const s of sessions) {
    const w = sessionWeight(s.updatedAt);
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
      wTotal += w;
      if (answerMatches(q.questionType, q.correctAnswer as Prisma.JsonValue, answers[q.id])) {
        wCorrect += w;
      }
    }
  }

  if (wTotal <= 0) return null;
  return { correct: wCorrect, total: wTotal };
}
