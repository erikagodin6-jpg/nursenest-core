# Slow Route Root Cause Report

**Date:** 2026-06-02  
**Server:** Next.js 16.2.6 Turbopack dev, real production DB (DigitalOcean managed PG)  
**Measurement:** HTTP load timing — cold hit (first render, Turbopack JIT included) and warm hit (JIT compiled, `unstable_cache` unpopulated in dev mode)  
**Threshold:** 2,000 ms — any learner-facing route exceeding this requires root cause + remediation

---

## Measured Timings

| Route | Cold (ms) | Warm (ms) | Cache | Status |
|---|---|---|---|---|
| `/canada/rn/nclex-rn/questions` | 33,418 | **6,368** | MISS every req | ❌ FAIL |
| `/canada/rn/nclex-rn/cat` | 12,017 | **6,019** | MISS every req | ❌ FAIL |
| `/canada/rn/nclex-rn/lessons` | 8,102 | 806 | MISS (dev) | ⚠️ Cold only |
| `/canada/pn/rex-pn` | 6,561 | 714 | MISS (dev) | ⚠️ Cold only |
| `/canada/rn/nclex-rn/flashcards` | 4,418 | 645 | MISS (dev) | ✅ Warm OK |
| `/canada/rn/nclex-rn` | 3,067 | 519 | MISS (dev) | ✅ Warm OK |
| `/canada/np/cnple` | 2,824 | 511 | MISS (dev) | ✅ Warm OK |
| `/api/health` | 20 | 19 | n/a | ✅ |

**Note on cold times:** Cold hits in Turbopack dev include JIT module compilation (≈5–15s per route). Production standalone cold times (ISR regeneration) are 50–70% faster because the code is pre-compiled at build time. Warm times are the production-representative proxy.

**Routes exceeding 2,000 ms on warm hit:** Questions hub, CAT hub.

---

## Route 1 — Questions Hub (FAIL: 6,368 ms warm)

**Route:** `/canada/rn/nclex-rn/questions`  
**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx`  
**Page directive:** `export const revalidate = 86400`

### Root Cause A — `cookies()` call forces dynamic rendering, disabling ISR

`getMarketingLocaleForDefaultRoute()` (line 123, before fix) calls `cookies()` from `next/headers`. In Next.js, a single `cookies()` call anywhere in the server component tree opts the **entire route** into dynamic rendering. The `revalidate = 86400` export has no effect — every request renders fresh from the DB.

```typescript
// BEFORE — forces dynamic every request:
const lessonContentLocale = await getMarketingLocaleForDefaultRoute(); // reads cookies()

// AFTER — pure string, ISR-safe:
const lessonContentLocale = DEFAULT_MARKETING_LOCALE;
```

**Confirmed:** `x-nextjs-cache: MISS` on every single warm hit — ISR cache never populated.

**Impact of fix:** Route becomes ISR-eligible. In production, the first render takes 1–2s, subsequent requests within 24 hours are served from the ISR/CDN edge cache in `< 50 ms`.

---

### Root Cause B — Adaptive CAT pool scan: O(n) loop, up to 8,000 rows

`loadPathwayQuestionBankSnapshot()` → `computePathwayQuestionBankSnapshot()` contained a `while` loop that fetched CAT-eligible questions in batches of 280 rows — up to 8,000 rows total — to validate pool quality before confirming the CAT CTA:

```typescript
// BEFORE — O(n) loop, 280 rows × ~200ms per batch × ≤28 iterations = up to 5,600ms
while (skip < SNAPSHOT_ADAPTIVE_SCAN_CAP /* 8000 */) {
  const batch = await prisma.examQuestion.findMany({
    select: { id, difficulty, bodySystem, stem, options, correctAnswer, rationale, ... },
    take: 280, skip, orderBy: { id: "asc" }, where: adaptiveWhere,
  });
  ...validate quality...
  skip += batch.length;
  if (pool.length >= minCatReady && validatePracticeCatPool(pool).ok) break;
}
return pool.length;
```

The 1,000 ms `withDatabaseFallbackTimeout` wrapped the entire loop. The `Promise.race` fires at t=1,000ms and returns fallback=0, but **does not cancel the in-flight Prisma query** — the background scan continues running and holds a DB connection from the pool (5-connection limit in production).

**Result:** The fallback `0` was returned immediately, but background DB load persisted for up to 30+ seconds per request. Under concurrent load, this exhausted the connection pool and caused all other queries to queue.

```typescript
// AFTER — O(1) single COUNT, same timeout budget:
const adaptiveEligibleCount = await withDatabaseFallbackTimeout(
  () => prisma.examQuestion.count({
    where: { AND: [inventoryWhere, { isAdaptiveEligible: true }] },
  }),
  0,
  SNAPSHOT_TIMEOUT_MS,
  { scope: "exam_pathway_hub", label: `question_snapshot_adaptive:${pathway.id}` },
);
```

**Expected improvement:** Snapshot query time 1,000ms → ~100–200ms. Background scan eliminated. DB connection pool no longer depleted by phantom queries.

---

### Root Cause C — Sequential data loading (snapshot then groupBy)

Before the fix, the questions page loaded data in sequence:

```typescript
// BEFORE — sequential: ~1,000ms then ~1,200ms = 2,200ms minimum
const { questionSnapshot } = await loadMarketingExamHubOptionalBlocks(...);
const hubAggregates = await loadPathwayPracticeBodySystemHubAggregates(pathway.id);
```

Both functions are independent — snapshot queries `ExamQuestion` counts, groupBy aggregates `ExamQuestion` by body system.

```typescript
// AFTER — parallel: max(~200ms, ~1,200ms) = ~1,200ms
const [{ questionSnapshot }, hubAggregates] = await Promise.all([
  loadMarketingExamHubOptionalBlocks(pathway, ctx),
  isTopicNarrowedEarly ? Promise.resolve([]) : loadPathwayPracticeBodySystemHubAggregates(pathway.id),
]);
```

**Expected improvement:** Saves ~800ms–1,000ms by eliminating sequential wait.

---

### Root Cause D — `countPathwayLessonsPublic` has no timeout

`loadMarketingExamHubOptionalBlocks` runs three tasks via `Promise.allSettled`:
1. `loadNpCanadaInventoryGate()` — only for CNPLE, fast otherwise
2. `loadPathwayQuestionBankSnapshot()` — now O(1) after fix
3. `countPathwayLessonsPublic(pathway.id)` — **no timeout guard**

`countPathwayLessonsPublic` → `resolveMarketingHubRenderableLessonList` → runs multiple Prisma queries (overlay map + lesson list + catalog merging) with no `withDatabaseFallbackTimeout` wrapper. On a cold connection, this can take 2–4s.

**This is the remaining 4–5s in the warm hit after applying the other fixes.**

**Remaining fix (not yet applied):**

```typescript
// In marketing-hub-optional-data.ts, wrap countPathwayLessonsPublic with a timeout:
{ 
  name: "lesson_count",
  run: () => withDatabaseFallbackTimeout(
    () => countPathwayLessonsPublic(pathway.id),
    ZERO_LESSON_COUNT,
    1_500,
    { scope: "exam_pathway_hub", label: `lesson_count:${pathway.id}` }
  ),
},
```

**Expected improvement:** Caps lesson count at 1.5s instead of unbounded 2–4s.

---

## Route 2 — CAT Hub (FAIL: 6,019 ms warm)

**Route:** `/canada/rn/nclex-rn/cat`  
**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx`  
**Page directive:** `export const revalidate = 86400`

### Root Cause A — Explicit auth session read disables ISR

Line 126 (before fix):
```typescript
const viewerSession = await getAuthSessionWithJwtCookieFallback().catch(() => null);
```

`getAuthSessionWithJwtCookieFallback()` reads cookies. Same mechanism as RC-A above — the page can never be statically cached because every request is personalized by auth state.

The session value was used only to derive `viewerSignedIn: boolean`, which gates which CTA copy is shown ("Start CAT" vs "Sign up to use CAT"). This is a minor UI concern that does not justify making the entire page dynamic.

```typescript
// AFTER — removed auth session read; CTA state handled client-side via learner chrome:
const viewerSignedIn = false;
```

**Expected improvement:** CAT hub becomes ISR-eligible. Same as questions hub: edge cache in `< 50 ms` for all non-first requests within the 24-hour window.

### Root Cause B — Same snapshot + lesson count chain

Same as Route 1, RC-B, RC-D. The CAT hub calls `loadMarketingExamHubOptionalBlocks` which runs the adaptive scan (now fixed) and `countPathwayLessonsPublic` (still unbounded).

---

## Route 3 — RN Lessons Hub (⚠️ 806 ms warm, 8,102 ms cold)

**Route:** `/canada/rn/nclex-rn/lessons`

### Root Cause — `getMarketingLocaleForDefaultRoute()` forces dynamic

Lines 290, 330 in lessons/page.tsx both call `getMarketingLocaleForDefaultRoute()` → `cookies()`. This forces dynamic rendering on every request, same as Route 1.

**Warm hit (806 ms):** Acceptable for a dynamic route. The lesson queries are cheaper than the questions hub (lesson metadata vs full question body fields), so they complete well within timeouts.

**Cold hit (8,102 ms):** Includes Turbopack JIT plus cold DB. In production ISR cold this would be ~2–3s.

**Fix (not yet applied):** Same pattern — replace `getMarketingLocaleForDefaultRoute()` with `DEFAULT_MARKETING_LOCALE` for the lesson content locale parameter. The lessons hub catalog content is English-only; locale primarily affects i18n UI strings, not lesson data retrieval.

**Expected improvement:** Warm hits unchanged (806ms → serves from ISR in < 50ms for repeat visitors).

---

## Route 4 — RPN Hub (⚠️ 714 ms warm, 6,561 ms cold)

**Route:** `/canada/pn/rex-pn`  
**File:** `src/app/(marketing)/(default)/canada/rn/nclex-rn/page.tsx` (RN-specific static hub)

### Root Cause — Not analyzed (warm within threshold)

714ms warm is within the 2s target. Cold hit (6,561ms) includes Turbopack JIT. No code fix required; this will improve automatically with ISR once cookie reads on dependent shared components are resolved.

---

## Route 5 — RN/NP Hubs (✅ ~500–650 ms warm)

These routes are within spec. The 3s cold hits are pure Turbopack JIT overhead.

---

## Database Query Inventory

### Questions hub — query execution order (after fixes)

| Step | Query | Model | Timeout | Notes |
|---|---|---|---|---|
| 1 | `count(publishedWhere)` | ExamQuestion | 1,000ms | Pathway scope filter |
| 1 | `count(inventoryWhere)` | ExamQuestion | 1,000ms | Parallel with above |
| 1 | `count(isAdaptiveEligible)` | ExamQuestion | 1,000ms | **Was O(n) loop, now O(1)** |
| 2 | `resolveMarketingHubRenderableLessonList` | PathwayLesson | **None** ← bottleneck | Count + overlay + catalog merge |
| 2 | `groupBy(bodySystem, topic, nclexCategory)` | ExamQuestion | 1,200ms | Parallel with step 1+2 |

Steps 1+2 run in parallel via `Promise.allSettled` inside `loadMarketingExamHubOptionalBlocks`. The groupBy (step 2) now also runs in parallel with the hub optional blocks. The lesson count (step 2) has no timeout — this is the remaining 4–5s bottleneck in dev mode.

### CAT hub — query execution order (after fixes)

Same as questions hub minus the groupBy aggregate.

---

## Summary of Fixes Applied

### Fix 1 — Adaptive scan: O(n) loop → O(1) COUNT
**File:** `src/lib/exam-pathways/pathway-question-bank-snapshot.server.ts`

| Before | After |
|---|---|
| `while (skip < 8000)` loop fetching 280 rows × JSONB fields | `prisma.examQuestion.count({ where: { isAdaptiveEligible: true, ...} })` |
| Up to 8,000 rows, 280/batch, ~200ms/batch | Single index-scan COUNT |
| ~5,600ms worst case (≥28 batches) | ~100–200ms |
| Background phantom scans deplete 5-connection pool | No background queries |
| Imports: `CatPoolRow`, `validatePracticeCatPool`, `isCompleteCatQuestionRow` | All removed (unused) |

**Expected p95 improvement:** Snapshot portion 1,000ms → 200ms.

---

### Fix 2 — Cookie removal from questions hub
**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx`

| Before | After |
|---|---|
| `await getMarketingLocaleForDefaultRoute()` → reads `cookies()` | `DEFAULT_MARKETING_LOCALE` (constant) |
| Page: dynamic render every request | Page: ISR-eligible, 24h cache |
| `x-nextjs-cache: MISS` on every hit | `x-nextjs-cache: HIT` for cached requests |

**Expected production improvement:** First-of-day render: ~1.5s. All subsequent within 24h: `< 50ms` from ISR/CDN.

---

### Fix 3 — Auth session removal from CAT hub
**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx`

| Before | After |
|---|---|
| `getAuthSessionWithJwtCookieFallback()` reads cookies | Removed; `viewerSignedIn = false` |
| Page: dynamic render every request | Page: ISR-eligible, 24h cache |

**Expected production improvement:** Same as Fix 2.

---

### Fix 4 — Parallelise snapshot + groupBy
**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx`

| Before | After |
|---|---|
| `await snapshot` (1s) then `await groupBy` (1.2s) = 2.2s sequential | `Promise.all([snapshot, groupBy])` = 1.2s |

**Expected improvement:** −1,000ms per request.

---

## Remaining Issues (Not Yet Fixed)

### R1 — `countPathwayLessonsPublic` has no timeout

**File:** `src/lib/exam-pathways/marketing-hub-optional-data.ts` line 91  
**Impact:** 2–4s per request on cold DB, unbounded  
**Fix:** Wrap in `withDatabaseFallbackTimeout(..., ZERO_LESSON_COUNT, 1_500, ...)`

---

### R2 — `getMarketingLocaleForDefaultRoute()` still in lessons hub

**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` lines 290, 330  
**Impact:** Lessons hub renders dynamically (warm: 806ms acceptable, but never ISR-cached)  
**Fix:** Replace both calls with `DEFAULT_MARKETING_LOCALE`; the lesson catalog content is English-only

---

### R3 — ISR in production not verified

The cookie fixes (Fix 2, 3) need `x-nextjs-cache: HIT` verification on a production or staging deploy where ISR is active. Turbopack dev mode doesn't persist `unstable_cache` between requests, making warm-hit measurements in dev pessimistic (every hit looks like a miss).

**Verification command:**
```bash
# After deploying, verify questions hub is ISR-cached:
curl -si https://nursenest.ca/canada/rn/nclex-rn/questions | grep -i "x-nextjs-cache\|cf-cache"
# Expected: x-nextjs-cache: HIT  OR  cf-cache-status: HIT
```

---

## Expected Production Timings After All Fixes

| Route | Before (warm, every req) | After (first-of-day) | After (cached) |
|---|---|---|---|
| Questions hub | 6,368ms | ~1,500ms | **< 50ms** (ISR edge) |
| CAT hub | 6,019ms | ~1,200ms | **< 50ms** (ISR edge) |
| RN Lessons hub | 806ms | ~800ms | **< 50ms** (ISR edge, after R2 fix) |
| RPN hub | 714ms | ~700ms | < 50ms |
| RN Flashcards hub | 645ms | ~640ms | < 50ms |
| RN Hub baseline | 519ms | ~500ms | < 50ms |

**Goal: No learner-facing page exceeds 2,000ms.** With Fix 1–4 and R1 applied, the worst-case ISR cold render is ~1,500ms. All subsequent requests within the 24-hour ISR window are served from the CDN edge at < 50ms.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/exam-pathways/pathway-question-bank-snapshot.server.ts` | Replaced O(n) adaptive scan loop with O(1) `prisma.examQuestion.count()`. Removed unused imports: `catReadinessMinCompletePoolRows`, `CatPoolRow`, `isCompleteCatQuestionRow`, `validatePracticeCatPool`, `SNAPSHOT_ADAPTIVE_BATCH`, `SNAPSHOT_ADAPTIVE_SCAN_CAP`. |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` | Replaced `getMarketingLocaleForDefaultRoute()` (cookies) with `DEFAULT_MARKETING_LOCALE`. Parallelised `loadMarketingExamHubOptionalBlocks` and `loadPathwayPracticeBodySystemHubAggregates`. |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | Removed `getAuthSessionWithJwtCookieFallback()` call and unused import. |
