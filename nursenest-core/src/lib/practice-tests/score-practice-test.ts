import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

export async function computePracticeTestResults(
  questionIds: string[],
  answers: Record<string, unknown>,
  entitlement: AccessScope,
): Promise<PracticeTestResultsJson> {
  const base = questionAccessWhere(entitlement);
  const qs = await prisma.examQuestion.findMany({
    where: { AND: [{ id: { in: questionIds } }, base] },
    select: { id: true, topic: true, questionType: true, correctAnswer: true },
  });
  const byId = new Map(qs.map((q) => [q.id, q]));

  let scoreCorrect = 0;
  const byTopic: Record<string, { correct: number; total: number }> = {};
  const incorrectQuestionIds: string[] = [];

  for (const id of questionIds) {
    const q = byId.get(id);
    if (!q) continue;
    const userAns = answers[id];
    const ok = answerMatches(q.questionType, q.correctAnswer as Prisma.JsonValue, userAns);
    if (ok) scoreCorrect += 1;
    else incorrectQuestionIds.push(id);

    const label = (q.topic?.trim() || "—").slice(0, 120);
    const cur = byTopic[label] ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (ok) cur.correct += 1;
    byTopic[label] = cur;
  }

  const scoreTotal = questionIds.filter((id) => byId.has(id)).length;
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
    ...(incorrectQuestionIds.length > 0 ? { incorrectQuestionIds } : {}),
  };
}
