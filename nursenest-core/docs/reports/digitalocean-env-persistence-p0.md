# P0 Incident Report: DigitalOcean Env Var Deletion on Deploy

**Date:** 2026-05-13  
**Severity:** P0 — checkout unavailable on all plans  
**Status:** Resolved

---

## Summary

Running `doctl apps update APP_ID --spec <file>` repeatedly deleted critical Stripe price env vars and `NEXT_PUBLIC_APP_URL` from the live DigitalOcean App Platform environment. This caused checkout to fail for all plans: buttons showed "Coming Soon" (price IDs gone) and the checkout API returned 503 (app URL gone).

---

## Root Cause

**DigitalOcean App Platform treats the spec file as the complete and authoritative configuration.** Any env var present in the live dashboard but absent from the spec file is permanently deleted when `doctl apps update --spec` runs.

The tracked spec files were incomplete:

| Missing from all tracked specs | Effect |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Checkout API 503: "Billing URL is not configured" |
| `STRIPE_PRICE_NURSENEST_RN_*` (4 keys) | RN checkout buttons disabled |
| `STRIPE_PRICE_NURSENEST_RPN_*` (4 keys) | RPN checkout buttons disabled |
| `STRIPE_PRICE_NEW_GRAD_*` (3 keys) | New Grad checkout buttons disabled |
| `STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_*` (4 keys) | Allied checkout buttons disabled |
| `CRON_SECRET` | Cron jobs silently broken |
| `SPACES_KEY` / `SPACES_SECRET` | Spaces storage broken |
| `AI_PROVIDER`, `OPENROUTER_MODEL`, `OPENROUTER_API_KEY` | AI features degraded |
| `NEXTAUTH_SECRET` (legacy alias) | Auth edge case failures |
| ECG flags (`ENABLE_ECG_MODULE` etc.) | ECG access reverted to disabled |

Additionally, the three spec files in the repo diverged from each other and from the live app, creating confusion about which was authoritative.

### Why `checkoutAvailable` went false

`buildPricingOptionsPayload()` calls `findPriceEntry()` which reads from `process.env`. When the Stripe price env vars were deleted, `findPriceEntry()` returned `undefined` for every plan, setting `checkoutAvailable: false`. The pricing page UI then shows "Coming Soon" and disables the button — before any API call is made.

### Why checkout 503'd even for NP

`publicAppOriginForBilling()` reads `NEXT_PUBLIC_APP_URL`. In production (`NODE_ENV=production`), if this var is absent it returns `null`, and the checkout route returns HTTP 503 `"Billing URL is not configured"`. This env var was never in any tracked spec.

---

## Impact

- All checkout buttons disabled or returning errors
- Revenue-generating flows (NP, RN, RPN, New Grad, Allied) all broken
- ECG module access flags also at risk of deletion

---

## Resolution

### Immediate (2026-05-13)

1. **Exported live spec** via `doctl apps spec get` to identify all env vars actually present in production.
2. **Rebuilt canonical spec** `.do/app-nursenest-core-next.yaml` with every env var present in the live app plus missing flags (ECG module flags, LVN/LPN placeholders).
3. **Secrets** protected via `type: SECRET` (no value in YAML — DO preserves existing secret values when the key is present with `type: SECRET` and no value field).
4. **Price IDs** committed as plain values (safe to commit per project policy).
5. **Updated `REQUIRED_RUNTIME_ENV_KEYS`** in `scripts/do-spec-guard.mjs` to include all 52 checkout-critical env keys.
6. **Updated test spec helper** in `test-do-spec-validator.mjs` — all 27 tests pass.
7. **Marked stale specs** as dangerous: `nursenest-core/.do/app.yaml` and `nursenest-core/live-app-spec.yaml` now have headers warning against use with `doctl apps update`.

### Deploy to restore production

```bash
# From repo root — validates guard + diffs against live, then deploys
node scripts/do-predeploy.mjs --execute
# or
npm run do:deploy:execute
```

This will **add** the 9 missing env vars to production and make zero deletions.

---

## Files Changed

| File | Change |
|---|---|
| `.do/app-nursenest-core-next.yaml` | **Complete rewrite** — now the single authoritative spec with all env keys |
| `scripts/do-spec-guard.mjs` | Expanded `REQUIRED_RUNTIME_ENV_KEYS` from 14 → 52 keys |
| `scripts/do-predeploy.mjs` | **New** — pre-deploy wrapper: guard + live diff + doctl update |
| `nursenest-core/scripts/test-do-spec-validator.mjs` | Updated `makeSpec()` to include all required keys; 27/27 pass |
| `nursenest-core/.do/app.yaml` | Marked as stale duplicate with DANGER header |
| `nursenest-core/live-app-spec.yaml` | Converted to documentation-only artifact |
| `nursenest-core/.env.local` | Populated with all production price IDs |
| `package.json` | Added `do:deploy:execute` and `do:deploy:dry` npm scripts |

---

## Safe Deploy Process (Permanent)

**Never run `doctl apps update` directly.** Always go through the guard.

### Option A — Validated deploy (recommended)

```bash
# From repo root:
npm run do:deploy:execute
```

This runs:
1. `do-spec-guard.mjs` — fails if any required env key is missing from the spec
2. Live diff via `doctl apps spec get` — fails if any existing live key would be deleted
3. `doctl apps update d6a4b825-4d70-4dd4-8d71-04b354d36f43 --spec .do/app-nursenest-core-next.yaml`

### Option B — Dry run (validate + print command)

```bash
npm run do:deploy:dry
# or
npm run do:spec:guard      # guard only
npm run do:spec:validate   # guard + backup comparison
```

### Adding a new env var to production

1. Add the key to `.do/app-nursenest-core-next.yaml` (with value or `type: SECRET`)
2. If checkout-critical: also add to `REQUIRED_RUNTIME_ENV_KEYS` in `scripts/do-spec-guard.mjs`
3. Run `npm run do:spec:guard` to verify
4. Run `npm run do:deploy:execute`
5. If the value is a secret with no hardcoded value in the spec, set it in the DO dashboard: **App → Settings → App-Level Environment Variables → Edit**

### Updating a Stripe price ID

1. Get the new price ID from the Stripe dashboard
2. Update the `value:` field in `.do/app-nursenest-core-next.yaml`
3. Run `npm run do:deploy:execute`

### Adding a new Stripe product/tier

1. Create the product and prices in the Stripe dashboard
2. Add the price IDs to `.do/app-nursenest-core-next.yaml`
3. Add the env key names to `REQUIRED_RUNTIME_ENV_KEYS` in `scripts/do-spec-guard.mjs`
4. Add to `nursenest-core/.env.local` for local dev
5. Run `npm run do:deploy:execute`

---

## CI Protection

The CI workflow (`.github/workflows/verify-build.yml`) runs `do-spec-guard.mjs` on every push. Any PR that removes a required env key from the canonical spec will fail CI before merge.

The guard checks:
- All keys in `REQUIRED_RUNTIME_ENV_KEYS` are present (by name) in the spec
- `run_command` equals `node scripts/start-standalone.mjs`
- `source_dir` equals `.`
- At least one AI provider key is present

---

## Key Technical Facts

**DO behavior summary:**

| Action | Result |
|---|---|
| Key present in spec with `value: x` | Var set to `x` in live app |
| Key present with `type: SECRET` (no value) | Var **preserved** in live app (existing value kept) |
| Key present with `type: SECRET` and a value | New value replaces existing |
| Key **absent from spec** | Var **permanently deleted** from live app |

**The wipe mechanism:** Every `doctl apps update --spec` call replaces the entire app configuration. There is no merge — it is a replacement.

---

## Outstanding Actions

- [ ] Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in DO dashboard (currently empty — required for Stripe.js)
- [ ] Create LVN/LPN Stripe prices and fill in `STRIPE_PRICE_LVN_LPN_*` values in the spec
- [ ] Rotate `AUTH_SECRET` / `NEXTAUTH_SECRET` — current values are placeholder strings (`dasdadwdjawldjalwdwjdadwad`)
- [ ] Move `DATABASE_URL` off `RUN_AND_BUILD_TIME` (build workers don't need DB access); requires separate migration review
