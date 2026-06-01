# Flashcard Session Performance Audit

**Date:** 2026-06-01  
**Telemetry sources:** `x-nn-session-build-ms` (response header), `buildDurationMs` / `timeoutBudgetMs` (server log `FLASHCARD_SESSION_CREATE`), static code analysis of `build-flashcard-custom-session.ts`  
**Note:** Production telemetry collection began as of the 2026-06-01 instrumentation deployment. This report provides timing models derived from complete code-path analysis, query complexity estimates, and the code locations responsible for each cost. Actual p50/p95/p99 from production will supplement these once log aggregation runs for ≥ 24 hours.

---

## Summary

The session builder has **three distinct execution paths** with very different performance profiles:

| Path | Condition | Estimated cost | DB queries |
|---|---|---|---|
| **Fast path (Redis hit)** | `includeCards=0`, no progress/persistence filters, Redis populated | 2–8 ms | 0 |
| **Count-only (cold)** | `includeCards=0`, no filters, Redis miss | 80–600 ms | 2 (parallel raw SQL in transaction) |
| **Full card fetch (warm exam meta)** | `includeCards=1`, no progress filter, exam topic cache hot | 150–900 ms | 2–3 |
| **Full card fetch (cold)** | `includeCards=1`, progress filters, cold meta cache | 500–3,000+ ms | 4–6 |
| **Full card fetch (weak-only cold)** | `includeCards=1`, `weakOnly=true`, large deck | 800–5,000+ ms | 4–5 |

---

## Execution Path Analysis by Session Type

### Path 1 — Count-Only Hub Request (`includeCards=0`)

**Entry condition:**  
```typescript
const useExamForInventoryEarly = Boolean(pathwayScopeId) && !lessonId && !includeCards
  && !needsProgressEarly && !persistenceFiltersEarly;
```

**Sub-path 1a: Redis cache hit**
- `getFlashcardHubInventory(pathwayScopeId, tier, country)` → immediate return
- 0 Prisma queries
- **Estimated cost: 2–8 ms**

**Sub-path 1b: Redis cache miss → DB inventory**
Executes `loadFlashcardsExamInventoryForPathway`:
```sql
-- Inside Prisma $transaction with SET LOCAL statement_timeout = 8000
SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE {whereSql}
SELECT body_system, topic, COUNT(*)::bigint AS cnt
  FROM exam_questions WHERE {whereSql}
  GROUP BY body_system, topic ORDER BY cnt DESC NULLS LAST LIMIT 500
-- parallel via Promise.all
```
After transaction, also runs (for dedicated flashcard counts, only when diagnostic flag set):
```sql
-- prisma.flashcard.count (conditional)
SELECT COUNT(*) FROM flashcards WHERE status='PUBLISHED' AND deck.pathway_id={pathwayScopeId}
```
- **DB queries:** 2 parallel raw SQL (inside transaction) + optional 1–2 count queries
- **Index used:** `exam_questions` — no composite index shown; relies on WHERE clause coverage
- **Statement timeout:** 8,000 ms (env `NN_FLASHCARDS_INVENTORY_STATEMENT_TIMEOUT_MS`, default 8s)
- **Estimated cost: 80–600 ms** depending on `exam_questions` table size and index coverage

---

### Path 2 — Full Card Fetch, Single System (`includeCards=1`, single category, no filters)

**Query sequence (all sequential unless noted):**

| # | Query | Model | Rows fetched | Est. cost |
|---|---|---|---|---|
| 1 | `flashcard.findMany` | `Flashcard` | ≤ 800 (scan limit) | 40–200 ms |
| 2 | `examQuestion.findMany` (chunked) | `ExamQuestion` | ≤ 200 per chunk | 20–80 ms per chunk |
| 3 | `loadFlashcardPoolSnapshotForPathway` | in-memory | — | 0–5 ms |
| 4 | `flashcardProgress.findMany` | `FlashcardProgress` | ≤ 800 | 20–80 ms |

**Query 1 detail — main flashcard scan:**
```sql
SELECT id, front, back, source_key, lesson_id, exam_question_id,
       exam_item_kind, question_stem, answer_options, correct_answer,
       rationale_correct, rationale_incorrect,
       category.name, category.topic_code, deck.pathway_id, deck.title
FROM flashcards
  JOIN flashcard_categories ON ...
  JOIN flashcard_decks ON ...
WHERE status='PUBLISHED' AND country={country} AND tier IN ({tiers}) AND ...
ORDER BY updated_at DESC
LIMIT {cardScanLimit}  -- min(800, (offset + limit) * 8, max 800)
```
- **Index used:** `@@index([status, country, tier])` — 3-column composite
- **Estimated selectivity:** status=PUBLISHED (≈60% of table), then country+tier narrows further
- **Bottleneck:** `ORDER BY updated_at DESC` requires either a sort or a composite index including `updated_at`; **no such index exists** → full table sort on the filtered set

**Query 2 detail — exam topic meta (chunked findMany):**
```sql
SELECT id, body_system, topic FROM exam_questions WHERE id IN ({chunk_of_200})
```
- **Chunk size:** `PRISMA_ID_IN_CHUNK_SIZE = 200`
- **In-process cache:** `getExamTopicMetaForPathway` — if populated (warm), 0 queries
- **Cold:** ceil(N/200) chunks where N = distinct exam question IDs in the flashcard scan
- **Index used:** primary key `id` — fast lookup
- **Estimated cost per chunk:** 5–20 ms; total with 800 cards ≈ 4 chunks × 15 ms = **60 ms**

**Query 4 detail — progress scan:**
```sql
SELECT flashcard_id, last_quality, repetitions, last_reviewed_at, next_review_at, lapses
FROM flashcard_progress
WHERE user_id={userId} AND flashcard_id IN ({scopedIds})
LIMIT 800
```
- **Index used:** `@@unique([userId, flashcardId])` — composite unique, highly selective
- **Estimated cost:** 15–60 ms (bounded by the 800-row IN clause)

**Total estimated cost (single system, warm meta):** 120–420 ms  
**Total estimated cost (single system, cold meta):** 180–560 ms

---

### Path 3 — Full Card Fetch, Multi-System (`includeCards=1`, multiple categories)

Multi-category does **not** add extra DB queries — the category filter is applied **in memory** after the main flashcard scan. The main cost difference is:
- The `flashcard.findMany` may return more diverse rows (same scan limit applies)
- Category matching via `resolveBuilderCategoryId` runs for each card (CPU, not DB)
- More cards pass category filter → more rows to serialize

**Total estimated cost (multi-system, warm):** 150–600 ms  
**Total estimated cost (multi-system, cold):** 250–900 ms

---

### Path 4 — Weak Areas Only (`weakOnly=true`)

**Additional condition in the query sequence:**
```typescript
const needsProgress = weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
```

When `weakOnly=true`, the progress query runs **before** category filtering and **all 800 scanned cards' IDs are loaded into the IN clause**:
```sql
SELECT flashcard_id, last_quality, repetitions, ...
FROM flashcard_progress
WHERE user_id={userId} AND flashcard_id IN ({all_800_scoped_ids})
LIMIT 800
```
Then cards are filtered: `lastQuality <= 2 OR repetitions < 2`

**Problem:** For a new learner with few or no progress records, the progress query returns 0 rows, and the weak-only filter produces 0 cards. The DB still pays the full IN clause cost.

**For an experienced learner with many progress records:** progress query is expensive when the user has reviewed many cards across large decks.

**Total estimated cost (weak-only):**
- Small deck (< 200 cards after scope): 120–400 ms
- Large deck (800 cards scanned): 250–800 ms
- Large deck + large progress table + cold meta: 600–2,500 ms

---

### Path 5 — Incorrect Cards Only (`incorrectOnly=true`)

Same path as `weakOnly` but with a stricter filter (`lastQuality <= 1`). The query cost is identical; the pool is typically smaller (fewer incorrect cards), so serialization is cheaper.

**Total estimated cost:** 200–700 ms (typical), up to 2,500 ms for cold large decks

---

### Path 6 — RN Pathway

The RN pathway (`ca-rn-nclex-rn`, `us-rn-nclex-rn`) has the **largest flashcard pools** in the system. The combined RN + general content (from the static analysis) shows ~852 articles in the RN stream, suggesting a proportionally large flashcard inventory.

**Key differences from generic pathway:**
- The `flashcard.findMany` scan hits its 800-row limit on almost every request
- The exam meta cache (`examTopicMetaForPathway`) fills with 200+ entries → larger warm cache benefit
- The hub inventory transaction (`exam_questions` group-by) scans more rows

**Estimated costs (RN, warm meta, 800-row scan):**
- Simple (no filters): 200–600 ms
- With weak-only: 400–1,200 ms
- With category filter (cardiovascular only): 150–500 ms (most are filtered in-memory)

---

### Path 7 — RPN Pathway

The RPN pathway (`ca-rpn-rex-pn`) has ~540 dedicated posts. The flashcard inventory is smaller than RN.

**Estimated costs:** 20–30% lower than RN across all session types.

---

### Path 8 — NP Pathway

The NP pathway (`ca-np-cnple`, FNP, AGPCNP) has ~399 dedicated posts. Smaller pool.

**Estimated costs:** 30–50% lower than RN for simple sessions; comparable for weak-only (progress scans are user-specific, not pool-size-dependent).

---

## Threshold Analysis — Sessions Exceeding Time Budgets

### > 1,000 ms (warning threshold)

**Likely causes:**
1. Cold exam topic meta cache + large deck (RN, full card fetch): 200-chunk exam meta queries = 4 serial `findMany` calls × 20–80 ms each
2. Large progress scan (`weakOnly`, `incorrectOnly`) on a user who has reviewed 700+ cards
3. Redis miss for hub inventory + first request of the day (cold inventory transaction)
4. Multi-step filter chain (weakOnly + category + sourceKind) that doesn't short-circuit

**Code location:**  
`build-flashcard-custom-session.ts` lines 603–679 (flashcard scan + chunked exam meta)

### > 2,000 ms (degraded)

**Likely causes:**
1. Cold everything: Redis miss + cold exam meta + progress scan on large deck
2. `loadFlashcardsExamInventoryForPathway` transaction slow (large exam_questions table, no partial index)
3. Session with `weakOnly=true` on a large deck where the user has progress records for 700–800 cards — the `flashcardProgress.findMany` IN clause with 800 IDs scans broadly

**Code location:**  
`build-flashcard-custom-session.ts` line 933 (`flashcardProgress.findMany`) and  
`load-flashcards-exam-inventory.server.ts` lines 190–244 (`$transaction` with raw SQL)

### > 3,000 ms (severe)

**Likely causes:**
1. `loadFlashcardsExamInventoryForPathway` transaction approaching its 8s statement timeout
2. Concurrent requests from same user (no per-user request coalescing) creating DB lock contention
3. Large RN deck + weak-only + cold meta + Redis miss — every expensive code path active simultaneously

**Code location:**  
`load-flashcards-exam-inventory.server.ts` line 194: `SET LOCAL statement_timeout = 8000`

### > 5,000 ms (timeout risk)

**Likely causes:**
1. DB under heavy load — `exam_questions` count + group-by scans > 8s
2. `withTimeout` fires → 503 returned
3. After our fix: server timeout is 7s → any build > 7s returns 503

**Code location:**  
`custom-session/route.ts` line 227: `const sessionBuildTimeoutMs = includeCards ? 7_000 : 2_500`

---

## Top 20 Slowest Session Creation Paths (Ranked by Estimated P95)

| Rank | Session Type | Pathway | Filters | Est. P95 | DB Queries | Root Location |
|---|---|---|---|---|---|---|
| 1 | Full cards | RN | `weakOnly=true`, cold meta, cold Redis | 4,200 ms | 5 | L603, L664, L933 |
| 2 | Full cards | RN | `incorrectOnly=true`, cold meta | 3,800 ms | 5 | L603, L664, L993 |
| 3 | Count-only | RN | cold Redis, first daily request | 3,200 ms | 2 (raw SQL txn) | inventory.server.ts L190 |
| 4 | Full cards | RN | `notStudiedOnly=true`, large deck | 3,000 ms | 5 | L603, L664, L933 |
| 5 | Full cards | RN | `recentStudiedOnly=true` | 2,800 ms | 5 | L603, L664, L933 |
| 6 | Full cards | RPN | `weakOnly=true`, cold meta | 2,600 ms | 5 | L603, L664, L933 |
| 7 | Full cards | NP | `weakOnly=true`, cold meta | 2,400 ms | 5 | L603, L664, L933 |
| 8 | Count-only | RPN | cold Redis | 2,200 ms | 2 | inventory.server.ts L190 |
| 9 | Full cards | RN | multi-system, no filters, cold meta | 1,800 ms | 3–4 | L603, L664 |
| 10 | Full cards | RN | single system, no filters, cold meta | 1,600 ms | 3 | L603, L664 |
| 11 | Count-only | NP | cold Redis | 1,500 ms | 2 | inventory.server.ts L190 |
| 12 | Full cards | RPN | multi-system, no filters, warm meta | 1,200 ms | 3 | L603, L933 |
| 13 | Full cards | NP | multi-system, no filters, warm meta | 1,100 ms | 3 | L603, L933 |
| 14 | Full cards | RN | `starredOnly=true` (large stateIds) | 1,000 ms | 2 | L603, L1026 |
| 15 | Full cards | RN | `savedOnly=true` (large stateIds) | 950 ms | 2 | L603, L1026 |
| 16 | Full cards | RN | single system, no filters, warm meta | 900 ms | 3 | L603, L933 |
| 17 | Full cards | RPN | single system, no filters, warm meta | 750 ms | 3 | L603, L933 |
| 18 | Full cards | NP | single system, no filters, warm meta | 650 ms | 3 | L603, L933 |
| 19 | Count-only | RN | Redis hit | 8 ms | 0 | L311 |
| 20 | Count-only | RPN/NP | Redis hit | 6 ms | 0 | L311 |

---

## Database Query Plans

### Query A — Main Flashcard Scan (slowest query in the critical path)

**Location:** `build-flashcard-custom-session.ts:603`

```sql
SELECT id, front, back, source_key, lesson_id, exam_question_id,
       exam_item_kind, question_stem, answer_options, correct_answer,
       rationale_correct, rationale_incorrect,
       c.name AS category_name, c.topic_code,
       d.pathway_id, d.title AS deck_title
FROM flashcards f
  JOIN flashcard_categories c ON f.category_id = c.id
  JOIN flashcard_decks d ON f.deck_id = d.id
WHERE f.status = 'PUBLISHED'
  AND f.country = $1           -- e.g. 'CA'
  AND f.tier IN ($2, $3)       -- e.g. 'RN', 'GENERIC'
ORDER BY f.updated_at DESC
LIMIT $4                       -- up to 800
```

**Index used:** `Flashcard_status_country_tier_idx` → `@@index([status, country, tier])`  
**Missing index:** No `updated_at` in the composite index → filesort on filtered result set  
**Expected plan:** Index Scan on `Flashcard_status_country_tier_idx`, Sort on `updated_at`, LIMIT 800  
**Problem:** For RN pathway with thousands of cards at `status=PUBLISHED, country=CA, tier=RN`, the filtered set can be 2,000–5,000 rows. Sorting that set for `ORDER BY updated_at DESC` is O(N log N) in memory.

**Fix opportunity:** Add `@@index([status, country, tier, updatedAt(sort: Desc)])` — Postgres can then satisfy the full query with an Index Scan + LIMIT without a separate sort step.

---

### Query B — Exam Topic Meta Lookup (chunked, sequential)

**Location:** `build-flashcard-custom-session.ts:667`

```sql
SELECT id, body_system, topic
FROM exam_questions
WHERE id = ANY($1::text[])   -- up to 200 IDs per chunk
LIMIT 5000
```

**Index used:** Primary key `id` (B-tree) — fast lookup  
**Sequence:** Sequential chunks: `for i in range(0, uncachedIds.length, 200)` → N/200 round-trips  
**Warm cache:** `getExamTopicMetaForPathway(pathwayScopeId)` — in-process Map, populated after first request  
**Cold cost:** For 800 scanned cards × 70% exam-backed = 560 exam question IDs → ceil(560/200) = 3 chunks × 15 ms = 45 ms  
**Fix opportunity:** Parallelise chunks: `await Promise.all(chunks.map(chunk => prisma.examQuestion.findMany(…)))` — reduces 3 × 15 ms serial to max(15 ms, 15 ms, 15 ms) = 15 ms

---

### Query C — Progress Scan (weak/incorrect/not-studied)

**Location:** `build-flashcard-custom-session.ts:933`

```sql
SELECT flashcard_id, last_quality, repetitions, last_reviewed_at, next_review_at, lapses
FROM flashcard_progress
WHERE user_id = $1
  AND flashcard_id = ANY($2::text[])   -- up to 800 IDs
LIMIT 800
```

**Index used:** `@@unique([userId, flashcardId])` → Postgres uses this as a unique index for the IN lookup  
**Expected plan:** Index Scan on `flashcard_progress_user_id_flashcard_id_key`  
**Cost:** Highly selective (user_id narrows to learner's own rows, then flashcard_id IN list) → fast for users with < 1,000 progress records  
**Problem:** For heavy users (10,000+ progress records across multiple pathways), the WHERE clause still generates a large IN list; Postgres may switch to a Bitmap Index Scan

---

### Query D — Inventory Transaction (count-only cold path)

**Location:** `load-flashcards-exam-inventory.server.ts:190`

```sql
-- Runs inside Prisma $transaction with SET LOCAL statement_timeout=8000
-- Query D1 (parallel with D2):
SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE {whereSql}

-- Query D2 (parallel with D1):
SELECT body_system, topic, COUNT(*)::bigint AS cnt
FROM exam_questions
WHERE {whereSql}
GROUP BY body_system, topic
ORDER BY cnt DESC NULLS LAST
LIMIT 500
```

**No explicit index** — relies on WHERE clause selectivity on `exam_questions`  
**`{whereSql}` includes:** `exam_family IN (…)`, `region_scope IN (…)`, `tier IN (…)`, `status = 'PUBLISHED'`  
**Problem:** `exam_questions` has no composite index matching this WHERE pattern. Full sequential scan filtered server-side.  
**Estimated rows scanned:** Full `exam_questions` table (10,000–50,000+ rows)  
**Estimated cost:** 200–1,500 ms depending on table size and server load  
**Fix opportunity:** Add partial index: `CREATE INDEX exam_q_flashcard_inv_idx ON exam_questions(exam_family, tier, region_scope) WHERE status='PUBLISHED'`

---

## Per-Session-Type Performance Estimates

### Single System (`categories=cardiovascular`, `includeCards=1`)

| Metric | Warm cache | Cold cache |
|---|---|---|
| p50 | 180 ms | 450 ms |
| p95 | 650 ms | 1,400 ms |
| p99 | 1,200 ms | 2,500 ms |
| max | 5,000 ms (timeout edge) | 7,000 ms (triggers 503) |
| DB queries | 2–3 | 3–4 |
| Cards returned | 8 (initial load) | 8 |

---

### Multi-System (`categories=cardiovascular,respiratory,neurological`, `includeCards=1`)

| Metric | Warm cache | Cold cache |
|---|---|---|
| p50 | 220 ms | 520 ms |
| p95 | 800 ms | 1,800 ms |
| p99 | 1,600 ms | 3,200 ms |
| max | 7,000 ms | 7,000 ms |
| DB queries | 2–3 | 3–4 |
| Cards returned | 8 | 8 |

**Note:** Multiple categories do not add DB queries — filtering is in-memory. Cost increase is from higher chance of cache miss and larger in-memory sort.

---

### Weak Areas Only (`weakOnly=1`, `includeCards=1`)

| Metric | Warm cache | Cold cache |
|---|---|---|
| p50 | 350 ms | 800 ms |
| p95 | 1,200 ms | 2,800 ms |
| p99 | 2,500 ms | 4,500 ms |
| max | 7,000 ms | 7,000 ms |
| DB queries | 3 (main scan + exam meta + progress) | 4–5 |
| Cards returned | 0–8 (depends on user's weak card count) | 0–8 |

**Slow-path trigger:** Progress scan with 800-item IN clause on users with large progress tables

---

### Incorrect Cards Only (`incorrectOnly=1`, `includeCards=1`)

| Metric | Warm cache | Cold cache |
|---|---|---|
| p50 | 300 ms | 700 ms |
| p95 | 1,100 ms | 2,600 ms |
| p99 | 2,200 ms | 4,000 ms |
| max | 7,000 ms | 7,000 ms |
| DB queries | 3 | 4–5 |

---

### Mixed Categories (all systems, `includeCards=1`)

| Metric | Warm cache | Cold cache |
|---|---|---|
| p50 | 300 ms | 700 ms |
| p95 | 900 ms | 2,000 ms |
| p99 | 1,800 ms | 3,500 ms |
| max | 7,000 ms | 7,000 ms |
| DB queries | 3 | 3–5 |

---

### By Pathway

| Pathway | p50 (warm) | p95 (warm) | p99 (warm) | Max DB queries |
|---|---|---|---|---|
| **RN** (`ca-rn-nclex-rn`) | 250 ms | 900 ms | 2,000 ms | 5 |
| **RPN** (`ca-rpn-rex-pn`) | 180 ms | 700 ms | 1,600 ms | 5 |
| **NP** (`ca-np-cnple`) | 160 ms | 600 ms | 1,400 ms | 5 |

**Why RN is slowest:** Largest flashcard inventory in the system. The main `flashcard.findMany` scan hits its 800-row limit on almost every request, maximising the exam meta chunk queries and progress scan.

---

## Code Locations for Each Slow Build

### Rank 1–5: `weakOnly`/`incorrectOnly`/`notStudiedOnly` on large decks

**Primary bottleneck:** Two separate `flashcardProgress.findMany` calls — one for the progress filter (line 933) and one unconditional call if `!needsProgress` (line 993). The unconditional call runs even when no progress filter is active.

```typescript
// build-flashcard-custom-session.ts:986
if (!needsProgress && scoped.length > 0) {
  // EXPENSIVE: Loads progress for ALL scoped cards to support adaptive ordering
  const progress = await prisma.flashcardProgress.findMany({
    where: { userId, flashcardId: { in: scopedIds } },
    // ...
    take: takeForIdIn(scopedIds, FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT),
  });
```

**Fix:** Move this second progress scan to a lazy loader or reduce it to the window of cards being served (not all 800 scoped).

### Rank 3, 8, 11: Cold count-only inventory

**Primary bottleneck:** `loadFlashcardsExamInventoryForPathway` → raw SQL transaction on `exam_questions` table without a partial index.

**Fix:** Add partial composite index:
```sql
CREATE INDEX CONCURRENTLY flashcard_inv_cover_idx
  ON exam_questions (exam_family, tier, region_scope)
  WHERE status = 'PUBLISHED';
```

### Rank 9–10: Cold exam topic meta (chunked sequential findMany)

**Primary bottleneck:** `build-flashcard-custom-session.ts:664` — sequential chunks of exam question ID lookups.

**Fix:** Parallelise chunks:
```typescript
// Current (sequential):
for (let i = 0; i < uncachedIds.length; i += PRISMA_ID_IN_CHUNK_SIZE) {
  const rows = await prisma.examQuestion.findMany(…);
}

// Fixed (parallel):
const chunks = chunkArray(uncachedIds, PRISMA_ID_IN_CHUNK_SIZE);
const allRows = await Promise.all(chunks.map(chunk => prisma.examQuestion.findMany(…)));
```

**Estimated savings:** 3 × 15 ms serial → max(15 ms) = 45 ms saved per cold request

### Missing index on `flashcards.updated_at`

**Location:** All `flashcard.findMany` calls with `ORDER BY updated_at DESC`  
**Fix:** Add to Prisma schema:
```prisma
@@index([status, country, tier, updatedAt(sort: Desc)])
```
Expected impact: Eliminates filesort on filtered result set for all card fetch paths. Estimated saving: 20–150 ms per request.

---

## Monitoring Queries

Once `buildDurationMs` starts appearing in `FLASHCARD_SESSION_CREATE` log events, use these queries to compute real p-values:

```sql
-- p50/p95/p99 by session type
SELECT
  pathway_id,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY build_duration_ms) AS p50,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY build_duration_ms) AS p95,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY build_duration_ms) AS p99,
  MAX(build_duration_ms) AS max,
  COUNT(*) FILTER (WHERE build_duration_ms > 1000) AS over_1s,
  COUNT(*) FILTER (WHERE build_duration_ms > 3000) AS over_3s,
  COUNT(*) FILTER (WHERE build_duration_ms > 5000) AS over_5s,
  COUNT(*) AS total
FROM flashcard_session_create_events
WHERE stage = 'success'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY pathway_id
ORDER BY p95 DESC;
```

```sql
-- Top timeout contributors
SELECT failure_reason, COUNT(*) AS count
FROM flashcard_session_create_events
WHERE stage = 'failed'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY failure_reason
ORDER BY count DESC;
```

---

## Recommended Fixes (Ranked by Impact)

| Priority | Fix | Estimated saving | Complexity |
|---|---|---|---|
| 🔴 **P1** | Add `@@index([status, country, tier, updatedAt(sort: Desc)])` to `Flashcard` model | 20–150 ms on all card fetches | Low (schema change + migration) |
| 🔴 **P1** | Add partial index on `exam_questions (exam_family, tier, region_scope) WHERE status='PUBLISHED'` | 200–1,000 ms on cold inventory | Low (raw migration) |
| 🟡 **P2** | Parallelise exam topic meta chunks (sequential → `Promise.all`) | 30–90 ms on cold meta | Low (2-line code change) |
| 🟡 **P2** | Move unconditional progress scan (line 986) to serve only the `limit` window, not all 800 scoped | 10–80 ms | Medium |
| 🟢 **P3** | Reduce `FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT` from 800 to 400 for `includeCards=1` with no progress/persistence filters | 20–60 ms | Low |
| 🟢 **P3** | Cache progress data for 60s per user per pathway (in-process Map, like exam topic meta) | 15–60 ms on repeat requests | Medium |
| 🟢 **P4** | Add `recentStudiedOnly` index: `@@index([userId, lastReviewedAt])` on `FlashcardProgress` | 10–40 ms | Low |

---

## Response Header Evidence

The new `x-nn-session-build-ms` header enables real-time monitoring via browser DevTools Network tab. Expected values by scenario:

| Header value | Interpretation |
|---|---|
| `0–50 ms` | Redis cache hit (count-only path) |
| `50–200 ms` | Warm exam meta, small pool |
| `200–600 ms` | Typical full card fetch, warm caches |
| `600–1,500 ms` | Cold meta OR progress filter OR large RN deck |
| `1,500–3,000 ms` | Cold everything OR weak-only on large deck |
| `3,000–7,000 ms` | Worst case — timeout risk, check logs |
| Absent / 503 | Build timed out (server returned 503 before header was set) |

Missing on 503 responses because `headers.set("x-nn-session-build-ms", ...)` runs before `return NextResponse.json(body, ...)` for success paths, but the timeout itself bypasses that line. The `buildDurationMs` field in the log is always set on the 503 path via the `FLASHCARD_SESSION_CREATE failed` log entry.
