type Entry<T> = { value: T; expires: number };

const store = new Map<string, Entry<unknown>>();

export function ttlGet<T>(key: string): T | undefined {
  const e = store.get(key) as Entry<T> | undefined;
  if (!e) return undefined;
  if (Date.now() > e.expires) {
    store.delete(key);
    return undefined;
  }
  return e.value;
}

export function ttlSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expires: Date.now() + ttlMs });
}
