# DigitalOcean App Platform — runtime diagnostics cleanup (deploy checklist)

**Purpose:** Ship bootstrap log hygiene, runtime env contract verification, deployment freshness checks, optional memory diagnostics, and Stripe env inventory tooling. **Do not paste secret values into tickets, PRs, or this file** — use DigitalOcean encrypted runtime env fields only.

**Code scope (this release):**

- `scripts/start-standalone.mjs` — `bootstrap_healthz_intercepted` only while `handlersReady` is false (`/healthz` and `/readyz` 503); parent still answers `/healthz` on public `PORT` by design.
- `scripts/runtime-env-guard-bootstrap.mjs` + `scripts/lib/runtime-env-contract.mjs` — earliest-entrypoint runtime contract logging, `DATABASE_URL` / `AUTH_SECRET` enforcement, `AUTH_URL` / `NEXTAUTH_URL` validation, cache-backed DO verification context in missing-env failures.
- `../scripts/verify-digitalocean-runtime.mjs` — compares repo spec vs live App Platform config, checks `DATABASE_URL` attachment under `services.web.envs`, validates scope/type, and reports deployment freshness / rollback state.
- `scripts/smoke-runtime-env.mjs` + `package.json` → `npm run smoke:runtime-env`.
- `scripts/runtime-release-checklist.mjs` + `package.json` → `npm run release:runtime-checklist`.
- `src/lib/observability/runtime-memory-diag.ts` — opt-in `NN_MEMORY_DIAGNOSTICS=1` → `perf` / `runtime_memory_diag` logs.
- `src/lib/lessons/pathway-lesson-catalog-sync.ts` — memory diag hook after first pathway catalog build.
- `src/lib/seo/sitemap-static-xml.ts` — memory diag around pathway lesson sitemap collector.
- `scripts/list-stripe-runtime-env-keys.mts` + `package.json` → `npm run list:stripe-runtime-env-keys`.

**Related tests (no production behavior change beyond logging):** standalone bootstrap smoke / `verify-standalone-artifact` paths that assert startup sequence; re-run targeted Node tests if you touch `start-standalone.mjs`.

---

## Pre-deploy (local / CI)

| Step | Command | Result (last run) |
| --- | --- | --- |
| Critical TS | `npm run typecheck:critical` | Pass |
| DO runtime contract + freshness | `npm run verify:do-runtime` | Pass/fail with live `doctl` evidence; writes `tmp/do-runtime-verification.json` |
| Stripe key inventory | `npm run list:stripe-runtime-env-keys` | Prints **key names** + placeholders (never paste real secrets into logs) |
| Optional bundled preflight | `npm run release:runtime-checklist` | Runs the three commands above, plus optional sitemap/homepage checks when `RUN_OPTIONAL_RUNTIME_RELEASE_CHECKS=1` |

---

## DigitalOcean — web component runtime env (names only)

Set each variable in **App Platform → your app → Components → Web (or runtime) → Environment variables**. Values come from Stripe Dashboard (Price IDs, API keys, webhook signing secret).

**Core billing (required for live checkout / webhooks):**

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**`STRIPE_PRICE_*` — one Stripe Price ID per key (47 keys from `npm run list:stripe-runtime-env-keys` / `eachStripePriceMatrixRow`):**

- [ ] `STRIPE_PRICE_ALLIED_IMAGING_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_IMAGING_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_IMAGING_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_IMAGING_YEARLY`
- [ ] `STRIPE_PRICE_ALLIED_MLT_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_MLT_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_MLT_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_MLT_YEARLY`
- [ ] `STRIPE_PRICE_ALLIED_OTA_PTA_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_OTA_PTA_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_OTA_PTA_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_OTA_PTA_YEARLY`
- [ ] `STRIPE_PRICE_ALLIED_PARAMEDIC_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_PARAMEDIC_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_PARAMEDIC_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_PARAMEDIC_YEARLY`
- [ ] `STRIPE_PRICE_ALLIED_PHARMTECH_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_PHARMTECH_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_PHARMTECH_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_PHARMTECH_YEARLY`
- [ ] `STRIPE_PRICE_ALLIED_RRT_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_RRT_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_RRT_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_RRT_YEARLY`
- [ ] `STRIPE_PRICE_ALLIED_SOCIALWORK_3MONTH`
- [ ] `STRIPE_PRICE_ALLIED_SOCIALWORK_6MONTH`
- [ ] `STRIPE_PRICE_ALLIED_SOCIALWORK_MONTHLY`
- [ ] `STRIPE_PRICE_ALLIED_SOCIALWORK_YEARLY`
- [ ] `STRIPE_PRICE_LVN_LPN_3MONTH`
- [ ] `STRIPE_PRICE_LVN_LPN_6MONTH`
- [ ] `STRIPE_PRICE_LVN_LPN_MONTHLY`
- [ ] `STRIPE_PRICE_LVN_LPN_YEARLY`
- [ ] `STRIPE_PRICE_NEW_GRAD_6MONTH`
- [ ] `STRIPE_PRICE_NEW_GRAD_MONTHLY`
- [ ] `STRIPE_PRICE_NEW_GRAD_YEARLY`
- [ ] `STRIPE_PRICE_NP_3MONTH`
- [ ] `STRIPE_PRICE_NP_6MONTH`
- [ ] `STRIPE_PRICE_NP_MONTHLY`
- [ ] `STRIPE_PRICE_NP_YEARLY`
- [ ] `STRIPE_PRICE_RN_3MONTH`
- [ ] `STRIPE_PRICE_RN_6MONTH`
- [ ] `STRIPE_PRICE_RN_MONTHLY`
- [ ] `STRIPE_PRICE_RN_YEARLY`
- [ ] `STRIPE_PRICE_RPN_3MONTH`
- [ ] `STRIPE_PRICE_RPN_6MONTH`
- [ ] `STRIPE_PRICE_RPN_MONTHLY`
- [ ] `STRIPE_PRICE_RPN_YEARLY`

If you use **shared allied** pricing via env, the matrix may resolve to a single shared key — still set every key the script lists so checkout cells do not 400. For **regional** Stripe products, add any extra `STRIPE_PRICE_*` keys from `src/lib/pricing/regional-pricing-map.ts` / your Stripe config (not duplicated by the list script).

**Optional diagnostics (post-deploy investigation only):**

- [ ] `NN_MEMORY_DIAGNOSTICS=1` — enables heap/RSS snapshots around heavy loads; **omit** unless investigating memory.

**Do not** raise `NODE_MAX_OLD_SPACE_SIZE_MB` unless logs show a **V8 heap limit** failure (not RSS alone).

---

## Post-deploy verification

**Logs (DigitalOcean runtime / `doctl apps logs`):**

- Earliest bootstrap logs show `standalone_parent_pre_hydrate`, `standalone_parent_post_hydrate`, and `standalone_parent_contract_validated` with presence-only booleans for `DATABASE_URL`, `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXTAUTH_URL`, `AUTH_URL`, `PORT`, and `HOSTNAME`.
- No `database_url_absent_after_standalone_hydrate` / recurring parent exit from missing `DATABASE_URL` (unless regression).
- No crash loop (child exit → parent exit) unrelated to deploys.
- After `handlers_ready`, **no steady stream** of `startup_watchdog bootstrap_healthz_intercepted` on `/healthz` probes (logging is gated pre-ready).
- After Stripe envs are set: no `[nursenest-core] stripe checkout env: STRIPE_SECRET_KEY is missing` or long missing-`STRIPE_PRICE_*` lists from `pricing-map` startup logs.
- `npm run verify:do-runtime` must report the same active deployment you are inspecting in logs. If `latest deployment != active deployment`, treat the runtime as stale until a fresh deployment reaches `ACTIVE`.

**HTTP (from a trusted operator machine):**

```bash
cd nursenest-core
npm run smoke:runtime-env

# or explicitly
BASE_URL=https://www.nursenest.ca npm run smoke:runtime-env
curl -sS -D- https://www.nursenest.ca/healthz
curl -sS -D- https://www.nursenest.ca/readyz
curl -sS -D- https://www.nursenest.ca/ -o /tmp/nursenest-home.html
```

Expect `200` on `/healthz`; `/readyz` and `/` per your current production policy.

---

## Operational notes

- **`/healthz` on public port:** Served by the bootstrap parent immediately; not a sign the child failed once readiness has flipped.
- **DATABASE_URL / bootstrap:** Treated as resolved only after `npm run verify:do-runtime` shows the expected live spec and a fresh non-rollback active deployment, and `npm run smoke:runtime-env` passes against that same deployment.
- **Regenerate this STRIPE_PRICE section:** `npm run list:stripe-runtime-env-keys` (keep checklist in sync when the pricing matrix changes).

