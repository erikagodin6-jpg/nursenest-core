# Performance Baseline

Generated: 2026-06-02T01:15:11.169Z

Base URL: `http://127.0.0.1:3000`
HTTP reachable: no

No HTTP server was reachable from this shell, so route response times, DB timings, CPU under request load, and p95/p99 latency are not certified. Static source evidence is included; no latency estimates are fabricated.

| Flow |Route |Avg ms |p50 ms |p95 ms |p99 ms |Errors |Prisma sites |Count sites |Source KB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | / | not measured | not measured | not measured | not measured | not measured | 0 | 0 | 4 |
| Lessons Hub | /app/lessons | not measured | not measured | not measured | not measured | not measured | 29 | 5 | 127.9 |
| Lesson Detail | /app/lessons/acute-coronary-syndrome | not measured | not measured | not measured | not measured | not measured | 6 | 0 | 56.5 |
| Flashcards Launcher | /app/flashcards | not measured | not measured | not measured | not measured | not measured | 4 | 2 | 40.3 |
| Flashcard Session Build | /api/flashcards/custom-session | not measured | not measured | not measured | not measured | not measured | 6 | 0 | 90.1 |
| Practice Test Launcher | /app/practice-tests | not measured | not measured | not measured | not measured | not measured | 0 | 0 | 48.6 |
| Practice Test Session Build | /api/practice-tests | not measured | not measured | not measured | not measured | not measured | 6 | 0 | 60.5 |
| CAT Launcher | /app/cat | not measured | not measured | not measured | not measured | not measured | 0 | 0 | 13.1 |
| CAT Question Load | /api/practice-tests/cat-readiness | not measured | not measured | not measured | not measured | not measured | 3 | 0 | 50.6 |
| Blog Hub | /blog | not measured | not measured | not measured | not measured | not measured | 29 | 7 | 87.2 |
| Blog Article | /blog/acute-coronary-syndrome-nursing-care | not measured | not measured | not measured | not measured | not measured | 29 | 7 | 89.1 |
| Dashboard | /app | not measured | not measured | not measured | not measured | not measured | 9 | 2 | 67.5 |
| Report Cards | /app/account/progress | not measured | not measured | not measured | not measured | not measured | 3 | 0 | 33.9 |
| Study Plan | /app/study-plan | not measured | not measured | not measured | not measured | not measured | 0 | 0 | 9.7 |
| Analytics | /app/account/analytics | not measured | not measured | not measured | not measured | not measured | 0 | 0 | 9.7 |

Raw evidence: `reports/scalability-certification/scalability-certification.json`.
