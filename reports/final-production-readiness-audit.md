# NurseNest — final production readiness audit

**Sweep date:** 2026-05-06  
**Repo:** `/root/nursenest-core` (Next.js app in `nursenest-core/`, mobile in `apps/mobile` + `packages/nursenest-mobile-shared`).  
**Truthpack:** `.vibecheck/truthpack/` — **not present in this clone**; tier names, pricing, and canonical copy were **not** re-derived from truthpack for this document. Regenerate locally with `vibecheck truthpack` before treating any product enumeration as authoritative.

**Companion artifacts:** `final-risk-register.md`, `final-launch-blockers.md`, `recommended-post-launch-roadmap.md`.

---

## Executive embedding (required)

| Track | Notes |
|--------|--------|
| **Prioritized blockers** | (1) Full `nursenest-core` `tsc` / `predeploy:check` red — see § Validation. (2) One failing test in `test:seo-sitemap` suite (blog pipeline contract). (3) `production:preflight` failed here on DB TLS (`self-signed certificate in certificate chain`) — treat as **environment** until verified on DO runner with correct CA bundle. |
| **Stabilization roadmap estimate** | **~1–3 engineering days** to clear current TypeScript errors (focused files: `public-flashcard-landing.ts`, `openai-chat-completions.ts` / `blog-ai-provider`, `blog-control-panel-generation.ts`, `api/questions/route.ts`). **+0.5–1 day** for SEO sitemap test regression. **Parallel:** release-gate Playwright on staging with paid creds (half day operator time). |
| **Immediate vs deferred** | **Immediate:** fix TS errors blocking strict CI / predeploy; confirm DB SSL in production preflight environment; triage failing SEO sitemap subtest. **Deferred (post-launch OK with gates):** Sentry native symbolication on mobile, FlashList migration if profiling demands, query persistence Phase 2 — per `docs/mobile-production-audit-report.md`. |

---

## System-by-system checklist

Legend: **G** green in this sweep · **P** partial / gated · **R** risk or failed automated check · **S** skipped / not run · **Doc** cite existing doc instead of duplicating.

### Web (Next.js `nursenest-core/`)

| Item | Status | Notes |
|------|--------|--------|
| TypeScript (full) | **R** | `npm --prefix nursenest-core run typecheck` — errors in API route, blog AI bridge, SEO flashcard landing (see validation log). |
| TypeScript (critical subset) | **G** | `typecheck:critical` passed. |
| Build config / memory guards | **G** | `npm run audit:build-stability` — webpack concurrency, lesson index hooks, `typescript.ignoreBuildErrors` documented as intentional with strict `tsc` elsewhere. |
| Production build | **S** | Not executed end-to-end (full `tsc` red; would rely on `ignoreBuildErrors` — see risk). Partial path: `verify:dist` / `verify:standalone-artifact` after a green build. |
| Hydration / large client surfaces | **P** | Repo ships `report:hydration-risk-routes`, `audit:large-client-components`; run on cadence per `docs/legacy-restoration-map.md` hygiene. |

### Mobile (`apps/mobile`, `packages/nursenest-mobile-shared`)

| Item | Status | Notes |
|------|--------|--------|
| Typecheck | **G** | `npm run mobile:typecheck` (root) — OK. |
| Lint | **G** | `npm run mobile:lint` — OK. |
| Hardening / observability | **P** | **Doc:** `docs/mobile-production-audit-report.md` — error boundaries, logging, PostHog, Sentry partial, feature flags stub, network recovery. |
| Store readiness | **P** | Same doc — bundle IDs, deep links, icons noted as placeholder-grade until store assets finalized. |

### SEO & public indexability

| Item | Status | Notes |
|------|--------|--------|
| Sitemap / robots contracts | **P** | `npm --prefix nursenest-core run test:seo-sitemap` — **27 pass, 1 fail** (`not ok 9` — blog long-form builder contract). |
| `verify:seo-indexability` | **S** | Started; **no output within ~4 min** in this runner — likely network-heavy; re-run locally/staging with timeout budget. |
| Programmatic SEO / allied | **Doc** | `content:audit-allied-seo`, `verify:sitemap`, `verify:robots` scripts exist in `nursenest-core/package.json` for operator runs. |

### i18n

| Item | Status | Notes |
|------|--------|--------|
| Compile / validate pipeline | **P** | Root `prebuild` / `i18n:compile` wired; full `i18n:ci` not re-run in this sweep (time). **Doc:** `docs/i18n-architecture.md` (referenced from workspace rules). |

### Auth & admin

| Item | Status | Notes |
|------|--------|--------|
| Session + DB-backed access | **G** (design) | **Doc:** `docs/entitlements-web-mobile-audit.md` — NextAuth + `getUserAccess`, staff bypass documented. |
| Admin RBAC | **G** (design) | Server-enforced patterns described in same audit + `AGENTS.md`. |
| Contract tests | **G** | `audit:paywall-security` passed (includes `subscriber-ui-state-shared.contract.test.ts`). |

### Subscriptions & entitlements

| Item | Status | Notes |
|------|--------|--------|
| Stripe → Postgres mirror | **G** (design) | **Doc:** `docs/entitlements-web-mobile-audit.md` — webhooks, no runtime Stripe for gating. |
| Paywall policy tests | **G** | `audit:paywall-security` — 12 tests pass. |
| Doc freshness | **P** | Entitlements audit states no in-repo native app; **mobile app now exists** under `apps/mobile` — treat audit as **mostly** accurate for **API parity**, not inventory of clients. |

### Lessons, flashcards, CAT, practice

| Item | Status | Notes |
|------|--------|--------|
| Lesson library safety | **P** | Rules + `rn-lesson-library-safety.mdc` — pagination, no unbounded payloads; contract suite `test:pathway-lessons` in package.json for deep runs. |
| Flashcards / CAT | **P** | Unit scripts (`test:unit:flashcards`, `paid-user-cat-smoke` in release gate) — not all executed this sweep; release gate **Doc:** `nursenest-core/docs/RELEASE_QA.md`. |

### Admin / allied / NP / RN / PN surfaces

| Item | Status | Notes |
|------|--------|--------|
| Allied completeness audits | **P** | `audit:allied-completeness` and content scripts in `package.json` — operator-scheduled. |
| International / RN | **P** | `test:international-rn`, `audit:international-rn` available. |

### Analytics

| Item | Status | Notes |
|------|--------|--------|
| Web | **P** | PostHog / observability patterns per integrations; verify keys in deploy env (**no env values in repo**). |
| Mobile | **P** | **Doc:** `docs/mobile-production-audit-report.md` — `EXPO_PUBLIC_POSTHOG_*`. |

### Build, Docker, DigitalOcean, env

| Item | Status | Notes |
|------|--------|--------|
| DO runtime script | **P** | Root `verify:do-runtime` — not executed this sweep. |
| Env validation | **P** | `npm run env:validate` / `env:validate:production` at root — not executed (no credential mutation). |
| Production preflight | **R** (env) | Failed in this environment on **Postgres TLS chain** — see validation. |

### Prisma & data layer

| Item | Status | Notes |
|------|--------|--------|
| Safe migrate wrappers | **G** (tooling) | `db:migrate:*:safe`, `prisma-safe.mjs` in scripts. |
| DB env safety test | **S** | `test:db-env-safety` available — not run. |

### Cache & reliability scripts

| Item | Status | Notes |
|------|--------|--------|
| Redis / Upstash | **P** | Dependency present; behavior gated by env — confirm in staging/prod. |
| Reliability workflow guard | **P** | `verify:production-reliability-workflow` in nursenest-core package.json. |

### Playwright E2E

| Item | Status | Notes |
|------|--------|--------|
| Release gate | **S** | `qa:release-gate` requires app + DB + optional paid creds — **not executed** (time + server). **Doc:** `nursenest-core/docs/RELEASE_QA.md`, `playwright.release-gate.config.ts`. |
| Surrogate static check | **G** | `npm --prefix nursenest-core run test:learner-shell-imports` passed. |

### Accessibility & hydration

| Item | Status | Notes |
|------|--------|--------|
| a11y automation | **S** | No dedicated a11y suite in validation slice; track as **post-launch** unless blocking jurisdiction. |
| Hydration risk reports | **P** | Generated artifacts under `nursenest-core/reports/` (may differ from root `reports/`). |

### Phase 14 / platform governance

| Item | Status | Notes |
|------|--------|--------|
| Mobile readiness contracts | **G** | `test:unit:phase14-mobile-readiness` — 4 tests pass. |
| Governance network contracts | **P** | `test:unit:phase14-governance-autonomous-network` in package.json — not run this sweep. |

### Store readiness (mobile)

| Item | Status | Notes |
|------|--------|--------|
| EAS / assets / privacy | **P** | **Doc:** `docs/mobile-production-audit-report.md` §5–6; `npm run mobile:release:readiness` for bundled checks. |

---

## Prioritized blocker list (rollup)

1. **Resolve full TypeScript errors** in `nursenest-core` until `npm --prefix nursenest-core run typecheck` and `predeploy:check` are green (files called out in validation section below).  
2. **Investigate failing `test:seo-sitemap`** subtest (blog long-form builder contract).  
3. **Verify `production:preflight`** against production-grade Postgres URL (CA / `sslmode`) on DigitalOcean or CI secret store — failure here may be agent-environment-specific.  
4. **Run `qa:release-gate`** on staging with documented creds per `RELEASE_QA.md` before declaring revenue paths verified.

---

## Validation log (this sweep)

| Command | Result |
|---------|--------|
| `npm run typecheck` (repo root) | **Missing script** — root uses `npm run check` / other scripts. |
| `npm --prefix nursenest-core run typecheck` | **FAIL (exit 2)** — sample: `src/app/api/questions/route.ts` TS2322; `src/lib/ai/openai-chat-completions.ts` missing exports from `@/lib/ai/blog-ai-provider`; `src/lib/blog/blog-control-panel-generation.ts` TS2322; `src/lib/seo/public-flashcard-landing.ts` multiple TS errors (missing symbols, `PublicFeaturedDeck` shape). |
| `npm --prefix nursenest-core run typecheck:critical` | **PASS** |
| `npm run lint` (root) / nursenest-core ESLint | **N/A** — no top-level `lint` script for web in root `package.json`; mobile lint executed separately. |
| `npm run mobile:typecheck` | **PASS** |
| `npm run mobile:lint` | **PASS** |
| `npm --prefix nursenest-core run production:preflight` | **FAIL** — `DATABASE_CONNECT_FAILED: self-signed certificate in certificate chain` (agent TLS context). |
| `npm run predeploy:check` | **FAIL** — stops at same `typecheck` errors. |
| `npm run audit:build-stability` | **PASS** |
| `npm --prefix nursenest-core run audit:paywall-security` | **PASS** (12 tests) |
| `npm --prefix nursenest-core run test:unit:phase14-mobile-readiness` | **PASS** (4 tests) |
| `npm --prefix nursenest-core run test:seo-sitemap` | **FAIL** — 27 pass, 1 fail (`not ok 9` blog builder long-form contract). |
| `npm --prefix nursenest-core run verify:seo-indexability` | **Inconclusive / skipped** — exceeded practical wait without stdout in agent shell. |
| `npm --prefix nursenest-core run build` | **Not run** — full typecheck already red; expect CI/predeploy to fail until TS fixed. |
| `npm --prefix nursenest-core run test:learner-shell-imports` | **PASS** (E2E surrogate for shell import discipline). |
| `npm --prefix nursenest-core run qa:release-gate` | **Not run** — requires long-running dev server + DB + paid test creds. |

---

## Document index (existing sources — synthesize, do not duplicate)

| Topic | Path |
|--------|------|
| Mobile production & store | `docs/mobile-production-audit-report.md` |
| Entitlements web + API | `docs/entitlements-web-mobile-audit.md` |
| Mobile architecture | `docs/mobile-architecture.md`, `docs/mobile-auth-architecture.md`, `docs/mobile-lessons-architecture.md` |
| Release QA / Playwright gate | `nursenest-core/docs/RELEASE_QA.md` |
| Build stability narrative pointer | `reports/production-stability-audit.md` (referenced from `audit:build-stability` output) |
| Legacy / restoration order | `docs/legacy-restoration-map.md` |
| Mobile implementation notes | `docs/mobile-implementation-report.md` |

---

*Sweep performed in agent environment; re-run gated commands in CI or staging before production promote.*
