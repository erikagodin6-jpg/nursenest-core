import type { Express } from "express";
import crypto from "crypto";
import { requireAdmin } from "./admin-auth";
import { getProdPool, hasSeparateProdDb, getDbInfo } from "./db";
import pg from "pg";
import { runPreflightChecks, getPreflightCheckedPool, type PreflightResult } from "./environment-write-service";

const IMAGE_KEYWORD_MAP: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "cardiac tamponade": [{ file: "cardiactamponade", alt: "Cardiac tamponade illustration", caption: "Cardiac Tamponade", description: "Beck's triad: hypotension, muffled heart sounds, JVD" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes management infographic", caption: "Diabetes Overview", description: "Key concepts in diabetes management and monitoring" }],
  "abg": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "arterial blood gas": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "acid-base": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "heart failure": [{ file: "heartfailure", alt: "Heart failure illustration", caption: "Heart Failure", description: "Left vs right heart failure: signs, symptoms, and management" }],
  "myocardial infarction": [{ file: "MI", alt: "MI illustration", caption: "Myocardial Infarction", description: "STEMI/NSTEMI: troponin, 12-lead ECG, PCI, and thrombolytics" }],
  "stroke": [{ file: "stroke", alt: "Stroke illustration", caption: "Stroke", description: "Ischemic vs hemorrhagic stroke: FAST assessment and tPA criteria" }],
  "seizure": [{ file: "seizure", alt: "Seizure illustration", caption: "Seizure Management", description: "Seizure types, safety precautions, and anticonvulsant therapy" }],
  "pneumonia": [{ file: "pneumonia", alt: "Pneumonia illustration", caption: "Pneumonia", description: "Community vs hospital-acquired pneumonia: assessment and antibiotics" }],
  "copd": [{ file: "COPD", alt: "COPD illustration", caption: "COPD", description: "Chronic obstructive pulmonary disease: emphysema and chronic bronchitis" }],
  "asthma": [{ file: "asthma", alt: "Asthma illustration", caption: "Asthma", description: "Bronchospasm, inhaler technique, and status asthmaticus" }],
  "preeclampsia": [{ file: "preeclampsia", alt: "Preeclampsia illustration", caption: "Preeclampsia", description: "Hypertension in pregnancy: proteinuria, HELLP, and magnesium sulfate" }],
  "placenta previa": [{ file: "placentaprevia", alt: "Placenta previa illustration", caption: "Placenta Previa", description: "Painless bright red bleeding, no vaginal exam" }],
  "postpartum hemorrhage": [{ file: "postpartumhemorrhage", alt: "Postpartum hemorrhage illustration", caption: "Postpartum Hemorrhage", description: "PPH: uterine atony, 4 T's, fundal massage" }],
  "pyloric stenosis": [{ file: "pyloricstenosis_1773375303320.png", alt: "Pyloric stenosis illustration", caption: "Pyloric Stenosis", description: "Non-bilious projectile vomiting, olive-shaped mass" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome illustration", caption: "Compartment Syndrome", description: "5 P's, fasciotomy, neurovascular assessment" }],
  "cushing": [{ file: "cushing.png", alt: "Cushing syndrome illustration", caption: "Cushing Syndrome", description: "Cortisol excess: moon face, buffalo hump, central obesity" }],
  "addison": [{ file: "addisons.png", alt: "Addison's disease illustration", caption: "Addison's Disease", description: "Adrenal insufficiency: hyperpigmentation, hyponatremia, hyperkalemia" }],
  "multiple sclerosis": [{ file: "MS", alt: "Multiple sclerosis illustration", caption: "Multiple Sclerosis", description: "Autoimmune demyelinating disease" }],
  "myasthenia gravis": [{ file: "myastheniagravis", alt: "Myasthenia gravis illustration", caption: "Myasthenia Gravis", description: "Autoimmune NMJ disorder: ptosis, diplopia" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration", caption: "Pancreatitis", description: "Cullen's sign, Grey Turner's sign, and supportive care" }],
  "sickle cell": [{ file: "sicklecell", alt: "Sickle cell illustration", caption: "Sickle Cell Disease", description: "Sickle cell crisis prevention and management" }],
  "electrolyte": [{ file: "electrolytes", alt: "Electrolyte imbalances chart", caption: "Electrolyte Imbalances", description: "Key electrolyte values and clinical manifestations" }],
  "hyperkalemia": [{ file: "electrolytes", alt: "Electrolyte imbalances chart", caption: "Hyperkalemia", description: "Elevated potassium: cardiac effects and treatment" }],
  "hypokalemia": [{ file: "electrolytes", alt: "Electrolyte imbalances chart", caption: "Hypokalemia", description: "Low potassium: muscle weakness, arrhythmias" }],
  "hyponatremia": [{ file: "electrolytes", alt: "Electrolyte imbalances chart", caption: "Hyponatremia", description: "Low sodium: confusion, seizures, fluid restriction" }],
  "cranial nerve": [{ file: "cranialnerves.png", alt: "Cranial nerves illustration", caption: "Cranial Nerves", description: "Twelve cranial nerves: pathways and assessment" }],
  "opioid overdose": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Opioid Overdose", description: "Respiratory depression, pinpoint pupils, naloxone" }],
  "naloxone": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Naloxone", description: "Opioid antagonist for overdose reversal" }],
  "osteoporosis": [{ file: "osteoporosis", alt: "Osteoporosis illustration", caption: "Osteoporosis", description: "Bone density loss: DEXA screening, bisphosphonates" }],
  "wound": [{ file: "wound", alt: "Wound care illustration", caption: "Wound Care", description: "Wound assessment, staging, and management" }],
  "pressure ulcer": [{ file: "pressureulcer", alt: "Pressure ulcer illustration", caption: "Pressure Ulcer", description: "Staging, prevention, and wound care" }],
  "burn": [{ file: "burns", alt: "Burns illustration", caption: "Burns", description: "Rule of nines, Parkland formula, and burn classification" }],
  "thyroid": [{ file: "hypothyroidism_1773374939606", alt: "Thyroid illustration", caption: "Thyroid Disorders", description: "Hypo/hyperthyroidism assessment and management" }],
  "dialysis": [{ file: "CKD.png", alt: "CKD/Dialysis illustration", caption: "Dialysis", description: "Hemodialysis and peritoneal dialysis nursing care" }],
  "chest tube": [{ file: "chesttube", alt: "Chest tube illustration", caption: "Chest Tube", description: "Chest tube management and assessment" }],
  "tracheostomy": [{ file: "tracheostomy", alt: "Tracheostomy illustration", caption: "Tracheostomy", description: "Tracheostomy care and emergency management" }],
  "blood transfusion": [{ file: "bloodtransfusion", alt: "Blood transfusion illustration", caption: "Blood Transfusion", description: "Transfusion reactions and nursing interventions" }],
};

const LESSON_KEYWORD_MAP: Record<string, { title: string; slug: string }> = {
  "heart failure": { title: "Heart Failure Management", slug: "heart-failure" },
  "diabetes": { title: "Diabetes Management", slug: "diabetes-management" },
  "hypertension": { title: "Hypertension", slug: "hypertension" },
  "shock": { title: "Types of Shock", slug: "shock-management" },
  "electrolyte": { title: "Electrolyte Imbalances", slug: "electrolyte-imbalances" },
  "preeclampsia": { title: "Preeclampsia", slug: "preeclampsia" },
  "seizure": { title: "Seizure Disorders", slug: "seizure-disorders" },
  "stroke": { title: "Stroke", slug: "stroke" },
  "infection control": { title: "Infection Control", slug: "infection-control" },
  "wound": { title: "Wound Care", slug: "wound-care" },
  "pneumonia": { title: "Pneumonia", slug: "pneumonia" },
  "copd": { title: "COPD", slug: "copd" },
  "asthma": { title: "Asthma", slug: "asthma" },
  "chest tube": { title: "Chest Tube Management", slug: "chest-tube" },
  "pancreatitis": { title: "Pancreatitis", slug: "pancreatitis" },
  "sickle cell": { title: "Sickle Cell Disease", slug: "sickle-cell-crisis" },
  "dialysis": { title: "Dialysis", slug: "dialysis" },
  "thyroid": { title: "Thyroid Disorders", slug: "thyroid-disorders" },
  "burn": { title: "Burns", slug: "burns" },
  "medication administration": { title: "Medication Administration", slug: "medication-administration" },
  "blood transfusion": { title: "Blood Transfusion", slug: "blood-transfusion" },
  "tracheostomy": { title: "Tracheostomy Care", slug: "tracheostomy" },
  "ventilator": { title: "Mechanical Ventilation", slug: "ventilator" },
  "delegation": { title: "Delegation", slug: "delegation" },
  "prioritization": { title: "Prioritization", slug: "prioritization" },
  "postpartum": { title: "Postpartum Care", slug: "postpartum" },
  "labor": { title: "Labor & Delivery", slug: "stages-of-labor" },
  "newborn": { title: "Newborn Assessment", slug: "newborn-assessment" },
  "pediatric": { title: "Pediatric Nursing", slug: "pediatric-nursing" },
  "mental health": { title: "Mental Health", slug: "mental-health" },
  "depression": { title: "Depression", slug: "depression" },
  "anxiety": { title: "Anxiety Disorders", slug: "anxiety" },
  "schizophrenia": { title: "Schizophrenia", slug: "schizophrenia" },
  "lithium": { title: "Lithium Therapy", slug: "lithium" },
  "acid-base": { title: "Acid-Base Balance", slug: "acid-base" },
};

interface TierDistribution {
  tier: string;
  exam: string;
  count: number;
  categories: { name: string; count: number }[];
}

const TIER_DISTRIBUTIONS: TierDistribution[] = [
  {
    tier: "rpn",
    exam: "NCLEX-PN / REx-PN",
    count: 500,
    categories: [
      { name: "Fundamentals", count: 120 },
      { name: "Medical-Surgical", count: 150 },
      { name: "Pharmacology", count: 80 },
      { name: "Maternal/Newborn", count: 40 },
      { name: "Pediatrics", count: 40 },
      { name: "Mental Health", count: 40 },
      { name: "Professional Practice/Safety", count: 30 },
    ],
  },
  {
    tier: "rn",
    exam: "NCLEX-RN",
    count: 500,
    categories: [
      { name: "Management of Care", count: 80 },
      { name: "Safety and Infection Control", count: 60 },
      { name: "Health Promotion and Maintenance", count: 60 },
      { name: "Psychosocial Integrity", count: 60 },
      { name: "Basic Care and Comfort", count: 60 },
      { name: "Pharmacology and Parenteral Therapies", count: 70 },
      { name: "Reduction of Risk Potential", count: 50 },
      { name: "Physiological Adaptation", count: 60 },
    ],
  },
  {
    tier: "np",
    exam: "NP-Advanced",
    count: 500,
    categories: [
      { name: "Advanced Pathophysiology", count: 120 },
      { name: "Advanced Pharmacology", count: 100 },
      { name: "Advanced Health Assessment", count: 80 },
      { name: "Primary Care Adult", count: 60 },
      { name: "Primary Care Pediatric", count: 40 },
      { name: "Primary Care Women's Health", count: 40 },
      { name: "Mental Health / Psych NP", count: 30 },
      { name: "Diagnostics / Clinical Decision Making", count: 30 },
    ],
  },
];

interface JobProgress {
  jobId: string;
  status: "idle" | "verifying" | "running" | "completing" | "complete" | "failed";
  startedAt: string | null;
  completedAt: string | null;
  dbTarget: string | null;
  dbVerified: boolean;
  currentTier: string | null;
  currentCategory: string | null;
  currentBatch: number;
  totalBatches: number;
  questionsInserted: { rpn: number; rn: number; np: number };
  flashcardsCreated: { rpn: number; rn: number; np: number };
  imageLinked: number;
  lessonLinked: number;
  duplicatesSkipped: number;
  validationFailed: number;
  errors: string[];
  batchLog: { batch: number; tier: string; category: string; generated: number; inserted: number; flashcards: number; images: number; lessons: number; skipped: number; failed: number; timestamp: string }[];
  finalReport: any | null;
}

let currentJob: JobProgress | null = null;
let jobRunning = false;

function createJobProgress(): JobProgress {
  return {
    jobId: crypto.randomUUID(),
    status: "idle",
    startedAt: null,
    completedAt: null,
    dbTarget: null,
    dbVerified: false,
    currentTier: null,
    currentCategory: null,
    currentBatch: 0,
    totalBatches: 0,
    questionsInserted: { rpn: 0, rn: 0, np: 0 },
    flashcardsCreated: { rpn: 0, rn: 0, np: 0 },
    imageLinked: 0,
    lessonLinked: 0,
    duplicatesSkipped: 0,
    validationFailed: 0,
    errors: [],
    batchLog: [],
    finalReport: null,
  };
}

async function getOpenAI() {
  const { routeAIRequest } = await import("./ai-provider-router");
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          const systemMsg = params.messages?.find((m: any) => m.role === "system");
          const userMsg = params.messages?.find((m: any) => m.role === "user");
          const result = await routeAIRequest(
            systemMsg?.content || "",
            userMsg?.content || "",
            {
              model: (params.model || "gpt-4o-mini").replace("openai/", ""),
              maxTokens: params.max_tokens || params.max_completion_tokens || 16000,
              temperature: params.temperature ?? 0.7,
              responseFormat: params.response_format,
              taskType: "content",
              feature: "content-expansion-job",
            }
          );
          return {
            choices: [{ message: { content: result.content } }],
            usage: { total_tokens: result.tokensUsed, prompt_tokens: result.inputTokens, completion_tokens: result.outputTokens },
          };
        },
      },
    },
  };
}

function generateStemHash(stem: string): string {
  const normalized = stem.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 32);
}

function generateContentHash(stem: string, tier: string): string {
  return crypto.createHash("sha256").update(`cat-exam:${tier}:${stem}`).digest("hex").slice(0, 32);
}

function matchImagesForQuestion(stem: string, rationale: string, bodySystem: string, topic: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string; sortOrder: number }[] {
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string; sortOrder: number }[] = [];
  const searchText = `${stem} ${rationale} ${bodySystem} ${topic}`.toLowerCase();

  for (const [keyword, images] of Object.entries(IMAGE_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
            sortOrder: matches.length,
          });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

function matchLessonForQuestion(stem: string, rationale: string, bodySystem: string, topic: string): { title: string; slug: string } | null {
  const searchText = `${stem} ${rationale} ${bodySystem} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(LESSON_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      return lesson;
    }
  }
  return null;
}

function buildSystemPrompt(tier: string, category: string): string {
  const tierPrompts: Record<string, string> = {
    rpn: `You are a senior practical nursing licensure exam item writer for the NCLEX-PN (US) and REx-PN (Canada).
Your questions must reflect practical nursing scope of practice. For Canadian content, use SI units (mmol/L, umol/L, Celsius, kg).
PN scope: monitor, report, administer as ordered, basic assessments. Practical nurses do NOT independently prescribe, diagnose, or initiate treatment plans.
Questions should test clinical judgment at the application/analysis level.`,
    rn: `You are a senior NCLEX-RN item writer.
Your questions must reflect RN scope of practice with protocol-based interventions, complex assessments, and delegation decisions.
Questions should test clinical judgment at the application/analysis level with emphasis on prioritization, delegation, and complex patient scenarios.`,
    np: `You are a senior Nurse Practitioner certification exam item writer.
Your questions must reflect NP scope of advanced practice including ordering, prescribing, diagnosing, and autonomous clinical decision-making.
Questions should test advanced clinical reasoning at the synthesis/evaluation level with emphasis on differential diagnosis, prescribing decisions, and evidence-based management.`,
  };

  return `${tierPrompts[tier] || tierPrompts.rpn}

You are generating questions for the category: "${category}".

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no commentary.
2. Each question must have a unique, detailed clinical scenario.
3. Every question must have exactly 4 options (A, B, C, D) with exactly 1 correct answer.
4. Include a thorough rationale explaining why the correct answer is right and why each distractor is wrong.
5. Include a concise clinical pearl for exam prep.
6. Vary difficulty: approximately 30% moderate, 50% hard, 20% very challenging.
7. Use a balanced mix of question types: prioritization, next-best-action, safety, delegation, infection control, lab interpretation, ABG interpretation, ECG recognition, pharmacology adverse effects, pharmacology teaching, contraindications, maternal/newborn scenarios, pediatric scenarios, mental health scenarios, chronic disease management, urgent/emergent complications, diagnostic reasoning.
8. Do NOT use emoji anywhere. Plain text only.
9. Every stem must be a realistic clinical vignette with specific patient data.
10. Vary age, setting, gender, acuity, and scenario details across questions.
11. Avoid overusing the same disease topics. Ensure distractors are plausible but clearly wrong.

Return a JSON object with key "questions" containing an array of question objects.
Each object:
{
  "stem": "Detailed clinical scenario question (minimum 60 characters)",
  "optionA": "First option text",
  "optionB": "Second option text",
  "optionC": "Third option text",
  "optionD": "Fourth option text",
  "correctAnswer": 0-3 (index of correct option),
  "rationale": "Why the correct answer is right. Include pathophysiology and clinical reasoning. Minimum 100 words.",
  "distractorRationales": { "A": "Why A is wrong", "B": "Why B is wrong", "C": "Why C is wrong", "D": "Why D is wrong" },
  "clinicalPearl": "A concise high-yield clinical pearl for exam prep",
  "examStrategy": "A brief exam-taking strategy tip for this type of question",
  "difficulty": 1-5,
  "bodySystem": "Primary body system (e.g., Cardiac, Respiratory, Neuro, Renal, Endocrine, GI, Hematology, Immune, Integumentary, MSK, Reproductive, Multi-system)",
  "topic": "Specific topic within the category",
  "subtopic": "More specific subtopic",
  "tags": ["tag1", "tag2", "tag3"],
  "cognitiveLevel": "Application or Analysis or Synthesis or Evaluation"
}`;
}

function buildUserPrompt(count: number, category: string, existingStems: string[]): string {
  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  return `Generate exactly ${count} unique, high-quality nursing exam questions for the category "${category}".

Each question must have a distinct clinical scenario. Do NOT repeat topics or scenarios.
${antiDupe}

Return JSON: {"questions": [...${count} items...]}`;
}

function validateQuestion(q: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!q.stem || typeof q.stem !== "string" || q.stem.length < 40) {
    errors.push("Stem missing or too short");
  }

  if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) {
    errors.push("Missing one or more options (A-D)");
  }

  if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer < 0 || q.correctAnswer > 3) {
    errors.push("Invalid correctAnswer (must be 0-3)");
  }

  if (!q.rationale || typeof q.rationale !== "string" || q.rationale.length < 50) {
    errors.push("Rationale missing or too short");
  }

  if (!q.clinicalPearl || typeof q.clinicalPearl !== "string") {
    errors.push("Clinical pearl missing");
  }

  if (!q.difficulty || q.difficulty < 1 || q.difficulty > 5) {
    q.difficulty = 3;
  }

  return { valid: errors.length === 0, errors };
}

async function generateBatch(
  tier: string,
  exam: string,
  category: string,
  count: number,
  existingStems: string[],
): Promise<any[]> {
  const openai = await getOpenAI();
  const systemPrompt = buildSystemPrompt(tier, category);
  const userPrompt = buildUserPrompt(count, category, existingStems);

  const maxTokens = Math.min(count * 800 + 500, 16384);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "{}";
  let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(cleaned);
  if (Array.isArray(parsed.questions)) return parsed.questions;
  if (Array.isArray(parsed.items)) return parsed.items;
  if (Array.isArray(parsed)) return parsed;

  for (const key of Object.keys(parsed)) {
    if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
      return parsed[key];
    }
  }

  return [];
}

async function verifyProductionDb(): Promise<{ verified: boolean; target: string; info: any }> {
  const info = getDbInfo();
  const hasSeparate = hasSeparateProdDb();
  const targetLabel = hasSeparate ? "production (PROD_DATABASE_URL)" : "shared (DATABASE_URL — no separate prod configured)";
  console.log(`[ContentExpansion] DB Info: dev=${info.devUrl}, prod=${info.prodUrl}, hasSeparateProd=${hasSeparate}`);

  const envTarget = hasSeparate ? "production" : "development";
  const targetPool = await getPreflightCheckedPool(envTarget as any, "ContentExpansion");

  try {
    const result = await targetPool.query("SELECT current_database() AS db, current_user AS usr, NOW() AS ts");
    const row = result.rows[0];
    console.log(`[ContentExpansion] DB verified: database=${row.db}, user=${row.usr}, target=${targetLabel}`);

    const tableCheck = await targetPool.query(`
      SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'exam_questions') AS has_exam,
             EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'flashcard_bank') AS has_flashcard
    `);
    const tables = tableCheck.rows[0];
    if (!tables.has_exam || !tables.has_flashcard) {
      return { verified: false, target: targetLabel, info: { error: "Required tables not found in database" } };
    }

    return {
      verified: true,
      target: targetLabel,
      info: {
        database: row.db,
        user: row.usr,
        timestamp: row.ts,
        hasSeparateProd: hasSeparate,
        prodUrl: info.prodUrl,
      },
    };
  } catch (err: any) {
    console.error(`[ContentExpansion] DB verification failed:`, err.message);
    return { verified: false, target: targetLabel, info: { error: err.message } };
  }
}

async function getExistingStemHashes(targetPool: pg.Pool): Promise<Set<string>> {
  const result = await targetPool.query(
    `SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`
  );
  return new Set(result.rows.map((r: any) => r.stem_hash).filter(Boolean));
}

async function insertQuestionWithFlashcard(
  targetPool: pg.Pool,
  tier: string,
  exam: string,
  q: any,
  stemHash: string,
  images: any[],
  lesson: { title: string; slug: string } | null,
): Promise<{ questionId: string; flashcardCreated: boolean }> {
  const client = await targetPool.connect();
  try {
    await client.query("BEGIN");

    const options = JSON.stringify([
      { text: q.optionA, label: "A" },
      { text: q.optionB, label: "B" },
      { text: q.optionC, label: "C" },
      { text: q.optionD, label: "D" },
    ]);
    const correctAnswer = JSON.stringify([q.correctAnswer]);

    const qResult = await client.query(
      `INSERT INTO exam_questions (
        tier, exam, question_type, status, stem, options, correct_answer,
        rationale, difficulty, tags, body_system, topic, subtopic,
        region_scope, career_type, stem_hash, clinical_pearl, exam_strategy,
        distractor_rationales, published_at
      ) VALUES ($1, $2, 'MCQ', 'published', $3, $4, $5, $6, $7, $8, $9, $10, $11, 'BOTH', 'nursing', $12, $13, $14, $15, NOW())
      RETURNING id`,
      [
        tier, exam, q.stem, options, correctAnswer,
        q.rationale, q.difficulty || 3,
        q.tags || [], q.bodySystem || "Multi-system",
        q.topic || null, q.subtopic || null,
        stemHash, q.clinicalPearl || null, q.examStrategy || null,
        q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
      ]
    );

    const questionId = qResult.rows[0].id;

    const front = q.stem;
    const correctOpt = [q.optionA, q.optionB, q.optionC, q.optionD][q.correctAnswer] || "";
    const backParts = [`Correct Answer: ${correctOpt}`];
    if (q.rationale) backParts.push(`\nRationale: ${q.rationale}`);
    if (q.clinicalPearl) backParts.push(`\nClinical Pearl: ${q.clinicalPearl}`);
    const back = backParts.join("\n");

    const contentHash = generateContentHash(q.stem, tier);
    const lessonLinks = lesson ? [{ lessonTitle: lesson.title, lessonUrl: `/lessons/${lesson.slug}`, relevanceNote: `Related ${lesson.title} content` }] : [];

    const fcResult = await client.query(
      `INSERT INTO flashcard_bank (
        tier, front, back, content_hash, status, source_type, source_question_id,
        question_type, options, correct_answer, rationale_correct, distractor_rationales,
        clinical_takeaway, exam_pearl, rationale_media, lesson_links,
        difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
        category, career_type
      ) VALUES ($1,$2,$3,$4,'published','content_expansion',$5,'MCQ',$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'BOTH',true,$18,'nursing')
      ON CONFLICT (content_hash) DO NOTHING
      RETURNING id`,
      [
        tier, front, back, contentHash, questionId,
        options, correctAnswer,
        q.rationale || "", q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
        q.clinicalPearl || null, q.examStrategy || q.clinicalPearl || null,
        JSON.stringify(images), JSON.stringify(lessonLinks),
        q.difficulty || 3, q.bodySystem || "Multi-system",
        q.topic || null, q.subtopic || null,
        q.bodySystem || "General",
      ]
    );

    await client.query("COMMIT");

    return { questionId, flashcardCreated: fcResult.rowCount !== null && fcResult.rowCount > 0 };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function refreshIndexes(targetPool: pg.Pool): Promise<void> {
  console.log("[ContentExpansion] Refreshing published indexes...");

  try {
    await targetPool.query(`
      UPDATE exam_questions SET updated_at = NOW()
      WHERE status = 'published' AND career_type = 'nursing'
      AND created_at > NOW() - INTERVAL '1 hour'
    `);

    await targetPool.query(`
      UPDATE flashcard_bank SET updated_at = NOW()
      WHERE status = 'published' AND source_type = 'content_expansion'
      AND created_at > NOW() - INTERVAL '1 hour'
    `);

    console.log("[ContentExpansion] Index refresh complete");
  } catch (err: any) {
    console.error("[ContentExpansion] Index refresh error:", err.message);
  }
}

export async function runExpansionJob(): Promise<void> {
  if (jobRunning) {
    throw new Error("A content expansion job is already running");
  }

  jobRunning = true;
  currentJob = createJobProgress();
  currentJob.status = "verifying";
  currentJob.startedAt = new Date().toISOString();

  try {
    const dbCheck = await verifyProductionDb();
    currentJob.dbTarget = dbCheck.target;
    currentJob.dbVerified = dbCheck.verified;

    if (!dbCheck.verified) {
      currentJob.status = "failed";
      currentJob.errors.push(`Production DB verification failed: ${JSON.stringify(dbCheck.info)}`);
      jobRunning = false;
      return;
    }

    console.log(`[ContentExpansion] PRODUCTION DB VERIFIED: ${JSON.stringify(dbCheck.info)}`);
    console.log(`[ContentExpansion] Starting content expansion job ${currentJob.jobId}`);

    const envTarget2 = hasSeparateProdDb() ? "production" : "development";
    const targetPool = await getPreflightCheckedPool(envTarget2 as any, "ContentExpansion-Job");
    const existingHashes = await getExistingStemHashes(targetPool);
    console.log(`[ContentExpansion] Found ${existingHashes.size} existing stem hashes for duplicate detection`);

    currentJob.status = "running";
    let globalBatch = 0;

    const BASELINE_COUNTS: Record<string, number> = { rpn: 3186, rn: 3351, np: 2135 };
    const tierCurrentCounts: Record<string, number> = {};
    try {
      const countResult = await targetPool.query(
        `SELECT tier, COUNT(*)::int as c FROM exam_questions WHERE status = 'published' AND career_type = 'nursing' GROUP BY tier`
      );
      for (const row of countResult.rows) {
        tierCurrentCounts[row.tier] = row.c;
      }
    } catch (err: any) {
      console.error(`[ContentExpansion] Failed to get tier counts: ${err.message}`);
    }

    let totalBatches = 0;
    for (const tierDist of TIER_DISTRIBUTIONS) {
      const baseline = BASELINE_COUNTS[tierDist.tier] || 0;
      const current = tierCurrentCounts[tierDist.tier] || 0;
      const alreadyAdded = current - baseline;
      if (alreadyAdded >= tierDist.count) {
        console.log(`[ContentExpansion] Skipping tier ${tierDist.tier}: already has ${alreadyAdded}/${tierDist.count} new questions`);
        continue;
      }
      for (const cat of tierDist.categories) {
        totalBatches += Math.ceil(cat.count / 50);
      }
    }
    currentJob.totalBatches = totalBatches;

    const recentStems: string[] = [];
    const MAX_BACKFILL_ROUNDS = 3;

    for (const tierDist of TIER_DISTRIBUTIONS) {
      const baseline = BASELINE_COUNTS[tierDist.tier] || 0;
      const current = tierCurrentCounts[tierDist.tier] || 0;
      const alreadyAdded = current - baseline;
      if (alreadyAdded >= tierDist.count) {
        continue;
      }
      currentJob.currentTier = tierDist.tier;
      console.log(`[ContentExpansion] Starting tier: ${tierDist.tier} (${tierDist.count} questions, ${alreadyAdded} already added)`);

      for (const cat of tierDist.categories) {
        currentJob.currentCategory = cat.name;
        let catInserted = 0;
        let backfillRound = 0;

        while (catInserted < cat.count && backfillRound <= MAX_BACKFILL_ROUNDS) {
          const needed = cat.count - catInserted;
          const batchSize = Math.min(50, needed);
          globalBatch++;
          currentJob.currentBatch = globalBatch;

          if (backfillRound > 0) {
            console.log(`[ContentExpansion] Backfill round ${backfillRound} for ${tierDist.tier}/${cat.name}: need ${needed} more`);
          }

          console.log(`[ContentExpansion] Batch ${globalBatch}: ${tierDist.tier}/${cat.name} - generating ${batchSize} questions (inserted ${catInserted}/${cat.count})`);

          let generated: any[] = [];
          let retries = 0;
          const maxRetries = 2;

          while (retries <= maxRetries) {
            try {
              generated = await generateBatch(tierDist.tier, tierDist.exam, cat.name, batchSize, recentStems);
              break;
            } catch (err: any) {
              retries++;
              console.error(`[ContentExpansion] Batch ${globalBatch} generation attempt ${retries} failed: ${err.message}`);
              if (retries > maxRetries) {
                currentJob.errors.push(`Batch ${globalBatch} (${tierDist.tier}/${cat.name}): generation failed after ${maxRetries + 1} attempts: ${err.message}`);
                generated = [];
              } else {
                await new Promise(r => setTimeout(r, 2000));
              }
            }
          }

          let batchInserted = 0;
          let batchFlashcards = 0;
          let batchImages = 0;
          let batchLessons = 0;
          let batchSkipped = 0;
          let batchFailed = 0;

          for (const q of generated) {
            if (catInserted >= cat.count) break;

            const validation = validateQuestion(q);
            if (!validation.valid) {
              batchFailed++;
              currentJob.validationFailed++;
              continue;
            }

            const stemHash = generateStemHash(q.stem);
            if (existingHashes.has(stemHash)) {
              batchSkipped++;
              currentJob.duplicatesSkipped++;
              continue;
            }

            const images = matchImagesForQuestion(q.stem, q.rationale || "", q.bodySystem || "", q.topic || "");
            const lesson = matchLessonForQuestion(q.stem, q.rationale || "", q.bodySystem || "", q.topic || "");

            try {
              const result = await insertQuestionWithFlashcard(targetPool, tierDist.tier, tierDist.exam, q, stemHash, images, lesson);
              existingHashes.add(stemHash);
              recentStems.push(q.stem);
              if (recentStems.length > 50) recentStems.shift();

              batchInserted++;
              catInserted++;
              const tierKey = tierDist.tier as keyof typeof currentJob.questionsInserted;
              currentJob!.questionsInserted[tierKey]++;

              if (images.length > 0) {
                batchImages++;
                currentJob!.imageLinked++;
              }

              if (lesson) {
                batchLessons++;
                currentJob!.lessonLinked++;
              }

              if (result.flashcardCreated) {
                batchFlashcards++;
                currentJob!.flashcardsCreated[tierKey]++;
              }
            } catch (insertErr: any) {
              batchFailed++;
              currentJob!.validationFailed++;
              console.error(`[ContentExpansion] Insert error: ${insertErr.message}`);
            }
          }

          currentJob.batchLog.push({
            batch: globalBatch,
            tier: tierDist.tier,
            category: cat.name,
            generated: generated.length,
            inserted: batchInserted,
            flashcards: batchFlashcards,
            images: batchImages,
            lessons: batchLessons,
            skipped: batchSkipped,
            failed: batchFailed,
            timestamp: new Date().toISOString(),
          });

          console.log(`[ContentExpansion] Batch ${globalBatch} complete: generated=${generated.length}, inserted=${batchInserted}, flashcards=${batchFlashcards}, images=${batchImages}, lessons=${batchLessons}, skipped=${batchSkipped}, failed=${batchFailed} | category progress: ${catInserted}/${cat.count}`);

          if (batchInserted === 0 && generated.length > 0) {
            backfillRound++;
          }

          await new Promise(r => setTimeout(r, 500));
        }

        if (catInserted < cat.count) {
          currentJob.errors.push(`${tierDist.tier}/${cat.name}: only inserted ${catInserted}/${cat.count} after ${MAX_BACKFILL_ROUNDS} backfill rounds`);
        }
      }
    }

    currentJob.status = "completing";
    await refreshIndexes(targetPool);

    const finalExamCounts = await targetPool.query(
      `SELECT tier, COUNT(*)::int AS count FROM exam_questions WHERE status = 'published' AND career_type = 'nursing' GROUP BY tier ORDER BY tier`
    );
    const finalFlashcardCounts = await targetPool.query(
      `SELECT tier, COUNT(*)::int AS count FROM flashcard_bank WHERE status = 'published' AND flashcard_enabled = true GROUP BY tier ORDER BY tier`
    );

    currentJob.finalReport = {
      questionsInserted: currentJob.questionsInserted,
      flashcardsCreated: currentJob.flashcardsCreated,
      imageLinked: currentJob.imageLinked,
      lessonLinked: currentJob.lessonLinked,
      duplicatesSkipped: currentJob.duplicatesSkipped,
      validationFailed: currentJob.validationFailed,
      totalQuestionsInserted: currentJob.questionsInserted.rpn + currentJob.questionsInserted.rn + currentJob.questionsInserted.np,
      totalFlashcardsCreated: currentJob.flashcardsCreated.rpn + currentJob.flashcardsCreated.rn + currentJob.flashcardsCreated.np,
      dbTarget: currentJob.dbTarget,
      livePublishedTotals: {
        examQuestions: finalExamCounts.rows,
        flashcardBank: finalFlashcardCounts.rows,
      },
      completedAt: new Date().toISOString(),
    };

    currentJob.status = "complete";
    currentJob.completedAt = new Date().toISOString();

    console.log(`[ContentExpansion] Job ${currentJob.jobId} COMPLETE`);
    console.log(`[ContentExpansion] Questions: RPN=${currentJob.questionsInserted.rpn}, RN=${currentJob.questionsInserted.rn}, NP=${currentJob.questionsInserted.np}`);
    console.log(`[ContentExpansion] Flashcards: RPN=${currentJob.flashcardsCreated.rpn}, RN=${currentJob.flashcardsCreated.rn}, NP=${currentJob.flashcardsCreated.np}`);
    console.log(`[ContentExpansion] Images linked: ${currentJob.imageLinked}, Lessons linked: ${currentJob.lessonLinked}`);
    console.log(`[ContentExpansion] Skipped (duplicates): ${currentJob.duplicatesSkipped}, Failed (validation): ${currentJob.validationFailed}`);
  } catch (err: any) {
    console.error(`[ContentExpansion] Job failed:`, err.message);
    if (currentJob) {
      currentJob.status = "failed";
      currentJob.errors.push(err.message);
      currentJob.completedAt = new Date().toISOString();
    }
  } finally {
    jobRunning = false;
  }
}

export function setupContentExpansionRoutes(app: Express): void {
  app.get("/api/admin/content-expansion/distribution", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json({ tiers: TIER_DISTRIBUTIONS, totalQuestions: 1500 });
  });

  app.get("/api/admin/content-expansion/verify-db", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await verifyProductionDb();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-expansion/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { createBgJob } = await import("./job-queue");
      const jobId = await createBgJob({
        type: "content_expansion",
        payload: {},
        totalItems: 1,
        batchSize: 1,
        createdBy: admin.username || "admin",
      });
      console.log(`[ContentExpansion] Job queued by admin: ${admin.username} (bgJobId: ${jobId})`);
      res.json({ started: true, jobId, status: "queued", message: "Content expansion queued for worker processing." });
    } catch (err: any) {
      console.error("[ContentExpansion] Queue error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-expansion/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (!currentJob) {
      return res.json({ status: "idle", hasJob: false });
    }

    res.json({
      hasJob: true,
      jobId: currentJob.jobId,
      status: currentJob.status,
      startedAt: currentJob.startedAt,
      completedAt: currentJob.completedAt,
      dbTarget: currentJob.dbTarget,
      dbVerified: currentJob.dbVerified,
      currentTier: currentJob.currentTier,
      currentCategory: currentJob.currentCategory,
      currentBatch: currentJob.currentBatch,
      totalBatches: currentJob.totalBatches,
      questionsInserted: currentJob.questionsInserted,
      flashcardsCreated: currentJob.flashcardsCreated,
      imageLinked: currentJob.imageLinked,
      lessonLinked: currentJob.lessonLinked,
      duplicatesSkipped: currentJob.duplicatesSkipped,
      validationFailed: currentJob.validationFailed,
      errors: currentJob.errors.slice(-10),
      recentBatches: currentJob.batchLog.slice(-5),
      finalReport: currentJob.finalReport,
    });
  });

  app.get("/api/admin/content-expansion/report", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (!currentJob || !currentJob.finalReport) {
      return res.json({ hasReport: false });
    }

    res.json({
      hasReport: true,
      jobId: currentJob.jobId,
      ...currentJob.finalReport,
      batchLog: currentJob.batchLog,
      errors: currentJob.errors,
    });
  });

  app.post("/api/admin/content-expansion/reset", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (jobRunning) {
      return res.status(409).json({ error: "Cannot reset while job is running" });
    }

    currentJob = null;
    res.json({ ok: true });
  });
}
