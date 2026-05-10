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

## Validation

Run from the clean hotfix worktree:

```bash
node --test scripts/verify-standalone-artifact.test.cjs
```

Also run static layout evidence check for imports and selectors.

Environment limits during investigation:

- `doctl` exists but has no access token configured, so DigitalOcean deployments/logs could not be inspected here.
- DNS resolution for `nursenest.ca` failed from this environment, so live endpoints could not be fetched here.

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

## Rollback Notes

Rollback is low risk: this change only updates artifact detection and verification. It does not change auth, billing, entitlements, routes, schema, or layout source code. If needed, redeploy the previous successful DigitalOcean deployment or revert this commit.
