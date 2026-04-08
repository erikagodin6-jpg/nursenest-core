import type { Prisma } from "@prisma/client";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function asStringArray(v: Prisma.JsonValue): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (v === null || v === undefined) return [];
  return [String(v)];
}

/** `exam_questions.question_type` is a free-form string (e.g. multiple_choice, sata). */
function isSataType(questionType: string): boolean {
  const t = questionType.toLowerCase();
  return t === "sata" || t === "select_all_that_apply" || t === "SATA";
}

function userAnswerArray(questionType: string, user: unknown): string[] {
  if (user === null || user === undefined) return [];
  if (isSataType(questionType) && Array.isArray(user)) return user.map((x) => String(x));
  if (typeof user === "string") return [user];
  if (typeof user === "number" || typeof user === "boolean") return [String(user)];
  return [];
}

/** Canonical option key(s) stored on the question row (for UI reveal / highlighting). */
export function canonicalCorrectKeysForQuestion(questionType: string, correctAnswer: Prisma.JsonValue): string[] {
  void questionType;
  return asStringArray(correctAnswer).map((s) => s.trim()).filter(Boolean);
}

/** Compare learner answer to stored `correct_answer` JSON (MCQ / SATA style keys). */
export function answerMatches(questionType: string, correctAnswer: Prisma.JsonValue, user: unknown): boolean {
  const keyParts = asStringArray(correctAnswer).map((s) => s.trim()).filter(Boolean);
  const userParts = userAnswerArray(questionType, user).map((s) => s.trim()).filter(Boolean);
  const a = [...keyParts].sort((x, y) => x.localeCompare(y));
  const b = [...userParts].sort((x, y) => x.localeCompare(y));
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export async function scoreSessionAnswers(
  sessionId: string,
  userId: string,
  examId: string,
  answers: Record<string, unknown>,
  entitlement: AccessScope,
): Promise<{ score: number; total: number } | null> {
  const session = await prisma.examSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return null;
  if (session.examId && session.examId !== examId) return null;

  const sanitized = sanitizeSessionQuestionIds(session.questionIds);
  if (sanitized.coercedFromInvalid || sanitized.truncated) {
    safeServerLog("score_session_answers", "session_question_ids_sanitized", {
      sessionId,
      coercedFromInvalid: sanitized.coercedFromInvalid,
      truncated: sanitized.truncated,
      sourceLength: sanitized.sourceLength,
    });
  }
  const ids = sanitized.ids;
  if (ids.length === 0) return { score: 0, total: 0 };

  const ID_CHUNK = 400;
  const baseWhere = questionAccessWhere(entitlement);
  const qs: { id: string; correctAnswer: Prisma.JsonValue; questionType: string }[] = [];
  for (let i = 0; i < ids.length; i += ID_CHUNK) {
    const chunk = ids.slice(i, i + ID_CHUNK);
    const part = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: chunk } }, baseWhere] },
      select: { id: true, correctAnswer: true, questionType: true },
    });
    qs.push(...part);
  }
  const allowedIds = new Set(qs.map((q) => q.id));
  const dropped = ids.filter((id) => !allowedIds.has(id)).length;
  if (dropped > 0) {
    safeServerLog("score_session_answers", "session_ids_filtered_by_entitlement", {
      sessionId,
      dropped,
      sessionIdCount: ids.length,
      inScopeCount: qs.length,
    });
  }
  const byId = new Map(qs.map((q) => [q.id, q]));

  let score = 0;
  let total = 0;
  for (const id of ids) {
    const q = byId.get(id);
    if (!q) continue;
    total += 1;
    if (answerMatches(q.questionType, q.correctAnswer, answers[q.id])) score += 1;
  }
  return { score, total };
}

/** Per-question topic outcomes for weak-area ledger (same scoping as {@link scoreSessionAnswers}). */
export async function collectSessionTopicOutcomes(
  sessionId: string,
  userId: string,
  examId: string,
  answers: Record<string, unknown>,
  entitlement: AccessScope,
): Promise<{ topic: string; correct: boolean }[] | null> {
  const session = await prisma.examSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return null;
  if (session.examId && session.examId !== examId) return null;

  const sanitized = sanitizeSessionQuestionIds(session.questionIds);
  const ids = sanitized.ids;
  if (ids.length === 0) return [];

  const ID_CHUNK = 400;
  const baseWhere = questionAccessWhere(entitlement);
  const qs: { id: string; correctAnswer: Prisma.JsonValue; questionType: string; topic: string | null }[] = [];
  for (let i = 0; i < ids.length; i += ID_CHUNK) {
    const chunk = ids.slice(i, i + ID_CHUNK);
    const part = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: chunk } }, baseWhere] },
      select: { id: true, correctAnswer: true, questionType: true, topic: true },
    });
    qs.push(...part);
  }
  const allowedIds = new Set(qs.map((q) => q.id));
  const byId = new Map(qs.map((q) => [q.id, q]));

  const out: { topic: string; correct: boolean }[] = [];
  for (const id of ids) {
    const q = byId.get(id);
    if (!q || !allowedIds.has(id)) continue;
    const ok = answerMatches(q.questionType, q.correctAnswer, answers[q.id]);
    out.push({ topic: normalizeTopicLabel(q.topic), correct: ok });
  }
  return out;
}
