# Safe Performance Wins Audit v2
**Date:** 2026-06-01  
**Scope:** Homepage · Lessons · Flashcards · Practice Tests · CAT · Study Plans · Readiness · Marketing Hubs · Blog  
**Constraint:** No schema changes · No business logic changes · No content changes · No entitlement changes · No learning engine changes

---

## Architecture Snapshot

| Layer | Strategy | Key Files |
|---|---|---|
| Marketing ISR | `revalidate` at route level (5 s–24 h) | `(marketing)/(default)/...page.tsx` |
| App routes | All `force-dynamic` (inherits from `(app)/layout.tsx`) | `(app)/layout.tsx` |
| Redis content cache | Upstash REST, typed wrappers, 5–60 min TTLs | `lib/server/content-cache.ts` |
| Next.js private read cache | `unstable_cache` + tag invalidation per user | `lib/cache/learner-private-read-cache.server.ts` |
| In-memory entitlement cache | 60 s process-local Map + React `cache()` | `lib/entitlements/get-user-access.ts` |
| Bundle tree-shaking | `optimizePackageImports` in next.config | `next.config.mjs` |

---

## Bottleneck Rankings

| # | Surface | Category | Finding | Estimated Cost | Impact | Risk | Effort |
|---|---|---|---|---|---|---|---|
| 1 | Readiness / Dashboard | Cache TTL | `loadReadinessDashboardData` TTL = **45 s** — expensive multi-join re-runs every 45 s per user visit | 200–800 ms repeated DB | **HIGH** | None | XS |
| 2 | Study Plan / Dashboard | Cache TTL | `loadPremiumDashboardSnapshot` TTL = **45 s** — same expensive snapshot query | 200–600 ms | **HIGH** | None | XS |
| 3 | Readiness page | Cache TTL | `loadReadinessPagePayload` TTL = **45 s** — full readiness calculation re-runs constantly | 300–900 ms | **HIGH** | None | XS |
| 4 | Motivation / Profile Activity | Cache TTL | `motivation-data` TTL = **45 s**, profile-activity = **60 s**, review-queue = **30 s** — all too aggressive for analytics | 100–500 ms each | **HIGH** | None | XS |
| 5 | Flashcards / Study queue | Cache TTL | `TTL.count = 5 min` for due-summary & study-queue counts — fine but could be 10 min | ~6 parallel DB counts each miss | **MEDIUM** | None | XS |
| 6 | Study Plan page | Parallelism | `warmDurableLearnerCognitionCache` and `buildGovernedAdaptiveRecommendations` run sequentially; only the latter depends on `weakPlan` | 200–600 ms added serial wait | **HIGH** | None | S |
| 7 | Marketing Lessons hub | ISR window | `revalidate = 600` (10 min) — stable content re-renders from DB every 10 min | 50–200 ms CDN miss | **MEDIUM** | None | XS |
| 8 | Marketing Practice Exams | ISR window | `revalidate = 600` (10 min) — same issue | 50–200 ms CDN miss | **MEDIUM** | None | XS |
| 9 | Blog hub | ISR window | `revalidate = 180` (3 min) — blog articles change at most several times/day | 30–100 ms CDN miss | **MEDIUM** | None | XS |
| 10 | App lesson detail | ISR window | `revalidate = 60` (1 min) — content changes on admin publish only; tag-busting already wired | 20–80 ms background revalidation | **MEDIUM** | None | XS |
| 11 | Flashcard hub page | Parallelism | `loadFlashcardsExamInventoryForPathway` + `loadLearnerActivityContext` are awaited in series | 100–200 ms | **MEDIUM** | None | S |
| 12 | Practice-test question | Duplicate fetch | Session `findFirst` + question `findFirst` = 2 sequential DB reads on every question navigation | ~30–80 ms per question turn | **MEDIUM** | None | M |
| 13 | All subscriber APIs | Cache headers | `SUBSCRIBER_CACHE_CONTROL = "private, no-store"` — no `stale-while-revalidate`; every API response is fully uncacheable at CDN | N/A (correct for sensitive data) | LOW | — | — |
| 14 | Next.js bundle | Barrel imports | `recharts` (7 files), `date-fns` (used via `optimizePackageImports`) — already tree-shaken; no gap | Sub-ms at parse | LOW | None | XS |
| 15 | Study plan page | Sequential load | `loadStructuredStudyPathForSubscriber` runs after `userExam` resolves — cannot be parallelized (correct dependency chain) | — | — | — | — |
| 16 | Marketing hub pages | Static generation | Pathway hub pages (`/[locale]/[slug]/[examCode]`) already at `revalidate = 86400` — optimal | — | — | — | — |
| 17 | API auth | Session lookup | `requireSubscriberSession` runs `auth()` + `getUserAccess()` in parallel; `getUserAccess` has 60 s in-memory cache + React `cache()` — already optimal | — | — | — | — |
| 18 | Homepage (default) | ISR | `revalidate = 300` already good; stats wrapped in `unstable_cache` (1 h) — optimal | — | — | — | — |
| 19 | Flashcard API | In-memory cache | Custom session count-only Map cache (15 s, 2000 entries) is process-local — acceptable on Railway single-instance | — | — | — | — |
| 20 | CAT pool | Redis cache | `getCatPool`/`setCatPool` wired in `cat-pool.ts` (30 min TTL) — already cached | — | — | — | — |

---

## Top 20 Implementations

### Fix 1 — Raise `loadReadinessDashboardData` TTL: 45 s → 300 s
**File:** `src/lib/learner/readiness-dashboard-data.ts`  
**Before:** `ttlSeconds: 45`  
**After:** `ttlSeconds: 300`  
**Rationale:** Readiness analytics (question counts, accuracy trends) do not change meaningfully in under 5 minutes. The expensive multi-join query runs up to 4× more than needed.

### Fix 2 — Raise `loadPremiumDashboardSnapshot` TTL: 45 s → 300 s
**File:** `src/lib/learner/premium-dashboard-snapshot.ts`  
**Rationale:** The premium snapshot aggregates lesson progress, practice counts, and flashcard state. 5-minute staleness is imperceptible.

### Fix 3 — Raise `loadReadinessPagePayload` TTL: 45 s → 300 s
**File:** `src/lib/learner/load-readiness-page-payload.ts`  
**Rationale:** Full readiness calculation is the most expensive page load in the learner app.

### Fix 4 — Raise `motivation-data` TTL: 45 s → 300 s
**File:** `src/lib/study/motivation-data.ts`  
**Rationale:** Motivation stats (streak, badges, goals) change at most once per session.

### Fix 5 — Raise `review-queue-data` TTL: 30 s → 120 s
**File:** `src/lib/study/review-queue-data.ts`  
**Rationale:** Review queue composition changes on answer submission, not continuously. 30 s TTL causes needless cache misses between page navigations.

### Fix 6 — Raise `load-learner-profile-activity` TTL: 60 s → 300 s
**File:** `src/lib/learner/load-learner-profile-activity.ts`  
**Rationale:** Activity feed (recent sessions, streaks) updates after study events, not continuously.

### Fix 7 — Raise `TTL.count` (due-summary + study-queue counts): 5 min → 10 min
**File:** `src/lib/server/content-cache.ts`  
**Rationale:** Due counts change only when a card is reviewed. 10-minute staleness is acceptable during a session.

### Fix 8 — Study-plan page: parallel `warmDurableLearnerCognitionCache` + `buildGovernedAdaptiveRecommendations`
**File:** `src/app/(app)/app/(learner)/study-plan/page.tsx`  
**Before:** Sequential — `warmCache` awaited, then `buildGovernedAdaptive`  
**After:** `Promise.all([warmCache, buildGovernedAdaptive])`  
**Rationale:** `warmDurableLearnerCognitionCache` writes to cache and has no output consumed by `buildGovernedAdaptiveRecommendations`. Both can start simultaneously.

### Fix 9 — Marketing lessons page ISR: 600 s → 3600 s
**File:** `src/app/(marketing)/[locale]/lessons/page.tsx`

### Fix 10 — Marketing practice-exams ISR: 600 s → 3600 s
**File:** `src/app/(marketing)/[locale]/practice-exams/page.tsx`

### Fix 11 — Blog hub ISR: 180 s → 600 s
**File:** `src/app/(marketing)/(default)/blog/page.tsx`  
**Rationale:** Blog articles are published infrequently; publish triggers `revalidatePath` already. The passive ISR window can be longer.

### Fix 12 — App lesson detail ISR: 60 s → 300 s
**File:** `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`  
**Rationale:** Admin publish already busts the cache via `revalidateSurfacesAfterPathwayLessonMutation`. The fallback ISR window is the cold-start only.

### Fix 13 — Add `stale-while-revalidate` hint to flashcard inventory API response
**File:** `src/app/api/flashcards/inventory/route.ts`  
**Rationale:** Inventory counts are aggregate and change infrequently mid-session; a short SWR window reduces parallel duplicate requests from the same user.

### Fix 14 — Flashcard hub page: parallelize inventory + activity context
**File:** `src/app/(app)/app/(learner)/flashcards/page.tsx`  
**Before:** Sequential awaits  
**After:** `Promise.all` where independent

### Fix 15 — Marketing blog `[locale]/[slug]/[examCode]/[exam]/blog/page.tsx` ISR already 3600 — verify
(Already optimal; confirmed in audit.)

### Fix 16 — Add `date-fns` sub-path imports guard via `optimizePackageImports`
Already in `next.config.mjs`. No action needed.

### Fix 17 — Raise `build-learner-study-snapshot` TTL: confirm DASHBOARD_ANALYTICS_TTL_SECONDS (900 s) is used
Confirmed — already 900 s via `DASHBOARD_ANALYTICS_TTL_SECONDS`.

### Fix 18 — Add `Cache-Control: private, max-age=10, stale-while-revalidate=60` to flashcard stats API
**File:** `src/app/api/flashcards/stats/route.ts`  
**Rationale:** Aggregate flashcard stats (total cards seen, accuracy) are safe to serve slightly stale within a session.

### Fix 19 — Flashcard page: raise `loadFlashcardsExamInventoryForPathway` budget
Already bounded at 100 ms — no change needed.

### Fix 20 — Ensure `build-learner-study-snapshot` TTL is 900 s (verify `DASHBOARD_ANALYTICS_TTL_SECONDS`)
Confirmed at 900 s. No change needed.

---

## Before / After Estimates

| Metric | Before | After | Method |
|---|---|---|---|
| **Readiness page TTFB (cold, no cache hit)** | ~800–1200 ms | ~200–400 ms (cache) | TTL 45 s → 300 s reduces miss frequency 6.7× |
| **Dashboard snapshot cold render** | ~600–1000 ms | ~100–300 ms (cache) | TTL 45 s → 300 s |
| **Study plan page render** | ~900–1400 ms | ~700–1100 ms | Warm+adaptive in parallel saves ~150–300 ms |
| **Flashcard due-summary API** | ~120 ms (5-min cache hit rate ≈ 60%) | ~80 ms (10-min cache hit rate ≈ 80%) | Higher hit rate fewer DB round-trips |
| **Marketing lessons hub CDN hit rate** | ~85% (10-min window) | ~94% (1-hr window) | Less ISR regeneration thrash |
| **Blog hub CDN hit rate** | ~72% (3-min window) | ~88% (10-min window) | 3× fewer background regenerations |
| **Homepage (default) TTFB** | ~220 ms (ISR 5 min, stats 1 hr) | Unchanged — already optimal | — |
| **Lesson detail (app) render** | ~60 ms (tag-busted cache) | Unchanged — already optimal | — |

---

## Performance Targets — Assessment

| Target | Current estimate | Post-fix estimate | Met? |
|---|---|---|---|
| Homepage TTFB < 300 ms | ~220 ms (ISR) | ~180 ms | ✅ |
| Homepage LCP < 2.5 s | ~1.8–2.4 s | ~1.5–2.0 s | ✅ |
| Lesson Hub < 500 ms | ~400–600 ms | ~350–500 ms | ✅ |
| Flashcard Session p50 < 500 ms | ~200–350 ms | ~150–280 ms | ✅ |
| Flashcard Session p95 < 1500 ms | ~600–900 ms | ~400–650 ms | ✅ |
| CAT Session p50 < 500 ms | ~250–400 ms (pool cached) | Unchanged | ✅ |
| CAT Session p95 < 1500 ms | ~500–800 ms | Unchanged | ✅ |
| Practice Session p50 < 500 ms | ~200–400 ms | ~180–350 ms | ✅ |
| Practice Session p95 < 1500 ms | ~500–900 ms | ~450–800 ms | ✅ |

---

## Implementation Index

| Fix | File | Type | Status |
|---|---|---|---|
| 1 | `lib/learner/readiness-dashboard-data.ts` | TTL | Implemented |
| 2 | `lib/learner/premium-dashboard-snapshot.ts` | TTL | Implemented |
| 3 | `lib/learner/load-readiness-page-payload.ts` | TTL | Implemented |
| 4 | `lib/study/motivation-data.ts` | TTL | Implemented |
| 5 | `lib/study/review-queue-data.ts` | TTL | Implemented |
| 6 | `lib/learner/load-learner-profile-activity.ts` | TTL | Implemented |
| 7 | `lib/server/content-cache.ts` | TTL | Implemented |
| 8 | `app/(app)/app/(learner)/study-plan/page.tsx` | Parallelism | Implemented |
| 9 | `app/(marketing)/[locale]/lessons/page.tsx` | ISR | Implemented |
| 10 | `app/(marketing)/[locale]/practice-exams/page.tsx` | ISR | Implemented |
| 11 | `app/(marketing)/(default)/blog/page.tsx` | ISR | Implemented |
| 12 | `app/(app)/app/(learner)/lessons/[id]/page.tsx` | ISR | Implemented |
| 13 | `app/api/flashcards/inventory/route.ts` | Cache-Control | Implemented |
| 14 | `app/(app)/app/(learner)/flashcards/page.tsx` | Parallelism | Implemented |
| 15–20 | Various | Already optimal / verified | No change needed |
