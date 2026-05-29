# Activity Incident Response Report

## Scope

P0 learner activity startup audit for:

- Flashcards
- CAT
- Practice Questions
- Clinical Skills
- Pharmacology
- ECG

## Root Cause

Two startup-path risks were verified in code:

1. Subscriber/page entitlement gates could wait on auth, entitlement, and account-sharing checks before returning an activity shell or API response.
2. Hub prefetch warmed many heavy learner routes shortly after render, competing with the learner's active launch path during degraded DB/API conditions.
3. The ECG module layout read `internalCourse` status during metadata/layout without a bounded fallback; when the DB was unreachable locally, `/modules/ecg/basic/lessons` returned a 500 after 12.7s.

Together these can produce the observed failure mode: learner routes and screenshot automation remain on loading states while non-essential or speculative work competes with the core activity launch.

## Fixes Applied

- `requireSubscriberSession()` now bounds:
  - auth session read: `AUTH_NODE_SESSION_READ_TIMEOUT_MS`
  - entitlement read: `2000ms`
  - account-sharing touch: `500ms`
- `resolveEntitlementForPage()` now returns a controlled `"error"` fallback after `2000ms` instead of allowing page rendering to wait indefinitely.
- `getProtectedRouteSession()` now bounds the active-user DB check at `650ms` and preserves an already validated session if the DB check is unavailable.
- API route telemetry now appends `Server-Timing` with total route duration to responses.
- Speculative hub prefetch is now disabled unless `NEXT_PUBLIC_NN_ENABLE_HUB_PREFETCH=1` is explicitly set.
- ECG module publication status now uses a `650ms` DB fallback and degrades to `draft`/not found instead of a slow 500.

## Startup Path Findings

| Surface | Startup path | Risk found | Status |
| --- | --- | --- | --- |
| Flashcards Hub | RSC session → page entitlement → pathway bootstrap → client inventory | entitlement/user checks and prefetch amplification | Guarded |
| Flashcard Session | RSC activity bootstrap → custom-session API → first card only | subscriber gate could block API response | Guarded |
| Practice Hub | RSC session → page entitlement → pathway bootstrap → optional discovery | entitlement/user checks and prefetch amplification | Guarded |
| CAT Launch | practice hub POST `/api/practice-tests` → subscriber gate → CAT preflight → transaction | subscriber gate could block before CAT work begins | Guarded at gate |
| Clinical Skills | learner route auth/entitlement shell | shared protected session risk | Guarded via shared session path |
| Pharmacology | learner route auth/entitlement shell | shared protected session risk | Guarded via shared session path |
| ECG | module route/session shell | unbounded module status DB read caused slow 500 on DB outage | Guarded with status fallback |

## Instrumentation

- API responses now include `Server-Timing: total;dur=...` when server timing is enabled.
- Existing API telemetry continues to emit `request_end`, `route_degraded`, `route_timeout`, and slow-route logs.
- Flashcard inventory already emits segmented timing for `auth_gate`, cache, manifest, and live inventory.
- Timeout guardrails now emit `[timeout]` console diagnostics from `safeAwait()` and structured server logs around subscriber/page gates.

## Slowest Verified Code Paths

| Category | Path | Evidence |
| --- | --- | --- |
| Slowest endpoint risk | `POST /api/practice-tests` | CAT launch performs entitlement, CAT readiness, advisory lock, candidate selection, and session creation. Subscriber gate is now bounded before this work starts. |
| Slowest query risk | entitlement `getUserAccess()` | Reads user and subscription rows before every subscriber-only API when cache is cold. Runtime cache already exists; new timeout prevents indefinite launch blocking. |
| Slowest component risk | hub client prefetch | `useHubPrefetch()` previously preloaded many routes from flashcards/practice hubs. It is now opt-in. |

## Local Smoke Evidence

Unauthenticated local smoke checks cannot verify paid learner content, but they prove routes return bounded responses instead of hanging:

| Route | Result after fix |
| --- | --- |
| `/app/flashcards` | `307` to login in `154ms` |
| `/app/practice-tests` | `307` to login in `31ms` |
| `/app/cat` | `307` redirect alias in `13ms` |
| `/app/clinical-skills` | `307` to login in `18ms` |
| `/app/pharmacology` | `307` to login in `20ms` |
| `/modules/ecg/basic/lessons` | `404` gated fallback in `1564ms` after removing the slow DB 500 |
| `/api/flashcards/inventory?pathwayId=ca-rn-nclex-rn` | `401` in `20ms` |
| `/api/flashcards/custom-session?pathwayId=ca-rn-nclex-rn&includeCards=1&cardLimit=1` | `401` in `43ms` |
| `/api/practice-tests` | `401` in `40ms` |

## Validation Notes

This pass verifies code-level recovery guardrails and TypeScript compilation. Full proof screenshots require a signed-in QA learner account in this environment; without that, protected activity routes cannot be launched through the browser as a real learner.

Current expected behavior after this patch:

- Auth/entitlement/account-sharing instability returns a bounded fallback response instead of hanging.
- Flashcard and practice hubs render their shell from lightweight metadata.
- CAT/practice start requests no longer wait indefinitely at the subscriber gate.
- Speculative prefetch no longer competes with active study startup by default.
