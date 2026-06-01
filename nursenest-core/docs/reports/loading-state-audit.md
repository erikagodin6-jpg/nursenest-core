# Loading State Audit

Generated: 2026-06-01

## Scope

Searched the codebase for:

- `loading.tsx`
- `Suspense`
- `fallback`
- `isLoading`
- `isPending`
- `isFetching`
- `useEffect`
- `useTransition`
- loading skeletons
- retry, timeout, polling, and interval patterns

This audit prioritizes loading states that can keep learners on a spinner or skeleton for longer than 5 seconds.

## Inventory

| Pattern                                           | Count |
| ------------------------------------------------- | ----: |
| `loading.tsx` route fallbacks under `src/app`     |    45 |
| `Suspense` references under `src` / `components`  |   185 |
| `fallback=` references under `src` / `components` |    52 |
| `isLoading` references                            |     2 |
| `isPending` references                            |    51 |
| `isFetching` references                           |     0 |
| `useEffect` references                            |   717 |
| `useTransition` references                        |    44 |
| `setInterval(...)` references                     |    14 |
| `fetchWithRetry` references                       |    37 |

## Findings

| File                                                                | Component                               | Cause                                                                                                                                                                                                                            | Severity | Fix recommendation                                                                                                                                                      |
| ------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/student/practice-test-runner-client.tsx`            | `PracticeTestRunnerClient`              | Initial hydrate uses `fetchWithRetry('/api/practice-tests/${testId}?hydrate=minimal')` with 3 attempts and `timeoutMs: 45_000`, so a failing session can show `PracticeTestRunPageSkeleton` for up to ~136 seconds before error. | Critical | Reduce initial hydrate timeout to a learner-visible budget, show an inline "still working / retry" state by 5 seconds, and let background recovery continue separately. |
| `src/components/student/practice-test-runner-client.tsx`            | CAT study review side fetch             | `cat-study-review` fetch uses 2 attempts with `timeoutMs: 20_000`; it is non-blocking, but delayed feedback can appear long after the question shell.                                                                            | Medium   | Keep non-blocking, add a bounded panel-local timeout message if the feedback panel is expected to render.                                                               |
| `src/components/student/practice-test-runner-client.tsx`            | Foreground question loader              | Per-question fetch uses 2 attempts with `timeoutMs: 25_000`; a missing uncached question can leave the active question area waiting for ~50 seconds.                                                                             | High     | Set a 5-second foreground threshold with retry CTA and keep speculative prefetch best-effort.                                                                           |
| `src/components/flashcards/flashcard-custom-study-client.tsx`       | `FlashcardCustomStudyClient`            | Custom session startup uses 2 attempts with `timeoutMs: 8_000`; the component shows staged copy at 0.9s, 2.2s, and 4s, but remains in `loading` until the request resolves or fails.                                             | High     | Existing staged copy is good; make the retry CTA actionable at 5 seconds while the request continues, and cap visible blocking wait closer to 8-10 seconds.             |
| `src/components/flashcards/flashcard-study-client.tsx`              | `FlashcardStudyClient`                  | Deck study startup uses 2 attempts with `timeoutMs: 8_000` and shows only the generic flashcard skeleton until completion/failure.                                                                                               | High     | Add the same staged long-load copy and retry affordance used by custom flashcards.                                                                                      |
| `src/components/flashcards/flashcard-weak-study-client.tsx`         | `FlashcardWeakStudyClient`              | Weak-area queue uses a 25-second AbortController timeout and a text-only loading state.                                                                                                                                          | High     | Show a retry/back-to-flashcards affordance after 5 seconds; reduce blocking timeout or use `fetchWithRetry` with a shorter visible budget.                              |
| `src/components/flashcards/flashcards-hub-client.tsx`               | `FlashcardsHubClient` inventory refresh | Inventory fetch is capped at 2 seconds and degrades to stale categories or a retry message. This is a positive pattern; no infinite spinner observed.                                                                            | Low      | Keep this pattern; use it as the model for other launchers.                                                                                                             |
| `src/components/student/practice-tests-hub-client.tsx`              | Practice discovery fetch                | Discovery fetch has no AbortController timeout. It sets `discoveryReady` on success/failure, but a hung fetch can leave readiness-dependent UI waiting indefinitely.                                                             | High     | Add a 5-second timeout and degraded "topics unavailable" fallback similar to flashcards inventory.                                                                      |
| `src/components/student/practice-tests-hub-client.tsx`              | Practice/CAT create flow                | Session creation uses a 28-second timeout and sets `creating` / `launchingHref`. If navigation fallback fails, the user can wait for hard fallback behavior.                                                                     | Medium   | Keep hard navigation fallback, but expose a 5-second "still starting" state with retry/cancel.                                                                          |
| `src/components/student/learner-lessons-responsive-results.tsx`     | Lessons client filter results           | Filter fetch uses AbortController but no timeout. A stalled `/api/lessons` request keeps `loading` true until network failure or navigation.                                                                                     | Medium   | Add a 5-second timeout and keep previous cached rows visible with an error summary.                                                                                     |
| `src/components/lessons/pathway-lesson-study-loop-orchestrator.tsx` | Lesson study-loop record fetch          | `fetchBankRecord` has no timeout. It is not route-blocking, but study-loop enrichment can remain absent or delayed.                                                                                                              | Low      | Add timeout/fallback for optional study-loop record fetch.                                                                                                              |
| `src/app/(app)/app/(learner)/flashcards/page.tsx`                   | Flashcards route Suspense fallback      | Suspense fallback wraps `FlashcardsHubClientBoundary`, but the route already resolves server bootstrap before render. No unresolved promise loop found.                                                                          | Low      | Keep; avoid adding nested blocking fetches inside the boundary.                                                                                                         |
| `src/app/(app)/app/(learner)/flashcards/custom/page.tsx`            | Custom flashcard Suspense fallback      | Suspense fallback is static; actual load is controlled by `FlashcardCustomStudyClient`, which has bounded request time and error state.                                                                                          | Medium   | Improve client long-load CTA as above; no route-level infinite Suspense found.                                                                                          |
| `src/app/(app)/app/(learner)/flashcards/weak-areas/page.tsx`        | Weak-area Suspense fallback             | Suspense fallback is static; actual load can wait up to 25 seconds in client.                                                                                                                                                    | High     | Fix the client timeout/long-load affordance.                                                                                                                            |
| `src/app/(app)/app/(learner)/practice-tests/[id]/loading.tsx`       | Practice/CAT route loading fallback     | Route skeleton is safe only if the RSC page resolves; client hydrate then has a second skeleton with very long timeout.                                                                                                          | High     | Keep route fallback, but reduce client hydrate blocking budget.                                                                                                         |
| `src/app/(app)/app/(learner)/practice-tests/loading.tsx`            | Practice launcher loading fallback      | Uses `FlashcardsHubSkeleton`, which is visually mismatched but does resolve when the route resolves.                                                                                                                             | Low      | Replace with a practice-specific skeleton when doing UI polish; not a stuck-loading cause.                                                                              |
| `src/app/(app)/app/(learner)/lessons/loading.tsx`                   | Lessons route loading fallback          | Route skeleton resolves when server page resolves. No client-side infinite fallback observed.                                                                                                                                    | Low      | Keep.                                                                                                                                                                   |
| `src/app/(app)/app/(learner)/lessons/[id]/loading.tsx`              | Lesson detail loading fallback          | Route skeleton resolves when server page resolves. Lesson detail still has optional below-fold client fetches.                                                                                                                   | Low      | Keep route fallback; bound optional study-loop fetches.                                                                                                                 |
| `src/lib/observability/use-stuck-loading-ux.ts`                     | `useStuckLoadingUx`                     | Existing stuck-loading tracker fires after 45 seconds by default. This misses the requested 5-second priority threshold.                                                                                                         | Medium   | Lower configured threshold for learning activities to 5-8 seconds or add per-surface overrides.                                                                         |
| `src/lib/runtime/fetch-with-retry.ts`                               | `fetchWithRetry`                        | Retry helper is bounded and clears timers correctly. Risk comes from callers selecting very long timeout/attempt combinations.                                                                                                   | Low      | Add guidance/constants for learner-visible request budgets.                                                                                                             |

## Components Waiting On Failed Promises

| Component                          | Evidence                                                            | Risk                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `PracticeTestRunnerClient`         | Catch path sets `error` and `phase="error"` after fetch exhaustion. | Not infinite, but exhaustion can take longer than 5 seconds because timeout budget is very high. |
| `FlashcardCustomStudyClient`       | Catch/finally sets precise error and `loading=false`.               | Not infinite; visible spinner can exceed 5 seconds.                                              |
| `FlashcardStudyClient`             | Catch/finally sets `loadError` and `loading=false`.                 | Not infinite; visible spinner can exceed 5 seconds.                                              |
| `FlashcardWeakStudyClient`         | Catch/finally sets `error` and `loading=false`.                     | Not infinite; visible spinner can last 25 seconds.                                               |
| `PracticeTestsHubClient` discovery | Catch sets `discoveryReady=true`, but fetch lacks timeout.          | Potential indefinite wait on hung fetch.                                                         |
| `LearnerLessonsResponsiveResults`  | Uses abort-on-next-request but no request timeout.                  | Potential indefinite filter updating state on hung fetch.                                        |

## Infinite Retry / Polling / State Loop Review

- No unbounded retry loop was found in the audited learner activity startup paths.
- `fetchWithRetry` caps attempts at 8 globally.
- Practice runner timer intervals are cleared on effect cleanup.
- Flashcard prefetch paths are best-effort and do not own blocking loading UI.
- `WeakAreasDashboardClient` uses a 45-second refresh interval; not part of the eight learning activity startup paths.
- The largest issue is not infinite retry; it is long bounded waits that exceed the 5-second learner threshold.

## Hydration Mismatch Risks

| File                                                     | Risk                                                                                                                            | Severity | Fix recommendation                                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `src/components/flashcards/flashcards-hub-client.tsx`    | Preferences hydrate from URL/localStorage after first render, causing selected systems and card limit to update post-hydration. | Medium   | Keep dimensions stable and avoid changing loading containers; persist selection into URL where possible.     |
| `src/components/student/practice-tests-hub-client.tsx`   | Query params can alter mode/pathway/count after first render.                                                                   | Low      | Current state transitions are bounded; ensure launcher controls reserve stable layout.                       |
| `src/components/student/practice-test-runner-client.tsx` | Client hydrate replaces skeleton with session state and many independent state updates.                                         | Medium   | Bootstrap a single reducer/state object to reduce render bursts, but do not change scoring/session behavior. |

## Priority Fix List

1. `PracticeTestRunnerClient`: reduce initial hydrate visible wait from ~136 seconds to a 5-second long-load state plus retry/cancel.
2. `PracticeTestRunnerClient`: add 5-second foreground question-load fallback for uncached questions.
3. `FlashcardWeakStudyClient`: replace 25-second silent loading with 5-second retry/back affordance.
4. `FlashcardStudyClient`: add staged long-load copy/retry for deck sessions.
5. `PracticeTestsHubClient`: add timeout to discovery fetch.
6. `LearnerLessonsResponsiveResults`: add timeout to `/api/lessons` filter fetch and keep cached rows visible.
7. `useStuckLoadingUx`: configure learning surfaces at 5-8 seconds instead of the 45-second default.

## Learning Activity Performance Linkage

The refreshed learning activity investigation was regenerated at:

`docs/reports/learning-activity-performance.md`

The slowest loading risks align with that report:

- CAT session: largest source size, highest client fetch count, and longest hydrate timeout.
- Flashcard session: heavy pool generation and visible session skeleton.
- Practice session: same runner skeleton and hydrate path as CAT.
- Practice launcher and lesson launcher: client-side discovery/filter fetches without timeouts.

## Measurement Status

- Static scan completed.
- Learning activity static performance report regenerated.
- Authenticated cold/warm browser timings were not measured because no paid learner Playwright storage state or paid learner credential environment variables were available in this shell.
- Anonymous timings were intentionally not used for protected learning routes because they would measure redirects/login shells rather than the learner activities.
