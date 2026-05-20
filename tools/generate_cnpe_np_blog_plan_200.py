#!/usr/bin/env python3
"""Generate 200 CNPE-aligned blog PLAN objects (not articles)."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List


def slugify(title: str) -> str:
    s = title.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s[:88]


def links(*topics: str) -> List[str]:
    return list(topics)


def outline_primary(title: str) -> str:
    return "\n".join(
        [
            f"## Mechanism ladder (NP-level, primary care anchored): {title}",
            "### Cellular/organ drivers and compensatory physiology patients live with day-to-day",
            "### Where compensation hides severity until multimorbidity stacks",
            "## Primary care assessment + longitudinal reasoning",
            "### Visit cadence signals: vitals trends, symptom trajectories, adherence mechanisms",
            "### Labs/imaging as mechanism checks (interpretation traps in older adults and CKD)",
            "## Integrated management framing (not order-set prescribing)",
            "### How one medication class interacts with a second diagnosis (safety reasoning)",
            "### Deprescribing windows tied to physiology (when more becomes harmful)",
            "## CNPE exam translation",
            "### Decision nodes: screening vs diagnostic testing; when escalation beats watchful waiting",
            "### Communication scenarios: explain mechanism in plain language without losing accuracy",
        ]
    )


def outline_diff(title: str) -> str:
    return "\n".join(
        [
            f"## Side-by-side pathophysiology map: {title}",
            "### Shared upstream pathways (inflammation, autonomic tone, volume status, ischemia)",
            "### Divergent endpoints that change risks, timelines, and monitoring",
            "## Clinical findings linked to mechanism (not memorized buzzwords)",
            "### Exam clusters that discriminate without stereotype overfitting",
            "### Labs/biomarkers as probabilistic updates (Bayesian primary care thinking)",
            "## Dangerous overlaps and cannot-miss masquerades",
            "### When two processes coexist (mixed pictures) and how exams test sequencing",
            "### Red-flag features that collapse differentials quickly",
            "## CNPE-style reasoning prompts",
            "### Structured oral exam narrative: hypothesis to mechanism to test to rule-in/out",
            "### Documentation discipline: what you hand off to ED or specialty",
        ]
    )


def outline_red(title: str) -> str:
    return "\n".join(
        [
            f"## Decompensation physiology: {title}",
            "### Early compensatory phase: what looks stable but is not",
            "### Late failure modes: shock, airway, neurologic, or metabolic catastrophe pathways",
            "## Early vs late bedside signatures tied to mechanism",
            "### Vitals, work of breathing, perfusion, urine output, mentation as integrated indices",
            "### Common confounders (pain, anxiety, baseline chronic abnormalities)",
            "## Red flags (explicit)",
            "### Features that should trigger EMS or emergency evaluation in primary care contexts",
            "### Features that require parallel work-up (infection plus ischemia plus obstruction patterns)",
            "## NP clinical action framing (systems-aware)",
            "### What to do in-clinic vs what to route immediately; closed-loop communication",
            "### Monitoring cadence if brief observation is appropriate (only when clinically safe)",
            "## CNPE traps",
            "### Benign mimics; anchoring errors; over-trusting normal oxygen saturation",
        ]
    )


def outline_multi(title: str) -> str:
    return "\n".join(
        [
            f"## Multi-system interaction map: {title}",
            "### Organ A to mediator to organ B (hormonal, inflammatory, hemodynamic, neural)",
            "### Feedback loops that accelerate decline when two chronic diseases coexist",
            "## Real primary care phenotypes (polypharmacy, frailty, mental health overlays)",
            "### How one disease changes drug risks for another (renal, hepatic, autonomic)",
            "### How functional status changes symptom reporting and objective findings",
            "## Integrated reasoning for Canadian-style panels (without inventing statistics)",
            "### Prioritization: which problem is driving harm this month",
            "### Negotiable vs non-negotiable targets when goals-of-care shift",
            "## CNPE exam prompts",
            "### Case stems that test cascade thinking (HF plus CKD plus AF patterns)",
            "### What you teach the patient to monitor and why (mechanism-linked education)",
        ]
    )


def outline_canada(title: str) -> str:
    return "\n".join(
        [
            f"## Canadian primary care and population health lens: {title}",
            "### Clinical mechanism first (same science, clearer triage)",
            "### How access, geography, and program design change timelines (not biology alone)",
            "## Respectful equity and Indigenous health considerations (structure, not stereotypes)",
            "### Colonialism, displacement, and jurisdictional complexity as access mediators",
            "### Community-led wellness models as complementary pathways when clinically appropriate",
            "## Rural and remote implications",
            "### Transport, weather, medevac thresholds, and telehealth substitution limits",
            "### Pharmacy and nursing access as de facto monitoring front lines",
            "## Public health linkage",
            "### Screening programs, outbreak tools, immunization schedules (province and territory aware)",
            "## CNPE integration",
            "### System-level documentation: barriers identified and mitigations activated",
        ]
    )


def outline_advanced(title: str) -> str:
    return "\n".join(
        [
            f"## Advanced mechanism depth (still clinically usable): {title}",
            "### Cell signaling or receptor pathways relevant to bedside decisions",
            "### Hemodynamic, acid-base, or immunologic math-in-words (no calculator theatre)",
            "## Translation to NP decisions",
            "### What advanced physiology explains about treatment ceilings and harms",
            "### Why normal labs can still be incompatible with stability in specific states",
            "## Exam edge cases",
            "### Mixed disturbances; compensated vs uncompensated patterns",
            "### Phenotype splitting only when the title demands it (avoid forced digressions)",
        ]
    )


def intent_for(category: str, title: str) -> str:
    return (
        f"CNPE preparation: NP-level mechanism-first reasoning in {category} for long-tail query: "
        f"{title} (clinical integration, safety, and primary care scope boundaries)."
    )


def build() -> Dict[str, List[dict]]:
    PrimaryCare = [
        "Why Nocturnal Hypertension Tracks With Obstructive Sleep Apnea: Sympathetic Bursts, Renin-Angiotensin Coupling, and Masked Clinic Normotension",
        "How Visceral Adiposity Drives Morning Hyperglycemia in Type 2 Diabetes: Hepatic Gluconeogenesis, Growth Hormone Pulses, and Dawn Phenomenon Pathways",
        "Why Chronic Venous Insufficiency Worsens Bilateral Edema in Patients With Heart Failure: Hydrostatic Additivity and Lymphatic Reserve Limits",
        "How Hypothyroidism Alters Lipoprotein Kinetics and Diastolic Blood Pressure: Vascular Stiffness, LDL Receptor Expression, and Renal Sodium Handling",
        "Why Postprandial Hypotension Emerges in Autonomic Neuropathy of Diabetes: Splanchnic Sequestration and Baroreflex Failure Mechanisms",
        "How Chronic Kidney Disease Shifts Thiazide Response and Gout Flare Risk: Urate Excretion, Diuretic-Induced Hyperuricemia, and RAAS Context",
        "Why Atrial Fibrillation Begets Heart Failure Exacerbations: Rapid Ventricular Response Remodeling and Loss of Atrial Kick in Already Stiff Ventricles",
        "How Chronic Pain Amplifies Insulin Resistance Through Sleep Fragmentation: HPA Axis, Sympathetic Tone, and Inflammatory Cytokine Crosstalk",
        "Why Iron Deficiency Hides Behind Normal Ferritin in Inflammation: Hepcidin Elevation and Reticuloendothelial Iron Trapping in Primary Care Panels",
        "How Benign Prostatic Hyperplasia Intersects With Anticholinergic Burden: Outlet Resistance Plus Bladder Antimuscarinic Side Effects in Older Adults",
        "Why Postural Hypotension Worsens After Diuretic Intensification in Frail Hypertension: Baroreceptor Gain, Reduced Venous Compliance, and Deconditioning",
        "How Chronic NSAID Exposure Reveals Underlying Heart Failure: Sodium Retention, Afterload Mismatch, and AKI-Triggered Congestion",
        "Why Migraine With Aura Changes Contraceptive Risk Conversations: Estrogen-Related Thrombosis Pathways and Stroke Mechanism Nuance (Exam-Framed)",
        "How Polycystic Ovary Syndrome Accelerates NAFLD Risk: Hepatic Insulin Resistance, Androgen Effects on Adipose Tissue, and Portal Hyperinsulinemia",
        "Why Chronic Anxiety Mimics Hyperthyroidism on Vitals: Adrenergic Tone, Tremor, and Weight Loss Without TSH Suppression (Differentiation Hooks)",
        "How Chronic Corticosteroid Burden Layers Osteoporosis Risk Onto Inflammatory Disease: Osteoclast Activation With Concurrent Muscle Atrophy and Falls",
        "Why Vitamin B12 Deficiency Presents as Neuropathy Before Macrocytosis: Myelin Synthesis Kinetics and Compensatory Hematologic Lag",
        "How Chronic GERD Mechanisms Overlap With Chronic Cough: Microaspiration, Esophageal-Bronchial Reflex, and Cough Hypersensitivity Integration",
        "Why Chronic Kidney Disease Worsens Pruritus and Sleep: Uremic Toxin Hypotheses, Immune Dysregulation, and Circadian Fragmentation",
        "How Chronic Alcohol Use Disorder Alters Thiamine Requirements and Cardiac Remodeling: Beriberi Spectrum and Dilated Cardiomyopathy Overlap",
        "Why Chronic Hypertension in Diabetes Accelerates Albuminuria: Glomerular Hyperfiltration Injury With RAAS Amplification",
        "How Chronic Inflammatory Skin Disease Increases Sleep Disturbance and Cardiometabolic Load: Itch-Scratch Cycles and Systemic Inflammation",
        "Why Chronic Opioid Therapy Worsens Constipation and Nausea Beyond mu-Receptors: Gastric Stasis, Central Chemoreceptor Effects, and Dehydration Loops",
        "How Chronic Kidney Disease Alters Drug Clearance for Common Primary Care Medications: Protein Binding, Tubular Secretion, and Active Metabolites",
        "Why Chronic Heart Failure Patients Crash After High-Salt Meals: Sodium Avidity, Neurohormonal Lag, and Rapid Plasma Volume Expansion",
        "How Chronic COPD Changes Beta-Blocker Tolerability Conversations: Bronchial Tone, Selectivity Nuance, and Cardiac Protection Tradeoffs",
        "Why Chronic Insomnia Drives Resistant Hypertension: Sympathetic Overdrive, Salt Sensitivity, and Poor Home BP Monitoring Adherence",
        "How Chronic Hypokalemia From Diuretics Interacts With Digoxin: Na/K ATPase Vulnerability and Arrhythmogenesis Mechanisms",
        "Why Chronic Constipation Worsens Urinary Frequency in Older Adults: Pelvic Floor Dyssynergia, Shared Autonomic Dysregulation, and Medication Overlap",
        "How Chronic Depression Reduces Diabetes Self-Management Capacity: Executive Function, Motivation Neurocircuitry, and Inflammation-Mediated Fatigue",
        "Why Chronic Atrial Fibrillation Complicates CKD Management: Rate Control Hemodynamics, Anticoagulation-Bleeding Balance, and Hyperkalemia Risk Layering",
        "How Chronic Liver Steatosis Alters Thyroid Hormone Tests: Binding Protein Shifts, Inflammation, and Confounding Sick Euthyroid Patterns",
        "Why Chronic Venous Disease Increases Cellulitis Recurrence Risk: Skin Barrier Breakdown, Edema, and Lymphatic Insufficiency Feedback",
        "How Chronic Hyperuricemia Links Gout Flares to Metabolic Syndrome: Insulin Resistance, Vascular Tone, and Crystal Nucleation Thresholds",
        "Why Chronic PPI Therapy Intersects With Hypomagnesemia and Tremor: GI Absorption, Neuromuscular Excitability, and Diuretic Co-Therapy",
        "How Chronic Kidney Disease Alters Warfarin and DOAC Conversations: Protein Binding, Gut Vitamin K, and Bleeding Risk Phenotypes",
        "Why Chronic Heart Failure Patients Develop Sarcopenia: Inflammatory Catabolism, Anabolic Resistance, and Deconditioning Spirals",
        "How Chronic Thyroid Autoimmunity Fluctuates in Perimenopause: Estrogen Effects on Immune Tone and TSH Instability",
        "Why Chronic Kidney Disease Worsens Anemia-Related Dyspnea Even Without Volume Overload: Oxygen Delivery and Ventilatory Drive",
        "How Chronic Benzodiazepines Increase Fall Risk in Patients With Peripheral Neuropathy: GABAergic Sedation Plus Proprioceptive Loss",
        "Why Chronic Antihypertensive Therapy Can Unmask Renal Artery Stenosis Patterns: GFR Autoregulation Limits and Creatinine Bump Interpretation",
        "How Chronic Smoking Accelerates Aortic Stiffness Beyond the Lungs: Endothelial Dysfunction and Pulse Wave Reflection Mechanisms",
        "Why Chronic Alcohol Bingeing Triggers Holiday Heart: Catecholamine Surges, Electrolyte Shifts, and Atrial Ectopy Substrates",
        "How Chronic Deconditioning After Hospitalization Worsens Orthostasis: Venous Pooling, Reduced Stroke Volume Reserve, and Autonomic Sluggishness",
        "Why Chronic Pain Patients Develop Hyponatremia on SSRIs: SIADH Risk Layering With Low Solute Intake and Thiazide Co-Therapy",
        "How Chronic Diarrhea Syndromes Deplete Magnesium and Thiamine: GI Losses, Reabsorption Limits, and Neuromuscular Complication Chains",
        "Why Chronic Heart Failure Patients Develop Iron Deficiency Beyond Bleeding: Hepcidin, Hemodilution, and Gut Congestion Hypotheses",
        "How Chronic Atopic Dermatitis Increases Skin Infection Risk: Barrier Defects, S aureus Colonization, and Scratch-Induced Microtrauma",
        "Why Chronic COPD Patients Develop Pulmonary Hypertension Late: Hypoxic Vasoconstriction Remodeling and Right Ventricular Afterload",
        "Why Chronic Heart Failure Patients Need Integrated Sodium Education: Neurohormonal Sodium Avidity vs Dietary Sodium Load Mismatch",
        "How Chronic Kidney Disease Shifts Acid-Base Toward Metabolic Acidosis: Bicarbonate Loss, Ammonia Excretion Limits, and Bone Buffering",
        "Why Chronic Liver Disease Alters Estrogen and Testosterone Balance: SHBG Shifts, Aromatization, and Gynecomastia Mechanisms",
        "How Chronic Pain and Opioid Co-Therapy Interact With Sleep Apnea: Respiratory Depression Layering on Obstructive Events",
        "Why Chronic Hypertension Accelerates Cognitive Decline Vascular Contributions: Small Vessel Disease, Pulse Pressure, and Microinfarct Burden",
        "How Chronic Diabetes Changes Wound Healing in Lower Limbs: Neuropathy, Ischemia, and Impaired Innate Immunity",
        "Why Chronic Heart Failure Patients Develop Depression: Cerebral Hypoperfusion Hypotheses, Inflammation, and Illness Burden Mediation",
        "How Chronic Kidney Disease Alters Potassium Homeostasis With RAAS Inhibitors and SGLT2 Inhibitors: Distal Nephron Competition and Aldosterone Resistance",
        "Why Chronic Asthma Control Worsens After Respiratory Viral Infection: Epithelial Barrier Damage and Type-2 Inflammatory Rebound",
        "How Chronic Hypothyroidism Worsens Hypercholesterolemia Management: LDL Receptor Downregulation and Statin Intolerance Overlap",
        "Why Medication Overuse Headache Evolves in Patients With Episodic Migraine: Descending Pain Modulation Failure and Trigeminal Sensitization Loops",
    ]

    DifferentialDiagnosis = [
        "Pathophysiological Differences Between Asthma and COPD Exacerbation Presentations: Bronchospasm Dominance Versus Gas Trapping and Infection Drivers",
        "How to Distinguish Heart Failure Exacerbation Versus Pneumonia Dyspnea Using Starling Forces Versus Alveolar Consolidation Mechanisms",
        "Difference Between Iron Deficiency Anemia and Anemia of Chronic Disease: Hepcidin Biology Versus Marrow Iron Availability on Primary Care Labs",
        "How to Separate Hypothyroid Fatigue From Depression Using Thermoregulation, Reflexes, and Tissue-Level Metabolism (Not a Single Lab Snap)",
        "Pathophysiology Behind Gout Flare Versus Septic Arthritis: Crystal-Triggered NLRP3 Inflammation Versus Bacterial Joint Space Invasion",
        "How to Differentiate Peripheral Vertigo From Posterior Circulation Stroke: End-Organ Labyrinth Dysfunction Versus Brainstem Ischemia Signatures",
        "Difference Between Stable Angina and Acute Coronary Syndrome: Fixed Demand Ischemia Versus Plaque Disruption and Thrombosis Pathways",
        "How to Distinguish Irritable Bowel Syndrome From Inflammatory Bowel Disease: Visceral Hypersensitivity Versus Mucosal Ulceration and Systemic Inflammation",
        "Pathophysiological Contrast of Nephrotic Versus Nephritic Syndromes: Podocyte Barrier Failure Versus Inflammatory Glomerular Injury Patterns",
        "How to Differentiate Acute Rhinosinusitis From Migraine-Related Facial Pain: Ostial Obstruction Inflammation Versus Trigeminovascular Activation",
        "Difference Between Cellulitis and Deep Vein Thrombosis: Soft Tissue Infection Versus Venous Thrombosis With Inflammatory Overlap",
        "How to Separate Panic Hyperventilation From Pulmonary Embolism: Respiratory Alkalosis Versus V/Q Mismatch and Obstructive Shock Risk",
        "Pathophysiology Behind DKA Versus HHS: Ketogenesis Dominance Versus Extreme Osmotic Dehydration and Hypertonicity-First Crisis Physiology",
        "How to Distinguish Acute Pericarditis From STEMI: Diffuse Inflammatory Epicardial Injury Versus Territorial Ischemia Vector Patterns",
        "Difference Between Iron Deficiency and Thalassemia Trait Microcytosis: Heme Limitation Versus Globin Chain Imbalance and RDW Clues",
        "How to Differentiate Acute Bronchitis From Community-Acquired Pneumonia: Large Airway Inflammation Versus Alveolar Exudate Gas Exchange Failure",
        "Pathophysiological Contrast of SIADH Versus Hypovolemic Hyponatremia: ADH-Inappropriate Water Retention Versus Baroreceptor-Driven ADH Secretion",
        "How to Separate Essential Tremor From Parkinson Disease Tremor: Oscillator Network Action Tremor Versus Nigrostriatal Resting Tremor Pathways",
        "Difference Between Osteoarthritis and Rheumatoid Arthritis Morning Stiffness: Cartilage Wear Mechanics Versus Synovial Inflammatory Proliferation",
        "How to Distinguish Acute Cholecystitis From Biliary Colic: Sustained Inflammation With Ischemic Risk Versus Transient Cystic Duct Obstruction",
        "Pathophysiology Behind Central Versus Nephrogenic Diabetes Insipidus: ADH Secretion Failure Versus Collecting Duct Aquaporin Resistance",
        "How to Differentiate Acute Gout From Pseudogout: Monosodium Urate Crystals Versus CPPD Deposition and Joint Predilection Mechanisms",
        "Difference Between Acute Kidney Injury Prerenal Azotemia and ATN: Autoregulation Failure Versus Tubular Cell Death and Backleak",
        "How to Separate Functional Dyspepsia From Peptic Ulcer Disease: Visceral Hypersensitivity Versus Mucosal Breakdown and Acid Injury",
        "Pathophysiological Contrast of Heart Failure With Reduced Versus Preserved EF: Systolic Pump Failure Versus Diastolic Stiffness and Vascular Stiffness Coupling",
        "How to Distinguish Acute Coronary Syndrome From Aortic Dissection: Ischemic Demand and Thrombosis Versus False Lumen Propagation and Branch Malperfusion",
        "Difference Between Acute Sinus Headache and Tension Headache: Mucosal Pressure Versus Pericranial Muscle Tender Points and Central Modulation",
        "How to Differentiate Community-Acquired Pneumonia From Aspiration Pneumonia: Typical Alveolar Infection Versus Oropharyngeal Flora and Chemical Pneumonitis Overlap",
        "Pathophysiology Behind Hyperosmolar Hyperglycemia Versus Diabetic Ketoacidosis in Older Adults: Dehydration Dominance Versus Ketone-Driven Acidosis",
        "How to Separate Iron Deficiency From Chronic Disease Anemia in Cancer Surveillance: Inflammation Hepcidin Versus Blood Loss Mechanisms",
        "Difference Between Acute Pericardial Tamponade and Tension Pneumothorax: Diastolic Filling Limit From Fluid Versus Intrathoracic Pressure Collapse",
        "How to Distinguish Acute Mesenteric Ischemia From IBS Flare: Splanchnic Hypoperfusion Ischemia Versus Functional Motility Without Tissue Death",
        "Pathophysiological Contrast of Hypothyroid Myxedema States Versus Severe Depression: Tissue Hypometabolism Versus Mood Circuit Pathology",
        "How to Differentiate Acute Pyelonephritis From Lower UTI: Renal Parenchymal Inflammation Versus Bladder Mucosa Limited Infection",
        "Difference Between Acute Asthma and Vocal Cord Dysfunction: Lower Airway Bronchospasm Versus Glottic Inspiratory Obstruction",
        "How to Separate Acute Coronary Ischemia From GERD-Related Chest Pain: Myocardial Oxygen Supply and Demand Versus Acid Pepsin Mucosal Injury",
        "Pathophysiology Behind Acute Hemorrhagic Stroke Versus Ischemic Stroke Onset: Vessel Rupture Mass Effect Versus Embolic and Thrombotic Occlusion",
        "How to Distinguish Pulmonary Edema From ARDS on Mechanisms: Hydrostatic Filtration Versus Increased Permeability Alveolar Injury",
        "Difference Between Acute Gastroenteritis and Acute Appendicitis Early: Viral Enterocyte Secretion Versus Luminal Obstruction and Visceral Pain Migration",
        "How to Differentiate Acute Pancreatitis From Peptic Ulcer Perforation: Enzymatic Autodigestion Versus Hollow Viscus Air and Chemical Peritonitis",
    ]

    RedFlags = [
        "Why Sepsis Causes Rapid Hemodynamic Collapse: Endothelial Leak, Vasoplegia, and Sepsis-Induced Cardiomyopathy in Primary Care Recognition",
        "Early Versus Late Signs of Increased Intracranial Pressure: Monro-Kellie Compensation Failure and Herniation Pathways for CNPE Triage Reasoning",
        "Why Massive Pulmonary Embolism Deteriorates Into Obstructive Shock: RV Failure, Preload Collapse, and Refractory Hypoxemia Mechanisms",
        "How Acute Decompensated Heart Failure Escalates Within Hours: Pulmonary Venous Pressure Transmission and Respiratory Muscle Fatigue",
        "Why Severe Hyperkalemia Progresses to PEA Arrest: Conduction Slowing From Resting Membrane Depolarization and Treatment-Shift Traps",
        "Early Versus Late Signs of Diabetic Ketoacidosis: Ketone Expansion, Osmotic Diuresis, and Potassium Redistribution During Therapy",
        "Why Anaphylaxis Can Kill in Minutes: Angioedema Airway Obstruction Plus Distributive Shock From Massive Mast Cell Mediator Release",
        "How Acute Upper GI Hemorrhage Deteriorates: Hypovolemia, Sympathetic Decompensation, and Coagulopathy Feedback Loops",
        "Why Tension Pneumothorax Collapses Venous Return: Intrathoracic Pressure Dynamics and Obstructive Shock Progression",
        "Early Versus Late Signs of Cardiac Tamponade: Pericardial Pressure-Volume Relationship and Pulsus Paradoxus Evolution",
        "Why Status Epilepticus Causes Secondary Brain Injury: Excitotoxicity, Hyperthermia, and Aspiration-Induced Hypoxia Cascades",
        "How Acute Liver Failure Worsens Neurologically: Ammonia Neurotoxicity, Cerebral Edema Risk, and Coagulopathy Complications",
        "Why Aortic Dissection Decompensates: Branch Malperfusion Syndromes, Tamponade Extension, and Rupture Into Pleural Space",
        "Early Versus Late Signs of Ectopic Pregnancy Rupture: Tubal Vascular Erosion and Hemorrhagic Shock Physiology",
        "Why Preeclampsia Can Suddenly Progress to Eclampsia: Endothelial Dysfunction, Vasospasm, and CNS Excitability (Scope-Sensitive Escalation)",
        "How Necrotizing Soft Tissue Infection Deteriorates Overnight: Fascial Plane Spread, Microvascular Thrombosis, and Toxin-Mediated Shock",
        "Why Opioid Overdose Respiratory Arrest Happens Quietly: Brainstem mu-Receptor Depression and Co-Ingestant Synergy",
        "Early Versus Late Signs of Severe Alcohol Withdrawal Delirium: GABA-Glutamate Imbalance and Autonomic Storm Progression",
        "Why Acute Mesenteric Ischemia Moves From Pain-Out-of-Proportion to Peritonitis: Mucosal Barrier Failure and Septic Shock",
        "How Severe Symptomatic Hyponatremia Deteriorates: Cerebral Edema Risk Versus Osmotic Demyelination After Rapid Correction (Dual Danger)",
        "Why Postpartum Hemorrhage Shock Accelerates: Uterine Atony Fails to Tamponade Spiral Arteries Plus Consumptive Coagulopathy",
        "Early Versus Late Signs of Community-Acquired Pneumonia Sepsis: Alveolar Consolidation Plus Systemic Inflammatory Vasoplegia",
        "Why Bowel Obstruction Strangulates: Venous Congestion Progressing to Arterial Compromise and Peritoneal Sepsis",
        "How Pyelonephritis Becomes Urosepsis: Renal Parenchymal Inflammation, Bacteremia, and Obstructive Uropathy Amplification",
        "Why Acute Adrenal Crisis Presents as Refractory Hypotension: Cortisol Deficiency, Mineralocorticoid Collapse, and Electrolyte Failure",
        "Early Versus Late Signs of Thyroid Storm: Hypermetabolic Crisis With Cardiovascular Decompensation and GI Hepatic Failure Overlap",
        "Why Acute Coronary Syndrome Progresses to Cardiogenic Shock: Extensive Myocardial Loss, Arrhythmia, and Mitral Regurgitation Mechanisms",
        "How Acute Kidney Injury From Obstruction Deteriorates: Postrenal Pressure Injury, Tubular Damage, and Hyperkalemia Accumulation",
        "Why Acute Severe Asthma Kills: Mucus Plugging, Ventilation-Perfusion Mismatch, and Respiratory Muscle Fatigue With Silent Chest Late",
        "Early Versus Late Signs of Increased Intra-Abdominal Hypertension in Critical Illness: Splanchnic Ischemia and Multiorgan Dysfunction (High-Yield Concepts)",
    ]

    MultiSystem = [
        "How Chronic Kidney Disease Affects Cardiovascular Function: Volume-Pressure Loading, RAAS Dysregulation, and Arterial Stiffness Feedback",
        "The Interaction Between Type 2 Diabetes and Peripheral Neuropathy: Microvascular Ischemia, Metabolic Stress, and Autonomic Branch Overlap",
        "How Obstructive Sleep Apnea Worsens Hypertension, Atrial Fibrillation, and Insulin Resistance: Sympathetic Surges and Intrathoracic Pressure Pathways",
        "The Relationship Between Inflammatory Arthritis and Accelerated Atherosclerosis: Cytokine Endothelial Activation and Lipid Paradox Nuances",
        "How Type 2 Diabetes Interacts With NAFLD and MASLD: Hepatic De Novo Lipogenesis, Portal Hyperinsulinemia, and Cardiorenal Risk Clustering",
        "How CKD Worsens Anemia and Left Ventricular Afterload: Oxygen Delivery Failure and Neurohormonal Compensation Limits",
        "The Interaction Between COPD and HFpEF Dyspnea: Gas Trapping Versus Diastolic Stiffness and Natriuretic Peptide Interpretation Traps",
        "How Depression and Anxiety Interact With Diabetes Control: HPA Axis, Sleep Fragmentation, and Adherence Neurocircuit Load",
        "How Chronic Hypertension Interacts With CKD and Retinopathy: Microvascular Stress Across Kidney, Brain, and Eye Circulations",
        "The Relationship Between Obesity, OSA, and Atrial Fibrillation: Weight Mechanics, Autonomic Tone, and Atrial Remodeling",
        "How Hypothyroidism Interacts With Hyperlipidemia, Constipation, and Depression-Like Fatigue: Tissue Hypometabolism Across Systems",
        "How Hyperthyroidism Interacts With Atrial Fibrillation, Bone Loss, and Proximal Muscle Weakness: Beta-Adrenergic Excess and Bone Turnover",
        "The Interaction Between Cirrhosis, Coagulopathy Rebalancing, and Portal Hypertension Bleeding Risk: Synthetic Failure Versus Hemostatic Complexity",
        "How Diabetes Interacts With CKD and Hyperkalemia Risk: Renal Excretion Limits, RAAS Pharmacology, and Insulin-Mediated Potassium Shifts",
        "The Interaction Between Heart Failure and CKD: Cardiorenal Congestion, Diuretic Response, and Worsening Creatinine Interpretation",
        "How Rheumatoid Arthritis Interacts With Osteoporosis and Glucocorticoid Exposure: Inflammation-Driven Bone Loss Plus Steroid Muscle Wasting",
        "How Chronic Pain, Insomnia, and Hypertension Interact: Autonomic Arousal, NSAID Renal and Sodium Effects, and Vascular Stiffness",
        "How PCOS Interacts With Insulin Resistance, Dyslipidemia, and Long-Term Cardiometabolic Risk: Androgen Excess as a Systemic Signal",
        "The Interaction Between Benzodiazepines, Falls, and Cognitive Decline in Older Adults: GABAergic Sedation Plus Vestibular and Proprioceptive Loss",
        "How Smoking Interacts With COPD, ASCVD, and Cancer Risk: Systemic Oxidative Stress Beyond Airway Injury",
        "How Chronic Alcohol Use Interacts With Hypertension, Liver Injury, and Arrhythmia: Sympathetic Surges and Cardiomyopathy Pathways",
        "The Relationship Between Atrial Fibrillation, Stroke Risk, and Heart Failure: Thrombogenesis Plus Rate-Related Remodeling",
        "How Gout Interacts With CKD and Hypertension: Urate Handling, Diuretics, and Inflammatory Flare Systemic Load",
        "How Chronic Corticosteroids Interact With Osteoporosis, Hyperglycemia, and Infection Susceptibility: Receptor-Mediated Multi-Organ Effects",
        "The Interaction Between CKD, Vitamin D Deficiency, and Secondary Hyperparathyroidism: Mineral Axis Dysregulation and Frailty",
        "How Obesity Interacts With Knee OA and Systemic Inflammation: Mechanical Load Plus Adipokine-Mediated Joint Stress",
        "How CKD Changes Medication Toxicity Risk: Protein Binding, Renal Clearance, and Active Metabolite Accumulation Across Organ Systems",
        "The Interaction Between IBD, Anemia, and Bone Health: Blood Loss, Inflammation-Blocked Iron, and Steroid and Malabsorption Overlap",
        "How PPI Long-Term Use Interacts With Micronutrient Status, Fracture Risk, and Polypharmacy Older Adults: Absorption and Fall Pathways",
        "How Social Determinants Interact With Stress Physiology and Chronic Disease Control: Access Barriers as Mechanism Modifiers (Non-Blaming)",
    ]

    CanadianContext = [
        "Pathophysiology of Type 2 Diabetes in Canadian Primary Care Panels: Screening Thresholds, Cultural Safety, and Access-Modified Presentation Timelines",
        "How Latent TB Infection Reactivates in Remote Canadian Contexts: Granuloma Biology Meets Housing, Nutrition, and Public Health Surveillance Systems",
        "Pathophysiology of Lyme Disease as Vector Ecology Expands in Canada: Tick-Borne Transmission Stages and Diagnostic Delays in Rural Access Models",
        "How Wildfire Smoke Exacerbates COPD and Asthma Across Canadian Provinces: PM2.5 Airway Inflammation and Public Health AQHI Response Integration",
        "Pathophysiology of Food Insecurity-Driven Metabolic Variability: Cortisol-Mediated Hyperglycemia and Practical Nutrition Counselling Under Structural Constraints",
        "How Cervical Cancer Prevention Presents Through Provincial Screening Programs: HPV Oncogenesis Mechanisms and Equity Gaps in Follow-Up Navigation",
        "Pathophysiology of FIT-Positive Colorectal Bleeding Trails: Adenoma-Carcinoma Sequence Meets Colonoscopy Capacity and Rural Travel Burden",
        "How Seasonal High-Latitude Light Changes Interact With Depression and Fatigue Pathophysiology: Circadian Phase Shifts in Canadian Winter Primary Care",
        "Pathophysiology of RSV Bronchiolitis Burden in Canadian Infants: Airway Mechanics, Seasonality, and Pediatric Transfer Realities (Jurisdictional Navigation)",
        "How Opioid Toxicity Presents Where Harm Reduction Access Is Uneven: Respiratory Depression Mechanisms and Rural EMS Interval Implications",
        "Pathophysiology of Hypertension in Pregnancy-Related Disorders: Endothelial Dysfunction Models and Obstetric Triage Access Across Regions (Scope-Sensitive)",
        "How Chronic Pain and Trauma-Informed Care Intersect With Neuroendocrine Stress Pathways: Canadian Training Emphasis Without Stereotyping Cultures",
        "Pathophysiology of Iron Deficiency in Multicultural Canadian Panels: Menstrual Loss, Postpartum Recovery, and GI Evaluation Delays by Wait Times",
        "How Vaccine-Preventable Disease Still Emerges in Undervaccinated Subgroups: Community Immunity Mechanics and Access and Trust Barriers (Non-Shaming)",
        "Pathophysiology of Diabetic Foot Ulceration With PAD in Cold Climates: Neuropathy, Ischemia, and Winter Thermal Injury Risk Layering",
        "How Language Access Shapes Late Symptomatic Cancer Presentation: Tumor Growth Kinetics Meet Interpreter Booking and Primary Attachment Barriers",
        "Pathophysiology of Heat-Related Illness Vulnerability in Canadian Summer Extremes: Thermoregulation Limits, Polypharmacy, and Urban Heat Islands",
        "How Chronic Kidney Disease Management Shifts With Rural Nephrology Access: eConsult, Lab Logistics, and Medevac Threshold Reasoning",
        "Pathophysiology of Chronic HCV in Canadian DAA-Era Primary Care: Fibrosis Progression and Reinfection Prevention in Risk-Structured Panels",
        "How Indigenous Data Governance and Community-Led Wellness Models Change Chronic Disease Follow-Up: Structural Access Plus Clinical Mechanisms (Respectful)",
    ]

    Advanced = [
        "Advanced Renin-Angiotensin-Aldosterone Modulation in CKD With Heart Failure: Tissue RAAS, Aldosterone Breakthrough, and Potassium Handling at the Collecting Duct",
        "Deep Dive: Frank-Starling Curve Shifts in Sepsis-Induced Cardiomyopathy Versus Hypovolemic Shock (Mechanistic Hemodynamics for NP Oral Exams)",
        "Advanced Acid-Base Physiology in High Anion Gap Metabolic Acidosis With Concurrent Respiratory Compensation: Delta Gap Thinking Without Calculator Theatre",
        "Mitochondrial Dysfunction and Insulin Resistance Crosstalk in Type 2 Diabetes: Ectopic Lipid, Ceramides, and Hepatic Gluconeogenic Drive",
        "Advanced Sympathetic and RAAS Coupling in Obstructive Sleep Apnea-Related Hypertension: Chemoreflex Resetting and Nocturnal Blood Pressure Phenotypes",
        "Endothelial Glycocalyx Degradation in Sepsis and CKD: Why Microvascular Perfusion Fails Before Macrocirculation Looks Stable",
        "Advanced Platelet-Endothelium Interaction in Atrial Fibrillation Stroke Risk: Virchow Triad Modernization Beyond CHA2DS2-VASc Memorization",
        "Renal Tubular Acidification Limits in CKD: Ammoniagenesis Failure and Bicarbonate Reabsorption Pathways Driving Chronic Metabolic Acidosis",
        "Advanced Neurohormonal Maladaptation in Heart Failure: Sympathetic Overdrive, RAAS Escape, and Natriuretic Peptide Receptor Downregulation Concepts",
        "Immune Complex and Complement Pathways in Glomerular Injury: High-Yield Mechanism Map for Nephritic Versus Nephrotic-Heavy Presentations",
        "Advanced Oxygen-Hemoglobin Dissociation Shifts in Sepsis, Anemia, and Lung Injury: Why SpO2 Can Mislead Tissue Oxygen Delivery Reasoning",
        "Myocardial Oxygen Supply and Demand Geometry in Stable Ischemia Versus Supply Failure: Coronary Autoregulation and Collateralization Limits",
        "Advanced Autonomic Regulation of Potassium: Insulin, Catecholamines, Aldosterone, and Acid-Base Co-Movement in AKI and Emergency Transitions",
        "Hepatic Encephalopathy Ammonia and Beyond: Astrocyte Swelling, Neuroinflammation, and GABAergic Tone in Advanced Liver Disease",
        "Advanced V/Q Mismatch Taxonomy in COPD Exacerbation Versus PE: Dead Space, Shunt, and Low Ventilation-Perfusion Units for Bedside Teaching",
        "Pulmonary Hypertension Pathobiology in COPD: Hypoxic Vasoconstriction Remodeling to Intimal Proliferation and Right Heart Coupling Failure",
        "Advanced Inflammation-Thrombosis Interface in Severe Viral Pneumonitis Syndromes: DIC Risk Thinking for NP Exam Breadth (Non-Specific)",
        "Cerebral Autoregulation Failure in Traumatic Brain Injury and Hypertensive Emergency Overlap Concepts: Perfusion Pressure Bounds (High-Level)",
        "Advanced Beta-Cell Exhaustion Models in Type 2 Diabetes: Glucolipotoxicity, ER Stress, and Incretin Axis Integration Without Product Promotion",
        "Renin-Angiotensin System Blockade in Diabetic Kidney Disease: Hemodynamic Versus Anti-Fibrotic Mechanisms and Why Hyperkalemia Emerges at the Distal Nephron",
    ]

    def pack(titles: List[str], category: str, outline_fn) -> List[dict]:
        return [
            {
                "title": t,
                "seoSlug": slugify(t),
                "searchIntent": intent_for(category, t),
                "outline": outline_fn(t),
                "internalLinkingSuggestions": links(
                    "Mechanism-to-bedside translation drills",
                    "Primary care lab interpretation (eGFR, electrolytes, CBC patterns)",
                    "Chronic disease follow-up cadence and documentation prompts",
                    "Patient teaching: mechanism-linked self-monitoring",
                    "Red flag triage and EMS and ED handoff language",
                    "Deprescribing and polypharmacy safety scaffolding",
                ),
            }
            for t in titles
        ]

    data = {
        "PrimaryCare": pack(PrimaryCare, "PrimaryCare", outline_primary),
        "DifferentialDiagnosis": pack(DifferentialDiagnosis, "DifferentialDiagnosis", outline_diff),
        "RedFlags": pack(RedFlags, "RedFlags", outline_red),
        "MultiSystem": pack(MultiSystem, "MultiSystem", outline_multi),
        "CanadianContext": pack(CanadianContext, "CanadianContext", outline_canada),
        "Advanced": pack(Advanced, "AdvancedMechanisms", outline_advanced),
    }

    titles = [o["title"] for v in data.values() for o in v]
    slugs = [o["seoSlug"] for v in data.values() for o in v]
    assert len(titles) == 200, len(titles)
    assert len(set(titles)) == 200
    assert len(set(slugs)) == 200

    for obj in data["DifferentialDiagnosis"]:
        obj["internalLinkingSuggestions"] = links(
            "Side-by-side differential lesson maps",
            "Overlapping biomarkers: BNP, troponin, D-dimer caveats",
            "Clinical prediction rules as Bayesian tools (not absolutes)",
            "Bedside exam discriminators and documentation",
            "When to stop outpatient work-up and route to ED",
        )
    for obj in data["RedFlags"]:
        obj["internalLinkingSuggestions"] = links(
            "Rapid response and EMS activation criteria",
            "Serial vitals and mental status trending",
            "Oxygenation and ventilation failure patterns",
            "Shock phenotypes and perfusion assessment",
            "Poisoning, overdose, and withdrawal recognition",
        )
    for obj in data["MultiSystem"]:
        obj["internalLinkingSuggestions"] = links(
            "Cardiorenal syndrome core lessons",
            "Diabetes plus CKD plus cardiovascular risk integration",
            "Polypharmacy and renal and hepatic dose reasoning",
            "Frailty, falls, and bone health bundles",
            "Mental health plus chronic disease collaborative care",
        )
    for obj in data["CanadianContext"]:
        obj["internalLinkingSuggestions"] = links(
            "Provincial screening program navigation",
            "Rural and remote access and telehealth substitution limits",
            "Cultural safety and trauma-informed primary care",
            "Public health outbreak tools and immunization schedules",
            "Indigenous health governance and jurisdictional wayfinding (non-stereotyping)",
        )
    for obj in data["Advanced"]:
        obj["internalLinkingSuggestions"] = links(
            "Acid-base and electrolyte master lessons",
            "Hemodynamics and shock physiology",
            "Immune and complement pathway maps",
            "Renal tubular physiology deep dives",
            "Pulmonary V/Q and gas exchange mechanics",
        )

    return data


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_path = root / "docs" / "cnpe-np-exam-blog-plan-200.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = build()
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path} ({sum(len(v) for v in payload.values())} items)")


if __name__ == "__main__":
    main()
