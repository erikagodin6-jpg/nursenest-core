# Simulation Content Audit

Generated: 2026-05-30T03:26:35.490Z

This report is generated from the authored `SIMULATION_CATALOG` and `CLEARANCE_DEFINITIONS`. It reports real catalog counts only; it does not use marketing claims or estimated inventory.

## Executive Summary

- Authored simulations: 51
- Phase 7 target: 275
- Remaining authored-simulation gap: 224
- Current launch status: PARTIAL - content scale target not met

## Profession Counts

| Profession | Actual | Target | Gap | Status | Difficulty Mix | Conditions | NGN Format Mix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RN | 22 | 75 | 53 | PARTIAL | proficient: 10<br>advanced: 6<br>developing: 6 | 16 | bowtie: 17<br>sata: 16<br>matrix: 11<br>prioritization: 7<br>cloze: 5 |
| RPN | 8 | 50 | 42 | PARTIAL | developing: 5<br>foundational: 2<br>proficient: 1 | 6 | sata: 7<br>prioritization: 4<br>cloze: 3<br>bowtie: 1<br>matrix: 0 |
| NP | 10 | 50 | 40 | PARTIAL | advanced: 8<br>proficient: 2 | 10 | bowtie: 8<br>matrix: 7<br>cloze: 4<br>prioritization: 4<br>sata: 3 |
| RT | 8 | 50 | 42 | PARTIAL | advanced: 6<br>proficient: 2 | 5 | bowtie: 5<br>cloze: 5<br>sata: 5<br>matrix: 2<br>prioritization: 1 |
| NEW_GRAD | 6 | 50 | 44 | PARTIAL | foundational: 4<br>developing: 2 | 4 | sata: 6<br>cloze: 4<br>prioritization: 2<br>bowtie: 0<br>matrix: 0 |

## Coverage Gaps

- RN: 22/75 authored simulations (53 remaining)
- RPN: 8/50 authored simulations (42 remaining)
- NP: 10/50 authored simulations (40 remaining)
- RT: 8/50 authored simulations (42 remaining)
- NEW_GRAD: 6/50 authored simulations (44 remaining)

## Clearance Mapping Audit

| Clearance | Mapped Required Sims | Required Sims | Missing Required Simulation IDs |
| --- | --- | --- | --- |
| telemetry_ready | 3 | 3 | None |
| icu_ready | 3 | 3 | None |
| rt_critical_care_ready | 3 | 3 | None |
| new_grad_safe_practice | 2 | 2 | None |
| rn_entry_to_practice_ready | 3 | 3 | None |
| rpn_entry_to_practice_ready | 1 | 3 | rpn-respiratory-distress<br>rpn-sepsis-recognition |
| nclex_rn_ready | 4 | 4 | None |
| nclex_pn_ready | 1 | 3 | rpn-respiratory-distress<br>rpn-medication-safety |
| rex_pn_ready | 0 | 3 | rpn-sepsis-recognition<br>rpn-medication-safety<br>rpn-delegation |
| cnple_ready | 0 | 3 | np-urgent-care<br>np-diabetes-management<br>np-prescribing-safety |
| medication_safety_ready | 0 | 3 | rn-insulin-safety<br>rn-anticoagulation<br>np-opioid-overdose |
| delegation_ready | 0 | 2 | rn-delegation<br>ng-multi-patient-assignment |
| clinical_judgment_ready | 3 | 3 | None |
| emergency_ready | 3 | 4 | rn-shock |
| medical_surgical_ready | 4 | 4 | None |
| community_practice_ready | 0 | 3 | np-diabetes-management<br>np-cellulitis<br>rn-discharge-education |

## Simulation Inventory

| Simulation ID | Profession | Difficulty | Specialty | Condition | NCJMM Domains | NGN Formats | Clearance Mapping | Remediation Mapping |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rn-sepsis-early | RN | developing | med-surg, emergency, icu | sepsis | recognize_cues, prioritize_hypotheses, take_action | bowtie, matrix, sata | telemetry_ready, rn_entry_to_practice_ready, nclex_rn_ready, clinical_judgment_ready, medical_surgical_ready | Mapped |
| rn-septic-shock | RN | advanced | icu, emergency | sepsis | analyze_cues, generate_solutions, evaluate_outcomes | bowtie, matrix, prioritization | icu_ready | Mapped |
| rn-stemi | RN | proficient | emergency, telemetry, cardiac | stemi | recognize_cues, take_action | bowtie, sata, cloze | telemetry_ready, rn_entry_to_practice_ready, nclex_rn_ready, clinical_judgment_ready, emergency_ready | Mapped |
| rn-chf-exacerbation | RN | developing | med-surg, telemetry, cardiac | heart_failure | analyze_cues, generate_solutions, evaluate_outcomes | matrix, sata, prioritization | medical_surgical_ready | Mapped |
| rn-hyperkalemia | RN | proficient | renal, icu, med-surg | hyperkalemia | recognize_cues, analyze_cues, take_action | bowtie, sata, cloze | Unmapped | Mapped |
| rn-gi-bleed | RN | proficient | emergency, med-surg | gi_bleed | prioritize_hypotheses, take_action | prioritization, matrix, bowtie | medical_surgical_ready | Mapped |
| rn-stroke | RN | developing | med-surg, emergency, neurology | stroke | recognize_cues, prioritize_hypotheses | bowtie, sata, cloze | nclex_rn_ready, emergency_ready | Mapped |
| rn-respiratory-failure | RN | proficient | icu, emergency, med-surg | ards | analyze_cues, generate_solutions, take_action | bowtie, matrix, sata | icu_ready, rn_entry_to_practice_ready, nclex_rn_ready, clinical_judgment_ready, medical_surgical_ready | Mapped |
| rn-rapid-response | RN | developing | med-surg, telemetry | sepsis | recognize_cues, prioritize_hypotheses | sata, prioritization | Unmapped | Mapped |
| rn-code-blue | RN | advanced | med-surg, icu, emergency | vt_to_vf | recognize_cues, take_action | bowtie, sata | icu_ready | Mapped |
| rn-postop-deterioration | RN | developing | surgical, pacu, icu | opioid_toxicity | recognize_cues, analyze_cues, take_action | bowtie, sata, matrix | Unmapped | Mapped |
| rn-pe | RN | proficient | med-surg, emergency, icu | pulmonary_embolism | recognize_cues, analyze_cues | sata, bowtie, cloze | Unmapped | Mapped |
| rn-dka | RN | proficient | med-surg, emergency, icu | dka | analyze_cues, generate_solutions | matrix, cloze, bowtie | Unmapped | Mapped |
| rn-opioid-toxicity | RN | developing | med-surg, emergency, community | opioid_toxicity | recognize_cues, take_action | sata, bowtie | Unmapped | Mapped |
| rn-anaphylaxis | RN | proficient | med-surg, emergency, ambulatory | anaphylaxis | recognize_cues, take_action | bowtie, sata | emergency_ready | Mapped |
| rn-tamponade | RN | advanced | icu, cardiac, emergency | cardiac_tamponade | recognize_cues, analyze_cues, prioritize_hypotheses | bowtie, matrix, sata | Unmapped | Mapped |
| rn-tension-ptx | RN | advanced | icu, emergency, trauma | tension_pneumothorax | recognize_cues, take_action | bowtie, prioritization | Unmapped | Mapped |
| rpn-afib-monitoring | RPN | developing | telemetry, med-surg | afib_rvr | recognize_cues, prioritize_hypotheses | sata, cloze | telemetry_ready, rpn_entry_to_practice_ready, nclex_pn_ready | Mapped |
| rpn-chest-pain-escalation | RPN | developing | telemetry, med-surg | stemi | recognize_cues, prioritize_hypotheses | sata, prioritization | Unmapped | Mapped |
| rpn-bradycardia-monitoring | RPN | developing | telemetry, med-surg | increased_icp | recognize_cues, prioritize_hypotheses | sata, cloze | Unmapped | Mapped |
| rpn-code-assist | RPN | developing | med-surg, telemetry | vt_to_vf | take_action | sata | Unmapped | Mapped |
| rpn-oxygen-escalation | RPN | foundational | med-surg, telemetry | heart_failure | recognize_cues | sata, cloze | Unmapped | Mapped |
| rpn-telemetry-response | RPN | foundational | telemetry | afib_rvr | recognize_cues, prioritize_hypotheses | prioritization, sata | Unmapped | Mapped |
| np-acs-differential | NP | advanced | emergency, cardiac, np-practice | stemi | analyze_cues, prioritize_hypotheses, generate_solutions | bowtie, matrix, cloze | Unmapped | Mapped |
| np-complex-shock | NP | advanced | icu, emergency, np-practice | complex_shock | analyze_cues, generate_solutions, evaluate_outcomes | matrix, bowtie, cloze | Unmapped | Mapped |
| np-stable-vt | NP | advanced | cardiac, emergency, np-practice | vt_to_vf | analyze_cues, generate_solutions, take_action | bowtie, sata, prioritization | Unmapped | Mapped |
| np-afib-risk | NP | proficient | cardiac, ambulatory, np-practice | afib_rvr | analyze_cues, generate_solutions | matrix, cloze, bowtie | Unmapped | Mapped |
| np-mobitz-pacing | NP | advanced | cardiac, icu, np-practice | increased_icp | analyze_cues, generate_solutions | bowtie, sata, cloze | Unmapped | Mapped |
| np-multi-system-failure | NP | advanced | icu, np-practice | multi_system_failure | analyze_cues, generate_solutions, evaluate_outcomes | matrix, bowtie, prioritization | Unmapped | Mapped |
| rt-ards | RT | advanced | icu, rt | ards | analyze_cues, generate_solutions, take_action | bowtie, cloze, matrix | rt_critical_care_ready | Mapped |
| rt-auto-peep | RT | advanced | icu, rt | rt_auto_peep | recognize_cues, analyze_cues | cloze, bowtie, sata | rt_critical_care_ready | Mapped |
| rt-vent-asynchrony | RT | advanced | icu, rt | rt_vent_asynchrony | recognize_cues, analyze_cues | sata, cloze | Unmapped | Mapped |
| rt-accidental-extubation | RT | advanced | icu, rt | rt_accidental_extubation | take_action, evaluate_outcomes | bowtie, sata | rt_critical_care_ready | Mapped |
| rt-acls-role | RT | advanced | icu, rt, emergency | vt_to_vf | take_action, evaluate_outcomes | bowtie, sata | Unmapped | Mapped |
| rt-etco2-rosc | RT | proficient | icu, rt, emergency | vt_to_vf | recognize_cues, evaluate_outcomes | cloze, bowtie | Unmapped | Mapped |
| ng-documentation | NEW_GRAD | foundational | foundational | sepsis | recognize_cues | sata, cloze | Unmapped | Mapped |
| ng-stemi-recognition | NEW_GRAD | foundational | telemetry, med-surg | stemi | recognize_cues | sata, cloze | Unmapped | Mapped |
| ng-rapid-response | NEW_GRAD | foundational | med-surg | sepsis | recognize_cues, take_action | sata, prioritization | new_grad_safe_practice | Mapped |
| ng-code-observer | NEW_GRAD | foundational | foundational | vt_to_vf | recognize_cues | sata | Unmapped | Mapped |
| ng-deteriorating-patient | NEW_GRAD | developing | med-surg, telemetry | sepsis | recognize_cues, analyze_cues | sata, cloze, prioritization | new_grad_safe_practice | Mapped |
| ng-escalation-practice | NEW_GRAD | developing | foundational | heart_failure | prioritize_hypotheses, take_action | sata, cloze | Unmapped | Mapped |
| rn-pulmonary-edema | RN | proficient | cardiac, icu, emergency | pulmonary_edema | recognize_cues, take_action | sata, matrix | Unmapped | Mapped |
| rn-stroke | RN | proficient | neurological, emergency, icu | stroke | recognize_cues, analyze_cues, prioritize_hypotheses | bowtie, sata | nclex_rn_ready, emergency_ready | Mapped |
| rn-septic-shock-advanced | RN, NP | advanced | icu, critical-care | septic_shock | analyze_cues, generate_solutions, take_action | matrix, prioritization | Unmapped | Mapped |
| rpn-hyperkalemia-monitoring | RPN | developing | telemetry, medical | hyperkalemia | recognize_cues, take_action | sata, prioritization | Unmapped | Mapped |
| rpn-vt-recognition | RPN | proficient | telemetry, cardiac | vt_to_vf | recognize_cues, prioritize_hypotheses, take_action | bowtie, prioritization | Unmapped | Mapped |
| np-pulmonary-edema-intubation | NP | advanced | icu, emergency, critical-care | pulmonary_edema | analyze_cues, generate_solutions, take_action | matrix, bowtie | Unmapped | Mapped |
| np-stroke-management | NP | advanced | neurological, emergency | stroke | analyze_cues, prioritize_hypotheses, generate_solutions | matrix, prioritization | Unmapped | Mapped |
| rt-bronchospasm-management | RT | proficient | respiratory, icu | ards | recognize_cues, analyze_cues, take_action | sata, cloze | Unmapped | Mapped |
| rt-post-cardiac-arrest-rosc | RT, RN | advanced | icu, critical-care | vt_to_vf | take_action, evaluate_outcomes | matrix, prioritization | Unmapped | Mapped |
| np-opioid-overdose-management | NP, RN | proficient | emergency, toxicology | opioid_toxicity | recognize_cues, take_action, evaluate_outcomes | bowtie, sata | Unmapped | Mapped |

## Phase 7 Blockers

- P0: Authored simulation inventory does not meet the 250+ total / per-profession targets.
- P0: Missing clearance-required simulation IDs must be resolved before those clearances are marketed as earnable.
- P1: Pricing/homepage screenshots should be regenerated from the Playwright suite after QA credentials and a running app are available.
- P1: PostHog simulation events should be monitored for conversion and retention impact after deployment.
