# Organic Traffic & EEAT Authority Expansion Program

## Objective

Build NurseNest into a healthcare education authority that can earn organic traffic before learners are ready to purchase
exam preparation. The program must prioritize clinical usefulness, EEAT governance, internal linking, and product discovery
over raw page count.

## Implemented Foundation

- Shared healthcare authority engine: `src/lib/authority/healthcare-authority-content-engine.ts`
- Public index route: `/healthcare`
- Public detail route: `/healthcare/[category]/[slug]`
- XML sitemap inclusion: `sitemap-authority-clusters.xml`
- Dashboard generator: `scripts/generate-authority-content-dashboard.mts`
- Dashboard output: `docs/content-authority-dashboard.md`
- Healthcare topical authority network: `docs/healthcare-topical-authority-network.md`
- Contract tests: `src/lib/authority/healthcare-authority-content-engine.test.ts`

## Authority Libraries

| Library | Route | Phase-One Target | Long-Term Target |
| --- | --- | ---: | ---: |
| Disease & Condition Library | `/healthcare/conditions/[slug]` | 200 | 1,000 |
| Medication Library | `/healthcare/medications/[slug]` | 250 | 5,000 |
| Nursing Care Plan Library | `/healthcare/care-plans/[slug]` | 500 | 1,000 |
| Laboratory Interpretation Library | `/healthcare/labs/[slug]` | 500 | 1,000 |
| Clinical Skills Library | `/healthcare/clinical-skills/[slug]` | 500 | 2,000 |
| Allied Health Career Library | `/healthcare/allied-careers/[slug]` | 100 | 250 |
| Allied Health Study Library | `/healthcare/allied-study/[slug]` | 300 | 1,000 |
| Interview Preparation Library | `/healthcare/interview-prep/[slug]` | 100 | 250 |
| Placement Success Library | `/healthcare/placements/[slug]` | 100 | 250 |
| Certification & Licensing Library | `/healthcare/certifications/[slug]` | 100 | 300 |

## Seed Coverage

The first seed pages establish route, schema, search, quality-gate, and internal-linking coverage for every library:

- Heart Failure
- Furosemide
- Potassium
- Oxygen Administration
- Heart Failure Nursing Care Plan
- How To Become A Respiratory Therapist In Canada
- ABG Interpretation Guide
- 50 Nursing Interview Questions
- Nursing Placement Survival Guide
- NCLEX-RN Study Guide

These pages are foundations for the content model, not final volume targets.

## Priority Roadmap Registry

The executable backlog lives in `AUTHORITY_CONTENT_ROADMAP` inside
`src/lib/authority/healthcare-authority-content-engine.ts`.

The roadmap currently captures the first high-priority topic queue across:

- Disease pages such as COPD, asthma, pneumonia, pulmonary embolism, ARDS, sepsis, stroke, atrial fibrillation, AKI,
  CKD, DKA, hyperkalemia, and hyponatremia
- Medication pages such as metoprolol, digoxin, heparin, warfarin, apixaban, insulin, vancomycin, ceftriaxone,
  metformin, lisinopril, amlodipine, and atorvastatin
- Care plans such as COPD, pneumonia, stroke, sepsis, diabetes, DKA, and postoperative care
- Lab interpretation pages such as sodium, troponin, BNP, lactate, hemoglobin, platelets, and creatinine
- Clinical skills such as Foley catheter insertion, tracheostomy care, chest tube management, central line care, wound
  care, glucose monitoring, and medication administration
- Allied health study pages for respiratory therapy, paramedicine, MLT, OT, and PT
- Interview, placement, and certification pages for nursing, RT, paramedicine, MLT, OT, PT, RN, PN, and NP pathways

This roadmap is not published content. It is the controlled queue for future clinician-reviewed page production.

## Topic Cluster Domination

The topic ownership system is documented in `docs/topic-cluster-domination-system.md` and implemented through
`AUTHORITY_TOPIC_CLUSTERS`.

Phase-one nursing cluster priority:

1. Heart Failure
2. COPD
3. Diabetes
4. Sepsis
5. Pneumonia
6. Stroke
7. AKI
8. CKD
9. Atrial Fibrillation
10. Myocardial Infarction

Second-wave allied clusters:

- Respiratory Therapy
- Paramedicine
- Occupational Therapy
- Physiotherapy
- Medical Laboratory Technology

Cluster pages must be internally linked to their parent pillar, sibling resources, related clusters, and premium
NurseNest training surfaces.

## Healthcare Topical Authority Network

Phase 3 extends clusters into a multi-layer knowledge network across:

- Professions
- Body systems
- Conditions
- Learning assets
- Specialty hubs
- Allied health hubs
- Certification hubs
- Canadian advantage tracks

The executable implementation lives in `buildHealthcareKnowledgeGraph()`, `buildAuthorityScoreEngine()`,
`detectAuthorityContentGaps()`, and `buildAuthorityUserJourneyNetwork()` inside
`src/lib/authority/healthcare-authority-content-engine.ts`.

This network connects public authority pages to related lessons, flashcards, questions, simulations, labs, clinical
skills, care plans, study plans, and clinical reasoning pathways while preserving subscription gating for premium
training experiences.

## Programmatic Content Production Pipeline

The manufacturing and QA system is documented in `docs/programmatic-content-production-pipeline.md`.

Every page must move through:

Keyword Opportunity -> Cluster Assignment -> Content Brief -> Outline Creation -> Draft Creation -> Clinical Expansion ->
Internal Linking -> QA Review -> Clinical Review -> EEAT Review -> Publication -> Performance Monitoring.

No direct publication is allowed. Anything below the `90/100` quality threshold returns for revision.

## EEAT Standard

Every authority page requires:

- Author or editorial owner
- Reviewer name
- Credentials
- Specialty
- Review date
- Clinical review status
- Publication date
- Last updated date
- Review cycle due date
- Change history
- References
- Related internal links
- Clinical pearls
- Common mistakes
- FAQs

Pages may be indexed only when they pass the quality gate and are appropriate for public visibility.

## Internal Linking Standard

Every page should connect to related:

- Conditions
- Medications
- Labs
- Care plans
- Clinical skills
- Allied study guides
- Career guides
- Interview guides
- Placement guides
- Certification guides
- Lessons
- Practice questions
- Flashcards
- Simulations
- NurseNest tools

No orphan pages should be added.

## Monetization Guardrails

Organic content must act as acquisition, not replacement for subscription value.

Public pages may explain diseases, medications, labs, skills, careers, placements, interviews, certifications, and basic
care plan examples. Premium training remains protected: question banks, CAT exams, NGN item types, simulations, ECG,
telemetry, advanced labs, advanced pharmacology, study plans, readiness analytics, adaptive learning, recommendations,
clinical reasoning pathways, care plan builder, concept map builder, assignment hub, placement tracking, and advanced
clinical skills.

The implementation is documented in `docs/seo-monetization-guardrails.md`.

## SEO Standard

Authority pages support:

- Canonical URLs
- Open Graph
- Twitter cards
- Breadcrumb schema
- MedicalWebPage schema
- FAQ schema
- Article schema
- Organization schema
- XML sitemap inclusion

## Dashboard Coverage

The authority dashboard tracks:

- Published pages
- Planned pages
- Draft gaps
- Pages awaiting review
- EEAT coverage
- Clinical authority coverage
- Average clinical authority score
- Keyword coverage
- Profession coverage
- Topic coverage
- Estimated traffic opportunity
- Schema coverage
- Internal links per page
- Monetization readiness

## Content Expansion Rule

Do not create low-value pages to satisfy targets. A page should be rejected if it is generic, repetitive, unsupported,
clinically shallow, or disconnected from the NurseNest learning ecosystem.

## Clinical Authority Standard

The full publication standard is defined in `docs/clinical-authority-content-standard.md` and enforced by
`validateClinicalAuthorityStandard()`.

Minimum score for reference-quality publication: `90/100`.

Seed pages establish architecture coverage, but future pages must satisfy the clinical authority standard before they are
promoted as complete healthcare education resources.
