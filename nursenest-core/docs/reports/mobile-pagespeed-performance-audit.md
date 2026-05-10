# Mobile PageSpeed Performance Audit

Generated: 2026-05-10

## Executive Summary

This pass targeted the actual mobile PageSpeed/Lighthouse failure modes reported for `https://www.nursenest.ca`: high TBT, severe CLS, main-thread work, unused JavaScript, image/cache delivery, forced reflow, oversized DOM/paint cost, theme switching cost, and console cleanliness. The implementation preserves the premium NurseNest visual system: Ocean, Blossom, Midnight, Sunset, and Aurora remain theme-rich, dimensional, and visually polished.

The highest-impact fixes now guarded in code are:

- Homepage hydration work was reduced by removing forced scroll work, deferring noncritical analytics, keeping heavy route motion out of narrow mobile marketing bundles, and lazily splitting noncritical homepage sections.
- CLS and long-task risk were reduced by moving carousel reveals to composited `opacity`/`transform`, throttling sticky-header scroll state with `requestAnimationFrame`, avoiding repeated full theme token rewrites, and setting a server-derived narrow viewport hint before mobile motion shell hydration.
- Paint and asset pressure were reduced without flattening the design by disabling expensive backdrop/filter work on mobile-critical hero chrome, adding below-fold content containment, lowering below-fold marketing screenshot quality, and adding long-lived cache headers for static image/font assets.
- Focused PageSpeed contracts now cover the risky regressions directly, and Playwright coverage exists for homepage CLS, console errors, overflow, sticky-nav jumps, mobile drawer stability, and route/theme screenshot capture.

## Verification Evidence

Fresh validation run in this workspace:

```bash
node --import tsx --test src/lib/marketing/homepage-pagespeed-performance.contract.test.ts
```

Result: pass, 11/11 tests.

```bash
npm run typecheck:critical
```

Result: pass, exit code 0.

```bash
npm run build
```

Result: did not complete in this container. The build passed prebuild, i18n compile, production i18n validation, build git metadata, lesson index generation, and lesson index verification, then was killed during Next's optimized production build phase:

```text
[lesson-indexes] ready
▲ Next.js 16.2.1 (Turbopack)
Creating an optimized production build ...
Killed
exit_code: 137
```

This is recorded as an environment kill/OOM-style validation limit, not as a confirmed application compiler error. The last logged build config had low-memory heuristics enabled, single CPU, single static generation concurrency, and disabled build workers.

Truthpack note: `.vibecheck/truthpack/*.json` was not present under the workspace, so this report does not invent or restate tier, pricing, API, env, route, or contract facts from missing truthpack data.

## Implemented Fix Matrix

| PageSpeed Finding | Current Fix | Guardrail |
| --- | --- | --- |
| High TBT from homepage hydration | Noncritical homepage sections and route motion are split/deferred; analytics initialization is scheduled during idle/fallback timeout. | `homepage-pagespeed-performance.contract.test.ts` checks dynamic route shell behavior and idle analytics scheduling. |
| Forced scroll/layout work | Homepage client no longer calls `window.scrollTo` during hydration. | Contract checks absence of `window.scrollTo` in homepage client. |
| CLS from carousel transitions | Hero carousel no longer uses `clip-path` slide reveals; global carousel transition targets `opacity` and `transform`. | Contract checks carousel and global CSS for clip-path regression. |
| Sticky header scroll long tasks | Header scroll state is throttled with `requestAnimationFrame` and only updates on state changes. | Contract checks `requestAnimationFrame` usage and no direct unthrottled `setIsScrolled(window.scrollY > 8)`. |
| Theme hydration repaint churn | Theme hydration skips redundant CSS variable rewrites when the resolved theme is unchanged. | Contract checks `lastAppliedThemeRef`. |
| Mobile motion bundle cost | Narrow marketing viewport hint is computed in `proxy.ts` and passed to `MarketingMobileMotionShell`; framer route transitions stay out of the initial narrow mobile bundle. | Contract checks server hint wiring and dynamic `ssr: false` route transition import. |
| Expensive backdrop/filter paint | Sticky/hero chrome no longer animates backdrop filters; mobile/reduced-motion paths disable expensive decorative hero filters while preserving gradients. | Contract checks no backdrop-filter transition and hero panel `backdrop-filter: none`. |
| Below-fold paint cost | Premium homepage sections use content containment/intrinsic sizing while keeping radial gradients and premium depth. | Contract checks `content-visibility`, `contain-intrinsic-size`, `contain: paint`, and final CTA gradients. |
| Image/static asset delivery | Below-fold screenshot image quality budget is reduced and static image/font assets get `public, max-age=31536000, immutable`. | Contract checks marketing image quality and Next-compatible static header matcher. |
| Local QA startup regression | Static asset cache matcher uses a valid Next route pattern instead of invalid modified wildcard extension syntax. | Contract checks the invalid `/:path*.` style does not return. |

## Playwright Coverage

Added focused coverage in `tests/e2e/public/homepage-pagespeed-stability.spec.ts`:

- Tracks cumulative layout shift with `PerformanceObserver` and fails severe CLS (`< 0.1`).
- Fails on page errors and browser console errors.
- Asserts no horizontal overflow on mobile.
- Checks sticky header height stability after scroll.
- Opens the region/language settings drawer and checks drawer overflow stability.
- Captures mobile route/theme screenshots into `docs/screenshots/premium-mobile-performance-audit/`.

The screenshot directory currently contains 36 PNG artifacts, including mobile captures for homepage, pricing, login, signup, RN hub, RN lessons hub, and RN lesson detail across Ocean, Blossom, Midnight, Sunset, and Aurora. These are useful visual evidence that the performance work did not flatten the premium theme system.

Note: the earlier live-site Playwright run against `https://www.nursenest.ca` was expected to show pre-deploy behavior because these fixes were not yet deployed. Use the same spec against staging/production after deployment for the real post-fix CLS and console result.

## Design And Product Guardrails Preserved

The changes intentionally target invisible performance waste rather than removing the premium design language:

- Gradients, semantic theme colors, atmospheric depth, and multi-theme identity remain intact.
- Learner route behavior, auth, paywall, dashboard, lessons, CAT, flashcards, SEO, i18n, and canonical routing were not intentionally changed by this PageSpeed pass.
- `/app` cache-control remains `private, no-cache, no-store, must-revalidate`.
- Static asset caching was added narrowly for public image/font extensions, not as a blanket API or learner-data cache rule.

## Remaining Validation Gaps

1. A fresh PageSpeed Insights mobile score could not be captured here because the earlier API call was quota-limited. Run PSI again after deployment with a valid API key or export raw Lighthouse JSON.
2. `npm run build` needs a larger-memory environment or adjusted production builder resources; this container killed the process at Next's optimized build phase with exit 137 after the custom gates had passed.
3. The new Playwright stability spec should be run against the deployed build after these changes are live to confirm real production CLS, console cleanliness, and screenshot parity.
4. Authenticated learner screenshots require configured paid QA credentials; public/mobile screenshot artifacts are present, but paid `/app` flows still need credentialed QA.

## Recommended Follow-Up

- Run PSI mobile against production after deploy and attach raw JSON next to this report.
- Run `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/public/homepage-pagespeed-stability.spec.ts` after deploy.
- Re-run `npm run build` on the production-like builder or a machine with more memory to separate environment capacity from application compile errors.
- Continue splitting large learner/practice client islands in separate, focused slices, preserving server-side entitlement checks and route cache semantics.


## Next Phase Remediation Update — 2026-05-10

This phase moved from audit-only evidence into targeted remediation for mobile TBT, hydration, CLS, image handling, forced reflow, and local Playwright reliability. The changes preserve the premium visual system: gradients, semantic theme color, shadows, and dimensional surfaces remain intact.

### Remediation Applied

- Restored the marketing narrow-viewport request header in `src/proxy.ts` so server-rendered marketing shells can avoid unnecessary desktop motion hydration on narrow/mobile requests.
- Changed the marketing page transition shell dynamic import to `ssr: false`, keeping Framer route transitions out of the initial server-rendered mobile marketing path.
- Prioritized the header leaf logo image with eager loading, async decoding, and high fetch priority for the header/LCP path.
- Added `content-visibility: auto`, intrinsic size reservation, and paint containment to premium homepage sections/cards to reduce below-fold rendering and repaint cost without removing premium gradients.
- Removed hover transform work for selected premium cards on mobile/reduced-motion while preserving color, shadow, and surface transitions.
- Added `images.qualities: [68, 75]` in `next.config.mjs` so the existing reduced-quality marketing screenshot budget is accepted by Next image optimization.
- Expanded Playwright mobile QA to guard severe post-idle CLS, mobile overflow, sticky header stability, drawer overflow, theme parity, reduced-motion support, and lesson detail stability.
- Seeded mobile audit themes before navigation so theme parity screenshots and assertions measure the requested Ocean, Midnight, Blossom, Aurora, and Sunset states instead of the provider default.

### Fresh Verification

- `node --import tsx --test src/lib/marketing/homepage-pagespeed-performance.contract.test.ts src/components/layout/site-header-dynamic-import.contract.test.ts` — 13 passed, 0 failed.
- `npm run typecheck:critical` — passed.
- `npm run audit:large-client-components` — passed in warn-only mode; top remaining hotspots include `practice-test-runner-client.tsx`, `admin-blog-control-panel-client.tsx`, `question-bank-practice-client.tsx`, `practice-tests-hub-client.tsx`, and `site-header.tsx`.
- `npm run report:hydration-risk-routes` — wrote `reports/hydration-risk-routes.md` and `.json`; highest current route risks remain medium/lower and centered on large client learner/admin components.
- `npm run report:mobile-route-payloads` — passed; one learner route file remains above 45 KB: `src/app/(student)/app/(learner)/lessons/[id]/page.tsx`.
- `npm run audit:runtime-payloads` — passed; giant content JSON shards remain server-only/lazy-load concerns and are documented in `reports/runtime-payload-audit.md`.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npx playwright test -c playwright.config.ts tests/e2e/public/lesson-hub-performance.spec.ts --project=chromium` — 5 passed.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npx playwright test -c playwright.mobile.config.ts tests/e2e/mobile/premium-mobile-performance-audit.spec.ts --project=mobile-pixel` — public captures and homepage stability passed; production lesson-detail TOC selector failed because production does not yet include this branch's `data-nn-premium-lessons-mobile-nav` markup.

### Screenshot Evidence

Refreshed mobile public PNGs were written under `docs/screenshots/premium-mobile-performance-audit/` for homepage, pricing, login, signup, RN hub, RN lessons hub, and RN lesson detail across Ocean, Midnight, Blossom, Aurora, and Sunset where the partial local/production runs reached those surfaces. The local full run is not marked green because the dev server became unstable under the full capture load.

### Remaining Bottlenecks / Blockers

- Local `next dev` Playwright remains unstable under the full public mobile capture: after clearing `.next`, the run still hit a pricing visibility timeout and then `ERR_CONNECTION_REFUSED`, with local logs showing DB timeout fallbacks and slow homepage stats. This needs a separate local-dev reliability pass before local full-suite screenshot verification can be considered reliable.
- Production mobile audit still cannot fully validate the branch-only lesson mobile TOC selector until the branch is deployed or the test is run against a stable local preview/prod build.
- Google PageSpeed / Lighthouse API data was not refreshed in this phase because prior PSI quota/auth blockers remain. Current evidence is from contracts, static audits, and Playwright.
- Large client components and giant content JSON shards remain the next high-impact TBT/hydration targets. This phase reduced high-confidence mobile shell/rendering costs without attempting risky large-component splits.
