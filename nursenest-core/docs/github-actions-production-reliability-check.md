# GitHub Actions: Production reliability check

The workflow [`.github/workflows/production-reliability-check.yml`](../../.github/workflows/production-reliability-check.yml) runs on a schedule (every 10 minutes) and on `workflow_dispatch`. It performs **read-only** HTTP checks against production and optional bounded self-heal calls. It does **not** change deploy logic or the production app beyond what those existing internal APIs already do.

## Required repository secrets

If the workflow fails on the step **Verify secrets are configured**, that is a **GitHub Actions / repository configuration** issue. It does **not** mean production is down.

Configure both secrets under:

**GitHub → your repository → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Purpose |
|--------|---------|
| `NURSENEST_PRODUCTION_BASE_URL` | Production site origin (no trailing slash required; the workflow strips one). Example: `https://www.nursenest.ca` |
| `NURSENEST_RELIABILITY_SECRET` | Shared bearer value sent as header `x-nursenest-reliability-secret` on internal reliability routes. Must **match** the production environment variable of the same name on DigitalOcean (App Platform or droplet env, whichever serves production). |

After adding secrets, re-run the workflow from the **Actions** tab (**Run workflow**) or wait for the next scheduled run.

## Safety in logs

The workflow is written so the reliability secret is **not** printed to job logs (no `echo` of the secret, no `curl -v` / `--verbose`). Do not add `set -x` to these steps.

## CI guard

`npm run verify:production-reliability-workflow` (from `nursenest-core/`) runs a static check that this setup cannot be removed accidentally. It is part of **Verify Build** on pull requests and pushes.
