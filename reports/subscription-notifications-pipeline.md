# Subscription notifications pipeline (Stripe → entitlements → email/SMS)

## Root cause (production)

1. **Owner email/SMS never scheduled for common trial-first checkouts**  
   `shouldOwnerNotifyPaidSubscriptionCheckout` required Stripe subscription status **`active`** and **`amount_total > 0`**. Many real checkouts complete with status **`trialing`** and **`amount_total === 0`** (trial start). Those notifications were skipped entirely.

2. **Invoice fallback also skipped $0 first invoices**  
   `scheduleOwnerPaidSubscriptionInvoicePaymentSucceededNotification` required **`amount_paid > 0`**. Stripe's first invoice for a trial often has **`amount_paid === 0`** with **`billing_reason: subscription_create`**, so the invoice path did not run either.

3. **Post-response work was not tied to Next's lifecycle**  
   Owner notifications were queued with a bare `Promise.resolve().then(...)`, which can be **cut off** when a serverless invocation ends right after the webhook HTTP response. Notifications are now scheduled with **`after()` from `next/server`**, which extends the invocation until the work finishes on Vercel-style runtimes.

4. **Twilio "from" number env mismatch**  
   Owner SMS used **`TWILIO_SMS_FROM`** only; the gated admin SMS path used **`TWILIO_FROM_NUMBER`**. Operators who set only one variable saw SMS skipped or misconfigured depending on path.

5. **Orphan subscription admin SMS used an empty Stripe event id**  
   `notifyAdminPaidSubscriptionSms` was called with `event.id === ""`, breaking **idempotency claims** and dedupe semantics for `stripeOwnerPaidSubscriptionNotify`.

## Deployed webhook URL (code)

- **Next.js App Router (production billing):** `POST /api/subscriptions/webhook`  
  Implementation: `nursenest-core/src/app/api/subscriptions/webhook/route.ts`  
  Signing secret env: **`STRIPE_WEBHOOK_SECRET`**

A legacy Express stack under `server/` documents **`POST /api/stripe/webhook`**; the nursenest-core product path for subscriptions is **`/api/subscriptions/webhook`**. **Stripe Dashboard and DigitalOcean must point at the URL that actually runs this Next route** (path mismatch = no notifications and/or wrong handler).

## Stripe events handled (allowlist)

From `stripe-webhook-event-policy.ts`, applied in `apply-stripe-webhook-event.ts`:

| Event | Entitlements / DB | Owner notify (email/SMS) | Admin gated SMS |
| --- | --- | --- | --- |
| `checkout.session.completed` | Upserts subscription, syncs user | `scheduleOwnerPaidSubscriptionCheckoutNotificationsIfEligible` (Resend + Twilio to admin recipients) | `sendAdminPaidSubscriptionSms` if enabled |
| `customer.subscription.created` / `.updated` | Upserts subscription row | — | Orphan mirror path only |
| `customer.subscription.deleted` | Cancels row | — | — |
| `invoice.payment_succeeded` | Repairs ACTIVE, resurrects when needed | First cycle: `scheduleOwnerPaidSubscriptionInvoicePaymentSucceededNotification` when `billing_reason === "subscription_create"` (now allows `amount_paid === 0`) | — |
| `invoice.payment_failed` | PAST_DUE | — | — |

Idempotency: **`StripeWebhookEvent`** table stores `evt_*` before handler runs (duplicate delivery → 200, no re-apply). Owner notify dedupe uses **`stripeOwnerPaidSubscriptionNotify`** keyed by **that event's id** (checkout vs invoice are different ids; duplicate of the **same** event does not double-send).

## Required environment variable names (no values)

**Stripe**

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Optional: `STRIPE_WEBHOOK_TOLERANCE_SECONDS`

**Owner email (Resend)**

- `RESEND_API_KEY`
- Optional from addresses: `PASSWORD_RESET_EMAIL_FROM`, `RETENTION_EMAIL_FROM` (transactional sender; see `resend-transactional.ts`)

**Owner SMS (direct Twilio REST in `subscription-owner-notify.ts`)**

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- **`TWILIO_SMS_FROM` or `TWILIO_FROM_NUMBER`** (E.164; either is accepted after this fix)
- `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL` (optional but required for email)
- `ADMIN_SUBSCRIPTION_NOTIFY_PHONE` (optional but required for SMS)
- `ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE` — set to `true` / `1` / `yes` to allow **test-mode** Stripe events to trigger owner alerts (default: live only)

**Gated admin SMS (`admin-paid-subscription-sms.ts`, used from webhook for eligible subscriptions)**

- `ADMIN_SMS_NOTIFICATIONS_ENABLED=true`
- `SMS_PROVIDER=twilio`
- `ADMIN_SMS_TO_NUMBER` (E.164)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- **`TWILIO_FROM_NUMBER` or `TWILIO_SMS_FROM`**

This path **no-ops on Vercel preview** and when `NODE_ENV=test`.

## Production verification (human / dashboard)

You cannot confirm delivery from CI without real credentials.

1. **Stripe** — Webhook URL matches **`…/api/subscriptions/webhook`**; subscribed events include the allowlist; delivery logs show **2xx**; investigate **4xx/5xx** (wrong `STRIPE_WEBHOOK_SECRET`, etc.).

2. **DigitalOcean / runtime env** — Presence of webhook secret, Resend key if email required, Twilio + admin recipient vars; no test/live key mismatch.

3. **Resend / Twilio dashboards** — Outbound at subscription time; E.164 errors on From/To.

## Local Stripe CLI (webhooks)

```bash
stripe listen --forward-to http://127.0.0.1:3000/api/subscriptions/webhook
```

Set **`STRIPE_WEBHOOK_SECRET`** to the signing secret from `stripe listen` (whsec_…).

## Tests run in this change

- `cd nursenest-core && npm run test:unit:stripe`
- `cd nursenest-core && npm run typecheck:critical`

## Files changed

See git diff; key paths: `subscription-owner-notify*.ts`, `subscription-owner-notify-eligibility.ts`, `apply-stripe-webhook-event.ts`, `admin-paid-subscription-sms.ts`, `stripe-webhook-policy.test.ts`, `package.json` (`test:unit:stripe` list).

## Feature flags / gates

- **`ADMIN_SMS_NOTIFICATIONS_ENABLED`**, **`SMS_PROVIDER`**, preview/test noop for gated admin SMS.
- **`ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE`** for Stripe **test mode** owner alerts.

## Notes

- Internal **owner/admin** alerts only; learner-facing receipts are separate.
- Failed owner notify paths are **non-blocking** for entitlement updates (DB updates complete in the webhook handler before deferred notify work).

## See also

- **Production verification pass (commands, DO/Stripe checklists, test matrix):** `reports/subscription-notifications-production-verification.md`
