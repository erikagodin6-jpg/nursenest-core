#!/usr/bin/env node
/**
 * Static generator: 50 RN lessons + 200 exam questions from output/rn-topic-manifest.json
 * No external API. Writes output/rn-content-batch.json (schema aligned with new-grad JSON exports).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(ROOT, "output/rn-topic-manifest.json");
const OUT = path.join(ROOT, "output/rn-content-batch.json");

const PROGRAM = "rn-nclex-exam-prep";

function stemHash(stem) {
  return crypto.createHash("sha256").update(stem.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 32);
}

function titleCaseBodySystem(bs) {
  return bs
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function domainSub(t) {
  const bt = titleCaseBodySystem(t.bodySystem);
  switch (t.category) {
    case "med-surg":
      return { domain: "Physiological Integrity", subdomain: `${bt} Care` };
    case "pharmacology":
      return { domain: "Pharmacological Therapies", subdomain: "Medication Safety" };
    case "prioritization":
      return { domain: "Management of Care", subdomain: "Priority Setting" };
    case "safety":
      return { domain: "Safety and Infection Control", subdomain: "Risk Reduction" };
    case "delegation":
      return { domain: "Management of Care", subdomain: "Delegation" };
    default:
      return { domain: "Management of Care", subdomain: "General" };
  }
}

function countryLabel(c) {
  return c === "CA" ? "Canada" : "United States";
}

function regionNote(t) {
  if (t.country === "CA") {
    return "Use Canadian context where relevant: SI labs (mmol/L for glucose when applicable), kPa for blood gases when used, CTAS triage language for emergency scenarios, RPN/LPN scope paired with RN accountability, and provincial interprofessional standards. This is exam preparation content, not bedside medical orders.";
  }
  return "Use US NCLEX-RN context where relevant: common US units (mg/dL glucose when applicable), START triage language for mass-casualty style stems, UAP scope language, and Joint Commission–style safety framing. This is exam preparation content, not bedside medical orders.";
}

function pickRelatedSlugs(allTopics, t, max = 6) {
  const sameCat = allTopics.filter((x) => x.topicSlug !== t.topicSlug && x.category === t.category);
  const sameBs = allTopics.filter(
    (x) => x.topicSlug !== t.topicSlug && x.bodySystem === t.bodySystem && !sameCat.includes(x),
  );
  const pool = [...sameCat, ...sameBs, ...allTopics.filter((x) => x.topicSlug !== t.topicSlug)];
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

function buildLesson(allTopics, t) {
  const { domain, subdomain } = domainSub(t);
  const related = pickRelatedSlugs(allTopics, t, 6);
  const slug = t.topicSlug;
  const tags = Array.from(new Set([...(t.tags || []), "rn-exam-prep", t.category, t.difficulty])).map((x) =>
    String(x).toLowerCase().replace(/\s+/g, "-"),
  );

  const summary = `Exam-focused review of ${t.topicLabel} for RN candidates in the ${countryLabel(t.country)} context, with emphasis on assessment cues, priority interventions, monitoring, and patient safety. ${regionNote(t)}`;

  const learningObjectives = [
    `Describe priority assessment findings and monitoring parameters for ${t.topicLabel} on a medical-surgical or step-down unit.`,
    `Explain evidence-informed nursing interventions, including when to escalate care and how to communicate using SBAR.`,
    `Identify common exam distractors related to ${t.topicLabel} and distinguish safe nursing actions from unsafe choices.`,
    `Apply ${t.category === "pharmacology" ? "pharmacology principles, adverse effects, and monitoring" : "clinical judgment"} to integrated scenarios involving ${titleCaseBodySystem(t.bodySystem)} priorities.`,
  ];

  const ctx = regionNote(t);
  const sections = [
    {
      heading: "Clinical overview",
      body: `${t.topicLabel} is a high-yield topic for RN licensing exams because it blends pathophysiology, assessment, interventions, and safety. Nurses are tested on recognizing instability early, selecting the best first action, and anticipating complications rather than memorizing rare trivia. Keep the ${t.bodySystem.replace(/-/g, " ")} lens in mind: trends beat single numbers, and airway–breathing–circulation threats outrank comfort tasks when priorities compete. ${ctx}`,
    },
    {
      heading: "Pathophysiology and risk factors (exam lens)",
      body: `Focus on mechanisms that create predictable nursing priorities: tissue oxygen delivery, fluid shifts, inflammation, end-organ perfusion, and medication-related vulnerabilities. Exam items often pair a subtle trend (rising heart rate, narrowing pulse pressure, new confusion, or progressive work of breathing) with a distractor that sounds reasonable but delays escalation. Ask yourself what would harm the patient fastest if ignored, and what assessment data would change your next action within minutes.`,
    },
    {
      heading: "Assessment and monitoring",
      body: `Build a mental checklist for bedside assessment: level of consciousness and airway protection, work of breathing and oxygenation, perfusion and urine output when relevant, pain and sedation interplay, infection cues, and high-alert medication effects. Tie monitoring to the plan of care: what parameter, how often, what threshold triggers notification, and what you would say in SBAR. For ${countryLabel(t.country)} learners, be fluent in both common unit conventions used in stems and the underlying physiology so unit swaps do not break your reasoning.`,
    },
    {
      heading: "Interventions, collaboration, and safety",
      body: `Prioritize interventions that stabilize the patient, prevent injury, and preserve dignity: oxygen and airway support as indicated, vascular access and labs as ordered, medication administration with rights verification, fall and bleeding precautions, infection prevention, and patient education that matches readiness to learn. Delegation items reward knowing what can be assigned to UAP/PSW versus what requires RN judgment, including follow-up supervision. Documentation should reflect assessments, notifications, and patient responses—not tasks performed without verification.`,
    },
    {
      heading: "Exam strategy and distractor patterns",
      body: `Expect prioritization stems with multiple “urgent-sounding” patients: choose the option that addresses airway, breathing, circulation, or rapid neurologic decline first. For medication items, watch for reversed priorities (treating a number without symptoms), duplicate therapy, ignored allergies, and monitoring omissions for high-risk classes. SATA items reward comprehensive safe nursing: select every true nursing action, not only the “most important” one. When uncertain, eliminate options that delay assessment, withhold needed escalation, or violate scope and standards of practice.`,
    },
  ];

  const examTips = [
    "If two answers look correct, pick the action that assesses first when assessment data is missing—unless the stem already confirms a life threat that requires immediate intervention.",
    "For medication safety, link high-alert drugs to monitoring (labs, vitals, sedation, bleeding) rather than memorizing isolated facts.",
    "SATA: treat each option as true/false; do not stop after finding two correct answers if more are safe and indicated.",
    `Region tip (${t.country}): read units carefully and translate glucose or lab values mentally when the stem uses ${t.country === "CA" ? "mmol/L" : "mg/dL"} conventions.`,
  ];

  return {
    title: t.topicLabel,
    slug,
    topicSlug: slug,
    program: PROGRAM,
    country: t.country,
    exam: "nclex-rn",
    domain,
    subdomain,
    bodySystem: t.bodySystem,
    tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: related,
    seoTitle: `${t.topicLabel} | RN Exam Prep | NurseNest`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
  };
}

function questionPlan(difficulty) {
  if (difficulty === "easy") return ["mcq", "mcq", "mcq", "mcq"];
  if (difficulty === "medium") return ["mcq", "mcq", "mcq", "sata"];
  return ["mcq", "mcq", "sata", "sata"];
}

function cognitiveFor(i, kind) {
  if (kind === "sata") return i === 3 ? "analysis" : "application";
  return i === 0 ? "application" : i === 1 ? "analysis" : "application";
}

function buildQuestions(allTopics, t) {
  const { domain, subdomain } = domainSub(t);
  const plan = questionPlan(t.difficulty);
  const relatedLessons = pickRelatedSlugs(allTopics, t, 4).filter((s) => s !== t.topicSlug);
  const baseRelated = [t.topicSlug, ...relatedLessons].slice(0, 5);
  const tags = Array.from(new Set([...(t.tags || []), "rn-exam-prep", t.category])).map((x) =>
    String(x).toLowerCase().replace(/\s+/g, "-"),
  );

  const qs = [];
  let qi = 0;
  for (const kind of plan) {
    const id = `${t.topicSlug}::q${qi}`;
    if (kind === "mcq") {
      qs.push(buildMcq(t, domain, subdomain, tags, baseRelated, qi, id));
    } else {
      qs.push(buildSata(t, domain, subdomain, tags, baseRelated, qi, id));
    }
    qi++;
  }
  return qs;
}

function buildMcq(t, domain, subdomain, tags, baseRelated, qi, id) {
  const stem = `(${t.country} context, topic ${t.topicSlug}, item ${qi + 1}/4) A nurse is caring for a patient with ${t.topicLabel}. Which action should the nurse take first?`;
  const choices = [
    `A. Perform a focused assessment aligned with ${titleCaseBodySystem(t.bodySystem)} priorities and trending vitals`,
    `B. Complete lower-priority comfort measures before reassessing perfusion and airway protection`,
    `C. Delegate total clinical judgment for unstable findings to the unlicensed assistive personnel (UAP/PSW)`,
    `D. Delay notification despite new acute confusion, hypotension, or SpO2 88% on room air`,
  ];
  const correctAnswer = "A";
  const rationale = `The stem anchors ${t.topicLabel} (${t.topicSlug}) for RN exam preparation. The first action is always to assess and stabilize immediate threats to airway, breathing, circulation, and neurologic status using focused data—not to defer assessment for comfort, to delegate clinical judgment for unstable findings, or to delay escalation when objective instability is present. This pattern matches NCLEX-style prioritization: collect or confirm critical data, intervene within scope, notify when thresholds are met, and document the sequence. ${regionNote(t)}`;
  const incorrectRationales = {
    B: "Comfort measures matter, but they do not precede assessment when the stem implies potential instability or competing priorities where ABCs and perfusion take precedence.",
    C: "UAP/PSW can assist with appropriate tasks, but unstable assessment findings require RN evaluation, supervision, and often physician/advanced practice provider notification—delegation never replaces nursing judgment for unstable patients.",
    D: "Acute changes such as confusion, hypotension, or significant hypoxemia require timely assessment, intervention, and notification per unit protocols; delaying care increases patient risk.",
  };
  return finalizeQuestion({
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer,
    correctAnswers: null,
    rationale,
    incorrectRationales,
    difficulty: t.difficulty,
    topicSlug: t.topicSlug,
    tags,
    bodySystem: t.bodySystem,
    domain,
    subdomain,
    program: PROGRAM,
    country: t.country,
    exam: "nclex-rn",
    cognitiveLevel: cognitiveFor(qi, "mcq"),
    relatedLessonSlugs: baseRelated,
  });
}

function buildSata(t, domain, subdomain, tags, baseRelated, qi, id) {
  const stem = `(${t.country} context, topic ${t.topicSlug}, item ${qi + 1}/4) Select all that apply: Which nursing actions are appropriate for safe care of a patient with ${t.topicLabel}?`;
  const choices = [
    "A. Monitor trends in vitals and level of consciousness alongside ordered labs",
    "B. Verify medications using rights of administration and high-alert precautions when applicable",
    "C. Withhold all fluids and nutrition indefinitely without a provider order",
    "D. Use SBAR to communicate acute changes and anticipated needs to the provider team",
    "E. Apply infection prevention practices including hand hygiene and appropriate PPE",
  ];
  const correctAnswers = ["A", "B", "D", "E"];
  const rationale = `For ${t.topicLabel}, safe nursing care integrates ongoing assessment, medication safety, structured communication, and infection prevention. Monitoring trends (A) detects deterioration early. Rights verification and high-alert vigilance (B) reduce preventable harm. SBAR (D) supports timely escalation. Standard precautions and transmission-based precautions as indicated (E) reduce cross-transmission. Withholding all fluids and nutrition indefinitely (C) is not a generic nursing action without orders and clinical indication, so it is incorrect on licensing exams unless the stem explicitly supports NPO with alternative plans. ${regionNote(t)}`;
  const incorrectRationales = {
    C: "Indefinite withholding of fluids and nutrition without orders and a documented plan is not a blanket appropriate action; nutrition and hydration decisions require provider direction and clinical context.",
  };
  return finalizeQuestion({
    stem,
    questionType: "sata",
    choices,
    correctAnswer: null,
    correctAnswers,
    rationale,
    incorrectRationales,
    difficulty: t.difficulty,
    topicSlug: t.topicSlug,
    tags,
    bodySystem: t.bodySystem,
    domain,
    subdomain,
    program: PROGRAM,
    country: t.country,
    exam: "nclex-rn",
    cognitiveLevel: cognitiveFor(qi, "sata"),
    relatedLessonSlugs: baseRelated,
  });
}

function finalizeQuestion(q) {
  return {
    ...q,
    _stemId: undefined,
  };
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const topics = manifest.topics;
  if (topics.length !== 50) throw new Error(`Expected 50 topics, got ${topics.length}`);

  const lessons = topics.map((t) => buildLesson(topics, t));
  const questions = topics.flatMap((t) => buildQuestions(topics, t));

  if (questions.length !== 200) throw new Error(`Expected 200 questions, got ${questions.length}`);

  const hashes = new Set();
  const dupes = [];
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (hashes.has(h)) dupes.push(h);
    hashes.add(h);
  }
  if (dupes.length) throw new Error(`Duplicate stem hashes: ${dupes.join(",")}`);

  const topicSlugs = new Set(topics.map((t) => t.topicSlug));
  const lessonSlugs = new Set(lessons.map((l) => l.slug));
  if (lessonSlugs.size !== 50) throw new Error("Duplicate lesson slugs");

  const out = {
    _meta: {
      description: "50 RN lessons + 200 RN exam questions generated from rn-topic-manifest.json (static, no API)",
      program: PROGRAM,
      blueprintFile: "output/rn-topic-manifest.json",
      generatedAt: new Date().toISOString(),
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      questionMix: {
        singleBestAnswer: questions.filter((q) => q.questionType === "single-best-answer").length,
        sata: questions.filter((q) => q.questionType === "sata").length,
      },
      stemHashAlgorithm: "sha256-hex-first32-lowercase-stem",
      duplicateStemHashesFound: dupes.length,
    },
    lessons,
    questions,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${OUT} (${lessons.length} lessons, ${questions.length} questions)`);
}

main();
