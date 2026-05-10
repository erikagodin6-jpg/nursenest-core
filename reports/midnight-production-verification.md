# Midnight production verification + public blog E2E exclusion

**Date:** 2026-05-09  
**Reference commit (context):** `a311f907f` — nav/theme regression anchor where applicable.

## A) Public blog E2E artifact exclusion

Filtered (case-insensitive): slug or title contains `bloge2e`; title contains `runtime draft scheduled`, `runtime en scheduled`, or `runtime en published`.

**Code:** `isBlogPublicE2eTestArtifact` + `blogPublicExcludeE2eTestArtifactsWhere` in `src/lib/blog/blog-visibility.ts` (composed into `blogLiveWhere`); SQL mirror in `src/lib/blog/blog-patho-pharm-detection.ts`; `getPublishedBlogPostBySlug` / `getBlogPostMetaBySlug` in `src/lib/blog/safe-blog-queries.ts`.

**Tests:** `src/lib/blog/blog-visibility.test.ts`

## B) Midnight checklist

See Playwright spec + manual checklist in section C. Manual: homepage, nav/header, footer, pricing, lesson hubs, theme picker, locale controls, mobile nav.

## C) Playwright

- **Spec:** `tests/e2e/public/midnight-public-blog-no-e2e-leak.spec.ts`
- **Screenshots:** `testInfo.attach` (HTML report)

## D) Commands (cwd: nursenest-core/)

| Command | Exit |
|---------|------|
| npm run typecheck:critical | 0 |
| npm run test:homepage | 0 (78 pass, 1 skip) |
| npx playwright test tests/e2e/public/midnight-public-blog-no-e2e-leak.spec.ts --project=chromium | 0 |
| node --import tsx --test src/lib/blog/blog-visibility.test.ts | 0 |

## E) Truthpack

`.vibecheck/truthpack/ui-pages.json` not present in this workspace clone.

## Risks

Rare false positive if a real article title matches an excluded phrase exactly; bypass if a new public blog path avoids `blogLiveWhere`.
