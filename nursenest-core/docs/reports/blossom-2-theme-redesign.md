# Blossom 2.0 Theme Redesign — Cherry Blossom

Date: 2026-06-01

## Verdict

Implemented. The existing `blossom` theme was redesigned in place. No new theme id was created, and saved `blossom` preferences continue to resolve to the upgraded Cherry Blossom palette.

## Color Tokens

| Token | Value | Usage |
| --- | ---: | --- |
| `--blossom-primary` | `#ff5f9e` | Primary brand, CTA surfaces, completion/accent states |
| `--blossom-secondary` | `#ff8ab5` | Rose secondary accents |
| `--blossom-surface` | `#fff2f6` | Soft blush surface tint |
| `--blossom-accent-blue` | `#74d0f4` | Strong/clinical progress and report card accent |
| `--blossom-accent-yellow` | `#ffd95a` | Needs-review and achievement accent |
| `--blossom-accent-peach` | `#ffb56b` | In-progress and warm study accent |

The theme remains white-first: page/surface/card tokens are white or near-white, with blush used only as a low-strength tint and the stronger colors reserved for progress, icon, CTA, and status accents.

## Implementation Coverage

| Surface | Change |
| --- | --- |
| Navigation | Blossom nav, brand lockup, header surfaces, hover states, and CTA tokens now use Cherry Blossom semantic colors. |
| Dashboard / report cards | Semantic chart tokens rotate through pink, peach, yellow, and blue for stat cards and progress indicators. |
| Lessons | Lesson section tint tokens now use soft blush, sky, peach, and yellow while reading surfaces stay white. |
| Flashcards | Flashcard hub/session accents inherit the updated semantic brand, chart, and progress tokens. |
| CAT and practice | Exam/practice progress classes inherit the Blossom multi-color progress treatment. |
| Pricing | Pricing plan cards and premium highlights inherit updated chart tokens and softer Cherry Blossom shadows. |
| Buttons | Primary CTA background uses `#ff5f9e`; foreground uses deep plum for WCAG contrast. Secondary buttons remain white with pink borders. |

## Files Changed

- `src/app/theme-palettes.css`
- `src/app/semantic-status-tokens.css`
- `src/app/color-roles.css`
- `src/lib/theme/theme-palette-tokens.ts`
- `src/lib/theme/theme-registry.ts`
- `src/lib/ui/themes/clinical-theme-tokens.ts`
- `src/app/premium-redesign-2026.css`
- `src/app/styles/marketing/footer-seo.css`
- `src/app/styles/marketing/blossom-mint-polish.css`
- `src/app/styles/marketing/theme-overrides.css`
- `src/app/learner-flashcard-premium.css`
- `tests/contracts/blossom-multicolor.contract.test.ts`
- `reports/blossom-2-theme-redesign/capture-blossom-preview.mjs`

## Accessibility Verification

The requested primary pink fails AA with white text for normal-sized UI labels, so the interactive foreground token was set to deep plum while preserving the requested `#ff5f9e` primary surface.

| Pair | Contrast | Result |
| --- | ---: | --- |
| Deep plum `#391226` on primary pink `#ff5f9e` | 5.73:1 | Pass |
| Deep plum `#391226` on hover pink `#ff4f97` | 5.29:1 | Pass |
| Heading `#391226` on page bg `#fffafd` | 15.79:1 | Pass |
| Body `#4b3340` on white | 11.37:1 | Pass |
| Muted text `#775568` on white | 6.40:1 | Pass |
| Secondary CTA text `#9d174d` on white | 7.88:1 | Pass |
| Blue contrast `#075985` on soft sky | 6.88:1 | Pass |
| Warning contrast `#6f4f00` on soft yellow | 6.99:1 | Pass |

## Screenshot Evidence

Before references from the existing visual audit library:

- `preview-screenshots/aesthetic-audit-2026/desktop/dashboard-blossom.png`
- `preview-screenshots/aesthetic-audit-2026/desktop/lesson-blossom.png`
- `preview-screenshots/aesthetic-audit-2026/desktop/flashcards-blossom.png`
- `preview-screenshots/aesthetic-audit-2026/desktop/cat-blossom.png`
- `preview-screenshots/aesthetic-audit-2026/desktop/practice-tests-blossom.png`
- `preview-screenshots/aesthetic-audit-2026/desktop/report-cards-blossom.png`
- `preview-screenshots/aesthetic-audit-2026/desktop/pricing-blossom.png`

After token preview captures:

- `reports/blossom-2-theme-redesign/after-desktop.png`
- `reports/blossom-2-theme-redesign/after-mobile.png`

## Validation

- `git diff --check` passed for all changed Blossom files.
- `npx eslint src/lib/theme/theme-palette-tokens.ts src/lib/theme/theme-registry.ts src/lib/ui/themes/clinical-theme-tokens.ts` passed.
- `npx eslint src/lib/theme/theme-palette-tokens.ts src/lib/theme/theme-registry.ts src/lib/ui/themes/clinical-theme-tokens.ts tests/contracts/blossom-multicolor.contract.test.ts` passed.
- `npx tsx --test tests/contracts/blossom-multicolor.contract.test.ts tests/contracts/blossom-header-brand.contract.test.ts` passed: 24 tests, 0 failures.
- Screenshot capture completed via `reports/blossom-2-theme-redesign/capture-blossom-preview.mjs`.

## Notes

- This pass intentionally avoids layout, typography, spacing, route, entitlement, and learner behavior changes.
- The implementation updates the existing `blossom` theme only. `mint-blossom` remains mapped to Sea Glass by the existing migration logic and was not reintroduced as a theme.
