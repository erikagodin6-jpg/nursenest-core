# Self-Healing Study Delivery System
**Generated:** 2026-06-01  
**Scope:** Flashcards, Lessons (Phase 1)

---

## Executive Summary

Users must never see a failure state when study content cannot be loaded. This report maps every current failure path in the flashcard and lesson delivery pipelines, defines the three-tier fallback architecture, and documents the Phase 1 implementation plan.

---

## 1. Current Failure Paths

### 1.1 Flashcard Custom Session (`GET /api/flashcards/custom-session`)

| Failure Mode | Current Behavior | User Impact |
|---|---|---|
| DB query timeout (>4.8s) | Returns `{ok:false, code:"session_timeout"}` → 503 | User sees error, retry button |
| DB connection refused | Returns `{ok:false, code:"database_error"}` → 503 | User sees error, retry button |
| DB slow query (partial) | Returns `{ok:false, code:"database_error"}` → 503 | User sees error, retry button |
| Pool scan returns 0 cards | Returns `{ok:false, code:"empty_flashcard_pool"}` → 404 | User sees "no cards" message |
| Route-level exception | Returns `{ok:false, code:"service_unavailable"}` → 503 | User sees error, retry button |

**Root cause:** `buildFlashcardCustomSession` has no secondary source. If `prisma.flashcard.findMany` or `prisma.flashcardProgress.findMany` fails, the only path is the error branch. The in-memory count-only cache (15s TTL, 2k entries) only covers repeated identical requests — it does not survive a DB outage.

### 1.2 Flashcard List (`GET /api/flashcards`)

| Failure Mode | Current Behavior | User Impact |
|---|---|---|
| DB unavailable | Tries Redis → DB → snapshot | Silent if snapshot present |
| Redis + DB + snapshot all fail | Returns 503 | User sees error |
| DB slow (retry exhausted) | Tries snapshot fallback | Silent if snapshot present |

**Status:** Already has 3-layer fallback (Redis → DB → prebuilt snapshot file). **Covered.**

### 1.3 Lesson List API (`GET /api/lessons`)

| Failure Mode | Current Behavior | User Impact |
|---|---|---|
| Subscriber DB query fails (offset mode) | Returns 503 (`Unable to load lessons`) | User sees error |
| Subscriber DB query fails (cursor mode) | Returns 503 | User sees error |
| Manifest load fails (page > 1) | Falls through to DB → 503 | User sees error |
| Freemium DB query fails | Returns 503 | User sees error |
| Entitlement resolve fails | Returns 503 | User sees error |

**Root cause:** The manifest-first acceleration (`loadWithManifest`) covers page 1 subscriber loads when Redis/snapshot is warm. All other paths fall through to raw Prisma queries with no snapshot fallback in the catch block.

### 1.4 Single Lesson Page (Study Hub)

| Failure Mode | Current Behavior | User Impact |
|---|---|---|
| `loadPublishedPathwayLessonsForStudyFromDb` throws | Exception propagates to page component | Next.js 500 or white screen |
| Lesson not found in DB | Returns empty array → `getLessonBySlug` returns undefined | 404 or blank page |
| In-memory 60s cache is cold + DB down | Throws on next cache miss | Error page |

**Root cause:** `loadPublishedPathwayLessonsForStudyFromDb` has no fallback. The in-memory 60s TTL cache (`flashcard-pool-snapshot.server.ts`) protects against brief instability but not prolonged DB outages.

### 1.5 Practice Tests & CAT (Out of Phase 1 Scope)

Both modules use similar Prisma read patterns. CAT has Redis caching for readiness scores. Neither has snapshot fallback. Addressed in Phase 2.

---

## 2. Backup Path Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Request for Study Content                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────▼──────────────┐
              │   PRIMARY: Live Generation  │
              │   DB query + SRS ordering   │
              │   Timeout: 4.8s / 1.2s      │
              └─────────────┬──────────────┘
                   ok? ─────┘  fail?
                                 │
              ┌──────────────────▼─────────────────┐
              │  SECONDARY: Cached Generation       │
              │  In-memory session cache (3 min)    │
              │  Redis manifest snapshot            │
              │  Prebuilt snapshot files            │
              └──────────────────┬─────────────────┘
                        ok? ─────┘  miss?
                                       │
              ┌────────────────────────▼──────────────┐
              │  TERTIARY: Prebuilt Catalog Snapshot   │
              │  Catalog JSON → derived virtual cards  │
              │  No DB required, always available      │
              │  Lesson titles from content files      │
              └────────────────────────┬──────────────┘
                             ok? ──────┘  empty?
                                              │
                                    (Silent empty state,
                                     never an error UI)
```

### 2.1 Flashcard Custom Session — Three Tiers

| Tier | Source | Data Freshness | Recovery Time |
|---|---|---|---|
| Primary | Live DB (Prisma + SRS) | Real-time + user progress | 200ms–4.8s |
| Secondary | In-memory session response cache | Up to 3 minutes stale | <1ms |
| Tertiary | Catalog JSON → virtual flashcards | Build-time (always fresh) | 5–50ms |

**Key property:** Tertiary catalog cards are derived from lesson content JSON files (always present on disk). They have no user progress context but are always valid study material.

### 2.2 Lesson List — Three Tiers

| Tier | Source | Data Freshness | Recovery Time |
|---|---|---|---|
| Primary | Live DB (`prisma.contentItem`) | Real-time | 100ms–3s |
| Secondary | Redis manifest + snapshot file | Up to 1 hour stale | 1–20ms |
| Tertiary | Catalog JSON lesson titles/slugs | Build-time (always fresh) | 5–30ms |

### 2.3 `loadPublishedPathwayLessonsForStudyFromDb` — Two Tiers

| Tier | Source | Recovery Time |
|---|---|---|
| Primary | `prisma.pathwayLesson.findMany` | 100ms–3s |
| Secondary | `getCatalogPathwayLessonsSync` (catalog JSON) | 5–20ms |

This function backs both the lesson study hub and the flashcard virtual card pool. Adding a catalog fallback here silently heals both downstream consumers.

---

## 3. Storage Requirements

| Asset | Location | Size | Writer | Reader |
|---|---|---|---|---|
| In-memory session cache | Process heap | ~2 MB (500 entries × 4KB avg) | Route handler (on success) | Route handler (on failure) |
| Lesson manifest snapshot | `$STUDY_PUBLISHED_SNAPSHOT_DIR/lessons/manifest-{tier}-{country}.json` | ~50KB | Nightly export job | `loadWithManifest` |
| Flashcard list snapshot | `$STUDY_PUBLISHED_SNAPSHOT_DIR/flashcards/subscriber-list-{tier}-{country}-{locale}.json` | ~200KB | Nightly export job | `readFlashcardsSubscriberListSnapshot` |
| Catalog JSON (catalog.json) | `src/content/pathway-lessons/catalog.json` | ~11.5MB | Content scripts | `getCatalogPathwayLessonsSync` |
| Catalog JSON (np-core) | `src/content/pathway-lessons/np-core-catalog.json` | ~7.2MB | Content scripts | `getCatalogPathwayLessonsSync` |

**Heap budget:** The in-memory session cache adds ~2MB peak. With `CACHE_MAX = 500` and per-entry pruning, this is bounded. The existing 60s lesson pool cache and 15s count-only cache are unaffected.

---

## 4. Recovery Times

| Scenario | Primary → Secondary | Secondary → Tertiary | Total user wait |
|---|---|---|---|
| DB timeout (4.8s) | 4.8s + <1ms | — | ~4.8s (cache hit path ~100ms) |
| DB connection refused | <10ms + <1ms | — | ~10ms |
| Cold cache + DB down | <10ms + 5–50ms | — | ~60ms |
| All sources empty | — | — | Silent empty state |

**Cache warm path:** When secondary session cache hits, user receives prior session in <1ms from cache lookup. This is the dominant path during a DB outage when learners are actively studying (cache populated by recent successful sessions).

---

## 5. Health-Based Engine Selection

The self-healing router uses a passive health signal derived from the last known outcome:

```
enum EngineHealth { HEALTHY, DEGRADED, UNAVAILABLE }

- HEALTHY:     Primary responded within budget last N requests
- DEGRADED:    Primary returned error but secondary/tertiary served successfully
- UNAVAILABLE: All tiers returned empty on last attempt
```

Engine selection is implicit: each tier is tried in order and the first non-empty result wins. No explicit health state machine is required for Phase 1 — the fallback chain itself acts as a health-adaptive router.

Phase 2 will add an explicit `StudyEngineHealthMonitor` that pre-warms tertiary sources when primary error rate exceeds threshold (tracked via structured logs in `safeServerLog`).

---

## 6. Implementation Plan

### Phase 1 — Flashcards and Lessons (Current)

#### 6.1 New Files

| File | Purpose |
|---|---|
| `src/lib/study-content-failover/self-healing-flashcard-session-cache.ts` | In-memory response cache for custom sessions (3-min TTL, 500-entry cap) |
| `src/lib/study-content-failover/build-flashcard-catalog-fallback-session.ts` | Builds a valid session from catalog JSON alone (no DB) |
| `src/lib/study-content-failover/lessons-list-catalog-fallback.ts` | Synthesizes a lesson list from catalog JSON (no DB) |

#### 6.2 Modified Files

| File | Change |
|---|---|
| `src/app/api/flashcards/custom-session/route.ts` | Store successful sessions in cache; on DB failure check cache then catalog fallback |
| `src/lib/learner-study-hub/load-published-pathway-lessons-for-study-from-db.ts` | On Prisma error, fall through to `getCatalogPathwayLessonsSync` |
| `src/app/api/lessons/route.ts` | In subscriber catch block, serve manifest snapshot before returning 503 |

#### 6.3 Invariants Preserved

- User-specific progress data (weakOnly, incorrectOnly) is **not** served from fallback — the fallback omits progress-filtered sessions gracefully (returns all-cards view instead)
- Fallback sessions include `source: "catalog_virtual"` in their summary for internal transparency (not exposed in error UI)
- Snapshot data is never written during a request — only read
- The `ok: false` path is never reached by the user if any fallback tier has cards

### Phase 2 — Practice Tests and CAT (Future)

- Mirror Phase 1 pattern for `/api/questions` and `/api/cat` routes
- Add explicit `StudyEngineHealthMonitor` with pre-warming
- Add snapshot export script for practice test question banks
- Implement circuit-breaker: after 3 consecutive DB failures in 60s, pre-route to secondary for 30s

### Phase 3 — Full Coverage (Future)

- Flashcard progress writes buffered locally and replayed when DB recovers
- Service worker pre-cache for offline study sessions (PWA)
- CDN-edge cached snapshots for global availability

---

## 7. Observability

All fallback transitions emit structured logs via `safeServerLog`:

```typescript
safeServerLog("study_delivery", "self_healing_fallback", {
  surface: "flashcard_custom_session" | "lesson_list" | "lesson_study_hub",
  from_tier: "primary" | "secondary" | "tertiary",
  to_tier: "secondary" | "tertiary" | "empty",
  pathway_id: string,
  tier: string,
  country: string,
  reason: string,   // "db_error" | "timeout" | "cache_miss"
  cards_served: number,
  source: "session_cache" | "catalog_virtual" | "manifest_snapshot",
});
```

This powers the `final_outcome` field already tracked in `critical_study_load_diagnostics` events, enabling PagerDuty alerts when fallback rate exceeds SLA threshold.
