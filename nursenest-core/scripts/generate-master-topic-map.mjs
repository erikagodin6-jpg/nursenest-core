/**
 * Generates src/content/topic-maps/master-topic-map.json
 * Single source of truth for bulk lesson production (RN / PN / NP / Allied).
 * Run: node scripts/generate-master-topic-map.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "../src/content/topic-maps/master-topic-map.json");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * @param {string} examKey
 * @param {{ id: string, name: string, topics: string[], priority?: string }[]} categories
 */
function buildExam(examKey, label, examFamily, pathwayIds, categories) {
  const used = new Set();
  const outCategories = [];

  for (const cat of categories) {
    const topics = [];
    for (const topicName of cat.topics) {
      let id = slugify(topicName);
      let base = id;
      let n = 2;
      while (used.has(`${examKey}:${id}`)) {
        id = `${base}-${n++}`;
      }
      used.add(`${examKey}:${id}`);

      const priority =
        cat.priorityDefault ??
        (topicName.includes("(HY)") ? "high_yield" : cat.priority ?? "secondary");
      const cleanName = topicName.replace(/\s*\(HY\)\s*$/i, "").trim();

      const siblings = cat.topics
        .map((t) => slugify(t.replace(/\s*\(HY\)\s*$/i, "").trim()))
        .filter((s) => s !== id)
        .slice(0, 6);

      topics.push({
        id,
        name: cleanName,
        priority: topicName.includes("(HY)") ? "high_yield" : priority,
        difficultyDefault: topicName.includes("(HY)") ? 4 : 3,
        prerequisiteTopicIds: [],
        advancedTopicIds: [],
        questionTopicHints: [cleanName, cat.name, examKey],
        relatedToolSlugs: pickTools(cat.id),
        /** Same-category siblings for auto internal linking */
        autoRelatedTopicIds: siblings.filter((x) => x !== id).slice(0, 5),
      });
    }
    outCategories.push({
      id: cat.id,
      name: cat.name,
      topics,
    });
  }

  return {
    exam: examKey,
    label,
    examFamily,
    pathwayIds,
    categories: outCategories,
  };
}

function pickTools(categoryId) {
  const labs = ["labs-reference", "electrolyte-panel"];
  const math = ["med-math-dosage"];
  const cardio = ["ekg-basics"];
  const map = {
    cardiovascular: [...cardio, ...labs],
    respiratory: ["abg-quick-reference", ...labs],
    pharmacology: [...math, "interaction-checklist"],
    "fluids-electrolytes": [...labs, ...math],
    gastrointestinal: [...labs],
    neurological: [...labs],
    endocrine: [...labs, ...math],
    "renal-gu": [...labs],
    hematology: [...labs],
    musculoskeletal: [],
    infectious: [...labs],
    integumentary: [],
    "mental-health": [],
    maternity: [...labs],
    pediatrics: [...labs, ...math],
    leadership: [],
    safety: [],
    nutrition: [],
    "pn-foundation": [...math],
    "np-primary-care": [...labs, ...math],
    "np-acute": [...labs],
    "allied-respiratory": [...labs],
    "allied-lab": [...labs],
    "allied-imaging": [],
    "allied-pharmacy": [...math],
    "allied-therapy": [],
    "allied-emergency": [...labs],
  };
  return map[categoryId] ?? ["labs-reference"];
}

const RN = buildExam("RN", "NCLEX-RN (Registered Nurse)", "NCLEX_RN", ["ca-rn-nclex-rn", "us-rn-nclex-rn"], [
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    priorityDefault: "high_yield",
    topics: [
      "Heart Failure Nursing Priorities (HY)",
      "Acute Myocardial Infarction & Troponin",
      "Shock Recognition & Fluids",
      "Hypertensive Crisis vs Urgency",
      "Atrial Fibrillation & Rate Control",
      "Endocarditis & Blood Cultures",
      "Pericarditis & ECG Clues",
      "DVT & PE Nursing Priorities",
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory",
    priorityDefault: "high_yield",
    topics: [
      "ABG Interpretation Basics (HY)",
      "COPD Exacerbation & Oxygen",
      "Asthma & Status Asthmaticus",
      "ARDS & Ventilation Basics",
      "Pneumonia & Oxygenation",
      "Pulmonary Embolism Clues",
      "TB Isolation & Compliance",
      "Pleural Effusion & Chest Tubes",
    ],
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    priorityDefault: "high_yield",
    topics: [
      "Insulin & Hypoglycemia (HY)",
      "Anticoagulants & Bleeding Risk",
      "Antibiotic Classes & Allergies (HY)",
      "Opioids & Respiratory Depression",
      "Cardiac Glycosides & Toxicity",
      "Diuretics & Electrolyte Shifts",
      "Antihypertensive Combos",
      "Chemo Safe Handling & Extravasation",
    ],
  },
  {
    id: "fluids-electrolytes",
    name: "Fluids & Electrolytes",
    priorityDefault: "high_yield",
    topics: [
      "Hyponatremia vs Hypernatremia (HY)",
      "Hypo- vs Hyperkalemia (HY)",
      "Fluid Volume Deficit",
      "Fluid Volume Excess",
      "Magnesium & Arrhythmia Risk",
      "Calcium & Tetany",
      "Phosphate Shifts in Renal",
      "Mixed Acid-Base Patterns",
    ],
  },
  {
    id: "gastrointestinal",
    name: "Gastrointestinal",
    topics: [
      "Liver Failure & Hepatic Encephalopathy",
      "Acute Pancreatitis Nursing Care",
      "Bowel Obstruction vs Paralytic Ileus",
      "GERD & PUD Bleeding Clues",
      "GI Bleed Assessment",
      "C. diff Infection Control",
      "Ostomy & Skin Protection",
    ],
  },
  {
    id: "neurological",
    name: "Neurological",
    priorityDefault: "high_yield",
    topics: [
      "Stroke Assessment & tPA Window",
      "Seizure Precautions & Rescue Meds",
      "Increased ICP & Positioning",
      "Spinal Cord Injury Autonomic Dysreflexia",
      "Meningitis Isolation & Assessment",
      "Migraine vs Red-Flag Headache",
      "Parkinson Disease Med Timing",
    ],
  },
  {
    id: "endocrine",
    name: "Endocrine",
    priorityDefault: "high_yield",
    topics: [
      "DKA vs HHS Priorities (HY)",
      "Thyroid Storm & Myxedema Clues",
      "Addisonian Crisis",
      "Cushing Syndrome Assessment",
      "Diabetes Self-Management Teaching",
      "SIADH vs DI Basics",
    ],
  },
  {
    id: "renal-gu",
    name: "Renal & GU",
    topics: [
      "AKI: Prerenal vs Intrarenal",
      "Hemodialysis Access Care",
      "Peritoneal Dialysis Complications",
      "Kidney Stones & Strain Management",
      "UTI vs Pyelonephritis",
      "Indwelling Catheter Risks",
    ],
  },
  {
    id: "hematology",
    name: "Hematology & Oncology",
    topics: [
      "Anemia Types & Transfusion Thresholds",
      "Transfusion Reaction Recognition",
      "Neutropenic Precautions",
      "Sickle Cell Pain & ACS",
    ],
  },
  {
    id: "musculoskeletal",
    name: "Musculoskeletal",
    topics: ["Hip Fracture & Fall Risk", "RA Flare & Immune Modulators", "Immobility & DVT Prophylaxis"],
  },
  {
    id: "infectious",
    name: "Infectious Disease",
    priorityDefault: "high_yield",
    topics: [
      "Sepsis Early Recognition (HY)",
      "HIV Confidentiality & PEP Basics",
      "Isolation Precautions in Practice",
      "Wound Infection vs Colonization",
    ],
  },
  {
    id: "integumentary",
    name: "Integumentary",
    topics: ["Burn Depth & Fluid Resuscitation Basics", "Pressure Injury Staging", "Severe Dermatitis Skin Care"],
  },
  {
    id: "mental-health",
    name: "Mental Health",
    topics: ["Suicide Risk Assessment (HY)", "Psychotropic Side Effects", "Alcohol Withdrawal CIWA"],
  },
  {
    id: "maternity",
    name: "Maternity",
    priorityDefault: "high_yield",
    topics: [
      "Preeclampsia vs Eclampsia",
      "Postpartum Hemorrhage",
      "Late Decelerations & FHR",
      "Newborn Thermoregulation & Feeding",
      "Rh Incompatibility Basics",
    ],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    topics: [
      "Pediatric Fever & Dehydration",
      "RSV & Pediatric Resp Distress",
      "Immunization Schedule Essentials",
      "Growth Failure Red Flags",
      "Non-Accidental Trauma Suspicion",
    ],
  },
  {
    id: "leadership",
    name: "Leadership & Management",
    topics: ["Assignment vs Delegation", "Ethical Distress & Advocacy", "Legal: Nurse Practice Act", "QI & Incident Reporting"],
  },
  {
    id: "safety",
    name: "Safety & Infection Control",
    priorityDefault: "high_yield",
    topics: ["Falls & Hourly Rounding", "Restraint Alternatives & Policy", "Medication Error Disclosure", "Sharp Safety & Exposure"],
  },
  {
    id: "nutrition",
    name: "Nutrition & Elimination",
    topics: ["Enteral Feeding Tube Safety", "TPN Line Care Basics"],
  },
]);

const PN = buildExam("PN", "Practical Nursing (NCLEX-PN / REx-PN)", "NCLEX_PN", ["ca-rpn-rex-pn", "us-lvn-nclex-pn"], [
  {
    id: "pn-foundation",
    name: "Scope & Foundations",
    priorityDefault: "high_yield",
    topics: [
      "PN Scope & Delegation (HY)",
      "Therapeutic Communication",
      "Vital Signs & Escalation",
      "Documentation Do-Nots",
    ],
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular (PN)",
    topics: ["Heart Failure Monitoring", "Hypertension Teaching", "Edema & Daily Weights"],
  },
  {
    id: "respiratory",
    name: "Respiratory (PN)",
    topics: ["Oxygen Devices for PN Care", "Inhaler Technique Teaching", "COPD Home Care"],
  },
  {
    id: "pharmacology",
    name: "Pharmacology (PN)",
    priorityDefault: "high_yield",
    topics: ["Insulin Administration Checks", "Oral Hypoglycemics", "Antibiotic Side Effect Reporting"],
  },
  {
    id: "fluids-electrolytes",
    name: "Fluids & Electrolytes (PN)",
    topics: ["I&O & Fluid Restriction Teaching", "Hypokalemia Symptoms", "Daily Weights Pattern"],
  },
  {
    id: "gastrointestinal",
    name: "GI (PN)",
    topics: ["NPO & Post-Op Diet Progression", "Stool Assessment & Report"],
  },
  {
    id: "neurological",
    name: "Neurological (PN)",
    topics: ["Stroke Sequela & Mobility Assist", "Seizure Observation"],
  },
  {
    id: "endocrine",
    name: "Endocrine (PN)",
    topics: ["Fingerstick & Hypoglycemia Response", "Foot Inspection Teaching"],
  },
  {
    id: "renal-gu",
    name: "Renal & GU (PN)",
    topics: ["Catheter Care & CAUTI Prevention", "Dialysis Diet Teaching"],
  },
  {
    id: "maternity",
    name: "Maternity (PN)",
    topics: ["Postpartum Fundus & Lochia", "Newborn Safety & Bath"],
  },
  {
    id: "pediatrics",
    name: "Pediatrics (PN)",
    topics: ["Growth Chart Basics", "Immunization Consent"],
  },
  {
    id: "infectious",
    name: "Infection Control (PN)",
    priorityDefault: "high_yield",
    topics: ["PPE & Transmission Basics", "C. diff Contact Precautions"],
  },
  {
    id: "mental-health",
    name: "Mental Health (PN)",
    topics: ["Suicide Precautions Observation", "Behavioral Escalation Reporting"],
  },
  {
    id: "safety",
    name: "Safety (PN)",
    topics: ["Falls Risk & Side Rails Policy", "Restraint Monitoring Requirements"],
  },
]);

const NP = buildExam(
  "NP",
  "Nurse Practitioner",
  "NP",
  ["ca-np-cnple", "us-np-fnp", "us-np-agpcnp", "us-np-pmhnp"],
  [
    {
      id: "np-primary-care",
      name: "Primary Care",
      priorityDefault: "high_yield",
      topics: [
        "HTN Guideline-Based Plans",
        "Diabetes A1c & Medication Escalation",
        "Hyperlipidemia Risk Discussion",
        "Women's Health Screening Ages",
        "Pediatric Well Visits Red Flags",
      ],
    },
    {
      id: "np-acute",
      name: "Acute & Urgent",
      topics: ["Acute Chest Pain Workup Outline", "Shortness of Breath Triage", "Abdominal Pain DDx Framework"],
    },
    {
      id: "cardiovascular",
      name: "Cardiovascular (NP)",
      topics: ["Heart Failure GDMT Basics", "Afib Rate vs Rhythm Decisions"],
    },
    {
      id: "respiratory",
      name: "Respiratory (NP)",
      topics: ["COPD GOLD Overview", "Asthma Step-Up Therapy"],
    },
    {
      id: "pharmacology",
      name: "Pharmacology (NP)",
      topics: ["Polypharmacy & Deprescribing", "Renal Dose Adjustment Awareness"],
    },
    {
      id: "infectious",
      name: "Infectious (NP)",
      topics: ["UTI vs Asymptomatic Bacteriuria", "Outpatient Pneumonia Antibiotics"],
    },
    {
      id: "mental-health",
      name: "Mental Health (NP)",
      topics: ["PHQ-9 & Safety Planning", "Anxiety First-Line Med Selection"],
    },
    {
      id: "endocrine",
      name: "Endocrine (NP)",
      topics: ["Subclinical Hypothyroidism", "Osteoporosis FRAX Basics"],
    },
    {
      id: "renal-gu",
      name: "Renal & GU (NP)",
      topics: ["CKD Staging & Med Avoid List", "BPH vs Cancer Screening Talk"],
    },
    {
      id: "hematology",
      name: "Hematology (NP)",
      topics: ["Iron Deficiency Workup", "Anticoag Bridging Concepts"],
    },
  ],
);

const ALLIED = buildExam(
  "ALLIED",
  "Allied Health",
  "ALLIED",
  ["ca-allied-core", "us-allied-core"],
  [
    { id: "allied-respiratory", name: "Respiratory Therapy", topics: ["Vent Modes Overview", "ABG Sampling Errors", "Airway Emergencies"] },
    { id: "allied-lab", name: "Medical Laboratory", topics: ["Critical Value Reporting", "Hemolysis Specimen Reject", "Coag Sample Handling"] },
    { id: "allied-imaging", name: "Diagnostic Imaging", topics: ["Contrast Reaction Preparedness", "Pregnancy Screening Before Imaging"] },
    { id: "allied-pharmacy", name: "Pharmacy Technician", topics: ["High-Alert Med Storage", "Look-Alike Sound-Alike Controls"] },
    { id: "allied-therapy", name: "Rehab & Therapy", topics: ["Aspiration Precautions OT/PT", "Functional Mobility Screening"] },
    { id: "allied-emergency", name: "EMS / Prehospital", topics: ["Trauma Triage Basics", "Stroke Pre-Notification"] },
    { id: "infectious", name: "Infection Control (Allied)", topics: ["Sterile Field Breaks", "PPE Sequence"] },
    { id: "safety", name: "Safety (Allied)", topics: ["Radiation ALARA", "Chemical Spill Initial Steps"] },
  ],
);

const doc = {
  version: 1,
  description:
    "Master topic map for NurseNest content production. Each topic is one lesson unit (5 canonical sections + pre/post tests in pipeline). IDs are stable slugs for SEO and linking.",
  qualityRules: [
    "Prioritize exam decisions: what to assess first, what to delegate, what to escalate.",
    "Every lesson must name common distractors / traps the NCLEX uses.",
    "No fluff or generic nursing-school overview; tutor-in-the-room tone.",
  ],
  taggingModel: {
    exam: "RN | PN | NP | ALLIED",
    category: "category.id from this file",
    topic: "topic.id",
    difficulty: "1-5 scale mapped to content difficultyDefault",
    priority: "high_yield | secondary",
  },
  exams: {
    RN,
    PN,
    NP,
    ALLIED,
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(doc, null, 2));

function countTopics(exam) {
  return exam.categories.reduce((a, c) => a + c.topics.length, 0);
}

console.log("Wrote", OUT);
console.log("Topic counts:", {
  RN: countTopics(RN),
  PN: countTopics(PN),
  NP: countTopics(NP),
  ALLIED: countTopics(ALLIED),
  total: countTopics(RN) + countTopics(PN) + countTopics(NP) + countTopics(ALLIED),
});
