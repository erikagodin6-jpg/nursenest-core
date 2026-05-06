# Large `"use client"` components — Phase 1 guardrail

## Goal

Surface **client-bundle weight debt** early without failing CI. Phase 2 can introduce hard caps, route-level code splitting, or ownership per feature teams.

## How it runs

```bash
cd nursenest-core
npm run audit:large-client-components
```

- Scans `src/**/*.tsx` under the app package for files starting with `"use client"`.
- Reports line counts and flags files above **warn** (default 900 lines) and **future CI** (default 1400 lines) thresholds.
- **Never fails** the script in Phase 1 (exit 0); CI can opt in later.

## Known hot spots (tracked explicitly)

| File | Role |
|------|------|
| `practice-test-runner-client.tsx` | Long-lived practice session UI |
| `admin-blog-control-panel-client.tsx` | Admin authoring surface |
| `question-bank-practice-client.tsx` | Question bank + filters |
| `practice-tests-hub-client.tsx` | Hub + entitlements UX |
| `site-header.tsx` | Global marketing chrome |

## Phase 2 plan (sketch)

1. Split **data hooks** from **presentation** in the largest hubs (flashcards/questions/practice tests).
2. Prefer **dynamic imports** for below-the-fold panels already used in learner shell patterns.
3. Add optional **CI failure** only when a *new* file crosses the upper threshold (requires baseline file or diff-aware script).
