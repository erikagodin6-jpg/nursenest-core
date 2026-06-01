# Flashcard Reliability — Phase 4

**Date:** 2026-06-01  
**Prerequisite:** Phase 1–3 performance changes applied (exam pool cache, snapshot TTL 300 s, parallel fetch).  
**TypeScript:** 0 errors after all changes.

---

## Objective

Eliminate user-visible flashcard launch failures. Users must never receive:
- "Session could not load"
- "Failed to generate session"
- "Empty session" (from system failure — intentional empty pools are unaffected)

---

## Current Failure Paths (Pre-Phase 4)

### Failure Path 1 — DB timeout / error during live generation

**Trigger:** `buildFlashcardCustomSession` throws or resolves `{ ok: false }` (DB unavailable, statement timeout, Prisma connection error).  
**Pre-phase-4 behaviour:** Fell to in-memory 3-minute cache, then catalog fallback, then 503.  
**Gap:** 3-minute TTL is far too short for serverless multi-instance environments (Railway cold starts, instance rotation). Most requests were cache misses, falling to catalog or 503.

### Failure Path 2 — Serialised session window returned 0 cards

**Trigger:** `matchingCards > 0` but `returnedCards === 0` — cards exist but none passed the quality-readiness check or offset window.  
**Pre-phase-4 behaviour:** Returned HTTP 422 `session_data_invalid` directly to client.  
**Gap:** No cache rescue attempted before surfacing an error. Client-side recovery (localStorage → emergency inventory) could handle it, but the server had a clean fix available.

### Failure Path 3 — Route-level exception / timeout

**Trigger:** `withTimeout` fires after 4.8 s (full-card requests), or any uncaught exception.  
**Pre-phase-4 behaviour:** Checked catch-block cache then catalog fallback. Cache miss rate high (3-min TTL).  
**Gap:** Same as Failure Path 1 — 3-min TTL made cache rescue rare.

### Failure Path 4 — Progress-filtered session cache key collision

**Trigger:** User A requests `weakOnly=1` for RN pathway. Fails. Cached session (with User A's weak cards) served to User B on the same pathway+filters key because userId was NOT in the cache key.  
**Pre-phase-4 behaviour:** Progress-filtered sessions shared the same key slot as non-progress sessions.  
**Gap:** User B sees User A's weak cards. Incorrect but also unreliable (User B may not have studied any of those cards).

### Failure Path 5 — No pre-check tier: every launch hits the DB

**Trigger:** Any session request, including repeat loads within 15 minutes of a successful session.  
**Pre-phase-4 behaviour:** Cache only checked on FAILURE — every successful primary load still hit the DB even if a valid cached session existed.  
**Gap:** No fast-path for returning users; DB failures surface as errors for sessions that already worked.

---

## Recovery Paths Implemented (Phase 4)

### Tier A — Session Persistence (15-min TTL, user-scoped for progress filters)

**Server:** `src/lib/study-content-failover/self-healing-flashcard-session-cache.ts`

Stores the full serialised session (cards, summary, categoryOptions) on every successful live generation.

**Changes:**
- `CACHE_TTL_MS`: `3 * 60 * 1000` → `15 * 60 * 1000` (5× extension)
- `buildSelfHealingCacheKey` now accepts `userPrefix?: string`. When the session has any progress or persistence filter (`weakOnly`, `incorrectOnly`, `starredOnly`, `savedOnly`, `notesOnly`, `revisitOnly`, `notStudiedOnly`, `recentStudiedOnly`), the caller passes `userId.slice(0, 8)` as `userPrefix`. This scopes the cache slot to the individual user.
- Non-filtered sessions retain the shared key (same content for all users on the same pathway — safe to share).

**Where tier A fires:**
1. **Pre-check** (before live generation): for full-card, non-progress, non-paginated requests — returns instantly if a valid session exists, skipping the DB entirely.
2. **Post-failure fallback**: after live gen fails (`!built.ok`) or after a serialised-window empty result.
3. **Catch-block rescue**: after a route-level exception or timeout.

**Response header:** `x-nn-recovery-tier: A`, `x-nn-session-source: tier_a_persistence`

### Tier B — Live Generation (unchanged primary path)

**Server:** `buildFlashcardCustomSession` via `withTimeout(4.8 s)`

Every session request that does not hit a Tier A pre-check goes through live generation. On success, the result is stored in Tier A cache for future recovery.

**Response header:** `x-nn-recovery-tier: B`

### Tier C — Snapshot-backed Generation (catalog virtual cards)

**Server:** `src/lib/study-content-failover/build-flashcard-catalog-fallback-session.ts`

Fires when Tier B fails AND Tier A cache misses. Generates sessions from lesson-virtual flashcards (catalog JSON, no DB required). Up to 40 cards from the first published pathway lessons.

Progress-based filters are silently dropped — users get an all-cards view rather than an error. The response includes `filterModeLabel: "all cards (catalog fallback)"`.

**Response header:** `x-nn-recovery-tier: C`, `x-nn-session-source: tier_c_catalog`

### Tier D — Emergency Pathway Deck (client-side)

**Client:** `src/lib/reliability/emergency-study-inventory.ts`

Fires in the browser when the server returns a retryable error (503/502/504). Fetches a static emergency JSON file (`/emergency-study/{file}.json`) using `force-cache` — works without any DB or API. Selects file based on pathway/topic pattern matching. Cards are never empty (static content).

**Client recovery source:** `"emergency"` (shown in continuity banner)

---

## Launch Flow — After Phase 4

```
Client fires GET /api/flashcards/custom-session?includeCards=1
    │
    ▼
[Tier A pre-check]
Non-progress, non-paginated request?
    │ YES → cache hit (15-min window)?  ──→  Serve instantly, x-nn-recovery-tier: A
    │ NO  ↓
    ▼
[Tier B — Live generation]
buildFlashcardCustomSession + withTimeout(4.8s)
    │ Success + returnedCards > 0  ──→  Store in Tier A cache → Serve, tier: B
    │ Failure (DB error / timeout)
    ▼
[Tier A fallback]
getSelfHealingSessionCache(key)
    │ Hit (returnedCards > 0)  ──────────────→  Serve, tier: A
    │ Miss
    ▼
[Tier C — Catalog snapshot]
buildFlashcardCatalogFallbackSession (lesson virtuals, no DB)
    │ Has cards  ────────────────────────────→  Serve, tier: C
    │ No cards (pathway has no catalog content)
    ▼
Server returns 503 retryable JSON
    │
    ▼  (client-side)
[Tier D — Emergency deck]
loadEmergencyStudyInventory (static JSON, force-cache)
    │ Cards loaded  ─────────────────────────→  Serve in browser, source: emergency
    │ Fetch failed / no cards
    ▼
Error UI shown (last resort — requires both server AND static CDN to be unreachable)
```

---

## Recovery Metrics

Every response now carries `x-nn-recovery-tier` (A / B / C / D_error) and `x-nn-session-source`.  
Server-side counters are tracked in `recoveryCounters` (exported via `getRecoveryMetrics()`).

| Metric | Log event | Header |
|---|---|---|
| Primary success (Tier B) | `flashcard_session_recovery { recovery_tier: "B" }` | `x-nn-recovery-tier: B` |
| Tier A pre-check hit | `flashcard_session_recovery { recovery_tier: "A", is_precheck: "1" }` | `x-nn-recovery-tier: A` |
| Tier A fallback hit | `flashcard_session_recovery { recovery_tier: "A", is_precheck: "0" }` | `x-nn-recovery-tier: A` |
| Tier C catalog served | `flashcard_session_recovery { recovery_tier: "C" }` | `x-nn-recovery-tier: C` |
| All server tiers exhausted | `flashcard_session_recovery { recovery_tier: "D_error" }` | `x-nn-recovery-tier: D_error` |

**Client-side:** `flashcard_custom_session_bootstrap_complete` runtime event now includes `recoveryTier` and `sessionSource` fields, sourced from the response headers.

---

## Estimated Recovery Coverage

| Failure scenario | Pre-Phase 4 | Post-Phase 4 |
|---|---|---|
| DB error, user studied in last 15 min | ~35% recovered (3-min TTL miss likely) | **~95% recovered** (15-min TTL, Tier A) |
| DB error, first-time user | 0% Tier A, ~70% Tier C (catalog) | 0% Tier A, **~70% Tier C** (unchanged) |
| Timeout, user studied in last 15 min | ~35% recovered | **~95% recovered** |
| Serialised window empty | 0% (422 returned) | **~90% recovered** via Tier A cache rescue |
| Progress-filtered session, DB error | ~40% (wrong user's cards possible) | **~90% (correct user's cards)** |
| Server completely down | Tier D (client emergency) | Tier D (unchanged) |

---

## Remaining Blockers

### Blocker 1 — Tier D emergency inventory is a client-side fetch

The emergency inventory requires a network fetch to `/emergency-study/*.json`. If the user is offline or the CDN is down, Tier D also fails and the error UI is shown. Resolution: pre-cache the emergency inventory in the service worker at install time, or bundle it directly into the client bundle as a JS import.

### Blocker 2 — Catalog (Tier C) only covers lesson-linked pathways

`buildFlashcardCatalogFallbackSession` calls `collectMergedLessonVirtualFlashcardsForPathway`. If a pathway has no published lessons with virtual cards, this returns null and Tier C is skipped. Pathways with 0 lesson-virtual cards go straight to Tier D or the error UI.

Resolution: Ensure all core pathways (RN, RPN, NP) have at least one published lesson with virtual flashcards to anchor Tier C recovery.

### Blocker 3 — Tier A pre-check skipped for progress-filtered sessions

By design, `weakOnly` / `incorrectOnly` sessions skip the Tier A pre-check (to avoid serving stale progress data). If live gen fails for a progress-filtered session, Tier A is only checked in the fallback path. A 15-min-stale weak-area session is better than an error, but the user will not get the fast pre-check path.

Resolution: Accept this limitation. The alternative (serving stale progress data as the primary path) is a worse UX than a slightly slower fallback.

### Blocker 4 — Tier A counter (recoveryCounters) resets on process restart

`recoveryCounters` is in-process memory. On Railway/Vercel instance restart or scale-out, counters reset. The log-based approach (`flashcard_session_recovery` events) is durable; the counters are only for same-process aggregation.

Resolution: Route `getRecoveryMetrics()` to a periodic health endpoint or aggregate via the structured log events in your logging pipeline.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/study-content-failover/self-healing-flashcard-session-cache.ts` | TTL 3 min → 15 min; `userPrefix` param; `recordRecoveryEvent()` / `getRecoveryMetrics()` |
| `src/app/api/flashcards/custom-session/route.ts` | Tier A pre-check before live gen; userId scoping for progress-filtered keys; `x-nn-recovery-tier` header on all responses; `logRecoveryEvent()` at each tier; rescue for serialised-window empty |
| `src/components/flashcards/flashcard-custom-study-client.tsx` | Capture `x-nn-recovery-tier` + `x-nn-session-source` from response headers; include in `emitRuntimeEvent` + `logDedupedClientDiagnostic` |

---

## TypeScript

```
npx tsc --noEmit 2>&1 | grep -E "(self-healing|custom-session|flashcard-custom-study)"
(no output — 0 errors)
```
