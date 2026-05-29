# Flashcard Hub Performance Report

Date: 2026-05-29

## Executive Summary

The Flashcard Hub startup path was still blocking first render on live inventory work. The page route called the exam-bank flashcard inventory loader before returning HTML, which can execute `COUNT(*)`, `GROUP BY body_system, topic`, dedicated flashcard counts, entitlement coalescing, and lesson pathway visibility checks. In slow production conditions that can wedge the learner on the route before Suspense or client fallbacks can render.

The fix changes `/app/flashcards` to render the hub shell from lightweight pathway metadata only. Live counts, adaptive analytics, weak-area analysis, readiness strip data, and performance insights now load after the shell is visible.

## Loading Path Audit

| Area | Finding | Status |
| --- | --- | --- |
| Flashcard Hub page route | `src/app/(app)/app/(learner)/flashcards/page.tsx` called `loadFlashcardsExamInventoryForPathway()` before render. | Fixed |
| Server components | Suspense fallback could not help because expensive work happened before returning the component tree. | Fixed |
| Client components | Initial inventory fetch remains client-side and timed; adaptive insights are delayed until after first paint. | Fixed |
| Database queries | Blocking startup included `COUNT(*)`, `GROUP BY`, and `flashcard.count()` via the inventory loader. | Removed from initial render |
| API endpoints | `/api/flashcards/inventory` remains the count source but is deferred and now emits `Server-Timing` plus payload bytes. | Instrumented |
| Adaptive calculations | Weak-area and readiness requests are not server-blocking; readiness and analytics network calls are delayed. | Fixed |
| Progress calculations | SRS queue/stats calls are not started until deferred insights are enabled. | Fixed |
| Recommendations engine | No recommendation generation is invoked by the page route. | Verified |
| Flashcard category counts | Initial route uses `builderCategoryOptionsForPathway()` metadata with zero counts, then refreshes counts via API. | Fixed |
| Pharmacology / Clinical Skills / ECG integration | No large pharmacology, clinical skills, ECG, or lesson catalog import is used in the page route. | Verified |
| Bundle / React render loops | No `useEffect` dependency loop found in the hub refresh effect; refresh is driven by scoped pathway/filter state. | Verified |

## Root Cause

The route attempted to improve first paint by racing live inventory work against a 700 ms timeout, but the inventory promise still started on every server request. The live loader can run:

- entitlement tier/country coalescing
- exam question `COUNT(*)`
- exam question `GROUP BY body_system, topic`
- dedicated flashcard count
- category folding
- lesson visibility resolution

That made the hub vulnerable to slow scans, cold database connections, and background query pressure even when the timeout returned.

## Changes Made

### Page Route

File: `src/app/(app)/app/(learner)/flashcards/page.tsx`

- Removed blocking server call to `loadFlashcardsExamInventoryForPathway()`.
- Removed blocking `visiblePathwayIdsForAppLessons()` lookup from the hub startup path.
- Kept initial payload to static category metadata from `builderCategoryOptionsForPathway()`.
- Parallelized marketing bundle and search param resolution.
- Parallelized compatible pathway and learner-path lookup.
- Added `console.time` / `console.timeEnd` for `flashcards_hub_server_bootstrap`.
- Added `safeServerLog("server_shell_ready")` with `blocking_inventory=0` and `blocking_adaptive=0`.

### Client Hub

File: `src/components/flashcards/flashcards-hub-client.tsx`

- Kept inventory count refresh in the client after render.
- Reduced inventory refresh timeout from 25 seconds to 5 seconds.
- Added response timing diagnostics for `/api/flashcards/inventory` and `/api/flashcards/custom-session`.
- Deferred readiness/analytics network work for 1.5 seconds after route mount.

### Readiness Strip

File: `src/components/flashcards/flashcards-hub-readiness-strip.tsx`

- Added an `enabled` prop so the strip can render its default shell without immediately calling SRS stats endpoints.

### Inventory API

File: `src/app/api/flashcards/inventory/route.ts`

- Added `Server-Timing` headers.
- Added `x-nn-payload-bytes`.
- Timed auth gate, memory cache, manifest load, and live inventory fallback.
- Preserved Redis/snapshot/live manifest behavior.

### Performance Test

File: `tests/e2e/performance/flashcards-hub-instant-startup.spec.ts`

- Adds an authenticated Playwright guard for `/app/flashcards`.
- Asserts first content appears within 2 seconds.
- Asserts weak-area, SRS stats, due summary, and study queue endpoints do not start before first content.

## Endpoint Timing Evidence

The inventory endpoint now reports:

- `Server-Timing: total;dur=..., auth_gate;dur=..., memory_cache;dur=..., manifest;dur=...`
- `x-nn-inventory-cache: hit|miss`
- `x-nn-inventory-manifest: redis|snapshot|live` when applicable
- `x-nn-payload-bytes: ...`

Any `/api/flashcards/inventory` response over 500 ms can now be traced to memory cache, manifest, or live inventory fallback from browser DevTools or Playwright network collection.

## Expected Before / After

Before:

- Page render could start live inventory aggregation.
- Slowest query: `exam_questions` `COUNT(*)` / `GROUP BY body_system, topic`.
- Slowest component path: server route bootstrap before `FlashcardsHubClient` rendered.
- Adaptive/progress calls could start immediately on client mount.

After:

- Page render only needs auth, entitlement, pathway resolution, and static category metadata.
- Live counts load after the learner sees the hub.
- Adaptive/progress/readiness endpoints are delayed until after the shell is visible.
- Inventory API exposes cache source, payload size, and timing.

## Remaining Production Validation

The code path is now structured to meet:

- Warm load target: under 1 second when auth/entitlement/pathway context is cached.
- Cold load target: under 2 seconds when auth and pathway lookup are healthy.

Final proof requires a paid QA account and a real production/staging database. Run:

```bash
npx playwright test tests/e2e/performance/flashcards-hub-instant-startup.spec.ts --project=chromium
```

and the broader route budget suite:

```bash
npm run test:e2e:performance-budgets
```

## Non-Startup Work Still Present

These remain intentionally outside the first render path:

- `/api/flashcards/inventory` live fallback can still run aggregate count queries if Redis/snapshot are missing.
- `/api/flashcards/study-queue`, `/api/flashcards/stats`, `/api/flashcards/due-summary`, and `/api/learner/weak-areas` still compute learner-specific insights, but only after the hub shell has rendered.
- Progress-filtered hub refreshes still call `/api/flashcards/custom-session?includeCards=0` because those filters require learner-specific state.

## Acceptance Mapping

| Requirement | Result |
| --- | --- |
| Initial page load uses lightweight metadata only | Implemented |
| Do not load actual flashcards on hub render | Verified |
| Do not block on recommendations/adaptive/readiness | Implemented |
| Replace expensive counts on page load with cached/deferred values | Implemented |
| No category-loop N+1 on page render | Verified |
| No large catalog imports during initial route render | Verified |
| API response timing and payload measurement | Implemented |
| Playwright performance test added | Implemented |
| Cold/warm target proof | Requires authenticated staging/production run |
