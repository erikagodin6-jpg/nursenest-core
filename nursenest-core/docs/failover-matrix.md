# NurseNest Failover Matrix

**Last Updated:** 2026-05-28  
**Version:** 1.0

This matrix documents every learner-facing system, the failure modes, the fallback chain, and the expected learner experience during each failure.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully available |
| ⚠️ | Degraded — reduced features |
| 🔄 | Fallback active |
| ❌ | Unavailable |

---

## Failure Scenarios

### Scenario A: Database Outage

| System | Primary | Fallback 1 | Fallback 2 | Learner Experience |
|--------|---------|-----------|-----------|-------------------|
| Lessons | DB | Snapshot | Device Cache | Content loads from snapshot |
| Flashcards | DB | Snapshot | Device Cache | Cards available |
| Practice Questions | DB | Snapshot | Device Cache | Questions served |
| CAT Exam | DB + Adaptive Engine | Resilience Pool | — | "Resilience mode" CAT launched |
| Clinical Skills | DB | Snapshot | — | Skills catalog from snapshot |
| Pharmacology | DB | Snapshot | — | Drug content available |
| ECG | DB | Static Assets | — | Pre-rendered strips load |
| Subscriptions | DB | Grace Cache (72h) | Free tier | Access preserved for 72h |
| Daily Question | DB | Pre-generated Queue | Random fallback | Question served from queue |
| Adaptive Recs | DB + Engine | Adaptive Snapshot | Generic recs | Last-known recommendations |
| Analytics | DB | Analytics Snapshot | Cached display | Last-known report shown |
| Search | DB | In-memory Snapshot | — | Snapshot search active |
| Admin Actions | DB | Action Queue | — | Actions queued for replay |
| Email | DB | Email Queue | Dead Letter | Email queued for retry |

### Scenario B: Stripe Outage

| System | Primary | Fallback | Learner Experience |
|--------|---------|---------|-------------------|
| Checkout | Stripe | Intent Capture | "Payment saved — recovery link coming" |
| Subscription Access | Stripe webhook | 72h Grace Cache | Full access continues |
| Entitlement Check | Stripe + DB | Grace Snapshot | Access granted from snapshot |
| Trial Upgrade | Stripe | Queued Intent | Intent captured, link sent on recovery |

### Scenario C: Redis Cache Outage

| System | Effect | Fallback | Learner Experience |
|--------|--------|---------|-------------------|
| Lesson delivery | Cache miss, DB hit | DB query | Slight latency increase (transparent) |
| Entitlement checks | Cache miss | DB + Grace | Transparent |
| Session data | Cache miss | DB | Re-fetch from DB |
| Rate limiting | Degraded | Conservative limits | Some rate limits loosened |

### Scenario D: Email Service Outage (Resend/SendGrid)

| Email Type | Primary | Fallback | Guarantee |
|-----------|---------|---------|-----------|
| Password Reset | Resend | Email Queue (retry) | Queued, retried up to 5× |
| Verification | Resend | Email Queue | Queued |
| Daily Question | Resend | In-app delivery | Question still in-app |
| Checkout Recovery | Resend | Email Queue | Queued |
| Marketing | Resend | Dead Letter | Admin replay |

### Scenario E: Adaptive Engine Outage

| Feature | Primary | Fallback | Learner Experience |
|---------|---------|---------|-------------------|
| Weak topic detection | Live engine | Adaptive Snapshot | Last-known weakness map |
| Readiness scoring | Live engine | Adaptive Snapshot | Last-known readiness |
| Study recommendations | Live engine | Adaptive Snapshot | Pre-computed recommendations |
| CAT targeting | Live engine | Resilience Pool (random) | Standard CAT served |

### Scenario F: Search Service Outage

| Feature | Primary | Fallback | Learner Experience |
|---------|---------|---------|-------------------|
| Lesson search | DB FTS | In-memory Snapshot | Snapshot search (~26h stale max) |
| Question search | DB FTS | Snapshot | Snapshot results |
| Flashcard search | DB FTS | Snapshot | Snapshot results |
| Blog search | DB FTS | Snapshot | Snapshot results |

### Scenario G: Total Infrastructure Failure (DB + Redis + Stripe)

| System | Fallback | Duration | Notes |
|--------|---------|---------|-------|
| Content | Device Cache (SW) | Indefinite | Last cached content |
| Progress | IndexedDB queue | Indefinite | Syncs on recovery |
| Subscriptions | Grace Cache (72h) | 72 hours | After 72h → free tier |
| CAT | Resilience Pool | Until DB recovers | From device cache |
| Flashcards | Device Cache | Indefinite | SW cached |
| Daily Question | Last cached | Until recovery | SW cached |

---

## Learner-Visible Indicators

| State | UI Treatment |
|-------|-------------|
| CAT Resilience Mode | Banner: "Temporary resilience mode active." |
| Offline Study | Connectivity indicator: "Studying offline — progress will sync" |
| Subscription Grace | No indicator — access preserved transparently |
| Checkout Failure | Form: "Stripe unavailable. We saved your info — recovery link coming." |
| Analytics Stale | Subtle indicator: "Analytics as of [date]" |
| Search Fallback | No indicator — results appear normally |

---

## Recovery Order

When services come back online:

1. **Database recovers** → Progress sync queue flushes, admin action queue replays, email queue processes
2. **Stripe recovers** → Checkout intent recovery emails sent, grace snapshots refreshed
3. **Adaptive engine recovers** → Nightly snapshot regenerated on next schedule
4. **Email service recovers** → Dead letter emails replayed
5. **Redis recovers** → Cache rebuilds naturally on next access

---

## Verification Commands

```bash
# Check resilience dashboard
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/resilience-dashboard

# Trigger nightly resilience jobs
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/resilience-dashboard/run-nightly

# Check email queue
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/email-queue/stats

# Check CAT bank status
curl /api/cat/resilience-status

# Check checkout intents
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/checkout-intents

# Replay admin action queue
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/action-queue/replay
```
