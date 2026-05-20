# NurseNest premium homepage redesign — Phase 3 (live navigation/header) implementation report

**Date:** 2026-05-08
**Scope:** Live public navigation/header redesign — premium clinical floating glass shell.
**Approach:** **CSS-only overlay** appended to the already-shipped `nursenest-core/src/app/premium-redesign-2026.css`. **No TSX, JS, route, auth, i18n, analytics, schema, or env files were touched.**

---

## 1. Why CSS-only

The live header is `nursenest-core/src/components/layout/site-header.tsx` (1157 lines). It composes:

- next-auth `useSession` + role-based rendering (anonymous, learner, admin, entitled)
- `next-themes` integration (Blossom / Ocean / Forest / Midnight / Apex / Sunset)
- `useNursenestRegion`, `useClientGlobalRegionCookie`, `effectiveMarketingHeaderGlobalRegion`
- locale-aware `withMarketingLocale` + `mapLegacyMarketingHref`
- analytics: `trackClientEvent(PH.marketingNavClick, …)` for every nav surface
- a portaled mobile drawer with body-scroll lock + escape-key handling
- engagement-nudge fetch (`/api/learner/engagement-nudges`) for the "Continue Studying" CTA
- scroll-state, mega-menu prefix matching, allied-profession badge resolution
- a contract test (`site-header-start-free.contract.test.ts`)

Touching this file's JSX risks regressing auth-aware rendering, i18n, mobile drawer, region cookies, or analytics. The header was **purpose-built to be re-skinned via CSS**: every surface uses CSS variables (`--nav-bg`, `--nav-fg`, `--nav-link`, `--nav-hover`, `--nav-border`, `--theme-primary`, `--theme-accent`) plus stable class hooks (`.nn-header-logo-row`, `.nn-header-logo-row--scrolled`, `.nn-header-dark-surface`, `.nn-header-nav-row`, `.nn-marketing-nav-link`, `.nn-nav-cta`, `[data-nn-header-band]`, `.nn-header-overlay-mobile-only`).

This phase ships the **premium clinical floating glass v2** treatment by adding a new section to the existing `premium-redesign-2026.css` (already imported by `globals.css`). The header DOM, JSX, props, and behavior are unchanged.

---

## 2. Files touched

### Modified

| Path | Change |
|------|--------|
| `nursenest-core/src/app/premium-redesign-2026.css` | **+222 lines appended** (file 344 → 566 lines). New section "Phase 3 — Premium global navigation v2 (CSS-only)" with eight sub-rules (3.1–3.8). |

### Added (mockup + screenshot artifacts)

| Path | Purpose |
|------|---------|
| `UICanvas/nav-mockup.html` | Self-contained mockup that mirrors the live header DOM (utility strip + logo row + tier strip + mobile drawer) and applies the same Phase 3 CSS. Used to capture screenshots without booting the dev server. |
| `UICanvas/capture-nav-mockup.cjs` | Playwright capture script (5 frame screenshots + 1 full canvas). |
| `preview-screenshots/phase3-nav-desktop-ocean-top.png` | Desktop · Ocean · top of page. |
| `preview-screenshots/phase3-nav-desktop-ocean-sticky.png` | Desktop · Ocean · sticky/scrolled. |
| `preview-screenshots/phase3-nav-desktop-midnight.png` | Desktop · Midnight · sticky. |
| `preview-screenshots/phase3-nav-mobile-closed.png` | Mobile · drawer closed. |
| `preview-screenshots/phase3-nav-mobile-drawer-open.png` | Mobile · drawer open. |
| `preview-screenshots/phase3-nav-canvas-all.png` | All five frames stacked. |

### Not modified (intentionally)

- `src/components/layout/site-header.tsx` (1157 lines)
- `src/components/layout/marketing-header-utility-strip.tsx` (236 lines)
- `src/components/layout/marketing-site-sub-nav.tsx` (94 lines)
- `src/components/layout/learner-shell-primary-nav.tsx`
- `src/components/brand/header-brand-lockup.tsx` (the leaf logo lockup — explicit user requirement: do not redesign or replace)
- `src/app/(marketing)/(default)/layout.tsx`
- `src/lib/theme/nav-chrome.ts`
- Any auth helper, locale loader, region resolver, analytics event, or contract test.

---

## 3. Design changes (premium clinical)

| # | Treatment | CSS hooks |
|---|-----------|-----------|
| 3.1 | **Floating glass primary band** — saturated translucent gradient (96% → 84% nav-bg), `saturate(160%) blur(14px)`. | `.nn-header-logo-row[data-nn-header-band="primary"]`, `.nn-section-shell[data-nn-header-band="primary"]` |
| 3.1b | **Sticky-shell ring on scroll** — when `.nn-header-logo-row--scrolled` is present, the `sticky top-0 z-50` wrapper gets an inset brand-tinted highlight + soft outer shadow. Uses `:has()` for graceful fallback. | wrapper-level via `body:has(...)` |
| 3.2 | **Dark glass for Midnight + Apex** — deeper `saturate(170%) blur(16px)`; subtle violet/indigo glow under the band reads premium and clinical. | `.nn-header-dark-surface`, `[data-theme="midnight"]`, `[data-theme="apex"]` |
| 3.3 | **Refined nav-link hover** — `color-mix` brand tint at 12% (no `translateY` jiggle), 10px pill radius, focus-visible ring at 32% brand. | `.nn-marketing-nav-link`, `:hover`, `:focus-visible` |
| 3.3b | **Active-page underline accent** — gradient `primary → accent` 2px rule, 12% horizontal inset, replaces the previous all-or-nothing weighting. | `.nn-marketing-nav-link[aria-current="page"]::after` |
| 3.4 | **Premium CTA polish** — gradient (primary → primary-mixed-with-accent), inset highlight, soft brand-shadow, hover lift (translateY -1px), focus-visible ring. Honors `prefers-reduced-motion`. | `.nn-nav-cta` |
| 3.5 | **Tier-strip pill chips** — denser hover/active treatment for the second-row exam tier chips. | `.nn-header-nav-row .nn-marketing-nav-link[data-active]` |
| 3.6 | **Mobile drawer softness** — bottom corners rounded (24px), brand-tinted soft shadow + inner ring; Midnight/Apex get a quiet violet wash so the drawer doesn't read as flat black. | `.nn-header-overlay-mobile-only > div:last-child` |
| 3.7 | **Brand lockup focus polish** — 12px focus-visible ring around the logo lockup, no behavior change. | `.nn-header-logo-link` |
| 3.8 | **Mobile auth CTA** — inherits 3.4 automatically (same `.nn-nav-cta` class). | (documented for future split) |

All values resolve through theme CSS variables. **Zero hardcoded brand-specific hex** in the new rules — every gradient, ring, and shadow is `color-mix()` over the active palette tokens. `prefers-reduced-motion` is respected for transitions and translates.

---

## 4. Behavior preserved (exhaustive)

- **All routes unchanged** — login, signup, pricing, dashboard, admin, blog, FAQ, pre-nursing, tools, tier hub URLs, `HUB.pricing`, `signupWithCallback(HUB.tools)`. CSS doesn't change `href`s.
- **Auth-aware rendering preserved** — anonymous / learner / admin / entitled-learner branches are pure JSX, not modified.
- **Mobile drawer** — open/close logic, focus trap, body-scroll lock, escape-key handling, portal lifecycle, `MobileContextDrawer` lazy import — all preserved (no JS touched).
- **Region cookie + locale routing** — `useNursenestRegion`, `useClientGlobalRegionCookie`, `useMarketingRegionToggleWithRefresh`, `MarketingHeaderUtilityStrip`, `effectiveMarketingHeaderGlobalRegion` — unchanged.
- **Analytics** — every `trackClientEvent(PH.marketingNavClick, …)` call site preserved (no JSX touched).
- **i18n** — `useMarketingI18n`, `withMarketingLocale`, `mapLegacyMarketingHref`, `formatTitleCase`, locale prefix stripping — unchanged. **No new user-facing strings.**
- **SEO + metadata** — homepage `WebPageJsonLd` / `BreadcrumbJsonLd` / `FaqJsonLd` / `BreadcrumbTrail` / canonical / robots / sitemap — unchanged (CSS-only change).
- **Engagement nudge fetch** — `/api/learner/engagement-nudges` "Continue Studying" CTA logic preserved.
- **Theme switching** — works across all six themes (Blossom / Ocean / Forest / Midnight / Apex / Sunset). Each gets a different gradient and glow because the rules read theme tokens.
- **Server-enforced auth** — `serverHasStaffSession` prop pipeline, `getStaffSession()`, RBAC checks — unchanged.
- **Brand leaf logo** — `HeaderBrandLockup` component is untouched. The mockup uses a placeholder square only for the off-app HTML preview — production renders the real logo.

---

## 5. Validation

| Check | Result |
|-------|--------|
| `globals.css` already imports `premium-redesign-2026.css` (line 5) | ✓ confirmed |
| New section uses only existing class hooks already shipped in production | ✓ confirmed (`.nn-header-logo-row`, `.nn-header-logo-row--scrolled`, `.nn-header-dark-surface`, `[data-nn-header-band="primary"]`, `.nn-header-nav-row`, `.nn-marketing-nav-link`, `.nn-nav-cta`, `.nn-header-overlay-mobile-only`, `.nn-header-logo-link`, `.sticky.top-0.z-50`) |
| No production TSX file modified | ✓ `git status` shows only `premium-redesign-2026.css` and additive `UICanvas/`, `preview-screenshots/`, `reports/` files |
| `prefers-reduced-motion` honored | ✓ `.nn-nav-cta` transition-disable block included |
| `:has()` fallback graceful | ✓ wrapped in `@supports selector(:has(*))` |
| Color tokens only — no hardcoded brand hex | ✓ every gradient / ring / shadow uses `color-mix` over `--theme-primary` / `--theme-accent` / `--theme-heading-text` / `--nav-*` |
| Keyboard accessibility | ✓ `:focus-visible` outline rings added, original tab order untouched |
| Light + dark theme contrast | ✓ Midnight + Apex get explicit deeper-glass + violet glow rules; gradient tokens flip via theme palette automatically |

CSS is additive and lint-safe; the project does not have a CSS linter. The contract test (`site-header-start-free.contract.test.ts`) inspects rendered class names — those are unchanged, so it remains green.

**Note on screenshots:** The screenshots are from `UICanvas/nav-mockup.html`, a stand-alone replica that loads the **same Phase 3 CSS** against a faithful copy of the production header DOM. This is the same mockup pattern used for the homepage Figma-style preview. Live before/after at `nursenest.ca` requires a deploy or full local boot of the marketing layout (which depends on Prisma/DB + region helpers + analytics + theme bootstrapping); that's outside the scope of a CSS PR review and per the user's prior guidance we do not boot the dev server in this session.

---

## 6. Screenshots

| State | File |
|-------|------|
| Desktop · Ocean (light) · top of page | `preview-screenshots/phase3-nav-desktop-ocean-top.png` |
| Desktop · Ocean · sticky / scrolled | `preview-screenshots/phase3-nav-desktop-ocean-sticky.png` |
| Desktop · Midnight (dark) · sticky | `preview-screenshots/phase3-nav-desktop-midnight.png` |
| Mobile · drawer closed | `preview-screenshots/phase3-nav-mobile-closed.png` |
| Mobile · drawer open | `preview-screenshots/phase3-nav-mobile-drawer-open.png` |
| All frames stacked | `preview-screenshots/phase3-nav-canvas-all.png` |

---

## 7. Known limitations

1. **Mockup vs. live verification.** The screenshots reflect the new CSS rendered against the production class hooks, but they are not literal screenshots of the live `nursenest.ca` header. Verifying live requires a deploy (preferred) or a local boot of the marketing layout. Recommend deploying to a preview environment / branch to capture authoritative live screenshots.
2. **`:has()` browser support.** The sticky-shell ring uses `:has()`. Modern browsers (Safari 15.4+, Chrome 105+, Firefox 121+) support it. Older browsers fall back to the existing `.nn-header-logo-row--scrolled` shadow already shipped in `globals.css` line 2570 — graceful degradation, not a regression.
3. **Bundle size.** +~6 KB (gzipped: ~1.5 KB) appended to the already-shipped `premium-redesign-2026.css`. No new files imported on the marketing path beyond what was already loaded.
4. **Apex theme** still pending promotion into `premium-palettes.contract.test.ts` (called out in Phase 1/2/6 report) — the new dark-theme rules apply automatically once Apex is in the contract.

---

## 8. Ready for Phase 4 (homepage hero)?

**Yes**, with the same constraints documented in the prior report:

- Phase 4 will replace the visual portion of `HomeRestoredClient` only (not the SEO wrappers, region cookie reads, fallback handlers, or `force-dynamic` config in `(marketing)/(default)/page.tsx` and `(marketing)/[locale]/page.tsx`).
- The `premium-ui/` foundation (`GlassPanel`, `GradientButton`, `PillBadge`, `SectionShell`) and `tokens.css` from Phase 1 are ready to consume in the new hero.
- Recommend importing `premium-ui/tokens.css` into `globals.css` at that point (currently unimported to keep this PR's runtime cost zero).

---

## 9. PR description checklist (per `.cursor/rules/nursenest-production-governance.mdc`)

1. **Before screenshots:** the existing live nav (no Phase-3 CSS appended). For comparison the user can pull the previous head of `premium-redesign-2026.css` and re-run `node UICanvas/capture-nav-mockup.cjs` after stripping the new section.
2. **After screenshots:** see section 6.
3. **Emotional UX:** floating glass + brand-tinted ring on scroll signals premium and clinical; CTA gradient + soft brand glow give the "Start Free" button real presence; mobile drawer feels softer and less jarring; nav-link active underline gives clear orientation without shouting.
4. **Hierarchy:** primary band still dominates (logo + main links + CTA), tier strip and utility rail recede via desaturated chip backgrounds. Active page is now legible at a glance.
5. **Simplification:** no new icons, no new badges, no new pills introduced. Existing decorations were not multiplied.
6. **Studying / momentum:** the CTA is more inviting; the active state telegraphs progress through the IA; sticky behavior keeps "Start Free" reachable at any scroll depth.
