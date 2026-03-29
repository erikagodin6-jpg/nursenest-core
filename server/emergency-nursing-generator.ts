import crypto from "crypto";
import { pool } from "./storage";
import { getProdPool, hasSeparateProdDb } from "./db";
import OpenAI from "openai";

const BATCH_SIZE = 50;
const DIFFICULTY_DISTRIBUTION = { easy: 0.35, moderate: 0.45, hard: 0.20 };
const DIFFICULTY_MAP: Record<string, number> = { easy: 1, moderate: 3, hard: 5 };
const MASTERY_MAP: Record<string, string> = {
  easy: "low_mastery",
  moderate: "moderate_mastery",
  hard: "high_mastery",
};

interface SubspecialtyConfig {
  name: string;
  tag: string;
  tier: string;
  exam: string;
  topics: string[];
  scopePrompt: string;
}

const SUBSPECIALTIES: SubspecialtyConfig[] = [
  {
    name: "Emergency Nursing",
    tag: "emergency_nursing",
    tier: "rn",
    exam: "CEN",
    topics: [
      "Triage Systems & ESI Levels",
      "Cardiac Emergencies & STEMI Management",
      "Respiratory Emergencies & Airway Management",
      "Neurological Emergencies & Stroke Protocols",
      "Sepsis Recognition & Bundle Compliance",
      "Toxicological Emergencies & Overdose Management",
      "Environmental Emergencies (Heat/Cold/Drowning)",
      "Shock Recognition & Fluid Resuscitation",
      "Wound Management & Laceration Repair",
      "Pain Assessment & Emergency Analgesia",
      "Psychiatric Emergencies & Crisis Intervention",
      "Gastrointestinal Emergencies & Acute Abdomen",
      "Genitourinary Emergencies",
      "Endocrine Emergencies (DKA/HHS/Thyroid Storm)",
      "Hematologic & Oncologic Emergencies",
      "Disaster Preparedness & Mass Casualty Incidents",
      "Emergency Pharmacology & High-Alert Medications",
      "Procedural Sedation & Rapid Sequence Intubation",
      "Electrocardiogram Interpretation in Emergencies",
      "Patient Stabilization & Transport Readiness",
    ],
    scopePrompt: `You are a senior Certified Emergency Nurse (CEN) exam item writer with 15+ years of emergency department experience.
Focus areas: triage decision-making, rapid assessment, emergency interventions, stabilization, time-critical protocols.
Emergency nurses perform initial patient assessment, triage categorization, initiate life-saving interventions, administer emergency medications, coordinate rapid diagnostics, and manage acute presentations across all body systems.
Questions must reflect the fast-paced, high-acuity emergency department setting with realistic vital signs, lab values, and clinical presentations.
Use standard emergency nursing terminology: ESI levels, NIHSS scores, GCS, FAST exam, STEMI alerts, code protocols.`,
  },
  {
    name: "Trauma Nursing",
    tag: "trauma_nursing",
    tier: "rn",
    exam: "TCRN",
    topics: [
      "Primary Survey (ABCDE) & Trauma Assessment",
      "Secondary Survey & Head-to-Toe Evaluation",
      "Traumatic Brain Injury & ICP Management",
      "Spinal Cord Injury & Neurogenic Shock",
      "Thoracic Trauma (Pneumothorax/Hemothorax/Flail Chest)",
      "Abdominal & Pelvic Trauma",
      "Musculoskeletal Trauma & Compartment Syndrome",
      "Burn Injury Assessment & Management",
      "Hemorrhagic Shock & Massive Transfusion Protocol",
      "Damage Control Resuscitation",
      "Trauma in Special Populations (Elderly/Pregnant)",
      "Mechanism of Injury & Injury Pattern Recognition",
      "Trauma Pain Management & Sedation",
      "Post-Resuscitation Care & ICU Handoff",
      "Wound & Soft Tissue Injury Management",
      "Facial & Neck Trauma",
      "Vascular Injuries & Tourniquet Application",
      "Trauma Team Activation & Communication (SBAR)",
      "Trauma Scoring Systems (ISS/RTS/GCS)",
      "Organ Donation & End-of-Life in Trauma",
    ],
    scopePrompt: `You are a senior Trauma Certified Registered Nurse (TCRN) exam item writer with extensive Level I trauma center experience.
Focus areas: systematic trauma assessment (primary/secondary survey), hemorrhage control, damage control resuscitation, injury pattern recognition, multi-system trauma prioritization.
Trauma nurses perform rapid assessments using ATLS/TNCC principles, manage hemorrhagic shock, assist with emergency procedures (chest tubes, FAST exams, intubation), administer blood products per MTP, and coordinate trauma team responses.
Questions must include realistic mechanisms of injury, specific vital signs, GCS scores, injury severity data, and time-critical decision points.
Use standard trauma terminology: ABCDE approach, permissive hypotension, massive transfusion protocol, damage control surgery, log roll, C-spine precautions.`,
  },
  {
    name: "Pediatric Emergency Nursing",
    tag: "pediatric_emergency_nursing",
    tier: "rn",
    exam: "CPEN",
    topics: [
      "Pediatric Triage & Assessment (PAT Triangle)",
      "Pediatric Airway Management & Croup/Epiglottitis",
      "Pediatric Respiratory Emergencies (Asthma/Bronchiolitis/RSV)",
      "Pediatric Cardiac Emergencies & Arrhythmias",
      "Pediatric Sepsis & Febrile Illness Management",
      "Pediatric Traumatic Brain Injury",
      "Non-Accidental Trauma & Child Abuse Recognition",
      "Pediatric Seizures & Status Epilepticus",
      "Pediatric Dehydration & Fluid Resuscitation",
      "Neonatal Emergencies & Newborn Resuscitation",
      "Pediatric Toxicological Emergencies & Poisoning",
      "Pediatric Orthopedic Emergencies & Fractures",
      "Diabetic Emergencies in Children (DKA)",
      "Pediatric Weight-Based Medication Dosing",
      "Developmental Considerations in Pediatric Assessment",
      "Pediatric Pain Assessment & Management",
      "Pediatric Shock & Anaphylaxis",
      "Pediatric Burns & Thermal Injuries",
      "Congenital Heart Disease Emergencies",
      "Family-Centered Care in Pediatric Emergencies",
    ],
    scopePrompt: `You are a senior Certified Pediatric Emergency Nurse (CPEN) exam item writer with extensive pediatric emergency department experience.
Focus areas: age-appropriate assessment, weight-based medication dosing, pediatric-specific presentations, developmental considerations, family-centered emergency care.
Pediatric emergency nurses perform age-appropriate triage using PAT (Pediatric Assessment Triangle), calculate weight-based doses, recognize pediatric-specific pathology, manage airway differences in children, and communicate with families during crises.
Questions must include age-specific vital sign ranges, weight-based calculations, developmental milestones relevant to assessment, and pediatric-specific pathophysiology.
Use standard pediatric emergency terminology: Broselow tape, PAT triangle, Pediatric GCS, weight-based dosing, age-appropriate vital signs, fontanelle assessment.`,
  },
];

const IMAGE_KEYWORD_MAP: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "cardiac tamponade": [{ file: "cardiactamponade", alt: "Cardiac tamponade illustration", caption: "Cardiac Tamponade", description: "Beck's triad: hypotension, muffled heart sounds, JVD" }],
  "abg": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "arterial blood gas": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "heart failure": [{ file: "heartfailure", alt: "Heart failure illustration", caption: "Heart Failure", description: "HF pathophysiology, left vs right-sided, treatment" }],
  "stroke": [{ file: "stroke", alt: "Stroke illustration", caption: "Stroke", description: "Ischemic vs hemorrhagic stroke" }],
  "pneumonia": [{ file: "pneumonia", alt: "Pneumonia illustration", caption: "Pneumonia", description: "Lung infection: types, assessment, treatment" }],
  "copd": [{ file: "copd", alt: "COPD illustration", caption: "COPD", description: "Chronic obstructive pulmonary disease management" }],
  "asthma": [{ file: "asthma", alt: "Asthma illustration", caption: "Asthma", description: "Airway inflammation and bronchospasm" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome illustration", caption: "Compartment Syndrome", description: "5 P's, fasciotomy, neurovascular assessment" }],
  "fracture": [{ file: "fracture", alt: "Fracture illustration", caption: "Fracture", description: "Types, assessment, and management" }],
  "burns": [{ file: "burns", alt: "Burns illustration", caption: "Burns", description: "Burn classification and nursing management" }],
  "opioid overdose": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Opioid Overdose", description: "Respiratory depression, naloxone reversal" }],
  "seizure": [{ file: "seizure", alt: "Seizure illustration", caption: "Seizure Management", description: "Seizure types, medications, nursing care" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration", caption: "Pancreatitis", description: "Pancreatic inflammation: Cullen's, Grey Turner's" }],
  "sickle cell": [{ file: "sicklecell", alt: "Sickle cell illustration", caption: "Sickle Cell Disease", description: "Sickle cell crisis prevention and management" }],
  "anemia": [{ file: "anemia", alt: "Anemia illustration", caption: "Anemia", description: "Types of anemia and nursing management" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes management infographic", caption: "Diabetes Overview", description: "Key concepts in diabetes management and monitoring" }],
  "pulmonary embolism": [{ file: "pe", alt: "Pulmonary embolism illustration", caption: "Pulmonary Embolism", description: "PE signs, treatment, prevention" }],
  "dvt": [{ file: "dvt", alt: "DVT illustration", caption: "Deep Vein Thrombosis", description: "Venous thromboembolism prevention and treatment" }],
};

const LESSON_TOPIC_MAP: Record<string, { title: string; slug: string }> = {
  "heart failure": { title: "Heart Failure Management", slug: "heart-failure" },
  "diabetes": { title: "Diabetes Management", slug: "diabetes-management" },
  "shock": { title: "Types of Shock", slug: "shock-management" },
  "electrolyte": { title: "Electrolyte Imbalances", slug: "electrolyte-imbalances" },
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
  "burns": { title: "Burns", slug: "burns" },
  "fracture": { title: "Fracture Management", slug: "fractures" },
  "infection control": { title: "Infection Control", slug: "infection-control" },
  "compartment syndrome": { title: "Compartment Syndrome", slug: "compartment-syndrome" },
  "delegation": { title: "Delegation", slug: "delegation" },
  "prioritization": { title: "Prioritization", slug: "prioritization" },
  "pediatric": { title: "Pediatric Nursing", slug: "pediatrics" },
  "neonatal": { title: "Neonatal Care", slug: "neonatal" },
  "renal": { title: "Renal Disorders", slug: "renal" },
  "thyroid": { title: "Thyroid Disorders", slug: "thyroid" },
  "dvt": { title: "Deep Vein Thrombosis", slug: "dvt" },
  "pulmonary embolism": { title: "Pulmonary Embolism", slug: "pulmonary-embolism" },
  "sepsis": { title: "Sepsis Management", slug: "sepsis" },
  "trauma": { title: "Trauma Assessment", slug: "trauma" },
  "triage": { title: "Emergency Triage", slug: "triage" },
  "airway": { title: "Airway Management", slug: "airway-management" },
};

interface BatchProgress {
  subspecialty: string;
  batchNumber: number;
  questionsGenerated: number;
  flashcardsCreated: number;
  imagesAttached: number;
  lessonLinksAdded: number;
  duplicatesRejected: number;
}

interface SubspecialtySummary {
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
  batches: BatchProgress[];
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

function computeContentHash(stem: string, tag: string): string {
  return crypto.createHash("sha256").update(`emergency:${tag}:${stem}`).digest("hex").slice(0, 32);
}

function assignDifficulty(batchIndex: number, totalInBatch: number): string {
  const easyCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.easy);
  const modCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.moderate);
  if (batchIndex < easyCount) return "easy";
  if (batchIndex < easyCount + modCount) return "moderate";
  return "hard";
}

function distributeTopics(topics: string[], totalCount: number): Record<string, number> {
  const perTopic = Math.floor(totalCount / topics.length);
  const remainder = totalCount % topics.length;
  const dist: Record<string, number> = {};
  topics.forEach((t, i) => {
    dist[t] = perTopic + (i < remainder ? 1 : 0);
  });
  return dist;
}

function buildEmergencyPrompt(
  config: SubspecialtyConfig,
  topic: string,
  count: number,
  difficulties: string[],
  existingStems: string[],
): { system: string; user: string } {
  const diffCounts: Record<string, number> = {};
  for (const d of difficulties) diffCounts[d] = (diffCounts[d] || 0) + 1;

  const diffBlock = Object.entries(diffCounts)
    .map(([d, c]) => `- ${d}: ${c} questions`)
    .join("\n");

  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const system = `${config.scopePrompt}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no prose.
2. NEVER copy or reference instructions in any output field.
3. Every question must have a unique, distinct clinical scenario.
4. Do NOT use any emoji characters. Plain text only.
5. Each question's rationale MUST be 80-150 words and include:
   - Why the correct answer is right
   - Why EACH distractor (wrong answer) is wrong
   - A clinical application note
   - A nursing intervention note
6. Include a clinical pearl for each question.
7. All questions must be tagged as "${config.name}" subspecialty.
8. Questions must reflect real emergency department clinical decision-making, NCLEX-style.
9. Include specific vital signs, lab values, and patient data in scenarios.

Subspecialty: ${config.name}
Topic Focus: ${topic}

Content must cover relevant aspects of: triage, stabilization, pharmacology, pathophysiology, assessment, interventions, prioritization.

You will generate exactly ${count} questions for the topic "${topic}" within ${config.name}.

Difficulty distribution:
${diffBlock}

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object schema:
{
  "stem": "A detailed clinical scenario question (min 50 chars, includes specific patient data, vital signs, or lab values)",
  "scenario": "Extended clinical context with additional patient history and presentation details",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correct_answer": "B",
  "difficulty": "easy" | "moderate" | "hard",
  "domain": "${config.name}",
  "rationale": "Detailed rationale (80-150 words): why correct + why each wrong + clinical application + nursing intervention",
  "clinical_pearl": "A concise clinical pearl for exam prep",
  "topic": "${topic}",
  "subtopic": "Specific subtopic within ${topic}",
  "body_system": "Related body system"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer letter.
${antiDupe}

Return EXACTLY ${count} items. JSON only. No extra text.`;

  const user = `Generate ${count} unique ${config.name} exam questions for the topic "${topic}". Each must have a distinct clinical scenario with specific patient data, realistic vital signs, and emergency department context.`;

  return { system, user };
}

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

function findLessonLink(stem: string, rationale: string, topic: string): { title: string; url: string } | null {
  const searchText = `${stem} ${rationale} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(LESSON_TOPIC_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-rn`,
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

function validateQuestion(q: any): boolean {
  if (!q.stem || typeof q.stem !== "string" || q.stem.length < 40) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  if (!q.correct_answer) return false;
  if (!q.rationale || typeof q.rationale !== "string" || q.rationale.length < 20) return false;
  return true;
}

async function getExistingStemHashes(dbPool: any): Promise<Set<string>> {
  const { rows } = await dbPool.query(
    `SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`
  );
  return new Set(rows.map((r: any) => r.stem_hash));
}

async function generateBatch(
  openai: OpenAI,
  config: SubspecialtyConfig,
  topic: string,
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
      const { system, user } = buildEmergencyPrompt(config, topic, count, difficulties, existingStems);

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

      console.log(`[EmergencyGen] Attempt ${attempt + 1}: 0 items parsed for ${topic}, retrying...`);
    } catch (err: any) {
      console.error(`[EmergencyGen] Attempt ${attempt + 1} failed for ${topic}:`, err.message);
    }

    if (attempt < maxRetries) await new Promise(r => setTimeout(r, 1500));
  }

  return [];
}

async function runSubspecialty(
  config: SubspecialtyConfig,
  targetCount: number,
  onProgress?: (p: BatchProgress) => void,
): Promise<SubspecialtySummary> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[EmergencyGen] Starting ${config.name}: ${targetCount} questions, targeting ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"} database`);

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const topicPlan = distributeTopics(config.topics, targetCount);
  const startedAt = new Date().toISOString();
  const batches: BatchProgress[] = [];

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalImages = 0;
  let totalLessonLinks = 0;
  let totalDuplicates = 0;
  let batchNumber = 0;
  const recentStems: string[] = [];

  const topicCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};

  for (const [topic, topicTarget] of Object.entries(topicPlan)) {
    let topicRemaining = topicTarget;

    while (topicRemaining > 0) {
      const thisBatchSize = Math.min(BATCH_SIZE, topicRemaining);
      batchNumber++;

      console.log(`[EmergencyGen] Batch ${batchNumber}: ${thisBatchSize} questions for "${topic}" (${config.name})`);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `emergency-${config.tag}`,
            "emergency_batch_start",
            JSON.stringify({ subspecialty: config.name, batchNumber, topic, batchSize: thisBatchSize, totalInserted }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[EmergencyGen] Event log error:`, logErr.message);
      }

      const items = await generateBatch(openai, config, topic, thisBatchSize, recentStems);

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

        const difficulty = item.difficulty || "moderate";
        const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
        const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
        const lessonLink = findLessonLink(item.stem, item.rationale, item.topic || topic);
        const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
        const images = matchImagesForQuestion(item.stem, item.rationale, item.topic || topic, config.name);

        const options = Array.isArray(item.options) ? item.options.map((o: any, i: number) => {
          if (typeof o === "string") {
            const match = o.match(/^([A-H])\)\s*(.+)/);
            if (match) return { label: match[1], text: match[2] };
            return { label: String.fromCharCode(65 + i), text: o };
          }
          return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
        }) : [];

        const correctAnswer = typeof item.correct_answer === "string" ? item.correct_answer : "A";

        const tagsArray = [config.tag, config.name, masteryCategory, `difficulty_${difficulty}`, topic];

        const client = await dbPool.connect();
        try {
          await client.query("BEGIN");

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
              config.tier,
              config.exam,
              "multiple_choice",
              "approved",
              item.stem,
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              rationaleWithLink,
              difficultyNum,
              tagsArray,
              item.body_system || config.name,
              item.topic || topic,
              item.subtopic || config.tag,
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
          const flashcardHash = computeContentHash(item.stem, config.tag);

          const lessonLinks = lessonLink ? [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url, relevanceNote: `Related to ${config.name}` }] : [];

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
              config.tier,
              flashcardFront,
              flashcardBack,
              flashcardHash,
              "approved",
              "emergency_nursing_generator",
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
              item.body_system || config.name,
              item.topic || topic,
              item.subtopic || config.tag,
              "BOTH",
              true,
              config.name,
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
            console.error(`[EmergencyGen] Insert error:`, err.message);
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

      const progress: BatchProgress = {
        subspecialty: config.name,
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
            `emergency-${config.tag}`,
            "emergency_batch_complete",
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
        console.error(`[EmergencyGen] Event log error:`, logErr.message);
      }

      console.log(`[EmergencyGen] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards, ${batchImages} images, ${batchLessonLinks} lessons, ${batchDuplicates} duplicates. Total: ${totalInserted}/${targetCount}`);

      await new Promise(r => setTimeout(r, 500));
    }
  }

  const completedAt = new Date().toISOString();

  const summary: SubspecialtySummary = {
    subspecialty: config.name,
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
    const dbPool2 = hasSeparateProdDb() ? getProdPool() : pool;
    await dbPool2.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        `emergency-${config.tag}`,
        "emergency_subspecialty_complete",
        JSON.stringify(summary),
      ]
    );
  } catch (logErr: any) {
    console.error(`[EmergencyGen] Event log error:`, logErr.message);
  }

  console.log(`[EmergencyGen] ${config.name} complete: ${totalInserted}/${targetCount} questions, ${totalFlashcards} flashcards`);
  return summary;
}

async function getSubspecialtyCount(dbPool: any, tag: string): Promise<number> {
  const { rows } = await dbPool.query(
    `SELECT COUNT(*)::int as cnt FROM exam_questions WHERE tags[1] = $1`,
    [tag]
  );
  return rows[0]?.cnt || 0;
}

export async function runEmergencyNursingGeneration(
  onProgress?: (p: BatchProgress) => void,
): Promise<{
  emergencyNursing: SubspecialtySummary;
  traumaNursing: SubspecialtySummary;
  pediatricEmergency: SubspecialtySummary;
  grandTotal: any;
}> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[EmergencyGen] ========================================`);
  console.log(`[EmergencyGen] Starting Emergency Nursing Generation`);
  console.log(`[EmergencyGen] Target: 1,500 questions (500 per subspecialty)`);
  console.log(`[EmergencyGen] Database: ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"}`);
  console.log(`[EmergencyGen] ========================================`);

  try {
    const testResult = await dbPool.query("SELECT 1 as connected");
    console.log(`[EmergencyGen] Database connection verified: ${testResult.rows[0]?.connected === 1 ? "OK" : "FAIL"}`);
  } catch (err: any) {
    console.error(`[EmergencyGen] Database connection FAILED:`, err.message);
    throw err;
  }

  const TARGET_PER_SUBSPECIALTY = 400;

  const enExisting = await getSubspecialtyCount(dbPool, "emergency_nursing");
  const tnExisting = await getSubspecialtyCount(dbPool, "trauma_nursing");
  const penExisting = await getSubspecialtyCount(dbPool, "pediatric_emergency_nursing");

  console.log(`[EmergencyGen] Existing counts - EN: ${enExisting}, TN: ${tnExisting}, PEN: ${penExisting}`);

  const enRemaining = Math.max(0, TARGET_PER_SUBSPECIALTY - enExisting);
  const tnRemaining = Math.max(0, TARGET_PER_SUBSPECIALTY - tnExisting);
  const penRemaining = Math.max(0, TARGET_PER_SUBSPECIALTY - penExisting);

  let emergencyNursing: SubspecialtySummary;
  let traumaNursing: SubspecialtySummary;
  let pediatricEmergency: SubspecialtySummary;

  if (enRemaining > 0) {
    console.log(`[EmergencyGen] Generating ${enRemaining} more Emergency Nursing questions (have ${enExisting})`);
    emergencyNursing = await runSubspecialty(SUBSPECIALTIES[0], enRemaining, onProgress);
  } else {
    console.log(`[EmergencyGen] SKIP Emergency Nursing: already have ${enExisting} >= ${TARGET_PER_SUBSPECIALTY}`);
    emergencyNursing = { subspecialty: "Emergency Nursing", targetCount: TARGET_PER_SUBSPECIALTY, totalQuestionsInserted: 0, totalFlashcardsCreated: 0, totalImagesAttached: 0, totalLessonLinksAdded: 0, totalDuplicatesRejected: 0, topicDistribution: {}, difficultyDistribution: {}, startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), batches: [] };
  }

  if (tnRemaining > 0) {
    console.log(`[EmergencyGen] Generating ${tnRemaining} more Trauma Nursing questions (have ${tnExisting})`);
    traumaNursing = await runSubspecialty(SUBSPECIALTIES[1], tnRemaining, onProgress);
  } else {
    console.log(`[EmergencyGen] SKIP Trauma Nursing: already have ${tnExisting} >= ${TARGET_PER_SUBSPECIALTY}`);
    traumaNursing = { subspecialty: "Trauma Nursing", targetCount: TARGET_PER_SUBSPECIALTY, totalQuestionsInserted: 0, totalFlashcardsCreated: 0, totalImagesAttached: 0, totalLessonLinksAdded: 0, totalDuplicatesRejected: 0, topicDistribution: {}, difficultyDistribution: {}, startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), batches: [] };
  }

  if (penRemaining > 0) {
    console.log(`[EmergencyGen] Generating ${penRemaining} more Pediatric Emergency questions (have ${penExisting})`);
    pediatricEmergency = await runSubspecialty(SUBSPECIALTIES[2], penRemaining, onProgress);
  } else {
    console.log(`[EmergencyGen] SKIP Pediatric Emergency: already have ${penExisting} >= ${TARGET_PER_SUBSPECIALTY}`);
    pediatricEmergency = { subspecialty: "Pediatric Emergency Nursing", targetCount: TARGET_PER_SUBSPECIALTY, totalQuestionsInserted: 0, totalFlashcardsCreated: 0, totalImagesAttached: 0, totalLessonLinksAdded: 0, totalDuplicatesRejected: 0, topicDistribution: {}, difficultyDistribution: {}, startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), batches: [] };
  }

  const grandTotal = {
    totalQuestions: emergencyNursing.totalQuestionsInserted + traumaNursing.totalQuestionsInserted + pediatricEmergency.totalQuestionsInserted,
    totalFlashcards: emergencyNursing.totalFlashcardsCreated + traumaNursing.totalFlashcardsCreated + pediatricEmergency.totalFlashcardsCreated,
    totalImages: emergencyNursing.totalImagesAttached + traumaNursing.totalImagesAttached + pediatricEmergency.totalImagesAttached,
    totalLessonLinks: emergencyNursing.totalLessonLinksAdded + traumaNursing.totalLessonLinksAdded + pediatricEmergency.totalLessonLinksAdded,
    totalDuplicates: emergencyNursing.totalDuplicatesRejected + traumaNursing.totalDuplicatesRejected + pediatricEmergency.totalDuplicatesRejected,
    target: 1500,
  };

  console.log(`\n[EmergencyGen] ========================================`);
  console.log(`[EmergencyGen] FINAL REPORT`);
  console.log(`[EmergencyGen] ========================================`);
  console.log(`[EmergencyGen] Emergency Nursing: ${emergencyNursing.totalQuestionsInserted}/500 questions, ${emergencyNursing.totalFlashcardsCreated} flashcards`);
  console.log(`[EmergencyGen] Trauma Nursing: ${traumaNursing.totalQuestionsInserted}/500 questions, ${traumaNursing.totalFlashcardsCreated} flashcards`);
  console.log(`[EmergencyGen] Pediatric Emergency: ${pediatricEmergency.totalQuestionsInserted}/500 questions, ${pediatricEmergency.totalFlashcardsCreated} flashcards`);
  console.log(`[EmergencyGen] ----------------------------------------`);
  console.log(`[EmergencyGen] Grand Total: ${grandTotal.totalQuestions}/1500 questions`);
  console.log(`[EmergencyGen] Grand Total Flashcards: ${grandTotal.totalFlashcards}`);
  console.log(`[EmergencyGen] Grand Total Images: ${grandTotal.totalImages}`);
  console.log(`[EmergencyGen] Grand Total Lesson Links: ${grandTotal.totalLessonLinks}`);
  console.log(`[EmergencyGen] Grand Total Duplicates Rejected: ${grandTotal.totalDuplicates}`);
  console.log(`[EmergencyGen] ========================================`);

  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        "emergency-full",
        "emergency_generation_complete",
        JSON.stringify({ emergencyNursing, traumaNursing, pediatricEmergency, grandTotal }),
      ]
    );
  } catch (logErr: any) {
    console.error(`[EmergencyGen] Event log error:`, logErr.message);
  }

  return { emergencyNursing, traumaNursing, pediatricEmergency, grandTotal };
}

export { SUBSPECIALTIES };
