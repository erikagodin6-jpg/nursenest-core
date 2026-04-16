# Operations handoff: production runtime & droplet verification

**Status:** This document is the **explicit verification and runbook** for closing runtime/memory work. **Do not treat production health as proven until checks below are run on the actual host(s)** and results are reviewed.

---

## 1. How production is supposed to run (repo audit)

### Primary: DigitalOcean App Platform (Next.js app)

- **Spec:** `.do/app-nursenest-core-next.yaml`
- **Source:** `source_dir: nursenest-core`
- **Build (CI/build phase only):** `npm run build:deploy && npm prune --omit=dev` — **not** a long-lived `next build` on the running instance.
- **Runtime command:** `npm run start` → `package.json` → `NODE_ENV=production node ... next start -H 0.0.0.0 -p ${PORT:-3000}`
- **App Platform sets:** `PORT=8080`, `http_port: 8080` — the listening port in production there is **8080** inside the container (mapped by the platform).
- **Process model:** Node runs **one Next.js server process per instance** (autoscaling min 2 / max 3 per spec). **Not** PM2 inside the container unless you added it (default is **not** PM2 on App Platform).
- **Health check (platform):** `GET /healthz` (initial delay 120s per spec).

### Alternate: Droplet with PM2

- **File:** `deploy/droplet/ecosystem.config.cjs`
- **Intended command:** PM2 runs `next start` with **`instances: 1`**, `exec_mode: fork`, **`cwd`** = repo `nursenest-core/` (resolved from `deploy/droplet/`).
- **Bind:** script args `start -H 127.0.0.1 -p 3000` — expect **reverse proxy** (nginx/Caddy) to **443/80** → **3000** on localhost.
- **Restart:** PM2 `autorestart: true`, `max_memory_restart: "850M"`.

### What the droplet might be for

- Either **host the full app** (PM2 + proxy), **or** only **cron/SSH/scripts** if production traffic is entirely on App Platform. **Confirm with your infra** which host serves `www`. This repo supports **both** patterns; the YAML comments warn not to build the monolith root on App Platform for the Next app.

### Not intended in production

- **`npm run dev`** / **`next dev`** — development only.
- **`next build`** as a long-lived process — build belongs in **deploy pipeline** (App Platform build step or CI), not on the serving instance.

### Prisma

- **Single `PrismaClient`** per Node process via `globalThis` (`src/lib/db.ts`). **Multiple Node processes** (multiple containers/instances) = **one client each** — expected for horizontal scale.

---

## 2. Droplet verification checklist (copy-paste)

Run as a user that can see processes and ports (often `root` or `sudo`). **Do not paste secrets into tickets.**

### Shell context

```bash
whoami
pwd
```

**Expected (PM2 deploy):** `cwd` is often something like `/var/www/...` or `/home/.../nursenest-core` — must match **`ecosystem.config.cjs` `cwd`** (repo `nursenest-core/` root with `package.json`).

```bash
# If using PM2 from repo:
test -f package.json && grep -q '"name": "nursenest-core"' package.json && echo "OK: app root" || echo "BAD: not nursenest-core app root"
```

### Processes (Node / Next / npm)

```bash
ps aux --sort=-%mem | head -n 25
```

```bash
pgrep -af node || true
pgrep -af "next " || true
pgrep -af "next-server" || true
pgrep -af npm || true
```

**Expected:** One **production** Node tree per app instance (`next start` or `next-server` child). **Not** `next dev`. **Not** a stuck `node ... next build` hours after deploy.

### Memory by process

```bash
ps aux --sort=-%mem | head -n 15
```

(Optional) `top` / `htop` sorted by memory for live view.

### Listening ports

```bash
ss -ltnp 2>/dev/null || netstat -ltnp 2>/dev/null
```

**Expected (PM2 + local bind):** Something listening on **127.0.0.1:3000** (per ecosystem file). **Plus** nginx/apache on **80/443** if used.

### PM2 (if used)

```bash
command -v pm2 >/dev/null && pm2 status || echo "pm2 not installed or not in PATH"
```

```bash
command -v pm2 >/dev/null && pm2 describe nursenest-core 2>/dev/null || true
```

```bash
command -v pm2 >/dev/null && pm2 logs nursenest-core --lines 80 --nostream 2>/dev/null || true
```

### systemd (if used instead of PM2)

```bash
systemctl status nursenest-core 2>/dev/null || systemctl status nginx 2>/dev/null || true
```

(Adjust unit names to match your server.)

### Environment presence (**no secret values**)

```bash
test -n "$DATABASE_URL" && echo "DATABASE_URL is set (length $(printf %s "$DATABASE_URL" | wc -c))" || echo "DATABASE_URL is UNSET in this shell"
```

For a **systemd** service, use `systemctl show ... -p Environment` **carefully** (may still expose secrets — prefer checking the **app’s own** startup log line `instrumentation: ... PORT=...` and platform UI “variable is set” toggles).

```bash
test -n "$AUTH_SECRET" && echo "AUTH_SECRET is set" || echo "AUTH_SECRET is UNSET in this shell"
```

```bash
test -n "$PORT" && echo "PORT=$PORT" || echo "PORT unset (next start may default to 3000)"
```

### Logs

```bash
journalctl -u nginx -n 100 --no-pager 2>/dev/null || true
```

```bash
command -v pm2 >/dev/null && pm2 logs nursenest-core --lines 100 --nostream 2>/dev/null || true
```

Look for structured lines from the app (`perf` / `memory_sample` / `memory_pressure` / `high_memory`) without sharing full env.

### HTTP smoke (localhost)

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/healthz 2>/dev/null || echo "curl failed"
```

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/api/health 2>/dev/null || echo "curl failed"
```

**Expected:** `200` for liveness (adjust port if `PORT` differs).

---

## 3. What “healthy” looks like

| Signal | Expected |
|--------|-----------|
| **App command** | `next start` (via `npm run start` or PM2 pointing at `next`) with `NODE_ENV=production` |
| **Dev / build** | **No** `next dev`. **No** persistent `next build` on the serving host after deploy completes |
| **Instances (single droplet)** | **One** PM2 app process group with **instances: 1** — not multiple unrelated `next start` for the same product |
| **App Platform** | **2–3** instances per autoscale spec is **normal**; each is one Node process |
| **Prisma** | One `PrismaClient` **per Node process** (global singleton in that process) |
| **Ports** | **App Platform:** listen on **`PORT` (8080)**. **Droplet PM2 file:** **127.0.0.1:3000** behind proxy |
| **Memory logs** | Periodic `memory_sample` in production; **`memory_pressure`** should be **occasional**, not constant spam (default RSS warn ~**70%** of limit via `PERF_MEMORY_RSS_WARN_PCT`) |
| **Heap interval** | Default sample every **600s** if `PERF_MEMORY_LOG_INTERVAL_MS` unset; heap **≥512MB** on interval triggers extra `high_memory` path in instrumentation |
| **Restart** | **PM2:** `pm2 restart nursenest-core` (from repo root with same env). **App Platform:** redeploy / restart via DO UI or `doctl` |

---

## 4. What “bad” looks like

- **Multiple `next start`** processes on **one** droplet when only **one** is intended (misconfigured duplicate PM2 apps or manual runs).
- **`next dev`** or **`npm run dev`** in production.
- **`next build`** still running** for a long time** on the serving host (stuck deploy or wrong command).
- **PM2 / platform restart loop** — `pm2 status` shows constant restarts or **uptime** always near zero.
- **`memory_pressure` logged very frequently** — sustained overload or leak; tune instance size / heap / query load.
- **Wrong `cwd`** — `package.json` not found at expected root; static assets or `.next` mismatches; odd 500s.
- **`DATABASE_URL` unset** in the process — auth, Prisma, readiness will fail (see runbook).

---

## 5. Runbook (plain English)

### If memory is still high

1. Confirm **one** production Node per instance (checklist above).
2. Check logs for **`memory_pressure`**, **`high_memory`**, **`slow_query_detected` critical** — indicates DB/heavy routes, not just heap cap.
3. On small VMs, **`NODE_MAX_OLD_SPACE_SIZE_MB`** (see `package.json` `start` script) may need tuning with **RAM headroom**; App Platform comment suggests ~**384–512** MB on **1 GiB** class instances.
4. PM2 **`max_memory_restart: 850M`** — if restarts loop, **raise RAM** or **reduce load** before raising the cap blindly.

### If `DATABASE_URL` appears unset

1. Verify in **hosting UI** (DO App Platform env / droplet systemd / PM2 ecosystem) that the variable is **injected for the runtime**, not only in local `.env`.
2. Reload/restart after changing secrets.
3. See `src/lib/db/env-bootstrap.ts` and `docs/RELEASE_QA.md` for pooled vs direct URLs — migrations use **`DATABASE_DIRECT_URL`** when set in Prisma schema.

### If Prisma cannot connect

1. `curl` **readiness**: `GET /api/health/ready` (may return **503** if DB down).
2. Check **firewall / trusted sources** on managed Postgres for the **app host IPs**.
3. SSL: URI usually needs **`sslmode=require`** for DO managed DB.
4. PgBouncer: pooled URL needs **`pgbouncer=true`** (or `PRISMA_USE_PGBOUNCER=true` per env-bootstrap) — see env docs.

### If login still breaks in production

1. Confirm **`AUTH_SECRET`**, **`AUTH_URL` / app URL**, **`NEXTAUTH_URL`** (if used) align with the public origin.
2. Check **`AUTH_TRUST_HOST`** on App Platform spec if behind proxies.
3. **No** `DATABASE_URL` → session / user persistence breaks — fix DB env first.
4. Use **`/api/auth/session`** and app logs (never paste cookies/tokens in reviews).

---

## 6. What to send back for review (no secrets)

Paste or attach:

1. **Host type:** App Platform vs droplet (and region if relevant).
2. **Output** of: `ps aux --sort=-%mem | head -20` (redact user names if needed).
3. **Output** of: `pgrep -af next` (or “empty”).
4. **Output** of: `ss -ltnp | head -30` (ports only).
5. **PM2:** `pm2 status` screenshot or text — or “not used”.
6. **Confirmation:** `DATABASE_URL` **set** / **unset** (boolean + length only), same for `AUTH_SECRET`.
7. **curl** exit codes / HTTP codes for `/healthz` and `/api/health` against **localhost** and (if safe) public URL.
8. **Log excerpts:** last **50** lines showing either **`memory_sample`** **or** confirming **no** crash loop — **redact** any tokens.

---

## 7. Remaining risks (cannot close without ops proof)

- **Which environment actually serves production traffic** (App Platform vs droplet vs both) must be confirmed outside the repo.
- **Horizontal scale** legitimately runs **multiple Node processes** (multiple containers); “exactly one process globally” is **not** required — only **one per instance** on a single-VM deploy.
- **Memory “fixed” in code** still needs **RSS/heap under real load** on the **configured** instance size.
