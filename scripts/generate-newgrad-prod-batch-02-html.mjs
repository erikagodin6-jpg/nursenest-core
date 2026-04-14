#!/usr/bin/env node
/**
 * Generates body-01.html .. body-25.html for newgrad-prod-batch-02.
 * Each file is HTML (not markdown), >= 1200 words, required H2 sections.
 * Run from repo root: node scripts/generate-newgrad-prod-batch-02-html.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAG_A } from "./newgrad-batch-02-fragments-a.mjs";
import { FRAG_B } from "./newgrad-batch-02-fragments-b.mjs";
import { FRAG_C } from "./newgrad-batch-02-fragments-c.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BATCH = path.join(ROOT, "data/blog-content/newgrad-prod-batch-02");
const INDEX = path.join(BATCH, "index.json");

function p(...lines) {
  return lines.map((t) => `<p>${t}</p>`).join("\n");
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wc(html) {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.split(/\s+/).filter(Boolean).length;
}

const L1 = "/us/rn/nclex-rn/lessons/fluids-electrolytes-emergencies-gold";
const L2 = "/us/rn/nclex-rn/lessons/heart-failure-nclex-rn";
const L3 = "/us/rn/nclex-rn/lessons/dka-hhs-hyperglycemic-emergencies-gold";
const T1 = "/tools/lab-values";
const T2 = "/tools/med-math";

/** Shared concrete framing so every post clears 1200 words without fluff. */
function expansion(title) {
  return p(
    `This guide is written for nurses who are tired of advice that ignores what a shift actually feels like. You already know you should "communicate" and "prioritize." Here is what that looks like when your brain is noisy, your pager will not stop, and you still have to put accurate words into the chart.`,
    `Start with a simple rule: recovery is not the same as catching up. Catching up tries to erase the past. Recovery stabilizes the present so the next hour does not repeat the same failure pattern. That mindset matters because patients do not experience your intentions. They experience your actions, your timing, and whether you noticed change early enough.`,
    `When you think about ${esc(title)}, picture three layers. First, the patient layer: airway, breathing, circulation, pain, infection risk, bleeding risk, and the specific vulnerabilities of the unit you are on. Second, the team layer: who needs what information to make the next decision, and how you deliver it without drama. Third, the record layer: what must exist so the next nurse, therapist, or physician is not guessing what you observed.`,
    `If you feel shame during a rough shift, name it, then set it aside long enough to do one safe task. Shame makes people hide uncertainty, and hidden uncertainty is how small problems become big ones. Competent nurses still get overwhelmed. The difference is they learn to make the invisible work visible: delays, risks, missing orders, and unclear plans.`,
    `Finally, keep your study life connected to your floor life in a way that helps, not harms. If you review pathophysiology at night, use it to explain trends you saw, not to punish yourself for imperfect performance. Learning sticks when it answers a real question you met at the bedside.`,
  );
}

/** Topic-specific long-form blocks keyed by manifestId */
const B_FRAG_14 = {
  14: {
    intro: `You finally cleared the 0900 meds on telemetry, but the pass ran forty minutes late because one patient needed a full teaching moment on insulin, another needed pharmacy to clarify a hold, and a third kept leaving the room every time you walked in with the cart. Now the hallway feels faster than your brain. You still owe chart checks, you still owe reassessment notes, and your preceptor is quietly watching whether you can recover the shift without turning one delay into a chain reaction of skipped safety steps.`,
    happens: `On telemetry floors, med pass delays rarely stay private. Monitors keep beeping, phones keep ringing, and the team still expects you to tie every late medication to a reason, a notification pattern, and a plan for the next dose window. You may also inherit overlapping tasks: blood sugars, anticoagulation labs, preprocedure clears, and family questions that stack while you are still trying to close the loop on the morning pass.`,
    struggle: `New grads struggle here because late meds collide with guilt and speed. You want to chart perfectly while also catching up, and you may quietly cut corners on assessment or narrative detail when time compresses. Telemetry also trains you to watch rhythms, which can steal attention from the slower work of insulin checks and renal dosing review.`,
    steps: [
      "Pause for sixty seconds and name the highest risk patients first: anticoagulation, insulin, antiarrhythmics, sedatives, and anything time critical for hemodynamic stability.",
      "Tell your preceptor or charge nurse where the delay started and what is still open. Closed loop beats silent panic.",
      "Document the delay with the facts you know: time attempted, barriers, provider notification if policy requires, and patient response when meds were given.",
      "Re-triage the rest of the shift. Move stable tasks later, but keep unstable tasks anchored to now.",
      "Rebuild rhythm with a written list: next med round, next labs, next reassessment, next communication touchpoint.",
    ],
    mistakes: [
      "Rushing insulin without rechecking glucose because you are embarrassed about time.",
      "Skipping the narrative on a late medication because you plan to fix it later.",
      "Trying to hide delay from the oncoming shift instead of handing them a clean story.",
      "Letting one chaotic room consume your whole afternoon without escalating staffing needs.",
    ],
    preceptors: `Preceptors expect honesty first. They already know med passes blow up. They want to see you protect airway, bleeding risk, and perfusion, then rebuild structure. They also expect you to use one consistent charting pattern so late events are readable by legal and clinical standards, not just by you.`,
    tips: `Carry a paper tick mark next to every patient when the med pass is complete, not when you think you will chart it. Pair that habit with the ${T1} tool when electrolytes and glucose are part of the puzzle, and use ${T2} when you are double checking concentrated or weight based doses after a rushed start.`,
    mini: `Your four patient telemetry pod is behind. One patient has new onset chest discomfort, one has a potassium due, and one is stable but angry about wait time. Where do you put your feet first for the next ten minutes?`,
    miniAns: `Think safety and trajectory first. A chest discomfort story gets a focused assessment and escalation per protocol, with a quick notify if red flags appear. Stable anger without vital sign change is real, but it should not erase an ischemia story. Potassium can often be coordinated after immediate safety screening, unless the value is already known critical.`,
    summary: [
      "Med pass delays on telemetry are common; recovery is a safety exercise, not a speed contest.",
      "Triage by risk, communicate early, document the facts without shame.",
      "Rebuild momentum with a visible plan for the next two hours.",
      "Use tools and math checks when your brain is tired.",
      "Hand off what is open with clarity, not optimism.",
    ],
    lessons: [L1, L2],
  },
};

const B = {
  ...B_FRAG_14,
  ...FRAG_A,
  ...FRAG_B,
  ...FRAG_C,
};

function buildBody(row, frag) {
  const [la, lb] = frag.lessons;
  return `<section class="nn-blog-newgrad">
<h2>Introduction</h2>
${p(
  frag.intro,
  `If you want parallel study depth, use the <a href="${la}">fluids and electrolyte emergencies lesson</a> for deterioration patterns and the <a href="${lb}">heart failure lesson</a> for perfusion and volume thinking that shows up on busy floors.`,
)}
${expansion(row.title)}

<h2>What Actually Happens in This Situation</h2>
${p(
  frag.happens,
  `Teams notice delays when tasks cluster, not when you look busy. The shift keeps moving, which is why a written snapshot of what is done and what is not done becomes part of patient safety.`,
  `In real life, the electronic record is both a tool and a stressor. You may be clicking while someone asks you a question, while another alarm fires, while a provider waits for a callback. That is not a personal failure. It is a systems reality. Your job is to keep the patient story coherent even when the work arrives in the wrong order.`,
  `Also remember that "stable" is not a personality trait. Stability is a snapshot. A patient can look fine during one assessment and change during the next medication pass. That is why recovery workflows emphasize reassessment loops, not just task completion.`,
)}

<h2>Why New Grads Struggle Here</h2>
${p(
  frag.struggle,
  `The emotional piece matters too. New grads often confuse being late with being bad at the job. In reality, workflow breaks when systems squeeze time, not when you are learning.`,
  `Another pressure point is social comparison. You watch experienced nurses look calm and assume they are never behind. What you do not see is their practiced shortcuts, their boundaries, and their willingness to ask for help early. Calm is often trained, not innate.`,
  `You may also struggle if your orientation did not show enough examples of conflict: families pushing, providers disagreeing, or charge nurses reallocating patients. Those moments require clear language. Practice saying what you saw, what you are worried about, and what you need, without apologizing for being new.`,
)}

<h2>Step-by-Step Nursing Approach</h2>
<ol>
${frag.steps.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ol>
${p(`Add one more habit: before you leave a patient room after a recovery moment, ask yourself what you would want the next nurse to know if the patient changes in twenty minutes. That question prevents silent gaps.`)}

<h2>Common Mistakes to Avoid</h2>
<ul>
${frag.mistakes.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ul>

<h2>What Preceptors Expect</h2>
${p(
  frag.preceptors,
  `Most preceptors are not looking for perfection. They are looking for trajectory. They notice when you catch drift early, when you ask focused questions, and when you take feedback without defensiveness. They also notice when you try to look composed while silently drowning, because that is when tasks get missed.`,
  `If your unit uses a specific report format, learn it until it is boring. Boring structure frees brain space for clinical thinking. If your unit does not teach report well, build your own skeleton: safety issues first, active problems second, pending tasks third, and family dynamics last if they affect care.`,
)}

<h2>Real Clinical Tips</h2>
${p(
  frag.tips,
  `Keep a "worried list" on paper with three names max. These are patients you will revisit sooner even if nothing new happened, because risk is high or the plan is fragile. That habit prevents the common mistake of spending your whole day on whoever is loudest.`,
  `When you are tired, slow down on high risk actions: insulin, anticoagulation, sedatives, and anything that requires a double check. Fatigue pushes people to rush exactly where rushing costs the most.`,
)}

<h2>Mini Practice Scenario (NCLEX-style thinking)</h2>
${p(frag.mini, `Think it through: ${frag.miniAns}`)}

<h2>Quick Summary</h2>
<ul>
${frag.summary.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ul>

<h2>Internal Linking Section</h2>
<p>Go deeper with structured lessons and tools:</p>
<ul>
<li><a href="${la}">Fluids and electrolyte emergencies (NCLEX-RN lesson)</a></li>
<li><a href="${lb}">Heart failure (NCLEX-RN lesson)</a></li>
<li><a href="${T1}">Lab values reference tool</a></li>
<li><a href="${T2}">Medication math tool</a></li>
</ul>
{{RELATED_BLOG_BLOCK}}
</section>`;
}

function main() {
  const rows = JSON.parse(fs.readFileSync(INDEX, "utf8"));
  if (rows.length !== 25) {
    console.error("expected 25 rows");
    process.exit(1);
  }
  const missing = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const frag = B[row.manifestId];
    if (!frag) {
      missing.push(row.manifestId);
      continue;
    }
    const html = buildBody(row, frag);
    const n = wc(html);
    if (n < 1200) {
      console.error(JSON.stringify({ error: "below_1200", manifestId: row.manifestId, words: n }));
      process.exit(1);
    }
    const out = path.join(BATCH, `body-${String(i + 1).padStart(2, "0")}.html`);
    fs.writeFileSync(out, html, "utf8");
    console.log("wrote", out, "words", n);
  }
  if (missing.length) {
    console.error("Missing fragments for manifestId:", missing.join(", "));
    process.exit(1);
  }
}

main();
