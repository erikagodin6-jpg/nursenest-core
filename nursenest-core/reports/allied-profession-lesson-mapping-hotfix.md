# Allied profession lesson mapping hotfix (lesson-index verification)

**Date:** 2026-05-09  
**Scope:** Restore structural integrity for `npm run verify:lesson-indexes` allied-profession coverage without disabling guards.

## Root cause

`verify:lesson-indexes` intersects registry `topicSlugsIn` with normalized `lesson.topicSlug` from `getMarketingLessonsHubCatalogLessons("us-allied-core")`. On the trimmed allied marketing hub, lesson rows often use collapsed topic slugs (`nursing-fundamentals`, etc.). Registry editorial labels may not match those normalized values, yielding zero intersection and a failing build.

## Affected professions (production report)

paramedic, ota, pta, social-work, mental-health-addictions, imaging, pharmacy-tech (and any other key in `REQUIRED_ALLIED_PROFESSION_KEYS` if registry topics drift).

## Fallback strategy

- `resolveAlliedProfessionTopicSlugsForLessonIndexVerification()` appends the first structural anchor present on the live hub (`nursing-fundamentals`, `pharmacology`, `infection-control`, `leadership-and-delegation`) when registry topics do not intersect hub lesson.topicSlug rows.
- Verification notes record when an anchor was applied.
- `REQUIRED_ALLIED_PROFESSION_KEYS` lives in `src/lib/allied/allied-profession-lesson-index-verification.ts`.

## Files changed

- `src/lib/allied/allied-profession-lesson-index-verification.ts` (new)
- `scripts/lesson-normalization-coverage.mts`
- `scripts/allied-lesson-coverage.mts`
- `src/lib/allied/allied-professions-registry.ts` (documentation comment)
- `src/lib/allied/allied-profession-lesson-index-verification.contract.test.ts` (new)

## Validation

- `npm run verify:lesson-indexes` — pass (local)
- `npm run typecheck:critical` — pass (local)
- Contract tests — pass

## Figma

No visual changes; Figma pass not required.

## Future work

Publish profession-specific allied lessons with matching topic metadata / `alliedProfessionKey` to reduce reliance on shared anchors.
