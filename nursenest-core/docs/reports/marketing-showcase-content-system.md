# Marketing Showcase Content System

Generated from `src/lib/marketing/marketing-showcase-content.ts`.

This registry is the dedicated marketing content layer for screenshots, demos, homepage assets, pricing assets, sales pages, institutional presentations, investor materials, onboarding tours, and promotional campaigns.

## Governance

- Showcase items are curated metadata references, not production learner content mutations.
- Screenshot automation should select by `showcaseScore` and required metadata flags, not first item, random item, or newest item.
- Every item carries `marketingPriority=true`, `marketingShowcase=true`, and `featuredScreenshotCandidate=true`.
- Every capture should open the deep educational state described in `screenshotInstruction` before capture.

## Inventory

| Collection | Items | Required Minimum | Status |
| --- | ---: | ---: | --- |
| Bowtie Question | 20 | 20 | meets minimum |
| Cat Question | 5 | - | inventory |
| Clinical Skill | 10 | 10 | meets minimum |
| Ecg Case | 10 | 10 | meets minimum |
| Flashcard Example | 10 | - | inventory |
| Lab Activity | 10 | - | inventory |
| Lesson | 20 | 20 | meets minimum |
| Matrix Question | 20 | 20 | meets minimum |
| Medication Math Activity | 8 | - | inventory |
| Pharmacology Activity | 8 | - | inventory |
| Question Bank Item | 50 | 50 | meets minimum |
| Readiness Report | 4 | - | inventory |
| Sata Question | 10 | - | inventory |
| Simulation | 10 | 10 | meets minimum |

Total showcase items: 195

## Top Screenshot Candidates

| Rank | Type | Title | Score | Route | Capture Instruction |
| ---: | --- | --- | ---: | --- | --- |
| 1 | Simulation | Anaphylaxis Simulation | 98 | `/app/simulations?pathwayId=ca-rn-nclex-rn` | Open Anaphylaxis Simulation, progress to the first deterioration branch, choose an action, reveal consequence feedback, and capture the active scenario. |
| 2 | Bowtie Question | GI Bleed Hypovolemia Bowtie | 98 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open GI Bleed Hypovolemia Bowtie, select the correct condition, actions, and monitoring priorities, submit, and capture the completed bowtie with rationale. |
| 3 | Lab Activity | ABG Respiratory Failure Interpretation | 97 | `/app/labs?pathwayId=ca-rn-nclex-rn` | Open ABG Respiratory Failure Interpretation, select the clinically significant abnormal value, reveal interpretation and nursing priorities, then capture the workstation. |
| 4 | Flashcard Example | Chest Tube Troubleshooting | 97 | `/app/flashcards?pathwayId=ca-rn-nclex-rn` | Open Chest Tube Troubleshooting, flip the card, reveal rationale and memory hook, then capture the study state. |
| 5 | Simulation | DKA Emergency Simulation | 97 | `/app/simulations?pathwayId=ca-rn-nclex-rn` | Open DKA Emergency Simulation, progress to the first deterioration branch, choose an action, reveal consequence feedback, and capture the active scenario. |
| 6 | Clinical Skill | Foley Catheter Insertion Workflow | 97 | `/app/clinical-skills?pathwayId=ca-rn-nclex-rn` | Open Foley Catheter Insertion Workflow, advance to the safety decision step, reveal feedback, and capture the workflow. |
| 7 | Bowtie Question | Hyperkalemia Cardiac Safety Bowtie | 97 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Hyperkalemia Cardiac Safety Bowtie, select the correct condition, actions, and monitoring priorities, submit, and capture the completed bowtie with rationale. |
| 8 | Sata Question | Isolation Precautions SATA | 97 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Isolation Precautions SATA, submit selected responses, reveal rationale, and capture the completed SATA state. |
| 9 | Medication Math Activity | mL Per Hour Conversion | 97 | `/app/med-calculations?pathwayId=ca-rn-nclex-rn` | Open mL Per Hour Conversion, enter a completed calculation, reveal validation and safety feedback, then capture the activity. |
| 10 | Question Bank Item | Pediatric Dehydration | 97 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Pediatric Dehydration, answer it, reveal rationale, expand clinical pearl and exam strategy, then capture the answer state. |
| 11 | Question Bank Item | Postpartum Hemorrhage | 97 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Postpartum Hemorrhage, answer it, reveal rationale, expand clinical pearl and exam strategy, then capture the answer state. |
| 12 | Bowtie Question | Severe Asthma Exacerbation Bowtie | 97 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Severe Asthma Exacerbation Bowtie, select the correct condition, actions, and monitoring priorities, submit, and capture the completed bowtie with rationale. |
| 13 | Lesson | Shock States Lesson | 97 | `/app/lessons?pathwayId=ca-rn-nclex-rn` | Open Shock States Lesson, advance to the applied reasoning section, reveal the knowledge check, and capture the lesson body state. |
| 14 | Simulation | Stroke Escalation Simulation | 97 | `/app/simulations?pathwayId=ca-rn-nclex-rn` | Open Stroke Escalation Simulation, progress to the first deterioration branch, choose an action, reveal consequence feedback, and capture the active scenario. |
| 15 | Lesson | Tracheostomy Emergency Lesson | 97 | `/app/lessons?pathwayId=ca-rn-nclex-rn` | Open Tracheostomy Emergency Lesson, advance to the applied reasoning section, reveal the knowledge check, and capture the lesson body state. |
| 16 | Pharmacology Activity | Vasopressor Monitoring Workflow | 97 | `/app/pharmacology?pathwayId=ca-rn-nclex-rn` | Open Vasopressor Monitoring Workflow, reveal monitoring and nursing considerations, then capture the medication learning workflow. |
| 17 | Question Bank Item | Acute Kidney Injury | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Acute Kidney Injury, answer it, reveal rationale, expand clinical pearl and exam strategy, then capture the answer state. |
| 18 | Bowtie Question | Acute Transfusion Reaction Bowtie | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Acute Transfusion Reaction Bowtie, select the correct condition, actions, and monitoring priorities, submit, and capture the completed bowtie with rationale. |
| 19 | Bowtie Question | Anaphylaxis Emergency Bowtie | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Anaphylaxis Emergency Bowtie, select the correct condition, actions, and monitoring priorities, submit, and capture the completed bowtie with rationale. |
| 20 | Sata Question | Anticoagulant Teaching SATA | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Anticoagulant Teaching SATA, submit selected responses, reveal rationale, and capture the completed SATA state. |
| 21 | Question Bank Item | Atrial Fibrillation Anticoagulation | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Atrial Fibrillation Anticoagulation, answer it, reveal rationale, expand clinical pearl and exam strategy, then capture the answer state. |
| 22 | Lesson | Blood Transfusion Safety Lesson | 96 | `/app/lessons?pathwayId=ca-rn-nclex-rn` | Open Blood Transfusion Safety Lesson, advance to the applied reasoning section, reveal the knowledge check, and capture the lesson body state. |
| 23 | Question Bank Item | Burn Fluid Resuscitation | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Burn Fluid Resuscitation, answer it, reveal rationale, expand clinical pearl and exam strategy, then capture the answer state. |
| 24 | Matrix Question | Chest Tube Assessment Matrix | 96 | `/app/practice-tests?pathwayId=ca-rn-nclex-rn` | Open Chest Tube Assessment Matrix, complete the matrix, reveal the explanation, and capture the finished learning state. |

## Demo Readiness Learners

| Persona | Readiness | Strengths | Weak Areas | Recommendations |
| --- | ---: | --- | --- | --- |
| Struggling Student | 48% | Medication Safety Basics, Infection Control | Prioritization, Respiratory Deterioration, Lab Interpretation | Start COPD Oxygen Titration; Review ABG Respiratory Failure; Complete Sepsis First Action |
| Improving Student | 68% | Clinical Judgment, Pharmacology Monitoring | Delegation, Maternal Emergencies | Complete Delegation And Acuity Matrix; Practice Postpartum Hemorrhage Bowtie |
| Exam Ready Student | 86% | Prioritization, Safety, Physiological Adaptation | Pediatric Respiratory Distress | Maintain CAT cadence; Review pediatric respiratory safety flashcards |
| High Achiever | 94% | Clinical Reasoning, ECG Interpretation, Lab Interpretation, Delegation | Sustained Review Spacing | Continue smart review; Complete final readiness CAT |

## Automation Contract

Screenshot generators should call `selectMarketingShowcaseCandidates({ kind, audience, limit })` or `getTopMarketingShowcaseItem(kind)` and then perform the associated `screenshotInstruction` before capture.

