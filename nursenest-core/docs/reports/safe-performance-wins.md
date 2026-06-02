# Safe Performance Wins Audit

Generated: 2026-06-01

## Scope

This pass includes only low-risk latency reductions that require:

- No database schema changes.
- No architectural rewrites.
- No learning-engine changes.
- No business-logic changes.
- No UI redesign.

The wins below remove avoidable work from hot learning paths: dynamic imports on request paths, duplicate reads, unnecessary sequential waits, unnecessary progress-query ids, and repeated client-side registry lookups.

## Top Safe Wins Implemented

| Rank | Optimization | Impact | Risk | Effort | Files changed | Before | After |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Remove duplicate lesson-detail learner-path lookup. | High | Low | Low | `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | Lesson detail source trace: 7 Prisma call sites in the route flow. | Lesson detail source trace: 6 Prisma call sites in the route flow. |
| 2 | Start lesson-detail marketing locale lookup in parallel with learner-path lookup. | Medium | Low | Low | `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | Locale loaded only after learner-path lookup and dynamic pathway import. | Locale and learner path now resolve concurrently. |
| 3 | Replace lesson-detail dynamic pathway import with static import. | Medium | Low | Low | `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | 1 hot-path `await import()` before lesson resolution. | 0 dynamic imports in lesson detail page. |
| 4 | Replace CAT pool dynamic pathway imports with static import. | Medium | Low | Low | `src/lib/practice-tests/cat-pool.ts` | 2 `await import()` calls in CAT readiness/session pool helpers. | 0 dynamic imports in `cat-pool.ts`. |
| 5 | Replace CAT readiness dynamic pathway import with static import. | Medium | Low | Low | `src/lib/practice-tests/cat-practice-readiness.ts` | 1 `await import()` in CAT readiness preflight. | 0 dynamic imports in readiness preflight. |
| 6 | Replace practice-test create dynamic pathway import with static import. | Medium | Low | Low | `src/app/api/practice-tests/route.ts` | 1 `await import()` in POST `/api/practice-tests`. | 0 dynamic imports in practice-tests API route. |
| 7 | Replace learner-shell pathway metadata dynamic import with static import. | Medium | Low | Low | `src/lib/learner/load-learner-shell-pathway-metadata.ts` | 1 `await import()` after user row load. | 0 dynamic imports in shell pathway metadata loader. |
| 8 | Replace personal-profile target pathway dynamic import with static import. | Low | Low | Low | `src/lib/learner/load-personal-profile.ts` | 1 conditional `await import()` on target pathway fallback. | 0 dynamic imports in personal profile loader. |
| 9 | Overlap NP CAT session answer-history load with recent-id/pool work. | High | Low | Low | `src/app/api/cat/np/session/route.ts` | Historical answer history waited until after recent ids and question pool query. | Historical answer history starts before recent ids and overlaps the pool query. |
| 10 | Reduce flashcard progress query input set. | High | Low | Low | `src/lib/flashcards/build-flashcard-custom-session.ts` | Progress query used all scoped ids, including duplicate ids and synthetic `exam_bank:*` ids. | Progress query uses unique real flashcard ids only. |
| 11 | Memoize active pathway lookup in practice/CAT runner. | Medium | Low | Low | `src/components/student/practice-test-runner-client.tsx` | `getExamPathwayById(activePathwayId)` ran on every render. | Lookup runs only when `activePathwayId` changes. |
| 12 | Stabilize practice/CAT runner pathway-country memo dependencies. | Medium | Low | Low | `src/components/student/practice-test-runner-client.tsx` | Country map recomputed when `pathwaySurface` object identity changed. | Country map recomputes only when pathway ids change. |
| 13 | Remove conditional hook violation in practice/CAT runner derived teaching map. | Medium | Low | Low | `src/components/student/practice-test-runner-client.tsx` | A `useMemo` existed after early returns, forcing hook-order risk and lint failure. | Converted to a plain derived value after `current` is guaranteed. |

## Before / After Metrics

| Metric | Before | After | Evidence |
| --- | ---: | ---: | --- |
| Hot-path dynamic imports removed in touched files | 7 | 0 | `cat-pool.ts`, `cat-practice-readiness.ts`, lesson detail, practice-tests API, shell metadata, personal profile. |
| Lesson detail route Prisma call sites | 7 | 6 | `docs/reports/learning-activity-performance.md` refreshed after changes. |
| Performance-baseline lesson detail Prisma call sites | 11 | 10 | `docs/reports/performance-baseline.md` refreshed after changes. |
| NP CAT session independent query phases | 3 sequential phases | 2 critical-path phases | Answer-history now starts before recent-id/pool work. |
| Flashcard progress query id set | `scoped.length`, duplicates included, synthetic `exam_bank:*` included in one branch | `unique(real flashcard ids)` | `buildFlashcardCustomSession` progress branches now dedupe and filter synthetic ids. |
| Practice runner active pathway registry lookup | Every render | On `activePathwayId` change | `useMemo` added for `activePathwayDefinition`. |
| Practice runner pathway-country registry map | On pathway object identity changes | On pathway id changes only | `useMemo` dependencies reduced to ids. |
| Practice runner hook-order lint errors | 1 error | 0 errors | Targeted ESLint now passes with warnings only. |

## Ranking By Impact, Risk, Effort

| Priority | Safe win | Impact | Risk | Effort | Why it is safe |
| ---: | --- | --- | --- | --- | --- |
| 1 | Remove duplicate lesson-detail learner-path lookup | High | Low | Low | Uses the same previously loaded row; no response shape changes. |
| 2 | Overlap NP CAT answer-history load | High | Low | Low | Same query, same result, starts earlier. |
| 3 | Reduce flashcard progress query ids | High | Low | Low | Synthetic ids cannot have persisted progress; dedupe preserves semantics. |
| 4 | Static import for CAT pool pathway registry | Medium | Low | Low | Same module/function, avoids request-time import promise. |
| 5 | Static import for CAT readiness pathway registry | Medium | Low | Low | Same module/function, avoids request-time import promise. |
| 6 | Static import for practice-test create pathway registry | Medium | Low | Low | Same module/function, avoids request-time import promise. |
| 7 | Static import for lesson detail pathway registry | Medium | Low | Low | Same module/function, avoids request-time import promise. |
| 8 | Static import for learner shell metadata | Medium | Low | Low | Same module/function, avoids conditional runtime import. |
| 9 | Practice runner active pathway memo | Medium | Low | Low | Pure lookup memoized by stable id. |
| 10 | Practice runner country map dependency reduction | Medium | Low | Low | Same lookup output; avoids recompute from object identity churn. |
| 11 | Static import for personal profile pathway fallback | Low | Low | Low | Profile route fallback only; same output. |
| 12 | Parallel lesson locale + learner path | Medium | Low | Low | Independent reads; no data dependency. |
| 13 | Conditional hook removal in runner derived map | Medium | Low | Low | No behavior change; eliminates hook-order risk in a hot component. |

## Changes By Route

### Lessons

- No UI changes.
- No learning-content changes.
- Lesson detail no longer repeats the learner-path DB lookup inside the resolution fallback.
- Lesson detail now resolves locale and learner path concurrently.
- Lesson detail no longer waits on a dynamic pathway registry import.

### Flashcards / Flashcard Session

- No session behavior changes.
- Progress filters still apply the same rules.
- Progress reads no longer send duplicate ids or synthetic `exam_bank:*` ids to Prisma.

### Practice / Practice Session

- POST `/api/practice-tests` no longer performs a dynamic pathway registry import.
- Practice/CAT runner pathway registry calls are memoized on stable ids.
- Practice/CAT runner no longer has a conditional-hook lint error in the derived inline teaching map.

### CAT Launch / CAT Session

- CAT pool and CAT readiness no longer perform dynamic pathway registry imports.
- NP CAT session creation overlaps historical-answer loading with recent-id/pool work.

### Learner Shell / Profile

- Learner shell pathway metadata no longer dynamically imports the pathway registry.
- Personal profile target-pathway fallback no longer dynamically imports the pathway registry.

## Validation

Commands run after implementation:

```bash
npx prettier --write src/lib/practice-tests/cat-pool.ts src/lib/practice-tests/cat-practice-readiness.ts 'src/app/(app)/app/(learner)/lessons/[id]/page.tsx' src/app/api/cat/np/session/route.ts src/lib/flashcards/build-flashcard-custom-session.ts src/app/api/practice-tests/route.ts src/lib/learner/load-learner-shell-pathway-metadata.ts src/lib/learner/load-personal-profile.ts src/components/student/practice-test-runner-client.tsx
node scripts/learning-activity-performance-audit.mjs
node scripts/production-performance-investigation.mjs
npx eslint src/lib/practice-tests/cat-pool.ts src/lib/practice-tests/cat-practice-readiness.ts 'src/app/(app)/app/(learner)/lessons/[id]/page.tsx' src/app/api/cat/np/session/route.ts src/lib/flashcards/build-flashcard-custom-session.ts src/app/api/practice-tests/route.ts src/lib/learner/load-learner-shell-pathway-metadata.ts src/lib/learner/load-personal-profile.ts src/components/student/practice-test-runner-client.tsx --max-warnings=9999
npm run typecheck:critical
```

Validation result:

- Targeted ESLint: pass with four pre-existing hook dependency warnings in `practice-test-runner-client.tsx`.
- Critical typecheck: pass.

Targeted validation still required for final runtime timing:

```bash
npm run test:e2e:performance-budgets:record
```

That command requires an authenticated paid learner Playwright state; the current local environment does not include one, so this report uses source-level before/after metrics rather than live browser timings.
