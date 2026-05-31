# Future Products Product Readiness Framework

Status: Governance only. Hidden/admin-only. No public routes, navigation, pricing, sitemap, entitlement, or learner-facing exposure.

Default lock for every incubating product:

```txt
published = false
launchReady = false
visibleInNavigation = false
indexable = false
adminOnly = true
```

## Universal Scoring

Each category is scored from 0-100.

- 0-59: Not ready
- 60-79: Development
- 80-84: Internal review candidate
- 85-89: Publish consideration only
- 90-94: Premium tier candidate
- 95-100: Flagship launch candidate

Commercial launch eligibility requires:

- Overall readiness: 95+
- Clinical accuracy: 95+
- Educational depth: 90+
- Monetization readiness: 100%
- Technical readiness: 95+
- Operational readiness: 90+
- All launch locks intentionally reviewed and changed by authorized release owner

## Readiness Categories

| Category | Purpose | Scoring Methodology | Evidence Requirements | Pass/Fail Threshold | Audit Requirements |
|---|---|---|---|---|---|
| Content Completeness | Prove the product has enough complete educational assets to support the learner journey. | Score weighted against approved targets for lessons, questions, flashcards, simulations, skills, reports, and readiness domains. | Inventory report, target table, coverage by domain, gaps, review queue. | Pass at 95+ for launch; fail if any critical domain is below 90. | Monthly during development; weekly during launch window. |
| Clinical Accuracy | Ensure all clinical claims, interventions, and safety guidance are correct and current. | Clinical reviewer score, high-risk content sampling, reference verification, contradiction review. | Reviewer signoff, evidence sources, clinical risk log, revision history. | Pass at 95+; fail if unresolved high-risk issue exists. | Required before beta, soft launch, and commercial launch. |
| Educational Depth | Confirm content teaches reasoning, not memorization or thin summaries. | Rubric for objectives, reasoning, examples, application, remediation, and learner feedback. | Lesson samples, rationale samples, simulation debriefs, learning objective map. | Pass at 90+; fail if content is generic, scaffold-only, or duplicated. | Biweekly content QA. |
| Question Quality | Validate item realism, distractors, rationales, blueprint mapping, difficulty, and adaptive value. | Psychometric/editorial rubric plus automated missing-field checks. | Question audit dashboard, rationale audit, distractor audit, blueprint map. | Pass at 95+; fail if any published item lacks rationale, metadata, or review. | Every import, generation batch, and pre-release. |
| Flashcard Quality | Ensure flashcards are clinically useful, not definition-only. | Score front/back clarity, clinical pearl, memory anchor, exam relevance, duplicate risk. | Flashcard readiness report, duplicate report, sample deck review. | Pass at 90+; fail if duplicate or one-line cards dominate. | Weekly during deck build. |
| Simulation Quality | Confirm simulations teach decision-making, safety, communication, documentation, and debriefing. | Scenario realism, branching logic, role scope, feedback quality, completion analytics. | Simulation scripts, decision map, debrief report, learner scoring model. | Pass at 90+; high-risk simulations need 95+. | Simulation QA before beta and launch. |
| Clinical Skills Quality | Verify procedural content is accurate, scoped, safe, and teachable. | Checklist completeness, contraindications, equipment, common errors, escalation criteria. | Skill checklist, reviewer notes, safety alerts, media/screenshot inventory. | Pass at 90+; procedures with medication/device risk require 95+. | Clinical procedure audit before release. |
| Analytics Readiness | Ensure the product can measure learning, readiness, weak areas, and progress. | Event coverage, dashboard definitions, remediation mapping, reporting reliability. | Event schema, KPI definition, analytics QA report, sample learner data. | Pass at 90+; fail if no learner progress loop exists. | Pre-beta and post-beta. |
| Monetization Readiness | Confirm pricing, tiering, trials, upgrades, retention, and reporting are documented and tested. | Binary critical gates plus score for strategy depth. | Tier map, checkout proof, upgrade path, renewal/retention plan, revenue report. | Launch pass requires 100%. | Before any paid exposure. |
| Institutional Readiness | Prepare schools, cohorts, reporting, assignments, and admin support. | Cohort workflows, instructor reporting, completion evidence, support model. | Institutional use case, report mockups, admin roles, data export policy. | Pass at 90+ for institutional launch. | Prior to school pilots. |
| Technical Readiness | Confirm reliability, performance, accessibility, entitlement, data, and QA coverage. | Test pass rate, route stability, performance, auth/paywall safety, error monitoring. | CI evidence, route checks, accessibility report, error budget. | Pass at 95+; fail on auth, entitlement, privacy, or data loss risk. | Before beta, launch, and after major changes. |
| Marketing Readiness | Ensure assets exist to explain, sell, and support adoption. | Completion of screenshot, demo, video, comparison, sales, and launch asset inventory. | Screenshot set, demo account, launch copy, comparison sheets, sales deck. | Pass at 90+; commercial launch requires complete inventory. | Launch readiness review. |
| SEO Readiness | Confirm indexable strategy only when product is ready and useful. | Metadata, schema, internal links, content depth, canonical, sitemap, noindex controls. | SEO brief, route inventory, indexing toggle proof, noindex proof until launch. | Pass at 90+; fail if unfinished content can index. | Pre-soft-launch and pre-indexing. |
| Operational Readiness | Ensure support, governance, maintenance, refresh, and incident response exist. | Support runbooks, owner assignment, update cadence, QA cadence, incident plans. | Owner map, support macros, maintenance calendar, escalation runbook. | Pass at 90+; fail if no accountable owner. | Quarterly and launch gate review. |

## Final Readiness Formula

Suggested weighting:

- Content completeness: 12%
- Clinical accuracy: 14%
- Educational depth: 10%
- Question quality: 10%
- Flashcard quality: 6%
- Simulation quality: 6%
- Clinical skills quality: 5%
- Analytics readiness: 6%
- Monetization readiness: 8%
- Institutional readiness: 5%
- Technical readiness: 8%
- Marketing readiness: 4%
- SEO readiness: 3%
- Operational readiness: 3%

Any critical blocker overrides the weighted score.
