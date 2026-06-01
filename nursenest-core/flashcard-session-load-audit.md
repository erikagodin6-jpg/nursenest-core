# Flashcard Session Load Failure Audit

Date: 2026-06-01

## Executive Result

The runtime source no longer contains the generic learner-facing strings `Session could not load` or `We could not load this flashcard session`.

Flashcard launch failures are now traceable through structured server logs and precise client errors for both session paths:

- Custom multi-system launcher: `/api/flashcards/custom-session`
- Deck study launcher: `/api/flashcards/decks/[deckRef]/study`

## Root-Cause Findings

| Area | Finding | Current Handling |
| --- | --- | --- |
| Generic failure copy | The exact generic `Session could not load` string is absent from runtime source. A deck-specific generic fallback was also removed. | Custom and deck clients map API codes to precise errors. |
| Empty pool | Custom sessions can reach zero cards after pathway/system/topic/progress filters. | API returns `empty_flashcard_pool` with pool integrity counts. |
| Serialized empty session | A pool can contain candidates but return zero renderable study cards after serialization or card-window filtering. | API returns `session_data_invalid`; client also guards success-shaped payloads that contain only non-renderable cards. |
| Entitlement failure | Subscriber/session resolution can fail before the pool query runs. | Custom API logs `FLASHCARD_SESSION_CREATE` with `entitlement_denied_or_session_missing`; deck API returns `entitlement_check_failed` when entitlement resolution fails. |
| Deck not found | Legacy deck URLs or stale launcher links can reference missing decks. | Deck API returns `deck_not_found`; client tells the learner the deck is unavailable. |
| DB/API timeout | Query timeout or route exception can prevent session creation. | API returns retryable `session_timeout`, `service_unavailable`, or `deck_study_query_failed` with integrity metadata. |
| Client hydration / malformed JSON | The client can receive invalid JSON or a malformed response. | Client renders `Session data is invalid` and logs payload parse diagnostics. |

## Instrumentation Added / Verified

Custom session logs use `FLASHCARD_SESSION_CREATE` and include:

- `userId`
- `pathway`
- `pathwayRaw`
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
- `sessionId`
- `failureReason`

Pool generation logs use `FLASHCARD_SESSION_POOL` and include candidate, published, eligible, serialized, and final pool counts.

Deck study logs use `FLASHCARD_DECK_SESSION_LOAD` and include:

- `userId`
- `pathway`
- `country`
- `tier`
- `selectedTopics`
- `selectedDeckIds`
- `candidateFlashcards`
- `publishedFlashcards`
- `eligibleFlashcards`
- `finalSessionPoolSize`
- `sessionId`
- `failureReason`

## Failure Code Matrix

| Code | User-Facing Meaning | Retryable | Root Cause Category |
| --- | --- | --- | --- |
| `empty_flashcard_pool` | No flashcards were found for the selected systems. | No | Empty pool, invalid filters, missing content mapping |
| `session_data_invalid` | Session data is invalid. | No | Serialization or hydration contract failure |
| `session_timeout` | Study session timed out. | Yes | Slow DB/API route |
| `service_unavailable` | Flashcard session temporarily unavailable. | Yes | Route exception or dependency failure |
| `database_error` | Flashcard pool could not be read from the database. | Yes | Database query failure |
| `deck_not_found` | Deck is no longer available. | No | Stale/missing deck reference |
| `deck_study_empty_pool` | No flashcards were found for this deck. | No | Empty deck or access-scoped deck pool |
| `deck_study_query_failed` | Unable to create study session from this deck. | Yes | Deck study DB/API failure |
| `entitlement_check_failed` | Unable to verify access to this deck. | Yes | Entitlement lookup failure |
| `auth_required` | Sign in required. | No | Missing authenticated session |

## Launch Path Validation Matrix

This pass validated the code paths and failure contracts statically plus targeted contract tests. Live production pool counts should be read from the structured logs after launch attempts because this environment was not connected to the production learner session matrix during the audit.

| Pathway | Selected Systems | Pool Size | Session Created? | Error | Root Cause |
| --- | --- | ---: | --- | --- | --- |
| RN Canada | Single system | Logged as `eligibleFlashcards` | Yes or precise failure | `empty_flashcard_pool` / `session_data_invalid` / retryable service code | System/topic/pool/serialization now traceable |
| RN Canada | Multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | `empty_flashcard_pool` / retryable service code | Multi-system filter now logged in `systems` |
| RN US | Single + multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | Precise code only | Country/pathway normalization logged |
| RPN Canada | Single + multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | Precise code only | PN/RPN pathway and country filters logged |
| PN US | Single + multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | Precise code only | PN/US entitlement and pathway filters logged |
| NP pathways | Single + multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | Precise code only | NP pathway scope logged |
| Allied pathways | Single + multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | Precise code only | Allied entitlement/pathway scope logged |
| New Grad | Single + multi-system | Logged as `eligibleFlashcards` | Yes or precise failure | Precise code only | Content pool and filters logged |
| Any pathway | Adaptive / weak / missed / saved filters | Logged as `eligibleFlashcards` after filters | Yes or precise failure | `empty_flashcard_pool` when filters remove all cards | Progress and persistence filters logged in `selectedFilters` |
| Any pathway | Resume session | Logged with `sessionId` | Yes or precise failure | Resume-specific precise copy | Session seed and offset logged |

## Evidence

Search verification:

```text
rg -n "Session could not load|We could not load this flashcard session" src -S
```

Result: only guard assertions in `src/lib/flashcards/flashcard-session-stability.contract.test.ts`; no runtime source matches.

Targeted tests:

```text
node --import tsx --test src/lib/flashcards/flashcard-session-stability.contract.test.ts src/lib/flashcards/flashcard-custom-session-response.test.ts
```

Result: 20 passing tests.

Full TypeScript:

```text
npx tsc --noEmit --pretty false
```

Result: failed due to pre-existing unrelated errors in lessons, blog/admin, sitemap, authority, ECG, SEO, and other modules. No flashcard session files were listed in the TypeScript errors.

## Files Verified

- `src/app/api/flashcards/custom-session/route.ts`
- `src/lib/flashcards/build-flashcard-custom-session.ts`
- `src/components/flashcards/flashcard-custom-study-client.tsx`
- `src/app/api/flashcards/decks/[deckRef]/study/route.ts`
- `src/components/flashcards/flashcard-study-client.tsx`
- `src/lib/flashcards/flashcard-custom-session-response.ts`
- `src/lib/flashcards/flashcard-session-stability.contract.test.ts`

## Final Status

PASS for failure traceability and generic-error removal.

Remaining operational validation: run authenticated production or staging launch attempts for RN, RPN/PN, NP, Allied, and New Grad users, then query `FLASHCARD_SESSION_CREATE`, `FLASHCARD_SESSION_POOL`, and `FLASHCARD_DECK_SESSION_LOAD` logs to fill exact live pool sizes per pathway.
