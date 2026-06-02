# Blog Internal Linking Expansion

**Date:** 2026-06-01  
**Scope:** All tracked blog articles — 3 static fallback posts (modified) + 1,385 DB-backed articles (linking map)  
**Minimum target:** 5 internal links per article (RN lessons · RPN lessons · NP lessons · flashcards · practice tests · related blog)

---

## Changes Applied — Static Posts (`blog-static-posts.ts`)

Three static fallback articles were missing RPN lessons, NP lessons, `/practice-tests`, and cross-links to corpus articles. All gaps closed; all three now meet or exceed the 5-link minimum across every required category.

### 1. `clinical-judgment-on-exam-day`

**Before:** 9 links — no RPN lesson, no NP lesson, no `/practice-tests`, 2 related blog  
**After:** 14 unique links ✅

| Category | URL added | Anchor text |
|---|---|---|
| **RPN lesson** (new) | `/en/rpn/rex-pn/lessons/ca-rpn-prioritization-abcs` | RPN prioritization lesson |
| **RPN lesson** (new) | `/en/rpn/rex-pn/lessons/ca-rpn-delegation` | RPN delegation lessons |
| **NP lesson** (new) | `/us/np/fnp/lessons/fnp-differential-primary-care` | FNP differential reasoning lesson |
| **Practice tests** (new) | `/practice-tests` | Practice Tests |
| **Related blog** (new) | `/blog/nclex-seo-022-nclex-questions-about-pulmonary-embolism-practice-answers` | PE prioritization practice questions |
| **Related blog** (new) | `/blog/nclex-seo-039-nclex-practice-questions-stroke-nihssneuro-checks-simplified-for-rn` | stroke neuro-check questions |
| Existing — RN lesson hub | `/us/rn/nclex-rn/lessons` | NCLEX-RN lesson hub / Lessons |
| Existing — flashcards | `/flashcards` | Flashcards |
| Existing — question bank | `/question-bank` | question bank |
| Existing — related blog | `/blog/lab-trends-and-acute-kidney-injury` | lab trends in acute kidney injury |
| Existing — related blog | `/blog/pharmacology-without-memorization-chaos` | pharmacology study that sticks |

**Insertion points:** "If you trained outside" paragraph (RPN + NP), Summary paragraph (practice tests + new blog links).

---

### 2. `pharmacology-without-memorization-chaos`

**Before:** 8 unique links — no RPN lesson, no NP lesson, no `/practice-tests`, no flashcards, 2 related blog  
**After:** 17 unique links ✅

| Category | URL added | Anchor text |
|---|---|---|
| **RN lesson** (new) | `/us/rn/nclex-rn/lessons/anticoagulants-bleeding-risk` | NCLEX-RN anticoagulants lesson |
| **RN lesson** (new) | `/us/rn/nclex-rn/lessons/opioids-respiratory-depression` | opioid safety lesson |
| **RPN lesson** (new) | `/en/rpn/rex-pn/lessons/antibiotic-side-effect-reporting` | RPN antibiotic side-effect reporting lesson |
| **RPN lesson** (new) | `/en/rpn/rex-pn/lessons/insulin-administration-checks` | RPN insulin administration lesson |
| **NP lesson** (new) | `/us/np/fnp/lessons/bp26-usnp-pad-010-pharmacological_therapies-cardiovascular` | NP pharmacological therapies module |
| **Practice tests** (new) | `/practice-tests` | Practice Tests |
| **Flashcards** (new) | `/flashcards` | Flashcards |
| **Related blog** (new) | `/blog/nclex-seo-009-why-does-digoxin-toxicity-cause-vision-changes-and-bradycardia` | digoxin toxicity explained |
| **Related blog** (new) | `/blog/nclex-seo-030-nclex-questions-on-anticoagulation-teaching-warfarin-vs-doac-themes` | anticoagulation teaching questions |
| Existing — RN lesson hub | `/us/rn/nclex-rn/lessons` | NCLEX-RN lesson hub |
| Existing — question bank | `/question-bank` | question bank |
| Existing — related blog | `/blog/clinical-judgment-on-exam-day` | clinical judgment strategy |
| Existing — related blog | `/blog/lab-trends-and-acute-kidney-injury` | lab trends in acute kidney injury |

**Insertion points:** Intro paragraph (RPN + specific RN lessons), "If you are an international nurse" (RPN + NP), Summary (flashcards + practice tests + new blog links).

---

### 3. `lab-trends-and-acute-kidney-injury`

**Before:** 9 links — no RPN lesson, no NP lesson, no `/practice-tests`, 2 related blog  
**After:** 18 unique links ✅

| Category | URL added | Anchor text |
|---|---|---|
| **RN lesson** (new) | `/us/rn/nclex-rn/lessons/us-rn-potassium-imbalance` | NCLEX-RN potassium imbalances lesson |
| **RN lesson** (new) | `/us/rn/nclex-rn/lessons/us-rn-acid-base-advanced` | acid-base disorders lesson |
| **RPN lesson** (new) | `/en/rpn/rex-pn/lessons/ca-rpn-potassium-imbalance` | RPN potassium imbalance lesson |
| **RPN lesson** (new) | `/en/rpn/rex-pn/lessons/ca-rpn-acid-base-advanced` | RPN acid-base lesson |
| **NP lesson** (new) | `/us/np/fnp/lessons/bp26-usnp-pad-003-physiological_adaptation-renal-gu` | NP renal module |
| **NP lesson** (new) | `/us/np/fnp/lessons/bp26-usnp-pad-013-risk_reduction-renal-gu` | NP renal risk-reduction module |
| **Practice tests** (new) | `/practice-tests` | Practice Tests |
| **Related blog** (new) | `/blog/nclex-seo-012-why-does-acute-kidney-injury-raise-potassium-fast` | why AKI raises potassium fast |
| **Related blog** (new) | `/blog/nclex-seo-001-why-does-heart-failure-cause-pulmonary-edema-pathophysiology-for-nclex` | heart failure and pulmonary edema |
| Existing — RN lesson hub | `/us/rn/nclex-rn/lessons` | NCLEX-RN scope expectations |
| Existing — flashcards | `/flashcards` | Flashcards |
| Existing — question bank | `/question-bank` | Practice Questions |
| Existing — related blog | `/blog/pharmacology-without-memorization-chaos` | pharmacology study that sticks |
| Existing — related blog | `/blog/clinical-judgment-on-exam-day` | clinical judgment on exam day |

**Insertion points:** Intro paragraph (RN + RPN + NP lessons), "If you are an international nurse" (RPN + NP), Summary (practice tests + new blog links).

---

## Linking Map — Full DB Corpus (1,385 Articles)

The database corpus cannot be batch-edited without DB access. This section provides the canonical linking template for every article category so that bulk-update scripts and the AI generation pipeline can apply it consistently.

### Canonical URL reference table

| Pathway | Hub URL | Example lesson URL |
|---|---|---|
| US RN (NCLEX-RN) | `/us/rn/nclex-rn/lessons` | `/us/rn/nclex-rn/lessons/[slug]` |
| Canada RPN (REx-PN) | `/en/rpn/rex-pn/lessons` | `/en/rpn/rex-pn/lessons/[slug]` |
| US NP (FNP) | `/us/np/fnp/lessons` | `/us/np/fnp/lessons/[slug]` |
| US LPN (NCLEX-PN) | `/us/lpn/nclex-pn/lessons` | `/us/lpn/nclex-pn/lessons/[slug]` |
| Canada RN (NCLEX-RN) | `/en/rn/nclex-rn/lessons` | `/en/rn/nclex-rn/lessons/[slug]` |
| Flashcards hub | `/flashcards` | — |
| Practice tests | `/practice-tests` | — |
| Question bank | `/question-bank` | — |

### Per-category linking template

Each template lists: **(1) topic-specific lesson slugs per pathway → (2) practice/tools → (3) highest-value related-blog slugs from the corpus.** Use the most contextually relevant 1–2 lessons per pathway; do not force all five pathways into every paragraph.

---

#### Cardiovascular (18 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-heart-failure` — Heart Failure: Assessment & Management
- `/us/rn/nclex-rn/lessons/us-rn-myocardial-infarction` — Myocardial Infarction: Recognition
- `/us/rn/nclex-rn/lessons/us-rn-shock` — Shock
- `/en/rn/nclex-rn/lessons/ca-rn-heart-failure` — Heart Failure (Canada RN)

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/ca-rpn-heart-failure` — Heart failure (REx-PN)
- `/en/rpn/rex-pn/lessons/ca-rpn-shock` — Shock (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/fnp-overlay-heart-failure` — Heart failure — NP diagnosis & management
- `/us/np/fnp/lessons/fnp-adult-hypertension-intensification` — Adult hypertension: intensification

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs from corpus:**
- `nclex-seo-001-why-does-heart-failure-cause-pulmonary-edema-pathophysiology-for-nclex`
- `nclex-seo-004-why-does-left-sided-hf-show-crackles-before-peripheral-edema`
- `w2v2-np-cluster-shock-oxygenation-micro-1-cardiogenic-shock-vs-obstructive-shock-femoral-pulses-and-jvp-in-the-same-stem`
- `w2v2-np-cluster-troponin-ecg-edges-16-hs-ctn-rising-slowly-type-2-mi-vs-demand-ischemia-without-plaque-rupture`

---

#### Respiratory (37 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/respiratory-assessment-ngn` — Respiratory Assessment & Oxygenation
- `/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism` — Pulmonary Embolism: Acute Care
- `/us/rn/nclex-rn/lessons/us-rn-ards` — ARDS
- `/us/rn/nclex-rn/lessons/us-rn-copd` — COPD

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/ca-rpn-pulmonary-embolism` — Pulmonary embolism (REx-PN)
- `/en/rpn/rex-pn/lessons/ca-rpn-asthma` — Asthma (REx-PN)
- `/en/rpn/rex-pn/lessons/ca-rpn-copd` — COPD (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/bp26-usnp-pad-001-management_of_care-respiratory` — Respiratory: Review 2
- `/us/np/fnp/lessons/bp26-usnp-pad-011-physiological_adaptation-respiratory` — Respiratory: Review 12

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `nclex-seo-007-why-does-hyperventilation-lower-co2-on-the-abg-quick-nclex-logic`
- `nclex-seo-008-why-does-copd-sometimes-show-high-co2-while-satting-ok`
- `nclex-seo-022-nclex-questions-about-pulmonary-embolism-practice-answers`

---

#### Renal / Fluids & Electrolytes (18 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-acid-base-advanced` — Acid-Base Disorders
- `/us/rn/nclex-rn/lessons/us-rn-potassium-imbalance` — Potassium Imbalances
- `/us/rn/nclex-rn/lessons/us-rn-acute-kidney-injury` — Acute Kidney Injury
- `/en/rn/nclex-rn/lessons/fluid-balance-acute-care` — Fluid balance & IV therapy judgment

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/ca-rpn-potassium-imbalance` — Potassium imbalance (REx-PN)
- `/en/rpn/rex-pn/lessons/ca-rpn-acid-base-advanced` — Acid-base disorders (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/bp26-usnp-pad-003-physiological_adaptation-renal-gu` — Renal: Review 4
- `/us/np/fnp/lessons/bp26-usnp-pad-013-risk_reduction-renal-gu` — Renal: Review 14
- `/us/np/fnp/lessons/bp26-usnp-pad-006-health_promotion_maintenance-fluids-electrolytes` — Fluids & electrolytes: Review 7

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `nclex-seo-012-why-does-acute-kidney-injury-raise-potassium-fast`
- `w2v2-rn-cluster-renal-micro-33-why-urine-sodium-can-be-fooled-by-diuretics-in-prerenal-azotemia`
- `w2v2-rn-cluster-renal-micro-34-contrast-nephropathy-timeline-when-creatinine-peaks-vs-when-to-panic`
- `lab-trends-and-acute-kidney-injury` ← static post

---

#### Endocrine (26 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-insulin-hypoglycemia` — Insulin & Hypoglycemia
- `/us/rn/nclex-rn/lessons/dka-vs-hhs-priorities-hy` — DKA vs HHS
- `/us/rn/nclex-rn/lessons/thyroid-storm-myxedema-clues` — Thyroid Storm & Myxedema

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/ca-rpn-insulin-hypoglycemia` — Insulin & hypoglycemia (REx-PN)
- `/en/rpn/rex-pn/lessons/fingerstick-hypoglycemia-response` — Fingerstick & Hypoglycemia Response

**NP lessons:**
- `/us/np/fnp/lessons/bp26-usnp-pad-004-psychosocial_integrity-endocrine` — Endocrine: Review 5
- `/us/np/fnp/lessons/bp26-usnp-pad-014-health_promotion_maintenance-endocrine` — Endocrine: Review 15

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `nclex-seo-002-why-does-k-rise-in-dka-before-insulin-nclex-trap-explained`
- `nclex-seo-003-why-does-siadh-cause-hyponatremia-but-wet-on-exam-questions`
- `nclex-seo-015-why-does-insulin-drop-k-even-when-youre-treating-hyperglycemia`

---

#### Pharmacology (19 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/anticoagulants-bleeding-risk` — Anticoagulants: Bleeding Risk
- `/us/rn/nclex-rn/lessons/antibiotic-classes-allergies-hy` — Antibiotics: Classes & Allergies
- `/us/rn/nclex-rn/lessons/opioids-respiratory-depression` — Opioids: Respiratory Depression
- `/us/rn/nclex-rn/lessons/diuretics-electrolyte-monitoring` — Diuretics: Electrolyte Monitoring

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/antibiotic-side-effect-reporting` — Antibiotic Side Effect Reporting
- `/en/rpn/rex-pn/lessons/insulin-administration-checks` — Insulin Administration Checks
- `/en/rpn/rex-pn/lessons/oral-hypoglycemics` — Oral Hypoglycemics

**NP lessons:**
- `/us/np/fnp/lessons/bp26-usnp-pad-010-pharmacological_therapies-cardiovascular` — Pharmacological therapies: Cardiovascular

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `nclex-seo-009-why-does-digoxin-toxicity-cause-vision-changes-and-bradycardia`
- `nclex-seo-030-nclex-questions-on-anticoagulation-teaching-warfarin-vs-doac-themes`
- `pharmacology-without-memorization-chaos` ← static post

---

#### Neurologic / Neuro (24 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/stroke-assessment-tpa-window` — Stroke
- `/us/rn/nclex-rn/lessons/seizure-precautions-rescue-meds` — Seizures
- `/us/rn/nclex-rn/lessons/us-rn-increased-icp` — Increased ICP

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/stroke-sequela-mobility-assist` — Stroke Sequela & Mobility Assist
- `/en/rpn/rex-pn/lessons/seizure-observation` — Seizure Observation

**NP lessons:**
- `/us/np/fnp/lessons/fnp-geriatric-falls-syncope` — Geriatric falls and syncope (FNP)
- `/us/np/fnp/lessons/fnp-adolescent-mental-health-screening` — Adolescent mental health screening (FNP)

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `nclex-seo-010-why-does-mannitol-lower-icp-but-risk-fluidelectrolyte-chaos`
- `nclex-seo-039-nclex-practice-questions-stroke-nihssneuro-checks-simplified-for-rn`
- `nclex-seo-050-delirium-vs-dementia-quick-comparison-for-clinical-judgment-questions`

---

#### Med-Surg / Sepsis / Critical Care (22 + 42 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-sepsis` — Sepsis
- `/us/rn/nclex-rn/lessons/us-rn-prioritization-abcs` — Prioritization, ABCs & Safety
- `/us/rn/nclex-rn/lessons/us-rn-delegation` — Delegation & Assignment

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/ca-rpn-sepsis` — Sepsis (REx-PN)
- `/en/rpn/rex-pn/lessons/ca-rpn-prioritization-abcs` — Prioritization (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/fnp-differential-primary-care` — Differential reasoning in primary care

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `nclex-seo-006-why-does-fever-tachycardia-happen-in-sepsis-not-just-anxiety`
- `nclex-seo-022-nclex-questions-about-pulmonary-embolism-practice-answers`
- `clinical-judgment-on-exam-day` ← static post

---

#### OB / Maternity (20 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-preeclampsia` — Preeclampsia
- `/us/rn/nclex-rn/lessons/us-rn-postpartum-hemorrhage` — Postpartum Hemorrhage

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/bp26-carpn-x018-preeclampsia-symptom-triad` — Preeclampsia symptom triad (REx-PN)
- `/en/rpn/rex-pn/lessons/bp26-carpn-x019-newborn-thermoregulation` — Newborn thermoregulation (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/fnp-womens-prenatal-anemia-workup` — Women's prenatal anemia workup (FNP)

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

---

#### New-Grad / Professional Practice (85 General + 32 Professional practice + 35 Ethics corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-delegation` — Delegation & Assignment
- `/us/rn/nclex-rn/lessons/us-rn-prioritization-abcs` — Prioritization, ABCs & Safety
- `/en/rn/nclex-rn/lessons/ca-rn-general-nursing-clinical` — Clinical Judgment (Canada RN)

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/pn-scope-safety-basics` — PN scope & safety foundations (REx-PN)
- `/en/rpn/rex-pn/lessons/ca-rpn-delegation` — Delegation & assignment (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/fnp-differential-primary-care` — Differential reasoning in primary care

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

**Related blog slugs:**
- `clinical-judgment-on-exam-day` ← static post
- `nclex-seo-039-nclex-practice-questions-stroke-nihssneuro-checks-simplified-for-rn`

---

#### Oncology / Hematology (18 corpus articles)

**RN lessons:**
- `/us/rn/nclex-rn/lessons/us-rn-anticoagulants` — Anticoagulants
- `/us/rn/nclex-rn/lessons/anemia-types-transfusion-thresholds` — Anemia & Transfusion Thresholds
- `/us/rn/nclex-rn/lessons/neutropenic-precautions-priority` — Neutropenic Precautions

**RPN lessons:**
- `/en/rpn/rex-pn/lessons/ca-rpn-anticoagulants` — Anticoagulants (REx-PN)

**NP lessons:**
- `/us/np/fnp/lessons/fnp-womens-prenatal-anemia-workup` — Anemia workup (FNP)

**Practice/tools:** `/practice-tests` · `/flashcards` · `/question-bank`

---

## Automated Linking: Implementation Notes

### For the AI blog generation pipeline

Each `BlogArticleGenerationJob` should include these fields in the article spec so the model can inject links at generation time:

```json
{
  "internalLinks": {
    "rnLesson": "/us/rn/nclex-rn/lessons/[most-relevant-slug]",
    "rpnLesson": "/en/rpn/rex-pn/lessons/[most-relevant-slug]",
    "npLesson":  "/us/np/fnp/lessons/[most-relevant-slug]",
    "flashcards": "/flashcards",
    "practiceTests": "/practice-tests",
    "questionBank": "/question-bank",
    "relatedBlog": ["/blog/slug-1", "/blog/slug-2"]
  }
}
```

The `[most-relevant-slug]` should be resolved from the catalog at generation time using the article's `category` + `bodySystem` fields.

### For the bulk-update script

Articles already published to the DB that are missing links can be patched by:

1. Querying `BlogPost` where `bodyHtml NOT LIKE '%/rpn/rex-pn/lessons%' AND postStatus = 'PUBLISHED'` to find RPN-link gaps
2. Appending a standardized "Further study" footer block to `bodyHtml` with the canonical set of links for the article's category
3. Updating `updatedAt` and leaving `slug`, `publishAt`, `postStatus` unchanged

The footer block template per category is in the "Per-category linking template" section above.

---

## Summary

| Article | Links before | Links after | RPN ✓ | NP ✓ | Practice tests ✓ | Flashcards ✓ | Related blog ✓ |
|---|---|---|---|---|---|---|---|
| `clinical-judgment-on-exam-day` | 9 | **14** | ✅ | ✅ | ✅ | ✅ | ✅ |
| `pharmacology-without-memorization-chaos` | 8 | **17** | ✅ | ✅ | ✅ | ✅ | ✅ |
| `lab-trends-and-acute-kidney-injury` | 9 | **18** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **DB corpus (1,385 articles)** | varies | map provided | — | — | — | — | — |

All 3 static articles modified in place at [src/content/blog-static-posts.ts](nursenest-core/src/content/blog-static-posts.ts). DB corpus articles require the bulk-update script or AI pipeline integration using the per-category map above.
