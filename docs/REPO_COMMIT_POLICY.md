# Repository commit policy

**Canonical policy (what / where / operations):** `docs/ENGINEERING_POLICY.md`.

This document focuses on **Git size, exemptions, and known debt**. CI enforces parts of it (see `.github/workflows/repo-hygiene.yml`). **Operator runbook** (build vs migrate vs import): `docs/OPERATOR_DATA_IMPORT_AND_BUILD.md`.

## Allowed in Git

- **Source code** (application, scripts, infra-as-code) and **small, reviewable** configuration.
- **Templates and examples**: `.env.example`, documented placeholders (no live credentials).
- **Curated static assets** that are intentionally versioned (images, fonts) when they are small enough for normal Git and reviewed like code.
- **Compiled i18n bundles** under `nursenest-core/public/i18n/` (exempt from the default tracked-file size limit in `scripts/ci/check-tracked-large-files.mjs` because they are deployment artifacts with a defined pipeline).

## Do not commit

- **Secrets**: API keys, tokens, passwords, private keys, session cookies, Stripe live keys, database URLs with credentials, OAuth client secrets, or anything that grants production access.
- **Local environment files**: `.env`, `.env.local`, `.env.production`, `.env.*.local`, `.envrc` (use `.env.example` + secure distribution).
- **Logs and diagnostics**: `*.log`, `logs/`, heap profiles, crash dumps, large ad-hoc JSON reports from local runs.
- **Machine-specific IDE/tooling state** that is not shared team configuration (see `.gitignore`).
- **Database files and dumps**: `*.sqlite`, `*.dump`, `pg_dump*.sql`, ad-hoc `*.backup` from local machines.
- **Export / staging directories**: Replit exports, bulk imports, `export-output/`, `admin-export/`, and similar (use documented import pipelines and checkpoints instead).
- **Build and test artifacts**: `.next/`, `out/`, `dist/`, `build/`, `coverage/`, Playwright `tests/e2e/.auth/`, Playwright reports, etc.
- **Very large blobs** (default CI limit **15 MiB** per tracked file, except documented exemptions). Prefer object storage, the database, or generation at build time—not Git history.

## Git LFS

Use **Git LFS only when** a binary or large asset must be versioned in Git and cannot live in storage or a build step. Do not use LFS as a default for JSON or text dumps; fix the workflow instead.

## Known debt (tracked today)

| Path | Issue | Direction |
|------|--------|-----------|
| `scripts/english-content.json` | ~39 MiB; exceeds default max | Remove from the tree or replace with a generated fetch from approved storage; then remove from Git history (see `docs/HISTORY_REMEDIATION.md`). Until then CI emits a **warning** only so the branch stays green. |

## Related

- Operator runbook (build / migrate / import / memory): `docs/OPERATOR_DATA_IMPORT_AND_BUILD.md`
- Branch protection expectations: `docs/BRANCH_PROTECTION.md`
- History / secret leak remediation: `docs/HISTORY_REMEDIATION.md`
- Optional Code Owners template: `docs/CODEOWNERS.template`
