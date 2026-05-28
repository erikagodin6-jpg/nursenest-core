# NurseNest Resilience Architecture — Phased Rollout Strategy

> **Status:** Planning document — pre-implementation
> **Generated:** 2026-05-28
> **Total estimated implementation:** 4 phases over ~4–6 weeks

---

## Overview

Each phase is independently deployable and independently reversible. Later phases build on earlier ones but do not require them. Phase 1 delivers the highest safety value for the lowest implementation risk.

| Phase | Focus | Risk | Value | Duration |
|---|---|---|---|---|
| 1 | Snapshot generation (write side) | Low | High | ~1 week |
| 2 | Redis content cache | Low | High | ~1 week |
| 3 | CAT resilience mode | Medium | High | ~1 week |
| 4 | Offline mode + admin dashboard | Medium | Medium | ~2 weeks |

---

## Phase 1 — Snapshot Generation Pipeline

**Goal:** Complete the snapshot system. The read side already exists and is already wired in `GET /api/flashcards`. Phase 1 makes the snapshots actually exist on disk.

### What We Build

- Nightly generation script for flashcard snapshots (all tiers × locales)
- Nightly generation script for lesson hub snapshots (all pathways)
- Cron endpoint to trigger both
- Snapshot freshness validation in startup diagnostics

### Files Changed

```
NEW  scripts/snapshots/generate-flashcard-snapshots.ts
NEW  scripts/snapshots/generate-lesson-snapshots.ts
NEW  scripts/snapshots/generate-all-snapshots.ts
NEW  src/app/api/cron/generate-snapshots/route.ts
MOD  src/lib/ops/operational-startup-diagnostics.ts  — add snapshot age check
```

### Acceptance Criteria

- [ ] Running `npx ts-node scripts/snapshots/generate-flashcard-snapshots.ts` produces valid JSON files in `STUDY_PUBLISHED_SNAPSHOT_DIR`
- [ ] Each file validates against `StudyPublishedSnapshotEnvelope` schema
- [ ] `POST /api/cron/generate-snapshots` with correct `CRON_SECRET` triggers generation and returns `{ ok: true, surfaces: [...], duration_ms: ... }`
- [ ] `GET /api/flashcards` returns `source_used: "secondary"` and valid content when DB is intentionally offline and snapshot files exist
- [ ] Startup diagnostics log `snapshotDirConfigured: true` and `snapshotAgeHours: N` when `STUDY_PUBLISHED_SNAPSHOT_DIR` is set
- [ ] TypeScript builds without errors

### Deployment Steps

1. Set `STUDY_PUBLISHED_SNAPSHOT_DIR` in Railway environment
2. Mount persistent volume at that path
3. Deploy updated code
4. Trigger first manual snapshot run: `POST /api/cron/generate-snapshots`
5. Verify snapshot files exist and contain valid data
6. Set up nightly cron at 02:00 UTC
7. Simulate DB offline → verify flashcard list still loads

### Rollback

- Unset `STUDY_PUBLISHED_SNAPSHOT_DIR` → snapshots ignored, behavior unchanged

---

## Phase 2 — Redis Content Cache

**Goal:** Add Layer 2 caching so the most common requests are served from Redis (< 100ms) rather than PostgreSQL, and Redis serves as the first fallback before snapshots.

### What We Build

- Redis client wrapper with graceful no-op when unconfigured
- Cache key builders
- Read-through cache middleware for flashcard, lesson, question API routes
- Cache invalidation on content updates

### Files Changed

```
NEW  src/lib/cache/redis-content-cache.ts
NEW  src/lib/cache/content-cache-keys.ts
MOD  src/app/api/flashcards/route.ts       — add Redis read-through before DB query
MOD  src/app/api/lessons/route.ts          — add Redis read-through
MOD  src/app/api/questions/route.ts        — add Redis read-through
MOD  src/app/api/cron/generate-snapshots/  — invalidate Redis after snapshot generation
```

### Acceptance Criteria

- [ ] When `UPSTASH_REDIS_REST_URL` is unset: zero behavior change, no errors
- [ ] When Redis is configured: second request to `GET /api/flashcards?page=1` returns in < 100ms (cache hit)
- [ ] `source_used: "cache"` appears in response when Redis is the source
- [ ] Cache miss correctly falls through to PostgreSQL, then populates Redis
- [ ] When DB is offline and Redis is warm: flashcards load from Redis without touching DB
- [ ] When DB is offline and Redis is cold: flashcards load from snapshot (Phase 1 behavior preserved)
- [ ] Cache errors (Redis down) do not surface to learner; fall through silently to DB
- [ ] TypeScript builds, existing tests pass

### Deployment Steps

1. Provision Upstash Redis (or Railway Redis service)
2. Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in Railway env
3. Deploy updated code
4. Monitor cache hit rate via `nn_cache_operation` PostHog events
5. Verify P95 API latency improves on `/api/flashcards` and `/api/lessons`
6. Load test: disable DB → verify Redis serves traffic

### Rollback

- Unset Redis env vars → `isCacheConfigured()` returns false → no-op

---

## Phase 3 — CAT Exam Resilience Mode

**Goal:** Learners can complete a full CAT-style exam even when the adaptive engine or database is unavailable. They receive a score, analytics, and remediation.

### What We Build

- Question snapshot generation for all pathways and topics
- CAT resilience pool generation (RN/RPN/NP × A/B/C)
- Resilience pool selector + scoring engine
- CAT engine error catch and delegation
- Resilience mode banner component (internal-only)

### Files Changed

```
NEW  scripts/snapshots/generate-question-snapshots.ts
NEW  scripts/snapshots/generate-cat-pools.ts
NEW  src/lib/cat/resilience-cat-pool.ts
NEW  src/lib/cat/resilience-cat-scoring.ts
NEW  src/components/exam/cat-resilience-banner.tsx
MOD  scripts/snapshots/generate-all-snapshots.ts     — add questions + CAT pools
MOD  src/lib/cat/cat-engine.ts                       — catch + delegate to resilience pool
MOD  src/app/api/cat/[sessionId]/next/route.ts        — return mode flag
MOD  src/app/api/cat/sessions/route.ts               — handle DB failure → resilience session
```

### Acceptance Criteria

- [ ] CAT pool files exist after `generate-cat-pools.ts` runs: `cat/rn-pool-a.json`, `cat/rn-pool-b.json`, `cat/rn-pool-c.json`, and equivalents for RPN, NP, Allied
- [ ] Each pool: 100–150 questions, difficulty mean 0.48–0.52, topic distribution within 20% of live population
- [ ] When DB is offline: `POST /api/cat/sessions` succeeds with `{ mode: "resilience", poolId: "..." }`
- [ ] Exam questions are served sequentially from pool (no adaptive algorithm in resilience mode)
- [ ] Learner can complete full exam: all questions answered, result returned with score and topic breakdown
- [ ] CAT resilience banner is shown in exam UI when `mode === "resilience"`
- [ ] Banner text: "Adaptive service temporarily unavailable. Running resilience exam mode."
- [ ] Banner is styled consistently with existing UI; no visual regressions
- [ ] Normal CAT mode (DB available) is completely unchanged
- [ ] TypeScript builds, CAT tests pass

### Pool Quality Requirements

Before deploying Phase 3, verify the following for each pool:
- Topic coverage: ≥ 6 of the required NCLEX Next Generation topic categories
- Difficulty: 30%+ questions at 0.3–0.5, 30%+ at 0.5–0.7, 20%+ at 0.7+
- No duplicate questions within a pool
- No overlap > 30% between Pool A, B, and C for the same pathway

### Deployment Steps

1. Generate pools (manually first): `npx ts-node scripts/snapshots/generate-cat-pools.ts`
2. Review pool quality (difficulty distribution, topic coverage)
3. Add to nightly cron orchestrator
4. Deploy CAT engine changes with resilience mode disabled by default (`NN_CAT_RESILIENCE_MODE=0`)
5. Test in staging: kill DB, start exam, complete exam
6. Enable: `NN_CAT_RESILIENCE_MODE=1`
7. Monitor `nn_cat_resilience_mode` PostHog events (expect zero in normal operation)

### Rollback

- Set `NN_CAT_RESILIENCE_MODE=0` → resilience mode disabled
- Or revert `cat-engine.ts` catch block

---

## Phase 4 — Offline Mode + Admin Dashboard

**Goal:** Learners can study without internet connectivity. Progress is preserved and synced on reconnect. Administrators can see resilience health at a glance.

### What We Build (Offline)

- Service worker with network-first strategy
- IndexedDB progress queue
- Sync endpoint and sync runner
- Offline status banner

### What We Build (Admin)

- Admin resilience metrics API
- Admin resilience dashboard page
- In-process counter collection

### Files Changed

```
NEW  public/sw.js
NEW  src/lib/offline/sw-registration.ts
NEW  src/lib/offline/offline-progress-queue.ts
NEW  src/lib/offline/sync-progress.ts
NEW  src/components/offline/offline-banner.tsx
NEW  src/app/api/learner/sync-queue/route.ts
NEW  src/lib/resilience/resilience-metrics.ts
NEW  src/app/api/admin/resilience-metrics/route.ts
NEW  src/app/(admin)/admin/resilience/page.tsx
MOD  src/app/(app)/layout.tsx                    — register service worker
MOD  src/app/(admin)/admin/layout.tsx             — add resilience nav link
MOD  src/app/api/cron/generate-snapshots/route.ts — emit nn_snapshot_generation event
```

### Acceptance Criteria — Offline Mode

- [ ] Service worker registers without errors in Chrome, Firefox, Safari
- [ ] In Chrome DevTools → Application → Service Workers: `public/sw.js` is active
- [ ] With DevTools → Network → Offline: lesson pages load from SW cache
- [ ] With DevTools → Network → Offline: flashcard session loads from SW cache
- [ ] Answering a question while offline: `POST /api/questions/grade` is queued to IndexedDB
- [ ] Going back online: queued records are synced within 30 seconds
- [ ] After sync: IndexedDB queue is empty (synced records marked)
- [ ] Offline banner appears within 2 seconds of losing connection
- [ ] Offline banner disappears within 5 seconds of reconnection
- [ ] No console errors in offline → reconnect cycle

### Acceptance Criteria — Admin Dashboard

- [ ] `/admin/resilience` is accessible to admin accounts only (4xx for learner accounts)
- [ ] Dashboard shows: cache hit rates, snapshot ages, failover count (last 24h), CAT resilience activations
- [ ] Snapshot age table lists all generated surfaces with last generated timestamp
- [ ] Metric values are populated within 5 seconds of page load
- [ ] Dashboard is responsive on mobile viewport

### Deployment Steps

**Offline mode:**
1. Deploy service worker
2. Verify in Chrome DevTools that SW installs correctly
3. Test offline study cycle in staging
4. Monitor offline session metrics in PostHog

**Admin dashboard:**
1. Deploy metrics API + dashboard page
2. Verify admin access control
3. Walk through all dashboard sections with real data
4. Set up Slack alert for `snapshotAgeHours > 26`

### Rollback — Offline Mode

- Delete `public/sw.js` → browsers unregister automatically on next visit
- Remove SW registration from layout

### Rollback — Admin Dashboard

- Remove dashboard route → no functional impact

---

## Phase Completion Checklist

### Phase 1 — Complete When:
- [ ] Snapshot generation script runs successfully in production
- [ ] Flashcard list loads from snapshot when DB is intentionally offline
- [ ] Lesson hub loads from snapshot when DB is intentionally offline
- [ ] Nightly cron is scheduled and has run at least once successfully
- [ ] No regression in normal (DB online) load paths

### Phase 2 — Complete When:
- [ ] Cache hit rate ≥ 70% for flashcard list (page 1) after 30 minutes of traffic
- [ ] API P95 latency improved by ≥ 20% for cached surfaces
- [ ] Zero learner-visible errors attributable to Redis
- [ ] Failover chain (DB down → Redis warm) verified in staging

### Phase 3 — Complete When:
- [ ] CAT resilience pools generated for all 3 pathways × 3 pool variants
- [ ] Full exam completion tested with DB offline in staging
- [ ] CAT resilience mode has zero false activations in 7-day production observation
- [ ] Score and analytics output reviewed for accuracy

### Phase 4 — Complete When:
- [ ] Offline study tested across Chrome, Firefox, Safari in staging
- [ ] Sync tested: complete 10-question session offline, reconnect, verify server received all answers
- [ ] Admin dashboard shows live data for all sections
- [ ] Alerting for snapshot staleness and sync failures is active

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Snapshot generation times out for large content sets | Medium | Low | Paginate generation; run per-pathway in parallel |
| Redis connection flap causing elevated latency | Low | Medium | `safeOptionalCall()` with 100ms timeout; fall through to DB |
| Service worker caching stale content after deploy | Medium | Medium | Version service worker; use cache busting on deploy |
| CAT pool quality insufficient (too easy/hard) | Low | High | Manual review gate before enabling Phase 3 in production |
| IndexedDB quota exceeded on mobile | Low | Low | Limit queue to 500 records; purge synced records older than 7 days |
| Snapshot disk space growth | Low | Low | Rotate: keep only latest 3 versions per surface; compress JSON |
