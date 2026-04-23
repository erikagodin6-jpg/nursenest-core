/**
 * Whether the learner's current answer value selects a given canonical option key.
 * Matches CAT / linear / legacy MCQ + SATA conventions (`string` vs `string[]`).
 */
export function mcqAnswerSelectsCanonical(answer: unknown, canonical: string): boolean {
  if (answer === undefined || answer === null) return false;
  if (Array.isArray(answer)) return answer.includes(canonical);
  return answer === canonical;
}
