# Hint Quality Audit

Generated: 2026-06-01T00:30:05.689Z

Static repository-authored banks were audited. DB-backed live exam_questions pools were not queried by this script.

## Summary

| Metric | Value |
| --- | ---: |
| Total questions | 230 |
| Total hints | 504 |
| Average hint score | 2.77 |
| Failed hints | 136 |
| Answer-leaking hints | 43 |
| Generic hints | 17 |
| Missing hints | 93 |
| Unsafe hints | 0 |
| Pathway-specific hint rate | 54.8% |

## Pathway Scores

| Pathway | Total Hints | Average Score | Failed | Missing | Answer-Leaking | Generic | Pathway-Specific Rate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Pre-Nursing | 80 | 1 | 80 | 80 | 0 | 0 | 0% |
| Allied Health - Pharmacy Technician | 13 | 1 | 13 | 13 | 0 | 0 | 0% |
| RN | 108 | 2.31 | 27 | 0 | 27 | 3 | 22.2% |
| RN/RPN-PN authored tier 1 | 78 | 2.55 | 16 | 0 | 16 | 12 | 78.2% |
| CNPLE/RPN-PN | 225 | 3.8 | 0 | 0 | 0 | 2 | 84.9% |

## Failed Or Review-Required Hints

| Question ID | Pathway | Topic | Score | Issues |
| --- | --- | --- | ---: | --- |
| nclex-tier1-falls-call-light | RN/RPN-PN authored tier 1 | Falls prevention | 1 | answer_wording_leakage |
| nclex-tier1-copd-positioning | RN/RPN-PN authored tier 1 | COPD | 2 | generic_hint |
| nclex-tier1-chf-daily-weight | RN/RPN-PN authored tier 1 | Heart failure | 3 | missing_pathway_specificity |
| nclex-tier1-chf-daily-weight | RN/RPN-PN authored tier 1 | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier1-chf-daily-weight | RN/RPN-PN authored tier 1 | Heart failure | 3 | missing_pathway_specificity |
| nclex-tier1-pneumonia-cough-deep-breathe | RN/RPN-PN authored tier 1 | Pneumonia | 2 | stem_disconnected |
| nclex-tier1-pneumonia-cough-deep-breathe | RN/RPN-PN authored tier 1 | Pneumonia | 1 | answer_wording_leakage, stem_disconnected |
| nclex-tier1-postop-incentive-spirometer | RN/RPN-PN authored tier 1 | Postoperative care | 2 | stem_disconnected |
| nclex-tier1-postop-incentive-spirometer | RN/RPN-PN authored tier 1 | Postoperative care | 2 | stem_disconnected |
| nclex-tier1-standard-precautions-blood | RN/RPN-PN authored tier 1 | Standard precautions | 2 | stem_disconnected |
| nclex-tier1-standard-precautions-blood | RN/RPN-PN authored tier 1 | Standard precautions | 2 | stem_disconnected |
| nclex-tier1-anticoagulant-bleeding | RN/RPN-PN authored tier 1 | Anticoagulants | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier1-anticoagulant-bleeding | RN/RPN-PN authored tier 1 | Anticoagulants | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier1-anticoagulant-bleeding | RN/RPN-PN authored tier 1 | Anticoagulants | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier1-delegation-vitals | RN | Delegation | 2 | stem_disconnected |
| nclex-tier1-delegation-vitals | RN | Delegation | 3 | missing_pathway_specificity |
| nclex-tier1-delegation-vitals | RN | Delegation | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier1-fluid-balance-output | RN/RPN-PN authored tier 1 | Fluid balance | 1 | answer_wording_leakage, generic_hint |
| nclex-tier1-fluid-balance-output | RN/RPN-PN authored tier 1 | Fluid balance | 2 | generic_hint |
| nclex-tier1-pain-reassessment | RN/RPN-PN authored tier 1 | Pain management | 2 | stem_disconnected |
| nclex-tier1-pain-reassessment | RN/RPN-PN authored tier 1 | Pain management | 1 | answer_wording_leakage |
| nclex-tier1-hypertension-teaching | RN/RPN-PN authored tier 1 | Hypertension | 3 | missing_pathway_specificity |
| nclex-tier1-hypertension-teaching | RN/RPN-PN authored tier 1 | Hypertension | 2 | generic_hint, missing_pathway_specificity |
| nclex-tier1-hypertension-teaching | RN/RPN-PN authored tier 1 | Hypertension | 3 | missing_pathway_specificity |
| nclex-tier1-lab-potassium | RN/RPN-PN authored tier 1 | Basic labs | 2 | stem_disconnected, missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier1-lab-potassium | RN/RPN-PN authored tier 1 | Basic labs | 3 | missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier1-lab-potassium | RN/RPN-PN authored tier 1 | Basic labs | 2 | generic_hint, missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier1-documentation-objective | RN/RPN-PN authored tier 1 | Documentation | 2 | stem_disconnected |
| nclex-tier1-oxygen-nasal-cannula-safety | RN/RPN-PN authored tier 1 | Oxygenation | 1 | answer_wording_leakage |
| nclex-tier1-mobility-cane | RN/RPN-PN authored tier 1 | Mobility | 1 | answer_wording_leakage |
| nclex-tier1-mobility-cane | RN/RPN-PN authored tier 1 | Mobility | 1 | answer_wording_leakage |
| nclex-tier1-mobility-cane | RN/RPN-PN authored tier 1 | Mobility | 1 | answer_wording_leakage, stem_disconnected |
| nclex-tier1-fever-postop | RN/RPN-PN authored tier 1 | Postoperative care | 2 | stem_disconnected |
| nclex-tier1-fever-postop | RN/RPN-PN authored tier 1 | Postoperative care | 2 | generic_hint |
| nclex-tier1-fever-postop | RN/RPN-PN authored tier 1 | Postoperative care | 1 | answer_wording_leakage, generic_hint |
| nclex-tier1-suicide-direct-question | RN/RPN-PN authored tier 1 | Suicide risk | 1 | answer_wording_leakage, stem_disconnected |
| nclex-tier1-maternity-postpartum-fundus | RN/RPN-PN authored tier 1 | Postpartum care | 2 | generic_hint, missing_pathway_specificity |
| nclex-tier1-maternity-postpartum-fundus | RN/RPN-PN authored tier 1 | Postpartum care | 3 | missing_pathway_specificity |
| nclex-tier1-maternity-postpartum-fundus | RN/RPN-PN authored tier 1 | Postpartum care | 1 | answer_wording_leakage, generic_hint, missing_pathway_specificity |
| nclex-tier1-peds-dehydration | RN/RPN-PN authored tier 1 | Pediatric care | 2 | stem_disconnected |
| nclex-tier1-peds-dehydration | RN/RPN-PN authored tier 1 | Pediatric care | 2 | generic_hint, stem_disconnected |
| nclex-tier1-med-admin-allergy | RN/RPN-PN authored tier 1 | Medication administration | 2 | stem_disconnected, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier1-med-admin-allergy | RN/RPN-PN authored tier 1 | Medication administration | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier1-expected-unexpected-cast | RN/RPN-PN authored tier 1 | Expected vs unexpected findings | 2 | generic_hint, stem_disconnected |
| nclex-tier1-expected-unexpected-cast | RN/RPN-PN authored tier 1 | Expected vs unexpected findings | 1 | answer_wording_leakage, stem_disconnected |
| nclex-tier1-hand-hygiene | RN/RPN-PN authored tier 1 | Hand hygiene | 1 | answer_wording_leakage |
| nclex-tier1-stroke-swallow | RN/RPN-PN authored tier 1 | Stroke | 1 | answer_wording_leakage, stem_disconnected |
| nclex-tier1-renal-fluid-teaching | RN/RPN-PN authored tier 1 | Renal basics | 2 | stem_disconnected |
| nclex-tier1-renal-fluid-teaching | RN/RPN-PN authored tier 1 | Renal basics | 1 | answer_wording_leakage, generic_hint, stem_disconnected |
| nclex-tier1-discharge-teaching-antibiotics | RN/RPN-PN authored tier 1 | Patient education | 2 | stem_disconnected |
| nclex-tier1-discharge-teaching-antibiotics | RN/RPN-PN authored tier 1 | Patient education | 1 | answer_wording_leakage |
| nclex-tier2-01-sepsis-older-adult | RN | Sepsis recognition | 1 | answer_wording_leakage |
| nclex-tier2-01-sepsis-older-adult | RN | Sepsis recognition | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier2-01-sepsis-older-adult | RN | Sepsis recognition | 3 | missing_pathway_specificity |
| nclex-tier2-02-postop-bleeding | RN | Postoperative complications | 3 | missing_pathway_specificity |
| nclex-tier2-02-postop-bleeding | RN | Postoperative complications | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-03-stroke-last-known-well | RN | Stroke recognition | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-03-stroke-last-known-well | RN | Stroke recognition | 3 | missing_pathway_specificity |
| nclex-tier2-03-stroke-last-known-well | RN | Stroke recognition | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier2-04-chest-pain-unstable | RN | Chest pain | 2 | stem_disconnected |
| nclex-tier2-05-respiratory-distress-pneumonia | RN | Respiratory distress | 2 | generic_hint, missing_pathway_specificity |
| nclex-tier2-05-respiratory-distress-pneumonia | RN | Respiratory distress | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-05-respiratory-distress-pneumonia | RN | Respiratory distress | 1 | answer_wording_leakage |
| nclex-tier2-06-hypoglycemia-confused | RN | Hypoglycemia | 3 | missing_pathway_specificity |
| nclex-tier2-06-hypoglycemia-confused | RN | Hypoglycemia | 2 | generic_hint, stem_disconnected, missing_pathway_specificity |
| nclex-tier2-06-hypoglycemia-confused | RN | Hypoglycemia | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier2-07-hyperglycemia-dka-cues | RN | Hyperglycemia | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-07-hyperglycemia-dka-cues | RN | Hyperglycemia | 3 | missing_pathway_specificity |
| nclex-tier2-08-heart-failure-fluid-overload | RN | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-08-heart-failure-fluid-overload | RN | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-08-heart-failure-fluid-overload | RN | Heart failure | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier2-09-potassium-loop-diuretic | RN | Electrolytes | 2 | stem_disconnected, missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier2-09-potassium-loop-diuretic | RN | Electrolytes | 2 | stem_disconnected, missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier2-09-potassium-loop-diuretic | RN | Electrolytes | 3 | missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier2-10-delegation-new-confusion | RN | Delegation | 2 | stem_disconnected |
| nclex-tier2-10-delegation-new-confusion | RN | Delegation | 3 | missing_pathway_specificity |
| nclex-tier2-11-opioid-sedation | RN | Opioid adverse effects | 2 | generic_hint |
| nclex-tier2-11-opioid-sedation | RN | Opioid adverse effects | 2 | stem_disconnected, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier2-11-opioid-sedation | RN | Opioid adverse effects | 1 | answer_wording_leakage, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier2-12-transfusion-reaction | RN | Blood transfusion reaction | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-12-transfusion-reaction | RN | Blood transfusion reaction | 3 | missing_pathway_specificity |
| nclex-tier2-12-transfusion-reaction | RN | Blood transfusion reaction | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier2-13-postop-pulmonary-embolism | RN | Pulmonary embolism cues | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-13-postop-pulmonary-embolism | RN | Pulmonary embolism cues | 2 | stem_disconnected |
| nclex-tier2-13-postop-pulmonary-embolism | RN | Pulmonary embolism cues | 1 | answer_wording_leakage |
| nclex-tier2-14-sodium-confusion | RN | Fluid and electrolyte imbalance | 3 | missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier2-14-sodium-confusion | RN | Fluid and electrolyte imbalance | 1 | answer_wording_leakage, missing_lab_pattern_or_trend, missing_pathway_specificity |
| nclex-tier2-15-asthma-worsening | RN | Asthma | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier2-15-asthma-worsening | RN | Asthma | 3 | missing_pathway_specificity |
| nclex-tier2-15-asthma-worsening | RN | Asthma | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier2-16-priority-four-clients | RN | Prioritization | 3 | missing_pathway_specificity |
| nclex-tier3-01-ventilated-high-pressure-alarm | RN | Ventilated patient deterioration | 3 | missing_pathway_specificity |
| nclex-tier3-01-ventilated-high-pressure-alarm | RN | Ventilated patient deterioration | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-01-ventilated-high-pressure-alarm | RN | Ventilated patient deterioration | 3 | missing_pathway_specificity |
| nclex-tier3-02-septic-shock-progression | RN | Sepsis progression | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-02-septic-shock-progression | RN | Sepsis progression | 3 | missing_pathway_specificity |
| nclex-tier3-02-septic-shock-progression | RN | Sepsis progression | 3 | missing_pathway_specificity |
| nclex-tier3-03-norepinephrine-extravasation | RN | Vasoactive medication safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier3-03-norepinephrine-extravasation | RN | Vasoactive medication safety | 2 | stem_disconnected, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier3-03-norepinephrine-extravasation | RN | Vasoactive medication safety | 1 | answer_wording_leakage, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier3-04-wide-complex-tachycardia-unstable | RN | Telemetry deterioration | 2 | stem_disconnected, missing_ecg_framework, missing_pathway_specificity |
| nclex-tier3-04-wide-complex-tachycardia-unstable | RN | Telemetry deterioration | 1 | answer_wording_leakage, missing_ecg_framework, missing_pathway_specificity |
| nclex-tier3-05-postop-hemorrhage-abdominal | RN | Postoperative hemorrhage | 3 | missing_pathway_specificity |
| nclex-tier3-05-postop-hemorrhage-abdominal | RN | Postoperative hemorrhage | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-05-postop-hemorrhage-abdominal | RN | Postoperative hemorrhage | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-06-increased-icp-cushing-cues | RN | Increased intracranial pressure | 3 | missing_pathway_specificity |
| nclex-tier3-06-increased-icp-cushing-cues | RN | Increased intracranial pressure | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier3-06-increased-icp-cushing-cues | RN | Increased intracranial pressure | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-07-dka-insulin-potassium | RN | DKA infusion safety | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-07-dka-insulin-potassium | RN | DKA infusion safety | 3 | missing_pathway_specificity |
| nclex-tier3-07-dka-insulin-potassium | RN | DKA infusion safety | 3 | missing_pathway_specificity |
| nclex-tier3-08-ards-worsening-on-high-flow | RN | Acute respiratory compromise | 3 | missing_pathway_specificity |
| nclex-tier3-08-ards-worsening-on-high-flow | RN | Acute respiratory compromise | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier3-08-ards-worsening-on-high-flow | RN | Acute respiratory compromise | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-09-transfusion-reaction-shock | RN | Transfusion reaction | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-09-transfusion-reaction-shock | RN | Transfusion reaction | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-09-transfusion-reaction-shock | RN | Transfusion reaction | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier3-10-complex-icu-delegation | RN | High-acuity assignment safety | 2 | stem_disconnected |
| nclex-tier3-10-complex-icu-delegation | RN | High-acuity assignment safety | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier3-11-pca-opioid-oversedation | RN | Opioid safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier3-11-pca-opioid-oversedation | RN | Opioid safety | 2 | stem_disconnected, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier3-11-pca-opioid-oversedation | RN | Opioid safety | 1 | answer_wording_leakage, missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| nclex-tier3-12-hyperkalemia-telemetry-cues | RN | Hyperkalemia safety | 3 | missing_pathway_specificity |
| nclex-tier3-12-hyperkalemia-telemetry-cues | RN | Hyperkalemia safety | 3 | missing_pathway_specificity |
| nclex-tier3-12-hyperkalemia-telemetry-cues | RN | Hyperkalemia safety | 1 | answer_wording_leakage |
| nclex-tier3-13-stroke-thrombolytic-neuro-change | RN | Post-thrombolytic monitoring | 3 | missing_pathway_specificity |
| nclex-tier3-13-stroke-thrombolytic-neuro-change | RN | Post-thrombolytic monitoring | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-13-stroke-thrombolytic-neuro-change | RN | Post-thrombolytic monitoring | 1 | answer_wording_leakage |
| nclex-tier3-14-cardiogenic-shock-post-mi | RN | Cardiogenic shock | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-14-cardiogenic-shock-post-mi | RN | Cardiogenic shock | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-15-burn-inhalation-deterioration | RN | Burn inhalation injury | 3 | missing_pathway_specificity |
| nclex-tier3-15-burn-inhalation-deterioration | RN | Burn inhalation injury | 3 | missing_pathway_specificity |
| nclex-tier3-15-burn-inhalation-deterioration | RN | Burn inhalation injury | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier3-16-massive-pe-deterioration | RN | Pulmonary embolism deterioration | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-16-massive-pe-deterioration | RN | Pulmonary embolism deterioration | 3 | missing_pathway_specificity |
| nclex-tier3-16-massive-pe-deterioration | RN | Pulmonary embolism deterioration | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier3-17-acute-liver-failure-bleeding-confusion | RN | Multisystem deterioration | 1 | answer_wording_leakage, missing_pathway_specificity |
| nclex-tier3-17-acute-liver-failure-bleeding-confusion | RN | Multisystem deterioration | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-17-acute-liver-failure-bleeding-confusion | RN | Multisystem deterioration | 1 | answer_wording_leakage |
| nclex-tier3-18-sedation-handoff-instability | RN | High-acuity handoff | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-18-sedation-handoff-instability | RN | High-acuity handoff | 1 | answer_wording_leakage, stem_disconnected, missing_pathway_specificity |
| nclex-tier3-18-sedation-handoff-instability | RN | High-acuity handoff | 3 | missing_pathway_specificity |
| nclex-tier3-19-aortic-dissection-warning | RN | Acute vascular emergency cues | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-19-aortic-dissection-warning | RN | Acute vascular emergency cues | 2 | stem_disconnected, missing_pathway_specificity |
| nclex-tier3-19-aortic-dissection-warning | RN | Acute vascular emergency cues | 1 | answer_wording_leakage |
| cnple-rpn-priority-copd-decline | CNPLE/RPN-PN | Respiratory deterioration | 2 | stem_disconnected |
| cnple-rpn-sata-copd-decline | CNPLE/RPN-PN | Respiratory deterioration | 2 | stem_disconnected |
| cnple-rpn-matrix-copd-decline | CNPLE/RPN-PN | Respiratory deterioration | 2 | stem_disconnected |
| cnple-rpn-bowtie-copd-decline | CNPLE/RPN-PN | Respiratory deterioration | 2 | stem_disconnected |
| cnple-rpn-priority-sepsis-ltc | CNPLE/RPN-PN | Sepsis recognition | 2 | stem_disconnected |
| cnple-rpn-sata-sepsis-ltc | CNPLE/RPN-PN | Sepsis recognition | 2 | stem_disconnected |
| cnple-rpn-matrix-sepsis-ltc | CNPLE/RPN-PN | Sepsis recognition | 2 | stem_disconnected |
| cnple-rpn-bowtie-sepsis-ltc | CNPLE/RPN-PN | Sepsis recognition | 2 | stem_disconnected |
| cnple-rpn-priority-heart-failure-fluid | CNPLE/RPN-PN | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| cnple-rpn-sata-heart-failure-fluid | CNPLE/RPN-PN | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| cnple-rpn-matrix-heart-failure-fluid | CNPLE/RPN-PN | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| cnple-rpn-bowtie-heart-failure-fluid | CNPLE/RPN-PN | Heart failure | 2 | stem_disconnected, missing_pathway_specificity |
| cnple-rpn-priority-stroke-cue | CNPLE/RPN-PN | Stroke recognition | 2 | stem_disconnected |
| cnple-rpn-sata-stroke-cue | CNPLE/RPN-PN | Stroke recognition | 2 | stem_disconnected |
| cnple-rpn-matrix-stroke-cue | CNPLE/RPN-PN | Stroke recognition | 2 | stem_disconnected |
| cnple-rpn-bowtie-stroke-cue | CNPLE/RPN-PN | Stroke recognition | 2 | stem_disconnected |
| cnple-rpn-priority-postpartum-hemorrhage | CNPLE/RPN-PN | Postpartum assessment | 3 | missing_pathway_specificity |
| cnple-rpn-sata-postpartum-hemorrhage | CNPLE/RPN-PN | Postpartum assessment | 3 | missing_pathway_specificity |
| cnple-rpn-matrix-postpartum-hemorrhage | CNPLE/RPN-PN | Postpartum assessment | 3 | missing_pathway_specificity |
| cnple-rpn-bowtie-postpartum-hemorrhage | CNPLE/RPN-PN | Postpartum assessment | 3 | missing_pathway_specificity |
| cnple-rpn-priority-pediatric-respiratory | CNPLE/RPN-PN | Pediatric respiratory distress | 2 | stem_disconnected |
| cnple-rpn-sata-pediatric-respiratory | CNPLE/RPN-PN | Pediatric respiratory distress | 2 | stem_disconnected |
| cnple-rpn-matrix-pediatric-respiratory | CNPLE/RPN-PN | Pediatric respiratory distress | 2 | stem_disconnected |
| cnple-rpn-bowtie-pediatric-respiratory | CNPLE/RPN-PN | Pediatric respiratory distress | 2 | stem_disconnected |
| cnple-rpn-priority-hypoglycemia | CNPLE/RPN-PN | Diabetes medication safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-sata-hypoglycemia | CNPLE/RPN-PN | Diabetes medication safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-matrix-hypoglycemia | CNPLE/RPN-PN | Diabetes medication safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-bowtie-hypoglycemia | CNPLE/RPN-PN | Diabetes medication safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-priority-warfarin-bleeding | CNPLE/RPN-PN | Anticoagulant safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-sata-warfarin-bleeding | CNPLE/RPN-PN | Anticoagulant safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-matrix-warfarin-bleeding | CNPLE/RPN-PN | Anticoagulant safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-bowtie-warfarin-bleeding | CNPLE/RPN-PN | Anticoagulant safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-priority-delirium-dementia | CNPLE/RPN-PN | Delirium recognition | 2 | stem_disconnected |
| cnple-rpn-sata-delirium-dementia | CNPLE/RPN-PN | Delirium recognition | 2 | stem_disconnected |
| cnple-rpn-matrix-delirium-dementia | CNPLE/RPN-PN | Delirium recognition | 2 | stem_disconnected |
| cnple-rpn-bowtie-delirium-dementia | CNPLE/RPN-PN | Delirium recognition | 2 | stem_disconnected |
| cnple-rpn-priority-cdiff-ipac | CNPLE/RPN-PN | C. difficile infection control | 2 | stem_disconnected |
| cnple-rpn-sata-cdiff-ipac | CNPLE/RPN-PN | C. difficile infection control | 2 | stem_disconnected |
| cnple-rpn-matrix-cdiff-ipac | CNPLE/RPN-PN | C. difficile infection control | 2 | stem_disconnected |
| cnple-rpn-bowtie-cdiff-ipac | CNPLE/RPN-PN | C. difficile infection control | 2 | stem_disconnected |
| cnple-rpn-priority-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 2 | stem_disconnected |
| cnple-rpn-priority-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 3 | missing_pathway_specificity |
| cnple-rpn-sata-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 2 | stem_disconnected |
| cnple-rpn-sata-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 3 | missing_pathway_specificity |
| cnple-rpn-matrix-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 2 | stem_disconnected |
| cnple-rpn-matrix-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 3 | missing_pathway_specificity |
| cnple-rpn-bowtie-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 2 | stem_disconnected |
| cnple-rpn-bowtie-wound-infection | CNPLE/RPN-PN | Postoperative wound complication | 3 | missing_pathway_specificity |
| cnple-rpn-priority-ethics-capacity | CNPLE/RPN-PN | Consent and capacity | 2 | stem_disconnected |
| cnple-rpn-sata-ethics-capacity | CNPLE/RPN-PN | Consent and capacity | 2 | stem_disconnected |
| cnple-rpn-matrix-ethics-capacity | CNPLE/RPN-PN | Consent and capacity | 2 | stem_disconnected |
| cnple-rpn-bowtie-ethics-capacity | CNPLE/RPN-PN | Consent and capacity | 2 | stem_disconnected |
| cnple-rpn-ordered-hypoglycemia-response | CNPLE/RPN-PN | Diabetes medication safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |
| cnple-rpn-ordered-postpartum-bleeding | CNPLE/RPN-PN | Postpartum assessment | 3 | missing_pathway_specificity |
| cnple-rpn-ordered-warfarin-bleed | CNPLE/RPN-PN | Anticoagulant safety | 3 | missing_pharmacology_safety_monitoring, missing_pathway_specificity |

_Truncated to first 200 of 317 failed or review-required hints._
