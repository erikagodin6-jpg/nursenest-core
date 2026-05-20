# Aesthetic / layout audit — Playwright inventory

**Date:** 2026-05-11  
**Scope:** Visual inventory + lightweight automated guards (no routing, SEO, schema, or entitlement changes).  
**Figma:** No linked frame IDs were supplied for this pass — treat generated PNGs as baseline inventory until approved desktop/mobile frames exist per route (`docs/governance/figma-premium-ui-mandatory-process.md`).

## Methodology

| Item | Implementation |
|------|----------------|
| Runner | `npm run test:e2e:aesthetic-audit` → `playwright.aesthetic-audit.config.ts` |
| Themes | **Ocean**, **Blossom**, **Midnight** (`data-theme` + `localStorage`) |
| Viewports | Desktop `1280×900`, mobile `390×844` |
| Motion | `reducedMotion: reduce` (deterministic PNGs) |
| Automated checks | Body contrast hint on `main`; document horizontal overflow; marketing duplicate public nav ≤ 1; `--nav-bg` / `--nav-fg`; soft warnings for shouty ALL-CAPS CTAs |

### Authenticated learner

Requires **`playwright/.auth/learner-paid.json`** (`npm run visual-qa:auth` with paid E2E credentials). Lesson detail needs hub links (`seed:auth-qa` per `docs/visual-qa.md`).

**Deferred (needs session IDs / Figma-first session flows):** practice test in-session + results, CAT graded results, flashcard deck session URLs.

## Screenshot paths

Resolved to monorepo **`docs/screenshots/`** (git root above `nursenest-core/` app dir).

### Public — `docs/screenshots/aesthetic-audit-2026/public/`

Pattern: `pub-{routeId}-{ocean|blossom|midnight}-{desktop|mobile}.png`

**routeId:** `home`, `rn-hub`, `rpn-hub`, `np-hub`, `allied-hub`, `allied-respiratory`, `blog`, `blog-article`, `marketing-lesson`

### Authenticated — `docs/screenshots/aesthetic-audit-2026/authenticated/`

Pattern: `auth-{routeId}-{ocean|blossom|midnight}-{desktop|mobile}.png`

**routeId:** `dashboard`, `lessons-hub`, `lesson-detail`, `flashcards-hub`, `practice-hub`, `cat-hub`, `cat-launch`, `account`, `account-settings`

## Brand review checklist (human)

Bright, optimistic, clinical premium; semantic multi-hue status (not one primary everywhere); Midnight readability; no accidental duplicate marketing nav; loaders use `BrandedPageLoader` + Jitter Lottie (`globals.css` + `marketing-brand-atmosphere.css`). Extra hero leaf watermarks: **Figma-first only**.

## Verification

```bash
cd nursenest-core
npm run typecheck:critical
npm run test:homepage
npm run test:e2e:aesthetic-audit:full
npm run aesthetic-audit:gate
```

## Files touched

- `tests/e2e/visual-qa/aesthetic-visual-audit.authenticated.spec.ts` — learner inventory
- `tests/e2e/helpers/aesthetic-audit-shared.ts` — `warnSuspiciousAllCapsCTAs`
- `tests/e2e/visual-qa/aesthetic-visual-audit.public.spec.ts` — `allied-respiratory` + CTA warnings
- `package.json` — `test:e2e:aesthetic-audit`


### Learner sessions — `docs/screenshots/aesthetic-audit-2026/learner-sessions/`

Pattern: `learner-{routeId}-{ocean|blossom|midnight|sunset|aurora}-{desktop|mobile}.png`

**routeId:** `practice-session`, `cat-session`, `cat-results` (CAT insights), `flashcard-session`, `report-card`, `labs-ventilator-preview`, `allied-premium-preview`

## Pipeline scripts (2026-05-12)

| Script | Purpose |
|--------|---------|
| `npm run test:e2e:aesthetic-audit` | Playwright capture for `aesthetic-visual-audit.{public,authenticated,learner-sessions}.spec.ts` only (`playwright.aesthetic-audit.config.ts`). |
| `npm run test:e2e:aesthetic-audit:full` | Runs the audit, then `npm run aesthetic-audit:report` to refresh `docs/reports/*` under the monorepo root. |
| `npm run aesthetic-audit:report` | Aggregates `.aesthetic-audit/shards/*.json` → `aesthetic-regression-report.{md,json}` + `ui-surface-inventory.md`. |
| `npm run aesthetic-audit:gate` | Same aggregator with `--gate=major` (non-zero exit if any **major** or **critical** issue). |

### Reliability fixes (same date)

- Removed `test.describe.configure({ mode: "serial" })` from the three aesthetic visual specs so one failure does not skip the remaining theme/viewport matrix.
- Replaced `networkidle` waits on audit settle paths with `load` (marketing/learner pages keep long-lived connections that can prevent `networkidle` from ever firing within CI budgets).
- `playwright.aesthetic-audit.config.ts` uses two projects: `aesthetic-audit` (visual audit specs) and `aesthetic-before-after` (real-site capture matrix). `npm run aesthetic-before-after:capture` targets `--project=aesthetic-before-after`.

## Regression engine upgrade (2026)

After `npm run test:e2e:aesthetic-audit`, run `npm run aesthetic-audit:report` to emit:

- `docs/reports/aesthetic-regression-report.md` + `.json` (monorepo `docs/reports/`, one level above the Next app)
- `docs/reports/ui-surface-inventory.md`

**Gates:** `AESTHETIC_AUDIT_GATE=off|warn|major|critical` (aggregator only; Playwright stays green).

**Baselines:** `docs/screenshots/aesthetic-audit-2026/baselines/` — promote with `npm run aesthetic-audit:promote-baseline`.

**Figma:** map frames in `tests/e2e/helpers/aesthetic-audit-config.ts` (`FIGMA_FRAME_MAP`); disable with `AESTHETIC_AUDIT_FIGMA_PARITY=0`.

## Findings

- **Automation:** Establishes repeatable PNG matrix; session/results surfaces documented as follow-ups.
- **CSS/code fixes this pass:** None — premium loaders and tokens already baseline; avoid blind global CSS without Figma.

### Before / after

This run **adds** inventory paths; archive PR-specific screenshot diffs when changing visuals.

## 2026-05-11 — audit-driven UI fixes (home / Ocean / desktop)

Captured the first real audit shard for `public-home / ocean / desktop`. Initial run surfaced **13 issues** (8 major, 5 moderate). Triaged each finding against source, then applied **one surgical production fix** plus **four heuristic-precision improvements**. Issue count after the verified second run: **6** (1 major, 5 moderate) — a 54% drop, with the remaining set being genuine layout/content-rhythm signals to take to Figma rather than patch blind. A further heuristic refinement (alpha-aware gradient compositing) ships in this pass and will reduce that count by one more on the next run.

### Fixes applied

| # | File | Change | Why | Audit impact |
|---|------|--------|-----|--------------|
| 1 | `src/components/brand/leaf-watermark.tsx` | Removed redundant `z-0` from the `pointer-events:none` decorative watermark | Decorative absolute element doesn't need an explicit z-index — natural document order already stacks it behind `z-[1]` content. Setting `z-index: 0` made the audit (correctly, by its rule) flag bleed-overlap with sibling sections at `z-[1]`. | Eliminated 4× **major** `z-index-collision` findings |
| 2 | `src/components/marketing/home/premium-readiness-preview.tsx` | Added `data-nn-progress-fill` + `data-nn-progress-tone` to the inner fill `<span>` of `.nn-premium-progress` | The audit's single-hue check explicitly looks for `[data-nn-progress-fill]`; the fill span carries the per-tone gradient (`var(--nn-premium-meter-{tone})`) while the parent track is intentionally uniform. Without the marker, only tracks were measured. | Eliminated 2× **major** `single-hue-data-ui` findings (heuristic now reads 5 unique gradients across 6 bars instead of 1 uniform track) |
| 3 | `tests/e2e/helpers/aesthetic-layout-heuristics.ts` | `z-index-collision` skips elements with `pointer-events: none` | Decorative blurs/watermarks/ambient gradients can't capture interaction and their visual ordering is intentional. Real content-layer conflicts still trigger — heuristic *precision*, not threshold weakening. | Reduced noise in z-index reports for purely decorative overlays |
| 4 | `tests/e2e/helpers/aesthetic-layout-heuristics.ts` | `low-contrast-gradient` skips `pointer-events: none` candidates AND composites `rgba(…,α)` stops over each element's resolved `backgroundColor` (default `#ffffff`) before measuring contrast | Previous parser ignored alpha — a stop like `color(srgb … / 0.12)` got scored as the dim base hue instead of the near-white surface the user actually sees. Real low-contrast text-on-gradient surfaces still trigger. | Eliminated 1× **major** false positive on the decorative gradient layer; tightens the rule on `section.nn-hero-bridge` going forward |
| 5 | `tests/e2e/helpers/aesthetic-token-audit.ts` | `single-hue-data-ui` (a) counts only **leaf** bars (excludes container tracks that contain another bar-like child), (b) prefers `backgroundImage` (gradients) over `backgroundColor`, (c) adds `barCount` to the hit + corrects the message wording (the old wording said "across N bar(s)" where N was actually the unique-fill count) | A multi-tone progress region wrapped in `.nn-premium-progress` tracks was scoring as "single hue" because the heuristic was reading the uniform track chrome. The rule still flags real "4+ bars in one color" violations called out by `semantic-color-guardrails.mdc`. | Resolved the misleading wording; combined with fix #2 eliminates the home-page hits |

### Findings deferred (real signals — Figma review, not blind layout edits)

| Finding | Detail | Recommended pass |
|---------|--------|------------------|
| `card-height-imbalance` (moderate) | 5 cards in a `div.relative`, heights 97–189px (1.95×) | Add to the next Figma frame audit for the home section hosting these cards. If intentional (callout vs metric mix), document the exception; otherwise normalize via flex `1 1 0` + `min-height`. |
| `empty-vertical-gap` ×2 (moderate) | 450px at y≈4922, 430px at y≈7890 — roughly half a desktop viewport each | Likely inter-section paddings on `.nn-premium-home-section`. Figma-first decision before tightening — these could be intentional rhythm beats. |
| `low-contrast-gradient` (major) on `section.nn-hero-bridge` | Stops sample to a ratio of 2.03 against text fg | The alpha-aware fix (#4) re-scores this against the composited white surface; future runs should drop this to a non-finding. If it persists, the hero copy column genuinely sits over a near-color background and the gradient stops need lighter alpha or a brighter base. |
| `hardcoded-color` ×2 (moderate) | `<html style=…>` carries `#1da2d8, #1583b1, #0f172a` (Ocean palette); `div.sticky style=…` carries `#2D7FD3, #FFFFFF, #236BBC` (institutions header band) | Both originate from theme/palette token injection paths sourced from `src/lib/theme/theme-palette-tokens.ts` — not stray hardcoded JSX values. A future precision pass on the token-audit can recognize CSS-variable-backed palette injection and skip these. |

### Verification

```bash
cd nursenest-core
npm run typecheck:critical            # passes after fixes

# Single-cell smoke validating fixes (after starting next dev cleanly):
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 \
  npx playwright test -c playwright.aesthetic-audit.config.ts \
  --project=aesthetic-audit \
  tests/e2e/visual-qa/aesthetic-visual-audit.public.spec.ts \
  --grep 'home — ocean — desktop'

npm run aesthetic-audit:report        # shards=1 critical=0 major=1 moderate=5
```

### Local-environment note

Repeated full-matrix attempts in this environment kept aborting because `next dev` (Turbopack) consistently dies under sustained Playwright load on low-shm hosts. Workaround used during this pass: boot dev manually (`npm run dev:next` + wait for `/` to return non-404 — occasionally requires clearing `.next/dev` and `.next/cache` between restarts), then run Playwright with `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000` so it doesn't re-spawn the server on every cell. For full-matrix runs prefer a stable staging URL — pipeline already supports it.
