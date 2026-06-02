# Live Layout Deployment Drift Fix

Date: 2026-05-10

## Problem

The site-wide premium layout changes were committed and pushed, but the live site continued to render the previous layout.

## Root Cause

The active production deployment watches `main` through DigitalOcean App Platform, but `origin/main` still had a stale CSS artifact assumption in the production build wrapper and post-deploy probe. The committed gate required CSS under:

```text
.next/static/css/*.css
```

Current Next output in this checkout emits CSS under:

```text
.next/static/chunks/*.css
```

That means the Next compile can succeed, but the deploy artifact verification can fail before DigitalOcean promotes the deployment. App Platform then continues serving the previous successful deployment, so the new committed layouts do not appear live.

## Evidence

Local Next static output shape contained CSS in chunks, not the legacy `css` directory:

```text
.next/static/chunks/083fl7qd49tez.css
.next/static/chunks/0ewpnp4rkil7s.css
.next/static/chunks/06bv4~g8b-t_7.css
.next/static/chunks/07_qakfj5smkh.css
.next/static/chunks/0fb55art1w3hj.css
```

`origin/main` had the old check:

```js
assertNonEmptyDir("static/css", path.join(staticRoot, "css"), (n) => n.endsWith(".css"));
```

The active DigitalOcean spec builds from the repo root intentionally:

- `.do/app-nursenest-core-next.yaml`
- `dockerfile_path: Dockerfile`
- `source_dir: .`
- branch: `main`

The root `Dockerfile` copies the production app source and builds from the real app root:

- `COPY nursenest-core ./nursenest-core`
- `WORKDIR /app/nursenest-core`
- `npm run heroku-postbuild`
- `npm run build:deploy`

## Fix

Updated deploy artifact detection to search recursively under `.next/static`:

```text
.next/static/**/*.css
```

This keeps the check strict enough to fail if no CSS exists, but no longer assumes a specific subdirectory that Next may change.

Also updated the remote post-deploy CSS probe to accept any rendered `/_next/static/**/*.css` asset and verify it returns `text/css`.

## Files Changed

- `nursenest-core/scripts/run-next-prod-build.mjs`
- `nursenest-core/scripts/deploy-deterministic-gate-remote.mjs`
- `nursenest-core/scripts/verify-standalone-artifact.test.cjs`
- `nursenest-core/docs/reports/live-layout-deployment-drift-fix.md`

## Layout CSS Evidence

`nursenest-core/src/app/globals.css` imports the new layout CSS layers:

- `./full-platform-convergence.css`
- `./premium-color-depth-convergence.css`
- `./premium-atmospheric-ecosystem-convergence.css`
- `./premium-mobile-study-experience-audit.css`
- `./premium-allied-newgrad-convergence.css`

Representative selectors present in source CSS:

- `[data-nn-premium-full-platform-convergence]`
- `.nn-premium-practice-hub`
- `.nn-dash--learner-home`
- `[data-nn-allied-pathway-hub="1"]`
- `[data-nn-new-grad-convergence="1"]`

## Version Traceability

Runtime version endpoints already exist and are marked `Cache-Control: no-store`:

- `/api/version`
- `/api/runtime/version`

After deployment, compare their `commit` value to the pushed `main` SHA.

## Post-Push Live Status

The hotfix was pushed to `origin/main` at:

```text
06335da857cd3751808117bf5ee2a7fe4020d450
```

After that push, external HTTPS probes no longer showed a stale page; they returned service unavailable for all checked surfaces:

- `/`
- `/healthz`
- `/readyz`
- `/api/version`
- `/api/runtime/version`
- `/api/health`

Because `/healthz` is served by `scripts/start-standalone.mjs` before the Next child is ready, a 503 on `/healthz` means the App Platform edge does not have a healthy process accepting traffic. That is a runtime/deployment-health problem, not a browser cache problem and not evidence that the layout CSS is missing from the promoted app.

The most likely next checks are DigitalOcean deployment logs for the latest `main` deployment and App Platform runtime env values. The bootstrap process can exit before binding `/healthz` when strict runtime validation fails, especially if any required runtime values are missing or empty:

- `DATABASE_URL`
- `AUTH_SECRET` or `NEXTAUTH_SECRET`
- `AI_ADMIN_GENERATION_ENABLED`
- one of `AI_INTEGRATIONS_OPENAI_API_KEY`, `OPENAI_API_KEY`, or OpenRouter keys when configured for OpenRouter

The DigitalOcean spec already sets `AI_ADMIN_GENERATION_ENABLED=false`; confirm the deployed app is actually using the checked-in spec and that dashboard env overrides have not left required secrets empty.

## Validation

Run from the clean hotfix worktree:

```bash
node --test scripts/verify-standalone-artifact.test.cjs
```

Also run static layout evidence check for imports and selectors.

Environment limits during investigation:

- `doctl` exists but has no access token configured, so DigitalOcean deployments/logs could not be inspected here.
- Live endpoint checks were limited by environment differences: the external fetch tool observed `503 Service Unavailable`, while shell `curl` could not resolve `nursenest.ca`.
- A later validation attempt in the isolated worktree could not run `tsc` or `tsx` because dependencies were not installed there (`tsc: not found`, `ERR_MODULE_NOT_FOUND: Cannot find package 'tsx'`). Earlier focused deployment artifact tests passed before the push.

## Deploy Instructions

1. Push this hotfix to `main`.
2. Let DigitalOcean App Platform auto-deploy from `main`, or manually redeploy the latest `main` commit.
3. Verify live SHA:

```bash
curl -fsS 'https://<production-host>/api/version?cacheBust='$(date +%s)
curl -fsS 'https://<production-host>/api/runtime/version?cacheBust='$(date +%s)
```

4. Verify remote CSS probe:

```bash
BASE_URL='https://<production-host>' node nursenest-core/scripts/deploy-deterministic-gate-remote.mjs
```

5. Check the live pages for expected premium layout markers/classes and theme styling.

If the host still returns 503, inspect the latest DigitalOcean deployment before changing cache or layout code:

```bash
doctl auth init
doctl apps list
doctl apps list-deployments <app-id>
doctl apps logs <app-id> --type run --follow
```

Look specifically for startup lines from `scripts/start-standalone.mjs`:

```text
[ENV SNAPSHOT]
[ENV VALIDATION ERROR]
[nursenest-core] FATAL:
[nursenest-core] startup_watchdog server_listening
[nursenest-core] startup_watchdog handlers_ready
```

If `server_listening` never appears, fix the failing runtime env/artifact error first. If `server_listening` appears but `handlers_ready` does not, inspect the child Next startup failure.

## Rollback Notes

Rollback is low risk: this change only updates artifact detection and verification. It does not change auth, billing, entitlements, routes, schema, or layout source code. If needed, redeploy the previous successful DigitalOcean deployment or revert this commit.
