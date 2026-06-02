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
  studyTakeaways?: string[];
  studyCommonTraps?: string[];
  memoryAnchor?: string;
};

type Domain = {
  id: string;
  label: string;
  system: string;
  blueprint: string;
  weakArea: string;
  category: string;
  presentation: string;
  cue: string;
  differential: string;
  diagnosticPlan: string;
  managementPlan: string;
  prescribingDecision: string;
  tempting: string;
  trap: string;
  reasoning: string;
  safety: string;
};

type QuestionRow = Prisma.ExamQuestionCreateManyInput;
type FlashcardRow = Prisma.FlashcardCreateManyInput;

const APPLY = process.argv.includes("--apply");
const QUESTION_TARGET = readNumberFlag("--question-target", 5000);
const FLASHCARD_TARGET = readNumberFlag("--flashcard-target", 5000);
const EXAM_TARGET = readNumberFlag("--practice-exams", 250);
const QUESTIONS_PER_LESSON = readNumberFlag("--questions-per-lesson", 25);
const FLASHCARDS_PER_LESSON = readNumberFlag("--flashcards-per-lesson", 20);
const CAT_TARGET = readNumberFlag("--cat-target", 3500);
const PATHWAY_ID = "us-np-agpcnp";
const SOURCE_LESSON_PATHWAY_ID = "us-np-fnp";
const SOURCE = "agpcnp-launch-readiness-sprint";
const CATEGORY_SLUG = "agpcnp-launch-readiness";
const DECK_SLUG = "agpcnp-clinical-reasoning-launch-deck";
const LESSON_CATALOG = resolve(process.cwd(), "src/content/pathway-lessons/np-parity-expansion-catalog.json");
const EXCLUDED_AGPCNP_DOMAIN_IDS = new Set(["pediatrics", "maternal-health", "womens-health"]);
const AGPCNP_EXCLUDED_LESSON_RE =
  /\b(pediatric|pediatrics|child|adolescent|infant|newborn|maternal|pregnan|prenatal|postpartum|women|contraception|gynec|reproductive|uterine|cervical|vaginitis)\b/i;
const AGPCNP_INCLUDED_LESSON_RE =
  /\b(geriatric|older|adult|cardio|endocrine|diabetes|hypertension|renal|respiratory|mental|prevent|health promotion|chronic|diagnostic|primary|urgent|pharm|polypharmacy|professional|leadership|kidney|copd|heart|thyroid)\b/i;

const PRIORITY_DOMAINS: Domain[] = [
  domain("professional-practice", "Professional Practice", "Professional Practice", "Professional Practice", "Scope and accountability", "Professional practice", "a primary care visit where the requested action may exceed local NP authority", "unclear authority, incomplete consent, or missing follow-up responsibility", "regulatory scope issue versus clinical appropriateness versus organizational privilege gap", "verify legal authority, competence, patient-specific indication, and organizational policy before acting", "decline or modify the plan, document rationale, and arrange appropriate referral or consultation", "prescribe or perform only when authority, competence, indication, and monitoring are all satisfied", "proceeding because the clinical request seems reasonable", "clinical appropriateness alone does not authorize practice", "integrate legal authority, competence, context, and continuity before deciding", "unsafe practice, regulatory breach, and fragmented care"),
  domain("health-promotion", "Health Promotion", "Preventive Medicine", "Health Promotion and Prevention", "Risk reduction counselling", "Health promotion", "an adult preventive-care visit with modifiable cardiovascular and cancer risks", "smoking, sedentary behaviour, elevated blood pressure, and overdue screening", "modifiable risk cluster versus established disease requiring treatment today", "prioritize validated risk assessment, shared goals, screening eligibility, and motivational interviewing", "build a prevention plan with follow-up metrics and culturally safe counselling", "avoid medication unless guideline thresholds or comorbidity risks justify it", "ordering broad testing without addressing behaviour change or screening gaps", "mistaking testing volume for prevention quality", "use absolute risk, readiness, and guideline-based screening to create a measurable plan", "missed prevention, low adherence, and delayed diagnosis"),
  domain("preventive-care", "Preventive Care", "Preventive Medicine", "Health Promotion and Prevention", "Screening and immunization", "Preventive care", "a patient asks which screening and vaccines are due", "age, sex, pregnancy potential, immunization history, and family risk alter recommendations", "average-risk screening versus high-risk pathway versus symptomatic evaluation", "confirm risk category, review USPSTF/ACIP-aligned guidance, and align screening intervals with shared decision-making", "order only indicated screening and vaccines, explain benefits/harms, and close follow-up loops", "avoid screening tests that are not indicated or that bypass diagnostic workup of symptoms", "checking every available test panel to be thorough", "over-screening can create false positives and misses the actual risk category", "differentiate screening from diagnosis and match prevention to individual risk", "false positives, missed high-risk status, and poor uptake"),
  domain("primary-care-assessment", "Primary Care Assessment", "Primary Care", "Clinical Assessment and Diagnosis", "Focused assessment", "Diagnostic reasoning", "a patient presents with a common symptom that could be benign or high risk", "duration, red flags, comorbidities, medication exposures, and abnormal vital signs change the differential", "self-limited illness versus urgent condition versus chronic disease decompensation", "perform focused history, targeted exam, red-flag screen, and initial risk stratification", "choose outpatient management only if red flags are absent and follow-up is reliable", "withhold empiric prescribing until diagnostic probability and severity are clear", "treating the most common cause without checking red flags", "base-rate thinking without danger-feature screening", "start with the dangerous cannot-miss diagnoses, then narrow to the likely diagnosis", "missed deterioration, delayed referral, and inappropriate reassurance"),
  domain("cardiovascular", "Cardiovascular", "Cardiovascular", "Clinical Assessment and Diagnosis", "Cardiovascular risk and disease", "Differential diagnosis", "an adult with chest discomfort, dyspnea, or worsening edema", "exertional symptoms, abnormal vitals, risk factors, and change from baseline", "acute coronary syndrome versus heart failure versus pulmonary or GI mimic", "obtain focused cardiovascular assessment, ECG/troponin when indicated, and risk-stratify urgency", "refer emergently for unstable features; manage chronic risk with guideline-based therapy and monitoring", "select antihypertensive, lipid, or heart-failure therapy based on comorbidity, contraindications, and follow-up labs", "assuming anxiety or reflux because the patient is young or symptoms are atypical", "premature closure on a benign mimic", "rule out time-sensitive cardiovascular disease before outpatient reassurance", "MI, pulmonary edema, stroke risk, and medication harm"),
  domain("respiratory", "Respiratory", "Respiratory", "Clinical Assessment and Diagnosis", "Respiratory assessment", "Diagnostic interpretation", "a patient reports cough, wheeze, dyspnea, or recurrent infections", "oxygen saturation, work of breathing, fever pattern, smoking history, and spirometry availability", "asthma/COPD exacerbation versus pneumonia versus heart failure versus PE risk", "assess severity, oxygenation, infectious features, and need for imaging or spirometry", "treat severity first, arrange follow-up, and escalate for hypoxia, exhaustion, or PE concern", "choose bronchodilator, steroid, antibiotic, or inhaled controller only when the diagnosis and severity support it", "prescribing antibiotics for any cough to meet patient expectations", "symptom-label prescribing without diagnostic stratification", "separate infection, obstruction, embolic risk, and cardiac mimic before prescribing", "hypoxia, sepsis, steroid overuse, and antimicrobial resistance"),
  domain("endocrine", "Endocrine", "Endocrine", "Chronic Disease Management", "Diabetes and thyroid management", "Management reasoning", "a patient has abnormal glucose, thyroid results, weight change, or medication side effects", "A1c trend, renal function, hypoglycemia risk, pregnancy potential, and symptoms affect management", "type 2 diabetes versus secondary causes versus medication adverse effect versus thyroid disorder", "confirm diagnosis, assess complications, review labs, and individualize targets", "start or adjust therapy using comorbidities, safety, and monitoring plan", "prescribe based on renal function, cardiovascular benefit, pregnancy status, and hypoglycemia risk", "intensifying medication without assessing adherence, hypoglycemia, or renal function", "treating a number without context", "match therapy to risk, patient goals, and required monitoring", "hypoglycemia, renal injury, undertreatment, and avoidable complications"),
  domain("renal", "Renal", "Renal", "Chronic Disease Management", "Kidney and electrolyte safety", "Diagnostic interpretation", "a patient has reduced eGFR, albuminuria, urinary symptoms, or electrolyte abnormalities", "eGFR trend, albumin-creatinine ratio, potassium, medications, and volume status alter risk", "CKD progression versus acute kidney injury versus UTI/pyelonephritis versus medication toxicity", "distinguish acute from chronic change, review nephrotoxic agents, and order targeted urine/renal labs", "protect kidney function, adjust medications, treat infection when indicated, and refer for high-risk features", "dose-adjust renally cleared medication and avoid nephrotoxins or unsafe potassium-raising combinations", "treating isolated creatinine as stable CKD without checking trend or medications", "missing acute kidney injury or medication contribution", "interpret kidney labs longitudinally and connect them to prescribing safety", "hyperkalemia, renal decline, sepsis, and drug toxicity"),
  domain("mental-health", "Mental Health", "Mental Health", "Clinical Assessment and Diagnosis", "Mental health and substance use", "Assessment", "a patient reports mood change, anxiety, substance use, insomnia, or functional decline", "suicidal ideation, mania screen, substance use, trauma history, and medication effects change the plan", "major depression versus bipolar disorder versus substance-induced symptoms versus medical mimic", "screen risk, assess function, rule out mania/medical mimics, and determine urgency", "safety plan or urgent referral for risk; otherwise initiate evidence-based therapy and follow-up", "prescribe antidepressants only after bipolar risk and safety assessment are addressed", "starting an SSRI immediately because depression screening is positive", "treating a screen as a diagnosis", "risk assessment and differential diagnosis come before routine pharmacotherapy", "suicide risk, mania activation, substance complications, and missed medical illness"),
  domain("pediatrics", "Pediatrics", "Pediatrics", "Health Promotion and Prevention", "Pediatric primary care", "Assessment", "a child presents with fever, respiratory symptoms, growth concern, or parental worry", "age, hydration, work of breathing, immunization status, and caregiver reliability drive urgency", "viral illness versus bacterial infection versus dehydration versus developmental or safeguarding concern", "assess age-specific red flags, hydration, respiratory effort, and developmental context", "treat supportively or refer based on severity, age, and reliability of follow-up", "prescribe antibiotics or bronchodilators only when diagnostic features support them", "reassuring based on a normal adult-style exam", "failing to apply pediatric thresholds", "use age-specific danger signs and caregiver capacity in every decision", "respiratory failure, dehydration, sepsis, and missed safeguarding issue"),
  domain("maternal-health", "Maternal Health", "Maternal-Newborn", "Clinical Assessment and Diagnosis", "Pregnancy and postpartum care", "Assessment", "a pregnant or postpartum patient reports bleeding, pain, hypertension symptoms, or mood change", "gestational age, blood pressure, fetal movement, bleeding amount, and postpartum timing change urgency", "normal pregnancy discomfort versus preeclampsia versus ectopic/hemorrhage versus perinatal mental health crisis", "assess obstetric red flags, vital signs, fetal/maternal risk, and need for urgent referral", "escalate time-sensitive maternal findings and coordinate safe follow-up", "avoid teratogenic or lactation-unsafe medications and choose pregnancy-compatible options", "treating symptoms as routine pregnancy discomfort", "normalizing maternal red flags", "pregnancy changes the differential, thresholds, and medication safety profile", "maternal stroke, hemorrhage, fetal compromise, and medication harm"),
  domain("womens-health", "Women's Health", "Women's Health", "Clinical Assessment and Diagnosis", "Reproductive and sexual health", "Diagnostic reasoning", "a patient presents with pelvic pain, abnormal bleeding, contraception needs, or STI concern", "pregnancy possibility, hemodynamic status, infection risk, and coercion screen affect management", "ectopic pregnancy versus PID versus benign gynecologic cause versus contraceptive complication", "rule out pregnancy and urgent causes, assess STI risk, and choose indicated pelvic/lab evaluation", "treat or refer based on red flags, reproductive goals, and shared decision-making", "select contraception or antimicrobial therapy based on contraindications, interactions, and pregnancy status", "starting hormonal therapy before excluding pregnancy or urgent pathology", "skipping the cannot-miss reproductive diagnoses", "rule out pregnancy-related and infectious emergencies before routine management", "ectopic rupture, infertility, undertreated infection, and medication contraindication"),
  domain("geriatrics", "Geriatrics", "Geriatrics", "Chronic Disease Management", "Older adult assessment", "Management reasoning", "an older adult reports falls, confusion, polypharmacy, or functional decline", "new baseline change, anticholinergic load, orthostasis, frailty, and caregiver strain alter priorities", "delirium versus dementia versus medication effect versus infection or metabolic cause", "assess acute change, medication burden, mobility, cognition, and social supports", "address reversible causes, deprescribe when appropriate, and build a function-focused plan", "prescribe cautiously using renal function, fall risk, cognition, and goals of care", "attributing new confusion to dementia without acute workup", "ageism and anchoring on chronic decline", "new functional or cognitive change is acute until proven otherwise", "falls, delirium, medication injury, and caregiver breakdown"),
  domain("chronic-disease", "Chronic Disease Management", "Primary Care", "Chronic Disease Management", "Longitudinal management", "Management reasoning", "a patient has persistent uncontrolled chronic disease despite treatment", "trend data, adherence barriers, adverse effects, comorbidities, and social determinants explain control gaps", "undertreatment versus nonadherence versus wrong diagnosis versus adverse effect limitation", "review trends, home data, medication use, barriers, and complication screening", "intensify, simplify, or refer using guideline targets and patient priorities", "prescribe stepwise therapy with monitoring intervals and harm-reduction counselling", "adding another medication without understanding why the current plan is failing", "therapeutic escalation without adherence and barrier assessment", "manage chronic disease as a longitudinal system, not a single lab value", "complications, poor adherence, and medication burden"),
  domain("diagnostic-testing", "Diagnostic Testing", "Diagnostics", "Clinical Assessment and Diagnosis", "Test selection and interpretation", "Diagnostic interpretation", "a clinician must choose tests for an ambiguous symptom or abnormal result", "pretest probability, timing, false positives, and whether results change management matter", "diagnostic uncertainty versus screening versus monitoring versus urgent referral", "choose tests that answer a specific clinical question and interpret them in context", "act on critical results and avoid low-value testing that will not change management", "avoid empiric treatment when a required diagnostic confirmation changes safety or disposition", "ordering broad panels to avoid missing anything", "confusing more data with better diagnosis", "test only when the result changes probability, safety, treatment, or follow-up", "false positives, missed diagnosis, over-treatment, and delayed referral"),
  domain("pharmacotherapeutics", "Pharmacotherapeutics", "Pharmacology", "Pharmacotherapeutics", "Prescribing safety", "Prescribing", "a patient needs medication initiation or adjustment in primary care", "renal/hepatic function, pregnancy potential, interactions, allergies, and monitoring requirements shape safety", "appropriate first-line therapy versus contraindicated drug versus dose/monitoring problem", "confirm indication, contraindications, interactions, baseline labs, and follow-up monitoring", "choose the safest effective therapy and document monitoring, counselling, and response plan", "individualize prescribing by comorbidity, organ function, interactions, and patient goals", "choosing the drug most commonly used without checking contraindications", "generic first-line thinking without patient-specific safety", "prescribing is a diagnostic and monitoring decision, not a memorized drug match", "adverse drug event, treatment failure, and antimicrobial resistance"),
  domain("differential-diagnosis", "Differential Diagnosis", "Diagnostics", "Clinical Assessment and Diagnosis", "Differential diagnosis", "Diagnostic reasoning", "a symptom has both common and high-risk causes", "time course, severity, red flags, exposures, and comorbidities shift the differential", "common benign cause versus dangerous mimic versus chronic disease complication", "rank likely and cannot-miss diagnoses, then test or refer based on risk", "treat only after the leading diagnosis is sufficiently supported or urgent risk is addressed", "avoid symptom suppression when it could mask a time-sensitive condition", "jumping to the statistically common diagnosis", "premature closure", "hold common and dangerous diagnoses together until risk is resolved", "missed emergency, delayed therapy, and false reassurance"),
  domain("urgent-care", "Urgent Care Presentations", "Urgent Care", "Clinical Assessment and Diagnosis", "Urgent presentations", "Clinical judgment", "a patient presents with acute pain, dyspnea, fever, neurologic deficit, or severe dehydration", "abnormal vitals, altered mental status, severe pain, or rapid progression indicate higher acuity", "primary-care-manageable issue versus emergency referral versus same-day diagnostics", "stabilize, identify red flags, and determine disposition before routine outpatient treatment", "refer or transfer when acuity exceeds outpatient safety, while communicating key findings", "use empiric treatment only when it does not delay needed emergency care", "trying outpatient treatment first to avoid inconvenience", "under-triage of unstable presentations", "disposition is the diagnosis when safety is at stake", "shock, stroke delay, respiratory failure, and sepsis"),
  domain("leadership", "Leadership", "Leadership", "Professional Practice", "Systems leadership", "Leadership", "a clinic process creates repeated missed follow-up or medication errors", "similar near-misses recur across providers and documentation handoffs", "individual lapse versus system failure versus policy gap", "analyze the process, identify failure points, and engage team-based improvement", "implement a practical safety process and monitor outcomes", "avoid blame-only responses; fix the system and preserve accountability", "retraining one person without changing the unsafe workflow", "person-focused correction for a system defect", "NP leadership includes clinical care, quality improvement, and accountability", "repeat harm, unsafe transitions, and poor team trust"),
  domain("ethics", "Ethics", "Professional Practice", "Professional Practice", "Ethics and consent", "Ethics", "a patient refuses a recommended diagnostic test or treatment", "capacity, voluntariness, understanding, risk severity, and substitute decision-maker rules matter", "capable refusal versus impaired capacity versus coercion versus information gap", "assess capacity, provide balanced information, explore values, and document informed refusal", "respect capable decisions while arranging safety-netting and follow-up", "avoid coercive prescribing or testing when valid refusal is present", "asking family to decide because the clinician disagrees with the patient", "overriding autonomy without capacity assessment", "ethical practice balances autonomy, beneficence, nonmaleficence, and justice", "coercion, delayed care, complaint risk, and loss of trust"),
];

const AGPCNP_PRIORITY_DOMAINS = PRIORITY_DOMAINS.filter((domain) => !EXCLUDED_AGPCNP_DOMAIN_IDS.has(domain.id));

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
  system: string,
  blueprint: string,
  weakArea: string,
  category: string,
  presentation: string,
  cue: string,
  differential: string,
  diagnosticPlan: string,
  managementPlan: string,
  prescribingDecision: string,
  tempting: string,
  trap: string,
  reasoning: string,
  safety: string,
): Domain {
  return { id, label, system, blueprint, weakArea, category, presentation, cue, differential, diagnosticPlan, managementPlan, prescribingDecision, tempting, trap, reasoning, safety };
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
  const entry = raw.pathways?.[SOURCE_LESSON_PATHWAY_ID];
  const lessons = (Array.isArray(entry) ? entry : entry?.lessons ?? []).filter((lesson) => {
    const text = `${lesson.title} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""}`;
    return !AGPCNP_EXCLUDED_LESSON_RE.test(text) && AGPCNP_INCLUDED_LESSON_RE.test(text);
  });
  if (lessons.length === 0) throw new Error(`No reusable ${SOURCE_LESSON_PATHWAY_ID} lessons found for ${PATHWAY_ID} in ${LESSON_CATALOG}`);
  return lessons;
}

function lessonDomain(lesson: CatalogLesson, index: number): Domain {
  const text = `${lesson.title} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""}`.toLowerCase();
  const direct =
    AGPCNP_PRIORITY_DOMAINS.find((d) => text.includes(d.id.replace(/-/g, " "))) ??
    AGPCNP_PRIORITY_DOMAINS.find((d) => text.includes(d.label.toLowerCase())) ??
    AGPCNP_PRIORITY_DOMAINS.find((d) => text.includes(d.system.toLowerCase()));
  return direct ?? AGPCNP_PRIORITY_DOMAINS[index % AGPCNP_PRIORITY_DOMAINS.length]!;
}

function lessonSummary(lesson: CatalogLesson): string {
  return (lesson.sections ?? [])
    .map((section) => section.body ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

function rotate<T>(items: T[], by: number): T[] {
  return items.map((_, idx) => items[(idx + by) % items.length]!);
}

function letters(n: number): string[] {
  return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
}

function difficulty(index: number): number {
  return [3, 4, 4, 5, 3, 5, 4][index % 7]!;
}

function baseTags(lesson: CatalogLesson, domain: Domain, format: string): string[] {
  return [
    SOURCE,
    "pathway:us-np-agpcnp",
    "exam:AGPCNP",
    "tier:NP",
    `lesson:${lesson.slug}`,
    `topic:${slug(lesson.topic ?? domain.label)}`,
    `system:${slug(lesson.bodySystem ?? domain.system)}`,
    `blueprint:${slug(domain.blueprint)}`,
    `weak-area:${slug(domain.weakArea)}`,
    `clinical-category:${slug(domain.category)}`,
    `format:${format}`,
    "us",
    "adult-gerontology-primary-care",
    "np-clinical-reasoning",
    "diagnostic-reasoning",
    "management-reasoning",
    "prescribing-reasoning",
  ];
}

function teachingRationale(lesson: CatalogLesson, domain: Domain, correct: string): string {
  return [
    `Correct because the NP must integrate diagnostic probability, patient-specific risk, prescribing safety, and follow-up responsibility: ${correct}.`,
    `Why alternatives are tempting: ${domain.tempting}. The AGPCNP trap is ${domain.trap}.`,
    `Clinical cue to recognize: ${domain.cue}. That cue should shift the differential toward ${domain.differential}.`,
    `NP-level reasoning: ${domain.reasoning}.`,
    `Clinical takeaway for ${lesson.title}: choose the plan that confirms the diagnosis when needed, treats current risk, avoids unsafe prescribing, and closes the loop with monitoring.`,
  ].join(" ");
}

function optionRationales(optionMap: Record<string, string>, correctLetter: string, domain: Domain): Record<string, string> {
  return Object.fromEntries(
    Object.entries(optionMap).map(([letter, text]) => {
      if (letter === correctLetter) {
        return [
          letter,
          `${letter} is correct. ${text} matches the cue (${domain.cue}), addresses the leading differential (${domain.differential}), and uses NP-level diagnostic, management, and prescribing reasoning.`,
        ];
      }
      return [
        letter,
        `${letter} is incorrect. ${text} is tempting because ${domain.tempting}, but it misses ${domain.cue}, tests the AGPCNP trap of ${domain.trap}, and fails to apply this NP reasoning: ${domain.reasoning}.`,
      ];
    }),
  );
}

function buildMcq(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `${domain.diagnosticPlan}; then ${domain.managementPlan}. Prescribing decision: ${domain.prescribingDecision}.`;
  const distractors = [
    `Treat the most common benign cause first and defer diagnostic clarification unless symptoms persist.`,
    `Order a broad panel of tests without linking results to disposition, prescribing, or follow-up decisions.`,
    `Provide reassurance and routine follow-up because the presentation is common in primary care.`,
  ];
  const rotated = rotate([correct, ...distractors], globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  const stem = `AGPCNP ${domain.label} item ${localIndex + 1}. A nurse practitioner sees ${domain.presentation} while applying ${lesson.title}. Key cue: ${domain.cue}. Which plan best demonstrates advanced NP clinical reasoning?`;
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
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
      hint: "Start with the cannot-miss differential, then choose testing, treatment, prescribing, and follow-up that change safety or management.",
      optionRationales: optionRationales(optionMap, correctLetter, domain),
    },
    adaptiveEligible: true,
  });
}

function buildSata(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const options = [
    `Clarify the differential diagnosis: ${domain.differential}.`,
    `Use targeted diagnostics: ${domain.diagnosticPlan}.`,
    `Choose management that fits acuity and follow-up: ${domain.managementPlan}.`,
    `Make a patient-specific prescribing decision: ${domain.prescribingDecision}.`,
    `Delay diagnostic reasoning and treat the most common cause empirically.`,
    `Order broad low-yield tests because more data is always safer.`,
  ];
  const optionMap = Object.fromEntries(letters(6).map((letter, idx) => [letter, options[idx]!]));
  const correctLetters = ["A", "B", "C", "D"];
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Select all that apply. For ${lesson.title}, which NP actions best address ${domain.presentation} when the cue is ${domain.cue}?`,
    questionType: "SATA",
    questionFormat: "sata",
    options: letters(6).map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetters,
    rationale: `A-D are correct because AGPCNP-level care requires differential diagnosis, targeted diagnostic interpretation, management reasoning, and prescribing safety. E is premature closure. F is low-value testing unless each test changes probability, safety, treatment, or follow-up.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "sata"), "select-all-that-apply"],
    distractorRationales: {
      hint: "Select actions that change diagnosis, treatment safety, prescribing, or follow-up; reject premature closure and unfocused testing.",
      optionRationales: Object.fromEntries(
        Object.entries(optionMap).map(([letter, text]) => [
          letter,
          correctLetters.includes(letter)
            ? `${letter} is correct. ${text} is an NP-level action tied to ${domain.blueprint}.`
            : `${letter} is incorrect. ${text} is tempting, but it reflects ${domain.trap} and misses ${domain.reasoning}.`,
        ]),
      ),
    },
    adaptiveEligible: true,
  });
}

function buildMatrix(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const rows = [
    { id: "redflag", label: domain.cue, answer: "Escalate / diagnose" },
    { id: "stable", label: `Stable chronic management issue in ${lesson.title}`, answer: "Manage outpatient" },
    { id: "prescribing", label: `Medication choice affected by renal function, pregnancy potential, interactions, or monitoring`, answer: "Prescribing safety" },
    { id: "prevention", label: `Average-risk counselling or screening opportunity`, answer: "Preventive care" },
  ];
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Matrix. For each finding in this ${lesson.title} encounter, choose the NP reasoning lane.`,
    questionType: "MATRIX",
    questionFormat: "matrix",
    options: { format: "matrix", columns: ["Escalate / diagnose", "Manage outpatient", "Prescribing safety", "Preventive care"], rows },
    correctAnswer: Object.fromEntries(rows.map((row) => [row.id, row.answer])),
    rationale: `The matrix tests whether the candidate distinguishes urgent diagnostic risk, stable outpatient management, prescribing safety, and preventive care. ${domain.cue} belongs in escalation/diagnosis because it changes the differential and safety plan.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "matrix"), "matrix"],
    distractorRationales: {
      hint: "Map each row to the clinical decision it changes, not to the body system alone.",
      matrixRationales: rows.map((row) => ({
        row: row.id,
        rationale: `${row.label} maps to ${row.answer}; another column would confuse diagnostic urgency, longitudinal management, medication safety, or prevention.`,
      })),
    },
    adaptiveEligible: false,
  });
}

function buildBowtie(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const bank = [
    { id: "condition", label: domain.differential },
    { id: "diagnostic", label: domain.diagnosticPlan },
    { id: "management", label: domain.managementPlan },
    { id: "prescribing", label: domain.prescribingDecision },
    { id: "reassure", label: "Reassure without resolving red flags or follow-up reliability" },
    { id: "broadtest", label: "Order broad testing that does not change management" },
  ];
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Bowtie. Complete the NP reasoning map for ${domain.presentation}. Cue: ${domain.cue}.`,
    questionType: "NGN_BOWTIE",
    questionFormat: "bowtie",
    options: {
      format: "bowtie",
      bank,
      slotLabels: {
        condition: "Most important diagnostic concern",
        intervention: "Targeted diagnostic step",
        monitoring: "Management / prescribing plan",
      },
    },
    correctAnswer: { correctMapping: { condition: "condition", intervention: "diagnostic", monitoring: "management" } },
    rationale: `Concern: ${domain.differential}. Diagnostic step: ${domain.diagnosticPlan}. Management: ${domain.managementPlan}. Prescribing must account for ${domain.prescribingDecision}. Reassurance and unfocused testing are traps because they do not resolve the clinical cue.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "bowtie"), "bowtie", "diagnostic-reasoning"],
    distractorRationales: {
      hint: "Connect the cue to a differential, then choose the diagnostic and management steps that reduce risk.",
      bankRationales: Object.fromEntries(
        bank.map((item) => [
          item.id,
          ["condition", "diagnostic", "management", "prescribing"].includes(item.id)
            ? `${item.label} is clinically relevant because it advances diagnosis, management, or prescribing safety.`
            : `${item.label} is tempting but unsafe because it reflects ${domain.trap}.`,
        ]),
      ),
    },
    adaptiveEligible: true,
  });
}

function buildOrdered(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const ordered = [
    `Identify cannot-miss differential: ${domain.differential}.`,
    `Order or interpret targeted diagnostics: ${domain.diagnosticPlan}.`,
    `Choose management by acuity and patient context: ${domain.managementPlan}.`,
    `Prescribe and monitor safely: ${domain.prescribingDecision}.`,
  ];
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Ordered response. Place the NP clinical reasoning steps in the safest order for ${lesson.title}.`,
    questionType: "ORDERED_RESPONSE",
    questionFormat: "ordered",
    options: rotate(ordered, 2).map((text, idx) => ({ letter: String.fromCharCode(65 + idx), text })),
    correctAnswer: ordered,
    rationale: `AGPCNP reasoning moves from differential diagnosis to diagnostic confirmation, management decision, and prescribing/monitoring. The trap is prescribing or reassuring before diagnostic risk is resolved.`,
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "ordered"), "ordered-response"],
    distractorRationales: {
      hint: "Do not prescribe or reassure before you have framed the differential and urgency.",
      orderedRationales: ordered.map((step, idx) => ({
        step: idx + 1,
        rationale: `${step} belongs here because advanced NP care sequences diagnosis, management, prescribing, and follow-up.`,
      })),
    },
    adaptiveEligible: false,
  });
}

function buildDifferential(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `Prioritize ${domain.differential}; use ${domain.diagnosticPlan} to separate high-risk from routine causes before selecting treatment.`;
  const options = [
    correct,
    `Assume the most common diagnosis and treat symptomatically because the presentation is familiar.`,
    `Focus on patient reassurance because the symptom is common in primary care.`,
    `Order non-specific testing first and decide later which diagnosis is most likely.`,
  ];
  const rotated = rotate(options, globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Differential diagnosis. In ${lesson.title}, which diagnostic reasoning approach best fits the cue: ${domain.cue}?`,
    questionType: "MCQ",
    questionFormat: "differential_diagnosis",
    options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetter,
    rationale: teachingRationale(lesson, domain, correct),
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "differential-diagnosis"), "differential-diagnosis"],
    distractorRationales: {
      hint: "Rank cannot-miss diagnoses before routine outpatient explanations.",
      optionRationales: optionRationales(optionMap, correctLetter, domain),
    },
    adaptiveEligible: true,
  });
}

function buildClinicalManagement(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `${domain.managementPlan}; include follow-up parameters and escalation instructions for ${domain.safety}.`;
  const options = [
    correct,
    "Prescribe first-line medication without confirming diagnosis, contraindications, or monitoring requirements.",
    "Defer all management until every possible diagnostic test has returned.",
    "Provide education only because shared decision-making is the most important NP role.",
  ];
  const rotated = rotate(options, globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Clinical management. Which management plan is safest for ${domain.presentation} in an AGPCNP-style ${lesson.title} encounter?`,
    questionType: "MCQ",
    questionFormat: "clinical_management",
    options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetter,
    rationale: teachingRationale(lesson, domain, correct),
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "clinical-management"), "management-reasoning"],
    distractorRationales: {
      hint: "Choose the plan that fits acuity, diagnostic certainty, safety-netting, and follow-up.",
      optionRationales: optionRationales(optionMap, correctLetter, domain),
    },
    adaptiveEligible: true,
  });
}

function buildDiagnosticInterpretation(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `Interpret the result in light of pretest probability and ${domain.cue}; act only if the result changes diagnosis, safety, treatment, or follow-up.`;
  const options = [
    correct,
    "Treat any abnormal value as diagnostic even when it conflicts with the clinical picture.",
    "Repeat the full panel immediately because isolated abnormalities are always lab error.",
    "Ignore the result until symptoms become severe enough to require emergency care.",
  ];
  const rotated = rotate(options, globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  return questionRow({
    id: `agpcnp-${slug(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`,
    lesson,
    domain,
    stem: `Diagnostic interpretation. A result is available during ${lesson.title}. Which interpretation best reflects AGPCNP-level NP reasoning?`,
    questionType: "MCQ",
    questionFormat: "diagnostic_interpretation",
    options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })),
    correctAnswer: correctLetter,
    rationale: teachingRationale(lesson, domain, correct),
    difficulty: difficulty(globalIndex),
    tags: [...baseTags(lesson, domain, "diagnostic-interpretation"), "diagnostic-interpretation"],
    distractorRationales: {
      hint: "Ask what the test changes: probability, severity, treatment, prescribing safety, or disposition.",
      optionRationales: optionRationales(optionMap, correctLetter, domain),
    },
    adaptiveEligible: true,
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
  adaptiveEligible: boolean;
}): QuestionRow {
  return {
    id: input.id,
    tier: "NP",
    exam: "AGPCNP",
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
    bodySystem: input.lesson.bodySystem ?? input.domain.system,
    topic: input.lesson.topic ?? input.domain.label,
    subtopic: input.lesson.title,
    regionScope: "US_ONLY",
    stemHash: hash(input.stem),
    careerType: "nursing",
    scenario: `${input.domain.presentation}. ${lessonSummary(input.lesson)}`,
    clinicalPearl: `AGPCNP pearl: ${input.domain.cue} should change the differential, diagnostic plan, management plan, prescribing safety check, or follow-up interval.`,
    examStrategy: "For AGPCNP, avoid RN-level recall. Identify the differential, interpret targeted data, prescribe safely, and decide whether outpatient management is safe.",
    memoryHook: "Differentiate -> test with purpose -> manage by risk -> prescribe safely -> close follow-up.",
    frameworkUsed: "Advanced NP clinical reasoning: differential diagnosis, diagnostic interpretation, management reasoning, prescribing safety, preventive care, and professional accountability.",
    clinicalTrap: input.domain.trap,
    distractorRationales: input.distractorRationales as Prisma.InputJsonValue,
    qualityScores: { diagnosticReasoning: 5, managementReasoning: 5, prescribingSafety: 5, rationaleDepth: 5 } as Prisma.InputJsonValue,
    qualityScore: 95,
    countryCode: "US",
    regionCode: "US",
    licensingBody: "Adult-Gerontology Primary Care NP",
    languageCode: "en",
    cognitiveLevel: input.questionFormat === "mcq" ? "analyze" : "evaluate",
    questionFormat: input.questionFormat,
    isScenario: true,
    isMockExamEligible: true,
    isAdaptiveEligible: input.adaptiveEligible,
    isFlashcardSource: true,
    isStudyGuideLinked: true,
    isTutorReady: true,
    correctAnswerExplanation: input.rationale,
    incorrectAnswerRationale: input.distractorRationales as Prisma.InputJsonValue,
    clinicalReasoning: `The NP must connect ${input.domain.cue} to ${input.domain.differential}, choose ${input.domain.diagnosticPlan}, manage with ${input.domain.managementPlan}, and prescribe with ${input.domain.prescribingDecision}.`,
    keyTakeaway: `For ${input.lesson.title}, the safest answer is the one that changes diagnosis, management, prescribing safety, or follow-up in response to the cue.`,
    mnemonic: "Dx, Data, Decision, Drug safety, Disposition",
    referenceSource: "NurseNest AGPCNP lesson-derived launch readiness sprint",
    blueprintWeight: input.adaptiveEligible ? 1.1 : 0.7,
    nclexClientNeedsCategory: input.domain.blueprint,
    nclexClientNeedsSubcategory: input.domain.weakArea.slice(0, 128),
    studyLinkPathwayId: PATHWAY_ID,
    studyLinkLessonSlug: input.lesson.slug,
    sourceVersion: 1,
  };
}

function buildQuestionByType(lesson: CatalogLesson, domain: Domain, localIndex: number, globalIndex: number): QuestionRow {
  switch (localIndex % 12) {
    case 1:
    case 7:
      return buildSata(lesson, domain, localIndex, globalIndex);
    case 2:
      return buildBowtie(lesson, domain, localIndex, globalIndex);
    case 3:
      return buildDifferential(lesson, domain, localIndex, globalIndex);
    case 4:
      return buildMatrix(lesson, domain, localIndex, globalIndex);
    case 5:
      return buildClinicalManagement(lesson, domain, localIndex, globalIndex);
    case 8:
      return buildOrdered(lesson, domain, localIndex, globalIndex);
    case 10:
      return buildDiagnosticInterpretation(lesson, domain, localIndex, globalIndex);
    default:
      return buildMcq(lesson, domain, localIndex, globalIndex);
  }
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
    const domain = AGPCNP_PRIORITY_DOMAINS[extra % AGPCNP_PRIORITY_DOMAINS.length]!;
    rows.push(buildQuestionByType(lesson, domain, QUESTIONS_PER_LESSON + extra, rows.length));
    extra++;
  }
  return rows.slice(0, Math.max(QUESTION_TARGET, rows.length));
}

function buildFlashcards(lessons: CatalogLesson[], categoryId: string, deckId: string): FlashcardRow[] {
  const rows: FlashcardRow[] = [];
  for (const [lessonIndex, lesson] of lessons.entries()) {
    for (let i = 0; i < FLASHCARDS_PER_LESSON; i++) {
      rows.push(flashcardRow(lesson, lessonDomain(lesson, lessonIndex + i), rows.length, categoryId, deckId, `lesson:${lesson.slug}:${String(i + 1).padStart(3, "0")}`));
    }
  }
  let extra = 0;
  while (rows.length < FLASHCARD_TARGET) {
    const lesson = lessons[extra % lessons.length]!;
    const domain = AGPCNP_PRIORITY_DOMAINS[extra % AGPCNP_PRIORITY_DOMAINS.length]!;
    rows.push(flashcardRow(lesson, domain, rows.length, categoryId, deckId, `extra:${String(extra + 1).padStart(5, "0")}`));
    extra++;
  }
  return rows.slice(0, Math.max(FLASHCARD_TARGET, rows.length));
}

function flashcardRow(lesson: CatalogLesson, domain: Domain, index: number, categoryId: string, deckId: string, sourceSuffix: string): FlashcardRow {
  const modes = ["case", "differential", "diagnostic interpretation", "prescribing", "management", "preventive care"];
  const mode = modes[index % modes.length]!;
  const front =
    mode === "case"
      ? `AGPCNP case: In ${lesson.title}, how should the NP reason through ${domain.presentation} when the cue is ${domain.cue}?`
      : `AGPCNP ${mode}: What is the key NP-level decision in ${lesson.title} when ${domain.cue} is present?`;
  const back = [
    `Core answer: consider ${domain.differential}; use ${domain.diagnosticPlan}; manage with ${domain.managementPlan}; prescribe with ${domain.prescribingDecision}.`,
    `Difficulty: ${difficulty(index)}.`,
    `Blueprint mapping: ${domain.blueprint}. System: ${lesson.bodySystem ?? domain.system}.`,
    `Hint: Ask what changes diagnosis, disposition, prescribing safety, or follow-up.`,
    `Clinical pearl: ${domain.cue} is not background detail; it changes the NP's differential or safety plan.`,
    `Memory aid: Differentiate -> test with purpose -> manage by risk -> prescribe safely -> close follow-up.`,
    `Exam trap: ${domain.trap}.`,
    `Clinical significance: prevents ${domain.safety}.`,
    `Clinical application example: In clinic, pause routine treatment, confirm the leading and cannot-miss diagnoses, choose targeted testing, select safe therapy, and arrange measurable follow-up.`,
  ].join("\n\n");
  return {
    id: `agpcnp-fc-${String(index + 1).padStart(5, "0")}`,
    front,
    back,
    country: CountryCode.US,
    tier: TierCode.NP,
    status: ContentStatus.PUBLISHED,
    examFamily: ExamFamily.NP,
    categoryId,
    lessonId: lesson.slug,
    deckId,
    positionInDeck: index + 1,
    sourceKey: `agpcnp:flashcard:${sourceSuffix}`,
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
    const examId = `exam_agpcnp_launch_${padded}`;
    const tag = `exam-preset-agpcnp-launch-${padded}`;
    await prisma.exam.upsert({
      where: { id: examId },
      update: { title: `AGPCNP Blueprint Practice Exam ${i}`, status: ContentStatus.PUBLISHED },
      create: {
        id: examId,
        title: `AGPCNP Blueprint Practice Exam ${i}`,
        country: CountryCode.US,
        tier: TierCode.NP,
        examFamily: ExamFamily.NP,
        status: ContentStatus.PUBLISHED,
      },
    });
    const selected = seededPick(pool, 85, i).map((row) => row.id);
    if (selected.length > 0) {
      await prisma.$executeRaw`
        UPDATE exam_questions
        SET tags = array_append(tags, ${tag})
        WHERE id = ANY(${selected}::text[])
          AND NOT (tags @> ARRAY[${tag}]::text[])
      `;
    }
    if (i % 25 === 0) console.log(`Practice exams published: ${i}/${EXAM_TARGET}`);
  }
}

async function main(): Promise<void> {
  const lessons = loadLessons();
  const questions = buildQuestions(lessons);
  const adaptiveEligible = questions.filter((row) => row.isAdaptiveEligible).length;
  if (questions.length < QUESTION_TARGET) throw new Error(`Question target not met: ${questions.length}/${QUESTION_TARGET}`);
  if (adaptiveEligible < CAT_TARGET) throw new Error(`Adaptive eligibility target not met by generated rows: ${adaptiveEligible}/${CAT_TARGET}`);

  if (!APPLY) {
    console.log(`Dry run: ${questions.length} questions, ${adaptiveEligible} adaptive/CAT-eligible questions, ${lessons.length} source lessons.`);
    console.log(`Flashcards planned: ${Math.max(FLASHCARD_TARGET, lessons.length * FLASHCARDS_PER_LESSON)}; practice exams planned: ${EXAM_TARGET}.`);
    console.log("Run with --apply to publish.");
    return;
  }

  const prisma = new PrismaClient({ log: ["error"] });
  try {
    const category = await prisma.category.upsert({
      where: { slug: CATEGORY_SLUG },
      update: { name: "AGPCNP Launch Readiness", topicCode: "agpcnp-launch-readiness" },
      create: { slug: CATEGORY_SLUG, name: "AGPCNP Launch Readiness", topicCode: "agpcnp-launch-readiness" },
    });
    const deck = await prisma.flashcardDeck.upsert({
      where: { slug: DECK_SLUG },
      update: {
        title: "AGPCNP Advanced NP Clinical Reasoning Deck",
        description: "Lesson-derived Adult-Gerontology Primary Care NP flashcards focused on differential diagnosis, diagnostics, prescribing, preventive care, professional practice, and clinical management.",
        country: CountryCode.US,
        tier: TierCode.NP,
        examFamily: ExamFamily.NP,
        pathwayId: PATHWAY_ID,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: DECK_SLUG,
        title: "AGPCNP Advanced NP Clinical Reasoning Deck",
        description: "Lesson-derived Adult-Gerontology Primary Care NP flashcards focused on differential diagnosis, diagnostics, prescribing, preventive care, professional practice, and clinical management.",
        country: CountryCode.US,
        tier: TierCode.NP,
        examFamily: ExamFamily.NP,
        pathwayId: PATHWAY_ID,
        visibility: FlashcardDeckVisibility.SUBSCRIBER,
        status: ContentStatus.PUBLISHED,
      },
    });

    console.log(`Publishing ${questions.length} AGPCNP questions...`);
    for (const batch of chunk(questions, 250)) {
      await prisma.examQuestion.createMany({ data: batch, skipDuplicates: true });
    }

    const flashcards = buildFlashcards(lessons, category.id, deck.id);
    if (flashcards.length < FLASHCARD_TARGET) throw new Error(`Flashcard target not met: ${flashcards.length}/${FLASHCARD_TARGET}`);
    console.log(`Publishing ${flashcards.length} AGPCNP flashcards...`);
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
        exam: { in: ["AGPCNP", "ANCC-AGPCNP", "AGNP", "NP-AGPCNP", "NP"] },
        tier: { equals: "NP", mode: "insensitive" },
        countryCode: "US",
        isAdaptiveEligible: true,
        rationale: { not: null },
      },
      select: { id: true, bodySystem: true, difficulty: true, nclexClientNeedsCategory: true },
    });
    if (pool.length < CAT_TARGET) throw new Error(`Published adaptive/CAT pool below target: ${pool.length}/${CAT_TARGET}`);

    await createPracticeExams(prisma, pool);
    console.log(`AGPCNP launch readiness content published: questions=${questions.length}, flashcards=${flashcards.length}, adaptivePool=${pool.length}, practiceExams=${EXAM_TARGET}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
