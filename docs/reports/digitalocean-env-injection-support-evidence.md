# DigitalOcean Env Injection Support Evidence

Prepared: 2026-05-11

## Issue Summary

`nursenest-core-next` has repeated failures where DigitalOcean shows `DATABASE_URL` and `AUTH_SECRET` attached in the app/deployment spec, but the actual Node process still starts with those vars missing.

This has happened in two distinct places:

1. During deployment startup for failed deployment `e6779d1f-f825-464d-bf99-2585416dedef`, where the bootstrap parent process exited before the standalone child app could start.
2. During build-time validation for failed manual deployment `9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802`, where DigitalOcean reported build-time env configuration including `DATABASE_URL` and `AUTH_SECRET`, but a later Node process in the same build still reported `DATABASE_URL=unset`.

## App / Deployment IDs

- App ID: `d6a4b825-4d70-4dd4-8d71-04b354d36f43`
- Rollback deployment currently active: `08ba58fa-3fc1-410b-876c-4ae72c1415a3`
- Failed deployment with runtime bootstrap crash: `e6779d1f-f825-464d-bf99-2585416dedef`
- Failed manual deployment with build-time recurrence: `9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802`

## What We Need DigitalOcean To Investigate

Why a deployment/build can show `DATABASE_URL` and `AUTH_SECRET` attached in the App Platform spec, yet the actual Node process still receives neither variable.

Specifically:

- runtime env injection into the first Node process for deployment `e6779d1f-f825-464d-bf99-2585416dedef`
- build-time env injection / process inheritance for deployment `9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802`
- whether rollback state or deployment freshness affected env attachment at container start

## Current Runtime State

Latest verified state from `npm run verify:do-runtime`:

- live app spec still shows `DATABASE_URL` and `AUTH_SECRET` attached under `services.web.envs`
- active deployment is still rollback `08ba58fa-3fc1-410b-876c-4ae72c1415a3`
- unscoped logs follow the rollback deployment while newer attempts may be `ERROR` or `BUILDING`

Verifier output summary:

```text
[verify:do-runtime] live spec summary {"label":"live","appName":"nursenest-core-next","serviceName":"web","sourceDir":".","runCommand":"node scripts/start-standalone.mjs","ingressComponents":["web"],"routeServices":[],"databaseUrl":{"key":"DATABASE_URL","present":true,"attachment":"service","scope":"RUN_AND_BUILD_TIME","type":"SECRET"},"authSecret":{"key":"AUTH_SECRET","present":true,"attachment":"service","scope":"RUN_AND_BUILD_TIME","type":"SECRET"}}
[verify:do-runtime] deployment freshness {"activeDeploymentId":"08ba58fa-3fc1-410b-876c-4ae72c1415a3","latestDeploymentId":"5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb","inProgressDeploymentId":"5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb","activeIsRollback":true,"latestIsActive":false,"logsTargetDeploymentId":"08ba58fa-3fc1-410b-876c-4ae72c1415a3","logsLikelyShowRollbackState":true,"activeCommitSha":null,"latestCommitSha":"b27a12822daa8e443c14ca881c676301e8e61cea","currentMainCommit":"b27a12822daa8e443c14ca881c676301e8e61cea"}
```

## Sanitized Live App Spec Excerpt

Source: `doctl apps get d6a4b825-4d70-4dd4-8d71-04b354d36f43 --output json`

```json
{
  "service": "web",
  "source_dir": ".",
  "run_command": "node scripts/start-standalone.mjs",
  "envs": [
    { "key": "NODE_ENV", "scope": "RUN_AND_BUILD_TIME", "value": "production" },
    { "key": "PORT", "scope": "RUN_TIME", "value": "8080" },
    { "key": "HOSTNAME", "scope": "RUN_TIME", "value": "0.0.0.0" },
    { "key": "AUTH_SECRET", "scope": "RUN_AND_BUILD_TIME", "type": "SECRET" },
    { "key": "DATABASE_URL", "scope": "RUN_AND_BUILD_TIME", "type": "SECRET" },
    { "key": "AUTH_URL", "scope": "RUN_TIME", "value": "https://nursenestcore-njhcf.ondigitalocean.app" },
    { "key": "NEXTAUTH_URL", "scope": "RUN_TIME", "value": "https://nursenestcore-njhcf.ondigitalocean.app" }
  ]
}
```

## Sanitized Failed Deployment Spec Excerpt

Source: `doctl apps get-deployment d6a4b825-4d70-4dd4-8d71-04b354d36f43 e6779d1f-f825-464d-bf99-2585416dedef --output json`

```json
{
  "deployment_id": "e6779d1f-f825-464d-bf99-2585416dedef",
  "phase": "ERROR",
  "created_at": "2026-05-11T06:18:38Z",
  "phase_last_updated_at": "2026-05-11T06:35:55Z",
  "updated_at": "2026-05-11T06:35:57Z",
  "cause": "manual",
  "source_commit_hash": "d0eefa3ac6119eb081089e78dd562a971156c2da",
  "service": "web",
  "source_dir": ".",
  "run_command": "node scripts/start-standalone.mjs",
  "envs": [
    { "key": "NODE_ENV", "scope": "RUN_AND_BUILD_TIME", "value": "production" },
    { "key": "PORT", "scope": "RUN_TIME", "value": "8080" },
    { "key": "HOSTNAME", "scope": "RUN_TIME", "value": "0.0.0.0" },
    { "key": "AUTH_SECRET", "scope": "RUN_AND_BUILD_TIME", "type": "SECRET" },
    { "key": "DATABASE_URL", "scope": "RUN_AND_BUILD_TIME", "type": "SECRET" },
    { "key": "AUTH_URL", "scope": "RUN_TIME", "value": "https://nursenestcore-njhcf.ondigitalocean.app" },
    { "key": "NEXTAUTH_URL", "scope": "RUN_TIME", "value": "https://nursenestcore-njhcf.ondigitalocean.app" }
  ],
  "deploy_error": {
    "code": "DeployContainerExitNonZero",
    "message": "Your deploy failed because your container exited with a non-zero exit code."
  }
}
```

## Rollback Evidence

Source: live app metadata and deployment history

```json
{
  "active_deployment": {
    "id": "08ba58fa-3fc1-410b-876c-4ae72c1415a3",
    "phase": "ACTIVE",
    "cause": "automated rollback after failed deployment of \"e6779d1f-f825-464d-bf99-2585416dedef\"",
    "previous_deployment_id": "e6779d1f-f825-464d-bf99-2585416dedef",
    "cloned_from": "2b85db8c-8eda-4d89-98c2-27dda61b78d6"
  }
}
```

Recent deployment history:

```text
5e3796a6-31a5-4f32-86a6-1eed5c1ed3eb    commit b27a128 pushed to github.com/erikagodin6-jpg/nursenest-core/tree/main    BUILDING
9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802    manual                                                                              ERROR
08ba58fa-3fc1-410b-876c-4ae72c1415a3    automated rollback after failed deployment of "e6779d1f-f825-464d-bf99-2585416dedef" ACTIVE
e6779d1f-f825-464d-bf99-2585416dedef    manual                                                                              ERROR
```

## Runtime Failure Evidence From `e6779d1f-f825-464d-bf99-2585416dedef`

This is the captured runtime log excerpt from the failed deployment. The key point is that the first Node process (`node scripts/start-standalone.mjs`) reported `DATABASE_URL_present:false` and `AUTH_SECRET_present:false` even though the deployment spec above shows both attached.

```text
May 11 06:35:42  [nn-bootstrap] {"phase":"standalone_parent_pre_hydrate","appName":"nursenest-core-next","componentName":"web","sourceDir":".","runCommand":"node scripts/start-standalone.mjs","cwd":"/app/nursenest-core","scriptPath":"/app/nursenest-core/scripts/start-standalone.mjs","deploymentId":null,"DATABASE_URL_present":false,"AUTH_SECRET_present":false,"STRIPE_SECRET_KEY_present":false,"NEXTAUTH_URL_present":true,"AUTH_URL_present":true,"PORT_present":true,"HOSTNAME_present":true,"NODE_ENV_present":true,"pkgRoot":"/app/nursenest-core","DIGITALOCEAN_APP_ID_present":false,"execPath":"/usr/local/bin/node","NEXT_PHASE_present":false,"npm_lifecycle_event_present":false}
May 11 06:35:42  [nn-bootstrap] {"phase":"standalone_parent_post_hydrate","appName":"nursenest-core-next","componentName":"web","sourceDir":".","runCommand":"node scripts/start-standalone.mjs","cwd":"/app/nursenest-core","scriptPath":"/app/nursenest-core/scripts/start-standalone.mjs","deploymentId":null,"DATABASE_URL_present":false,"AUTH_SECRET_present":false,"STRIPE_SECRET_KEY_present":false,"NEXTAUTH_URL_present":true,"AUTH_URL_present":true,"PORT_present":true,"HOSTNAME_present":true,"NODE_ENV_present":true,"pkgRoot":"/app/nursenest-core","DIGITALOCEAN_APP_ID_present":false,"execPath":"/usr/local/bin/node","NEXT_PHASE_present":false,"npm_lifecycle_event_present":false}
May 11 06:35:42  [nn-bootstrap] {"event":"database_url_absent_after_standalone_hydrate","message":"DATABASE_URL is absent in the Node runtime process after disk hydration; inspect deploy component env attachment, source_dir, and run_command.","appName":"nursenest-core-next","componentName":"web","sourceDir":".","runCommand":"node scripts/start-standalone.mjs","cwd":"/app/nursenest-core","scriptPath":"/app/nursenest-core/scripts/start-standalone.mjs","deploymentId":null,"pkgRoot":"/app/nursenest-core"}
May 11 06:35:42  [ENV SNAPSHOT] {
May 11 06:35:42    phase: 'runtime_env_guard_snapshot',
May 11 06:35:42    appName: 'nursenest-core-next',
May 11 06:35:42    componentName: 'web',
May 11 06:35:42    sourceDir: '.',
May 11 06:35:42    runCommand: 'node scripts/start-standalone.mjs',
May 11 06:35:42    cwd: '/app/nursenest-core',
May 11 06:35:42    scriptPath: '/app/nursenest-core/scripts/start-standalone.mjs',
May 11 06:35:42    deploymentId: null,
May 11 06:35:42    DATABASE_URL_present: false,
May 11 06:35:42    AUTH_SECRET_present: false,
May 11 06:35:42    STRIPE_SECRET_KEY_present: false,
May 11 06:35:42    NEXTAUTH_URL_present: true,
May 11 06:35:42    AUTH_URL_present: true,
May 11 06:35:42    PORT_present: true,
May 11 06:35:42    HOSTNAME_present: true,
May 11 06:35:42    NODE_ENV_present: true
May 11 06:35:42  }
May 11 06:35:42  Error: DATABASE_URL is missing in the first runtime Node process (not build ARG). Runtime env did not reach the standalone Node process; inspect DigitalOcean component env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding. app_name=nursenest-core-next component_name=web source_dir=. run_command=node scripts/start-standalone.mjs cwd=/app/nursenest-core script_path=/app/nursenest-core/scripts/start-standalone.mjs deployment_id=(unavailable) doctl_verify_runtime=missing cache_path=/app/nursenest-core/tmp/do-runtime-verification.json
    at assertRuntimeDatabaseEnvContractMjs (file:///app/nursenest-core/scripts/runtime-env-guard-bootstrap.mjs:241:13)
    at validateRuntimeEnvOrThrow (file:///app/nursenest-core/scripts/runtime-env-guard-bootstrap.mjs:357:3)
    at file:///app/nursenest-core/scripts/start-standalone.mjs:146:1
    at ModuleJob.run (node:internal/modules/esm/module_job:325:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:606:24)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
May 11 06:35:42  Node.js v20.20.2
May 11 06:35:42  ERROR component terminated with non-zero exit code: 1
```

### Why This Proves It Failed Before The Child App Started

`scripts/start-standalone.mjs` validates env in the bootstrap parent before spawning the standalone child server. The stack trace above dies at:

- `scripts/runtime-env-guard-bootstrap.mjs`
- `scripts/start-standalone.mjs:146`

That means the parent process exited during bootstrap validation, before the standalone child app could be started.

## Build-Time Recurrence From `9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802`

This later manual deployment did not reach the deploy step. It failed in the build step, but it still reproduced the same underlying missing-env symptom.

### DigitalOcean Build Log Shows Secret Configuration Present

```text
› configuring build-time app environment variables:
    SENTRY_ENABLED RUN_HEAVY_BUILD_TASKS NODE_VERSION SKIP_I18N_PREBUILD NN_SKIP_HEAVY_BUILD_REPORTS DATABASE_URL NN_LESSON_INDEX_VERIFY_MODE NN_TIMED_INCLUDE_NPM_PRUNE AUTH_SECRET NODE_OPTIONS NN_LOW_MEMORY_BUILD NN_APP_PLATFORM_BUILD BUILD_WEBPACK_PARALLELISM NODE_ENV NEXT_TELEMETRY_DISABLED NN_FORCE_SINGLE_BUILD_WORKER BUILD_NODE_MAX_OLD_SPACE_SIZE_MB TMPDIR
```

### Later Build Process Still Saw `DATABASE_URL=unset`

```text
[qa-cli-env] cwd=/app/nursenest-core
[qa-cli-env] packageRoot=/app/nursenest-core (env files loaded from here, not from cwd)
[qa-cli-env] pre_dotenv: DATABASE_URL=unset DIRECT_URL=unset
[qa-cli-env] files: .env.local=missing .env.playwright.local=missing .env=missing
[qa-cli-env] after_dotenv_files: DATABASE_URL=unset DIRECT_URL=unset
[qa-cli-env] inferred_source: DATABASE_URL ← unset after dotenv files
[qa-cli-env] prisma_client_will_read: DATABASE_URL (value from shell/dotenv aggregate)
...
- segment_fetch_failed:sitemap-blog.xml:DATABASE_URL is missing in the first runtime Node process (not build ARG). Inspect DigitalOcean component env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding. app_name=nursenest-core-next component_name=web source_dir=. run_command=node scripts/start-standalone.mjs cwd=/app/nursenest-core script_path=/app/nursenest-core/scripts/sitemap-segmentation-validate.mts deployment_id=(unavailable) doctl_verify_runtime=unavailable app_root=(not available in app runtime) NEXT_PHASE=(unset) npm_lifecycle_event=npx
...
error building image: error building stage: failed to execute command: waiting for process to exit: exit status 1
```

### Sanitized Current Deployment Metadata

```json
{
  "deployment_id": "9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802",
  "phase": "ERROR",
  "created_at": "2026-05-11T06:40:34Z",
  "updated_at": "2026-05-11T06:46:45Z",
  "source_commit_hash": "ba279c69bcb67fca81136e7f2b7ee48019c76c1f",
  "build_error": {
    "code": "BuildJobExitNonZero",
    "message": "Your build job failed because it returned a non-zero exit code. See the logs for details."
  }
}
```

## Why This Looks Like A Platform / Env Injection Problem

Across both failing deployments:

- the app/deployment spec shows `DATABASE_URL` and `AUTH_SECRET` attached
- platform-level env configuration output includes those vars
- but the actual Node process still reports `DATABASE_URL_present:false` / `AUTH_SECRET_present:false` or `DATABASE_URL=unset`
- only platform vars such as `PORT`, `HOSTNAME`, `NODE_ENV`, `AUTH_URL`, and `NEXTAUTH_URL` are reliably present in the failing process

That pattern strongly suggests a DigitalOcean App Platform env-injection / secret-attachment problem rather than a missing app-spec declaration.

## Note About Historical Log Retrieval

After a deployment reaches `final_cleanup`, `doctl apps logs ... --deployment ...` no longer returns the run logs for that deployment. Example:

```text
Error: GET https://api.digitalocean.com/v2/apps/d6a4b825-4d70-4dd4-8d71-04b354d36f43/deployments/e6779d1f-f825-464d-bf99-2585416dedef/logs?... cannot get running logs from deployment e6779d1f-f825-464d-bf99-2585416dedef in phase final_cleanup
```

For that reason, the runtime crash excerpt above is preserved from the incident capture itself.

## Suggested Support Ticket Body

Subject:

```text
App Platform attached DATABASE_URL/AUTH_SECRET in spec, but Node process started without them
```

Body:

```text
We are seeing a repeated App Platform env injection failure on app d6a4b825-4d70-4dd4-8d71-04b354d36f43 (nursenest-core-next).

Evidence:

1. Live app spec shows services.web.envs includes DATABASE_URL and AUTH_SECRET.
2. Failed deployment e6779d1f-f825-464d-bf99-2585416dedef also shows DATABASE_URL and AUTH_SECRET attached in the deployment spec.
3. However, the first runtime Node process for that deployment logged:
   DATABASE_URL_present:false
   AUTH_SECRET_present:false
   while PORT/HOSTNAME/NODE_ENV/AUTH_URL/NEXTAUTH_URL were present.
4. The bootstrap parent then threw before the standalone child app started:
   Error: DATABASE_URL is missing in the first runtime Node process (not build ARG)
5. A later manual deployment 9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802 repeated the same missing-env symptom during build validation:
   build-time env configuration listed DATABASE_URL and AUTH_SECRET,
   but a later Node process still saw DATABASE_URL=unset and failed.

Requested investigation:

- Why attached App Platform secrets are visible in the app/deployment spec but missing inside the actual Node process
- Whether rollback/freshness/finalization state affected secret injection
- Whether there is a known regression in App Platform secret propagation for Dockerfile apps using source_dir=. and run_command=node scripts/start-standalone.mjs

Relevant deployments:
- Active rollback: 08ba58fa-3fc1-410b-876c-4ae72c1415a3
- Failed runtime deployment: e6779d1f-f825-464d-bf99-2585416dedef
- Failed build recurrence: 9e6b21d0-aeef-44b6-ba83-6b2c6b4ea802
```
