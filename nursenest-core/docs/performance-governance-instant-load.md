# Performance Governance & Instant-Load Architecture

Last updated: 2026-05-29

## Product Budgets

| Surface | TTFB | Interactive/load |
| --- | ---: | ---: |
| Questions | <500ms | <2s |
| Flashcards | <500ms | <2s |
| Lessons | <500ms | <2s |
| Clinical Skills | monitored | <2s |
| Pharmacology | monitored | <2s |
| ECG | monitored | <2s |
| CAT launch | <500ms | <3s |
| LOFT / OSCE launch | <500ms | <3s |

The canonical contract lives in `src/lib/performance/instant-load-architecture.ts`.

## Architecture Rules

- Activity pages render shell-first: learner chrome, navigation, header, and controls must not wait on analytics or recommendations.
- Activity metadata comes from manifests and Redis/snapshot-backed loaders before any live database fallback.
- Background-only work includes analytics, readiness refreshes, recommendation generation, streaks, achievements, activity tracking, and engagement scoring.
- New Grad and Allied reuse the same activity manifests, route budgets, cache warmer, and shared learner surfaces. Content changes; engines do not fork.

## Manifest Layer

Activity manifests are exported by:

```bash
npm run manifests:activity
```

The full snapshot pipeline also exports activity manifests:

```bash
npm run snapshots:run-all
```

Generated snapshot paths:

- `activity-manifests/rn-manifest.json`
- `activity-manifests/rpn-manifest.json`
- `activity-manifests/np-manifest.json`
- `activity-manifests/allied-manifest.json`
- `activity-manifests/newgrad-manifest.json`
- `activity-manifests/prenursing-manifest.json`

## Warm Cache Flow

After authenticated app shell hydration, `LearnerCacheWarmer` sends a non-blocking request to:

```text
POST /api/learner/activity-warm-cache
```

That route warms the activity manifest plus existing question, flashcard, lesson, and ECG manifest keys from Redis/snapshot sources. It is capped by a short warm budget and never blocks current-page rendering.

## CI Governance

Run:

```bash
npm run perf:governance
npm run perf:governance:strict
```

The governance check now verifies:

- required activity budgets exist
- learner activity routes remain CI-enforced
- hard TTFB/load budgets remain intact
- warm-cache client and API route exist
- performance observability modules exist

Live proof still requires the paid learner Playwright budget run:

```bash
npm run test:e2e:performance-budgets:record
npm run perf:activity-report
```

