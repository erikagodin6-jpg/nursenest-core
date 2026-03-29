/**
 * Best-effort in-process rate limiter for a single Node instance.
 * Not suitable for multi-instance horizontal scale without a shared store.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

function pruneIfNeeded(): void {
  if (buckets.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
    if (buckets.size <= MAX_KEYS * 0.8) break;
  }
}

export function checkRateLimit(
  key: string,
  opts: { windowMs: number; max: number },
): { ok: boolean; remaining: number } {
  pruneIfNeeded();
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + opts.windowMs };
    buckets.set(key, b);
  }
  if (b.count >= opts.max) {
    return { ok: false, remaining: 0 };
  }
  b.count += 1;
  return { ok: true, remaining: opts.max - b.count };
}
