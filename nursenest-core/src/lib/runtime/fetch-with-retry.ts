/**
 * Resilient client-side fetch: bounded retries for transient failures + optional timeout.
 * Does not change server semantics — safe for GET; use POST retry only when idempotent-safe or network-only.
 */

const DEFAULT_RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export type FetchWithRetryOptions = {
  /** Total attempts including the first try (default 3). */
  attempts?: number;
  /** Base backoff in ms; multiplied by attempt index (default 400). */
  baseDelayMs?: number;
  /** Abort the attempt after this many ms (0 = no per-attempt timeout). */
  timeoutMs?: number;
  /** When set, only these HTTP statuses trigger a retry (in addition to network errors). */
  retryStatusCodes?: ReadonlySet<number>;
  /** Extra predicate — e.g. POST only retry when response indicates overload. */
  shouldRetryResponse?: (res: Response) => boolean;
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function retryAfterDelayMs(res: Response): number | null {
  const raw = res.headers.get("Retry-After")?.trim();
  if (!raw) return null;
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(10_000, seconds * 1000);
  const dateMs = Date.parse(raw);
  if (!Number.isFinite(dateMs)) return null;
  return Math.min(10_000, Math.max(0, dateMs - Date.now()));
}

function isTransientFetchFailure(err: unknown, init: RequestInit | undefined): boolean {
  if (init?.signal?.aborted) return false;
  if (err instanceof TypeError) return true;
  /** Matches `Promise.race` timeout in `fetchOneAttempt` — retry; do not retry user AbortError. */
  if (err instanceof DOMException && err.name === "TimeoutError") return true;
  return false;
}

async function fetchOneAttempt(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  timeoutMs: number,
): Promise<Response> {
  if (timeoutMs <= 0) return fetch(input, init);

  // Internal controller so the timeout can cancel the underlying fetch (not just race-discard it).
  const timeoutController = new AbortController();
  const userSignal = (init?.signal ?? undefined) as AbortSignal | undefined;

  let userAbortRelay: (() => void) | undefined;
  if (userSignal) {
    if (userSignal.aborted) throw new DOMException("Aborted", "AbortError");
    userAbortRelay = () => timeoutController.abort(userSignal.reason);
    userSignal.addEventListener("abort", userAbortRelay, { once: true });
  }

  let timerId: number | undefined;
  try {
    return await Promise.race([
      fetch(input, { ...init, signal: timeoutController.signal }),
      new Promise<never>((_, reject) => {
        timerId = window.setTimeout(() => {
          timeoutController.abort();
          reject(new DOMException("The operation timed out.", "TimeoutError"));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timerId !== undefined) window.clearTimeout(timerId);
    if (userSignal && userAbortRelay) userSignal.removeEventListener("abort", userAbortRelay);
  }
}

/**
 * Fetch with retries on network errors and configurable HTTP status codes.
 * Pass the same `init` you would to `fetch` (including `signal` for cancellation).
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  opts: FetchWithRetryOptions = {},
): Promise<Response> {
  const attempts = Math.max(1, Math.min(8, opts.attempts ?? 3));
  const baseDelayMs = opts.baseDelayMs ?? 400;
  const timeoutMs = opts.timeoutMs ?? 0;
  const statusSet = opts.retryStatusCodes ?? DEFAULT_RETRYABLE_STATUS;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetchOneAttempt(input, init, timeoutMs);
      const customRetry = opts.shouldRetryResponse?.(res) === true;
      const statusRetry = !res.ok && statusSet.has(res.status);
      const shouldRetry = res.ok ? false : customRetry || statusRetry;

      if (!shouldRetry) return res;
      if (attempt >= attempts) return res;
      await delay(retryAfterDelayMs(res) ?? baseDelayMs * attempt);
    } catch (err) {
      if (init?.signal?.aborted) throw err;
      if (!isTransientFetchFailure(err, init)) throw err;
      if (attempt >= attempts) throw err;
      await delay(baseDelayMs * attempt);
    }
  }

  throw new Error("fetchWithRetry: exhausted attempts");
}
