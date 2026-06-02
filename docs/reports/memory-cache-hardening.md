# Memory Cache Hardening Report

**Generated:** 2026-06-01  
**File modified:** `src/lib/cache/memory-cache.ts`

---

## Problem

`memory-cache.ts` used an unbounded `Map` with no maximum size:

```typescript
// BEFORE — no cap, no LRU, no eviction
const store = new Map<string, Entry<unknown>>();

export function ttlSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expires: Date.now() + ttlMs });
  // ← no eviction, no size check
}
```

Any caller writing many distinct keys would grow this `Map` without bound until process restart.

---

## Audit: Current Key Patterns

Two call sites exist in the codebase:

| File | Key | TTL | Cardinality |
|------|-----|-----|-------------|
| `src/app/api/admin/insights/route.ts` | `"admin:insights:v2"` | 60 s | 1 (static) |
| `src/app/api/admin/stats/route.ts` | `"admin:stats:v1"` | 60 s | 1 (static) |

**Current maximum store size: 2 keys.** The unbounded `Map` is not currently causing memory growth. However, the module is a shared utility — future callers could introduce per-user or per-request keys without realizing the store is unbounded.

---

## Growth Risk Assessment

**Current risk: Low.** Both callers use static string keys.  
**Future risk: Medium.** The module exports `ttlSet` with no documented size contract. A future caller using keys like `user:{userId}:session:{id}` on a busy server could accumulate thousands of entries.

---

## Fix: Bounded LRU with TTL Eviction

```typescript
const MAX_ENTRIES = 256;   // Configurable by changing this constant

export function ttlSet<T>(key: string, value: T, ttlMs: number): void {
  if (!store.has(key)) evictExpiredAndOverflow();
  store.set(key, { value, expires: Date.now() + ttlMs });
}
```

### Eviction Strategy

**Two-stage eviction in `evictExpiredAndOverflow()`:**

1. **Sweep expired entries** — remove all entries whose TTL has lapsed. This is O(n) but cheap in practice since the store has at most 256 entries and is only called on writes.
2. **LRU overflow eviction** — if the store is still at or above `MAX_ENTRIES` after expired removal, delete the oldest entry (Map insertion-order iteration).

**LRU refresh on read:** `ttlGet` moves a cache hit to the end of the insertion order (delete + re-set) so frequently-read entries are not evicted first.

### Memory Bound

```
256 entries × ~1 KB average value = ~256 KB worst case
```

At the current 2-key usage, memory impact is negligible. The cap exists to protect against future misuse.

### Diagnostics

Added `memoryCacheSize()` export for observability:

```typescript
export function memoryCacheSize(): number {
  return store.size;
}
```

This can be polled by admin health endpoints or included in startup diagnostics without exposing cache contents.

---

## Before / After Behavior

| Behavior | Before | After |
|---------|--------|-------|
| Maximum entries | Unbounded | 256 |
| TTL expiry on read | ✅ (existing) | ✅ (preserved) |
| TTL expiry sweep on write | ❌ | ✅ |
| LRU eviction | ❌ | ✅ |
| LRU refresh on hit | ❌ | ✅ |
| Memory leak on key growth | **Yes** | No |
| Existing callers affected | N/A | None — both use static keys |

---

## No Behavioral Changes for Existing Callers

- `admin:insights:v2` and `admin:stats:v1` are static keys that will never be evicted by LRU (only one entry per key; LRU only evicts when `size >= MAX_ENTRIES`)
- TTL behavior is identical — reads still return `undefined` for expired entries
- Write semantics are identical — only the pre-write eviction pass is new
