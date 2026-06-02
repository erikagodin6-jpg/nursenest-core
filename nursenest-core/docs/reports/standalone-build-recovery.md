# Standalone Build Recovery

Generated: 2026-06-02

## Executive Summary

Standalone packaging is healthy on the current branch. The current wrappers already target the actual Next.js 16 standalone artifact path:

- `.next/standalone/server.js`
- `.next/standalone/.next/static`
- `.next/standalone/.next/required-server-files.json`
- root trace files after completed build:
  - `.next/next-server.js.nft.json`
  - `.next/next-minimal-server.js.nft.json`

The missing `.next/next-server.js.nft.json` condition was not reproducible after a completed build. During the intermediate `Collecting build traces ...` phase, route-level `.nft.json` files exist before the root `next-server.js.nft.json` is finalized. After `next build --webpack` exits successfully, the root trace exists.

## Scope

Inspected only:

- `next.config.mjs`
- `scripts/run-next-prod-build.mjs`
- `scripts/run-build-production.mjs`
- root `Dockerfile`
- generated `.next` artifacts
- standalone startup path

No application code was modified.

## Configuration Findings

`next.config.mjs` is configured correctly:

```js
output: "standalone"
```

The production build wrapper runs:

1. `npm run build:prepare-content`
2. `npm run build:next`
3. root `scripts/verify-dist-artifacts.mjs`

The Next build wrapper runs `next build --webpack`, then verifies:

- `.next/static`
- `.next/standalone`
- `.next/standalone/server.js`
- copied standalone static assets
- standalone lesson indexes
- standalone i18n artifacts

The Dockerfile copies the current Next 16 standalone output from:

```text
/app/nursenest-core/.next/standalone
```

to:

```text
/app/nursenest-core/.next/standalone
```

inside the runner image.

## Artifact Findings

See the full artifact inventory in:

`docs/reports/next-build-artifacts.md`

Post-build artifact checks:

```text
root_trace_exists=yes
standalone_server_exists=yes
.next/next-minimal-server.js.nft.json
.next/next-server.js.nft.json
.next/required-server-files.json
```

Standalone server:

```text
.next/standalone/server.js
```

Trace file count in the captured local build inventory:

```text
2078
```

## Root Cause

The current source tree does not have an active standalone packaging defect.

The observed missing trace file is best explained by artifact timing or an obsolete external check:

- `.next/next-server.js.nft.json` is not available throughout the entire trace collection phase.
- Next.js emits many route-level `.nft.json` traces under `.next/server/...` first.
- The root `.next/next-server.js.nft.json` appears after trace finalization.
- Current repo build scripts do not directly require `.next/next-server.js.nft.json`.
- Current repo build scripts verify the real runtime artifact: `.next/standalone/server.js`.

Therefore, a failure that specifically asserts `.next/next-server.js.nft.json` is missing is likely checking too early, checking a partially generated `.next`, or using an older CI/buildpack expectation outside the current wrapper path.

## Files Changed

Build scripts:

- None.

Reports:

- `docs/reports/next-build-artifacts.md`
- `docs/reports/standalone-build-recovery.md`

Generated/updated by build verification:

- build/runtime report artifacts under `reports/`
- `.next/` build output

## Verification Evidence

### Local Production Build

Command:

```bash
npm run build:production
```

Result:

```text
[next-prod-build] next_build_artifacts_ok=1 standalone_server=/root/nursenest-core/nursenest-core/.next/standalone/server.js
[next-prod-build] ensure_standalone_static_ok=1
[verify-standalone-artifact] verified /root/nursenest-core/nursenest-core/.next/standalone/server.js and 1 static asset tree(s)
[next-prod-build] verify_standalone_artifact_ok=1
[verify-dist] OK standaloneServer=/root/nursenest-core/nursenest-core/.next/standalone/server.js
[build:production] OK
```

### Docker Build

Command:

```bash
docker build -t nursenest-core-standalone-audit .
```

Result:

```text
[next-prod-build] next_build_artifacts_ok=1 standalone_server=/app/nursenest-core/.next/standalone/server.js
[next-prod-build] ensure_standalone_static_ok=1
[verify-standalone-artifact] verified /app/nursenest-core/.next/standalone/server.js and 1 static asset tree(s)
[verify-dist] OK standaloneServer=/app/nursenest-core/.next/standalone/server.js
[build:production] OK
Successfully built 036c3c9fc459
Successfully tagged nursenest-core-standalone-audit:latest
```

### Runtime Smoke Test

Command summary:

```bash
docker run -d --name nursenest-standalone-audit -p 18080:8080 \
  -e NN_STRICT_PRODUCTION_ENV=0 \
  -e AUTH_SECRET=... \
  -e NEXTAUTH_SECRET=... \
  -e DATABASE_URL=postgresql://... \
  -e DIRECT_URL=postgresql://... \
  nursenest-core-standalone-audit:latest
```

Result:

```text
healthz=ok
readyz=HTTP/1.1 200 OK
```

Startup log evidence:

```text
[STARTUP_VIS] start-production.mjs: delegating to Next standalone server=/app/nursenest-core/.next/standalone/server.js
✓ Ready in 0ms
[nursenest-core] startup_watchdog handlers_ready_transition ... "reason":"internal_probe"
[nursenest-core] health probe_startup {"route":"/readyz","status":200,...}
```

## Before / After Behavior

Before investigation:

- Build compilation blockers had been resolved.
- Concern remained that standalone packaging failed because `.next/next-server.js.nft.json` was missing.

After verification:

- Local `npm run build:production` succeeds.
- `.next/next-server.js.nft.json` exists after completed build.
- `.next/standalone/server.js` exists.
- Docker image builds successfully.
- Runner image starts through `scripts/start-production.mjs`.
- Standalone server becomes ready.
- No missing trace file errors were observed.

## Final Build Status

GO for standalone packaging.

No build-script patch was applied because the current scripts already match the actual Next.js 16 output and all required verification passed.
