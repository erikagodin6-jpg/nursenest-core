# NurseNest Platform Resilience Architecture

**Last Updated:** 2026-05-28  
**Status:** Production

---

## Objective

A learner should always be able to study. No blank screens. No dead ends. No lost progress. No lost purchases. No lost content. No lost analytics.

---

## Architecture Overview

NurseNest implements a **4-Layer Content Retrieval Model** and a suite of resilience subsystems that activate automatically during failures. Every learner-facing system has at least one verified fallback path.

```
┌──────────────────────────────────────────────────────────────────┐
│                    LEARNER REQUEST                                │
└──────────────────────┬───────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Layer 1: Live Database     │
        │   (PostgreSQL via Prisma)    │
        └──────────────┬──────────────┘
                       │ FAILS ↓
        ┌──────────────▼──────────────┐
        │   Layer 2: Redis Cache       │
        │   (60s–5min TTL per type)    │
        └──────────────┬──────────────┘
                       │ FAILS ↓
        ┌──────────────▼──────────────┐
        │   Layer 3: Static Snapshot   │
        │   (Nightly DB snapshots)     │
        └──────────────┬──────────────┘
                       │ FAILS ↓
        ┌──────────────▼──────────────┐
        │   Layer 4: Device Cache      │
        │   (IndexedDB + Service       │
        │    Worker Cache API)         │
        └─────────────────────────────┘
```

---

## Resilience Subsystems

### Phase 1 — Learner Content Resilience
- **Files:** `server/content-failover.ts`, `server/study-content-failover/`
- **Covers:** Lessons, flashcards, questions, clinical skills, pharmacology, ECG, case studies
- **Fallback:** Static HTML snapshots → Device cache
- **SLA:** Content available within 200ms from snapshot

### Phase 2 — Progress Protection
- **Files:** `src/lib/progress-sync/progress-sync-queue.ts`, `server/progress-sync-api.ts`
- **Store:** IndexedDB (`nursenest-progress-v2`)
- **Events:** lesson_complete, flashcard_mastery, question_answered, confidence_rating, cat_result, clinical_skill_complete, pharmacology_progress, ecg_progress, adaptive_signal, study_session_end
- **Sync:** Automatic on `online` event, background sync via Service Worker, periodic every 2 minutes
- **Guarantee:** No progress lost even during 72-hour outage

### Phase 3 — Adaptive Learning Resilience
- **File:** `server/adaptive-snapshot-engine.ts`
- **Runs:** Nightly (via scheduler)
- **Snapshots:** Weakness maps, readiness maps, recommendation maps per user
- **TTL:** 25 hours (covers overnight gaps + peak morning access)
- **Fallback:** Serve last snapshot when adaptive engine is down

### Phase 4 — CAT Exam Resilience
- **Files:** `server/cat-exam-resilience.ts`, `server/cat-resilience-extension.ts`
- **Tiers:** rpn, rn, np, allied, new_grad
- **Pool size:** 100–150 calibrated questions per tier
- **Mode banner:** "Temporary resilience mode active."
- **Delivers:** Score, analytics, remediation, report card in resilience mode

### Phase 5 — Subscription Resilience
- **File:** `server/entitlement-grace-cache.ts`
- **Grace period:** 72 hours after last known paid status
- **Storage:** `entitlement_grace_snapshots` table + in-memory cache (5min TTL)
- **Guarantee:** Paying learner is never locked out due to Stripe downtime

### Phase 6 — Checkout Resilience
- **File:** `server/checkout-intent-capture.ts`
- **Captures:** email, plan, tier, country, exam type, referrer
- **Recovery:** Admin sends recovery checkout link when Stripe recovers
- **Table:** `checkout_intents`
- **Guarantee:** Zero lost leads

### Phase 7 — Daily Question Resilience
- **File:** `server/daily-question-queue.ts`
- **Queue:** 30 days pre-generated per user
- **Fallback:** Random question if queue empty
- **Email fail:** Question still available in-app

### Phase 8–10 — Clinical Skills, Pharmacology, ECG Resilience
- **Pattern:** Snapshot-based content delivery
- **Files:** `server/study-content-failover/` snapshots
- **Guarantee:** Content loads even when DB unavailable

### Phase 11 — Search Resilience
- **File:** `server/search-snapshot-index.ts`
- **Index:** In-memory, rebuilt nightly (lessons, questions, flashcards, blog)
- **TTL:** 26 hours
- **Endpoint:** `GET /api/search/snapshot?q=<query>`

### Phase 12 — Blog & SEO Resilience
- **Pattern:** Next.js ISR (Incremental Static Regeneration)
- **Guarantee:** Published articles remain accessible even if CMS is down

### Phase 13 — Admin Panel Resilience
- **File:** `server/admin-action-queue.ts`
- **Actions queued:** publish_content, update_user_tier, toggle_kill_switch, grant_provisional_access, etc.
- **Replay:** Automatic on DB recovery via `POST /api/admin/action-queue/replay`

### Phase 14 — Email Resilience
- **File:** `server/email-dead-letter-queue.ts`
- **Retry schedule:** 1m → 5m → 15m → 1h → 4h
- **Max attempts:** 5 (configurable per email)
- **Dead letter:** Admin replay via `POST /api/admin/email-queue/:id/replay`
- **Guarantee:** No email permanently lost

### Phase 15 — Analytics Resilience
- **File:** `server/analytics-snapshot-engine.ts`
- **Snapshots:** Nightly per-user study analytics
- **Served from:** `analytics_snapshots` table when live pipeline unavailable
- **Dashboard:** Never shows blank — always last known data

### Phase 16 — Mobile & Offline Study Mode
- **Files:** `public/sw.js`, `src/hooks/use-service-worker.ts`
- **Service Worker strategy:**
  - API content: network-first with offline fallback
  - Static assets: cache-first with background revalidation
  - App routes: network-first
- **Background sync:** `progress-sync` and `analytics-flush` tags
- **Covers:** Hospital WiFi outages, poor cellular, travel, subway

### Phase 17 — Observability
- **File:** `server/resilience-dashboard-api.ts`
- **Dashboard:** `GET /api/admin/resilience-dashboard`
- **Metrics:** All 16 subsystem statuses, alert history, failover events

---

## Nightly Scheduler Jobs

| Job | Trigger | Coverage |
|-----|---------|----------|
| Adaptive Snapshot | 02:00 UTC | All active users (90-day history) |
| Analytics Snapshot | 02:30 UTC | All active users |
| Search Index Rebuild | 03:00 UTC | All published content |
| CAT Bank Refresh | 01:00 UTC | All tiers including new_grad |
| Daily Question Queue | 01:30 UTC | 30-day queue per active user |
| Grace Snapshot Expire | 04:00 UTC | Remove free-tier stale entries |

Manual trigger: `POST /api/admin/resilience-dashboard/run-nightly`

---

## Circuit Breakers

| Component | Threshold | Window | Cooldown |
|-----------|-----------|--------|---------|
| Exam engine | 3 failures | 10 min | 5 min |
| CAT engine | 3 failures | 10 min | 5 min |
| Content delivery | 5 failures | 5 min | 2 min |

---

## Data Retention

| Store | Retention |
|-------|-----------|
| Progress sync log | 90 days (synced events pruned after 7 days) |
| Critical route errors | 90 days |
| Checkout intents | 1 year |
| Email dead letters | 90 days |
| Grace snapshots | Purged 7 days after expiry |
| Adaptive snapshots | Overwritten nightly |
| Analytics snapshots | Overwritten nightly |
