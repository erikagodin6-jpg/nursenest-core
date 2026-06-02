# Content Maturity Gap Analysis

Date: 2026-06-01
Status: 95% maturity acceleration roadmap

Source of truth: `docs/content-maturity-dashboard.md`, supported by `docs/content-investment-dashboard.md`, `docs/content-instrumentation-report.md`, `docs/simulation-master-inventory.md`, `docs/high-risk-topic-loop-audit.md`, and pathway completion roadmaps.

Future products remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

This analysis uses directional maturity scores from the Content Maturity Dashboard and exact repository evidence where available. It does not create public routes, learner-facing products, monetization surfaces, or public academy exposure.

## Maturity Gate

A major pathway or system is mature only when it reaches:

| Dimension | Minimum Target |
| --- | ---: |
| Coverage | 90% |
| Depth | 90% |
| Reasoning | 90% |
| Readiness | 90% |
| Quality | 90% |
| Simulation coverage | 85% |

For current core revenue pathways, commercial target is higher:

| Pathway | Commercial Target |
| --- | ---: |
| RN | 95%+ |
| RPN / PN | 95%+ |
| CNPLE | 90%+ |
| US NP specialties | 90%+ |

## Pathway Gap Model

| Pathway | Current Overall | Target | Gap | Simulation Current | Simulation Target | Estimated Effort | ROI Rank | Primary Maturity Blockers |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| RN | 74% | 95% | 21 pts | 45% | 85% | Large | 1 | Question volume, high-risk loop completion, simulation parity, flashcard quality |
| RPN / PN | 66% | 95% | 29 pts | 35% | 85% | Large | 2 | Scope-specific questions, escalation content, simulation parity, documentation/delegation loops |
| CNPLE | 70% | 90% | 20 pts | 35% | 85% | Medium-large | 5 | Flashcard gap, question gap, diagnostic reasoning depth, simulation mapping |
| FNP | 44% family baseline for US NP specialties | 90% | 46 pts | 20% | 85% | Very large | 6 | Specialty-specific questions, diagnostic reasoning, prescribing, simulation inventory |
| AGPCNP | 44% family baseline | 90% | 46 pts | 20% | 85% | Very large | 7 | Adult-gerontology management depth, prescribing, cases, simulations |
| PMHNP | 44% family baseline | 90% | 46 pts | 20% | 85% | Very large | 8 | Psychiatric assessment, psychopharmacology, safety cases, longitudinal management |
| WHNP | 44% family baseline | 90% | 46 pts | 20% | 85% | Very large | 9 | Reproductive health depth, pregnancy-related risk, prescribing, cases |
| PNP-PC | 44% family baseline | 90% | 46 pts | 20% | 85% | Very large | 10 | Pediatric primary care, developmental reasoning, family education, cases |
| Pre-Nursing | 56% | 90% | 34 pts | Not required | Not required | Medium | 11 | Admissions funnel depth, prerequisite study planning, foundational science scaffolding |
| Admissions | 28% | 90% | 62 pts | Not required | Not required | Medium | 12 | Low content coverage, weak readiness model, missing conversion support |
| Allied | 36% | 90% | 54 pts | 20% | 85% | Very large | 13 | Aggregate-only maturity, profession-specific credibility, simulations, competency mapping |
| New Graduate | 40% | 90% | 50 pts | 20% | 85% | Very large | 4 | Shift survival, documentation, communication, simulations, institutional reporting |

## ROI Ranking Logic

Ranking favors current revenue protection, learner safety, retention impact, and reuse across the learning graph. It intentionally does not prioritize future academies or allied expansion ahead of core RN, RPN/PN, NP, flashcard, pharmacology, ECG, lab, and simulation maturity.

| Rank | Workstream | Why It Moves Maturity Fastest |
| ---: | --- | --- |
| 1 | RN high-risk loop and question completion | Largest current revenue pathway and highest exam-success impact |
| 2 | RPN / PN completion | Strong revenue protection and clear scope-specific gaps |
| 3 | Simulation recovery | Largest system-wide maturity gap and strongest clinical judgment signal |
| 4 | New Graduate hidden readiness | Strong retention and institutional potential once core RN/RPN gaps improve |
| 5 | CNPLE completion | Most mature NP pathway and nearest NP commercialization opportunity |
| 6 | FNP completion | Highest US NP expansion opportunity but larger content-depth gap |
| 7 | Pharmacology maturity | Cross-pathway safety layer for RN, PN, NP, ECG, labs, and simulations |
| 8 | ECG maturity | Premium differentiation and deterioration-recognition value |
| 9 | Flashcard quality | Retention and adaptive remediation amplifier |
| 10 | Lab maturity | Clinical reasoning and diagnostic interpretation support |

## Lowest Scoring System Priorities

| System | Current Overall | Target | Gap | Simulation Current | Roadmap |
| --- | ---: | ---: | ---: | ---: | --- |
| Pharmacology | 47% | 90% | 43 pts | 25% | Build medication-class registry, medication safety cases, monitoring links, toxicity loops |
| Cases | 45% | 90% | 45 pts | 30% | Expand NGN, branching, longitudinal, interprofessional, deterioration cases |
| Simulations | 45% | 85%+ | 40 pts | 35% | Add profession, exam, topic, NCJMM, debrief, and readiness mapping |
| ECG | 54% | 90% | 36 pts | 40% | Expand recognition, telemetry, escalation, medication effects, deterioration pathways |
| Flashcards | 54% | 90% | 36 pts | Not applicable | Add clinical relevance, why-it-matters, links, topic status counts |
| Labs | 59% | 90% | 31 pts | 35% | Add critical-value, trend, medication-monitoring, and pattern-recognition activities |

## System Maturity Improvement Sequence

| Sequence | System | Missing Components To Add Before 90% |
| ---: | --- | --- |
| 1 | Simulations | Status fields, pathway mapping, exam mapping, readiness domains, recovery pathways, outcome scoring |
| 2 | Cases | NGN case registry, branching case taxonomy, longitudinal case progression, case-to-question reuse map |
| 3 | Pharmacology | Medication-class registry, interaction scenarios, toxicity pathways, medication-lab and medication-ECG links |
| 4 | ECG | ECG question bank, telemetry workflow registry, deterioration pathway library, escalation documentation cases |
| 5 | Flashcards | Published/draft/review counts, topic-level counts, clinical relevance fields, cross-linking |
| 6 | Labs | Lab simulation registry, abnormal-value action maps, trend interpretation cases, escalation thresholds |

## High-Risk Topic Completion Requirement

No high-risk topic is mature until it has all of:

- Lesson
- Flashcards
- Questions
- NGN or clinical case
- Simulation
- Clinical skill
- Readiness domain
- Clinical pearls, hints, and rationales
- Pathway and exam mapping

Current audit status from `docs/high-risk-topic-loop-audit.md`: all listed high-risk topics remain incomplete.

## Governance Rule

Content generation is blocked unless it closes a measured maturity gap or creates missing instrumentation needed to measure maturity safely.

