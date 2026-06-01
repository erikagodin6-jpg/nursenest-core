# High-Risk Simulation Library

Date: 2026-06-01
Status: High-risk simulation inventory blueprint

Source of truth: `docs/simulation-gap-analysis.md`.

No simulation is published by this document. This is a hidden inventory plan only.

## Required Simulation Reasoning Loop

Every high-risk simulation must teach:

1. Recognition
2. Interpretation
3. Prioritization
4. Intervention
5. Escalation
6. Evaluation

## Current High-Risk Coverage

| Topic | Current Simulation Evidence | Required Coverage Status |
| --- | ---: | --- |
| Sepsis | 13 simulation references in source report | Needs role-specific completion and readiness mapping |
| Shock | 8 simulation references | Needs shock subtype differentiation and escalation mapping |
| ACS | 5 simulation references | Needs telemetry, medication safety, and deterioration cases |
| Stroke | 3 simulation references | Needs acute recognition, last-known-well, swallow safety, and escalation cases |
| Respiratory Failure | 8 simulation references | Needs oxygenation, ventilation, ABG, and escalation cases |
| DKA | 3 simulation references | Needs fluid, potassium, insulin, and trend evaluation cases |
| Hyperkalemia | 4 simulation references | Needs ECG, medication, renal, and escalation integration |
| GI Bleed | 1 simulation reference | Critical gap |
| Postpartum Hemorrhage | 0 topic-specific simulation references evidenced | Critical gap |
| Pediatric Respiratory Distress | 0 topic-specific physiology-monitor references evidenced | Critical gap; 6 pediatric ECG case simulations exist separately |
| Medication Error Near Miss | 0 topic-specific simulation references evidenced | Critical gap |

## Library Build Requirements

| Topic | Recognition | Interpretation | Prioritization | Intervention | Escalation | Evaluation |
| --- | --- | --- | --- | --- | --- | --- |
| Sepsis | Infection plus perfusion changes | Source, lactate, organ dysfunction | Unstable perfusion first | Sepsis protocol support | Provider or rapid response | Response to fluids, antibiotics, vitals |
| Shock | Hypotension, altered perfusion | Shock subtype cues | ABCs and circulation | Fluids, oxygen, ordered therapies | Rapid response/provider | MAP, mentation, urine output |
| ACS | Chest pain equivalents, ECG cues | Troponin/ECG/risk pattern | Unstable cardiac symptoms | Monitoring and ordered therapy | STEMI or rapid escalation pathway | Pain, ECG, vitals, rhythm |
| Stroke | FAST cues, sudden neuro change | Glucose, timing, deficits | Time-sensitive neuro pathway | Safety, swallow precautions | Stroke alert/provider | Neuro checks and deterioration |
| Respiratory Failure | Work of breathing, SpO2 trend | Oxygenation vs ventilation | Airway/breathing first | Positioning, oxygen, monitoring | Rapid respiratory escalation | ABGs, SpO2, effort, LOC |
| DKA | Hyperglycemia, dehydration, Kussmaul | Acidosis, ketones, potassium risk | Fluids and potassium safety | Ordered insulin/fluids monitoring | Provider escalation | Anion gap, potassium, glucose trend |
| Hyperkalemia | Weakness, peaked T waves, renal risk | ECG plus potassium context | Cardiac monitoring first | Ordered stabilization support | Urgent provider/rapid response | ECG and potassium response |
| GI Bleed | Melena, hematemesis, orthostasis | Hemoglobin trend and perfusion | Circulation and bleeding risk | Monitoring, access, ordered fluids/blood | Provider/rapid response | Vitals, output, hemoglobin |
| Postpartum Hemorrhage | Heavy bleeding, boggy uterus | Uterine atony vs laceration | Hemorrhage response | Fundal massage/support orders | Obstetric emergency escalation | Bleeding, vitals, uterine tone |
| Pediatric Respiratory Distress | Retractions, fatigue, behavior change | Work of breathing and oxygenation | Breathing first | Positioning, oxygen, ordered meds | Pediatric escalation | Respiratory effort, SpO2, LOC |
| Medication Error Near Miss | Wrong drug/dose/time risk | Safety failure and patient risk | Stop and verify | Follow policy, monitor patient | Pharmacist/provider/charge nurse | Patient outcome and disclosure workflow |

## Required Debrief Standard

Each simulation must end with a debrief covering:

- Cues the learner should have recognized
- Why the priority was selected
- What action was safest
- What escalation threshold applied
- What outcome signal confirmed improvement or deterioration
- What remediation asset should be assigned next

