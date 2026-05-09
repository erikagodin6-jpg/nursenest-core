# Homepage hydration crash audit — 2026-05-09

## Executive summary

**Root cause (one line):** `PremiumHomepageHero` called `useMarketingI18n` and `useNursenestRegion` inside `try/catch`, which violates the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) and can yield inconsistent hook execution across renders — after hydration React can hit an invalid internal state and throw; the marketing layout `MarketingMainErrorBoundary` then replaces the main column with “Something went wrong loading this section.” (flash of SSR content, then error shell).

## Evidence

### Code

- Before fix, hooks were wrapped in `try/catch` in `src/components/marketing/home/premium-homepage-hero.tsx` (lines ~229–246 pre-change).
- `useNursenestRegion` throws when used outside `NursenestRegionRoot`; catching at the callsite does not make hook usage legal — hooks must run unconditionally at the top level of the component.

### Production / automation (this environment)

- `curl https://www.nursenest.ca/` returned **503 / no_healthy_upstream** (DigitalOcean App Platform could not reach a healthy app instance). Live HTML showed an infrastructure error page, not the Next app — so Playwright against production could not validate UI here (earlier run also timed out waiting for `<main>`).
- Local **`npm run start`** (production-like) failed **`runtime-env-guard-bootstrap`** (missing `AUTH_SECRET` / AI keys, etc.). Full-stack Playwright against a local prod server was **blocked by missing runtime env** in this workspace.

### Validation that did run

- `npm run typecheck:critical` — pass  
- `npm run build` — pass  
- `npm run test:homepage` — **one pre-existing failure**: `homepage-premium-en-pages.contract.test.ts` expects `pages.home.hero.eyebrow` in EN `pages.json` (missing key); **not introduced by this fix.**

## Files changed

| File | Change |
|------|--------|
| `src/components/marketing/home/premium-homepage-hero.tsx` | Call `useMarketingI18n` and `useNursenestRegion` unconditionally at component top level; remove hook-in-`try/catch`. |
| `tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts` | New regression: 5s wait, `pageerror` + `/_next/static/` checks, no crash copy, NurseNest + `<main>` + `<h1>` + nav. |

## Git
- Identify this fix: `git log --oneline -1 -- nursenest-core/src/components/marketing/home/premium-homepage-hero.tsx` (message begins with `fix(production): repair homepage hydration crash`).

- Base SHA (before this commit): `09370e8832222ed5afaa608a4e1acc142c2a8ddb` (`origin/main` at audit time).

## Follow-up (operators)

1. Restore healthy upstream on App Platform so `https://www.nursenest.ca` serves the Next app again; re-run Playwright with `BASE_URL=https://www.nursenest.ca` if desired.
2. For CI/local full-stack E2E, supply required runtime env for `npm run start` or run against a preview deployment with secrets injected.
3. Optionally fix `homepage-premium-en-pages.contract.test.ts` / EN `pages.json` for `pages.home.hero.eyebrow` (existing debt).
