#!/usr/bin/env node
/**
 * Audits required practical-nursing topics vs catalog.json for ca-rpn-rex-pn + us-lpn-nclex-pn.
 * Run: node scripts/audit-pn-practical-nursing-topics.mjs
 * Writes: data/reports/pn-practical-nursing-lesson-audit.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const OUT = path.join(ROOT, "data/reports/pn-practical-nursing-lesson-audit.json");

const PATHWAYS = ["ca-rpn-rex-pn", "us-lpn-nclex-pn"];

/** Editorial required topics (flattened from product spec). */
const REQUIRED_TOPICS = [
  // Foundations
  "Nursing Process (ADPIE)",
  "Practical Nurse Scope of Practice",
  "RPN vs RN Scope",
  "PN/LPN vs RN Scope",
  "Stable vs Unstable Client Recognition",
  "Prioritization Basics",
  "ABCs",
  "Safety and Risk Reduction",
  "Documentation and Charting",
  "Therapeutic Communication",
  "Cultural Safety / Culturally Sensitive Care",
  "Consent and Confidentiality",
  "Delegation Basics",
  "Infection Prevention and Control",
  "Standard Precautions",
  "Contact Precautions",
  "Droplet Precautions",
  "Airborne Precautions",
  "Hand Hygiene",
  "PPE",
  "Pain Assessment",
  "Vital Signs Interpretation",
  "Intake and Output",
  "Daily Weights",
  "Fall Prevention",
  "Pressure Injury Prevention",
  "Restraint Safety",
  "Patient Education Basics",
  // Meds
  "Rights of Medication Administration",
  "Medication Error Prevention",
  "Oral Medications",
  "Subcutaneous Medications",
  "Intramuscular Medications",
  "Basic IV Medication Safety",
  "High-Alert Medications",
  "Insulin Basics",
  "Hypoglycemia Recognition",
  "Hyperglycemia Basics",
  "Anticoagulant Basics",
  "Heparin Basics",
  "Warfarin Basics",
  "Antihypertensive Basics",
  "Diuretic Basics",
  "Opioid Safety",
  "Antibiotic Basics",
  "Steroid Basics",
  "Patient Teaching for Common Medications",
  "Medication Side Effects and Reporting",
  "Safe Dosage / Monitoring Concepts",
  // CV
  "Hypertension",
  "Hypotension",
  "Chest Pain Assessment",
  "Angina Recognition",
  "Myocardial Infarction Recognition for Practical Nurses",
  "Heart Failure Basics",
  "Edema and Fluid Overload",
  "Peripheral Vascular Disease / Peripheral Artery Disease Basics",
  "DVT Basics",
  "Cardiac Monitoring Basics",
  "When to Escalate Cardiac Findings",
  // Resp
  "Oxygen Therapy",
  "Pulse Oximetry",
  "COPD",
  "Asthma",
  "Pneumonia",
  "Respiratory Distress Recognition",
  "Airway Management Basics",
  "Suctioning Basics",
  "Incentive Spirometry",
  "Smoking Cessation Teaching",
  "Cough and Sputum Assessment",
  // Neuro
  "Stroke Recognition (FAST)",
  "Seizure Precautions",
  "Confusion vs Delirium vs Dementia",
  "Level of Consciousness",
  "Basic Neuro Checks",
  "Head Injury Warning Signs",
  "Parkinson Disease Basics",
  "When Neuro Findings Require Immediate Escalation",
  // GI
  "Nausea and Vomiting",
  "Diarrhea",
  "Constipation",
  "Dysphagia",
  "Hydration",
  "Tube Feeding Basics",
  "NG Tube Care Basics",
  "Bowel Assessment",
  "GI Bleeding Red Flags",
  "Ostomy Basics",
  // Renal
  "Urinary Tract Infection",
  "Foley Catheter Care",
  "Urinary Retention",
  "Dehydration",
  "Fluid Overload",
  "Electrolyte Basics",
  "Renal Monitoring Basics",
  "When to Report Reduced Urine Output",
  // Endocrine
  "Diabetes Mellitus Basics",
  "Blood Glucose Monitoring",
  "Hypoglycemia vs Hyperglycemia",
  "Insulin Administration",
  "Diabetic Foot Care",
  "Sick Day Teaching Basics",
  // Heme/immune
  "Anemia Basics",
  "Infection Signs and Symptoms",
  "Fever Management",
  "Bleeding Precautions",
  "Neutropenic Precautions Basics",
  // Maternity
  "Normal Pregnancy Basics",
  "Prenatal Care Basics",
  "Postpartum Care",
  "Fundus Assessment Basics",
  "Lochia Basics",
  "Breastfeeding Support",
  "Newborn Assessment Basics",
  "APGAR Basics",
  "Newborn Safety",
  "Newborn Jaundice Basics",
  "Pregnancy Warning Signs",
  "When to Escalate Maternal / Newborn Findings",
  // Peds
  "Growth and Development Basics",
  "Pediatric Vital Signs",
  "Fever in Children",
  "Pediatric Medication Safety",
  "Immunization Basics",
  "Family-Centered Care",
  // MH
  "Therapeutic Communication in Mental Health",
  "Anxiety Basics",
  "Depression Basics",
  "Suicide Risk Recognition",
  "Substance Withdrawal Basics",
  "Crisis Intervention Basics",
  "Trauma-Informed Care Basics",
  // Emergency
  "ABC Priorities",
  "Shock Recognition Basics",
  "Sepsis Early Warning Signs",
  "Fall Injury Response",
  "When to Escalate Immediately",
  "Reporting Using SBAR",
  "Basic CPR / emergency response awareness",
];

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s) {
  return norm(s)
    .split(" ")
    .filter((w) => w.length > 2 && !STOP.has(w));
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "basics",
  "basic",
  "when",
  "using",
  "use",
]);

function lessonWordCount(l) {
  const parts = (l.sections || []).map((s) => s.body || "").join(" ");
  return parts.split(/\s+/).filter(Boolean).length;
}

function scoreMatch(requiredNorm, lessonTitleNorm) {
  const rt = tokens(requiredNorm);
  if (rt.length === 0) return 0;
  let hit = 0;
  for (const t of rt) {
    if (lessonTitleNorm.includes(t)) hit += 1;
  }
  return hit / rt.length;
}

function bestMatches(required, lessonsByPathway) {
  const reqN = norm(required);
  const out = {};
  for (const pid of PATHWAYS) {
    let best = null;
    let bestScore = 0;
    for (const l of lessonsByPathway[pid]) {
      const lt = norm(l.title);
      const s = scoreMatch(reqN, lt);
      if (s > bestScore) {
        bestScore = s;
        best = l;
      }
    }
    if (best && bestScore >= 0.45) {
      out[pid] = { lesson: best, score: bestScore, words: lessonWordCount(best) };
    }
  }
  return out;
}

function classify(matches) {
  const keys = Object.keys(matches);
  if (keys.length === 0) return "CREATE_NEW";
  const words = keys.map((k) => matches[k].words);
  const minW = Math.min(...words);
  if (minW >= 400) return "EXISTS_STRONG_SKIP";
  if (minW >= 120) return "EXISTS_STRONG_SKIP";
  if (minW > 0) return "EXISTS_UPGRADE";
  return "EXISTS_UPGRADE";
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
  const lessonsByPathway = {};
  for (const pid of PATHWAYS) {
    lessonsByPathway[pid] = catalog.pathways[pid]?.lessons ?? [];
  }

  const rows = [];
  const slugSet = { "ca-rpn-rex-pn": new Set(), "us-lpn-nclex-pn": new Set() };
  for (const pid of PATHWAYS) {
    for (const l of lessonsByPathway[pid]) slugSet[pid].add(l.slug);
  }

  for (const topic of REQUIRED_TOPICS) {
    const matches = bestMatches(topic, lessonsByPathway);
    const status = classify(matches);
    const usSlug = matches["us-lpn-nclex-pn"]?.lesson?.slug;
    const caSlug = matches["ca-rpn-rex-pn"]?.lesson?.slug;
    let mergeNote = null;
    if (usSlug && caSlug && usSlug === caSlug) mergeNote = "SHARED_SLUG_BOTH_PATHWAYS";
    else if (usSlug && caSlug) mergeNote = "PARALLEL_TITLES_REVIEW";

    rows.push({
      requiredTopic: topic,
      status,
      mergeNote,
      us: matches["us-lpn-nclex-pn"]
        ? {
            slug: matches["us-lpn-nclex-pn"].lesson.slug,
            title: matches["us-lpn-nclex-pn"].lesson.title,
            matchScore: matches["us-lpn-nclex-pn"].score,
            approxWords: matches["us-lpn-nclex-pn"].words,
          }
        : null,
      ca: matches["ca-rpn-rex-pn"]
        ? {
            slug: matches["ca-rpn-rex-pn"].lesson.slug,
            title: matches["ca-rpn-rex-pn"].lesson.title,
            matchScore: matches["ca-rpn-rex-pn"].score,
            approxWords: matches["ca-rpn-rex-pn"].words,
          }
        : null,
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    catalogLessonCounts: Object.fromEntries(PATHWAYS.map((p) => [p, lessonsByPathway[p].length])),
    requiredTopicCount: REQUIRED_TOPICS.length,
    byStatus: {},
    skippedStrong: rows.filter((r) => r.status === "EXISTS_STRONG_SKIP").length,
    upgrade: rows.filter((r) => r.status === "EXISTS_UPGRADE").length,
    createNew: rows.filter((r) => r.status === "CREATE_NEW").length,
  };
  for (const r of rows) {
    summary.byStatus[r.status] = (summary.byStatus[r.status] ?? 0) + 1;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ summary, rows }, null, 2) + "\n", "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
  console.log(JSON.stringify(summary.byStatus, null, 2));
}

main();
