# Homepage / navigation copy hotfix — recovery report (2026-05-08)

## Policy

- **No push**, no merge to `main`, no `main` reset, no branch deletion, no stash drops.
- **`fix/full-typecheck-ecg-graph` was not modified** (not checked out for edits; no push).

## Branch

| Item | Value |
|------|--------|
| **Branch** | `hotfix/restore-homepage-nav-copy-2026-05-08` |
| **Base** | `origin/main` @ `13597d6fd` |
| **Tip commit** | `207d025b5645b8c92f73abaa007e5bbbed0a3722` |
| **Message** | `fix(marketing): restore production nav and homepage copy` |

## Backup ref used (curated, preferred)

| Ref | Points to | Role |
|-----|------------|------|
| **`refs/backup/split-snapshot-1778280602-hotfix-prev-tip`** | `71d994db0` | Same tree as cherry-picked **`71d994db08c053152cd0a7bdac96a43aacd84c91`** — curated marketing/nav/homepage fix. |

**Not used (broader WIP):**

- `refs/backup/split-snapshot-1778280602-stash0-wip-uncommitted` — merges lesson hub / i18n generator churn (out of scope).
- `refs/backup/split-snapshot-1778280602-homepage-placeholder-stash` — merge commit involving `fix/full-typecheck-ecg-graph` tip (explicitly avoided).

## Recovery method

```bash
git fetch origin --prune
git checkout -B hotfix/restore-homepage-nav-copy-2026-05-08 origin/main
git cherry-pick 71d994db08c053152cd0a7bdac96a43aacd84c91
```

## Files changed (exact list from the cherry-pick)

1. `nursenest-core/package.json` — `test:homepage` now includes hotfix + homepage premium EN + visible-copy + `marketing-header-bands.contract.test.ts`.
2. `nursenest-core/public/i18n/en/pages.json` — premium homepage copy corrections (minified JSON line).
3. `nursenest-core/reports/production-nav-homepage-copy-hotfix.md` — short hotfix note (under app package).
4. `nursenest-core/src/components/layout/site-header.tsx` — header / contrast / shell.
5. `nursenest-core/src/components/marketing/home/premium-homepage-hero.tsx` — hero copy, ECG readiness labels (HR/BPM/rhythm/readiness), fallbacks.
6. `nursenest-core/src/config/global-nav-config.ts` — **FAQ** also on **marketing mobile drawer** (`MD` surface + `mobileDrawerOrder`); **no new URLs** (still `/faq`). Shop remains desktop-dropdown-only.
7. `nursenest-core/src/lib/marketing/marketing-layout-message-integrity.ts` — stricter / safer message handling.
8. `nursenest-core/src/lib/marketing/minimal-marketing-layout-shell-fallback.ts` — shell fallbacks for nav labels.
9. `nursenest-core/src/lib/marketing/homepage-marketing-visible-copy.test.ts` — extended guards.
10. `nursenest-core/src/lib/marketing/homepage-marketing-visible-copy.ts` — placeholder / raw-key guards.
11. `nursenest-core/src/lib/marketing/homepage-premium-en-pages.contract.test.ts` — **new** — `pages.json` premium home keys + forbidden placeholder fragments.
12. `nursenest-core/src/lib/marketing/marketing-hero-nav-critical-keys.ts` — critical nav/hero key coverage.
13. `nursenest-core/src/lib/marketing/public-nav-homepage-copy-hotfix.contract.test.ts` — **new** — nav + homepage copy + Canada tier strip assertions.

**Leaf logo:** no changes in this commit removed or replaced the leaf mark asset; work is copy/tokens/header shell only.

## Validation

| Command | Result | Notes |
|---------|--------|--------|
| `npm run typecheck:critical` (from `nursenest-core/`) | **Pass** | Exit 0 |
| `npm run test:homepage` | **Pass** | 24 tests, 1 skipped, 0 failed |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/mobile/mobile-marketing-routes.spec.ts -c playwright.mobile.config.ts --project=mobile-pixel -g "hamburger"` | **Pass** | Mobile menu open/close / width |
| `npx playwright test tests/e2e/smoke-production/guest-homepage.spec.ts -c playwright.smoke.config.ts --project=Guest` | **Fail** | `expect(consoleErrors).toEqual([])` — dev logs **missing/placeholder** marketing keys (e.g. pathway carousel + `components.homeHeroCarousel.*.label`). Smoke is strict on any `console.error`. |

## Screenshots (local QA)

Directory: `reports/hotfix-homepage-nav-copy-2026-05-08/screenshots/`

| File | Description |
|------|-------------|
| `homepage-desktop-full.png` | Marketing homepage, desktop 1280×800, full page |
| `homepage-mobile-full.png` | Same URL, iPhone 13 profile, full page |
| `nav-closed-desktop.png` | Header strip after load / menu closed |
| `nav-closed-mobile.png` | Mobile header, menu closed |
| `nav-open-mobile.png` | After "Open menu" |
| `ecg-hero-panel-desktop.png` | Crop of `section-premium-readiness-preview` (ECG readiness hero band) |

**Gap:** dedicated **`nav-open-desktop.png`** was not written (desktop menu timing).

## Remaining risks

1. **Strict guest smoke vs dev data:** validate on **`next build && next start`** or staging before release.
2. **FAQ on mobile drawer:** IA change (same `/faq` route); confirm product intent.
3. **`pages.json` is one-line minified:** future diffs are noisy.
4. **Screenshot parity:** re-run captures after any further copy/CSS tweak.

## Next steps (human)

- Open PR from `hotfix/restore-homepage-nav-copy-2026-05-08` when allowed; keep **`fix/full-typecheck-ecg-graph`** separate.
- Re-run **Guest** smoke against **production build** or staging with full i18n bundles.
