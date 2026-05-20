# Deploy safety

Goals: **no broken build reaches production**, **no traffic until liveness passes**, **rollback path is known**, **post-deploy verification** confirms the live URL.

**Edge vs origin incidents** (CDN, DNS, TLS, `/` stalls while `/healthz` works): see **[`edge-origin-troubleshooting.md`](./edge-origin-troubleshooting.md)**.

---

## 1) Safe deploy sequence

| Step | Where | What |
| --- | --- | --- |
| 1. **Precheck** | CI + local | `npm run deploy:precheck` (= `ci:verify`: Prisma client, `tsc`, `next build`). Same as GitHub **Verify Build** on every push/PR. |
| 2. **Migrations** | Before or with deploy | Managed Postgres: run **Prisma migrate** (`.github/workflows/prisma-migrate.yml` workflow_dispatch, or droplet `prisma migrate deploy` before/at deploy). Use the **same** `DATABASE_URL` as the running app. |
| 3. **Build & run** | App Platform / Droplet | App Platform: `build_command` / `run_command` in `.do/app-nursenest-core-next.yaml`. Droplet: `deploy/droplet/deploy-app.sh` (build → PM2 reload). |
| 4. **Health before trusting traffic** | Platform | **DigitalOcean (`.do/app-nursenest-core-next.yaml`):** `health_check` → **`GET /readyz`** (routing readiness); `liveness_health_check` → **`GET /healthz`** (liveness); **`http_port` 8080**. **Droplet:** script waits for `GET /healthz`, then runs `scripts/verify-deploy-health.mjs`. |
| 5. **Verification** | After DNS/live | `BASE_URL=https://your-domain npm run qa:verify:production` (HTTP health first, then Playwright). Or `npm run qa:verify:health` only for a quick ping. |

Optional DB readiness on the public URL: `VERIFY_READINESS=1 npm run qa:verify:health` (adds `GET /api/health/ready`; returns **503** if Postgres is down — use for staged canaries, not as the only liveness probe).

---

## 2) Rollback

| Platform | Action |
| --- | --- |
| **DigitalOcean App Platform** | Deployments → select **previous successful deployment** → **Rollback** / redeploy that image. No git revert required for infra-only rollback. |
| **Droplet (git + PM2)** | `git checkout <previous_sha>` (or restore branch), re-run `deploy/droplet/deploy-app.sh`. Artifact deploys: see `deploy-artifact.sh` (symlink + optional automatic rollback when health fails). |
| **Database** | Migrations are forward-only in production; plan **forward fixes** or restore from snapshot if a migration is bad — coordinate with `docs/database-operations.md`. |

---

## 3) Risks reduced

| Risk | Mitigation |
| --- | --- |
| TypeScript / build failure in production | CI **Verify Build** + `deploy:precheck` match production build path; droplet runs **typecheck before migrate/build**. |
| Routing traffic to a dead process | DO **`health_check` on `/readyz`** + **`liveness_health_check` on `/healthz`**; droplet **curl + verify-deploy-health** after PM2. |
| Silent broken deploy | Deploy script **exits non-zero** if health fails; post-deploy **`qa:verify:production`** fails fast on bad HTTP. |
| No rollback story | Documented **App Platform previous deployment** + **git checkout** on droplet. |

---

## 3.1 App Platform sizing note

`/healthz` is intentionally minimal (liveness). **`/readyz`** gates **routing readiness** until handlers can serve real routes. If App Platform reports **`timeout awaiting headers` on `/readyz`**, the likely failure mode is **pre-handler startup stall** inside Next standalone.

For this repo's current workload, **`basic-xs` is not recommended for production**. The safest first infra response is to move off `basic-xs` before attempting broader application refactors, because weak shared CPU headroom can stretch the standalone handler-initialization window enough to fail health checks even when the `/healthz` route body itself is cheap.

---

## 4) Commands (quick reference)

```bash
# Before pushing / in CI (same as Verify Build job)
cd nursenest-core && npm run deploy:precheck

# After deploy — full verification (requires BASE_URL)
cd nursenest-core && export BASE_URL="https://www.example.com" && npm run qa:verify:production

# HTTP only (no Playwright)
cd nursenest-core && export BASE_URL="https://www.example.com" && npm run qa:verify:health
```

---

## 5) Post-deploy edge + origin verification (checklist)

Run after every production deploy (or promote), **before** declaring the release good:

- [ ] **Public canonical URL:** `BASE_URL=https://www.<your-domain>` `npm run qa:verify:health`
- [ ] **Optional — default App Platform host:** set `ORIGIN_BASE_URL=https://<app>.ondigitalocean.app` (exact value from **DO → App → default domain**) and re-run the same command — catches **DNS/proxy drift** vs the app’s live default host.
- [ ] **Optional — document path:** `VERIFY_CANONICAL_HOME=1` — also **`GET /`** (redirects followed, bounded) so **“/healthz OK but homepage hangs”** fails the script.
- [ ] **IPv6 (manual):** from a network with working IPv6, `curl -6 -I --max-time 20 "$BASE_URL/healthz"` — log result; fix **AAAA / proxy IPv6** if v4 works and v6 fails.
- [ ] **Cloudflare (if used):** **SSL/TLS** = **Full** or **Full (strict)** with valid origin cert — document chosen mode in your runbook; avoid **Flexible** as permanent posture.
- [ ] **DO Domains:** `www` **and** apex **Active**, certificate **Issued** (if you serve both).
- [ ] **Alerting:** configure GitHub **production-public-health-watch** secrets (`PRODUCTION_VERIFY_BASE_URL`, optional `PRODUCTION_VERIFY_ORIGIN_BASE_URL`) and **notify on workflow failure**; add **DO** uptime or **UptimeRobot** on `/` + `/healthz` if not already.

```bash
cd nursenest-core
export BASE_URL="https://www.example.com"
export ORIGIN_BASE_URL="https://your-app.ondigitalocean.app"   # optional
export VERIFY_CANONICAL_HOME=1
npm run qa:verify:health
```

`verify-deploy-health.mjs` prints **Tier 1** (liveness/readiness), **Tier 2** (optional `GET /`), **Tier 3** (`/api/health`); on failure it summarizes which tier broke and calls out when **Tier 3** alone fails after Tier 1/2 pass.

See also: [`edge-origin-troubleshooting.md`](./edge-origin-troubleshooting.md), [`release-deploy-checklist.md`](./release-deploy-checklist.md), [`release-verification.md`](./release-verification.md).
