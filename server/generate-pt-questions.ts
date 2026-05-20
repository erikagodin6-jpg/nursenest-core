import crypto from "crypto";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 5 });

async function getOpenAI() {
  const OpenAI = (await import("openai")).default;
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function stemHash(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex");
}

function parseJsonFromResponse(text: string): any {
  try {
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) return JSON.parse(arrMatch[0]);
    return null;
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface DomainConfig {
  domain: string;
  targetCount: number;
  subtopics: string[];
}

const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    domain: "Musculoskeletal",
    targetCount: 140,
    subtopics: [
      "Shoulder impingement and rotator cuff pathology",
      "Knee ligament injuries (ACL, PCL, MCL, LCL)",
      "Lumbar disc herniation and radiculopathy",
      "Cervical spine dysfunction and whiplash",
      "Hip osteoarthritis and total hip arthroplasty rehab",
      "Total knee arthroplasty rehabilitation",
      "Ankle sprains and chronic instability",
      "Fracture management and bone healing",
      "Tendinopathy (Achilles, patellar, lateral epicondyle)",
      "Temporomandibular joint dysfunction",
      "Thoracic outlet syndrome",
      "Carpal tunnel syndrome and nerve entrapments",
      "Scoliosis assessment and management",
      "Sacroiliac joint dysfunction",
      "Muscle strains and contusions",
      "Manual therapy techniques and indications",
      "Joint mobilization grading and application",
      "Soft tissue mobilization approaches",
      "Therapeutic exercise prescription for orthopedic conditions",
      "Postural assessment and correction",
      "Ergonomic assessment and workplace modification",
      "Sports-specific rehabilitation protocols",
      "Pediatric orthopedic conditions",
      "Geriatric musculoskeletal management",
      "Rheumatoid arthritis and inflammatory conditions",
      "Osteoporosis screening and exercise prescription",
      "Frozen shoulder (adhesive capsulitis)",
      "Plantar fasciitis and foot biomechanics",
      "Spinal stenosis management",
      "Myofascial pain syndrome",
    ],
  },
  {
    domain: "Neuromuscular",
    targetCount: 100,
    subtopics: [
      "Stroke rehabilitation and motor recovery",
      "Spinal cord injury management (complete and incomplete)",
      "Traumatic brain injury rehabilitation",
      "Multiple sclerosis management",
      "Parkinson disease and movement disorders",
      "Peripheral neuropathy assessment and treatment",
      "Vestibular rehabilitation",
      "Balance and fall prevention strategies",
      "Cerebral palsy management across lifespan",
      "Guillain-Barré syndrome rehabilitation",
      "Amyotrophic lateral sclerosis management",
      "Neuroplasticity principles in rehabilitation",
      "Constraint-induced movement therapy",
      "Task-specific training approaches",
      "Proprioceptive neuromuscular facilitation",
      "Neurodevelopmental treatment approaches",
      "Gait training after neurological injury",
      "Spasticity management",
      "Cognitive deficits impact on rehabilitation",
      "Autonomic dysreflexia recognition and management",
      "Cranial nerve assessment",
      "Dermatome and myotome testing",
      "Coordination and ataxia assessment",
      "Wheelchair prescription and seating",
      "Orthotic and assistive device selection",
    ],
  },
  {
    domain: "Cardiopulmonary",
    targetCount: 70,
    subtopics: [
      "Cardiac rehabilitation phases and protocols",
      "Heart failure exercise prescription",
      "Myocardial infarction recovery and risk stratification",
      "COPD pulmonary rehabilitation",
      "Asthma management and exercise considerations",
      "Vital sign interpretation during exercise",
      "ECG rhythm recognition for PTs",
      "Oxygen therapy and monitoring",
      "Airway clearance techniques",
      "Chest physical therapy",
      "Exercise tolerance testing and interpretation",
      "Peripheral arterial disease and claudication",
      "Hypertension management through exercise",
      "Metabolic equivalent (MET) levels and activity prescription",
      "Rate pressure product monitoring",
      "Cardiac surgery post-operative management",
      "Pulmonary function test interpretation",
      "Lymphedema management",
      "Deep vein thrombosis prevention and recognition",
      "Respiratory muscle training",
    ],
  },
  {
    domain: "Integumentary",
    targetCount: 45,
    subtopics: [
      "Wound healing phases and assessment",
      "Pressure injury classification and prevention",
      "Burn rehabilitation and scar management",
      "Diabetic foot ulcer management",
      "Venous insufficiency ulcers",
      "Arterial ulcer assessment and management",
      "Wound debridement techniques",
      "Wound dressing selection",
      "Skin graft and flap management",
      "Edema management techniques",
      "Compression therapy principles",
      "Thermal modalities for tissue healing",
      "Electrical stimulation for wound healing",
      "Scar tissue mobilization",
      "Infection recognition and precautions",
    ],
  },
  {
    domain: "Non-System/Professional Responsibilities",
    targetCount: 45,
    subtopics: [
      "Ethical decision-making in physical therapy",
      "APTA Code of Ethics application",
      "Informed consent and patient autonomy",
      "Documentation standards (SOAP notes, functional outcomes)",
      "Evidence-based practice principles",
      "Clinical research interpretation",
      "Patient education strategies",
      "Cultural competence in patient care",
      "Interprofessional collaboration",
      "Supervision of PTAs and support staff",
      "Medicare and insurance regulations",
      "HIPAA compliance and patient privacy",
      "Risk management and patient safety",
      "Quality improvement principles",
      "Outcome measurement tools and psychometrics",
      "Discharge planning and continuity of care",
      "Telehealth in physical therapy",
      "Health promotion and wellness",
      "Advocacy and health policy",
      "Professional development and lifelong learning",
    ],
  },
];

const SYSTEM_PROMPT = `You are a senior physical therapy psychometrician and NPTE/PCE item writer with 20+ years of experience.
Generate clinical vignette-style physical therapy exam questions. CRITICAL RULES:
1. Every question MUST use clinical scenario format with patient presentation, examination findings, functional limitations, treatment decisions.
2. Each rationaleLong MUST be minimum 300 words with biomechanical/physiological reasoning, differential diagnosis, intervention rationale, and why each distractor is incorrect.
3. Avoid simple recall - use applied reasoning and clinical decision-making.
4. Include plausible distractors representing common clinical reasoning errors.
5. Use patient demographics, vital signs, specific clinical findings in every stem.
6. Output ONLY valid JSON array. No commentary, no markdown fences, no wrapping.`;

function buildUserPrompt(domain: string, subtopics: string[], count: number, difficultyNum: number, batchIndex: number): string {
  const diffLabel = difficultyNum === 3 ? "moderate" : difficultyNum === 4 ? "hard" : "very challenging";
  const cogLevel = difficultyNum === 3 ? "application" : difficultyNum === 4 ? "analysis" : "synthesis";

  const selectedSubtopics = [];
  for (let i = 0; i < Math.min(count, subtopics.length); i++) {
    selectedSubtopics.push(subtopics[(batchIndex * 3 + i) % subtopics.length]);
  }

  return `Generate exactly ${count} UNIQUE clinical vignette PT exam questions for "${domain}" domain.
Difficulty: ${difficultyNum}/5 (${diffLabel}). Cognitive level: ${cogLevel}.
Batch ${batchIndex + 1} - ensure questions are COMPLETELY DIFFERENT from previous batches.

SUBTOPICS (cover these, vary across batch): ${selectedSubtopics.join(", ")}

Return a JSON array (NO markdown, NO commentary):
[{
  "stem": "Clinical vignette with patient demographics, chief complaint, exam findings, functional limitations, then the question",
  "options": ["A text", "B text", "C text", "D text"],
  "correctAnswer": 0,
  "rationaleLong": "300+ words: correct answer reasoning, why each distractor wrong, differential dx, clinical pearls, exam tips",
  "learningObjective": "One sentence",
  "subtopic": "specific subtopic",
  "cognitiveLevel": "${cogLevel}",
  "questionType": "MCQ",
  "examTrap": "Common mistake",
  "clinicalPearls": ["Pearl 1", "Pearl 2", "Pearl 3"],
  "safetyNote": "Safety note or null",
  "distractorRationales": ["Why A wrong/right", "Why B wrong/right", "Why C wrong/right", "Why D wrong/right"]
}]`;
}

async function generateBatch(openai: any, domain: string, subtopics: string[], count: number, difficultyNum: number, batchIndex: number, retryCount = 0): Promise<any[]> {
  const userPrompt = buildUserPrompt(domain, subtopics, count, difficultyNum, batchIndex);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 16000,
      temperature: 0.8 + (batchIndex * 0.01),
    });
    const content = response.choices[0]?.message?.content || "";
    const parsed = parseJsonFromResponse(content);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      if (retryCount < 2) {
        await sleep(2000);
        return generateBatch(openai, domain, subtopics, count, difficultyNum, batchIndex, retryCount + 1);
      }
      return [];
    }
    return parsed;
  } catch (err: any) {
    if (retryCount < 2) {
      console.log(`  [Retry] ${err.message}`);
      await sleep(3000);
      return generateBatch(openai, domain, subtopics, count, difficultyNum, batchIndex, retryCount + 1);
    }
    console.error(`  Failed: ${err.message}`);
    return [];
  }
}

async function loadExistingHashes(): Promise<Set<string>> {
  const r = await pool.query("SELECT stem FROM allied_questions WHERE career_type = 'physicalTherapy'");
  const hashes = new Set<string>();
  for (const row of r.rows) hashes.add(stemHash(row.stem));
  return hashes;
}

async function getExistingCounts(): Promise<Record<string, Record<number, number>>> {
  const r = await pool.query(
    "SELECT blueprint_category, difficulty, COUNT(*)::int as c FROM allied_questions WHERE career_type = 'physicalTherapy' AND status = 'approved' GROUP BY blueprint_category, difficulty"
  );
  const counts: Record<string, Record<number, number>> = {};
  for (const row of r.rows) {
    if (!counts[row.blueprint_category]) counts[row.blueprint_category] = {};
    counts[row.blueprint_category][row.difficulty] = row.c;
  }
  return counts;
}

async function insertQuestion(q: any, existingHashes: Set<string>): Promise<string | null> {
  if (!q.stem || !q.options || q.options.length < 4) return null;
  const hash = stemHash(q.stem);
  if (existingHashes.has(hash)) return null;
  const rationaleLong = q.rationaleLong || q.rationale || "";
  if (rationaleLong.split(/\s+/).filter(Boolean).length < 80) return null;
  const correctAnswer = typeof q.correctAnswer === "number" ? q.correctAnswer : 0;
  if (correctAnswer < 0 || correctAnswer > 3) return null;

  try {
    const result = await pool.query(
      `INSERT INTO allied_questions (career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, clinical_pearls, safety_note, distractor_rationales, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'approved') RETURNING id`,
      [
        "physicalTherapy", q.stem, JSON.stringify(q.options), correctAnswer, rationaleLong,
        q.learningObjective || "", q.blueprintCategory || "General", q.subtopic || q.subDomain || "",
        q.difficulty || 3, q.cognitiveLevel || "application", q.questionType || "MCQ",
        q.examTrap || null, JSON.stringify(q.clinicalPearls || []), q.safetyNote || null,
        JSON.stringify(q.distractorRationales || []),
      ]
    );
    existingHashes.add(hash);
    return result.rows[0]?.id || null;
  } catch (err: any) {
    if (!err.message?.includes("duplicate")) {
      console.error(`  DB insert error [${q.blueprintCategory}]: ${err.message}`);
    }
    return null;
  }
}

async function insertFlashcard(questionId: string, q: any): Promise<boolean> {
  const domain = q.blueprintCategory || "Physical Therapy";
  const pearls = q.clinicalPearls || [];
  const pearlText = Array.isArray(pearls) ? pearls.join("; ") : String(pearls);
  const front = `${domain}: ${(q.stem || "").substring(0, 250).replace(/\n/g, " ")}`;
  const back = `${(q.rationaleLong || q.rationale || "").substring(0, 400)}${pearlText ? `\n\nClinical Pearl: ${pearlText}` : ""}`;

  try {
    await pool.query(
      `INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, clinical_pearl, blueprint_category, subtopic)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING`,
      ["physicalTherapy", questionId, "exam_concept", front, back, q.rationaleLong || q.rationale || "", pearlText || null, domain, q.subtopic || q.subDomain || null]
    );
    return true;
  } catch (err: any) {
    console.log(`  Flashcard insert error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("=== PT Question Bank Generator (Resumable) ===");
  const openai = await getOpenAI();
  const existingHashes = await loadExistingHashes();
  const existingCounts = await getExistingCounts();
  console.log(`[Init] ${existingHashes.size} existing PT questions found`);

  let totalInserted = 0;
  let totalFlashcards = 0;

  for (const domainConfig of DOMAIN_CONFIGS) {
    const domainExisting = existingCounts[domainConfig.domain] || {};
    const domainTotal = Object.values(domainExisting).reduce((a, b) => a + b, 0);
    const remaining = domainConfig.targetCount - domainTotal;

    if (remaining <= 0) {
      console.log(`\n[${domainConfig.domain}] Already at target (${domainTotal}/${domainConfig.targetCount}), skipping`);
      continue;
    }

    console.log(`\n--- ${domainConfig.domain}: need ${remaining} more (have ${domainTotal}/${domainConfig.targetCount}) ---`);

    const moderateTarget = Math.round(domainConfig.targetCount * 0.30);
    const hardTarget = Math.round(domainConfig.targetCount * 0.50);
    const veryHardTarget = domainConfig.targetCount - moderateTarget - hardTarget;

    const difficultyTargets = [
      { diffNum: 3, target: moderateTarget, existing: domainExisting[3] || 0 },
      { diffNum: 4, target: hardTarget, existing: domainExisting[4] || 0 },
      { diffNum: 5, target: veryHardTarget, existing: domainExisting[5] || 0 },
    ];

    for (const dt of difficultyTargets) {
      let needed = dt.target - dt.existing;
      if (needed <= 0) {
        console.log(`  [Diff ${dt.diffNum}] Already at target (${dt.existing}/${dt.target})`);
        continue;
      }

      console.log(`  [Diff ${dt.diffNum}] Need ${needed} more (have ${dt.existing}/${dt.target})`);
      let batchIndex = Math.floor(dt.existing / 8);
      let consecutiveEmpty = 0;

      while (needed > 0 && consecutiveEmpty < 3) {
        const batchSize = Math.min(needed + 3, 12);
        process.stdout.write(`    Batch ${batchIndex + 1} (${batchSize}q)...`);

        const questions = await generateBatch(openai, domainConfig.domain, domainConfig.subtopics, batchSize, dt.diffNum, batchIndex);

        let batchInserted = 0;
        for (const q of questions) {
          q.blueprintCategory = domainConfig.domain;
          q.difficulty = dt.diffNum;
          const qId = await insertQuestion(q, existingHashes);
          if (qId) {
            batchInserted++;
            const ok = await insertFlashcard(qId, q);
            if (ok) totalFlashcards++;
          }
        }

        totalInserted += batchInserted;
        needed -= batchInserted;
        console.log(` → ${batchInserted} inserted (${needed} remaining)`);

        if (batchInserted === 0) {
          consecutiveEmpty++;
        } else {
          consecutiveEmpty = 0;
        }

        batchIndex++;
        if (needed > 0) await sleep(1000);
      }
    }
  }

  console.log("\n=== RESULTS ===");
  console.log(`New questions inserted: ${totalInserted}`);
  console.log(`New flashcards created: ${totalFlashcards}`);

  const verifyQ = await pool.query(
    "SELECT blueprint_category, difficulty, COUNT(*)::int as c FROM allied_questions WHERE career_type = 'physicalTherapy' AND status = 'approved' GROUP BY blueprint_category, difficulty ORDER BY blueprint_category, difficulty"
  );
  console.log("\n--- Domain x Difficulty Breakdown ---");
  const domainTotals: Record<string, number> = {};
  const diffTotals: Record<number, number> = {};
  for (const row of verifyQ.rows) {
    console.log(`  ${row.blueprint_category} | Diff ${row.difficulty}: ${row.c}`);
    domainTotals[row.blueprint_category] = (domainTotals[row.blueprint_category] || 0) + row.c;
    diffTotals[row.difficulty] = (diffTotals[row.difficulty] || 0) + row.c;
  }

  const grandTotal = Object.values(domainTotals).reduce((a, b) => a + b, 0);
  console.log("\n--- Domain Totals ---");
  for (const [d, c] of Object.entries(domainTotals)) {
    console.log(`  ${d}: ${c} (${((c / grandTotal) * 100).toFixed(1)}%)`);
  }
  console.log("\n--- Difficulty Distribution ---");
  for (const [d, c] of Object.entries(diffTotals)) {
    console.log(`  Difficulty ${d}: ${c} (${((c / grandTotal) * 100).toFixed(1)}%)`);
  }

  const totalQ = await pool.query("SELECT COUNT(*)::int as c FROM allied_questions WHERE career_type = 'physicalTherapy' AND status = 'approved'");
  const totalF = await pool.query("SELECT COUNT(*)::int as c FROM allied_flashcards WHERE career_type = 'physicalTherapy'");
  console.log(`\nTotal approved PT questions: ${totalQ.rows[0].c}`);
  console.log(`Total PT flashcards: ${totalF.rows[0].c}`);

  await pool.end();
}

main().catch(err => { console.error("Fatal:", err); pool.end(); process.exit(1); });
