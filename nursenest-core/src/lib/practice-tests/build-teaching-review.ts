import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import {
  buildNormalizedTeachingPayload,
  buildTeachingMediaBundle,
  type NormalizedTeachingPayload,
  type TeachingMediaBundle,
} from "@/lib/content-quality/teaching-payload";

const teachingSelect = {
  id: true,
  stem: true,
  questionType: true,
  correctAnswer: true,
  rationale: true,
  correctAnswerExplanation: true,
  clinicalReasoning: true,
  keyTakeaway: true,
  clinicalPearl: true,
  examStrategy: true,
  memoryHook: true,
  clinicalTrap: true,
  distractorRationales: true,
  incorrectAnswerRationale: true,
  topic: true,
  subtopic: true,
  bodySystem: true,
  tags: true,
  images: true,
} as const;

export type PracticeTestTeachingItem = {
  questionId: string;
  stem: string;
  correct: boolean;
  userAnswer: unknown;
  teaching: NormalizedTeachingPayload;
  media: TeachingMediaBundle;
};

export async function buildPracticeTestTeachingReview(
  questionIds: string[],
  answers: Record<string, unknown>,
  entitlement: AccessScope,
): Promise<{ items: PracticeTestTeachingItem[] }> {
  if (questionIds.length === 0) return { items: [] };
  const base = questionAccessWhere(entitlement);
  const rows = await prisma.examQuestion.findMany({
    where: { AND: [{ id: { in: questionIds } }, base] },
    select: teachingSelect,
  });
  const order = new Map(questionIds.map((id, i) => [id, i]));
  const sorted = [...rows].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  const items: PracticeTestTeachingItem[] = [];
  for (const row of sorted) {
    const userAnswer = answers[row.id];
    const correct = answerMatches(row.questionType, row.correctAnswer as Prisma.JsonValue, userAnswer);
    const teaching = buildNormalizedTeachingPayload(row as Parameters<typeof buildNormalizedTeachingPayload>[0]);
    const media = buildTeachingMediaBundle(row as Parameters<typeof buildTeachingMediaBundle>[0]);
    items.push({
      questionId: row.id,
      stem: row.stem,
      correct,
      userAnswer,
      teaching,
      media,
    });
  }
  return { items };
}
