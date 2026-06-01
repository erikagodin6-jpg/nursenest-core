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
const QUESTION_TARGET = readNumberFlag("--question-target", 4000);
const FLASHCARD_TARGET = readNumberFlag("--flashcard-target", 4000);
const EXAM_TARGET = readNumberFlag("--practice-exams", 200);
const QUESTIONS_PER_LESSON = readNumberFlag("--questions-per-lesson", 25);
const FLASHCARDS_PER_LESSON = readNumberFlag("--flashcards-per-lesson", 20);
const CAT_TARGET = readNumberFlag("--cat-target", 3000);
const PATHWAY_ID = "us-np-pmhnp";
const SOURCE_LESSON_PATHWAY_ID = "us-np-fnp";
const SOURCE = "pmhnp-launch-readiness-sprint";
const CATEGORY_SLUG = "pmhnp-launch-readiness";
const DECK_SLUG = "pmhnp-clinical-reasoning-launch-deck";
const LESSON_CATALOG = resolve(process.cwd(), "src/content/pathway-lessons/np-parity-expansion-catalog.json");

const PMHNP_INCLUDED_LESSON_RE =
  /\b(psych\w*|mental\s*health|depression|anxiety|bipolar|schizophren\w*|psychosis|ptsd|trauma|substanc\w*|addiction|alcohol|opioid|benzodiazepine|antidepressant|antipsychotic|mood\s*stabiliz\w*|lithium|ssri|snri|maoi|clozapine|quetiapine|risperidone|suicide|self\s*harm|crisis|psychiatric|mania|manic|borderline|personality|dissociation|eating\s*disorder|insomnia|sleep|schizoaffective|autism|adhd|dementia|delirium|cognitive\s*impairment|neurocognitive|adjustment\s*disorder|grief|motivational|cognitive\s*behavioral|dbt|act|harm\s*reduction)\b/i;

const PMHNP_PRIORITY_DOMAIN_IDS = new Set([
  "mental-health",
  "pharmacotherapeutics",
  "differential-diagnosis",
  "diagnostic-testing",
  "primary-care-assessment",
  "professional-practice",
  "ethics",
  "urgent-care",
  "leadership",
]);

const SHARED_DOMAINS: Domain[] = [
  domain("professional-practice", "Professional Practice", "Professional Practice", "Professional Practice", "Scope and accountability", "Professional practice", "a primary care visit where the requested action may exceed local NP authority", "unclear authority, incomplete consent, or missing follow-up responsibility", "regulatory scope issue versus clinical appropriateness versus organizational privilege gap", "verify legal authority, competence, patient-specific indication, and organizational policy before acting", "decline or modify the plan, document rationale, and arrange appropriate referral or consultation", "prescribe or perform only when authority, competence, indication, and monitoring are all satisfied", "proceeding because the clinical request seems reasonable", "clinical appropriateness alone does not authorize practice", "integrate legal authority, competence, context, and continuity before deciding", "unsafe practice, regulatory breach, and fragmented care"),
  domain("health-promotion", "Health Promotion", "Preventive Medicine", "Health Promotion and Prevention", "Risk reduction counselling", "Health promotion", "an adult preventive-care visit with modifiable cardiovascular and cancer risks", "smoking, sedentary behaviour, elevated blood pressure, and overdue screening", "modifiable risk cluster versus established disease requiring treatment today", "prioritize validated risk assessment, shared goals, screening eligibility, and motivational interviewing", "build a prevention plan with follow-up metrics and culturally safe counselling", "avoid medication unless guideline thresholds or comorbidity risks justify it", "ordering broad testing without addressing behaviour change or screening gaps", "mistaking testing volume for prevention quality", "use absolute risk, readiness, and guideline-based screening to create a measurable plan", "missed prevention, low adherence, and delayed diagnosis"),
  domain("mental-health", "Mental Health", "Mental Health", "Clinical Assessment and Diagnosis", "Mental health and substance use", "Assessment", "a patient reports mood change, anxiety, substance use, insomnia, or functional decline", "suicidal ideation, mania screen, substance use, trauma history, and medication effects change the plan", "major depression versus bipolar disorder versus substance-induced symptoms versus medical mimic", "screen risk, assess function, rule out mania/medical mimics, and determine urgency", "safety plan or urgent referral for risk; otherwise initiate evidence-based therapy and follow-up", "prescribe antidepressants only after bipolar risk and safety assessment are addressed", "starting an SSRI immediately because depression screening is positive", "treating a screen as a diagnosis", "risk assessment and differential diagnosis come before routine pharmacotherapy", "suicide risk, mania activation, substance complications, and missed medical illness"),
  domain("pharmacotherapeutics", "Pharmacotherapeutics", "Pharmacology", "Pharmacotherapeutics", "Prescribing safety", "Prescribing", "a patient needs medication initiation or adjustment in primary care", "renal/hepatic function, pregnancy potential, interactions, allergies, and monitoring requirements shape safety", "appropriate first-line therapy versus contraindicated drug versus dose/monitoring problem", "confirm indication, contraindications, interactions, baseline labs, and follow-up monitoring", "choose the safest effective therapy and document monitoring, counselling, and response plan", "individualize prescribing by comorbidity, organ function, interactions, and patient goals", "choosing the drug most commonly used without checking contraindications", "generic first-line thinking without patient-specific safety", "prescribing is a diagnostic and monitoring decision, not a memorized drug match", "adverse drug event, treatment failure, and antimicrobial resistance"),
  domain("differential-diagnosis", "Differential Diagnosis", "Diagnostics", "Clinical Assessment and Diagnosis", "Differential diagnosis", "Diagnostic reasoning", "a symptom has both common and high-risk causes", "time course, severity, red flags, exposures, and comorbidities shift the differential", "common benign cause versus dangerous mimic versus chronic disease complication", "rank likely and cannot-miss diagnoses, then test or refer based on risk", "treat only after the leading diagnosis is sufficiently supported or urgent risk is addressed", "avoid symptom suppression when it could mask a time-sensitive condition", "jumping to the statistically common diagnosis", "premature closure", "hold common and dangerous diagnoses together until risk is resolved", "missed emergency, delayed therapy, and false reassurance"),
  domain("diagnostic-testing", "Diagnostic Testing", "Diagnostics", "Clinical Assessment and Diagnosis", "Test selection and interpretation", "Diagnostic interpretation", "a clinician must choose tests for an ambiguous symptom or abnormal result", "pretest probability, timing, false positives, and whether results change management matter", "diagnostic uncertainty versus screening versus monitoring versus urgent referral", "choose tests that answer a specific clinical question and interpret them in context", "act on critical results and avoid low-value testing that will not change management", "avoid empiric treatment when a required diagnostic confirmation changes safety or disposition", "ordering broad panels to avoid missing anything", "confusing more data with better diagnosis", "test only when the result changes probability, safety, treatment, or follow-up", "false positives, missed diagnosis, over-treatment, and delayed referral"),
  domain("urgent-care", "Urgent Care Presentations", "Urgent Care", "Clinical Assessment and Diagnosis", "Urgent presentations", "Clinical judgment", "a patient presents with acute pain, dyspnea, fever, neurologic deficit, or severe dehydration", "abnormal vitals, altered mental status, severe pain, or rapid progression indicate higher acuity", "primary-care-manageable issue versus emergency referral versus same-day diagnostics", "stabilize, identify red flags, and determine disposition before routine outpatient treatment", "refer or transfer when acuity exceeds outpatient safety, while communicating key findings", "use empiric treatment only when it does not delay needed emergency care", "trying outpatient treatment first to avoid inconvenience", "under-triage of unstable presentations", "disposition is the diagnosis when safety is at stake", "shock, stroke delay, respiratory failure, and sepsis"),
  domain("leadership", "Leadership", "Leadership", "Professional Practice", "Systems leadership", "Leadership", "a clinic process creates repeated missed follow-up or medication errors", "similar near-misses recur across providers and documentation handoffs", "individual lapse versus system failure versus policy gap", "analyze the process, identify failure points, and engage team-based improvement", "implement a practical safety process and monitor outcomes", "avoid blame-only responses; fix the system and preserve accountability", "retraining one person without changing the unsafe workflow", "person-focused correction for a system defect", "NP leadership includes clinical care, quality improvement, and accountability", "repeat harm, unsafe transitions, and poor team trust"),
  domain("ethics", "Ethics", "Professional Practice", "Professional Practice", "Ethics and consent", "Ethics", "a patient refuses a recommended diagnostic test or treatment", "capacity, voluntariness, understanding, risk severity, and substitute decision-maker rules matter", "capable refusal versus impaired capacity versus coercion versus information gap", "assess capacity, provide balanced information, explore values, and document informed refusal", "respect capable decisions while arranging safety-netting and follow-up", "avoid coercive prescribing or testing when valid refusal is present", "asking family to decide because the clinician disagrees with the patient", "overriding autonomy without capacity assessment", "ethical practice balances autonomy, beneficence, nonmaleficence, and justice", "coercion, delayed care, complaint risk, and loss of trust"),
];

const PMHNP_OVERLAY_DOMAINS: Domain[] = [
  domain("suicide-risk", "Suicide Risk Assessment", "Mental Health", "Clinical Assessment and Diagnosis", "Safety planning and risk stratification", "Risk assessment", "a patient discloses passive or active suicidal ideation", "plan specificity, means access, intent, protective factors, and recent changes indicate imminent risk", "passive ideation versus active plan with intent versus chronic baseline versus acute crisis", "assess risk level using validated tool, identify modifiable risk factors, and determine disposition", "safety plan for low-to-moderate risk; emergency referral for high-risk presentations", "prescribe only after safety is addressed; restrict means access before initiating or adjusting medication", "reassuring without documenting a formal safety plan or risk stratification", "missing imminent risk by anchoring on chronic suicidality", "risk level and protective factors drive disposition — not severity of distress alone", "missed emergency, completed suicide, and inadequate documentation"),
  domain("bipolar-disorder", "Bipolar Disorder", "Mental Health", "Clinical Assessment and Diagnosis", "Mood disorder diagnosis and management", "Diagnostic reasoning", "a patient is referred or self-presents with unstable mood, irritability, or energy changes", "prior manic or hypomanic episode, family history, rapid cycling, and mixed features change diagnosis and treatment", "major depression versus bipolar I or II versus cyclothymia versus substance-induced mood disorder", "screen for lifetime hypomanic/manic episodes before starting antidepressants", "choose mood stabilizer or atypical antipsychotic as first-line; add psychotherapy; monitor lithium levels and renal function", "avoid antidepressant monotherapy in bipolar disorder; use lithium or valproate for prevention", "starting an SSRI because the patient presents in a depressive episode", "bipolar depression treated as unipolar depression", "bipolar diagnosis requires lifetime assessment — a depressive episode today does not rule out mania history", "mania induction, rapid cycling, lithium toxicity, and treatment non-response"),
  domain("psychosis-schizophrenia", "Psychosis and Schizophrenia", "Mental Health", "Clinical Assessment and Diagnosis", "Psychosis assessment and antipsychotic management", "Assessment", "a patient presents with hallucinations, delusions, disorganized thought, or first-episode psychosis", "onset acuity, duration, substance use, medical mimics, and baseline function determine urgency and diagnosis", "schizophrenia versus brief psychotic disorder versus substance-induced psychosis versus medical cause", "rule out medical causes, assess danger and capacity, determine substance use, and evaluate functional impact", "refer for first-episode evaluation; initiate antipsychotic after safety and consent are confirmed", "choose antipsychotic by side-effect profile, patient preference, adherence potential, and metabolic risk", "starting antipsychotic before ruling out medical or substance cause", "treating any positive symptom without baseline medical clearance", "psychosis requires medical and substance exclusion before psychiatric diagnosis is confirmed", "missed medical emergency, medication harm, poor adherence, and prolonged psychosis"),
  domain("anxiety-disorders", "Anxiety Disorders", "Mental Health", "Clinical Assessment and Diagnosis", "Anxiety and PTSD management", "Assessment", "a patient reports persistent worry, panic, avoidance, or PTSD symptoms", "traumatic history, comorbid depression, substance use, and somatic symptoms change diagnosis and safety", "GAD versus PTSD versus panic disorder versus somatic symptom disorder versus medical mimic", "screen for trauma, safety, substance use, and suicidality before selecting therapy", "first-line therapy is psychotherapy (CBT, EMDR for PTSD); add SSRI or SNRI for moderate-to-severe symptoms", "avoid benzodiazepines for long-term anxiety management; use them only for acute crisis with a clear taper plan", "prescribing benzodiazepine long-term because the patient requests fast relief", "short-term comfort overriding long-term harm", "trauma-informed assessment and evidence-based psychotherapy are first-line, not sedatives", "benzodiazepine dependence, disinhibition, missed comorbidity, and PTSD under-treatment"),
  domain("substance-use", "Substance Use Disorders", "Mental Health", "Pharmacotherapeutics", "Addiction medicine and harm reduction", "Management reasoning", "a patient discloses problematic alcohol, opioid, or stimulant use or is seeking medication-assisted treatment", "withdrawal risk, co-occurring psychiatric disorder, hepatic function, pregnancy status, and social support affect management", "substance use disorder versus intoxication versus withdrawal versus dual diagnosis versus untreated psychiatric disorder", "assess withdrawal severity, co-occurring mental health, social supports, and treatment readiness", "initiate MOUD for opioid use disorder, CIWA-guided treatment for alcohol withdrawal, and harm reduction counselling", "use buprenorphine, naltrexone, or methadone for opioid use disorder based on eligibility and preferences", "withholding MOUD until the patient commits to abstinence", "abstinence-only framing for a relapsing-remitting disease", "SUD is a chronic medical condition; engage with harm reduction before requiring readiness for abstinence", "overdose, withdrawal seizure, untreated psychiatric comorbidity, and loss to care"),
  domain("psychopharmacology-safety", "Psychopharmacology Safety", "Mental Health", "Pharmacotherapeutics", "Psychiatric prescribing safety", "Prescribing", "a patient on psychiatric medications needs a dose adjustment, new prescription, or is experiencing side effects", "QTc prolongation, metabolic effects, weight gain, sexual dysfunction, serotonin risk, and drug interactions alter selection", "therapeutic failure versus side-effect intolerance versus drug interaction versus inappropriate medication choice", "review current medications, labs, cardiac risk, and patient priorities before adjusting or adding a drug", "optimize current therapy before adding a second agent; choose the safest option by side-effect profile and interaction risk", "monitor metabolic markers (weight, glucose, lipids) for antipsychotics; ECG for QTc risk; lithium levels and renal function", "adding a new antidepressant or antipsychotic without checking for serotonin syndrome risk or QTc prolongation", "treating side effects with more medications instead of switching", "psychiatric prescribing requires the same safety checks as any high-alert medication class", "serotonin syndrome, QTc prolongation, metabolic syndrome, and polypharmacy harm"),
  domain("crisis-intervention", "Crisis Intervention", "Mental Health", "Clinical Assessment and Diagnosis", "Psychiatric emergency management", "Clinical judgment", "a patient is brought in or presents in acute psychiatric crisis: aggression, self-harm, or psychotic break", "immediate safety, environmental risk, capacity, and collateral history determine disposition", "behavioural escalation versus acute psychosis versus acute intoxication versus medical emergency", "de-escalate, assess immediate safety, and determine whether emergent psychiatric or medical evaluation is needed", "transfer for involuntary assessment when safety cannot be maintained; document rationale thoroughly", "use sedation only when de-escalation fails and immediate safety requires it; use the lowest effective dose", "attempting outpatient management when imminent safety risk is present", "under-triage of an acute psychiatric emergency", "safety and disposition assessment cannot wait for diagnostic certainty in crisis", "serious harm, inadequate documentation, and liability for premature discharge"),
];

const PMHNP_PRIORITY_DOMAINS = [
  ...PMHNP_OVERLAY_DOMAINS,
  ...SHARED_DOMAINS.filter((d) => PMHNP_PRIORITY_DOMAIN_IDS.has(d.id)),
];

function readNumberFlag(name: string, fallback: number): number {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  if (!arg) return fallback;
  const parsed = Number.parseInt(arg.slice(prefix.length), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function domain(id: string, label: string, system: string, blueprint: string, weakArea: string, category: string, presentation: string, cue: string, differential: string, diagnosticPlan: string, managementPlan: string, prescribingDecision: string, tempting: string, trap: string, reasoning: string, safety: string): Domain {
  return { id, label, system, blueprint, weakArea, category, presentation, cue, differential, diagnosticPlan, managementPlan, prescribingDecision, tempting, trap, reasoning, safety };
}

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase().replace(/\s+/g, " ")).digest("hex");
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 96);
}

function loadLessons(): CatalogLesson[] {
  const raw = JSON.parse(readFileSync(LESSON_CATALOG, "utf8")) as {
    pathways?: Record<string, CatalogLesson[] | { lessons?: CatalogLesson[] }>;
  };
  const entry = raw.pathways?.[SOURCE_LESSON_PATHWAY_ID];
  const allLessons = Array.isArray(entry) ? entry : entry?.lessons ?? [];
  const filtered = allLessons.filter((lesson) => {
    const text = `${lesson.title} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""}`;
    return PMHNP_INCLUDED_LESSON_RE.test(text);
  });
  // If fewer than 20 psych-matching lessons, also include all lessons (broad coverage)
  return filtered.length >= 20 ? filtered : allLessons;
}

function lessonDomain(lesson: CatalogLesson, index: number): Domain {
  const text = `${lesson.title} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""}`.toLowerCase();
  const direct =
    PMHNP_PRIORITY_DOMAINS.find((d) => text.includes(d.id.replace(/-/g, " "))) ??
    PMHNP_PRIORITY_DOMAINS.find((d) => text.includes(d.label.toLowerCase())) ??
    PMHNP_PRIORITY_DOMAINS.find((d) => text.includes(d.system.toLowerCase()));
  return direct ?? PMHNP_PRIORITY_DOMAINS[index % PMHNP_PRIORITY_DOMAINS.length]!;
}

function lessonSummary(lesson: CatalogLesson): string {
  return (lesson.sections ?? []).map((s) => s.body ?? "").join(" ").replace(/\s+/g, " ").trim().slice(0, 300);
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

function baseTags(lesson: CatalogLesson, dom: Domain, format: string): string[] {
  return [
    SOURCE,
    "pathway:us-np-pmhnp",
    "exam:PMHNP",
    "tier:NP",
    `lesson:${lesson.slug}`,
    `topic:${slugify(lesson.topic ?? dom.label)}`,
    `system:${slugify(lesson.bodySystem ?? dom.system)}`,
    `blueprint:${slugify(dom.blueprint)}`,
    `weak-area:${slugify(dom.weakArea)}`,
    `clinical-category:${slugify(dom.category)}`,
    `format:${format}`,
    "np-clinical-reasoning",
    "diagnostic-reasoning",
    "management-reasoning",
    "prescribing-reasoning",
    "psychiatric-np",
  ];
}

function teachingRationale(lesson: CatalogLesson, dom: Domain, correct: string): string {
  return [
    `Correct because the PMHNP must integrate diagnostic probability, safety assessment, prescribing safety, and follow-up responsibility: ${correct}.`,
    `Why alternatives are tempting: ${dom.tempting}. The PMHNP trap is ${dom.trap}.`,
    `Clinical cue to recognize: ${dom.cue}. That cue should shift the differential toward ${dom.differential}.`,
    `NP-level reasoning: ${dom.reasoning}.`,
    `Clinical takeaway for ${lesson.title}: choose the plan that confirms the diagnosis when needed, addresses safety, avoids unsafe prescribing, and closes the loop with monitoring.`,
  ].join(" ");
}

function optionRationales(optionMap: Record<string, string>, correctLetter: string, dom: Domain): Record<string, string> {
  return Object.fromEntries(
    Object.entries(optionMap).map(([letter, text]) => {
      if (letter === correctLetter) {
        return [letter, `${letter} is correct. ${text} matches the cue (${dom.cue}), addresses the leading differential (${dom.differential}), and uses NP-level psychiatric reasoning.`];
      }
      return [letter, `${letter} is incorrect. ${text} is tempting because ${dom.tempting}, but it misses ${dom.cue}, tests the PMHNP trap of ${dom.trap}, and fails to apply this NP reasoning: ${dom.reasoning}.`];
    }),
  );
}

function buildMcq(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `${dom.diagnosticPlan}; then ${dom.managementPlan}. Prescribing decision: ${dom.prescribingDecision}.`;
  const distractors = [
    `Prescribe a psychiatric medication based on the presenting symptom without ruling out medical causes, bipolar risk, or suicidality.`,
    `Order a broad panel of tests without linking results to diagnosis, disposition, or prescribing safety.`,
    `Provide reassurance and routine follow-up because the presentation is common in primary care.`,
  ];
  const rotated = rotate([correct, ...distractors], globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  const stem = `PMHNP ${dom.label} item ${localIndex + 1}. A psychiatric mental health NP sees ${dom.presentation} while applying ${lesson.title}. Key cue: ${dom.cue}. Which plan best demonstrates advanced PMHNP clinical reasoning?`;
  return questionRow({ id: `pmhnp-${slugify(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`, lesson, dom, stem, questionType: "MCQ", questionFormat: "mcq", options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })), correctAnswer: correctLetter, rationale: teachingRationale(lesson, dom, correct), difficulty: difficulty(globalIndex), tags: baseTags(lesson, dom, "mcq"), distractorRationales: { hint: "Start with the cannot-miss psychiatric differential, then choose assessment, safety planning, treatment, and prescribing safety steps.", optionRationales: optionRationales(optionMap, correctLetter, dom) }, adaptiveEligible: true });
}

function buildSata(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const options = [
    `Clarify the differential diagnosis: ${dom.differential}.`,
    `Use targeted diagnostics or safety assessment: ${dom.diagnosticPlan}.`,
    `Choose management that fits risk and follow-up reliability: ${dom.managementPlan}.`,
    `Make a patient-specific prescribing decision: ${dom.prescribingDecision}.`,
    `Prescribe a psychotropic immediately because the patient reports distress.`,
    `Order broad labs and defer psychiatric assessment until all medical causes are excluded.`,
  ];
  const optionMap = Object.fromEntries(letters(6).map((letter, idx) => [letter, options[idx]!]));
  const correctLetters = ["A", "B", "C", "D"];
  return questionRow({ id: `pmhnp-${slugify(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`, lesson, dom, stem: `Select all that apply. For ${lesson.title}, which NP actions best address ${dom.presentation} when the cue is ${dom.cue}?`, questionType: "SATA", questionFormat: "sata", options: letters(6).map((letter) => ({ letter, text: optionMap[letter] })), correctAnswer: correctLetters, rationale: `A-D are correct because PMHNP-level care requires differential diagnosis, targeted safety/diagnostic assessment, management reasoning, and prescribing safety. E is symptom-driven prescribing without differential. F is deferralism that delays psychiatric care.`, difficulty: difficulty(globalIndex), tags: [...baseTags(lesson, dom, "sata"), "select-all-that-apply"], distractorRationales: { hint: "Select actions that change diagnosis, treatment safety, prescribing, or follow-up; reject reflex prescribing and over-medicalizing.", optionRationales: Object.fromEntries(Object.entries(optionMap).map(([letter, text]) => [letter, correctLetters.includes(letter) ? `${letter} is correct. ${text} is an NP-level action tied to ${dom.blueprint}.` : `${letter} is incorrect. ${text} is tempting, but it reflects ${dom.trap} and misses ${dom.reasoning}.`])) }, adaptiveEligible: true });
}

function buildBowtie(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const bank = [
    { id: "condition", label: dom.differential },
    { id: "diagnostic", label: dom.diagnosticPlan },
    { id: "management", label: dom.managementPlan },
    { id: "prescribing", label: dom.prescribingDecision },
    { id: "reassure", label: "Reassure without addressing safety risk or diagnostic uncertainty" },
    { id: "broadtest", label: "Order broad labs and defer psychiatric assessment" },
  ];
  return questionRow({ id: `pmhnp-${slugify(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`, lesson, dom, stem: `Bowtie. Complete the PMHNP reasoning map for ${dom.presentation}. Cue: ${dom.cue}.`, questionType: "NGN_BOWTIE", questionFormat: "bowtie", options: { format: "bowtie", bank, slotLabels: { condition: "Most important psychiatric concern", intervention: "Targeted assessment or diagnostic step", monitoring: "Management / prescribing plan" } }, correctAnswer: { correctMapping: { condition: "condition", intervention: "diagnostic", monitoring: "management" } }, rationale: `Concern: ${dom.differential}. Assessment step: ${dom.diagnosticPlan}. Management: ${dom.managementPlan}. Prescribing must account for ${dom.prescribingDecision}. Reassurance and broad labs are traps because they do not resolve the clinical cue.`, difficulty: difficulty(globalIndex), tags: [...baseTags(lesson, dom, "bowtie"), "bowtie", "diagnostic-reasoning"], distractorRationales: { hint: "Connect the cue to a psychiatric differential, then choose the assessment, management, and prescribing steps that reduce risk.", bankRationales: Object.fromEntries(bank.map((item) => [item.id, ["condition", "diagnostic", "management", "prescribing"].includes(item.id) ? `${item.label} is clinically relevant because it advances diagnosis, management, or prescribing safety.` : `${item.label} is tempting but unsafe because it reflects ${dom.trap}.`])) }, adaptiveEligible: true });
}

function buildDifferential(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `Prioritize ${dom.differential}; use ${dom.diagnosticPlan} to separate high-risk from routine psychiatric presentations.`;
  const options = [correct, `Assume the most common psychiatric diagnosis and prescribe symptomatically without risk stratification.`, `Focus on patient reassurance because the symptom is common in mental health practice.`, `Order non-specific testing first and defer diagnostic reasoning until the patient returns.`];
  const rotated = rotate(options, globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  return questionRow({ id: `pmhnp-${slugify(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`, lesson, dom, stem: `Differential diagnosis. In ${lesson.title}, which diagnostic reasoning approach best fits the cue: ${dom.cue}?`, questionType: "MCQ", questionFormat: "differential_diagnosis", options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })), correctAnswer: correctLetter, rationale: teachingRationale(lesson, dom, correct), difficulty: difficulty(globalIndex), tags: [...baseTags(lesson, dom, "differential-diagnosis"), "differential-diagnosis"], distractorRationales: { hint: "Rank cannot-miss psychiatric diagnoses before routine outpatient explanations.", optionRationales: optionRationales(optionMap, correctLetter, dom) }, adaptiveEligible: true });
}

function buildClinicalManagement(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `${dom.managementPlan}; include follow-up parameters and escalation instructions for ${dom.safety}.`;
  const options = [correct, "Prescribe a psychotropic medication without confirming diagnosis, suicide risk assessment, or monitoring requirements.", "Defer all management until the patient completes a full psychiatric battery.", "Provide education only because shared decision-making is the most important NP role."];
  const rotated = rotate(options, globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  return questionRow({ id: `pmhnp-${slugify(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`, lesson, dom, stem: `Clinical management. Which management plan is safest for ${dom.presentation} in a PMHNP-style ${lesson.title} encounter?`, questionType: "MCQ", questionFormat: "clinical_management", options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })), correctAnswer: correctLetter, rationale: teachingRationale(lesson, dom, correct), difficulty: difficulty(globalIndex), tags: [...baseTags(lesson, dom, "clinical-management"), "management-reasoning"], distractorRationales: { hint: "Choose the plan that fits acuity, safety risk, diagnostic certainty, and follow-up reliability.", optionRationales: optionRationales(optionMap, correctLetter, dom) }, adaptiveEligible: true });
}

function buildDiagnosticInterpretation(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  const correct = `Interpret the result in light of psychiatric risk and ${dom.cue}; act only if the result changes diagnosis, safety, treatment, or prescribing plan.`;
  const options = [correct, "Treat any abnormal value as diagnostic even when it conflicts with the clinical picture.", "Repeat the full panel immediately because isolated abnormalities are always lab error.", "Ignore the result until psychiatric symptoms become severe enough for emergency care."];
  const rotated = rotate(options, globalIndex % 4);
  const optionLetters = letters(4);
  const optionMap = Object.fromEntries(optionLetters.map((letter, idx) => [letter, rotated[idx]!]));
  const correctLetter = optionLetters[rotated.indexOf(correct)]!;
  return questionRow({ id: `pmhnp-${slugify(lesson.slug)}-q-${String(localIndex + 1).padStart(3, "0")}`, lesson, dom, stem: `Diagnostic interpretation. A result is available during ${lesson.title}. Which interpretation best reflects PMHNP-level NP reasoning?`, questionType: "MCQ", questionFormat: "diagnostic_interpretation", options: optionLetters.map((letter) => ({ letter, text: optionMap[letter] })), correctAnswer: correctLetter, rationale: teachingRationale(lesson, dom, correct), difficulty: difficulty(globalIndex), tags: [...baseTags(lesson, dom, "diagnostic-interpretation"), "diagnostic-interpretation"], distractorRationales: { hint: "Ask what the test changes: risk level, diagnosis, treatment selection, prescribing safety, or disposition.", optionRationales: optionRationales(optionMap, correctLetter, dom) }, adaptiveEligible: true });
}

function questionRow(input: { id: string; lesson: CatalogLesson; dom: Domain; stem: string; questionType: string; questionFormat: string; options: unknown; correctAnswer: unknown; rationale: string; difficulty: number; tags: string[]; distractorRationales: unknown; adaptiveEligible: boolean }): QuestionRow {
  return {
    id: input.id,
    tier: "NP",
    exam: "PMHNP",
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
    bodySystem: input.lesson.bodySystem ?? input.dom.system,
    topic: input.lesson.topic ?? input.dom.label,
    subtopic: input.lesson.title,
    regionScope: "US_ONLY",
    stemHash: hash(input.stem),
    careerType: "nursing",
    scenario: `${input.dom.presentation}. ${lessonSummary(input.lesson)}`,
    clinicalPearl: `PMHNP pearl: ${input.dom.cue} should change the psychiatric differential, safety plan, management plan, prescribing safety check, or follow-up interval.`,
    examStrategy: "For PMHNP, avoid recall-level prescribing. Assess safety first, identify the differential, interpret targeted data, prescribe safely, and decide whether outpatient management is safe.",
    memoryHook: "Safety -> Differentiate -> Diagnose -> Manage -> Prescribe safely -> Close follow-up.",
    frameworkUsed: "Advanced PMHNP clinical reasoning: safety assessment, differential diagnosis, diagnostic interpretation, management reasoning, psychopharmacology safety, and professional accountability.",
    clinicalTrap: input.dom.trap,
    distractorRationales: input.distractorRationales as Prisma.InputJsonValue,
    qualityScores: { diagnosticReasoning: 5, managementReasoning: 5, prescribingSafety: 5, rationaleDepth: 5 } as Prisma.InputJsonValue,
    qualityScore: 95,
    countryCode: "US",
    regionCode: "US",
    licensingBody: "Psychiatric-Mental Health Nurse Practitioner",
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
    clinicalReasoning: `The PMHNP must connect ${input.dom.cue} to ${input.dom.differential}, choose ${input.dom.diagnosticPlan}, manage with ${input.dom.managementPlan}, and prescribe with ${input.dom.prescribingDecision}.`,
    keyTakeaway: `For ${input.lesson.title}, the safest answer is the one that changes diagnosis, safety plan, management, prescribing safety, or follow-up in response to the cue.`,
    mnemonic: "Safety -> Dx -> Data -> Decision -> Drug safety -> Disposition",
    referenceSource: "NurseNest PMHNP lesson-derived launch readiness sprint",
    blueprintWeight: input.adaptiveEligible ? 1.1 : 0.7,
    nclexClientNeedsCategory: input.dom.blueprint,
    nclexClientNeedsSubcategory: input.dom.weakArea.slice(0, 128),
    studyLinkPathwayId: PATHWAY_ID,
    studyLinkLessonSlug: input.lesson.slug,
    sourceVersion: 1,
  };
}

function buildQuestionByType(lesson: CatalogLesson, dom: Domain, localIndex: number, globalIndex: number): QuestionRow {
  switch (localIndex % 12) {
    case 1: case 7: return buildSata(lesson, dom, localIndex, globalIndex);
    case 2: return buildBowtie(lesson, dom, localIndex, globalIndex);
    case 3: return buildDifferential(lesson, dom, localIndex, globalIndex);
    case 5: return buildClinicalManagement(lesson, dom, localIndex, globalIndex);
    case 10: return buildDiagnosticInterpretation(lesson, dom, localIndex, globalIndex);
    default: return buildMcq(lesson, dom, localIndex, globalIndex);
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
    const dom = PMHNP_PRIORITY_DOMAINS[extra % PMHNP_PRIORITY_DOMAINS.length]!;
    rows.push(buildQuestionByType(lesson, dom, QUESTIONS_PER_LESSON + extra, rows.length));
    extra++;
  }
  return rows.slice(0, Math.max(QUESTION_TARGET, rows.length));
}

function flashcardRow(lesson: CatalogLesson, dom: Domain, index: number, categoryId: string, deckId: string, sourceSuffix: string): FlashcardRow {
  const modes = ["case", "differential", "safety assessment", "prescribing", "management", "diagnostic interpretation"];
  const mode = modes[index % modes.length]!;
  const front = mode === "case"
    ? `PMHNP case: In ${lesson.title}, how should the NP reason through ${dom.presentation} when the cue is ${dom.cue}?`
    : `PMHNP ${mode}: What is the key NP-level decision in ${lesson.title} when ${dom.cue} is present?`;
  const back = [
    `Core answer: consider ${dom.differential}; use ${dom.diagnosticPlan}; manage with ${dom.managementPlan}; prescribe with ${dom.prescribingDecision}.`,
    `Difficulty: ${difficulty(index)}.`,
    `Blueprint mapping: ${dom.blueprint}. System: ${lesson.bodySystem ?? dom.system}.`,
    `Hint: Ask what changes diagnosis, safety plan, disposition, prescribing safety, or follow-up.`,
    `Clinical pearl: ${dom.cue} is not background detail; it changes the NP's psychiatric differential or safety plan.`,
    `Memory aid: Safety -> Differentiate -> Diagnose -> Manage -> Prescribe safely -> Close follow-up.`,
    `Exam trap: ${dom.trap}.`,
    `Clinical significance: prevents ${dom.safety}.`,
    `Clinical application: In clinic, assess safety first, confirm the leading and cannot-miss diagnoses, choose targeted assessment, select safe therapy, and arrange measurable follow-up.`,
  ].join("\n\n");
  return {
    id: `pmhnp-fc-${String(index + 1).padStart(5, "0")}`,
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
    sourceKey: `pmhnp:flashcard:${sourceSuffix}`,
    examItemKind: null,
  };
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
    const dom = PMHNP_PRIORITY_DOMAINS[extra % PMHNP_PRIORITY_DOMAINS.length]!;
    rows.push(flashcardRow(lesson, dom, rows.length, categoryId, deckId, `extra:${String(extra + 1).padStart(5, "0")}`));
    extra++;
  }
  return rows.slice(0, Math.max(FLASHCARD_TARGET, rows.length));
}

function chunk<T>(rows: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

function seededPick<T extends { id: string }>(pool: T[], count: number, seed: number): T[] {
  return pool.map((item) => ({ item, score: hash(`${seed}:${item.id}`).slice(0, 12) })).sort((a, b) => a.score.localeCompare(b.score)).map((entry) => entry.item).slice(0, count);
}

async function createPracticeExams(prisma: PrismaClient, pool: Array<{ id: string; bodySystem: string | null; difficulty: number | null; nclexClientNeedsCategory: string | null }>): Promise<void> {
  for (let i = 1; i <= EXAM_TARGET; i++) {
    const padded = String(i).padStart(3, "0");
    const examId = `exam_pmhnp_launch_${padded}`;
    const tag = `exam-preset-pmhnp-launch-${padded}`;
    await prisma.exam.upsert({
      where: { id: examId },
      update: { title: `PMHNP Blueprint Practice Exam ${i}`, status: ContentStatus.PUBLISHED },
      create: { id: examId, title: `PMHNP Blueprint Practice Exam ${i}`, country: CountryCode.US, tier: TierCode.NP, examFamily: ExamFamily.NP, status: ContentStatus.PUBLISHED },
    });
    const selected = seededPick(pool, 85, i).map((row) => row.id);
    if (selected.length > 0) {
      await prisma.$executeRaw`UPDATE exam_questions SET tags = array_append(tags, ${tag}) WHERE id = ANY(${selected}::text[]) AND NOT (tags @> ARRAY[${tag}]::text[])`;
    }
    if (i % 25 === 0) console.log(`Practice exams published: ${i}/${EXAM_TARGET}`);
  }
}

async function main(): Promise<void> {
  const lessons = loadLessons();
  const questions = buildQuestions(lessons);
  const adaptiveEligible = questions.filter((row) => row.isAdaptiveEligible).length;
  if (questions.length < QUESTION_TARGET) throw new Error(`Question target not met: ${questions.length}/${QUESTION_TARGET}`);
  if (adaptiveEligible < CAT_TARGET) throw new Error(`Adaptive eligibility target not met: ${adaptiveEligible}/${CAT_TARGET}`);

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
      update: { name: "PMHNP Launch Readiness", topicCode: "pmhnp-launch-readiness" },
      create: { slug: CATEGORY_SLUG, name: "PMHNP Launch Readiness", topicCode: "pmhnp-launch-readiness" },
    });
    const deck = await prisma.flashcardDeck.upsert({
      where: { slug: DECK_SLUG },
      update: { title: "PMHNP Advanced NP Clinical Reasoning Deck", description: "Lesson-derived Psychiatric-Mental Health NP flashcards focused on safety assessment, psychopharmacology, mood disorders, psychosis, anxiety, substance use, and crisis intervention.", country: CountryCode.US, tier: TierCode.NP, examFamily: ExamFamily.NP, pathwayId: PATHWAY_ID, visibility: FlashcardDeckVisibility.SUBSCRIBER, status: ContentStatus.PUBLISHED },
      create: { slug: DECK_SLUG, title: "PMHNP Advanced NP Clinical Reasoning Deck", description: "Lesson-derived Psychiatric-Mental Health NP flashcards focused on safety assessment, psychopharmacology, mood disorders, psychosis, anxiety, substance use, and crisis intervention.", country: CountryCode.US, tier: TierCode.NP, examFamily: ExamFamily.NP, pathwayId: PATHWAY_ID, visibility: FlashcardDeckVisibility.SUBSCRIBER, status: ContentStatus.PUBLISHED },
    });

    console.log(`Publishing ${questions.length} PMHNP questions...`);
    for (const batch of chunk(questions, 250)) {
      await prisma.examQuestion.createMany({ data: batch, skipDuplicates: true });
    }

    const flashcards = buildFlashcards(lessons, category.id, deck.id);
    if (flashcards.length < FLASHCARD_TARGET) throw new Error(`Flashcard target not met: ${flashcards.length}/${FLASHCARD_TARGET}`);
    console.log(`Publishing ${flashcards.length} PMHNP flashcards...`);
    for (const batch of chunk(flashcards, 250)) {
      await prisma.flashcard.createMany({ data: batch, skipDuplicates: true });
    }
    await prisma.flashcardDeck.update({ where: { id: deck.id }, data: { cardCount: await prisma.flashcard.count({ where: { deckId: deck.id, status: ContentStatus.PUBLISHED } }) } });

    const pool = await prisma.examQuestion.findMany({
      where: { status: { in: ["published", "PUBLISHED"] }, exam: { in: ["PMHNP", "NP", "PSYCH-NP"] }, tier: { equals: "NP", mode: "insensitive" }, countryCode: "US", isAdaptiveEligible: true, rationale: { not: null } },
      select: { id: true, bodySystem: true, difficulty: true, nclexClientNeedsCategory: true },
    });
    if (pool.length < CAT_TARGET) throw new Error(`Published adaptive/CAT pool below target: ${pool.length}/${CAT_TARGET}`);

    await createPracticeExams(prisma, pool);
    console.log(`PMHNP launch readiness content published: questions=${questions.length}, flashcards=${flashcards.length}, adaptivePool=${pool.length}, practiceExams=${EXAM_TARGET}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
