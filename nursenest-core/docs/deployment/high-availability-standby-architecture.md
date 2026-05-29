# NurseNest High Availability Standby Architecture

Last updated: 2026-05-29

## Objective

NurseNest should not depend on a single app deployment plus a single writable database endpoint. The approved HA shape is:

```text
Primary production app
  -> Primary managed Postgres database

Standby app deployment
  -> Managed Postgres read replica during normal operation
  -> Promoted writable replica during failover
```

Target recovery time: **under 15 minutes** from incident declaration to learner traffic served by standby.

## Deployment Topology

| Layer | Primary | Standby |
| --- | --- | --- |
| App | DigitalOcean App Platform `nursenest-core-next` | DigitalOcean App Platform `nursenest-core-standby` |
| Image | `ghcr.io/erikagodin6-jpg/nursenest:sha-<commit>` | Same image tag as primary |
| Database | Managed Postgres primary writer | Managed Postgres replica |
| Domains | `nursenest.ca`, `www.nursenest.ca` | Hidden standby hostname until failover |
| Liveness | `/healthz` | `/healthz` |
| Readiness | `/readyz`, `/api/health/ready` | `/readyz`, `/api/health/ready` |
| Activity probe | `/api/health/activity-startup` | `/api/health/activity-startup` |
| Env verification | `/api/internal/runtime-env-health` with `NN_RUNTIME_ENV_HEALTH_SECRET` | Same |

The production spec remains `.do/app-nursenest-core-next.yaml`. The standby starting point is `.do/app-nursenest-core-standby.template.yaml`.

## Required Standby Environment

Set these on the standby app before considering it live:

| Variable | Standby value |
| --- | --- |
| `DATABASE_URL` | Replica connection string during normal operation; promoted writer after failover |
| `DIRECT_URL` | Replica direct connection string during normal operation; promoted direct writer after failover |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Same values as primary so sessions remain valid |
| `AUTH_URL` / `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` | Standby URL during validation; production URL only after failover |
| `CRON_SECRET` | Same value as primary |
| `NN_RUNTIME_ENV_HEALTH_SECRET` | Same value as primary |
| Stripe keys | Same live keys as primary |
| Spaces/object storage keys | Same values as primary |

Do not run write-heavy cron jobs from standby while it points at a read replica. Keep scheduled jobs active only on primary unless standby has been promoted.

## Health Checks

The app already exposes the required health surfaces:

- `/healthz`: process liveness, no database dependency.
- `/readyz`: App Platform process readiness.
- `/api/health`: public app health and database URL fingerprint prefix.
- `/api/health/ready`: bounded database `SELECT 1`.
- `/api/health/activity-startup`: bounded checks for flashcards, exam questions, and practice test availability.
- `/api/internal/runtime-env-health`: secret-protected environment verification.

## Validation Command

Run from repo root:

```bash
HA_PRIMARY_URL=https://www.nursenest.ca \
HA_STANDBY_URL=https://standby.example.nursenest.ca \
NN_RUNTIME_ENV_HEALTH_SECRET=... \
npm run ha:validate
```

The validator checks both deployments, records response durations, verifies readiness JSON, validates activity startup, and compares the public `dbUrlFingerprintPrefix10` from `/api/health`.

By default, the validator fails if primary and standby expose the same database fingerprint. That protects against accidentally wiring standby to the primary writer. For temporary drills only:

```bash
HA_ALLOW_SHARED_DATABASE_URL=1 npm run ha:validate -- https://www.nursenest.ca https://standby.example.nursenest.ca
```

GitHub Actions workflow `.github/workflows/high-availability-standby-validate.yml` runs the same validation every 30 minutes when `HA_STANDBY_URL` is configured.

## Failover Procedure

Use this procedure when primary production cannot be recovered quickly and learner-facing outage risk exceeds 5 minutes.

1. Declare incident and freeze normal deploys.
2. Confirm primary failure:

```bash
curl -fsS https://www.nursenest.ca/healthz
curl -fsS https://www.nursenest.ca/api/health/ready
curl -fsS https://www.nursenest.ca/api/health/activity-startup
```

3. Confirm standby process is healthy:

```bash
HA_PRIMARY_URL=https://www.nursenest.ca \
HA_STANDBY_URL=https://standby.example.nursenest.ca \
NN_RUNTIME_ENV_HEALTH_SECRET=... \
npm run ha:validate
```

4. Promote the database replica in the managed Postgres provider.
5. Update standby `DATABASE_URL` and `DIRECT_URL` to the promoted writable endpoint.
6. Restart or redeploy standby so the new database connection is active.
7. Re-run:

```bash
npm run ha:validate -- https://www.nursenest.ca https://standby.example.nursenest.ca
```

8. Shift traffic:

- Preferred: change DNS / load balancer origin for `www.nursenest.ca` and `nursenest.ca` to standby.
- Emergency: add production domains to the standby DigitalOcean app and remove them from the failed primary app if necessary.

9. Validate customer paths:

```bash
curl -fsS https://www.nursenest.ca/healthz
curl -fsS https://www.nursenest.ca/api/health/ready
curl -fsS https://www.nursenest.ca/api/health/activity-startup
```

10. Run synthetic learning monitor against production:

```bash
SYNTHETIC_MONITOR_BASE_URL=https://www.nursenest.ca \
SYNTHETIC_MONITOR_SECRET=... \
QA_PAID_EMAIL=... \
QA_PAID_PASSWORD=... \
npm --prefix nursenest-core run monitor:synthetic-learning
```

## Recovery Target Timeline

| Minute | Action |
| --- | --- |
| 0-2 | Incident declared, deploy freeze, primary failure confirmed |
| 2-5 | Standby validation and replica health confirmed |
| 5-9 | Replica promoted, standby env updated/restarted |
| 9-12 | Standby validation rerun |
| 12-15 | DNS/domain traffic shifted and synthetic monitor started |

## Disaster Recovery Test

Perform this quarterly:

1. Create or refresh standby from `.do/app-nursenest-core-standby.template.yaml`.
2. Point standby at the managed Postgres replica.
3. Run `npm run ha:validate`.
4. Confirm the validator fails if standby points at the primary database, then restore replica config.
5. Perform a controlled replica promotion in a non-production database cluster.
6. Update standby env to the promoted test writer.
7. Run synthetic learning monitoring against standby.
8. Record timings and gaps in the incident log.

## Success Criteria

- Standby app deploys from the same GHCR image as primary.
- Standby passes `/healthz`, `/readyz`, `/api/health/ready`, `/api/health/activity-startup`, and secret runtime env checks.
- Standby database fingerprint differs from primary during normal operation.
- Replica promotion and standby env update are rehearsed.
- Traffic shift can be completed in under 15 minutes.
