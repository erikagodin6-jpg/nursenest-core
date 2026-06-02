# Hydration & client-boundary risk hotspots

**Purpose:** Highlight **client components** and **large islands** that inflate JS payload and hydration work on learner and marketing routes. *Surgical* changes only — preserve SEO, public lessons, and marketing behavior.

## Automated report (nursenest-core)

The package ships `npm --prefix nursenest-core run report:hydration-risk-routes`, which writes:

- `nursenest-core/reports/hydration-risk-routes.md`
- `nursenest-core/reports/hydration-risk-routes.json`

Baseline mode (`--write-baseline`) supports CI regression on **new critical** scores.

### Target files (from `report-hydration-risk-routes.mjs`)

| File | Approx risk (script) | Notes |
|------|----------------------|--------|
| `src/components/student/practice-test-runner-client.tsx` | **medium** (~3126 lines) | Largest learner-facing client island — any split should preserve behavior and a11y. |
| `src/components/admin/admin-blog-control-panel-client.tsx` | **medium** (~2859 lines) | **Admin-only** — preferred first target for dynamic `import()` if splitting. |
| `src/components/student/question-bank-practice-client.tsx` | **lower–medium** | Heavy practice UI — consider route-level splitting / lazy panels. |
| `src/components/student/practice-tests-hub-client.tsx` | **lower** | Hub surface — keep paywall and entitlement wiring server-side. |
| `src/app/(student)/app/(learner)/layout.tsx` | **lower** | Checked for accidental `use client` at layout scope (generator reports `useClient: false`). |

## `use client` in `src/app` (sample)

Error boundaries and learner onboarding/account/quick-start flows use `'use client'` in expected places. **Do not** remove error boundaries or collapse layouts without testing learner shells.

Representative paths include `(learner)/*/error.tsx`, `global-error.tsx`, and focused client pages (onboarding, analytics, printables).

## Recommendations (surgical)

1. **Admin first:** Prefer `next/dynamic` + `ssr: false` only inside **admin** routes for heavy editors (blog panel, media dashboards) where SEO is irrelevant.
2. **Learner second:** Split **optional** tabs (e.g. insights, printables) behind interaction, not initial paint — measure with `report:hydration-risk-routes` baseline.
3. **Marketing / public lessons:** Avoid new top-level client wrappers on indexed lesson/marketing pages; keep data loading in RSC/route handlers.
4. **Re-run** `report:hydration-risk-routes.mjs` after refactors and refresh baseline when intentional growth is accepted.

## Related npm scripts

- `report:hydration-risk-routes`
- `audit:runtime-payloads`
- `report:large-client-components`
- `test:learner-shell-imports` (guardrail contract)
