# Self-healing lite (production reliability)

This document describes the **read-only production probe** system and the **bounded cache revalidation** helper. It is **not** autonomous healing, does **not** modify application source code, and does **not** use AI to rewrite anything.

## What it does

- **HTTP probes** against critical public routes from production (or staging) using `fetch` with a timeout.
- **Lesson probes** against a **small, catalog-backed** set of verified marketing lesson URLs (not the full library).
- **Dedicated checks** for `/sitemap.xml` (XML shape) and `/pricing` (HTML health) in addition to the generic public route sweep.
- **`GET /api/internal/reliability/check`** returns JSON with `ok`, `failures`, `warnings`, and per-probe metadata when authorized with `x-nursenest-reliability-secret`.
- **`POST /api/internal/reliability/self-heal`** performs **only** allowlisted `revalidatePath` / `revalidateTag` calls (Next.js ISR hints). No database writes, no Stripe, no OpenAI, no filesystem edits, no deploys, no global cache purge.

## What it does not do

- No automatic code changes (including AI-generated patches).
- No schema migrations, data fixes, or destructive cache clears.
- No payment or subscription side effects.
- No user-facing UI changes.

## Required configuration

### Application runtime (e.g. DigitalOcean App Platform)

| Variable | Purpose |
|----------|---------|
| `NURSENEST_RELIABILITY_SECRET` | Shared secret; must match the GitHub Actions secret. Requests without a matching header receive **404** (intentionally not 401). |
| `NURSENEST_PRODUCTION_BASE_URL` | Optional; public origin used as the probe base (e.g. `https://www.nursenest.ca`). If unset, the check route falls back to the incoming request origin (less ideal for cron hitting a private hostname). |

If `NURSENEST_RELIABILITY_SECRET` is **unset**, both internal routes treat every request as unauthorized (**404**), so local builds and dev machines are unaffected.

### GitHub repository secrets (workflow)

| Secret | Purpose |
|--------|---------|
| `NURSENEST_PRODUCTION_BASE_URL` | Public site origin for `curl` (no hardcoded domain in the workflow file). |
| `NURSENEST_RELIABILITY_SECRET` | Same value as the app’s `NURSENEST_RELIABILITY_SECRET`. |

## GitHub Actions workflow

- File: `.github/workflows/production-reliability-check.yml`
- **Schedule:** every 10 minutes.
- **Manual:** `workflow_dispatch` from the Actions tab.
- **Behavior:** run check → on failure, invoke self-heal once → wait 30s → re-run check → fail the job if still unhealthy.

## Interpreting failures

- Open the failing workflow log. Warnings and failures are printed from the JSON `failures` / `warnings` arrays.
- Typical classes:
  - **HTTP / timeout:** upstream outage, TLS, or edge misconfiguration.
  - **Placeholder / i18n leak:** response body contains forbidden markers (see `src/lib/validation/forbidden-production-text.ts` and `src/lib/reliability/probe-content-guards.ts`).
  - **Lesson probes:** catalog could not produce verified URLs, or a lesson detail page returned an error shell.

Use application logs, deployment history, and PostHog/Sentry (if enabled) alongside this signal.

## Manual rollback (DigitalOcean)

1. Identify the last known-good deployment in the App Platform **Deployments** list.
2. **Rollback** to that deployment (or redeploy a known-good image/git SHA).
3. Re-run the reliability workflow manually after rollback to confirm `ok: true`.

Exact UI labels vary by DO region/version; prefer the official DigitalOcean App Platform rollback documentation for your account.

## Why this is safe around AI

The self-heal endpoint is an **explicit, fixed list** of Next.js `revalidatePath` / `revalidateTag` calls. There is **no** model-driven planner, no repository write access, and no general-purpose “fix it” automation—only bounded ISR hints that operators can also trigger deliberately after an incident.

## Local testing (optional)

```bash
cd nursenest-core
export NURSENEST_RELIABILITY_SECRET='local-dev-secret-min-16chars'
export NURSENEST_PRODUCTION_BASE_URL='http://localhost:3000'
npm run dev
# In another shell:
curl -sS -H "x-nursenest-reliability-secret: $NURSENEST_RELIABILITY_SECRET" \
  "$NURSENEST_PRODUCTION_BASE_URL/api/internal/reliability/check" | jq .
```

Unit tests: `npm run test:reliability` (see `package.json`).
