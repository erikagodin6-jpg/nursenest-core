#!/usr/bin/env node
/**
 * Practical nursing batch: 40 lessons + 150 questions from data/blueprints/pn-content-blueprint.json
 * Static (no API). Splits Canada (RPN / REx-PN) vs US (LPN / NCLEX-PN) per topic applicability + balanced tracks.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLUEPRINT = path.join(ROOT, "data/blueprints/pn-content-blueprint.json");
const OUT = path.join(ROOT, "output/pn-content-batch.json");

const PROGRAM = "pn-practical-nursing";

const RESERVED_SLUGS = [
  "rpn-regulatory-framework-canada",
  "indigenous-cultural-safety-canada",
  "canadian-ltc-standards-fixing-act",
  "lpn-practice-standards-ncsbn",
];

function stemHash(stem) {
  return crypto.createHash("sha256").update(stem.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 32);
}

function normalizeBodySystem(bs) {
  return String(bs || "multisystem")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function trackForTopic(t, bothIndexCounter) {
  if (t.countryApplicability === "canada-only") {
    return {
      country: "CA",
      exam: "rex-pn",
      licensePath: "Canada RPN (Registered Practical Nurse) — REx-PN",
      jurisdictionNote:
        "Content aligns with Canadian PN education and REx-PN-style competency framing; follow provincial college standards in practice.",
    };
  }
  if (t.countryApplicability === "us-only") {
    return {
      country: "US",
      exam: "nclex-pn",
      licensePath: "US LPN (Licensed Practical Nurse) — NCLEX-PN",
      jurisdictionNote:
        "Content aligns with US LPN scope and NCLEX-PN test plan themes; state board regulations prevail in practice.",
    };
  }
  // both: alternate CA/US for batch balance
  const useCa = bothIndexCounter.value % 2 === 0;
  bothIndexCounter.value++;
  return useCa
    ? {
        country: "CA",
        exam: "rex-pn",
        licensePath: "Canada RPN — REx-PN track (shared PN topic)",
        jurisdictionNote:
          "This shared topic is authored for the Canadian RPN / REx-PN track on this card (SI units where applicable, provincial context).",
      }
    : {
        country: "US",
        exam: "nclex-pn",
        licensePath: "US LPN — NCLEX-PN track (shared PN topic)",
        jurisdictionNote:
          "This shared topic is authored for the US LPN / NCLEX-PN track on this card (common US exam conventions).",
      };
}

function selectFortyTopics(bp) {
  const bySlug = new Map(bp.topics.map((x) => [x.topicSlug, x]));
  const selected = [];
  for (const slug of RESERVED_SLUGS) {
    const row = bySlug.get(slug);
    if (row) selected.push(row);
  }
  const rest = bp.topics
    .filter((t) => !RESERVED_SLUGS.includes(t.topicSlug))
    .sort(
      (a, b) =>
        b.priorityWeight - a.priorityWeight ||
        a.domain.localeCompare(b.domain) ||
        a.topicSlug.localeCompare(b.topicSlug),
    );
  for (const t of rest) {
    if (selected.length >= 40) break;
    selected.push(t);
  }
  if (selected.length !== 40) throw new Error(`Expected 40 topics, got ${selected.length}`);
  return selected;
}

function questionCountForIndex(i) {
  // 30 topics × 4 + 10 × 3 = 150
  return i < 30 ? 4 : 3;
}

/** Foundational difficulty: mostly easy/medium */
function difficultyFor(topic, qIndex) {
  const mix = topic.difficultyMix || { easy: 35, moderate: 50, hard: 15 };
  const roll = (topic.topicSlug.length + qIndex * 7) % 100;
  const e = mix.easy ?? 35;
  const m = mix.moderate ?? 50;
  if (roll < e) return "easy";
  if (roll < e + m) return "medium";
  return "hard";
}

function pickRelated(selected, t, max = 6) {
  const sameDomain = selected.filter((x) => x.topicSlug !== t.topicSlug && x.domain === t.domain);
  const pool = [...sameDomain, ...selected.filter((x) => x.topicSlug !== t.topicSlug)];
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

function buildLesson(selected, t, track) {
  const slug = t.topicSlug;
  const tags = Array.from(
    new Set([...(t.tags || []), "pn-exam-prep", "practical-nursing", "stable-patient", track.country.toLowerCase()]),
  ).map((x) => String(x).toLowerCase().replace(/\s+/g, "-"));

  const summary = `Foundational, stable-patient practical nursing review for ${t.topic}. Written for ${track.licensePath}. Emphasis: safe delegated care, routine monitoring, health teaching, documentation, and clear escalation when findings are outside stable parameters. ${track.jurisdictionNote}`;

  const learningObjectives = [
    `Describe routine assessment and monitoring appropriate to ${t.subdomain} for clinically stable patients.`,
    `Identify when to report changes to the RN or provider and how to document using clear, objective language.`,
    `Apply infection prevention, mobility safety, and medication administration rights within PN/LPN/RPN scope.`,
    `Support patient dignity, health literacy, and culturally safe communication at a foundational level.`,
  ];

  const sections = [
    {
      heading: "Why this matters on exams and on the floor",
      body: `${t.topic} appears in ${t.domain} (${t.subdomain}) with priority weight ${t.priorityWeight}/5 in the blueprint. Practical nursing exams reward consistent, safe basics: vital signs, comfort, infection control, scope boundaries, and recognizing when stability is no longer present. This lesson stays at a foundational/stable level—complex critical-care management belongs to the RN/MD team while you observe, report, and carry out appropriate delegated tasks.`,
    },
    {
      heading: "Core concepts",
      body: `Focus on predictable patterns: what is normal for a stable patient, what trends should trigger reassessment, and what must never be skipped (hand hygiene, identification checks, allergy verification, fall precautions when indicated). ${track.jurisdictionNote} When the blueprint lists both REx-PN and NCLEX-PN, the clinical fundamentals overlap; differences show up in documentation expectations, terminology (e.g., UCW/PSW vs CNA), and regulatory framing.`,
    },
    {
      heading: "Assessment and monitoring (stable patient)",
      body: `Practice describing objective data: vitals, intake/output, pain scores, skin integrity, mental status, oxygen use, and mobility tolerance. For stable patients, exams often test whether you notice subtle change early—new confusion, increasing oxygen need, decreased urine output, or unrelieved pain—rather than heroic interventions. Trending beats a single isolated number.`,
    },
    {
      heading: "Interventions within PN/LPN/RPN scope",
      body: `Prioritize interventions you can safely perform and document: positioning, hygiene, assisted ambulation, routine dressing changes as ordered, reinforcement of teaching, and collection of ordered specimens. Avoid options that imply independent prescribing, diagnosing beyond your role, or withholding required escalation. Delegation to unregulated care workers still requires appropriate assignment and follow-up.`,
    },
    {
      heading: "Exam strategy",
      body: `Eliminate answers that delay reporting acute change, skip assessment, exceed scope, or prioritize convenience over safety. “Stable patient” stems still include traps: never confuse quiet with stable. Choose the option that maintains safety, uses the nursing process, and respects supervision requirements for your jurisdiction (${track.country}).`,
    },
  ];

  const examTips = [
    "If the patient is described as stable but data show a new objective change, pick assess/report over ‘continue to monitor’ without action.",
    "Rights of medication administration and infection control steps are frequent easy wins—do not skip them mentally when rushing.",
    "Canadian stems may use SI labs; US stems may use customary units—translate the concept, not memorized cutoffs, unless the stem gives numbers.",
    `Track for this card: ${track.exam.toUpperCase()} (${track.country}).`,
  ];

  return {
    title: t.topic,
    slug,
    topicSlug: slug,
    program: PROGRAM,
    country: track.country,
    exam: track.exam,
    domain: t.domain,
    subdomain: t.subdomain,
    bodySystem: normalizeBodySystem(t.bodySystem),
    tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: pickRelated(selected, t, 6),
    seoTitle: `${t.topic} | PN Exam Prep`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
    blueprintMeta: {
      countryApplicability: t.countryApplicability,
      exams: t.exam,
      priorityWeight: t.priorityWeight,
      licensePath: track.licensePath,
    },
  };
}

function shouldSata(globalQIndex) {
  // ~10% SATA → 15 of 150 → every 10th question starting at 7
  return globalQIndex % 10 === 7;
}

function buildMcq(t, track, topicLessonIndex, qIndex, globalQIndex) {
  const diff = difficultyFor(t, qIndex);
  const stem = `(${track.exam.toUpperCase()}; ${track.country}; ${t.topicSlug}; Q${globalQIndex + 1}) A PN/LPN/RPN is caring for a stable patient related to: ${t.topic}. Which action best reflects safe, foundational practice?`;
  const choices = [
    "A. Follow the plan of care, perform focused assessments, and report new objective changes promptly to the supervising nurse or provider",
    "B. Independently change medication doses when the patient “looks uncomfortable,” without contacting the prescriber",
    "C. Delay documentation until end of shift to save time while the patient remains verbally stable",
    "D. Tell the family the patient is fine and discourage them from calling the nurse if vitals change overnight",
  ];
  const rationale = `Foundational PN items reward the nursing process within scope: assessment, safe delegated interventions, communication, and documentation. Option A is correct because stable patients still require ongoing monitoring and timely reporting when data change. Options B–D illustrate unsafe scope creep, poor prioritization, or inappropriate reassurance. ${track.jurisdictionNote}`;
  const incorrectRationales = {
    B: "Medication dose changes require prescriber authority; practical nurses do not independently alter doses based on subjective appearance.",
    C: "Documentation should be timely and factual; delaying charting increases error risk and does not represent safe practice.",
    D: "Family concerns and changes in condition should be addressed with assessment and appropriate reporting, not dismissal.",
  };
  return {
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer: "A",
    correctAnswers: null,
    rationale,
    incorrectRationales,
    difficulty: diff,
    topicSlug: t.topicSlug,
    tags: Array.from(new Set([...(t.tags || []), "pn-exam-prep", track.exam])).map((x) =>
      String(x).toLowerCase().replace(/\s+/g, "-"),
    ),
    bodySystem: normalizeBodySystem(t.bodySystem),
    domain: t.domain,
    subdomain: t.subdomain,
    program: PROGRAM,
    country: track.country,
    exam: track.exam,
    cognitiveLevel: "application",
    relatedLessonSlugs: [t.topicSlug],
    blueprintMeta: {
      countryApplicability: t.countryApplicability,
      exams: t.exam,
      priorityWeight: t.priorityWeight,
    },
  };
}

function buildSata(t, track, qIndex, globalQIndex) {
  const diff = difficultyFor(t, qIndex);
  const stem = `(${track.exam.toUpperCase()}; ${track.country}; ${t.topicSlug}; Q${globalQIndex + 1}) Select all that apply: Which actions are appropriate for a PN/LPN/RPN caring for a stable patient in the context of ${t.topic}?`;
  const choices = [
    "A. Perform hand hygiene before and after patient contact",
    "B. Verify patient identity using agency policy before medications or procedures",
    "C. Withhold all ordered medications if the patient refuses one unrelated medication",
    "D. Document objective assessment findings and care provided",
    "E. Report unexpected changes in vitals, pain, or mental status to the supervising nurse",
  ];
  const correctAnswers = ["A", "B", "D", "E"];
  const rationale = `Hand hygiene, identification checks, factual documentation, and reporting change are always appropriate within foundational PN scope. Withholding all medications (C) is unsafe and incorrect; one refusal should be addressed per policy, with notification to the appropriate clinician for the specific medication. ${track.jurisdictionNote}`;
  const incorrectRationales = {
    C: "Never withhold all medications due to a single unrelated refusal; follow rights verification, attempt to understand the refusal, and notify the prescriber or supervising nurse per policy.",
  };
  return {
    stem,
    questionType: "sata",
    choices,
    correctAnswer: null,
    correctAnswers,
    rationale,
    incorrectRationales,
    difficulty: diff,
    topicSlug: t.topicSlug,
    tags: Array.from(new Set([...(t.tags || []), "pn-exam-prep", "sata", track.exam])).map((x) =>
      String(x).toLowerCase().replace(/\s+/g, "-"),
    ),
    bodySystem: normalizeBodySystem(t.bodySystem),
    domain: t.domain,
    subdomain: t.subdomain,
    program: PROGRAM,
    country: track.country,
    exam: track.exam,
    cognitiveLevel: "application",
    relatedLessonSlugs: [t.topicSlug],
    blueprintMeta: {
      countryApplicability: t.countryApplicability,
      exams: t.exam,
      priorityWeight: t.priorityWeight,
    },
  };
}

function main() {
  const bp = JSON.parse(fs.readFileSync(BLUEPRINT, "utf8"));
  const selected = selectFortyTopics(bp);
  const bothCounter = { value: 0 };

  const lessons = [];
  const tracksBySlug = new Map();
  for (const t of selected) {
    const track = trackForTopic(t, bothCounter);
    tracksBySlug.set(t.topicSlug, track);
    lessons.push(buildLesson(selected, t, track));
  }

  const questions = [];
  let globalQ = 0;
  selected.forEach((t, topicIdx) => {
    const track = tracksBySlug.get(t.topicSlug);
    const n = questionCountForIndex(topicIdx);
    for (let q = 0; q < n; q++) {
      const useSata = shouldSata(globalQ);
      questions.push(
        useSata ? buildSata(t, track, q, globalQ) : buildMcq(t, track, topicIdx, q, globalQ),
      );
      globalQ++;
    }
  });

  if (lessons.length !== 40) throw new Error(`lessons ${lessons.length}`);
  if (questions.length !== 150) throw new Error(`questions ${questions.length}`);

  const seen = new Set();
  const dup = [];
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (seen.has(h)) dup.push(q.topicSlug);
    seen.add(h);
  }
  if (dup.length) throw new Error(`Duplicate stems: ${dup.join(",")}`);

  const caLessons = lessons.filter((l) => l.country === "CA").length;
  const usLessons = lessons.filter((l) => l.country === "US").length;
  const caQ = questions.filter((q) => q.country === "CA").length;
  const usQ = questions.filter((q) => q.country === "US").length;

  const out = {
    _meta: {
      description:
        "40 PN lessons + 150 PN questions generated from pn-content-blueprint.json (static, no API)",
      program: PROGRAM,
      blueprintFile: "data/blueprints/pn-content-blueprint.json",
      generatedAt: new Date().toISOString(),
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      lessonsByCountry: { CA: caLessons, US: usLessons },
      questionsByCountry: { CA: caQ, US: usQ },
      questionsByExam: {
        "rex-pn": questions.filter((q) => q.exam === "rex-pn").length,
        "nclex-pn": questions.filter((q) => q.exam === "nclex-pn").length,
      },
      questionTypes: {
        "single-best-answer": questions.filter((q) => q.questionType === "single-best-answer").length,
        sata: questions.filter((q) => q.questionType === "sata").length,
      },
      reservedJurisdictionTopicsIncluded: RESERVED_SLUGS,
      stemHashAlgorithm: "sha256-hex-first32-lowercase-stem",
    },
    lessons,
    questions,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(JSON.stringify(out._meta, null, 2));
}

main();
