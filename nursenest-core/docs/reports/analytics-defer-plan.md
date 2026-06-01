# Analytics Defer Plan

Date: 2026-06-01

## Objective

Audit learner analytics and tracking calls, identify work that starts during page load, and move non-essential tracking to deferred execution. Analytics must never block first render, route loading, or the start of a learning activity.

## Classification

| Category | Examples | Page-load behavior | Decision |
| --- | --- | --- | --- |
| Progress tracking | Lesson completion, flashcard attempts, question answers, CAT/practice answer persistence | Runs after learner actions or API responses, not as page-render prerequisites | Do not defer beyond existing async/fire-and-forget behavior because these are product-state writes. |
| Session tracking | Learner activity lifecycle beacon, activity start/abandon/resume | Runs on learner shell mount and visibility changes | Keep lightweight beacon behavior; it is best-effort and non-blocking. |
| Readiness tracking | Readiness score views, CAT readiness preflight, dashboard readiness | Some non-critical insights were fetched immediately after hydration | Defer secondary analytics panel fetches to idle. |
| Dashboard tracking | PostHog pageview, app section view, dashboard analytics cards | PostHog bootstrap/pageview started from mount effects | Defer PostHog boot, identify, and pageview captures to idle. |
| Weak area tracking | Weak-area dashboards and analytics panels | Some panels fetch weak-area data after mount | Keep dashboard refresh idle; defer Flashcards/Practice hub analytics fan-out. |
| Learning analytics | Flashcard hub stats, due summary, performance summary, coaching telemetry | Some calls were mount-time analytics/insight work | Defer non-essential captures and secondary insight fetches. |

## Page Load Calls Found

| Surface | Call(s) | Essential for initial render? | Action |
| --- | --- | --- | --- |
| Global analytics provider | `initPosthogClient`, `$pageview` capture | No | Moved to `scheduleClientAnalyticsTask()` with idle timeout. |
| Auth identity bridge | PostHog identify | No | Moved to idle; `identifyPosthogUser()` now initializes lazily if needed. |
| Flashcards hub analytics | `/api/flashcards/stats`, `/api/flashcards/due-summary`, `/api/learner/weak-areas` | No, panel enhancement only | Moved initial refresh to idle with abort cleanup. |
| Practice Tests hub analytics | `/api/learner/weak-areas`, `/api/learner/readiness`, `/api/performance-summary`, `/api/practice-tests/cat-readiness` | No, panel enhancement only | Moved initial refresh to idle. |
| RN coaching telemetry | direct `window.posthog.capture()` | No | Deferred via idle callback / timeout fallback. |
| Premium gate impressions and CTA analytics | direct `window.posthog.capture()` | No | Deferred via shared idle scheduler. |
| Learner app section view | `trackClientEvent(app_section_view)` | No | Already idle-deferred before this phase; retained. |
| Marketing funnel beacons | Product analytics captures | No | Already idle-deferred before this phase; retained. |

## Implementation

Added a shared browser scheduler:

- `src/lib/observability/posthog-client.ts`
  - `scheduleClientAnalyticsTask(run, timeoutMs)`
  - Uses `requestIdleCallback` when available.
  - Falls back to bounded `setTimeout`.
  - Returns a cleanup function for React effects.

Updated these page-load paths:

- `src/components/providers/analytics-provider.tsx`
  - PostHog initialization and pageview capture are deferred.
  - Navigation UX bookkeeping remains immediate because it only touches local in-memory diagnostics and DOM flags.

- `src/components/observability/posthog-identify.tsx`
  - PostHog init and identify are deferred.
  - Identify now lazily initializes the client if the idle init has not completed.

- `src/components/flashcards/flashcards-hub-analytics.tsx`
  - Initial hub analytics refresh is deferred.
  - Abort cleanup remains in place.

- `src/components/student/practice-tests-hub-analytics.tsx`
  - Initial practice analytics refresh is deferred.

- `src/lib/learner/rn-coaching-intelligence/coaching-telemetry.ts`
  - Direct coaching captures now run during idle.

- `src/components/study/premium-gate.tsx`
  - Paywall impressions and CTA captures now run during idle.

## Not Deferred

The following were intentionally not moved because they represent product-state persistence rather than optional analytics:

- Flashcard attempt persistence
- Question performance persistence
- Lesson progress updates
- CAT/practice session answer/result persistence
- Checkout, subscription, and revenue-critical server events
- Entitlement, paywall, and trial validations

These are still async or fire-and-forget where appropriate, but they should remain tied to the learner action that creates the state.

## Expected Impact

| Route family | Before | After |
| --- | --- | --- |
| Dashboard/app shell | PostHog boot and pageview could start immediately after hydration | Boot/pageview wait for idle, preserving first render. |
| Flashcards hub | 3 secondary analytics API calls started immediately after hydration | Calls start during idle; primary hub remains interactive first. |
| Practice Tests/CAT hub | Up to 4 secondary analytics API calls started immediately after hydration | Calls start during idle; launcher remains primary. |
| Paywalls | Impression captures could execute on mount | Captures wait for idle. |
| Coaching/report panels | Direct PostHog capture could execute during render-adjacent effects | Captures wait for idle. |

## Validation

- Targeted ESLint passed for changed analytics files.
- No route, entitlement, progress, scoring, or CAT logic was changed.

## Remaining Follow-Up

No blocking remediation remains for Phase 5. The next safe optimization would be to add a low-priority queue for dashboard insight fetches with browser concurrency limits, but that would be a broader data-loading policy change and was intentionally left out of this latency-only pass.
