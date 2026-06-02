export type FlashcardsHubKpiLoadState<S, D> = {
  stats: S | null;
  dueSummary: D | null;
  /** `fatal` when both endpoints failed; `partial` when one failed; `none` when both promises settled successfully. */
  loadError: "none" | "partial" | "fatal";
};

/**
 * Reduces settled fetches for `/api/flashcards/stats` + `/api/flashcards/due-summary` without treating
 * network/HTTP failures as “empty stats” (which would show misleading zero KPIs).
 */
export function reduceFlashcardsHubKpiSettled<S, D>(
  statsResult: PromiseSettledResult<S>,
  dueResult: PromiseSettledResult<D>,
): FlashcardsHubKpiLoadState<S, D> {
  const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
  const dueSummary = dueResult.status === "fulfilled" ? dueResult.value : null;
  const statsFailed = statsResult.status === "rejected";
  const dueFailed = dueResult.status === "rejected";
  if (statsFailed && dueFailed) return { stats, dueSummary, loadError: "fatal" };
  if (statsFailed || dueFailed) return { stats, dueSummary, loadError: "partial" };
  return { stats, dueSummary, loadError: "none" };
}
