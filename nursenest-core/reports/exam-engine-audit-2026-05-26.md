# Exam Engine Audit Pass - 2026-05-26

## Scope

Dedicated NCLEX/CNPLE exam-engine realism and stability review across:

- Practice test runner (`PracticeTestRunnerClient`)
- Practice test session APIs (`/api/practice-tests/[id]`, `/question`, CAT advance/finalize)
- CAT selection/runtime contracts (`src/lib/cat`, `src/lib/practice-tests`)
- CNPLE case/LOFT simulation APIs (`/api/cases/cnple/*`)
- Existing psychometric governance tests for CAT vs LOFT pathway isolation

## Findings

### Strong Existing Foundations

- CAT exam mode already uses an explicit phase machine: answering -> submitted_locked -> advancing -> answering/completed.
- CAT advance is server-atomic: answer scoring, adaptive state update, next item append/completion happen in one PATCH.
- Strict CAT completion is blocked before enough adaptive answers.
- Per-item question fetch keeps large sessions out of hydration payloads.
- CNPLE routing/governance distinguishes LOFT from CAT and blocks CAT semantics for the CNPLE pathway.
- Question rendering supports MCQ, SATA, and bowtie/NGN payloads; unsupported structured types fail closed into fallback UI instead of blank rendering.

### Gaps / Risks

- Exam tool state was not durable: flag-for-review and confidence reset on refresh/resume.
- Cross-out state had no generic practice runner persistence channel, even though dedicated NCLEX components already model cross-out affordances.
- CNPLE currently behaves more like longitudinal case simulation than a full fixed-length LOFT form generator with blueprint-balanced equivalent forms.
- Existing contract tests reference stale `(student)` route paths after the app route group migration.
- Matrix/grid, drag/drop, ordering, hotspot, and structured exhibit items remain partially cataloged but not fully rendered in the live practice runner.

## Implemented In This Pass

- Added an `examTools` persistence envelope to the existing `PracticeTest.adaptiveState` JSON.
- Extended save, abandon, linear commit, CAT advance, CAT completion, and manual completion paths to preserve exam tool state.
- Hydrate now restores persisted:
  - flagged questions
  - confidence ratings
  - crossed-out option state envelope for future renderer wiring
- Flag-for-review and confidence changes now autosave through the same server reconciliation path as answers/cursor/timing.

## Validation

- `npm run typecheck:critical` passed.
- `npm run test:unit:cat` passed: 135 tests.
- `npm run test:unit:practice` failed on pre-existing stale `(student)` route paths, then passed the bowtie/grading tests.
- `npm run test:cnple` failed on pre-existing stale route/config expectations:
  - old `(student)` route path references
  - CNPLE static hub expects inline `dynamic = "force-dynamic"` while current file exports ISR `revalidate = 3600`

## Next Highest-Value Work

- Build a true CNPLE LOFT form engine: deterministic seed, blueprint/domain weights, difficulty bands, exposure control, fixed-length equivalent forms, and resumable form reconstruction.
- Promote exam tool state into a shared exam interaction layer used by CAT, linear practice, and CNPLE LOFT shells.
- Wire cross-out UI into the current practice runner options and persist per-question option keys.
- Add structured renderers for matrix/grid, ordered response, drag/drop, hotspot, and exhibit-based NGN items.
- Update stale route contract tests or add compatibility files if those paths are intentionally required.
