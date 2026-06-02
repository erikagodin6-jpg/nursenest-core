# Learner dashboard recommendation rendering regression

## Root cause

1. **Adaptive recommendations section used the wrong lesson URL shape**  
   Links were built as `/app/lessons/${slug}`. The signed-in lesson detail route (`/app/lessons/[id]`) resolves **PathwayLesson.id** (primary key), not marketing slug. Slug-only paths yield not_found at navigation and broke linkage vs PathwayLesson canonical URLs.

2. **Client Link crash surface**  
   Dashboard client islands (`PrimaryActionCard`, `EngagementNudgeStrip`, resume CTAs) receive href from multiple server pipelines (insights primary, continue-learning rows, engagement API). Nullish, non-relative, protocol-relative, or non-/app href values can cause Next.js Link failures; the learner shell Sentry boundary then shows **Unable to load this section** for the subtree.

3. **resolvePathwayLessonForWeakTopic**  
   Used `r.topicSlug.replace` without guarding non-string topicSlug from legacy or partial rows.

## Crashing component / failure mode

- **Boundary:** `SentryLearnerShellInstrumented` (`ProductErrorState` with `learner.error.section.title`).
- **Likely throw:** `next/link` with invalid `href` (primary CTA, engagement nudge, resume).
- **Wrong link (data):** `LearnerAdaptiveRecommendationsSection` lesson list used slug as dynamic segment id.

## Affected routes

- `/app` (dashboard): study home, adaptive strip, Study Next (layout), engagement strip.
- Lesson navigation from dashboard to `/app/lessons` hub/detail.

## Malformed payload example (sanitized)

```json
{
  "insightsPrimary": { "href": "", "kind": "quiz" },
  "adaptiveLesson": { "slug": "lesson-slug", "wrongHref": "/app/lessons/lesson-slug" },
  "nudge": { "kind": "continue_plan", "href": null }
}
```

## Normalization / guards

- New `coerceSafeLearnerNavHref` in `src/lib/learner/safe-app-href.ts`.
- Study-next: `recommend-next-actions`, `smart-study-next-engine`, `load-learner-study-next-block`.
- `getNextBestAction`, `buildContinueLearningItems`, `buildLearnerReportCardViewModel`.
- `withPathwayScopeHref` try/catch around URL parsing.
- Adaptive section: `buildAppLessonsReviewLessonHref` for lesson links.
- Client: `PrimaryActionCard`, `EngagementNudgeStrip`, `LearnerDailyMomentumCard`.
- `resolve-pathway-next-lesson.ts` null-safe topicSlug.

## Validation

| Command | Result |
|---------|--------|
| npm run typecheck | OOM killed (exit 137) in this sandbox |
| npm run typecheck:critical | Pass |
| npm run test:pathway-lessons | Pass (91 tests) |
| npm run verify:learning-surfaces | OK |
| safe-app-href, learner-report-card-model, app-study-internal-links tests | Pass |

## Remaining risks

- Full typecheck needs more memory in CI than this environment.
- Coerced hrefs may not match CTA copy in edge cases (prefer crash-free).

