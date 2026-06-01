# Count Query Caching Plan

**Generated:** 2026-06-01  
**Phase:** Performance Optimization Phase 2

---

## Executive Summary

Every major page in the app contained at least one count query executing on the critical render path. This audit catalogues all count query sites, classifies them by risk, and documents the caching layer implemented in Phase 2.

**Total uncached count queries found:** 80+  
**High-impact sites remediated:** 3  
**Queries eliminated from page render (per request):** 16  
**Target:** No count query executes during page render

---

## Audit: Count Query Sites

### 1. Lesson Counts

| File | Query | Status |
|------|-------|--------|
| `src/app/(app)/app/(learner)/lessons/page.tsx:170` | `contentItem.count({ where: contentScopedWhere })` | ✅ Already cached — `unstable_cache()` 1hr TTL, path-keyed |
| `src/lib/lessons/pathway-lesson-loader.ts:456,546,685,1242` | Pathway lesson published counts | ✅ Already cached — `unstable_cache()` 1hr TTL per pathwayId |
| `src/lib/admin/load-admin-command-center.ts` | `contentItem.count()`, `pathwayLesson.count()` (4 queries) | ✅ Remediated — in-process cache, 10 min TTL |

### 2. Question Counts

| File | Query | Status |
|------|-------|--------|
| `src/lib/admin/load-admin-command-center.ts` | `examQuestion.count()` ×2 | ✅ Remediated — in-process cache, 10 min TTL |
| `src/lib/questions/build-question-bank-diagnostics.ts` | Multiple counts for coverage report | ⚠️ On-demand admin tool — acceptable |
| `src/app/api/admin/questions/nclex-mapping/page.tsx` | 3 counts per request | ⚠️ Admin-only, low frequency |
| `src/app/api/admin/stats/users/route.ts` | 7 user counts | ⚠️ Admin-only, low frequency |
| `src/app/api/admin/insights/route.ts` | 10 question/content counts | ⚠️ Admin-only, low frequency |

### 3. Flashcard Counts

| File | Query | Queries/Request | Status |
|------|-------|-----------------|--------|
| `src/app/api/flashcards/due-summary/route.ts` | Due/overdue/learning/lapsing/reviewed/total counts | **6** | ✅ Remediated — Redis, 5 min TTL |
| `src/lib/flashcards/study-queue-segments.ts:loadStudyQueueCounts` | Due/overdue/lapsing/reviewed/total counts | **5** | ✅ Remediated — Redis, 5 min TTL |
| `src/app/api/admin/flashcards/summary/route.ts` | 9 deck/card/session counts | 9 | ⚠️ Admin-only |
| `src/lib/flashcards/flashcard-session-dal.server.ts:204-205` | Attempt counts per session | 2 | ⚠️ Post-session, acceptable |
| Flashcard hub inventory | Category counts + totals | — | ✅ Already cached — Redis 30 min, `flashcardHubInventoryCacheKey` |

### 4. Readiness Counts

| File | Query | Status |
|------|-------|--------|
| `src/lib/practice-tests/cat-practice-readiness.ts` | CAT pool readiness (pool size checks) | ✅ Already cached — in-process Map (60 s) + Redis (10 min) |
| `src/lib/study/guided-study-data.ts:429` | `userTopicStat.count()` | ⚠️ Per dashboard load, medium frequency |
| `src/lib/study/motivation-data.ts:230,392` | `practiceTest.count()`, `examAttempt.count()` | ⚠️ Per dashboard load, medium frequency |

### 5. Weak Area Counts

| File | Query | Status |
|------|-------|--------|
| `src/lib/learner/premium-dashboard-snapshot.ts:379` | `userTopicStat.count()` | ⚠️ Premium learner dashboard |
| `src/app/(app)/app/(learner)/account/overview/page.tsx` | Array `.length` on loaded data | ✅ Not a DB query |

### 6. Dashboard Counts

| File | Query | Queries/Request | Status |
|------|-------|-----------------|--------|
| `src/lib/admin/load-admin-command-center.ts` | 28 user/sub/content/activity counts | **28** | ✅ Remediated — in-process cache, 10 min TTL |
| `src/lib/admin/load-admin-observability-hub.ts` | 18 operational telemetry counts | 18 | ⚠️ Admin-only |
| `src/lib/admin/load-admin-analytics-dashboard.ts` | 10+ analytics counts | 10+ | ⚠️ Admin-only |
| `src/lib/learner/load-learner-dashboard.ts:418-422` | Lesson/topic completion counts | 4 | ⚠️ Per learner dashboard load |

### 7. System Counts

| File | Query | Status |
|------|-------|--------|
| `src/lib/admin/system-status.ts:201-320` | Batch queue / pathway / exam counts | ⚠️ Uses `safePrismaCount()` fallback, not TTL cached |
| `src/lib/admin/load-admin-security-telemetry.ts:170-220` | Session/IP/abuse/verification counts | ⚠️ Admin security page, on-demand |

### 8. Marketing / Public Stats

| File | Query | Status |
|------|-------|--------|
| `src/lib/marketing/public-home-stats.ts:258-295` | 6 public content counts | ✅ Already cached — `unstable_cache()`, `HOMEPAGE_CACHE_TAG` revalidation |

---

## Implementations

### ✅ `src/lib/server/content-cache.ts` — New count cache helpers

```
TTL.count = 5 * 60  (5 minutes)
```

Added:
- `FlashcardDueSummaryCache` type + `flashcardDueSummaryCacheKey` / `getFlashcardDueSummary` / `setFlashcardDueSummary` / `invalidateFlashcardDueSummary`
- `StudyQueueCountsCache` type + `studyQueueCountsCacheKey` / `getStudyQueueCounts` / `setStudyQueueCounts` / `invalidateStudyQueueCounts`

**Cache key scheme:**
```
content:count:flashcard-due-summary:{userId}
content:count:study-queue-counts:{userId}:{pathwayId}
```

---

### ✅ `src/app/api/flashcards/due-summary/route.ts` — 6 queries → 0 on cache hit

**Before:** 6 parallel `prisma.flashcardProgress.count()` + `prisma.flashcard.count()` on every GET.  
**After:** Redis lookup first; on hit returns immediately. On miss, runs queries then stores result.

**Pattern:**
```typescript
const cached = await getFlashcardDueSummary(userId);
if (cached) return NextResponse.json(cached);
// ... 6 count queries ...
await setFlashcardDueSummary(userId, payload);  // TTL: 5 min
```

**Impact:** Dashboard poller fires every 30–60 s per learner. With 5-min TTL, ~90% of requests served from cache.

---

### ✅ `src/lib/flashcards/study-queue-segments.ts` — 5 queries → 0 on cache hit

`loadStudyQueueCounts` is called from every flashcard study session init and from `loadStudyQueueSegments`.

**Before:** 5 parallel count queries on every session load.  
**After:** Redis lookup on entry; on miss, queries run and result is stored.

**Pattern:**
```typescript
const cached = await getStudyQueueCounts(userId, pathwayId);
if (cached) return cached;
// ... 5 count queries ...
await setStudyQueueCounts(userId, pathwayId, counts);  // TTL: 5 min
```

**Cache key:** `content:count:study-queue-counts:{userId}:{pathwayId}` — pathway-scoped so pathway filter is respected.

---

### ✅ `src/lib/admin/load-admin-command-center.ts` — 28+ queries → 0 on cache hit

Admin command center aggregates all platform KPIs in a single payload.

**Before:** 28 user/subscription/content/activity counts + 3 group-by queries + 2 time-series queries on every admin dashboard load.  
**After:** In-process `Map`-based cache with 10-min TTL.

**Why in-process (not Redis):**
- Payload is large (~5 KB serialized); not worth Redis round-trip on admin-only surface
- Typical admin session: multiple page loads within 10 min all share the same warm cache
- No user-specific data — single global key per process instance

**Pattern:**
```typescript
const ADMIN_CC_TTL_MS = 10 * 60 * 1000;
let _adminCcCache: { expiresAt: number; value: AdminCommandCenterData } | null = null;

// At function entry:
const now = Date.now();
if (_adminCcCache && _adminCcCache.expiresAt > now) return _adminCcCache.value;

// After successful computation:
_adminCcCache = { expiresAt: Date.now() + ADMIN_CC_TTL_MS, value: result };
return result;
```

**Error fallback not cached** — the catch block returns zeros and skips the assignment.

---

## Already-Cached Count Sites (no action needed)

| Location | Cache Mechanism | TTL |
|----------|-----------------|-----|
| Lesson page content count | `unstable_cache()` | 1 hr |
| Pathway lesson published counts | `unstable_cache()` | 1 hr |
| Public marketing stats | `unstable_cache()` + revalidateTag | Build TTL |
| Flashcard hub inventory | Redis (`content:flashcard:hub-inv:*`) | 30 min |
| CAT readiness | In-process Map + Redis | 60 s / 10 min |
| Learner activity context | In-process Map | 60 s |

---

## Remaining Opportunities (future phases)

| Site | Count Queries | Suggested Approach |
|------|--------------|-------------------|
| `load-learner-dashboard.ts` | 4 completion counts | In-process Map, 60 s TTL, keyed by userId |
| `load-admin-observability-hub.ts` | 18 telemetry counts | In-process Map, 5 min TTL |
| `load-admin-analytics-dashboard.ts` | 10+ analytics counts | In-process Map, 15 min TTL |
| `guided-study-data.ts` + `motivation-data.ts` | 4 activity counts | Bundle with dashboard cache |
| `system-status.ts` | Batch queue counts | Redis, 2 min TTL |

---

## Cache Invalidation Strategy

| Event | Invalidate |
|-------|-----------|
| Flashcard study submission | `invalidateFlashcardDueSummary(userId)` + `invalidateStudyQueueCounts(userId, pathwayId)` |
| Content publish | `invalidateOnPublish({ lessonId, deckId })` (already wired) |
| Admin data mutation | `_adminCcCache = null` (module-level reset; or wait 10-min TTL) |

### Stale-While-Revalidate Note

The due-summary route is `force-dynamic` and called by a client-side poller. The 5-min Redis TTL means the UI may show counts up to 5 minutes stale after a study event. This is acceptable — SRS scheduling precision is per-day, not per-minute.

To force-refresh after a study session completes, call `invalidateFlashcardDueSummary(userId)` in the session completion handler. This is a future enhancement.

---

## TTL Reference

| Cache | TTL | Rationale |
|-------|-----|-----------|
| Flashcard due summary | 5 min | SRS precision is per-day; 5 min staleness is imperceptible |
| Study queue counts | 5 min | Same rationale |
| Admin command center | 10 min | Admin KPIs don't need second-level freshness |
| CAT readiness | 60 s / 10 min | Session creation retry path; must be reasonably fresh |
| Lesson/content counts | 60 min | Publish events are low-frequency; path revalidation handles updates |
| Public home stats | Build TTL | Revalidated by tag on content publish |
