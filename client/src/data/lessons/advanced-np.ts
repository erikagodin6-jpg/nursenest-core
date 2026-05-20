import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

export const advancedNpLessons: Record<string, LessonContent> = {
  "mi-management-np": {
    title: "STEMI: Molecular & Pharmacology",
    cellular: { 
      title: "Plaque Rupture & Cascade", 
      content: "Atherosclerotic plaque rupture exposes the subendothelium to blood, activating the coagulation cascade. Platelets adhere via von Willebrand factor, activating GP IIb/IIIa receptors. Thrombus formation occludes the coronary artery, leading to anaerobic metabolism, ATP depletion, and cellular acidosis. Without reperfusion, necrosis begins in the subendocardium and extends transmurally." 
    },
    riskFactors: ["Uncontrolled hypertension", "Hyperlipidemia with LDL > 160", "Diabetes mellitus with HbA1c > 7%", "Smoking (dose-dependent risk)", "Family history of premature CAD (male < 55, female < 65)", "Metabolic syndrome", "Chronic kidney disease", "Cocaine/methamphetamine use", "Autoimmune vasculitis"],
    diagnostics: ["Order serial troponin I/T every 3-6 hours (high-sensitivity preferred)", "Order 12-lead ECG within 10 minutes of presentation", "Order BNP/NT-proBNP for heart failure assessment", "Order echocardiogram for wall motion abnormalities", "Order CBC, BMP, coagulation studies, lipid panel", "Order CXR to evaluate for pulmonary edema", "Order coronary angiography for STEMI (emergent PCI)", "Calculate TIMI or GRACE risk score"],
    management: ["Activate cardiac catheterization lab for STEMI (Door-to-Balloon < 90 min)", "Prescribe DAPT: Aspirin 325mg + P2Y12 inhibitor (Ticagrelor 180mg or Prasugrel 60mg)", "Initiate anticoagulation with Heparin bolus and infusion", "Order fibrinolytic therapy (Tenecteplase) if PCI unavailable within 120 minutes", "Start high-intensity statin (Atorvastatin 80mg)", "Prescribe beta-blocker within 24 hours if hemodynamically stable", "Order ACE inhibitor for anterior STEMI or EF < 40%", "Refer to cardiology and cardiac rehabilitation"],
    nursingActions: ["Monitor continuous telemetry for arrhythmias (VF/VT highest risk in first 24h)", "Titrate Heparin infusion to target aPTT per protocol", "Monitor hemodynamic status and cardiac output post-PCI", "Assess for signs of cardiogenic shock (CI < 2.2, cool extremities)", "Monitor access site for bleeding/hematoma after catheterization", "Evaluate reperfusion markers (ST-segment resolution, troponin washout)", "Reassess chest pain using standardized pain scale and 12-lead ECG", "Monitor fluid balance and watch for pulmonary edema"],
    signs: {
      left: ["Levine's Sign (Clenched fist)", "Diaphoresis (Sympathetic surge)", "S3/S4 Gallop (Compliance issue)", "New Murmur (Papillary dysfunction)"],
      right: ["Cardiogenic Shock (CI < 2.2)", "Ventricular Fibrillation", "Complete Heart Block (RCA)", "Free Wall Rupture (Day 3-7)"]
    },
    medications: [
      { name: "Dual Antiplatelet Therapy (DAPT)", type: "P2Y12 Inhibitor + Aspirin", action: "Inhibits platelet aggregation", sideEffects: "Bleeding", contra: "Active bleed", pearl: "Ticagrelor/Prasugrel preferred over Clopidogrel in acute coronary syndrome." },
      { name: "Tenecteplase (TNK)", type: "Fibrinolytic", action: "Converts plasminogen to plasmin", sideEffects: "ICH", contra: "History of hemorrhagic stroke", pearl: "Single weight-based bolus. Only if PCI > 120 mins away." }
    ],
    pearls: ["Door-to-Balloon time < 90 mins", "Door-to-Needle time < 30 mins (if no PCI)", "Beta-blockers reduce remodeling and arrhythmias (start within 24h)"],
    quiz: [{ question: "Which finding is an absolute contraindication to Fibrinolytic therapy in STEMI?", options: ["BP 170/90", "History of hemorrhagic stroke", "Current Aspirin use", "Age > 75"], correct: 1, rationale: "History of hemorrhagic stroke is an absolute contraindication due to the high risk of catastrophic intracranial hemorrhage." }]
  },
  "shock-syndromes-np": {
    title: "Shock: Hemodynamic Monitoring",
    cellular: { 
      title: "Oxygen Delivery (DO2) vs Consumption (VO2)", 
      content: "Shock is a state where DO2 fails to meet VO2, leading to cellular hypoxia and lactate production. \n\nCardiogenic: Low CO, High SVR, High PCWP. \nSeptic: High CO (early), Low SVR, Low/Normal PCWP. \nHypovolemic: Low CO, High SVR, Low PCWP." 
    },
    riskFactors: ["Major trauma", "Massive hemorrhage", "Acute MI with large territory", "Sepsis with delayed treatment", "Severe anaphylaxis", "High spinal cord injury (above T6)", "Massive pulmonary embolism", "Cardiac tamponade"],
    diagnostics: ["Order serial lactate levels every 2-4 hours to assess tissue perfusion", "Order central venous catheter for CVP and ScvO2 monitoring", "Order arterial line for continuous MAP monitoring", "Order echocardiogram to assess cardiac output and filling pressures", "Order CBC, BMP, coagulation panel, blood type and crossmatch", "Order cortisol level (random) for adrenal insufficiency assessment", "Order PA catheter placement for refractory shock (CO, SVR, PCWP)", "Order point-of-care ultrasound (POCUS) for rapid assessment"],
    management: ["Prescribe Norepinephrine as first-line vasopressor (titrate to MAP ≥ 65)", "Order 30 mL/kg crystalloid bolus for septic/hypovolemic shock", "Prescribe Dobutamine for cardiogenic shock with adequate BP", "Initiate vasopressin 0.04 units/min as second-line pressor", "Order massive transfusion protocol (1:1:1 pRBC:FFP:Platelets) for hemorrhagic shock", "Prescribe Epinephrine IM/IV for anaphylactic shock", "Order stress-dose hydrocortisone for refractory septic shock", "Consult critical care/surgery based on shock etiology"],
    nursingActions: ["Titrate vasopressors to target MAP ≥ 65 mmHg per protocol", "Monitor ScvO2 continuously (target > 70%) via central line", "Perform passive leg raise (PLR) test to assess fluid responsiveness", "Monitor urine output hourly (target > 0.5 mL/kg/hr)", "Calculate and trend Shock Index (HR/SBP) for early detection", "Evaluate end-organ perfusion (mental status, skin mottling, capillary refill)", "Monitor and trend lactate clearance as a resuscitation endpoint", "Assess for complications of resuscitation (fluid overload, abdominal compartment syndrome)"],
    signs: {
      left: ["Lactate > 2 mmol/L", "ScvO2 < 70%", "Narrow Pulse Pressure (Cardiogenic)", "Widened Pulse Pressure (Septic)"],
      right: ["Multi-Organ Dysfunction (MODS)", "Refractory Hypotension", "DIC (Disseminated Intravascular Coagulation)", "Acute Tubular Necrosis"]
    },
    medications: [
      { name: "Norepinephrine", type: "Alpha-1 Agonist", action: "Vasoconstriction (SVR)", sideEffects: "Ischemia", contra: "Hypovolemia", pearl: "First-line pressor for Sepsis. Titrate to MAP > 65." },
      { name: "Dobutamine", type: "Beta-1 Agonist", action: "Inotropy (Contractility)", sideEffects: "Tachyarrhythmias", contra: "HOCM", pearl: "Used in Cardiogenic shock (Pump failure) with adequate BP." }
    ],
    pearls: ["Passive Leg Raise (PLR) is the best predictor of fluid responsiveness", "Avoid fluid overload in Cardiogenic shock (worsens pulmonary edema)", "Target MAP of 65 mmHg for end-organ perfusion"],
    quiz: [{ question: "In a patient with Septic Shock, what is the expected hemodynamic profile?", options: ["Low CO, High SVR", "High CO, Low SVR", "Low CO, Low SVR", "High CO, High SVR"], correct: 1, rationale: "Distributive shock (Sepsis) presents with vasodilation (Low SVR) and a compensatory increase in Cardiac Output (High CO) in the early phase." }]
  },
  "sepsis-mastery-np": {
    title: "Sepsis: Cytokine Storm & SOFA",
    cellular: { 
      title: "Dysregulated Host Response", 
      content: "Pathogen recognition receptors (TLRs) trigger NF-kB pathway, releasing pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6). This causes widespread endothelial injury, capillary leak, and microvascular thrombosis (DIC). Mitochondrial dysfunction leads to dysoxia despite adequate oxygen delivery." 
    },
    riskFactors: ["ICU admission", "Central venous catheters", "Mechanical ventilation", "Neutropenia (ANC < 500)", "Immunosuppressive therapy", "Uncontrolled diabetes", "Chronic liver disease", "Splenectomy", "Broad-spectrum antibiotic exposure (C. diff risk)"],
    diagnostics: ["Order blood cultures x2 (from 2 sites) BEFORE antibiotics", "Order procalcitonin level for antibiotic stewardship", "Order serial lactate every 2-4 hours", "Order CBC with differential, CMP, coagulation studies", "Order source-specific imaging (CT abdomen, CXR, urinalysis)", "Calculate qSOFA and SOFA scores for risk stratification", "Order C-reactive protein and ferritin for inflammatory markers", "Order DIC panel if platelets trending down (fibrinogen, D-dimer, PT/PTT)"],
    management: ["Prescribe broad-spectrum antibiotics within 1 hour of recognition", "Order 30 mL/kg crystalloid bolus within 3 hours for hypotension or lactate ≥ 4", "Prescribe Norepinephrine as first-line vasopressor if fluid-refractory", "Add Vasopressin 0.04 units/min if Norepinephrine dose exceeds 0.25 mcg/kg/min", "Order stress-dose Hydrocortisone 200mg/day for vasopressor-dependent shock", "Narrow antibiotic coverage based on culture and sensitivity results", "Consult infectious disease for complex or resistant organisms", "Order DVT prophylaxis and stress ulcer prophylaxis per ICU bundle"],
    nursingActions: ["Initiate Surviving Sepsis Campaign 1-hour bundle immediately", "Titrate vasopressors to maintain MAP ≥ 65 mmHg", "Monitor lactate clearance (target > 10% decrease every 2 hours)", "Assess for end-organ dysfunction using SOFA score components", "Monitor for DIC (petechiae, oozing, prolonged clotting times)", "Reassess volume status using dynamic measures (PLR, pulse pressure variation)", "Monitor glucose and initiate insulin protocol for persistent hyperglycemia > 180", "Evaluate antibiotic efficacy at 48-72 hours and recommend de-escalation"],
    signs: {
      left: ["qSOFA: RR >22, Altered Mental Status, SBP <100", "Lactate > 2", "Hyperglycemia (Stress)", "Oliguria"],
      right: ["Vasopressor dependence", "Mottling (Knee score)", "Platelets < 100k", "Creatinine > 2.0"]
    },
    medications: [
      { name: "Vasopressin", type: "V1 Agonist", action: "Splanchnic vasoconstriction", sideEffects: "Gut ischemia", contra: "Active CAD", pearl: "Second-line pressor. Sparing effect on Norepinephrine dose." },
      { name: "Hydrocortisone", type: "Corticosteroid", action: "Anti-inflammatory / Mineralocorticoid", sideEffects: "Hyperglycemia", contra: "Systemic fungal infection", pearl: "Used in refractory septic shock (200mg/day)." }
    ],
    pearls: ["Start broad-spectrum antibiotics within 1 hour (Surviving Sepsis)", "30mL/kg crystalloid bolus for hypotension/lactate > 4", "Reassess volume status frequently (dynamic measures preferred)"],
    quiz: [{ question: "Which mechanism explains the microvascular thrombosis seen in severe sepsis?", options: ["Platelet destruction", "Suppression of Fibrinolysis (PAI-1)", "Vitamin K deficiency", "Excessive Heparin"], correct: 1, rationale: "Sepsis increases Plasminogen Activator Inhibitor-1 (PAI-1), suppressing fibrinolysis while coagulation is activated, leading to disseminated clots." }]
  },
  "siadh-di-np": {
    title: "Sodium Disorders: Osmoregulation",
    cellular: { 
      title: "Arginine Vasopressin (AVP) Pathophysiology", 
      content: "SIADH: Ectopic or inappropriate AVP release leads to insertion of Aquaporin-2 channels in the collecting duct, causing pure water retention (Euvolemic Hyponatremia). \nDI: Lack of AVP (Central) or renal resistance (Nephrogenic) prevents water reabsorption, leading to massive dilute urine output." 
    },
    riskFactors: ["Small cell lung cancer (SIADH: ectopic ADH)", "Traumatic brain injury (central DI)", "Pituitary surgery (transient or permanent DI)", "CNS infections (meningitis, encephalitis)", "Medications: SSRIs, carbamazepine, cyclophosphamide (SIADH)", "Lithium therapy (nephrogenic DI)", "Guillain-Barré syndrome", "Positive pressure ventilation"],
    diagnostics: ["Order serum osmolality to confirm hypotonicity (SIADH) or hypertonicity (DI)", "Order urine osmolality and urine sodium simultaneously with serum studies", "Order serum sodium every 4-6 hours during active correction", "Order water deprivation test to differentiate central from nephrogenic DI", "Order DDAVP stimulation test (urine concentrates in central DI, not nephrogenic)", "Order cortisol and TSH to rule out adrenal insufficiency and hypothyroidism", "Order chest imaging and CT head for SIADH etiology workup", "Order copeptin level (emerging biomarker for AVP activity)"],
    management: ["Prescribe 3% Hypertonic Saline for symptomatic hyponatremia (max correction 8-10 mEq/L in 24h)", "Order fluid restriction (800-1000 mL/day) for euvolemic SIADH", "Prescribe Tolvaptan (Vaptan) for chronic SIADH unresponsive to fluid restriction", "Prescribe DDAVP for central DI (titrate to urine output and thirst)", "Order free water replacement for hypernatremic DI patients", "Prescribe Thiazide diuretics paradoxically for nephrogenic DI", "Discontinue offending medications if drug-induced", "Consult endocrinology for refractory or complex cases"],
    nursingActions: ["Monitor serum sodium correction rate every 2-4 hours during active treatment", "Calculate free water deficit for DI and monitor replacement", "Titrate 3% saline infusion rate based on sodium response", "Monitor for osmotic demyelination syndrome (dysarthria, dysphagia, quadriparesis)", "Assess neurological status hourly during acute correction (seizure risk in SIADH)", "Monitor strict intake and output with hourly urine measurements", "Evaluate urine specific gravity and osmolality trends", "Implement seizure precautions for patients with Na < 120 mEq/L"],
    signs: {
      left: ["SIADH: Serum Osm < 275", "Urine Osm > 100", "Urine Na > 40", "Euvolemia"],
      right: ["DI: Serum Osm > 295", "Urine Osm < 300", "Hypernatremia", "Polyuria (>3L/day)"]
    },
    medications: [
      { name: "3% Hypertonic Saline", type: "Hypertonic Crystalloid", action: "Rapidly raises Serum Na", sideEffects: "Osmotic Demyelination", contra: "Chronic hyponatremia (rapid correction)", pearl: "Max correction 8-10 mEq/L in 24h." },
      { name: "Desmopressin", type: "AVP Analogue", action: "V2 receptor agonist", sideEffects: "Hyponatremia", contra: "SIADH", pearl: "Dose titrated to urine output/thirst in Central DI." }
    ],
    pearls: ["Osmotic Demyelination Syndrome (ODS) is the risk of correcting chronic hyponatremia too fast", "Check Serum Osmolality to confirm hypotonicity first", "Vaptans (Tolvaptan) block V2 receptors in SIADH"],
    quiz: [{ question: "A patient with SIADH is corrected too rapidly with 3% saline. What is the dreaded complication?", options: ["Cerebral Edema", "Osmotic Demyelination Syndrome", "Pulmonary Embolism", "Renal Failure"], correct: 1, rationale: "Rapid correction causes water to rush out of brain cells, stripping the myelin sheath (Central Pontine Myelinolysis)." }]
  },
  "aaa-rupture-np": {
    title: "AAA: Pathogenesis & Management",
    cellular: { 
      title: "Matrix Metalloproteinases (MMPs)", 
      content: "Inflammation leads to upregulation of MMPs which degrade elastin and collagen in the aortic media. This structural weakening, combined with LaPlace's Law (Wall Tension = Pressure x Radius), creates a cycle of dilation. Rupture occurs when wall stress exceeds tensile strength." 
    },
    riskFactors: ["Age > 65 with smoking history", "Male sex", "First-degree relative with AAA", "Peripheral vascular disease", "Hypertension", "Hyperlipidemia", "COPD", "Connective tissue disorders"],
    diagnostics: ["Order CT angiography (CTA) for definitive diagnosis and surgical planning", "Order bedside ultrasound for rapid screening (diameter measurement)", "Order CBC, type and crossmatch, coagulation studies STAT for suspected rupture", "Order BMP and lactate to assess perfusion and acidosis", "Order arterial blood gas for acid-base status", "Order serial abdominal imaging to monitor growth rate (>0.5 cm/year is concerning)", "Order preoperative cardiac risk assessment (stress testing if stable)"],
    management: ["Prescribe Esmolol or Labetalol drip for BP control (target SBP < 120 mmHg)", "Implement permissive hypotension (SBP 70-90) for ruptured AAA until surgical control", "Activate massive transfusion protocol for ruptured AAA", "Consult vascular surgery emergently for rupture or diameter > 5.5 cm", "Order Endovascular Aneurysm Repair (EVAR) vs open repair based on anatomy", "Prescribe opioid analgesia for pain (reduce sympathetic surge)", "Prescribe antiplatelet and statin therapy for atherosclerotic risk reduction", "Order ICU admission for hemodynamic monitoring post-repair"],
    nursingActions: ["Monitor hemodynamic status continuously with arterial line", "Titrate antihypertensive infusions to maintain ordered BP parameters", "Monitor for signs of rupture (sudden back/abdominal pain, hypotension, tachycardia)", "Assess distal pulses and perfusion bilaterally every 1-2 hours", "Administer blood products per massive transfusion protocol as ordered", "Monitor for post-EVAR complications (endoleak, limb ischemia, renal impairment)", "Monitor urine output hourly (renal perfusion indicator)", "Maintain large-bore IV access (2 sites minimum) for potential massive hemorrhage"],
    signs: {
      left: ["Pulsatile mass", "Grey Turner's Sign (Flank ecchymosis)", "Cullen's Sign (Periumbilical)", "Femoral bruit"],
      right: ["Hypotension + Back Pain = Rupture", "Loss of distal pulses", "Mottling", "Profound Acidosis"]
    },
    medications: [
      { name: "Esmolol", type: "Beta-1 Blocker", action: "Lowers HR/BP (Shear stress)", sideEffects: "Bradycardia", contra: "Acute Decompensated HF", pearl: "Titratable infusion. Goal SBP < 120." },
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Stabilizes clot", sideEffects: "Seizures (high dose)", contra: "Active intravascular clotting", pearl: "Consider in massive transfusion protocols." }
    ],
    pearls: ["Permissive hypotension (SBP 70-90) until control is achieved to prevent clot blowout", "Endovascular Aneurysm Repair (EVAR) vs Open", "Control pain/anxiety to reduce sympathetic surge"],
    quiz: [{ question: "According to LaPlace's Law, as the aneurysm radius increases, what happens to wall tension?", options: ["Decreases", "Increases", "Stays the same", "Becomes zero"], correct: 1, rationale: "Wall Tension = Pressure × Radius. A larger radius increases tension, increasing rupture risk." }]
  },
  "dka-hhns-np": {
    title: "DKA/HHS: Anion Gap & Osmolality",
    cellular: { 
      title: "Insulin Deficiency", 
      content: "DKA: Absolute insulin deficiency leads to lipolysis. Free fatty acids are oxidized to ketone bodies (beta-hydroxybutyrate), causing metabolic acidosis. \nHHS: Relative insulin deficiency prevents ketosis but severe hyperglycemia causes massive osmotic diuresis and hyperosmolar state." 
    },
    riskFactors: ["Type 1 diabetes (DKA primary)", "Type 2 diabetes (HHS primary)", "Infection (most common precipitant)", "Medication non-adherence", "New-onset diabetes", "Corticosteroid use", "Myocardial infarction", "Pancreatitis", "Substance abuse", "Eating disorders"],
    diagnostics: ["Order ABG to assess pH and degree of acidosis", "Order comprehensive metabolic panel (calculate anion gap: Na - [Cl + HCO3])", "Order serum ketones (beta-hydroxybutyrate preferred over urine ketones)", "Order serum osmolality (effective osm > 320 in HHS)", "Order phosphate and magnesium levels (depleted with insulin therapy)", "Order urinalysis, blood cultures, CXR to identify precipitant", "Order serial potassium every 1-2 hours during insulin infusion", "Order HbA1c to assess chronic glycemic control"],
    management: ["Prescribe aggressive IV fluid resuscitation: NS 1-1.5L/hr initially, then 250-500 mL/hr", "Prescribe Regular Insulin infusion 0.1-0.14 units/kg/hr (DO NOT start until K+ > 3.3)", "Order potassium replacement: 20-40 mEq/L in IV fluids to maintain K+ 4-5 mEq/L", "Add D5 to IV fluids when glucose < 200 (DKA) or < 300 (HHS) to prevent hypoglycemia", "Order bicarbonate only if pH < 6.9 (controversial)", "Order phosphate replacement if < 1.0 mg/dL", "Identify and treat precipitating cause (infection, MI, medication non-adherence)", "Transition to subcutaneous insulin with overlap of 1-2 hours before stopping drip"],
    nursingActions: ["Monitor blood glucose every 1 hour during insulin infusion", "Monitor serum potassium every 1-2 hours and replace per protocol", "Calculate and trend anion gap to guide resolution (not just glucose)", "Monitor neurological status for cerebral edema (especially pediatric patients)", "Maintain strict intake and output with hourly documentation", "Monitor for hypokalemia signs during insulin therapy (ECG changes, weakness)", "Assess fluid status frequently (edema, crackles, JVD from aggressive resuscitation)", "Ensure smooth transition to subcutaneous insulin before discontinuing drip"],
    signs: {
      left: ["DKA: Kussmaul Respirations", "Fruity Breath", "Anion Gap > 12", "pH < 7.3"],
      right: ["HHS: Glucose > 600", "Serum Osm > 320", "Profound Dehydration", "Altered Mental Status"]
    },
    medications: [
      { name: "Regular Insulin", type: "Short-acting", action: "Drives Glucose/K+ into cells", sideEffects: "Hypoglycemia/Hypokalemia", contra: "K+ < 3.3", pearl: "Wait until K+ > 3.3 to start insulin." },
      { name: "Potassium Chloride", type: "Electrolyte", action: "Repletion", sideEffects: "Arrhythmias", contra: "Hyperkalemia", pearl: "Insulin causes rapid intracellular K+ shift." }
    ],
    pearls: ["Close the Anion Gap, don't just fix the glucose", "Add Dextrose to fluids when Glucose < 200 to prevent hypoglycemia while clearing ketones", "Cerebral edema risk in children if Osm drops too fast"],
    quiz: [{ question: "Why must potassium be > 3.3 before starting insulin in DKA?", options: ["Insulin is ineffective otherwise", "Insulin drives K+ into cells, risking lethal arrhythmias", "K+ prevents hypoglycemia", "It increases pH"], correct: 1, rationale: "Insulin shifts K+ intracellularly. Starting it in a hypokalemic patient can cause fatal cardiac arrest." }]
  },
  "increased-icp-np": {
    title: "ICP: Cerebral Perfusion Pressure",
    cellular: { 
      title: "Autoregulation Failure", 
      content: "Cerebral Blood Flow (CBF) is autoregulated. When ICP rises, MAP must rise to maintain CPP (CPP = MAP - ICP). If ICP exceeds MAP, perfusion stops. Brain herniation (Uncal, Tonsillar) causes mechanical compression of the brainstem." 
    },
    riskFactors: ["Traumatic brain injury (GCS ≤ 8)", "Intracerebral hemorrhage", "Large territory ischemic stroke", "Brain tumor with mass effect", "Meningitis/encephalitis", "Status epilepticus", "Hepatic encephalopathy (grade III-IV)", "Post-craniotomy"],
    diagnostics: ["Order CT head without contrast STAT for acute changes", "Order ICP monitoring (EVD or intraparenchymal bolt) for GCS ≤ 8", "Order continuous EEG for seizure monitoring", "Order ABG to manage PaCO2 (target 35-40 mmHg, or 30-35 for acute herniation)", "Order serum osmolality to guide hyperosmolar therapy", "Order serum sodium every 4-6 hours during hypertonic saline infusion", "Order MRI brain when stable to evaluate extent of injury", "Order cerebral perfusion studies (CT perfusion or TCD) for vasospasm"],
    management: ["Prescribe Hypertonic Saline (3% or 23.4%) for acute ICP crisis", "Order Mannitol 20% (0.25-1 g/kg) for osmotic diuresis if euvolemic", "Prescribe Propofol or Midazolam infusion for metabolic suppression", "Order EVD placement for CSF drainage and continuous ICP monitoring", "Prescribe targeted temperature management (36-37°C) to reduce metabolic demand", "Order decompressive craniectomy consultation for refractory ICP > 25 mmHg", "Prescribe Levetiracetam or Phenytoin for seizure prophylaxis", "Manage CPP target > 60 mmHg with vasopressors if needed"],
    nursingActions: ["Monitor ICP continuously and calculate CPP (CPP = MAP - ICP) hourly", "Maintain HOB at 30 degrees with head in midline position", "Titrate hyperosmolar therapy based on ICP values and serum osmolality", "Monitor for signs of herniation (pupil changes, Cushing's triad, posturing)", "Minimize stimulation and cluster nursing care to prevent ICP spikes", "Monitor and manage PaCO2 via ventilator settings (avoid hyperventilation unless herniating)", "Assess neurological status using GCS every 1-2 hours", "Monitor for diabetes insipidus post-craniotomy (sudden polyuria, rising serum Na)"],
    signs: {
      left: ["Headache", "Vomiting", "Papilledema", "CN VI Palsy"],
      right: ["Cushing's Reflex (HTN, Brady, Irregular RR)", "Fixed/Dilated Pupil (Uncal)", "Decerebrate Posturing", "Apnea"]
    },
    medications: [
      { name: "Hypertonic Saline (3% or 23.4%)", type: "Osmotic Agent", action: "Pulls water from brain", sideEffects: "Hypernatremia", contra: "Fluid overload", pearl: "Preferred over Mannitol in hypotensive patients." },
      { name: "Propofol", type: "Sedative", action: "Reduces CMRO2", sideEffects: "Hypotension", contra: "Egg allergy", pearl: "Metabolic suppression reduces blood flow demand." }
    ],
    pearls: ["Target CPP > 60 mmHg", "Hyperventilation (CO2 30-35) is a temporary bridge (vasoconstriction reduces ICP but risks ischemia)", "Keep HOB 30 degrees, head midline"],
    quiz: [{ question: "How does hyperventilation lower ICP?", options: ["Increases oxygen delivery", "Causes cerebral vasoconstriction", "Increases venous return", "Lowers blood pressure"], correct: 1, rationale: "Hypocapnia (low CO2) causes cerebral vasoconstriction, reducing cerebral blood volume and ICP temporarily." }]
  },
  "copd-exacerbation-np": {
    title: "COPD: Cellular Mechanisms",
    cellular: { 
      title: "Protease-Antiprotease Imbalance", 
      content: "Cigarette smoke activates neutrophils/macrophages, releasing proteases (elastase) that destroy alveolar walls (Emphysema). Chronic Bronchitis involves goblet cell hyperplasia and mucus plugging. V/Q mismatch leads to hypoxemia and hypercapnia." 
    },
    riskFactors: ["Smoking history > 20 pack-years", "Previous exacerbation requiring hospitalization", "FEV1 < 50% predicted", "Frequent exacerbations (≥ 2/year)", "Cor pulmonale", "Long-term oxygen therapy dependence", "Concurrent cardiac disease", "Alpha-1 antitrypsin deficiency"],
    diagnostics: ["Order ABG to assess respiratory acidosis and oxygenation status", "Order CXR to rule out pneumonia, pneumothorax, or pleural effusion", "Order CBC with differential (leukocytosis suggests infection)", "Order BNP to differentiate from heart failure exacerbation", "Order sputum culture and sensitivity if purulent sputum", "Order procalcitonin to guide antibiotic therapy", "Order spirometry (FEV1/FVC) when stable to assess severity", "Order alpha-1 antitrypsin level if age < 45 or non-smoker"],
    management: ["Prescribe short-acting bronchodilators: Albuterol + Ipratropium nebulization", "Prescribe systemic corticosteroids (Prednisone 40mg x 5 days per GOLD guidelines)", "Prescribe antibiotics if purulent sputum or requiring mechanical ventilation", "Order BiPAP for hypercapnic respiratory failure (pH < 7.35, PaCO2 > 45)", "Prescribe controlled oxygen therapy (target SpO2 88-92% to maintain hypoxic drive)", "Order intubation and mechanical ventilation for respiratory failure unresponsive to NIV", "Prescribe LABA/LAMA/ICS combination for maintenance therapy post-exacerbation", "Consult pulmonology for refractory cases or lung volume reduction candidacy"],
    nursingActions: ["Monitor ABG values and titrate oxygen to SpO2 88-92%", "Assess respiratory status continuously (RR, depth, accessory muscle use, mental status)", "Monitor for CO2 narcosis (asterixis, somnolence, confusion)", "Titrate BiPAP settings to improve ventilation and patient comfort", "Evaluate response to bronchodilator therapy (peak flow, breath sounds)", "Monitor for complications of NIV (gastric distension, aspiration, skin breakdown)", "Assess for signs of cor pulmonale (JVD, peripheral edema, hepatomegaly)", "Coordinate pulmonary rehabilitation referral and smoking cessation counseling"],
    signs: {
      left: ["Accessory muscle use", "Pursed-lip breathing", "Prolonged expiration", "Wheezing"],
      right: ["Pulsus Paradoxus", "Asterixis (CO2 narcosis)", "Central Cyanosis", "Cor Pulmonale (RHF)"]
    },
    medications: [
      { name: "BiPAP", type: "NIV Support", action: "Decreases work of breathing", sideEffects: "Aspiration", contra: "Coma/Vomiting", pearl: "First-line for hypercapnic respiratory failure." },
      { name: "Azithromycin", type: "Macrolide", action: "Anti-inflammatory/Antibiotic", sideEffects: "QT prolongation", contra: "Arrhythmias", pearl: "Used for anti-inflammatory properties in exacerbations." }
    ],
    pearls: ["Permissive Hypercapnia: Tolerate high CO2 if pH > 7.25", "Avoid intubation if possible (difficult to wean)", "Target SpO2 88-92% to maintain hypoxic drive"],
    quiz: [{ question: "What is the primary indication for BiPAP in COPD exacerbation?", options: ["Hypoxemia", "Respiratory Acidosis (pH < 7.35)", "Comfort", "Pneumonia"], correct: 1, rationale: "BiPAP improves ventilation, helps blow off CO2, and reverses respiratory acidosis." }]
  },
  "aki-management-np": {
    title: "AKI: RIFLE Criteria & Dialysis",
    cellular: { 
      title: "Tubular Necrosis & GFR", 
      content: "Ischemia or toxins cause sloughing of tubular epithelial cells, obstructing tubules (muddy brown casts). Afferent arteriolar constriction (Pre-renal) reduces GFR. Post-renal obstruction increases Bowman's capsule pressure, halting filtration." 
    },
    riskFactors: ["Sepsis (most common cause of AKI in ICU)", "Major surgery (especially cardiac)", "Contrast dye administration", "Nephrotoxic drugs (vancomycin, aminoglycosides, amphotericin B)", "Rhabdomyolysis", "Cardiorenal syndrome", "Hepatorenal syndrome", "Tumor lysis syndrome", "Abdominal compartment syndrome"],
    diagnostics: ["Order BMP with creatinine trending every 6-12 hours", "Order urinalysis with microscopy (muddy brown casts = ATN)", "Calculate FeNa (< 1% = pre-renal, > 2% = intrinsic/ATN)", "Order renal ultrasound to rule out post-renal obstruction", "Order urine electrolytes (Na, Cr) for FeNa calculation", "Order CK and myoglobin if rhabdomyolysis suspected", "Apply RIFLE/AKIN/KDIGO criteria for staging", "Order nephrology consultation for AKIN Stage 2 or higher"],
    management: ["Prescribe aggressive IV fluid resuscitation for pre-renal AKI", "Discontinue all nephrotoxic medications (NSAIDs, ACE inhibitors, aminoglycosides)", "Prescribe Calcium Gluconate 1g IV for hyperkalemic ECG changes", "Order insulin + D50 for potassium shifting (10 units Regular + 25g D50)", "Prescribe sodium bicarbonate for metabolic acidosis with pH < 7.2", "Order emergent dialysis for AEIOU indications (Acidosis, Electrolytes, Intoxication, Overload, Uremia)", "Prescribe N-acetylcysteine and IV hydration for contrast-induced nephropathy prevention", "Consult interventional radiology for ureteral stent if post-renal obstruction"],
    nursingActions: ["Monitor urine output hourly (target > 0.5 mL/kg/hr)", "Trend creatinine and BUN values to assess progression vs recovery", "Monitor potassium levels and correlate with ECG findings", "Assess fluid balance meticulously (daily weights, I&O, edema assessment)", "Monitor for uremic symptoms (pericardial friction rub, encephalopathy, bleeding)", "Evaluate medication doses requiring renal adjustment", "Prepare patient for dialysis access and procedure when indicated", "Monitor for diuretic phase (massive output requiring aggressive fluid/electrolyte replacement)"],
    signs: {
      left: ["Oliguria", "Azotemia (High BUN)", "Edema", "Acidosis"],
      right: ["Uremic Pericarditis (Friction rub)", "Encephalopathy", "Hyperkalemia > 6.5", "Pulmonary Edema"]
    },
    medications: [
      { name: "Calcium Gluconate", type: "Membrane Stabilizer", action: "Protects myocardium", sideEffects: "Hypercalcemia", contra: "Digoxin toxicity (caution)", pearl: "First line for hyperkalemic EKG changes." },
      { name: "Furosemide (Stress Test)", type: "Loop Diuretic", action: "Assess tubular function", sideEffects: "Ototoxicity", contra: "Anuria", pearl: "If no response to high dose, stop (don't flog the kidneys)." }
    ],
    pearls: ["Indications for Dialysis (AEIOU): Acidosis, Electrolytes (K+), Intoxication, Overload, Uremia", "FeNa < 1% = Pre-renal; FeNa > 2% = ATN", "Avoid nephrotoxins (NSAIDs, ACEi, Contrast)"],
    quiz: [{ question: "Which finding is an absolute indication for emergent dialysis?", options: ["Creatinine of 4.0", "BUN of 80", "Refractory Hyperkalemia", "Oliguria"], correct: 2, rationale: "Refractory hyperkalemia that doesn't respond to medical management is lethal and requires immediate dialysis." }]
  },
  "tumor-lysis-np": {
    title: "Tumor Lysis Syndrome: Uric Acid Crisis",
    cellular: { 
      title: "Massive Cellular Destruction", 
      content: "Oncologic emergency where cancer treatment destroys a large number of cells rapidly, releasing intracellular potassium, phosphate, and nucleic acids into circulation. Nucleic acids are metabolized to uric acid, which precipitates in renal tubules, causing acute kidney injury (AKI)." 
    },
    riskFactors: ["High tumor burden (bulky disease)", "Rapidly proliferating malignancies (Burkitt lymphoma, ALL)", "Elevated pre-treatment LDH and uric acid", "Pre-existing renal impairment", "Dehydration", "Chemotherapy initiation (24-72 hours post)", "High white cell count (> 50,000)"],
    diagnostics: ["Order BMP every 6-8 hours (K+, phosphorus, calcium, creatinine, uric acid)", "Order LDH as a marker of cell turnover and tumor burden", "Order uric acid level every 6-8 hours during active lysis", "Order ECG for hyperkalemia assessment (peaked T waves, widened QRS)", "Order urinalysis to assess for uric acid crystals and renal tubular damage", "Calculate calcium x phosphate product (> 60 = calcification risk)", "Order ABG for metabolic acidosis assessment", "Consult nephrology early for potential dialysis need"],
    management: ["Prescribe aggressive IV hydration at 3 L/m2/day starting 24-48 hours before chemotherapy", "Prescribe Rasburicase for high-risk patients (rapidly lowers uric acid)", "Prescribe Allopurinol for prophylaxis in moderate-risk patients", "Order Calcium Gluconate IV for symptomatic hypocalcemia", "Prescribe sodium polystyrene sulfonate or insulin/D50 for hyperkalemia", "Order dialysis for refractory hyperkalemia, hyperphosphatemia, or oliguric AKI", "Avoid urine alkalinization if phosphate is elevated (calcium phosphate precipitation)", "Adjust chemotherapy dosing based on TLS risk stratification"],
    nursingActions: ["Monitor electrolytes every 6-8 hours during high-risk period (24-72h post-chemo)", "Monitor cardiac rhythm continuously for hyperkalemia-related arrhythmias", "Maintain strict intake and output with hourly urine measurements", "Assess for signs of hypocalcemia (Chvostek sign, Trousseau sign, tetany, seizures)", "Monitor renal function and urine output for AKI development", "Administer Rasburicase per protocol (do NOT put blood sample on ice: falsely lowers uric acid)", "Evaluate for neuromuscular symptoms (muscle cramps, weakness, paresthesias)", "Coordinate with oncology for chemotherapy timing adjustments based on labs"],
    signs: {
      left: ["Hyperkalemia (Arrhythmias)", "Hyperphosphatemia", "Hypocalcemia (Tetany/Seizures)", "Hyperuricemia"],
      right: ["Oliguria / Anuria", "Flank Pain", "Lethargy", "EKG Changes (Peaked T)"]
    },
    medications: [
      { name: "Rasburicase", type: "Recombinant Urate Oxidase", action: "Converts uric acid to allantoin", sideEffects: "Anaphylaxis", contra: "G6PD Deficiency", pearl: "Rapidly lowers uric acid (more effective than Allopurinol)." },
      { name: "Allopurinol", type: "Xanthine Oxidase Inhibitor", action: "Prevents uric acid formation", sideEffects: "Rash (SJS)", contra: "Hypersensitivity", pearl: "Used for prophylaxis, not acute treatment." }
    ],
    pearls: ["Aggressive hydration (3L/m2/day) is the cornerstone of prevention", "Keep urine pH > 7.0 (alkalinization controversy)", "Monitor Calcium x Phosphate product > 60 (Risk of calcification)"],
    quiz: [{ question: "A patient with TLS has a uric acid level of 10 mg/dL. Which medication is best for rapid correction?", options: ["Allopurinol", "Rasburicase", "Furosemide", "Kayexalate"], correct: 1, rationale: "Rasburicase actively breaks down existing uric acid, whereas Allopurinol only prevents the formation of new uric acid." }]
  },
  "transfusion-reactions-np": {
    title: "Transfusion Reactions: Hemolytic vs Febrile",
    cellular: { 
      title: "Antibody-Mediated Hypersensitivity", 
      content: "Acute Hemolytic: ABO incompatibility leads to IgM antibodies attacking donor RBCs, causing complement activation, massive hemolysis, and inflammatory cytokine release (Shock/DIC). \nFebrile Non-Hemolytic: Cytokines released from donor leukocytes accumulate during storage." 
    },
    riskFactors: ["Previous transfusion reaction history", "Multiple prior transfusions", "IgA deficiency (anaphylaxis risk)", "Alloimmunization", "Immunocompromised state", "Emergency transfusion without full crossmatch", "Chronic transfusion dependence"],
    diagnostics: ["Order direct antiglobulin test (DAT/Direct Coombs) for hemolytic reaction", "Order free hemoglobin (serum and urine) to confirm hemolysis", "Order haptoglobin (decreased in hemolysis)", "Order repeat type and crossmatch to identify antibodies", "Order DIC panel (fibrinogen, D-dimer, PT/PTT) for acute hemolytic reaction", "Order CBC with peripheral smear (schistocytes indicate MAHA)", "Order urinalysis for hemoglobinuria", "Order tryptase level for anaphylactic reaction"],
    management: ["STOP transfusion immediately and disconnect blood product from IV line", "Prescribe Epinephrine 0.3-0.5 mg IM for anaphylactic reaction", "Order aggressive IV normal saline to maintain renal perfusion (hemolytic reaction)", "Prescribe Diphenhydramine and Hydrocortisone for allergic reactions", "Prescribe Acetaminophen for febrile non-hemolytic reactions (pre-medication for future)", "Order leukocyte-reduced or washed blood products for future transfusions", "Order IgA-deficient blood products for patients with IgA deficiency", "Consult blood bank/transfusion medicine for workup and future product recommendations"],
    nursingActions: ["Discontinue transfusion immediately at first sign of any reaction", "Maintain IV access with normal saline (new tubing, not through blood tubing)", "Send blood bag and tubing to blood bank per protocol for investigation", "Collect post-reaction blood and urine specimens as ordered", "Monitor vital signs every 5-15 minutes during acute reaction", "Monitor urine output hourly (maintain > 100 mL/hr for hemolytic reaction to prevent AKI)", "Document reaction details: time of onset, volume infused, symptoms, interventions", "Monitor for delayed hemolytic reaction (2-14 days post-transfusion: fever, falling Hgb, jaundice)"],
    signs: {
      left: ["Hemolytic: Flank/Back Pain", "Dark Red Urine (Hemoglobinuria)", "Hypotension + Tachycardia", "Positive Direct Coombs"],
      right: ["Febrile: Fever + Chills (within 4h)", "Malaise", "No hemolysis/red urine", "Anaphylactic: Wheezing, Hives, Shock"]
    },
    medications: [
      { name: "Epinephrine", type: "Alpha/Beta Agonist", action: "Vasoconstriction/Bronchodilation", sideEffects: "Tachycardia", contra: "None in anaphylaxis", pearl: "First line for Anaphylactic reaction." },
      { name: "Acetaminophen", type: "Antipyretic", action: "Lowers set point", sideEffects: "Hepatotoxicity", contra: "Liver failure", pearl: "Pre-medication for Febrile Non-Hemolytic reactions." }
    ],
    pearls: ["STOP the transfusion immediately for any reaction", "Hemolytic reaction causes AKI via hemoglobin precipitation in tubules", "Anaphylactic reaction is due to IgA deficiency (anti-IgA antibodies)"],
    quiz: [{ question: "A patient receiving blood complains of sudden severe back pain and has dark urine. What is the reaction?", options: ["Febrile Non-Hemolytic", "Acute Hemolytic", "Anaphylactic", "TRALI"], correct: 1, rationale: "Flank/back pain and hemoglobinuria (dark urine) are classic signs of acute hemolysis (kidney damage from lysed RBCs)." }]
  },
  "wound-vac-np": {
    title: "Negative Pressure Wound Therapy",
    cellular: { 
      title: "Microstrain & Angiogenesis", 
      content: "NPWT applies sub-atmospheric pressure to the wound bed. This removes exudate/infectious material, reduces edema, and creates 'microstrain' on cells which stimulates mitosis, angiogenesis (new blood vessels), and granulation tissue formation." 
    },
    riskFactors: ["Chronic wounds (diabetic ulcers, venous stasis)", "Post-surgical wound dehiscence", "Traumatic wounds with tissue loss", "Pressure injuries stage III-IV", "Malnutrition (albumin < 3.0)", "Peripheral vascular disease", "Immunosuppression", "Obesity"],
    diagnostics: ["Order wound culture and sensitivity for signs of infection", "Order prealbumin and albumin to assess nutritional status for wound healing", "Order ABI (ankle-brachial index) for lower extremity vascular assessment", "Order tissue biopsy if wound bed appears abnormal or non-healing", "Order vascular duplex ultrasound if peripheral vascular disease suspected", "Order HbA1c for diabetic wound patients (poor control impairs healing)", "Order transcutaneous oxygen measurement (TcPO2) to assess healing potential", "Order wound photography and serial measurements for documentation"],
    management: ["Prescribe NPWT at -75 to -125 mmHg continuous or intermittent per wound type", "Order debridement of necrotic tissue before NPWT application (contraindicated over eschar)", "Prescribe nutritional supplementation (high protein, Vitamin C, Zinc)", "Order wound bed preparation with appropriate dressings (white foam for granulation, black for debridement)", "Consult wound care specialist for complex or non-healing wounds", "Prescribe systemic antibiotics for cellulitis or wound sepsis (not for colonization alone)", "Order vascular surgery consultation for ischemic wounds", "Prescribe topical growth factors (Becaplermin) for refractory diabetic ulcers"],
    nursingActions: ["Assess NPWT seal integrity and troubleshoot air leaks", "Monitor wound bed appearance and drainage characteristics at each dressing change", "Measure and document wound dimensions (length, width, depth, undermining, tunneling)", "Assess periwound skin for maceration, excoriation, or contact dermatitis", "Monitor for bleeding complications (especially in anticoagulated patients)", "Titrate NPWT pressure settings based on wound response and patient tolerance", "Coordinate dressing changes with pain management (pre-medicate 30 minutes prior)", "Evaluate nutritional status and advocate for dietician consultation"],
    signs: {
      left: ["Beefy Red Granulation (Good)", "Reduced Edema", "Decreased Wound Dimensions", "Intact Seal"],
      right: ["Air Leak (Machine Alarm)", "Bleeding (Anticoagulants)", "Maceration of Peri-wound", "Necrotic Tissue (Contraindication)"]
    },
    medications: [
      { name: "Becaplermin", type: "PDGF Gel", action: "Stimulates cell migration", sideEffects: "Malignancy warning", contra: "Neoplasm at site", pearl: "Recombinant Platelet-Derived Growth Factor for diabetic ulcers." }
    ],
    pearls: ["Foam must be cut to fit exactly (don't overlap intact skin)", "Maintain airtight seal (use drape)", "Stop if frank bleeding occurs"],
    quiz: [{ question: "How does Negative Pressure Wound Therapy primarily promote healing?", options: ["Drying out the wound", "Removing healthy tissue", "Stimulating angiogenesis and reducing edema", "Applying antibiotics"], correct: 2, rationale: "The suction removes interstitial fluid (edema) allowing blood flow, and the mechanical stress stimulates new blood vessel growth." }]
  },
  "hellp-syndrome-np": {
    title: "HELLP Syndrome: Hepatic Cascade",
    image: getAssetUrl("hellpsyndrome_1773340513136.png"),
    cellular: { title: "Hepatic Microangiopathy", content: "HELLP (Hemolysis, Elevated Liver enzymes, Low Platelets) represents severe end of preeclampsia spectrum. Endothelial dysfunction triggers platelet activation and fibrin deposition in hepatic sinusoids. Microangiopathic hemolytic anemia (MAHA) destroys RBCs as they traverse damaged vasculature. Hepatocyte necrosis from ischemia can progress to subcapsular hematoma and hepatic rupture." },
    riskFactors: ["Preeclampsia/eclampsia", "Previous HELLP syndrome", "Multiparity", "Age > 25 years", "White ethnicity", "History of hypertensive disorders", "Autoimmune conditions (antiphospholipid syndrome)"],
    diagnostics: ["Order CBC with peripheral smear (schistocytes confirm MAHA)", "Order LDH, AST, ALT for hepatic involvement", "Order haptoglobin (low confirms hemolysis)", "Order coagulation studies (PT, PTT, fibrinogen) for DIC assessment", "Order hepatic ultrasound to evaluate for subcapsular hematoma", "Order urine protein-to-creatinine ratio", "Order type and crossmatch for potential transfusion", "Apply Mississippi classification using platelet nadir for severity grading"],
    management: ["Prescribe Magnesium Sulfate for seizure prophylaxis (4-6g loading, 1-2g/hr maintenance)", "Prescribe Labetalol or Hydralazine for acute hypertension (target SBP < 160, DBP < 110)", "Order Dexamethasone for platelet improvement (controversial)", "Plan delivery as definitive treatment regardless of gestational age", "Order platelet transfusion if count < 20,000 or before cesarean if < 50,000", "Prescribe blood products as needed (pRBC, FFP, cryoprecipitate for DIC)", "Consult maternal-fetal medicine and anesthesia", "Monitor for hepatic rupture (surgical emergency requiring laparotomy)"],
    nursingActions: ["Monitor MgSO4 infusion: assess DTRs, respiratory rate (>12), urine output (>30mL/hr)", "Monitor platelet count and coagulation studies every 6-12 hours", "Assess for RUQ/epigastric pain (hepatic capsule distention)", "Monitor for signs of DIC (oozing from IV sites, petechiae, ecchymosis)", "Have Calcium Gluconate at bedside as MgSO4 antidote", "Monitor BP continuously and titrate antihypertensives", "Prepare for emergent delivery at any time", "Monitor for postpartum worsening (HELLP can progress 24-48h after delivery)"],
    signs: {
      left: ["Epigastric/RUQ pain", "Nausea/Vomiting", "LDH > 600", "AST > 70"],
      right: ["Schistocytes on smear", "Platelets < 100k", "Haptoglobin < 25", "Subcapsular hepatic hematoma"]
    },
    medications: [
      { name: "Magnesium Sulfate", type: "Anticonvulsant", action: "Seizure prophylaxis, CNS depressant", sideEffects: "Respiratory depression, hypotension", contra: "Myasthenia gravis", pearl: "Monitor DTRs, respiratory rate, and urine output continuously." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "May improve platelet count temporarily (controversial)", sideEffects: "Hyperglycemia, immunosuppression", contra: "Active infection", pearl: "Mississippi classification uses platelet nadir for severity grading." },
      { name: "Labetalol", type: "Alpha/Beta Blocker", action: "BP control in severe features", sideEffects: "Bradycardia, bronchospasm", contra: "Asthma, heart block", pearl: "Target SBP < 160 and DBP < 110 to prevent stroke." }
    ],
    pearls: ["Delivery is the definitive treatment regardless of gestational age", "Mississippi classification grades severity by platelet nadir", "Monitor for DIC and hepatic rupture: life-threatening complications"],
    quiz: [{ question: "What lab finding differentiates HELLP from TTP?", options: ["Elevated fibrinogen", "Elevated liver enzymes with low platelets in setting of pregnancy", "Normal LDH with thrombocytosis", "Isolated anemia without hemolysis"], correct: 1, rationale: "HELLP is distinguished from TTP by the combination of elevated liver enzymes (hepatic involvement) with thrombocytopenia specifically in the context of pregnancy, whereas TTP typically shows normal liver enzymes." }]
  },
  "amniotic-fluid-embolism-np": {
    title: "Amniotic Fluid Embolism: DIC Pathway",
    cellular: { title: "Anaphylactoid Cascade", content: "Amniotic fluid containing fetal cells, vernix, and meconium enters maternal circulation through endocervical veins or placental site. This triggers massive complement activation and anaphylactoid response. Phase 1: Acute pulmonary vasospasm causing right heart failure and cardiogenic shock. Phase 2: Consumptive coagulopathy (DIC) from tissue factor release. Mortality approaches 60-80%." },
    riskFactors: ["Rapid/tumultuous labor", "Cesarean section", "Advanced maternal age", "Multiparity", "Placental abruption", "Eclampsia", "Cervical lacerations", "Amniotomy"],
    diagnostics: ["Diagnosis of exclusion: no definitive diagnostic test", "Order ABG for hypoxemia and acid-base assessment", "Order DIC panel (fibrinogen, D-dimer, PT/PTT, platelet count)", "Order echocardiogram for acute right heart failure assessment", "Order CXR for pulmonary edema pattern", "Order BNP/troponin for cardiac involvement", "Order CBC with peripheral smear", "Order thromboelastography (TEG) for real-time coagulation status"],
    management: ["Initiate ACLS protocol immediately with left uterine displacement", "Prescribe Epinephrine per cardiac arrest protocol", "Order massive transfusion protocol with cryoprecipitate (target fibrinogen > 200)", "Perform perimortem cesarean delivery within 4-5 minutes if cardiac arrest", "Order intubation and mechanical ventilation for respiratory failure", "Prescribe vasopressor support (Norepinephrine) for persistent hypotension", "Consult hematology for DIC management", "Consider ECMO for refractory cardiopulmonary failure"],
    nursingActions: ["Recognize sudden cardiovascular collapse during labor/delivery as potential AFE", "Initiate code blue and begin chest compressions with left uterine displacement", "Prepare for perimortem cesarean delivery within 4-5 minutes", "Administer blood products rapidly per massive transfusion protocol", "Monitor for DIC (Phase 2) and replace coagulation factors aggressively", "Document timeline of events meticulously for medicolegal purposes", "Coordinate simultaneous maternal resuscitation and neonatal resuscitation teams", "Provide emotional support to family during and after the emergency"],
    signs: {
      left: ["Sudden dyspnea/hypoxia", "Cardiovascular collapse", "Seizures", "Altered consciousness"],
      right: ["DIC (oozing from IV sites)", "Massive hemorrhage", "Pulmonary edema", "Cardiac arrest"]
    },
    medications: [
      { name: "Epinephrine", type: "Vasopressor/Inotrope", action: "Cardiac arrest protocol: restores cardiac output", sideEffects: "Tachycardia, hypertension", contra: "None in cardiac arrest", pearl: "Follow ACLS protocol with left uterine displacement for pregnant patients." },
      { name: "Cryoprecipitate", type: "Blood Product", action: "Fibrinogen replacement for DIC", sideEffects: "Transfusion reaction, volume overload", contra: "None in life-threatening DIC", pearl: "Target fibrinogen > 200 mg/dL; each unit raises fibrinogen ~5-10 mg/dL." },
      { name: "A-OK Protocol", type: "Investigational", action: "Atropine for bradycardia, Ondansetron (investigational), Ketorolac (investigational)", sideEffects: "Varies by component", contra: "Active bleeding (Ketorolac)", pearl: "Emerging protocol: not yet standard of care but gaining attention in case reports." }
    ],
    pearls: ["Diagnosis of exclusion: no definitive diagnostic test exists", "Immediate ACLS with left uterine displacement is critical", "Perimortem cesarean delivery within 4-5 minutes if cardiac arrest occurs"],
    quiz: [{ question: "What is the primary mechanism in Phase 1 of amniotic fluid embolism?", options: ["Consumptive coagulopathy", "Acute pulmonary vasospasm causing right heart failure", "Massive hemorrhage from uterine atony", "Anaphylaxis from fetal antigens"], correct: 1, rationale: "Phase 1 of AFE involves acute pulmonary vasospasm triggered by amniotic fluid entering the maternal circulation, leading to right heart failure and cardiogenic shock before DIC develops in Phase 2." }]
  },
  "eclampsia-np": {
    title: "Eclampsia: Endothelial Dysfunction",
    cellular: { title: "Trophoblast & Vascular Remodeling", content: "Abnormal trophoblast invasion of spiral arteries leads to incomplete remodeling and placental ischemia. Ischemic placenta releases anti-angiogenic factors (sFlt-1, sEng) that bind and neutralize VEGF and PlGF, causing systemic endothelial dysfunction. This leads to vasospasm, increased permeability, and end-organ damage. Cerebral vasospasm and posterior reversible encephalopathy syndrome (PRES) underlie seizures." },
    riskFactors: ["Nulliparity", "History of preeclampsia", "Multiple gestation", "Chronic hypertension", "Renal disease", "Autoimmune disorders", "Obesity", "Extremes of maternal age (< 20 or > 40)", "Family history of preeclampsia"],
    diagnostics: ["Order 24-hour urine protein or spot protein-to-creatinine ratio", "Order CBC with peripheral smear (rule out HELLP)", "Order LFTs, LDH, uric acid for end-organ assessment", "Order BMP (creatinine for renal function)", "Order coagulation studies for DIC screening", "Order sFlt-1/PlGF ratio (emerging predictive biomarker)", "Order MRI brain if PRES (posterior reversible encephalopathy syndrome) suspected", "Order ophthalmologic exam for papilledema or retinal changes"],
    management: ["Prescribe Magnesium Sulfate for seizure prophylaxis and treatment (4-6g IV load, 1-2g/hr)", "Prescribe Hydralazine 5-10mg IV or Labetalol 20mg IV for acute severe hypertension", "Prescribe Nifedipine 10mg PO as alternative antihypertensive", "Plan delivery as definitive treatment (timing based on gestational age and severity)", "Continue MgSO4 for 24-48 hours postpartum for seizure prophylaxis", "Prescribe low-dose Aspirin 81mg for prevention in subsequent pregnancies", "Consult maternal-fetal medicine for management of severe features", "Order ICU admission for eclamptic seizures or HELLP progression"],
    nursingActions: ["Monitor MgSO4 therapeutic levels (4-7 mEq/L) with DTRs, RR, and urine output", "Have Calcium Gluconate 1g IV at bedside as MgSO4 antidote at all times", "Monitor BP every 5-15 minutes during acute hypertensive crisis", "Assess for signs of end-organ damage (headache, vision changes, RUQ pain, oliguria)", "Maintain seizure precautions (padded side rails, suction, oxygen at bedside)", "Monitor fetal status continuously during acute episodes", "Assess for clonus (sustained ankle clonus indicates CNS irritability)", "Monitor for magnesium toxicity: loss of DTRs (8-12), respiratory arrest (15-17), cardiac arrest (>25)"],
    signs: {
      left: ["Severe HTN (>160/110)", "Proteinuria > 300mg/24h", "Headache unresponsive to analgesics", "Visual changes (scotomata)"],
      right: ["Tonic-clonic seizures", "PRES on MRI", "Pulmonary edema", "HELLP progression"]
    },
    medications: [
      { name: "Magnesium Sulfate", type: "Anticonvulsant", action: "Blocks NMDA receptors, causes vasodilation", sideEffects: "Loss of DTRs (8-12 mEq/L), respiratory arrest (15-17 mEq/L)", contra: "Myasthenia gravis, renal failure", pearl: "Therapeutic level 4-7 mEq/L. Cardiac arrest at >25 mEq/L. Antidote: Calcium Gluconate." },
      { name: "Hydralazine", type: "Vasodilator", action: "Direct arteriolar vasodilation for acute HTN", sideEffects: "Reflex tachycardia, headache", contra: "Coronary artery disease", pearl: "Give 5-10mg IV push; onset 10-20 minutes." },
      { name: "Nifedipine", type: "Calcium Channel Blocker", action: "Acute HTN management", sideEffects: "Headache, flushing, tachycardia", contra: "Use with caution alongside MgSO4", pearl: "Oral immediate-release 10mg; avoid sublingual route." }
    ],
    pearls: ["Mag toxicity antidote is Calcium Gluconate 1g IV", "sFlt-1/PlGF ratio is emerging as a predictive biomarker for preeclampsia", "Seizure prophylaxis with MgSO4 continues 24-48 hours postpartum"],
    quiz: [{ question: "At what serum magnesium level does respiratory arrest occur?", options: ["4-7 mEq/L", "8-12 mEq/L", "15-17 mEq/L", ">25 mEq/L"], correct: 2, rationale: "Respiratory arrest occurs at magnesium levels of 15-17 mEq/L. Therapeutic range is 4-7 mEq/L, loss of DTRs at 8-12, and cardiac arrest at >25 mEq/L." }]
  },
  "obstetric-hemorrhage-np": {
    title: "Obstetric Hemorrhage: Massive Transfusion",
    cellular: { title: "Hemostatic Failure in Pregnancy", content: "Obstetric hemorrhage involves unique physiological challenges: pregnancy increases blood volume by 40-50% (hypervolemic state), dilutional anemia masks true blood loss. Uterine blood flow at term is 500-700 mL/min, making atony catastrophic. Massive Transfusion Protocol (MTP) targets 1:1:1 ratio of pRBC:FFP:Platelets. Fibrinogen is the first coagulation factor depleted (critical threshold <200 mg/dL)." },
    riskFactors: ["Uterine atony", "Placenta accreta spectrum", "Coagulopathy (DIC)", "Uterine inversion", "Prior uterine surgery", "Prolonged oxytocin use", "Grand multiparity", "Chorioamnionitis"],
    diagnostics: ["Order CBC, coagulation studies (PT/PTT/fibrinogen), and type & crossmatch STAT", "Order serial fibrinogen levels (first factor depleted; critical < 200 mg/dL)", "Calculate Shock Index (HR/SBP): more sensitive than vitals alone in pregnancy", "Order thromboelastography (TEG/ROTEM) for point-of-care coagulation assessment", "Order lactate and base deficit for perfusion assessment", "Order arterial blood gas for acid-base status", "Order pelvic ultrasound to evaluate for retained products", "Order quantitative blood loss measurement (not visual estimation)"],
    management: ["Activate Massive Transfusion Protocol (1:1:1 ratio pRBC:FFP:Platelets)", "Prescribe TXA 1g IV within 3 hours of hemorrhage onset (WOMAN trial)", "Prescribe uterotonics in stepwise fashion (Oxytocin → Methergine → Hemabate → Misoprostol)", "Order Bakri balloon insertion for uterine tamponade", "Prescribe fibrinogen concentrate or cryoprecipitate to maintain fibrinogen > 200", "Order B-Lynch compression suture if medical management fails", "Consult interventional radiology for uterine artery embolization", "Order peripartum hysterectomy as last resort for life-threatening hemorrhage"],
    nursingActions: ["Monitor Shock Index (HR/SBP > 0.9 is concerning) as early hemorrhage indicator", "Administer blood products rapidly per massive transfusion protocol", "Monitor serial fibrinogen and coagulation studies", "Titrate uterotonics per protocol and assess uterine response", "Maintain quantitative blood loss measurement (weigh all blood-soaked materials)", "Monitor for transfusion-related complications (TACO, TRALI, citrate toxicity)", "Ensure large-bore IV access (2 sites minimum, 16-gauge or larger)", "Coordinate simultaneous resuscitation with multiple teams"],
    signs: {
      left: ["EBL > 1000mL", "Heart rate > 110 (late sign in pregnancy)", "Lactate > 4", "Fibrinogen < 200"],
      right: ["Shock Index > 0.9 (HR/SBP)", "Base deficit > -6", "Need for >4 units pRBC", "DIC (PT/PTT prolonged)"]
    },
    medications: [
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits plasminogen activation to stabilize clots", sideEffects: "Nausea, diarrhea, thromboembolic events", contra: "Active thromboembolic disease", pearl: "Give within 3 hours of hemorrhage onset per WOMAN trial: 1g IV over 10 minutes." },
      { name: "Fibrinogen Concentrate", type: "Coagulation Factor", action: "Directly replaces fibrinogen to restore clot formation", sideEffects: "Thromboembolic risk", contra: "Known hypersensitivity", pearl: "Target fibrinogen > 200 mg/dL; faster than cryoprecipitate with no thaw time required." },
      { name: "Factor VIIa (Recombinant)", type: "Coagulation Factor", action: "Activates extrinsic pathway: last resort for refractory hemorrhage", sideEffects: "Thrombosis risk", contra: "Relative: weigh risk vs benefit", pearl: "Reserved for life-threatening hemorrhage unresponsive to conventional therapy." }
    ],
    pearls: ["Shock Index (HR/SBP) is more sensitive than vital signs alone in pregnancy", "Bakri balloon provides uterine tamponade for atony", "B-Lynch compression suture is a surgical option before hysterectomy", "Peripartum hysterectomy is definitive for life-threatening hemorrhage"],
    quiz: [{ question: "Why are traditional vital signs unreliable in obstetric hemorrhage?", options: ["Pregnancy causes chronic hypertension", "Pregnancy increases blood volume by 40-50%, masking hemorrhage signs", "Vital signs are always accurate in pregnancy", "Pregnancy reduces heart rate baseline"], correct: 1, rationale: "The 40-50% increase in blood volume during pregnancy creates a hypervolemic state, allowing significant blood loss before traditional vital sign changes appear. Shock Index (HR/SBP > 0.9) is a more sensitive early indicator." }]
  },
  "neonatal-rds-np": {
    title: "RDS: Surfactant Physiology",
    cellular: { title: "Surfactant & Alveolar Mechanics", content: "Pulmonary surfactant is a complex mixture of phospholipids (90%, primarily DPPC - dipalmitoylphosphatidylcholine) and surfactant proteins (SP-A, SP-B, SP-C, SP-D). Type II pneumocytes begin producing surfactant at 24-28 weeks but adequate amounts not present until 34-36 weeks. Surfactant reduces alveolar surface tension according to LaPlace's Law (P = 2T/r), preventing atelectasis. Without it, high opening pressures are needed, causing barotrauma and oxygen toxicity leading to BPD." },
    riskFactors: ["Prematurity (inverse relationship with gestational age)", "Maternal diabetes (delayed surfactant maturation)", "Cesarean without labor", "Perinatal asphyxia", "Male sex", "White race", "Second-born twin", "Family history of RDS"],
    diagnostics: ["Order CXR (ground-glass opacification with air bronchograms)", "Order serial ABGs to monitor oxygenation and ventilation", "Calculate a/A ratio and Oxygenation Index (OI = MAP × FiO2 × 100 / PaO2)", "Order L/S ratio or PG from amniotic fluid for lung maturity assessment", "Order echocardiogram to rule out PDA and assess cardiac function", "Order serial CBG/ABG to guide ventilator management", "Order head ultrasound for IVH screening in preterm infants", "Monitor surfactant protein levels if genetic deficiency suspected"],
    management: ["Prescribe exogenous surfactant (Poractant alfa 200mg/kg initial dose via ETT)", "Order CPAP or mechanical ventilation based on respiratory failure severity", "Prescribe Caffeine Citrate for apnea prevention (20mg/kg load, 5-10mg/kg maintenance)", "Implement INSURE technique (Intubate-Surfactant-Extubate) to minimize ventilator exposure", "Consider LISA/MIST for less invasive surfactant delivery", "Order targeted SpO2 90-95% to prevent ROP while avoiding hypoxia", "Prescribe antenatal Betamethasone to mother if preterm delivery anticipated", "Consult neonatology for ECMO evaluation if OI > 40"],
    nursingActions: ["Monitor continuous pulse oximetry and titrate FiO2 to target SpO2 90-95%", "Assess respiratory status systematically (RR, WOB, retractions, grunting, color)", "Reposition infant after each surfactant aliquot to ensure distribution", "Monitor for surfactant administration complications (bradycardia, desaturation, ETT obstruction)", "Minimize handling and cluster care to reduce oxygen consumption", "Monitor for complications (pneumothorax, PIE, BPD, IVH)", "Monitor ventilator parameters and wean per protocol", "Assess for signs of PDA (bounding pulses, widened pulse pressure, murmur)"],
    signs: {
      left: ["Ground-glass appearance on CXR", "Air bronchograms", "Increased FiO2 requirement", "a/A ratio < 0.22"],
      right: ["Pulmonary interstitial emphysema", "Pneumothorax (air leak)", "BPD (chronic lung disease)", "Retinopathy of Prematurity (ROP)"]
    },
    medications: [
      { name: "Poractant alfa (Curosurf)", type: "Exogenous Surfactant", action: "Porcine-derived surfactant with higher phospholipid concentration: replaces deficient surfactant", sideEffects: "Transient bradycardia, oxygen desaturation during administration", contra: "None absolute", pearl: "200mg/kg initial dose; can repeat 100mg/kg doses. Higher initial dose than other surfactants." },
      { name: "Calfactant (Infasurf)", type: "Exogenous Surfactant", action: "Bovine-derived natural surfactant replacement", sideEffects: "Airway obstruction, desaturation", contra: "None absolute", pearl: "Contains SP-B which is critical for surfactant function." },
      { name: "Caffeine Citrate", type: "Methylxanthine", action: "Stimulates respiratory drive, reduces apnea of prematurity, improves BPD outcomes", sideEffects: "Tachycardia, feeding intolerance, jitteriness", contra: "Seizure disorder", pearl: "Loading dose 20mg/kg, maintenance 5-10mg/kg/day. CAP trial showed reduced BPD." }
    ],
    pearls: ["INSURE technique: Intubate-Surfactant-Extubate to minimize ventilator exposure", "LISA/MIST (Less Invasive Surfactant Administration) avoids intubation entirely", "Target SpO2 90-95% to reduce ROP risk while avoiding hypoxia"],
    quiz: [{ question: "What is the primary phospholipid component of pulmonary surfactant?", options: ["Sphingomyelin", "Dipalmitoylphosphatidylcholine (DPPC)", "Phosphatidylglycerol", "Lecithin"], correct: 1, rationale: "DPPC (dipalmitoylphosphatidylcholine) comprises the majority of surfactant phospholipids (~90% of surfactant is phospholipid, with DPPC being the primary component) and is responsible for reducing alveolar surface tension." }]
  },
  "neonatal-hie-np": {
    title: "HIE: Therapeutic Hypothermia",
    cellular: { title: "Two-Phase Injury & Neuroprotection", content: "Hypoxic-Ischemic Encephalopathy occurs in two phases. Primary injury: ATP depletion leads to failure of Na/K ATPase, intracellular calcium influx, and excitotoxic glutamate release. Latent period (6-hour therapeutic window): partial energy recovery. Secondary injury: mitochondrial failure, ROS production, inflammation (IL-1beta, TNF-alpha), and apoptosis via caspase activation. Therapeutic hypothermia (33.5C for 72 hours) reduces metabolic rate by 5% per degree, decreases excitotoxicity, and inhibits apoptotic pathways." },
    riskFactors: ["Placental abruption", "Uterine rupture", "Cord prolapse", "Maternal cardiac arrest", "Severe maternal hypotension", "Shoulder dystocia", "Failed instrumental delivery", "Prolonged second stage of labor"],
    diagnostics: ["Order amplitude-integrated EEG (aEEG) for seizure detection and severity staging", "Order MRI brain at 3-5 days of life (basal ganglia/thalami or watershed pattern)", "Order cord blood gases (pH < 7.0, base deficit > 12 confirms asphyxia)", "Order LFTs, renal function, cardiac enzymes for multi-organ dysfunction", "Order continuous EEG for subclinical seizure monitoring", "Order cranial ultrasound as bedside screening tool", "Order coagulation studies (DIC risk from tissue injury)", "Apply Sarnat staging for severity classification and treatment eligibility"],
    management: ["Initiate therapeutic hypothermia within 6 hours (33.5°C for 72 hours)", "Prescribe Phenobarbital 20mg/kg IV loading dose for seizures", "Prescribe Morphine or Fentanyl for shivering control during cooling", "Order slow controlled rewarming at 0.5°C per hour over 6-12 hours", "Prescribe Levetiracetam as second-line anticonvulsant", "Order supportive care for multi-organ dysfunction (ventilation, fluids, vasopressors)", "Consult pediatric neurology for prognostication and follow-up", "Order developmental follow-up and early intervention referral"],
    nursingActions: ["Monitor core temperature continuously during cooling (target 33.5°C ± 0.5°C)", "Assess neurological status using Sarnat staging criteria", "Monitor continuous aEEG/EEG for seizure activity", "Manage shivering with prescribed sedation (shivering increases metabolic demand)", "Monitor for rewarming complications (rebound seizures, hemodynamic instability)", "Assess for multi-organ dysfunction (renal output, liver function, cardiac function)", "Provide minimal stimulation during the cooling period", "Coordinate with neonatology for rewarming protocol and post-cooling assessment"],
    signs: {
      left: ["Sarnat Stage I (hyperalert, normal EEG)", "Sarnat Stage II (lethargic, seizures, suppressed EEG)", "Sarnat Stage III (comatose, burst suppression)"],
      right: ["Multi-organ dysfunction (renal, hepatic, cardiac)", "Seizures within 6-12 hours", "Amplitude-integrated EEG changes", "MRI changes (basal ganglia/thalami or watershed)"]
    },
    medications: [
      { name: "Phenobarbital", type: "Barbiturate Anticonvulsant", action: "First-line treatment for neonatal seizures: enhances GABA inhibition", sideEffects: "Respiratory depression, sedation, hypotension", contra: "Severe respiratory depression", pearl: "Loading dose 20mg/kg IV; may give additional 5-10mg/kg boluses up to 40mg/kg total." },
      { name: "Levetiracetam", type: "Anticonvulsant", action: "Emerging second-line: binds synaptic vesicle protein SV2A", sideEffects: "Sedation, irritability", contra: "Hypersensitivity", pearl: "Gaining favor due to fewer side effects than phenobarbital; evidence still accumulating in neonates." },
      { name: "Morphine/Fentanyl", type: "Opioid Analgesic", action: "Comfort and pain management during therapeutic cooling", sideEffects: "Respiratory depression, hypotension, ileus", contra: "Hemodynamic instability", pearl: "Shivering during cooling increases metabolic demand and must be controlled." }
    ],
    pearls: ["Cooling must begin within 6 hours of birth for neuroprotective benefit", "TOBY, CoolCap, and NICHD trials established evidence for therapeutic hypothermia", "Rewarming must be gradual at 0.5°C per hour to prevent rebound seizures"],
    quiz: [{ question: "What is the therapeutic window for initiating hypothermia in HIE?", options: ["Within 1 hour", "Within 6 hours", "Within 12 hours", "Within 24 hours"], correct: 1, rationale: "Therapeutic hypothermia must be initiated within 6 hours of birth during the latent period between primary and secondary injury to achieve neuroprotective benefits." }]
  },
  "persistent-pulm-htn-np": {
    title: "PPHN: Nitric Oxide Pathway",
    cellular: { title: "Pulmonary Vascular Transition Failure", content: "Persistent Pulmonary Hypertension of the Newborn occurs when pulmonary vascular resistance (PVR) fails to decrease after birth, maintaining fetal circulation pattern with right-to-left shunting through PDA and foramen ovale. Normally, increased PaO2 and decreased PaCO2 stimulate endothelial nitric oxide synthase (eNOS) to produce NO, which activates guanylate cyclase to produce cGMP, causing smooth muscle relaxation. In PPHN, this pathway is impaired. Phosphodiesterase-5 (PDE5) degrades cGMP." },
    riskFactors: ["Meconium aspiration syndrome", "Congenital diaphragmatic hernia", "Perinatal asphyxia", "Neonatal sepsis/pneumonia", "Maternal SSRI use (third trimester)", "Congenital heart disease", "Pulmonary hypoplasia"],
    diagnostics: ["Order pre-ductal and post-ductal SpO2 simultaneously (>10% difference confirms R-to-L shunt)", "Order echocardiogram to confirm elevated PVR and rule out structural heart disease", "Order ABG from pre-ductal site for oxygenation assessment", "Order CXR (may show clear lungs with severe hypoxemia: hallmark of PPHN)", "Order CBC, blood culture to rule out sepsis as underlying cause", "Order BNP level (elevated in pulmonary hypertension)", "Calculate Oxygenation Index (OI) to guide therapy escalation", "Order cranial ultrasound to screen for IVH if asphyxia-related"],
    management: ["Prescribe inhaled Nitric Oxide (iNO) starting at 20 ppm for selective pulmonary vasodilation", "Prescribe Sildenafil PO as adjunct or for iNO weaning", "Prescribe Milrinone infusion for combined inotropy and vasodilation", "Order gentle ventilation strategy (avoid hyperventilation and barotrauma)", "Prescribe sedation and analgesia to minimize agitation (increases PVR)", "Initiate ECMO consultation for refractory PPHN with OI > 40", "Prescribe surfactant if underlying MAS or RDS contributing", "Order correction of metabolic acidosis (worsens pulmonary vasoconstriction)"],
    nursingActions: ["Monitor pre-ductal and post-ductal SpO2 simultaneously and continuously", "Wean iNO gradually to prevent rebound pulmonary hypertension", "Monitor methemoglobin levels during iNO therapy", "Minimize stimulation and handling (agitation triggers pulmonary vasospasm)", "Maintain normothermia and correct acidosis (cold stress and acidosis worsen PVR)", "Monitor for ECMO complications (bleeding, thrombosis, hemolysis)", "Assess hemodynamic status continuously (BP, perfusion, urine output)", "Coordinate with respiratory therapy for gentle ventilation strategies"],
    signs: {
      left: ["Labile hypoxemia", "Pre-post ductal SpO2 differential >10%", "Right-to-left shunt on echo", "Poor response to supplemental O2"],
      right: ["Severe hypoxemia with minimal lung disease", "Tricuspid regurgitation on echo", "Septal bowing (RV pressure overload)", "Metabolic acidosis"]
    },
    medications: [
      { name: "Inhaled Nitric Oxide (iNO)", type: "Selective Pulmonary Vasodilator", action: "Activates guanylate cyclase to increase cGMP, causing pulmonary smooth muscle relaxation", sideEffects: "Methemoglobinemia, rebound pulmonary HTN on withdrawal", contra: "Dependent on R-to-L shunt for systemic perfusion", pearl: "Start at 20ppm; wean gradually to prevent rebound. Monitor methemoglobin levels." },
      { name: "Sildenafil", type: "PDE5 Inhibitor", action: "Prevents cGMP degradation, prolonging vasodilatory effect", sideEffects: "Systemic hypotension, priapism", contra: "Concurrent nitrate use", pearl: "Oral alternative when iNO unavailable; also used for weaning off iNO." },
      { name: "Milrinone", type: "PDE3 Inhibitor", action: "Increases cAMP: provides inotropy and vasodilation", sideEffects: "Hypotension, thrombocytopenia", contra: "Severe aortic stenosis", pearl: "Improves both cardiac output and reduces PVR: dual benefit in PPHN." }
    ],
    pearls: ["Avoid cold stress and acidosis: both significantly worsen pulmonary vascular resistance", "Use gentle ventilation strategy with permissive hypercapnia to avoid lung injury", "ECMO is indicated for refractory cases with Oxygenation Index (OI) > 40"],
    quiz: [{ question: "How does inhaled nitric oxide (iNO) reduce pulmonary vascular resistance?", options: ["Blocks calcium channels in smooth muscle", "Activates guanylate cyclase to increase cGMP causing smooth muscle relaxation", "Inhibits phosphodiesterase-5 directly", "Stimulates beta-2 receptors in the lungs"], correct: 1, rationale: "iNO activates soluble guanylate cyclase in pulmonary vascular smooth muscle, increasing cGMP production which leads to smooth muscle relaxation and selective pulmonary vasodilation without systemic effects." }]
  },
  "neonatal-abstinence-np": {
    title: "NAS: Opioid Withdrawal Scoring",
    cellular: { title: "Noradrenergic Upregulation", content: "Neonatal Abstinence Syndrome results from in utero opioid exposure causing upregulation of cAMP and noradrenergic pathways. After birth, removal of the opioid agonist leads to unopposed noradrenergic activity causing CNS excitability, autonomic dysfunction, and GI disturbance. Onset depends on the half-life of the maternal opioid (heroin: 24-48h, methadone: 48-72h, buprenorphine: 36-60h). The Finnegan Neonatal Abstinence Scoring System or Eat-Sleep-Console (ESC) model guides treatment." },
    riskFactors: ["Maternal opioid use (heroin, methadone, buprenorphine)", "Maternal SSRI/SNRI use", "Maternal benzodiazepine use", "Polysubstance exposure", "Shorter-acting opioid exposure (heroin > methadone)", "Maternal smoking", "Prematurity"],
    diagnostics: ["Order urine and meconium toxicology screen for substance confirmation", "Apply Finnegan Neonatal Abstinence Scoring System or Eat-Sleep-Console (ESC) assessment", "Order CBC, electrolytes, and glucose monitoring", "Order thyroid function tests (rule out neonatal thyrotoxicosis as mimic)", "Order infectious disease screening (hepatitis B/C, HIV: maternal substance use risk)", "Order cranial ultrasound if seizures occur", "Monitor weight daily (caloric losses from increased activity and poor feeding)", "Order stool studies if persistent diarrhea"],
    management: ["Prescribe Morphine Sulfate as first-line pharmacotherapy (weight-based dosing with gradual taper)", "Prescribe Clonidine as adjunctive therapy to reduce morphine requirement", "Prescribe Phenobarbital for polysubstance withdrawal (especially benzodiazepine/alcohol exposure)", "Implement non-pharmacologic interventions first (swaddling, pacifier, dim lights, minimal stimulation)", "Order high-calorie formula (22-24 cal/oz) for increased metabolic demands", "Encourage rooming-in with mother (reduces pharmacotherapy need)", "Support breastfeeding if mother is in stable medication-assisted treatment", "Consult social work for safe discharge planning and outpatient follow-up"],
    nursingActions: ["Score infant using Finnegan or ESC model at prescribed intervals", "Implement non-pharmacologic comfort measures consistently (swaddling, pacifier, rocking, skin-to-skin)", "Titrate Morphine dosing based on scoring trends", "Monitor for respiratory depression during pharmacotherapy", "Provide small, frequent high-calorie feedings to support caloric needs", "Assess skin integrity (excoriations from excessive movement/rubbing)", "Monitor weight trends and caloric intake daily", "Wean pharmacotherapy gradually per protocol and monitor for rebound symptoms"],
    signs: {
      left: ["High-pitched cry", "Tremors/jitteriness", "Increased muscle tone", "Poor feeding/excessive sucking"],
      right: ["Seizures (rare but severe)", "Excoriation (face/knees)", "Diarrhea/vomiting", "Fever/sweating/sneezing"]
    },
    medications: [
      { name: "Morphine Sulfate", type: "Opioid Agonist", action: "First-line pharmacotherapy: replaces opioid to control withdrawal symptoms with gradual taper", sideEffects: "Respiratory depression, sedation, constipation", contra: "Respiratory depression", pearl: "Weight-based dosing with slow gradual taper over days to weeks based on scoring." },
      { name: "Clonidine", type: "Alpha-2 Agonist", action: "Adjunctive: reduces central noradrenergic hyperactivity", sideEffects: "Hypotension, bradycardia, rebound HTN on withdrawal", contra: "Hemodynamic instability", pearl: "Reduces morphine requirement and length of treatment when used as adjunct." },
      { name: "Phenobarbital", type: "Barbiturate", action: "Adjunctive for polysubstance exposure (especially benzodiazepines)", sideEffects: "Respiratory depression, sedation, poor feeding", contra: "Severe respiratory compromise", pearl: "Preferred when maternal exposure includes benzodiazepines or alcohol in addition to opioids." }
    ],
    pearls: ["Eat-Sleep-Console (ESC) model is replacing Finnegan scoring at many centers: focuses on function rather than individual symptoms", "Rooming-in with mother significantly improves outcomes and reduces pharmacotherapy need", "Breastfeeding is encouraged if mother is in a stable medication-assisted treatment program"],
    quiz: [{ question: "What is the key difference between the Eat-Sleep-Console (ESC) model and the Finnegan scoring system?", options: ["ESC uses more medications than Finnegan", "ESC focuses on functional assessment (eating, sleeping, consolability) rather than individual symptom scoring", "Finnegan is newer and more evidence-based", "ESC requires longer hospital stays"], correct: 1, rationale: "The ESC model shifts focus from scoring individual withdrawal symptoms (Finnegan) to assessing functional outcomes: can the infant eat adequately, sleep undisturbed, and be consoled within 10 minutes? This approach reduces pharmacotherapy use and hospital length of stay." }]
  },  "lumbar-puncture-np": {
    title: "Lumbar Puncture & CSF Analysis",
    cellular: { title: "Subarachnoid Access", content: "Lumbar puncture accesses the subarachnoid space at L3-L4 or L4-L5 (below the conus medullaris at L1-L2 to avoid spinal cord injury). CSF is produced by choroid plexus at ~500mL/day with ~150mL circulating at any time. Opening pressure measured by manometer (normal 10-20 cmH2O). CSF analysis differentiates bacterial (neutrophilic, low glucose, high protein) from viral (lymphocytic, normal glucose) meningitis, SAH, and malignancy." },
    riskFactors: ["Increased intracranial pressure (herniation risk)", "Coagulopathy/thrombocytopenia", "Local infection at puncture site", "Spinal deformity", "Obesity", "Anticoagulant therapy", "Previous lumbar surgery"],
    diagnostics: ["Order CT head before LP if increased ICP suspected (papilledema, focal deficits)", "Order CSF analysis: cell count, glucose, protein, Gram stain, culture", "Order opening pressure measurement via manometer", "Order CSF cytology if malignancy suspected", "Order blood glucose simultaneously for CSF:serum glucose ratio", "Order oligoclonal bands and IgG index if MS suspected", "Order xanthochromia assessment if SAH suspected"],
    management: ["Prescribe local anesthetic (lidocaine) for insertion site", "Prescribe EMLA cream 60 minutes before for pediatric patients", "Prescribe caffeine sodium benzoate or epidural blood patch for post-LP headache", "Order analgesics for post-procedure pain management", "Ensure informed consent is obtained and documented", "Prescribe empiric antibiotics immediately if bacterial meningitis suspected (do not delay for LP)"],
    nursingActions: ["Position patient properly (lateral decubitus with knees to chest or seated bent forward)", "Monitor vital signs and neurological status during and after procedure", "Label CSF tubes in correct order (tube 1-4) for accurate analysis", "Instruct patient to lie flat for 4-6 hours post-procedure", "Encourage oral fluids to reduce headache risk", "Monitor for post-LP headache (positional, worse when upright)", "Report new neurological deficits or severe headache immediately"],
    signs: {
      left: ["Positioning (lateral decubitus with knees to chest, or seated bent forward)", "Normal CSF values (clear/colorless, glucose 50-80, protein 15-45, WBC <5, opening pressure 10-20 cmH2O)"],
      right: ["Bacterial meningitis (turbid, high WBC/PMNs, low glucose <40, high protein >200)", "Viral meningitis (clear, lymphocytes, normal glucose)", "SAH (xanthochromia, RBCs that don't clear in tube 4)", "Malignancy (cytology positive, elevated protein)"]
    },
    medications: [
      { name: "EMLA Cream", type: "Topical Anesthetic", action: "Numbs skin at puncture site", sideEffects: "Local skin reaction", contra: "Methemoglobinemia risk in infants", pearl: "Apply 60 minutes before procedure for maximum effect." },
      { name: "Lidocaine", type: "Local Anesthetic", action: "Local infiltration at insertion site", sideEffects: "Numbness, allergic reaction", contra: "Lidocaine allergy", pearl: "Buffering with sodium bicarbonate reduces injection pain." },
      { name: "Caffeine Sodium Benzoate", type: "CNS Stimulant", action: "Treats post-LP headache by cerebral vasoconstriction", sideEffects: "Insomnia, tachycardia", contra: "Cardiac arrhythmias", pearl: "IV or PO caffeine is first-line for post-dural puncture headache." },
      { name: "Epidural Blood Patch", type: "Autologous Blood", action: "Definitive treatment for persistent post-dural puncture headache", sideEffects: "Back pain, infection risk", contra: "Sepsis, coagulopathy", pearl: "Effective in >90% of cases by sealing the dural tear." }
    ],
    pearls: ["Absolute contraindication: increased ICP with mass lesion (CT first!)", "Post-procedure: lie flat 4-6 hours, increase fluids, monitor for headache/neuro changes", "Traumatic tap vs SAH: RBCs decrease from tube 1 to 4 in traumatic tap"],
    quiz: [{ question: "CSF glucose < 40 with elevated PMNs suggests?", options: ["Viral meningitis", "Bacterial meningitis", "Subarachnoid hemorrhage", "Multiple sclerosis"], correct: 1, rationale: "Bacterial meningitis presents with low CSF glucose (<40 mg/dL), elevated protein, and a neutrophilic (PMN) predominance. Bacteria consume glucose, lowering CSF levels." }]
  },
  "abg-sampling-np": {
    title: "ABG Sampling & Interpretation",
    cellular: { title: "Acid-Base Physiology", content: "Arterial blood gas analysis measures acid-base status and oxygenation. pH is maintained by the bicarbonate buffer system (H2CO3/HCO3-), regulated by lungs (CO2) and kidneys (HCO3-). Henderson-Hasselbalch equation: pH = 6.1 + log(HCO3/0.03 x PaCO2). Respiratory compensation is rapid (minutes), metabolic compensation is slow (hours-days). The anion gap [Na - (Cl + HCO3)] helps identify the cause of metabolic acidosis (normal 8-12)." },
    riskFactors: ["Negative Allen test (inadequate collateral circulation)", "Coagulopathy", "Arterial insufficiency", "Local infection", "Severe peripheral vascular disease", "Anticoagulant therapy"],
    diagnostics: ["Order ABG for acid-base assessment and oxygenation status", "Order Modified Allen test before radial artery puncture", "Order metabolic panel for correlation with ABG findings", "Order lactate level for tissue perfusion assessment", "Order co-oximetry for carboxyhemoglobin or methemoglobin if indicated", "Order venous blood gas as alternative when arterial access is difficult"],
    management: ["Prescribe sodium bicarbonate for severe metabolic acidosis (pH < 7.1)", "Prescribe acetazolamide for metabolic alkalosis as indicated", "Order ventilator adjustments based on ABG results (increase RR for acidosis, decrease for alkalosis)", "Prescribe oxygen therapy titration based on PaO2 results", "Order repeat ABG 20-30 minutes after ventilator changes", "Prescribe THAM as alternative buffer when CO2 retention is a concern"],
    nursingActions: ["Perform Modified Allen test before radial artery puncture", "Apply firm pressure for 5 minutes post-puncture (10 minutes if anticoagulated)", "Place sample on ice and transport to lab within 30 minutes", "Document FiO2 and ventilator settings at time of draw", "Interpret results systematically: pH then PaCO2 then HCO3 then compensation", "Report critical values immediately to provider", "Monitor puncture site for hematoma or continued bleeding"],
    signs: {
      left: ["Normal values (pH 7.35-7.45, PaCO2 35-45, HCO3 22-26, PaO2 80-100, SaO2 >95%)", "Modified Allen's test (confirms ulnar collateral circulation before radial artery puncture)"],
      right: ["Interpretation framework - ROME (Respiratory Opposite, Metabolic Equal)", "Compensation (full vs partial)", "Anion gap metabolic acidosis (MUDPILES: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates)"]
    },
    medications: [
      { name: "Sodium Bicarbonate", type: "Alkalinizing Agent", action: "Buffer for severe metabolic acidosis (pH <7.1)", sideEffects: "Metabolic alkalosis, hypernatremia", contra: "Metabolic/respiratory alkalosis", pearl: "Use cautiously - can worsen intracellular acidosis. Reserved for pH <7.1." },
      { name: "Acetazolamide", type: "Carbonic Anhydrase Inhibitor", action: "Treats metabolic alkalosis by promoting bicarbonate excretion", sideEffects: "Metabolic acidosis, paresthesias", contra: "Severe renal/hepatic disease", pearl: "Also used for altitude sickness and glaucoma." },
      { name: "THAM (Tromethamine)", type: "Buffer Agent", action: "Alternative buffer for severe acidosis without sodium load", sideEffects: "Hypoglycemia, respiratory depression", contra: "Anuria, uremia", pearl: "Does not generate CO2 like bicarb - useful when ventilation is limited." }
    ],
    pearls: ["Apply pressure for 5 minutes post-puncture (10 min if on anticoagulants)", "Sample on ice and analyze within 30 minutes", "Compensatory changes never overcorrect", "Always correlate ABG with clinical picture"],
    quiz: [{ question: "pH 7.28, PaCO2 55, HCO3 24 - interpretation?", options: ["Metabolic acidosis", "Uncompensated respiratory acidosis", "Compensated respiratory alkalosis", "Mixed disorder"], correct: 1, rationale: "pH is acidotic (7.28), PaCO2 is elevated (55 - respiratory cause), and HCO3 is normal (24 - no metabolic compensation yet). This is uncompensated respiratory acidosis." }]
  }};
