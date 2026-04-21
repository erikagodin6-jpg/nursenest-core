# Deterministic Docker deploy (DigitalOcean App Platform)

This complements `.do/app-nursenest-core-next.yaml` (Heroku Node buildpack path). The **Dockerfile lives at the repository root** so the build context includes `nursenest-core/`, `shared/`, and `client/` (TypeScript path aliases).

## Primary path today

- **Active:** `environment_slug: node-js`, `source_dir: nursenest-core`, `build_command` + `heroku-postbuild` orchestration (see comments in the app spec).
- **Dockerfile:** opt-in until ops flips the spec (see “Switching to Docker” below).

## Buildpack path (before) — mental model

1. DO runs Heroku Node buildpack install (`npm ci` / cache) under `source_dir: nursenest-core`.
2. `heroku-postbuild` runs (see `package.json`): bootstrap probe + `NN_POSTBUILD_NEXT_BUILD=1 npm run build` → one `next` compile via `build:compile` when DO skip logic applies.
3. App Platform `build_command`: `npm run build:deploy` (standalone verify + static sync + prune), not a second full compile unless forced.
4. `run_command`: `npm run start` → `start-standalone.mjs`.

## Docker path (after) — mental model

1. **Context:** repo root (`.`), not only `nursenest-core/`.
2. **Stages:** `deps` (`npm ci` in `nursenest-core`) → `builder` (copy app sources, dummy `DATABASE_URL` for `prisma generate`, `verify:bootstrap-probe-pathname`, **`build:compile` once**, `build:deploy`) → `runner` (copy built tree + `npm run start`).
3. **No Heroku buildpack:** Node version comes from the image (`ARG NODE_VERSION`, default `22.22.2` aligned with production logs / `engines`).
4. **Low-memory flags:** set in Dockerfile for the compile stage (`NN_FORCE_SINGLE_BUILD_WORKER`, `NN_APP_PLATFORM_BUILD`, single webpack parallelism, heap cap). Keep parity with YAML build env when switching.

## Switching App Platform to Docker

1. In the DO spec (or UI), set **`source_dir` to `/` (repo root)** so `../shared` and `../client` exist for Docker context.
2. Set **`dockerfile_path: Dockerfile`** (repo-root path relative to context).
3. **Remove** `environment_slug: node-js` for that component (image supplies Node).
4. Set **`build_command` empty** or omit — the image build is the compile. Do **not** run `npm run build` again on the platform unless you intend a second compile.
5. Keep **`run_command: npm run start`** and **`http_port: 8080`** aligned with the Dockerfile `CMD` / `PORT`.
6. Re-apply secrets (`DATABASE_URL`, auth, etc.) as **RUN_TIME** (and BUILD_TIME only if a future image step needs them).

## Local image build

From **repository root**:

```bash
docker build -f Dockerfile -t nursenest-core-next:local .
```

## Release checklist (post-promote)

Run from **`nursenest-core/`** with `BASE_URL` pointing at the deployment:

```bash
export BASE_URL=https://www.example.com
npm run qa:deploy:deterministic-gate:remote
```

Manual / CI proof lines for **one real compile** (buildpack or Docker):

- Logs should show **one** `next build` / production compile sequence (see `[build-diagnostic]` / `[buildpack-build]` lines in scripts).
- Avoid two full “Creating an optimized production build” passes unless `NN_FORCE_NEXT_COMPILE` / `build:deploy:full` was intentional.

Optional after `docker build`:

```bash
docker run --rm -e PORT=8080 nursenest-core-next:local node -e "const fs=require('fs');const p='.next/standalone';if(!fs.existsSync(p))process.exit(1);console.log('standalone ok');"
```

## Rollback checklist

1. **App Platform:** Deployments → select last **successful** deployment → **Redeploy** (same git SHA and env as that build).
2. If Docker was enabled and broken: revert spec to **`environment_slug: node-js`**, **`source_dir: nursenest-core`**, remove **`dockerfile_path`**, restore documented **`build_command`** / **`run_command`** from git history or `.do/app-nursenest-core-next.yaml` on `main`.
3. Confirm **`NN_FORCE_SINGLE_BUILD_WORKER`** (or `DIGITALOCEAN_APP_ID` present) on build env so worker tuning cannot silently regress.
4. Re-run **`npm run qa:deploy:deterministic-gate:remote`** against the rolled-back URL.

## Env vars for deterministic Docker builds (reference)

| Variable | Role |
|----------|------|
| `NODE_VERSION` (Docker `ARG`) | Pin Node base image |
| `DATABASE_URL` (build) | Dummy URL in Dockerfile for `prisma generate` only |
| `NN_FORCE_SINGLE_BUILD_WORKER` / `NN_APP_PLATFORM_BUILD` | Low-memory / DO-aware compile |
| `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` | Heap for `build:compile` (Docker `ARG`) |
| Runtime secrets | Same as buildpack deploy (`DATABASE_URL`, NextAuth, etc.) |
