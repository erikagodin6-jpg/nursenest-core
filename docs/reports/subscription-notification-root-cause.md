# Subscription Notification Root Cause — P0 Investigation
**Date:** 2026-06-01  
**Severity:** P0 — Revenue events were silent  
**Status:** Root causes identified + fixes implemented

---

## Executive Summary

Successful Stripe subscriptions were not generating owner notifications. The root causes are:

1. **`sendRevenueAlertOrThrow` accepted a DB audit log write as "delivered"** — email and SMS could both fail, and the function would still not throw, so Stripe never retried the webhook.
2. **Missing subscriber confirmation email** — no email was ever sent to the paying subscriber. The system only sent admin notifications.
3. **Silent env var skips** — `RESEND_API_KEY` and `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL` absent caused all email notifications to silently return `ok: false` without surfacing as a fatal error.
4. **Test-mode filter silently drops events** — `ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE` not set means test-mode Stripe events produce zero notifications with no log at `ERROR` level.
5. **Three conflicting SMS env var schemas** — three different SMS dispatch paths each require a different combination of variables, making it easy to configure some but not all.

---

## Root Cause 1 — `sendRevenueAlertOrThrow` accepted audit log as "delivered"

**File:** `src/lib/revenue-alerts/revenue-alerts.ts`

```typescript
// BEFORE — broken delivery check
const delivered = externalDelivered || Boolean(auditLogId); // ← DB write counts as delivered!

export async function sendRevenueAlertOrThrow(input): Promise<RevenueAlertSendResult> {
  const result = await sendRevenueAlert(input);
  if (!result.delivered) throw new Error(...); // Never throws if DB write succeeded
  return result;
}
```

**Impact:** Even if `RESEND_API_KEY` is missing AND Twilio is not configured, `sendRevenueAlertOrThrow` returned success as long as the audit log row was written. The webhook returned HTTP 200 to Stripe, so Stripe never retried. Owner received no email, no SMS.

**Fix:** `sendRevenueAlertOrThrow` now requires at least one **external** channel (email or SMS) to deliver. Audit log alone is not sufficient. If only the DB write succeeded, it throws so Stripe retries the webhook.

---

## Root Cause 2 — Missing subscriber confirmation email

**File:** None existed — subscriber email was never implemented.

**Impact:** Paying subscribers received no confirmation, plan details, or receipt from NurseNest. Only the admin/owner notifications were sent.

**Fix:** New `src/lib/stripe/subscriber-confirmation-email.ts` sends a structured HTML email to the subscriber's email address on `checkout.session.completed` with: plan, pathway, amount, country, and timestamp.

---

## Root Cause 3 — Silent email skip on missing `RESEND_API_KEY`

**File:** `src/lib/email/resend-transactional.ts` line 27–37

```typescript
if (!key) {
  if (isProd) console.error("[NurseNest][CRITICAL] RESEND_API_KEY not set...");
  return { ok: false, skippedReason: "no_resend_key" }; // ← Silent skip, no throw
}
```

The caller logs the failure, but:
- `scheduleOwnerPaidSubscriptionCheckoutNotificationsIfEligible` only throws when BOTH email AND phone are unset. If email is set but `RESEND_API_KEY` is missing, and phone is not set, it throws. But if `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL` is set while `RESEND_API_KEY` is missing and phone IS set, the SMS delivers but email silently fails — `delivered = true`.

**Fix:** Boot-time validation (new `src/lib/stripe/notification-boot-validator.ts`) emits a `console.error` at process startup for each missing critical var.

---

## Root Cause 4 — Test-mode events silently dropped

**File:** `src/lib/stripe/subscription-owner-notify-eligibility.ts` line 33

```typescript
if (!input.eventLivemode && !includeTestModeOwnerNotifies()) return false; // ← Silent drop
```

**File:** `src/lib/stripe/subscription-owner-notify.ts` line 354, 513

```typescript
if (!args.event.livemode && !shouldIncludeTestModeOwnerNotifies()) return; // ← Silent return
```

When developers test with Stripe test keys, zero notifications fire. The log entry for this is `checkout_notify_skipped_ineligible` at severity `"info"` — easy to miss.

**Fix:** Elevated to `"warning"` severity when a live-mode-looking subscription amount is present. Documentation added.

---

## Root Cause 5 — Three conflicting SMS env var schemas

| Path | Required env vars |
|---|---|
| `sendTwilioSmsIfConfigured` (checkout/invoice notify) | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, `ADMIN_SUBSCRIPTION_NOTIFY_PHONE` |
| `sendAdminPaidSubscriptionSms` (legacy SMS) | `ADMIN_SMS_NOTIFICATIONS_ENABLED=true`, `SMS_PROVIDER=twilio`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` OR `TWILIO_SMS_FROM`, `ADMIN_SMS_TO_NUMBER` |
| `sendSms` in revenue-alerts | `REVENUE_ALERT_SMS_TO` OR `ADMIN_SUBSCRIPTION_NOTIFY_PHONE` OR `ADMIN_SMS_TO_NUMBER`, plus `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM` OR `TWILIO_FROM_NUMBER` |

Setting only some of these causes silent skips on specific paths.

---

## Webhook Flow — Complete Map

```
POST /api/subscriptions/webhook
  → constructStripeWebhookEvent (signature verify)
  → claimStripeWebhookEventOrDuplicate (idempotency)
  → applyStripeWebhookEvent()

    checkout.session.completed:
      → prisma.subscription.upsert()            [DB write — succeeds]
      → syncUserFromCheckoutSessionMetadata()   [DB write — succeeds]
      → scheduleOwnerPaidSubscriptionCheckoutNotificationsIfEligible()
          ↳ shouldOwnerNotifyPaidSubscriptionCheckout (livemode gate, amount gate)
          ↳ runOwnerPaidSubscriptionCheckoutNotificationsJob()
              ↳ sendTransactionalEmailHtml() → RESEND_API_KEY required
              ↳ sendTwilioSmsIfConfigured() → TWILIO_* + ADMIN_SUBSCRIPTION_NOTIFY_PHONE
              ↳ throws if !delivered → Stripe retries
      → notifyRevenueAlert()                    [FIXED: now throws if no external channel]
          ↳ sendRevenueAlert()
              ↳ sendTransactionalEmailHtml()
              ↳ sendSms()
              ↳ sendWebhook() [discord/slack]
              ↳ writeAuditLog() [emailNotificationLog row]
      → notifyAdminPaidSubscriptionSms()        [legacy SMS path]
      → [NEW] sendSubscriberConfirmationEmail()  [subscriber email]
```

---

## Required Environment Variables

### Critical (notifications completely silent without these)

| Variable | Purpose | Where to set |
|---|---|---|
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification | DigitalOcean App Platform |
| `RESEND_API_KEY` | Email transport — without this, ALL emails skip | DigitalOcean App Platform |
| `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL` | Admin/owner email address | DigitalOcean App Platform |

### Recommended (SMS notifications)

| Variable | Purpose |
|---|---|
| `ADMIN_SUBSCRIPTION_NOTIFY_PHONE` | Owner phone (E.164 format, e.g. +1…) |
| `TWILIO_ACCOUNT_SID` | Twilio account |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_SMS_FROM` | Twilio sending phone number |

### Optional

| Variable | Purpose |
|---|---|
| `ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE=1` | Fire notifications for Stripe test-mode events |
| `REVENUE_ALERT_EMAIL` | Alternative admin email (falls back to `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL`) |
| `REVENUE_ALERT_SMS_TO` | Alternative SMS recipient |
| `RETENTION_EMAIL_FROM` | Sender name/address for transactional emails |

---

## Fixes Implemented

| # | File | Fix |
|---|---|---|
| 1 | `src/lib/revenue-alerts/revenue-alerts.ts` | `sendRevenueAlertOrThrow` now requires external delivery (email OR SMS), not just audit log |
| 2 | `src/lib/stripe/subscriber-confirmation-email.ts` | **New** — sends HTML confirmation email to subscriber on successful checkout |
| 3 | `src/lib/stripe/apply-stripe-webhook-event.ts` | Wired subscriber confirmation email into `checkout.session.completed` handler |
| 4 | `src/lib/stripe/notification-boot-validator.ts` | **New** — boot-time validation that logs critical errors for missing env vars |
| 5 | `src/app/api/subscriptions/notification-health/route.ts` | **New** — GET endpoint returning full notification channel health status |
| 6 | `src/lib/stripe/subscription-owner-notify.ts` | Elevated test-mode skip log from `info` to `warning` when amount > 0 |

---

## Verification Steps

After deploying and setting env vars:

1. **Health check:** `GET /api/subscriptions/notification-health` → verify all channels show `configured: true`
2. **Test webhook:** Run `stripe trigger checkout.session.completed` (Stripe CLI) with `ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE=1`
3. **Verify:** Owner email received + admin dashboard `emailNotificationLog` row created + SMS delivered
4. **Subscriber:** Verify subscriber's email received with plan/amount/country/timestamp
5. **Real payment:** Create a live Stripe test subscription and confirm all channels fire

---

## Success Criteria

Every successful payment MUST result in:
- [ ] Admin email sent to `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL`
- [ ] Admin SMS sent to `ADMIN_SUBSCRIPTION_NOTIFY_PHONE` (when Twilio configured)
- [ ] `emailNotificationLog` row created (admin dashboard record)
- [ ] Subscriber confirmation email sent to subscriber's Stripe email address
- [ ] If any external channel fails → Stripe webhook returns 500 → Stripe retries up to 72h
