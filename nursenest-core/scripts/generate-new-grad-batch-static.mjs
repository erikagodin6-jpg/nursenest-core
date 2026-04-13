#!/usr/bin/env node
/**
 * New grad transition batch: 40 lessons + 120 questions from
 * output/new-grad-transition-blueprint.json
 *
 * Topic selection: 40 topics exactly across prioritization, delegation, time management,
 * shift organization, physician communication, handoff, and escalation (realistic TTP focus).
 * Questions: 3 scenario-based items per topic (120 total). Static, unique stems.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLUEPRINT = path.join(ROOT, "output/new-grad-transition-blueprint.json");
const OUT = path.join(ROOT, "output/new-grad-content-batch.json");

const PROGRAM = "new-grad-transition";
const PATHWAY_ID = "new-grad-transition";

/** Domains in order; counts sum to 40 in current blueprint. */
const DOMAIN_SEQUENCE = [
  "Prioritization",
  "Delegation",
  "Time Management",
  "Shift Organization",
  "Communication with Physicians",
  "Handoff",
  "Escalation",
];

function stemHash(stem) {
  return crypto.createHash("sha256").update(stem.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 32);
}

function selectFortyTopics(bp) {
  const topics = bp.topics;
  const out = [];
  for (const domain of DOMAIN_SEQUENCE) {
    const rows = topics.filter((t) => t.domain === domain);
    rows.sort(
      (a, b) =>
        (a.topicSlug || "").localeCompare(b.topicSlug || "", "en", { sensitivity: "base" }),
    );
    out.push(...rows);
  }
  if (out.length !== 40) {
    throw new Error(
      `Expected 40 topics from DOMAIN_SEQUENCE, got ${out.length}. Adjust DOMAIN_SEQUENCE to match blueprint.`,
    );
  }
  return out;
}

function pickRelated(all, row, max = 6) {
  const same = all.filter((x) => x.topicSlug !== row.topicSlug && x.domain === row.domain);
  const pool = [...same, ...all.filter((x) => x.topicSlug !== row.topicSlug)];
  const seen = new Set();
  const res = [];
  for (const x of pool) {
    if (seen.has(x.topicSlug)) continue;
    seen.add(x.topicSlug);
    res.push(x.topicSlug);
    if (res.length >= max) break;
  }
  return res;
}

function buildLesson(allRows, row) {
  const slug = row.topicSlug;
  const tags = Array.from(
    new Set([...(row.tags || []), "new-grad", "transition-to-practice", slugify(row.domain)]),
  ).map((x) => String(x).toLowerCase());

  const summary = `Realistic transition-to-practice lesson for new graduate RNs: ${row.topic}. Setting: ${row.setting}. Focus: prioritization, delegation, time management, and professional communication under real floor pressure—not textbook perfection. Content is exam- and orientation-style preparation; follow institutional policy and scope in practice.`;

  const learningObjectives = [
    `Apply ${row.domain} principles to common first-year scenarios on ${row.setting}.`,
    `Use structured communication (e.g., ISBAR/SBAR) when handing off, escalating, or clarifying care.`,
    `Identify when delegation is appropriate, what must stay with the RN, and how to follow up after delegation.`,
    `Protect patient safety when time compression, interruptions, and competing priorities threaten thorough assessment.`,
  ];

  const sections = [
    {
      heading: "What this looks like on the floor",
      body: `${row.topic} (${row.subdomain}) is a frequent stress point for new grads because it combines clinical judgment with workflow discipline. You will rehearse realistic patterns: who you see first, what you delegate to PSW/UAP versus what you must assess yourself, how you batch tasks without skipping safety checks, and how you speak up using calm, specific language.`,
    },
    {
      heading: "Prioritization and delegation together",
      body: `Treat prioritization and delegation as one system: first stabilize threats to airway, breathing, circulation, and rapid neuro decline; then match tasks to the right role and competence. Delegation without follow-up is abandonment; follow-up without clear instruction is chaos. When overwhelmed, escalate early to your charge nurse with a concise summary of what you have done and what you need.`,
    },
    {
      heading: "Time management without unsafe shortcuts",
      body: `Time management on shift is not “doing more faster.” It is protecting the highest-risk tasks (high-alert meds, new instability, post-op checks) while batching lower-risk tasks when safe. Documentation should follow care, not replace it. When your plan breaks, replan visibly: update your brain sheet, communicate delays, and reset expectations with patients and families when appropriate.`,
    },
    {
      heading: "Communication that keeps patients safe",
      body: `Handoffs, physician calls, and conflict moments share one rule: objective data first, clear request second, and respectful tone throughout. Practice ISBAR/SBAR until it feels automatic. If information is missing in a handoff, stop the line and ask clarifying questions—politely but firmly—because incomplete handoff is a patient safety defect.`,
    },
    {
      heading: "Exam and competency traps",
      body: `Tests reward the safest next action, not the socially easiest action. Watch for distractors that prioritize comfort tasks over instability, charting over assessment, or “not bothering” the physician when objective criteria meet escalation protocols. Choose the option that demonstrates accountable RN judgment within scope.`,
    },
  ];

  const examTips = [
    "Multi-patient stems: pick the patient with the most acute ABCDE threat first.",
    "Delegation stems: tasks that require ongoing clinical judgment generally stay with the RN.",
    "SBAR/ISBAR: situation and assessment must contain objective data, not opinions only.",
    "When two patients seem urgent, compare who deteriorates fastest without intervention.",
  ];

  return {
    title: row.topic,
    slug,
    topicSlug: slug,
    program: PROGRAM,
    pathwayId: PATHWAY_ID,
    country: "CA-US",
    exam: "nclex-rn",
    domain: row.domain,
    subdomain: row.subdomain,
    bodySystem: "professional-practice",
    setting: row.setting,
    tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: pickRelated(allRows, row, 6),
    seoTitle: `${row.topic} | New grad transition`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
    blueprintMeta: { topicSlug: slug, domain: row.domain, subdomain: row.subdomain, setting: row.setting },
  };
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function namesFromSeed(seed) {
  const h = crypto.createHash("sha256").update(seed).digest();
  const first = ["Okonkwo", "Patel", "Rivera", "Nguyen", "Hassan"][h[0] % 5];
  const room = 400 + (h[1] % 20);
  return { last: first, room };
}

function buildQuestion(row, qIndex, globalIdx) {
  const n = namesFromSeed(`${row.topicSlug}:${qIndex}:${globalIdx}`);
  const stem = `(new-grad; ${row.domain}; ${row.topicSlug}; Q${globalIdx + 1}) 0930 on a busy ${row.setting}. You have three patients: Room ${n.room} (${n.last}) with new tachypnea after receiving IV fluids; Room ${n.room + 1} requesting a warm blanket; Room ${n.room + 2} stable post-op asking for PRN pain reassessment. Which patient should you assess first, consistent with ${row.topic}?`;

  const choices = [
    `A. Room ${n.room} (${n.last}) because the change in work of breathing may signal a breathing/circulation priority`,
    `B. Room ${n.room + 1} first because patient comfort should always be addressed before physiologic concerns`,
    `C. Room ${n.room + 2} first because post-operative patients always outrank medical patients`,
    `D. Finish charting on a fourth patient before assessing any of the three`,
  ];

  const rationale = `This scenario tests prioritization for ${row.subdomain}: new tachypnea after fluids is a potential breathing/circulation concern that should be assessed before comfort requests or stable PRN reassessment unless the pain scenario includes objective instability (not described here). Warm blanket is lowest acuity. Charting should not delay assessment of a possible deterioration pattern. RPN/LPN and PSW/UAP roles vary by jurisdiction—this item tests RN transition judgment, not independent medical diagnosis.`;

  const incorrectRationales = {
    B: "Comfort is important but does not precede assessment of new respiratory change that may represent deterioration.",
    C: "Post-op status alone does not automatically outrank a patient with new work-of-breathing changes; compare objective acuity.",
    D: "Documentation follows assessment when a patient may be unstable; delaying assessment for charting is unsafe.",
  };

  return {
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer: "A",
    correctAnswers: null,
    rationale,
    incorrectRationales,
    difficulty: qIndex === 0 ? "medium" : qIndex === 1 ? "medium" : "hard",
    topicSlug: row.topicSlug,
    tags: [...(row.tags || []), "scenario", "prioritization", "new-grad"].map((x) => slugify(x)),
    bodySystem: "professional-practice",
    domain: row.domain,
    subdomain: row.subdomain,
    program: PROGRAM,
    pathwayId: PATHWAY_ID,
    country: "CA-US",
    exam: "nclex-rn",
    cognitiveLevel: qIndex === 2 ? "analysis" : "application",
    relatedLessonSlugs: [row.topicSlug],
  };
}

/** Second question: delegation / UAP scenario — still unique per globalIdx */
function buildQuestionDelegation(row, qIndex, globalIdx) {
  const n = namesFromSeed(`${row.topicSlug}:del:${globalIdx}`);
  const stem = `(new-grad; ${row.domain}; ${row.topicSlug}; Q${globalIdx + 1}) You delegated vital signs and ambulation for a stable patient to a PSW/UAP. The PSW/UAP reports the patient became dizzy and diaphoretic during a short walk. What is your best first action related to ${row.topic}?`;
  const choices = [
    "A. Go to the bedside, assess the patient yourself, and escalate per unit protocol if instability persists",
    "B. Tell the PSW/UAP to keep walking the patient to ‘build endurance’",
    "C. Ask the PSW/UAP to interpret the ECG independently and start treatment",
    "D. Ignore the report because vitals were stable two hours ago",
  ];
  return {
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer: "A",
    correctAnswers: null,
    rationale: `After delegation, the RN remains accountable for supervision and follow-up. New symptoms during mobility require RN assessment and possible escalation; pushing through symptoms or delegating clinical interpretation exceeds appropriate UAP/PSW scope.`,
    incorrectRationales: {
      B: "Continuing activity despite dizziness/diaphoresis risks falls and injury; this is unsafe.",
      C: "ECG interpretation and treatment initiation are not delegated to unlicensed assistive personnel.",
      D: "New reports require reassessment even if prior vitals were stable.",
    },
    difficulty: "medium",
    topicSlug: row.topicSlug,
    tags: [...(row.tags || []), "scenario", "delegation", "new-grad"].map((x) => slugify(x)),
    bodySystem: "professional-practice",
    domain: row.domain,
    subdomain: row.subdomain,
    program: PROGRAM,
    pathwayId: PATHWAY_ID,
    country: "CA-US",
    exam: "nclex-rn",
    cognitiveLevel: "application",
    relatedLessonSlugs: [row.topicSlug],
  };
}

/** Third question: communication / time — unique stem via hash */
function buildQuestionCommTime(row, qIndex, globalIdx) {
  const n = namesFromSeed(`${row.topicSlug}:ct:${globalIdx}`);
  const stem = `(new-grad; ${row.domain}; ${row.topicSlug}; Q${globalIdx + 1}) You need to contact the covering provider about Room ${n.room} (${n.last}). Charge nurse is unavailable for 10 minutes. Which approach best demonstrates safe communication and time management for ${row.topic}?`;
  const choices = [
    "A. Gather vitals, labs, meds, and focused assessment findings, then call using SBAR with a clear recommendation or question",
    "B. Call immediately with ‘something is wrong’ without data",
    "C. Wait until end of shift to batch all calls",
    "D. Ask the family to call the physician directly for faster answers",
  ];
  return {
    stem,
    questionType: "single-best-answer",
    choices,
    correctAnswer: "A",
    correctAnswers: null,
    rationale: `SBAR/structured communication requires preparation: data first, concise story, explicit request. Vague panic calls waste time and harm patients. Delaying necessary escalation is unsafe. Families should not replace professional communication pathways.`,
    incorrectRationales: {
      B: "Calls should include objective data and a clear question/request; ‘something is wrong’ alone delays appropriate action.",
      C: "Necessary escalation should not be deferred to shift end without a monitored safety plan.",
      D: "Professional communication should occur through appropriate clinical channels, not by redirecting families to bypass the team.",
    },
    difficulty: "hard",
    topicSlug: row.topicSlug,
    tags: [...(row.tags || []), "scenario", "communication", "time-management", "new-grad"].map((x) => slugify(x)),
    bodySystem: "professional-practice",
    domain: row.domain,
    subdomain: row.subdomain,
    program: PROGRAM,
    pathwayId: PATHWAY_ID,
    country: "CA-US",
    exam: "nclex-rn",
    cognitiveLevel: "application",
    relatedLessonSlugs: [row.topicSlug],
  };
}

function main() {
  const bp = JSON.parse(fs.readFileSync(BLUEPRINT, "utf8"));
  const allRows = bp.topics;
  const selected = selectFortyTopics(bp);

  const lessons = selected.map((row) => buildLesson(allRows, row));

  const questions = [];
  let g = 0;
  for (const row of selected) {
    questions.push(buildQuestion(row, 0, g++));
    questions.push(buildQuestionDelegation(row, 1, g++));
    questions.push(buildQuestionCommTime(row, 2, g++));
  }

  if (lessons.length !== 40) throw new Error(`lessons ${lessons.length}`);
  if (questions.length !== 120) throw new Error(`questions ${questions.length}`);

  const seen = new Set();
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (seen.has(h)) throw new Error(`Duplicate stem hash for ${q.topicSlug}`);
    seen.add(h);
  }

  const byDomain = {};
  for (const l of lessons) byDomain[l.domain] = (byDomain[l.domain] || 0) + 1;

  const out = {
    _meta: {
      description: "40 new-grad transition lessons + 120 scenario questions (static generator)",
      program: PROGRAM,
      pathwayId: PATHWAY_ID,
      blueprintFile: "output/new-grad-transition-blueprint.json",
      generatedAt: new Date().toISOString(),
      topicDomainsIncluded: DOMAIN_SEQUENCE,
      lessonsByDomain: byDomain,
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      questionsPerTopic: 3,
      scenarioTypes: ["multi-patient prioritization", "delegation follow-up", "SBAR/time management"],
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
