# Lessons hub UX cleanup — verification report (2026-05-08)

## Branch

`fix/lessons-hub-cleanup-2026-05-08`

## Scope summary

End-to-end goal: cleaner marketing pathway lessons hubs (single bottom-nav rail, tighter spacing), catalog normalization so **canonical legacy five-block + authoritative sole-source** lessons **pass through** without `expandToStandardFiveSections` (avoids dev throws / SSR instability), plus unit/contract tests and Playwright coverage for RN / PN / NP / Allied / Canada RPN and mobile viewport checks.

Primary implementation landed in commit `1968e7a5b` on this branch (hub surfaces, `pathway-lesson-catalog-sync`, tests, initial screenshots). Follow-up in this session tightened **`pathway-lessons-hub-premium.spec.ts`** only.

## UX decisions (learner-facing marketing hubs)

- Remove duplicate **StudyModeCards** rails from category-first / category-lessons surfaces so **`StudyBottomNav`** remains the single secondary study rail.
- **`StudyBottomNav`** supports **`compact`** for tighter vertical rhythm on hub pages.
- **`LessonsPageShell`** retains **`data-nn-lessons-marketing-hub="1"`** for stable QA hooks.
- Catalog: **`legacyAuthoritativePassThrough`** when `!usePremium && lessonSectionsQualifyAsAuthoritativeSoleSource(incoming) && lessonSectionsAreCanonicalLegacyMarketingShape(incoming)`; **`normalizeTrace.usedLegacyFiveBlockExpander`** is `false` on that path.

## Key files (reference)

| Area | Path |
|------|------|
| Catalog normalization | `nursenest-core/src/lib/lessons/pathway-lesson-catalog-sync.ts` |
| Render-source tests | `nursenest-core/src/lib/lessons/pathway-lesson-render-source.test.ts` |
| Static hub UX contract | `nursenest-core/src/lib/lessons/pathway-lessons-hub-marketing-ux.contract.test.ts` |
| Hub UI | `lessons/page.tsx`, `marketing-lessons-hub-category-first-index.tsx`, `marketing-lessons-hub-category-lessons-surface.tsx`, `lessons-page-shell.tsx`, `lesson-hub-surface-chips.tsx`, `study-bottom-nav.tsx` |
| Pathway-lessons script | `nursenest-core/package.json` (`test:pathway-lessons` includes marketing UX contract) |
| Playwright | `nursenest-core/tests/e2e/public/pathway-lessons-hub-premium.spec.ts` |

Routes covered by the spec (existing marketing URLs only):

- `/us/rn/nclex-rn/lessons`
- `/us/pn/nclex-pn/lessons`
- `/us/np/fnp/lessons`
- `/allied/allied-health/lessons`
- `/canada/pn/rex-pn/lessons` (uses `seedCaMarketingCookie`)
- Mobile: RN + NP hubs at 390×844

## Commands run (this session)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` (in `nursenest-core/`) | **Pass** |
| `npm run test:pathway-lessons` | **Pass** — 98 tests, 0 failures |
| Playwright `pathway-lessons-hub-premium.spec.ts` (chromium + webkit, `--workers=1`, `BASE_URL=http://127.0.0.1:3000`, dev server `NN_SKIP_DEV_AUTH_SECRET=1` + `AUTH_SECRET`) | **Fail** — see below |

### Playwright failure analysis

Hub selectors did not attach; DOM showed the marketing **error boundary** (`data-nn-app-error-screen`) instead of `LessonsPageShell`.

Server logs: **`HubLessonsListDatabaseError` / `database_timeout`** during **`MarketingLessonsHubCategoryFirstIndex`** (`effectiveLocaleForPathwayLessonDbRows`). Remote Postgres from `.env.local` can time out under hub verification load. E2E is **environment-sensitive**.

## Screenshots (in repo)

Under `nursenest-core/reports/lessons-hub-cleanup-2026-05-08/screenshots/` (from a prior successful capture on this branch): `us-rn-nclex-rn-lessons.png`, `us-pn-nclex-pn-lessons.png`, `us-np-fnp-lessons.png`, `canada-pn-rex-pn-lessons.png`, `mobile-us-np-fnp-lessons.png` (no dedicated Allied-only file in this set).

## Risks / follow-ups

1. DB timeouts break hub SSR when category-first index hits verification queries.
2. `.vibecheck/truthpack/` not present in clone — routes validated via code/tests.
3. Branch commit `1968e7a5b` bundles extra flashcard preview assets; split if you need a lessons-only PR.

## Spec adjustments (this session)

- Scoped **`hub.locator(LESSONS_SECTION)`** under **`HUB_ROOT`**.
- **`beforeAll`**: mkdir screenshots + **`request.get('/us/rn/nclex-rn/lessons')`** warm-up.
- Canada: **`seedCaMarketingCookie`**.
- Allied: shared **`expectMarketingLessonsHubLoaded`**.

---

*Verified By VibeCheck ✅*
