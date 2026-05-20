# Scheduled pipelines (production)

All cron HTTP routes accept `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set.

## Routes

| Route | Purpose | Idempotency |
|-------|---------|-------------|
| `POST /api/cron/blog-batch-schedule` | Blog batch queue + scheduled publish + ISR | Postgres `pg_try_advisory_lock`; overlapping calls return `{ skipped: true }` |
| `POST /api/cron/jobs` | `BackgroundJob` worker | Blocking `pg_advisory_lock` (serial batches) |
| `POST /api/cron/stripe-reconcile` | Stripe ↔ Prisma reconciliation | `pg_try_advisory_lock`; full report optional with `?full=1` |
| `POST /api/cron/content-completion` | Incremental lesson completion batches | Gated by `CONTENT_COMPLETION_CRON_ENABLED=true`; `pg_try_advisory_lock` |

## Environment

- **`CRON_SECRET`**: required in production for all `/api/cron/*` routes.
- **`STRIPE_RECONCILE_CRON_APPLY`**: set to `true` to apply safe DB updates (same semantics as `npx tsx scripts/reconcile-stripe-subscriptions.ts --apply`).
- **Content completion** (optional): `CONTENT_COMPLETION_CRON_ENABLED=true`, `CONTENT_COMPLETION_CRON_WRITE=true` (default dry-run), `CONTENT_COMPLETION_CRON_PATHWAY_IDS` (comma-separated), `CONTENT_COMPLETION_CRON_BATCH_SIZE`, `CONTENT_COMPLETION_CRON_OFFSET`.

## Logs

Structured server logs use `safeServerLog` with namespaces `cron` / `jobs` (e.g. `blog_batch_schedule_complete`, `stripe_reconcile_complete`, `content_completion_batch`).

## Automation options

1. **GitHub Actions** (`.github/workflows/scheduled-*.yml`): set secrets `PRODUCTION_CRON_BASE_URL` and `CRON_SECRET`. Artifacts retain last JSON responses.
2. **Vercel Cron** (`vercel.json`): requires a Vercel deployment; cron invokes the same routes (add `CRON_SECRET` in project env).
3. **DigitalOcean / other**: schedule `curl -fsS -X POST https://$HOST/api/cron/... -H "Authorization: Bearer $CRON_SECRET"`.

Weekly static audits (no HTTP): `.github/workflows/weekly-static-audits.yml` runs `audit:internal-links` and `audit:paywall-security` on Sundays.
