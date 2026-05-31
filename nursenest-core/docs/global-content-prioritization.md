# Global Content Prioritization

Status: Hidden development foundation
Visibility: Admin only
Public release state: Not launched

Required flags: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`

## Purpose

This document defines how future NurseNest product content should be classified so the platform can reuse 70-90% of high-value educational assets while preserving country, exam, profession, and scope accuracy.

## Content Classification

| Classification | Definition | Examples |
| --- | --- | --- |
| Global Content | Clinically or educationally valid across most countries and pathways | Sepsis recognition, ECG rhythm basics, ABG interpretation, medication safety principles |
| Country-Specific Content | Requires local regulation, terminology, policy, or healthcare-system context | Delegation rules, NHS structure, Medicare, Canadian documentation expectations |
| Exam-Specific Content | Tied to a certification blueprint or exam format | CCRN blueprint weighting, CEN triage emphasis, NCLEX-style NGN items |
| Profession-Specific Content | Depends on scope and role expectations | RN medication administration, NP prescribing, RT ventilator management |
| Institution-Specific Content | Designed for future enterprise customization | Hospital onboarding policy, school placement rubric, residency expectations |

## Product Reuse Targets

| Product | Global Content Target | Country-Specific Target | Exam-Specific Target | Notes |
| --- | ---: | ---: | ---: | --- |
| New Graduate Nurse Residency | 80-90% | 10-20% | 0-5% | Practice transition is broadly reusable; scope and documentation vary |
| CCRN Academy | 75-85% | 5-10% | 10-15% | ICU physiology is global; certification weighting varies |
| CEN Academy | 75-85% | 5-15% | 10-15% | Emergency principles are global; triage and protocols vary |
| ECG Certification Academy | 85-90% | 5-10% | 5-10% | Rhythm interpretation is highly reusable |
| Lab Interpretation Academy | 80-90% | 5-15% | 0-10% | Units and reporting rules may vary |
| Clinical Skills Academy | 75-85% | 10-20% | 0-10% | Procedure principles are reusable; scope and policy vary |
| Advanced Pharmacology Academy | 70-85% | 10-20% | 5-10% | Drug names, availability, and prescribing vary |
| Nursing Leadership & Management | 70-80% | 15-25% | 0-10% | Leadership concepts are reusable; law and policy vary |
| Preceptor & Clinical Educator Academy | 75-85% | 10-20% | 0-10% | Teaching principles are reusable; program policy varies |

## Global Core Priority Topics

These topics should be built once as global core content, then extended with local supplements:

| Category | Priority Topics |
| --- | --- |
| Deterioration | Sepsis, shock, respiratory failure, stroke, ACS, DKA, GI bleeding |
| ECG | AFib, flutter, SVT, VT, VF, STEMI, heart blocks, electrolyte changes |
| Labs | CBC, electrolytes, ABGs, renal, liver, coagulation, cardiac markers |
| Pharmacology | Anticoagulants, insulin, antibiotics, opioids, antihypertensives, vasopressors |
| Skills | Assessment, medication administration, IV therapy, wound care, documentation |
| Leadership | Delegation, communication, conflict, staffing, quality improvement |
| Education | Feedback, coaching, competency evaluation, remediation planning |

## Country Supplement Template

Every country-specific supplement should identify:

1. Scope or role differences
2. Regulatory or legal language
3. Documentation expectations
4. Medication naming or availability differences
5. Healthcare-system context
6. Escalation and reporting expectations
7. Cultural safety or population-specific considerations

## Exam Supplement Template

Every exam-specific supplement should identify:

1. Blueprint domain
2. Weighting or priority
3. Item format expectations
4. Terminology differences
5. Difficulty target
6. Required rationale style
7. Readiness score mapping

## Quality Gates

No content should move from hidden inventory to launch candidate unless:

| Gate | Required Standard |
| --- | --- |
| Accuracy | Clinically credible and source-review ready |
| Depth | Explains reasoning, consequences, safety, and application |
| Related content | Mapped to at least one related lesson, question, flashcard, case, skill, or readiness domain |
| Duplicates | Checked against global core and existing product inventory |
| Scope | Tagged for country, exam, profession, and entitlement level |
| Quality score | 85 or higher before publish consideration |
| Visibility | Remains hidden until launch approval |

