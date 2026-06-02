# NP Content Reuse Engine

Date: 2026-05-31

Status: internal architecture strategy.

## Goal

Prevent NP content duplication while supporting highly specialized certification prep.

## Content Layers

| Layer | Tag | Purpose |
| --- | --- | --- |
| NP Core | `NP_CORE` | Shared advanced-practice fundamentals. |
| Specialty | `FNP`, `AGPCNP`, `PMHNP`, `WHNP`, `PNP_PC`, `PNP_AC`, `ACNPC_AG`, `ENP`, `CNPLE` | Role and exam-specific content. |
| Country / Regulator | Existing pathway country and exam scope | Canadian vs U.S. vs future country differences. |

## Examples

| Topic | Tags | Reuse |
| --- | --- | --- |
| Advanced Assessment | `NP_CORE` | All NP certifications. |
| Hypertension Management | `NP_CORE`, `FNP`, `AGPCNP`, `CNPLE` | Core management with primary care and Canadian overlays. |
| Therapeutic Alliance | `PMHNP` | Specialty-specific PMHNP content. |
| Prenatal Screening | `WHNP`, `FNP`, `CNPLE` | Shared by women’s health and primary care pathways. |
| Pediatric Weight-Based Dosing | `PNP_PC`, `PNP_AC`, `FNP` | Pediatric specialty plus family practice. |
| Ventilator Management | `ACNPC_AG`, `PNP_AC`, `ENP` | Acute care and emergency pathways. |

## Rules

1. Every NP item should include at least one NP tag.
2. Shared advanced-practice fundamentals should use `NP_CORE`.
3. Specialty content must include specialty tags.
4. PMHNP content must not leak into WHNP/PNP unless intentionally tagged as shared.
5. CNPLE content must avoid U.S.-specific AANP/ANCC/HIPAA framing unless explicitly comparing systems.
6. Hidden future certifications must not enter public selectors, navigation, sitemap, or marketing pages.

## Migration Strategy

1. Audit existing NP lessons, questions, flashcards, cases, and blog assets.
2. Tag reusable material as `NP_CORE`.
3. Tag specialty material with the relevant certification.
4. Convert duplicates into one canonical core item plus specialty overlays.
5. Keep future pathway drafts hidden until launch gates pass.

