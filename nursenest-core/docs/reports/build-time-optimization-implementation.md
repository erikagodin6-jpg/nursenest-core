# Build-Time Optimization Implementation

Generated on 2026-05-11 after the successful `npm run build:production` verification pass.

## Outcome

The production build now completes successfully with the heavy content-prep work separated from `next build`, fingerprint-based artifact reuse in place for the most expensive generated artifacts, and narrower marketing route imports/i18n loading to reduce page-data pressure without removing routes or learner features.

## Changed Files

### Build pipeline and caching

- `scripts/build-artifact-cache.mjs`
- `scripts/build-artifact-cache.test.mjs`
- `scripts/production-build.sh`
- `script/compile-i18n.ts`
- `nursenest-core/package.json`
- `nursenest-core/scripts/run-lesson-indexes-for-build.mjs`
- `nursenest-core/scripts/run-sitemap-validate-if-changed.mjs`
- `nursenest-core/scripts/run-build-prepare-content.mjs`
- `nursenest-core/scripts/run-build-production.mjs`
- `nursenest-core/scripts/run-next-prod-build.mjs`

### Route-level import / i18n pressure reduction

- `nursenest-core/src/components/seo/programmatic-seo-page.tsx`
- `nursenest-core/src/components/marketing/marketing-signup-page.tsx`
- `nursenest-core/src/components/marketing/marketing-login-page.tsx`
- `nursenest-core/src/components/marketing/marketing-forgot-password-page.tsx`
- `nursenest-core/src/components/marketing/marketing-reset-password-page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/tools/[slug]/page.tsx`
- `nursenest-core/src/app/(marketing)/[locale]/tools/[slug]/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/flashcards/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/allied-health/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/us/new-grad/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/canada/new-grad/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/allied/[career]/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx`

### Reporting

- `nursenest-core/docs/reports/build-time-task-inventory.md`
- `nursenest-core/docs/reports/build-time-optimization-implementation.md`

## Optimization Applied

### 1. Artifact reuse for expensive generated outputs

Implemented fingerprint-based reuse with the following invalidation rules:

- rebuild when inputs change
- rebuild when outputs are missing
- rebuild when the cache manifest is corrupt/invalid
- rebuild when `CI_FORCE_REBUILD=1`

Applied to:

- i18n compilation
- lesson index generation / verification gate
- deploy-critical sitemap validation

### 2. Build pipeline split

Introduced a three-stage production build shape:

- `build:prepare-content` for generated artifacts and critical preflight
- `build:next` for `next build` only
- `build:production` to orchestrate both and verify output artifacts

This keeps expensive content generation out of the memory-sensitive Next compile step.

### 3. Deploy validation separation

Kept the production build limited to:

- `typecheck:critical`
- required generated artifacts
- conditional sitemap validation
- build metadata write
- standalone/dist verification

Left heavier audits in `release:full-audit`:

- `validate:production-surface`
- `sitemap:report`
- `seo:guardrails`

### 4. Bundle graph / route pressure reduction

Reduced top-level server import pressure by moving large pathway hub components behind route-branch dynamic imports on the exam hub and allied career pages.

### 5. Marketing i18n payload reduction

Replaced several broad `loadMarketingMessages()` calls with `loadMarketingMessageShards(..., MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS)` on public marketing surfaces where the full locale monolith was unnecessary.

This reduced page-data memory pressure without changing routing, locale fallback rules, or public content coverage.

### 6. Build verification fix

Adjusted `build:production` so `verify-dist-artifacts` runs from the package root and correctly detects Next standalone artifacts. This fixed the final post-build failure after the optimized build started succeeding.

## Before / After Measurements

The metrics below came from the local successful optimization run history in `reports/build-runtime-metrics.json`.

### Content prep

| Stage | Before | After | Change |
| --- | ---: | ---: | ---: |
| `build:prepare-content` total | `248484 ms` | `34537 ms` | `-86.1%` |
| `i18n_compile` | `16192 ms` | `2479 ms` | `-84.7%` |
| `lesson_indexes` | `172044 ms` | `532 ms` | `-99.7%` |
| `sitemap_validate_if_changed` | `18484 ms` | `324 ms` | `-98.2%` |

The "before" content-prep sample was the first fully regenerated run. The "after" sample was the later successful hot-cache run.

### Next build bundle

| Bundle | Before | After | Change |
| --- | ---: | ---: | ---: |
| historical `run-next-prod-build` bundle (`validate_production_surface` + lesson gate + `next build` + standalone verification) | `323832 ms` | `212967 ms` | `-34.2%` |

The optimized `next build` stage also completed with a lower successful peak RSS than the earlier historical mixed stage:

- historical successful mixed stage peak RSS: `6511 MB`
- optimized successful `next build` peak RSS: `6019 MB`

### Stability notes

A first optimized `build:production` run still failed with `SIGKILL` during `next build` (`289555 ms`, peak RSS `5771 MB`) before the broader marketing i18n narrowing pass and final verifier fix landed. The final rerun completed successfully.

## What Was Cached / Skipped On The Final Successful Run

- `i18n_compile`: reused (`fingerprint_match`)
- `lesson_indexes`: reused (`fingerprint_match`)
- `sitemap_validate_if_changed`: reused (`fingerprint_match`)

## What Still Runs Every Build

- `typecheck:critical`
- i18n production validation
- `next build`
- standalone static sync
- standalone artifact verification
- dist/standalone verification
- build git metadata write

## Expected Build-Time Impact

- Hot rebuilds benefit most: repeated content-prep work drops from roughly 4 minutes to roughly 35 seconds.
- The `next build` phase is now isolated from lesson-index generation and heavier validation, reducing memory pressure and making failures easier to diagnose.
- Manual or CI-only SEO audits remain available, but no longer slow down deploy-critical builds.

## Rollback Notes

If this optimization needs to be reverted, undo in this order:

1. Restore the old `package.json` build/prebuild wiring.
2. Restore the old `run-next-prod-build.mjs` behavior that performed lesson-index gating inline.
3. Remove `scripts/build-artifact-cache.mjs` integration from `compile-i18n.ts`, `run-lesson-indexes-for-build.mjs`, and `run-sitemap-validate-if-changed.mjs`.
4. Revert the route-level `loadMarketingMessageShards` / dynamic-import changes if a regression is traced to narrower route loading.

## Commands Run

- `npm run test:build-cache`
- `npm run typecheck:critical`
- `npm run build:prepare-content`
- `npm run build:production`
- `npm run sitemap:validate`
- `node --import tsx --test src/lib/marketing/marketing-default-layout-home-streaming.contract.test.ts src/lib/lessons/pathway-lesson-route-access.test.ts src/lib/blog/blog-canonical-pipeline.contract.test.ts src/lib/seo/sitemap-merged-route.test.ts src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx`
- standalone smoke fetches against:
  - `/`
  - `/us/rn/nclex-rn`
  - `/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`
  - `/blog/clinical-judgment-on-exam-day`

## Verification Summary

- `typecheck:critical`: passed
- `build:prepare-content`: passed
- `build:production`: passed
- `sitemap:validate`: passed
- Focused route contracts: passed
- Built-server smoke routes: all four returned HTTP `200`
- Lints on edited files: no new linter errors

## Residual Risk

- The standalone local smoke required local non-production URL/auth placeholders, so runtime env warnings unrelated to these build optimizations still appear in local startup logs.
- Public route smoke confirmed `200` responses and route metadata presence on the pathway, lesson, and blog detail routes; broader live canonical/hreflang behavior remains covered by the SEO contract and sitemap validation suites kept in the repo.
