# Platform contract stabilization audit

Inventory of **contract drift**, **cache vs fresh** risk, and **failure-to-empty** patterns across `nursenest-core/`.
Last sweep: repo-wide grep + targeted file reads. **Critical** = learner paywalled flows, marketing lesson integrity, CAT/flashcards launchers.

## Already hardened (reference)

| Area | Mitigation |
|------|------------|
| Marketing lessons hub verify | `getPathwayLessonForMarketingHubVerify` → uncached `getPathwayLessonImpl`; parity with `pathwayLessonEligibleForPublicMarketingSurface` / detail route; `HubVerifyPreparedPositiveZeroKeptError` when prepared>0 && kept===0; structured `prepared_count` / `verify_kept_count` logs; **page boundary** catches invariant → `MarketingLessonsHubRetryableErrorShell` + `marketing_hub_verify_invariant_error_surface` (no fake empty grid) |
| CAT adaptive pick path | `cat_adaptive_pick_missing_session_pick_salt` when non-simulation adaptive step runs without usable `sessionPickSalt` on merged config (diagnostic; does not change pick logic) |
| Flashcards weak-area CTAs | `study-product-route-contract.ts` + tests assert weak-area URLs stay under `/app/flashcards` |
| Marketing hub aggregates | No `runHubOptionalTask`; `Promise.allSettled` + per-task rejection flags in `marketing-hub-optional-data.ts` |
| Flashcards hub KPIs | `reduceFlashcardsHubKpiSettled` + explicit fatal/partial/none; pathway bootstrap error UI on learner flashcards page |

## A. `unstable_cache` (lesson-related)

| File | Use | Risk |
|------|-----|------|
| `pathway-lesson-loader.ts` | Hub pages, topic pages, `getPathwayLessonWithDataCache` → **detail** cache | Hub verify **must not** use this for row integrity (uses `getPathwayLessonForMarketingHubVerify`) |
| `pathway-lesson-loader.ts` | SEO meta, related lessons, topic clusters | Lower; list/detail contract tests should assert tags on publish |
| Other modules | Various | Audit when paired with **fresh** list for same entity |

## B. `Promise.race` / timeouts

| File | Notes |
|------|-------|
| `lib/server/with-timeout.ts`, `lib/db/safe-database.ts`, `lib/prisma/safe-reads.ts`, `lib/durability/with-core-read-timeout.ts` | Infra timeouts — ensure callers map timeout → **error**, not empty domain payloads |
| `lib/marketing/public-home-stats.ts`, `load-paywall-home-stats-for-shell.ts`, `home-restored-with-deferred-stats.server.tsx` | Marketing **deferred** stats — intentional bounded wait; document as non-critical |
| `lib/blog/home-blog-teaser.ts` | Home teaser — best-effort |
| `lib/runtime/fetch-with-retry.ts` | Generic fetch helper |

## C. `catch(() => [] | null | {})` and similar (high-signal hits)

### Learner / dashboard (treat as **contract-sensitive**)

| File | Pattern | Risk |
|------|---------|------|
| `app/api/learner/command-center/route.ts` | Was: `.catch(() => null)` / `[]` on parallel loads | **Fixed**: `Promise.allSettled` + `segment_load_failed` / `payload_partial_due_to_segment_failures` logs; review uses `{ loadState: \"error\" }` instead of fake zero counts; client banner when `segmentLoadFailures` present |
| `lib/learner/load-progress-page-payload.ts` | `findMany(...).catch(() => [])`, aggregates `.catch(() => 0)` | Progress page may hide DB failures — **backlog**: surface `practiceHistoryLoadFailed` |
| `lib/study/guided-study-data.ts` | `loadAnalyticsSummary.catch(null)`, `findMany.catch([])` | Guided study may look “empty” on failure — **backlog** |
| `lib/learner/premium-dashboard-snapshot.ts` | `.catch(() => null)` | **backlog** |
| `app/(student)/app/(learner)/lessons/[id]/page.tsx` | `buildLearnerStudySnapshot(...).catch(() => null)` | **backlog** |
| `app/(student)/app/(learner)/strategy/*.tsx` | `loadStrategyCounts().catch(() => ({}))` | **backlog** |
| `app/(student)/app/(learner)/exam-plan/page.tsx` | `loadExamPlanTrendAction().catch(() => [])` | **backlog** |

### Admin / API JSON parse

| File | Pattern | Notes |
|------|---------|-------|
| Many `admin/**/route.ts` | `req.json().catch(() => ({}))` then zod | Empty body → schema fail; **backlog**: normalize blank optional fields + field paths in `ZodError` mapper |
| `components/admin/ai/*.tsx` | `res.json().catch(() => ({}))` | Client should treat non-OK + empty parse as error — **backlog** |

### Layout / staff

| `layout.tsx`, `admin/page.tsx` | `getStaffSession().catch(() => null)` | Intentional non-blocking staff chrome |

### Tests / tooling

| `tests/e2e/**` | `.catch(() => null)` | Acceptable for diagnostics |

## D. `REVIEW_REQUIRED` / professional hub / `publicComplete`

- **Marketing hub verify** explicitly does **not** re-apply professional corpus / `REVIEW_REQUIRED` hub-only gates (`pathway-lesson-hub-link-integrity.ts`).
- **Subscriber app** resolve (`app-subscriber-lesson-detail-resolve.ts`) may still use taxonomy suppression — **different surface**; do not mix into marketing verify.

## E. `runHubOptionalTask` / `optionalTask`

- Removed from marketing hub optional data; regression: `marketing-hub-no-timeout-race.test.ts`.

## F. Intentional best-effort (keep, document)

| Location | Justification |
|----------|----------------|
| Marketing home / paywall stats `Promise.race` | Proof numbers optional; degraded banner exists |
| `safe-server-log` fire-and-forget `.catch` | Telemetry must not throw |
| Staff session optional in marketing layout | Chrome only |
| E2E helpers | Test resilience |

## G. Recommended next passes (priority)

1. `load-progress-page-payload.ts` — replace silent `[]`/`0` with typed partial failure + UI.
2. `guided-study-data.ts` — same for weak-topic list + analytics summary.
3. Admin blog/bulk bodies — `normalize + safeParse` pipeline + user-facing field errors.
4. CAT session create/advance — audit seed entropy + completion guards (dedicated task).
5. Flashcards launcher routes — assert destination href prefix in tests (`/app/flashcards`).

## H. Canonical contracts (types)

- Shared: `CriticalLoadResult<T>` / `LoadResult` alias in `src/lib/loading/critical-load-outcome.ts`.
- Command center: `CommandCenterReviewPayload` discriminated union in `src/lib/learner/command-center-api-types.ts` (this pass).
