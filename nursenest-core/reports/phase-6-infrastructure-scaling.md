# Phase 6 — Infrastructure scaling and enterprise-readiness foundations

Scope: **foundations and reporting** under `nursenest-core/` — no distributed queue implementation, **no schema migrations**, no caching of private learner data, no weakening entitlement or SEO.

## Bottlenecks (current)

1. **Flashcard custom session** — up to **5000** flashcard rows per `findMany` (see `reports/database-query-hotspots.md`).
2. **CAT / adaptive** — bounded `take` but wide question selects; monitor DB time and JSON payload size.
3. **Lesson index build** — `build:lesson-indexes` CPU/I/O; gated before `next build`.
4. **Admin dashboard** — many aggregates; **30s** in-memory cache in `loadAdminDashboardStats`.

## Optimizations added (this phase)

| Area | Change |
|------|--------|
| Prisma | `PRISMA_SLOW_QUERY_LOG_MS`, `PRISMA_LARGE_SQL_WARN_CHARS` → `safeServerLog` via `logPrismaQueryDiagnosticsIfConfigured` in query capture hook. |
| Operations | `NN_OPERATIONS_STARTUP_LOG=1` → one `operations startup_diagnostics` line when `src/lib/db` loads. |
| Learner degraded | `getOperationalStartupTraceFields()` merged into `degraded_mode_active` stderr trace (booleans only: DB URL configured, auth secret configured, Redis/KV env present, Vercel env present). |
| Build / audit | `BUILD_LOG_MEMORY_USAGE=1` → `process.memoryUsage()` in `audit-runtime-payloads.mjs` and after lesson-index gate in `run-lesson-indexes-for-build.mjs`. |
| Jobs (future) | `src/lib/jobs/job-contracts.ts` — job kinds, payloads, retry policy, observability event names. |

## Remaining hotspots

- Revisit **flashcard `take: 5000`** when product defines a tighter upper bound.
- Implement a **worker** only when an approved broker and idempotency store exist; keep contracts as the single source of payload shapes.

## CDN / cache (safe)

**May cache (with existing SEO/locale rules)**

- Public marketing HTML where routes already use static/ISR patterns; immutable static assets; versioned i18n assets.

**Must not cache**

- Authenticated **`/app/**`** learner surfaces: preserve `force-dynamic` and **`private, no-store`** semantics on personalized routes and APIs.

**Generated indexes**

- Disk JSON under `generated-indexes/` — build artifacts; invalidation = rebuild + deploy (unchanged contract).

## Queue / jobs — future

- Enforce redaction in workers: use `JOB_OBSERVABILITY_EVENTS` from `job-contracts.ts`; never log full job payloads containing user identifiers to shared drains without hashing/prefixing.

## Enterprise guardrails (reporting only)

| Theme | Direction |
|-------|-----------|
| **Institutional accounts** | Org tenant id + seat entitlements; map SSO subject to internal user id. |
| **Cohort analytics** | Aggregate-only pipelines; warehouse export; no row-level PII in edge caches. |
| **Instructor vs admin** | Separate RBAC; server enforcement remains DB-backed (`requireAdmin` patterns). |
| **Audit logging** | Append-only admin action stream (actor, action, object ref, time). |
| **SSO** | OIDC/SAML behind feature flag; sessions remain server-validated. |

## New environment flags

| Variable | Purpose |
|----------|---------|
| `PRISMA_SLOW_QUERY_LOG_MS` | Log `prisma slow_query` when duration ≥ threshold (with query capture enabled). |
| `PRISMA_LARGE_SQL_WARN_CHARS` | Log `prisma large_sql_text` when emitted SQL string length ≥ threshold. |
| `NN_OPERATIONS_STARTUP_LOG` | One-time structured startup diagnostics. |
| `BUILD_LOG_MEMORY_USAGE` | Append Node `memoryUsage` to selected build/audit scripts. |

## npm scripts

- `audit:phase-6-surfaces` — runs runtime payload + large client component audits together (see `package.json`).

---

*Phase 6 — NurseNest core.*

## Compile hygiene

- `loadAdminDashboardOverview`: awaited `loadEntitlementDriftSignals()` as `billingIntegrity` and added `billingIntegrity: null` to the DB-disabled early return (fixes broken return object / typecheck).
