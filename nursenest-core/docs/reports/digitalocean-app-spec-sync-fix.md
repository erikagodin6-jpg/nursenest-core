# DigitalOcean App Spec Sync Fix

Date: 2026-05-11
App ID: `d6a4b825-4d70-4dd4-8d71-04b354d36f43`
App name: `nursenest-core-next`
Target URL: `https://nursenestcore-njhcf.ondigitalocean.app`

## Status

Blocked. The DigitalOcean app spec and live app configuration were updated to the requested runtime env contract, but no fresh deployment reached `ACTIVE`, so first-boot runtime secret confirmation could not be completed.

## Repo Spec Changes

Canonical nested spec created at:

- `.do/app.yaml`

Verifier-owned outer spec synced at:

- `/root/nursenest-core/.do/app-nursenest-core-next.yaml`

Both specs now declare the `web` service with:

- `DATABASE_URL` as `type: SECRET`, `scope: RUN_TIME`
- `AUTH_SECRET` as `type: SECRET`, `scope: RUN_TIME`
- `AUTH_URL=https://nursenestcore-njhcf.ondigitalocean.app`
- `NEXTAUTH_URL=https://nursenestcore-njhcf.ondigitalocean.app`

Existing live settings preserved from `/tmp/live-app.yaml`:

- app name `nursenest-core-next`
- region `tor`
- GitHub repo `erikagodin6-jpg/nursenest-core`
- branch `main`
- `source_dir: .`
- `run_command: node scripts/start-standalone.mjs`
- `dockerfile_path: Dockerfile`
- `instance_size_slug: basic-xs`
- `instance_count: 1`
- health checks `/readyz` and `/healthz`
- ingress to component `web`
- existing non-secret env keys retained

Secret values were not written into the repo specs. DigitalOcean preserved the already-attached encrypted secret values when the spec was submitted.

## Deployment Attempts

### 1. Manual spec update

Command run:

```bash
doctl apps update d6a4b825-4d70-4dd4-8d71-04b354d36f43 --spec .do/app.yaml --update-sources
```

Tracked deployment:

- `4e5ad658-6939-4424-af06-2aa58134eb98`

Observed result:

- The deployment spec itself showed the corrected env contract under `services.web.envs`.
- Build failed before runtime with DigitalOcean-side `InternalError`.
- Final phase: `CANCELED`

Relevant failure evidence from deployment details:

- build reason code: `InternalError`
- build reason message: `An internal error occurred. Contact support if this persists.`

### 2. Newer deploy-on-push deployment using the updated app config

Tracked deployment:

- `06e62487-7fa6-4756-b2cf-320d7c7eaad6`

Observed result:

- This deployment inherited the corrected env contract:
  - `AUTH_SECRET` `RUN_TIME` `SECRET`
  - `DATABASE_URL` `RUN_TIME` `SECRET`
  - `AUTH_URL` and `NEXTAUTH_URL` both set to the app origin
- Build progressed substantially farther than the first attempt:
  - i18n compile completed
  - lesson index generation and verification completed
  - Next.js production build and standalone artifact verification completed
  - image push/cache save steps were logged
- It still failed before runtime.

Final failure from deployment details:

- final phase: `ERROR`
- build reason code: `BuildJobTerminated`
- build reason message: `Your build job failed because it was terminated. This often happens due to resource exhaustion.`

## Live App Config Evidence

After the spec update, DigitalOcean deployment objects showed the live app config with:

- `AUTH_SECRET` present, `scope: RUN_TIME`, `type: SECRET`
- `DATABASE_URL` present, `scope: RUN_TIME`, `type: SECRET`
- `AUTH_URL` present with the app origin
- `NEXTAUTH_URL` present with the app origin

This confirms the configuration change stuck at the app spec level even though no fresh deployment became active.

## Runtime Verification

### `npm run verify:do-runtime`

Result: pass with warnings

Key output:

- repo spec summary showed `DATABASE_URL` and `AUTH_SECRET` attached under `service=web`, both `RUN_TIME`, both `SECRET`
- live spec summary showed the same corrected runtime contract
- active deployment ID: `2b85db8c-8eda-4d89-98c2-27dda61b78d6`
- latest deployment ID: `06e62487-7fa6-4756-b2cf-320d7c7eaad6`
- `activeIsRollback: true`
- `latestIsActive: false`

This means the site is still serving a rollback deployment, not the newly corrected config in a fresh runtime process.

### `BASE_URL=https://nursenestcore-njhcf.ondigitalocean.app npm run smoke:runtime-env`

Result: pass

Observed:

- `/healthz` -> `200`
- `/readyz` -> `200`
- `/` -> `200 text/html; charset=utf-8`

Important caveat:

- This only proves the currently active deployment is serving traffic.
- It does not prove the corrected spec has reached runtime, because `verify:do-runtime` showed the active deployment is still the rollback deployment.

## First Boot Log Confirmation

Not completed.

Required lines could not be confirmed for the corrected deployment because neither post-fix deployment reached runtime:

- `DATABASE_URL_present: true`
- `AUTH_SECRET_present: true`
- `NEXTAUTH_URL_present: true` or `AUTH_URL_present: true`

`doctl apps logs ... --type run` for deployment `06e62487-7fa6-4756-b2cf-320d7c7eaad6` was not available because the deployment never left the build phase.

## Current Conclusion

The env-spec fix itself is in place:

- repo specs updated
- live app spec updated
- runtime env attachment verified in DigitalOcean metadata

The remaining blocker is deployment health:

- one post-fix deployment failed with DigitalOcean `InternalError`
- the next failed with `BuildJobTerminated` / likely resource exhaustion
- the active deployment remains a rollback

Until a fresh deployment reaches `ACTIVE`, this task is not resolved and the first Node-process runtime secret confirmation cannot be truthfully claimed.

## Recommended Next Step

Trigger a fresh deployment only after addressing the builder-resource failure on the current `main` commit, then repeat:

1. poll until the latest deployment is `ACTIVE`
2. confirm earliest run logs show the required `*_present: true` lines
3. rerun `npm run verify:do-runtime`
4. rerun `BASE_URL=https://nursenestcore-njhcf.ondigitalocean.app npm run smoke:runtime-env`
