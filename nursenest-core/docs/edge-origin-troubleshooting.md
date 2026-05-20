# Edge vs origin troubleshooting (production)

Use this when **App Platform / logs show healthy** (`/readyz`, internal probes) but **browsers or `curl` to the public URL fail**, or when only **some paths** fail.

## 1) Layers (in order)

1. **DNS** (registrar / Cloudflare DNS) — `A`, `AAAA`, `CNAME` for `www` and apex.
2. **CDN / reverse proxy** (e.g. **Cloudflare** orange cloud) — TLS to client, WAF, cache, Workers, redirect rules.
3. **DigitalOcean App Platform** — custom domains, certificates, `*.ondigitalocean.app` default host, load balancer to component `web` on port **8080** (see `.do/app-nursenest-core-next.yaml`).
4. **Application** — Next.js routes after the request reaches Node.

**Repo spec (probes, not domains):** `health_check` → `GET /readyz`, `liveness_health_check` → `GET /healthz`, `http_port: 8080`.

## 2) Quick classification

| Symptom | Likely layer |
|--------|----------------|
| **`/healthz` or `/readyz` OK**, **`/` or `/api/health` timeout** | Origin handler stall **or** path-scoped **WAF/cache/Worker** — check **Cloudflare Security → Events** and **DO runtime logs** in the same minute. |
| **TLS / cert errors** on apex but `www` OK | **Domain / cert** on apex in **DO → Domains** and **Cloudflare SSL** — not a Next redirect loop until TLS succeeds. |
| **All paths timeout**, same from `*.ondigitalocean.app` | **DO ingress / app down** — deployments, instance health. |
| **`curl -4` works, `curl -6` fails** (from IPv6-capable host) | **IPv6** DNS or proxy — test `AAAA`, temporarily narrow `AAAA` / proxy IPv6 (rollback after). |
| **Repeated `Location` headers** (`curl -IL`) | **Redirect loop** — one canonical host (**Cloudflare rules** vs **origin**); remove duplicate rules. |

## 3) Commands (copy-paste)

Replace hosts with yours.

```bash
# DNS
dig +noall +answer www.example.com A AAAA CNAME
dig +noall +answer example.com A AAAA

# Public vs default app host (from DO UI)
curl -4 --http1.1 -m 15 -I "https://www.example.com/healthz"
curl -4 --http1.1 -m 15 -I "https://YOUR-APP.ondigitalocean.app/healthz"

# Document path (catches “edge OK, page stalls”)
curl -4 --http1.1 -m 45 -I "https://www.example.com/"

# IPv4 vs IPv6 (run from a network with working IPv6)
curl -4 --http1.1 -m 30 -I "https://www.example.com/"
curl -6 --http1.1 -m 30 -I "https://www.example.com/"

# Redirects
curl -4 -IL --max-redirs 15 --max-time 30 "https://www.example.com/"
curl -4 -IL --max-redirs 15 --max-time 30 "https://example.com/"
```

## 4) Cloudflare (if used)

- **SSL/TLS → Overview:** prefer **Full** or **Full (strict)** with a **valid origin cert**; avoid **Flexible** as a permanent posture.
- **Security → Events:** correlate blocks with user IPs and paths.
- **Rules:** redirect / bulk / Workers — avoid **www ↔ apex** duplication with origin redirects.
- **Temporary IP allow:** high-priority **WAF custom rule** → **Skip** for your operator IP → **delete after** diagnosis.

## 5) DigitalOcean App Platform

- **Settings → Domains:** `www` **and** apex **Active**, certificate **Issued** (both hostnames if you serve both).
- **Deployments:** active deployment healthy; **rollback** if a release correlates with the incident.
- **Logs / Insights:** 5xx, slow requests, readiness failures.

## 6) Canonical URL and env

Align **`AUTH_URL`** (and any `NEXT_PUBLIC_APP_URL` / marketing base) with the **chosen canonical host** (typically `https://www.…`) in the **DO env UI** — mismatches cause **redirect churn** after TLS works, not cert errors.

## 7) Alerting (operational)

| Signal | Where to alert |
|--------|----------------|
| **`/readyz` or `/healthz` failing** on the app | **DigitalOcean** uptime / component health (or external synthetic hitting those paths). |
| **Public URL timeouts** while probes pass | **External** synthetic (GitHub Actions scheduled job with repository secrets, UptimeRobot, Better Stack, etc.) hitting **`/`** and **`/healthz`**. |
| **WAF / bot blocks** | **Cloudflare** notifications / Logpush. |

Optional repo workflow: `.github/workflows/production-public-health-watch.yml` — set repository secrets **`PRODUCTION_VERIFY_BASE_URL`** (and optionally **`PRODUCTION_VERIFY_ORIGIN_BASE_URL`**) to enable scheduled checks.

## 8) Post-deploy checklist

See **`deploy-safety.md`** § “Post-deploy edge + origin verification” and run:

```bash
cd nursenest-core
export BASE_URL="https://www.example.com"
export ORIGIN_BASE_URL="https://your-app.ondigitalocean.app"   # optional, from DO UI
export VERIFY_CANONICAL_HOME=1
npm run qa:verify:health
```
