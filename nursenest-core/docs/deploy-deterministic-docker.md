# Deterministic Docker deploy (DigitalOcean App Platform)

This complements `.do/app-nursenest-core-next.yaml` (Heroku Node buildpack path). The **Dockerfile lives at the repository root** so the build context includes `nursenest-core/`, `shared/`, and `client/` (TypeScript path aliases).

## Primary path today

- **Active:** `.do/app-nursenest-core-next.yaml` uses **`dockerfile_path: Dockerfile`**, **`source_dir: .`** (repo root), no `environment_slug` / no App Platform `build_command` — compile + prune run **inside the image** (same `package.json` scripts as before).
- **Rollback:** restore `environment_slug: node-js`, `source_dir: nursenest-core`, and the documented `build_command` from git history (see “Rollback checklist” below).

## Buildpack path (before) — mental model

1. DO runs Heroku Node buildpack install (`npm ci` / cache) under `source_dir: nursenest-core`.
2. `heroku-postbuild` runs (see `package.json`): bootstrap probe + `NN_POSTBUILD_NEXT_BUILD=1 npm run build` → one `next` compile via `build:compile` when DO skip logic applies.
3. App Platform `build_command`: `npm run build:deploy` (standalone verify + static sync + prune), not a second full compile unless forced.
4. `run_command`: `npm run start` → `start-standalone.mjs`.

## Docker path (after) — mental model

1. **Context:** repo root (`.`), not only `nursenest-core/`.
2. **Stages:** `builder` (`npm ci` in `nursenest-core`, copy `shared/` + `client/` + app, **ephemeral** `DATABASE_URL=…` on the **single** `RUN` that runs only `npm run db:generate`, then `heroku-postbuild` / `build:deploy` / prune) → `runner` (copy built tree + `npm run start`). A copy of the repo-root `Dockerfile` is placed at `/app/Dockerfile` so `verify-dockerfile-database-url.mjs` can assert no `ARG DATABASE_URL` / `ENV DATABASE_URL` / banned placeholder during `heroku-postbuild`.
3. **No Heroku buildpack:** Node version comes from the base image (`node:22.22.2-alpine`, aligned with `engines` / App Platform `NODE_VERSION` env).
4. **Low-memory flags:** set in Dockerfile for the compile stage (`NN_FORCE_SINGLE_BUILD_WORKER`, `NN_APP_PLATFORM_BUILD`, single webpack parallelism, heap cap). Keep parity with YAML build env when switching.

## Switching App Platform to Docker

1. In the DO spec (or UI), set **`source_dir` to `/` (repo root)** so `../shared` and `../client` exist for Docker context.
2. Set **`dockerfile_path: Dockerfile`** (repo-root path relative to context).
3. **Remove** `environment_slug: node-js` for that component (image supplies Node).
4. Set **`build_command` empty** or omit — the image build is the compile. Do **not** run `npm run build` again on the platform unless you intend a second compile.
5. Keep **`run_command: npm run start`** and **`http_port: 8080`** aligned with the Dockerfile `CMD` / `PORT`.
6. Re-apply secrets (`DATABASE_URL`, auth, etc.) as **RUN_TIME only** for DB connection strings. **Do not** add `DATABASE_URL`, `DIRECT_URL`, or `DATABASE_DIRECT_URL` to App Platform **build-time** env: Docker passes them into `RUN` layers and they can override runtime secrets (see root `Dockerfile` — no image-wide `ARG`/`ENV` for `DATABASE_URL`; Prisma `generate` uses an ephemeral URL on the `RUN` line only).

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
| `DATABASE_URL` | **Runtime:** managed Postgres URI (App Platform secret, `RUN_TIME` only). **Not** a platform build env — never bake into the image. **Build:** the Dockerfile sets a **one-line** ephemeral URL only for `npm run db:generate` inside that `RUN` (not `ENV`). |
| `NN_FORCE_SINGLE_BUILD_WORKER` / `NN_APP_PLATFORM_BUILD` | Low-memory / DO-aware compile |
| `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` | Heap for `build:compile` (Docker `ARG`) |
| Runtime secrets | Same as buildpack deploy (`DATABASE_URL`, NextAuth, etc.) |

If App Platform logs show **“configuring build-time app environment variables”** and the list includes **`DATABASE_URL`**, remove it from the component’s build env in the DO UI (or narrow scope in spec) so only **run-time** injection applies.
