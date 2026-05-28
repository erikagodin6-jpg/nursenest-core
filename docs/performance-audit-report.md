# Performance Hardening Audit: Flashcards, CAT, Practice Tests, Indexes

Date: 2026-05-28

## Summary

The current repository no longer has deployment instructions pointing at the old missing flashcard-bank index SQL file. The active Prisma migration set defines `flashcard_bank` with only `id` primary key and `content_hash` uniqueness, so this pass added the missing indexes supported by observed query patterns.

Implemented in this pass:

- Added `nursenest-core/prisma/migrations/20260528195000_flashcard_bank_performance_indexes/migration.sql`.
- Removed full-table random SQL sorts from learner question selection and baseline assessment.
- Removed remaining legacy Express SQL random-sort clauses by converting them to indexed `id` ordering.
- Raised non-pre-nursing CAT readiness from 30 to 150 complete eligible rows.
- Added explicit flashcard inventory/custom-session and weak-queue request timeouts.
- Documented entitlement cache TTL and TTL-driven invalidation in source.

## Optimization Matrix

| File                                                                         | Function / Surface                        | Status      | Evidence                                                                                                                       |
| ---------------------------------------------------------------------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `nursenest-core/src/lib/practice-tests/cat-pool.ts`                          | `queryShuffledCompletePool`               | IMPLEMENTED | Counts complete eligible rows, chooses a bounded `id` window, fetches metadata only, and shuffles in memory.                   |
| `nursenest-core/src/lib/practice-tests/cat-pool.ts`                          | `fetchCatPracticePool`                    | IMPLEMENTED | Applies pathway entitlement/scope before selection and fails closed on pathway mismatch.                                       |
| `nursenest-core/src/lib/practice-tests/cat-readiness-floor.ts`               | `catReadinessMinCompletePoolRows`         | IMPLEMENTED | Non-pre-nursing readiness floor is now `150`; pre-nursing remains `8`.                                                         |
| `nursenest-core/src/lib/practice-tests/pick-question-ids.ts`                 | `pickPracticeQuestionIds`                 | IMPLEMENTED | Linear practice reuses the pathway-safe CAT pool and applies recent-question filtering.                                        |
| `nursenest-core/src/app/api/questions/route.ts`                              | subscriber/freemium random question lists | IMPLEMENTED | Uses count plus random offset, `ORDER BY id ASC`, wraparound, and in-memory shuffle.                                           |
| `nursenest-core/src/lib/baseline/baseline-assessment.ts`                     | `pickRandomBaselineQuestionIds`           | IMPLEMENTED | Uses topic list plus per-filter random-offset picks.                                                                           |
| `nursenest-core/src/components/student/practice-tests-hub-client.tsx`        | practice/CAT create                       | IMPLEMENTED | Uses `AbortController` with 28s timeout.                                                                                       |
| `nursenest-core/src/components/student/pathway-cat-session-start-client.tsx` | CAT readiness/create                      | IMPLEMENTED | Uses 25s readiness and 28s create timeouts.                                                                                    |
| `nursenest-core/src/components/student/practice-test-runner-client.tsx`      | practice test hydration/questions         | IMPLEMENTED | Uses `fetchWithRetry` with explicit 45s, 25s, 20s, and 8s timeouts.                                                            |
| `nursenest-core/src/components/flashcards/flashcards-hub-client.tsx`         | flashcard inventory/custom-session        | IMPLEMENTED | Added 25s `AbortController` timeout.                                                                                           |
| `nursenest-core/src/components/flashcards/flashcard-weak-study-client.tsx`   | weak flashcard queue                      | IMPLEMENTED | Added 25s `AbortController` timeout.                                                                                           |
| `nursenest-core/src/lib/entitlements/get-user-access.ts`                     | runtime entitlement cache                 | IMPLEMENTED | 60s process cache, 10m stale-if-error only for already-premium users, 5000-entry cap, TTL invalidation documented.             |
| `nursenest-core/src/components/student/exam-practice-client.tsx`             | legacy exam start                         | PARTIAL     | No `fetchExamSet` symbol exists; session/question loads are abortable, but legacy `/api/exams/start` still uses plain `fetch`. |

## Flashcard Bank Query Audit

The nested Next learner flashcard flow uses Prisma flashcard/deck models, but repository-wide legacy/admin/import surfaces still query `flashcard_bank`. Observed query families:

| File                                                                           | WHERE                                                                           | ORDER BY                  | LIMIT             | JOIN                                    | Index Need                                          |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------- | ----------------- | --------------------------------------- | --------------------------------------------------- |
| `scripts/migrate-flashcards-to-postgres.ts`                                    | `source_type = $1 AND status = 'published' AND flashcard_enabled = true`        | none                      | none              | none                                    | added composite index                               |
| `scripts/replit-export-import/monolith-table-import.ts`                        | `id = $1::varchar`                                                              | none                      | `LIMIT 1`         | none                                    | covered by primary key                              |
| `scripts/seed-local-verify-data.mjs`                                           | `content_hash = $1`                                                             | none                      | first row         | none                                    | covered by unique index                             |
| `scripts/replit-export-import/import-pipeline.ts`                              | `content_hash` conflict handling                                                | none                      | none              | none                                    | covered by unique index                             |
| `server/routes.ts`, `server/bulk-orchestrator.ts`                              | `tier = ... AND status = ...`                                                   | `created_at DESC`, `id`   | paginated/bounded | sometimes joins by `source_question_id` | added tier/status and source-question indexes       |
| `server/routes.ts`, `server/storage.ts`, `server/substitute-content-engine.ts` | `topic/category/status` filters                                                 | `id` or `created_at DESC` | bounded           | none                                    | added topic/status and category/status indexes      |
| `server/routes.ts`, reporting routes                                           | `source_type = 'cat_exam' AND flashcard_enabled = true` and `created_at >= ...` | group/order by tier/day   | aggregate         | none                                    | source/status/enabled and status/created-at support |
| `server/exam-flashcard-mapper.ts`, content generation/backfill                 | `source_question_id = $1`, joins to `exam_questions`                            | none / `eq.id`            | bounded           | yes                                     | added source-question index                         |

No speculative indexes were added for `topic_tag`, `body_system`, `difficulty`, `tags_json`, or free-text `front/back ILIKE` searches.

## Schema And Indexes

Definition sources:

- `nursenest-core/prisma/schema.prisma`
- `nursenest-core/prisma/migrations/20260331200000_legacy_replit_monolith_tables/migration.sql`

Expected `pg_indexes` after migration:

- `flashcard_bank_pkey` on `id`
- `flashcard_bank_content_hash_unique` on `content_hash`
- `idx_flashcard_bank_source_status_enabled` on `(source_type, status, flashcard_enabled)`
- `idx_flashcard_bank_tier_status` on `(tier, status)`
- `idx_flashcard_bank_source_question_id` on `(source_question_id)`
- `idx_flashcard_bank_status_created_at` on `(status, created_at DESC)`
- `idx_flashcard_bank_topic_status` on `(topic, status)`
- `idx_flashcard_bank_category_status` on `(category, status)`
- `idx_flashcard_bank_career_status` on `(career_type, status)`

Production query to verify:

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename='flashcard_bank';
```

Local `.env.local` uses placeholder host values (`HOST` / `DBNAME`), so the production query could not be executed from this workspace.

## Query Plan Impact

Before:

- Random question paths required PostgreSQL to assign random values, sort the full eligible pool, and then limit.
- Flashcard import count checks could scan all `flashcard_bank` rows for source/status/enabled counts.

After:

- Random question paths count eligible rows, choose a random offset, fetch a small `id`-ordered window, wrap if needed, and shuffle the small result in memory.
- Flashcard import count checks can use `idx_flashcard_bank_source_status_enabled`.

Estimated impact is highest for large `exam_questions` and `flashcard_bank` tables because full random sorts and unindexed filtered counts are removed from hot/maintenance paths.

## Verification

Completed:

- A repository search for the legacy flashcard-bank index filename returned no active references after cleanup.
- Repository-wide search for SQL random-sort clauses returned no matches after excluding generated dependency/build folders.
- Nested Next app `npm run typecheck` passed.
- Nested Next app `npm run build` passed, including standalone artifact verification. Build emitted pre-existing environment/content warnings from placeholder local DB/Auth env and existing i18n fallback keys, but exited `0`.

Additional legacy server check:

- Root `npm run check` was stopped after several minutes with no diagnostics.
- Root `npm run check:server` failed on pre-existing strict-null/type errors across unrelated backup/server/shared files; representative first failures were `backup-system/backup-env-inventory.ts`, `backup-system/backup-logger.ts`, and `server/abuse-protection.ts`.

## Residual Risk

The legacy `nursenest-core/src/components/student/exam-practice-client.tsx` `/api/exams/start` POST remains a plain fetch. Current premium practice/CAT flows use `/api/practice-tests`, but this should be hardened separately if the legacy exam runner remains user-facing.
