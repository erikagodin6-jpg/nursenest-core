/**
 * Structured dev/test diagnostics for learner study APIs (flashcards, practice, CAT).
 * Disabled in production unless CORE_API_DIAGNOSTICS=1.
 */

export function coreApiStudyDiagnosticsEnabled(): boolean {
  if (process.env.CORE_API_DIAGNOSTICS === "1") return true;
  const env = process.env.NODE_ENV;
  return env === "development" || env === "test";
}

/** Logs one JSON line to stdout — safe for structured log pipelines; no PII beyond prefixes. */
export function logCoreApiStudyDiagnostic(payload: Record<string, unknown>): void {
  if (!coreApiStudyDiagnosticsEnabled()) return;
  const line = JSON.stringify({
    tag: "core_api_study",
    ts: new Date().toISOString(),
    ...payload,
  });
  console.info(line);
}
