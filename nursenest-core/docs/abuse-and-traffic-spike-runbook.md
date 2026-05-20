# Abuse resistance & traffic spike runbook

Operational controls for **legitimate spikes** (launches, viral links) and **abuse** (scraping, credential stuffing, DB exhaustion). Implementation: `src/proxy.ts` → `enforceApiRateLimit` (`src/lib/server/rate-limit.ts`), route helpers (`src/lib/http/api-protection.ts`), JSON body caps (`src/lib/http/json-body-limit.ts`), response guard (`src/lib/server/response-guard.ts`).

## Emergency tightening switches

| Env | Effect |
| --- | --- |
| **`NN_RATE_LIMIT_STRICT_PUBLIC=1`** | Halves per-IP caps on **public / anonymous** buckets (home-stats, public JSON, generic `/api/*`, pricing, billing, signup, auth routes, session poll, subscription portal paths, AI coach, anonymous `/api/questions` & `/api/lessons`, unauthenticated admin probes). **Does not** reduce authenticated learner `ratelimit:learner:user:*` (120/min). |
| **`NN_ENABLE_RATE_LIMITING=0`** | Disables global API rate limiting — **last resort** only; prefer scaling infra + strict public. |
| **`RUNTIME_SAFE_MODE=1`** | Skips non-essential DB reads; marketing/home paths use fallbacks (`src/lib/runtime/safe-mode.ts`). |
| **`NN_DEGRADED_MODE`** / auto-degraded | Skips non-critical learner work (`shouldSkipNonCriticalLearnerWork`). |
| **`NN_ENABLE_RESPONSE_GUARD=0`** | Disables ~500KB JSON response guard (not usually needed). |
| **`RATE_LIMIT_STORE=postgres`** | Force Postgres buckets (default in prod Node when `DATABASE_URL` set). |

**CDN / cache:** Public marketing JSON uses `Cache-Control` per `src/lib/cache/public-edge-cache.ts` — edge absorbs anonymous re-reads; origin still protected by per-IP limits.

## 429 behavior

- **Global limiter** (`rate-limit.ts`): JSON `{ error, code: "rate_limit_exceeded", retryAfterSec }`, headers **`Retry-After`**, **`Cache-Control: no-store`**.
- **Repeated 429s** from an IP: exponential **`Retry-After`** via `retryAfterSecondsFrom429Streak` (caps at 300s).
- **Route helpers** (`api-protection.ts`): same **`Cache-Control: no-store`** on 429s.

## Bounded payloads

| Constant | Approx limit | Typical routes |
| --- | --- | --- |
| `JSON_BODY_AUTH_FORM` | 16 KB | login, password reset |
| `JSON_BODY_CHECKOUT` | 16 KB | Stripe checkout |
| `JSON_BODY_SIGNUP` | 64 KB | signup |
| `JSON_BODY_EXAM_SUBMIT` | 768 KB | exam submit |
| `readTextBodyWithByteLimit` | used in | `POST /api/exams/start` (32 KB) |

Oversize → **413** `payload_too_large`. Large JSON **responses** on guarded routes → **413** via `jsonResponseGuarded` when `NN_ENABLE_RESPONSE_GUARD` is on.

## Route risk table (representative)

| Route / group | Auth | Primary risk | Protections |
| --- | --- | --- | --- |
| `/api/public/home-stats` | No | DB counts, scanner traffic | Tight per-IP (10/min base), `unstable_cache` + CDN SWR, strict mode halves cap |
| `/api/pricing/*` | No | Scrape pricing JSON | Dedicated bucket (20/min), CDN cache, strict mode |
| `/api/public/*` | No | Public JSON enumeration | `public_json` bucket (16/min), pagination on list routes |
| `/api/auth/*` (strict) | Mixed | Credential stuffing, token brute force | Per-route **kind** buckets (signin, forgot, …), strict mode |
| `/api/auth/session` | No | Session polling abuse | Per-IP cap + streak backoff |
| `/api/signup` | No | Bot signups | 4/min/IP (strict → 2) |
| `/api/subscriptions/checkout` | Yes | Spam checkout sessions | Billing bucket + server-side user id in metadata |
| `/api/subscriptions/*` (non-webhook) | Mixed | Portal hammer | 40/min/IP |
| `/api/coach`, `/api/ai/*` | Yes | LLM cost | AI expensive bucket + route-level admin limits |
| `/api/questions` GET | Yes | Large payloads, scraping | `pageSize` cap, skip ceiling, `jsonResponseGuarded`, `enforceQuestionsListProtection` |
| `/api/questions/[id]` | Yes | ID enumeration | `enforceQuestionByIdProtection` |
| `/api/questions/discovery` | Yes | Expensive aggregates | Very tight user + IP limits |
| `/api/lessons` GET | Yes | DB list cost | Volume + IP + user limits |
| `/api/exams/start` POST | Yes | Heavy pool build | `enforceExamStartProtection`, **bounded JSON body** (32 KB) |
| `/api/admin/*` | Admin | Stolen cookie hammer | Per-user cap; unauth probes IP cap |
| `/api/subscriptions/webhook` | Stripe sig | Replay | Exempt global RL; claim-before-apply idempotency |
| `/api/health`, `/api/health/*` | No | Noise | Exempt global RL (LB health) |

## Expected behavior under load

- **Legitimate traffic spike:** CDN serves cached public JSON; DB sees bounded concurrency (semaphore, query timeouts). Users may see **429** with `Retry-After` if they share an IP with abusive traffic (mobile NAT) — tune `NN_RATE_LIMIT_STRICT_PUBLIC` or scale app + DB.
- **Credential stuffing:** Auth routes 429 per IP; progressive **login lockout** (Postgres in prod).
- **Scraping:** Public endpoints return 429 before DB melts; home-stats cached.
- **Burst to origin:** Stricter caps + degraded/safe mode reduce DB pressure.

## What we explicitly avoid

- **No unbounded JSON** on hot POST routes (bounded reads; exam/start hardened).
- **No giant unauthenticated responses** — list routes use `pageSize` / `take` limits; response guard on selected JSON routes.
- **No caching 429s** — `Cache-Control: no-store` on rate-limit responses.
