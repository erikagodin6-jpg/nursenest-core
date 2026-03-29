export class BoundedMap<K, V> {
  private readonly map = new Map<K, { value: V; accessedAt: number; createdAt: number }>();
  private readonly maxSize: number;
  private readonly ttlMs: number | null;

  constructor(maxSize: number, ttlMs?: number) {
    this.maxSize = Math.max(1, Number(maxSize) || 1);
    this.ttlMs = typeof ttlMs === "number" && ttlMs > 0 ? ttlMs : null;
  }

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    if (this.isExpired(entry)) {
      this.map.delete(key);
      return undefined;
    }

    entry.accessedAt = Date.now();
    return entry.value;
  }

  set(key: K, value: V): this {
    const now = Date.now();
    const existing = this.map.get(key);

    if (existing) {
      existing.value = value;
      existing.accessedAt = now;
      return this;
    }

    this.pruneExpired();

    if (this.map.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    this.map.set(key, {
      value,
      accessedAt: now,
      createdAt: now,
    });

    return this;
  }

  has(key: K): boolean {
    const entry = this.map.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.map.delete(key);
      return false;
    }

    return true;
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    this.pruneExpired();
    return this.map.size;
  }

  values(): V[] {
    this.pruneExpired();
    return Array.from(this.map.values(), entry => entry.value);
  }

  keys(): K[] {
    this.pruneExpired();
    return Array.from(this.map.keys());
  }

  entries(): [K, V][] {
    this.pruneExpired();
    return Array.from(this.map.entries(), ([key, entry]) => [key, entry.value]);
  }

  forEach(fn: (value: V, key: K) => void): void {
    this.pruneExpired();
    for (const [key, entry] of this.map.entries()) {
      fn(entry.value, key);
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    this.pruneExpired();

    const snapshot = this.entries();
    let index = 0;

    return {
      next(): IteratorResult<[K, V]> {
        if (index < snapshot.length) {
          return {
            value: snapshot[index++],
            done: false,
          };
        }

        return {
          value: undefined as never,
          done: true,
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }

  prune(): number {
    return this.pruneExpired();
  }

  private isExpired(entry: { value: V; accessedAt: number; createdAt: number }): boolean {
    return this.ttlMs !== null && Date.now() - entry.createdAt > this.ttlMs;
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey: K | undefined;
    let oldestAccessedAt = Infinity;

    for (const [key, entry] of this.map.entries()) {
      if (this.isExpired(entry)) {
        this.map.delete(key);
        return;
      }

      if (entry.accessedAt < oldestAccessedAt) {
        oldestAccessedAt = entry.accessedAt;
        oldestKey = key;
      }
    }

    if (oldestKey !== undefined) {
      this.map.delete(oldestKey);
    }
  }

  private pruneExpired(): number {
    if (this.ttlMs === null) return 0;

    let pruned = 0;
    const now = Date.now();

    for (const [key, entry] of this.map.entries()) {
      if (now - entry.createdAt > this.ttlMs) {
        this.map.delete(key);
        pruned++;
      }
    }

    return pruned;
  }
}