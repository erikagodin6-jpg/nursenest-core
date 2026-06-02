# Content Factory Dashboard

Date: 2026-05-31

Status: internal planning dashboard. This dashboard defines scale targets and governance controls; it does not authorize automatic publication or learner exposure.

## Objective

Build the infrastructure to scale NurseNest from tens of thousands of educational assets to hundreds of thousands while preserving clinical quality, relationship mapping, content reuse, and learner experience consistency.

## Machine-Readable Factory Artifacts

| Artifact | Purpose |
| --- | --- |
| `src/lib/content-factory/content-relationship-engine.ts` | Connects lessons, flashcards, questions, simulations, clinical skills, readiness domains, and study plans. |
| `src/lib/content-factory/content-depth-requirements.ts` | Defines minimum standards for lessons, flashcards, questions, simulations, and clinical skills. |
| `src/lib/content-factory/question-generation-factory.ts` | Defines MCQ, SATA, Bowtie, Matrix, Trend, Case Study, Prioritization, Delegation, and Clinical Judgment requirements. |
| `src/lib/content-factory/clinical-pearl-and-hint-database.ts` | Sets 50,000+ clinical pearl and 50,000+ hint targets. |
| `src/lib/content-factory/case-and-simulation-factory.ts` | Sets 10,000+ clinical case and 5,000+ simulation targets. |
| `src/lib/content-factory/ai-content-workflow-templates.ts` | Defines future AI workflow templates with quality gates and no auto-publishing. |
| `src/lib/content-factory/content-governance-engine.ts` | Scores content and rejects placeholder, duplicate, weak, or disconnected content. |

## Factory Targets

| Asset Type | Target |
| --- | ---: |
| Clinical Pearls | 52,000 |
| Hints | 50,000 |
| Case Studies | 10,000 |
| Simulations | 5,040 |
| Question Item Types | 9 |
| AI Workflow Templates | 7 |

## Content Relationship Requirements

Every educational asset should know:

- Related Lessons.
- Related Flashcards.
- Related Questions.
- Related Simulations.
- Related Clinical Skills.
- Related Readiness Domains.

The relationship engine rejects self-references, duplicate relations, wrong-kind buckets, and disconnected assets.

## Content Depth Standards

| Asset | Required Quality |
| --- | --- |
| Lessons | Minimum sections, clinical judgment, safety, knowledge checks, related content, and further reading. |
| Flashcards | Clinical relevance, memory hook, related lesson, and related questions. |
| Questions | Hint, correct answer, why correct, why incorrect, clinical application, clinical pearl, exam strategy, related lesson, related flashcards. |
| Simulations | History, assessment, diagnostics, decision points, outcomes, documentation, and debrief. |
| Clinical Skills | Indications, contraindications, equipment, procedure, safety checks, documentation, competency mapping. |

## Question Factory Coverage

Supported generation pipelines:

- MCQ.
- SATA.
- Bowtie.
- Matrix.
- Trend.
- Case Study.
- Prioritization.
- Delegation.
- Clinical Judgment.

Every generated question must include premium rationale and remediation structure.

## Clinical Pearl Database

Target: 50,000+ reusable clinical pearls.

Categories:

- Medical-Surgical.
- Critical Care.
- Emergency.
- Mental Health.
- Maternity.
- Pediatrics.
- Community Health.
- Leadership.
- Pharmacology.
- Labs.
- ECG.
- NP.
- Allied Health.

Clinical pearls are stored separately so they can be reused across lessons, questions, flashcards, simulations, and report cards.

## Hint Database

Target: 50,000+ reusable hints.

Types:

- Assessment.
- Prioritization.
- Pharmacology.
- Labs.
- ECG.
- Clinical Judgment.
- Diagnostics.
- Professional Practice.

Hints must guide thinking and must never reveal answers.

## Case Study Factory

Target: 10,000+ cases.

Professions:

- RN.
- RPN.
- NP.
- RT.
- Paramedic.
- MLT.
- OT.
- PT.
- Social Work.
- Psychotherapy.

Each case requires:

- History.
- Assessment.
- Diagnostics.
- Decision Points.
- Outcomes.
- Documentation.
- Debrief.

## Simulation Factory

Target: 5,000+ simulations.

Levels:

- Foundational.
- Intermediate.
- Advanced.
- Expert.

Domains:

- Medical-Surgical.
- Critical Care.
- Emergency.
- Mental Health.
- Pediatrics.
- Women's Health.
- Community.
- NP.
- Allied Health.

## Coverage Tracking

| Axis | Required Coverage |
| --- | --- |
| Country | Canada, United States, United Kingdom, Australia, New Zealand, future international markets. |
| Profession | RN, RPN/PN/LPN, NP, Allied Health, Pre-Nursing, Admissions. |
| Exam | NCLEX-RN, NCLEX-PN, REx-PN, CNPLE, NMC CBT, NMBA, NCNZ, TEAS, HESI, CASPER, specialty certifications. |
| Quality | Governance score, duplicate score, related-content completeness, rationale completeness, clinical pearl/hint presence. |
| Reuse | Global core, country supplement, exam supplement, specialty supplement. |

## Publication Gate

Generated content must not publish automatically.

Minimum publication requirements:

1. Governance score >= 85.
2. No placeholder content.
3. No duplicate content.
4. Required depth fields complete.
5. Clinical pearl present where applicable.
6. Hint present where applicable.
7. Rationale and distractor analysis complete for questions.
8. Related content links present.
9. Country/exam/profession tags correct.
10. Clinical/editorial review complete.

## Operating Principle

Scale should come from reusable structure, not volume for volume's sake. The content factory should make high-quality content easier to maintain, not easier to flood into the product.
