# DigitalOcean runtime env file fallback

## Goal

Keep the current DigitalOcean App Platform app and add a fallback-only runtime secret source for the first Node process when App Platform runtime env injection is missing or delayed.

This fallback does not replace DigitalOcean runtime env support:

- `process.env` still wins over file-loaded values.
- Runtime validation still runs and still fails closed.
- Secret values are never printed in logs.
- Only an explicit allowlist of runtime keys can be loaded from disk.

## What changed

- `scripts/start-standalone.mjs`
  - Loads the runtime env file fallback after normal `.env*` hydration and before runtime validation.
- `scripts/runtime-env-guard-bootstrap.mjs`
  - Loads the same fallback when the bootstrap guard is run directly.
- `scripts/lib/runtime-env-file-fallback.mjs`
  - Parses `KEY=value` files with quoted values and comments.
  - Ignores disallowed keys.
  - Throws on malformed files without echoing secret values.
- `scripts/prepare-runtime-env-file.mjs`
  - Validates file permissions and required key presence before restart or redeploy.

## Runtime env file path

Default path:

```bash
/app/nursenest-core/.runtime/env.production
```

Optional override:

```bash
NN_RUNTIME_ENV_FILE=/app/nursenest-core/.runtime/env.production
```

## Manual server setup

Create the mounted runtime env file on the server or in the running image filesystem:

```bash
mkdir -p /app/nursenest-core/.runtime
cat > /app/nursenest-core/.runtime/env.production <<'EOF'
DATABASE_URL=...
AUTH_SECRET=...
NEXTAUTH_URL=https://www.nursenest.ca
AUTH_URL=https://www.nursenest.ca
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
EOF
chmod 600 /app/nursenest-core/.runtime/env.production
```

Then validate the file from the app root:

```bash
cd /app/nursenest-core
npm run prepare:runtime-env-file
```

Then redeploy or restart the existing app.

## File format rules

Supported:

- `KEY=value`
- single-quoted values
- double-quoted values
- comment lines starting with `#`
- inline comments after unquoted values

Loaded keys are restricted to:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `AUTH_URL`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe price env keys from `npm run list:stripe-runtime-env-keys`

Everything else is ignored by the runtime fallback and rejected by `npm run prepare:runtime-env-file`.

## Boot log expectations

When the fallback file is present and used, earliest startup logs should include:

```text
runtime_env_file_loaded:true
loaded_keys:["DATABASE_URL","AUTH_SECRET",...]
```

After bootstrap hydration, the existing presence-only runtime snapshot should still show:

```text
DATABASE_URL_present:true
AUTH_SECRET_present:true
STRIPE_SECRET_KEY_present:true
```

No log line should contain the actual values for `DATABASE_URL`, auth secrets, Stripe secrets, or webhook secrets.

## Verification

From the app root:

```bash
cd /app/nursenest-core
npm run prepare:runtime-env-file
BASE_URL=https://www.nursenest.ca npm run smoke:runtime-env
```

Expected result:

1. Bootstrap logs show `runtime_env_file_loaded:true` when the file is used.
2. Bootstrap logs show `DATABASE_URL_present:true`, `AUTH_SECRET_present:true`, and `STRIPE_SECRET_KEY_present:true`.
3. `npm run smoke:runtime-env` passes.

## Failure behavior

- If the file is absent, startup falls back to normal DigitalOcean runtime env behavior.
- If the file is malformed, startup fails closed before runtime validation completes.
- If required secrets are still missing after file loading, existing runtime validation still fails closed.
- If a key already exists in `process.env`, the fallback file does not override it.
