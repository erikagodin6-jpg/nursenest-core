import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  answerMatches,
  canonicalCorrectKeysForQuestion,
} from "@/lib/exams/score-session-answers";
import { resolveRationaleLessonLinksForQuestion } from "@/lib/learner/rationale-lesson-link-resolve";

export type LinearCommitFeedbackJson = {
  isCorrect: boolean;
  rationale: string | null;
  correctKeys: string[];
  /** Preferred explanation of why the correct answer is right; falls back to rationale. */
  correctAnswerExplanation: string | null;
  /**
   * Per-option distractor explanations keyed by canonical option key.
   * Parsed from `distractorRationales` (or `incorrectAnswerRationale` as fallback).
   */
  distractorRationalesMap: Record<string, string> | null;
  /** Short key takeaway (1–2 sentences). Null when absent. */
  keyTakeaway: string | null;
  /** Resolved lesson links for the question's topic (0–4 items). */
  relatedLessons: { title: string; href: string }[];
};

/**
 * Parse `distractorRationales` (or `incorrectAnswerRationale`) into a
 * `Record<optionKey, explanation>` map for the UI.
 *
 * Supports: Record<string, string>, Array<{label, text}>, plain string (ignored).
 */
function parseDistractorRationalesMap(raw: unknown): Record<string, string> | null {
  if (raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" && v.trim()) result[k] = v.trim();
    }
    return Object.keys(result).length > 0 ? result : null;
  }
  if (Array.isArray(raw)) {
    const result: Record<string, string> = {};
    for (const x of raw) {
      if (x && typeof x === "object" && "label" in x && "text" in x) {
        const label = String((x as { label?: string }).label ?? "").trim();
        const text = String((x as { text?: string }).text ?? "").trim();
        if (label && text) result[label] = text;
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  }
  return null;
}

export async function buildLinearCommitFeedback(
  questionId: string,
  userAnswer: unknown,
  entitlement: AccessScope,
  pathwayId: string | null = null,
): Promise<LinearCommitFeedbackJson | null> {
  const base = questionAccessWhere(entitlement);
  const q = await prisma.examQuestion.findFirst({
    where: { AND: [{ id: questionId }, base] },
    select: {
      questionType: true,
      correctAnswer: true,
      rationale: true,
      correctAnswerExplanation: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
      keyTakeaway: true,
      topic: true,
      subtopic: true,
      bodySystem: true,
      tags: true,
    },
  });
  if (!q) return null;

  const correctAnswer = q.correctAnswer as Prisma.JsonValue;
  const isCorrect = answerMatches(q.questionType, correctAnswer, userAnswer);
  const correctKeys = canonicalCorrectKeysForQuestion(q.questionType, correctAnswer);

  const rationale =
    typeof q.rationale === "string" && q.rationale.trim().length > 0
      ? q.rationale.trim()
      : null;
  const correctAnswerExplanation =
    typeof q.correctAnswerExplanation === "string" && q.correctAnswerExplanation.trim().length > 0
      ? q.correctAnswerExplanation.trim()
      : null;
  const distractorRationalesMap =
    parseDistractorRationalesMap(q.distractorRationales) ??
    parseDistractorRationalesMap(q.incorrectAnswerRationale);
  const keyTakeaway =
    typeof q.keyTakeaway === "string" && q.keyTakeaway.trim().length > 0
      ? q.keyTakeaway.trim()
      : null;

  // Resolve lesson links — non-critical; silently falls back to empty array
  let relatedLessons: { title: string; href: string }[] = [];
  try {
    const links = await resolveRationaleLessonLinksForQuestion(prisma, {
      pathwayId,
      topic: q.topic,
      subtopic: q.subtopic,
      bodySystem: q.bodySystem,
      tags: q.tags,
    });
    relatedLessons = links.slice(0, 4).map((l) => ({ title: l.title, href: l.href }));
  } catch {
    // non-critical — lesson links degrade gracefully
  }

  return {
    isCorrect,
    rationale,
    correctKeys,
    correctAnswerExplanation,
    distractorRationalesMap,
    keyTakeaway,
    relatedLessons,
  };
}
