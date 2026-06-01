# DB Load Reduction Results

Generated: 2026-06-01T22:55:02.228Z

## Summary

Implemented the first production-safe reduction pass against the highest-confidence hot paths from `docs/reports/prisma-performance-audit.md`. Changes are request-path focused and preserve user-facing behavior, learning logic, and business logic.

## Implemented Changes

| Area | Before | After | Request DB Reduction |
| --- | --- | --- | --- |
| Homepage stats | Homepage could fall through to cached/live stats refresh backed by content, lesson, flashcard, deck, learner, question, tier, scenario, and topic count queries. | Homepage reads `data/snapshots/public_home_stats_snapshot.json` or static degraded fallback only. Snapshot refresh is an explicit deploy/cron script. | Up to 9 aggregate/count queries removed from homepage render. |
| Public blog count | `countPublishedBlogPosts()` ran live `BlogPost.count` plus overlap lookup. | Reads `data/snapshots/blog_index_snapshot.json`; falls back to bundled static corpus if snapshot is absent. | 1-2 public count/lookup queries removed per caller. |
| Public blog index pagination | Default index load requested a live total count. | Default index load uses `take + 1`; total is inferred unless callers explicitly request `includeTotal: true`. | Removes live count from default public blog page reads. |
| Admin blog status counts | Six independent `BlogPost.count` calls for status totals. | One `groupBy({ by: ["postStatus"] })`. | 6 queries -> 1 query for status totals. |
| Admin analytics user counts | Six `user.count` calls plus one dead-account raw count. | One raw SQL aggregate with `COUNT(*) FILTER`. | 7 user-count scans -> 1 aggregate query. |

## Snapshot Artifacts

| Snapshot | Path | Latest Values |
| --- | --- | --- |
| public_home_stats_snapshot | `data/snapshots/public_home_stats_snapshot.json` | questions=100,203, lessons=13,040, flashcards=31,516, learners=66 |
| blog_index_snapshot | `data/snapshots/blog_index_snapshot.json` | live=4,217, staticOnly=415, total=4,632 |

## Refresh Commands

Run on deploy and every 15 minutes from cron:

```bash
npm run snapshots:public-home-stats
npm run snapshots:blog-index
```

## Verification

- `npm run snapshots:public-home-stats` / `npx tsx scripts/refresh-public-home-stats-snapshot.mts` succeeded.
- `npm run snapshots:blog-index` / `npx tsx scripts/refresh-blog-index-snapshot.mts` succeeded.
- `npm run typecheck:critical` passed.

## Estimated Load Reduction

This pass removes the largest public hot-path aggregate fanout:

- Homepage render: approximately 9 DB reads -> 0 DB reads.
- Public blog count callers: approximately 1-2 DB reads -> 0 DB reads.
- Default public blog list: page read + count -> page read only using `take + 1`.
- Admin blog list status counts: 6 reads -> 1 read.
- Admin analytics user metrics: 7 reads -> 1 read.

For crawler-heavy anonymous traffic, homepage and blog count removal should exceed the 50% query-reduction target on those surfaces. Platform-wide reduction still depends on the remaining phases: lesson hub normalized snapshots, learner progress batching, flashcard inventory aggregation, question candidate-pool caching, retention cron batching, and campaign throttling.

## Remaining Work

- Lesson hubs: route rendering still needs normalized pathway/locale/topic snapshots wired into `pathway-lesson-loader`.
- Learner lessons: source capability cache and one-query progress batching still need implementation.
- Flashcards: inventory still needs aggregate-first counts and deferred relation hydration.
- Questions: random/fallback selection still needs candidate-pool cache or ranked SQL.
- Background jobs: retention, campaigns, and bulk updates still need throttling and bulk write conversion.

## Regression Notes

No user-facing copy, learning logic, entitlement logic, auth, routing, or business rules were changed. Snapshot values are eventually consistent by design.
