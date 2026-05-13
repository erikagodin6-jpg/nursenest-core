# DigitalOcean Deployment Governance

> **TL;DR — safe deploy:** `npm run do:deploy:execute` from repo root. Never run `doctl apps update` directly.

---

## Canonical deploy file

```
.do/app-nursenest-core-next.yaml   ← the only spec ever passed to doctl
```

One file. All other spec-shaped `.yaml` files in this repo are documentation artifacts
or legacy leftovers — see the [Forbidden files](#forbidden-files) section.

---

## How DigitalOcean env vars work

**DigitalOcean App Platform replaces the entire app config on every `doctl apps update --spec` call.**

There is no merge. Any env var that exists in the live dashboard but is **absent from the spec file** is **permanently deleted** the moment the update runs.

| Entry in spec | Result in live app |
|---|---|
| `key: FOO` with `value: bar` | Sets `FOO=bar` |
| `key: FOO` with `type: SECRET` (no value) | **Preserves existing secret value** in DO |
| `key: FOO` with `type: SECRET` + a new value | Replaces existing value |
| **key absent from spec entirely** | **DELETED from live app permanently** |

This is why the spec must contain every env var name, even secrets whose values live in the DO dashboard.

---

## Approved deploy commands

All commands run from the **repo root** (`/root/nursenest-core` or wherever you cloned the repo).

### Validate only (no deploy)

```bash
npm run do:spec:guard          # quick: guard check on canonical spec
npm run do:deploy:dry          # guard + live diff + print command
npm run do:spec:validate       # guard + backup comparison
```

### Deploy to production

```bash
npm run do:deploy:execute      # guard + live diff + doctl apps update
```

This command:
1. Runs `do-spec-guard.mjs` — fails if any required env key is missing
2. Queries the live app via `doctl apps spec get` — fails if any live key would be deleted
3. Runs `doctl apps update d6a4b825-4d70-4dd4-8d71-04b354d36f43 --spec .do/app-nursenest-core-next.yaml`

### Legacy safe deploy (CI, requires DO_APP_ID env)

```bash
DO_APP_ID=d6a4b825-4d70-4dd4-8d71-04b354d36f43 npm run do:deploy:safe
```

---

## Forbidden files

These files must **never** be passed to `doctl apps update --spec`. The guard exits 1 on all of them.

| File | Reason |
|---|---|
| `nursenest-core/live-app-spec.yaml` | Dashboard export snapshot — comment-only, will wipe all env vars |
| `nursenest-core/.do/app.yaml` | Stale duplicate — missing CRON_SECRET, SPACES_KEY/SECRET, many price IDs |
| `.do/app.yaml` | Legacy artifact with wrong app name (`nursenest`) and ~50 missing env vars |

Running `node scripts/do-spec-guard.mjs <forbidden-file>` returns exit 1 with a clear message.

---

## Adding a new env var

1. **Add to `.do/app-nursenest-core-next.yaml`:**
   - Non-secret value: `key: MY_VAR`, `value: the-value`, `scope: RUN_AND_BUILD_TIME`
   - Secret: `key: MY_SECRET`, `type: SECRET`, `scope: RUN_AND_BUILD_TIME` (no value in YAML)

2. **If it's checkout- or auth-critical, add to `REQUIRED_RUNTIME_ENV_KEYS`** in `scripts/do-spec-guard.mjs`.

3. **Validate:** `npm run do:spec:guard`

4. **Deploy:** `npm run do:deploy:execute`

5. **For secrets with no YAML value:** Set the actual value in the [DO dashboard](https://cloud.digitalocean.com) →  
   App → Settings → App-Level Environment Variables → Edit.  
   DO preserves the existing value when `type: SECRET` is present without a `value:` field.

---

## Adding a new Stripe plan / price ID

1. Create the product and prices in the [Stripe dashboard](https://dashboard.stripe.com/products).

2. Add to `.do/app-nursenest-core-next.yaml`:
   ```yaml
   - key: STRIPE_PRICE_NURSENEST_MY_TIER_1_MONTH_SUBSCRIPTION
     scope: RUN_AND_BUILD_TIME
     value: price_1...
   ```

3. Add the key name to `REQUIRED_RUNTIME_ENV_KEYS` in `scripts/do-spec-guard.mjs`.

4. Add the key to `nursenest-core/.env.local` for local dev.

5. Run `npm run do:spec:guard` to confirm the spec passes.

6. Run `npm run do:deploy:execute`.

---

## Rotating a secret

1. Generate the new secret value (e.g., new API key, new webhook secret).

2. Update it in the [DO dashboard](https://cloud.digitalocean.com):  
   App → Settings → App-Level Environment Variables → Edit → paste new value → Save.

3. **Do not change the spec file** — `type: SECRET` with no value means "keep whatever is in the dashboard."

4. Trigger a redeploy (push to `main`, or `doctl apps create-deployment <APP_ID>`).

5. Verify the new secret is live: `doctl apps logs <APP_ID> --type=run | head -50`

---

## Verifying env persistence after deploy

```bash
# Export live spec and check key count
doctl apps spec get d6a4b825-4d70-4dd4-8d71-04b354d36f43 --format yaml \
  | grep "^  - key:" | wc -l

# Diff live spec keys against canonical spec keys
node scripts/do-predeploy.mjs   # shows ADD/DEL diff before deploying
```

Expected: zero DEL lines. Any DEL line means the canonical spec is missing that key — add it before deploying.

---

## Recovery procedure — env vars disappeared again

If env vars were wiped by an accidental `doctl apps update` with a stale spec:

1. **Immediately** export the live spec to see what survived:
   ```bash
   doctl apps spec get d6a4b825-4d70-4dd4-8d71-04b354d36f43 --format yaml > /tmp/live-recovery.yaml
   ```

2. Compare against canonical: `node scripts/do-predeploy.mjs` (shows what's missing).

3. **Re-deploy the canonical spec** to restore all env names (their `type: SECRET` entries will be empty — values are gone):
   ```bash
   npm run do:deploy:execute
   ```

4. **Re-enter secret values** in the DO dashboard for any secrets that were wiped:
   - `AUTH_SECRET` — generate a new 32+ char random string
   - `DATABASE_URL` — from DO Managed Databases dashboard
   - `STRIPE_SECRET_KEY` — from [Stripe dashboard → API keys](https://dashboard.stripe.com/apikeys)
   - `STRIPE_WEBHOOK_SECRET` — from [Stripe dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe API keys (starts `pk_live_`)
   - `OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_API_KEY` — from OpenAI platform
   - `OPENROUTER_API_KEY` — from OpenRouter dashboard
   - `CRON_SECRET` — generate new random string
   - `SPACES_KEY` / `SPACES_SECRET` — from DO Spaces → Manage Keys

5. Trigger a redeploy: `doctl apps create-deployment d6a4b825-4d70-4dd4-8d71-04b354d36f43`

6. Smoke test checkout: visit `/pricing`, attempt checkout, verify the button is not "Coming Soon."

---

## CI protection

`.github/workflows/verify-build.yml` runs four guard steps on every push:

| Step | What it checks |
|---|---|
| Canonical spec passes env protection checks | All 52 required keys present |
| `live-app-spec.yaml` is rejected | Exits 1 (forbidden path) |
| `nursenest-core/.do/app.yaml` is rejected | Exits 1 (forbidden path) |
| `.do/app.yaml` (root) is rejected | Exits 1 (forbidden path) |

A PR that removes a required env key from the canonical spec, or that accidentally makes a forbidden file pass the guard, will **fail CI and cannot be merged**.

---

## App IDs and references

| Resource | Value |
|---|---|
| DO App ID | `d6a4b825-4d70-4dd4-8d71-04b354d36f43` |
| App name | `nursenest-core-next` |
| Primary domain | `nursenest.ca` |
| Canonical spec | `.do/app-nursenest-core-next.yaml` |
| Incident report | `docs/reports/digitalocean-env-persistence-p0.md` |

---

## Guard script reference

| Command | Use case |
|---|---|
| `npm run do:spec:guard` | Quick validation of canonical spec |
| `npm run do:deploy:dry` | Full validation + live diff, no deploy |
| `npm run do:deploy:execute` | Validated deploy (recommended) |
| `npm run do:spec:validate` | Guard + backup comparison |
| `npm run do:spec:backup` | Export + store a redacted backup |
| `npm run do:spec:diff` | Diff canonical vs stored backup |
| `node scripts/do-spec-guard.mjs <path>` | Validate any spec file (exits 1 if forbidden or incomplete) |
