# Simulation Master Inventory

Date: 2026-06-01
Status: Repository-evidenced simulation inventory

Source of truth: `docs/simulation-gap-analysis.md`.

This inventory uses repository evidence only. It does not infer publication status, learner availability, or exam mapping from code presence. Future academies remain `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, and `adminOnly=true`.

## Evidence Sources

- `src/lib/physiology-monitor/simulation-catalog.ts`
- `src/lib/physiology-monitor/simulation-phase7-audit.ts`
- `src/lib/ecg-module/ecg-deterioration-engine.ts`
- `src/lib/ecg-module/ecg-pediatric-case-simulations.ts`
- `docs/simulation-gap-analysis.md`

## Status Boundary

The authored simulation catalog does not include `published`, `draft`, or `review` status fields. Therefore:

| Status Field | Repository-Evidenced Count |
| --- | --- |
| Published | Not evidenced |
| Draft | Not evidenced |
| Review | Not evidenced |
| Authored simulation references | 76 |

## Inventory By Profession

| Profession / Area | Authored Simulation References | Published | Draft | Review | Target | Missing |
| --- | ---: | --- | --- | --- | ---: | ---: |
| RN | 33 | Not evidenced | Not evidenced | Not evidenced | 250 | 217 |
| RPN | 8 | Not evidenced | Not evidenced | Not evidenced | 150 | 142 |
| NP | 18 | Not evidenced | Not evidenced | Not evidenced | Specialty-specific | Not scoreable |
| New Graduate | 11 | Not evidenced | Not evidenced | Not evidenced | 100 | 89 |
| RT / Allied evidence | 12 | Not evidenced | Not evidenced | Not evidenced | Not current revenue pathway | Not scoreable |
| ECG deterioration pathways | 4 | Not evidenced | Not evidenced | Not evidenced | 500 | 496 |
| Pediatric ECG case simulations | 6 | Not evidenced | Not evidenced | Not evidenced | Not separately standardized | Not scoreable |
| Labs | No standalone simulation inventory evidenced | Not evidenced | Not evidenced | Not evidenced | 100 | Not scoreable |
| Pharmacology | No standalone simulation inventory evidenced | Not evidenced | Not evidenced | Not evidenced | 75 | Not scoreable |
| Clinical Skills | No standalone simulation inventory evidenced | Not evidenced | Not evidenced | Not evidenced | Not standardized in source report | Not scoreable |

## Inventory By System / Specialty

| System / Specialty | Simulation References |
| --- | ---: |
| ICU | 45 |
| Emergency | 33 |
| Med-Surg | 28 |
| Telemetry | 13 |
| Cardiac | 11 |
| RT | 10 |
| Foundational | 8 |
| Critical Care | 3 |
| Ambulatory | 2 |
| Nephrology | 2 |
| Neurological | 2 |
| Surgical | 2 |
| Cardiac Surgery | 1 |
| Community | 1 |
| Gastroenterology | 1 |
| Medical | 1 |
| Neurology | 4 |
| Oncology | 1 |
| PACU | 1 |
| Pulmonary | 1 |
| Pulmonology | 1 |
| Renal | 1 |
| Respiratory | 1 |
| Toxicology | 1 |
| Trauma | 1 |

## Inventory By Topic / Condition

| Topic / Condition | Simulation References |
| --- | ---: |
| Sepsis | 10 |
| Septic shock | 2 |
| VT to VF | 8 |
| Increased ICP | 8 |
| ARDS | 5 |
| STEMI | 5 |
| Hyperkalemia | 4 |
| Opioid toxicity | 4 |
| AFib with RVR | 3 |
| DKA | 3 |
| Heart failure | 3 |
| Pulmonary embolism | 3 |
| Anaphylaxis | 2 |
| Cardiac tamponade | 2 |
| Pulmonary edema | 2 |
| RT auto-PEEP | 2 |
| Tension pneumothorax | 2 |
| Complex shock | 1 |
| GI bleed | 1 |
| Multi-system failure | 1 |
| RT accidental extubation | 1 |
| RT ventilator asynchrony | 1 |
| Stroke | 3 |

## Completeness Signals In Authored Simulation Catalog

| Signal | Simulation References With Evidence |
| --- | ---: |
| Patient history | 76 |
| Assessment | 76 |
| Evolving cues | 76 |
| Clinical decisions | 76 |
| Consequences | 72 |
| Deterioration pathway | 73 |
| Recovery pathway | 39 |
| Documentation | 76 |
| SBAR handoff | 76 |
| Debrief via learning objectives | 76 |
| Remediation mapping | 76 |

## Exam Mapping Finding

Simulation records are mapped by profession, specialty, condition, difficulty, NGN format, and NCJMM domains. They are not explicitly mapped by exam pathway in the catalog. Exam-specific readiness for NCLEX-RN, REx-PN, NCLEX-PN, CNPLE, FNP, AGPCNP, PMHNP, WHNP, and PNP-PC cannot be scored until simulation records include exam mapping or a separate simulation-to-pathway registry.

