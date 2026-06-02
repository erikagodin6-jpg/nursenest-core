# Homepage ECG marketing — QA report

**Date:** 2026-05-09  
**Scope:** Premium homepage **Core ECG** + **Advanced ECG** teaser (`PremiumHomepageEcg`), routing, copy, themes, analytics contracts.

---

## Automated checks

| Command | Result |
|--------|--------|
| `npm run typecheck:critical` (from `nursenest-core/`) | **Pass** |
| `npm run test:homepage` | **Pass** (33 passed, 1 skipped optional network smoke) |

### Homepage contract suite additions / fixes (this pass)

- **`premium-homepage-ecg.contract.test.ts`** — source-order (Study Ecosystem → ECG → Readiness), core CTAs use `hrefs.lessons` / `hrefs.questionBank` only (no `/modules/ecg`), Advanced → `hrefs.pricing`, PostHog `surface: "premium_home_ecg"` + lanes `core` / `advanced_teaser`, disclaimer substring for RN/PN/NP/allied.
- **`marketing-default-layout-home-streaming.contract.test.ts`** — default marketing layout now asserts `trailingChrome={createElement(SiteFooter` (matches `(default)/layout.tsx`).
- **`public/i18n/en/pages.json`** — merged premium homepage hero + **ECG** English strings so `homepage-premium-en-pages.contract.test.ts` and runtime shards align (33 keys added).
- **`package.json` `test:homepage`** — includes `premium-homepage-ecg.contract.test.ts`.
- **`tests/e2e/public/homepage-premium-body.spec.ts`** — `section-premium-home-ecg` inserted **after** `section-premium-study-ecosystem` and **before** `section-premium-readiness-preview`.

### Playwright (local `NN_SKIP_DEV_AUTH_SECRET=1 npm run dev:next`, base URL `http://127.0.0.1:3000`)

| Spec | Result | Notes |
|------|--------|--------|
| `homepage-premium-body.spec.ts` | **Pass** | All section `data-testid`s including ECG; no safe-mode / “updating the site” fallback; mobile width overflow check pass; key pathway/final CTA href smoke pass. |
| `homepage-premium-quality.spec.ts` — raw keys / overflow / hero CTAs | **Pass** | No `pages.home.*` raw paths in `main`; 375px horizontal overflow ≤ 1px. |
| `homepage-premium-quality.spec.ts` — hero stats comma test | **Fail** | Stats line showed deferred copy (“Items, rationales…”) without numeric counts — **not ECG-specific**; same test behavior as before counts hydrate. |
| `production-surface-theme-chrome.spec.ts` | **Fail** | No visible **Theme** button within 30s — **env/UI gating**, not ECG-specific (single-theme or scrim). |
| `guest-homepage.spec.ts` | **Pass** | Guest homepage smoke. |

---

## Checklist (manual + code-backed)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| `/` renders without fallback UI | **Pass** (Playwright) | `homepage-premium-body`: no `[data-nn-home-safe-mode="1"]`, no “updating the site right now”, no “Just a moment” heading. |
| ECG section after Study Ecosystem, before Readiness Preview | **Pass** | `home-restored-client.tsx` order + contract test + Playwright section order. |
| Core ECG CTAs → public lessons + question bank only | **Pass** | `premium-homepage-ecg.tsx` uses `hrefs.lessons` / `hrefs.questionBank` from `usePremiumHomepageRoutes()` → `HUB.examLessons` / `HUB.questionBank` (public hubs), contract forbids `/modules/ecg`. |
| Advanced CTA → pricing | **Pass** | `href={hrefs.pricing}` (`HUB.pricing`). |
| Advanced copy: coming soon + separately priced | **Pass** | Badge “Coming soon”; disclaimer: *not included with standard RN/PN/NP/allied subscriptions* + *pricing will be announced separately*. |
| No copy implies Advanced included in RN/PN/NP/allied plans | **Pass** | Disclaimer explicitly excludes; teaser framed as future program. |
| Midnight/dark: readable text + strip contrast | **Pass** (CSS review) | `premium-redesign-2026.css`: `.nn-premium-home-section--ecg .nn-premium-hero-ecg` dark-theme overrides with `--bg-inset` / `--semantic-chart-3` mixes; row/BPM use semantic tokens + `text-on-dark`. |
| Mobile layout stacks cleanly | **Pass** (Playwright + markup) | Grid `lg:grid-cols-[1.05fr_0.95fr]`; premium-body mobile viewport no horizontal overflow. |
| PostHog: `surface=premium_home_ecg`, correct `lane` | **Pass** (code) | `eventProps`: `surface: "premium_home_ecg"`, `lane: "core"` \| `"advanced_teaser"`, `choice` lessons/questions/pricing; event `marketing_home_explore_hub_click`. **Note:** `MarketingTrackedLink` **does not** fire `trackProductEvent` when `useMarketingMobilePerfIsMobile()` is true — mobile clicks omit capture by design. |
| No raw i18n keys | **Pass** | `safeHomepageMarketingT` + merged `pages.json`; Playwright quality test matched no dotted keys in main. |
| No hot pink / hardcoded off-brand colors in ECG block | **Pass** (review) | ECG section uses `var(--semantic-chart-*)`, `var(--palette-*)`, `color-mix`; BPM row uses `--semantic-chart-1` with CSS fallback (theme-token pattern). Shared redesign file still contains legacy `#ffffff` fallbacks for surfaces elsewhere — unchanged by ECG work. |

---

## Risks / follow-ups

1. **Theme rotation E2E** failed locally without a visible theme control — use full theme-picker env or production smoke when validating Midnight/Ocean rotation automatically.
2. **Stats line Playwright** assumes numeric counts in hero stats — flaky when deferred stats show explanatory copy only.
3. **Contract coverage:** `homepage-premium-en-pages.contract.test.ts` still asserts the original **11** canonical keys; additional ECG strings were added to `pages.json` but are not all duplicated in `REQUIRED_KEYS` — consider extending the contract object if strict parity is desired.

---

## Files touched in QA enablement

- `nursenest-core/tests/e2e/public/homepage-premium-body.spec.ts`
- `nursenest-core/src/lib/marketing/premium-homepage-ecg.contract.test.ts` (new)
- `nursenest-core/src/lib/marketing/marketing-default-layout-home-streaming.contract.test.ts`
- `nursenest-core/package.json` (`test:homepage` script)
- `nursenest-core/public/i18n/en/pages.json` (EN shard merge)
