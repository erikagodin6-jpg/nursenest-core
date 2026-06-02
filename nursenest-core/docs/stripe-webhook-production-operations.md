# Stripe webhook — production operations (NurseNest)

Canonical implementation: `src/app/api/subscriptions/webhook/route.ts` (signature verification, idempotency, apply). This document is **operator** steps only — no product/price changes.

## 1. Canonical production webhook URL

Use this exact URL for **live** Stripe webhooks:

**`https://www.nursenest.ca/api/subscriptions/webhook`**

Do **not** point live traffic at `https://app.nursenest.ca/...` until that hostname presents a **valid TLS certificate for `app.nursenest.ca`** (SNI). DNS alone is insufficient; Stripe will report connection failures if TLS fails.

## 2. Signing secret (env ↔ Stripe Dashboard)

| Item | Detail |
|------|--------|
| **Env var** | `STRIPE_WEBHOOK_SECRET` — must be the **Signing secret** (`whsec_…`) for the **same** webhook endpoint URL Stripe calls. |
| **Code** | `route.ts` reads `process.env.STRIPE_WEBHOOK_SECRET`; verification uses `constructStripeWebhookEvent` in `stripe-webhook-verify.ts`. |
| **Optional** | `STRIPE_WEBHOOK_TOLERANCE_SECONDS` — forwarded to Stripe SDK signature tolerance when set. |

**If you add a new endpoint in Stripe** (new URL or recreate): Stripe issues a **new** signing secret. Update `STRIPE_WEBHOOK_SECRET` in your deployment **before** or **immediately when** switching traffic, then redeploy/restart so the runtime sees the new value.

## 3. Rotate or update the signing secret

1. Stripe Dashboard → **Developers** → **Webhooks** → select the endpoint (canonical URL above).
2. **Reveal** signing secret → copy `whsec_…`.
3. Set **`STRIPE_WEBHOOK_SECRET`** on the web service (e.g. DigitalOcean App Platform env).
4. **Deploy** or **restart** so the new secret is loaded (depends on platform; env-only changes often need a release).
5. **Send test webhook** from the Dashboard; expect **HTTP 2xx** and structured logs (`stripe_webhook` / `event_received`).

## 4. Test reachability safely (not a full verification)

These checks prove **network + TLS + route** only. They do **not** prove signature verification (that requires a real `Stripe-Signature` header).

1. **TLS / SNI:** `openssl s_client -connect www.nursenest.ca:443 -servername www.nursenest.ca` — handshake should succeed (`Verify return code: 0`).
2. **HTTP route:**  
   `curl -sS -o /dev/null -w "%{http_code}\n" -X POST "https://www.nursenest.ca/api/subscriptions/webhook" -H "Content-Type: application/json" -d "{}"`  
   **Expected: `400`** — handler rejects missing `stripe-signature` / misconfiguration path per `route.ts`. **`400` here is good** for reachability smoke; **`000`** or TLS errors mean the host is wrong or TLS is broken.

## 5. Cut live traffic from a broken hostname (e.g. `app.nursenest.ca`)

1. In Stripe Dashboard → Webhooks, **disable or delete** the endpoint whose URL uses a hostname that **fails TLS** (do not leave it active if you are not fixing SSL immediately).
2. **Add or edit** an endpoint to **`https://www.nursenest.ca/api/subscriptions/webhook`** (or confirm one already exists and is the only live receiver you want).
3. Copy that endpoint’s **Signing secret** into **`STRIPE_WEBHOOK_SECRET`** if it changed.
4. Redeploy/restart if env changed.
5. Confirm **Recent deliveries** show **2xx** for new events.

## 6. Replay missed events after cutover

1. Complete steps in §5 so new events hit `www`.
2. Stripe Dashboard → **Webhooks** → your endpoint → **Event deliveries** (or **Developers → Events**).
3. For each failed delivery in the affected window: **Resend** (or use [Stripe CLI](https://stripe.com/docs/cli) `stripe events resend <evt_…>` where appropriate).
4. **Verify fulfillment:** subscription rows, invoice state, entitlements for customers in the window (`apply-stripe-webhook-event` paths); check logs / Sentry for `stripe_webhook` `handler_failed`.
5. Confirm **signed** deliveries return **2xx** (not only the §4 curl smoke).

## 7. Related docs

- Full integration context: `docs/INTEGRATIONS_RUNBOOK.md` § Billing (Stripe).
- Env index: `docs/environment-reference.md`.
