# Flashcard Launcher Layout Stability Audit

## Scope

Production-severity audit of visible layout movement on the flashcard launcher when learners select systems, change study filters, and adjust session settings.

Audited surfaces:

- System selector grid
- Selection icon/checkmark
- System count labels
- Selected/add badge
- Study filter controls
- Card count controls
- Shuffle toggle
- Start CTA area

## Root Causes

| Issue | Root Cause | Severity | Affected Pathways | Fix Applied | Verification Evidence | Remaining Risk |
|---|---|---:|---|---|---|---|
| System card visual movement | System cards used flexible minimum height and hover transforms. Row height could visually move as labels/counts/badges changed. | High | All flashcard launcher pathways | Cards now reserve fixed height on desktop/mobile and hover no longer translates card or arrow position. | CSS and source contract tests pass. | Needs paid browser run to capture real CLS artifact. |
| Badge width changed on selection | Badge text changed from `Add system` to `Selected` without reserved width. | Medium | All flashcard launcher pathways | Badge now reserves a minimum width and centers text. | `flashcard-session-stability.contract.test.ts` guards reserved width. | None known. |
| Border treatment could alter perceived card size | Component used one-pixel border. Selection/hover visual weight could read as card growth. | Medium | All flashcard launcher pathways | System cards now use constant `border-2`; selection changes color only. | Source contract passes. | None known. |
| Grid lacked a direct stability target | Playwright had no stable locator for the system grid dimensions. | Medium | E2E coverage | Added `data-nn-e2e-flashcards-system-grid`. | New Playwright test uses this locator. | Test execution requires paid QA auth. |

## Required Stability Rules Applied

Selected system cards no longer change:

- height
- width
- margin
- padding
- position

Selection changes only:

- background
- border color
- icon/checkmark state within a reserved slot
- text color

## Playwright Coverage Added

Updated:

- `tests/e2e/flashcards/launcher-restoration.spec.ts`

New test:

- `system selection does not shift the launcher grid`

The test:

1. Loads the flashcard launcher.
2. Records setup panel and system grid geometry.
3. Captures a before screenshot.
4. Selects, multi-selects, and deselects systems.
5. Toggles shuffle and session size controls.
6. Verifies no viewport jump.
7. Verifies launcher top, width, grid top, and grid height are unchanged.
8. Checks CLS is `< 0.01`.
9. Captures an after screenshot.

## Verification Run

Passed:

- `node --import tsx --test src/lib/flashcards/flashcard-session-stability.contract.test.ts src/lib/flashcards/flashcard-custom-session-response.test.ts src/lib/flashcards/flashcards-hub-system-selection.test.ts src/app/api/flashcards/custom-session-route.contract.test.mts`
- `npm run typecheck:critical`

Blocked:

- Paid Playwright execution for the new screenshot/CLS test.

Reason: the paid learning-routes Playwright config requires paid QA auth credentials before it will load.

## CLS Status

Target: `< 0.01`

Current status: automated CLS assertion has been added but the authenticated browser run is pending.
