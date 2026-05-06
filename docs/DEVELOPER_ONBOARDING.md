# Developer onboarding — NurseNest Core

Audience: senior engineers auditing and stabilizing the production Next.js app. This complements `AGENTS.md`, `CLAUDE.md`, and docs under `nursenest-core/docs/`.

## Project overview

NurseNest is a nursing exam prep product: pathway-scoped lessons, question banks, adaptive CAT-style practice, flashcards, subscriptions (Stripe), and staff admin tools. The **production Next.js application** lives in **`nursenest-core/`** (DigitalOcean `source_dir`). The repository root also contains legacy Express/Vite pieces, shared scripts, and i18n tooling—**most learner-facing work is under `nursenest-core/`**.

## Tech stack

| Layer | Stack |
|-------|--------|
| App framework | Next.js 16 (App Router), React 19, TypeScript |
| Auth | NextAuth v5 beta, `@auth/prisma-adapter` |
| Database | PostgreSQL, Prisma ORM |
| Payments | Stripe (checkout, webhooks, reconciliation helpers) |
| i18n | Compiled shards + marketing/educational overlays (see `docs/i18n-architecture.md`, `nursenest-core/docs/i18n-runtime-deployment.md`) |
| Observability | PostHog, Sentry (`@sentry/nextjs`), structured server logs |

## Monorepo layout (high level)

| Path | Role |
|------|------|
| `nursenest-core/` | **Primary app**: `src/app`, `src/lib`, Prisma schema, `package.json` scripts for build, tests, content audits |
| `nursenest-core/src/app/(student)/app/` | Authenticated **learner** shell (`/app/*`) |
| `nursenest-core/src/app/(marketing)/` | Public marketing + pathway hubs (`/[locale]/[slug]/[examCode]/...`) |
| `nursenest-core/src/app/(admin)/admin/` | Staff admin UI |
| `nursenest-core/src/app/api/` | API routes (learner, admin, cron, public) |
| `script/`, `scripts/` (repo root) | i18n compile, build orchestration, backups, audits |
| `docs/` (repo root) | Cross-cutting engineering docs |
| `nursenest-core/docs/` | App-specific runbooks, security, content, deployment |

## Main app routes

- **Marketing home / SEO**: default marketing layouts under `(marketing)`; locale-prefixed routes where applicable.
- **Pathway hubs**: `[locale]/[slug]/[examCode]` — overview, `/lessons`, `/questions`, pricing-adjacent surfaces (see `nursenest-core/docs/pathway-hub-architecture.md`).
- **Learner app**: `/app`, `/app/lessons`, `/app/questions`, `/app/practice-tests`, flashcard surfaces, account, command center, guided study, etc.
- **Admin**: `/admin` and `/api/admin/*` — **server-enforced** DB-backed staff session + path RBAC (`nursenest-core/docs/admin-permissions.md`).

Registry-driven exam URLs are documented in `nursenest-core/docs/exam-product-architecture.md` (`getExamPathwayByRoute`, `EXAM_PATHWAYS`).

## RN / RPN / NP / Allied — learning system overview

- **Pathway model**: Each exam track is an `ExamPathwayDefinition` (`id`, `countrySlug`, `roleTrack`, `examCode`, `stripeTier`, **`contentExamKeys`** for question-bank scoping). Source segments: `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-*.ts`, composed in `exam-pathways-catalog.ts`.
- **Hub taxonomy / lesson grouping**: `pathway-learning-structure.ts`, taxonomy in `src/lib/taxonomy/` (see `.cursor/rules/nursing-taxonomy-locked.mdc`).
- **RN vs RPN (Canada)**: e.g. `us-rn-nclex-rn` vs `ca-rpn-rex-pn` — different `contentExamKeys`, tiers, and hub components (`NclexRnLessonsHub` vs `NclexPnLessonsHub` with REx-PN framing).
- **NP**: Multiple NP pathway rows may share `TierCode.NP` for billing; **content** is split by `learnerPath` / pathway id and `contentExamKeys` (see exam product doc §4).
- **Allied**: Pathways like `us-allied-core` / `ca-allied-core` with allied-specific hubs and entitlements (`TierCode.ALLIED`, `alliedCareer` on access scope where applicable).

## CAT vs practice exams

- **Shared engine**: Adaptive selection and scoring live under `src/lib/exams/` (`cat-engine.ts`, `cat-adaptive-policy.ts`) and `src/lib/practice-tests/cat-session.ts`.
- **CAT “exam simulation”**: Fixed presentation mode `catPresentationMode: "exam_simulation"`, feedback `catExamFeedbackMode: "test"` — **no per-item rationale during the session** (contract: `src/components/student/practice-adaptive-setup.test.ts`).
- **Practice CAT / study**: `catExamFeedbackMode: "study"` — rationales after items; optional `catStudyAwaitingContinue` in adaptive state for review gating (`cat-types.ts`, `advanceCatPracticeTest`).

## Flashcards

- **APIs**: `src/app/api/flashcards/**`, `api/verified-study/**` (verified study decks).
- **Pools**: Tier + pathway + publish gates align with questions (`questionAccessWhere`, `questionAccessWhereWithPathway`); inventory helpers in `src/lib/flashcards/`. See `flashcard-pool-exam-fallback.test.ts` for exam-column scope behavior.

## Lesson source of truth

- **Catalog / DB**: Published pathway lessons are Prisma-backed (`PathwayLesson` and related); normalized indexes built for list performance (`npm run build:lesson-indexes`, verify scripts in `package.json`).
- **Marketing vs app**: Marketing lesson pages compose `PathwayLessonDetailPageBody`; full teaching depth is entitlement-gated (`canViewFullPathwayLesson`, `visibleSectionsForLesson`). See `nursenest-core/docs/content-source-of-truth-audit.md`, `npm run content:source-of-truth:check`.

## Entitlement and paywall

- **Canonical chain**: `getUserAccess(userId)` (DB: subscription + trial + staff override) → `resolveEntitlement` / `accessScopeFromUserAccess` → route handlers and SQL helpers (`questionAccessWhere`, etc.).
- **Never gate on JWT alone** for premium data; APIs re-check DB (`nursenest-core/docs/production-entitlement-validation.md`).
- **Learner pages**: `resolveEntitlementForPage`, `requireSubscriberSession` for APIs; paywall UI components where `hasAccess` is false.
- **Pathway subscription match**: `pathway-entitlements.ts`, `subscriptionCoversPathwayBase` (see `pathway-entitlements.test.ts`).

## Admin dashboard

- **UI**: `(admin)/admin/*` layouts call `requireAdmin()` (`src/lib/auth/guards.ts`) — staff from DB + `adminRouteGateDecision` / `admin-path-policy.ts`.
- **APIs**: `requireAdmin(req)` from `src/lib/admin/ensure-admin.ts` — **always pass `req`** for correct path RBAC.
- **Audit**: `admin-audit-log.ts`, optional `NN_ADMIN_AUDIT_GET`.

## Deployment — DigitalOcean

- Spec and runtime checks: `scripts/verify-digitalocean-runtime.mjs` (expects `nursenest-core/`, Dockerfile, `.do/app-nursenest-core-next.yaml`). Run from repo root: `npm run verify:do-runtime` (where wired).
- App build: `nursenest-core` uses `next build` + post-build deploy scripts (`build:deploy:postbuild`, `production:preflight`). See `nursenest-core/docs/deploy-deterministic-docker.md`, `nursenest-core/docs/operations-droplet-runtime-handoff.md`.

## Environment variables (local and production)

Authoritative lists: `nursenest-core/docs/SECRETS_AND_ENV.md`, `nursenest-core/docs/environment-reference.md`. Minimum for local auth/database (also enforced by `scripts/check-required-env.mjs` when run via `npm run env:check` from app):

- `DATABASE_URL`, `DIRECT_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

Production additionally needs Stripe keys, cron secrets, storage credentials, etc.—see SECRETS doc. **Do not commit secrets.**

## Known fragile areas

- **TypeScript drift**: `npm run typecheck` may surface pre-existing errors outside the files you touch; fix surgically or ticket (see `reports/pre-developer-check-results.md`).
- **Large catalogs**: Lesson/question lists must stay paginated and bounded (see `.cursor/rules/rn-lesson-library-safety.mdc`).
- **i18n**: Run `npm run i18n:compile` / validate scripts before merging marketing copy changes.
- **Stripe webhooks**: Idempotency and ordering; see `nursenest-core/docs/stripe-webhook-production-operations.md`.
- **Admin RBAC**: New `/api/admin/*` routes must use `requireAdmin(req)` and correct tier allowlists.

## Commands to run before making changes

From **`nursenest-core/nursenest-core/`** (the Next app):

```bash
npm install
npm run env:check          # if working on auth/DB routes
npm run db:generate        # Prisma client
npm run typecheck
npm run audit:paywall-security
npm run verify:no-cross-tier-leakage
npm run test:pathway-lessons   # or a narrower test:* script for your area
```

From **repo root** (when touching i18n or unified build):

```bash
npm run i18n:compile
npm run i18n:validate
```

Full CI-style app check (heavy): `npm run ci:verify` inside `nursenest-core/nursenest-core/` — may require env and time.

## Related reading

| Topic | Doc |
|-------|-----|
| Entitlements (manual QA) | `nursenest-core/docs/production-entitlement-validation.md` |
| Admin RBAC | `nursenest-core/docs/admin-permissions.md` |
| Exam / pathway config | `nursenest-core/docs/exam-product-architecture.md` |
| Pathway lesson hubs | `nursenest-core/docs/pathway-hub-architecture.md` |
| Security checklist | `nursenest-core/docs/deployment-security-checklist.md` |
| Legacy restoration order | `docs/legacy-restoration-map.md` |
