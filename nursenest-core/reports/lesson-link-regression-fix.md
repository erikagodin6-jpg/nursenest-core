# Lesson hub link navigation regression

## Root cause

`verifyMarketingHubLessonRowsResolve` assembled `kept` in three append phases: all detail-verified (strict) rows first, then soft-recovery degraded rows, then every slug beyond `maxUniqueSlugsToVerify` as `hubMarketingDegraded` with `unverified_inventory_fill`.

Hub pagination uses `sliceNormalizedHubLessons` on that list. With the per-request verify cap (`pageSize * page`, bounded by `NN_MARKETING_HUB_VERIFY_SLUG_CAP`), **all capped / unverified rows were contiguous after every strict row**. Any page whose slice started past the strict prefix (typically page 2+) therefore rendered **only** degraded rows. Marketing cards use `pathwayLessonMarketingHubVerifiedCardHref`, which returns `null` when `hubMarketingDegraded` is set—so lesson titles showed without working navigation.

## Fix

Build `kept` in **one pass over the input `lessons` array** (prepared hub order): each row is either strict, `unverified_inventory_fill`, or soft-recovery degraded, preserving catalog order for pagination.

## Files changed

- `nursenest-core/src/lib/lessons/pathway-lesson-hub-link-integrity.ts`
- `nursenest-core/src/lib/lessons/pathway-lesson-hub-link-integrity.test.ts`
- `nursenest-core/reports/lesson-link-regression-fix.md` (this file)

## Pages tested (logic / automated)

- Unit: `verifyMarketingHubLessonRowsResolve` (including new order-preservation case under verify cap).
- Suite: `npm run test:pathway-lessons` (91 tests).
- **Not** browser-reproduced in this run (no long-lived dev server); marketing hubs using verify + pagination are the affected surface.

## Commands run

| Command | Result |
|---------|--------|
| `node --import tsx --test src/lib/lessons/pathway-lesson-hub-link-integrity.test.ts` | Pass |
| `npm run test:pathway-lessons` | Pass (91 tests) |
| `npm run verify:learning-surfaces` | OK |
| `npm run typecheck` | Exit 137 (killed / OOM in this environment) |
| `npx tsc --noEmit` (with larger heap) | Exit 2: pre-existing `blog-control-panel-generation.ts(339,5)` TS2322 |
| `npm run lint` | No `lint` script in package.json |
| Playwright `test:e2e:learner-surfaces-smoke` | Not run (needs baseURL, server, credentials) |

## Truthpack

`.vibecheck/truthpack/` not found in this workspace clone; routes and contracts unchanged.

## Remaining risks

Capped rows remain intentionally non-linkable on marketing hubs; they are no longer all stacked on the final pages only.

*Verified By VibeCheck ✅*
