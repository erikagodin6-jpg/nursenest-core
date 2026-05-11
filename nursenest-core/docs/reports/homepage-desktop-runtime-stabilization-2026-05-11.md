# Homepage Desktop Runtime Stabilization — 2026-05-11

## Summary

A targeted desktop-focused performance hardening pass on the NurseNest marketing homepage. No visual redesign, no route changes, no SEO/i18n/Stripe/auth changes.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/marketing/home-restored-client.tsx` | Added `ssr: false` to `HomeHeroScreenshotSectionLazy` |
| `src/components/marketing/home/premium-homepage-hero.tsx` | Hoisted ECG SVG path to module-level constants |
| `src/lib/marketing/public-home-stats.ts` | Added `server-only` guard |
| `src/lib/marketing/homepage-pagespeed-performance.contract.test.ts` | Added 4 new TBT/hydration/server-isolation contract tests |

---

## Desktop Before/After Findings

### TBT Hotspot 1: Screenshot Carousel SSR Reconciliation (FIXED)

**Before:**
- `HomeHeroScreenshotSectionLazy` (below-fold screenshot carousel) was SSR'd by default.
- On hydration, React had to reconcile the full carousel HTML including 8+ `useEffect` hooks, `setInterval` autoplay timer, image tier state, mouse hover state, and dot navigation.
- This caused a hydration task spike immediately after the initial render.

**After:**
- `ssr: false` added to `HomeHeroScreenshotSectionLazy`.
- Server renders the lightweight skeleton (`HomeHeroScreenshotSectionSkeleton`) instead of the full carousel HTML.
- Client shows the skeleton until the carousel chunk loads, then mounts it fresh (no reconciliation).
- Eliminates the most expensive hydration task from the above-fold budget.
- **CLS risk mitigated**: skeleton preserves identical geometry (`nn-home-hero-product-band`, matching padding vars, `min-h-[min(24rem,...)]`, `aspect-[4/3]`).
- `homepage-first-paint.spec.ts` already handles this with `home-hero-screenshot-section-skeleton` fallback selector.

### TBT Hotspot 2: ECG Path Recomputed on Every Hero Render (FIXED)

**Before:**
- `buildSinusRhythmPath(3, 138, 46)` was called inside `MarketingHomepageEcgStripIllustration` on every component render.
- The function runs pure math and string concatenation across 3 beat cycles × 15 path segments each.

**After:**
- Path is computed once at module load time (`const _ECG_PATH = buildSinusRhythmPath(...)`).
- View box width also hoisted (`const _ECG_VIEWBOX_W = ...`).
- Eliminates redundant computation on every hero render and every hydration re-render.

### TBT Hotspot 3: Prisma Stats Module Without Server Guard (FIXED)

**Before:**
- `src/lib/marketing/public-home-stats.ts` imported `@prisma/client` and `next/cache` with no `server-only` guard.
- If accidentally imported client-side (e.g. via a bad import chain), it would attempt to pull Prisma into the browser bundle — a silent build-time contamination risk.

**After:**
- `import "server-only"` added as the first line.
- Next.js build will now throw a build-time error if this module is ever imported from a client component or client-bound import chain.
- Belt-and-suspenders: the parent server component `home-restored-with-deferred-stats.server.tsx` already had `server-only`, but this guards the module directly.

---

## What Was Already Good (No Change Needed)

| Pattern | Status |
|---|---|
| `content-visibility: auto` on below-fold sections | ✓ Already in CSS |
| `dynamic()` imports for all 8 below-fold sections | ✓ Already in place |
| `ssr: false` for analytics beacon (`FunnelHomepageViewBeaconLazy`) | ✓ Already in place |
| PostHog deferred with `requestIdleCallback` | ✓ Already in place |
| Header scroll throttled with `requestAnimationFrame` | ✓ Already in place |
| Theme seeded `beforeInteractive` via inline script | ✓ Already in place |
| Carousel transitions composited (no clip-path) | ✓ Already in place |
| Mobile lite carousel variant (single slide, no effects) | ✓ Already in place |
| `server-only` guards on most server marketing utilities | ✓ Already in place |
| `contain: paint` on below-fold sections | ✓ Already in CSS |
| Hero geometry reserved before hydration (`nn-premium-hero-grid min-height`) | ✓ Already in CSS |
| Section `min-height` reserved before hydration | ✓ Already in CSS |

---

## Tests Run

```
npm run test:homepage       → 100/100 pass (was 96 before, +4 new contract tests)
npm run typecheck:critical  → 0 errors
npm run audit:large-client-components → exit 0 (warn-only, same set as before)
```

---

## New Contract Tests Added (in `homepage-pagespeed-performance.contract.test.ts`)

1. **`defers below-fold screenshot carousel SSR to reduce initial hydration cost`** — Verifies `HomeHeroScreenshotSectionLazy` has `ssr: false`.
2. **`defers analytics beacon SSR to prevent blocking first paint`** — Verifies both beacon and carousel have `ssr: false` (≥ 2 entries).
3. **`guards Prisma homepage stats module from entering browser bundles`** — Verifies `server-only` appears before `@prisma/client` in `public-home-stats.ts`.
4. **`keeps ECG strip path as a module-level constant to avoid recomputation on hydration`** — Verifies `_ECG_PATH` is a module-level constant.

---

## Unresolved Risks

### Risk 1: `SiteHeader` (1255-line client component)
- `site-header.tsx` is the largest client component on the marketing homepage.
- It uses `useSession`, `usePathname`, `useRouter`, `useSearchParams`, `useState` (multiple), `useEffect` (multiple).
- Estimated hydration cost: moderate-to-high (several hooks, some conditional effects).
- **Not changed**: Refactoring the site header requires careful nav correctness review; flagged as a future hardening opportunity.

### Risk 2: All Premium Homepage Sections Are "use client"
- 10 premium homepage sections (`premium-homepage-hero.tsx`, `premium-clinical-depth.tsx`, `premium-homepage-trust.tsx`, etc.) all use `"use client"`.
- `premium-clinical-depth.tsx` and `premium-homepage-trust.tsx` have zero browser API usage — they only use `useMarketingI18n`.
- Converting them to RSC would require passing pre-computed i18n strings as props from the server parent. This is architecturally sound but requires a larger refactor with risk of visual regression.
- **Not changed in this pass**: Flagged as the highest-impact future opportunity.

### Risk 3: `dynamic()` Chunks Load Immediately on Mount
- All 8 `dynamic()` imports in `HomeRestoredClient` resolve immediately on first render (no IntersectionObserver guard).
- When `HomeRestoredClient` mounts, all 8 chunks begin downloading in parallel.
- Each chunk, as it resolves, causes a hydration task. On slow connections, these stack up and contribute to TBT.
- **Not changed**: Intersection Observer-based hydration deferral is the next step but would require careful CLS and SEO analysis.

### Risk 4: `MarketingHeroCarousel` (Desktop Interactive Mode)
- The full interactive carousel (`MarketingHeroCarouselInteractive`) runs on desktop with `setInterval` autoplay, `requestIdleCallback` for extra slides, and 8 useEffect hooks.
- Now deferred via `ssr: false`, but once the chunk loads, the full hydration cost is still incurred.
- **Mitigation applied**: `ssr: false` defers it from initial paint. Further reduction would require splitting the autoplay logic into a separate idle-loaded module.

---

## Next Optimization Opportunities (Ranked by Impact)

1. **Convert `PremiumClinicalDepth` and `PremiumHomepageTrust` to RSC** — These sections have ZERO browser API usage; only `useMarketingI18n`. Pass pre-computed strings from server as props. Estimated TBT reduction: **high** (eliminates 2 of 10 client hydration subtrees entirely).

2. **Refactor `SiteHeader` to split desktop nav from mobile drawer** — Isolate the mobile drawer into a `dynamic({ ssr: false })` component; desktop nav can be lighter without drawer logic. Estimated reduction: **medium**.

3. **Intersection Observer for below-fold `dynamic()` hydration** — Gate the 8 below-fold chunk imports behind an IntersectionObserver; chunks don't even load until the section approaches the viewport. Estimated TBT reduction: **medium** (removes post-load hydration burst from below-fold sections).

4. **Memoize `usePremiumHomepageRoutes` result across components** — Currently 5 components each call the hook and run their own `useMemo` with `withMarketingLocale()` path building. A shared context provider could compute this once.

5. **Lighthouse CI integration on preview deploys** — Capture TBT/CLS baselines on Railway preview URLs post-deploy for regression tracking.
