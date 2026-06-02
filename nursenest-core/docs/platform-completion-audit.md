# NurseNest Platform Completion And Maturity Audit

Date: 2026-05-31

## Audit Standard

This audit measures maturity, not existence. A route, component, registry entry, planning document, or draft pathway does not receive full credit unless the repository also shows supporting content depth, server-side protection, learner UX, tests, analytics, and operational evidence.

Evidence sources reviewed:

- Route inventory: 103 learner pages, 114 admin pages, 405 API routes.
- Test inventory: 1,541 test/spec/contract files under `src/lib` and `tests`.
- Content reports and governance docs under `docs`, `data/reports`, `src/lib`, and `tests`.
- Monetization, trial, paywall, revenue-alert, institutional, readiness, analytics, ECG, labs, lessons, flashcards, CAT, practice, and international source files.

Not counted as full maturity evidence:

- Future-facing plans without implementation.
- Hidden draft pathways without learner-facing launch readiness.
- Screenshot plans without generated screenshot artifacts.
- Content targets without persisted inventory or count evidence.
- Client-only UI gates without server-side entitlement evidence.

## Executive Summary

| Metric | Current Completion | Target Completion | Gap | Classification |
|---|---:|---:|---:|---|
| Overall Platform Completion | 72% | 88% | 16 pts | Mature |
| Overall Launch Readiness | 78% | 90% | 12 pts | Mature |
| Overall Institutional Readiness | 66% | 85% | 19 pts | Developing |
| Overall International Readiness | 34% | 75% | 41 pts | Early Stage |

Primary conclusion: NurseNest has a strong Canada/U.S. learner platform foundation, especially around RN, CAT exams, flashcards, practice exams, readiness, billing, and admin infrastructure. The largest maturity gaps are not route coverage. They are content depth consistency, specialty pathway completion, hidden international readiness, simulation breadth, pharmacology persistence, ECG clinical fidelity, and institution-grade commercial operations.

## Classification Key

| Score | Classification |
|---:|---|
| <50% | Early Stage |
| 50-69% | Developing |
| 70-84% | Mature |
| 85-94% | Advanced |
| 95%+ | Best-In-Class |

## Ecosystem Scorecard

| Ecosystem | Current Completion | Target Completion | Gap | Estimated Effort | Priority | Classification | Evidence |
|---|---:|---:|---:|---|---:|---|---|
| RN | 84% | 92% | 8 pts | 3-5 weeks | 1 | Mature | `data/reports/lesson-inventory-by-nursing-tier.txt` shows CA RN 146 lessons and US RN 80 lessons. `docs/reports/us-rn-nclex-rn-practice-hub-count-audit.md` shows 5,235 US RN practice rows. `docs/rn-rpn-end-to-end-readiness-audit.md` marks core RN CAT configs production-ready. |
| PN/RPN | 76% | 90% | 14 pts | 4-6 weeks | 4 | Mature | `docs/rn-rpn-end-to-end-readiness-audit.md` lists `ca-rpn-rex-pn` and `us-lpn-nclex-pn` as core pathways with production-ready CAT config. Direct PN/RPN-specific content count and paid-user E2E evidence is thinner than RN. |
| NP | 70% | 88% | 18 pts | 6-10 weeks | 8 | Mature | 162 NP-matching files were found. NP certification architecture and hidden specialty expansion docs exist, but many specialty ecosystems are explicitly future/draft/admin-only rather than fully learner-ready. |
| New Graduate | 58% | 85% | 27 pts | 8-12 weeks | 12 | Developing | 22 New Grad-matching files and convergence docs exist. Evidence supports early pathway scaffolding, but not complete lessons, cases, simulations, readiness, and marketing parity. |
| Allied Health | 66% | 88% | 22 pts | 8-12 weeks | 10 | Developing | `docs/reports/premium-allied-newgrad-convergence.md` verifies representative allied keys and contract coverage. `docs/allied-health-learning-experience-parity.md` is mostly standards and target state, not full content completion evidence. |
| ECG | 68% | 90% | 22 pts | 5-8 weeks | 2 | Developing | `docs/reports/ecg-module-clinical-accuracy-audit.md` confirms gating and ECG architecture, but flags critical clinical fidelity gaps in AV block rendering, complete heart block metadata, STEMI specificity, hyperkalemia framing, paced rhythm morphology, and publish gates. |
| Labs | 78% | 90% | 12 pts | 4-6 weeks | 6 | Mature | `docs/clinical-measurement-intelligence-audit-FOURTH-PASS.md` shows measurement orchestration, trend intelligence, graph integration, labs hub watchlist, and governance; remaining work includes inline interpretation panels and route-level expansion. |
| Clinical Skills | 76% | 88% | 12 pts | 4-7 weeks | 9 | Mature | Learner routes and tests exist for clinical skills, and platform dashboard records shared shell adoption. File count is smaller than lessons/CAT/flashcards, so breadth is not yet advanced. |
| Pharmacology | 62% | 88% | 26 pts | 8-12 weeks | 5 | Developing | `docs/pharmacology-mastery-system-audit.md` shows a pharmacology hub, category blueprint, mastery profile builder, and integration concepts. It also states persisted 100+ questions per medication class, full-page class routes, persistent analytics, and screenshots are not complete. |
| Medication Math | 74% | 88% | 14 pts | 4-6 weeks | 7 | Mature | Learner route, module tests, and shared shell evidence exist. Maturity is capped by limited direct persisted content-count evidence and incomplete marketing/screenshot proof. |
| Flashcards | 86% | 92% | 6 pts | 2-4 weeks | 3 | Advanced | 202 flashcard-matching files, extensive `src/lib/flashcards` tests, paid-user E2E specs, SRS-related tests, and learner route coverage. `docs/platform-quality-dashboard.md` still notes partial shared shell/card/dynamic-count coverage. |
| Practice Exams | 83% | 92% | 9 pts | 3-5 weeks | 11 | Mature | Practice tests have route, library, contract, and E2E coverage. Rationale and question systems are broad. Live production payment-to-practice verification remains outside repo-only evidence. |
| CAT Exams | 86% | 92% | 6 pts | 2-4 weeks | 13 | Advanced | 449 CAT-matching files, extensive `src/lib/cat` and `src/lib/exams/cat-*` tests, multiple E2E specs, and production-ready pathway config in `docs/rn-rpn-end-to-end-readiness-audit.md`. |
| Simulations | 64% | 88% | 24 pts | 8-12 weeks | 14 | Developing | Simulation routes, LOFT/case references, and tests exist, but broad simulation factory goals, profession-specific simulation depth, and mature learner workflow evidence are incomplete. |
| Readiness | 82% | 92% | 10 pts | 3-5 weeks | 15 | Mature | `src/lib/learner/readiness-report-engine.test.ts` verifies readiness reports, strengths, gaps, confidence, remediation, study plans, dashboard cards, and executive analytics. |
| Analytics | 76% | 90% | 14 pts | 5-8 weeks | 16 | Mature | Admin/user analytics routes exist. `tests/contracts/confidence-analytics-system.contract.test.ts` validates overconfidence, underconfidence, confidence accuracy, high-risk gaps, and Knowledge Confidence Report behavior. Feature adoption and revenue analytics need stronger runtime proof. |
| Study Plans | 72% | 88% | 16 pts | 5-8 weeks | 17 | Mature | Study plan learner routes and readiness-linked plan generation exist. Evidence is weaker for full adaptive closed-loop persistence across all modules. |
| International | 34% | 75% | 41 pts | 16-24 weeks | 18 | Early Stage | `docs/international-readiness-dashboard.md` scores Canada 85%, US 72%, UK 42%, Australia 39%, NZ 31%, Ireland 28%. `docs/international-launch-readiness.md` shows UK/AU/NZ target assets at 0 against future goals. Hidden international library is draft/admin-only. |
| Institutional Foundations | 66% | 85% | 19 pts | 8-12 weeks | 19 | Developing | `docs/institutional-licensing-platform.md` shows admin route, admin APIs, licensing migration, org/membership/cohort/license models, and RBAC guardrails. Self-service checkout and full institutional commercial lifecycle remain future work. |

## Phase 1: Content Maturity

| Area | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Lessons | 82% | Mature | `data/reports/lesson-inventory-by-nursing-tier.txt` shows CA RN 146 lessons and US RN 80 lessons generated from `getEffectiveCatalogLessonsForPathwaySync`. Lesson route/API/test coverage is broad. | Specialty, international, new grad, and allied lesson depth is uneven. |
| Questions | 84% | Mature | `docs/reports/us-rn-nclex-rn-practice-hub-count-audit.md` shows 5,235 US RN practice rows. Practice/CAT/question route and test coverage is extensive. | Some categories remain thin in count evidence, including US RN pediatrics and mental health in the audit table. |
| Flashcards | 83% | Mature | 202 flashcard-matching files, flashcard route coverage, SRS tests, and paid-user E2E specs. | Dynamic count coverage and all-pathway content maturity are not equally proven. |
| Simulations | 61% | Developing | Simulation and clinical scenario routes exist; LOFT and case integration are referenced in measurement/readiness docs. | Breadth, persisted content inventory, profession-specific cases, and completion analytics are not mature. |
| Clinical Skills | 72% | Mature | Clinical skills learner/admin surfaces and tests exist; shared shell convergence includes clinical skills. | Skills library breadth and profession-specific interactive activities are not fully evidenced. |
| Case Studies | 70% | Mature | NGN, clinical scenarios, readiness, and simulation infrastructure support case-style workflows. | Dedicated case inventory counts and per-pathway maturity evidence are limited. |
| Readiness Domains | 78% | Mature | Readiness report engine tests verify strengths, gaps, remediation, executive analytics, confidence, and study-plan output. | Domain coverage is strongest for core nursing; specialty and international domains are less complete. |
| Report Cards | 75% | Mature | Learner report-card route exists; readiness report engine supports dashboard and executive summaries. | Evidence for rich report cards across NP, allied, new grad, international, and institutions is incomplete. |

Content maturity average: 76%.

## Phase 2: Feature Maturity

| Feature | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Practice Exams | 83% | Mature | Practice-test APIs, routes, library tests, and E2E coverage exist. | Live production purchase-to-access proof is not present in repo evidence. |
| CAT | 86% | Advanced | CAT has 449 matching files, production-ready core pathway configs, and broad tests. | Active exam UX is strong; remaining gap is broader specialty/international CAT readiness. |
| Flashcards | 86% | Advanced | SRS, paid-user flows, route/API tests, and content systems are well represented. | Cross-module notebook/remediation integration is not fully proven everywhere. |
| Study Plans | 72% | Mature | Learner study-plan route and readiness-generated study plan tests exist. | Closed-loop adaptive remediation across all modules is partial. |
| Analytics | 76% | Mature | Learner/admin analytics routes and confidence analytics contract tests exist. | Feature adoption and revenue analytics need stronger operational evidence. |
| Readiness | 82% | Mature | Readiness engine tests cover scoring, trends, gaps, remediation, and dashboard outputs. | Readiness parity is not proven across all professions/exams. |
| ECG | 68% | Developing | ECG module tests and gated routes exist. Clinical accuracy audit confirms architecture and highlights critical clinical gaps. | ECG clinical fidelity and publish gates require correction before advanced maturity. |
| Labs | 78% | Mature | Clinical measurement orchestration and labs watchlist are documented and tested. | Labs needs more inline learner activities and mature route-level product proof. |
| Medication Math | 74% | Mature | Learner route and module tests exist. | Content breadth, screenshots, and analytics are not fully evidenced. |
| Pharmacology | 62% | Developing | Pharmacology hub and mastery profile exist. Audit identifies missing persisted class-level content, analytics, and screenshots. | Needs content persistence and learner workflow completion. |
| Clinical Skills | 76% | Mature | Routes/tests and shared shell convergence exist. | Content breadth and profession-specific interactive workflows need expansion. |
| Simulations | 64% | Developing | Simulation center route and scenario infrastructure exist. | Simulation factory depth, patient outcomes, and analytics are incomplete. |

Feature maturity average: 76%.

## Phase 3: UX Maturity

| UX Area | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Desktop | 82% | Mature | `docs/platform-quality-dashboard.md` scores shared module architecture 84, sidebar/spacing 88, homepage communication 86. | Some modules still need shell parity. |
| Tablet | 76% | Mature | Platform dashboard includes responsive coverage at 80 and shared shell progress. | Tablet-specific evidence is less direct than desktop/mobile route checks. |
| Mobile | 78% | Mature | Mobile E2E coverage exists across major learner flows; dashboard records responsive coverage. | Paid mobile flows require credentials/staging verification in some audits. |
| Accessibility | 74% | Mature | Keyboard/focus/card-click requirements are covered in module tests and platform dashboard gives accessibility 78. | Full WCAG audit artifacts are not present. |
| Navigation | 86% | Advanced | Platform dashboard scores navigation consistency 86; shared learning shell work covers global nav/theme/tier context. | Pharmacology/simulations and some legacy modules need final convergence. |
| Theme Support | 82% | Mature | Theme-aware shell and token references are consistently present in platform docs and tests. | Screenshot and visual proof across every theme is incomplete. |
| Loading States | 76% | Mature | Empty/loading states are represented in module architecture and route tests. | Lesson-list timeout behavior shows reliability/loading fallback needs more hardening. |
| Empty States | 78% | Mature | Empty state messaging and no-content guards appear in route/module tests and docs. | Some empty states are functional but not conversion-optimized. |

UX maturity average: 79%.

## Phase 4: Monetization Maturity

| Area | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Subscriptions | 82% | Mature | Billing/subscription APIs, Stripe library, admin subscription routes, and retention contract tests exist. | Live production reconciliation evidence is outside repo-only audit. |
| Trials | 80% | Mature | Trial API routes and `tests/contracts/auth-paywall-trial-abuse-prevention.contract.test.ts` validate eligibility signals and server-side controls. | Operational false-positive/false-negative monitoring is not fully evidenced. |
| Paywalls | 80% | Mature | Entitlement matrix and API protection are covered in auth/paywall contract tests. | Need complete matrix proof for every premium route. |
| Upgrades | 78% | Mature | Retention contract verifies locked feature prompts, Stripe invoice preview, and proration behavior. | Full user-facing upgrade E2E through Stripe remains partly opt-in. |
| Downgrades | 74% | Mature | Subscription schedules and downgrade patterns are covered in contract tests. | Self-service downgrade UX evidence is thinner than subscription setup. |
| Cancellation | 77% | Mature | Cancellation save-flow copy, options, and progress/value prompts are covered in retention tests. | No production churn analytics evidence in this audit. |
| Retention | 75% | Mature | `evaluateSubscriptionHealth`, renewal reminders, win-back campaigns, and feature discovery prompts are tested. | Retention impact is not backed by production cohort data in repo evidence. |
| Referral | 64% | Developing | Referral guardrails are present in retention contract tests. | Referral program appears less complete than subscription/trial/paywall systems. |

Monetization maturity average: 76%.

## Phase 5: Analytics Maturity

| Area | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Funnels | 72% | Mature | `docs/qa/playwright-conversion-audit.md` covers homepage CTA, signup, verification, onboarding, trial, subscription row, checkout handoff. | Continuous production funnel monitoring is not fully evidenced. |
| Readiness | 82% | Mature | Readiness engine tests verify score, gaps, next actions, study plan, dashboard card, and executive analytics. | Specialty pathway readiness models are uneven. |
| Retention | 74% | Mature | Retention scoring and lifecycle communications are contract-tested. | Needs production cohort trend reporting. |
| Revenue | 76% | Mature | `src/lib/revenue-alerts/revenue-alerts.ts` supports revenue events, email/SMS/admin/webhook channels, health checks, and audit logs. | Delivery guarantees and live notification monitoring require operational proof. |
| Usage | 73% | Mature | Learner analytics routes and usage/reporting engines exist. | Complete module-by-module adoption instrumentation is not proven. |
| Feature Adoption | 70% | Mature | Feature discovery campaigns and analytics surfaces are present. | Adoption dashboards are less mature than readiness and billing analytics. |

Analytics maturity average: 75%.

## Phase 6: Reliability Maturity

| Area | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Flashcards | 84% | Mature | Extensive flashcard tests, paid flows, and SRS coverage. | Some dynamic count/shell polish gaps remain. |
| Practice | 82% | Mature | Practice question/test route, library, and E2E coverage. | Live all-pathway paid-user validation is incomplete. |
| CAT | 84% | Mature | CAT engine, session, readiness config, and E2E coverage are extensive. | Specialty/international CAT reliability is not equally proven. |
| Lessons | 78% | Mature | Lesson loaders, APIs, route tests, and inventory reports exist. | Lesson-list timeout/fallback behavior requires hardening because learner-facing failure states are documented. |
| Dashboard | 76% | Mature | Dashboard, readiness, report-card, subscription summary, and admin analytics routes exist. | End-to-end data freshness and paid-user visual QA are not fully evidenced. |
| Signup | 78% | Mature | Conversion audit covers signup, verification, onboarding, login, and trial path. | Real email provider and production deliverability proof are outside repo-only evidence. |
| Checkout | 74% | Mature | Stripe checkout, billing, webhook, subscription, and test-mode handoff are covered. | Full hosted Stripe completion requires opt-in env and production/staging verification. |

Reliability maturity average: 79%.

## Phase 7: Marketing Maturity

| Area | Score | Classification | Evidence | Main Gap |
|---|---:|---|---|---|
| Homepage | 84% | Mature | Homepage feature discovery and screenshot strategy docs exist; platform dashboard scores homepage value communication 86. | Screenshot quality must be continuously regenerated from deepest learner states. |
| Pricing | 80% | Mature | Pricing/checkout routes and subscription transparency tests exist. | Needs stronger screenshot/value proof beside pricing. |
| RN | 82% | Mature | RN hub/content/CAT/practice evidence is strongest among pathways. | Some category gaps and staging validation remain. |
| PN | 74% | Mature | PN/RPN route/config evidence exists. | Direct PN marketing/content count evidence is weaker than RN. |
| NP | 76% | Mature | NP hub/pathway architecture and market expansion docs exist. | Specialty screenshots and certification-specific live experiences are incomplete. |
| New Grad | 62% | Developing | New Grad pathway and positioning docs exist. | Product and marketing evidence is early. |
| Allied | 68% | Developing | Allied convergence docs and route validation exist. | Profession-specific screenshots/content depth are not mature. |
| SEO | 82% | Mature | Many SEO/content reports and public marketing routes exist. | Indexation quality work remains ongoing. |
| Screenshots | 72% | Mature | Screenshot generation plans and marketing image requirements exist. | The audit did not find enough generated, current, deep-learning-state screenshot proof to score higher. |
| FAQs | 76% | Mature | FAQs/SEO content are represented across marketing and hub docs. | Needs global consistency and freshness validation. |

Marketing maturity average: 76%.

## Top 10 Strongest Systems

1. CAT Exams - 86%. Strong engine, route, pathway config, and test coverage.
2. Flashcards - 86%. Strong SRS, routes, tests, and paid-user evidence.
3. Navigation/Shared Learning Shell - 86%. Strong convergence evidence with remaining module parity gaps.
4. RN Ecosystem - 84%. Best content and question inventory evidence.
5. Practice Exams - 83%. Strong question/session/test infrastructure.
6. Readiness - 82%. Strong readiness report engine and confidence integration.
7. Lessons - 82%. Strong core nursing inventory and loader/API coverage.
8. Subscriptions - 82%. Strong billing/subscription infrastructure and contract tests.
9. Homepage/Value Communication - 84%. Strong marketing architecture and feature discovery direction.
10. Labs/Clinical Measurement - 78%. Strong measurement intelligence foundation.

## Top 10 Weakest Systems

1. International - 34%. Mostly hidden, draft, and not public launch-ready.
2. New Graduate - 58%. Early product/content maturity.
3. Pharmacology - 62%. Hub exists, but persistent class-level content and analytics are incomplete.
4. Simulations - 64%. Framework exists, but breadth and outcomes are immature.
5. Referral - 64%. Guardrails exist, but product is not as mature as billing/trial.
6. Allied Health - 66%. Profession coverage exists, but parity is incomplete.
7. Institutional Foundations - 66%. Strong admin/data foundation, but commercial lifecycle is developing.
8. ECG - 68%. Strong architecture, but clinical fidelity issues cap maturity.
9. Feature Adoption Analytics - 70%. Present but not deeply proven.
10. NP - 70%. Core/scaffolding exists, but multi-certification specialty maturity is incomplete.

## Highest ROI Improvements

| Priority | Improvement | Why It Has High ROI |
|---:|---|---|
| 1 | Fix ECG clinical fidelity and publish gates | ECG is a premium differentiator, but the clinical accuracy audit identifies critical issues that directly affect trust. |
| 2 | Harden lesson catalog reliability and fallback behavior | Lessons are a core conversion and retention surface; learner-facing "could not load" states reduce perceived product maturity. |
| 3 | Complete entitlement matrix tests across every premium module | Protects revenue and prevents inconsistent free access. |
| 4 | Finish live content counts across hubs/cards | Improves conversion with low product risk and high trust impact. |
| 5 | Build persisted pharmacology class-level content and analytics | Pharmacology is high-value and currently materially below platform maturity. |
| 6 | Productize simulations with outcomes, debriefs, and analytics | Simulations can differentiate NurseNest beyond question banks. |
| 7 | Generate deep-state marketing screenshots from real learner workflows | Improves homepage/pricing/pathway conversion. |
| 8 | Add PN/RPN-specific content count and paid-user E2E evidence | PN/RPN is close to mature but needs proof parity with RN. |
| 9 | Advance institutional self-service checkout and seat lifecycle | Converts existing institutional foundation into revenue operations. |
| 10 | Strengthen New Graduate pathway content depth | Extends retention after licensure and supports institutional sales. |

## Lowest ROI Improvements

| Item | Reason |
|---|---|
| Public launch work for UK/AU/NZ before Canada/U.S. maturity improves | International readiness is intentionally hidden and early; public launch work would distract from core revenue systems. |
| More hidden international content without reuse/governance validation | Existing docs show many targets at 0; quality gates and reuse strategy should come first. |
| Broad visual redesigns without shared shell adoption | Shared primitives already exist; fragmented redesigns reduce ecosystem consistency. |
| Marketing screenshots from hubs or navigation screens | Deep learner states are more conversion-relevant than category pages. |
| New analytics labels without telemetry and retention loops | Analytics maturity depends on actionable signals, not dashboard surface area. |
| Additional content volume without quality scoring and duplicate detection | Would worsen content maturity risk. |
| Manual title/copy sweeps across low-traffic pages without rendering utilities | Centralized formatting has higher leverage. |
| New country toggles beyond the account-level pathway architecture | Adds UX complexity before content readiness exists. |
| New payment packages before churn/upgrade evidence is reviewed | Could complicate billing without proven retention lift. |
| Standalone module shells | Violates the single ecosystem architecture and creates future maintenance cost. |

## Priority Order

1. ECG clinical fidelity and publication safety.
2. Lesson catalog reliability and snapshot/fallback hardening.
3. Premium entitlement matrix coverage for all launchable activities.
4. Live count completion across hubs and cards.
5. Pharmacology persisted content, class routes, and analytics.
6. Simulation workflow depth, scoring, debriefs, and analytics.
7. Deep-state Playwright marketing screenshots.
8. PN/RPN parity evidence and pathway-specific E2E coverage.
9. Institutional checkout, seat purchase, renewals, and cohort reporting.
10. New Graduate pathway content and readiness.
11. Allied profession-specific content and report cards.
12. NP specialty certification completion beyond core/FNP.
13. Feature adoption analytics tied to upgrade prompts.
14. International reuse tagging and hidden content governance.
15. International launch content after core platform reaches target maturity.

## Final Completion Matrix

| Ecosystem | Current Completion | Target Completion | Gap | Estimated Effort | Priority Order | Classification |
|---|---:|---:|---:|---|---:|---|
| RN | 84% | 92% | 8 pts | 3-5 weeks | 1 | Mature |
| PN/RPN | 76% | 90% | 14 pts | 4-6 weeks | 4 | Mature |
| NP | 70% | 88% | 18 pts | 6-10 weeks | 8 | Mature |
| New Graduate | 58% | 85% | 27 pts | 8-12 weeks | 12 | Developing |
| Allied Health | 66% | 88% | 22 pts | 8-12 weeks | 10 | Developing |
| ECG | 68% | 90% | 22 pts | 5-8 weeks | 2 | Developing |
| Labs | 78% | 90% | 12 pts | 4-6 weeks | 6 | Mature |
| Clinical Skills | 76% | 88% | 12 pts | 4-7 weeks | 9 | Mature |
| Pharmacology | 62% | 88% | 26 pts | 8-12 weeks | 5 | Developing |
| Medication Math | 74% | 88% | 14 pts | 4-6 weeks | 7 | Mature |
| Flashcards | 86% | 92% | 6 pts | 2-4 weeks | 3 | Advanced |
| Practice Exams | 83% | 92% | 9 pts | 3-5 weeks | 11 | Mature |
| CAT Exams | 86% | 92% | 6 pts | 2-4 weeks | 13 | Advanced |
| Simulations | 64% | 88% | 24 pts | 8-12 weeks | 14 | Developing |
| Readiness | 82% | 92% | 10 pts | 3-5 weeks | 15 | Mature |
| Analytics | 76% | 90% | 14 pts | 5-8 weeks | 16 | Mature |
| Study Plans | 72% | 88% | 16 pts | 5-8 weeks | 17 | Mature |
| International | 34% | 75% | 41 pts | 16-24 weeks | 18 | Early Stage |
| Institutional Foundations | 66% | 85% | 19 pts | 8-12 weeks | 19 | Developing |

## Evidence Limits

This audit is based on repository evidence available on 2026-05-31. It does not assert live production uptime, real payment processor delivery, real email/SMS delivery, current Search Console state, or current production database content unless those were represented by checked-in reports, tests, scripts, or code. Systems with strong architecture but weak runtime/content evidence were intentionally capped below advanced maturity.
