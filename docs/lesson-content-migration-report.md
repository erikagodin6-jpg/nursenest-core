# Lesson Content Migration Report

Generated: 2026-05-01T06:29:33.092938
Mode: DRY RUN

## Summary

| Metric | Count |
|--------|-------|
| Total lessons assessed | 265 |
| Already adequate (≥1200w) | 200 |
| Enriched from legacy content | 28 |
| Enriched with structural stubs | 37 |
| Total enriched | 65 |

## Source Files

Legacy content mined from `client/src/data/lessons/` — 450+ TypeScript files
containing 3818 lessons with clinical-grade pathophysiology content.

## By Tier

| Tier | Enriched | Already Adequate | Stub Only |
|------|----------|-----------------|-----------|
| rn | 28 | 200 | 37 |

## Matched Lessons (Legacy → Catalog)

Total matched: 28

| Catalog Slug | Title | Legacy Key | Score | Before | After |
|-------------|-------|-----------|-------|--------|-------|
| `acute-coronary-syndrome-nclex-rn` | Acute Coronary Syndrome | `rn-acute-coronary-syndrome` | 1.0 | 1089w | 959w |
| `cardiac-tamponade-nclex-rn` | Cardiac Tamponade | `cardiac-tamponade-rpn` | 1.0 | 1018w | 898w |
| `hypertensive-encephalopathy-nclex-rn` | Hypertensive Encephalopathy | `rn-hypertensive-encephalopathy` | 1.0 | 932w | 932w |
| `acute-pancreatitis-nursing-care` | Acute Pancreatitis | `pancreatitis-management-rpn` | 1.0 | 950w | 950w |
| `peritoneal-dialysis-complications` | Peritoneal Dialysis Complications | `peritoneal-dialysis-complications` | 1.0 | 1077w | 1077w |
| `rh-incompatibility-basics` | Rh Incompatibility | `rh-incompatibility-rpn` | 1.0 | 1137w | 1137w |
| `acute-coronary-syndrome-nclex-rn` | Acute Coronary Syndrome | `rn-acute-coronary-syndrome` | 1.0 | 959w | 959w |
| `cardiac-tamponade-nclex-rn` | Cardiac Tamponade | `cardiac-tamponade-rpn` | 1.0 | 898w | 898w |
| `hypertensive-encephalopathy-nclex-rn` | Hypertensive Encephalopathy | `rn-hypertensive-encephalopathy` | 1.0 | 932w | 932w |
| `pressure-injury-staging` | Pressure Injuries | `pressure-injury-staging-rpn` | 0.75 | 966w | 966w |
| `shock-recognition-fluids` | Shock: Recognition & Fluids | `shock-types-recognition-rpn` | 0.667 | 788w | 788w |
| `dvt-pe-nursing-priorities` | DVT & Pulmonary Embolism: Priorities | `pulmonary-embolism-rpn` | 0.667 | 1025w | 1025w |
| `copd-exacerbation-oxygen` | COPD: Exacerbation & Oxygen | `copd-exacerbation-management-np` | 0.667 | 851w | 851w |
| `wound-infection-vs-colonization` | Wound Infection | `wound-infection-management-rpn` | 0.667 | 911w | 911w |
| `alcohol-withdrawal-ciwa` | Alcohol Withdrawal | `alcohol-withdrawal-rpn` | 0.667 | 1000w | 1000w |
| `sepsis-early-recognition-hy` | Sepsis: Early Recognition | `neonatal-sepsis-early-onset-rn` | 0.6 | 950w | 950w |
| `defibrillation-vs-synchronized-cardioversion-nclex-rn` | Cardioversion vs Defibrillation | `cardioversion-defib` | 0.5 | 924w | 794w |
| `phlebostatic-axis-nclex-rn` | Hemodynamic Monitoring: Phlebostatic Axi | `hemodynamic-monitoring-np` | 0.5 | 778w | 778w |
| `pleural-effusion-chest-tubes` | Pleural Effusion & Chest Tubes | `pleural-effusion-management-np-np` | 0.5 | 878w | 878w |
| `bowel-obstruction-vs-paralytic-ileus` | Bowel Obstruction vs Ileus | `bowel-obstruction-rpn` | 0.5 | 847w | 847w |
| `thyroid-storm-myxedema-clues` | Thyroid Storm & Myxedema | `thyroid-storm-rpn` | 0.5 | 1042w | 1042w |
| `kidney-stones-strain-management` | Kidney Stones & Strain Management | `kidney-stones-nephrolithiasis-rpn` | 0.5 | 1098w | 1098w |
| `assignment-vs-delegation` | Assignment vs Delegation | `delegation-license-rn` | 0.5 | 1004w | 1004w |
| `defibrillation-vs-synchronized-cardioversion-nclex-rn` | Cardioversion vs Defibrillation | `cardioversion-defib` | 0.5 | 794w | 794w |
| `phlebostatic-axis-nclex-rn` | Hemodynamic Monitoring: Phlebostatic Axi | `hemodynamic-monitoring-np` | 0.5 | 778w | 778w |
| `ra-flare-immune-modulators` | Rheumatoid Arthritis | `rheumatoid-arthritis-rpn` | 0.4 | 1006w | 1006w |
| `legal-nurse-practice-act` | Nurse Practice Act | `np-advanced-legal-and-regulatory-practice-np` | 0.4 | 865w | 865w |
| `restraint-alternatives-policy` | Restraints | `restraint-free-care` | 0.4 | 1122w | 1122w |

## Unmatched Lessons (Stub Only — Manual Review Required)

Total unmatched: 37

These lessons received structural scaffolding but no legacy clinical content.
Priority for AI regeneration via `npm run upgrade:catalog-lessons`.

| Slug | Title | Pathway | Words |
|------|-------|---------|-------|
| `tpn-line-care-basics` | TPN Line Care | ca-rn-nclex-rn | 1027w |
| `cabg-and-postoperative-cabg-complications-nclex-rn` | CABG | ca-rn-nclex-rn | 1170w |
| `respiratory-assessment-ngn` | Respiratory Assessment & Oxygenation | us-rn-nclex-rn | 988w |
| `endocarditis-blood-cultures` | Endocarditis | us-rn-nclex-rn | 1055w |
| `pericarditis-ecg-clues` | Pericarditis: ECG Clues | us-rn-nclex-rn | 997w |
| `pneumonia-oxygenation` | Pneumonia: Oxygenation & Monitoring | us-rn-nclex-rn | 960w |
| `tb-isolation-compliance` | TB Isolation | us-rn-nclex-rn | 664w |
| `antibiotic-classes-allergies-hy` | Antibiotics: Classes & Allergies | us-rn-nclex-rn | 672w |
| `opioids-respiratory-depression` | Opioids: Respiratory Depression | us-rn-nclex-rn | 668w |
| `cardiac-glycosides-toxicity` | Cardiac Glycosides | us-rn-nclex-rn | 664w |
| `diuretics-electrolyte-shifts` | Diuretics | us-rn-nclex-rn | 660w |
| `antihypertensive-combos` | Antihypertensives | us-rn-nclex-rn | 654w |
| `chemo-safe-handling-extravasation` | Chemotherapy Safety | us-rn-nclex-rn | 667w |
| `hypo-vs-hyperkalemia-hy` | Potassium Emergencies: Hypo- vs Hyperkal | us-rn-nclex-rn | 677w |
| `magnesium-arrhythmia-risk` | Magnesium Imbalances | us-rn-nclex-rn | 668w |
| `phosphate-shifts-in-renal` | Phosphate Shifts | us-rn-nclex-rn | 668w |
| `ostomy-skin-protection` | Ostomy Care | us-rn-nclex-rn | 664w |
| `stroke-assessment-tpa-window` | Stroke | us-rn-nclex-rn | 663w |
| `addisonian-crisis` | Addisonian Crisis | us-rn-nclex-rn | 978w |
| `diabetes-self-management-teaching` | Diabetes Self-Management | us-rn-nclex-rn | 661w |
| `siadh-vs-di-basics` | SIADH vs DI | us-rn-nclex-rn | 668w |
| `uti-vs-pyelonephritis` | UTI vs Pyelonephritis | us-rn-nclex-rn | 669w |
| `indwelling-catheter-risks` | Indwelling Catheter Risks | us-rn-nclex-rn | 669w |
| `anemia-types-transfusion-thresholds` | Anemia & Transfusion Thresholds | us-rn-nclex-rn | 1007w |
| `immobility-dvt-prophylaxis` | Immobility & DVT Prevention | us-rn-nclex-rn | 669w |
| `hiv-confidentiality-pep-basics` | HIV Confidentiality & PEP | us-rn-nclex-rn | 675w |
| `burn-depth-fluid-resuscitation-basics` | Burns | us-rn-nclex-rn | 941w |
| `severe-dermatitis-skin-care` | Severe Dermatitis | us-rn-nclex-rn | 661w |
| `late-decelerations-fhr` | FHR: Late Decelerations | us-rn-nclex-rn | 667w |
| `newborn-thermoregulation-feeding` | Newborn Thermoregulation & Feeding | us-rn-nclex-rn | 671w |
| `immunization-schedule-essentials` | Immunization Schedule | us-rn-nclex-rn | 660w |
| `non-accidental-trauma-suspicion` | Non-Accidental Trauma Suspicion | us-rn-nclex-rn | 664w |
| `ethical-distress-advocacy` | Ethical Distress & Advocacy | us-rn-nclex-rn | 674w |
| `falls-hourly-rounding` | Falls & Rounding | us-rn-nclex-rn | 672w |
| `sharp-safety-exposure` | Exposure & Sharps Safety | us-rn-nclex-rn | 676w |
| `tpn-line-care-basics` | TPN Line Care | us-rn-nclex-rn | 668w |
| `cabg-and-postoperative-cabg-complications-nclex-rn` | CABG | us-rn-nclex-rn | 1064w |

## Next Steps

1. **Verify enriched lessons** — run `npm run verify:lesson-content-depth`
2. **AI upgrade remaining stubs** — run `npm run upgrade:catalog-lessons` for unmatched lessons
3. **Manual review** — inspect high-value lessons (Heart Failure, Sepsis, ACS) for clinical accuracy
4. **Repeat for NP/Allied** — run with `--tier np` and `--tier allied` flags

## Mapping Strategy

Used Jaccard similarity on normalized title + slug word sets (stop words removed).
Match threshold: 0.35 (score range 0–1, 1 = perfect match).
Legacy key patterns: `rn-*`, `rpn-*`, `np-*`, disease-name keys.
Catalog slug patterns: `{condition}-{qualifier}`, topic-specific.
