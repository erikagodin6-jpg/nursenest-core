/**
 * Process-local last-known-good cache for **content payloads only** (never entitlements).
 * Not shared across instances — a given user may miss a stale fallback if rerouted to another instance;
 * correctness does not depend on this cache (only resilience / fewer errors during partial outages).
 */

type StaleEntry<T> = { value: T; storedAt: number };

const DEFAULT_MAX_ENTRIES = 180;
const DEFAULT_MAX_AGE_MS = 36 * 60 * 60 * 1000;

export class PaidContentStaleCache {
  private readonly maxEntries: number;
  private readonly maxAgeMs: number;
  private readonly map = new Map<string, StaleEntry<unknown>>();

  constructor(opts?: { maxEntries?: number; maxAgeMs?: number }) {
    this.maxEntries = opts?.maxEntries ?? DEFAULT_MAX_ENTRIES;
    this.maxAgeMs = opts?.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
  }

  get<T>(key: string): T | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (Date.now() - e.storedAt > this.maxAgeMs) {
      this.map.delete(key);
      return undefined;
    }
    return e.value as T;
  }

  set<T>(key: string, value: T): void {
    if (this.map.size >= this.maxEntries && !this.map.has(key)) {
      const first = this.map.keys().next().value as string | undefined;
      if (first) this.map.delete(first);
    }
    this.map.set(key, { value, storedAt: Date.now() });
  }
}

const GLOBAL_KEY = "__nnPaidContentStaleCache";

export function getPaidContentStaleCache(): PaidContentStaleCache {
  const g = globalThis as unknown as { [GLOBAL_KEY]?: PaidContentStaleCache };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new PaidContentStaleCache();
  }
  return g[GLOBAL_KEY]!;
}
