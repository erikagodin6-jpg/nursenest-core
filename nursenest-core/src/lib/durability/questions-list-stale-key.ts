/**
 * Stable cache key for subscriber question-list stale fallback (after entitlement succeeds).
 */
export function subscriberQuestionsListStaleKey(userId: string, searchParams: URLSearchParams): string {
  const entries = [...searchParams.entries()]
    .filter(([k]) => k !== "callbackUrl" && !k.startsWith("_"))
    .sort(([a], [b]) => a.localeCompare(b));
  return `qlist:${userId}:${JSON.stringify(entries)}`;
}
