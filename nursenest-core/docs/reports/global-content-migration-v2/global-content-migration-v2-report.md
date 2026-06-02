# Global Content Migration Engine V2 Report

Generated: 2026-05-31T21:44:18.592Z

## Canonical Architecture

Global Core -> Role Supplement -> Country Supplement -> Exam Supplement -> Language Supplement

## Executive Summary

- Total audited recovered assets: 10
- Duplication threshold: 80%
- Inheritance required: 6
- Supplement-only migrations: 0
- Blocked migrations: 4
- Separate asset review required: 0

## Role Supplement Scope

| Role | Include | Exclude |
| --- | --- | --- |
| PN | Recognition; Monitoring; Escalation; Medication administration; Safety | Prescribing; Differential diagnosis; Advanced management |
| RN | Clinical assessment; Prioritization; Care planning; Interprofessional communication; Deterioration recognition | Independent prescribing; Independent diagnosis |
| NP | Diagnostics; Differential diagnosis; Guideline-directed therapy; Prescribing; Longitudinal management | None |

## Asset Migration Rules

| Asset | Rule |
| --- | --- |
| Question | Inherits Clinical Concept -> Role Supplement -> Country Supplement -> Exam Supplement -> Language Supplement; may vary Stem, Options, Rationale, Clinical depth. |
| Flashcard | Inherits Global Concept -> Role Supplement -> Country Supplement. Do not expose NP content to RN learners or RN content to PN learners when scope differs. |
| Simulation | Shared: Patient physiology, Deterioration engine, Assessment findings. Role-specific: Expected decisions, Scope, Escalation, Interventions. Country-specific: Documentation, Escalation language, Professional standards. |

## Migration Audit

| Content ID | Topic | Asset | Role | Country | Exam | Language | Shared % | Decision | Reason | Required Layers |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| recovered-global-heart-failure-core | Heart Failure | blog | RN | global | shared | inherit | 92 | INHERITANCE_REQUIRED | shared_content_exceeds_threshold | None |
| recovered-global-copd-core | COPD | blog | RN | global | shared | inherit | 92 | INHERITANCE_REQUIRED | shared_content_exceeds_threshold | None |
| recovered-global-sepsis-core | Sepsis | clinical_case | RN | global | shared | inherit | 92 | INHERITANCE_REQUIRED | shared_content_exceeds_threshold | None |
| recovered-uk-nmc-news2-overlay | NEWS2 and Deterioration | blog | RN | United Kingdom | NMC CBT | en | 84 | INHERITANCE_REQUIRED | shared_content_exceeds_threshold | Language Supplement |
| recovered-au-rural-cultural-safety-overlay | Rural Healthcare and Cultural Safety | blog | RN | Australia | NMBA RN / IQNM | en | 84 | INHERITANCE_REQUIRED | shared_content_exceeds_threshold | Language Supplement |
| recovered-nz-te-tiriti-overlay | Te Tiriti and Cultural Safety | blog | RN | New Zealand | NCNZ RN | en | 84 | INHERITANCE_REQUIRED | shared_content_exceeds_threshold | Language Supplement |
| recovered-us-nclex-ngn-overlay | NGN Clinical Judgment | question | RN | United States | NCLEX-RN | en | 84 | MIGRATION_BLOCKED | country_supplement_missing | Country Supplement; Language Supplement |
| recovered-heart-failure-np-role-overlay | Heart Failure | lesson | NP | global | FNP | en | 92 | MIGRATION_BLOCKED | exam_supplement_missing | Exam Supplement; Language Supplement |
| recovered-fr-international-overlay | French International Nursing Overlay | blog | RN | global | shared | fr | 72 | MIGRATION_BLOCKED | role_supplement_missing | Role Supplement |
| recovered-es-international-overlay | Spanish International Nursing Overlay | blog | RN | global | shared | es | 72 | MIGRATION_BLOCKED | role_supplement_missing | Role Supplement |

## Governance Requirement

No new international pathway may be created until Global Core, Role Supplement, Country Supplement, Exam Supplement, and migration analysis are complete.

If more than 80% of content is shared, inheritance is required and a separate duplicated asset is blocked.
