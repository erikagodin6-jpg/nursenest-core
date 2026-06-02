# Flashcard Hub Root Cause Audit

Generated: 2026-05-31

## Scope

Audited the learner flashcard hub, inventory API, custom-session API, exam-question pool SQL, taxonomy folding, and category selection state for:

- `/app/flashcards?pathwayId=...`
- `/api/flashcards/inventory`
- `/api/flashcards/custom-session`
- `exam_questions`
- `Flashcard` / `FlashcardDeck`
- `PathwayLesson`
- shared canonical body-system mappings

This audit was completed before code changes. Live production count validation could not be executed from this local environment because the available `DATABASE_URL` points to placeholder credentials.

## Findings

| Area | Finding | Severity |
| --- | --- | --- |
| Multi-system selection | Current code uses `selectedCanonicalIds: string[]` and `toggleFlashcardsHubSystemSelection`, so the data model already supports multiple systems. The UX still lacks an explicit All Systems control, and zero-count labels make selected systems look unavailable. | High |
| Zero card labels | The hub renders `{count} Flashcards` for every canonical system. During deferred inventory, timeout, parse failure, or transient DB failure, base hub categories have count `0`, so users see `0 Flashcards` even though studying may still work from the shared exam pool. | Critical |
| Count loading | `/app/flashcards` intentionally uses a 100 ms server inventory bootstrap timeout and defers to `/api/flashcards/inventory`. This is good for performance, but the initial UI can show zero until client counts return. | High |
| Inventory failure fallback | If `/api/flashcards/inventory` fails and the hub has base categories, the UI keeps categories but still displays zero counts. Requirement is to show System Name + Available / Ready To Study. | Critical |
| Shared content pool | Flashcards are derived from `exam_questions` through `loadFlashcardsExamInventoryForPathway` and `buildFlashcardCustomSession`, not only from dedicated `Flashcard` rows. This matches the platform direction. | OK |
| Dedicated Flashcard rows | Dedicated `Flashcard` rows are counted diagnostically but should not be the primary source. A system can have `dedicatedFlashcardRowCount = 0` and still be valid if `examQuestionSqlPoolCount > 0`. | OK |
| Pathway mismatches | The inventory SQL uses normalized exam context plus optional `study_link_pathway_id`, entitlement scope, NP specialty guards, and quality gates. Zero pools can still happen when question rows lack normalized exam/pathway fields or fail flashcard quality gates. | High |
| Taxonomy folding | Counts are grouped by `exam_questions.body_system` + `topic`, then folded through `resolveBuilderCategoryId` and canonical study categories. Bad or missing body-system/topic values can push content to `uncategorized` or review buckets. | High |
| CAT/question parity | The pool intentionally shares discovery SQL and question-bank gates with CAT/practice. Any system present in CAT/questions should surface in flashcards if it passes flashcard usability gates. | OK with validation needed |
| Validation audit | A live per-pathway matrix must query `exam_questions`, `Flashcard`, `PathwayLesson`, and CAT pool availability. Code hooks exist; a DB-backed script/report should run in staging/production. | Required |

## Root Cause

The blocker is not a single-select state bug in the current code. The current blocker is the combination of:

1. Deferred/failed inventory is represented as numeric zero instead of an unknown-but-available state.
2. Canonical system cards render zero counts before inventory is confirmed.
3. Error fallback keeps the system grid visible but leaves count labels as `0 Flashcards`.
4. There is no explicit All Systems control, so the empty selection meaning “all systems” is not obvious.
5. Live zero-pool cases still need production DB validation to distinguish bad data normalization from legitimate empty content.

## Required Fixes

1. Add explicit multi-select controls: All Systems and Clear.
2. Keep checkbox-style visual state for every selected system.
3. Treat count-loading and count-error states as non-blocking.
4. Render `Available` / `Ready to study` instead of `0 Flashcards` when counts are not confirmed.
5. Preserve true zero diagnostics when the live inventory route succeeds with `total = 0`.
6. Add contracts that multi-system selection remains additive and count failures never render blocking zero-copy.
7. Add a DB-backed validation script/report for RN, RPN, PN, NP, and Allied pathways.
