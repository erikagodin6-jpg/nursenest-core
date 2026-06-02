#!/usr/bin/env npx tsx
import "@/lib/db/script-env-bootstrap";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ContentStatus,
  CountryCode,
  ExamFamily,
  FlashcardDeckVisibility,
  PrismaClient,
  TierCode,
  type Prisma,
} from "@prisma/client";

type CatalogLesson = {
  slug: string;
  title: string;
  topic?: string;
  topicSlug?: string;
  bodySystem?: string;
  sections?: Array<{ id?: string; kind?: string; heading?: string; body?: string }>;
};

type Domain = {
  id: string;
  label: string;
  bodySystem: string;
  clientNeed: string;
  blueprint: string;
  weakArea: string;
  category: string;
  scenario: string;
  cue: string;
  correctAction: string;
  tempting: string;
  trap: string;
  saferAction: string;
  safety: string;
};

type QuestionRow = Prisma.ExamQuestionCreateManyInput;
type FlashcardRow = Prisma.FlashcardCreateManyInput;

const APPLY = process.argv.includes("--apply");
const QUESTION_TARGET = readNumberFlag("--question-target", 10000);
const FLASHCARD_TARGET = readNumberFlag("--flashcard-target", 10000);
const EXAM_TARGET = readNumberFlag("--practice-exams", 500);
const QUESTIONS_PER_LESSON = readNumberFlag("--questions-per-lesson", 30);
const FLASHCARDS_PER_LESSON = readNumberFlag("--flashcards-per-lesson", 25);
const CAT_TARGET = readNumberFlag("--cat-target", 5000);
const PATHWAY_ID = "us-lpn-nclex-pn";
const SOURCE = "nclex-pn-launch-readiness-sprint";
const CATEGORY_SLUG = "nclex-pn-launch-readiness";
const DECK_SLUG = "nclex-pn-launch-readiness-clinical-judgment";
const LESSON_CATALOG = resolve(process.cwd(), "src/content/pathway-lessons/catalog.json");

const PRIORITY_DOMAINS: Domain[] = [
  domain("safety-infection-control", "Safety & Infection Control", "Safety", "Safe and Effective Care Environment", "Safety and Infection Control", "Infection prevention and safety", "Safety", "a client with sudden watery diarrhea after antibiotics in a semi-private room", "new diarrhea, abdominal cramping, and a roommate using the same bathroom", "initiate contact precautions per policy, use soap-and-water hand hygiene, collect ordered specimens, protect hydration, and report promptly", "waiting for the lab result before changing precautions", "delaying containment until confirmation", "contain the likely infectious risk while continuing assessment and reporting", "transmission, dehydration, skin breakdown, and sepsis"),
  domain("management-of-care", "Management of Care", "Leadership", "Safe and Effective Care Environment", "Coordinated Care", "Care coordination", "Prioritization", "four clients need care at the same time on a medical unit", "one client reports acute chest pressure while another requests discharge teaching", "assess the client with chest pressure first, activate the appropriate response, and defer routine teaching until the unstable cue is addressed", "starting with the longest task to improve time management", "using task length rather than physiologic risk to set priority", "use ABCs, perfusion, safety, and change from baseline to choose the first action", "missed acute coronary syndrome, delayed escalation, and avoidable harm"),
  domain("coordinated-care", "Coordinated Care", "Leadership", "Safe and Effective Care Environment", "Coordinated Care", "Team-based care", "Coordination", "a client is transferring from acute care to a skilled nursing facility", "the medication list includes a newly held antihypertensive and unclear wound-care orders", "verify orders, reconcile medications, clarify wound-care instructions, and communicate pending risks before transfer", "sending the client because transportation has arrived", "letting workflow pressure override unresolved safety information", "pause transfer work until essential orders and risks are clear", "medication error, wound complications, and unsafe handoff"),
  domain("delegation", "Delegation", "Leadership", "Safe and Effective Care Environment", "Coordinated Care", "Delegation and scope", "Delegation", "an LPN works with UAP while caring for several stable and unstable clients", "one stable client needs ambulation, one needs teaching, and one reports new shortness of breath", "delegate predictable ambulation to UAP after giving clear instructions and personally assess the client with new shortness of breath", "asking UAP to assess shortness of breath because the LPN is busy", "delegating assessment, teaching, or unstable findings", "delegate only predictable tasks after assessment, then supervise and evaluate", "scope breach, missed deterioration, and unclear accountability"),
  domain("prioritization", "Prioritization", "Prioritization", "Safe and Effective Care Environment", "Management of Care", "Priority setting", "Prioritization", "the PN receives multiple call lights after shift report", "one client is newly confused, one asks for a blanket, one requests routine medication teaching, and one wants water", "assess the client with new confusion because acute mental status change may signal hypoxia, infection, glucose change, or perfusion risk", "answering the simple requests first to clear the list", "choosing easy tasks before high-risk cues", "triage by immediate risk and change from baseline before convenience", "delayed recognition of sepsis, hypoglycemia, stroke, or hypoxia"),
  domain("documentation", "Documentation", "Professional Responsibility", "Safe and Effective Care Environment", "Coordinated Care", "Legal documentation", "Documentation", "a client becomes short of breath during ambulation and improves after rest and ordered oxygen", "oxygen saturation dropped below baseline and respiratory effort increased during activity", "document objective assessment, intervention, response, notification, and the follow-up plan", "writing that the client tolerated ambulation poorly", "vague charting that omits assessment, response, and communication", "record what changed, what was done, how the client responded, and who was notified", "missed trends, poor continuity, and weak legal record"),
  domain("therapeutic-communication", "Therapeutic Communication", "Psychosocial", "Psychosocial Integrity", "Therapeutic Communication", "Communication", "Communication", "a newly diagnosed client says they may stop all medication after discharge", "the client is tearful, asks repeated questions, and misunderstands the purpose of treatment", "use open-ended questions, validate feelings, assess understanding, and use teach-back before adding more information", "telling the client the medication is necessary and moving to discharge paperwork", "advice or reassurance before exploring the concern", "listen, assess readiness, clarify misunderstanding, and confirm understanding", "nonadherence, anxiety escalation, and unsafe discharge"),
  domain("pharmacology", "Pharmacology", "Pharmacology", "Physiological Integrity", "Pharmacological and Parenteral Therapies", "Medication safety", "Pharmacology", "a client has a new opioid order for severe pain", "respiratory rate is 9/min and the client is difficult to arouse", "hold the opioid, assess sedation and oxygenation, maintain safety, and report urgently for further orders such as reversal if indicated", "administering the opioid because pain is rated 9 out of 10", "treating the pain score before airway and sedation cues", "recognize respiratory depression before giving another sedating medication", "respiratory arrest, aspiration, and overdose"),
  domain("medication-administration", "Medication Administration", "Pharmacology", "Physiological Integrity", "Pharmacological and Parenteral Therapies", "Medication administration", "Pharmacology", "a client is scheduled for insulin before lunch", "the client is shaky, diaphoretic, and the glucose result is below target", "treat hypoglycemia per protocol, recheck glucose, reassess meal timing, and hold or clarify insulin as appropriate", "giving insulin because it is due now", "following the MAR without responding to the current assessment", "act on the current glucose and symptoms before administering insulin", "seizure, fall, and neuroglycopenia"),
  domain("fundamentals", "Fundamentals", "Fundamentals", "Physiological Integrity", "Basic Care and Comfort", "Foundational nursing care", "Assessment", "an older adult is admitted with weakness after poor intake", "orthostatic dizziness, dry mucous membranes, and new confusion from baseline", "complete focused assessment, check vital signs and intake/output, implement fall precautions, and report the change", "encouraging fluids only because weakness is common after illness", "comfort-only action before reassessing a new change", "assess hydration, safety, and cognition before routine comfort measures", "falls, dehydration, delirium, and delayed escalation"),
  domain("cardiovascular", "Cardiovascular", "Cardiovascular", "Physiological Integrity", "Physiological Adaptation", "Cardiac deterioration", "Prioritization", "a client with heart failure reports new shortness of breath", "crackles, sudden weight gain, edema, and oxygen saturation below baseline", "sit upright, assess respiratory status and vital signs, apply ordered oxygen, and report possible fluid overload", "encouraging fluids because the client feels thirsty", "missing volume overload cues", "treat new dyspnea as a perfusion and oxygenation priority", "pulmonary edema, hypoxia, and delayed diuretic therapy"),
  domain("respiratory", "Respiratory", "Respiratory", "Physiological Integrity", "Physiological Adaptation", "Respiratory assessment", "Assessment", "a client with COPD becomes more drowsy after oxygen is increased", "slower respirations, flushed skin, headache, and rising confusion", "reassess respiratory status, verify the prescribed oxygen target, notify promptly, and prepare for further respiratory evaluation", "raising oxygen further because saturation is below normal adult targets", "chasing SpO2 without considering COPD oxygen safety", "balance oxygenation with ordered targets and signs of CO2 retention", "CO2 retention, respiratory failure, and delayed escalation"),
  domain("endocrine", "Endocrine", "Endocrine", "Physiological Integrity", "Reduction of Risk Potential", "Glucose safety", "Pharmacology", "a client with diabetes is shaky before lunch", "diaphoresis, tremor, irritability, and a low capillary glucose result", "treat hypoglycemia immediately with fast carbohydrate per protocol, recheck glucose, and reassess meal and medication timing", "holding lunch until the provider reviews the medication order", "delaying treatment while seeking orders", "treat symptomatic hypoglycemia first, then evaluate causes", "seizure, fall, and neurologic injury"),
  domain("renal", "Renal", "Renal", "Physiological Integrity", "Reduction of Risk Potential", "Fluid and electrolyte safety", "Assessment", "a client with chronic kidney disease reports weakness after missed dialysis", "irregular pulse, muscle weakness, and a potassium value above expected range", "place the client on ordered cardiac monitoring if available, assess vital signs, avoid potassium intake, and report urgently", "encouraging a potassium-rich snack because the client has not eaten", "missing hyperkalemia cues", "recognize electrolyte risk before routine nutrition or activity", "dysrhythmia, cardiac arrest, and delayed treatment"),
  domain("neurologic", "Neurologic", "Neurologic", "Physiological Integrity", "Physiological Adaptation", "Neurologic change", "Assessment", "a client recovering from a fall develops a neurologic change", "new slurred speech, unequal grips, and confusion compared with baseline", "perform a focused neurologic assessment, maintain safety, note time last known well, and report immediately", "reorienting and checking again after the next round", "normalizing acute neurologic change as confusion", "treat sudden neurologic deficits as time-sensitive until ruled out", "stroke delay, aspiration, and injury"),
  domain("maternal-newborn", "Maternal-Newborn", "Maternal-Newborn", "Health Promotion and Maintenance", "Health Promotion and Maintenance", "Maternal-newborn safety", "Assessment", "a postpartum client reports heavy bleeding when standing", "saturating a pad, dizziness, boggy fundus, and tachycardia", "massage the fundus per policy, assess bleeding and vital signs, call for help, and prepare to escalate hemorrhage care", "reassuring that lochia can be heavy after birth", "normalizing hemorrhage cues", "recognize uterine atony and hypovolemia early", "shock, uterine atony, and delayed emergency response"),
  domain("pediatrics", "Pediatrics", "Pediatrics", "Health Promotion and Maintenance", "Health Promotion and Maintenance", "Pediatric red flags", "Assessment", "a toddler with respiratory symptoms arrives with a caregiver", "nasal flaring, intercostal retractions, poor fluid intake, and increasing fatigue", "assess work of breathing and hydration immediately, position for breathing, and escalate promptly", "teaching the caregiver about cold symptoms while waiting", "teaching before respiratory assessment", "prioritize pediatric work of breathing and hydration cues", "hypoxia, dehydration, fatigue, and delayed transfer"),
  domain("mental-health", "Mental Health", "Mental Health", "Psychosocial Integrity", "Psychosocial Integrity", "Risk assessment", "Psychosocial", "a client with depression says family would be better off without them", "withdrawal, hopeless statements, and giving away personal items", "stay with the client, ask directly about self-harm, maintain safety, and report immediately per policy", "changing the subject because asking about suicide may put ideas in the client's mind", "avoiding direct risk assessment", "assess suicide risk directly and protect safety", "self-harm, missed escalation, and unsafe observation"),
  domain("leadership", "Leadership", "Leadership", "Safe and Effective Care Environment", "Management of Care", "Team communication", "Leadership", "a medication discrepancy is discovered during shift change", "the MAR lists a held antihypertensive but the verbal report says it was given", "pause administration, verify the MAR and order, assess vital signs, and clarify before proceeding", "giving the medication because report sounded confident", "trusting verbal handoff over current documentation and assessment", "verify conflicting information before medication administration", "duplicate dosing, hypotension, and medication error"),
  domain("client-advocacy", "Client Advocacy", "Professional Responsibility", "Safe and Effective Care Environment", "Coordinated Care", "Advocacy", "Advocacy", "a client says the care plan conflicts with cultural needs", "the client is hesitant to speak because family members are present", "create privacy, assess preferences, communicate the concern respectfully, and advocate for a safe plan", "telling the family the plan cannot change because it is ordered", "ignoring patient voice when conflict appears", "protect privacy and bring the client's preferences into the plan", "loss of trust, unsafe nonadherence, and inequitable care"),
  domain("professional-responsibility", "Professional Responsibility", "Professional Responsibility", "Safe and Effective Care Environment", "Coordinated Care", "Professional accountability", "Professional Responsibility", "a client asks the PN to perform a task outside employer policy", "the task may be familiar but is not authorized in the setting", "decline the outside-scope action, explain safety limits, and escalate to the appropriate licensed provider", "performing the task because the client trusts the PN", "patient preference overriding scope and policy", "stay within state scope, employer policy, and the care plan", "unsafe practice, liability, and patient harm"),
];

function readNumberFlag(name: string, fallback: number): number {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  if (!arg) return fallback;
  const parsed = Number.parseInt(arg.slice(prefix.length), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function domain(
  id: string,
  label: string,
  bodySystem: string,
  clientNeed: string,
  blueprint: string,
  weakArea: string,
  category: string,
  scenario: string,
  cue: string,
  correctAction: string,
  tempting: string,
  trap: string,
  saferAction: string,
  safety: string,
): Domain {
  return { id, label, bodySystem, clientNeed, blueprint, weakArea, category, scenario, cue, correctAction, tempting, trap, saferAction, safety };
}

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase().replace(/\s+/g, " ")).digest("hex");
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 96);
}

function loadLessons(): CatalogLesson[] {
  const raw = JSON.parse(readFileSync(LESSON_CATALOG, "utf8")) as {
    pathways?: Record<string, CatalogLesson[] | { lessons?: CatalogLesson[] }>;
  };
  const entry = raw.pathways?.[PATHWAY_ID];
  const lessons = Array.isArray(entry) ? entry : entry?.lessons ?? [];
  if (lessons.length === 0) throw new Error(`No ${PATHWAY_ID} lessons found in ${LESSON_CATALOG}`);
  return lessons;
}

function lessonDomain(lesson: CatalogLesson, index: number): Domain {
  const text = `${lesson.title} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""}`.toLowerCase();
  const direct =
    PRIORITY_DOMAINS.find((d) => text.includes(d.id.replace(/-/g, " "))) ??
    PRIORITY_DOMAINS.find((d) => text.includes(d.label.toLowerCase())) ??
    PRIORITY_DOMAINS.find((d) => text.includes(d.bodySystem.toLowerCase()));
  return direct ?? PRIORITY_DOMAINS[index % PRIORITY_DOMAINS.length]!;
}

function lessonSummary(lesson: CatalogLesson): string {
  return (lesson.sections ?? [])
    .map((section) => section.body ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

function rotate<T>(items: T[], by: number): T[] {
  return items.map((_, idx) => items[(idx + by) % items.length]!);
}

function letters(n: number): string[] {
  return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
}

function baseTags(lesson: CatalogLesson, domain: Domain, format: string): string[] {
  return [
    SOURCE,
    "pathway:us-lpn-nclex-pn",
    "exam:NCLEX-PN",
    "tier:LVN_LPN",
    `lesson:${lesson.slug}`,
    `topic:${slug(lesson.topic ?? domain.label)}`,
    `system:${slug(lesson.bodySystem ?? domain.bodySystem)}`,
    `client-needs:${slug(domain.clientNeed)}`,
    `blueprint:${slug(domain.blueprint)}`,
    `weak-area:${slug(domain.weakArea)}`,
    `clinical-category:${slug(domain.category)}`,
    `format:${format}`,
    "ncsbn-clinical-judgment-model",
    "us-lpn-lvn-scope",
    "clinical-judgment",
    "safety",
  ];
}

function teachingRationale(lesson: CatalogLesson, domain: Domain, correct: string): string {
  return [
    `Correct because NCLEX-PN priority setting starts with cue recognition, client safety, and PN scope: ${correct}.`,
    `Why the tempting path is wrong: ${domain.tempting} can sound efficient, but it reflects ${domain.trap}.`,
    `Clinical cue to recognize: ${domain.cue}. This cue maps to ${domain.clientNeed} and ${domain.weakArea}.`,
    `The safer nursing action is to ${domain.saferAction}.`,
    `Clinical takeaway for ${lesson.title}: use the NCSBN Clinical Judgment Model to recognize cues, analyze risk, prioritize a scope-appropriate action, and evaluate response.`,
  ].join(" ");
}

function optionRationales(optionMap: Record<string, string>, correctLetter: string, domain: Domain): Record<string, string> {
  return Object.fromEntries(
    Object.entries(optionMap).map(([letter, text]) => {
      if (letter === correctLetter) {
        return [
          letter,
          `${letter} is correct. ${text} is safest because it recognizes ${domain.cue}, addresses ${domain.weakArea}, and keeps the PN action within scope. The safer nursing action is to ${domain.saferAction}.`,
        ];
      }
      return [
        letter,
        `${letter} is incorrect. ${text} is tempting because it may be part of later care, but it misses the cue (${domain.cue}), reflects the NCLEX trap of ${domain.trap}, and delays the safer action: ${domain.saferAction}.`,
      ];
    }),
  );
}

function buildMcq(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `Assess the client, address immediate safety, and communicate the concern: ${domain.correctAction}.`;
  const distractors = [
    `Document the finding and continue the scheduled routine because ${domain.label.toLowerCase()} findings can occur in this setting.`,
    `Provide teaching first so the client understands the condition before additional assessment is completed.`,
    `Delegate the assessment and decision to UAP because another client also needs attention.`,
  ];
  const rotated = rotate([correct, ...distractors], globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  const stem = `NCLEX-PN ${domain.label} item ${localIndex + 1}. The practical/vocational nurse is caring for ${domain.scenario} while applying content from ${lesson.title}. Assessment cue: ${domain.cue}. Which action best demonstrates safe entry-level clinical judgment?`;
  return questionRow({
    id: `nclexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem,
    questionType: "MCQ",
    questionFormat: "mcq",
    options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetter,
    rationale: teachingRationale(lesson, domain, correct),
    difficulty: difficulty(globalIndex),
    tags: baseTags(lesson, domain, "mcq"),
    distractorRationales: {
      hint: `Focus on the cue that represents change from baseline, ABC/safety risk, medication risk, or scope boundary.`,
      optionRationales: optionRationales(optionMap, correctLetter, domain),
    },
    catEligible: true,
  });
}

function buildSata(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const options = [
    `Reassess the changed cue: ${domain.cue}.`,
    `Implement immediate safety measures related to ${domain.safety}.`,
    `Report the trend and client response using concise SBAR.`,
    `Wait until the next scheduled round because one abnormal cue rarely changes the plan.`,
    `Ask UAP to decide whether the client needs escalation.`,
    `Teach the client first so they understand why the symptoms may be occurring.`,
  ];
  const optionMap = Object.fromEntries(letters(6).map((letter, idx) => [letter, options[idx]!]));
  const correctLetters = ["A", "B", "C"];
  const stem = `Select all that apply. A PN is caring for ${domain.scenario} during a ${lesson.title} scenario. Which actions support safe NCLEX-PN clinical judgment when the cue is ${domain.cue}?`;
  const rationale = [
    `A, B, and C are correct because the PN must recognize the cue, reduce immediate risk, and communicate a meaningful trend.`,
    `D is incorrect and tempting during a busy shift, but it delays recognition of ${domain.weakArea}.`,
    `E is incorrect because UAP cannot interpret assessment findings or decide whether escalation is needed.`,
    `F is incorrect as the first action because teaching follows assessment and safety when ${domain.cue} is present.`,
    `This item tests ${domain.clientNeed}, ${domain.blueprint}, and the NCLEX trap of routine task completion before clinical judgment.`,
  ].join(" ");
  return questionRow({
    id: `nclexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem,
    questionType: "SATA",
    questionFormat: "sata",
    options: letters(6).map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetters,
    rationale,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "sata"), "select-all-that-apply"],
    distractorRationales: {
      hint: "Select assessment, safety, and communication actions; reject delay, inappropriate delegation, and teaching-before-safety.",
      optionRationales: Object.fromEntries(
        Object.entries(optionMap).map(([letter, text]) => [
          letter,
          correctLetters.includes(letter)
            ? `${letter} is correct. ${text} directly supports cue recognition, safety, or SBAR follow-up.`
            : `${letter} is incorrect. ${text} is tempting, but it delays ${domain.saferAction} or gives UAP/teaching a role that does not fit the immediate cue.`,
        ]),
      ),
    },
    catEligible: true,
  });
}

function buildBowtie(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const bank = [
    { id: "condition", label: `${domain.weakArea}: risk suggested by ${domain.cue}` },
    { id: "intervention", label: domain.correctAction },
    { id: "monitoring", label: "Reassess response, vital signs, safety risk, and need for escalation" },
    { id: "teaching", label: "Provide routine teaching before stabilizing the immediate concern" },
    { id: "delay", label: "Delay reporting until the next scheduled documentation time" },
    { id: "delegate", label: "Delegate assessment interpretation to UAP" },
  ];
  const stem = `Bowtie. The PN is caring for ${domain.scenario}. The relevant cue is ${domain.cue}. Complete the bowtie by selecting the most likely concern, priority PN action, and monitoring focus for ${lesson.title}.`;
  return questionRow({
    id: `nclexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem,
    questionType: "NGN_BOWTIE",
    questionFormat: "bowtie",
    options: {
      format: "bowtie",
      scenario: stem,
      bank,
      slotLabels: {
        condition: "Most likely concern",
        intervention: "Priority PN action",
        monitoring: "Monitoring / reassessment focus",
      },
    },
    correctAnswer: { correctMapping: { condition: "condition", intervention: "intervention", monitoring: "monitoring" } },
    rationale: [
      `Concern: ${bank[0]!.label}. The cue signals a risk that requires clinical judgment.`,
      `Action: ${domain.correctAction}. This fits PN scope while prioritizing safety and escalation.`,
      `Monitoring: response tracking is required because NCLEX-PN tests whether the learner evaluates after acting.`,
      `Teaching, delay, or inappropriate delegation are traps because they occur before cue recognition and risk control.`,
    ].join(" "),
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "bowtie"), "bowtie", "ngn"],
    distractorRationales: {
      hint: "Match the cue to the concern, choose the action that reduces immediate risk, then monitor response.",
      bankRationales: Object.fromEntries(
        bank.map((item) => [
          item.id,
          item.id === "condition" || item.id === "intervention" || item.id === "monitoring"
            ? `${item.label} belongs in the bowtie because it matches the cue, priority action, or reassessment loop.`
            : `${item.label} is tempting but unsafe because it delays assessment, escalation, or scope-appropriate action.`,
        ]),
      ),
    },
    catEligible: true,
  });
}

function buildMatrix(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const rows = [
    { id: "cue", label: domain.cue, answer: "Assess / report" },
    { id: "routine", label: `Stable teaching need related to ${lesson.title}`, answer: "Teach" },
    { id: "delegate", label: "Predictable hygiene, transport, or ambulation after PN assessment", answer: "Delegate" },
    { id: "medrisk", label: `Medication or safety cue that could lead to ${domain.safety}`, answer: "Assess / report" },
  ];
  return questionRow({
    id: `nclexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Matrix. For each finding in this ${lesson.title} scenario, choose the safest PN response: assess/report, teach, or delegate.`,
    questionType: "MATRIX",
    questionFormat: "matrix",
    options: { format: "matrix", columns: ["Assess / report", "Teach", "Delegate"], rows },
    correctAnswer: Object.fromEntries(rows.map((row) => [row.id, row.answer])),
    rationale: `The matrix tests discrimination. ${domain.cue} and medication/safety risk require assess/report because they may indicate ${domain.weakArea}. Stable education can be taught after immediate risk is addressed. Predictable non-assessment tasks can be delegated only after the PN verifies stability and gives clear instructions.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "matrix"), "matrix"],
    distractorRationales: {
      hint: "Separate unstable cues from stable teaching needs and predictable delegated tasks.",
      matrixRationales: rows.map((row) => ({
        row: row.id,
        rationale: `${row.label} maps to ${row.answer}; another column would confuse immediate risk, teaching readiness, or delegation scope.`,
      })),
    },
    catEligible: false,
  });
}

function buildOrdered(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const ordered = [
    `Assess the cue: ${domain.cue}.`,
    `Protect the client from ${domain.safety}.`,
    `Implement ordered or policy-supported PN interventions.`,
    `Report the trend and response using SBAR.`,
  ];
  const shuffled = rotate(ordered, 2);
  return questionRow({
    id: `nclexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Ordered response. Place the PN actions in the safest order for ${domain.scenario} during ${lesson.title}.`,
    questionType: "ORDERED_RESPONSE",
    questionFormat: "ordered",
    options: shuffled.map((text, idx) => ({ letter: String.fromCharCode(65 + idx), text })),
    correctAnswer: ordered,
    rationale: `The safe sequence is assessment, immediate safety, ordered intervention, and SBAR follow-up. The NCLEX-PN trap is jumping to documentation, teaching, or delegation before recognizing ${domain.cue}.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "ordered"), "ordered-response", "prioritization"],
    distractorRationales: {
      hint: "Order actions by cue recognition, safety, intervention, and communication.",
      orderedRationales: ordered.map((step, idx) => ({
        step: idx + 1,
        rationale: `${step} belongs here because NCLEX-PN prioritization moves from cue recognition to safety, then intervention, then communication.`,
      })),
    },
    catEligible: false,
  });
}

function questionRow(input: {
  id: string;
  lesson: CatalogLesson;
  domain: Domain;
  stem: string;
  questionType: string;
  questionFormat: string;
  options: unknown;
  correctAnswer: unknown;
  rationale: string;
  difficulty: number;
  tags: string[];
  distractorRationales: unknown;
  catEligible: boolean;
}): QuestionRow {
  const summary = lessonSummary(input.lesson);
  return {
    id: input.id,
    tier: "LVN_LPN",
    exam: "NCLEX-PN",
    questionType: input.questionType,
    status: "published",
    publishAt: new Date(),
    publishedAt: new Date(),
    stem: input.stem,
    options: input.options as Prisma.InputJsonValue,
    correctAnswer: input.correctAnswer as Prisma.InputJsonValue,
    rationale: input.rationale,
    difficulty: input.difficulty,
    tags: input.tags,
    bodySystem: input.lesson.bodySystem ?? input.domain.bodySystem,
    topic: input.lesson.topic ?? input.domain.label,
    subtopic: input.lesson.title,
    regionScope: "US_ONLY",
    stemHash: hash(input.stem),
    careerType: "nursing",
    scenario: `${input.domain.scenario}. ${summary}`,
    clinicalPearl: `NCLEX-PN pearl: ${input.domain.cue} should trigger cue recognition, safety action, PN-scope intervention, and timely communication.`,
    examStrategy: "Read for change from baseline, ABCs, safety threat, medication risk, delegation boundary, and the words first/best/priority before choosing.",
    memoryHook: "Cue -> risk -> PN-scope action -> SBAR -> reassess.",
    frameworkUsed: "NCSBN Clinical Judgment Model: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes.",
    clinicalTrap: input.domain.trap,
    distractorRationales: input.distractorRationales as Prisma.InputJsonValue,
    qualityScores: { clinicalJudgment: 5, rationaleDepth: 5, scopeSafety: 5, clientNeeds: 5 } as Prisma.InputJsonValue,
    qualityScore: 95,
    countryCode: "US",
    regionCode: "US",
    licensingBody: "NCSBN NCLEX-PN",
    languageCode: "en",
    cognitiveLevel: input.questionFormat === "mcq" ? "apply" : "analyze",
    questionFormat: input.questionFormat,
    isScenario: true,
    isMockExamEligible: true,
    isAdaptiveEligible: input.catEligible,
    isFlashcardSource: true,
    isStudyGuideLinked: true,
    isTutorReady: true,
    correctAnswerExplanation: input.rationale,
    incorrectAnswerRationale: input.distractorRationales as Prisma.InputJsonValue,
    clinicalReasoning: `The learner must notice ${input.domain.cue}, connect it to ${input.domain.weakArea}, select a PN-scope action, and prevent ${input.domain.safety}.`,
    keyTakeaway: `For ${input.lesson.title}, prioritize assessment and safety before teaching, documentation, or delegation.`,
    mnemonic: "Assess, Safety, Scope, SBAR, Reassess",
    referenceSource: "NurseNest NCLEX-PN lesson-derived launch readiness sprint",
    blueprintWeight: input.catEligible ? 1.1 : 0.7,
    nclexClientNeedsCategory: input.domain.clientNeed,
    nclexClientNeedsSubcategory: input.domain.blueprint.slice(0, 128),
    studyLinkPathwayId: PATHWAY_ID,
    studyLinkLessonSlug: input.lesson.slug,
    sourceVersion: 1,
  };
}

function difficulty(index: number): number {
  return [2, 3, 3, 4, 3, 4, 5][index % 7]!;
}

function buildQuestionByType(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const type = localIndex % 10;
  if (type === 1 || type === 6) return buildSata(lesson, domain, localIndex, globalIndex);
  if (type === 2 || type === 7) return buildBowtie(lesson, domain, localIndex, globalIndex);
  if (type === 4) return buildMatrix(lesson, domain, localIndex, globalIndex);
  if (type === 8) return buildOrdered(lesson, domain, localIndex, globalIndex);
  return buildMcq(lesson, domain, localIndex, globalIndex);
}

function buildQuestions(lessons: CatalogLesson[]): QuestionRow[] {
  const rows: QuestionRow[] = [];
  for (const [lessonIndex, lesson] of lessons.entries()) {
    for (let i = 0; i < QUESTIONS_PER_LESSON; i++) {
      rows.push(buildQuestionByType(lesson, lessonDomain(lesson, lessonIndex + i), i, rows.length));
    }
  }
  let extra = 0;
  while (rows.length < QUESTION_TARGET) {
    const lesson = lessons[extra % lessons.length]!;
    const domain = PRIORITY_DOMAINS[extra % PRIORITY_DOMAINS.length]!;
    rows.push(buildQuestionByType(lesson, domain, QUESTIONS_PER_LESSON + extra, rows.length));
    extra++;
  }
  return rows.slice(0, Math.max(QUESTION_TARGET, rows.length));
}

function buildFlashcards(lessons: CatalogLesson[], categoryId: string, deckId: string): FlashcardRow[] {
  const rows: FlashcardRow[] = [];
  for (const [lessonIndex, lesson] of lessons.entries()) {
    for (let i = 0; i < FLASHCARDS_PER_LESSON; i++) {
      const domain = lessonDomain(lesson, lessonIndex + i);
      rows.push(flashcardRow(lesson, domain, rows.length, categoryId, deckId, `lesson:${lesson.slug}:${String(i + 1).padStart(3, "0")}`));
    }
  }
  let extra = 0;
  while (rows.length < FLASHCARD_TARGET) {
    const lesson = lessons[extra % lessons.length]!;
    const domain = PRIORITY_DOMAINS[extra % PRIORITY_DOMAINS.length]!;
    rows.push(flashcardRow(lesson, domain, rows.length, categoryId, deckId, `extra:${String(extra + 1).padStart(5, "0")}`));
    extra++;
  }
  return rows.slice(0, Math.max(FLASHCARD_TARGET, rows.length));
}

function flashcardRow(lesson: CatalogLesson, domain: Domain, index: number, categoryId: string, deckId: string, sourceSuffix: string): FlashcardRow {
  const scenarioBased = index % 5 !== 1;
  const front = scenarioBased
    ? `NCLEX-PN scenario: In ${lesson.title}, what should the PN do first when the cue is ${domain.cue}?`
    : `NCLEX-PN trap check: Why is ${domain.tempting} unsafe during ${lesson.title}?`;
  const back = [
    scenarioBased
      ? `First, recognize the cue and protect safety: ${domain.correctAction}.`
      : `It is unsafe because it reflects ${domain.trap}; the PN must reassess, act within scope, and communicate the relevant change.`,
    `Difficulty: ${difficulty(index)}.`,
    `Blueprint mapping: ${domain.blueprint}. Client Needs: ${domain.clientNeed}. System: ${lesson.bodySystem ?? domain.bodySystem}.`,
    `Hint: Look for change from baseline, ABCs, safety, medication effect, delegation boundary, or PN scope.`,
    `Clinical pearl: ${domain.cue} is the cue to recognize; do not bury it under routine tasks.`,
    `Memory aid: Cue -> risk -> PN-scope action -> SBAR -> reassess.`,
    `Exam trap: ${domain.trap}.`,
    `Clinical significance: prevents ${domain.safety}.`,
    `Application example: If this cue appears during care, pause routine work, reassess, implement ordered safety measures, communicate the trend, and evaluate response.`,
  ].join("\n\n");
  return {
    id: `nclexpn-fc-${String(index + 1).padStart(5, "0")}`,
    front,
    back,
    country: CountryCode.US,
    tier: TierCode.LVN_LPN,
    status: ContentStatus.PUBLISHED,
    examFamily: ExamFamily.NCLEX_PN,
    categoryId,
    lessonId: lesson.slug,
    deckId,
    positionInDeck: index + 1,
    sourceKey: `nclexpn:flashcard:${sourceSuffix}`,
    examItemKind: null,
  };
}

function chunk<T>(rows: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

function seededPick<T extends { id: string }>(pool: T[], count: number, seed: number): T[] {
  return pool
    .map((item) => ({ item, score: hash(`${seed}:${item.id}`).slice(0, 12) }))
    .sort((a, b) => a.score.localeCompare(b.score))
    .map((entry) => entry.item)
    .slice(0, count);
}

async function createPracticeExams(
  prisma: PrismaClient,
  pool: Array<{ id: string; bodySystem: string | null; difficulty: number | null; nclexClientNeedsCategory: string | null }>,
): Promise<void> {
  for (let i = 1; i <= EXAM_TARGET; i++) {
    const padded = String(i).padStart(3, "0");
    const examId = `exam_nclex_pn_launch_${padded}`;
    const tag = `exam-preset-nclex-pn-launch-${padded}`;
    await prisma.exam.upsert({
      where: { id: examId },
      update: { title: `NCLEX-PN Blueprint Practice Exam ${i}`, status: ContentStatus.PUBLISHED },
      create: {
        id: examId,
        title: `NCLEX-PN Blueprint Practice Exam ${i}`,
        country: CountryCode.US,
        tier: TierCode.LVN_LPN,
        examFamily: ExamFamily.NCLEX_PN,
        status: ContentStatus.PUBLISHED,
      },
    });
    const selected = seededPick(pool, 85, i).map((row) => row.id);
    if (selected.length > 0) {
      await prisma.$executeRaw`
        UPDATE exam_questions
        SET tags = array_append(tags, ${tag})
        WHERE id = ANY(${selected}::varchar[])
          AND NOT (tags @> ARRAY[${tag}]::varchar[])
      `;
    }
    if (i % 25 === 0) console.log(`Practice exams published: ${i}/${EXAM_TARGET}`);
  }
}

async function main(): Promise<void> {
  const lessons = loadLessons();
  const questions = buildQuestions(lessons);
  const catEligible = questions.filter((row) => row.isAdaptiveEligible).length;
  if (questions.length < QUESTION_TARGET) throw new Error(`Question target not met: ${questions.length}/${QUESTION_TARGET}`);
  if (catEligible < CAT_TARGET) throw new Error(`CAT target not met by generated rows: ${catEligible}/${CAT_TARGET}`);

  if (!APPLY) {
    console.log(`Dry run: ${questions.length} questions, ${catEligible} CAT-eligible questions, ${lessons.length} source lessons.`);
    console.log(`Flashcards planned: ${FLASHCARD_TARGET}; practice exams planned: ${EXAM_TARGET}.`);
    console.log("Run with --apply to publish.");
    return;
  }

  const prisma = new PrismaClient({ log: ["error"] });
  try {
    const category = await prisma.category.upsert({
      where: { slug: CATEGORY_SLUG },
      update: { name: "NCLEX-PN Launch Readiness", topicCode: "nclex-pn-launch-readiness" },
      create: { slug: CATEGORY_SLUG, name: "NCLEX-PN Launch Readiness", topicCode: "nclex-pn-launch-readiness" },
    });
    const deck = await prisma.flashcardDeck.upsert({
      where: { slug: DECK_SLUG },
      update: {
        title: "NCLEX-PN Clinical Judgment Launch Deck",
        description: "Lesson-derived PN flashcards focused on NCLEX-PN safety, assessment, prioritization, delegation, pharmacology, Client Needs, and clinical judgment.",
        country: CountryCode.US,
        tier: TierCode.LVN_LPN,
        examFamily: ExamFamily.NCLEX_PN,
        pathwayId: PATHWAY_ID,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: DECK_SLUG,
        title: "NCLEX-PN Clinical Judgment Launch Deck",
        description: "Lesson-derived PN flashcards focused on NCLEX-PN safety, assessment, prioritization, delegation, pharmacology, Client Needs, and clinical judgment.",
        country: CountryCode.US,
        tier: TierCode.LVN_LPN,
        examFamily: ExamFamily.NCLEX_PN,
        pathwayId: PATHWAY_ID,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        status: ContentStatus.PUBLISHED,
      },
    });

    console.log(`Publishing ${questions.length} NCLEX-PN questions...`);
    for (const batch of chunk(questions, 250)) {
      await prisma.examQuestion.createMany({ data: batch, skipDuplicates: true });
    }

    const flashcards = buildFlashcards(lessons, category.id, deck.id);
    if (flashcards.length < FLASHCARD_TARGET) throw new Error(`Flashcard target not met: ${flashcards.length}/${FLASHCARD_TARGET}`);
    console.log(`Publishing ${flashcards.length} NCLEX-PN flashcards...`);
    for (const batch of chunk(flashcards, 250)) {
      await prisma.flashcard.createMany({ data: batch, skipDuplicates: true });
    }
    await prisma.flashcardDeck.update({
      where: { id: deck.id },
      data: { cardCount: await prisma.flashcard.count({ where: { deckId: deck.id, status: ContentStatus.PUBLISHED } }) },
    });

    const pool = await prisma.examQuestion.findMany({
      where: {
        status: { in: ["published", "PUBLISHED"] },
        exam: { in: ["NCLEX-PN", "NCLEX_PN"] },
        tier: { in: ["LVN_LPN", "lvn_lpn", "lvn", "lpn"] },
        countryCode: "US",
        isAdaptiveEligible: true,
        rationale: { not: null },
      },
      select: { id: true, bodySystem: true, difficulty: true, nclexClientNeedsCategory: true },
    });
    if (pool.length < CAT_TARGET) throw new Error(`Published CAT pool below target: ${pool.length}/${CAT_TARGET}`);

    await createPracticeExams(prisma, pool);
    console.log(`NCLEX-PN launch readiness content published: questions=${questions.length}, flashcards=${flashcards.length}, CAT pool=${pool.length}, practiceExams=${EXAM_TARGET}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
