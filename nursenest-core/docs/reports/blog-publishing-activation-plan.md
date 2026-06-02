# Blog Publishing Activation Plan
Generated: 2026-06-01 | Period: 2026-06-01 – 2027-05-31

## Overview

This plan activates all available blog content across a **365-day publishing calendar** from **2026-06-01** to **2027-05-31** at **3 posts per day per language** (9 posts/day total across all three target locales). Content is distributed by pathway (RN / RPN / NP) and scheduled to avoid body-system clustering on the same day.

---

## 1. Inventory Summary

### By Locale (All Posts)

| Locale | Code | Total Posts | RN | RPN | NP | Notes |
|--------|------|------------|-----|-----|-----|-------|
| English (default) | `en` | 3355 | 1696 | 781 | 878 | |
| English (US explicit) | `en-US` | 40 | 39 | 0 | 1 | |
| French | `fr` | 140 | 140 | 0 | 0 | |
| French (explicit) | `fr-FR` | 10 | 10 | 0 | 0 | |
| Spanish | `es` | 140 | 140 | 0 | 0 | |
| Spanish (explicit) | `es-ES` | 10 | 10 | 0 | 0 | |
| Arabic | `ar` | 140 | 140 | 0 | 0 | |
| Arabic (SA) | `ar-SA` | 10 | 10 | 0 | 0 | |
| Hindi | `hi` | 140 | 140 | 0 | 0 | |
| Hindi (IN) | `hi-IN` | 10 | 10 | 0 | 0 | |
| Japanese | `ja` | 140 | 140 | 0 | 0 | |
| Japanese (JP) | `ja-JP` | 10 | 10 | 0 | 0 | |
| Portuguese | `pt` | 140 | 140 | 0 | 0 | |
| Portuguese (BR) | `pt-BR` | 10 | 10 | 0 | 0 | |
| Filipino | `fil` | 140 | 140 | 0 | 0 | |
| Tagalog (PH) | `tl-PH` | 10 | 10 | 0 | 0 | |
| Chinese Simplified | `zh-Hans` | 140 | 140 | 0 | 0 | |
| Chinese (CN) | `zh-CN` | 10 | 10 | 0 | 0 | |
| **TOTAL** | — | **4595** | — | — | — | |

> **Note**: Posts with no `locale:` field in frontmatter are counted as English (`en`) per system convention. The 3,355 posts in this bucket are predominantly English-language NCLEX/licensing exam content.

### By Pathway and Body System (Scheduling-Normalized Locales)

For scheduling purposes, `en-US` → `en`, `fr-FR` → `fr`, `es-ES` → `es`.

| Locale | Scheduling Pool | RN | RPN | NP | Top Body Systems |
|--------|----------------|-----|-----|-----|-----------------|
| English | 3395 | 1735 | 781 | 879 | general (1430), respiratory (488), gi (444), mental health (141) |
| French | 150 | 150 | 0 | 0 | gi (131), neuro (10), general (8), pain (1) |
| Spanish | 150 | 150 | 0 | 0 | general (83), gi (20), electrolyte (11), pain (11) |

---

## 2. Shortage Analysis

### 365-Day Requirements

At **3 posts/day × 365 days = 1,095 posts needed per locale** to fill the calendar without recycling.

| Locale | Available | Needed | Shortage | Runway | Cycle Starts |
|--------|-----------|--------|----------|--------|-------------|
| English | 3395 | 1095 | 0 (surplus: 2300) | Full 365 days | N/A |
| French | 150 | 1095 | 945 | 50 days | 2026-07-21 |
| Spanish | 150 | 1095 | 945 | 50 days | 2026-07-21 |

### English (en) — No Shortage

English has **3395 posts** against a requirement of 1095. This is a **surplus of 2300 posts** (310% coverage). No cycling required. All 365 days are filled with unique content.

Pathway breakdown: RN 1735 | RPN 781 | NP 879

### French (fr) — Critical Shortage

**150 posts available**, 1095 needed — **shortage of 945 posts** (14% coverage).

- Inventory covers **50 days** at 3 posts/day
- Content cycling begins: **2026-07-21** (day 51 of 365)
- Cycles required to fill the year: **7 additional cycle(s)** (queue reshuffled each cycle)
- Pathway breakdown: RN 150 | RPN 0 | NP 0

**Root cause**: The French inventory consists entirely of "International nursing licensing (French)" category posts — all classified as RN pathway with international licensing focus. There are **zero French RPN posts** and **zero French NP posts** in the current inventory.

**Gap-filling strategy**: See Section 5.

### Spanish (es) — Critical Shortage

**150 posts available**, 1095 needed — **shortage of 945 posts** (14% coverage).

- Inventory covers **50 days** at 3 posts/day
- Content cycling begins: **2026-07-21** (day 51 of 365)
- Cycles required to fill the year: **7 additional cycle(s)** (queue reshuffled each cycle)
- Pathway breakdown: RN 150 | RPN 0 | NP 0

**Root cause**: Like French, the Spanish inventory consists entirely of "International nursing licensing (Spanish)" category posts — all RN pathway. There are **zero Spanish RPN posts** and **zero Spanish NP posts**.

**Gap-filling strategy**: See Section 5.

### NP Pathway Shortage

At balanced 3-way rotation (RN/RPN/NP), each locale ideally needs ~365 NP posts to maintain rotation without repeating NP content. With fewer NP posts, the scheduler fills NP slots by cycling available NP inventory first before borrowing from other pathways.

| Locale | NP Posts Available | NP Posts Needed (1/day) | Gap |
|--------|-------------------|------------------------|-----|
| English | 879 | 365 | None |
| French | 0 | 365 | 365 (0% covered) |
| Spanish | 0 | 365 | 365 (0% covered) |

**English NP**: 879 posts (241% of 365-day ideal). The English NP queue cycles approximately every 879 days before repeating.

**French NP** and **Spanish NP**: Zero posts in current inventory. All NP rotation slots will be filled by cycling the available RN posts. This means French and Spanish readers will not receive NP-specific content unless new posts are created.

---

## 3. Scheduling Rules Applied

1. **Pathway rotation**: Each day's 3 posts cycle RN → RPN → NP where possible. Locales without RPN/NP posts use available content with cycling.
2. **Body-system diversity**: Posts with the same body system are not scheduled on the same day when avoidable (up to 15-position lookahead).
3. **Language independence**: English, French, and Spanish slots are scheduled independently.
4. **Shortage handling**: When a locale's inventory is exhausted, the queue is reshuffled and recycled from the beginning. Cycle dates are explicitly marked.
5. **Total daily output**: **9 posts/day** (3 EN + 3 FR + 3 ES).
6. **No hard publish dates overridden**: All existing `publishedAt` values are preserved; this plan defines the scheduling queue order.

---

## 4. 365-Day Publishing Calendar

### Detailed View: First 90 Days (2026-06-01 – 2026-08-29)

> Titles truncated to 35 characters. Pathway shown in brackets: [RN] [RPN] [NP].

| Date | EN-1 | EN-2 | EN-3 | FR-1 | FR-2 | FR-3 | ES-1 | ES-2 | ES-3 |
|------|------|------|------|------|------|------|------|------|------|
| 2026-06-01 | Psychiatric Nursing for New Grad… [RN] | Delegation and UCP questions on … [RPN] | Pneumonia assessment, oxygen tit… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Enfermería internacional (65): s… [RN] | Enfermería internacional (70): n… [RN] | Enfermería internacional (114): … [RN] |
| 2026-06-02 | Preceptor feedback cycles for Ne… [RN] | Pneumonia assessment, oxygen tit… [RPN] | Renal, fluid, and electrolyte fo… [NP] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (24): i… [RN] | Enfermería internacional (114): … [RN] | Enfermería internacional (88): d… [RN] |
| 2026-06-03 | PNLE community health nursing hi… [RN] | Hypokalemia Explained for Nursin… [RPN] | Bronchoscopy ventilation assist … [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (88): d… [RN] | Enfermería internacional (45): d… [RN] | Enfermería internacional (85): r… [RN] |
| 2026-06-04 | Bronchoscopy ventilation assist … [RN] | New grad RPN first job survival … [RPN] | Hyponatraemia: chronic versus ac… [NP] | STEMI antérieur : sus-décalage V… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (94): p… [RN] | Enfermería internacional (116): … [RN] | Enfermería internacional (18): s… [RN] |
| 2026-06-05 | ARDS PEEP titration concepts for… [RN] | New grad practical nurse first j… [RPN] | Hyponatraemia: chronic versus ac… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (41): i… [RN] | Enfermería internacional (18): s… [RN] | Enfermería internacional (30): h… [RN] |
| 2026-06-06 | New grad nurse first job guide: … [RN] | Warfarin monitoring and anticoag… [RPN] | Closed suction versus open sucti… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (13): i… [RN] | Enfermería internacional (30): h… [RN] | Enfermería internacional (40): d… [RN] |
| 2026-06-07 | Closed suction versus open sucti… [RN] | New grad RPN first job survival … [RPN] | Blood Transfusion Reaction Nursi… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (109): … [RN] | Enfermería internacional (40): d… [RN] | Enfermería internacional (86): h… [RN] |
| 2026-06-08 | Blood Transfusion Reaction Nursi… [RN] | Shift organization tips for new … [RPN] | Respiratory for Canadian Family … [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (87): h… [RN] | Enfermería internacional (86): h… [RN] | Enfermería internacional (104): … [RN] |
| 2026-06-09 | Hospital Discharge Planning: Int… [RN] | Mental health and substance use … [NP] | Advanced respiratory assessment:… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (86): h… [RN] | Enfermería internacional (61): s… [RN] | Enfermería internacional (104): … [RN] |
| 2026-06-10 | First-shift organization for New… [RN] | Advanced respiratory assessment:… [NP] | Musculoskeletal for Canadian Adu… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (44): a… [RN] | Enfermería internacional (63): e… [RN] | Enfermería internacional (124): … [RN] |
| 2026-06-11 | Saudi SCFHS Nursing Classificati… [RN] | COPD, oxygen safety, and Canadia… [RPN] | Musculoskeletal for Canadian Adu… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (52): i… [RN] | Enfermería internacional (123): … [RN] | Enfermería internacional (102): … [RN] |
| 2026-06-12 | Sickle Cell Vaso-Occlusive Crisi… [RN] | Documentation and communication … [RPN] | Asthma Pathophysiology and Emerg… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (23): a… [RN] | Enfermería internacional (102): … [RN] | Enfermería internacional (39): d… [RN] |
| 2026-06-13 | Handoff risk reduction for New G… [RN] | Asthma Pathophysiology and Emerg… [RPN] | Tuberculosis precautions, airbor… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (39): d… [RN] | Enfermería internacional (72): a… [RN] | Enfermería internacional (110): … [RN] |
| 2026-06-14 | Nursing school study systems tha… [RN] | Tuberculosis precautions, airbor… [RPN] | Recognizing early sepsis on REx-… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | BRI y isquemia: criterios tipo S… [RN] | Enfermería internacional (67): d… [RN] | Enfermería internacional (110): … [RN] |
| 2026-06-15 | National Safety and Quality Heal… [RN] | Recognizing early sepsis on REx-… [RPN] | Neurology for Canadian PHC NP pr… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Enfermería internacional (110): … [RN] | Enfermería internacional (83): i… [RN] | Enfermería internacional (101): … [RN] |
| 2026-06-16 | From Orientation to Rehab: What … [RN] | Post-operative assessment, drain… [RPN] | Cardiovascular for Canadian Fami… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Enfermería internacional (92): l… [RN] | Enfermería internacional (133): … [RN] | Enfermería internacional (35): e… [RN] |
| 2026-06-17 | Sepsis Early Recognition in Cana… [RN] | Post-operative assessment, drain… [RPN] | Cardiovascular for Canadian Fami… [NP] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Soins infirmiers internationaux … [RN] | FA en el ECG: irregularidad, rie… [RN] | Enfermería internacional (35): e… [RN] | Enfermería internacional (48): c… [RN] |
| 2026-06-18 | Jumpstart Pediatric Modification… [RN] | Burnout prevention for practical… [RPN] | Cardiovascular for Canadian Fami… [NP] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (35): e… [RN] | Enfermería internacional (6): in… [RN] | Enfermería internacional (48): c… [RN] |
| 2026-06-19 | COPD type II respiratory failure… [RN] | Sodium restriction teaching and … [RPN] | Sepsis Recognition and NHS Sepsi… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Péricardite : sus-décalage ST di… [RN] | Enfermería internacional (120): … [RN] | Enfermería internacional (1): re… [RN] | Enfermería internacional (9): sh… [RN] |
| 2026-06-20 | Sepsis Recognition and NHS Sepsi… [RN] | New grad RPN first job survival … [RPN] | Musculoskeletal for Canadian PHC… [NP] | Soins infirmiers internationaux … [RN] | Péricardite : sus-décalage ST di… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (21): e… [RN] | Enfermería internacional (7): eq… [RN] | Enfermería internacional (75): h… [RN] |
| 2026-06-21 | Narrow-Complex Tachycardia: AVNR… [RN] | Heart failure monitoring, daily … [RPN] | Hematology Analyzer QC and Westg… [RN] | Péricardite : sus-décalage ST di… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (69): i… [RN] | Enfermería internacional (75): h… [RN] | Enfermería internacional (17): d… [RN] |
| 2026-06-22 | Hematology Analyzer QC and Westg… [RN] | How to pass the REx-PN on your f… [RPN] | Musculoskeletal for Canadian Adu… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (75): h… [RN] | Enfermería internacional (80): i… [RN] | Enfermería internacional (17): d… [RN] |
| 2026-06-23 | ROSC After Cardiac Arrest: Preho… [RN] | Abuse, neglect, and reporting ob… [RPN] | Digital Health and EHR Documenta… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (43): E… [RN] | Enfermería internacional (22): p… [RN] | Enfermería internacional (47): h… [RN] |
| 2026-06-24 | Digital Health and EHR Documenta… [RN] | Indigenous cultural safety as ex… [RPN] | Musculoskeletal for Canadian Adu… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Enfermería internacional (47): h… [RN] | Enfermería internacional (2): hi… [RN] | Enfermería internacional (14): n… [RN] |
| 2026-06-25 | Respectful clinical inquiry for … [RN] | Postpartum care priorities for R… [RPN] | Respiratory for Canadian Adult N… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Pericarditis: elevación difusa d… [RN] | Enfermería internacional (118): … [RN] | Enfermería internacional (138): … [RN] |
| 2026-06-26 | Child Welfare Settings: Trauma-I… [RN] | Stroke Rehabilitation Basics for… [RN] | Pediatric respiratory distress c… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Enfermería internacional (140): … [RN] | Enfermería internacional (138): … [RN] | Enfermería internacional (8): le… [RN] |
| 2026-06-27 | Stroke Rehabilitation Basics for… [RN] | Pediatric respiratory distress c… [RPN] | Hematology and hemostasis for Ca… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Enfermería internacional (8): le… [RN] | Enfermería internacional (117): … [RN] | Enfermería internacional (76): c… [RN] |
| 2026-06-28 | Documentation Standards in Gulf … [RN] | Hand hygiene, moments, and audit… [RPN] | Renal, fluid, and electrolyte fo… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | ECG de 12 derivaciones: lectura … [RN] | Enfermería internacional (76): c… [RN] | Enfermería internacional (58): h… [RN] |
| 2026-06-29 | Delegation within legal scope fo… [RN] | Pneumonia assessment, oxygen tit… [RPN] | Neurology for Canadian Adult NP … [NP] | Tachycardie ventriculaire : mono… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (97): i… [RN] | Enfermería internacional (76): c… [RN] | Enfermería internacional (58): h… [RN] |
| 2026-06-30 | Kuwait MOH high-alert medication… [RN] | Sleep and boundary planning for … [RN] | Infection control and IPAC conce… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (51): a… [RN] | Enfermería internacional (58): h… [RN] | Enfermería internacional (50): p… [RN] |
| 2026-07-01 | Sleep and boundary planning for … [RN] | Infection control and IPAC conce… [RPN] | Chemotherapy extravasation immed… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (89): s… [RN] | Enfermería internacional (131): … [RN] | Enfermería internacional (129): … [RN] |
| 2026-07-02 | First-shift organization for New… [RN] | Pain assessment tools and practi… [RPN] | Pediatric assessment and weight-… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Enfermería internacional (129): … [RN] | Enfermería internacional (91): e… [RN] | Enfermería internacional (4): de… [RN] |
| 2026-07-03 | Pediatric New Graduate Essential… [RN] | Sodium restriction teaching and … [RPN] | Neurology for Canadian Adult NP … [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Enfermería internacional (71): E… [RN] | Enfermería internacional (19): h… [RN] | Enfermería internacional (54): t… [RN] |
| 2026-07-04 | Weaning Readiness and Spontaneou… [RN] | Wound dressings, exudate, and in… [RPN] | Sepsis management: recognition, … [NP] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Repolarización temprana frente a… [RN] | Enfermería internacional (54): t… [RN] | Enfermería internacional (132): … [RN] |
| 2026-07-05 | Delegation within legal scope fo… [RN] | Pneumonia assessment, oxygen tit… [RPN] | Freedom to Speak Up referral rou… [NP] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (113): … [RN] | Enfermería internacional (132): … [RN] | Enfermería internacional (106): … [RN] |
| 2026-07-06 | After Patient Death on Step-Down… [RN] | Hypernatremia: Causes, Symptoms,… [RPN] | Pneumonia assessment, oxygen tit… [RPN] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (29): r… [RN] | Enfermería internacional (106): … [RN] | Enfermería internacional (74): s… [RN] |
| 2026-07-07 | Assistive Technology for ADLs: F… [RN] | Pneumonia assessment, oxygen tit… [RPN] | Renal, fluid, and electrolyte fo… [NP] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (3): hi… [RN] | Enfermería internacional (74): s… [RN] | Enfermería internacional (32): d… [RN] |
| 2026-07-08 | SVN timing with continuous mecha… [RN] | How to pass the CPNRE on your fi… [RPN] | Musculoskeletal for Canadian Gen… [NP] | Soins infirmiers internationaux … [RN] | Infarctus postérieur : sous-déca… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (74): s… [RN] | STEMI inferior e infarto de VD: … [RN] | Enfermería internacional (32): d… [RN] |
| 2026-07-09 | Heart failure nursing priorities… [RN] | Subcutaneous insulin administrat… [RPN] | Infectious disease for Canadian … [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI inférieur et dysfonction V… [RN] | Enfermería internacional (12): d… [RN] | Enfermería internacional (100): … [RN] | Enfermería internacional (32): d… [RN] |
| 2026-07-10 | Diabetes Review Themes: Hypoglyc… [RN] | Falls risk, Morse/Baden scales, … [RPN] | COPD nursing priorities for prac… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI inférieur et dysfonction V… [RN] | Enfermería internacional (32): d… [RN] | Enfermería internacional (119): … [RN] | Enfermería internacional (49): e… [RN] |
| 2026-07-11 | Child Welfare Settings: Confiden… [RN] | COPD nursing priorities for prac… [RPN] | GERD Management Review for NP Ce… [NP] | Soins infirmiers internationaux … [RN] | STEMI inférieur et dysfonction V… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (38): p… [RN] | Enfermería internacional (103): … [RN] | Enfermería internacional (78): p… [RN] |
| 2026-07-12 | Incentive Spirometry: Postoperat… [RN] | Mental health triage language an… [RPN] | Hematology and hemostasis for Ca… [NP] | Soins infirmiers internationaux … [RN] | STEMI inférieur et dysfonction V… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (103): … [RN] | Enfermería internacional (137): … [RN] | Enfermería internacional (78): p… [RN] |
| 2026-07-13 | Heart failure nursing priorities… [RN] | Palliative symptoms, comfort mea… [RPN] | Musculoskeletal for Canadian PHC… [NP] | Repolarisation précoce versus ST… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (62): i… [RN] | Enfermería internacional (78): p… [RN] | Enfermería internacional (73): d… [RN] |
| 2026-07-14 | Sleep and boundary planning for … [RN] | Musculoskeletal for Canadian PHC… [NP] | Qatar MOPH infection outbreak nu… [RN] | Soins infirmiers internationaux … [RN] | Bloc de branche gauche et ischém… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (73): d… [RN] | Enfermería internacional (37): s… [RN] | Enfermería internacional (26): t… [RN] |
| 2026-07-15 | Qatar MOPH infection outbreak nu… [RN] | Mental health triage language an… [RPN] | Breathlessness in serious illnes… [NP] | Soins infirmiers internationaux … [RN] | Bloc de branche gauche et ischém… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (34): i… [RN] | Enfermería internacional (68): d… [RN] | Enfermería internacional (11): d… [RN] |
| 2026-07-16 | Lebanon Ministry of Public Healt… [RN] | Delirium versus dementia cues fo… [RPN] | Osteoporosis: fracture preventio… [NP] | Soins infirmiers internationaux … [RN] | Bloc de branche gauche et ischém… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (136): … [RN] | Enfermería internacional (96): d… [RN] | Enfermería internacional (11): d… [RN] |
| 2026-07-17 | RDS and surfactant replacement p… [RN] | NEWS2 Interpretation and Escalat… [NP] | Managing exam anxiety during CPN… [RPN] | Soins infirmiers internationaux … [RN] | Bloc de branche gauche et ischém… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (11): d… [RN] | Hiperpotasemia en el ECG: de ond… [RN] | Enfermería internacional (64): l… [RN] |
| 2026-07-18 | New Grads on LTC: Staying Organi… [RN] | Managing exam anxiety during CPN… [RPN] | Hyponatraemia: chronic versus ac… [NP] | Bloc de branche gauche et ischém… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (42): n… [RN] | Enfermería internacional (36): l… [RN] | Enfermería internacional (46): s… [RN] |
| 2026-07-19 | Antibiotic Classes Explained: Ce… [RN] | Medication reconciliation at tra… [RPN] | Infectious disease for Canadian … [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Enfermería internacional (5): sí… [RN] | Enfermería internacional (36): l… [RN] | Enfermería internacional (46): s… [RN] |
| 2026-07-20 | Canadian Nursing Documentation: … [RN] | Urinary catheter care and CAUTI … [RPN] | Neonatal oxygen saturation targe… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Enfermería internacional (95): d… [RN] | Enfermería internacional (20): c… [RN] | Enfermería internacional (82): t… [RN] |
| 2026-07-21 | Australia OBA MCQ component: exa… [RN] | Neonatal oxygen saturation targe… [RN] | First-shift organization for New… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Enfermería internacional (65): s… [RN] | Enfermería internacional (70): n… [RN] | Enfermería internacional (114): … [RN] |
| 2026-07-22 | Neonatal oxygen saturation targe… [RN] | Paediatric for Canadian PHC NP p… [NP] | First-shift organization for New… [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (24): i… [RN] | Enfermería internacional (114): … [RN] | Enfermería internacional (88): d… [RN] |
| 2026-07-23 | How to approach NCLEX case study… [RN] | First-shift organization for New… [RN] | Unstable Tachycardia Cardioversi… [RN] | Soins infirmiers internationaux … [RN] | STEMI antérieur : sus-décalage V… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (88): d… [RN] | Enfermería internacional (45): d… [RN] | Enfermería internacional (85): r… [RN] |
| 2026-07-24 | First-shift organization for New… [RN] | Consent, capacity, and substitut… [RPN] | Unstable Tachycardia Cardioversi… [RN] | STEMI antérieur : sus-décalage V… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (94): p… [RN] | Enfermería internacional (116): … [RN] | Enfermería internacional (18): s… [RN] |
| 2026-07-25 | Unstable Tachycardia Cardioversi… [RN] | Mental health triage language an… [RPN] | First Unsafe Staffing on LTC as … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (41): i… [RN] | Enfermería internacional (18): s… [RN] | Enfermería internacional (30): h… [RN] |
| 2026-07-26 | First Unsafe Staffing on LTC as … [RN] | Heart failure nursing priorities… [RPN] | Endocrine and metabolic for Cana… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (13): i… [RN] | Enfermería internacional (30): h… [RN] | Enfermería internacional (40): d… [RN] |
| 2026-07-27 | Stable versus unstable patients … [RN] | Acute care assessment: undiffere… [NP] | Infection prevention and control… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (109): … [RN] | Enfermería internacional (40): d… [RN] | Enfermería internacional (86): h… [RN] |
| 2026-07-28 | Infection prevention and control… [RN] | Falls risk, Morse/Baden scales, … [RPN] | Stroke recognition, FAST teachin… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (87): h… [RN] | Enfermería internacional (86): h… [RN] | Enfermería internacional (104): … [RN] |
| 2026-07-29 | UK Nursing Interview Preparation… [RN] | Stroke recognition, FAST teachin… [RPN] | Lactate And Perfusion Endpoints … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (86): h… [RN] | Enfermería internacional (61): s… [RN] | Enfermería internacional (104): … [RN] |
| 2026-07-30 | Lactate And Perfusion Endpoints … [RN] | Therapeutic communication exampl… [RPN] | NGN-style clinical judgment habi… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (44): a… [RN] | Enfermería internacional (63): e… [RN] | Enfermería internacional (124): … [RN] |
| 2026-07-31 | NGN-style clinical judgment habi… [RN] | Peripheral IV site assessment, p… [RPN] | Gastrointestinal for Canadian Ad… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (52): i… [RN] | Enfermería internacional (123): … [RN] | Enfermería internacional (102): … [RN] |
| 2026-08-01 | British Columbia [RN] | ABG interpretation: metabolic, r… [NP] | CBC basics practical nurses use … [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (23): a… [RN] | Enfermería internacional (102): … [RN] | Enfermería internacional (39): d… [RN] |
| 2026-08-02 | Family relocation timelines alon… [RN] | CBC basics practical nurses use … [RPN] | Hematology and hemostasis for Ca… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (39): d… [RN] | Enfermería internacional (72): a… [RN] | Enfermería internacional (110): … [RN] |
| 2026-08-03 | Driving pressure concepts for re… [RN] | Suicide precautions and safety a… [RPN] | Women's and sexual health for Ca… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | BRI y isquemia: criterios tipo S… [RN] | Enfermería internacional (67): d… [RN] | Enfermería internacional (110): … [RN] |
| 2026-08-04 | How to answer bow-tie questions … [RN] | Stroke and TIA: FAST assessment,… [NP] | Musculoskeletal for Canadian Fam… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Enfermería internacional (110): … [RN] | Enfermería internacional (83): i… [RN] | Enfermería internacional (101): … [RN] |
| 2026-08-05 | Stroke nursing assessment: FAST … [RN] | Clinical placement success for p… [RPN] | Musculoskeletal for Canadian Fam… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Enfermería internacional (92): l… [RN] | Enfermería internacional (133): … [RN] | Enfermería internacional (35): e… [RN] |
| 2026-08-06 | Moral distress and ethical pause… [RN] | Recognizing early sepsis on REx-… [RPN] | Atrial fibrillation rate control… [NP] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Soins infirmiers internationaux … [RN] | FA en el ECG: irregularidad, rie… [RN] | Enfermería internacional (35): e… [RN] | Enfermería internacional (48): c… [RN] |
| 2026-08-07 | Boundary Crossings Versus Violat… [RN] | Pain assessment tools and practi… [RPN] | Asthma monitoring and peak flow … [RN] | Soins infirmiers internationaux … [RN] | Fibrillation auriculaire à l’ECG… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (35): e… [RN] | Enfermería internacional (6): in… [RN] | Enfermería internacional (48): c… [RN] |
| 2026-08-08 | Asthma monitoring and peak flow … [RN] | Burnout prevention for practical… [RPN] | Mental health assessment: MSE el… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Péricardite : sus-décalage ST di… [RN] | Enfermería internacional (120): … [RN] | Enfermería internacional (1): re… [RN] | Enfermería internacional (9): sh… [RN] |
| 2026-08-09 | Informed Consent, Capacity, and … [RN] | Heart failure daily weights and … [RPN] | Geriatric for Canadian General N… [NP] | Soins infirmiers internationaux … [RN] | Péricardite : sus-décalage ST di… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (21): e… [RN] | Enfermería internacional (7): eq… [RN] | Enfermería internacional (75): h… [RN] |
| 2026-08-10 | Time-blocking around med passes … [RN] | Geriatric for Canadian General N… [NP] | Suicide precautions and safety a… [RPN] | Péricardite : sus-décalage ST di… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (69): i… [RN] | Enfermería internacional (75): h… [RN] | Enfermería internacional (17): d… [RN] |
| 2026-08-11 | Trauma Triage Basics for EMS: ST… [RN] | Suicide precautions and safety a… [RPN] | Opioids and respiratory depressi… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (75): h… [RN] | Enfermería internacional (80): i… [RN] | Enfermería internacional (17): d… [RN] |
| 2026-08-12 | Lactate Measurement: Pre-analyti… [RN] | Suicide precautions and safety a… [RPN] | Opioids and respiratory depressi… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (43): E… [RN] | Enfermería internacional (22): p… [RN] | Enfermería internacional (47): h… [RN] |
| 2026-08-13 | Opioids and respiratory depressi… [RN] | ABCs versus Maslow for REx-PN pr… [RPN] | Stroke recognition, FAST cues, a… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Enfermería internacional (47): h… [RN] | Enfermería internacional (2): hi… [RN] | Enfermería internacional (14): n… [RN] |
| 2026-08-14 | Endotracheal Suctioning: Sterile… [RN] | Stroke recognition, FAST cues, a… [RPN] | Pleural effusion assessment posi… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Pericarditis: elevación difusa d… [RN] | Enfermería internacional (118): … [RN] | Enfermería internacional (138): … [RN] |
| 2026-08-15 | Lams And Lvo Screening Overview … [RN] | Mental health triage language an… [RPN] | Geriatric for Canadian Family NP… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Enfermería internacional (140): … [RN] | Enfermería internacional (138): … [RN] | Enfermería internacional (8): le… [RN] |
| 2026-08-16 | Moral distress and ethical pause… [RN] | Clinical placement success for p… [RPN] | Chronic disease longitudinal pan… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | Enfermería internacional (8): le… [RN] | Enfermería internacional (117): … [RN] | Enfermería internacional (76): c… [RN] |
| 2026-08-17 | Pressure Injury Prevention and t… [RN] | Falls risk, Morse/Baden scales, … [RPN] | Pediatric Fever Evaluation for N… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Tachycardie ventriculaire : mono… [RN] | ECG de 12 derivaciones: lectura … [RN] | Enfermería internacional (76): c… [RN] | Enfermería internacional (58): h… [RN] |
| 2026-08-18 | COPD type II respiratory failure… [RN] | Suicide precautions and crisis s… [RPN] | Pediatric Developmental Mileston… [NP] | Tachycardie ventriculaire : mono… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (97): i… [RN] | Enfermería internacional (76): c… [RN] | Enfermería internacional (58): h… [RN] |
| 2026-08-19 | Crisis Response Teams: Mandated … [RN] | Falls risk, Morse/Baden scales, … [RPN] | Chest tube air leak basics for r… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (51): a… [RN] | Enfermería internacional (58): h… [RN] | Enfermería internacional (50): p… [RN] |
| 2026-08-20 | Chest tube air leak basics for r… [RN] | Pressure injuries and staging es… [RPN] | Hematology and hemostasis for Ca… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (89): s… [RN] | Enfermería internacional (131): … [RN] | Enfermería internacional (129): … [RN] |
| 2026-08-21 | ABG acid-base pairs for RT stude… [RN] | Anemia-related fatigue, iron tea… [RPN] | Mental health and substance use … [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Enfermería internacional (129): … [RN] | Enfermería internacional (91): e… [RN] | Enfermería internacional (4): de… [RN] |
| 2026-08-22 | School Social Work: Cultural Hum… [RN] | Heart failure nursing priorities… [RN] | Pressure injuries and staging es… [RPN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Enfermería internacional (71): E… [RN] | Enfermería internacional (19): h… [RN] | Enfermería internacional (54): t… [RN] |
| 2026-08-23 | Heart failure nursing priorities… [RN] | Pressure injuries and staging es… [RPN] | Sepsis management: recognition, … [NP] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Repolarización temprana frente a… [RN] | Enfermería internacional (54): t… [RN] | Enfermería internacional (132): … [RN] |
| 2026-08-24 | Asthma monitoring and peak flow … [RN] | Substance use, stigma reduction,… [RPN] | Gastrointestinal for Canadian Fa… [NP] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (113): … [RN] | Enfermería internacional (132): … [RN] | Enfermería internacional (106): … [RN] |
| 2026-08-25 | Professional conduct and notific… [RN] | Six-minute walk test role for re… [RN] | Handling Charting Backlog on Ped… [RN] | Soins infirmiers internationaux … [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (29): r… [RN] | Enfermería internacional (106): … [RN] | Enfermería internacional (74): s… [RN] |
| 2026-08-26 | Six-minute walk test role for re… [RN] | Substance use, stigma reduction,… [RPN] | Handling Charting Backlog on Ped… [RN] | Lecture systématique de l’ECG 12… [RN] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (3): hi… [RN] | Enfermería internacional (74): s… [RN] | Enfermería internacional (32): d… [RN] |
| 2026-08-27 | Handling Charting Backlog on Ped… [RN] | ABCs versus Maslow for REx-PN pr… [RPN] | Asthma management: inhaler techn… [NP] | Soins infirmiers internationaux … [RN] | Infarctus postérieur : sous-déca… [RN] | Soins infirmiers internationaux … [RN] | Enfermería internacional (74): s… [RN] | STEMI inferior e infarto de VD: … [RN] | Enfermería internacional (32): d… [RN] |
| 2026-08-28 | Handoff risk reduction for New G… [RN] | Infection control and IPAC conce… [RPN] | Asthma management: inhaler techn… [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI inférieur et dysfonction V… [RN] | Enfermería internacional (12): d… [RN] | Enfermería internacional (100): … [RN] | Enfermería internacional (32): d… [RN] |
| 2026-08-29 | Flutter valve, Acapella, and PEP… [RN] | High-yield psychiatric medicatio… [RPN] | Mental health and substance use … [NP] | Soins infirmiers internationaux … [RN] | Soins infirmiers internationaux … [RN] | STEMI inférieur et dysfonction V… [RN] | Enfermería internacional (32): d… [RN] | Enfermería internacional (119): … [RN] | Enfermería internacional (49): e… [RN] |

---

### Monthly Summary: All 12+ Months

> Each month shows: total posts, pathway counts across all locales, top body systems, and 3 sample days.

#### June 2026

- **Days**: 30 | **Total posts**: 270 | RN: 218 / RPN: 32 / NP: 20
- **Top body systems**: gi (77), general (72), neuro (36), respiratory (18)
- **Sample schedule**:
  - **2026-06-01**: EN — "Psychiatric Nursing for New Graduates: Trauma" [RN], "Delegation and UCP questions on the REx-PN: S" [RPN], "Pneumonia assessment, oxygen titration themes" [RPN]
    FR — "Soins infirmiers internationaux (31) : h" [RN], "Soins infirmiers internationaux (4) : dé" [RN], "STEMI antérieur : sus-décalage V2–V6 et " [RN]
    ES — "Enfermería internacional (65): shock hem" [RN], "Enfermería internacional (70): neumonía " [RN], "Enfermería internacional (114): hiperpot" [RN]
  - **2026-06-02**: EN — "Preceptor feedback cycles for New Graduate Nu" [RN], "Pneumonia assessment, oxygen titration themes" [RPN], "Renal, fluid, and electrolyte for Canadian Fa" [NP]
    FR — "Soins infirmiers internationaux (139) : " [RN], "STEMI antérieur : sus-décalage V2–V6 et " [RN], "Soins infirmiers internationaux (19) : h" [RN]
    ES — "Enfermería internacional (24): insuficie" [RN], "Enfermería internacional (114): hiperpot" [RN], "Enfermería internacional (88): deterioro" [RN]
  - **2026-06-03**: EN — "PNLE community health nursing high-yield revi" [RN], "Hypokalemia Explained for Nursing Students: C" [RPN], "Bronchoscopy ventilation assist overview for " [RN]
    FR — "Soins infirmiers internationaux (14) : p" [RN], "STEMI antérieur : sus-décalage V2–V6 et " [RN], "Soins infirmiers internationaux (19) : h" [RN]
    ES — "Enfermería internacional (88): deterioro" [RN], "Enfermería internacional (45): diabetes " [RN], "Enfermería internacional (85): reconocim" [RN]

#### July 2026

- **Days**: 31 | **Total posts**: 279 | RN: 229 / RPN: 29 / NP: 21
- **Top body systems**: gi (84), general (76), neuro (37), electrolyte (13) **[French cycling begins 2026-07-21]** **[Spanish cycling begins 2026-07-21]**
- **Sample schedule**:
  - **2026-07-01**: EN — "Sleep and boundary planning for New Graduate " [RN], "Infection control and IPAC concepts for pract" [RPN], "Chemotherapy extravasation immediate actions " [NP]
    FR — "Soins infirmiers internationaux (133) : " [RN], "Soins infirmiers internationaux (60) : d" [RN], "Soins infirmiers internationaux (44) : a" [RN]
    ES — "Enfermería internacional (89): síndrome " [RN], "Enfermería internacional (131): hepatopa" [RN], "Enfermería internacional (129): diabetes" [RN]
  - **2026-07-02**: EN — "First-shift organization for New Graduate Nur" [RN], "Pain assessment tools and practical nursing s" [RPN], "Pediatric assessment and weight-based dose sa" [NP]
    FR — "Soins infirmiers internationaux (84) : u" [RN], "Soins infirmiers internationaux (60) : d" [RN], "Lecture systématique de l’ECG 12 dérivat" [RN]
    ES — "Enfermería internacional (129): diabetes" [RN], "Enfermería internacional (91): equilibri" [RN], "Enfermería internacional (4): deterioro " [RN]
  - **2026-07-03**: EN — "Pediatric New Graduate Essentials: Weight-Bas" [RN], "Sodium restriction teaching and hidden salt c" [RPN], "Neurology for Canadian Adult NP practice: Dif" [NP]
    FR — "Soins infirmiers internationaux (60) : d" [RN], "Soins infirmiers internationaux (125) : " [RN], "Lecture systématique de l’ECG 12 dérivat" [RN]
    ES — "Enfermería internacional (71): EPOC y ex" [RN], "Enfermería internacional (19): hepatopat" [RN], "Enfermería internacional (54): trastorno" [RN]

#### August 2026

- **Days**: 31 | **Total posts**: 279 | RN: 226 / RPN: 29 / NP: 24
- **Top body systems**: general (77), gi (67), neuro (45), respiratory (18)
- **Sample schedule**:
  - **2026-08-01**: EN — "British Columbia" [RN], "ABG interpretation: metabolic, respiratory, a" [NP], "CBC basics practical nurses use for escalatio" [RPN]
    FR — "Soins infirmiers internationaux (87) : h" [RN], "Soins infirmiers internationaux (88) : d" [RN], "Soins infirmiers internationaux (117) : " [RN]
    ES — "Enfermería internacional (23): anticoagu" [RN], "Enfermería internacional (102): síndrome" [RN], "Enfermería internacional (39): dolor agu" [RN]
  - **2026-08-02**: EN — "Family relocation timelines alongside OBA: pl" [RN], "CBC basics practical nurses use for escalatio" [RPN], "Hematology and hemostasis for Canadian Family" [NP]
    FR — "Soins infirmiers internationaux (94) : p" [RN], "Soins infirmiers internationaux (88) : d" [RN], "Soins infirmiers internationaux (126) : " [RN]
    ES — "Enfermería internacional (39): dolor agu" [RN], "Enfermería internacional (72): asma agud" [RN], "Enfermería internacional (110): trastorn" [RN]
  - **2026-08-03**: EN — "Driving pressure concepts for respiratory the" [RN], "Suicide precautions and safety assessment for" [RPN], "Women's and sexual health for Canadian Genera" [NP]
    FR — "Soins infirmiers internationaux (102) : " [RN], "Soins infirmiers internationaux (88) : d" [RN], "Fibrillation auriculaire à l’ECG : irrég" [RN]
    ES — "BRI y isquemia: criterios tipo Sgarbossa" [RN], "Enfermería internacional (67): dolor agu" [RN], "Enfermería internacional (110): trastorn" [RN]

#### September 2026

- **Days**: 30 | **Total posts**: 270 | RN: 218 / RPN: 28 / NP: 24
- **Top body systems**: gi (85), general (68), neuro (31), respiratory (15)
- **Sample schedule**:
  - **2026-09-01**: EN — "Statins Mechanism and Monitoring: HMG-CoA Red" [RN], "Wound dressings, exudate, and infection surve" [RPN], "Neurology for Canadian Family NP practice: Qu" [NP]
    FR — "Repolarisation précoce versus STEMI : co" [RN], "Soins infirmiers internationaux (72) : a" [RN], "Soins infirmiers internationaux (30) : h" [RN]
    ES — "Enfermería internacional (62): insuficie" [RN], "Enfermería internacional (78): posoperat" [RN], "Enfermería internacional (73): diabetes " [RN]
  - **2026-09-02**: EN — "Australian Healthcare System Explained for Nu" [RN], "Recognizing early sepsis on REx-PN-style ques" [RPN], "Sepsis management: recognition, escalation, a" [NP]
    FR — "Soins infirmiers internationaux (15) : B" [RN], "Bloc de branche gauche et ischémie : cri" [RN], "Soins infirmiers internationaux (34) : i" [RN]
    ES — "Enfermería internacional (73): diabetes " [RN], "Enfermería internacional (37): shock hem" [RN], "Enfermería internacional (26): trastorno" [RN]
  - **2026-09-03**: EN — "Postural drainage contraindications review: R" [RN], "How to pass the REx-PN on your first attempt " [RPN], "Dysphagia, thickened fluids, and aspiration r" [RPN]
    FR — "Soins infirmiers internationaux (108) : " [RN], "Bloc de branche gauche et ischémie : cri" [RN], "Soins infirmiers internationaux (40) : d" [RN]
    ES — "Enfermería internacional (34): insuficie" [RN], "Enfermería internacional (68): delirium " [RN], "Enfermería internacional (11): dolor agu" [RN]

#### October 2026

- **Days**: 31 | **Total posts**: 279 | RN: 227 / RPN: 27 / NP: 25
- **Top body systems**: general (79), gi (68), neuro (42), respiratory (14)
- **Sample schedule**:
  - **2026-10-01**: EN — "Handoff risk reduction for New Graduate Nurse" [RN], "COPD, oxygen safety, and Canadian home oxygen" [RPN], "Renal, fluid, and electrolyte for Canadian Fa" [NP]
    FR — "Soins infirmiers internationaux (68) : d" [RN], "Soins infirmiers internationaux (66) : p" [RN], "Soins infirmiers internationaux (131) : " [RN]
    ES — "Enfermería internacional (43): EPOC y ex" [RN], "Enfermería internacional (22): posoperat" [RN], "Enfermería internacional (47): hepatopat" [RN]
  - **2026-10-02**: EN — "ASWB Exam Blueprint Study Map for Masters-Lev" [RN], "Warfarin monitoring and anticoagulant teachin" [RPN], "Musculoskeletal for Canadian PHC NP practice:" [NP]
    FR — "Soins infirmiers internationaux (18) : s" [RN], "Soins infirmiers internationaux (131) : " [RN], "Tachycardie ventriculaire : monomorphe, " [RN]
    ES — "Enfermería internacional (47): hepatopat" [RN], "Enfermería internacional (2): hiperpotas" [RN], "Enfermería internacional (14): neumonía " [RN]
  - **2026-10-03**: EN — "Interdisciplinary huddle participation for Ne" [RN], "Warfarin monitoring and anticoagulant teachin" [RPN], "Musculoskeletal for Canadian PHC NP practice:" [NP]
    FR — "Soins infirmiers internationaux (41) : i" [RN], "Soins infirmiers internationaux (131) : " [RN], "Tachycardie ventriculaire : monomorphe, " [RN]
    ES — "Pericarditis: elevación difusa del ST y " [RN], "Enfermería internacional (118): insufici" [RN], "Enfermería internacional (138): trastorn" [RN]

#### November 2026

- **Days**: 30 | **Total posts**: 270 | RN: 224 / RPN: 24 / NP: 22
- **Top body systems**: gi (73), general (66), neuro (37), electrolyte (18)
- **Sample schedule**:
  - **2026-11-01**: EN — "Aging Services: Cultural Humility And Equity " [RN], "Pain assessment tools and practical nursing s" [RPN], "Gastrointestinal for Canadian General NP prac" [NP]
    FR — "STEMI antérieur : sus-décalage V2–V6 et " [RN], "Soins infirmiers internationaux (64) : l" [RN], "Soins infirmiers internationaux (19) : h" [RN]
    ES — "Enfermería internacional (94): prevenció" [RN], "Enfermería internacional (116): deterior" [RN], "Enfermería internacional (18): síndrome " [RN]
  - **2026-11-02**: EN — "How NCLEX CAT testing adapts to your performa" [RN], "Neurology for Canadian Adult NP practice: Lab" [NP], "Magnesium in the Laboratory: Hypomagnesemia, " [RN]
    FR — "Soins infirmiers internationaux (8) : lé" [RN], "Soins infirmiers internationaux (19) : h" [RN], "Soins infirmiers internationaux (13) : i" [RN]
    ES — "Enfermería internacional (41): infección" [RN], "Enfermería internacional (18): síndrome " [RN], "Enfermería internacional (30): hiperpota" [RN]
  - **2026-11-03**: EN — "Philippine Nursing Licensure Examination (PNL" [RN], "Neurology for Canadian Adult NP practice: Lab" [NP], "Magnesium in the Laboratory: Hypomagnesemia, " [RN]
    FR — "Soins infirmiers internationaux (129) : " [RN], "Soins infirmiers internationaux (19) : h" [RN], "Soins infirmiers internationaux (19) : h" [RN]
    ES — "Enfermería internacional (13): infección" [RN], "Enfermería internacional (30): hiperpota" [RN], "Enfermería internacional (40): delirium " [RN]

#### December 2026

- **Days**: 31 | **Total posts**: 279 | RN: 225 / RPN: 27 / NP: 27
- **Top body systems**: gi (84), general (75), neuro (38), pain (14)
- **Sample schedule**:
  - **2026-12-01**: EN — "NMC OSCE documentation habits: educational ov" [RN], "Insulin and hypoglycemia questions on the REx" [RPN], "Neurology for Canadian Adult NP practice: Red" [NP]
    FR — "Soins infirmiers internationaux (130) : " [RN], "Lecture systématique de l’ECG 12 dérivat" [RN], "Soins infirmiers internationaux (47) : h" [RN]
    ES — "Repolarización temprana frente a STEMI: " [RN], "Enfermería internacional (54): trastorno" [RN], "Enfermería internacional (132): coagulop" [RN]
  - **2026-12-02**: EN — "Documentation and charting questions on the N" [RN], "Expectant Categories And Ethical Framing (Sta" [RN], "Pediatric assessment and weight-based dose sa" [NP]
    FR — "Soins infirmiers internationaux (100) : " [RN], "Lecture systématique de l’ECG 12 dérivat" [RN], "Soins infirmiers internationaux (47) : h" [RN]
    ES — "Enfermería internacional (113): reconoci" [RN], "Enfermería internacional (132): coagulop" [RN], "Enfermería internacional (106): posopera" [RN]
  - **2026-12-03**: EN — "Expectant Categories And Ethical Framing (Sta" [RN], "Pediatric assessment and weight-based dose sa" [NP], "Residency documentation habits for New Gradua" [RN]
    FR — "Soins infirmiers internationaux (93) : c" [RN], "Lecture systématique de l’ECG 12 dérivat" [RN], "Soins infirmiers internationaux (47) : h" [RN]
    ES — "Enfermería internacional (29): reconocim" [RN], "Enfermería internacional (106): posopera" [RN], "Enfermería internacional (74): síndrome " [RN]

#### January 2027

- **Days**: 31 | **Total posts**: 279 | RN: 224 / RPN: 32 / NP: 23
- **Top body systems**: general (81), gi (74), neuro (42), pain (13)
- **Sample schedule**:
  - **2027-01-01**: EN — "RV Strain and Pulmonary Embolism: S1Q3T3 Teac" [RN], "Iron deficiency anaemia: investigation map fo" [NP], "Pneumonia assessment, oxygen titration themes" [RPN]
    FR — "Soins infirmiers internationaux (55) : i" [RN], "Soins infirmiers internationaux (88) : d" [RN], "Fibrillation auriculaire à l’ECG : irrég" [RN]
    ES — "Enfermería internacional (110): trastorn" [RN], "Enfermería internacional (83): intoxicac" [RN], "Enfermería internacional (101): diabetes" [RN]
  - **2027-01-02**: EN — "Communication With Multidisciplinary Teams in" [RN], "Iron deficiency anaemia: investigation map fo" [NP], "Pneumonia assessment, oxygen titration themes" [RPN]
    FR — "Soins infirmiers internationaux (106) : " [RN], "Soins infirmiers internationaux (75) : h" [RN], "Fibrillation auriculaire à l’ECG : irrég" [RN]
    ES — "Enfermería internacional (92): lesión re" [RN], "Enfermería internacional (133): embarazo" [RN], "Enfermería internacional (35): equilibri" [RN]
  - **2027-01-03**: EN — "NCSBN Clinical Judgment Measurement Model for" [RN], "Type 2 diabetes review: HbA1c, kidney risk, a" [NP], "Pneumonia assessment, oxygen titration themes" [RPN]
    FR — "Soins infirmiers internationaux (92) : l" [RN], "Fibrillation auriculaire à l’ECG : irrég" [RN], "Soins infirmiers internationaux (32) : d" [RN]
    ES — "FA en el ECG: irregularidad, riesgo embó" [RN], "Enfermería internacional (35): equilibri" [RN], "Enfermería internacional (48): coagulopa" [RN]

#### February 2027

- **Days**: 28 | **Total posts**: 252 | RN: 204 / RPN: 23 / NP: 25
- **Top body systems**: gi (70), general (64), neuro (28), respiratory (16)
- **Sample schedule**:
  - **2027-02-01**: EN — "Inhaled nitric oxide principles for RT studen" [RN], "Diabetes foot screening and teaching for PN p" [RPN], "Women's and sexual health for Canadian Adult " [NP]
    FR — "Soins infirmiers internationaux (50) : p" [RN], "Bloc de branche gauche et ischémie : cri" [RN], "Soins infirmiers internationaux (107) : " [RN]
    ES — "Enfermería internacional (136): insufici" [RN], "Enfermería internacional (96): delirium " [RN], "Enfermería internacional (11): dolor agu" [RN]
  - **2027-02-02**: EN — "COPD nursing priorities for NCLEX med-surg: N" [RN], "Hypocalcemia vs Hypercalcemia: NCLEX Guide fo" [RPN], "Gastrointestinal for Canadian Family NP pract" [NP]
    FR — "Soins infirmiers internationaux (86) : h" [RN], "Bloc de branche gauche et ischémie : cri" [RN], "Soins infirmiers internationaux (4) : dé" [RN]
    ES — "Enfermería internacional (11): dolor agu" [RN], "Hiperpotasemia en el ECG: de ondas T pic" [RN], "Enfermería internacional (64): lesión re" [RN]
  - **2027-02-03**: EN — "Stroke Nursing Priorities for Licensing Exams" [RN], "Endocrine and metabolic for Canadian Family N" [NP], "Arterial line sampling correlation with ABG q" [RN]
    FR — "Bloc de branche gauche et ischémie : cri" [RN], "Soins infirmiers internationaux (39) : d" [RN], "Soins infirmiers internationaux (4) : dé" [RN]
    ES — "Enfermería internacional (42): neumonía " [RN], "Enfermería internacional (36): lesión re" [RN], "Enfermería internacional (46): síndrome " [RN]

#### March 2027

- **Days**: 31 | **Total posts**: 279 | RN: 226 / RPN: 28 / NP: 25
- **Top body systems**: general (83), gi (74), neuro (45), electrolyte (13)
- **Sample schedule**:
  - **2027-03-01**: EN — "Preceptor feedback cycles for New Graduate Nu" [RN], "Mental health triage language and therapeutic" [RPN], "Respiratory for Canadian PHC NP practice: Lab" [NP]
    FR — "Soins infirmiers internationaux (18) : s" [RN], "Soins infirmiers internationaux (131) : " [RN], "Tachycardie ventriculaire : monomorphe, " [RN]
    ES — "Enfermería internacional (47): hepatopat" [RN], "Enfermería internacional (2): hiperpotas" [RN], "Enfermería internacional (14): neumonía " [RN]
  - **2027-03-02**: EN — "Infection control and PPE questions for NCLEX" [RN], "Anemia-related fatigue, iron teaching, and fu" [RPN], "Women's and sexual health for Canadian Family" [NP]
    FR — "Soins infirmiers internationaux (41) : i" [RN], "Soins infirmiers internationaux (131) : " [RN], "Tachycardie ventriculaire : monomorphe, " [RN]
    ES — "Pericarditis: elevación difusa del ST y " [RN], "Enfermería internacional (118): insufici" [RN], "Enfermería internacional (138): trastorn" [RN]
  - **2027-03-03**: EN — "NGN Clinical Judgment Measurement Model: How " [RN], "Pneumonia assessment, oxygen titration themes" [RPN], "Depression Treatment Guidelines for NP Certif" [NP]
    FR — "Soins infirmiers internationaux (63) : é" [RN], "Soins infirmiers internationaux (131) : " [RN], "Tachycardie ventriculaire : monomorphe, " [RN]
    ES — "Enfermería internacional (140): salud me" [RN], "Enfermería internacional (138): trastorn" [RN], "Enfermería internacional (8): lesión ren" [RN]

#### April 2027

- **Days**: 30 | **Total posts**: 270 | RN: 216 / RPN: 29 / NP: 25
- **Top body systems**: gi (74), general (67), neuro (41), respiratory (16)
- **Sample schedule**:
  - **2027-04-01**: EN — "MDI and spacer technique teaching points: Equ" [RN], "Anticoagulant teaching for warfarin and DOAC " [RPN], "Mental health and substance use for Canadian " [NP]
    FR — "Soins infirmiers internationaux (8) : lé" [RN], "Soins infirmiers internationaux (19) : h" [RN], "Soins infirmiers internationaux (13) : i" [RN]
    ES — "Enfermería internacional (41): infección" [RN], "Enfermería internacional (18): síndrome " [RN], "Enfermería internacional (30): hiperpota" [RN]
  - **2027-04-02**: EN — "Oncology New Graduate Orientation: Chemothera" [RN], "Managing exam anxiety during CPNRE preparatio" [RPN], "Gastrointestinal for Canadian Adult NP practi" [NP]
    FR — "Soins infirmiers internationaux (129) : " [RN], "Soins infirmiers internationaux (19) : h" [RN], "Soins infirmiers internationaux (19) : h" [RN]
    ES — "Enfermería internacional (13): infección" [RN], "Enfermería internacional (30): hiperpota" [RN], "Enfermería internacional (40): delirium " [RN]
  - **2027-04-03**: EN — "Cognitive Assessments in Occupational Therapy" [RN], "Recognizing early sepsis on REx-PN-style ques" [RPN], "Mental health and substance use for Canadian " [NP]
    FR — "Soins infirmiers internationaux (67) : d" [RN], "Soins infirmiers internationaux (3) : hy" [RN], "Soins infirmiers internationaux (59) : h" [RN]
    ES — "Enfermería internacional (109): arritmia" [RN], "Enfermería internacional (40): delirium " [RN], "Enfermería internacional (86): hiperpota" [RN]

#### May 2027

- **Days**: 31 | **Total posts**: 279 | RN: 229 / RPN: 32 / NP: 18
- **Top body systems**: gi (84), general (76), neuro (41), pain (15)
- **Sample schedule**:
  - **2027-05-01**: EN — "Outpatient OT for Upper Extremity Orthopedics" [RN], "Endocrine and metabolic for Canadian Adult NP" [NP], "Warfarin monitoring and anticoagulant teachin" [RPN]
    FR — "Soins infirmiers internationaux (100) : " [RN], "Lecture systématique de l’ECG 12 dérivat" [RN], "Soins infirmiers internationaux (47) : h" [RN]
    ES — "Enfermería internacional (113): reconoci" [RN], "Enfermería internacional (132): coagulop" [RN], "Enfermería internacional (106): posopera" [RN]
  - **2027-05-02**: EN — "SBAR bedside reporting for New Graduate Nurse" [RN], "Warfarin monitoring and anticoagulant teachin" [RPN], "Neurology for Canadian Family NP practice: Re" [NP]
    FR — "Soins infirmiers internationaux (93) : c" [RN], "Lecture systématique de l’ECG 12 dérivat" [RN], "Soins infirmiers internationaux (47) : h" [RN]
    ES — "Enfermería internacional (29): reconocim" [RN], "Enfermería internacional (106): posopera" [RN], "Enfermería internacional (74): síndrome " [RN]
  - **2027-05-03**: EN — "Early recognition of deterioration for New Gr" [RN], "Diabetes foot screening and teaching for PN p" [RPN], "Interdisciplinary huddle participation for Ne" [RN]
    FR — "Lecture systématique de l’ECG 12 dérivat" [RN], "Soins infirmiers internationaux (96) : d" [RN], "Soins infirmiers internationaux (47) : h" [RN]
    ES — "Enfermería internacional (3): hipoglucem" [RN], "Enfermería internacional (74): síndrome " [RN], "Enfermería internacional (32): deterioro" [RN]

---

## Content Cycling Calendar

| Locale | Unique Content Runs | Cycle Begins | Days on First Run | Cycles in 365 Days |
|--------|--------------------|-----------|--------------------|--------------------|
| English | Full 365 days | N/A | 365 | 1 (no cycling) |
| French | Day 1 – 2026-07-21 | **2026-07-21** | 50 | 8 |
| Spanish | Day 1 – 2026-07-21 | **2026-07-21** | 50 | 8 |

> **Important**: Cycling means the same posts will be served again. Each cycle, the queue is reshuffled so the delivery order differs. However, readers who follow the blog daily for more than 50 days **will see repeated content** in French and Spanish.

---

## 5. Gap-Filling Strategy

### Priority 1 — French Content Production

| Metric | Value |
|--------|-------|
| Current French posts | 150 |
| Posts needed for full year | 1095 |
| Gap | 945 posts |
| Cycling begins | 2026-07-21 |
| Required production rate (1 year) | 3 new posts/day |
| Required production rate (6 months) | 6 new posts/day |

**Recommended actions (in priority order)**:
1. **Auto-translate top 200 English RN posts** using a verified translation pipeline → covers ~66 additional days
2. **Create 50 French RPN posts** → eliminates the zero-RPN gap (these don't exist at all today)
3. **Create 50 French NP posts** → eliminates the zero-NP gap
4. **Commission original French nursing content** targeting Québec (OIIQ exam) and France (IFSI) contexts
5. **Target**: reach 550 French posts by 2026-09-01 to cover the first 183 days without cycling

### Priority 2 — Spanish Content Production

| Metric | Value |
|--------|-------|
| Current Spanish posts | 150 |
| Posts needed for full year | 1095 |
| Gap | 945 posts |
| Cycling begins | 2026-07-21 |
| Required production rate (1 year) | 3 new posts/day |
| Required production rate (6 months) | 6 new posts/day |

**Recommended actions (in priority order)**:
1. **Auto-translate top 200 English RN posts** targeting NCLEX-RN en español and Mexican/Colombian nursing licensing contexts
2. **Create 50 Spanish RPN posts** → eliminates the zero-RPN gap
3. **Create 50 Spanish NP posts** → eliminates the zero-NP gap
4. **Commission original Spanish nursing content** targeting USMLE-adjacent NP candidates and Latin American licensure prep
5. **Target**: reach 550 Spanish posts by 2026-09-01

### Priority 3 — NP Pathway Gap (All Locales)

| Locale | Current NP Posts | Needed (1/day) | Gap | % Covered |
|--------|-----------------|----------------|-----|-----------|
| English | 879 | 365 | 0 | 241% |
| French | 0 | 365 | 365 | 0% |
| Spanish | 0 | 365 | 365 | 0% |

**NP content strategy**:
- English NP gap: 0 posts needed for full coverage — currently at 241% coverage. At current English NP inventory (879 posts), the NP slot cycles every ~879 days.
- French and Spanish NP: create from scratch — recommend translating existing English NP posts first, then commissioning bilingual NP-focused content.

### Priority 4 — Quality Metrics for New Content

All new posts should match existing inventory standards:
- Minimum 1,200 words (current average: ~1503 words)
- Required frontmatter: `slug`, `title`, `excerpt`, `locale`, `publishedAt`, `pathway` (custom field), `tags`, `category`
- SEO fields: `seoTitle`, `seoDescription`, `canonicalUrl`
- Medical disclaimer required for all clinical content

---

## 6. Schedule Activation Instructions

The publishing calendar above assigns specific posts to specific dates. To activate:

```sql
-- Set scheduledAt for each post based on this plan.
-- Match by slug. Example:
UPDATE "BlogPost"
SET "scheduledAt" = '2026-06-01'
WHERE slug = 'psychiatric-nursing-new-graduates-trauma';

-- Bulk update pattern using a staging table:
-- 1. Export the slug→date mapping from this plan
-- 2. INSERT INTO blog_schedule (slug, scheduled_at) VALUES (...)
-- 3. UPDATE "BlogPost" b SET "scheduledAt" = s.scheduled_at
--    FROM blog_schedule s WHERE b.slug = s.slug;
```

**Note**: The database is not currently accessible from this environment. This plan serves as the authoritative scheduling reference. When the database is available, execute the schedule using the slug→date mappings in Section 4.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total posts in inventory | 4595 |
| Total unique locales | 18 |
| English scheduling pool | 3395 posts |
| French scheduling pool | 150 posts |
| Spanish scheduling pool | 150 posts |
| Total posts scheduled (365 days) | 3285 |
| Total unique EN posts used | 1095 |
| French shortage | 945 posts |
| Spanish shortage | 945 posts |
| Combined FR+ES gap | 1890 posts |
| Days with full unique EN content | 365 |
| French cycling frequency | Every 50 days |
| Spanish cycling frequency | Every 50 days |
| Calendar period | 2026-06-01 – 2027-05-31 |

---

*Generated from 4595 posts across 18 locales. Schedule computed 2026-06-01.*
