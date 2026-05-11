# Homepage Server Islands Runtime Optimization — 2026-05-11

## Summary

This pass converts the first two fully static premium homepage sections from client-rendered components into true React Server Components, using the Next.js App Router "server island" pattern. The sections now render on the server, send pre-rendered HTML to the client, and are never hydrated by React.

No visual redesign. No route, SEO, Stripe, auth, i18n, or branding changes.

---

## Files Changed

| File | Change | Type |
|---|---|---|
| `src/components/marketing/home/premium-clinical-depth.tsx` | Removed `"use client"`, replaced context hook with messages prop | Server Component |
| `src/components/marketing/home/premium-homepage-trust.tsx` | Removed `"use client"`, replaced hook + `BrandTrustInline` with server-safe variants | Server Component |
| `src/components/marketing/home-restored-client.tsx` | Removed dynamic imports for server islands; added `clinicalDepthSlot`/`trustSlot` props | Client wrapper update |
| `src/components/marketing/home-restored-with-deferred-stats.server.tsx` | Renders both server islands; loads messages; passes as named slots | Server Component update |
| `src/lib/marketing/homepage-pagespeed-performance.contract.test.ts` | Added 6 server island contract tests | Tests |
| `src/lib/marketing/homepage-premium-home-order.contract.test.ts` | Updated section order markers to reflect slot-based architecture | Tests |

---

## Which Homepage Sections Are Now Server Islands

### Converted to Server Components (this pass)

| Section | Component | Why it qualifies |
|---|---|---|
| Clinical Readiness Ecosystems | `PremiumClinicalDepth` | Zero browser APIs; only i18n text rendering; zero state/effects |
| Learner Experience / Trust | `PremiumHomepageTrust` | Zero browser APIs; only i18n text + static testimonials; `BrandTrustInline` replaced with inline server variant |

Both sections previously used `useMarketingI18n()` as their only client dependency. They now receive pre-computed messages as a `Record<string, string>` prop from the parent Server Component.

---

## Which Components Remain Client Islands (and Why)

| Component | Status | Reason |
|---|---|---|
| `PremiumHomepageHero` | Client | `useMarketingI18n`, `useNursenestRegion`, `MarketingTrackedLink` (click tracking) |
| `HomeHeroScreenshotSectionLazy` | Client, `ssr: false` | `setInterval` autoplay, 8+ `useEffect`, image loading state |
| `PremiumHomepageEcg` | Client (lazy) | `MarketingTrackedLink` CTAs, `usePremiumHomepageRoutes` |
| `PremiumPathwayShowcase` | Client (lazy) | `MarketingTrackedLink` pathway card CTAs, region-based hrefs |
| `PremiumStudyEcosystem` | Client (lazy) | `MarketingTrackedLink` on 5 flow cards |
| `PremiumSocialStudy` | Client (lazy) | `MarketingTrackedLink` CTAs |
| `PremiumReadinessPreview` | Client (lazy) | `MarketingTrackedLink` CTAs |
| `PremiumHomepageCta` | Client (lazy) | `MarketingTrackedLink` primary conversion CTAs |
| `FunnelHomepageViewBeaconLazy` | Client, `ssr: false` | PostHog event capture |

---

## How the Server Island Pattern Works

```
HomeRestoredWithDeferredStats (Server Component)
  ├── loads: stats, carousel slides, i18n messages (parallel)
  ├── renders: PremiumClinicalDepth (Server Component) → clinicalDepthSlot
  ├── renders: PremiumHomepageTrust (Server Component) → trustSlot
  └── passes all → HomeRestoredClient (Client Component)
        ├── PremiumHomepageHero (client)
        ├── HomeHeroScreenshotSectionLazy (client, ssr:false)
        ├── PremiumHomepageEcg (lazy client)
        ├── PremiumPathwayShowcase (lazy client)
        ├── {clinicalDepthSlot}  ← Server HTML, NOT hydrated
        ├── PremiumStudyEcosystem (lazy client)
        ├── PremiumSocialStudy (lazy client)
        ├── PremiumReadinessPreview (lazy client)
        ├── {trustSlot}  ← Server HTML, NOT hydrated
        ├── {children}   ← Server HTML from page.tsx
        └── PremiumHomepageCta (lazy client)
```

When `HomeRestoredClient` renders `{clinicalDepthSlot}` and `{trustSlot}`, React treats these as opaque pre-rendered HTML blobs. The client does NOT run any component code for these sections — no hook calls, no reconciliation, no effect scheduling.

---

## Provider Scope Analysis

The provider chain (from root layout outward) was audited:

| Provider | Location | Client? | Scope | Assessment |
|---|---|---|---|---|
| `AppThemeProvider` (next-themes) | Root layout | Yes | Entire app | Required — powers theme switching |
| `AuthSessionProvider` (next-auth) | Root layout | Yes | Entire app | Required — powers useSession |
| `ThemeStateHydration` | Root layout → AppThemeProvider | Yes | Entire app | Required — syncs CSS tokens with theme |
| `MarketingI18nProvider` | Marketing default layout | Yes (client context) | Marketing routes | Required for client i18n hook |
| `NursenestRegionRoot` | Marketing default layout | Yes | Marketing routes | Required for region switching |
| `MarketingCountryChromeProvider` | Marketing default layout | Yes | Marketing routes | Required for country-based chrome |
| `MarketingMobileMotionShell` | Marketing layout | Yes | Marketing routes | Required for mobile perf context |

**Finding:** Provider scope is already appropriately scoped. No providers unnecessarily wrap the entire homepage. The `MarketingI18nProvider` and `NursenestRegionRoot` are at the marketing layout level, not the root level, which is correct.

**Key observation:** Server island sections (`PremiumClinicalDepth`, `PremiumHomepageTrust`) previously consumed the `MarketingI18nProvider` context through `useMarketingI18n()`. Now they receive messages directly as props from the server. This means for these two sections, the client-side context exists but is not consumed — reducing the hydration work those sections would have done.

---

## PostHog / Telemetry Timing

**Already correct — no changes made.**

| Pattern | Status |
|---|---|
| `trackProductEvent` uses `requestIdleCallback` | ✓ Already in place |
| `initPosthogClient` is async, non-blocking | ✓ Already in place |
| `FunnelHomepageViewBeaconLazy` has `ssr: false` | ✓ Already in place |
| Beacon uses `useEffect` (not `useLayoutEffect`) | ✓ Already in place |
| PostHog module is dynamically imported | ✓ `import("posthog-js")` inside `getPosthogClient()` |
| No global event listeners attached synchronously | ✓ Confirmed by audit |

---

## Mobile Drawer / Menu Boot

**Already correct — no changes made.**

| Pattern | Status |
|---|---|
| Mobile drawer lazy-loaded on first menu interaction | ✓ `void import("@/components/layout/mobile-context-drawer")` on menu open |
| Drawer not imported until `mobileContextOpen === true` | ✓ Confirmed in `site-header.tsx` |
| Button geometry stable before hydration | ✓ CSS-based sizing, no JS measurement |

---

## Large Prop / Import Analysis

Audited homepage client component import chains:

- `usePremiumHomepageRoutes` imports: `withMarketingLocale`, `useNursenestRegion`, `marketingExamHubPath`, `publicExamPrepHubDestinations`, `HUB`, `useMarketingI18n` — all lightweight utilities, no large registries
- `PremiumClinicalDepth` (now server): imports `lucide-react` icons and `formatSentenceCase`/`formatTitleCase` — both are small utilities
- `PremiumHomepageTrust` (now server): imports `lucide-react` icons — no registries

**No large registries, lesson catalogs, pathway metadata, or SEO descriptor arrays enter the homepage client bundle.**

The server island messages (`Record<string, string>`) are loaded server-side and pre-rendered into HTML — they are NOT serialized into the client bundle as raw data.

---

## Animation Orchestration

**No animation libraries in homepage sections.** Audited findings:

- CSS-only transitions: `transition-colors`, `transition-transform`, `hover:-translate-y-1` — compositor-safe, no JS
- No Framer Motion in any homepage section
- No IntersectionObserver hooks in marketing sections
- No ResizeObserver in marketing sections
- `MarketingHeroCarousel` uses `requestIdleCallback` for extra slide mounting — already deferred
- Framer `PageTransitionShell` is already `dynamic({ ssr: false })` in `MarketingMobileMotionShell`
- `content-visibility: auto` on `.nn-premium-home-section` handles below-fold paint deferral at CSS level

---

## Tests Added / Updated

**New contract tests** (in `homepage-pagespeed-performance.contract.test.ts`):

1. `PremiumClinicalDepth is a server island with no use-client directive` — verifies no `"use client"`, no hooks, messages prop present
2. `PremiumHomepageTrust is a server island with no use-client directive` — verifies no `"use client"`, no hooks, no `BrandTrustInline` import, messages prop present
3. `HomeRestoredClient accepts server island slots for static sections` — verifies `clinicalDepthSlot` and `trustSlot` props; verifies no dynamic import of the converted sections
4. `HomeRestoredWithDeferredStats renders server islands and passes them as slots` — verifies both island components imported and slots passed
5. `server island message loader loads pages, marketing, and brand shards` — verifies all three required shards are requested

**Updated contract tests:**

6. `homepage-premium-home-order.contract.test.ts` — Updated section order markers from `<PremiumClinicalDepth` / `<PremiumHomepageTrust` to `{clinicalDepthSlot}` / `{trustSlot}` to reflect the slot-based architecture

---

## Verification Results

```
npm run test:homepage    → 105/105 pass (was 100; +5 new server island contracts, +1 updated)
npm run typecheck:critical → 0 errors
npm run audit:large-client-components → exit 0 (same warn set; homepage client components unchanged)
```

---

## Remaining Risks

### Risk 1: Hero is Still Client (Biggest Remaining TBT Source)

`PremiumHomepageHero` remains `"use client"` because it uses:
- `useMarketingI18n` for copy text
- `useNursenestRegion` for CA/US region
- `MarketingTrackedLink` for CTA click tracking

The hero is above-fold and in the initial bundle (not lazy-loaded). Its hydration cost is O(context lookups + string rendering).

**Next step**: Pre-compute all hero copy server-side. Extract a thin `HeroCtaButtons` client island for the 2 tracked CTA links. Move hero text, ECG strip, clinical panel, and trust pills to a server-rendered wrapper.

Estimated impact: **high** — eliminates ~25 i18n string lookups and 1 `useMemo` (stats formatting) from initial hydration.

### Risk 2: SiteHeader (1255-line Client Component)

The marketing header/nav is still a monolithic 1255-line client component. It has `useSession`, `usePathname`, `useRouter`, `useSearchParams`, `useState` (multiple), `useEffect` (multiple).

Static nav content (logo, link labels, layout) cannot be isolated without splitting the component. The mobile drawer is already lazy-loaded.

**Next step**: Split `SiteHeader` into a thin static shell (server-rendered nav links) + small client islands for auth controls, theme picker, and mobile menu button.

### Risk 3: `PremiumHomepageTrust` Uses BrandTrustInline Server Variant

The server-side `BrandTrustInlineServer` (inlined in the trust component) parses the trust text the same way the client `BrandTrustInline` does. If the `brand.trust.prep` message format changes, both implementations must be updated.

**Mitigation**: The server-side parsing is simple (split on ` · `). If the format changes substantially, a shared utility can be extracted.

### Risk 4: `loadServerIslandMessagesSafe` Loads 3 Shards

The new message loader loads `pages`, `marketing`, and `brand` shards for the server islands. These are read from filesystem (cached by Node module system). If the shards grow significantly, this could add latency.

**Current assessment**: Low risk — shards are JSON files read from disk, and Next.js caches them per render cycle.

---

## Next Optimization Opportunities (Ranked by Impact)

1. **Hero server island** — Convert `PremiumHomepageHero` body to server; keep only 2 CTA buttons + trust pills as a thin client island. Estimated TBT reduction: **very high** (above-fold, initial bundle).

2. **SiteHeader server/client split** — Isolate nav links + logo as server HTML; keep auth controls + theme picker + mobile button as client islands. Estimated reduction: **high**.

3. **`PremiumSocialStudy` server island** — The section is entirely hardcoded English text + two tracked links. Pre-compute everything server-side; keep only `<MarketingTrackedLink>` CTAs as a client island.

4. **`PremiumHomepageEcg` server island** — Contains the ECG strip illustration (pure SVG) + static copy + two tracked links. Same pattern as SocialStudy.

5. **Intersection Observer lazy hydration** — Gate below-fold lazy chunks behind IntersectionObserver so they don't download or execute until approaching the viewport. Prevents the current burst of 6 chunk downloads on mount.

6. **Shared route provider** — Compute `usePremiumHomepageRoutes` once in a shared context so the 5 components using it don't each run their own `useMemo` with locale path building.
