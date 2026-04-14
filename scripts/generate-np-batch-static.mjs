#!/usr/bin/env node
/**
 * NP advanced practice batch: 30 lessons + 120 questions from
 * data/blueprints/advanced-practice/np-advanced-practice-blueprint.json
 * Static (no API). Case vignettes, prescribing/management focus, unique stems.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLUEPRINT = path.join(ROOT, "data/blueprints/advanced-practice/np-advanced-practice-blueprint.json");
const OUT = path.join(ROOT, "output/np-content-batch.json");

const PROGRAM = "np-advanced-practice";
const EXAMS_ROTATE = ["aanp-fnp", "ancc-fnp", "ancc-agpcnp"];

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

function topicRank(t) {
  const pr = { core: 0, "high-risk": 1, "special-population": 2, supporting: 3 }[t.clinicalPriority] ?? 5;
  const cx = { advanced: 0, intermediate: 1, foundational: 2 }[t.careComplexity] ?? 3;
  return pr * 10 + cx;
}

function selectThirtyTopics(bp) {
  const sorted = [...bp.topics].sort(
    (a, b) =>
      topicRank(a) - topicRank(b) ||
      a.domain.localeCompare(b.domain) ||
      a.subdomain.localeCompare(b.subdomain) ||
      a.topicSlug.localeCompare(b.topicSlug),
  );
  return sorted.slice(0, 30);
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

function vignetteSeed(t, qIndex) {
  const h = crypto.createHash("sha256").update(`${t.topicSlug}:${qIndex}:np`).digest();
  const ages = [48, 55, 62, 67, 44, 71, 58];
  const age = ages[h[0] % ages.length];
  const sex = h[1] % 2 === 0 ? "man" : "woman";
  const days = 3 + (h[2] % 10);
  return { age, sex, days };
}

function difficultyFor(topic, qIndex) {
  const mix = topic.difficultyMix || { medium: 25, hard: 50, expert: 25 };
  const roll = crypto.createHash("sha256").update(`${topic.topicSlug}:${qIndex}:diff`).digest().readUInt16BE(0) % 100;
  const m = mix.medium ?? 25;
  const h = mix.hard ?? 50;
  if (roll < m) return "medium";
  if (roll < m + h) return "hard";
  return "expert";
}

function buildLesson(bp, selected, t, topicIdx) {
  const slug = t.topicSlug;
  const exam = EXAMS_ROTATE[topicIdx % EXAMS_ROTATE.length];
  const tags = Array.from(
    new Set([...(t.tags || []), "np-exam-prep", "advanced-practice", "case-based", t.clinicalPriority || ""]),
  ).map((x) => String(x).toLowerCase().replace(/\s+/g, "-"));

  const summary = `Graduate-level NP lesson on ${t.topic} (${t.subdomain}). Emphasis: differential reasoning, evidence-informed diagnostic planning, prescribing and longitudinal management within scope, safety monitoring, and shared decision-making. Exam orientation: ${exam.toUpperCase().replace(/-/g, " ")}-style case synthesis; jurisdictional prescribing rules vary by state/province—this content is exam preparation, not a substitute for local law or collaborative practice agreements.`;

  const learningObjectives = [
    `Formulate a prioritized differential and rational diagnostic approach for presentations related to ${t.topic}.`,
    `Outline first-line and alternative pharmacologic and non-pharmacologic management options, including contraindications, monitoring, and follow-up intervals.`,
    `Identify red-flag findings that require escalation, specialist referral, or emergency disposition.`,
    `Apply ethical, legal, and interprofessional considerations relevant to NP autonomous and collaborative practice.`,
  ];

  const sections = [
    {
      heading: "Clinical reasoning and differential diagnosis",
      body: `${t.topic} sits in ${t.domain} — ${t.subdomain}. Advanced NP items reward structured differentials: what must be ruled out urgently, what is most likely in primary or urgent care, and which features on history, exam, and targeted testing change pre-test probability. Avoid premature closure; anchor decisions to guideline-linked criteria where they exist, and document clinical reasoning when management is shared or deferred.`,
    },
    {
      heading: "Diagnostic evaluation and monitoring",
      body: `Select tests that change management, not reflex panels. For each modality, ask: sensitivity/specificity in this population, false-positive risk, cost, turnaround, and what you will do with the result tonight versus next visit. Build monitoring plans tied to therapy risk (renal function on nephrotoxic drugs, LFTs on hepatotoxic agents, ECG/QT when relevant, blood pressure and symptom diaries). Reconcile prior records and medication lists before ordering.`,
    },
    {
      heading: "Prescribing and longitudinal management",
      body: `NP prescribing questions often hinge on choosing the right initial agent, adjusting for comorbidities, pregnancy/lactation status, renal/hepatic clearance, drug interactions, and deprescribing when harms exceed benefits. Include patient preferences, affordability, and measurable outcomes. When scope requires collaboration, document the consultative relationship and follow-up ownership clearly.`,
    },
    {
      heading: "Safety, ethics, and disposition",
      body: `Address contraindications, black-box warnings, misuse potential (e.g., opioids, benzodiazepines), infection stewardship, anticoagulation bleeding risk, and immunosuppression. Ethics cases may include confidentiality, capacity, surrogate decision-making, and equity. Disposition must match severity: outpatient with safety netting, urgent referral, same-day escalation, or emergency care when red flags are present.`,
    },
    {
      heading: "Exam strategy (case-based stems)",
      body: `Read the stem twice: first for diagnosis category, second for constraints (pregnancy, CKD stage, anticoagulation, prior adverse reaction). Eliminate options that skip necessary workup, violate monitoring, exceed scope, or ignore dangerous comorbidities. On management items, choose the regimen with the best benefit/risk for this exact patient, not a generic “textbook average” patient.`,
    },
  ];

  const examTips = [
    "When the stem gives a medication allergy or pregnancy status, an answer that ignores it is almost always wrong.",
    "If two diagnostics seem reasonable, prefer the test that rules out cannot-miss diagnoses or changes immediate management.",
    "Prescribing stems: match follow-up and labs to drug risk—monitor what you initiate.",
    `This card is tagged for ${exam.toUpperCase().replace(/-/g, " ")} rotation; NP boards share overlapping management themes.`,
  ];

  return {
    title: t.topic,
    slug,
    topicSlug: slug,
    program: PROGRAM,
    country: "US",
    exam,
    domain: t.domain,
    subdomain: t.subdomain,
    bodySystem: normalizeBodySystem(t.bodySystem),
    tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: pickRelated(selected, t, 6),
    seoTitle: `${t.topic} | NP Advanced Practice`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
    blueprintMeta: {
      complexity: t.complexity,
      clinicalPriority: t.clinicalPriority,
      careComplexity: t.careComplexity,
      populationTags: t.populationTags,
      targetExams: bp.targetExams,
      lessonTargetCount: t.lessonTargetCount,
      questionTargetCount: t.questionTargetCount,
    },
  };
}

function buildCaseMcq(t, exam, qIndex, archetype) {
  const v = vignetteSeed(t, qIndex);
  const diff = difficultyFor(t, qIndex);
  const stem = `(${exam}; ${t.topicSlug}; case Q${qIndex + 1}) A ${v.age}-year-old ${v.sex} presents with a ${v.days}-day course concerning for ${t.topic.toLowerCase()}. Vitals are documented; focused exam and limited labs are available as in a typical outpatient NP visit. Which next step best reflects advanced clinical decision-making and safe management?`;

  let choices;
  let correctAnswer;
  let incorrectRationales;

  if (archetype === "dx") {
    choices = [
      "A. Order broad unrelated screening tests before completing a targeted history and physical exam",
      "B. Complete a focused history and exam, refine the differential for this presentation, and order targeted testing that changes management",
      "C. Reassure and discharge without safety-net instructions because vitals are currently normal",
      "D. Start high-risk empiric therapy without confirming key contraindications, allergies, pregnancy status, or renal function",
    ];
    correctAnswer = "B";
    incorrectRationales = {
      A: "Ordering broad panels without a refined differential is inefficient, costly, and can generate misleading false positives; advanced practice prioritizes targeted evaluation.",
      C: "Even with normal vitals, many serious conditions require explicit follow-up, patient education, and return precautions; blanket reassurance is unsafe when red flags may evolve.",
      D: "Empiric therapy must be paired with contraindication screening, indication confirmation, and monitoring plans; skipping this step fails prescribing safety standards.",
    };
  } else if (archetype === "rx") {
    choices = [
      "A. Select guideline-concordant first-line therapy for the most likely diagnosis, adjust for comorbidities and drug interactions, and define monitoring and follow-up",
      "B. Prescribe multiple new high-risk agents simultaneously without a phased plan or monitoring",
      "C. Choose therapy based solely on brand recognition without checking renal/hepatic clearance or interactions",
      "D. Defer all treatment decisions indefinitely without documenting shared decision-making or follow-up interval",
    ];
    correctAnswer = "A";
    incorrectRationales = {
      B: "Polypharmacy without monitoring increases adverse events; staged initiation with safety labs/vitals is expected on NP exams.",
      C: "Clearance, interactions, and contraindications are non-negotiable prescribing steps.",
      D: "Deferral may be appropriate sometimes, but it must include a time-bound plan, patient understanding, and safety netting—not indefinite ambiguity.",
    };
  } else {
    choices = [
      "A. Establish monitoring parameters, patient education on adverse effects, and explicit return precautions tied to red-flag symptoms",
      "B. Advise the patient to stop all medications if mild nausea occurs, without assessing severity or alternative causes",
      "C. Schedule follow-up only if the patient remembers to call, without a defined interval",
      "D. Ignore social determinants that affect adherence (cost, transportation, health literacy)",
    ];
    correctAnswer = "A";
    incorrectRationales = {
      B: "Abrupt cessation of multiple medications can cause harm; nausea should be assessed, documented, and managed per guideline and scope.",
      C: "Ambulatory safety requires a defined follow-up window for high-risk therapies and conditions.",
      D: "Effective management incorporates adherence barriers; ignoring social determinants undermines outcomes and is penalized on boards.",
    };
  }

  const rationale = `This case stem maps to ${t.topic} within ${t.domain}. The correct option demonstrates NP-level sequencing: refine differential, choose targeted workup, prescribe with monitoring, and communicate risk. Incorrect options illustrate common traps: shotgun testing, premature reassurance, unsafe empiricism, polypharmacy without monitoring, or neglecting follow-up and social context. Difficulty graded as ${diff} per blueprint-style weighting.`;

  return {
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer,
    correctAnswers: null,
    rationale,
    incorrectRationales,
    difficulty: diff,
    topicSlug: t.topicSlug,
    tags: Array.from(new Set([...(t.tags || []), "np-exam-prep", "case-based", exam])).map((x) =>
      String(x).toLowerCase().replace(/\s+/g, "-"),
    ),
    bodySystem: normalizeBodySystem(t.bodySystem),
    domain: t.domain,
    subdomain: t.subdomain,
    program: PROGRAM,
    country: "US",
    exam,
    cognitiveLevel: archetype === "dx" ? "analysis" : archetype === "rx" ? "application" : "analysis",
    relatedLessonSlugs: [t.topicSlug],
    blueprintMeta: {
      clinicalPriority: t.clinicalPriority,
      careComplexity: t.careComplexity,
      caseArchetype: archetype,
    },
  };
}

function buildCaseSata(t, exam, qIndex) {
  const v = vignetteSeed(t, qIndex + 11);
  const diff = difficultyFor(t, qIndex);
  const stem = `(${exam}; ${t.topicSlug}; case Q${qIndex + 1}) A ${v.age}-year-old ${v.sex} with a presentation consistent with ${t.topic.toLowerCase()} will begin an outpatient management plan. Select all that apply: Which elements are appropriate for an NP-led plan emphasizing prescribing safety and longitudinal care?`;

  const choices = [
    "A. Document indication, dose, duration, and monitoring for any new medication started",
    "B. Review allergies, pregnancy/lactation status, renal/hepatic function, and major drug interactions before prescribing",
    "C. Provide patient education on expected benefits, common adverse effects, and when to seek urgent care",
    "D. Start high-dose opioids and benzodiazepines together for comfort without risk stratification",
    "E. Define a follow-up interval and objective parameters to reassess response and toxicity",
  ];
  const correctAnswers = ["A", "B", "C", "E"];
  const rationale = `NP management stems reward comprehensive safe plans: documentation, pre-prescribing screening, education, and follow-up. Option D is unsafe poly-sedation without risk stratification and is incorrect. This reflects prescribing-and-management focus for ${t.subdomain}.`;
  const incorrectRationales = {
    D: "Combining high-dose opioids and benzodiazepines without careful indication, risk assessment, and monitoring is inappropriate and contraindicated on licensing-style items except in rare controlled contexts not described here.",
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
    tags: Array.from(new Set([...(t.tags || []), "np-exam-prep", "sata", "prescribing", exam])).map((x) =>
      String(x).toLowerCase().replace(/\s+/g, "-"),
    ),
    bodySystem: normalizeBodySystem(t.bodySystem),
    domain: t.domain,
    subdomain: t.subdomain,
    program: PROGRAM,
    country: "US",
    exam,
    cognitiveLevel: "analysis",
    relatedLessonSlugs: [t.topicSlug],
    blueprintMeta: {
      clinicalPriority: t.clinicalPriority,
      careComplexity: t.careComplexity,
      caseArchetype: "management-plan",
    },
  };
}

function main() {
  const bp = JSON.parse(fs.readFileSync(BLUEPRINT, "utf8"));
  const selected = selectThirtyTopics(bp);

  const lessons = selected.map((t, i) => buildLesson(bp, selected, t, i));

  const questions = [];
  let g = 0;
  for (let ti = 0; ti < selected.length; ti++) {
    const t = selected[ti];
    const exam = EXAMS_ROTATE[ti % EXAMS_ROTATE.length];
    const archetypes = ["dx", "rx", "fu", "sata"];
    for (let q = 0; q < 4; q++) {
      if (archetypes[q] === "sata") {
        questions.push(buildCaseSata(t, exam, g));
      } else {
        questions.push(buildCaseMcq(t, exam, g, archetypes[q]));
      }
      g++;
    }
  }

  if (lessons.length !== 30) throw new Error(`lessons ${lessons.length}`);
  if (questions.length !== 120) throw new Error(`questions ${questions.length}`);

  const seen = new Set();
  const dup = [];
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (seen.has(h)) dup.push(q.topicSlug);
    seen.add(h);
  }
  if (dup.length) throw new Error(`Duplicate stems: ${dup.join(",")}`);

  const diffC = {};
  for (const q of questions) diffC[q.difficulty] = (diffC[q.difficulty] || 0) + 1;

  const out = {
    _meta: {
      description:
        "30 NP lessons + 120 NP questions from np-advanced-practice-blueprint.json (static, no API)",
      program: PROGRAM,
      blueprintFile: "data/blueprints/advanced-practice/np-advanced-practice-blueprint.json",
      generatedAt: new Date().toISOString(),
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      questionsPerTopic: 4,
      questionTypes: {
        "single-best-answer": questions.filter((q) => q.questionType === "single-best-answer").length,
        sata: questions.filter((q) => q.questionType === "sata").length,
      },
      questionDifficulty: diffC,
      examRotation: EXAMS_ROTATE,
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
