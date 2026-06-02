// Maximum number of entries before LRU eviction kicks in.
// Current callers use 2 static admin keys; cap at 256 for safety against future growth.
const MAX_ENTRIES = 256;

type Entry<T> = { value: T; expires: number };

// Map iterates in insertion order — oldest entry is first().
const store = new Map<string, Entry<unknown>>();

// In-process stats — reset on restart, read by admin dashboard
let hits = 0;
let misses = 0;
let evictions = 0;

function evictExpiredAndOverflow(): void {
  const now = Date.now();
  for (const [k, e] of store) {
    if (now > e.expires) { store.delete(k); evictions++; }
  }
  while (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value as string | undefined;
    if (oldest === undefined) break;
    store.delete(oldest);
    evictions++;
  }
}

export function ttlGet<T>(key: string): T | undefined {
  const e = store.get(key) as Entry<T> | undefined;
  if (!e) { misses++; return undefined; }
  if (Date.now() > e.expires) {
    store.delete(key);
    misses++;
    return undefined;
  }
  hits++;
  // LRU refresh: move to end of insertion order by re-setting
  store.delete(key);
  store.set(key, e);
  return e.value;
}

export function ttlSet<T>(key: string, value: T, ttlMs: number): void {
  if (!store.has(key)) evictExpiredAndOverflow();
  store.set(key, { value, expires: Date.now() + ttlMs });
}

/** Current entry count — exposed for diagnostics. */
export function memoryCacheSize(): number {
  return store.size;
}

/** In-process stats snapshot — safe to expose to admin dashboard. */
export type MemoryCacheStats = {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  evictions: number;
  hitRate: string;
};

export function getMemoryCacheStats(): MemoryCacheStats {
  const total = hits + misses;
  return {
    size: store.size,
    maxSize: MAX_ENTRIES,
    hits,
    misses,
    evictions,
    hitRate: total > 0 ? ((hits / total) * 100).toFixed(1) + "%" : "—",
  };
}
