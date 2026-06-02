# Global Inheritance Engine and Reuse Enforcement System

Status: enforcement contract implemented. This is a pre-generation control layer for international expansion and content generation.

## Executive Principle

Reuse first.

Overlay second.

Generate last.

Every new content request must prove why inheritance is insufficient before creating new educational assets.

## Implementation

Primary contract:

- `src/lib/international-content/global-inheritance-reuse-enforcement-system.ts`
- `src/lib/international-content/global-inheritance-reuse-enforcement-system.contract.test.ts`

Related architecture:

- `src/lib/international-content/global-knowledge-graph-content-inheritance-engine.ts`
- `src/lib/international-content/international-content-recovery-classification-engine.ts`
- `src/lib/international-content/international-rn-shared-core-framework.ts`

## Required Reuse Targets

| Asset Category | Minimum Reuse |
| --- | ---: |
| Lessons | 85% |
| Flashcards | 90% |
| Simulations | 95% |
| Clinical Cases | 90% |
| Labs | 95% |
| ECG | 95% |
| Pharmacology | 90% |

These are minimum targets. New international pathways should exceed them where possible.

## New Content Approval Rules

New content may only be generated when one of these conditions applies:

| Approved Reason |
| --- |
| Clinical standards differ |
| Regulatory requirements differ |
| Documentation requirements differ |
| Exam blueprint requirements differ |
| Scope of practice differs |
| Terminology differences create learner risk |

If none apply, the system must reuse existing global core and overlays.

## Global Clinical Core Registry

These topics must be assigned to `GLOBAL_SHARED_CORE` and may not be duplicated:

| Global Core Topic |
| --- |
| Heart Failure |
| COPD |
| Sepsis |
| Shock |
| ECG |
| ABGs |
| Labs |
| Pharmacology |
| Clinical Assessment |

## Required Inheritance Sequence

Every educational asset follows:

```text
Global Core
-> Role Overlay
-> Country Overlay
-> Exam Overlay
-> Language Overlay
-> Educational Asset
```

Generation may only fill missing layers. It may not create a new duplicate copy of a satisfied layer.

## Pre-Generation Checks

Before generating a lesson, question, flashcard, simulation, case study, or blog, the system checks:

| Check | Blocking Result |
| --- | --- |
| Similarity exceeds 85% | `GENERATION_BLOCKED` |
| Existing inherited content satisfies requirements | `GENERATION_BLOCKED` |
| Equivalent clinical objective exists | `GENERATION_BLOCKED` |
| Equivalent learning objective exists | `GENERATION_BLOCKED` |
| Role scope violation detected | `GENERATION_BLOCKED` |
| Missing new-content approval reason | `GENERATION_BLOCKED` |

When generation is allowed, the status is:

```text
GENERATE_MISSING_LAYERS_ONLY
```

## Role Scope Protection

Role overlays must enforce scope boundaries.

| Role | Blocked Concepts |
| --- | --- |
| PN | NP prescribing, advanced diagnostics, independent differential diagnosis, longitudinal management |
| RN | NP prescribing, independent diagnosis, advanced independent management |
| NP | No blocked advanced-scope concepts in this contract |

This prevents PN learners receiving NP content, RN learners receiving NP prescribing content, and PN learners receiving advanced diagnostics.

## Future International Expansion Order

Priority countries:

1. Ireland
2. UAE
3. Saudi Arabia
4. Singapore
5. India
6. Philippines

Each pathway must begin with:

1. Recovery
2. Classification
3. Inheritance
4. Localization
5. New content generation only for missing layers

No country expansion should proceed through duplication-first architecture.

## Translation Rules

Translations inherit:

```text
Global Core
-> Role Overlay
-> Country Overlay
-> Exam Overlay
-> Language Overlay
```

Translations may not create duplicate educational assets. They are downstream overlays, not independent clinical content sources.

## Maintenance Savings Tracking

Every international build should report:

| Metric |
| --- |
| Reuse % |
| Duplicate prevention % |
| Translation savings % |
| Maintenance reduction % |
| Estimated hours saved |
| Estimated content avoided |

Seeded examples:

| Build | Reuse | Duplicate Prevention | Translation Savings | Maintenance Reduction | Hours Saved | Content Avoided |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ireland RN overlay | 88% | 91% | 84% | 79% | 420 | 620 |
| UAE RN overlays | 86% | 89% | 82% | 76% | 690 | 980 |

## Executive Dashboard

The current dashboard contract reports:

| Metric | Value |
| --- | ---: |
| Global core inventory | 9 |
| Role overlay inventory | 3 |
| Country overlay inventory | 6 |
| Exam overlay inventory | 12 |
| Language overlay inventory | 3 |
| Required reuse target average | 91% |
| Duplicate prevention | 90% |
| Estimated hours saved | 1,110 |
| Estimated content avoided | 1,600 |

## Enforcement Examples

### Blocked: Inherited Content Already Satisfies Request

If Sepsis has global core, RN role overlay, UK country overlay, NMC CBT exam overlay, and English language overlay, a new Sepsis NMC CBT lesson is blocked.

Status:

```text
GENERATION_BLOCKED
```

Reason:

```text
existing_inherited_content_satisfies_requirements
```

### Blocked: Duplicate Similarity

If a proposed asset has similarity greater than 85%, generation is blocked even if an overlay is missing.

Status:

```text
GENERATION_BLOCKED
```

Reason:

```text
similarity_exceeds_threshold
```

### Allowed: Missing Regulatory Overlay

If global core, role overlay, and exam overlay exist but a country regulatory overlay is missing, generation may create only the missing country and language overlays, provided the request includes an approved reason such as:

```text
regulatory_requirements_differ
```

Status:

```text
GENERATE_MISSING_LAYERS_ONLY
```

## Success Criteria

The platform should converge toward:

- Heart Failure exists once.
- COPD exists once.
- Sepsis exists once.
- ECG exists once.
- Labs exist once.
- Pharmacology exists once.

Educational delivery changes through role, country, exam, and language overlays rather than duplicated clinical science.

## Verification

Contract test:

```bash
node --import tsx --test src/lib/international-content/global-inheritance-reuse-enforcement-system.contract.test.ts
```

The test verifies reuse targets, global core registry membership, inheritance order, duplicate blocking, scope protection, missing-reason blocking, international expansion ordering, and executive dashboard metrics.
