# Healthcare Authority Content Engine

## Purpose

The Healthcare Authority Content Engine is the NurseNest foundation for public, EEAT-focused healthcare education pages.
It is designed to scale clinical, career, study, placement, interview, and certification content without creating
ungoverned content volume.

## Public Routes

- `/healthcare`
- `/healthcare/conditions/[slug]`
- `/healthcare/medications/[slug]`
- `/healthcare/clinical-skills/[slug]`
- `/healthcare/labs/[slug]`
- `/healthcare/care-plans/[slug]`
- `/healthcare/allied-careers/[slug]`
- `/healthcare/allied-study/[slug]`
- `/healthcare/interview-prep/[slug]`
- `/healthcare/placements/[slug]`
- `/healthcare/certifications/[slug]`

## Authority Libraries

- Disease & Condition Library
- Medication Library
- Nursing Care Plan Library
- Laboratory Interpretation Library
- Clinical Skills Library
- Allied Health Career Library
- Allied Health Study Library
- Interview Preparation Library
- Placement Success Library
- Certification & Licensing Library

## Content Governance

Every authority page must include:

- Clinical review status
- Reviewer name, credentials, specialty, and review date
- Initial publication date
- Last updated date
- Review cycle date
- Change history
- References from peer-reviewed, government, guideline, or professional sources
- Related internal links

## Quality Gate

The engine has two gates.

### Architecture Gate

The architecture gate validates:

- Required section depth
- Reference coverage
- Reviewer metadata
- Governance dates
- Internal linking
- Clinical pearls
- Common mistakes
- Thin sections

This gate confirms a page has the minimum fields needed to render safely.

### Clinical Authority Gate

The clinical authority gate is stricter and is the publication standard for reference-quality pages. It validates:

- Target word depth by category
- Required clinical elements by category
- Clinical depth
- Educational value
- Practical utility
- Exam relevance
- Clinical accuracy
- Internal linking
- EEAT readiness
- Content completeness

Minimum publication score: `90/100`.

Pages below 90 remain under review and should not be positioned as final clinical authority resources.

## Scaling Standard

Future pages should target:

- Conditions: 3,000-5,000 meaningful words
- Medications: 2,500-4,000 meaningful words
- Care plans: 2,000-3,500 meaningful words with diagnoses, SMART goals, interventions, rationales, evaluation, teaching, and reasoning
- Labs: 2,000-3,000 meaningful words with normal values, high/low interpretation, causes, nursing action, and related conditions
- Clinical skills: 2,500-4,000 meaningful words with procedure, safety, documentation, complications, checklist, and practice questions
- Allied health careers: 3,000-5,000 meaningful words with career path, education, licensing, salary intent, placement readiness, and internal links
- Allied health study: 2,500-4,000 meaningful words with clinical reasoning guides, quick review pages, FAQs, and relevant practice activity links
- Interview prep: questions, model-answer structure, common mistakes, and expert tips
- Placement guides: preparation, instructor expectations, clinical skills, common mistakes, and success tips
- Certification guides: 4,000-8,000 meaningful words with exam scope, study plan, readiness, related pathway links, and conversion-oriented CTAs

## Internal Linking

Each page should connect to related:

- Conditions
- Medications
- Skills
- Labs
- Care plans
- Lessons
- Practice questions
- Flashcards
- Simulations

The goal is topical authority, not isolated articles.

## SEO Infrastructure

Authority pages emit:

- Canonical URLs
- Open Graph metadata
- Twitter card metadata
- Breadcrumb JSON-LD
- MedicalWebPage JSON-LD
- FAQPage JSON-LD
- Article JSON-LD
- Organization JSON-LD
- XML sitemap inclusion through `sitemap-authority-clusters.xml`

## Dashboard

Run:

```bash
npx tsx scripts/generate-authority-content-dashboard.mts
```

This updates `docs/content-authority-dashboard.md` with published page counts, phase-one gaps, EEAT coverage, schema
coverage, internal-linking coverage, and monetization readiness by authority library.
