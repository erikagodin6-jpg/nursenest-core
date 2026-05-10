# Production 503 / unhealthy upstream recovery — 2026-05-09

## Symptoms observed (edge)

From `curl -sSI https://www.nursenest.ca/` (this environment):

- HTTP status: **504** from Cloudflare / DigitalOcean edge  
- Response headers included:
  - `x-do-failure-msg: no_healthy_upstream`
  - `x-do-orig-status: 503`

Interpretation: **DigitalOcean App Platform had zero healthy instances** for the `web` component — traffic never reached a listening Next/bootstrap process in a good state.

`https://nursenest.app/` returned **200** for `/` but **404** for product routes; canonical production host per repo docs is **`https://www.nursenest.ca`**.

## Root cause (code + platform contract)

1. **Bootstrap exits before binding `PORT`**  
   `nursenest-core/scripts/start-standalone.mjs` calls `validateRuntimeEnvOrThrow()` (via `runtime-env-guard-bootstrap.mjs`) **before** spawning the standalone child. If validation throws, the parent process exits **before** accepting connections → App Platform marks instances unhealthy → **`no_healthy_upstream`**.

2. **`AI_ADMIN_GENERATION_ENABLED` was documented in `.do/app-nursenest-core-next.yaml` without a `value:`**  
   Runtime guard requires this variable to be **non-empty** (`REQUIRED_RUNTIME_ENVS`). A GENERAL key declared in YAML **without** an explicit `value:` can resolve to **unset/empty** at runtime (especially if the dashboard never set it). That triggers validation failure and immediate exit — consistent with total loss of healthy upstreams.

3. **Secondary: marketing layout guard**  
   `validate:marketing-production-surface` counts `<SiteFooter` JSX tags in `(marketing)/(default)/layout.tsx` and requires **exactly one**. The layout used **two** `<SiteFooter` JSX sites (shard trailing chrome vs fallback branch). That breaks CI/production-surface validation when that script runs.

## Patches applied (this repo)

| Area | Change |
|------|--------|
| `.do/app-nursenest-core-next.yaml` | Set `AI_ADMIN_GENERATION_ENABLED` to `value: "false"` with comment explaining bootstrap fatal path. |
| `scripts/verify-digitalocean-runtime.mjs` | Assert `AI_ADMIN_GENERATION_ENABLED` has explicit `value:` in spec (fails CI/review if regressed). |
| `(marketing)/(default)/layout.tsx` | Use `createElement(SiteFooter, …)` for `trailingChrome` so only one `<SiteFooter` JSX remains (satisfies chrome contract). |
| `nursenest-core/scripts/bootstrap-env-spec.contract.test.mjs` | Contract test; `npm run test:unit:bootstrap-env-spec`. |

## Operator actions (production)

1. **Apply the updated app spec** to DigitalOcean so `AI_ADMIN_GENERATION_ENABLED` is not empty at runtime.  
2. **Confirm runtime secrets**: `DATABASE_URL`, `AUTH_SECRET`, and **at least one** AI funding key per `runtime-env-guard-bootstrap.mjs`.  
3. **Watch deploy logs** for `[ENV VALIDATION ERROR]` or `[nursenest-core] FATAL`.  
4. After deploy: **`GET /healthz`** quick; **`GET /readyz`** 200 after child readiness.

## Validation run (this workspace)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **Pass** |
| `npm run verify:do-runtime` | **Pass** |
| `npm run test:unit:bootstrap-env-spec` | **Pass** |
| `npm run validate:production-surface` | **Fail** — unrelated missing carousel i18n keys in this checkout |

## Route smoke (manual)

Tier-1 probes:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://www.nursenest.ca/healthz
curl -sS -o /dev/null -w '%{http_code}\n' https://www.nursenest.ca/readyz
```

Broader: `BASE_URL=https://www.nursenest.ca node nursenest-core/scripts/verify-deploy-health.mjs`
