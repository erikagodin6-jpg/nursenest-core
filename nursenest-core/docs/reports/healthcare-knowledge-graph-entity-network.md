# Healthcare Knowledge Graph & Entity Network

Generated: 2026-05-31T06:55:54.916Z

## Objective

Create a structured healthcare knowledge graph that helps Google, AI Overviews, ChatGPT, Gemini, Perplexity, Claude, Bing, and future retrieval systems understand what NurseNest knows, how topics connect, where expertise exists, and which entities are authoritative.

## Dashboard

| Metric | Value |
| --- | ---: |
| Entity count | 11 |
| Relationship count | 67 |
| Entity type registry | 18 |
| Schema types | 13 |
| Authority clusters | 9 |
| Orphan entities | 0 |
| Internal link groups | 8 |
| Average authority score | 86% |
| AI retrieval optimization ready | Yes |

## Entity Registry

- Disease
- Medication
- Lab
- Clinical Skill
- Procedure
- Certification
- Program
- School
- Career
- Employer
- Healthcare Profession
- Body System
- Specialty
- Simulation
- Question
- Lesson
- Flashcard
- Care Plan

## Canonical Entity Seeds

| Entity | Type | Canonical Path | Aliases | Clusters | Relationships | Authority Score |
| --- | --- | --- | --- | --- | ---: | ---: |
| Heart Failure | Disease | /healthcare/heart-failure | CHF | Cardiology, Critical Care | 10 | 100% |
| Pulmonary Edema | Disease | /healthcare/pulmonary-edema | - | Cardiology, Respiratory, Critical Care | 3 | 86% |
| Furosemide | Medication | /medications/furosemide | Lasix | Cardiology, Critical Care | 7 | 99% |
| BNP | Lab | /labs/bnp | B-type Natriuretic Peptide | Cardiology | 7 | 74% |
| Nursing | Healthcare Profession | /careers/nursing | RN, RPN, LPN | Allied Health, Certification | 6 | 94% |
| Respiratory Therapy | Healthcare Profession | /allied-health/respiratory-therapy | RT | Respiratory, RT, Allied Health | 5 | 93% |
| NCLEX | Certification | /exams/nclex-rn | NCLEX-RN | Certification, Pre-Nursing | 7 | 99% |
| Registered Nurse | Career | /careers/registered-nurse | RN | Allied Health, Certification | 7 | 96% |
| McMaster Nursing Program | Program | /schools/mcmaster-nursing | McMaster BScN | Pre-Nursing | 5 | 71% |
| Hamilton Health Sciences | Employer | /employers/hamilton-health-sciences | HHS | Allied Health | 5 | 71% |
| Cardiology | Specialty | /specialties/cardiology | - | Cardiology | 5 | 68% |

## Disease Network Example: Heart Failure

| Target | Relationship | Evidence |
| --- | --- | --- |
| Pulmonary Edema | related_to | Heart failure commonly causes pulmonary congestion and edema. |
| BNP | assesses | BNP is a core heart failure volume and stretch marker. |
| Furosemide | treats | Loop diuretics are common heart failure and fluid overload treatments. |
| topic-cardiac-output | related_to | Reduced cardiac output is a key heart failure concept. |
| disease-afib | related_to | AFib can worsen cardiac output and heart failure symptoms. |
| skill-echocardiography | assesses | Echocardiography supports diagnosis and functional assessment. |
| careplan-heart-failure | contains_learning_asset | Care plans translate heart failure findings into nursing priorities. |
| lesson-heart-failure | contains_learning_asset | Lessons teach pathophysiology, assessment, and management. |
| simulation-heart-failure | contains_learning_asset | Simulations teach deterioration and escalation. |
| question-heart-failure | contains_learning_asset | Questions assess clinical judgment and exam readiness. |

## Medication Network Example: Furosemide

| Target | Relationship | Evidence |
| --- | --- | --- |
| Heart Failure | treats | Furosemide reduces congestion in volume-overloaded heart failure. |
| Pulmonary Edema | treats | Furosemide is commonly used for fluid overload with respiratory compromise. |
| topic-fluid-overload | treats | Loop diuretics support fluid removal. |
| lab-potassium | monitors | Furosemide can lower potassium and increase arrhythmia risk. |
| skill-medication-administration | requires_skill | Administration requires safety checks and patient education. |
| skill-medication-safety | requires_skill | Loop diuretics require monitoring for hypotension, dehydration, and electrolytes. |
| topic-patient-education | related_to | Patients need teaching about timing, weights, and symptoms. |

## Lab Network Example: BNP

| Target | Relationship | Evidence |
| --- | --- | --- |
| Heart Failure | assesses | BNP can support heart failure assessment in the right clinical context. |
| topic-cardiac-output | related_to | BNP connects volume status and cardiac stretch to perfusion reasoning. |
| Pulmonary Edema | related_to | BNP may support assessment of cardiogenic dyspnea. |
| topic-volume-overload | related_to | BNP trends can support volume-overload reasoning. |
| Cardiology | belongs_to_specialty | BNP is a high-yield cardiology interpretation concept. |
| lesson-bnp-interpretation | contains_learning_asset | Interpretation guides connect values to nursing actions. |
| case-heart-failure-bnp | contains_learning_asset | Case studies teach interpretation in clinical context. |

## Internal Link Graph

Every public authority page should be able to surface the following related-content groups:

- Related Topics
- Related Diseases
- Related Medications
- Related Skills
- Related Careers
- Related Certifications
- Related Employers
- Related Programs

Heart Failure generated link groups:

- Related Topics: Pulmonary Edema, BNP
- Related Diseases: Pulmonary Edema
- Related Medications: Furosemide
- Related Skills: No matched canonical entity yet
- Related Careers: No matched canonical entity yet
- Related Certifications: No matched canonical entity yet
- Related Employers: No matched canonical entity yet
- Related Programs: No matched canonical entity yet

## Schema Expansion

- DefinedTerm
- MedicalCondition
- Drug
- Person
- Organization
- EducationalOrganization
- Course
- FAQPage
- Review
- BreadcrumbList
- Article
- WebSite
- SearchAction

## Topical Authority Scores

| Cluster | Entity Count | Relationship Count | Average Authority | Weak Relationship Entities |
| --- | ---: | ---: | ---: | ---: |
| Cardiology | 5 | 32 | 85% | 1 |
| Respiratory | 2 | 8 | 90% | 1 |
| Critical Care | 3 | 20 | 95% | 1 |
| RT | 1 | 5 | 93% | 0 |
| Paramedic | 0 | 0 | 0% | 0 |
| NP | 0 | 0 | 0% | 0 |
| Pre-Nursing | 2 | 12 | 85% | 0 |
| Allied Health | 4 | 23 | 89% | 0 |
| Certification | 3 | 20 | 96% | 0 |

## Orphan Detection

No seeded orphan entities detected.

## AI Retrieval Optimization

The graph stores:

- Canonical entity IDs
- Canonical paths
- Entity aliases
- Entity types
- Schema types
- Evidence-backed relationships
- Authority clusters
- Internal link groups
- Orphan entity signals
- Topical authority scores

## Governance

- Relationship evidence is required so links are meaningful, not random.
- Entity pages should expose definitions, schema, breadcrumbs, and related entities.
- Orphan entities require remediation before publication.
- Internal links should be generated from stored relationships instead of manually hardcoded page lists.
- Topical authority scores should guide SEO, content expansion, and AI retrieval priorities.
