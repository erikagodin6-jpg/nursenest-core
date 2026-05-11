# Figma Aesthetic Audit Recovery

## Status

A second-pass Figma refinement has been completed in response to review feedback that too many of the first generated mockups felt generic and that the lesson detail surface was too vertical.

This pass stayed Figma-only. No production routes, auth, entitlements, SEO, lesson APIs, pricing logic, or schema were modified.

## Figma File

- File key: `HUOBGapnVeXdmrexXLZESm`
- Pages updated in this pass:
  - `20 After - Public`
  - `21 After - Learner`

## What Changed In This Pass

### Public boards rebuilt from generic preview shells to route-specific compositions

The following boards were rebuilt as custom Figma layouts instead of relying on the earlier preview-shell screenshots:

- `Pricing v2` (`47:2`)
- `Blog Hub / Article v2` (`47:121`)
- `Allied Hub v2` (`47:192`)
- `Pre-Nursing Hub v2` (`47:297`)

### Learner boards rebuilt from route structure and study-flow primitives

The following boards were created as custom canonical Ocean layouts:

- `RN Dashboard v2` (`50:2`)
- `Mobile Dashboard v2` (`50:121`)
- `Lesson Detail v2 (compressed)` (`50:154`)
- `Flashcards Session v3` (`55:2`)
- `Practice Hub / CAT v2` (`50:305`)
- `Report Card v2` (`50:390`)

## Design Response To Review Feedback

### Generic boards

The first-pass mockups were visually clean but too close to reusable preview templates. This pass made the boards more route-specific by surfacing actual product structure:

- Pricing now shows segment switching, duration comparison, comparison rows, reassurance, and ecosystem proof.
- Dashboard now reflects priority band, readiness, countdown, quick launch, performance region, report preview, and mobile fold behavior.
- Flashcards now shows a full study loop: prompt, reveal/rationale, confidence controls, and linked next actions.
- Practice/CAT now reads as a real builder and CAT-first hub instead of a generic content card layout.
- Report card now feels like a progress narrative rather than a sparse analytics placeholder.
- Allied / pre-nursing now reflect pathway-specific organization rather than generic marketing cards.

### Flashcards needed a real answer flow

The flashcard board was revised again after review feedback that it still behaved too much like passive recall.

Changes in `Flashcards Session v3`:

- Reframed the surface as a multiple-choice question flow instead of a plain prompt card.
- Added explicit answer options and a `Submit answer` action.
- Moved the rationale into an after-answer reveal state instead of showing teaching copy immediately.
- Added a conditional media region so image-supported cards can expand when future assets exist without forcing a large empty image box into every text-only card.
- Kept confidence/progress in a secondary side rail so the question remains the dominant task.

### Lesson detail was too vertical

The lesson detail board was explicitly compressed.

Changes in `Lesson Detail v2 (compressed)`:

- Moved the study rail into a persistent right column.
- Replaced the long vertical module stack with denser two-column study cards.
- Kept the quick clinical summary, but reduced its dominance so the page does not feel footer-weighted.
- Tightened the hero and surfaced metadata/context earlier.

## Exported Review Assets

Exported to both:

- `preview-screenshots/aesthetic-audit-2026/`
- `reports/ui-redesign-preview/aesthetic-audit-2026/`

### New exported PNGs from this refinement pass

- `figma-refined-public-page.png`
- `figma-refined-learner-page.png`
- `figma-refined-pricing-v2.png`
- `figma-refined-dashboard-v2.png`
- `figma-refined-lesson-compressed-v2.png`
- `figma-refined-flashcards-v2.png`
- `figma-refined-flashcards-v3.png`
- `figma-refined-practice-cat-v2.png`
- `figma-refined-report-card-v2.png`

## Notes On Audit State

- These new exports are the review gate for the current refinement pass.
- The earlier theme-matrix and comparison assets still exist, but they were generated from the first-pass preview-shell mockups and should not be treated as the final aesthetic direction for the revised boards above.
- If this direction is approved, the next Figma-only step should be regenerating theme parity and comparison exports from these revised canonical boards before any further production implementation.

## Recommendation Before Implementation

Do not resume production UI implementation yet.

Review the newly exported refined boards first, with particular attention to:

- whether the lesson detail density now feels appropriately horizontal,
- whether the dashboard/report/practice boards feel sufficiently NurseNest-specific,
- which public boards still need another fidelity pass before sign-off.
