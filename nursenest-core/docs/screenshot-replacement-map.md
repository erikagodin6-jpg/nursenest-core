# Screenshot Replacement Map

**Purpose:** Every generated asset must have a production destination before capture.  
**Last updated:** 2026-05-30

| Current Asset (live today) | New Asset (repo) | Target Page | Target Section | Theme | Feature Represented |
|----------------------------|------------------|-------------|----------------|-------|---------------------|
| CDN `screenshot1.png` | `/marketing/homepage-screenshots/screenshot1.webp` ← `core/practice-rationale` | `/` | Hero carousel slide 1 | Ocean | Practice + rationale |
| CDN `screenshot2.png` | `screenshot2.webp` ← `themes/blossom/flashcards` | `/` | Hero carousel slide 2 | Blossom | Flashcards |
| CDN `screenshot6.png` | `screenshot6.webp` ← `core/cat-exam-session` | `/` | Hero carousel slide 6 | Midnight | CAT session |
| CDN `screenshot7.png` | `screenshot7.webp` ← `core/cat-results` | `/` | Hero carousel slide 7 | Midnight | CAT results |
| CDN `screenshot15.png` | `screenshot15.webp` ← `core/ecg-workstation` | `/` | Hero carousel slide 15 | Ocean | ECG workstation |
| CDN slots 3–14 | `screenshot{N}.webp` synced from core/theme variants | `/`, `/faq`, `/about`, `/for-institutions` | Carousels / grids | Mixed | Dashboard, lessons, analytics, etc. |
| (none on live) | `marketing/rn-marketing-hub.webp` | `/us/rn/nclex-rn` | `MarketingPathwayHubProductPreview` | Ocean | RN hub |
| (none on live) | `marketing/pn-marketing-hub.webp` | `/canada/pn/rex-pn` | Pathway hub proof | Ocean | RPN/PN hub |
| (none on live) | `marketing/np-marketing-hub.webp` | `/canada/np/cnple` | Pathway hub proof | Midnight | NP hub |
| (none on live) | `marketing/allied-marketing-hub.webp` | `/allied/allied-health` | Pathway hub proof | Ocean | Allied hub |
| (none on live) | `marketing/new-grad-marketing-hub.webp` | `/canada/new-grad` | Product proof band | Blossom | New Grad |
| (none on live) | `core/ecg-workstation.webp` | `/ecg-interpretation` | ECG product preview | Ocean | ECG |
| CDN / legacy PNG fallbacks | `core/*.webp` | `/pricing` | TierValueExperience stages | Mixed | Learn/practice/assess/remediate/master |
| CSS mock previews | `core/ecg-workstation.webp` etc. | `/pricing` | Interactive showcase cards | Ocean/Midnight/Blossom | ECG, labs, med math, analytics |
| CSS mock previews | `core/study-plan.webp`, `smart-review.webp`, `cat-results.webp` | `/` | Feature deep-dives | Blossom/Midnight | Study plan, review, CAT |
| CDN `screenshot1.png` | `screenshot1.webp` | `/pricing` | Product preview grid (practice) | Ocean | Rationale |
| CDN `screenshot6/7.png` | `screenshot6/7.webp` | `/pricing` | Product preview grid (CAT) | Midnight | CAT |

## Deployment dependency chain

1. **Build includes** `public/marketing/homepage-screenshots/**` and `public/marketing/generated-screenshots/**`
2. **App code includes** `getMarketingHeroImageUrlChain` local-first resolution + proof components
3. **CDN upload** (optional fallback path): refresh `screenshot1.png`…`screenshot15.png` on DigitalOcean Spaces
4. **Verify:** `npm run verify:production:marketing-screenshots` exits 0

## Not yet mapped (backlog)

| New Asset (to capture) | Target Page | Feature |
|----------------------|-------------|---------|
| NGN SATA/bowtie/matrix WebP | `/`, `/pricing`, RN hub | NGN formats |
| Simulation center WebP | `/clinical-scenarios`, pricing showcase | Simulations |
| Clearance / readiness WebP | `/app` marketing mirrors | Clearances |
| Med math dedicated WebP | Med math marketing route | Med Math |
| Labs workstation WebP | Labs marketing | Labs |
