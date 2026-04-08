/**
 * Pathway-scoped CAT (adaptive) practice entry points.
 * Delivery uses existing {@link createCatPracticeTestPayload} + `/api/practice-tests` + {@link PracticeTestRunnerClient}.
 */

/** Default max-length cap for `catPresentationMode: "practice"` sessions started from pathway hubs. */
export const PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS = 25;

export function appPathwayCatSessionStartPath(pathwayId: string): string {
  const q = new URLSearchParams({ pathwayId: pathwayId.trim() });
  return `/app/practice-tests/start?${q.toString()}`;
}
