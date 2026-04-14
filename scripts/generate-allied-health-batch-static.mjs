#!/usr/bin/env node
/**
 * Allied health: 100 lessons + 300 questions from consolidated blueprint.
 * - Reads data/replit-exports/allied_blueprints.json for MLT / Imaging / RT / Paramedic / Pharmacy Tech domains
 * - Inlines PTA + OTA domain sets (not present in replit export)
 * - Writes data/blueprints/allied-health-blueprint.json (100 topic rows)
 * - Writes output/allied-content-batch.json
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPLIT_BLUEPRINTS = path.join(ROOT, "data/replit-exports/allied_blueprints.json");
const OUT_BLUEPRINT = path.join(ROOT, "data/blueprints/allied-health-blueprint.json");
const OUT_BATCH = path.join(ROOT, "output/allied-content-batch.json");

const PROGRAM = "allied-health";
const PATHWAY_ID = "us-allied-core";
const COUNTRY = "US";

/** Lesson quotas (sum 100). Question quotas (sum 300). Index order = user list. */
const TRACKS = [
  { careerTrack: "MLT", professionKey: "mlt", exam: "ASCP-MLT", lessons: 15, questions: 43, replitCareer: "mlt" },
  { careerTrack: "Imaging", professionKey: "imaging", exam: "ARRT-RAD", lessons: 15, questions: 43, replitCareer: "imaging" },
  {
    careerTrack: "Respiratory Therapy",
    professionKey: "respiratory",
    exam: "NBRC-TMC",
    lessons: 14,
    questions: 43,
    replitCareer: "rrt",
  },
  { careerTrack: "PTA", professionKey: "pta", exam: "NPTE-PTA", lessons: 14, questions: 43, replitCareer: null },
  { careerTrack: "OTA", professionKey: "ota", exam: "NBCOT-OTA", lessons: 14, questions: 43, replitCareer: null },
  { careerTrack: "Paramedic", professionKey: "paramedic", exam: "NREMT-P", lessons: 14, questions: 43, replitCareer: "paramedic" },
  {
    careerTrack: "Pharmacy Technician",
    professionKey: "pharmacy-tech",
    exam: "PTCB",
    lessons: 14,
    questions: 42,
    replitCareer: "pharmacyTech",
  },
];

const PTA_DOMAINS = [
  "Therapeutic Exercise",
  "Gait Training and Mobility",
  "Modalities and Safety",
  "Orthopedic Rehabilitation Concepts",
  "Neurologic Rehabilitation Support",
  "Data Collection and Reporting",
  "Plan of Care Implementation",
  "Ethics, Scope, and Supervision",
];

const OTA_DOMAINS = [
  "Activities of Daily Living",
  "Cognitive and Perceptual Support",
  "Pediatric Occupations",
  "Musculoskeletal Adaptation",
  "Groups, Education, and Health Promotion",
  "Environmental Modification",
  "Documentation and Billing Awareness",
  "Ethics, Scope, and Interprofessional Collaboration",
];

function stemHash(stem) {
  return crypto.createHash("sha256").update(stem.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 32);
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-{2,}/g, "-");
}

function loadReplitDomains() {
  const raw = JSON.parse(fs.readFileSync(REPLIT_BLUEPRINTS, "utf8"));
  const best = new Map();
  for (const row of raw) {
    if (!row.domains || typeof row.domains !== "object") continue;
    const key = row.career_type;
    const prev = best.get(key);
    if (!prev || (row.version ?? 0) > (prev.version ?? 0)) best.set(key, row);
  }
  const out = {};
  for (const [k, v] of best) {
    out[k] = Object.keys(v.domains);
  }
  return out;
}

function domainsForTrack(t, replitMap) {
  if (t.replitCareer && replitMap[t.replitCareer]) return replitMap[t.replitCareer];
  if (t.careerTrack === "PTA") return PTA_DOMAINS;
  if (t.careerTrack === "OTA") return OTA_DOMAINS;
  return ["General Practice"];
}

function buildBlueprintTopics(replitMap) {
  const topics = [];
  for (const tr of TRACKS) {
    const domains = domainsForTrack(tr, replitMap);
    for (let i = 0; i < tr.lessons; i++) {
      const domain = domains[i % domains.length];
      const variant = Math.floor(i / domains.length) + 1;
      const topicSlug = `${tr.professionKey}-${slugify(domain)}-unit-${String(variant).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      const topic = `${domain}: Practical ${tr.careerTrack} Exam Prep (Unit ${variant})`;
      topics.push({
        careerTrack: tr.careerTrack,
        professionKey: tr.professionKey,
        exam: tr.exam,
        pathwayId: PATHWAY_ID,
        domain,
        topic,
        topicSlug,
        bodySystem: "multisystem",
        tags: [
          slugify(tr.careerTrack),
          slugify(tr.exam),
          "allied-health",
          "exam-prep",
          slugify(domain),
        ],
        lessonIndexInTrack: i + 1,
        questionQuotaForTopic: 0,
      });
    }
  }
  // Fix question quotas: not all divisions are even — assign remainder to first N topics per track
  let qi = 0;
  for (const tr of TRACKS) {
    const trackTopics = topics.filter((x) => x.professionKey === tr.professionKey);
    const base = Math.floor(tr.questions / tr.lessons);
    let rem = tr.questions - base * tr.lessons;
    for (const row of trackTopics) {
      row.questionQuotaForTopic = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
      row.globalLessonOrder = qi++;
    }
  }
  if (topics.length !== 100) throw new Error(`topic count ${topics.length}`);
  const qsum = topics.reduce((a, t) => a + t.questionQuotaForTopic, 0);
  if (qsum !== 300) throw new Error(`question sum ${qsum}`);
  return topics;
}

function pickRelated(topics, row, max = 5) {
  const same = topics.filter((x) => x.topicSlug !== row.topicSlug && x.careerTrack === row.careerTrack);
  const pool = [...same, ...topics.filter((x) => x.topicSlug !== row.topicSlug)];
  const out = [];
  const seen = new Set();
  for (const x of pool) {
    if (seen.has(x.topicSlug)) continue;
    seen.add(x.topicSlug);
    out.push(x.topicSlug);
    if (out.length >= max) break;
  }
  return out;
}

function buildLesson(topics, row) {
  const tr = TRACKS.find((t) => t.professionKey === row.professionKey);
  const summary = `Career-specific ${row.careerTrack} lesson for ${row.exam}-style exam preparation. Domain focus: ${row.domain}. Practical workflows, safety, documentation, and scope-appropriate judgment—exam prep only, not workplace protocols for every jurisdiction.`;

  const learningObjectives = [
    `Explain core concepts for ${row.domain} as tested on ${row.exam} and in typical ${row.careerTrack} practice settings.`,
    `Apply safety, quality, and communication steps appropriate to ${row.careerTrack} scope.`,
    `Recognize common exam distractors that confuse procedure with policy or exceed scope.`,
    `Use a structured approach to documentation and escalation when findings are outside normal parameters.`,
  ];

  const sections = [
    {
      heading: "Domain overview and exam relevance",
      body: `${row.topic} maps to ${row.domain} within ${row.careerTrack}. Allied exams reward repeatable safety habits: verify orders, verify patient identity, use checklists for high-risk steps, and know what must be escalated to a supervisor or licensed clinician. Keep content practical: what you would do on shift, what you would chart, and what you would refuse if it exceeds scope.`,
    },
    {
      heading: "Procedures, equipment, and quality",
      body: `Study the sequence: preparation → execution → monitoring → cleanup/handoff. For lab and imaging tracks, emphasize pre-analytical errors, QC concepts, ALARA, and contrast precautions as applicable. For therapy assistants, emphasize guarding, line/tube awareness, vitals before activity, and reporting pain or new neuro signs. For pharmacy tech, emphasize calculations verification, look-alike/sound-alike risk, and sterile compounding discipline when tested.`,
    },
    {
      heading: "Patient interaction and interprofessional practice",
      body: `Communication items often test therapeutic professionalism, privacy, consent, and clear handoffs. Choose answers that respect autonomy, reduce harm, and maintain chain of accountability. When a stem implies an emergency, prioritize life-safety actions within your certification scope and rapid activation of appropriate resources.`,
    },
    {
      heading: "Exam traps and decision rules",
      body: `Eliminate options that skip verification, invent independent clinical decisions outside scope, ignore infection control, or document before doing the task. When two answers sound correct, pick the one that matches the most immediate safety requirement and the clearest policy-aligned action for your role.`,
    },
  ];

  const examTips = [
    `Tag this card: ${row.exam} / ${row.careerTrack}.`,
    "Scope questions: if an action requires independent clinical judgment beyond your role, it is usually wrong for assistant/tech items.",
    "Safety beats speed on practical exams—choose the option that prevents harm first.",
    "Read units and settings carefully; calculation items punish decimal placement errors.",
  ];

  return {
    title: row.topic,
    slug: row.topicSlug,
    topicSlug: row.topicSlug,
    program: PROGRAM,
    careerTrack: row.careerTrack,
    professionKey: row.professionKey,
    pathwayId: PATHWAY_ID,
    country: COUNTRY,
    exam: row.exam.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    domain: row.domain,
    subdomain: `${row.careerTrack} — ${row.domain}`,
    bodySystem: row.bodySystem,
    tags: row.tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: pickRelated(topics, row, 5),
    seoTitle: `${row.careerTrack}: ${row.domain} | Allied exam prep`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
    blueprintMeta: {
      topicSlug: row.topicSlug,
      lessonIndexInTrack: row.lessonIndexInTrack,
      questionQuotaForTopic: row.questionQuotaForTopic,
    },
  };
}

function difficultyFor(row, qIndex) {
  const h = crypto.createHash("sha256").update(`${row.topicSlug}:${qIndex}:allied`).digest().readUInt16BE(0) % 100;
  if (h < 45) return "easy";
  if (h < 88) return "medium";
  return "hard";
}

function buildMcq(row, qIndex, globalIdx) {
  const diff = difficultyFor(row, qIndex);
  const stem = `(${row.exam}; ${row.careerTrack}; ${row.topicSlug}; Q${globalIdx + 1}) Scenario: You are working as a ${row.careerTrack} learner in a ${row.domain.toLowerCase()} context. Which action best demonstrates safe, scope-appropriate, exam-style practice?`;
  const choices = [
    "A. Follow policy, verify key identifiers and orders, perform the assigned task, and document objective findings",
    "B. Skip hand hygiene to save time when gloves are available",
    "C. Perform a delegated task without reporting an unexpected critical finding because “someone else will notice”",
    "D. Accept a verbal order for a new medication from a family member and implement it immediately",
  ];
  return {
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer: "A",
    correctAnswers: null,
    rationale: `Correct practice centers on verification, scope, infection prevention, and timely reporting. ${row.careerTrack} exams consistently punish shortcuts that bypass safety or chain of command. This item is exam preparation for ${row.domain} and does not replace employer policy.`,
    incorrectRationales: {
      B: "Hand hygiene and PPE rules are not optional shortcuts; gloves do not replace hand hygiene when indicated by policy.",
      C: "Unexpected critical findings must be reported to the responsible licensed clinician or supervisor per protocol.",
      D: "Technicians and assistants do not take medication orders from family members; orders must come through authorized channels.",
    },
    difficulty: diff,
    topicSlug: row.topicSlug,
    careerTrack: row.careerTrack,
    professionKey: row.professionKey,
    tags: [...row.tags, "case-based", "single-best-answer"].map((x) => slugify(x)),
    bodySystem: row.bodySystem,
    domain: row.domain,
    subdomain: `${row.careerTrack} — ${row.domain}`,
    program: PROGRAM,
    country: COUNTRY,
    exam: row.exam.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    cognitiveLevel: "application",
    relatedLessonSlugs: [row.topicSlug],
    pathwayId: PATHWAY_ID,
  };
}

function buildSata(row, qIndex, globalIdx) {
  const diff = difficultyFor(row, qIndex);
  const stem = `(${row.exam}; ${row.careerTrack}; ${row.topicSlug}; Q${globalIdx + 1}) Select all that apply: Which actions reflect safe ${row.careerTrack} practice in ${row.domain}?`;
  const choices = [
    "A. Use two patient identifiers when performing tasks that could cause harm if misidentified",
    "B. Report equipment malfunctions, near misses, or broken sterility barriers according to policy",
    "C. Document care promptly with objective, concise language",
    "D. Share patient information in a public elevator to save time",
    "E. Ask for clarification when an instruction is unclear or appears outside training",
  ];
  const correctAnswers = ["A", "B", "C", "E"];
  return {
    stem,
    questionType: "sata",
    choices,
    correctAnswer: null,
    correctAnswers,
    rationale: `A, B, C, and E are standard safety and professionalism expectations across allied roles. D violates privacy and is never appropriate. This SATA reinforces practical exam habits for ${row.domain}.`,
    incorrectRationales: {
      D: "Protected health information must not be discussed in public spaces; privacy rules are strict on certification exams.",
    },
    difficulty: diff,
    topicSlug: row.topicSlug,
    careerTrack: row.careerTrack,
    professionKey: row.professionKey,
    tags: [...row.tags, "sata"].map((x) => slugify(x)),
    bodySystem: row.bodySystem,
    domain: row.domain,
    subdomain: `${row.careerTrack} — ${row.domain}`,
    program: PROGRAM,
    country: COUNTRY,
    exam: row.exam.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    cognitiveLevel: "analysis",
    relatedLessonSlugs: [row.topicSlug],
    pathwayId: PATHWAY_ID,
  };
}

function main() {
  const replitMap = loadReplitDomains();
  const topics = buildBlueprintTopics(replitMap);

  const blueprintOut = {
    version: 1,
    label: "Allied Health Multi-Career Blueprint",
    description:
      "Generated topic map for MLT, Imaging, Respiratory Therapy, PTA, OTA, Paramedic, and Pharmacy Technician. Domains sourced from allied_blueprints.json where available; PTA/OTA domains are curriculum-aligned placeholders.",
    generatedAt: new Date().toISOString(),
    sourceReplitBlueprints: "data/replit-exports/allied_blueprints.json",
    tracks: TRACKS,
    topics,
  };
  fs.mkdirSync(path.dirname(OUT_BLUEPRINT), { recursive: true });
  fs.writeFileSync(OUT_BLUEPRINT, JSON.stringify(blueprintOut, null, 2), "utf8");

  const lessons = topics.map((row) => buildLesson(topics, row));
  const questions = [];
  let g = 0;
  for (const row of topics) {
    const n = row.questionQuotaForTopic;
    for (let q = 0; q < n; q++) {
      const useSata = g % 5 === 4;
      questions.push(useSata ? buildSata(row, q, g) : buildMcq(row, q, g));
      g++;
    }
  }

  if (lessons.length !== 100) throw new Error(`lessons ${lessons.length}`);
  if (questions.length !== 300) throw new Error(`questions ${questions.length}`);

  const seen = new Set();
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (seen.has(h)) throw new Error(`dup stem ${q.topicSlug}`);
    seen.add(h);
  }

  const byTrack = {};
  for (const l of lessons) byTrack[l.careerTrack] = (byTrack[l.careerTrack] || 0) + 1;
  const qBy = {};
  for (const q of questions) qBy[q.careerTrack] = (qBy[q.careerTrack] || 0) + 1;

  const batch = {
    _meta: {
      description: "100 allied lessons + 300 allied questions (static generator)",
      program: PROGRAM,
      pathwayId: PATHWAY_ID,
      blueprintFile: "data/blueprints/allied-health-blueprint.json",
      generatedAt: new Date().toISOString(),
      lessonsByCareerTrack: byTrack,
      questionsByCareerTrack: qBy,
      questionTypes: {
        "single-best-answer": questions.filter((q) => q.questionType === "single-best-answer").length,
        sata: questions.filter((q) => q.questionType === "sata").length,
      },
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      stemHashAlgorithm: "sha256-hex-first32-lowercase-stem",
    },
    lessons,
    questions,
  };

  fs.mkdirSync(path.dirname(OUT_BATCH), { recursive: true });
  fs.writeFileSync(OUT_BATCH, JSON.stringify(batch, null, 2), "utf8");
  console.log(`Wrote ${OUT_BLUEPRINT}`);
  console.log(`Wrote ${OUT_BATCH}`);
  console.log(JSON.stringify(batch._meta, null, 2));
}

main();
