# Database query hotspots (Phase 6 audit)

Static review of Prisma-heavy paths in `nursenest-core/src` (May 2026). **Recommendations only** for indexes unless a migration is explicitly approved.

## Conventions already in good shape

- **`loadFlashcardsExamInventoryForPathway`** (`src/lib/flashcards/load-flashcards-exam-inventory.server.ts`): COUNT + `GROUP BY` with `LIMIT 500`, parallel aggregates, detailed `safeServerLog` / `safeServerLogCritical` on empty pool. No full-row `findMany` for inventory; tier/country resolution is explicit.
- **`loadPathwayLessonProgressBundle` / `fetchPathwayLessonRowsForDashboard`**: metadata `select` + `take: PATHWAY_CATALOG_LIST_HARD_CAP`; progress fetched in chunks (`PROGRESS_IN_CHUNK`).
- **Admin dashboard stats** (`src/lib/admin/load-admin-dashboard-stats.ts`): counts, capped `findMany(take: 15)` for lists, `groupBy` for exam/tier buckets, DAU via bounded `queryRaw` union. **30s in-process cache** reduces repeat cost on `/admin`.

## Hotspots and risks

### 1. Flashcard custom session builder — large `take`

- **Path**: `buildFlashcardCustomSession` → `prisma.flashcard.findMany({ take: 5000, ... })` (`src/lib/flashcards/build-flashcard-custom-session.ts`).
- **Risk**: Worst-case **5k rows + rich `select`** per session build — memory and latency; follow-up loads chunk exam IDs but the primary read remains large.
- **Mitigation (code)**: Align `take` with real max deck size + margin; consider pathway-scoped slices if product allows.
- **Index (recommend)**: Verify `EXPLAIN` for `where + orderBy` on published flashcards; consider composite matching deck + status + `updatedAt` if needed.

### 2. CAT / adaptive pools — heavy `select` but bounded `take`

- **Paths**: `fetchCatPracticePool` (`src/lib/practice-tests/cat-pool.ts`) uses `findMany` with `take` from `MAX_POOL`; NP session route (`src/app/api/cat/np/session/route.ts`) uses `take: POOL_SIZE` and caps exclusion lists.
- **Risk**: Payload size (stem/options/rationale) for large pools.
- **Recommend**: Keep caps; avoid widening `select` without measuring serialization.

### 3. Practice / study tools — bounded reads

- **Study tools session** (`buildStudyToolsSession`): `take: 240`.
- **Lesson study loop bank** (`loadLessonStudyLoopBankPack`): cap via `RELATED_EXAM_QUESTIONS_CAP`.
- **Report card hydration** (`loadReportCardDataUncached`): `take: 12` on sessions + batched question map.

### 4. Learner dashboard — parallel segments, optional heavy tier

- **Path**: `loadLearnerDashboardCore`, `loadPathwayLessonProgressBundle`, analytics / practice details (`src/lib/learner/load-learner-dashboard.ts`).
- **Risk**: Bundle reuse documented in-file reduces duplicate pathway inventory. `pathwayLesson.count` for `lessonsAvailable` is a single aggregate.
- **`loadPathwayStudySummaries`**: DB `groupBy` when bundle not provided — monitor pathway cardinality.
- **Index (recommend)**: `ExamAttempt(userId, createdAt)` style access patterns — confirm in `prisma/schema.prisma` and production `EXPLAIN`.

### 5. Admin analytics — raw DAU SQL

- **Path**: `dailyActiveUsersCount` — UNION across attempts, sessions, progress with `User` join for `is_demo_user`.
- **Index (recommend)**: time-oriented indexes on fact tables for the 24h window.

### 6. Lesson loaders / marketing hubs

- **Path**: Marketing pathway lessons + `pathway-lesson-catalog-sync` — CPU / merge cost; Prisma list risk mitigated by helpers + `prisma-query-audit` when `PRISMA_QUERY_AUDIT=1`.

### 7. Prisma diagnostics (Phase 6)

- **`attachPrismaQueryCapture`**: existing SQL heuristic audit.
- **`prisma-slow-query-log`**: `PRISMA_SLOW_QUERY_LOG_MS`, `PRISMA_LARGE_SQL_WARN_CHARS` → `safeServerLog` with fingerprints (no raw SQL in log line).

## N+1 patterns to watch

- Deep `include` trees on list routes without `take`.
- **`id: { in: hugeArray }`** — follow `PRISMA_ID_IN_CHUNK_SIZE` patterns.

## Index recommendations summary (non-binding)

| Area | Suggestion |
|------|------------|
| Exam attempts / sessions | Composite supporting "by user, recent" |
| Progress | Ensure stats queries hit `(userId, lessonId)` |
| Flashcard deck reads | Covering index for filter + `orderBy` |
| Exam questions (pools) | Evaluate partial indexes on `status`, `exam`, pathway link columns with `EXPLAIN` |

---

*Phase 6 — NurseNest core.*
