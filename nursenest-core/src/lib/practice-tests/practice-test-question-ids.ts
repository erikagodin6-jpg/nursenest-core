/**
 * Normalizes persisted `questionIds` JSON arrays at API boundaries.
 * Matches PATCH validation (`questionId` min length 8) so client/server lists cannot diverge silently.
 */
export function normalizePracticeTestQuestionIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length >= 8);
}
