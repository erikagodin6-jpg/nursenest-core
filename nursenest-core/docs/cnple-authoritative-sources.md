# CNPLE Authoritative Sources

Governance document tracking all authoritative external sources for Canadian
Nurse Practitioner Licensure Examination (CNPLE) content. Update this file
whenever a source is reviewed or when CCRNR releases new specifications.

**Do not automate scraping from these sources.**
**Do not fabricate regulatory details not present in these documents.**
**Always link to the primary source, not a secondary summary.**

---

## Primary Regulatory Authority

| Field | Value |
|---|---|
| **Body** | CCRNR — Canadian Council of Registered Nurse Regulators |
| **URL** | https://ccrnr.ca |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — CNPLE scheduled for July 2026 |
| **Notes** | Primary governing body for the CNPLE. Single NP classification model under CCRNR replaces provincial CNPE streams. Confirm all exam details (question count, timing, passing standard, item formats) directly from CCRNR before publishing specifics. |

---

## Canadian NP Competency Frameworks

### Canadian Nurse Practitioner Core Competency Framework

| Field | Value |
|---|---|
| **Publisher** | Canadian Association of Schools of Nursing (CASN) / Canadian Nurses Association (CNA) |
| **URL placeholder** | https://casn.ca (check for current NP competency framework document) |
| **Last reviewed** | 2026-05-12 |
| **Status** | Published — NurseNest content domains derived from this framework |
| **Notes** | This framework describes NP entry-level competency domains including clinical decision-making, prescribing authority, diagnostics, and professional practice. NurseNest uses this as the primary domain taxonomy for CNPLE-aligned preparation. |

### Entry-Level Competencies for NPs (Provincial)

| Field | Value |
|---|---|
| **Publisher** | Various provincial colleges (CNO, BCCNM, CRNNS, etc.) |
| **URL placeholder** | Check each provincial college for current NP scope documents |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — vary by province; use for scope validation |
| **Notes** | Provincial scope documents define prescribing authority, NP practice scope, and registration requirements. The CNPLE is national but practice scope remains provincial. Content governance should verify that prescribing examples align with the most conservative common scope across major provinces. |

---

## Prescribing Authority Frameworks

### Canadian NP Prescribing Guidelines

| Field | Value |
|---|---|
| **Reference body** | CCRNR, provincial colleges |
| **URL placeholder** | https://ccrnr.ca (NP prescribing framework documents) |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — varies by province |
| **Notes** | Prescribing questions must reflect scope that is valid in the majority of Canadian provinces. Do not assume a uniform national formulary — some provinces restrict specific drug classes for NPs. When in doubt, use "within NP scope where legislated" framing. |

### CANMAT Clinical Practice Guidelines (Psychiatry)

| Field | Value |
|---|---|
| **Publisher** | Canadian Network for Mood and Anxiety Treatments |
| **URL placeholder** | https://www.canmat.org |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — used for mental health pharmacotherapy content |
| **Notes** | CANMAT guidelines are the authoritative Canadian reference for antidepressant, mood stabilizer, and anxiolytic management. Mental health prescribing questions should be validated against current CANMAT editions. |

### SOGC Clinical Practice Guidelines (Women's Health)

| Field | Value |
|---|---|
| **Publisher** | Society of Obstetricians and Gynaecologists of Canada |
| **URL placeholder** | https://www.jogc.com / https://sogc.org |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — used for reproductive health, contraception, obstetric content |
| **Notes** | SOGC guidelines are the authoritative Canadian reference for contraception (CMEC), prenatal care, menopause management, and gynaecological oncology screening. All women's health questions should be validated against current SOGC guidelines, not ACOG (US). |

---

## Screening and Preventive Care

### Canadian Task Force on Preventive Health Care (CTFPHC)

| Field | Value |
|---|---|
| **Publisher** | Public Health Agency of Canada / CTFPHC |
| **URL placeholder** | https://canadiantaskforce.ca |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — used for cancer screening and preventive care content |
| **Notes** | CTFPHC guidelines are the Canadian reference for breast cancer screening, cervical cancer screening (primary HPV testing transition), colorectal cancer screening, and other preventive care recommendations. Use CTFPHC, not USPSTF (US), for Canadian NP preparation content. |

### Canadian Immunization Guide

| Field | Value |
|---|---|
| **Publisher** | Public Health Agency of Canada |
| **URL placeholder** | https://www.canada.ca/en/public-health/services/canadian-immunization-guide.html |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — used for immunization schedule content |
| **Notes** | The Canadian Immunization Guide (CIG) is the authoritative reference for routine and non-routine immunization schedules. Use this, not CDC ACIP schedules, for paediatric and adult immunization questions. |

---

## Geriatric Guidelines

### Choosing Wisely Canada

| Field | Value |
|---|---|
| **Publisher** | Choosing Wisely Canada |
| **URL placeholder** | https://choosingwiselycanada.org |
| **Last reviewed** | 2026-05-12 |
| **Status** | Active — deprescribing and overuse recommendations |
| **Notes** | Used to validate geriatric polypharmacy and deprescribing content. Lists of potentially inappropriate medications in older Canadians (in conjunction with Beers Criteria and STOPP/START). |

---

## CNPLE Exam Blueprint and Format

### CCRNR CNPLE Examination Blueprint

| Field | Value |
|---|---|
| **Publisher** | CCRNR |
| **URL placeholder** | https://ccrnr.ca (check for blueprint publication) |
| **Last reviewed** | 2026-05-12 |
| **Status** | **NOT YET PUBLISHED** — Awaiting CCRNR release |
| **Notes** | As of 2026-05-12, a detailed CNPLE content blueprint with official domain weightings, item count, and passing standard has not been publicly released by CCRNR. All NurseNest domain coverage is derived from the Canadian NP competency frameworks listed above. **When CCRNR publishes the blueprint**: (1) Update `cnple-spec.ts` `officiallyConfirmed` fields. (2) Adjust domain weightings in the simulation session configuration. (3) Update `status` from `"provisional"` to `"confirmed"`. (4) Remove or archive provisional disclaimers where applicable. |

### CNPLE Testing Format

| Field | Value |
|---|---|
| **Publisher** | CCRNR |
| **Last reviewed** | 2026-05-12 |
| **Status** | **Partially confirmed** — LOFT format is publicly referenced |
| **Notes** | CCRNR has publicly indicated the CNPLE uses a LOFT (linear on-the-fly testing) format, not CAT. This is confirmed in `cnple-spec.ts` as `format.confirmed: true`. Question count (150), timing (240 min), and passing standard remain provisional until official candidate guide publication. |

---

## When CCRNR Publishes Official Specifications

Update in this order:

1. This document — record the source URL, date reviewed, and status change.
2. `src/lib/cnple/cnple-spec.ts` — set `confirmed: true` for each confirmed field; set `status: "confirmed"` when all core fields are confirmed.
3. `src/lib/exam-pathways/pathway-readiness-config.ts` — update `minQuestions`, `maxQuestions`, `timeLimitMinutes` for `ca-np-cnple`.
4. `src/lib/cnple/cnple-item-types.ts` — set `officiallyConfirmed: true` for confirmed types.
5. Remove provisional disclaimer banners from pages where specifications are now confirmed (set `hideWhenConfirmed={true}` on `CnpleProvisionalDisclaimer`).
6. Update marketing copy that currently says "provisional" or "subject to confirmation".

---

*Document maintained by: NurseNest engineering team.*
*Last updated: 2026-05-12.*
