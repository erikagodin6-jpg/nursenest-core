# NurseNest — final launch blockers

**Truthpack:** Not loaded — this list is **engineering-process** blockers from automated sweep + architecture docs, not product-tier assertions.

## Launch-critical (ordered by severity)

1. **Full TypeScript check red** — `npm --prefix nursenest-core run typecheck` fails; `npm run predeploy:check` fails at same step. **Severity: critical** for any pipeline that gates on `tsc`.  
2. **Release-gate E2E not green (not run)** — `qa:release-gate` not executed in this environment; per `nursenest-core/docs/RELEASE_QA.md` this is the **declared** revenue-critical slice. **Severity: critical** until run on staging with required creds.  
3. **SEO sitemap test regression** — `test:seo-sitemap` reports 1 failing subtest (blog long-form builder). **Severity: high** for teams that gate on full unit matrix; may be acceptable only if explicitly waived with owner sign-off.

## Borderline / environment-specific

- **`production:preflight`** — failed here with Postgres TLS `self-signed certificate in certificate chain`. Treat as **launch-critical** only if the same failure reproduces on the **actual** DigitalOcean App Platform / CI runner with production `DATABASE_URL`. Otherwise: **ops configuration**, not application logic.

## None known (clean in this sweep)

- **Mobile typecheck** — `npm run mobile:typecheck` passed.  
- **Mobile ESLint** — `npm run mobile:lint` passed.  
- **`typecheck:critical`** — passed (subset).  
- **`audit:paywall-security`** — passed.  
- **`test:unit:phase14-mobile-readiness`** — passed.  
- **`audit:build-stability`** — passed.  
- **`test:learner-shell-imports`** — passed.

## Embedded: prioritized blocker list

| Priority | Item |
|----------|------|
| P0 | Green full `nursenest-core` `typecheck` + `predeploy:check`. |
| P0 | Run `qa:release-gate` on candidate staging (`BASE_URL`) with paid test credentials per `RELEASE_QA.md`. |
| P1 | Fix `test:seo-sitemap` failure (blog builder contract). |
| P1 | Confirm `production:preflight` on production-like TLS context. |

## Embedded: immediate vs deferred

| Immediate (pre-promote) | Safe to defer (with gates) |
|-------------------------|----------------------------|
| TS + predeploy green | FlashList migration (mobile perf — if profiling OK) |
| Staging release gate | Query persistence Phase 2 (mobile) |
| SEO unit matrix green | Broader a11y automation |
| DB preflight on DO | Optional extended Playwright slices (`playwright.ci-master.config.ts`) |
