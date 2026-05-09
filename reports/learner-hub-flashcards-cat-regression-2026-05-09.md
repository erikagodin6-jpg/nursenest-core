# Learner hub, flashcards, and CAT regression fix (2026-05-09)

## Summary

Surgical fixes for three reported learner surfaces: **app lessons list (hub)**, **flashcards hub**, and **legacy `/app/cat` deep links** toward the adaptive (CAT) entry.

## Root cause (per area)

### 1. Lessons hub (`/app/lessons` list)

- **Cause:** The virtualized list scroll container used `style={{ contain: "strict" }}`. In CSS, `strict` includes **size containment**: the element's size is not derived from descendants. The hub only set `max-height`, not a fixed height, so the scroll region could **collapse to zero height** in the learner shell, making the list appear empty or broken.
- **Fix:** Use `contain: "layout paint"` (skips size containment) and document why `strict` is unsafe here.
- **Files:** `nursenest-core/src/components/student/learner-lessons-virtual-list.tsx`, `nursenest-core/src/components/student/learner-lessons-virtual-list.contract.test.ts`

### 2. Flashcards page (`/app/flashcards`)

- **Cause:** `LearnerStudyPageShell` added a second layer of horizontal padding (`px-4 sm:px-6`) on top of `(learner)/layout`'s `nn-learner-app` padding. That **double inset** narrowed the main column vs `/app/lessons` (which does not use the shell's extra padding), so the hub felt squeezed or misaligned after recent layout work.
- **Fix:** Remove default horizontal padding from `LearnerStudyPageShell`; horizontal inset comes from the learner layout only, matching the lessons hub width.
- **Files:** `nursenest-core/src/components/learner-study-ui/learner-study-page-shell.tsx` (also affects practice tests hub and study-tools surfaces that use the same shell).

### 3. CAT / adaptive entry

- **Cause:** Legacy route `/app/cat` redirected all query strings to `/app/practice-tests?...`. Bookmarks and handoffs with `pathwayId` landed on the **generic practice hub** instead of the **CAT launch** path (`/app/practice-tests/cat-launch?...`).
- **Fix:** When `pathwayId` is present (length > 2, matching cat-launch's guard), redirect to `/app/practice-tests/cat-launch?` plus preserved query string; otherwise keep redirecting to `/app/practice-tests` as before.
- **Files:** `nursenest-core/src/app/(student)/app/(learner)/cat/page.tsx`, `nursenest-core/src/app/(student)/app/(learner)/cat/cat-alias-redirect.contract.test.ts`

## Commands run

From `nursenest-core/` (app package):

- `npm run typecheck:critical` — pass
- Targeted contract tests (virtual list, cat alias, learner-study-ui shell) — pass

`test:pathway-lessons` in `nursenest-core/package.json` includes the two new contract tests.

## Remaining risks / follow-ups

- **Browser verification:** Spot-check `/app/lessons` and `/app/flashcards` (subscriber) for scroll height and column width.
- **CAT session runtime:** In-session issues need a separate investigation (runner / API).
- **Study tools:** Confirm no page relied on the removed inner padding alone.
