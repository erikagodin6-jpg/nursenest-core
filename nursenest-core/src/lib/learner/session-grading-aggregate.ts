import { ExamSessionStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";

const QUESTION_MAP_CHUNK = 400;

/**
 * Tier/country-scoped graded outcomes from completed exam sessions (same source as weak-topic analysis).
 */
export type SessionGradingAggregate = {
  correct: number;
  total: number;
  sessionCount: number;
};

/** Question row for bank grading (report card tier breakdown + readiness aggregate). */
export type BankGradingQuestionRow = {
  id: string;
  tier: string;
  questionType: string;
  correctAnswer: Prisma.JsonValue;
};

/**
 * One batched load of exam questions for grading (avoids N+1 per session).
 * Use for report card + {@link loadSessionGradingAggregate}.
 */
export async function loadBatchedBankGradingQuestionMap(
  ids: string[],
  entitlement: AccessScope,
): Promise<Map<string, BankGradingQuestionRow>> {
  const baseWhere = questionAccessWhere(entitlement);
  const uniq = [...new Set(ids)].filter(Boolean);
  if (uniq.length === 0) return new Map();
  const map = new Map<string, BankGradingQuestionRow>();
  for (let i = 0; i < uniq.length; i += QUESTION_MAP_CHUNK) {
    const chunk = uniq.slice(i, i + QUESTION_MAP_CHUNK);
    const rows = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: chunk } }, baseWhere] },
      select: { id: true, tier: true, questionType: true, correctAnswer: true },
    });
    for (const r of rows) map.set(r.id, r);
  }
  return map;
}

function gradeOneSessionCounts(
  questionIds: unknown,
  answers: unknown,
  qById: Map<string, Pick<BankGradingQuestionRow, "questionType" | "correctAnswer"> & { id: string }>,
): { correct: number; total: number } {
  const sanitized = sanitizeSessionQuestionIds(questionIds);
  const ids = sanitized.ids;
  const ans =
    typeof answers === "object" && answers !== null && !Array.isArray(answers)
      ? (answers as Record<string, unknown>)
      : {};
  let correct = 0;
  let total = 0;
  for (const id of ids) {
    const q = qById.get(id);
    if (!q) continue;
    total += 1;
    if (answerMatches(q.questionType, q.correctAnswer, ans[id])) correct += 1;
  }
  return { correct, total };
}

/**
 * Per-session bank grading with tier buckets (report card question-tier section).
 */
export function gradeBankSessionWithTierBreakdown(
  questionIds: unknown,
  answers: unknown,
  qById: Map<string, BankGradingQuestionRow>,
): { correct: number; total: number; byTier: Map<string, { c: number; t: number }> } {
  const sanitized = sanitizeSessionQuestionIds(questionIds);
  const ids = sanitized.ids;
  const ans =
    typeof answers === "object" && answers !== null && !Array.isArray(answers)
      ? (answers as Record<string, unknown>)
      : {};
  let correct = 0;
  let total = 0;
  const byTier = new Map<string, { c: number; t: number }>();
  for (const id of ids) {
    const q = qById.get(id);
    if (!q) continue;
    total += 1;
    const ok = answerMatches(q.questionType, q.correctAnswer, ans[id]);
    if (ok) correct += 1;
    const tier = q.tier?.trim() || "UNKNOWN";
    const cur = byTier.get(tier) ?? { c: 0, t: 0 };
    cur.t += 1;
    if (ok) cur.c += 1;
    byTier.set(tier, cur);
  }
  return { correct, total, byTier };
}

/**
 * Same grading rules as legacy per-session queries, using one shared question map.
 */
export function aggregateSessionGradingFromHydratedSessions(
  sessions: Array<{ questionIds: unknown; answers: unknown }>,
  qById: Map<string, BankGradingQuestionRow>,
): SessionGradingAggregate {
  let correct = 0;
  let total = 0;
  for (const s of sessions) {
    const g = gradeOneSessionCounts(s.questionIds, s.answers, qById);
    correct += g.correct;
    total += g.total;
  }
  return { correct, total, sessionCount: sessions.length };
}

/**
 * Aggregates correct/total across recent completed sessions (in-scope questions only).
 * Uses a single batched question map — no N+1 `examQuestion.findMany` per session.
 */
export async function loadSessionGradingAggregate(
  userId: string,
  entitlement: AccessScope,
  limitSessions = 8,
): Promise<SessionGradingAggregate> {
  if (!entitlement.hasAccess) {
    return { correct: 0, total: 0, sessionCount: 0 };
  }

  const recentSessions = await prisma.examSession.findMany({
    where: { userId, status: ExamSessionStatus.COMPLETED },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 12,
    select: { questionIds: true, answers: true },
  });
  const sessions = recentSessions.slice(0, limitSessions);

  if (sessions.length === 0) {
    return { correct: 0, total: 0, sessionCount: 0 };
  }

  const allIds: string[] = [];
  for (const s of sessions) {
    allIds.push(...sanitizeSessionQuestionIds(s.questionIds).ids);
  }
  const qById = await loadBatchedBankGradingQuestionMap(allIds, entitlement);
  return aggregateSessionGradingFromHydratedSessions(sessions, qById);
}
