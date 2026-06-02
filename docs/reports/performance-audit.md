# Performance Budget Audit
**Generated:** 2026-06-01T00:00:00.000Z (template — updated on each performance run)
**Status:** ✅ Template — run `npx playwright test tests/e2e/performance/performance-budget-comprehensive.spec.ts` to generate live data

---

## How to Run

```bash
# Local
npx playwright test tests/e2e/performance/performance-budget-comprehensive.spec.ts --project=chromium

# Remote (production)
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca \
  npx playwright test tests/e2e/performance/performance-budget-comprehensive.spec.ts --project=chromium
```

---

## Targets Reference

| Surface | Budget | Method |
|---|---|---|
| Homepage | < 2,000 ms | `domcontentloaded` wall-clock |
| Lesson Hub (marketing) | < 2,000 ms | `domcontentloaded` wall-clock |
| Lesson Detail | < 2,000 ms | `domcontentloaded` wall-clock |
| Flashcards | < 3,000 ms | `domcontentloaded` wall-clock |
| Practice Tests | < 3,000 ms | `domcontentloaded` wall-clock |
| CAT | < 3,000 ms | `domcontentloaded` wall-clock |
| Blog Hub | < 2,000 ms | `domcontentloaded` wall-clock |

---

## Results (last run)

_Run the performance budget test to populate this section._

| Surface | Budget | Measured | DomInteractive | Status |
|---|---|---|---|---|
| Homepage | 2000ms | — | — | ⏳ pending |
| Lesson Hub | 2000ms | — | — | ⏳ pending |
| Blog Hub | 2000ms | — | — | ⏳ pending |
| Pricing | 2000ms | — | — | ⏳ pending |
| RN Hub | 2000ms | — | — | ⏳ pending |
| Flashcards (marketing) | 3000ms | — | — | ⏳ pending |

---

## Failed Budgets
_None until test run_
