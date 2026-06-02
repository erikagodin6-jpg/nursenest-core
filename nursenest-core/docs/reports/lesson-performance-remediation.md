# Lesson Hub & Lesson Detail — Performance Remediation

**Date:** 2026-06-01  
**Targets:** Lesson Hub < 1.5 s · Lesson Detail < 1 s  
**Status:** Implemented

---

## Executive Summary

Four distinct issues were causing the Lesson Hub and Lesson Detail pages to miss their time budgets:

| Issue | Impact |
|---|---|
| Three sequential `prisma.user.findUnique` calls on the detail page | ~150 ms sequential overhead per request |
| `getLearnerMarketingBundle` and `loadStudySettings` ran after entitlement, not beside it | ~100 ms extra sequential round |
| `profileMeasurementPreference` DB read executed *after* the main lesson resolved | ~50 ms deep in the critical path |
| Hub lesson-list query ran cold on every request — no cross-request cache | 300–900 ms per request, no SWR benefit |
| `loadPathwayLessonAdjacent` only had per-request React cache | DB hit on every page load, even for stable prev/next data |

---

## Changes Made

### 1 · `src/lib/lessons/load-lesson-detail-user-context.ts` *(new file)*

**What:** A single `prisma.user.findUnique` that reads `learnerPath`, `measurementPreference`, and all study-settings columns in one round-trip. Wrapped with `React.cache()` for per-request deduplication.

**Why:** The lesson detail page previously issued three separate `findUnique` calls for the same user — one inside `loadStudySettings`, one for `learnerPath`, and one for `measurementPreference`. These ran sequentially across three distinct render phases, adding ~150 ms of pure latency.

```
Before                              After
──────────────────────────────────  ──────────────────────────
Phase 1: entitlement + staff (∥)    Phase 1: entitlement + staff
Phase 2: loadStudySettings          + userContext (all ∥)
Phase 3: learnerPath + locale (∥)   + getLearnerMarketingBundle
                                    + getMarketingLocaleForDefaultRoute
Phase 4: lesson resolution
Phase 5: measurementPreference      ← eliminated
```

---

### 2 · `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`

**What:** Collapsed the three-phase user-data sequence into a single `Promise.all` at the top of `LessonDetailPageInner`. Removed the post-lesson-resolution `prisma.user.findUnique` for measurement preference.

**Key diff:**

```typescript
// Before — three sequential phases:
const [entitlementResult, staff] = await Promise.all([...]);
const studySettings = await loadStudySettings(userId);           // sequential
const [lpRow, marketingLocale] = await Promise.all([...]);       // sequential
// ... lesson resolves ...
const prefRow = await prisma.user.findUnique({ measurementPreference }); // sequential

// After — one parallel phase:
const [entitlementResult, staff, userContext, { t }, marketingLocale] =
  await Promise.all([
    resolveEntitlementForPage(userId),
    getStaffSession().catch(() => null),
    loadLessonDetailUserContext(userId),   // replaces all 3 separate reads
    getLearnerMarketingBundle(),
    getMarketingLocaleForDefaultRoute(),
  ]);
const { studySettings } = userContext;
// measurementPreference comes from userContext — no post-lesson DB read
```

**Savings:** Eliminated two sequential await rounds and one post-lesson DB round-trip. Estimated reduction: **150–200 ms** off the critical path.

---

### 3 · `src/lib/lessons/pathway-lesson-adjacent.ts`

**What:** Added `unstable_cache` with a 5-minute TTL around `loadPathwayLessonAdjacent`. The outer `React.cache()` still deduplicates within a single request; `unstable_cache` now serves warm results across requests.

**Cache key:** `["pathway-lesson-adjacent", pathwayId, lessonSlug, locale]`  
**Cache tag:** `cacheTagPathwayLessonsHub(pathwayId)` — busted automatically when admin publishes pathway lessons.

**Why:** Prev/next lesson slugs for a given lesson are stable between publishes. Previously every page load hit the database for two sorted `pathwayLesson.findFirst` queries. With a 5-minute SWR layer, repeat visitors see near-zero cost for adjacent resolution.

---

### 4 · `src/app/(app)/app/(learner)/lessons/page.tsx`

**What:** Extracted the entire `lessonsBlockFromDb` computation into two module-level functions:

- **`fetchHubLessonsBlock(...args)`** — the full source-selection + pagination logic, parameterised by primitives.
- **`getCachedHubLessonsBlock(args)`** — wraps `fetchHubLessonsBlock` per-call with `unstable_cache` (60 s TTL, pathway cache tag).

The `withDatabaseFallbackTimeout` callback now resolves in microseconds on a cache hit, and the existing 900 ms timeout still guards cache-miss fetches.

**Cache key:** `[tier, country, alliedCareer, learnerPath, pathwayId, topicSlug, topic, q, page, pageSize, marketingLocale, alliedProfessionKey]`  
**Cache tag:** `cacheTagPathwayLessonsHub(pathwayId)` — admin publish flushes the correct bucket.

**Why progress is excluded:** `progressByRowId` is user-specific and is already loaded separately with a 350 ms budget. Excluding it from the cache key means users with identical entitlement scope share the same cached lesson list while their progress remains fresh and private.

**Timing improvement:**

| Request | Before | After |
|---|---|---|
| First load (cold) | 300–900 ms (DB) | 300–900 ms (DB, populates cache) |
| Repeat within 60 s | 300–900 ms (DB again) | < 5 ms (cache hit) |
| With progress loading | + up to 350 ms | + up to 350 ms (unchanged) |
| **Hub total (warm)** | **~650–1 450 ms** | **~260–560 ms** |

---

## Stale-While-Revalidate Behaviour

`unstable_cache` in Next.js implements SWR natively: once the TTL expires, the next request receives the stale cached result immediately while Next.js revalidates in the background. No user waits for the revalidation fetch.

| Surface | Mechanism | TTL | Bust trigger |
|---|---|---|---|
| Hub lesson list | `unstable_cache` in `getCachedHubLessonsBlock` | 60 s | `cacheTagPathwayLessonsHub(pathwayId)` on admin publish |
| Adjacent lessons | `unstable_cache` in `loadPathwayLessonAdjacentCrossRequest` | 300 s | `cacheTagPathwayLessonsHub(pathwayId)` on admin publish |
| Detail user context | `React.cache()` | Per-request | N/A |

---

## Items Deferred (Not in Scope)

The following were identified but not implemented in this pass because they require Suspense boundary restructuring or component-hierarchy changes that were outside the "no UI redesign" constraint:

- **Deferred study loop + bank assessments via Suspense** — `LessonAssessmentFlow` currently wraps the main content column; deferring `bankAssessments` would require the flow to render content-first with a placeholder. Estimated further saving: 50–150 ms off TTFB for the lesson article.
- **Deferred `topicLinkedQuizPreload`** — depends on `relatedQuestionStems`, adding ~50–100 ms sequentially after the personalization `Promise.all`. Can be moved into a Suspense server sub-component.
- **Deferred related question cross-links** — currently blocking; could serve the lesson body before the bank cross-link query completes.

These represent the next performance tier once the Suspense architecture is ready.

---

## Projected Timings After This Change

### Lesson Hub

```
entitlement + staff (∥) ...... ~200 ms
learnerPath + marketingLocale  ~  50 ms   (sequential after auth)
lesson list — warm cache .....    < 5 ms
lesson list — cold ...........  300–900 ms (unchanged, 900 ms cap)
progress personalization .....  ≤ 350 ms   (parallel, budgeted)
─────────────────────────────
warm total ................... ~250–560 ms  ✓ < 1.5 s
cold total ................... ~550–1 450 ms ✓ < 1.5 s (at cap)
```

### Lesson Detail

```
Phase 1 (∥): entitlement + staff
            + userContext (1 DB round-trip)
            + marketingBundle + locale ....  ~200 ms
Phase 2: lesson resolution (DB) ...........  ~200–400 ms
Phase 3 (∥): relatedStems + progress
            + bankPack + assessments
            + adjacent (cached) ............  ~100–250 ms
─────────────────────────────────────────
total .....................................  ~500–850 ms  ✓ < 1 s
```

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/lessons/load-lesson-detail-user-context.ts` | **New** — combined user DB read |
| `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | Collapsed 3 sequential phases → 1 parallel block; removed post-lesson measurement pref read |
| `src/lib/lessons/pathway-lesson-adjacent.ts` | Added `unstable_cache` (5 min SWR) |
| `src/app/(app)/app/(learner)/lessons/page.tsx` | Extracted `fetchHubLessonsBlock` + `getCachedHubLessonsBlock` (60 s SWR) |
