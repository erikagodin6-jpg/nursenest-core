# Production incident runbooks

Concise playbooks for on-call. Pair with `docs/alerting-runbooks.md` (alert wiring) and `docs/production-monitoring-alerts.md` (signals). **Default comms channel:** status page + in-app banner only after incident commander approves copy.

---

## 1) Homepage down

**Symptom:** Marketing `/` fails, synthetic `marketing_home` red, users see error/blank; regional hubs (`/us`, `/canada`) may also fail.

**How to confirm:** Browser or `curl -I` on production `/` and `/api/public/home-stats`. Check Vercel deployment status, recent deploy time, Sentry Issues with `feature`/`route` on marketing layout. Verify `GET /api/health` (liveness) vs `GET /api/health/ready` (DB).

**Likely causes:** Bad deploy (layout/data fetch throw), env var missing at build/runtime, upstream CDN/Edge issue, DB/read path for home stats blocking SSR, asset 404 after bad deploy.

**Immediate mitigation:** If correlated with deploy → **rollback** (Vercel: promote previous production deployment). If env-only → fix/redeploy with correct vars. If DB → see [DB slow or unavailable](#3-db-slow-or-unavailable). Disable non-essential marketing experiments if feature-flagged.

**Rollback guidance:** One-click **Instant Rollback** to last known-good deployment; confirm `/` and `/api/public/home-stats` return 200 before closing.

**User-facing communication:** Short status: *“We’re aware some visitors can’t load our homepage. We’re working on it.”* No root-cause promises in the first hour. Link to status page if you use one.

**Follow-up checks:** Re-run synthetics; spot-check `/` from two regions; verify PostHog/Sentry error volume drops; postmortem if >15 min customer impact.

---

## 2) Login / signup broken

**Symptom:** `/login` or credentials flow errors; signup API errors; spike in `auth.login.failure` / `signup_failed` structured logs; users stuck in redirect loops.

**How to confirm:** Attempt login in incognito; check `NEXTAUTH_URL`, cookie domain (apex vs `www`), Vercel deployment. Logs: `scope=structured` `event=auth_login_failed` / `signup_failed`; Sentry `auth.login.failure` by bucket. Verify IdP/DB: `GET /api/health/ready`.

**Likely causes:** DB down/slow (credential lookup), wrong `AUTH_*` / `NEXTAUTH_SECRET` / URL mismatch, rate limit (`rate_limited` bucket), email provider down (signup), middleware/proxy breaking `/app` session.

**Immediate mitigation:** If DB → scale pool / fix connectivity (see §3). If config → restore env in Vercel and redeploy. If abuse → tighten WAF/rate limits **only** after confirming real-user traffic pattern. Disable optional signup steps if clearly broken and safe.

**Rollback guidance:** Roll back auth-related deploy first; avoid changing secrets mid-incident unless verified wrong—coordinate with someone who has last-known-good env export.

**User-facing communication:** *“Sign-in may be slow or unavailable. We’re investigating. Try again shortly.”* For extended outage: *“We’re fixing an issue affecting new accounts and sign-in.”*

**Follow-up checks:** Synthetic login path; monitor `bad_password` vs `db_error` (latter = infra); verify session cookie on `/app` after fix.

---

## 3) DB slow or unavailable

**Symptom:** `/api/health/ready` non-200; `ready_database_unavailable` logs; Prisma `P1001`/`P2024`/timeouts; widespread 5xx on API routes; `db_query_failed` / `db_query_slow` spikes.

**How to confirm:** `GET /api/health/ready` with timeout; DB provider status page; connection pool metrics if available; grep structured logs `event=db_query_failed`, Sentry `db.client.error` bucket.

**Likely causes:** Provider outage, exhausted connections, network partition, runaway query, migration lock, disk full on DB tier.

**Immediate mitigation:** Pause non-critical jobs/crons if any; reduce traffic (temporary maintenance page **only** if comms approved); scale DB compute/connections per provider docs; kill long-running queries if identified; enable read replica routing if already wired.

**Rollback guidance:** Not code—**failover/restore** per provider. Schema rollback only with DBA judgment; prefer forward fix for app-level query limits.

**User-facing communication:** For broad impact: *“Some features are temporarily unavailable while we restore our database connection.”* Avoid technical jargon.

**Follow-up checks:** `health/ready` green 15+ min; error rates normalized; review slow-query logs and indexes; confirm pool size appropriate for traffic.

---

## 4) Question bank failing

**Symptom:** Learner `/app/questions` or practice UI shows errors, empty states, or endless load; `question_load_failed` in logs (server + client breadcrumbs); `flow:content` 5xx if route wrapped; user reports “questions won’t load.”

**How to confirm:** Reproduce as test user; `GET /api/questions` with expected query params (auth cookie); check Sentry for route stacks; structured `question_load_failed` with `correlationId`; Prisma errors on question tables; entitlements not wrongly blocking (`requireSubscriberSession`).

**Likely causes:** DB issue (see §3), bad deploy touching question SQL/entitlements, empty seed in env, protection middleware false positive, timeout on heavy list.

**Immediate mitigation:** Roll back recent deploy if correlated; if DB → §3; if single region—check Edge cache. Toggle **read-only** marketing message on learner hub only if product approves (“questions temporarily unavailable”).

**Rollback guidance:** Vercel rollback to release before question-bank change; verify one full practice session in staging mirror.

**User-facing communication:** *“Practice questions may not load right now. Your progress is safe; please try again soon.”*

**Follow-up checks:** E2E or manual path through question load; monitor `question_load_failed` rate; check discovery endpoint if filters fail.

---

## 5) Paywall proof missing

**Symptom:** Marketing/paywall shows neutral copy (no counts/learners proof); `marketing.paywall.proof_neutral` / `paywall_stats_unavailable` / structured `route` tied to home stats; UX looks “empty” but site loads.

**How to confirm:** `GET /api/public/home-stats` payload `proofDisplay` / counts; logs `paywall_stats_unavailable`; optional DB reads failing in handler.

**Likely causes:** Optional stats query failure, timeout, feature flag safe mode, DB partial outage, bad deploy in stats aggregation.

**Immediate mitigation:** If stats dependency is flaky—serve cached/static fallback **if** code path exists; else document degraded state. Fix DB/read path; do **not** fake numbers. Reduce homepage weight if SSR timing out.

**Rollback guidance:** Roll back only if a deploy introduced the regression; stats are often data/config—not always a code rollback.

**User-facing communication:** Usually **silent** (neutral copy is intentional degradation). Only announce if legal/compliance requires proof lines: *“Some homepage details may be simplified.”*

**Follow-up checks:** Counts restored; `proofDisplay` non-neutral in API; monitor `paywall_stats_unavailable` rate.

---

## 6) Checkout failing

**Symptom:** `POST /api/subscriptions/checkout` 4xx/5xx; `checkout_failed` structured logs + `billing.checkout.failure` reasons (`stripe_unavailable`, `session_failed`, etc.); users cannot start Stripe Checkout.

**How to confirm:** Reproduce with test account; Stripe status page; logs with `correlationId` on `checkout_failed`; verify Stripe keys (test vs live), price env vars, `publicAppOriginForBilling` / app URL. Check `checkout_started` vs failure ratio.

**Likely causes:** Stripe outage, invalid/missing price IDs, policy version mismatch, user unauthorized/expired session, demo user blocked, origin/header mismatch.

**Immediate mitigation:** If Stripe global outage—communicate and pause ads if needed; if config—fix env and redeploy; if session—extend cookie guidance to support. Do **not** disable webhook—fix forward.

**Rollback guidance:** Roll back deploy that touched checkout route or pricing map; verify checkout in **staging** with same Stripe mode before re-promoting.

**User-facing communication:** *“Checkout is temporarily unavailable. You won’t be charged until checkout completes successfully.”* Escalate to finance if payments stuck mid-flow.

**Follow-up checks:** Successful test checkout; Stripe dashboard for session creation; webhook delivery healthy (see §7).

---

## 7) Webhook backlog / failure

**Symptom:** `webhook_failed` / `billing.webhook.failure`; Stripe dashboard shows failed deliveries or retries; subscriptions/entitlements out of sync; spike in `phase:handler` or `dedupe`.

**How to confirm:** Stripe **Developers → Webhooks** delivery logs; our logs `webhook_received` vs `webhook_failed` with same `correlationId`; DB idempotency table errors; Sentry issues in `applyStripeWebhookEvent`.

**Likely causes:** Handler throw (code bug), DB write failure on dedupe, wrong `STRIPE_WEBHOOK_SECRET`, timeout, duplicate event processing edge case, **Stripe cannot reach the webhook URL** (TLS / wrong hostname — production canonical URL and recovery: `docs/stripe-webhook-production-operations.md`).

**Immediate mitigation:** Fix and deploy handler; **replay** failed events from Stripe UI after fix verified in staging. Do not rotate webhook secret during active queue without coordinating replay. If DB—§3. If deliveries show **connection / TLS errors**, fix the Dashboard endpoint URL or edge cert first (`stripe-webhook-production-operations.md` §5–§6).

**Rollback guidance:** Roll back **bad** deploy first; then replay webhooks—order matters. Document replay window for finance.

**User-facing communication:** Internal-first; users only if entitlements visibly wrong: *“Subscription status may be delayed; we’re syncing with our payment provider.”*

**Follow-up checks:** Webhook 200 rate; sample user entitlements match Stripe; no backlog in Stripe dashboard.

---

## 8) Deploy caused major errors

**Symptom:** Error rate jump aligned with deploy timestamp; Sentry new issues from new release; synthetics flip red right after promote.

**How to confirm:** Vercel deployment timeline vs Sentry issue **first seen**; compare `SENTRY_RELEASE` / git SHA; narrow to single route from Issue tags.

**Likely causes:** Incomplete migration, bad env with deploy, feature flag default wrong, dependency bump regression.

**Immediate mitigation:** **Rollback** production deployment first if severity is high; then hotfix branch from known-good. Freeze further deploys until stable.

**Rollback guidance:** Use Vercel rollback; wait for CDN/propagation; re-verify health + one critical user journey (login + one learner path).

**User-facing communication:** Only if user-visible: *“We’ve rolled back a recent update while we fix an issue.”*

**Follow-up checks:** Error volume pre-deploy baseline; add test gap that would have caught it; blameless postmortem.

---

## 9) Memory spike / restart loop

**Symptom:** OOM or function timeouts in logs; cold-start storm; synthetic `memory.heap_used_mb` high; latency spikes; Vercel function errors clustered; **note:** serverless isn’t a classic restart loop—treat as **error burst + possible leak in warm instance**.

**How to confirm:** Runtime logs for OOM/timeout; Sentry performance; heap if synthetic/cron exposes it; recent deploy changing caches or global state.

**Likely causes:** Memory leak in server bundle, unbounded cache, huge SSR payload, tight `maxDuration` vs work, traffic spike.

**Immediate mitigation:** Roll back suspect deploy; reduce concurrency by temporarily disabling heavy cron or non-critical endpoints (with approval); increase `maxDuration` only if safe and supported; scale plan if consistently memory-bound.

**Rollback guidance:** Same as §8—prefer rollback over tuning under fire unless cause is obvious env limit.

**User-facing communication:** Usually none unless timeouts surface as generic errors—then *“Some requests may time out; we’re scaling our systems.”*

**Follow-up checks:** Memory trend 24h post-fix; profile leak in staging; review large responses and Prisma `findMany` bounds.

---

## 10) High 429 rate impacting real users

**Symptom:** Spike in `api.route.rate_limited` / HTTP 429; legitimate users report “try again”; rate limit middleware firing on `/api/*`.

**How to confirm:** Logs with `http_429` from `api-route-telemetry`; identify routes and `flow`; check if single IP/ASN; compare to normal baseline; confirm not a DDoS vs mis-tuned limit.

**Likely causes:** Abuse or scraper; accidental low limit; retry storm from client bug; regional egress shared IP.

**Immediate mitigation:** If attack—WAF/IP block with care; if misconfig—raise limits **temporarily** with owner approval and monitor DB cost; if client bug—coordinate fix and backoff. Do not blanket-disable rate limits.

**Rollback guidance:** Revert config PR that changed limits; redeploy previous `proxy`/rate-limit settings if those changed.

**User-facing communication:** Rarely needed—*“If you see ‘too many requests,’ wait a minute and try again.”* Escalate comms if payment/auth flows 429.

**Follow-up checks:** 429 rate vs baseline; false-positive IPs documented; long-term limit tuning and bot management.

---

## Incident coverage

| # | Scenario | Primary signals |
| --- | --- | --- |
| 1 | Homepage down | Synthetics, `/`, `/api/public/home-stats`, deploy time |
| 2 | Login/signup | `auth_login_failed`, `signup_failed`, auth env, DB ready |
| 3 | DB | `health/ready`, `db_query_failed`, Prisma codes |
| 4 | Question bank | `question_load_failed`, `/api/questions`, Sentry route |
| 5 | Paywall proof | `paywall_stats_unavailable`, home-stats payload |
| 6 | Checkout | `checkout_failed`, Stripe status, `billing.checkout.failure` |
| 7 | Webhooks | `webhook_failed`, Stripe delivery log, dedupe phase |
| 8 | Bad deploy | Sentry release spike, rollback |
| 9 | Memory / timeouts | OOM logs, synthetic heap, latency |
| 10 | 429s | `api.route.rate_limited`, 429 logs per route |
