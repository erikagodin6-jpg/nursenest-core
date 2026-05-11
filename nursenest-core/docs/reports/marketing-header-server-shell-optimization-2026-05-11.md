# Marketing Header Server Shell Optimization — 2026-05-11

## Summary

Targeted hardening pass on the NurseNest marketing header/chrome. The `SiteHeader` component (1,254 lines) cannot be fully split into server islands in one pass because virtually every rendered element depends on client-side state (auth, locale, region, theme, scroll, pathname). This report documents what was changed, why deeper splits are blocked, and what the next achievable steps are.

No visual redesign. No route, SEO, auth, Stripe, or branding changes.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/layout/site-header.tsx` | Removed `@prisma/client` import; replaced `CountryCode` enum with string literals; added `SiteHeaderPrecomputedNav` prop type; uses server-precomputed `moreLinks` when provided |
| `src/components/layout/site-header-server.tsx` | **New** — Server Component wrapper that pre-computes static nav data |
| `src/app/(marketing)/(default)/layout.tsx` | Switched from `SiteHeader` to `SiteHeaderServer` for the default marketing homepage route |
| `src/components/layout/site-header-server-islands.contract.test.ts` | **New** — 11 contract tests for header server/client boundary and bundle safety |

---

## Full Audit: What's In SiteHeader

### Hooks
| Hook | Purpose | Can be server? |
|---|---|---|
| `useMarketingI18n()` | Locale + translation function | No — needed for mobile menu, auth labels |
| `usePathname()` | Active nav highlighting, stripped path | No — client-only |
| `useRouter()` | Navigation after region change | No — client-only |
| `useSearchParams()` | Post-login callback URL | No — client-only |
| `useSession()` | Auth state (guest/learner/staff) | No — session is client |
| `useTheme()` | Theme for header styling variants | No — localStorage |
| `useNursenestRegion()` | CA/US marketing region | No — cookie, localStorage |
| `useClientGlobalRegionCookie()` | International region cookie | No — browser cookie |
| `useMarketingRegionToggleWithRefresh()` | Region switching | No — triggers router refresh |
| `useActiveNavContext()` | Learner entitlement for header CTA | No — client context |

### State
| State | Purpose | Required? |
|---|---|---|
| `mobileOpen` | Main mobile menu open/close | Yes |
| `mobileContextOpen` | Context/settings drawer open | Yes |
| `MobileContextDrawerMod` | Lazy-loaded drawer module | Yes |
| `mobileLangOpen` | Language panel | Yes |
| `isScrolled` | Scroll shadow on header | Yes |
| `resumeStudyingCta` | Resume studying API data | Yes |
| `intlRegionDisplayName` | International region label | Yes |
| `alliedProfessionAbbrev` | Allied profession abbreviation | Yes |

### Effects
| Effect | Trigger | Purpose |
|---|---|---|
| Escape key / click-outside | Always | Close mobile panels |
| Body overflow lock | `mobileOpen || mobileContextOpen` | Scroll lock |
| Scroll listener (rAF) | Always | Scroll shadow |
| Panel close on nav | `pathname, locale, region` | UX cleanup |
| Lazy-load `mobile-context-drawer` | `mobileContextOpen` | Deferred drawer |
| Load allied profession abbreviation | `user, isMarketingEntitledLearner` | Learner badge |
| Fetch engagement nudges | `isMarketingEntitledLearner` | Resume CTA |
| Load international region name | `effectiveGlobalRegion` | Region display |

### Why Full Server Rendering is Blocked

Every visible element in the header depends on client-side state:
- Outer wrapper `style` → `stickyChromeStyle` from `useTheme()` (scroll + theme)
- `<header data-nn-header-layout>` → `marketingRow4Layout` from `useTheme()`
- Logo href → `locale` from `useMarketingI18n()`
- Nav link labels → `t()` from `useMarketingI18n()`
- Auth CTA section → `useSession()` (3 states: pending/guest/authenticated)
- Tier hub strip → `region` from `useNursenestRegion()`
- Active link indicator → `usePathname()`

---

## What Was Changed

### 1. Prisma Bundle Contamination — FIXED

**Before:** `import { CountryCode } from "@prisma/client"` was at line 8 of `SiteHeader`. This imported Prisma's generated enum into every browser bundle that included the marketing header.

**After:** Removed entirely. All `CountryCode.X` references replaced with string literals:
- `CountryCode.CA` → `"CA"`
- `CountryCode.US` → `"US"`
- `CountryCode.GB` → `"GB"`
- `CountryCode.AU` → `"AU"`
- `CountryCode.PH` → `"PH"`

The `examIndicatorLabelSync` function signature changed from `country: CountryCode` to `country: string`.

**Impact:** `@prisma/client` is no longer in the marketing header's client bundle. The Prisma enum values were string constants, but the import established a bundler dependency path to Prisma runtime.

### 2. SiteHeaderServer — Server Component Wrapper

**New file:** `src/components/layout/site-header-server.tsx`

This is a React Server Component that:
1. Loads `nav` + `brand` i18n shards from the filesystem (server-only, cached)
2. Pre-computes the 6 static desktop "More" nav links (Pricing, About, Blog, FAQ, Pre-Nursing, Tools)
3. Pre-computes Home aria-label, Log In label, Start Free label
4. Passes them as `precomputedNavData` to the existing `SiteHeader` client component

**Architecture:**
```
(default)/layout.tsx (Server)
  └── SiteHeaderServer (Server Component)  ← NEW
        └── SiteHeader (Client Component)
              ├── precomputedNavData.moreLinks → static desktop nav
              └── all hooks → mobile menu, auth, scroll, etc.
```

### 3. Default Marketing Layout Updated

`src/app/(marketing)/(default)/layout.tsx` now imports and uses `SiteHeaderServer` instead of `SiteHeader` directly. This is the primary marketing homepage route.

The `[locale]` layout and `(admin)` layout still use `SiteHeader` directly (backward-compatible).

### 4. `precomputedNavData` Prop Added to SiteHeader

`SiteHeader` now accepts an optional `precomputedNavData?: SiteHeaderPrecomputedNav` prop. When provided:
- `marketingMoreLinks` uses the server-precomputed array (skips 6 `t()` calls)
- Falls back to hook-computed values when not provided (backward-compatible)

---

## What Stayed Server-Rendered

The following content is server-rendered HTML and does not hydrate:
- `PremiumClinicalDepth` (converted in previous pass) ✓
- `PremiumHomepageTrust` (converted in previous pass) ✓
- Homepage hero text (static RSC, no client component) — pending next pass
- Blog teaser section (`HomeBlogTeaserSectionAsync`) ✓

---

## What Remains Client-Hydrated (and Why)

### SiteHeader — Entire Component
The header is still a client component. Partial server rendering is not achievable without visual regression risk because:
- The outer `div` style depends on `useTheme()` (CSS variables + scroll shadow)
- The `<header>` layout attribute depends on `useTheme()` (row4 vs unified-dark)
- ALL nav link hrefs depend on `useMarketingI18n()` locale
- Auth state (3 states) requires `useSession()`
- Region-based tier strip requires `useNursenestRegion()`

Even with `precomputedNavData`, the `useMarketingI18n()` hook is still called because the mobile menu, auth labels, and other dynamic content need it.

---

## Mobile Drawer Loading Behavior

**Confirmed correct — no changes needed:**
- `mobile-context-drawer` is dynamically imported only when `mobileContextOpen === true`
- The main mobile menu overlay renders inline via `createPortal` when `mobileOpen === true`
- Neither is in the initial bundle
- The type-only `import type { MobileContextDrawerProps }` is TypeScript-erased and has zero runtime cost

---

## Auth / Account Behavior Preservation

No auth behavior changes:
- `serverHasStaffSession` prop still flows from `getStaffSession()` in layouts
- `useSession()` still determines auth state at the client
- Guest/learner/admin CTAs unchanged
- `resolveMarketingAuthRedirectTarget` still computes post-login paths
- `SignOutButton` behavior unchanged

---

## Theme / Language / Country Behavior Preservation

No behavioral changes:
- `useTheme()` still drives header styling
- `ThemePicker` still in mobile menu
- `MarketingLanguagePreferenceList` still in mobile menu
- `MarketingHeaderUtilityCluster` still handles country/language/theme desktop controls
- `useNursenestRegion()` still drives tier hub strip and analytics

---

## Route / Href Preservation

The `precomputedNavData.moreLinks` hrefs are computed using the same `withMarketingLocale()` + `mapLegacyMarketingHref()` logic as the hook-computed path. `DEFAULT_MARKETING_LOCALE` ("en") is used for the default route, which is always English. Localized routes (`[locale]`) still use `SiteHeader` directly with hook-computed labels (correct locale from context).

---

## Tests Added

**`src/components/layout/site-header-server-islands.contract.test.ts`** — 11 tests:

1. `does not import @prisma/client` — Verifies Prisma is removed from browser bundle
2. `replaces Prisma CountryCode enum with string literals` — Verifies CA/US/GB comparisons
3. `does not import node:fs or node:path` — Guards against future server-only leakage
4. `SiteHeaderServer wrapper has no use-client directive` — Verifies server component identity
5. `SiteHeaderServer imports SiteHeader (client) and not vice versa` — Prevents circular deps
6. `SiteHeader accepts precomputedNavData prop` — Verifies the prop type contract
7. `SiteHeaderServer builds precomputed nav data with all 6 static more-links` — Verifies completeness
8. `mobile context drawer is lazy-loaded only on first open` — Verifies no eager bundling
9. `mobile main menu is rendered via createPortal` — Guards against fixed-position containment regression
10. `scroll listener uses requestAnimationFrame for paint-safe batching` — Verifies existing optimization
11. `default marketing layout uses SiteHeaderServer` — Verifies the layout was updated

---

## Verification Results

```
npm run test:homepage                      → 105/105 pass (no regressions)
typecheck:critical                         → 0 errors
audit:large-client-components              → exit 0 (no new warnings)
node --import tsx --test site-header-server-islands.contract.test.ts → 11/11 pass
```

---

## Remaining Risks

### Risk 1: SiteHeader Is Still ~1,260 Lines of Client Code

The header cannot be split without a significant architectural refactor. The three paths to genuine reduction:

**Path A (safest):** Extract the mobile menu overlay (~327 lines, lines 924–1251) into a separate `SiteHeaderMobileOverlayContent` component. Lazy-load it on `mobileOpen`. This reduces the initial parse cost by ~26% and is mechanically safe since the overlay already uses `createPortal`.

**Path B (medium):** Create a static server shell that renders only the header skeleton geometry (the `<header>` element, sticky wrapper, logo). Client-side content fills in via absolute positioning or CSS-driven progressive enhancement. Requires careful CLS work.

**Path C (full refactor):** Split into `SiteHeaderStaticShell` (server) + `SiteHeaderAuthIsland` + `SiteHeaderMobileIsland` + `SiteHeaderThemeIsland`. Requires pre-rendering auth in loading state, handling theme-dependent geometry via CSS custom properties only, and thorough visual testing.

### Risk 2: `[locale]` Layout Still Uses Direct `SiteHeader`

The French (`/fr`), Spanish, Hindi, etc. routes still use `SiteHeader` directly (no server precomputation). For these routes, nav labels are always computed by the hook. This is correct behavior but inconsistent with the default route architecture.

**Next step**: Update `[locale]/layout.tsx` to use `SiteHeaderServer` with the resolved locale passed as a prop.

### Risk 3: `marketingMoreLinks` `useMemo` Dependencies

The `precomputedNavData?.moreLinks` check in the `useMemo` dependency array uses optional chaining. React's ESLint rules may flag `precomputedNavData?.moreLinks` as an unstable reference. The current implementation works correctly because the precomputed array is stable (same identity across renders when passed as a prop), but this should be verified with React DevTools if performance profiling shows re-renders.

### Risk 4: Admin Layout Still Imports `@prisma/client` Indirectly

The admin layout uses `SiteHeader` directly. While `SiteHeader` no longer imports `CountryCode`, the admin layout may have other Prisma imports. This is outside the scope of this pass.

---

## Next Optimization Opportunities (Ranked by Impact)

1. **Extract mobile overlay into lazy component (~327 lines)** — Safe, high confidence, reduces initial parse cost
2. **Update `[locale]` layout to use `SiteHeaderServer`** — Consistent precomputation across all routes
3. **Convert `PremiumHomepageHero` to server island** — Above-fold, highest hydration cost on homepage
4. **Extract `SiteHeaderAuthIsland` (thin client wrapper)** — Guest/auth CTAs are purely reactive to session; could mount independently from the nav geometry
5. **IntersectionObserver for below-fold section chunks** — Gate 6 below-fold dynamic imports until viewport approach
