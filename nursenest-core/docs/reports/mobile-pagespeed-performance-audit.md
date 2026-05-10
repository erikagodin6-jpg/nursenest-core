# Mobile PageSpeed Performance Audit

Generated: 2026-05-10

## Executive Summary

This is an audit-first mobile performance pass for NurseNest. The goal is to improve mobile Core Web Vitals and perceived performance while preserving the premium, theme-rich visual system. No recommendation in this report requires flattening gradients, removing depth, weakening motion quality, changing SEO, bypassing i18n, altering routes, or moving entitlement/paywall logic client-side.

The current highest-confidence bottlenecks are:

1. Large client islands for practice, question bank, flashcards, pricing, and public header chrome.
2. Mobile render cost from global premium CSS, stacked gradients, backdrop filters, sticky chrome, and theme token recalculation.
3. Large lesson/content catalogs that must remain server-only and lazy-loaded.
4. A large server lesson detail route that should keep list/card payloads light and avoid hydrating long-scroll lesson content unnecessarily.
5. Mobile layout overflow evidence on production `/pricing` during the first capture run (`main` overflow: 16px on Pixel mobile).

## Metric Source

PageSpeed Insights mobile was attempted for `https://www.nursenest.ca`.

Result: blocked by Google API quota in this environment.

```text
status 429
Quota exceeded for quota metric 'Queries' and limit 'Queries per day'
status: RESOURCE_EXHAUSTED
```

Because live PSI was unavailable, this audit uses:

- Existing repo performance scripts.
- Production Playwright mobile capture against `https://www.nursenest.ca`.
- Hydration/client-boundary static analysis.
- Route payload and runtime payload audits.

Follow-up metric sources for the next implementation pass:

- Run PSI with a valid `PAGESPEED_API_KEY`, or provide a PSI JSON export.
- Run local Lighthouse mobile against production/staging and add its JSON to the report artifacts.
- Compare Lighthouse output before and after targeted optimization.

## Core Web Vitals Findings

| Metric | Current Evidence | Risk |
| --- | --- | --- |
| LCP | PSI unavailable. Likely affected by dynamic marketing layout, header, premium hero layers, remote assets, and CSS parse/paint cost. | Medium |
| CLS | Existing theme tests check layout-height stability; production capture found mobile pricing overflow but not measured CLS. Images, fonts, sticky bars, and chart/widget sizing remain CLS audit targets. | Medium |
| INP | Highest risk in practice/CAT/question-bank/flashcards due large client components and interactive state. | High |
| FCP | Likely affected by global CSS size, dynamic marketing layout work, i18n shards, and header chrome. | Medium |
| TBT | Highest risk from large client islands and route-level interactive bundles. | High |
| Speed Index | Likely affected by premium CSS paint cost, remote assets, and dynamic route rendering. | Medium |

## Existing Script Results

Command run:

```bash
npm run audit:large-client-components
npm run report:hydration-risk-routes
npm run report:mobile-route-payloads
npm run audit:runtime-payloads
```

Result: exit code 0.

### Large Client Components

`audit:large-client-components` scanned 597 `use client` TSX files.

Tracked hotspots:

| File | Lines | Risk |
| --- | ---: | --- |
| `src/components/student/practice-test-runner-client.tsx` | 3422 | High INP/TBT risk |
| `src/components/admin/admin-blog-control-panel-client.tsx` | 2859 | Admin only, lower mobile learner priority |
| `src/components/student/question-bank-practice-client.tsx` | 1941 | High INP/TBT risk |
| `src/components/student/practice-tests-hub-client.tsx` | 1865 | High mobile route risk |
| `src/components/layout/site-header.tsx` | 1242 | High public mobile hydration/nav risk |

Warn-band files also include:

- `src/components/marketing/pricing-page-client.tsx` (1256 lines)
- `src/components/flashcards/flashcards-hub-client.tsx` (942 lines)
- `src/components/student/exam-practice-client.tsx` (923 lines)

### Hydration Risk Routes

`report:hydration-risk-routes` wrote:

- `reports/hydration-risk-routes.md`
- `reports/hydration-risk-routes.json`

Current tracked risk rows:

| File | Boundary | Risk |
| --- | --- | --- |
| `src/components/student/practice-test-runner-client.tsx` | Client | Medium |
| `src/components/admin/admin-blog-control-panel-client.tsx` | Client | Medium |
| `src/components/student/question-bank-practice-client.tsx` | Client | Lower |
| `src/components/student/practice-tests-hub-client.tsx` | Client | Lower |
| `src/app/(student)/app/(learner)/layout.tsx` | Server layout | Lower |

### Mobile Route Payloads

`report:mobile-route-payloads` scanned 94 learner route-ish files.

Largest route files:

| File | Bytes | Notes |
| --- | ---: | --- |
| `src/app/(student)/app/(learner)/lessons/[id]/page.tsx` | 54,404 | Largest learner route file; long lesson rendering risk |
| `src/app/(student)/app/(learner)/account/overview/page.tsx` | 36,903 | Dashboard/account analytics density |
| `src/app/(student)/app/(learner)/lessons/page.tsx` | 25,067 | Lesson hub payload/render risk |
| `src/app/(student)/app/(learner)/page.tsx` | 21,594 | Dashboard shell risk |
| `src/app/(student)/app/(learner)/layout.tsx` | 18,398 | Shared learner shell |

Only one learner route-ish file exceeded 45 KB: `lessons/[id]/page.tsx`.

### Runtime Payloads

Large JSON/content catalogs are present and must remain server-only/lazy-loaded:

| File | Size |
| --- | ---: |
| `src/content/pathway-lessons/np-parity-expansion-catalog.json` | 14,330 KiB |
| `src/content/pathway-lessons/catalog.json` | 10,783 KiB |
| `src/content/pathway-lessons/np-core-catalog.json` | 7,013 KiB |
| `src/content/lessons/lesson-library.json` | 4,651 KiB |
| `src/content/pathway-lessons/rpn-rex-pn-parity-expansion-catalog.json` | 3,525 KiB |

Isolation checks passed:

- No `generated-indexes` path in `src/app`.
- `pathway-lesson-catalog-sync` is not in `use client` routes.
- `use client` files avoid direct `@/content/*` imports.

## Rendering And Hydration Findings

### Global Shell

`src/app/layout.tsx` uses `next/font/google` for DM Sans with `display: "swap"` and `adjustFontFallback: true`, which is appropriate for CLS control. It also wraps the full app in global theme and auth providers. This is stable but keeps client provider code reachable for all routes.

### Marketing Layout

`src/app/(marketing)/(default)/layout.tsx` is `force-dynamic` and composes:

- Marketing i18n providers/shards.
- Public header/footer.
- region and country chrome.
- mobile motion shell.
- observability imports.

This preserves product behavior, but mobile FCP/LCP/TBT work should focus on deferring non-critical chrome and avoiding unnecessary mobile animation bundles.

### Learner Layout

`src/app/(student)/app/(learner)/layout.tsx` is `force-dynamic`, correctly server-enforces session/entitlement, and dynamically imports optional learner blocks. Keep this security shape. Optimization should reduce optional shell work and client island size, not weaken auth or cache semantics.

### Theme Hydration

`ThemeStateHydration` writes and clears many CSS custom properties on theme changes. This protects theme fidelity across Ocean, Blossom, Midnight, Sunset, and Aurora, but can cause style recalculation during theme switching. The current direction should be to profile and reduce duplicate writes, not remove richness.

## Asset, Image, And Font Findings

- Font loading is already on `next/font` and should be preserved.
- Remote logo/theme assets need cache verification and dimension stability.
- LCP assets should use `next/image` where possible with correct `sizes` and only route-critical `priority`.
- Long lesson/card views should avoid loading full lesson bodies or large screenshots in hub/list routes.

## Motion And CSS Findings

The premium CSS system is visually rich but paint-heavy:

- `premium-redesign-2026.css` includes extensive gradients, backdrop filters, keyframes, shadows, and hover transforms.
- `theme-palettes.css` and `semantic-status-tokens.css` preserve launch-theme distinction and semantic multi-hue status UI.
- `MarketingMobileMotionShell` already avoids loading `framer-motion` route transitions on narrow marketing viewports, which is the right pattern.

Optimization should target invisible or redundant paint work:

- Reduce simultaneous large backdrop-filter layers on sticky/mobile chrome.
- Gate continuous skeleton or decorative animations to `prefers-reduced-motion: no-preference`.
- Avoid broad `will-change` on large lists.
- Preserve gradients/depth by simplifying overdraw only where screenshots show no visible quality loss.

## Mobile Screenshot Exports

Public production Pixel capture passed:

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npx playwright test -c playwright.mobile.config.ts tests/e2e/mobile/premium-mobile-performance-audit.spec.ts --project=mobile-pixel
```

Result: 1 passed, 1 skipped. Runtime: 2.9 minutes.

Screenshots saved to:

`docs/screenshots/premium-mobile-performance-audit/`

Current export count: 36 PNGs.

Captured public surfaces:

- homepage
- pricing
- login
- signup
- RN hub
- RN lessons hub
- RN lesson detail

Captured themes:

- Ocean
- Blossom
- Midnight
- Sunset
- Aurora

`/blog` is intentionally opt-in via `E2E_MOBILE_INCLUDE_BLOG=1` because existing mobile tests document cold DB/dev SSR as several minutes. It should be captured in a dedicated slow-route pass.

Authenticated capture status:

- Blocked in this environment because `playwright.mobile.config.ts` did not create `mobile-paid-pixel`; paid QA credentials were not configured.
- Existing paid fixture flow remains the intended path once `E2E_PAID_EMAIL` and `E2E_PAID_PASSWORD` (or aliases) are available.

## Unresolved Bottlenecks

1. PSI/Lighthouse numeric CWV data is missing due PageSpeed quota. This blocks exact before/after Lighthouse score claims.
2. `/pricing` showed production mobile `main` overflow of 16px in the first audit run.
3. Paid learner screenshots and timing could not run without paid QA credentials.
4. Local Playwright web server is currently blocked by an unrelated uncommitted `next.config.mjs` static asset header pattern that Next rejects during startup.
5. `/blog` remains a known slow mobile route and should be audited separately with an extended timeout.

## Recommended Implementation Priority

1. Fix the invalid static asset header pattern in `next.config.mjs` or replace it with valid Next route sources so local QA can start reliably. Preserve cache semantics and avoid broad `/api/*` changes.
2. Split `src/components/layout/site-header.tsx` into a lighter server/static shell plus lazy mobile drawer/auth/theme islands where behavior allows.
3. Investigate `/pricing` mobile overflow in `src/components/marketing/pricing-page-client.tsx` and related premium CSS; fix layout stability without flattening the pricing design.
4. Keep practice/CAT/question-bank runner code isolated from shared layouts and identify sub-islands for lazy hydration around non-critical panels, analytics, and controls.
5. Review `flashcards-hub-client.tsx` for initial route hydration cost and defer session/resume or animation-heavy affordances until after first content.
6. Profile `lessons/[id]/page.tsx` long-scroll rendering. Keep lesson detail server-rendered where possible, virtualize or defer only genuinely interactive sections, and preserve premium reading UX.
7. Reduce mobile paint cost in premium CSS by targeting redundant backdrop/filter layers and continuous animations, not by removing theme richness.
8. Add a Lighthouse/PSI artifact collector once a metric source is available, and store raw JSON next to this report for repeatable score comparisons.

## App Store Quality Guardrail

Performance work must preserve:

- Ocean, Blossom, Midnight, Sunset, and Aurora richness.
- Premium gradients, hierarchy, depth, and motion where they support learner motivation.
- Server-enforced auth, paywall, and entitlements.
- SEO metadata, canonical redirects, sitemap/robots behavior.
- i18n shard loading and localized route behavior.
- Learner study momentum and mobile ergonomics.

Do not optimize by flattening NurseNest into a generic SaaS layout.
