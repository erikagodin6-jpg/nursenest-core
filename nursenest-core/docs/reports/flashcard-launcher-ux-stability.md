# Flashcard Launcher UX Stability Report

Date: 2026-06-01

## Scope

Route: `/app/flashcards?pathwayId=ca-rn-nclex-rn`

Objective: remove low-value system-card status clutter and stabilize system selection so selected/unselected cards keep identical geometry.

## Fixes Applied

### Removed UI Clutter

- Removed the fallback `Available` label from system cards when counts are loading or degraded.
- Removed the fallback `Ready to study` status from zero-count cards.
- Removed the visible bottom status pill that displayed `Add system` or `Selected`.
- Kept the numeric count only when the count is reliable and greater than zero.
- Preserved screen-reader context through `aria-label` on the system-card button.

### Layout Stability

- Reserved the `Clear system picks` action slot permanently with an invisible disabled button when no systems are selected.
- Replaced dynamic selected-card content with a fixed-height hidden spacer.
- Removed Tailwind's broad `transition` utility from system cards.
- Locked system grid rows:
  - Desktop: `grid-auto-rows: 10.75rem`
  - Mobile: `grid-auto-rows: 9.5rem`
- Locked card dimensions with matching `height`, `min-height`, and `max-height`.
- Added `contain: layout` to the system actions and grid.
- Kept selected visual state to paint-only changes: border color, background, shadow, and checkmark icon.
- Confirmed CSS does not transition height, width, margin, or padding.

## Files Changed

- `src/components/flashcards/flashcards-hub-client.tsx`
- `src/app/learner-flashcard-layout-refinement-pass.css`
- `src/lib/flashcards/flashcard-launch-budget.test.ts`

## Verification

### Static / Contract Verification

Command:

```bash
node --import tsx --test src/lib/flashcards/flashcard-launch-budget.test.ts src/lib/flashcards/flashcards-hub-system-selection.test.ts
```

Result: PASS

Coverage:

- No visible `Available` label remains in the launcher system-card component.
- No visible `Ready to study` fallback remains in the launcher system-card component.
- No `nn-flashcards-system-card-v2__badge` status pill remains.
- Multi-system selection still adds and removes systems without replacing the full selection.
- System-card CSS reserves stable grid rows and stable card dimensions.
- Card transitions are restricted away from height, width, margin, and padding.

### Type Check

Command:

```bash
npx tsc --noEmit
```

Result: BLOCKED by existing repo-wide type errors outside this change set.

First unrelated examples:

- `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`
- `src/components/admin/admin-blog-control-panel-client.tsx`
- `src/lib/ecg-module/ecg-readiness-scoring.ts`

No TypeScript errors were reported for the flashcard files changed in this pass.

### Playwright / Screenshot Attempt

Command:

```bash
npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/launcher-restoration.spec.ts --project=chromium-paid -g "system selection does not shift the launcher grid"
```

Result: BLOCKED before browser launch.

Reason: the local shell does not have `E2E_PAID_EMAIL` and `E2E_PAID_PASSWORD`, and no paid Playwright storage state exists. The route is authenticated, so valid screenshots and runtime CLS measurements require the paid learner E2E auth setup.

Expected screenshot artifacts when credentials are available:

- `flashcard-launcher-before-selection.png`
- `flashcard-launcher-after-selection.png`

The existing Playwright spec already records:

- setup panel bounding box before/after selection
- system grid bounding box before/after selection
- viewport scroll position before/after selection
- cumulative layout shift via `PerformanceObserver`
- before/after screenshots

## CLS Measurement

Runtime CLS measurement is pending authenticated Playwright execution.

Code-level stability controls are in place:

- fixed card and row heights
- permanent action-row reservation
- no dynamic selected-card content
- no broad layout transitions
- layout containment on dynamic containers

Expected result after authenticated Playwright execution: `CLS < 0.01`.

## Pass / Fail

| Requirement | Status | Evidence |
| --- | --- | --- |
| Remove `Available` everywhere | PASS | `systemCountLabel` returns `null` for unreliable counts; contract test guards against visible `>Available<`. |
| Remove status badge / pill | PASS | `nn-flashcards-system-card-v2__badge` removed from component and CSS. |
| Preserve card alignment | PASS | Fixed card spacer and grid row sizing. |
| Selected/unselected dimensions identical | PASS | Card height, min-height, max-height, padding, and margin are unchanged by selection. |
| Selection visual only | PASS | Selection changes border, background, shadow, and checkmark icon only. |
| Reserve selected-system action space | PASS | Clear action remains mounted with invisible disabled state when inactive. |
| No scroll repositioning | PENDING RUNTIME | Requires authenticated Playwright run. Existing spec asserts `window.scrollY` unchanged. |
| CLS effectively 0 | PENDING RUNTIME | Requires authenticated Playwright run. Existing spec asserts CLS `< 0.01`. |
| Before/after screenshots | PENDING RUNTIME | Blocked by missing paid E2E credentials in this shell. |

## Remaining Risk

The implementation is structurally stable, but final visual proof should be captured in an environment with valid paid learner authentication. Once `E2E_PAID_EMAIL` and `E2E_PAID_PASSWORD` are available, rerun the focused Playwright command above and attach the two generated screenshots.
