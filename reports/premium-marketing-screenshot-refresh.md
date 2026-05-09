# Premium marketing screenshot / preview refresh

**Date:** 2026-05-09  
**Status:** Phase 1 audit + governance scaffolding + capture-script extensions (Phase 4–6 partial). **CDN PNG binaries and Figma boards are out of repo** — replace assets on DigitalOcean Spaces and attach exports when ready.

---

## Phase 1 — Audited locations (inventory)

### Canonical CDN screenshots (production marketing)

| Mechanism | Path / notes |
|-----------|----------------|
| **Registry (IDs 1–15)** | `nursenest-core/src/lib/marketing/screenshot-registry.ts` — `screenshot{id}.png` on `nursenest-images…` Spaces |
| **Groups** | `SCREENSHOT_GROUPS` — homepage hero order, pricing preview, FAQ/about, feature highlights |
| **Page routing** | `nursenest-core/src/lib/marketing/get-screenshots.ts` — `PAGE_SCREENSHOT_MAP`, `FAQ_VISUAL_QA` |

### Consumers (by surface)

| Surface | Implementation |
|---------|------------------|
| **Homepage hero carousel** | `home-hero-screenshot-section.tsx` + `config/home-hero-carousel.ts` (`HOME_HERO_PRIMARY_CAROUSEL_INDICES`) |
| **Homepage platform section** | `home-platform-preview-section.tsx` — **built UI mock**, not CDN raster |
| **Pricing — product preview grid** | `pricing-sections.tsx` → `ScreenshotProductCard` + registry IDs |
| **Pricing page client** | `pricing-page-client.tsx` — references screenshot sections |
| **FAQ — inline product shots** | `faq-product-screenshots-section.tsx` + `get-screenshots.ts` |
| **About** | `about-page-client.tsx` — `ScreenshotCarousel` |
| **Open Graph / Twitter** | `src/app/layout.tsx` — **`screenshot1.png`** as default share image |
| **Responsive WebP bundles** | `src/lib/marketing-assets.ts` / `marketing-assets.generated.ts` — CDN `screenshots/screenshot*_…-480w.webp` etc. |
| **Admin media QA** | `admin/media/screenshots` — lists registry for upload verification |

### Preview / capture pipelines (not production embeds)

| Script | Output |
|--------|--------|
| `nursenest-core/scripts/capture-ui-previews.mjs` | `nursenest-core/preview-screenshots/{desktop,tablet,mobile}/*.png` from `/preview/*` |
| `scripts/capture-screenshots.mjs` (repo root) | `screenshots/**` for Playwright capture → upload to Spaces |

### Other imagery

| Area | Notes |
|------|--------|
| Lesson marketing hubs | Lesson hero images via `lesson-image-map` / CDN clinical art — separate from product UI screenshots |
| Blog | Article assets from CMS/content pipeline |
| `preview-screenshots/prenursing/` | Legacy HTML wire previews — not live Next surfaces |

### Gaps vs desired ecosystem coverage

| Desired visual | Current state |
|----------------|---------------|
| **ECG learner surface** | No dedicated registry slot; marketing copy often illustrative. Add **new registry IDs (16+)** after capture + **extend `ScreenshotFeature`** |
| **Labs hub** | Capture target added to Playwright script (`/app/labs`); not yet a registry ID |
| **OSCE** | `/app/osce` may be blocked by feature flags — verify env before capture |
| **Med dosage** | Capture target added (`/app/med-calculations`) |
| **Theme variants (Ocean vs Midnight)** | **Preview script** now supports `UI_PREVIEW_THEMES=ocean,midnight`; CDN marketing shots are historically single-theme |

---

## Phase 2 — Figma (design owner)

**Not executed in-repo.** Recommended workflow:

1. Use existing `/preview/*` routes as **layout reference** or `figma-generate-design` skill for parity.
2. Export device frames at 1× and 2×; avoid hardcoded hex — map to semantic tokens doc.
3. For **production parity**, raster exports must still be **uploaded to Spaces** and referenced only via `screenshot-registry.ts`.

---

## Phase 3 — Implementation targets (when assets exist)

1. Upload new PNGs to Spaces preserving names `screenshot{n}.png` **or** register new IDs and update all groups + `layout.tsx` OG if changing default image.
2. Regenerate WebP derivatives if the build pipeline uses `marketing-assets.generated.ts` (follow existing asset generation docs/scripts).
3. Expand registry features for **labs**, **ecg**, **osce** as separate taxonomy entries.

---

## Phase 4–5 — Capture automation (changes made)

### `scripts/capture-screenshots.mjs` (repo root)

Added authenticated targets:

- `labs-hub-desktop` → `/app/labs`
- `med-calculations-hub-desktop` → `/app/med-calculations`

### `nursenest-core/scripts/capture-ui-previews.mjs`

- **`UI_PREVIEW_THEMES`** — e.g. `ocean,midnight` for theme-aware marketing captures; multi-theme adds `-theme` suffix to filenames.
- **`UI_PREVIEW_MIRROR_REPORTS=1`** — copies `preview-screenshots/` → `reports/ui-redesign-preview/`.

### Storage layout

- `reports/ui-redesign-preview/README.md` — describes mirror workflow.

---

## Phase 6 — Governance

| Check | Location |
|-------|----------|
| Unique IDs, contiguous 1..N, group validity, homepage hero permutation | `src/lib/marketing/screenshot-registry.contract.test.ts` |
| Included in CI bundle | `npm run test:homepage` |

**Manual / release checklist**

- [ ] Replace Spaces PNGs — spot-check in staging before prod.
- [ ] Update registry labels/alt when UI changes.
- [ ] Re-run `capture-screenshots.mjs` + upload for learner surfaces.
- [ ] Verify OG image in social debugger after changing `layout.tsx`.
- [ ] No admin-only or placeholder-heavy shots in registry.

---

## Phase 7 — Testing

| Command | Purpose |
|---------|---------|
| `npm run test:homepage` | Includes screenshot registry contracts |
| `npm run ui-preview:capture` | Full preview strip (long-running; starts dev server) |
| `node scripts/capture-screenshots.mjs` | Authenticated product captures (requires demo user seed + dev server) |
| Playwright E2E | Existing `tests/e2e/pricing/pricing-smoke.spec.ts` etc. — add visual asserts incrementally |

---

## Phase 8 — Reporting summary

| Item | Status |
|------|--------|
| Audited locations | This document |
| Screenshots replaced | **Pending** — binary assets on CDN |
| Screenshots generated | **Pending** — run capture scripts locally/CI |
| Figma boards | **Not linked** — design team |
| Theme variants | **Supported** in `capture-ui-previews` via env |
| Remaining outdated assets | **All** `screenshot1.png`–`15.png` until design signs off replacements |
| Mobile coverage | `capture-ui-previews` mobile viewport + dedicated mobile Playwright configs exist |

---

## Remaining product / ops questions

1. **OG default** — Should social preview remain `screenshot1` (practice rationale) or switch to a **dashboard/hero** composite after refresh?
2. **PN vs RN screenshot mix** — Pathway-specific captures may need separate registry groups for geo pages.
3. **OSCE / feature flags** — Standardize `SCREENSHOT_BASE_URL` staging env for consistent captures.

---

## Files touched in this scaffolding pass

- `nursenest-core/src/lib/marketing/screenshot-registry.contract.test.ts` (new)
- `nursenest-core/src/lib/marketing/screenshot-registry.ts` (governance comment)
- `nursenest-core/package.json` (`test:homepage` line)
- `scripts/capture-screenshots.mjs` (labs + med-calc targets)
- `nursenest-core/scripts/capture-ui-previews.mjs` (themes + mirror)
- `nursenest-core/preview-screenshots/README.md`
- `reports/ui-redesign-preview/README.md`
