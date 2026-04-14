# Lesson pagination / search / virtualization — verification

**Result:** **PASS** (code review + bounded math checks; no authenticated live `/api/lessons` matrix in this run).

**Fixes applied in this verification pass:** None.

## 1. GET `/api/lessons`

| Check | Status |
|-------|--------|
| `limit` / `pageSize` bounded 1–50 (default 20) | Pass (`parseBoundedPageSize`, `LESSON_API_OFFSET_LIMIT`) |
| `page` invalid → 400 `invalid_page` | Pass (`parseListPage`) |
| `page` too large for offset cap → 400 `page_out_of_range` | Pass — e.g. `page=999&limit=20` exceeds `maxSafeOffsetPage(20)` (~201) |
| Subscriber offset response includes `total`, `pageCount`, `lessons`, and `totalCount` / `currentPage` / `totalPages` alignment | Pass |
| Cursor mode: `totalCount` / `currentPage` / `totalPages` null; `pagination.nextCursor` set | Pass |
| Non-subscriber + cursor → 400 `cursor_requires_subscriber` | Pass |
| Unauthenticated → 401 | Pass |

**Files:** `src/app/api/lessons/route.ts`, `src/lib/api/api-pagination-limits.ts`, `src/lib/api/lessons-list-cursor.ts`

**Consumers:** e.g. `freemium-lesson-peek.tsx` uses `pageSize=`; app lesson **library** list is **server-rendered** in `app/(learner)/lessons/page.tsx` (Prisma), not this API.

## 2. `/app/lessons` (subscriber)

| Check | Status |
|-------|--------|
| `page=` / `limit=` | Pass — `parseLessonLibraryLimit`, clamp + redirect |
| `q=` applied in `where` before `skip`/`take` | Pass |
| Filters preserved in pagination links | Pass — `PathwayLessonPagination` + `hubQuery` |
| Out-of-range page → redirect to canonical | Pass — `rawPage !== lessonsBlock.page` → `redirect` |
| “Showing a–b of n” | Pass — `(page-1)*pageSize+1` … `min(page*pageSize,total)` |
| Previous / Next / page numbers | Pass |
| Ellipsis when `pageCount > 10` | Pass — `visiblePageNumbers` |

**Files:** `src/app/(student)/app/(learner)/lessons/page.tsx`, `src/components/pathway-lessons/pathway-lesson-pagination.tsx`

## 3. Search UX

| Check | Status |
|-------|--------|
| Debounce ~300ms | Pass — `setTimeout(..., 300)` |
| New search sets `page=1` | Pass |
| Other query params preserved | Pass — `URLSearchParams(searchParams.toString())` |
| `useSearchParams` inside `Suspense` | Pass — toolbar wrapped in `<Suspense>` on page |

**File:** `src/components/student/learner-lessons-search-toolbar.tsx`

## 4. Virtualization

| Check | Status |
|-------|--------|
| `@tanstack/react-virtual` — visible rows only | Pass |
| Scroll container `overflow-auto` + `max-h` | Pass |
| `measureElement` on rows | Pass |

**File:** `src/components/student/learner-lessons-virtual-list.tsx`  
Browser-level DOM-count test not run here.

## 5. Errors

**File:** `src/app/(student)/app/(learner)/lessons/error.tsx` — “Try again” (`reset`), “Back to app” (`/app`).

## 6. Safety

No schema/auth/route changes as part of this verification artifact.

---

## Part 2 — External old-site audit

**Not executed.** Required paths `/Volumes/Backup Plus/11` and `/Volumes/Backup Plus/NurseNest` are **not present** on this Linux host (`/Volumes` does not exist). No substitute audit using in-repo legacy only.

**Next step for you:** Provide access to the real old-site tree (mount volume, or copy into workspace) and re-run the audit instructions with that path.
