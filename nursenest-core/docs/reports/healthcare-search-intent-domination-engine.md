# Healthcare Search Intent Domination Engine

Generated: 2026-05-31T06:08:46.397Z

## Objective

Build NurseNest into a healthcare learner question-and-answer authority system for Google searches, AI Overview citations, featured snippets, People Also Ask, voice search, and long-tail discovery.

The operating principle is simple: learners search questions before they search broad topics.

## Question Database Contract

Each question tracks:

- Question
- Profession
- Topic
- Search intent
- Search volume
- Difficulty
- Traffic opportunity
- Conversion opportunity
- Cluster
- Answer status
- Visibility targets

## Seed Inventory

| Metric | Count |
| --- | ---: |
| Current seed questions | 33 |
| Year 1 target | 10,000 |
| Remaining to Year 1 target | 9,967 |
| Draft backlog | 33 |
| Review backlog | 0 |
| Refresh backlog | 0 |

## Questions By Profession

- RN: 9
- Multiple: 1
- NP: 6
- Pre-Nursing: 5
- RT: 3
- Paramedic: 3
- OT: 2
- PT: 2
- MLT: 2

## Questions By Intent

- definition: 15
- interpretation: 1
- comparison: 3
- study_strategy: 5
- exam_format: 2
- clinical_priority: 1
- career: 3
- scope: 1
- procedure: 2

## Highest Opportunity Questions

| Question | Profession | Intent | Cluster | Traffic | Conversion | Score |
| --- | --- | --- | --- | ---: | ---: | ---: |
| How Long Should I Study For NCLEX? | RN | study_strategy | NCLEX | 94 | 90 | 89 |
| Is HESI Harder Than TEAS? | Pre-Nursing | comparison | Admissions | 91 | 88 | 84 |
| What Is An ABG? | Multiple | definition | ABG Interpretation | 92 | 78 | 81 |
| What Score Do I Need On TEAS? | Pre-Nursing | study_strategy | TEAS | 89 | 86 | 81 |
| What Does An Occupational Therapist Do? | OT | career | OT Careers | 91 | 72 | 80 |
| What Is The Glasgow Coma Scale? | Paramedic | definition | Neurologic Assessment | 93 | 68 | 79 |
| What Is CASPER? | Pre-Nursing | definition | CASPER | 84 | 82 | 78 |
| What Does A Physiotherapist Do? | PT | career | PT Careers | 90 | 70 | 78 |
| What Is NCLEX CAT? | RN | exam_format | NCLEX | 82 | 86 | 77 |
| How Do Ventilators Work? | RT | definition | Ventilator Management | 88 | 76 | 77 |
| What Is Heart Failure? | RN | definition | Heart Failure | 86 | 74 | 76 |
| How Long Should I Study For HESI? | Pre-Nursing | study_strategy | HESI | 82 | 85 | 76 |

## Required Answer Structure

Every answer page must include:

- short_answer
- expanded_answer
- clinical_context
- common_mistakes
- related_topics
- related_resources
- snippet_block

## AI Overview And Snippet Optimization

- Place a direct one-paragraph answer near the top of the page.
- Use precise headings that repeat the natural-language question.
- Include concise definitions, comparison tables, and step-by-step blocks where relevant.
- Connect claims to reviewed clinical or exam-prep references before publication.

## Internal Linking Requirements

Every question page links to:

- related_diseases
- related_medications
- related_lessons
- related_questions
- related_simulations
- related_flashcards
- related_care_plans
- study_guides
- certification_guides

## Conversion Path Requirements

- Account creation CTA: Create a free account to save this answer and build a study plan.
- Trial CTA: Try related practice questions, flashcards, and study resources.
- Subscription CTA: Unlock full practice, simulations, readiness tracking, and adaptive remediation.

## FAQ Hubs

### Heart Failure FAQ

- Cluster: Heart Failure
- Profession: RN
- Canonical path: /faq/heart-failure-faq
- Questions: What Is Heart Failure?; What Is BNP?

### NCLEX FAQ

- Cluster: NCLEX
- Profession: RN
- Canonical path: /faq/nclex-faq
- Questions: What Is NCLEX CAT?; How Long Should I Study For NCLEX?; What Is A Bowtie Question?

### CNPLE FAQ

- Cluster: CNPLE
- Profession: NP
- Canonical path: /faq/cnple-faq
- Questions: What Is CNPLE?

### RT FAQ

- Cluster: Respiratory Therapy
- Profession: RT
- Canonical path: /faq/rt-faq
- Questions: What Is An ABG?; How Do Ventilators Work?; What Is PEEP?; What Is CPAP?

### Paramedic FAQ

- Cluster: Paramedicine
- Profession: Paramedic
- Canonical path: /faq/paramedic-faq
- Questions: What Is A Primary Survey?; What Is A Secondary Survey?; What Is The Glasgow Coma Scale?

### TEAS FAQ

- Cluster: TEAS
- Profession: Pre-Nursing
- Canonical path: /faq/teas-faq
- Questions: What Score Do I Need On TEAS?; Can I Pass TEAS Without Chemistry?; Is HESI Harder Than TEAS?

### HESI FAQ

- Cluster: HESI
- Profession: Admissions
- Canonical path: /faq/hesi-faq
- Questions: How Long Should I Study For HESI?; Is HESI Harder Than TEAS?


## Acquisition Guardrails

- Build around natural-language learner questions, not keyword-only topics.
- Prefer one excellent answer page over many shallow variants.
- Keep answer blocks direct enough for snippets while preserving clinical depth.
- Link every answer to relevant premium training surfaces.
- Use account creation only when saving, planning, tracking, or practicing creates real learner value.
- Do not publish unreviewed medical, exam, or clinical claims.
