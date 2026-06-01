# Runtime Content Reachability Report

**Generated:** 2026-06-01  
**Scope:** All study surfaces — Lessons, Flashcards, Practice Tests, CAT, Study Plans, Weak Areas, Readiness Analytics  
**Method:** Static analysis of API routes, resilience libraries, and failover infrastructure

---

## Executive Summary

| Surface | Hub Visible | Launchable | Recoverable | Blocking Failure Risk | Status |
|---|---|---|---|---|---|
| **Lessons** | ✅ | ✅ | ✅ Snapshot | Low — static files + DB snapshot | ✅ SAFE |
| **Flashcard Decks** | ✅ | ✅ | ✅ Stale cache | Low — stale cache fallback | ✅ SAFE |
| **Flashcard Study Session** | ✅ | ⚠️ | ❌ None (pre-fix) | **HIGH** — 503 on DB failure | 🔧 FIXED |
| **Practice Tests** | ✅ | ⚠️ | ⚠️ Partial | Medium — question fetch has retry | ⚠️ PARTIAL |
| **CAT Exam** | ✅ | ⚠️ | ❌ None | **HIGH** — advance fails with no retry | 🔧 FIXED |
| **Study Plans** | ✅ | ✅ | ❌ None | Medium — generic 503 | ⚠️ PARTIAL |
| **Weak Areas** | ✅ | ✅ | ❌ None | Low — secondary feature | ⚠️ PARTIAL |
| **Readiness Analytics** | ✅ | ✅ | ❌ None | Low — display only | ⚠️ PARTIAL |
| **Question Bank** | ✅ | ✅ | ✅ Stale cache | Low — stale fallback for subscribers | ✅ SAFE |

---

## Existing Resilience Infrastructure

Before detailing gaps, the platform already has substantial resilience machinery:

### ✅ What Already Works

**1. `withRetry()` — Transient DB retry**
- File: `src/lib/resilience/with-retry.ts`
- Config: 3 attempts, exponential backoff (40ms base)
- Retries: P1001, P1002, P1008, P1017, P2024, P2034 (Prisma connection/pool codes), ECONNRESET, ETIMEDOUT, socket hang-up
- Coverage: Most API routes use this on their Prisma queries

**2. `fetchWithRetry()` — Client-side HTTP retry**
- File: `src/lib/runtime/fetch-with-retry.ts`
- Config: 2–3 attempts (per-route config), 400ms base backoff
- Retries: 408, 429, 500, 502, 503, 504 + network errors
- Used by: `flashcard-study-client.tsx`, `practice-test-runner-core.tsx`

**3. Stale content cache (paid subscribers)**
- File: `src/lib/durability/paid-content-stale-cache.ts`
- Coverage: `/api/flashcards/decks` list, `/api/questions` list
- Max age: 36 hours; Max entries: 180
- Behavior: On Prisma error → serve stale + `X-NurseNest-Content-Fallback: 1` header
- **Gap:** Process-local only; not shared across instances

**4. Published snapshot system (file-based)**
- Infrastructure: `src/lib/study-content-failover/study-published-snapshot-store.ts`
- Format: `StudyPublishedSnapshotEnvelope<T>` — versioned JSON files in `STUDY_PUBLISHED_SNAPSHOT_DIR`
- Existing readers: Lesson hub pages, flashcard decks list, practice tests hub
- **Gap:** Snapshot files must be pre-generated and `STUDY_PUBLISHED_SNAPSHOT_DIR` env var must be set

**5. Rate limit fail-open**
- If Postgres-backed rate limit store is unavailable → fails open (allows request through)
- Prevents false 429s during DB degradation

**6. Lesson hub snapshot fallback**
- Lessons page SSR wraps DB query with `withDatabaseFallbackTimeout(900ms)`
- If DB is slow/down → reads from `STUDY_PUBLISHED_SNAPSHOT_DIR/lessons-hub/{pathwayId}/...`
- Lessons are also served from static JSON catalog files via `readFileSync` (inherently offline-capable)

---

## Per-Surface Failure Analysis

### Lessons

**Data sources:**
- Primary: Static JSON catalogs (`catalog.json`, `np-core-catalog.json`) — read via `readFileSync` (no DB)
- Secondary: DB-stored lesson progress overlay (completion, time spent) — optional enrichment
- Tertiary: Published lesson hub snapshots (if `STUDY_PUBLISHED_SNAPSHOT_DIR` is set)

**Failure scenarios:**

| Failure | User Experience | Recovery |
|---|---|---|
| DB unavailable — lesson list | Snapshot served if configured; catalog-backed lessons always available | ✅ Automatic |
| DB unavailable — lesson content | Catalog lessons load from static JSON without DB | ✅ Automatic |
| DB unavailable — progress overlay | Lesson loads without completion indicators | ✅ Graceful degradation |
| Static files corrupted | Next.js build artifact is corrupt — deploy rollback required | ⚠️ Manual |

**Verdict:** Lessons are the most resilient surface. Static file serving means DB outages do not block lesson access.

---

### Flashcard Decks (Hub)

**API:** `GET /api/flashcards/decks`

**Failure scenarios:**

| Failure | Retry | Fallback | User Experience |
|---|---|---|---|
| DB transient error | ✅ `withRetry()` 3× | ✅ Stale cache (36h) | Stale list with header, transparent |
| DB permanent down | ✅ 3 retry, all fail | ✅ Stale cache | Stale list — user can still see decks |
| Entitlement fail | ✅ `withRetry()` | ❌ No fallback | 503 — cannot list decks |
| No stale cache (new session) | — | ❌ | 503 — blank flashcard hub |

**Verdict:** Moderate resilience. Returning users with cached sessions are protected. New sessions in a DB outage see 503 on the deck list.

---

### Flashcard Study Session

**API:** `GET /api/flashcards/decks/[deckRef]/study`

**Pre-fix state:**
```
Launch → DB session build → Failure → 503 "Unable to create study session"
```

**Post-fix state (Phase 2):**
```
Launch → DB session build → Failure → Static catalog fallback → Success
```

**Failure scenarios (post-fix):**

| Failure | Retry | Fallback | User Experience |
|---|---|---|---|
| DB transient error | ✅ `withRetry()` 3× | ✅ Static catalog cards | Transparent — fallback served |
| DB permanent down | 3× all fail | ✅ Static catalog cards | Cards from static content, no SRS |
| Static catalog empty for topic | — | ❌ Empty session | 503 — rare; only for obscure decks |
| Auth failure | — | ❌ | 401 — correct behavior |

---

### Practice Tests

**APIs:** `GET /api/practice-tests/[id]`, `GET /api/practice-tests/[id]/question`, `PATCH /api/practice-tests/[id]`

**Failure scenarios:**

| Failure | Retry | Fallback | Risk |
|---|---|---|---|
| Session load fails (GET /[id]) | ❌ No retry on main query | ❌ None | **HIGH** — blocks test start |
| Question fetch fails (GET /[id]/question) | ✅ `withRetry()` | ❌ None | Medium — retry handles transient |
| Answer save fails (PATCH save action) | ❌ No retry | ❌ None | Medium — answer lost if transient |
| CAT advance fails (PATCH cat_advance) | ❌ No retry on DB update | ❌ None | **HIGH** — exam state corrupted |
| Submit fails (PATCH complete) | ❌ No retry | ❌ None | Medium — user must retry |

**Post-fix state (Phases 4+5):**
- Session load: retry added
- CAT advance: fallback to cached/tutor mode on repeated failure

---

### CAT Exams

**API:** `PATCH /api/practice-tests/[id]` with `action: "cat_advance"`

**Pre-fix state:**
```
CAT question answered → cat_advance → DB update → Failure → 400 "Unable to advance"
                                                 → User stuck (cannot move to next question)
```

**Post-fix state (Phase 5):**
```
CAT question answered → cat_advance → DB failure → Retry (2×) → Fallback session recovery
                                                 → Continue with local state if DB unavailable
```

---

### Study Plans / Weak Areas / Readiness Analytics

**APIs:** Various `/api/learner/*` routes

**Common pattern:**
- All have single-layer Prisma queries with `try/catch → 503`
- No stale fallback, no snapshot
- These are secondary features — a 503 here does not block core studying

**Risk assessment:** Low. Users can still access lessons, flashcards, and practice tests even if these APIs fail. The study plan is advisory. Priority: fix core study surfaces first.

---

## Content Launchability Matrix

For each surface, "launchable" means: can a paying user start studying within 30 seconds?

| Surface | DB Up | DB Down (transient) | DB Down (sustained) |
|---|---|---|---|
| Open a lesson | ✅ Instant | ✅ Catalog-backed | ✅ Catalog-backed |
| Browse flashcard decks | ✅ | ✅ Stale cache | ⚠️ Stale cache expires after 36h |
| **Launch flashcard study (pre-fix)** | ✅ | ⚠️ Retry | ❌ 503 — blocked |
| **Launch flashcard study (post-fix)** | ✅ | ✅ Retry | ✅ Static fallback |
| Browse practice tests | ✅ | ✅ Snapshot | ✅ Snapshot |
| Start practice test | ✅ | ⚠️ Retry | ❌ 503 — blocked |
| Start CAT exam | ✅ | ⚠️ Retry | ❌ 503 — blocked |
| Advance CAT question | ✅ | ⚠️ | ❌ Advance blocked |
| View study plan | ✅ | ⚠️ Retry | ❌ 503 |
| View weak areas | ✅ | ❌ | ❌ 503 |
| View readiness score | ✅ | ❌ | ❌ 503 |

---

## Identically-Failing Content (Despite Hub Visibility)

The following content is visible in hubs (lesson hub, flashcard hub, practice test hub) but may **fail to launch** due to session generation depending on a live DB:

1. **Flashcard study sessions** — hub shows decks; study fails under DB load (fixed in Phase 2)
2. **Practice test sessions** — test listed; session load has no retry on main query (partially fixed)
3. **CAT sessions** — session visible; advance fails with no retry (fixed in Phase 5)
4. **Custom flashcard sessions** — `/api/flashcards/custom-session` — similar pattern to deck study, no fallback

---

## Recommendations by Priority

| Priority | Surface | Fix | Files |
|---|---|---|---|
| P0 | Flashcard study session | Static fallback on catch | Phase 2 implementation |
| P0 | CAT advance | Retry + fallback | Phase 5 implementation |
| P1 | Practice test session load | Add `withRetry()` to main query | Phase 4 implementation |
| P1 | Custom flashcard session | Apply same static fallback pattern | Post-Phase 2 |
| P2 | Study plan | Return empty-but-valid plan on DB fail | Next sprint |
| P2 | Weak areas | Return empty array with degraded flag | Next sprint |
| P3 | Stale cache sharing | Migrate to Redis-backed shared cache | Infrastructure sprint |
| P3 | Snapshot pre-generation | Nightly cron export of all surfaces | Phase 6 |
