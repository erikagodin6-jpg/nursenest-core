# PageSpeed desktop performance follow-up

## Baseline (user-reported Lighthouse desktop)

| Metric | Value |
|--------|------:|
| Performance | 36 |
| FCP | 0.7s |
| LCP | 1.4s |
| TBT | 2,200ms |
| CLS | 0.447 |
| Speed Index | 4.0s |
| JS execution | 5.3s |
| Main-thread work | 6.6s |
| Long tasks | 20 |
| Network payload | 2,760 KiB |
| Image delivery savings (audit) | 1,583 KiB |
| Cache lifetime savings (audit) | 1,369 KiB |

## Changes implemented (summary)

- **Main-thread / JS**: `home-restored-client.tsx` — `next/dynamic` for homepage screenshot carousel chunk; funnel beacon `dynamic(..., { ssr: false })`; server-built `homeHeroCarouselSlides` avoids client slide assembly on hydration. `home-restored-with-deferred-stats.server.tsx` loads stats + slides in parallel. New `load-home-hero-carousel-slides.server.ts`. Localized home: `buildHomeHeroPrimarySlidesFromMessages` in `[locale]/page.tsx`.
- **Images**: `marketing-hero-image.ts` — smallest-first WebP chain for narrow section frames; `marketing-hero-carousel.tsx` uses it for `mediaFrame === "section"`; `MARKETING_PHOTO_QUALITY_HOME_SCREENSHOT_SECTION` = 68.
- **Cache**: `next.config.mjs` — `/_next/static/:path*` → `public, max-age=31536000, immutable`.
- **CLS**: `premium-homepage-hero.tsx` — `min-h` on `nn-premium-hero-grid`; screenshot skeleton reserves space.
- **Config helpers**: `home-hero-carousel.ts` — `filterRenderableHomeHeroSlides`, `buildHomeHeroPrimarySlidesFromMessages`.
- **Tests**: `tests/e2e/public/homepage-desktop-performance-smoke.spec.ts`; contract `homepage-premium-home-order.contract.test.ts` updated for `HomeHeroScreenshotSectionLazy`.

## Verification commands

```bash
cd nursenest-core && npm run typecheck:critical && npm run test:unit:theme-contract
npx playwright test tests/e2e/public/homepage-public-theme-smoke.spec.ts --project=chromium
npx playwright test tests/e2e/public/premium-themes-visual-matrix.spec.ts --project=chromium
npx playwright test tests/e2e/visual/theme-parity/homepage-theme-parity.spec.ts --project=chromium
npx playwright test tests/e2e/public/homepage-desktop-performance-smoke.spec.ts --project=chromium
```

Re-run Lighthouse desktop on the same environment and compare TBT, JS execution, main-thread work, image transfer, CLS, SEO, and Accessibility to the baseline table above.
