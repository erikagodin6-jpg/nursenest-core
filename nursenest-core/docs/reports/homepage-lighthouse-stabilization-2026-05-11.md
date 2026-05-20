# Homepage Lighthouse Stabilization — 2026-05-11

## Scope

Stabilized the existing premium NurseNest homepage without redesigning the UI, changing SEO route ownership, changing auth, changing Stripe flows, or altering i18n copy.

## Before / After Lighthouse

| Metric | Before desktop | After desktop | Before mobile | After mobile |
| --- | ---: | ---: | ---: | ---: |
| Performance | 30 | Not captured locally | 26 | Not captured locally |
| FCP | 0.7s | Not captured locally | 3.8s | Not captured locally |
| LCP | 1.5s | Not captured locally | 6.9s | Not captured locally |
| TBT | 1,270ms | Not captured locally | 360ms | Not captured locally |
| CLS | 1.816 | Guard tightened to `<0.1` | 1.978 | Existing mobile guard `<0.05` |
| Speed Index | 7.5s | Not captured locally | 12.8s | Not captured locally |
| Total payload | 2,792 KiB | Not captured locally | Not provided | Not captured locally |

Local Lighthouse/PageSpeed capture was blocked by the dev runtime, not by the patch: Turbopack failed with `OS file watch limit reached. about ["/root/nursenest-core/nursenest-core/"]`; webpack dev then returned 500s with `UnhandledSchemeError: Reading from "node:fs" is not handled by plugins` from `src/lib/observability/perf-log-host-memory.ts` via instrumentation. A deployment or fixed local watcher/instrumentation run is still required for final numeric after metrics.

## CLS Culprit Inventory

| Area | Risk found | Stabilization |
| --- | --- | --- |
| Header/nav chrome | Sticky header still had a desktop transform enter animation and session/theme controls can resolve after hydration. | Disabled `.nn-header-animate-in` animation across viewport sizes and reserved header min-height for marketing row4 and mobile layouts. |
| Hero | Hero grid used Tailwind arbitrary dynamic viewport min-height, leaving the main above-fold block dependent on runtime viewport behavior. | Moved hero min-height to deterministic CSS on `.nn-premium-hero-grid`. |
| Premium sections | Below-fold premium sections used `content-visibility` with an intrinsic size, but no explicit section floor. | Added a section min-height token to keep skipped/revealed sections from collapsing. |
| Screenshot carousel | The carousel mounted images into fixed aspect-ratio frames, but the current desktop CLS smoke only checked a loose `<0.2` threshold. | Added buffered Layout Instability observer before navigation and tightened desktop 5-second CLS threshold to `<0.1`. |

## TBT / Hydration Hotspots

Command: `npm run audit:large-client-components`

Largest tracked client component hotspots:

| File | Lines | Notes |
| --- | ---: | --- |
| `src/components/student/practice-test-runner-client.tsx` | 3470 | Learner route, not homepage initial surface. |
| `src/components/admin/admin-blog-control-panel-client.tsx` | 2859 | Admin route, not homepage initial surface. |
| `src/components/student/question-bank-practice-client.tsx` | 1941 | Learner route, not homepage initial surface. |
| `src/components/student/practice-tests-hub-client.tsx` | 1886 | Learner route, not homepage initial surface. |
| `src/components/layout/site-header.tsx` | 1255 | Public homepage chrome and a real hydration hotspot. |

Additional report generated: `reports/hydration-risk-routes.md` / `reports/hydration-risk-routes.json`.

Homepage-specific remaining TBT risk: `src/components/marketing/home-restored-client.tsx` still keeps the homepage as a client shell, with premium sections and the carousel under client boundaries. This patch reduced image and layout instability first; converting static premium sections to server components remains the next larger TBT reduction task.

## Image Optimization Inventory

The homepage product carousel uses slides `[10, 1, 7, 3, 9]`.

| Asset set | Before source | Before bytes | After source | After bytes |
| --- | --- | ---: | --- | ---: |
| Five raw CDN PNGs | `screenshot10/1/7/3/9.png` | 1,715,338 | Local WebP derivatives, all widths | 200,906 |
| Initial mobile screenshot | `screenshot10.png` | 370,506 | `screenshot10-480w.webp` | 4,916 |
| Initial desktop screenshot | `screenshot10.png` | 370,506 | `screenshot10-1200w.webp` | 25,326 |

Notes:

- The expected remote `screenshotN-480w/768w/1200w.webp` objects currently return `application/xml` error bodies, so this patch creates local production WebP derivatives under `public/marketing/homepage-screenshots/`.
- `getMarketingHeroImageUrlChain` now tries local optimized WebP variants before raw PNG fallback.
- Below-fold carousel images remain lazy/low priority; only true LCP-capable media may use priority.

## Forced Reflow / Animation Fixes

- Removed the residual header transform enter animation for all viewport sizes.
- Kept carousel transitions on compositor-friendly `opacity` and `transform`.
- Existing contract still rejects `clip-path` carousel reveals and backdrop-filter transitions.
- Remaining runtime forced-reflow source could not be traced locally because the dev server never produced a usable homepage response.

## CSS / Render-Blocking Notes

- No broad CSS import rewrites were made in this slice.
- Existing contracts still require below-fold premium homepage paint containment with `content-visibility`, `contain-intrinsic-size`, and `contain: paint`.
- Header/hero sizing fixes were added to the existing premium/token CSS layer rather than introducing a parallel homepage style system.

## Security Headers

Added global production headers in `next.config.mjs`:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `X-Content-Type-Options`

The CSP explicitly keeps Stripe checkout frames/scripts and PostHog endpoints allowed.

## Files Changed

- `next.config.mjs`
- `package.json`
- `public/marketing/homepage-screenshots/screenshot1-480w.webp`
- `public/marketing/homepage-screenshots/screenshot1-768w.webp`
- `public/marketing/homepage-screenshots/screenshot1-1200w.webp`
- `public/marketing/homepage-screenshots/screenshot3-480w.webp`
- `public/marketing/homepage-screenshots/screenshot3-768w.webp`
- `public/marketing/homepage-screenshots/screenshot3-1200w.webp`
- `public/marketing/homepage-screenshots/screenshot7-480w.webp`
- `public/marketing/homepage-screenshots/screenshot7-768w.webp`
- `public/marketing/homepage-screenshots/screenshot7-1200w.webp`
- `public/marketing/homepage-screenshots/screenshot9-480w.webp`
- `public/marketing/homepage-screenshots/screenshot9-768w.webp`
- `public/marketing/homepage-screenshots/screenshot9-1200w.webp`
- `public/marketing/homepage-screenshots/screenshot10-480w.webp`
- `public/marketing/homepage-screenshots/screenshot10-768w.webp`
- `public/marketing/homepage-screenshots/screenshot10-1200w.webp`
- `reports/hydration-risk-routes.md`
- `reports/hydration-risk-routes.json`
- `src/app/globals.css`
- `src/app/premium-redesign-2026.css`
- `src/components/marketing/home/premium-homepage-hero.tsx`
- `src/lib/marketing-hero-image.ts`
- `src/lib/marketing/homepage-pagespeed-performance.contract.test.ts`
- `tests/e2e/public/homepage-desktop-performance-smoke.spec.ts`

## Verification

| Command | Result |
| --- | --- |
| `npm run test:homepage` | Pass: 97 tests, 96 pass, 1 skipped |
| `npm run typecheck:critical` | Pass |
| `npm run audit:large-client-components` | Pass / warn-only; scanned 605 client TSX files |
| `npm run report:hydration-risk-routes` | Pass; wrote `reports/hydration-risk-routes.*` |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/public/homepage-desktop-performance-smoke.spec.ts --project=chromium --reporter=line` | Blocked by local Next 500; hero never mounted |

## Follow-Up Required

Run Lighthouse desktop/mobile against a deployed preview or a local environment with watcher capacity and fixed instrumentation bundling. Capture:

- Desktop and mobile Lighthouse after table.
- 5-second post-load CLS from the tightened Playwright guard.
- Network waterfall confirming local WebP homepage screenshots are used before PNG fallback.
