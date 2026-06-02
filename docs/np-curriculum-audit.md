# NP Curriculum Audit & Expansion Roadmap

**Date:** March 16, 2026
**Platform:** NurseNest NP Tier
**Scope:** Full content inventory, gap analysis against AANP/ANCC FNP blueprints, and prioritized build roadmap

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Existing NP Content Inventory](#2-existing-np-content-inventory)
3. [Duplicate Detection Report](#3-duplicate-detection-report)
4. [Gap Analysis vs AANP & ANCC Blueprints](#4-gap-analysis-vs-aanp--ancc-blueprints)
5. [System-by-System Gap List](#5-system-by-system-gap-list)
6. [Question Bank & Flashcard Coverage Gaps](#6-question-bank--flashcard-coverage-gaps)
7. [SEO & Sitemap Gaps](#7-seo--sitemap-gaps)
8. [Prioritized Build Roadmap](#8-prioritized-build-roadmap)

---

## 1. Executive Summary

The NurseNest NP tier currently contains:

| Metric | Count |
|--------|-------|
| Body system sections in `npSystems` | 83 |
| Unique registered lesson IDs | 1,141 |
| Lesson content entries (across all data files) | 1,225 |
| Content entries not registered in menus | 140 |
| Exam quiz questions (embedded in lessons) | ~1,636 |
| Standalone question bank entries | 35 (4 test bank modules) |
| NP flashcard files | 8 |
| Flashcard questions total | ~993 |
| NP SEO condition pages | 0 |
| NP sitemap entries | 6 (hub pages only) |
| Near-duplicate topic pairs | 32 groups |

**Key findings:**
- Strong clinical coverage in Cardiovascular (41 lessons), Endocrine (36), GI (26), Women's Health (25), and Rheumatology (25).
- Under-represented systems: Musculoskeletal (7), Men's Health (7), Procedures (8), Pain Management (8), HEENT (9).
- Zero NP-specific SEO condition pages or metadata entries — major indexing gap.
- 32 near-duplicate groups where the same topic appears in both a clinical system and a core physiology section with `-np-np` suffix.
- 140 content entries exist in data files but are not registered in the `npSystems` menu array.
- Flashcard coverage is concentrated; many clinical systems lack dedicated flashcard decks.

---

## 2. Existing NP Content Inventory

### 2.1 Systems Overview

| # | System | Section ID | Lesson Count |
|---|--------|-----------|-------------|
| 1 | Cardiovascular | `cardiovascular-np` | 41 |
| 2 | Respiratory | `respiratory-np` | 19 |
| 3 | Neurological | `neurological-np` | 23 |
| 4 | Endocrine & Metabolic | `endocrine-np` | 36 |
| 5 | Renal & Nephrology | `renal-np` | 20 |
| 6 | Hematology & Oncology | `hematology-np` | 16 |
| 7 | Maternity & Obstetrics | `maternity-np` | 17 |
| 8 | Neonatal | `neonatal-np` | 10 |
| 9 | Immune System | `immune-np` | 12 |
| 10 | Pharmacology | `pharmacology-np` | 11 |
| 11 | Procedures | `procedures-np` | 8 |
| 12 | Musculoskeletal | `musculoskeletal-np` | 7 |
| 13 | GI & Hepatology | `gi-hepatology-np` | 26 |
| 14 | Dermatology | `dermatology-np` | 12 |
| 15 | HEENT & ENT | `heent-np` | 9 |
| 16 | Psychiatry & Mental Health | `psychiatry-np` | 21 |
| 17 | Women's Health & Gynecology | `womens-health-np` | 25 |
| 18 | Men's Health | `mens-health-np` | 7 |
| 19 | Family Medicine Primary Care | `family-medicine-np` | 20 |
| 20 | Palliative & Ethics | `palliative-ethics-np` | 9 |
| 21 | Infectious Disease | `infectious-disease-np` | 23 |
| 22 | Trauma & Emergency | `trauma-emergency-np` | 19 |
| 23 | Geriatric Medicine | `geriatric-medicine-np` | 10 |
| 24 | Pain Management | `pain-management-np` | 8 |
| 25 | Assessment Skills | `assessment-np` | 51 |
| 26 | Rheumatology | `rheumatology-np` | 25 |
| 27 | Toxicology | `toxicology-np` | 18 |
| 28 | Rare & Genetic Disorders | `rare-genetic-disorders-np` | 18 |
| 29 | Critical Care Advanced | `critical-care-advanced-np` | 17 |

### 2.2 Supplementary Sections (Pathophysiology, Diagnostics, Prescribing, Core Physiology)

| # | System | Section ID | Lesson Count |
|---|--------|-----------|-------------|
| 30 | Core Advanced Pathophysiology | `advanced-pathophysiology-foundations-np` | 25 |
| 31 | Cardiovascular Pathophysiology | `cardiovascular-pathophysiology-np` | 6 |
| 32 | Respiratory Pathophysiology | `respiratory-pathophysiology-np` | 5 |
| 33 | Neurological Pathophysiology | `neurological-pathophysiology-np` | 4 |
| 34 | Endocrine Pathophysiology | `endocrine-pathophysiology-np` | 5 |
| 35 | Renal Pathophysiology | `renal-pathophysiology-np` | 3 |
| 36 | GI / Hepatic Pathophysiology | `gi-hepatic-pathophysiology-np` | 4 |
| 37 | Hematology Pathophysiology | `hematology-pathophysiology-np` | 3 |
| 38 | Infectious Pathophysiology | `infectious-pathophysiology-np` | 2 |
| 39 | Pediatric Pathophysiology | `pediatric-pathophysiology-np` | 2 |
| 40 | Women's Health Pathophysiology | `womens-health-pathophysiology-np` | 2 |
| 41 | Psychiatric Pathophysiology | `psychiatric-pathophysiology-np` | 2 |
| 42 | Cross-System High-Yield Concepts | `cross-system-concepts-np` | 7 |
| 43 | Diagnostic Reasoning & Criteria | `diagnostic-reasoning-np` | 4 |
| 44 | Cardiovascular Diagnostic Criteria | `cardiovascular-diagnostic-criteria-np` | 5 |
| 45 | Respiratory Diagnostic Criteria | `respiratory-diagnostic-criteria-np` | 4 |
| 46 | Neurological Diagnostic Criteria | `neuro-diagnostic-criteria-np` | 4 |
| 47 | Endocrine Diagnostic Criteria | `endocrine-diagnostic-criteria-np` | 5 |
| 48 | Renal Diagnostic Criteria | `renal-diagnostic-criteria-np` | 2 |
| 49 | GI Diagnostic Criteria | `gi-diagnostic-criteria-np` | 4 |
| 50 | Hematology Diagnostic Criteria | `hematology-diagnostic-criteria-np` | 3 |
| 51 | Infectious Disease Diagnostic Criteria | `infectious-diagnostic-criteria-np` | 3 |
| 52 | Pediatric Diagnostic Criteria | `pediatric-diagnostic-criteria-np` | 2 |
| 53 | Women's Health Diagnostic Criteria | `womens-health-diagnostic-criteria-np` | 3 |
| 54 | Psychiatric Diagnostic Criteria | `psychiatric-diagnostic-criteria-np` | 3 |
| 55 | High-Yield NP Exam Patterns | `high-yield-exam-patterns-np` | 7 |
| 56 | Core Prescribing Foundations | `prescribing-foundations-np` | 24 |
| 57 | Cardiovascular Prescribing | `cardiovascular-prescribing-np` | 15 |
| 58 | Respiratory Prescribing | `respiratory-prescribing-np` | 7 |
| 59 | Psychiatric Prescribing | `psychiatric-prescribing-np` | 12 |
| 60 | Endocrine Prescribing | `endocrine-prescribing-np` | 7 |
| 61 | Renal / Electrolyte Prescribing | `renal-electrolyte-prescribing-np` | 3 |
| 62 | GI Prescribing | `gi-prescribing-np` | 4 |
| 63 | Women's Health Prescribing | `womens-health-prescribing-np` | 5 |
| 64 | Pediatric Prescribing | `pediatric-prescribing-np` | 3 |
| 65 | Geriatric Prescribing | `geriatric-prescribing-np` | 3 |
| 66 | Infectious Disease Prescribing | `infectious-disease-prescribing-np` | 6 |
| 67 | Legal & Ethical Prescribing | `legal-ethical-prescribing-np` | 6 |
| 68 | Cardiovascular Core Physiology & Assessment | `cv-core-physiology-np` | 48 |
| 69 | Respiratory Core Physiology & Assessment | `resp-core-physiology-np` | 59 |
| 70 | Neurological Core Physiology & Assessment | `neuro-core-physiology-np` | 25 |
| 71 | Hematology Core Concepts | `heme-core-np` | 15 |
| 72 | Infectious Disease: Primary Care Scope | `infectious-disease-core-np` | 18 |
| 73 | Endocrine Core Physiology & Conditions | `endocrine-core-np` | 29 |
| 74 | Renal / GU Core Physiology & Conditions | `renal-gu-core-np` | 16 |
| 75 | GI / Hepatic Core Physiology & Conditions | `gi-hepatic-core-np` | 18 |
| 76 | Dermatology Core Assessment & Conditions | `derm-core-np` | 13 |
| 77 | Pediatrics Core Concepts & Conditions | `pediatrics-core-np` | 26 |
| 78 | Women's Health Core Concepts | `womens-health-core-np` | 21 |
| 79 | Geriatrics Core Concepts | `geriatrics-core-np` | 6 |
| 80 | Psychiatric Core Diagnoses & Pharmacology | `psych-core-np` | 10 |
| 81 | Professional Practice & Guidelines | `professional-practice-np` | 59 |
| 82 | NP Exam Strategy | `exam-strategy-np` | 8 |
| 83 | Rare & High-Risk: Don't Miss Diseases | `rare-high-risk-np` | 18 |

### 2.3 Content Data Files Summary

| File | Lesson Entries |
|------|---------------|
| `np-generated-batch-1.ts` | 200 |
| `np-generated-batch-2.ts` | 200 |
| `np-generated-batch-3.ts` | 200 |
| `np-generated-batch-4.ts` | 199 |
| `np-generated-batch-5.ts` | 201 |
| `np-generated-batch-6.ts` | 60 |
| `np-generated-batch-7.ts` | 9 |
| `np-clinical-units.ts` | 64 |
| `respiratory-missing-np.ts` | 44 |
| `np-cv-content.ts` | 38 |
| `np-endo-content.ts` | 34 |
| `np-rheumatology-content.ts` | 25 |
| `advanced-np.ts` | 24 |
| `np-neuro-content.ts` | 22 |
| `reproductive-np.ts` | 21 |
| `np-clinical-batch-4.ts` | 20 |
| `np-clinical-batch-6.ts` | 19 |
| `np-resp-content.ts` | 18 |
| `np-toxicology-content.ts` | 18 |
| `np-rare-genetic-content.ts` | 18 |
| `np-assessment-content-a.ts` | 17 |
| `np-assessment-content-b.ts` | 17 |
| `np-assessment-content-c.ts` | 17 |
| `np-critical-care-content.ts` | 15 |
| `np-expanded-content.ts` | 14 |
| `np-clinical-batch-7.ts` | 12 |
| `np-free-batch-3.ts` | 11 |
| `np-clinical-batch-5.ts` | 10 |
| `np-free-batch-2.ts` | 10 |
| `np-free-batch-1.ts` | 9 |
| `np-clinical-batch-8.ts` | 7 |
| `np-clinical-batch-9.ts` | 6 |
| `uploaded-clinical-np.ts` | 5 |
| `np-patho-expansion.ts` | 4 |
| `extra-questions-np.ts` | 4 |
| `pharmacology-np-prescribing.ts` | 3 |
| **Total** | **1,595** |

Note: 140 content entries exist in data files but are not registered in the `npSystems` menu array. These are orphaned lessons that should be reviewed and either registered or removed.

---

## 3. Duplicate Detection Report

### 3.1 Exact Duplicate IDs

**Result: 0 exact duplicate lesson IDs found.** All 1,141 registered IDs are unique.

### 3.2 Near-Duplicate Groups (32 groups identified)

These are lessons registered in multiple system sections that normalize to the same base topic (e.g., `xxx-np` in one section and `xxx-np-np` in another). Most involve a clinical lesson in a primary system duplicated with a `-np-np` suffix in a "Core Physiology & Assessment" or "Professional Practice" section.

| # | Base Topic | Primary Entry (System) | Duplicate Entry (System) |
|---|-----------|----------------------|------------------------|
| 1 | AFib Management | `afib-management-np` (Cardiovascular) | `afib-management-np-np` (CV Core Physiology) |
| 2 | Hypertensive Emergency | `hypertensive-emergency-np` (Cardiovascular) | `hypertensive-emergency-np-np` (CV Core Physiology) |
| 3 | ACS Management | `acs-management-np` (Cardiovascular) | `acs-management-np-np` (CV Core Physiology) |
| 4 | Cardiac Arrest ACLS | `cardiac-arrest-acls-np` (Cardiovascular) | `cardiac-arrest-acls-np-np` (CV Core Physiology) |
| 5 | HFpEF | `hfpef-np` (Cardiovascular) | `hfpef-np-np` (CV Core Physiology) |
| 6 | Valvular Disease | `valvular-disease-np` (Cardiovascular) | `valvular-disease-np-np` (Professional Practice) |
| 7 | PVD Advanced | `pvd-advanced-np` (Cardiovascular) | `pvd-advanced-np-np` (Professional Practice) |
| 8 | VTE Prophylaxis | `vte-prophylaxis-np` (Cardiovascular) | `vte-prophylaxis-np-np` (Professional Practice) |
| 9 | Brugada Syndrome | `brugada-syndrome-np` (Cardiovascular) | `brugada-syndrome-np-np` (CV Core Physiology) |
| 10 | Long QT Syndrome | `long-qt-syndrome-np` (Cardiovascular) | `long-qt-syndrome-np-np` (Professional Practice) |
| 11 | Takotsubo Cardiomyopathy | `takotsubo-cardiomyopathy-np` (Cardiovascular) | `takotsubo-cardiomyopathy-np-np` (Professional Practice) |
| 12 | Infective Endocarditis | `infective-endocarditis-advanced-np` (Cardiovascular) | `infective-endocarditis-advanced-np-np` (ID Core) |
| 13 | Marfan Cardiac | `marfan-cardiac-np` (Cardiovascular) | `marfan-cardiac-np-np` (CV Core Physiology) |
| 14 | Constrictive Pericarditis | `constrictive-pericarditis-np` (Cardiovascular) | `constrictive-pericarditis-np-np` (CV Core Physiology) |
| 15 | Heart Transplant Rejection | `heart-transplant-rejection-np` (Cardiovascular) | `heart-transplant-rejection-np-np` (CV Core Physiology) |
| 16 | Pulmonary Hypertension | `pulmonary-hypertension-np` (Respiratory) | `pulmonary-hypertension-np-np` (CV Core Physiology) |
| 17 | Bronchiectasis | `bronchiectasis-management-np` (Respiratory) | `bronchiectasis-management-np-np` (Resp Core Physiology) |
| 18 | Interstitial Lung Disease | `interstitial-lung-disease-np` (Respiratory) | `interstitial-lung-disease-np-np` (Resp Core Physiology) |
| 19 | Occupational Lung Disease | `occupational-lung-disease-np` (Respiratory) | `occupational-lung-disease-np-np` (Resp Core Physiology) |
| 20 | VAP | `ventilator-associated-pneumonia-np` (Respiratory) | `ventilator-associated-pneumonia-np-np` (Resp Core Physiology) |
| 21 | Tracheobronchial Injury | `tracheobronchial-injury-np` (Respiratory) | `tracheobronchial-injury-np-np` (Resp Core Physiology) |
| 22 | Hemothorax | `hemothorax-management-np` (Respiratory) | `hemothorax-management-np-np` (Resp Core Physiology) |
| 23 | CVST | `cerebral-venous-sinus-thrombosis-np` (Neurological) | `cerebral-venous-sinus-thrombosis-np-np` (Neuro Core) |
| 24 | Portal Hypertension | `portal-hypertension-np` (GI & Hepatology) | `portal-hypertension-np-np` (CV Core Physiology) |
| 25 | TB Management | `tb-management-advanced-np` (Infectious Disease) | `tb-management-advanced-np-np` (ID Core) |
| 26 | Cardiac Auscultation | `advanced-cardiac-auscultation-np` (Assessment) | `advanced-cardiac-auscultation-np-np` (CV Core) |
| 27 | Hemodynamic Monitoring | `hemodynamic-monitoring-np` (Assessment) | `hemodynamic-monitoring-np-np` (CV Core Physiology) |
| 28 | Respiratory Mechanics | `respiratory-mechanics-np` (Assessment) | `respiratory-mechanics-np-np` (Resp Core Physiology) |
| 29 | Marfan Syndrome | `marfan-syndrome-np` (Rare & Genetic) | `marfan-syndrome-np-np` (Professional Practice) |
| 30 | Alpha-1 Antitrypsin | `alpha-1-antitrypsin-deficiency-np` (Rare & Genetic) | `alpha-1-antitrypsin-deficiency-np-np` (Resp Core) |
| 31 | IABP | `intra-aortic-balloon-pump-np` (Critical Care) | `intra-aortic-balloon-pump-np-np` (CV Core Physiology) |
| 32 | NIV Modes | `non-invasive-ventilation-modes-np` (Critical Care) | `non-invasive-ventilation-modes-np-np` (Professional Practice) |

### 3.3 Content Overlap Near-Duplicates

| Pair | Recommendation |
|------|---------------|
| `cardiac-tamponade-mgmt-np` vs `cardiac-tamponade-np` (both in Cardiovascular) | Merge into single lesson |
| `amniotic-fluid-embolism-np` vs `amniotic-fluid-embolism-dic-pathway-np` (both in Maternity) | Review for content overlap; likely merge |
| `effusive-constrictive-pericarditis-np` vs `constrictive-pericarditis-np` (both in Cardiovascular) | Keep separate (distinct conditions) but cross-reference |
| `copd-exacerbation-np` (Respiratory) vs `copd-exacerbation-rx-np` (Respiratory Prescribing) | Different focus; keep both |
| `dka-hhns-np` vs `dka-management-np` (both in Endocrine) | Review for overlap; consider merging |
| `hpa-axis-stress-np` vs `stress-hpa-axis-np` (both in Endocrine) | Near-identical topic; merge |
| `heart-failure-np` vs `hf-advanced-np` (both in Cardiovascular) | Review for overlap |
| `hyperaldosteronism-np` vs `conn-syndrome-np` (both in Endocrine) | Same condition; merge |

---

## 4. Gap Analysis vs AANP & ANCC Blueprints

### 4.1 AANP FNP Certification Exam Content Domains

The AANP FNP exam covers five major domains. Below is an assessment of current NurseNest coverage.

#### Domain I: Assessment (approximately 22% of exam)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Comprehensive health history | Assessment Skills section (51 lessons) | Adequate |
| Review of systems | Multiple assessment lessons | Adequate |
| Physical examination techniques | Multiple exam-specific lessons | Adequate |
| Risk factor identification | Embedded in clinical lessons | Adequate |
| Developmental assessment (pediatric) | Pediatrics Core (26 lessons) | Adequate |
| Geriatric assessment | Geriatric Medicine (10), Geriatrics Core (6) | Moderate |
| Mental status examination | Psychiatry (21), Psych Core (10) | Adequate |
| Screening guidelines (USPSTF) | Family Medicine (20 lessons) | **GAP: No dedicated USPSTF screening lesson** |
| Health literacy assessment | Not identified | **GAP** |

#### Domain II: Diagnosis (approximately 24% of exam)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Differential diagnosis | Diagnostic Reasoning section (4), Criteria sections | Adequate |
| Diagnostic test interpretation | Multiple diagnostic criteria sections | Adequate |
| Lab interpretation | Multiple embedded | Adequate |
| Imaging interpretation | Assessment lessons | Moderate |
| Clinical decision-making | Cross-System Concepts (7) | Moderate |
| Evidence-based diagnosis | Diagnostic criteria sections | Adequate |

#### Domain III: Plan (approximately 24% of exam)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Pharmacologic management | Prescribing sections (95+ lessons total) | Strong |
| Non-pharmacologic interventions | Embedded in clinical lessons | Moderate |
| Patient education/counseling | Embedded | Moderate |
| Referral & consultation | **Limited** | **GAP: No dedicated referral criteria lesson** |
| Complementary/integrative therapies | **Not found** | **GAP** |
| Care coordination | **Limited** | **GAP: No explicit interprofessional collaboration lesson** |

#### Domain IV: Evaluation (approximately 12% of exam)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Treatment response monitoring | Embedded in prescribing lessons | Moderate |
| Follow-up planning | Embedded | Moderate |
| Outcome measurement | **Not found** | **GAP** |
| Quality improvement | **Not found** | **GAP: No QI/EBP lesson** |

#### Domain V: Professional Role (approximately 18% of exam)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Scope of practice | `scope-of-practice-ca-us-np` | Present |
| Ethical considerations | Legal & Ethical Prescribing (6) | Moderate |
| Regulatory requirements | Controlled Substances, PDMP | Moderate |
| Telehealth/telemedicine | **Not found** | **GAP** |
| Billing/coding (basic) | **Not found** | **GAP** |
| Collaborative practice agreements | **Not found** | **GAP** |
| Cultural competency | **Not found** | **GAP** |
| Health policy | **Not found** | **GAP** |

### 4.2 ANCC FNP Certification Exam Content Domains

#### I. Scientific Foundation (approximately 15%)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Advanced pathophysiology | Advanced Patho Foundations (25) + 11 system patho sections | Strong |
| Advanced pharmacology | Prescribing sections (95+ lessons) | Strong |
| Advanced health assessment | Assessment Skills (51) | Strong |

#### II. Advanced Practice Skills (approximately 30%)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Health promotion & disease prevention | Family Medicine (20) | Moderate |
| Clinical prevention & population health | **Limited** | **GAP: No population health/epidemiology lesson** |
| Patient-centered care | Embedded | Moderate |
| Interprofessional collaboration | **Not found** | **GAP** |
| Evidence-based practice | **Not found** | **GAP: No dedicated EBP/research methods lesson** |

#### III. Diagnosis & Management (approximately 40%)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Acute conditions | Trauma & Emergency (19), Critical Care (17) | Strong |
| Chronic disease management | Multiple systems | Strong |
| Common primary care conditions | Family Medicine (20), Core Physiology sections | Strong |
| Psychiatric/behavioral health | Psychiatry (21), Psych Core (10), Psych Prescribing (12) | Strong |

#### IV. Role & Policy (approximately 15%)

| Content Area | Current Coverage | Gap Status |
|-------------|-----------------|------------|
| Healthcare delivery systems | **Not found** | **GAP** |
| Quality improvement | **Not found** | **GAP** |
| Leadership & advocacy | **Not found** | **GAP** |
| Practice management | **Not found** | **GAP** |
| Reimbursement/documentation | Documentation Requirements only | **GAP** |

### 4.3 Primary Care NP Clinical Domains

| Clinical Domain | Lesson Count | Coverage Assessment |
|----------------|-------------|-------------------|
| Cardiovascular | 41 + 48 (core) + 15 (prescribing) = 104 | Excellent |
| Respiratory | 19 + 59 (core) + 7 (prescribing) = 85 | Excellent |
| Neurological | 23 + 25 (core) + 4 (diagnostic) = 52 | Strong |
| Endocrine | 36 + 29 (core) + 7 (prescribing) = 72 | Excellent |
| Renal/GU | 20 + 16 (core) + 3 (prescribing) = 39 | Strong |
| GI/Hepatology | 26 + 18 (core) + 4 (prescribing) = 48 | Strong |
| Hematology/Oncology | 16 + 15 (core) + 3 (diagnostic) = 34 | Moderate |
| Infectious Disease | 23 + 18 (core) + 6 (prescribing) = 47 | Strong |
| Women's Health | 25 + 21 (core) + 5 (prescribing) = 51 | Strong |
| Psychiatry | 21 + 10 (core) + 12 (prescribing) = 43 | Strong |
| Dermatology | 12 + 13 (core) = 25 | Moderate |
| HEENT/ENT | 9 (no core section) = 9 | **Weak** |
| Musculoskeletal | 7 (no core section) = 7 | **Weak** |
| Men's Health | 7 (no core section) = 7 | **Weak** |
| Pediatrics | 10 (neonatal) + 26 (core) + 3 (prescribing) = 39 | Moderate |
| Geriatrics | 10 + 6 (core) + 3 (prescribing) = 19 | Moderate |
| Pain Management | 8 (no core section) = 8 | **Weak** |

---

## 5. System-by-System Gap List

### 5.1 Cardiovascular (41 lessons — Excellent coverage)

**Already Present:** AAA, STEMI, HF (neurohormonal), Shock, AFib, Hypertensive Emergency, ACS, Cardiac Arrest/ACLS, HFpEF, Valvular Disease, PVD, VTE, Brugada, Long QT, Takotsubo, Infective Endocarditis, Marfan Cardiac, Constrictive Pericarditis, Cardiac Tamponade, Aortic Dissection, PE, Fat Embolism, Secondary HTN Workup, Cardiomyopathy Differential, Syncope Algorithm, Coronary Ectasia, Microvascular Dysfunction, Vasculitis Coronary, Infiltrative Cardiomyopathy, FMD, Renovascular HTN, Peripheral Embolism, Cholesterol Embolism, Effusive-Constrictive, Libman-Sacks, Endomyocardial Fibrosis, Culture-Negative IE

**High-Priority Missing:**
- Essential/Primary Hypertension Management (separate from emergency — most common CV condition in primary care)
- Stable Angina management
- Dyslipidemia screening and statin management (exists in prescribing but not as clinical lesson)
- Peripheral Arterial Disease: Ankle-Brachial Index interpretation
- Pacemaker/ICD management follow-up

**Medium-Priority Missing:**
- Athlete's heart vs hypertrophic cardiomyopathy
- Postural Orthostatic Tachycardia Syndrome (POTS)
- Cardiac rehabilitation
- Pre-operative cardiac risk assessment

**Low-Priority Missing:**
- Cardiac sarcoidosis (partially covered under infiltrative)
- Giant cell myocarditis

### 5.2 Respiratory (19 lessons — Good coverage)

**Already Present:** COPD exacerbation, Status Asthmaticus, PE, ARDS, Pneumonia (CAP vs HAP), TB, Pleural Effusion, Pulmonary HTN, Lung Cancer Staging, Respiratory Failure, Bronchiectasis, ILD, Sarcoidosis Pulmonary, Occupational Lung Disease, VAP, Tracheobronchial Injury, Hemothorax, Pneumothorax, Chest Drainage

**High-Priority Missing:**
- Asthma: Chronic management & step therapy (separate from emergency)
- COPD: Stable disease management & GOLD classification
- Sleep apnea (OSA/CSA): diagnosis & CPAP management
- Cough: differential diagnosis algorithm
- Smoking cessation counseling

**Medium-Priority Missing:**
- Pulmonary function test interpretation (comprehensive)
- Lung nodule evaluation (Fleischner criteria)
- Oxygen therapy prescribing
- Pulmonary rehabilitation
- Aspiration pneumonia/pneumonitis

**Low-Priority Missing:**
- Cystic fibrosis adult management
- Pulmonary Langerhans cell histiocytosis
- Mesothelioma

### 5.3 Neurological (23 lessons — Strong coverage)

**Already Present:** ICP, Stroke, Status Epilepticus, TBI, SAH, SCI, MS, ALS, Parkinson's, Dementia, Headache, Myasthenia Gravis, Huntington, NPH, CPM, PRES, Cavernous Sinus Thrombosis, CVST, Brown-Sequard, Locked-In Syndrome, Alzheimer, Guillain-Barre

**High-Priority Missing:**
- Peripheral neuropathy: diabetic, B12, alcoholic
- Vertigo/dizziness: central vs peripheral differential
- Bell's palsy management
- Carpal tunnel syndrome
- Restless leg syndrome

**Medium-Priority Missing:**
- Trigeminal neuralgia
- Essential tremor vs Parkinson's
- Lumbar puncture interpretation
- Neuroleptic malignant syndrome (may be in psych)
- Cerebral palsy (may be in pediatrics)

**Low-Priority Missing:**
- Chiari malformation
- Pseudotumor cerebri/Idiopathic Intracranial HTN
- Narcolepsy

### 5.4 Endocrine & Metabolic (36 lessons — Excellent coverage)

**Already Present:** DKA/HHS, SIADH/DI, Thyroid Storm, Adrenal Crisis, Cushing, Hyperaldosteronism, Pheochromocytoma, Hypercalcemia, Hyponatremia, MEN Syndromes, Carcinoid, Insulinoma, Conn Syndrome, Myxedema Coma, Androgen Insensitivity, Diabetes in Pregnancy, Hyperprolactinemia, Adrenal Incidentaloma, Hypocalcemia, Testosterone Deficiency, Glucagonoma, VIPoma, Hypogonadism, Panhypopituitarism, Craniopharyngioma, Ectopic ACTH, Hyperparathyroid Crisis, Toxic MNG, Thyroid Nodule Malignancy, Hypercalcemia Workup, Diabetes Technology, GDM Screening, Thyroid Cancer Surveillance, HPA Axis, DKA Management

**High-Priority Missing:**
- Type 2 Diabetes: Comprehensive management & ADA guidelines (primary care bread-and-butter)
- Hypothyroidism: Levothyroxine dosing & monitoring
- Hyperthyroidism: Graves disease management (non-storm)
- Metabolic Syndrome
- Obesity management & pharmacotherapy (GLP-1 RA role)
- Osteoporosis: DXA interpretation & management

**Medium-Priority Missing:**
- Polycystic Ovarian Syndrome (PCOS) — endocrine aspects
- Subclinical thyroid disease management
- Vitamin D deficiency
- Type 1 Diabetes management (insulin regimens)

**Low-Priority Missing:**
- Autoimmune polyglandular syndromes
- Zollinger-Ellison syndrome

### 5.5 GI & Hepatology (26 lessons — Strong coverage)

**Already Present:** Portal Hypertension, Acute Liver Failure, SBP, Hepatorenal Syndrome, Acute Pancreatitis, GI Bleed, Bowel Obstruction, Appendicitis, Diverticulitis, IBD, Cholecystitis, Cholangitis, Mesenteric Ischemia, C. diff, Esophageal Varices, Toxic Megacolon, Ischemic Colitis, Ogilvie, Necrotizing Pancreatitis, Boerhaave, Budd-Chiari, Abdominal Compartment, Acalculous Cholecystitis, Pancreatic Pseudocyst, Hepatopulmonary Syndrome, TIPS Complications

**High-Priority Missing:**
- GERD: Diagnosis & management (most common GI complaint)
- PUD/H. pylori: Diagnosis & eradication regimens
- IBS: Diagnosis & management (Rome IV)
- Celiac disease: Diagnosis & management
- Chronic hepatitis B & C management
- Cirrhosis: MELD scoring & outpatient management
- Constipation & diarrhea differential

**Medium-Priority Missing:**
- Dysphagia evaluation algorithm
- Barrett's esophagus surveillance
- Colorectal cancer screening guidelines
- Hepatic encephalopathy outpatient management
- NAFLD/NASH management
- Eosinophilic esophagitis

**Low-Priority Missing:**
- Microscopic colitis
- Small intestinal bacterial overgrowth (SIBO)
- Gastroparesis management

### 5.6 Musculoskeletal (7 lessons — WEAK coverage)

**Already Present:** Compartment Syndrome, Osteoporosis Advanced, Spinal Cord Compression, Fat Embolism Orthopedic, Rhabdomyolysis, Cauda Equina, Fracture Management

**High-Priority Missing (AANP/ANCC heavily tested):**
- Low back pain: Red flags & imaging guidelines
- Osteoarthritis: Diagnosis & management
- Rheumatoid arthritis: Diagnosis & DMARD initiation (note: some coverage in Rheumatology section)
- Gout & pseudogout: Diagnosis & management
- Shoulder pain: Rotator cuff evaluation
- Knee pain: Meniscal & ligamentous injury assessment
- Sprains & strains management

**Medium-Priority Missing:**
- Neck pain & cervical radiculopathy
- Carpal tunnel syndrome
- Plantar fasciitis
- Fibromyalgia: Diagnosis & management
- Tendinopathy management
- Hip fracture management
- Ankylosing spondylitis

**Low-Priority Missing:**
- Paget's disease of bone
- Osteomyelitis (may be in ID)
- Thoracic outlet syndrome

### 5.7 HEENT & ENT (9 lessons — WEAK coverage)

**Already Present:** Acute Otitis Media, Sinusitis, Pharyngitis, Dental Emergencies, Ludwig Angina, Peritonsillar Abscess, Retropharyngeal Abscess, Epiglottitis, Mastoiditis

**High-Priority Missing (commonly tested):**
- Allergic rhinitis: Diagnosis & management
- Otitis externa management
- Hearing loss evaluation: Conductive vs sensorineural
- Age-related macular degeneration
- Glaucoma screening & referral
- Conjunctivitis: Bacterial vs viral vs allergic
- Epistaxis management

**Medium-Priority Missing:**
- Cerumen impaction
- Temporomandibular joint disorder (TMJ)
- Tinnitus evaluation
- Oral candidiasis
- Salivary gland disorders
- Vertigo: BPPV (Dix-Hallpike & Epley)
- Diabetic retinopathy screening

**Low-Priority Missing:**
- Nasal polyps
- Vocal cord dysfunction
- Labyrinthitis

### 5.8 Men's Health (7 lessons — WEAK coverage)

**Already Present:** Erectile Dysfunction, BPH, Prostate Cancer Screening, Testicular Torsion, Epididymitis, Male Infertility, BPH/TURP

**High-Priority Missing:**
- Testosterone replacement therapy: Indications, monitoring, risks
- Prostate cancer: Active surveillance vs treatment
- Male pattern baldness (androgenetic alopecia)
- Hydrocele & varicocele
- Phimosis/paraphimosis

**Medium-Priority Missing:**
- Chronic prostatitis/pelvic pain
- Peyronie disease
- Male contraception counseling
- Penile cancer screening

### 5.9 Pain Management (8 lessons — WEAK coverage)

**Already Present:** Multimodal Pain, Neuropathic Pain, Regional Anesthesia, Chronic Pain, PCA Management, Acute Pain NP, Cancer Pain Palliative, Epidural Management

**High-Priority Missing:**
- Chronic pain: Non-opioid management strategies
- Headache management: Migraine prophylaxis & acute treatment
- Low back pain pharmacotherapy
- Musculoskeletal pain: NSAIDs & acetaminophen prescribing
- Opioid use disorder: Screening & SBIRT

**Medium-Priority Missing:**
- Complex regional pain syndrome (CRPS)
- Myofascial pain syndrome
- Chronic pelvic pain
- Pain assessment tools (validated instruments)
- Interventional pain management referral criteria

### 5.10 Procedures (8 lessons — WEAK coverage)

**Already Present:** Central Line, Arterial Line, Chest Tube, Lumbar Puncture, Paracentesis, Bone Marrow Biopsy, Bronchoscopy, EVD Management

**High-Priority Missing:**
- Joint injection/aspiration (knee, shoulder)
- Skin biopsy (punch, shave, excisional)
- Incision & drainage
- Suturing & wound closure
- Pap smear & cervical screening
- IUD insertion/removal

**Medium-Priority Missing:**
- Nail removal/trephination
- Trigger point injection
- Splinting & casting
- Nasogastric tube insertion
- Foley catheter insertion & management
- Cerumen removal

### 5.11 Dermatology (12 lessons — Moderate coverage)

**Already Present:** Psoriasis, Eczema, Skin Cancer, Stevens-Johnson/TEN, Burns, Cellulitis, Necrotizing Fasciitis, Wound Assessment, Pressure Ulcer, Contact Dermatitis, Urticaria, Drug Eruption

**High-Priority Missing:**
- Acne vulgaris management (common primary care)
- Rosacea management
- Fungal infections: Tinea, onychomycosis
- Scabies & lice
- Warts (verrucae): Treatment options
- Herpes simplex: Diagnosis & management
- Dermatitis: Seborrheic & atopic differentiation

**Medium-Priority Missing:**
- Alopecia evaluation
- Melasma
- Skin lesion morphology & terminology
- Dermoscopy basics
- Basal cell vs squamous cell vs melanoma identification

### 5.12 Pediatrics (10 neonatal + 26 core = 36 lessons — Moderate)

**Already Present:** Neonatal RDS, HIE, PPHN, NAS, Trisomy 21, Hypospadias, Duchenne MD, VP Shunt, Tonsillectomy Care, Newborn of Diabetic Mother + 26 pediatric core conditions

**High-Priority Missing:**
- Well-child visit framework & developmental milestones
- Childhood immunization schedule & catch-up
- Growth & development monitoring
- Common childhood infections (croup, bronchiolitis, RSV)
- Asthma in children: NAEPP guidelines
- Failure to thrive evaluation
- Fever in neonates/infants: Workup algorithm

**Medium-Priority Missing:**
- Autism spectrum disorder screening
- Childhood obesity
- Enuresis management
- Kawasaki disease
- Lead screening & poisoning
- Congenital heart disease screening

### 5.13 Geriatrics (10 + 6 core = 16 lessons — Moderate)

**Already Present:** Polypharmacy, Falls, Delirium, Frailty Syndrome, Elder Abuse, End-of-Life, Urinary Incontinence, Osteoporosis Geriatric, Beers Criteria, Dementia Caregiving + 6 core concepts

**High-Priority Missing:**
- Comprehensive geriatric assessment
- Advance care planning / advance directives
- Medicare Annual Wellness Visit framework
- Pressure ulcer prevention in elderly
- Malnutrition screening (MNA tool)
- Hearing/vision screening in elderly

**Medium-Priority Missing:**
- Driving safety assessment
- Caregiver burden assessment
- Dizziness/syncope in elderly
- Hip fracture management in elderly
- Delirium prevention bundles

---

## 6. Question Bank & Flashcard Coverage Gaps

### 6.1 Exam Question Coverage

| Source | Question Count |
|--------|---------------|
| Embedded quiz (core content files) | ~542 |
| Generated batches (7 files) | ~1,082 |
| Clinical batches (6 files) | ~112 |
| Extra questions NP (standalone) | 35 |
| **Total quiz questions** | **~1,771** |

**Question bank coverage by topic area:**

| System | Questions Present | Assessment |
|--------|------------------|------------|
| Cardiovascular | Yes (CV content, clinical batches) | Good |
| Respiratory | Yes (resp content, clinical batches) | Good |
| Neurological | Yes (neuro content) | Good |
| Endocrine | Yes (endo content) | Good |
| Renal | Yes (clinical units) | Moderate |
| Hematology/Oncology | Yes (clinical batches) | Moderate |
| Maternity/OB | Yes (reproductive NP) | Good |
| Pharmacology | Yes (prescribing) | Moderate |
| Musculoskeletal | **Very limited** | **GAP** |
| HEENT | **Very limited** | **GAP** |
| Men's Health | Yes (clinical units) | Limited |
| Dermatology | **Limited** | **GAP** |
| Pediatrics | **Limited** | **GAP** |
| Pain Management | **Limited** | **GAP** |
| Geriatrics | **Limited** | **GAP** |

### 6.2 Flashcard Coverage

| File | Flashcard Count |
|------|----------------|
| `flashcards-np.ts` | 526 |
| `flashcards-np-patho.ts` | 215 |
| `flashcards-np-enrichment-1.ts` | 70 |
| `flashcards-np-enrichment-2.ts` | 49 |
| `flashcards-np-enrichment-3.ts` | 35 |
| `flashcards-np-enrichment-4.ts` | 35 |
| `flashcards-np-enrichment-5.ts` | 35 |
| `flashcards-np-enrichment-6.ts` | 28 |
| **Total** | **~993** |

**Flashcard gaps:**
- No system-specific flashcard decks (all flashcards are pooled)
- No prescribing-focused flashcard set
- No diagnostic criteria flashcard set
- No pharmacology-specific flashcard deck for NP tier
- Enrichment files 3-6 are suspiciously small (35-43 lines each) and may be stubs

### 6.3 Lessons Without Corresponding Practice Questions

The generated batch files (np-generated-batch-1 through -7) each contain one quiz question per lesson, providing basic coverage. However, lessons in the following categories have only 1 embedded quiz question and no additional test bank coverage:

- Core Prescribing Foundations (24 lessons)
- Diagnostic Criteria sections (44 lessons total)
- Exam Strategy section (8 lessons)
- Professional Practice & Guidelines (59 lessons)

---

## 7. SEO & Sitemap Gaps

### 7.1 SEO Condition Pages

**Current NP entries in `seo-conditions.ts`: 0**
**Current NP entries in `seo-metadata.ts`: 0**

This is a critical gap. None of the 1,141 NP lessons have dedicated SEO condition pages or metadata entries. By comparison, the RPN and RN tiers likely have SEO condition pages for their lessons. This means:

- NP lesson pages are not optimized for search engines
- No structured data or meta descriptions exist for NP topics
- NP content is not discoverable via organic search for condition-specific queries
- Missing opportunity for high-value keywords like "nurse practitioner heart failure management," "NP STEMI protocol," etc.

### 7.2 Sitemap Coverage

**Current NP entries in `language-sitemaps.ts`: 6 hub-level pages**

| Entry | Path |
|-------|------|
| NP Exam Practice Questions | `/np-exam-practice-questions` |
| NP Test Bank | `/np/test-bank` |
| Canada NP Mock Exam | `/canada-np/mock-exam` |
| US NP Mock Exam | `/us-np/mock-exam` |
| Canada NP Hub | `/canada-np` |
| US NP Hub | `/us-np` |

**Missing from sitemap:**
- Individual NP lesson pages (`/lessons/{lesson-id}`) — all 1,141 lessons
- NP tier landing page
- NP flashcard pages
- NP system-level pages

### 7.3 `topics.ts` Coverage

**Current NP entries in `topics.ts`: 0**

No NP topics are defined in the topics data file, which may affect topic-based navigation, filtering, and discovery features.

---

## 8. Prioritized Build Roadmap

### Phase 1: Critical Gaps — AANP/ANCC Core (Priority: Immediate)

These topics are heavily weighted on both AANP and ANCC FNP exams and are currently absent or severely underrepresented.

| Batch | Topics | Est. Lessons | Rationale |
|-------|--------|-------------|-----------|
| **1.1** | **Musculoskeletal Primary Care** | 10-12 | Only 7 lessons; MSK is ~8-12% of AANP exam. Need: low back pain, OA, gout, shoulder/knee evaluation, sprains/strains, RA basics |
| **1.2** | **HEENT Primary Care** | 10-12 | Only 9 lessons; HEENT is commonly tested. Need: allergic rhinitis, otitis externa, hearing loss, glaucoma, conjunctivitis, epistaxis, BPPV |
| **1.3** | **Chronic Disease Management** | 8-10 | Missing bread-and-butter: T2DM comprehensive, hypothyroidism, GERD, IBS, stable COPD, stable asthma, dyslipidemia |
| **1.4** | **Well-Care & Screening** | 6-8 | Missing USPSTF screening, well-child visits, immunization schedules, cancer screening guidelines, annual wellness visit |

### Phase 2: High-Priority Gaps — Common Primary Care (Priority: Within 4 weeks)

| Batch | Topics | Est. Lessons | Rationale |
|-------|--------|-------------|-----------|
| **2.1** | **Dermatology Primary Care** | 8-10 | Need: acne, rosacea, tinea, scabies, warts, herpes simplex, skin lesion ID |
| **2.2** | **Men's Health Expansion** | 5-6 | Only 7 lessons. Need: TRT management, prostate cancer management, hydrocele/varicocele |
| **2.3** | **Pain Management Expansion** | 6-8 | Only 8 lessons. Need: migraine prophylaxis, chronic pain non-opioid, MSK pain prescribing, OUD screening |
| **2.4** | **GI Primary Care** | 8-10 | Need: GERD, PUD/H.pylori, celiac, chronic hepatitis, cirrhosis outpatient, constipation/diarrhea |
| **2.5** | **Sleep Medicine** | 3-4 | Missing entirely. Need: OSA diagnosis/CPAP, insomnia management, restless leg syndrome |

### Phase 3: Moderate-Priority Gaps — Exam Domain Coverage (Priority: Within 8 weeks)

| Batch | Topics | Est. Lessons | Rationale |
|-------|--------|-------------|-----------|
| **3.1** | **Professional Practice & Role** | 8-10 | AANP Domain V = 18%. Need: telehealth, billing/coding basics, collaborative practice, cultural competency, health policy, QI/EBP |
| **3.2** | **Pediatrics Well-Care** | 6-8 | Need: well-child visits, immunization schedule, developmental milestones, common childhood infections, childhood asthma |
| **3.3** | **Geriatric Medicine Expansion** | 5-6 | Need: comprehensive geriatric assessment, advance directives, Medicare AWV, malnutrition screening |
| **3.4** | **Procedures Primary Care** | 6-8 | Need: joint injection, skin biopsy, I&D, suturing, Pap smear, IUD |
| **3.5** | **Neurological Primary Care** | 5-6 | Need: peripheral neuropathy, vertigo/dizziness, Bell's palsy, carpal tunnel, RLS |

### Phase 4: Enhancement & Quality (Priority: Within 12 weeks)

| Batch | Topics | Est. Lessons | Rationale |
|-------|--------|-------------|-----------|
| **4.1** | **Metabolic & Obesity** | 4-5 | Need: metabolic syndrome, obesity pharmacotherapy, PCOS |
| **4.2** | **Respiratory Primary Care** | 4-5 | Need: cough differential, smoking cessation, lung nodule, PFT interpretation |
| **4.3** | **Hematology Primary Care** | 4-5 | Need: common anemias, anticoagulation monitoring, bleeding disorders |
| **4.4** | **Cardiovascular Primary Care** | 4-5 | Need: HTN management, stable angina, PAD/ABI, POTS |
| **4.5** | **Women's Health Additions** | 3-4 | Need: osteoporosis, breast cancer screening, abnormal uterine bleeding management |

### Phase 5: Infrastructure & Quality (Priority: Ongoing)

| Item | Description |
|------|-------------|
| **5.1** | **Resolve 32 near-duplicate groups** — Merge or differentiate lessons with `-np` vs `-np-np` suffixes |
| **5.2** | **Register 140 orphaned content entries** — Review and add to appropriate `npSystems` sections |
| **5.3** | **Build NP SEO condition pages** — Create entries in `seo-conditions.ts` and `seo-metadata.ts` for top 100 NP lessons |
| **5.4** | **Expand NP sitemap** — Add individual lesson URLs to sitemap generator |
| **5.5** | **Create system-specific flashcard decks** — MSK, HEENT, Derm, Pain, Procedures flashcard sets |
| **5.6** | **Expand question bank** — Target 5+ questions per lesson for under-covered systems |
| **5.7** | **Audit enrichment flashcard files** — Files 3-6 may be stubs (35-43 lines each) |

### Estimated Total New Content

| Phase | New Lessons | Timeline |
|-------|-------------|----------|
| Phase 1: Critical Gaps | 34-42 | Immediate |
| Phase 2: High-Priority | 30-38 | 4 weeks |
| Phase 3: Moderate-Priority | 30-38 | 8 weeks |
| Phase 4: Enhancement | 19-24 | 12 weeks |
| Phase 5: Infrastructure | N/A (maintenance) | Ongoing |
| **Total new lessons** | **113-142** | |

### Summary Ranking by AANP/ANCC Exam Impact

1. **Musculoskeletal Primary Care** — highest gap severity relative to exam weight
2. **HEENT Primary Care** — second highest gap, commonly tested
3. **Chronic Disease Management** — bread-and-butter of FNP practice
4. **Well-Care & Screening** — USPSTF screening is heavily tested
5. **Dermatology Primary Care** — common presentations, moderate exam weight
6. **GI Primary Care** — common conditions missing despite strong acute coverage
7. **Professional Practice & Role** — 15-18% of both exams, almost no coverage
8. **Pain Management Expansion** — common in primary care, undertested
9. **Men's Health Expansion** — small section with gaps
10. **Sleep Medicine** — entirely absent, commonly tested
11. **Pediatrics Well-Care** — preventive care for FNP is critical
12. **Geriatric Medicine** — aging population emphasis on exam
13. **Procedures** — scope varies by state/province but tested
14. **Neurological Primary Care** — peripheral neuro conditions missing
15. **Respiratory Primary Care** — chronic management missing
16. **SEO & Sitemap** — zero NP SEO coverage limits organic discovery

---

## Appendix A: Content File Cross-Reference

### Registered Lessons with Confirmed Content (1,141 of 1,141)

All 1,141 registered lesson IDs in `npSystems` have corresponding content entries in one or more data files. No ghost menu entries were found.

### Orphaned Content (140 entries)

140 lesson content entries exist in data files but are not registered in any `npSystems` section. These should be audited individually to determine if they should be:
- Added to existing system sections
- Consolidated with near-duplicates
- Archived if superseded

---

## Appendix B: Tier Configuration Blueprint Alignment

The current `tier-config.ts` blueprint categories for NP are:

| Category | Weight | Coverage Assessment |
|----------|--------|-------------------|
| Advanced Assessment | 12% | Strong (51 assessment lessons) |
| Diagnosis & Differential | 15% | Strong (diagnostic criteria + clinical lessons) |
| Diagnostics, Labs & Imaging | 12% | Moderate (embedded in lessons) |
| Pharmacotherapeutics | 15% | Strong (95+ prescribing lessons) |
| Treatment Planning | 12% | Strong (embedded in clinical lessons) |
| Follow-up & Monitoring | 8% | Moderate (embedded) |
| Health Promotion & Prevention | 8% | **WEAK — missing USPSTF, screening** |
| Chronic Disease Management | 10% | **MODERATE — missing core chronic disease lessons** |
| Urgent/Emergent Recognition | 8% | Strong (trauma, emergency, critical care) |

The two weakest blueprint categories — Health Promotion & Prevention and Chronic Disease Management — align directly with the Phase 1 and Phase 2 build recommendations.

---

*End of NP Curriculum Audit & Expansion Roadmap*
