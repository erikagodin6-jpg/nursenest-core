#!/usr/bin/env python3
"""
Concept-Level Curriculum Audit
Analyzes all pathway lessons, groups by clinical concept,
identifies duplicates, gaps, over-fragmentation, and coverage.
"""

import json
import re
import sys
from collections import OrderedDict, defaultdict
from pathlib import Path

CATALOG_PATH = Path("src/content/pathway-lessons/catalog.json")

# Tier metadata
TIERS = {
    "ca-rn-nclex-rn": {"label": "CA-RN", "country": "CA", "tier": "RN", "exam": "NCLEX-RN"},
    "us-rn-nclex-rn": {"label": "US-RN", "country": "US", "tier": "RN", "exam": "NCLEX-RN"},
    "ca-rpn-rex-pn": {"label": "CA-RPN", "country": "CA", "tier": "RPN", "exam": "REx-PN"},
    "us-lpn-nclex-pn": {"label": "US-LPN", "country": "US", "tier": "LPN", "exam": "NCLEX-PN"},
    "us-np-fnp": {"label": "US-NP", "country": "US", "tier": "NP", "exam": "FNP"},
}

EXPECTED_HIGH_YIELD_CONCEPTS = {
    "Cardiovascular": [
        "Heart Failure", "Myocardial Infarction / Acute Coronary Syndrome", "Angina",
        "Dysrhythmias / Atrial Fibrillation", "Hypertension", "Shock",
        "DVT / Pulmonary Embolism", "Endocarditis", "Pericarditis",
        "Cardiac Tamponade", "CABG / Cardiac Surgery", "Peripheral Artery Disease",
        "Cardioversion / Defibrillation", "Abdominal Aortic Aneurysm",
    ],
    "Respiratory": [
        "COPD", "Asthma", "Pneumonia", "ARDS", "Pulmonary Embolism",
        "Tuberculosis", "Pleural Effusion / Chest Tubes", "ABG Interpretation",
        "Oxygen Therapy",
    ],
    "Renal": [
        "Acute Kidney Injury", "Chronic Kidney Disease / Dialysis", "Fluid & Electrolyte Imbalances",
        "Acid-Base Disorders", "UTI / Pyelonephritis", "Kidney Stones",
        "Sodium Disorders", "Potassium Disorders", "Calcium Disorders", "Magnesium Disorders",
    ],
    "Endocrine": [
        "Diabetes Mellitus / DKA / HHS", "Thyroid Disorders", "Adrenal Disorders",
        "SIADH / Diabetes Insipidus",
    ],
    "Gastrointestinal": [
        "Liver Failure / Cirrhosis", "Pancreatitis", "Bowel Obstruction / Ileus",
        "GERD / Peptic Ulcer", "GI Bleed", "C. difficile", "Ostomy Care",
        "Enteral / TPN Nutrition",
    ],
    "Neurologic": [
        "Stroke", "Seizures", "Increased ICP", "Spinal Cord Injury",
        "Meningitis", "Headache", "Parkinson Disease", "Pain Management",
    ],
    "Hematologic": [
        "Anemia / Transfusion", "Anticoagulation", "Sickle Cell Crisis",
        "Neutropenic Precautions",
    ],
    "Immune / Infection": [
        "Sepsis", "Isolation Precautions", "HIV / PEP", "Wound Infection",
    ],
    "Integumentary": [
        "Wound Care", "Burns", "Pressure Injuries", "Fractures / Immobility",
    ],
    "Mental Health": [
        "Suicide Risk", "Psychotropic Medications", "Alcohol Withdrawal",
        "Dementia / Delirium",
    ],
    "Maternity": [
        "Preeclampsia / Eclampsia", "Postpartum Hemorrhage", "Newborn Care",
        "FHR Monitoring", "Rh Incompatibility",
    ],
    "Pediatrics": [
        "Fever / Dehydration", "Respiratory Distress / RSV", "Immunizations",
        "Growth / Development", "Non-Accidental Trauma",
    ],
    "Professional / General": [
        "Delegation / Assignment", "Prioritization / ABCs", "Clinical Judgment",
        "Ethics / Legal", "Patient Safety / QI", "Therapeutic Communication",
        "Documentation", "Medication Safety",
    ],
    "Pharmacology": [
        "Anticoagulant Safety", "Antibiotic Stewardship", "Opioid Safety",
        "Cardiac Medications", "Insulin / Diabetes Medications",
        "Chemotherapy Safety",
    ],
}

# Known NCLEX high-yield missing concepts to check
HIGH_YIELD_MISSING_CHECK = [
    "Chest Tubes (management)",
    "Tracheostomy Care",
    "Sepsis (RPN-specific depth)",
    "Post-Operative Care",
    "Blood Transfusion (detailed)",
    "Central Line Care",
    "Triage / Disaster Nursing",
    "Cultural Competence",
    "End of Life / Palliative Care (detailed)",
    "Parenteral Nutrition (detailed)",
    "Mechanical Ventilation (nursing management)",
    "Pressure Injury (staging detail)",
    "Restraints (detailed RPN/LPN protocol)",
    "Fetal Monitoring (detailed patterns)",
    "Postpartum Assessment (detailed)",
    "Newborn Resuscitation",
    "Pediatric Assessment (detailed)",
    "Pain Management (non-pharmacologic)",
    "Substance Use Disorder",
    "Eating Disorders",
    "Family Violence / Abuse",
    "Community Health Nursing",
    "Home Safety Assessment",
    "Fluid Resuscitation (burn, sepsis, trauma)",
    "Arterial Blood Gas (compensation patterns)",
    "ECG Rhythm Recognition (detailed)",
    "Hemodynamic Monitoring (detailed RN)",
    "Chest Pain (differentiation)",
    "Head Injury / TBI",
    "Guillain-Barre / Myasthenia Gravis",
    "Pancreatitis (RPN depth)",
    "Hepatitis (differentiation)",
    "Cirrhosis / Portal Hypertension (complications)",
    "Cholecystitis / Gallbladder",
    "Diverticulitis",
    "Irritable Bowel Syndrome",
    "Hypothyroidism (detailed)",
    "Hyperparathyroidism",
    "Pituitary Disorders",
    "Adrenal Insufficiency (detailed RPN/LPN)",
    "Rheumatoid Arthritis (management depth for RN)",
    "Osteoarthritis vs RA",
    "Osteoporosis (fall prevention, treatment)",
    "Systemic Lupus Erythematosus",
    "Multiple Sclerosis",
    "Amyotrophic Lateral Sclerosis",
    "Cancer Screening Guidelines",
    "Radiation Therapy (nursing care)",
    "Hospice Philosophy",
    "Advance Directives / Living Will",
    "Organ Donation",
    "Perioperative Nursing (pre-op, intra-op, post-op)",
    "Conscious Sedation",
    "Wound Dehiscence / Evisceration",
    "Compartment Syndrome",
    "Fat Embolism Syndrome",
    "Disseminated Intravascular Coagulation",
    "Heparin-Induced Thrombocytopenia",
    "Thrombotic Thrombocytopenic Purpura",
    "Sickle Cell Trait vs Disease",
    "Malignant Hyperthermia",
    "Myasthenic Crisis / Cholinergic Crisis",
    "Autonomic Dysreflexia",
    "Tetanus / Diphtheria Prophylaxis",
    "Rabies PEP",
    "Sexually Transmitted Infections (comprehensive)",
    "Toxic Shock Syndrome",
    "Necrotizing Fasciitis",
    "COVID-19 Nursing Care",
    "Monkeypox (MPOX) Awareness",
    "Opioid Use Disorder / MAT",
    "Alcohol Use Disorder / CIWA",
    "Intimate Partner Violence",
    "Human Trafficking Recognition",
    "Pediatric Obesity",
    "Failure to Thrive",
    "Scoliosis",
    "Cerebral Palsy",
    "Spina Bifida",
    "Cystic Fibrosis",
    "Down Syndrome / Trisomy 21",
    "Turner Syndrome",
    "Fragile X Syndrome",
    "Phenylketonuria",
    "Kawasaki Disease",
    "Reye Syndrome",
    "Lead Poisoning",
    "Childhood Cancers (leukemia, Wilms tumor)",
    "Preterm Labor / PROM",
    "Placental Abruption / Previa",
    "Umbilical Cord Prolapse",
    "Shoulder Dystocia",
    "Gestational Diabetes",
    "Postpartum Depression / Psychosis",
    "Mastitis",
    "Group B Streptococcus (GBS Prophylaxis)",
    "Neonatal Abstinence Syndrome",
    "Hyperbilirubinemia / Jaundice",
    "Retinopathy of Prematurity",
    "Bronchopulmonary Dysplasia",
    "Sudden Infant Death Syndrome (SIDS Prevention)",
    "Ventilator-Associated Pneumonia (VAP)",
    "CAUTI Prevention",
    "CLABSI Prevention",
    "Surgical Site Infection Prevention",
    "Catheter-Associated UTI (CAUTI Bundle)",
    "Pressure Injury (Staging, Prevention, Treatment)",
    "Fall Risk Assessment (Morse, Hendrich)",
    "Braden Scale",
    "Glasgow Coma Scale",
    "Pediatric Assessment Triangle",
    "APGAR Scoring",
    "Bishop Score",
    "BALLARDS / Newborn Gestational Age Assessment",
    "Meningitis (bacterial vs viral differentiation)",
    "Encephalitis",
    "Guillain-Barre Syndrome",
    "Parkinson Disease",
    "Huntington Disease",
    "Alzheimer Disease",
    "Delirium (prevention, screening)",
    "Traumatic Brain Injury",
    "Spinal Cord Injury (complete vs incomplete, ASIA)",
    "Cerebrovascular Accident (ischemic vs hemorrhagic)",
    "Transient Ischemic Attack",
    "Increased Intracranial Pressure (ICP monitoring)",
    "Hydrocephalus / VP Shunt",
    "Seizure Classification",
    "Status Epilepticus",
    "Respiratory Failure (hypoxic vs hypercapnic)",
    "Acute Respiratory Distress Syndrome (detailed management)",
    "Pneumothorax (tension vs open vs simple)",
    "Hemothorax",
    "ARDS (prone positioning, PEEP)",
    "Flail Chest",
    "Pulmonary Hypertension",
    "Cor Pulmonale",
    "Cardiogenic Shock (detailed management)",
    "Hypovolemic Shock",
    "Distributive Shock (septic, neurogenic, anaphylactic)",
    "Obstructive Shock",
    "Anaphylaxis",
    "Transfusion Reaction Management",
    "Fluid Overload / Pulmonary Edema",
    "Acute Abdomen",
    "Bowel Obstruction (small vs large)",
    "Appendicitis",
    "Diverticulitis",
    "Cholecystitis",
    "Pancreatitis",
    "Peritonitis",
    "GI Bleed (upper vs lower)",
    "Peptic Ulcer Disease (H. pylori, NSAIDs)",
    "Gastroesophageal Reflux Disease",
    "Hiatal Hernia",
    "Inflammatory Bowel Disease (Crohn vs UC)",
    "Celiac Disease",
    "Short Bowel Syndrome",
    "Bariatric Surgery (nursing care)",
    "Fistula Management",
    "Dumping Syndrome",
    "Ostomy (colostomy, ileostomy, urostomy)",
    "Enteral Nutrition (NG, PEG, NJ)",
    "Parenteral Nutrition (TPN, PPN)",
    "PICC Line Care",
    "Implanted Port Care",
    "Hemodialysis / AV Fistula",
    "Continuous Renal Replacement Therapy",
    "Peritoneal Dialysis",
    "Acid-Base Interpretation (compensation)",
    "Pulse Oximetry / Capnography",
    "Intra-aortic Balloon Pump",
    "Ventricular Assist Device",
    "Pacemaker (types, nursing care)",
    "Implantable Cardioverter-Defibrillator",
    "Electroconvulsive Therapy (nursing care)",
    "Dialysis (hemodialysis vs peritoneal)",
    "Colostomy Care (detailed)",
    "Wound VAC Therapy",
    "Negative Pressure Wound Therapy",
    "Hyperbaric Oxygen Therapy",
    "Radiation Safety",
    "Chemotherapy (safe handling, extravasation)",
    "Biologic Response Modifiers",
    "Monoclonal Antibodies",
    "Immunosuppression (transplant nursing)",
    "Organ Rejection (hyperacute, acute, chronic)",
    "Graft vs Host Disease",
    "Bone Marrow Transplant",
    "Stem Cell Transplant",
    "Anaphylaxis (detailed management)",
    "Allergic Reaction (distinguishing severity)",
    "Autoimmune Disorders (overview)",
    "Complementary and Alternative Medicine",
    "Herbal Supplement Interactions",
    "Medication Reconciliation",
    "Polypharmacy",
    "Anticoagulation (warfarin vs DOACs vs heparin)",
    "Bleeding Precautions",
    "Antidote Chart",
]


def normalize_concept(title: str) -> str:
    """Normalize a lesson title to its core clinical concept."""
    t = title.strip()
    
    # Remove tier/exam suffixes in parentheses
    t = re.sub(r'\s*\((REx-PN\s*/?\s*PN[^)]*|PN scope[^)]*|NCLEX-PN[^)]*|FNP[^)]*|Canada[^)]*)\)', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\s*\([^)]*overlay[^)]*\)', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\s*\([^)]*track[^)]*\)', '', t, flags=re.IGNORECASE).strip()
    
    # Remove review number suffixes
    t = re.sub(r':\s*Review\s+\d+$', '', t).strip()
    t = re.sub(r':\s*Review\s+\d+', '', t).strip()
    
    # Remove common suffixes that indicate scope/depth (keep for concept grouping)
    t = re.sub(r'\s*-\s*NP (overlay|core|interpretation|resuscitation reasoning|diagnosis.*management)', '', t, flags=re.IGNORECASE).strip()
    
    # Normalize punctuation and whitespace
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'[/&]', ' & ', t).strip()
    
    return t


def extract_primary_concept(title: str) -> str:
    """Extract the primary clinical concept from a lesson title."""
    t = normalize_concept(title.lower().strip())
    
    # Known concept mapping - order matters (more specific first)
    concept_patterns = [
        (r'fluid\s*(balance|deficit|overload|resuscitation)', 'Fluid Balance / IV Therapy'),
        (r'\bacids?[- ]base\b', 'Acid-Base Balance'),
        (r'\bsodium\b.*(imbalance|disorder|hyponatremia|hypernatremia)', 'Sodium Disorders'),
        (r'\bpotassium\b.*(imbalance|disorder|hypokalemia|hyperkalemia|emergenc)', 'Potassium Disorders'),
        (r'\bcalcium\b.*(imbalance|disorder)', 'Calcium Disorders'),
        (r'\bmagnesium\b.*(imbalance|disorder)', 'Magnesium Disorders'),
        (r'\bphosphate\b', 'Phosphate Disorders'),
        (r'\bheart failure\b', 'Heart Failure'),
        (r'\bmyocardial infarction\b|\bmi\b.*(recogni|troponin)', 'Myocardial Infarction / ACS'),
        (r'\bacute coronary\b', 'Myocardial Infarction / ACS'),
        (r'\bcoronary syndrome\b', 'Myocardial Infarction / ACS'),
        (r'\bangina\b', 'Angina'),
        (r'\batrial fibrillation\b', 'Atrial Fibrillation / Dysrhythmias'),
        (r'\bdysrhythmia\b', 'Atrial Fibrillation / Dysrhythmias'),
        (r'\bcardioversion\b', 'Cardioversion / Defibrillation'),
        (r'\bdefibrillation\b', 'Cardioversion / Defibrillation'),
        (r'\bhypertension\b.(crisis|urgency|emergenc)', 'Hypertensive Crisis'),
        (r'\bhypertension\b', 'Hypertension'),
        (r'\bendocarditis\b', 'Endocarditis'),
        (r'\binfective endocarditis\b', 'Endocarditis'),
        (r'\bpericarditis\b', 'Pericarditis'),
        (r'\bcabg\b', 'CABG / Cardiac Surgery'),
        (r'\bcardiac tamponade\b', 'Cardiac Tamponade'),
        (r'\bdvt\b', 'DVT / Venous Thromboembolism'),
        (r'\bpulmonary embolism\b', 'Pulmonary Embolism'),
        (r'\bperipheral artery\b', 'Peripheral Artery Disease'),
        (r'\bhemodynamic monitor\b', 'Hemodynamic Monitoring'),
        (r'\bpain\b', 'Pain Management'),
        (r'\bstroke\b', 'Stroke'),
        (r'\bseizure\b', 'Seizures'),
        (r'\bincreased (icp|intracranial)\b', 'Increased ICP'),
        (r'\bspinal cord\b', 'Spinal Cord Injury'),
        (r'\bmeningitis\b', 'Meningitis'),
        (r'\bheadache\b', 'Headache'),
        (r'\bparkinson\b', 'Parkinson Disease'),
        (r'\bdementia\b', 'Dementia / Delirium'),
        (r'\bdelirium\b', 'Dementia / Delirium'),
        (r'\bcopd\b', 'COPD'),
        (r'\basthma\b', 'Asthma'),
        (r'\bard[sz]\b', 'ARDS'),
        (r'\bpneumonia\b', 'Pneumonia'),
        (r'\babg\b', 'ABG Interpretation'),
        (r'\bpleural effusion\b', 'Pleural Effusion / Chest Tubes'),
        (r'\bchest tube\b', 'Pleural Effusion / Chest Tubes'),
        (r'\bpneumothorax\b', 'Pneumothorax'),
        (r'\btuberculosis\b|\btb\b', 'Tuberculosis'),
        (r'\boxygen\b.*(device|therapy)', 'Oxygen Therapy'),
        (r'\binhaler\b', 'Asthma / Inhaler Teaching'),
        (r'\bacut(e|e ) kidney\b', 'Acute Kidney Injury'),
        (r'\bdialys\w+ access\b', 'Dialysis Access'),
        (r'\bdialys\w+ diet\b', 'Dialysis Diet'),
        (r'\bdialys\w+\b', 'Dialysis / CKD'),
        (r'\bhemodialysis\b', 'Dialysis Access'),
        (r'\bperitoneal dialys\b', 'Peritoneal Dialysis'),
        (r'\buti\b', 'UTI / Pyelonephritis'),
        (r'\bpyelonephritis\b', 'UTI / Pyelonephritis'),
        (r'\bkidney stone\b', 'Kidney Stones'),
        (r'\bcatheter\b', 'Catheter Care / CAUTI'),
        (r'\binsulin\b', 'Insulin / Diabetes'),
        (r'\bhypoglycemia\b', 'Insulin / Diabetes'),
        (r'\bfingerstick\b', 'Fingerstick / Glucose Monitoring'),
        (r'\bdiabetes\b.*(self-management|self.?manage)', 'Diabetes Self-Management'),
        (r'\bdka\b', 'DKA / HHS'),
        (r'\bhhs\b', 'DKA / HHS'),
        (r'\bhyperglycemic crisis\b', 'DKA / HHS'),
        (r'\bthyroid storm\b', 'Thyroid Disorders'),
        (r'\bmyxedema\b', 'Thyroid Disorders'),
        (r'\baddison\w+\b', 'Adrenal Disorders'),
        (r'\bcushing\b', 'Adrenal Disorders'),
        (r'\bsiadh\b', 'SIADH / Diabetes Insipidus'),
        (r'\bdiabetes insipidus\b', 'SIADH / Diabetes Insipidus'),
        (r'\bliver failure\b|\bcirrhosis\b|\bhepatic\b', 'Liver Failure / Cirrhosis'),
        (r'\bpancreatitis\b', 'Pancreatitis'),
        (r'\bbowel obstruction\b', 'Bowel Obstruction / Ileus'),
        (r'\bileus\b', 'Bowel Obstruction / Ileus'),
        (r'\bgerd\b', 'GERD / Peptic Ulcer'),
        (r'\bpeptic ulcer\b', 'GERD / Peptic Ulcer'),
        (r'\bgi bleed\b', 'GI Bleed'),
        (r'\bc\.? difficile\b', 'C. difficile'),
        (r'\bostomy\b', 'Ostomy Care'),
        (r'\benteral\b', 'Enteral Nutrition'),
        (r'\btpn\b', 'TPN / Parenteral Nutrition'),
        (r'\bstool\b', 'Stool Assessment'),
        (r'\bng tube\b', 'NG Tube Care'),
        (r'\bnpo\b', 'NPO / Post-Op Diet'),
        (r'\bsepsis\b', 'Sepsis'),
        (r'\bisolation precaution\b', 'Isolation Precautions'),
        (r'\bhiv\b', 'HIV / PEP'),
        (r'\bpep\b', 'HIV / PEP'),
        (r'\bppe\b', 'PPE / Transmission'),
        (r'\band?tibiotic\b', 'Antibiotics / Stewardship'),
        (r'\bandicoagul\b', 'Anticoagulation'),
        (r'\banemia\b', 'Anemia / Transfusion'),
        (r'\btransfusion\b', 'Transfusion Therapy'),
        (r'\bneutropenic\b', 'Neutropenic Precautions'),
        (r'\bsickle cell\b', 'Sickle Cell Disease'),
        (r'\bwound infection\b', 'Wound Infection'),
        (r'\bwound care\b', 'Wound Care'),
        (r'\bpressure injur\b', 'Pressure Injuries'),
        (r'\bburn\b', 'Burns'),
        (r'\bhip fracture\b', 'Hip Fracture'),
        (r'\brheumatoid\b', 'Rheumatoid Arthritis'),
        (r'\bimmobility\b', 'Immobility'),
        (r'\bdermatitis\b', 'Dermatitis / Skin'),
        (r'\bsuicid\w+\b', 'Suicide Risk'),
        (r'\bpsychotropic\b', 'Psychotropic Medications'),
        (r'\balcohol withdrawal\b', 'Alcohol Withdrawal'),
        (r'\bsubstance withdrawal\b', 'Substance Withdrawal'),
        (r'\btrauma.informed\b', 'Trauma-Informed Care'),
        (r'\bpreeclampsia\b', 'Preeclampsia / Eclampsia'),
        (r'\beclampsia\b', 'Preeclampsia / Eclampsia'),
        (r'\bpostpartum hemorrahge\b', 'Postpartum Hemorrhage'),
        (r'\bpostpartum fundus\b', 'Postpartum Fundus / Lochia'),
        (r'\bfhr\b', 'Fetal Heart Monitoring'),
        (r'\bnewborn thermoregulation\b', 'Newborn Thermoregulation'),
        (r'\bnewborn safety\b', 'Newborn Safety'),
        (r'\brh incompatibility\b', 'Rh Incompatibility'),
        (r'\bbreastfeeding\b', 'Breastfeeding / Lactation'),
        (r'\bnewborn\b', 'Newborn Care'),
        (r'\bpediatric (fever|dehydration)\b', 'Pediatric Fever / Dehydration'),
        (r'\brsv\b', 'RSV / Respiratory Distress'),
        (r'\brespiratory distress\b', 'RSV / Respiratory Distress'),
        (r'\bimmunization schedule\b', 'Immunization Schedule'),
        (r'\bimmunization catch.up\b', 'Immunization Schedule'),
        (r'\bgrowth fail\b|\bfailure to thrive\b', 'Growth Failure'),
        (r'\bgrowth chart\b', 'Growth Chart / Development'),
        (r'\bnon.accidental trauma\b', 'Non-Accidental Trauma'),
        (r'\bairway obstruction\b', 'Pediatric Airway Obstruction'),
        (r'\bpediatric dos\w+\b', 'Pediatric Dosing'),
        (r'\bfebrile infant\b', 'Febrile Infant'),
        (r'\bdelegation\b', 'Delegation / Assignment'),
        (r'\bassign(ment|ing)\b', 'Delegation / Assignment'),
        (r'\bprioritization\b', 'Prioritization / ABCs'),
        (r'\bpatient safety\b', 'Safety & Quality'),
        (r'\bclinical judgment\b', 'Clinical Judgment'),
        (r'\bethical\b', 'Ethics / Legal'),
        (r'\bnurse practice act\b', 'Ethics / Legal'),
        (r'\bscope of practice\b', 'Scope of Practice'),
        (r'\btherapeutic communication\b', 'Therapeutic Communication'),
        (r'\bdocumentation\b', 'Documentation'),
        (r'\bfalls\b', 'Fall Prevention'),
        (r'\brestraint\b', 'Restraints'),
        (r'\bmedication error\b', 'Medication Safety'),
        (r'\bmedication safety\b', 'Medication Safety'),
        (r'\bbarcode\b', 'Medication Safety'),
        (r'\bhigh.alert medication\b', 'Medication Safety'),
        (r'\bmedication reconciliation\b', 'Medication Safety'),
        (r'\bqi\b', 'QI / Incident Reporting'),
        (r'\bincident report\b', 'QI / Incident Reporting'),
        (r'\bsbar\b', 'SBAR / Handoff'),
        (r'\bexposure\b', 'Exposure / Sharps Safety'),
        (r'\bsharps\b', 'Exposure / Sharps Safety'),
        (r'\bfire safety\b', 'Fire Safety'),
        (r'\bcentral line\b', 'Central Line / CLABSI'),
        (r'\bclabsi\b', 'Central Line / CLABSI'),
        (r'\bnpo\b', 'NPO / Pre-Op'),
        (r'\bpre.eclampsia\b', 'Preeclampsia / Eclampsia'),
        (r'\bdifferential\b', 'Differential Reasoning'),
        (r'\bhealth literacy\b', 'Health Literacy'),
        (r'\bsocial determinant\b', 'Social Determinants of Health'),
        (r'\bcomfort care\b', 'End of Life / Palliative Care'),
        (r'\bend of life\b', 'End of Life / Palliative Care'),
        (r'\badvanced directive\b', 'Advance Directives'),
        (r'\borgan donation\b', 'Organ Donation'),
        (r'\bdo not resuscitate\b', 'Advance Directives'),
        (r'\bhospice\b', 'End of Life / Palliative Care'),
        (r'\badvanced directive\b', 'Advance Directives'),
        (r'\borgan don\w+\b', 'Organ Donation'),
        # Pharmacology specific
        (r'\bcardiac glycoside\b', 'Cardiac Glycosides'),
        (r'\bdiuretic\b', 'Diuretics'),
        (r'\bantihypertensi\b', 'Antihypertensives'),
        (r'\bchemotherap\b', 'Chemotherapy Safety'),
        (r'\bopioid\b', 'Opioid Safety'),
        (r'\bcardiac (glycoside|drug)\b', 'Cardiac Medications'),
        (r'\bhypoglycemic\b', 'Oral Hypoglycemics'),
        (r'\binhaler technique\b', 'Inhaler Teaching'),
        (r'\bpacemaker\b', 'Pacemaker Care'),
        (r'\bcardiac catheterization\b', 'Cardiac Catheterization'),
        (r'\bbeta.blocker\b', 'Beta-Blocker Therapy'),
        (r'\bsteroid taper\b', 'Steroid Therapy'),
        (r'\bantidote\b', 'Antidote Chart'),
        (r'\bpoison\b', 'Poisoning / Antidotes'),
        # Assessment / Monitoring
        (r'\bvital signs\b', 'Vital Signs / Escalation'),
        (r'\bcase:', 'Clinical Case Study'),
        (r'\bnursing decision\b', 'Clinical Judgment'),
        (r'\btrending vitals\b', 'Vital Signs / Trending'),
        (r'\bmulti-system\b', 'Multi-System Deterioration'),
        (r'\brapid response\b', 'Rapid Response'),
        (r'\boverflow\b', 'Overflow Unit Prioritization'),
        (r'\bfirst.day admission\b', 'First-Day Admissions'),
        (r'\bblood culture\b', 'Blood Culture Collection'),
        (r'\bwrong.patient\b', 'Medication Safety'),
        (r'\bline identif\b', 'Line Identification / Labeling'),
        (r'\bdementia\b', 'Dementia / Delirium'),
        (r'\bbehavioral escalation\b', 'Behavioral Escalation'),
        (r'\bsuicide precaution\b', 'Suicide Precautions'),
        (r'\btrauma.informed\b', 'Trauma-Informed Care'),
        (r'\bsubstance withdr\b', 'Substance Withdrawal'),
        (r'\balcohol withdr\b', 'Alcohol Withdrawal'),
        (r'\bdelirium\b', 'Dementia / Delirium'),
        (r'\bopioids?.*respirat\b', 'Opioid Safety'),
        (r'\bantenatal\b|\bprenatal\b', 'Prenatal / Antenatal Care'),
        (r'\bpediatric overwe\b', 'Pediatric Obesity'),
        (r'\bcerebral palsy\b', 'Cerebral Palsy'),
        (r'\bcystic fibrosis\b', 'Cystic Fibrosis'),
        (r'\bdown syndrome\b', 'Down Syndrome'),
        (r'\bkawasaki\b', 'Kawasaki Disease'),
        (r'\blead poison\b', 'Lead Poisoning'),
        (r'\bpreterm labor\b', 'Preterm Labor / PROM'),
        (r'\bplacental abrup\b', 'Placental Abruption / Previa'),
        (r'\bplacental prev\b', 'Placental Abruption / Previa'),
        (r'\bgestational diabetes\b', 'Gestational Diabetes'),
        (r'\bpostpartum depres\b', 'Postpartum Depression'),
        (r'\bneonatal abstin\b', 'Neonatal Abstinence Syndrome'),
        (r'\bhyperbilirubin\b', 'Hyperbilirubinemia / Jaundice'),
        (r'\bj(a|au)ndice\b', 'Hyperbilirubinemia / Jaundice'),
        (r'\bsids\b', 'SIDS Prevention'),
        (r'\bventilator.associated pneumonia\b', 'VAP Prevention'),
        (r'\bgcs\b|\bglasgow\b', 'Glasgow Coma Scale'),
        (r'\bbraden\b', 'Braden Scale'),
        (r'\bapgar\b', 'APGAR Scoring'),
        (r'\bmeningitis\b', 'Meningitis'),
        (r'\bencephalitis\b', 'Encephalitis'),
        (r'\bguillain.barre\b', 'Guillain-Barre Syndrome'),
        (r'\bmyasthenia\b', 'Myasthenia Gravis'),
        (r'\balzheimer\b', 'Alzheimer Disease'),
        (r'\bhuntington\b', 'Huntington Disease'),
        (r'\btraumatic brain\b', 'Traumatic Brain Injury'),
        (r'\btbi\b', 'Traumatic Brain Injury'),
        (r'\bstatus epileptic\b', 'Status Epilepticus'),
        (r'\brespiratory fail\b', 'Respiratory Failure'),
        (r'\bflail chest\b', 'Flail Chest'),
        (r'\bhemothorax\b', 'Hemothorax'),
        (r'\bpulmonary hypertension\b', 'Pulmonary Hypertension'),
        (r'\bcor pulmonale\b', 'Cor Pulmonale'),
        (r'\bcardiogenic shock\b', 'Cardiogenic Shock'),
        (r'\bhypovolemic shock\b', 'Hypovolemic Shock'),
        (r'\bdistributive shock\b', 'Distributive Shock'),
        (r'\bobstructive shock\b', 'Obstructive Shock'),
        (r'\banaphylaxis\b', 'Anaphylaxis'),
        (r'\btransfusion reaction\b', 'Transfusion Reaction'),
        (r'\bpulmonary edema\b', 'Pulmonary Edema'),
        (r'\bacute abdomen\b', 'Acute Abdomen'),
        (r'\bappendicitis\b', 'Appendicitis'),
        (r'\bdiverticulitis\b', 'Diverticulitis'),
        (r'\bcholecystitis\b', 'Cholecystitis / Gallbladder'),
        (r'\bgallbladder\b', 'Cholecystitis / Gallbladder'),
        (r'\bperitonitis\b', 'Peritonitis'),
        (r'\binflammatory bowel\b', 'Crohn / Ulcerative Colitis'),
        (r'\bcrohn\b', 'Crohn / Ulcerative Colitis'),
        (r'\bceliac\b', 'Celiac Disease'),
        (r'\bbariatric\b', 'Bariatric Surgery'),
        (r'\bdumping\b', 'Dumping Syndrome'),
        (r'\bpicc\b', 'PICC Line Care'),
        (r'\bimplanted port\b', 'Implanted Port Care'),
        (r'\bcrrt\b|\bcontinuous renal\b', 'CRRT'),
        (r'\bpacemaker\b', 'Pacemaker'),
        (r'\bicd\b|\bcardioverter.defib\b', 'ICD / Implantable Cardioverter'),
        (r'\belectroconvulsive\b', 'Electroconvulsive Therapy'),
        (r'\bwound vac\b|negative pressure\b', 'Negative Pressure Wound Therapy'),
        (r'\bhyperbaric\b', 'Hyperbaric Oxygen Therapy'),
        (r'\bradiation safety\b', 'Radiation Safety'),
        (r'\bextravasation\b', 'Chemotherapy Safety'),
        (r'\bmonoclonal antibod\b', 'Monoclonal Antibodies'),
        (r'\bimmunosuppress\b', 'Immunosuppression'),
        (r'\btransplant reject\b', 'Organ Transplant'),
        (r'\bgraft vs host\b', 'Graft vs Host Disease'),
        (r'\bbone marrow transplant\b', 'Bone Marrow Transplant'),
        (r'\bstem cell transplant\b', 'Bone Marrow Transplant'),
        (r'\bautoimmune\b', 'Autoimmune Disorders'),
        (r'\bcomplementary\b|alternative medicine\b', 'CAM / Alternative Medicine'),
        (r'\bherbal\b', 'Herbal Supplement Interactions'),
        (r'\bwarfarin\b|\bdoac\b|\bheparin\b', 'Anticoagulation'),
        (r'\breye syndrom\b', 'Reye Syndrome'),
        (r'\bwilms\b', 'Wilms Tumor'),
        (r'\bchildhood cancer\b', 'Childhood Cancers'),
        (r'\bhyperparathy\b', 'Hyperparathyroidism'),
        (r'\bhypothy\b', 'Hypothyroidism'),
        (r'\bpituitary\b', 'Pituitary Disorders'),
        (r'\bosteoarthrit\b', 'Osteoarthritis'),
        (r'\bosteopor\b', 'Osteoporosis'),
        (r'\bsystemic lupus\b|\bsle\b', 'Systemic Lupus Erythematosus'),
        (r'\bmultiple sclerosis\b', 'Multiple Sclerosis'),
        (r'\bals\b', 'Amyotrophic Lateral Sclerosis'),
        (r'\bcancer screening\b', 'Cancer Screening'),
        (r'\bperioperati\b|pre.op|intra.op|post.op\b', 'Perioperative Nursing'),
        (r'\bconscious sedation\b', 'Conscious Sedation'),
        (r'\bwound dehiscence\b', 'Wound Dehiscence / Evisceration'),
        (r'\bcompartment synd\b', 'Compartment Syndrome'),
        (r'\bfat embolism\b', 'Fat Embolism Syndrome'),
        (r'\bdic\b', 'Disseminated Intravascular Coagulation'),
        (r'\bhit\b|heparin.induced\b', 'Heparin-Induced Thrombocytopenia'),
        (r'\bttp\b|thrombotic thrombocytopenic\b', 'Thrombotic Thrombocytopenic Purpura'),
        (r'\bmalignant hypertherm\b', 'Malignant Hyperthermia'),
        (r'\bautonomic dysreflex\b', 'Autonomic Dysreflexia'),
        (r'\btetanus\b', 'Tetanus Prophylaxis'),
        (r'\brabies\b', 'Rabies PEP'),
        (r'\bsexually transmitted\b|sti\b', 'STIs'),
        (r'\btoxic shock\b', 'Toxic Shock Syndrome'),
        (r'\bnecrotizing fasci\b', 'Necrotizing Fasciitis'),
        (r'\bcovid\b', 'COVID-19'),
        (r'\bmonkey\w*\b|mpox\b', 'MPOX'),
        (r'\bopioid use\b|mat\b', 'Opioid Use Disorder / MAT'),
        (r'\bintimate partner\b|\bdomestic violence\b', 'Intimate Partner Violence'),
        (r'\bhuman traffick\b', 'Human Trafficking'),
        (r'\bpediatric obesi\b', 'Pediatric Obesity'),
        (r'\bfailure to thrive\b', 'Failure to Thrive'),
        (r'\bscoliosis\b', 'Scoliosis'),
        (r'\bspina bifida\b', 'Spina Bifida'),
        (r'\bturner syndrome\b', 'Turner Syndrome'),
        (r'\bfragile x\b', 'Fragile X Syndrome'),
        (r'\bphenylketonuria\b', 'Phenylketonuria'),
        (r'\bpreterm labor\b', 'Preterm Labor / PROM'),
        (r'\bcord prolapse\b', 'Umbilical Cord Prolapse'),
        (r'\bshoulder dystocia\b', 'Shoulder Dystocia'),
        (r'\bmastitis\b', 'Mastitis'),
        (r'\bgbs\b|group b strep\b', 'GBS Prophylaxis'),
        (r'\bretinopathy of prematur\b', 'Retinopathy of Prematurity'),
        (r'\bbronchopulmonary\b', 'Bronchopulmonary Dysplasia'),
        (r'\bventilator associated\b', 'VAP'),
        (r'\bsurgical site\b', 'Surgical Site Infection'),
        (r'\bbishop\b', 'Bishop Score'),
        (r'\bballard\b', 'Newborn Gestational Assessment'),
        (r'\bspina bifida\b', 'Spina Bifida'),
        (r'\bcerebral palsy\b', 'Cerebral Palsy'),
    ]
    
    for pattern, concept in concept_patterns:
        if re.search(pattern, t):
            return concept
    
    # Fallback: use the first meaningful word sequence
    words = t.split()
    if words:
        return words[0].title() if len(words) == 1 else ' '.join(words[:3]).title()
    return "UNCLASSIFIED"


def get_body_system_normalized(body_system: str) -> str:
    """Normalize body system names."""
    mapping = {
        "Cardiovascular": "Cardiovascular",
        "Respiratory": "Respiratory",
        "Renal": "Renal / Fluids & Electrolytes",
        "Endocrine": "Endocrine",
        "Gastrointestinal": "Gastrointestinal",
        "Neurologic": "Neurologic",
        "Neurological": "Neurologic",
        "Hematologic": "Hematologic",
        "Immune": "Immune / Infection",
        "Infection": "Immune / Infection",
        "Infection control": "Immune / Infection",
        "Integumentary": "Integumentary / Musculoskeletal",
        "Pharmacology": "Pharmacology",
        "Mental Health": "Mental Health / Psych",
        "Psychiatric": "Mental Health / Psych",
        "Psychosocial": "Mental Health / Psych",
        "Maternity": "Maternity / OB",
        "Pediatrics": "Pediatrics",
        "Multisystem": "General / Professional",
        "General": "General / Professional",
    }
    return mapping.get(body_system, body_system)


def main():
    with open(CATALOG_PATH) as f:
        data = json.load(f)
    
    pathways = data['pathways']
    
    # Build concept registry
    # concept -> list of (pathway_id, lesson_title, body_system)
    concept_registry = defaultdict(list)
    pathway_counts = defaultdict(int)
    system_coverage = defaultdict(lambda: defaultdict(list))
    tier_concepts = defaultdict(lambda: defaultdict(set))
    all_lessons = []
    
    for pid, pw in pathways.items():
        meta = TIERS.get(pid, {"label": pid, "tier": pid, "exam": "Unknown"})
        for lesson in pw['lessons']:
            title = lesson['title']
            body_system = lesson.get('bodySystem', 'General')
            concept = extract_primary_concept(title)
            concept_registry[concept].append({
                'pid': pid,
                'tier_label': meta['label'],
                'tier': meta['tier'],
                'exam': meta['exam'],
                'title': title,
                'body_system': body_system,
                'normalized_system': get_body_system_normalized(body_system),
            })
            pathway_counts[pid] += 1
            system_coverage[get_body_system_normalized(body_system)][pid].append(title)
            tier_concepts[meta['tier']][concept].add(title)
            all_lessons.append(title)
    
    # Analyze duplicates and near-duplicates
    duplicate_clusters = defaultdict(list)
    for concept_id, items in sorted(concept_registry.items()):
        if len(items) > 1:
            pathways_present = set(item['pid'] for item in items)
            tiers_present = set(item['tier'] for item in items)
            
            # Count by tier
            tier_distribution = defaultdict(int)
            for item in items:
                tier_distribution[item['tier']] += 1
            
            duplicate_clusters[concept_id] = {
                'total_instances': len(items),
                'unique_pathways': len(pathways_present),
                'tiers_present': tiers_present,
                'tier_distribution': dict(tier_distribution),
                'lessons': items,
            }
    
    # Find over-fragmented concepts (many variants of same core topic)
    fragmented_clusters = defaultdict(list)
    for concept_id in sorted(concept_registry.keys()):
        cluster_key = concept_id.split(' / ')[0] if ' / ' in concept_id else concept_id.split('(')[0].strip()
        fragmented_clusters[cluster_key].append(concept_id)
    
    over_fragmented = {k: v for k, v in fragmented_clusters.items() if len(v) >= 4}
    
    # Find concepts that appear in only one tier
    single_tier_concepts = []
    for concept_id, items in sorted(concept_registry.items()):
        tiers = set(item['tier'] for item in items)
        if len(tiers) == 1 and len(items) <= 2:
            single_tier_concepts.append({
                'concept': concept_id,
                'tier': list(tiers)[0],
                'lessons': [item['title'] for item in items],
            })
    
    # Count unique concepts
    total_unique_concepts = len(concept_registry)
    
    # Body system analysis
    body_system_summary = {}
    for sys_name, sys_data in sorted(system_coverage.items()):
        total_lessons = sum(len(v) for v in sys_data.values())
        pathways_covered = list(sys_data.keys())
        body_system_summary[sys_name] = {
            'total_lessons': total_lessons,
            'pathways_covered': pathways_covered,
            'num_pathways': len(pathways_covered),
        }
    
    # Generate report
    report = []
    report.append("# Concept-Level Curriculum Audit")
    report.append("")
    report.append(f"Generated: 2026-06-01")
    report.append(f"Source: `src/content/pathway-lessons/catalog.json`")
    report.append("")
    report.append("---")
    report.append("")
    
    # 1. Executive Summary
    report.append("## 1. Executive Summary")
    report.append("")
    report.append(f"- **Total lessons across all pathways:** {sum(pathway_counts.values())}")
    report.append(f"- **Total unique clinical concepts:** {total_unique_concepts}")
    report.append(f"- **Number of pathways analyzed:** {len(pathways)}")
    report.append("")
    for pid in sorted(pathways):
        meta = TIERS.get(pid, {"label": pid})
        report.append(f"  - {meta['label']}: {pathway_counts[pid]} lessons")
    report.append("")
    
    # 2. Coverage by Body System
    report.append("## 2. Coverage by Body System")
    report.append("")
    report.append("| Body System | Total Lessons | Pathways Covered |")
    report.append("|---|---|---|")
    for sys_name, summary in sorted(body_system_summary.items()):
        pathways_str = ", ".join(sorted(summary['pathways_covered']))
        report.append(f"| {sys_name} | {summary['total_lessons']} | {pathways_str} |")
    report.append("")
    
    # 3. Duplicate Concept Clusters
    report.append("## 3. Duplicate Concept Clusters")
    report.append("")
    report.append("Concepts appearing across multiple lessons or tiers (intentional shared concepts are expected).")
    report.append("")
    
    # Split into expected and unexpected duplicates
    expected_overlap_concepts = {
        'Heart Failure', 'Myocardial Infarction / ACS', 'Angina', 'Atrial Fibrillation / Dysrhythmias',
        'Hypertension', 'Shock', 'DVT / Venous Thromboembolism', 'Pulmonary Embolism',
        'Endocarditis', 'Pericarditis', 'Cardiac Tamponade', 'CABG / Cardiac Surgery',
        'Peripheral Artery Disease', 'Hemodynamic Monitoring',
        'COPD', 'Asthma', 'Pneumonia', 'ARDS', 'ABG Interpretation',
        'Tuberculosis', 'Pleural Effusion / Chest Tubes', 'Oxygen Therapy',
        'Acute Kidney Injury', 'Acid-Base Balance', 'Fluid Balance / IV Therapy',
        'Dialysis / CKD', 'UTI / Pyelonephritis', 'Kidney Stones', 'Catheter Care / CAUTI',
        'Insulin / Diabetes', 'DKA / HHS', 'Thyroid Disorders', 'Adrenal Disorders',
        'SIADH / Diabetes Insipidus', 'Liver Failure / Cirrhosis', 'Pancreatitis',
        'Bowel Obstruction / Ileus', 'GERD / Peptic Ulcer', 'GI Bleed', 'C. difficile',
        'Ostomy Care', 'Enteral Nutrition', 'TPN / Parenteral Nutrition',
        'Stroke', 'Seizures', 'Increased ICP', 'Spinal Cord Injury', 'Meningitis',
        'Headache', 'Parkinson Disease', 'Pain Management',
        'Anemia / Transfusion', 'Anticoagulation', 'Transfusion Therapy',
        'Sepsis', 'Isolation Precautions', 'Antibiotics / Stewardship',
        'Wound Care', 'Burns', 'Pressure Injuries',
        'Suicide Risk', 'Psychotropic Medications', 'Alcohol Withdrawal',
        'Delegation / Assignment', 'Prioritization / ABCs', 'Clinical Judgment',
        'Therapeutic Communication', 'Documentation', 'Medication Safety',
        'Fall Prevention', 'Restraints', 'Postpartum Hemorrhage', 'Newborn Care',
        'Immunization Schedule', 'Growth Chart / Development',
        'Preeclampsia / Eclampsia', 'Dementia / Delirium',
        'Sodium Disorders', 'Potassium Disorders', 'Calcium Disorders', 'Magnesium Disorders',
        'Phosphate Disorders', 'Cardioversion / Defibrillation',
        'Chronic Disease Self-Management', 'Health Literacy',
        'Social Determinants of Health', 'Prenatal / Antenatal Care',
    }
    
    report.append("### 3a. Expected Cross-Tier Overlaps (shared clinical foundations)")
    report.append("")
    report.append("These concepts appear across multiple tiers, which is intentional for shared clinical foundations.")
    report.append("")
    
    cross_tier_overlaps = {c: d for c, d in sorted(duplicate_clusters.items()) 
                           if len(d['tiers_present']) > 1 and c in expected_overlap_concepts}
    for concept, details in sorted(cross_tier_overlaps.items()):
        tier_dist = ", ".join(f"{t}: {c}" for t, c in sorted(details['tier_distribution'].items()))
        report.append(f"- **{concept}** ({details['total_instances']} instances across {len(details['tiers_present'])} tiers: {tier_dist})")
    report.append("")
    
    report.append("### 3b. Potentially Duplicate or Over-fragmented Concepts")
    report.append("")
    report.append("These concepts appear multiple times and may benefit from consolidation or deduplication review.")
    report.append("")
    
    potential_dupes = {c: d for c, d in sorted(duplicate_clusters.items()) 
                       if len(d['tiers_present']) <= 1 and c not in expected_overlap_concepts
                       and d['total_instances'] >= 2}
    
    if potential_dupes:
        for concept, details in sorted(potential_dupes.items()):
            report.append(f"**{concept}** ({details['total_instances']} instances in {', '.join(sorted(details['tiers_present']))} only)")
            for item in details['lessons']:
                report.append(f"  - [{item['tier_label']}] {item['title']}")
            report.append("")
    else:
        report.append("No unexpected duplicates found within single-tier groups.")
        report.append("")
    
    # 4. Over-fragmented Concepts
    report.append("## 4. Over-Fragmented Concepts")
    report.append("")
    report.append("Concepts that have been split into many sub-lessons — may benefit from merging or restructuring.")
    report.append("")
    
    if over_fragmented:
        for cluster_key, concepts in sorted(over_fragmented.items()):
            total = sum(len(concept_registry[c]) for c in concepts)
            report.append(f"**{cluster_key}** — {len(concepts)} related concept(s), {total} total lesson instances")
            for c in concepts:
                items = concept_registry[c]
                report.append(f"  - {c} ({len(items)} instances)")
                for item in items[:3]:  # Show first 3 examples
                    report.append(f"    - [{item['tier_label']}] {item['title']}")
                if len(items) > 3:
                    report.append(f"    - ... and {len(items)-3} more")
            report.append("")
    else:
        report.append("No significant over-fragmentation detected.")
        report.append("")
    
    # 5. Missing High-Yield Concepts by Exam
    report.append("## 5. Missing High-Yield Concepts")
    report.append("")
    report.append("Known high-yield NCLEX/PN/NP concepts that appear to be absent or underrepresented in the catalog.")
    report.append("")
    
    all_concepts = set(concept_registry.keys())
    
    # Check expected concepts
    present_count = 0
    missing_count = 0
    present_concepts = set()
    missing_concepts = []
    
    for system_name, concepts in EXPECTED_HIGH_YIELD_CONCEPTS.items():
        report.append(f"### {system_name}")
        report.append("")
        for concept in concepts:
            # Check if any concept in our registry matches
            found = False
            matched_concepts = []
            for registered in all_concepts:
                # Check for partial match
                concept_keywords = concept.lower().split()
                registered_lower = registered.lower()
                if all(kw in registered_lower for kw in concept_keywords):
                    found = True
                    matched_concepts.append(registered)
            
            if found:
                present_count += 1
                present_concepts.update(matched_concepts)
                tier_info = []
                for mc in matched_concepts:
                    if mc in concept_registry:
                        tiers_found = set(i['tier'] for i in concept_registry[mc])
                        tier_info.append(f"{mc} [{', '.join(sorted(tiers_found))}]")
                report.append(f"- ✅ **{concept}** → {', '.join(tier_info)}")
            else:
                missing_count += 1
                missing_concepts.append(concept)
                report.append(f"- ❌ **{concept}** — NOT FOUND")
        report.append("")
    
    report.append(f"### Coverage Summary")
    report.append(f"- Expected concepts checked: {present_count + missing_count}")
    report.append(f"- Present: {present_count}")
    report.append(f"- Missing: {missing_count}")
    report.append(f"- Coverage rate: {present_count/(present_count+missing_count)*100:.1f}%")
    report.append("")
    
    # 6. Coverage by Pathway
    report.append("## 6. Coverage by Pathway")
    report.append("")
    report.append("| Pathway | Tier | Total Lessons | Unique Concepts |")
    report.append("|---|---|---|---|")
    for pid in sorted(pathways):
        meta = TIERS.get(pid, {"label": pid, "tier": pid})
        tier = meta['tier']
        total = pathway_counts[pid]
        unique_concepts_in_pathway = len(tier_concepts.get(tier, {}))
        report.append(f"| {meta['label']} | {tier} | {total} | {unique_concepts_in_pathway} |")
    report.append("")
    
    # Per-pathway detail
    for pid in sorted(pathways):
        meta = TIERS.get(pid, {"label": pid})
        pw = pathways[pid]
        
        # Group pathway lessons by body system
        by_system = OrderedDict()
        for lesson in pw['lessons']:
            sys = lesson.get('bodySystem', 'General')
            norm_sys = get_body_system_normalized(sys)
            if norm_sys not in by_system:
                by_system[norm_sys] = []
            by_system[norm_sys].append(lesson['title'])
        
        report.append(f"### {meta['label']} ({pathway_counts[pid]} lessons)")
        report.append("")
        for sys, lessons in sorted(by_system.items()):
            report.append(f"- **{sys}** ({len(lessons)} lessons)")
        report.append("")
    
    # 7. Recommendations
    report.append("## 7. Recommendations")
    report.append("")
    
    # Analyze gaps
    urgent_missing = [c for c in missing_concepts if c in {
        'Post-Operative Care', 'Blood Transfusion (detailed)', 'Central Line Care',
        'Perioperative Nursing', 'Mechanical Ventilation (nursing management)',
        'ECG Rhythm Recognition (detailed)', 'Chest Pain (differentiation)',
        'Head Injury / TBI', 'Guillain-Barre / Myasthenia Gravis',
        'Substance Use Disorder', 'Family Violence / Abuse',
        'Community Health Nursing', 'End of Life / Palliative Care (detailed)',
        'Cultural Competence', 'Triage / Disaster Nursing',
        'Rheumatoid Arthritis (management depth for RN)',
        'Osteoporosis (fall prevention, treatment)',
        'Systemic Lupus Erythematosus',
        'Multiple Sclerosis',
        'Amyotrophic Lateral Sclerosis',
        'Cancer Screening Guidelines',
        'Hospice Philosophy',
        'Advance Directives / Living Will',
        'Organ Donation',
        'Perioperative Nursing (pre-op, intra-op, post-op)',
        'Compartment Syndrome',
        'Fat Embolism Syndrome',
        'Disseminated Intravascular Coagulation',
        'Heparin-Induced Thrombocytopenia',
        'Malignant Hyperthermia',
        'Autonomic Dysreflexia',
        'COVID-19 Nursing Care',
        'Opioid Use Disorder / MAT',
        'Intimate Partner Violence',
        'Human Trafficking Recognition',
        'Cystic Fibrosis',
        'Gestational Diabetes',
        'Postpartum Depression / Psychosis',
        'Neonatal Abstinence Syndrome',
        'Hyperbilirubinemia / Jaundice',
        'Ventilator-Associated Pneumonia (VAP)',
        'CAUTI Prevention',
        'CLABSI Prevention',
        'Surgical Site Infection Prevention',
        'Glasgow Coma Scale',
        'Braden Scale',
        'APGAR Scoring',
    }]
    
    report.append("### 7a. Urgent Gaps (High Clinical Priority)")
    report.append("")
    report.append("These are high-yield NCLEX/PN/NP concepts missing from all pathways:")
    report.append("")
    if urgent_missing:
        for c in sorted(urgent_missing):
            report.append(f"- **{c}**")
    else:
        report.append("No urgent gaps identified among the checked high-yield concepts.")
    report.append("")
    
    report.append("### 7b. Moderate Gaps (Medium Clinical Priority)")
    report.append("")
    remaining_missing = [c for c in missing_concepts if c not in urgent_missing]
    if remaining_missing:
        for c in sorted(remaining_missing):
            report.append(f"- **{c}**")
    else:
        report.append("No moderate gaps identified.")
    report.append("")
    
    report.append("### 7c. Consolidation Opportunities")
    report.append("")
    if over_fragmented:
        for cluster_key, concepts in sorted(over_fragmented.items()):
            total = sum(len(concept_registry[c]) for c in concepts)
            report.append(f"- **{cluster_key}**: {len(concepts)} related concepts with {total} total lesson instances. These could potentially be consolidated into fewer, deeper lessons.")
    report.append("")
    
    report.append("### 7d. RPN/LPN vs RN Depth Gaps")
    report.append("")
    rpn_concepts = set(tier_concepts.get('RPN', {}).keys())
    lpn_concepts = set(tier_concepts.get('LPN', {}).keys())
    rn_concepts = set(tier_concepts.get('RN', {}).keys())
    np_concepts = set(tier_concepts.get('NP', {}).keys())
    
    pn_concepts = rpn_concepts | lpn_concepts
    
    # Concepts RN has that PN doesn't
    rn_only = rn_concepts - pn_concepts
    report.append(f"- **RN-only concepts** ({len(rn_only)}): concepts covered in RN but missing from RPN/LPN")
    for c in sorted(list(rn_only))[:20]:
        report.append(f"  - {c}")
    if len(rn_only) > 20:
        report.append(f"  - ... and {len(rn_only)-20} more")
    report.append("")
    
    # Concepts NP has that others don't
    np_only = np_concepts - rn_concepts - pn_concepts
    if np_only:
        report.append(f"- **NP-only concepts** ({len(np_only)}):")
        for c in sorted(list(np_only)):
            report.append(f"  - {c}")
        report.append("")
    
    # 8. Appendix: Complete Concept Inventory
    report.append("## 8. Appendix: Complete Concept Inventory")
    report.append("")
    report.append("| Clinical Concept | Total Instances | Tiers | Pathways |")
    report.append("|---|---|---|---|")
    for concept_id, items in sorted(concept_registry.items()):
        tiers = set(item['tier'] for item in items)
        pathway_ids = set(item['pid'] for item in items)
        report.append(f"| {concept_id} | {len(items)} | {', '.join(sorted(tiers))} | {', '.join(sorted(pathway_ids))} |")
    report.append("")
    
    report_text = '\n'.join(report)
    
    # Write report
    output_path = Path("docs/reports/concept-level-curriculum-audit.md")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(report_text)
    print(f"Report written to {output_path}")
    print(f"\nSummary:")
    print(f"  Total lessons: {sum(pathway_counts.values())}")
    print(f"  Unique concepts: {total_unique_concepts}")
    print(f"  Expected concepts present: {present_count}")
    print(f"  Expected concepts missing: {missing_count}")
    print(f"  Coverage rate: {present_count/(present_count+missing_count)*100:.1f}%")
    print(f"  Over-fragmented clusters: {len(over_fragmented)}")
    print(f"  Potential duplicates: {len(potential_dupes)}")


if __name__ == '__main__':
    main()