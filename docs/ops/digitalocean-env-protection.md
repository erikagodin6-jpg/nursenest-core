# DigitalOcean Environment Variable Protection

## Problem

When `doctl apps update APP_ID --spec file.yaml` runs, DigitalOcean removes any secret key that is
**absent from the spec file**, even if it was set via the console. A partial, generated, or
out-of-date spec silently deletes secrets. Lost secrets are hard to recover and can crash the
production app.

This document describes the fail-safe system that prevents accidental secret deletion.

---

## How It Works

### 1. Canonical spec is the source of truth

`.do/app-nursenest-core-next.yaml` is the single spec file that gets deployed. It includes
placeholder entries for every required secret (`type: SECRET`, no value). DigitalOcean preserves
the secret's live value when the key entry is present but has no value.

Required keys in the canonical spec:
- `DATABASE_URL` — RUN_AND_BUILD_TIME, SECRET
- `AUTH_SECRET` — RUN_AND_BUILD_TIME, SECRET
- `NEXTAUTH_URL` — RUN_TIME
- `AUTH_URL` — RUN_TIME
- `STRIPE_SECRET_KEY` — RUN_TIME, SECRET
- `STRIPE_WEBHOOK_SECRET` — RUN_TIME, SECRET
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — RUN_AND_BUILD_TIME, SECRET
- At least one of: `AI_INTEGRATIONS_OPENAI_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`

### 2. Guard script blocks unsafe deploys

`scripts/do-spec-guard.mjs` validates that a spec file contains all required env key names. It is
run automatically in CI and by the safe deploy wrapper. It exits non-zero if any required key is
missing.

### 3. CI gate

`.github/workflows/verify-build.yml` runs `do-spec-guard.mjs` on every push/PR. A PR that removes
a required env key from the canonical spec will fail CI before merge.

### 4. Backup workflow

`npm run do:spec:backup` fetches the live spec from DigitalOcean (via `doctl`), redacts secret
values, and saves it to `ops/digitalocean/backups/`. The backup is used by the diff and validate
scripts to detect removed keys.

### 5. Safe deploy

`npm run do:deploy:safe` validates the canonical spec and diffs it against the latest backup before
printing the doctl command. It will refuse to proceed if any required key would be deleted.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run do:spec:validate` | Validate the canonical spec against required env contract |
| `npm run do:spec:backup` | Export and redact the live DO spec to `ops/digitalocean/backups/` |
| `npm run do:spec:diff` | Diff canonical spec vs latest backup (show added/removed/changed keys) |
| `npm run do:deploy:safe` | Full pre-deploy validation then print (or run) the doctl update command |
| `npm run test:do-spec-validator` | Run spec validator unit tests |

Required env vars for backup/deploy commands:
- `DO_APP_ID` — your DigitalOcean app ID (find it: `doctl apps list --format ID,Spec.Name`)

---

## Forbidden Commands

These patterns are dangerous and **must not be used** without explicit review:

```sh
# FORBIDDEN: Deploys without validation — will delete any key missing from the spec
doctl apps update APP_ID --spec some-spec.yaml

# FORBIDDEN: Generated or partial specs are never complete
doctl apps update APP_ID --spec generated-spec.yaml

# FORBIDDEN: Rewrites the spec from scratch without checking existing keys
doctl apps spec set APP_ID --spec partial.yaml
```

Use `npm run do:deploy:safe` instead. It validates, diffs, and prints the command for confirmation.

---

## Preflight Checklist Before Any Deploy

1. `npm run do:spec:validate` — canonical spec must pass
2. `npm run do:spec:backup` — fetch and archive the live spec
3. `npm run do:spec:diff` — confirm no required key is removed
4. `npm run do:deploy:safe` — validated deploy

---

## Runtime Health Endpoint

`GET /api/internal/runtime-env-health`

Returns only presence booleans — never actual values. Requires the
`x-nursenest-env-health-secret` header matching `NN_RUNTIME_ENV_HEALTH_SECRET` env var.

Example response:
```json
{
  "ok": true,
  "checkedAt": "2026-05-12T15:00:00.000Z",
  "DATABASE_URL_present": true,
  "AUTH_SECRET_present": true,
  "NEXTAUTH_URL_present": true,
  "AUTH_URL_present": true,
  "STRIPE_SECRET_KEY_present": true,
  "STRIPE_WEBHOOK_SECRET_present": true,
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_present": true,
  "ai_provider_key": "openai",
  "NODE_ENV": "production",
  "deploymentId": null
}
```

Returns 404 if the secret header is missing or wrong (avoids probing signal).

---

## How to Recover If Env Vars Disappear

1. Check the runtime health endpoint to confirm which keys are missing.
2. Open the DigitalOcean console → App → Settings → Environment Variables.
3. Re-add the missing keys manually. Values must come from your secure password manager.
4. Trigger a new deployment (no spec change needed — env-only updates take effect immediately).
5. Run `npm run do:spec:backup` to update the backup with the restored state.
6. Confirm `npm run do:spec:validate` passes (canonical spec already has the placeholders).

---

## How to Rotate Secrets Safely

1. Generate the new secret value.
2. In the DigitalOcean console, update the secret key value (does not require a spec push).
3. Trigger a new deployment from the console to pick up the new value.
4. Verify with the runtime health endpoint that the key is still present after deploy.
5. `npm run do:spec:backup` — refresh the backup.

---

## Standalone Runtime Hardening

`nursenest-core/scripts/start-standalone.mjs` already fails before spawning the child process if:
- `DATABASE_URL` is absent in `NODE_ENV=production` (throws via `assertRuntimeDatabaseEnvContractMjs`)
- `AUTH_SECRET` is absent (throws via `validateRuntimeEnvOrThrow` in strict mode)

The child process receives the full `process.env` via `buildForwardedRuntimeEnv(process.env, overrides)`.
This function is a safe spread — it never filters out secrets.

Diagnostic logs emit presence booleans only (e.g., `DATABASE_URL_present: true`). Values are never
logged.

---

## Architecture Notes

- `DATABASE_URL` and `AUTH_SECRET` are scoped `RUN_AND_BUILD_TIME` (not `RUN_TIME`) as a workaround
  for a DigitalOcean App Platform bug where runtime-only secrets occasionally do not reach the first
  Node process after certain spec-update deploys.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is also `RUN_AND_BUILD_TIME` because it is baked into the
  client bundle during `next build`.
- All other secrets are `RUN_TIME` only.
