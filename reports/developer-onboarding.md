# NurseNest — Developer onboarding

Audience: engineers joining the team (including external contractors). This document is **read-only orientation**; it does not grant access by itself.

---

## 1. Project overview

**NurseNest** is a production **Next.js** application (App Router) for nursing exam preparation: lessons, question bank, adaptive CAT-style practice, linear practice exams, flashcards, blogs, marketing hubs, subscriptions, and admin/staff tooling. The product optimizes for **safety, small diffs, and behavior preservation** on learner-facing routes.

Canonical engineering expectations live in:

- `AGENTS.md` (repo root) — agent and human contributor rules  
- `.cursor/rules/*.mdc` — automated guardrails (performance, i18n, lesson library safety, semantic colors, production governance)  
- `docs/` — deeper architecture and restoration maps where present  

---

## 2. Repository structure (high level)

| Path | Role |
|------|------|
| `nursenest-core/` | **Primary application** — Next.js app, `src/app`, APIs, Prisma schema, most scripts. DigitalOcean `source_dir` historically points here. |
| `shared/` | Shared packages/types used across the monorepo (when present). |
| `client/` | Legacy or parallel client assets (Vite-era scripts may reference `npm run dev:client` from app `package.json`). |
| `scripts/`, `script/` | Root-level build, i18n, and verification scripts invoked from CI or `nursenest-core`. |
| `Dockerfile` (repo root) | Multi-stage image: installs under `nursenest-core/`, runs `db:generate` with a **dummy** `DATABASE_URL` for Prisma client generation only, then `heroku-postbuild` + `build:deploy`. |
| `.cursor/` | Cursor rules and optional tooling. |
| `reports/` | Runbooks, onboarding, and phase handoffs (this folder). |

**Important:** Most day-to-day commands run from **`nursenest-core/`** unless a script documents otherwise.

---

## 3. Tech stack

- **Runtime:** Node 20 (see `Dockerfile`)  
- **Framework:** Next.js (App Router, RSC/streaming patterns)  
- **Language:** TypeScript  
- **ORM:** Prisma (PostgreSQL)  
- **Auth:** NextAuth (see env vars below)  
- **Payments / tiers:** Stripe integration (env-gated; do not paste secrets)  
- **Analytics:** PostHog and related observability (feature-flag / event patterns in codebase)  
- **Testing:** Node test runner (`node --test`), Playwright (`npm run test:e2e` variants)  
- **i18n:** Compiled shards / pipeline (`prebuild` runs `i18n:compile` and validators)  

---

## 4. How to run locally

1. **Clone** the repo and open the **`nursenest-core`** directory for app work.  
2. **Install:** `npm ci` (from `nursenest-core/`; follow team policy on lockfile).  
3. **Environment:** Copy team-provided env template (if any) into `.env.local` **without committing**. Run `npm run env:check` from `nursenest-core/` (delegates to root `scripts/check-required-env.mjs`) to verify **names** are present—not values.  
4. **Prisma:** `npm run db:generate` — uses `scripts/prisma-safe.mjs` (postinstall also runs generate).  
5. **Dev server:** Primary script is `npm run dev` (see `package.json` — uses `tsx server/index.ts` with memory helpers). There is also `npm run dev:client` for Vite on port 5000 when working on that surface.  
6. **Production-like:** `npm run heroku:local` or `npm run start` after a full build (heavier).

If the database is unreachable, many learner routes intentionally **fail closed** or return **degraded** payloads—see `reports/do-not-break-surfaces.md` before “fixing” behavior.

---

## 5. Required environment variables (names only)

Never paste real URLs, tokens, or private keys into tickets, chat, or commits.

**Baseline (from `scripts/check-required-env.mjs`):**

| Variable | Purpose (non-secret description) |
|----------|----------------------------------|
| `DATABASE_URL` | Prisma connection string to PostgreSQL (pooled URL common in production). |
| `DIRECT_URL` | Non-pooled connection for migrations/long transactions (Prisma convention). |
| `NEXTAUTH_SECRET` | Signing secret for auth session. |
| `NEXTAUTH_URL` | Canonical base URL for auth callbacks (must match deployed host in prod). |

**Additional (discover in codebase / team vault):**

- Stripe keys and webhook secrets  
- OAuth client IDs/secrets (if enabled)  
- PostHog / Sentry / other observability keys  
- OpenAI or other LLM keys for **admin** blog and AI surfaces  
- Any `NN_*` or feature flags documented in deploy runbooks  

Use **1Password / DO App Platform env UI / Vercel** (whichever the org uses)—not email or Slack for secrets.

---

## 6. Common commands (`nursenest-core/`)

| Command | Use |
|---------|-----|
| `npm run dev` | Local development server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Full Next build (heavy; includes lesson index steps) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:status` | Prisma migrate status (when DB configured) |
| `npm run env:check` | Required env **names** present |
| `npm run audit:core-apis` | DB connectivity + flashcard/practice/CAT pool smoke (no HTTP server) |
| `npm run verify:sitemap` / `npm run test:sitemap` | SEO / sitemap checks |
| `npm run test:homepage` | Marketing home streaming contract tests |
| `npm run test:pathway-lessons` | Large pathway lesson suite |
| `npm run test:e2e` | Playwright (requires env + browsers) |

See `nursenest-core/package.json` for the full matrix (content audits, blog quality, allied health, paywall security tests, etc.).

---

## 7. Build and deploy flow (conceptual)

1. **Prebuild:** Toolchain guard, i18n compile, validators (`npm run prebuild` as part of CI or local full build).  
2. **Build:** `next build` with memory caps (`scripts/ensure-node-memory.mjs`, `NODE_OPTIONS` in Docker).  
3. **Post-build:** `build:deploy:postbuild` writes git meta, asserts deploy git state, verifies Dockerfile npm scripts, standalone static, prune.  
4. **Container:** Root `Dockerfile` builds from `/app/nursenest-core` with `NN_APP_PLATFORM_BUILD` and related flags.  
5. **Runtime:** Production `npm run start` via `scripts/start-standalone.mjs` (standalone Next output).

Always run **`npm run verify:dist`** / **`verify:standalone-artifact`** when touching build output expectations.

---

## 8. DigitalOcean deployment notes

- **App source:** Production app source is under **`nursenest-core/`** (aligns with DO `source_dir` in historical configs).  
- **Database:** Managed PostgreSQL is typical; use **pooled** `DATABASE_URL` for the app and **`DIRECT_URL`** for migrations.  
- **Health checks:** Should hit a lightweight route—coordinate with team (avoid auth-wall-only paths).  
- **Secrets:** Configure in DO App Platform **encrypted** env vars; rotate via platform, not git.  
- **Migrations:** Run from a trusted environment (CI job or controlled release step) with `DIRECT_URL`. Never run destructive SQL against production without a runbook.  
- **Verification:** `npm run verify:do-runtime` exists in `package.json`—use when validating DO-specific assumptions after infra changes.

---

## 9. Prisma and database notes

- **Schema:** `nursenest-core/prisma/schema.prisma` — treat migrations as **high risk**; phase one should not widen schema scope without explicit approval.  
- **Generate vs migrate:** `db:generate` is safe in CI; `migrate deploy` requires credentials and review.  
- **Timeouts / safety:** Lesson and hub queries use pagination and timeouts in many paths—preserve those invariants (see `.cursor/rules/global-engineering-constraints.mdc`).  
- **Drift:** If `schema.prisma` changes without a migration in PR, treat as **red flag**—see `reports/developer-access-checklist.md` and governance rules.

---

## 10. Known build issues (general)

- **Memory:** Next build can OOM on small machines; Docker sets `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` / `NODE_OPTIONS`. Local: close other apps or use `NN_LOW_MEMORY_BUILD` patterns if documented.  
- **i18n prebuild:** Failing `i18n:compile` or `root-prebuild-i18n-validate` blocks `prebuild`—fix translations/shards before chasing unrelated TS errors.  
- **Lesson indexes:** `run-lesson-indexes-for-build.mjs` runs during `build`; stale indexes can fail validation scripts (`verify:lesson-indexes`).  
- **Prisma in Docker:** Image uses a **dummy** `DATABASE_URL` only for **`prisma generate`**, not for runtime data.  
- **Windows/WSL:** Prefer WSL2 or Linux for parity with production shell paths.

---

## 11. Cursor / SSH stability notes

- **Remote SSH:** Large `node_modules` and `.next` can cause slow sync—use `.gitignore` consistently and avoid committing build artifacts.  
- **Multi-root:** If the workspace includes repo root + `nursenest-core`, ensure the **terminal cwd** matches the script you run.  
- **Long tasks:** `npm run build` and full `test:pathway-lessons` can exceed default UI timeouts—run in a persistent terminal session.  
- **Agent mode:** Follow `AGENTS.md`—surgical diffs, no silent global copy or nav changes without task approval.  
- **Supplement:** See `reports/cursor-remote-stability.md` in this folder if present for team-specific remote dev notes.

---

## 12. Testing commands (quick reference)

| Goal | Command |
|------|---------|
| Type safety | `npm run typecheck` |
| Core study API smoke (DB) | `npm run audit:core-apis` |
| Sitemap / robots | `npm run test:sitemap`, `npm run verify:sitemap` |
| Homepage / marketing layout | `npm run test:homepage` |
| Paywall policy unit tests | `npm run audit:paywall-security` |
| Blog pipeline (subset) | `npm run blog:quality:test` |
| E2E | `npm run test:e2e` (requires env + install browsers) |

Start narrow, expand only when the task touches those surfaces.

---

## 13. Where to go next

1. `reports/phase-one-scope.md` — what to prioritize first.  
2. `reports/do-not-break-surfaces.md` — non-negotiables.  
3. `reports/developer-access-checklist.md` — how to get access safely.  
4. `reports/first-week-plan.md` — suggested cadence.  

Questions should go to the **engineering lead / on-call** named in your contract—not inferred from this doc alone.

**Truthpack:** If `.vibecheck/truthpack/` is present in your clone, run `vibecheck truthpack` or read the relevant JSON before changing routes, copy, tiers, or env names—see `CLAUDE.md` / truthpack-first protocol.
