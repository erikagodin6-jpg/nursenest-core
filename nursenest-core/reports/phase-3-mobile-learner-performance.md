# Phase 3 — Mobile & learner performance hardening

## Scope

Improve mobile lesson hub/detail runtime behavior and trim eager client imports on learner study hubs, **without** changing entitlements, PathwayLesson canonical APIs, CAT, question visibility, SEO/marketing routes, or billing.

## Files changed

| Area | Path |
|------|------|
| Mobile shared helpers | `packages/nursenest-mobile-shared/src/lesson-access-messages.ts`, `lesson-progress-ui.ts`, `src/index.ts` |
| Mobile shared tests | `packages/nursenest-mobile-shared/src/lesson-access-messages.test.ts`, `lesson-progress-ui.test.ts` |
| Mobile lessons tab | `apps/mobile/app/(tabs)/lessons.tsx` |
| Mobile lesson detail | `apps/mobile/app/lesson/[lessonId].tsx` |
| Learner hubs (web) | `nursenest-core/src/components/dev/learner-render-trace-banner.dynamic.tsx`, `flashcards/page.tsx`, `practice-tests/page.tsx` |
| Regression test | `nursenest-core/src/app/(student)/app/(learner)/learner-hub-trace-import.contract.test.ts` |

## What changed (behavior-safe)

1. **Mobile lessons list** — Memoized row component, stable `FlatList` callbacks, precomputed progress map usage via `lessonListProgressPillText`, topics + list error surfaces with **Retry** / **Try again**, subscription **403** mapped to **neutral locked copy** (no checkout / Stripe / upgrade CTAs).
2. **Mobile lesson detail** — Throttled `SecureStore` scroll persistence (min delta), memoized related-lessons block, loading / locked / retry error UI aligned with list.
3. **Web learner hubs** — `LearnerRenderTraceBanner` loaded through `next/dynamic` (`ssr: false`) so flashcards and practice-tests server modules do not eagerly bundle the trace client chunk on the critical path.

## Risks deliberately avoided

- No changes to `GET /api/learner/pathway-lessons*`, `pathway-lesson`, or response DTOs.
- No new markdown/HTML renderers on mobile.
- No paywall copy, pricing, IAP, or in-app web checkout.
- No edits to `/app/lessons` RSC hub (Phase 2 work preserved); hub perf here is limited to trace banner chunk split on flashcards/practice-tests only.

## Deliberately not changed

- CAT scoring, practice-test runner logic, flashcards entitlement resolution.
- Marketing SEO, sitemap, public routes.
- `SubscriptionPaywall` placement or props on web locked states.

## Remaining bottlenecks (follow-ups)

- Lesson detail still uses `ScrollView` + full section map — acceptable for typical lesson size; very large section counts could adopt windowing later.
- Mobile list still depends on network + server pagination; no offline cache expansion in this phase.

## Validation (executed in agent env)

| Command | Exit |
|---------|------|
| `npm --prefix apps/mobile run typecheck` | 0 |
| `npm --prefix packages/nursenest-mobile-shared run test` | 0 |
| `npm --prefix nursenest-core run typecheck:critical` | 0 |
| `node --import tsx --test src/app/(student)/app/(learner)/learner-hub-trace-import.contract.test.ts` | 0 |

Full `npm run typecheck` / `npm run build` not required for this slice; if either exits **137** (OOM), treat as environment limit.

