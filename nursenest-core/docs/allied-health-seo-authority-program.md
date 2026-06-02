# Allied Health SEO Authority Program

## Objective

The Allied Health SEO Authority Program creates a scalable, indexable content foundation for allied health organic search. It targets high-intent education, career, placement, study, interview, clinical skill, exam, salary, and certification searches for:

- Respiratory Therapy
- Paramedicine
- Occupational Therapy
- Physiotherapy
- Medical Laboratory Technology
- Personal Support Worker

## Implementation

Core registry:

- `src/lib/seo/allied-health-authority-program.ts`

Public route templates:

- `/allied-health/[slug]/career`
- `/allied-health/[slug]/interview-questions`
- `/allied-health/[slug]/placement-guide`
- `/allied-health/[slug]/study-guide`
- `/allied-health/[slug]/skills/[skillSlug]`

The routes are generated from a single registry so content can scale without one-off page implementations. The seed set includes six professions, nine keyword cluster categories per profession, five authority page families per profession, and initial clinical skill pages with FAQs, internal links, and practice activities.

## Keyword Clusters

Each profession includes clusters for:

- Educational keywords
- Career keywords
- Placement keywords
- Study keywords
- Interview keywords
- Clinical skills keywords
- Exam keywords
- Salary keywords
- Certification keywords

These clusters are stored with the profession profile and rendered on career authority pages for content planning and future expansion.

## Career Hubs

Implemented career hub pages:

- How To Become A Respiratory Therapist In Canada
- How To Become A Paramedic In Canada
- How To Become An Occupational Therapist In Canada
- How To Become A Physiotherapist In Canada
- How To Become A Medical Laboratory Technologist In Canada
- How To Become A Personal Support Worker In Canada

Each page includes role overview, education pathway, licensing or certification research guidance, placement preparation, salary research guidance, study priorities, clinical skill links, and internal links into the allied health ecosystem.

## Interview Hubs

Each profession generates a `50 [Profession] Interview Questions` page. The questions emphasize clinical reasoning, patient safety, communication, feedback, scope, placement readiness, and profession-specific skills.

## Placement Hubs

Each profession receives a clinical placement guide with before-placement, during-placement, after-placement, and readiness checklist sections.

## Study Hubs

Each profession receives a study guide connecting high-value skill topics, clinical reasoning review, quick review routines, and practice activity links.

## Clinical Skill Pages

The first skill-page wave includes:

- Respiratory Therapy: ABG Interpretation, Ventilator Settings, Oxygen Delivery Devices, Airway Suctioning
- Paramedicine: Primary Survey, Secondary Survey, Trauma Assessment, Stroke Screen
- Occupational Therapy: ADL Assessment, Cognitive Screening, Home Safety Assessment, Adaptive Equipment
- Physiotherapy: Mobility Assessment, Gait Assessment, Range Of Motion, Fall Risk Assessment
- Medical Laboratory Technology: Specimen Collection, Critical Value Reporting, Hemolysis Recognition, Quality Control
- PSW: Safe Transfers, Infection Control, Skin Integrity Checks, Dementia Communication

Each skill page includes:

- Learning objectives
- Clinical context
- Core steps
- Common mistakes
- Practice activities
- FAQs
- Internal links

## Governance

The program intentionally uses registry-driven routes instead of manual one-page-per-topic implementations. To expand toward hundreds or thousands of pages, add new `clinicalSkills`, study guides, and profession profiles to the registry while preserving:

- Indexable canonical routes
- Breadcrumb JSON-LD
- FAQ JSON-LD for skill pages
- Semantic theme tokens
- Internal linking to profession hubs, study guides, placement guides, and interviews

Automated coverage:

- `src/lib/seo/allied-health-authority-program.test.ts`
