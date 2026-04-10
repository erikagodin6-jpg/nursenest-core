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

/**
 * CAT-focused weak-area launch inside the signed-in builder.
 * Keeps CAT mode explicit while preserving pathway/topic context when available.
 */
export function appCatWeakFocusPath(pathwayId?: string | null, topic?: string | null): string {
  const q = new URLSearchParams({ cat: "1", focus: "weak" });
  const pathway = pathwayId?.trim();
  if (pathway) q.set("pathwayId", pathway);
  const topicLabel = topic?.trim();
  if (topicLabel) q.set("topic", topicLabel);
  return `/app/practice-tests?${q.toString()}`;
}

export function appPathwayCatWeakFocusPath(pathwayId: string, topic?: string | null): string {
  return appCatWeakFocusPath(pathwayId, topic);
}
