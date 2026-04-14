#!/usr/bin/env node
/**
 * Writes allied-400-seed-candidates.mjs — 400+ unique allied exam topics (ordered by profession quotas).
 * Run: node scripts/generate-allied-seed-module.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "allied-400-seed-candidates.mjs");

const usedTitles = new Set();

function add(seed) {
  if (usedTitles.has(seed.title)) throw new Error(`dup title: ${seed.title}`);
  usedTitles.add(seed.title);
  return seed;
}

function sec5(a, b, c, d, e) {
  return [a, b, c, d, e];
}

/** ---------- Profession grids: unique titles via A×B product ---------- */
const RRT_A = [
  "auto-PEEP",
  "intrinsic PEEP",
  "airway resistance",
  "respiratory system compliance",
  "inspiratory time fraction",
  "pressure support level",
  "mean airway pressure",
  "APRV release timing",
  "HFOV amplitude",
  "bias flow on HFNC",
];
const RRT_B = [
  "COPD exacerbation",
  "status asthmaticus",
  "ARDS lung protection",
  "post-extubation stridor",
  "neuromuscular weakness",
  "morbid obesity hypoventilation",
  "inhalation injury",
  "postoperative abdominal splinting",
];

const MLT_A = [
  "hemolysis pattern",
  "lipemic interference",
  "icteric interference",
  "pre-analytical delay",
  "specimen hemoconcentration",
  "cold agglutinin effect",
  "schistocyte burden",
  "microclot in serum tube",
  "wrong tube draw order",
  "hemolyzed potassium",
];
const MLT_B = [
  "CBC differential accuracy",
  "coagulation cascade timing",
  "troponin serial strategy",
  "lactate stability",
  "A1c assay method",
  "CSF cell count",
  "therapeutic drug monitoring",
];

const RAD_A = [
  "beam hardening artifact",
  "motion artifact",
  "metal streak artifact",
  "dual-energy interpretation",
  "ultrasound aliasing",
  "MRI susceptibility signal",
  "PET SUV nuance",
  "mammography compression",
  "fluoro pulse rate",
  "DEXA positioning error",
];
const RAD_B = [
  "trauma pan-scan",
  "PE protocol CT",
  "stroke CTA timing",
  "contrast reaction pathway",
  "pediatric ALARA",
  "pregnancy screening",
];

const EMS_A = [
  "scene time pressure",
  "standing order variance",
  "protocol deviation documentation",
  "airway reflex loss",
  "tension pneumothorax decompression",
  "post-ROSC ventilation",
  "hypothermia packaging",
  "burn fluid triage",
  "obstetric field delivery",
  "pediatric Broselow drift",
];
const EMS_B = [
  "cardiac arrest pit crew",
  "polytrauma load-and-go",
  "respiratory distress CPAP",
  "anaphylaxis IM epinephrine",
  "opioid overdose naloxone",
  "stroke bypass criteria",
];

const PHARM_A = [
  "beyond-use dating",
  "USP 797 garbing",
  "high-alert look-alike",
  "refrigerator excursion",
  "barcode mismatch",
  "auxiliary label requirement",
  "DEA schedule transfer",
  "sterile compounding hood flow",
  "chemo closed-system transfer",
  "warfarin INR counseling",
];
const PHARM_B = [
  "community pharmacy workflow",
  "hospital Pyxis override",
  "long-term care MAR",
  "unit dose packaging",
  "prior authorization stall",
];

const PTA_A = [
  "closed-chain loading",
  "open-chain terminal extension",
  "eccentric control",
  "proprioception drills",
  "gait belt angle",
  "transfer pivot timing",
  "therapeutic exercise dosage",
  "balance progression",
  "NMES parameter choice",
  "post-op TKA precautions",
];
const PTA_B = [
  "total hip posterior approach",
  "ACL graft protocol",
  "stroke hemiplegia",
  "spinal stenosis neurogenic claudication",
];

const OTA_A = [
  "ADL grading",
  "energy conservation",
  "joint protection",
  "cognitive strategy training",
  "splint wear schedule",
  "home safety lighting",
  "falls fear hierarchy",
  "IADL meal prep",
  "low vision adaptation",
  "pediatric play grading",
];
const OTA_B = [
  "COPD pacing",
  "rheumatoid hand deformity",
  "CVA neglect",
  "ASD sensory routine",
];

const SW_A = [
  "mandated reporting boundary",
  "capacity vs consent",
  "involuntary hold criteria",
  "duty to warn nuance",
  "dual relationship trap",
  "documentation minimization risk",
  "cultural formulation",
  "trauma-informed pacing",
  "MI spirit vs technique",
  "discharge planning leverage",
];
const SW_B = [
  "suicide risk formulation",
  "elder self-neglect",
  "DV lethality assessment",
  "child welfare referral",
  "housing instability crisis",
];

/** Deterministic shuffle so consecutive seeds are not structurally identical (lowers title-token Jaccard) */
function shuffleOrder(n, salt) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = (i * 17 + salt * 23 + 13) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ORDER_RRT = shuffleOrder(80, 1);
const ORDER_MLT = shuffleOrder(70, 2);
const ORDER_RAD = shuffleOrder(60, 3);
const ORDER_EMS = shuffleOrder(60, 4);
const ORDER_PHARM = shuffleOrder(50, 5);
const ORDER_PTA = shuffleOrder(20, 6);
const ORDER_OTA = shuffleOrder(20, 7);
const ORDER_SW = shuffleOrder(40, 8);

function titleRRT(i) {
  const p = ORDER_RRT[i];
  const a = RRT_A[p % 10];
  const b = RRT_B[Math.floor(p / 10) % RRT_B.length];
  return `Why ${a} Shifts Interpretation of ${b} on Ventilator Management (RRT Boards)`;
}
function titleMLT(i) {
  const p = ORDER_MLT[i];
  const a = MLT_A[p % 10];
  const b = MLT_B[Math.floor(p / 10) % MLT_B.length];
  return `How to Interpret ${a} When ${b} Is the Exam Stem (MLT)`;
}
function titleRAD(i) {
  const p = ORDER_RAD[i];
  const a = RAD_A[p % 10];
  const b = RAD_B[Math.floor(p / 10) % RAD_B.length];
  return `Early Signs of ${a} vs True Pathology on ${b} (Imaging Exam)`;
}
function titleEMS(i) {
  const p = ORDER_EMS[i];
  const a = EMS_A[p % 10];
  const b = EMS_B[Math.floor(p / 10) % EMS_B.length];
  return `What to Do First When ${a} Collides With ${b} (EMS Protocol Logic)`;
}
function titlePHARM(i) {
  const p = ORDER_PHARM[i];
  const a = PHARM_A[p % 10];
  const b = PHARM_B[Math.floor(p / 10) % PHARM_B.length];
  return `Failure States: What Happens If ${a} Breaks Down in ${b} (Pharmacy Technician)`;
}
function titlePTA(i) {
  const p = ORDER_PTA[i];
  const a = PTA_A[p % 10];
  const b = PTA_B[Math.floor(p / 10) % PTA_B.length];
  return `Procedure Logic: Why ${a} Matters for ${b} (PTA Exam)`;
}
function titleOTA(i) {
  const p = ORDER_OTA[i];
  const a = OTA_A[p % 10];
  const b = OTA_B[Math.floor(p / 10) % OTA_B.length];
  return `Clinical Decision: How ${a} Changes ${b} Plans (OTA Exam)`;
}
function titleSW(i) {
  const p = ORDER_SW[i];
  const a = SW_A[p % 10];
  const b = SW_B[Math.floor(p / 10) % SW_B.length];
  return `Case-Based Reasoning: ${a} and ${b} (Clinical Social Work Exam)`;
}

/** ---------- Cluster metadata (pillars + supporting topics) ---------- */
const RRT_META = [
  {
    clusterId: "cluster-rrt-ventilation-gas-exchange",
    pillarTopic: "Ventilation and gas exchange",
    supportingTopics: ["V/Q mismatch", "dead space", "oxygen devices", "graphics interpretation"],
    cat: "Mechanical ventilation",
  },
  {
    clusterId: "cluster-rrt-airway-procedures",
    pillarTopic: "Airway adjuncts and procedures",
    supportingTopics: ["suction depth", "ET tube cues", "difficult airway adjuncts", "cuff pressure"],
    cat: "Airway",
  },
  {
    clusterId: "cluster-rrt-neonatal-peds",
    pillarTopic: "Neonatal and pediatric respiratory care",
    supportingTopics: ["oxygen targeting", "apnea monitoring", "surfactant context", "HFNC in pediatrics"],
    cat: "Pediatric RT",
  },
  {
    clusterId: "cluster-rrt-pft-diagnostics",
    pillarTopic: "Pulmonary function and diagnostics",
    supportingTopics: ["spirometry quality", "bronchodilator response", "diffusion interpretation", "body plethysmography"],
    cat: "Diagnostics",
  },
  {
    clusterId: "cluster-rrt-home-equipment",
    pillarTopic: "Home respiratory equipment",
    supportingTopics: ["CPAP adherence", "bilevel settings", "oxygen conserving", "ventilator alarms at home"],
    cat: "Home care",
  },
  {
    clusterId: "cluster-rrt-infection-iso",
    pillarTopic: "Infection control and isolation",
    supportingTopics: ["nebulizer hygiene", "vent circuit policy", "TB isolation", "PPE sequence"],
    cat: "Infection prevention",
  },
  {
    clusterId: "cluster-rrt-hemodynamics-icu",
    pillarTopic: "Hemodynamics and ICU integration",
    supportingTopics: ["oxygen delivery", "ScvO2 context", "prone coordination", "ECMO interface basics"],
    cat: "Critical care",
  },
  {
    clusterId: "cluster-rrt-special-modes",
    pillarTopic: "Special ventilation modes and rescue",
    supportingTopics: ["APRV", "HFOV", "airway pressure release", "nitric oxide eligibility"],
    cat: "Advanced ventilation",
  },
  {
    clusterId: "cluster-rrt-weaning-extubation",
    pillarTopic: "Weaning and extubation readiness",
    supportingTopics: ["SBT", "cuff leak", "RSBI", "post-extubation surveillance"],
    cat: "Weaning",
  },
  {
    clusterId: "cluster-rrt-ethics-scope",
    pillarTopic: "Ethics, scope, and transport",
    supportingTopics: ["RT scope", "do-not-intubate context", "inter-facility transport", "resource triage"],
    cat: "Professional practice",
  },
];

const MLT_META = [
  { clusterId: "cluster-mlt-hematology-coag", pillarTopic: "Hematology and coagulation", supportingTopics: ["smear review", "INR timing", "D-dimer use", "platelet clumping"], cat: "Hematology" },
  { clusterId: "cluster-mlt-chemistry-renal", pillarTopic: "Chemistry and renal", supportingTopics: ["eGFR", "anion gap", "osmolality", "urine microalbumin"], cat: "Chemistry" },
  { clusterId: "cluster-mlt-micro-id", pillarTopic: "Microbiology and infectious disease", supportingTopics: ["culture workup", "AST reporting", "blood culture volume", "TB testing"], cat: "Microbiology" },
  { clusterId: "cluster-mlt-blood-bank", pillarTopic: "Immunohematology", supportingTopics: ["ABO discrepancy", "antibody screen", "DAT interpretation", "crossmatch"], cat: "Blood bank" },
  { clusterId: "cluster-mlt-urinalysis", pillarTopic: "Urinalysis and body fluids", supportingTopics: ["casts", "crystals", "CSF glucose ratio", "synovial fluid"], cat: "Urinalysis" },
  { clusterId: "cluster-mlt-qc-stats", pillarTopic: "QC, Westgard, and method validation", supportingTopics: ["Levy-Jennings", "Westgard rules", "linear range", "proficiency testing"], cat: "Laboratory QA" },
  { clusterId: "cluster-mlt-safety-phlebotomy", pillarTopic: "Phlebotomy and safety", supportingTopics: ["order of draw", "needlestick", "patient ID", "hemolysis prevention"], cat: "Specimen collection" },
  { clusterId: "cluster-mlt-endocrine-tumor", pillarTopic: "Endocrine and tumor markers", supportingTopics: ["TSH reflex", "troponin serial", "PSA caveats", "A1c interference"], cat: "Special chemistry" },
  { clusterId: "cluster-mlt-molecular", pillarTopic: "Molecular and molecular adjuncts", supportingTopics: ["PCR inhibition", "LDT context", "point-of-care molecular", "result reporting"], cat: "Molecular" },
  { clusterId: "cluster-mlt-lab-operations", pillarTopic: "Lab operations and informatics", supportingTopics: ["LIS flags", "critical value policy", "specimen tracking", "TAT metrics"], cat: "Operations" },
];

const RAD_META = [
  { clusterId: "cluster-rad-ct-protocols", pillarTopic: "CT protocols and contrast", supportingTopics: ["contrast timing", "renal risk", "oral contrast", "trauma phases"], cat: "CT" },
  { clusterId: "cluster-rad-mri-safety", pillarTopic: "MRI safety and physics", supportingTopics: ["implant screening", "zones", "SAR", "projectile risk"], cat: "MRI" },
  { clusterId: "cluster-rad-xr-positioning", pillarTopic: "Radiography positioning", supportingTopics: ["orthogonal views", "magnification", "SID", "grid use"], cat: "Radiography" },
  { clusterId: "cluster-rad-fluoro-interventional", pillarTopic: "Fluoroscopy and IR support", supportingTopics: ["pulse rate", "dose area product", "sterile field", "contrast load"], cat: "Fluoroscopy" },
  { clusterId: "cluster-rad-us-doppler", pillarTopic: "Ultrasound and Doppler", supportingTopics: ["color aliasing", "spectral window", "compression", "FAST"], cat: "Ultrasound" },
  { clusterId: "cluster-rad-mammo-breast", pillarTopic: "Mammography and breast imaging", supportingTopics: ["compression", "BIRADS lexicon", "tomosynthesis", "density"], cat: "Mammography" },
  { clusterId: "cluster-rad-peds-alara", pillarTopic: "Pediatric imaging and ALARA", supportingTopics: ["shielding", "parent holding", "repeat reduction", "protocol adaptation"], cat: "Pediatric imaging" },
  { clusterId: "cluster-rad-nuclear-pet", pillarTopic: "Nuclear medicine and PET", supportingTopics: ["radiopharmaceutical half-life", "uptake time", "SUV caveats", "hydration"], cat: "Nuclear" },
  { clusterId: "cluster-rad-bone-dexa", pillarTopic: "DEXA and bone density", supportingTopics: ["T-score", "FRAX context", "positioning", "artifact"], cat: "DEXA" },
  { clusterId: "cluster-rad-ethics-privacy", pillarTopic: "Ethics, privacy, and communication", supportingTopics: ["HIPAA imaging", "incidental findings", "patient handoff", "team communication"], cat: "Professional practice" },
];

const EMS_META = [
  { clusterId: "cluster-ems-airway-vent", pillarTopic: "EMS airway and ventilation", supportingTopics: ["OPA vs NPA", "ET placement checks", "capnography field", "BVM pitfalls"], cat: "Airway" },
  { clusterId: "cluster-ems-cardiac-arrest", pillarTopic: "Cardiac arrest and post-arrest", supportingTopics: ["CPR quality", "rhythm management", "ROSC care", "termination"], cat: "Cardiac arrest" },
  { clusterId: "cluster-ems-trauma-bleeding", pillarTopic: "Trauma and hemorrhage control", supportingTopics: ["tourniquet", "TXA timing", "massive transfusion field", "spinal motion"], cat: "Trauma" },
  { clusterId: "cluster-ems-medical-respiratory", pillarTopic: "Medical respiratory emergencies", supportingTopics: ["asthma IM", "COPD CPAP", "PE suspicion", "pneumonia sepsis"], cat: "Respiratory" },
  { clusterId: "cluster-ems-neuro-stroke", pillarTopic: "Neurologic and stroke", supportingTopics: ["stroke scales", "glucose first", "seizure management", "post-tPA monitoring"], cat: "Neurology" },
  { clusterId: "cluster-ems-environmental", pillarTopic: "Environmental and toxicology", supportingTopics: ["heat stroke", "hypothermia", "CO exposure", "opioid tox"], cat: "Environmental" },
  { clusterId: "cluster-ems-ob-peds", pillarTopic: "Obstetric and pediatric EMS", supportingTopics: ["APGAR field", "neonatal resuscitation", "preeclampsia seizure", "pediatric dosing"], cat: "OB/Peds" },
  { clusterId: "cluster-ems-operations", pillarTopic: "EMS operations and MCI", supportingTopics: ["triage tags", "radio report", "helicopter criteria", "scene safety"], cat: "Operations" },
  { clusterId: "cluster-ems-pharm-scope", pillarTopic: "EMS pharmacology and scope", supportingTopics: ["standing orders", "medication errors", "allergy documentation", "online medical control"], cat: "Pharmacology" },
  { clusterId: "cluster-ems-ethics-law", pillarTopic: "EMS ethics and legal", supportingTopics: ["consent", "refusal documentation", "HIPAA scene", "abuse reporting"], cat: "Ethics" },
];

const PHARM_META = [
  { clusterId: "cluster-pharm-compounding-sterile", pillarTopic: "Sterile compounding", supportingTopics: ["ISO classes", "beyond-use", "media fill", "environmental monitoring"], cat: "Compounding" },
  { clusterId: "cluster-pharm-compounding-nonsterile", pillarTopic: "Nonsterile compounding", supportingTopics: ["USP 795", "master formulation", "stability", "labeling"], cat: "Compounding" },
  { clusterId: "cluster-pharm-inventory-receiving", pillarTopic: "Inventory and receiving", supportingTopics: ["cold chain", "recalls", "DEA logs", "shortage substitution"], cat: "Operations" },
  { clusterId: "cluster-pharm-dispensing-safety", pillarTopic: "Dispensing and medication safety", supportingTopics: ["DUR", "interaction checks", "high-alert", "look-alike sound-alike"], cat: "Dispensing" },
  { clusterId: "cluster-pharm-regulatory", pillarTopic: "Regulatory and controlled substances", supportingTopics: ["DEA schedules", "PDMP", "pseudoephedrine", "controlled counts"], cat: "Regulatory" },
  { clusterId: "cluster-pharm-calculations", pillarTopic: "Pharmacy calculations", supportingTopics: ["dose conversions", "alligation", "IV rate", "pediatric mg/kg"], cat: "Calculations" },
  { clusterId: "cluster-pharm-patient-education", pillarTopic: "Patient counseling", supportingTopics: ["SIG clarity", "auxiliary labels", "device teaching", "language access"], cat: "Counseling" },
  { clusterId: "cluster-pharm-informatics", pillarTopic: "Technology and informatics", supportingTopics: ["e-prescribing", "barcode administration", "billing codes", "prior auth"], cat: "Informatics" },
  { clusterId: "cluster-pharm-hospital-ops", pillarTopic: "Hospital pharmacy operations", supportingTopics: ["Pyxis", "ADC overrides", "cart fill", "sterile batching"], cat: "Hospital" },
  { clusterId: "cluster-pharm-ethics-scope", pillarTopic: "Ethics and technician scope", supportingTopics: ["tech vs pharmacist tasks", "error disclosure policy", "confidentiality", "fraud awareness"], cat: "Professional practice" },
];

const PTA_META = [
  { clusterId: "cluster-pta-msk-ortho", pillarTopic: "Orthopedic rehabilitation", supportingTopics: ["TKA progression", "hip precautions", "WB status", "ROM goals"], cat: "Orthopedics" },
  { clusterId: "cluster-pta-neuro", pillarTopic: "Neurologic rehabilitation", supportingTopics: ["stroke gait", "balance", "fall prevention", "tone management"], cat: "Neurology" },
  { clusterId: "cluster-pta-cardiopulm", pillarTopic: "Cardiopulmonary rehab", supportingTopics: ["METs", "telemetry", "oxygen titration", "RPE"], cat: "Cardiopulmonary" },
  { clusterId: "cluster-pta-peds-geriatrics", pillarTopic: "Pediatric and geriatric mobility", supportingTopics: ["developmental play", "assistive devices", "transfer training", "endurance"], cat: "Lifespan" },
  { clusterId: "cluster-pta-ethics-scope", pillarTopic: "PTA scope and documentation", supportingTopics: ["delegation", "SOAP notes", "billing time", "infection control"], cat: "Professional practice" },
];

const OTA_META = [
  { clusterId: "cluster-ota-adl-iadl", pillarTopic: "ADL and IADL training", supportingTopics: ["energy conservation", "joint protection", "cognitive strategies", "home mods"], cat: "Occupations" },
  { clusterId: "cluster-ota-hand-splinting", pillarTopic: "Hand therapy and splinting", supportingTopics: ["static vs dynamic", "wear schedule", "edema control", "scar management"], cat: "Hand" },
  { clusterId: "cluster-ota-peds-behavior", pillarTopic: "Pediatric and sensory approaches", supportingTopics: ["sensory diet", "play grading", "school IEP context", "behavior support"], cat: "Pediatrics" },
  { clusterId: "cluster-ota-mental-health", pillarTopic: "Mental health occupations", supportingTopics: ["routine structure", "safety planning", "group norms", "motivational interviewing"], cat: "Mental health" },
  { clusterId: "cluster-ota-ethics-scope", pillarTopic: "OTA scope and ethics", supportingTopics: ["collaboration", "documentation", "cultural humility", "HIPAA"], cat: "Professional practice" },
];

const SW_META = [
  { clusterId: "cluster-sw-assessment-diagnosis", pillarTopic: "Biopsychosocial assessment", supportingTopics: ["risk assessment", "strengths-based intake", "collateral info", "diagnostic overshadowing"], cat: "Assessment" },
  { clusterId: "cluster-sw-intervention-planning", pillarTopic: "Intervention and care planning", supportingTopics: ["SMART goals", "motivational interviewing", "care coordination", "group modalities"], cat: "Intervention" },
  { clusterId: "cluster-sw-ethics-law", pillarTopic: "Ethics and law", supportingTopics: ["confidentiality", "mandated reporting", "capacity", "duty to warn"], cat: "Ethics" },
  { clusterId: "cluster-sw-populations", pillarTopic: "Populations and settings", supportingTopics: ["hospital discharge", "school social work", "substance use", "housing-first"], cat: "Populations" },
  { clusterId: "cluster-sw-documentation-supervision", pillarTopic: "Documentation and supervision", supportingTopics: ["SOAP vs DAP", "supervision hours", "peer consultation", "audit readiness"], cat: "Professional practice" },
  { clusterId: "cluster-sw-trauma-crisis", pillarTopic: "Trauma and crisis intervention", supportingTopics: ["psychological first aid", "safety planning", "lethality", "de-escalation"], cat: "Crisis" },
  { clusterId: "cluster-sw-policy-advocacy", pillarTopic: "Policy and advocacy", supportingTopics: ["benefits navigation", "appeals", "community resources", "macro practice"], cat: "Advocacy" },
  { clusterId: "cluster-sw-research-evidence", pillarTopic: "Evidence-informed practice", supportingTopics: ["EBP appraisal", "program evaluation", "outcome measurement", "cultural adaptation"], cat: "Research" },
];

const INTENTS_ROT = [
  "mechanism",
  "clinical_decision",
  "interpretation",
  "micro_comparison",
  "failure_deterioration",
  "case_based",
  "procedure_logic",
];

function intentAt(globalIdx) {
  return INTENTS_ROT[globalIdx % INTENTS_ROT.length];
}

function buildRows() {
  const rows = [];

  for (let i = 0; i < 80; i++) {
    const m = RRT_META[Math.floor(i / 8) % RRT_META.length];
    const title = titleRRT(i);
    rows.push(
      add({
        profession: "Respiratory Therapy (RRT)",
        professionKey: "respiratory",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `RRT ${title.slice(0, 90)} exam prep`,
        secondaryKeywords: sec5("NBRC", "mechanical ventilation", m.cat.toLowerCase(), "gas exchange", "registry item"),
        category: m.cat,
        searchIntent: intentAt(i),
      }),
    );
  }

  for (let i = 0; i < 70; i++) {
    const m = MLT_META[Math.floor(i / 7) % MLT_META.length];
    const title = titleMLT(i);
    rows.push(
      add({
        profession: "Medical Laboratory Technology (MLT)",
        professionKey: "mlt",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `MLT ASCP ${title.slice(0, 85)}`,
        secondaryKeywords: sec5("pre-analytical", "QC", "laboratory safety", "result verification", "hematology chemistry"),
        category: m.cat,
        searchIntent: intentAt(i + 80),
      }),
    );
  }

  for (let i = 0; i < 60; i++) {
    const m = RAD_META[Math.floor(i / 6) % RAD_META.length];
    const title = titleRAD(i);
    rows.push(
      add({
        profession: "Radiology & Medical Imaging",
        professionKey: "imaging",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `radiologic technologist ${title.slice(0, 85)}`,
        secondaryKeywords: sec5("ALARA", "contrast safety", "positioning", "ARRT style", "image quality"),
        category: m.cat,
        searchIntent: intentAt(i + 150),
      }),
    );
  }

  for (let i = 0; i < 60; i++) {
    const m = EMS_META[Math.floor(i / 6) % EMS_META.length];
    const title = titleEMS(i);
    rows.push(
      add({
        profession: "Paramedic / EMS",
        professionKey: "paramedic",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `paramedic NREMT ${title.slice(0, 85)}`,
        secondaryKeywords: sec5("protocol", "scene safety", "documentation", "medical direction", "triage"),
        category: m.cat,
        searchIntent: intentAt(i + 210),
      }),
    );
  }

  for (let i = 0; i < 50; i++) {
    const m = PHARM_META[Math.floor(i / 5) % PHARM_META.length];
    const title = titlePHARM(i);
    rows.push(
      add({
        profession: "Pharmacy Technician",
        professionKey: "pharmacy-tech",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `pharmacy technician PTCB ${title.slice(0, 80)}`,
        secondaryKeywords: sec5("USP", "dispensing", "patient safety", "inventory", "regulatory compliance"),
        category: m.cat,
        searchIntent: intentAt(i + 270),
      }),
    );
  }

  for (let i = 0; i < 20; i++) {
    const m = PTA_META[Math.floor(i / 4) % PTA_META.length];
    const title = titlePTA(i);
    rows.push(
      add({
        profession: "Physical Therapist Assistant (PTA)",
        professionKey: "pta",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `PTA NPTE ${title.slice(0, 85)}`,
        secondaryKeywords: sec5("therapeutic exercise", "gait training", "mobility", "delegation", "rehabilitation"),
        category: m.cat,
        searchIntent: intentAt(i + 320),
      }),
    );
  }

  for (let i = 0; i < 20; i++) {
    const m = OTA_META[Math.floor(i / 4) % OTA_META.length];
    const title = titleOTA(i);
    rows.push(
      add({
        profession: "Occupational Therapy Assistant (OTA)",
        professionKey: "ota",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `OTA NBCOT ${title.slice(0, 85)}`,
        secondaryKeywords: sec5("occupations", "ADL training", "splinting", "activity analysis", "rehabilitation"),
        category: m.cat,
        searchIntent: intentAt(i + 340),
      }),
    );
  }

  for (let i = 0; i < 40; i++) {
    const m = SW_META[Math.floor(i / 5) % SW_META.length];
    const title = titleSW(i);
    rows.push(
      add({
        profession: "Clinical Social Work",
        professionKey: "social-work",
        clusterId: m.clusterId,
        pillarTopic: m.pillarTopic,
        supportingTopics: m.supportingTopics,
        title,
        primaryKeyword: `social work licensing exam ${title.slice(0, 85)}`,
        secondaryKeywords: sec5("ethics", "boundaries", "assessment", "documentation", "intervention planning"),
        category: m.cat,
        searchIntent: intentAt(i + 360),
      }),
    );
  }

  return rows;
}

const rows = buildRows();

const header =
  "/** Auto-generated by scripts/generate-allied-seed-module.mjs — do not hand-edit */\nexport const ALLIED_SEED_CANDIDATES = ";
fs.writeFileSync(out, header + JSON.stringify(rows, null, 2) + ";\n");
console.log("wrote", out, "count", rows.length);
