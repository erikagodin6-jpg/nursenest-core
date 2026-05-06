# RN / RPN flow gaps (evidence-backed + verify-in-staging)

Each row is a **potential or confirmed** gap. Rows marked **Verify** need a run against staging/production with real data and credentials.

| ID | Area | Affected system | Route / file (primary) | Expected | Actual / risk | Likely cause | Sev | Revenue | AI fix class | Dev review? | Recommended fix | Required test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G-001 | E2E coverage | QA / Playwright | `tests/e2e/helpers/tier-product-matrix.ts` | US PN (NCLEX-PN) signup journey covered like RN/CA PN | `TIER_MATRIX_SIGNUP_ROWS` includes RN + **CA** PN/RPN only; no row for **US** `LVN_LPN` + `us-lpn-nclex-pn` hub | Matrix built for CA REx-PN path first | P2 | No | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Add `TIER_MATRIX_SIGNUP_ROW` for US PN hub → signup → dismiss onboarding → `/app/start-studying` with `pathwayId=us-lpn-nclex-pn` | Extend `tier-matrix-signup-multi-tier.spec.ts` |
| G-002 | Copy / IA | Onboarding + marketing | `resolve-default-pathway-for-onboarding.ts`, onboarding UI | Learners understand US PN vs CA RPN | Single exam goal `rpn` maps to **different** exams by country | Product naming vs registry ids | P2 | Indirect | SAFE_FOR_AI | Yes | Clarify strings: “PN (NCLEX-PN)” vs “RPN (REx-PN)” by `country` in onboarding + hub CTAs | Snapshot / copy review checklist |
| G-003 | Resilience | Learner dashboard | `(learner)/page.tsx` | Onboarding incomplete always redirects | Code catches Prisma errors and may render shell without redirect | Defensive `catch` on user load | P3 | No | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Decide: hard-fail vs safe empty; align with auth | Unit / integration on DB failure mock |
| G-004 | Data readiness | Question bank | `ensure-core-pathway-exam-questions.ts`, `scripts/audit-exam-question-bank.ts` | Non-zero published, flashcard-eligible pools per core pathway | **Verify** zero-count pathways in target env | Content not seeded / wrong tier-region | P0 | Yes | DEVELOPER_ONLY | Yes | Run `npm run audit:exam-bank` / `content:ensure:exam-bank`; fix ingest | Audit script in CI + threshold alert |
| G-005 | Data readiness | CAT / practice | Study pool builders + `examQuestionPoolWhereForContext` | CAT starts for RN/RPN with min pool | **Verify** start errors in env | Same as G-004 or filter too strict | P0 | Yes | DEVELOPER_ONLY | Yes | Align filters with `CORE_PATHWAY_AUDIT_ROWS`; seed | `paid-user-cat-focused-viewport.spec.ts` + smoke |
| G-006 | Product correctness | CAT UI | `cat-rationale-panel.tsx` | No rationales during secure exam mode | Implementation supports `locked` vs `feedback` | Regression if mode mis-wired | P0 | Yes | DEVELOPER_ONLY | Yes | E2E: answer question → rationale panel hidden in CAT test mode | CAT E2E assertion on panel state |
| G-007 | Parity | Practice vs CAT | `study-question-pool.ts`, contract tests | Same eligibility rules where product requires | **Verify** divergence only where intended | Separate call paths | P2 | No | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Document intentional deltas; extend contract tests | Existing `study-question-pool.contract.test.ts` |
| G-008 | CI coverage | Mobile paid | `playwright.mobile.config.ts`, `tests/e2e/mobile/*` | Paid RN/RPN surfaces on 390×844 | Many mobile specs `skip` without `QA_PAID_E2E` | Secrets policy | P2 | Indirect | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Nightly job with paid creds for 2 pathways | `mobile-paid-learner-shell.spec.ts` |
| G-009 | SEO | Sitemap / canonical | `src/app/**/sitemap.ts`, lesson hub `generateMetadata` | Canonical + sitemap include RN/PN marketing + lessons | **Verify** generated XML in CI | Drift in new routes | P2 | Indirect | SAFE_FOR_AI | Yes | Run `test:seo-sitemap` in PR for route changes | `npm run test:seo-sitemap` |
| G-010 | SEO | hreflang | i18n layout + metadata helpers | English default not broken by alternates | **Verify** | Misconfigured locale | P3 | No | DEVELOPER_ONLY | Yes | Add assertion on `<link rel="alternate"` where present | SEO unit / Playwright |
| G-011 | UX | i18n | Learner + marketing components | No raw `t('missing.key')` visible | **Verify** on PN hubs | Missing shard key | P2 | Indirect | SAFE_FOR_AI | Yes | Playwright scan for `nn.i18n` patterns / manual pass | E2E locale smoke |
| G-012 | Admin | Operations | `load-admin-user-support-detail.ts` | Staff sees pathway + subscription + activity | Pathway inferred from user fields; pool health not first-class | Scope of admin product | P2 | No | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Add “target pathway” + link to audit script output | Admin integration test |
| G-013 | Admin | Question bank | `AdminDashboardOverview` | Per-pathway deficit | Only tier rollup (RN/PN/NP/…) | Dashboard design | P3 | No | DEVELOPER_ONLY | Optional | Optional admin card: min pool per `CORE_PATHWAY_AUDIT_ROWS` | Read-only API from audit |
| G-014 | Flashcards | API + fallbacks | `src/app/api/flashcards/route.ts`, `load-exam-question-rows-for-flashcard-pool.ts` | Counts match user-visible deck | DB-only count can differ from augmented/virtual sessions | Dual sources | P2 | Indirect | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Unify “effective count” copy or document | API test + UI label |
| G-015 | Lessons | Hubs | `pathway-learning-structure`, hub pages | All internal links 200 for RN/PN | **Verify** after content edits | Slug drift | P1 | Yes | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | `npm run test:pathway-lessons` in CI | Already exists |
| G-016 | Paywall | Entitlements | `resolve-entitlement-for-page.ts`, layouts | No paid body leak; subscribers not blocked | **Verify** cross-tier | Matrix misconfiguration | P0 | Yes | DEVELOPER_ONLY | Yes | `verify:no-cross-tier-leakage` + tier-matrix gating | CI |
| G-017 | Onboarding | API | `api/onboarding/complete/route.ts`, `resolve-default-pathway-for-onboarding.ts` | Unknown `examGoal` should not silently assign the wrong exam | Non-matching goal falls through to **country NCLEX-RN fallback** (not `null`) | Resolver fallback chain | P2 | Indirect | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Yes | Require explicit goal in API or surface telemetry when fallback used | API test for garbage `examGoal` |
| G-018 | Practice exams | Routes | `/app/practice-tests`, `/app/practice` | Legacy alias redirects | **Verify** 308/rewrite preserved | Middleware regression | P2 | Indirect | SAFE_FOR_AI | Yes | Playwright redirect spec | Tier matrix helper already encodes alias |
| G-019 | Progress | API | `api/lessons/pathway-progress` | RN/PN saves independently | **Verify** race / pathway switch | Client cache | P2 | No | DEVELOPER_ONLY | Optional | E2E: complete lesson → reload | Manual / E2E |
| G-020 | Stripe | Webhooks | `api/webhooks/stripe` (read-only audit) | Subscription row matches Stripe | **Verify** env + signing | Misconfig | P0 | Yes | DEVELOPER_ONLY | Yes | Ops checklist; no code change in this audit | Staging webhook replay |

**Legend — AI fix class:** `SAFE_FOR_AI` | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | `DEVELOPER_ONLY`

---

## Notes

- **US NCLEX-PN** learner journey is **not** duplicated in tier-matrix signup rows today; that is the clearest **test coverage** gap for “PN” as requested in scope.
- **Revenue P0** items are mostly **data + entitlement verification** (G-004–G-006, G-016, G-020), not marketing copy.

### SAFE_FOR_AI status (partial)

| ID | Status |
| --- | --- |
| G-002 | **Done** — country-aware onboarding PN/RPN labels (`exam-goal-rows-for-country` + `TrialOnboardingFlow`). |
| G-009 | **Done** — `sitemap-rn-pn-core-pathways.contract.test.ts` + wired into `npm run test:seo-sitemap`. |
| G-011 | **Done** — `tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts` (sentinel scan; run with Playwright + `BASE_URL`). |
| G-018 | **Done** — `practice-alias-redirect.contract.test.ts` (source contract); E2E redirect tests already existed. |
