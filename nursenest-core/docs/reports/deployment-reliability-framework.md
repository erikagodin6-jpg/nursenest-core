# Deployment Reliability Framework

Generated: 2026-06-02

## Executive Summary

Implemented a deployment safety framework that fails closed when production would serve an unsafe release.

The framework now validates:

- runtime configuration
- build manifests and standalone artifacts
- expected core route registrations
- retired production failure strings in `.next`
- post-deployment smoke responses
- deployment certification status
- rollback-required evidence on failed certification

## Commands

```bash
npm run deploy:validate:runtime-config
npm run deploy:validate:build-artifacts
BASE_URL=https://www.nursenest.ca npm run deploy:smoke
BASE_URL=https://www.nursenest.ca npm run deploy:certify
```

`deploy:certify` runs runtime config validation, build artifact validation, and production smoke tests when `BASE_URL` or `DEPLOYMENT_BASE_URL` is set.

## Files Added

- `scripts/deployment/validate-runtime-config.mjs`
- `scripts/deployment/verify-build-artifacts.mjs`
- `scripts/deployment/smoke-certify.mjs`
- `scripts/deployment/certify.mjs`

## Files Changed

- `package.json`

Added deployment gate scripts:

```json
{
  "deploy:validate:runtime-config": "node scripts/deployment/validate-runtime-config.mjs",
  "deploy:validate:build-artifacts": "node scripts/deployment/verify-build-artifacts.mjs",
  "deploy:smoke": "node scripts/deployment/smoke-certify.mjs",
  "deploy:certify": "node scripts/deployment/certify.mjs"
}
```

## 1. Runtime Config Validation

Script:

```bash
npm run deploy:validate:runtime-config
```

Validates:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `SPACES_KEY`
- `SPACES_SECRET`
- `SPACES_BUCKET`
- `SPACES_REGION`
- `SPACES_ENDPOINT`

Database validation verifies:

- parseable URL
- `postgres://` or `postgresql://`
- hostname present
- database name present
- port numeric and in range
- local database hosts rejected unless `DEPLOYMENT_CERT_ALLOW_LOCAL_DB=1`

Secret validation verifies:

- present
- at least 32 characters
- not obvious placeholder text

Spaces validation verifies:

- credentials present
- bucket/region available
- endpoint parseable

Secrets are never printed. The runtime report redacts fingerprints.

Report:

```text
reports/deployment-reliability/runtime-config-validation.json
```

## 2. Build Artifact Validation

Script:

```bash
npm run deploy:validate:build-artifacts
```

Validates:

- `.next/server/middleware-manifest.json`
- `.next/server/middleware.js`
- `.next/routes-manifest.json`
- `.next/server/app-paths-manifest.json`
- expected core route registrations
- absence of retired error strings in `.next`

Expected routes:

- `/`
- `/canada/rn/nclex-rn`
- `/canada/pn/rex-pn`
- `/canada/np/cnple`
- `/flashcards`
- `/cat`
- `/practice-tests`
- `/lessons`
- `/readyz`
- `/healthz`

Default retired strings scanned:

- `origin_no_healthy_upstream`
- `no healthy upstream`
- `The request did not complete before the flashcard player could hydrate.`

Override retired-string scan list with:

```bash
NN_RETIRED_ERROR_STRINGS='old string one|old string two' npm run deploy:validate:build-artifacts
```

Report:

```text
reports/deployment-reliability/build-artifact-validation.json
```

## 3. Production Smoke Tests

Script:

```bash
BASE_URL=https://www.nursenest.ca npm run deploy:smoke
```

Validates live responses for:

- `/`
- `/canada/rn/nclex-rn`
- `/canada/pn/rex-pn`
- `/canada/np/cnple`
- `/flashcards`
- `/cat`
- `/practice-tests`
- `/lessons`
- `/readyz`
- `/healthz`

Marketing and learner entry routes must return HTML with HTTP `2xx` or `3xx`.

Readiness/liveness routes must return HTTP `2xx` and text or JSON.

The smoke gate rejects:

- `500`
- `503`
- timeouts
- unhealthy upstream signatures
- non-HTML page responses
- invalid readiness/liveness responses

Reports:

```text
reports/deployment-reliability/deployment-smoke-certification.json
reports/deployment-reliability/deployment-unhealthy.json
```

`deployment-unhealthy.json` is written only when smoke certification fails.

## 4. Deployment Certification

Script:

```bash
BASE_URL=https://www.nursenest.ca npm run deploy:certify
```

Certification status:

- `pass`: promotion allowed
- `fail`: promotion blocked, rollback required

Report:

```text
reports/deployment-reliability/deployment-certification.json
```

When `BASE_URL` is unset, `deploy:certify` runs pre-deployment checks only and skips production smoke tests. Post-deploy certification should always set `BASE_URL`.

## 5. Automatic Rollback Trigger

The rollback trigger is implemented as a fail-closed workflow contract:

- smoke certification failure writes `deployment-unhealthy.json`
- report includes `rollback: "required"`
- command exits nonzero
- CI/deployment workflow should prevent promotion and execute rollback

Failure evidence example:

```json
{
  "status": "unhealthy",
  "reason": "deployment_smoke_certification_failed",
  "rollback": "required"
}
```

## Verification Evidence

### Runtime Config Gate

Command used with safe local dummy values:

```bash
DEPLOYMENT_CERT_ALLOW_LOCAL_DB=1 \
DATABASE_URL='postgresql://user:pass@127.0.0.1:5432/nursenest?schema=public' \
DIRECT_URL='postgresql://user:pass@127.0.0.1:5432/nursenest?schema=public' \
AUTH_SECRET='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' \
NEXTAUTH_SECRET='bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' \
SPACES_KEY='spaces-key-example' \
SPACES_SECRET='spaces-secret-example' \
SPACES_BUCKET='nursenest-images' \
SPACES_REGION='tor1' \
npm run deploy:validate:runtime-config
```

Result:

```text
[deploy:runtime-config] OK DATABASE_URL
[deploy:runtime-config] OK DIRECT_URL
[deploy:runtime-config] OK AUTH_SECRET
[deploy:runtime-config] OK NEXTAUTH_SECRET
[deploy:runtime-config] OK SPACES_KEY
[deploy:runtime-config] OK SPACES_SECRET
[deploy:runtime-config] OK SPACES_BUCKET
[deploy:runtime-config] OK SPACES_REGION
[deploy:runtime-config] OK SPACES_ENDPOINT
```

### Build Artifact Gate

Command:

```bash
npm run deploy:validate:build-artifacts
```

Result:

```text
[deploy:build-artifacts] OK middleware-manifest
[deploy:build-artifacts] OK routes-manifest
[deploy:build-artifacts] OK app-paths-manifest
[deploy:build-artifacts] OK expected-route-registrations
[deploy:build-artifacts] OK retired-error-string-scan
```

Observed metrics:

```text
middleware manifest version: 3
routes manifest version: 3
static routes: 762
dynamic routes: 275
redirects: 37
app paths: 1037
retired error string hits: 0
```

### Certification Without Live Base URL

Command:

```bash
DEPLOYMENT_CERT_ALLOW_LOCAL_DB=1 ... npm run deploy:certify
```

Result:

```text
[deploy:certify] production-smoke skipped because BASE_URL/DEPLOYMENT_BASE_URL is unset.
[deploy:certify] step_end runtime-config status=pass
[deploy:certify] step_end build-artifacts status=pass
```

### Local Packaged Smoke Test

Command:

```bash
BASE_URL=http://127.0.0.1:18081 DEPLOYMENT_SMOKE_ATTEMPTS=1 npm run deploy:smoke
```

Result:

```text
[deploy:smoke] OK / status=200
[deploy:smoke] FAIL /canada/rn/nclex-rn status=500
[deploy:smoke] FAIL /canada/pn/rex-pn status=500
[deploy:smoke] FAIL /canada/np/cnple status=500
[deploy:smoke] OK /flashcards status=200
[deploy:smoke] OK /cat status=200
[deploy:smoke] OK /practice-tests status=200
[deploy:smoke] FAIL /lessons status=500
[deploy:smoke] OK /readyz status=200
[deploy:smoke] OK /healthz status=200
[deploy:smoke] deployment_unhealthy rollback_required
```

Reason:

The local Docker smoke intentionally used a placeholder localhost database URL. Runtime logs show:

```text
DATABASE_URL matches a localhost placeholder ... Refusing to connect.
```

This proves the certification gate blocks promotion when core routes fail, even if the container starts and `/healthz` passes.

## Before / After Deployment Reliability Metrics

Before:

- runtime config validation: partial runtime guard, not a standalone deployment certification step
- build manifest validation: artifact checks existed for standalone server, but no deployment-level route registration/retired-string gate
- production smoke certification: no single route matrix command for the requested launch-critical paths
- rollback trigger evidence: no standard deployment-unhealthy artifact

After:

- runtime config validation gate: 9 config checks
- build artifact validation gate: 5 artifact checks
- core route registration gate: 10 routes
- retired string scan: 3 default failure signatures
- production smoke gate: 10 live routes
- certification report: pass/fail with promotion and rollback status
- rollback artifact: `deployment-unhealthy.json`

## Recommended CI Wiring

Pre-promotion:

```bash
npm run build:production
npm run deploy:validate:runtime-config
npm run deploy:validate:build-artifacts
```

Post-deploy, before traffic promotion:

```bash
BASE_URL="$DEPLOYMENT_URL" npm run deploy:smoke
```

Certification:

```bash
BASE_URL="$DEPLOYMENT_URL" npm run deploy:certify
```

If certification exits nonzero:

1. mark deployment unhealthy
2. block promotion
3. run rollback workflow
4. attach `reports/deployment-reliability/*` as deployment evidence
