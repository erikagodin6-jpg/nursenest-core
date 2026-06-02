# Phase 6B — production stability guardrails

Companion to `reports/phase-6-infrastructure-scaling.md` and `reports/database-query-hotspots.md` when those files exist in your checkout (they may be Cursor-ignored in agent sandboxes — keep this file as the canonical Phase 6B reference).

**Job contracts (Phase 6, contracts only):** `src/lib/jobs/job-contracts.ts` documents queue/worker observability expectations without introducing a new broker.

## Pre-deploy env audit (no secrets in logs)

```bash
cd nursenest-core
npm run audit:production-stability
# Gate (fail on hard blockers):
AUDIT_PRODUCTION_STABILITY_STRICT=1 npm run audit:production-stability
```

The script prints **presence only** for secrets and connection strings (never values). It exits **1** only when `AUDIT_PRODUCTION_STABILITY_STRICT=1` and a **FAIL** row exists (missing `DATABASE_URL`, missing session signing secret, or production-like env without `AUTH_URL`/`NEXTAUTH_URL`).

### Required / conditional matrix (summary)

| Variable | Strict FAIL when | Otherwise |
|----------|------------------|-----------|
| `DATABASE_URL` | Missing or non-`postgres` URL | WARN in non-strict |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Both missing | FAIL |
| `AUTH_URL` / `NEXTAUTH_URL` | Both missing **and** production-like (`NODE_ENV=production`, `VERCEL_ENV=production`, or `NURSE_NEST_ENFORCE_CRON_SECRET=1`) | WARN in dev |
| `DIRECT_URL` / `DATABASE_DIRECT_URL` | Never strict-fail alone (Prisma `directUrl`; `env-bootstrap` may synthesize) | WARN if unset |
| `NEXT_PUBLIC_APP_URL` | Never strict-fail alone | WARN in production-like if unset |
| `CRON_SECRET` | Never strict-fail alone | WARN if unset in production-like (`/api/cron/*` bearer) |
| Stripe | If `STRIPE_SECRET_KEY` or `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set | WARN if `STRIPE_WEBHOOK_SECRET` missing |
| `PLAYWRIGHT_BASE_URL` | Never strict-fail | WARN if unset (Playwright only) |

## Phase 6 diagnostics (safe knobs)

- **`PRISMA_SLOW_QUERY_LOG_MS`** — positive number: log slow Prisma queries above threshold (see `src/lib/db/prisma-slow-query-log.ts`).
- **`PRISMA_LARGE_SQL_WARN_CHARS`** — positive integer: warn when SQL text exceeds character count (fingerprint only; no raw literals policy in hot paths).
- **`NN_OPERATIONS_STARTUP_LOG=1`** — one structured startup line via `emitOperationalStartupDiagnosticsOnce()` (`src/lib/ops/operational-startup-diagnostics.ts`).
- **`BUILD_LOG_MEMORY_USAGE=1`** — build/audit scripts may print `process.memoryUsage()` summaries (warn-only; see `scripts/audit-runtime-payloads.mjs`, `scripts/run-lesson-indexes-for-build.mjs`).

## Exit **137** / OOM during build

- Linux OOM killer or Node heap exhaustion often surfaces as **exit code 137** (128 + `SIGKILL` 9).
- Mitigations already in-repo: `NN_LOW_MEMORY_BUILD`, `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`, `ensure-node-memory.mjs`, constrained Next webpack concurrency — see `npm run audit:build-stability` and build narrative docs.
- Do **not** claim a full `typecheck` / `build` pass if the process died with **137**; re-run with higher memory or skip heavy steps per runbook.

## Readiness API (`GET /api/health/ready`)

- Returns JSON only: `database` status, `ok` / `ready`, and **`sessionSigning`**: `"configured"` \| `"not_configured"` (boolean operational hint; **no** secret values).

## Learner shell / degraded mode

- `getOperationalStartupTraceFields()` emits **booleans only** (DB configured, auth secret configured, Redis/KV env present, Vercel env). `layoutStderrTrace` uses `redactMetaForLog` for other learner traces.

## Tests

```bash
node --test scripts/audit-production-stability.test.mjs
npm run audit:production-stability -- --self-check
```
