# Pharmacology Maturity Roadmap

Date: 2026-06-01
Status: Pharmacology maturity acceleration plan

Source of truth: `docs/content-maturity-dashboard.md` and `docs/pharmacology-parity-roadmap.md`.

Future products remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Maturity Target

| Dimension | Current | Target | Gap |
| --- | ---: | ---: | ---: |
| Coverage | 45% | 90% | 45 pts |
| Depth | 45% | 90% | 45 pts |
| Reasoning | 52% | 90% | 38 pts |
| Simulation | 25% | 85% | 60 pts |
| Readiness | 45% | 90% | 45 pts |
| Quality | 70% | 90% | 20 pts |
| Overall | 47% | 90% | 43 pts |

## Repository Evidence Boundary

The pharmacology parity roadmap identifies prior evidence of 20 medication categories and 100 medication mentions, but no reliable persisted pathway-level pharmacology bank count. Pharmacology maturity cannot safely claim 90% until a medication-class registry exists.

## Required Maturity Components

| Component | Required For 90% Maturity |
| --- | --- |
| Medication classes | Cardiovascular, endocrine, respiratory, psychiatric, antimicrobials, pain, emergency, critical care, renal, GI, maternal-child, pediatric |
| Monitoring | Labs, ECGs, vital signs, symptom response, toxicity signals, therapeutic effect |
| Toxicity | Recognition, assessment, immediate concerns, escalation, patient safety implications |
| Adverse effects | Common, serious, life-threatening, patient teaching, nursing monitoring |
| Interactions | Drug-drug, drug-disease, drug-food, older adult and pediatric risk |
| Patient teaching | Plain-language education, safety warnings, adherence, when to seek help |
| Simulations | Medication errors, toxicity, near misses, reconciliation failures, monitoring failures |

## Integration Requirements

| Integration | Minimum Standard |
| --- | --- |
| Labs | Every lab-monitored medication class maps to relevant labs, trends, critical values, and escalation thresholds |
| ECG | ECG-active medication classes map to rhythm risk, QT risk, bradycardia/tachycardia, hyperkalemia, digoxin, antiarrhythmics |
| Simulations | High-alert medication classes include medication safety simulations and deterioration consequences |
| Clinical Skills | Administration, verification, hold parameters, documentation, patient teaching |
| Questions | Every medication class has clinical reasoning, monitoring, adverse effect, and teaching questions |
| Flashcards | Every medication class produces clinical application flashcards, not definition-only cards |

## Medication Class Build Order

| Priority | Class Family | Why First |
| ---: | --- | --- |
| 1 | Insulin and glucose-lowering medications | High exam frequency, high safety risk, DKA/hypoglycemia integration |
| 2 | Anticoagulants and antiplatelets | High bleeding risk, labs, falls, stroke, ACS integration |
| 3 | Cardiovascular medications | ECG, ACS, heart failure, shock, vital sign monitoring |
| 4 | Electrolyte replacement and emergency electrolyte medications | Hyperkalemia, ECG, renal, critical-value integration |
| 5 | Opioids and sedatives | Respiratory depression, pain reassessment, safety, documentation |
| 6 | Antimicrobials | Sepsis, cultures, renal dosing awareness, allergic reactions |
| 7 | Psychiatric medications | PMHNP, safety, adverse effects, therapeutic response |
| 8 | Critical care medications | Vasoactives, sedation, emergency response, ICU readiness |

## Roadmap To 90%

| Stage | Target | Completion Evidence |
| --- | --- | --- |
| Instrumentation | Medication-class registry exists | Counts by class, profession, pathway, topic, status, review state |
| Foundation | 150 medication-class lessons | Reviewed lessons with mechanism, indications, monitoring, adverse effects, teaching |
| Question maturity | 1,500 medication questions | Enriched rationales, distractor rationales, hints, pearls, flashcard output |
| Flashcard maturity | 1,500 medication flashcards | Clinical application, memory anchor, exam relevance, common mistake |
| Simulation maturity | 75 medication safety simulations | Toxicity, near miss, adverse reaction, monitoring failure, reconciliation failure |
| Integration maturity | Lab/ECG/skills links complete | Medication classes linked to labs, ECG, skills, simulations, readiness domains |

## Blockers

- Persisted medication-class registry is missing.
- Standalone pharmacology simulation inventory is not evidenced.
- Standalone pharmacology flashcard status counts are not evidenced.
- Medication-lab and medication-ECG links are not standardized.

