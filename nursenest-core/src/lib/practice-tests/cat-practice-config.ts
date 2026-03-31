/**
 * Practice CAT uses shorter runs than full NCLEX simulation (see {@link CAT_MIN_QUESTIONS} in cat-config).
 * Bounds are stored per-test in `PracticeTest.config`.
 */
export const CAT_PRACTICE_MIN_QUESTIONS = 10;
export const CAT_PRACTICE_MAX_QUESTIONS_CAP = 75;

export function practiceCatBounds(questionCount: number): { min: number; max: number } {
  const max = Math.min(CAT_PRACTICE_MAX_QUESTIONS_CAP, Math.max(CAT_PRACTICE_MIN_QUESTIONS, questionCount));
  const min = Math.min(max, Math.max(8, Math.min(CAT_PRACTICE_MIN_QUESTIONS, max)));
  return { min, max };
}
