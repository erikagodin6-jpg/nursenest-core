#!/usr/bin/env npx tsx
/**
 * Deterministic generator for ~200 Canadian Practical Nurse licensure prep posts.
 *
 * Run:
 *   npx tsx scripts/blog/generate-cpnre-cnple-longtail-200.mts
 *   npx tsx scripts/blog/generate-cpnre-cnple-longtail-200.mts --dry-run
 *   npx tsx scripts/blog/generate-cpnre-cnple-longtail-200.mts --verify-only
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

type CpnreAnchor = {
  slugBase: string;
  titleCore: string;
  category: string;
  intent: string;
  clinicalFrame: string;
  bedsideExample: string;
  safetyFrame: string;
  examTrap: string;
  tags: readonly string[];
};

type CpnreVariant = {
  slugSuffix: string;
  titleSuffix: string;
  focus: string;
  cta: string;
};

const PUBLISHED_AT = "2026-05-27";
const UPDATED_AT = "2026-05-27";
const MIN_WORDS = 850;

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

const ANCHORS: readonly CpnreAnchor[] = [
  {
    slugBase: "pass-cpnre-first-attempt-canada",
    titleCore: "How to pass the CPNRE on your first attempt",
    category: "CPNRE / CNPLE Prep",
    intent: "CPNRE study strategy",
    clinicalFrame: "A strong plan connects Canadian practical nursing scope, clinical judgment, medication safety, and case-style question practice.",
    bedsideExample: "A learner misses a sepsis item because they memorize infection definitions but do not act on tachypnea, confusion, and low blood pressure together.",
    safetyFrame: "The safest answer usually protects the client first, communicates through the right pathway, and reassesses response.",
    examTrap: "Cramming facts without practising why an option is unsafe.",
    tags: ["CPNRE", "Canadian practical nursing", "Exam preparation", "Study plan"],
  },
  {
    slugBase: "cat-exam-adaptive-testing-cpnre",
    titleCore: "How CAT exams adapt to your performance in practical nursing prep",
    category: "CPNRE / CNPLE Prep",
    intent: "adaptive testing explanation",
    clinicalFrame: "Adaptive testing rewards consistent safe decisions across difficulty bands, not lucky guessing on isolated recall items.",
    bedsideExample: "Two respiratory questions may look similar, but the harder item adds mental-status change and a decision about escalation.",
    safetyFrame: "Treat every item as a patient-safety decision, even when the topic looks familiar.",
    examTrap: "Assuming harder questions mean failure instead of recognizing normal adaptive behaviour.",
    tags: ["CAT exam", "Adaptive testing", "CPNRE", "Clinical judgment"],
  },
  {
    slugBase: "sata-questions-practical-nursing",
    titleCore: "How to answer SATA questions in practical nursing exams",
    category: "CPNRE / CNPLE Prep",
    intent: "SATA strategy",
    clinicalFrame: "Select-all questions test whether you can evaluate each option as safe, unsafe, indicated, or out of scope.",
    bedsideExample: "A hypoglycemia SATA item may include carbohydrate treatment, repeat glucose check, insulin administration, documentation, and escalation.",
    safetyFrame: "Do not select caring-sounding actions that delay ABCs, glucose correction, bleeding control, or reporting deterioration.",
    examTrap: "Looking for a pattern in answer counts instead of testing each option against the stem.",
    tags: ["SATA", "REx-PN", "CPNRE", "Question strategy"],
  },
  {
    slugBase: "abcs-vs-maslow-nursing-prioritization",
    titleCore: "ABCs versus Maslow in nursing prioritization questions",
    category: "Clinical Judgment",
    intent: "prioritization framework",
    clinicalFrame: "Prioritization frameworks help only when you connect them to the actual patient trajectory in the stem.",
    bedsideExample: "A client with oxygen saturation dropping and new confusion outranks a client with chronic pain education needs.",
    safetyFrame: "Airway, breathing, circulation, acute change, and unstable trends should be scanned before comfort or teaching.",
    examTrap: "Choosing Maslow automatically when the stem contains urgent physiologic deterioration.",
    tags: ["ABCs", "Maslow", "Prioritization", "Clinical judgment"],
  },
  {
    slugBase: "unstable-vs-stable-patient-cpnre",
    titleCore: "Stable versus unstable patients on CPNRE-style questions",
    category: "Clinical Judgment",
    intent: "acuity recognition",
    clinicalFrame: "Practical nursing questions often hinge on whether a client is predictable, improving, worsening, or newly unstable.",
    bedsideExample: "A long-term-care resident with new confusion, tachypnea, and hypotension is not a routine dementia presentation.",
    safetyFrame: "New change from baseline deserves assessment, communication, and reassessment.",
    examTrap: "Letting a familiar diagnosis hide objective deterioration.",
    tags: ["Unstable patient", "Prioritization", "RPN scope", "Safety"],
  },
  {
    slugBase: "delegation-ucp-rpn-exam-questions",
    titleCore: "Delegation to UCPs on Canadian practical nursing exams",
    category: "Fundamentals",
    intent: "delegation logic",
    clinicalFrame: "Delegation questions test task clarity, client stability, supervision, reporting parameters, and accountability.",
    bedsideExample: "Assisting a stable client with hygiene may be appropriate; assessing new chest pain is not a UCP task.",
    safetyFrame: "Delegate tasks, not nursing judgment.",
    examTrap: "Choosing the efficient answer that removes required reassessment.",
    tags: ["Delegation", "UCP", "RPN scope", "Canadian nursing"],
  },
  {
    slugBase: "documentation-charting-cpnre",
    titleCore: "Documentation and charting tips for CPNRE-style questions",
    category: "Fundamentals",
    intent: "documentation",
    clinicalFrame: "Exam-safe documentation is objective, timed, factual, signed, and linked to follow-up.",
    bedsideExample: "Charting 'client refused dressing after infection-risk teaching; RN notified' is stronger than 'client was difficult.'",
    safetyFrame: "Documentation should show assessment, action, communication, and response.",
    examTrap: "Using judgemental wording or charting before care is completed.",
    tags: ["Documentation", "Charting", "Legal nursing", "Patient safety"],
  },
  {
    slugBase: "infection-control-ipac-cpnre",
    titleCore: "Infection control and IPAC concepts for practical nursing exams",
    category: "Fundamentals",
    intent: "IPAC review",
    clinicalFrame: "Canadian IPAC items connect routine practices, additional precautions, hand hygiene, PPE, and outbreak communication.",
    bedsideExample: "C. difficile requires contact precautions and soap-and-water hand hygiene after care.",
    safetyFrame: "Protect the individual client and the unit population.",
    examTrap: "Assuming gloves replace hand hygiene.",
    tags: ["IPAC", "Infection control", "PPE", "Canadian nursing"],
  },
  {
    slugBase: "copd-priorities-practical-nursing",
    titleCore: "COPD nursing priorities for practical nursing students",
    category: "Med-Surg Nursing",
    intent: "COPD review",
    clinicalFrame: "COPD questions test work of breathing, oxygen safety, infection triggers, activity tolerance, and escalation.",
    bedsideExample: "A client with accessory muscle use and falling SpO2 needs positioning, assessment, and timely reporting.",
    safetyFrame: "Oxygen targets do not excuse delaying response to visible distress.",
    examTrap: "Treating chronic COPD as automatically stable.",
    tags: ["COPD", "Respiratory nursing", "Oxygen safety", "Med-Surg"],
  },
  {
    slugBase: "heart-failure-daily-weights-cpnre",
    titleCore: "Heart failure daily weights and fluid teaching for CPNRE prep",
    category: "Med-Surg Nursing",
    intent: "heart failure review",
    clinicalFrame: "Heart failure items reward trend recognition: weight gain, orthopnea, edema, crackles, and medication adherence.",
    bedsideExample: "A 2 kg gain in a few days with new dyspnea should prompt assessment and communication.",
    safetyFrame: "Fluid overload can progress to respiratory distress.",
    examTrap: "Teaching sodium restriction while missing acute decompensation.",
    tags: ["Heart failure", "Daily weights", "Fluid balance", "Med-Surg"],
  },
  {
    slugBase: "sepsis-recognition-practical-nursing",
    titleCore: "Recognizing early signs of sepsis as a practical nurse",
    category: "Med-Surg Nursing",
    intent: "sepsis recognition",
    clinicalFrame: "Sepsis questions test trend-based deterioration, not fever memorization.",
    bedsideExample: "An older adult with new confusion, RR 24, low BP, and suspected infection needs urgent escalation.",
    safetyFrame: "Early recognition prevents failure-to-rescue.",
    examTrap: "Waiting for a high fever before reporting.",
    tags: ["Sepsis", "Deterioration", "Older adult", "Safety"],
  },
  {
    slugBase: "stroke-fast-last-known-well-rpn",
    titleCore: "Stroke recognition, FAST cues, and last-known-well for RPN learners",
    category: "Med-Surg Nursing",
    intent: "stroke review",
    clinicalFrame: "Stroke items test sudden focal deficits, glucose check, swallow safety, and time-sensitive escalation.",
    bedsideExample: "Slurred speech and arm drift during morning care require last-known-well time and urgent reporting.",
    safetyFrame: "Do not give oral fluids until swallow safety is addressed.",
    examTrap: "Calling sudden neurologic change fatigue.",
    tags: ["Stroke", "FAST", "Neurological assessment", "Emergency care"],
  },
  {
    slugBase: "diabetes-hypoglycemia-insulin-safety-cpnre",
    titleCore: "Diabetes, hypoglycemia, and insulin safety for CPNRE prep",
    category: "Pharmacology",
    intent: "diabetes medication safety",
    clinicalFrame: "Insulin questions combine timing, meals, glucose readings, symptoms, and reassessment intervals.",
    bedsideExample: "A shaky confused client with glucose 3.1 mmol/L needs fast carbohydrate if safe to swallow and repeat glucose check.",
    safetyFrame: "Hypoglycemia is an immediate brain-safety issue.",
    examTrap: "Administering scheduled insulin when glucose is already low.",
    tags: ["Insulin", "Hypoglycemia", "Diabetes", "Medication safety"],
  },
  {
    slugBase: "warfarin-anticoagulant-monitoring-nursing-students",
    titleCore: "Warfarin monitoring and anticoagulant teaching for nursing students",
    category: "Pharmacology",
    intent: "anticoagulant safety",
    clinicalFrame: "Anticoagulant questions test bleeding cues, INR context, fall risk, interactions, and teach-back.",
    bedsideExample: "Black stool, dizziness, bruising, and INR 4.8 require urgent follow-up rather than routine teaching.",
    safetyFrame: "Bleeding risk can become life-threatening quickly.",
    examTrap: "Responding to high INR with diet advice while missing active bleeding.",
    tags: ["Warfarin", "Anticoagulants", "INR", "Medication safety"],
  },
  {
    slugBase: "opioid-respiratory-depression-rpn",
    titleCore: "Opioid respiratory depression cues for practical nursing exams",
    category: "Pharmacology",
    intent: "opioid safety",
    clinicalFrame: "Opioid safety items test sedation, respiratory rate, oxygen saturation, pain reassessment, and when to hold/clarify medication.",
    bedsideExample: "A postoperative client who is hard to arouse with RR 8/min should not receive another opioid dose.",
    safetyFrame: "Airway and breathing outrank scheduled medication administration.",
    examTrap: "Giving medication because it is due despite unsafe assessment findings.",
    tags: ["Opioids", "Respiratory depression", "Post-op", "Medication safety"],
  },
  {
    slugBase: "psych-meds-side-effects-rpn-exam",
    titleCore: "High-yield psychiatric medication side effects for RPN exam prep",
    category: "Pharmacology",
    intent: "psych med safety",
    clinicalFrame: "Psych med items often test safety monitoring, sedation, orthostatic hypotension, metabolic effects, serotonin toxicity, and EPS cues.",
    bedsideExample: "A client starting an antipsychotic who develops rigidity and fever needs urgent escalation.",
    safetyFrame: "Medication side effects can be medical emergencies.",
    examTrap: "Attributing all mental-health symptoms to diagnosis rather than medication risk.",
    tags: ["Psych meds", "Mental health", "Medication safety", "Side effects"],
  },
  {
    slugBase: "therapeutic-communication-cpnre",
    titleCore: "Therapeutic communication examples for CPNRE-style questions",
    category: "Mental Health",
    intent: "communication",
    clinicalFrame: "Communication questions test safety, empathy, boundaries, trauma-informed pacing, and avoiding false reassurance.",
    bedsideExample: "A client saying 'I might hurt myself' needs direct safety assessment and escalation, not vague reassurance.",
    safetyFrame: "Therapeutic communication includes risk recognition.",
    examTrap: "Choosing a nice-sounding response that avoids the safety concern.",
    tags: ["Therapeutic communication", "Mental health", "Safety", "RPN"],
  },
  {
    slugBase: "suicide-precautions-practical-nursing",
    titleCore: "Suicide precautions and safety assessment for practical nursing students",
    category: "Mental Health",
    intent: "suicide safety",
    clinicalFrame: "Suicide-risk questions test direct questioning, observation, environment safety, escalation, and documentation.",
    bedsideExample: "A client with a plan and access to means requires immediate safety action and team notification.",
    safetyFrame: "Patient safety outranks privacy when imminent risk is present.",
    examTrap: "Avoiding direct questions because they feel uncomfortable.",
    tags: ["Suicide precautions", "Mental health", "Safety", "Crisis"],
  },
  {
    slugBase: "postpartum-hemorrhage-rpn-priorities",
    titleCore: "Postpartum hemorrhage priorities for practical nursing learners",
    category: "Maternity + Pediatrics",
    intent: "postpartum emergency",
    clinicalFrame: "Postpartum items test fundal tone, lochia amount, vital signs, bladder status, and fast escalation.",
    bedsideExample: "A boggy fundus with saturated pad and dizziness requires fundal massage and help.",
    safetyFrame: "Uterine atony can cause rapid blood loss.",
    examTrap: "Calling heavy bleeding normal because birth was recent.",
    tags: ["Postpartum", "Hemorrhage", "Maternity", "Prioritization"],
  },
  {
    slugBase: "pediatric-respiratory-distress-rpn",
    titleCore: "Pediatric respiratory distress cues for practical nursing exams",
    category: "Maternity + Pediatrics",
    intent: "pediatric respiratory",
    clinicalFrame: "Pediatric respiratory questions test work of breathing, behaviour, oxygenation, fatigue, and parent communication.",
    bedsideExample: "A quiet child with retractions and faint wheeze can be more concerning than a loud wheeze.",
    safetyFrame: "Children can compensate and then deteriorate quickly.",
    examTrap: "Thinking less wheeze always means improvement.",
    tags: ["Pediatrics", "Respiratory distress", "Emergency care", "Safety"],
  },
  {
    slugBase: "fetal-monitoring-basics-practical-nursing",
    titleCore: "Fetal monitoring basics practical nursing students should understand",
    category: "Maternity + Pediatrics",
    intent: "fetal monitoring basics",
    clinicalFrame: "Entry-level items focus on recognizing concerning patterns and escalating, not independent obstetrical interpretation.",
    bedsideExample: "A report of decreased fetal movement with concerning maternal symptoms requires timely assessment pathway follow-up.",
    safetyFrame: "Maternal and fetal cues must be communicated promptly.",
    examTrap: "Over-interpreting advanced strips beyond expected practical nursing scope.",
    tags: ["Fetal monitoring", "Maternity", "RPN scope", "Escalation"],
  },
  {
    slugBase: "clinical-placement-success-practical-nursing",
    titleCore: "How to succeed in practical nursing clinical placements",
    category: "Nursing Student Success",
    intent: "clinical placement success",
    clinicalFrame: "Clinical success comes from preparation, respectful questions, safe limits, documentation habits, and feedback loops.",
    bedsideExample: "A student who is unsure about a medication should pause and ask rather than guessing.",
    safetyFrame: "Knowing when to stop and seek supervision is a safety skill.",
    examTrap: "Confusing confidence with competence.",
    tags: ["Clinical placement", "Nursing school", "Student success", "Safety"],
  },
  {
    slugBase: "nursing-study-schedule-cpnre",
    titleCore: "The best study schedule for CPNRE preparation",
    category: "Nursing Student Success",
    intent: "study schedule",
    clinicalFrame: "A strong schedule alternates concept review, flashcards, case questions, rationales, and weak-topic remediation.",
    bedsideExample: "A learner reviews COPD Monday, does respiratory SATA Tuesday, and returns to missed oxygen-safety rationales Thursday.",
    safetyFrame: "Spaced repetition reduces unsafe guessing under pressure.",
    examTrap: "Reading notes repeatedly without testing recall.",
    tags: ["Study schedule", "CPNRE", "Nursing school", "Flashcards"],
  },
  {
    slugBase: "exam-anxiety-cpnre-practical-nursing",
    titleCore: "Managing exam anxiety during CPNRE preparation",
    category: "Nursing Student Success",
    intent: "exam anxiety",
    clinicalFrame: "Anxiety management for exam prep is about routines, exposure to timed questions, sleep, and post-test review.",
    bedsideExample: "A learner who panics on SATA items practises short sets with rationales until uncertainty feels normal.",
    safetyFrame: "Calm thinking supports safer prioritization.",
    examTrap: "Avoiding practice tests because they feel uncomfortable.",
    tags: ["Exam anxiety", "CPNRE", "Study skills", "Confidence"],
  },
  {
    slugBase: "new-grad-rpn-first-job-survival",
    titleCore: "New grad RPN first job survival guide",
    category: "New Grad Nursing",
    intent: "first nursing job",
    clinicalFrame: "New grads need routines for report, med passes, escalation, breaks, documentation, and asking for help.",
    bedsideExample: "A new RPN notices a client's baseline has changed and uses SBAR rather than waiting until end of shift.",
    safetyFrame: "Early-career safety comes from structured habits and humility.",
    examTrap: "Believing asking questions means failure.",
    tags: ["New grad RPN", "Transition to practice", "SBAR", "Burnout prevention"],
  },
  {
    slugBase: "shift-organization-new-rpn",
    titleCore: "Shift organization tips for new practical nurses",
    category: "New Grad Nursing",
    intent: "shift organization",
    clinicalFrame: "Good shift organization protects medication timing, reassessments, meals, wound care, charting, and escalation.",
    bedsideExample: "A nurse clusters care but keeps high-risk reassessments on time.",
    safetyFrame: "Organization is a patient-safety intervention.",
    examTrap: "Prioritizing a tidy task list over a changing patient.",
    tags: ["Shift organization", "New grad", "RPN", "Time management"],
  },
  {
    slugBase: "burnout-prevention-practical-nurses",
    titleCore: "Burnout prevention for practical nursing students and new RPNs",
    category: "New Grad Nursing",
    intent: "burnout prevention",
    clinicalFrame: "Burnout prevention includes realistic workloads, debriefing, boundaries, sleep, mentorship, and early help-seeking.",
    bedsideExample: "A new nurse debriefs after a difficult fall event and identifies one habit to improve.",
    safetyFrame: "Fatigue and moral distress can affect attention, documentation, and communication.",
    examTrap: "Treating burnout as a personal weakness instead of a safety and systems concern.",
    tags: ["Burnout", "New grad nursing", "Wellbeing", "Retention"],
  },
] as const;

const VARIANTS: readonly CpnreVariant[] = [
  {
    slugSuffix: "clinical-judgment-guide",
    titleSuffix: "Clinical Judgment Guide",
    focus: "clinical judgment, cue recognition, and safest-first thinking",
    cta: "Practice this with NurseNest clinical judgment questions and review every rationale for why unsafe options are unsafe.",
  },
  {
    slugSuffix: "practice-question-breakdown",
    titleSuffix: "Practice Question Breakdown",
    focus: "how the topic appears in case-style and select-all-that-apply questions",
    cta: "Move from reading into practice tests so the reasoning becomes fast under exam pressure.",
  },
  {
    slugSuffix: "study-plan",
    titleSuffix: "Study Plan",
    focus: "how to schedule review, flashcards, and question practice around this topic",
    cta: "Save this topic into your weekly review queue and pair it with flashcards for spaced repetition.",
  },
  {
    slugSuffix: "common-mistakes",
    titleSuffix: "Common Mistakes",
    focus: "the errors that cause students to choose plausible but unsafe answers",
    cta: "Use missed questions as diagnostic feedback, then rebuild the concept with short targeted reviews.",
  },
  {
    slugSuffix: "rpn-scope",
    titleSuffix: "RPN Scope and Safety",
    focus: "Canadian practical nursing scope, collaboration, documentation, and escalation",
    cta: "Review your province and school policy language, then practise choosing scope-safe actions.",
  },
  {
    slugSuffix: "flashcard-review",
    titleSuffix: "Flashcard Review",
    focus: "high-yield facts that should become automatic through spaced repetition",
    cta: "Turn the key cues into flashcards, then test them inside case questions so they do not stay isolated facts.",
  },
  {
    slugSuffix: "new-grad-application",
    titleSuffix: "New Grad Application",
    focus: "how this topic transfers from exam prep into first-year practical nursing practice",
    cta: "Connect this article to your clinical placement notes and build one safe habit for your next shift.",
  },
  {
    slugSuffix: "case-study-thinking",
    titleSuffix: "Case Study Thinking",
    focus: "how to follow evolving vitals, notes, orders, and reassessment findings",
    cta: "Use NurseNest practice exams to rehearse evolving cases where the priority changes over time.",
  },
] as const;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeJson(value: string): string {
  return JSON.stringify(value);
}

function truncateSentence(value: string, max: number): string {
  if (value.length <= max) return value;
  const trimmed = value.slice(0, max - 1);
  const cut = Math.max(trimmed.lastIndexOf("."), trimmed.lastIndexOf(";"), trimmed.lastIndexOf(","));
  return `${trimmed.slice(0, cut > 80 ? cut : max - 4).trim()}...`;
}

function tagsJson(anchor: CpnreAnchor, variant: CpnreVariant): string {
  return JSON.stringify(
    Array.from(
      new Set([
        ...anchor.tags,
        "CPNRE",
        "CNPLE-style prep",
        "REx-PN",
        "Canadian Practical Nurse",
        "RPN Canada",
        "Nursing school",
        variant.titleSuffix,
      ]),
    ),
  );
}

function linksFor(anchor: CpnreAnchor): string {
  const links = [
    `<li><a href="/canada/pn/nclex-pn">Canadian PN/RPN exam hub</a> — start from the pathway page for lessons, flashcards, and practice questions.</li>`,
    `<li><a href="/app/flashcards">Flashcards</a> — reinforce high-yield cues and medication safety details.</li>`,
    `<li><a href="/app/practice-tests">Practice exams</a> — apply ${anchor.intent} in timed case-style questions.</li>`,
    `<li><a href="/app/lessons">Lessons</a> — review the underlying nursing concepts before returning to questions.</li>`,
  ];
  if (/copd|respiratory|oxygen/i.test(anchor.slugBase)) {
    links.push(`<li><a href="/blog/rex-pn-rpn-copd-oxygen-safety-canada-rex-pn-ngn-item-thinking">COPD oxygen safety NGN-style thinking</a></li>`);
  } else if (/heart|failure/i.test(anchor.slugBase)) {
    links.push(`<li><a href="/blog/rex-pn-rpn-heart-failure-daily-weights-canada-clinical-judgment-priorities">Heart failure daily weights clinical judgment review</a></li>`);
  } else if (/sepsis|infection/i.test(anchor.slugBase)) {
    links.push(`<li><a href="/blog/sepsis-nursing-care-gulf-licensing-exam-priorities-longtail">Sepsis nursing priorities and early recognition</a></li>`);
  } else {
    links.push(`<li><a href="/blog/intl-canada-cpnre-practical-nurse-exam-educational-overview">CPNRE practical nurse exam educational overview</a></li>`);
  }
  return `<ul>\n${links.map((link) => `  ${link}`).join("\n")}\n</ul>`;
}

function bodyHtml(anchor: CpnreAnchor, variant: CpnreVariant, slug: string): string {
  return `
<h2>Overview</h2>
<p>${anchor.titleCore} matters because Canadian practical nursing exams do not only ask whether you remember a term. They ask whether you can recognize risk, stay inside practical nursing scope, communicate clearly, and choose the safest next step when several options sound reasonable.</p>
<p>${anchor.clinicalFrame} This article focuses on ${variant.focus}, with examples written for CPNRE, CNPLE-style, and REx-PN-style preparation. It is educational, not a replacement for your school policy, clinical instructor guidance, or provincial regulatory standards.</p>

<h2>Why this topic appears on Canadian PN exams</h2>
<p>Licensure-style questions often compress a real bedside situation into a short stem. The writer may include vital signs, a medication detail, a family statement, a clinical setting, and one cue that changes the priority. Your job is to decide what matters now.</p>
<p>${anchor.bedsideExample} In a strong answer, the practical nurse notices the cue, protects immediate safety, reports through the right pathway, documents objectively, and reassesses response. That pattern is more important than memorizing a perfect sentence.</p>

<h2>Clinical judgment framework</h2>
<p>Use this four-step check: first, identify whether the client is stable or unstable. Second, decide whether the finding is expected or unexpected for the diagnosis and setting. Third, ask which actions are within practical nursing scope and employer policy. Fourth, choose the answer that reduces harm fastest while preserving communication and documentation.</p>
<p>${anchor.safetyFrame} If two answers both sound caring, prefer the one that addresses an acute physiologic or safety risk. If two answers both sound clinical, avoid the one that requires independent diagnosis, prescribing, or provider-level treatment decisions.</p>

<h2>Common exam traps</h2>
<p>The most common trap is choosing the action you would eventually do instead of the first action. Teaching, documentation, comfort, and routine care are all important, but they move behind airway, breathing, circulation, acute change, bleeding, hypoglycemia, sepsis cues, neurologic change, suicide risk, and unsafe medication administration.</p>
<p>Another trap is scope drift. ${anchor.examTrap} Canadian practical nursing items frequently reward collaboration and escalation. The best answer may not be the most dramatic intervention; it may be the safest assessment, report, hold-and-clarify, or reassessment step.</p>

<h2>How to study this efficiently</h2>
<p>Start with a short concept review, then answer questions immediately. After each miss, write one sentence explaining the mechanism you missed and one sentence explaining why the tempting option was unsafe. This converts mistakes into a remediation loop instead of vague frustration.</p>
<p>For flashcards, avoid isolated definitions only. Build cards around cue pairs: symptom plus priority, medication plus adverse effect, setting plus scope, finding plus escalation. For practice exams, track whether you missed the content, the wording, the priority, or the scope boundary.</p>

<h2>Mini clinical example</h2>
<p>Imagine you are caring for a client in a Canadian practical nursing setting. The client has a familiar diagnosis, but today the pattern changes: new confusion, worsening shortness of breath, increasing pain, sudden weakness, dizziness with low blood pressure, or a medication safety concern. The correct answer usually begins with assessment and safety, not reassurance.</p>
<p>If the item asks what to do first, do not jump to the most complete long-term plan. Choose the action that prevents deterioration in the next few minutes and creates a clear handoff for the rest of the team.</p>

<h2>Practice question breakdown</h2>
<p>A useful way to review ${anchor.titleCore.toLowerCase()} is to break every missed question into four labels: cue missed, priority missed, scope boundary missed, or wording missed. If you label the miss honestly, your next study step becomes obvious. Cue misses need more flashcards and comparison tables. Priority misses need timed questions. Scope misses need Canadian practical nursing standards and instructor feedback. Wording misses need slower stem reading and answer elimination practice.</p>
<p>When a rationale says an answer is wrong, do not stop at “I picked the wrong letter.” Ask why it was tempting. Most strong distractors contain one true idea attached to the wrong timing, the wrong patient, the wrong role, or the wrong level of urgency. That is the exact skill the exam is trying to build.</p>

<h2>Internal study links</h2>
${linksFor(anchor)}

<h2>FAQ</h2>
<h3>Is this topic tested as recall or clinical judgment?</h3>
<p>Both can appear, but high-quality CPNRE and REx-PN-style practice should push you toward clinical judgment: cues, safety, scope, and prioritization.</p>
<h3>Should I memorize every detail?</h3>
<p>No. Memorize critical safety cues and medication warnings, then practise applying them in cases. Application is what makes the knowledge useful under exam pressure.</p>
<h3>How should I use this with NurseNest?</h3>
<p>Read the article once, complete a short flashcard review, then answer practice questions connected to the same topic. Return to missed rationales after 24 to 72 hours.</p>

<h2>Next step</h2>
<p>${variant.cta}</p>
<p>Related search focus: ${anchor.intent}. Canonical study slug: <code>${slug}</code>.</p>
`.trimStart();
}

function buildFrontmatter(anchor: CpnreAnchor, variant: CpnreVariant, slug: string): string {
  const title = `${anchor.titleCore}: ${variant.titleSuffix} for Canadian Practical Nursing`;
  const excerpt = `${anchor.titleCore} for CPNRE/CNPLE-style practical nursing prep: ${variant.focus}, patient safety, Canadian scope, and exam-ready clinical reasoning.`;
  const seoTitle = truncateSentence(`${anchor.titleCore}: ${variant.titleSuffix} | NurseNest`, 68);
  const seoDescription = truncateSentence(excerpt, 165);
  return `---
slug: ${slug}
title: ${escapeJson(title)}
excerpt: ${escapeJson(excerpt)}
category: ${escapeJson(anchor.category)}
tags: ${tagsJson(anchor, variant)}
publishedAt: ${PUBLISHED_AT}
updatedAt: ${UPDATED_AT}
seoTitle: ${escapeJson(seoTitle)}
seoDescription: ${escapeJson(seoDescription)}
canonicalUrl: /blog/${slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports Canadian practical nursing exam preparation and clinical reasoning practice. It is educational content and not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and Canadian regulatory standards in real patient care.
---

`;
}

function combinations() {
  return ANCHORS.flatMap((anchor) =>
    VARIANTS.map((variant) => ({
      anchor,
      variant,
      slug: `cpnre-cnple-${slugify(anchor.slugBase)}-${slugify(variant.slugSuffix)}`,
    })),
  );
}

function wordCountBodyOnly(md: string): number {
  const raw = md.replace(/^\uFEFF/, "");
  if (!raw.startsWith("---")) return 0;
  const rest = raw.slice(raw.indexOf("\n") + 1);
  const end = rest.indexOf("\n---");
  if (end < 0) return 0;
  return countWordsFromHtml(rest.slice(end + 4));
}

function verify(): void {
  const files = readdirSync(OUT_DIR)
    .filter((file) => file.startsWith("cpnre-cnple-") && file.endsWith(".md"))
    .map((file) => join(OUT_DIR, file));
  if (files.length !== 216) {
    throw new Error(`Expected 216 cpnre-cnple files, found ${files.length}`);
  }
  const bad: string[] = [];
  for (const file of files) {
    const words = wordCountBodyOnly(readFileSync(file, "utf8"));
    if (words < MIN_WORDS) bad.push(`${file}: ${words} words`);
  }
  if (bad.length) throw new Error(`Below word floor:\n${bad.join("\n")}`);
  console.log(`OK: verified ${files.length} CPNRE/CNPLE long-tail files.`);
}

function main(): void {
  const dryRun = process.argv.includes("--dry-run");
  const verifyOnly = process.argv.includes("--verify-only");
  if (verifyOnly) {
    verify();
    return;
  }

  const rows = combinations();
  if (rows.length !== 216) {
    throw new Error(`Expected 216 generated rows, got ${rows.length}`);
  }

  const sample = rows[0]!;
  const sampleWords = countWordsFromHtml(bodyHtml(sample.anchor, sample.variant, sample.slug));
  if (sampleWords < MIN_WORDS) {
    throw new Error(`Sample article below word floor: ${sampleWords}`);
  }
  if (dryRun) {
    console.log(`Would write ${rows.length} files to ${OUT_DIR}; sample words=${sampleWords}`);
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const row of rows) {
    const body = bodyHtml(row.anchor, row.variant, row.slug);
    const words = countWordsFromHtml(body);
    if (words < MIN_WORDS) {
      throw new Error(`${row.slug} below word floor: ${words}`);
    }
    writeFileSync(join(OUT_DIR, `${row.slug}.md`), `${buildFrontmatter(row.anchor, row.variant, row.slug)}${body}\n`, "utf8");
  }
  console.log(`OK: wrote ${rows.length} CPNRE/CNPLE Canadian PN long-tail files.`);
}

main();
