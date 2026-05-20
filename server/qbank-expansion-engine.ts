import crypto from "crypto";
import { pool } from "./storage";
import { getProdPool, hasSeparateProdDb } from "./db";
import OpenAI from "openai";
import { checkDuplicateStem } from "./question-bank-validation";

const EXPANSION_DOMAINS = [
  "Foundations", "Health Assessment", "Pharmacology", "Cardiovascular",
  "Respiratory", "Neurology", "GI", "Endocrine", "Renal",
  "Hematology/Oncology", "Immunology", "Maternal/OB", "Pediatrics",
  "Mental Health", "Emergency/Critical Care", "Ethics",
] as const;

const BATCH_SIZE = 50;

const DIFFICULTY_DISTRIBUTION = { easy: 0.30, moderate: 0.40, hard: 0.20, critical_thinking: 0.10 };

const DIFFICULTY_MAP: Record<string, number> = { easy: 1, moderate: 3, hard: 5, critical_thinking: 7 };

const MASTERY_MAP: Record<string, string> = {
  easy: "low_mastery",
  moderate: "moderate_mastery",
  hard: "high_mastery",
  critical_thinking: "high_mastery",
};

const TIER_TARGETS: Record<string, number> = { rpn: 2000, rn: 4000, np: 2000 };

const ALLIED_HEALTH_TARGETS: Record<string, number> = {
  paramedic: 500,
  rrt: 500,
  mlt: 600,
  radiography: 400,
  pharmacy_tech: 400,
  occupational_therapy: 300,
  physical_therapy: 300,
  social_work: 400,
};

const TIER_EXAM_MAP: Record<string, string> = {
  rpn: "RPN-CAT",
  rn: "RN-CAT",
  np: "NP-CAT",
};

const TIER_SCOPE: Record<string, string> = {
  rpn: `You are a senior REx-PN / Canadian Practical Nurse Registration Exam item writer.
Use Canadian terminology, SI units (mmol/L, umol/L, Celsius, kg). RPN scope: monitor, report, administer as ordered, basic assessments.
RPNs do NOT independently prescribe, diagnose, or initiate treatment plans.
Questions test clinical judgment at the application/analysis level. Focus on patient safety, priority setting, delegation within RPN scope.`,

  rn: `You are a senior NCLEX-RN / Canadian RN Registration Exam item writer.
RN scope: protocol-based interventions, complex assessments, delegation, care coordination, patient education, critical thinking.
Questions test clinical judgment at the application/analysis level with emphasis on prioritization, delegation, and complex patient scenarios.`,

  np: `You are a senior Nurse Practitioner certification exam item writer.
NP scope: order, prescribe, diagnose, advanced practice. NPs independently manage patient care, interpret diagnostics, prescribe pharmacotherapy.
Questions test advanced clinical reasoning at the synthesis/evaluation level with emphasis on differential diagnosis, prescribing decisions, and evidence-based management.`,
};

interface ExpansionProgress {
  tier: string;
  batchNumber: number;
  questionsGenerated: number;
  flashcardsCreated: number;
  imagesAttached: number;
  lessonLinksAdded: number;
  duplicatesRejected: number;
}

interface ExpansionSummary {
  tier: string;
  targetCount: number;
  totalQuestionsInserted: number;
  totalFlashcardsCreated: number;
  totalImagesAttached: number;
  totalLessonLinksAdded: number;
  totalDuplicatesRejected: number;
  domainDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  startedAt: string;
  completedAt: string;
  batches: ExpansionProgress[];
}

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function computeStemHash(stem: string): string {
  return crypto.createHash("md5").update(stem.toLowerCase().trim()).digest("hex");
}

function computeContentHash(stem: string, tier: string): string {
  return crypto.createHash("sha256").update(`expansion:${tier}:${stem}`).digest("hex").slice(0, 32);
}

function distributeDomains(totalCount: number): Record<string, number> {
  const perDomain = Math.floor(totalCount / EXPANSION_DOMAINS.length);
  const remainder = totalCount % EXPANSION_DOMAINS.length;
  const dist: Record<string, number> = {};
  EXPANSION_DOMAINS.forEach((d, i) => {
    dist[d] = perDomain + (i < remainder ? 1 : 0);
  });
  return dist;
}

function assignDifficulty(batchIndex: number, totalInBatch: number): string {
  const easyCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.easy);
  const modCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.moderate);
  const hardCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.hard);
  if (batchIndex < easyCount) return "easy";
  if (batchIndex < easyCount + modCount) return "moderate";
  if (batchIndex < easyCount + modCount + hardCount) return "hard";
  return "critical_thinking";
}

function buildExpansionPrompt(
  tier: string,
  domain: string,
  count: number,
  difficulties: string[],
  existingStems: string[],
): { system: string; user: string } {
  const scope = TIER_SCOPE[tier] || TIER_SCOPE.rpn;

  const diffCounts: Record<string, number> = {};
  for (const d of difficulties) diffCounts[d] = (diffCounts[d] || 0) + 1;

  const diffBlock = Object.entries(diffCounts)
    .map(([d, c]) => `- ${d}: ${c} questions`)
    .join("\n");

  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const system = `${scope}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no prose.
2. NEVER copy or reference instructions in any output field.
3. Every question must have a unique, distinct clinical scenario.
4. Do NOT use any emoji characters. Plain text only.
5. Each question's rationale must include:
   - Why the correct answer is right
   - Why each distractor is wrong
   - A clinical application note
   - A nursing intervention note
6. Include a clinical pearl for each question.

You will generate exactly ${count} questions for the ${domain} domain.

Difficulty distribution:
${diffBlock}

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object schema:
{
  "stem": "A detailed clinical scenario question (min 50 chars)",
  "scenario": "Extended clinical context",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correct_answer": "B",
  "difficulty": "easy" | "moderate" | "hard",
  "domain": "${domain}",
  "rationale": "Detailed rationale: why correct + why each wrong + clinical application + nursing intervention",
  "clinical_pearl": "A concise clinical pearl for exam prep",
  "topic": "Specific topic within ${domain}",
  "body_system": "Related body system"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer letter.
${antiDupe}

Return EXACTLY ${count} items. JSON only. No extra text.`;

  const user = `Generate ${count} unique ${tier.toUpperCase()} nursing exam questions for the ${domain} domain. Each must have a distinct clinical scenario with specific patient data.`;

  return { system, user };
}

const IMAGE_KEYWORD_MAP: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "cardiac tamponade": [{ file: "cardiactamponade", alt: "Cardiac tamponade illustration", caption: "Cardiac Tamponade", description: "Beck's triad: hypotension, muffled heart sounds, JVD" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes management infographic", caption: "Diabetes Overview", description: "Key concepts in diabetes management and monitoring" }],
  "abg": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "arterial blood gas": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "acid-base": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "heart failure": [{ file: "heartfailure", alt: "Heart failure illustration", caption: "Heart Failure", description: "HF pathophysiology, left vs right-sided, treatment" }],
  "pyloric stenosis": [{ file: "pyloricstenosis_1773375303320.png", alt: "Pyloric stenosis illustration", caption: "Pyloric Stenosis", description: "Non-bilious projectile vomiting, olive-shaped mass" }],
  "renal calculi": [{ file: "renalcalculus_1773375303320.png", alt: "Renal calculus illustration", caption: "Renal Calculi", description: "Kidney stones: types, symptoms, and management" }],
  "kidney stone": [{ file: "renalcalculus_1773375303320.png", alt: "Renal calculus illustration", caption: "Renal Calculi", description: "Kidney stones: types, symptoms, and management" }],
  "preeclampsia": [{ file: "preeclampsia", alt: "Preeclampsia illustration", caption: "Preeclampsia", description: "Hypertensive disorder of pregnancy" }],
  "placental abruption": [{ file: "placentalabruption_1773375118294", alt: "Placental abruption illustration", caption: "Placental Abruption", description: "Premature placental separation" }],
  "postpartum hemorrhage": [{ file: "postpartumhemorrhage", alt: "Postpartum hemorrhage illustration", caption: "Postpartum Hemorrhage", description: "PPH: uterine atony, 4 T's, fundal massage" }],
  "cushing": [{ file: "cushing.png", alt: "Cushing syndrome illustration", caption: "Cushing Syndrome", description: "Cortisol excess: moon face, buffalo hump" }],
  "addison": [{ file: "addisons", alt: "Addison's disease illustration", caption: "Addison's Disease", description: "Adrenal insufficiency: hypotension, hyperpigmentation" }],
  "multiple sclerosis": [{ file: "MS", alt: "Multiple sclerosis illustration", caption: "Multiple Sclerosis", description: "Autoimmune demyelinating disease" }],
  "myasthenia gravis": [{ file: "myastheniagravis", alt: "Myasthenia gravis illustration", caption: "Myasthenia Gravis", description: "Autoimmune neuromuscular junction disorder" }],
  "seizure": [{ file: "seizure", alt: "Seizure illustration", caption: "Seizure Management", description: "Seizure types, medications, nursing care" }],
  "stroke": [{ file: "stroke", alt: "Stroke illustration", caption: "Stroke", description: "Ischemic vs hemorrhagic stroke" }],
  "pneumonia": [{ file: "pneumonia", alt: "Pneumonia illustration", caption: "Pneumonia", description: "Lung infection: types, assessment, treatment" }],
  "copd": [{ file: "copd", alt: "COPD illustration", caption: "COPD", description: "Chronic obstructive pulmonary disease management" }],
  "asthma": [{ file: "asthma", alt: "Asthma illustration", caption: "Asthma", description: "Airway inflammation and bronchospasm" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration", caption: "Pancreatitis", description: "Pancreatic inflammation: Cullen's, Grey Turner's" }],
  "hepatitis": [{ file: "hepatitisb", alt: "Hepatitis illustration", caption: "Hepatitis", description: "Viral hepatitis: transmission and management" }],
  "sickle cell": [{ file: "sicklecell", alt: "Sickle cell illustration", caption: "Sickle Cell Disease", description: "Sickle cell crisis prevention and management" }],
  "anemia": [{ file: "anemia", alt: "Anemia illustration", caption: "Anemia", description: "Types of anemia and nursing management" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome illustration", caption: "Compartment Syndrome", description: "5 P's, fasciotomy, neurovascular assessment" }],
  "fracture": [{ file: "fracture", alt: "Fracture illustration", caption: "Fracture", description: "Types, assessment, and management" }],
  "burns": [{ file: "burns", alt: "Burns illustration", caption: "Burns", description: "Burn classification and nursing management" }],
  "opioid overdose": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Opioid Overdose", description: "Respiratory depression, naloxone reversal" }],
  "schizophrenia": [{ file: "schizophrenia", alt: "Schizophrenia illustration", caption: "Schizophrenia", description: "Positive and negative symptoms, antipsychotics" }],
  "depression": [{ file: "depression", alt: "Depression illustration", caption: "Depression", description: "Major depressive disorder assessment and treatment" }],
  "bipolar": [{ file: "bipolar", alt: "Bipolar disorder illustration", caption: "Bipolar Disorder", description: "Mania, depression, lithium monitoring" }],
  "gestational diabetes": [{ file: "gestationaldiabetes", alt: "Gestational diabetes illustration", caption: "Gestational Diabetes", description: "Glucose intolerance in pregnancy" }],
  "fetal monitoring": [{ file: "fetalmonitoring", alt: "Fetal monitoring illustration", caption: "Fetal Monitoring", description: "EFM categories, decelerations, interventions" }],
  "osteoporosis": [{ file: "osteoporosis", alt: "Osteoporosis illustration", caption: "Osteoporosis", description: "Bone density loss, bisphosphonates" }],
  "hypothyroidism": [{ file: "hypothyroidism_1773374939606", alt: "Hypothyroidism illustration", caption: "Hypothyroidism", description: "Decreased thyroid hormone, weight gain, fatigue" }],
  "hyperthyroidism": [{ file: "hyperthyroidism", alt: "Hyperthyroidism illustration", caption: "Hyperthyroidism", description: "Thyroid storm, weight loss, tachycardia" }],
  "dvt": [{ file: "dvt", alt: "DVT illustration", caption: "Deep Vein Thrombosis", description: "Venous thromboembolism prevention and treatment" }],
  "pulmonary embolism": [{ file: "pe", alt: "Pulmonary embolism illustration", caption: "Pulmonary Embolism", description: "PE signs, treatment, prevention" }],
};

const LESSON_TOPIC_MAP: Record<string, { title: string; slug: string }> = {
  "heart failure": { title: "Heart Failure Management", slug: "heart-failure" },
  "diabetes": { title: "Diabetes Management", slug: "diabetes-management" },
  "shock": { title: "Types of Shock", slug: "shock-management" },
  "electrolyte": { title: "Electrolyte Imbalances", slug: "electrolyte-imbalances" },
  "preeclampsia": { title: "Preeclampsia & Eclampsia", slug: "preeclampsia" },
  "seizure": { title: "Seizure Management", slug: "seizure-disorders" },
  "stroke": { title: "Stroke Assessment", slug: "stroke" },
  "pneumonia": { title: "Pneumonia", slug: "pneumonia" },
  "copd": { title: "COPD Management", slug: "copd" },
  "asthma": { title: "Asthma Management", slug: "asthma" },
  "cardiac tamponade": { title: "Cardiac Tamponade", slug: "cardiac-tamponade" },
  "hypertension": { title: "Hypertension", slug: "hypertension" },
  "anemia": { title: "Anemia", slug: "anemia" },
  "sickle cell": { title: "Sickle Cell Disease", slug: "sickle-cell-crisis" },
  "pancreatitis": { title: "Pancreatitis", slug: "pancreatitis" },
  "hepatitis": { title: "Hepatitis", slug: "hepatitis" },
  "burns": { title: "Burns", slug: "burns" },
  "wound": { title: "Wound Care", slug: "wound-care" },
  "fracture": { title: "Fracture Management", slug: "fractures" },
  "infection control": { title: "Infection Control", slug: "infection-control" },
  "medication": { title: "Pharmacology Review", slug: "pharmacology" },
  "depression": { title: "Depression", slug: "depression" },
  "anxiety": { title: "Anxiety Disorders", slug: "anxiety" },
  "schizophrenia": { title: "Schizophrenia", slug: "schizophrenia" },
  "bipolar": { title: "Bipolar Disorder", slug: "bipolar" },
  "labor": { title: "Stages of Labor", slug: "stages-of-labor" },
  "postpartum": { title: "Postpartum Care", slug: "postpartum" },
  "pediatric": { title: "Pediatric Nursing", slug: "pediatrics" },
  "neonatal": { title: "Neonatal Care", slug: "neonatal" },
  "renal": { title: "Renal Disorders", slug: "renal" },
  "dialysis": { title: "Dialysis", slug: "dialysis" },
  "thyroid": { title: "Thyroid Disorders", slug: "thyroid" },
  "addison": { title: "Addison's Disease", slug: "addisons" },
  "cushing": { title: "Cushing Syndrome", slug: "cushings" },
  "dvt": { title: "Deep Vein Thrombosis", slug: "dvt" },
  "pulmonary embolism": { title: "Pulmonary Embolism", slug: "pulmonary-embolism" },
  "compartment syndrome": { title: "Compartment Syndrome", slug: "compartment-syndrome" },
  "delegation": { title: "Delegation", slug: "delegation" },
  "prioritization": { title: "Prioritization", slug: "prioritization" },
  "informed consent": { title: "Informed Consent", slug: "informed-consent" },
  "restraint": { title: "Restraint Use", slug: "restraints" },
  "ethics": { title: "Nursing Ethics", slug: "ethics" },
};

function matchImagesForQuestion(stem: string, rationale: string, topic: string, domain: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] {
  const searchText = `${stem} ${rationale} ${topic} ${domain}`.toLowerCase();
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] = [];

  for (const [keyword, images] of Object.entries(IMAGE_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
          });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

function findLessonLink(stem: string, rationale: string, topic: string, tier: string): { title: string; url: string } | null {
  const searchText = `${stem} ${rationale} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(LESSON_TOPIC_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-${tier}`,
      };
    }
  }

  return null;
}

function appendLessonLinkToRationale(rationale: string, lessonLink: { title: string; url: string } | null): string {
  if (!lessonLink) return rationale;
  return `${rationale}\n\nTo review this concept, see the NurseNest lesson: ${lessonLink.title} → ${lessonLink.url}`;
}

function buildFlashcardBack(
  correctAnswer: string,
  options: { label: string; text: string }[],
  rationale: string,
  clinicalPearl: string,
  lessonLink: { title: string; url: string } | null,
): string {
  const parts: string[] = [];
  const correctOpt = options.find(o => o.label === correctAnswer);
  if (correctOpt) {
    parts.push(`Correct Answer: ${correctOpt.label}. ${correctOpt.text}`);
  }
  parts.push(`\nRationale: ${rationale}`);
  if (clinicalPearl) {
    parts.push(`\nClinical Pearl: ${clinicalPearl}`);
  }
  if (lessonLink) {
    parts.push(`\nTo review this concept, see the NurseNest lesson: ${lessonLink.title} → ${lessonLink.url}`);
  }
  return parts.join("\n");
}

async function getExistingStemHashes(dbPool: any): Promise<Set<string>> {
  const { rows } = await dbPool.query(
    `SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`
  );
  return new Set(rows.map((r: any) => r.stem_hash));
}

async function generateBatch(
  openai: OpenAI,
  tier: string,
  domain: string,
  count: number,
  existingStems: string[],
  maxRetries: number = 2,
): Promise<any[]> {
  const difficulties: string[] = [];
  for (let i = 0; i < count; i++) {
    difficulties.push(assignDifficulty(i, count));
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { system, user } = buildExpansionPrompt(tier, domain, count, difficulties, existingStems);

      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
        max_tokens: Math.min(count * 700 + 500, 16384),
        response_format: { type: "json_object" },
      });

      const content = resp.choices[0]?.message?.content || "{}";
      let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleaned);
      const items = Array.isArray(parsed.items) ? parsed.items
        : Array.isArray(parsed.questions) ? parsed.questions
        : Array.isArray(parsed) ? parsed : [];

      if (items.length > 0) return items;

      console.log(`[Expansion] Attempt ${attempt + 1}: 0 items parsed for ${domain}, retrying...`);
    } catch (err: any) {
      console.error(`[Expansion] Attempt ${attempt + 1} failed for ${domain}:`, err.message);
    }

    if (attempt < maxRetries) await new Promise(r => setTimeout(r, 1500));
  }

  return [];
}

function validateQuestion(q: any): boolean {
  if (!q.stem || typeof q.stem !== "string" || q.stem.length < 40) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  if (!q.correct_answer) return false;
  if (!q.rationale || typeof q.rationale !== "string" || q.rationale.length < 20) return false;
  return true;
}

export async function runExpansionForTier(
  tier: string,
  targetCount?: number,
  onProgress?: (p: ExpansionProgress) => void,
): Promise<ExpansionSummary> {
  const count = targetCount || TIER_TARGETS[tier] || 1000;
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[Expansion] Starting ${tier.toUpperCase()} expansion: ${count} questions, targeting ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"} database`);

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const domainPlan = distributeDomains(count);
  const startedAt = new Date().toISOString();
  const batches: ExpansionProgress[] = [];

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalImages = 0;
  let totalLessonLinks = 0;
  let totalDuplicates = 0;
  let batchNumber = 0;
  const recentStems: string[] = [];

  const domainCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};

  for (const [domain, domainTarget] of Object.entries(domainPlan)) {
    let domainRemaining = domainTarget;

    while (domainRemaining > 0) {
      const thisBatchSize = Math.min(BATCH_SIZE, domainRemaining);
      batchNumber++;

      console.log(`[Expansion] Batch ${batchNumber}: ${thisBatchSize} questions for ${domain} (${tier})`);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `expansion-${tier}`,
            "expansion_batch_start",
            JSON.stringify({ tier, batchNumber, domain, batchSize: thisBatchSize, totalInserted }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[Expansion] Event log error:`, logErr.message);
      }

      const items = await generateBatch(openai, tier, domain, thisBatchSize, recentStems);

      let batchInserted = 0;
      let batchFlashcards = 0;
      let batchImages = 0;
      let batchLessonLinks = 0;
      let batchDuplicates = 0;

      for (const item of items) {
        if (!validateQuestion(item)) continue;

        const stemHash = computeStemHash(item.stem);
        if (existingHashes.has(stemHash)) {
          batchDuplicates++;
          continue;
        }

        const dupCheck = await checkDuplicateStem(item.stem, tier);
        if (dupCheck.isDuplicate) {
          batchDuplicates++;
          continue;
        }

        const difficulty = item.difficulty || "moderate";
        const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
        const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
        const lessonLink = findLessonLink(item.stem, item.rationale, item.topic || "", tier);
        const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
        const images = matchImagesForQuestion(item.stem, item.rationale, item.topic || "", domain);

        const options = Array.isArray(item.options) ? item.options.map((o: any, i: number) => {
          if (typeof o === "string") {
            const match = o.match(/^([A-H])\)\s*(.+)/);
            if (match) return { label: match[1], text: match[2] };
            return { label: String.fromCharCode(65 + i), text: o };
          }
          return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
        }) : [];

        const correctAnswer = typeof item.correct_answer === "string" ? item.correct_answer : "A";

        const client = await dbPool.connect();
        try {
          await client.query("BEGIN");

          const tagsArray = [domain, masteryCategory, `difficulty_${difficulty}`];

          const { rows: inserted } = await client.query(
            `INSERT INTO exam_questions (
              id, tier, exam, question_type, status, stem, options, correct_answer,
              rationale, difficulty, tags, body_system, topic, region_scope,
              stem_hash, career_type, scenario, clinical_pearl, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10::text[], $11, $12, $13,
              $14, $15, $16, $17, NOW(), NOW()
            ) ON CONFLICT DO NOTHING RETURNING id`,
            [
              tier,
              TIER_EXAM_MAP[tier] || "CAT",
              "multiple_choice",
              "approved",
              item.stem,
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              rationaleWithLink,
              difficultyNum,
              tagsArray,
              item.body_system || domain,
              item.topic || domain,
              "BOTH",
              stemHash,
              "nursing",
              item.scenario || item.stem,
              item.clinical_pearl || "",
            ]
          );

          if (!inserted || inserted.length === 0) {
            await client.query("ROLLBACK");
            batchDuplicates++;
            client.release();
            continue;
          }

          const questionId = inserted[0].id;
          existingHashes.add(stemHash);
          batchInserted++;
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
          difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
          recentStems.push(item.stem.substring(0, 100));
          if (recentStems.length > 30) recentStems.splice(0, recentStems.length - 20);

          if (lessonLink) batchLessonLinks++;
          if (images.length > 0) batchImages++;

          const flashcardFront = item.stem;
          const flashcardBack = buildFlashcardBack(
            correctAnswer, options, item.rationale, item.clinical_pearl || "", lessonLink,
          );
          const flashcardHash = computeContentHash(item.stem, tier);

          const lessonLinks = lessonLink ? [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url, relevanceNote: `Related to ${domain}` }] : [];

          const { rowCount: fcInserted } = await client.query(
            `INSERT INTO flashcard_bank (
              id, tier, front, back, content_hash, status, source_type, source_question_id,
              question_type, options, correct_answer, rationale_correct,
              clinical_takeaway, exam_pearl, rationale_media, lesson_links,
              difficulty, body_system, topic, region_scope, flashcard_enabled,
              category, career_type, created_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13, $14, $15,
              $16, $17, $18, $19, $20, $21, $22, NOW()
            ) ON CONFLICT (content_hash) DO NOTHING`,
            [
              tier,
              flashcardFront,
              flashcardBack,
              flashcardHash,
              "approved",
              "expansion_engine",
              questionId,
              "multiple_choice",
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              item.rationale,
              item.clinical_pearl || null,
              item.clinical_pearl || null,
              JSON.stringify(images),
              JSON.stringify(lessonLinks),
              difficultyNum,
              item.body_system || domain,
              item.topic || domain,
              "BOTH",
              true,
              domain,
              "nursing",
            ]
          );

          await client.query("COMMIT");
          if (fcInserted && fcInserted > 0) batchFlashcards++;
        } catch (err: any) {
          await client.query("ROLLBACK").catch(() => {});
          if (err.code === "23505") {
            batchDuplicates++;
          } else {
            console.error(`[Expansion] Insert error:`, err.message);
          }
        } finally {
          client.release();
        }
      }

      totalInserted += batchInserted;
      totalFlashcards += batchFlashcards;
      totalImages += batchImages;
      totalLessonLinks += batchLessonLinks;
      totalDuplicates += batchDuplicates;
      domainRemaining -= batchInserted > 0 ? batchInserted : thisBatchSize;

      const progress: ExpansionProgress = {
        tier,
        batchNumber,
        questionsGenerated: batchInserted,
        flashcardsCreated: batchFlashcards,
        imagesAttached: batchImages,
        lessonLinksAdded: batchLessonLinks,
        duplicatesRejected: batchDuplicates,
      };
      batches.push(progress);

      if (onProgress) onProgress(progress);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `expansion-${tier}`,
            "expansion_batch_complete",
            JSON.stringify({
              ...progress,
              totalInserted,
              totalFlashcards,
              totalImages,
              totalLessonLinks,
              totalDuplicates,
            }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[Expansion] Event log error:`, logErr.message);
      }

      console.log(`[Expansion] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards, ${batchImages} images, ${batchLessonLinks} lessons, ${batchDuplicates} duplicates. Total: ${totalInserted}/${count}`);

      await new Promise(r => setTimeout(r, 500));
    }
  }

  const completedAt = new Date().toISOString();

  const summary: ExpansionSummary = {
    tier,
    targetCount: count,
    totalQuestionsInserted: totalInserted,
    totalFlashcardsCreated: totalFlashcards,
    totalImagesAttached: totalImages,
    totalLessonLinksAdded: totalLessonLinks,
    totalDuplicatesRejected: totalDuplicates,
    domainDistribution: domainCounts,
    difficultyDistribution: difficultyCounts,
    startedAt,
    completedAt,
    batches,
  };

  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        `expansion-${tier}`,
        "expansion_complete",
        JSON.stringify(summary),
      ]
    );
  } catch (logErr: any) {
    console.error(`[Expansion] Event log error:`, logErr.message);
  }

  console.log(`[Expansion] ${tier.toUpperCase()} complete: ${totalInserted}/${count} questions, ${totalFlashcards} flashcards`);
  return summary;
}

export async function runFullExpansion(
  onProgress?: (p: ExpansionProgress) => void,
): Promise<{ rpn: ExpansionSummary; rn: ExpansionSummary; np: ExpansionSummary; grandTotal: any }> {
  console.log(`[Expansion] Starting full 3,700-question expansion across all tiers`);

  const rpnSummary = await runExpansionForTier("rpn", 1000, onProgress);
  const rnSummary = await runExpansionForTier("rn", 1500, onProgress);
  const npSummary = await runExpansionForTier("np", 1200, onProgress);

  const grandTotal = {
    totalQuestions: rpnSummary.totalQuestionsInserted + rnSummary.totalQuestionsInserted + npSummary.totalQuestionsInserted,
    totalFlashcards: rpnSummary.totalFlashcardsCreated + rnSummary.totalFlashcardsCreated + npSummary.totalFlashcardsCreated,
    totalImages: rpnSummary.totalImagesAttached + rnSummary.totalImagesAttached + npSummary.totalImagesAttached,
    totalLessonLinks: rpnSummary.totalLessonLinksAdded + rnSummary.totalLessonLinksAdded + npSummary.totalLessonLinksAdded,
    totalDuplicates: rpnSummary.totalDuplicatesRejected + rnSummary.totalDuplicatesRejected + npSummary.totalDuplicatesRejected,
    target: 3700,
  };

  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;
  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        "expansion-full",
        "full_expansion_complete",
        JSON.stringify({ rpn: rpnSummary, rn: rnSummary, np: npSummary, grandTotal }),
      ]
    );
  } catch (logErr: any) {
    console.error(`[Expansion] Event log error:`, logErr.message);
  }

  return { rpn: rpnSummary, rn: rnSummary, np: npSummary, grandTotal };
}

const CRITICAL_CARE_SUBSPECIALTIES = [
  "ICU Nursing",
  "Cardiac ICU",
  "Neuro ICU",
  "Trauma ICU",
  "PICU",
  "NICU",
] as const;

const CRITICAL_CARE_TOPICS: Record<string, string[]> = {
  "ICU Nursing": [
    "Mechanical Ventilation", "Hemodynamic Monitoring", "Sedation & Pain Management",
    "Sepsis & Septic Shock", "ARDS Management", "Central Line Care", "Arterial Line Monitoring",
    "Vasopressor Therapy", "Fluid Resuscitation", "Electrolyte Management in ICU",
    "ICU Delirium Prevention", "Prone Positioning", "Rapid Response Assessment",
    "ICU Nutrition Support", "Ventilator-Associated Pneumonia Prevention",
    "ICU Skin Integrity", "End-of-Life Care in ICU", "ICU Pharmacology",
    "Continuous Renal Replacement Therapy", "Blood Product Administration",
  ],
  "Cardiac ICU": [
    "Acute MI Management", "Post-Cardiac Surgery Care", "Cardiogenic Shock",
    "Arrhythmia Recognition & Management", "Heart Failure Exacerbation",
    "Cardiac Tamponade", "Temporary Pacemaker Management", "IABP Nursing Care",
    "Hemodynamic Waveform Interpretation", "Cardiac Medication Drips",
    "Post-PCI Care", "Valvular Heart Disease", "Aortic Dissection",
    "Pulmonary Hypertension", "Cardiac Transplant Care",
    "ECG Interpretation in CICU", "LVAD Management", "Anticoagulation in CICU",
    "Cardiac Arrest Management", "Therapeutic Hypothermia Post-Arrest",
  ],
  "Neuro ICU": [
    "Traumatic Brain Injury", "Stroke Management", "Intracranial Pressure Monitoring",
    "Status Epilepticus", "Subarachnoid Hemorrhage", "Cerebral Vasospasm",
    "External Ventricular Drain Management", "Neuro Assessment & GCS",
    "Spinal Cord Injury", "Brain Death Determination", "Neuromuscular Blockade",
    "Osmotic Therapy", "Cerebral Perfusion Pressure", "Meningitis/Encephalitis",
    "Post-Craniotomy Care", "Guillain-Barré Syndrome", "Myasthenia Gravis Crisis",
    "Neuro Pharmacology", "Seizure Management in ICU", "Targeted Temperature Management",
  ],
  "Trauma ICU": [
    "Primary & Secondary Survey", "Hemorrhagic Shock Management",
    "Massive Transfusion Protocol", "Chest Trauma & Chest Tube Management",
    "Abdominal Trauma Assessment", "Pelvic Fracture Management",
    "Burn ICU Care", "Compartment Syndrome", "Damage Control Resuscitation",
    "Traumatic Rhabdomyolysis", "Spleen/Liver Laceration Management",
    "Crush Injury Syndrome", "Fat Embolism Syndrome", "Trauma Coagulopathy",
    "Trauma Pain Management", "Open Fracture Management",
    "Flail Chest & Pulmonary Contusion", "Tension Pneumothorax",
    "Trauma Pharmacology", "Multi-Organ Dysfunction Syndrome",
  ],
  "PICU": [
    "Pediatric Respiratory Failure", "Pediatric Sepsis",
    "Pediatric Status Epilepticus", "Congenital Heart Disease Post-Op",
    "Pediatric Diabetic Ketoacidosis", "Pediatric Trauma",
    "Pediatric Burns", "Bronchiolitis in PICU", "Croup & Epiglottitis",
    "Pediatric Medication Dosing", "Pediatric Pain Assessment",
    "Pediatric Hemodynamic Monitoring", "Pediatric Ventilation",
    "Pediatric Fluid & Electrolyte Management", "Pediatric Shock",
    "Pediatric Intracranial Hypertension", "Pediatric Drowning/Submersion",
    "Pediatric Poisoning/Ingestion", "Pediatric Cardiac Arrest",
    "Family-Centered Care in PICU",
  ],
  "NICU": [
    "Neonatal Resuscitation", "Preterm Infant Care", "Respiratory Distress Syndrome",
    "Necrotizing Enterocolitis", "Neonatal Sepsis", "Hyperbilirubinemia",
    "Intraventricular Hemorrhage", "Patent Ductus Arteriosus",
    "Retinopathy of Prematurity", "Neonatal Thermoregulation",
    "Neonatal Pain Assessment & Management", "NICU Pharmacology",
    "Developmental Care & NIDCAP", "Neonatal Abstinence Syndrome",
    "Surfactant Administration", "NICU Nutrition & TPN",
    "Congenital Anomaly Management", "Neonatal Seizures",
    "High-Frequency Ventilation", "NICU Family Support & Discharge Planning",
  ],
};

const CRITICAL_CARE_SCOPE: Record<string, string> = {
  "ICU Nursing": `You are a senior Critical Care Certified Nurse (CCRN) exam item writer specializing in adult ICU nursing.
Focus on: mechanical ventilation, hemodynamic monitoring, vasopressor management, sedation protocols, sepsis bundles, ARDS management, central line care, arterial line interpretation, fluid resuscitation, electrolyte emergencies, ICU delirium (CAM-ICU), prone positioning, rapid response, CRRT, and ICU pharmacology.
Questions test advanced clinical judgment in the adult ICU setting with emphasis on assessment, prioritization, and evidence-based interventions.`,

  "Cardiac ICU": `You are a senior Cardiac ICU (CICU) nursing exam item writer.
Focus on: acute MI management, post-cardiac surgery nursing, cardiogenic shock, arrhythmia recognition, heart failure exacerbation, cardiac tamponade, IABP/Impella care, hemodynamic waveform interpretation, cardiac drips (dopamine, dobutamine, milrinone, amiodarone), post-PCI care, temporary pacemaker management, LVAD care, anticoagulation management, and therapeutic hypothermia post-cardiac arrest.
Questions test specialized cardiac critical care reasoning with ECG interpretation and hemodynamic data analysis.`,

  "Neuro ICU": `You are a senior Neuro ICU nursing exam item writer.
Focus on: traumatic brain injury, stroke management, ICP monitoring, EVD management, status epilepticus, subarachnoid hemorrhage, cerebral vasospasm, neuro assessments (GCS, pupil reactivity, NIH Stroke Scale), spinal cord injury, brain death criteria, osmotic therapy (mannitol, hypertonic saline), cerebral perfusion pressure management, seizure management, Guillain-Barré syndrome, myasthenia gravis crisis, and post-craniotomy care.
Questions test neuro-critical care reasoning with emphasis on time-sensitive interventions and neurological deterioration recognition.`,

  "Trauma ICU": `You are a senior Trauma ICU nursing exam item writer.
Focus on: primary/secondary survey, hemorrhagic shock, massive transfusion protocol, chest trauma, abdominal trauma, pelvic fractures, burn ICU care, compartment syndrome, damage control resuscitation, rhabdomyolysis, crush injuries, fat embolism syndrome, trauma coagulopathy, tension pneumothorax, flail chest, pulmonary contusion, and multi-organ dysfunction syndrome.
Questions test trauma critical care reasoning with emphasis on rapid assessment, hemorrhage control, and complication prevention.`,

  "PICU": `You are a senior Pediatric ICU (PICU) nursing exam item writer.
Focus on: pediatric respiratory failure, pediatric sepsis (age-specific criteria), status epilepticus in children, congenital heart disease post-op care, pediatric DKA, pediatric trauma, bronchiolitis requiring ICU, croup/epiglottitis, weight-based medication dosing, pediatric pain assessment (FLACC, Wong-Baker), pediatric hemodynamics, pediatric ventilation, fluid/electrolyte management in children, pediatric shock, and family-centered care.
Questions test pediatric critical care reasoning with age-specific vital sign ranges, weight-based calculations, and developmental considerations.`,

  "NICU": `You are a senior Neonatal ICU (NICU) nursing exam item writer.
Focus on: neonatal resuscitation (NRP), preterm infant care, respiratory distress syndrome, NEC, neonatal sepsis, hyperbilirubinemia/phototherapy, IVH grading, PDA management, ROP screening, thermoregulation, neonatal pain assessment (NIPS, CRIES), NICU pharmacology, developmental care/NIDCAP, neonatal abstinence syndrome (NAS), surfactant administration, TPN management, congenital anomalies, neonatal seizures, high-frequency ventilation, and NICU discharge planning.
Questions test neonatal critical care reasoning with emphasis on gestational age considerations, weight-based interventions, and developmental outcomes.`,
};

const CRITICAL_CARE_IMAGE_KEYWORDS: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "ventilator": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG & Ventilator Management", description: "Arterial blood gas interpretation for ventilator management" }],
  "intubation": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas values guide intubation decisions" }],
  "ards": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ARDS & ABG", description: "ABG interpretation in ARDS management" }],
  "sepsis": [{ file: "ABGreference", alt: "ABG reference chart", caption: "Sepsis ABG Changes", description: "Acid-base disturbances in sepsis" }],
  "cardiac arrest": [{ file: "heartfailure", alt: "Cardiac arrest illustration", caption: "Cardiac Arrest", description: "ACLS algorithms and post-arrest care" }],
  "cardiogenic shock": [{ file: "heartfailure", alt: "Heart failure illustration", caption: "Cardiogenic Shock", description: "Pump failure, hemodynamic support" }],
  "acute mi": [{ file: "heartfailure", alt: "MI illustration", caption: "Acute MI", description: "STEMI/NSTEMI management in CICU" }],
  "arrhythmia": [{ file: "heartfailure", alt: "Arrhythmia illustration", caption: "Cardiac Arrhythmias", description: "ECG recognition and ACLS management" }],
  "traumatic brain injury": [{ file: "stroke", alt: "TBI illustration", caption: "Traumatic Brain Injury", description: "ICP management, neuro assessment" }],
  "intracranial pressure": [{ file: "stroke", alt: "ICP illustration", caption: "ICP Monitoring", description: "Intracranial pressure management" }],
  "hemorrhagic shock": [{ file: "anemia", alt: "Hemorrhagic shock illustration", caption: "Hemorrhagic Shock", description: "Massive hemorrhage, transfusion protocols" }],
  "chest trauma": [{ file: "pneumonia", alt: "Chest trauma illustration", caption: "Chest Trauma", description: "Pneumothorax, hemothorax, flail chest" }],
  "burn": [{ file: "burns", alt: "Burns illustration", caption: "Burn ICU Care", description: "Burn classification, Parkland formula, escharotomy" }],
  "bronchiolitis": [{ file: "asthma", alt: "Bronchiolitis illustration", caption: "Bronchiolitis", description: "RSV bronchiolitis in PICU" }],
  "neonatal resuscitation": [{ file: "fetalmonitoring", alt: "NRP illustration", caption: "Neonatal Resuscitation", description: "NRP algorithm, APGAR scoring" }],
  "preterm": [{ file: "fetalmonitoring", alt: "Preterm care illustration", caption: "Preterm Infant Care", description: "Gestational age-specific care" }],
  "respiratory distress syndrome": [{ file: "ABGreference", alt: "RDS illustration", caption: "Neonatal RDS", description: "Surfactant deficiency in preterm infants" }],
};

const CRITICAL_CARE_LESSON_MAP: Record<string, { title: string; slug: string }> = {
  "mechanical ventilation": { title: "Mechanical Ventilation", slug: "mechanical-ventilation" },
  "hemodynamic monitoring": { title: "Hemodynamic Monitoring", slug: "hemodynamic-monitoring" },
  "vasopressor": { title: "Vasopressor Therapy", slug: "vasopressor-therapy" },
  "sepsis": { title: "Sepsis Management", slug: "sepsis-management" },
  "ards": { title: "ARDS Management", slug: "ards-management" },
  "sedation": { title: "ICU Sedation", slug: "icu-sedation" },
  "delirium": { title: "ICU Delirium", slug: "icu-delirium" },
  "central line": { title: "Central Line Care", slug: "central-line-care" },
  "arterial line": { title: "Arterial Line Monitoring", slug: "arterial-line" },
  "crrt": { title: "CRRT & Dialysis", slug: "crrt-dialysis" },
  "acute mi": { title: "Acute MI Management", slug: "acute-mi" },
  "cardiogenic shock": { title: "Cardiogenic Shock", slug: "cardiogenic-shock" },
  "arrhythmia": { title: "Arrhythmia Management", slug: "arrhythmia-management" },
  "iabp": { title: "IABP Nursing Care", slug: "iabp-care" },
  "cardiac tamponade": { title: "Cardiac Tamponade", slug: "cardiac-tamponade" },
  "cardiac surgery": { title: "Post-Cardiac Surgery Care", slug: "post-cardiac-surgery" },
  "traumatic brain injury": { title: "Traumatic Brain Injury", slug: "traumatic-brain-injury" },
  "intracranial pressure": { title: "ICP Management", slug: "icp-management" },
  "status epilepticus": { title: "Status Epilepticus", slug: "status-epilepticus" },
  "subarachnoid hemorrhage": { title: "SAH Management", slug: "sah-management" },
  "spinal cord injury": { title: "Spinal Cord Injury", slug: "spinal-cord-injury" },
  "hemorrhagic shock": { title: "Hemorrhagic Shock", slug: "hemorrhagic-shock" },
  "massive transfusion": { title: "Massive Transfusion Protocol", slug: "massive-transfusion" },
  "chest trauma": { title: "Chest Trauma", slug: "chest-trauma" },
  "compartment syndrome": { title: "Compartment Syndrome", slug: "compartment-syndrome" },
  "burn": { title: "Burn ICU Care", slug: "burn-care" },
  "pediatric respiratory": { title: "Pediatric Respiratory Failure", slug: "picu-respiratory" },
  "pediatric sepsis": { title: "Pediatric Sepsis", slug: "pediatric-sepsis" },
  "congenital heart": { title: "CHD Post-Op Care", slug: "chd-postop" },
  "pediatric dka": { title: "Pediatric DKA", slug: "pediatric-dka" },
  "neonatal resuscitation": { title: "Neonatal Resuscitation", slug: "neonatal-resuscitation" },
  "respiratory distress syndrome": { title: "Neonatal RDS", slug: "neonatal-rds" },
  "necrotizing enterocolitis": { title: "NEC Management", slug: "nec-management" },
  "neonatal sepsis": { title: "Neonatal Sepsis", slug: "neonatal-sepsis" },
  "hyperbilirubinemia": { title: "Neonatal Jaundice", slug: "neonatal-jaundice" },
};

interface CriticalCareSummary {
  subspecialty: string;
  targetCount: number;
  totalQuestionsInserted: number;
  totalFlashcardsCreated: number;
  totalImagesAttached: number;
  totalLessonLinksAdded: number;
  totalDuplicatesRejected: number;
  topicDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  startedAt: string;
  completedAt: string;
  batches: ExpansionProgress[];
}

function buildCriticalCarePrompt(
  subspecialty: string,
  topic: string,
  count: number,
  difficulties: string[],
  existingStems: string[],
): { system: string; user: string } {
  const scope = CRITICAL_CARE_SCOPE[subspecialty] || CRITICAL_CARE_SCOPE["ICU Nursing"];

  const diffCounts: Record<string, number> = {};
  for (const d of difficulties) diffCounts[d] = (diffCounts[d] || 0) + 1;

  const diffBlock = Object.entries(diffCounts)
    .map(([d, c]) => `- ${d}: ${c} questions`)
    .join("\n");

  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const system = `${scope}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no prose.
2. NEVER copy or reference instructions in any output field.
3. Every question must have a unique, distinct clinical scenario set in the ${subspecialty} environment.
4. Do NOT use any emoji characters. Plain text only.
5. Each question's rationale MUST be 80-150 words and include:
   - Why the correct answer is right
   - Why each distractor is wrong
   - A clinical application note
   - A nursing intervention note
6. Include a clinical pearl for each question.
7. All scenarios must reflect real clinical decision-making appropriate for ${subspecialty}.
8. Include specific patient data (vital signs, lab values, assessment findings) in each scenario.
9. Focus on NCLEX-style clinical judgment: assessment, prioritization, safety, interventions.

Topic focus for this batch: ${topic}

You will generate exactly ${count} questions for ${subspecialty} - ${topic}.

Difficulty distribution:
${diffBlock}

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object schema:
{
  "stem": "A detailed clinical scenario question set in the ${subspecialty} (min 60 chars)",
  "scenario": "Extended clinical context with specific patient data",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correct_answer": "B",
  "difficulty": "easy" | "moderate" | "hard",
  "domain": "Critical Care",
  "topic": "${topic}",
  "subtopic": "${subspecialty}",
  "rationale": "Detailed 80-150 word rationale: why correct + why each distractor wrong + clinical application + nursing intervention",
  "clinical_pearl": "A concise clinical pearl for exam prep",
  "body_system": "Related body system"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer letter.
${antiDupe}

Return EXACTLY ${count} items. JSON only. No extra text.`;

  const user = `Generate ${count} unique ${subspecialty} nursing exam questions focused on ${topic}. Each must have a distinct clinical scenario with specific patient vital signs, lab values, or assessment data relevant to the ${subspecialty} setting.`;

  return { system, user };
}

function matchCriticalCareImages(stem: string, rationale: string, topic: string, subspecialty: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] {
  const searchText = `${stem} ${rationale} ${topic} ${subspecialty}`.toLowerCase();
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] = [];

  for (const [keyword, images] of Object.entries(CRITICAL_CARE_IMAGE_KEYWORDS)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
          });
        }
      }
    }
  }

  for (const [keyword, images] of Object.entries(IMAGE_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
          });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

function findCriticalCareLessonLink(stem: string, rationale: string, topic: string, subspecialty: string): { title: string; url: string } | null {
  const searchText = `${stem} ${rationale} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(CRITICAL_CARE_LESSON_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-critical-care`,
      };
    }
  }

  for (const [keyword, lesson] of Object.entries(LESSON_TOPIC_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-critical-care`,
      };
    }
  }

  return null;
}

export async function runCriticalCareSubspecialty(
  subspecialty: string,
  targetCount: number = 500,
  onProgress?: (p: ExpansionProgress) => void,
): Promise<CriticalCareSummary> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[CriticalCare] Starting ${subspecialty} expansion: ${targetCount} questions, targeting ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"} database`);

  try {
    const testResult = await dbPool.query("SELECT 1 as connected");
    console.log(`[CriticalCare] Database connection verified: ${testResult.rows[0]?.connected === 1 ? "OK" : "FAILED"}`);
  } catch (connErr: any) {
    console.error(`[CriticalCare] Database connection FAILED:`, connErr.message);
    throw new Error(`Cannot connect to database: ${connErr.message}`);
  }

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const expansionTier = "rn";
  const topics = CRITICAL_CARE_TOPICS[subspecialty] || CRITICAL_CARE_TOPICS["ICU Nursing"];
  const startedAt = new Date().toISOString();
  const batches: ExpansionProgress[] = [];

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalImages = 0;
  let totalLessonLinks = 0;
  let totalDuplicates = 0;
  let batchNumber = 0;
  const recentStems: string[] = [];

  const topicCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};

  const perTopic = Math.floor(targetCount / topics.length);
  const remainder = targetCount % topics.length;
  const topicPlan: { topic: string; count: number }[] = topics.map((t, i) => ({
    topic: t,
    count: perTopic + (i < remainder ? 1 : 0),
  }));

  for (const { topic, count: topicTarget } of topicPlan) {
    let topicRemaining = topicTarget;

    while (topicRemaining > 0) {
      const thisBatchSize = Math.min(BATCH_SIZE, topicRemaining);
      batchNumber++;

      console.log(`[CriticalCare] Batch ${batchNumber}: ${thisBatchSize} questions for ${subspecialty} - ${topic}`);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `critical-care-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
            "critical_care_batch_start",
            JSON.stringify({ subspecialty, batchNumber, topic, batchSize: thisBatchSize, totalInserted }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[CriticalCare] Event log error:`, logErr.message);
      }

      const difficulties: string[] = [];
      for (let i = 0; i < thisBatchSize; i++) {
        difficulties.push(assignDifficulty(i, thisBatchSize));
      }

      const { system, user } = buildCriticalCarePrompt(subspecialty, topic, thisBatchSize, difficulties, recentStems);

      let items: any[] = [];
      for (let attempt = 0; attempt <= 2; attempt++) {
        try {
          const resp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.4,
            max_tokens: Math.min(thisBatchSize * 700 + 500, 16384),
            response_format: { type: "json_object" },
          });

          const content = resp.choices[0]?.message?.content || "{}";
          let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
          }

          const parsed = JSON.parse(cleaned);
          items = Array.isArray(parsed.items) ? parsed.items
            : Array.isArray(parsed.questions) ? parsed.questions
            : Array.isArray(parsed) ? parsed : [];

          if (items.length > 0) break;
          console.log(`[CriticalCare] Attempt ${attempt + 1}: 0 items parsed for ${topic}, retrying...`);
        } catch (err: any) {
          console.error(`[CriticalCare] Attempt ${attempt + 1} failed for ${topic}:`, err.message);
        }
        if (attempt < 2) await new Promise(r => setTimeout(r, 1500));
      }

      let batchInserted = 0;
      let batchFlashcards = 0;
      let batchImages = 0;
      let batchLessonLinks = 0;
      let batchDuplicates = 0;

      for (const item of items) {
        if (!validateQuestion(item)) continue;

        const stemHash = computeStemHash(item.stem);
        if (existingHashes.has(stemHash)) {
          batchDuplicates++;
          continue;
        }

        const dupCheck = await checkDuplicateStem(item.stem, expansionTier);
        if (dupCheck.isDuplicate) {
          batchDuplicates++;
          continue;
        }

        const difficulty = item.difficulty || "moderate";
        const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
        const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
        const lessonLink = findCriticalCareLessonLink(item.stem, item.rationale, item.topic || topic, subspecialty);
        const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
        const images = matchCriticalCareImages(item.stem, item.rationale, item.topic || topic, subspecialty);

        const options = Array.isArray(item.options) ? item.options.map((o: any, i: number) => {
          if (typeof o === "string") {
            const match = o.match(/^([A-H])\)\s*(.+)/);
            if (match) return { label: match[1], text: match[2] };
            return { label: String.fromCharCode(65 + i), text: o };
          }
          return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
        }) : [];

        const correctAnswer = typeof item.correct_answer === "string" ? item.correct_answer : "A";

        const client = await dbPool.connect();
        try {
          await client.query("BEGIN");

          const tagsArray = ["Critical Care", subspecialty, topic, masteryCategory, `difficulty_${difficulty}`];

          const { rows: inserted } = await client.query(
            `INSERT INTO exam_questions (
              id, tier, exam, question_type, status, stem, options, correct_answer,
              rationale, difficulty, tags, body_system, topic, subtopic, region_scope,
              stem_hash, career_type, scenario, clinical_pearl, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10::text[], $11, $12, $13, $14,
              $15, $16, $17, $18, NOW(), NOW()
            ) ON CONFLICT DO NOTHING RETURNING id`,
            [
              "rn",
              "CCRN",
              "multiple_choice",
              "approved",
              item.stem,
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              rationaleWithLink,
              difficultyNum,
              tagsArray,
              item.body_system || "Critical Care",
              item.topic || topic,
              subspecialty,
              "BOTH",
              stemHash,
              "nursing",
              item.scenario || item.stem,
              item.clinical_pearl || "",
            ]
          );

          if (!inserted || inserted.length === 0) {
            await client.query("ROLLBACK");
            batchDuplicates++;
            client.release();
            continue;
          }

          const questionId = inserted[0].id;
          existingHashes.add(stemHash);
          batchInserted++;
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
          recentStems.push(item.stem.substring(0, 100));
          if (recentStems.length > 30) recentStems.splice(0, recentStems.length - 20);

          if (lessonLink) batchLessonLinks++;
          if (images.length > 0) batchImages++;

          const flashcardFront = item.stem;
          const flashcardBack = buildFlashcardBack(
            correctAnswer, options, item.rationale, item.clinical_pearl || "", lessonLink,
          );
          const flashcardHash = computeContentHash(item.stem, `critical-care-${subspecialty}`);

          const lessonLinks = lessonLink ? [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url, relevanceNote: `Related to ${subspecialty} - ${topic}` }] : [];

          const { rowCount: fcInserted } = await client.query(
            `INSERT INTO flashcard_bank (
              id, tier, front, back, content_hash, status, source_type, source_question_id,
              question_type, options, correct_answer, rationale_correct,
              clinical_takeaway, exam_pearl, rationale_media, lesson_links,
              difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
              category, career_type, created_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13, $14, $15,
              $16, $17, $18, $19, $20, $21, $22, $23, NOW()
            ) ON CONFLICT (content_hash) DO NOTHING`,
            [
              "rn",
              flashcardFront,
              flashcardBack,
              flashcardHash,
              "approved",
              "critical_care_expansion",
              questionId,
              "multiple_choice",
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              item.rationale,
              item.clinical_pearl || null,
              item.clinical_pearl || null,
              JSON.stringify(images),
              JSON.stringify(lessonLinks),
              difficultyNum,
              item.body_system || "Critical Care",
              item.topic || topic,
              subspecialty,
              "BOTH",
              true,
              `Critical Care - ${subspecialty}`,
              "nursing",
            ]
          );

          await client.query("COMMIT");
          if (fcInserted && fcInserted > 0) batchFlashcards++;
        } catch (err: any) {
          await client.query("ROLLBACK").catch(() => {});
          if (err.code === "23505") {
            batchDuplicates++;
          } else {
            console.error(`[CriticalCare] Insert error:`, err.message);
          }
        } finally {
          client.release();
        }
      }

      totalInserted += batchInserted;
      totalFlashcards += batchFlashcards;
      totalImages += batchImages;
      totalLessonLinks += batchLessonLinks;
      totalDuplicates += batchDuplicates;
      topicRemaining -= batchInserted > 0 ? batchInserted : thisBatchSize;

      const progress: ExpansionProgress = {
        tier: `critical-care-${subspecialty}`,
        batchNumber,
        questionsGenerated: batchInserted,
        flashcardsCreated: batchFlashcards,
        imagesAttached: batchImages,
        lessonLinksAdded: batchLessonLinks,
        duplicatesRejected: batchDuplicates,
      };
      batches.push(progress);

      if (onProgress) onProgress(progress);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `critical-care-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
            "critical_care_batch_complete",
            JSON.stringify({
              ...progress,
              totalInserted,
              totalFlashcards,
              totalImages,
              totalLessonLinks,
              totalDuplicates,
            }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[CriticalCare] Event log error:`, logErr.message);
      }

      console.log(`[CriticalCare] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards, ${batchImages} images, ${batchLessonLinks} lessons, ${batchDuplicates} duplicates. Total: ${totalInserted}/${targetCount}`);

      await new Promise(r => setTimeout(r, 500));
    }
  }

  const completedAt = new Date().toISOString();

  const summary: CriticalCareSummary = {
    subspecialty,
    targetCount,
    totalQuestionsInserted: totalInserted,
    totalFlashcardsCreated: totalFlashcards,
    totalImagesAttached: totalImages,
    totalLessonLinksAdded: totalLessonLinks,
    totalDuplicatesRejected: totalDuplicates,
    topicDistribution: topicCounts,
    difficultyDistribution: difficultyCounts,
    startedAt,
    completedAt,
    batches,
  };

  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        `critical-care-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
        "critical_care_subspecialty_complete",
        JSON.stringify(summary),
      ]
    );
  } catch (logErr: any) {
    console.error(`[CriticalCare] Event log error:`, logErr.message);
  }

  console.log(`[CriticalCare] ${subspecialty} complete: ${totalInserted}/${targetCount} questions, ${totalFlashcards} flashcards`);
  return summary;
}

export async function runFullCriticalCareExpansion(
  onProgress?: (p: ExpansionProgress) => void,
): Promise<{ subspecialties: Record<string, CriticalCareSummary>; grandTotal: any }> {
  console.log(`[CriticalCare] Starting full 3,000-question Critical Care expansion across 6 subspecialties`);

  const results: Record<string, CriticalCareSummary> = {};

  for (const subspecialty of CRITICAL_CARE_SUBSPECIALTIES) {
    results[subspecialty] = await runCriticalCareSubspecialty(subspecialty, 500, onProgress);
  }

  const grandTotal = {
    totalQuestions: Object.values(results).reduce((s, r) => s + r.totalQuestionsInserted, 0),
    totalFlashcards: Object.values(results).reduce((s, r) => s + r.totalFlashcardsCreated, 0),
    totalImages: Object.values(results).reduce((s, r) => s + r.totalImagesAttached, 0),
    totalLessonLinks: Object.values(results).reduce((s, r) => s + r.totalLessonLinksAdded, 0),
    totalDuplicates: Object.values(results).reduce((s, r) => s + r.totalDuplicatesRejected, 0),
    target: 3000,
    subspecialtyBreakdown: Object.fromEntries(
      Object.entries(results).map(([k, v]) => [k, { questions: v.totalQuestionsInserted, flashcards: v.totalFlashcardsCreated }])
    ),
  };

  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;
  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        "critical-care-full",
        "critical_care_full_expansion_complete",
        JSON.stringify({ subspecialties: results, grandTotal }),
      ]
    );
  } catch (logErr: any) {
    console.error(`[CriticalCare] Event log error:`, logErr.message);
  }

  console.log(`[CriticalCare] Full expansion complete: ${grandTotal.totalQuestions}/3000 questions, ${grandTotal.totalFlashcards} flashcards`);
  return { subspecialties: results, grandTotal };
}

export async function getCriticalCareExpansionStatus(): Promise<any> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  const { rows: events } = await dbPool.query(
    `SELECT event_type, payload, created_at
     FROM generation_events
     WHERE generation_id LIKE 'critical-care-%'
     ORDER BY created_at DESC
     LIMIT 50`
  );

  const { rows: questionCounts } = await dbPool.query(
    `SELECT subtopic as subspecialty, COUNT(*)::int as count
     FROM exam_questions
     WHERE exam = 'CCRN' AND status = 'approved' AND career_type = 'nursing'
     GROUP BY subtopic`
  );

  const { rows: flashcardCounts } = await dbPool.query(
    `SELECT subtopic as subspecialty, COUNT(*)::int as count
     FROM flashcard_bank
     WHERE source_type = 'critical_care_expansion'
     GROUP BY subtopic`
  );

  return {
    questionsBySubspecialty: Object.fromEntries(questionCounts.map((r: any) => [r.subspecialty, r.count])),
    flashcardsBySubspecialty: Object.fromEntries(flashcardCounts.map((r: any) => [r.subspecialty, r.count])),
    totalQuestions: questionCounts.reduce((s: number, r: any) => s + r.count, 0),
    totalFlashcards: flashcardCounts.reduce((s: number, r: any) => s + r.count, 0),
    recentEvents: events,
    validSubspecialties: [...CRITICAL_CARE_SUBSPECIALTIES],
  };
}

export async function getExpansionStatus(): Promise<any> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  const { rows: events } = await dbPool.query(
    `SELECT event_type, payload, created_at
     FROM generation_events
     WHERE generation_id LIKE 'expansion-%'
     ORDER BY created_at DESC
     LIMIT 50`
  );

  const { rows: questionCounts } = await dbPool.query(
    `SELECT tier, COUNT(*)::int as count
     FROM exam_questions
     WHERE status = 'approved' AND career_type = 'nursing'
     GROUP BY tier`
  );

  const { rows: flashcardCounts } = await dbPool.query(
    `SELECT tier, COUNT(*)::int as count
     FROM flashcard_bank
     WHERE source_type = 'expansion_engine'
     GROUP BY tier`
  );

  return {
    questionsByTier: Object.fromEntries(questionCounts.map((r: any) => [r.tier, r.count])),
    expansionFlashcardsByTier: Object.fromEntries(flashcardCounts.map((r: any) => [r.tier, r.count])),
    recentEvents: events,
  };
}

const PROCEDURAL_SURGICAL_SUBSPECIALTIES = [
  "Perioperative Nursing",
  "Operating Room Nursing",
  "PACU Nursing",
  "Cath Lab Nursing",
  "Interventional Radiology Nursing",
  "Endoscopy Nursing",
] as const;

const PROCEDURAL_SURGICAL_TOPICS: Record<string, string[]> = {
  "Perioperative Nursing": [
    "Preoperative Assessment & Planning", "Informed Consent & Patient Education",
    "Preoperative Medication Management", "NPO Guidelines & Aspiration Risk",
    "Surgical Site Preparation", "Perioperative Hypothermia Prevention",
    "Venous Thromboembolism Prophylaxis", "Perioperative Antibiotic Administration",
    "Preoperative Lab Interpretation", "Perioperative Diabetic Management",
    "Perioperative Anxiety & Comfort Measures", "Surgical Safety Checklist & Time-Out",
    "Perioperative Blood Product Management", "Latex Allergy & Sensitivity Protocols",
    "Perioperative Documentation Standards", "Patient Positioning Principles",
    "Perioperative Fluid Management", "Malignant Hyperthermia Recognition",
    "Enhanced Recovery After Surgery (ERAS)", "Perioperative Pain Management Planning",
  ],
  "Operating Room Nursing": [
    "Sterile Technique & Aseptic Practice", "Surgical Scrubbing & Gowning",
    "Surgical Instrument Identification", "Sponge, Sharps & Instrument Counts",
    "Electrosurgery Safety (Bovie)", "Specimen Handling & Labeling",
    "OR Fire Prevention & Safety", "Patient Positioning in Surgery",
    "Surgical Draping Techniques", "Circulating Nurse Responsibilities",
    "Scrub Nurse Role & Duties", "Intraoperative Monitoring",
    "Blood Loss Estimation", "Surgical Wound Classification",
    "Laser Safety in the OR", "Robotic Surgery Nursing",
    "Implant & Prosthesis Handling", "OR Traffic & Environmental Controls",
    "Emergency Surgical Situations", "Intraoperative Complications Management",
  ],
  "PACU Nursing": [
    "Post-Anesthesia Assessment (Aldrete Score)", "Airway Management Post-Anesthesia",
    "Emergence Delirium & Agitation", "Post-Operative Nausea & Vomiting (PONV)",
    "PACU Pain Management", "Hypothermia Rewarming in PACU",
    "Post-Spinal Anesthesia Care", "Respiratory Depression Recognition",
    "Hemodynamic Instability Post-Op", "Regional Anesthesia Complications",
    "Discharge Criteria (Modified Aldrete)", "Post-Operative Hemorrhage Detection",
    "Laryngospasm Management", "Bronchospasm Post-Extubation",
    "PACU Fluid & Electrolyte Management", "Post-Operative Urinary Retention",
    "Conscious Sedation Recovery", "Phase I vs Phase II PACU Care",
    "PACU Handoff Communication (SBAR)", "Anaphylaxis in PACU",
  ],
  "Cath Lab Nursing": [
    "Cardiac Catheterization Procedure", "Pre-Cath Lab Assessment",
    "Arterial & Venous Access Management", "Hemodynamic Monitoring in Cath Lab",
    "Contrast Media Administration & Reactions", "Percutaneous Coronary Intervention (PCI)",
    "Post-PCI Nursing Care", "Sheath Removal & Hemostasis",
    "Vascular Closure Device Management", "Coronary Stent Types & Antiplatelet Therapy",
    "Intra-Aortic Balloon Pump (IABP)", "Electrophysiology Studies",
    "Pacemaker & ICD Implantation", "Radiation Safety in Cath Lab",
    "Cath Lab Emergency Protocols", "Conscious Sedation in Cath Lab",
    "ST-Elevation MI Door-to-Balloon Time", "Right Heart Catheterization",
    "Structural Heart Procedures (TAVR)", "Post-Cath Lab Complication Management",
  ],
  "Interventional Radiology Nursing": [
    "IR Procedure Overview & Patient Prep", "Conscious Sedation for IR Procedures",
    "Vascular Access & Catheter Management", "Embolization Procedures",
    "Angiography & Angioplasty Nursing", "IR Drain & Tube Management",
    "Biopsy Procedure Nursing Care", "Contrast-Induced Nephropathy Prevention",
    "Radiation Protection & Monitoring", "PICC Line & Port Placement",
    "Thrombolysis & Thrombectomy Nursing", "Transjugular Intrahepatic Portosystemic Shunt (TIPS)",
    "Inferior Vena Cava (IVC) Filter Placement", "Nephrostomy Tube Care",
    "Biliary Drainage Procedures", "Uterine Fibroid Embolization",
    "Radiofrequency Ablation Nursing", "Post-IR Complication Assessment",
    "IR Emergency Management", "Patient Education for IR Procedures",
  ],
  "Endoscopy Nursing": [
    "Upper GI Endoscopy (EGD) Nursing", "Colonoscopy Preparation & Nursing",
    "ERCP Procedure Nursing", "Endoscopic Ultrasound (EUS)",
    "Bronchoscopy Nursing Care", "Endoscopic Sedation & Monitoring",
    "Scope Reprocessing & Infection Control", "Biopsy & Polypectomy Nursing",
    "Endoscopic Hemostasis", "Post-Endoscopy Assessment & Complications",
    "Capsule Endoscopy Patient Education", "Endoscopic Retrograde Cholangiopancreatography",
    "Stent Placement (GI/Biliary)", "Endoscopic Mucosal Resection",
    "Pediatric Endoscopy Considerations", "Patient Positioning for Endoscopy",
    "Endoscopy Unit Safety Protocols", "Adverse Event Recognition & Management",
    "Moderate Sedation Monitoring", "Endoscopy Documentation Standards",
  ],
};

const PROCEDURAL_SURGICAL_SCOPE: Record<string, string> = {
  "Perioperative Nursing": `You are a senior Certified Perioperative Nurse (CNOR) exam item writer specializing in perioperative nursing across the surgical continuum.
Focus on: preoperative assessment, surgical safety checklists, informed consent, NPO guidelines, preoperative medication management, perioperative hypothermia prevention, VTE prophylaxis, surgical site infection prevention, perioperative antibiotic timing, patient positioning, malignant hyperthermia recognition, ERAS protocols, perioperative diabetic management, latex allergy protocols, and perioperative documentation.
Questions test clinical judgment in the perioperative setting with emphasis on patient safety, evidence-based preoperative preparation, and continuity of surgical care.`,

  "Operating Room Nursing": `You are a senior Operating Room nursing exam item writer specializing in intraoperative care.
Focus on: sterile technique, aseptic practice, surgical scrubbing/gowning/gloving, surgical instrument identification, sponge/sharps/instrument counts, electrosurgery safety, specimen handling, OR fire prevention, patient positioning, circulating nurse responsibilities, scrub nurse duties, intraoperative monitoring, blood loss estimation, surgical wound classification, laser safety, robotic surgery, implant handling, and emergency intraoperative situations.
Questions test critical thinking in the operating room environment with emphasis on sterile field maintenance, patient safety, and surgical team communication.`,

  "PACU Nursing": `You are a senior Post-Anesthesia Care Unit (PACU) nursing exam item writer specializing in post-anesthesia recovery.
Focus on: Aldrete scoring, airway management post-anesthesia, emergence delirium, PONV management, post-operative pain assessment, hypothermia rewarming, post-spinal anesthesia care, respiratory depression recognition, hemodynamic instability, regional anesthesia complications, discharge criteria, post-operative hemorrhage detection, laryngospasm, bronchospasm, fluid management, urinary retention, conscious sedation recovery, Phase I vs Phase II care, SBAR handoff, and anaphylaxis.
Questions test rapid assessment and intervention skills in the post-anesthesia recovery setting with emphasis on airway protection, hemodynamic stability, and safe discharge.`,

  "Cath Lab Nursing": `You are a senior Cardiac Catheterization Laboratory nursing exam item writer.
Focus on: cardiac catheterization procedures, pre-procedure assessment, arterial/venous access, hemodynamic monitoring, contrast media reactions, PCI nursing care, sheath removal/hemostasis, vascular closure devices, coronary stent management, antiplatelet therapy, IABP care, electrophysiology studies, pacemaker/ICD implantation, radiation safety, cath lab emergencies, conscious sedation, door-to-balloon time, right heart catheterization, structural heart procedures (TAVR), and post-procedure complications.
Questions test specialized cardiac procedural knowledge with emphasis on hemodynamic interpretation, vascular access management, and rapid recognition of complications.`,

  "Interventional Radiology Nursing": `You are a senior Interventional Radiology (IR) nursing exam item writer.
Focus on: IR procedure preparation, conscious sedation, vascular access management, embolization nursing, angiography/angioplasty care, IR drain management, biopsy nursing, contrast-induced nephropathy prevention, radiation protection, PICC/port placement, thrombolysis/thrombectomy care, TIPS procedures, IVC filter placement, nephrostomy care, biliary drainage, uterine fibroid embolization, radiofrequency ablation, post-IR complications, IR emergencies, and patient education.
Questions test clinical reasoning in the IR suite with emphasis on procedural sedation management, radiation safety, contrast reaction protocols, and post-procedure assessment.`,

  "Endoscopy Nursing": `You are a senior Endoscopy nursing exam item writer specializing in GI and bronchoscopy procedures.
Focus on: EGD nursing, colonoscopy preparation, ERCP nursing, endoscopic ultrasound, bronchoscopy care, endoscopic sedation monitoring, scope reprocessing/infection control, biopsy/polypectomy care, endoscopic hemostasis, post-endoscopy complications, capsule endoscopy, stent placement, endoscopic mucosal resection, pediatric endoscopy, patient positioning, unit safety protocols, adverse event recognition, moderate sedation monitoring, and documentation standards.
Questions test procedural nursing knowledge with emphasis on sedation monitoring, scope reprocessing standards, complication recognition, and patient safety in the endoscopy suite.`,
};

const PROCEDURAL_SURGICAL_IMAGE_KEYWORDS: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "malignant hyperthermia": [{ file: "ABGreference", alt: "ABG reference chart", caption: "Malignant Hyperthermia & ABG", description: "Metabolic acidosis and hypercarbia in malignant hyperthermia" }],
  "anesthesia": [{ file: "ABGreference", alt: "ABG reference chart", caption: "Anesthesia & ABG", description: "ABG interpretation during anesthesia management" }],
  "cardiac catheterization": [{ file: "heartfailure", alt: "Cardiac catheterization illustration", caption: "Cardiac Catheterization", description: "Coronary anatomy and catheterization procedures" }],
  "pci": [{ file: "heartfailure", alt: "PCI illustration", caption: "Percutaneous Coronary Intervention", description: "Coronary stenting and balloon angioplasty" }],
  "stemi": [{ file: "heartfailure", alt: "STEMI illustration", caption: "ST-Elevation MI", description: "Door-to-balloon time and acute MI management" }],
  "iabp": [{ file: "heartfailure", alt: "IABP illustration", caption: "Intra-Aortic Balloon Pump", description: "Counterpulsation therapy and timing" }],
  "pacemaker": [{ file: "heartfailure", alt: "Pacemaker illustration", caption: "Pacemaker Implantation", description: "Pacemaker types and nursing care" }],
  "hemorrhage": [{ file: "anemia", alt: "Hemorrhage illustration", caption: "Post-Procedural Hemorrhage", description: "Hemorrhage recognition and management" }],
  "airway": [{ file: "ABGreference", alt: "Airway management illustration", caption: "Airway Management", description: "Post-anesthesia airway assessment and interventions" }],
  "respiratory depression": [{ file: "ABGreference", alt: "Respiratory depression illustration", caption: "Respiratory Depression", description: "Opioid and anesthesia-related respiratory depression" }],
  "contrast": [{ file: "anemia", alt: "Contrast reaction illustration", caption: "Contrast Reactions", description: "Contrast-induced nephropathy and anaphylaxis" }],
  "dvt": [{ file: "dvt", alt: "DVT illustration", caption: "VTE Prophylaxis", description: "Perioperative DVT prevention strategies" }],
  "pulmonary embolism": [{ file: "pe", alt: "Pulmonary embolism illustration", caption: "Pulmonary Embolism", description: "Post-operative PE recognition and management" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration", caption: "Post-ERCP Pancreatitis", description: "ERCP-related pancreatitis complication" }],
  "electrosurgery": [{ file: "burns", alt: "Electrosurgery safety illustration", caption: "Electrosurgery Safety", description: "Bovie safety, grounding pad placement, fire risk" }],
  "burn": [{ file: "burns", alt: "OR fire illustration", caption: "OR Fire Safety", description: "Surgical fire prevention and response" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome illustration", caption: "Compartment Syndrome", description: "Post-surgical compartment syndrome assessment" }],
};

const PROCEDURAL_SURGICAL_LESSON_MAP: Record<string, { title: string; slug: string }> = {
  "preoperative assessment": { title: "Preoperative Assessment", slug: "preoperative-assessment" },
  "informed consent": { title: "Informed Consent", slug: "informed-consent-perioperative" },
  "sterile technique": { title: "Sterile Technique", slug: "sterile-technique" },
  "surgical safety": { title: "Surgical Safety Checklist", slug: "surgical-safety-checklist" },
  "patient positioning": { title: "Patient Positioning", slug: "surgical-positioning" },
  "malignant hyperthermia": { title: "Malignant Hyperthermia", slug: "malignant-hyperthermia" },
  "hypothermia": { title: "Perioperative Hypothermia", slug: "perioperative-hypothermia" },
  "anesthesia": { title: "Anesthesia Types & Nursing", slug: "anesthesia-nursing" },
  "aldrete": { title: "Aldrete Scoring", slug: "aldrete-score" },
  "emergence delirium": { title: "Emergence Delirium", slug: "emergence-delirium" },
  "ponv": { title: "PONV Management", slug: "ponv-management" },
  "nausea": { title: "PONV Management", slug: "ponv-management" },
  "laryngospasm": { title: "Laryngospasm Management", slug: "laryngospasm" },
  "airway": { title: "Post-Anesthesia Airway", slug: "pacu-airway" },
  "cardiac catheterization": { title: "Cardiac Catheterization", slug: "cardiac-catheterization" },
  "pci": { title: "PCI Nursing Care", slug: "pci-nursing" },
  "sheath removal": { title: "Sheath Removal & Hemostasis", slug: "sheath-removal" },
  "contrast": { title: "Contrast Media Safety", slug: "contrast-safety" },
  "radiation safety": { title: "Radiation Safety", slug: "radiation-safety" },
  "embolization": { title: "Embolization Procedures", slug: "embolization-nursing" },
  "picc": { title: "PICC Line Placement", slug: "picc-placement" },
  "nephrostomy": { title: "Nephrostomy Care", slug: "nephrostomy-care" },
  "scope reprocessing": { title: "Scope Reprocessing", slug: "scope-reprocessing" },
  "endoscopy": { title: "Endoscopy Nursing", slug: "endoscopy-nursing" },
  "colonoscopy": { title: "Colonoscopy Nursing", slug: "colonoscopy-nursing" },
  "ercp": { title: "ERCP Nursing", slug: "ercp-nursing" },
  "bronchoscopy": { title: "Bronchoscopy Nursing", slug: "bronchoscopy-nursing" },
  "sedation": { title: "Procedural Sedation", slug: "procedural-sedation" },
  "electrosurgery": { title: "Electrosurgery Safety", slug: "electrosurgery-safety" },
  "instrument count": { title: "Surgical Counts", slug: "surgical-counts" },
  "specimen": { title: "Specimen Handling", slug: "specimen-handling" },
  "eras": { title: "ERAS Protocols", slug: "eras-protocols" },
  "vte": { title: "VTE Prophylaxis", slug: "vte-prophylaxis-periop" },
  "dvt": { title: "DVT Prevention", slug: "dvt-prevention-periop" },
  "hemorrhage": { title: "Post-Operative Hemorrhage", slug: "post-op-hemorrhage" },
  "pain management": { title: "Perioperative Pain Management", slug: "perioperative-pain" },
};

interface ProceduralSurgicalSummary {
  subspecialty: string;
  targetCount: number;
  totalQuestionsInserted: number;
  totalFlashcardsCreated: number;
  totalImagesAttached: number;
  totalLessonLinksAdded: number;
  totalDuplicatesRejected: number;
  topicDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  startedAt: string;
  completedAt: string;
  batches: ExpansionProgress[];
}

function buildProceduralSurgicalPrompt(
  subspecialty: string,
  topic: string,
  count: number,
  difficulties: string[],
  existingStems: string[],
): { system: string; user: string } {
  const scope = PROCEDURAL_SURGICAL_SCOPE[subspecialty] || PROCEDURAL_SURGICAL_SCOPE["Perioperative Nursing"];

  const diffCounts: Record<string, number> = {};
  for (const d of difficulties) diffCounts[d] = (diffCounts[d] || 0) + 1;

  const diffBlock = Object.entries(diffCounts)
    .map(([d, c]) => `- ${d}: ${c} questions`)
    .join("\n");

  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const system = `${scope}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no prose.
2. NEVER copy or reference instructions in any output field.
3. Every question must have a unique, distinct clinical scenario set in the ${subspecialty} environment.
4. Do NOT use any emoji characters. Plain text only.
5. Each question's rationale MUST be 80-150 words and include:
   - Why the correct answer is right
   - Why each distractor is wrong
   - A clinical application note
   - A nursing intervention note
6. Include a clinical pearl for each question.
7. All scenarios must reflect real clinical decision-making appropriate for ${subspecialty}.
8. Include specific patient data (vital signs, lab values, assessment findings) in each scenario.
9. Focus on NCLEX-style clinical judgment: assessment, prioritization, safety, interventions.
10. Cover sterile technique, anesthesia considerations, procedural sedation, patient positioning, recovery protocols, and safety as applicable.

Topic focus for this batch: ${topic}

You will generate exactly ${count} questions for ${subspecialty} - ${topic}.

Difficulty distribution:
${diffBlock}

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object schema:
{
  "stem": "A detailed clinical scenario question set in the ${subspecialty} (min 60 chars)",
  "scenario": "Extended clinical context with specific patient data",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correct_answer": "B",
  "difficulty": "easy" | "moderate" | "hard",
  "domain": "Procedural/Surgical",
  "topic": "${topic}",
  "subtopic": "${subspecialty}",
  "rationale": "Detailed 80-150 word rationale: why correct + why each distractor wrong + clinical application + nursing intervention",
  "clinical_pearl": "A concise clinical pearl for exam prep",
  "body_system": "Related body system"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer letter.
${antiDupe}

Return EXACTLY ${count} items. JSON only. No extra text.`;

  const user = `Generate ${count} unique ${subspecialty} exam questions focused on ${topic}. Each must have a distinct clinical scenario with specific patient vital signs, lab values, or assessment data relevant to the ${subspecialty} setting.`;

  return { system, user };
}

function matchProceduralSurgicalImages(stem: string, rationale: string, topic: string, subspecialty: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] {
  const searchText = `${stem} ${rationale} ${topic} ${subspecialty}`.toLowerCase();
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] = [];

  for (const [keyword, images] of Object.entries(PROCEDURAL_SURGICAL_IMAGE_KEYWORDS)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
          });
        }
      }
    }
  }

  for (const [keyword, images] of Object.entries(IMAGE_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
          });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

function findProceduralSurgicalLessonLink(stem: string, rationale: string, topic: string, subspecialty: string): { title: string; url: string } | null {
  const searchText = `${stem} ${rationale} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(PROCEDURAL_SURGICAL_LESSON_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-procedural-surgical`,
      };
    }
  }

  for (const [keyword, lesson] of Object.entries(LESSON_TOPIC_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-procedural-surgical`,
      };
    }
  }

  return null;
}

export async function runProceduralSurgicalSubspecialty(
  subspecialty: string,
  targetCount: number = 500,
  onProgress?: (p: ExpansionProgress) => void,
): Promise<ProceduralSurgicalSummary> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[ProceduralSurgical] Starting ${subspecialty} expansion: ${targetCount} questions, targeting ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"} database`);

  try {
    const testResult = await dbPool.query("SELECT 1 as connected");
    console.log(`[ProceduralSurgical] Database connection verified: ${testResult.rows[0]?.connected === 1 ? "OK" : "FAILED"}`);
  } catch (connErr: any) {
    console.error(`[ProceduralSurgical] Database connection FAILED:`, connErr.message);
    throw new Error(`Cannot connect to database: ${connErr.message}`);
  }

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const expansionTier = "rn";
  const topics = PROCEDURAL_SURGICAL_TOPICS[subspecialty] || PROCEDURAL_SURGICAL_TOPICS["Perioperative Nursing"];
  const startedAt = new Date().toISOString();
  const batches: ExpansionProgress[] = [];

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalImages = 0;
  let totalLessonLinks = 0;
  let totalDuplicates = 0;
  let batchNumber = 0;
  const recentStems: string[] = [];

  const topicCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};

  const perTopic = Math.floor(targetCount / topics.length);
  const remainder = targetCount % topics.length;
  const topicPlan: { topic: string; count: number }[] = topics.map((t, i) => ({
    topic: t,
    count: perTopic + (i < remainder ? 1 : 0),
  }));

  for (const { topic, count: topicTarget } of topicPlan) {
    let topicRemaining = topicTarget;

    while (topicRemaining > 0) {
      const thisBatchSize = Math.min(BATCH_SIZE, topicRemaining);
      batchNumber++;

      console.log(`[ProceduralSurgical] Batch ${batchNumber}: ${thisBatchSize} questions for ${subspecialty} - ${topic}`);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `procedural-surgical-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
            "procedural_surgical_batch_start",
            JSON.stringify({ subspecialty, batchNumber, topic, batchSize: thisBatchSize, totalInserted }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[ProceduralSurgical] Event log error:`, logErr.message);
      }

      const difficulties: string[] = [];
      for (let i = 0; i < thisBatchSize; i++) {
        difficulties.push(assignDifficulty(i, thisBatchSize));
      }

      const { system, user } = buildProceduralSurgicalPrompt(subspecialty, topic, thisBatchSize, difficulties, recentStems);

      let items: any[] = [];
      for (let attempt = 0; attempt <= 2; attempt++) {
        try {
          const resp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.4,
            max_tokens: Math.min(thisBatchSize * 700 + 500, 16384),
            response_format: { type: "json_object" },
          });

          const content = resp.choices[0]?.message?.content || "{}";
          let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
          }

          const parsed = JSON.parse(cleaned);
          items = Array.isArray(parsed.items) ? parsed.items
            : Array.isArray(parsed.questions) ? parsed.questions
            : Array.isArray(parsed) ? parsed : [];

          if (items.length > 0) break;
          console.log(`[ProceduralSurgical] Attempt ${attempt + 1}: 0 items parsed for ${topic}, retrying...`);
        } catch (err: any) {
          console.error(`[ProceduralSurgical] Attempt ${attempt + 1} failed for ${topic}:`, err.message);
        }
        if (attempt < 2) await new Promise(r => setTimeout(r, 1500));
      }

      let batchInserted = 0;
      let batchFlashcards = 0;
      let batchImages = 0;
      let batchLessonLinks = 0;
      let batchDuplicates = 0;

      for (const item of items) {
        if (!validateQuestion(item)) continue;

        const stemHash = computeStemHash(item.stem);
        if (existingHashes.has(stemHash)) {
          batchDuplicates++;
          continue;
        }

        const dupCheck = await checkDuplicateStem(item.stem, expansionTier);
        if (dupCheck.isDuplicate) {
          batchDuplicates++;
          continue;
        }

        const difficulty = item.difficulty || "moderate";
        const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
        const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
        const lessonLink = findProceduralSurgicalLessonLink(item.stem, item.rationale, item.topic || topic, subspecialty);
        const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
        const images = matchProceduralSurgicalImages(item.stem, item.rationale, item.topic || topic, subspecialty);

        const options = Array.isArray(item.options) ? item.options.map((o: any, i: number) => {
          if (typeof o === "string") {
            const match = o.match(/^([A-H])\)\s*(.+)/);
            if (match) return { label: match[1], text: match[2] };
            return { label: String.fromCharCode(65 + i), text: o };
          }
          return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
        }) : [];

        const correctAnswer = typeof item.correct_answer === "string" ? item.correct_answer : "A";

        const client = await dbPool.connect();
        try {
          await client.query("BEGIN");

          const tagsArray = ["Procedural/Surgical", subspecialty, topic, masteryCategory, `difficulty_${difficulty}`];

          const { rows: inserted } = await client.query(
            `INSERT INTO exam_questions (
              id, tier, exam, question_type, status, stem, options, correct_answer,
              rationale, difficulty, tags, body_system, topic, subtopic, region_scope,
              stem_hash, career_type, scenario, clinical_pearl, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10::text[], $11, $12, $13, $14,
              $15, $16, $17, $18, NOW(), NOW()
            ) ON CONFLICT DO NOTHING RETURNING id`,
            [
              "rn",
              "CNOR",
              "multiple_choice",
              "approved",
              item.stem,
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              rationaleWithLink,
              difficultyNum,
              tagsArray,
              item.body_system || "Procedural/Surgical",
              item.topic || topic,
              subspecialty,
              "BOTH",
              stemHash,
              "nursing",
              item.scenario || item.stem,
              item.clinical_pearl || "",
            ]
          );

          if (!inserted || inserted.length === 0) {
            await client.query("ROLLBACK");
            batchDuplicates++;
            client.release();
            continue;
          }

          const questionId = inserted[0].id;
          existingHashes.add(stemHash);
          batchInserted++;
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
          recentStems.push(item.stem.substring(0, 100));
          if (recentStems.length > 30) recentStems.splice(0, recentStems.length - 20);

          if (lessonLink) batchLessonLinks++;
          if (images.length > 0) batchImages++;

          const flashcardFront = item.stem;
          const flashcardBack = buildFlashcardBack(
            correctAnswer, options, item.rationale, item.clinical_pearl || "", lessonLink,
          );
          const flashcardHash = computeContentHash(item.stem, `procedural-surgical-${subspecialty}`);

          const lessonLinks = lessonLink ? [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url, relevanceNote: `Related to ${subspecialty} - ${topic}` }] : [];

          const { rowCount: fcInserted } = await client.query(
            `INSERT INTO flashcard_bank (
              id, tier, front, back, content_hash, status, source_type, source_question_id,
              question_type, options, correct_answer, rationale_correct,
              clinical_takeaway, exam_pearl, rationale_media, lesson_links,
              difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
              category, career_type, created_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13, $14, $15,
              $16, $17, $18, $19, $20, $21, $22, $23, NOW()
            ) ON CONFLICT (content_hash) DO NOTHING`,
            [
              "rn",
              flashcardFront,
              flashcardBack,
              flashcardHash,
              "approved",
              "procedural_surgical_expansion",
              questionId,
              "multiple_choice",
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              item.rationale,
              item.clinical_pearl || null,
              item.clinical_pearl || null,
              JSON.stringify(images),
              JSON.stringify(lessonLinks),
              difficultyNum,
              item.body_system || "Procedural/Surgical",
              item.topic || topic,
              subspecialty,
              "BOTH",
              true,
              `Procedural/Surgical - ${subspecialty}`,
              "nursing",
            ]
          );

          await client.query("COMMIT");
          if (fcInserted && fcInserted > 0) batchFlashcards++;
        } catch (err: any) {
          await client.query("ROLLBACK").catch(() => {});
          if (err.code === "23505") {
            batchDuplicates++;
          } else {
            console.error(`[ProceduralSurgical] Insert error:`, err.message);
          }
        } finally {
          client.release();
        }
      }

      totalInserted += batchInserted;
      totalFlashcards += batchFlashcards;
      totalImages += batchImages;
      totalLessonLinks += batchLessonLinks;
      totalDuplicates += batchDuplicates;
      topicRemaining -= batchInserted > 0 ? batchInserted : thisBatchSize;

      const progress: ExpansionProgress = {
        tier: `procedural-surgical-${subspecialty}`,
        batchNumber,
        questionsGenerated: batchInserted,
        flashcardsCreated: batchFlashcards,
        imagesAttached: batchImages,
        lessonLinksAdded: batchLessonLinks,
        duplicatesRejected: batchDuplicates,
      };
      batches.push(progress);

      if (onProgress) onProgress(progress);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `procedural-surgical-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
            "procedural_surgical_batch_complete",
            JSON.stringify({
              ...progress,
              totalInserted,
              totalFlashcards,
              totalImages,
              totalLessonLinks,
              totalDuplicates,
            }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[ProceduralSurgical] Event log error:`, logErr.message);
      }

      console.log(`[ProceduralSurgical] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards, ${batchImages} images, ${batchLessonLinks} lessons, ${batchDuplicates} duplicates. Total: ${totalInserted}/${targetCount}`);

      await new Promise(r => setTimeout(r, 500));
    }
  }

  const completedAt = new Date().toISOString();

  const summary: ProceduralSurgicalSummary = {
    subspecialty,
    targetCount,
    totalQuestionsInserted: totalInserted,
    totalFlashcardsCreated: totalFlashcards,
    totalImagesAttached: totalImages,
    totalLessonLinksAdded: totalLessonLinks,
    totalDuplicatesRejected: totalDuplicates,
    topicDistribution: topicCounts,
    difficultyDistribution: difficultyCounts,
    startedAt,
    completedAt,
    batches,
  };

  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        `procedural-surgical-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
        "procedural_surgical_subspecialty_complete",
        JSON.stringify(summary),
      ]
    );
  } catch (logErr: any) {
    console.error(`[ProceduralSurgical] Event log error:`, logErr.message);
  }

  console.log(`[ProceduralSurgical] ${subspecialty} complete: ${totalInserted}/${targetCount} questions, ${totalFlashcards} flashcards`);
  return summary;
}

export async function runFullProceduralSurgicalExpansion(
  onProgress?: (p: ExpansionProgress) => void,
): Promise<{ subspecialties: Record<string, ProceduralSurgicalSummary>; grandTotal: any }> {
  console.log(`[ProceduralSurgical] Starting full 3,000-question Procedural/Surgical expansion across 6 subspecialties`);

  const results: Record<string, ProceduralSurgicalSummary> = {};

  for (const subspecialty of PROCEDURAL_SURGICAL_SUBSPECIALTIES) {
    results[subspecialty] = await runProceduralSurgicalSubspecialty(subspecialty, 500, onProgress);
  }

  const grandTotal = {
    totalQuestions: Object.values(results).reduce((s, r) => s + r.totalQuestionsInserted, 0),
    totalFlashcards: Object.values(results).reduce((s, r) => s + r.totalFlashcardsCreated, 0),
    totalImages: Object.values(results).reduce((s, r) => s + r.totalImagesAttached, 0),
    totalLessonLinks: Object.values(results).reduce((s, r) => s + r.totalLessonLinksAdded, 0),
    totalDuplicates: Object.values(results).reduce((s, r) => s + r.totalDuplicatesRejected, 0),
    target: 3000,
    subspecialtyBreakdown: Object.fromEntries(
      Object.entries(results).map(([k, v]) => [k, { questions: v.totalQuestionsInserted, flashcards: v.totalFlashcardsCreated }])
    ),
  };

  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;
  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        "procedural-surgical-full",
        "procedural_surgical_full_expansion_complete",
        JSON.stringify({ subspecialties: results, grandTotal }),
      ]
    );
  } catch (logErr: any) {
    console.error(`[ProceduralSurgical] Event log error:`, logErr.message);
  }

  console.log(`[ProceduralSurgical] Full expansion complete: ${grandTotal.totalQuestions}/3000 questions, ${grandTotal.totalFlashcards} flashcards`);
  return { subspecialties: results, grandTotal };
}

export async function getProceduralSurgicalExpansionStatus(): Promise<any> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  const { rows: events } = await dbPool.query(
    `SELECT event_type, payload, created_at
     FROM generation_events
     WHERE generation_id LIKE 'procedural-surgical-%'
     ORDER BY created_at DESC
     LIMIT 50`
  );

  const { rows: questionCounts } = await dbPool.query(
    `SELECT subtopic as subspecialty, COUNT(*)::int as count
     FROM exam_questions
     WHERE exam = 'CNOR' AND status = 'approved' AND career_type = 'nursing'
     GROUP BY subtopic`
  );

  const { rows: flashcardCounts } = await dbPool.query(
    `SELECT subtopic as subspecialty, COUNT(*)::int as count
     FROM flashcard_bank
     WHERE source_type = 'procedural_surgical_expansion'
     GROUP BY subtopic`
  );

  return {
    questionsBySubspecialty: Object.fromEntries(questionCounts.map((r: any) => [r.subspecialty, r.count])),
    flashcardsBySubspecialty: Object.fromEntries(flashcardCounts.map((r: any) => [r.subspecialty, r.count])),
    totalQuestions: questionCounts.reduce((s: number, r: any) => s + r.count, 0),
    totalFlashcards: flashcardCounts.reduce((s: number, r: any) => s + r.count, 0),
    recentEvents: events,
    validSubspecialties: [...PROCEDURAL_SURGICAL_SUBSPECIALTIES],
  };
}

const AUTO_TRIGGER_THRESHOLD = 0.5;

const EXPANSION_SUPPORTED_TIERS = new Set(Object.keys(TIER_SCOPE));

export interface TierDeficit {
  tier: string;
  current: number;
  target: number;
  deficit: number;
  fillPercent: number;
  supported: boolean;
}

export async function checkAutoGenerationTriggers(): Promise<{
  deficits: TierDeficit[];
  triggered: string[];
}> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;
  const result = await dbPool.query(`
    SELECT tier, COUNT(*)::int AS count
    FROM exam_questions
    WHERE status = 'published'
    GROUP BY tier
  `);

  const counts: Record<string, number> = {};
  for (const row of result.rows) {
    counts[row.tier] = row.count;
  }

  const allTargets: Record<string, number> = { ...TIER_TARGETS, ...ALLIED_HEALTH_TARGETS };
  const deficits: TierDeficit[] = [];
  const triggered: string[] = [];

  for (const [tier, target] of Object.entries(allTargets)) {
    const current = counts[tier] || 0;
    const fillPercent = target > 0 ? current / target : 1;
    const deficit = Math.max(0, target - current);
    const supported = EXPANSION_SUPPORTED_TIERS.has(tier);

    if (fillPercent < AUTO_TRIGGER_THRESHOLD) {
      deficits.push({ tier, current, target, deficit, fillPercent: Math.round(fillPercent * 100), supported });
      if (supported) {
        triggered.push(tier);
      }
    }
  }

  deficits.sort((a, b) => a.fillPercent - b.fillPercent);

  return { deficits, triggered };
}

export async function runAutoTriggeredExpansions(
  onProgress?: (info: { tier: string; status: string }) => void
): Promise<{ results: Record<string, any> }> {
  const { deficits } = await checkAutoGenerationTriggers();
  const results: Record<string, any> = {};

  for (const d of deficits) {
    if (!d.supported) {
      results[d.tier] = { status: "skipped", reason: "tier not yet supported for auto-expansion" };
      onProgress?.({ tier: d.tier, status: "skipped (unsupported tier)" });
      continue;
    }

    const batchTarget = Math.min(d.deficit, BATCH_SIZE * 5);
    onProgress?.({ tier: d.tier, status: `starting: ${d.current}/${d.target} (deficit ${d.deficit}), generating ${batchTarget}` });

    try {
      const summary = await runExpansionForTier(d.tier, batchTarget);
      const actualInserted = summary?.totalQuestionsInserted ?? batchTarget;
      results[d.tier] = { status: "complete", requested: batchTarget, inserted: actualInserted, summary };
      onProgress?.({ tier: d.tier, status: `complete (${actualInserted} inserted)` });
    } catch (err: any) {
      results[d.tier] = { status: "failed", error: err.message };
      onProgress?.({ tier: d.tier, status: `failed: ${err.message}` });
    }
  }

  return { results };
}
