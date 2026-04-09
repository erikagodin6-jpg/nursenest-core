import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildRationaleSectionsFromQuestion } from "@/lib/content-quality/rationale-display";
import {
  answerMatches,
  canonicalCorrectKeysForQuestion,
} from "@/lib/exams/score-session-answers";
import type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";

export type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";

export async function buildCatStudyFeedback(
  questionId: string,
  userAnswer: unknown,
  entitlement: AccessScope,
): Promise<CatStudyFeedbackPayload | null> {
  const base = questionAccessWhere(entitlement);
  const q = await prisma.examQuestion.findFirst({
    where: { AND: [{ id: questionId }, base] },
    select: {
      id: true,
      questionType: true,
      correctAnswer: true,
      rationale: true,
      topic: true,
      subtopic: true,
      correctAnswerExplanation: true,
      clinicalReasoning: true,
      keyTakeaway: true,
      clinicalPearl: true,
      examStrategy: true,
      memoryHook: true,
      clinicalTrap: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
    },
  });
  if (!q) return null;
  const correctAnswer = q.correctAnswer as Prisma.JsonValue;
  const isCorrect = answerMatches(q.questionType, correctAnswer, userAnswer);
  const correctKeys = canonicalCorrectKeysForQuestion(q.questionType, correctAnswer);
  const sections = buildRationaleSectionsFromQuestion({
    rationale: q.rationale,
    correctAnswerExplanation: q.correctAnswerExplanation,
    clinicalReasoning: q.clinicalReasoning,
    keyTakeaway: q.keyTakeaway,
    clinicalPearl: q.clinicalPearl,
    examStrategy: q.examStrategy,
    memoryHook: q.memoryHook,
    clinicalTrap: q.clinicalTrap,
    distractorRationales: q.distractorRationales,
    incorrectAnswerRationale: q.incorrectAnswerRationale,
  });
  return {
    questionId: q.id,
    isCorrect,
    correctKeys,
    sections,
    topic: q.topic,
    subtopic: q.subtopic,
  };
}
