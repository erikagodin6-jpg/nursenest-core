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
