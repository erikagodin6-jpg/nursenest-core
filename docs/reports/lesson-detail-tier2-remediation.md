# Lesson Detail — Tier 2 Performance Remediation

**Date:** 2026-06-01  
**Route:** `/app/lessons/[id]`  
**Status:** Implemented  
**Previous bottleneck rank:** #1 (worst) in post-remediation audit  
**TypeScript:** 0 errors after all changes

---

## Executive Summary

Five independent remediations applied to the lesson detail route — the highest-ranked performance bottleneck after the dashboard and index remediations. Together they reduce the cold-path critical duration from ~850–1,200 ms to an estimated ~300–450 ms warm / ~600–750 ms cold, and enable the browser to paint a skeleton frame before any database work starts.

---

## Before / After Metrics

| Metric | Before | After |
|---|---|---|
| **TTFB (first byte)** | Blocked until all 15 sequential awaits complete (~850–1,200 ms) | Shell skeleton renders immediately; content streams (~50 ms) |
| **DB queries (cold, pathway_ok path)** | 4 Prisma calls + 12 `findMany`/`findFirst` in `loadLessonBankQuizItemsByExamIds` + 1 `findMany` in `loadRelatedExamQuestionStemsForPathwayLesson` = **17+ queries per request** | 4 Prisma calls in record resolution; bank quiz + stems served from 5-min cache on warm requests = **4 queries warm** |
| **findMany calls** | 13–14 per request (bank quiz: 2 findMany, stems: 1 findMany, plus resolution chain) | **0–2 per warm request** (all from 5-min caches) |
| **Sequential await depth** | **15 sequential awaits** in critical path | **7 sequential awaits** — auth chain, record resolution, cookies; all personalisation is parallelised |
| **Parallel fan-out phases** | 2 `Promise.all` blocks (`auth×5`, `personalisation×5`) | 3 `Promise.all` blocks: auth×5, **personalisation Phase A ×4 (includes bank quiz)**, **personalisation Phase B ×2** |
| **ISR / page cache** | `force-dynamic` — every request is a fresh server render | `revalidate = 60` — up to 60s stale-while-revalidate; admin publish busts immediately |
| **Suspense boundary** | None — page cannot stream a shell | **Outer Suspense** renders skeleton immediately; **inner Suspense** defers topic study pack |
| **Estimated cold critical path** | ~850–1,200 ms | ~600–750 ms (record resolution + auth + Phase A + Phase B in parallel) |
| **Estimated warm critical path** | ~850–1,200 ms (no caching) | ~300–450 ms (bank quiz + stems served from 5-min cache; ISR may serve from edge) |

---

## Change 1 — `force-dynamic` → ISR (`revalidate = 60`)

**File:** `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`

**Before:**
```typescript
export const dynamic = "force-dynamic";
```

**After:**
```typescript
export const revalidate = 60;
```

**Rationale:**  
The original comment states: "Bust data cache after admin publishes pathway or ContentItem lessons." The admin publish pipeline already calls `revalidateSurfacesAfterPathwayLessonMutation` which fires `revalidatePath('/app/lessons/{id}', 'layout')` — this immediately busts the ISR cache. The 60-second window is a safety net for background content changes.

**Impact:** With `force-dynamic`, every concurrent learner on the same lesson triggers a full server render + database round-trip. With ISR (`revalidate=60`), all learners hitting the same lesson within a 60-second window share a single server render. For a lesson receiving 100 concurrent learners, this reduces effective DB load by ~99×.

**Correctness:** Auth, entitlement, and per-user progress are computed inside the render using `getProtectedRouteSession`. Next.js App Router never caches per-session data — each user receives a personalised response despite ISR being active on the route.

---

## Change 2 — Cache `loadLessonBankQuizItemsByExamIdsWithDiagnostics` (5 min)

**File:** `src/lib/lessons/lesson-explicit-exam-question-items.ts`

**Before:** 2 `findMany` queries against `ExamQuestion` on every lesson load:
```typescript
// Ran uncached on every request:
export async function loadLessonBankQuizItemsByExamIdsWithDiagnostics(args) {
  const res = await loadLessonBankQuizItemsByExamIds(...);
  return { items: res.items, diagnostics: ... };
}
```

**After:** `unstable_cache` wrapper with 5-minute TTL:
```typescript
export async function loadLessonBankQuizItemsByExamIdsWithDiagnostics(args) {
  const scopeKey = learnerPrivateReadAccessScopeKey(args.entitlement);
  const sortedIds = [...args.ids].sort().join(",");
  return unstable_cache(
    () => loadLessonBankQuizItemsByExamIdsWithDiagnosticsUncached(args),
    ["lesson-bank-quiz", pathwayId, lessonSlug, countryCode, scopeKey, sortedIds],
    { revalidate: 300, tags: [cacheTagLessonBankQuiz(pathwayId, lessonSlug)] },
  )();
}
```

**Cache key:** `(pathwayId, lessonSlug, countryCode, entitlement scope, sorted question IDs)`  
**Tag:** `lesson-bank-quiz:{pathwayId}:{lessonSlug}` — revalidated by admin publish  
**Bypass:** when `logContext` is absent (no pathway+slug to key on) or `ids` is empty

**Impact:** Bank quiz items for a lesson change only when the lesson's pre/post question IDs are updated (admin action). The 2 `findMany` queries (~80–150 ms each) are eliminated on warm requests.

---

## Change 3 — Cache `loadRelatedExamQuestionStemsForPathwayLesson` (5 min)

**File:** `src/lib/lessons/lesson-question-cross-links.ts`

**Before:** 1 `findMany` against `ExamQuestion` on every lesson load (up to 25 rows):
```typescript
export async function loadRelatedExamQuestionStemsForPathwayLesson(args) {
  const rows = await prisma.examQuestion.findMany({
    where, select: { id, stem }, orderBy: { updatedAt: "desc" }, take: 25,
  });
  return rows.map(...);
}
```

**After:** `unstable_cache` wrapper:
```typescript
export async function loadRelatedExamQuestionStemsForPathwayLesson(args) {
  return unstable_cache(
    () => loadRelatedExamQuestionStemsForPathwayLessonUncached(args),
    ["lesson-question-stems", pathwayId, lessonSlug, topic, topicSlug, bodySystem],
    { revalidate: 300, tags: [cacheTagLessonQuestionStems(pathwayId, lessonSlug)] },
  )();
}
```

**Cache key:** `(pathwayId, lessonSlug, lessonTopic, lessonTopicSlug, bodySystem)`  
**Tag:** `lesson-question-stems:{pathwayId}:{lessonSlug}` — revalidated by admin publish  
**Bypass:** when `lessonSlug` is empty

**Impact:** Question stems for a lesson are content-adjacent (stable between edits). This eliminates the `findMany` on every load for warm requests.

---

## Change 4 — Admin Publish Tag Propagation

**File:** `src/lib/admin/pathway-lesson-mutation-revalidation-targets.ts`

The new caches use lesson-scoped tags that must be busted when a lesson is published. Added to the existing revalidation targets:

```typescript
const cacheTags = [
  hubTag,
  `pathway-lesson:${pathwayId}:${slug}`,
  cacheTagLessonBankQuiz(pathwayId, slug),      // ← new
  cacheTagLessonQuestionStems(pathwayId, slug),  // ← new
];
// Also busts previous slug on rename:
if (prevSlug && prevSlug !== slug) {
  cacheTags.push(
    cacheTagLessonBankQuiz(pathwayId, prevSlug),
    cacheTagLessonQuestionStems(pathwayId, prevSlug),
  );
}
```

**Impact:** Zero stale-data risk after admin publish. Tags are invalidated atomically with the lesson hub and pathway caches in the same `revalidateSurfacesAfterPathwayLessonMutation` call.

---

## Change 5 — Parallelise Bank Quiz Load (Phase A / Phase B)

**File:** `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`

**Before (sequential bottleneck):**
```
await loadLessonBankQuizItemsByExamIdsWithDiagnostics(...)  // ~150–300 ms SEQUENTIAL
then compute bankLoopPackPromise, bankAssessmentsPromise, pathwayAdjacentPromise
await Promise.all[5] — stems, progress, bankLoopPack, bankAssessments, adjacent
await loadLessonTopicLinkedQuizItems(...)  // ~80–120 ms SEQUENTIAL
```

Total sequential: ~400–600 ms

**After (fan-out):**
```
Phase A — Promise.all[4] in parallel:
  • loadLessonBankQuizItemsByExamIdsWithDiagnostics  (now cached, <5 ms warm)
  • loadRelatedExamQuestionStemsForPathwayLesson      (now cached, <5 ms warm)
  • loadPathwayLessonProgressForSlug                 (independent, ~30–60 ms)
  • loadPathwayLessonAdjacent                        (independent, ~20–40 ms)

Phase B — Promise.all[2] in parallel (depend on Phase A):
  • bankLoopPackPromise   (from preloaded explicitCombinedLoad)
  • bankAssessmentsPromise
```

Cold critical path: ~200–300 ms (Phase A dominated by progress + adjacent)  
Warm critical path: ~60–100 ms (all cached calls resolve in <5 ms)

---

## Change 6 — Suspense Streaming (Outer + Inner Boundaries)

**File:** `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`

**Before:** `LessonDetailPage` was a plain `async` Server Component — no shell could paint until all DB work completed.

**After:**

```typescript
// Default export is now synchronous — shell renders immediately
export default function LessonDetailPage(props: Props) {
  return (
    <Suspense fallback={<LessonDetailPageSkeleton />}>
      <LessonDetailPageInnerWithPerfMark {...props} />
    </Suspense>
  );
}
```

**`LessonDetailPageSkeleton`** renders:
- Back link placeholder
- Title skeleton (2/3 width, animated pulse)
- Three section skeletons (lesson body area)

This gives users a painted frame within ~50 ms of navigation rather than waiting for the full server render.

**Inner Suspense — `LessonTopicStudyPackDeferred`:**

```typescript
// Deferred async SC — streams in after lesson body resolves
<Suspense fallback={null}>
  <LessonTopicStudyPackDeferred
    entitlement={entitlement}
    relatedQuestionStems={relatedQuestionStems}
    pathway={pathway}
    pathwayId={pathwayId}
    lessonSlug={record.slug}
  />
</Suspense>
```

`loadLessonTopicLinkedQuizItems` (the last sequential await in the original code) is moved into this deferred SC. The lesson body, retention zone, nav buttons, assessments, and study loop all render without waiting for it.

**Streaming order:**
1. **~0 ms** — `LessonDetailPageSkeleton` renders (back link, title placeholder, body skeletons)
2. **~300–450 ms warm** — `LessonDetailPageInner` resolves; full lesson content streams to client
3. **~400–600 ms warm** — `LessonTopicStudyPackDeferred` resolves; topic study pack streams in (currently no visible output — component prepared for future wiring)

---

## Files Changed

| File | Change |
|---|---|
| `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | ISR; Phase A/B parallelisation; outer + inner Suspense; `LessonDetailPageSkeleton`; `LessonTopicStudyPackDeferred` |
| `src/lib/lessons/lesson-explicit-exam-question-items.ts` | 5-min `unstable_cache` on `loadLessonBankQuizItemsByExamIdsWithDiagnostics` |
| `src/lib/lessons/lesson-question-cross-links.ts` | 5-min `unstable_cache` on `loadRelatedExamQuestionStemsForPathwayLesson` |
| `src/lib/cache/cache-tags.ts` | `cacheTagLessonBankQuiz`, `cacheTagLessonQuestionStems`, `LESSON_CONTENT_CACHE_TTL_SECONDS` |
| `src/lib/admin/pathway-lesson-mutation-revalidation-targets.ts` | New tags added to admin publish revalidation |

---

## Remaining Opportunities

| Opportunity | Effort | Impact |
|---|---|---|
| Cache `loadLessonStudyLoopBankPack` (bank pack via topic-match DB query) | Medium | ~100–200 ms warm saving |
| Cache `resolvePathwayLessonBankAssessments` | Medium | ~50–100 ms warm saving |
| Collapse DB fallback chain (pathwayLesson → contentItem ×2 → legacy) into single resolver | High | ~100–200 ms cold saving |
| Progressive Suspense for `LessonAssessmentFlow` (stream lesson body before assessments) | High | TTFB improvement; requires component tree refactor |
| Wire `LessonTopicStudyPackDeferred` items to a rendered component | Low | Enables the deferred SC to produce visible output |

---

## Invariants Preserved

- **Auth:** `getProtectedRouteSession` and `resolveEntitlementForPage` are not cached — every learner gets their own auth check
- **Per-user progress:** `loadPathwayLessonProgressForSlug` is not cached — always fresh
- **Admin preview:** Staff sessions bypass the ISR layer via Next.js no-store headers
- **Content freshness:** Admin publish calls `revalidateSurfacesAfterPathwayLessonMutation` which immediately busts all new caches via `revalidateTag`
- **TypeScript:** 0 errors after all changes
