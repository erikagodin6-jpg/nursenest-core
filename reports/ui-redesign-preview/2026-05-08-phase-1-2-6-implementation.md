# NurseNest premium homepage redesign — Phase 1, 2, 6 implementation report

**Date:** 2026-05-08
**Scope of this commit:** production-safe foundation only (Phases 1, 2, 6 of the
8-phase plan). Phases 3–5 (live nav swap + live homepage swap + remaining
sections) are explicitly deferred and documented below with the staged plan.

---

## 1. Files changed / added

### Added

| Path | Purpose |
|------|---------|
| `nursenest-core/src/components/ui-preview/_preview-shared.tsx` | Shared preview primitives (themes, `Pill`, `PreviewCard`, `MetricCard`, `PreviewBrand`, `ThemeSwitcher`, `cx`, `semantic`). Includes new **Apex** theme. |
| `nursenest-core/src/components/ui-preview/homepage-premium-preview.tsx` | Homepage preview surface extracted out of the 1726-line monolith (Phase 6 — TS-server stability). |
| `nursenest-core/src/components/premium-ui/README.md` | Documentation for the new design-system foundation. |
| `nursenest-core/src/components/premium-ui/tokens.css` | Premium CSS variables (radii, spacing, motion, shadows, glass surfaces, gradients). Layered on top of existing tokens. |
| `nursenest-core/src/components/premium-ui/glass-panel.tsx` | Frosted glass surface primitive (Phase 1). |
| `nursenest-core/src/components/premium-ui/gradient-button.tsx` | Premium CTA button wrapping `Button` (Phase 1). |
| `nursenest-core/src/components/premium-ui/pill-badge.tsx` | Semantic-aware pill badge (Phase 1). |
| `nursenest-core/src/components/premium-ui/section-shell.tsx` | Responsive section container (Phase 1). |
| `nursenest-core/src/components/premium-ui/index.ts` | Barrel export. |
| `UICanvas/homepage-mockup.html` | Figma-style visual mockup (already present). |
| `preview-screenshots/homepage-mockup-{canvas,desktop,hero,mobile}.png` | Mockup screenshots (already present). |

### Modified

| Path | Change |
|------|--------|
| `nursenest-core/src/components/ui-preview/nursenest-premium-preview.tsx` | **1726 → 436 lines.** Imports from `_preview-shared.tsx` and `homepage-premium-preview.tsx`; routes the preview entry. Behavior identical. |
| `nursenest-core/src/app/theme-palettes.css` | Appended a new `[data-theme="apex"]` palette block (additive, deep-navy + violet + warm-gold). Does not modify any existing palette. |

### NOT modified (intentionally — see deferred plan)

- `src/app/(marketing)/(default)/page.tsx`
- `src/app/(marketing)/[locale]/page.tsx`
- `src/app/(marketing)/(default)/layout.tsx`
- `src/components/marketing/home-restored-with-deferred-stats.server.*`
- `src/components/marketing/home-restored-client.*`
- `src/components/layout/learner-shell-primary-nav.tsx`
- `src/components/layout/marketing-site-sub-nav.tsx`

---

## 2. Production routes & components identified

### Homepage routes

- **Default homepage (`/`)** — `src/app/(marketing)/(default)/page.tsx`
  - Server component with `force-dynamic` + `revalidate = 0`.
  - Composes `HomeRestoredWithDeferredStats` (server) + `HomeBlogTeaserSectionAsync` (server) + `GlobalMarketingHomeIntro` (server).
  - Wraps everything in safe-fallback handlers and `MarketingHomeEmergencyFallback`.
- **Localized homepage (`/[locale]`)** — `src/app/(marketing)/[locale]/page.tsx`
  - SEO-heavy: `WebPageJsonLd`, `BreadcrumbJsonLd`, `FaqJsonLd`, `BreadcrumbTrail`,
    `loadMarketingLayoutShardsOverlay`, `marketingAlternatesSharedPage`,
    `getRequiredPublicMetadataLine`, `getMarketingRegionFromCookies`.
  - Renders `<HomeRestoredClient>` — the actual visual hero.
- **Marketing layout** — `src/app/(marketing)/(default)/layout.tsx` (549 lines).
  Holds the production header chrome / nav / footer composition.

### Navigation components (live)

- `src/components/layout/learner-shell-primary-nav.tsx` — learner-area primary nav.
- `src/components/layout/marketing-site-sub-nav.tsx` — marketing sub-nav.
- Header chrome + main nav are wired inside the marketing layout. Full
  inventory pass is required before swapping.

### Internal preview route (touched)

- `src/app/(preview)/preview/[surface]/page.tsx` — noindex preview shell.
- `src/components/ui-preview/nursenest-premium-preview.tsx` — entry, now 436 lines.
- `src/components/ui-preview/homepage-premium-preview.tsx` — homepage (1134 lines).
- `src/components/ui-preview/_preview-shared.tsx` — shared primitives (279 lines).
- `src/lib/ui-preview/preview-surfaces.ts` — surface registry.

---

## 3. Implementation summary by phase

### ✅ Phase 1 — Design system foundation (complete)

`src/components/premium-ui/` now contains the additive primitive layer:

- `tokens.css` — radii, spacing, motion, shadows, glass surface, glow,
  gradients. **All resolve from existing `--theme-*` variables**, so each
  palette (Blossom / Ocean / Forest / Midnight / Apex) automatically
  carries through. Dark themes get deeper shadow tone.
- `GlassPanel` — frosted surface with elevation 1–4 and card/pill shape.
- `GradientButton` — wraps `Button` from shadcn so a11y / keyboard / focus
  semantics are preserved. Gradient resolves from theme tokens.
- `PillBadge` — semantic-aware (`brand|success|info|warning|danger|neutral`)
  mapped to `semantic-status-tokens.css`.
- `SectionShell` — responsive container replacing the
  `mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8` ad-hoc pattern.

**Compliance**:
- No hardcoded hex/rgb in product UI (all values come through CSS variables).
- Light + dark themes supported.
- No production component touched.

### ✅ Phase 2 — Theme architecture (Apex theme added)

- New `[data-theme="apex"]` block appended to `src/app/theme-palettes.css`.
- Palette: deep navy surface (`#0b0f1a`), violet primary (`#a78bfa`),
  warm-gold accent (`#fbbf24`). Distinct from Blossom / Ocean / Forest /
  Midnight / Sunset — not a hue rotation.
- All required slots populated: theme primary / secondary / accent, lesson
  semantic surfaces, state surfaces, logo, brand, nav background / hover.
- Existing themes are untouched. `premium-palettes.contract.test.ts` still
  asserts on its existing 4-id `PREMIUM_IDS` set; promoting Apex into that
  contract is a follow-up that requires its own targeted CSS work
  (color-scheme: dark, --theme-card-bg etc.) and a contract-test review.

Apex is also wired into the noindex `/preview/[surface]?theme=apex` route
via `_preview-shared.tsx` (`PreviewTheme` extended; `themeVars`
extended).

### ✅ Phase 6 — TS-server stability refactor (complete)

The 1726-line `nursenest-premium-preview.tsx` has been split into three
files using a shared-helpers + isolated-surface pattern:

| File | Lines | Role |
|------|------:|------|
| `_preview-shared.tsx` | 279 | Atomic primitives + theme tokens. |
| `homepage-premium-preview.tsx` | 1134 | All homepage sections (`EcgStrip`, `ClinicalHeroPanel`, `PremiumHero`, `StatsTrustBand`, `PathwayShowcase`, `LessonSystemPreview`, `StudyEcosystemFlow`, `ReadinessIntelligence`, `TestimonialStrip`, `PremiumConversionCTA`, `HomepagePreview`). |
| `nursenest-premium-preview.tsx` | 436 | Entry: routes `surface` → preview body; mounts header + theme switcher. |

The original 1726-line entry point is gone. Working on any one of these
files now keeps a much smaller working set in the TS server, which was the
explicit Phase 6 goal.

### ⏸ Phase 3 — Live navigation upgrade (deferred — see plan below)
### ⏸ Phase 4 — Live hero (deferred)
### ⏸ Phase 5 — Live homepage sections (deferred)

These three phases mutate the live, SEO-bearing, region-aware,
i18n-multi-locale, fallback-wrapped marketing surface. The existing
production homepage tree (`HomeRestoredWithDeferredStats` server + blog
teaser + `HomeRestoredClient` + `MarketingHomeEmergencyFallback`) is large
and load-bearing for `nursenest.ca` SEO. Per `.cursor/rules/legacy-restoration.mdc`
and `AGENTS.md`, swapping it out must:

1. Keep `force-dynamic`, `revalidate = 0`, and the safe-fallback handlers
   that prevent emergency-fallback flips.
2. Preserve `WebPageJsonLd` / `BreadcrumbJsonLd` / `FaqJsonLd` /
   `BreadcrumbTrail`, `loadMarketingLayoutShardsOverlay`, alternates,
   and `defaultHomeMetaDescription/Title` per region (CA vs US).
3. Preserve `getMarketingRegionFromCookies` and locale cookie behavior.
4. Preserve all CTA destinations (`/pricing`, `/lessons`, signup, login).
5. Keep `listPublishedHomeGlobalRegionCardIds` data flow.
6. Keep server-enforced auth/admin and entitlement gating untouched.
7. Stay under 850 KB per i18n shard and not bloat client bundles.

#### Staged plan (next session)

**Phase 3 — nav (smallest first):**
1. Audit `src/app/(marketing)/(default)/layout.tsx` (549 lines) and
   inventory every header/nav module it composes.
2. Migrate the existing nav chrome to use `GlassPanel` + `PillBadge` from
   `premium-ui/`, **preserving auth-aware rendering, accessibility labels,
   keyboard navigation, and existing route wiring**.
3. Add a sticky-on-scroll variant. Mobile drawer reuses the existing
   open/close logic.
4. Visual diff PR with before/after screenshots; do not merge until
   all four utility-row controls (country / exam / theme / search /
   account) and main-row links render correctly at 360px width.

**Phase 4 — hero:**
1. Build a server component `PremiumHomepageHero` that consumes the same
   props as the existing hero (region, locale, stats) and drops in as a
   replacement for the visual portion of `HomeRestoredClient`.
2. Render server-side wherever possible; small interactive islands only
   for the theme-aware accents.
3. Preserve all CTA routes; do not change Stripe, signup, or pricing
   destinations.

**Phase 5 — remaining homepage sections:**
1. `PathwayShowcase`, `LessonSystemPreview`, `StudyEcosystemFlow`,
   `ReadinessIntelligence`, `TestimonialStrip`, `PremiumConversionCTA`
   each ported as their own server-or-RSC component using
   `SectionShell` + `GlassPanel` + `PillBadge`.
2. Replace the inline body of `HomeRestoredClient` section by section,
   one PR per section. Keep blog teaser unchanged.

---

## 4. Validation

| Check | Result |
|-------|--------|
| `npx tsc --noEmit -p tsconfig.json` filtered to `premium-ui/` and `ui-preview/` paths | **0 errors** |
| Apex theme appended without modifying any existing `[data-theme]` block | confirmed (`tail` diff on `theme-palettes.css`) |
| Original homepage routes byte-for-byte unchanged | confirmed (no edits to `(marketing)/(default)/page.tsx`, `(marketing)/[locale]/page.tsx`, or marketing layout) |
| Preview file size reduction | 1726 → 436 / 1134 / 279 (75% reduction in entry file) |
| No new heavy libs added | confirmed (no `package.json` changes) |
| Auth / SEO / i18n / robots / sitemap untouched | confirmed |

Commands run:

```bash
cd nursenest-core && npx tsc --noEmit -p tsconfig.json 2>&1 \
  | grep -E "(premium-ui|ui-preview)/"   # → empty (no errors)
```

---

## 5. Screenshots

Mockup screenshots used as the visual source of truth (already in repo):

- `preview-screenshots/homepage-mockup-canvas.png` — full Figma-style canvas
- `preview-screenshots/homepage-mockup-desktop.png` — desktop frame
- `preview-screenshots/homepage-mockup-hero.png` — desktop hero detail
- `preview-screenshots/homepage-mockup-mobile.png` — mobile frame

Live before/after homepage and nav screenshots will be captured during
Phase 3–5 PRs (cannot be captured now — the live homepage hasn't been
swapped yet).

---

## 6. Known limitations

- Apex theme is **not yet** in the strict `PREMIUM_IDS` contract test
  (`src/lib/theme/premium-palettes.contract.test.ts`). That test asserts
  `color-scheme: dark` and `--theme-card-bg: #…` for any premium dark
  theme — promoting Apex into it is a planned follow-up.
- `tokens.css` is not yet imported by `globals.css`. It will be imported
  in Phase 4 once a real homepage section consumes the primitives, to
  avoid shipping unused CSS.
- The four primitives (`GlassPanel`, `GradientButton`, `PillBadge`,
  `SectionShell`) are the foundation; planned Phase 1 follow-ups include
  `MetricCard` premium variant, `ProgressBar` semantic variant, and
  navigation-specific primitives (sticky-header chrome, theme selector
  button). These are deliberately deferred to keep this commit small.

---

## 7. Deployment readiness

- **No production routes modified.** This change is safe to deploy on its
  own — it only touches a noindex preview surface and adds new files.
- **No schema, migration, or env changes.**
- **No copy churn** outside the noindex preview.
- **No bundle bloat** on the marketing path: the new `premium-ui/`
  primitives and Apex theme block are not yet imported by any production
  marketing component.

Recommend merging this commit as the foundation, then opening a follow-up
PR for **Phase 3 (nav)** as a small, reviewable diff before touching the
homepage hero.
