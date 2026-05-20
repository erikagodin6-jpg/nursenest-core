# Mobile UI audit (320px–430px / ~360px)

**Scope:** Next.js App Router learner + marketing surfaces — homepage, lesson pages, flashcards, practice tests / CAT, navigation/header, pricing/checkout.

**Method:** Static code review and Tailwind/class grep against `nursenest-core/src`. **No** DevTools device emulation or visual QA was run in this pass; issues are **suspected** from patterns known to fail on narrow viewports until verified in-browser.

**Instruction:** No code changes were made for this document.

---

## Summary

| Area | Risk themes |
|------|-------------|
| Homepage | Root `overflow-x-hidden`; compact marketing CTAs at 40px min-height; hero carousel dot controls are visually tiny |
| Lessons | Lesson hero `overflow-hidden`; long lesson HTML (tables/code) may still overflow unless global prose handles it |
| Flashcards | Hub filter chips use `py-1` / `py-1.5` + `text-xs` (short tap targets); viewer rating row uses `text-[11px]` on narrow |
| Practice / CAT | Runner uses `overflow-x-hidden`, `text-[10px]` badges, `px-2 py-1.5` controls, `min-w-[5.5rem]` timer columns; CAT start uses `min-h-10` lesson chips |
| Nav / header | Mobile menu/settings icons `h-10 w-10` (40px) with skip class; pathway pill in bottom nav truncates aggressively |
| Pricing / checkout | Tall pricing card skeletons; comparison table horizontal scroll on `md+` only; Stripe checkout is hosted (app UI stops at pricing CTAs) |

---

## Issues (detailed)

Each row: **Route** · **File** · **Problem** · **Suspected cause** · **Recommended fix (not implemented)**

### Homepage / marketing root

1. **Route:** `/` and locale marketing home (e.g. `/en`, per app routing)  
   **File:** `nursenest-core/src/components/marketing/home-restored-client.tsx`  
   **Problem:** Root wrapper uses `overflow-x-hidden`, which can clip horizontally overflowing descendants or focus rings/shadows at the viewport edge.  
   **Suspected cause:** `overflow-x-hidden` on the outer `flex w-full … flex-col` root.  
   **Recommended fix:** Prefer `min-w-0` on flex children and fix overflow sources; use `overflow-x-hidden` only on the specific section that bleeds, or `overflow-x-clip` with padding for focus visibility.

2. **Route:** Homepage hero and marketing sections using compact CTAs  
   **File:** `nursenest-core/src/lib/theme/marketing-hero-pattern.ts`  
   **Problem:** `MARKETING_PRIMARY_CTA_COMPACT_CLASS` / `MARKETING_SECONDARY_CTA_COMPACT_CLASS` use `min-h-[40px]` below `sm`, under common ~44px touch-target guidance.  
   **Suspected cause:** `min-h-[40px]` with `sm:min-h-0`.  
   **Recommended fix:** Raise default compact CTA to `min-h-11` (44px) or add `min-h-[44px]` until `sm`; keep density via horizontal padding rather than height.

3. **Route:** Homepage (and any view using `MarketingHeroCarousel`)  
   **File:** `nursenest-core/src/components/marketing/marketing-hero-carousel.tsx`  
   **Problem:** Carousel “dot” controls are very small (`h-2 w-2` / `h-1.5 w-1.5` inactive states), which is hard to tap accurately on phones and may fail accessibility spacing expectations.  
   **Suspected cause:** `rounded-full` buttons sized as visual dots only, no invisible hit-area expansion.  
   **Recommended fix:** Keep visual size but add `p-3` hit slop with negative margin, or use `min-h-11 min-w-11` transparent targets with inner visual dot.

4. **Route:** Homepage hero carousel overlay captions  
   **File:** `nursenest-core/src/components/marketing/marketing-hero-carousel.tsx`  
   **Problem:** Overlay label uses `text-[10px]` on base breakpoint — very small body-adjacent copy on small phones.  
   **Suspected cause:** `text-[10px]` with `sm:text-[11px]`.  
   **Recommended fix:** Use `text-xs` (12px) minimum for non-statutory fine print, or reserve 10px only for non-interactive metadata with sufficient contrast and line-height.

5. **Route:** Homepage email capture (banner)  
   **File:** `nursenest-core/src/components/marketing/email-signup-banner.tsx`  
   **Problem:** From `sm:` layout is row; input has `min-w-[220px]` next to submit — near `sm` (~640px) width, long copy + button can stress horizontal space; submit uses compact primary (`min-h-[40px]`).  
   **Suspected cause:** `sm:flex-row` + `min-w-[220px]` + `MARKETING_PRIMARY_CTA_COMPACT_CLASS`.  
   **Recommended fix:** Stack until `md:` if needed, replace `min-w-[220px]` with `min-w-0 flex-1 max-w-full`, bump compact CTA min-height (see issue 2).

### Lesson pages

6. **Route:** Marketing pathway lesson detail, e.g. `/[locale]/[slug]/[examCode]/lessons/[lessonSlug]`  
   **File:** `nursenest-core/src/components/lessons/pathway-lesson-detail-header.tsx`  
   **Problem:** Hero band uses `overflow-hidden` — decorative or focus content that extends past rounded corners may clip.  
   **Suspected cause:** `relative overflow-hidden rounded-xl …` on hero container.  
   **Recommended fix:** Scope `overflow-hidden` to inner media only; allow outer header to use `overflow-visible` for outlines, or add inner padding.

7. **Route:** Same as above (lesson body)  
   **File:** `nursenest-core/src/components/lessons/pathway-lesson-body.tsx` (and global `.nn-lesson-prose` in CSS if present)  
   **Problem:** Wide tables, preformatted blocks, or long unbroken strings in lesson HTML can cause horizontal scroll or overflow on 320px if prose styles do not enforce `overflow-x-auto` / `max-w-full` on those elements.  
   **Suspected cause:** Content-driven width; not verified per-block in CSS in this audit.  
   **Recommended fix:** Ensure `prose` (or `nn-lesson-prose`) includes `overflow-x-auto` on `pre`/`table`, `word-break`/`overflow-wrap` on code, and `max-w-full` on images/iframes.

8. **Route:** `/app/(learner)/lessons` and related lesson list surfaces  
   **File:** `nursenest-core/src/components/student/learner-lessons-search-toolbar.tsx`  
   **Problem:** Search/filter toolbars may still use dense controls on mobile — verify tap heights and text on narrow widths after any local edits.  
   **Suspected cause:** Toolbar patterns with `text-xs` / default button heights without consistent `min-h-11`.  
   **Recommended fix:** Standardize toolbar controls to `min-h-11` + readable `text-sm` on `< sm`, reset at `sm:` if desired.

### Flashcards

9. **Route:** `/app/(learner)/flashcards` (hub)  
   **File:** `nursenest-core/src/components/flashcards/flashcards-hub-client.tsx`  
   **Problem:** Filter-style chips use `py-1` / `py-1.5` with `text-xs` — vertical tap target likely under ~44px.  
   **Suspected cause:** `rounded-full … px-3 py-1.5 text-xs` (and similar `py-1` variant).  
   **Recommended fix:** Use `min-h-11` + `py-2` (or `px-3 py-2.5`) and `text-sm` on narrow; keep compact on `md+` if needed.

10. **Route:** `/app/(learner)/flashcards/[deckRef]` (and shared viewer)  
    **File:** `nursenest-core/src/components/study/flashcard-viewer.tsx`  
    **Problem:** Rating / difficulty controls use `text-[11px]` with tight horizontal padding at base breakpoint — readable tap width may be marginal on 320px for multiple side-by-side buttons.  
    **Suspected cause:** `min-h-11` present but `text-[11px] … sm:text-xs` and `px-0.5` on narrow.  
    **Recommended fix:** Slightly increase horizontal padding on default breakpoint or allow wrap/stack for 3+ controls under a narrow-only breakpoint.

### Practice tests / CAT

11. **Route:** `/app/(learner)/practice-tests` (session runner — also used for timed flows)  
    **File:** `nursenest-core/src/components/student/practice-test-runner-client.tsx`  
    **Problem:** Question column uses `overflow-x-hidden` — wide question stems (images, tables) may be clipped instead of scrollable.  
    **Suspected cause:** `min-h-0 overflow-x-hidden overflow-y-auto` on `nn-question-session-primary`.  
    **Recommended fix:** Prefer `overflow-x-auto` on the content column or inner article; keep `min-w-0` on flex chain.

12. **Route:** Same  
    **File:** `nursenest-core/src/components/student/practice-test-runner-client.tsx`  
    **Problem:** Multiple UI chips and meta lines use `text-[10px]` — hard to read on high-DPI phones and fails comfortable body sizing for non-legal copy.  
    **Suspected cause:** `text-[10px] font-bold uppercase …` and badge `px-2 py-0.5 text-[10px]`.  
    **Recommended fix:** Standardize meta/chip text to `text-xs` (12px) minimum; use weight/color for hierarchy instead of 10px.

13. **Route:** Same  
    **File:** `nursenest-core/src/components/student/practice-test-runner-client.tsx`  
    **Problem:** Secondary actions use `px-2 py-1.5 text-xs` without explicit `min-h-11` — likely short tap targets.  
    **Suspected cause:** `inline-flex … px-2 py-1.5 text-xs`.  
    **Recommended fix:** Add `min-h-11 min-w-11` or `py-2.5 px-3` for touch; align with design system buttons.

14. **Route:** Same  
    **File:** `nursenest-core/src/components/student/practice-test-runner-client.tsx`  
    **Problem:** Timer / score areas use `min-w-[5.5rem]` — on very narrow split layouts, fixed min-width can squeeze question text or cause awkward wrapping in flex rows.  
    **Suspected cause:** `min-w-[5.5rem] text-right` blocks.  
    **Recommended fix:** Use `min-w-0` + `tabular-nums` on flexible text, or move timer to a stacked row under a `max-width` breakpoint.

15. **Route:** `/app/(learner)/cat` (CAT session start / gating)  
    **File:** `nursenest-core/src/components/student/pathway-cat-session-start-client.tsx`  
    **Problem:** Fallback lesson links use `min-h-10` with `text-xs` — below ~44px touch guidance.  
    **Suspected cause:** `inline-flex min-h-10 … px-3 text-xs`.  
    **Recommended fix:** Bump to `min-h-11` and consider `text-sm` on mobile.

16. **Route:** `/app/(learner)/practice-tests` (hub CTAs)  
    **File:** `nursenest-core/src/components/student/practice-tests-hub-client.tsx`  
    **Problem:** Several pill CTAs use `min-h-10` — slightly under common 44px thumb target.  
    **Suspected cause:** `inline-flex min-h-10 … rounded-full`.  
    **Recommended fix:** `min-h-11` for primary/secondary hub actions on touch breakpoints.

17. **Route:** Question bank practice (if distinct from hub)  
    **File:** `nursenest-core/src/components/student/question-bank-practice-client.tsx`  
    **Problem:** Session layout uses `overflow-x-hidden` in places — same clipping risk as practice runner for wide stems.  
    **Suspected cause:** `overflow-x-hidden` on session shell regions.  
    **Recommended fix:** Mirror runner fix: scoped `overflow-x-auto` on content, not outer column.

### Navigation / header / menus

18. **Route:** Global marketing + learner chrome using `SiteHeader`  
    **File:** `nursenest-core/src/components/layout/site-header.tsx`  
    **Problem:** Mobile-only menu and settings buttons are `h-10 w-10` (40px). Project uses `nn-skip-mobile-touch-target` — confirms awareness, but targets remain visually small for some users/devices.  
    **Suspected cause:** `h-10 w-10` + `p-0` icon buttons.  
    **Recommended fix:** If policy allows, use `h-11 w-11` with 44px hit slop, or enlarge invisible touch target while keeping icon size.

19. **Route:** Learner shell (bottom navigation)  
    **File:** `nursenest-core/src/components/layout/learner-shell-primary-nav.tsx`  
    **Problem:** Pathway / tier pill uses `max-w-[5.5rem] truncate` on small screens — pathway names become unreadable ellipses.  
    **Suspected cause:** `max-w-[5.5rem] … truncate sm:max-w-none`.  
    **Recommended fix:** Allow two-line wrap without truncate under a breakpoint, increase `max-w` to ~`8rem`, or show icon + short code only on mobile.

20. **Route:** Same (desktop study pills in responsive hybrid nav)  
    **File:** `nursenest-core/src/components/layout/learner-shell-primary-nav.tsx`  
    **Problem:** Intermediate breakpoints that still show horizontal study links may use shorter vertical padding than bottom nav — verify tap height where compact pills appear.  
    **Suspected cause:** Mixed nav density between `md`/`lg` tiers.  
    **Recommended fix:** Unify study links to `min-h-11` whenever they are primary touch targets.

### Pricing / checkout

21. **Route:** `/pricing`, `/[locale]/pricing`, pathway pricing e.g. `/[locale]/[slug]/[examCode]/pricing`  
    **File:** `nursenest-core/src/components/marketing/pricing-page-client.tsx`  
    **Problem:** Plan cards use `min-h-[26rem]` skeleton/article height — on short phones (e.g. 320×568) a single card can dominate the viewport and push comparison below excessive scroll.  
    **Suspected cause:** `min-h-[26rem]` / `xl:min-h-[25.5rem]` on card shell.  
    **Recommended fix:** Reduce min-height on `max-sm` or use `min-h-0` with internal spacing only; keep visual balance without forcing tall empty blocks.

22. **Route:** Same  
    **File:** `nursenest-core/src/components/marketing/pricing-page-client.tsx`  
    **Problem:** Fine print uses `text-[11px]` for trial/legal-adjacent lines — marginal readability on small phones.  
    **Suspected cause:** `text-[11px] leading-snug`.  
    **Recommended fix:** Use `text-xs` with slightly relaxed line-height unless legal requires 11px.

23. **Route:** Pricing marketing sections (comparison / FAQs)  
    **File:** `nursenest-core/src/components/marketing/pricing-sections.tsx`  
    **Problem:** Feature comparison lives in `overflow-x-auto` with `min-w-[min(100%,560px)]` — from `md` up, narrow tablets in landscape can show horizontal scrolling (acceptable if intentional; note for QA).  
    **Suspected cause:** Horizontal scroll container + table min width.  
    **Recommended fix:** Add sticky first column or card-based comparison for `md` only; document intentional scroll in UX spec.

24. **Route:** Checkout  
    **File:** Hosted Stripe Checkout (triggered from `pricing-page-client.tsx` via checkout API)  
    **Problem:** In-app responsive issues end at handoff to Stripe; card-field and wallet layout are Stripe-owned — only pre-checkout modals and errors are in-repo.  
    **Suspected cause:** N/A for Tailwind in checkout iframe.  
    **Recommended fix:** Audit consent modal (`fixed inset-0 … items-end`) on smallest devices for safe-area and keyboard overlap; verify `requestCheckout` error banners wrap with `break-words`.

---

## Out of scope / not fully audited

- **Admin**, **printables**, and **OSCE** surfaces.  
- **Per-locale string length** (German/French headlines in hero and pricing).  
- **Dynamic lesson HTML** without loading representative content.  
- **Truthpack** (`.vibecheck/truthpack/`) was not present in this workspace clone; routes were inferred from `nursenest-core/src/app` structure.

---

## Recommended verification pass (manual)

1. Chrome DevTools: iPhone SE (375×667), iPhone 12/13 (390×844), Galaxy S8 (~360), and **320px** custom.  
2. For each issue above, confirm **no unintended horizontal scroll** on `document.documentElement` vs inner scroll containers.  
3. **Tap test:** primary actions, carousel dots, practice runner controls, flashcard hub chips, header icons.
