# NurseNest — final risk register

**Truthpack:** Not consulted (`.vibecheck/truthpack/` missing in clone) — no tier/price/route facts invented below.

| id | area | description | severity | likelihood | mitigation | owner hint |
|----|------|-------------|----------|------------|------------|------------|
| R1 | Build / TypeScript | Full `tsc` fails on multiple files (`public-flashcard-landing`, blog AI imports, `api/questions`, blog control panel). `predeploy:check` fails at typecheck. | High | High | Fix exports/types; restore missing symbols; run `typecheck` until green. | Web platform |
| R2 | CI / deploy gate | `typescript.ignoreBuildErrors` allows Next production build while `tsc` red — risk of shipping broken types on non-covered paths. | Medium | Medium | Keep strict `tsc` in CI; do not relax predeploy; optional: fail build on critical paths only after R1 fixed. | Eng lead |
| R3 | SEO tests | `test:seo-sitemap` has 1 failing blog builder contract (subtest 9). | Medium | Medium | Reproduce locally; align fixture or implementation with contract. | Content / SEO |
| R4 | SEO ops | `verify:seo-indexability` hung/no output in agent run (likely network). | Low | Medium | Run in CI with timeout + caching; document baseline URLs. | DevOps |
| R5 | Database preflight | `production:preflight` failed TLS chain in agent env. | Medium (ops) | Low in prod if CA correct | Verify `DATABASE_URL` sslmode / DO CA on runners; use same image as prod. | DevOps |
| R6 | E2E coverage | `qa:release-gate` not executed; revenue path confidence from contracts only. | High | Medium | Run per `nursenest-core/docs/RELEASE_QA.md` on staging with paid creds. | QA |
| R7 | Documentation drift | `entitlements-web-mobile-audit.md` predates explicit `apps/mobile` tree in places. | Low | Medium | Addendum: native app uses same subscriber APIs; link mobile audit. | Tech writing |
| R8 | Mobile store | Placeholder icons / partial Sentry per mobile production audit. | Medium | Medium | Asset pipeline + EAS symbolication before store submission. | Mobile |
| R9 | i18n completeness | Full `i18n:ci` not run this sweep. | Medium | Low–Med | Schedule on release branch; gate locale regressions. | Localization |
| R10 | a11y | No automated a11y suite in sweep. | Low | Med | Add axe/Playwright smoke on marketing + learner shell post-launch. | Frontend |
| R11 | Secrets / env | Env validation scripts not run (by design in agent). | Medium | Low | Run `env:validate:production` in deploy pipeline only. | DevOps |
| R12 | Hydration | Hydration reports may be stale vs branch. | Low | Medium | Regenerate before UI release; compare diffs. | Frontend |
