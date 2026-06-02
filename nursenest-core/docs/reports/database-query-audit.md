# Database Query Audit

Generated: 2026-06-02T01:15:11.169Z

This report records static Prisma call-site evidence because no `DATABASE_URL` is configured in this shell. Live query counts, duplicate query traces, slow query timings, and missing-index confirmation require production/staging query telemetry.

| Severity |Flow |Prisma |findMany |count |groupBy |raw SQL |Cache sites |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Critical | Lessons Hub | 29 | 9 | 5 | 3 | 0 | 10 |
| Critical | Blog Hub | 29 | 15 | 7 | 1 | 0 | 2 |
| Critical | Blog Article | 29 | 15 | 7 | 1 | 0 | 2 |
| High | Dashboard | 9 | 3 | 2 | 1 | 0 | 0 |
| High | Flashcard Session Build | 6 | 6 | 0 | 0 | 0 | 0 |
| High | Practice Test Session Build | 6 | 4 | 0 | 0 | 1 | 0 |
| Medium | Lesson Detail | 6 | 0 | 0 | 0 | 0 | 2 |
| Medium | Flashcards Launcher | 4 | 0 | 2 | 0 | 3 | 0 |
| Medium | CAT Question Load | 3 | 0 | 0 | 0 | 0 | 0 |
| Medium | Report Cards | 3 | 3 | 0 | 0 | 0 | 0 |
| Low | Homepage | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | Practice Test Launcher | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | CAT Launcher | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | Study Plan | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | Analytics | 0 | 0 | 0 | 0 | 0 | 0 |

Critical/High areas to validate live: flashcard session build, CAT question load, lesson hub/detail, dashboard/report card, and blog index.
