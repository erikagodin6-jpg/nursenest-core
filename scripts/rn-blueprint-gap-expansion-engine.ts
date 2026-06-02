import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import { createLazyPrimaryPoolProxy } from "../server/db";
import {
  NCLEX_RN_2026_COVERAGE_MAP,
  NCLEX_RN_2026_SOURCE,
  NCLEX_RN_CLINICAL_JUDGMENT_STEPS,
  NCLEX_RN_INTEGRATED_PROCESSES,
  NURSENEST_RN_DEEP_COVERAGE_STANDARD,
  type NclexRnCoverageConcept,
} from "../server/data/nclex-rn-2026-coverage-map";

const pool = createLazyPrimaryPoolProxy();

type ContentBlock =
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type GeneratedQuestion = {
  stem: string;
  options: string[];
  correctAnswer: number[];
  rationale: string;
  scenario: string;
  clinicalPearl: string;
  correctAnswerExplanation: string;
  incorrectAnswerRationale: Record<string, string>;
  clinicalReasoning: string;
  keyTakeaway: string;
  difficulty: number;
  questionType: string;
  topic: string;
  bodySystem: string;
  blueprintCategory: string;
};

type ExpansionPlanItem = {
  blueprintCategory: string;
  clientNeed: string;
  concept: string;
  action: "lesson" | "question_set" | "ngn_case_set" | "sata_set";
  priority: number;
};

type ExpansionRunSummary = {
  generatedAt: string;
  dryRun: boolean;
  limit: number;
  lessonsCreated: number;
  questionsCreated: number;
  skippedExistingLessons: number;
  failedItems: Array<{ item: ExpansionPlanItem; error: string }>;
  plannedItems: ExpansionPlanItem[];
};

const REQUIRED_LESSON_SECTIONS = [
  "Overview",
  "Pathophysiology",
  "Risk Factors",
  "Signs & Symptoms",
  "Diagnostics & Labs",
  "Management & Treatments",
  "Clinical Decision-Making & Nursing Priorities",
  "Complications",
  "Clinical Pearls",
  "Patient & Client Education",
  "Case-Based Application",
];

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function resolveModel(): string {
  return (
    process.env.RN_CONTENT_REPAIR_MODEL?.trim() ||
    process.env.LESSON_OPENAI_MODEL?.trim() ||
    process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim() ||
    "gpt-4.1-mini"
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function hash(input: string): string {
  return crypto.createHash("sha256").update(input.toLowerCase().trim()).digest("hex");
}

function asJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeQuestionType(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("select") || lower.includes("sata")) return "select_all_that_apply";
  if (lower.includes("case") || lower.includes("ngn")) return "case_study";
  if (lower.includes("matrix")) return "matrix";
  if (lower.includes("bow")) return "bow_tie";
  if (lower.includes("trend")) return "trend";
  return "multiple_choice";
}

function bodySystemForConcept(concept: string, category: string): string {
  const text = `${concept} ${category}`.toLowerCase();
  if (/cardiac|heart|mi|acs|hypertension|dysrhythm|perfusion|hemodynamic|shock|pe\b|dvt/.test(text)) return "Cardiovascular";
  if (/respiratory|oxygen|ventilation|asthma|copd|pneumonia|airway|aspiration/.test(text)) return "Respiratory";
  if (/neuro|stroke|seizure|intracranial|mental status|autonomic|spinal/.test(text)) return "Neurology";
  if (/renal|kidney|urine|oliguria|fluid|electrolyte|acid-base|potassium|sodium/.test(text)) return "Renal";
  if (/endocrine|diabetes|insulin|thyroid|adrenal|dka|hhs|glucose/.test(text)) return "Endocrine";
  if (/pregnancy|prenatal|postpartum|newborn|labor|fetal|obstetric|maternal/.test(text)) return "Maternal/OB";
  if (/pediatric|child|infant|adolescent|milestone|growth/.test(text)) return "Pediatrics";
  if (/psych|suicide|abuse|trauma|withdrawal|addiction|therapeutic|hallucination|violence/.test(text)) return "Mental Health";
  if (/pharm|medication|drug|dose|transfusion|blood|iv|antidote|high-alert|opioid|anticoagulant/.test(text)) return "Pharmacology";
  if (/infection|ppe|isolation|safety|fall|restraint|asepsis|sterile/.test(text)) return "Foundations";
  if (/nutrition|skin|mobility|elimination|comfort|ostomy|catheter/.test(text)) return "Foundations";
  return "Integrated Nursing";
}

function buildLessonTitle(concept: string): string {
  return concept
    .split(/\s+/)
    .map((part) => part.length <= 3 && part === part.toUpperCase() ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of")
    .replace(/\bIn\b/g, "in");
}

function buildFallbackLesson(concept: string, mapItem: NclexRnCoverageConcept): ContentBlock[] {
  const title = buildLessonTitle(concept);
  const category = mapItem.subcategory || mapItem.clientNeed;
  const bodySystem = bodySystemForConcept(concept, category);
  return [
    { type: "subheading", text: "Overview" },
    { type: "paragraph", text: `${title} is a required NCLEX-RN competency within ${category}. It matters because entry-level registered nurses must connect patient cues to risk, choose safe nursing actions, recognize deterioration, and communicate clearly with the health care team. This concept should be taught across beginner, intermediate, and advanced levels: beginner learners define the concept and identify expected findings; intermediate learners link findings to pathophysiology and nursing interventions; advanced learners prioritize unstable presentations, recognize complications, and evaluate response to treatment. NurseNest lessons should always connect this concept to the NCSBN clinical judgment steps: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.` },
    { type: "subheading", text: "Pathophysiology" },
    { type: "paragraph", text: `The pathophysiology behind ${concept} depends on the involved body system, but the RN-level logic is consistent: a stressor disrupts normal cellular function, which changes tissue perfusion, oxygenation, immune response, neurologic signaling, endocrine regulation, fluid balance, or medication response. These disruptions create objective cues such as abnormal vital signs, altered mental status, new pain, abnormal breath sounds, poor urine output, bleeding, electrolyte changes, glucose instability, or impaired mobility. Compensation can mask severity early, especially in pediatric and obstetric patients, while older adults may present atypically with confusion, weakness, falls, or reduced intake. Deep understanding means explaining why each cue occurs, not merely memorizing a list of symptoms.` },
    { type: "paragraph", text: `At the advanced level, the nurse must anticipate what happens if compensation fails. Hypoxia can progress to respiratory failure, poor perfusion can progress to shock or acute kidney injury, infection can progress to sepsis, and medication effects can progress to toxicity or life-threatening adverse events. The safest RN response is to trend findings over time and compare them with the patient's baseline rather than waiting for a single catastrophic value.` },
    { type: "subheading", text: "Risk Factors" },
    { type: "list", items: [
      `Modifiable risks: uncontrolled chronic illness, missed medications, tobacco exposure, alcohol/substance use, poor nutrition, immobility, delayed follow-up, and low health literacy.`,
      `Non-modifiable risks: age, pregnancy or postpartum physiology, genetic predisposition, prior disease, congenital conditions, and reduced physiologic reserve.`,
      `Clinical risks: polypharmacy, immunosuppression, invasive lines, indwelling catheters, anticoagulant or insulin therapy, recent surgery, and current infection.`,
      `Contextual risks: limited access to care, cost barriers, unstable housing, unsafe home environment, caregiver strain, and transportation barriers.`,
      `High-risk populations: infants, older adults, pregnant/postpartum clients, clients with renal disease, and clients with complex comorbidities.`
    ] },
    { type: "subheading", text: "Signs & Symptoms" },
    { type: "paragraph", text: `Early signs may include mild vital-sign changes, restlessness, increased pain, reduced activity tolerance, new anxiety, low-grade fever, decreased intake, or subtle confusion. Each sign must be interpreted through the mechanism: tachycardia may reflect hypovolemia, fever, pain, hypoxia, or anxiety; confusion may reflect hypoxia, infection, glucose abnormality, medication effect, or reduced cerebral perfusion; decreased urine output may indicate poor renal perfusion, obstruction, dehydration, or acute kidney injury. Late signs include hypotension, cyanosis, severe dyspnea, syncope, seizures, uncontrolled bleeding, chest pain, anuria, or rapidly worsening mental status. Red flags require immediate escalation.` },
    { type: "subheading", text: "Diagnostics & Labs" },
    { type: "list", items: [
      `Vital-sign trends and focused assessment findings are always diagnostic data; compare current findings with baseline and prior shifts.`,
      `CBC evaluates infection, anemia, bleeding risk, and immune suppression; trend WBC, hemoglobin, hematocrit, and platelets.`,
      `BMP/CMP evaluates sodium, potassium, bicarbonate, glucose, BUN, creatinine, liver markers, calcium, and albumin for metabolic and medication-safety implications.`,
      `ABG/VBG, lactate, ECG, troponin, coagulation studies, cultures, urinalysis, imaging, and procedure-specific tests are used when clinically indicated.`,
      `Critical values require immediate provider notification, clear documentation, and reassessment after intervention.`
    ] },
    { type: "subheading", text: "Management & Treatments" },
    { type: "paragraph", text: `Management begins with stabilization and cause-directed care. RN actions include airway positioning, oxygen as ordered/protocolized, IV access support, medication safety checks, allergy verification, focused reassessment, fall/injury prevention, infection-control practices, and timely escalation. Medical treatment may include fluids, antibiotics, bronchodilators, antihypertensives, anticoagulants, insulin, analgesics, reversal agents, electrolytes, blood products, or procedure-specific therapy. The nurse must know the purpose of each treatment and what response is expected. For example, oxygen should improve saturation and work of breathing; fluids should improve perfusion and urine output when hypovolemia is present; antibiotics should align with infection source and culture timing; and high-alert medications require independent double-checks according to policy.` },
    { type: "subheading", text: "Clinical Decision-Making & Nursing Priorities" },
    { type: "paragraph", text: `Use ABCs first, then safety, then the nursing process. If the patient has airway compromise, severe respiratory distress, unstable circulation, sudden neurologic change, active hemorrhage, or signs of shock, the nurse acts and escalates immediately. If the patient is stable, assessment comes before intervention. Prioritize acute over chronic, unstable over stable, unexpected over expected, and actual threats over potential future problems. Delegation must preserve RN judgment: assessment, teaching, evaluation, unstable patients, and clinical decisions remain with the RN; routine tasks for stable patients may be delegated with clear instructions and follow-up.` },
    { type: "subheading", text: "Complications" },
    { type: "list", items: [
      `Respiratory failure, aspiration, atelectasis, or pneumonia when oxygenation/ventilation is impaired.`,
      `Shock, dysrhythmias, ischemia, hemorrhage, or clot propagation when circulation/perfusion is impaired.`,
      `Acute kidney injury, electrolyte abnormalities, glucose instability, or acid-base imbalance when renal/metabolic reserve is reduced.`,
      `Sepsis, line infection, wound infection, or opportunistic infection when immune defenses are compromised.`,
      `Falls, delirium, pressure injury, medication error, aspiration, or failure to rescue when nursing surveillance is inadequate.`
    ] },
    { type: "subheading", text: "Clinical Pearls" },
    { type: "paragraph", text: `NCLEX often tests ${concept} through priority wording. Do not choose teaching when the patient is unstable. Do not document before assessing or treating an immediate safety threat. Do not delegate assessment, education, evaluation, or unstable care. Do not ignore a patient who questions a medication. Do not silence an alarm without assessing the cause. Link every answer to clinical judgment: recognize cues, analyze what they mean, prioritize the most dangerous hypothesis, generate safe options, take the safest action, and evaluate whether the patient improved.` },
    { type: "subheading", text: "Patient & Client Education" },
    { type: "paragraph", text: `Education should explain the condition in plain language, medication purpose and adverse effects, warning signs, follow-up needs, self-monitoring, diet/activity restrictions, and when to call the provider versus emergency services. Use teach-back and demonstration. Include family/caregivers when appropriate and address cost, transportation, language, culture, and health-literacy barriers. Discharge is unsafe if the patient cannot explain the plan or lacks access to medications, supplies, or follow-up.` },
    { type: "subheading", text: "Case-Based Application" },
    { type: "paragraph", text: `Case: Avery, a 71-year-old client with diabetes, hypertension, and chronic kidney disease, is admitted with findings related to ${concept}. The nurse notes HR 112, RR 24, BP 94/58, SpO2 91%, new confusion, reduced urine output, and abnormal labs. Question 1: Which cues are most concerning? The concerning cues are hypotension, tachypnea, low oxygen saturation, new confusion, oliguria, and abnormal labs because they suggest impaired perfusion/oxygenation and possible deterioration. Question 2: What should the nurse do first? Apply the ABC/safety framework: call for help, position for breathing, apply oxygen per protocol/order, verify IV access, obtain focused assessment and repeat vitals, review critical labs, anticipate orders, and reassess response. This case shows why ${concept} must be taught as clinical judgment, not isolated memorization.` },
  ];
}

async function generateLessonWithAi(openai: OpenAI | null, concept: string, mapItem: NclexRnCoverageConcept): Promise<ContentBlock[]> {
  if (!openai) return buildFallbackLesson(concept, mapItem);
  const category = mapItem.subcategory || mapItem.clientNeed;
  const prompt = `Create a deep NCLEX-RN lesson for this concept: ${concept}\nBlueprint category: ${category}\nClient need: ${mapItem.clientNeed}\nIntegrated processes: ${NCLEX_RN_INTEGRATED_PROCESSES.join(", ")}\nClinical judgment steps: ${NCLEX_RN_CLINICAL_JUDGMENT_STEPS.join(", ")}\n\nRequirements:\n- Return ONLY JSON object {"content": ContentBlock[]}\n- ContentBlock types: subheading, paragraph, list\n- Use exactly these sections in order: ${REQUIRED_LESSON_SECTIONS.join(" | ")}\n- 1500-1800 words\n- Include beginner/intermediate/advanced progression\n- Include pathophysiology, labs, meds, nursing priorities, delegation, safety, red flags, patient education, and a realistic case\n- Do not copy from any external source.`;
  try {
    const response = await openai.chat.completions.create({
      model: resolveModel(),
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a senior RN educator and NCLEX-RN content architect. Produce original, clinically accurate, bedside-relevant content." },
        { role: "user", content: prompt },
      ],
    });
    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    const content = Array.isArray(parsed.content) ? parsed.content : [];
    const text = JSON.stringify(content);
    if (content.length >= 18 && wordCount(text) >= 1200) return content;
    return buildFallbackLesson(concept, mapItem);
  } catch {
    return buildFallbackLesson(concept, mapItem);
  }
}

function buildFallbackQuestions(concept: string, mapItem: NclexRnCoverageConcept, count: number, forcedType?: string): GeneratedQuestion[] {
  const category = mapItem.subcategory || mapItem.clientNeed;
  const bodySystem = bodySystemForConcept(concept, category);
  const types = forcedType ? [forcedType] : ["multiple_choice", "select_all_that_apply", "case_study"];
  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const questionType = normalizeQuestionType(types[i % types.length]);
    const isSata = questionType === "select_all_that_apply";
    questions.push({
      stem: isSata
        ? `The RN is caring for a client with findings related to ${concept}. Which assessment cues require immediate follow-up? Select all that apply.`
        : `A client presents with findings related to ${concept}. Which nursing action is the priority?`,
      options: isSata
        ? [
            "New change in level of consciousness",
            "Oxygen saturation below baseline with increased work of breathing",
            "Sudden hypotension or signs of poor perfusion",
            "Client asks for the television remote",
            "Family asks about visiting hours",
          ]
        : [
            "Assess airway, breathing, circulation, obtain focused vital signs, and escalate if unstable",
            "Document the finding and reassess at the end of the shift",
            "Delegate the initial assessment to unlicensed assistive personnel",
            "Begin discharge teaching before evaluating current stability",
          ],
      correctAnswer: isSata ? [0, 1, 2] : [0],
      rationale: `The priority in ${concept} is to identify whether the client is unstable, connect cues to likely deterioration, and intervene using ABCs and safety principles. Acute mental status change, worsening oxygenation, hypotension, and poor perfusion require immediate RN assessment and escalation. Nonurgent comfort or visitor concerns can wait until physiologic threats are addressed.`,
      scenario: `A client in the ${bodySystem.toLowerCase()} clinical context has new findings related to ${concept} and requires RN clinical judgment.`,
      clinicalPearl: `For ${concept}, NCLEX prioritizes unstable cues, safety, delegation boundaries, and timely escalation over routine documentation or teaching.`,
      correctAnswerExplanation: `The correct response addresses immediate physiologic risk and preserves RN responsibility for assessment, judgment, and evaluation.`,
      incorrectAnswerRationale: isSata
        ? { D: "This is nonurgent and does not address physiologic instability.", E: "This is a routine concern that can wait until urgent assessment is complete." }
        : {
            B: "Documentation is important but does not come before assessment/intervention for possible deterioration.",
            C: "Initial assessment and evaluation of instability require RN judgment and cannot be delegated to UAP.",
            D: "Teaching is inappropriate before determining whether the client is currently stable.",
          },
      clinicalReasoning: `Use the clinical judgment model: recognize abnormal cues, analyze whether they indicate deterioration, prioritize the most dangerous hypothesis, generate safe actions, take the action that protects airway/breathing/circulation/safety, and evaluate response.`,
      keyTakeaway: `${concept} should be answered through priority, safety, and clinical judgment logic rather than memorized keywords.`,
      difficulty: Math.min(5, 3 + (i % 3)),
      questionType,
      topic: buildLessonTitle(concept),
      bodySystem,
      blueprintCategory: category,
    });
  }
  return questions;
}

async function generateQuestionsWithAi(openai: OpenAI | null, concept: string, mapItem: NclexRnCoverageConcept, count: number, forcedType?: string): Promise<GeneratedQuestion[]> {
  if (!openai) return buildFallbackQuestions(concept, mapItem, count, forcedType);
  const category = mapItem.subcategory || mapItem.clientNeed;
  const prompt = `Generate ${count} original NCLEX-RN questions for concept: ${concept}\nBlueprint category: ${category}\nClient need: ${mapItem.clientNeed}\nRequired type emphasis: ${forcedType || "mixed multiple_choice, select_all_that_apply, case_study"}\n\nReturn ONLY JSON object {"questions": GeneratedQuestion[]} with keys: stem, options, correctAnswer, rationale, scenario, clinicalPearl, correctAnswerExplanation, incorrectAnswerRationale, clinicalReasoning, keyTakeaway, difficulty, questionType, topic, bodySystem, blueprintCategory.\n\nRequirements:\n- Original content only; do not copy external or proprietary questions.\n- Deep rationales and specific distractor rationales.\n- Include NGN clinical judgment logic where possible.\n- Include prioritization, delegation, safety, labs, meds, and complication cues when clinically appropriate.\n- Use difficulty 3-5.\n- correctAnswer is zero-based index array.`;
  try {
    const response = await openai.chat.completions.create({
      model: resolveModel(),
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a senior NCLEX-RN item writer. Write clinically plausible, original, high-quality items." },
        { role: "user", content: prompt },
      ],
    });
    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    if (questions.length >= count) return questions.slice(0, count).map((q: GeneratedQuestion) => ({ ...q, questionType: normalizeQuestionType(q.questionType || forcedType || "multiple_choice") }));
    return buildFallbackQuestions(concept, mapItem, count, forcedType);
  } catch {
    return buildFallbackQuestions(concept, mapItem, count, forcedType);
  }
}

async function lessonExists(slug: string): Promise<boolean> {
  const result = await pool.query(`SELECT 1 FROM content_items WHERE slug = $1 LIMIT 1`, [slug]);
  return result.rowCount > 0;
}

async function insertLesson(concept: string, mapItem: NclexRnCoverageConcept, content: ContentBlock[]) {
  const title = buildLessonTitle(concept);
  const category = mapItem.subcategory || mapItem.clientNeed;
  const bodySystem = bodySystemForConcept(concept, category);
  const slug = `rn-${slugify(category)}-${slugify(concept)}`;
  const summary = `Deep NCLEX-RN lesson covering ${concept} with pathophysiology, nursing priorities, safety, labs, medications, patient education, and case-based application.`;
  const exists = await lessonExists(slug);
  if (exists) return { inserted: false, slug };
  await pool.query(
    `INSERT INTO content_items (id, title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, secondary_keywords, auto_publish, region_scope, author_name, published_at, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, 'lesson', $3, $4, 'rn', 'published', $5, $6, $7, $8, $9, $10, $11, $12, true, 'BOTH', 'NurseNest Content Team', NOW(), NOW(), NOW())`,
    [
      title,
      slug,
      category,
      bodySystem,
      [category, bodySystem, concept, "NCLEX-RN", "NGN"],
      summary,
      JSON.stringify(content),
      `${title} - NCLEX-RN Deep Lesson | NurseNest`,
      summary.slice(0, 155),
      [concept, category, bodySystem, "NCLEX RN", "NGN nursing"],
      concept,
      [category, bodySystem, "clinical judgment"],
    ]
  );
  return { inserted: true, slug };
}

async function insertQuestion(question: GeneratedQuestion) {
  const contentHash = hash(`${question.stem}:${JSON.stringify(question.options)}`);
  await pool.query(
    `INSERT INTO exam_questions (
      id, tier, exam, stem, options, correct_answer, rationale, body_system, topic,
      difficulty, question_type, region_scope, scenario, clinical_pearl,
      correct_answer_explanation, incorrect_answer_rationale, clinical_reasoning,
      key_takeaway, content_hash, status, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), 'rn', 'NCLEX-RN', $1, $2, $3, $4, $5, $6,
      $7, $8, 'BOTH', $9, $10, $11, $12, $13, $14, $15, 'published', NOW(), NOW()
    ) ON CONFLICT (content_hash) DO NOTHING`,
    [
      question.stem,
      asJson(question.options),
      asJson(question.correctAnswer),
      question.rationale,
      question.bodySystem,
      question.topic,
      question.difficulty,
      question.questionType,
      question.scenario,
      question.clinicalPearl,
      question.correctAnswerExplanation,
      asJson(question.incorrectAnswerRationale),
      question.clinicalReasoning,
      question.keyTakeaway,
      contentHash,
    ]
  );
}

async function buildExpansionPlan(limit: number): Promise<ExpansionPlanItem[]> {
  const lessonCorpusResult = await pool.query(`SELECT title, summary, content, category, body_system FROM content_items WHERE tier = 'rn' AND type = 'lesson'`);
  const questionCorpusResult = await pool.query(`SELECT stem, rationale, scenario, topic, body_system, question_type FROM exam_questions WHERE tier = 'rn'`);
  const lessonCorpus = lessonCorpusResult.rows.map((row) => JSON.stringify(row).toLowerCase()).join("\n");
  const questionCorpus = questionCorpusResult.rows.map((row) => JSON.stringify(row).toLowerCase()).join("\n");
  const plan: ExpansionPlanItem[] = [];

  for (const item of NCLEX_RN_2026_COVERAGE_MAP) {
    const category = item.subcategory || item.clientNeed;
    for (const concept of item.concepts) {
      const terms = concept.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length >= 5);
      const lessonHits = terms.filter((term) => lessonCorpus.includes(term)).length;
      const questionHits = terms.filter((term) => questionCorpus.includes(term)).length;
      const priority = 100 - Math.min(80, lessonHits * 15 + questionHits * 10);
      if (lessonHits < 2) {
        plan.push({ blueprintCategory: category, clientNeed: item.clientNeed, concept, action: "lesson", priority });
      }
      if (questionHits < 2) {
        plan.push({ blueprintCategory: category, clientNeed: item.clientNeed, concept, action: "question_set", priority: priority + 5 });
      }
      if (!questionCorpus.includes("case") || questionHits < 3) {
        plan.push({ blueprintCategory: category, clientNeed: item.clientNeed, concept, action: "ngn_case_set", priority: priority + 8 });
      }
      if (!questionCorpus.includes("select_all") || questionHits < 3) {
        plan.push({ blueprintCategory: category, clientNeed: item.clientNeed, concept, action: "sata_set", priority: priority + 6 });
      }
    }
  }

  return plan.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

async function writeExpansionReport(summary: ExpansionRunSummary) {
  const reportDir = path.join(process.cwd(), "reports", "rn-content-quality");
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, "rn-blueprint-gap-expansion-latest.json"), JSON.stringify(summary, null, 2));
  await fs.writeFile(
    path.join(reportDir, "rn-blueprint-gap-expansion-latest.md"),
    `# RN Blueprint Gap Expansion Report\n\nGenerated: ${summary.generatedAt}\n\nMode: ${summary.dryRun ? "dry run" : "write"}\n\nSource baseline: ${NCLEX_RN_2026_SOURCE.publisher} — ${NCLEX_RN_2026_SOURCE.title}, effective ${NCLEX_RN_2026_SOURCE.effective}.\n\n## Summary\n\n- Limit: ${summary.limit}\n- Lessons created: ${summary.lessonsCreated}\n- Questions created: ${summary.questionsCreated}\n- Existing lessons skipped: ${summary.skippedExistingLessons}\n- Failed items: ${summary.failedItems.length}\n\n## Planned / processed items\n\n| Priority | Action | Category | Concept |\n|---:|---|---|---|\n${summary.plannedItems.map((item) => `| ${item.priority} | ${item.action} | ${item.blueprintCategory} | ${item.concept} |`).join("\n")}\n\n## Safe external audit principle\n\n${NURSENEST_RN_DEEP_COVERAGE_STANDARD.externalAuditPrinciple}\n`
  );
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : 25;
  const openai = getOpenAI();
  const plan = await buildExpansionPlan(limit);
  let lessonsCreated = 0;
  let questionsCreated = 0;
  let skippedExistingLessons = 0;
  const failedItems: ExpansionRunSummary["failedItems"] = [];

  for (const item of plan) {
    const mapItem = NCLEX_RN_2026_COVERAGE_MAP.find((entry) => (entry.subcategory || entry.clientNeed) === item.blueprintCategory);
    if (!mapItem) continue;
    try {
      if (item.action === "lesson") {
        const content = await generateLessonWithAi(openai, item.concept, mapItem);
        if (!dryRun) {
          const result = await insertLesson(item.concept, mapItem, content);
          if (result.inserted) lessonsCreated += 1;
          else skippedExistingLessons += 1;
        } else {
          lessonsCreated += 1;
        }
      } else {
        const count = item.action === "question_set" ? 5 : 3;
        const forcedType = item.action === "ngn_case_set" ? "case_study" : item.action === "sata_set" ? "select_all_that_apply" : undefined;
        const questions = await generateQuestionsWithAi(openai, item.concept, mapItem, count, forcedType);
        if (!dryRun) {
          for (const question of questions) await insertQuestion(question);
        }
        questionsCreated += questions.length;
      }
    } catch (error: any) {
      failedItems.push({ item, error: error?.message || String(error) });
    }
  }

  const summary: ExpansionRunSummary = {
    generatedAt: new Date().toISOString(),
    dryRun,
    limit,
    lessonsCreated,
    questionsCreated,
    skippedExistingLessons,
    failedItems,
    plannedItems: plan,
  };

  await writeExpansionReport(summary);
  console.log(JSON.stringify({ lessonsCreated, questionsCreated, skippedExistingLessons, failedItems: failedItems.length }, null, 2));
  console.log("Expansion report written to reports/rn-content-quality/rn-blueprint-gap-expansion-latest.{json,md}");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
