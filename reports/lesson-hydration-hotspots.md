# Lesson route hydration hotspots

## Large client islands (repo script)

- `scripts/report-hydration-risk-routes.mjs` targets high-line-count **use client** shells including `src/app/(student)/app/(learner)/layout.tsx` (affects every learner route including lessons).
- Generated outputs: `nursenest-core/reports/hydration-risk-routes.md` (when script run from app package).

## Pathway lesson–specific client boundaries

- **App lesson detail** (`src/app/(student)/app/(learner)/lessons/[id]/page.tsx`): composes many client children (`PathwayLessonActions`, `PathwayLessonStudyLoopOrchestrator`, quiz embed, interactive modules). Server keeps full `PathwayLessonRecord`; thin props cross the boundary per `marketing-pathway-lesson-client-contract` pattern on marketing.
- **Marketing pathway lesson detail** (`pathway-lesson-detail-page-body.tsx`): `PathwayLessonDetailDeferred` / `PathwayLessonDeferredRelatedRail` stream below-fold work; header and core article remain RSC-first.
- **Study loop / assessment** (`pathway-lesson-assessment-experience.tsx`, `pathway-lesson-study-loop-orchestrator.tsx`): primary hydration cost on lesson detail for interactive flows.

## Marketing hub components

- Curriculum hub components under `src/components/pathway-lessons/` (e.g. `nclex-rn-lessons-hub.tsx`) — mix of server lists + client filters; verify no unnecessary `use client` on list shells when extending.

## Mitigations already in tree

- Deferred related rail + skeletons on marketing detail.
- `lessonsPerfMark` instrumentation in subscriber resolution (`lessons-perf`).

## Follow-up (optional)

- After edits, run `npm --prefix nursenest-core run report:hydration-risk-routes` from the Next package to refresh machine-readable hydration report.

