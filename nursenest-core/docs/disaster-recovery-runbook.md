# NurseNest Disaster Recovery Runbook

**Last Updated:** 2026-05-28  
**Classification:** Internal — Engineering  
**Version:** 1.0

This runbook provides step-by-step recovery procedures for every failure mode. Follow the section matching your incident type.

For the current Tier 1/Tier 2 learning continuity contract, Emergency Study Mode flags, and synthetic activity checks, see [`mission-critical-learning-continuity.md`](./mission-critical-learning-continuity.md).

---

## Quick Reference

| Symptom | Go To |
|---------|-------|
| Learners see blank screens | § 1 — Content Recovery |
| Subscriptions showing free tier | § 2 — Subscription Recovery |
| Checkout failing | § 3 — Payment Recovery |
| Progress not saving | § 4 — Progress Recovery |
| CAT exam won't launch | § 5 — CAT Recovery |
| Emails not sending | § 6 — Email Recovery |
| Adaptive recs gone | § 7 — Adaptive Recovery |
| Admin panel broken | § 8 — Admin Recovery |
| Full outage | § 9 — Total Recovery |
| Primary app or database unavailable | [`deployment/high-availability-standby-architecture.md`](./deployment/high-availability-standby-architecture.md) |

For platform-level failover, use the high availability standby runbook. Target recovery is under 15 minutes using the standby deployment plus promoted database replica.

---

## § 1 — Content Recovery

### Symptoms
- Lessons/flashcards/questions returning 500 or empty
- "Content not available" messages

### Diagnosis
```bash
# Check DB connectivity
curl /api/admin/resilience-dashboard/health

# Check snapshot freshness
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/resilience-dashboard | jq '.metrics.adaptiveSnapshots'
```

### Recovery Steps

**Step 1:** Verify if DB is accessible
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM lessons WHERE is_published = true;"
```

**Step 2:** If DB is down → snapshots activate automatically. Verify:
```bash
curl /api/search/snapshot?q=cardiac | jq '.fallback'  # should be true
```

**Step 3:** If snapshots are stale (>26 hours old):
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/resilience-dashboard/run-nightly
```

**Step 4:** If device cache is needed → service worker activates automatically. Verify in browser:
```javascript
// In DevTools console
navigator.serviceWorker.ready.then(r => console.log('SW active:', r.active?.state))
```

**Step 5:** After DB recovery:
```bash
# Verify content counts
psql $DATABASE_URL -c "SELECT tier, COUNT(*) FROM lessons GROUP BY tier;"
# Rebuild search index
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/search-snapshot/rebuild
```

---

## § 2 — Subscription Recovery

### Symptoms
- Paying users showing "Free" tier
- Premium content blocked

### Diagnosis
```bash
# Check grace cache
psql $DATABASE_URL -c "SELECT COUNT(*) FROM entitlement_grace_snapshots WHERE grace_period_ends_at > NOW() AND tier != 'free';"
```

### Recovery Steps

**Step 1:** Confirm grace cache is active (should be automatic):
```bash
psql $DATABASE_URL -c "SELECT user_id, tier, grace_period_ends_at FROM entitlement_grace_snapshots WHERE tier != 'free' ORDER BY grace_period_ends_at LIMIT 10;"
```

**Step 2:** If grace cache missing — manually extend grace:
```bash
psql $DATABASE_URL -c "UPDATE entitlement_grace_snapshots SET grace_period_ends_at = NOW() + INTERVAL '72 hours' WHERE tier != 'free';"
```

**Step 3:** After Stripe/DB recovery — refresh entitlements:
```bash
# Webhook replay (if Stripe supports it)
stripe events resend <event_id>

# Or manually trigger entitlement refresh
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/subscriptions/sync-all
```

**Step 4:** Clear in-memory entitlement cache:
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/cache/clear-entitlements
```

### DO NOT
- Do NOT downgrade users during a grace period
- Do NOT clear grace snapshots during an outage
- Do NOT manually edit Stripe subscription data during an outage

---

## § 3 — Payment Recovery

### Symptoms
- Checkout page returning errors
- Stripe webhooks failing

### Diagnosis
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/checkout-intents | jq '.count'
```

### Recovery Steps

**Step 1:** Verify intent capture is active — learners should see "Save my spot" form

**Step 2:** After Stripe recovers — retrieve captured intents:
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/checkout-intents | jq '.intents[] | {email, plan, tier, createdAt}'
```

**Step 3:** Generate recovery checkout links for each intent:
```bash
# For each intent email, create a Stripe checkout session and email the link
stripe checkout sessions create --customer-email="<email>" --mode=subscription --price="<price_id>"
```

**Step 4:** Send recovery emails:
```bash
# Use admin email blast or individual recovery emails
# Mark as sent via API
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/checkout-intents/<id>/recovered
```

**Step 5:** Verify Stripe webhook endpoint is healthy:
```bash
stripe listen --print-json | head -5  # local
# Production: check Railway logs for webhook receiver
```

---

## § 4 — Progress Recovery

### Symptoms
- Learner reports lost progress
- Sync retries not working

### Diagnosis
```bash
# Check server-side sync log
psql $DATABASE_URL -c "SELECT event_type, COUNT(*) FROM progress_sync_log WHERE synced_at > NOW() - INTERVAL '1 hour' GROUP BY event_type;"

# Check pending (unprocessed) events
psql $DATABASE_URL -c "SELECT COUNT(*) FROM progress_sync_log WHERE processed = false;"
```

### Recovery Steps

**Step 1:** Verify client-side queue (browser DevTools):
```javascript
const db = await window.indexedDB.open('nursenest-progress-v2');
// Check 'progress_queue' store for pending entries
```

**Step 2:** Trigger manual sync from client:
```javascript
window.dispatchEvent(new Event('online'));
// or
window.dispatchEvent(new CustomEvent('nursenest:progress-sync'));
```

**Step 3:** Process pending server-side events:
```bash
psql $DATABASE_URL -c "SELECT id, user_id, event_type, payload FROM progress_sync_log WHERE processed = false LIMIT 20;"
# These will be processed automatically by the background job
# Or force process via admin endpoint if available
```

**Step 4:** Verify progress tables:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM user_lesson_progress WHERE completed = true;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM user_question_history WHERE answered_at > NOW() - INTERVAL '24 hours';"
```

---

## § 5 — CAT Exam Recovery

### Symptoms
- CAT won't launch
- "No questions available" errors

### Diagnosis
```bash
curl /api/cat/resilience-status | jq '.tiers'
```

### Recovery Steps

**Step 1:** Check emergency banks:
```bash
psql $DATABASE_URL -c "SELECT tier, question_count, generated_at FROM cat_emergency_fallback_banks;"
```

**Step 2:** If banks are empty — rebuild:
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/resilience-dashboard/run-nightly
# This triggers CAT bank refresh for all tiers including new_grad
```

**Step 3:** Verify resilience CAT works:
```bash
curl -X POST /api/cat/resilience-launch -d '{"userId":"test","tier":"rn"}' | jq '.session.questions | length'
```

**Step 4:** After adaptive engine recovers:
```bash
# Normal CAT sessions resume automatically
# Check circuit breaker state
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/exam/circuit-status
```

---

## § 6 — Email Recovery

### Symptoms
- Emails not delivering
- Password reset emails not arriving
- Queue building up

### Diagnosis
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/email-queue/stats
```

### Recovery Steps

**Step 1:** Check queue status:
```bash
# Expected output: { pending: N, retrying: N, sent: N, dead: N }
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/email-queue/stats | jq .
```

**Step 2:** If dead letters exist — replay after service recovery:
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/email-queue/replay-all-dead
```

**Step 3:** Check Resend API key:
```bash
curl -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/emails | head
```

**Step 4:** For password reset emergencies — generate direct reset link:
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/users/<id>/generate-reset-link
```

---

## § 7 — Adaptive Learning Recovery

### Symptoms
- No recommendations showing
- "Personalization unavailable" messages

### Diagnosis
```bash
psql $DATABASE_URL -c "SELECT COUNT(*), MIN(generated_at), MAX(generated_at) FROM adaptive_snapshots WHERE valid_until > NOW();"
```

### Recovery Steps

**Step 1:** Snapshots should serve automatically. Verify via:
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/adaptive/snapshot?userId=<id>
```

**Step 2:** If stale — force refresh:
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/resilience-dashboard/run-nightly
```

**Step 3:** After adaptive engine recovers:
- Wait for next nightly run (02:00 UTC) OR
- Manually trigger: `POST /api/admin/resilience-dashboard/run-nightly`

---

## § 8 — Admin Recovery

### Symptoms
- Admin actions not applying
- Content publishing failing

### Diagnosis
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/action-queue | jq '.count'
```

### Recovery Steps

**Step 1:** Check queued actions:
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/action-queue | jq '.actions'
```

**Step 2:** After DB recovery — replay:
```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" /api/admin/action-queue/replay | jq .
```

**Step 3:** Verify kill switches are in expected state:
```bash
psql $DATABASE_URL -c "SELECT feature_key, enabled FROM kill_switches WHERE enabled = true;"
```

---

## § 9 — Total Infrastructure Recovery

When DB + Stripe + Redis all fail simultaneously:

### Immediate (0–15 min)
1. Service worker continues serving cached content
2. IndexedDB accumulates progress events
3. Grace cache preserves subscriptions (72h)
4. Checkout intent form captures leads
5. CAT resilience pools serve from device cache
6. No learner action required

### Triage (15–60 min)
1. Identify which services are down (DB, Redis, Stripe, Resend)
2. Check Railway status / provider status pages
3. Alert team via Slack #incidents
4. Prepare rollback if deployment-related

### Recovery Sequence
```
1. Restore database (or promote replica)
2. Verify schema integrity: npm run check:server
3. Apply pending migrations if any
4. Restart application (Railway: redeploy last good)
5. Trigger: POST /api/admin/resilience-dashboard/run-nightly
6. Trigger: POST /api/admin/action-queue/replay
7. Trigger: POST /api/admin/email-queue/replay-all-dead
8. Verify: GET /api/admin/resilience-dashboard
9. Monitor for 30 minutes
10. Send learner status email (recovery + apology)
```

### Post-Incident
- Document in `docs/incidents/YYYY-MM-DD-<summary>.md`
- Update failover matrix if gaps discovered
- Schedule resilience test for identified weak points

---

## Useful One-Liners

```bash
# Full system health check
curl -H "Auth: Bearer $T" /api/admin/resilience-dashboard | jq '{db: .metrics.database, cat: .metrics.catResilience.tierStatus, email: .metrics.emailQueue, grace: .metrics.entitlementGrace}'

# Count grace users
psql $DB -c "SELECT tier, COUNT(*) FROM entitlement_grace_snapshots WHERE grace_period_ends_at > NOW() GROUP BY tier;"

# Count pending progress events
psql $DB -c "SELECT COUNT(*) FROM progress_sync_log WHERE processed = false;"

# Check email dead letters
psql $DB -c "SELECT email_type, COUNT(*) FROM email_queue WHERE status = 'dead' GROUP BY email_type;"

# CAT bank health
psql $DB -c "SELECT tier, question_count, generated_at FROM cat_emergency_fallback_banks ORDER BY tier;"

# Recent errors
psql $DB -c "SELECT route, COUNT(*) FROM critical_route_errors WHERE created_at > NOW() - INTERVAL '1 hour' GROUP BY route ORDER BY count DESC LIMIT 10;"
```
