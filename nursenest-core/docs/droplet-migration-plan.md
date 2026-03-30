# NurseNest: DigitalOcean App Platform → Droplet migration

This document is for operators moving **nursenest-core** (Next.js 16, Prisma, NextAuth) from **App Platform** to a **Droplet** while keeping **managed Postgres** and **Spaces** where practical.

## 1. Production assumptions (audit)

### Build and runtime

| Item | Current behavior | Droplet note |
|------|------------------|--------------|
| **App directory** | Run all npm commands inside `nursenest-core/` (this package), not the monorepo root `rest-express` tree. | Clone full repo; `cd <repo>/nursenest-core`. |
| **Monorepo root** | `next.config.ts` sets `turbopack.root` and `outputFileTracingRoot` to the **parent** of this package (repo root). Required for `@shared/*` imports. | Deploy must include parent `shared/` (and lockfile at repo root if present). |
| **Build** | `npm run build` or `npm run build:deploy` runs `prisma generate`, disk check, `next build`. `TMPDIR` should be writable (`/tmp`). | Export `TMPDIR=/tmp` (or larger disk path) before build. |
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

### App Platform–specific behavior to replace

- **Automatic HTTPS** → Caddy or Nginx + Let’s Encrypt on the Droplet.
- **Injected `PORT`** → set `PORT=3000` (or chosen internal port) in PM2/env.
- **Build command in UI** → your `deploy-app.sh` runs `npm ci` + `npm run build:deploy` (or `build`).
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
- **Size (starting point):** **2 vCPU / 2 GB RAM** minimum for comfortable `next build`; **4 GB** if you build on the same box. Alternatively: build in CI and rsync `.next` + `node_modules` (advanced).
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

- **Logs:** PM2 → `~/.pm2/logs/`; Caddy → `/var/log/caddy/`; optional `logrotate` (see `deploy/droplet/logrotate-nursenest.conf`).

---

## 3. Automation deliverables (in repo)

| File | Role |
|------|------|
| `deploy/droplet/bootstrap-ubuntu.sh` | First-time server packages: Node 20, PM2, Caddy, ufw hints |
| `deploy/droplet/deploy-app.sh` | Pull, install, migrate, build, PM2 reload |
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
- **Disk:** `df -h`; build artifacts live under app `/.next` — run `npm run clean:next` only when intentional; deploy script can prune old releases if you use release dirs (optional).
- **Memory:** `free -h`; if OOM during build, use larger Droplet or build off-box.

---

## 5. Rollback and cutover strategy

1. **Keep App Platform running** until Droplet is validated.
2. **DNS:** Create **`staging.yourdomain.com`** → Droplet IP; complete checklist on staging.
3. **Validate:** `/healthz`, `/api/health/ready`, login, signup, admin, lessons, questions, Stripe test mode webhook if applicable, Spaces images.
4. **Cutover:** Lower TTL on production DNS; switch `A`/`AAAA` (or CNAME) to Droplet; or swap Caddy `reverse_proxy` target only after IP switch.
5. **Rollback:** Point DNS back to App Platform; Droplet can stay for debugging. No schema downgrade assumed — **only migrate forward** with Prisma.

**If health checks fail after cutover:** revert DNS; inspect `pm2 logs`, Caddy journal, `journalctl -u caddy`, and Postgres connectivity from Droplet (`nc -zv host 25060`).

---

## 6. Migration checklist

- [ ] Provision Droplet (Ubuntu LTS, SSH key).
- [ ] Run `bootstrap-ubuntu.sh` (or follow its steps manually).
- [ ] `ufw allow OpenSSH`, `ufw allow 80`, `ufw allow 443`, `ufw enable`.
- [ ] Clone repo to `/var/www/nursenest/repo` (private repo: deploy key or token).
- [ ] Copy `env.production.template` → `/var/www/nursenest/env/.env.production` and fill values.
- [ ] Install Caddy site from `Caddyfile.example`; `caddy validate --config ...`.
- [ ] Symlink or copy `.env.production` into `.../nursenest-core/.env.production` (or export from PM2 `env_file`).
- [ ] Run `deploy-app.sh` once (sets `DATABASE_URL`, runs `prisma migrate deploy`, `npm run build:deploy`, `pm2 startOrReload`).
- [ ] `curl -fsS https://staging.example.com/healthz`
- [ ] `curl -fsS https://staging.example.com/api/health/ready` (expect 200 or 503 if DB intentionally blocked).
- [ ] Browser: login, `/app`, `/admin` (admin user), sample lesson/question.
- [ ] Confirm Stripe webhook URL if production keys used (new public URL).
- [ ] Cutover DNS to Droplet when satisfied.
- [ ] Monitor error logs 24–48h; keep App Platform disabled but recoverable for one week.

---

## 7. Cost and simplicity

- **Cheapest safe path:** Managed Postgres + Spaces (unchanged) + single **2 GB** Droplet for app only; upgrade to 4 GB if builds OOM.
- **Do not move DB to same Droplet** unless you accept backup/ops burden; managed DB is worth the cost for most teams.
- **Spaces:** Keep as object storage + CDN; no migration required for assets.

---

## 8. Summary: App Platform dependencies replaced

| App Platform | Droplet replacement |
|--------------|----------------------|
| Managed build/run commands | `deploy-app.sh` + PM2 |
| HTTPS | Caddy (or Certbot + Nginx) |
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
