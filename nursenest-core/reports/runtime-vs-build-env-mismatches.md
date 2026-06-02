# Runtime vs build environment mismatches — audit

**Goal:** Surfaces where **build-time** resolution differs from **runtime** behavior, causing silent drift (especially `NEXT_PUBLIC_*`, Prisma client bake-in, and Docker stages). **No values disclosed.**

---

## 1. Next.js `NEXT_PUBLIC_*` (build-inlined vs runtime)

| Variable pattern | Where set matters | What breaks if only runtime is updated | Missing docs? | Runtime risk | Tag |
|------------------|-------------------|----------------------------------------|---------------|--------------|-----|
| `NEXT_PUBLIC_APP_URL` | **Build** component for client bundle + server | Stripe return URLs / absolute links in client components can disagree with server | Documented in `environment-reference.md` | **Wrong billing return domain** in client-only paths | **DEV_ONLY** |
| `NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_SENTRY_*` | **Build** for browser SDK defaults | Analytics off or wrong project after deploy without rebuild | Partially doc’d | Blind spots in client errors | **DEV_ONLY** |
| `NEXT_PUBLIC_*` secret-shaped | `env-diagnostics.ts` scans all `NEXT_PUBLIC_` | Accidental leak of API keys to browser | Guard exists | **Critical** compliance | **DEV_ONLY** |
| `NEXT_PUBLIC_VERCEL_*` | Often from platform at build | Release attribution drift | Low | Cosmetic / support | **SAFE_FOR_AI** |

**Rule:** Treat any change to `NEXT_PUBLIC_*` as **requires rebuild** for full consistency.

---

## 2. `next.config.mjs` evaluation

| Concern | Details | Tag |
|---------|---------|-----|
| Config loads at **compile** | `env` exports in config (if any) freeze at build | **SAFE_FOR_AI** |
| Low-memory heuristics | `NN_LOW_MEMORY_BUILD`, `CI`, `GITHUB_ACTIONS`, host RAM | CI matches Docker builder flags partially | **SAFE_FOR_AI** |

---

## 3. Docker multi-stage vs production runtime

| Topic | Build image | Run image | Mismatch risk | Tag |
|-------|-------------|-----------|---------------|-----|
| `DATABASE_URL` | Synthetic URL for `prisma generate` only | **Unset in Dockerfile** — must inject | App fails to boot if platform forgets | **DEV_ONLY** |
| `SKIP_I18N_PREBUILD=1` | Set in builder | Not copied to runner | Runner uses built artifacts — **OK** | **SAFE_FOR_AI** |
| `SENTRY_ENABLED=false` in build | Disables upload-heavy paths | Production should set `SENTRY_ENABLED=true` + tokens on **runtime**/**build** as per Sentry docs | Missing Sentry on prod if only build had flags | **DEV_ONLY** |
| `NODE_ENV` | `production` in final build + run | Aligns | OK | **SAFE_FOR_AI** |

---

## 4. Prisma: generate vs migrate vs app

| Phase | `DATABASE_URL` | `DIRECT_URL` | Mismatch |
|-------|----------------|--------------|----------|
| `prisma generate` (Dockerfile) | Placeholder OK | May be unset if generate does not touch DB | **Low** |
| `prisma migrate deploy` | Real pooled or direct | **Should be direct** for transaction mode | **High** if migrate uses pooler URL only | **DEV_ONLY** |
| App runtime | Pooled URL typical | `directUrl` for migrations / some introspection | Connection errors if schema requires unsettable direct | **DEV_ONLY** |

---

## 5. GitHub Actions vs app runtime

| CI env | Production app | Drift |
|--------|----------------|-------|
| Often **no** `DATABASE_URL` on verify-build | Real DB | **Intentional** — CI uses `db:validate-url-shape` without connecting |
| `CRON_SECRET` in scheduled workflows | App `CRON_SECRET` | **Must match** Bearer — separate secret store entries easy to desync | **DEV_ONLY** |
| `PRODUCTION_CRON_BASE_URL` | `NEXT_PUBLIC_APP_URL` / canonical host | Different names — on-call must map | **SAFE_FOR_AI** |

---

## 6. Local Playwright vs production

| Variable | Build/runtime note | Risk | Tag |
|----------|-------------------|------|-----|
| `AUTH_SECRET` / `NEXTAUTH_SECRET` fallback strings in `playwright*.config.ts` | Local only | Must not ship to prod | **DEV_ONLY** |
| `PLAYWRIGHT_SKIP_WEB_SERVER` | CI vs local | Wrong server target | **DEV_ONLY** |
| `BASE_URL` | Default `localhost` | E2E hits wrong host | **DEV_ONLY** |

---

## 7. Instrumentation and startup order

| File | Behavior | Mismatch |
|------|----------|----------|
| `src/instrumentation.ts` (referenced from docs) | DB validation + production env guard at cold start | If `NN_STRICT_PRODUCTION_ENV` unset, issues are **warnings** not exit | Operators assume strict when not | **DEV_ONLY** |

---

## 8. Marketing / static generation

| Variable | Effect | Tag |
|----------|--------|-----|
| `NEXT_PHASE === phase-production-build` | Some layout branches skip work | Different HTML vs runtime first paint rare | **SAFE_FOR_AI** |
| `MARKETING_BLOG_SKIP_DB_FOR_BUILD` | DB-less build paths | Content staleness vs live site | **DEV_ONLY** |

---

## 9. Summary matrix

| Layer | Typical mistake | Severity |
|-------|-----------------|----------|
| Client bundle | Updated `NEXT_PUBLIC_*` on dashboard only | **High** |
| Cron jobs | Rotated `CRON_SECRET` in app but not in GitHub secret | **High** |
| Migrations | Only `DATABASE_URL` pooler, weak `DIRECT_URL` | **High** |
| Docker | Assumed image contains `.env` | **Critical** boot failure |
| CI | Assumed `env:validate` ran (script missing in package) | **Medium** false confidence |

---

## 10. Acceptance

**Runtime vs build** mismatch surfaces (`NEXT_PUBLIC` inlining, Docker stage env, Prisma URL roles, CI vs prod secret naming, Playwright defaults) are **fully documented** for operator and engineering follow-up. No configuration was changed in this audit.
