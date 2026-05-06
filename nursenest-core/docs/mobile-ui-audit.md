# Mobile UI audit — Next.js learner + marketing surfaces

**Scope:** NurseNest app under `nursenest-core/` (Next.js App Router).  
**Method:** Static review of prioritized routes/components (Tailwind classes, overflow, touch targets, breakpoints). No visual redesign.  
**Date:** 2026-05-05  

**Note:** If your process expects `reports/mobile-ui-audit.md`, copy or symlink this file from `docs/mobile-ui-audit.md` (write access to `reports/` was denied in this environment).

---

## Summary

| Area | Overall | Notes |
|------|---------|--------|
| Homepage (marketing) | **Good baseline** | Hero CTAs use shared `min-h-[48px]` patterns; pathway grid is responsive. |
| Learner shell / nav | **Mixed** | Desktop study pills use dense padding (desktop-only). Bottom nav meets `min-h-11` but uses very small type + narrow max-width. |
| Practice tests / CAT | **Improved (this pass)** | Inner content used fixed `px-6` on all breakpoints — gutters tightened on narrow phones. |
| Flashcards | **Improved (this pass)** | Paywall/locked state lacked horizontal padding vs error state — aligned. |
| Lessons | **Needs spot-check** | Large RSC page; `min-w-0` present on main column; full pass best done in browser + device lab. |

---

## Changes applied (low-risk)

1. **`src/components/student/practice-test-runner-client.tsx`**  
   - Replaced `max-w-[900px] px-6` → `max-w-[900px] px-4 sm:px-6` (8 containers).  
   - **Why safe:** Preserves max width and vertical rhythm; only adds smaller default horizontal inset on &lt;640px to avoid edge-clipping on 320–375px devices.

2. **`src/components/marketing/home-restored-client.tsx`** (`HomeStableMarketingPlaceholder` link)  
   - Added `min-h-[44px]` to the section CTA link.  
   - **Why safe:** Apple HIG / WCAG 2.5.5 touch target guidance; no color or copy change.

3. **`src/app/(student)/app/(learner)/flashcards/page.tsx`** (subscriber paywall branch)  
   - Wrapped locked content in `mx-auto max-w-3xl … px-4 sm:px-6` to match the error branch spacing.  
   - **Why safe:** Layout-only; aligns with shell padding used elsewhere.

---

## Homepage

| Finding | Severity | Status |
|---------|----------|--------|
| Root wrapper `overflow-x-hidden` on `home-restored-client` | Low–medium | **Documented** — prevents accidental horizontal scroll but can clip rare overflowing children (e.g. negative margins, wide tables). Prefer ensuring children use `min-w-0` / `max-w-full` over removing without QA. |
| Hero (`home-conversion-hero`) uses `max-w-6xl px-4`, CTAs `flex-wrap gap-3` | OK | **PASS** |
| Headline `max-w-[22ch]` | OK | **PASS** — improves readability; not a mobile bug. |
| Audience pathway grid `grid gap-5 sm:grid-cols-2 lg:grid-cols-4` | OK | **PASS** |
| Stable placeholder bands use `px-4 … sm:px-6` | OK | **PASS** |
| Placeholder text links previously &lt;44px tap height | Medium | **Fixed** — `min-h-[44px]` on link (see above). |

---

## Navigation / menus

### Marketing (`site-header.tsx`)

| Finding | Severity | Status |
|---------|----------|--------|
| Mobile CTAs use `min-h-[44px]` with `max-w-[38%]` / `max-w-[52%]` to fit two buttons | Low | **PASS** — intentional density; touch minimum met. |
| Full-screen mobile drawer `h-[100dvh]` | OK | **PASS** — good for mobile viewport units. |
| Tier pill `max-w-[40vw] truncate` | Low | **NEEDS REVIEW** — long labels may truncate aggressively on small phones; product decision. |

### Learner shell (`learner-shell-primary-nav.tsx` + `app/(learner)/layout.tsx`)

| Finding | Severity | Status |
|---------|----------|--------|
| Desktop study links hidden below `md` (`max-md:hidden`); mobile uses bottom nav | OK | **PASS** — correct split. |
| Desktop pills: `py-1.5` / `px-2.5` | N/A (desktop) | **PASS** — not primary touch surface on small screens. |
| Bottom nav links: `min-h-11`, but `text-[11px]`, `max-w-[5.25rem]`, `px-1.5` | Medium | **NEEDS REVIEW** — vertical touch OK; labels often truncate with many nav items. Consider fewer visible items, scroll-snap row, or `text-xs` minimum when count &gt; N (would be a small product tweak). |
| Shell content `pb-[calc(...+5rem+safe-area)]` for bottom nav clearance | OK | **PASS** |

### Learner account sidebar (`learner-account-nav.tsx`)

| Finding | Severity | Status |
|---------|----------|--------|
| Horizontal scroll on small `lg` for dense nav groups | Low | **PASS** — `overflow-x-auto` + `lg:overflow-x-visible` is intentional. |
| Section labels `text-[11px]` | Low | **NEEDS REVIEW** — readable but near minimum; acceptable for eyebrow. |

---

## Practice tests / CAT (`practice-test-runner-client.tsx`)

| Finding | Severity | Status |
|---------|----------|--------|
| Multiple `max-w-[900px]` content columns | OK | **PASS** — reasonable reading width. |
| Uniform `px-6` on narrow viewports | Medium | **Fixed** — `px-4 sm:px-6`. |
| Split layout `max-w-[min(112rem,calc(100vw-1.5rem))]` with `px-2` on mobile | OK | **PASS** — responsive to viewport. |
| Small chrome badges `text-[10px]` / compact buttons | Low | **NEEDS REVIEW** — decorative/dense UI; not primary navigation. |
| `overflow-hidden` on practice route page wrapper (`practice-tests/[id]/page.tsx`) | Low | **PASS** — paired with `min-w-0` flex pattern for exam chrome. |

---

## Flashcards

| Finding | Severity | Status |
|---------|----------|--------|
| Hub client composes `LearnerStudyPageShell` / filters — responsive behavior mostly delegated | — | **NOT CHECKED** in depth (large client). |
| Locked paywall layout missing `px-*` vs error state | Medium | **Fixed** — `mx-auto max-w-3xl px-4 sm:px-6`. |

---

## Lessons

| Finding | Severity | Status |
|---------|----------|--------|
| `lessons/[id]/page.tsx` uses `nn-lesson-main min-w-0` | OK | **PASS** — helps flex overflow. |
| Marketing pathway lesson body + app lesson detail are large surfaces | — | **NOT CHECKED** exhaustively — recommend Playwright mobile viewport snapshots (`tests/e2e/`) and manual pass on iOS Safari (100vh / safe-area). |
| Lesson drawer: desktop fixed `w-[380px]`; mobile bottom sheet | OK | **PASS** — responsive pattern. |

---

## Cross-cutting patterns to watch (repo-wide)

1. **`overflow-x-hidden` on marketing roots** — tradeoff vs clipping; prefer fixing overflow sources.  
2. **`text-[10px]` / `text-[11px]`** — legal for dense badges; avoid for primary actions without `min-h` compensation.  
3. **`w-[…px]`** — acceptable when paired with `max-w-full` / `min-w-0` inside flex; audit when adding new fixed-width modals.  
4. **Touch targets** — aim for ≥44×44px for primary controls (WCAG 2.5.5 Level AAA guidance); `min-h-11` (2.75rem ≈ 44px) is used in learner bottom nav.  

---

## Recommended follow-ups (no code in this pass)

1. Run **Playwright** mobile projects against: home, `/app/lessons`, `/app/flashcards`, `/app/practice-tests` (configs already exist under `nursenest-core/`).  
2. **iOS Safari**: verify sticky learner header + bottom nav + `100dvh` drawers.  
3. If bottom-nav label truncation is reported, consider a **horizontal scroll** row with larger type instead of many `flex-1` compressed pills.  
4. Optional: ESLint / custom rule to flag new `px-6` without `sm:` on full-bleed learner/marketing sections (heuristic only).

---

## Files reviewed (primary)

- `src/components/marketing/home-restored-client.tsx`  
- `src/components/marketing/home-conversion-hero.tsx`  
- `src/lib/theme/marketing-hero-pattern.ts`  
- `src/components/layout/site-header.tsx` (partial)  
- `src/components/layout/learner-shell-primary-nav.tsx`  
- `src/app/(student)/app/(learner)/layout.tsx`  
- `src/components/student/practice-test-runner-client.tsx` (partial + grep)  
- `src/app/(student)/app/(learner)/flashcards/page.tsx`  
- `src/app/(student)/app/(learner)/lessons/[id]/page.tsx` (partial)  
- `src/components/lessons/lesson-notes-drawer.tsx` (drawer breakpoints)  
- `src/components/student/learner-account-nav.tsx`  

---

*End of audit.*
