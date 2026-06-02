# Cache Audit

Generated: 2026-06-02T01:15:11.169Z

| Flow |Cache call sites |Fetch call sites |Prisma call sites |Cache risk |
| --- | --- | --- | --- | --- |
| Homepage | 1 | 0 | 0 | has cache or no DB evidence |
| Lessons Hub | 10 | 0 | 29 | has cache or no DB evidence |
| Lesson Detail | 2 | 0 | 6 | has cache or no DB evidence |
| Flashcards Launcher | 0 | 0 | 4 | possible live DB hot path |
| Flashcard Session Build | 0 | 0 | 6 | possible live DB hot path |
| Practice Test Launcher | 0 | 2 | 0 | has cache or no DB evidence |
| Practice Test Session Build | 0 | 0 | 6 | possible live DB hot path |
| CAT Launcher | 0 | 0 | 0 | has cache or no DB evidence |
| CAT Question Load | 0 | 0 | 3 | possible live DB hot path |
| Blog Hub | 2 | 0 | 29 | has cache or no DB evidence |
| Blog Article | 2 | 0 | 29 | has cache or no DB evidence |
| Dashboard | 0 | 0 | 9 | possible live DB hot path |
| Report Cards | 0 | 0 | 3 | possible live DB hot path |
| Study Plan | 0 | 0 | 0 | has cache or no DB evidence |
| Analytics | 0 | 0 | 0 | has cache or no DB evidence |

Existing durable snapshots confirmed by prior report: `public_home_stats_snapshot` and `blog_index_snapshot`.
