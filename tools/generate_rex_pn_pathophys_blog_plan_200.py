#!/usr/bin/env python3
"""Generate 200 long-tail REx-PN pathophysiology blog plans (JSON). Run from repo root."""
from __future__ import annotations

import json
import re
from pathlib import Path


def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:96]


def item(
    title: str,
    seo_slug: str | None,
    search_intent: str,
    h2_h3: list[tuple[str, list[str]]],
    links: list[str],
) -> dict:
    parts: list[str] = []
    for h2, h3s in h2_h3:
        parts.append(f"## {h2}")
        for h3 in h3s:
            parts.append(f"### {h3}")
    return {
        "title": title,
        "seoSlug": seo_slug or slugify(title),
        "searchIntent": search_intent,
        "outline": "\n".join(parts),
        "internalLinkingSuggestions": links,
    }


# Shared lesson-topic clusters for REx-PN internal linking (topic names, not URLs)
LCV = ["Cardiovascular pathophysiology", "Heart failure management basics", "REx-PN cardiovascular topic cluster"]
LRESP = ["Respiratory assessment", "COPD exacerbation recognition", "Asthma management basics", "Airway and breathing priorities"]
LNEURO = ["Neurological assessment", "Stroke recognition and emergency response", "Delirium vs dementia cues"]
LGI = ["GI assessment and symptom clusters", "Fluid and electrolyte balance", "Dehydration and oral rehydration teaching"]
LRENAL = ["Renal function basics", "Acute kidney injury: early signs", "Urinary tract infection management"]
LENDO = ["Diabetes mellitus pathophysiology", "Hypoglycemia recognition and treatment", "Hyperglycemia and sick-day rules"]
LINFX = ["Infection prevention and control", "Sepsis recognition basics", "Antibiotic stewardship awareness"]
LSKIN = ["Skin integrity and wound healing", "Pressure injury staging review", "Cellulitis assessment"]
LMUSC = ["Musculoskeletal pain assessment", "Osteoarthritis self-management support", "Fall prevention strategies"]
LMAT = ["Medication administration safety", "Pharmacology: common drug classes", "Polypharmacy risks in older adults"]
LPERI = ["Postoperative nursing care", "Pain assessment scales", "Surgical site infection prevention"]
LOBS = ["Labor stages overview", "Postpartum hemorrhage early recognition", "Newborn thermoregulation"]
LPEDS = ["Pediatric fever guidelines overview", "Growth and development milestones", "Pediatric dehydration signs"]
LMH = ["Therapeutic communication", "Anxiety and panic: patient education", "Substance use: nonjudgmental screening basics"]
LSAFE = ["National Patient Safety goals mindset", "SBAR reporting structure", "Incident documentation principles"]
LCAN = ["Canadian health care system navigation", "Long-term care nursing priorities", "Community home care safety assessment"]


def core_conditions() -> list[dict]:
    specs: list[tuple[str, str, str, list[tuple[str, list[str]]], list[str]]] = [
        (
            "Why Left-Sided Heart Failure Leads to Pulmonary Congestion: A PN-Friendly Pressure–Volume Story for REx-PN",
            "left-heart-failure-pulmonary-congestion-pn-pressure-volume-rex-pn",
            "Connect backward failure in the left ventricle to fluid backup in pulmonary circulation for exam-style prioritization.",
            [
                ("Pump failure and backward pressure", ["Afterload vs preload in plain language", "Why fluid backs into lungs first"]),
                ("Gas exchange impact", ["V/Q mismatch in simple terms", "Orthopnea and paroxysmal nocturnal dyspnea as compensatory clues"]),
                ("PN monitoring language", ["Daily weights and trend interpretation", "When to escalate breathing changes"]),
            ],
            LCV + LRESP + LMAT,
        ),
        (
            "Right Ventricular Strain After Pulmonary Embolism: What Practical Nurses Should Recognize Without Overreaching",
            "right-ventricular-strain-pe-pn-recognition-rex-pn",
            "Understand how sudden pulmonary vascular obstruction strains the right heart and which observations trigger escalation.",
            [
                ("Pathophysiology snapshot", ["Clot burden and RV afterload spike", "Reduced LV filling in obstructive shock concept"]),
                ("Bedside correlates", ["Tachypnea, pleuritic pain, unexplained hypoxia", "Syncope and hypotension as high-risk patterns"]),
                ("PN scope boundaries", ["Objective reporting vs diagnosis", "Activate emergency pathway per policy"]),
            ],
            LCV + LRESP + LSAFE,
        ),
        (
            "Community-Acquired Pneumonia: Alveolar Consolidation, Capillary Leak, and the Fever–Tachypnea Pattern",
            "community-acquired-pneumonia-alveolar-consolidation-fever-tachypnea-rex-pn",
            "Map alveolar filling and inflammatory mediators to vitals and breath sounds for exam vignettes.",
            [
                ("Infectious-inflammatory cascade", ["Alveolar exudate and surfactant dysfunction", "Cytokines and fever generation"]),
                ("Ventilation consequences", ["Shunt physiology in one diagram-in-words", "Accessory muscle recruitment"]),
                ("Older adult modifiers", ["Blunted fever with serious infection", "Confusion as a subtle presentation"]),
            ],
            LINFX + LRESP + ["Older adult assessment"],
        ),
        (
            "COPD Exacerbation Pathophysiology: Mucus Hypersecretion, Airway Narrowing, and Gas Trapping Basics",
            "copd-exacerbation-mucus-airway-narrowing-gas-trapping-rex-pn",
            "Explain why exacerbations worsen work of breathing and CO2 retention risk in exam-relevant language.",
            [
                ("Chronic airway changes", ["Goblet cell hyperplasia and mucus plugging", "Loss of elastic recoil"]),
                ("Acute on chronic triggers", ["Bacterial vs viral inflammation (high-level)", "Bronchospasm amplification"]),
                ("Assessment anchors", ["Accessory muscles, pursed-lip use, speaking in words", "SpO2 interpretation limits"]),
            ],
            LRESP + LMAT + LENDO,
        ),
        (
            "Asthma Attack Mechanisms: Histamine-Linked Bronchospasm, Edema, and the Progressive Silent Chest Risk",
            "asthma-attack-mechanisms-bronchospasm-edema-silent-chest-rex-pn",
            "Tie allergic and non-allergic pathways to progressive airway obstruction for prioritization questions.",
            [
                ("Bronchial smooth muscle", ["Parasympathetic tone and bronchoconstriction", "Late-phase inflammation overview"]),
                ("Airway wall swelling", ["Mucosal edema reduces lumen diameter", "Why beta-agonist alone may be insufficient conceptually"]),
                ("Red-flag physiology", ["Fatigue with dropping wheeze", "Rising PaCO2 implication at concept level"]),
            ],
            LRESP + LMAT + LSAFE,
        ),
        (
            "Acute Coronary Syndrome as Supply–Demand Mismatch: Ischemia Progression Practical Nurses Memorize for Exams",
            "acute-coronary-syndrome-supply-demand-ischemia-progression-rex-pn",
            "Describe plaque instability and myocardial oxygen imbalance without substituting for advanced provider decision-making.",
            [
                ("Coronary perfusion basics", ["Fixed stenosis vs dynamic obstruction", "Demand ischemia triggers"]),
                ("Cell injury timeline (exam framing)", ["Reversible ischemia symptoms", "Why time-to-treatment matters conceptually"]),
                ("PN role anchors", ["12-lead acquisition support if trained", "Vitals, pain reassessment, escalation language"]),
            ],
            LCV + LMAT + LSAFE,
        ),
        (
            "Heart Failure With Reduced Ejection Fraction: Neurohormonal Activation and Why Fluid Restrictions Exist",
            "hfref-neurohormonal-activation-fluid-restrictions-why-rex-pn",
            "Explain RAAS/SNS overshoot as a driver of congestion for teaching-style exam items.",
            [
                ("Compensatory systems", ["RAAS-mediated sodium retention", "ADH and water retention overview"]),
                ("Congestion loop", ["Increased ventricular wall stress", "Peripheral edema vs pulmonary edema distribution"]),
                ("Patient teaching hooks", ["Sodium hidden sources", "Daily weight ritual and when to call"]),
            ],
            LCV + LMAT + LGI,
        ),
        (
            "Atrial Fibrillation and Chaotic Atrial Activity: Stroke Risk Pathway Practical Nurses Explain to Clients",
            "atrial-fibrillation-chaotic-atrial-activity-stroke-risk-rex-pn",
            "Link stagnant atrial flow to thrombus formation at a conceptual level for anticoagulation teaching vignettes.",
            [
                ("Electrical disorganization", ["Loss of coordinated atrial kick", "Irregular ventricular response effects on perfusion"]),
                ("Thromboembolic risk (concept)", ["Stasis in the atrial appendage idea", "Why anticoagulation decisions are provider-led"]),
                ("PN education boundaries", ["Medication adherence teaching", "Bleeding precautions without dosing advice"]),
            ],
            LCV + LMAT + LNEURO,
        ),
        (
            "Hypertensive Emergency vs Urgency: Autoregulation Failure and End-Organ Threat (Recognition-Level for PN)",
            "hypertensive-emergency-vs-urgency-autoregulation-end-organ-rex-pn",
            "Differentiate rapid BP rise patterns by end-organ symptoms for escalation scenarios.",
            [
                ("Cerebral autoregulation", ["Perfusion pressure limits in chronic hypertension", "Symptoms suggesting encephalopathy"]),
                ("Cardiac and renal threats", ["Acute pulmonary edema link", "Acute kidney insult from extreme hypertension concept"]),
                ("PN actions", ["Repeat vitals, calm environment", "Immediate escalation triggers and SBAR phrasing"]),
            ],
            LCV + LSAFE + LMAT,
        ),
        (
            "Hypovolemic Shock Progression: Compensated Tachycardia to Poor End-Organ Perfusion in Exam Scenarios",
            "hypovolemic-shock-progression-tachycardia-end-organ-perfusion-rex-pn",
            "Walk through decreasing venous return to falling cardiac output for trauma/GI bleed vignettes.",
            [
                ("Frank–Starling in plain language", ["Preload drop reduces stroke volume", "Baroreceptor reflex tachycardia"]),
                ("Clinical stage clues", ["Cool skin and delayed cap refill", "Altered mental status as late sign"]),
                ("Fluid resuscitation context", ["PN supports monitoring; orders drive therapy", "Documentation of trends"]),
            ],
            LCV + LGI + LSAFE,
        ),
        (
            "Distributive Shock Overview: Vasodilation, Relative Hypovolemia, and Why Warm Shock Can Fool You",
            "distributive-shock-vasodilation-relative-hypovolemia-warm-shock-rex-pn",
            "Contrast septic, anaphylactic, and neurogenic patterns at a high-yield conceptual level.",
            [
                ("Vascular tone collapse", ["Peripheral pooling reduces venous return", "Cardiac output may be high early in sepsis"]),
                ("Capillary leak add-on", ["Third-spacing worsens effective hypovolemia", "Edema with intravascular depletion paradox"]),
                ("PN vigilance", ["Fever source search support", "Allergy exposure history in anaphylaxis scenarios"]),
            ],
            LINFX + LCV + LSAFE,
        ),
        (
            "Acute Kid Injury: Prerenal vs Intrinsic vs Postrenal Mechanisms Practical Nurses Sort on Exams",
            "acute-kidney-injury-prerenal-intrinsic-postrenal-sorting-rex-pn",
            "Use urine output and basic history cues to connect obstruction vs hypoperfusion vs tubular injury concepts.",
            [
                ("Prerenal pattern", ["Renal hypoperfusion preserves tubular function conceptually", "BUN:creatinine discussion at PN scope"]),
                ("Intrinsic injury", ["Ischemic or nephrotoxic tubular damage overview", "Medication culprits to flag, not prescribe"]),
                ("Postrenal obstruction", ["Hydronephrosis idea", "Catheter kinks and retention link"]),
            ],
            LRENAL + LMAT + LGI,
        ),
        (
            "Urinary Tract Infection Ascending Route: Urethritis to Pyelonephritis Inflammation Chain for REx-PN",
            "uti-ascending-route-urethritis-pyelonephritis-inflammation-rex-pn",
            "Trace bacterial ascent and local inflammation to systemic signs for exam differentiation.",
            [
                ("Lower tract inflammation", ["Bladder mucosa irritation and urgency", "Asymptomatic bacteriuria vs symptomatic UTI exam trap"]),
                ("Upper tract extension", ["Renal parenchyma involvement and flank pain", "CVA tenderness as a cue"]),
                ("Older adult presentation", ["Delirium without fever", "Functional decline as infection marker"]),
            ],
            LRENAL + LINFX + LNEURO,
        ),
        (
            "Cellulitis Soft-Tissue Infection: Capillary Hyperpermeability, Spreading Erythema, and Systemic Spread Risk",
            "cellulitis-capillary-hyperpermeability-spreading-erythema-systemic-risk-rex-pn",
            "Explain local inflammatory vasodilation and lymphatic involvement for wound-adjacent scenarios.",
            [
                ("Local tissue response", ["Neutrophil migration and warmth", "Edema compressing lymphatics"]),
                ("Progression markers", ["Red streaking and lymphangitis concept", "Fever and tachycardia escalation"]),
                ("PN wound-adjacent care", ["Mark borders if policy allows", "Elevation and comfort measures per order"]),
            ],
            LSKIN + LINFX + LMAT,
        ),
        (
            "Clostridioides difficile Toxin–Mediated Colitis: Pseudomembrane Idea and Why Isolation Protocols Matter",
            "c-diff-toxin-colitis-pseudomembrane-isolation-rex-pn",
            "Connect antibiotic disruption of flora to toxin-mediated mucosal injury for infection control questions.",
            [
                ("Microbiome disruption", ["Broad-spectrum antibiotic effects on normal flora", "Spore persistence in environment"]),
                ("Mucosal injury mechanism", ["Toxin-driven inflammation and diarrhea", "Dehydration and electrolyte loss sequelae"]),
                ("Transmission prevention", ["Contact precautions rationale", "Hand hygiene with soap and water emphasis"]),
            ],
            LGI + LINFX + LMAT,
        ),
        (
            "Upper GI Bleed: Acid–Mucosa Balance Loss, Variceal vs Peptic Sources at Concept Level for PN Exams",
            "upper-gi-bleed-acid-mucosa-variceal-peptic-concept-rex-pn",
            "Relate mucosal erosion and portal hypertension pathways to hematemesis/melena presentations.",
            [
                ("Peptic pathway", ["H. pylori and NSAID stress on mucosa", "Erosion through vascular wall concept"]),
                ("Portal hypertension pathway", ["Esophageal varices distension and rupture risk", "Why bleeding can be massive"]),
                ("Stability cues", ["Orthostasis and tachycardia before hypotension", "NG management only if in scope/policy"]),
            ],
            LGI + LCV + LSAFE,
        ),
        (
            "Lower GI Bleed: Rapid Transit Blood and Occult vs Overt Bleeding Patterns Practical Nurses Identify",
            "lower-gi-bleed-rapid-transit-occult-overt-patterns-rex-pn",
            "Differentiate bright red per rectum sources conceptually for reporting and escalation items.",
            [
                ("Anatomic speed cues", ["Hematochezia and distal sources", "Maroon stool and mixed patterns"]),
            ],
            LGI + LCV + LMAT,
        ),
        (
            "Bowel Obstruction: Distension, Fluid Third-Spacing, and Strangulation Fear on Surgical Units",
            "bowel-obstruction-distension-third-spacing-strangulation-rex-pn",
            "Explain proximal dilation, vomiting patterns, and ischemic risk for acute abdomen vignettes.",
            [
                ("Mechanical blockage", ["Proximal dilation and vomiting early in SBO concept", "Fluid sequestration in bowel lumen"]),
                ("Ischemia risk", ["Rising pain out of proportion concept", "Peritoneal signs as escalation triggers"]),
                ("NG tube nursing lens", ["Decompression goal", "Electrolyte monitoring tie-in"]),
            ],
            LGI + LPERI + LSAFE,
        ),
        (
            "Appendicitis Inflammation Progression: Obstruction, Bacterial Overgrowth, and Perforation Timeline Basics",
            "appendicitis-obstruction-bacterial-overgrowth-perforation-basics-rex-pn",
            "Map luminal obstruction to wall ischemia and perforation risk for prioritization drills.",
            [
                ("Lymphoid hyperplasia vs fecalith", ["Luminal obstruction raises intraluminal pressure", "Compromised venous drainage"]),
                ("Pain migration teaching point", ["Visceral vs parietal peritoneum localization", "Rebound tenderness implication"]),
                ("Systemic response", ["Fever and tachycardia progression", "Pediatric atypical presentation reminder"]),
            ],
            LGI + LPEDS + LSAFE,
        ),
        (
            "Cholecystitis: Cystic Duct Obstruction, Wall Inflammation, and Murphy Sign Physiology for Exams",
            "cholecystitis-cystic-duct-obstruction-murphy-sign-physiology-rex-pn",
            "Link gallstone impaction to gallbladder wall ischemia and peritoneal irritation.",
            [
                ("Obstruction mechanics", ["Bile stasis and bacterial proliferation", "Increased intraluminal pressure"]),
                ("Ischemia-inflammation loop", ["Transmural inflammation risk", "Perforation as complication concept"]),
                ("Jaundice overlap", ["Common bile duct stone vs hepatitis distinction at high level"]),
            ],
            LGI + LPERI + LMAT,
        ),
        (
            "Acute Pancreatitis: Enzyme Autodigestion, Third-Spacing, and Hypocalcemia Association (Conceptual)",
            "acute-pancreatitis-enzyme-autodigestion-third-spacing-hypocalcemia-rex-pn",
            "Describe trypsin activation inside pancreas and systemic inflammatory response without advanced lab interpretation.",
            [
                ("Autodigestion idea", ["Premature enzyme activation injures acinar cells", "Inflammatory mediator release"]),
                ("Capillary leak", ["Hypovolemia from third-spacing", "Pleuritic pain and guarding patterns"]),
                ("PN supportive care", ["NPO status monitoring", "Pain reassessment and vitals clustering"]),
            ],
            LGI + LCV + LMAT,
        ),
        (
            "Stroke Ischemia vs Hemorrhage: Core Penumbra Concept and Why Time-Based Care Exists (PN Recognition)",
            "stroke-ischemia-hemorrhage-penumbra-time-based-care-rex-pn",
            "Contrast vessel occlusion bleeding pathways and focal deficit patterns for emergency activation items.",
            [
                ("Ischemic cascade", ["Energy failure and ion pump dysfunction", "Penumbra salvage window idea"]),
                ("Hemorrhagic mass effect", ["Increased ICP signs overview", "Sudden thunderclap headache cue"]),
                ("FAST application", ["Face arm speech time as communication tool", "Blood glucose check importance"]),
            ],
            LNEURO + LCV + LSAFE,
        ),
        (
            "Seizure Pathophysiology: Neuronal Hyperexcitability, Postictal State, and Status Epilepticus Fear",
            "seizure-neuronal-hyperexcitability-postictal-status-rex-pn",
            "Explain synchronized neuronal firing and recovery confusion for post-seizure nursing priorities.",
            [
                ("Excitation-inhibition imbalance", ["Glutamate vs GABA simplified", "Metabolic triggers: hypoglycemia link"]),
                ("Postictal physiology", ["Cerebral metabolic exhaustion", "Todd paralysis as exam mention only"]),
                ("Safety priorities", ["Airway protection during event", "Timing seizure duration for reporting"]),
            ],
            LNEURO + LMAT + LSAFE,
        ),
        (
            "Migraine Neurovascular Theory Basics: Cortical Spreading Depression Cues and Sensory Amplification",
            "migraine-neurovascular-cortical-spreading-depression-sensory-amplification-rex-pn",
            "Give a lightweight mechanism story for aura, throbbing pain, and photophobia exam distractors.",
            [
                ("Trigeminovascular activation", ["Pain fiber sensitization around vessels", "Neuropeptide release overview"]),
                ("Aura mechanisms", ["Cortical spreading depression in simple terms", "Visual scintillations"]),
                ("Medication teaching", ["Triptan timing concepts without dosing", "Rebound headache idea"]),
            ],
            LNEURO + LMAT + LMH,
        ),
        (
            "Meningitis: Blood–Brain Barrier Breach, Kernig/Brudzinski Rationale, and Pediatric Bulging Fontanelle",
            "meningitis-bbb-breach-kernig-brudzinski-pediatric-fontanelle-rex-pn",
            "Connect meningeal inflammation to nuchal rigidity and systemic toxicity for infection urgency items.",
            [
                ("Inflammatory meningeal irritation", ["Pain with passive flexion/extension", "Photophobia mechanism"]),
                ("Increased ICP signs", ["Altered LOC progression", "Seizure risk in pediatric populations"]),
                ("Isolation until pathogen known", ["Droplet precautions concept", "Family communication under stress"]),
            ],
            LINFX + LNEURO + LPEDS,
        ),
        (
            "Spinal Cord Injury Autonomic Dysreflexia: Below-Level Noxious Stimulus Driving Massive Sympathetic Surge",
            "sci-autonomic-dysreflexia-noxious-stimulus-sympathetic-surge-rex-pn",
            "Explain T6+ lesion disinhibition and bladder/bowel triggers for acute nursing intervention vignettes.",
            [
                ("Lesion-level disinhibition", ["Noxious input below injury", "Unopposed sympathetic outflow"]),
                ("Hypertension/bradycardia paradox", ["Baroreceptor reflex vagal response", "Headache and flushing pattern"]),
                ("First-line nursing removal", ["Catheter occlusion, fecal impaction search", "Loosen tight clothing"]),
            ],
            LNEURO + LCV + LSAFE,
        ),
        (
            "Increased Intracranial Pressure Compensation: Cushing Triad Late Significance for Practical Nurses",
            "increased-icp-cushing-triad-late-significance-rex-pn",
            "Describe Monroe–Kellie idea and herniation fear without advanced neurosurgery detail.",
            [
                ("Fixed skull volume", ["Brain blood CSF balance", "Compensation limits"]),
                ("Late vital sign pattern", ["Hypertension with widening pulse pressure", "Bradycardia irregular respirations"]),
            ],
            LNEURO + LSAFE + LCV,
        ),
        (
            "Diabetic Ketoacidosis: Insulin Deficiency Driving Lipolysis and Ketonemia (Recognition and Fluids Concept)",
            "dka-insulin-deficiency-lipolysis-ketonemia-recognition-rex-pn",
            "Map relative insulin lack to hyperglycemia, ketones, and osmotic diuresis for emergency recognition items.",
            [
                ("Metabolic shift", ["Fat breakdown to ketones", "Anion gap idea without deep chemistry"]),
                ("Volume depletion", ["Osmotic diuresis and vomiting", "K+ shifts with treatment risk awareness"]),
                ("PN boundaries", ["Do not adjust insulin independently", "Escalate Kussmaul respirations and altered LOC"]),
            ],
            LENDO + LGI + LSAFE,
        ),
        (
            "Hyperosmolar Hyperglycemic State: Profound Dehydration With Less Ketosis—Why Neuro Symptoms Dominate",
            "hhs-profound-dehydration-less-ketosis-neuro-symptoms-rex-pn",
            "Contrast DKA vs HHS pathways for exam comparison tables focused on volume deficit and altered sensorium.",
            [
                ("Insulin enough to suppress ketosis (concept)", ["Extreme hyperglycemia and osmotic diuresis", "Progressive mental status change"]),
                ("Thrombotic risk mention", ["Dehydration and sluggish flow high-level", "Stroke mimic caution"]),
            ],
            LENDO + LNEURO + LSAFE,
        ),
        (
            "Hypoglycemia Counter-Regulatory Failure: Adrenaline Symptoms vs Neuroglycopenia in Insulin Users",
            "hypoglycemia-counter-regulatory-adrenaline-vs-neuroglycopenia-rex-pn",
            "Explain autonomic tremors progressing to confusion/seizure for community and hospital scenarios.",
            [
                ("Glucose threshold", ["Brain energy dependence", "Adrenaline surge symptoms list"]),
                ("Nocturnal hypoglycemia", ["Somogyi vs dawn phenomenon exam trap at concept level"]),
                ("Safe treatment teaching", ["Rule of 15 overview", "Glucagon family training if applicable"]),
            ],
            LENDO + LMAT + LSAFE,
        ),
        (
            "Thyrotoxicosis: Hypermetabolic Demand, Increased β-Adrenergic Tone, and Heat Intolerance Pathophysiology",
            "thyrotoxicosis-hypermetabolic-beta-adrenergic-heat-intolerance-rex-pn",
            "Link hormone excess to cardiovascular and thermoregulatory strain for assessment prioritization.",
            [
                ("T3/T4 excess effects", ["Increased metabolic rate and oxygen demand", "Tremor and anxiety overlap"]),
                ("Cardiovascular strain", ["Tachycardia and palpitations", "AF risk mention"]),
            ],
            LENDO + LCV + LMAT,
        ),
        (
            "Adrenal Crisis (Concept): Mineralocorticoid and Glucocorticoid Lack Leading to Refractory Hypotension",
            "adrenal-crisis-mineralocorticoid-glucocorticoid-lack-hypotension-rex-pn",
            "Describe acute cortisol deficiency crisis triggers (stress, infection) for escalation recognition.",
            [
                ("HPA axis failure basics", ["Cannot mount stress response", "Salt wasting and hyperkalemia directionally"]),
                ("Clinical pattern", ["GI symptoms plus hypotension", "Hyperpigmentation chronic context mention"]),
            ],
            LENDO + LCV + LSAFE,
        ),
        (
            "Anemia of Chronic Disease vs Iron Deficiency: Hepcidin Story Simplified for PN Exam Sorting",
            "anemia-chronic-disease-vs-iron-deficiency-hepcidin-simplified-rex-pn",
            "Differentiate inflammatory iron trapping vs intake/blood loss patterns conceptually.",
            [
                ("Iron availability", ["Hepcidin elevation traps iron in stores", "Functional iron deficiency idea"]),
                ("Microcytic vs normocytic framing", ["IDA microcytic tendency", "ACD often normocytic overview"]),
            ],
            LGI + LCV + LMAT,
        ),
        (
            "Sickle Cell Vaso-Occlusive Crisis: Polymerization, Microvascular Occlusion, and Pain Out of Proportion",
            "sickle-vaso-occlusive-crisis-polymerization-microvascular-occlusion-rex-pn",
            "Explain HbS polymer under deoxygenation for acute pain and organ ischemia risk items.",
            [
                ("Deoxygenation trigger", ["Sickling in microvasculature", "Repeated infarcts over time"]),
                ("Acute management lens", ["Hydration and oxygen as common supports", "Infection as precipitant"]),
            ],
            LCV + LMAT + LMUSC,
        ),
        (
            "Deep Vein Thrombosis: Virchow Triad Applied to Postoperative and Immobile Patients for REx-PN",
            "dvt-virchow-triad-postoperative-immobile-rex-pn",
            "Connect stasis, endothelial injury, and hypercoagulability to calf pain and PE fear.",
            [
                ("Stasis mechanisms", ["Immobility and bedrest", "Compression devices rationale"]),
                ("Endothelial injury", ["Surgery trauma to vessel wall", "IV sites as minor injury context"]),
                ("PE linkage", ["Clot embolization to pulmonary circulation", "Unexplained hypoxia reporting"]),
            ],
            LCV + LPERI + LSAFE,
        ),
        (
            "Pulmonary Embolism Gas Exchange Failure: Dead Space Ventilation and Sudden Hypoxia Exam Vignettes",
            "pulmonary-embolism-dead-space-ventilation-sudden-hypoxia-rex-pn",
            "Explain V/Q mismatch and increased dead space for breathlessness without clear lung infection.",
            [
                ("Embolus physiology", ["Obstructed perfusion to ventilated alveoli", "Increased physiologic dead space"]),
                ("Right heart strain tie-back", ["Elevated PA pressures concept", "Collapse risk in massive PE"]),
            ],
            LRESP + LCV + LSAFE,
        ),
        (
            "Acute Respiratory Distress Syndrome: Diffuse Alveolar Damage and Stiff Lungs (High-Yield Concept for PN)",
            "ards-diffuse-alveolar-damage-stiff-lungs-concept-rex-pn",
            "Describe protein-rich edema and surfactant loss increasing work of breathing in critical care exposure items.",
            [
                ("Capillary leak into alveoli", ["Non-cardiogenic pulmonary edema distinction", "Refractory hypoxemia"]),
                ("Ventilator basics for PN observers", ["PEEP recruitment idea without settings", "Sedation and suctioning safety"]),
            ],
            LRESP + LCV + LPERI,
        ),
        (
            "Pleural Effusion Transudate vs Exudate: Hydrostatic vs Inflammatory Drivers at Concept Level",
            "pleural-effusion-transudate-exudate-hydrostatic-inflammatory-rex-pn",
            "Relate CHF fluid shifts vs infection/malignancy exudative processes to breath sounds and imaging reports.",
            [
                ("Transudate physiology", ["Increased hydrostatic pressure", "Hypoalbuminemia lowering oncotic pressure"]),
                ("Exudate physiology", ["Inflammatory pleural permeability", "Infection and malignancy contexts"]),
            ],
            LRESP + LCV + LINFX,
        ),
        (
            "Asthma–COPD Overlap: Mixed Reversible and Fixed Obstruction Patterns Confusing Exam Distractors",
            "asthma-copd-overlap-reversible-fixed-obstruction-distractors-rex-pn",
            "Explain coexistence of bronchial hyperreactivity with emphysematous changes for medication teaching complexity.",
            [
                ("Overlap physiology", ["Partial reversibility on spirometry idea", "Increased exacerbation burden"]),
            ],
            LRESP + LMAT + LENDO,
        ),
        (
            "Bronchiectasis: Abnormal Airway Dilation, Mucus Stasis, and Recurrent Infection Cycles",
            "bronchiectasis-dilation-mucus-stasis-recurrent-infection-rex-pn",
            "Map destroyed elastic and muscle layers to chronic productive cough and hemoptysis risk.",
            [
                ("Structural airway damage", ["Impaired mucociliary clearance", "Colonization and exacerbations"]),
            ],
            LRESP + LINFX + LMAT,
        ),
        (
            "Tuberculosis Latent vs Active: Granuloma Containment Failure and Cavitation Basics for IPC Questions",
            "tb-latent-vs-active-granuloma-cavitation-ipc-rex-pn",
            "Describe containment, reactivation risk, and airborne precautions rationale.",
            [
                ("Immune containment", ["Granuloma walling off bacilli", "PPD/IGRA interpretation belongs to provider"]),
                ("Active disease", ["Cavitary lesions increase bacillary load", "Airborne isolation rationale"]),
            ],
            LINFX + LRESP + LSAFE,
        ),
        (
            "Influenza Viral Pneumonia vs Secondary Bacterial Pneumonia: Superinfection Timing on Exam Scenarios",
            "influenza-viral-pneumonia-secondary-bacterial-superinfection-timing-rex-pn",
            "Explain epithelial damage predisposing to bacterial invasion after initial viral illness.",
            [
                ("Viral cytopathic effect", ["Ciliated epithelium injury", "Mucus clearance failure"]),
                ("Bacterial superinfection", ["Strep pneumo classic mention", "Worsening after initial improvement clue"]),
            ],
            LINFX + LRESP + LPEDS,
        ),
        (
            "COVID-19 Pneumonia: ACE2 Entry, Endotheliitis Concept, and Silent Hypoxia Teaching Point",
            "covid19-pneumonia-ace2-endotheliitis-silent-hypoxia-rex-pn",
            "High-level viral tropism and microvascular dysfunction story for public health era exam items.",
            [
                ("Alveolar involvement", ["Diffuse infiltrates and V/Q mismatch", "Happy hypoxemia communication risk"]),
            ],
            LINFX + LRESP + LSAFE,
        ),
        (
            "Anaphylaxis: Massive Mast Cell Degranulation, Angioedema Airway Compromise, and Biphasic Reaction Fear",
            "anaphylaxis-mast-cell-degranulation-angioedema-biphasic-rex-pn",
            "Connect IgE-mediated (and non-IgE) pathways to distributive shock and airway edema for emergency drills.",
            [
                ("Mediator flood", ["Histamine and bronchospasm", "Vasodilation and distributive shock"]),
                ("Airway priority", ["Uvula/tongue/laryngeal edema progression", "Epinephrine as time-critical—provider administered"]),
            ],
            LSAFE + LCV + LMAT,
        ),
        (
            "Angioedema Without Urticaria: Bradykinin-Mediated Swelling vs Histamine-Mediated (Exam Differentiation)",
            "angioedema-bradykinin-vs-histamine-ace-inhibitor-rex-pn",
            "Differentiate ACE inhibitor-associated bradykinin excess from allergic angioedema for triage language.",
            [
                ("Bradykinin pathway", ["ACE normally degrades bradykinin", "Swelling can be delayed months after start"]),
            ],
            LMAT + LSAFE + LCV,
        ),
        (
            "Burn Depth Pathophysiology: Coagulation Necrosis Zone, Capillary Leak, and Fluid Resuscitation Rationale",
            "burn-depth-coagulation-necrosis-capillary-leak-resuscitation-rex-pn",
            "Explain partial vs full thickness injury and systemic inflammatory response for burn unit observation items.",
            [
                ("Zones of injury", ["Coagulation, stasis, hyperemia concept", "Progression risk over 24–48h"]),
                ("Capillary leak", ["Intravascular fluid loss to interstitium", "Hypovolemic shock risk"]),
            ],
            LSKIN + LCV + LGI,
        ),
        (
            "Frostbite Tissue Injury: Ice Crystal Formation, Rewarming Injury Concept, and Compartment Watch",
            "frostbite-ice-crystals-rewarming-injury-compartment-watch-rex-pn",
            "Describe cold-induced cellular damage and thaw risks for community Canadian exposure items.",
            [
                ("Cellular ice formation", ["Endothelial injury and thrombosis risk", "Blistering significance"]),
                ("Rewarming", ["Rapid warm water principles", "Pain management and infection prevention"]),
            ],
            LSKIN + LCV + LSAFE,
        ),
        (
            "Heat Stroke: Thermoregulatory Failure, Splanchnic Shunting, and Rhabdomyolysis–AKI Link (Concept)",
            "heat-stroke-thermoregulatory-failure-rhabdo-akilink-rex-pn",
            "Explain CNS dysfunction from extreme hyperthermia and muscle breakdown sequelae.",
            [
                ("Exertional vs classic", ["Muscle heat production vs impaired dissipation in elderly", "Medications reducing sweating"]),
            ],
            LCV + LGI + LSAFE,
        ),
        (
            "Hypothermia: Osborn Waves Mention, Arrhythmia Risk, and Rewarming Shock Concept for Emergency PN Items",
            "hypothermia-arrhythmia-rewarming-shock-concept-rex-pn",
            "Describe core temperature drop effects on conduction and coagulation at recognition level.",
            [
                ("Cold myocardium", ["VF risk during movement", "J-wave as trivia exam hook"]),
                ("Afterdrop concept", ["Peripheral rewarming returns cold blood to core", "Gentle handling principles"]),
            ],
            LCV + LSAFE + LMAT,
        ),
        (
            "Hypernatremia Water Deficit: Osmotic Pull on Brain and Thirst Failure in Frail Older Adults",
            "hypernatremia-water-deficit-osmotic-brain-thirst-failure-rex-pn",
            "Explain free water loss exceeding intake leading to neurologic symptoms in LTC vignettes.",
            [
                ("Osmotic water shift", ["Brain shrinkage and vessel stretch headache", "Altered mental status"]),
            ],
            LGI + LNEURO + LMAT,
        ),
        (
            "Hyponatremia Brain Swelling Risk: Acute vs Chronic Compensation and Why Seizures Occur",
            "hyponatremia-brain-swelling-acute-chronic-seizures-rex-pn",
            "Differentiate rapid sodium drop vs slow adaptation for seizure risk exam framing.",
            [
                ("Osmotic swelling", ["Neurons swell when serum osmolality falls quickly", "Chronic compensation reduces symptom threshold"]),
            ],
            LGI + LNEURO + LSAFE,
        ),
        (
            "Hyperkalemia Membrane Instability: Peaked T Waves to Arrhythmia Progression Practical Nurses Monitor",
            "hyperkalemia-membrane-instability-peaked-t-waves-arrhythmia-rex-pn",
            "Explain elevated extracellular K+ and cardiac conduction vulnerability for ECG recognition items.",
            [
                ("Resting membrane potential", ["Depolarization speed changes", "Peaked T and widened QRS progression"]),
            ],
            LCV + LMAT + LGI,
        ),
        (
            "Hypokalemia and Muscle Weakness: Intracellular Shift vs GI/Renal Loss Mechanisms for Diuretic Patients",
            "hypokalemia-muscle-weakness-shift-vs-loss-diuretic-patients-rex-pn",
            "Map loop/thiazide loss and alkalosis shift to cramps and ileus risk.",
            [
                ("Renal potassium wasting", ["Diuretic site of action overview", "Magnesium depletion worsens loss"]),
            ],
            LGI + LMAT + LCV,
        ),
        (
            "Hypercalcemia ‘Stones Bones Groans Thrones’ Pathophysiology: Bone Resorption and Renal Concentrating Defect",
            "hypercalcemia-stones-bones-groans-thrones-pathophysiology-rex-pn",
            "Tie PTH-related vs malignancy-related hypercalcemia at a sorting level for exam mnemonics.",
            [
                ("Neuromuscular effects", ["Shortened QT concept", "Constipation and altered mental status"]),
            ],
            LGI + LNEURO + LMAT,
        ),
        (
            "Hypocalcemia Tetany: Neuromuscular Excitability and Chvostek/Trousseau Exam Links for PN Theory",
            "hypocalcemia-tetany-chvostek-trousseau-exam-links-rex-pn",
            "Explain lowered threshold for nerve firing with carpopedal spasm after cuff inflation.",
            [
                ("Ionized calcium", ["Albumin binding and pH effects high-level", "Post-thyroidectomy parathyroid risk"]),
            ],
            LGI + LNEURO + LPERI,
        ),
        (
            "Magnesium Depletion and Arrhythmia: Co-Depletion With Potassium Practical Nurses See on Med-Surg",
            "magnesium-depletion-arrhythmia-co-depletion-potassium-rex-pn",
            "Describe Mg2+ role in Na/K pump stability and torsades risk mention.",
            [
                ("Electrolyte partnership", ["Refractory hypokalemia until Mg repleted concept", "Alcohol and diuretic triggers"]),
            ],
            LCV + LGI + LMAT,
        ),
        (
            "Phosphate Disorders in Renal Failure: CKD–MBD Mineral Bone Disorder Overview for PN Patient Education",
            "phosphate-disorders-renal-failure-ckd-mbd-overview-rex-pn",
            "Explain hyperphosphatemia driving secondary hyperparathyroidism at concept level.",
            [
                ("Calcium phosphate product idea", ["Vascular calcification concern", "Itching and bone pain context"]),
            ],
            LRENAL + LMAT + LGI,
        ),
        (
            "Acute Glaucoma Angle Closure: Aqueous Outflow Obstruction and Sudden Vision Loss Emergency",
            "acute-angle-closure-glaucoma-aqueous-outflow-obstruction-rex-pn",
            "Map pupillary block to rapid IOP rise with nausea and halos for triage recognition.",
            [
                ("Anterior chamber mechanics", ["Blocked trabecular outflow", "Ciliary body continued aqueous production"]),
            ],
            LNEURO + LSAFE + LMUSC,
        ),
        (
            "Cataract Lens Protein Changes: Opacity Scattering Light and Postoperative Inflammation/Infection Risks",
            "cataract-lens-protein-opacity-postoperative-risks-rex-pn",
            "Describe aging lens changes and why sterile drops and hand hygiene matter after surgery.",
            [
                ("Lens fiber compaction", ["Light scatter and glare", "Color desaturation"]),
            ],
            LPERI + LSKIN + LINFX,
        ),
        (
            "Otitis Media Middle Ear Effusion: Eustachian Tube Dysfunction and Pediatric Anatomy Exam Angle",
            "otitis-media-eustachian-dysfunction-pediatric-anatomy-rex-pn",
            "Explain horizontal eustachian tube and URI congestion leading to bacterial superinfection.",
            [
                ("Pressure equalization failure", ["Negative pressure and fluid accumulation", "Pain with percussion/airplane"]),
            ],
            LPEDS + LINFX + LMAT,
        ),
    ]
    return [item(title, slug, intent, blocks, links) for title, slug, intent, blocks, links in specs]

def _outline_autogen(focus: str) -> list[tuple[str, list[str]]]:
    f = focus.strip()[:90]
    return [
        (
            "Mechanism and progression",
            [f"Pathophysiology anchors tied to: {f}", "Key tissue, organ, or mediator changes at PN depth"],
        ),
        (
            "Assessment correlates and exam distractors",
            ["Clustered cues REx-PN items favor", "How to describe changes objectively without diagnosing"],
        ),
        (
            "Nursing integration within PN scope",
            ["Monitoring, teaching, and documentation hooks", "Escalation language, collaboration, and safety checks"],
        ),
    ]


def _e(title: str, slug: str, intent: str, links: list[str]) -> dict:
    return item(title, slug, intent, _outline_autogen(title), links)


def symptoms() -> list[dict]:
    stems: list[tuple[str, str, list[str]]] = [
        (
            "Orthopnea Creeping Up Over Nights With Pitting Ankle Edema: Left-Sided Back-Up vs COPD Retention Clues",
            "orthopnea-nights-ankle-edema-left-backup-vs-copd-retention-rex-pn",
            "Sort volume overload pulmonary congestion patterns from hypercapnic work-of-breathing mimics for exam vignettes.",
            LCV + LRESP + LMAT,
        ),
        (
            "Sudden Pleuritic Chest Pain With Unilateral Breath Sounds Quiet: Pneumothorax vs Massive PE vs Pneumonia Edge Cases",
            "pleuritic-chest-quiet-breath-sounds-pneumothorax-pe-pneumonia-rex-pn",
            "Explain gas exchange and ventilation disruption mechanisms behind sharp pleuritic pain clusters.",
            LRESP + LCV + LSAFE,
        ),
        (
            "Thunderclap Headache Peaking in 60 Seconds: Subarachnoid Bleed Fear vs Migraine vs Hypertensive Surge Sorting",
            "thunderclap-headache-60s-sah-migraine-htn-surge-rex-pn",
            "Map rapid intracranial pressure/vascular events to red-flag reporting language for triage-style items.",
            LNEURO + LCV + LSAFE,
        ),
        (
            "Flank Pain With Rigors but No Stones on History: Pyelonephritis Ascent vs Musculoskeletal Strain vs Shingles Band",
            "flank-pain-rigors-pyelo-strain-shingles-rex-pn",
            "Trace inflammatory renal capsule stretch vs dermatomal nerve inflammation for symptom overlap questions.",
            LRENAL + LINFX + LNEURO,
        ),
        (
            "Coffee-Ground Emesis After NSAIDs: Mucosal Erosion Pathway vs Variceal Bleed Clues Practical Nurses Separate",
            "coffee-ground-emesis-nsaids-mucosal-vs-variceal-rex-pn",
            "Contrast acid-injured mucosa oozing with portal hypertension vessel rupture at recognition depth.",
            LGI + LCV + LMAT,
        ),
        (
            "Bright Red Rectal Bleeding After Constipation Straining: Hemorrhoidal Tear vs Diverticular Artery Fear",
            "bright-red-pr-bleeding-straining-hemorrhoid-vs-diverticular-rex-pn",
            "Explain low vs high bleeding source speed cues and perfusion risk without definitive diagnosis language.",
            LGI + LCV + LSAFE,
        ),
        (
            "Worst Abdominal Pain of Life Radiating to Back With Doubling Over: Pancreatic Enzyme Autodigestion Story",
            "worst-abdominal-pain-radiating-back-pancreatic-autodigestion-rex-pn",
            "Link retroperitoneal inflammation and third-spacing threats to vitals and escalation priorities.",
            LGI + LCV + LMAT,
        ),
        (
            "Right Upper Quadrant Pain After Fatty Meal With Fever: Cystic Duct Obstruction Inflammation Progression",
            "ruq-pain-fatty-meal-fever-cystic-duct-obstruction-rex-pn",
            "Describe gallbladder wall ischemia and peritoneal irritation patterns for med-surg exam stems.",
            LGI + LPERI + LINFX,
        ),
        (
            "Diffuse Cramping Then Rigidity After Wound Infection: Tetanus Toxin Motor Neuron Disinhibition Basics",
            "diffuse-cramping-rigidity-wound-tetanus-disinhibition-rex-pn",
            "Explain toxin blockade of inhibitory interneurons causing sustained contraction for immunization teaching tie-ins.",
            LINFX + LMUSC + LSAFE,
        ),
        (
            "Ascending Weakness Starting in Feet Days After Campylobacter: Guillain–Barré Demyelination Concept",
            "ascending-weakness-feet-campylobacter-gbs-concept-rex-pn",
            "Outline immune attack on peripheral myelin and ventilatory fatigue risk for ICU step-down monitoring items.",
            LNEURO + LRESP + LMAT,
        ),
        (
            "Sudden Unilateral Vision Curtain With Floaters Flash: Retinal Detachment Urgency vs Vitreous Detachment Benign",
            "unilateral-curtain-floaters-flash-detachment-vs-vitreous-rex-pn",
            "Differentiate traction on retina vs benign vitreous separation using mechanism language for ophthalmology triage.",
            LNEURO + LSAFE + LMUSC,
        ),
        (
            "Palpitations With Irregularly Irregular Pulse After Holiday Drinking: Holiday Heart vs Hyperthyroid Surge",
            "palpitations-irregular-holiday-heart-vs-thyrotoxicosis-rex-pn",
            "Explain atrial stretch and adrenergic triggers promoting AF in binge settings at conceptual level.",
            LCV + LENDO + LMH,
        ),
        (
            "Burning Dysuria With Suprapubic Pressure but No Fever: Cystitis Mucosa Inflammation vs Early Pyelonephritis",
            "burning-dysuria-suprapubic-cystitis-vs-early-pyelo-rex-pn",
            "Trace bladder wall invasion limits versus ascending parenchymal involvement for antibiotic teaching context.",
            LRENAL + LINFX + LMAT,
        ),
        (
            "Bilateral Leg Swelling Pitting by Evening Only: Chronic Venous Insufficiency vs Bilateral DVT vs HF Clues",
            "bilateral-leg-edema-evening-cvi-dvt-hf-rex-pn",
            "Contrast hydrostatic edema, clot obstruction, and pump failure distribution for assessment sorting questions.",
            LCV + LMUSC + LRESP,
        ),
        (
            "Facial Droplet Saliva With Arm Drift at Breakfast: MCA Territory Ischemia Penumbra Time Window Language",
            "facial-droplet-arm-drift-mca-penumbra-time-rex-pn",
            "Describe focal ischemia deficits and why immediate activation matters without naming thrombolysis eligibility.",
            LNEURO + LCV + LSAFE,
        ),
        (
            "Shaking Chills Then Spiking Fever After Central Line Dressing Gap: Catheter-Related Bloodstream Infection Path",
            "rigors-fever-central-line-dressing-gap-crbsi-rex-pn",
            "Explain skin flora tunneling along catheter biofilm for sepsis source suspicion in acute care scenarios.",
            LINFX + LPERI + LSAFE,
        ),
        (
            "Localized Hive Wheel After Bee Sting Then Wheeze: IgE-Mediated Phase Progression to Systemic Mediators",
            "hive-wheel-bee-sting-then-wheeze-ige-progression-rex-pn",
            "Tie mast cell degranulation in skin to airway smooth muscle constriction for anaphylaxis teaching items.",
            LSKIN + LRESP + LMAT,
        ),
        (
            "Sudden Testicular Pain With High Riding Testis: Torsion Vascular Compromise and Time-Critical Escalation",
            "testicular-pain-high-riding-testis-torsion-vascular-rex-pn",
            "Describe spermatic cord twist compromising arterial inflow for pain out of proportion pediatric-adult overlap.",
            LPEDS + LSAFE + LGI,
        ),
        (
            "Postpartum Chills Tachycardia Uterus Boggy: Endometritis vs Atony Bleeding vs Normal Third Stage Sorting",
            "postpartum-chills-tachy-boggy-uterus-endometritis-atony-rex-pn",
            "Differentiate infection-driven inflammation from tone failure hemorrhage mechanisms in OB recovery items.",
            LOBS + LINFX + LCV,
        ),
        (
            "Infant Paroxysmal Whoop With Post-Tussive Emesis: Bordetella Airway Mucosa Injury and Lymphocyte Response",
            "infant-whoop-post-tussive-emesis-pertussis-airway-rex-pn",
            "Explain toxin-mediated ciliated epithelium damage prolonging cough for public health isolation teaching.",
            LPEDS + LRESP + LINFX,
        ),
        (
            "Older Adult ‘Just Weak’ With Low-Grade Temp and New Incontinence: Atypical UTI Delirium Mechanism Overview",
            "older-adult-weak-low-fever-incontinence-uti-delirium-rex-pn",
            "Link systemic inflammation and dehydration to acute brain dysfunction without labeling dementia.",
            LNEURO + LRENAL + LINFX,
        ),
        (
            "Sharp Midline Back Pain After IV Drug Use With Fever: Vertebral Osteomyelitis Seeding vs Renal Colic",
            "midline-back-ivdu-fever-osteomyelitis-vs-colic-rex-pn",
            "Describe hematogenous bacterial seeding to disc space versus ureteral obstruction pain patterns.",
            LINFX + LMUSC + LRENAL,
        ),
        (
            "Painful Vesicles in a Single Thoracic Dermatome: Dorsal Root Ganglion Varicella Reactivation Neuropathic Cascade",
            "painful-vesicles-single-dermatome-zoster-ganglion-rex-pn",
            "Explain latency reactivation along sensory nerve with localized skin breakdown for infection control teaching.",
            LSKIN + LNEURO + LINFX,
        ),
        (
            "Sudden Jaw Claudication With Scalp Tenderness in Older Adult: Giant Cell Arteritis Ischemic Inflammation Fear",
            "jaw-claudication-scalp-tenderness-gca-ischemic-inflammation-rex-pn",
            "Outline large-vessel granulomatous inflammation threatening optic ischemia for urgent escalation language.",
            LNEURO + LCV + LSAFE,
        ),
        (
            "Rest Pain in Foot at Night Relieved by Dangling: Chronic Limb Ischemia Steal vs Neuropathic Burning Sorting",
            "rest-foot-pain-night-dangling-ischemia-vs-neuropathy-rex-pn",
            "Contrast perfusion-dependent pain with diabetic small-fiber dysesthesia for foot ulcer prevention teaching.",
            LENDO + LCV + LMUSC,
        ),
        (
            "Hoarseness Months After Thyroid Surgery With Carpopedal Spasm: Recurrent Laryngeal Injury vs Hypocalcemia Twitch",
            "hoarseness-post-thyroid-carpopedal-laryngeal-vs-hypocalcemia-rex-pn",
            "Separate nerve traction injury from ionized calcium drop increasing neuromuscular excitability postoperatively.",
            LPERI + LGI + LNEURO,
        ),
        (
            "Severe Itching After Dialysis With Fine Tremor: Phosphate-Calcium–PTH Imbalance Skin Mediator Concept",
            "itching-after-dialysis-tremor-ckd-mineral-skin-rex-pn",
            "Explain uremic toxin retention and mineral axis disturbance driving pruritus and neuromuscular irritability.",
            LRENAL + LSKIN + LMAT,
        ),
        (
            "Epistaxis on Anticoagulant With Lightheadedness: Mucosal Vessel Rupture vs Coagulopathy vs Hypovolemia Link",
            "epistaxis-anticoagulant-lightheaded-mucosal-vs-coagulopathy-rex-pn",
            "Tie platelet–coagulation medication effects to airway bleeding volume loss for med-surg stabilization items.",
            LMAT + LCV + LSAFE,
        ),
        (
            "Crushing Substernal Pressure Radiating to Jaw During Snow Shoveling: Demand Ischemia in Cold Vasoconstriction",
            "substernal-pressure-jaw-snow-shoveling-demand-ischemia-rex-pn",
            "Combine coronary supply limits with sympathetic cold stress raising myocardial oxygen demand.",
            LCV + LSAFE + LCAN,
        ),
        (
            "Green Purulent Sputum After Dental Work With New Murmur: Endocarditis Vegetation Embolic Sepsis Cluster",
            "green-sputum-dental-murmur-endocarditis-cluster-rex-pn",
            "Describe bacteremia seeding damaged endothelium with systemic embolic phenomena for infection urgency items.",
            LINFX + LCV + LMAT,
        ),
        (
            "Severe Retrosternal Burning After Pill Stuck Feeling: Pill Esophagitis vs Cardiac Pain Overlap Mechanisms",
            "retrosternal-burning-pill-stuck-esophagitis-vs-cardiac-rex-pn",
            "Differentiate mucosal chemical injury and spasm from ischemic chest discomfort for safe escalation wording.",
            LGI + LCV + LMH,
        ),
        (
            "Sudden Confusion in TBI Patient With Fixed Pupil: Herniation Mass Effect Progression Practical Nurses Recognize",
            "tbi-confusion-fixed-pupil-herniation-mass-effect-rex-pn",
            "Explain rising intracranial pressure shifting brain tissue compressing cranial nerve three for neuro checks.",
            LNEURO + LSAFE + LPERI,
        ),
        (
            "Painful Red Breast Wedge With Fever in Lactation: Stasis Mastitis vs Abscess Formation Progression",
            "red-breast-wedge-fever-lactation-mastitis-abscess-rex-pn",
            "Map milk stasis duct inflammation to bacterial invasion and localized pus collection for community teaching.",
            LOBS + LINFX + LSKIN,
        ),
        (
            "Intermittent Claudication Progressing to Rest Pain: Arterial Stenosis Hemodynamic Failure in Peripheral Vessels",
            "claudication-to-rest-pain-peripheral-arterial-stenosis-rex-pn",
            "Describe fixed stenosis limiting flow under muscle demand then at rest for vascular assessment items.",
            LCV + LMUSC + LENDO,
        ),
        (
            "Sudden Hearing Loss With Vertigo After URI: Labyrinthitis Inflammation vs Benign Positional Crystals Sorting",
            "sudden-hearing-loss-vertigo-post-uri-labyrinthitis-vs-bppv-rex-pn",
            "Contrast inner ear inflammatory swelling from otolith canalithiasis at high-yield exam differentiation depth.",
            LNEURO + LPEDS + LMH,
        ),
        (
            "Painful Urination With Vesicles on Shaft: HSV Mucosal Ulceration vs Gonococcal Urethritis Clues for STI Teaching",
            "painful-urination-shaft-vesicles-hsv-vs-gc-rex-pn",
            "Explain epithelial viral cytopathic vesicle formation vs purulent urethritis for nonjudgmental screening education.",
            LINFX + LMH + LRENAL,
        ),
        (
            "Generalized Tonic-Clonic Then Prolonged Confusion: Postictal Neuronal Exhaustion vs Nonconvulsive Status Fear",
            "gtc-then-prolonged-confusion-postictal-vs-ncse-rex-pn",
            "Describe metabolic recovery lag versus ongoing subclinical seizure activity as escalation judgment framing.",
            LNEURO + LMAT + LSAFE,
        ),
        (
            "Severe Eye Pain Halos Nausea Mid-Dilation: Angle Closure Pupillary Block and Rapid IOP Rise Mechanism",
            "eye-pain-halos-nausea-mid-dilation-angle-closure-rex-pn",
            "Map aqueous outflow obstruction to corneal edema and systemic autonomic symptoms for same-day referral language.",
            LNEURO + LSAFE + LMAT,
        ),
        (
            "Progressive Ascending Paralysis After Tick Bite in Rural Ontario: Tick Paralysis Neurotoxin vs GBS Timing",
            "ascending-paralysis-tick-bite-rural-ontario-toxin-vs-gbs-rex-pn",
            "Compare reversible presynaptic toxin blockade with immune-mediated demyelination onset for exposure history items.",
            LNEURO + LINFX + LCAN,
        ),
        (
            "Numb Lips and Fingertips Around Mouth After Hyperventilating: Respiratory Alkalosis Ionized Calcium Shift Mimic",
            "numb-lips-fingertips-hyperventilation-respiratory-alkalosis-calcium-rex-pn",
            "Explain acute pH rise lowering ionized calcium transiently versus true hypocalcemia for panic-attack teaching items.",
            LGI + LMH + LNEURO,
        ),
    ]
    assert len(stems) == 40
    return [_e(t, s, i, lk) for t, s, i, lk in stems]


def red_flags() -> list[dict]:
    stems: list[tuple[str, str, list[str]]] = [
        (
            "New Confusion in Older Adult Post–UTI Treatment: Hyponatremia Overcorrection vs Recurrent Sepsis Red Flags",
            "new-confusion-post-uti-treatment-hyponatremia-sepsis-red-flags-rex-pn",
            "Surface osmotic shifts and infection recurrence as reasons to stop, reassess, and escalate per protocol.",
            LNEURO + LGI + LSAFE,
        ),
        (
            "Sudden Bilateral Leg Weakness With Urinary Retention: Cauda Equina Compression Fear and Time-Sensitive Reporting",
            "bilateral-leg-weakness-retention-cauda-equina-red-flag-rex-pn",
            "Explain nerve root saddle compression pathophysiology behind motor and autonomic deficits for emergency activation.",
            LNEURO + LRENAL + LSAFE,
        ),
        (
            "Melena With Postural Hypotension After NSAID Course: Upper GI Hemorrhage Perfusion Threat Escalation Language",
            "melena-postural-hypotension-nsaid-upper-gi-bleed-red-flag-rex-pn",
            "Tie intravascular volume loss to baroreceptor failure patterns for rapid response communication.",
            LGI + LCV + LSAFE,
        ),
        (
            "Fever Tachycardia Hypotension After Central Line Flush: Septic Shock Capillary Leak and Lactic Acidosis Fear",
            "fever-tachy-hypotension-line-flush-septic-shock-red-flag-rex-pn",
            "Describe systemic inflammatory vasodilation with relative hypovolemia for sepsis bundle awareness items.",
            LINFX + LCV + LSAFE,
        ),
        (
            "Sudden Severe Headache With Neck Stiffness Photophobia: Meningeal Irritation Until Proven Otherwise Reporting",
            "sudden-headache-stiff-neck-photophobia-meningeal-red-flag-rex-pn",
            "Connect meningeal inflammation to nuchal rigidity and rapid deterioration risk for isolation and escalation.",
            LNEURO + LINFX + LSAFE,
        ),
        (
            "Chest Pain With Diaphoresis and Sense of Doom: ACS High-Risk Presentation Practical Nurses Activate Early",
            "chest-pain-diaphoresis-doom-acs-red-flag-rex-pn",
            "Explain sympathetic surge with myocardial ischemia for time-sensitive team activation without independent diagnosis.",
            LCV + LMH + LSAFE,
        ),
        (
            "Wheeze Suddenly Absent in Exhausted Asthma Patient: Silent Chest Air Movement Collapse Escalation Priority",
            "wheeze-absent-exhausted-asthma-silent-chest-red-flag-rex-pn",
            "Describe fatigue-driven respiratory muscle failure with reduced turbulent flow sounds for emergency recognition.",
            LRESP + LSAFE + LMAT,
        ),
        (
            "New Petechiae Palpable Purpura With Fever in Child: Meningococcemia DIC Capillary Hemorrhage Fear",
            "petechiae-purpura-fever-child-meningococcemia-red-flag-rex-pn",
            "Outline endotoxin-mediated vascular injury and coagulopathy skin signs for urgent pediatric escalation.",
            LPEDS + LINFX + LSAFE,
        ),
        (
            "Severe RUQ Pain With Fever Jaundice in Pregnancy: HELLP Liver Capsule Stretch vs Cholecystitis Overlap",
            "ruq-pain-fever-jaundice-pregnancy-hellp-vs-chole-red-flag-rex-pn",
            "Differentiate obstetric liver injury progression from biliary obstruction inflammation for OB triage items.",
            LOBS + LGI + LSAFE,
        ),
        (
            "Hematuria Clots With Flank Mass Pain: Obstructive Uropathy Hydronephrosis and AKI Threat Red Flag",
            "hematuria-clots-flank-mass-obstructive-uropathy-red-flag-rex-pn",
            "Explain postrenal pressure backup injuring renal parenchyma for catheter and provider urgency language.",
            LRENAL + LGI + LSAFE,
        ),
        (
            "Sudden Dyspnea With Unilateral Leg Swelling After Surgery: PE Obstruction and RV Failure Recognition Cluster",
            "dyspnea-unilateral-leg-postop-pe-rv-failure-red-flag-rex-pn",
            "Map embolic obstruction to dead space ventilation and right heart strain signs for rapid response triggers.",
            LRESP + LCV + LPERI,
        ),
        (
            "Black Stool With Coffee Grounds and Coffee-Ground NG Return: Massive Upper GI Bleed Perfusion Collapse Risk",
            "black-stool-coffee-grounds-ng-massive-ugi-bleed-red-flag-rex-pn",
            "Tie brisk mucosal arterial bleeding to hypovolemic shock progression for ICU step-down monitoring priorities.",
            LGI + LCV + LSAFE,
        ),
        (
            "Facial Swelling Tongue Tingling Minutes After Peanut: Airway Angioedema Progression and Epinephrine Readiness",
            "facial-swelling-tongue-tingling-peanut-angioedema-red-flag-rex-pn",
            "Explain histamine-driven mucosal leak expanding upper airway lumen compromise for anaphylaxis protocols.",
            LSAFE + LRESP + LMAT,
        ),
        (
            "Sudden Vision Loss Monocular Curtain Without Pain: Central Retinal Artery Occlusion Time-Critical Eye Emergency",
            "painless-monocular-curtain-crao-eye-emergency-red-flag-rex-pn",
            "Describe retinal ischemia from embolic or thrombotic arterial occlusion for same-day specialist activation.",
            LNEURO + LCV + LSAFE,
        ),
        (
            "Severe Abdominal Rigidity Rebound Guarding After Ulcer History: Perforated Viscus Chemical Peritonitis Red Flag",
            "rigid-abdomen-rebound-ulcer-perforation-red-flag-rex-pn",
            "Map GI contents into peritoneum inciting inflammation and sepsis cascade for surgical emergency language.",
            LGI + LINFX + LSAFE,
        ),
        (
            "New-Onset Slurred Speech With Unequal Pupils After Head Bump: Epidural Bleed Mass Effect Herniation Fear",
            "slurred-speech-unequal-pupils-head-bump-epidural-red-flag-rex-pn",
            "Explain arterial bleed stripping dura causing unilateral pupil involvement for neurosurgical urgency items.",
            LNEURO + LSAFE + LPEDS,
        ),
        (
            "Purple Netting Rash With Fever Shock in Elder: Purpura Fulminans Skin Necrosis and DIC Progression Awareness",
            "purple-netting-rash-fever-purpura-fulminans-dic-red-flag-rex-pn",
            "Outline microvascular thrombosis and skin ischemia in overwhelming sepsis for isolation and escalation.",
            LSKIN + LINFX + LCV,
        ),
        (
            "Sudden Testicular Pain High-Riding Testis in Adolescent: Torsion Vascular Occlusion Time Window Red Flag",
            "adolescent-torsion-high-riding-testis-vascular-red-flag-rex-pn",
            "Emphasize spermatic cord twist compromising perfusion for emergency department referral language.",
            LPEDS + LSAFE + LGI,
        ),
        (
            "Inability to Void After Epidural With Bladder Distension: Urinary Retention Autonomic Neuropathy vs Block Effect",
            "unable-void-epidural-distension-retention-red-flag-rex-pn",
            "Differentiate sacral nerve blockade from overflow incontinence mimics for catheterization policy items.",
            LRENAL + LPERI + LNEURO,
        ),
        (
            "Sudden Flaccid Paralysis After Camp Picnic Home-Canned Goods: Botulism Presynaptic Blockade Neurotoxin Red Flag",
            "flaccid-paralysis-canned-goods-botulism-red-flag-rex-pn",
            "Describe toxin preventing acetylcholine release at NMJ causing descending weakness and respiratory failure risk.",
            LINFX + LNEURO + LSAFE,
        ),
        (
            "Severe Back Pain IV Drug Use Fever Without Trauma: Epidural Abscess Cord Compression Red Flag Cluster",
            "ivdu-fever-severe-back-epidural-abscess-red-flag-rex-pn",
            "Explain hematogenous infection in epidural space compressing cord for motor/sensory deficit escalation.",
            LINFX + LMUSC + LNEURO,
        ),
        (
            "Sudden Shortness of Breath Sitting Up Orthopnea Pink Frothy Sputum: Flash Pulmonary Edema Sympathetic Surge",
            "orthopnea-pink-frothy-flash-pulmonary-edema-red-flag-rex-pn",
            "Connect abrupt LV failure with alveolar flooding and airway froth for emergency oxygen escalation items.",
            LCV + LRESP + LSAFE,
        ),
        (
            "Infant Bulging Fontanelle Lethargy Fever: Meningitis Increased ICP Pediatric Red Flag Reporting",
            "bulging-fontanelle-lethargy-fever-infant-meningitis-red-flag-rex-pn",
            "Describe intracranial pressure transmission to open sutures with systemic toxicity for pediatric triage.",
            LPEDS + LNEURO + LINFX,
        ),
        (
            "Suicidal Ideation With Plan Means Access: Mental Health Safety Red Flag Pathway Practical Nurses Document",
            "suicidal-ideation-plan-means-access-safety-red-flag-rex-pn",
            "Explain acute risk state requiring protective protocols and interprofessional mental health activation language.",
            LMH + LSAFE + LMAT,
        ),
        (
            "Domestic Injury Pattern Incongruent Story Bruising Torso Ears: Non-Accidental Trauma Suspicion Red Flag",
            "bruising-torso-ears-incongruent-story-nat-red-flag-rex-pn",
            "Surface sentinel injury distributions and history–mechanism mismatch for mandated reporting awareness.",
            LPEDS + LSAFE + LMH,
        ),
        (
            "Sudden Unilateral Weakness With Aphasia Lasting Minutes Then Resolves: TIA Focal Ischemia Urgency Red Flag",
            "unilateral-weakness-aphasia-resolves-tia-red-flag-rex-pn",
            "Explain transient focal hypoperfusion as stroke-equivalent urgency for rapid assessment activation.",
            LNEURO + LCV + LSAFE,
        ),
        (
            "Severe Hyperglycemia Altered LOC Fruity Breath in Type 1 Teen: DKA Cerebral Edema Risk Red Flag Awareness",
            "teen-dka-altered-loc-fruity-cerebral-edema-risk-red-flag-rex-pn",
            "Map osmotic shifts and rehydration risks affecting brain water content for pediatric emergency monitoring language.",
            LENDO + LPEDS + LSAFE,
        ),
        (
            "Hemoptysis Massive Bright Red Frothy With Desaturation: Airway Bleed Asphyxiation Threat Red Flag Positioning",
            "massive-hemoptysis-frothy-desaturation-airway-bleed-red-flag-rex-pn",
            "Describe alveolar flooding with gas exchange collapse for bleeding protocol and rapid response communication.",
            LRESP + LSAFE + LCV,
        ),
        (
            "Sudden Severe Epigastric Pain Radiating to Scapula Ripping Quality: Aortic Dissection Pain Pathway Red Flag",
            "ripping-epigastric-scapula-pain-aortic-dissection-red-flag-rex-pn",
            "Explain intimal tear propagation causing visceral branch ischemia pain referral patterns for EMS activation.",
            LCV + LGI + LSAFE,
        ),
        (
            "New Petechiae After Heparin Bolus With Falling Platelets: HIT Immune Platelet Consumption Red Flag Basics",
            "petechiae-after-heparin-hit-platelet-red-flag-rex-pn",
            "Outline antibody-mediated platelet activation and microthrombotic risk for hold-heparin escalate language.",
            LMAT + LCV + LINFX,
        ),
    ]
    assert len(stems) == 30
    return [_e(t, s, i, lk) for t, s, i, lk in stems]


def chronic() -> list[dict]:
    stems: list[tuple[str, str, list[str]]] = [
        (
            "Type 2 Diabetes Progressive Insulin Resistance: Hepatic Glucose Output and Peripheral Uptake Failure Story",
            "t2dm-insulin-resistance-hepatic-glucose-output-chronic-rex-pn",
            "Explain chronic hyperglycemia glucotoxicity and microvascular basement membrane thickening for foot/eye teaching.",
            LENDO + LCV + LSKIN,
        ),
        (
            "Chronic Kidney Disease Staging Mindset: Nephron Loss Sodium–Water Dysregulation and Uremic Toxin Retention",
            "ckd-nephron-loss-sodium-water-uremic-toxins-chronic-rex-pn",
            "Map declining GFR to electrolyte shifts, anemia of renal origin, and bone mineral axis for education items.",
            LRENAL + LGI + LMAT,
        ),
        (
            "Heart Failure With Preserved EF: Stiff LV Diastolic Filling Impairment and Exercise Intolerance Pathophysiology",
            "hfpef-stiff-lv-diastolic-filling-exercise-intolerance-rex-pn",
            "Describe elevated filling pressures without classic systolic pump failure for dyspnea-on-exertion teaching.",
            LCV + LRESP + LMAT,
        ),
        (
            "COPD Chronic Airflow Limitation: Emphysema Parenchyma Destruction vs Chronic Bronchitis Mucus Hypersecretion",
            "copd-emphysema-vs-chronic-bronchitis-chronic-rex-pn",
            "Contrast alveolar wall loss gas exchange impairment with airway inflammation cough sputum for exacerbation plans.",
            LRESP + LMAT + LENDO,
        ),
        (
            "Rheumatoid Arthritis Synovial Pannus: Autoimmune Synovitis Erosion and Morning Stiffness Mechanism",
            "ra-synovial-pannus-erosion-morning-stiffness-chronic-rex-pn",
            "Explain cytokine-driven synovial hypertrophy destroying cartilage for pain–function teaching and pacing.",
            LMUSC + LMAT + LCV,
        ),
        (
            "Multiple Sclerosis Relapsing Demyelination: Conduction Block Fatigue Heat Sensitivity Uhthoff Phenomenon",
            "ms-demyelination-uhthoff-heat-fatigue-chronic-rex-pn",
            "Describe saltatory conduction failure with temperature effects for activity planning and relapse reporting.",
            LNEURO + LMH + LMUSC,
        ),
        (
            "Parkinson Disease Dopamine Depletion: Basal Ganglia Circuit Disinhibition and Bradykinesia Rigidity Tremor",
            "parkinson-dopamine-depletion-bradykinesia-rigidity-chronic-rex-pn",
            "Map nigrostriatal pathway loss to movement initiation failure and fall risk for mobility safety teaching.",
            LNEURO + LMUSC + LMAT,
        ),
        (
            "Alzheimer Disease Amyloid–Tau Cascade: Synaptic Loss Cholinergic Deficit and Memory Progression Basics",
            "alzheimer-amyloid-tau-cholinergic-memory-chronic-rex-pn",
            "Outline neurodegeneration patterns behind orientation loss and caregiver burden for dementia care items.",
            LNEURO + LMH + LCAN,
        ),
        (
            "Chronic Venous Insufficiency Valve Failure: Hydrostatic Edema Stasis Dermatitis and Ulceration Risk",
            "cvi-valve-failure-stasis-dermatitis-ulcer-chronic-rex-pn",
            "Explain column of blood pressure damaging skin capillaries for compression stocking teaching adherence.",
            LCV + LSKIN + LMUSC,
        ),
        (
            "Peripheral Artery Disease Chronic Ischemia: Claudication Progression to Critical Limb Threat Teaching",
            "pad-chronic-ischemia-claudication-critical-limb-chronic-rex-pn",
            "Describe fixed stenosis limiting perfusion under demand and tissue loss risk for foot inspection rituals.",
            LCV + LENDO + LMUSC,
        ),
        (
            "Chronic Hepatitis Fibrosis Progression: Stellate Cell Activation and Portal Pressure Rise Over Years",
            "chronic-hepatitis-fibrosis-portal-pressure-rise-rex-pn",
            "Explain collagen deposition stiffening liver sinusoids leading toward cirrhosis complications awareness.",
            LGI + LMAT + LCV,
        ),
        (
            "Cirrhosis Synthetic Failure: Hypoalbuminemia Ascites Formation and Ammonia Encephalopathy Vulnerability",
            "cirrhosis-hypoalbuminemia-ascites-ammonia-encephalopathy-chronic-rex-pn",
            "Tie reduced clotting factor synthesis and protein loss to edema and altered mental status triggers.",
            LGI + LNEURO + LMAT,
        ),
        (
            "Chronic Atrial Fibrillation Rate–Rhythm Burden: Irregular Ventricular Filling and Heart Failure Chronification",
            "chronic-af-irregular-filling-hf-chronification-rex-pn",
            "Describe tachycardia-mediated cardiomyopathy concept and stroke risk chronicity for adherence teaching.",
            LCV + LMAT + LNEURO,
        ),
        (
            "Hypothyroidism Metabolic Slowing: Myxedema Fluid Glycosaminoglycan Deposition and Bradycardia Cold Intolerance",
            "hypothyroid-myxedema-bradycardia-cold-chronic-rex-pn",
            "Explain low T3/T4 effects on heart rate, GI motility, and cognition for medication timing teaching.",
            LENDO + LCV + LMH,
        ),
        (
            "Chronic Pain Central Sensitization: Wind-Up Phenomenon and Nociplastic Pain Education for Opioid-Sparing Plans",
            "chronic-pain-central-sensitization-wind-up-nociplastic-rex-pn",
            "Describe amplified pain signaling without ongoing tissue injury for multimodal pain teaching items.",
            LMH + LMAT + LMUSC,
        ),
        (
            "Osteoporosis Trabecular Thinning: Remodeling Imbalance and Fragility Fracture Vertebral Compression Pathway",
            "osteoporosis-trabecular-thinning-fragility-fracture-rex-pn",
            "Explain osteoclast–osteoblast imbalance lowering bone strength for fall prevention and calcium/vitamin teaching.",
            LMUSC + LENDO + LMAT,
        ),
        (
            "Chronic Obstructive Sleep Apnea: Intermittent Hypoxia Sympathetic Bursts and Daytime Somnolence Cardiovascular Link",
            "osa-intermittent-hypoxia-sympathetic-somnolence-cardiac-rex-pn",
            "Map airway collapse cycles to hypertension and arrhythmia risk for CPAP adherence motivational interviewing.",
            LRESP + LCV + LMH,
        ),
        (
            "Endometriosis Ectopic Implant Bleeding: Inflammatory Adhesions and Cyclic Pelvic Pain Pathophysiology",
            "endometriosis-ectopic-implant-adhesions-cyclic-pain-rex-pn",
            "Explain retrograde menstruation implant survival with local inflammation for chronic pain validation language.",
            LOBS + LMH + LMUSC,
        ),
        (
            "Chronic Heart Failure Sodium Avidity: Neurohormonal Habituation and Daily Weight Self-Management Teaching",
            "chronic-hf-sodium-avidity-neurohormonal-weight-teaching-rex-pn",
            "Revisit RAAS-driven congestion tendency for patient-owned monitoring cues without sodium prescription advice.",
            LCV + LGI + LMAT,
        ),
        (
            "Bronchiectasis Chronic Suppuration: Biofilm Colonization and Hemoptysis Infection Cycle Management Basics",
            "bronchiectasis-biofilm-hemoptysis-infection-cycle-rex-pn",
            "Describe dilated airway mucus stasis feeding recurrent infections for airway clearance teaching items.",
            LRESP + LINFX + LMAT,
        ),
        (
            "Chronic Kidney Disease Anemia: Erythropoietin Deficiency and Uremic Inhibitors of Marrow Response",
            "ckd-anemia-epo-deficiency-uremic-inhibitors-rex-pn",
            "Explain renal hormone loss reducing red cell production for fatigue teaching and transfusion boundary awareness.",
            LRENAL + LCV + LMAT,
        ),
        (
            "Systemic Lupus Flares: Immune Complex Deposition Vasculitis Rash Arthritis and Sunlight Photosensitivity",
            "sle-flare-immune-complex-vasculitis-photosensitivity-chronic-rex-pn",
            "Outline type III hypersensitivity multi-organ inflammation for sunscreen and infection avoidance teaching.",
            LSKIN + LMUSC + LMAT,
        ),
        (
            "Chronic Migraine Sensitization: Trigeminal Nucleus Hyperexcitability and Medication Overuse Headache Spiral",
            "chronic-migraine-trigeminal-sensitization-moh-spiral-rex-pn",
            "Explain repeated analgesic cycles lowering pain threshold for deprescribing conversation framing.",
            LNEURO + LMAT + LMH,
        ),
        (
            "GERD Chronic Acid Exposure: Squamous Metaplasia Fear Barrett Education Without Alarmism for Surveillance",
            "gerd-chronic-acid-barrett-surveillance-education-rex-pn",
            "Describe mucosal injury adaptation pathways for symptom diary and positional sleep teaching.",
            LGI + LMAT + LSAFE,
        ),
        (
            "Chronic UTI Recurrence: Biofilm Catheter Colonization vs Residual Urine Stasis Mechanisms in Neurogenic Bladder",
            "chronic-uti-recurrence-biofilm-residual-urine-neurogenic-rex-pn",
            "Differentiate indwelling catheter ecology from incomplete emptying promoting bacterial persistence.",
            LRENAL + LINFX + LNEURO,
        ),
        (
            "Chronic Pressure Injury Stage Progression: Sustained Ischemia Muscle–Bone Deep Tissue Before Skin Breakdown",
            "pressure-injury-deep-tissue-ischemia-before-skin-breakdown-rex-pn",
            "Explain capillary closure over bony prominences injuring deep structures for turning schedules and equipment.",
            LSKIN + LCAN + LMAT,
        ),
        (
            "Chronic HF Iron Deficiency: Hepcidin and Gut Congestion Limiting Absorption Beyond Diet Intake Story",
            "chronic-hf-iron-deficiency-hepcidin-gut-congestion-rex-pn",
            "Tie venous congestion and inflammatory cytokines to functional iron lack for fatigue teaching items.",
            LCV + LGI + LMAT,
        ),
        (
            "Chronic Alcohol Use Liver Steatosis to Steatohepatitis: Lipotoxicity Inflammation and Fibrosis Acceleration",
            "chronic-alcohol-steatosis-steatohepatitis-fibrosis-rex-pn",
            "Describe hepatocyte fat accumulation progressing to necroinflammation for brief intervention teaching hooks.",
            LGI + LMH + LMAT,
        ),
        (
            "Chronic Asthma Remodeling: Basement Membrane Thickening and Persistent Airway Hyperresponsiveness",
            "chronic-asthma-remodeling-basement-membrane-hyperresponsiveness-rex-pn",
            "Explain long-term structural changes increasing exacerbation frequency for trigger avoidance education.",
            LRESP + LMAT + LENDO,
        ),
        (
            "Chronic Diabetic Neuropathy: Distal Axon Degeneration Loss of Protective Sensation and Charcot Joint Risk",
            "chronic-dm-neuropathy-charcot-protective-sensation-loss-rex-pn",
            "Map glucose-mediated nerve injury to ulcer-prone foot and autonomic GI/GU dysfunction teaching.",
            LENDO + LMUSC + LSKIN,
        ),
    ]
    assert len(stems) == 30
    return [_e(t, s, i, lk) for t, s, i, lk in stems]


def canadian_context() -> list[dict]:
    stems: list[tuple[str, str, list[str]]] = [
        (
            "Frostbite Pathophysiology After Prairie Windchill Exposure: Rewarming Risks in Rural EMS Handoff Language",
            "frostbite-prairie-windchill-rural-ems-rewarming-rex-pn",
            "Connect Canadian winter environmental injury mechanisms to community nursing and transport documentation priorities.",
            LCAN + LSKIN + LCV,
        ),
        (
            "Heat Exhaustion in Humid Ontario Heat Waves: Sweat Salt Loss and Volume Depletion in Outdoor Workers",
            "heat-exhaustion-humid-ontario-sweat-salt-outdoor-workers-rex-pn",
            "Explain thermoregulatory strain during humidex advisories for public health messaging tied to pathophysiology.",
            LCAN + LGI + LSAFE,
        ),
        (
            "Vitamin D Insufficiency in Long Canadian Winters: Bone Remodeling Effects and Fall Risk in Older LTC Residents",
            "vitamin-d-winter-bone-remodeling-fall-risk-ltc-rex-pn",
            "Tie reduced sun synthesis to mineralization concerns for mobility and fracture prevention teaching in LTC.",
            LCAN + LMUSC + LENDO,
        ),
        (
            "Indigenous Health Equity: Historical Trauma Stress Physiology and Chronic Disease Burden Without Stereotyping",
            "indigenous-health-equity-trauma-stress-physiology-rex-pn",
            "Describe allostatic load and access barriers as systems context for culturally safe nursing communication exams.",
            LCAN + LMH + LCV,
        ),
        (
            "Francophone Patient Language Barriers: Pain Reporting Delays and Mis-Triage Risk in Bilingual Hospital Corridors",
            "francophone-pain-reporting-mis-triage-bilingual-hospital-rex-pn",
            "Link communication gaps to delayed assessment of acute pathology for interpreter-use documentation items.",
            LCAN + LMH + LSAFE,
        ),
        (
            "Rural Remote Nursing Scope: ST-Elevation Transfer Delays and Ischemia Progression Communication With Paramedics",
            "rural-stemi-transfer-delay-ischemia-progression-paramedic-rex-pn",
            "Explain time-dependent myocardial injury worsening with distance-to-cath lab for Canadian geography vignettes.",
            LCAN + LCV + LSAFE,
        ),
        (
            "Cannabis Hyperemesis Cyclic Vomiting: CB1 Receptor Downregulation Theory and Hot Bath Symptom Relief Pattern",
            "cannabis-hyperemesis-cyclic-vomiting-hot-baths-rex-pn",
            "Outline chronic THC exposure gut–brain axis disturbance for Canadian legalization era patient teaching items.",
            LGI + LMH + LMAT,
        ),
        (
            "Lyme Disease Tick Geography Expansion: Erythema Migrans Immune Response and Cardiac Conduction Involvement Basics",
            "lyme-tick-geography-erythema-migrans-cardiac-conduction-rex-pn",
            "Describe spirochetal dissemination seasons in wooded Canadian regions for prevention and early recognition teaching.",
            LCAN + LINFX + LCV,
        ),
        (
            "Long-Term Care Staffing Ratios and Missed Early Sepsis: Blunted Fever Presentations in Frail Older Adults",
            "ltc-staffing-missed-sepsis-blunted-fever-rex-pn",
            "Connect workload constraints to delayed vital sign trends recognition for resident safety quality items.",
            LCAN + LINFX + LSAFE,
        ),
        (
            "Home Care Winter Power Outage: Insulin Cold Chain Break and Accelerated Degradation Risk Pathophysiology Teaching",
            "home-care-power-outage-insulin-cold-chain-rex-pn",
            "Explain protein drug stability concerns during Canadian storm outages for contingency planning patient education.",
            LCAN + LENDO + LMAT,
        ),
        (
            "Northern Food Insecurity Protein–Iron Intake: Worsening Anemia Fatigue Loop in Chronic Illness Populations",
            "northern-food-insecurity-anemia-fatigue-loop-rex-pn",
            "Tie dietary micronutrient gaps to oxygen-carrying capacity limits for culturally humble teaching scenarios.",
            LCAN + LGI + LCV,
        ),
        (
            "Universal Health Coverage Navigation: Wait Times Chronic Pain Central Sensitization While Awaiting Specialty",
            "medicare-wait-times-chronic-pain-sensitization-rex-pn",
            "Describe how delayed specialty access can amplify nociplastic pain for Canadian system context exam items.",
            LCAN + LMH + LMUSC,
        ),
        (
            "Wildfire Smoke PM2.5 Exposure: Airway Inflammation Exacerbations in Asthma COPD Across Western Provinces",
            "wildfire-smoke-pm25-airway-exacerbation-western-provinces-rex-pn",
            "Explain particulate-triggered bronchospasm and mucus hypersecretion for community masking and indoor air teaching.",
            LCAN + LRESP + LMAT,
        ),
        (
            "Seasonal Affective Low Light: Melatonin–Serotonin Shift Hypothesis and Fatigue Overlap With Hypothyroidism",
            "seasonal-affective-low-light-melatonin-serotonin-rex-pn",
            "Outline circadian neurotransmitter changes in high-latitude winters for mood–energy assessment sorting.",
            LCAN + LMH + LENDO,
        ),
        (
            "Ice Storm Hip Fracture Surge: Low-Energy Fall Osteoporosis Mechanics and Surgical Delay Complication Awareness",
            "ice-storm-hip-fracture-osteoporosis-surgical-delay-rex-pn",
            "Connect environmental slip risk to trabecular failure and immobility complications for winter safety teaching.",
            LCAN + LMUSC + LPERI,
        ),
        (
            "Harm Reduction Supervised Consumption Context: Overdose Respiratory Depression Opioid Mu Receptor Pathophysiology",
            "harm-reduction-scs-opioid-mu-respiratory-depression-rex-pn",
            "Explain receptor-mediated ventilatory drive suppression for naloxone readiness education in Canadian policy frames.",
            LCAN + LMH + LRESP,
        ),
        (
            "Truth and Reconciliation-Informed Care: Chronic Stress Physiology and Cardiometabolic Risk Communication Basics",
            "trc-informed-care-chronic-stress-cardiometabolic-rex-pn",
            "Describe stress hormone physiology in trauma-informed framing without reducing individuals to stereotypes.",
            LCAN + LCV + LMH,
        ),
        (
            "Telehealth Video Visit Limits: Subtle Cyanosis and Clubbing Missed on Camera Affecting Respiratory Assessment",
            "telehealth-missed-cyanosis-clubbing-respiratory-assessment-rex-pn",
            "Explain why remote visual assessment under-detects perfusion and chronic hypoxia signs for hybrid care safety.",
            LCAN + LRESP + LSAFE,
        ),
        (
            "School Lice Outbreak Policies: Pediculosis Itch Hypersensitivity and Secondary Impetigo Scratch Pathway",
            "school-lice-outbreak-itch-hypersensitivity-impetigo-rex-pn",
            "Connect parasite saliva allergy to excoriation bacterial skin invasion for Canadian school nursing documentation.",
            LCAN + LSKIN + LPEDS,
        ),
        (
            "Polar Bear Plunge Cold Shock: Gasps and Arrhythmia Trigger in Healthy Volunteers—Community Event Safety Teaching",
            "polar-plunge-cold-shock-gasp-arrhythmia-community-safety-rex-pn",
            "Describe sudden cold water sympathetic surge and aspiration risk for harm-reduction public messaging pathophysiology.",
            LCAN + LCV + LSAFE,
        ),
    ]
    assert len(stems) == 20
    return [_e(t, s, i, lk) for t, s, i, lk in stems]


def high_yield() -> list[dict]:
    stems: list[tuple[str, str, list[str]]] = [
        (
            "Oxygen–Hemoglobin Dissociation Curve Shifts: Temperature pH 2,3-BPG and Tissue Unloading High-Yield PN Review",
            "o2-hb-dissociation-curve-shifts-temp-ph-2-3bpg-rex-pn",
            "Consolidate right/left shift mechanisms for exam questions linking SpO2 to actual delivery at tissues.",
            LRESP + LCV + LGI,
        ),
        (
            "Starling Forces Across Capillary Wall: Edema Formation in HF vs Inflammatory Leak One-Page Mental Model",
            "starling-forces-edema-hf-vs-inflammatory-leak-review-rex-pn",
            "Review hydrostatic vs oncotic pressure balance for pulmonary and peripheral edema sorting drills.",
            LCV + LRESP + LGI,
        ),
        (
            "RAAS Blockade Concept Map: Why ACE Inhibitors Reduce Afterload and Congestion Without Memorizing Drug Names",
            "raas-blockade-afterload-congestion-concept-map-rex-pn",
            "Explain angiotensin-mediated vasoconstriction and aldosterone sodium retention pathways for pharmacology class exams.",
            LCV + LMAT + LRENAL,
        ),
        (
            "Sympathetic vs Parasympathetic Autonomic Balance: Pupil-Gut-Heart-Bronchus Organ Chart for REx-PN Rapid Recall",
            "sympathetic-parasympathetic-organ-chart-rapid-recall-rex-pn",
            "Build a cross-organ autonomic effects table connecting receptors to clinical anticholinergic side effects.",
            LMAT + LNEURO + LCV,
        ),
        (
            "Local vs Systemic Inflammation: Cytokine Profiles Fever Generation and Acute Phase Reactant Story Simplified",
            "local-vs-systemic-inflammation-cytokine-fever-review-rex-pn",
            "Differentiate compartmentalized infection from systemic mediator flood for sepsis recognition scaffolding.",
            LINFX + LGI + LCV,
        ),
        (
            "Primary vs Secondary Hypertension Clues: Renin–Angiotensin–Aldosterone Axis Directional Thinking for Exams",
            "primary-vs-secondary-htn-renin-axis-directional-review-rex-pn",
            "Outline volume-mediated vs vasoconstriction-mediated hypertension patterns without ordering diagnostics.",
            LCV + LRENAL + LMAT,
        ),
        (
            "Anion Gap Metabolic Acidosis Categories: KUSSMAL MUDPILES Simplified for PN Recognition Not Memorization Theater",
            "anion-gap-metabolic-acidosis-categories-review-rex-pn",
            "Group common acid-generating pathways for DKA/lactate/renal failure comparison chart studying.",
            LGI + LENDO + LMAT,
        ),
        (
            "Henderson–Hasselbalch Intuition: Respiratory vs Metabolic Acid–Base Compensation Patterns Without Calculator Fear",
            "henderson-hasselbalch-respiratory-metabolic-compensation-review-rex-pn",
            "Explain bicarbonate–CO2 relationship directionally for ABG interpretation support items.",
            LRESP + LGI + LCV,
        ),
        (
            "Clotting Cascade Big Picture: Platelet Plug vs Coagulation Factor Mesh and Why Both Matter in Bleeding Teaching",
            "clotting-cascade-plug-vs-factor-mesh-review-rex-pn",
            "Describe primary vs secondary hemostasis for antiplatelet vs anticoagulant effect teaching.",
            LMAT + LCV + LGI,
        ),
        (
            "Immune Hypersensitivity Types I–IV One-Liner Map: Anaphylaxis Transplant Rejection Arthus Skin Testing Hooks",
            "hypersensitivity-types-i-iv-one-liner-map-review-rex-pn",
            "Consolidate IgE, immune complex, and T-cell mediated injury examples for immunology exam crossover items.",
            LINFX + LSKIN + LMAT,
        ),
        (
            "Pressure–Volume Loop Mental Sketch: Preload Afterload Contractility Changes in HF and Sepsis Comparison",
            "pv-loop-preload-afterload-contractility-hf-sepsis-review-rex-pn",
            "Visualize stroke volume shifts for fluid responsiveness vs overload teaching at conceptual depth.",
            LCV + LINFX + LGI,
        ),
        (
            "Glomerular Filtration Barrier: Proteinuria Types and Nephrotic vs Nephritic Syndrome Sorting High-Yield Table",
            "gfb-proteinuria-nephrotic-nephritic-sorting-review-rex-pn",
            "Explain podocyte slit diaphragm injury patterns for edema and urine findings exam charts.",
            LRENAL + LGI + LCV,
        ),
        (
            "Counter-Current Multiplier Kidney Medulla: Concentrated Urine Mechanism Simplified for Fluid Restriction Teaching",
            "counter-current-multiplier-concentrated-urine-review-rex-pn",
            "Describe medullary osmotic gradient formation tying to ADH action for diabetes insipidus contrast items.",
            LRENAL + LGI + LENDO,
        ),
        (
            "Insulin vs Glucagon Fasting–Fed Switch: Glycogenolysis Gluconeogenesis and Lipolysis Regulation Review",
            "insulin-glucagon-fasting-fed-switch-review-rex-pn",
            "Map pancreatic hormone opposition for hypoglycemia counter-regulation teaching anchors.",
            LENDO + LGI + LMAT,
        ),
        (
            "Baroreceptor Reflex Arc: Tachycardia Response to Standing Orthostasis and Autonomic Neuropathy Exam Traps",
            "baroreceptor-reflex-orthostasis-autonomic-neuropathy-review-rex-pn",
            "Explain rapid BP correction failure in diabetic autonomic neuropathy for fall risk teaching.",
            LCV + LENDO + LNEURO,
        ),
        (
            "Jaundice Bilirubin Conjugation: Prehepatic Hepatic Posthepatic Sorting Without Advanced Liver Numbers",
            "jaundice-bilirubin-conjugation-pre-post-hepatic-review-rex-pn",
            "Differentiate hemolysis vs hepatocyte dysfunction vs bile duct obstruction using mechanism language.",
            LGI + LMAT + LNEURO,
        ),
        (
            "Cushing Response Triad Late ICP: Why BP Rises Before Bradycardia in Exam Story Ordering",
            "cushing-response-ordering-late-icp-review-rex-pn",
            "Revisit brainstem ischemia reflex arcs for neuro deterioration documentation sequencing items.",
            LNEURO + LCV + LSAFE,
        ),
        (
            "Third Spacing vs Intravascular Depletion: Why Edema Can Coexist With Hypotension in Sepsis and Burns",
            "third-spacing-vs-intravascular-depletion-edema-hypotension-review-rex-pn",
            "Explain capillary leak moving fluid out of vascular space for fluid resuscitation teaching context.",
            LINFX + LCV + LGI,
        ),
        (
            "Reversible vs Irreversible Cell Injury: Ischemia Timeline for MI Stroke Kidney ATN High-Yield Comparison",
            "reversible-irreversible-ischemia-timeline-mi-stroke-atn-review-rex-pn",
            "Outline ATP failure ion pump loss necrosis thresholds for time-based care rationale questions.",
            LCV + LNEURO + LRENAL,
        ),
        (
            "Nursing Theory to Pathophys Bridge: Inflammation as ‘Protective Injury’ Framing Patient Education Scripts for Exams",
            "inflammation-protective-injury-education-bridge-review-rex-pn",
            "Connect textbook inflammation stages to teach-back language for therapeutic communication crossover items.",
            LMH + LINFX + LSAFE,
        ),
    ]
    assert len(stems) == 20
    return [_e(t, s, i, lk) for t, s, i, lk in stems]


def _assert_unique(payload: dict[str, list[dict]]) -> None:
    titles: list[str] = []
    slugs: list[str] = []
    for key, arr in payload.items():
        for d in arr:
            titles.append(d["title"])
            slugs.append(d["seoSlug"])
    if len(titles) != len(set(titles)):
        raise AssertionError("duplicate titles")
    if len(slugs) != len(set(slugs)):
        raise AssertionError("duplicate seoSlug")


def main() -> None:
    payload = {
        "Core": core_conditions(),
        "Symptoms": symptoms(),
        "RedFlags": red_flags(),
        "Chronic": chronic(),
        "CanadianContext": canadian_context(),
        "HighYield": high_yield(),
    }
    _assert_unique(payload)
    counts = {k: len(v) for k, v in payload.items()}
    assert counts == {
        "Core": 60,
        "Symptoms": 40,
        "RedFlags": 30,
        "Chronic": 30,
        "CanadianContext": 20,
        "HighYield": 20,
    }, counts
    out = Path(__file__).resolve().parents[1] / "docs" / "rex-pn-pathophys-blog-plan-200.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out, "posts", sum(counts.values()))


if __name__ == "__main__":
    main()
