# CAT Scaling Audit

Generated: 2026-06-02

## Source Paths

- `src/lib/practice-tests/cat-session.ts`
- `src/lib/exams/cat-engine.ts`
- `src/app/api/practice-tests/route.ts`
- `src/app/api/practice-tests/[id]/question/route.ts`
- `src/app/api/cat/np/session/route.ts`
- `src/app/api/cat/np/answer/route.ts`

## Current Flow

1. Create session by pathway, entitlement, CAT mode, and question cap.
2. Load candidate pool and recent-answer/history signals.
3. Select first item using adaptive engine and blueprint balancing.
4. Persist session in `PracticeTest`.
5. On answer, load session, load pool/question, update adaptive state, persist, and select next item.

## Scaling Risks

| Target | Expected risk | Reason |
| --- | --- | --- |
| 100 concurrent CATs | Medium-high | CAT creation and answer paths run DB queries plus CPU selection. |
| 500 concurrent CATs | Critical unless pool snapshots are cached | Per-answer pool reloads and session persistence amplify with question count. |
| 1000 concurrent CATs | Not safe without state/pool optimization | DB write/read volume per question becomes the bottleneck. |

## CPU Cost Per Question

The adaptive engine is in-memory TypeScript over the candidate pool and answered state. CPU cost grows with pool size, answered question count, blueprint diagnostics, and exposure/weak-priority calculations. It is manageable per user but expensive at 500-1000 simultaneous answer submissions.

## DB Cost Per Question

Source evidence shows:

- Load current persisted `PracticeTest`.
- Load question/pool rows by IDs.
- Update/save session state.
- Completion path loads historical answers and writes final analysis.

## Required Changes

1. Store compact per-session pool snapshot in cache or persisted JSON so answer route does not reload full question rows each time.
2. Store next-question candidate state after each answer.
3. Persist answers append-only plus periodic state checkpoint instead of rewriting full large JSON on every question if payload size grows.
4. Add CAT-specific metrics: create latency, answer latency, pool size, duplicate prevention, stalled session rate.
5. Cap concurrent CAT creation per user/pathway with existing advisory lock and add global rate protection.

