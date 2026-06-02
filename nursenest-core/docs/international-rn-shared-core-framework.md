# NurseNest International RN Shared Core Framework

Date: 2026-05-31

Status: Hidden Draft Foundation

Do not publish. Do not expose in navigation, sitemap, search, learner dashboards, pricing pages, or public pathway selectors.

## Objective

Create one reusable international RN curriculum core that supports Canada, United States, United Kingdom, Australia, New Zealand, and future country pathways without duplicating clinical education assets.

Country-specific content should be created only where there is a genuine difference in:

- Regulation.
- Documentation.
- Scope of practice.
- Medication governance.
- Clinical guideline expectations.
- Health system structure.
- Exam blueprint or station format.

## 1. Shared Core Framework

Canonical source: `GLOBAL_SHARED_CORE`.

Minimum inventory targets:

| Asset Type | Shared Core Target |
| --- | ---: |
| Lessons | 2,000+ |
| Flashcards | 25,000+ |
| Questions | 40,000+ |
| Simulations | 500+ |
| NGN Cases | 1,000+ |

Supported audiences:

- RN.
- RPN/PN.
- NP.
- International RN.

Reusable global content areas:

- Anatomy.
- Physiology.
- Pathophysiology.
- Pharmacology principles.
- Laboratory interpretation.
- ECG interpretation.
- Clinical assessment.
- Infection prevention.
- Wound care.
- IV therapy.
- Medication administration principles.
- Documentation principles.
- Clinical judgment.
- Prioritization.
- Delegation.
- Communication fundamentals.
- Patient safety.
- Quality improvement.

## 2. Country Overlay Framework

Country overlays add local material without copying the global clinical source.

| Country | Overlay Domains |
| --- | --- |
| Canada | Provincial regulation, CNO, BCCNM, CLPNA, CRNNL |
| United States | State Boards, NCLEX-specific regulation, US documentation expectations |
| United Kingdom | NHS Structure, NMC Code, Duty of Candour, NEWS2, Safeguarding |
| Australia | NMBA Standards, Ahpra Requirements, Rural Healthcare, Aboriginal and Torres Strait Islander Health |
| New Zealand | NCNZ Competencies, Te Tiriti o Waitangi, Cultural Safety |

Future overlays:

- Ireland.
- UAE DHA.
- UAE HAAD.
- UAE MOH.
- Saudi Arabia.
- Qatar.
- Oman.
- Singapore.
- India.
- Philippines.
- Additional future countries.

## 3. Language Overlay Framework

Translations must derive from `GLOBAL_SHARED_CORE`, not country-specific copies.

Supported expansion languages:

- French.
- Spanish.
- Hindi.
- Portuguese.
- Tagalog.
- Arabic.
- German.
- Japanese.
- Korean.
- Chinese.
- Future languages.

Translation overlays may localize terminology, grammar, and learner-facing phrasing. They must not fork clinical meaning or create independent lesson bodies unless localization review determines that regulation, scope, or clinical usage differs.

## 4. Exam Overlay Framework

Exam overlays define assessment mechanics, blueprint mapping, and exam-specific strategy.

Initial overlays:

- NCLEX-RN.
- REx-PN.
- NMC CBT.
- NMC OSCE.
- NMBA / IQNM.
- NCNZ RN Registration.
- Future international exams.

Exam overlays may modify:

- Item format.
- Blueprint domain.
- Cognitive level.
- Scoring model.
- Remediation mapping.
- Readiness reporting.

They must not duplicate the underlying clinical explanation.

## 5. Role Overlay Framework

Role overlays adapt depth and scope:

- RN.
- RPN/PN.
- NP.
- International RN.

Role overlays control:

- Scope of practice.
- Expected judgment level.
- Diagnostic or prescribing authority.
- Delegation boundaries.
- Escalation expectations.
- Remediation depth.

## Content Architecture

Every content item should resolve from these layers:

| Layer | Purpose | Duplicate Source Content Allowed |
| --- | --- | --- |
| Core Content | Clinical science, clinical reasoning, safety principles, reusable learning assets | No |
| Country Overlay | Regulation, documentation, scope, medication governance, health system, terminology | No |
| Language Overlay | Translation and localization from shared core | No |
| Exam Overlay | Blueprint mapping, item style, scoring rules, exam strategy | No |
| Role Overlay | RN, PN, NP, and International RN scope/depth adaptations | No |

Example:

`Heart Failure Global Core` -> `UK NHS/NEWS2 Overlay` -> `NMC CBT Exam Overlay` -> `International RN Role Overlay`

## Canonical Example: Global Heart Failure Core

Heart Failure should exist as one global clinical source, then resolve through role, country, and language overlays.

```text
GLOBAL HEART FAILURE CORE
|
|-- PN Overlay
|   |-- Recognition
|   |-- Assessment
|   |-- Monitoring
|   |-- Basic medications
|   |-- Escalation
|
|-- RN Overlay
|   |-- Advanced assessment
|   |-- Medication titration concepts
|   |-- Prioritization
|   |-- Clinical judgment
|   |-- Interprofessional collaboration
|
|-- NP Overlay
|   |-- Diagnostics
|   |-- Differential diagnosis
|   |-- Guideline-directed therapy
|   |-- Prescribing
|   |-- Longitudinal management
|
|-- UK Overlay
|-- Australia Overlay
|-- Canada Overlay
|-- US Overlay
|
|-- French Overlay
|-- Spanish Overlay
```

This pattern prevents separate Heart Failure lessons for every country and role. The global source owns pathophysiology, signs and symptoms, assessment logic, lab interpretation, pharmacology principles, complications, patient education, clinical reasoning, and shared question logic. Overlays add scope, regulator expectations, local terminology, exam mapping, medication governance, documentation expectations, and translated learner-facing language.

## Shared Body System Framework

Reusable body-system content should cover:

- Cardiovascular.
- Respiratory.
- Neurological.
- Gastrointestinal.
- Endocrine.
- Renal.
- Musculoskeletal.
- Hematology.
- Oncology.
- Immunology.
- Dermatology.
- Infectious Disease.
- Mental Health.
- Maternal-Newborn.
- Pediatrics.
- Geriatrics.

## Shared Clinical Skills Framework

Reusable clinical skills content should cover:

- Medication Administration.
- IV Therapy.
- Central Lines.
- PICC Care.
- Wound Care.
- Tracheostomy Care.
- Oxygen Therapy.
- Chest Tubes.
- Blood Administration.
- Isolation Precautions.
- Specimen Collection.

## Shared Pharmacology Framework

Reusable pharmacology content should cover:

- Cardiovascular Medications.
- Endocrine Medications.
- Respiratory Medications.
- Psychiatric Medications.
- Antimicrobials.
- Oncology Agents.
- Emergency Medications.
- Critical Care Medications.

Country-specific drug governance, brand names, scheduling rules, controlled medication handling, documentation, and reporting workflows must live in country overlays.

## Shared Clinical Judgment Framework

The shared core must generate reusable:

- Bowties.
- Matrix Questions.
- Trend Interpretation.
- Case Studies.
- Prioritization.
- Delegation.
- Documentation.
- Simulation Logic.
- Adaptive Learning Metadata.
- Remediation Metadata.
- Analytics Metadata.

## Shared Flashcard Framework

Every lesson and question should automatically generate:

- Flashcards.
- Clinical Pearls.
- Memory Anchors.
- Exam Relevance.
- Common Mistakes.

Separate flashcard systems should not be maintained for each country when the underlying clinical concept is shared.

## 6. Duplicate Content Audit

Evidence sources used:

- `docs/global-content-reuse-map.md`.
- `docs/duplicate-content-opportunity-report.md`.
- `docs/RN-95-roadmap.md`.
- `docs/reports/lesson-inventory-audit.md`.

Existing duplicate/reuse signals:

| Topic Signal | Files With Matches | Reuse Classification |
| --- | ---: | --- |
| Heart Failure / CHF | 984 | Global Core |
| COPD | 1,176 | Global Core |
| Shock | 1,151 | Global Core |
| Sepsis | 4,414 | Global Core |
| ABG / Arterial Blood Gas | 626 | Global Core |
| ECG / Telemetry | 3,011 | Global Core |
| Pharmacology / Medication Safety | 2,850 | Global Core + Country Supplements |
| Lab Interpretation / Labs | 2,638 | Global Core + Country Supplements |
| Clinical Skills / Assessment | 4,409 | Global Core + Country Supplements |

Known findings:

- RN lesson quality audit reported 250 near-duplicate lesson pairs queued for review.
- Lesson inventory audit reports repeated unit-pattern duplicates in allied and practical exam prep batches.
- Duplicate content opportunity report estimates high reuse potential for UK, Australia, and New Zealand overlays.

## 7. Content Reuse Report

| Area | Source Items | Duplicated Items Avoided | Reuse Estimate | Maintenance Reduction |
| --- | ---: | ---: | ---: | ---: |
| Core adult health and pathophysiology | 10,000 | 40,000 | 80% | 72% |
| Labs, ECG, pharmacology, and clinical skills | 8,000 | 32,000 | 78% | 70% |
| Clinical judgment and simulation logic | 1,500 | 6,000 | 70% | 66% |
| **Aggregate** | **19,500** | **78,000** | **76% average** | **69% average** |

These are planning estimates based on current reuse signals and a five-market baseline. They should be recalculated after the canonical content registry is connected to live production inventory.

## 8. Translation Reuse Report

Translation should occur from shared core assets first.

Estimated savings:

| Area | Translation Savings Estimate |
| --- | ---: |
| Core adult health and pathophysiology | 65% |
| Labs, ECG, pharmacology, and clinical skills | 68% |
| Clinical judgment and simulation logic | 58% |
| **Average** | **64%** |

Primary reason: one translated clinical core can support multiple country overlays, while only local regulatory, scope, terminology, and exam-specific components require separate translation and review.

## 9. Future International Expansion Roadmap

### Phase 1: Core Registry

- Create canonical IDs for global shared lessons, questions, flashcards, simulations, and NGN cases.
- Link existing Canada, United States, UK, Australia, and New Zealand pathways to canonical shared-core items.
- Flag existing duplicate assets for merge, overlay conversion, or archive review.

### Phase 2: Overlay Engine

- Add country overlay, language overlay, exam overlay, and role overlay metadata to content items.
- Block country-specific generation when a matching shared-core item exists.
- Add review workflows for regulation, documentation, scope, medication governance, and guideline differences.

### Phase 3: Translation Pipeline

- Translate `GLOBAL_SHARED_CORE` first.
- Translate country overlays second.
- Translate exam and role overlays last.
- Require localization review before any language path becomes indexable.

### Phase 4: Expansion Markets

- Launch future country frameworks by creating overlay packs rather than duplicate core content.
- Prioritize Ireland, UAE, Saudi Arabia, Singapore, India, and Philippines only after shared-core dedupe is operational.

## 10. Estimated Cost and Maintenance Savings

Expected impact if the shared-core model is enforced:

- Potential content reuse: 70-80% for globally transferable clinical topics.
- Potential maintenance reduction: 66-72% for repeated clinical concepts.
- Potential translation savings: 58-68% by translating shared core once.
- Potential SEO expansion savings: 50-60% by reusing canonical educational depth and creating localized overlays only where needed.

## Governance Rules

- No duplicate lesson creation when shared core content exists.
- No duplicate flashcard creation when shared core content exists.
- No duplicate question creation when shared core content exists.
- No duplicate simulation creation when shared core content exists.
- Country-specific generation is allowed only when regulation, documentation, scope, medication governance, or clinical guideline differences exist.

Until the shared-core registry clears review and publication gates, it remains hidden, admin-only, noindex, and unavailable to learners or search engines.
