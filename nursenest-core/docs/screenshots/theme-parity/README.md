# Marketing homepage — theme parity baselines

Visual parity release gate for the canonical marketing header layout
(`[data-nn-header-layout="marketing-row4"]`) on `/` across the three approved
marketing themes.

## Purpose

Ocean is the canonical **structural** theme. Blossom and Midnight are
**color-only** variants — they may differ from Ocean only in colors,
gradients, shadows, borders, opacity, and hover/focus states. They must
**not** differ in structural CSS (`display`, `flex-direction`, `flex-wrap`,
`grid-template-*`, `width` / `max-width` / `min-width`, spacing rhythm that
shifts layout, responsive breakpoints, or DOM/row ordering).

Two gates enforce this contract:

1. **Static guard** (always-on, fast):
   `tests/contracts/theme-marketing-row4-contract.test.ts` scans
   `src/app/premium-redesign-2026.css` and fails on any forbidden structural
   override inside a Blossom or Midnight rule scoped to `marketing-row4` or
   its known descendants.
2. **Visual parity gate** (manual / preview / CI screenshots): the Playwright
   spec `tests/e2e/visual/theme-parity/homepage-theme-parity.spec.ts`
   captures the homepage at desktop and mobile in each of the three themes.
   Maintainers regenerate these PNGs and visually compare them before
   shipping marketing-header or theme changes.

## Expected output PNGs (6)

Captured by the Playwright spec into this folder:

- `home-ocean-1440x900-full.png`
- `home-blossom-1440x900-full.png`
- `home-midnight-1440x900-full.png`
- `home-ocean-390x844-full.png`
- `home-blossom-390x844-full.png`
- `home-midnight-390x844-full.png`

Naming pattern: `home-<theme>-<width>x<height>-full.png`.

## How to regenerate

From the package root (`nursenest-core/`), pointing at any reachable preview
or local URL — **do not** rely on Playwright's bundled `webServer` config in
this environment, it has hit the 300s start-up timeout. Use a preview
deployment or a separately-started local server:

```bash
cd nursenest-core
BASE_URL=<preview-or-local-url> \
  PLAYWRIGHT_SKIP_WEB_SERVER=1 \
  npx playwright test \
    tests/e2e/visual/theme-parity/homepage-theme-parity.spec.ts \
    --project=chromium
```

The spec writes screenshots to this directory (created on demand) using
`fs.mkdirSync(SHOT_DIR, { recursive: true })`.

## When to regenerate

Regenerate **before shipping** any change that could affect the canonical
marketing header layout or its themed variants — including but not limited
to:

- `src/components/layout/site-header.tsx`
- `src/app/premium-redesign-2026.css` (especially `marketing-row4` blocks)
- `src/app/theme-palettes.css`
- Any new `[data-theme="…"]` block that participates in marketing surfaces.

Visually compare the new desktop and mobile sets across all three themes:

- Header height, row count, and row ordering must match.
- Logo + wordmark spacing must match.
- Tier rail chip rhythm and alignment must match.
- All utility controls (theme picker, region selector, auth CTAs) must
  remain visible.
- Only color, gradient, shadow, border, opacity, and hover/focus state may
  differ.

If anything structural diverges, fix the offending CSS — do **not** update
the baselines around the regression.

## Static guard quick-run

The fast static guard runs without a browser:

```bash
cd nursenest-core
node --import tsx --test tests/contracts/theme-marketing-row4-contract.test.ts
# or via the wired script:
npm run test:unit:theme-contract
```

A failure prints each violation grouped by selector and property, plus the
escape-hatch instructions.
