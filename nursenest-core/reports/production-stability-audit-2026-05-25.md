# Production Stability Audit - 2026-05-25

## Executive Summary

The platform is salvageable. The failures are primarily caused by shared runtime coupling and request-time work spreading across public marketing and learner route groups, not by a need for a full rebuild.

Immediate production risks found:

- Public marketing chrome used `useSession()` through shared header/footer and hub components. Without a provider this can crash unrelated public pages.
- The default marketing layout is request-time rendered, so public RN/RPN/NP/blog/pricing pages inherit dynamic behavior even when page content is mostly static.
- The blog index depends on live DB reads before showing the public list. A bundled static corpus exists and should be used as the default fail-open path when the DB is unavailable.
- Learner routes are appropriately auth-gated, but the shared learner shell still performs required auth/entitlement reads plus optional shell reads before page content can settle.
- Large lesson/catalog JSON files are present and must remain server-only and lazy-loaded. Cold hub requests still pay catalog assembly cost.

## Route And Rendering Classification

Current `force-dynamic` count by route area:

- `src/app/(marketing)`: 76
- `src/app/(app)`: 36
- `src/app/(admin)`: 97
- `src/app/api`: 175
- `src/app/(runtime)`: 6
- Other App Router route files: 14
- Total observed App Router `force-dynamic` exports after this pass: 404

Recommended route classification:

- Static/cacheable: legal pages, brochure pages, public SEO articles, static authority pages, support/about copy, static public tools where no request headers/cookies are needed.
- ISR/revalidated: blog index/detail, RN/RPN/NP public hubs, pricing, public lessons hubs, public flashcard/deck discovery, sitemap children fed by content data.
- Truly dynamic/authenticated: `/app/*`, `/admin/*`, `/internal/*`, billing/account, checkout, auth mutation routes, learner progress APIs, CAT/practice/flashcard session APIs.

Routes converted away from page-level `force-dynamic` in this stabilization pass:

- `/about`
- `/contact`
- `/faq`
- `/how-it-works`
- `/for-institutions`
- `/acceptable-use`
- `/content-review-policy`
- `/editorial-policy`
- `/privacy`
- `/refund-policy`
- `/terms`
- `/disclaimer`

Each fixed public brochure/legal page now exports `revalidate = 3600`. This removes unnecessary page-level request-time rendering for those files, although the default marketing layout still needs a separate static-chrome refactor before these routes can fully escape inherited dynamic layout work.

## Patches Applied

1. Marketing provider containment:
   - `src/app/(marketing)/layout.tsx` now wraps marketing routes in the existing `AuthSessionProvider` with `session={null}`.
   - This prevents shared public chrome/components that call `useSession()` from crashing RN/NP/blog/pricing routes.
   - The public provider runs with `runtimeBoundary="public"`, so it does not refetch sessions on focus/interval or run BFCache auth resync work.

2. Blog public fail-open behavior:
   - `src/lib/blog/safe-blog-queries.ts` now defaults the global `/blog` index to bundled static fallback on DB read failure.
   - `BLOG_INDEX_STATIC_ON_DB_ERROR=0` opts out.
   - `src/lib/blog/safe-blog-queries.list-load.test.mts` now guards the static fallback contract.

3. Fixed public page ISR groundwork:
   - Twelve fixed public brochure/legal routes now use `revalidate = 3600` instead of `force-dynamic` or an implicit uncategorized render policy.
   - `src/lib/marketing/static-generation-policy.test.ts` now protects those pages from reintroducing `force-dynamic`.

4. Learner shell optional work decoupling:
   - `src/app/(app)/app/(learner)/layout.tsx` no longer loads public paywall/home stats for entitled learners.
   - Paywall stats are loaded only for paywalled or entitlement-error states, and otherwise a cheap degraded fallback is passed to preserve the provider contract.
   - `src/lib/marketing/load-paywall-home-stats-for-shell.ts` now caps the optional wait at 750ms and exits immediately under degraded/core-only emergency mode.

5. Degraded-mode public stats fail-soft:
   - `src/lib/marketing/public-home-stats.ts` now treats `NN_DEGRADED_MODE` / auto durability degraded mode as a reason to return the degraded public stats fallback without DB reads.
   - The homepage stats path now fails soft immediately under durability degraded mode instead of attempting shared cache/DB refresh work.

6. Core public hub/auth decoupling:
   - The generic public exam hub no longer reads optional public session, resolves entitlement, queries user rows, or loads learner resume payloads during public render.
   - The public CAT entry page now renders from public inventory/eligibility only; subscriber-specific CAT launch checks remain in authenticated app/API surfaces.

7. Runtime boundary audit gate:
   - `scripts/audit-runtime-boundaries.mjs` maps layouts, providers, auth/session dependencies, Prisma usage, request APIs, dynamic rendering, and cross-group loaders.
   - Reports are written to `reports/runtime-boundary-audit.md` and `reports/runtime-boundary-audit.json`.
   - `npm run audit:runtime-boundaries:strict` blocks core public route regressions where pricing/blog/RN/NP/RPN hub files import protected auth, entitlement, learner, or direct Prisma runtime.

8. Learner payload bounding:
   - Flashcard custom sessions now cap DB card scans at 800 rows, progress scans at 800 rows, supplemental exam-bank rows at a smaller window, and returned cards at 80.
   - Deck study and practice-test question APIs already use session/cursor/current-question style delivery; these remain the preferred learner runtime boundary.

9. Production deployment gate:
   - Added `npm run qa:production-stability` for typecheck, runtime-boundary audit, hydration-risk audit, route integrity, blog fallback, auth middleware, and static-generation policy tests.
   - Added `npm run test:e2e:production-stability-smoke` covering `/pricing`, `/blog`, RN/NP/RPN hubs, login, flashcards, CAT launch, and practice exams.

## Provider And Layout Isolation

Current state:

- Public marketing, learner app, admin, and runtime routes are route-group separated.
- Public marketing still imports legacy client chrome that reads auth context, but the marketing route-group provider is now passive and seeded as guest-only to avoid public auth refetch dependency.
- Learner app has its own auth/session provider stack and learner error/loading boundaries.
- Error/loading boundaries already exist for marketing, default marketing, blog, learner app, app segment, admin, and root.
- Runtime-boundary audit currently reports 8 remaining non-core public files with blocked runtime imports; the strict deployment gate blocks regressions on core public stability routes first.

Required next steps:

- Move staff-only marketing affordances behind a small optional client island so public chrome no longer needs `useSession()` at the primary header/footer level.
- Remove request-specific header/cookie reads from the default marketing layout for pages that should be static or ISR.
- Keep learner providers out of marketing route groups and marketing i18n/page shards out of learner session routes unless explicitly needed.

## Learner System Stabilization Plan

Current positive findings:

- CAT/practice APIs already have session/current-question endpoints.
- Flashcard deck and study APIs use pagination/caps in several places.
- Learner shell optional work is protected by `safeOptional` and degraded-mode flags.
- Entitled learner requests no longer wait on optional public paywall/home stats.

Highest-risk learner surfaces:

- `practice-test-runner-client.tsx` is a medium hydration-risk client island.
- `practice-tests-hub-client.tsx` and `question-bank-practice-client.tsx` remain large client surfaces.
- Flashcard custom session builders were reduced from 5,000-row scans/500-card responses to bounded 800-row scans and 80-card responses; they still should be split into durable queue creation plus incremental card fetches.

Refactor plan:

- CAT: keep SSR payload to session id, current question id, timing/status, and minimal chrome metadata. Fetch next/current question through API.
- Practice exams: page shell loads session metadata only; question content is fetched by `/api/practice-tests/[id]/question`.
- Flashcards: deck page loads deck metadata and counts; study route fetches card windows by cursor/batch.
- Learner shell: do not block first paint on study-next, tutor, analytics, paywall proof stats, or rich pathway recommendations.

## Prisma And Database Optimization

Existing schema coverage is mostly good for critical learner keys:

- `PracticeTest`: indexes on `userId/status/updatedAt`, `userId/updatedAt`, and `userId/status/completedAt`.
- `ExamSession`: indexes on `userId/status`, `userId/updatedAt/createdAt`, and `examId`.
- `ExamAttempt`: indexes on `examId` and `userId/createdAt`.
- `Flashcard`: indexes on `deckId/positionInDeck`, `deckId/status`, `examQuestionId`.
- `FlashcardProgress`: unique `userId/flashcardId`, indexes on `userId/nextReviewAt`, `userId/lapses`, `flashcardId`.
- `FlashcardSession`: indexes on `userId/status`, `userId/deckId`.
- `PathwayLesson`: pathway/status/sort and pathway/topic/status indexes exist.

No schema changes were applied in this pass. Recommended follow-up index review:

- Add query-plan evidence before adding more indexes.
- Check production slow query logs for `BlogPost`, `ExamQuestion`, `PracticeTest`, `FlashcardProgress`, and `PathwayLesson`.
- Prefer replacing overbroad reads with projections/pagination before adding indexes.

## Hydration And Runtime Payload Risks

Observed runtime payload risks:

- Large content JSON catalogs include NP and pathway lesson catalogs above multiple megabytes.
- Generated indexes are not directly imported by `src/app`, which is good.
- A client route still imports content directly: `src/app/(app)/app/(learner)/cases/cnple/[caseId]/page.tsx`.

Required next steps:

- Keep catalogs server-only and lazy-loaded.
- Replace large client islands with smaller state machines and API-driven data.
- Avoid server/client branching based on non-deterministic browser-only state during first render.

## Deployment And Runtime Recommendations

Immediate incident flags:

- `NN_DEGRADED_MODE=1`
- `NEXT_PUBLIC_NN_DEGRADED_MODE=1`
- `NN_CORE_ONLY_EMERGENCY=1` only during severe learner incidents.
- `BLOG_INDEX_STATIC_ON_DB_ERROR=0` only if operators intentionally want blog DB errors to surface instead of static fallback.

Runtime monitoring:

- Alert on `useSession must be wrapped`.
- Alert on `db_timeout`, `blog_index_list_db_failed`, `home_stats_optional_read_failed`, and repeated `catalog-read` cold bursts.
- Track TTFB for `/pricing`, `/blog`, `/canada/rn/nclex-rn`, `/canada/np/cnple`, `/app/flashcards`, `/app/practice-tests`, and `/app/questions`.
- Post-deploy: run `npm run test:e2e:production-stability-smoke` against the production origin with `PLAYWRIGHT_SKIP_WEB_SERVER=1`.

## Long-Term Scalability Plan

1. Split marketing chrome into static public chrome plus optional staff/auth island.
2. Move public RN/RPN/NP hubs to ISR with precomputed lightweight pathway snapshots.
3. Move blog index to static/ISR-first with DB refresh in background and static corpus as fail-open.
4. Keep learner routes dynamic, but make shells minimal and data APIs incremental.
5. Replace high-cap queue builders with cursor/window APIs.
6. Add route-family budgets: max server queries, max RSC payload bytes, max client island bytes, and max cold catalog reads.
