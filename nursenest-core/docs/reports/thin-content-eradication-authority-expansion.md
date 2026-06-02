# Thin Content Eradication & Authority Page Expansion Program

Generated: 2026-05-31T05:53:30.570Z

## Implementation Summary

The thin content eradication foundation is implemented in `src/lib/seo/thin-content-eradication-engine.ts`.

It supports:

- Sitewide indexable-page inventory classification.
- Thin page detection for word count, target depth, internal links, educational value, unique content, placeholder language, scaffold content, generated filler, duplicate content, allied-health specificity, and missing authority blocks.
- Decision routing into EXPAND, MERGE, REDIRECT, NOINDEX, DELETE, or KEEP.
- Authority expansion requirements for disease, medication, care plan, clinical skill, lab, certification, career, and allied-health guide pages.
- Internal link expansion targets across lessons, flashcards, questions, simulations, skills, care plans, labs, medications, and certifications.
- Indexation impact metrics.

## Authority Expansion Requirements

| Category |Target Words |Internal Links |Required Blocks |
| conditions |3000-5000 |15-30 |Definition, Why It Matters, Assessment, Diagnostics, Management |
| medications |2500-4000 |15-30 |Mechanism, Indications, Contraindications, Monitoring, Safety Alerts |
| care-plans |2000-3500 |15-30 |Patient Scenario, Priority Diagnoses, Clinical Reasoning, Goals, Interventions |
| clinical-skills |2500-4000 |15-30 |Purpose, Indications, Contraindications, Equipment, Procedure |
| labs |2000-3000 |15-30 |Normal Values, Function, High Values, Low Values, Clinical Significance |
| certification |4000-8000 |15-30 |Eligibility, Exam Blueprint, Study Timeline, Question Types, Readiness Plan |
| career |3000-5000 |15-30 |Role Overview, Education Path, Licensing, Clinical Placement, Skills |
| allied-health-guide |3000-5000 |15-30 |Profession-Specific Role, Competencies, Clinical Skills, Placement Expectations, Certification |

## Demo Dashboard

- Pages audited: 5
- Indexable pages: 5
- Thin pages: 4
- Pages to expand: 2
- Pages to merge: 0
- Pages to redirect: 1
- Pages to noindex: 0
- Pages to delete: 1
- Allied health weak pages: 1
- Authority score: 88/100
- Crawled-not-indexed risk: 80/100

## Page Decisions

| URL |Kind |Words |Decision |Severity |Signals |
| /conditions/heart-failure |Authority Page |3600 |KEEP |none |none |
| /conditions/sepsis |Authority Page |820 |EXPAND |medium |below_target_depth, low_internal_links, missing_authority_blocks |
| /rt/abg-interpretation |Career Page |720 |EXPAND |medium |below_target_depth, low_internal_links, weak_allied_specificity, missing_authority_blocks |
| /programmatic/heart-failure-copy |Programmatic Page |700 |REDIRECT |high |below_target_depth, no_unique_content, duplicate_content |
| /blog/random-stub |Blog Post |120 |DELETE |critical |under_300_words, under_500_words, below_target_depth, placeholder_language, coming_soon, scaffold_content |

## Indexation Impact Model

- Thin pages eliminated: 3
- Pages expanded: 2
- Pages redirected: 1
- Pages removed: 1
- Authority score change: 10
- Crawled-not-indexed risk change: -47

## Next Integration Points

1. Feed this engine with sitemap URLs, authority page registries, blog inventories, programmatic pages, and public lesson routes.
2. Add duplicate group IDs from the existing SEO duplicate guard.
3. Generate route-level remediation tickets for EXPAND, MERGE, REDIRECT, NOINDEX, and DELETE decisions.
4. Connect Search Console crawled-not-indexed rows to decision priority.
5. Re-run after each content cleanup sprint to measure indexation and authority improvement.
