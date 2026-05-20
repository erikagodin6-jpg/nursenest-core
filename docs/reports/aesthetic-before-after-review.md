# Aesthetic before / after — real-site review

**Generated:** 2026-05-11T03:09:09.713Z

## Rules used in this pass

| Rule | Policy |
|------|--------|
| Before frames | Playwright full-page screenshots of the real NurseNest app (local/staging/prod per `PLAYWRIGHT_BASE_URL`). |
| After frames | **Always** produced from the matching before PNG via `sharp` — no stock templates, no invented pages. |
| `safe-readability-pass` | Mild global contrast/saturation — **CSS-token intent only**; safe to pilot behind review. |
| `document-only-banner` | **No fake layout mockup** — original capture + footer banner; **Figma** owns hierarchy/section/card reshaping. |

## Per-capture matrix

| Page | Route | Theme | Viewport | Severity | Mockup strategy | Figma required? | Impl. risk | Before | After | Compare |
|------|-------|-------|----------|----------|-----------------|-----------------|------------|--------|-------|---------|
| rt-hub | `/allied/respiratory` | midnight | desktop | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-rt-hub-midnight-desktop.png` | `docs/screenshots/aesthetic-before-after/after/after-rt-hub-midnight-desktop.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-rt-hub-midnight-desktop.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| rt-hub | `/allied/respiratory` | midnight | mobile | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-rt-hub-midnight-mobile.png` | `docs/screenshots/aesthetic-before-after/after/after-rt-hub-midnight-mobile.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-rt-hub-midnight-mobile.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| mlt-hub | `/allied/mlt` | ocean | desktop | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-mlt-hub-ocean-desktop.png` | `docs/screenshots/aesthetic-before-after/after/after-mlt-hub-ocean-desktop.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-mlt-hub-ocean-desktop.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| mlt-hub | `/allied/mlt` | ocean | mobile | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-mlt-hub-ocean-mobile.png` | `docs/screenshots/aesthetic-before-after/after/after-mlt-hub-ocean-mobile.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-mlt-hub-ocean-mobile.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| mlt-hub | `/allied/mlt` | blossom | desktop | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-mlt-hub-blossom-desktop.png` | `docs/screenshots/aesthetic-before-after/after/after-mlt-hub-blossom-desktop.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-mlt-hub-blossom-desktop.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| mlt-hub | `/allied/mlt` | blossom | mobile | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-mlt-hub-blossom-mobile.png` | `docs/screenshots/aesthetic-before-after/after/after-mlt-hub-blossom-mobile.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-mlt-hub-blossom-mobile.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| mlt-hub | `/allied/mlt` | midnight | desktop | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-mlt-hub-midnight-desktop.png` | `docs/screenshots/aesthetic-before-after/after/after-mlt-hub-midnight-desktop.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-mlt-hub-midnight-desktop.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| mlt-hub | `/allied/mlt` | midnight | mobile | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-mlt-hub-midnight-mobile.png` | `docs/screenshots/aesthetic-before-after/after/after-mlt-hub-midnight-mobile.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-mlt-hub-midnight-mobile.png` |
| | **Recommended changes** | | | | | | | Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme. **•** Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/(default)/allied/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Marketing capture — US region cookie; real DOM + branding. | | |
| | | | | | | | | | | |
| home | `/` | ocean | desktop | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-home-ocean-desktop.png` | `docs/screenshots/aesthetic-before-after/after/after-home-ocean-desktop.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-home-ocean-desktop.png` |
| | **Recommended changes** | | | | | | | PNG present on disk but missing from capture-manifest.json (interrupted or parallel capture). Re-run `npm run aesthetic-before-after:capture` for full heuristics. **•** Treat marketing spacing/hierarchy recommendations as Figma-first unless scoped to tokens only. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Inferred from filename — manifest row missing; metadata may be incomplete. | | |
| | | | | | | | | | | |
| home | `/` | ocean | mobile | moderate | document-only-banner | Yes | medium | `docs/screenshots/aesthetic-before-after/before/before-home-ocean-mobile.png` | `docs/screenshots/aesthetic-before-after/after/after-home-ocean-mobile.png` | `docs/screenshots/aesthetic-before-after/comparisons/compare-home-ocean-mobile.png` |
| | **Recommended changes** | | | | | | | PNG present on disk but missing from capture-manifest.json (interrupted or parallel capture). Re-run `npm run aesthetic-before-after:capture` for full heuristics. **•** Treat marketing spacing/hierarchy recommendations as Figma-first unless scoped to tokens only. | | |
| | **Likely files** | | | | | | | nursenest-core/src/app/(marketing)/**, nursenest-core/src/app/semantic-status-tokens.css | | |
| | **Notes** | | | | | | | Inferred from filename — manifest row missing; metadata may be incomplete. | | |
| | | | | | | | | | | |

## Implementation guidance (no code shipped in this task)

- **Safe to implement directly (still require design sign-off for copy):** token-only contrast tweaks, spacing scale alignment (`gap`/`padding` using existing tokens), fixing document overflow roots.
- **Figma approval first:** hero/section rhythm changes, card hierarchy restructures, new module entry treatments, report-card chart semantics beyond token swaps.

## Regenerate

```bash
cd nursenest-core
npm run aesthetic-before-after:capture
npm run aesthetic-before-after:build
```
