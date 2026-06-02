# Homepage ECG — visual governance & screenshot baseline program

**Date:** 2026-05-09  
**Status:** Active governance for the premium homepage **ECG ecosystem** surface (`PremiumHomepageEcg`). This section is treated as a **first-class clinical readiness ecosystem** artifact—not disposable marketing.

---

## Scope

| Surface | Role |
|--------|------|
| `PremiumHomepageEcg` | Core ECG narrative + public hub CTAs + Advanced teaser |
| Shared strip illustration | `MarketingHomepageEcgStripIllustration` from `premium-homepage-hero.tsx` (single source) |
| Advanced teaser card | Separate-program positioning + pricing link |

---

## Screenshot inventory & storage

| Category | Path under `reports/ui-redesign-preview/homepage-ecg-governance/` |
|---------|----------------------------------------------------------------------|
| Desktop full-page | `desktop/full-page/home-{theme}-1440.png` |
| Desktop ECG section | `desktop/section-isolated/ecg-section-{theme}.png` |
| Desktop Advanced teaser | `desktop/section-isolated/advanced-teaser-{theme}.png` |
| Desktop in-context | `desktop/in-context/ecg-centered-viewport-{theme}.png` |
| Mobile full-page | `mobile/full-page/home-{theme}-390.png` |
| Mobile ECG section | `mobile/section-isolated/ecg-section-{theme}.png` |
| Manifest | `manifest.json` (when `UPDATE_ECG_GOVERNANCE_SCREENSHOTS=1`) |

**Themes captured:** `ocean`, `midnight`, `sage-garden`, `blossom` (Garden / Blossom atmospheres).

**How to generate:** See `reports/ui-redesign-preview/homepage-ecg-governance/README.md`.

**Baseline state in repo:** Folder structure + README committed; PNGs are produced locally/on-demand unless your release process commits them.

---

## Routes & environments tested

| Route | Purpose |
|-------|---------|
| `/` | Premium homepage (logged-out default for governance tests) |

**Playwright `BASE_URL`:** defaults to `http://localhost:3000`. Use `NN_SKIP_DEV_AUTH_SECRET=1 npm run dev:next` for local capture.

---

## Viewports

| Mode | Size |
|------|------|
| Desktop baselines | `1440×900` |
| Mobile baselines | `390×844` |

---

## Automated regression (always-on)

Playwright spec: `tests/e2e/public/homepage-ecg-visual-governance.spec.ts`

| Check | Intent |
|-------|--------|
| Section vertical order | Study Ecosystem → ECG → Readiness (`getBoundingClientRect`) |
| Safe-mode / maintenance | No `[data-nn-home-safe-mode="1"]`, no “updating the site” copy |
| Logged-out CTAs | Core lessons/questions **exclude** `/modules/ecg`; Advanced links toward pricing/subscribe/plans |
| Layout sanity | Telemetry strip + Advanced card have meaningful height |
| Mobile overflow | `scrollWidth - clientWidth ≤ 1` at `390×844` |

---

## Visual audit checklist (manual / diff review)

| Area | Watch for |
|------|-----------|
| Spacing | `nn-section-shell`, grid gaps, CTA stacks |
| Typography | `nn-marketing-h2` / `nn-marketing-h3` hierarchy vs adjacent ecosystem sections |
| Telemetry strip | Parity with hero strip (`nn-premium-hero-ecg`); dark overrides in `premium-redesign-2026.css` |
| Duplicated systems | Single strip source (`homepage-ecg-telemetry-component.contract.test.ts`) |
| Contrast | Midnight/dark selectors for `.nn-premium-home-section--ecg .nn-premium-hero-ecg` |
| Semantic color | `semantic-chart-*`, `semantic-warning`, `palette-*` |
| Hot pink | No `#ff00ff`; BPM tint uses `--semantic-chart-1` mix (theme-driven) |
| Glow / gradients | Advanced radial uses low-opacity `semantic-chart-1` |
| Button hierarchy | Primary core CTA vs tertiary questions vs Advanced pricing link |
| Composition | ECG remains **below** Study Ecosystem and **above** Readiness Preview |

---

## Homepage composition (canonical order)

Verified by `homepage-premium-home-order.contract.test.ts` + `premium-homepage-ecg.contract.test.ts`:

1. `PremiumHomepageHero`
2. `PremiumPathwayShowcase`
3. `PremiumClinicalDepth`
4. `PremiumStudyEcosystem`
5. **`PremiumHomepageEcg`**
6. `PremiumReadinessPreview`
7. `PremiumHomepageTrust`
8. `{children}` (global hub strip)
9. `PremiumHomepageCta`

---

## i18n & content governance

| Mechanism | Detail |
|-----------|--------|
| Canonical strings | `src/lib/marketing/homepage-premium-ecg-pages-keys.ts` |
| EN shard parity | `homepage-premium-en-pages.contract.test.ts` merges **`HOMEPAGE_PREMIUM_ECG_PAGES_KEYS`** — all keys must exist in `public/i18n/en/pages.json` |
| Runtime safety | `safeHomepageMarketingT` remains defense-in-depth |

---

## Analytics governance

| Rule | Detail |
|------|--------|
| Event | `marketing_home_explore_hub_click` |
| Payload | `surface: "premium_home_ecg"`, `lane: "core"` or `"advanced_teaser"`, `choice`, `region` |
| Mobile | `MarketingTrackedLink` skips PostHog on narrow mobile perf — intentional; document before changing |

---

## Theme picker vs baseline themes

`PUBLIC_MARKETING_THEME_ALLOWLIST` exposes **Ocean only** on public marketing chrome—theme-picker UI tests may not find a Theme button. Baselines **seed `localStorage[`nursenest-theme`]`** before navigation.

---

## Validation commands

```bash
cd nursenest-core
npm run test:homepage
npm run typecheck:critical
npm run test:e2e:homepage-ecg-governance   # requires dev server
```

Optional PNG refresh:

```bash
UPDATE_ECG_GOVERNANCE_SCREENSHOTS=1 npm run test:e2e:homepage-ecg-governance
```

---

## SEO / routing / entitlement posture

- **SEO:** No URL/metadata changes from governance artifacts.
- **Routes:** Core CTAs use public hubs from `usePremiumHomepageRoutes()` — no `/modules/ecg` on homepage marketing.
- **Entitlements:** Homepage is positioning-only; server gates module access.

---

## Related artifacts

- Contracts: `premium-homepage-ecg.contract.test.ts`, `homepage-ecg-telemetry-component.contract.test.ts`, `homepage-premium-home-order.contract.test.ts`, `homepage-premium-en-pages.contract.test.ts`
- Ecosystem QA: `.cursor/rules/ecosystem-qa-governance.mdc`

---

## Visual issues log (this pass)

No blocking issues; contracts green. PNG baselines are generated on demand via env flag.

---

## Maintainer intent

The homepage ECG ecosystem must stay visually cohesive, premium, theme-consistent, clinically immersive, entitlement-safe, regression-protected, and aligned with the NurseNest clinical readiness ecosystem.
