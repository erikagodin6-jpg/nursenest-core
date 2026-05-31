# Programmatic Content Production Pipeline

## Objective

Scale NurseNest from hundreds of pages to thousands of clinically authoritative healthcare education resources without
sacrificing quality, accuracy, EEAT, internal linking, or conversion potential.

This is a content manufacturing and quality assurance system, not a direct content generation project.

## Required Workflow

Every page must pass through:

1. Keyword Opportunity
2. Cluster Assignment
3. Content Brief
4. Outline Creation
5. Draft Creation
6. Clinical Expansion
7. Internal Linking
8. QA Review
9. Clinical Review
10. EEAT Review
11. Publication
12. Performance Monitoring

No direct publication.

## Content Brief Generator

For every approved keyword, the brief includes:

- Primary keyword
- Secondary keywords
- Related questions
- Search intent
- Target audience
- Cluster assignment
- Internal link targets
- EEAT requirements
- Conversion opportunities
- Suggested word count
- Suggested media
- Difficulty level
- Commercial intent
- Traffic opportunity score
- Revenue opportunity score

## Outline Generator

No page begins without an approved outline. Outlines include category-specific section requirements plus scenario,
internal-linking, and media requirements.

## Scenario Engine

Major pages require:

- Patient cases
- Clinical scenarios
- Decision-making examples
- Professional practice examples
- Common mistakes
- Escalation situations
- Documentation examples
- Clinical pearls

## Internal Linking Automation

Every page should identify related:

- Diseases
- Medications
- Skills
- Labs
- Care plans
- Lessons
- Flashcards
- Simulations
- Questions

Minimum target: `15-30` meaningful internal links per page.

## Media Requirements

Major topics should not publish as text-only resources. Required media planning includes:

- Illustrations
- Diagrams
- Tables
- Algorithms
- Clinical flowcharts
- Decision trees
- Infographics
- Assessment frameworks

## Content Quality Scoring

Each candidate is scored across:

- Clinical Accuracy
- Educational Value
- Readability
- Practical Utility
- Exam Relevance
- Allied Health Relevance
- Internal Linking
- Conversion Potential
- EEAT Strength
- Publication Readiness

Minimum publication score: `90/100`.

Any dimension below 90 returns for revision.

## Allied Health Queues

Dedicated production queues track:

- Respiratory Therapy
- Paramedicine
- Occupational Therapy
- Physiotherapy
- Medical Laboratory Technology
- PSW / Allied

Each queue tracks pages planned, drafted, reviewed, published, traffic potential, and cluster completion.

## SEO Performance Tracking

The system is prepared to track:

- Impressions
- Clicks
- CTR
- Average position
- Indexed pages
- Keyword coverage
- Cluster coverage
- Internal link coverage
- Organic traffic
- Traffic growth
- Conversion rate
- Revenue attribution

## Implementation

The executable production layer lives in `src/lib/authority/healthcare-authority-content-engine.ts`:

- `CONTENT_PRODUCTION_WORKFLOW`
- `generateContentBrief()`
- `generateContentOutline()`
- `scoreContentProductionCandidate()`
- `buildContentProductionCalendar()`
- `buildAlliedHealthProductionQueues()`
- `buildContentProductionDashboard()`

The generated dashboard is written to `docs/content-authority-dashboard.md`.
