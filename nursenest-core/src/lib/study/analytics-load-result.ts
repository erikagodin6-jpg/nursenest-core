/**
 * Explicit contracts for learner analytics loaders — no silent catch fallbacks.
 * UI branches on kind: ok | empty | error | degraded.
 */

export type AnalyticsLoadOk<T> = { kind: "ok"; data: T };
export type AnalyticsLoadEmpty = { kind: "empty" };
export type AnalyticsLoadError = { kind: "error"; reason: string };
export type AnalyticsLoadDegraded<T> = { kind: "degraded"; partial: T; reason: string };

export type AnalyticsLoadResult<T> =
  | AnalyticsLoadOk<T>
  | AnalyticsLoadEmpty
  | AnalyticsLoadError
  | AnalyticsLoadDegraded<T>;

export function analyticsOk<T>(data: T): AnalyticsLoadResult<T> {
  return { kind: "ok", data };
}

export function analyticsEmpty(): AnalyticsLoadResult<never> {
  return { kind: "empty" };
}

export function analyticsError<T = never>(reason: string): AnalyticsLoadResult<T> {
  return { kind: "error", reason };
}

export function analyticsDegraded<T>(partial: T, reason: string): AnalyticsLoadResult<T> {
  return { kind: "degraded", partial, reason };
}

/** Prefer ok data, then degraded partial; otherwise null. */
export function analyticsResolvedData<T>(r: AnalyticsLoadResult<T>): T | null {
  if (r.kind === "ok") return r.data;
  if (r.kind === "degraded") return r.partial;
  return null;
}

export function analyticsIsFailure<T>(r: AnalyticsLoadResult<T>): r is AnalyticsLoadError {
  return r.kind === "error";
}

export function analyticsIsDegraded<T>(r: AnalyticsLoadResult<T>): r is AnalyticsLoadDegraded<T> {
  return r.kind === "degraded";
}

/**
 * Wrap a settled server-action Promise: rejections become explicit `{ kind: "error" }`
 * (never silent empty defaults).
 */
export function settleAnalyticsAction<T>(
  segmentId: string,
  settled: PromiseSettledResult<AnalyticsLoadResult<T>>,
): AnalyticsLoadResult<T> {
  if (settled.status === "fulfilled") return settled.value;
  const msg =
    settled.reason instanceof Error ? settled.reason.message : String(settled.reason);
  return analyticsError(`${segmentId}_transport:${msg}`);
}

/** Single-row copy for accuracy + attempt volume (centralizes try/tries wording). */
export function formatAccuracyRow(correct: number, total: number): string {
  if (total <= 0) return "0 tries";
  const pct = Math.round((correct / total) * 100);
  const tries = total === 1 ? "1 try" : `${total} tries`;
  return `${tries} · ${pct}%`;
}

/** Volume-only line (no accuracy), for bars where pct is shown separately. */
export function formatQuestionVolumeRow(total: number): string {
  if (total <= 0) return "0 questions";
  return total === 1 ? "1 question" : `${total} questions`;
}
