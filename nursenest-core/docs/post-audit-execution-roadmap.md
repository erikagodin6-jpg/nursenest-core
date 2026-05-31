# NurseNest Post-Audit Execution Roadmap

Date: 2026-05-31

Source: `docs/platform-completion-audit.md`

This roadmap uses the completed maturity audit findings only. It does not reassess, rescore, or introduce new platform concepts.

## Executive Priority

If NurseNest can only work on 20 initiatives during the next year, the highest-impact work is:

1. Fix ECG clinical fidelity and ECG publish gates.
2. Harden lesson catalog reliability and fallback behavior.
3. Complete premium entitlement matrix tests across all launchable activities.
4. Finish live content counts across hubs, cards, and upgrade surfaces.
5. Build persisted pharmacology class-level content and analytics.
6. Productize simulations with outcomes, scoring, debriefs, and analytics.
7. Generate deep-state Playwright marketing screenshots from real learner workflows.
8. Add PN/RPN-specific content count evidence and paid-user E2E coverage.
9. Complete institutional checkout, seat purchase, renewals, and cohort reporting.
10. Strengthen New Graduate pathway content and readiness.
11. Build Allied profession-specific content, report cards, and marketing proof.
12. Complete NP specialty certification experiences beyond core/FNP.
13. Tie feature adoption analytics directly to upgrade prompts.
14. Complete live subscription, renewal, cancellation, and trial conversion instrumentation.
15. Improve homepage/pricing product proof with real deep learning states.
16. Expand weak RN categories where audit evidence showed thinness.
17. Improve mobile paid-user validation for lessons, flashcards, practice, CAT, and labs.
18. Add full production-like checkout and email verification E2E coverage.
19. Prepare United States launch-readiness evidence package.
20. Continue hidden international reuse tagging, but delay public country launches until core maturity improves.

## Phase 1: Revenue Priorities

| Rank | Improvement | Expected ROI | Effort | Risk | Audit Basis |
|---:|---|---|---|---|---|
| 1 | Deep-state homepage and pricing screenshots | Very High | Medium | Low | Screenshots scored 72%; homepage 84%; screenshots must show real learning value. |
| 2 | Complete entitlement matrix tests across all premium modules | Very High | Medium | Medium | Paywalls scored 80%; audit called for complete matrix proof. |
| 3 | Live content counts across cards, hubs, and paywalls | Very High | Medium | Low | Live count coverage scored 76% in platform dashboard; counts improve trust and upgrades. |
| 4 | Lesson catalog reliability hardening | High | Medium | Medium | Lessons scored 78% reliability; learner-facing lesson list failure was explicitly noted. |
| 5 | Subscription transparency and retention instrumentation | High | Medium | Low | Subscriptions 82%, retention 75%; production cohort proof still missing. |
| 6 | Upgrade prompts tied to locked ECG, labs, simulations, analytics | High | Medium | Low | Upgrade systems mature but feature adoption analytics scored 70%. |
| 7 | Pharmacology content and analytics completion | High | High | Medium | Pharmacology scored 62%, with clear missing persisted content and analytics. |
| 8 | Simulations with outcomes and debriefs | High | High | Medium | Simulations scored 64%; high differentiation value. |
| 9 | New Graduate pathway maturity | Medium-High | High | Medium | New Graduate scored 58%; strong retention and institutional potential. |
| 10 | Institutional seat checkout and cohort reporting | Medium-High | High | Medium | Institutional Foundations scored 66%; required before sales outreach at scale. |

## Phase 2: US Launch Priorities

US launch is close, but not "launch immediately" until the evidence package is stronger.

| Blocker | Remaining Work | Estimated Hours | Audit Basis |
|---|---|---:|---|
| US RN content category gaps | Expand or document coverage for thin categories, especially pediatrics and mental health from the US RN count audit. | 40-80 | US RN had 5,235 questions, but category gaps were visible in audit evidence. |
| Paid-user end-to-end validation | Run and stabilize paid-user flows for lessons, flashcards, practice, CAT, labs, billing, and dashboard. | 32-56 | Reliability scores were strong but live paid validation was capped. |
| Lesson catalog fallback | Add and test resilient fallback/snapshot behavior for lesson list timeouts. | 24-40 | Lessons reliability scored 78%; catalog failure noted. |
| Entitlement matrix completion | Prove server-side launch restrictions for every premium activity route. | 40-64 | Paywalls scored 80%; complete route matrix is needed. |
| Checkout and email verification E2E | Complete production-like signup, verification, trial, checkout, and subscription activation checks. | 32-56 | Signup 78%, checkout 74%; hosted Stripe flow partly opt-in. |
| Marketing screenshots | Generate deep-state screenshots for question bank, NGN, CAT, lessons, ECG, labs, med math, pharmacology, clinical skills, readiness. | 48-80 | Screenshots scored 72%. |
| US readiness evidence packet | Compile route list, tests, counts, screenshots, checkout proof, and known limitations. | 16-24 | Launch readiness scored 78%; evidence packaging is missing. |

Estimated US launch readiness work: 232-400 hours.

Minimum condition for "Launch Ready": blockers above complete, no critical premium access leaks, no critical signup/checkout/lesson loading failures, and deep-state screenshots live.

Minimum condition for "Launch Immediately": same as Launch Ready plus passing paid-user smoke suite and current checkout/email verification proof.

## Phase 3: Content Priorities

| Rank | Pathway | Business Impact | Priority Content Gaps | Audit Basis |
|---:|---|---|---|---|
| 1 | RN | Very High | Thin US RN categories, high-risk clinical judgment, pediatrics, mental health, NGN depth. | RN scored 84%; largest near-term revenue market. |
| 2 | PN/RPN | High | Dedicated PN/RPN count proof, REx-PN and NCLEX-PN scenario depth, paid-flow validation. | PN/RPN scored 76%; near maturity but weaker evidence than RN. |
| 3 | NP | High | Specialty-specific certification content beyond core/FNP, readiness models, rationales, screenshots. | NP scored 70%; architecture exists but specialties are incomplete. |
| 4 | New Graduate | Medium-High | Transition-to-practice lessons, simulations, prioritization, delegation, documentation, readiness. | New Graduate scored 58%; retention and institutional upside. |
| 5 | Allied | Medium-High | Profession-specific questions, clinical pearls, simulations, report cards, screenshots. | Allied scored 66%; parity not yet complete. |

## Phase 4: Feature Priorities Below 80%

| Feature | Audit Score | To Reach 80% | To Reach 90% | To Reach 95% |
|---|---:|---|---|---|
| ECG | 68% | 80-120 hrs: fix critical rhythm fidelity and publish gates. | 180-260 hrs: add render-aware tests, screenshots, adaptive remediation. | 320-480 hrs: full best-in-class telemetry/deterioration ecosystem evidence. |
| Labs | 78% | 24-40 hrs: complete route-level learner proof and inline panels. | 120-180 hrs: expand lab activities, analytics, screenshots, paywall proof. | 260-420 hrs: institution-grade lab readiness and outcome evidence. |
| Clinical Skills | 76% | 40-64 hrs: content/card parity and route validation. | 160-240 hrs: profession-specific interactive workflows and report cards. | 320-500 hrs: simulation-grade skills with competency outcomes. |
| Pharmacology | 62% | 120-180 hrs: persisted class-level content and core analytics. | 320-480 hrs: broad drug-class coverage, questions, flashcards, screenshots. | 600-900 hrs: advanced prescribing/monitoring mastery ecosystem. |
| Medication Math | 74% | 48-80 hrs: count proof, route QA, screenshots, analytics. | 160-240 hrs: adaptive remediation and richer calculator workflows. | 300-450 hrs: best-in-class calculation engine with mastery evidence. |
| Simulations | 64% | 100-160 hrs: outcomes, debriefs, scoring, route QA. | 320-520 hrs: broad scenario library and readiness integration. | 700-1,000 hrs: full multi-profession simulation ecosystem. |
| Study Plans | 72% | 48-80 hrs: stronger persistence and remediation links. | 160-260 hrs: adaptive cross-module plans and analytics. | 320-500 hrs: fully personalized longitudinal coaching loop. |
| Analytics | 76% | 56-96 hrs: adoption/revenue/usage dashboards tied to prompts. | 180-300 hrs: complete cohort/product/revenue analytics. | 400-650 hrs: predictive retention and institutional analytics. |
| International | 34% | 500-800 hrs: choose one country and complete minimum hidden launch package. | 1,500+ hrs: country-specific content, SEO, paid UX, QA. | Not realistic within 12 months without reducing core work. |
| Institutional Foundations | 66% | 120-180 hrs: checkout, seats, cohort reporting, sales demo proof. | 360-560 hrs: school/hospital admin maturity and renewal lifecycle. | 800+ hrs: enterprise-grade integrations, procurement, and compliance workflows. |

## Phase 5: Marketing Priorities

| Area | Highest ROI Improvement | Effort | Audit Basis |
|---|---|---|---|
| Homepage | Replace generic/weak visuals with deep-state learner screenshots and feature counters. | Medium | Homepage 84%, screenshots 72%. |
| Pricing | Add "What You Get" proof blocks with counts, screenshots, and locked-feature upgrade context. | Medium | Pricing 80%; upgrade clarity drives conversion. |
| RN | Package US/Canada RN counts, CAT proof, NGN proof, and readiness proof. | Medium | RN 84%, strongest near-term sales story. |
| PN | Improve PN/RPN count proof, dedicated screenshots, and pathway-specific copy. | Medium | PN 74% marketing maturity. |
| NP | Show pathway selector, certification-specific readiness, and specialty screenshots. | High | NP 76% marketing maturity, product 70%. |
| New Graduate | Build "Pass The Exam. Thrive In Practice." proof from real activities. | High | New Grad 62% marketing maturity. |
| Allied | Create profession-specific screenshots and report-card examples. | High | Allied 68% marketing maturity. |
| SEO | Focus on indexation quality for high-value RN/PN/content pages before broad expansion. | Medium | SEO 82%, but content quality remains ongoing. |
| Screenshots | Generate Playwright screenshots from answered/rationale/reasoning states, not hubs. | Medium | Screenshots 72%; high conversion leverage. |
| FAQs | Refresh FAQs around value, trial, subscriptions, content counts, and pathway fit. | Low | FAQs 76%; relatively easy lift. |

## Phase 6: International Priorities

Only countries that can realistically reach launch readiness within 12 months should be considered.

| Launch Order | Country/Market | Recommendation | Rationale From Audit |
|---:|---|---|---|
| 1 | United States | Launch readiness push now. | US is already part of the core platform and scored 72% in international readiness. |
| 2 | Canada | Continue strengthening, not a new launch. | Canada scored 85% in international readiness and is core. |
| 3 | United Kingdom | Hidden build only; possible limited beta if core work is complete. | UK scored 42%; future content targets are largely unfilled. |
| 4 | Australia | Hidden build only. | Australia scored 39%; not realistic for full public launch without major content investment. |
| 5 | New Zealand | Defer public launch. | New Zealand scored 31%; not realistic within 12 months if revenue priorities remain first. |

12-month realistic public launch recommendation: United States only.

12-month hidden preparation recommendation: UK first, Australia second, New Zealand third.

Do not publicly launch UK, Australia, New Zealand, or Ireland until core Canada/U.S. revenue and reliability priorities are complete.

## Phase 7: Institutional Priorities

Minimum requirements before approaching schools:

- Institutional demo environment with realistic learner, cohort, faculty, and admin data.
- Seat purchase, assignment, removal, renewal, and usage reporting.
- Cohort-level readiness, lesson, flashcard, CAT, practice, clinical skills, and weak-area reporting.
- Privacy-safe faculty dashboards with clear RBAC.
- Billing proof for institutional contracts or a manual invoice workflow.
- Exportable progress and readiness reports.
- Support and onboarding documentation.
- Evidence package showing learner route reliability, entitlement controls, and content counts.

Minimum requirements before approaching hospitals:

- New Graduate pathway with patient safety, documentation, delegation, medication safety, prioritization, and emergency readiness activities.
- Clinical skills and simulation proof with outcomes/debriefs.
- Institutional cohort reporting and manager-facing dashboards.
- Renewal and seat lifecycle operations.

Minimum requirements before approaching residency programs:

- New Graduate readiness domains and report cards.
- Shift management, prioritization, delegation, documentation, medication safety, and code readiness content.
- Program-level progress reporting.
- Scenario/simulation completion evidence.

## Phase 8: Platform Strengthening Above 70%

These systems already scored above 70%. The highest ROI is to push them toward 95% rather than building unrelated new systems.

| System | Audit Score | Best-In-Class Improvement |
|---|---:|---|
| CAT Exams | 86% | Add more specialty/pathway proof, launch evidence, and deeper analytics. |
| Flashcards | 86% | Complete dynamic counts, notebook/remediation links, and mastery reporting. |
| RN | 84% | Fill thin US categories, add premium screenshots, and strengthen launch package. |
| Practice Exams | 83% | Improve rationale learning surface, deep screenshots, and paid-user smoke tests. |
| Readiness | 82% | Extend readiness parity across PN, NP, allied, new grad, and institutions. |
| Lessons | 82% | Harden catalog reliability, eliminate thin lessons, and add content quality gates. |
| Subscriptions | 82% | Add live renewal/cancellation/retention reporting and operational proof. |
| Homepage | 84% | Replace remaining weak screenshots and show real workflow depth. |
| SEO | 82% | Prioritize indexation quality for high-value pages. |
| Pricing | 80% | Add stronger product proof, counts, upgrade value, and trial clarity. |
| Trials | 80% | Improve eligibility monitoring and conversion analytics. |
| Paywalls | 80% | Complete route-level server entitlement matrix. |
| Labs | 78% | Expand learner activities, screenshots, and analytics. |
| Mobile UX | 78% | Run paid-user mobile validation and fix route-specific issues. |
| Empty States | 78% | Convert empty states into value/upgrade/retry surfaces. |
| Signup | 78% | Prove email verification and onboarding in production-like E2E. |
| Cancellation | 77% | Add production churn reasons and save-flow analytics. |
| PN/RPN | 76% | Add pathway-specific counts, tests, screenshots, and marketing proof. |
| Analytics | 76% | Connect adoption, revenue, retention, and feature usage. |
| Clinical Skills | 76% | Add profession-specific skill workflows and report cards. |

## Phase 9: Executive Roadmap

### 30-Day Plan

Goal: remove near-term revenue and reliability blockers.

1. Fix lesson catalog timeout/fallback behavior.
2. Complete premium entitlement route matrix for lessons, flashcards, practice, CAT, ECG, labs, medication math, pharmacology, clinical skills, simulations.
3. Generate first deep-state screenshots for homepage and pricing.
4. Complete live counts for RN/PN flashcards, questions, lessons, CAT, labs, med math, ECG, clinical skills.
5. Run paid-user smoke tests for signup, verification, trial, checkout, lessons, flashcards, practice, and CAT.
6. Create US launch-readiness evidence packet.

### 90-Day Plan

Goal: reach stronger US launch confidence and improve conversion.

1. Close US RN thin content categories.
2. Fix ECG clinical fidelity issues and publication gates.
3. Bring pharmacology to at least 80% with persisted class-level content and analytics.
4. Bring simulations to at least 80% with outcomes, debriefs, and scoring.
5. Improve pricing and upgrade surfaces with counts, screenshots, and locked-feature value.
6. Add PN/RPN-specific evidence: counts, screenshots, paid-user E2E.
7. Connect feature adoption analytics to upgrade prompts.
8. Build institutional demo package with seats, cohorts, and reporting.

### 12-Month Plan

Goal: concentrate on revenue, reliability, retention, and defensible differentiation.

1. Push CAT and flashcards toward 95% maturity.
2. Push RN launch readiness toward 90%+.
3. Push ECG from developing to advanced.
4. Push pharmacology from developing to mature/advanced.
5. Push simulations from developing to mature.
6. Push institutional foundations from developing to mature.
7. Push New Graduate from developing to mature.
8. Push Allied from developing to mature for top professions first.
9. Push NP from generic/core to certification-specific maturity.
10. Keep international hidden; prepare UK/Australia content only after Canada/U.S. revenue systems are stronger.

## Final Recommendation

NurseNest should spend the next year finishing and proving the systems that are already close to revenue maturity. The audit shows the platform does not need more disconnected concepts. It needs completion pressure on the highest-value existing systems: RN, CAT, flashcards, practice, readiness, lessons, ECG, pharmacology, simulations, pricing, entitlement, screenshots, subscription instrumentation, and institutional foundations.

The strongest sequence is:

Revenue proof first.
Reliability second.
Clinical differentiation third.
Institutional readiness fourth.
International preparation last.
