# Marketing Screenshot Asset Audit

Generated: 2026-05-29

## Scope

Audited screenshot and product-image usage across the public marketing system:

- Homepage product carousel and proof sections
- Pricing product preview and tier value experience
- FAQ product screenshot accordions
- About and institutional feature blocks
- RN, RPN/PN, NP, Allied Health, and New Grad marketing hubs
- ECG screenshot slot in the registry
- Blog/SEO/image references that could overlap with screenshots

## Executive Summary

NurseNest already had a central CDN screenshot registry for the 15 primary product screenshot slots:

- `src/lib/marketing/screenshot-registry.ts`
- `src/lib/marketing/get-screenshots.ts`
- `src/components/marketing/screenshot-carousel.tsx`
- `src/components/marketing/screenshot-feature-grid.tsx`
- `src/components/marketing/marketing-screenshot-stack.tsx`

The audit found one gap: the newer Playwright-generated screenshot assets under `/marketing/generated-screenshots/` were required by the pricing tier value experience and governance scripts, but the directory did not exist. Pricing therefore relied heavily on old preview fallback PNGs.

This pass:

- Fixed the Playwright generator so theme application works before navigation.
- Generated current guest marketing screenshots for homepage, pricing, FAQ, RN, RN questions, RN lessons, RPN/PN, NP/CNPLE, Allied Health, and New Grad pages.
- Added `src/lib/marketing/generated-screenshot-registry.ts` as the central registry for generated local screenshots and fallback recommendations.
- Updated pricing tier value cards to use the newly generated tier/pathway screenshots where available.
- Updated the tier proof image component to use `next/image`.

Authenticated learner screenshots still require seeded QA credentials and a working learner DB fixture.

## Inventory

| Current image | Component | Pages used on | Status | Replacement recommendation |
|---|---|---:|---|---|
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png` | `MarketingHeroCarousel`, `ScreenshotFeatureBlock`, `FaqProductScreenshotsSection`, pricing preview | Home, Pricing, FAQ, About, Institutions | Current CDN slot | Keep as canonical CDN slot until approved replacement is uploaded. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot2.png` | `MarketingHeroCarousel` | Home, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot3.png` | `MarketingHeroCarousel`, FAQ/about groups | Home, FAQ, About | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot4.png` | `MarketingHeroCarousel` | Home, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot5.png` | `MarketingHeroCarousel`, results groups | Home, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot6.png` | `MarketingHeroCarousel`, pricing preview, FAQ, About | Home, Pricing, FAQ, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot7.png` | `MarketingHeroCarousel`, pricing preview, FAQ, About | Home, Pricing, FAQ, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot8.png` | `MarketingHeroCarousel`, About feature block | Home, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot9.png` | `MarketingHeroCarousel`, FAQ, About | Home, FAQ, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot10.png` | `MarketingHeroCarousel`, FAQ, About | Home, FAQ, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot11.png` | `MarketingHeroCarousel`, results/analytics groups | Home, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot12.png` | `MarketingHeroCarousel`, FAQ, About, Institutions | Home, FAQ, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot13.png` | `MarketingHeroCarousel`, Institutions | Home, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot14.png` | `MarketingHeroCarousel`, About, Institutions | Home, About, Institutions | Current CDN slot | Keep. |
| `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot15.png` | `MarketingHeroCarousel`, clinical readiness groups | Home, About, Institutions, ECG proof | Current CDN slot | Keep. |
| `/marketing/homepage-screenshots/screenshot{1,3,7,9,10}-{1200,768,480}w.webp` | `getMarketingHeroImageUrlChain` local optimized chain | Home and registry-driven screenshot frames | Current optimized local variants | Keep. Only five slots have local optimized variants today. |
| `/marketing/generated-screenshots/marketing/marketing-home-desktop.webp` | Generated screenshot registry | Audit/proof; available for future homepage proof cards | Current, newly generated | Use for homepage proof where local generated homepage capture is preferred. |
| `/marketing/generated-screenshots/marketing/pricing.webp` | Generated screenshot registry | Audit/proof; pricing page evidence | Current, newly generated | Use for pricing page proof blocks. |
| `/marketing/generated-screenshots/marketing/faq.webp` | Generated screenshot registry | Audit/proof; FAQ page evidence | Current, newly generated | Use for FAQ proof blocks. |
| `/marketing/generated-screenshots/marketing/rn-marketing-hub.webp` | `TierValueExperience` via generated registry | Pricing tier value, RN landing evidence | Current, newly generated | Replaces old dashboard fallback for RN Learn. |
| `/marketing/generated-screenshots/marketing/rn-questions-marketing.webp` | `TierValueExperience` via generated registry | Pricing tier value, RN questions evidence | Current, newly generated | Replaces old generic flashcard/dashboard fallback for RN Practice. |
| `/marketing/generated-screenshots/marketing/rn-lessons-marketing.webp` | Generated screenshot registry | RN lessons evidence | Current, newly generated | Use in feature proof blocks when lesson-specific marketing evidence is needed. |
| `/marketing/generated-screenshots/marketing/pn-marketing-hub.webp` | `TierValueExperience` via generated registry | Pricing tier value, RPN/PN landing evidence | Current, newly generated | Replaces old dashboard fallback for PN Learn/Practice. |
| `/marketing/generated-screenshots/marketing/np-marketing-hub.webp` | `TierValueExperience` via generated registry | Pricing tier value, NP/CNPLE landing evidence | Current, newly generated | Replaces old dashboard fallback for NP Learn/Practice/Assess until authenticated LOFT capture exists. |
| `/marketing/generated-screenshots/marketing/allied-marketing-hub.webp` | `TierValueExperience` via generated registry | Pricing tier value, Allied landing evidence | Current, newly generated | Replaces old dashboard fallback for Allied Learn. |
| `/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp` | `TierValueExperience` via generated registry | Pricing tier value, New Grad landing evidence | Current, newly generated | Replaces old dashboard fallback for New Grad Learn. |
| `/marketing/generated-screenshots/core/*.webp` | `TierValueExperience` via generated registry | Pricing tier value remediation/master/assessment surfaces | Missing authenticated capture | Generate with seeded QA account and keep registry paths. |
| `/marketing/generated-screenshots/rn/*.webp`, `/pn/*.webp`, `/np/*.webp`, `/allied/*.webp`, `/newgrad/*.webp` | Generated screenshot registry | Pricing tier value future learner-specific proof | Missing authenticated capture | Generate with `npm run generate:marketing-screenshots` after QA personas are seeded. |
| `/dashboard-redesign-preview/*.png` | Generated screenshot registry fallback | Pricing fallback only | Legacy fallback, still used where authenticated captures are missing | Keep until authenticated generated assets exist. Do not delete yet. |
| `/landing-polish-preview/png/*.png` | Generated screenshot registry fallback | Pricing fallback only | Legacy fallback, still used where authenticated captures are missing | Keep until authenticated generated assets exist. Do not delete yet. |

## Pages And Components

| Page | Screenshot source | Components | Result |
|---|---|---|---|
| Homepage `/` | CDN registry slots 1-15 plus local optimized variants for 1, 3, 7, 9, 10 | `HomeHeroScreenshotSection`, `MarketingHeroCarousel`, `MarketingScreenshotStack` | Current CDN registry remains canonical. New guest homepage capture exists at `/marketing/generated-screenshots/marketing/marketing-home-desktop.webp`. |
| Pricing `/pricing` | CDN pricing preview + generated tier value screenshots | `ProductPreviewGrid`, `ScreenshotProductCard`, `TierValueExperience` | Updated. Tier value uses generated RN/RPN/NP/Allied/New Grad marketing captures where available. |
| FAQ `/faq` | CDN FAQ visual QA screenshots + generated FAQ capture | `FaqProductScreenshotsSection` | Current registry-driven screenshots remain; generated FAQ page capture exists for proof/audit. |
| About `/about` | CDN screenshot registry | `ScreenshotCarousel`, `ScreenshotFeatureBlock` | Current; no hardcoded local preview images found. |
| Institutions `/for-institutions` | CDN screenshot registry | `MarketingForInstitutionsPremiumClient`, `ScreenshotTile`, `ScreenshotCarousel` | Current; no hardcoded local preview images found. |
| RN landing `/us/rn/nclex-rn` | New generated marketing capture | `GeneratedScreenshotRegistry`, pricing tier value | Current capture generated. |
| RN questions `/us/rn/nclex-rn/questions` | New generated marketing capture | `GeneratedScreenshotRegistry`, pricing tier value | Current capture generated. |
| RN lessons `/us/rn/nclex-rn/lessons` | New generated marketing capture | `GeneratedScreenshotRegistry` | Current capture generated. |
| RPN/PN `/canada/pn/rex-pn` | New generated marketing capture | `GeneratedScreenshotRegistry`, pricing tier value | Current capture generated. |
| NP/CNPLE `/canada/np/cnple` | New generated marketing capture | `GeneratedScreenshotRegistry`, pricing tier value | Current capture generated. |
| Allied `/allied/allied-health` | New generated marketing capture | `GeneratedScreenshotRegistry`, pricing tier value | Current capture generated. |
| New Grad `/canada/new-grad` | New generated marketing capture | `GeneratedScreenshotRegistry`, pricing tier value | Current capture generated. |
| ECG sections | CDN screenshot slot 15 | `MarketingHeroCarousel`, clinical readiness groups | Current CDN slot; no newer generated ECG asset present locally. |
| Blog feature sections | No marketing screenshot assets found in rendered marketing components; blog image workflow references are separate content images/tests | Blog serializers | No screenshot replacement needed in this pass. |

## Generated Assets Added

Created under `public/marketing/generated-screenshots/`:

- `marketing/marketing-home-desktop.webp` plus `1200w`, `768w`, `480w`
- `marketing/pricing.webp` plus `1200w`, `768w`, `480w`
- `marketing/faq.webp` plus `1200w`, `768w`, `480w`
- `marketing/rn-marketing-hub.webp` plus responsive variants
- `marketing/rn-questions-marketing.webp` plus responsive variants
- `marketing/rn-lessons-marketing.webp` plus responsive variants
- `marketing/pn-marketing-hub.webp` plus responsive variants
- `marketing/np-marketing-hub.webp` plus responsive variants
- `marketing/allied-marketing-hub.webp` plus responsive variants
- `marketing/new-grad-marketing-hub.webp` plus responsive variants
- Theme variants for homepage and pricing: Midnight, Blossom, Aurora, Sage Garden
- `manifest.json`

The `file` audit confirmed WebP dimensions at `1440x936`, `1200x780`, `768x499`, and `480x312` for the generated marketing captures.

## Files Updated

- `scripts/generate-marketing-screenshots.ts`
- `src/lib/marketing/generated-screenshot-registry.ts`
- `src/lib/marketing/generated-screenshot-registry.contract.test.ts`
- `src/lib/marketing/tier-value-experience.ts`
- `src/components/marketing/tier-value-experience.tsx`
- `docs/marketing-screenshot-validation-audit.md`
- `docs/marketing-screenshot-validation-audit.json`
- `docs/marketing-screenshot-asset-audit.md`

## Files Removed

None.

No screenshot assets were deleted because the legacy preview images are still active fallbacks for missing authenticated learner captures. Removing them now would create broken pricing proof images.

## Broken Reference Check

Passed for:

- Current generated screenshot registry paths
- All generated screenshot fallback paths
- Existing CDN registry integrity
- Existing governed marketing route coverage
- Existing 15-slot homepage screenshot registry

Remaining validation failures are not broken references in rendered pages; they are missing authenticated generated assets that require QA login credentials:

- `core/learner-dashboard.webp`
- `core/confidence-analytics.webp`
- `core/smart-review.webp`
- `core/cat-exam-session.webp`
- `core/flashcards.webp`
- `core/cat-results.webp`
- `rn/rn-hub.webp`
- `rn/rn-flashcards.webp`
- `rn/rn-cat-exam.webp`
- `rn/rn-readiness.webp`
- `pn/pn-hub.webp`
- `np/np-hub.webp`
- `np/np-loft-simulation.webp`
- `allied/allied-hub.webp`
- `newgrad/newgrad-hub.webp`
- `newgrad/newgrad-readiness.webp`

## Validation Evidence

Commands run:

- `npx tsx scripts/generate-marketing-screenshots.ts --tier=marketing --viewport=desktop`
- `npx tsx scripts/generate-marketing-screenshots.ts --tier=mobile`
- `npx tsx scripts/validate-marketing-screenshots.ts --local-only --output=docs/marketing-screenshot-validation-audit.json`
- `node --import tsx --test src/lib/marketing/generated-screenshot-registry.contract.test.ts src/lib/marketing/screenshot-registry.contract.test.ts src/lib/marketing/screenshot-governance.contract.test.ts`

Results:

- Guest marketing screenshot capture: 18 captured, 0 errors.
- Mobile capture: blocked because no QA paid/demo credentials are configured.
- Local validation: 14 pass, 15 warn, 16 fail. Failures are missing authenticated learner screenshots.
- Registry tests: 26 passed, 0 failed.

## Next Required Step

Seed or provide QA screenshot personas and rerun:

```bash
npm run generate:marketing-screenshots
npm run generate:marketing-screenshots:mobile
npm run validate:marketing-screenshots
```

After authenticated assets are generated and reviewed, the legacy fallback PNGs can be removed in a second pass.
