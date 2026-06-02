# NurseNest Resilience Architecture — System Diagram

> **Status:** Planning document — pre-implementation
> **Generated:** 2026-05-28

---

## Three-Layer Failover Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LEARNER INTERFACE                            │
│           (Next.js App Router — React components)                   │
│                                                                     │
│  Lessons Hub  │  Flashcard Session  │  Practice Test  │  CAT Exam  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │  fetch / React Query
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API ROUTES LAYER                               │
│           (Next.js App Router — server-only)                        │
│                                                                     │
│  /api/lessons  /api/flashcards  /api/questions  /api/cat            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              FAILOVER WATERFALL (per request)               │   │
│  │                                                             │   │
│  │  1. Redis Content Cache ──────────────── HIT → return       │   │
│  │           │ MISS                                            │   │
│  │           ▼                                                 │   │
│  │  2. PostgreSQL + Prisma                                     │   │
│  │     (withRetry — exponential backoff, 3 attempts)           │   │
│  │           │ SUCCESS → write to Redis → return               │   │
│  │           │ FAILURE (transient or timeout)                  │   │
│  │           ▼                                                 │   │
│  │  3. Snapshot File (STUDY_PUBLISHED_SNAPSHOT_DIR)            │   │
│  │     readStudyPublishedSnapshotFile()                        │   │
│  │           │ SUCCESS → return (degraded, telemetry emitted)  │   │
│  │           │ FAILURE (snapshot missing or too old)           │   │
│  │           ▼                                                 │   │
│  │  4. 503 with retryable=true (never a blank screen)          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐
│   LAYER 1    │  │   LAYER 2    │  │         LAYER 3              │
│  PostgreSQL  │  │    Redis     │  │     Static Snapshots         │
│   (Prisma)   │  │   Content    │  │   (JSON files on disk)       │
│              │  │    Cache     │  │                              │
│  Primary     │  │  < 100ms     │  │  Generated nightly by cron   │
│  source of   │  │  TTL: 300-   │  │  Versioned envelopes         │
│  truth       │  │  1800s       │  │  schema: nursenest.study_    │
│              │  │              │  │          snapshot.v1         │
└──────────────┘  └──────────────┘  └──────────────────────────────┘
```

---

## CAT Exam Resilience Path

```
                    ┌─────────────────┐
                    │  Start CAT Exam │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ CAT Engine +    │ ◄── PostgreSQL session state
                    │ Adaptive Logic  │     Redis session cache
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │ Engine OK?                  │
             YES                           NO
              │                             │
              ▼                             ▼
    ┌─────────────────┐          ┌─────────────────────┐
    │  Normal Adaptive│          │  Resilience CAT Mode │
    │  CAT Exam       │          │                     │
    │                 │          │  Select pool:        │
    │  All analytics  │          │  RN-A | RN-B | RN-C  │
    │  All scoring    │          │  RPN-A/B/C | NP-A/B/C│
    │                 │          │  (hash userId + date) │
    └─────────────────┘          │                     │
                                 │  Banner shown:       │
                                 │  "Adaptive service   │
                                 │  temporarily unavail.│
                                 │  Running resilience  │
                                 │  exam mode."         │
                                 │                     │
                                 │  Full exam completes │
                                 │  Score + analytics   │
                                 │  Remediation        │
                                 └─────────────────────┘
```

---

## Offline Mode Architecture

```
                    ┌──────────────────────────────────┐
                    │      Learner Device               │
                    │                                  │
                    │  ┌────────────────────────────┐  │
                    │  │    Next.js App (browser)   │  │
                    │  │                            │  │
                    │  │  React Query client        │  │
                    │  │  Offline detection hook    │  │
                    │  └──────────────┬─────────────┘  │
                    │                 │                 │
                    │    ┌────────────┴──────────┐      │
                    │    │    Service Worker     │      │
                    │    │   (public/sw.js)      │      │
                    │    │                       │      │
                    │    │  Cache strategies:    │      │
                    │    │  - Network-first API  │      │
                    │    │  - Cache-first static │      │
                    │    │  - Pre-cache on install│     │
                    │    └───────────┬───────────┘      │
                    │                │                  │
                    │    ┌───────────┴───────────┐      │
                    │    │       IndexedDB        │      │
                    │    │  (offline-progress-    │      │
                    │    │   queue.ts)            │      │
                    │    │                        │      │
                    │    │  Queued: answers,      │      │
                    │    │  confidence ratings,   │      │
                    │    │  completion events,    │      │
                    │    │  mastery updates       │      │
                    │    └────────────────────────┘      │
                    └──────────────────────────────────┘
                                     │
                         Connection restored
                                     │
                                     ▼
                    ┌──────────────────────────────────┐
                    │    sync-progress.ts               │
                    │    POST /api/learner/sync-queue   │
                    │    (retry with backoff)           │
                    └──────────────────────────────────┘
```

---

## Snapshot Generation Pipeline

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                   NIGHTLY CRON (02:00 UTC)                      │
  │        POST /api/cron/generate-snapshots                        │
  │        (Authorization: CRON_SECRET)                             │
  └──────────────────────────────┬──────────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
   ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
   │ Flashcard        │ │ Lesson           │ │ Question         │
   │ Snapshots        │ │ Snapshots        │ │ Snapshots        │
   │                  │ │                  │ │                  │
   │ Per tier+locale  │ │ Per pathway      │ │ Per pathway+topic│
   │ e.g.            │ │ e.g.            │ │ e.g.            │
   │ flashcards/      │ │ lessons/rn/      │ │ questions/rn/    │
   │ subscriber-list- │ │ hub.json         │ │ cardiovascular/  │
   │ subscriber-CA-en │ │                  │ │ pool.json        │
   └──────────────────┘ └──────────────────┘ └──────────────────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────┐
                  │  CAT Resilience Pools    │
                  │                          │
                  │  cat/rn-pool-a.json      │
                  │  cat/rn-pool-b.json      │
                  │  cat/rn-pool-c.json      │
                  │  cat/rpn-pool-a.json ... │
                  │  cat/np-pool-a.json  ... │
                  │  cat/allied-pool-a.json  │
                  └──────────────────────────┘
                                 │
                                 ▼
                  Written to STUDY_PUBLISHED_SNAPSHOT_DIR
                  (e.g. /public/resilience/ or mounted volume)
                                 │
                                 ▼
                  Existing read layer picks up automatically
                  readStudyPublishedSnapshotFile() → no changes needed
```

---

## Telemetry Signal Flow

```
  API Route Error
       │
       ├── safeServerLogCritical()  ──────────► Server logs (JSON)
       │
       ├── critical_study_load_diagnostics ───► PostHog event
       │     fields: surface, outcome,
       │             snapshot_used, fallback_used,
       │             snapshot_age_ms
       │
       ├── Sentry.captureException() ─────────► Sentry (if error)
       │
       └── resilience_metrics store ──────────► Admin dashboard
             counters: cache_hit, cache_miss,
                       snapshot_load, failover,
                       offline_sync
```

---

## Component Dependency Map

```
src/lib/cache/redis-content-cache.ts
    └── used by: API routes (flashcards, lessons, questions, CAT)

src/lib/study-content-failover/
    ├── study-published-snapshot-store.ts (read)
    ├── flashcards-list-snapshot-read.ts
    ├── pathway-lessons-hub-snapshot-read.ts
    ├── practice-exams-published-snapshot-read.ts
    └── [NEW] questions-practice-pack-snapshot-read.ts

scripts/snapshots/
    └── generate-all-snapshots.ts
        ├── generate-flashcard-snapshots.ts
        ├── generate-lesson-snapshots.ts
        ├── generate-question-snapshots.ts
        └── generate-cat-pools.ts

src/lib/cat/
    ├── cat-engine.ts (modified: catch + delegate)
    ├── [NEW] resilience-cat-pool.ts
    └── [NEW] resilience-cat-scoring.ts

src/lib/offline/
    ├── [NEW] offline-progress-queue.ts (IndexedDB)
    ├── [NEW] sync-progress.ts
    └── [NEW] sw-registration.ts

public/sw.js (new)

src/lib/resilience/
    ├── with-retry.ts (existing)
    ├── index.ts (circuit breaker — existing)
    └── [NEW] resilience-metrics.ts
```
