# Pharmacology Simulation Roadmap

Date: 2026-06-01
Status: Pharmacology safety simulation roadmap

Source of truth: `docs/simulation-gap-analysis.md`.

## Current Pharmacology Simulation Inventory

| Metric | Current Exact Count | Target | Missing |
| --- | --- | ---: | --- |
| Standalone pharmacology safety simulation inventory | Not evidenced | 75 | Not scoreable |

The current physiology catalog includes medication-relevant topics such as opioid toxicity, anaphylaxis, DKA, hyperkalemia, ACS, and sepsis, but a standalone pharmacology simulation registry was not found in repository evidence.

## Required Pharmacology Simulation Families

| Family | Required Simulation Pattern |
| --- | --- |
| Medication errors | Wrong patient, wrong drug, wrong dose, wrong route, wrong time |
| Near misses | Identify risk before administration and stop the error chain |
| Adverse reactions | Recognize symptoms, assess severity, escalate safely |
| Toxicity | Link clinical findings to medication exposure and monitoring |
| Monitoring failures | Missed labs, vitals, ECG, sedation, glucose, or renal monitoring |
| Reconciliation failures | Admission, transfer, discharge, and duplicate therapy errors |

## First-Wave Topics

| Topic | Current Related Evidence | Required Next Step |
| --- | ---: | --- |
| Opioid toxicity | 4 simulation references | Build sedation, respiratory depression, naloxone protocol support, reassessment |
| Insulin safety | DKA has 3 simulation references | Build hypoglycemia, potassium, dose timing, and meal mismatch simulations |
| Anticoagulation | Not standalone evidenced | Build bleeding, INR, falls, reversal escalation, teaching cases |
| Antibiotics | Sepsis has 13 source-report references | Build allergy, timing, cultures, renal monitoring, stewardship scenarios |
| High-alert cardiovascular medications | STEMI, AFib, VT/VF evidence exists | Build bradycardia, hypotension, QT, antiarrhythmic safety cases |

## Priority Scorecard

| Initiative | Current % | Target % | Gap % | Effort Basis | Expected ROI | Priority Score |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| Pharmacology simulation registry | Not scoreable | 95%+ | Not scoreable | Missing standalone inventory | Required before launch claims | 98 |
| Medication error simulations | Not scoreable | 95%+ | Not scoreable | Target 75 pharmacology safety simulations | High patient safety value | 95 |
| Toxicity and adverse reaction simulations | Not scoreable | 95%+ | Not scoreable | Opioid/anaphylaxis evidence exists but family is incomplete | High clinical impact | 93 |

