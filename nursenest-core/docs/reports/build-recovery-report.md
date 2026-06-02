# Build Recovery Report

Generated: 2026-06-01

## Summary

Build Recovery Phase 2 completed successfully. The Docker-facing production build now completes with no Turbopack syntax errors and no Next.js Server Component `dynamic(..., { ssr: false })` violations.

The blocking failure found locally after the original fixes was a Next.js route collision from duplicate localized `np` and `pn` pages.

## GitHub Actions Log Access

The latest GitHub Actions log could not be read from this environment:

- `gh auth status` failed because the GitHub CLI is not authenticated.
- The GitHub connector could read repository metadata for `erikagodin6-jpg/nursenest-core`.
- No workflow runs were returned for local `HEAD` commit `b25f5cdae13725c2cbd25f918816fcd7f58ae5fa`.

Local production builds were used as the source of truth.

## Files Checked

- `src/lib/learner/smart-study-next-engine.ts`
- `src/app/(app)/app/(learner)/account/_lib/learner-report-card-route.tsx`
- `src/app/(app)/app/(learner)/account/_lib/learner-report-card-premium-client.tsx`
- `src/app/(app)/app/(learner)/page.tsx`
- `src/app/(app)/app/(learner)/_components/social-study-dashboard-card-client.tsx`
- `src/app/(marketing)/(default)/[locale]/np/page.tsx`
- `src/app/(marketing)/(default)/[locale]/pn/page.tsx`

## Root Cause

1. The smart-study engine no longer contains compile-breaking smart quotes.
2. The learner report card and social dashboard `ssr: false` dynamic imports now live inside dedicated Client Components, not Server Components.
3. The remaining local Next.js build blocker was duplicate route files:
   - `src/app/(marketing)/[locale]/np/page.tsx`
   - `src/app/(marketing)/[locale]/pn/page.tsx`

Those untracked duplicate pages resolved to the same public routes as:

- `src/app/(marketing)/(default)/[locale]/np/page.tsx`
- `src/app/(marketing)/(default)/[locale]/pn/page.tsx`

Next.js rejected the parallel pages because route groups do not create unique URL paths.

## Fix

- Confirmed `src/lib/learner/smart-study-next-engine.ts` has no smart quotes.
- Confirmed server routes no longer contain `dynamic(..., { ssr: false })`.
- Confirmed `LearnerReportCardPremiumClient` and `SocialStudyDashboardCardClient` are Client Components and contain the dynamic imports.
- Removed the untracked duplicate localized route files that caused the Next.js route collision.
- Kept the surviving `(default)` localized routes, which preserve:
  - `/fr/np` and `/es/np` content hub behavior
  - `/fr/pn` and `/es/pn` content hub behavior
  - region shortcut redirects such as `/canada/np` and `/canada/pn`

## Verification

| Command | Result |
| --- | --- |
| `npm run typecheck:critical` | Passed |
| `npm run build:next` | Passed |
| `npm run build:production` | Passed |

Additional verification:

- `build:next` produced and verified `.next/standalone/server.js`.
- `build:production` completed content prep, sitemap validation, Next build, standalone static copy, and dist artifact verification.
- Static generation completed successfully for `604/604` pages.
- Dist artifact verification passed.

## Remaining Non-Blocking Warnings

The build still emits existing warnings about direct `import.meta` access in several layout files. These warnings did not fail the build and were not part of this recovery scope.

Build-time logs also report missing `AUTH_SECRET` for local production build context. The log states this is a build-time warning and should be configured in production runtime environment variables.

## Final Build Status

PASS.

Docker-facing production build completes successfully.
