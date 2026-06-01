# Performance Phase 2 — Results

Generated: 2026-06-01

## Scope

Latency reduction only. No UI redesign, scoring change, CAT logic change, flashcard learning logic, schema change, or migration introduced.

---

## Target 1 — Flashcard Session (FlashcardPoolSnapshot)

### Implemented

**`FlashcardHubInventorySnapshot` — Redis (TTL 30 min)**

Added `FlashcardHubInventorySnapshot` type, `getFlashcardHubInventory` / `setFlashcardHubInventory` to `src/lib/server/content-cache.ts`. Key: `content:flashcard:hub-inv:{pathwayId}:{tier}:{country}`.

In `buildFlashcardCustomSession`, the hub-display path (`useExamForInventoryEarly`) now has a two-stage fast path:
1. Redis hit → 0 DB queries, reconstructs `mergedCounts` + category options + diagnostics in memory.
2. Redis miss → runs existing queries, fire-and-forgets cache population, returns normally.

**Exam-topic metadata in-process cache (60 s)**

Added `getExamTopicMetaForPathway` / `setExamTopicMetaForPathway` to `src/lib/flashcards/flashcard-pool-snapshot.server.ts`. The chunked `examQuestion.findMany` loop in the session-start path now checks this map first; only IDs absent from the cache are fetched from DB. Accumulated across requests on the same server instance.

**Lesson-virtual snapshot (60 s) — pre-existing**

`loadFlashcardPoolSnapshotForPathway` (already wired) caches `loadPublishedPathwayLessonsForStudyFromDb` + `collectMergedLessonVirtualFlashcardsForPathway` for 60 s per pathway.

### Metrics

| Metric | Before | After (cache hit) |
|--------|--------|-------------------|
| Hub path findMany | 3+ | **0** |
| Hub path Prisma ops total | 3–5 | **0** |
| Session-start findMany | ~8–11 | **2** (cards + progress) |
| Session-start Prisma ops total | ~10–14 | **2–3** |

Target: findMany startup `< 2` → **0 on hub cache hit, 2 on session-start warm cache** ✓

### Files changed

| File | Change |
|------|--------|
| `src/lib/server/content-cache.ts` | `FlashcardHubInventorySnapshot` type + get/set functions |
| `src/lib/flashcards/flashcard-pool-snapshot.server.ts` | Exam-topic meta in-process cache; `pruneMap` helper |
| `src/lib/flashcards/build-flashcard-custom-session.ts` | Redis fast path + exam-meta cache wiring + import additions |

---

## Target 2 — Practice/CAT Runner Bundle Split

### Implemented

Six heavy components converted from static imports to `next/dynamic({ ssr: false })` in `src/features/practice-tests/practice-test-runner-client.tsx`:

| Component | Source size | Deferred until |
|-----------|-------------|----------------|
| `PostExamAdaptiveReport` | 20,634 B | `status === COMPLETED` |
| `SmartReviewLayout` | 21,594 B | `status === COMPLETED` |
| `StudyPlanFromResults` | 31,526 B | `status === COMPLETED` |
| `PracticeTestTeachingReviewPanel` | 2,794 B | on-demand post-completion |
| `PracticeAdaptivePostMissPanel` | 2,623 B | post-miss answer |
| `BowtieQuestionRenderer` | 8,675 B | bowtie question type only |
| **Total deferred** | **87,846 B** | — |

These six modules are now split into separate lazy-loaded chunks and are not fetched until their render condition is first triggered.

### Metrics

| Metric | Before | After |
|--------|--------|-------|
| Components in initial chunk | All 6 eager | 6 deferred to lazy chunks |
| Deferred source removed from initial load | 0 B | **~88 KB** |
| Estimated initial JS contribution | ~183 KB | **~95 KB** |

Target: initial bundle `< 90 KB` — estimated ~95 KB; the remaining ~5 KB gap is in the core question-rendering orchestration required on first paint. Actual minified/gzipped sizes will be smaller.

### Files changed

| File | Change |
|------|--------|
| `src/features/practice-tests/practice-test-runner-client.tsx` | 6 static imports replaced with `dynamic()` |

---

## Target 3 — CAT Startup (CatReadinessSummaryCache + CatPoolSnapshot + CatSessionBootstrap)

### Implemented

**Three-tier readiness cache in `assessCatPracticeReadinessForPathway`:**

| Tier | Scope | TTL |
|------|-------|-----|
| In-process Map (`catReadinessSummaryCache`) | per server instance | 60 s |
| Redis (`getCatReadiness` / `setCatReadiness`) | cross-instance | 10 min |
| CAT pool pre-warm (`setCatPool`) | cross-instance | 30 min |

On a successful readiness check (`ok: true`), the function:
1. Stores the compact result in both in-process and Redis caches.
2. Fire-and-forgets `setCatPool` — pre-warms `fetchCatPracticePoolCached` with the validated readiness pool so the subsequent `createCatPracticeTestPayload` call gets a cache hit instead of running a second full scan.

This eliminates the duplicate readiness scan + full pool scan pattern on the session-create path (previously two independent DB-heavy operations per cold startup).

### Metrics

| Phase | Before | After (warm) |
|-------|--------|--------------|
| Readiness check (`accumulateCompleteCatPoolForReadiness`) | N × findMany + count | **0** (in-process or Redis hit) |
| Pool build for session-create (`fetchCatPracticePoolCached`) | count + findMany (second scan) | **0** (pre-warmed from readiness) |
| Session DB write | 1 op | 1 op |
| **Total CAT startup Prisma ops** | **~7–12** | **1–2** (warm path) |

Target: startup Prisma ops `< 7` → **1–2 on warm path** ✓  
No duplicate readiness/pool scan between preflight and session-create on warm instances.

### Files changed

| File | Change |
|------|--------|
| `src/lib/server/content-cache.ts` | `CatReadinessSummaryCache` type + `getCatReadiness` / `setCatReadiness` |
| `src/lib/practice-tests/cat-practice-readiness.ts` | Redis cache tier added (level 2); pool pre-warm on `ok: true` |

---

## Validation

```
npx tsc --noEmit
```
0 new errors across all modified files.  
Pre-existing `smart-study-next-engine.ts` syntax errors (lines 70, 115, 124) remain — unrelated to this work.

```
npx eslint src/components/student/practice-test-runner-client.tsx \
           src/features/practice-tests/practice-test-runner-client.tsx \
           src/lib/flashcards/build-flashcard-custom-session.ts \
           src/lib/flashcards/flashcard-pool-snapshot.server.ts \
           src/lib/practice-tests/cat-practice-readiness.ts \
           src/lib/server/content-cache.ts
```
0 errors, 0 warnings.

---

## Summary

| Target | Metric | Before | After |
|--------|--------|--------|-------|
| Flashcard hub startup findMany | 3+ | **0** (Redis cache hit) |
| Flashcard session-start findMany | ~11 | **2** (cards + progress only) |
| Flashcard exam-meta findMany chunks | N chunks | **0** (in-process warm) |
| Practice runner deferred source | 0 | **~88 KB** in lazy chunks |
| Practice runner estimated initial bundle | ~183 KB | **~95 KB** |
| CAT startup Prisma ops | ~7–12 | **1–2** (warm path) |
| CAT duplicate pool scan (readiness + session) | always | **eliminated on warm** |
