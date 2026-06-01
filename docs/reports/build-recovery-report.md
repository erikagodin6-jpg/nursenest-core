# Build Recovery Report

Date: 2026-06-01

## Final Status

GO. Production build is passing.

## Root Cause

The failing build path had two classes of blockers:

1. Server Component/client boundary violations from client-only dashboard/report-card surfaces being rendered through server routes without a dedicated client boundary.
2. The production build launcher forced Turbopack for a standalone build path that compiled successfully, then failed during standalone trace packaging with missing `.nft.json` artifacts.

The requested smart-quote TypeScript issue was verified in `src/lib/learner/smart-study-next-engine.ts`; the invalid quotation marks are no longer present in that file.

## Files Changed

Source/config changes:

- `scripts/run-next-prod-build.mjs`
- `next.config.mjs`

Build-blocker files verified in corrected state:

- `src/lib/learner/smart-study-next-engine.ts`
- `src/app/(app)/app/(learner)/account/_lib/learner-report-card-route.tsx`
- `src/app/(app)/app/(learner)/account/_lib/learner-report-card-premium-client.tsx`
- `src/app/(app)/app/(learner)/page.tsx`
- `src/app/(app)/app/(learner)/_components/social-study-dashboard-card-client.tsx`
- `src/components/study/peer-comparison-panel.tsx`

Verification artifacts updated by the build:

- `reports/build-artifact-cache/sitemap-validation.json`
- `reports/build-route-timings.json`
- `reports/build-runtime-metrics.json`
- `reports/client-server-boundary-report.json`
- `reports/server-client-boundary-audit.md`

## Fix Summary

- Confirmed `smart-study-next-engine.ts` contains ASCII TypeScript string quotes for `afterActivity`.
- Confirmed no `dynamic(..., { ssr: false })` remains in the requested learner server route/page files.
- Confirmed the report card and social dashboard surfaces render through dedicated client wrappers.
- Removed the forced Turbopack-only production build behavior so `npm run build:production` uses the stable webpack standalone artifact path by default.
- Left Turbopack available as an explicit opt-in via `NN_FORCE_TURBOPACK_BUILD=1`.

## Verification Results

### `npm run typecheck:critical`

Result: PASS.

Critical TypeScript checks completed successfully.

### `npm run build:production`

Result: PASS.

Key build checkpoints:

- Critical typecheck passed.
- Client/server boundary audit passed.
- Next production compile completed.
- Static generation completed: `604/604` pages.
- Standalone artifact verified: `.next/standalone/server.js`.
- Final build status: `[build:production] OK`.

Non-fatal observations:

- Webpack emitted pre-existing `import.meta` warnings in several layout files.
- Build-time logging reported missing auth secret warnings and local Prisma URL parse warnings. These did not fail the production build.

