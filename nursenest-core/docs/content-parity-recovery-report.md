# Content Parity Recovery Report

Date: 2026-05-31
Status: Recovery roadmap based on repository-evidenced counts only

Source of truth: `docs/content-parity-audit.md`, expanded by exact instrumentation from `docs/content-instrumentation-report.md`.

No public routes, learner-facing pages, navigation, sitemap entries, entitlement changes, pricing changes, or publication flags were created. Future academies remain `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, and `adminOnly=true`.

## Executive Finding

The immediate parity blocker is not future academy planning. It is core RN, PN/RPN, and NP content maturity:

- RN committed snapshot gap: 70 lessons and 6980 questions.
- PN/RPN committed snapshot gap: 0 lessons and 3270 questions.
- NP committed snapshot gap varies by certification; CNPLE meets lesson minimum but remains short on questions, while US NP certifications are short on both lessons and questions.
- Flashcard, simulation, clinical pearl, memory anchor, and flashcard-output readiness cannot be scored as pathway-complete until instrumentation reaches the production source of truth for those asset types.

## Phase 1 - Content Instrumentation

Instrumentation was added through `scripts/content-parity-instrumentation.mts` and emits exact repository counts into `docs/content-instrumentation-report.md`.

Current exact instrumentation coverage:

| Asset Type | Repository-Evidenced Status |
| --- | --- |
| Lessons | Exact committed snapshot counts and exact generated-index counts |
| Questions | Exact committed snapshot counts and exact authored catalog counts for imported question files |
| Cases | 2 clinical case JSON items and 17 CNPLE LOFT cases |
| Simulations | 76 physiology monitor simulations, 4 ECG deterioration pathways, 6 pediatric ECG case simulations |
| Clinical Skills | Exact generated-index Procedures & Skills lesson category counts |
| Flashcards | 5 sample flashcards only; pathway count not reliably evidenced |
| Hints | Counted in imported authored question catalogs |
| Clinical Pearls | Counted as explicit clinicalPearl, teachingPoint, or clinicalJudgmentFocus evidence in imported question catalogs |
| Rationales | Counted in imported authored question catalogs |

## Phase 2 - RN Content Parity

Committed readiness snapshot:

| Metric | Current Exact Count | Target | Gap | Readiness |
| --- | --- | --- | --- | --- |
| Lessons | 430 | 500 | 70 | 86% |
| Questions | 1020 | 8000 | 6980 | 12.8% |
| Flashcards | Not reliably evidenced | 10000 | Numeric gap blocked | Not scoreable |
| Simulations | Pathway-mapped count not evidenced | 250 | Numeric gap blocked | Not scoreable |

Recovery priority:

1. Expand RN questions for sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, GI bleed, maternal emergencies, and pediatric emergencies.
2. Convert high-risk RN lessons into complete loops: lesson, flashcards, questions, case, simulation, and clinical skill.
3. Add explicit memory anchor and flashcard output fields to RN question shapes before monetization scoring.
4. Regenerate the committed readiness snapshot only after source counts and review status are reconciled.

## Phase 3 - RPN / PN Parity

Committed readiness snapshot:

| Metric | Current Exact Count | Target | Gap | Readiness |
| --- | --- | --- | --- | --- |
| Lessons | 355 | 300 | 0 | 100% |
| Questions | 730 | 4000 | 3270 | 18.3% |
| Flashcards | Not reliably evidenced | 5000 | Numeric gap blocked | Not scoreable |
| Simulations | Pathway-mapped count not evidenced | 150 | Numeric gap blocked | Not scoreable |

Recovery priority:

1. Build PN/RPN-scope questions for delegation, documentation, escalation, medication safety, and clinical judgment.
2. Keep PN/RPN content scope-safe: recognition, monitoring, reporting, safe implementation, documentation, and escalation.
3. Avoid NP diagnostic or prescribing depth in PN/RPN content.
4. Attach PN/RPN simulations to exact pathway metadata before claiming simulation parity.

## Phase 4 - NP Parity

Committed readiness snapshot by certification:

| Pathway | Exam | Lessons | Lesson Target | Lesson Gap | Lesson Readiness | Questions | Question Target | Question Gap | Question Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ca-np-cnple | CNPLE | 436 | 250 | 0 | 100% | 1496 | 2000 | 504 | 74.8% |
| us-np-fnp | FNP | 91 | 250 | 159 | 36.4% | 280 | 2000 | 1720 | 14% |
| us-np-agpcnp | AGPCNP | 110 | 250 | 140 | 44% | 260 | 2000 | 1740 | 13% |
| us-np-pmhnp | PMHNP | 105 | 250 | 145 | 42% | 250 | 2000 | 1750 | 12.5% |
| us-np-whnp | WHNP | 100 | 250 | 150 | 40% | 240 | 2000 | 1760 | 12% |
| us-np-pnp-pc | PNP-PC | 95 | 250 | 155 | 38% | 230 | 2000 | 1770 | 11.5% |

Recovery priority:

1. CNPLE should close its 504-question gap first because lesson coverage is already above the minimum threshold.
2. FNP, AGPCNP, PMHNP, WHNP, and PNP-PC require lesson and question expansion before commercialization.
3. NP questions must add advanced diagnostic reasoning, differential diagnosis, management planning, prescribing relevance, follow-up planning, and guideline-based clinical judgment.
4. ENP is requested in the program scope, but no committed pathway snapshot count was found in this evidence set; ENP remains unscored until a source pathway exists.

## Phase 5 - High-Risk Clinical Loop Completion

Repository-evidenced loop coverage:

| Topic | Generated Lessons | Authored Questions | Clinical Case JSON Items | Simulation Catalog Items | Loop Status |
| --- | --- | --- | --- | --- | --- |
| Sepsis | 97 | 9 | 1 | 13 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Shock | 26 | 6 | 0 | 8 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| ACS | 26 | 1 | 0 | 5 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Stroke | 33 | 9 | 0 | 3 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Respiratory Failure | 36 | 7 | 0 | 8 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| DKA | 22 | 2 | 0 | 3 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Hyperkalemia | 31 | 4 | 1 | 4 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| GI Bleed | 16 | 0 | 0 | 1 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Trauma | 12 | 1 | 0 | 1 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Maternal Emergencies | 24 | 1 | 0 | 0 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |
| Pediatric Emergencies | 100 | 6 | 0 | 0 | Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway |

Recovery priority order:

1. Sepsis
2. Shock
3. ACS
4. Stroke
5. Respiratory Failure
6. DKA
7. Hyperkalemia
8. GI Bleed
9. Trauma
10. Maternal Emergencies
11. Pediatric Emergencies

This order reflects clinical risk, exam relevance, existing evidence, and reuse potential across RN, PN/RPN, NP, ECG, Labs, Pharmacology, and future CCRN/CEN products.

## Phase 6 - Simulation Expansion

Exact simulation evidence exists, but parity is blocked by pathway mapping:

| Simulation Evidence | Exact Count |
| --- | --- |
| Physiology monitor simulations | 76 |
| ECG deterioration pathways | 4 |
| Pediatric ECG case simulations | 6 |

Roadmap:

1. Add a simulation inventory map that records profession, country, exam, tier, system, topic, clinical judgment stage, and publication status for every simulation.
2. Map existing simulations to RN, PN/RPN, NP, ECG, Lab, and Clinical Skills loops.
3. Prioritize missing simulations for high-risk topics before future academy simulation expansion.

## Phase 7 - Professional Practice Expansion

Professional practice is a parity priority because it affects NCLEX, REx-PN, CNPLE, new graduate readiness, institutional value, and real-world safety.

| Domain | Recovery Requirement |
| --- | --- |
| Delegation | RN and PN/RPN scope-specific lessons, questions, cases, and simulations |
| Documentation | Charting, refusal, incident, fall, escalation, and defensible documentation loops |
| Communication | SBAR, provider calls, family communication, and interprofessional escalation scenarios |
| Conflict Resolution | Scope conflict, unsafe assignment, provider disagreement, and family escalation scenarios |
| Ethics | Consent, confidentiality, advocacy, boundary, and professional accountability cases |
| Professionalism | Longitudinal new graduate and placement readiness cases |
| Leadership | Charge nurse, prioritization, staffing, delegation, and quality-improvement cases |
| Advocacy | Patient safety, escalation refusal, and vulnerable population scenarios |
| Quality Improvement | Error reporting, risk reduction, and systems thinking cases |
| Risk Management | Near miss, medication variance, documentation risk, and escalation failure cases |

## Phase 8 - Pharmacology Parity

The source audit records pharmacology as developing, with 20 categories and 100 medication mentions in prior evidence, but this instrumentation pass did not find a reliable pathway-level pharmacology lesson/question/flashcard count.

Recovery priority:

1. Build a pharmacology inventory registry before adding new pharmacology content.
2. Map medication classes to mechanism, indications, contraindications, monitoring, nursing implications, patient teaching, adverse effects, interactions, and clinical pearls.
3. Prioritize medication safety loops for insulin, anticoagulants, opioids, diuretics, antibiotics, cardiovascular drugs, respiratory drugs, psychiatric drugs, and emergency medications.
4. Preserve role scope: RN/PN medication administration and monitoring; NP prescribing and therapeutic decision-making.

## Phase 9 - Lab & ECG Parity

Exact evidence:

| Area | Exact Evidence |
| --- | --- |
| ECG deterioration pathways | 4 |
| Pediatric ECG case simulations | 6 |
| Clinical case JSON item involving hyperkalemia/ECG | 1 |

Recovery priority:

1. ECG: map deterioration pathways to RN, PN/RPN, NP, telemetry, emergency, and critical care learning loops.
2. Labs: create explicit inventory for CBC, electrolytes, renal labs, liver labs, coagulation, ABGs, cardiac markers, endocrine testing, and therapeutic drug monitoring.
3. Complete high-risk lab loops for hyperkalemia, DKA, sepsis lactate, GI bleed hemoglobin trend, AKI creatinine trend, ACS troponin, and anticoagulation monitoring.

## Phase 10 - Executive Priority Ranking

| Rank | Workstream | Why It Comes First | Revenue Impact | Learner Impact | SEO Impact | Clinical Impact | Institutional Value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | RN question enrichment and expansion | Largest commercial surface and largest exact question gap | High | High | High | High | High |
| 2 | PN/RPN question expansion | Large exact question gap with strong Canada/US monetization potential | High | High | Medium | High | High |
| 3 | NP certification parity | Per-certification gaps block premium NP monetization | High | High | Medium | High | Medium |
| 4 | Simulation pathway mapping | Simulation parity is the weakest maturity area despite existing authored simulation inventory | Medium | High | Medium | High | High |
| 5 | Flashcard instrumentation and regeneration | Flashcard parity cannot be scored from current repository evidence | High | High | Medium | Medium | Medium |
| 6 | High-risk loop completion | Sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, and GI bleed create cross-product value | High | High | High | High | High |
| 7 | Professional practice expansion | Delegation, documentation, and communication improve exam and placement readiness | Medium | High | Medium | High | High |
| 8 | Pharmacology registry | Needed before future pharmacology academy work can be evidence-based | Medium | High | High | High | Medium |
| 9 | Lab and ECG parity mapping | Existing ECG assets need pathway mapping; lab activity counts need stronger instrumentation | Medium | High | High | High | Medium |

## Readiness Summary

| Area | Current Readiness | Target Readiness | Gap |
| --- | --- | --- | --- |
| RN lessons | 86% | 95%+ | 70 committed-snapshot lessons |
| RN questions | 12.8% | 95%+ | 6980 committed-snapshot questions |
| PN/RPN lessons | 100% | 95%+ | Meets minimum count, still requires quality and loop proof |
| PN/RPN questions | 18.3% | 95%+ | 3270 committed-snapshot questions |
| NP certifications | Mixed | 95%+ | CNPLE question gap plus US NP lesson/question gaps |
| Flashcards | Not scoreable | 95%+ | Pathway count instrumentation missing |
| Simulations | Not scoreable by pathway | 95%+ | Simulation-to-pathway mapping missing |
| High-risk loops | Incomplete | 95%+ | Flashcard, simulation, case, and clinical-skill proof missing by pathway |

## Immediate Next Actions

1. Promote `scripts/content-parity-instrumentation.mts` into a CI audit command after review.
2. Add pathway-level flashcard inventory instrumentation.
3. Add simulation-to-pathway mapping instrumentation.
4. Add explicit memory anchor and flashcard output fields to question quality contracts.
5. Close RN and PN/RPN question gaps before adding future academy content.
6. Close NP per-certification gaps before launching premium NP pathways.
7. Do not begin major future academy expansion until core RN, PN/RPN, and NP parity reach 95%+ by exact repository evidence.
