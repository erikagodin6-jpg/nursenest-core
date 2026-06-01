# Question Realism Dashboard

Generated: 2026-06-01T00:36:23.936Z

Realism is estimated from distractor clinical workflow, assessment, escalation, safety, and taxonomy signals. A question is blocked when any scored distractor fails the publish gate.

## Pathway Realism

| Pathway | Distractors | Clinical Realism | Assessment Realism | Escalation/Safety Realism | Blocked Distractors |
| --- | --- | --- | --- | --- | --- |
| RN | 0 | 0 | 0 | 0 | 0 |
| RPN/PN | 64 | 65.9 | 70.9 | 60.1 | 64 |
| NP | 76 | 67.3 | 73.4 | 58 | 76 |
| ECG | 64 | 71 | 80.5 | 58.3 | 64 |
| Labs | 2 | 86 | 93 | 42 | 2 |
| Clinical Skills | 1 | 86 | 100 | 42 | 1 |
| Pharmacology | 0 | 0 | 0 | 0 | 0 |
| Allied | 0 | 0 | 0 | 0 | 0 |

## Blocked Questions

| Question | Failed Distractors | Lowest Score | Example Source |
| --- | --- | --- | --- |
| nclex-tier1-falls-call-light | 3 | 67 | src/content/questions/nclex-tier1-foundational-questions.ts:76 |
| nclex-tier1-hypoglycemia-alert | 3 | 66 | src/content/questions/nclex-tier1-foundational-questions.ts:118 |
| nclex-tier1-copd-positioning | 3 | 60 | src/content/questions/nclex-tier1-foundational-questions.ts:160 |
| nclex-tier1-chf-daily-weight | 3 | 49 | src/content/questions/nclex-tier1-foundational-questions.ts:202 |
| nclex-tier1-pneumonia-cough-deep-breathe | 3 | 46 | src/content/questions/nclex-tier1-foundational-questions.ts:244 |
| nclex-tier1-postop-incentive-spirometer | 3 | 56 | src/content/questions/nclex-tier1-foundational-questions.ts:286 |
| nclex-tier1-standard-precautions-blood | 3 | 52 | src/content/questions/nclex-tier1-foundational-questions.ts:328 |
| nclex-tier1-anticoagulant-bleeding | 3 | 67 | src/content/questions/nclex-tier1-foundational-questions.ts:412 |
| nclex-tier1-delegation-vitals | 3 | 62 | src/content/questions/nclex-tier1-foundational-questions.ts:454 |
| nclex-tier1-fluid-balance-output | 3 | 62 | src/content/questions/nclex-tier1-foundational-questions.ts:496 |
| nclex-tier1-pain-reassessment | 3 | 60 | src/content/questions/nclex-tier1-foundational-questions.ts:538 |
| nclex-tier1-lab-potassium | 3 | 62 | src/content/questions/nclex-tier1-foundational-questions.ts:622 |
| nclex-tier1-oxygen-nasal-cannula-safety | 3 | 66 | src/content/questions/nclex-tier1-foundational-questions.ts:706 |
| nclex-tier1-mobility-cane | 3 | 52 | src/content/questions/nclex-tier1-foundational-questions.ts:748 |
| nclex-tier1-fever-postop | 3 | 60 | src/content/questions/nclex-tier1-foundational-questions.ts:790 |
| nclex-tier1-maternity-postpartum-fundus | 3 | 60 | src/content/questions/nclex-tier1-foundational-questions.ts:874 |
| nclex-tier1-peds-dehydration | 3 | 46 | src/content/questions/nclex-tier1-foundational-questions.ts:916 |
| nclex-tier1-med-admin-allergy | 3 | 58 | src/content/questions/nclex-tier1-foundational-questions.ts:958 |
| nclex-tier1-expected-unexpected-cast | 3 | 62 | src/content/questions/nclex-tier1-foundational-questions.ts:1000 |
| nclex-tier1-hand-hygiene | 3 | 56 | src/content/questions/nclex-tier1-foundational-questions.ts:1042 |
| nclex-tier1-stroke-swallow | 3 | 64 | src/content/questions/nclex-tier1-foundational-questions.ts:1084 |
| D | 38 | 26 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:420 |
| F | 1 | 66 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:459 |
| monitor-correct | 1 | 56 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:544 |
| monitor-distractor | 1 | 75 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:548 |
| cnple-rpn-hotspot-im-injection-site | 1 | 67 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:634 |
| cnple-rpn-cloze-documentation | 2 | 75 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:720 |
| cnple-rpn-extended-matching-respiratory-cues | 2 | 67 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:742 |
| cnple-rpn-extended-matching-pharm-risk | 1 | 56 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:765 |
| cnple-rpn-communication-sbar-sepsis | 2 | 69 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:787 |
| cnple-rpn-communication-therapeutic-panic | 1 | 65 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:810 |
| C | 1 | 70 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1037 |
| b | 7 | 60 | src/lib/ecg-module/ecg-simulation-expansions.ts:154 |
| d | 25 | 56 | src/lib/ecg-module/ecg-simulation-expansions.ts:169 |
| c | 19 | 57 | src/lib/ecg-module/ecg-simulation-expansions.ts:200 |
| chb-escalation-doc | 1 | 66 | src/lib/ecg-module/ecg-simulation-expansions.ts:214 |
| a | 10 | 56 | src/lib/ecg-module/ecg-simulation-expansions.ts:445 |
| torsades-event-doc | 2 | 66 | src/lib/ecg-module/ecg-simulation-expansions.ts:456 |
| svt-event-doc | 1 | 66 | src/lib/ecg-module/ecg-simulation-expansions.ts:669 |
| rpn-brady-handoff | 1 | 66 | src/lib/ecg-module/ecg-simulation-expansions.ts:828 |
| g | 3 | 49 | src/lib/ecg-module/ecg-simulation-expansions.ts:973 |
| rt-tension-pneumo-doc | 1 | 73 | src/lib/ecg-module/ecg-simulation-expansions.ts:1171 |
| ng-rrt-doc | 1 | 69 | src/lib/ecg-module/ecg-simulation-expansions.ts:1369 |
| pvcs-doc | 2 | 67 | src/lib/ecg-module/ecg-simulation-catalog.ts:296 |
| afib-sbar | 2 | 70 | src/lib/ecg-module/ecg-simulation-catalog.ts:501 |
| stemi-alert-doc | 2 | 60 | src/lib/ecg-module/ecg-simulation-catalog.ts:663 |
| e | 1 | 68 | src/lib/ecg-module/ecg-ngn-cases.ts:129 |
| action-monitor | 2 | 36 | src/lib/ecg-module/ecg-ngn-cases.ts:161 |
| mon-pulse | 1 | 66 | src/lib/ecg-module/ecg-ngn-cases.ts:165 |
| mon-ecg-only | 2 | 60 | src/lib/ecg-module/ecg-ngn-cases.ts:167 |
| r2-mon | 2 | 60 | src/lib/ecg-module/ecg-ngn-cases.ts:194 |
| r4-mon | 1 | 60 | src/lib/ecg-module/ecg-ngn-cases.ts:198 |
| r5-act | 1 | 70 | src/lib/ecg-module/ecg-ngn-cases.ts:199 |
| r5-mon | 1 | 67 | src/lib/ecg-module/ecg-ngn-cases.ts:202 |
| f | 5 | 60 | src/lib/ecg-module/ecg-ngn-cases.ts:291 |

## Publish Gate

No question may publish when any distractor score is below 80, why-tempting analysis is missing, safety analysis is missing, misconception mapping is missing, remediation mapping is missing, readiness mapping is missing, or duplicate/throwaway distractors are present.
