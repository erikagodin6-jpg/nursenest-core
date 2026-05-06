# Mobile UI fixes (low-risk)

**Date:** 2026-05-06  
**Rules followed:** No layout redesign, no business-logic changes, no component removal. Desktop behavior preserved using `sm:` / `sm:min-h-0` (or equivalent) resets where touch sizing was raised only for narrow viewports.

---

## Summary

| Priority area | Files touched |
|---------------|----------------|
| Homepage | `marketing-hero-pattern.ts`, `email-signup-banner.tsx`, `home-restored-client.tsx`, `marketing-hero-carousel.tsx` |
| Lessons | `pathway-lesson-detail-header.tsx`, `globals.css`, `mobile-ux-standards.css` |
| Flashcards | `flashcards-hub-client.tsx`, `flashcard-viewer.tsx` |
| Practice / CAT / question bank | `practice-test-runner-client.tsx`, `pathway-cat-session-start-client.tsx`, `practice-tests-hub-client.tsx`, `question-bank-practice-client.tsx` |
| Navigation | `learner-shell-primary-nav.tsx`, `site-header.tsx` |
| Pricing (skeleton only) | `pricing-page-client.tsx` |

---

## Per-file changes

### `nursenest-core/src/lib/theme/marketing-hero-pattern.ts`

- **Change:** `MARKETING_PRIMARY_CTA_COMPACT_CLASS` and `MARKETING_SECONDARY_CTA_COMPACT_CLASS`: `min-h-[40px]` → `min-h-11` (44px). Kept `sm:min-h-0` so **desktop/tablet compact controls stay visually unchanged** above the `sm` breakpoint.

- **Why safe:** Same classes, only default (mobile-first) min-height increases; `sm:min-h-0` restores prior desktop density.

### `nursenest-core/src/components/marketing/email-signup-banner.tsx`

- **Change:** Outer card `p-6` → `p-4 sm:p-6`. Email input `min-w-[220px]` → `w-full min-w-0 … sm:min-w-[220px] sm:w-auto`.

- **Why safe:** Tighter padding only below `sm`; input still gets `min-w-[220px]` in horizontal `sm+` layout, avoiding overflow on small widths.

### `nursenest-core/src/components/marketing/home-restored-client.tsx`

- **Change:** Root div added `min-w-0` next to existing `overflow-x-hidden`.

- **Why safe:** Lets flex descendants shrink correctly on narrow viewports; does not remove overflow guard or alter structure.

### `nursenest-core/src/components/marketing/marketing-hero-carousel.tsx`

- **Change:** Overlay kicker: `text-[10px]` → `text-xs` (both overlay instances). Carousel dots: outer `button` is now `h-11 w-11` with inner `span` carrying the previous visual dot sizes; added `group` / `group-hover` on inner span for hover parity.

- **Why safe:** Dot appearance unchanged at a glance; **desktop** row spacing similar (`gap-2`); hit targets improve on phones only.

### `nursenest-core/src/components/lessons/pathway-lesson-detail-header.tsx`

- **Change:** Breadcrumb nav `text-[11px]` → `text-xs` (12px). Hero horizontal padding `px-3` → `px-4` below `sm` (kept `sm:px-5`).

- **Why safe:** Slightly larger readable metadata on small screens; `sm:` restores prior horizontal padding on larger breakpoints.

### `nursenest-core/src/app/globals.css`

- **Change:** `.nn-lesson-prose` / `.nn-lesson-content.nn-lesson-prose`: added `box-sizing: border-box` and `min-width: 0`.

- **Why safe:** Standard flex/grid fix to prevent min-content overflow; typography and max-width rules unchanged.

### `nursenest-core/src/app/mobile-ux-standards.css`

- **Change:** Under existing `@media (max-width: 767.98px)` block: `table` gets `display: block`, `max-width: 100%`, `overflow-x: auto`; `img` in lesson prose gets `max-width: 100%`, `height: auto`.

- **Why safe:** Scoped to **mobile only**; matches existing `pre` overflow pattern; desktop table layout unchanged.

### `nursenest-core/src/components/flashcards/flashcards-hub-client.tsx`

- **Change:** Filter preset buttons: `min-h-11`, `py-2`, `text-sm` with `sm:min-h-0 sm:py-1.5 sm:text-xs`. Deck size count buttons: `min-h-11`, `py-2`, `text-sm` with `sm:min-h-0 sm:py-1`.

- **Why safe:** Restores compact density from `sm` up; improves tap targets on phones only.

### `nursenest-core/src/components/study/flashcard-viewer.tsx`

- **Change:** Rating buttons: `px-0.5` → `px-1`, `text-[11px]` → `text-xs`.

- **Why safe:** Same grid and `min-h-11`; slightly more readable labels on narrow widths without changing layout.

### `nursenest-core/src/components/student/practice-test-runner-client.tsx`

- **Change:** `text-[10px]` labels/chips → `text-xs`. Question column `overflow-x-hidden` → `overflow-x-auto`. CAT / linear / legacy footers: Previous/Next/Submit/Finish/Advance buttons get `min-h-11` + larger mobile padding, reset with `sm:min-h-0 sm:px-2 sm:py-1.5` (or `sm:py-1.5` where `px-3` already). Right action column wrappers: `min-w-[5.5rem]` → `min-w-0 shrink … sm:min-w-[5.5rem] sm:shrink-0`.

- **Why safe:** Wider content scrolls instead of clipping; **≥sm** footer control dimensions match prior Tailwind intent; timer column can shrink on very narrow widths only.

### `nursenest-core/src/components/student/question-bank-practice-client.tsx`

- **Change:** Two scroll regions: `overflow-x-hidden` → `overflow-x-auto`.

- **Why safe:** Same pattern as practice runner; avoids clipping wide stems; desktop scrollbars only appear when content overflows.

### `nursenest-core/src/components/student/pathway-cat-session-start-client.tsx`

- **Change:** Four fallback lesson link buttons: `min-h-10` → `min-h-11`.

- **Why safe:** One token bump; no href/onClick changes.

### `nursenest-core/src/components/student/practice-tests-hub-client.tsx`

- **Change:** All `inline-flex min-h-10` hub CTAs → `inline-flex min-h-11 … sm:min-h-10`.

- **Why safe:** Touch-friendly below `sm`; **sm+** height returns to 2.5rem row behavior.

### `nursenest-core/src/components/layout/learner-shell-primary-nav.tsx`

- **Change:** Pathway pill `max-w-[5.5rem]` → `max-w-[min(100%,8rem)]` (still `truncate`; still `sm:max-w-none`).

- **Why safe:** Only affects small viewports before `sm:max-w-none`; desktop unlimited width unchanged.

### `nursenest-core/src/components/layout/site-header.tsx`

- **Change:** Mobile drawer section labels: `text-[11px]` → `text-xs sm:text-[11px]` (two occurrences).

- **Why safe:** Slightly larger base copy on phones; **sm+** restores 11px look.

### `nursenest-core/src/components/marketing/pricing-page-client.tsx`

- **Change:** `PricingPlanGridSkeleton` article: `min-h-[26rem]` → `min-h-[20rem] sm:min-h-[26rem]` (xl min-height unchanged).

- **Why safe:** Skeleton only; reduces empty vertical stretch on short phones; **sm+** matches previous min height.

---

## Not changed (by design)

- **Stripe Checkout** iframe (external).  
- **Business logic** in practice/CAT flows (only class names).  
- **Home root** `overflow-x-hidden` kept (audit alternative was larger refactor).

