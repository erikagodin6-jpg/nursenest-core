# Lesson hub premium slice (marketing RN / PN / RPN)

## Scope

Marketing pathway **lessons index** and **category lesson list** shells aligned with `NursingTierHubPage` / homepage premium tokens (`nn-premium-pathway-hub`, `nn-premium-home-eyebrow`, `nn-marketing-h1`, `nn-marketing-body`, `nn-nursing-tier-hub-hero-band`). No routing, loaders, SEO, pagination, or entitlement changes.

## Routes

| Hub | Marketing URL (canonical segments) |
| --- | --- |
| NCLEX-RN (US) | `/us/rn/nclex-rn/lessons` |
| NCLEX-PN (US) | `/us/pn/nclex-pn/lessons` |
| REx-PN / Canada RPN | `/canada/pn/rex-pn/lessons` |

**Note:** Canada practical-nurse tracks use the **`pn`** URL segment (not `rpn`); country slug is **`canada`** (not `/ca/…`).

## Files changed

| File | Change |
| --- | --- |
| `src/components/pathway-lessons/lessons-page-shell.tsx` | Premium wrapper (`nn-premium-pathway-hub`, `data-nn-lessons-marketing-hub`), hero band + eyebrow + marketing typography; optional `pathwayTrack`; content panel shadow via palette token mix |
| `src/app/globals.css` | Lessons hub hero band shares tier-hub gradient/border with `[data-nn-lessons-marketing-hub="1"]` |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` | `formatTitleCase` / `formatSentenceCase`; pass eyebrow + track; section heading `nn-marketing-h3` |
| `src/components/pathway-lessons/marketing-lessons-hub-category-first-index.tsx` | Same formatting + shell props; category index library heading |
| `src/components/pathway-lessons/marketing-lessons-hub-category-lessons-surface.tsx` | Same + category page hero |
| `src/components/pathway-lessons/marketing-lessons-hub-retryable-error-shell.tsx` | Forward eyebrow / pathwayTrack to shell |
| `tests/e2e/public/pathway-lessons-hub-premium.spec.ts` | RN / PN / CA RPN hooks, placeholder sniff, mobile overflow |

## Shared components

- **`LessonsPageShell`** — single marketing shell for hub index, filtered list, category list, and retryable error surfaces.
- **`MarketingLessonsHubCategoryFirstIndex`** — default unfiltered hub (no `q` / `topicSlug` / allied filters): category grid + review-required strip (unchanged data).
- **`MarketingLessonsHubCategoryLessonsSurface`** — clinical-area lesson list (category routes via existing `[lessonSlug]` resolution).

NP / Allied: flows reuse the same shell where applicable; Allied global hub redirects stay unchanged.

## Tests

- `npm run typecheck:critical` — pass  
- `npm run test:homepage` — pass  
- `src/lib/marketing/pathway-lessons-hub-page-safety.test.ts` — pass  
- **Playwright** `pathway-lessons-hub-premium.spec.ts` — requires running app (`BASE_URL` / dev server); not executed green without a listening origin (e.g. connection refused to localhost:3000).

## Screenshots

Optional captures under `reports/ui-redesign-preview/` were not generated (no dev server in validation environment).

## Blockers

- None for merge; run Playwright against a live origin to verify browser behavior.
