# Learner Journey E2E Suites

Comprehensive RN, PN, and NP learner journeys live under:

- `tests/e2e/rn/rn-learner-journey.spec.ts`
- `tests/e2e/pn/pn-learner-journey.spec.ts`
- `tests/e2e/np/np-learner-journey.spec.ts`

Run with:

```bash
npm run test:e2e:learner-journeys
```

## Seeded Accounts

Provide dedicated paid learner accounts through environment variables:

- `PLAYWRIGHT_RN_EMAIL` / `PLAYWRIGHT_RN_PASSWORD`
- `PLAYWRIGHT_PN_EMAIL` / `PLAYWRIGHT_PN_PASSWORD`
- `PLAYWRIGHT_NP_EMAIL` / `PLAYWRIGHT_NP_PASSWORD`

Optional pathway overrides:

- `PLAYWRIGHT_RN_PATHWAY_ID`
- `PLAYWRIGHT_PN_PATHWAY_ID`
- `PLAYWRIGHT_NP_PATHWAY_ID`

Defaults are Canada RN NCLEX-RN, Canada PN/RPN REx-PN, and Canada NP CNPLE.

## Coverage

Each pathway suite validates:

- auth, dashboard, profile/settings, and logout
- flashcards setup, loading responsiveness, active session, reveal/grading, and resume
- practice setup, focused exam shell isolation, answer flow, rationale, tools, and results
- CAT/adaptive launch behavior without redirect loops
- lessons, pearl rendering, semantic callouts, sidebar stability, and analytics surfaces

## Artifacts

Responsive screenshots are written to:

```txt
test-results/screenshots/rn/
test-results/screenshots/pn/
test-results/screenshots/np/
```

Playwright HTML reports are written to:

```txt
playwright-report/learner-journeys/
```

Traces and videos are retained on failure through `playwright.learner-journeys.config.ts`.
