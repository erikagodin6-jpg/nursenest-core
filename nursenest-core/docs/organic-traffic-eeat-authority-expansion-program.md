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

## Content Expansion Rule

Do not create low-value pages to satisfy targets. A page should be rejected if it is generic, repetitive, unsupported,
clinically shallow, or disconnected from the NurseNest learning ecosystem.

## Clinical Authority Standard

The full publication standard is defined in `docs/clinical-authority-content-standard.md` and enforced by
`validateClinicalAuthorityStandard()`.

Minimum score for reference-quality publication: `90/100`.

Seed pages establish architecture coverage, but future pages must satisfy the clinical authority standard before they are
promoted as complete healthcare education resources.
