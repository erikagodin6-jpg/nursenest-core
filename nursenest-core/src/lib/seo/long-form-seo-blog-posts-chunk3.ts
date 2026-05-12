/**
 * CHUNK 3: 45 authoritative blog topics + 15 full posts
 *
 * Clusters:
 *   - CNPLE (15): Canadian NP licensure exam, LOFT format, prescribing, case-based reasoning
 *   - REx-PN (15): Canadian RPN entry-to-practice, CAT format, client needs, pharmacology
 *   - RT (15): Respiratory therapy, NBRC TMC/RRT, ABGs, ventilation, oxygen therapy
 *
 * All posts are English-first, clinically credible, and conversion-focused.
 * Route for CNPLE/REx-PN: /en/{region}/{profession}/{exam}/blog/{slug}
 * RT posts: standalone educational content linked from /allied-health/respiratory-therapy/*
 *
 * DISTINCT from all entries in:
 *   - long-form-seo-blog-posts.ts (lf-ph-1 … lf-uk-5)
 *   - long-form-seo-blog-posts-chunk2.ts (lf2-ph-1 … lf2-ca-5)
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";

export type LF3Section = { heading: string; body: string };
export type LF3Faq = { question: string; answer: string };
export type LF3Ref = { text: string };

export type LF3Topic = {
  id: string;
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string;
  exam: string;
  cluster: "cnple" | "rex-pn" | "respiratory-therapy";
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  searchIntent: "transactional" | "informational" | "comparison";
};

export type LF3Post = LF3Topic & {
  wordCount: number;
  sections: LF3Section[];
  faq: LF3Faq[];
  references: LF3Ref[];
};

// ═════════════════════════════════════════════════════════════════════════════
// CNPLE TOPICS (15) — Canadian NP licensure exam authority content
// ═════════════════════════════════════════════════════════════════════════════

export const LF3_CNPLE_TOPICS: LF3Topic[] = [
  { id: "lf3-cnple-1", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "CNPLE vs CNPE: What Changed and Why It Matters for Canadian NPs", metaTitle: "CNPLE vs CNPE Differences for Canadian NPs | NurseNest", metaDescription: "The CNPLE replaces the CNPE as Canada's NP licensure exam. What changed, who is affected, and how preparation strategy must shift for the 2026 transition.", slug: "cnple-vs-cnpe-what-changed-canadian-nps", primaryKeyword: "CNPLE vs CNPE differences", searchIntent: "informational" },
  { id: "lf3-cnple-2", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "How to Use Case Studies to Prepare for the CNPLE Effectively", metaTitle: "Case Studies for CNPLE Preparation | NurseNest", metaDescription: "Case-based reasoning is the core skill the CNPLE tests. How to use clinical scenarios to build NP-level diagnosis, prescribing, and investigation decisions.", slug: "how-to-use-case-studies-prepare-cnple", primaryKeyword: "CNPLE case study preparation", searchIntent: "informational" },
  { id: "lf3-cnple-3", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "CNPLE LOFT Format Pacing Strategies That Actually Work", metaTitle: "CNPLE LOFT Pacing Strategies | NurseNest", metaDescription: "LOFT is a fixed-length exam — there is no adaptive shortcut. These pacing strategies build the stamina and time discipline the CNPLE demands.", slug: "cnple-loft-pacing-strategies-that-work", primaryKeyword: "CNPLE LOFT pacing strategies", searchIntent: "informational" },
  { id: "lf3-cnple-4", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Prescribing Safety for the CNPLE: Drug Interactions Canadian NPs Miss", metaTitle: "CNPLE Prescribing Safety Drug Interactions | NurseNest", metaDescription: "Prescribing safety appears across every CNPLE clinical domain. The drug interactions, contraindications, and renal-dose pitfalls that cost the most marks.", slug: "cnple-prescribing-safety-drug-interactions-canadian-nps-miss", primaryKeyword: "CNPLE prescribing safety drug interactions", searchIntent: "informational" },
  { id: "lf3-cnple-5", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "CNPLE Study Plan for Working NPs: A 16-Week Framework", metaTitle: "CNPLE Study Plan Working NPs 16 Weeks | NurseNest", metaDescription: "A realistic 16-week CNPLE study plan designed for working nurse practitioners who cannot step back from full-time clinical practice.", slug: "cnple-study-plan-working-nps-16-week-framework", primaryKeyword: "CNPLE study plan working nurse practitioners", searchIntent: "transactional" },
  { id: "lf3-cnple-6", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Canadian NP Competencies: What the CNPLE Actually Tests in 2026", metaTitle: "Canadian NP Competencies CNPLE Tests 2026 | NurseNest", metaDescription: "The CNPLE is built on Canadian NP competency frameworks. Understanding the domains, depth, and clinical reasoning the exam targets — without guessing.", slug: "canadian-np-competencies-cnple-tests-2026", primaryKeyword: "Canadian NP competencies CNPLE 2026", searchIntent: "informational" },
  { id: "lf3-cnple-7", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "ABG Interpretation for NPs: Clinical Cases for CNPLE Preparation", metaTitle: "ABG Interpretation CNPLE NP Cases | NurseNest", metaDescription: "ABG interpretation in NP practice is not an ICU skill — it is a primary care diagnostic tool. How to apply it in CNPLE clinical vignettes.", slug: "abg-interpretation-nps-clinical-cases-cnple", primaryKeyword: "ABG interpretation CNPLE NP cases", searchIntent: "informational" },
  { id: "lf3-cnple-8", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Mental Health Prescribing on the CNPLE: High-Yield Topics for Canadian NPs", metaTitle: "CNPLE Mental Health Prescribing Canadian NPs | NurseNest", metaDescription: "Mental health prescribing is a high-frequency CNPLE domain. The medications, monitoring requirements, and safety decisions that appear most often.", slug: "cnple-mental-health-prescribing-high-yield-topics", primaryKeyword: "CNPLE mental health prescribing", searchIntent: "informational" },
  { id: "lf3-cnple-9", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Paediatric Cases on the CNPLE: What Is Clinically Different", metaTitle: "CNPLE Paediatric Cases Clinical Differences | NurseNest", metaDescription: "Paediatric CNPLE questions test different reasoning than adult primary care. The assessment, dosing, and developmental considerations that change the answer.", slug: "cnple-paediatric-cases-clinical-differences", primaryKeyword: "CNPLE paediatric cases", searchIntent: "informational" },
  { id: "lf3-cnple-10", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "CNPLE Provisional Registration: Province-by-Province Guide for 2026", metaTitle: "CNPLE Provisional Registration Province Guide 2026 | NurseNest", metaDescription: "Provisional registration rules differ across Canadian provinces. What each jurisdiction permits during the period between graduation and CNPLE completion.", slug: "cnple-provisional-registration-province-guide-2026", primaryKeyword: "CNPLE provisional registration provinces 2026", searchIntent: "informational" },
  { id: "lf3-cnple-11", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Canadian Screening Guidelines vs USPSTF: What CNPLE Candidates Must Know", metaTitle: "Canadian Screening vs USPSTF for CNPLE | NurseNest", metaDescription: "The Canadian Task Force guidelines differ from USPSTF on key screening topics. These differences change the correct CNPLE answer — here is what to know.", slug: "canadian-screening-guidelines-vs-uspstf-cnple-candidates", primaryKeyword: "Canadian screening guidelines USPSTF CNPLE", searchIntent: "informational" },
  { id: "lf3-cnple-12", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "ECG Interpretation for the CNPLE: Primary Care NP Essentials", metaTitle: "ECG Interpretation CNPLE Primary Care NP | NurseNest", metaDescription: "ECG interpretation in primary care NP practice is different from ICU nursing. The rhythms, findings, and management decisions the CNPLE tests.", slug: "ecg-interpretation-cnple-primary-care-np-essentials", primaryKeyword: "ECG interpretation CNPLE NP", searchIntent: "informational" },
  { id: "lf3-cnple-13", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Geriatric Prescribing on the CNPLE: Polypharmacy and Dose Adjustment", metaTitle: "CNPLE Geriatric Prescribing Polypharmacy | NurseNest", metaDescription: "Older adult prescribing is a high-yield CNPLE topic. Renal-adjusted dosing, Beers criteria drugs, and frailty-aware management decisions for Canadian NPs.", slug: "cnple-geriatric-prescribing-polypharmacy-dose-adjustment", primaryKeyword: "CNPLE geriatric prescribing polypharmacy", searchIntent: "informational" },
  { id: "lf3-cnple-14", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "CNPLE Pharmacology Pitfalls: Controlled Substances and Monitoring", metaTitle: "CNPLE Pharmacology Controlled Substances Monitoring | NurseNest", metaDescription: "Controlled substance prescribing under the Controlled Drugs and Substances Act is a distinct CNPLE competency. The monitoring requirements that appear most.", slug: "cnple-pharmacology-pitfalls-controlled-substances-monitoring", primaryKeyword: "CNPLE pharmacology controlled substances monitoring", searchIntent: "informational" },
  { id: "lf3-cnple-15", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple", title: "Differential Diagnosis Strategy for the CNPLE LOFT Exam", metaTitle: "Differential Diagnosis Strategy CNPLE LOFT | NurseNest", metaDescription: "Differential diagnosis is the core clinical reasoning skill the CNPLE tests. The systematic approach to building and narrowing differentials under time pressure.", slug: "differential-diagnosis-strategy-cnple-loft-exam", primaryKeyword: "CNPLE differential diagnosis strategy", searchIntent: "informational" },
];

// ═════════════════════════════════════════════════════════════════════════════
// REX-PN TOPICS (15) — Canadian RPN entry-to-practice authority content
// ═════════════════════════════════════════════════════════════════════════════

export const LF3_REX_PN_TOPICS: LF3Topic[] = [
  { id: "lf3-rex-1", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN vs NCLEX-PN: Key Differences for Canadian Practical Nurses", metaTitle: "REx-PN vs NCLEX-PN Differences Canadian RPNs | NurseNest", metaDescription: "The REx-PN and NCLEX-PN are separate exams for different regulatory systems. Why Canadian RPNs must prepare specifically for the REx-PN, not the NCLEX-PN.", slug: "rex-pn-vs-nclex-pn-differences-canadian-practical-nurses", primaryKeyword: "REx-PN vs NCLEX-PN differences", searchIntent: "comparison" },
  { id: "lf3-rex-2", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN Client Needs Framework: A Complete Study Guide for Canadian RPNs", metaTitle: "REx-PN Client Needs Framework Study Guide | NurseNest", metaDescription: "The REx-PN client needs blueprint organizes every exam topic into four categories. How to use client needs thinking to answer questions faster and more accurately.", slug: "rex-pn-client-needs-framework-complete-study-guide", primaryKeyword: "REx-PN client needs framework study guide", searchIntent: "informational" },
  { id: "lf3-rex-3", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "How CAT Works on the REx-PN: What 85 to 205 Questions Really Means", metaTitle: "How CAT Works REx-PN 85 to 205 Questions | NurseNest", metaDescription: "The REx-PN stops between 85 and 205 questions. What this means for your preparation, pacing, and how to interpret the exam experience on test day.", slug: "how-cat-works-rex-pn-85-205-questions-meaning", primaryKeyword: "how CAT works REx-PN questions", searchIntent: "informational" },
  { id: "lf3-rex-4", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN Pharmacology: The Medications Most Likely to Appear on the Exam", metaTitle: "REx-PN Pharmacology High-Yield Medications | NurseNest", metaDescription: "REx-PN pharmacology covers safe administration, side effects, and client teaching within RPN scope. The drug groups and monitoring questions that appear most.", slug: "rex-pn-pharmacology-medications-most-likely-to-appear", primaryKeyword: "REx-PN pharmacology high-yield medications", searchIntent: "informational" },
  { id: "lf3-rex-5", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN Wound Care Questions: What Gets Tested and How to Answer", metaTitle: "REx-PN Wound Care Questions What Gets Tested | NurseNest", metaDescription: "Wound care on the REx-PN tests assessment, dressing selection, infection recognition, and documentation within practical nursing scope. High-yield content covered.", slug: "rex-pn-wound-care-questions-what-gets-tested", primaryKeyword: "REx-PN wound care questions", searchIntent: "informational" },
  { id: "lf3-rex-6", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN Study Plan: 8-Week Framework for New Practical Nursing Graduates", metaTitle: "REx-PN 8-Week Study Plan New Graduates | NurseNest", metaDescription: "A structured 8-week REx-PN study plan for new practical nursing graduates balancing clinical experience, question practice, and CAT-format readiness.", slug: "rex-pn-study-plan-8-week-framework-new-graduates", primaryKeyword: "REx-PN 8-week study plan new graduates", searchIntent: "transactional" },
  { id: "lf3-rex-7", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "Infection Control on the REx-PN: Isolation Precautions and Safety Priority", metaTitle: "REx-PN Infection Control Isolation Precautions | NurseNest", metaDescription: "Infection control is one of the most tested REx-PN safe care topics. Standard precautions, isolation types, PPE, and the priority rules that the exam tests.", slug: "rex-pn-infection-control-isolation-precautions-safety", primaryKeyword: "REx-PN infection control isolation precautions", searchIntent: "informational" },
  { id: "lf3-rex-8", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "Mental Health Nursing on the REx-PN: Therapeutic Communication Techniques", metaTitle: "REx-PN Mental Health Therapeutic Communication | NurseNest", metaDescription: "Therapeutic communication and psychiatric safety are tested across the REx-PN psychosocial integrity category. The techniques, boundaries, and crisis recognition that score marks.", slug: "rex-pn-mental-health-therapeutic-communication-techniques", primaryKeyword: "REx-PN mental health therapeutic communication", searchIntent: "informational" },
  { id: "lf3-rex-9", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "Geriatric Care on the REx-PN: Fall Risk, Dementia, and Polypharmacy", metaTitle: "REx-PN Geriatric Care Fall Risk Dementia | NurseNest", metaDescription: "Older adult care is a high-frequency REx-PN topic spanning all client needs categories. Fall prevention, dementia assessment, and polypharmacy monitoring for Canadian RPNs.", slug: "rex-pn-geriatric-care-fall-risk-dementia-polypharmacy", primaryKeyword: "REx-PN geriatric care fall risk dementia", searchIntent: "informational" },
  { id: "lf3-rex-10", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "Delegation and Scope of Practice on the REx-PN: Canadian RPN Rules", metaTitle: "REx-PN Delegation Scope of Practice Canadian RPN | NurseNest", metaDescription: "Delegation questions are a safe care environment staple on the REx-PN. What Canadian RPNs can and cannot delegate, and why the Canadian context matters.", slug: "rex-pn-delegation-scope-practice-canadian-rpn-rules", primaryKeyword: "REx-PN delegation scope of practice Canadian", searchIntent: "informational" },
  { id: "lf3-rex-11", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN for Internationally Educated Nurses in Canada: Bridging Guide", metaTitle: "REx-PN Internationally Educated Nurses Canada Guide | NurseNest", metaDescription: "Internationally educated practical nurses preparing for the REx-PN in Canada face specific preparation gaps. Bridging requirements, scope differences, and study strategy.", slug: "rex-pn-internationally-educated-nurses-canada-bridging-guide", primaryKeyword: "REx-PN internationally educated nurses Canada", searchIntent: "informational" },
  { id: "lf3-rex-12", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN Pediatric Questions: What Canadian RPNs Need to Know", metaTitle: "REx-PN Pediatric Questions Canadian RPNs | NurseNest", metaDescription: "Paediatric nursing on the REx-PN tests developmental milestones, weight-based dosing, and family-centred care within the RPN scope. High-yield content covered.", slug: "rex-pn-pediatric-questions-canadian-rpns-need-to-know", primaryKeyword: "REx-PN pediatric questions Canadian RPNs", searchIntent: "informational" },
  { id: "lf3-rex-13", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "REx-PN Cardiovascular Questions: Priority Nursing Interventions for RPNs", metaTitle: "REx-PN Cardiovascular Priority Nursing Interventions | NurseNest", metaDescription: "Cardiovascular nursing on the REx-PN tests prioritization, monitoring, and safe intervention within RPN scope. Chest pain, arrhythmia, and heart failure decision-making.", slug: "rex-pn-cardiovascular-questions-priority-nursing-interventions", primaryKeyword: "REx-PN cardiovascular nursing priority interventions", searchIntent: "informational" },
  { id: "lf3-rex-14", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "Pain Management on the REx-PN: Canadian RPN Scope and Safety Priorities", metaTitle: "REx-PN Pain Management Canadian RPN Scope | NurseNest", metaDescription: "Pain management on the REx-PN tests assessment, analgesic monitoring, non-pharmacological approaches, and reporting. What stays within RPN scope and what requires escalation.", slug: "rex-pn-pain-management-canadian-rpn-scope-safety", primaryKeyword: "REx-PN pain management Canadian RPN scope", searchIntent: "informational" },
  { id: "lf3-rex-15", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn", title: "How Many REx-PN Practice Questions Do You Need to Pass?", metaTitle: "How Many REx-PN Practice Questions to Pass | NurseNest", metaDescription: "There is no magic number. What passing REx-PN candidates actually do with practice questions, and how quality of review matters more than total count.", slug: "how-many-rex-pn-practice-questions-to-pass", primaryKeyword: "how many REx-PN practice questions to pass", searchIntent: "informational" },
];

// ═════════════════════════════════════════════════════════════════════════════
// RESPIRATORY THERAPY TOPICS (15) — NBRC TMC/RRT authority content
// ═════════════════════════════════════════════════════════════════════════════

export const LF3_RT_TOPICS: LF3Topic[] = [
  { id: "lf3-rt-1", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "ABG Interpretation in 5 Steps: A Systematic Approach for RT Students", metaTitle: "ABG Interpretation 5 Steps RT Students | NurseNest", metaDescription: "A five-step systematic approach to arterial blood gas interpretation: pH, primary disorder, compensation, oxygenation, clinical action. No memorization required.", slug: "abg-interpretation-5-steps-systematic-approach-rt-students", primaryKeyword: "ABG interpretation steps RT students", searchIntent: "informational" },
  { id: "lf3-rt-2", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Mechanical Ventilation Modes Explained for RT Students and NBRC Candidates", metaTitle: "Mechanical Ventilation Modes Explained RT NBRC | NurseNest", metaDescription: "Volume control, pressure control, pressure support, and SIMV — ventilation modes explained with clinical decision rationale for RT students and NBRC exam candidates.", slug: "mechanical-ventilation-modes-explained-rt-students-nbrc", primaryKeyword: "mechanical ventilation modes explained RT NBRC", searchIntent: "informational" },
  { id: "lf3-rt-3", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Oxygen Delivery Devices: Which Device for Which Patient (2026 RT Guide)", metaTitle: "Oxygen Delivery Devices Which Patient RT Guide 2026 | NurseNest", metaDescription: "Nasal cannula vs Venturi mask vs non-rebreather vs high-flow: the clinical decision framework for matching oxygen delivery device to patient condition.", slug: "oxygen-delivery-devices-which-device-which-patient-rt-guide", primaryKeyword: "oxygen delivery devices which patient RT", searchIntent: "informational" },
  { id: "lf3-rt-4", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "NBRC TMC Exam: What to Expect and How to Prepare in 2026", metaTitle: "NBRC TMC Exam What to Expect Prepare 2026 | NurseNest", metaDescription: "The NBRC TMC exam leads to CRT certification. Content domains, question format, blueprint breakdown, and the preparation strategy that works for first-time candidates.", slug: "nbrc-tmc-exam-what-to-expect-prepare-2026", primaryKeyword: "NBRC TMC exam prepare 2026", searchIntent: "transactional" },
  { id: "lf3-rt-5", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Respiratory Assessment: Work of Breathing, SpO2, and Auscultation for RT", metaTitle: "Respiratory Assessment Work of Breathing SpO2 RT | NurseNest", metaDescription: "Respiratory assessment is the foundation of every RT clinical decision. Work of breathing, SpO2, breath sounds, and the findings that demand immediate action.", slug: "respiratory-assessment-work-of-breathing-spo2-auscultation-rt", primaryKeyword: "respiratory assessment work of breathing SpO2 RT", searchIntent: "informational" },
  { id: "lf3-rt-6", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "NIV vs High-Flow Oxygen: When to Use Each in Respiratory Failure", metaTitle: "NIV vs High-Flow Oxygen Respiratory Failure | NurseNest", metaDescription: "Non-invasive ventilation and high-flow nasal oxygen are both alternatives to intubation — but their indications, contraindications, and monitoring differ significantly.", slug: "niv-vs-high-flow-oxygen-respiratory-failure-when-to-use", primaryKeyword: "NIV vs high-flow oxygen respiratory failure", searchIntent: "informational" },
  { id: "lf3-rt-7", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "PEEP in Mechanical Ventilation: Clinical Rationale, Risks, and Titration", metaTitle: "PEEP Mechanical Ventilation Clinical Rationale Risks | NurseNest", metaDescription: "PEEP prevents alveolar collapse and improves oxygenation — but too much PEEP causes barotrauma and hemodynamic compromise. The titration principles RT students need.", slug: "peep-mechanical-ventilation-clinical-rationale-risks-titration", primaryKeyword: "PEEP mechanical ventilation clinical rationale", searchIntent: "informational" },
  { id: "lf3-rt-8", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Weaning from Mechanical Ventilation: Readiness Criteria and Protocols", metaTitle: "Weaning Mechanical Ventilation Readiness Criteria | NurseNest", metaDescription: "Ventilator weaning requires systematic readiness assessment. Spontaneous breathing trials, weaning parameters, extubation criteria, and common weaning failures.", slug: "weaning-mechanical-ventilation-readiness-criteria-protocols", primaryKeyword: "weaning mechanical ventilation readiness criteria", searchIntent: "informational" },
  { id: "lf3-rt-9", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Pediatric Respiratory Therapy: Key Clinical Differences from Adult Care", metaTitle: "Pediatric Respiratory Therapy Differences Adult Care | NurseNest", metaDescription: "Pediatric respiratory anatomy, physiology, and dosing differ fundamentally from adults. The clinical reasoning adaptations RT students must build for paediatric cases.", slug: "pediatric-respiratory-therapy-clinical-differences-adult-care", primaryKeyword: "pediatric respiratory therapy differences adult", searchIntent: "informational" },
  { id: "lf3-rt-10", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "COPD and Asthma on the RT Exam: Clinical Reasoning That Scores Marks", metaTitle: "COPD Asthma RT Exam Clinical Reasoning | NurseNest", metaDescription: "COPD and asthma are the highest-frequency obstructive disease topics on the NBRC TMC and RRT exams. The clinical differences that change management and exam answers.", slug: "copd-asthma-rt-exam-clinical-reasoning-scores-marks", primaryKeyword: "COPD asthma RT exam clinical reasoning", searchIntent: "informational" },
  { id: "lf3-rt-11", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Ventilator Alarms: Troubleshooting High Pressure and Low Volume for RT Students", metaTitle: "Ventilator Alarms Troubleshooting High Pressure Low Volume | NurseNest", metaDescription: "Ventilator alarms require systematic troubleshooting — patient first, then circuit, then machine. High pressure, low volume, and apnea alarm causes and responses.", slug: "ventilator-alarms-troubleshooting-high-pressure-low-volume-rt", primaryKeyword: "ventilator alarms troubleshooting RT students", searchIntent: "informational" },
  { id: "lf3-rt-12", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "ABG Compensation: Metabolic vs Respiratory, Acute vs Chronic", metaTitle: "ABG Compensation Metabolic Respiratory Acute Chronic | NurseNest", metaDescription: "ABG compensation is one of the most frequently missed RT exam topics. How to identify expected compensation, distinguish acute from chronic, and act on the findings.", slug: "abg-compensation-metabolic-respiratory-acute-chronic", primaryKeyword: "ABG compensation metabolic respiratory acute chronic", searchIntent: "informational" },
  { id: "lf3-rt-13", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Airway Management for RT Students: From NPA to Endotracheal Intubation", metaTitle: "Airway Management RT Students NPA Endotracheal | NurseNest", metaDescription: "Airway management spans insertion of a nasopharyngeal airway to assisting with intubation. Indications, technique, safety checks, and reassessment for RT students.", slug: "airway-management-rt-students-npa-endotracheal-intubation", primaryKeyword: "airway management RT students NPA endotracheal", searchIntent: "informational" },
  { id: "lf3-rt-14", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "Pulmonary Function Testing: Interpreting Obstruction vs Restriction for RT", metaTitle: "Pulmonary Function Testing Obstruction Restriction RT | NurseNest", metaDescription: "Spirometry patterns, FEV1/FVC ratio, lung volume interpretation, and quality criteria — PFT interpretation for RT students preparing for the NBRC exams.", slug: "pulmonary-function-testing-obstruction-restriction-rt", primaryKeyword: "pulmonary function testing obstruction restriction RT", searchIntent: "informational" },
  { id: "lf3-rt-15", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy", title: "RT Pharmacology: Bronchodilators, Steroids, and Mucolytics for NBRC Candidates", metaTitle: "RT Pharmacology Bronchodilators Steroids Mucolytics NBRC | NurseNest", metaDescription: "Respiratory therapy pharmacology covers inhaled and systemic agents. Bronchodilators, corticosteroids, mucolytics, and surfactants — mechanism, monitoring, and exam focus.", slug: "rt-pharmacology-bronchodilators-steroids-mucolytics-nbrc", primaryKeyword: "RT pharmacology bronchodilators steroids NBRC", searchIntent: "informational" },
];

// ═════════════════════════════════════════════════════════════════════════════
// FULL POSTS (15) — one per cluster with deep educational content
// ═════════════════════════════════════════════════════════════════════════════

export const LF3_POSTS: LF3Post[] = [
  // ── CNPLE full post 1 ─────────────────────────────────────────────────────
  {
    id: "lf3-cnple-fp-1", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple",
    title: "CNPLE LOFT Format Pacing Strategies That Actually Work",
    metaTitle: "CNPLE LOFT Pacing Strategies That Work | NurseNest",
    metaDescription: "LOFT is a fixed-length exam — there is no adaptive shortcut. These pacing strategies build the stamina and time discipline the CNPLE demands.",
    slug: "cnple-loft-pacing-strategies-that-work",
    primaryKeyword: "CNPLE LOFT pacing strategies",
    searchIntent: "informational",
    wordCount: 1050,
    sections: [
      {
        heading: "Why LOFT pacing is a distinct preparation target",
        body:
          "The CNPLE uses LOFT — linear on-the-fly testing — which means every candidate receives a fixed set of items regardless of performance. There is no adaptive shutdown, no early termination at 75 questions, and no difficulty calibration based on your responses. This format makes pacing a preparation variable rather than an examination artefact. Candidates who train exclusively with 20-question blocks or with computerized adaptive tools that shut off early arrive at the CNPLE with a significant unaddressed gap: they have never built the pacing discipline and concentration stamina required to maintain consistent clinical reasoning accuracy across a full-length linear examination. Unlike NCLEX preparation strategies, which often emphasize front-loading performance for early adaptive shutdown, CNPLE preparation must distribute quality reasoning across the entire item set — from question one to the final question, at the same calibre of engagement.",
      },
      {
        heading: "Calculating your target pace before examination day",
        body:
          "Effective LOFT pacing begins with arithmetic. Once CCRNR confirms the CNPLE item count and time allocation (check ccrnr.ca for current specifications), divide your total available time by the number of items to establish your per-question target. Most clinically complex vignettes require 90 to 120 seconds for careful reading, reasoning, and answer selection. Flag-and-return navigation, if available, adds a buffer strategy for items where your confidence is low. Build your pace calculation before simulation runs so that you are tracking a number, not a vague feeling. During timed simulation, check your pace at the quarter-mark, half-mark, and three-quarter mark. If you are consistently behind at the half-mark, your deficit at the three-quarter mark will compound — and the final quarter of a linear examination is where concentration typically degrades most sharply. Address pacing as a data problem, not a willpower problem.",
      },
      {
        heading: "Building stamina through progressive simulation",
        body:
          "Stamina for a multi-hour examination is not a fixed trait — it is a preparation outcome. The training mechanism is progressive full-length simulation under realistic conditions. Your first full-length LOFT simulation run, scheduled in the breadth phase of preparation (weeks six to eight), functions as a diagnostic: where does your accuracy drop in the second half? Where does your pace degrade? Where do you change correct first responses under time pressure? These patterns are the training targets for the pressure phase, not secondary concerns to address after reviewing content. The second and third full-length simulation runs in the pressure phase should be run under examination-day conditions: no phone access, timed breaks, and the same nutrition and hydration approach you intend to use on examination day. Pacing and stamina are physical preparation variables as much as cognitive ones. Candidates who discover their stamina gap on examination day rather than in simulation have wasted the most recoverable preparation asset available to them.",
      },
      {
        heading: "Managing difficult items without time collapse",
        body:
          "Under LOFT conditions, spending disproportionate time on difficult items is the most common pacing failure mode. When a clinical vignette presents unusual complexity — an atypical presentation, an unfamiliar prescribing scenario, or a Canadian guideline reference you cannot immediately recall — the instinct is to continue re-reading and recalculate. This instinct is costly. Under fixed-length timing, every extra minute spent on one difficult item is a minute removed from later items where your reasoning would have been clear and efficient. The better strategy is to make a best clinical decision, flag the item if navigation permits, and advance. On return, approach the flagged item with fresh eyes rather than continuing from where the previous attempt stalled. Most candidates who review flagged items correctly identify that their first response was better than their revised one — because clinical reasoning under manageable time pressure is generally more reliable than clinical reasoning under escalating time anxiety.",
      },
    ],
    faq: [
      { question: "How do I know if my pacing is adequate during simulation?", answer: "Track your position relative to your target pace at the 25%, 50%, and 75% marks of the item set. If you are within two minutes of target at each checkpoint, your pacing is functional. A deficit of five or more minutes at the midpoint is a signal that either your per-item time is too long or you are spending disproportionate time on a small number of difficult items." },
      { question: "Should I time my practice question blocks to build pacing?", answer: "Yes — but introduce timing after the foundation phase, not before. Timed short blocks (20 to 30 questions) are appropriate once your domain accuracy has stabilized. Timed simulation blocks (full examination length) are appropriate in the breadth and pressure phases. Introducing time pressure before accuracy is established adds noise rather than useful pacing data." },
      { question: "Is it better to flag questions and return or to commit immediately?", answer: "If CNPLE navigation permits flag-and-return, use it deliberately. Flag items where your confidence is genuinely split between two options and where a small additional piece of information in a later question might clarify the answer. Do not flag items simply because they are difficult — flag them only when return is likely to be productive." },
    ],
    references: [
      { text: "Canadian Council of Registered Nurse Regulators (CCRNR). CNPLE overview. Retrieved from ccrnr.ca" },
      { text: "NurseNest. CNPLE study guide. Retrieved from nursenest.ca/canada/np/cnple/study-guide" },
    ],
  },

  // ── CNPLE full post 2 ─────────────────────────────────────────────────────
  {
    id: "lf3-cnple-fp-2", region: "canada", locale: "en", profession: "np", exam: "cnple", cluster: "cnple",
    title: "Canadian Screening Guidelines vs USPSTF: What CNPLE Candidates Must Know",
    metaTitle: "Canadian vs USPSTF Screening Guidelines for CNPLE | NurseNest",
    metaDescription: "The Canadian Task Force guidelines differ from USPSTF on key screening topics. These differences directly change the correct CNPLE answer — here is what to know.",
    slug: "canadian-screening-guidelines-vs-uspstf-cnple-candidates",
    primaryKeyword: "Canadian screening guidelines USPSTF CNPLE",
    searchIntent: "informational",
    wordCount: 1000,
    sections: [
      {
        heading: "Why guideline source matters on the CNPLE",
        body:
          "The CNPLE is built on Canadian NP competency frameworks and is administered by CCRNR. All clinical content on the examination reflects Canadian practice standards — including the screening and preventive health recommendations of the Canadian Task Force on Preventive Health Care (CTFPHC) rather than the US Preventive Services Task Force (USPSTF). For candidates who have used any US-produced NP preparation material, this distinction is not academic: the two bodies issue different recommendations for several major screening topics, and choosing the USPSTF answer in a Canadian context can be the wrong answer on a CNPLE-style question. Candidates from Canadian NP programmes are exposed to CTFPHC recommendations throughout their training. Candidates who have supplemented with US NP review resources need to identify which topics carry guideline divergence and recalibrate their responses accordingly. This is not a minor detail — it is a systematic content correction that belongs in the foundation phase of preparation, not the final week.",
      },
      {
        heading: "Key areas of Canadian vs US screening divergence",
        body:
          "Several major screening topics differ in their Canadian Task Force and USPSTF recommendations. Breast cancer screening: the CTFPHC recommends against routine screening mammography for women aged 40 to 49, recommending instead starting at age 50 for average-risk women — this diverges from USPSTF 2024 updates that recommend starting at 40. Cervical cancer screening: Canadian guidelines have moved to primary hrHPV testing with extended screening intervals for low-risk individuals, and pap smear intervals differ from US recommendations in some age groups. Colorectal cancer screening: starting age and preferred modality recommendations have evolved in both bodies, and current Canadian recommendations should be confirmed from CTFPHC directly. Prostate cancer screening: the CTFPHC does not routinely recommend PSA screening for asymptomatic men, with stronger caution than some USPSTF guidance. Lung cancer screening with low-dose CT: eligibility thresholds and pack-year requirements for high-risk designation differ. In each of these areas, a CNPLE scenario that provides a patient profile and asks for the most appropriate screening recommendation has a Canadian-specific answer that may differ from the US-based answer a candidate memorized from American preparation material.",
      },
      {
        heading: "How to correct guideline calibration during preparation",
        body:
          "Correcting guideline calibration requires targeted content review rather than a complete restart of preparation. Review the CTFPHC website directly for current recommendations on the major screening topics: breast, cervical, colorectal, prostate, lung, and relevant paediatric and older adult screening targets. Where the CTFPHC recommendation differs from what you memorized, write the Canadian recommendation as a brief rule and attach it to a practice question that tests the clinical scenario. Then retest on the same scenario type within 48 hours to confirm the Canadian answer has replaced the US answer in your active recall. Pharmacology and prescribing also carry guideline implications: Canadian clinical practice guidelines for conditions like hypertension (Hypertension Canada), diabetes (Diabetes Canada), and cardiovascular risk (CCS) differ in targets, drug selection priorities, and monitoring intervals from American guidelines. NurseNest practice questions are calibrated to Canadian context — using Canadian-calibrated practice is more efficient than reading Canadian guideline documents without corresponding question practice.",
      },
    ],
    faq: [
      { question: "Does the CNPLE specify which guidelines are used?", answer: "CCRNR has not published a detailed guideline citation list for the CNPLE as of 2026. Based on publicly available Canadian NP competency frameworks and the Canadian NP educational context, the examination reflects Canadian practice standards and guidelines rather than US ones. NurseNest prepares candidates with Canadian guideline calibration. Confirm examination details directly with CCRNR." },
      { question: "Do I need to memorize every CTFPHC recommendation?", answer: "No. Focus on the major screening topics where Canadian and US recommendations diverge — breast, cervical, colorectal, prostate, and lung cancer screening are the highest priority. Secondary screening recommendations (vision, hearing, diabetes screening) are also worth reviewing from Canadian sources. The goal is Canadian calibration for the highest-frequency topics, not encyclopedic guideline memorization." },
    ],
    references: [
      { text: "Canadian Task Force on Preventive Health Care (CTFPHC). Canadian clinical practice guidelines. Retrieved from canadiantaskforce.ca" },
      { text: "NurseNest. CNPLE study guide. Retrieved from nursenest.ca/canada/np/cnple/study-guide" },
    ],
  },

  // ── REx-PN full post 1 ────────────────────────────────────────────────────
  {
    id: "lf3-rex-fp-1", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn",
    title: "REx-PN Client Needs Framework: A Complete Study Guide for Canadian RPNs",
    metaTitle: "REx-PN Client Needs Framework Study Guide RPNs | NurseNest",
    metaDescription: "The REx-PN client needs blueprint organizes every exam topic. How to use client needs thinking to answer REx-PN questions faster and more accurately.",
    slug: "rex-pn-client-needs-framework-complete-study-guide",
    primaryKeyword: "REx-PN client needs framework study guide",
    searchIntent: "informational",
    wordCount: 1050,
    sections: [
      {
        heading: "What the client needs framework means for REx-PN success",
        body:
          "The REx-PN examination is organized around a client needs framework — a taxonomy of nursing priorities that every question on the examination is testing, whether or not the question explicitly labels the category. Understanding this framework does not change which clinical knowledge you need; it changes how you read a question and which priority filter you apply before evaluating answer options. The four main client needs categories are: Safe and Effective Care Environment, which includes management of care and safety and infection control; Health Promotion and Maintenance; Psychosocial Integrity; and Physiological Integrity, which is subdivided into basic care and comfort, pharmacological and parenteral therapies, reduction of risk potential, and physiological adaptation. Physiological Integrity carries the largest proportion of the REx-PN blueprint and is the category that most candidates think of when they imagine a clinical nursing question. But the Safe and Effective Care Environment category — including delegation, prioritization, and safety — is where many candidates lose unexpected marks by reverting to clinical habit rather than applying the scope and safety lens the examination is testing.",
      },
      {
        heading: "Safe and effective care environment: what gets tested",
        body:
          "Safe care environment questions cover two areas: management of care and safety and infection control. Management of care tests your ability to prioritize clients, delegate safely within the RPN scope of practice, use the chain of command appropriately, and document or report effectively. Delegation questions are specifically calibrated to Canadian RPN scope — what a registered practical nurse can delegate to an unregulated care provider, and what requires RPN or RN/NP involvement. This distinction matters because Canadian hospital practice, particularly in Ontario under CNO standards, has specific scope delineations that differ from US practical nursing scope. Candidates who have studied US NCLEX-PN resources may carry incorrect delegation rules into their REx-PN preparation. Safety and infection control questions test standard precautions, transmission-based isolation categories, PPE selection, hand hygiene protocols, safe medication administration, fall prevention, restraint use, and environmental safety. These questions frequently appear as prioritization scenarios — a client in isolation who rings the call bell while two other clients have competing needs. The answer hinges on applying the correct isolation precaution and safety priority simultaneously.",
      },
      {
        heading: "Physiological integrity: the largest and most complex category",
        body:
          "Physiological Integrity questions comprise the largest proportion of the REx-PN blueprint and appear in four subcategories. Basic care and comfort tests hygiene, positioning, activity, rest, sleep, pain, and comfort within the RPN scope — often testing which intervention is most appropriate given the client's condition and position in recovery. Pharmacological and parenteral therapies is the highest-stakes subcategory: medication safety checks before administration, expected and adverse effects, when to hold a medication, client education, and the five rights of medication administration appear across many question types. Reduction of risk potential tests monitoring for potential complications — recognizing a post-operative bleeding risk, interpreting a laboratory value change, identifying a sign of infection — and escalating appropriately. Physiological adaptation tests responses to altered health states and management of complex physiological conditions. For candidates who struggle most in this category, the issue is usually not clinical knowledge but clinical priority: they select interventions that are clinically correct but not the most important first action given the client's current status and safety.",
      },
      {
        heading: "Using the client needs filter when answering questions",
        body:
          "The most practical application of the client needs framework is as a pre-reading filter. Before looking at the answer options, identify which client need the question is primarily testing. A question about a client in contact isolation who needs dressing care is not purely a wound care question — it is a safe care environment question that requires you to integrate isolation precautions into the dressing procedure. A question about a client with chronic heart failure asking about sodium restriction is not purely a dietary question — it is a health promotion question that tests your ability to deliver accurate and specific patient education within the RPN role. Misidentifying the primary client need leads candidates to select the most clinically accurate answer rather than the most contextually appropriate answer — and the REx-PN often has both available as options. After completing each practice block, tag every miss with the client need category it was testing. Patterns in your miss log reveal whether your gaps are in clinical knowledge, priority recognition, scope application, or all three.",
      },
    ],
    faq: [
      { question: "How do I know which client need a question is testing?", answer: "Read the question stem carefully for the task cue: what is the nurse being asked to do? Prioritize? Delegate? Educate? Intervene? The task cue usually reveals the client need category. Management-of-care and safety questions typically involve multiple clients or multiple tasks. Physiological integrity questions typically involve a clinical change that requires assessment or intervention. Psychosocial questions typically involve communication, emotional response, or therapeutic relationship." },
      { question: "Do I need to know the exact client needs percentages?", answer: "The relative weighting is published in the REx-PN test plan by CNA. Physiological Integrity consistently represents the largest proportion, and knowing this guides your study time allocation. However, preparing only for Physiological Integrity while neglecting Safe Care Environment questions is a common and costly mistake on the REx-PN. Distribute your practice across all categories in proportion to their blueprint weight." },
      { question: "How is the client needs framework different from NCLEX?", answer: "The REx-PN uses the same client needs categories as the NCLEX, which reflects the shared examination development partnership between CNA and NCSBN. However, Canadian RPN scope of practice and the specific clinical context of Canadian healthcare differ from US LPN/LVN scope. Questions are calibrated to Canadian practice standards, regulations, and workplace context." },
    ],
    references: [
      { text: "Canadian Nurses Association (CNA). REx-PN candidate information. Retrieved from cna-aiic.ca" },
      { text: "NurseNest. REx-PN client needs guide. Retrieved from nursenest.ca/canada/rpn/rex-pn/client-needs" },
    ],
  },

  // ── REx-PN full post 2 ────────────────────────────────────────────────────
  {
    id: "lf3-rex-fp-2", region: "canada", locale: "en", profession: "rpn", exam: "rex-pn", cluster: "rex-pn",
    title: "How Many REx-PN Practice Questions Do You Need to Pass?",
    metaTitle: "How Many REx-PN Practice Questions to Pass | NurseNest",
    metaDescription: "There is no magic question count. What passing REx-PN candidates actually do, and why quality of review matters far more than total number of questions.",
    slug: "how-many-rex-pn-practice-questions-to-pass",
    primaryKeyword: "how many REx-PN practice questions to pass",
    searchIntent: "informational",
    wordCount: 950,
    sections: [
      {
        heading: "Why the question count question has no useful answer",
        body:
          "Every year, REx-PN candidates search for a practice question target: 500, 1000, 2000, or more. This search reflects an understandable desire for a measurable preparation goal. The problem is that the relationship between question count and exam readiness is mediated entirely by how those questions are reviewed — and candidates who complete 2,000 questions with superficial review consistently underperform candidates who complete 600 questions with systematic rationale analysis and deliberate error correction. The REx-PN uses computerized adaptive testing, which means the examination adapts to your estimated ability level in real time. A candidate who has memorized 2,000 question answers without building genuine clinical reasoning will encounter unfamiliar stems on the actual examination and fail to transfer their preparation to novel presentations. A candidate who has built solid client needs reasoning through 600 questions reviewed carefully will recognize the priority structure of unfamiliar scenarios and apply the correct framework.",
      },
      {
        heading: "What passing candidates actually do with practice questions",
        body:
          "The practice patterns of successful REx-PN candidates share more in common around review quality than question volume. Successful candidates read every rationale — not just for missed questions, but for correctly answered questions as well. Correct answers reached through incorrect reasoning are a reliability risk: if you selected A because you pattern-matched a familiar clinical scenario without actually following the priority logic, the same superficial pattern-matching will fail you on a novel stem that looks similar but has a different correct priority. Successful candidates tag every miss with a category: was this a clinical knowledge gap, a priority error (I knew the options but ranked them wrong), a scope error (I assigned an action outside RPN scope), or a communication error (I chose a non-therapeutic response)? Each error type requires a different remediation. Clinical knowledge gaps go back to lesson review. Priority errors go back to the ABCD and Maslow hierarchy. Scope errors go back to RPN scope-of-practice documentation. Communication errors go back to therapeutic communication principles. Bundling all misses into a generic 'review' activity is the single most inefficient preparation approach available.",
      },
      {
        heading: "A practical question-count framework",
        body:
          "For candidates who need a concrete starting point: 400 to 600 practice questions reviewed with full rationale analysis is a reasonable minimum for candidates with solid foundational clinical knowledge from a recent Canadian practical nursing programme. Candidates with preparation gaps, extended time since graduation, or identified weak domains should target 700 to 1,000 questions distributed across their weak areas and supplemented by lesson review. Mixed-mode CAT sessions should begin after domain accuracy has stabilized — typically after two to three targeted blocks in each weak area have shown measurable improvement. The final two weeks of preparation should reduce new question volume and increase mixed simulation sessions to build pacing and uncertainty tolerance under examination-like conditions. Attempting new content review in the final 72 hours before the REx-PN is associated with increased anxiety and decreased performance relative to candidates who maintain a steady review routine through to examination day.",
      },
    ],
    faq: [
      { question: "Does doing more questions always improve my score?", answer: "No. Past a certain threshold of volume, additional questions with low-quality review produce diminishing returns. If you are completing questions without reading the full rationale, tagging your miss type, and reviewing the underlying concept within 48 hours, you are accumulating question exposure without building the reasoning accuracy the REx-PN tests. Quality-reviewed questions are far more valuable than high-volume superficial practice." },
      { question: "Should I time my practice questions from the beginning?", answer: "Not in the foundation phase. Early practice should focus on reasoning quality, not speed. Introduce time limits in mixed practice sessions after your domain accuracy has improved from baseline. The REx-PN CAT format means question difficulty adapts, so pacing becomes less critical than on fixed-length exams — but running out of time on individual questions because you are overthinking is still a risk to address in preparation." },
    ],
    references: [
      { text: "Canadian Nurses Association (CNA). REx-PN examination information. Retrieved from cna-aiic.ca" },
      { text: "NurseNest. REx-PN practice questions. Retrieved from nursenest.ca/canada/rpn/rex-pn/questions" },
    ],
  },

  // ── RT full post 1 ────────────────────────────────────────────────────────
  {
    id: "lf3-rt-fp-1", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy",
    title: "ABG Interpretation in 5 Steps: A Systematic Approach for RT Students",
    metaTitle: "ABG Interpretation 5 Steps RT Students | NurseNest",
    metaDescription: "A five-step systematic ABG approach: pH, primary disorder, compensation, oxygenation, clinical action. Build the interpretation habit that earns marks on NBRC exams.",
    slug: "abg-interpretation-5-steps-systematic-approach-rt-students",
    primaryKeyword: "ABG interpretation steps RT students",
    searchIntent: "informational",
    wordCount: 1100,
    sections: [
      {
        heading: "Why systematic ABG interpretation beats memorized patterns",
        body:
          "Most RT students begin ABG interpretation by trying to memorize patterns: respiratory acidosis looks like this, metabolic alkalosis looks like that. This approach works for straightforward single-disorder ABGs on early quizzes, but it fails on NBRC-style questions that present compensated, mixed, or clinically ambiguous results. A systematic five-step approach does not require memorizing patterns — it requires applying an ordered decision sequence to any ABG result, however simple or complex. The sequence is identical for every ABG: step one, classify the pH; step two, identify the primary disorder; step three, assess compensation; step four, evaluate oxygenation; step five, determine the clinical action. Applying the same sequence to every ABG builds an interpretive habit that works on novel presentations, time-pressured exam questions, and actual clinical scenarios. Candidates who skip the sequence and jump to pattern recognition from memory are the ones who misinterpret a compensated metabolic acidosis as a mixed disorder or miss a superimposed oxygenation problem because they stopped after naming the acid-base disorder.",
      },
      {
        heading: "Steps 1 and 2: pH and primary disorder",
        body:
          "Step one is to classify the pH as acidemia (below 7.35), alkalemia (above 7.45), or normal (7.35 to 7.45). If pH is normal, determine whether it is on the acidic side (7.35 to 7.40) or alkalotic side (7.40 to 7.45) — this distinction matters for compensated disorders. Step two is to identify the primary driver: if pH reflects acidemia, is PaCO2 elevated (respiratory acidosis) or HCO3 low (metabolic acidosis)? If pH reflects alkalemia, is PaCO2 low (respiratory alkalosis) or HCO3 high (metabolic alkalosis)? When both PaCO2 and HCO3 are abnormal in opposite directions relative to pH, the primary disorder is the one directionally consistent with the pH abnormality. The other abnormal value represents compensation. A common error is treating both as primary disorders and labeling the result mixed — but mixed disorders require both values to be abnormal in the same direction relative to the pH, or to be independently abnormal without compensatory explanation. Most ABGs encountered in educational contexts are single primary disorders with compensation, not mixed disorders.",
      },
      {
        heading: "Step 3: Assessing compensation adequacy",
        body:
          "Compensation is the body's attempt to normalize pH by adjusting the component not primarily disturbed. Respiratory compensation for metabolic disturbances is rapid (minutes to hours); renal compensation for respiratory disturbances is slow (days). Expected compensation ranges allow you to determine whether the observed compensatory response is appropriate (simple disorder with compensation), insufficient (mixed disorder where the secondary system is also impaired), or excessive (mixed disorder where the secondary system is independently driving in the same direction). For respiratory acidosis, expected metabolic compensation is approximately 1 mEq/L increase in HCO3 per 10 mmHg rise in PaCO2 acutely and 3.5 mEq/L chronically. For metabolic acidosis, expected respiratory compensation follows the Winter's formula: expected PaCO2 = (1.5 × HCO3) + 8 ± 2. These calculations are frequently tested on NBRC TMC questions as a means of identifying mixed disorders. On the RRT clinical simulation examination, compensation assessment informs ventilator management decisions in patients with chronic hypercapnia.",
      },
      {
        heading: "Steps 4 and 5: Oxygenation and clinical action",
        body:
          "Step four evaluates oxygenation using PaO2 and SpO2. Hypoxemia is defined as PaO2 below 80 mmHg or SpO2 below 95% on room air in adults, with age-adjusted thresholds in older adults. Severe hypoxemia (PaO2 below 60 mmHg, SpO2 below 90%) requires immediate oxygen intervention and escalation assessment. Critically, oxygenation assessment is independent of acid-base classification — a patient can have a normal acid-base ABG with a life-threatening PaO2, and treating only the acid-base finding while missing the oxygenation problem is a clinical and examination error. Step five is the clinical action: what does the complete ABG, integrated with the clinical context, indicate should happen next? A patient with chronic respiratory acidosis and baseline hypercapnia requires a different ventilatory response than a patient with acute respiratory acidosis who is newly deteriorating. A patient with metabolic acidosis requires identification of the underlying cause before acid-base correction rather than empirical bicarbonate administration. On NBRC examination questions, the fifth step is almost always the asked question — the ABG is provided to drive a management decision, not to test pattern labeling alone.",
      },
    ],
    faq: [
      { question: "What is the normal range for each ABG component?", answer: "Normal ABG values: pH 7.35–7.45, PaCO2 35–45 mmHg, HCO3 22–26 mEq/L, PaO2 80–100 mmHg (on room air), SaO2 ≥95%. These ranges are for adults at sea level. Age, altitude, and clinical context affect reference ranges — always interpret ABG values in the context of the patient's presentation and baseline." },
      { question: "How do I identify a mixed disorder vs a compensated single disorder?", answer: "A compensated single disorder has one abnormal primary value (PaCO2 or HCO3) with the other moving in the expected compensatory direction. A mixed disorder has both PaCO2 and HCO3 abnormal in directions that are independently contributing to the pH disturbance — or where compensation is absent despite the expected time frame having passed. Expected compensation calculations (Winter's formula, acute vs chronic respiratory compensation) distinguish these. Most educational ABGs are compensated single disorders." },
      { question: "Do NBRC TMC questions always give all four ABG values?", answer: "Most NBRC TMC questions that test ABG interpretation provide at least pH, PaCO2, and HCO3. PaO2 and SpO2 are typically provided when the question is testing oxygenation assessment or clinical management that depends on oxygenation status. Read the question stem carefully — some questions provide partial ABG data to test your ability to prioritize the available information." },
    ],
    references: [
      { text: "National Board for Respiratory Care (NBRC). Therapist multiple-choice examination (TMC). Retrieved from nbrc.org" },
      { text: "West, J.B. (2016). Respiratory physiology: the essentials (10th ed.). Lippincott Williams & Wilkins." },
      { text: "NurseNest. Respiratory therapy ABG practice. Retrieved from nursenest.ca/allied-health/respiratory-therapy/abgs" },
    ],
  },

  // ── RT full post 2 ────────────────────────────────────────────────────────
  {
    id: "lf3-rt-fp-2", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy",
    title: "NBRC TMC Exam: What to Expect and How to Prepare in 2026",
    metaTitle: "NBRC TMC Exam What to Expect Prepare 2026 | NurseNest",
    metaDescription: "The NBRC TMC exam leads to CRT certification. Blueprint, format, content domains, and the preparation strategy that works for first-time candidates in 2026.",
    slug: "nbrc-tmc-exam-what-to-expect-prepare-2026",
    primaryKeyword: "NBRC TMC exam prepare 2026",
    searchIntent: "transactional",
    wordCount: 1000,
    sections: [
      {
        heading: "What the NBRC TMC exam is and who takes it",
        body:
          "The Therapist Multiple-Choice (TMC) examination is administered by the National Board for Respiratory Care (NBRC) and is required for Certified Respiratory Therapist (CRT) credential. It is also the first examination in the two-part pathway to Registered Respiratory Therapist (RRT) credential — candidates who achieve the higher of two cut scores on the TMC become eligible to sit the Clinical Simulation Examination (CSE), which is required for RRT. The TMC is a 160-question computer-based examination covering the full scope of respiratory therapy practice: patient assessment and diagnostic testing, equipment and quality control, disease management, emergency care, and therapeutics. Most candidates sit the TMC within their first year after graduating from an accredited respiratory therapy programme. The examination is delivered at Pearson VUE test centres. NurseNest is an independent preparation resource and is not affiliated with the NBRC. Confirm current examination dates, fees, and eligibility requirements at nbrc.org.",
      },
      {
        heading: "TMC examination blueprint: what to prioritize",
        body:
          "The NBRC publishes a detailed content outline for the TMC that specifies the weighting of major content areas. Patient assessment — including history, physical examination, diagnostic testing interpretation (ABGs, spirometry, chest radiograph), and monitoring — represents a significant proportion of the examination. Therapeutic procedures — including oxygen therapy, aerosol therapy, airway management, mechanical ventilation, and pulmonary rehabilitation — represent another large section. Equipment handling and quality control includes performance of pulmonary function testing, equipment sterilization, and troubleshooting. Emergency care and support covers CPR, emergency response, advanced airway management, and critical care. The highest-yield preparation focuses on the intersection of assessment and intervention — specifically, ABG interpretation driving oxygen and ventilation decisions, and clinical presentation driving equipment selection and monitoring. Questions are framed as clinical scenarios requiring next-step or priority decisions, not isolated fact recall. The same candidate who can recite every ventilation mode from memory may fail TMC questions that present a specific patient with a specific ABG requiring a specific mode change and a specific monitoring parameter to check first.",
      },
      {
        heading: "Preparation strategy for first-time TMC candidates",
        body:
          "First-time TMC candidates who have recently graduated from an accredited programme typically need eight to twelve weeks of structured preparation. The foundation phase focuses on ABG interpretation, oxygen therapy, aerosol delivery systems, and basic pulmonary function testing — topics that form the clinical reasoning backbone of higher-level ventilation and emergency questions. The breadth phase adds mechanical ventilation modes, alarm troubleshooting, advanced airway management, and disease-specific management (COPD, asthma, ARDS, NICU). The pressure phase uses mixed practice sets and timed examination simulations to build pacing and confidence under examination conditions. A common preparation error is spending the majority of study time on knowledge recall — reviewing normal values, memorizing drug names, and reading therapy textbooks — without practising clinical scenario questions that require integration and decision-making. The TMC tests your ability to apply clinical knowledge to patient presentations, not to recite reference ranges. At least 60% of preparation time should be spent on practice questions with full rationale review.",
      },
      {
        heading: "The day-of experience and common first-time mistakes",
        body:
          "The TMC is delivered in a standard Pearson VUE testing environment. Bring two forms of government-issued identification. The examination is 160 questions with a time allocation — candidates should calculate their per-question pace before examination day and check their position at regular intervals. Common first-time TMC mistakes include: spending too much time on difficult questions rather than flagging and returning; changing correct first answers under time pressure without a concrete clinical reason to switch; reading additional data into question stems that are not there (the stem contains everything you need for the correct answer); and selecting interventions that are clinically appropriate in general but not the priority given the specific patient scenario. The TMC distinguishes between candidates who understand what respiratory therapy can do and candidates who understand what to do first, in what order, and with what monitoring. That distinction is built through practice, not through reading.",
      },
    ],
    faq: [
      { question: "What score do I need to pass the TMC?", answer: "The NBRC establishes cut scores for the TMC at two levels: the lower cut score results in CRT credential eligibility; the higher cut score results in CRT credential plus eligibility to sit the Clinical Simulation Examination for RRT. The specific passing scores are determined by standard-setting procedures and may be updated. Confirm current passing standards at nbrc.org." },
      { question: "Can I take the RRT exam if I do not pass the TMC?", answer: "No. The RRT pathway requires passing the TMC at the higher cut score before sitting the Clinical Simulation Examination. The CSE evaluates clinical problem-solving in scenario-based case format and is distinct from the multiple-choice TMC. Candidates who pass the TMC at the lower cut score earn CRT and may attempt the TMC again to achieve the higher cut score for RRT eligibility." },
      { question: "How long is the NBRC TMC certification valid?", answer: "CRT and RRT credentials require renewal through the NBRC credentialing maintenance programme. Renewal requirements include continuing education activities and payment of a renewal fee. Confirm current maintenance requirements at nbrc.org." },
    ],
    references: [
      { text: "National Board for Respiratory Care (NBRC). TMC examination candidate information. Retrieved from nbrc.org" },
      { text: "NurseNest. Respiratory therapy exam prep. Retrieved from nursenest.ca/allied-health/respiratory-therapy/exam-prep" },
    ],
  },

  // ── RT full post 3 ────────────────────────────────────────────────────────
  {
    id: "lf3-rt-fp-3", region: "canada", locale: "en", profession: "allied", exam: "respiratory-therapy", cluster: "respiratory-therapy",
    title: "Mechanical Ventilation Modes Explained for RT Students and NBRC Candidates",
    metaTitle: "Mechanical Ventilation Modes Explained RT NBRC | NurseNest",
    metaDescription: "Volume control, pressure control, pressure support, and SIMV — ventilation modes explained with clinical rationale for RT students and NBRC exam candidates.",
    slug: "mechanical-ventilation-modes-explained-rt-students-nbrc",
    primaryKeyword: "mechanical ventilation modes explained RT NBRC",
    searchIntent: "informational",
    wordCount: 1000,
    sections: [
      {
        heading: "Why understanding modes matters more than memorizing names",
        body:
          "Mechanical ventilation modes are described by their control variable (what the ventilator delivers as a fixed target) and their cycle variable (what ends the inspiratory phase). Volume-controlled modes set tidal volume as the fixed target and allow airway pressure to vary with compliance and resistance. Pressure-controlled modes set inspiratory pressure as the fixed target and allow tidal volume to vary with compliance and resistance. Pressure support modes are patient-triggered and flow-cycled — they amplify patient effort without guaranteeing a mandatory breath rate. NBRC TMC questions that ask about modes almost never ask you to recite definitions. They present a clinical scenario — a worsening compliance, an alarm, a patient-ventilator dyssynchrony — and ask which mode or setting change best addresses the problem. Answering these questions correctly requires understanding what each mode controls, what it allows to vary, what it monitors, and what can go wrong. Memorizing mode names without this clinical framework produces candidates who can label a ventilator display but cannot answer a scenario question under examination pressure.",
      },
      {
        heading: "Volume control (VCV): when to use and what to watch",
        body:
          "Volume-controlled ventilation delivers a set tidal volume with each breath. The advantage is guaranteed minute ventilation — you know exactly how much volume the patient is receiving per cycle. The risk is that airway pressure is not controlled and rises with decreasing compliance or increasing resistance. In a patient with worsening ARDS whose lungs are becoming stiffer, VCV will produce progressively higher peak pressures and potentially higher plateau pressures as compliance falls. The primary safety concern in VCV is volutrauma and barotrauma — delivering a safe tidal volume while monitoring that plateau pressure does not exceed 30 cmH2O. Lung-protective ventilation in ARDS uses low tidal volumes (6 mL/kg ideal body weight) with VCV and accepts permissive hypercapnia to protect alveolar structures from overdistension. NBRC questions on VCV most often test: what happens to pressure when compliance decreases with volume fixed (it rises); what plateau pressure threshold indicates barotrauma risk; and which adjustment addresses rising pressures in VCV without compromising minute ventilation.",
      },
      {
        heading: "Pressure control (PCV) and pressure support (PSV): patient effort and synchrony",
        body:
          "Pressure-controlled ventilation sets inspiratory pressure as the fixed target. Tidal volume varies with the patient's lung compliance and resistance — a patient whose compliance improves will receive a larger tidal volume at the same set pressure, and one whose compliance worsens will receive less. The advantage of PCV over VCV is a fixed pressure ceiling that prevents barotrauma if compliance changes — but the trade-off is variable minute ventilation. Clinicians using PCV must monitor delivered tidal volume continuously to detect compliance changes. Pressure support ventilation (PSV) applies a set level of pressure to patient-triggered breaths and cycles off when inspiratory flow drops to a threshold fraction of peak flow. PSV requires a patient who has a respiratory drive — it provides no mandatory backup breaths and is inappropriate for apneic patients. PSV is used for weaning to progressively reduce work of breathing as the patient's respiratory muscles recover. NBRC questions on PSV most frequently test: weaning readiness indicators, what happens during apnea on PSV alone (no backup), and why synchrony improves with PSV compared to controlled modes.",
      },
    ],
    faq: [
      { question: "What is SIMV and is it still used?", answer: "Synchronized Intermittent Mandatory Ventilation (SIMV) delivers a set number of mandatory breaths synchronized to patient effort and allows the patient to take additional spontaneous breaths between mandatory breaths. It was widely used for weaning but evidence has shifted toward PSV or spontaneous breathing trials for weaning because SIMV can increase work of breathing during spontaneous breaths between mandatory cycles. SIMV still appears on NBRC TMC questions and RT students should understand its mechanics." },
      { question: "What is the difference between peak pressure and plateau pressure?", answer: "Peak pressure (PIP) is the maximum pressure during the inspiratory cycle and reflects both airway resistance and compliance. Plateau pressure is measured during an inspiratory hold and reflects only elastic recoil — it is the pressure the lung must sustain to hold the delivered tidal volume and is the most clinically relevant indicator of alveolar distension risk. High PIP with normal plateau pressure indicates airway resistance problem. High plateau pressure indicates compliance problem (alveolar overdistension risk)." },
    ],
    references: [
      { text: "Tobin, M.J. (2006). Principles and practice of mechanical ventilation (2nd ed.). McGraw-Hill." },
      { text: "National Board for Respiratory Care (NBRC). TMC content outline. Retrieved from nbrc.org" },
      { text: "NurseNest. Mechanical ventilation review. Retrieved from nursenest.ca/allied-health/respiratory-therapy/mechanical-ventilation" },
    ],
  },
];

// Aggregate all topics for registry access
export const LF3_ALL_TOPICS: LF3Topic[] = [
  ...LF3_CNPLE_TOPICS,
  ...LF3_REX_PN_TOPICS,
  ...LF3_RT_TOPICS,
];
