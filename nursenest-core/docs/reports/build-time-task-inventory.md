# Build-Time Task Inventory

Generated on 2026-05-11 during the build-time optimization pass for NurseNest.

## Build Entry Points

### `package.json` lifecycle and build scripts

| Hook / command | Current command | What runs |
| --- | --- | --- |
| `postinstall` | `node scripts/prisma-safe.mjs generate` | Prisma client generation after install. |
| `prebuild` | `node ../scripts/ensure-build-toolchain.mjs && npm run guard:build-scripts && npm run build:prepare-content` | Build toolchain checks, build-script guard, then content prep. |
| `build` | `node scripts/run-buildpack-build.mjs && node ../scripts/verify-dist-artifacts.mjs` | Production `next build` wrapper plus standalone/dist verification. |
| `heroku-postbuild` | `NN_POSTBUILD_NEXT_BUILD=1 npm run build` | Hosting-platform build entrypoint. |
| `build:prepare-content` | `node scripts/run-build-prepare-content.mjs` | `typecheck:critical`, `i18n:compile`, i18n production validation, lesson indexes, conditional sitemap validation, build git metadata. |
| `build:next` | `node scripts/run-next-prod-build.mjs` | `next build` only, plus standalone static sync + artifact verification. |
| `build:production` | `node scripts/run-build-production.mjs` | `build:prepare-content` then `build:next`, then `verify-dist-artifacts`. |
| `build:deploy` | `npm run build:deploy:postbuild` | Deploy-only post-build verification/pruning. |
| `build:deploy:postbuild` | `node scripts/assert-deploy-git-state.mjs && node scripts/verify-dockerfile-npm-scripts.mjs && node scripts/ensure-standalone-static.mjs && npm run verify:standalone-artifact && node scripts/post-build-prune.mjs` | Post-build deploy checks and pruning. |
| `release:full-audit` | `npm run validate:production-surface && npm run sitemap:validate && npm run sitemap:report && npm run seo:guardrails` | Heavy validation kept out of deploy-critical build. |

### DigitalOcean / container build chain

From `Dockerfile` and `scripts/production-build.sh`:

1. `npm ci --ignore-scripts --no-fund --no-audit`
2. `DATABASE_URL=... npm run db:generate`
3. `npm run heroku-postbuild`
4. `npm run build:deploy`
5. `npm prune --omit=dev --no-fund --no-audit`

The canonical non-Docker production script now runs:

1. `NODE_ENV=development npm ci`
2. `npm --prefix nursenest-core run build:production`
3. Optional `npm run check:bundle-size`
4. `npm prune --production`

## Slow / Repeated Tasks Identified

| Task | Where it was observed | Why it was expensive | Current status |
| --- | --- | --- | --- |
| Prisma generation | `postinstall`, `db:generate`, Docker build | Needed for runtime builds but should not repeat during `next build`. | Unchanged; remains install/build prerequisite only. |
| i18n compilation | `build:prepare-content` | Recompiled all locale shards even when sources were unchanged. | Cached by fingerprint. |
| i18n production validation | `build:prepare-content` | Strict validation still required for correctness. | Still runs every build. |
| Lesson index generation | Previously inside `run-next-prod-build`, now `build:prepare-content` | Large generated artifact set; deep verification was expensive. | Cached by fingerprint, still verifies when regenerated. |
| Lesson index verification | Previously inside `run-next-prod-build` | Deep verification added minutes on cold runs. | Skipped only on valid cache reuse. |
| Sitemap validation | Heavy SEO validation path | Rebuilt/validated segments even when route/content inputs were unchanged. | Cached by fingerprint via `sitemap:validate:if-changed` in deploy-critical builds. |
| Sitemap report generation | `release:full-audit` | Writes markdown report and reruns segment generation. | Kept out of deploy-critical builds. |
| SEO guardrails | `release:full-audit` | Runs multiple route, canonical, hreflang, and breadcrumb tests. | Kept out of deploy-critical builds. |
| Marketing production-surface validation | Previously in `run-next-prod-build` | Extra validation work during the memory-sensitive `next build` phase. | Moved to `release:full-audit`. |
| Build git metadata write | Prebuild/build | Small but duplicated in some flows. | Centralized in `build:prepare-content`. |
| Standalone static sync + artifact verification | `build:next`, `build:deploy:postbuild` | Required for runtime correctness, but must happen after `next build` only. | Preserved; no duplication inside content prep. |

## What Was Repeated Before Optimization

Before the refactor, the memory-sensitive `run-next-prod-build.mjs` path also performed:

- `validate:production-surface`
- lesson index generation and verification
- the main `next build`
- standalone static sync and artifact verification

This mixed content generation with page compilation and increased both elapsed time and memory pressure.

## Current Deploy-Critical Build Shape

### `build:prepare-content`

1. `typecheck:critical`
2. `i18n:compile`
3. root i18n production validation
4. lesson index gate
5. `sitemap:validate:if-changed`
6. `write-build-git-meta`

### `build:next`

1. low-memory build guard / config
2. `next build`
3. standalone static asset sync
4. standalone artifact verification

### `build:production`

1. `build:prepare-content`
2. `build:next`
3. `verify-dist-artifacts`

## Artifact Cache Coverage

| Artifact / step | Cache manifest | Rebuild triggers |
| --- | --- | --- |
| i18n compiled shards | `tools/i18n/generated/compile-artifact-cache.json` | Input fingerprint change, missing outputs, corrupt cache, `CI_FORCE_REBUILD=1`. |
| Lesson indexes | `reports/build-artifact-cache/lesson-indexes.json` | Input fingerprint change, missing outputs, corrupt cache, `CI_FORCE_REBUILD=1`. |
| Sitemap validation | `reports/build-artifact-cache/sitemap-validation.json` | Input fingerprint change, missing outputs, corrupt cache, `CI_FORCE_REBUILD=1`. |

All cached steps log whether they were reused or regenerated. Regenerated artifacts still run their normal verification before the cache manifest is updated.

## Static Generation Audit Notes

The route audit showed that the public pathways, blog surfaces, tools, and lesson hubs were already primarily in dynamic/on-demand mode in the production route table. The biggest measurable build pressure came from:

- heavyweight marketing imports loaded at the top level
- broad marketing locale bundles loaded on routes that only needed shared layout shards
- content preparation work executing alongside `next build`

For that reason, the optimization pass focused on content caching, route-local imports, and narrower i18n loading rather than changing core route mode on high-value hubs.

## Heavy Validation Intentionally Moved Out of Deploy-Critical Builds

These remain available, but no longer gate the hot production build path:

- `validate:production-surface`
- `sitemap:report`
- `seo:guardrails`

They are now grouped under `release:full-audit`.
