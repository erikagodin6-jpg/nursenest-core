# US Reliability Audit
Generated: 2026-05-30 | Evidence-backed from live codebase

---

## Architecture Summary

NurseNest runs on Next.js 15 with a PostgreSQL database (Prisma ORM), Stripe for billing, PostHog for analytics, and Sentry for error tracking. The US launch uses existing infrastructure — no new services required.

---

## 1. SIGNUP ENDPOINT

### Finding 1.1 — /api/signup reliability
**Route:** `src/app/api/signup/route.ts`
**Risk Level: MEDIUM**

**What works well:**
- Auth.js session creation is handled server-side
- PostHog analytics event `signupSuccessClient` fires client-side on success

**Gaps identified:**
- No rate-limit beyond Turnstile on the signup endpoint
- Email uniqueness conflict returns an error — verify the client shows a clear "email already in use" message rather than a generic 400
- If the database connection drops during signup, the user gets a 500 with no recovery path

**Remediation:**
- Add explicit database connection retry (Prisma connection pool handles this, but verify `DATABASE_URL` has `connection_limit` appropriate for concurrent signups)
- Ensure `POST /api/signup` returns a specific error code for email conflicts (e.g., `USER_EMAIL_EXISTS`) so the client can show the correct message

---

## 2. AUTH RELIABILITY

### Finding 2.1 — Session expiry handling exists
**Evidence:** `posthog-conversion-events.ts:18–20` — `sessionExpiredRedirected` and `authSessionExpiredRecoveryViewed` events are tracked, indicating an existing session recovery flow.

**Status: Adequate**

### Finding 2.2 — OAuth callback failure tracking
**Evidence:** `posthog-conversion-events.ts:13` — `authOAuthSigninFailed` event exists.

**Status: Adequate** — failures are tracked

### Finding 2.3 — Auth secret validation
**Evidence:** `route.ts:83–89` — `hasConfiguredAuthSecret()` checks `AUTH_SECRET` or `NEXTAUTH_SECRET`. If missing, checkout returns 401.

**Risk:** If `AUTH_SECRET` is rotated in production, all existing sessions immediately expire. Rotation must be coordinated with a deployment.

**Remediation:**
- Document that `AUTH_SECRET` rotation requires immediate deployment + cache clear
- Add monitoring: high spike in `sessionExpiredRedirected` events = secret was rotated without deployment

---

## 3. CHECKOUT RELIABILITY

### Finding 3.1 — Stripe client availability check
**Evidence:** `route.ts:402–411` — `getStripeClient()` is called and returns 503 if unavailable.

**Status: Good** — graceful degradation exists.

### Finding 3.2 — No retry on Stripe API failures
**Evidence:** `route.ts:504` — `stripe.checkout.sessions.create()` single attempt with no retry.

**Risk:** Stripe's API has documented P99 latency of 200–500ms and rare 500 errors. A single transient Stripe error causes the user to see "Unable to start checkout. Try again shortly."

**Single point of failure confirmed.**

**Remediation:**
```typescript
// Wrap stripe.checkout.sessions.create() in a retry:
async function createCheckoutSessionWithRetry(stripe, params, maxRetries = 1) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await stripe.checkout.sessions.create(params);
    } catch (e) {
      if (attempt === maxRetries) throw e;
      if (e instanceof Stripe.errors.StripeAPIError && e.statusCode >= 500) {
        await new Promise(r => setTimeout(r, 500)); // wait 500ms before retry
        continue;
      }
      throw e; // non-retryable errors (400, auth) throw immediately
    }
  }
}
```

---

### Finding 3.3 — Idempotency key not set on checkout session creation
**Evidence:** `route.ts:504` — `stripe.checkout.sessions.create({ ... })` has no `idempotencyKey`

**Risk:** If the network connection drops after Stripe processes the request but before the response arrives, a duplicate session may be created if the user retries.

**Remediation:**
```typescript
// Add idempotency key to checkout session creation:
const idempotencyKey = `checkout-${userId}-${tier}-${duration}-${Date.now()}`;
const checkoutSession = await stripe.checkout.sessions.create(
  { /* params */ },
  { idempotencyKey }
);
```

---

## 4. WEBHOOK RELIABILITY

### Finding 4.1 — Idempotency is properly implemented
**Evidence:**
- `src/lib/stripe/stripe-webhook-idempotency.ts` — claim-first model via DB insert
- `route.ts:137–173` — claim attempt, duplicate detection, release on failure

**Status: STRONG** — duplicate webhook delivery is handled correctly.

### Finding 4.2 — Webhook verification is properly implemented
**Evidence:** `route.ts:92–109` — `constructStripeWebhookEvent()` uses Stripe signature verification.

**Status: Secure**

### Finding 4.3 — Webhook handler timeout risk
**Evidence:** `route.ts:46–250` — the webhook handler does DB operations, sends notifications, fires PostHog events. No timeout guard.

**Risk:** If the DB is slow (>10s), the Stripe webhook returns 500 and Stripe retries. The retry will be a duplicate, which the idempotency claim will correctly skip. However, repeated timeouts could cause Stripe to disable webhook delivery after 3 consecutive failures.

**Remediation:**
- Add a `Promise.race()` timeout wrapper for the webhook handler (max 8 seconds)
- Return 200 immediately for timeout cases (trade accuracy for delivery guarantee)
- Or: move heavy processing to a background queue (more architectural)

---

## 5. SUBSCRIPTION SYNC RELIABILITY

### Finding 5.1 — Cron-based Stripe reconciliation exists
**Evidence:** `src/app/api/cron/stripe-reconcile/route.ts` and `src/lib/stripe/stripe-subscription-reconciliation-run.ts`

**Status: GOOD** — a reconciliation cron job runs to catch missed webhooks.

### Finding 5.2 — Billing integrity summary endpoint exists
**Evidence:** `src/app/api/admin/billing/integrity-summary/route.ts`

**Status: GOOD** — admin can audit subscription sync state.

---

## 6. DASHBOARD LOAD RELIABILITY

### Finding 6.1 — Learner shell has graceful degradation
**Evidence:** `src/app/(app)/app/(learner)/layout.tsx:300–366` — uses `safeOptional()` wrappers for all non-critical shell loads (pathway nav, study next block, exam date state). Each has individual timeout budgets.

**Specific timeouts found:**
- Paywall home stats: 900ms timeout (`layout.tsx:308`)
- Pathway nav: no explicit timeout, but uses `safeOptional()` with fallback to cached nav
- Study next block: `safeOptional()` with null fallback

**Status: GOOD** — the dashboard degrades gracefully if individual services are slow.

### Finding 6.2 — Auth session failure shows gate component
**Evidence:** `layout.tsx:239–241` — `if (!userId) { return <LearnerUnauthenticatedGate /> }`

**Status: GOOD** — session failures don't cause crashes.

---

## 7. LESSON LOAD RELIABILITY

### Finding 7.1 — Content loads from database
**Evidence:** `src/app/(app)/app/(learner)/lessons/` directory structure

**Gap:** No explicit confirmation of CDN caching for lesson content. If lessons are database-rendered per request, high concurrent US traffic could cause DB load spikes.

**Remediation:**
- Verify lesson HTML is cached at CDN level (Vercel edge caching or equivalent)
- Check if `export const revalidate = 3600;` or similar is set on lesson pages
- If not: add `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` to lesson routes

---

## 8. CAT EXAM RELIABILITY

### Finding 8.1 — CAT exam starts tracked
**Evidence:** `posthog-conversion-events.ts:145` — `learnerCatExamStarted` fires on CAT session creation via API.

**Gap:** No explicit reliability guard found for `/api/exams/submit`. If the CAT submission fails (DB write fails), the learner's exam results are lost.

**Evidence:** `src/app/api/exams/submit/route.ts` exists.

**Remediation:**
- Verify `/api/exams/submit` has error handling that returns a clear error and does NOT silently drop the exam
- Consider local storage backup of CAT answers in case of network failure during submission

---

## 9. FLASHCARD RELIABILITY

### Finding 9.1 — Flashcard review API exists
**Evidence:** `src/app/api/flashcards/cards/[cardId]/review/route.ts`

**Status:** No specific reliability concerns identified. SM-2 spaced repetition state is DB-backed.

---

## 10. SINGLE POINTS OF FAILURE

| System | SPOF Risk | Mitigation Exists | Action |
|---|---|---|---|
| Stripe API (checkout) | HIGH — no retry | ❌ None | Add 1-retry with 500ms delay |
| Database (signup, checkout) | HIGH | ✅ Prisma pool | Verify connection limits for US load |
| Stripe webhooks (sub activation) | MEDIUM | ✅ Cron reconciliation | None needed |
| Auth secret rotation | MEDIUM | ❌ No guard | Document rotation procedure |
| Webhook handler timeout | MEDIUM | ❌ No timeout guard | Add 8s timeout + 200 fallback |
| Lesson CDN caching | MEDIUM | Unknown | Verify cache headers |
| CAT exam submission failure | MEDIUM | Unknown | Verify error handling + local backup |

---

## RELIABILITY REMEDIATION PRIORITY

| Task | Severity | Effort | Day |
|---|---|---|---|
| Add retry to `stripe.checkout.sessions.create()` | HIGH | 2h | Day 2 |
| Add idempotency key to checkout session creation | HIGH | 1h | Day 2 |
| Verify lesson CDN caching | MEDIUM | 2h | Day 3 |
| Add webhook handler timeout (8s) | MEDIUM | 2h | Day 4 |
| Verify CAT submission error handling | MEDIUM | 2h | Day 3 |
| Document auth secret rotation procedure | MEDIUM | 1h | Day 5 |
| Load test signup endpoint with 100 concurrent users | MEDIUM | 4h | Day 6 |
