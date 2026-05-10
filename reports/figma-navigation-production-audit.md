# Figma navigation — production visibility audit

**Date:** 2026-05-09  
**Repo:** `nursenest-core` (production Next.js app under `nursenest-core/` per `AGENTS.md` / `README.md`)  
**Goal:** Explain why a "Figma navigation redesign" might not appear on the live site, whether it was implemented and merged, and what code path actually serves marketing chrome today.

---

## 1. Executive answer

| Question | Answer |
|----------|--------|
| Was a dedicated **Figma A/B/C preview nav** ever merged to `main`? | **No.** It lives only on branch `preview/figma-navigation-redesign` (e.g. `ec66c7871`, `51f48f398`, `c98237dc9`). `git merge-base --is-ancestor ec66c7871 main` returns **not** an ancestor of `main`. |
| Is **premium marketing navigation** (row-4 utility band, glass primary row, tier rail) implemented on `main`? | **Yes.** Recent `main` history includes `feat(marketing): refine nav header framework` (`6e6d32ad7`), `fix(marketing): lg+ header grid, utility band, nav stretch` (`f487d15e7`), `fix(header): align marketing nav layout and brand with design` (`cd47cee21`), and merge lineage for **marketing nav v3.1 glass** (`7c53f0e34` / `feat/marketing-nav-v3-1-glass`). |
| Why might production still look "wrong" vs Figma? | (1) **Deploy lag** — DigitalOcean App Platform must build from `main` with `source_dir: nursenest-core`; production commit may trail `origin/main`. (2) **Wrong expectation** — expecting `/preview/figma-navigation` variants that **never shipped** to production. (3) **Cache / CDN** — stale static assets (less likely for SSR header HTML). (4) **No feature flag** — there is no separate flag found in this audit; marketing chrome is `SiteHeader` + CSS. |

---

## 2. Git evidence

### 2.1 Remote and branch

- `git remote -v`: `origin git@github.com:erikagodin6-jpg/nursenest-core.git`
- Audit used **`git fetch origin main`** before comparing tips.

### 2.2 `main` — recent nav-related commits (sample)

From `git log --oneline -30 main` (representative):

- `6e6d32ad7` — `feat(marketing): refine nav header framework`
- `f487d15e7` — `fix(marketing): lg+ header grid, utility band, nav stretch`
- `cd47cee21` — `fix(header): align marketing nav layout and brand with design`
- `7c53f0e34` — merge: **marketing nav v3.1 glass**, row4 polish, premium loader motion

### 2.3 Branches mentioning Figma / preview nav

- **`preview/figma-navigation-redesign`** — contains **preview-only** routes and components:

  - `ec66c7871` — `feat(preview/nav): figma-style premium nav variants A/B/C scaffolding + shared primitives`
  - `51f48f398` — docs: design fallback spec + screenshot README
  - `c98237dc9` — docs: figma navigation preview report
  - `9b289a511` — contract test: production nav untouched + Playwright preview smoke

- `git diff main...preview/figma-navigation-redesign --stat` shows **~22 files**, all under preview routes (`(preview)/preview/figma-navigation/...`), `FigmaPreviewNav*`, tests, and `reports/figma-navigation-preview-2026-05-08.md` — **not** wired into production `SiteHeader`.

### 2.4 Production commit vs `main`

- **Cannot read DigitalOcean deployed Git SHA** from this repo alone (no `deploy.json` in tree; deployment described in `nursenest-core/README.md` and `nursenest-core/docs/INTEGRATIONS_RUNBOOK.md`: **GitHub `main` + `source_dir: nursenest-core`**).
- **Tags:** only `stable-pre-droplet-move` seen locally; **no** release tags aligned to daily nav work for direct "prod == tag" comparison.
- **Remote tip:** after `fetch`, `origin/main` was **`a311f907f`** (`feat(ui): theme-aware marketing nav shell for dark themes`). Compare your live app build to that SHA in the DO dashboard.

---

## 3. Code inspection (production path)

### 3.1 Primary component

- **`nursenest-core/src/components/layout/site-header.tsx`** — marketing `SiteHeader`:
  - `data-nn-header-layout="marketing-row4"` (light themes) vs `marketing-unified-dark` (dark themes).
  - **Logo + wordmark:** `HeaderBrandLockup` in brand cluster (desktop + mobile).
  - **Country, language, theme:** `MarketingHeaderUtilityCluster` with `chromeMode="row4"` in Bar A (light, `xl+`) and `chromeMode="dark-marketing"` inline next to auth on dark themes (`!isLightTheme`).
  - **Mobile:** settings button opens `MobileContextDrawer` (region / locale / theme); hamburger opens full nav drawer; `ThemePicker` + language list in drawer.
  - **Tier strip:** `buildMarketingTierHubStrip` → `.nn-marketing-nav-v31-tier-rail`.

### 3.2 Supporting files

| Area | Path |
|------|------|
| Utility cluster | `nursenest-core/src/components/layout/marketing-header-utility-strip.tsx` |
| Brand lockup | `nursenest-core/src/components/brand/header-brand-lockup.tsx` |
| Premium nav / row4 CSS | `nursenest-core/src/app/premium-redesign-2026.css` |
| Grid / Figma v3.1 comment | `nursenest-core/src/app/globals.css` (`.nn-header-desktop-grid`) |
| Semantic tokens | `nursenest-core/src/app/semantic-status-tokens.css` |

### 3.3 Routes

- **No URL changes** are required for the production nav; preview Figma variants were scoped to **`/preview/figma-navigation`** (branch only).

---

## 4. Conclusion: Figma vs production

1. **Figma preview A/B/C** = **documentation + preview routes** on `preview/figma-navigation-redesign`, **not** merged into production `SiteHeader`.
2. **Production "Figma-aligned" work** = **merged on `main`** as **marketing nav v3.1 / row4 / glass** and follow-up fixes — implemented in `site-header.tsx` + `premium-redesign-2026.css` + contracts.
3. If stakeholders still do not see it live, the default hypothesis is **deployment** (DO build not on latest `main`) or **expecting the wrong artifact** (preview branch pages vs public marketing).

---

## 5. Implementation gap (this audit)

**No additional application code changes were made in this pass:** `main` already satisfies the stated bar (logo lockup, locale/country/theme controls, semantic tokens, Ocean/Midnight paths, mobile drawer). Further pixel work should follow Figma-first governance (`docs/governance/figma-premium-ui-mandatory-process.md`).

---

## 6. Truthpack

- **Requested:** `.vibecheck/truthpack/ui-pages.json`, `copy.json`.
- **Result:** **No `.vibecheck/truthpack/` directory** present in this workspace clone. Deploy source-of-truth was taken from **`README.md` / `AGENTS.md`** instead.

---

## 7. Verification

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` (from `nursenest-core/`) | **Pass** |
| `npm run test:homepage` (from `nursenest-core/`) | **Pass** (78 passed, 1 skipped) |
| Playwright `tests/e2e/public/marketing-header-bands.spec.ts` (`chromium`) | **Fail** — `net::ERR_CONNECTION_REFUSED` at `http://127.0.0.1:3000/` (no dev server). Re-run with app listening on `127.0.0.1:3000` per `tests/e2e/helpers/e2e-env.ts`. |

---

## 8. References for release owner

- **Preview branch:** `preview/figma-navigation-redesign` — key commits: `ec66c7871`, `9b289a511`, `c98237dc9`.
- **Production nav:** `nursenest-core/src/components/layout/site-header.tsx` + `premium-redesign-2026.css`; nav commits include `6e6d32ad7`, `cd47cee21`, `f487d15e7`, merge `7c53f0e34`.
- **Deploy model:** DigitalOcean App Platform, repo `nursenest-core`, branch `main`, **`source_dir: nursenest-core`** (`nursenest-core/README.md`).

---

*Truthpack JSON was not available in this clone; conclusions use git history and in-repo documentation.*
