# Post-Remediation Bottleneck Ranking

**Date:** 2026-06-01  
**Context:** Measured after safe-performance-wins, index-remediation, and dashboard-remediation sprints.  
**Method:** Static analysis of server-side page files and their transitive lib dependencies — Prisma call counts, sequential await depth, client-side fetch and useEffect density, Suspense boundary presence, and cache coverage.

---

## Remediation History (What Changed Before This Audit)

| Sprint | Key Changes |
|---|---|
| Safe Performance Wins | Parallelised dashboard reads; added `Suspense` shell skeleton |
| Index Remediation | DB index additions (not tracked in this audit) |
| Dashboard Remediation | 3-phase parallel fan-out; 15-min caches for `buildLearnerStudySnapshot`, `computeBenchmarkData`, `buildSmartStudyNextRecommendations`; CAT invalidation added |

---

## Rankings

### Previous vs Current

| Route | Previous Rank | Current Rank | Delta |
|---|---|---|---|
| Lesson Detail | #1 (worst) | **#1 (worst)** | → No change — untouched |
| Lessons Hub | #2 | **#2** | → No change — timeout mitigates, still no Suspense |
| Practice Session (client) | #3 | **#3** | → No change — 4,935-line client, 25 useEffects |
| Dashboard | #4 | **#5** | ↑ Improved — 3-phase parallel + 15-min caches |
| Flashcards Hub | #5 | **#4** | ↓ Relative worsening — now heavier than dashboard |
| CAT Session (client) | #6 | **#6** | → No change — 819-line client, sequential fetch/answer loop |
| Practice Hub | #7 | **#7** | → No change — single DB call with timeout |
| Flashcard Session | #8 | **#8** | → No change — minimal server work |
| Practice Test Server | #9 | **#9** | → No change — delegated bootstrap |
| CAT Launch | #10 | **#10** | → No change — redirect only |

**New #1 Bottleneck: Lesson Detail** — unchanged from before and now more clearly the largest remaining performance gap.

---

## Route-by-Route Detail

---

### 1. Lesson Detail — `/app/lessons/[id]` 🔴 #1

**Previous rank:** #1 · **Current rank:** #1 · **Status:** Untouched

| Metric | Value |
|---|---|
| File lines | 1,358 |
| Prisma calls (page file) | 4 |
| `findMany` / `findFirst` in transitive libs | 16+ (lesson-explicit-exam-question-items alone: 12) |
| Client `fetch()` calls | 0 |
| `useEffect` hooks | 0 |
| `Suspense` boundary | ❌ None |
| Caching | ❌ `force-dynamic`; no cache on any transitive loader |
| Sequential await depth | **15 sequential `await` calls** in critical path |
| `Promise.all` fan-outs | 2 (auth ×5, personalization ×5) |

**Critical path chain:**
```
1. params.id resolve
2. getProtectedRouteSession
3-7. Promise.all[5] — auth, entitlement, staff, i18n, locale
8. withDatabaseFallback → appPathwayLessonVisibleToSubscriber
9. pathwayLessonReadOmitArgs
10. prisma.pathwayLesson.findUnique
11. resolveAppSubscriberPathwayLessonForDetail
12. prisma.contentItem.findFirst (fallback #1)
13. prisma.contentItem.findFirst (fallback #2)
14. getLegacyContentMapLessonById (fallback #3)
15. withDatabaseFallback (meta)
   ↓ (only if pathway lesson found)
16-20. Promise.all[5] — question stems, progress, bank pack, assessments, adjacent
21. loadLessonBankQuizItemsByExamIdsWithDiagnostics (sequential, post-fan-out)
22. loadLessonTopicLinkedQuizItems (sequential, after bankPack)
```

**Estimated cold critical path:** ~850–1,200 ms  
**Warm critical path:** Same — zero caching on any part of this route.

**Top 3 expensive operations:**
1. `loadLessonBankQuizItemsByExamIdsWithDiagnostics` — 2× `findMany` against `ExamQuestion`, uncached
2. `loadRelatedExamQuestionStemsForPathwayLesson` — question stem matching per lesson
3. `resolveAppSubscriberPathwayLessonForDetail` — entitlement-scoped lesson resolution

**Key issues:**
- `force-dynamic` on the page prevents any ISR/CDN caching
- Sequential DB fallback chain (pathwayLesson → contentItem fallback #1 → contentItem fallback #2 → legacy) adds 3× round-trip latency on miss
- `loadLessonBankQuizItemsByExamIdsWithDiagnostics` performs 2 `findMany` queries with no cache — runs on every lesson load
- No `Suspense` boundary — page cannot stream a shell while data loads

---

### 2. Lessons Hub — `/app/lessons` 🔴 #2

**Previous rank:** #2 · **Current rank:** #2 · **Status:** Partially mitigated by 60s `unstable_cache`

| Metric | Value |
|---|---|
| File lines | 986 |
| Prisma calls (page file) | 3 |
| `findMany` / `findFirst` in page | 0 (all delegated to paginator) |
| Client `fetch()` calls | 0 |
| `useEffect` hooks | 0 |
| `Suspense` boundary | ❌ None |
| Caching | ⚠️ 60-second `unstable_cache` on hub lesson list only |
| Primary DB timeout budget | **900 ms** (`LESSONS_PAGE_DB_TIMEOUT_MS`) |
| Sequential await depth | 6+ sequential awaits before paginator |

**Critical path chain:**
```
1. getProtectedRouteSession
2. resolveEntitlementForPage
3. visiblePathwayIdsForAppLessons
4. withDatabaseFallbackTimeout(prisma.pathwayLesson.findFirst) — optional, 900ms budget
5. withDatabaseFallbackTimeout(paginatePathwayLessons) — primary, 900ms budget
   OR readPathwayLessonsHubPageSnapshot (snapshot fallback on timeout)
6. withLessonsStartupBudget(loadPathwayLessonProgressMap) — 900ms budget
```

**Estimated cold critical path:** ~600–900 ms (timeout-capped)  
**Warm critical path (cache hit):** ~100–150 ms

**Top 3 expensive operations:**
1. `paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver` — paginated DB scan
2. `loadPathwayLessonProgressMap` — per-pathway progress join
3. `visiblePathwayIdsForAppLessons` — scope resolution with multi-query entitlement check

**Key issues:**
- No `Suspense` — full page blocks on 900ms budget before first byte of content
- Cache covers the lesson list but not per-user progress (intentional — it's personalised)
- Three separate timeout races add coordination overhead
- `prisma.contentItem.count` fires sequentially before paginator starts

---

### 3. Practice Test Session (client) — `/app/practice-tests/[id]` 🟠 #3

**Previous rank:** #3 · **Current rank:** #3 · **Status:** Untouched

| Metric | Value |
|---|---|
| Server page lines | 152 |
| Server `Prisma` calls | 0 (delegated) |
| Client component lines | **4,935** (`practice-test-runner-client.tsx`) |
| Client `fetch()` calls | 7 (all to `/api/practice-tests/${testId}`) |
| Client `useEffect` hooks | **25** |
| `Suspense` boundary | ❌ None on server page |
| Server caching | None needed (session state) |
| Server sequential depth | 2 (bootstrap → settings Promise.all) |

**Client-side critical path (after hydration):**
```
useEffect[1] → fetch /api/practice-tests/${id}  (load question)
useEffect[2-5] → answer tracking, timer, keyboard, scroll
useEffect[submit] → fetch /api/practice-tests/${id} PATCH (save answer)
useEffect[submit] → fetch /api/exams/submit POST (complete)
```

**Estimated server-to-interactive:** ~200–300 ms (server is fast; client hydration dominates)  
**Client JS bundle contribution:** ~4,935 lines × ~50 bytes/line = ~240 KB source

**Top 3 expensive operations:**
1. 25 `useEffect` hooks — most fire on mount; coordination complexity creates waterfall on first interaction
2. Sequential answer→submit API round-trip (each answer blocked until previous completes)
3. Large component footprint creates long hydration time on slow devices

**Key issues:**
- 25 `useEffect` hooks in a single component is a smell; several fire on the same state changes, creating coordination overhead
- 7 `fetch` calls to the same endpoint with different HTTP methods — could be consolidated
- No streaming skeleton; page is fully blocked until the client bundle hydrates

---

### 4. Flashcards Hub — `/app/flashcards` 🟡 #4

**Previous rank:** #5 · **Current rank:** #4 · **Reason for relative rise:** Dashboard improved past it

| Metric | Value |
|---|---|
| File lines | 590 |
| Prisma calls | 0 |
| Client `fetch()` calls | 0 |
| `useEffect` hooks | 0 |
| `Suspense` boundary | ✅ 3 Suspense boundaries |
| Caching | ❌ No explicit cache on hub loads |
| Primary timeout budget | 1,200 ms (pathway bootstrap), 100 ms (inventory) |
| Sequential await depth | 4 |

**Critical path:**
```
1. getProtectedRouteSession + resolveEntitlementForPage (sequential)
2. listPathwaysCompatibleWithSubscription
3. Promise.race[1200ms] — readFlashcardsHubPathwayBootstrapSnapshot
4. Promise.race[100ms] — loadFlashcardsExamInventoryForPathway (fast-fail to client)
```

**Estimated critical path:** ~300–500 ms (timeout-capped at 1,200 ms worst case)

**Top 3 expensive operations:**
1. `readFlashcardsHubPathwayBootstrapSnapshot` — pathway + flashcard counts
2. `loadFlashcardsExamInventoryForPathway` — category options (100ms timeout, deferred to client)
3. `listPathwaysCompatibleWithSubscription` — entitlement pathway filtering

**Key issues:**
- No cache on `readFlashcardsHubPathwayBootstrapSnapshot` — fires on every load
- Aggressive 100ms timeout for inventory falls back to client-side fetch, adding a client round-trip
- `resolveEntitlementForPage` is sequential before pathway resolution

---

### 5. Dashboard — `/app` 🟡 #5 ↑ Improved

**Previous rank:** #4 · **Current rank:** #5 · **Status:** Significantly improved by dashboard remediation

| Metric | Value |
|---|---|
| File lines | 612 |
| Prisma calls (page file) | 2 (in Phase 1 fan-out) |
| `findMany` | 0 |
| Client `fetch()` calls | 0 |
| `useEffect` hooks | 0 |
| `Suspense` boundary | ✅ 3 (shell defers all heavy content) |
| Caching | ✅ 45s (`loadPremiumDashboardSnapshot`), 900s (`buildLearnerStudySnapshot`, `computeBenchmarkData`, `buildSmartStudyNextRecommendations`) |
| Sequential await depth | 3 phases (each parallelised internally) |
| `Promise.all` / `Promise.race` | 3 fan-outs |

**Critical path (warm cache):**
```
Phase 1 (parallel, ~50–100ms warm): snapshot + 7 fast reads
Phase 2 (parallel, <10ms warm):     studySnapshot + benchmark (cached 15min)
Phase 3 (parallel, ~80–150ms):      inferContinue + labs + adaptive + studyNext (cached 15min)
```

**Estimated warm critical path:** ~300–450 ms  
**Estimated cold critical path:** ~700–900 ms  
**Previous cold critical path:** ~1,280–1,550 ms

**Top 3 remaining bottlenecks within dashboard:**
1. `loadLearnerAdaptiveWireBundle` — adaptive ML scoring, ~150–200ms, not cached
2. `inferContinueStudyFromActivity` — activity DB scan, ~80ms, not cached
3. `loadPremiumDashboardSnapshot` — 45s cache means still misses on first load per user per minute

---

### 6. CAT Session (client) — `/app/cat` + `nclex-cat-runner.tsx` 🟡 #6

**Previous rank:** #6 · **Current rank:** #6 · **Status:** Untouched

| Metric | Value |
|---|---|
| Server page lines | 26 (redirect alias) |
| Server `Prisma` calls | 0 |
| Client component lines | 819 (`nclex-cat-runner.tsx`) |
| Client `fetch()` calls | 5 (session start, answer per question, analysis) |
| Client `useEffect` hooks | 4 |
| `Suspense` boundary | N/A (redirect) |
| Server caching | N/A |

**Client-side critical path:**
```
Mount → fetch /api/cat/np/session (start or resume session)
Answer → fetch /api/cat/np/answer (sequential per question — by design)
Complete → fetch /api/cat/np/analysis (results)
```

**Estimated per-question latency:** ~150–300 ms (sequential by design — answer must complete before next question)

**Key issues:**
- The sequential answer/next-question loop is **by design** for CAT statistical accuracy — cannot be parallelised
- `loadAnswerHistory` in the answer API runs 2 `findMany` queries without caching — adds ~50ms per answer on top of the engine computation
- Cache invalidation now fires on session completion (remediated)

---

### 7. Practice Hub — `/app/practice-tests` 🟢 #7

**Previous rank:** #7 · **Current rank:** #7 · **Status:** Stable

| Metric | Value |
|---|---|
| File lines | 355 |
| Prisma calls | 1 (`prisma.user.findUnique`, 650ms timeout) |
| `findMany` | 0 |
| Client `fetch()` | 0 |
| `useEffect` | 0 |
| `Suspense` boundary | ❌ None |
| Caching | ❌ None |
| Sequential await depth | 2 |

**Critical path:**
```
1. Promise.all[2] — listPathwaysCompatibleWithSubscription + withDatabaseFallbackTimeout(user)
2. Promise.race[650ms] — loadSubscriberDiscoveryAggregates (optional)
```

**Estimated critical path:** ~200–350 ms (well-protected by timeouts)

**Key issues:**
- No `Suspense` — but fast enough that it rarely matters in practice
- Discovery aggregates fire on every load with no cache

---

### 8. Flashcard Session — `/app/flashcards/[deckRef]` 🟢 #8

**Previous rank:** #8 · **Current rank:** #8 · **Status:** Stable — minimal server work by design

| Metric | Value |
|---|---|
| File lines | 36 |
| Prisma calls | 0 |
| Sequential await depth | 1 |
| Caching | N/A |
| `Suspense` | ❌ None needed |

Session state and deck data are loaded client-side after hydration. Server page is a thin authentication shell.

---

### 9. Practice Test Server Page — `/app/practice-tests/[id]` 🟢 #9

**Previous rank:** #9 · **Current rank:** #9 · **Status:** Stable — well-delegated

| Metric | Value |
|---|---|
| File lines | 152 |
| Prisma calls | 0 |
| Sequential await depth | 2 |
| `Promise.all` | 2 |
| Caching | None needed |

**Critical path:**
```
1. loadLearnerActivityBootstrap (single await)
2. Promise.all[2] — loadStudySettings + loadPracticeTestShellBootstrap
```

Fast, well-structured. The heaviness lives in the client session runner (#3 above).

---

### 10. CAT Launch — `/app/practice-tests/cat-launch` 🟢 #10

**Previous rank:** #10 · **Current rank:** #10 · **Status:** Pure redirect

| Metric | Value |
|---|---|
| File lines | 94 |
| Prisma calls | 0 |
| Sequential await depth | 1 (redirect target resolution) |

Deprecated route that immediately redirects. Negligible cost.

---

## Summary Scorecard

| Rank | Route | Cold Path (ms) | Warm Path (ms) | Suspense | Cache | Primary Issue |
|---|---|---|---|---|---|---|
| 🔴 #1 | Lesson Detail | 850–1,200 | 850–1,200 | ❌ | ❌ | 15 sequential awaits; 12 findMany in quiz loader; no cache anywhere |
| 🔴 #2 | Lessons Hub | 600–900 | 100–150 | ❌ | ⚠️ 60s list only | No Suspense; timeout-capped but sequential |
| 🟠 #3 | Practice Session (client) | 200–300 ttf | 200–300 ttf | ❌ | N/A | 25 useEffects; 7 fetches; 4,935-line client |
| 🟡 #4 | Flashcards Hub | 300–500 | 300–500 | ✅ | ❌ | No hub cache; 100ms inventory races to client |
| 🟡 #5 | Dashboard | 700–900 | 300–450 | ✅ | ✅ multi-TTL | Adaptive bundle uncached; 45s snapshot still cold-misses |
| 🟡 #6 | CAT Session (client) | 150–300/q | 150–300/q | N/A | N/A | Sequential by design; answer API has 2 uncached findMany |
| 🟢 #7 | Practice Hub | 200–350 | 200–350 | ❌ | ❌ | Fast enough; discovery has no cache |
| 🟢 #8 | Flashcard Session | 50–100 | 50–100 | N/A | N/A | Thin server shell; client-loaded |
| 🟢 #9 | Practice Test Server | 100–200 | 100–200 | ❌ | N/A | Well-delegated; fast |
| 🟢 #10 | CAT Launch | <50 | <50 | N/A | N/A | Redirect only |

---

## New #1 Bottleneck: Lesson Detail

Lesson Detail is the clear new #1 bottleneck after dashboard remediation. It is the only route that:
- Has **zero caching** while being `force-dynamic`
- Has a **15-sequential-await critical path** (no parallelisation of the record resolution fallback chain)
- Runs **12+ `findMany` / `findFirst` queries** via `loadLessonBankQuizItemsByExamIdsWithDiagnostics` on every load
- Has **no `Suspense` boundary** — the page cannot stream a shell to the browser

### Recommended Next Interventions for Lesson Detail

1. **Add a `Suspense` shell** — wrap `LessonDetailPageInner` in a boundary with a skeleton so the page chrome renders immediately
2. **Cache `loadLessonBankQuizItemsByExamIdsWithDiagnostics`** — question stems for a given lesson change only when content is published; a 5-minute `unstable_cache` keyed on `(lessonSlug, pathwayId, tier)` eliminates the 2× `findMany` on repeat visits
3. **Cache `loadRelatedExamQuestionStemsForPathwayLesson`** — same cadence as above
4. **Collapse the DB fallback chain** — the 3-step fallback (pathwayLesson → contentItem #1 → contentItem #2 → legacy) runs sequentially; a single `Promise.all` with a unified resolver would cut 2–3 round-trips on miss
5. **Remove `force-dynamic`** — lesson content is published content; ISR with a 60-second revalidation window is more appropriate than per-request rendering
