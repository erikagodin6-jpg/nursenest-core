# Homepage Mobile Runtime Stabilization — 2026-05-11

## Summary

Mobile-focused analysis of the NurseNest marketing homepage performance. This report covers mobile-specific findings from the same stabilization pass as the desktop report. Same files changed; mobile considerations noted explicitly.

---

## Files Changed

Same as desktop report — changes benefit both desktop and mobile:

| File | Change | Mobile Impact |
|---|---|---|
| `src/components/marketing/home-restored-client.tsx` | `ssr: false` on screenshot carousel | High — carousel is the heaviest hydration on mobile |
| `src/components/marketing/home/premium-homepage-hero.tsx` | Hoisted ECG path | Low — but eliminates unnecessary computation on slower mobile CPUs |
| `src/lib/marketing/public-home-stats.ts` | `server-only` guard | Safety — prevents Prisma bundle contamination on any platform |
| `src/lib/marketing/homepage-pagespeed-performance.contract.test.ts` | +4 contract tests | Regression prevention |

---

## Mobile Before/After Findings

### Mobile TBT Hotspot 1: Screenshot Carousel Full Hydration (FIXED)

**Before:**
- `HomeHeroScreenshotSectionLazy` was SSR'd and hydrated on mobile.
- On mobile (slower CPUs), the carousel's 8+ `useEffect` hooks + `setInterval` + `requestIdleCallback` polyfill ran synchronously during the hydration burst.
- Mobile main thread was blocked for the full carousel reconciliation.

**After:**
- `ssr: false` — skeleton shows, carousel loads async after mount.
- The `MarketingHeroCarouselMobileLite` path (single slide, no autoplay, no dots) is still used for mobile viewports detected via `useMarketingMobilePerfIsMobile`. However, the hydration reduction from `ssr: false` is real regardless of which variant renders.
- Mobile users see the skeleton → carousel loads → single-slide lite variant mounts.

### Mobile TBT Hotspot 2: Mobile Lite Carousel (Already Optimal)

**Already in place:**
- `MarketingHeroCarouselMobileLite` — single slide, no autoplay, no dot navigation, no cross-slide state.
- Detected via `useMarketingMobilePerfIsMobile` which reads the `MARKETING_NARROW_VIEWPORT_HINT_HEADER` set by the proxy for narrow viewports.
- Mobile gets the significantly lighter carousel path once the chunk loads.

### Mobile Layout Stability (CLS)

**Already in place:**
- Hero geometry locked: `nn-premium-hero-grid` with `min-height: clamp(...)`.
- Section `min-height` on `.nn-premium-home-section`.
- Screenshot carousel skeleton has `min-h-[min(24rem,calc(100vw*0.72+6rem))]` and `aspect-[4/3]` to hold geometry before carousel loads.
- Header `min-height` reserved in CSS before hydration.
- `contain-intrinsic-size: auto clamp(34rem, 82vw, 54rem)` on sections.
- Mobile CLS smoke test: `homepage-pagespeed-stability.spec.ts` verifies CLS < 0.05 strict (mobile) and CLS < 0.1 with layout landmarks.

### Mobile Bundle Composition

**Below-fold sections (8 dynamic chunks):** All below-fold premium sections are already dynamic-imported and separated into individual JS chunks. On mobile, these load after the initial render.

**`content-visibility: auto` on mobile:** The CSS at `.nn-home-marketing-root .nn-premium-home-section` uses `content-visibility: auto` with `contain-intrinsic-size: auto clamp(34rem, 82vw, 54rem)` on mobile. This means the browser skips paint AND layout for sections not yet in the viewport — the biggest CSS-level win for mobile scrolling performance.

**Mobile motion shell (`MarketingMobileMotionShell`):** Already uses `dynamic({ ssr: false })` for the Framer `PageTransitionShell`, keeping heavy motion libraries off the mobile initial bundle.

---

## What Was Already Good (Mobile-Specific)

| Pattern | Status |
|---|---|
| Narrow viewport hint set by proxy before hydration | ✓ Already in place |
| Mobile lite carousel variant (no autoplay/setInterval) | ✓ Already in place |
| Framer page transitions deferred (`ssr: false`) | ✓ Already in place |
| Mobile CLS contract tests (< 0.05 and < 0.1) | ✓ Already in `homepage-pagespeed-stability.spec.ts` |
| Header height reserved before hydration | ✓ Already in CSS |
| `content-visibility: auto` (mobile breakpoint) | ✓ Already in CSS |
| Mobile overflow assertions | ✓ Already in `homepage-pagespeed-stability.spec.ts` |
| `min-height` on hero grid (prevents CLS from stats line loading) | ✓ Already in CSS |

---

## Tests Run

```
npm run test:homepage       → 100/100 pass
npm run typecheck:critical  → 0 errors
npm run audit:large-client-components → exit 0
```

Playwright mobile tests (run locally):
- `homepage-pagespeed-stability.spec.ts` — CLS < 0.05 strict (mobile 390px) ✓
- `homepage-first-paint.spec.ts` — cold load mobile pass ✓
- `homepage-desktop-performance-smoke.spec.ts` — CLS < 0.1 desktop 1440px ✓

---

## Unresolved Mobile Risks

### Risk 1: Mobile Drawer Hydration Cost
- The mobile menu drawer logic lives inside `site-header.tsx` (1255 lines).
- The drawer is only shown when the menu button is clicked, but its HTML is hydrated unconditionally on mount.
- **Not changed**: Isolating the drawer into a `dynamic({ ssr: false })` component would reduce mobile initial hydration. Flagged for next pass.

### Risk 2: Above-Fold Hero Is a Client Component
- `PremiumHomepageHero` is `"use client"` and mounts on the main thread immediately.
- It uses `useMarketingI18n` and `useNursenestRegion` (context hooks) + `MarketingTrackedLink`.
- On mobile (6x CPU throttling), this adds to TBT.
- **Partial mitigation**: It has no `useState`, no `useEffect`, no browser APIs — just context lookups and pure rendering. Hydration is fast compared to the carousel.

### Risk 3: All 8 Below-Fold Chunks Load on Mount
- The 8 `dynamic()` imports in `HomeRestoredClient` begin downloading immediately when the client mounts.
- On slow mobile connections (3G), this can create a download queue that delays TTI.
- **Mitigation available**: IntersectionObserver-based deferred chunk loading — load each section's chunk only when it approaches the viewport.

### Risk 4: `usePremiumHomepageRoutes` Called 5× per Page Load
- The hook runs in: `PremiumPathwayShowcase`, `PremiumStudyEcosystem`, `PremiumSocialStudy`, `PremiumReadinessPreview`, `PremiumHomepageEcg`, `PremiumHomepageCta`.
- Each instance calls `withMarketingLocale()` + `publicExamPrepHubDestinations()` inside `useMemo`.
- On mobile with slower CPUs, this multiplied memo computation is visible in profiles.

---

## Next Mobile Optimization Opportunities (Ranked by Impact)

1. **Convert `PremiumClinicalDepth` + `PremiumHomepageTrust` to RSC** — Both are purely static with no browser APIs. Pass pre-computed i18n strings from server. Eliminates 2 client subtrees entirely from mobile hydration. **Highest impact**.

2. **Isolate mobile drawer into `dynamic({ ssr: false })`** — The drawer is interaction-gated; no reason to hydrate it on initial paint. Reduces mobile `SiteHeader` hydration cost.

3. **Intersection Observer for below-fold chunk loading** — Load the 8 section chunks only as they approach the viewport. Critical path becomes only hero + header on mobile.

4. **Shared `PremiumHomepageRoutes` context provider** — Compute routes once at the `HomeRestoredClient` level and pass via context. Eliminates 5× `useMemo` recomputation.

5. **Mobile-first image loading for hero carousel** — The `MarketingHeroCarouselMobileLite` already uses `loading="lazy"` for below-fold sections. Verify `fetchPriority="low"` is set for non-hero images.

6. **Lighthouse mobile CI contract** — Add a `test:e2e:mobile-lighthouse` script targeting the Railway preview URL, gating on TBT < 600ms and CLS < 0.1.
