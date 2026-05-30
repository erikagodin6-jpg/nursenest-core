# Legacy Image Eradication Report

**Pass:** Replacement-only wiring (no dual primary/fallback assets)  
**Date:** 2026-05-29  
**Status:** Code complete locally — production PASS pending deploy

## Summary

Legacy marketing screenshot **dual-state** has been removed from runtime wiring:

| Removed pattern | Replacement |
|-----------------|-------------|
| `GENERATED_SCREENSHOT_REGISTRY.path` + different `fallbackPath` | Single `path` per key |
| `GENERATED_SCREENSHOT_PATHS` choosing fallback when status ≠ current | Always `path` |
| `TierValueStage.screenshot` + `fallbackScreenshot` | Single `screenshot` |
| `MarketingProofShot.src` + `fallbackSrc` (core/theme swap) | Single `src`; theme variants only when capture exists |
| `ProofImage` / SI/CONV onError → alternate WebP | Direct `Image` with one src (+ hero SVG last-resort in proof component only) |
| Homepage hero chain always ending at CDN PNG/WebP | Local `homepage-screenshots` only when synced slots exist |

**Runtime `src/` references:** No `dashboard-redesign-preview` or `landing-polish-preview` paths remain.

## Surface-by-surface replacement

### Homepage hero carousel

| Old (legacy) | New (canonical) | Component | Page |
|--------------|-----------------|-----------|------|
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot{N}.png` | `/marketing/homepage-screenshots/screenshot{N}.webp` (+ width variants) | `MarketingHeroCarousel` via `getMarketingHeroImageUrlChain` | `/` |
| CDN `screenshot{N}-1200w.webp` etc. | Same local paths under `public/marketing/homepage-screenshots/` | `marketing-hero-image.ts` | `/` |

**Code:** `src/lib/marketing-hero-image.ts` — skips CDN/proxy PNG when local homepage slots are present.

### Pricing — tier value + SI/CONV

| Old | New | Component | Page |
|-----|-----|-----------|------|
| Missing tier paths (`rn/rn-hub.webp`, `rn/rn-cat-exam.webp`, …) with fallback to marketing/core | Single canonical WebP per stage | `TierValueExperience` | `/pricing` |
| Dual `fallbackScreenshot` on each stage | Removed | `tier-value-experience.ts` | `/pricing` |
| `coreFlashcards` primary + duplicate fallback | `/marketing/generated-screenshots/core/flashcards.webp` only | `SiConvClinicalReasoningSupport` | `/pricing` |

### Pathway hubs (RN, RPN, NP, Allied, New Grad)

| Old | New | Component | Page |
|-----|-----|-----------|------|
| Hub proof with `fallbackSrc` duplicate | `GENERATED_SCREENSHOT_PATHS.*MarketingHub` only | `MarketingPathwayHubProductPreview` | Region pathway marketing hubs |
| Missing `themes/ocean/ecg-workstation.webp` | `/marketing/generated-screenshots/core/ecg-workstation.webp` | `marketingProofFromCoreKey` | `/ecg-interpretation`, pricing showcase |

### Flagship / feature proofs (ECG, Labs, Med Math, Simulations, Analytics)

| Old | New | Component | Page |
|-----|-----|-----------|------|
| Theme variant → core fallback chain | One path: theme file if captured, else `core/` | `MarketingProofScreenshot` | `/pricing` showcase, `/` deep-dives |
| CSS-only mock previews | `FLAGSHIP_PROOF_SCREENSHOTS` generated WebPs | Pricing interactive cards | `/pricing` |

## Registry canonical paths (tier aliases collapsed)

Keys that previously pointed at **missing** tier captures now use the **production** asset:

| Registry key | Canonical path |
|--------------|----------------|
| `rnHub`, `rnMarketingHub` | `/marketing/generated-screenshots/marketing/rn-marketing-hub.webp` |
| `pnHub`, `pnMarketingHub` | `…/marketing/pn-marketing-hub.webp` |
| `npHub`, `npMarketingHub` | `…/marketing/np-marketing-hub.webp` |
| `alliedHub` | `…/marketing/allied-marketing-hub.webp` |
| `newGradHub` | `…/marketing/new-grad-marketing-hub.webp` |
| `rnCat` | `…/core/cat-exam-session.webp` |
| `pnCat` | `…/pn/pn-cat.webp` |
| `npCnple` | `…/np/np-cnple.webp` |
| `rnFlashcards`, `pnFlashcards`, `npFlashcards` | `…/core/flashcards.webp` |
| `npLoft` | `…/marketing/np-marketing-hub.webp` |
| `npAnalytics`, `newGradReadiness` | `…/core/confidence-analytics.webp` |

## Verification

### Local (green)

```bash
cd nursenest-core
node --import tsx --test \
  src/lib/marketing/generated-screenshot-registry.contract.test.ts \
  src/lib/marketing/marketing-proof-screenshots.contract.test.ts \
  src/lib/marketing/tier-value-experience.contract.test.ts
```

### Production (run after deploy)

```bash
PLAYWRIGHT_BASE_URL=https://nursenest.ca npm run verify:production:marketing-screenshots
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run test:e2e:production-screenshot-verification
```

**Expected after deploy:**

- Homepage carousel `img` src matches `/marketing/homepage-screenshots/` or `_next/image` decoding to those paths — **not** stale CDN `screenshot*.png`.
- Pricing tier images match repo SHA256 for `generated-screenshots/**/*.webp`.
- No `dashboard-redesign-preview` or `landing-polish-preview` in live HTML.

Evidence directory: `reports/production-screenshot-verification/`

## Fail conditions addressed in code

- [x] Dual registry path/fallbackPath removed
- [x] Tier value dual screenshots removed
- [x] Proof component dual WebP chain removed (SVG only as last resort)
- [x] Ocean ECG path fixed (`core/` not missing `themes/ocean/`)
- [x] Hero CDN skipped when local homepage slots exist (code — institutions/FAQ grids use same chain)
- [ ] Production institutions CDN rotation eliminated (**needs deploy** of `marketing-hero-image.ts`)
- [ ] Full 10/10 production verifier PASS (**8 PASS / 1 FAIL institutions / 1 WARN FAQ** as of 2026-05-30)

## Deploy checklist

1. Commit `src/lib/marketing/**`, `src/lib/marketing-hero-image.ts`, marketing components, and `public/marketing/**` assets.
2. Push to `main` and wait for DigitalOcean build.
3. Re-run production verification commands above.
4. Attach before/after PNGs from verifier to PR.
