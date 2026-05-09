# Master convergence orchestration — 2026-05-08

## Executive summary

This document orchestrates **main-branch convergence** for the NurseNest monorepo: align TypeScript, Playwright release gates, environment validation, SEO/i18n contracts, learner UX parity, and billing entitlements before promoting release candidates. It was **recreated** in-repo because the original artifacts were not present under `reports/` or elsewhere on this VM (see search notes in commit status). Treat it as a **living runbook**; execution order follows P1→P5 unless a blocker forces a swap.

**Truthpack absence note:** This report was drafted without re-reading `.vibecheck/truthpack/*` line-by-line in this session. Before changing tiers, routes, copy, or npm script names for release messaging, **reconcile against the truthpack** (product, routes, copy, deploy) so orchestration docs cannot drift from verified sources.

---

## Top 10 priorities

Numbered convergence priorities (maps to backlog **C-001**–**C-010**):

1. **Green full TypeScript** — `npm --prefix nursenest-core run typecheck`; include root `npm run predeploy:check` when CI/release docs require it (**C-001**).
2. **Release gate E2E on staging** — `qa:release-gate:check-env`, then `qa:release-gate` plus guest/paid/mobile slices (**C-002**).
3. **Env drift** — Root `npm run env:validate` and `npm run prisma:health` (**C-003**).
4. **SEO sitemap** — `npm --prefix nursenest-core run test:seo-sitemap` (**C-004**).
5. **Design-system slice** — Learner surfaces use semantic tokens and shared patterns, not ad hoc hex (**C-005**).
6. **Billing staging confidence** — Stripe → entitlement correctness on staging (**C-006**).
7. **i18n gate (RC)** — Root `npm run i18n:compile`, `npm run i18n:validate:production`, `npm run i18n:ci` (**C-007**).
8. **Lesson hub health** — Bounded list/detail payloads and hub correctness (**C-008**).
9. **A11y evidence** — VoiceOver/TalkBack and contrast on tinted mobile surfaces (**C-009**).
10. **Integration hygiene** — Documented merge order; avoid orphan long-lived branches (**C-010**).


## Deduped risk matrix

| Risk area | Symptom | Primary mitigation | Owner hint |
|-----------|---------|-------------------|------------|
| TypeScript / build | Red `typecheck` or fragile predeploy | `npm --prefix nursenest-core run typecheck`; repo root `npm run predeploy:check` | Platform |
| Release E2E | Staging regressions on guest/paid/mobile | Playwright release gate scripts (see below) | QA |
| Env drift | Wrong secrets or DB in staging | Root `npm run env:validate`, `npm run prisma:health` | Infra |
| SEO / sitemap | Broken routes in sitemap merge | `npm --prefix nursenest-core run test:seo-sitemap` or documented waiver | Content platform |
| i18n | Locale drift or strict validation failures | Root `i18n:compile`, `i18n:validate:production`, `i18n:ci` | i18n |
| Billing → entitlement | Webhook OK but access wrong | Staging Stripe → DB entitlement reconciliation | Billing |
| Lesson hub / SSR | Hydration or SoT drift | Hub contracts + `content:source-of-truth:verify` patterns | Learning |
| A11y / mobile | Contrast or VO failures | Manual VoiceOver/TalkBack + tokenized contrast | UX |
| Branch / integration chaos | Parallel long-lived branches | Doc branch + integration hygiene backlog (C-010, C-011–C-030) | Release |

---

## P1–P5 backlog (release phases)

- **P1 — Safety net:** Green full TypeScript (`typecheck`) and repo `predeploy:check` where used in CI/release docs.
- **P2 — Staging truth:** `env:validate` / `prisma:health`; confirm staging mirrors production constraints without prod data leakage.
- **P3 — User-visible correctness:** Release gate E2E (`qa:release-gate:*`); SEO sitemap unit suite (`test:seo-sitemap`); i18n gate (`i18n:compile`, `i18n:validate:production`, `i18n:ci`).
- **P4 — Learner quality:** Design-system convergence on learner TSX (readiness, flashcards); lesson hub hydration + SoT; a11y (VoiceOver/TalkBack, contrast on tinted mobile surfaces).
- **P5 — Convergence hygiene:** Billing webhook → entitlement on staging; RN/RPN parity themes; integration branch documentation; production smoke and build-weight follow-ups.

---

## Release gate mapped to npm scripts

Scripts below are **verified names** from `package.json` files (repo root and `nursenest-core/package.json`) at authoring time. Prefer running Next app scripts via `npm --prefix nursenest-core run <script>` from the monorepo root.

| Gate | Command(s) | Notes |
|------|------------|--------|
| Full TypeScript | `npm --prefix nursenest-core run typecheck` | Inner package defines `typecheck` (`tsc --noEmit`). |
| Predeploy orchestration | `npm run predeploy:check` | Root script: `node scripts/predeploy-check.mjs`. |
| Release gate env | `npm --prefix nursenest-core run qa:release-gate:check-env` | Inner: `node scripts/validate-release-gate-env.mjs`. |
| Release gate (full) | `npm --prefix nursenest-core run qa:release-gate` | Inner chains env validation + `playwright.release-gate.config.ts`. |
| Guest / free slice | `npm --prefix nursenest-core run qa:release-gate:guest` | Projects: release-health, release-phase-1-guest, release-free-user. |
| Paid slice | `npm --prefix nursenest-core run qa:release-gate:paid` | Paid blocking + synthetic paid smoke projects. |
| Mobile slice | `npm --prefix nursenest-core run qa:release-gate:mobile` | `--project=release-mobile`. |
| Root passthrough (optional) | `npm run qa:release-gate --` etc. | Root delegates to inner with `--` passthrough. |
| Env validation | `npm run env:validate` | Root → inner `env:validate`. |
| Prisma health | `npm run prisma:health` | Root → inner `prisma:health`. |
| SEO sitemap tests | `npm --prefix nursenest-core run test:seo-sitemap` | Node test bundle for sitemap/blog/robots contracts. |
| i18n compile / strict / CI | `npm run i18n:compile`, `npm run i18n:validate:production`, `npm run i18n:ci` | Root scripts wrap `script/i18n-*.ts`. |

---

## Figma and screenshot policy

- **Figma:** Design changes that affect learner emotional UX should reference **approved frames**; engineering ships against tokens (`semantic-*`, theme palettes), not one-off hex from screenshots.
- **Screenshots:** Use for PR evidence and regression baselines (e.g. visual QA flows where enabled); do **not** replace automated release gates or entitlement checks.
- **No arch graphic:** Do not reintroduce deprecated marketing/arch imagery per product governance.

---

## Branch strategy

- **Docs orchestration branch:** `docs/master-convergence-orchestration-2026-05-08` carries this report and the implementation backlog (table **C-001–C-030**).
- **Integration / RC work:** Prefer short-lived branches per vertical slice; merge back frequently to avoid parallel drift (see C-010, C-030).
- **Main:** Convergence artifacts document intent for **main** promotion; do not force-push main; promote via normal PR review.

---

## Systemic risks

- **Script drift:** Root vs `nursenest-core` duplication — always confirm which `package.json` owns a script before documenting CI.
- **Staging credentials:** Playwright release gates require validated env (`qa:release-gate:check-env`); missing secrets masquerade as product bugs.
- **i18n + build:** `i18n:compile` is on the hot path for several flows; failing compile blocks downstream validation.
- **Lesson volume:** Hub/list paths must stay paginated and bounded per lesson-library safety rules.

---

## Blocked items

- **None recorded** in this recreated doc — populate when a gate fails (attach log path, failing script, and owner).
- If **WIP** on another branch blocks checkout, use `git stash push` (without drop) and link stash ref in the status report.

---

## References

- `reports/convergence-implementation-backlog.md` — ID’d tasks **C-001–C-030**.
- `reports/recommended-post-launch-roadmap.md` — mentions SEO sitemap unit failure theme (cross-link for historical context).
- `nursenest-core/package.json` — authoritative script names for app-level gates.
- Root `package.json` — orchestration scripts (`predeploy:check`, `env:validate`, `prisma:health`, top-level `i18n:*`, `qa:release-gate*` passthrough).

---

## Document provenance

Recreated **2026-05-08** on `docs/master-convergence-orchestration-2026-05-08` because `master-convergence-orchestration-2026-05-08.md` and `convergence-implementation-backlog.md` were **not found** elsewhere on this workspace VM (`find` across `/root/nursenest-core` and shallow `/root` returned no matches).
