# Allied Health + New Grad — Premium Parity (Presentation Slice)

**Date:** 2026-05-08  
**Scope:** Surgical presentation/shell only. No changes to routing contracts, `alliedProfessionKey` resolution, occupation filtering, SEO generators, lesson/content SOT, entitlements, new-grad progression/report **logic**, internal link targets, or analytics event wiring.

## Visual reference folders (exact paths)

| Path | Use |
|------|-----|
| `reports/ui-redesign-preview/` | Redesign notes + this report |
| `preview-screenshots/` | Automated preview captures (`README.md` describes `npm run ui-preview:capture` routes incl. `allied-hub`) |
| `docs/qa-reports/` | QA artifacts |
| `docs/verification-screenshots/` | Release verification shots |

**Screenshots for this slice:** Run `npm run ui-preview:capture` from `nursenest-core/` (starts Next on port 3100 by default) or Playwright `tests/e2e/visual-qa/visual-qa-route-pack.spec.ts` (`visual-qa:capture`). Capture explicitly:

| Shot | Route |
|------|-------|
| Allied landing | `/allied/allied-health` |
| Occupation hub | e.g. `/allied/mlt` (or any valid `professionKey` slug) |
| Allied lesson hub surface | `/allied/allied-health/lessons` |
| New Grad hub (US) | `/us/new-grad` |
| Specialty/unit | `/us/new-grad/icu` |
| Mobile ~375 | Same routes at `390×900` (preview script) or Playwright mobile project |
| Dark | Toggle `[data-theme]` / midnight–apex on same routes |

*PNG placement:* mirror into `reports/ui-redesign-preview/` and `preview-screenshots/` per team convention after capture.

---

## 1. Route family audit

| Family | Pattern | Notes |
|--------|---------|--------|
| **Global allied hub** | `(marketing)/(default)/allied/allied-health/page.tsx` | Full `AlliedHealthPathwayHub`; SSR metadata via `safeGenerateMetadata`; force-dynamic |
| **Occupation hubs** | `(marketing)/(default)/allied/[career]/page.tsx` | Same hub component + profession scope; `revalidate`; metadata from registry (`prof.h1`, `prof.description`) — **unchanged** |
| **US New Grad** | `(marketing)/(default)/us/new-grad/page.tsx`, `[workArea]/page.tsx` | `NewGradMarketingLanding` / `NewGradWorkAreaHub`; i18n keys for SEO — **unchanged** |
| **Canada New Grad** | `(marketing)/(default)/canada/new-grad/*` | Parallel shell |
| **Locale** | `[locale]/allied/page.tsx`, `[locale]/new-grad/page.tsx` | Thin wrappers — not edited |

**Layout vs token-only:** Hub composition remains component-driven (`nn-premium-pathway-hub`, semantic Tailwind). Premium elevation uses **`premium-redesign-2026.css`** (additive) + **`globals.css`** allied/lessons hero band + **`globals.css` `.nn-gradient-safe`** on allied hero.

**Mobile + dark:** Existing pathway-hub dark rules (`.nn-premium-pathway-hub .nn-nursing-tier-hub-hero-band` in `premium-redesign-2026.css`) still apply; `min-w-0` grid fixes improve **320–375px** overflow.

---

## 2. What changed (files)

| File | Change |
|------|--------|
| `src/components/marketing/allied-health-pathway-hub.tsx` | `nn-gradient-safe` on hero band; `min-w-0` on occupation + lesson category grids; `motion-safe:` hover lift on occupation cards; module cards → `nn-premium-allied-module-card` + flex `min-w-0` for titles |
| `src/components/marketing/new-grad-marketing-landing.tsx` | Work-area grid `min-w-0`; `motion-safe:` card hover; study-mode chip row `min-w-0 max-w-full` + tighter `gap` on narrow widths |
| `src/app/globals.css` | Allied + lessons marketing hero band **border-radius** `1rem` → **`1.35rem`** (shell parity with card shells) |
| `src/app/premium-redesign-2026.css` | Allied/New Grad grid `min-width: 0`; `.nn-premium-allied-module-card` hover polish + **reduced-motion** off transition |
| `src/app/(marketing)/(default)/allied/loading.tsx` | **New** — `BrandedPageLoader` + hub-shaped skeleton |
| `src/app/(marketing)/(default)/us/new-grad/loading.tsx` | **New** |
| `src/app/(marketing)/(default)/canada/new-grad/loading.tsx` | **New** |

**Not touched:** `lib/allied/*` registry, `alliedProfessionKey` params, `generateMetadata` implementations, `publicNewGradStudyDestinations`, pathway IDs, lesson loaders.

---

## 3. Branded loading integration

- Primitive: `BrandedPageLoader` (`src/components/ui/premium-loader/branded-page-loader.tsx`) — semantic tokens, deferred leaf chrome, **`prefers-reduced-motion`** respected in `premium-loader.module.css`.
- Nested **`loading.tsx`** under `/allied`, `/us/new-grad`, `/canada/new-grad` shows branded shell during segment transitions without altering parent `(marketing)/(default)/loading.tsx` (still generic pulse for other marketing routes).

---

## 4. Validation evidence

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **Pass** |
| `npm run test:homepage` | **Pass** (14 tests, 1 skip) |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **Pass** — lists **19 tests** in **9 files** |

**Playwright (full run):** Release gate and visual QA require a running Next instance (`PLAYWRIGHT_SKIP_WEB_SERVER` / credentials per docs). This slice did **not** execute full browser suites here.

**Suggested targeted smokes (rg / docs):**

- `tests/e2e/visual-qa/visual-qa-route-pack.spec.ts` — includes `allied-landing`, `allied-occupation-mlt`, `new-grad-landing`, `new-grad-work-area-us-icu`, `new-grad-work-area-canada`
- `tests/e2e/cat/cat-entrypoints.spec.ts` — allied CAT scoping
- `tests/e2e/public/marketing-study-surfaces-production-gate.spec.ts` — `/allied/allied-health/lessons`, new-grad lessons path
- `npm run test:seo-sitemap` / `test:sitemap` — sitemap contracts (allied + new-grad XML) if touching routes (we did not)

---

## 5. Strategy (concise)

- **Parity:** Reuse existing premium tokens (`nn-premium-pathway-hub`, semantic badges, `nn-gradient-safe`) and **category/occupation differentiation** already in `AlliedHealthPathwayHub` — only tightened layout and motion accessibly.
- **No second design system:** All additions are class hooks + **additive** `premium-redesign-2026.css` rules.
- **Narrow viewports:** Explicit **`min-w-0`** + flex **`min-w-0`** on card rows prevents 320px overflow.

---

## 6. Legacy / gap notes

- **Token-only vs layout:** Learner `/app` surfaces were **out of scope** for code edits.
- **Study-plan / progression hydration:** No learner `loading.tsx` changes in this slice.

---

## 7. Blockers

- **None** for this presentation slice. Full Playwright + screenshot matrix needs local/CI dev server and optional auth for paid-only flows.

---

## 8. Confirmation — logic unchanged

| Area | Status |
|------|--------|
| SEO / `generateMetadata` / canonicals | **Unchanged** (no edits to `page.tsx` metadata functions) |
| Occupation routing / `resolveAlliedProfessionFromRouteSlug` | **Unchanged** |
| `alliedProfessionKey` / query param behavior in hub links | **Unchanged** |
| New-grad work-area registry + static params | **Unchanged** |
| Entitlements / paywall / analytics | **Unchanged** |
| New-grad progression & report **logic** | **Unchanged** |

---

*End of report.*

---

## 7. Follow-up — study-card role hues + surface parity (2026-05-08)

**Goal:** Allied and New Grad marketing hubs previously used `StudyCard variant="featured"` without the **role modifier classes** that activate multi-hue gradients under `globals.css` (those rules are scoped to `[data-nn-nursing-tier-hub="surface"]`).

**Presentation-only changes:**

| File | Change |
|------|--------|
| `allied-health-pathway-hub.tsx` | Root div adds `data-nn-nursing-tier-hub="surface"`. Each of the five study-mode `StudyCard`s adds `nn-exam-hub-study-card--{lessons\|questions\|flashcards\|practice\|cat}` alongside existing `nn-qa-*` hooks. Lesson-by-category links use `motion-safe:hover:shadow-*`. |
| `new-grad-work-area-hub.tsx` | Root adds `data-nn-nursing-tier-hub="surface"`. Study-mode cards get matching role classes; clinical-scenario / fallback cards use `--questions` tint. |
| `allied/allied-health/page.tsx` | Outer wrapper adds `nn-marketing-surface` (aligned with occupation hub + new-grad page wrappers). |

**Logic / SEO / routing:** Unchanged — attribute + CSS hooks only.

**Re-validation (this session):**

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | Pass |
| `npm run test:homepage` | Pass (13 pass, 1 skip) |
| `npx playwright test -c playwright.release-gate.config.ts --list` | 19 tests in 9 files |

