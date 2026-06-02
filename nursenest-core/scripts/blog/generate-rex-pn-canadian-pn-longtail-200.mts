#!/usr/bin/env npx tsx
/**
 * Deterministic generator for 200 additional REx-PN Canadian Practical Nurse long-tail posts.
 *
 * Run:
 *   npx tsx scripts/blog/generate-rex-pn-canadian-pn-longtail-200.mts
 *   npx tsx scripts/blog/generate-rex-pn-canadian-pn-longtail-200.mts --dry-run
 *   npx tsx scripts/blog/generate-rex-pn-canadian-pn-longtail-200.mts --verify-only
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

type RexPnAnchor = {
  slugBase: string;
  titleCore: string;
  category: string;
  searchIntent: string;
  clinicalFrame: string;
  bedsideExample: string;
  safetyPriority: string;
  examTrap: string;
  relatedBlog: { href: string; label: string };
  tags: readonly string[];
};

type RexPnVariant = {
  slugSuffix: string;
  titleSuffix: string;
  lens: string;
  cta: string;
};

const PUBLISHED_AT = "2026-05-27";
const UPDATED_AT = "2026-05-27";
const MIN_WORDS = 850;
const EXPECTED_COUNT = 208;

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

const VARIANTS: readonly RexPnVariant[] = [
  {
    slugSuffix: "exam-strategy-guide",
    titleSuffix: "REx-PN Exam Strategy Guide",
    lens: "how this topic appears in adaptive REx-PN-style exam stems and what the safest first action usually tests",
    cta: "Use timed practice after reading so the priority pattern becomes automatic.",
  },
  {
    slugSuffix: "clinical-judgment-breakdown",
    titleSuffix: "Clinical Judgment Breakdown",
    lens: "cue recognition, stable versus unstable thinking, and practical nursing scope boundaries",
    cta: "Pair this guide with case-style questions and write one-sentence rationales for every miss.",
  },
  {
    slugSuffix: "common-mistakes",
    titleSuffix: "Common Mistakes and How to Avoid Them",
    lens: "the distractors that feel reasonable but delay safety, documentation, teaching, or escalation",
    cta: "Review missed rationales in NurseNest and tag the mistake as content, scope, priority, or wording.",
  },
  {
    slugSuffix: "practice-question-review",
    titleSuffix: "Practice Question Review",
    lens: "how to read the stem, eliminate unsafe options, and choose the best next practical nursing action",
    cta: "Answer a short REx-PN practice set immediately after reading.",
  },
  {
    slugSuffix: "flashcard-review",
    titleSuffix: "Flashcard Review Plan",
    lens: "the high-yield cues, medication warnings, and teaching points worth converting into spaced repetition",
    cta: "Turn each red flag and scope rule into a flashcard, then review again in 24 to 72 hours.",
  },
  {
    slugSuffix: "new-grad-transition",
    titleSuffix: "New Grad Transition Guide",
    lens: "how exam thinking transfers into shift organization, communication, and early-career practical nursing habits",
    cta: "Use this as a bridge between exam prep and first-year practice.",
  },
  {
    slugSuffix: "case-study-thinking",
    titleSuffix: "Case Study Thinking",
    lens: "how to follow evolving vitals, notes, orders, reassessments, and changing urgency across a mini case",
    cta: "Practise explaining how the priority changes as new cues appear.",
  },
  {
    slugSuffix: "study-schedule",
    titleSuffix: "Study Schedule and Review Plan",
    lens: "how to fit this topic into weekly REx-PN review without passive rereading or last-minute cramming",
    cta: "Schedule this topic with flashcards, one lesson review, and one mixed practice block.",
  },
];

const ANCHORS: readonly RexPnAnchor[] = [
  {
    slugBase: "pass-rex-pn-first-attempt-canada",
    titleCore: "How to pass the REx-PN on your first attempt in Canada",
    category: "REx-PN Exam Prep",
    searchIntent: "passing the REx-PN",
    clinicalFrame: "A strong REx-PN plan blends Canadian practical nursing scope, adaptive test stamina, clinical judgment, and frequent rationale review.",
    bedsideExample: "A learner can define sepsis but misses the item because they do not connect new confusion, tachypnea, hypotension, and infection risk as one unsafe pattern.",
    safetyPriority: "Prioritize the response that protects the client now, closes the communication loop, and stays within practical nursing scope.",
    examTrap: "Cramming isolated facts without practising why tempting options are unsafe.",
    relatedBlog: { href: "/blog/cpnre-cnple-pass-cpnre-first-attempt-canada-clinical-judgment-guide", label: "CPNRE first-attempt clinical judgment guide" },
    tags: ["REx-PN", "Exam preparation", "Canadian practical nursing", "Study plan"],
  },
  {
    slugBase: "cat-adaptive-testing-rex-pn",
    titleCore: "How the REx-PN CAT exam adapts to your performance",
    category: "REx-PN Exam Prep",
    searchIntent: "REx-PN CAT testing explained",
    clinicalFrame: "Adaptive testing estimates ability by changing item difficulty, so steady safe decisions matter more than guessing whether an item felt easy or hard.",
    bedsideExample: "A respiratory item may begin with COPD teaching and then become harder by adding accessory muscle use, falling oxygen saturation, and escalation wording.",
    safetyPriority: "Treat every adaptive item as a patient-safety decision, not a clue about whether you are passing.",
    examTrap: "Panicking when questions feel difficult instead of staying consistent with prioritization logic.",
    relatedBlog: { href: "/blog/cpnre-cnple-cat-exam-adaptive-testing-cpnre-clinical-judgment-guide", label: "CAT exam adaptive testing for PN learners" },
    tags: ["CAT exam", "Adaptive testing", "REx-PN", "Exam strategy"],
  },
  {
    slugBase: "rex-pn-study-schedule-working-students",
    titleCore: "The best REx-PN study schedule for working practical nursing students",
    category: "Nursing School + Student Success",
    searchIntent: "REx-PN study schedule while working",
    clinicalFrame: "Working students need short high-quality review cycles: learn the concept, answer questions, explain rationales, and revisit weak cues with spaced repetition.",
    bedsideExample: "A student who studies 30 minutes after a shift can still build clinical judgment by reviewing one topic, five flashcards, and ten mixed questions.",
    safetyPriority: "Consistency protects learning better than exhaustion-based cramming.",
    examTrap: "Reading for hours without retrieval practice or mixed question exposure.",
    relatedBlog: { href: "/blog/cpnre-cnple-nursing-study-schedule-cpnre-study-plan", label: "CPNRE nursing study schedule" },
    tags: ["Study schedule", "Working students", "REx-PN", "Practical nursing"],
  },
  {
    slugBase: "rex-pn-sata-questions",
    titleCore: "How to answer SATA questions on the REx-PN",
    category: "REx-PN Exam Prep",
    searchIntent: "REx-PN SATA questions",
    clinicalFrame: "SATA questions test each option independently for indication, safety, scope, and timing rather than rewarding answer-count patterns.",
    bedsideExample: "A hypoglycemia item may include carbohydrate treatment, repeat glucose check, holding insulin, documenting response, and escalation if symptoms persist.",
    safetyPriority: "Select options that are safe and indicated for the exact client in the stem.",
    examTrap: "Selecting all caring-sounding actions even when one delays urgent assessment or exceeds scope.",
    relatedBlog: { href: "/blog/cpnre-cnple-sata-questions-practical-nursing-clinical-judgment-guide", label: "SATA strategy for practical nursing exams" },
    tags: ["SATA", "REx-PN", "Question strategy", "Clinical judgment"],
  },
  {
    slugBase: "abcs-maslow-rex-pn-prioritization",
    titleCore: "ABCs versus Maslow for REx-PN prioritization questions",
    category: "Clinical Judgment",
    searchIntent: "ABCs vs Maslow nursing prioritization",
    clinicalFrame: "Frameworks help only when they are applied to the patient trajectory in the stem, especially acute change from baseline.",
    bedsideExample: "A client with new shortness of breath and cyanosis outranks a client needing routine teaching, even if teaching matters later.",
    safetyPriority: "Scan airway, breathing, circulation, neurologic change, bleeding, hypoglycemia, and suicide risk before comfort-only needs.",
    examTrap: "Choosing the framework name instead of the safest first nursing action.",
    relatedBlog: { href: "/blog/cpnre-cnple-abcs-vs-maslow-nursing-prioritization-clinical-judgment-guide", label: "ABCs versus Maslow for PN prioritization" },
    tags: ["ABCs", "Maslow", "Prioritization", "REx-PN"],
  },
  {
    slugBase: "stable-unstable-patient-rex-pn",
    titleCore: "Stable versus unstable patients on REx-PN questions",
    category: "Clinical Judgment",
    searchIntent: "stable vs unstable REx-PN questions",
    clinicalFrame: "Many REx-PN items hinge on whether the patient is predictable, improving, newly deteriorating, or unsafe to delegate.",
    bedsideExample: "An older adult with new confusion, tachypnea, and low blood pressure is not a routine dementia presentation.",
    safetyPriority: "New or worsening findings require assessment, communication, and reassessment.",
    examTrap: "Letting a chronic diagnosis hide acute instability.",
    relatedBlog: { href: "/blog/cpnre-cnple-unstable-vs-stable-patient-cpnre-clinical-judgment-guide", label: "Stable versus unstable patient review" },
    tags: ["Unstable patient", "Acuity", "Prioritization", "Clinical judgment"],
  },
  {
    slugBase: "delegation-ucp-rex-pn",
    titleCore: "Delegation and UCP questions on the REx-PN",
    category: "Clinical Judgment",
    searchIntent: "REx-PN delegation UCP questions",
    clinicalFrame: "Delegation items test stability, predictability, task clarity, follow-up, and accountability within Canadian practical nursing practice.",
    bedsideExample: "A UCP may help a stable client ambulate, but cannot assess new chest pain or decide whether respiratory distress is improving.",
    safetyPriority: "Delegate tasks, never nursing judgment.",
    examTrap: "Choosing the efficient answer that removes supervision or reassessment.",
    relatedBlog: { href: "/blog/cpnre-cnple-delegation-ucp-rpn-exam-questions-clinical-judgment-guide", label: "Delegation to UCPs for Canadian PN exams" },
    tags: ["Delegation", "UCP", "RPN scope", "REx-PN"],
  },
  {
    slugBase: "medication-safety-rex-pn",
    titleCore: "Medication safety principles every REx-PN learner should know",
    category: "Pharmacology",
    searchIntent: "REx-PN medication safety",
    clinicalFrame: "Medication safety questions combine rights of administration, allergies, unclear orders, high-alert medications, adverse effects, and patient teaching.",
    bedsideExample: "A scheduled opioid is due, but the client is difficult to rouse and has RR 8/min, so assessment and escalation come before administration.",
    safetyPriority: "Hold and clarify unsafe or unclear medication situations according to policy and scope.",
    examTrap: "Giving a medication because it is due despite unsafe assessment findings.",
    relatedBlog: { href: "/blog/cpnre-cnple-opioid-respiratory-depression-rpn-clinical-judgment-guide", label: "Opioid respiratory depression cues" },
    tags: ["Medication safety", "Pharmacology", "High-alert medications", "REx-PN"],
  },
  {
    slugBase: "insulin-hypoglycemia-rex-pn",
    titleCore: "Insulin and hypoglycemia questions on the REx-PN",
    category: "Pharmacology",
    searchIntent: "REx-PN insulin hypoglycemia",
    clinicalFrame: "Insulin items test timing with meals, glucose values, symptoms, safe swallowing, repeat checks, and when to report.",
    bedsideExample: "A sweaty confused client with glucose 3.0 mmol/L needs immediate hypoglycemia treatment if safe to swallow and reassessment.",
    safetyPriority: "Hypoglycemia is an immediate neurologic safety risk.",
    examTrap: "Administering scheduled insulin because it is ordered while the client is already low.",
    relatedBlog: { href: "/blog/cpnre-cnple-diabetes-hypoglycemia-insulin-safety-cpnre-clinical-judgment-guide", label: "Diabetes, hypoglycemia, and insulin safety" },
    tags: ["Insulin", "Hypoglycemia", "Diabetes", "Medication safety"],
  },
  {
    slugBase: "anticoagulants-warfarin-rex-pn",
    titleCore: "Warfarin and anticoagulant monitoring for REx-PN prep",
    category: "Pharmacology",
    searchIntent: "REx-PN warfarin anticoagulant monitoring",
    clinicalFrame: "Anticoagulant questions test bleeding cues, INR context, falls risk, interactions, teaching, and documentation.",
    bedsideExample: "Black stool, dizziness, bruising, and an elevated INR require urgent communication, not routine diet teaching alone.",
    safetyPriority: "Bleeding risk can become life-threatening quickly.",
    examTrap: "Focusing on vitamin K teaching while missing active bleeding cues.",
    relatedBlog: { href: "/blog/cpnre-cnple-warfarin-anticoagulant-monitoring-nursing-students-clinical-judgment-guide", label: "Warfarin monitoring for nursing students" },
    tags: ["Warfarin", "Anticoagulants", "INR", "REx-PN"],
  },
  {
    slugBase: "copd-oxygen-safety-rex-pn",
    titleCore: "COPD and oxygen safety priorities for REx-PN prep",
    category: "Medical-Surgical Nursing",
    searchIntent: "REx-PN COPD oxygen safety",
    clinicalFrame: "COPD items test work of breathing, oxygen saturation trends, infection triggers, inhaler teaching, activity tolerance, and escalation.",
    bedsideExample: "A client with accessory muscle use, audible wheeze, and falling oxygen saturation needs positioning, assessment, and timely reporting.",
    safetyPriority: "Visible respiratory distress outranks routine teaching or documentation.",
    examTrap: "Treating chronic COPD as automatically stable.",
    relatedBlog: { href: "/blog/rex-pn-rpn-copd-oxygen-safety-canada-rex-pn-ngn-item-thinking", label: "COPD oxygen safety NGN-style thinking" },
    tags: ["COPD", "Oxygen safety", "Respiratory nursing", "REx-PN"],
  },
  {
    slugBase: "heart-failure-rex-pn",
    titleCore: "Heart failure nursing priorities for the REx-PN",
    category: "Medical-Surgical Nursing",
    searchIntent: "REx-PN heart failure nursing priorities",
    clinicalFrame: "Heart failure items reward trend recognition: daily weights, edema, crackles, orthopnea, medication adherence, and fluid teaching.",
    bedsideExample: "A sudden weight gain with new shortness of breath and crackles should trigger assessment and communication.",
    safetyPriority: "Fluid overload can progress to respiratory distress.",
    examTrap: "Teaching diet while missing decompensation.",
    relatedBlog: { href: "/blog/rex-pn-rpn-heart-failure-daily-weights-canada-home-community-nursing-canada", label: "Heart failure daily weights and fluid teaching" },
    tags: ["Heart failure", "Daily weights", "Fluid balance", "Med-Surg"],
  },
  {
    slugBase: "sepsis-recognition-rex-pn",
    titleCore: "Recognizing early sepsis on REx-PN-style questions",
    category: "Medical-Surgical Nursing",
    searchIntent: "REx-PN sepsis recognition",
    clinicalFrame: "Sepsis questions test deterioration patterns such as infection plus tachypnea, hypotension, altered mental status, fever or hypothermia, and poor perfusion.",
    bedsideExample: "An older adult with a suspected UTI, new confusion, RR 24/min, and low blood pressure requires urgent escalation.",
    safetyPriority: "Early recognition prevents failure-to-rescue.",
    examTrap: "Waiting for a high fever before treating the pattern as urgent.",
    relatedBlog: { href: "/blog/sepsis-pathophysiology-early-nursing-recognition", label: "Sepsis recognition and early nursing priorities" },
    tags: ["Sepsis", "Deterioration", "Patient safety", "REx-PN"],
  },
  {
    slugBase: "stroke-fast-rex-pn",
    titleCore: "Stroke recognition and FAST cues for REx-PN learners",
    category: "Medical-Surgical Nursing",
    searchIntent: "REx-PN stroke FAST last known well",
    clinicalFrame: "Stroke items test sudden focal deficits, last-known-well time, glucose check, swallow safety, and urgent reporting.",
    bedsideExample: "New slurred speech and arm drift during morning care require urgent communication and objective documentation.",
    safetyPriority: "Do not give oral fluids until swallow safety is addressed.",
    examTrap: "Calling sudden neurologic change fatigue or confusion without escalation.",
    relatedBlog: { href: "/blog/cpnre-cnple-stroke-fast-last-known-well-rpn-clinical-judgment-guide", label: "Stroke recognition for RPN learners" },
    tags: ["Stroke", "FAST", "Neurologic assessment", "REx-PN"],
  },
  {
    slugBase: "infection-control-ppe-rex-pn",
    titleCore: "Infection control, PPE, and IPAC for the REx-PN",
    category: "Fundamentals",
    searchIntent: "REx-PN infection control PPE IPAC",
    clinicalFrame: "IPAC questions connect routine practices, additional precautions, hand hygiene, PPE sequence, sharps safety, and outbreak communication.",
    bedsideExample: "A C. difficile scenario should make you think contact precautions and soap-and-water hand hygiene after care.",
    safetyPriority: "Protect the client, staff, other learners, and the unit population.",
    examTrap: "Assuming gloves replace hand hygiene.",
    relatedBlog: { href: "/blog/cpnre-cnple-infection-control-ipac-cpnre-clinical-judgment-guide", label: "Infection control and IPAC for PN exams" },
    tags: ["IPAC", "PPE", "Infection control", "Fundamentals"],
  },
  {
    slugBase: "documentation-communication-rex-pn",
    titleCore: "Documentation and communication questions on the REx-PN",
    category: "Fundamentals",
    searchIntent: "REx-PN documentation communication",
    clinicalFrame: "Documentation questions test objective charting, clear timelines, follow-up, professional wording, and SBAR-style escalation.",
    bedsideExample: "Charting objective refusal, teaching, notification, and reassessment is stronger than writing that a client was difficult.",
    safetyPriority: "Documentation should show assessment, action, communication, and response.",
    examTrap: "Using judgmental language or charting care before it happens.",
    relatedBlog: { href: "/blog/cpnre-cnple-documentation-charting-cpnre-clinical-judgment-guide", label: "Documentation and charting for CPNRE-style questions" },
    tags: ["Documentation", "SBAR", "Communication", "Legal nursing"],
  },
  {
    slugBase: "mobility-falls-safety-rex-pn",
    titleCore: "Mobility, falls prevention, and patient safety for REx-PN prep",
    category: "Fundamentals",
    searchIntent: "REx-PN falls prevention mobility safety",
    clinicalFrame: "Falls questions test risk factors, environment, toileting, assistive devices, medications, orthostatic hypotension, and reassessment.",
    bedsideExample: "A dizzy older adult starting an antihypertensive needs assistance, orthostatic assessment if ordered or within policy, and fall-prevention planning.",
    safetyPriority: "Prevent predictable harm while preserving mobility and dignity.",
    examTrap: "Restricting mobility unnecessarily instead of matching support to risk.",
    relatedBlog: { href: "/blog/fall-prevention-nursing-interventions", label: "Fall prevention nursing interventions" },
    tags: ["Falls prevention", "Mobility", "Patient safety", "Fundamentals"],
  },
  {
    slugBase: "therapeutic-communication-rex-pn",
    titleCore: "Therapeutic communication examples for REx-PN questions",
    category: "Mental Health Nursing",
    searchIntent: "REx-PN therapeutic communication examples",
    clinicalFrame: "Communication questions test empathy, boundaries, safety, trauma-informed pacing, cultural humility, and avoiding false reassurance.",
    bedsideExample: "A client who says they might harm themselves needs direct safety assessment and escalation, not vague reassurance.",
    safetyPriority: "Therapeutic communication includes risk recognition.",
    examTrap: "Choosing the nicest-sounding answer that avoids the safety issue.",
    relatedBlog: { href: "/blog/cpnre-cnple-therapeutic-communication-cpnre-clinical-judgment-guide", label: "Therapeutic communication for CPNRE-style questions" },
    tags: ["Therapeutic communication", "Mental health", "Safety", "REx-PN"],
  },
  {
    slugBase: "suicide-precautions-rex-pn",
    titleCore: "Suicide precautions and crisis safety for REx-PN prep",
    category: "Mental Health Nursing",
    searchIntent: "REx-PN suicide precautions",
    clinicalFrame: "Suicide-risk items test direct questioning, environment safety, observation, escalation, documentation, and team communication.",
    bedsideExample: "A client with a plan and access to means requires immediate safety action and notification through the care team.",
    safetyPriority: "Imminent safety risk outranks privacy or routine workflow.",
    examTrap: "Avoiding direct questions because they feel uncomfortable.",
    relatedBlog: { href: "/blog/cpnre-cnple-suicide-precautions-practical-nursing-clinical-judgment-guide", label: "Suicide precautions for practical nursing students" },
    tags: ["Suicide precautions", "Mental health", "Crisis intervention", "Safety"],
  },
  {
    slugBase: "postpartum-care-rex-pn",
    titleCore: "Postpartum care priorities for REx-PN practical nursing prep",
    category: "Maternity + Pediatrics",
    searchIntent: "REx-PN postpartum care priorities",
    clinicalFrame: "Postpartum items test bleeding, fundal tone, bladder distention, pain, infection cues, newborn safety, breastfeeding support, and escalation.",
    bedsideExample: "Heavy bleeding with a boggy uterus is a safety priority, not a routine teaching moment.",
    safetyPriority: "Hemorrhage and infection cues require prompt assessment and reporting.",
    examTrap: "Choosing newborn teaching while missing maternal deterioration.",
    relatedBlog: { href: "/blog/cpnre-cnple-postpartum-hemorrhage-rpn-priorities-clinical-judgment-guide", label: "Postpartum hemorrhage RPN priorities" },
    tags: ["Postpartum", "Maternity", "Hemorrhage", "REx-PN"],
  },
  {
    slugBase: "pediatric-respiratory-distress-rex-pn",
    titleCore: "Pediatric respiratory distress cues for REx-PN prep",
    category: "Maternity + Pediatrics",
    searchIntent: "REx-PN pediatric respiratory distress",
    clinicalFrame: "Pediatric respiratory items test work of breathing, retractions, nasal flaring, hydration, caregiver report, oxygen saturation trends, and escalation.",
    bedsideExample: "A child with increased work of breathing and decreased feeding is more concerning than mild cough alone.",
    safetyPriority: "Children can deteriorate quickly when respiratory effort increases.",
    examTrap: "Reassuring because the child is still awake while missing fatigue and worsening effort.",
    relatedBlog: { href: "/blog/cpnre-cnple-pediatric-respiratory-distress-rpn-clinical-judgment-guide", label: "Pediatric respiratory distress for RPN learners" },
    tags: ["Pediatrics", "Respiratory distress", "REx-PN", "Safety"],
  },
  {
    slugBase: "clinical-placement-success-rex-pn",
    titleCore: "Clinical placement success for practical nursing students preparing for REx-PN",
    category: "Nursing School + Student Success",
    searchIntent: "practical nursing clinical placement success",
    clinicalFrame: "Clinical placement builds the same habits the REx-PN tests: preparation, safe communication, timely reporting, documentation, and reflective learning.",
    bedsideExample: "A student who notices a new abnormal vital sign and reports it clearly is practising exam-level clinical judgment in real time.",
    safetyPriority: "Ask for supervision before acting beyond your competence or student role.",
    examTrap: "Thinking clinical success is only about skills instead of judgment and communication.",
    relatedBlog: { href: "/blog/cpnre-cnple-clinical-placement-success-practical-nursing-clinical-judgment-guide", label: "Clinical placement success for practical nursing" },
    tags: ["Clinical placement", "Nursing school", "Student success", "REx-PN"],
  },
  {
    slugBase: "exam-anxiety-rex-pn",
    titleCore: "REx-PN exam anxiety strategies that protect clinical judgment",
    category: "Nursing School + Student Success",
    searchIntent: "REx-PN exam anxiety",
    clinicalFrame: "Anxiety management matters because panic can make learners abandon safe frameworks they already know.",
    bedsideExample: "A learner sees a long case stem, rushes to answer, and misses the one vital sign that changes priority.",
    safetyPriority: "Use calm routines that preserve reading accuracy and patient-safety thinking.",
    examTrap: "Mistaking anxiety for lack of knowledge and changing answers without evidence.",
    relatedBlog: { href: "/blog/cpnre-cnple-exam-anxiety-cpnre-practical-nursing-clinical-judgment-guide", label: "CPNRE exam anxiety strategies" },
    tags: ["Exam anxiety", "REx-PN", "Study strategy", "Student success"],
  },
  {
    slugBase: "new-grad-practical-nurse-first-job",
    titleCore: "New grad practical nurse first job survival guide",
    category: "New Grad Practical Nursing",
    searchIntent: "new grad practical nurse first job",
    clinicalFrame: "First-year practice rewards the same habits as exam prep: recognize deterioration, ask for help early, document clearly, and organize the shift around safety.",
    bedsideExample: "A new grad notices an unexpected change in mobility and appetite and reports it before the patient falls or declines further.",
    safetyPriority: "Escalation is a professional safety behaviour, not a sign of weakness.",
    examTrap: "Trying to prove independence by delaying help.",
    relatedBlog: { href: "/blog/cpnre-cnple-new-grad-rpn-first-job-survival-clinical-judgment-guide", label: "New grad RPN first job survival" },
    tags: ["New grad", "RPN", "Transition to practice", "Clinical judgment"],
  },
  {
    slugBase: "shift-organization-rpn-rex-pn",
    titleCore: "Shift organization habits for RPN learners and new graduates",
    category: "New Grad Practical Nursing",
    searchIntent: "RPN shift organization",
    clinicalFrame: "Shift organization connects assessment priorities, medication timing, documentation, delegation, reassessment, and communication.",
    bedsideExample: "A safe shift plan clusters routine care but leaves room for new pain, abnormal vitals, and family concerns that change priority.",
    safetyPriority: "Organize around risk first, then efficiency.",
    examTrap: "Choosing task completion over assessment when the client is changing.",
    relatedBlog: { href: "/blog/cpnre-cnple-shift-organization-new-rpn-clinical-judgment-guide", label: "Shift organization for new RPNs" },
    tags: ["Shift organization", "New grad", "RPN", "Time management"],
  },
  {
    slugBase: "burnout-prevention-practical-nursing-rex-pn",
    titleCore: "Burnout prevention for practical nursing students and new grads",
    category: "New Grad Practical Nursing",
    searchIntent: "practical nursing burnout prevention",
    clinicalFrame: "Burnout prevention supports patient safety because fatigue affects attention, medication checks, communication, and learning retention.",
    bedsideExample: "A student balancing work and placement needs realistic recovery blocks, not a study plan built on chronic sleep loss.",
    safetyPriority: "Sustainable routines protect both learner performance and patient care.",
    examTrap: "Treating burnout as a motivation problem instead of a workload and recovery problem.",
    relatedBlog: { href: "/blog/cpnre-cnple-burnout-prevention-practical-nurses-clinical-judgment-guide", label: "Burnout prevention for practical nurses" },
    tags: ["Burnout", "New grad", "Student success", "Wellbeing"],
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraph(...chunks: string[]): string {
  return chunks.map((chunk) => `<p>${escapeHtml(chunk)}</p>`).join("\n");
}

function h2(title: string, body: string): string {
  return `<h2>${escapeHtml(title)}</h2>\n${body.trim()}\n`;
}

function buildExcerpt(anchor: RexPnAnchor, variant: RexPnVariant): string {
  const excerpt = `${anchor.titleCore} for Canadian REx-PN practical nursing prep: ${variant.lens}, patient safety, clinical judgment, and exam-ready reasoning.`;
  return excerpt.length > 320 ? `${excerpt.slice(0, 317).trim()}...` : excerpt;
}

function seoTitle(title: string): string {
  return title.length <= 62 ? title : `${title.slice(0, 59).trim()}...`;
}

function seoDescription(excerpt: string): string {
  return excerpt.length <= 165 ? excerpt : `${excerpt.slice(0, 162).trim()}...`;
}

function tagsJson(anchor: RexPnAnchor, variant: RexPnVariant): string {
  return JSON.stringify(
    Array.from(
      new Set([
        ...anchor.tags,
        "REx-PN",
        "Canadian Practical Nurse",
        "RPN Canada",
        "Nursing school",
        "Clinical judgment",
        variant.titleSuffix,
      ]),
    ),
  );
}

function buildFrontmatter(input: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
}): string {
  return `---
slug: ${input.slug}
title: ${JSON.stringify(input.title)}
excerpt: ${JSON.stringify(input.excerpt)}
category: ${JSON.stringify(input.category)}
tags: ${input.tags}
publishedAt: ${PUBLISHED_AT}
updatedAt: ${UPDATED_AT}
seoTitle: ${JSON.stringify(input.seoTitle)}
seoDescription: ${JSON.stringify(input.seoDescription)}
canonicalUrl: /blog/${input.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports Canadian REx-PN practical nursing exam preparation and clinical reasoning practice. It is educational content and not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and Canadian regulatory standards in real patient care.
---

`;
}

function internalLinks(anchor: RexPnAnchor): string {
  return `<ul>
  <li><a href="/canada/pn/nclex-pn">Canadian PN/RPN exam hub</a> — start from the pathway page for lessons, flashcards, and practice questions.</li>
  <li><a href="/app/flashcards">Flashcards</a> — reinforce high-yield cues, medication warnings, and scope boundaries.</li>
  <li><a href="/app/practice-tests">Practice exams</a> — apply this topic in timed REx-PN-style questions.</li>
  <li><a href="/app/lessons">Lessons</a> — review the underlying nursing concepts before returning to questions.</li>
  <li><a href="${anchor.relatedBlog.href}">${escapeHtml(anchor.relatedBlog.label)}</a></li>
</ul>`;
}

function faq(anchor: RexPnAnchor): string {
  return `<h3>Is ${escapeHtml(anchor.titleCore.toLowerCase())} tested as recall or clinical judgment?</h3>
<p>Both can appear, but strong REx-PN preparation should move beyond recall. The exam is more likely to reward cue recognition, safest-first action, scope awareness, and follow-up than isolated definitions.</p>
<h3>How should I study this topic efficiently?</h3>
<p>Read one focused explanation, answer a short set of questions, then review every rationale by naming the cue, priority, scope boundary, or wording trap you missed.</p>
<h3>How does this connect to practical nursing practice in Canada?</h3>
<p>The same thinking applies at the bedside: recognize change, protect immediate safety, communicate clearly, document objectively, and reassess according to orders, policy, and provincial expectations.</p>`;
}

function buildBody(slug: string, anchor: RexPnAnchor, variant: RexPnVariant): string {
  const overview = paragraph(
    `${anchor.titleCore} matters because the REx-PN is not simply asking whether you remember a term. It is testing whether you can recognize risk, choose a practical nursing action that fits Canadian scope, communicate safely, and reassess the client when conditions change.`,
    `${anchor.clinicalFrame} This article focuses on ${variant.lens}. It is written for practical nursing students, RPN learners, repeat writers, and early-career nurses who want exam prep that also improves bedside judgment.`,
  );

  const why = paragraph(
    `The search intent behind this topic is ${anchor.searchIntent}. Learners usually need more than a short definition; they need a way to decide what matters first in a case stem. REx-PN-style questions often include one cue that changes the safest answer: new confusion, worsening breathing, abnormal bleeding, medication risk, unsafe delegation, or a documented change from baseline.`,
    `A useful bedside example: ${anchor.bedsideExample} The strongest answer usually names the immediate risk, starts with assessment or safety, communicates through the right pathway, and avoids independent provider-level decisions.`,
  );

  const framework = paragraph(
    `Use a four-step clinical judgment check. First, decide whether the client is stable, predictable, worsening, or newly unstable. Second, identify whether the finding is expected for the diagnosis and setting. Third, ask whether the action fits practical nursing scope, orders, and employer policy. Fourth, choose the action that reduces harm fastest while preserving documentation and communication.`,
    anchor.safetyPriority,
    `This framework keeps your answer grounded when all four options sound reasonable. REx-PN distractors are often partially true, but attached to the wrong timing, wrong role, wrong patient, or wrong urgency.`,
  );

  const traps = paragraph(
    `Common trap: ${anchor.examTrap} Another frequent trap is choosing the action you might do later instead of the first action. Teaching, documentation, comfort, and routine care matter, but they move behind acute physiologic risk, unsafe medication administration, bleeding, hypoglycemia, sepsis cues, neurologic change, respiratory distress, and suicide risk.`,
    `Scope drift is another issue. Avoid answers that ask you to diagnose independently, prescribe, change treatment without authorization, or delegate nursing judgment. The REx-PN rewards safe collaboration, not isolated heroics.`,
  );

  const practice = paragraph(
    `When reviewing practice questions, label each miss as one of four types: content gap, priority gap, scope gap, or wording gap. Content gaps need a lesson or quick reference. Priority gaps need timed mixed questions. Scope gaps need Canadian practical nursing standards and instructor feedback. Wording gaps need slower stem reading and answer elimination.`,
    `For ${variant.titleSuffix.toLowerCase()}, do not stop at the correct letter. Ask why each wrong answer was tempting. A strong distractor usually contains one clinically true idea with a subtle flaw: it delays escalation, skips reassessment, ignores an order, exceeds scope, or focuses on teaching before safety.`,
    `A good review note should be short and specific: “I missed the worsening trend,” “I picked teaching before safety,” or “I delegated assessment instead of a task.” That kind of note is much more useful than copying the entire rationale because it names the habit you need to change on the next item.`,
  );

  const studyPlan = paragraph(
    `A practical study loop is simple: spend 10 minutes reviewing the concept, 10 minutes answering related questions, and 5 minutes writing short rationale notes. Turn recurring cues into flashcards. Then revisit the topic after 24 to 72 hours so you are building retention rather than short-term familiarity.`,
    variant.cta,
  );

  const examples = `<ul>
  <li><strong>Priority cue:</strong> new or worsening findings matter more than familiar diagnoses.</li>
  <li><strong>Scope cue:</strong> choose actions that fit practical nursing role, orders, policy, and supervision.</li>
  <li><strong>Safety cue:</strong> respiratory distress, bleeding, hypoglycemia, sepsis patterns, neurologic change, suicide risk, and medication uncertainty need prompt action.</li>
  <li><strong>Documentation cue:</strong> chart objective findings, actions, communication, education, and reassessment.</li>
</ul>`;

  const summary = paragraph(
    `${anchor.titleCore} becomes easier when you practise the same reasoning pattern repeatedly: notice the cue, name the risk, choose the safest practical nursing action, communicate clearly, and reassess. That is the bridge between REx-PN exam prep and safe early-career nursing practice.`,
    `Related search focus: ${anchor.searchIntent}. Canonical study slug: ${slug}.`,
  );

  return [
    h2("Overview", overview),
    h2("Why this appears on REx-PN-style exams", why),
    h2("Clinical judgment framework", framework),
    h2("Common exam traps", traps),
    h2("Practice question breakdown", practice),
    h2("High-yield review checklist", examples),
    h2("Study plan and retention strategy", studyPlan),
    h2("Internal study links", internalLinks(anchor)),
    h2("FAQ", faq(anchor)),
    h2("Next step", summary),
  ].join("\n\n");
}

function rows(): { slug: string; anchor: RexPnAnchor; variant: RexPnVariant; title: string }[] {
  return ANCHORS.flatMap((anchor) =>
    VARIANTS.map((variant) => ({
      slug: `rex-pn-canadian-pn-${anchor.slugBase}-${variant.slugSuffix}`,
      anchor,
      variant,
      title: `${anchor.titleCore}: ${variant.titleSuffix}`,
    })),
  );
}

function wordCountBodyOnly(md: string): number {
  const trimmed = md.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) return 0;
  const rest = trimmed.slice(trimmed.indexOf("\n") + 1);
  const end = rest.indexOf("\n---");
  if (end < 0) return 0;
  const body = rest.slice(end + 4).replace(/^\s*\n/, "");
  return countWordsFromHtml(body);
}

async function main(): Promise<void> {
  const dry = process.argv.includes("--dry-run");
  const verifyOnly = process.argv.includes("--verify-only");
  const allRows = rows();
  if (allRows.length !== EXPECTED_COUNT) {
    console.error(`Expected ${EXPECTED_COUNT} rows, got ${allRows.length} (anchors=${ANCHORS.length}, variants=${VARIANTS.length})`);
    process.exit(1);
  }

  if (verifyOnly) {
    const files = readdirSync(OUT_DIR)
      .filter((file) => file.startsWith("rex-pn-canadian-pn-") && file.endsWith(".md"))
      .map((file) => join(OUT_DIR, file));
    if (files.length !== EXPECTED_COUNT) {
      console.error(`Expected ${EXPECTED_COUNT} generated files, found ${files.length}`);
      process.exit(1);
    }
    let failures = 0;
    for (const file of files) {
      const words = wordCountBodyOnly(readFileSync(file, "utf8"));
      if (words < MIN_WORDS) {
        console.error(`${file}: ${words} words (< ${MIN_WORDS})`);
        failures++;
      }
    }
    console.log(`OK: verified ${files.length} REx-PN Canadian PN long-tail files.`);
    process.exit(failures ? 1 : 0);
  }

  if (dry) {
    const sample = allRows[0]!;
    const body = buildBody(sample.slug, sample.anchor, sample.variant);
    const words = countWordsFromHtml(body);
    console.log(`Would write ${allRows.length} files to ${OUT_DIR}; sample=${sample.slug}; sampleWords=${words}`);
    process.exit(words < MIN_WORDS ? 1 : 0);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let failures = 0;
  for (const row of allRows) {
    const body = buildBody(row.slug, row.anchor, row.variant);
    const words = countWordsFromHtml(body);
    if (words < MIN_WORDS) {
      console.error(`FAIL word count ${words} < ${MIN_WORDS}: ${row.slug}`);
      failures++;
      continue;
    }
    const excerpt = buildExcerpt(row.anchor, row.variant);
    const frontmatter = buildFrontmatter({
      slug: row.slug,
      title: row.title,
      excerpt,
      category: row.anchor.category,
      tags: tagsJson(row.anchor, row.variant),
      seoTitle: seoTitle(row.title),
      seoDescription: seoDescription(excerpt),
    });
    writeFileSync(join(OUT_DIR, `${row.slug}.md`), `${frontmatter}${body}\n`, "utf8");
  }

  if (failures) {
    console.error(`Completed with ${failures} failure(s).`);
    process.exit(1);
  }
  console.log(`OK: wrote ${allRows.length} REx-PN Canadian PN long-tail files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
