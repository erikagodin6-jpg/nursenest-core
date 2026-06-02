// Maximum number of entries before LRU eviction kicks in.
// Current callers use 2 static admin keys; cap at 256 for safety against future growth.
const MAX_ENTRIES = 256;

type Entry<T> = { value: T; expires: number };

// Map iterates in insertion order — oldest entry is first().
const store = new Map<string, Entry<unknown>>();

function evictExpiredAndOverflow(): void {
  const now = Date.now();
  // Sweep expired entries first (cheap — avoids unnecessary LRU eviction)
  for (const [k, e] of store) {
    if (now > e.expires) store.delete(k);
  }
  // If still over cap, evict oldest by insertion order
  while (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value as string | undefined;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

export function ttlGet<T>(key: string): T | undefined {
  const e = store.get(key) as Entry<T> | undefined;
  if (!e) return undefined;
  if (Date.now() > e.expires) {
    store.delete(key);
    return undefined;
  }
  // LRU refresh: move to end of insertion order by re-setting
  store.delete(key);
  store.set(key, e);
  return e.value;
}

export function ttlSet<T>(key: string, value: T, ttlMs: number): void {
  // Evict before inserting to keep the store bounded
  if (!store.has(key)) evictExpiredAndOverflow();
  store.set(key, { value, expires: Date.now() + ttlMs });
}

/** Current entry count — exposed for diagnostics. */
export function memoryCacheSize(): number {
  return store.size;
}
