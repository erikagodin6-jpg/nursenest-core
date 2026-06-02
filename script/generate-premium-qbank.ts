import OpenAI from "openai";
import { pool } from "../server/storage";
import crypto from "crypto";
import { TIER_GENERATION_PROMPTS } from "../shared/tier-config";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const BASE_OUTPUT_FORMAT = `
For EACH question you must output a JSON object with these exact fields:
- exam_level: "RPN" or "RN" or "NP"
- topic: specific clinical topic
- system: body system (Cardiovascular, Respiratory, Neurological, Endocrine, GI, Renal, Hematology, Musculoskeletal, Infectious Disease, Maternity, Pediatric, Mental Health, Pharmacology, Critical Care)
- difficulty: 1-5 (1=Easy, 2=Moderate, 3=Hard, 4=Very Hard, 5=Expert)
- question_type: "MCQ" or "SATA" or "Priority" or "Next Best Action"
- framework_used: the clinical decision framework that solves this question
- clinical_trap: brief description of the common mistake students make
- scenario: the clinical vignette (patient context, vitals, labs, history)
- stem: the actual question being asked
- options: array of 4 answer strings
- correct_answer_index: 0-based index of correct option
- rationale: detailed explanation of why the correct answer is right (minimum 200 words)
- distractor_rationales: object mapping option letters (A, B, C, D) to explanations of why each wrong option is tempting
- clinical_pearl: one high-yield clinical takeaway
- exam_strategy: how to approach similar questions on the exam
- memory_hook: one-sentence recall phrase for the key concept`;

function getTierSystemPrompt(tier: "rpn" | "rn" | "np"): string {
  const config = TIER_GENERATION_PROMPTS[tier];
  return `${config.systemPrompt}

${config.focusAreas}

${config.stemStyle}

${config.distractorStyle}

Rationale style: ${config.rationaleGuidance}
${BASE_OUTPUT_FORMAT}`;
}

const SYSTEM_PROMPT = getTierSystemPrompt("rn");

interface GeneratedQuestion {
  exam_level: string;
  topic: string;
  system: string;
  difficulty: number;
  question_type: string;
  framework_used: string;
  clinical_trap: string;
  scenario: string;
  stem: string;
  options: string[];
  correct_answer_index: number;
  rationale: string;
  distractor_rationales: Record<string, string>;
  clinical_pearl: string;
  exam_strategy: string;
  memory_hook: string;
}

const BATCH_CONFIGS = [
  {
    name: "Cardiovascular 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Heart Failure acute decompensation (RPN, MCQ, Moderate)
2. Acute MI chest pain assessment (RN, Priority, Hard)
3. Atrial fibrillation with rapid ventricular response (RPN, MCQ, Easy)
4. Hypertensive crisis management (RN, Next Best Action, Hard)
5. Cardiac dysrhythmia V-tach (RN, MCQ, Moderate)
Include diverse patient demographics. Each question MUST have a clinical scenario with vitals.`,
  },
  {
    name: "Respiratory 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Pneumonia with hypoxemia assessment (RPN, MCQ, Moderate)
2. COPD exacerbation vs asthma (RN, Priority, Hard)
3. Pulmonary embolism recognition (RN, MCQ, Very Hard)
4. Chest tube management post-pneumothorax (RPN, MCQ, Moderate)
5. Oxygen therapy titration (RPN, SATA, Easy)
Include diverse patient demographics. Each question MUST have a clinical scenario with vitals and SpO2.`,
  },
  {
    name: "Neurological 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Ischemic stroke tPA criteria assessment (RN, Priority, Hard)
2. Seizure management status epilepticus (RPN, MCQ, Moderate)
3. Increased intracranial pressure monitoring (RN, Next Best Action, Very Hard)
4. Spinal cord injury autonomic dysreflexia (RN, MCQ, Hard)
5. Glasgow Coma Scale assessment (RPN, MCQ, Easy)
Include diverse patient demographics. Each question MUST have a clinical scenario with neuro findings.`,
  },
  {
    name: "Mental Health 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Depression assessment and suicide risk screening (RPN, MCQ, Moderate)
2. Alcohol withdrawal DTs management (RN, Priority, Hard)
3. Schizophrenia antipsychotic medication side effects (RPN, SATA, Moderate)
4. Opioid withdrawal assessment (RPN, MCQ, Easy)
5. Delirium vs dementia differentiation (RN, MCQ, Hard)
Include diverse patient demographics. Each question MUST include behavioral observations and mental status findings.`,
  },
  {
    name: "Endocrine 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. DKA management and insulin drip (RN, Priority, Hard)
2. Hypoglycemia recognition in elderly diabetic (RPN, MCQ, Easy)
3. Thyroid storm recognition (RN, MCQ, Very Hard)
4. Addisonian crisis identification (RN, Next Best Action, Hard)
5. SIADH vs diabetes insipidus differentiation (RPN, MCQ, Moderate)
Include diverse patient demographics. Each question MUST have lab values and vitals.`,
  },
  {
    name: "Renal 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Acute kidney injury prerenal assessment (RPN, MCQ, Moderate)
2. Hyperkalemia emergency cardiac monitoring (RN, Priority, Hard)
3. Dialysis complications hypotension (RPN, MCQ, Moderate)
4. Chronic kidney disease diet teaching (RPN, SATA, Easy)
5. Hyponatremia with seizure risk (RN, MCQ, Hard)
Include diverse patient demographics. Each question MUST include BUN, creatinine, and electrolyte values.`,
  },
  {
    name: "GI & Pharmacology 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Upper GI bleeding with hematemesis (RN, Priority, Hard)
2. Acute pancreatitis management (RPN, MCQ, Moderate)
3. Hepatic encephalopathy lactulose administration (RPN, MCQ, Easy)
4. Digoxin toxicity recognition (RN, MCQ, Hard)
5. Heparin-induced thrombocytopenia (RN, Next Best Action, Very Hard)
Include diverse patient demographics. Each question MUST have relevant lab values.`,
  },
  {
    name: "Pharmacology 2",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Warfarin patient teaching and INR monitoring (RPN, SATA, Moderate)
2. Insulin sliding scale administration (RPN, MCQ, Easy)
3. Opioid toxicity naloxone administration (RN, Priority, Hard)
4. ACE inhibitor cough vs angioedema (RN, MCQ, Moderate)
5. Antibiotic-associated C. difficile assessment (RPN, MCQ, Moderate)
Include diverse patient demographics. Each question MUST specify medication details and relevant labs.`,
  },
  {
    name: "Maternity & Pediatric 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Preeclampsia with severe features magnesium sulfate (RN, Priority, Hard)
2. Postpartum hemorrhage fundal assessment (RPN, MCQ, Moderate)
3. Late decelerations fetal heart rate interpretation (RN, Next Best Action, Hard)
4. Pediatric croup vs epiglottitis differentiation (RPN, MCQ, Moderate)
5. Pediatric dehydration severity assessment (RPN, MCQ, Easy)
Include diverse patient demographics. Each question MUST have appropriate clinical scenario with vitals.`,
  },
  {
    name: "Critical Care 1",
    count: 5,
    prompt: `Generate exactly 5 unique nursing exam questions on these topics:
1. Sepsis early recognition and bundle compliance (RN, SATA, Hard)
2. Anaphylactic shock epinephrine administration (RPN, Priority, Hard)
3. Blood transfusion reaction identification (RPN, MCQ, Moderate)
4. Ventilator alarm troubleshooting high pressure (RN, MCQ, Very Hard)
5. Cardiogenic shock inotrope management (RN, MCQ, Hard)
Include diverse patient demographics. Each question MUST have hemodynamic values and vitals.`,
  },
];

function parseJsonArray(text: string): any[] {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  try {
    const objects: any[] = [];
    const regex = /\{[\s\S]*?\n\}/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      try {
        objects.push(JSON.parse(m[0]));
      } catch {}
    }
    if (objects.length > 0) return objects;
  } catch {}
  return [];
}

async function generateBatch(config: typeof BATCH_CONFIGS[0]): Promise<GeneratedQuestion[]> {
  console.log(`[QBank] Generating batch: ${config.name} (${config.count} questions)...`);

  const batchTier = config.prompt.toLowerCase().includes("(np") ? "np"
    : config.prompt.toLowerCase().includes("(rpn") ? "rpn" : "rn";
  const systemPrompt = getTierSystemPrompt(batchTier as "rpn" | "rn" | "np");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${config.prompt}\n\nReturn ONLY a valid JSON array of ${config.count} question objects. No markdown, no explanation outside the JSON.`,
      },
    ],
    max_tokens: 16000,
    temperature: 0.75,
  });

  const content = response.choices[0]?.message?.content || "";
  const questions = parseJsonArray(content);

  if (!questions || questions.length === 0) {
    console.error(`[QBank] Failed to parse questions for batch: ${config.name}`);
    console.error(`[QBank] Raw content length: ${content.length}`);
    return [];
  }

  console.log(`[QBank] Parsed ${questions.length} questions for batch: ${config.name}`);
  const tokens = response.usage?.total_tokens || 0;
  console.log(`[QBank] Tokens used: ${tokens}`);

  return questions.filter((q: any) => {
    if (!q.stem || !q.options || !Array.isArray(q.options) || q.options.length < 4) {
      console.warn(`[QBank] Skipping invalid question: missing stem or options`);
      return false;
    }
    if (typeof q.correct_answer_index !== "number" || q.correct_answer_index < 0 || q.correct_answer_index >= q.options.length) {
      console.warn(`[QBank] Skipping question with invalid correct_answer_index`);
      return false;
    }
    if (!q.rationale || q.rationale.split(" ").length < 20) {
      console.warn(`[QBank] Skipping question with weak rationale (${q.rationale?.split(" ").length || 0} words)`);
      return false;
    }
    return true;
  });
}

async function insertQuestion(q: GeneratedQuestion): Promise<string | null> {
  const stemHash = crypto.createHash("md5").update(q.stem).digest("hex");

  const existing = await pool.query("SELECT id FROM exam_questions WHERE stem_hash = $1", [stemHash]);
  if (existing.rows.length > 0) {
    console.log(`[QBank] Duplicate detected, skipping: ${q.stem.substring(0, 60)}...`);
    return null;
  }

  const levelLower = q.exam_level?.toLowerCase() || "rn";
  const tier = levelLower === "rpn" ? "rpn" : levelLower === "np" ? "np" : "rn";
  const examMap: Record<string, string> = { rpn: "REx-PN", rn: "NCLEX-RN", np: "NP-Board" };
  const exam = examMap[tier] || "NCLEX-RN";
  const questionType = q.question_type || "MCQ";

  const fullStem = q.scenario ? `${q.scenario}\n\n${q.stem}` : q.stem;

  const result = await pool.query(
    `INSERT INTO exam_questions (
      tier, exam, question_type, status, stem, options, correct_answer,
      rationale, difficulty, body_system, topic, region_scope, stem_hash,
      scenario, clinical_pearl, exam_strategy, memory_hook, framework_used,
      clinical_trap, distractor_rationales, tags
    ) VALUES ($1, $2, $3, 'published', $4, $5, $6, $7, $8, $9, $10, 'BOTH', $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING id`,
    [
      tier,
      exam,
      questionType,
      fullStem,
      JSON.stringify(q.options),
      JSON.stringify([q.correct_answer_index]),
      q.rationale,
      q.difficulty || 3,
      q.system || "General",
      q.topic || "General",
      stemHash,
      q.scenario || null,
      q.clinical_pearl || null,
      q.exam_strategy || null,
      q.memory_hook || null,
      q.framework_used || null,
      q.clinical_trap || null,
      q.distractor_rationales ? JSON.stringify(q.distractor_rationales) : null,
      `{${[q.topic, q.system, q.framework_used, questionType].filter(Boolean).map(t => `"${t}"`).join(",")}}`,
    ]
  );

  return result.rows[0]?.id || null;
}

async function main() {
  console.log("[QBank Premium] Starting generation of 50 UWorld-style questions...\n");

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const config of BATCH_CONFIGS) {
    try {
      const questions = await generateBatch(config);
      console.log(`[QBank] Inserting ${questions.length} questions from batch: ${config.name}`);

      for (const q of questions) {
        try {
          const id = await insertQuestion(q);
          if (id) {
            totalInserted++;
            console.log(`  + Inserted: ${q.topic} / ${q.system} (${q.exam_level}) [${id.substring(0, 8)}]`);
          } else {
            totalSkipped++;
          }
        } catch (err: any) {
          totalFailed++;
          console.error(`  x Failed to insert question: ${err.message}`);
        }
      }
    } catch (err: any) {
      console.error(`[QBank] Batch "${config.name}" failed: ${err.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n[QBank Premium] Generation complete!`);
  console.log(`  Inserted: ${totalInserted}`);
  console.log(`  Skipped (duplicates): ${totalSkipped}`);
  console.log(`  Failed: ${totalFailed}`);

  const countResult = await pool.query("SELECT COUNT(*) FROM exam_questions WHERE status = 'published'");
  console.log(`  Total published questions: ${countResult.rows[0].count}`);

  const newResult = await pool.query(
    "SELECT COUNT(*) FROM exam_questions WHERE clinical_pearl IS NOT NULL AND status = 'published'"
  );
  console.log(`  Questions with clinical pearls: ${newResult.rows[0].count}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("[QBank Premium] Fatal error:", err);
  process.exit(1);
});
