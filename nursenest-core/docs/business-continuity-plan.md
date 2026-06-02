# NurseNest Business Continuity Plan

**Last Updated:** 2026-05-28  
**Owner:** Engineering + Operations  
**Review Cycle:** Quarterly

Mission-critical Tier 1/Tier 2 learning continuity rules are codified in [`mission-critical-learning-continuity.md`](./mission-critical-learning-continuity.md).

---

## 1. Purpose

This plan ensures NurseNest can continue delivering its core learning services during infrastructure failures, third-party outages, deployment issues, or natural disasters. It defines response procedures, recovery time objectives, and business protection mechanisms for every critical system.

---

## 2. Recovery Objectives

| Metric | Target |
|--------|--------|
| Recovery Time Objective (RTO) | < 15 minutes for content delivery |
| Recovery Point Objective (RPO) | < 25 hours for adaptive data; 0 for progress events |
| Subscription Grace Period | 72 hours minimum |
| Checkout Lead Retention | 100% (all intents captured) |
| Email Delivery Guarantee | 5 retry attempts before dead letter |
| Offline Study Duration | Indefinite (device-cached content) |

---

## 3. Service Tiers

### Tier 1 — Business Critical (RTO < 5 minutes)
- Learner content delivery (lessons, flashcards, questions)
- Subscription access verification
- Active CAT session continuity
- Clinical Skills, Pharmacology, and ECG launch continuity

### Tier 2 — High Priority (RTO < 15 minutes)
- Progress saving and sync
- Daily question delivery
- Checkout flow (with intent capture fallback)

### Tier 3 — Important (RTO < 1 hour)
- Adaptive learning recommendations
- Analytics dashboards
- Search functionality

### Tier 4 — Operational (RTO < 24 hours)
- Email delivery (retry queued)
- Admin panel operations (action queue)
- Blog content (ISR-cached)

---

## 4. Failure Response Procedures

### 4.1 Database Failure

**Detection:** `GET /api/admin/resilience-dashboard/health` returns 503  
**Automatic actions:**
- Content served from static snapshots (Layer 3)
- Progress events queued in IndexedDB (client-side)
- Entitlement grace cache activates (72h window)
- Admin actions queue for later replay

**Manual actions required:**
1. Check Railway/Neon/Supabase dashboard for DB status
2. If DB is recoverable: apply pending migrations, verify schema
3. If failover needed: promote read replica
4. Trigger `POST /api/admin/action-queue/replay` after recovery
5. Trigger `POST /api/admin/resilience-dashboard/run-nightly` to refresh snapshots

**Do NOT:** Roll back migrations without consulting the `RESTORE.md` runbook

---

### 4.2 Stripe Failure

**Detection:** Stripe webhook 400/500 errors, checkout timeouts  
**Automatic actions:**
- Checkout intent capture activates at `/api/checkout/intent-capture`
- Entitlement grace cache preserves access for 72h
- No learner is locked out

**Manual actions required:**
1. Monitor Stripe Status Page
2. After Stripe recovers: send recovery emails to captured intents
3. Run `GET /api/admin/checkout-intents` to see pending intents
4. Process each intent via Stripe checkout link
5. Mark recovered via `POST /api/admin/checkout-intents/:id/recovered`

---

### 4.3 Email Service Failure

**Detection:** Resend webhook failures, email bounce rate spike  
**Automatic actions:**
- All outgoing emails queued in `email_queue` table
- Retry schedule: 1m → 5m → 15m → 1h → 4h
- After 5 failures: moved to dead letter queue

**Manual actions required:**
1. Check `GET /api/admin/email-queue/stats`
2. After email service recovers: dead letters will auto-process on next queue poll
3. Force replay: `POST /api/admin/email-queue/replay-all-dead`

---

### 4.4 Adaptive Engine Failure

**Detection:** `/api/adaptive/snapshot` consistently failing, CAT sessions degraded  
**Automatic actions:**
- Adaptive snapshot served from last nightly generation
- CAT sessions fallback to resilience pool
- Recommendations served from snapshot

**Manual actions required:**
1. Check adaptive engine logs
2. Run manual snapshot: `POST /api/admin/resilience-dashboard/run-nightly`
3. Monitor snapshot freshness via dashboard

---

### 4.5 Deployment Failure

**Detection:** Health check failures, 500 error spike, deploy pipeline alert  
**Actions:**
1. Railway: trigger rollback from dashboard or `railway rollback`
2. Check `RESTORE.md` for recovery procedures
3. If partial deployment: verify snapshot artifacts via `npm run verify:dist`
4. Content snapshots remain valid — learners continue studying

---

## 5. Data Protection

### Progress Events
- Stored in IndexedDB client-side until synced
- Server accepts batches via `POST /api/progress/sync-batch`
- Maximum queue size: 50 events per sync batch
- Retry on failure: automatic (every 2 minutes when online)

### Subscription Records
- Stripe is source of truth for billing
- Grace cache provides 72h coverage during outages
- Snapshots stored in `entitlement_grace_snapshots`

### Content
- Nightly snapshots stored in `adaptive_snapshots`, `analytics_snapshots`
- Service worker caches last 200 content API responses
- Static assets cached indefinitely in service worker

---

## 6. Communication Plan

### During Outage

| Audience | Channel | Timing | Message |
|---------|---------|--------|---------|
| Learners | In-app banner | Immediate | "We're experiencing a temporary issue. Your progress is saved." |
| Learners (email) | Resend (queued) | On recovery | Status update |
| Team | Slack #incidents | Immediate | Alert from resilience dashboard |
| Stripe issues | Checkout page | Immediate | "Save my spot" intent capture form |

### After Recovery

1. Post-incident review within 24 hours
2. Root cause documented in `docs/` 
3. Resilience gap identified and scheduled for fix
4. Learner impact report generated from dashboard

---

## 7. Testing Schedule

| Test | Frequency | Procedure |
|------|-----------|---------|
| DB failover simulation | Monthly | Playwright resilience suite |
| Stripe outage simulation | Monthly | `STRIPE_AVAILABLE=false` env flag |
| Email outage simulation | Monthly | Mock Resend client returning 500 |
| Offline study test | Weekly | Service worker smoke test |
| CAT resilience pool | Weekly | Check `GET /api/cat/resilience-status` |
| Snapshot freshness | Daily | Automated via `/api/admin/resilience-dashboard` |

---

## 8. Contact & Escalation

| Level | Contact | Trigger |
|-------|---------|---------|
| L1 | On-call engineer | Any Tier 1/2 alert |
| L2 | Engineering lead | >15 min Tier 1 outage |
| L3 | CTO | >1 hour outage or data loss risk |
| External | Railway/Neon support | Infrastructure-level failure |
| External | Stripe support | >4 hour payment disruption |
