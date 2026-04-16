# Deploy safety

Goals: **no broken build reaches production**, **no traffic until liveness passes**, **rollback path is known**, **post-deploy verification** confirms the live URL.

---

## 1) Safe deploy sequence

| Step | Where | What |
| --- | --- | --- |
| 1. **Precheck** | CI + local | `npm run deploy:precheck` (= `ci:verify`: Prisma client, `tsc`, `next build`). Same as GitHub **Verify Build** on every push/PR. |
| 2. **Migrations** | Before or with deploy | Managed Postgres: run **Prisma migrate** (`.github/workflows/prisma-migrate.yml` workflow_dispatch, or droplet `prisma migrate deploy` before/at deploy). Use the **same** `DATABASE_URL` as the running app. |
| 3. **Build & run** | App Platform / Droplet | App Platform: `build_command` / `run_command` in `.do/app-nursenest-core-next.yaml`. Droplet: `deploy/droplet/deploy-app.sh` (build → PM2 reload). |
| 4. **Health before trusting traffic** | Platform | **DigitalOcean:** `health_check` on `GET /healthz` (see app spec) — load balancer waits for success before routing. **Droplet:** script waits for `GET /healthz`, then runs `scripts/verify-deploy-health.mjs` for `/healthz` + `/api/health`. |
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
| Routing traffic to a dead process | DO **health_check** on `/healthz`; droplet **curl + verify-deploy-health** after PM2. |
| Silent broken deploy | Deploy script **exits non-zero** if health fails; post-deploy **`qa:verify:production`** fails fast on bad HTTP. |
| No rollback story | Documented **App Platform previous deployment** + **git checkout** on droplet. |

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

See also: [`release-deploy-checklist.md`](./release-deploy-checklist.md), [`release-verification.md`](./release-verification.md).
