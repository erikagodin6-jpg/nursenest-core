# NurseNest: DigitalOcean App Platform → Droplet migration

This document is for operators moving **nursenest-core** (Next.js 16, Prisma, NextAuth) from **App Platform** to a **Droplet** while keeping **managed Postgres** and **Spaces** where practical.

## 1. Production assumptions (audit)

### Build and runtime

| Item | Current behavior | Droplet note |
|------|------------------|--------------|
| **App directory** | Run all npm commands inside `nursenest-core/` (this package), not the monorepo root `rest-express` tree. | Clone full repo; `cd <repo>/nursenest-core`. |
| **Monorepo root** | `next.config.ts` sets `turbopack.root` and `outputFileTracingRoot` to the **parent** of this package (repo root). Required for `@shared/*` imports. | Deploy must include parent `shared/` (and lockfile at repo root if present). |
| **Build** | `npm run build` or `npm run build:deploy:full` (includes `next build`). `TMPDIR` should be writable (`/tmp`). | Export `TMPDIR=/tmp` (or larger disk path) before build. |
| **Start** | `npm run start` → `next start -H 0.0.0.0 -p ${PORT:-3000}` | On Droplet, bind **127.0.0.1:3000** behind Caddy/Nginx; set `PORT=3000`. |
| **Prisma** | `prisma migrate deploy` for prod schema. | Run from app directory after deploy, before or with rolling restart. |
| **Database URL** | `DATABASE_URL` or, in production only, `PROD_DATABASE_URL` if `DATABASE_URL` unset (`env-bootstrap`). | Prefer single `DATABASE_URL` on Droplet to reduce confusion. |

### Health checks (replace App Platform probes)

| Endpoint | Purpose |
|----------|---------|
| `GET /healthz` | **Liveness** — no DB; use for “is Node up?” |
| `GET /api/health` | Liveness + light process info (no DB) |
| `GET /api/health/ready` | **Readiness** — `SELECT 1` with timeout (~3s) |

Point uptime monitors and load balancers at **`/healthz`** for liveness. Use **`/api/health/ready`** only if you want to drain traffic when Postgres fails.

**While still on App Platform:** `.do/app-nursenest-core-next.yaml` uses **`health_check` → `/readyz`** for deployment readiness and **`liveness_health_check` → `/healthz`** for liveness — do not conflate those with droplet-only `curl /healthz` checks alone.

### App Platform–specific behavior to replace

- **Automatic HTTPS** → Caddy or Nginx + Let’s Encrypt on the Droplet.
- **Injected `PORT`** → set `PORT=3000` (or chosen internal port) in PM2/env.
- **Build command in UI** → your `deploy-app.sh` runs `npm ci` + `npm run build:deploy:full` (or on App Platform: buildpack `npm run build` then `npm run build:deploy`).
- **Zero-downtime rolling** (if configured) → PM2 `reload` or brief restart; for minimal complexity accept seconds of blip or use two Droplets + LB later.

### Spaces / CDN

- No change required: app uses `SPACES_*` env and public CDN hostnames (`nursenest-images.tor1.cdn.digitaloceanspaces.com`, etc.).
- Optional: `/api/marketing-assets/*` proxy needs `SPACES_KEY` / `SPACES_SECRET` if enabled.

### Auth / URLs

- **`AUTH_SECRET`** or **`NEXTAUTH_SECRET`** (required in production).
- **`AUTH_URL`** or **`NEXTAUTH_URL`** — public origin users hit (e.g. `https://app.example.com`). Must match browser URL to avoid cookie/redirect issues.
- **`NEXT_PUBLIC_APP_URL`** — used for Stripe return URLs, emails, canonicals; should match public site.
- **`AUTH_TRUST_HOST`** — defaults to `true` via `next.config.ts` env block; keep behind reverse proxy with correct `X-Forwarded-*` headers (Caddy sets these).

### Other common env (non-exhaustive)

- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs as already configured.
- Email: `RESEND_API_KEY`, `PASSWORD_RESET_EMAIL_FROM`, etc.
- Sentry: `SENTRY_*` if used.

---

## 2. Recommended Droplet architecture

- **OS:** Ubuntu 24.04 LTS (or 22.04 LTS).
- **Size (starting point):** **2 vCPU / 2 GB RAM** minimum for comfortable **build-on-Droplet** `next build`; **4 GB** if you want headroom on the same box. **1 GB** Droplets should use the **artifact** path (§6, §8) and Linux-built **`node_modules`** in the tarball.
- **Node:** **20.x LTS** (match `.nvmrc` if present).
- **Process manager:** **PM2** — auto-restart, `pm2 save` + `pm2 startup` for boot.
- **Reverse proxy + TLS:** **Caddy** — simple config, automatic HTTPS.
- **App bind:** `127.0.0.1:3000` — not public; only Caddy listens on 443/80.
- **Firewall (`ufw`):** allow `22`, `80`, `443`; deny others.
- **Postgres:** Stay on **DigitalOcean Managed Database** (recommended). Same for **Spaces**.
- **Layout (example):**

```text
/var/www/nursenest/
  repo/                    # git clone (contains shared/, nursenest-core/)
  env/                     # optional: root-owned .env.production (not in git)
```

App directory: `/var/www/nursenest/repo/nursenest-core`

**Artifact-based layout (optional, second path):** keep timestamped trees and a `current` symlink so you never delete the running release before validating a new one.

```text
/var/www/nursenest/
  releases/
    20250330T120000Z/        # shared/ + nursenest-core/ (one deployment)
      shared/
      nursenest-core/
    20250330T150000Z/
      ...
  current -> releases/20250330T150000Z   # updated by deploy-artifact.sh after health OK
  env/.env.production                    # same secret file as build-on-box; not inside releases
  repo/                                  # optional: git clone if you also use deploy-app.sh
```

- **Logs:** PM2 → `~/.pm2/logs/`; Caddy → `/var/log/caddy/`; optional `logrotate` (see `deploy/droplet/logrotate-nursenest.conf`).

---

## 3. Automation deliverables (in repo)

| File | Role |
|------|------|
| `deploy/droplet/bootstrap-ubuntu.sh` | First-time server packages: Node 20, PM2, Caddy, ufw hints |
| `deploy/droplet/deploy-app.sh` | Build-on-Droplet: install, migrate, build, PM2 reload |
| `deploy/droplet/deploy-artifact.sh` | Artifact path: unpack release, migrate, PM2 reload, update `current` symlink |
| `deploy/droplet/check-boot-persistence.sh` | Verify Caddy + PM2 survive reboot (read-only) |
| `deploy/droplet/ecosystem.config.cjs` | PM2 process definition |
| `deploy/droplet/Caddyfile.example` | TLS + reverse proxy to Next |
| `deploy/droplet/env.production.template` | Env var checklist (copy to server, never commit secrets) |
| `deploy/droplet/validate-droplet.sh` | Curl health + optional ready |
| `deploy/droplet/logrotate-nursenest.conf` | Example log rotation |

---

## 4. Operational protections

- **Crash restart:** PM2 `autorestart: true`, `max_memory_restart` in ecosystem file.
- **Health:** UptimeRobot / DO monitoring → `https://your-domain/healthz`.
- **Logs:** `pm2 logs nursenest-core`; rotate PM2 and Caddy logs.
- **Disk:** `df -h`; build artifacts live under app `/.next` — run `npm run clean:next` only when intentional. Prune old directories under `releases/` only after you confirm rollback no longer needs them.
- **Memory:** `free -h`; if OOM during build, prefer the artifact path or a larger Droplet (see §8).

---

## 5. Supported deployment paths (two options)

| Path | Script | When to use |
|------|--------|-------------|
| **Build on Droplet** | `deploy-app.sh` | 2 GB+ RAM (or comfortable swap), simple ops, you want `git pull` on the server and one command. |
| **CI / artifact** | `deploy-artifact.sh` | **1 GB** instances, CI already builds Linux `node_modules`, you want minimal peak RAM on the server and explicit release directories. |

Both paths require the same **monorepo layout** at runtime: a directory that contains **`shared/`** next to **`nursenest-core/`** (Next resolves `@shared/*` from the parent of the app package). Both use the same **Caddy → 127.0.0.1:3000** binding and the same health endpoints.

---

## 6. CI and artifact-based deployment

### When to prefer this path

- The Droplet has **1 GB RAM** or builds fail with OOM even after `NODE_OPTIONS=--max-old-space-size=...`.
- You already produce **Linux x64** builds in CI (same major **Node** version as the Droplet, ideally 20.x).
- You want **immutable releases**: unpack a new directory, validate, then point PM2 at it; old trees remain for rollback.

### Why it is safer on 1 GB instances

- **`next build`** and full `npm ci` are the highest memory spikes. Moving them to CI removes that spike from the Droplet.
- On the server you run **`prisma generate`**, **`prisma migrate deploy`**, and **`pm2 startOrReload`**, plus an optional **`npm ci --omit=dev`** only if the artifact does not include `node_modules` (still cheaper than `next build`).

### Expected artifact contents

Pack from the **monorepo root** (parent of `nursenest-core/`) after a successful production build inside `nursenest-core/`:

**Required paths inside the `.tar.gz` root:**

- `shared/` — full tree as in the repo (TypeScript sources and package metadata the app depends on).
- `nursenest-core/` including at minimum:
  - `.next/` (output of `npm run build` / `build:deploy:full` on the build host)
  - `package.json`, `package-lock.json`
  - `prisma/` (schema + migrations) for `migrate deploy`
  - `public/`, `next.config.ts` (and other config the runtime needs)
  - `deploy/droplet/ecosystem.config.cjs` (PM2)

**Strongly recommended in the artifact:**

- `nursenest-core/node_modules/` produced on **Linux** with `npm ci` (or `npm ci --omit=dev`) so the Droplet can set **`NURSE_NEST_SKIP_NPM_CI=1`** and avoid install-time RAM and network use.

**Do not** embed secrets in the tarball. Secrets stay in **`/var/www/nursenest/env/.env.production`** (or your chosen path) and are loaded via **`NURSE_NEST_ENV_FILE`**, same idea as build-on-box.

### Target directories on the Droplet

| Purpose | Typical path |
|---------|----------------|
| Unpacked releases | `/var/www/nursenest/releases/<UTC-timestamp>/` |
| Active release pointer | Symlink `/var/www/nursenest/current` → that directory |
| Env file (outside git) | `/var/www/nursenest/env/.env.production` |

Each release directory is a **repo-shaped root**: `.../shared/` and `.../nursenest-core/`.

### How env handling differs from build-on-Droplet

| Topic | Build-on-Droplet (`deploy-app.sh`) | Artifact (`deploy-artifact.sh`) |
|--------|-------------------------------------|-----------------------------------|
| Env file | `NURSE_NEST_ENV_FILE` or `nursenest-core/.env.production` | Same; **artifact must not replace** your server env file |
| `NODE_OPTIONS` for build | Often set high on the Droplet | Set on the **build host**; Droplet only needs enough RAM for `next start` + Prisma |
| `DATABASE_URL` | Loaded before migrate/build | Loaded before `prisma migrate deploy` and PM2 |
| Symlink `.env` into app dir | Optional | Optional; exporting `NURSE_NEST_ENV_FILE` is enough |

### Build host example (no secrets in artifact)

```bash
# On CI or a build machine (Linux, Node 20.x), monorepo root:
cd nursenest-core
npm ci
npm run build:deploy:full
cd ..
tar -czf nursenest-release.tgz shared nursenest-core
```

Transfer `nursenest-release.tgz` to the Droplet (e.g. `scp`, Spaces private object, or CI SSH publish).

### Droplet example

```bash
export NURSE_NEST_ARTIFACT=/var/www/nursenest/incoming/nursenest-release.tgz
export NURSE_NEST_ENV_FILE=/var/www/nursenest/env/.env.production
export NURSE_NEST_SKIP_NPM_CI=1   # if node_modules is inside the tarball
bash /var/www/nursenest/bin/deploy-artifact.sh
```

**First deploy:** there is no `current` symlink yet, so keep a copy of **`deploy-artifact.sh`** (and optionally **`check-boot-persistence.sh`**) outside releases, e.g. **`/var/www/nursenest/bin/`**, updated when you change ops scripts in the repo.

### What `deploy-artifact.sh` does (operator summary)

1. Extracts to a **staging** directory under `releases/`, validates `shared/` + `nursenest-core/.next/BUILD_ID`.
2. Renames staging to a **timestamped release** (does not delete previous releases).
3. Loads env, runs **`npx prisma generate`**, **`npx prisma migrate deploy`**, optional **`npm ci --omit=dev`** if `node_modules` is missing.
4. **`pm2 startOrReload`** using **`nursenest-core/deploy/droplet/ecosystem.config.cjs`** inside the **new** release.
5. Waits for **`http://127.0.0.1:3000/healthz`**; on failure attempts to reload PM2 from the **previous** `current` target if one existed.
6. Updates **`current`** symlink and **`pm2 save`**.

---

## 7. Preflight checklist (before deploy or DNS cutover)

Work through this on the Droplet (and in DO cloud UI) before trusting production traffic.

### DNS records

- [ ] **Staging** `A`/`AAAA` (or `CNAME`) points to the Droplet public IP for initial testing.
- [ ] **TTL** lowered before production cutover if you need fast rollback.
- [ ] **Production** record documented; no accidental duplicate `A` records to two targets.

### Firewall

- [ ] `ufw status` shows **22**, **80**, **443** allowed; default deny inbound.
- [ ] Nothing else exposed (app binds **127.0.0.1:3000** only).

### Caddy install and config path

- [ ] `caddy version` works; config installed per your policy (often **`/etc/caddy/Caddyfile`** or included snippets from `deploy/droplet/Caddyfile.example`).
- [ ] Site block uses your real domain and email for ACME.
- [ ] `sudo caddy validate --config /etc/caddy/Caddyfile` succeeds.

### TLS readiness

- [ ] Ports **80** and **443** reachable from the internet (ACME HTTP-01 or TLS-ALPN as Caddy uses).
- [ ] First successful issuance: `journalctl -u caddy -e` shows no permanent ACME errors.

### Node version

- [ ] `node -v` is **v20.x** (match `bootstrap-ubuntu.sh` and `.nvmrc` if present).

### PM2 installed and persistent on reboot

- [ ] `pm2 ping` works.
- [ ] `pm2 startup` has been applied once (as root) and **`pm2 save`** run after a good deploy.
- [ ] Run **`bash deploy/droplet/check-boot-persistence.sh`** after configuring startup.

### Env file presence and permissions

- [ ] Production env file exists (e.g. **`/var/www/nursenest/env/.env.production`**), **root- or deploy-user-readable only** (`chmod 600` or `640` with correct group).
- [ ] No secrets committed under `repo/` or `releases/`.

### `DATABASE_URL` reachability

- [ ] From the Droplet: `nc -zv <db-host> 25060` (or your port) succeeds, or equivalent test.
- [ ] **`prisma migrate deploy`** has been run successfully at least once for this environment.

### DigitalOcean Managed Postgres trusted sources

- [ ] Droplet **public IP** (or VPC path) is in the database cluster **trusted sources**.

### Spaces / CDN reachability

- [ ] If the app uses Spaces: egress allowed; optional `curl -I` against your CDN hostname returns **200** for a known object.
- [ ] Env vars **`SPACES_*`** match the bucket/region you use.

### Stripe webhook endpoint and callback URLs

- [ ] Stripe Dashboard webhook URL matches the **public** URL you will serve (staging first, then production).
- [ ] Return URLs and price IDs align with **`NEXT_PUBLIC_APP_URL`** and env copied from App Platform.

### `AUTH_URL` / `NEXT_PUBLIC_APP_URL` correctness

- [ ] **`AUTH_URL`** (or **`NEXTAUTH_URL`**) equals the browser origin (scheme + host, no trailing path noise).
- [ ] **`NEXT_PUBLIC_APP_URL`** matches the public site used in emails and Stripe redirects.

### Health endpoints before public cutover

- [ ] **`curl -fsS http://127.0.0.1:3000/healthz`** from the Droplet returns **200**.
- [ ] **`curl -fsS http://127.0.0.1:3000/api/health/ready`** returns **200** when the DB is healthy (expect **503** only if you intentionally test without DB).
- [ ] Then run **`bash deploy/droplet/validate-droplet.sh https://your.staging.domain`**.

---

## 8. Low-memory Droplets (1 GB vs 2 GB)

### Realistic guidance

- **1 GB:** Treat as **edge-only** for this stack. **Runtime** can work with **one** Next.js process and Prisma if the app is not oversized; **building** on the same box is often painful or impossible without swap.
- **2 GB:** **Build-on-Droplet** is usually viable with **`NODE_OPTIONS=--max-old-space-size`** (see `deploy-app.sh`) and a clean disk; still watch OOM during `npm ci` + build overlap.

### Swap: recommendation and caveats

- **1 GB without artifact deploy:** adding **1–2 GB swap** (DigitalOcean doc: swap file on SSD) can prevent sudden OOM kills during install/build, but swap makes operations **slow** and does not replace RAM for sustained Node heap use.
- **Risk:** heavy swap thrash during `next build` can look like a hang; SSD wear is a minor concern compared to reliability.
- **Production stance:** prefer **artifact deploy** or **2 GB+** over relying on swap for routine deploys.

### Which path for which size

| RAM | Recommended path |
|-----|------------------|
| 1 GB | **Artifact** + vendored **`node_modules`** in tarball; **`NURSE_NEST_SKIP_NPM_CI=1`** |
| 2 GB | **Build-on-Droplet** acceptable; **artifact** still valid for faster rollouts |
| 4 GB | Either path; build-on-box is comfortable |

### Build vs runtime stress (Next.js + Prisma)

- **Build:** `next build` (Turbopack/Next compilation), file tracing, and **`npm ci`** peak memory together; this is the main OOM risk on small Droplets.
- **Runtime:** `next start`, connection pool, and traffic; **`max_memory_restart`** in `ecosystem.config.cjs` protects the host from a runaway process but will restart the app if the heap grows too large.

---

## 9. Rollback and cutover strategy

### Cutover (unchanged high level)

1. **Keep App Platform running** until the Droplet is validated.
2. **DNS:** Staging hostname → Droplet IP; complete §7 and browser tests.
3. **Cutover:** Lower TTL; point production DNS at the Droplet.
4. **Schema:** No downgrade assumed; **only migrate forward** with Prisma.

### Rollback: DNS (any path)

If the Droplet misbehaves after cutover, **point DNS back** to App Platform (or previous origin). Database and Stripe webhooks may still point at the old URL until you revert those too; plan webhook URLs per environment.

### Rollback: build-on-Droplet (`deploy-app.sh`)

Assumes app lives under **`$NURSE_NEST_REPO_ROOT/nursenest-core`** (e.g. git at `/var/www/nursenest/repo`).

```bash
cd /var/www/nursenest/repo
git fetch origin
git checkout <previous-good-commit>
export NURSE_NEST_REPO_ROOT=/var/www/nursenest/repo
export NURSE_NEST_ENV_FILE=/var/www/nursenest/env/.env.production
bash nursenest-core/deploy/droplet/deploy-app.sh
```

If you only need to restart without rebuilding:

```bash
export NURSE_NEST_ENV_FILE=/var/www/nursenest/env/.env.production
set -a && . "${NURSE_NEST_ENV_FILE}" && set +a
pm2 startOrReload /var/www/nursenest/repo/nursenest-core/deploy/droplet/ecosystem.config.cjs --update-env
pm2 save
```

### Rollback: artifact / release path (`deploy-artifact.sh`)

List releases:

```bash
ls -lt /var/www/nursenest/releases
readlink -f /var/www/nursenest/current
```

Point **`current`** at the previous directory and reload PM2 (use the **ecosystem file inside that release**):

```bash
export PREV=/var/www/nursenest/releases/20250330T120000Z   # example: known-good
ln -sfn "${PREV}" /var/www/nursenest/current
export NURSE_NEST_ENV_FILE=/var/www/nursenest/env/.env.production
set -a && . "${NURSE_NEST_ENV_FILE}" && set +a
pm2 startOrReload "${PREV}/nursenest-core/deploy/droplet/ecosystem.config.cjs" --update-env
pm2 save
```

**Database:** if a **bad** release ran **`prisma migrate deploy`** with new migrations, rolling **code** back can leave the DB **ahead** of old code. In that case restore forward by redeploying a matching build or follow your incident process; this is not unique to Droplets.

### Restore previous PM2 target (summary)

- **Git path:** `pm2 startOrReload <repo>/nursenest-core/deploy/droplet/ecosystem.config.cjs --update-env`.
- **Release path:** `pm2 startOrReload <release>/nursenest-core/deploy/droplet/ecosystem.config.cjs --update-env` after fixing **`current`**.

### Restore previous Caddy config (if needed)

```bash
sudo cp /etc/caddy/Caddyfile.backup /etc/caddy/Caddyfile   # if you keep backups
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### What to verify after any rollback

```bash
curl -fsS http://127.0.0.1:3000/healthz
curl -fsS http://127.0.0.1:3000/api/health/ready
pm2 status
bash deploy/droplet/validate-droplet.sh https://your.public.host
```

**If health checks fail:** `pm2 logs nursenest-core --lines 100`, `journalctl -u caddy -e`, and Postgres connectivity from the Droplet (`nc -zv host 25060`).

---

## 10. Reboot persistence

### PM2

1. After a successful deploy: **`pm2 save`** (already in `deploy-app.sh` and `deploy-artifact.sh`).
2. One-time as root: **`env PATH=$PATH pm2 startup systemd -u <deploy-user> --hp /home/<deploy-user>`** and run the command it prints.
3. Reboot test: **`sudo reboot`**, then SSH back and run **`pm2 status`** and **`curl -fsS http://127.0.0.1:3000/healthz`**.

### Caddy

- **`bootstrap-ubuntu.sh`** runs **`systemctl enable caddy`**.
- After editing the Caddyfile: **`sudo systemctl reload caddy`** (or **`restart`**) once validated.

### Automated check

```bash
bash deploy/droplet/check-boot-persistence.sh
```

### What to verify after a server restart

- **`systemctl is-active caddy`**
- **`pm2 status`** shows **`nursenest-core`** **online**
- Local **`healthz`** and public **`validate-droplet.sh`** URL

---

## 11. Migration checklist

- [ ] Provision Droplet (Ubuntu LTS, SSH key).
- [ ] Run `bootstrap-ubuntu.sh` (or follow its steps manually).
- [ ] `ufw allow OpenSSH`, `ufw allow 80`, `ufw allow 443`, `ufw enable`.
- [ ] Clone repo to `/var/www/nursenest/repo` (private repo: deploy key or token).
- [ ] Copy `env.production.template` → `/var/www/nursenest/env/.env.production` and fill values.
- [ ] Install Caddy site from `Caddyfile.example`; `caddy validate --config ...`.
- [ ] Symlink or copy `.env.production` into `.../nursenest-core/.env.production` (or export from PM2 `env_file`).
- [ ] Deploy app once: either **`deploy-app.sh`** (build on box) or **`deploy-artifact.sh`** (CI-built tarball); both run **`prisma migrate deploy`** and PM2 reload.
- [ ] Complete §7 preflight and **`check-boot-persistence.sh`** before relying on reboot.
- [ ] `curl -fsS https://staging.example.com/healthz`
- [ ] `curl -fsS https://staging.example.com/api/health/ready` (expect 200 or 503 if DB intentionally blocked).
- [ ] Browser: login, `/app`, `/admin` (admin user), sample lesson/question.
- [ ] Confirm Stripe webhook URL if production keys used (new public URL).
- [ ] Cutover DNS to Droplet when satisfied.
- [ ] Monitor error logs 24–48h; keep App Platform disabled but recoverable for one week.

---

## 12. Cost and simplicity

- **Cheapest safe path:** Managed Postgres + Spaces (unchanged) + **2 GB** Droplet with **`deploy-app.sh`**, or **1 GB** with **artifact deploy** and CI builds (§8).
- **Do not move DB to same Droplet** unless you accept backup/ops burden; managed DB is worth the cost for most teams.
- **Spaces:** Keep as object storage + CDN; no migration required for assets.

---

## 13. Summary: App Platform dependencies replaced

| App Platform | Droplet replacement |
|--------------|----------------------|
| Managed build/run commands | **`deploy-app.sh`** (on-box build) or **`deploy-artifact.sh`** (CI artifact) + PM2 |
| HTTPS | Caddy (this repo’s documented path) |
| Health check path | `/healthz` + optional `/api/health/ready` |
| `PORT` injection | Explicit `PORT=3000` in PM2 env |
| Horizontal scaling (if used) | Second Droplet + load balancer (later) |

---

## Root causes of typical migration issues

1. **Wrong working directory** — build must run in `nursenest-core/` with repo parent present for `@shared/*`.
2. **Missing `AUTH_URL` / `NEXT_PUBLIC_APP_URL`** — cookies and redirects break.
3. **Binding `0.0.0.0` without firewall** — prefer `127.0.0.1` + reverse proxy.
4. **Skipping `prisma migrate deploy`** — app boots but queries fail.
5. **DB firewall** — Droplet IP must be allowed on managed Postgres.

For hands-on commands, see `deploy/droplet/README.md`.
