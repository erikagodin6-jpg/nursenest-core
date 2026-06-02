# NurseNest critical flows (manual / smoke)

Run against a staging or local stack with env vars set (`DATABASE_URL`, Stripe test keys, `NEXT_PUBLIC_SENTRY_DSN` optional).

## 1. New user — signup → start exam

1. Open `/signup`, create an account (unique email).
2. Complete checkout with Stripe **test** card `4242 4242 4242 4242` if paywall applies.
3. Open `/app/exams` as subscriber; confirm **Practice** UI loads and **Start** flow creates a session (network: `POST /api/exams/start` → 200).
4. Answer a question; confirm `PATCH /api/exams/session` fires (debounced).
5. Refresh mid-exam; confirm progress restores (`GET /api/exams/session`).

## 2. Paid user — premium + complete exam

1. With an **ACTIVE** subscription in DB (or via webhook after checkout), open `/app/questions` and `/app/lessons` — expect 200, no paywall.
2. Finish an exam; `POST /api/exams/submit` with `sessionId` + `answers` returns scored attempt; no duplicate attempts on repeat submit (idempotent).

## 3. Edge cases

| Scenario | How to verify |
|----------|----------------|
| Refresh mid-exam | Reload `/app/exams`; same session resumes from `localStorage` + `GET /api/exams/session`. |
| DB failure | Temporarily break `DATABASE_URL` or pause DB; API returns 503, `safeServerLogCritical` + Sentry event (if DSN set). |
| Expired / failed payment | Use Stripe test to trigger `invoice.payment_failed` or mark subscription `PAST_DUE` / `CANCELLED`; confirm `/app` paywall or gated APIs return 403 as designed. |
| Test vs live Stripe | `sk_test` in production-like env should log `stripe_webhook secret_key_is_test_in_prod_like_env` (stderr). Use matching webhook secret from the same Stripe mode. |

## 4. Automation (optional)

No full E2E suite in-repo; use this list as release smoke before deploy.
