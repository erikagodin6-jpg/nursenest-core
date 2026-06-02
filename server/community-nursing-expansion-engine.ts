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

const COMMUNITY_SUBSPECIALTIES = [
  "Public Health Nursing",
  "Community Health Nursing",
  "Palliative Care Nursing",
  "Hospice Nursing",
  "Occupational Health Nursing",
] as const;

const COMMUNITY_TOPICS: Record<string, string[]> = {
  "Public Health Nursing": [
    "Epidemiology & Disease Surveillance", "Communicable Disease Control",
    "Immunization Programs & Vaccine Administration", "Health Promotion & Disease Prevention",
    "Population Health Assessment", "Environmental Health Hazards",
    "Emergency Preparedness & Disaster Response", "Maternal & Child Public Health",
    "Chronic Disease Prevention Programs", "Health Disparities & Social Determinants",
    "Community Needs Assessment", "Outbreak Investigation & Contact Tracing",
    "Public Health Policy & Legislation", "Health Education & Literacy",
    "Screening Programs & Early Detection", "Tobacco & Substance Use Prevention",
    "Nutrition & Food Safety Programs", "Water & Sanitation Public Health",
    "Biostatistics & Data Interpretation", "Global Health Nursing",
  ],
  "Community Health Nursing": [
    "Home Health Nursing Assessment", "Family Health Assessment & Intervention",
    "School Health Nursing", "Case Management & Care Coordination",
    "Community Resource Referral", "Health Teaching & Client Education",
    "Cultural Competency in Community Settings", "Vulnerable Population Care",
    "Homeless Population Health", "Migrant & Refugee Health",
    "Elderly Community Care & Fall Prevention", "Mental Health in the Community",
    "Substance Use Disorder Community Programs", "Chronic Disease Self-Management",
    "Telehealth & Remote Patient Monitoring", "Community-Based Rehabilitation",
    "Parish & Faith-Based Nursing", "Rural Health Nursing",
    "Urban Community Health Challenges", "Community Health Program Evaluation",
  ],
  "Palliative Care Nursing": [
    "Pain Assessment & Management", "Symptom Management in Advanced Illness",
    "Nausea & Vomiting Management", "Dyspnea Management in Terminal Illness",
    "Fatigue & Weakness Management", "Delirium Assessment & Intervention",
    "Psychosocial Support & Counseling", "Spiritual Care & Existential Distress",
    "Goals of Care Conversations", "Advance Care Planning & Directives",
    "Family Caregiver Support", "Interdisciplinary Palliative Care Teams",
    "Palliative Sedation Ethics", "Prognostication & Communication",
    "Pediatric Palliative Care", "Palliative Care in Heart Failure",
    "Palliative Care in COPD", "Palliative Care in Cancer",
    "Palliative Care in Dementia", "Quality of Life Assessment",
  ],
  "Hospice Nursing": [
    "Hospice Eligibility & Admission Criteria", "End-of-Life Symptom Management",
    "Death & Dying Process", "Comfort Care Measures",
    "Hospice Pain Management & Opioid Use", "Anticipatory Grief Support",
    "Bereavement Care & Follow-Up", "Ethical Issues in End-of-Life Care",
    "DNR & POLST Documentation", "Hospice Interdisciplinary Team Roles",
    "Home Hospice Care Delivery", "Inpatient Hospice Care",
    "Respite Care for Caregivers", "Cultural & Religious End-of-Life Practices",
    "Pediatric Hospice Care", "Hospice Medication Management",
    "Wound Care in Hospice", "Nutrition & Hydration at End of Life",
    "Pronouncement of Death & Postmortem Care", "Hospice Regulatory & Reimbursement",
  ],
  "Occupational Health Nursing": [
    "Workplace Hazard Assessment", "Occupational Exposure Management",
    "Workplace Injury Prevention", "Ergonomic Assessment & Intervention",
    "Workers Compensation & Return-to-Work", "Bloodborne Pathogen Exposure Protocol",
    "Respiratory Protection Programs", "Hearing Conservation Programs",
    "Chemical Exposure & Toxicology", "Workplace Violence Prevention",
    "Employee Health Screening & Surveillance", "Drug & Alcohol Testing Programs",
    "Workplace Mental Health & Stress", "Heat & Cold Stress Management",
    "Occupational Respiratory Disease", "Musculoskeletal Disorder Prevention",
    "Workplace Infection Control", "Emergency Response in the Workplace",
    "OSHA Regulations & Compliance", "Health Promotion in the Workplace",
  ],
};

const COMMUNITY_SCOPE: Record<string, string> = {
  "Public Health Nursing": `You are a senior Public Health Nursing certification exam item writer.
Focus on: epidemiology, disease surveillance, communicable disease control, immunization programs, health promotion, disease prevention, population health assessment, environmental health, emergency preparedness, maternal-child public health, chronic disease prevention, outbreak investigation, contact tracing, health disparities, social determinants of health, screening programs, biostatistics, and global health.
Questions test clinical judgment in public health settings with emphasis on population-level interventions, evidence-based practice, health policy, and community assessment.`,

  "Community Health Nursing": `You are a senior Community Health Nursing certification exam item writer.
Focus on: home health assessment, family health, school nursing, case management, care coordination, community resources, health teaching, cultural competency, vulnerable populations, homeless health, migrant/refugee health, elderly community care, mental health in community settings, substance use programs, chronic disease self-management, telehealth, community rehabilitation, rural health, and program evaluation.
Questions test clinical judgment in community settings with emphasis on holistic family/community assessment, client education, resource coordination, and culturally appropriate care.`,

  "Palliative Care Nursing": `You are a senior Palliative Care Nursing certification exam item writer.
Focus on: pain assessment and management (numeric rating scale, FLACC, Wong-Baker), symptom management (nausea, dyspnea, fatigue, delirium), psychosocial support, spiritual care, goals of care conversations, advance care planning, advance directives, family caregiver support, interdisciplinary team collaboration, palliative sedation, prognostication, pediatric palliative care, palliative care in chronic illness (heart failure, COPD, cancer, dementia), and quality of life assessment.
Questions test clinical judgment in palliative care with emphasis on symptom management, communication, ethical decision-making, and holistic patient/family care.`,

  "Hospice Nursing": `You are a senior Hospice Nursing certification exam item writer.
Focus on: hospice eligibility criteria, end-of-life symptom management, death and dying process, comfort care, hospice pain management (opioid titration, equianalgesic dosing), anticipatory grief, bereavement care, ethical issues, DNR/POLST, interdisciplinary team roles, home hospice delivery, inpatient hospice, respite care, cultural/religious practices, pediatric hospice, medication management, wound care, nutrition/hydration decisions, pronouncement of death, postmortem care, and hospice regulations.
Questions test clinical judgment in hospice settings with emphasis on comfort-focused interventions, family support, ethical decision-making, and end-of-life care delivery.`,

  "Occupational Health Nursing": `You are a senior Occupational Health Nursing certification exam item writer.
Focus on: workplace hazard assessment, occupational exposure management, injury prevention, ergonomic assessment, workers compensation, return-to-work programs, bloodborne pathogen protocols, respiratory protection, hearing conservation, chemical/toxicology exposure, workplace violence prevention, employee health screening, surveillance programs, drug/alcohol testing, workplace mental health, heat/cold stress, occupational respiratory disease, musculoskeletal disorders, workplace infection control, emergency response, OSHA regulations, and workplace health promotion.
Questions test clinical judgment in occupational health with emphasis on hazard identification, exposure prevention, regulatory compliance, worker safety, and return-to-work decisions.`,
};

const COMMUNITY_IMAGE_KEYWORDS: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "immunization": [{ file: "diabetes", alt: "Injection illustration", caption: "Immunization Administration", description: "Vaccine administration and immunization schedules" }],
  "respiratory": [{ file: "ABGreference", alt: "Respiratory assessment", caption: "Respiratory Assessment", description: "Respiratory assessment and ABG interpretation" }],
  "copd": [{ file: "copd", alt: "COPD illustration", caption: "COPD Management", description: "Chronic obstructive pulmonary disease in palliative care" }],
  "heart failure": [{ file: "heartfailure", alt: "Heart failure illustration", caption: "Heart Failure", description: "Heart failure palliative management" }],
  "pain": [{ file: "opioid", alt: "Pain management illustration", caption: "Pain Management", description: "Pain assessment scales and analgesic management" }],
  "opioid": [{ file: "opioid", alt: "Opioid management illustration", caption: "Opioid Management", description: "Opioid titration and side effect management" }],
  "depression": [{ file: "depression", alt: "Depression illustration", caption: "Depression", description: "Depression assessment in community/palliative settings" }],
  "wound": [{ file: "burns", alt: "Wound care illustration", caption: "Wound Care", description: "Wound assessment and management" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes illustration", caption: "Diabetes Management", description: "Diabetes management in community settings" }],
  "stroke": [{ file: "stroke", alt: "Stroke illustration", caption: "Stroke", description: "Stroke prevention and community education" }],
  "pneumonia": [{ file: "pneumonia", alt: "Pneumonia illustration", caption: "Pneumonia", description: "Community-acquired pneumonia prevention" }],
  "asthma": [{ file: "asthma", alt: "Asthma illustration", caption: "Asthma", description: "Asthma management in community settings" }],
  "hepatitis": [{ file: "hepatitisb", alt: "Hepatitis illustration", caption: "Hepatitis", description: "Hepatitis prevention and screening" }],
  "osteoporosis": [{ file: "osteoporosis", alt: "Osteoporosis illustration", caption: "Osteoporosis", description: "Fall prevention and osteoporosis screening" }],
  "hypertension": [{ file: "dvt", alt: "Hypertension illustration", caption: "Hypertension", description: "Hypertension screening and community management" }],
  "seizure": [{ file: "seizure", alt: "Seizure illustration", caption: "Seizure Management", description: "Seizure management in community/hospice settings" }],
};

const COMMUNITY_LESSON_MAP: Record<string, { title: string; slug: string }> = {
  "epidemiology": { title: "Epidemiology Fundamentals", slug: "epidemiology" },
  "communicable disease": { title: "Communicable Disease Control", slug: "communicable-disease" },
  "immunization": { title: "Immunization Programs", slug: "immunization-programs" },
  "health promotion": { title: "Health Promotion Strategies", slug: "health-promotion" },
  "disease prevention": { title: "Disease Prevention", slug: "disease-prevention" },
  "environmental health": { title: "Environmental Health", slug: "environmental-health" },
  "emergency preparedness": { title: "Emergency Preparedness", slug: "emergency-preparedness" },
  "outbreak": { title: "Outbreak Investigation", slug: "outbreak-investigation" },
  "home health": { title: "Home Health Nursing", slug: "home-health-nursing" },
  "family health": { title: "Family Health Assessment", slug: "family-health" },
  "school health": { title: "School Health Nursing", slug: "school-health-nursing" },
  "case management": { title: "Case Management", slug: "case-management" },
  "cultural competency": { title: "Cultural Competency", slug: "cultural-competency" },
  "vulnerable population": { title: "Vulnerable Population Care", slug: "vulnerable-populations" },
  "telehealth": { title: "Telehealth Nursing", slug: "telehealth-nursing" },
  "pain management": { title: "Pain Management", slug: "pain-management" },
  "pain assessment": { title: "Pain Assessment", slug: "pain-assessment" },
  "symptom management": { title: "Symptom Management", slug: "symptom-management" },
  "dyspnea": { title: "Dyspnea Management", slug: "dyspnea-management" },
  "nausea": { title: "Nausea & Vomiting Management", slug: "nausea-management" },
  "delirium": { title: "Delirium Assessment", slug: "delirium-assessment" },
  "advance directive": { title: "Advance Care Planning", slug: "advance-care-planning" },
  "advance care": { title: "Advance Care Planning", slug: "advance-care-planning" },
  "goals of care": { title: "Goals of Care Conversations", slug: "goals-of-care" },
  "spiritual care": { title: "Spiritual Care", slug: "spiritual-care" },
  "grief": { title: "Grief & Bereavement", slug: "grief-bereavement" },
  "bereavement": { title: "Grief & Bereavement", slug: "grief-bereavement" },
  "hospice": { title: "Hospice Care", slug: "hospice-care" },
  "end of life": { title: "End-of-Life Care", slug: "end-of-life-care" },
  "end-of-life": { title: "End-of-Life Care", slug: "end-of-life-care" },
  "comfort care": { title: "Comfort Care", slug: "comfort-care" },
  "opioid": { title: "Opioid Management", slug: "opioid-management" },
  "dnr": { title: "DNR & POLST", slug: "dnr-polst" },
  "polst": { title: "DNR & POLST", slug: "dnr-polst" },
  "workplace hazard": { title: "Workplace Hazard Assessment", slug: "workplace-hazards" },
  "ergonomic": { title: "Ergonomic Assessment", slug: "ergonomic-assessment" },
  "osha": { title: "OSHA Regulations", slug: "osha-regulations" },
  "bloodborne": { title: "Bloodborne Pathogen Exposure", slug: "bloodborne-pathogens" },
  "workers compensation": { title: "Workers Compensation", slug: "workers-compensation" },
  "workplace violence": { title: "Workplace Violence Prevention", slug: "workplace-violence" },
  "hearing conservation": { title: "Hearing Conservation", slug: "hearing-conservation" },
  "respiratory protection": { title: "Respiratory Protection", slug: "respiratory-protection" },
  "infection control": { title: "Infection Control", slug: "infection-control" },
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

interface CommunityNursingSummary {
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
  return crypto.createHash("sha256").update(`community:${tier}:${stem}`).digest("hex").slice(0, 32);
}

function assignDifficulty(batchIndex: number, totalInBatch: number): string {
  const easyCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.easy);
  const modCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.moderate);
  if (batchIndex < easyCount) return "easy";
  if (batchIndex < easyCount + modCount) return "moderate";
  return "hard";
}

function buildCommunityPrompt(
  subspecialty: string,
  topic: string,
  count: number,
  difficulties: string[],
  existingStems: string[],
): { system: string; user: string } {
  const scope = COMMUNITY_SCOPE[subspecialty] || COMMUNITY_SCOPE["Public Health Nursing"];

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
8. Include specific patient data (vital signs, lab values, assessment findings, demographic data, community data) in each scenario.
9. Focus on NCLEX-style clinical judgment: assessment, prioritization, safety, interventions.

Topic focus for this batch: ${topic}

You will generate exactly ${count} questions for ${subspecialty} - ${topic}.

Difficulty distribution:
${diffBlock}

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object schema:
{
  "stem": "A detailed clinical scenario question set in the ${subspecialty} (min 60 chars)",
  "scenario": "Extended clinical context with specific patient/community data",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correct_answer": "B",
  "difficulty": "easy" | "moderate" | "hard",
  "domain": "Community & Other Nursing",
  "topic": "${topic}",
  "subtopic": "${subspecialty}",
  "rationale": "Detailed 80-150 word rationale: why correct + why each distractor wrong + clinical application + nursing intervention",
  "clinical_pearl": "A concise clinical pearl for exam prep",
  "body_system": "Related body system or practice area"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer letter.
${antiDupe}

Return EXACTLY ${count} items. JSON only. No extra text.`;

  const user = `Generate ${count} unique ${subspecialty} exam questions focused on ${topic}. Each must have a distinct clinical scenario with specific patient data, community health data, or workplace data relevant to the ${subspecialty} setting.`;

  return { system, user };
}

function matchCommunityImages(stem: string, rationale: string, topic: string, subspecialty: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] {
  const searchText = `${stem} ${rationale} ${topic} ${subspecialty}`.toLowerCase();
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] = [];

  for (const [keyword, images] of Object.entries(COMMUNITY_IMAGE_KEYWORDS)) {
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

function findCommunityLessonLink(stem: string, rationale: string, topic: string, subspecialty: string): { title: string; url: string } | null {
  const searchText = `${stem} ${rationale} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(COMMUNITY_LESSON_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-community-nursing`,
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

export async function runCommunityNursingSubspecialty(
  subspecialty: string,
  targetCount: number = 500,
  onProgress?: (p: ExpansionProgress) => void,
): Promise<CommunityNursingSummary> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[CommunityNursing] Starting ${subspecialty} expansion: ${targetCount} questions, targeting ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"} database`);

  try {
    const testResult = await dbPool.query("SELECT 1 as connected");
    console.log(`[CommunityNursing] Database connection verified: ${testResult.rows[0]?.connected === 1 ? "OK" : "FAILED"}`);
  } catch (connErr: any) {
    console.error(`[CommunityNursing] Database connection FAILED:`, connErr.message);
    throw new Error(`Cannot connect to database: ${connErr.message}`);
  }

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const topics = COMMUNITY_TOPICS[subspecialty] || COMMUNITY_TOPICS["Public Health Nursing"];
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

      console.log(`[CommunityNursing] Batch ${batchNumber}: ${thisBatchSize} questions for ${subspecialty} - ${topic}`);

      try {
        await dbPool.query(
          `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [
            `community-nursing-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
            "community_nursing_batch_start",
            JSON.stringify({ subspecialty, batchNumber, topic, batchSize: thisBatchSize, totalInserted }),
          ]
        );
      } catch (logErr: any) {
        console.error(`[CommunityNursing] Event log error:`, logErr.message);
      }

      const difficulties: string[] = [];
      for (let i = 0; i < thisBatchSize; i++) {
        difficulties.push(assignDifficulty(i, thisBatchSize));
      }

      const { system, user } = buildCommunityPrompt(subspecialty, topic, thisBatchSize, difficulties, recentStems);

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
          console.log(`[CommunityNursing] Attempt ${attempt + 1}: 0 items parsed for ${topic}, retrying...`);
        } catch (err: any) {
          console.error(`[CommunityNursing] Attempt ${attempt + 1} failed for ${topic}:`, err.message);
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

        const difficulty = item.difficulty || "moderate";
        const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
        const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
        const lessonLink = findCommunityLessonLink(item.stem, item.rationale, item.topic || topic, subspecialty);
        const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
        const images = matchCommunityImages(item.stem, item.rationale, item.topic || topic, subspecialty);

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

          const tagsArray = ["Community & Other Nursing", subspecialty, topic, masteryCategory, `difficulty_${difficulty}`];

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
              "COMMUNITY",
              "multiple_choice",
              "approved",
              item.stem,
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              rationaleWithLink,
              difficultyNum,
              tagsArray,
              item.body_system || "Community Health",
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
          const flashcardHash = computeContentHash(item.stem, `community-${subspecialty}`);

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
              "community_nursing_expansion",
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
              item.body_system || "Community Health",
              item.topic || topic,
              subspecialty,
              "BOTH",
              true,
              `Community & Other - ${subspecialty}`,
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
            console.error(`[CommunityNursing] Insert error:`, err.message);
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
        tier: `community-${subspecialty}`,
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
            `community-nursing-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
            "community_nursing_batch_complete",
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
        console.error(`[CommunityNursing] Event log error:`, logErr.message);
      }

      console.log(`[CommunityNursing] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards, ${batchImages} images, ${batchLessonLinks} lessons, ${batchDuplicates} duplicates. Total: ${totalInserted}/${targetCount}`);

      await new Promise(r => setTimeout(r, 500));
    }
  }

  const completedAt = new Date().toISOString();

  const summary: CommunityNursingSummary = {
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
        `community-nursing-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`,
        "community_nursing_subspecialty_complete",
        JSON.stringify(summary),
      ]
    );
  } catch (logErr: any) {
    console.error(`[CommunityNursing] Event log error:`, logErr.message);
  }

  console.log(`[CommunityNursing] ${subspecialty} complete: ${totalInserted}/${targetCount} questions, ${totalFlashcards} flashcards`);
  return summary;
}

export async function runFullCommunityNursingExpansion(
  onProgress?: (p: ExpansionProgress) => void,
): Promise<{ subspecialties: Record<string, CommunityNursingSummary>; grandTotal: any }> {
  console.log(`[CommunityNursing] Starting full 2,500-question Community & Other Nursing expansion across 5 subspecialties`);

  const results: Record<string, CommunityNursingSummary> = {};

  for (const subspecialty of COMMUNITY_SUBSPECIALTIES) {
    results[subspecialty] = await runCommunityNursingSubspecialty(subspecialty, 500, onProgress);
  }

  const grandTotal = {
    totalQuestions: Object.values(results).reduce((s, r) => s + r.totalQuestionsInserted, 0),
    totalFlashcards: Object.values(results).reduce((s, r) => s + r.totalFlashcardsCreated, 0),
    totalImages: Object.values(results).reduce((s, r) => s + r.totalImagesAttached, 0),
    totalLessonLinks: Object.values(results).reduce((s, r) => s + r.totalLessonLinksAdded, 0),
    totalDuplicates: Object.values(results).reduce((s, r) => s + r.totalDuplicatesRejected, 0),
    target: 2500,
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
        "community-nursing-full",
        "community_nursing_full_expansion_complete",
        JSON.stringify({ subspecialties: results, grandTotal }),
      ]
    );
  } catch (logErr: any) {
    console.error(`[CommunityNursing] Event log error:`, logErr.message);
  }

  console.log(`[CommunityNursing] Full expansion complete: ${grandTotal.totalQuestions}/2500 questions, ${grandTotal.totalFlashcards} flashcards`);
  return { subspecialties: results, grandTotal };
}

export async function getCommunityNursingExpansionStatus(): Promise<any> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  const { rows: events } = await dbPool.query(
    `SELECT event_type, payload, created_at
     FROM generation_events
     WHERE generation_id LIKE 'community-nursing-%'
     ORDER BY created_at DESC
     LIMIT 50`
  );

  const { rows: questionCounts } = await dbPool.query(
    `SELECT subtopic as subspecialty, COUNT(*)::int as count
     FROM exam_questions
     WHERE exam = 'COMMUNITY' AND status = 'approved' AND career_type = 'nursing'
     GROUP BY subtopic`
  );

  const { rows: flashcardCounts } = await dbPool.query(
    `SELECT subtopic as subspecialty, COUNT(*)::int as count
     FROM flashcard_bank
     WHERE source_type = 'community_nursing_expansion'
     GROUP BY subtopic`
  );

  return {
    questionsBySubspecialty: Object.fromEntries(questionCounts.map((r: any) => [r.subspecialty, r.count])),
    flashcardsBySubspecialty: Object.fromEntries(flashcardCounts.map((r: any) => [r.subspecialty, r.count])),
    totalQuestions: questionCounts.reduce((s: number, r: any) => s + r.count, 0),
    totalFlashcards: flashcardCounts.reduce((s: number, r: any) => s + r.count, 0),
    recentEvents: events,
    validSubspecialties: [...COMMUNITY_SUBSPECIALTIES],
  };
}
