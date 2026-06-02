/**
 * Wrap non-critical async work so failures never propagate to the learner shell.
 * Entitlements and paywalls must NOT use this — keep those explicit and fail-closed where required.
 */
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { TimeoutError, withTimeout } from "@/lib/server/with-timeout";

export type SafeOptionalOptions = {
  /** Hard stop for the optional dependency (default 2500ms). */
  timeoutMs?: number;
  /** Log label (non-PII). */
  label?: string;
  /** Called when the wrapped function throws or times out (before returning `fallback`). */
  onUsedFallback?: (reason: "throw" | "timeout") => void;
};

const DEFAULT_TIMEOUT_MS = 2500;

/**
 * Runs `fn`, enforcing a timeout. On success, returns the result.
 * On throw or timeout, logs `optional_dependency_failed` and returns `fallback` (never throws).
 */
export async function safeOptional<T>(
  fn: () => Promise<T>,
  fallback: T,
  options?: SafeOptionalOptions,
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const label = options?.label ?? "unnamed";
  const started = Date.now();

  try {
    return await withTimeout(fn(), timeoutMs, { label });
  } catch (e) {
    const durationMs = Date.now() - started;
    const reason = e instanceof TimeoutError ? "timeout" : "throw";
    safeServerLog("safe_optional", "optional_dependency_failed", {
      label,
      durationMs,
      reason,
    });
    options?.onUsedFallback?.(reason);
    return fallback;
  }
}
