# Engineering policy (repository & operations)

**Canonical:** this document. **Details:** `docs/REPO_COMMIT_POLICY.md` (Git size), `docs/SECRETS_AND_ENV.md`, `docs/CONTENT_STORAGE_ARCHITECTURE.md`, `docs/CONTENT_IMPORT_PIPELINE.md`, `docs/OBJECT_STORAGE_STRATEGY.md`, `docs/OPERATOR_DATA_IMPORT_AND_BUILD.md`, `docs/CONTENT_VERSIONING.md`.

---

## What may be committed

- Application **source** (Next app under `nursenest-core/`, shared tooling under `scripts/`).
- **Small, reviewed** config and schemas (Zod, Prisma `schema.prisma`, validators in `src/lib/content-pipeline/`).
- **Templates only:** `.env.example`, `.env.*.example` — placeholders, no real secrets (`nursenest-core/.env.example`, `nursenest-core/.env.playwright.example`).
- **Curated static assets** under `nursenest-core/public/` within size limits (`scripts/storage-guardrails.mjs`; non‑i18n cap ~512 KiB in strict mode).
- **Compiled i18n bundles** under `nursenest-core/public/i18n/` (exempt from default tracked-file byte cap in CI — see `scripts/ci/check-tracked-large-files.mjs`).
- **Tests and fixtures** — small, synthetic; no production PII or full banks.

---

## What must never be committed

- **Secrets:** API keys, `sk_*`, `whsec_*`, DB URLs with credentials, PEM/private keys, session cookies, production dumps of auth data.
- **Filled env files:** `.env`, `.env.local`, `.env.production`, `.env.playwright.local`, `.envrc` (use templates + host secrets).
- **Database files and dumps:** `*.sqlite`, `*.dump`, `pg_dump*.sql`, `*.backup`.
- **Bulk export / staging trees:** Replit exports, `export-output/`, `attached_assets/`, `data/replit-exports/`, `replit-export/`, `admin-export/`, `local-export/`, `downloads/` (as scratch), `artifacts/`, `local-backup/`.
- **Build/test artifacts:** `.next/`, `out/`, `coverage/`, Playwright `tests/e2e/.auth/`, large ad-hoc JSON reports.
- **Logs:** `*.log`, `logs/` (except tiny fixtures if ever needed — avoid).
- **Very large blobs** (default **15 MiB** per tracked file in CI) unless explicitly exempted in policy + CI allowlist.

---

## Git LFS — when to use

- **Rare binaries** that must be **versioned in Git** and cannot live in object storage or a build step (e.g. a regulated font or signed artifact).
- **Do not** use LFS for routine JSON, SQL text dumps, or question banks — use **DB + import pipeline** or **Spaces** instead (`docs/REPO_COMMIT_POLICY.md`).

---

## Object storage — when to use

- **Bytes at scale:** images, PDFs, video, large export ZIPs, import staging blobs.
- **Pattern:** DigitalOcean Spaces (S3-compatible); URLs or keys in Postgres — see `docs/OBJECT_STORAGE_STRATEGY.md` and `docs/storage-strategy.md`.
- **Premium/private files:** **not** `public-read`; use private objects + presigned GET or an authenticated, allowlisted proxy (`src/lib/storage/spaces-upload.ts` documents public-read limits).

---

## Database — when to use

- **Authoritative text and metadata** for lessons and questions at scale: `pathway_lessons`, `exam_questions`, `content_items`, progress, entitlements.
- **Not** for giant BLOBs of raw files — store files in object storage, **pointers** in Postgres.

---

## Large lesson / question files

- **Never** add new multi‑MB JSON corpora under `src/content/` without an explicit allowlist change (`scripts/ci/check-content-json-import-allowlist.mjs`).
- **Imports:** JSONL/streaming, chunked validation/upsert (`src/lib/content-pipeline/import-safeguards.ts`, `docs/CONTENT_IMPORT_PIPELINE.md`).
- **SoT:** Postgres for learner-facing content; thin catalog JSON only where bounded — `docs/CONTENT_STORAGE_ARCHITECTURE.md`.

---

## Exports, backups, logs

- **Exports/backups:** written to **gitignored** dirs or object storage; never commit machine-local `pg_dump` or app export trees.
- **Logs:** local only; use platform log drains in production — no log paste into the repo.
- **Operational reports:** regenerate from scripts; default output paths are gitignored (`artifacts/`, `*-export.jsonl`, etc.).

---

## Environment variables and secrets

- **Server-only** secrets — never `NEXT_PUBLIC_*` for keys (`docs/SECRETS_AND_ENV.md`).
- **Logging:** `safeServerLog` + `redactMetaForLog` / `maskDatabaseUrl` — not raw tokens or `DATABASE_URL`.
- **Production:** `runProductionEnvGuard`; optional `NN_STRICT_PRODUCTION_ENV=1`, `NN_STRICT_PUBLIC_ENV=1` where applicable.

---

## Imports — how to run safely

- Use **documented** scripts and **chunked** reads; respect `IMPORT_*` limits in `import-safeguards.ts`.
- **Confirm writes** on production-shaped targets (`--confirm-write` / env gates per pipeline).
- **Record runs:** `content_import_runs` + finish reports when using the versioning pipeline (`docs/CONTENT_VERSIONING.md`).
- **No** unbounded `readFile` of multi‑GB files into one buffer.

---

## Builds — avoid heavy data work

- **`RUN_HEAVY_BUILD_TASKS=false`** for normal production builds (`nursenest-core/package.json` `build` script; `next.config.ts`).
- **`next build`** must **not** run DB migrations or bulk imports (`docs/OPERATOR_DATA_IMPORT_AND_BUILD.md`).
- **Migrate** with `prisma migrate deploy` in the deploy phase, not inside the Next build.

---

## Enforcement & review

| Mechanism | What it enforces |
|-----------|------------------|
| `.gitignore` (root + `nursenest-core/.gitignore`) | Local + team: do not stage junk classes |
| `repo-hygiene` workflow | Gitleaks, large files, secret patterns, forbidden paths, content import allowlist, no client pathway JSON, catalog soft budget |
| `npm run ci:data-guardrails` (in `nursenest-core`) | Local mirror of data/bundle checks |
| Branch protection | Require `repo-hygiene / hygiene` on `main` (`docs/BRANCH_PROTECTION.md`) |

**Violations:** remove files from the index, rotate secrets if exposed, follow `docs/HISTORY_REMEDIATION.md` if history must be rewritten.

---

## Revision

Amend this file in PR when policy changes; keep CI scripts and `.gitignore` aligned in the same or a follow-up PR.
