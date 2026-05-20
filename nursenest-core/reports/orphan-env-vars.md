# Orphan and weakly-linked environment variables — audit

**Definition (used here):**  
- **Orphan (config):** Declared or expected in one plane (docs, root `package.json`, CI) but **not** wired where downstream expects (e.g. missing npm script).  
- **Orphan (doc):** Documented name with **no** or **stale** code reference, or code references a **missing** doc file.  
- **Orphan (code):** Read in code but **never** mentioned in operator docs (onboarding risk — not necessarily removable).

**No secret values.** Tags: **SAFE_FOR_AI** (safe for runbooks) vs **DEV_ONLY** (needs privileged context).

---

## A. Configuration orphans (high signal)

| Variable / artifact | Location | Purpose | Missing docs? | Runtime risk | Tag |
|---------------------|----------|---------|-----------------|--------------|-----|
| **`npm run env:validate`** | Root `package.json` → `npm --prefix nursenest-core run env:validate`; **`nursenest-core/package.json` has no `env:validate` script** | Intended centralized validation (`scripts/validate-env.mjs` exists) | Scripts missing from child package | CI / local **fails** at diagnose or npm step; validation never runs | **DEV_ONLY** |
| **`npm run prisma:health`** | Same pattern — root delegates; **no `prisma:health` in `nursenest-core/package.json`** | Health check (`scripts/check-prisma-health.mjs` exists) | Same | Same | **DEV_ONLY** |
| **`npm run env:validate:production`** | Root delegates to missing child script | Stricter production profile | Same | Operators think they ran production validation | **DEV_ONLY** |
| **`CI_DIAGNOSE_REQUIRED_SCRIPTS`** (verify-build) | `.github/workflows/verify-build.yml` lists `env:validate`, `prisma:health`, … | Guard script presence | N/A — **diagnose correctly flags MISSING** | If diagnose ever skipped, later step fails obscurely | **DEV_ONLY** |

**Recommended fix (documentation / backlog, not done here):** Add `env:validate`, `env:validate:production`, and `prisma:health` scripts to `nursenest-core/package.json` delegating to existing `scripts/*.mjs` / `*.mts`, **or** change CI `working-directory` + commands to run from repo root only.

---

## B. Documentation orphans

| Reference | Location | Issue | Tag |
|-----------|----------|-------|-----|
| **`.env.example` (`NN_BUILD_SAFE_MODE`)** | Comment in `src/lib/build/build-safe-mode.ts` | No committed `.env.example` at that path; closest is `env/production-safety.env.example` | **SAFE_FOR_AI** |
| **`NN_BUILD_SAFE_MODE` in `environment-reference.md`** | Present | Good — keep as canonical | **SAFE_FOR_AI** |
| **`PROD_DATABASE_URL`** | Still mentioned in warnings / drift audits | Intentionally **ignored** for reads — “orphan” in old deploys, not in code paths that connect | **SAFE_FOR_AI** |

---

## C. Code-only / thinly-documented operator toggles (sample)

High cardinality — full set from `rg 'process\.env\.[A-Z]' nursenest-core`. Below are **representative** categories; extend inventory via `env:validate --json` once scripts are fixed.

| Variable | Location (examples) | Purpose | Missing docs? | Runtime risk | Tag |
|----------|---------------------|---------|----------------|--------------|-----|
| `NN_MARKETING_HUB_*`, `RN_LESSONS_HUB_DIAGNOSTICS` | Marketing lessons hub pages | Verbose logging / caps | Partially in `environment-reference.md` | Log volume / PII in structured logs if misused | **DEV_ONLY** |
| `MARKETING_BLOG_SKIP_DB_FOR_BUILD` | Build-phase blog paths | Skip DB during static build | Check `docs/` / blog pipeline | Stale sitemap or counts if misunderstood | **DEV_ONLY** |
| `NN_POSTBUILD_NEXT_BUILD` | `package.json` `heroku-postbuild` | Split compile on DO buildpack | README / ARCHITECTURE_STORAGE | Wrong double-compile or skip | **DEV_ONLY** |
| `NN_POST_BUILD_PRUNE_NEXT_CACHE` | `post-build-prune.mjs` | Delete `.next/cache` after build | README | Slower cold builds if set | **SAFE_FOR_AI** |
| `NN_RUN_BUILDPACK_NEXT_BUILD` | `run-buildpack-build.mjs` | Force compile on buildpack pass | README fragment | Rare | **DEV_ONLY** |
| `EDUCATIONAL_ACCESS_DEBUG` | `resolve-educational-content-access.ts` | Entitlement diagnostics | Thin | Log noise | **DEV_ONLY** |
| `PLAYWRIGHT_*`, `E2E_*`, `QA_*` | Playwright configs, e2e specs | Test credentials / paths | Should **never** mirror prod secrets | Accidental prod use if names confused | **DEV_ONLY** |

---

## D. Tooling / platform noise (not application config)

| Variable | Notes | Tag |
|----------|-------|-----|
| `CI`, `GITHUB_ACTIONS`, `VERCEL`, `VERCEL_*`, `VITEST`, `TURBOPACK`, `NEXT_RUNTIME`, `NEXT_PHASE` | Platform-injected | **SAFE_FOR_AI** |
| `VSCODE_IPC_HOOK_CLI`, `CURSOR_AGENT`, `CURSOR_TRACE_ID`, `TERM_PROGRAM` | Local IDE / agent | **SAFE_FOR_AI** |
| `HOSTNAME`, `TMPDIR`, `PORT` | Process / container defaults | **SAFE_FOR_AI** |

---

## E. Duplicate semantic names (not orphans — link both)

| Canonical | Alias | Purpose |
|-----------|-------|---------|
| `AUTH_SECRET` | `NEXTAUTH_SECRET` | Session signing |
| `AUTH_URL` | `NEXTAUTH_URL` | Public origin |
| `DIRECT_URL` | `DATABASE_DIRECT_URL` | Prisma migrate direct |
| `POSTHOG_KEY` | `NEXT_PUBLIC_POSTHOG_KEY` | Server vs client analytics |
| `SENTRY_DSN` | `NEXT_PUBLIC_SENTRY_DSN` | Server vs browser |

**Risk:** Setting only alias in one plane (e.g. build has `NEXTAUTH_URL`, runtime has `AUTH_URL`) → **auth callback drift**.

---

## F. Summary

**Hard orphans:** Missing **`nursenest-core` npm scripts** for `env:validate` / `prisma:health` / `env:validate:production` while root + CI expect them.  
**Soft orphans:** Stale **`.env.example`** pointer; hundreds of **feature flags** known only through code search.
