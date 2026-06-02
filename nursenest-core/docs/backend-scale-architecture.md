# Backend scale architecture (1k+ concurrent users)

Operational model: **stateless** Node/serverless instances, **Postgres** as source of truth, **edge/CDN** for anonymous marketing JSON, **bounded** Prisma work per request, **Postgres-backed** rate limits in production, **graceful** paywall/home-stats degradation.

## 1) Stateless app instances

- **No user session in server RAM** — NextAuth uses JWT / cookies; no in-memory session store.
- **Single PrismaClient per process** (`src/lib/db.ts`) — required so connection pools are not duplicated across hot reloads (would exhaust DB `max_connections`).
- **Known in-memory (acceptable / best-effort):** module singletons for immutable config (`exam-product-registry`, Stripe price map build), per-request `Map` ordering, marketing i18n CDN caches (regenerated per deploy generation), `PaidContentStaleCache` (resilience only — never entitlements), `full-mode-concurrency` (abuse cap per instance). **Critical auth state:** login lockout uses **Postgres** (`AppLoginLockout`) in production when `DATABASE_URL` is set — not per-instance `Map` (`login-lockout.ts`).
- **Rate limiting:** `RATE_LIMIT_STORE` defaults to **Postgres** in production Node (`rate-limit-store-resolve.ts`) so abuse limits are **not** per-instance only.

## 2) Safe caching

| Surface | Mechanism |
| --- | --- |
| Home marketing stats | `unstable_cache` + tag `marketing:public-home-stats` (`getCachedPublicHomeStats`) |
| `GET /api/public/home-stats` | `CACHE_HEADER_HOME_STATS` — CDN/browser SWR |
| `GET /api/pricing/options` | `CACHE_HEADER_PRICING_OPTIONS` — short CDN TTL; checkout still authoritative |
| Public lists (e.g. flashcard tags) | `CACHE_HEADER_PUBLIC_LIST` |

**Rule:** Never cache user-specific or entitlement-specific JSON as `public` without `Vary` + correct cache keys.

## 3) DB efficiency

- **Concurrent query cap:** `NN_DB_MAX_CONCURRENT_QUERIES` (default 22) serializes Prisma entry per instance to reduce pool contention (`db-query-semaphore.ts`).
- **Connection URL tuning:** `src/lib/db/env-bootstrap.ts` — `connection_limit`, `pool_timeout`, `connect_timeout`, optional `pgbouncer=true`, **`statement_timeout`** via `PRISMA_STATEMENT_TIMEOUT_MS` (default 120s unless `0`).
- **Slow queries:** Prisma extension logs & metrics >500ms warn, >1s critical + auto-degraded signal (`perf-log-core.ts`, `auto-degraded-mode.ts`).
- **Read fallbacks:** Home stats optional counts use `safePrismaCount` / `withPrismaReadFallback` to avoid failing the whole payload.
- **Marketing home-stats compute:** independent counts/aggregates run in **`Promise.all`** (lower wall time under load). **`withPrismaReadDeadline`** (`src/lib/prisma/safe-reads.ts`, 14s) returns neutral proof if the bundle exceeds SLA — does not cancel in-flight queries; rely on **`PRISMA_STATEMENT_TIMEOUT_MS`** for hard query caps.
- **Schema ↔ migrations:** `User.role` is indexed (`User_role_idx`, migration `20260616130000_add_performance_indexes`) for hot `COUNT` of learners on marketing paths — reflected in `schema.prisma`.

## 4) Background-safe heavy jobs

- **Cron routes** use secrets (`enforce-cron-secret`) — not on the hot user request path.
- **Admin / batch** routes should stay behind auth + low rate limits; long work belongs in cron or queue (future: explicit job runner). **Do not** run unbounded `findMany` on request threads — use `take` / `prisma-find-many-bounds` patterns.

## 5) Connection safety

- **Formula:** `approx_active_pool_slots ≈ (serverless_concurrency_per_region × PRISMA_CONNECTION_LIMIT)` per deploy; must stay **below** Postgres `max_connections` minus admin/migrate slots.
- **PgBouncer:** set `PRISMA_USE_PGBOUNCER=true` and `DIRECT_URL` for migrations (`env-bootstrap.ts`).

## 6) Horizontal scaling readiness

- Stateless ✅  
- Distributed rate limit ✅ (Postgres)  
- Distributed login lockout ✅ (Postgres, prod + DB)  
- CDN for public JSON ✅  
- **Stripe webhooks:** `claimStripeWebhookEventOrDuplicate` runs **before** `applyStripeWebhookEvent`; failed handlers call `releaseStripeWebhookEventClaim` so retries are not stuck. Prevents two instances from applying the same `evt_…` concurrently.  
- **Sessions / deploys:** JWT strategy — no server-side session table; keep **`AUTH_SECRET`** stable across rolling deploys so existing cookies stay valid. Use **`credentialVersion`** (and `sync-session`) when revoking sessions after password change.  
- **Next.js Data Cache** (`unstable_cache`): safe across instances when entries are anonymous and keyed correctly (see `docs/caching-strategy.md`).  
- Remaining: **DB remains the single bottleneck** — scale read replicas + pooler before adding app instances without connection headroom.

## 7) Graceful degradation

- `NN_DEGRADED_MODE` / **auto-degraded** skips non-critical learner work (`shouldSkipNonCriticalLearnerWork`).
- Home stats / paywall: neutral proof + `getDegradedPublicHomeStatsFallback` on errors.
- API telemetry: `route_timeout` logs for slow handlers (`api-route-telemetry.ts`).

## 8) Retry policy

- `withRetry` (`with-retry.ts`) retries **only transient** Prisma/network errors by default — not business logic failures.

## 9) Payload / import discipline

- Question/lesson APIs enforce size limits (`question-api-limits`, JSON body limits on write routes).
- Avoid adding **barrel imports** of large lesson corpora on API paths — keep heavy generators in scripts/cron only (`rn-lesson-library-safety` rule).

## 10) Abuse & traffic spikes

- **Route table, 429 behavior, emergency envs:** `docs/abuse-and-traffic-spike-runbook.md`.
- **`NN_RATE_LIMIT_STRICT_PUBLIC`** — halves anonymous/public per-IP caps without lowering authenticated learner ceilings.

---

### Scale risks (inventory)

| Risk | Mitigation in repo |
| --- | --- |
| DB connection exhaustion | Pool tuning, semaphore, PgBouncer, right-size `connection_limit` |
| Thundering herd on marketing stats | `unstable_cache` + CDN headers |
| Per-instance rate limit drift | Postgres rate limit store in prod |
| Slow queries dragging p95 | Statement timeout, slow-query logs, auto-degraded |
| Login abuse | Distributed lockout + unified rate limits |
| Large JSON responses | `logLargeApiResponse` / payload guards on hot routes |

### Bottlenecks removed (this iteration)

- **Pricing catalog traffic** to origin reduced via **CDN-cacheable** `GET /api/pricing/options` (semi-static display data).

### Remaining constraints

- **Serverless memory** is not a classic “restart loop” — still bound per invocation; watch OOM in logs.
- **Edge middleware** cannot use Prisma — rate limit there is in-memory unless using external KV (future).
- **`db_query_failed` correlationId** may be absent in Prisma extension (no request context) — trace via time + Sentry.
- **Not all `/api/*` routes** use `runWithApiTelemetry` — uniform `request_end` coverage is incremental.
