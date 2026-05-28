# Performance Hardening Audit: Flashcards, CAT, Practice Tests, Indexes

Date: 2026-05-28

## Executive Summary

The stale deployment reference to `migrations/0003_flashcard_bank_indexes.sql` is not present in the current repository tree. The repository does contain `flashcard_bank`, but its Prisma migration only created the primary key and `content_hash` unique constraint.

This pass verified the claimed performance work from repository evidence, removed remaining `ORDER BY random()` DB selection, raised the CAT readiness floor to 150 complete eligible rows for all non-pre-nursing tracks, documented entitlement-cache TTL/invalidation, added explicit flashcard load timeouts, and created the missing Prisma migration for the observed `flashcard_bank` query pattern.

## Optimization Matrix

| File                                                                                | Function / Surface                           | Status      | Evidence                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/practice-tests/cat-pool.ts`                                                | `queryShuffledCompletePool`                  | IMPLEMENTED | Counts complete eligible rows, chooses bounded window by seeded index or `randomInt`, orders by `id`, fetches metadata only, then shuffles in memory.                                                                                        |
| `src/lib/practice-tests/cat-pool.ts`                                                | `fetchCatPracticePool`                       | IMPLEMENTED | Applies `questionAccessWhereWithPathway` before CAT pool selection when `pathwayId` is present; fails closed if entitlement does not cover the pathway.                                                                                      |
| `src/lib/practice-tests/cat-readiness-floor.ts`                                     | `catReadinessMinCompletePoolRows`            | IMPLEMENTED | Non-pre-nursing CAT readiness floor is now `150`; pre-nursing remains intentionally smaller at `8`.                                                                                                                                          |
| `src/lib/practice-tests/pick-question-ids.ts`                                       | `pickPracticeQuestionIds`                    | IMPLEMENTED | Linear practice reuses the pathway-safe CAT pool, then applies recent-question filtering and balanced sequencing.                                                                                                                            |
| `src/app/api/questions/route.ts`                                                    | subscriber random question list              | IMPLEMENTED | Replaced raw SQL random sort with `COUNT(*)`, random offset, `ORDER BY id ASC`, wraparound, and in-memory shuffle.                                                                                                                           |
| `src/app/api/questions/route.ts`                                                    | freemium random question list                | IMPLEMENTED | Same indexed random-offset strategy as subscriber random list.                                                                                                                                                                               |
| `src/lib/baseline/baseline-assessment.ts`                                           | `pickRandomBaselineQuestionIds`              | IMPLEMENTED | Replaced topic and fill `ORDER BY random()` with topic list plus per-filter random-offset picks.                                                                                                                                             |
| `src/components/student/practice-tests-hub-client.tsx`                              | practice/CAT create request                  | IMPLEMENTED | Uses `AbortController` with a 28s timeout.                                                                                                                                                                                                   |
| `src/components/student/pathway-cat-session-start-client.tsx`                       | CAT readiness + CAT create bootstrap         | IMPLEMENTED | Uses `AbortController` with 25s readiness and 28s create timeouts.                                                                                                                                                                           |
| `src/components/student/practice-test-runner-client.tsx`                            | practice test hydration and question fetches | IMPLEMENTED | Uses `fetchWithRetry` with explicit 45s, 25s, 20s, and 8s timeouts for hydrate, foreground question load, study review, and prefetch.                                                                                                        |
| `src/components/student/exam-practice-client.tsx`                                   | legacy `fetchExamSet` equivalent             | PARTIAL     | No `fetchExamSet` symbol exists. Existing exam session question/resume loads use `AbortController`, but `/api/exams/start` still uses plain `fetch`; not changed because current premium practice/CAT flows are under `/app/practice-tests`. |
| `src/components/flashcards/flashcards-hub-client.tsx`                               | flashcard inventory/custom-session load      | IMPLEMENTED | Added `AbortController` with a 25s timeout.                                                                                                                                                                                                  |
| `src/components/flashcards/flashcard-weak-study-client.tsx`                         | weak flashcard queue load                    | IMPLEMENTED | Added `AbortController` with a 25s timeout.                                                                                                                                                                                                  |
| `src/lib/entitlements/get-user-access.ts`                                           | runtime entitlement cache                    | IMPLEMENTED | Per-process `Map` cache exists with 60s TTL, 10m stale-if-error only for already-premium users, 5000-entry cap, and TTL-driven invalidation documented.                                                                                      |
| `prisma/migrations/20260528195000_flashcard_bank_performance_indexes/migration.sql` | `flashcard_bank` observed query index        | IMPLEMENTED | Adds `idx_flashcard_bank_source_status_enabled` with `CREATE INDEX IF NOT EXISTS`.                                                                                                                                                           |

## `flashcard_bank` Query Audit

Runtime app code does not currently query `flashcard_bank`; learner flashcards use the Prisma flashcard/deck models. The observed `flashcard_bank` SQL access is import/maintenance oriented:

| File                                                    | Query              | WHERE                                                                    | ORDER BY | LIMIT                  | JOIN |
| ------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------ | -------- | ---------------------- | ---- |
| `scripts/migrate-flashcards-to-postgres.ts`             | pre/post count     | `source_type = $1 AND status = 'published' AND flashcard_enabled = true` | none     | none                   | none |
| `scripts/migrate-flashcards-to-postgres.ts`             | inserts            | n/a                                                                      | n/a      | n/a                    | none |
| `scripts/replit-export-import/monolith-table-import.ts` | existence probe    | `id = $1::varchar`                                                       | none     | `LIMIT 1`              | none |
| `scripts/seed-local-verify-data.mjs`                    | duplicate probe    | `content_hash = $1`                                                      | none     | implicit first-row use | none |
| `scripts/seed-local-verify-data.mjs`                    | insert             | n/a                                                                      | n/a      | n/a                    | none |
| `scripts/replit-export-import/import-pipeline.ts`       | insert/upsert path | `content_hash` conflict handling                                         | none     | none                   | none |

Required indexes from observed patterns:

| Pattern                                          | Existing Coverage                    | Action                                           |
| ------------------------------------------------ | ------------------------------------ | ------------------------------------------------ |
| `id = ... LIMIT 1`                               | `flashcard_bank_pkey`                | no new index                                     |
| `content_hash = ...` / unique conflict           | `flashcard_bank_content_hash_unique` | no new index                                     |
| `source_type + status + flashcard_enabled` count | missing in Prisma migrations         | added `idx_flashcard_bank_source_status_enabled` |

No speculative indexes were added for `tier`, `topic_tag`, `body_system`, `difficulty`, or `tags_json` because current repository queries do not use them against `flashcard_bank`.

## Schema And Expected Indexes

Definition source:

- `prisma/schema.prisma` model `flashcard_bank`
- `prisma/migrations/20260331200000_legacy_replit_monolith_tables/migration.sql`

Expected `pg_indexes` after migration:

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename='flashcard_bank';
```

Expected rows:

- `flashcard_bank_pkey`: primary key on `id`
- `flashcard_bank_content_hash_unique`: unique index on `content_hash`
- `idx_flashcard_bank_source_status_enabled`: btree index on `(source_type, status, flashcard_enabled)`

Local `.env.local` contains placeholder database host values (`HOST` / `DBNAME`), so the production `pg_indexes` query could not be executed from this workspace. The report therefore documents schema assumptions from checked-in migrations and the exact SQL to run against production.

## Database Migration

Created:

`prisma/migrations/20260528195000_flashcard_bank_performance_indexes/migration.sql`

Migration SQL is idempotent:

```sql
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_source_status_enabled"
  ON "flashcard_bank" ("source_type", "status", "flashcard_enabled");
```

Historical migrations were not modified.

## Random Selection Audit

Repository search result:

```text
rg -n "ORDER BY random\\(\\)|ORDER BY RANDOM\\(\\)" src prisma scripts docs
# no matches
```

Changed DB selection strategy:

- Before: PostgreSQL had to evaluate every eligible row, assign `random()`, sort the full candidate set, then limit.
- After: PostgreSQL counts eligible rows, seeks into an `id`-ordered candidate stream with a random offset, fetches a small bounded page, wraps if needed, and the app shuffles the returned IDs in memory.

Estimated impact:

- Removes full random sorts from learner question and baseline hot paths.
- Converts CPU-heavy sort work into indexed ordered reads plus small in-memory shuffles.
- Biggest gain appears when eligible `exam_questions` pools are large.

Remaining `Math.random()` matches are in non-DB contexts such as UI shuffles, audio synthesis, id suffixes, test data, and in-memory practice sequencing; no full-table random DB sort remains.

## CAT And Practice Pool Verification

CAT and linear practice now converge on `fetchCatPracticePool`:

- Pathway scope is resolved before selection.
- `questionAccessWhereWithPathway` is used for pathway-specific pools.
- Entitlement/pathway mismatch returns an empty pool rather than broadening.
- `NON_ECG_PRACTICE_EXAM_WHERE`, module gates, RT ventilator gates, and NP/provider scope gates apply before pool return.
- CAT readiness requires at least 150 complete calibrated rows for RN, RPN/PN, NP, and Allied tracks.
- Practice tests reuse the same pool and then apply recent-question exclusion and balancing.

This prevents RN/PN/NP/Allied contamination to the extent encoded by the pathway catalog, `questionAccessWhereWithPathway`, and the NP/provider difficulty scope helpers.

## Timeout Verification

Verified explicit timeout handling:

- Practice tests hub create: 28s `AbortController`.
- CAT launch readiness: 25s `AbortController`.
- CAT launch create: 28s `AbortController`.
- Practice test runner hydration: `fetchWithRetry` 45s.
- Practice test runner question load: `fetchWithRetry` 25s.
- Practice test runner CAT study review: `fetchWithRetry` 20s.
- Practice test runner prefetch: `fetchWithRetry` 8s.
- Flashcard hub inventory/custom session: 25s `AbortController`.
- Weak flashcard queue: 25s `AbortController`.

Partial legacy gap:

- `src/components/student/exam-practice-client.tsx` has abortable session/question fetches, but its legacy `/api/exams/start` POST still uses plain `fetch`. The primary premium practice/CAT path is `/api/practice-tests`; this should be hardened in a separate legacy-exam cleanup if that route remains user-facing.

## Entitlement Cache Verification

`resolveEntitlement(userId)` delegates to `getUserAccess(userId)`. `getUserAccess` has:

- React request-level `cache()`.
- Process-level `Map` cache.
- TTL: 60 seconds.
- Stale-if-error: 10 minutes, only for cached already-premium users.
- Size bound: clear at 5000 entries.
- Invalidation: TTL-driven, now documented in source comments.

## Deployment Reference Audit

No current reference to the missing `0003_flashcard_bank_indexes.sql` or `flashcard_bank_indexes` remains under `/root/nursenest-core` after excluding generated dependency/build folders.

## Estimated Performance Impact

- Flashcard import/count checks: composite index avoids scanning all `flashcard_bank` rows for published enabled source counts.
- Question random mode: avoids random full-candidate sorts on `exam_questions`.
- Baseline assessment: avoids random full-candidate sorts while preserving topic spread and duplicate `stem_hash` avoidance.
- CAT/practice: keeps large text fields out of pool-building reads, uses bounded metadata scans, and enforces larger readiness pools before adaptive sessions start.
- Entitlements: short per-process cache reduces duplicate DB reads during hot learner route rendering without trusting client/JWT claims.

## Verification Commands

Completed:

```text
rg -n "0003_flashcard_bank_indexes|flashcard_bank_indexes" /root/nursenest-core ...
rg -n "ORDER BY random\\(\\)|ORDER BY RANDOM\\(\\)" src prisma scripts docs ...
```

Pending in this report section until final local validation completes:

```text
npm run typecheck
npm run build
```
