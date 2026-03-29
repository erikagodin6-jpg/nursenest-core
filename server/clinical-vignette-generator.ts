import type { Express } from "express";
import * as crypto from "crypto";
import { requireAdmin } from "./admin-auth";
import { getProdPool, hasSeparateProdDb, getDbInfo } from "./db";
import * as pg from "pg";
import { runPreflightChecks, getPreflightCheckedPool, type PreflightResult } from "./environment-write-service";

const CLINICAL_DOMAINS = [
  "Foundations",
  "Health Assessment",
  "Pharmacology",
  "Cardiovascular",
  "Respiratory",
  "Neurology",
  "GI",
  "Endocrine",
  "Renal",
  "Hematology/Oncology",
  "Immunology",
  "Maternal/OB",
  "Pediatrics",
  "Mental Health",
  "Emergency/Critical Care",
  "Ethics",
] as const;

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
  "myocardial infarction": { title: "Myocardial Infarction", slug: "myocardial-infarction" },
  "compartment syndrome": { title: "Compartment Syndrome", slug: "compartment-syndrome" },
  "cushing": { title: "Cushing Syndrome", slug: "cushing-syndrome" },
  "addison": { title: "Addison's Disease", slug: "addisons-disease" },
  "multiple sclerosis": { title: "Multiple Sclerosis", slug: "multiple-sclerosis" },
  "myasthenia gravis": { title: "Myasthenia Gravis", slug: "myasthenia-gravis" },
  "opioid": { title: "Opioid Management", slug: "opioid-management" },
  "ethics": { title: "Nursing Ethics", slug: "nursing-ethics" },
  "informed consent": { title: "Informed Consent", slug: "informed-consent" },
  "advance directive": { title: "Advance Directives", slug: "advance-directives" },
};

interface ClinicalVignetteTierConfig {
  tier: string;
  exam: string;
  targetCount: number;
  domainDistribution: { domain: string; count: number }[];
  scopeDescription: string;
  regionUnits: string;
}

function buildDomainDistribution(totalCount: number): { domain: string; count: number }[] {
  const perDomain = Math.floor(totalCount / CLINICAL_DOMAINS.length);
  const remainder = totalCount % CLINICAL_DOMAINS.length;
  return CLINICAL_DOMAINS.map((domain, i) => ({
    domain,
    count: perDomain + (i < remainder ? 1 : 0),
  }));
}

const TIER_CONFIGS: ClinicalVignetteTierConfig[] = [
  {
    tier: "rpn",
    exam: "NCLEX-PN / REx-PN",
    targetCount: 1000,
    domainDistribution: buildDomainDistribution(1000),
    scopeDescription: "RPN/LVN scope: monitor, report, administer as ordered, basic assessments. Practical nurses do NOT independently prescribe, diagnose, or initiate treatment plans.",
    regionUnits: "Include both US (mg/dL, mEq/L, Fahrenheit) and Canadian (mmol/L, umol/L, Celsius) lab values where applicable.",
  },
  {
    tier: "rn",
    exam: "NCLEX-RN",
    targetCount: 1500,
    domainDistribution: buildDomainDistribution(1500),
    scopeDescription: "RN scope: protocol-based interventions, complex assessments, delegation, care coordination, patient education, critical thinking in acute and chronic settings.",
    regionUnits: "Use US conventional units (mEq/L, mg/dL, Fahrenheit) as primary with SI equivalents where appropriate.",
  },
  {
    tier: "np",
    exam: "AANP/ANCC NP Boards",
    targetCount: 1200,
    domainDistribution: buildDomainDistribution(1200),
    scopeDescription: "NP advanced practice scope: ordering, prescribing, diagnosing, autonomous clinical decision-making, differential diagnosis, evidence-based management.",
    regionUnits: "Use US conventional units (mg/dL, mEq/L). Include prescriptive authority logic and guideline references.",
  },
  {
    tier: "np",
    exam: "CNPLE",
    targetCount: 800,
    domainDistribution: buildDomainDistribution(800),
    scopeDescription: "Canadian NP scope aligned with the Canadian Nurse Practitioner Licensing Examination. Emphasizes competency-based clinical reasoning, primary care integration, population health, Indigenous health and cultural safety.",
    regionUnits: "Use Canadian SI units (mmol/L, umol/L, Celsius, kg). Canadian prescribing authority context. Include rural/remote care considerations.",
  },
];

function getMasteryCategory(difficulty: number): string {
  if (difficulty <= 2) return "low_mastery";
  if (difficulty <= 3) return "moderate_mastery";
  return "high_mastery";
}

interface VignetteJobProgress {
  jobId: string;
  status: "idle" | "verifying" | "running" | "completing" | "complete" | "failed";
  startedAt: string | null;
  completedAt: string | null;
  dbTarget: string | null;
  dbVerified: boolean;
  currentTier: string | null;
  currentExam: string | null;
  currentDomain: string | null;
  currentBatch: number;
  totalBatches: number;
  questionsInserted: Record<string, number>;
  flashcardsCreated: Record<string, number>;
  imageLinked: number;
  lessonLinked: number;
  duplicatesSkipped: number;
  validationFailed: number;
  errors: string[];
  batchLog: {
    batch: number;
    tier: string;
    exam: string;
    domain: string;
    generated: number;
    inserted: number;
    flashcards: number;
    images: number;
    lessons: number;
    skipped: number;
    failed: number;
    timestamp: string;
  }[];
  finalReport: any | null;
}

let currentVignetteJob: VignetteJobProgress | null = null;
let vignetteJobRunning = false;

function createVignetteJobProgress(): VignetteJobProgress {
  return {
    jobId: crypto.randomUUID(),
    status: "idle",
    startedAt: null,
    completedAt: null,
    dbTarget: null,
    dbVerified: false,
    currentTier: null,
    currentExam: null,
    currentDomain: null,
    currentBatch: 0,
    totalBatches: 0,
    questionsInserted: { "rpn": 0, "rn": 0, "np_aanp_ancc": 0, "np_cnple": 0 },
    flashcardsCreated: { "rpn": 0, "rn": 0, "np_aanp_ancc": 0, "np_cnple": 0 },
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
              feature: "clinical-vignette-generator",
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

function generateContentHash(stem: string, tier: string, exam: string): string {
  return crypto.createHash("sha256").update(`clinical-vignette:${tier}:${exam}:${stem}`).digest("hex").slice(0, 32);
}

function matchImagesForQuestion(stem: string, rationale: string, domain: string, topic: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string; sortOrder: number }[] {
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string; sortOrder: number }[] = [];
  const searchText = `${stem} ${rationale} ${domain} ${topic}`.toLowerCase();

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

function matchLessonForQuestion(stem: string, rationale: string, domain: string, topic: string): { title: string; slug: string } | null {
  const searchText = `${stem} ${rationale} ${domain} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(LESSON_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      return lesson;
    }
  }
  return null;
}

function buildVignetteSystemPrompt(tierConfig: ClinicalVignetteTierConfig, domain: string, difficulty: string): string {
  return `You are a senior clinical nursing exam psychometrician and vignette writer.
You specialize in writing clinical vignette-style exam questions for: ${tierConfig.exam}.

SCOPE OF PRACTICE:
${tierConfig.scopeDescription}

UNITS AND REGION:
${tierConfig.regionUnits}

CLINICAL DOMAIN: ${domain}

DIFFICULTY LEVEL: ${difficulty}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no commentary.
2. Every question MUST be a clinical vignette with a realistic patient scenario.
3. Each vignette MUST include: patient demographics (age, sex), presenting complaint, relevant vitals, pertinent lab values or assessment findings.
4. Each question must have exactly 4 answer choices (A, B, C, D) with exactly 1 correct answer.
5. Distractors must be clinically plausible but clearly distinguishable from the correct answer.
6. Include a thorough rationale explaining: why the correct answer is right, why each distractor is wrong, a clinical pearl, and a nursing intervention note.
7. Do NOT use emoji anywhere. Plain text only.
8. Vary patient age, sex, setting (ED, ICU, clinic, home health, long-term care), and acuity.
9. Avoid repeating the same disease or scenario pattern.
10. Each vignette stem must be minimum 80 characters with specific clinical data.

Return a JSON object with key "questions" containing an array of question objects.
Each object:
{
  "stem": "Detailed clinical vignette with patient demographics, vitals, labs, and assessment findings (minimum 80 characters)",
  "optionA": "First option text",
  "optionB": "Second option text",
  "optionC": "Third option text",
  "optionD": "Fourth option text",
  "correctAnswer": 0-3 (index of correct option),
  "rationale": "Complete explanation of why the correct answer is right. Include pathophysiology and clinical reasoning. Minimum 100 words.",
  "distractorRationales": { "A": "Why A is correct/wrong", "B": "Why B is correct/wrong", "C": "Why C is correct/wrong", "D": "Why D is correct/wrong" },
  "clinicalPearl": "A concise high-yield clinical pearl for exam prep",
  "nursingIntervention": "Key nursing intervention or priority action related to this scenario",
  "examStrategy": "A brief exam-taking strategy tip for this type of question",
  "difficulty": 1-5,
  "bodySystem": "Primary body system",
  "topic": "Specific clinical topic",
  "subtopic": "More specific subtopic",
  "tags": ["tag1", "tag2", "tag3"],
  "cognitiveLevel": "Application or Analysis or Synthesis or Evaluation",
  "examDomain": "${domain}"
}`;
}

function buildVignetteUserPrompt(count: number, domain: string, difficulty: string, existingStems: string[]): string {
  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  return `Generate exactly ${count} unique, high-quality clinical vignette-style exam questions for the domain "${domain}".
Target difficulty: ${difficulty}.

Each question MUST feature a distinct clinical scenario with:
- Specific patient (age, sex, relevant history)
- Presenting complaint or clinical situation
- At least 2-3 relevant vital signs, lab values, or assessment findings
- A clear clinical question requiring clinical judgment

Do NOT repeat topics, diseases, or scenario patterns.
${antiDupe}

Return JSON: {"questions": [...${count} items...]}`;
}

function validateVignetteQuestion(q: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!q.stem || typeof q.stem !== "string" || q.stem.length < 80) {
    errors.push("Stem missing or too short (minimum 80 chars for clinical vignettes)");
  }

  if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) {
    errors.push("Missing one or more options (A-D)");
  }

  if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer < 0 || q.correctAnswer > 3) {
    errors.push("Invalid correctAnswer (must be 0-3)");
  }

  if (!q.rationale || typeof q.rationale !== "string") {
    errors.push("Rationale missing");
  } else {
    const wordCount = q.rationale.split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      errors.push(`Rationale too short (${wordCount} words, minimum 50)`);
    }
  }

  if (!q.clinicalPearl || typeof q.clinicalPearl !== "string") {
    errors.push("Clinical pearl missing");
  }

  if (!q.difficulty || q.difficulty < 1 || q.difficulty > 5) {
    q.difficulty = 3;
  }

  return { valid: errors.length === 0, errors };
}

function enforceDifficulty(currentIndex: number, totalCount: number): number {
  const easyThreshold = Math.floor(totalCount * 0.35);
  const moderateThreshold = Math.floor(totalCount * 0.80);

  if (currentIndex < easyThreshold) return 2;
  if (currentIndex < moderateThreshold) return 3;
  return 4;
}

async function generateVignetteBatch(
  tierConfig: ClinicalVignetteTierConfig,
  domain: string,
  count: number,
  difficulty: string,
  existingStems: string[],
): Promise<any[]> {
  const openai = await getOpenAI();
  const systemPrompt = buildVignetteSystemPrompt(tierConfig, domain, difficulty);
  const userPrompt = buildVignetteUserPrompt(count, domain, difficulty, existingStems);

  const maxTokens = Math.min(count * 900 + 500, 16384);

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
  const targetLabel = hasSeparate ? "production (PROD_DATABASE_URL)" : "shared (DATABASE_URL)";
  console.log(`[ClinicalVignette] DB Info: dev=${info.devUrl}, prod=${info.prodUrl}, hasSeparateProd=${hasSeparate}`);

  const envTarget = hasSeparate ? "production" : "development";
  const targetPool = await getPreflightCheckedPool(envTarget as any, "ClinicalVignette");

  try {
    const result = await targetPool.query("SELECT current_database() AS db, current_user AS usr, NOW() AS ts");
    const row = result.rows[0];
    console.log(`[ClinicalVignette] DB verified: database=${row.db}, user=${row.usr}, target=${targetLabel}`);

    const tableCheck = await targetPool.query(`
      SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'exam_questions') AS has_exam,
             EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'flashcard_bank') AS has_flashcard
    `);
    const tables = tableCheck.rows[0];
    if (!tables.has_exam || !tables.has_flashcard) {
      return { verified: false, target: targetLabel, info: { error: "Required tables not found" } };
    }

    return {
      verified: true,
      target: targetLabel,
      info: { database: row.db, user: row.usr, timestamp: row.ts, hasSeparateProd: hasSeparate, prodUrl: info.prodUrl },
    };
  } catch (err: any) {
    console.error(`[ClinicalVignette] DB verification failed:`, err.message);
    return { verified: false, target: targetLabel, info: { error: err.message } };
  }
}

async function getExistingStemHashes(targetPool: pg.Pool): Promise<Set<string>> {
  const result = await targetPool.query(
    `SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`
  );
  return new Set(result.rows.map((r: any) => r.stem_hash).filter(Boolean));
}

function getTierKey(tier: string, exam: string): string {
  if (exam === "CNPLE") return "np_cnple";
  if (tier === "np") return "np_aanp_ancc";
  return tier;
}

async function insertVignetteWithFlashcard(
  targetPool: pg.Pool,
  tierConfig: ClinicalVignetteTierConfig,
  q: any,
  stemHash: string,
  images: any[],
  lesson: { title: string; slug: string } | null,
  domain: string,
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
    const mastery = getMasteryCategory(q.difficulty || 3);
    const regionScope = tierConfig.exam === "CNPLE" ? "CAN" : tierConfig.exam.includes("REx-PN") ? "BOTH" : "US";

    const enrichedRationale = [
      q.rationale || "",
      q.nursingIntervention ? `\nNursing Intervention: ${q.nursingIntervention}` : "",
    ].join("");

    const qResult = await client.query(
      `INSERT INTO exam_questions (
        tier, exam, question_type, status, stem, options, correct_answer,
        rationale, difficulty, tags, body_system, topic, subtopic,
        region_scope, career_type, stem_hash, clinical_pearl, exam_strategy,
        distractor_rationales, published_at
      ) VALUES ($1, $2, 'MCQ', 'published', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'nursing', $13, $14, $15, $16, NOW())
      RETURNING id`,
      [
        tierConfig.tier, tierConfig.exam, q.stem, options, correctAnswer,
        enrichedRationale, q.difficulty || 3,
        [...(q.tags || []), `exam_domain:${domain}`, `mastery:${mastery}`],
        q.bodySystem || domain, q.topic || domain, q.subtopic || null,
        regionScope, stemHash, q.clinicalPearl || null, q.examStrategy || null,
        q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
      ]
    );

    const questionId = qResult.rows[0].id;

    const front = q.stem;
    const correctOpt = [q.optionA, q.optionB, q.optionC, q.optionD][q.correctAnswer] || "";
    const backParts = [`Correct Answer: ${correctOpt}`];
    if (q.rationale) backParts.push(`\nRationale: ${q.rationale}`);
    if (q.clinicalPearl) backParts.push(`\nClinical Pearl: ${q.clinicalPearl}`);
    if (q.nursingIntervention) backParts.push(`\nNursing Intervention: ${q.nursingIntervention}`);
    if (lesson) backParts.push(`\nLesson: ${lesson.title} (/lessons/${lesson.slug})`);
    const back = backParts.join("\n");

    const contentHash = generateContentHash(q.stem, tierConfig.tier, tierConfig.exam);
    const lessonLinks = lesson ? [{ lessonTitle: lesson.title, lessonUrl: `/lessons/${lesson.slug}`, relevanceNote: `Related ${lesson.title} content` }] : [];

    const fcResult = await client.query(
      `INSERT INTO flashcard_bank (
        tier, front, back, content_hash, status, source_type, source_question_id,
        question_type, options, correct_answer, rationale_correct, distractor_rationales,
        clinical_takeaway, exam_pearl, rationale_media, lesson_links,
        difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
        category, career_type, topic_tag
      ) VALUES ($1,$2,$3,$4,'published','clinical_vignette_gen',$5,'MCQ',$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,true,$19,'nursing',$20)
      ON CONFLICT (content_hash) DO NOTHING
      RETURNING id`,
      [
        tierConfig.tier, front, back, contentHash, questionId,
        options, correctAnswer,
        q.rationale || "", q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
        q.nursingIntervention || q.clinicalPearl || null, q.clinicalPearl || null,
        JSON.stringify(images), JSON.stringify(lessonLinks),
        q.difficulty || 3, q.bodySystem || domain,
        q.topic || domain, q.subtopic || null,
        regionScope, q.bodySystem || domain, domain,
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

async function runVignetteJob(): Promise<void> {
  if (vignetteJobRunning) {
    throw new Error("A clinical vignette generation job is already running");
  }

  vignetteJobRunning = true;
  currentVignetteJob = createVignetteJobProgress();
  currentVignetteJob.status = "verifying";
  currentVignetteJob.startedAt = new Date().toISOString();

  try {
    const dbCheck = await verifyProductionDb();
    currentVignetteJob.dbTarget = dbCheck.target;
    currentVignetteJob.dbVerified = dbCheck.verified;

    if (!dbCheck.verified) {
      currentVignetteJob.status = "failed";
      currentVignetteJob.errors.push(`Production DB verification failed: ${JSON.stringify(dbCheck.info)}`);
      vignetteJobRunning = false;
      return;
    }

    console.log(`[ClinicalVignette] PRODUCTION DB VERIFIED: ${JSON.stringify(dbCheck.info)}`);
    console.log(`[ClinicalVignette] Starting clinical vignette generation job ${currentVignetteJob.jobId}`);

    const envTarget2 = hasSeparateProdDb() ? "production" : "development";
    const targetPool = await getPreflightCheckedPool(envTarget2 as any, "ClinicalVignette-Job");
    const existingHashes = await getExistingStemHashes(targetPool);
    console.log(`[ClinicalVignette] Found ${existingHashes.size} existing stem hashes for duplicate detection`);

    currentVignetteJob.status = "running";
    let globalBatch = 0;

    let totalBatches = 0;
    for (const tierConfig of TIER_CONFIGS) {
      for (const domainDist of tierConfig.domainDistribution) {
        totalBatches += Math.ceil(domainDist.count / 50);
      }
    }
    currentVignetteJob.totalBatches = totalBatches;

    const recentStems: string[] = [];
    const MAX_BACKFILL_ROUNDS = 3;
    const BATCH_SIZE = 50;

    for (const tierConfig of TIER_CONFIGS) {
      const tierKey = getTierKey(tierConfig.tier, tierConfig.exam);
      currentVignetteJob.currentTier = tierConfig.tier;
      currentVignetteJob.currentExam = tierConfig.exam;
      console.log(`[ClinicalVignette] Starting tier: ${tierConfig.tier} / ${tierConfig.exam} (${tierConfig.targetCount} questions across ${CLINICAL_DOMAINS.length} domains)`);

      for (const domainDist of tierConfig.domainDistribution) {
        currentVignetteJob.currentDomain = domainDist.domain;
        let domainInserted = 0;
        let backfillRound = 0;

        while (domainInserted < domainDist.count && backfillRound <= MAX_BACKFILL_ROUNDS) {
          const needed = domainDist.count - domainInserted;
          const batchSize = Math.min(BATCH_SIZE, needed);
          globalBatch++;
          currentVignetteJob.currentBatch = globalBatch;

          const difficultyRatio = domainInserted / domainDist.count;
          let difficulty: string;
          if (difficultyRatio < 0.35) difficulty = "easy";
          else if (difficultyRatio < 0.80) difficulty = "moderate";
          else difficulty = "hard";

          if (backfillRound > 0) {
            console.log(`[ClinicalVignette] Backfill round ${backfillRound} for ${tierConfig.exam}/${domainDist.domain}: need ${needed} more`);
          }

          console.log(`[ClinicalVignette] Batch ${globalBatch}: ${tierConfig.exam}/${domainDist.domain} (${difficulty}) - generating ${batchSize} questions (inserted ${domainInserted}/${domainDist.count})`);

          let generated: any[] = [];
          let retries = 0;
          const maxRetries = 2;

          while (retries <= maxRetries) {
            try {
              generated = await generateVignetteBatch(tierConfig, domainDist.domain, batchSize, difficulty, recentStems);
              break;
            } catch (err: any) {
              retries++;
              console.error(`[ClinicalVignette] Batch ${globalBatch} generation attempt ${retries} failed: ${err.message}`);
              if (retries > maxRetries) {
                currentVignetteJob.errors.push(`Batch ${globalBatch} (${tierConfig.exam}/${domainDist.domain}): generation failed after ${maxRetries + 1} attempts: ${err.message}`);
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
            if (domainInserted >= domainDist.count) break;

            q.difficulty = enforceDifficulty(domainInserted, domainDist.count);
            q.examDomain = domainDist.domain;

            const validation = validateVignetteQuestion(q);
            if (!validation.valid) {
              batchFailed++;
              currentVignetteJob.validationFailed++;
              continue;
            }

            const stemHash = generateStemHash(q.stem);
            if (existingHashes.has(stemHash)) {
              batchSkipped++;
              currentVignetteJob.duplicatesSkipped++;
              continue;
            }

            const images = matchImagesForQuestion(q.stem, q.rationale || "", domainDist.domain, q.topic || "");
            const lesson = matchLessonForQuestion(q.stem, q.rationale || "", domainDist.domain, q.topic || "");

            try {
              const result = await insertVignetteWithFlashcard(targetPool, tierConfig, q, stemHash, images, lesson, domainDist.domain);
              existingHashes.add(stemHash);
              recentStems.push(q.stem);
              if (recentStems.length > 50) recentStems.shift();

              batchInserted++;
              domainInserted++;
              currentVignetteJob!.questionsInserted[tierKey]++;

              if (images.length > 0) {
                batchImages++;
                currentVignetteJob!.imageLinked++;
              }

              if (lesson) {
                batchLessons++;
                currentVignetteJob!.lessonLinked++;
              }

              if (result.flashcardCreated) {
                batchFlashcards++;
                currentVignetteJob!.flashcardsCreated[tierKey]++;
              }
            } catch (insertErr: any) {
              batchFailed++;
              currentVignetteJob!.validationFailed++;
              console.error(`[ClinicalVignette] Insert error: ${insertErr.message}`);
            }
          }

          currentVignetteJob.batchLog.push({
            batch: globalBatch,
            tier: tierConfig.tier,
            exam: tierConfig.exam,
            domain: domainDist.domain,
            generated: generated.length,
            inserted: batchInserted,
            flashcards: batchFlashcards,
            images: batchImages,
            lessons: batchLessons,
            skipped: batchSkipped,
            failed: batchFailed,
            timestamp: new Date().toISOString(),
          });

          console.log(`[ClinicalVignette] Batch ${globalBatch} complete: generated=${generated.length}, inserted=${batchInserted}, flashcards=${batchFlashcards}, images=${batchImages}, lessons=${batchLessons}, skipped=${batchSkipped}, failed=${batchFailed} | domain progress: ${domainInserted}/${domainDist.count}`);

          if (batchInserted === 0 && generated.length > 0) {
            backfillRound++;
          }

          await new Promise(r => setTimeout(r, 500));
        }

        if (domainInserted < domainDist.count) {
          currentVignetteJob.errors.push(`${tierConfig.exam}/${domainDist.domain}: only inserted ${domainInserted}/${domainDist.count} after ${MAX_BACKFILL_ROUNDS} backfill rounds`);
        }
      }
    }

    currentVignetteJob.status = "completing";

    const finalExamCounts = await targetPool.query(
      `SELECT tier, exam, COUNT(*)::int AS count FROM exam_questions WHERE status = 'published' AND career_type = 'nursing' GROUP BY tier, exam ORDER BY tier, exam`
    );
    const finalFlashcardCounts = await targetPool.query(
      `SELECT tier, COUNT(*)::int AS count FROM flashcard_bank WHERE status = 'published' AND flashcard_enabled = true GROUP BY tier ORDER BY tier`
    );

    const totalQInserted = Object.values(currentVignetteJob.questionsInserted).reduce((a, b) => a + b, 0);
    const totalFCCreated = Object.values(currentVignetteJob.flashcardsCreated).reduce((a, b) => a + b, 0);

    currentVignetteJob.finalReport = {
      questionsInserted: currentVignetteJob.questionsInserted,
      flashcardsCreated: currentVignetteJob.flashcardsCreated,
      imageLinked: currentVignetteJob.imageLinked,
      lessonLinked: currentVignetteJob.lessonLinked,
      duplicatesSkipped: currentVignetteJob.duplicatesSkipped,
      validationFailed: currentVignetteJob.validationFailed,
      totalQuestionsInserted: totalQInserted,
      totalFlashcardsCreated: totalFCCreated,
      tierBreakdown: {
        "RPN/LVN (NCLEX-PN / REx-PN)": {
          target: 1000,
          inserted: currentVignetteJob.questionsInserted["rpn"],
          flashcards: currentVignetteJob.flashcardsCreated["rpn"],
        },
        "RN (NCLEX-RN)": {
          target: 1500,
          inserted: currentVignetteJob.questionsInserted["rn"],
          flashcards: currentVignetteJob.flashcardsCreated["rn"],
        },
        "NP Boards (AANP/ANCC)": {
          target: 1200,
          inserted: currentVignetteJob.questionsInserted["np_aanp_ancc"],
          flashcards: currentVignetteJob.flashcardsCreated["np_aanp_ancc"],
        },
        "Canadian NP (CNPLE)": {
          target: 800,
          inserted: currentVignetteJob.questionsInserted["np_cnple"],
          flashcards: currentVignetteJob.flashcardsCreated["np_cnple"],
        },
      },
      domainsCovered: CLINICAL_DOMAINS.length,
      difficultyDistribution: "35% easy, 45% moderate, 20% hard",
      dbTarget: currentVignetteJob.dbTarget,
      livePublishedTotals: {
        examQuestions: finalExamCounts.rows,
        flashcardBank: finalFlashcardCounts.rows,
      },
      completedAt: new Date().toISOString(),
    };

    currentVignetteJob.status = "complete";
    currentVignetteJob.completedAt = new Date().toISOString();

    console.log(`[ClinicalVignette] Job ${currentVignetteJob.jobId} COMPLETE`);
    console.log(`[ClinicalVignette] Questions: RPN=${currentVignetteJob.questionsInserted["rpn"]}, RN=${currentVignetteJob.questionsInserted["rn"]}, NP(AANP/ANCC)=${currentVignetteJob.questionsInserted["np_aanp_ancc"]}, NP(CNPLE)=${currentVignetteJob.questionsInserted["np_cnple"]}`);
    console.log(`[ClinicalVignette] Flashcards: RPN=${currentVignetteJob.flashcardsCreated["rpn"]}, RN=${currentVignetteJob.flashcardsCreated["rn"]}, NP(AANP/ANCC)=${currentVignetteJob.flashcardsCreated["np_aanp_ancc"]}, NP(CNPLE)=${currentVignetteJob.flashcardsCreated["np_cnple"]}`);
    console.log(`[ClinicalVignette] Images linked: ${currentVignetteJob.imageLinked}, Lessons linked: ${currentVignetteJob.lessonLinked}`);
    console.log(`[ClinicalVignette] Skipped (duplicates): ${currentVignetteJob.duplicatesSkipped}, Failed (validation): ${currentVignetteJob.validationFailed}`);
  } catch (err: any) {
    console.error(`[ClinicalVignette] Job failed:`, err.message);
    if (currentVignetteJob) {
      currentVignetteJob.status = "failed";
      currentVignetteJob.errors.push(err.message);
      currentVignetteJob.completedAt = new Date().toISOString();
    }
  } finally {
    vignetteJobRunning = false;
  }
}

export function setupClinicalVignetteRoutes(app: Express): void {
  app.get("/api/admin/clinical-vignette/distribution", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json({
      tiers: TIER_CONFIGS.map(t => ({
        tier: t.tier,
        exam: t.exam,
        targetCount: t.targetCount,
        domains: t.domainDistribution,
      })),
      clinicalDomains: CLINICAL_DOMAINS,
      difficultyDistribution: { easy: "35%", moderate: "45%", hard: "20%" },
      totalQuestions: TIER_CONFIGS.reduce((sum, t) => sum + t.targetCount, 0),
    });
  });

  app.get("/api/admin/clinical-vignette/verify-db", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await verifyProductionDb();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/clinical-vignette/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (vignetteJobRunning) {
      return res.status(409).json({ error: "A clinical vignette generation job is already running", jobId: currentVignetteJob?.jobId });
    }

    console.log(`[ClinicalVignette] Job triggered by admin: ${admin.username}`);

    runVignetteJob().catch(err => {
      console.error("[ClinicalVignette] Unhandled job error:", err);
    });

    await new Promise(r => setTimeout(r, 200));

    res.json({ started: true, jobId: currentVignetteJob?.jobId });
  });

  app.get("/api/admin/clinical-vignette/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (!currentVignetteJob) {
      return res.json({ status: "idle", hasJob: false });
    }

    res.json({
      hasJob: true,
      jobId: currentVignetteJob.jobId,
      status: currentVignetteJob.status,
      startedAt: currentVignetteJob.startedAt,
      completedAt: currentVignetteJob.completedAt,
      dbTarget: currentVignetteJob.dbTarget,
      dbVerified: currentVignetteJob.dbVerified,
      currentTier: currentVignetteJob.currentTier,
      currentExam: currentVignetteJob.currentExam,
      currentDomain: currentVignetteJob.currentDomain,
      currentBatch: currentVignetteJob.currentBatch,
      totalBatches: currentVignetteJob.totalBatches,
      questionsInserted: currentVignetteJob.questionsInserted,
      flashcardsCreated: currentVignetteJob.flashcardsCreated,
      imageLinked: currentVignetteJob.imageLinked,
      lessonLinked: currentVignetteJob.lessonLinked,
      duplicatesSkipped: currentVignetteJob.duplicatesSkipped,
      validationFailed: currentVignetteJob.validationFailed,
      errors: currentVignetteJob.errors.slice(-10),
      recentBatches: currentVignetteJob.batchLog.slice(-5),
      finalReport: currentVignetteJob.finalReport,
    });
  });

  app.get("/api/admin/clinical-vignette/report", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (!currentVignetteJob || !currentVignetteJob.finalReport) {
      return res.json({ hasReport: false });
    }

    res.json({
      hasReport: true,
      jobId: currentVignetteJob.jobId,
      ...currentVignetteJob.finalReport,
      batchLog: currentVignetteJob.batchLog,
      errors: currentVignetteJob.errors,
    });
  });

  app.post("/api/admin/clinical-vignette/reset", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (vignetteJobRunning) {
      return res.status(409).json({ error: "Cannot reset while job is running" });
    }

    currentVignetteJob = null;
    res.json({ ok: true });
  });
}
