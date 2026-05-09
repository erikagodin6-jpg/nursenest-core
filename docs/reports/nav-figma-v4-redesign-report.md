# Nav / Figma v4 redesign — audit report

**Generated:** 2026-05-09 (repo root `/root/nursenest-core`)  
**Canonical Next app:** `nursenest-core/nursenest-core`

---

## 1. Git state

| Item | Value |
|------|--------|
| **Branch** | `main` |
| **Upstream** | `origin/main` |
| **Ahead / behind** | **Ahead 8**, behind 0 |
| **Dirty summary** | Large dirty tree: many modified files under `nursenest-core/`, `client/`, `tools/i18n/`, plus numerous untracked reports, scripts, tests, and screenshot dirs. Not limited to nav/header work. |

Source: `git status -sb` at repo root (2026-05-09).

---

## 2. Nav-related commits (summary)

### `cd47cee21` — `fix(header): align marketing nav layout and brand with design`

**Files (stat):** `globals.css`, `premium-redesign-2026.css`, `header-brand-lockup.tsx` (+70 / −19 lines).

**Summary:** Tightened marketing header **brand lockup** and **token-driven nav surfaces** — CSS variables for header utility / nav bands and premium header paint; lockup uses theme leaf asset, responsive logo slot sizing, and text wordmark “NurseNest” for sharp rendering.

### `f487d15e7` — `fix(marketing): lg+ header grid, utility band, nav stretch`

**Files (stat):** `site-header.tsx`, `marketing-header-utility-strip.tsx`, `globals.css`, new `marketing-header-layout-responsive.spec.ts`, FIX report + three Chromium screenshots under inner-app `nursenest-core/docs/screenshots/marketing-header/`.

**Summary:** **Desktop row-4 marketing layout**: utility band on xl+, primary grid with logo cluster, centered marketing links, right-side auth + inline utility cluster (`chromeMode="dark-marketing"`). **E2E coverage** for responsive header layout and locale routing assumptions.

### `b2e51244a` — `test(e2e): fix marketing header layout spec for locale routing`

**Files:** `marketing-header-layout-responsive.spec.ts` only (+65 / −8).

**Summary:** Adjusted Playwright spec to match **marketing locale-prefixed URLs** (navigation targets after `stripMarketingLocalePrefix` / localized hrefs).

---

## 3. Visual / navigation outcomes (current code + CSS)

### Logo spacing and branding

- **`HeaderBrandLockup`:** Leaf raster from `useThemeLogo("leaf")` with Lucide `Leaf` fallback; **no** full horizontal raster mark in header. Wordmark is real text (`NurseNest`, DM Sans via `var(--font-sans)`). Sizes: logo box `42px` → `46px` (sm) → `50px` (lg); wordmark scales `1.12rem` → `1.18rem` → `1.28rem`.
- **Globals (`globals.css`):** `--nav-fg`, `--nav-muted`, `--nav-border`, `--nav-hover`, `--nav-active`, header utility vs nav surface split (`--header-utility-*`, `--header-nav-*`, `--nn-header-*` bridge). Commented intent: nav foreground must stay readable on saturated theme chrome.

### Utility strip / selectors

- **`MarketingHeaderUtilityCluster`:** Country, language, theme (`ThemePicker`, `publicMarketing` scope). **Chrome modes:** `dark-bar`, `standard`, `row4`, `dark-marketing` — triggers/panels use `color-mix` with `var(--nav-fg)` / theme heading tokens, not raw neon.
- **`MarketingHeaderUtilityStrip`:** Optional top rail (`nn-header-utility` / `nn-header-utility-dark`); delegates to cluster.
- **`site-header.tsx`:** Light themes → `data-nn-header-layout="marketing-row4"` with Bar A utility (`chromeMode="row4"`, `nn-header-hide-until-xl-flex`), primary band `nn-header-desktop-grid`, tier rail `nn-marketing-nav-v31-tier-rail`. Dark themes → `marketing-unified-dark`. Test IDs: `marketing-header-utility-band`, `marketing-header-primary-row`, `marketing-header-utility-inline`, `marketing-header-utility-cluster`.

### Hot pink guard in tests

- **`marketing-header-bands.spec.ts`:** Asserts primary band background image / resolved gradient **does not** match hot-pink chrome patterns.
- **`marketing-header-layout-responsive.spec.ts`:** `page.evaluate` rejects lockup `color` === hotpink literal.
- **`premium-palettes.contract.test.ts`:** Banned neon/hot-pink hex as **primary** swatch.
- **Note:** Hub premium module contract tests currently fail for **copy / HTML entity** mismatches (`CAT & adaptive intro` vs `CAT &amp; adaptive intro` in serialized markup) — separate from nav chrome; see Phase 5.

### Blossom / Ocean / Midnight

- **Light group (`marketing-row4`):** Tier rail and desktop nav links get **semantic-info** tinted chips on `--nn-header-primary-bg` / `--nn-header-primary-fg` (see `premium-redesign-2026.css` selectors under `[data-nn-header-layout="marketing-row4"]`).
- **Dark unified:** Full-bleed paint on `.nn-header-dark-surface`; tokens remap `--nav-fg` to light foreground on dark `--nav-bg`.
- **Theme switching:** `useTheme` drives `isLightTheme` → layout attribute; `ThemePicker` remains the user-facing theme control on marketing.

### Desktop / mobile marketing nav

- **Desktop (lg+):** Row-4 stack: utility row → primary row (logo + tier pill for entitled learners + `nav` with Learn/Practice/Track + marketing links + auth) → tier hub strip.
- **Mobile / tablet:** Collapsible menu paths, signed-in CTAs (Continue / Account / App), utility controls where layout hides xl-only bands — see `site-header.tsx` mobile blocks and `nn-header-hide-until-xl*` classes in CSS.

### Learner nav (`/app`)

- **Not structurally replaced by these three commits:** Learner shell still uses existing patterns (e.g. `.nn-learner-nav-link` in `globals.css`). Marketing `SiteHeader` is the focus; **entitled learners on marketing** see pathway pill + Continue / `/app` links in the **marketing** header, not a rewrite of in-app chrome.

---

## 4. Explicit non-changes (per product guardrails)

| Area | Status |
|------|--------|
| **Routing** | **NOT changed** by these nav commits — same marketing locale prefixes, hub URLs, and `mapLegacyMarketingHref` / `withMarketingLocale` usage. |
| **Entitlements** | **NOT changed** — no new paywall or subscription logic in the cited commits. |
| **Auth** | **NOT changed** — same NextAuth session, staff checks, signup/login targets; presentation and layout only. |

---

## 5. Remaining issues

1. **Dirty `main`:** Large unrelated WIP (i18n JSON, Stripe, hubs, new tests) — merge risk until cleaned or split into PRs.
2. **Screenshot gaps:** Production captures added under **canonical** `docs/screenshots/nav-audit-2026/` (see Phase 3). **Missing:** per-theme (Blossom / Ocean / Midnight) matrix, Playwright trace-backed set, and **inner-app** `nursenest-core/docs/screenshots/nav-audit-2026/` is not the canonical evidence path.
3. **Figma frame gaps:** No Figma file / frame IDs attached in-repo for this v4 nav slice; post-completion template in `docs/governance/figma-post-completion-summary-template.md` should be filled when design signs off.
4. **Overflow risks:** `site-header` uses `min-w-0`, `flex-wrap`, `overflow-visible` in key clusters — still validate long-locale labels and narrow viewports in CI. Tier + utility rows are flex-wrap heavy; watch **390px** and **768px** for wrap collisions.

---

## 6. Validation (Phase 5)

Run from `cd /root/nursenest-core/nursenest-core`:

| Command | Exit code | Notes |
|---------|-----------|--------|
| `npm run typecheck:critical` | **0** | `tsc --noEmit -p tsconfig.typecheck-critical.json` completed successfully. |
| `npm run test:homepage` | **1** | **Not green:** 2 failures in `exam-pathway-hub-premium-modules.contract.test.tsx` (regex vs HTML-escaped copy in serialized markup — “CAT & adaptive intro” / New Grad “Prioritization & delegation drills”). 75 passed, 1 skipped in aggregate TAP summary. |

**Playwright (nav layout E2E):** Not re-run as a dedicated job in this session; `marketing-header-layout-responsive.spec.ts` exists and was touched in commits `f487d15e7` / `b2e51244a`.

**Screenshots:** **Captured** to canonical folder via `npx playwright screenshot` against `https://www.nursenest.ca/` (see directory README for file list).

---

## 7. Canonical paths

| Artifact | Path |
|----------|------|
| This report | `/root/nursenest-core/docs/reports/nav-figma-v4-redesign-report.md` |
| Screenshot evidence (canonical) | `/root/nursenest-core/docs/screenshots/nav-audit-2026/` |
