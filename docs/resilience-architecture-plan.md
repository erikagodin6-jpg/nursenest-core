# NurseNest Resilience Architecture Plan

**Status:** Planning (pre-implementation)  
**Date:** 2026-05-28  
**Author:** Engineering  

---

## 1. Current State Audit

### What Already Exists

| Component | Location | Status |
|---|---|---|
| Circuit breakers, kill switches, health checks | `server/platform-resilience.ts` (4098 lines) | ✅ Production |
| Snapshot reader infrastructure | `nursenest-core/src/lib/study-content-failover/` (12 files) | ✅ Production |
| Service worker registration hook | `nursenest-core/src/hooks/use-service-worker.ts` | ✅ Partial (registers `/sw.js` but `/sw.js` doesn't exist) |
| IndexedDB progress queue | `nursenest-core/src/lib/progress-sync/progress-sync-queue.ts` | ✅ Production |
| In-memory server-side cache | `server/performance.ts` (`cacheGet`/`cacheSet`, 200-entry LRU) | ✅ Production |
| Entitlement cache | `server/entitlements.ts` (60 s TTL, added 2026-05-28) | ✅ Production |
| CAT timeout protection | `server/cat-session-api.ts` | ✅ Production |
| Timedquery wrappers | `server/routes.ts` (via `timedQuery`) | ✅ Production |

### What Does NOT Exist (Gaps)

| Component | Gap |
|---|---|
| Redis caching layer | No Redis client anywhere in the codebase |
| Snapshot generation scripts | Referenced but missing (`scripts/study-snapshots/` does not exist) |
| Static snapshot JSON files | `/public/resilience/` directory does not exist |
| Actual Service Worker (`/sw.js`) | Registration hook exists but the worker itself does not |
| CAT resilience pools | No static calibrated question pools |
| Admin resilience dashboard | No monitoring UI for failover metrics |
| Offline-first CSS/UX patterns | No offline state UI treatment |

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      LEARNER INTERFACE                           │
│   (Next.js App — Lessons / Flashcards / Practice / CAT)          │
└─────────────────────────┬────────────────────────────────────────┘
                          │  fetch()
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  CONTENT DELIVERY LAYER                          │
│                                                                  │
│   ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│   │   LAYER 1    │   │   LAYER 2    │   │     LAYER 3        │  │
│   │  PostgreSQL  │──▶│ Redis Cache  │──▶│  Static Snapshots  │  │
│   │  + Prisma    │   │  (60 min TTL)│   │  (JSON, ~24h old)  │  │
│   └──────────────┘   └──────────────┘   └────────────────────┘  │
│         │                   │                     │             │
│         └──────────────failure cascade────────────┘             │
└──────────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┴────────────────┐
          │                                │
          ▼                                ▼
┌──────────────────┐             ┌──────────────────────┐
│  SERVICE WORKER  │             │  INDEXEDDB QUEUE     │
│  (local cache)   │             │  (progress offline)  │
│  - Lessons       │             │  - Answers           │
│  - Flashcards    │             │  - Confidence        │
│  - Questions     │             │  - Mastery           │
└──────────────────┘             │  - Completions       │
          │                      └──────────────────────┘
          │ Offline                         │
          ▼                                 ▼ On reconnect
┌──────────────────────────────────────────────────────────┐
│                LEARNER STUDIES WITHOUT INTERRUPTION      │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Layer Specifications

### Layer 1 — Primary Database (No Changes)

- Postgres + Prisma remain source of truth
- All existing routes unchanged
- Circuit breakers in `platform-resilience.ts` already guard DB calls
- No schema changes for resilience

### Layer 2 — Redis Content Cache

**Purpose:** Sub-100ms retrieval; absorbs DB unavailability for up to 60 minutes.

**Client:** `ioredis` (already in ecosystem; choose over `redis` npm package for cluster support)

**Installation:**
```
npm install ioredis
```

**Environment variables (new):**
```
REDIS_URL=redis://localhost:6379
REDIS_TLS=false
REDIS_CACHE_TTL_LESSONS=3600
REDIS_CACHE_TTL_FLASHCARDS=3600
REDIS_CACHE_TTL_QUESTIONS=3600
REDIS_CACHE_TTL_CAT=1800
```

**Cache key schema:**

```
lesson:{lessonId}                          — individual lesson
lessons:hub:{pathwayId}:{locale}           — hub page lesson list
flashcard:deck:{deckId}                    — full deck with cards
flashcards:hub:{country}:{tier}            — hub bootstrap
practice:pool:{pathwayId}:{selectionMode}  — question pool IDs
cat:pool:{pathwayId}:{tier}                — CAT candidate pool
cat:resilience:{tier}:{poolSlot}           — static CAT resilience pool (A/B/C)
clinical-skills:{pathwayId}                — clinical skill item list
pharmacology:{pathwayId}                   — pharm question pool
```

**Cache placement:**
- Write on successful DB response (write-through)
- Background refresh: 5 minutes before TTL expiry, re-query DB silently
- Evict on content publish/update webhook

**New files required:**
- `server/redis-client.ts` — singleton ioredis client with reconnect logic
- `server/content-cache.ts` — typed get/set/invalidate wrappers over Redis
- `nursenest-core/src/lib/redis/redis-client.server.ts` — Next.js server-side Redis access

### Layer 3 — Generated Snapshot System

**Purpose:** Last-resort static content when both DB and Redis are unavailable; also serves offline mode.

**Storage location:** Filesystem path configured via `STUDY_PUBLISHED_SNAPSHOT_DIR` env var  
(already used by `study-published-snapshot-store.ts`).

For CDN distribution (public fallback), additionally write to:
```
nursenest-core/public/resilience/{tier}/{surface}/snapshot.json
```

**Snapshot envelope format (extends existing `StudyPublishedSnapshotEnvelope`):**
```typescript
interface ResilienceSnapshot<T> {
  version: 1;
  surface: string;           // e.g. "lessons_hub", "flashcard_deck"
  tier: string;
  country: string;
  generatedAt: string;       // ISO-8601
  expiresAt: string;         // generatedAt + 25h (safety margin)
  itemCount: number;
  payload: T;
}
```

**Snapshot surfaces to generate:**

| Surface | Key | Payload |
|---|---|---|
| Lessons hub bootstrap | `lessons/hub-bootstrap-{country}-{tier}.json` | pathway list, lesson counts |
| Flashcards hub bootstrap | `flashcards/hub-bootstrap-{country}-{tier}.json` | already defined |
| Practice tests hub bootstrap | `practice-tests/hub-bootstrap-{country}-{tier}.json` | already defined |
| Question pack (by tier+topic) | `questions/{tier}/{topic}.json` | up to 150 questions with answers/rationale |
| CAT resilience pool | `cat-pools/{tier}/pool-{slot}.json` | 150 calibrated questions (3 slots A/B/C) |

**Generation scripts (new):**
```
scripts/study-snapshots/
  export-lessons-hub-snapshot.mts
  export-flashcards-hub-snapshot.mts
  export-practice-tests-hub-snapshot.mts
  export-question-packs.mts
  export-cat-resilience-pools.mts
  run-all-snapshots.mts           — orchestrator, runs all, writes manifest
```

**Nightly schedule:** Existing cron infrastructure or Railway scheduled job at 02:00 UTC.

**Manifest file:** `{STUDY_PUBLISHED_SNAPSHOT_DIR}/manifest.json`
```json
{
  "generatedAt": "2026-05-28T02:00:00Z",
  "surfaces": {
    "lessons_hub": { "count": 12, "lastUpdated": "..." },
    "flashcard_deck": { "count": 24, "lastUpdated": "..." },
    ...
  },
  "healthy": true
}
```

---

## 4. Lesson Failover Data Flow

```
GET /api/lessons/{id}
        │
        ▼
┌──────────────────────┐
│  1. Prisma DB query  │──── success ──▶ return + write Redis cache
│  (5 s timeout)       │
└──────────┬───────────┘
           │ failure / timeout
           ▼
┌──────────────────────┐
│  2. Redis cache read │──── hit ──▶ return + emit cache_hit telemetry
│  cacheGet("lesson:") │
└──────────┬───────────┘
           │ miss / Redis down
           ▼
┌──────────────────────┐
│  3. Snapshot read    │──── found ──▶ return + emit snapshot_load telemetry
│  (filesystem JSON)   │
└──────────┬───────────┘
           │ not found / stale
           ▼
┌──────────────────────┐
│  4. Service Worker   │──── cached ──▶ return (client-side only)
│  Cache (client only) │
└──────────┬───────────┘
           │ cache miss
           ▼
┌──────────────────────┐
│  5. Show skeleton UI │  Never blank. Emit "degraded_content" telemetry.
│  + retry button      │  Do NOT show error. Show last-seen content if any.
└──────────────────────┘
```

---

## 5. Flashcard Failover Data Flow

```
Session start / next card request
        │
        ▼
┌──────────────────────────────┐
│ 1. API: /api/adaptive-engine │──── success ──▶ normal session
│    (timedQuery 5 s)          │
└──────────┬───────────────────┘
           │ timeout / error
           ▼
┌──────────────────────────────┐
│ 2. Redis deck cache          │──── hit ──▶ serve cached deck
│    cacheGet("flashcard:deck")│
└──────────┬───────────────────┘
           │ miss
           ▼
┌──────────────────────────────┐
│ 3. Snapshot deck JSON        │──── found ──▶ load deck from snapshot
│    (/resilience/{tier}/      │              + show subtle "offline mode" indicator
│     flashcards/{deckId}.json)│
└──────────┬───────────────────┘
           │ not found
           ▼
┌──────────────────────────────┐
│ 4. Service Worker cache      │──── hit ──▶ load from SW cache
└──────────┬───────────────────┘
           │ miss
           ▼
┌──────────────────────────────┐
│ 5. Hardcoded seed deck       │  ALWAYS available. 30–50 high-yield cards
│    (bundled in app JS)       │  per tier embedded at build time.
└──────────────────────────────┘

Progress tracking during offline/failover:
  → All answers buffered to IndexedDB progress-sync-queue
  → On reconnect: sync queue flushes to API
  → Mastery / confidence / streaks preserved
```

---

## 6. Practice Question Failover Data Flow

```
POST /api/practice-tests (create session)
        │
        ▼
┌───────────────────────────────────┐
│ 1. pickPracticeQuestionIds()      │──── success ──▶ normal session
│    (Prisma + pathway scope)       │
└──────────┬────────────────────────┘
           │ timeout / error
           ▼
┌───────────────────────────────────┐
│ 2. Redis: cat/practice pool cache │──── hit ──▶ use cached IDs
└──────────┬────────────────────────┘
           │ miss
           ▼
┌───────────────────────────────────┐
│ 3. Question pack snapshot         │──── found ──▶ load {tier}/{topic}.json
│    (/resilience/questions/)       │              shuffle deterministically
└──────────┬────────────────────────┘
           │ not found
           ▼
┌───────────────────────────────────┐
│ 4. Service Worker cache           │──── hit ──▶ use SW-cached questions
└──────────┬────────────────────────┘
           │ miss
           ▼
┌───────────────────────────────────┐
│ 5. Bundled seed pack              │  30 core questions per tier, always available
└───────────────────────────────────┘
```

---

## 7. CAT Resilience Mode Data Flow

```
POST /api/v1/cat-exams/start
        │
        ▼
┌─────────────────────────────────────┐
│ 1. Full CAT pool fetch (Prisma)     │──── success ──▶ normal CAT
│    fetchCatPracticePool()           │              (IRT-adaptive)
│    CAT_MIN_COMPLETE_POOL = 150      │
└──────────┬──────────────────────────┘
           │ pool too small / timeout
           ▼
┌─────────────────────────────────────┐
│ 2. Redis: cat:pool:{pathway}:{tier} │──── hit ──▶ use cached pool
│    (30 min TTL)                     │
└──────────┬──────────────────────────┘
           │ miss / expired
           ▼
┌─────────────────────────────────────┐
│ 3. CAT Resilience Pool JSON         │──── found ──▶ RESILIENCE CAT MODE
│    /resilience/cat-pools/{tier}/    │
│    pool-{A|B|C}.json                │              ┌──────────────────────┐
│    150 calibrated questions         │              │ Banner shown:        │
│    difficulty 1–5 distributed       │              │ "Running resilience  │
│    per NCLEX blueprint              │              │  exam mode"          │
└──────────┬──────────────────────────┘              └──────────────────────┘
           │ not found
           ▼
┌─────────────────────────────────────┐
│ 4. Bundled mini-pool                │  25 questions, all tiers, always ships with app.
│    (imported JSON, no fetch)        │  Not ideal but never broken.
└─────────────────────────────────────┘

Resilience CAT still delivers:
  → Score and pass/fail estimate
  → Topic breakdown analytics
  → Remediation links
  → Full session saved to IndexedDB → synced on restore
```

---

## 8. Offline / Service Worker Architecture

### Service Worker Strategy

**Framework:** Workbox (via `next-pwa` or manual Workbox config)

**File:** `nursenest-core/public/sw.js` (generated at build time)

**Caching strategies per resource type:**

| Resource Type | Strategy | Max Age | Max Entries |
|---|---|---|---|
| App shell (HTML, JS, CSS) | CacheFirst | 7 days | — |
| API: `/api/lessons/{id}` | StaleWhileRevalidate | 24h | 50 lessons |
| API: `/api/adaptive-engine/cards` | NetworkFirst, fallback to cache | 24h | 5 decks |
| API: `/api/practice-tests` (GET) | StaleWhileRevalidate | 24h | 10 sessions |
| Static snapshots (`/resilience/**`) | CacheFirst | 48h | unlimited |
| Images, fonts | CacheFirst | 30 days | 100 |

### Background Sync

The existing `use-service-worker.ts` hook already calls `requestBackgroundSync()`.  
The service worker needs to handle the `sync` event:

```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'nursenest-progress-sync') {
    event.waitUntil(flushProgressQueue());
  }
});
```

### Offline UI State

- App shell always loads (cached)
- Content shows last-cached version with a subtle `"Offline — using saved content"` pill
- Answers still recorded in IndexedDB
- No spinner, no error page, no blank screen

---

## 9. IndexedDB Progress Queue (Existing + Extensions)

**Existing:** `progress-sync-queue.ts` — stores progress in `nursenest-progress-v2` with `progress_queue` and `session_snapshots` stores.

**Extensions needed:**

| Store | New events to add |
|---|---|
| `progress_queue` | `flashcard_mastery_update`, `flashcard_confidence_rating`, `cat_question_answered`, `cat_session_completed` |
| `session_snapshots` | CAT session state checkpoint (ability, SE, seenIds) |

**Sync endpoint (new):** `POST /api/progress/batch-sync`  
Accepts an array of queued events, applies them atomically, returns ack.

---

## 10. CAT Resilience Pool Specification

Each pool must be pre-generated and validated before deployment.

**Pool structure per tier:**

```typescript
interface CatResiliencePool {
  tier: "rn" | "rpn" | "np" | "allied";
  slot: "A" | "B" | "C";
  generatedAt: string;
  questionCount: number;  // target: 150
  difficultyDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  blueprintCoverage: Record<string, number>;  // NCLEX client needs categories
  questions: CatResilienceQuestion[];
}

interface CatResilienceQuestion {
  id: string;
  stem: string;
  options: string[];
  correctAnswer: number[];
  rationale: string;
  difficulty: number;     // 1–5
  topic: string;
  bodySystem: string;
  nclexCategory: string;
}
```

**Minimum quality gates:**
- `questionCount >= 150`
- Difficulty distribution: ≥15 questions at each difficulty level 1–5
- ≥8 unique NCLEX client needs categories covered
- All questions pass `isCompleteCatQuestionRow()` validation

**Pools per tier:** 3 (A, B, C) → 12 pool files total (RN×3, RPN×3, NP×3, Allied×3)

---

## 11. New Files Required

### Server-side

```
server/
  redis-client.ts                   — ioredis singleton with reconnect, TLS support
  content-cache.ts                  — typed Redis wrappers: getLesson, setLesson, etc.
  resilience-cat-pool-loader.ts     — loads CAT resilience pools from snapshots
  batch-progress-sync-route.ts      — POST /api/progress/batch-sync handler
```

### Snapshot generation

```
scripts/study-snapshots/
  lib/
    snapshot-writer.ts              — writes versioned JSON + updates manifest
    cat-pool-validator.ts           — validates pool quality gates
  export-lessons-hub-snapshot.mts
  export-flashcards-hub-snapshot.mts
  export-practice-tests-hub-snapshot.mts
  export-question-packs.mts
  export-cat-resilience-pools.mts
  run-all-snapshots.mts
```

### Next.js app additions

```
nursenest-core/src/
  lib/
    redis/
      redis-client.server.ts        — Next.js server-side Redis singleton
    resilience/
      cat-resilience-pool-reader.ts — reads CAT resilience pool JSONs
      resilience-telemetry.ts       — emits failover telemetry events
      offline-content-cache.ts      — manages SW pre-caching list
  hooks/
    use-offline-status.ts           — reactive online/offline state
  components/resilience/
    offline-indicator.tsx           — "Offline — using saved content" pill
    resilience-cat-banner.tsx       — "Running resilience exam mode" banner
    degraded-content-notice.tsx     — subtle inline notice when on snapshot
  app/api/
    progress/
      batch-sync/
        route.ts                    — POST batch progress sync endpoint
```

### Service worker

```
nursenest-core/public/
  sw.js                             — (generated by workbox-cli at build time)

nursenest-core/
  workbox-config.js                 — Workbox source config
```

### Admin dashboard additions

```
nursenest-core/src/app/(app)/app/admin/
  resilience/
    page.tsx                        — Resilience Metrics admin page
```

---

## 12. Migration Requirements

### Database

No schema changes required for resilience infrastructure.

### Environment Variables (new)

```bash
# Redis (Layer 2)
REDIS_URL=redis://localhost:6379
REDIS_TLS=false                   # set true on Railway/production
REDIS_CACHE_TTL_LESSONS=3600
REDIS_CACHE_TTL_FLASHCARDS=3600
REDIS_CACHE_TTL_QUESTIONS=3600
REDIS_CACHE_TTL_CAT=1800

# Snapshot filesystem (Layer 3) — already used by existing snapshot readers
STUDY_PUBLISHED_SNAPSHOT_DIR=/var/nursenest/snapshots   # production
# development: ./nursenest-core/.snapshots

# Batch sync
PROGRESS_BATCH_SYNC_MAX_EVENTS=500
```

### Package additions

```json
{
  "ioredis": "^5.3.2",
  "next-pwa": "^5.6.0",
  "workbox-core": "^7.0.0",
  "workbox-routing": "^7.0.0",
  "workbox-strategies": "^7.0.0",
  "workbox-background-sync": "^7.0.0"
}
```

### Infrastructure (Railway)

1. Add Redis service to Railway project (Railway managed Redis or Upstash)
2. Set `REDIS_URL` in Railway environment
3. Add nightly cron job: `node scripts/study-snapshots/run-all-snapshots.mts` at 02:00 UTC
4. Mount snapshot volume to `STUDY_PUBLISHED_SNAPSHOT_DIR`

---

## 13. Monitoring Plan

### Telemetry events to emit

| Event | Properties | Trigger |
|---|---|---|
| `content_db_success` | surface, tier, latencyMs | Layer 1 success |
| `content_cache_hit` | surface, tier, cacheKey | Layer 2 hit |
| `content_cache_miss` | surface, tier, cacheKey | Layer 2 miss |
| `content_snapshot_load` | surface, tier, snapshotAge | Layer 3 load |
| `content_sw_fallback` | surface, tier | Service worker fallback |
| `content_seed_fallback` | surface, tier | Bundled seed fallback |
| `cat_resilience_mode` | tier, slot, reason | CAT resilience pool activated |
| `offline_session_started` | tier, surface | Offline study started |
| `progress_queue_flushed` | eventCount, latencyMs | IndexedDB sync completed |
| `progress_queue_flush_failed` | eventCount, error | Sync failed |

### Admin Dashboard — Resilience Metrics page

**Route:** `/app/admin/resilience`

**Panels:**

```
┌─────────────────────────────────────────────────────┐
│  RESILIENCE METRICS (last 24h)                      │
├───────────────┬─────────────────────────────────────┤
│ DB Success    │ ████████████████░░ 94.2%             │
│ Cache Hits    │ ████░ 4.1%                           │
│ Snapshot Load │ █ 1.4%                               │
│ Seed Fallback │ 0.3%                                 │
├───────────────┴─────────────────────────────────────┤
│  CAT Resilience Mode Activations: 0 (last 24h)      │
│  Offline Sessions: 12 (last 24h)                    │
│  Progress Queue Syncs: 31 (last 24h)                │
│  Failed Syncs: 0 (last 24h)                         │
├─────────────────────────────────────────────────────┤
│  Snapshot Freshness                                 │
│  lessons_hub     ✓ generated 4h ago (healthy)       │
│  flashcards      ✓ generated 4h ago (healthy)       │
│  cat_pools/rn    ✓ generated 4h ago (healthy)       │
│  cat_pools/rpn   ✓ generated 4h ago (healthy)       │
├─────────────────────────────────────────────────────┤
│  Redis Health    ✓ connected   Latency: 1.2ms        │
│  DB Health       ✓ connected   Latency: 8.4ms        │
└─────────────────────────────────────────────────────┘
```

### Alerting thresholds

| Metric | Warning | Critical |
|---|---|---|
| Snapshot age | > 26h | > 49h |
| Cache hit rate | < 60% | < 20% |
| Snapshot fallback rate | > 5% | > 20% |
| CAT resilience activations | > 10/day | > 50/day |
| Progress queue failure rate | > 1% | > 5% |

---

## 14. Phased Rollout Strategy

### Phase 1 — Hardened Snapshot Generation (Week 1)
*Zero user-facing risk. Backend only.*

- [ ] Create `scripts/study-snapshots/` directory and generation scripts
- [ ] Implement `snapshot-writer.ts` with manifest tracking
- [ ] Generate initial snapshots: lessons hub, flashcards hub, practice tests hub
- [ ] Generate CAT resilience pools (RN, RPN, NP, Allied — 3 slots each)
- [ ] Schedule nightly cron job
- [ ] Verify snapshots written to `STUDY_PUBLISHED_SNAPSHOT_DIR` with correct envelope format
- [ ] Verify existing snapshot readers (`flashcards-hub-bootstrap-snapshot-read.ts` etc.) can read new files

**Deliverable:** Snapshots generated and fresh at all times. No learner impact.

---

### Phase 2 — Redis Cache Layer (Week 2)
*Low risk. Additive cache layer, never changes primary path.*

- [ ] Add `ioredis` package
- [ ] Implement `server/redis-client.ts` with reconnect, graceful degradation on Redis down
- [ ] Implement `server/content-cache.ts` typed wrappers
- [ ] Wrap key API routes in write-through cache:
  - `/api/lessons/:id` (TTL: 60 min)
  - `getNextCards` in adaptive-engine.ts (TTL: 30 min, keyed by userId+tier)
  - `/api/flashcard-bank` count query (TTL: 15 min)
  - CAT pool queries (TTL: 30 min)
- [ ] Add Railway Redis service + set `REDIS_URL`
- [ ] Deploy and monitor cache hit rates

**Deliverable:** Cache layer absorbs DB load. Measured 60%+ cache hit rate on study sessions.

---

### Phase 3 — Service Worker + Offline Mode (Week 3)
*Medium risk. Changes client-side only. Opt-in per user.*

- [ ] Add `next-pwa` (or manual Workbox config)
- [ ] Configure `workbox-config.js` with caching strategies above
- [ ] Generate `public/sw.js` at build time
- [ ] Implement `use-offline-status.ts` hook
- [ ] Implement `offline-indicator.tsx` (subtle pill, not intrusive)
- [ ] Implement `degraded-content-notice.tsx`
- [ ] Expand existing `use-service-worker.ts` to register the new worker
- [ ] Test offline mode: disconnect → study → reconnect → verify sync
- [ ] Gate behind feature flag `offline_study_mode` for staged rollout

**Deliverable:** Users can study offline. Progress queued and synced on reconnect.

---

### Phase 4 — CAT Resilience Mode (Week 4)
*Medium risk. Adds new fallback path; does not modify existing CAT.*

- [ ] Implement `server/resilience-cat-pool-loader.ts`
- [ ] Implement `nursenest-core/src/lib/resilience/cat-resilience-pool-reader.ts`
- [ ] Add fallback in `/api/v1/cat-exams/start` and `/api/practice-tests` (CAT mode):
  - If `fetchCatPracticePool` returns `pool.length < 8`: load resilience pool
- [ ] Implement `resilience-cat-banner.tsx` component
- [ ] Wire banner into CAT session UI
- [ ] Test: simulate empty DB pool → resilience pool loads → exam completes
- [ ] Verify: score, analytics, and remediation all work with resilience pool

**Deliverable:** CAT never fails to start for a learner, even with empty DB.

---

### Phase 5 — Progress Batch Sync (Week 4–5)
*Low risk. Extends existing queue.*

- [ ] Extend `progress-sync-queue.ts` for flashcard mastery, confidence, CAT events
- [ ] Implement `POST /api/progress/batch-sync` route
- [ ] Add `sync` event handler to service worker
- [ ] Test: answer questions offline → reconnect → verify all events synced
- [ ] Add sync metrics to resilience dashboard

**Deliverable:** Zero progress loss on network interruption.

---

### Phase 6 — Admin Resilience Dashboard (Week 5)
*Zero user risk. Admin-only UI.*

- [ ] Add `resilience-telemetry.ts` event emission to all failover paths
- [ ] Create `/app/admin/resilience/page.tsx` dashboard
- [ ] Wire up snapshot freshness panel from `study-snapshot-runtime-diagnostics.ts`
- [ ] Wire up Redis health from `redis-client.ts`
- [ ] Wire up failover rate metrics from telemetry events
- [ ] Add alerting thresholds

**Deliverable:** Real-time visibility into resilience system health.

---

### Phase 7 — Hardened Seed Bundles (Week 5)
*Zero network risk. Build-time only.*

- [ ] Bundle 30 high-yield cards per tier as JS imports (last-resort flashcards)
- [ ] Bundle 30 questions per tier as JS imports (last-resort practice)
- [ ] Add to `app/layout.tsx` as preloaded data

**Deliverable:** Absolute floor. App always has study content even with zero network access.

---

## 15. Decision Log

| Decision | Rationale |
|---|---|
| Redis over in-memory LRU for Layer 2 | Multi-process (Railway containers) need shared cache; in-memory LRU (current) is per-process only |
| ioredis over `redis` npm | Better cluster support, stream support, TypeScript types |
| next-pwa for service worker | Integrates cleanly with Next.js build; manual Workbox is an alternative if next-pwa causes build issues |
| Phases 1+2 before service worker | Snapshot generation and Redis have zero user-facing risk; establish baseline reliability before adding offline complexity |
| 3 CAT resilience pool slots (A/B/C) | Prevents the same pool being served every time; provides variation while keeping static content |
| Snapshot TTL = 25h (expires before next generation) | 24h generation window + 1h buffer; snapshots always expire after the next run is guaranteed |
| IndexedDB key: `nursenest-progress-v2` | Already exists; no migration needed for core queue |
| No schema migrations needed | All resilience infrastructure is application-layer; DB schema is unchanged |

---

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Redis unavailable | All Redis calls wrapped in try/catch; fall through to Layer 3 silently |
| Stale snapshots | Freshness check in `study-snapshot-runtime-diagnostics.ts`; admin alert at >26h |
| Service worker caching stale lessons | StaleWhileRevalidate strategy revalidates in background; `version` field in snapshots allows invalidation |
| CAT resilience pool quality degradation | Quality gates enforced at generation time; pools rejected if below threshold |
| IndexedDB storage quota | Limit queue to 500 events max; drop oldest on overflow |
| next-pwa build compatibility | Evaluated against Next.js version; fallback: manual Workbox config without next-pwa |
| Redis TLS misconfiguration | `REDIS_TLS` env var; client refuses to connect insecurely on production if TLS expected |

---

## 17. What Requires Approval Before Implementation

The following decisions are cross-cutting and need confirmation before Phase 1 begins:

1. **Redis provider**: Railway managed Redis vs. Upstash (serverless Redis)? Upstash is better for Railway serverless deployments.
2. **Snapshot storage**: Filesystem (requires persistent volume) vs. Vercel Blob / S3 bucket for snapshot JSON?
3. **Service worker approach**: `next-pwa` vs. manual Workbox config?
4. **Seed bundle size budget**: What is the acceptable bundle-size increase for bundled seed content?

*Awaiting confirmation on the above before Phase 1 implementation begins.*

---

## 18. File Change Manifest (Complete)

### New files

```
migrations/                                              (no changes)
server/
  redis-client.ts
  content-cache.ts
  resilience-cat-pool-loader.ts
  batch-progress-sync-route.ts
scripts/study-snapshots/
  lib/snapshot-writer.ts
  lib/cat-pool-validator.ts
  export-lessons-hub-snapshot.mts
  export-flashcards-hub-snapshot.mts
  export-practice-tests-hub-snapshot.mts
  export-question-packs.mts
  export-cat-resilience-pools.mts
  run-all-snapshots.mts
nursenest-core/public/
  sw.js                                                  (workbox-generated)
nursenest-core/
  workbox-config.js
nursenest-core/src/
  lib/redis/redis-client.server.ts
  lib/resilience/cat-resilience-pool-reader.ts
  lib/resilience/resilience-telemetry.ts
  lib/resilience/offline-content-cache.ts
  hooks/use-offline-status.ts
  components/resilience/offline-indicator.tsx
  components/resilience/resilience-cat-banner.tsx
  components/resilience/degraded-content-notice.tsx
  app/api/progress/batch-sync/route.ts
  app/(app)/app/admin/resilience/page.tsx
```

### Modified files (in Phase order)

```
Phase 1:
  (none — all new)

Phase 2:
  server/routes.ts                   — wrap lesson/flashcard routes with Redis cache
  server/adaptive-engine.ts          — add Redis cache hit in getNextCards
  server/cat-session-api.ts          — add Redis cache for CAT pools

Phase 3:
  nursenest-core/src/hooks/use-service-worker.ts   — register new sw.js
  nursenest-core/next.config.ts                    — add next-pwa config
  nursenest-core/src/app/layout.tsx               — add offline indicator

Phase 4:
  nursenest-core/src/app/api/practice-tests/route.ts  — add resilience CAT fallback
  nursenest-core/src/app/api/v1/cat-exams/[...]/      — add resilience fallback

Phase 5:
  nursenest-core/src/lib/progress-sync/progress-sync-queue.ts  — new event types

Phase 6:
  (new files only)
```

---

*End of planning document. No production code has been modified.*  
*Implementation begins when approval is received on the four decisions in Section 17.*
