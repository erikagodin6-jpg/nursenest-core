export type RetryOptions = {
  maxAttempts?: number;
  baseMs?: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Lightweight exponential backoff for transient DB / network flakes. No extra deps.
 */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const maxAttempts = Math.min(5, Math.max(1, opts.maxAttempts ?? 3));
  const baseMs = opts.baseMs ?? 40;
  let last: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (attempt === maxAttempts) break;
      await sleep(baseMs * 2 ** (attempt - 1));
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}
