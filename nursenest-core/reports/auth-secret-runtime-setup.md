# Auth session signing secret (AUTH_SECRET / NEXTAUTH_SECRET)

## Canonical name

- Prefer **`AUTH_SECRET`** (Auth.js v5 canonical).
- **`NEXTAUTH_SECRET`** remains supported for backward compatibility with existing deployments and tooling.

The app resolves signing material with **`AUTH_SECRET` first**, then **`NEXTAUTH_SECRET`**. Set **only one** in new environments unless you are intentionally migrating; if both are set to **different** values, runtime uses `AUTH_SECRET`.

## Production (DigitalOcean App Platform)

1. Open your App → **Settings** → **App-Level Environment Variables** (or component env).
2. Add **`AUTH_SECRET`** (recommended) **or** **`NEXTAUTH_SECRET`**.
3. Generate a strong value (32+ random bytes), for example:

   ```bash
   openssl rand -base64 32
   ```

4. **Do not** commit secrets to git. **Do not** paste real values into logs or tickets.

5. Redeploy so all instances pick up the variable.

Also set a public auth URL (see existing env docs for **`NEXTAUTH_URL`** / **`AUTH_URL`**).

## Local development

Create **`nursenest-core/.env.local`** (gitignored) with placeholders replaced by your own random string:

```bash
# Example only — replace with a generated secret, never reuse production values.
AUTH_SECRET="local-dev-placeholder-use-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

If you still use legacy naming:

```bash
NEXTAUTH_SECRET="local-dev-placeholder-use-openssl-rand-base64-32"
```

## Build vs runtime

- **`npm run build`** may run with `NODE_ENV=production` without loading `.env.local`. A **missing** secret during build logs **`missing_auth_secret_build`** at most **once per process** (non-critical). It does **not** fail the build.
- **Production runtime** (`next start` / App Platform) without any secret logs **`missing_auth_secret`** once per process as a **critical** diagnostic (and must be fixed for sessions/JWT).

## Diagnostics

From repo root:

```bash
cd nursenest-core && npm run env:check
```

This prints **`AUTH_SECRET`** / **`NEXTAUTH_SECRET`** as set/missing (never values).
