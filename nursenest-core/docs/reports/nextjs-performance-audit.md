# Next.js Performance Audit

Generated: 2026-06-01T11:09:21.833Z

## Client And Hydration Pressure

| Flow | Source KB | `use client` files | useState | useEffect | fetch | Suspense | Primary Pressure |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Lesson launcher | 79.7 KB | 1 | 2 | 2 | 3 | 0 | Server/data path |
| Lesson detail | 59.7 KB | 0 | 0 | 0 | 0 | 0 | Server/data path |
| Flashcard launcher | 111.1 KB | 1 | 9 | 6 | 1 | 1 | Server shell/Suspense boundary |
| Flashcard session | 91.4 KB | 0 | 0 | 0 | 0 | 0 | Server/data path |
| Practice launcher | 78.8 KB | 1 | 5 | 5 | 2 | 0 | Server/data path |
| Practice session | 237.1 KB | 1 | 10 | 24 | 7 | 0 | Client hydration + API waterfall |
| CAT launcher | 101 KB | 1 | 5 | 5 | 2 | 0 | Server/data path |
| CAT session | 237.1 KB | 1 | 10 | 24 | 7 | 0 | Client hydration + API waterfall |
| Dashboard | 81.3 KB | 0 | 0 | 0 | 0 | 1 | Server shell/Suspense boundary |

## Findings

- Practice/CAT runner is the heaviest client surface by source size and API usage. Its startup must keep session fetches parallel and avoid loading analysis/adaptive follow-ups before the first question renders.
- Flashcard hub has already been moved to shell-first loading; live counts and readiness insights are deferred after first paint.
- Lesson detail still has multiple client follow-up fetches for related practice and study-loop content; those must remain below the educational content priority.
- API routes generally use shared telemetry. NP CAT endpoints were the notable exception and are now wrapped.

## Required Next.js Follow-Ups

- Record `perf-baseline.json` so route-level TTFB, worst API, and domInteractive samples can replace static estimates.
- Inspect production bundle analyzer output before splitting the practice/CAT runner; this script does not guess split points.
- Keep learner hubs shell-first: server render should return meaningful content before optional analytics, weak-area, and count requests finish.
