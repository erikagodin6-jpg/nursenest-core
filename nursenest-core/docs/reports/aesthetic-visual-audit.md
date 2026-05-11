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
npm run test:e2e:aesthetic-audit
```

## Files touched

- `tests/e2e/visual-qa/aesthetic-visual-audit.authenticated.spec.ts` — learner inventory
- `tests/e2e/helpers/aesthetic-audit-shared.ts` — `warnSuspiciousAllCapsCTAs`
- `tests/e2e/visual-qa/aesthetic-visual-audit.public.spec.ts` — `allied-respiratory` + CTA warnings
- `package.json` — `test:e2e:aesthetic-audit`


### Learner sessions — `docs/screenshots/aesthetic-audit-2026/learner-sessions/`

Pattern: `learner-{routeId}-{ocean|blossom|midnight|sunset|aurora}-{desktop|mobile}.png`

**routeId:** `practice-session`, `cat-session`, `cat-results` (CAT insights), `flashcard-session`, `report-card`, `labs-ventilator-preview`, `allied-premium-preview`

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
