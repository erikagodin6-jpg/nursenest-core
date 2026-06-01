# Performance Budget Enforcement

Date: 2026-06-01

## Objective

Create build-blocking performance budgets for the learner platform and public app:

| Budget | Hard Limit | Enforcement |
|---|---:|---|
| Route startup | 3,000 ms | Route registry static check + Playwright route timing |
| API response | 500 ms | Playwright same-origin API timing |
| Database query | 250 ms | Prisma slow-query threshold + captured query budget hook |
| Component source | 100 KB | Static TSX component scan |
| Client bundle | 300 KB | Post-build `.next/static/chunks` scan |

## Files Added Or Changed

- `performance-budget.config.ts`
- `scripts/check-performance-budgets.ts`
- `tests/e2e/performance/learner-activity-performance-budgets.spec.ts`
- `src/lib/db/prisma-slow-query-log.ts`
- `.github/workflows/deployment-gates.yml`
- `docs/reports/performance-budget-enforcement.md`

## CI Integration

The deployment safety gate now runs:

```bash
npm run perf:budgets
```

after the production build artifact check in `.github/workflows/deployment-gates.yml`. This means bundle budgets are evaluated against the actual `.next` build output instead of stale source estimates.

## Runtime Test Integration

The Playwright learner performance suite now caps measured first-content time with the global 3,000 ms route budget and fails when any captured same-origin API request exceeds 500 ms.

## Database Query Enforcement

Prisma slow-query diagnostics now default to 250 ms. CI can only fail on database query duration when a query timing artifact is available, but production and development logs now use the same 250 ms threshold as the hard budget.

## Current Known Violations

The new budget gate is intentionally strict. Current local checks identify existing violations that must be remediated before strict CI can pass:

| Area | Violation |
|---|---|
| Component size | `src/features/admin-blog/admin-blog-control-panel-client.tsx` exceeds 100 KB |
| Component size | `src/features/practice-tests/practice-test-runner-core.tsx` exceeds 100 KB |
| Client bundle size | Existing local `.next/static/chunks/*.js` contains chunks over 300 KB |

These are pre-existing budget breaches, not newly introduced product behavior changes. The gate now prevents additional silent growth and makes remaining remediation visible.

## Verification Commands

```bash
npm run perf:budgets:warn
npm run perf:budgets
```

`perf:budgets:warn` prints violations without failing. `perf:budgets` exits non-zero on any hard-budget breach and is the command used by CI.

## Result

Performance budgets are now centralized, executable, and CI-enforced. The platform has a clear build-blocking contract for route latency, API latency, database query latency, component size, and bundle size.

