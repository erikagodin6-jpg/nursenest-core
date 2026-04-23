/**
 * Practice CAT uses shorter runs than full NCLEX simulation (see {@link CAT_MIN_QUESTIONS} in cat-config).
 * Bounds are stored per-test in `PracticeTest.config`.
 */
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

export const CAT_PRACTICE_MIN_QUESTIONS = 10;
export const CAT_PRACTICE_MAX_QUESTIONS_CAP = 75;

export function practiceCatBounds(questionCount: number): { min: number; max: number } {
  const max = Math.min(CAT_PRACTICE_MAX_QUESTIONS_CAP, Math.max(CAT_PRACTICE_MIN_QUESTIONS, questionCount));
  const min = Math.min(max, Math.max(8, Math.min(CAT_PRACTICE_MIN_QUESTIONS, max)));
  return { min, max };
}

/**
 * Guards corrupted configs (e.g. `catMaxQuestions: 1`) that would trigger `max_length` after the first
 * scored item. Keeps min/max coherent and enforces a floor of 2 on max for true adaptive sessions.
 */
export function normalizedAdaptiveCatRunBounds(config: PracticeTestConfigJson): { min: number; max: number } {
  const fb = practiceCatBounds(typeof config.questionCount === "number" ? config.questionCount : 30);
  let min = config.catMinQuestions ?? fb.min;
  let max = config.catMaxQuestions ?? fb.max;
  if (!Number.isFinite(min) || min < 1) min = fb.min;
  if (!Number.isFinite(max) || max < 1) max = fb.max;
  max = Math.max(2, max);
  max = Math.max(max, min);
  min = Math.min(min, max);
  return { min, max };
}
