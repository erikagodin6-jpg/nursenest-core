# PN Simulation Parity Roadmap

Date: 2026-06-01
Status: RPN / PN simulation parity roadmap

Source of truth: `docs/simulation-gap-analysis.md`.

## PN Target

| Metric | Current Exact Count | Target | Missing | Current % |
| --- | ---: | ---: | ---: | ---: |
| RPN simulation references | 8 | 150 | 142 | 5.3% |

## PN Focus Areas

| Focus | Current Evidence | Required Simulation Direction |
| --- | --- | --- |
| Predictable care | RPN simulations exist but are concentrated in telemetry and med-surg tags | Build predictable-to-unstable progression cases |
| Reporting | Not separately counted | Build SBAR and urgent reporting cases |
| Escalation | Present in deterioration simulation patterns, not PN-complete | Build when-to-report and when-to-call-now simulations |
| Medication safety | Not separately counted for PN | Build administration, hold parameter, adverse reaction, and near-miss cases |
| Documentation | Simulation catalog has documentation prompts, but PN documentation cases are not separately evidenced | Build refusal, fall, medication variance, and change-in-condition documentation cases |
| Delegation | Not separately counted for PN simulations | Build assignment, support worker collaboration, and scope-boundary cases |

## PN Build Sequence

1. Create PN-safe deterioration cases for sepsis, respiratory distress, heart failure, hyperkalemia, hypoglycemia, and falls.
2. Build medication safety and documentation as first-class simulation families.
3. Add practical-nursing scope checks to every simulation debrief.
4. Map REx-PN and NCLEX-PN separately; do not assume shared readiness without exam mapping.
5. Add readiness signals for recognition, reporting, documentation, safe implementation, and reassessment.

## PN Parity Scorecard

| Initiative | Current % | Target % | Gap % | Effort Basis | Expected ROI | Priority Score |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| PN simulation inventory expansion | 5.3% | 95%+ | 89.7 | 142 missing simulation references | Very high PN readiness value | 96 |
| PN escalation simulations | Not scoreable | 95%+ | Not scoreable | Escalation family not separately evidenced | Highest safety value | 98 |
| PN medication safety simulations | Not scoreable | 95%+ | Not scoreable | Medication safety family not separately evidenced | High retention and clinical value | 94 |
| PN documentation simulations | Not scoreable | 95%+ | Not scoreable | Documentation family not separately evidenced | High institutional value | 92 |

