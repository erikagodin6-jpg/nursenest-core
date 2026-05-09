# Convergence implementation backlog

Markdown table of prioritized convergence tasks (**C-001**–**C-030**). Source synthesis where marked **recreated/audit synthesis**.


> **Cross-reference:** **C-001**–**C-010** follow the numbered **Top 10 priorities** in `reports/master-convergence-orchestration-2026-05-08.md`.

| ID | Priority | Source | Scope | Task | Depends On | Branch Hint | Status |
|----|----------|--------|-------|------|------------|-------------|--------|
| C-001 | P1 | User convergence brief | Monorepo app TS | Achieve green full TypeScript: run `npm --prefix nursenest-core run typecheck`; when release docs/CI use root predeploy, also run `npm run predeploy:check`. | — | `docs/master-convergence-orchestration-2026-05-08` | Open |
| C-002 | P1 | User convergence brief | Playwright staging | Release gate E2E on staging: `npm --prefix nursenest-core run qa:release-gate:check-env`, then `qa:release-gate`, plus slices `qa:release-gate:guest`, `qa:release-gate:paid`, `qa:release-gate:mobile`. | C-001 (recommended), valid staging env | Same docs branch or short-lived `release/e2e-*` | Open |
| C-003 | P2 | User convergence brief | Env / DB | Reduce env script drift: run root `npm run env:validate` and `npm run prisma:health`; fix mismatches vs staging expectations. | Staging access | `docs/*` or `chore/env-*` | Open |
| C-004 | P2 | User convergence brief | SEO | SEO sitemap tests: `npm --prefix nursenest-core run test:seo-sitemap`; if blog builder blocks, document waiver + owner. | — | `fix/seo-sitemap-*` | Open |
| C-005 | P3 | User convergence brief | Learner UI / DS | Design-system convergence on learner TSX: readiness + flashcards surfaces — replace ad hoc hex/style hotspots with semantic tokens and shared patterns. | — | `feat/learner-ds-*` | Open |
| C-006 | P3 | User convergence brief | Billing | Staging billing webhook → entitlement: verify Stripe events grant correct learner access (no client-only checks). | C-003 | `fix/billing-staging-*` | Open |
| C-007 | P3 | User convergence brief | i18n | i18n gate: root `npm run i18n:compile`, `npm run i18n:validate:production`, `npm run i18n:ci`. | — | `chore/i18n-*` | Open |
| C-008 | P4 | User convergence brief | Lessons | Lesson hub/index health: hydration boundaries + source-of-truth drift vs catalogs (hub KPI load, index verification scripts as applicable). | C-001 | `fix/lesson-hub-*` | Open |
| C-009 | P4 | User convergence brief | A11y | Accessibility: VoiceOver/TalkBack passes on critical learner flows; contrast on tinted mobile surfaces using semantic tokens. | C-005 | `fix/a11y-*` | Open |
| C-010 | P5 | User convergence brief | Integration | Integration hygiene: maintain `integration/release-candidate-2026-05-08` style parallel branches with clear merge order and doc links (avoid orphan long-lived branches). | — | `integration/release-candidate-2026-05-08` | Open |
| C-011 | P2 | recreated/audit synthesis | Tokens / theme | Align `[data-theme]` and semantic tokens across learner surfaces; eliminate one-off grays that fight dark mode. | C-005 | `chore/theme-tokens-*` | Open |
| C-012 | P2 | recreated/audit synthesis | Env | Audit root vs `nursenest-core` script naming in CI docs to prevent “wrong npm prefix” failures. | C-003 | `chore/ci-docs-*` | Open |
| C-013 | P3 | recreated/audit synthesis | Routes | Verify stable learner/marketing URLs per truthpack; no accidental redirects during convergence. | — | `chore/routes-*` | Open |
| C-014 | P1 | recreated/audit synthesis | TS / build | Keep `typecheck` and critical unit bundles green during merges; escalate flaky tests with owners. | C-001 | `fix/ts-*` | Open |
| C-015 | P2 | recreated/audit synthesis | E2E gaps | Close gaps between `qa:release-gate` projects and known flaky tests; attach traces for failures. | C-002 | `fix/e2e-*` | Open |
| C-016 | P3 | recreated/audit synthesis | Mobile | Mobile learner flows beyond release-mobile slice where product-critical (touch targets, overflow). | C-002, C-009 | `fix/mobile-*` | Open |
| C-017 | P3 | recreated/audit synthesis | Lesson SSR / perf | Lesson route payload discipline: avoid heavy JSON on list paths; align with lesson-library safety. | C-008 | `perf/lesson-*` | Open |
| C-018 | P4 | recreated/audit synthesis | Hydration | Target hydration-risk routes (`report:hydration-risk-routes` patterns) for learner-critical pages. | C-008 | `fix/hydration-*` | Open |
| C-019 | P3 | recreated/audit synthesis | Paywall | Server-enforced paywall and entitlement checks unchanged by UI refactors; regression-test gated URLs. | C-006 | `fix/paywall-*` | Open |
| C-020 | P4 | recreated/audit synthesis | RN / RPN parity | RN vs RPN pathway parity audits (`verify:rpn-lessons-visible`, parity catalogs) without unsafe bulk imports. | C-008 | `content/rn-rpn-parity-*` | Open |
| C-021 | P5 | recreated/audit synthesis | Docs | Keep convergence docs updated when scripts rename; cross-link PRs that complete C-001–C-010. | — | `docs/convergence-*` | Open |
| C-022 | P4 | recreated/audit synthesis | Screenshots | PR before/after screenshots for learner-facing changes per governance checklist. | — | Same feature branch | Open |
| C-023 | P3 | recreated/audit synthesis | Playwright creds | Secure handling of staging auth secrets for paid/guest projects; no secrets in repo. | C-002 | `chore/e2e-secrets-*` | Open |
| C-024 | P3 | recreated/audit synthesis | Dark mode | Theme regressions on dashboards/cards; verify semantic charts/badges per guardrails. | C-011 | `fix/dark-mode-*` | Open |
| C-025 | P4 | recreated/audit synthesis | Nav / IA | Header/nav/footer: no clipped labels; preserve locale routing and stable CTAs. | C-007 | `fix/nav-*` | Open |
| C-026 | P4 | recreated/audit synthesis | Lesson hub UX | Emotional UX on hubs: clear next step, reduce administrative clutter on learner surfaces. | C-008 | `ux/lesson-hub-*` | Open |
| C-027 | P4 | recreated/audit synthesis | Learner parity | Marketing vs `/app` learner parity for promised capabilities (study momentum, not metric walls). | C-005 | `ux/learner-parity-*` | Open |
| C-028 | P2 | recreated/audit synthesis | Billing safety | Duplicate subscription prevention and webhook idempotency aligned with existing Stripe tests. | C-006 | `fix/billing-safety-*` | Open |
| C-029 | P3 | recreated/audit synthesis | Production smoke | Post-deploy smoke using approved production scripts (`health-check:production` patterns) without bypassing auth. | C-003 | `ops/smoke-*` | Open |
| C-030 | P5 | recreated/audit synthesis | Build weight | Audit bundle/build weight hotspots (`check:bundle-size`, large client component reports) after functional convergence. | C-014 | `perf/build-weight-*` | Open |
