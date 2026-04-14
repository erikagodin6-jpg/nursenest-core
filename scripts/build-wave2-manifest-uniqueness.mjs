#!/usr/bin/env node
/**
 * Builds pathophysiology-200-wave2.manifest.json with 200 topics validated
 * against nclex-seo-100 baseline + blog-import-wave2 JSON (no full HTML generation).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const STOP = new Set(
  `the and for with from that this your you are was were has have had not but can will may one two any item items stem stems when then than into also just only same other more most such each exam test bank practice nclex rn pn np nursing nurse nursenest blog lesson pathophysiology guide review questions answers about which what why how does cause causes patient clients client care clinical priority priorities first assessment monitoring teaching education management treatment therapy protocol order orders per day case scenario`.split(
    /\s+/,
  ),
);

function tokenSet(s) {
  const out = new Set();
  for (const w of String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)) {
    if (w.length > 2 && !STOP.has(w)) out.add(w);
  }
  return out;
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function combinedDoc(p) {
  return [p.title, p.primaryKeyword, ...(p.secondaryKeywords || []), p.slug].join(" ");
}

/** Extract "X vs Y" disease pair keys for blocking near-duplicate comparison intents */
function comparisonPairKey(title) {
  const m = String(title).match(/(.+?)\s+vs\.?\s+(.+?)(?:\(|:|$)/i);
  if (!m) return null;
  const a = tokenSet(m[1]);
  const b = tokenSet(m[2]);
  const ka = [...a].sort().slice(0, 4).join("-");
  const kb = [...b].sort().slice(0, 4).join("-");
  return `${ka}::${kb}`;
}

function loadCorpus() {
  const docs = [];
  const baselinePath = path.join(root, "data/blog-manifest/existing-topics-wave1-baseline.json");
  const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  const nclexPath = path.join(root, "data/blog-manifest/nclex-seo-100.manifest.json");
  const nclex = JSON.parse(fs.readFileSync(nclexPath, "utf8"));
  const slugToTitle = new Map(nclex.posts.map((p) => [p.slug, p.title]));
  for (const slug of baseline.slugs) {
    docs.push({
      source: "nclex-seo-100",
      slug,
      title: slugToTitle.get(slug) || slug,
      primaryKeyword: baseline.primaryKeywords[baseline.slugs.indexOf(slug)] || "",
      secondaryKeywords: [],
    });
  }
  const wave2ImportDir = path.join(root, "data/blog-import-wave2");
  if (fs.existsSync(wave2ImportDir)) {
    for (const f of fs.readdirSync(wave2ImportDir)) {
      if (!f.endsWith(".json")) continue;
      const j = JSON.parse(fs.readFileSync(path.join(wave2ImportDir, f), "utf8"));
      docs.push({
        source: "blog-import-wave2",
        slug: j.slug,
        title: f.replace(/\.json$/, "").replace(/-/g, " "),
        primaryKeyword: (j.keywords && j.keywords[0]) || "",
        secondaryKeywords: (j.keywords || []).slice(1),
      });
    }
  }
  const tokenized = docs.map((d) => ({
    ...d,
    tokens: tokenSet(combinedDoc({ ...d, secondaryKeywords: d.secondaryKeywords || [] })),
    pairKey: comparisonPairKey(slugToTitle.get(d.slug) || d.title),
  }));
  const pairKeys = new Set(tokenized.map((d) => d.pairKey).filter(Boolean));
  return { docs, tokenized, pairKeys };
}

/** 25 clusters × 8 = 200 — long-tail, micro-comparison, edge-case heavy; avoids broad K+ vs K+ style */
const CLUSTER_SEEDS = [
  {
    id: "cluster-shock-oxygenation-micro",
    pillar: "Shock & Oxygen Delivery Nuance",
    items: [
      { title: "ScvO2 vs SpO2: Why Mixed Venous Saturation Can Look ‘Too Normal’ in Sepsis", pk: "ScvO2 vs SpO2 sepsis nursing interpretation", sec: ["mixed venous oxygen", "lactate clearance"], intent: "lab_interpretation", cat: "Critical care" },
      { title: "Cardiogenic Shock vs Obstructive Shock: Femoral Pulses and JVP in the Same Stem", pk: "cardiogenic vs obstructive shock JVP pulses NCLEX", sec: ["tamponade", "massive PE"], intent: "micro_comparison", cat: "Cardiovascular" },
      { title: "Why Distributive Shock Can Show Warm Skin While Cardiac Output Is High Early", pk: "warm shock distributive pathophysiology nursing", sec: ["vasodilation", "compensation"], intent: "mechanism", cat: "Critical care" },
      { title: "Lactic Acidosis vs Simple Metabolic Acidosis: Delta Gap Clues Without Memorizing Myths", pk: "lactic acidosis vs metabolic acidosis delta gap nursing", sec: ["anion gap", "lactate"], intent: "micro_comparison", cat: "Acid–base" },
      { title: "Why Vasopressors Can Drop ScvO2 Even When MAP Improves", pk: "vasopressor ScvO2 change nursing mechanism", sec: ["oxygen extraction", "afterload"], intent: "mechanism", cat: "Critical care" },
      { title: "First-Line Actions When MAP Is 58 After Fluid Bolus: Distributive Shock Framing", pk: "hypotension after fluid bolus sepsis priority nursing", sec: ["norepinephrine", "recheck lactate"], intent: "clinical_decision", cat: "Sepsis" },
      { title: "When ‘Septic Shock’ Stems Hide Adrenal Insufficiency: Cortisol Clues for Exams", pk: "septic shock adrenal insufficiency exam clues nursing", sec: ["refractory hypotension", "electrolyte"], intent: "edge_case", cat: "Endocrine" },
      { title: "Why Oxygen Extraction Rises Before SpO2 Falls in Some Shock States", pk: "oxygen extraction ratio shock nursing", sec: ["demand ischemia"], intent: "mechanism", cat: "Critical care" },
    ],
  },
  {
    id: "cluster-abg-nuance",
    pillar: "ABG Interpretation Edge Cases",
    items: [
      { title: "A-a Gradient Elevated With ‘Normal’ SpO2: PE vs Parenchymal Disease Fork", pk: "A-a gradient elevated PE vs pneumonia nursing", sec: ["V/Q mismatch"], intent: "lab_interpretation", cat: "Respiratory" },
      { title: "Why Hyperventilation Can Normalize pH While Lactate Is Still High", pk: "respiratory alkalosis lactate sepsis ABG nursing", sec: ["compensation"], intent: "mechanism", cat: "Acid–base" },
      { title: "Delta-Delta Gap: When Metabolic Acidosis Is Two Problems at Once", pk: "delta delta gap metabolic acidosis nursing", sec: ["AG", "albumin"], intent: "edge_case", cat: "Acid–base" },
      { title: "Why COPD Patients May Tolerate Higher CO2: Renal Bicarbonate Compensation Story", pk: "COPD chronic CO2 retention bicarbonate compensation nursing", sec: ["chronic respiratory acidosis"], intent: "mechanism", cat: "Respiratory" },
      { title: "ABG After Cardiac Arrest: Mixed Respiratory + Metabolic Patterns You’ll See", pk: "post cardiac arrest ABG mixed acidosis nursing", sec: ["reperfusion"], intent: "case_based", cat: "Critical care" },
      { title: "Why Venous Blood Gas Is Not Interchangeable With Arterial in Shock Teaching Items", pk: "VBG vs ABG shock nursing limitations", sec: ["lactate correlation"], intent: "clinical_decision", cat: "Labs" },
      { title: "Osmolar Gap in Toxic Alcohol Teaching: When the ABG Looks ‘Almost Fine’", pk: "osmolar gap toxic alcohol ABG nursing", sec: ["ketones"], intent: "lab_interpretation", cat: "Toxicology" },
      { title: "Why Bicarbonate Therapy Is Controversial in Some Acidosis Pictures", pk: "bicarbonate therapy metabolic acidosis contraindications nursing", sec: ["K+ shift"], intent: "failure_state", cat: "Acid–base" },
    ],
  },
  {
    id: "cluster-troponin-ecg-edges",
    pillar: "ACS & ECG Edge Cases",
    items: [
      { title: "hs-cTn Rising Slowly: Type 2 MI vs Demand Ischemia Without Plaque Rupture", pk: "type 2 MI demand ischemia troponin nursing", sec: ["supply demand"], intent: "micro_comparison", cat: "Cardiovascular" },
      { title: "Why Wellens Waves Appear Before ST Elevation in Some LAD Lesions", pk: "Wellens syndrome ECG nursing NCLEX", sec: ["T wave"], intent: "edge_case", cat: "Cardiovascular" },
      { title: "Posterior MI With ‘Normal’ Anterior Leads: Reciprocal ST Depression Priority", pk: "posterior MI reciprocal ST depression nursing", sec: ["V1 V2"], intent: "clinical_decision", cat: "Cardiovascular" },
      { title: "Why Hyperkalemia Mimics STEMI on ECG Before Labs Return", pk: "hyperkalemia STEMI mimic ECG nursing", sec: ["peaked T waves"], intent: "edge_case", cat: "Electrolytes" },
      { title: "Brugada Pattern vs RBBB: Boards-Friendly Differentiation Without Overreach", pk: "Brugada vs RBBB ECG nursing exam", sec: ["V1 morphology"], intent: "micro_comparison", cat: "Cardiovascular" },
      { title: "Why New LBBB + Symptoms No Longer ‘Automatic’ STEMI in Modern Teaching", pk: "new LBBB ACS ECG nursing update framing", sec: ["Sgarbossa"], intent: "clinical_decision", cat: "Cardiovascular" },
      { title: "Pericarditis Diffuse ST Elevation vs STEMI: PR Depression as a Splitter", pk: "pericarditis vs STEMI PR depression nursing", sec: ["concavity"], intent: "micro_comparison", cat: "Cardiovascular" },
      { title: "Why Takotsubo Can Spike Troponin With Clean Coronaries on Angiography", pk: "Takotsubo troponin mechanism nursing", sec: ["catecholamine"], intent: "mechanism", cat: "Cardiovascular" },
    ],
  },
  {
    id: "cluster-neuro-icu-edges",
    pillar: "Neuro & ICP Edge Cases",
    items: [
      { title: "Why Herniation Can Occur With ‘Stable’ ICP Numbers on a Snapshot Monitor", pk: "brain herniation normal ICP snapshot nursing", sec: ["compliance"], intent: "edge_case", cat: "Neuro" },
      { title: "Cushing Triad Late vs Early Pupil Changes: What the Stem Usually Emphasizes", pk: "Cushing triad early late herniation nursing", sec: ["blown pupil"], intent: "micro_comparison", cat: "Neuro" },
      { title: "Why Mannitol Can Worsen Cerebral Blood Flow If Osmolarity Swings Wrong", pk: "mannitol cerebral blood flow nursing mechanism", sec: ["rheology"], intent: "mechanism", cat: "Neuro" },
      { title: "SAH Thunderclap With Negative Noncontrast CT: Next Step Reasoning for Exams", pk: "SAH negative CT next step lumbar nursing exam", sec: ["LP timing"], intent: "clinical_decision", cat: "Neuro" },
      { title: "Why Seizure After Stroke Raises Aspiration Risk Even After the Seizure Stops", pk: "post stroke seizure aspiration risk nursing", sec: ["GCS", "swallow"], intent: "failure_state", cat: "Neuro" },
      { title: "ICP Waveform ‘P2 Dominance’: Enough to Answer Monitoring Questions", pk: "ICP waveform P2 dominance nursing monitoring", sec: ["compliance"], intent: "lab_interpretation", cat: "Neuro" },
      { title: "Why Hyperventilation for ICP Is Not a Default Therapy in Modern Stems", pk: "hyperventilation ICP contraindication nursing", sec: ["cerebral ischemia"], intent: "clinical_decision", cat: "Neuro" },
      { title: "Locked-In vs Coma: Brainstem Assessment Clues Boards Reuse", pk: "locked in syndrome vs coma assessment nursing", sec: ["vertical gaze"], intent: "micro_comparison", cat: "Neuro" },
    ],
  },
  {
    id: "cluster-renal-micro",
    pillar: "Renal Labs & AKI Nuance",
    items: [
      { title: "FENa ‘Gray Zone’: Prerenal vs ATN When Numbers Aren’t Classic", pk: "FENa gray zone prerenal ATN nursing", sec: ["diuretics"], intent: "edge_case", cat: "Renal" },
      { title: "Why Urine Sodium Can Be Fooled by Diuretics in Prerenal Azotemia", pk: "urine sodium diuretics prerenal nursing", sec: ["FEUrea"], intent: "mechanism", cat: "Renal" },
      { title: "Contrast Nephropathy Timeline: When Creatinine Peaks vs When to Panic", pk: "contrast nephropathy creatinine peak nursing", sec: ["hydration"], intent: "clinical_decision", cat: "Renal" },
      { title: "Why CKD Patients Show Anemia Before ‘Classic’ BUN/Cr Ratios Change", pk: "CKD anemia before creatinine nursing mechanism", sec: ["erythropoietin"], intent: "mechanism", cat: "Renal" },
      { title: "Post-Obstructive Diuresis: First-Hour Nursing Priorities vs Long-Term Fluids", pk: "post obstructive diuresis nursing priority", sec: ["electrolytes"], intent: "clinical_decision", cat: "Renal" },
      { title: "Why Metabolic Acidosis in Renal Failure Is Not Always ‘Just’ Bicarbonate Loss", pk: "renal tubular acidosis CKD acidosis nursing", sec: ["anion gap"], intent: "edge_case", cat: "Renal" },
      { title: "Rhabdomyolysis: CK Alone vs CK + Urine Color + Potassium—Risk Stratification", pk: "rhabdomyolysis CK potassium urine nursing", sec: ["compartment"], intent: "case_based", cat: "Renal" },
      { title: "Why Dialysis Disequilibrium Still Appears in Exam Items Despite Protocols", pk: "dialysis disequilibrium syndrome nursing", sec: ["osmotic"], intent: "failure_state", cat: "Renal" },
    ],
  },
  {
    id: "cluster-coag-bleeding-edges",
    pillar: "Coagulation & Hemorrhage",
    items: [
      { title: "DIC vs Severe Liver Disease: Platelet vs Clotting Factor Patterns on Boards", pk: "DIC vs liver disease coagulation pattern nursing", sec: ["fibrinogen"], intent: "micro_comparison", cat: "Hematology" },
      { title: "Why INR Rises Faster Than Platelets Fall in Some Acute Liver Injuries", pk: "acute liver injury INR platelets nursing mechanism", sec: ["factor VII"], intent: "mechanism", cat: "Hepatic" },
      { title: "Reversal Agents: When Vitamin K Is Too Slow for the Stem’s Timeline", pk: "warfarin reversal PCC vitamin K timing nursing", sec: ["bleeding"], intent: "clinical_decision", cat: "Hematology" },
      { title: "Why Heparin Can Cause Thrombocytopenia Without Bleeding (HIT Awareness)", pk: "HIT thrombocytopenia mechanism nursing", sec: ["antibodies"], intent: "edge_case", cat: "Hematology" },
      { title: "Trauma-Induced Coagulopathy vs Dilutional Coagulopathy in Massive Transfusion", pk: "trauma coagulopathy vs dilutional nursing", sec: ["hypothermia"], intent: "micro_comparison", cat: "Trauma" },
      { title: "Why FFP Alone Doesn’t Fix Everything in Coagulopathic Bleeding Teaching Items", pk: "FFP limitations coagulopathic bleeding nursing", sec: ["PCC"], intent: "failure_state", cat: "Hematology" },
      { title: "Antifibrinolytics in Obstetric Hemorrhage: Mechanism-Level NCLEX Framing", pk: "tranexamic acid postpartum hemorrhage mechanism nursing", sec: ["fibrinolysis"], intent: "mechanism", cat: "OB" },
      { title: "Why ‘Low Platelets’ in HELLP Is Not the Same Problem as ITP", pk: "HELLP vs ITP platelets nursing differentiation", sec: ["hemolysis"], intent: "micro_comparison", cat: "OB" },
    ],
  },
  {
    id: "cluster-endocrine-stress",
    pillar: "Endocrine Stress & Glucose Edges",
    items: [
      { title: "Euglycemic DKA: Why Glucose Can Look ‘Okay’ While Ketones Surge", pk: "euglycemic DKA mechanism nursing SGLT2", sec: ["ketones"], intent: "edge_case", cat: "Endocrine" },
      { title: "Why Stress Hyperglycemia in Sepsis Is Not the Same as Chronic Hyperglycemia", pk: "stress hyperglycemia sepsis vs diabetes nursing", sec: ["insulin resistance"], intent: "micro_comparison", cat: "Endocrine" },
      { title: "Thyroid Storm vs Sympathomimetic Toxicity: Overlap and Fork Questions", pk: "thyroid storm vs stimulant toxicity nursing", sec: ["temperature"], intent: "micro_comparison", cat: "Endocrine" },
      { title: "Why Cortisol Levels Are Not Routine ‘Prove-It’ Labs in Acute Adrenal Crisis Items", pk: "acute adrenal crisis cortisol lab nursing exam", sec: ["empiric steroids"], intent: "clinical_decision", cat: "Endocrine" },
      { title: "SIADH vs Cerebral Salt Wasting: Volume Status Fork Without Nephrology Fellowship", pk: "SIADH vs cerebral salt wasting volume nursing", sec: ["urine sodium"], intent: "micro_comparison", cat: "Fluids" },
      { title: "Why Insulin Drip Protocols Emphasize Potassium Even When Glucose Is Falling", pk: "insulin drip potassium monitoring DKA nursing", sec: ["shift"], intent: "mechanism", cat: "Endocrine" },
      { title: "Hyperosmolar Hyperglycemic State: Why Osmolarity Matters More Than Ketones", pk: "HHS osmolarity ketones nursing priority", sec: ["dehydration"], intent: "clinical_decision", cat: "Endocrine" },
      { title: "Why Hypoglycemia Unawareness Changes Teaching Priorities in Older Adults", pk: "hypoglycemia unawareness elderly nursing teaching", sec: ["beta blockers"], intent: "edge_case", cat: "Endocrine" },
    ],
  },
  {
    id: "cluster-respiratory-edges",
    pillar: "Respiratory Mechanics & Failure",
    items: [
      { title: "Auto-PEEP vs Mainstem Intubation: Both Spike Pressure—Different First Checks", pk: "auto PEEP vs mainstem intubation ventilator nursing", sec: ["airway"], intent: "micro_comparison", cat: "Respiratory" },
      { title: "Why High-Flow Nasal Cannula Can Delay Intubation Harm—or Mask Fatigue", pk: "HFNC delayed intubation risk nursing", sec: ["ROX index"], intent: "failure_state", cat: "Respiratory" },
      { title: "ARDS Prone: Who Benefits Most in Exam Framing (Recruitable Lung Themes)", pk: "prone positioning ARDS recruitable lung nursing", sec: ["PEEP"], intent: "clinical_decision", cat: "Respiratory" },
      { title: "Why Pulse Oximetry Lags in Carbon Monoxide Exposure Teaching", pk: "carbon monoxide pulse oximetry falsely normal nursing", sec: ["co-oximetry"], intent: "mechanism", cat: "Toxicology" },
      { title: "Pneumothorax Tension vs Simple: Mediastinal Shift as the Splitter", pk: "tension pneumothorax vs simple nursing assessment", sec: ["tracheal deviation"], intent: "micro_comparison", cat: "Respiratory" },
      { title: "Why Asthma Exacerbation Can Show Rising PaCO2 Before You ‘Feel’ the Crisis", pk: "asthma rising PaCO2 fatigue nursing", sec: ["silent chest"], intent: "edge_case", cat: "Respiratory" },
      { title: "Pulsus Paradoxus: When It Points to Tamponade vs Severe Asthma", pk: "pulsus paradoxus tamponade vs asthma nursing", sec: ["BP variation"], intent: "micro_comparison", cat: "Cardiopulmonary" },
      { title: "Why Noninvasive Ventilation Fails in Some COPD Crises: Secretion vs Fatigue", pk: "BiPAP failure COPD nursing reasons", sec: ["mental status"], intent: "failure_state", cat: "Respiratory" },
    ],
  },
  {
    id: "cluster-gi-surgical-edges",
    pillar: "GI & Surgical Complications",
    items: [
      { title: "Anastomotic Leak vs Ileus: Fever and Pain Fork in Post-Op Stems", pk: "anastomotic leak vs ileus post op nursing", sec: ["WBC"], intent: "micro_comparison", cat: "GI" },
      { title: "Why NG Output Color Is Not Enough to Rule Out Bleeding", pk: "NG tube output coffee grounds nursing assessment", sec: ["Hgb"], intent: "clinical_decision", cat: "GI" },
      { title: "Acute Mesenteric Ischemia: ‘Pain Out of Proportion’ as a Testable Concept", pk: "mesenteric ischemia pain disproportionate nursing", sec: ["lactate"], intent: "edge_case", cat: "GI" },
      { title: "Why Bowel Sounds Return Asynchronously After Surgery in Exam Items", pk: "return of bowel sounds post op nursing timing", sec: ["ileus"], intent: "mechanism", cat: "GI" },
      { title: "SBO vs Paralytic Ileus: Air-Fluid Levels and Clinical Story", pk: "SBO vs paralytic ileus imaging nursing", sec: ["XR"], intent: "micro_comparison", cat: "GI" },
      { title: "Why PPIs Don’t Fix Active Bleeding Teaching—Just Acid Environment", pk: "PPI active GI bleeding nursing limitations", sec: ["resuscitation"], intent: "failure_state", cat: "GI" },
      { title: "Pancreatitis Severity Scores: What Nurses Need for Priority Questions", pk: "pancreatitis severity markers nursing NCLEX", sec: ["CRP"], intent: "lab_interpretation", cat: "GI" },
      { title: "Why Ascites Paracentesis Can Precipitate Hepatic Encephalopathy in Some Stems", pk: "paracentesis hepatic encephalopathy nursing", sec: ["ammonia"], intent: "edge_case", cat: "Hepatic" },
    ],
  },
  {
    id: "cluster-infection-sepsis-markers",
    pillar: "Infection & Sepsis Biomarkers",
    items: [
      { title: "Procalcitonin vs CRP: When the Stem Wants Antibiotic Stewardship Reasoning", pk: "procalcitonin vs CRP infection nursing", sec: ["bacterial"], intent: "micro_comparison", cat: "Infection" },
      { title: "Why Lactate Can Clear While Organ Dysfunction Worsens (Exam Trap)", pk: "lactate clearance sepsis trap nursing", sec: ["perfusion"], intent: "edge_case", cat: "Sepsis" },
      { title: "qSOFA vs SIRS: Screening vs Diagnosis—What Boards Expect You to Say", pk: "qSOFA vs SIRS sepsis screening nursing", sec: ["specificity"], intent: "clinical_decision", cat: "Sepsis" },
      { title: "Why Fever May Be Absent in Elderly Sepsis Despite Worsening Organ Failure", pk: "elderly sepsis without fever nursing", sec: ["baseline temp"], intent: "edge_case", cat: "Geriatrics" },
      { title: "Source Control Timing: Nursing Role in Recognition and Escalation", pk: "sepsis source control escalation nursing", sec: ["surgery consult"], intent: "clinical_decision", cat: "Sepsis" },
      { title: "Why Blood Cultures Before Antibiotics Still Wins Priority Questions", pk: "blood cultures before antibiotics sepsis nursing", sec: ["two sets"], intent: "clinical_decision", cat: "Infection" },
      { title: "Clostridioides difficile: Why WBC Can Spike Before Diarrhea in Toxic Megacolon Items", pk: "C diff toxic megacolon WBC nursing", sec: ["abdomen"], intent: "edge_case", cat: "Infection" },
      { title: "Why ‘Pan-Culture Everything’ Is Rarely the Correct First Nursing Action", pk: "sepsis cultures priority vs stabilization nursing", sec: ["two large bore IVs"], intent: "clinical_decision", cat: "Sepsis" },
    ],
  },
  {
    id: "cluster-ob-preeclampsia-edges",
    pillar: "Obstetric High-Risk Physiology",
    items: [
      { title: "HELLP Without Hypertension: Atypical Presentation Boards Love", pk: "HELLP without hypertension nursing NCLEX", sec: ["platelets"], intent: "edge_case", cat: "OB" },
      { title: "Why Magnesium Toxicity Looks Like Other Crises on Telemetry", pk: "magnesium toxicity vs other causes nursing", sec: ["reflexes"], intent: "micro_comparison", cat: "OB" },
      { title: "Postpartum Hemorrhage: Uterine Atony vs Retained Products Fork", pk: "uterine atony vs retained products PPH nursing", sec: ["tone"], intent: "micro_comparison", cat: "OB" },
      { title: "Why Pre-Eclampsia Can Worsen After Delivery in Exam Scenarios", pk: "postpartum preeclampsia worsening nursing", sec: ["HELLP"], intent: "failure_state", cat: "OB" },
      { title: "FHR Late Decelerations vs Variable: Cord vs Uteroplacental Insufficiency", pk: "late vs variable decelerations nursing NCLEX", sec: ["category II"], intent: "micro_comparison", cat: "OB" },
      { title: "Why BP Medications in Pregnancy Require Trimester-Aware Reasoning", pk: "antihypertensive pregnancy safe nursing exam", sec: ["methyldopa"], intent: "clinical_decision", cat: "OB" },
      { title: "Chorioamnionitis: Maternal Fever vs Epidural Fever Differentiation", pk: "chorioamnionitis vs epidural fever nursing", sec: ["fetal tachycardia"], intent: "micro_comparison", cat: "OB" },
      { title: "Why Magnesium for Neuroprotection Differs from Magnesium for Seizure Prophylaxis Dosing Logic", pk: "magnesium preterm neuroprotection vs preeclampsia nursing", sec: ["protocol"], intent: "edge_case", cat: "OB" },
    ],
  },
  {
    id: "cluster-peds-edges",
    pillar: "Pediatric Exam Edge Cases",
    items: [
      { title: "Why Kids Compensate Longer—and Crash Faster—in Dehydration Items", pk: "pediatric dehydration compensation crash nursing", sec: ["tachycardia"], intent: "mechanism", cat: "Peds" },
      { title: "Intussusception ‘Currant Jelly Stool’: Sensitivity vs Specificity for Exams", pk: "intussusception currant jelly stool nursing", sec: ["sausage mass"], intent: "edge_case", cat: "Peds" },
      { title: "Croup vs Epiglottitis in Modern Vaccination Context: What Stems Still Test", pk: "croup vs epiglottitis pediatric nursing updated", sec: ["drooling"], intent: "micro_comparison", cat: "Peds" },
      { title: "Why Neonatal Hypoglycemia Thresholds Differ From Adults in Teaching", pk: "neonatal hypoglycemia threshold nursing", sec: ["glucose screen"], intent: "lab_interpretation", cat: "Peds" },
      { title: "Febrile Seizure Simple vs Complex: Parent Teaching Priorities", pk: "febrile seizure simple vs complex teaching nursing", sec: ["recurrence"], intent: "clinical_decision", cat: "Peds" },
      { title: "Why RSV Bronchiolitis Doesn’t Need Routine Antibiotics—But Still Needs Monitoring", pk: "RSV bronchiolitis antibiotics not indicated nursing", sec: ["apnea"], intent: "clinical_decision", cat: "Peds" },
      { title: "Kawasaki Incomplete Criteria: When Fewer Signs Still Trigger Workup", pk: "incomplete Kawasaki criteria nursing", sec: ["CRP"], intent: "edge_case", cat: "Peds" },
      { title: "Why Pediatric Dosing Errors Cluster Around mg/kg and mL Conversions", pk: "pediatric medication dosing errors nursing prevention", sec: ["double check"], intent: "failure_state", cat: "Peds" },
    ],
  },
  {
    id: "cluster-psych-safety",
    pillar: "Behavioral Health & Safety",
    items: [
      { title: "Serotonin Syndrome vs NMS: Hyperreflexia vs Lead-Pipe Rigidity Splitter", pk: "serotonin syndrome vs NMS nursing differentiation", sec: ["temperature"], intent: "micro_comparison", cat: "Psych" },
      { title: "Why Benzo Withdrawal Can Mimic Seizure Risk Without Classic Alcohol History", pk: "benzodiazepine withdrawal seizure risk nursing", sec: ["taper"], intent: "edge_case", cat: "Psych" },
      { title: "Suicide Risk: Why ‘Contracting for Safety’ Is Not a Standalone Intervention in Modern Items", pk: "suicide risk safety contract nursing limitation", sec: ["means restriction"], intent: "clinical_decision", cat: "Psych" },
      { title: "Why Akathisia From Antipsychotics Is Misread as Anxiety in Stems", pk: "akathisia antipsychotic nursing assessment", sec: ["restlessness"], intent: "edge_case", cat: "Psych" },
      { title: "Delirium vs Dementia: CAM-Style Clues Without Memorizing Every Scale", pk: "delirium vs dementia CAM nursing clues", sec: ["attention"], intent: "micro_comparison", cat: "Geriatrics" },
      { title: "Why Restraints Last Resort Still Appears as a Priority Trap if Mis-timed", pk: "restraint use least restrictive nursing priority", sec: ["alternatives"], intent: "clinical_decision", cat: "Safety" },
      { title: "Alcohol Withdrawal CIWA: When Scores Rise While Patient Looks ‘Calm’", pk: "CIWA score clinical mismatch nursing", sec: ["autonomic"], intent: "edge_case", cat: "Psych" },
      { title: "Why Anticholinergic Toxicity Looks Like Heat Stroke in Summer Stems", pk: "anticholinergic toxicity vs heat stroke nursing", sec: ["dry skin"], intent: "micro_comparison", cat: "Toxicology" },
    ],
  },
  {
    id: "cluster-immuno-onc-edges",
    pillar: "Immunotherapy & Oncology Acute Complications",
    items: [
      { title: "CRS vs ICANS: Fever Patterns and Neuro Checks Boards Combine", pk: "cytokine release syndrome vs ICANS nursing", sec: ["CAR-T"], intent: "micro_comparison", cat: "Oncology" },
      { title: "Why Tumor Lysis Can Happen Before Chemotherapy in Bulky Disease Teaching", pk: "spontaneous tumor lysis nursing mechanism", sec: ["phosphate"], intent: "edge_case", cat: "Oncology" },
      { title: "SVC Syndrome: Why Head-of-Bed Positioning Matters Before Definitive Therapy", pk: "SVC syndrome positioning nursing priority", sec: ["radiation"], intent: "clinical_decision", cat: "Oncology" },
      { title: "Why Hypercalcemia of Malignancy Needs Hydration Logic Before Bisphosphonates in Items", pk: "hypercalcemia malignancy hydration first nursing", sec: ["loop diuretic"], intent: "clinical_decision", cat: "Oncology" },
      { title: "Immune Checkpoint Colitis vs C diff: Stool Studies and Escalation Fork", pk: "immunotherapy colitis vs C diff nursing", sec: ["calprotectin"], intent: "micro_comparison", cat: "Oncology" },
      { title: "Why Febrile Neutropenia Timing Drives Antibiotic Deadlines in Stems", pk: "febrile neutropenia antibiotic timing nursing", sec: ["ANC"], intent: "clinical_decision", cat: "Oncology" },
      { title: "Radiation Pneumonitis vs Infection: Gradual Onset Clues", pk: "radiation pneumonitis vs pneumonia nursing", sec: ["timeline"], intent: "micro_comparison", cat: "Oncology" },
      { title: "Why Port Site Infections Can Be Indolent Until Line Sepsis Declares", pk: "port infection indolent line sepsis nursing", sec: ["blood cultures"], intent: "failure_state", cat: "Oncology" },
    ],
  },
  {
    id: "cluster-skin-wound-edges",
    pillar: "Wound & Pressure Injury Nuance",
    items: [
      { title: "Unstageable Pressure Injury vs Deep Tissue Injury: Color and Texture Forks", pk: "unstageable pressure injury vs DTI nursing", sec: ["eschar"], intent: "micro_comparison", cat: "Skin" },
      { title: "Why Sacral Purple Discoloration Can Precede Full-Thickness Breakdown", pk: "deep tissue injury purple sacral nursing", sec: ["offloading"], intent: "edge_case", cat: "Skin" },
      { title: "Moisture-Associated Skin Damage vs Stage 2 Pressure Injury: Location Clues", pk: "MASD vs stage 2 pressure injury nursing", sec: ["incontinence"], intent: "micro_comparison", cat: "Skin" },
      { title: "Why Tunneling and Undermining Change Dressing Teaching Priorities", pk: "wound tunneling undermining nursing teaching", sec: ["packing"], intent: "clinical_decision", cat: "Wound" },
      { title: "Burn TBSA Estimation Errors: Why Boards Test Rule of Nines Variations", pk: "burn TBSA rule of nines pediatric nursing", sec: ["Lund Browder"], intent: "lab_interpretation", cat: "Burns" },
      { title: "Why Silver Dressings Aren’t Universal—Allergies and Toxicity Themes", pk: "silver dressing contraindications nursing", sec: ["cytotoxicity"], intent: "clinical_decision", cat: "Wound" },
      { title: "Necrotizing Soft Tissue Infection: Pain Out of Proportion + Skin May Look Mild Early", pk: "necrotizing fasciitis early skin nursing", sec: ["OR"], intent: "edge_case", cat: "Infection" },
      { title: "Why Wound Cultures Don’t Replace Tissue Diagnosis in Deep Infections", pk: "wound culture limitations deep infection nursing", sec: ["MRI"], intent: "failure_state", cat: "Wound" },
    ],
  },
  {
    id: "cluster-fluid-iv-edges",
    pillar: "IV Therapy & Fluid Resuscitation",
    items: [
      { title: "Hypotonic vs Isotonic Fluids in Neurologic Injury: Osmolar Traps", pk: "hypotonic vs isotonic fluids neuro injury nursing", sec: ["cerebral edema"], intent: "micro_comparison", cat: "Fluids" },
      { title: "Why Rapid Infusion of PIV Can Cause Extravasation More Than Central Lines in Stems", pk: "peripheral IV extravasation rapid infusion nursing", sec: ["vesicant"], intent: "edge_case", cat: "IV therapy" },
      { title: "Third Spacing vs Dehydration: JVP and Urine Output Fork", pk: "third spacing vs dehydration assessment nursing", sec: ["albumin"], intent: "micro_comparison", cat: "Fluids" },
      { title: "Why LR vs NS Debate Changes in Renal Injury and Hyperkalemia Teaching", pk: "lactated ringers vs normal saline hyperkalemia nursing", sec: ["potassium content"], intent: "clinical_decision", cat: "Fluids" },
      { title: "Blood Product Infusion Reactions: Febrile Nonhemolytic vs Allergic Priority", pk: "febrile nonhemolytic vs allergic transfusion nursing", sec: ["stop infusion"], intent: "micro_comparison", cat: "Transfusion" },
      { title: "Why Fluid Responsiveness Testing Matters Before More Boluses in Some Shock Items", pk: "fluid responsiveness passive leg raise nursing", sec: ["echo"], intent: "clinical_decision", cat: "Critical care" },
      { title: "TPN Refeeding Risk: Why Phosphate Crashes Even When Calories Look ‘Gentle’", pk: "TPN refeeding hypophosphatemia nursing", sec: ["monitoring"], intent: "failure_state", cat: "Nutrition" },
      { title: "Why Crystalloid Choice Is Rarely the First Priority in Active Hemorrhage Teaching", pk: "hemorrhage crystalloid vs blood priority nursing", sec: ["massive transfusion"], intent: "clinical_decision", cat: "Trauma" },
    ],
  },
  {
    id: "cluster-pain-sedation-edges",
    pillar: "Pain, Sedation & Ventilator Dyssynchrony",
    items: [
      { title: "RASS vs SAS: Which Scale the Stem Expects in Ventilated Patients", pk: "RASS vs SAS sedation scale ventilator nursing", sec: ["weaning"], intent: "micro_comparison", cat: "ICU" },
      { title: "Why Ketamine Sedation Changes Hemodynamic Teaching in Asthma Crisis Items", pk: "ketamine asthma sedation hemodynamics nursing", sec: ["bronchodilation"], intent: "mechanism", cat: "Respiratory" },
      { title: "Opioid-Induced Respiratory Depression: EtCO2 Before SpO2 Drops", pk: "EtCO2 opioid respiratory depression nursing", sec: ["PCA"], intent: "clinical_decision", cat: "Pain" },
      { title: "Why Scheduled Acetaminophen Still Matters in Multimodal Plans (Exam Framing)", pk: "multimodal analgesia scheduled acetaminophen nursing", sec: ["opioid sparing"], intent: "clinical_decision", cat: "Pain" },
      { title: "Ventilator Dyssynchrony: Auto-PEEP vs Patient Effort—First Checks", pk: "ventilator dyssynchrony auto PEEP nursing", sec: ["flow starvation"], intent: "micro_comparison", cat: "Respiratory" },
      { title: "Why Benzodiazepines Are Not First-Line Sedation in Modern ICU Teaching", pk: "benzodiazepine sedation ICU delirium nursing", sec: ["propofol"], intent: "clinical_decision", cat: "ICU" },
      { title: "Regional Anesthesia Complications: High Neuraxial Block vs Anxiety Mimics", pk: "high spinal vs anxiety nursing assessment", sec: ["BP"], intent: "edge_case", cat: "Anesthesia" },
      { title: "Why Pain Scores Alone Fail in Sedated Patients—Behavioral Scales", pk: "CPOT vs numeric pain sedated nursing", sec: ["intubated"], intent: "lab_interpretation", cat: "Pain" },
    ],
  },
  {
    id: "cluster-legal-ethics-edges",
    pillar: "Ethics, Consent & Scope",
    items: [
      { title: "Implied Consence vs Express Consent in Emergent Procedures Teaching", pk: "implied consent emergency procedure nursing", sec: ["capacity"], intent: "clinical_decision", cat: "Ethics" },
      { title: "Why Withdrawing Life-Sustaining Therapy Is Not the Same as Euthanasia in Exam Ethics", pk: "withdraw care vs euthanasia ethics nursing NCLEX", sec: ["DNR"], intent: "micro_comparison", cat: "Ethics" },
      { title: "Mandatory Reporting: Child Abuse vs Neglect Documentation Priorities", pk: "mandatory reporting child abuse nursing documentation", sec: ["timeline"], intent: "clinical_decision", cat: "Legal" },
      { title: "Why Nurses Cannot Accept Verbal Orders Long-Term in Many Policy Questions", pk: "verbal order policy nursing limitation", sec: ["read back"], intent: "edge_case", cat: "Legal" },
      { title: "Restraint Orders: Time-Limited Review Expectations on Boards", pk: "restraint order renewal nursing time limit", sec: ["physician"], intent: "clinical_decision", cat: "Safety" },
      { title: "Why Cultural Humility Is Framed as Ongoing Learning—Not a One-Time Checklist", pk: "cultural humility nursing ongoing learning NCLEX", sec: ["bias"], intent: "mechanism", cat: "Communication" },
      { title: "Informed Refusal: Teaching Risks Without Coercion—What Items Test", pk: "informed refusal nursing teaching", sec: ["witness"], intent: "clinical_decision", cat: "Ethics" },
      { title: "Why Social Media Posts About Patients Violate Privacy Even Without Names", pk: "HIPAA social media patient privacy nursing", sec: ["identifiers"], intent: "edge_case", cat: "Legal" },
    ],
  },
  {
    id: "cluster-pn-scope-priority",
    pillar: "PN Scope: Monitoring & Escalation",
    items: [
      { title: "LPN/LVN Scope: When to Report vs When to Delegate Assessment Findings", pk: "LPN report vs delegate assessment nursing scope", sec: ["supervision"], intent: "clinical_decision", cat: "PN scope" },
      { title: "Why Vital Sign Trends Beat Single-Point ‘Normal’ in Early Sepsis on Med-Surg", pk: "vital sign trends early sepsis med surg nursing", sec: ["SIRS"], intent: "clinical_decision", cat: "PN" },
      { title: "Wound Photo Documentation: What PN Can Capture vs What Requires RN Interpretation", pk: "wound photo LPN documentation scope nursing", sec: ["staging"], intent: "edge_case", cat: "PN scope" },
      { title: "Insulin Administration: Independent Double-Check Scenarios PN See on Exams", pk: "insulin double check LPN nursing exam", sec: ["five rights"], intent: "clinical_decision", cat: "PN" },
      { title: "Why PN Cannot Prescribe Oxygen Flow Changes—But Must Recognize Hypoxia", pk: "oxygen therapy LPN escalation nursing", sec: ["SpO2"], intent: "clinical_decision", cat: "PN" },
      { title: "Catheter Care vs Catheter Insertion: Scope Boundaries in Items", pk: "Foley care LPN vs RN insertion nursing scope", sec: ["sterile"], intent: "micro_comparison", cat: "PN scope" },
      { title: "Why PN Reinforcement of Teaching Still Requires RN-Approved Plans", pk: "patient teaching LPN reinforcement nursing", sec: ["care plan"], intent: "clinical_decision", cat: "PN" },
      { title: "Medication Error Near-Miss: PN Duty to Report Even If Patient Harmless This Time", pk: "medication error near miss reporting LPN nursing", sec: ["QI"], intent: "failure_state", cat: "PN" },
    ],
  },
  {
    id: "cluster-np-autonomy-edges",
    pillar: "NP: Diagnostics & Management Reasoning",
    items: [
      { title: "NP Reasoning: When to Order CT Head vs Observation in Minor Head Trauma Adults", pk: "minor head trauma CT decision NP nursing crossover", sec: ["GCS"], intent: "clinical_decision", cat: "NP" },
      { title: "Why ST-Segment Monitoring Protocols Differ by Chest Pain Risk Class in Teaching", pk: "chest pain risk stratification telemetry NP", sec: ["HEART score"], intent: "clinical_decision", cat: "NP" },
      { title: "Outpatient Heart Failure: When Volume Overload Needs Urgent Referral vs Phone Triage", pk: "heart failure urgent referral NP triage", sec: ["weight gain"], intent: "clinical_decision", cat: "NP" },
      { title: "Why SGLT2 Inhibitors Expanded Beyond Diabetes in HF Teaching (Mechanism Overview)", pk: "SGLT2 heart failure mechanism NP nursing", sec: ["natriuresis"], intent: "mechanism", cat: "NP" },
      { title: "Pneumonia Outpatient vs Inpatient Criteria: CURB-65 Enough for Exam Logic", pk: "CURB-65 pneumonia admission NP nursing", sec: ["oxygen"], intent: "lab_interpretation", cat: "NP" },
      { title: "Why Antibiotic Duration Shortening Appears in CAP Items (Stewardship Themes)", pk: "CAP antibiotic duration stewardship NP nursing", sec: ["clinical stability"], intent: "clinical_decision", cat: "NP" },
      { title: "Chronic Kidney Disease Staging in Primary Care: eGFR Albuminuria Risk Grid", pk: "CKD staging albuminuria NP primary care nursing", sec: ["KDIGO"], intent: "lab_interpretation", cat: "NP" },
      { title: "Why Depression Screening Differs From Suicide Risk Assessment in Adult Primary Care", pk: "depression screening vs suicide risk NP nursing", sec: ["PHQ-9"], intent: "micro_comparison", cat: "NP" },
    ],
  },
  {
    id: "cluster-hemodynamics-monitoring",
    pillar: "Invasive Monitoring & Waveforms",
    items: [
      { title: "Arterial Line Damping: Underdamped vs Overdamped Waveforms on Tests", pk: "arterial line underdamped overdamped nursing", sec: ["square test"], intent: "lab_interpretation", cat: "Hemodynamics" },
      { title: "Why CVP Is a Poor Sole Guide for Fluid Responsiveness in Modern Items", pk: "CVP fluid responsiveness limitation nursing", sec: ["PPV"], intent: "clinical_decision", cat: "Critical care" },
      { title: "PA Catheter: When Wedge Pressure Misleads (PEEP, Catheter Position)", pk: "PA catheter wedge pressure error nursing", sec: ["PEEP"], intent: "edge_case", cat: "Critical care" },
      { title: "Why Cardiac Index Beats MAP Alone in Some Cardiogenic Shock Stems", pk: "cardiac index vs MAP shock nursing", sec: ["inotrope"], intent: "micro_comparison", cat: "Critical care" },
      { title: "Pulse Pressure Variation: Applicability Limits in Spontaneously Breathing Patients", pk: "pulse pressure variation spontaneous breathing nursing", sec: ["arrhythmia"], intent: "edge_case", cat: "Critical care" },
      { title: "Why Thermodilution Cardiac Output Errors Happen With TR and Shunts", pk: "thermodilution cardiac output error nursing", sec: ["tricuspid regurgitation"], intent: "mechanism", cat: "Critical care" },
      { title: "Noninvasive Cardiac Output Monitors: Trending vs Absolute Numbers", pk: "NICOM cardiac output trending nursing", sec: ["thoracic impedance"], intent: "lab_interpretation", cat: "Critical care" },
      { title: "Why Alarm Fatigue Is a Patient Safety Failure Mode in Monitoring Questions", pk: "alarm fatigue patient safety nursing", sec: ["escalation"], intent: "failure_state", cat: "Safety" },
    ],
  },
  {
    id: "cluster-labs-chem-panel-edges",
    pillar: "Chemistries Beyond ‘High or Low’",
    items: [
      { title: "Corrected Sodium for Hyperglycemia: When the ‘Corrected’ Number Changes Triage", pk: "corrected sodium hyperglycemia nursing calculation", sec: ["osmolality"], intent: "lab_interpretation", cat: "Labs" },
      { title: "Why Chloride Trends Help Solve Metabolic Acidosis ‘Mysteries’", pk: "chloride metabolic acidosis nursing gap", sec: ["NAG"], intent: "mechanism", cat: "Acid–base" },
      { title: "BUN:Creatinine Ratio: Prerenal Story vs Not—Exam Limits", pk: "BUN creatinine ratio prerenal nursing limits", sec: ["GI bleed"], intent: "edge_case", cat: "Renal" },
      { title: "Why Albumin Changes Drug Binding Teaching for Phenytoin and Warfarin", pk: "albumin drug binding phenytoin nursing", sec: ["free fraction"], intent: "mechanism", cat: "Pharmacology" },
      { title: "Triglyceride Interference in Some Lab Assays: When Glucose Looks Wrong", pk: "lipemic sample lab interference nursing", sec: ["hemolysis"], intent: "edge_case", cat: "Labs" },
      { title: "Why Magnesium Is Routinely Checked With Refractory Hypokalemia Protocols", pk: "magnesium check refractory hypokalemia nursing", sec: ["replacement"], intent: "clinical_decision", cat: "Electrolytes" },
      { title: "Why Ionized Calcium Must Be Interpreted With pH on the Same ABG", pk: "ionized calcium pH interaction nursing", sec: ["alkalosis"], intent: "mechanism", cat: "Labs" },
      { title: "Why ‘Critical Lab’ Callback Processes Exist—Chain of Responsibility Items", pk: "critical lab callback nursing responsibility", sec: ["read back"], intent: "clinical_decision", cat: "Safety" },
    ],
  },
  {
    id: "cluster-transplant-immuno-edges",
    pillar: "Transplant & Immunosuppression",
    items: [
      { title: "Rejection vs Infection Fever: Immunosuppression Fork in Exam Stems", pk: "transplant rejection vs infection fever nursing", sec: ["biopsy"], intent: "micro_comparison", cat: "Transplant" },
      { title: "Why Tacrolimus Levels Are Time-Sensitive to Dose and GI Function", pk: "tacrolimus level timing nursing", sec: ["diarrhea"], intent: "edge_case", cat: "Transplant" },
      { title: "CMV Reactivation: PCR Monitoring Themes for Boards", pk: "CMV PCR transplant monitoring nursing", sec: ["prophylaxis"], intent: "lab_interpretation", cat: "Transplant" },
      { title: "Why Live Donors Still Have Post-Op Complication Priorities in Teaching", pk: "living donor nephrectomy complications nursing", sec: ["bleeding"], intent: "clinical_decision", cat: "Transplant" },
      { title: "Hyperkalemia in Transplant from TMP-SMX vs Tacrolimus: Attribution Traps", pk: "TMP SMX hyperkalemia transplant nursing", sec: ["drug interaction"], intent: "edge_case", cat: "Transplant" },
      { title: "Why PJP Prophylaxis Timing Differs by Center but Shows Up as Teaching Points", pk: "PJP prophylaxis transplant nursing", sec: ["TMP SMX"], intent: "clinical_decision", cat: "Transplant" },
      { title: "Graft Dysfunction Early vs Late: Creatinine Bump Patterns", pk: "kidney graft dysfunction early late nursing", sec: ["Doppler"], intent: "micro_comparison", cat: "Transplant" },
      { title: "Why Immunosuppression Increases Skin Cancer Surveillance Teaching", pk: "transplant skin cancer surveillance nursing", sec: ["sunscreen"], intent: "clinical_decision", cat: "Transplant" },
    ],
  },
  {
    id: "cluster-environmental-occupational",
    pillar: "Environmental & Occupational Exposures",
    items: [
      { title: "Heat Stroke vs Heat Exhaustion: CNS Changes as the Non-Negotiable Splitter", pk: "heat stroke vs heat exhaustion CNS nursing", sec: ["temperature"], intent: "micro_comparison", cat: "Environmental" },
      { title: "Why Carbon Monoxide Poisoning Needs Co-Oximetry—Not SpO2 Alone", pk: "carbon monoxide co oximetry nursing", sec: ["100% O2"], intent: "clinical_decision", cat: "Toxicology" },
      { title: "Organophosphate Exposure: Cholinergic Excess Without ‘Classic’ Pupil Story in Some Items", pk: "organophosphate atypical presentation nursing", sec: ["bradycardia"], intent: "edge_case", cat: "Toxicology" },
      { title: "Why Fresh Frozen Plasma Timing Matters in Warfarin-Related ICH Teaching", pk: "warfarin ICH FFP PCC nursing timing", sec: ["INR"], intent: "clinical_decision", cat: "Neuro" },
      { title: "Lightning Injury: Keraunoparalysis vs Spinal Injury Differentiation", pk: "lightning injury keraunoparalysis nursing", sec: ["ECG"], intent: "edge_case", cat: "Environmental" },
      { title: "Why Drowning Pathophysiology Centers on Hypoxia and Aspiration—Not Just ‘Water in Lungs’", pk: "drowning pathophysiology hypoxia nursing", sec: ["ARDS"], intent: "mechanism", cat: "Environmental" },
      { title: "Hypothermia Cardiac Irritability: Why Rough Movement Is a Trap Answer", pk: "hypothermia cardiac irritability nursing movement", sec: ["VF"], intent: "clinical_decision", cat: "Environmental" },
      { title: "Why Occupational Asthma Timing (Workdays) Appears in Public Health Items", pk: "occupational asthma work related nursing", sec: ["peak flow"], intent: "case_based", cat: "Occupational" },
    ],
  },
  {
    id: "cluster-overflow-longtail",
    pillar: "Long-Tail Clinical Reasoning (Reserve)",
    items: [
      { title: "Why Beta-Blockers Can Mask Hypoglycemia Symptoms But Not the Low Glucose Itself", pk: "beta blocker masked hypoglycemia nursing mechanism", sec: ["tremor"], intent: "mechanism", cat: "Pharmacology" },
      { title: "Pseudohyponatremia From Hyperlipidemia: Lab Artifact vs True Dilution", pk: "pseudohyponatremia hyperlipidemia lab artifact nursing", sec: ["lipids"], intent: "edge_case", cat: "Labs" },
      { title: "Why Urine Chloride Helps Split Metabolic Alkalosis Mechanisms on Exams", pk: "urine chloride metabolic alkalosis nursing", sec: ["vomiting"], intent: "lab_interpretation", cat: "Acid–base" },
      { title: "Fat Embolism Syndrome vs PE: Petechiae and Neurologic Changes as Splitters", pk: "fat embolism vs PE petechiae nursing", sec: ["long bone"], intent: "micro_comparison", cat: "Critical care" },
      { title: "Why Neutropenic Fever Guidelines Emphasize Speed Before Organism Identification", pk: "neutropenic fever empiric antibiotics timing nursing", sec: ["ANC"], intent: "clinical_decision", cat: "Oncology" },
      { title: "Torsades Risk Without ‘Long QT’ on EKG: Short-Coupled PVC Themes", pk: "torsades without long QT nursing exam", sec: ["magnesium"], intent: "edge_case", cat: "Cardiovascular" },
      { title: "Why Hypothyroid Myxedema Crisis Looks Like Sepsis in Some Stems", pk: "myxedema coma vs sepsis nursing differentiation", sec: ["temperature"], intent: "micro_comparison", cat: "Endocrine" },
      { title: "Why IV Phenytoin Needs Cardiac Monitoring Even When Given for Seizures", pk: "phenytoin IV cardiac monitoring nursing", sec: ["arrhythmia"], intent: "clinical_decision", cat: "Neuro" },
      { title: "Why Bowel Sounds Can Be Hyperactive in Early Obstruction but Absent in Late Perforation Risk", pk: "bowel sounds obstruction vs perforation nursing", sec: ["rigidity"], intent: "clinical_decision", cat: "GI" },
      { title: "Why ‘Clear Lungs’ Does Not Rule Out PE in Exam Items", pk: "PE clear lung exam nursing trap", sec: ["d-dimer"], intent: "edge_case", cat: "Respiratory" },
      { title: "Why Nighttime Hypoglycemia Shows Up as Morning Headaches in Type 1 Teaching", pk: "nocturnal hypoglycemia morning headache nursing", sec: ["CGM"], intent: "case_based", cat: "Endocrine" },
      { title: "Why Aortic Dissection Pain Can Migrate as the Tear Extends—Testable Story", pk: "aortic dissection migrating pain nursing", sec: ["blood pressure arms"], intent: "edge_case", cat: "Cardiovascular" },
    ],
  },
];

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

const PATHWAY_ROTATION = [];
for (let i = 0; i < 80; i++) PATHWAY_ROTATION.push("RN");
for (let i = 0; i < 60; i++) PATHWAY_ROTATION.push("PN");
for (let i = 0; i < 60; i++) PATHWAY_ROTATION.push("NP");
for (let i = PATHWAY_ROTATION.length - 1; i > 0; i--) {
  const j = (i * 41 + 7) % (i + 1);
  [PATHWAY_ROTATION[i], PATHWAY_ROTATION[j]] = [PATHWAY_ROTATION[j], PATHWAY_ROTATION[i]];
}

function buildPosts() {
  const posts = [];
  let idx = 0;
  let rejected = 0;
  const SIM_REJECT = 0.65;
  const UNIQ_MIN = 0.8;

  const { tokenized, pairKeys } = loadCorpus();

  for (const cluster of CLUSTER_SEEDS) {
    for (const item of cluster.items) {
      const pathway = PATHWAY_ROTATION[idx];
      const pk = `${item.pk} [w2v2 ${pathway}]`;
      const slug = `w2v2-${pathway.toLowerCase()}-${cluster.id}-${idx}-${slugify(item.title)}`;
      const candidate = {
        title: item.title,
        slug,
        primaryKeyword: pk,
        secondaryKeywords: item.sec,
        pathway,
        category: item.cat,
        searchIntent: item.intent,
        clusterId: cluster.id,
        pillarTopic: cluster.pillar,
        relatedLessonPaths: [
          "/us/rn/nclex-rn/lessons/fluids-electrolytes-emergencies-gold",
          "/us/rn/nclex-rn/lessons/dka-hhs-hyperglycemic-emergencies-gold",
          "/us/rn/nclex-rn/lessons/heart-failure-nclex-rn",
        ],
        relatedToolPaths: ["/tools/lab-values", "/tools/electrolyte-abg", "/tools/med-math"],
        breadcrumbPath: `/blog/tag/${cluster.id}`,
      };

      const candTokens = tokenSet(combinedDoc({ ...candidate, secondaryKeywords: candidate.secondaryKeywords }));
      let maxSim = 0;
      for (const doc of tokenized) {
        const sim = jaccard(candTokens, doc.tokens);
        if (sim > maxSim) maxSim = sim;
      }
      const uniquenessScore = Math.round((1 - maxSim) * 100) / 100;

      const pk2 = comparisonPairKey(item.title);
      let blocked = false;
      if (pk2 && pairKeys.has(pk2)) blocked = true;

      if (maxSim > SIM_REJECT || blocked || uniquenessScore < UNIQ_MIN) {
        rejected++;
        continue;
      }

      posts.push({
        id: posts.length + 1,
        ...candidate,
        uniquenessScore,
        status: "planned",
      });
      idx++;
      if (posts.length >= 200) break;
    }
    if (posts.length >= 200) break;
  }

  return { posts, rejected, tokenized };
}

const result = buildPosts();
if (result.posts.length < 200) {
  console.error("Need more seeds: got", result.posts.length);
  process.exit(1);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  wave: 2,
  version: 2,
  count: result.posts.length,
  uniquenessEngine: {
    similarityMetric: "jaccard_token_set",
    stopwordFiltered: true,
    rejectSimilarityGt: 0.65,
    requireUniquenessScoreGte: 0.8,
    uniquenessScoreDefinition: "1 - maxSimilarityToExistingCorpus",
  },
  sourcesIndexed: [
    "data/blog-manifest/existing-topics-wave1-baseline.json",
    "data/blog-manifest/nclex-seo-100.manifest.json",
    "data/blog-import-wave2/*.json",
  ],
  blogImportNote: fs.existsSync(path.join(root, "data/blog-import")) ? null : "data/blog-import/ not present — skipped",
  posts: result.posts,
};

fs.mkdirSync(path.join(root, "data/blog-manifest"), { recursive: true });
fs.writeFileSync(path.join(root, "data/blog-manifest/pathophysiology-200-wave2.manifest.json"), JSON.stringify(manifest, null, 2));

const scores = result.posts.map((p) => p.uniquenessScore);
const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
const totalSeedPool = CLUSTER_SEEDS.reduce((n, c) => n + c.items.length, 0);

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(root, "reports/blog-wave2-uniqueness-report.json"),
  JSON.stringify(
    {
      generatedAt: manifest.generatedAt,
      totalTopicsGenerated: result.posts.length,
      duplicatesPrevented: result.rejected,
      seedsEvaluated: result.rejected + result.posts.length,
      totalSeedPool,
      overflowSeedsAvailable: totalSeedPool - 200,
      rejectedCount: result.rejected,
      averageUniquenessScore: Math.round(avg * 1000) / 1000,
      minUniquenessScore: Math.min(...scores),
      maxUniquenessScore: Math.max(...scores),
      clustersCreated: [...new Set(result.posts.map((p) => p.clusterId))].length,
      clusterIds: [...new Set(result.posts.map((p) => p.clusterId))],
      corpusDocuments: result.tokenized.length,
      note: "Similarity uses token Jaccard after stopword filtering; clinical nuance beyond tokens requires human editorial review.",
    },
    null,
    2,
  ),
);

console.log("posts", result.posts.length, "rejected", result.rejected, "avg uniq", avg);
