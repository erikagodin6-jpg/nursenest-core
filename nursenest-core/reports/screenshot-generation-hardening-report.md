# Screenshot Generation Hardening Report

Generated: 2026-05-29

## What Changed

- Marketing screenshots now write `public/marketing/generated-screenshots/screenshot-validation-report.md` on every generation run.
- Assessment screenshots now write `marketing-assets/screenshots/screenshot-validation-report.md` on every generation run.
- Assessment screenshots now fail closed before capture when loading states, skeletons, spinners, suspense/status elements, auth redirects, or blank content are visible.
- Assessment captures now require route-specific visible content before saving:
  - Flashcards: deck/card content and controls; active card routes require prompt, answers, and controls.
  - CAT: question, timer, and controls.
  - Practice questions: question or bank content and controls.
  - Other learning surfaces: educational content and navigation/action controls.
- Failed/rejected captures now return a non-zero process exit so invalid assets cannot pass silently.

## Blocked States

The generators reject screenshots if any of these are visible in the DOM:

- Loading
- Just a moment
- Please wait
- Fetching
- Preparing
- Application error
- Something went wrong

The generators also reject visible loader selectors including skeleton classes, spinner classes, `aria-busy="true"`, `role="status"`, `data-loading="true"`, `animate-pulse`, and `animate-spin`.

## Current Marketing Asset Verification

`npm run ci:screenshot-governance` was run after the hardening changes.

Result: failed existing asset governance, unrelated to the new guards.

Current blockers:

- 16 required generated screenshots are missing from `public/marketing/generated-screenshots`.
- Existing `manifest.json` reports 5 failed captures.
- Existing captured screenshots that do exist have `qualityGate.passed: true`.

The current generated asset set should not be published until screenshots are regenerated with the hardened generator and the governance check passes.

## Verification Performed

- `npx tsx scripts/generate-assessment-screenshots.ts --list --category=flashcards --theme=ocean --viewport=desktop`
- `npx tsx scripts/generate-marketing-screenshots.ts --list --tier=allied`
- `npm run typecheck`
- `npm run ci:screenshot-governance`

