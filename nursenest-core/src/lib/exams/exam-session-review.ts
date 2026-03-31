import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";

export type ExamReviewJson = {
  scoreCorrect: number;
  scoreTotal: number;
  accuracyPct: number;
  byTopic: Record<string, { correct: number; total: number }>;
  weakAreas: string[];
  items: { questionId: string; topic: string; correct: boolean }[];
  timedMode: boolean;
  timeLimitSec: number | null;
  elapsedMs: number | null;
};

export async function buildExamSessionReview(
  sessionId: string,
  userId: string,
  examId: string,
  answers: Record<string, unknown>,
  entitlement: AccessScope,
  timing: { timedMode: boolean; timeLimitSec: number | null; elapsedMs: number | null },
): Promise<ExamReviewJson | null> {
  const session = await prisma.examSession.findFirst({
    where: { id: sessionId, userId },
    select: { examId: true, questionIds: true },
  });
  if (!session) return null;
  if (session.examId && session.examId !== examId) return null;

  const sanitized = sanitizeSessionQuestionIds(session.questionIds);
  const ids = sanitized.ids;
  if (ids.length === 0) {
    return {
      scoreCorrect: 0,
      scoreTotal: 0,
      accuracyPct: 0,
      byTopic: {},
      weakAreas: [],
      items: [],
      timedMode: timing.timedMode,
      timeLimitSec: timing.timeLimitSec,
      elapsedMs: timing.elapsedMs,
    };
  }

  const base = questionAccessWhere(entitlement);
  const qs = await prisma.examQuestion.findMany({
    where: { AND: [{ id: { in: ids } }, base] },
    select: { id: true, topic: true, questionType: true, correctAnswer: true },
  });
  const byId = new Map(qs.map((q) => [q.id, q]));

  let scoreCorrect = 0;
  const byTopic: Record<string, { correct: number; total: number }> = {};
  const items: { questionId: string; topic: string; correct: boolean }[] = [];

  for (const id of ids) {
    const q = byId.get(id);
    if (!q) continue;
    const userAns = answers[id];
    const ok = answerMatches(q.questionType, q.correctAnswer as Prisma.JsonValue, userAns);
    if (ok) scoreCorrect += 1;

    const label = normalizeTopicLabel(q.topic);
    const cur = byTopic[label] ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (ok) cur.correct += 1;
    byTopic[label] = cur;
    items.push({ questionId: id, topic: label, correct: ok });
  }

  const scoreTotal = items.length;
  const accuracyPct = scoreTotal > 0 ? Math.round((scoreCorrect / scoreTotal) * 100) : 0;

  const weakAreas: string[] = [];
  for (const [topic, { correct, total }] of Object.entries(byTopic)) {
    if (total === 0) continue;
    if (correct < total) weakAreas.push(topic);
  }
  weakAreas.sort((a, b) => {
    const ra = byTopic[a]!;
    const rb = byTopic[b]!;
    return ra.correct / ra.total - rb.correct / rb.total;
  });

  return {
    scoreCorrect,
    scoreTotal,
    accuracyPct,
    byTopic,
    weakAreas: [...new Set(weakAreas)].slice(0, 12),
    items,
    timedMode: timing.timedMode,
    timeLimitSec: timing.timeLimitSec,
    elapsedMs: timing.elapsedMs,
  };
}
