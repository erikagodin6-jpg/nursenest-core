/**
 * Opt-in API for aggregated performance summary (`GET /api/performance-summary`).
 * Keeps new surfaces off until explicitly enabled in an environment.
 */
export function isPerformanceSummaryApiEnabled(): boolean {
  return String(process.env.NN_ENABLE_PERFORMANCE_SUMMARY_API ?? "").trim().toLowerCase() === "true";
}
