# Subscription owner notifications — production verification pass

**Status:** Repo and automated checks verified in this workspace on **2026-05-09**. **Production is not confirmed** from Stripe, DigitalOcean, Resend, or Twilio dashboards (no access). Use the checklists below as an **operator** runbook.

**Related:** Architecture and root-cause history — `reports/subscription-notifications-pipeline.md`.

---

## 1. Webhook path truth (single source of truth)

| Source | Path | Role |
|--------|------|------|
| **Canonical (Next.js App Router, production billing)** | `POST /api/subscriptions/webhook` | Implemented in `nursenest-core/src/app/api/subscriptions/webhook/route.ts`. **Configure Stripe and TLS to hit this path on the host that runs this Next app.** |
| Legacy Express monolith (`server/index.ts`, rate limits, resilience lists) | `POST /api/stripe/webhook` | **Different stack** — not the nursenest-core App Router handler. Misconfiguring Stripe to this path while production is Next-only will break or bypass the intended flow. |
| `server/docs/WEBHOOK_IDEMPOTENCY.md` | Documents `/api/stripe/webhook` | Describes the **Express** webhook, not Next. |
| `RESTORE.md` (repo root) | Example `https://your-domain.com/api/stripe/webhook` | **Stale / misleading** for current Next production — treat as historical restore notes only. |

**Recommendation:** Treat **`docs/INTEGRATIONS_RUNBOOK.md`**, **`docs/stripe-webhook-production-operations.md`**, **`docs/environment-reference.md`**, and **`docs/production-safety-checklist.md`** as the aligned operator narrative for Next + DigitalOcean. Any doc or runbook that still says “`/api/stripe/webhook`” for **production NurseNest Next** should be corrected in a follow-up PR (this report flags `RESTORE.md` and `server/docs/WEBHOOK_IDEMPOTENCY.md` as context-dependent).

**Production webhook URL pattern (customer-specific host):**

`https://<production-domain>/api/subscriptions/webhook`

Example cited in-repo for NurseNest production hostname: `https://www.nursenest.ca/api/subscriptions/webhook` (see `docs/stripe-webhook-production-operations.md`).

---

## 2. Stripe Dashboard checklist

- [ ] **Developers → Webhooks → endpoint URL** is exactly `https://<your-production-domain>/api/subscriptions/webhook` (no `/api/stripe/webhook` unless you intentionally route to the legacy server).
- [ ] **Signing secret** in the app environment is **`STRIPE_WEBHOOK_SECRET`** and matches **this** endpoint (rotate if you recreated the endpoint).
- [ ] **Events to deliver** include at least the handled allowlist from `src/lib/stripe/stripe-webhook-event-policy.ts`:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `charge.refunded` (handled as audit-only in apply path)
- [ ] **Delivery logs** show **2xx** for real traffic; investigate **4xx** (e.g. missing/wrong `STRIPE_WEBHOOK_SECRET`, bad body) vs **5xx** (app errors).

---

## 3. DigitalOcean App Platform — environment variable **names** (no values)

Set on the **runtime** web component (`source_dir: nursenest-core` per README / `.do/app-nursenest-core-next.yaml`). Values belong only in DO secrets / env UI.

### Stripe (webhook + checkout)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL` (billing return URLs; see `docs/environment-reference.md`)
- Optional: `STRIPE_WEBHOOK_TOLERANCE_SECONDS`
- Optional: `NURSE_NEST_STRIPE_ENFORCE_LIVE` (webhook logs key mode mismatch when set with prod-like env)
- All required **`STRIPE_PRICE_*`** keys for plans you sell (from `pricing-map` / checkout — not duplicated here)

### Owner email (Resend)

- `RESEND_API_KEY`
- Optional sender override: `RETENTION_EMAIL_FROM`, `PASSWORD_RESET_EMAIL_FROM` (used by `src/lib/email/resend-transactional.ts`; default sender is Resend onboarding domain if unset)

### Owner SMS (Twilio REST in `subscription-owner-notify.ts`)

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- **From number (either name accepted):** `TWILIO_SMS_FROM` **or** `TWILIO_FROM_NUMBER` (code checks both; prefer documenting one canonical name in your internal secrets doc to avoid drift)

### Owner notification recipients + test mode

- `ADMIN_SUBSCRIPTION_NOTIFY_EMAIL` (optional; required for owner email)
- `ADMIN_SUBSCRIPTION_NOTIFY_PHONE` (optional; E.164; required for owner SMS)
- `ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE` — set `1` / `true` / `yes` to allow **Stripe test-mode** events to send owner alerts (default: **live mode only** for invoice path; checkout eligibility mirrors product rules in tests)

### Gated admin SMS (`admin-paid-subscription-sms.ts`, separate from owner notify)

- `ADMIN_SMS_NOTIFICATIONS_ENABLED=true`
- `SMS_PROVIDER=twilio`
- `ADMIN_SMS_TO_NUMBER`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and **`TWILIO_FROM_NUMBER` or `TWILIO_SMS_FROM`**

### Database (required for dedupe + entitlements)

- `DATABASE_URL` — owner notify idempotency uses Prisma table **`stripeOwnerPaidSubscriptionNotify`**; entitlements apply in the same webhook transaction path.

**Cross-check:** `nursenest-core/.env.example` documents `NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` only; **owner notify / Twilio / admin SMS names are documented in** `docs/INTEGRATIONS_RUNBOOK.md` **and** `docs/environment-reference.md` **— not all appear in `.env.example`.**

---

## 4. Manual test matrix (production or staging with live dashboard access)

| Scenario | Stripe / app expectation | Owner notify expectation |
|----------|---------------------------|---------------------------|
| **Trial-first checkout** (`trialing`, `amount_total` 0) | Webhook **2xx**; subscription row reflects trial/active per product rules | Eligible paths should schedule email/SMS per `shouldOwnerNotifyPaidSubscriptionCheckout` (see unit tests) |
| **Paid checkout** (immediate charge) | Webhook **2xx**; **ACTIVE** entitlement | Checkout owner notify scheduled when eligible |
| **$0 invoice** (`amount_paid === 0`, `billing_reason: subscription_create`) | Entitlement / repair logic as implemented | Invoice owner notify allowed when eligible (`invoiceOwnerNotifyAmountEligible`) |
| **Paid invoice** (first or recurring) | First-cycle invoice path may notify; renewals logged as skipped for owner invoice template | See `apply-stripe-webhook-event` logs for `invoice_notification_skipped` on `subscription_cycle` |
| **Duplicate Stripe delivery** (same `evt_*`) | **200**, idempotent claim — **no double DB apply** | **`stripeOwnerPaidSubscriptionNotify`** dedupe by event id — **no double-send** |
| **Resend/Twilio failure** | Webhook should still complete **entitlement DB work** before deferred `after()` work | Notify failures are caught/logged in `subscription-owner-notify.ts` jobs — **must not roll back** subscription row updates already committed in the handler |

---

## 5. Provider dashboards (human)

### Resend

- Outbound messages at times matching test checkouts/invoices.
- **From** domain alignment with `RETENTION_EMAIL_FROM` / `PASSWORD_RESET_EMAIL_FROM` or default onboarding sender.
- Bounces / domain verification errors.

### Twilio

- Message logs for **`ADMIN_SUBSCRIPTION_NOTIFY_PHONE`** (owner) and **`ADMIN_SMS_TO_NUMBER`** (gated admin path).
- **From** number must match **`TWILIO_SMS_FROM` or `TWILIO_FROM_NUMBER`** and be SMS-capable on your account.
- 216xx / permission errors if From/To/geo is wrong.

---

## 6. Commands run in this environment (exit status)

| Command | Working directory | Exit |
|---------|-------------------|------|
| `npm run test:unit:stripe` | `nursenest-core/` | **0** |
| `npm run typecheck:critical` | `nursenest-core/` | **0** |

**Included in `test:unit:stripe`:** `stripe-webhook-signature-contract.test.ts`, `stripe-webhook-policy.test.ts`, `subscription-owner-notify.test.ts`, `subscription-owner-notify-invoice-eligibility.test.ts` (see `package.json`).

**Stripe CLI:** **`stripe` was not installed** in this environment — live `stripe listen` / `stripe trigger` were **not run**. When installed, follow `docs/INTEGRATIONS_RUNBOOK.md`:

```bash
stripe listen --forward-to http://127.0.0.1:3000/api/subscriptions/webhook
```

Copy the printed **`whsec_…`** into **`STRIPE_WEBHOOK_SECRET`** for local forwarding. Trigger representative events (e.g. `checkout.session.completed`, `invoice.payment_succeeded`) as needed for manual verification; exact flags depend on your Stripe CLI version (`stripe trigger --help`).

---

## 7. What is confirmed here vs what requires production confirmation

| Confirmed in repo / this run | Requires operator / dashboard |
|------------------------------|--------------------------------|
| Canonical route is **`/api/subscriptions/webhook`**; legacy **`/api/stripe/webhook`** is Express-only | Stripe endpoint URL and TLS reachability |
| Handled event type allowlist in code | Stripe “Send test webhook” / delivery logs for each needed type |
| Unit tests pass for signing, policy, owner eligibility, invoice $0 eligibility | End-to-end delivery to real inboxes/phones |
| Owner notify uses **`after()`** and try/catch — designed not to break entitlement apply | Resend/Twilio dashboards show successful sends under load |
| Env var **names** traced from implementation | Correct **values**, rotation, and DO secret wiring |

**Closing:** **Repo verified; production pending operator checklist** (Stripe + DO + Resend + Twilio).
