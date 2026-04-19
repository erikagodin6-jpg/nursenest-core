# Next Build And Deploy Low-Memory Hardening

## Goal

Keep DigitalOcean deploys stable on constrained builders by standardizing build-time memory, preserving the current single-worker Next.js posture, preventing avoidable build-time heavy work, and failing fast when standalone artifacts are incomplete.

## Scope

- `nursenest-core/package.json`
- `nursenest-core/next.config.ts` validation only unless a concrete mismatch is found
- `.do/app-nursenest-core-next.yaml`
- `nursenest-core/scripts/verify-standalone-artifact.mjs`
- Related standalone/build safety tests
- Build/deploy docs that describe the hardened behavior

## Non-Goals

- No schema, migration, auth, route, or response-shape changes
- No runtime heap increase for app instances unless separately requested
- No broad Next.js build-strategy rewrite
- No deploy-platform migration or instance class change in this task

## Current State

The repo already has several low-memory protections:

- `output: "standalone"` is enabled in `next.config.ts`
- the build uses webpack explicitly
- `experimental.cpus = 1`, `config.parallelism = 1`, `webpackBuildWorker = true`, and `webpackMemoryOptimizations = true` are already set
- `RUN_HEAVY_BUILD_TASKS=false`, `SKIP_I18N_PREBUILD=1`, and `SENTRY_ENABLED=false` are already used on build paths
- `build:deploy` already verifies the standalone artifact and prunes `.next/cache`

The main remaining gaps are:

- build-time heap defaults are split between `3584` in the Next app build scripts and `4096` in droplet deployment guidance
- the active DigitalOcean App Platform spec still uses `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=3584`
- standalone verification currently proves `server.js` exists, but not that the minimum supporting outputs needed for a safe deploy are present
- documentation does not clearly state the low-memory build contract in one place

## Chosen Approach

Use targeted hardening rather than a build-system rewrite:

1. Standardize build-time Node heap defaults to `4096`
2. Preserve the existing single-worker Next posture unless validation shows a concrete mismatch
3. Strengthen standalone artifact verification to check a small required set of outputs
4. Keep build-time heavy work disabled and document the contract
5. Ensure the deploy path fails immediately when required artifacts are missing

## Design

### 1. Build-Time Memory Standardization

Set the default build heap limit to `4096` in the Next app build scripts and in the active DigitalOcean App Platform build-time environment.

This keeps the build default aligned across local deploy-style builds and DigitalOcean builds while still allowing explicit overrides through existing environment variables. The implementation should continue to respect a caller-provided `NODE_OPTIONS` value so operators can override the default when needed.

### 2. Single-Worker Posture

Keep the current `next.config.ts` settings as the low-memory baseline:

- `experimental.cpus = 1`
- `config.parallelism = 1`
- `experimental.webpackBuildWorker = true`
- `experimental.webpackMemoryOptimizations = true`

This task does not proactively tune those values. It only updates them if validation shows a current setting is invalid, ignored, or directly conflicts with the goal of single-worker low-memory builds on the current Next.js version.

### 3. Standalone Output Validation

Expand standalone validation from "entrypoint exists" to "minimum standalone bundle is present and deployable."

The verifier should continue supporting both known entrypoint layouts:

- `.next/standalone/nursenest-core/server.js`
- `.next/standalone/server.js`

In addition, it should fail fast when a required companion output is missing. The required set should stay intentionally small to avoid false positives across Next.js patch releases. The expected checks are:

- resolved standalone `server.js`
- `.next/BUILD_ID`
- a readable `.next/standalone` directory
- a readable `.next/static` directory

If any required artifact is missing, the script should exit with a clear error that names the missing path and tells the operator to regenerate the standalone build.

### 4. Build-Time Heavy Work Protections

Preserve the existing pattern of disabling heavy build-time work through build env and deferred imports. This task should not add new heavy work into config evaluation or standalone verification.

Validation should confirm that:

- build scripts still force `RUN_HEAVY_BUILD_TASKS=false`
- build scripts still skip optional prebuild/i18n work where intended
- standalone verification remains filesystem-only and does not trigger runtime-only app code

### 5. Build Safety Checks

Keep `build:deploy` as the canonical low-memory deploy build path and ensure it fails before pruning or runtime startup when required standalone outputs are missing.

The expected sequence remains:

1. remove stale `.next`
2. run the production build with guarded build env
3. verify standalone artifacts
4. prune build cache

Tests should cover both success and failure paths so regressions in artifact layout checks fail in CI rather than in DigitalOcean deploys.

## Files To Update

- `nursenest-core/package.json`
  - change default build heap fallback from `3584` to `4096`
  - keep existing caller override behavior
- `.do/app-nursenest-core-next.yaml`
  - set `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` to `4096`
  - document that this is the build-time heap target for constrained App Platform builders
- `nursenest-core/scripts/verify-standalone-artifact.mjs`
  - add minimum required artifact checks and clearer failure messages
- `nursenest-core/scripts/verify-standalone-artifact.test.cjs`
  - update expectations for `4096`
  - add test coverage for missing `BUILD_ID`, missing `.next/static`, and missing `.next/standalone`
- docs as needed
  - update deploy/build docs to describe the low-memory build contract and fail-fast artifact verification

## Validation Plan

Run focused verification only:

- standalone verifier tests
- build memory / build safety tests already covering `next.config.ts` and build scripts
- lints on edited files

If practical in the environment, run a deploy-style build command to confirm the verifier passes against a fresh build. If that is too expensive or unavailable, rely on focused tests and script-level checks and report the gap explicitly.

## Risks And Mitigations

### Risk: Overly strict artifact checks break on harmless Next.js layout changes

Mitigation: validate only a small set of stable required outputs instead of enumerating many internal files.

### Risk: Changing single-worker flags could regress build stability

Mitigation: do not change them unless validation finds a concrete mismatch.

### Risk: Runtime memory gets unintentionally changed

Mitigation: keep this task build-only; do not alter `NODE_MAX_OLD_SPACE_SIZE_MB` runtime behavior.

## Success Criteria

- build-time Node heap defaults to `4096` for the Next deploy build path
- the active DigitalOcean App Platform spec matches that `4096` build-time default
- single-worker Next build posture remains intact unless a concrete mismatch is found during validation
- deploy builds fail immediately when required standalone artifacts are missing
- no new build-time execution of runtime-only heavy logic is introduced
