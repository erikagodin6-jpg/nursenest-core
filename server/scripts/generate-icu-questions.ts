import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const ICU_DOMAINS = [
  "Ventilator Management",
  "Shock States",
  "Hemodynamics",
  "Sepsis",
  "Trauma",
  "ICU Pharmacology",
];

const ICU_PROMPT_BASE = `You are a senior CCRN (Critical Care Registered Nurse) certification exam item writer for NurseNest.
Your questions must reflect RN-level ICU scope of practice with advanced critical care clinical scenarios.

EVERY question MUST include a detailed ICU clinical scenario with at least TWO of the following data points:
- Ventilator settings: mode (AC/VC, AC/PC, SIMV, PSV, APRV), FiO2, PEEP (cmH2O), tidal volume (mL), respiratory rate, plateau pressure, peak inspiratory pressure
- Hemodynamic monitoring values: CVP (cmH2O), PCWP/PAOP (mmHg), cardiac index (L/min/m2), SVR (dynes-sec/cm-5), MAP (mmHg), SvO2 (%), cardiac output (L/min), stroke volume variation
- Lab values: ABG (pH, PaCO2, PaO2, HCO3, SaO2), lactate (mmol/L), troponin (ng/mL), BMP (Na, K, Cl, CO2, BUN, Cr, glucose), CBC, coagulation studies (PT, INR, aPTT), procalcitonin

Questions should test CCRN-level clinical judgment at the application/analysis level with emphasis on:
- Rapid assessment and prioritization in life-threatening ICU situations
- Interpretation of hemodynamic profiles and ventilator waveforms
- Vasopressor/inotrope titration and management
- ARDS management (lung-protective ventilation, prone positioning, PEEP optimization)
- Sepsis bundle implementation (1-hour and 3-hour bundles)
- Multi-organ dysfunction recognition and management
- ICU pharmacology (sedation, analgesia, paralysis, vasoactive agents)
- Trauma primary and secondary survey in the ICU setting
- Shock state differentiation and targeted treatment
- ICU liberation (ABCDEF bundle) and delirium prevention

Include both Canadian (SI units: mmol/L, umol/L, Celsius, kg) and US (conventional units: mEq/L, mg/dL, Fahrenheit, lbs) reference values where applicable.

Each question must present a unique, realistic ICU patient scenario. Do NOT use generic or vague clinical descriptions.`;

const BATCH_SIZE = 750;

async function findOrCreateGeneration(batchNum: number, targetCount: number): Promise<string> {
  const completed = await pool.query(
    `SELECT id, created_count FROM product_generations
     WHERE id LIKE $1 AND status = 'complete'
     ORDER BY created_at DESC LIMIT 1`,
    [`icu-ccrn-batch-${batchNum}-%`],
  );

  if (completed.rows.length > 0) {
    const row = completed.rows[0];
    console.log(`[ICU Gen] Batch ${batchNum} already complete: ${row.id} (${row.created_count} questions)`);
    return row.id;
  }

  const existing = await pool.query(
    `SELECT id, status, created_count FROM product_generations
     WHERE id LIKE $1 AND status IN ('queued', 'running')
     ORDER BY created_at DESC LIMIT 1`,
    [`icu-ccrn-batch-${batchNum}-%`],
  );

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    console.log(`[ICU Gen] Resuming existing batch ${batchNum}: ${row.id} (${row.created_count} already created, status: ${row.status})`);
    if (row.status === "running") {
      await pool.query(`UPDATE product_generations SET status = 'queued' WHERE id = $1`, [row.id]);
    }
    return row.id;
  }

  const topicStr = ICU_DOMAINS.join(", ");
  const id = `icu-ccrn-batch-${batchNum}-${Date.now()}`;

  await pool.query(
    `INSERT INTO product_generations (id, user_id, template, status, target_count, created_count, chunk_size, model, prompt_base, prompt_state, topic, exam_target, difficulty, question_types, region, settings, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())`,
    [
      id,
      "system",
      "question_pack",
      "queued",
      targetCount,
      0,
      15,
      "gpt-4o-mini",
      ICU_PROMPT_BASE,
      JSON.stringify({
        byType: { MCQ: 0, SATA: 0 },
        byDifficulty: { moderate: 0, hard: 0, very_challenging: 0 },
        bySystem: {},
        byTopic: {},
        lastStems: [],
        lastHashes: [],
      }),
      topicStr,
      "ccrn",
      "mixed",
      JSON.stringify(["MCQ", "SATA"]),
      "BOTH",
      JSON.stringify({
        tier: "rn",
        themeId: "navy-medical",
        icuDomains: ICU_DOMAINS,
        lessonLinks: [
          "critical-care-rn",
          "critical-care-rpn",
          "critical-care-np",
          "ards-management",
          "critical-care-advanced-np",
          "shock-types-recognition-rpn",
        ],
        imageReferences: [
          "abg-interpretation-flowchart.png",
          "shock-types-comparison.png",
          "cardiac-biomarkers.png",
          "electrolyte-imbalances.png",
          "ecg-rhythm-recognition.png",
          "basic-metabolic-panel.png",
          "sepsis-recognition.png",
          "blood-transfusion-reactions.png",
          "coagulation-labs-reference.png",
          "oxygen-delivery-devices.png",
        ],
      }),
    ],
  );

  console.log(`[ICU Gen] Created new generation ${id} with target ${targetCount} questions`);
  return id;
}

async function run() {
  console.log("[ICU Gen] Starting ICU/CCRN question generation setup...");
  console.log(`[ICU Gen] Total target: 1500 questions across ${ICU_DOMAINS.length} domains`);
  console.log(`[ICU Gen] Domains: ${ICU_DOMAINS.join(", ")}`);
  console.log(`[ICU Gen] Split into 2 batches of ${BATCH_SIZE} each`);

  const gen1Id = await findOrCreateGeneration(1, BATCH_SIZE);
  const gen2Id = await findOrCreateGeneration(2, BATCH_SIZE);

  console.log(`[ICU Gen] Generation 1: ${gen1Id}`);
  console.log(`[ICU Gen] Generation 2: ${gen2Id}`);

  const { runGenerationWorker } = await import("../generatorV2/worker");

  const gen1Status = await pool.query(`SELECT status FROM product_generations WHERE id = $1`, [gen1Id]);
  if (gen1Status.rows[0]?.status === "complete") {
    console.log("[ICU Gen] Batch 1 already complete, skipping...");
  } else {
    console.log("[ICU Gen] Starting batch 1 worker...");
    try {
      await runGenerationWorker(gen1Id);
      console.log("[ICU Gen] Batch 1 complete!");
    } catch (err: any) {
      console.error("[ICU Gen] Batch 1 error:", err.message);
      await pool.query(
        `UPDATE product_generations SET status = 'failed', last_error = $1 WHERE id = $2`,
        [err.message, gen1Id],
      );
    }
  }

  const gen2Status = await pool.query(`SELECT status FROM product_generations WHERE id = $1`, [gen2Id]);
  if (gen2Status.rows[0]?.status === "complete") {
    console.log("[ICU Gen] Batch 2 already complete, skipping...");
  } else {
    console.log("[ICU Gen] Starting batch 2 worker...");
    try {
      await runGenerationWorker(gen2Id);
      console.log("[ICU Gen] Batch 2 complete!");
    } catch (err: any) {
      console.error("[ICU Gen] Batch 2 error:", err.message);
      await pool.query(
        `UPDATE product_generations SET status = 'failed', last_error = $1 WHERE id = $2`,
        [err.message, gen2Id],
      );
    }
  }

  const result1 = await pool.query(`SELECT created_count FROM product_generations WHERE id = $1`, [gen1Id]);
  const result2 = await pool.query(`SELECT created_count FROM product_generations WHERE id = $1`, [gen2Id]);
  const total = (result1.rows[0]?.created_count || 0) + (result2.rows[0]?.created_count || 0);
  console.log(`[ICU Gen] Total questions generated: ${total}/1500`);

  await pool.end();
}

run().catch((err) => {
  console.error("[ICU Gen] Fatal error:", err);
  process.exit(1);
});
