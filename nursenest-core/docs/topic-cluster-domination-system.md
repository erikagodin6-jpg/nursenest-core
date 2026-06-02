# Topic Cluster Domination System

## Objective

NurseNest should build topical authority through complete clusters, not isolated articles. The goal is topic ownership:
pillar pages, supporting clinical pages, allied health views, premium training funnels, and strong internal linking.

## Cluster Model

Every cluster includes:

- Pillar page
- Pathophysiology
- Signs and symptoms
- Assessment
- Diagnostics
- Laboratory interpretation
- Imaging
- Pharmacology
- Patient education
- Complications
- Clinical skills
- Care plans
- Case studies
- NCLEX preparation
- REx-PN preparation
- NP considerations
- Simulation activities
- Clinical reasoning
- Common mistakes
- Professional practice

Pillar pages target `4,000-8,000` words. Supporting pages target `2,000-4,000` words. Career pages target
`3,000-5,000` words. Certification pages target `4,000-8,000` words.

## Phase-One Nursing Clusters

Priority order:

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

Heart Failure and COPD target `30-50` supporting pages. Diabetes targets `50-75` supporting pages. The remaining
phase-one nursing clusters target `30-50` supporting pages.

## Allied Health Clusters

Second wave:

- Respiratory Therapy
- Paramedicine
- Occupational Therapy
- Physiotherapy
- Medical Laboratory Technology

Each allied health cluster targets `20-40` supporting pages and must remain profession-specific, not generic nursing
content with a different label.

## Internal Linking Rules

Every cluster page should link to:

- Parent cluster
- Sibling pages
- Related clusters
- Relevant lessons
- Relevant questions
- Relevant flashcards
- Relevant simulations
- Relevant clinical skills

No orphan content.

## Dashboard Metrics

The cluster dashboard tracks:

- Cluster completion
- Internal linking score
- Keyword coverage
- Traffic potential
- Revenue potential
- EEAT score
- Monetization readiness
- Publication readiness

## Implementation

The executable registry lives in `src/lib/authority/healthcare-authority-content-engine.ts`:

- `AUTHORITY_TOPIC_CLUSTERS`
- `getAuthorityTopicCluster()`
- `buildAuthorityClusterDashboard()`

The generated dashboard is written to `docs/content-authority-dashboard.md`.
