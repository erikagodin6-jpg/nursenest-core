# GHCR runtime DATABASE_URL injection

## Root cause

Production deploys use a **pre-built GHCR image** (`.github/workflows/build-and-push-ghcr.yml`). DigitalOcean App Platform **does not run a build** for that component — it only starts the container with `run_command: node scripts/start-standalone.mjs`.

Secrets in the app spec were scoped **`RUN_AND_BUILD_TIME`**. On image-only services, platform build-time injection does not run, so **`DATABASE_URL` never reached the first Node process** — `start-standalone.mjs` failed with a missing `DATABASE_URL` error and DO auto-rolled back.

This is independent of educational-graph work and unrelated to Prisma schema changes.

## Fix

1. **`.do/app-nursenest-core-next.yaml`** — all `type: SECRET` entries use **`scope: RUN_TIME`** (including `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`).
2. **Root `Dockerfile`** — removed `ARG DATABASE_URL` / `ARG AUTH_SECRET` and build-stage `${DATABASE_URL}` forwarding; Prisma `generate` keeps a **one-line ephemeral** stub URL only on `npm run db:generate`.
3. **CI guards** — `scripts/audit-ghcr-runtime-secret-scopes.mjs`, `do-spec-guard.mjs` GHCR checks, `verify-dockerfile-database-url.mjs` in verify-build + GHCR workflow.

## Runtime injection path

```
GitHub Actions: docker build (no DATABASE_URL build-arg)
  → push ghcr.io/.../nursenest:sha-<commit>
  → doctl apps update (spec tag = sha-<commit>)
DigitalOcean: pull image → start container
  → inject RUN_TIME secrets into process env
  → CMD node scripts/start-standalone.mjs
  → validateRuntimeEnvOrThrow() / assertRuntimeDatabaseEnvContractMjs()
  → spawn Next standalone child with buildForwardedRuntimeEnv(process.env)
```

## Secret configuration (no rename)

Keep existing secret **values** in the DO dashboard. Only **scope** changes in the canonical spec. After merge, run:

```bash
npm run do:spec:validate
node scripts/audit-ghcr-runtime-secret-scopes.mjs
```

## Verification

```bash
node nursenest-core/scripts/verify-dockerfile-database-url.mjs
node scripts/audit-ghcr-runtime-secret-scopes.mjs .do/app-nursenest-core-next.yaml
node scripts/do-spec-guard.mjs .do/app-nursenest-core-next.yaml

docker build -f Dockerfile -t nursenest-core-next:local .
docker inspect nursenest-core-next:local --format '{{json .Config.Env}}' | tr ',' '\n' | grep -i database || echo 'OK: no DATABASE_URL in image Env'

export DATABASE_URL='postgresql://...' AUTH_SECRET='...'
docker compose -f docker-compose.ghcr-local.yml up
curl -sf http://127.0.0.1:8080/healthz
```

## Rollback

Redeploy the last successful deployment from the DigitalOcean console. Secret values in the dashboard are preserved when keys remain in the spec.

## Security

- Production `DATABASE_URL` is not passed as a Docker build-arg or image `ENV`.
- GHA `build-and-push` must not pass `DATABASE_URL` in `build-args`.
- `/api/internal/runtime-env-health` exposes presence booleans only.
