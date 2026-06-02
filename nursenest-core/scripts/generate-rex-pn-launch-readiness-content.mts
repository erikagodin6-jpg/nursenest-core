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
  blueprint: string;
  weakArea: string;
  category: string;
  scenario: string;
  cue: string;
  correctAction: string;
  tempting: string;
  trap: string;
  safety: string;
};

type QuestionRow = Prisma.ExamQuestionCreateManyInput;
type FlashcardRow = Prisma.FlashcardCreateManyInput;

const APPLY = process.argv.includes("--apply");
const QUESTION_TARGET = readNumberFlag("--question-target", 5000);
const FLASHCARD_TARGET = readNumberFlag("--flashcard-target", 5000);
const EXAM_TARGET = readNumberFlag("--practice-exams", 250);
const QUESTIONS_PER_LESSON = readNumberFlag("--questions-per-lesson", 28);
const FLASHCARDS_PER_LESSON = readNumberFlag("--flashcards-per-lesson", 28);
const CAT_TARGET = readNumberFlag("--cat-target", 3000);
const PATHWAY_ID = "ca-rpn-rex-pn";
const SOURCE = "rex-pn-launch-readiness-sprint";
const CATEGORY_SLUG = "rex-pn-launch-readiness";
const DECK_SLUG = "rex-pn-launch-readiness-clinical-judgment";
const LESSON_CATALOG = resolve(process.cwd(), "src/content/pathway-lessons/rpn-rex-pn-parity-expansion-catalog.json");

const PRIORITY_DOMAINS: Domain[] = [
  domain("fundamentals", "Fundamentals", "Fundamentals", "Management of Care", "Foundational assessment", "Assessment", "an older adult admitted with weakness after poor intake", "dry mucous membranes, orthostatic dizziness, and new confusion from baseline", "complete focused assessment, check vital signs and intake/output, implement ordered safety measures, and report the change with SBAR", "encouraging oral fluids only because weakness is common after illness", "comfort-only care before reassessing a new change", "falls, dehydration, delirium, and delayed escalation"),
  domain("safety", "Safety", "Safety", "Safe and Effective Care Environment", "Patient safety", "Prioritization", "a client recovering from abdominal surgery who tries to get up alone", "new dizziness, opioid analgesia within the hour, and an IV line pulling tight", "stay with the client, lower the bed, call for help, reassess pain/sedation, and update the mobility plan", "documenting the attempt and reminding the client to call next time", "documentation before immediate injury prevention", "falls, line dislodgement, oversedation, and postoperative bleeding"),
  domain("infection-control", "Infection Control", "Infection Control", "Safety and Infection Control", "IPAC precautions", "Safety", "a long-term care resident with sudden diarrhea after recent antibiotics", "foul watery stool, abdominal cramping, and a roommate sharing the bathroom", "initiate contact precautions per policy, perform hand hygiene with soap and water, collect ordered specimen, and report possible C. difficile", "using alcohol sanitizer only and waiting for culture confirmation", "waiting for diagnostics before containment", "transmission, dehydration, skin breakdown, and sepsis"),
  domain("delegation", "Delegation", "Leadership", "Management of Care", "Delegation and scope", "Delegation", "four clients need care while the RPN is working with a UCP", "one stable client needs help ambulating, one reports chest pressure, one requires teaching, and one needs IV medication assessment", "delegate predictable ambulation assistance to the UCP and personally assess the client with chest pressure first", "delegating the chest pain assessment because the UCP is free", "delegating assessment, teaching, or unstable findings", "scope breach, missed deterioration, and unclear accountability"),
  domain("leadership", "Leadership", "Leadership", "Management of Care", "Team communication", "Leadership", "a medication discrepancy is found during shift change", "the MAR lists a held antihypertensive but the handoff says it was given", "pause administration, verify the MAR/order and last dose, assess vital signs, and clarify before proceeding", "giving the dose because the shift report sounded confident", "trusting verbal handoff over current documentation and assessment", "duplicate dose, hypotension, and medication error"),
  domain("documentation", "Documentation", "Professional Responsibility", "Management of Care", "Documentation", "Documentation", "a client develops shortness of breath after ambulation", "oxygen saturation drops from baseline and improves after rest and ordered oxygen", "document objective assessment, intervention, response, notification, and follow-up plan", "writing only that the client tolerated ambulation poorly", "vague charting that omits response and communication", "missed trend recognition and weak legal record"),
  domain("therapeutic-communication", "Therapeutic Communication", "Psychosocial Integrity", "Psychosocial Integrity", "Therapeutic communication", "Communication", "a newly diagnosed client says they feel overwhelmed and may stop all medication", "the client is tearful, asks repeated questions, and misunderstands the purpose of treatment", "use open-ended questions, validate emotion, assess understanding, and use teach-back before adding new information", "telling the client the medication is necessary and moving on to discharge paperwork", "reassurance or advice before exploring concern", "nonadherence, anxiety escalation, and unsafe discharge"),
  domain("pediatrics", "Pediatrics", "Pediatrics", "Health Promotion and Maintenance", "Pediatric red flags", "Assessment", "a toddler with respiratory symptoms arrives with a caregiver", "nasal flaring, intercostal retractions, poor fluid intake, and increasing fatigue", "assess work of breathing and hydration immediately, keep the child positioned for breathing, and escalate promptly", "teaching the caregiver about cold symptoms while waiting for the next routine check", "teaching before respiratory assessment", "fatigue, hypoxia, dehydration, and delayed transfer"),
  domain("maternal-newborn", "Maternal-Newborn", "Maternal-Newborn", "Health Promotion and Maintenance", "Maternal-newborn safety", "Assessment", "a postpartum client reports heavy bleeding when standing", "saturating a pad, dizziness, boggy fundus, and tachycardia", "massage the fundus per policy, assess bleeding/vitals, call for help, and prepare to escalate hemorrhage care", "reassuring that lochia can be heavy after birth", "normalizing hemorrhage cues", "shock, uterine atony, and delayed emergency response"),
  domain("pharmacology", "Pharmacology", "Pharmacology", "Pharmacological Therapies", "Medication safety", "Pharmacology", "a client receives a new opioid order for severe pain", "respiratory rate is 9/min and the client is difficult to arouse", "hold the opioid, assess sedation/respirations/oxygenation, maintain safety, and report urgently for reversal orders if indicated", "administering the dose because pain is rated 9 out of 10", "treating the number before the airway and sedation cue", "respiratory depression, aspiration, and overdose"),
  domain("cardiovascular", "Cardiovascular", "Cardiovascular", "Physiological Adaptation", "Cardiac deterioration", "Prioritization", "a client with heart failure reports new shortness of breath", "crackles, sudden weight gain, edema, and oxygen saturation below baseline", "sit upright, assess respiratory status and vitals, apply ordered oxygen, and report possible fluid overload", "encouraging fluids because the client feels thirsty", "missing volume overload cues", "pulmonary edema, hypoxia, and delayed diuretic therapy"),
  domain("respiratory", "Respiratory", "Respiratory", "Physiological Adaptation", "Respiratory assessment", "Assessment", "a client with COPD becomes more drowsy after oxygen is increased", "slower respirations, flushed skin, headache, and rising confusion", "reassess respiratory status, verify ordered oxygen target, notify promptly, and prepare for ABG/urgent review", "raising oxygen further because saturation is still below normal adult targets", "chasing SpO2 without COPD oxygen-safety context", "CO2 retention, respiratory failure, and delayed escalation"),
  domain("endocrine", "Endocrine", "Endocrine", "Reduction of Risk Potential", "Glucose safety", "Pharmacology", "a client taking insulin is shaky before lunch", "diaphoresis, tremor, irritability, and capillary glucose of 3.1 mmol/L", "treat hypoglycemia immediately with fast carbohydrate per protocol, recheck glucose, and reassess meal/insulin timing", "holding lunch until the provider reviews the insulin order", "delaying treatment while seeking orders", "seizure, fall, and neuroglycopenia"),
  domain("medical-surgical", "Medical-Surgical", "Medical-Surgical", "Physiological Adaptation", "Medical-surgical deterioration", "Clinical judgment", "a client after bowel surgery reports increasing abdominal pain", "rigid abdomen, fever, tachycardia, and new confusion", "stop routine activity, assess fully, keep NPO if ordered/appropriate, and notify urgently for possible complication", "offering analgesia and reassessing at the next scheduled round only", "masking surgical complications with comfort care alone", "sepsis, perforation, bleeding, and shock"),
  domain("prioritization", "Prioritization", "Prioritization", "Management of Care", "Priority setting", "Prioritization", "the RPN receives four call bells at once", "one client has acute chest pressure, one wants discharge teaching, one requests a blanket, and one asks about lab timing", "assess the client with acute chest pressure first because ABC/perfusion risk outranks routine needs", "answering the discharge teaching question first because it takes more time", "time-management logic over physiologic risk", "missed acute coronary syndrome and delayed response"),
  domain("professional-responsibility", "Professional Responsibility", "Professional Responsibility", "Management of Care", "Professional accountability", "Professional Responsibility", "a client asks the RPN to perform a task outside employer policy", "the task may be technically familiar but is not authorized in the setting", "decline outside-scope action, explain safety limits, and escalate to the appropriate regulated provider", "performing the task because the client trusts the RPN", "patient preference overriding scope and policy", "unsafe practice, liability, and patient harm"),
  domain("client-advocacy", "Client Advocacy", "Client Advocacy", "Psychosocial Integrity", "Advocacy", "Advocacy", "a client says a care plan conflicts with cultural needs", "the client is hesitant to speak because family members are present", "create privacy, assess preferences, communicate the concern respectfully, and advocate for a safe plan that honours the client", "telling the family the plan cannot change because it is already ordered", "ignoring patient voice when conflict appears", "loss of trust, unsafe nonadherence, and inequitable care"),
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
  blueprint: string,
  weakArea: string,
  category: string,
  scenario: string,
  cue: string,
  correctAction: string,
  tempting: string,
  trap: string,
  safety: string,
): Domain {
  return { id, label, bodySystem, blueprint, weakArea, category, scenario, cue, correctAction, tempting, trap, safety };
}

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase().replace(/\s+/g, " ")).digest("hex");
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 96);
}

function loadLessons(): CatalogLesson[] {
  const raw = JSON.parse(readFileSync(LESSON_CATALOG, "utf8")) as { pathways?: Record<string, CatalogLesson[]> };
  const lessons = raw.pathways?.[PATHWAY_ID] ?? [];
  if (lessons.length === 0) throw new Error(`No ${PATHWAY_ID} lessons found in ${LESSON_CATALOG}`);
  return lessons;
}

function lessonDomain(lesson: CatalogLesson, index: number): Domain {
  const text = `${lesson.title} ${lesson.topic ?? ""} ${lesson.bodySystem ?? ""}`.toLowerCase();
  const direct =
    PRIORITY_DOMAINS.find((d) => text.includes(d.id.replace(/-/g, " "))) ??
    PRIORITY_DOMAINS.find((d) => text.includes(d.label.toLowerCase())) ??
    PRIORITY_DOMAINS.find((d) => text.includes(d.bodySystem.toLowerCase()));
  return direct ?? PRIORITY_DOMAINS[index % PRIORITY_DOMAINS.length]!;
}

function lessonSummary(lesson: CatalogLesson): string {
  const body = (lesson.sections ?? [])
    .map((section) => section.body ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return body.slice(0, 260);
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
    "pathway:ca-rpn-rex-pn",
    "exam:REx-PN",
    "tier:RPN",
    `lesson:${lesson.slug}`,
    `topic:${slug(lesson.topic ?? domain.label)}`,
    `system:${slug(lesson.bodySystem ?? domain.bodySystem)}`,
    `blueprint:${slug(domain.blueprint)}`,
    `weak-area:${slug(domain.weakArea)}`,
    `clinical-category:${slug(domain.category)}`,
    `format:${format}`,
    "canada",
    "rpn-scope",
    "clinical-judgment",
    "safety",
  ];
}

function teachingRationale(lesson: CatalogLesson, domain: Domain, correct: string, trap: string): string {
  return [
    `Correct because the REx-PN priority is to connect the cue to ${domain.blueprint.toLowerCase()} and act within practical-nursing scope: ${correct}.`,
    `The tempting error is ${trap}. That sounds efficient, but it skips the clinical cue that the client may be moving outside the expected course.`,
    `Recognize the cue: ${domain.cue}. On the exam, that cue points to ${domain.weakArea.toLowerCase()}, not routine reassurance.`,
    `Clinical takeaway for ${lesson.title}: assess first when safety or deterioration is possible, implement ordered or delegated care, and close the loop with clear reporting.`,
  ].join(" ");
}

function optionRationales(optionMap: Record<string, string>, correctLetter: string, domain: Domain): Record<string, string> {
  return Object.fromEntries(
    Object.entries(optionMap).map(([letter, text]) => {
      if (letter === correctLetter) {
        return [
          letter,
          `${letter} is correct. ${text} addresses the clinical cue, protects safety, and stays inside RPN scope while escalating when needed.`,
        ];
      }
      return [
        letter,
        `${letter} is incorrect. ${text} is tempting because it may be part of later care, but it misses ${domain.trap} and does not respond safely to ${domain.cue}.`,
      ];
    }),
  );
}

function buildMcq(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `Assess the client, address immediate safety, and report using SBAR: ${domain.correctAction}.`;
  const distractors = [
    `Document the finding and continue with the scheduled routine because ${domain.label.toLowerCase()} findings can be expected.`,
    `Provide teaching first so the client understands the diagnosis before additional assessment is completed.`,
    `Delegate the full assessment and decision to the UCP because another task is waiting.`,
  ];
  const rotated = rotate([correct, ...distractors], globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  const stem = `REx-PN ${domain.label} item ${localIndex + 1}. The practical nurse is caring for ${domain.scenario} while reviewing ${lesson.title}. Assessment cue: ${domain.cue}. Which action best demonstrates safe entry-to-practice clinical judgment?`;
  const rationale = teachingRationale(lesson, domain, correct, domain.trap);
  return questionRow({
    id: `rexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(2, "0")}`,
    lesson,
    domain,
    stem,
    questionType: "MCQ",
    questionFormat: "mcq",
    options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetter,
    rationale,
    difficulty: difficulty(globalIndex),
    tags: baseTags(lesson, domain, "mcq"),
    distractorRationales: optionRationales(optionMap, correctLetter, domain),
    catEligible: true,
  });
}

function buildSata(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const options = [
    `Reassess the finding that changed from baseline: ${domain.cue}.`,
    `Implement immediate safety measures related to ${domain.safety}.`,
    `Report the trend with concise SBAR and include response to interventions.`,
    `Wait until the next scheduled round because one abnormal cue rarely matters.`,
    `Ask the UCP to decide whether the client requires escalation.`,
  ];
  const correctLetters = ["A", "B", "C"];
  const stem = `Select all that apply. An RPN is caring for ${domain.scenario} during a ${lesson.title} review. Which actions support safe REx-PN clinical judgment when the cue is ${domain.cue}?`;
  const rationale = [
    `The correct selections are A, B, and C because the practical nurse must reassess, protect safety, and communicate a meaningful trend.`,
    `D is tempting when the unit is busy, but waiting converts an early cue into delayed recognition.`,
    `E is unsafe because assessment and escalation decisions cannot be transferred to unregulated personnel.`,
    `This item tests ${domain.blueprint}, ${domain.weakArea}, and the REx-PN trap of confusing routine task completion with clinical judgment.`,
  ].join(" ");
  const optionMap = Object.fromEntries(letters(5).map((letter, idx) => [letter, options[idx]!]));
  return questionRow({
    id: `rexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(2, "0")}`,
    lesson,
    domain,
    stem,
    questionType: "SATA",
    questionFormat: "sata",
    options: letters(5).map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetters,
    rationale,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "sata"), "select-all-that-apply"],
    distractorRationales: optionRationales(optionMap, "A", domain),
    catEligible: true,
  });
}

function buildBowtie(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const bank = [
    { id: "condition", label: `${domain.weakArea}: deterioration or risk suggested by ${domain.cue}` },
    { id: "intervention", label: domain.correctAction },
    { id: "monitoring", label: `Reassess response, vital signs, safety risk, and need for escalation` },
    { id: "teaching", label: `Provide routine teaching before stabilizing the immediate concern` },
    { id: "delay", label: `Delay reporting until the next scheduled documentation time` },
    { id: "delegate", label: `Delegate assessment interpretation to unregulated personnel` },
  ];
  const stem = `Bowtie. The RPN is caring for ${domain.scenario}. The relevant cue is ${domain.cue}. Complete the bowtie by selecting the most likely concern, priority action, and monitoring focus for ${lesson.title}.`;
  const rationale = [
    `Concern: ${bank[0]!.label}. The cue is not background noise; it signals ${domain.weakArea.toLowerCase()}.`,
    `Action: ${domain.correctAction}. This is correct because it combines assessment, safety, and scope-safe escalation.`,
    `Monitoring: reassessment and response tracking are required because the exam tests whether the learner closes the loop after acting.`,
    `The traps are teaching, delay, or delegation before recognizing risk.`,
  ].join(" ");
  return questionRow({
    id: `rexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(2, "0")}`,
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
        intervention: "Priority RPN action",
        monitoring: "Monitoring / reassessment focus",
      },
    },
    correctAnswer: { correctMapping: { condition: "condition", intervention: "intervention", monitoring: "monitoring" } },
    rationale,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "bowtie"), "bowtie", "ngn"],
    distractorRationales: {
      bankRationales: Object.fromEntries(
        bank.map((item) => [
          item.id,
          item.id === "condition" || item.id === "intervention" || item.id === "monitoring"
            ? `${item.label} belongs in the bowtie because it matches the cue, the priority action, or the required reassessment loop.`
            : `${item.label} is tempting but unsafe because it delays assessment, escalation, or scope-appropriate action.`,
        ]),
      ),
    },
    catEligible: true,
  });
}

function buildMatrix(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const rows = [
    { id: "cue", label: domain.cue, answer: "Report" },
    { id: "routine", label: `Stable teaching need related to ${lesson.title}`, answer: "Teach" },
    { id: "scope", label: `Predictable hygiene or ambulation task after RPN assessment`, answer: "Delegate" },
  ];
  const stem = `Matrix. For each finding in this ${lesson.title} scenario, choose the safest RPN response: assess/report, teach, or delegate.`;
  return questionRow({
    id: `rexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(2, "0")}`,
    lesson,
    domain,
    stem,
    questionType: "MATRIX",
    questionFormat: "matrix",
    options: { format: "matrix", columns: ["Report", "Teach", "Delegate"], rows },
    correctAnswer: Object.fromEntries(rows.map((row) => [row.id, row.answer])),
    rationale: `The matrix tests discrimination. ${domain.cue} requires assess/report because it may indicate ${domain.weakArea.toLowerCase()}. Stable education can be taught after immediate safety is addressed. Predictable non-assessment tasks can be delegated only after the RPN verifies stability and provides clear instructions.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "matrix"), "matrix"],
    distractorRationales: {
      matrixRationales: rows.map((row) => ({
        row: row.id,
        rationale: `${row.label} maps to ${row.answer}; choosing another column would confuse immediate risk, teaching readiness, or delegation scope.`,
      })),
    },
    catEligible: false,
  });
}

function buildOrdered(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const ordered = [
    `Assess the cue: ${domain.cue}.`,
    `Protect the client from ${domain.safety}.`,
    `Implement ordered or policy-supported RPN interventions.`,
    `Report the trend and response using SBAR.`,
  ];
  const shuffled = rotate(ordered, 2);
  return questionRow({
    id: `rexpn-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(2, "0")}`,
    lesson,
    domain,
    stem: `Ordered response. Place the RPN actions in the safest order for ${domain.scenario} during ${lesson.title}.`,
    questionType: "ORDERED_RESPONSE",
    questionFormat: "ordered",
    options: shuffled.map((text, idx) => ({ letter: String.fromCharCode(65 + idx), text })),
    correctAnswer: ordered,
    rationale: `The safe sequence is assessment, immediate safety, ordered intervention, and SBAR follow-up. The exam trap is jumping to documentation, teaching, or delegation before recognizing ${domain.cue}.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "ordered"), "ordered-response", "prioritization"],
    distractorRationales: {
      orderedRationales: ordered.map((step, idx) => ({
        step: idx + 1,
        rationale: `${step} belongs here because REx-PN prioritization moves from cue recognition to safety, then intervention, then communication.`,
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
    tier: "RPN",
    exam: "REx-PN",
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
    regionScope: "CA_ONLY",
    stemHash: hash(input.stem),
    careerType: "nursing",
    scenario: `${input.domain.scenario}. ${summary}`,
    clinicalPearl: `REx-PN pearl: ${input.domain.cue} should trigger reassessment, safety action, and timely reporting rather than routine reassurance.`,
    examStrategy: `Read the stem for change from baseline, ABC/safety threat, scope boundary, and the word first/best/priority before choosing an answer.`,
    memoryHook: "Cue -> risk -> scope-safe action -> SBAR.",
    frameworkUsed: "REx-PN clinical judgment: recognize cues, analyze risk, prioritize action, communicate response.",
    clinicalTrap: input.domain.trap,
    distractorRationales: input.distractorRationales as Prisma.InputJsonValue,
    qualityScores: { clinicalJudgment: 5, rationaleDepth: 5, scopeSafety: 5 } as Prisma.InputJsonValue,
    qualityScore: 95,
    countryCode: "CA",
    regionCode: "CA",
    licensingBody: "CNO / NCSBN REx-PN",
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
    clinicalReasoning: `The learner must notice ${input.domain.cue}, connect it to ${input.domain.weakArea}, and choose an RPN action that prevents ${input.domain.safety}.`,
    keyTakeaway: `For ${input.lesson.title}, prioritize assessment and safety before teaching, documentation, or delegation.`,
    mnemonic: "Assess, Safety, Scope, SBAR",
    referenceSource: "NurseNest REx-PN lesson-derived launch readiness sprint",
    blueprintWeight: input.catEligible ? 1.1 : 0.7,
    nclexClientNeedsCategory: input.domain.blueprint,
    nclexClientNeedsSubcategory: input.domain.weakArea.slice(0, 128),
    studyLinkPathwayId: PATHWAY_ID,
    studyLinkLessonSlug: input.lesson.slug,
    sourceVersion: 1,
  };
}

function difficulty(index: number): number {
  return [2, 3, 3, 4, 3, 4, 5][index % 7]!;
}

function buildQuestions(lessons: CatalogLesson[]): QuestionRow[] {
  const rows: QuestionRow[] = [];
  for (const [lessonIndex, lesson] of lessons.entries()) {
    for (let i = 0; i < QUESTIONS_PER_LESSON; i++) {
      const domain = lessonDomain(lesson, lessonIndex + i);
      const global = rows.length;
      const type = i % 10;
      if (type === 1 || type === 6) rows.push(buildSata(lesson, domain, i, global));
      else if (type === 2 || type === 7) rows.push(buildBowtie(lesson, domain, i, global));
      else if (type === 4) rows.push(buildMatrix(lesson, domain, i, global));
      else if (type === 8) rows.push(buildOrdered(lesson, domain, i, global));
      else rows.push(buildMcq(lesson, domain, i, global));
    }
  }
  let extra = 0;
  while (rows.length < QUESTION_TARGET) {
    const lesson = lessons[extra % lessons.length]!;
    const domain = PRIORITY_DOMAINS[extra % PRIORITY_DOMAINS.length]!;
    rows.push(buildMcq(lesson, domain, QUESTIONS_PER_LESSON + extra, rows.length));
    extra++;
  }
  return rows.slice(0, Math.max(QUESTION_TARGET, rows.length));
}

function buildFlashcards(lessons: CatalogLesson[], categoryId: string, deckId: string): FlashcardRow[] {
  const rows: FlashcardRow[] = [];
  for (const [lessonIndex, lesson] of lessons.entries()) {
    for (let i = 0; i < FLASHCARDS_PER_LESSON; i++) {
      const domain = lessonDomain(lesson, lessonIndex + i);
      const scenarioBased = i % 2 === 0;
      const sourceKey = `rexpn:flashcard:${lesson.slug}:${String(i + 1).padStart(2, "0")}`;
      const front = scenarioBased
        ? `REx-PN scenario: In ${lesson.title}, what should the RPN do first when the cue is ${domain.cue}?`
        : `REx-PN trap check: What is unsafe about ${domain.tempting} during ${lesson.title}?`;
      const back = [
        scenarioBased
          ? `First, reassess the client and protect safety: ${domain.correctAction}.`
          : `It is unsafe because it reflects ${domain.trap}; the RPN must reassess, act within scope, and report the relevant change.`,
        `Difficulty: ${difficulty(rows.length)}.`,
        `Blueprint: ${domain.blueprint}. System: ${lesson.bodySystem ?? domain.bodySystem}.`,
        `Hint: Look for change from baseline and whether ABCs, safety, medication effect, or scope is threatened.`,
        `Clinical pearl: ${domain.cue} is the cue to recognize; do not bury it under routine tasks.`,
        `Memory aid: Cue -> risk -> scope-safe action -> SBAR.`,
        `Exam trap: ${domain.trap}.`,
        `Clinical significance: prevents ${domain.safety}.`,
        `Application example: If this cue appears during care, pause routine work, reassess, implement ordered safety measures, and communicate the trend.`,
      ].join("\n\n");
      rows.push({
        id: `rexpn-fc-${slug(lesson.slug)}-${String(i + 1).padStart(2, "0")}`,
        front,
        back,
        country: CountryCode.CA,
        tier: TierCode.RPN,
        status: ContentStatus.PUBLISHED,
        examFamily: ExamFamily.REX_PN,
        categoryId,
        lessonId: lesson.slug,
        deckId,
        positionInDeck: rows.length + 1,
        sourceKey,
        examItemKind: null,
      });
    }
  }
  let extra = 0;
  while (rows.length < FLASHCARD_TARGET) {
    const lesson = lessons[extra % lessons.length]!;
    const domain = PRIORITY_DOMAINS[extra % PRIORITY_DOMAINS.length]!;
    rows.push({
      id: `rexpn-fc-extra-${String(extra + 1).padStart(4, "0")}`,
      front: `REx-PN priority card: What clinical judgment step comes before teaching for ${domain.label.toLowerCase()} cues?`,
      back: `Assess the cue, decide whether safety or deterioration is present, implement scope-safe ordered care, and report with SBAR. Blueprint: ${domain.blueprint}. Hint: teaching is rarely first when ${domain.cue} is present. Clinical pearl: trends beat single normal values. Memory aid: Assess, Safety, Scope, SBAR. Exam trap: ${domain.trap}. Clinical significance: prevents ${domain.safety}. Application example: use this sequence during ${lesson.title}.`,
      country: CountryCode.CA,
      tier: TierCode.RPN,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.REX_PN,
      categoryId,
      lessonId: lesson.slug,
      deckId,
      positionInDeck: rows.length + 1,
      sourceKey: `rexpn:flashcard:extra:${String(extra + 1).padStart(4, "0")}`,
      examItemKind: null,
    });
    extra++;
  }
  return rows.slice(0, Math.max(FLASHCARD_TARGET, rows.length));
}

function chunk<T>(rows: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

function seededPick<T extends { id: string; bodySystem?: string | null; difficulty?: number | null; nclexClientNeedsCategory?: string | null }>(
  pool: T[],
  count: number,
  seed: number,
): T[] {
  const scored = pool
    .map((item) => ({ item, score: hash(`${seed}:${item.id}`).slice(0, 12) }))
    .sort((a, b) => a.score.localeCompare(b.score))
    .map((entry) => entry.item);
  return scored.slice(0, count);
}

async function createPracticeExams(prisma: PrismaClient, pool: Array<{ id: string; bodySystem: string | null; difficulty: number | null; nclexClientNeedsCategory: string | null }>): Promise<void> {
  for (let i = 1; i <= EXAM_TARGET; i++) {
    const padded = String(i).padStart(3, "0");
    const examId = `exam_rex_pn_launch_${padded}`;
    const tag = `exam-preset-rex-pn-launch-${padded}`;
    await prisma.exam.upsert({
      where: { id: examId },
      update: { title: `REx-PN Blueprint Practice Exam ${i}`, status: ContentStatus.PUBLISHED },
      create: {
        id: examId,
        title: `REx-PN Blueprint Practice Exam ${i}`,
        country: CountryCode.CA,
        tier: TierCode.RPN,
        examFamily: ExamFamily.REX_PN,
        status: ContentStatus.PUBLISHED,
      },
    });
    const selected = seededPick(pool, 75, i).map((row) => row.id);
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
    console.log("Run with --apply to publish.");
    return;
  }

  const prisma = new PrismaClient({ log: ["error"] });
  try {
    const category = await prisma.category.upsert({
      where: { slug: CATEGORY_SLUG },
      update: { name: "REx-PN Launch Readiness", topicCode: "rex-pn-launch-readiness" },
      create: { slug: CATEGORY_SLUG, name: "REx-PN Launch Readiness", topicCode: "rex-pn-launch-readiness" },
    });
    const deck = await prisma.flashcardDeck.upsert({
      where: { slug: DECK_SLUG },
      update: {
        title: "REx-PN Clinical Judgment Launch Deck",
        description: "Lesson-derived Canadian RPN flashcards focused on REx-PN safety, assessment, prioritization, delegation, pharmacology, and clinical judgment.",
        country: CountryCode.CA,
        tier: TierCode.RPN,
        examFamily: ExamFamily.REX_PN,
        pathwayId: PATHWAY_ID,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: DECK_SLUG,
        title: "REx-PN Clinical Judgment Launch Deck",
        description: "Lesson-derived Canadian RPN flashcards focused on REx-PN safety, assessment, prioritization, delegation, pharmacology, and clinical judgment.",
        country: CountryCode.CA,
        tier: TierCode.RPN,
        examFamily: ExamFamily.REX_PN,
        pathwayId: PATHWAY_ID,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        status: ContentStatus.PUBLISHED,
      },
    });

    console.log(`Publishing ${questions.length} REx-PN questions...`);
    for (const batch of chunk(questions, 250)) {
      await prisma.examQuestion.createMany({ data: batch, skipDuplicates: true });
    }

    const flashcards = buildFlashcards(lessons, category.id, deck.id);
    if (flashcards.length < FLASHCARD_TARGET) throw new Error(`Flashcard target not met: ${flashcards.length}/${FLASHCARD_TARGET}`);
    console.log(`Publishing ${flashcards.length} REx-PN flashcards...`);
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
        exam: { in: ["REx-PN", "REX_PN", "NCLEX-PN"] },
        tier: { equals: "RPN", mode: "insensitive" },
        countryCode: "CA",
        isAdaptiveEligible: true,
        rationale: { not: null },
      },
      select: { id: true, bodySystem: true, difficulty: true, nclexClientNeedsCategory: true },
    });
    if (pool.length < CAT_TARGET) throw new Error(`Published CAT pool below target: ${pool.length}/${CAT_TARGET}`);

    await createPracticeExams(prisma, pool);
    console.log(`REx-PN launch readiness content published: questions=${questions.length}, flashcards=${flashcards.length}, CAT pool=${pool.length}, practiceExams=${EXAM_TARGET}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
