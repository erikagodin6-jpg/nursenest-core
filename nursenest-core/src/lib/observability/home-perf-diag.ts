/**
 * Temporary home perf diagnostics — safe in Node and Edge (no `server-only`).
 * @see NN_TRACE_HOME_PERF
 */
export const HOME_PERF_DIAG_VERSION = "2026-04-19-a";

const ENV_KEY = "NN_TRACE_HOME_PERF";

/** BOM-tolerant trim for platform env quirks. */
export function readNnTraceHomePerfEnvRaw(): string | undefined {
  const v = process.env[ENV_KEY];
  if (v === undefined) return undefined;
  return v.replace(/^\uFEFF/, "").trim();
}

/** Runtime check: only the string `true` (case-insensitive) after trim. */
export function isNnTraceHomePerfTrue(): boolean {
  return readNnTraceHomePerfEnvRaw()?.toLowerCase() === "true";
}

/** Structured stderr line; plain-string fallback if JSON or console fails. */
export function emitNnHomePerfDiagLine(payload: Record<string, unknown>): void {
  const line = { ...payload, home_perf_version: HOME_PERF_DIAG_VERSION, wall_ms: Date.now() };
  try {
    console.error(JSON.stringify(line));
  } catch {
    try {
      console.error(
        `nn_home_perf_diag_plain tag=${String(payload.tag)} v=${HOME_PERF_DIAG_VERSION} pid=${typeof process !== "undefined" ? process.pid : "n/a"}`,
      );
    } catch {
      /* absolute last resort */
    }
  }
}
