# Screenshot Generation Hardening Audit

## Summary

Marketing screenshot generation now includes a pre-capture readiness gate in `scripts/generate-marketing-screenshots.ts`. A screenshot is captured only after the target page has completed route loading, required content selectors are visible, and blocked loading/error states are absent from the DOM.

The validator and CI governance scripts now also inspect the generated manifest for screenshot quality metadata. Captures without readiness evidence, or runs that contain capture errors, fail validation instead of silently publishing bad assets.

## Guardrails Added

- Wait for `domcontentloaded` and `load` before route-specific readiness checks.
- Prefer `data-loaded="true"` where present.
- Require surface-specific content selectors for lessons, flashcards, questions, CAT, clinical skills, pharmacology, ECG, and marketing pages.
- Reject captures containing blocked copy such as `Just a moment`, `Loading`, `Please wait`, `Fetching`, `Preparing`, `Application error`, or `Something went wrong`.
- Reject visible skeletons, spinners, loading classes, `aria-busy="true"`, status fallbacks, and pulse/spin loaders.
- Record `qualityGate` metadata for every successful capture in `public/marketing/generated-screenshots/manifest.json`.
- Fail `scripts/validate-marketing-screenshots.ts` and `scripts/ci-screenshot-governance-check.ts` when capture errors or missing quality gates are present.

## Invalid Screenshots Identified

| Target | Viewports | Rejection reason | Action |
| --- | --- | --- | --- |
| `marketing-home-desktop` | desktop, tablet, mobile | Visible skeleton markers were still present in the DOM. | Removed generated homepage screenshots and marked registry entry `needs-recapture`. |
| `pricing` | desktop, tablet | `Just a moment` and `Loading` copy were visible. | Removed generated pricing screenshots and marked registry entry `needs-recapture`. |

These rejected assets are no longer treated as current screenshots. `GENERATED_SCREENSHOT_PATHS` now resolves non-current generated entries to their approved fallback images so marketing pages do not publish broken, missing, or loading-state captures.

## New Screenshots Generated

The hardened generator successfully produced quality-gated replacements for:

- `marketing/faq.webp`
- `marketing/rn-marketing-hub.webp`
- `marketing/rn-questions-marketing.webp`
- `marketing/rn-lessons-marketing.webp`
- `marketing/pn-marketing-hub.webp`
- `marketing/np-marketing-hub.webp`
- `marketing/allied-marketing-hub.webp`
- `marketing/new-grad-marketing-hub.webp`

Each successful manifest entry includes readiness checks and blocked-state rejection metadata.

## Still Blocked

- Homepage generated screenshots require a clean recapture after the homepage no longer exposes skeleton markers at capture time.
- Pricing generated screenshots require a clean recapture after pricing no longer exposes loading fallback text at capture time.
- Authenticated learner activity screenshots still require seeded QA credentials and functioning learner routes before they can replace fallback assets.

## Validation Result

`npm run validate:marketing-screenshots -- --local-only` now fails intentionally while invalid or missing generated assets remain. The failure is expected and useful: it prevents loading-state screenshots from being accepted as publishable marketing imagery.

