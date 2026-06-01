# Distractor Analytics Dashboard

Generated: 2026-06-01T00:36:23.938Z

Wrong-answer selections should feed misconception frequency, topic weakness, safety weakness, clinical judgment weakness, and readiness-domain updates.

## Misconception Frequency

| Misconception | Distractor Count |
| --- | --- |
| priority error | 120 |
| timing error | 115 |
| safety error | 63 |
| assessment error | 61 |
| scope error | 40 |
| communication error | 39 |
| interpretation error | 38 |
| task fixation | 22 |
| documentation error | 14 |
| anchoring bias | 14 |
| medication monitoring failure | 14 |
| trend interpretation failure | 8 |
| confirmation bias | 7 |
| pattern recognition error | 5 |
| over escalation | 3 |
| overconfidence | 2 |
| under escalation | 2 |
| tunnel vision | 1 |

## Readiness Domain Signals

| Readiness Domain | Mapped Distractors |
| --- | --- |
| clinical judgment readiness | 169 |
| patient safety readiness | 89 |
| escalation readiness | 66 |
| communication readiness | 39 |
| documentation readiness | 14 |
| medication safety readiness | 14 |

## Weakness Detection Rules

| Signal | Analytics Update |
| --- | --- |
| Most selected wrong answer | Increment primary misconception and readiness domain |
| Second most selected wrong answer | Increment secondary misconception and compare against stem topic |
| Repeated safety distractors | Increase patient safety weakness score |
| Repeated under-escalation or failure-to-rescue | Increase escalation readiness risk |
| Repeated medication-monitoring failure | Increase medication safety remediation priority |
| Repeated documentation error | Assign documentation practice |

## Lowest-Scoring Question Clusters

| Question | Pathway | Average Distractor Score | Lowest Score | Mapped Domains |
| --- | --- | --- | --- | --- |
| NP · D | NP | 59.3 | 26 | clinical_judgment_readiness, documentation_readiness, patient_safety_readiness, escalation_readiness, communication_readiness, medication_safety_readiness |
| NP · action-monitor | NP | 41 | 36 | missing |
| RPN/PN · nclex-tier1-pneumonia-cough-deep-breathe | RPN/PN | 53 | 46 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| RPN/PN · nclex-tier1-peds-dehydration | RPN/PN | 53.7 | 46 | clinical_judgment_readiness |
| RPN/PN · nclex-tier1-chf-daily-weight | RPN/PN | 59.3 | 49 | clinical_judgment_readiness |
| NP · g | NP | 58.5 | 49 | clinical_judgment_readiness, patient_safety_readiness, communication_readiness, escalation_readiness, documentation_readiness |
| RPN/PN · nclex-tier1-standard-precautions-blood | RPN/PN | 57.3 | 52 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| RPN/PN · nclex-tier1-mobility-cane | RPN/PN | 57.3 | 52 | clinical_judgment_readiness |
| RPN/PN · nclex-tier1-postop-incentive-spirometer | RPN/PN | 59.7 | 56 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| RPN/PN · nclex-tier1-hand-hygiene | RPN/PN | 59.3 | 56 | clinical_judgment_readiness |
| NP · monitor-correct | NP | 56 | 56 | clinical_judgment_readiness, medication_safety_readiness |
| NP · cnple-rpn-extended-matching-pharm-risk | NP | 56 | 56 | clinical_judgment_readiness |
| ECG · d | ECG | 64.6 | 56 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, documentation_readiness, communication_readiness, medication_safety_readiness |
| NP · a | NP | 56 | 56 | clinical_judgment_readiness, patient_safety_readiness |
| NP · c | NP | 64.2 | 57 | patient_safety_readiness, escalation_readiness, clinical_judgment_readiness, communication_readiness, medication_safety_readiness |
| RPN/PN · nclex-tier1-med-admin-allergy | RPN/PN | 62 | 58 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, documentation_readiness |
| RPN/PN · nclex-tier1-copd-positioning | RPN/PN | 64.7 | 60 | clinical_judgment_readiness |
| RPN/PN · nclex-tier1-pain-reassessment | RPN/PN | 65 | 60 | clinical_judgment_readiness, documentation_readiness |
| RPN/PN · nclex-tier1-fever-postop | RPN/PN | 61 | 60 | clinical_judgment_readiness |
| RPN/PN · nclex-tier1-maternity-postpartum-fundus | RPN/PN | 66.7 | 60 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| ECG · b | ECG | 65.6 | 60 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness |
| ECG · c | ECG | 66.6 | 60 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness, documentation_readiness, medication_safety_readiness |
| NP · d | NP | 68.1 | 60 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness |
| ECG · stemi-alert-doc | ECG | 60 | 60 | clinical_judgment_readiness |
| ECG · mon-ecg-only | ECG | 65.5 | 60 | medication_safety_readiness, clinical_judgment_readiness |
| NP · r2-mon | NP | 61 | 60 | medication_safety_readiness, clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| NP · r4-mon | NP | 60 | 60 | clinical_judgment_readiness, medication_safety_readiness |
| ECG · f | ECG | 63.8 | 60 | clinical_judgment_readiness, patient_safety_readiness, documentation_readiness, communication_readiness |
| Labs · nclex-tier1-delegation-vitals | Labs | 64 | 62 | clinical_judgment_readiness, patient_safety_readiness, communication_readiness |
| Clinical Skills · nclex-tier1-delegation-vitals | Clinical Skills | 62 | 62 | clinical_judgment_readiness, patient_safety_readiness |
| RPN/PN · nclex-tier1-fluid-balance-output | RPN/PN | 63.3 | 62 | communication_readiness, clinical_judgment_readiness |
| RPN/PN · nclex-tier1-lab-potassium | RPN/PN | 64.7 | 62 | clinical_judgment_readiness, communication_readiness |
| RPN/PN · nclex-tier1-expected-unexpected-cast | RPN/PN | 64.7 | 62 | clinical_judgment_readiness, communication_readiness |
| ECG · a | ECG | 66.3 | 62 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| RPN/PN · nclex-tier1-stroke-swallow | RPN/PN | 66.7 | 64 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| NP · cnple-rpn-communication-therapeutic-panic | NP | 65 | 65 | communication_readiness, clinical_judgment_readiness |
| RPN/PN · nclex-tier1-hypoglycemia-alert | RPN/PN | 70.3 | 66 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, documentation_readiness |
| RPN/PN · nclex-tier1-oxygen-nasal-cannula-safety | RPN/PN | 68.3 | 66 | patient_safety_readiness, escalation_readiness, clinical_judgment_readiness |
| NP · F | NP | 66 | 66 | clinical_judgment_readiness |
| ECG · chb-escalation-doc | ECG | 66 | 66 | clinical_judgment_readiness |
| ECG · torsades-event-doc | ECG | 66 | 66 | clinical_judgment_readiness |
| RPN/PN · svt-event-doc | RPN/PN | 66 | 66 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, documentation_readiness, medication_safety_readiness |
| RPN/PN · rpn-brady-handoff | RPN/PN | 66 | 66 | clinical_judgment_readiness, patient_safety_readiness, communication_readiness |
| NP · mon-pulse | NP | 66 | 66 | clinical_judgment_readiness, medication_safety_readiness |
| RPN/PN · nclex-tier1-falls-call-light | RPN/PN | 73 | 67 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| RPN/PN · nclex-tier1-anticoagulant-bleeding | RPN/PN | 72 | 67 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness, documentation_readiness |
| NP · cnple-rpn-hotspot-im-injection-site | NP | 67 | 67 | documentation_readiness |
| NP · cnple-rpn-extended-matching-respiratory-cues | NP | 68 | 67 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, documentation_readiness |
| ECG · pvcs-doc | ECG | 70 | 67 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| ECG · r5-mon | ECG | 67 | 67 | clinical_judgment_readiness |
| ECG · e | ECG | 68 | 68 | clinical_judgment_readiness, patient_safety_readiness, communication_readiness |
| NP · f | NP | 68 | 68 | clinical_judgment_readiness |
| NP · cnple-rpn-communication-sbar-sepsis | NP | 69.5 | 69 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness |
| ECG · ng-rrt-doc | ECG | 69 | 69 | clinical_judgment_readiness |
| ECG · g | ECG | 69 | 69 | clinical_judgment_readiness |
| NP · C | NP | 70 | 70 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness |
| ECG · afib-sbar | ECG | 70.5 | 70 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, medication_safety_readiness |
| NP · r5-act | NP | 70 | 70 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness |
| RPN/PN · c | RPN/PN | 71 | 71 | clinical_judgment_readiness, patient_safety_readiness |
| RPN/PN · a | RPN/PN | 73 | 73 | clinical_judgment_readiness, patient_safety_readiness, communication_readiness |
| ECG · rt-tension-pneumo-doc | ECG | 73 | 73 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, communication_readiness, documentation_readiness, medication_safety_readiness |
| NP · monitor-distractor | NP | 75 | 75 | clinical_judgment_readiness, patient_safety_readiness, escalation_readiness, medication_safety_readiness |
| NP · cnple-rpn-cloze-documentation | NP | 75 | 75 | clinical_judgment_readiness |
