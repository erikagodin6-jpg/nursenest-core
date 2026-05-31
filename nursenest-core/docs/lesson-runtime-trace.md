# Lesson Runtime Trace

## Incident

Cardiovascular, Respiratory, Renal, GI, Mental Health, and Maternity lesson system filters did not load after the previous alias fix.

## Exact Stop Point

Execution stopped inside:

`src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`

Function:

`PathwayLessonsHubPage`

Root cause:

The page render scope referenced `topicSlugsForList` while building `listOpts`, but `topicSlugsForList` was only declared in `generateMetadata`. Because `generateMetadata` and `PathwayLessonsHubPage` are separate function scopes, topic-filtered lesson routes could throw a runtime `ReferenceError` before the lesson loader ran.

Impact:

- Route mounted enough to begin page render.
- Loader did not reliably execute for filtered system routes.
- Database/query aliases were not the effective blocker.
- Learner-facing result could appear as a frozen click, blank state, or failed navigation depending on the browser/runtime error boundary.

## Runtime Trace Points Added

Topic-filtered lesson routes now emit structured trace events through `safeServerLog`:

1. `route_mounted`
2. `loader_executed`
3. `query_completed`

The client also emits:

4. `client_rendered`

Each trace includes:

- Pathway ID
- Route pathname
- Topic slug
- Topic slug candidates
- Rows returned
- Returned lesson IDs, capped to 20
- Timestamp

## Fixed Code Path

The page render scope now defines:

- `topicSlugCandidates`
- `topicSlugsForList`

before `listOpts` uses them.

## Expected Healthy Flow

For `/canada/rn/nclex-rn/lessons?topicSlug=cardiovascular`:

1. Route mounts.
2. Topic aliases resolve to candidates.
3. Loader executes.
4. Query completes.
5. Rows are returned.
6. Lesson library renders.
7. Client trace confirms render.

## Debug Route

`/debug/lessons?pathwayId=ca-rn-nclex-rn&system=cardiovascular`

This route displays raw lesson rows for admin/local diagnostics. It is noindex and disabled in production unless `LESSON_DEBUG_ROUTE=1` is set. In production, admin access is required.
