#!/usr/bin/env node
/**
 * Generates RN NCLEX-RN (CA + US) Exam Strategy expansion catalog JSON.
 * Run from nursenest-core: node scripts/generate-rn-nclex-exam-strategy-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-exam-strategy-expansion-catalog.json");

const LESSONS = [
  ["How the NCLEX-RN Works", "exam-strat-how-nclex-rn-works-rn"],
  ["NCLEX-RN Test Plan Overview", "exam-strat-nclex-rn-test-plan-overview-rn"],
  ["Computer Adaptive Testing Basics", "exam-strat-cat-basics-rn"],
  ["Next Generation NCLEX Overview", "exam-strat-ngn-overview-rn"],
  ["Clinical Judgment Measurement Model", "exam-strat-cjmm-overview-rn"],
  ["How to Read NCLEX Questions", "exam-strat-how-to-read-nclex-questions-rn"],
  ["Identifying the Client Need", "exam-strat-identifying-client-need-rn"],
  ["Finding the Stem and Key Words", "exam-strat-stem-keywords-rn"],
  ["Avoiding Distractors", "exam-strat-avoiding-distractors-rn"],
  ["Elimination Strategies", "exam-strat-elimination-strategies-rn"],
  ["ABCs in NCLEX Questions", "exam-strat-abcs-nclex-rn"],
  ["Maslow and Safety Prioritization", "exam-strat-maslow-safety-prioritization-rn"],
  ["Acute vs Chronic Prioritization", "exam-strat-acute-vs-chronic-rn"],
  ["Stable vs Unstable", "exam-strat-stable-vs-unstable-rn"],
  ["Expected vs Unexpected Findings", "exam-strat-expected-vs-unexpected-rn"],
  ["First Action vs Best Action", "exam-strat-first-action-vs-best-action-rn"],
  ["When to Notify the Provider", "exam-strat-when-notify-provider-rn"],
  ["When to Activate Rapid Response", "exam-strat-when-rapid-response-rn"],
  ["Delegation Strategy for NCLEX", "exam-strat-delegation-strategy-rn"],
  ["Assignment Strategy for NCLEX", "exam-strat-assignment-strategy-rn"],
  ["Bow-Tie Item Strategy", "exam-strat-bow-tie-item-strategy-rn"],
  ["Matrix and Grid Item Strategy", "exam-strat-matrix-grid-item-strategy-rn"],
  ["Select-All-That-Apply Strategy", "exam-strat-sata-strategy-rn"],
  ["Cloze and Drop-Down Item Strategy", "exam-strat-cloze-dropdown-strategy-rn"],
  ["Highlight Item Strategy", "exam-strat-highlight-item-strategy-rn"],
  ["Case Study Strategy", "exam-strat-case-study-strategy-rn"],
  ["Recognize Cues", "exam-strat-recognize-cues-rn"],
  ["Analyze Cues", "exam-strat-analyze-cues-rn"],
  ["Prioritize Hypotheses", "exam-strat-prioritize-hypotheses-rn"],
  ["Generate Solutions", "exam-strat-generate-solutions-rn"],
  ["Take Action", "exam-strat-take-action-rn"],
  ["Evaluate Outcomes", "exam-strat-evaluate-outcomes-rn"],
  ["Building an NCLEX Study Plan", "exam-strat-building-study-plan-rn"],
  ["How to Review Rationales", "exam-strat-reviewing-rationales-rn"],
  ["Managing Test Anxiety", "exam-strat-managing-test-anxiety-rn"],
  ["Time Management on Exam Day", "exam-strat-time-management-exam-day-rn"],
  ["What to Do After Failed Practice Exams", "exam-strat-after-failed-practice-rn"],
  ["Using Practice Questions Effectively", "exam-strat-practice-questions-effectively-rn"],
  ["Common NCLEX Traps", "exam-strat-common-nclex-traps-rn"],
  ["Final Week NCLEX Review Strategy", "exam-strat-final-week-review-rn"],
];

function buildLesson(title, slug) {
  const short = `${title} for NCLEX-RN: test-taking strategy, clinical judgment framing, NGN item skills, and Canada- and US-aligned safety priorities without replacing clinical content lessons.`;
  return {
    slug,
    title,
    topic: "Exam Strategy",
    topicSlug: "exam-strategy",
    bodySystem: "General",
    system: "exam-strategy",
    previewSectionCount: 1,
    priority: "high",
    examRelevance: "high_yield",
    exams: ["NCLEX_RN"],
    countries: ["CA", "US"],
    seoTitle: `${title} | Exam Strategy | NCLEX-RN | NurseNest`,
    seoDescription: short,
    relatedLessonRefs: [
      { slug: "sepsis-early-recognition-hy", titleHint: "Sepsis early recognition" },
      { slug: "ppe-transmission-basics", titleHint: "PPE and transmission basics" },
    ],
    sections: [
      {
        id: `${slug}-clinical_meaning`,
        heading: "What this means for your exam",
        kind: "clinical_meaning",
        body: `**${title}** sits in the **Exam Strategy** lane for NCLEX-RN preparation: you are learning **how the exam thinks**, not replacing pathophysiology lessons. Boards reward **consistent rules**—identify the **question type**, name the **primary threat** (airway, breathing, circulation, safety), then choose the option that **closes the highest-risk gap** first.\n\nConnect strategy to clinical anchors when the stem is clinical: review [sepsis early recognition](LESSON:sepsis-early-recognition-hy) for escalation patterns and [PPE & transmission basics](LESSON:ppe-transmission-basics) when infection control distractors appear. Use your pathway hubs for mixed practice: [Canada RN lessons](/canada/rn/nclex-rn/lessons) · [US RN lessons](/us/rn/nclex-rn/lessons).\n\n**Learning objectives:** restate what the item is asking (first, best, priority, NGN layer); list **two** objective data points you would seek before acting; identify **one** common trap specific to this topic.\n\n**Strategy priorities:** protect **life and safety** before psychosocial comfort unless the stem isolates a stable teaching need; match **scope** and **delegation** rules; avoid answers that **delay assessment** when the client is unstable.`,
      },
      {
        id: `${slug}-exam_relevance`,
        heading: "Why NCLEX tests this skill",
        kind: "exam_relevance",
        body: `NCLEX-RN and **NGN** items often embed **competing tasks** with polite wording. Examiners expect you to recognize **partial vs complete assessment**, **stable vs unstable**, and **when teaching is inappropriate**. For **SATA**, partial credit logic punishes “almost right” patterns—only select options fully supported by the stem.\n\nEliminate options that **expand nursing scope**, **skip orders**, **ignore trends**, or **choose comfort** when **safety** is still unresolved. When two answers sound clinical, pick the one that **matches the stem’s timeframe** (now vs later).`,
      },
      {
        id: `${slug}-core_concept`,
        heading: "Frameworks, traps, and reasoning",
        kind: "core_concept",
        body: `- **Frameworks:** ABCs for immediate threats; Maslow (**physiological + safety** before esteem) when priorities tie; acute vs chronic when the stem contrasts timelines; expected vs unexpected post-op or treatment course.\n- **Red flags / traps:** “**Would be nice**” tasks vs **must-do** actions; **equal** sounding interventions where only one matches **scope**; **rapid** improvement promises; **charting first** when vitals are worsening.\n- **NGN layers:** when the item references **Recognize cues → Analyze cues → Prioritize hypotheses → Generate solutions → Take action → Evaluate outcomes**, answer the **layer asked**, not the “most clinical” paragraph you remember.\n- **Clinical reasoning:** tie every click to **what changes first** for **this** client; quote stem words back when debating two choices.\n- **Canada-friendly note:** units and titles may vary; judgment rules (**safety, escalation, scope**) stay the same.`,
      },
      {
        id: `${slug}-clinical_scenario`,
        heading: "Practice vignette",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 54-year-old client appears on an NCLEX-style stem related to **${title}**. The nurse notes **new tachycardia**, **restlessness**, and **oxygen saturation drifting down** compared with prior documentation. The client asks for a warm blanket and a phone charger.\n\n**Fork:** choose the option that **addresses airway, breathing, and circulation risk first** with **assessment and escalation** per protocol—not deferring to comfort tasks while instability evolves. If the item is pure **test-taking** strategy, select the move that **clarifies the asked layer** (for example, **identify the stem constraint**: first vs best vs priority) before picking a clinical intervention.`,
      },
      {
        id: `${slug}-takeaways`,
        heading: "Takeaways",
        kind: "takeaways",
        body: `- Read the **question type** before reading answer **A**.\n- **Unstable beats tidy**—never bury assessment under busywork.\n- **Synthesis:** exam strategy is **discipline**: same patient, same data, better sequencing.\n\n**Related:** [Sepsis early recognition](LESSON:sepsis-early-recognition-hy) · [PPE & transmission basics](LESSON:ppe-transmission-basics) · [Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
    preTest: [
      {
        question: `For "${title}", which habit most improves NCLEX-RN accuracy?`,
        options: [
          "Speed-read the answers before reading the stem",
          "Name the stem goal (first, best, priority) and the primary risk before selecting an answer",
          "Pick the longest answer because it looks more complete",
          "Avoid marking questions for review",
        ],
        correct: 1,
        rationale: "Explicitly framing the stem goal and primary risk reduces impulsive mismatches between what is asked and what looks clinically familiar.",
      },
    ],
    postTest: [
      {
        question: "Two answers seem partially correct on a priority item. What is the best next step?",
        options: [
          "Guess quickly to preserve time",
          "Re-read the stem for constraints (first vs best vs NGN layer) and eliminate options that violate scope, delay assessment when unstable, or solve a lower tier need first",
          "Choose the option that mentions a medication",
          "Change answers randomly if anxious",
        ],
        correct: 1,
        rationale: "Priority errors usually come from missing stem constraints or mismatched Maslow/ABC sequencing—not from lack of clinical trivia.",
      },
    ],
  };
}

const pathways = {
  "ca-rn-nclex-rn": LESSONS.map(([title, slug]) => buildLesson(title, slug)),
  "us-rn-nclex-rn": LESSONS.map(([title, slug]) => buildLesson(title, slug)),
};

const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-nclex-exam-strategy-expansion-catalog.mjs",
  pathways,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${pathways["ca-rn-nclex-rn"].length} lessons per pathway).`);
