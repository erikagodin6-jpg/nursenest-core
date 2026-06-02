# Lab Simulation Roadmap

Date: 2026-06-01
Status: Lab interpretation simulation roadmap

Source of truth: `docs/simulation-gap-analysis.md`.

## Current Lab Simulation Inventory

| Metric | Current Exact Count | Target | Missing |
| --- | --- | ---: | --- |
| Standalone lab simulation inventory | Not evidenced | 100 | Not scoreable |

The physiology simulation catalog contains lab-relevant topics such as DKA, hyperkalemia, sepsis, GI bleed, and renal/electrolyte deterioration, but no standalone lab simulation registry was found in repository evidence.

## Required Lab Simulation Families

| Family | Required Simulation Pattern |
| --- | --- |
| Critical values | Recognize critical value, assess patient, determine urgency, escalate |
| Trend interpretation | Compare prior/current values, identify worsening or improvement, act |
| Medication monitoring | Link lab trend to medication safety and adverse effects |
| Escalation | Decide when to notify, call rapid response, or follow protocol |
| Pattern recognition | Integrate multiple labs with vitals, symptoms, ECG, and history |

## First-Wave Topics

| Topic | Existing Related Simulation Evidence | Required Next Step |
| --- | ---: | --- |
| Hyperkalemia | 4 simulation references | Build lab-first and ECG-linked hyperkalemia scenarios |
| DKA | 3 simulation references | Build glucose, anion gap, potassium, fluid, and insulin trend scenarios |
| Sepsis lactate | 13 sepsis-related simulation references in source report | Build lactate trend and perfusion response scenarios |
| GI bleed hemoglobin trend | 1 GI bleed simulation reference | Build hemoglobin drop and shock-risk simulations |
| AKI creatinine trend | Renal-specific count not standalone | Build nephrotoxic medication and fluid balance cases |
| Anticoagulation monitoring | Not standalone evidenced | Build INR/PTT/bleeding-risk simulations |

## Priority Scorecard

| Initiative | Current % | Target % | Gap % | Effort Basis | Expected ROI | Priority Score |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| Lab simulation registry | Not scoreable | 95%+ | Not scoreable | Missing standalone inventory | Required before launch claims | 98 |
| Critical value simulations | Not scoreable | 95%+ | Not scoreable | Target 100 lab simulations | High clinical safety value | 94 |
| Trend interpretation simulations | Not scoreable | 95%+ | Not scoreable | No standalone trend count evidenced | High retention and readiness value | 92 |

