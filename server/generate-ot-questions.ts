import { getProdPool, hasSeparateProdDb } from "./db";
import crypto from "crypto";
import { runPreflightChecks, getPreflightCheckedPool } from "./environment-write-service";
import pg from "pg";

let _checkedPool: pg.Pool | null = null;
async function getPool(): Promise<pg.Pool> {
  if (!_checkedPool) {
    const target = hasSeparateProdDb() ? "production" : "development";
    _checkedPool = await getPreflightCheckedPool(target as any, "OT-QuestionGenerator");
  }
  return _checkedPool;
}

async function getOpenAI() {
  const OpenAI = (await import("openai")).default;
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

let openaiClient: any = null;
async function getClient() {
  if (!openaiClient) openaiClient = await getOpenAI();
  return openaiClient;
}

async function aiGenerate(systemPrompt: string, userPrompt: string): Promise<string> {
  const openai = await getClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 16000,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || "";
}

function parseJsonFromResponse(text: string): any {
  try {
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) return JSON.parse(arrMatch[0]);
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    return null;
  } catch {
    return null;
  }
}

function stemHash(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex");
}

const OT_DOMAINS = [
  "Activities of Daily Living",
  "Assistive Devices",
  "Rehabilitation Planning",
  "Neurological Rehabilitation",
  "Pediatric Development",
  "Ergonomics",
];

const DOMAIN_SUBTOPICS: Record<string, string[]> = {
  "Activities of Daily Living": ["Upper-Body Dressing", "Bathing & Hygiene", "Feeding & Swallowing", "Grooming", "Toileting", "Meal Preparation", "Home Management", "Community Mobility"],
  "Assistive Devices": ["Adaptive Equipment for ADLs", "Wheelchair Assessment", "Splinting & Orthotics", "Environmental Modifications", "Communication Aids", "Computer Access", "Prosthetic Training", "Seating & Positioning"],
  "Rehabilitation Planning": ["Goal Setting & Treatment Planning", "Discharge Planning", "Functional Outcome Measures", "Client-Centered Intervention", "Group Therapy", "Home Exercise Programs", "Caregiver Training", "Return-to-Work Planning"],
  "Neurological Rehabilitation": ["Stroke Rehabilitation", "Traumatic Brain Injury", "Spinal Cord Injury", "Multiple Sclerosis", "Parkinson's Disease", "Cerebral Palsy", "Peripheral Neuropathy", "Neurodegenerative Disease"],
  "Pediatric Development": ["Sensory Integration", "Fine Motor Development", "Visual-Motor Integration", "Handwriting Remediation", "Play-Based Assessment", "School-Based OT", "Autism Spectrum Interventions", "Developmental Milestones"],
  "Ergonomics": ["Workplace Assessment", "Repetitive Strain Prevention", "Workstation Design", "Body Mechanics", "Job Demands Analysis", "Functional Capacity Evaluation", "Return-to-Work Ergonomics", "Cumulative Trauma Prevention"],
};

const LESSON_SLUGS: Record<string, string> = {
  "Activities of Daily Living": "adl-performance",
  "Assistive Devices": "assistive-technology",
  "Rehabilitation Planning": "intervention-planning",
  "Neurological Rehabilitation": "neurological-rehab",
  "Pediatric Development": "pediatric-development",
  "Ergonomics": "ergonomics-workplace",
};

const SYSTEM_PROMPT = `You are a senior occupational therapy psychometrician writing NBCOT/Canadian OT exam questions.
Every question MUST be a clinical scenario with patient diagnosis, functional limitations, rehab goals, and ADL impairments.
Output ONLY valid JSON array. No markdown, no commentary.`;

function buildUserPrompt(domain: string, count: number, variant: number): string {
  const subtopics = DOMAIN_SUBTOPICS[domain] || [];
  const offset = variant % subtopics.length;
  const selected = [];
  for (let i = 0; i < Math.min(4, subtopics.length); i++) {
    selected.push(subtopics[(offset + i) % subtopics.length]);
  }

  return `Generate ${count} OT exam questions for "${domain}", focusing on: ${selected.join(", ")}.

Each question: clinical vignette with patient age, diagnosis, functional limitations, ADL impairments.
Example: "A 68-year-old post-stroke patient has difficulty with upper-body dressing due to limited shoulder flexion. Which adaptive strategy should the OT implement first?"

Difficulty: 30% moderate(3), 50% hard(4), 20% very challenging(5). Types: 80% MCQ (4 options), 20% SATA (5-6 options).

Return JSON array:
[{"stem":"...","options":[{"id":0,"text":"A"},{"id":1,"text":"B"},{"id":2,"text":"C"},{"id":3,"text":"D"}],"correctAnswer":0,"rationaleLong":"Detailed rationale (300+ words) covering functional limitation, therapy approach, intervention priority, why distractors wrong, clinical pearl","learningObjective":"...","blueprintCategory":"${domain}","subtopic":"...","difficulty":4,"cognitiveLevel":"application","questionType":"MCQ","examTrap":"...","clinicalPearls":["...","...","..."],"safetyNote":null,"distractorRationales":[{"id":0,"rationale":"..."},{"id":1,"rationale":"..."},{"id":2,"rationale":"..."},{"id":3,"rationale":"..."}]}]`;
}

async function loadExistingHashes(): Promise<Set<string>> {
  const pool = await getPool();
  const result = await pool.query(`SELECT stem FROM allied_questions WHERE career_type = 'occupationalTherapy'`);
  const hashes = new Set<string>();
  for (const row of result.rows) hashes.add(stemHash(row.stem));
  return hashes;
}

async function generateAndInsertChunk(domain: string, count: number, variant: number, batchId: string, existingHashes: Set<string>): Promise<{ inserted: number; flashcards: number; rejected: number; duplicates: number }> {
  let inserted = 0, flashcards = 0, rejected = 0, duplicates = 0;
  const pool = await getPool();

  const content = await aiGenerate(SYSTEM_PROMPT, buildUserPrompt(domain, count, variant));
  const parsed = parseJsonFromResponse(content);
  if (!Array.isArray(parsed)) return { inserted, flashcards, rejected, duplicates };

  for (const q of parsed) {
    if (!q.stem || !q.options || !Array.isArray(q.options) || q.options.length < 4) { rejected++; continue; }

    const hash = stemHash(q.stem);
    if (existingHashes.has(hash)) { duplicates++; continue; }

    const rationale = q.rationaleLong || q.rationale || "";
    const correctAnswer = typeof q.correctAnswer === "number" ? q.correctAnswer : 0;

    try {
      const qRes = await pool.query(
        `INSERT INTO allied_questions (career_type, batch_id, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, clinical_pearls, safety_note, distractor_rationales, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'approved') RETURNING id`,
        ["occupationalTherapy", batchId, q.stem, JSON.stringify(q.options), correctAnswer, rationale,
         q.learningObjective || "", q.blueprintCategory || domain, q.subtopic || "",
         q.difficulty || 3, q.cognitiveLevel || "application", q.questionType || "MCQ",
         q.examTrap || null, JSON.stringify(q.clinicalPearls || []),
         q.safetyNote || null, JSON.stringify(q.distractorRationales || [])]
      );
      existingHashes.add(hash);
      const questionId = qRes.rows[0].id;
      inserted++;

      const slug = LESSON_SLUGS[domain] || "general";
      const subtopic = q.subtopic || domain;
      const pearls = Array.isArray(q.clinicalPearls) ? q.clinicalPearls : [];
      const pearlText = pearls.length > 0 ? `\n\nClinical Pearl: ${pearls[0]}` : "";
      const lessonLink = `${subtopic} → /occupational-therapy/lessons/${slug}`;

      await pool.query(
        `INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, clinical_pearl, blueprint_category, subtopic)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ["occupationalTherapy", questionId, q.questionType === "SATA" ? "select_all" : "concept",
         q.stem.substring(0, 500), `${rationale.substring(0, 800)}${pearlText}\n\n${lessonLink}`,
         rationale.substring(0, 1000), pearls[0] || null, q.blueprintCategory || domain, subtopic]
      );
      flashcards++;
    } catch (err: any) {
      rejected++;
    }
  }

  return { inserted, flashcards, rejected, duplicates };
}

async function runVerification(): Promise<void> {
  console.log("\n=== VERIFICATION ===");
  const pool = await getPool();
  const t = await pool.query(`SELECT COUNT(*) as c FROM allied_questions WHERE career_type='occupationalTherapy' AND status='approved'`);
  console.log(`Total OT questions: ${t.rows[0].c}`);
  const d = await pool.query(`SELECT blueprint_category, COUNT(*) as c FROM allied_questions WHERE career_type='occupationalTherapy' AND status='approved' GROUP BY blueprint_category ORDER BY c DESC`);
  console.log("Domain distribution:");
  d.rows.forEach((r: any) => console.log(`  ${r.blueprint_category}: ${r.c}`));
  const df = await pool.query(`SELECT difficulty, COUNT(*) as c FROM allied_questions WHERE career_type='occupationalTherapy' AND status='approved' GROUP BY difficulty ORDER BY difficulty`);
  console.log("Difficulty distribution:");
  df.rows.forEach((r: any) => console.log(`  Level ${r.difficulty}: ${r.c}`));
  const fc = await pool.query(`SELECT COUNT(*) as c FROM allied_flashcards WHERE career_type='occupationalTherapy'`);
  console.log(`Total flashcards: ${fc.rows[0].c}`);
  const qt = await pool.query(`SELECT question_type, COUNT(*) as c FROM allied_questions WHERE career_type='occupationalTherapy' AND status='approved' GROUP BY question_type ORDER BY c DESC`);
  console.log("Question types:");
  qt.rows.forEach((r: any) => console.log(`  ${r.question_type}: ${r.c}`));
}

async function main() {
  const startChunk = parseInt(process.argv[2] || "0", 10);
  const endChunk = parseInt(process.argv[3] || "120", 10);
  const CHUNK_SIZE = 10;
  const TOTAL_CHUNKS = 120;

  console.log(`=== OT Generation: Chunks ${startChunk + 1}-${endChunk} of ${TOTAL_CHUNKS} (${CHUNK_SIZE} q/chunk) ===`);
  const existingHashes = await loadExistingHashes();
  console.log(`Existing hashes: ${existingHashes.size}`);

  let total = { inserted: 0, flashcards: 0, rejected: 0, duplicates: 0 };
  const pool = await getPool();

  const batchRunRes = await pool.query(
    `INSERT INTO allied_batch_runs (career_type, requested_count, status) VALUES ('occupationalTherapy', $1, 'running') RETURNING id`,
    [(endChunk - startChunk) * CHUNK_SIZE]
  );
  const batchId = batchRunRes.rows[0].id;

  for (let i = startChunk; i < endChunk; i++) {
    const domIdx = Math.floor(i / 20) % OT_DOMAINS.length;
    const domain = OT_DOMAINS[domIdx];

    const r = await generateAndInsertChunk(domain, CHUNK_SIZE, i, batchId, existingHashes);
    total.inserted += r.inserted;
    total.flashcards += r.flashcards;
    total.rejected += r.rejected;
    total.duplicates += r.duplicates;
    console.log(`Chunk ${i + 1}/${TOTAL_CHUNKS} [${domain}]: +${r.inserted}q | Total: ${total.inserted}q ${total.flashcards}fc`);
  }

  await pool.query(
    `UPDATE allied_batch_runs SET status='completed', generated_count=$1, accepted_count=$2, rejected_count=$3, completed_at=NOW() WHERE id=$4`,
    [total.inserted + total.rejected + total.duplicates, total.inserted, total.rejected + total.duplicates, batchId]
  );

  console.log(`\nSession: ${total.inserted}q, ${total.flashcards}fc, ${total.rejected}rej, ${total.duplicates}dup`);

  if (endChunk >= TOTAL_CHUNKS) {
    await runVerification();
  }

  const endPool = await getPool();
  await endPool.end();
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
