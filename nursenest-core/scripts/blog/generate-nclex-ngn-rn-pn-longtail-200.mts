#!/usr/bin/env npx tsx
/**
 * Deterministic generator for 200 NCLEX-RN / NCLEX-PN / NGN long-tail blog posts.
 *
 * Run:
 *   npx tsx scripts/blog/generate-nclex-ngn-rn-pn-longtail-200.mts
 *   npx tsx scripts/blog/generate-nclex-ngn-rn-pn-longtail-200.mts --dry-run
 *   npx tsx scripts/blog/generate-nclex-ngn-rn-pn-longtail-200.mts --verify-only
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

type NclexAnchor = {
  slugBase: string;
  titleCore: string;
  category: string;
  audience: string;
  searchIntent: string;
  clinicalFrame: string;
  bedsideExample: string;
  safetyPriority: string;
  ngnCue: string;
  examTrap: string;
  relatedBlog: { href: string; label: string };
  tags: readonly string[];
};

type NclexVariant = {
  slugSuffix: string;
  titleSuffix: string;
  lens: string;
  cta: string;
};

const PUBLISHED_AT = "2026-05-27";
const UPDATED_AT = "2026-05-27";
const MIN_WORDS = 900;
const EXPECTED_COUNT = 216;

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

const VARIANTS: readonly NclexVariant[] = [
  {
    slugSuffix: "first-attempt-guide",
    titleSuffix: "First-Attempt NCLEX Guide",
    lens: "how to study this topic so it transfers into timed NCLEX-RN and NCLEX-PN questions",
    cta: "Use a short mixed practice block after reading so the topic becomes retrieval practice, not passive review.",
  },
  {
    slugSuffix: "ngn-clinical-judgment",
    titleSuffix: "Next Gen NCLEX Clinical Judgment Guide",
    lens: "cue recognition, hypothesis prioritization, action selection, and outcome evaluation",
    cta: "Pair this guide with NGN case questions and explain each answer using the clinical judgment model.",
  },
  {
    slugSuffix: "cat-testing-strategy",
    titleSuffix: "CAT Testing Strategy",
    lens: "how adaptive testing changes pacing, confidence, and answer discipline",
    cta: "Practise under timed conditions and stop judging performance by whether an item feels easy or hard.",
  },
  {
    slugSuffix: "question-breakdown",
    titleSuffix: "Practice Question Breakdown",
    lens: "how to read the stem, eliminate unsafe distractors, and choose the best nursing action",
    cta: "Review every miss by naming whether the error was content, priority, scope, or wording.",
  },
  {
    slugSuffix: "common-mistakes",
    titleSuffix: "Common NCLEX Mistakes",
    lens: "the tempting answer choices that sound caring but delay assessment, escalation, or patient safety",
    cta: "Build a mistake log with one line per miss and revisit it before your next practice set.",
  },
  {
    slugSuffix: "flashcard-review",
    titleSuffix: "Flashcard Review Plan",
    lens: "the cues, red flags, medication warnings, and exam traps worth converting into spaced repetition",
    cta: "Turn each priority cue into a flashcard and repeat it after 24 to 72 hours.",
  },
  {
    slugSuffix: "student-success-plan",
    titleSuffix: "Nursing Student Success Plan",
    lens: "how nursing students can organize this topic during lecture, clinical, simulation, and test prep",
    cta: "Connect classroom notes to one patient-safety question and one bedside example.",
  },
  {
    slugSuffix: "new-grad-transition",
    titleSuffix: "New Graduate Transition Guide",
    lens: "how this NCLEX topic becomes a real shift habit during orientation and early practice",
    cta: "Use this topic as a bridge from exam logic to safe handoff, documentation, and reassessment habits.",
  },
];

const ANCHORS: readonly NclexAnchor[] = [
  {
    slugBase: "pass-nclex-first-attempt",
    titleCore: "How to pass the NCLEX on your first attempt",
    category: "NCLEX + NGN Exam Prep",
    audience: "NCLEX-RN and NCLEX-PN candidates",
    searchIntent: "passing the NCLEX on the first attempt",
    clinicalFrame: "A strong NCLEX plan combines content review, daily clinical judgment practice, rationale analysis, CAT stamina, and spaced repetition.",
    bedsideExample: "A learner can memorize infection signs but miss a sepsis item because they do not connect tachypnea, new confusion, hypotension, and poor perfusion as one pattern.",
    safetyPriority: "Choose the answer that protects the patient now, then communicates and reassesses.",
    ngnCue: "Recognize cues before jumping to an intervention.",
    examTrap: "Studying only definitions instead of practising why unsafe distractors are unsafe.",
    relatedBlog: { href: "/blog/nclex-rn-prioritization-strategies-for-rn-students", label: "NCLEX prioritization strategies for RN students" },
    tags: ["NCLEX", "NCLEX-RN", "NCLEX-PN", "Study plan"],
  },
  {
    slugBase: "next-gen-nclex-question-types",
    titleCore: "Next Gen NCLEX question types explained",
    category: "NCLEX + NGN Exam Prep",
    audience: "students preparing for NGN-style item formats",
    searchIntent: "Next Gen NCLEX question types explained",
    clinicalFrame: "NGN formats look different, but the goal is consistent: measure whether you can notice cues, connect evidence, choose actions, and evaluate outcomes.",
    bedsideExample: "A bow-tie item may ask you to link a likely condition with actions and monitoring after serial vital signs show deterioration.",
    safetyPriority: "Let the clinical data drive the answer, not the novelty of the item format.",
    ngnCue: "Matrix, bow-tie, trend, cloze, and highlight items all reward cue linkage.",
    examTrap: "Panicking at the format and forgetting the nursing process.",
    relatedBlog: { href: "/blog/nclex-rn-canada-ngn-clinical-judgment", label: "NGN clinical judgment for NCLEX learners" },
    tags: ["Next Gen NCLEX", "NGN", "Bow-tie", "Matrix questions"],
  },
  {
    slugBase: "nclex-cat-exam-adaptive-testing",
    titleCore: "How NCLEX CAT testing adapts to your performance",
    category: "NCLEX + NGN Exam Prep",
    audience: "NCLEX test takers learning adaptive testing",
    searchIntent: "how NCLEX CAT testing works",
    clinicalFrame: "Computerized adaptive testing estimates ability by selecting items based on performance, so consistency matters more than guessing the meaning of question difficulty.",
    bedsideExample: "A respiratory question may become harder by adding mental-status change, abnormal oxygen saturation, and competing interventions.",
    safetyPriority: "Answer the patient in front of you; do not try to reverse-engineer the algorithm.",
    ngnCue: "Adaptive exams still depend on safe cue recognition and prioritization.",
    examTrap: "Assuming hard questions mean failure or easy questions mean success.",
    relatedBlog: { href: "/blog/cat-nclex-simulator", label: "CAT NCLEX simulator overview" },
    tags: ["CAT testing", "NCLEX", "Adaptive testing", "Exam strategy"],
  },
  {
    slugBase: "ncsbn-clinical-judgment-model",
    titleCore: "NCSBN Clinical Judgment Measurement Model for NCLEX students",
    category: "Clinical Judgment",
    audience: "learners building NGN reasoning",
    searchIntent: "NCSBN Clinical Judgment Measurement Model",
    clinicalFrame: "The model helps organize thinking: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.",
    bedsideExample: "A post-op patient with tachycardia, falling blood pressure, and increasing pain requires hypothesis prioritization before comfort-only care.",
    safetyPriority: "Use the model to prevent skipping from cue to action without analysis.",
    ngnCue: "Every NGN item is testing at least one step in the reasoning chain.",
    examTrap: "Picking a familiar intervention before deciding what the cues mean.",
    relatedBlog: { href: "/blog/nclex-rn-canada-ngn-clinical-judgment", label: "NCLEX NGN clinical judgment guide" },
    tags: ["NCSBN", "Clinical judgment", "NGN", "NCLEX"],
  },
  {
    slugBase: "answer-sata-questions-nclex",
    titleCore: "How to answer SATA questions on the NCLEX",
    category: "NGN Question Types",
    audience: "RN and PN learners practising select-all-that-apply items",
    searchIntent: "how to answer SATA questions NCLEX",
    clinicalFrame: "SATA questions require testing each option independently for safety, indication, timing, and scope.",
    bedsideExample: "A hypoglycemia item may include fast carbohydrate, repeat glucose check, holding insulin, documenting response, and escalation if symptoms persist.",
    safetyPriority: "Select options that are safe and indicated for the exact clinical picture.",
    ngnCue: "Partial-credit thinking rewards precision, not answer-count guessing.",
    examTrap: "Selecting all caring-sounding options even when one delays urgent assessment.",
    relatedBlog: { href: "/blog/cpnre-cnple-sata-questions-practical-nursing-clinical-judgment-guide", label: "SATA strategy for practical nursing exams" },
    tags: ["SATA", "NCLEX", "NGN", "Question strategy"],
  },
  {
    slugBase: "bow-tie-questions-nclex",
    titleCore: "How to answer bow-tie questions on the Next Gen NCLEX",
    category: "NGN Question Types",
    audience: "students learning NGN bow-tie reasoning",
    searchIntent: "how to answer NCLEX bow-tie questions",
    clinicalFrame: "Bow-tie questions ask learners to identify the likely problem, priority actions, and parameters to monitor.",
    bedsideExample: "A client with fever, hypotension, tachypnea, and altered mental status may require sepsis recognition, actions to support perfusion, and monitoring of vitals and urine output.",
    safetyPriority: "The center condition must fit the cues before actions and monitoring make sense.",
    ngnCue: "Link cues to condition, condition to actions, and actions to evaluation.",
    examTrap: "Choosing isolated true interventions that do not match the central problem.",
    relatedBlog: { href: "/blog/sepsis-pathophysiology-early-nursing-recognition", label: "Sepsis recognition and early nursing priorities" },
    tags: ["Bow-tie", "NGN", "NCLEX", "Clinical judgment"],
  },
  {
    slugBase: "matrix-questions-nclex",
    titleCore: "How to answer NCLEX matrix questions",
    category: "NGN Question Types",
    audience: "learners practising grid and classification items",
    searchIntent: "NCLEX matrix questions",
    clinicalFrame: "Matrix items ask you to classify findings or interventions across categories such as expected, unexpected, urgent, non-urgent, appropriate, or inappropriate.",
    bedsideExample: "A heart failure matrix may ask whether weight gain, crackles, edema, oxygen saturation, and urine output are expected or concerning.",
    safetyPriority: "Classify by patient trajectory, not by memorized labels alone.",
    ngnCue: "Trend recognition and category discipline matter more than speed.",
    examTrap: "Marking every abnormal value as equally urgent.",
    relatedBlog: { href: "/blog/left-sided-vs-right-sided-heart-failure", label: "Left-sided versus right-sided heart failure comparison" },
    tags: ["Matrix questions", "NGN", "NCLEX", "Clinical reasoning"],
  },
  {
    slugBase: "nclex-case-study-questions",
    titleCore: "How to approach NCLEX case study questions",
    category: "NGN Question Types",
    audience: "students practising evolving patient scenarios",
    searchIntent: "NCLEX case study questions",
    clinicalFrame: "Case studies test whether you can follow changing data across notes, labs, vitals, orders, and reassessment findings.",
    bedsideExample: "A pneumonia case may begin with fever and cough, then add decreasing oxygen saturation and increasing confusion.",
    safetyPriority: "Reprioritize when new cues show deterioration.",
    ngnCue: "The best answer can change as the case evolves.",
    examTrap: "Anchoring on the first diagnosis and ignoring later data.",
    relatedBlog: { href: "/blog/nclex-rn-us-pneumonia-community-hospital-nursing-care", label: "Pneumonia nursing care for NCLEX" },
    tags: ["Case studies", "NGN", "NCLEX", "Clinical judgment"],
  },
  {
    slugBase: "abcs-vs-maslow-nclex",
    titleCore: "ABCs versus Maslow for NCLEX prioritization",
    category: "Clinical Judgment",
    audience: "students working on priority questions",
    searchIntent: "ABCs vs Maslow NCLEX prioritization",
    clinicalFrame: "Frameworks help only when matched to the actual patient data in the stem.",
    bedsideExample: "A patient with worsening shortness of breath and cyanosis outranks a stable patient needing discharge teaching.",
    safetyPriority: "Airway, breathing, circulation, neurologic change, bleeding, glucose emergencies, and suicide risk come before routine teaching.",
    ngnCue: "Prioritize hypotheses before selecting a solution.",
    examTrap: "Using Maslow automatically while missing acute physiologic instability.",
    relatedBlog: { href: "/blog/cpnre-cnple-abcs-vs-maslow-nursing-prioritization-clinical-judgment-guide", label: "ABCs versus Maslow nursing prioritization" },
    tags: ["ABCs", "Maslow", "Prioritization", "NCLEX"],
  },
  {
    slugBase: "unstable-vs-stable-nclex-patients",
    titleCore: "Stable versus unstable patients on NCLEX questions",
    category: "Clinical Judgment",
    audience: "learners practising acuity recognition",
    searchIntent: "stable vs unstable NCLEX questions",
    clinicalFrame: "NCLEX priority items often hinge on whether the patient is predictable, improving, worsening, or newly unstable.",
    bedsideExample: "An older adult with new confusion, tachypnea, and low blood pressure is not a routine dementia presentation.",
    safetyPriority: "New change from baseline deserves assessment, communication, and reassessment.",
    ngnCue: "Cue recognition begins with identifying change.",
    examTrap: "Letting a familiar diagnosis hide deterioration.",
    relatedBlog: { href: "/blog/cpnre-cnple-unstable-vs-stable-patient-cpnre-clinical-judgment-guide", label: "Stable versus unstable patient review" },
    tags: ["Unstable patient", "Acuity", "NCLEX", "Patient safety"],
  },
  {
    slugBase: "delegation-prioritization-nclex",
    titleCore: "Delegation and prioritization questions on the NCLEX",
    category: "Clinical Judgment",
    audience: "RN and PN learners reviewing team-based care",
    searchIntent: "NCLEX delegation and prioritization questions",
    clinicalFrame: "Delegation items test patient stability, task predictability, role scope, supervision, and accountability.",
    bedsideExample: "An assistive personnel role may help a stable patient ambulate but should not assess new chest pain.",
    safetyPriority: "Delegate tasks, not nursing judgment.",
    ngnCue: "Match role, task, patient condition, and follow-up.",
    examTrap: "Choosing the efficient answer that removes required assessment.",
    relatedBlog: { href: "/blog/cpnre-cnple-delegation-ucp-rpn-exam-questions-clinical-judgment-guide", label: "Delegation to UCPs for practical nursing exams" },
    tags: ["Delegation", "Prioritization", "NCLEX", "Scope"],
  },
  {
    slugBase: "insulin-hypoglycemia-nclex",
    titleCore: "Insulin and hypoglycemia safety for NCLEX pharmacology",
    category: "Pharmacology",
    audience: "students reviewing high-yield medication safety",
    searchIntent: "NCLEX insulin hypoglycemia safety",
    clinicalFrame: "Insulin questions combine timing, meals, glucose readings, symptoms, safe swallowing, repeat checks, and escalation.",
    bedsideExample: "A shaky confused patient with glucose 52 mg/dL needs immediate hypoglycemia treatment if safe to swallow and reassessment.",
    safetyPriority: "Hypoglycemia is an immediate neurologic safety risk.",
    ngnCue: "Analyze cues before giving a scheduled medication.",
    examTrap: "Administering insulin because it is ordered while the patient is already low.",
    relatedBlog: { href: "/blog/dka-vs-hhs-nursing-priorities", label: "DKA vs HHS nursing priorities" },
    tags: ["Insulin", "Hypoglycemia", "Pharmacology", "NCLEX"],
  },
  {
    slugBase: "anticoagulants-nclex-warfarin-heparin",
    titleCore: "Warfarin, heparin, and anticoagulant safety for NCLEX",
    category: "Pharmacology",
    audience: "students reviewing bleeding-risk medications",
    searchIntent: "NCLEX anticoagulants warfarin heparin",
    clinicalFrame: "Anticoagulant items test bleeding cues, lab context, falls risk, interactions, antidotes, and patient teaching.",
    bedsideExample: "Black stool, dizziness, bruising, and an elevated INR require urgent communication rather than routine diet teaching alone.",
    safetyPriority: "Bleeding risk can become life-threatening quickly.",
    ngnCue: "Link medication mechanism to assessment cues.",
    examTrap: "Focusing on vitamin K foods while missing active bleeding.",
    relatedBlog: { href: "/blog/warfarin-vs-heparin-nursing-comparison", label: "Warfarin versus heparin nursing comparison" },
    tags: ["Warfarin", "Heparin", "Anticoagulants", "NCLEX"],
  },
  {
    slugBase: "opioids-respiratory-depression-nclex",
    titleCore: "Opioids and respiratory depression on the NCLEX",
    category: "Pharmacology",
    audience: "students reviewing post-op and medication safety",
    searchIntent: "NCLEX opioid respiratory depression",
    clinicalFrame: "Opioid safety items test sedation, respiratory rate, oxygenation, pain reassessment, naloxone awareness, and when to hold or clarify medication.",
    bedsideExample: "A post-op patient who is hard to arouse with RR 8/min should not receive another opioid dose.",
    safetyPriority: "Airway and breathing outrank scheduled medication administration.",
    ngnCue: "Take action after recognizing sedation and respiratory cues.",
    examTrap: "Giving medication because it is due despite unsafe assessment findings.",
    relatedBlog: { href: "/blog/nclex-rn-us-postoperative-complications-priority-assessment", label: "Postoperative complications priority assessment" },
    tags: ["Opioids", "Respiratory depression", "Medication safety", "NCLEX"],
  },
  {
    slugBase: "psych-meds-nclex-side-effects",
    titleCore: "Psychiatric medication side effects for NCLEX prep",
    category: "Pharmacology",
    audience: "students reviewing mental health pharmacology",
    searchIntent: "NCLEX psychiatric medication side effects",
    clinicalFrame: "Psych med questions often test serotonin syndrome, neuroleptic malignant syndrome, EPS, lithium toxicity, orthostatic hypotension, and suicide-risk monitoring.",
    bedsideExample: "A patient taking an antipsychotic who develops fever, rigidity, and confusion requires urgent escalation.",
    safetyPriority: "Medication side effects can be medical emergencies.",
    ngnCue: "Connect new physical symptoms to medication risk.",
    examTrap: "Attributing every symptom to the mental health diagnosis.",
    relatedBlog: { href: "/blog/nclex-rn-us-mental-health-suicide-risk-assessment-safety", label: "Mental health suicide risk assessment and safety" },
    tags: ["Psych meds", "Mental health", "Pharmacology", "NCLEX"],
  },
  {
    slugBase: "copd-nursing-priorities-nclex",
    titleCore: "COPD nursing priorities for NCLEX med-surg",
    category: "Medical-Surgical Nursing",
    audience: "students reviewing respiratory med-surg questions",
    searchIntent: "NCLEX COPD nursing priorities",
    clinicalFrame: "COPD questions test work of breathing, oxygen trends, infection triggers, inhalers, activity tolerance, and escalation.",
    bedsideExample: "A patient with accessory muscle use, falling oxygen saturation, and new confusion needs prompt assessment and support.",
    safetyPriority: "Visible respiratory distress outranks routine teaching.",
    ngnCue: "Analyze respiratory cues as a trend, not isolated numbers.",
    examTrap: "Treating chronic COPD as automatically stable.",
    relatedBlog: { href: "/blog/copd-symptoms-treatment-nursing-care", label: "COPD symptoms, treatment, and nursing care" },
    tags: ["COPD", "Respiratory", "Med-Surg", "NCLEX"],
  },
  {
    slugBase: "heart-failure-nclex-priorities",
    titleCore: "Heart failure nursing priorities for NCLEX",
    category: "Medical-Surgical Nursing",
    audience: "students reviewing cardiac med-surg questions",
    searchIntent: "NCLEX heart failure nursing priorities",
    clinicalFrame: "Heart failure items reward trend recognition: daily weights, edema, crackles, orthopnea, oxygenation, medication adherence, and fluid teaching.",
    bedsideExample: "A sudden weight gain with new dyspnea and crackles changes priority from teaching to assessment and escalation.",
    safetyPriority: "Fluid overload can progress to respiratory distress.",
    ngnCue: "Compare current cues with baseline and expected findings.",
    examTrap: "Teaching diet while missing acute decompensation.",
    relatedBlog: { href: "/blog/left-sided-vs-right-sided-heart-failure", label: "Left-sided versus right-sided heart failure" },
    tags: ["Heart failure", "Cardiac", "Med-Surg", "NCLEX"],
  },
  {
    slugBase: "sepsis-early-signs-nclex",
    titleCore: "Recognizing early signs of sepsis on the NCLEX",
    category: "Medical-Surgical Nursing",
    audience: "students reviewing deterioration and shock",
    searchIntent: "NCLEX early signs of sepsis",
    clinicalFrame: "Sepsis questions test infection plus deterioration: tachypnea, hypotension, altered mental status, fever or hypothermia, poor perfusion, and lactate context.",
    bedsideExample: "An older adult with suspected infection, RR 26/min, low blood pressure, and new confusion requires urgent escalation.",
    safetyPriority: "Early recognition prevents failure-to-rescue.",
    ngnCue: "Prioritize hypotheses when multiple cues point to systemic deterioration.",
    examTrap: "Waiting for high fever before treating the pattern as urgent.",
    relatedBlog: { href: "/blog/sepsis-pathophysiology-early-nursing-recognition", label: "Sepsis pathophysiology and early recognition" },
    tags: ["Sepsis", "Shock", "Deterioration", "NCLEX"],
  },
  {
    slugBase: "stroke-fast-nclex",
    titleCore: "Stroke recognition and FAST cues for NCLEX students",
    category: "Medical-Surgical Nursing",
    audience: "students reviewing neurologic emergency questions",
    searchIntent: "NCLEX stroke FAST last known well",
    clinicalFrame: "Stroke items test sudden focal deficits, last-known-well time, glucose check, swallow safety, and urgent reporting.",
    bedsideExample: "A patient with new slurred speech and arm drift requires urgent action and objective documentation.",
    safetyPriority: "Do not give oral fluids until swallow safety is addressed.",
    ngnCue: "Recognize neurologic cues and take timely action.",
    examTrap: "Calling sudden neurologic change fatigue or confusion without escalation.",
    relatedBlog: { href: "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care", label: "Ischemic vs hemorrhagic stroke nursing care" },
    tags: ["Stroke", "FAST", "Neuro", "NCLEX"],
  },
  {
    slugBase: "infection-control-ppe-nclex",
    titleCore: "Infection control and PPE questions for NCLEX fundamentals",
    category: "Fundamentals",
    audience: "students reviewing safety and infection prevention",
    searchIntent: "NCLEX infection control PPE",
    clinicalFrame: "Infection control questions connect hand hygiene, PPE, isolation precautions, sharps safety, specimen handling, and outbreak logic.",
    bedsideExample: "A C. difficile item should make you think contact precautions and soap-and-water hand hygiene after care.",
    safetyPriority: "Protect the patient, staff, visitors, and unit population.",
    ngnCue: "Classify precautions based on transmission risk.",
    examTrap: "Assuming gloves replace hand hygiene.",
    relatedBlog: { href: "/blog/nclex-rn-canada-hand-hygiene-five-moments", label: "Hand hygiene five moments for NCLEX learners" },
    tags: ["Infection control", "PPE", "Fundamentals", "NCLEX"],
  },
  {
    slugBase: "documentation-charting-nclex",
    titleCore: "Documentation and charting questions on the NCLEX",
    category: "Fundamentals",
    audience: "students reviewing legal and communication items",
    searchIntent: "NCLEX documentation charting questions",
    clinicalFrame: "Documentation questions test objective language, timing, follow-up, professional wording, and accurate communication.",
    bedsideExample: "Charting objective refusal, teaching, provider notification, and reassessment is stronger than writing that a patient was difficult.",
    safetyPriority: "Documentation should show assessment, action, communication, and response.",
    ngnCue: "Evaluate outcomes and document the response.",
    examTrap: "Using judgmental wording or charting care before it happens.",
    relatedBlog: { href: "/blog/cpnre-cnple-documentation-charting-cpnre-clinical-judgment-guide", label: "Documentation and charting for nursing exams" },
    tags: ["Documentation", "Charting", "Fundamentals", "NCLEX"],
  },
  {
    slugBase: "therapeutic-communication-nclex",
    titleCore: "Therapeutic communication examples for NCLEX mental health",
    category: "Mental Health Nursing",
    audience: "students reviewing mental health communication",
    searchIntent: "NCLEX therapeutic communication examples",
    clinicalFrame: "Therapeutic communication items test empathy, safety, boundaries, reflection, trauma-informed pacing, and avoiding false reassurance.",
    bedsideExample: "A patient who says they might hurt themselves needs direct safety assessment and escalation, not vague reassurance.",
    safetyPriority: "Communication includes risk recognition.",
    ngnCue: "Recognize psychosocial safety cues before choosing a response.",
    examTrap: "Choosing the nicest-sounding answer that avoids the safety issue.",
    relatedBlog: { href: "/blog/nclex-rn-us-mental-health-suicide-risk-assessment-safety", label: "Mental health suicide risk assessment and safety" },
    tags: ["Therapeutic communication", "Mental health", "NCLEX", "Safety"],
  },
  {
    slugBase: "postpartum-hemorrhage-nclex",
    titleCore: "Postpartum hemorrhage priorities for NCLEX maternity",
    category: "Maternity + Pediatrics",
    audience: "students reviewing maternity emergencies",
    searchIntent: "NCLEX postpartum hemorrhage nursing actions",
    clinicalFrame: "Postpartum hemorrhage questions test bleeding amount, fundal tone, bladder distention, vital signs, uterine massage, escalation, and reassessment.",
    bedsideExample: "Heavy bleeding with a boggy uterus changes the priority to immediate assessment and interventions according to protocol.",
    safetyPriority: "Hemorrhage can progress quickly to shock.",
    ngnCue: "Link maternal assessment cues to urgent action.",
    examTrap: "Choosing newborn teaching while missing maternal deterioration.",
    relatedBlog: { href: "/blog/nclex-rn-us-postpartum-hemorrhage-nursing-actions", label: "Postpartum hemorrhage nursing actions" },
    tags: ["Postpartum", "Maternity", "Hemorrhage", "NCLEX"],
  },
  {
    slugBase: "pediatric-respiratory-distress-nclex",
    titleCore: "Pediatric respiratory distress cues for NCLEX questions",
    category: "Maternity + Pediatrics",
    audience: "students reviewing pediatric safety questions",
    searchIntent: "NCLEX pediatric respiratory distress cues",
    clinicalFrame: "Pediatric respiratory items test work of breathing, retractions, nasal flaring, hydration, caregiver report, oxygen trends, and fatigue.",
    bedsideExample: "A child with increasing work of breathing and decreased feeding is more concerning than mild cough alone.",
    safetyPriority: "Children can deteriorate quickly when respiratory effort increases.",
    ngnCue: "Recognize subtle deterioration before collapse.",
    examTrap: "Reassuring because the child is awake while missing fatigue and worsening effort.",
    relatedBlog: { href: "/blog/nclex-rn-us-pediatric-dehydration-oral-rehydration-priorities", label: "Pediatric dehydration and respiratory-priority thinking" },
    tags: ["Pediatrics", "Respiratory distress", "NCLEX", "Patient safety"],
  },
  {
    slugBase: "nursing-school-study-systems-nclex",
    titleCore: "Nursing school study systems that prepare you for the NCLEX",
    category: "Nursing School Success",
    audience: "nursing students building exam-ready habits",
    searchIntent: "nursing school study systems for NCLEX",
    clinicalFrame: "Effective study systems combine active recall, spaced repetition, practice questions, clinical examples, and rationale review.",
    bedsideExample: "A student who turns a lecture topic into patient cues, priority actions, and delegation rules is studying for both class and NCLEX.",
    safetyPriority: "Study the reasoning habit, not only the note page.",
    ngnCue: "Use clinical judgment steps as the structure for every study session.",
    examTrap: "Highlighting notes without retrieval practice.",
    relatedBlog: { href: "/blog/new-grad-nursing-ngn-style-clinical-judgment-habits-orthopedics-transition-longtail", label: "NGN-style clinical judgment habits for new nurses" },
    tags: ["Nursing school", "Study systems", "NCLEX", "Student success"],
  },
  {
    slugBase: "clinical-rotations-nclex-thinking",
    titleCore: "How to use clinical rotations to build NCLEX judgment",
    category: "Nursing School Success",
    audience: "students connecting clinical placement to exam prep",
    searchIntent: "clinical rotations NCLEX judgment",
    clinicalFrame: "Clinical rotations build the same habits the NCLEX tests: noticing change, asking why, reporting clearly, documenting objectively, and reassessing.",
    bedsideExample: "A student who notices new abnormal vital signs and reports them clearly is practising NCLEX-level cue recognition.",
    safetyPriority: "Ask for supervision before acting beyond your student role or competence.",
    ngnCue: "Every clinical day can reinforce cue recognition and evaluation.",
    examTrap: "Thinking clinical success is only about task completion.",
    relatedBlog: { href: "/blog/cpnre-cnple-clinical-placement-success-practical-nursing-clinical-judgment-guide", label: "Clinical placement success and clinical judgment" },
    tags: ["Clinical rotations", "Nursing school", "NCLEX", "Clinical judgment"],
  },
  {
    slugBase: "new-grad-nurse-first-job-nclex-transition",
    titleCore: "New grad nurse first job guide: using NCLEX thinking on the floor",
    category: "New Graduate Nursing",
    audience: "new graduate nurses entering practice",
    searchIntent: "new grad nurse first job NCLEX transition",
    clinicalFrame: "New graduate practice rewards the same habits as NCLEX prep: recognize deterioration, ask for help early, document clearly, and organize the shift around safety.",
    bedsideExample: "A new nurse who reports unexpected change in mobility and appetite may prevent a fall or delayed deterioration response.",
    safetyPriority: "Escalation is a professional safety behaviour, not a weakness.",
    ngnCue: "Evaluate outcomes continuously after taking action.",
    examTrap: "Trying to prove independence by delaying help.",
    relatedBlog: { href: "/blog/cpnre-cnple-new-grad-rpn-first-job-survival-clinical-judgment-guide", label: "New grad first job survival guide" },
    tags: ["New grad nursing", "Transition to practice", "NCLEX", "Clinical judgment"],
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

function buildExcerpt(anchor: NclexAnchor, variant: NclexVariant): string {
  const excerpt = `${anchor.titleCore} for NCLEX-RN, NCLEX-PN, and Next Gen NCLEX prep: ${variant.lens}, patient safety, clinical judgment, and exam-ready nursing reasoning.`;
  return excerpt.length > 320 ? `${excerpt.slice(0, 317).trim()}...` : excerpt;
}

function seoTitle(title: string): string {
  return title.length <= 62 ? title : `${title.slice(0, 59).trim()}...`;
}

function seoDescription(excerpt: string): string {
  return excerpt.length <= 165 ? excerpt : `${excerpt.slice(0, 162).trim()}...`;
}

function tagsJson(anchor: NclexAnchor, variant: NclexVariant): string {
  return JSON.stringify(
    Array.from(
      new Set([
        ...anchor.tags,
        "NCLEX",
        "NCLEX-RN",
        "NCLEX-PN",
        "Next Gen NCLEX",
        "NGN",
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
disclaimer: This article supports NCLEX-RN, NCLEX-PN, and Next Gen NCLEX exam preparation and clinical reasoning practice. It is educational content and not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and clinical standards in real patient care.
---

`;
}

function internalLinks(anchor: NclexAnchor): string {
  return `<ul>
  <li><a href="/canada/rn/nclex-rn">NCLEX-RN study hub</a> — start from the pathway page for lessons, flashcards, and practice questions.</li>
  <li><a href="/app/flashcards">Flashcards</a> — reinforce high-yield cues, medication warnings, and priority rules.</li>
  <li><a href="/app/practice-tests">Practice exams</a> — apply this topic in timed NCLEX and NGN-style questions.</li>
  <li><a href="/app/lessons">Lessons</a> — review the underlying nursing concepts before returning to questions.</li>
  <li><a href="${anchor.relatedBlog.href}">${escapeHtml(anchor.relatedBlog.label)}</a></li>
</ul>`;
}

function faq(anchor: NclexAnchor): string {
  return `<h3>Is ${escapeHtml(anchor.titleCore.toLowerCase())} tested on both NCLEX-RN and NCLEX-PN?</h3>
<p>Many safety, prioritization, pharmacology, fundamentals, and clinical judgment concepts appear across both exams. RN items may add broader delegation, complex coordination, or higher-acuity reasoning, while PN items usually emphasize predictable care, reporting, and foundational safety.</p>
<h3>How does this connect to Next Gen NCLEX clinical judgment?</h3>
<p>Use the same reasoning chain: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes. The article topic becomes exam-ready when you can explain which cue changes the safest answer.</p>
<h3>What is the best way to study this topic?</h3>
<p>Read the concept once, answer a short set of mixed questions, review rationales, and convert missed cues into flashcards. Spaced retrieval and clinical examples are more effective than rereading notes alone.</p>`;
}

function buildBody(slug: string, anchor: NclexAnchor, variant: NclexVariant): string {
  const overview = paragraph(
    `${anchor.titleCore} matters because NCLEX-RN, NCLEX-PN, and Next Gen NCLEX questions test how well you can protect patients when several options sound reasonable. The exam is not only checking memory. It is checking whether you can identify cues, prioritize risk, select safe nursing actions, and evaluate whether the patient improved.`,
    `${anchor.clinicalFrame} This article focuses on ${variant.lens}. It is written for ${anchor.audience}, repeat test takers, internationally educated nurses, and new graduates who want content review that actually improves clinical judgment.`,
  );

  const ngn = paragraph(
    `Next Gen NCLEX items use formats such as case studies, matrix grids, bow-tie questions, cloze responses, trend questions, and highlight items. The format may change, but the reasoning stays consistent: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.`,
    `${anchor.ngnCue} If you can explain the patient-safety reason behind your answer, you are studying at the right depth. If you only remember a phrase, you are still vulnerable to strong distractors.`,
  );

  const why = paragraph(
    `The search intent behind this topic is ${anchor.searchIntent}. Learners usually need more than a quick definition; they need a practical way to decide what matters first in a clinical stem. NCLEX-style questions often include one cue that changes the priority: new confusion, worsening breathing, abnormal bleeding, medication risk, unsafe delegation, or a documented change from baseline.`,
    `A bedside example: ${anchor.bedsideExample} In a strong answer, the nurse notices the cue, protects immediate safety, communicates through the right pathway, documents objectively, and reassesses the response.`,
  );

  const framework = paragraph(
    `Use a four-step NCLEX judgment check. First, decide whether the patient is stable, predictable, worsening, or newly unstable. Second, identify whether the finding is expected for the diagnosis and setting. Third, ask whether the action fits the nurse role, orders, policies, and available resources. Fourth, choose the action that reduces harm fastest while preserving communication and documentation.`,
    anchor.safetyPriority,
    `This framework helps with RN and PN questions. The RN version may add delegation, charge nurse decisions, unstable assignments, or multi-patient prioritization. The PN version may emphasize predictable patients, standard care, reporting, medication administration safety, and recognition of deterioration. Both reward patient safety.`,
  );

  const traps = paragraph(
    `Common trap: ${anchor.examTrap} Another common trap is choosing the action you might eventually do instead of the first action. Teaching, documentation, comfort, and routine care all matter, but they move behind airway, breathing, circulation, acute change, bleeding, hypoglycemia, sepsis cues, neurologic change, suicide risk, and unsafe medication administration.`,
    `Strong distractors often contain one true idea with a subtle flaw. The answer may be caring but late, clinical but outside scope, educational but premature, or efficient but unsafe. Train yourself to ask: what patient harm could occur if I pick this answer first?`,
  );

  const questionReview = paragraph(
    `When reviewing practice questions, label each miss as one of four types: content gap, priority gap, scope gap, or wording gap. Content gaps need a lesson. Priority gaps need timed mixed questions. Scope gaps need role review. Wording gaps need slower stem reading and answer elimination.`,
    `For ${variant.titleSuffix.toLowerCase()}, do not stop at “I got it wrong.” Write a short note such as “missed worsening trend,” “picked teaching before safety,” “delegated assessment,” or “ignored medication adverse effect.” That note tells you exactly what to practise next.`,
  );

  const checklist = `<ul>
  <li><strong>Clinical cue:</strong> identify the data point that changes priority.</li>
  <li><strong>Safety cue:</strong> ask whether airway, breathing, circulation, neurologic status, bleeding, glucose, suicide risk, or medication uncertainty is involved.</li>
  <li><strong>Role cue:</strong> decide whether the item is testing RN coordination, PN recognition/reporting, or assistive personnel delegation.</li>
  <li><strong>NGN cue:</strong> connect findings to the clinical judgment step being tested.</li>
  <li><strong>Rationale cue:</strong> explain why the tempting answer is not the safest first action.</li>
</ul>`;

  const study = paragraph(
    `A useful study loop is short and active: review the concept for 10 minutes, answer 10 to 15 mixed questions, review every rationale, and convert missed cues into flashcards. Repeat the topic after 24 to 72 hours. This builds retrieval strength and prevents the false confidence that comes from rereading familiar notes.`,
    variant.cta,
  );

  const summary = paragraph(
    `${anchor.titleCore} becomes easier when you practise the same reasoning pattern repeatedly: notice the cue, name the risk, choose the safest nursing action, communicate clearly, and evaluate the outcome. That is the bridge between exam prep and safe nursing practice.`,
    `Related search focus: ${anchor.searchIntent}. Canonical study slug: ${slug}.`,
  );

  return [
    h2("Overview", overview),
    h2("Next Gen NCLEX clinical judgment focus", ngn),
    h2("Why this appears on NCLEX-style exams", why),
    h2("Prioritization framework", framework),
    h2("Common NCLEX traps", traps),
    h2("Practice question breakdown", questionReview),
    h2("High-yield review checklist", checklist),
    h2("Study plan and retention strategy", study),
    h2("Internal study links", internalLinks(anchor)),
    h2("FAQ", faq(anchor)),
    h2("Next step", summary),
  ].join("\n\n");
}

function rows(): { slug: string; anchor: NclexAnchor; variant: NclexVariant; title: string }[] {
  return ANCHORS.flatMap((anchor) =>
    VARIANTS.map((variant) => ({
      slug: `nclex-ngn-rn-pn-${anchor.slugBase}-${variant.slugSuffix}`,
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
      .filter((file) => file.startsWith("nclex-ngn-rn-pn-") && file.endsWith(".md"))
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
    console.log(`OK: verified ${files.length} NCLEX NGN RN/PN long-tail files.`);
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
  console.log(`OK: wrote ${allRows.length} NCLEX NGN RN/PN long-tail files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
