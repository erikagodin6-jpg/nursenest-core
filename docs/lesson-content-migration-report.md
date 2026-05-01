# Lesson Content Migration Report

Generated: 2026-05-01T06:49:07.214013
Mode: DRY RUN

## Summary

| Metric | Count |
|--------|-------|
| Total lessons assessed | 198 |
| Already adequate (≥1200w) | 45 |
| Enriched from legacy content | 21 |
| Enriched with structural stubs | 132 |
| Total enriched | 153 |

## Source Files

Legacy content mined from `client/src/data/lessons/` — 450+ TypeScript files
containing 3818 lessons with clinical-grade pathophysiology content.

## By Tier

| Tier | Enriched | Already Adequate | Stub Only |
|------|----------|-----------------|-----------|
| rpn | 21 | 45 | 132 |

## Matched Lessons (Legacy → Catalog)

Total matched: 21

| Catalog Slug | Title | Legacy Key | Score | Before | After |
|-------------|-------|-----------|-------|--------|-------|
| `ca-rpn-pulmonary-embolism` | Pulmonary embolism (REx-PN / PN, Canada) | `pulmonary-embolism-rpn` | 0.667 | 1031w | 1031w |
| `lpn-scope-delegation-priority` | PN scope, delegation & prioritization | `rpn-delegation-and-scope-rpn` | 0.667 | 1119w | 1119w |
| `us-pn-pulmonary-embolism` | Pulmonary embolism — PN scope | `pulmonary-embolism-rpn` | 0.667 | 1025w | 1025w |
| `us-pn-delegation` | Delegation & assignment — PN scope | `rpn-delegation-and-scope-rpn` | 0.667 | 1125w | 1125w |
| `c-diff-contact-precautions` | C. diff Contact Precautions | `contact-precautions-rpn` | 0.667 | 948w | 948w |
| `ca-rpn-asthma` | Asthma (REx-PN / PN, Canada) | `asthma-basics-rpn` | 0.5 | 852w | 852w |
| `ca-rpn-pneumonia` | Pneumonia (REx-PN / PN, Canada) | `pneumonia-basics-rpn` | 0.5 | 987w | 987w |
| `ca-rpn-sepsis` | Sepsis (REx-PN / PN, Canada) | `sepsis-basics-rpn` | 0.5 | 1069w | 1069w |
| `ca-rpn-wound-care` | Wound care (REx-PN / PN, Canada) | `wound-care-and-management-rpn` | 0.5 | 1133w | 1133w |
| `c-diff-contact-precautions` | C. diff Contact Precautions (REx-PN / PN | `contact-precautions-rpn` | 0.5 | 972w | 972w |
| `us-pn-asthma` | Asthma — PN scope | `asthma-basics-rpn` | 0.5 | 846w | 846w |
| `us-pn-pneumonia` | Pneumonia — PN scope | `pneumonia-basics-rpn` | 0.5 | 981w | 981w |
| `us-pn-sepsis` | Sepsis — PN scope | `sepsis-basics-rpn` | 0.5 | 1063w | 1063w |
| `us-pn-wound-care` | Wound care — PN scope | `wound-care-and-management-rpn` | 0.5 | 1127w | 1127w |
| `copd-home-care` | COPD Home Care | `home-care-nursing-rpn` | 0.5 | 1103w | 1103w |
| `hypokalemia-symptoms` | Hypokalemia Symptoms | `rn-hypokalemia` | 0.5 | 837w | 837w |
| `bp26-uslpn-rr-pressure-injury` | Pressure injury prevention bundle — NCLE | `pressure-injury-prevention-staging-rn` | 0.429 | 1057w | 1057w |
| `pn-scope-safety-basics` | PN scope & safety foundations (REx-PN, C | `cultural-safety-rpn` | 0.4 | 1197w | 1197w |
| `ca-rpn-delegation` | Delegation & assignment (REx-PN / PN, Ca | `delegation-license-rn` | 0.4 | 1028w | 1028w |
| `bp26-carpn-proc-cvc-dressing` | Central line dressing & CLABSI preventio | `central-line-care-rn` | 0.4 | 1067w | 1067w |
| `ppe-transmission-basics` | PPE & Transmission Basics | `infection-control-ppe-rn` | 0.4 | 1055w | 1055w |

## Unmatched Lessons (Stub Only — Manual Review Required)

Total unmatched: 132

These lessons received structural scaffolding but no legacy clinical content.
Priority for AI regeneration via `npm run upgrade:catalog-lessons`.

| Slug | Title | Pathway | Words |
|------|-------|---------|-------|
| `ca-rpn-angina` | Angina (REx-PN / PN, Canada) | ca-rpn-rex-pn | 673w |
| `ca-rpn-dysrhythmias` | Dysrhythmias (REx-PN / PN, Canada) | ca-rpn-rex-pn | 673w |
| `ca-rpn-potassium-imbalance` | Potassium imbalance (REx-PN / PN, Canada | ca-rpn-rex-pn | 678w |
| `ca-rpn-insulin-hypoglycemia` | Insulin & hypoglycemia (REx-PN / PN, Can | ca-rpn-rex-pn | 683w |
| `ca-rpn-anticoagulants` | Anticoagulants (REx-PN / PN, Canada) | ca-rpn-rex-pn | 673w |
| `ca-rpn-antibiotics` | Antibiotics (REx-PN / PN, Canada) | ca-rpn-rex-pn | 673w |
| `ca-rpn-general-nursing-clinical` | General nursing clinical judgment (REx-P | ca-rpn-rex-pn | 703w |
| `documentation-do-nots` | Documentation Do-Nots (REx-PN / PN, Cana | ca-rpn-rex-pn | 665w |
| `hypertension-teaching` | Hypertension Teaching (REx-PN / PN, Cana | ca-rpn-rex-pn | 662w |
| `edema-daily-weights` | Edema & Daily Weights (REx-PN / PN, Cana | ca-rpn-rex-pn | 676w |
| `inhaler-technique-teaching` | Inhaler Technique Teaching (REx-PN / PN, | ca-rpn-rex-pn | 669w |
| `copd-home-care` | COPD Home Care (REx-PN / PN, Canada) | ca-rpn-rex-pn | 669w |
| `insulin-administration-checks` | Insulin Administration Checks (REx-PN /  | ca-rpn-rex-pn | 669w |
| `antibiotic-side-effect-reporting` | Antibiotic Side Effect Reporting (REx-PN | ca-rpn-rex-pn | 676w |
| `i-o-fluid-restriction-teaching` | I&O & Fluid Restriction Teaching (REx-PN | ca-rpn-rex-pn | 687w |
| `hypokalemia-symptoms` | Hypokalemia Symptoms (REx-PN / PN, Canad | ca-rpn-rex-pn | 666w |
| `daily-weights-pattern` | Daily Weights Pattern (REx-PN / PN, Cana | ca-rpn-rex-pn | 673w |
| `npo-post-op-diet-progression` | NPO & Post-Op Diet Progression (REx-PN / | ca-rpn-rex-pn | 682w |
| `stool-assessment-report` | Stool Assessment & Report (REx-PN / PN,  | ca-rpn-rex-pn | 675w |
| `stroke-sequela-mobility-assist` | Stroke Sequela & Mobility Assist (REx-PN | ca-rpn-rex-pn | 682w |
| `seizure-observation` | Seizure Observation (REx-PN / PN, Canada | ca-rpn-rex-pn | 661w |
| `fingerstick-hypoglycemia-response` | Fingerstick & Hypoglycemia Response (REx | ca-rpn-rex-pn | 675w |
| `foot-inspection-teaching` | Foot Inspection Teaching (REx-PN / PN, C | ca-rpn-rex-pn | 668w |
| `dialysis-diet-teaching` | Dialysis Diet Teaching (REx-PN / PN, Can | ca-rpn-rex-pn | 672w |
| `postpartum-fundus-lochia` | Postpartum Fundus & Lochia (REx-PN / PN, | ca-rpn-rex-pn | 675w |
| `newborn-safety-bath` | Newborn Safety & Bath (REx-PN / PN, Cana | ca-rpn-rex-pn | 675w |
| `immunization-consent` | Immunization Consent (REx-PN / PN, Canad | ca-rpn-rex-pn | 661w |
| `ppe-transmission-basics` | PPE & Transmission Basics (REx-PN / PN,  | ca-rpn-rex-pn | 677w |
| `suicide-precautions-observation` | Suicide Precautions Observation (REx-PN  | ca-rpn-rex-pn | 670w |
| `behavioral-escalation-reporting` | Behavioral Escalation Reporting (REx-PN  | ca-rpn-rex-pn | 670w |
| `falls-risk-side-rails-policy` | Falls Risk & Side Rails Policy (REx-PN / | ca-rpn-rex-pn | 689w |
| `restraint-monitoring-requirements` | Restraint Monitoring Requirements (REx-P | ca-rpn-rex-pn | 668w |
| `bp26-carpn-pa-htn-crisis` | Hypertensive urgency vs emergency cues | ca-rpn-rex-pn | 867w |
| `bp26-carpn-pa-afib-rate` | Atrial fibrillation: rate vs rhythm focu | ca-rpn-rex-pn | 872w |
| `bp26-carpn-lab-abg-interpret` | ABG basics for nursing decisions | ca-rpn-rex-pn | 867w |
| `bp26-carpn-lab-cultures-timing` | Blood cultures: timing with antibiotics | ca-rpn-rex-pn | 869w |
| `bp26-carpn-proc-ngt-placement-care` | NG tube care & placement checks | ca-rpn-rex-pn | 871w |
| `bp26-carpn-mo-legal-scope` | Scope of practice & unsafe orders | ca-rpn-rex-pn | 874w |
| `bp26-carpn-sf-fire-evac-chair` | Fire safety & evacuation roles | ca-rpn-rex-pn | 869w |
| `bp26-carpn-psy-dementia-wandering` | Dementia: wandering & safety | ca-rpn-rex-pn | 868w |
| `bp26-carpn-pa-dialysis-access` | Dialysis access complications to report | ca-rpn-rex-pn | 867w |
| `bp26-carpn-ph-high-alert-rounds` | High-alert medications: double checks | ca-rpn-rex-pn | 862w |
| `bp26-carpn-pa-burn-fluid-first` | Burns: first-hour priorities | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x001-stemi-vs-nstemi-first-nursing-moves` | STEMI vs NSTEMI: first nursing moves | ca-rpn-rex-pn | 884w |
| `bp26-carpn-x002-angina-vs-infarction-data-that-changes-r` | Angina vs infarction: data that changes  | ca-rpn-rex-pn | 892w |
| `bp26-carpn-x003-heart-failure-discharge-teaching` | Heart failure discharge teaching | ca-rpn-rex-pn | 868w |
| `bp26-carpn-x004-pacemaker-site-monitoring` | Pacemaker site monitoring | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x005-cardiac-catheterization-post-procedure-c` | Cardiac catheterization post-procedure c | ca-rpn-rex-pn | 868w |
| `bp26-carpn-x006-pleural-effusion-breath-sounds-positioni` | Pleural effusion: breath sounds & positi | ca-rpn-rex-pn | 884w |
| `bp26-carpn-x007-home-oxygen-teaching` | Home oxygen teaching | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x008-pneumothorax-signs` | Pneumothorax signs | ca-rpn-rex-pn | 852w |
| `bp26-carpn-x009-calcium-imbalance-cues` | Calcium imbalance cues | ca-rpn-rex-pn | 866w |
| `bp26-carpn-x010-magnesium-monitoring-on-replacement` | Magnesium monitoring on replacement | ca-rpn-rex-pn | 874w |
| `bp26-carpn-x011-fluid-restriction-teaching` | Fluid restriction teaching | ca-rpn-rex-pn | 866w |
| `bp26-carpn-x012-beta-blocker-hold-peri-op-considerations` | Beta-blocker hold peri-op considerations | ca-rpn-rex-pn | 868w |
| `bp26-carpn-x013-diuretic-teaching-orthostasis` | Diuretic teaching & orthostasis | ca-rpn-rex-pn | 868w |
| `bp26-carpn-x014-steroid-taper-teaching` | Steroid taper teaching | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x016-substance-withdrawal-monitoring` | Substance withdrawal monitoring | ca-rpn-rex-pn | 863w |
| `bp26-carpn-x017-trauma-informed-care-basics` | Trauma-informed care basics | ca-rpn-rex-pn | 863w |
| `bp26-carpn-x018-preeclampsia-symptom-triad` | Preeclampsia symptom triad | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x019-newborn-thermoregulation` | Newborn thermoregulation | ca-rpn-rex-pn | 852w |
| `bp26-carpn-x020-breastfeeding-latch-troubleshooting` | Breastfeeding latch troubleshooting | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x021-pediatric-dosing-verification-mindset` | Pediatric dosing verification mindset | ca-rpn-rex-pn | 868w |
| `bp26-carpn-x022-airway-obstruction-in-toddlers` | Airway obstruction in toddlers | ca-rpn-rex-pn | 868w |
| `bp26-carpn-x023-immunization-catch-up-planning` | Immunization catch-up planning | ca-rpn-rex-pn | 860w |
| `bp26-carpn-x024-wrong-patient-near-miss-reporting` | Wrong-patient near-miss reporting | ca-rpn-rex-pn | 865w |
| `bp26-carpn-x025-barcode-scanning-discipline` | Barcode scanning discipline | ca-rpn-rex-pn | 865w |
| `bp26-carpn-x026-line-identification-labeling` | Line identification & labeling | ca-rpn-rex-pn | 873w |
| `us-pn-angina` | Angina — PN scope | us-lpn-nclex-pn | 605w |
| `us-pn-dysrhythmias` | Dysrhythmias — PN scope | us-lpn-nclex-pn | 605w |
| `us-pn-potassium-imbalance` | Potassium imbalance — PN scope | us-lpn-nclex-pn | 610w |
| `us-pn-insulin-hypoglycemia` | Insulin & hypoglycemia — PN scope | us-lpn-nclex-pn | 615w |
| `us-pn-anticoagulants` | Anticoagulants — PN scope | us-lpn-nclex-pn | 605w |
| `us-pn-antibiotics` | Antibiotics — PN scope | us-lpn-nclex-pn | 605w |
| `us-pn-general-nursing-clinical` | General nursing clinical judgment — PN s | us-lpn-nclex-pn | 620w |
| `documentation-do-nots` | Documentation Do-Nots | us-lpn-nclex-pn | 651w |
| `edema-daily-weights` | Edema & Daily Weights | us-lpn-nclex-pn | 662w |
| `inhaler-technique-teaching` | Inhaler Technique Teaching | us-lpn-nclex-pn | 655w |
| `insulin-administration-checks` | Insulin Administration Checks | us-lpn-nclex-pn | 655w |
| `antibiotic-side-effect-reporting` | Antibiotic Side Effect Reporting | us-lpn-nclex-pn | 662w |
| ... | *52 more* | ... | ... |

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
