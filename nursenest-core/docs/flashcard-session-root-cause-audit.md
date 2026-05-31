# Flashcard Session Root Cause Audit

## Scope

Production-severity investigation of custom flashcard study sessions that surfaced the generic learner-facing message `Session could not load`.

Audited paths:

- Flashcard launcher query construction
- `/api/flashcards/custom-session`
- `buildFlashcardCustomSession`
- Custom session JSON parsing
- Client hydration and first-window card filtering
- Multi-system category filtering
- Progress and persistence filters
- Session resume checkpoint hydration

## Root Causes

| Issue | Root Cause | Severity | Affected Pathways | Fix Applied | Verification Evidence | Remaining Risk |
|---|---|---:|---|---|---|---|
| Generic `Session could not load` message | `FlashcardCustomStudyClient` hardcoded a generic failure headline and detail for all API, JSON, timeout, and hydration failures. | Critical | RN, RPN/PN, NP, Allied, New Grad custom flashcard sessions | Replaced with precise failure states: empty pool, invalid data, create failure, resume failure, and database/service failures. | `rg` confirms the string no longer exists in runtime source; `flashcard-session-stability.contract.test.ts` guards it. | Copy is precise, but live monitoring must validate which codes dominate in production. |
| API error diagnostics discarded | `parseFlashcardCustomSessionResponse` kept only `message`, dropping `code`, `retryable`, and `integrity`. The UI could not distinguish empty pool, timeout, invalid payload, or service failure. | Critical | All custom flashcard sessions | Parser now preserves `code`, `retryable`, and `integrity` fields. | `parseFlashcardCustomSessionResponse: preserves precise failure code and integrity` passes. | None known. |
| Fragile first-card bootstrap | The custom study client forced `cardLimit=1` on initial session load, then filtered malformed/non-renderable cards client-side. If the first candidate failed render validation, a valid larger pool could appear empty. | Critical | Any pathway with mixed legacy, virtual, or exam-bank flashcard sources | Initial bootstrap now requests up to 8 cards while still respecting the requested session limit. | `flashcard-session-stability.contract.test.ts` guards against `q.set("cardLimit", "1")`. | If more than 8 consecutive cards fail serialization, the user still sees an accurate empty/invalid state and server logs expose counts. |
| Timeout/service failures collapsed | Route-level catch returned a generic `service_unavailable` for timeout and non-timeout failures. | High | All custom flashcard sessions under slow DB/API conditions | Route now classifies timeout as `session_timeout`, includes integrity, retryability, and a precise message. | Route contract still passes JSON failure requirements. | Actual timeout frequency requires production log review. |
| Launch attempt observability incomplete | Existing logs did not produce one structured launch record with pathway, systems, filters, counts, pool size, session id, and reason. | High | All custom flashcard sessions | Added `FLASHCARD_SESSION_CREATE` in the API and `FLASHCARD_SESSION_POOL` in the builder. | Source grep confirms both structured events exist. | Full userId is intentionally not logged; logs use a safe prefix. |

## Structured Logging Added

Events:

- `FLASHCARD_SESSION_CREATE`
- `FLASHCARD_SESSION_POOL`

Fields covered:

- `userId` safe prefix
- `pathway`
- `country`
- `tier`
- `systems`
- `selectedTopics`
- `selectedFilters`
- `selectedDeckIds`
- `candidateFlashcards`
- `publishedFlashcards`
- `eligibleFlashcards`
- `finalSessionPoolSize`
- `sessionId` safe prefix
- `failureReason`

## Failure Handling Contract

Generic failure copy is no longer allowed for custom flashcard sessions.

Current learner-facing outcomes:

- `Flashcard pool is empty.`
- `Your study session could not be created.`
- `Unable to resume previous session.`
- `Session data is invalid.`

## Validation Matrix

| Pathway | Single System | Multi-System | All Systems | Adaptive/Weak | Resume Session | Current Evidence |
|---|---|---|---|---|---|---|
| RN Canada | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Requires paid live E2E run |
| RN US | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Contract tests passed |
| RPN Canada | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Requires paid live E2E run |
| PN US | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Requires paid live E2E run |
| NP pathways | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Requires paid live E2E run |
| Allied pathways | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Requires paid live E2E run |
| New Grad | Instrumented | Instrumented | Instrumented | Instrumented | Instrumented | Requires paid live E2E run |

## Verification Run

Passed:

- `node --import tsx --test src/lib/flashcards/flashcard-session-stability.contract.test.ts src/lib/flashcards/flashcard-custom-session-response.test.ts src/lib/flashcards/flashcards-hub-system-selection.test.ts src/app/api/flashcards/custom-session-route.contract.test.mts`
- `npm run typecheck:critical`

Blocked:

- `npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/launcher-restoration.spec.ts --grep "system selection does not shift" --list`

Reason: the paid learning-routes Playwright config requires paid QA auth credentials before it will load.
