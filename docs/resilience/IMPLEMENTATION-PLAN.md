# NurseNest Resilience Architecture — Implementation Plan

> **Status:** Pre-implementation planning document. No production code has been modified.
> **Generated:** 2026-05-28
> **Scope:** Lessons, Flashcards, Practice Questions, CAT Exams

---

## 1. Current State Assessment

### What Already Exists

The codebase has a solid resilience foundation that this plan builds on — not replaces.

| Capability | File(s) | Status |
|---|---|---|
| Exponential backoff retry | `src/lib/resilience/with-retry.ts` | ✅ Production |
| Circuit breaker | `src/server/resilience/index.ts` | ✅ Production |
| Snapshot read layer | `src/lib/study-content-failover/` | ✅ Production (read-only) |
| Flashcard snapshot failover | `src/app/api/flashcards/route.ts` | ✅ Wired |
| Lesson hub snapshot failover | `src/lib/study-content-failover/pathway-lessons-hub-snapshot-read.ts` | ✅ Read-side |
| Practice exam snapshot failover | `src/lib/study-content-failover/practice-exams-published-snapshot-read.ts` | ✅ Read-side |
| Structured failover telemetry | `critical_study_load_diagnostics` events | ✅ Production |
| Error boundaries (client) | `src/app/error.tsx`, `src/app/global-error.tsx` | ✅ Production |
| DB availability check | `isDatabaseUrlConfigured()` | ✅ Production |
| Redis env var recognition | `UPSTASH_REDIS_REST_URL`, `REDIS_URL` | ✅ Recognized, not wired for content |
| Sentry error tracking | `src/lib/observability/sentry-server-context.ts` | ✅ Production |
| PostHog analytics | `src/lib/observability/api-route-telemetry.ts` | ✅ Production |
| OpenTelemetry APM | `instrumentation.ts` | ✅ Production |

### What Is Missing

| Capability | Gap | Priority |
|---|---|---|
| Redis content cache | Redis installed, not wired for content caching | High |
| Snapshot write/generation scripts | Read side exists, no nightly generation | High |
| Questions snapshot (by pathway + topic) | Not implemented | High |
| CAT resilience pool generation | Not implemented | High |
| CAT resilience mode UI + banner | Not implemented | High |
| Service worker (offline mode) | Not implemented | Medium |
| IndexedDB local progress queue | Not implemented | Medium |
| Admin resilience metrics dashboard | Not implemented | Medium |
| Client-side fetch fallback hooks | Not implemented | Medium |
| Snapshot freshness staleness alerts | Not implemented | Low |

---

## 2. What We Are Building

### Layer 2 — Redis Content Cache

A thin read-through cache between the API routes and Prisma. When a query succeeds, the result is cached in Redis. On next request, Redis is checked first. On DB failure, cache is the first fallback before snapshots.

**New files:**
```
src/lib/cache/redis-content-cache.ts          — client init + get/set/del helpers
src/lib/cache/content-cache-keys.ts           — canonical key builders (lesson:{id}, etc.)
src/lib/cache/content-cache-middleware.ts     — read-through wrapper for API queries
```

**Modified files:**
```
src/app/api/flashcards/route.ts               — add Redis read-through
src/app/api/lessons/route.ts                  — add Redis read-through
src/app/api/questions/route.ts                — add Redis read-through
src/app/api/cat/[sessionId]/route.ts          — add Redis read-through
```

**Failover order after this change:**
```
Request → Redis (< 100ms) → PostgreSQL → Snapshot → 503
```

### Layer 3 — Snapshot Generation Scripts

Nightly cron scripts that export published content to static JSON files, written to `STUDY_PUBLISHED_SNAPSHOT_DIR`. The existing read layer already knows how to consume these files.

**New files:**
```
scripts/snapshots/generate-flashcard-snapshots.ts    — per-tier/locale flashcard lists
scripts/snapshots/generate-lesson-snapshots.ts       — per-pathway lesson hubs
scripts/snapshots/generate-question-snapshots.ts     — per-pathway/topic question packs
scripts/snapshots/generate-cat-pools.ts              — RN/RPN/NP resilience CAT pools A/B/C
scripts/snapshots/generate-all-snapshots.ts          — orchestrator (runs all above)
```

**Cron trigger:** Add to `src/app/api/cron/` route, protected by `CRON_SECRET`.

### CAT Resilience Mode

When the CAT engine or DB is unavailable mid-exam, automatically switch to a pre-built question pool. The learner still completes a full exam, receives a score and analytics.

**New files:**
```
src/lib/cat/resilience-cat-pool.ts            — pool selector (RN-A/B/C, RPN-A/B/C, NP-A/B/C)
src/lib/cat/resilience-cat-scoring.ts         — fixed-difficulty scoring for static pools
src/components/exam/cat-resilience-banner.tsx — "Resilience mode" notice (internal)
```

**Modified files:**
```
src/lib/cat/cat-engine.ts                     — catch engine errors, switch to resilience pool
src/app/api/cat/                              — return `mode: "resilience"` flag in response
```

### Offline Study Mode — Service Worker

Caches lessons, flashcards, and practice questions for offline study. Progress is stored in IndexedDB and synced when connection is restored.

**New files:**
```
public/sw.js                                  — service worker (pre-cache + network-first + fallback)
src/lib/offline/sw-registration.ts            — register/update service worker
src/lib/offline/offline-progress-queue.ts     — IndexedDB wrapper for queued progress
src/lib/offline/sync-progress.ts              — sync queued records to API on reconnect
src/components/offline/offline-banner.tsx     — "Studying offline — will sync when connected"
```

### Admin Resilience Metrics Dashboard

A new section in the admin panel showing failover rates, cache performance, snapshot ages, and offline usage.

**New files:**
```
src/app/(admin)/admin/resilience/page.tsx     — dashboard page
src/app/api/admin/resilience-metrics/route.ts — aggregated metrics endpoint
src/lib/resilience/resilience-metrics.ts      — metric collection helpers
```

---

## 3. File-by-File Change Summary

### New Files

| File | Purpose | Phase |
|---|---|---|
| `src/lib/cache/redis-content-cache.ts` | Redis client + content cache helpers | 1 |
| `src/lib/cache/content-cache-keys.ts` | Cache key builders | 1 |
| `scripts/snapshots/generate-flashcard-snapshots.ts` | Nightly flashcard snapshot export | 1 |
| `scripts/snapshots/generate-lesson-snapshots.ts` | Nightly lesson snapshot export | 1 |
| `scripts/snapshots/generate-question-snapshots.ts` | Nightly question pack export | 2 |
| `scripts/snapshots/generate-cat-pools.ts` | CAT resilience pool export | 2 |
| `scripts/snapshots/generate-all-snapshots.ts` | Snapshot generation orchestrator | 2 |
| `src/lib/cat/resilience-cat-pool.ts` | Pool selector for resilience mode | 2 |
| `src/lib/cat/resilience-cat-scoring.ts` | Static pool scoring engine | 2 |
| `src/components/exam/cat-resilience-banner.tsx` | Resilience mode notice | 2 |
| `src/lib/offline/offline-progress-queue.ts` | IndexedDB progress queue | 3 |
| `src/lib/offline/sync-progress.ts` | Progress sync on reconnect | 3 |
| `src/lib/offline/sw-registration.ts` | Service worker registration | 3 |
| `src/components/offline/offline-banner.tsx` | Offline status banner | 3 |
| `public/sw.js` | Service worker | 3 |
| `src/lib/resilience/resilience-metrics.ts` | Metric aggregators | 4 |
| `src/app/api/admin/resilience-metrics/route.ts` | Metrics API endpoint | 4 |
| `src/app/(admin)/admin/resilience/page.tsx` | Admin dashboard section | 4 |

### Modified Files

| File | Change | Phase |
|---|---|---|
| `src/app/api/flashcards/route.ts` | Add Redis read-through before DB | 1 |
| `src/app/api/lessons/route.ts` | Add Redis read-through before DB | 1 |
| `src/app/api/questions/route.ts` | Add Redis read-through before DB | 1 |
| `src/app/api/cron/route.ts` (or new) | Add snapshot generation cron trigger | 1 |
| `src/lib/cat/cat-engine.ts` | Catch engine errors, delegate to resilience pool | 2 |
| `src/app/api/cat/[sessionId]/route.ts` | Return `mode` flag for resilience | 2 |
| `src/app/(app)/layout.tsx` | Register service worker | 3 |
| `src/app/(admin)/admin/layout.tsx` | Add resilience nav link | 4 |

---

## 4. Key Technical Decisions

### Redis Client Strategy

Use `UPSTASH_REDIS_REST_URL` (HTTP-based, edge-safe, already recognized) as primary. Fall back to `REDIS_URL` TCP. If neither is set, the cache layer is a no-op (transparent pass-through). This means Redis is strictly additive — removing it returns to the current behavior.

```typescript
// redis-content-cache.ts (simplified shape)
export async function cacheGet<T>(key: string): Promise<T | null>
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void>
export async function cacheDel(key: string): Promise<void>
export function isCacheConfigured(): boolean
```

### Cache TTLs

| Content | TTL | Rationale |
|---|---|---|
| Flashcard list (page 1) | 300s | Changes infrequently, high traffic |
| Lesson content | 600s | Published content, low churn |
| Practice questions (pool) | 900s | Stable content |
| CAT session state | 1800s | In-flight exam progress |
| User-specific data | Not cached | Always fresh from DB |

### Snapshot Schema Extension

The existing `StudyPublishedSnapshotEnvelope<T>` schema (`nursenest.study_snapshot.v1`) is compatible. New surfaces will add:

- `surface: "questions_practice_pack"` — per-pathway/topic question packs
- `surface: "cat_resilience_pool"` — pre-calibrated CAT pools

### CAT Pool Design

Each pool contains 100–150 calibrated questions with preserved difficulty distribution matching the live CAT population. Pools are labelled A/B/C to allow rotation and avoid repeats across sessions. Pool selection uses a hash of the user ID + date to spread load evenly.

```
RN-A, RN-B, RN-C     (100–150 questions each)
RPN-A, RPN-B, RPN-C
NP-A, NP-B, NP-C
Allied-A, Allied-B
```

### Service Worker Scope

Uses network-first strategy for API calls (falls back to cached response). Pre-caches static lesson and flashcard content at install time. Does NOT cache user-specific session data.

### IndexedDB Queue Schema

```typescript
interface ProgressRecord {
  id: string;                   // UUID
  type: "answer" | "confidence" | "completion" | "mastery";
  payload: Record<string, unknown>;
  createdAt: number;            // epoch ms
  syncedAt: number | null;      // null = pending
  retryCount: number;
}
```

---

## 5. Constraints and Non-Goals

- **Do not break existing behavior.** All changes are additive. If Redis is not configured, behavior is identical to today.
- **Do not change the Prisma schema.** The resilience layer is entirely above the ORM.
- **Do not modify the CAT algorithm.** Resilience mode uses static pools, not the adaptive engine.
- **Ocean theme remains source of truth.** No UI theme changes.
- **TypeScript strict mode maintained.** No `any` escapes.
- **No new peer dependencies beyond `redis@^5` (already installed).**
