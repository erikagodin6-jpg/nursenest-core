# Lesson detail premium modernization — report

**Date:** 2026-05-08  
**Scope:** Presentational only (layout shells, tokens, rhythm, loading chrome, i18n labels). No lesson JSON/SOT, section generation, linked-learning computation, slugs, SEO metadata, entitlement gates, progress semantics, catalog/indexing, analytics, or internal-linking behavior changes.

---

## 1. Audit (routes & surfaces)

| Surface | Route / entry | Shared components | Classification |
|--------|----------------|-------------------|----------------|
| Marketing pathway lesson | `[locale]/[slug]/[examCode]/lessons/[lessonSlug]` via `PathwayLessonDetailPageBody` | `PathwayLessonDetailHeader`, `LessonSectionNav`, `LessonSectionCard`, `PathwayLessonStudyRail`, `PathwayLessonQuickClinicalSummary`, deferred rails | **Real layout** (`nn-lesson-layout--triple`, article grid) + **semantic tokens** |
| Learner pathway lesson | `/app/lessons/[id]` (`pathway_ok`) | Same patterns + `LessonPageHeader`, `PremiumLessonShell` | **Layout + learner hero** panel |
| RN / PN / NP / allied / new-grad | Same templates; `nn-lesson-page-shell--np` etc. unchanged | Shared | Shell/token layer |

**Mobile / dark:** Semantic CSS variables only; TOC mobile uses `min-w-0`; quick summary grid steps **1 → 2 → 3** columns by breakpoint.

---

## 2. Visual reference directories (exact paths)

- `nursenest-core/reports/ui-redesign-preview/` (this report; sibling screenshots / PNGs live here)
- `nursenest-core/reports/ui-redesign-preview/preview-screenshots/`
- `docs/qa-reports/`
- `docs/verification-screenshots/`

**Screenshots:** Not recaptured in this agent session. Use the checklist in §8 after `npm run dev` (marketing URL + signed-in learner `/app/lessons/[id]`).

---

## 3. Differentiation strategy (layout vs tokens)

| Concern | Approach |
|---------|----------|
| Section kinds | Unchanged `data-lsc-role` / `data-lsc-kind` — **token-only** differentiation via `lesson-section-theme.ts` + `globals.css`. |
| Editorial monotony | **Layout/CSS:** slightly larger vertical gap in `.nn-lesson-article-flow`; rhythm bands remain inside `.nn-lesson-article-flow` only. |
| Reading width | **Layout:** xl triple grid middle column `minmax(48rem, 62rem)` + slightly wider column gap (presentation only). |
| Quick Clinical Summary | **Tokens** for card accents (`--lesson-*-accent`); **layout** 2-col from 480px, 3-col from 760px. |
| On this page | **Tokens** for sticky nav panel; **i18n** for visible chrome (`learner.lessons.nav.*`). |
| Loading | **Presentation:** branded `.nn-lesson-leaf-loader` in marketing Suspense fallback; `prefers-reduced-motion` disables pulse. |

---

## 4. Files touched (this iteration)

- `tools/i18n/marketing/marketing-en.json` — `learner.lessons.nav.*`, `learner.lessons.quickClinical.*` (+ `npm run i18n:compile`)
- `src/app/globals.css` — article flow gap, triple-grid tweak, quick-summary responsive grid, leaf loader keyframes
- `src/components/lessons/pathway-lesson-quick-clinical-summary.tsx` — optional `labels` prop + `data-testid="pathway-lesson-quick-clinical-summary"`
- `src/components/lessons/lesson-section-nav.tsx` — `useMarketingI18n()` for nav chrome
- `src/components/lessons/pathway-lesson-detail-loading-fallback.tsx` — leaf loader + `data-testid="pathway-lesson-detail-leaf-loader"`
- `src/app/(marketing)/.../pathway-lesson-detail-page-body.tsx` — pass quick-summary `labels` via `t(...)`
- `src/app/(student)/app/(learner)/lessons/[id]/page.tsx` — same `labels` wiring
- `tests/e2e/lessons/lesson-detail-premium-smoke.spec.ts` — **new** minimal shell smoke

**Earlier slices:** `premium-redesign-2026.css`, `pathway-lesson-detail-header.tsx`, `pathway-lesson-study-rail.tsx`, etc.

---

## 5. Loading / hydration / linked learning / progress

- **No** changes to progress trackers, linked-learning **signal** computation, `PathwayLessonDeferred*` data fetching, or refresh listeners.
- **Added** lightweight CSS leaf loader only in `PathwayLessonDetailPageLoadingFallback` (marketing Suspense path).

---

## 6. Playwright evidence

| Artifact | Notes |
|----------|--------|
| `tests/e2e/lessons/lesson-detail-premium-smoke.spec.ts` | Marketing: article flow, hero, desktop TOC, optional quick summary; mobile 375 TOC; dark color-scheme smoke. |
| Existing | `lesson-typography-smoke.spec.ts`, `lesson-flows.spec.ts`, `lessons-smoke.spec.ts` |

Run (requires `E2E_BASE_URL` / dev server):

`npx playwright test tests/e2e/lessons/lesson-detail-premium-smoke.spec.ts`

---

## 7. Validation commands

| Command | Result (this session) |
|---------|------------------------|
| `npm run i18n:compile` | Pass |
| `npm run typecheck:critical` | Pass |
| `npm run test:homepage` | Pass |
| `npx playwright test -c playwright.release-gate.config.ts --list` | Pass — 19 tests, 9 files |

---

## 8. Screenshot checklist (manual)

Save under **`reports/ui-redesign-preview/`** and **`preview-screenshots/`**:

1. Marketing pathway lesson — desktop  
2. Learner `/app/lessons/[id]` — desktop  
3. Mobile **375** — collapsible “Lesson contents”  
4. Dark theme — contrast on bands + TOC  
5. Pathophys / concept section  
6. Linked-learning / study rail column  
7. Quick Clinical Summary grid  
8. Desktop “On this page” sidebar  

---

## 9. Legacy / blockers

- **Legacy:** Shared `LessonSectionCard`, `PathwayLessonSectionContent`, `globals.css` lesson blocks.  
- **Blockers:** Full E2E + screenshots need running app; learner routes may need auth.

---

## 10. Confirmation — unchanged

SOT, SEO wiring, entitlements, routing, progress API semantics, catalog/indexing, analytics, internal links: **unchanged**.

