# Secrets and environment variables — zero-tolerance policy

Full repository policy: **`docs/ENGINEERING_POLICY.md`** (repository root).

This document tells contributors **what must never be committed** and **where secrets belong**. CI runs secret scanning (Gitleaks) and tracked-file checks; see `.github/workflows/repo-hygiene.yml`.

## Never commit

- **Filled** `.env`, `.env.local`, `.env.production`, `.env.playwright.local`, or any file that contains real credentials.
- **Database connection strings** with real hostnames, usernames, or passwords (including `DATABASE_URL`, `PROD_DATABASE_URL`).
- **API keys and signing secrets**: Stripe `sk_*`, `whsec_*`, OAuth client secrets, `AUTH_SECRET`, `CRON_SECRET`, `RESEND_*`, `SPACES_SECRET`, JWT signing material, webhook secrets.
- **Private keys**: PEM blocks (`-----BEGIN … PRIVATE KEY-----`), `.pem`, `.p12`, SSH private keys.
- **Session cookies**, **refresh tokens**, **Authorization headers**, or **full request dumps** from production.
- **Production data dumps**: SQL dumps, full DB exports, PII-heavy CSVs, or “content dumps” under `data/` unless explicitly approved and scrubbed.
- **Screenshots** of dashboards that show keys, tokens, or live customer data.

## Safe to commit

- **Templates only**: `nursenest-core/.env.example`, `nursenest-core/.env.playwright.example`, `env/production-safety.env.example` — use obvious placeholders (`REPLACE_ME`, `USER:PASSWORD@HOST`, `sk_test_REPLACE_ME`).
- **Tests** may use obviously fake strings (`sk_test_security_contract`, `whsec_test_contract_secret`) in `*.test.ts` files; do not copy real keys into tests.
- **Documentation** must use placeholders; avoid realistic-looking passwords in markdown or shell examples.

## Runtime rules

1. **Server-only secrets** — Never prefix secrets with `NEXT_PUBLIC_`. The build inlines those into the browser bundle.
2. **Logging** — Use `safeServerLog` / `redactMetaForLog` from `src/lib/env/redact-secrets.ts`. Do not `console.log` raw `Authorization`, cookies, tokens, or full `DATABASE_URL`.
3. **Database URLs in logs** — Use `maskDatabaseUrl` / `logDatabaseEnvOnce` patterns; effective URLs are masked in production logs.
4. **Production env** — `runProductionEnvGuard` (see `src/lib/env/production-env-guard.ts`) and `NN_STRICT_PRODUCTION_ENV=1` for strict startup failure on critical gaps.

## Local setup

1. Copy `nursenest-core/.env.example` → `.env.local` (or your host’s secret UI).
2. For Playwright: copy `nursenest-core/.env.playwright.example` → `.env.playwright.local` with **staging-only** test users — never production accounts.

## Redaction helpers

- `src/lib/env/redact-secrets.ts` — `redactConnectionString`, `redactOpaqueSecret`, `redactMetaForLog`, `redactAuthorizationHeaderValue`.
- `src/lib/db/database-env.ts` — `maskDatabaseUrl` for Postgres URLs.

## If you leaked a secret

1. **Rotate** the credential immediately (Stripe, DB password, OAuth, etc.).
2. **Remove** the secret from the branch; do not rely on “revert” alone if it reached `main` — the value exists in git history.
3. See `docs/HISTORY_REMEDIATION.md` for history rewrite and force-push policy when required.
