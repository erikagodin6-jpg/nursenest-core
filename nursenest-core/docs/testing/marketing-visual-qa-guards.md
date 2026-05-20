# Marketing visual / copy QA guards (Playwright)

Automated **non-screenshot** checks for public marketing pages. They catch placeholder copy, basic heading capitalization issues, document-level horizontal overflow, primary CTA `href` shapes, and a pragmatic dark-theme contrast signal for the homepage hero.

## What is covered

| Guard | Scope | Notes |
| --- | --- | --- |
| Placeholder / junk copy | `main` innerText | Blocks substrings like `lorem ipsum`, `placeholder`, `{{`, leaked `pages.*` / `marketing.*` keys, `undefined` / `null` tokens |
| Capitalization heuristics | `main h1`, `main h2` | Flags all-lowercase **multi-word** headings and extreme mixed-case chaos (conservative thresholds). See false positives below |
| Horizontal overflow | `document.documentElement` | Per viewport: `scrollWidth <= clientWidth + 1` |
| Homepage hero CTAs | `.nn-home-marketing-rich-hero` links | Primary → path contains `question-bank`; secondary → `/lessons` |
| Final CTA | `[data-testid="premium-final-cta-primary|secondary"]` | Primary → `/signup`; secondary → `/pricing` (querystrings allowed) |
| Dark (Midnight) | Theme picker → Midnight | Asserts hero `#home-conversion-hero-heading` computed color is not collapsed against section background |

## Routes

Default suite (`tests/e2e/public/marketing-visual-qa-guard.spec.ts`):

- `/` — all guards (including homepage-only CTAs + dark test)
- `/pricing`, `/blog` — shared guards only (copy, headings, overflow)

## Commands

From `nursenest-core/`:

```bash
npm run typecheck:critical
npm run test:homepage
```

Playwright (requires a **running** server; default `BASE_URL=http://localhost:3000`):

```bash
npm run build && npm run start
# other terminal:
npx playwright test tests/e2e/public/marketing-visual-qa-guard.spec.ts --project=chromium
```

The repo root `playwright.config.ts` does **not** start `webServer` automatically — use `build` + `start` (or `next dev`) locally/CI as your pipeline already does for other e2e targets.

## Limitations

1. **Capitalization** — Intentional sentence-style or brand-lowercase titles may trip the multi-word all-lowercase heuristic. Review failures before “fixing” copy.
2. **Placeholder scan** — Very rare legitimate words containing `placeholder` as a substring could match.
3. **Overflow** — Measures the document root; inner panels with `overflow-x-auto` can hide wide content without increasing `documentElement.scrollWidth`.
4. **Dark mode** — The suite prefers the real **Midnight** theme via the header theme picker (`data-theme="midnight"`). `prefers-color-scheme: dark` / `emulateMedia({ colorScheme: 'dark' })` does **not** switch NurseNest palettes by itself; if the picker is unavailable (e.g. layout experiment), the dark test **skips** rather than asserting a misleading signal.

## Source helpers

- `tests/e2e/helpers/marketing-qa.ts` — shared assertions
