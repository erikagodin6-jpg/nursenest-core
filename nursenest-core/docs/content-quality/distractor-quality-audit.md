# Distractor Quality Audit

Generated: 2026-05-31T04:58:45.204Z

Static source-backed audit of explicit false options found in NurseNest question banks. This audit enforces the publish gate that every wrong answer should teach why it is tempting, why it is incorrect, and what safety or reasoning risk it introduces.

## Summary

- Distractors scored: 207
- Average distractor score: 63.3
- Failed publish gate: 207
- Duplicate distractor text instances: 0
- Throwaway or unrealistic distractor signals: 69
- Minimum publish score: 70

## Pathway Scores

| Pathway | Distractors | Average Score | Failed Gate | Clinical Realism Avg |
| --- | --- | --- | --- | --- |
| RN | 0 | 0 | 0 | 0 |
| RPN/PN | 64 | 63.4 | 64 | 65.9 |
| NP | 76 | 61.5 | 76 | 65.6 |
| ECG | 64 | 65.3 | 64 | 70 |
| Labs | 2 | 64.5 | 2 | 86 |
| Clinical Skills | 1 | 62 | 1 | 86 |
| Pharmacology | 0 | 0 | 0 | 0 |
| Allied | 0 | 0 | 0 | 0 |

## Failed Distractors

| Score | Pathway | Source | Option | Issue | Distractor |
| --- | --- | --- | --- | --- | --- |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:76 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client to use the call light after walking to the bathroom. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:77 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Raise all four side rails so the client cannot get out of bed. |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:78 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Place the bedside table across the bed to remind the client to wait. |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:118 | B | Why-tempting analysis is missing or too implicit. | Administer the scheduled rapid-acting insulin. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:119 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Encourage the client to take a walk to improve circulation. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:120 | D | Why-tempting analysis is missing or too implicit. | Document the finding and recheck glucose at the next scheduled time. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:160 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Encourage the client to lie flat and rest. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:161 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client shortness of breath is expected with COPD. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:162 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Offer a large meal to increase energy. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:202 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Weigh yourself only when your ankles are swollen. |
| 63 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:203 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Drink extra fluids before weighing yourself. |
| 56 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:204 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Use a different scale each day to compare results. |
| 53 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:244 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Limit repositioning so the client can conserve energy. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:245 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Keep the client lying flat after meals. |
| 53 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:246 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Avoid oral care until the cough improves. |
| 56 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:286 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Avoid coughing because it may open the incision. |
| 56 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:287 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Remain in bed until pain is completely gone. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:288 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Take shallow breaths to reduce incision discomfort. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:328 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Use clean bare hands if the container is closed. |
| 63 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:329 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Recap any used needle before disposal. |
| 56 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:330 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Save hand hygiene until the end of the shift. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:412 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client this is an expected effect of warfarin. |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:413 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Encourage the client to take aspirin for discomfort. |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:414 | D | Why-tempting analysis is missing or too implicit. | Document the report and wait until the next routine lab draw. |
| 62 | Labs | src/content/questions/nclex-tier1-foundational-questions.ts:454 | B | Why-tempting analysis is missing or too implicit. | Assess new shortness of breath. |
| 67 | Labs | src/content/questions/nclex-tier1-foundational-questions.ts:455 | C | Why-tempting analysis is missing or too implicit. | Teach the client how to use a new inhaler. |
| 62 | Clinical Skills | src/content/questions/nclex-tier1-foundational-questions.ts:456 | D | Why-tempting analysis is missing or too implicit. | Evaluate whether pain medication was effective. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:496 | B | Why-tempting analysis is missing or too implicit. | Clear yellow urine in the collection container. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:497 | C | Why-tempting analysis is missing or too implicit. | A glass of water recorded on the intake sheet. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:498 | D | Why-tempting analysis is missing or too implicit. | The client voided before breakfast. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:538 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client pain is expected and avoid further assessment. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:539 | C | Why-tempting analysis is missing or too implicit. | Document that the pain is resolved immediately after giving the medication. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:540 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Wait until the next shift to ask about pain again. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:622 | B | Why-tempting analysis is missing or too implicit. | Potassium 4.2 mEq/L. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:623 | C | Why-tempting analysis is missing or too implicit. | Potassium 3.9 mEq/L. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:624 | D | Why-tempting analysis is missing or too implicit. | Potassium 4.8 mEq/L. |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:706 | B | Why-tempting analysis is missing or too implicit. | Apply petroleum jelly around the nares for dryness. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:707 | C | Why-tempting analysis is missing or too implicit. | Store oxygen tanks loosely on the floor. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:708 | D | Why-tempting analysis is missing or too implicit. | Increase oxygen flow whenever short of breath without calling the provider. |
| 59 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:748 | B | Distractor does not map to a defined misconception taxonomy. | Hold the cane on the right side. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:749 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Advance the weak leg first without moving the cane. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:750 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Use the cane only when pain is severe. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:790 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client this is expected after surgery. |
| 53 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:791 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Remove the sutures to let the drainage out. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:792 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Cover the incision and wait until discharge teaching. |
| 69 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:874 | B | Why-tempting analysis is missing or too implicit. | Encourage the client to sleep and reassess later. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:875 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client heavy bleeding is normal after birth. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:876 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Give oral fluids before assessing the uterus. |
| 56 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:916 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Crying when the diaper is changed. |
| 58 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:917 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Wanting to be held by the parent. |
| 53 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:918 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | One loose stool earlier in the day. |
| 58 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:958 | B | Why-tempting analysis is missing or too implicit. | Ask the client if the medication tastes unpleasant. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:959 | C | Why-tempting analysis is missing or too implicit. | Tell the client all antibiotics work the same way. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:960 | D | Why-tempting analysis is missing or too implicit. | Document the dose before giving the medication. |
| 62 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1000 | B | Why-tempting analysis is missing or too implicit. | Mild itching under the cast. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1001 | C | Why-tempting analysis is missing or too implicit. | The cast feels dry on the outside. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1002 | D | Why-tempting analysis is missing or too implicit. | The client asks when follow-up will occur. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1042 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Put on a second pair of gloves without cleaning hands. |
| 56 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1043 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Only clean hands if they look visibly soiled. |
| 60 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1044 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Use the same gloves to answer the phone. |
| 68 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1084 | B | Distractor lacks realistic clinical action, assessment, or workflow language. | Give water slowly through a straw. |
| 63 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1085 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Offer crackers first to see if chewing is normal. |
| 67 | RPN/PN | src/content/questions/nclex-tier1-foundational-questions.ts:1086 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the client fluids are not important right now. |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:420 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Complete routine charting before reassessing because documentation is required. |
| 67 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:459 | A | Why-tempting analysis is missing or too implicit. | Perform a focused assessment and compare findings with baseline.", correct: true, rationale: wrong.A }, { id: "B", text: `Monitor item-specific cue.`... |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:544 | condition-distractor | Distractor lacks realistic clinical action, assessment, or workflow language. | Expected baseline variation |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:548 | monitor-distractor | Absolute-language giveaway detected. | Meal preference and routine comfort only |
| 67 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:633 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | The client prefers tea with breakfast. |
| 68 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:634 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | The admission paperwork is missing a non-urgent phone number. |
| 68 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:658 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | Central deltoid, below the acromion and above the axillary fold |
| 53 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:660 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Near the antecubital fossa |
| 49 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:661 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Over an inflamed rash |
| 53 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:690 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | Lower back over the triangular bone above the gluteal cleft |
| 42 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:692 | C | Distractor is too short to be clinically plausible. | Lateral elbow |
| 42 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:693 | D | Distractor is too short to be clinically plausible. | Mid-sternum |
| 63 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:718 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | fast-acting carbohydrate; 15 minutes |
| 67 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:720 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | water; 1 hour |
| 67 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:721 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | a full high-fat meal; 2 hours |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:740 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | refused; RN/prescriber per policy |
| 66 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:742 | C | Absolute-language giveaway detected. | was difficult about; family only |
| 68 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:743 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | ignored; chart omitted |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:762 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | COPD client restless with SpO2 85% and accessory muscle use |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:764 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Client asks for more pillows but denies dyspnea and has SpO2 97% |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:765 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Client coughs once after drinking and then clears throat |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:785 | A | Why-tempting analysis is missing or too implicit. | Warfarin client with black stool and INR 4.8 |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:787 | C | Why-tempting analysis is missing or too implicit. | Client dislikes the taste of liquid acetaminophen |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:788 | D | Why-tempting analysis is missing or too implicit. | Client prefers metformin with supper |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:807 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | Situation: new confusion and low BP. Background: catheter and fever. Assessment: possible sepsis. Recommendation: urgent RN/provider assessment. |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:809 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | The urine smells bad, so antibiotics are needed now. |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:810 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Family says this happens sometimes, so no action is needed. |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:829 | A | Why-tempting analysis is missing or too implicit. | I will stay with you while we check your breathing and vital signs. |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:831 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Everyone feels this way sometimes. |
| 63 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:832 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | You should not be so dramatic. |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:861 | A | Why-tempting analysis is missing or too implicit. | Assist a stable client with bathing and report shortness of breath or dizziness. |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:863 | C | Why-tempting analysis is missing or too implicit. | Teach insulin dose adjustment for discharge. |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:864 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Triage a client with sudden chest pain. |
| 67 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:888 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | Stable cellulitis client receiving scheduled oral antibiotics and dressing change |
| 68 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:890 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Postpartum client saturating pads every 15 minutes |
| 67 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:891 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Child with increasing retractions and SpO2 89% |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:919 | A | Why-tempting analysis is missing or too implicit. | Hold the opioid, stimulate/assess the client, apply ordered oxygen if available, and notify the RN/provider immediately. |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:921 | C | Why-tempting analysis is missing or too implicit. | Let the client sleep and reassess in 2 hours. |
| 49 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:922 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | Tell the family the client is just tired. |
| 62 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:948 | A | Why-tempting analysis is missing or too implicit. | Hold the dose and notify the RN/provider according to policy. |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:950 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Give double fluids and recheck next week. |
| 30 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:951 | D | Throwaway or non-clinical distractor pattern detected. | Ignore the apical pulse and use the radial pulse only. |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:976 | A | Why-tempting analysis is missing or too implicit. | Recognize the trend as possible sepsis, escalate immediately, monitor perfusion/urine output, and document SBAR communication. |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:978 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Treat confusion as dementia and continue routine activities. |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:979 | D | Why-tempting analysis is missing or too implicit. | Administer leftover antibiotics from a previous prescription. |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1007 | A | Distractor lacks realistic clinical action, assessment, or workflow language. | Dropping blood pressure with tachycardia, diaphoresis, anxiety, and low urine output |
| 68 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1009 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | A bruise is present where the client bumped the arm |
| 56 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1010 | D | Distractor lacks realistic clinical action, assessment, or workflow language. | The call bell is out of reach |
| 69 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1037 | A | Why-tempting analysis is missing or too implicit. | Assess orthostatic symptoms, immediate injury risk, medication changes, hydration, and notify the care team with objective findings.", correct: true,... |
| 63 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1051 | C | Distractor lacks realistic clinical action, assessment, or workflow language. | Remove all medications from the home without consultation. |
| 51 | NP | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:1058 | D | Absolute-language giveaway detected. | Focus only on tidying the home because environmental hazards are the sole cause of falls. |
| 68 | ECG | src/lib/ecg-module/ecg-simulation-expansions.ts:154 | a | Distractor lacks realistic clinical action, assessment, or workflow language. | Apply transcutaneous pacing pads and initiate pacing at 60–80 BPM", correct: true, consequenceNodeId: "paced-capture", rationale: "Hemodynamically un... |
| 68 | ECG | src/lib/ecg-module/ecg-simulation-expansions.ts:169 | c | Distractor lacks realistic clinical action, assessment, or workflow language. | Start a dopamine infusion at 5 mcg/kg/min to support heart rate and blood pressure |
| 62 | ECG | src/lib/ecg-module/ecg-simulation-expansions.ts:176 | d | Distractor lacks realistic clinical action, assessment, or workflow language. | Call for a 12-lead ECG and await cardiology consultation before initiating treatment |
| 67 | ECG | src/lib/ecg-module/ecg-simulation-expansions.ts:193 | a | Distractor lacks realistic clinical action, assessment, or workflow language. | A paced QRS complex appears after every pacemaker spike on the ECG |
| 60 | ECG | src/lib/ecg-module/ecg-simulation-expansions.ts:200 | b | Distractor lacks realistic clinical action, assessment, or workflow language. | A palpable carotid or femoral pulse at the paced rate of 70 BPM", correct: true, consequenceNodeId: "paced-capture", rationale: "MECHANICAL capture =... |
| 60 | ECG | src/lib/ecg-module/ecg-simulation-expansions.ts:214 | d | Distractor lacks realistic clinical action, assessment, or workflow language. | The pacemaker threshold meter shows 60 mA delivered |

## Duplicate Distractors

| Pathway | Source | Duplicate Count | Distractor |
| --- | --- | --- | --- |
