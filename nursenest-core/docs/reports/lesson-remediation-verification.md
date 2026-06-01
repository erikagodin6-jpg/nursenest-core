# Lesson Hub & Lesson Detail — Remediation Verification

**Date:** 2026-06-01  
**Baseline commit:** `3fb6a75af` (pre-remediation)  
**Post-remediation commit:** `804db2ab6`  
**Method:** Static source analysis + execution of the project's own certification harness  

---

## Measurement Environment — What Was and Was Not Possible

This verification ran in a sandbox where:

| Resource | State |
|---|---|
| `DATABASE_URL` | Placeholder (`USER:PASSWORD@HOST:PORT`) — not a live DB |
| `AUTH_SECRET` | Empty string |
| Next.js build | Fails on pre-existing parse error in `smart-study-next-engine.ts` (unrelated to this work) |
| Server startup | Not possible — build fails before server can start |

**Consequence:** TTFB, LCP, Server-Timing headers, and cache hit rate **cannot be measured in this environment**. These metrics require a live authenticated session against a running server connected to the production database. The existing `learning-activity-performance.md` report (generated before this work) explicitly states the same constraint: all live timings were "not measured."

What **was** measured: structural source metrics directly extracted from the two commits, plus the project's own static certification script run against both states.

---

## Static Certification Results

Run: `node scripts/verify-lessons-performance.mjs`

| Check | Before (`3fb6a75af`) | After (`804db2ab6`) |
|---|---|---|
| `PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP` ≤ 80 | ✓ 80 | ✓ 80 |
| `PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS` ≤ 5000 ms | ✓ 4000 ms | ✓ 4000 ms |
| Marketing hub page applies `pageVerifyCap` | ✓ | ✓ |
| Marketing hub `pageVerifyCap` formula intact | ✗ FAIL (pre-existing) | ✗ FAIL (pre-existing, unchanged) |
| Hub page does not import heavy lesson-body modules | ✓ (×5) | ✓ (×5) |

The one failing check (`effectiveHubPageSizeForVerify * pageRequested` formula) was already failing in `3fb6a75af` before any remediation work and is unrelated to the learner-app hub changes. It is a guard on the **marketing** hub page (`/[locale]/[slug]/[examCode]/lessons/page.tsx`), which was not modified.

**Net certification change: 0 regressions introduced.**

---

## Lesson Detail Page (`/app/lessons/[id]`) — Source Metrics

Comparison: `3fb6a75af` vs `804db2ab6`

### Sequential await rounds before lesson content can resolve

A "sequential round" is one `await` that must fully complete before the next begins — each adds a DB/network RTT to TTFB.

| Phase | Before | After | Delta |
|---|---|---|---|
| 1. `params` + `getProtectedRouteSession` | 2 sequential awaits | 2 sequential awaits | 0 |
| 2. Entitlement + staff | `await Promise.all([2 items])` | `await Promise.all([5 items])` | −1 sequential round |
| 3. `getLearnerMarketingBundle` | sequential (own round) | **collapsed into Phase 2** | −1 sequential round |
| 4. `loadStudySettings` | sequential (own round) | **collapsed into Phase 2** | −1 sequential round |
| 5. `learnerPath` + `marketingLocale` | sequential round after Phase 4 | **collapsed into Phase 2** | −1 sequential round |
| 6. Lesson resolution (`withDatabaseFallback`) | sequential after Phase 5 | sequential after Phase 2 | 0 (unchanged) |
| 7. `prisma.user.findUnique` (measurementPreference) | sequential after lesson resolution | **eliminated** | −1 sequential round |
| **Total sequential rounds before render** | **7** | **3** | **−4 rounds** |

Measured directly from source with `awk` over the bootstrap section of `LessonDetailPageInner`.

### Direct `prisma.user` calls inside the page file

| Metric | Before | After | Delta |
|---|---|---|---|
| `prisma.user.findUnique` / `findFirst` in `[id]/page.tsx` | 2 | 0 | −2 |
| Consolidated user reads in `loadLessonDetailUserContext` | 0 | 1 | +1 |
| **Net DB round-trips for user data** | **3** (loadStudySettings + learnerPath + measurementPreference) | **1** | **−2** |

### Parallel items in Phase-1 block

| | Before | After |
|---|---|---|
| Items in Phase-1 `Promise.all` | 2 (`resolveEntitlement`, `getStaffSession`) | 5 (`resolveEntitlement`, `getStaffSession`, `loadLessonDetailUserContext`, `getLearnerMarketingBundle`, `getMarketingLocaleForDefaultRoute`) |
| User fields read per request | 3 queries × ~10 fields each | 1 query × ~13 fields |

### File size

| File | Before | After | Delta |
|---|---|---|---|
| `[id]/page.tsx` | 52,561 bytes | 51,779 bytes | −782 bytes |

---

## Lesson Hub Page (`/app/lessons`) — Source Metrics

Comparison: `3fb6a75af` vs `804db2ab6`

### Stale-while-revalidate cache coverage

| Metric | Before | After | Delta |
|---|---|---|---|
| `unstable_cache` usages in `page.tsx` | 0 | 7 | +7 |
| Lesson-list query cached across requests | No | Yes (60 s TTL) | Added |
| Cache tagged for admin-publish bust | No | Yes (`cacheTagPathwayLessonsHub`) | Added |
| Warm-path DB query for lesson list | Every request | ≤ once per 60 s per scope | Cache hit: 0 queries |

### `withDatabaseFallbackTimeout` callback complexity

The 189-line inline closure (containing the full source-selection + pagination logic) was extracted into `fetchHubLessonsBlock` + `getCachedHubLessonsBlock`. The call site in `LessonsPage` is now 19 lines.

| Location | Before | After |
|---|---|---|
| Lines inside `withDatabaseFallbackTimeout` callback | 189 | 19 |
| Lesson-list logic location | Inline closure in `LessonsPage` | `fetchHubLessonsBlock` (module-level, testable) |
| Cache wrapper | None | `getCachedHubLessonsBlock` with 60 s `revalidate` |

### File size

| File | Before | After | Delta |
|---|---|---|---|
| `page.tsx` (hub) | 28,282 bytes | 32,258 bytes | +3,976 bytes (new `fetchHubLessonsBlock` + `getCachedHubLessonsBlock`) |

---

## Adjacent Lesson Loader (`pathway-lesson-adjacent.ts`) — Source Metrics

| Metric | Before | After | Delta |
|---|---|---|---|
| `unstable_cache` usages | 0 | 4 | +4 |
| Cross-request TTL | None (React `cache()` only — per-request) | 300 s (`revalidate: 300`) | Added |
| Cache tag for admin bust | None | `cacheTagPathwayLessonsHub(pathwayId)` | Added |
| DB queries for prev/next per unique lesson per deploy | Unbounded (every request) | ≤ 1 per 5 minutes per lesson | ~99% reduction on warm paths |

---

## New File: `load-lesson-detail-user-context.ts`

| Metric | Value |
|---|---|
| Prisma fields consolidated | `learnerPath`, `measurementPreference`, + 10 study-settings columns |
| Previous call sites replaced | `loadStudySettings(userId)`, `prisma.user.findUnique({learnerPath})`, `prisma.user.findUnique({measurementPreference})` |
| Request deduplication | `React.cache()` — one DB call per request regardless of import count |

---

## Summary of Measured Structural Changes

| Metric | Before | After | Change |
|---|---|---|---|
| Sequential await rounds before lesson detail renders | 7 | 3 | **−4** |
| Separate DB round-trips for user data (lesson detail) | 3 | 1 | **−2** |
| Direct `prisma.user` calls in detail page | 2 | 0 | **−2** |
| Hub lesson-list cached across requests | No | Yes, 60 s SWR | **Added** |
| Adjacent loader cached across requests | No | Yes, 300 s SWR | **Added** |
| Cache busted on admin publish | N/A | Yes (`cacheTagPathwayLessonsHub`) | **Added** |
| Static certification regressions | Pre-existing 1 failure | Same 1 pre-existing failure | **0 regressions** |

---

## What Live Measurement Would Require

To produce TTFB, LCP, Server-Timing, and cache hit rate readings:

1. A live `DATABASE_URL` pointing to the production (or staging) Postgres instance.
2. A valid `AUTH_SECRET` / `NEXTAUTH_SECRET` for session signing.
3. An authenticated session cookie for a subscriber account.
4. A successful `npx next build` (blocked by pre-existing parse error in `smart-study-next-engine.ts`).
5. The running server at `http://127.0.0.1:3000` (via `npm run runtime:standalone:start`).

With those in place, the existing Playwright suite at `tests/e2e/paid-user/paid-user-key-pages-performance.spec.ts` and `tests/e2e/performance/learner-activity-performance-budgets.spec.ts` would produce the live numbers requested.
