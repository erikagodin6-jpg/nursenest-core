# ECG Deterioration Expansion Roadmap

Date: 2026-06-01
Status: ECG deterioration roadmap for hidden planning

Source of truth: `docs/simulation-gap-analysis.md`, with exact ECG evidence from `src/lib/ecg-module/ecg-deterioration-engine.ts`.

## Current ECG Deterioration Inventory

| Metric | Current Exact Count | Target | Missing | Current % |
| --- | ---: | ---: | ---: | ---: |
| ECG deterioration pathways | 4 | 500 | 496 | 0.8% |

## Required Deterioration Families

| Pathway Family | Current Status | Required Direction |
| --- | --- | --- |
| PAC to AFib | Not specifically evidenced | Build atrial irritability, trigger recognition, rate change, escalation |
| PVC burden to VT | Existing deterioration engine includes PVC to VF family | Expand PVC burden, electrolyte correction, ischemia context |
| VT to VF | Existing physiology catalog has 8 `vt_to_vf` simulations | Expand unstable VT, pulseless VT, VF recognition, response timing |
| Mobitz II to complete heart block | Not specifically evidenced | Build bradycardia deterioration, perfusion, pacing escalation |
| Hyperkalemia to PEA | Hyperkalemia has 4 physiology simulations and 1 ECG clinical case JSON item | Expand ECG progression, renal risk, medication causes, PEA risk |
| STEMI to VT to VF | STEMI has 5 physiology simulations | Expand ischemia, reperfusion, rhythm deterioration, post-ROSC monitoring |

## Expansion Requirements

Every ECG deterioration pathway must include:

- Recognition
- Interpretation
- Prioritization
- Intervention
- Escalation
- Outcome evaluation
- Debrief
- Medication and electrolyte safety where relevant

## Priority Scorecard

| Initiative | Current % | Target % | Gap % | Effort Basis | Expected ROI | Priority Score |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| ECG deterioration pathway expansion | 0.8% | 95%+ | 94.2 | 496 missing pathways | Very high clinical judgment and premium value | 96 |
| Hyperkalemia to PEA pathway family | Partial | 95%+ | Not scoreable | 4 hyperkalemia simulations plus 1 ECG case item exist, pathway family incomplete | High safety value | 94 |
| STEMI to VT/VF pathway family | Partial | 95%+ | Not scoreable | 5 STEMI and 8 VT/VF simulation references exist | High RN/NP/ECG value | 93 |

