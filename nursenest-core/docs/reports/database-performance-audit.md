# Database Performance Audit

Generated: 2026-06-01T11:09:21.833Z

## Summary

Generated from the database performance war room initiative.

## Learning Route Query Pressure

| Flow | Prisma | findMany | count | groupBy | include | select | Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Lesson launcher | 14 | 4 | 4 | 0 | 0 | 9 | High |
| Lesson detail | 8 | 1 | 0 | 0 | 0 | 5 | Low |
| Flashcard launcher | 0 | 0 | 0 | 0 | 0 | 0 | Low |
| Flashcard session | 24 | 11 | 3 | 0 | 0 | 27 | High |
| Practice launcher | 4 | 3 | 0 | 0 | 0 | 3 | Low |
| Practice session | 3 | 1 | 0 | 0 | 0 | 3 | Low |
| CAT launcher | 9 | 6 | 2 | 0 | 0 | 6 | Medium |
| CAT session | 9 | 5 | 2 | 0 | 0 | 7 | Medium |
| Dashboard | 13 | 4 | 2 | 1 | 0 | 10 | Medium |

## Confirmed Hotspots

- `src/lib/flashcards/build-flashcard-custom-session.ts` remains the largest flashcard session risk because custom session construction can read a large flashcard pool before final filtering.
- `src/lib/practice-tests/cat-pool.ts` and NP CAT routes are bounded but payload-heavy; they select CAT question fields and session state during startup/answer turns.
- `src/lib/learner/load-learner-dashboard.ts` is the dashboard pressure point because it aggregates lesson progress, analytics, readiness, practice history, and study-plan state.
- Lesson hub/detail routes combine pathway resolution, progress, related study loops, and client-side result fetches.

## Instrumentation Fix Applied

- Added shared API telemetry/query context to `GET /api/practice-tests/cat-readiness`.
- Added shared API telemetry/query context to `POST /api/cat/np/session`.
- Added shared API telemetry/query context to `POST /api/cat/np/answer`.
- Added shared API telemetry/query context to `GET`/`HEAD /api/cat/np/analysis`.

## Index Guidance

No migration was created because this run did not include production `EXPLAIN` output. Existing reports recommend validating composite indexes for recent exam attempts/sessions, `(userId, lessonId)` progress lookups, flashcard deck/status/order filters, and exam-question pool filters before adding schema changes.
