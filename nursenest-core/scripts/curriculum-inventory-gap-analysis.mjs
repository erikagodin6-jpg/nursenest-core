#!/usr/bin/env node
/**
 * Full NurseNest curriculum inventory and gap analysis.
 *
 * Read-only. Emits CSV/Markdown reports under docs/reports.
 */
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const outDir = path.join(repoRoot, "docs", "reports");

const SYSTEMS = [
  "Fundamentals",
  "Pharmacology",
  "Medical Surgical",
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Endocrine",
  "Renal",
  "Gastrointestinal",
  "Hematology",
  "Immune",
  "Musculoskeletal",
  "Integumentary",
  "Reproductive",
  "Maternity",
  "Pediatrics",
  "Mental Health",
  "Critical Care",
  "Emergency",
  "Leadership",
  "Community Health",
  "Gerontology",
  "Professional Practice",
];

const EXPECTED_COUNTS = {
  Fundamentals: 90,
  Pharmacology: 110,
  "Medical Surgical": 140,
  Cardiovascular: 90,
  Respiratory: 75,
  Neurological: 80,
  Endocrine: 70,
  Renal: 65,
  Gastrointestinal: 70,
  Hematology: 55,
  Immune: 55,
  Musculoskeletal: 55,
  Integumentary: 50,
  Reproductive: 45,
  Maternity: 75,
  Pediatrics: 80,
  "Mental Health": 75,
  "Critical Care": 65,
  Emergency: 65,
  Leadership: 70,
  "Community Health": 55,
  Gerontology: 45,
  "Professional Practice": 65,
};

const BLUEPRINTS = [
  { id: "safe-effective-care", label: "Safe and Effective Care Environment", regex: /\b(safety|infection|delegation|assignment|prioritization|leadership|management|quality|legal|ethical|documentation|scope)\b/i },
  { id: "health-promotion", label: "Health Promotion and Maintenance", regex: /\b(maternity|newborn|pediatric|growth|development|screening|immunization|prenatal|postpartum|gerontology|prevention|community)\b/i },
  { id: "psychosocial-integrity", label: "Psychosocial Integrity", regex: /\b(mental|psych|anxiety|depression|suicide|substance|therapeutic communication|grief|abuse|crisis)\b/i },
  { id: "basic-care-comfort", label: "Basic Care and Comfort", regex: /\b(nutrition|mobility|comfort|hygiene|elimination|wound|skin|pain|sleep|adl)\b/i },
  { id: "pharmacological-parenteral", label: "Pharmacological and Parenteral Therapies", regex: /\b(pharm|medication|drug|insulin|anticoagulant|antibiotic|opioid|infusion|iv|parenteral|dosage)\b/i },
  { id: "reduction-risk", label: "Reduction of Risk Potential", regex: /\b(lab|diagnostic|post.?op|pre.?op|procedure|complication|bleeding|shock|transfusion|sepsis|risk)\b/i },
  { id: "physiological-adaptation", label: "Physiological Adaptation", regex: /\b(cardiac|respiratory|renal|neuro|endocrine|gastro|hematology|immune|critical|emergency|failure|copd|asthma|diabetes|stroke)\b/i },
  { id: "clinical-judgment", label: "Clinical Judgment / NGN Reasoning", regex: /\b(clinical judgment|case|ngn|bowtie|matrix|trend|priority|cue|hypothesis|outcome)\b/i },
];

const GOLD_CURRICULUM = {
  Cardiovascular: {
    required: ["Heart Failure", "Myocardial Infarction", "Angina", "Hypertension", "Dysrhythmias", "Shock", "Peripheral Vascular Disease", "Aortic Aneurysm", "Cardiac Catheterization"],
    optional: ["Cardiomyopathy", "Endocarditis", "Pericarditis", "Valve Disorders"],
    advanced: ["Hemodynamic Monitoring", "Advanced ECG Ischemia Patterns", "EVAR and Graft Complications"],
  },
  Respiratory: {
    required: ["Asthma", "COPD", "Pneumonia", "Pulmonary Embolism", "ARDS", "Oxygen Delivery Devices", "ABG Interpretation", "Chest Tubes"],
    optional: ["Tuberculosis", "Sleep Apnea", "Pleural Effusion"],
    advanced: ["Ventilator Basics", "Respiratory Failure", "High Flow Oxygen and Noninvasive Ventilation"],
  },
  Neurological: {
    required: ["Stroke", "Seizures", "Increased ICP", "Spinal Cord Injury", "Parkinson Disease", "Multiple Sclerosis", "Meningitis"],
    optional: ["Myasthenia Gravis", "Guillain-Barre Syndrome", "Migraine"],
    advanced: ["Neurogenic Shock", "Cranial Nerve Assessment", "Thrombolytic Eligibility"],
  },
  Endocrine: {
    required: ["Diabetes Mellitus", "DKA", "HHS", "Hypoglycemia", "Thyroid Disorders", "Adrenal Disorders", "SIADH", "Diabetes Insipidus"],
    optional: ["Cushing Syndrome", "Addison Disease", "Metabolic Syndrome"],
    advanced: ["Insulin Infusion Safety", "Endocrine Emergencies"],
  },
  Renal: {
    required: ["Acute Kidney Injury", "Chronic Kidney Disease", "Dialysis", "UTI", "Urinary Retention", "Electrolyte Imbalances", "Fluid Balance"],
    optional: ["Nephrotic Syndrome", "Kidney Stones", "Glomerulonephritis"],
    advanced: ["CRRT Basics", "Renal Medication Safety"],
  },
  Gastrointestinal: {
    required: ["GI Bleed", "Bowel Obstruction", "Pancreatitis", "Cholecystitis", "Cirrhosis", "Hepatitis", "Inflammatory Bowel Disease", "Ostomy Care"],
    optional: ["GERD", "Peptic Ulcer Disease", "Diverticulitis"],
    advanced: ["Variceal Bleed", "Hepatic Encephalopathy"],
  },
  Pharmacology: {
    required: ["Beta Blockers", "ACE Inhibitors", "Diuretics", "Insulin", "Anticoagulants", "Antibiotics", "Opioids", "Psych Medications", "Digoxin", "Steroids"],
    optional: ["Anticonvulsants", "Bronchodilators", "Thyroid Medications", "Antiemetics"],
    advanced: ["High Alert Medication Safety", "Infusion Titration", "Medication Reconciliation"],
  },
  Fundamentals: {
    required: ["Vital Signs", "Infection Control", "Falls Prevention", "Pressure Injuries", "Oxygen Safety", "Documentation", "Therapeutic Communication", "Pain Assessment"],
    optional: ["Sleep", "Hygiene", "Mobility", "Nutrition"],
    advanced: ["Clinical Judgment Frameworks", "Delegation and Assignment"],
  },
  Maternity: {
    required: ["Prenatal Assessment", "Labor Stages", "Fetal Monitoring", "Postpartum Hemorrhage", "Preeclampsia", "Newborn Assessment", "Rh Incompatibility"],
    optional: ["Breastfeeding", "Gestational Diabetes", "Placenta Previa"],
    advanced: ["Shoulder Dystocia", "HELLP Syndrome", "Obstetric Triage"],
  },
  Pediatrics: {
    required: ["Growth and Development", "Pediatric Respiratory Distress", "Dehydration", "Fever", "Medication Safety", "Immunizations", "Congenital Heart Defects"],
    optional: ["Asthma in Children", "Seizures in Children", "Diabetes in Children"],
    advanced: ["Pediatric Sepsis", "PALS Priorities"],
  },
  "Mental Health": {
    required: ["Suicide Risk", "Depression", "Anxiety", "Bipolar Disorder", "Schizophrenia", "Substance Use", "Therapeutic Communication", "Crisis Intervention"],
    optional: ["Eating Disorders", "Personality Disorders", "Trauma-Informed Care"],
    advanced: ["Psychiatric Emergencies", "Medication Adverse Effects"],
  },
  Leadership: {
    required: ["Delegation", "Prioritization", "Assignment", "Scope of Practice", "Conflict Resolution", "Informed Consent", "Incident Reporting"],
    optional: ["Quality Improvement", "Staff Education", "Time Management"],
    advanced: ["Systems Safety", "Root Cause Analysis"],
  },
};

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value) {
  const n = normalize(value);
  return n ? n.split(" ") : [];
}

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function compact(value, max = 110) {
  const s = String(value ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function inferTier(pathwayId, title = "") {
  const h = `${pathwayId} ${title}`.toLowerCase();
  if (/\bnp\b|cnple|fnp|agpcnp|pmhnp|whnp|pnp/.test(h)) return "NP";
  if (/rex-pn|rpn/.test(h)) return "RPN";
  if (/nclex-pn|lpn|lvn/.test(h)) return "PN";
  if (/allied|respiratory|paramedic|laboratory|physio|occupational|social-work|psychotherapy|psw/.test(h)) return "Allied Health";
  return "RN";
}

function inferExam(pathwayId, lesson = {}) {
  const h = `${pathwayId} ${lesson.exams?.join?.(" ") ?? ""} ${lesson.title ?? ""}`.toLowerCase();
  if (h.includes("rex-pn")) return "REx-PN";
  if (h.includes("nclex-pn")) return "NCLEX-PN";
  if (h.includes("nclex-rn")) return "NCLEX-RN";
  if (h.includes("cnple")) return "CNPLE";
  if (h.includes("fnp")) return "FNP";
  if (h.includes("agpcnp")) return "AGPCNP";
  if (h.includes("pmhnp")) return "PMHNP";
  if (h.includes("whnp")) return "WHNP";
  if (h.includes("pnp")) return "PNP";
  if (h.includes("allied")) return "Allied";
  return inferTier(pathwayId, lesson.title) === "RN" ? "NCLEX-RN" : inferTier(pathwayId, lesson.title);
}

function inferSystem(lesson) {
  const h = normalize(`${lesson.bodySystem ?? ""} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.title ?? ""}`);
  const checks = [
    ["Cardiovascular", /\b(cardiac|cardio|heart|vascular|mi|angina|hypertension|dysrhythm|shock|aneurysm|stroke volume|ecg|telemetry)\b/],
    ["Respiratory", /\b(respiratory|pulmonary|copd|asthma|pneumonia|ards|oxygen|abg|ventilat|airway|chest tube)\b/],
    ["Neurological", /\b(neuro|stroke|seizure|icp|spinal|parkinson|meningitis|migraine|cranial)\b/],
    ["Endocrine", /\b(endocrine|diabetes|dka|hhs|thyroid|adrenal|siadh|insulin|hypoglycemia)\b/],
    ["Renal", /\b(renal|kidney|urinary|dialysis|aki|ckd|uti|electrolyte|fluid balance)\b/],
    ["Gastrointestinal", /\b(gastro|gi|bowel|liver|hepatic|pancrea|ostomy|chole|cirrhosis|hepatitis)\b/],
    ["Hematology", /\b(hematology|anemia|bleeding|transfusion|clot|platelet|sickle|leukemia)\b/],
    ["Immune", /\b(immune|infection|sepsis|hiv|allergy|autoimmune|isolation|ppe|c diff)\b/],
    ["Musculoskeletal", /\b(musculoskeletal|fracture|arthritis|joint|bone|mobility|traction|cast)\b/],
    ["Integumentary", /\b(skin|wound|burn|pressure injur|integument|ulcer)\b/],
    ["Maternity", /\b(maternity|maternal|newborn|postpartum|labor|pregnancy|prenatal|fetal|preeclampsia|rh incompatibility)\b/],
    ["Pediatrics", /\b(pediatric|child|infant|growth|development|immunization|newborn safety)\b/],
    ["Mental Health", /\b(mental|psych|suicide|depression|anxiety|bipolar|schizophrenia|substance|therapeutic communication)\b/],
    ["Critical Care", /\b(critical|icu|shock|ventilator|hemodynamic|sepsis|code|rapid response)\b/],
    ["Emergency", /\b(emergency|trauma|triage|acls|bls|pals|burn|anaphylaxis|overdose)\b/],
    ["Leadership", /\b(leadership|delegation|assignment|prioritization|scope|management|conflict|incident)\b/],
    ["Community Health", /\b(community|public health|home care|screening|population|health promotion)\b/],
    ["Gerontology", /\b(gerontology|older adult|elder|dementia|falls|delirium|long term care)\b/],
    ["Professional Practice", /\b(professional|legal|ethical|documentation|consent|privacy|scope|jurisprudence)\b/],
    ["Pharmacology", /\b(pharm|medication|drug|antibiotic|opioid|anticoagulant|beta blocker|diuretic|digoxin|dose|infusion)\b/],
    ["Fundamentals", /\b(fundamental|vital sign|safety|hygiene|nutrition|comfort|basic care|assessment)\b/],
    ["Reproductive", /\b(reproductive|gynec|contraception|sti|menstrual|fertility)\b/],
    ["Medical Surgical", /\b(med surg|medical surgical|surgery|post op|pre op|disease|disorder)\b/],
  ];
  return checks.find(([, re]) => re.test(h))?.[0] ?? "Medical Surgical";
}

async function walkFiles(dir, predicate, out = []) {
  if (!fssync.existsSync(dir)) return out;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(full, predicate, out);
    else if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

function readObjectText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(readObjectText).join("\n");
  if (value && typeof value === "object") return ["body", "text", "content", "markdown", "html"].map((k) => readObjectText(value[k])).join("\n");
  return "";
}

function extractSections(lesson) {
  const arr = [lesson.sections, lesson.content, lesson.blocks].find(Array.isArray) ?? [];
  return arr.map((section, index) => ({
    heading: String(section?.heading ?? section?.title ?? section?.sectionTitle ?? section?.kind ?? `Section ${index + 1}`),
    body: readObjectText(section),
  }));
}

function isLessonLike(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && typeof value.slug === "string" && typeof value.title === "string" && [value.sections, value.content, value.blocks].some(Array.isArray));
}

function visitLessons(root, source, visitor) {
  const seen = new WeakSet();
  function walk(value, location, pathwayId = "") {
    if (!value || typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    if (isLessonLike(value)) {
      visitor(value, source, location, pathwayId || String(value.pathwayId ?? ""));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${location}[${index}]`, pathwayId));
      return;
    }
    if (value.pathways && typeof value.pathways === "object") {
      for (const [id, raw] of Object.entries(value.pathways)) {
        if (Array.isArray(raw)) raw.forEach((item, index) => walk(item, `${location}.pathways.${id}[${index}]`, id));
        else walk(raw?.lessons ?? raw, `${location}.pathways.${id}.lessons`, id);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      if (["sections", "content", "blocks", "pathways"].includes(key)) continue;
      walk(child, `${location}.${key}`, pathwayId);
    }
  }
  walk(root, "$root");
}

async function loadLocalLessons() {
  const files = await walkFiles(path.join(repoRoot, "src", "content", "pathway-lessons"), (file) => file.endsWith(".json"));
  const lessons = [];
  for (const file of files) {
    try {
      const root = JSON.parse(await fs.readFile(file, "utf8"));
      visitLessons(root, path.relative(repoRoot, file), (lesson, source, location, pathwayId) => {
        const row = {
          source,
          id: `${source}:${pathwayId}:${lesson.slug}`,
          pathwayId,
          slug: String(lesson.slug),
          title: String(lesson.title),
          topic: String(lesson.topic ?? ""),
          topicSlug: String(lesson.topicSlug ?? ""),
          bodySystem: String(lesson.bodySystem ?? ""),
          status: String(lesson.status ?? "catalog"),
          sections: extractSections(lesson),
          location,
        };
        row.tier = inferTier(row.pathwayId, row.title);
        row.exam = inferExam(row.pathwayId, lesson);
        row.system = inferSystem(row);
        row.category = row.topic || row.topicSlug || row.system;
        lessons.push(row);
      });
    } catch {
      // Ignore non-lesson manifests that are not JSON lesson catalogs.
    }
  }
  return lessons;
}

async function loadDbData() {
  if (!process.env.DATABASE_URL) return { lessons: [], questionRows: [], flashcardRows: [], error: "DATABASE_URL not set" };
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const [lessons, questionRows, flashcardRows] = await Promise.all([
      prisma.pathwayLesson.findMany({
        orderBy: [{ pathwayId: "asc" }, { sortOrder: "asc" }],
        select: {
          id: true,
          pathwayId: true,
          slug: true,
          title: true,
          topic: true,
          topicSlug: true,
          bodySystem: true,
          status: true,
          exams: true,
          sections: true,
          deprecatedAt: true,
          canonicalLessonId: true,
        },
      }),
      prisma.examQuestion.findMany({
        where: { status: { in: ["published", "PUBLISHED", "Published"] } },
        select: { studyLinkPathwayId: true, studyLinkLessonSlug: true, exam: true, tier: true, topic: true, bodySystem: true },
      }),
      prisma.flashcard.findMany({
        where: { status: "PUBLISHED" },
        select: { lessonId: true, sourceKey: true, tier: true, category: { select: { name: true, slug: true } } },
      }),
    ]);
    return {
      lessons: lessons.map((lesson) => {
        const row = {
          source: "database:pathway_lessons",
          id: `db:${lesson.id}`,
          dbId: lesson.id,
          pathwayId: lesson.pathwayId,
          slug: lesson.slug,
          title: lesson.title,
          topic: lesson.topic,
          topicSlug: lesson.topicSlug,
          bodySystem: lesson.bodySystem,
          status: lesson.deprecatedAt ? "DEPRECATED" : String(lesson.status),
          canonicalLessonId: lesson.canonicalLessonId,
          sections: extractSections({ sections: Array.isArray(lesson.sections) ? lesson.sections : [] }),
          location: `pathway_lessons.${lesson.id}`,
        };
        row.tier = inferTier(row.pathwayId, row.title);
        row.exam = inferExam(row.pathwayId, lesson);
        row.system = inferSystem(row);
        row.category = row.topic || row.topicSlug || row.system;
        return row;
      }),
      questionRows,
      flashcardRows,
      error: null,
    };
  } finally {
    await prisma.$disconnect();
  }
}

function lessonText(lesson) {
  return `${lesson.title}\n${lesson.topic}\n${lesson.bodySystem}\n${lesson.sections.map((s) => `${s.heading}\n${s.body}`).join("\n")}`;
}

function buildCounts(db) {
  const questionCounts = new Map();
  for (const q of db.questionRows) {
    if (q.studyLinkPathwayId && q.studyLinkLessonSlug) {
      const key = `${q.studyLinkPathwayId}::${q.studyLinkLessonSlug}`;
      questionCounts.set(key, (questionCounts.get(key) ?? 0) + 1);
    }
  }
  const flashcardByLessonId = new Map();
  const flashcardBySlug = new Map();
  for (const f of db.flashcardRows) {
    if (f.lessonId) flashcardByLessonId.set(f.lessonId, (flashcardByLessonId.get(f.lessonId) ?? 0) + 1);
    const source = String(f.sourceKey ?? "");
    const m = /^lesson:([^:]+):/.exec(source) || /^pathway_lesson:([^:]+):/.exec(source);
    if (m?.[1]) flashcardBySlug.set(m[1], (flashcardBySlug.get(m[1]) ?? 0) + 1);
  }
  return { questionCounts, flashcardByLessonId, flashcardBySlug };
}

function tokenSimilarity(a, b) {
  const aa = new Set(words(a).filter((w) => w.length > 2));
  const bb = new Set(words(b).filter((w) => w.length > 2));
  if (!aa.size || !bb.size) return 0;
  const inter = [...aa].filter((w) => bb.has(w)).length;
  return Math.round((inter / new Set([...aa, ...bb]).size) * 100);
}

function baseTitle(title) {
  return normalize(title)
    .replace(/\b(nursing|management|treatment|care|interventions|assessment|overview|basics|fundamentals|medications|pharmacology|review|advanced|for pn care|rex pn|nclex rn|canada|united states|us|ca)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function duplicateAudit(lessons) {
  const canonical = lessons.filter((l) => !l.canonicalLessonId && l.status !== "DEPRECATED");
  const bySystem = new Map();
  for (const lesson of canonical) {
    const key = `${lesson.tier}::${lesson.system}`;
    const arr = bySystem.get(key) ?? [];
    arr.push(lesson);
    bySystem.set(key, arr);
  }
  const rows = [];
  for (const [, group] of bySystem) {
    const byBase = new Map();
    for (const lesson of group) {
      const key = baseTitle(lesson.title);
      if (!key) continue;
      const arr = byBase.get(key) ?? [];
      arr.push(lesson);
      byBase.set(key, arr);
    }
    for (const same of byBase.values()) {
      if (same.length > 1) {
        for (let i = 0; i < same.length; i++) {
          for (let j = i + 1; j < same.length; j++) {
            rows.push(pairRow(same[i], same[j], 100));
          }
        }
      }
    }
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const sim = tokenSimilarity(baseTitle(group[i].title), baseTitle(group[j].title));
        if (sim >= 55 && sim < 100) rows.push(pairRow(group[i], group[j], sim));
      }
    }
  }
  const seen = new Set();
  return rows
    .filter((r) => {
      const key = [r.a.id, r.b.id].sort().join("::");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2000);
}

function pairRow(a, b, similarity) {
  const hasManager = /\b(management|treatment|care|interventions|medications|assessment)\b/i;
  const recommendation =
    similarity >= 90 ? "Should Merge" : hasManager.test(a.title) || hasManager.test(b.title) ? "Should Expand into Core Lesson" : "Should Remain Separate / Review";
  return { a, b, similarity, recommendation };
}

function blueprintForLesson(lesson) {
  const text = lessonText(lesson);
  return BLUEPRINTS.filter((b) => b.regex.test(text)).map((b) => b.label);
}

function existsFor(lessons, title) {
  const target = baseTitle(title);
  return lessons.some((lesson) => tokenSimilarity(baseTitle(lesson.title), target) >= 70);
}

function curriculumRows(lessons) {
  const rows = [];
  for (const system of Object.keys(GOLD_CURRICULUM)) {
    const pool = lessons.filter((l) => l.system === system);
    for (const [kind, items] of Object.entries(GOLD_CURRICULUM[system])) {
      for (const title of items) {
        const exists = existsFor(pool, title);
        rows.push({
          system,
          lesson: title,
          priority: kind === "required" ? "High" : kind === "optional" ? "Medium" : "Low",
          status: exists ? "Exists" : "Missing",
          type: kind[0].toUpperCase() + kind.slice(1),
        });
      }
    }
  }
  return rows;
}

function missingRows(lessons) {
  const rows = curriculumRows(lessons).filter((r) => r.status === "Missing");
  const weights = { High: 100, Medium: 65, Low: 35 };
  return rows
    .map((row) => ({
      ...row,
      score:
        weights[row.priority] +
        (["Cardiovascular", "Respiratory", "Endocrine", "Neurological", "Pharmacology", "Leadership"].includes(row.system) ? 20 : 0) +
        (row.type === "Required" ? 15 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.system.localeCompare(b.system))
    .slice(0, 100);
}

function relatedLessons(lesson, lessons) {
  return lessons
    .filter((x) => x.id !== lesson.id && x.pathwayId === lesson.pathwayId && x.topicSlug && x.topicSlug === lesson.topicSlug)
    .slice(0, 5)
    .map((x) => x.slug)
    .join("; ");
}

async function writeFile(name, body) {
  await fs.writeFile(path.join(outDir, name), body, "utf8");
}

function mdTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((v) => String(v ?? "").replace(/\|/g, "\\|")).join(" | ")} |`),
  ].join("\n");
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const local = await loadLocalLessons();
  const db = await loadDbData();
  const lessonMap = new Map();
  for (const lesson of [...local, ...db.lessons]) {
    const key = `${lesson.source}::${lesson.pathwayId}::${lesson.slug}`;
    lessonMap.set(key, lesson);
  }
  const lessons = [...lessonMap.values()].filter((l) => ["RN", "RPN", "PN", "NP", "Allied Health"].includes(l.tier));
  const counts = buildCounts(db);
  const inventory = lessons.map((lesson) => {
    const key = `${lesson.pathwayId}::${lesson.slug}`;
    const questionCount = counts.questionCounts.get(key) ?? 0;
    const flashcardCount = (lesson.dbId ? counts.flashcardByLessonId.get(lesson.dbId) ?? 0 : 0) + (counts.flashcardBySlug.get(lesson.slug) ?? 0);
    return {
      ...lesson,
      questionCount,
      flashcardCount,
      related: relatedLessons(lesson, lessons),
      blueprints: blueprintForLesson(lesson),
    };
  });

  const csvHeaders = ["Tier", "Exam", "System", "Category", "Lesson Title", "Slug", "Pathway", "Published Status", "Question Count", "Flashcard Count", "Related Lessons", "Blueprint Categories", "Source"];
  await writeFile(
    "full-lesson-inventory.csv",
    [
      csvHeaders.join(","),
      ...inventory.map((l) =>
        [l.tier, l.exam, l.system, l.category, l.title, l.slug, l.pathwayId, l.status, l.questionCount, l.flashcardCount, l.related, l.blueprints.join("; "), l.source].map(csvEscape).join(","),
      ),
    ].join("\n") + "\n",
  );

  const byTier = new Map();
  for (const l of inventory) byTier.set(l.tier, (byTier.get(l.tier) ?? 0) + 1);
  await writeFile(
    "full-lesson-inventory.md",
    [
      "# Full Lesson Inventory",
      "",
      `Generated: ${new Date().toISOString()}`,
      `Database status: ${db.error ? `DB unavailable (${db.error})` : "connected"}`,
      `Total lessons inventoried: ${inventory.length}`,
      "",
      mdTable(["Tier", "Lesson Count"], [...byTier.entries()].map(([tier, count]) => [tier, count])),
      "",
      "See `docs/reports/full-lesson-inventory.csv` for the complete row-level inventory.",
      "",
    ].join("\n"),
  );

  const duplicates = duplicateAudit(inventory);
  await writeFile(
    "duplicate-lesson-audit.md",
    [
      "# Duplicate Lesson Audit",
      "",
      `Duplicate / near-duplicate pairs detected: ${duplicates.length}`,
      "",
      mdTable(
        ["Lesson A", "Lesson B", "Similarity %", "Recommendation"],
        duplicates.slice(0, 500).map((r) => [`${r.a.pathwayId}/${r.a.slug} — ${r.a.title}`, `${r.b.pathwayId}/${r.b.slug} — ${r.b.title}`, r.similarity, r.recommendation]),
      ),
      "",
    ].join("\n"),
  );

  const coverageRows = SYSTEMS.map((system) => {
    const current = inventory.filter((l) => l.system === system).length;
    const expected = EXPECTED_COUNTS[system] ?? 50;
    return { system, current, expected, pct: Math.min(100, Math.round((current / expected) * 100)) };
  });
  await writeFile(
    "system-coverage-audit.md",
    [
      "# System Coverage Audit",
      "",
      mdTable(["System", "Current Lesson Count", "Expected Lesson Count", "Coverage %"], coverageRows.map((r) => [r.system, r.current, r.expected, `${r.pct}%`])),
      "",
    ].join("\n"),
  );

  const blueprintRows = BLUEPRINTS.map((bp) => {
    const count = inventory.filter((l) => l.blueprints.includes(bp.label)).length;
    const expected = bp.id === "clinical-judgment" ? 250 : 500;
    return [bp.label, count, expected, count >= expected ? "Adequate" : count === 0 ? "No coverage" : "Underrepresented"];
  });
  await writeFile(
    "blueprint-gap-analysis.md",
    [
      "# Blueprint Gap Analysis",
      "",
      mdTable(["Blueprint Objective", "Mapped Lessons", "Expected Minimum", "Status"], blueprintRows),
      "",
      "Objectives marked underrepresented need either new lessons or stronger explicit tagging. This is an inventory classification only; no new content was generated.",
      "",
    ].join("\n"),
  );

  const consolidationRows = duplicates
    .filter((r) => r.recommendation !== "Should Remain Separate / Review")
    .slice(0, 300)
    .map((r) => [r.a.system, r.a.title, r.b.title, r.recommendation, `${r.similarity}%`]);
  await writeFile(
    "lesson-consolidation-plan.md",
    [
      "# Lesson Consolidation Plan",
      "",
      "Core disease lessons should absorb narrow management/treatment/nursing-care variants unless the subtopic is clinically large enough to stand alone.",
      "",
      mdTable(["System", "Core / Lesson A", "Variant / Lesson B", "Recommendation", "Similarity"], consolidationRows),
      "",
    ].join("\n"),
  );

  const gold = curriculumRows(inventory);
  await writeFile(
    "gold-standard-nursenest-curriculum.md",
    [
      "# Gold Standard NurseNest Curriculum",
      "",
      mdTable(["System", "Lesson", "Priority", "Type", "Status"], gold.map((r) => [r.system, r.lesson, r.priority, r.type, r.status])),
      "",
    ].join("\n"),
  );

  const missing = missingRows(inventory);
  await writeFile(
    "top-100-missing-lessons.md",
    [
      "# Top 100 Missing Lessons",
      "",
      mdTable(["Rank", "System", "Missing Lesson", "Priority", "Reason Score"], missing.map((r, i) => [i + 1, r.system, r.lesson, r.priority, r.score])),
      "",
    ].join("\n"),
  );

  console.log(`Inventory lessons: ${inventory.length}`);
  console.log(`Duplicate pairs: ${duplicates.length}`);
  console.log(`Missing lessons ranked: ${missing.length}`);
  console.log(`Reports written to ${path.relative(repoRoot, outDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
