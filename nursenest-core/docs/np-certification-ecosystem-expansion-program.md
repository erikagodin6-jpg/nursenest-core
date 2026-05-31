# NP Certification Ecosystem Expansion Program

Date: 2026-05-31

Status: internal architecture and content roadmap. Future NP certifications remain hidden development targets unless already active in the current exam pathway registry.

## Executive Summary

NurseNest already has active NP pathway infrastructure for CNPLE, FNP, AGPCNP, PMHNP, WHNP, and PNP-PC. The next step is not to fork separate products. The scalable model is:

`NP Core Library` + `Specialty Certification Layer`

This allows advanced assessment, diagnostics, pharmacology, pathophysiology, evidence-based practice, ethics, leadership, and clinical decision-making to be built once and reused across all NP certifications.

## Machine-Readable Registry

The planning registry lives in:

`src/lib/np/np-certification-ecosystem.ts`

It defines:

- Shared NP core library domains.
- Content targets for 500+ lessons, 5,000+ flashcards, 3,000+ questions, and 200+ cases.
- Specialty pathways for FNP, AGPCNP, PMHNP, WHNP, PNP-PC, PNP-AC, ACNPC-AG, ENP, and CNPLE.
- Hidden development rules for future certifications.

## NP Core Library

| Domain | Lesson Target | Flashcard Target | Question Target | Case Target |
| --- | ---: | ---: | ---: | ---: |
| Advanced Assessment | 70 | 650 | 400 | 25 |
| Diagnostics | 60 | 600 | 375 | 24 |
| Clinical Decision-Making | 70 | 650 | 450 | 30 |
| Evidence-Based Practice | 45 | 450 | 250 | 12 |
| Advanced Pharmacology | 80 | 900 | 550 | 38 |
| Advanced Pathophysiology | 75 | 850 | 500 | 34 |
| Health Promotion | 45 | 450 | 250 | 14 |
| Professional Issues, Ethics, Leadership, And Research | 55 | 500 | 225 | 23 |

Total core targets:

- 500 lessons.
- 5,050 flashcards.
- 3,000 questions.
- 200 clinical cases.

## Specialty Pathway Strategy

| Pathway | Current Status | Shared Core | Specialty Focus |
| --- | --- | --- | --- |
| FNP | Active | NP_CORE | Lifespan primary care, family medicine, prevention, chronic disease |
| AGPCNP | Active | NP_CORE | Adult medicine, geriatrics, polypharmacy, function, long-term care |
| PMHNP | Active | NP_CORE | Psychiatric assessment, diagnosis, psychopharmacology, crisis |
| WHNP | Active | NP_CORE | Gynecology, prenatal/postpartum, contraception, menopause |
| PNP-PC | Active | NP_CORE | Growth, development, pediatric assessment, vaccines, family-centered care |
| PNP-AC | Hidden Development | NP_CORE | Pediatric acute care, emergency pediatrics, complex hospital care |
| ACNPC-AG | Hidden Development | NP_CORE | Critical care, hemodynamics, ventilation, shock, ICU management |
| ENP | Hidden Development | NP_CORE | Trauma, resuscitation, emergency diagnostics, toxicology |
| CNPLE | Active | NP_CORE | Canadian NP competencies, leadership, health promotion, prescribing |

## Content Tagging Model

Required tags:

- `NP_CORE`
- `FNP`
- `AGPCNP`
- `PMHNP`
- `WHNP`
- `PNP_PC`
- `PNP_AC`
- `ACNPC_AG`
- `ENP`
- `CNPLE`

Example:

Advanced Assessment:

- Tags: `NP_CORE`
- Used by: FNP, AGPCNP, PMHNP, WHNP, PNP-PC, PNP-AC, ACNPC-AG, ENP, CNPLE.

Acute ventilator management:

- Tags: `NP_CORE`, `ACNPC_AG`, `PNP_AC`, `ENP`
- Used broadly for acute care reasoning, specialized for ICU/emergency pathways.

## Hidden Development Policy

Future NP certifications must remain:

- `published=false`
- `visibleInNavigation=false`
- `launchReady=false`
- `indexable=false`
- `adminOnly=true`

This applies immediately to:

- PNP-AC.
- ACNPC-AG.
- ENP.
- Any future NP certification.

## Build Priorities

1. Strengthen NP Core Library first.
2. Expand active FNP, AGPCNP, PMHNP, WHNP, PNP-PC, and CNPLE specialty layers.
3. Build hidden PNP-AC, ACNPC-AG, and ENP specialty inventories.
4. Add specialty-specific readiness/report card models.
5. Do not expose hidden pathways until content, entitlement, SEO, and clinical review gates pass.

