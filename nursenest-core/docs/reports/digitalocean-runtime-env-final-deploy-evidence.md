# DigitalOcean Runtime Env Final Deploy Evidence

Date: `2026-05-11`
App: `nursenest-core-next`
App ID: `d6a4b825-4d70-4dd4-8d71-04b354d36f43`
Service: `web`
Tracked host: `https://nursenestcore-njhcf.ondigitalocean.app`

## Final status

- active deployment id: `08ba58fa-3fc1-410b-876c-4ae72c1415a3`
- latest deployment id: `5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb`
- rollback yes/no: `yes`
- current main SHA served yes/no: `no`
- verify:do-runtime result: `PASS with warnings`
- smoke:runtime-env result: `skipped because the latest deployment failed before becoming ACTIVE`
- first failing log line if any: `segment_fetch_failed:sitemap-blog.xml:DATABASE_URL is missing in the first runtime Node process (not build ARG). Inspect DigitalOcean component env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding.`

## Current main and deployment mapping

- current `origin/main` SHA at verification time: `b27a12822daa8e443c14ca881c676301e8e61cea`
- latest deployment `5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb` was created from that same SHA
- active deployment remained rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3`
- result: the app is not serving current `main`

## Deployment timeline

1. `ef01504d-186e-4396-adcf-89a99ff059a5`
   - phase: `ERROR`
   - class: `runtime boot`
   - key evidence:
     - earliest standalone bootstrap logged `DATABASE_URL_present=false`
     - first failing line: `database_url_absent_after_standalone_hydrate`

2. `9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802`
   - cause: `manual`
   - source commit: `ba279c69bcb67fca81136e7f2b7ee48019c76c1f`
   - phase: `ERROR`
   - class: `build`
   - DigitalOcean reason: `BuildJobExitNonZero`
   - first failing line:
     - `segment_fetch_failed:sitemap-blog.xml:DATABASE_URL is missing in the first runtime Node process (not build ARG). ...`

3. `5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb`
   - cause: `commit b27a128 pushed to github.com/erikagodin6-jpg/nursenest-core/tree/main`
   - source commit: `b27a12822daa8e443c14ca881c676301e8e61cea`
   - phase: `ERROR`
   - class: `build`
   - DigitalOcean reason: `BuildJobExitNonZero`
   - first failing line:
     - `segment_fetch_failed:sitemap-blog.xml:DATABASE_URL is missing in the first runtime Node process (not build ARG). ...`

## Latest deployment failure evidence

The latest `main` deployment never reached `deploy.components.web.deploy` or `deploy.components.web.wait`. It failed in `build.components.web`.

Relevant build-log tail from `5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb`:

- `## Errors`
- `segment_fetch_failed:sitemap-blog.xml:DATABASE_URL is missing in the first runtime Node process (not build ARG). Inspect DigitalOcean component env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding. app_name=nursenest-core-next component_name=web source_dir=. run_command=node scripts/start-standalone.mjs cwd=/app/nursenest-core script_path=/app/nursenest-core/scripts/sitemap-segmentation-validate.mts deployment_id=(unavailable) doctl_verify_runtime=unavailable app_root=(not available in app runtime) NEXT_PHASE=(unset) npm_lifecycle_event=npx`
- `[sitemap:validate] FAILED — 3 error(s)`
- `error building image: error building stage: failed to execute command: waiting for process to exit: exit status 1`
- `command exited with code 1`
- `✘ build failed`

Interpretation:

- the latest failure is a `build` failure, not an `ACTIVE` deploy and not a health-check failure
- the build invokes `sitemap:validate`, which now reaches a code path that expects `DATABASE_URL`
- because the deployment never became active, runtime smoke verification against the latest code was intentionally not run

## verify:do-runtime snapshot

Command run:

- `npm run verify:do-runtime`

Result:

- exit status: `0`
- repo spec summary: `DATABASE_URL` and `AUTH_SECRET` attached to `services.web.envs` as `RUN_AND_BUILD_TIME` `SECRET`
- live spec summary: matches repo for `source_dir=.`, `run_command=node scripts/start-standalone.mjs`, `DATABASE_URL`, and `AUTH_SECRET`
- deployment freshness:
  - `activeDeploymentId=08ba58fa-3fc1-410b-876c-4ae72c1415a3`
  - `latestDeploymentId=5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb`
  - `activeIsRollback=true`
  - `latestIsActive=false`
  - `latestCommitSha=b27a12822daa8e443c14ca881c676301e8e61cea`
  - `currentMainCommit=b27a12822daa8e443c14ca881c676301e8e61cea`

Warnings emitted:

- `DATABASE_URL` scope is `RUN_AND_BUILD_TIME` even though `RUN_TIME` is preferred in principle
- active deployment is a rollback
- latest deployment is not active
- Stripe runtime env keys are incomplete, but those remain warnings for this finalization pass

## Smoke status

Command intentionally not run:

- `BASE_URL=https://nursenestcore-njhcf.ondigitalocean.app npm run smoke:runtime-env`

Reason:

- the newest deployment from current `main` failed before becoming `ACTIVE`
- running smoke against the public base URL would only test rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3`, not the failed candidate deployment

## Conclusion

Production is still serving rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3`.

The deployment finalization requirement is not satisfied. A fresh deployment from current `main` has not become `ACTIVE`; the newest candidate `5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb` failed during build when `sitemap:validate` hit a `DATABASE_URL`-required code path.
