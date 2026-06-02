# Below-Fold Hydration Audit — NurseNest Homepage

**Date:** 2026-05-13  
**Scope:** Public marketing homepage (`/`) below-fold sections  
**Baseline:** Post RSC-hero conversion (hero is already a server island)

---

## Section Inventory

The homepage renders these sections in order, each after the RSC hero island:

| Section | Component | Render mode | Hydration |
|---|---|---|---|
| Hero | `PremiumHomepageHero` | **RSC server island** | ❌ None |
| Screenshot carousel | `HomeHeroScreenshotSection` | `dynamic() ssr:false` | ⚠️ Client |
| ECG / telemetry | `PremiumHomepageEcg` | `dynamic() ssr:false` | ⚠️ Client |
| Pathway showcase | `PremiumPathwayShowcase` | `dynamic() ssr:false` | ⚠️ Client |
| Clinical depth | `PremiumClinicalDepth` | **RSC server island** | ❌ None |
| Study ecosystem | `PremiumStudyEcosystem` | `dynamic() ssr:false` | ⚠️ Client |
| Social study | `PremiumSocialStudy` | `dynamic() ssr:false` | ⚠️ Client |
| Readiness preview | `PremiumReadinessPreview` | `dynamic() ssr:false` | ⚠️ Client |
| Trust section | `PremiumHomepageTrust` | **RSC server island** | ❌ None |
| Global hub strip | `children` (server-rendered) | RSC | ❌ None |
| Final CTA | `PremiumHomepageCta` | `dynamic() ssr:false` | ⚠️ Client |

**3 sections are already RSC server islands** (hero, clinical depth, trust).
**7 sections still hydrate as client components**, though all are `ssr:false` with
min-height skeleton placeholders.

---

## Section-by-Section Analysis

### 1. `HomeHeroScreenshotSection` (screenshot carousel)

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with `<HomeHeroScreenshotSectionSkeleton>` |
| Client hooks | 8+ `useEffect`, `setInterval` (5s autoplay), `useReducedMotion` |
| Interactive elements | Dot navigation, hover pause, swipe |
| Estimated JS cost | ~40 KB (carousel chunk) |
| TBT contribution | Medium — carousel runs after idle via `requestIdleCallback` |
| CLS risk | Low — skeleton has `aspect-[4/3]` geometry lock |
| **Recommendation** | Keep as `ssr:false` — interactive carousel cannot be server-rendered |
| **Migration safety** | ✅ Already optimal |

### 2. `PremiumHomepageEcg`

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with min-height skeleton |
| Why `use client` | `useMarketingI18n()`, `useNursenestRegion()`, `usePremiumHomepageRoutes()` |
| Interactive elements | `MarketingTrackedLink` (analytics CTAs only) |
| DOM hooks | None (`useState`, `useEffect`: 0) |
| Estimated JS cost | ~10 KB source → ~7 KB bundled |
| TBT contribution | Low — no effects, renders once |
| CLS risk | Low — has min-height skeleton |
| **RSC candidacy** | HIGH — only needs locale/region for link construction |
| **Recommended migration** | Convert to RSC server island (pass `locale`, `region`, `messages`, `hrefs` from parent RSC). Follow same pattern as `PremiumHomepageHero`. |
| **Migration safety** | ⚠️ NEEDS_REVIEW — requires audit of `usePremiumHomepageRoutes` hrefs for server-safe construction |

### 3. `PremiumPathwayShowcase`

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with min-height skeleton |
| Why `use client` | `useMarketingI18n()`, `useNursenestRegion()`, `usePremiumHomepageRoutes()` |
| Interactive elements | `MarketingTrackedLink` cards (analytics tracking only) |
| DOM hooks | None |
| Estimated JS cost | ~7 KB source → ~5 KB bundled |
| TBT contribution | Low |
| CLS risk | Low — `min-height: var(--nn-premium-home-section-min, 34rem)` |
| **RSC candidacy** | HIGH — pathway cards are static content + locale-prefixed links |
| **Recommended migration** | Convert to RSC server island. Pathway cards (`pathwayCards`) depend only on `region` (CA/US) which the parent RSC can provide. |
| **Migration safety** | ⚠️ NEEDS_REVIEW — `usePremiumHomepageRoutes` must be decomposed into server-safe data |

### 4. `PremiumStudyEcosystem`

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with min-height skeleton |
| Why `use client` | `useMarketingI18n()`, `useNursenestRegion()`, `usePremiumHomepageRoutes()` |
| Interactive elements | `MarketingTrackedLink` (analytics only) |
| DOM hooks | None |
| Estimated JS cost | ~6 KB source → ~4 KB bundled |
| TBT contribution | Low |
| CLS risk | Low |
| **RSC candidacy** | HIGH — static content, locale-prefixed links |
| **Recommended migration** | Convert to RSC server island after ECG/Pathways are validated |
| **Migration safety** | ⚠️ NEEDS_REVIEW — follows ECG pattern |

### 5. `PremiumSocialStudy`

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with min-height skeleton |
| Why `use client` | `usePremiumHomepageRoutes()` |
| Interactive elements | `MarketingTrackedLink` (analytics only) |
| DOM hooks | None |
| Estimated JS cost | ~6 KB source |
| TBT contribution | Low |
| **RSC candidacy** | HIGH — pure display section, region-prefixed links |
| **Recommended migration** | Convert to RSC server island |
| **Migration safety** | ⚠️ NEEDS_REVIEW |

### 6. `PremiumReadinessPreview`

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with min-height skeleton |
| Why `use client` | `useMarketingI18n()`, `usePremiumHomepageRoutes()` |
| Interactive elements | `MarketingTrackedLink` (analytics only) |
| DOM hooks | None |
| Estimated JS cost | ~7 KB source |
| TBT contribution | Low |
| **RSC candidacy** | HIGH — static content section |
| **Recommended migration** | Convert to RSC server island |
| **Migration safety** | ⚠️ NEEDS_REVIEW |

### 7. `PremiumHomepageCta`

| Attribute | Value |
|---|---|
| Current mode | `dynamic()` `ssr:false` with **short** skeleton (16rem) |
| Why `use client` | `useMarketingI18n()`, `usePremiumHomepageRoutes()` |
| Interactive elements | Primary + secondary CTA (`MarketingTrackedLink`) |
| DOM hooks | None |
| Estimated JS cost | ~7 KB source |
| TBT contribution | Low (below fold, renders after scroll) |
| **RSC candidacy** | HIGH — only CTAs need analytics tracking (already client islands) |
| **Recommended migration** | Convert to RSC server island; CTAs become `MarketingTrackedLink` client islands |
| **Migration safety** | ✅ SAFE after ECG/Pathways validated |

---

## Current State vs Ideal

| Metric | Current | Ideal (all sections RSC) |
|---|---|---|
| Sections that hydrate | 7 | 1 (carousel only) |
| Above-fold hydration | None (hero is RSC) | None |
| Below-fold hydration | 7 dynamic() chunks | 1 carousel chunk |
| Skeleton count | 7 stable skeletons | 1 skeleton |
| JS delivered for below-fold | ~65 KB (7 dynamic chunks) | ~40 KB (carousel only) |
| TBT from below-fold | ~15–30ms | ~5–15ms |

---

## Key Blocker: `usePremiumHomepageRoutes`

All 7 client sections depend on `usePremiumHomepageRoutes()`, a client hook that:
1. Reads `locale` from `useMarketingI18n()` context
2. Reads `region` from `useNursenestRegion()` context
3. Constructs locale-prefixed marketing hrefs via `withMarketingLocale()`
4. Builds pathway card content from i18n translations

**The blocker is not architectural impossibility — it is the wiring pattern.**

Converting these sections follows the same pattern used for `PremiumHomepageHero`:
- Remove `use client` directive
- Accept `locale`, `region`, `messages`, `hrefs` as props
- Have `HomeRestoredWithDeferredStats` compute the hrefs server-side and pass them

`usePremiumHomepageRoutes` constructs hrefs from pure functions (`withMarketingLocale`,
`marketingExamHubPath`) that are server-safe — no browser APIs required.

---

## Skeleton Geometry Audit

| Section | Skeleton class | Min-height | CLS risk |
|---|---|---|---|
| Screenshot carousel | `HomeHeroScreenshotSectionSkeleton` | `min-h-[min(24rem,...)]` + `aspect-[4/3]` | ✅ Low |
| PremiumHomepageEcg | `PremiumSectionSkeleton` | `var(--nn-premium-home-section-min, 34rem)` | ✅ Low |
| PremiumPathwayShowcase | `PremiumSectionSkeleton` | `34rem` | ✅ Low |
| PremiumStudyEcosystem | `PremiumSectionSkeleton` | `34rem` | ✅ Low |
| PremiumSocialStudy | `PremiumSectionSkeleton` | `34rem` | ✅ Low |
| PremiumReadinessPreview | `PremiumSectionSkeleton` | `34rem` | ✅ Low |
| PremiumHomepageCta | `PremiumSectionSkeleton short` | `16rem` | ✅ Low |

All sections have stable skeleton geometry. No CLS risk from skeleton→content swap.

`content-visibility: auto` with `contain-intrinsic-size` is already applied via
`.nn-home-marketing-root .nn-premium-home-section` in `premium-redesign-2026.css`,
preventing off-screen sections from affecting initial paint.

---

## Recommended Migration Order

Convert sections to RSC server islands in this order (each builds confidence for next):

1. **PremiumHomepageCta** — simplest, just 2 CTAs → `MarketingTrackedLink` islands
2. **PremiumHomepageEcg** — pure display + 1 CTA group; ECG SVG is already server-safe
3. **PremiumPathwayShowcase** — card grid with region-conditional content
4. **PremiumStudyEcosystem** — 3 feature blocks + CTA
5. **PremiumSocialStudy** — 2 blocks + CTA  
6. **PremiumReadinessPreview** — final block before trust section

Each migration: remove `use client`, replace hooks with props, pass from RSC.
Expected TBT reduction per section: ~2–5ms (small but cumulative).

**Total expected improvement after all 6 conversions:** ~20–40ms TBT reduction,
~25 KB JS bundle reduction on the marketing homepage critical path.

---

## Intersection-Observer Hydration (Alternative)

For the `ssr:false` skeleton approach, an alternative is to trigger hydration only
when the section scrolls into view:

```tsx
// Instead of loading immediately:
const PremiumPathwayShowcase = dynamic(() => import("..."), { ssr: false });

// Trigger only when visible:
function LazySection({ children, fallback }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" }); // start loading 200px before viewport
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref}>{visible ? children : fallback}</div>;
}
```

This further defers JS parsing until the user approaches the section, reducing
TBT for above-fold interactions even more. The skeleton geometry guard already
prevents CLS.

**Recommendation:** Implement for PremiumPathwayShowcase and below (sections 3+),
which are typically 1–2 viewport heights below the fold.
