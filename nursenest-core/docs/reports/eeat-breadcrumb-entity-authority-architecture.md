# EEAT, Breadcrumb & Entity Authority Architecture

Generated: 2026-05-31T06:41:55.182Z

## Objective

Transform NurseNest from a collection of pages into a healthcare authority network Google and AI search systems can understand. This architecture standardizes breadcrumbs, schema, EEAT fields, entity relationships, topical hierarchy, reviewer authority, organization authority, and orphan page remediation.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Indexable page surfaces | 13 |
| Breadcrumb examples | 4 |
| Entity relationship seeds | 4 |
| Authority layers | 5 |
| Reviewer profile seeds | 7 |
| Schema types | 13 |
| DefinedTerm seeds | 7 |
| Organization authority ready | Yes |

## Breadcrumb Standard

Every indexable page must include visible breadcrumbs, BreadcrumbList schema, and a consistent hierarchy.

Indexable surfaces:

- Lessons
- Disease Pages
- Medication Pages
- Care Plans
- Clinical Skills
- Career Guides
- School Pages
- Certification Pages
- Interview Pages
- Placement Pages
- Allied Health Pages
- NP Pages
- Glossary Terms

Schema breadcrumb surfaces:

- Lessons
- Disease Pages
- Medication Pages
- Care Plans
- Clinical Skills
- Career Guides
- School Pages
- Certification Pages
- Interview Pages
- Placement Pages
- Allied Health Pages
- NP Pages
- Glossary Terms

## Breadcrumb Examples

- Heart Failure Care Plan: Homepage > Nursing > RN > Cardiovascular > Heart Failure > Heart Failure Nursing Care Plan
- PEEP: Homepage > Allied Health > Respiratory Therapy > Ventilator Management > PEEP
- ATI TEAS Anatomy: Homepage > Admissions > ATI TEAS > Science > Anatomy
- RN Salary Ontario: Homepage > Career Center > Nursing > Ontario > RN Salary Ontario

## Entity Relationship Seeds

| Entity | Type | Related Entities | Supporting Content |
| --- | --- | --- | --- |
| Heart Failure | Disease | BNP, Furosemide, Pulmonary Edema, Echocardiogram, Cardiac Output, AFib | Heart Failure Care Plan, Heart Failure Simulation, Heart Failure Questions |
| PEEP | DefinedTerm | Mechanical Ventilation, FiO2, ARDS, Oxygenation, Tidal Volume | Ventilator Management Lesson, ABG Interpretation Tool, RT Clinical Placement Guide |
| Metoprolol | Medication | Beta Blockers, Heart Failure, Atrial Fibrillation, Blood Pressure, Heart Rate | Medication Page, Pharmacology Questions, Cardiac Case Study |
| Hamilton Health Sciences | Employer | Nursing Careers, Clinical Placements, Ontario, New Graduate Programs | Employer Profile, Nursing Interview Guide, RN Salary Ontario |

## Topical Authority Hierarchy

| Layer | Label | Examples |
| --- | --- | --- |
| profession | Profession | Nursing, Respiratory Therapy, Paramedicine, OT, PT, MLT |
| certification | Certification | NCLEX, REx-PN, CNPLE, FNP, PMHNP, TEAS, HESI, CASPER |
| body_system | Body Systems | Cardiovascular, Respiratory, Neurology, Endocrine, Renal, GI |
| topic | Topics | Heart Failure, COPD, Stroke, Sepsis, Diabetes |
| supporting_content | Supporting Content | Questions, Flashcards, Lessons, Skills, Labs, Simulations, Care Plans, Career Content |

## EEAT Required Fields

- author
- author_credentials
- reviewer
- reviewer_credentials
- review_date
- update_date
- content_type
- evidence_sources

## Reviewer Authority

| Reviewer | Credentials | Specialty | Bio | Pages Reviewed Metric |
| --- | --- | --- | --- | --- |
| RN Reviewer | RN | Nursing education and clinical judgment | Required | Required |
| NP Reviewer | NP | Advanced practice, diagnostics, and prescribing | Required | Required |
| RT Reviewer | RT | Respiratory therapy and ventilation | Required | Required |
| Paramedic Reviewer | Paramedic | Emergency response and prehospital care | Required | Required |
| OT Reviewer | OT | Functional assessment and occupational therapy | Required | Required |
| PT Reviewer | PT | Mobility, rehabilitation, and physiotherapy | Required | Required |
| MLT Reviewer | MLT | Laboratory interpretation and specimen quality | Required | Required |

## Organization Authority

- organizationSchema: required
- websiteSchema: required
- searchAction: required
- educationalOrganizationSchema: required
- sameAsRequired: required
- businessInformationRequired: required
- educationalFocusRequired: required
- professionalFocusRequired: required
- healthcareFocusRequired: required

## Medical Content Schema

- MedicalWebPage
- Article
- FAQPage
- BreadcrumbList
- Organization
- WebSite
- SearchAction
- EducationalOrganization
- Course
- HowTo
- DefinedTerm
- Review
- Person

## DefinedTerm System

| Term | Schema | Related Entities |
| --- | --- | --- |
| Preload | DefinedTerm | Afterload, Cardiac Output, Heart Failure |
| Afterload | DefinedTerm | Preload, Blood Pressure, Heart Failure |
| PEEP | DefinedTerm | Ventilator Management, FiO2, ARDS |
| ABG | DefinedTerm | pH, PaCO2, PaO2, Bicarbonate |
| Cardiac Output | DefinedTerm | Stroke Volume, Heart Rate, Perfusion |
| COPD | DefinedTerm | Dyspnea, Oxygen Therapy, ABG |
| Sepsis | DefinedTerm | Lactate, Shock, Infection |

## Internal Authority Score

Example full-coverage score:

| Metric | Score |
| --- | ---: |
| Breadcrumb Coverage | 100% |
| Schema Coverage | 100% |
| Author Coverage | 100% |
| Reviewer Coverage | 100% |
| Entity Coverage | 100% |
| Knowledge Graph Readiness | 100% |
| Topical Authority Score | 100% |
| EEAT Score | 100% |

## Orphan Page Detection

Example weak-page risk:

- weakHierarchy: Yes
- weakBreadcrumbStructure: Yes
- weakEntityConnections: Yes
- weakInternalLinks: Yes
- requiresRemediation: Yes

## AI Search Readiness

The standard supports:

- Entity clarity
- Structured definitions
- Strong hierarchy
- Semantic relationships
- Breadcrumb context
- Person and reviewer context
- Organization identity
- Internal link context

## Guardrails

- No indexable page should ship without visible breadcrumbs and BreadcrumbList schema.
- Clinical pages require author, reviewer, credentials, review date, update date, content type, and evidence sources.
- Entity relationships should be stored explicitly instead of relying only on visual links.
- Reviewer profiles should expose bio, credentials, specialty, and pages-reviewed metrics.
- Organization schema should include sameAs, educational focus, professional focus, healthcare focus, and SearchAction.
- Glossary terms should emit DefinedTerm schema where appropriate.
- Pages with weak hierarchy, weak breadcrumbs, weak entity connections, or weak internal links require remediation.
