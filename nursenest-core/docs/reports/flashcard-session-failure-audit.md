# Flashcard Session Failure Audit

Date: 2026-06-01

## Executive Summary

Users saw: "The request did not complete before the flashcard player could hydrate."

The confirmed primary failure mode was a timeout-budget mismatch in the custom flashcard launch flow:

- Browser fetch attempt timeout before fix: 5,500 ms
- Server full-card session timeout before fix: 7,000 ms
- Result: under slow database/session-builder pressure, the browser aborted before the API could return structured retryable JSON. The player stayed in a launch failure path with generic hydration-timeout copy instead of receiving the API's `session_timeout` response.

Fix implemented:

- Server full-card timeout now returns structured JSON at 4,800 ms.
- Count-only session timeout reduced to 1,200 ms.
- Browser attempt timeout increased to 6,500 ms.
- Client session creation attempts increased from 2 to 3.
- `Retry-After` is now honored by the shared retry helper.
- API emits response size and build duration diagnostic headers.
- Server logs now record successful response size and build latency.

## End-To-End Flow

### 1. Launcher

Files:

- `src/components/flashcards/flashcard-custom-study-client.tsx`
- `src/app/(app)/app/flashcards/custom-study/page.tsx`

Responsibilities:

- Reads selected systems/categories/mode from URL search params.
- Creates the custom session request query.
- Shows `FlashcardStudySessionSkeleton` while `loading=true`.
- Blocks player rendering until cards are present.
- Surfaces structured launch errors and empty-pool errors.

Execution time:

- Client hydration and launch state setup target: under 250 ms.
- Network wait is bounded by `fetchWithRetry`.

Database queries:

- None directly from the launcher.

API response size:

- Before: not exposed to client telemetry.
- After: read from `x-nn-session-response-bytes` when present.

Error handling:

- 404 `empty_flashcard_pool` is non-retryable and shown as a meaningful empty state.
- 503 `session_timeout` and transient HTTP failures are retried automatically.
- Final failure shows a user-facing error panel rather than rendering the player.

Timeout thresholds:

- Before: 5,500 ms per client attempt, 2 attempts.
- After: 6,500 ms per client attempt, 3 attempts.

Hydration dependencies:

- Search params.
- Session API response.
- Valid cards from `data.cards`.
- Local session checkpoint for restore.

### 2. Session API

File:

- `src/app/api/flashcards/custom-session/route.ts`

Responsibilities:

- Authenticates learner.
- Parses pathway, systems, categories, mode, limit, and offset.
- Calls `buildFlashcardCustomSession`.
- Returns full card payloads for `includeCards=1`.
- Returns count-only inventory responses for `includeCards=0`.
- Sets private/no-store subscriber cache headers for user-sensitive responses.

Execution time:

- Warm target: under 1 second.
- Before hard timeout: 7,000 ms full-card, 2,500 ms count-only.
- After hard timeout: 4,800 ms full-card, 1,200 ms count-only.

Database queries:

- Executed inside the session builder.

API response size:

- After fix, every success and handled error response includes `x-nn-session-response-bytes`.

Error handling:

- Builder failures return 503 JSON with `code`, `diagnostics`, `Retry-After`, and timing headers.
- Empty pools return 404 JSON with `empty_flashcard_pool`.
- Invalid serialized windows return 422 JSON with `session_data_invalid`.
- Unhandled route errors are logged as `FLASHCARD_SESSION_CREATE_ERROR`.

Timeout thresholds:

- Server timeout is now intentionally below the client attempt timeout.
- This prevents browser aborts from preempting structured API errors.

Hydration dependencies:

- The player depends on this route producing cards or a meaningful terminal error.

### 3. Session Builder

File:

- `src/lib/flashcards/build-flashcard-custom-session.ts`

Responsibilities:

- Resolves learner pathway and selected systems/categories.
- Loads card inventory.
- Applies mode filters.
- Adds virtual lesson-derived cards when enabled.
- Loads question metadata for exam-bank-backed cards.
- Loads flashcard progress for user-specific review behavior.
- Builds a bounded session payload.

Execution time:

- Target: under 1 second on warm production data.
- Risk path: DB scan, exam-question metadata chunks, progress load, and serialization can exceed the budget during DB pressure.

Database queries:

- `prisma.flashcard.findMany` for canonical flashcard rows.
- `prisma.examQuestion.findMany` for topic/system metadata in chunks.
- `prisma.flashcardProgress.findMany` for learner progress.
- Exam bank pool loading through `loadExamQuestionRowsForFlashcardPool`.

API response size:

- Full sessions are bounded by returned card limit.
- Response size is now logged and exposed via header for future profiling.

Error handling:

- Database failures return `ok:false` with `database_error`.
- Count-only paths avoid full card bodies when possible.

Timeout thresholds:

- Controlled by the route wrapper, now 4,800 ms for full sessions.

Hydration dependencies:

- Must return non-empty valid card objects for the player path.

### 4. Database Query Layer

Files:

- `src/lib/flashcards/build-flashcard-custom-session.ts`
- `src/lib/flashcards/flashcard-learner-exam-pool-sql.ts`
- `src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts`

Observed query risks:

- Large flashcard scan limit: 800 rows.
- Progress scan limit: 800 rows.
- Exam question metadata chunks can add additional database work.
- Lesson virtual card generation can add CPU/serialization pressure.

Execution time:

- Not individually instrumented per Prisma query in this patch.
- Route-level timings now expose total builder cost.

Database usage:

- Confirmed. This launch flow is database-dependent for full custom sessions.

Network usage:

- No direct external network dependency found in the launch path.

Filesystem usage:

- Content inventory and lesson-backed helpers may read local content modules depending on selected pathway/mode.

### 5. Session Persistence

Custom session flow:

- Custom launch is stateless server-side.
- Session identity is derived from `sessionSeed` and client checkpoint state.
- No `FlashcardSession` row is required for the custom player.

Persisted deck flow:

- Persisted deck sessions are handled separately by:
  - `src/app/api/flashcards/decks/[deckRef]/study/route.ts`
  - `src/lib/flashcards/flashcard-session-dal.server.ts`
  - `src/components/flashcards/flashcard-session-player.tsx`

Failure assessment:

- Missing server persistence is not the root cause for custom-study launch failures.
- Session restore depends on local checkpoint plus refetchable custom-session payload.

### 6. Player Hydration

File:

- `src/components/flashcards/flashcard-custom-study-client.tsx`

Responsibilities:

- Does not render `ActiveStudySession` while loading.
- Does not render `ActiveStudySession` while error exists.
- Does not render `ActiveStudySession` when card list is empty.
- Restores local checkpoint after cards are available.

Execution time:

- Target hydration: under 250 ms after session data is available.

Database queries:

- None from the hydrated player shell.

API response size:

- Player receives only the bounded session payload from the custom-session API.

Error handling:

- Loading shell remains active until session creation completes or fails.
- Errors are surfaced in the page, not by crashing the player.

Hydration dependencies:

- Valid `cards`.
- Session seed.
- Optional local checkpoint.
- Runtime event logging.

## Cause Classification

| Possible Cause | Finding | Status |
| --- | --- | --- |
| 1. Session creation timeout | Server timeout exceeded client timeout, causing local abort before structured JSON. | Confirmed primary cause |
| 2. Empty flashcard pool | Empty pools return 404 `empty_flashcard_pool` and are surfaced as a meaningful empty state. | Not primary |
| 3. Database latency | DB pressure can push builder runtime beyond warm target. Now logged and converted to structured retryable response before browser abort. | Likely contributor |
| 4. Hydration race condition | Symptom caused by client abort racing server timeout. Loading gate already existed; timeout budgets now prevent premature generic failure. | Confirmed symptom |
| 5. Missing session persistence | Custom sessions are intentionally stateless; persisted deck sessions use separate session rows. | Not primary |
| 6. Route caching issues | Route is dynamic and uses private/no-store semantics for full user-sensitive payloads. | Unlikely |

## Files Changed

- `src/app/api/flashcards/custom-session/route.ts`
- `src/components/flashcards/flashcard-custom-study-client.tsx`
- `src/lib/runtime/fetch-with-retry.ts`
- `docs/reports/flashcard-session-failure-audit.md`

## Before / After Timings

| Area | Before | After |
| --- | ---: | ---: |
| Full session server timeout | 7,000 ms | 4,800 ms |
| Count-only server timeout | 2,500 ms | 1,200 ms |
| Client per-attempt timeout | 5,500 ms | 6,500 ms |
| Client attempts | 2 | 3 |
| Retry-After support | Commented expectation only | Implemented |
| Response-size telemetry | Not exposed | `x-nn-session-response-bytes` |
| Build-time telemetry | Success header only | Success/error timing headers and server logs |

Targets:

- Session creation: under 1 second on warm production data.
- Player hydration after payload: under 250 ms.
- Hard fallback: structured JSON before browser abort.

## Verification Evidence

Passed:

```bash
node --import tsx --test src/app/api/flashcards/custom-session-route.contract.test.mts
```

Result:

- 1 test passed.

Passed:

```bash
npm run typecheck:critical
```

Result:

- Typecheck completed successfully.

Attempted Playwright:

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3099 npx playwright test tests/e2e/flashcards/flashcard-session-failure.spec.ts --project=chromium
```

Result:

- The requested coverage already exists in `tests/e2e/flashcards/flashcard-session-failure.spec.ts` for single-system launch, multi-system launch, empty pool, slow API, session restore, refresh during active session, and performance targets.
- Local execution was blocked by dev-server availability. Earlier attempts failed because another Next dev server was already registered on port 3099. The final attempt ran the spec with web-server startup skipped, but the target server refused connections and the suite could not complete.

## Remaining Production Follow-Up

Recommended next instrumentation, outside this surgical fix:

- Add per-query timing around flashcard row load, exam metadata load, progress load, and lesson virtual generation.
- Export production p50/p95/p99 for `FLASHCARD_SESSION_RESPONSE.buildDurationMs`.
- Alert when response size or build duration exceeds the warm target.
- Reduce full-session DB scan cost if production p95 remains above 1 second after this timeout-race fix.
