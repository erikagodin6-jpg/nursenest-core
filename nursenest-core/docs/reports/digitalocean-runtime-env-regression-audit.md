# DigitalOcean Runtime Env Regression Audit

## Scope

This audit hardens the recurring production regression where DigitalOcean shows `DATABASE_URL` in app configuration, but the deployed runtime later logs `DATABASE_URL_present=false` and exits during bootstrap.

The fix is intentionally limited to deploy/runtime/env reliability. It does not change learner routes, SEO surfaces, content, or product behavior outside startup verification.

## Root-Cause Classes Found

1. **Spec presence was not the same as runtime truth.**
   The previous checks leaned too heavily on repo YAML shape. That allowed a false sense of safety when the live App Platform service, active deployment, or rollback state had drifted from the repo.

2. **Freshness and rollback ambiguity.**
   A stale active deployment or rollback can keep serving logs/runtime even after a spec fix exists in git. Without active-vs-latest deployment reporting, the team could mistake "spec updated" for "runtime fixed."

3. **Env forwarding was not asserted as a shared contract.**
   The standalone parent/child bootstrap path already forwarded env, but that guarantee was not centralized or broadly tested. Runtime wrappers could regress during restructures.

4. **Dotenv hydration could silently compete with runtime env.**
   Disk-based env loading was not explicitly guarded around "runtime env wins." That created room for accidental overwrite semantics during refactors.

5. **Missing-env failures were under-contextualized.**
   The old `DATABASE_URL` boot failure did not include enough deployment/runtime context to distinguish service misattachment, wrong `source_dir`, wrong `run_command`, stale rollback, or missing recent `doctl` verification.

## Files Changed

- `scripts/verify-digitalocean-runtime.mjs`
- `nursenest-core/scripts/start-standalone.mjs`
- `nursenest-core/scripts/runtime-env-guard-bootstrap.mjs`
- `nursenest-core/scripts/lib/runtime-env-contract.mjs`
- `nursenest-core/scripts/lib/standalone-env-forwarding.mjs`
- `nursenest-core/scripts/lib/load-runtime-env.mjs`
- `nursenest-core/scripts/runtime/start-standalone.mjs`
- `nursenest-core/scripts/runtime/build-standalone.mjs`
- `nursenest-core/scripts/run-node-test-filter.mjs`
- `nursenest-core/scripts/list-stripe-runtime-env-keys.mts`
- `nursenest-core/scripts/smoke-runtime-env.mjs`
- `nursenest-core/scripts/runtime-release-checklist.mjs`
- `nursenest-core/scripts/runtime-env-guard-bootstrap.test.mjs`
- `nursenest-core/scripts/standalone-env-forwarding.test.mjs`
- `nursenest-core/src/lib/env/runtime-env-guard.ts`
- `nursenest-core/src/lib/env/require-database-env.ts`
- `nursenest-core/package.json`
- `nursenest-core/docs/deployment/digitalocean-runtime-diagnostics-deploy-checklist.md`
- `nursenest-core/docs/release-safety-checks.md`

## What Changed

### 1. Single runtime env contract

`scripts/lib/runtime-env-contract.mjs` now centralizes:

- expected app/component/runtime metadata
- presence-only keys for earliest diagnostics
- forwarded child env construction
- deployment ID resolution
- cached `verify:do-runtime` status formatting for runtime failures

That contract is used by bootstrap validation and standalone startup logging instead of ad hoc per-file logic.

### 2. Earliest-entrypoint diagnostics

`scripts/start-standalone.mjs` now logs presence-only runtime diagnostics at:

- `standalone_parent_pre_hydrate`
- `standalone_parent_post_hydrate`
- `standalone_parent_contract_validated`

The snapshot includes:

- app name
- component name
- `source_dir`
- `run_command`
- `cwd`
- script path
- deployment ID when available
- presence-only booleans for `DATABASE_URL`, `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXTAUTH_URL`, `AUTH_URL`, `PORT`, `HOSTNAME`

No secret values are logged.

### 3. Dotenv precedence

`scripts/lib/load-runtime-env.mjs` now preserves pre-existing `process.env` values. Platform-injected runtime env wins over `.env` files. Disk hydration only fills missing keys.

### 4. Useful missing-env errors

Missing `DATABASE_URL` now reports:

- app name
- component name
- `source_dir`
- `run_command`
- `cwd`
- script path
- deployment ID when available
- recent `verify:do-runtime` cache status

The message now explicitly points operators toward runtime attachment, source-dir drift, run-command drift, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding instead of a generic "set DATABASE_URL" instruction.

### 5. Live DigitalOcean verification

`npm run verify:do-runtime` now:

- calls `doctl account get`
- calls `doctl apps list`
- verifies the expected account/team and app
- verifies live `services.web`
- verifies live `source_dir`
- verifies live `run_command`
- verifies `DATABASE_URL` is attached under `services.web.envs`
- verifies `DATABASE_URL` scope is runtime-visible
- verifies `DATABASE_URL` type is `SECRET`
- verifies `AUTH_SECRET` exists in the live runtime env contract
- warns for missing Stripe runtime keys using `npm run list:stripe-runtime-env-keys`
- reports active deployment ID, latest deployment ID, in-progress deployment ID, rollback-like state, and active commit vs current `main`
- writes `tmp/do-runtime-verification.json` for runtime bootstrap failures to reference

### 6. Env forwarding guardrails

Runtime wrappers now consistently pass `process.env` or `buildForwardedRuntimeEnv(process.env, overrides)` rather than rebuilding partial env objects.

Touched wrappers:

- `scripts/start-standalone.mjs`
- `scripts/runtime/start-standalone.mjs`
- `scripts/runtime/build-standalone.mjs`
- `scripts/run-node-test-filter.mjs`

### 7. Post-deploy smoke and release checklist

Added:

- `npm run smoke:runtime-env`
- `npm run release:runtime-checklist`

`smoke:runtime-env` checks:

- `/healthz`
- `/readyz`
- `/`

`release:runtime-checklist` runs:

- `npm run typecheck:critical`
- `npm run verify:do-runtime`
- `npm run list:stripe-runtime-env-keys`
- optional sitemap/homepage checks when `RUN_OPTIONAL_RUNTIME_RELEASE_CHECKS=1`

## Tests Added / Updated

Added:

- `scripts/standalone-env-forwarding.test.mjs`

Updated:

- `scripts/runtime-env-guard-bootstrap.test.mjs`

Coverage now includes:

- child-process env forwarding keeps `DATABASE_URL`
- forwarded env overrides only the intended child keys
- standalone/runtime wrapper scripts use `process.env` or `buildForwardedRuntimeEnv`
- dotenv hydration cannot erase an existing runtime `DATABASE_URL`
- bootstrap logs do not leak secret values
- missing `DATABASE_URL` errors include richer runtime/deployment guidance

## How The New Guard Prevents Recurrence

The prior failure mode was "repo config looks correct, runtime still breaks later."

The new flow forces four separate proofs:

1. **Static proof**: repo spec and Docker/runtime contract are coherent.
2. **Live config proof**: DigitalOcean live app/service has the expected runtime secret attachment.
3. **Freshness proof**: the active deployment is identified and compared with the latest attempted deploy and current `main`.
4. **Runtime proof**: earliest bootstrap logs and `smoke:runtime-env` confirm the running process is healthy.

That combination makes it much harder for a future restructure to silently regress env propagation while still looking "configured."

## Commands To Run After Future Restructures

```bash
cd /root/nursenest-core/nursenest-core
npm run typecheck:critical
npm run verify:do-runtime
npm run list:stripe-runtime-env-keys
npm test -- runtime-env-guard-bootstrap
npm test -- standalone-env-forwarding
```

After deploy:

```bash
cd /root/nursenest-core/nursenest-core
BASE_URL=https://www.nursenest.ca npm run smoke:runtime-env
```

Bundled preflight:

```bash
cd /root/nursenest-core/nursenest-core
npm run release:runtime-checklist
```

Optional extra route checks:

```bash
cd /root/nursenest-core/nursenest-core
RUN_OPTIONAL_RUNTIME_RELEASE_CHECKS=1 npm run release:runtime-checklist
```

## Rollback / Deploy Verification Checklist

1. Run `npm run verify:do-runtime`.
2. Confirm the reported **active deployment ID** is the one you expect to inspect.
3. If **latest deployment ID != active deployment ID**, do not declare success yet.
4. If the active deployment is flagged as rollback-like, treat runtime logs as rollback evidence.
5. Compare **active commit SHA** with current `main`.
6. Wait for a fresh post-change deployment to reach `ACTIVE`.
7. Run `BASE_URL=... npm run smoke:runtime-env`.
8. Confirm earliest bootstrap logs show `DATABASE_URL_present=true` and `standalone_parent_contract_validated`.
9. Only then consider the env regression fixed.



## Active Loop Attempts

### Attempt 1

- Failed deployment: `2d640ccb-903d-4c49-9ec4-eb62b7307f55`
- Phase: `ERROR`
- Reason: `DeployContainerExitNonZero`
- Failing step: `deploy.components.web.wait`
- First failing line: `database_url_absent_after_standalone_hydrate`
- Fatal line: `DATABASE_URL is missing in the first runtime Node process`

Fixes applied after this failure:

- centralized runtime env contract helpers
- richer missing-`DATABASE_URL` error context
- live `verify:do-runtime` with account/app/service/freshness checks
- dotenv precedence guard so runtime env beats disk env
- env-forwarding tests and smoke command

### Attempt 2

- Active rollback deployment observed: `a0fd30dc-5599-4785-9163-ec915cfbeb06`
- Latest deployment observed: `ef01504d-186e-4396-adcf-89a99ff059a5`
- `verify:do-runtime` result: live spec is correct for `services.web`, but active runtime remains the rollback
- Current log proof: runtime is alive on the rollback deployment; this is not sufficient to declare the env regression fixed

Additional fixes applied before the next redeploy:

- earliest-entrypoint logging now records `NODE_ENV_present` instead of logging the actual `NODE_ENV` value
- temporary `NN_RUNTIME_ENV_PROBE=1` support prints filtered env key names only (`DATABASE|AUTH|STRIPE|POSTGRES|PORT|HOSTNAME|NODE_ENV`)
- auth-origin validation now validates explicit `AUTH_URL` / `NEXTAUTH_URL` values without fatally blocking runtime when both are blank under the existing trust-host deployment pattern

### Attempt 3

- Failed deployment: `06e62487-7fa6-4756-b2cf-320d7c7eaad6`
- Cause: `commit f86e608 pushed to github.com/erikagodin6-jpg/nursenest-core/tree/main`
- Phase: `ERROR`
- Reason: `BuildJobTerminated`
- Failing step: `build.components.web`
- First failing line: deployment never reached runtime; DigitalOcean terminated the build job after image packaging completed
- Additional regression observed during the build: the deployment spec reverted `AUTH_SECRET` and `DATABASE_URL` from `RUN_AND_BUILD_TIME` back to `RUN_TIME`

Fixes applied after this failure:

- restored the DigitalOcean secret-scope workaround in `.do/app-nursenest-core-next.yaml` so the first runtime Node process receives `AUTH_SECRET` and `DATABASE_URL`
- tightened `.dockerignore` to exclude deploy-irrelevant screenshot/report artifact trees (`preview-screenshots`, `reports/ui-redesign-preview`, and root docs screenshot/report directories) from the Docker build context
- reran `npm run typecheck:critical`, `npm test -- runtime-env-guard-bootstrap`, `npm test -- standalone-env-forwarding`, and `npm run verify:do-runtime` against the new `f86e608` baseline before the next redeploy

### Attempt 4

- Failed deployment: `e6779d1f-f825-464d-bf99-2585416dedef`
- Cause: `manual` (triggered after pushing `821d488` and applying the corrected live app spec)
- Deployment spec proof: `doctl apps get-deployment` showed `AUTH_SECRET` and `DATABASE_URL` attached to `services.web.envs` as `RUN_AND_BUILD_TIME` `SECRET` values, with `run_command=node scripts/start-standalone.mjs` and `source_dir=.`
- Build result: `SUCCESS` (the deployment reached `deploy.components.web.wait`)
- Runtime proof: deployment-scoped run logs for `e6779d1f-f825-464d-bf99-2585416dedef` showed the very first standalone Node process logging `DATABASE_URL_present=false` and `AUTH_SECRET_present=false` at both `standalone_parent_pre_hydrate` and `standalone_parent_post_hydrate`
- First failing line: `database_url_absent_after_standalone_hydrate`
- Fatal line: `DATABASE_URL is missing in the first runtime Node process (not build ARG). Runtime env did not reach the standalone Node process...`
- Final state: DigitalOcean marked the deployment `ERROR` and activated rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3`

Conclusion from this attempt:

- The repo/spec-side fixes are in place and the deployment got far enough to execute `node scripts/start-standalone.mjs` in production
- The failure happens before any repo-side dotenv precedence or child-process env forwarding logic can matter
- With the correct live spec present, the runtime container still starts without `DATABASE_URL` and `AUTH_SECRET`, which points to a DigitalOcean App Platform runtime env injection failure outside the repo/spec

### Current status

- Stop condition `A` was **not** met: no fresh deployment reached `ACTIVE` with `DATABASE_URL_present=true`
- Stop condition `B` **is now proven**: a fresh deployment with the corrected live spec, corrected run command, corrected source dir, and earliest-entrypoint diagnostics still started the runtime process with `DATABASE_URL_present=false` and `AUTH_SECRET_present=false`
- Stop condition `C` is also true operationally: rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3` is active after the failed fresh deployment

Required manual DigitalOcean action:

- In the DigitalOcean App Platform dashboard, open app `nursenest-core-next` and provide DigitalOcean support the failing deployment ID `e6779d1f-f825-464d-bf99-2585416dedef` plus the deployment-scoped runtime log evidence showing `DATABASE_URL_present=false` and `AUTH_SECRET_present=false` despite the live spec listing both secrets on `services.web.envs` as `RUN_AND_BUILD_TIME` `SECRET`
- Ask support to investigate why runtime secrets are not injected into the first Node process for this Dockerfile-based service even though the deployment spec and build-time env configuration are correct
- Keep rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3` active until DigitalOcean resolves the runtime env injection issue or confirms the required account/platform-side remediation

