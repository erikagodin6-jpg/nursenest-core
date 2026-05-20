/**
 * Hard timeouts for optional / non-critical server work. Used by {@link safeOptional}.
 * Does not replace entitlement or auth flows — those keep their own contracts.
 */
import { isQueryTimeoutsEnabled } from "@/lib/config/production-safety-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export class TimeoutError extends Error {
  readonly name = "TimeoutError";

  constructor(
    readonly timeoutMs: number,
    readonly label?: string,
  ) {
    super(`Timeout after ${timeoutMs}ms${label ? ` (${label})` : ""}`);
  }
}

export type WithTimeoutOptions = {
  /** Log label (non-PII). */
  label?: string;
  /** Optional upstream signal (caller may abort the underlying work separately). */
  signal?: AbortSignal;
};

/**
 * Race `promise` against a timer. On timeout: log `timeout_triggered` and reject with {@link TimeoutError}.
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, options?: WithTimeoutOptions): Promise<T> {
  if (!isQueryTimeoutsEnabled()) {
    return promise;
  }
  const label = options?.label;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      safeServerLog("with_timeout", "timeout_triggered", {
        label: label ?? "unnamed",
        timeoutMs,
      });
      reject(new TimeoutError(timeoutMs, label));
    }, timeoutMs);
  });

  return Promise.race([
    promise.finally(() => {
      if (timer !== undefined) clearTimeout(timer);
    }),
    timeoutPromise,
  ]);
}
