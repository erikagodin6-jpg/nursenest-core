# Database Performance Audit

Generated from the database performance war room initiative.

---

## Phase 1 — Query Inventory

### Learner pages (server components)

| Surface | DB calls | Parallelisation | Budget | Status |
|---------|----------|-----------------|--------|--------|
| Flashcards hub (`/app/flashcards`) | 2–3 (inventory + user) | `Promise.all` + `Promise.race` timeout | ≤ 5 | ✅ |
| Practice tests hub (`/app/practice-tests`) | 2–3 (discovery + user) | Sequential with 3 s render budget | ≤ 5 | ✅ |
| Learner layout (every page) | 1–3 (session + entitlement + nav) | `Promise.all` for entitlement+view-as | critical path | ✅ |
| Dashboard (`/app`) | 15+ (across loaders) | `Promise.all` chains | safeOptional (2.5 s) | ⚠️ complex |
| Practice test runner (`/app/practice-tests/[id]`) | 0 (server) + 2 (client fetches) | Parallel prefetch | ≤ 2 fetches | ✅ |
| CAT runner | 0 (server) + 2 (client fetches) | Parallel prefetch | ≤ 2 fetches | ✅ |

### API routes (Next.js App Router)

| Route | DB calls | Pattern | Notes |
|-------|----------|---------|-------|
| `GET /api/questions` | 2–4 | COUNT → OFFSET/LIMIT (random mode) | 60 s `maxDuration` |
| `POST /api/practice-tests` | 3–5 (entitlement + pool + create) | Sequential | Advisory lock prevents duplicate CAT creates |
| `GET /api/practice-tests/[id]` | 1–2 | Single lookup + optional question | 12 s per-attempt timeout |
| `GET /api/questions/discovery` | 1 (aggregation) | Single groupBy | Cache layer present |
| `GET /api/flashcards/inventory` | 3–4 (pool counts + category join) | Parallel `Promise.all` | — |

### Express routes (server/)

| Route | DB calls | Pattern | Notes |
|-------|----------|---------|-------|
| `getNextCards` (adaptive engine) | 2 | `Promise.all` (cards + weak topics) | Fixed: was 3 after COUNT regression |
| `POST /api/cat/start` | 4–6 (pool + create + first question) | Sequential with 15 s timeout | CAT_TIMEOUT guard added |
| `POST /api/cat/:id/answer` | 3–4 (read + update + next question) | Sequential | — |
| `GET /api/flashcard-bank` | 2 (count + fetch) | Sequential | 5 s `timedQuery` guard |

---

## Phase 2 — Query Budgets (enforced in CI)

File: `src/lib/db/query-budget-contracts.test.ts`

| Surface | Budget | Test |
|---------|--------|------|
| Hub page server components | ≤ 5 DB call sites | ✅ enforced |
| `pickQuestionIdsByRandomOffset` | ≤ 3 DB calls | ✅ enforced |
| `getNextCards` (adaptive engine) | ≤ 2 pool queries, no COUNT | ✅ enforced |
| `loadSession` (practice runner) | ≤ 2 fetchWithRetry | ✅ enforced |
| `loadSession` (CAT runner) | ≤ 2 fetchWithRetry | ✅ enforced |
| `CAT_MIN_COMPLETE_POOL` | = 30 | ✅ enforced |
| `pickRandomBaselineQuestionIds` | DISTINCT ON (no per-topic loop) | ✅ enforced |

---

## Phase 3 — COUNT(*) audit

### Critical: hot-path aggregate queries

| Location | Queries | Frequency | Status |
|----------|---------|-----------|--------|
| `api/flashcards/due-summary` | 7 COUNT queries | Every dashboard load | ⚠️ All parallel — acceptable |
| `account/notes/actions.ts` | 4 COUNT queries | Every notes page load | ⚠️ All parallel — acceptable |
| `api/admin/stats/analytics` | 6 COUNT queries | Admin page only | ✅ Not learner-facing |
| `app/api/questions/route.ts` — random mode | 1 COUNT + 1–2 SELECTs | Per question fetch | ⚠️ Sequential (required for random offset) |

### Acceptable patterns

- All flashcard study queue counts run in `Promise.all` (6 parallel counts) — acceptable.
- Admin-only COUNT queries (blog, analytics) — not on learner hot path.
- `groupBy` with `_count` — single aggregation query, not separate COUNTs.

---

## Phase 4 — N+1 patterns found and fixed

### Fixed in this initiative

| Location | Pattern | Fix applied |
|----------|---------|-------------|
| `adaptive-engine.ts getNextCards` | Sequential COUNT then SELECT | Removed COUNT; restored `ORDER BY RANDOM()` |
| `baseline-assessment.ts pickRandomBaselineQuestionIds` | Per-topic for-of loop with 2–3 DB calls each | Restored single `DISTINCT ON ... ORDER BY random()` |

### N+1 patterns still present (advisory)

Detected by `scripts/detect-n-plus-one.mjs`. These are in non-hot paths:

| Location | Pattern | Severity | Recommended fix |
|----------|---------|----------|-----------------|
| `admin-action-queue.ts` | Per-action UPDATE in loop (max 50) | MEDIUM | Batch update with `WHERE id = ANY(...)` |
| `api/blog/import` | Per-post findUnique + create (max 25) | MEDIUM | `upsertMany` or pre-fetch all IDs |
| `api/admin/ai/flashcards/generate` | Per-item create in loop (max 15) | MEDIUM | `createMany` |

---

## Phase 5 — Connection pool observability

**Express pool** (`server/db.ts`):
- Pool health logged every 60 s (JSON, type `db_pool_health`)
- Warning logged when pool is > 80% utilised (type `db_pool_pressure`)
- Critical logged when pool is > 95% utilised (type `db_pool_critical`)
- Slow query threshold: `DB_SLOW_QUERY_THRESHOLD_MS` (default 500 ms)

**Prisma** (`src/lib/db.server.ts` + `prisma-slow-query-log.ts`):
- Query event hook always attached (previously only in non-production)
- Slow queries logged at ≥ 500 ms (override with `PRISMA_SLOW_QUERY_LOG_MS=N`)
- Full query capture (in-memory + SQL audit) only in dev / `PRISMA_QUERY_AUDIT=1`

---

## Phase 6 — Migration safety

**Linter**: `scripts/check-migration-safety.mjs`

Rules:
1. `CREATE INDEX` without `CONCURRENTLY` → error (acquires `AccessExclusiveLock`)
2. `DROP TABLE`, `TRUNCATE`, `DROP COLUMN` without `-- SAFE:` comment → error

**CI**: `.github/workflows/database-safety.yml` — runs on every PR touching migrations.

**Usage**:
```bash
# Check only changed migrations (CI default)
node scripts/check-migration-safety.mjs

# Check all migrations (full audit)
node scripts/check-migration-safety.mjs --all

# Check vs a specific base branch
node scripts/check-migration-safety.mjs --base origin/main
```

### Migration template for index creation

```sql
-- This migration cannot run in a transaction.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_table_column"
  ON "table_name" ("column_name");
```

---

## Phase 7 — Slow query logging

Prisma slow query log is now **always-on in production** at 500 ms threshold.

Log entry format:
```json
{ "type": "prisma", "event": "slow_query", "durationMs": 847, "fingerprint": "a3f9c2d1...", "approxSqlChars": 312 }
```

Express pool slow queries:
```
[DB:production] Slow query 623ms: SELECT id, stem, topic FROM exam_questions WHERE ...
```

**Tune thresholds** via env vars:
- `PRISMA_SLOW_QUERY_LOG_MS` — Prisma threshold (default 500, set to 0 to disable)
- `DB_SLOW_QUERY_THRESHOLD_MS` — Express pool threshold (default 500)

---

## Phase 8 — Database performance CI

Workflow: `.github/workflows/database-safety.yml`

Three jobs run on every PR touching source or migration files:

| Job | What it checks | Fails build? |
|-----|----------------|--------------|
| `migration-safety` | Non-concurrent index creation, unsafe DDL | **Yes** |
| `n-plus-one-scan` | Loop-with-DB-call patterns in changed files | Advisory (no) |
| `query-budget-check` | 8 query budget contracts via node:test | **Yes** |

---

## Success criteria (from the war room spec)

| Criterion | Status |
|-----------|--------|
| No learner activity can exhaust the connection pool | ✅ Adaptive engine COUNT removed; pool saturation logged |
| No activity startup triggers large query chains | ✅ Budgets enforced in CI (≤ 2 fetches per session load) |
| No production migration can lock critical learner tables | ✅ CONCURRENTLY linter runs in CI |
| DB performance measurable and observable | ✅ Slow query logging always-on; pool metrics logged |
| Protected from regressions | ✅ 8 contract tests fail CI if budgets violated |
