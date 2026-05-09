# Loader leaf motion — implementation report (2026-05-11)

## Figma

- **File:** https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/
- **Page:** Loader motion — leaf concepts — https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=59-2
- **Storyboard board:** https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=59-3

On-canvas concepts: (1) leaf drift across strip, (2) leaf fall + settle, (3) leaf tumble. Simple teal vector leaf silhouette for motion spec (not a trademark recreation).

## Code — primary pattern

Shared **`BrandedPageLoader`** (`data-nn-premium-loader="shell"`) from `nursenest-core/src/components/ui/premium-loader/` for marketing + learner `loading.tsx` routes.

**Shipped motion:** horizontal drift using `leafDriftTrack` (container query `inline-size`) + `leafDrone` + `@keyframes nn-premium-loader-leaf-drift-x` with `translateX(calc(100cqw - 100%))`, ~2.85s alternate. Desktop: larger `--nn-loader-leaf-box` / SVG from 768px. **Trail:** `.leafMotion::after` opacity-only.

**Inline:** `BrandedInlineLoader` — `nn-premium-loader-inline-leaf` (short drift); reduced motion: `nn-premium-loader-inline-breathe`.

## Files

- `nursenest-core/src/components/ui/premium-loader/branded-page-loader.tsx`
- `nursenest-core/src/components/ui/premium-loader/premium-loader.module.css`
- `reports/loader-leaf-motion-2026-05-11.md`

## Reduced motion (`prefers-reduced-motion: reduce`)

- **Page:** `.leafDrone` uses `nn-premium-loader-leaf-breathe` (opacity); `transform: translateY(-50%)`; trail off; pulse ring static/low opacity.
- **Deferred strip:** `deferredChromeEnter` animation off.
- **Inline:** `nn-premium-loader-inline-breathe` opacity only.

## Validation

`cd nursenest-core && npm run typecheck:critical` — pass.
