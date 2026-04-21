# Operator guide: data, imports, builds, and deploys

Use this runbook to avoid **OOM builds**, **accidental giant Git commits**, and **production fragility** from content pipelines. **Policy:** `docs/ENGINEERING_POLICY.md`. It complements `docs/REPO_COMMIT_POLICY.md`, `docs/CONTENT_IMPORT_PIPELINE.md`, and `docs/CONTENT_STORAGE_ARCHITECTURE.md`.

---

## 1) Responsibility split

| Phase | What runs | Where | Notes |
|-------|-----------|-------|--------|
| **Install** | `npm ci` | CI / laptop | Lockfile only. |
| **Generate** | `npm run db:generate` (`prisma generate`) | CI + deploy | Before `build` if schema changed. |
| **Migrate** | `npm run db:deploy` (`prisma migrate deploy`) | Deploy job / operator | **Never** inside `next build`. |
| **Build** | `npm run build` (then on DO: `npm run build:deploy`) | CI / DO / Vercel | Node buildpack runs `build`; `build:deploy` verifies standalone, syncs static, **`post-build-prune`** (keeps `.next/cache` by default for DO/Heroku build cache) — **no** second `next build` (see `.do/app-nursenest-core-next.yaml`). Default **`RUN_HEAVY_BUILD_TASKS=false`** (see `next.config.ts`). |
| **Start** | `npm run start` | Runtime | No bulk imports. |
| **Import / seed** | `tsx scripts/...`, `npm run import:*`, `db:seed*` | Operator / batch VM | Use **`IMPORT_*` chunk limits** in `src/lib/content-pipeline/import-safeguards.ts`. Never pipe multi‑GB files into a single Node buffer. |
| **Audit / export** | `npm run audit:*`, `ops:*` | CI optional / operator | Read-only or scoped writes; outputs often **gitignored**. |

---

## 2) Build-time guardrails (already enforced)

- **`RUN_HEAVY_BUILD_TASKS`**: Production builds default to **`false`** so `next build` does not eagerly load full SEO redirect graphs. Set to `true` only when you intentionally regenerate redirects and accept higher memory (release tooling).
- **`SKIP_I18N_PREBUILD`**: `npm run build` sets **`1`** so `build:prechecks` skips heavy i18n validations during compile (faster CI/deploy); run `i18n:validate-production` / `i18n:validate-chrome` in a separate quality job when needed.
- **`BUILD_WEBPACK_PARALLELISM`**: Optional integer (default **`1`** in `next.config.ts`) for webpack `parallelism` and `experimental.cpus`, capped by CPU count. Use **`2`–`4`** on larger runners with adequate `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` to shorten compile time; raise gradually and watch for OOM.
- **Node heap**: `package.json` sets `NODE_OPTIONS=--max-old-space-size=3584` for `next build` (override via `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`); `typecheck` uses a higher cap.

---

## 3) What must not land in Git or client bundles

- **No** Replit export trees, DB dumps, `pg_dump*.sql`, local `*.sqlite`, bulk ZIP staging — see `.gitignore` and `scripts/ci/check-forbidden-tracked-paths.mjs`.
- **No** new imports from `@/content/pathway-lessons/*.json` except the **allowlisted** catalog/map files — see `scripts/ci/check-content-json-import-allowlist.mjs`. Large lesson bodies belong in **Postgres** / **Spaces**, not new JSON in `src/content/`.
- **No** `'use client'` modules importing `@/content/pathway-lessons/*` — see `scripts/ci/check-no-client-pathway-json.mjs`.
- **Tracked file size**: default **15 MiB** max per file (`scripts/ci/check-tracked-large-files.mjs`); i18n bundles exempt with warning path for known debt (`scripts/english-content.json`).

---

## 4) Memory-safe content tasks

- Use **streaming / line-based** JSONL for imports; respect **`IMPORT_VALIDATE_CHUNK`**, **`IMPORT_DB_UPSERT_CHUNK`**, **`IMPORT_BATCH_MAX_LINES`** (`import-safeguards.ts`).
- **Confirm writes** on production-shaped targets (`--confirm-write` / env flags) per import scripts — do not rely on accidental defaults.
- **Checkpoints** for long jobs live under gitignored dirs — see `CONTENT_IMPORT_PIPELINE.md`.

---

## 5) CI jobs (repo hygiene)

Workflow: `.github/workflows/repo-hygiene.yml`

- Gitleaks, large-file check, secret-pattern scan (**existing**).
- **`check-forbidden-tracked-paths.mjs`** — blocked paths/suffixes.
- **`check-content-json-import-allowlist.mjs`** — pathway + topic-map JSON allowlist.
- **`check-no-client-pathway-json.mjs`** — client bundle guard.

Local: `cd nursenest-core && npm run ci:data-guardrails` (from app package).

---

## 6) Deploy ordering (typical)

1. Build container / run CI (**no** DB migration inside `next build`).
2. Run **`prisma migrate deploy`** against the target DB.
3. Start app (`npm run start` → `node scripts/start-standalone.mjs` for this package’s **standalone** output).
4. Run **imports / backfills** as separate jobs with resource limits — not on the web process.

### Standalone bootstrap vs direct bind (App Platform / Docker)

- **Default:** `start-standalone.mjs` listens on **`PORT`** (e.g. 8080) and proxies to Next on a **loopback-only** internal port (child gets `PORT=<internal>` + `HOSTNAME=127.0.0.1`).
- **Ops — bypass proxy (explicit opt-in):** set **`NN_DIRECT_STANDALONE=1`** (or `true` / `yes`) **and** **`NN_ALLOW_DIRECT_STANDALONE=1`** so the script **`spawnSync`s** the same child stack (`start-standalone-runtime.cjs` + `.next/standalone/.../server.js`) with **inherited** `PORT` / `HOSTNAME` — Next then binds the platform port directly (no public bootstrap **`/healthz`**). **Rollback:** unset both vars (or remove only `NN_ALLOW_DIRECT_STANDALONE`) to return to the bootstrap proxy.
- **`NN_BYPASS_BOOTSTRAP=1`:** deprecated for mode selection; it may still enable **readiness watchdog bypass** in bootstrap mode when not combined with `NN_DIRECT_STANDALONE` (see `scripts/resolve-bootstrap-mode.mjs`). Do not set it together with **`NN_DIRECT_STANDALONE`** (conflict forces bootstrap).

---

## 7) Known debt / risks

- **`scripts/english-content.json`** (~39 MiB): tracked with **CI warning** only — plan removal or generation from storage (`docs/REPO_COMMIT_POLICY.md`).
- **Pathway `catalog.json`**: bundled for catalog sync — keep **small**; DB is the scale path for full lesson bodies (`CONTENT_STORAGE_ARCHITECTURE.md`).
