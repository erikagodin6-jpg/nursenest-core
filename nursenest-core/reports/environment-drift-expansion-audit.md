# Environment drift and configuration consistency — expansion audit

**Scope:** NurseNest monorepo (`/`, `nursenest-core/`), GitHub Actions under `.github/workflows/`, root `Dockerfile`, `nursenest-core/docker-compose.e2e-db.yml`, Prisma `schema.prisma`, primary env docs and guards.  
**Method:** Static analysis only — `rg` for `process.env.*`, read `package.json` script graphs, Dockerfile stages, `production-env-guard.ts`, `env-bootstrap.ts`, `env-diagnostics.ts`, `validate-env-cli.mts`. **No secret values** are recorded below.

**Constraints:** Audit only — no runtime, auth, Stripe, or deployment changes.

---

## 1. Executive summary

| Finding | Severity | Tag |
|---------|----------|-----|
| **Root `package.json` delegates `env:validate` and `prisma:health` to `nursenest-core`, but `nursenest-core/package.json` does not define those scripts** — `npm run env:validate` from `nursenest-core` fails; `scripts/ci/diagnose-actions-environment.mjs` marks them **MISSING** and exits **2** when `CI_DIAGNOSE_REQUIRED_SCRIPTS` lists them (as in `verify-build.yml`). | **High** (CI / operator confusion; drift between intended and actual) | **DEV_ONLY** |
| **Prisma `datasource` requires `env("DIRECT_URL")`** — empty or unset `DIRECT_URL` at migrate / some CLI moments can fail or behave unlike pooled `DATABASE_URL` expectations. | **Medium** | **DEV_ONLY** |
| **Dockerfile build stage** sets a **synthetic** `DATABASE_URL` for `db:generate` only; runtime image carries **no** `DATABASE_URL` — correct for image, but operators must inject at platform runtime. | **Low** (documented pattern) | **SAFE_FOR_AI** |
| **Canonical vs legacy env names** (`AUTH_SECRET` / `NEXTAUTH_SECRET`, `AUTH_URL` / `NEXTAUTH_URL`, `DIRECT_URL` / `DATABASE_DIRECT_URL`, PostHog server vs `NEXT_PUBLIC_*`) — intentional aliases; drift risk when only one is set in one environment plane. | **Medium** | **SAFE_FOR_AI** |
| **Documentation references `.env.example`** for `NN_BUILD_SAFE_MODE` in `build-safe-mode.ts`; repo has **`env/production-safety.env.example`** but no committed root `.env.example` inventory. | **Low** | **SAFE_FOR_AI** |
| **~300+ distinct `process.env` keys** across app, scripts, tests — no single generated manifest checked into CI beyond `env:validate` (when present). | **Medium** (discovery / onboarding) | **DEV_ONLY** |

---

## 2. Configuration planes (where values must agree)

| Plane | What reads env | Drift risk |
|-------|----------------|------------|
| **Next build** | `next.config.mjs`, RSC imports that run at compile | `NEXT_PUBLIC_*` baked in; changing later without rebuild = client drift |
| **Next runtime** | `instrumentation`, route handlers, `getServerSide` patterns | Server secrets must exist on **run** component |
| **Docker build** | Multi-stage `Dockerfile` — `NODE_ENV`, `SKIP_I18N_PREBUILD`, synthetic `DATABASE_URL` for generate | Differs from DO/Vercel native build env |
| **Docker run** | `scripts/start-standalone.mjs`, Node | Needs full production set from platform |
| **GitHub Actions** | Per-job `env:` + `secrets.*` | Cron jobs use `PRODUCTION_CRON_BASE_URL`, `CRON_SECRET`, etc. — separate from app `NEXT_PUBLIC_APP_URL` |
| **Local / Playwright** | `playwright*.config.ts`, dotenv loaders | `AUTH_SECRET` / `NEXTAUTH_SECRET` fallbacks for local |
| **Prisma CLI** | `prisma-safe.mjs`, `run-prisma-with-env.mts` | Must see `DATABASE_URL` (+ `DIRECT_URL` for migrate) |

---

## 3. Docker vs application expectations

| Variable / topic | Dockerfile location | Purpose | Runtime risk | Missing docs? | Tag |
|------------------|---------------------|---------|----------------|---------------|-----|
| `NODE_ENV=development` → `production` between stages | Builder | npm ci vs compile profile | None if final stage is production | Partially in README / deploy doc | **SAFE_FOR_AI** |
| `SKIP_I18N_PREBUILD=1`, `NN_LOW_MEMORY_BUILD=1`, `NN_APP_PLATFORM_BUILD=true` | Builder | Aligns with CI low-memory profile | Build may skip i18n prebuild work vs local dev | `environment-reference.md` | **SAFE_FOR_AI** |
| `SENTRY_ENABLED=false` | Builder | Disables Sentry during image compile | Prod runtime should set explicitly if needed | Doc’d | **SAFE_FOR_AI** |
| `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?...` | Builder **only** | Prisma generate against **non-running** placeholder URL pattern | **None at runtime** — not copied to runner | Dockerfile comment worth linking from runbook | **SAFE_FOR_AI** |
| `PORT=8080`, `HOSTNAME=0.0.0.0` | Runner | DO / container listen | Wrong PORT in platform = health check fail | Common PaaS knowledge | **SAFE_FOR_AI** |
| `NODE_MAX_OLD_SPACE_SIZE_MB=768` (runner) vs `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` / `NODE_OPTIONS` (builder) | Both | Different lifecycle — **naming asymmetry** | Low — different concerns | Easy to confuse in support tickets | **SAFE_FOR_AI** |
| `RUN_HEAVY_BUILD_TASKS` | Set `false` in Dockerfile build | README discusses `true` for full redirect graph in some hosts | SEO/redirect completeness vs memory | `README.md`, `environment-reference.md` | **SAFE_FOR_AI** |

---

## 4. Prisma alignment

| Item | Location | Notes | Tag |
|------|----------|-------|-----|
| `url = env("DATABASE_URL")` | `prisma/schema.prisma` | Single supported URL per `env-bootstrap.ts` comments | **SAFE_FOR_AI** |
| `directUrl = env("DIRECT_URL")` | Same | **Required key in schema** — value may be derived via `applyDirectDatabaseUrlFromEnv` when unset in some paths; operators should still set explicit direct URL for pooler setups | **DEV_ONLY** |
| `PROD_DATABASE_URL` | Referenced in diagnostics / docs as **ignored** | Prevents accidental “wrong variable” deploy | **SAFE_FOR_AI** |
| `PRISMA_USE_PGBOUNCER`, `PRISMA_STATEMENT_TIMEOUT_MS`, etc. | `env-bootstrap.ts` | Tunables; omission uses defaults | **DEV_ONLY** |

---

## 5. CI workflows (representative)

| Workflow | Notable env / secrets | Purpose |
|----------|----------------------|---------|
| `verify-build.yml` | `SKIP_I18N_PREBUILD`, `NN_LOW_MEMORY_BUILD`, `CI` | Gates merge; runs `env:validate`, `db:validate-url-shape`, `ci:verify` |
| `prisma-migrate.yml` | `secrets.DATABASE_URL` | Migrations against real DB |
| `scheduled-cron-*.yml` | `PRODUCTION_CRON_BASE_URL`, `CRON_SECRET` | External HTTP cron — must match app `CRON_SECRET` |
| `production-reliability-check.yml` | `NURSENEST_PRODUCTION_BASE_URL`, `NURSENEST_RELIABILITY_SECRET` | Synthetic probes |

**Drift:** Cron base URL secret name ≠ `NEXT_PUBLIC_APP_URL` — intentional separation; document mapping for on-call.

---

## 6. Central guards (good patterns)

| Artifact | Role |
|----------|------|
| `src/lib/env/production-env-guard.ts` | Production issue collection (DB, auth, Stripe, Spaces, cron) |
| `src/lib/env/env-diagnostics.ts` | CLI profiles `dev` / `ci` / `production`, `NEXT_PUBLIC_*` secret-shaped scan |
| `scripts/validate-env-cli.mts` + `validate-env.mjs` | Entry for validation |
| `src/lib/db/env-bootstrap.ts` | URL tuning, `DATABASE_DIRECT_URL` → `DIRECT_URL` legacy map |

---

## 7. Undocumented or thinly documented secrets (names only)

Do **not** commit values. These **names** should appear only in secret managers:

`AUTH_SECRET`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CRON_SECRET`, `NURSENEST_RELIABILITY_SECRET`, `CHECKOUT_BILLING_CONTEXT_SECRET`, `TRIAL_FINGERPRINT_SECRET`, `RESEND_API_KEY`, `SPACES_KEY`, `SPACES_SECRET`, `UPSTASH_REDIS_REST_TOKEN`, `TWILIO_AUTH_TOKEN`, `TURNSTILE_SECRET_KEY`, `POSTHOG_PERSONAL_API_KEY`, `AI_INTEGRATIONS_OPENAI_API_KEY`, `GEMINI_API_KEY`, `SENTRY_AUTH_TOKEN`, `ADMIN_LEARNER_QA_SECRET`, `NN_ADMIN_QUESTION_BULK_IMPORT_SECRET`, E2E `*_PASSWORD` vars, etc.

**Risk:** Any of these in `NEXT_PUBLIC_*` are flagged by `collectNextPublicSecretSurfaceIssues` — **runtime + compliance**.

---

## 8. Acceptance

Environment **drift surfaces** (package script graph vs CI, Docker vs runtime vs Prisma, legacy aliases, build-time inlining of `NEXT_PUBLIC_*`, cron vs app URLs, missing aggregate `.env.example`) are **documented** in this file and the two companion reports.
