#!/usr/bin/env npx tsx
/**
 * Deterministic generator for the U.S. RN / NCLEX-RN long-tail batch of 40 posts.
 *
 * - No external/AI APIs. All content authored in this file.
 * - Each spec is rendered into the existing static long-tail HTML body shape so the
 *   `validate:blog-static-longtail` and `hybrid-blog-static-longtail.contract` paths keep working.
 * - Slugs are intentionally unique vs. the existing long-tail folder and bundled blog corpus.
 *   DB rows still win at merge time; this generator is the static supplement source of truth.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/generate-nclex-rn-us-longtail-batch-40.mts
 *
 * Outputs:
 *   src/content/blog-static-longtail/<slug>.md  (40 files)
 *   reports/nclex-rn-us-longtail-batch-40.md    (delivery report; appended/overwritten on each run)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

type LinkRow = { href: string; label: string };
type FaqRow = { q: string; a: string };

type PostSpec = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  /** Topic-specific content blocks. Each renders to a labelled HTML section. */
  introduction: string[];
  whyMatters: string[];
  pathophysiology: string[];
  assessmentParas: string[];
  assessmentBullets: string[];
  interventionsParas: string[];
  interventionsList: string[];
  medicationsParas: string[];
  medicationsBullets: string[];
  delegationParas: string[];
  delegationBullets: string[];
  ngnParas: string[];
  teachingParas: string[];
  teachingBullets: string[];
  safetyParas: string[];
  safetyBullets: string[];
  commonMistakes: string[];
  examReviewPoints: string[];
  keyTakeaways: string[];
  internalLinks: LinkRow[];
  faqs: FaqRow[];
  references: string[];
};

const TODAY = "2026-05-10";
const APP_ROOT = process.cwd();
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");
const REPORT_PATH = join(APP_ROOT, "reports", "nclex-rn-us-longtail-batch-40.md");
const DISCLAIMER =
  "This article supports educational exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.";
const AUTHOR = "NurseNest Editorial";
const REVIEWER = "Clinical review board (educational)";

function esc(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function paras(items: string[]): string {
  return items.map((t) => `<p>${t}</p>`).join("\n");
}

function ul(items: string[]): string {
  return `<ul>\n${items.map((t) => `  <li>${t}</li>`).join("\n")}\n</ul>`;
}

function ol(items: string[]): string {
  return `<ol>\n${items.map((t) => `  <li>${t}</li>`).join("\n")}\n</ol>`;
}

function render(spec: PostSpec): string {
  const internalLinkItems = [
    ...spec.internalLinks,
    { href: "/app/lessons", label: "NurseNest lessons library" },
    { href: "/app/flashcards", label: "Flashcards study loop" },
    { href: "/app/practice", label: "Adaptive practice questions" },
    { href: "/app/cat", label: "CAT-style NCLEX-RN simulator" },
    { href: "/app/labs", label: "Lab values workstation" },
    { href: "/app/ecg", label: "ECG learning module" },
    { href: "/app/dashboard", label: "Learner dashboard and progress" },
  ];
  const linkHtml = internalLinkItems
    .map((l) => `  <li><a href="${l.href}">${esc(l.label)}</a></li>`)
    .join("\n");
  const faqHtml = spec.faqs
    .map((f) => `<h3>${esc(f.q)}</h3>\n<p>${f.a}</p>`)
    .join("\n");
  const refHtml = spec.references.map((r) => `<p>${r}</p>`).join("\n");
  const tagsCsv = spec.tags.join(", ");

  return `---
slug: ${spec.slug}
title: ${spec.title}
excerpt: ${spec.excerpt}
category: ${spec.category}
tags: ${tagsCsv}
publishedAt: ${TODAY}
updatedAt: ${TODAY}
seoTitle: ${spec.seoTitle}
seoDescription: ${spec.seoDescription}
canonicalUrl: /blog/${spec.slug}
authorDisplayName: ${AUTHOR}
medicalReviewerName: ${REVIEWER}
disclaimer: ${DISCLAIMER}
---

<h2>Introduction</h2>
${paras(spec.introduction)}

<h2>Key Takeaways</h2>
${ul(spec.keyTakeaways)}

<h2>Why this matters for NCLEX-RN</h2>
${paras(spec.whyMatters)}

<h2>Pathophysiology overview</h2>
${paras(spec.pathophysiology)}

<h2>Assessment priorities</h2>
${paras(spec.assessmentParas)}
${ul(spec.assessmentBullets)}

<h2>Nursing interventions</h2>
${paras(spec.interventionsParas)}
${ol(spec.interventionsList)}

<h2>Medication considerations</h2>
${paras(spec.medicationsParas)}
${ul(spec.medicationsBullets)}

<h2>Delegation and prioritization</h2>
${paras(spec.delegationParas)}
${ul(spec.delegationBullets)}

<h2>NGN clinical judgment reasoning</h2>
${paras(spec.ngnParas)}

<h2>Patient teaching</h2>
${paras(spec.teachingParas)}
${ul(spec.teachingBullets)}

<h2>Safety considerations</h2>
${paras(spec.safetyParas)}
${ul(spec.safetyBullets)}

<h2>Common NCLEX mistakes</h2>
${ul(spec.commonMistakes)}

<h2>Exam-focused review points</h2>
${ul(spec.examReviewPoints)}

<h2>Suggested internal links</h2>
<ul>
${linkHtml}
</ul>

<h2>Premium CTA</h2>
<p>Connect this topic to your NurseNest adaptive study loop. Premium NCLEX-RN lessons, flashcards, and practice questions translate the pathophysiology, assessment cues, and prioritization patterns above into timed, exam-style stems with rationales. Pair this article with the linked lessons, then run a short adaptive practice block and review the dashboard signals so the next study session focuses on the area where your reasoning is still slowest, not on what is already automatic.</p>

<h2>FAQ schema</h2>
${faqHtml}

<h2>APA-7 references</h2>
${refHtml}
<p><em>References reflect U.S. nursing exam preparation context. Always confirm current editions, agency guidance, and institutional policies; this article is educational and does not replace local clinical protocols.</em></p>
`;
}

// ----------------------------------------------------------------------------
// Shared link helpers
// ----------------------------------------------------------------------------
const LK = {
  sepsis: { href: "/blog/sepsis-pathophysiology-early-nursing-recognition", label: "Sepsis pathophysiology and early recognition" },
  copd: { href: "/blog/copd-symptoms-treatment-nursing-care", label: "COPD nursing care" },
  asthma: { href: "/blog/asthma-pathophysiology-emergency-nursing-interventions", label: "Asthma emergency nursing interventions" },
  pe: { href: "/blog/pulmonary-embolism-signs-symptoms-nursing-priorities", label: "Pulmonary embolism nursing priorities" },
  dvt: { href: "/blog/deep-vein-thrombosis-nursing-guide", label: "Deep vein thrombosis nursing guide" },
  hf: { href: "/blog/left-sided-vs-right-sided-heart-failure", label: "Left vs right heart failure nursing care" },
  stroke: { href: "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care", label: "Ischemic vs hemorrhagic stroke nursing care" },
  icp: { href: "/blog/increased-intracranial-pressure-nursing-priorities", label: "Increased intracranial pressure priorities" },
  aki: { href: "/blog/acute-kidney-injury-prerenal-intrinsic-postrenal", label: "Acute kidney injury patterns" },
  hyperK: { href: "/blog/hyperkalemia-ecg-changes-nursing-students", label: "Hyperkalemia ECG changes for students" },
  hypoK: { href: "/blog/hypokalemia-pathophysiology-nursing-priorities", label: "Hypokalemia nursing priorities" },
  hypoNa: { href: "/blog/hyponatremia-symptoms-causes-nursing-priorities", label: "Hyponatremia nursing priorities" },
  hyperNa: { href: "/blog/hypernatremia-causes-symptoms-nursing-care", label: "Hypernatremia nursing care" },
  metAcid: { href: "/blog/metabolic-acidosis-vs-metabolic-alkalosis", label: "Metabolic acidosis vs alkalosis" },
  respAcid: { href: "/blog/respiratory-acidosis-vs-respiratory-alkalosis", label: "Respiratory acidosis vs alkalosis" },
  giBleed: { href: "/blog/upper-vs-lower-gi-bleeding-nursing-guide", label: "Upper vs lower GI bleeding guide" },
  warfHep: { href: "/blog/warfarin-vs-heparin-nursing-comparison", label: "Warfarin vs heparin comparison" },
  furosemide: { href: "/blog/why-furosemide-can-worsen-electrolyte-problems-on-nursing-exams", label: "Furosemide and electrolyte traps" },
  digoxin: { href: "/blog/digoxin-toxicity-nursing-priorities", label: "Digoxin toxicity nursing priorities" },
  betaBlock: { href: "/blog/beta-blockers-mechanism-side-effects-nursing-teaching", label: "Beta-blocker nursing teaching" },
  dka: { href: "/blog/dka-vs-hhs-nursing-priorities", label: "DKA vs HHS nursing priorities" },
  siadh: { href: "/blog/siadh-vs-diabetes-insipidus-nursing-comparison", label: "SIADH vs diabetes insipidus" },
  seizure: { href: "/blog/seizure-disorders-treatment-nursing-care", label: "Seizure disorders nursing care" },
  liver: { href: "/blog/liver-cirrhosis-symptoms-nursing-care", label: "Liver cirrhosis nursing care" },
  pancreatitis: { href: "/blog/pancreatitis-symptoms-causes-nursing-priorities", label: "Pancreatitis nursing priorities" },
} as const;

// ----------------------------------------------------------------------------
// Shared building blocks reused with topic-specific framing.
// ----------------------------------------------------------------------------
const SHARED_TAGS = ["NCLEX-RN", "NGN", "Clinical Judgment", "U.S. RN Students"];
const NGN_STEPS_SENTENCE =
  "Use the NCSBN Clinical Judgment Measurement Model: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.";

// ----------------------------------------------------------------------------
// 40 topic specs
// ----------------------------------------------------------------------------
const POSTS: PostSpec[] = [
  // 1
  {
    slug: "nclex-rn-prioritization-strategies-for-rn-students",
    title: "NCLEX-RN Prioritization Strategies for U.S. RN Students",
    excerpt: "A clear, repeatable prioritization framework for the NCLEX-RN: airway, perfusion, neuro change, safety, then teaching, applied through Next Generation NCLEX clinical judgment.",
    category: "NCLEX-RN Strategy",
    tags: [...SHARED_TAGS, "Prioritization", "ABC", "Maslow", "Safety"],
    seoTitle: "NCLEX-RN Prioritization Strategies for RN Students",
    seoDescription: "Use a stepwise NCLEX-RN prioritization framework with airway, perfusion, neuro decline, safety, and teaching, anchored in Next Generation clinical judgment.",
    introduction: [
      "Prioritization is the most predictive skill on the NCLEX-RN. The exam does not ask you to recall every fact; it asks you to choose the safest next nursing action when several actions are reasonable. U.S. RN candidates who pass on the first attempt usually share one habit: they read the stem with a fixed prioritization frame instead of relying on memory of the disease.",
      "This article gives you a structured way to rank actions across acute and chronic stems. It pairs the classic frameworks (ABC, Maslow, safety, acute over chronic, unstable over stable) with the Next Generation NCLEX (NGN) clinical judgment cycle so the same approach holds for case studies, bowtie items, and trend questions.",
    ],
    whyMatters: [
      "The NCLEX-RN expects entry-level practice consistent with U.S. nursing scope and the NCSBN Clinical Judgment Measurement Model. Prioritization items reward whether you can protect the airway, restore perfusion, prevent harm from neurologic decline, and intervene before deterioration becomes irreversible.",
      "Without a frame, candidates pick the most familiar option. With a frame, candidates compare options against patient stability and predicted complications. The same lens then carries into the unfolding case studies, where the question shifts mid-scenario as labs, vitals, or assessment cues change.",
    ],
    pathophysiology: [
      "Prioritization is grounded in physiology. Airway loss causes hypoxia in minutes. Failed perfusion causes shock. Increasing intracranial pressure or worsening neuro status risks herniation. Severe electrolyte shifts trigger dysrhythmia. Bleeding lowers oxygen delivery and can compound injury.",
      "An exam stem that mentions stridor, falling oxygen saturation, new altered mental status, sudden hypotension with tachycardia, focal neurologic change, severe respiratory effort, or chest pain is signaling time-sensitive physiology. Routine teaching, scheduled medications, and elective tasks usually wait for those cues to be addressed.",
    ],
    assessmentParas: [
      "Begin every prioritization item by identifying the highest-risk patient or finding. Compare oxygenation, perfusion, neurologic status, and safety threats first; teaching and discharge readiness come next. The U.S. RN scope keeps you assessing, monitoring, and escalating to the provider rather than independently prescribing therapy.",
      "Within a single patient, group findings by physiologic system, then ask: what change in the last hour is the most dangerous? A worsening trend is usually more important than an isolated abnormal value. Pair the trend with a planned reassessment so the answer choice shows nursing accountability for outcomes.",
    ],
    assessmentBullets: [
      "Airway compromise: stridor, drooling, gurgling, decreased level of consciousness with poor cough.",
      "Breathing emergencies: rising respiratory rate with falling oxygen saturation, accessory muscle use, silent chest.",
      "Circulation collapse: cool mottled skin, prolonged capillary refill, narrowing pulse pressure, falling urine output.",
      "Neurologic decline: new confusion, focal weakness, seizures, abnormal pupil response, falling Glasgow Coma Scale.",
      "Safety threats: fall risk plus altered mentation, suicidal statements with plan, infection control breaks, medication errors.",
    ],
    interventionsParas: [
      "Move from the highest-risk system to the lowest. Stabilize the airway, then breathing, then circulation, then neurologic status. After stabilization, address safety, comfort, and education. When two interventions both apply, choose the one that prevents the next predictable complication for the most fragile patient on the assignment.",
      "Document each intervention with the trigger that justified it. Prioritization questions reward objective data, named protocols, and timely escalation. They penalize answers that delay care while waiting for nonurgent information or that skip ordered safety steps.",
    ],
    interventionsList: [
      "Reassess the unstable patient first; secure airway support and apply ordered oxygen targets.",
      "Restore perfusion with positioning, ordered fluids or vasopressors, and bleeding control.",
      "Manage neurologic risk with seizure precautions, head-of-bed positioning, and rapid stroke or trauma activation when criteria are met.",
      "Implement infection, fall, suicide, and medication safety bundles before delegating routine tasks.",
      "Notify the provider with situation, background, assessment, and recommendation language; document response and reassessment.",
    ],
    medicationsParas: [
      "Prioritization items often hide a medication safety question. Ask whether the next dose is still safe given the current heart rate, blood pressure, oxygen saturation, electrolytes, renal function, bleeding risk, glucose, neuro status, or pain trajectory.",
      "When a high-alert medication is involved, the safest option is often to verify parameters, hold the dose, and notify the provider rather than to administer on schedule. Independent dose changes are outside U.S. RN scope.",
    ],
    medicationsBullets: [
      "Hold and verify when vital signs cross hold parameters (for example, beta-blocker with bradycardia or hypotension).",
      "Verify potassium, magnesium, and renal function before high-risk infusions such as insulin or amiodarone.",
      "Use independent double-check policies for insulin, heparin, opioids, and chemotherapy when required.",
      "Recheck allergies, weight, and rights before any newly ordered medication.",
    ],
    delegationParas: [
      "Delegation is part of prioritization. The U.S. RN cannot delegate assessment, evaluation of outcomes, teaching, or unstable patients. The RN can delegate stable, predictable tasks within the assistive personnel scope and supervise the result.",
      "Pair the right task with the right person, then verify completion and report any change immediately. Choose the patient you, the RN, must see first based on instability.",
    ],
    delegationBullets: [
      "RN sees the unstable, newly admitted, postoperative, or rapidly changing patient first.",
      "Delegate ambulation of stable patients, vital sign collection in stable patients, and intake-output recording to UAP.",
      "Use the LPN or LVN for reinforcement of teaching, ordered med administration within scope, and stable wound care.",
      "Always retain accountability for outcomes; verify, sign, and document.",
    ],
    ngnParas: [
      "Apply the NCSBN Clinical Judgment Measurement Model to every prioritization item. Recognize cues by listing the abnormal data first. Analyze cues by deciding which physiologic threat each cue points to. Prioritize hypotheses by ranking which threat will harm the patient first.",
      "Generate solutions by listing the realistic nursing actions, not the wished-for diagnosis. Take action by selecting the safest option that fits scope and orders. Evaluate outcomes by stating which reassessment will tell you the action worked, and by what time.",
    ],
    teachingParas: [
      "Teaching is rarely the priority for an unstable patient, but it is often the priority for a stable, discharge-ready patient. Match the teaching to the patient's actual risk and to the physician's plan.",
      "Use teach-back, plain language at a low literacy level, and clear thresholds for when to call for help. Teaching answers tied to specific symptoms, doses, follow-up, and safety usually outscore vague reassurance.",
    ],
    teachingBullets: [
      "Use teach-back with one specific change at a time.",
      "Explain when to call 911 versus when to call the clinic.",
      "Reinforce medication purpose, schedule, and adverse effects to report.",
      "Address culturally appropriate diet and follow-up appointments.",
    ],
    safetyParas: [
      "Safety overrides convenience on the NCLEX-RN. If the answer hides a safety problem, that answer is wrong even if it is fast or familiar. Look for hidden safety issues such as wrong patient identification, missing allergy verification, or skipped time-out before procedures.",
      "Safety also covers the nurse: needlestick prevention, isolation precautions, body mechanics, and reporting workplace violence.",
    ],
    safetyBullets: [
      "Use two patient identifiers and verify allergies before each medication and procedure.",
      "Honor isolation precautions, even when convenient shortcuts exist.",
      "Document safety events through the chain of command, not informally.",
      "Reassess after every intervention with the same parameter that triggered it.",
    ],
    commonMistakes: [
      "Choosing teaching as the answer when the stem describes an unstable patient.",
      "Treating an isolated lab number as more important than a worsening trend.",
      "Selecting a familiar nursing intervention that does not match the highest-acuity threat.",
      "Forgetting to check medication hold parameters before administering scheduled doses.",
      "Delegating assessment, teaching, evaluation, or care of an unstable patient to assistive personnel.",
    ],
    examReviewPoints: [
      "Airway, breathing, circulation, neuro decline, safety, then teaching.",
      "Acute trumps chronic; unstable trumps stable; new findings trump baseline.",
      "Trend matters more than a single abnormal value.",
      "Verify, escalate, and document before independent action outside scope.",
      "Use the six NGN clinical judgment steps in order on every case study.",
    ],
    keyTakeaways: [
      "Prioritization is a skill, not a memorized list; pair frameworks with the NGN clinical judgment cycle.",
      "Reassess unstable patients first and align actions with U.S. RN scope.",
      "Trends and predicted complications outrank single abnormal values.",
      "Safety, allergy, and identification checks override speed.",
      "Use teach-back for stable patients and SBAR for escalation to the provider.",
    ],
    internalLinks: [LK.sepsis, LK.stroke, LK.hf, LK.aki, LK.hyperK],
    faqs: [
      { q: "What is the safest first prioritization frame on the NCLEX-RN?", a: "Use airway, breathing, circulation, neurologic decline, safety, then teaching, layered with the six NGN clinical judgment steps so the answer matches what the most fragile patient needs first." },
      { q: "How do I choose between two reasonable nursing actions?", a: "Pick the action that prevents the next predictable complication for the most unstable patient, then verify safety parameters and document the response." },
      { q: "Does the NCLEX-RN reward delegation?", a: "Yes, when delegation matches scope. Delegate stable, predictable tasks to UAP, keep assessment and teaching with the RN, and verify outcomes." },
      { q: "What is the difference between prioritization and triage?", a: "Triage sorts patients by acuity at the door; prioritization decides what the nurse does next for one patient or an assignment of patients across a shift." },
    ],
    references: [
      "National Council of State Boards of Nursing. (2023). NCLEX-RN test plan. NCSBN. https://www.ncsbn.org/exams/test-plans.page",
      "National Council of State Boards of Nursing. (2019). NCSBN Clinical Judgment Measurement Model. NCSBN. https://www.ncsbn.org/research/research-projects/next-generation-nclex/clinical-judgment-measurement-model.page",
      "Agency for Healthcare Research and Quality. (2022). Patient safety primer: Handoffs and signouts. AHRQ. https://psnet.ahrq.gov/primer/handoffs-and-signouts",
      "American Nurses Association. (2015). Nursing: Scope and standards of practice (3rd ed.). ANA.",
    ],
  },
  // 2
  {
    slug: "ngn-clinical-judgment-explained-for-nclex-rn",
    title: "NGN Clinical Judgment Explained for the NCLEX-RN",
    excerpt: "A plain-language guide to the Next Generation NCLEX clinical judgment cycle, with examples of how each of the six steps appears in case studies, bowtie items, and trend questions.",
    category: "NCLEX-RN Strategy",
    tags: [...SHARED_TAGS, "NGN Case Study", "Bowtie", "Cloze", "Test Plan"],
    seoTitle: "NGN Clinical Judgment Explained for the NCLEX-RN",
    seoDescription: "Learn the six steps of the NCSBN Clinical Judgment Measurement Model and how to apply them to case studies, bowtie items, and trend stems on the NCLEX-RN.",
    introduction: [
      "The Next Generation NCLEX (NGN) was built around one model: the NCSBN Clinical Judgment Measurement Model. The exam still tests safe, effective entry-level U.S. nursing practice. What changed is that more items now measure how you think, not only what you remember.",
      "This article walks through each of the six steps in everyday nursing language and shows how they appear in case studies, bowtie items, drag-and-drop questions, matrix items, and standalone clinical judgment items.",
    ],
    whyMatters: [
      "Many candidates feel uncertain when an item shows a long medical record, multiple tabs, or evolving cues. The clinical judgment model gives a stable structure to read those items: notice the right cues, sort them, decide which threat to act on, choose realistic actions, take them, and check the outcome.",
      "Using the model also reduces the temptation to guess. Each step gives you a checkpoint so you can stop, name the patient problem, and pick a defensible next action even when the case keeps changing.",
    ],
    pathophysiology: [
      "Although the model is a thinking process and not an organ system, it is anchored in physiology. Step one (recognize cues) trains you to find data that signals failing oxygenation, perfusion, neurologic status, or safety. Step two (analyze cues) maps those cues to physiologic mechanisms.",
      "Step three (prioritize hypotheses) ranks the possible problems by which one will hurt the patient first. Step four (generate solutions) lists realistic nursing actions. Step five (take action) selects the safest option. Step six (evaluate outcomes) confirms whether the chosen action worked.",
    ],
    assessmentParas: [
      "Treat every NGN case study like a shift report. Skim the chart tabs in order: nurses' notes, vital signs, history, medications, labs, imaging. Highlight the abnormal data and the trend direction. The cues that matter are the ones tied to a physiologic threat or to a safety problem.",
      "If the item asks you to drag the most relevant cues, choose the ones that change the immediate plan, not every abnormal lab or every history detail. The exam intentionally includes distractor data.",
    ],
    assessmentBullets: [
      "Read the question stem first to know which problem you are sorting cues against.",
      "Open all available tabs once before answering.",
      "Mark cues by mechanism: oxygenation, perfusion, neuro, safety, infection, electrolyte, drug effect.",
      "Watch for trends across timestamps.",
      "Notice when a cue contradicts the suspected problem; that often changes the answer.",
    ],
    interventionsParas: [
      "When the item asks for the next action, choose interventions that fit U.S. RN scope. The strongest options assess, monitor, position, escalate, give an ordered medication safely, or implement a standing protocol. Avoid options that change orders without provider direction.",
      "When the item gives you a list of possible actions, eliminate any that delay care for the unstable patient or that ignore a safety check.",
    ],
    interventionsList: [
      "Recognize cues from chart tabs and timestamps.",
      "Analyze cues by mapping each abnormality to a mechanism.",
      "Prioritize hypotheses by ranking which mechanism harms the patient first.",
      "Generate solutions that fit nursing scope and current orders.",
      "Take action with the safest, most timely option.",
      "Evaluate outcomes with a specific reassessment plan.",
    ],
    medicationsParas: [
      "Many NGN items embed a medication safety question inside a clinical judgment case. The exam may show a new lab value or vital sign that changes whether the next dose is safe.",
      "Pause to ask which parameter must be met before the medication is given and which adverse effect would change your action plan.",
    ],
    medicationsBullets: [
      "Confirm allergies, dose, route, time, and patient identifiers.",
      "Recheck hold parameters when vital signs or labs change.",
      "Identify high-alert drugs (insulin, heparin, opioids, chemotherapy, vasoactives) and apply double-check policies.",
      "Document the parameter that justified administration or the reason for holding.",
    ],
    delegationParas: [
      "NGN items often present an assignment grid: which task goes to which staff member. Apply the same delegation rules used elsewhere on the NCLEX-RN. RNs keep assessment, teaching, evaluation, unstable patients, and care that requires judgment.",
      "Tasks that are routine, standardized, and unchanging can be delegated to UAP within the state scope.",
    ],
    delegationBullets: [
      "Match task complexity to scope, not convenience.",
      "Verify the assistant's competency for the specific task and patient.",
      "Communicate expectations and report-back parameters.",
      "Evaluate the result; you remain accountable for outcomes.",
    ],
    ngnParas: [
      "The six steps are recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes. Most NGN questions ask about one or two of these steps, but a full case study can sample all six. Memorize the steps in order and use them as your study scaffold.",
      "When an item feels overwhelming, stop and name which step the question is testing. Then narrow to the cues, hypotheses, or actions that matter for that step. This converts a complex item into a structured decision rather than a guess.",
    ],
    teachingParas: [
      "Teaching items inside an NGN case usually appear after stabilization. They reward education tied to the most relevant complication for that specific patient, in plain language and at the right reading level.",
      "Use teach-back when you can; the answer that asks the patient to repeat or demonstrate is often safer than the answer that simply hands them a brochure.",
    ],
    teachingBullets: [
      "Tie teaching to the documented diagnosis and current orders.",
      "Use one new instruction at a time when the patient is recovering from acute illness.",
      "Reinforce when to call 911 versus when to schedule follow-up.",
      "Document patient response and any teach-back result.",
    ],
    safetyParas: [
      "Safety questions on NGN items can be subtle. They may appear as an extra cue, as a timing issue, or as a workflow choice. Look for missed identification, allergy gaps, isolation breaks, fall risk, suicide risk, infection control issues, or unsafe medication double-check shortcuts.",
      "When two clinical actions look identical, the safer one is usually the one that adds verification, escalation, or reassessment.",
    ],
    safetyBullets: [
      "Verify identification, allergies, and orders before action.",
      "Apply isolation, fall, and suicide precautions to the highest-risk patient first.",
      "Name a clear evaluation plan for every action.",
      "Use SBAR to escalate concerns to the provider.",
    ],
    commonMistakes: [
      "Treating NGN items like trivia and skipping the chart tabs.",
      "Choosing the most familiar option instead of the safest one for this patient.",
      "Selecting too many cues; the question wants the relevant ones, not all abnormal ones.",
      "Forgetting the evaluate outcomes step, which the exam often tests.",
      "Using disease memorization to overrule a stem cue that contradicts it.",
    ],
    examReviewPoints: [
      "Memorize the six steps in order.",
      "Open every chart tab before answering.",
      "Map every cue to a physiologic mechanism.",
      "Pick actions that fit U.S. RN scope and current orders.",
      "Always identify the reassessment that proves the action worked.",
    ],
    keyTakeaways: [
      "The NCSBN Clinical Judgment Measurement Model has six steps; learn them as a scaffold, not as trivia.",
      "Recognize cues by trend, not by single abnormal value.",
      "Prioritize hypotheses by physiologic urgency.",
      "Take actions inside U.S. RN scope and current orders.",
      "Evaluate outcomes with a specific reassessment plan and time.",
    ],
    internalLinks: [LK.sepsis, LK.stroke, LK.hf, LK.aki, LK.dka],
    faqs: [
      { q: "What is the NCSBN Clinical Judgment Measurement Model?", a: "It is the six-step model the NCLEX-RN uses to measure clinical judgment: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes." },
      { q: "How is an NGN case study scored?", a: "Each step is scored independently with partial credit using NCSBN scoring rules; treat each tab and item as its own decision while keeping the overall patient story in mind." },
      { q: "What is a bowtie item?", a: "A bowtie item asks for the most likely problem, the actions to take, and the parameters to monitor; it samples several steps of the clinical judgment model in one screen." },
      { q: "How can I practice NGN-style thinking outside the exam?", a: "Use unfolding case studies in your school program, the NurseNest CAT-style simulator, and structured chart reviews where you name cues, mechanism, action, and reassessment." },
    ],
    references: [
      "National Council of State Boards of Nursing. (2023). NCLEX-RN test plan. NCSBN. https://www.ncsbn.org/exams/test-plans.page",
      "National Council of State Boards of Nursing. (2019). NCSBN Clinical Judgment Measurement Model. NCSBN. https://www.ncsbn.org/research/research-projects/next-generation-nclex/clinical-judgment-measurement-model.page",
      "Dickison, P., Haerling, K. A., & Lasater, K. (2019). Integrating the National Council of State Boards of Nursing Clinical Judgment Model into nursing educational frameworks. Journal of Nursing Education, 58(2), 72-78. https://doi.org/10.3928/01484834-20190122-03",
      "American Nurses Association. (2015). Nursing: Scope and standards of practice (3rd ed.). ANA.",
    ],
  },
  // 3
  {
    slug: "sepsis-nursing-interventions-rn-priorities",
    title: "Sepsis Nursing Interventions: RN Priorities and NGN Reasoning",
    excerpt: "How U.S. RNs apply the Hour-1 sepsis bundle, monitor lactate and perfusion, and act on Next Generation NCLEX clinical judgment cues for adult sepsis and septic shock.",
    category: "Emergency and Critical Care",
    tags: [...SHARED_TAGS, "Sepsis", "Septic Shock", "Surviving Sepsis", "Lactate"],
    seoTitle: "Sepsis Nursing Interventions for U.S. RNs",
    seoDescription: "Apply the Hour-1 bundle, lactate-guided resuscitation, vasopressor escalation, and NGN clinical judgment to adult sepsis nursing interventions on the NCLEX-RN.",
    introduction: [
      "Sepsis remains one of the most common emergencies in U.S. acute-care settings and one of the most predictable categories on the NCLEX-RN. The interventions you will be asked about align with the Surviving Sepsis Campaign Hour-1 bundle and with NGN clinical judgment cues such as worsening mental status, falling urine output, and a rising lactate.",
      "This article focuses on the RN's role: rapid recognition, source identification, ordered fluid resuscitation, antimicrobial timing, perfusion monitoring, and escalation when vasopressors or higher levels of care are needed.",
    ],
    whyMatters: [
      "The NCLEX-RN expects safe, time-sensitive care of unstable adults. Sepsis items pair physiologic recognition with ordered interventions, and they reward escalation language. Mortality climbs with every hour of delayed antibiotics, so the test rewards a candidate who acts early and reassesses often.",
      "From an NGN perspective, sepsis items often appear as unfolding case studies. Cues evolve from the emergency department screen to the inpatient unit. Your reasoning has to keep up.",
    ],
    pathophysiology: [
      "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Inflammatory mediators damage the endothelium, vasodilate vessels, leak fluid into tissues, form microthrombi, and impair mitochondrial oxygen use. The blood pressure can look acceptable until compensation fails.",
      "Septic shock adds persistent hypotension that requires vasopressors to maintain a mean arterial pressure of at least 65 mmHg, plus a serum lactate above 2 mmol/L despite adequate volume resuscitation. Older adults and immunocompromised patients may be afebrile or hypothermic.",
    ],
    assessmentParas: [
      "Trend the vital signs every 15 minutes early in the resuscitation. Track mental status, urine output, capillary refill, and skin temperature. Reassess after each fluid bolus and after vasopressor changes.",
      "Document the suspected source: pulmonary, urinary, intra-abdominal, soft tissue, central line, postoperative, or unknown. The source guides cultures, antibiotics, and source control planning.",
    ],
    assessmentBullets: [
      "Temperature, heart rate, respiratory rate, blood pressure, oxygen saturation.",
      "Mental status (using a tool such as the Glasgow Coma Scale).",
      "Urine output (target at least 0.5 mL/kg/hr in adults).",
      "Lactate trend; redraw if initial value is elevated.",
      "Skin: warm and flushed early; cool, mottled, or cyanotic late.",
    ],
    interventionsParas: [
      "Apply the Surviving Sepsis Campaign Hour-1 bundle: measure lactate, obtain blood cultures before antibiotics when feasible, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate at 4 mmol/L or above, and start vasopressors during or after fluid resuscitation if MAP remains under 65 mmHg.",
      "Reassess after every intervention. Document response, remaining oxygen needs, and the trigger for escalation. Notify the rapid response team or provider when the patient deteriorates.",
    ],
    interventionsList: [
      "Obtain blood cultures and serum lactate before antibiotics when feasible.",
      "Administer broad-spectrum antibiotics within one hour of recognition.",
      "Start 30 mL/kg balanced crystalloid resuscitation for hypotension or lactate of 4 mmol/L or above.",
      "Initiate vasopressors (norepinephrine first line) for persistent hypotension to maintain MAP of 65 mmHg or above.",
      "Plan source control with the team (drain, line removal, surgery) once stabilization begins.",
    ],
    medicationsParas: [
      "Antibiotics are the most time-sensitive medication on the bundle. Begin broad-spectrum coverage based on suspected source, allergies, and antibiogram, then narrow once cultures return. Vasopressors require a central or carefully monitored peripheral line.",
      "Steroids may be added in refractory septic shock per facility protocol. Hold or adjust nephrotoxic and QT-prolonging medications when possible.",
    ],
    medicationsBullets: [
      "Verify allergies, weight, and renal function before each antibiotic dose.",
      "Use norepinephrine as first-line vasopressor; titrate to MAP at least 65 mmHg.",
      "Monitor cultures and antibiotic sensitivities; expect de-escalation by day 2-3.",
      "Reassess QT interval, renal function, and bleeding risk on every shift.",
    ],
    delegationParas: [
      "The RN remains responsible for assessment, fluid resuscitation oversight, and titration of vasoactive drips. Delegation is limited to UAP tasks such as turning, blood glucose checks per protocol, and assistance with hygiene.",
      "When workload is heavy, the RN should escalate staffing concerns. Septic patients deserve frequent reassessment that does not lend itself to routine delegation.",
    ],
    delegationBullets: [
      "RN performs every assessment and trends vital signs.",
      "Delegate skin care, turning, and oral care after stabilization.",
      "Have UAP report any change in mentation, output, or vital signs immediately.",
      "Use SBAR to escalate to charge nurse, intensivist, or rapid response.",
    ],
    ngnParas: [
      "Recognize cues such as confusion, low blood pressure, tachypnea, and falling urine output. Analyze cues by mapping them to perfusion failure. Prioritize the hypothesis of septic shock when the source and inflammatory response are present.",
      "Generate solutions that match the Hour-1 bundle. Take action with cultures, antibiotics, fluids, and vasopressors as ordered. Evaluate outcomes with repeat lactate, MAP, mental status, and urine output every 30-60 minutes.",
    ],
    teachingParas: [
      "After stabilization, teach the patient and family about infection prevention, completing antibiotics, recognizing relapse, and seeking urgent care for fever, confusion, or worsening pain. Address vaccinations such as influenza, pneumococcal, and COVID-19 as appropriate.",
      "Provide written instructions in plain language and confirm understanding with teach-back.",
    ],
    teachingBullets: [
      "Complete the full antibiotic course as prescribed.",
      "Recognize warning signs: fever, confusion, low urine output, severe pain.",
      "Practice hand hygiene and wound care.",
      "Discuss vaccination plans with the primary care team.",
    ],
    safetyParas: [
      "Safety includes correct antibiotic selection, correct fluid type, and protected vasopressor lines. Use evidence-based central line bundles to prevent catheter-related bloodstream infections.",
      "Mind the airway: sedation and worsening hypoxemia can rapidly compromise breathing in a fluid-resuscitated patient.",
    ],
    safetyBullets: [
      "Verify two patient identifiers before each medication.",
      "Use closed system fluid bags and ordered crystalloid (typically lactated Ringer's or normal saline).",
      "Monitor for fluid overload (rales, hypoxemia, jugular venous distention) after large boluses.",
      "Use central or carefully monitored peripheral access for vasopressors.",
    ],
    commonMistakes: [
      "Waiting for fever before recognizing sepsis in older adults.",
      "Delaying antibiotics to complete optional diagnostic tests.",
      "Giving vasopressors through small peripheral IVs without protocol coverage.",
      "Forgetting to recheck lactate after resuscitation.",
      "Choosing teaching as the priority for a hypotensive, oliguric patient.",
    ],
    examReviewPoints: [
      "Hour-1 bundle: lactate, cultures, antibiotics, fluids, vasopressors.",
      "Norepinephrine is first-line vasopressor.",
      "MAP target at least 65 mmHg, urine output at least 0.5 mL/kg/hr.",
      "Reassess after every fluid bolus and titrate based on response.",
      "Escalate to ICU level of care for ongoing vasopressor or ventilatory needs.",
    ],
    keyTakeaways: [
      "Recognize sepsis early: confusion, tachypnea, hypotension, oliguria.",
      "Apply the Hour-1 bundle promptly and document each step.",
      "Use norepinephrine to maintain MAP at least 65 mmHg.",
      "Reassess perfusion after each intervention.",
      "Escalate to ICU and source control as soon as criteria are met.",
    ],
    internalLinks: [LK.sepsis, LK.aki, LK.metAcid, LK.hf, LK.warfHep],
    faqs: [
      { q: "What MAP should the nurse target in septic shock?", a: "A mean arterial pressure of at least 65 mmHg per the Surviving Sepsis Campaign guidelines, titrating vasopressors as ordered." },
      { q: "Why are blood cultures drawn before antibiotics?", a: "To improve culture yield and guide later de-escalation, but cultures must not delay antibiotic administration when the patient is unstable." },
      { q: "Is normal saline or balanced crystalloid preferred?", a: "Recent evidence and guidelines favor balanced crystalloids such as lactated Ringer's, but follow your facility protocol." },
      { q: "When should the RN escalate to rapid response or ICU?", a: "When the patient remains hypotensive after initial bolus, lactate is rising, mental status worsens, or vasopressors are needed." },
    ],
    references: [
      "Evans, L., Rhodes, A., Alhazzani, W., et al. (2021). Surviving Sepsis Campaign: International guidelines for management of sepsis and septic shock 2021. Intensive Care Medicine, 47, 1181-1247. https://doi.org/10.1007/s00134-021-06506-y",
      "Centers for Disease Control and Prevention. (2024). Sepsis: Clinical information. CDC. https://www.cdc.gov/sepsis/clinicians.html",
      "Singer, M., Deutschman, C. S., Seymour, C. W., et al. (2016). The Third International Consensus Definitions for Sepsis and Septic Shock. JAMA, 315(8), 801-810. https://doi.org/10.1001/jama.2016.0287",
      "American Association of Critical-Care Nurses. (2023). Sepsis bundle nursing care reference. AACN.",
    ],
  },
  // 4
  {
    slug: "chf-nursing-care-rn-priorities",
    title: "CHF Nursing Care: RN Priorities for Decompensated Heart Failure",
    excerpt: "Acute and chronic congestive heart failure nursing care for U.S. RN students, including diuretic safety, daily weights, fluid limits, NGN cues, and discharge teaching.",
    category: "Cardiovascular Disorders",
    tags: [...SHARED_TAGS, "Heart Failure", "CHF", "Diuretics", "Discharge Teaching"],
    seoTitle: "CHF Nursing Care for U.S. RN Students",
    seoDescription: "Manage acute decompensated heart failure: oxygenation, diuresis, daily weights, electrolytes, NGN clinical judgment cues, and patient teaching for the NCLEX-RN.",
    introduction: [
      "Congestive heart failure (CHF) is one of the most common reasons for U.S. hospital admission and one of the most testable nursing topics. The NCLEX-RN frequently includes acute decompensation stems with crackles, dyspnea, and weight gain, plus stable outpatient stems with medication adherence and dietary teaching.",
      "This article focuses on RN priorities across the spectrum: acute pulmonary edema, ongoing diuresis, electrolyte safety, and the discharge plan that prevents readmission.",
    ],
    whyMatters: [
      "Decompensated CHF threatens oxygenation, perfusion, and renal function in hours. The exam expects you to recognize the worsening pattern, apply ordered oxygen and diuresis, and reassess weight and electrolytes.",
      "Outpatient CHF management is mostly nursing teaching. Daily weights, sodium guidance, and medication adherence prevent readmissions, which is the metric many U.S. health systems are evaluated on.",
    ],
    pathophysiology: [
      "Heart failure is a syndrome in which the heart cannot pump or fill effectively. Left-sided systolic or diastolic dysfunction backs pressure into the lungs and reduces forward output. Right-sided failure backs pressure into the venous system and produces dependent edema and abdominal congestion.",
      "Decompensation is triggered by ischemia, dietary indiscretion, missed medications, infection, dysrhythmia, or worsening renal function. Chronic neurohormonal activation drives remodeling, which is why guideline-directed therapy targets the renin-angiotensin and sympathetic systems.",
    ],
    assessmentParas: [
      "Begin with airway, breathing, and circulation. Inspect for orthopnea, paroxysmal nocturnal dyspnea, jugular venous distention, edema, and skin perfusion. Auscultate lungs for crackles and the heart for S3.",
      "Trend daily weights using the same scale at the same time, intake and output, oxygen saturation, blood pressure, and renal function. A 1 kg gain often equals 1 L of fluid retention and is a strong cue for decompensation.",
    ],
    assessmentBullets: [
      "Respiratory rate, work of breathing, oxygen saturation, lung sounds.",
      "Heart rate, rhythm, blood pressure, perfusion.",
      "Daily weight (same scale, same time).",
      "Intake and output trend.",
      "BUN, creatinine, electrolytes (especially potassium and magnesium), BNP or NT-proBNP per facility protocol.",
    ],
    interventionsParas: [
      "Position the dyspneic patient upright. Apply ordered oxygen, monitor work of breathing, and prepare for noninvasive positive pressure ventilation if hypoxemia worsens. Administer ordered IV loop diuretic and reassess urine output, lungs, and weight.",
      "When pulmonary edema is severe, anticipate vasodilator (such as nitroglycerin) per orders, morphine if prescribed for severe distress, and rapid escalation to ICU. Teach energy conservation as the patient stabilizes.",
    ],
    interventionsList: [
      "Position upright, apply ordered oxygen, monitor saturation.",
      "Administer ordered IV loop diuretic (commonly furosemide); reassess urine output and lung sounds.",
      "Monitor electrolytes, especially potassium and magnesium; replace as ordered.",
      "Strict intake and output and daily weight at the same time each day.",
      "Implement guideline-directed therapy as ordered (ACEI/ARB/ARNI, beta-blocker, MRA, SGLT2 inhibitor) and teach adherence.",
    ],
    medicationsParas: [
      "Loop diuretics (furosemide, bumetanide, torsemide) are the workhorse for acute congestion. They can lower potassium and magnesium and worsen renal function if overused. Always reassess electrolytes and renal function.",
      "Guideline-directed medical therapy includes ACEI/ARB/ARNI, evidence-based beta-blockers, mineralocorticoid receptor antagonists, and SGLT2 inhibitors. Each has its own monitoring profile.",
    ],
    medicationsBullets: [
      "Loop diuretic: monitor potassium, magnesium, BUN, creatinine, weight, and hearing for high-dose IV administration.",
      "ACEI/ARB/ARNI: monitor blood pressure, potassium, renal function; teach about cough or angioedema risk.",
      "Beta-blockers (carvedilol, metoprolol succinate, bisoprolol): hold for bradycardia or hypotension per parameters.",
      "MRA (spironolactone, eplerenone): monitor potassium and renal function.",
      "SGLT2 inhibitor (empagliflozin, dapagliflozin): teach about urinary symptoms and volume status.",
    ],
    delegationParas: [
      "Stable CHF patients can have vital signs, weights, intake-output, and ambulation supported by UAP. The RN remains responsible for lung sound assessment, response to diuresis, and education.",
      "An LPN or LVN can give ordered medications within scope and reinforce teaching. Unstable patients with new dyspnea or hypotension stay with the RN.",
    ],
    delegationBullets: [
      "Delegate stable patient turning, feeding, and bathing to UAP.",
      "Have UAP report any weight gain greater than 2 lb in 24 hours promptly.",
      "Use LPN/LVN for ordered med administration within state scope.",
      "Keep assessment, evaluation, and teaching with the RN.",
    ],
    ngnParas: [
      "Recognize cues such as crackles, weight gain, dyspnea, and falling oxygen saturation. Analyze cues by mapping them to volume overload and impaired left ventricular function. Prioritize hypotheses with acute decompensated heart failure.",
      "Generate solutions that include upright positioning, oxygen, IV diuretic, and electrolyte replacement. Take action per orders. Evaluate outcomes by reassessing oxygen saturation, lung sounds, urine output, weight, and blood pressure.",
    ],
    teachingParas: [
      "Teach daily weights using the same scale and time, sodium guidance (commonly 2-3 g sodium per day), fluid limits when ordered, medication purpose and adverse effects, exercise tolerance, and when to call the heart failure clinic or 911.",
      "Reinforce smoking cessation, alcohol moderation, and vaccination updates.",
    ],
    teachingBullets: [
      "Weigh daily after voiding, before breakfast, in similar clothing.",
      "Call the clinic for weight gain greater than 2 lb in 1 day or 5 lb in a week.",
      "Take medications as prescribed; do not skip diuretic doses.",
      "Limit dietary sodium and alcohol; review fluid limit if ordered.",
      "Recognize urgent symptoms: chest pain, severe dyspnea, fainting, new edema.",
    ],
    safetyParas: [
      "Watch for hypotension and renal injury during aggressive diuresis. Reassess electrolytes and adjust supplementation per orders. Falls and orthostasis are common after diuresis or first dose of a new beta-blocker.",
      "Confirm allergies and medication reconciliation, especially when transitioning between care settings.",
    ],
    safetyBullets: [
      "Hold diuretic and notify the provider if blood pressure or renal function worsens significantly.",
      "Use bed alarms and assisted ambulation if orthostasis is present.",
      "Verify hold parameters before each beta-blocker dose.",
      "Reconcile medications at every transition.",
    ],
    commonMistakes: [
      "Withholding ordered diuretic because the patient ate breakfast.",
      "Forgetting to recheck potassium after each diuretic dose.",
      "Confusing pulmonary edema crackles with COPD wheezing on the assessment cue.",
      "Treating new orthopnea as a sleep complaint instead of decompensation.",
      "Skipping daily weight when the scale is in another room.",
    ],
    examReviewPoints: [
      "Daily weight is the most sensitive early sign of decompensation.",
      "Crackles, dyspnea, and weight gain together signal acute pulmonary edema.",
      "Loop diuretic plus electrolyte and renal function monitoring is the core RN action.",
      "Guideline-directed therapy includes ACEI/ARB/ARNI, beta-blocker, MRA, and SGLT2 inhibitor.",
      "Discharge teaching focuses on daily weights, sodium, medication adherence, and warning signs.",
    ],
    keyTakeaways: [
      "CHF nursing care moves from acute decongestion to chronic guideline-directed therapy.",
      "Daily weight is the simplest, most reliable trend.",
      "Reassess electrolytes after every diuretic dose.",
      "Apply U.S. RN scope and call the provider before independent dose changes.",
      "Discharge teaching prevents readmission; use teach-back.",
    ],
    internalLinks: [LK.hf, LK.furosemide, LK.betaBlock, LK.digoxin, LK.aki],
    faqs: [
      { q: "What is the priority assessment in acute decompensated heart failure?", a: "Airway and breathing first; assess oxygenation, lung sounds, work of breathing, and trend response to ordered oxygen and diuretic." },
      { q: "Why does the RN focus on daily weights?", a: "A 1 kg weight gain typically reflects 1 L of fluid retention and is the earliest objective sign of CHF decompensation." },
      { q: "Which medications make up guideline-directed therapy?", a: "ACEI/ARB/ARNI, evidence-based beta-blockers, MRAs, and SGLT2 inhibitors per current AHA/ACC/HFSA heart failure guidelines." },
      { q: "When should a CHF patient call 911?", a: "For chest pain, severe shortness of breath, fainting, or rapidly worsening swelling that is not relieved by rest." },
    ],
    references: [
      "Heidenreich, P. A., Bozkurt, B., Aguilar, D., et al. (2022). 2022 AHA/ACC/HFSA guideline for the management of heart failure. Journal of the American College of Cardiology, 79(17), e263-e421. https://doi.org/10.1016/j.jacc.2021.12.012",
      "American Heart Association. (2024). Heart failure clinical updates. AHA. https://www.heart.org/en/health-topics/heart-failure",
      "Centers for Disease Control and Prevention. (2024). Heart failure facts. CDC. https://www.cdc.gov/heartdisease/heart_failure.htm",
      "American Association of Critical-Care Nurses. (2023). Acute decompensated heart failure care reference. AACN.",
    ],
  },
  // 5
  {
    slug: "copd-nursing-assessment-rn-priorities",
    title: "COPD Nursing Assessment: RN Priorities and NGN Cues",
    excerpt: "A focused COPD nursing assessment for U.S. RN students, including ABG patterns, oxygen targets, exacerbation triggers, and Next Generation NCLEX clinical judgment cues.",
    category: "Respiratory Disorders",
    tags: [...SHARED_TAGS, "COPD", "Pulmonary", "Oxygen", "ABG"],
    seoTitle: "COPD Nursing Assessment for U.S. RNs",
    seoDescription: "Conduct a complete COPD nursing assessment using oxygen targets, ABG cues, exacerbation triggers, and NGN clinical judgment for the NCLEX-RN.",
    introduction: [
      "Chronic obstructive pulmonary disease (COPD) is one of the leading causes of U.S. adult morbidity and a recurring NCLEX-RN topic. The exam tests whether the RN can distinguish stable disease from exacerbation, apply ordered oxygen targets safely, and educate the patient about triggers and inhaler technique.",
      "This article focuses on the assessment that prevents missed exacerbations and supports timely escalation.",
    ],
    whyMatters: [
      "COPD exacerbations are time-sensitive. They reduce gas exchange, increase work of breathing, and risk acute hypercapnic respiratory failure. The RN's assessment is the difference between early bronchodilator therapy and an unplanned ICU transfer.",
      "Outpatient COPD assessment also matters. Inhaler technique, smoking cessation, and vaccination status drive long-term outcomes that the NCLEX-RN now reflects in case-style stems.",
    ],
    pathophysiology: [
      "COPD includes chronic bronchitis (mucus hypersecretion, airway inflammation) and emphysema (alveolar destruction with loss of elastic recoil). Air trapping flattens the diaphragm and increases work of breathing. Chronic ventilation-perfusion mismatch causes hypoxemia and may lead to CO2 retention.",
      "Acute exacerbations are commonly triggered by infection, air pollution, medication nonadherence, or weather changes. Patients may show increased dyspnea, sputum volume or purulence, and altered mental status if hypercapnia worsens.",
    ],
    assessmentParas: [
      "Begin with respiratory rate, work of breathing, oxygen saturation, lung sounds, and use of accessory muscles. Note baseline oxygen needs at home and current settings.",
      "Compare current vital signs and assessment to baseline. A 'normal' saturation may still represent acute decompensation if it is below the patient's usual.",
    ],
    assessmentBullets: [
      "Respiratory rate, depth, work of breathing, accessory muscle use.",
      "Oxygen saturation; verify the ordered target (often 88-92% for chronic CO2 retainers).",
      "Lung sounds: wheezes, diminished breath sounds, prolonged expiration.",
      "Sputum: volume, color, viscosity, change from baseline.",
      "Mental status: altered mentation may signal hypercapnia.",
    ],
    interventionsParas: [
      "Position the patient upright, apply ordered oxygen titrated to the prescribed target, and administer scheduled or rescue bronchodilators. Monitor response and reassess work of breathing.",
      "Anticipate corticosteroids, antibiotics, and noninvasive positive pressure ventilation per orders for exacerbations. Prevent infection by enforcing hand hygiene and timely vaccinations.",
    ],
    interventionsList: [
      "Position upright; assess work of breathing and lung sounds.",
      "Apply ordered oxygen to the target saturation; do not exceed unless ordered.",
      "Administer bronchodilators; reassess after the dose.",
      "Implement antibiotic and corticosteroid orders for exacerbation.",
      "Prepare for noninvasive ventilation when respiratory failure threatens.",
    ],
    medicationsParas: [
      "Short-acting beta agonists (albuterol) and short-acting muscarinic antagonists (ipratropium) are first-line rescue. Long-acting beta agonists, long-acting muscarinic antagonists, and inhaled corticosteroids form maintenance therapy depending on GOLD category.",
      "Systemic steroids (commonly oral prednisone) and antibiotics may be added for acute exacerbations.",
    ],
    medicationsBullets: [
      "Verify inhaler technique on every visit; spacers improve delivery.",
      "Monitor heart rate after beta agonist; tachycardia and tremor are common.",
      "Watch for thrush with inhaled corticosteroids; teach mouth rinsing.",
      "Document steroid taper plan and blood glucose response.",
    ],
    delegationParas: [
      "RNs perform respiratory assessment, oxygen titration, and patient education. UAP can collect vital signs, set up oxygen tubing, and assist ambulation in stable patients.",
      "An LPN or LVN can administer routine medications within scope and reinforce education. Acute exacerbation patients with worsening status remain with the RN.",
    ],
    delegationBullets: [
      "RN assesses lung sounds and titrates oxygen.",
      "Delegate ambulation and hygiene to UAP for stable patients.",
      "LPN/LVN can give ordered inhalers and reinforce teaching.",
      "Notify the RN immediately for any new desaturation or altered mental status.",
    ],
    ngnParas: [
      "Recognize cues including increased dyspnea, increased sputum purulence, falling oxygen saturation, and confusion. Analyze cues by mapping them to airflow obstruction and ventilation-perfusion mismatch. Prioritize hypotheses with COPD exacerbation versus pneumonia, heart failure, or pulmonary embolism.",
      "Generate solutions: oxygen to target, bronchodilators, steroids, antibiotics, and possible noninvasive ventilation. Take action per orders. Evaluate outcomes with repeat saturation, work of breathing, and ABG when ordered.",
    ],
    teachingParas: [
      "Teach pursed-lip and diaphragmatic breathing, energy conservation, smoking cessation, vaccinations (influenza, pneumococcal, COVID-19), and an action plan for exacerbations.",
      "Reinforce inhaler technique with teach-back and use spacers when ordered.",
    ],
    teachingBullets: [
      "Use pursed-lip breathing to reduce airway collapse.",
      "Pace activity and use energy conservation strategies.",
      "Carry rescue inhaler at all times; refill before running out.",
      "Receive seasonal influenza, pneumococcal, and COVID-19 vaccines as recommended.",
      "Quit smoking and avoid exposure to secondhand smoke and air pollution.",
    ],
    safetyParas: [
      "Avoid uncontrolled high-flow oxygen in patients with chronic CO2 retention; use ordered targets. Prevent falls during exertion, monitor for steroid-related glucose changes, and teach safe home oxygen use (no smoking, no open flames).",
      "Watch for hypercapnia signs: drowsiness, headache, asterixis, decreased respiratory rate.",
    ],
    safetyBullets: [
      "Confirm ordered oxygen target before titration.",
      "Use no-smoking signage with home oxygen.",
      "Monitor blood glucose during steroid courses.",
      "Reassess after each intervention.",
    ],
    commonMistakes: [
      "Withholding oxygen from a hypoxic COPD patient.",
      "Failing to verify inhaler technique.",
      "Ignoring confusion as a respiratory cue.",
      "Treating wheeze as the only indicator of severity.",
      "Forgetting to teach action plan for exacerbations.",
    ],
    examReviewPoints: [
      "Use the ordered oxygen target; common range 88-92% for chronic CO2 retainers.",
      "Pursed-lip and diaphragmatic breathing reduce airway collapse.",
      "Trend mental status to detect hypercapnia.",
      "Prevent exacerbations with smoking cessation and vaccines.",
      "Use action plan and rescue inhaler at the first sign of worsening.",
    ],
    keyTakeaways: [
      "COPD nursing assessment focuses on baseline comparison and trend.",
      "Apply ordered oxygen targets; do not exceed without orders.",
      "Use bronchodilators, steroids, and antibiotics per orders for exacerbation.",
      "Teach pursed-lip breathing, vaccines, smoking cessation, and inhaler technique.",
      "Escalate quickly when mental status changes.",
    ],
    internalLinks: [LK.copd, LK.asthma, LK.respAcid, LK.pe, LK.hf],
    faqs: [
      { q: "Why are COPD oxygen targets often 88-92%?", a: "Because some patients with chronic CO2 retention can experience worsening hypercapnia with high-flow oxygen, ordered targets balance hypoxemia and ventilation drive." },
      { q: "What is the priority RN action in a COPD exacerbation?", a: "Assess airway and breathing, position upright, titrate ordered oxygen to target, administer bronchodilators, and reassess." },
      { q: "Which vaccines should COPD patients receive?", a: "Annual influenza, pneumococcal vaccines per CDC schedule, COVID-19 vaccines as recommended, and Tdap as appropriate." },
      { q: "Is a wheeze always present in COPD exacerbation?", a: "No; severe airflow limitation can produce a 'silent chest' that signals critical worsening and requires immediate escalation." },
    ],
    references: [
      "Global Initiative for Chronic Obstructive Lung Disease. (2024). Global strategy for the diagnosis, management, and prevention of COPD: 2024 report. https://goldcopd.org/",
      "Centers for Disease Control and Prevention. (2024). COPD: Basics about COPD. CDC. https://www.cdc.gov/copd/basics-about.html",
      "American Lung Association. (2024). Living with COPD. ALA. https://www.lung.org/lung-health-diseases/lung-disease-lookup/copd",
      "American Association of Critical-Care Nurses. (2023). Respiratory care reference for nurses. AACN.",
    ],
  },
];

// ============================================================================
// The remaining 35 specs are appended in the second half of this file.
// ============================================================================
import { appendRemainingPosts } from "./generate-nclex-rn-us-longtail-batch-40-data.mts";
appendRemainingPosts(POSTS, LK, SHARED_TAGS, NGN_STEPS_SENTENCE);

// ----------------------------------------------------------------------------
// Render and write
// ----------------------------------------------------------------------------
function ensureDir(p: string): void {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function countWords(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function bodyOnly(md: string): string {
  const fmEnd = md.indexOf("\n---", md.indexOf("---") + 3);
  return md.slice(fmEnd + 4);
}

function main(): void {
  ensureDir(OUT_DIR);
  ensureDir(join(APP_ROOT, "reports"));

  const existing = new Set(
    readdirSync(OUT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, "")),
  );

  if (POSTS.length !== 40) {
    throw new Error(`Expected 40 specs, found ${POSTS.length}`);
  }
  const slugCheck = new Set<string>();
  const reportRows: string[] = [];
  reportRows.push("# NCLEX-RN U.S. Long-Tail Batch (40 posts)");
  reportRows.push("");
  reportRows.push(`Generated: ${new Date().toISOString()}`);
  reportRows.push("Output dir: src/content/blog-static-longtail/");
  reportRows.push("");
  reportRows.push("## Posts");
  reportRows.push("");
  reportRows.push("| # | Title | Slug | Words (body) | Frontmatter complete | Internal links | Status |");
  reportRows.push("|---|-------|------|--------------|----------------------|----------------|--------|");

  let i = 0;
  for (const spec of POSTS) {
    i += 1;
    if (slugCheck.has(spec.slug)) {
      throw new Error(`Duplicate slug in batch: ${spec.slug}`);
    }
    slugCheck.add(spec.slug);
    if (existing.has(spec.slug)) {
      throw new Error(
        `Slug collision with existing long-tail file: ${spec.slug}.md (rename to avoid DB-wins-on-collision risk)`,
      );
    }

    const md = render(spec);
    const file = join(OUT_DIR, `${spec.slug}.md`);
    writeFileSync(file, md, "utf8");
    const wc = countWords(bodyOnly(md));
    const fmComplete =
      Boolean(spec.title) &&
      Boolean(spec.slug) &&
      Boolean(spec.excerpt) &&
      Boolean(spec.category) &&
      spec.tags.length > 0 &&
      Boolean(spec.seoTitle) &&
      Boolean(spec.seoDescription);
    const linkCount = spec.internalLinks.length + 7;
    const status = wc >= 1600 && fmComplete ? "OK" : "REVIEW";
    reportRows.push(
      `| ${i} | ${spec.title.replace(/\|/g, "\\|")} | ${spec.slug} | ${wc} | ${fmComplete ? "yes" : "NO"} | ${linkCount} | ${status} |`,
    );
  }

  reportRows.push("");
  reportRows.push("## Validation gates (run after this script)");
  reportRows.push("");
  reportRows.push("- npm run validate:blog-static-longtail");
  reportRows.push("- npm run diagnose:blog-slug-collisions -- --write-report");
  reportRows.push("- npm run typecheck:critical");
  reportRows.push("- npm run test:blog-recovery");
  reportRows.push("- npm run test:homepage");

  writeFileSync(REPORT_PATH, reportRows.join("\n") + "\n", "utf8");
  console.log(`Wrote ${POSTS.length} posts to ${OUT_DIR}`);
  console.log(`Wrote report to ${REPORT_PATH}`);
}

main();
