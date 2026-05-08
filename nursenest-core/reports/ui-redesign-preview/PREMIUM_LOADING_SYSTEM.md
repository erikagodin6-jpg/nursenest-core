# Premium branded loading system

## Summary

Route-level loading UX uses a shared **leaf identity** shell with semantic gradients, a deferred glass strip (avoids flicker on fast navigations), GPU-friendly CSS motion, and full **`prefers-reduced-motion`** support. **No Lottie, no canvas.** Framer Motion is **not** imported here—the default path is **CSS-only** so bundles stay lean and route `loading.tsx` segments avoid extra client animation libraries.

## Components (under `src/components/ui/premium-loader/`)

| Export | Role |
|--------|------|
| `BrandedPageLoader` | Full segment loader: busy region (`aria-busy`, `aria-live="polite"`), deferred leaf + pulse ring, semantic gradient body, skeleton children slot. Attr: `data-nn-premium-loader="shell"`. |
| `BrandedInlineLoader` | Compact inline mark for future session/chrome use (exported for reuse; not yet wired everywhere). |
| `BrandedLeafMark` | Minimal inline SVG leaf path (loading-only; does not replace header/footer logos). |
| `useDelayedLoading` | Client hook: `requestAnimationFrame` + `setTimeout` (~320ms default) before revealing deferred chrome. |

Styles live in **`premium-loader.module.css`** (semantic CSS variables only).

## Routes wired

| Route segment | File |
|---------------|------|
| App learner shell | `src/app/(student)/app/loading.tsx` |
| Learner section | `src/app/(student)/app/(learner)/loading.tsx` |
| Marketing root | `src/app/(marketing)/loading.tsx` |
| Lesson detail | `src/app/(student)/app/(learner)/lessons/[id]/loading.tsx` |
| Practice test run | `src/app/(student)/app/(learner)/practice-tests/[id]/loading.tsx` |

`LearnerLessonDetailSkeleton` / `PracticeTestRunPageSkeleton` accept **`withRouteAria={false}`** when wrapped so `BrandedPageLoader` owns the accessible busy region.

## Performance / bundle

- **Animations**: `transform` / `opacity` only; `will-change` scoped to elements that animate.
- **Framer Motion**: intentionally **not** used in this system (already in `package.json` for other surfaces); dynamic import was considered unnecessary for CSS keyframes.
- **Hydration**: `BrandedPageLoader` is a client component; route `loading.tsx` files that use it ship a small client chunk for the deferred strip only—no `suppressHydrationWarning` required.

## Accessibility

- Outer `<section>`: `aria-busy="true"`, `aria-live="polite"`, `aria-label={message}`.
- Skeleton interiors marked `aria-hidden` where nested labels would duplicate.
- **`prefers-reduced-motion: reduce`**: disables drift animation and pulse ring motion; keeps fade/static leaf and backdrop blur reduction where applicable.

## Tests

- Playwright: `tests/e2e/public/branded-loader-smoke.spec.ts`  
  - Asserts no stuck `[data-nn-premium-loader]` after homepage settles (loader is transition-only).  
  - Mobile 375 viewport horizontal overflow tolerance ≤ 8px.

## Screenshots

Optional; capture during a throttled navigation if documenting the leaf strip visually.
