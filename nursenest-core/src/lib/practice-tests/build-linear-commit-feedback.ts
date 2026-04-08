import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  answerMatches,
  canonicalCorrectKeysForQuestion,
} from "@/lib/exams/score-session-answers";

export type LinearCommitFeedbackJson = {
  isCorrect: boolean;
  rationale: string | null;
  correctKeys: string[];
};

export async function buildLinearCommitFeedback(
  questionId: string,
  userAnswer: unknown,
  entitlement: AccessScope,
): Promise<LinearCommitFeedbackJson | null> {
  const base = questionAccessWhere(entitlement);
  const q = await prisma.examQuestion.findFirst({
    where: { AND: [{ id: questionId }, base] },
    select: { questionType: true, correctAnswer: true, rationale: true },
  });
  if (!q) return null;
  const correctAnswer = q.correctAnswer as Prisma.JsonValue;
  const isCorrect = answerMatches(q.questionType, correctAnswer, userAnswer);
  const correctKeys = canonicalCorrectKeysForQuestion(q.questionType, correctAnswer);
  const rationale = typeof q.rationale === "string" && q.rationale.trim().length > 0 ? q.rationale.trim() : null;
  return { isCorrect, rationale, correctKeys };
}
