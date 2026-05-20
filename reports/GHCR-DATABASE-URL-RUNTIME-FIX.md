# GHCR Runtime DATABASE_URL Injection — Fix Report

**Date:** 2026-05-20

## 1. Root cause summary

| Layer | Issue |
|-------|--------|
| **Deploy model** | Production uses **GHCR pre-built images** — DigitalOcean does not run `next build` on the platform. |
| **App spec** | `DATABASE_URL` (and other secrets) used `scope: RUN_AND_BUILD_TIME`. |
| **Platform behavior** | Build-scoped secrets are not injected when there is **no build phase** — only the container starts. |
| **Runtime** | `start-standalone.mjs` validates `DATABASE_URL` in the parent Node process and **exits** if missing in production. |
| **Outcome** | Deploy failed → DO **auto-rollback** to previous image (`latest` tag), not `sha-810ff788…`. |

Not caused by: educational graph Phase 2, Prisma schema changes, or missing `DIGITALOCEAN_ACCESS_TOKEN` (image push succeeded).

## 2. Files changed

| File | Change |
|------|--------|
| `Dockerfile` | Removed `ARG DATABASE_URL` / `AUTH_SECRET`; compile `RUN` no longer forwards `${DATABASE_URL}` |
| `.do/app-nursenest-core-next.yaml` | All `type: SECRET` → `scope: RUN_TIME` |
| `scripts/do-spec-guard.mjs` | GHCR secret scope enforcement |
| `scripts/audit-ghcr-runtime-secret-scopes.mjs` | New audit |
| `.github/workflows/build-and-push-ghcr.yml` | Pre-build Dockerfile + scope audits |
| `.github/workflows/verify-build.yml` | Same guards on every PR |
| `docker-compose.ghcr-local.yml` | Local runtime injection smoke |
| `docs/ops/ghcr-runtime-database-url.md` | Ops runbook |
| `docs/ops/digitalocean-env-protection.md` | Updated architecture notes |
| `nursenest-core/docs/deploy-deterministic-docker.md` | RUN_TIME guidance |
| `package.json` (root) | `audit:ghcr-runtime-secrets` script |

## 3. Before / after deployment flow

**Before:** GHA builds image (no DB secret) → DO pulls image → expects `RUN_AND_BUILD_TIME` secret at “build” → **no injection** → bootstrap throws → rollback.

**After:** GHA builds image (stub URL only on `db:generate` line) → DO pulls image → **`RUN_TIME` secrets** injected at container start → bootstrap validates → child receives `buildForwardedRuntimeEnv(process.env)`.

## 4. Security implications

- Production `DATABASE_URL` is not in image layers, `docker inspect` Env, or GHA `build-args`.
- Build logs must not include real connection strings (GHA workflow does not pass `DATABASE_URL`).
- Runtime health API unchanged (booleans only).

## 5. Rollback considerations

- **Safe:** Redeploy last good deployment in DO console (unchanged).
- **Spec revert:** Reverting scope to `RUN_AND_BUILD_TIME` would **re-break** GHCR runtime injection — only do that if reverting to **buildpack/source** deploy model.
- Secret **values** in DO dashboard are preserved when keys remain in spec.

## 6. Exact runtime injection path

`DO App (RUN_TIME secret vault)` → `container env` → `node scripts/start-standalone.mjs` → `validateRuntimeEnvOrThrow()` → `spawn(standalone, env: buildForwardedRuntimeEnv(process.env))` → Prisma via `DATABASE_URL` in child.

## 7. Secret configuration changes

- **No renames.** Keep `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` values in DO dashboard.
- **Only scope:** `RUN_TIME` in canonical spec (applied on next `doctl apps update` or main push workflow).

## 8. Verification commands

```bash
node nursenest-core/scripts/verify-dockerfile-database-url.mjs
npm run audit:ghcr-runtime-secrets
npm run do:spec:guard

cd nursenest-core
node --import tsx --test src/lib/db/runtime-env-and-prisma-safety.contract.test.mjs
```

Post-deploy:

```bash
curl -sf https://nursenest.ca/healthz
# With NN_RUNTIME_ENV_HEALTH_SECRET configured:
curl -sf -H "x-nursenest-env-health-secret: $SECRET" https://nursenest.ca/api/internal/runtime-env-health
```

## 9. Follow-up recommendations

1. Merge and let `build-and-push-ghcr.yml` deploy with `sha-*` tag; confirm `/readyz` and `DATABASE_URL_present: true` on runtime health.
2. Do **not** pass `DATABASE_URL` to `docker/build-push-action` `build-args` in future workflow edits.
3. If rolling back to Heroku buildpack on DO, re-audit secret scopes for that deploy model separately.
4. Educational graph audits remain independent — run after deploy unrelated.
