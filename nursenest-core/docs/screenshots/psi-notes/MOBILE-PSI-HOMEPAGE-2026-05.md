# Mobile PSI note — homepage (2026-05)

Baseline Lighthouse mobile: Performance 38, FCP 3.6s, LCP 6.5s, TBT 240ms, CLS 1.651, SI 4.5s, A11y 97, BP 92, SEO 100.

Engineering: beforeInteractive theme seed from localStorage; mobile header enter animation off; mobile auth pending flex mirrors guests; below-fold hero screenshot section dynamic+ skeleton; hero `contain` on mobile; Blossom `--theme-muted-text` strengthened.

Strict Playwright CLS/bbox: `tests/e2e/public/homepage-pagespeed-stability.spec.ts`.

Risks: signed-in mobile second row; LCP network/font; `ssr:false` omits carousel from initial HTML.
