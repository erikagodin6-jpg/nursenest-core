# Mobile responsiveness validation

**Date:** 2026-05-05  
**Scope:** Static code review + layout/CSS contract checks against the requested surfaces (homepage, lessons, flashcards, practice/CAT, navigation).  
**Not performed:** Live browser matrix, real-device safe-area QA, or pixel-level comparison on every route in the monorepo.

---

## Verdict summary

| Area | Verdict | Notes |
|------|---------|--------|
| **Homepage (marketing default)** | **PASS** (code-level) | Root shell uses `min-w-0` + `overflow-x-hidden`; comparison table is `md+` only with `overflow-x-auto`; mobile uses stacked list. |
| **Lessons (learner pathway)** | **PASS** (code-level) | `mobile-ux-standards.css` constrains `pre`, `table`, and `img` under `.nn-lesson-prose` / `.nn-lesson-content` on small viewports; iOS momentum scroll on `#nn-learner-main`. Residual risk is **CMS/HTML edge cases** not covered by those selectors. |
| **Flashcards** | **MINOR ISSUE** | Viewer uses `min-w-0` / `break-words` / stacked rating grid; pathway hub not deeply grepped—**hub screens need spot-check**. Subtopic on card front uses **`truncate`** → intentional ellipsis, not full text. |
| **Practice / CAT** | **MINOR ISSUE** | Split runner uses `min-w-0 max-w-full`; exam stacks have narrow-viewport touch floors in `globals.css`. `nn-question-session-primary` still allows **`overflow-x-auto`** in some modes → **scoped** horizontal scroll possible (not whole-page if body lock holds). |
| **Navigation (marketing + learner)** | **PASS** (code-level) | Escape closes drawers, `overflow: hidden` on `body` while menus open, `touch-manipulation` on key controls, learner chrome `overflow-x-clip`, bottom nav `min-h-12` + wider chips. |
| **Entire app (exhaustive)** | **MINOR ISSUE** | Hundreds of routes/components exist outside this audit; **cannot** certify “nowhere” horizontal scroll without automated visual or Playwright mobile runs. |

**Overall:** **MINOR ISSUE** — No **FAIL** items were identified on the audited surfaces, but coverage is incomplete and a few **intentional** truncations / scoped overflows remain.

---

## Methodology

1. **Global layout contract** — `globals.css` (`html, body { overflow-x: hidden; max-width: 100vw; }`) and `mobile-ux-standards.css` (learner lesson overflow rules).  
2. **Targeted reads/greps** — Homepage shell (`home-restored-client.tsx`), comparison section, learner layout shell, flashcard viewer, practice runner fragments, navigation components.  
3. **Risk patterns** — `100vw`, `min-w-[640px]` tables without mobile fallback, missing `min-w-0` in flex children, overlapping `fixed`/`sticky` without safe-area or z-index discipline.

---

## Checklist (requested criteria)

### No horizontal scrolling anywhere

- **Global:** Body is **`overflow-x: hidden`**, which suppresses **document-level** horizontal scroll; wide content may be **clipped** unless a child provides its own scroll (`overflow-x: auto`).  
- **Lessons:** Tables/code blocks get **`overflow-x: auto`** inside content — acceptable **component-level** scroll.  
- **Practice:** `practice-test-runner-client.tsx` uses **`overflow-x-auto`** on `.nn-question-session-primary` in at least one layout path → possible **inner** horizontal panning.  
- **Verdict:** **MINOR ISSUE** — “No horizontal scrolling anywhere” is **not strictly true** if inner regions scroll; it is **true** for typical full-page bleed when global CSS applies.

### No broken layouts on small screens

- **Homepage:** Marketing root `flex … min-w-0 overflow-x-hidden`; hero uses responsive typography and carousel lite on mobile perf path.  
- **Learner shell:** Sticky stack uses `flex-wrap`, `min-w-0`, tighter gaps on small widths (`layout.tsx`).  
- **Verdict:** **PASS** (code-level) for audited shells; unvisited routes remain **unknown**.

### No overlapping components

- **Marketing drawers:** Portaled overlay `z-[200]` / context `z-[210]` vs header `z-50` — stacking order is coherent.  
- **Learner:** Sticky header `z-50`, bottom nav `z-50` — same tier; order/DOM and padding on `main` (`pb-[calc(…+5rem+safe-area)]`) mitigate content hiding behind fixed bottom bar.  
- **Verdict:** **PASS** (code-level); **runtime** overlap (e.g. exam chrome + bottom nav) still deserves **device check**.

### No clipped text

- **Intentional truncation:** `LearnerShellPathwayPill` / bottom-nav pathway pill **`truncate`**; flashcard subtopic **`truncate`**; marketing header tier pill **`truncate`** on narrow widths.  
- **Verdict:** **MINOR ISSUE** — Clipping is **by design** for density; if product requires full labels, layout would need change (out of scope for “validation only”).

### Consistent spacing

- **Learner shell:** Uses shared rhythm tokens and recent tightening (`gap-1.5 md:gap-2`, `py-1.5` on small).  
- **Marketing homepage:** Section shells use `max-w-6xl` + `px-4` / responsive padding patterns.  
- **Verdict:** **PASS** (coarse consistency); fine-grained token parity across **all** marketing pages not verified.

---

## Surface notes

### Homepage

- **PASS:** `HomeRestoredClient` outer `overflow-x-hidden` + `min-w-0`.  
- **PASS:** `HomeComparisonSection` — wide table only `md:block` with wrapper `overflow-x-auto`; mobile `md:hidden` stacked list.  
- **MINOR:** Other homepage sections (lazy placeholders, blog teaser, region cards) were not line-by-line reviewed.

### Lessons

- **PASS:** `mobile-ux-standards.css` @media `max-width: 767.98px` rules for `pre`, `table`, `img` under lesson prose classes.  
- **MINOR:** Arbitrary lesson HTML outside those wrappers could still force layout issues — mitigated globally by `body` overflow-x hidden at cost of **clipping** vs scroll.

### Flashcards

- **PASS:** `flashcard-viewer.tsx` — `w-full max-w-full min-w-0`, stacked rating controls on small breakpoints, `touch-manipulation` on primary actions.  
- **MINOR:** Hub/list surfaces (`flashcards-hub-client` etc.) not exhaustively reviewed in this pass.

### Practice / CAT

- **PASS:** Exam/split layouts use `min-h-0 min-w-0`, `overflow-hidden` on chrome columns; `globals.css` includes narrow-viewport option touch floors for CAT exam stack compaction.  
- **MINOR:** Inner `overflow-x-auto` on question session column — watch for accidental whole-width overflow on unusual stems.

### Navigation

- **PASS:** `site-header.tsx` — Escape handling, body scroll lock while drawer open, drawer link grid stacks to single column below `400px` width, touch targets.  
- **PASS:** `learner-shell-primary-nav.tsx` + `layout.tsx` — bottom nav tap heights, `overflow-x-clip` on sticky shell, utility cluster `min-w-0`.

---

## Issues register

| ID | Severity | Finding | Evidence / location |
|----|----------|---------|---------------------|
| M1 | **MINOR** | Global `html, body { overflow-x: hidden }` prevents page-level horizontal scroll but can **clip** overflowing descendants without an inner scroll container. | `nursenest-core/src/app/globals.css` (lines ~10–14) |
| M2 | **MINOR** | Pathway / header pills use **`truncate`** — long localized labels ellipsize. | `learner-shell-primary-nav.tsx`, `site-header.tsx`, `LearnerShellPathwayPill` |
| M3 | **MINOR** | Practice runner may show **horizontal scroll inside** a panel, not the document. | `practice-test-runner-client.tsx` (`.nn-question-session-primary` + `overflow-x-auto`) |
| M4 | **MINOR** | **Coverage gap:** Admin tools, account subpages, marketing deep pages, and OSCE flows were not audited. | N/A |

**FAIL:** None recorded in this pass.

---

## Recommended verification (to upgrade to PASS)

1. **Playwright mobile project** — `npm run test:e2e:mobile` (if stable in CI) against: `/`, localized marketing home, `/app`, `/app/lessons/[id]`, `/app/flashcards`, `/app/practice-tests` (or active exam route), open/close header drawers.  
2. **Manual sweep** — iOS Safari + Chrome Android: rotate portrait/landscape, verify safe-area on fixed bottom nav and marketing drawers.  
3. **Visual diff** — Optional Percy/Chromatic on `md` and `sm` breakpoints for homepage + learner dashboard.

---

## Sign-off

- **Automated device validation:** **Not executed** in this session.  
- **Static assessment of requested surfaces:** **MINOR ISSUE** overall (see table); individual requested areas are **PASS** or **MINOR** as above.  
- **Silent ignores:** None — limitations and intentional tradeoffs are listed explicitly.

---

## Playwright mobile E2E — automated run (2026-05-05)

**Command:**

```bash
cd /root/nursenest-core && npm run test:e2e:mobile
```

(`nursenest-core` runs `pretest:e2e:mobile` → `npm run i18n:compile` from repo root, then `npx playwright test -c playwright.mobile.config.ts`.)

### Result summary

| Outcome | Count |
|--------|------:|
| Passed | 12 |
| Skipped | 6 |
| Failed | 0 |

**Exit code:** 0

### Per-test (latest run)

| Project | Test | Result |
|---------|------|--------|
| mobile-pixel | Free learner — dashboard + paywall | skip — no `QA_FREE_EMAIL` + `QA_FREE_PASSWORD` |
| mobile-pixel | Free learner — Flashcards nav | skip — same |
| mobile-pixel | Marketing — `/signup` bounded width | pass |
| mobile-pixel | Marketing — `/us/rn/nclex-rn` | pass |
| mobile-pixel | Marketing — `/us/rn/nclex-rn/lessons` | pass |
| mobile-pixel | Hamburger open/close | pass |
| mobile-pixel | `/blog` (slow SSR) | skip — `E2E_MOBILE_INCLUDE_BLOG=1` not set |
| mobile-pixel | Homepage + bounded width | pass |
| mobile-pixel | `/pricing` main + bounded width | pass |
| mobile-iphone | (same free learner tests) | skip — same |
| mobile-iphone | (same marketing + regression) | pass |
| mobile-iphone | `/blog` | skip — opt-in |

### Route-level diagnosis

| Route | Status | Root cause / fix |
|-------|--------|------------------|
| `/signup` | pass | Marketing i18n must load merged **public shards** (not only monolithic JSON); missing keys caused 500s. Added `pages.pricing.narrative.newgrad.*` and `footer.regionalHubLinks` in `tools/i18n/marketing/marketing-en.json` + `i18n:compile` so `/pricing` RSC and footer do not throw for `NEW_GRAD` tier. |
| `/pricing` | pass | Same; strict `getRequiredPublicMetadataLine` for `pages.pricing.narrative.newgrad.subhead` required newgrad narrative block. |
| `/blog` | skip | Opt-in only when `E2E_MOBILE_INCLUDE_BLOG=1`. |
| Dev server / ERR_CONNECTION_REFUSED | pass | `webServer.timeout` 300s; `mobile-iphone` depends on `mobile-pixel`; `workers: 1`. |

### Layout health

Overflow checks use **`scrollWidth` / `clientWidth`** (`assertMobileHorizontalLayoutHealth`); no reliance on `overflow-x: hidden` as the pass criterion for E2E.

### Artifacts

- Failure traces/screenshots: `nursenest-core/test-results/` (only on failure; clean run produced none).
- Agent full log: Cursor session output for `npm run test:e2e:mobile` (~3m).

### Remaining console noise (non-blocking)

`next dev` logs may still show missing **home hero carousel** keys (`components.homeHeroCarousel.slide03.label`, `slide09.label`, `pages.home.carouselHandoff.fallbackCta`) — separate i18n/content follow-up; mobile suite does not assert them.

