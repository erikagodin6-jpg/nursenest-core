# RN Blueprint Audit Report
**Source:** `data/blueprints/rn-content-blueprint.json`  
**Date:** 2026-04-10  
**Topics audited:** 187  

---

## 1. Overlap Report

### 1a. Slug Collisions
**Result: NONE.** All 187 `topicSlug` values are unique. No near-collisions within 30-character prefix matches.

---

### 1b. True Duplication Risks (Cross-Domain, Same Clinical Content)

These are the **only real overlap risks** — topics that cover the same clinical event from different domain angles. Each has a recommended resolution.

| # | Slug A | Domain A | Slug B | Domain B | Risk Level | Resolution |
|---|--------|----------|--------|----------|------------|------------|
| 1 | `acute-mi-emergency` | Emergency / Critical Care | `myocardial-infarction` | Cardiac | 🔴 HIGH | A covers STEMI recognition + MONA emergency response. B covers STEMI vs NSTEMI, troponin, post-MI care. **Scope must be explicitly bounded in lesson briefs.** |
| 2 | `dvt-pulmonary-embolism` | Cardiac | `pulmonary-embolism` | Respiratory | 🔴 HIGH | A covers DVT + PE prevention/diagnosis together. B covers PE risk factors + emergency mgmt. Significant question overlap risk. **Merge or explicitly split: A = prophylaxis/diagnosis, B = acute hemodynamic instability mgmt only.** |
| 3 | `stroke-recognition-fast` | Emergency / Critical Care | `stroke-ischemic-hemorrhagic` | Neuro | 🟡 MODERATE | A covers FAST, door-to-needle, tPA decision. B covers pathophysiology, deficits, stroke scale, ongoing care. Manageable if brief scope lines are written. |
| 4 | `blood-transfusion` | Adult Health / Med-Surg | `transfusion-reactions` | Hematology / Oncology | 🟡 MODERATE | Intentional split (admin procedure vs. reaction types). Low overlap risk if lesson briefs stay scoped. **Tag `blood-transfusion` as prerequisite of `transfusion-reactions`.** |
| 5 | `mechanical-ventilation` | Emergency / Critical Care | `ventilation-weaning` | Respiratory | 🟡 MODERATE | A covers modes/settings/alarms. B covers SBT/extubation readiness. Complementary, not duplicative. Low risk. |
| 6 | `pediatric-meningitis` | Pediatrics | `bacterial-meningitis` | Neuro | 🟡 MODERATE | Justified population split (child-specific presentation vs. general adult pathophysiology). Keep both; flag in lesson brief that pediatric content differs. |
| 7 | `pediatric-type1-diabetes` | Pediatrics | `diabetes-mellitus-t1-t2` | Endocrine | 🟡 MODERATE | Peds covers pump management, school nursing, ketone monitoring in children. Endocrine covers adult pathophysiology + pharmacology. Scope distinct but question wording must differ. |
| 8 | `pediatric-vital-signs` | Pediatrics | `vital-signs-measurement` | Fundamentals | 🟢 LOW | Adult norms vs. age-stratified norms. Questions will naturally differ. No action needed. |

---

### 1c. Semantic Near-Matches (False Positives — No Action Needed)

The following were flagged by keyword matching but represent **legitimate distinct topics**:

- `pain-management` ↔ `pediatric-asthma` — shared words "assessment/acute/management" are generic clinical terms, not content overlap
- `substance-use-withdrawal` ↔ `seizure-disorders` — shared clinical complication (withdrawal seizures) is intentional cross-reference content, not duplication
- `metabolic-acidosis-alkalosis` ↔ `respiratory-acidosis-alkalosis` — paired companion topics; `abg-interpretation` is the synthesis capstone. Correct structure.
- `addisons-disease` ↔ `sickle-cell-disease` — keyword false positive ("disease," "crisis," "management")

---

### 1d. High-Risk Duplication Zones (Clusters)

**Diabetes Cluster** — 10 topics touch diabetes content across contexts:

| Topic | Domain | Focus |
|-------|--------|-------|
| `diabetes-hospitalized` | Med-Surg | Inpatient glucose mgmt |
| `insulin-administration` | Pharmacology | Insulin types/timing/dosing |
| `gestational-diabetes` | Maternal Newborn | Screening/obstetric impact |
| `newborn-assessment` | Maternal Newborn | Neonatal hypoglycemia only |
| `pediatric-type1-diabetes` | Pediatrics | Pediatric-specific mgmt |
| `dka-critical-care` | Emergency | DKA emergency protocol |
| `diabetes-mellitus-t1-t2` | Endocrine | Pathophysiology + chronic mgmt |
| `hypoglycemia` | Endocrine | Recognition + treatment |
| `hhs-management` | Endocrine | HHS vs DKA differentiation |
| `addisons-disease` | Endocrine | (incidental hypoglycemia only) |

**Verdict:** Cluster is **legitimate** — each topic occupies a distinct clinical context. However, question banks for `diabetes-mellitus-t1-t2`, `diabetes-hospitalized`, and `insulin-administration` must share zero questions. Use a deduplication tag like `diabetes-cluster` across all 10 to flag during QA.

---

## 2. Lesson-Count Adjustments

### 2a. Topics With 1 Lesson and ≥30 Questions (ratio >25 q/lesson)

These are underpowered in lesson coverage relative to question depth. Recommended action: **add 1 lesson OR reduce question count to ≤20**.

| Slug | Current L | Current Q | Ratio | Recommended Fix |
|------|-----------|-----------|-------|-----------------|
| `diuretics` | 1 | 30 | 30 | Add 1 lesson OR → 20Q |
| `digoxin-monitoring` | 1 | 30 | 30 | Add 1 lesson OR → 20Q |
| `croup-vs-epiglottitis` | 1 | 30 | 30 | Add 1 lesson |
| `standard-precautions-ppe` | 1 | 30 | 30 | → 20Q (single-lesson topic) |
| `respiratory-assessment` | 1 | 30 | 30 | → 20Q |
| `cardiovascular-assessment` | 1 | 30 | 30 | → 20Q |
| `primary-survey-abcde` | 1 | 30 | 30 | → 20Q |
| `anaphylaxis-management` | 1 | 30 | 30 | Add 1 lesson |
| `overdose-toxicology` | 1 | 30 | 30 | → 20Q |
| `iv-fluid-types` | 1 | 30 | 30 | Add 1 lesson (isotonic + hypo/hypertonic) |
| `sodium-imbalances` | 1 | 30 | 30 | Add 1 lesson |
| `potassium-imbalances` | 1 | 35 | 35 | Add 1 lesson ← highest ratio |
| `hypoglycemia` | 1 | 30 | 30 | → 20Q |
| `hyperthyroidism-thyroid-storm` | 1 | 30 | 30 | Add 1 lesson |
| `pleural-effusion-pneumothorax` | 1 | 30 | 30 | Add 1 lesson |
| `seizure-disorders` | 1 | 30 | 30 | Add 1 lesson |
| `gi-bleeding` | 1 | 30 | 30 | → 20Q |
| `dic-coagulation` | 1 | 30 | 30 | → 20Q |
| `transfusion-reactions` | 1 | 30 | 30 | → 20Q |

**Rule of thumb applied:** 1 lesson supports ≤20 questions comfortably; 2 lessons support 25–40.

---

## 3. Question-Count Adjustments

### 3a. Recommended Reductions (single-lesson topics over-scoped)

| Slug | Current Q | Recommended Q | Rationale |
|------|-----------|---------------|-----------|
| `standard-precautions-ppe` | 30 | 20 | Narrow procedural topic; 20Q covers full domain |
| `respiratory-assessment` | 30 | 20 | Assessment skill; bounded content |
| `cardiovascular-assessment` | 30 | 20 | Assessment skill; bounded content |
| `primary-survey-abcde` | 30 | 20 | Sequential framework; 20Q saturates |
| `overdose-toxicology` | 30 | 20 | Narrow antidote/priority topic |
| `hypoglycemia` | 30 | 20 | Rule-of-15 + glucagon; 20Q sufficient |
| `gi-bleeding` | 30 | 20 | Reduce or add 2nd lesson |
| `dic-coagulation` | 30 | 20 | Reduce or add 2nd lesson |
| `transfusion-reactions` | 30 | 20 | Companion to `blood-transfusion`; 20Q sufficient |
| `amputation-care` | 15 | 15 | Keep — correct for PW2 topic |

### 3b. Recommended Increases (high-priority topics slightly underweighted)

| Slug | Current Q | Recommended Q | Rationale |
|------|-----------|---------------|-----------|
| `scope-of-practice-rn-lpn-uap` | 40 | 40 | ✓ Already appropriate for PW5 |
| `five-rights-of-delegation` | 40 | 40 | ✓ Correct |
| `abg-interpretation` | 40 | 40 | ✓ Correct; synthesis capstone |
| `functional-assessment` | 15 | 15 | ✓ Correct for PW3 |

**Net adjustment:** −110 questions across 9 reductions. Revised total: ~5,215 questions.

---

## 4. Domain-by-Domain Execution Order

Ordered by learning dependency. Each domain unlocks clinical reasoning required by domains that follow.

### Phase 1 — Foundations (Topics 1–27)
Build procedural and safety schema before any clinical content.

| Seq | Domain | Topics | Notes |
|-----|--------|--------|-------|
| 1–10 | **Fundamentals** | 10 | Vital signs, asepsis, documentation, O₂, end-of-life |
| 11–20 | **Health Assessment** | 10 | Head-to-toe, GCS, breath/heart sounds, pain scales |
| 21–27 | **Safety / Infection Control** | 7 | PPE, precautions, CLABSI, falls, NPSG |

### Phase 2 — Core Enabling Knowledge (Topics 28–64)
Concepts referenced by nearly every subsequent clinical topic.

| Seq | Domain | Topics | Notes |
|-----|--------|--------|-------|
| 28–42 | **Pharmacology** | 15 | Anticoags, insulin, opioids, calcs — must precede clinical domains |
| 43–52 | **Fluids / Electrolytes / Acid-Base** | 10 | ABG, electrolyte imbalances — prerequisite for Renal, Cardiac, Emergency |
| 53–56 | **Prioritization** | 4 | Triage, rapid response — abstract reasoning scaffold |
| 57–64 | **Leadership / Delegation** | 8 | Delegation, scope, SBAR — required before multi-patient simulations |

### Phase 3 — Clinical Body Systems (Topics 65–141)
Generate in dependency order within this phase.

| Seq | Domain | Topics | Notes |
|-----|--------|--------|-------|
| 65–79 | **Adult Health / Med-Surg** | 15 | Sepsis, shock, transfusion — general clinical platform |
| 80–89 | **Cardiac** | 10 | HF, MI, dysrhythmias, ECG — before Emergency MI content |
| 90–98 | **Respiratory** | 9 | Asthma, COPD, ARDS, PE — before Emergency vent content |
| 99–105 | **Renal** | 7 | AKI, CKD, dialysis — requires Fluids/Electrolytes |
| 106–115 | **Neuro** | 10 | Stroke, ICP, seizures — before Emergency stroke content |
| 116–125 | **GI** | 10 | Cirrhosis, GI bleed, IBD |
| 126–132 | **Endocrine** | 7 | Diabetes, thyroid, adrenal — before Emergency DKA |
| 133–141 | **Hematology / Oncology** | 9 | Anemia, SCD, DIC, transfusion reactions |

### Phase 4 — Specialty Populations (Topics 142–176)
Require Phase 3 clinical context as prerequisite.

| Seq | Domain | Topics | Notes |
|-----|--------|--------|-------|
| 142–152 | **Mental Health** | 11 | Therapeutic comms, suicide, psychotropics |
| 153–164 | **Maternal Newborn** | 12 | Antepartum → intrapartum → postpartum → newborn |
| 165–176 | **Pediatrics** | 12 | Milestones → vitals → respiratory → neuro → endocrine |

### Phase 5 — Emergency / Critical Care (Topics 177–187)
Generate last — integrates all prior domains.

| Seq | Domain | Topics | Notes |
|-----|--------|--------|-------|
| 177–187 | **Emergency / Critical Care** | 11 | BLS/ACLS, anaphylaxis, MV, stroke, MI, DKA — synthesis topics |

---

## 5. Tagging Gaps: US vs Canadian RN Filtering

### 5a. Current State
All 187 topics carry **both** `us-rn` and `canadian-rn` tags. There are **zero exam-exclusive topics**. This means:
- A Canadian RN filter returns all 187 topics.
- A US RN filter returns all 187 topics.
- **The tags are currently non-discriminating for filtered delivery.**

### 5b. Topics Requiring Canadian-Specific Content Variants

These topics contain **US-specific terminology or regulatory references** that differ in Canada. They need either a `canadianVariant` flag or a parallel Canadian-authored content block:

| Slug | US-Specific Content | Canadian Equivalent |
|------|---------------------|---------------------|
| `scope-of-practice-rn-lpn-uap` | LPN/LVN + UAP terminology | RPN/CLPN/PSW terminology; provincial regulatory scope varies (CNO, CRNBC, etc.) |
| `national-patient-safety-goals` | TJC (The Joint Commission) standards | CPSI (Canadian Patient Safety Institute) + Accreditation Canada standards |
| `advance-directives-dnr` | POLST, DNR, Five Wishes (US) | Goals of Care, provincial DNR orders, MOST forms |
| `five-rights-of-delegation` | UAP delegation framework | Canadian delegation to unregulated care providers (UCPs); province-specific rules |
| `chain-of-command` | US hospital hierarchy norms | CNO practice standards; different union/college structure |
| `informed-consent` | HIPAA reference context | PIPEDA + provincial health privacy legislation |

### 5c. Recommended Tagging Schema Enhancement

Add a `examVariant` field to affected topics with values:
```json
"examVariant": {
  "us": { "note": "References TJC NPSG, LPN/UAP scope" },
  "canada": { "note": "References CPSI, RPN/UCP scope, provincial variation" }
}
```

This does not require blueprint regeneration — add as an amendment pass to 6 affected topics only.

### 5d. Topics That Are Genuinely Shared (No Variance Needed)
All 181 remaining topics cover clinical content (pathophysiology, pharmacology, assessment, procedures) that is identical between NCLEX-RN and Canadian RN exam domains. The `us-rn` + `canadian-rn` dual-tag is correct and sufficient for these.

---

## 6. Blockers Before Content Generation

### 🔴 Blockers (must resolve before generation)

| # | Blocker | Affected Topics | Resolution |
|---|---------|----------------|------------|
| B1 | **Scope boundary undefined for MI** | `acute-mi-emergency` + `myocardial-infarction` | Write a one-sentence scope line for each: Emergency = recognition + first 60 min. Cardiac = pathophysiology + post-MI day 1–discharge. |
| B2 | **PE question overlap risk** | `dvt-pulmonary-embolism` + `pulmonary-embolism` | Merge `pulmonary-embolism` (Respiratory) into `dvt-pulmonary-embolism` (Cardiac) OR split explicitly: Cardiac covers DVT only, Respiratory covers PE only. |
| B3 | **19 topics have Q/lesson ratio >25** | See Section 2a | Resolve lesson/question adjustments before handing to content writers. |

### 🟡 Cautions (resolve before QA, not before generation)

| # | Caution | Affected Topics | Resolution |
|---|---------|----------------|------------|
| C1 | Canadian regulatory content variants | 6 topics (see 5b) | Add `examVariant` field in amendment pass |
| C2 | Diabetes cluster deduplication | 10 topics | Add `cluster: "diabetes"` tag to all 10; use as QA dedup signal |
| C3 | `transfusion-reactions` prerequisite | `blood-transfusion` → `transfusion-reactions` | Mark `blood-transfusion` as soft prerequisite in lesson metadata |
| C4 | Stroke scope lines | `stroke-recognition-fast` + `stroke-ischemic-hemorrhagic` | Emergency = pre-hospital to CT. Neuro = post-CT management + rehab. |

### ✅ Confirmed Clear

- No slug collisions or near-collisions
- No orphaned domains (all 19 domains covered)
- NGN question types (`Bowtie`, `Matrix`, `Trend`) present in all PW5 topics
- All 187 topics carry both `us-rn` and `canadian-rn` tags
- `priorityWeight` distribution is realistic (85 critical, 73 high, 28 moderate, 1 low)
- `lessonTargetCount` is never 0; `questionTargetCount` never below 15
- Generator script is preserved at `scripts/generate-rn-blueprint.mjs` for future amendments

---

## Summary Table

| Category | Status | Count |
|----------|--------|-------|
| Slug collisions | ✅ Clear | 0 |
| Real content duplications | 🔴 Must resolve | 2 (MI, PE) |
| Moderate overlap (manageable) | 🟡 Scope lines needed | 6 |
| Q/lesson ratio outliers | 🟡 Adjust | 19 |
| Canadian tagging gaps (variant content) | 🟡 Amendment | 6 |
| Blockers before generation | 🔴 | 3 |
| Topics clear to generate | ✅ | 185 (all except MI + PE overlap pair) |
