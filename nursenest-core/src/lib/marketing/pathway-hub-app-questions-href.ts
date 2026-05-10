/**
 * Shared deep-link shape for “open question bank in app” from marketing pathway lesson hubs.
 * Pathway-specific **copy and CTAs** stay in each hub; this only standardizes the query string.
 *
 * Does not apply `loginWithCallback` — hubs that need a login redirect wrap the result themselves
 * (e.g. {@link loginWithCallback} in grouped hub).
 */
export function pathwayHubAppQuestionsHref(pathwayId: string, topic?: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  if (topic && topic.trim()) q.set("topic", topic.trim());
  return `/app/questions?${q.toString()}`;
}

/** Tier-scoped learner flashcards hub — mirrors {@link pathwayHubAppQuestionsHref} query shape. */
export function pathwayHubAppFlashcardsHref(pathwayId: string, topicCode?: string | null): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  if (topicCode?.trim()) q.set("topicCode", topicCode.trim().toLowerCase());
  return `/app/flashcards?${q.toString()}`;
}

/** Tier-scoped practice tests hub — same `pathwayId` contract as flashcards / question bank. */
export function pathwayHubAppPracticeTestsHref(pathwayId: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  return `/app/practice-tests?${q.toString()}`;
}

/** Weak-topic flashcard hub — pathway-scoped like other marketing deep links. */
export function pathwayHubAppWeakAreasFlashcardsHref(pathwayId: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  return `/app/flashcards/weak-areas?${q.toString()}`;
}

/**
 * Question bank launcher with pathway context + mixed preset (parity with marketing exam-hub CTAs).
 */
export function pathwayHubAppQuestionsPathwayMixedHref(pathwayId: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("preset", "pathway_mixed");
  return `/app/questions?${q.toString()}`;
}
