/**
 * Minimal local DB seed for verify-core-api exam + deck flows.
 * Uses DATABASE_URL from .env (same pattern as upsert-local-template.mjs).
 *
 *   node scripts/seed-local-verify-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
const env = fs.readFileSync(envPath, "utf8");
const m = env.match(/^DATABASE_URL=(.+)$/m);
if (!m) throw new Error("DATABASE_URL missing in .env");

const connectionString = m[1].trim().replace(/^["']|["']$/g, "");
const useSsl =
  String(process.env.DB_SSL || "").toLowerCase() === "true" ||
  /render\.com|supabase\.co|neon\.tech|railway\.app|amazonaws\.com|azure\.com/i.test(connectionString);

const pool = new pg.Pool({
  connectionString,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

const TEMPLATE_ID = "local-rn-template-01";
const DECK_SLUG = "nursenest-verify-smoke-deck";

function stemHash(text) {
  return crypto.createHash("md5").update(text.trim().toLowerCase().replace(/\s+/g, " ")).digest("hex");
}

async function upsertTemplate(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS mock_exam_templates (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      template_id TEXT NOT NULL UNIQUE,
      exam_code TEXT NOT NULL,
      exam_name TEXT NOT NULL,
      template_name TEXT NOT NULL,
      description TEXT,
      question_count INTEGER NOT NULL,
      time_limit_minutes INTEGER NOT NULL,
      difficulty_distribution JSONB NOT NULL,
      domain_weights JSONB NOT NULL,
      format_mix JSONB NOT NULL,
      passing_standard INTEGER DEFAULT 65,
      seed INTEGER DEFAULT 0,
      tier TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await client.query(
    `INSERT INTO mock_exam_templates
      (template_id, exam_code, exam_name, template_name, description, question_count, time_limit_minutes,
       difficulty_distribution, domain_weights, format_mix, passing_standard, seed, tier, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (template_id) DO UPDATE SET
       active = true,
       question_count = EXCLUDED.question_count,
       domain_weights = EXCLUDED.domain_weights,
       tier = EXCLUDED.tier,
       exam_code = EXCLUDED.exam_code,
       updated_at = NOW()`,
    [
      TEMPLATE_ID,
      "NCLEX-RN",
      "NCLEX-RN",
      "Local RN verify template",
      "Seeded for local HTTP verify (exam delivery)",
      25,
      60,
      JSON.stringify({ foundational: 0.3, moderate: 0.5, difficult: 0.2 }),
      JSON.stringify([{ domain: "Management of Care", weight: 1 }]),
      JSON.stringify({
        mcqSingle: 0.85,
        selectAllThatApply: 0.05,
        scenarioBased: 0.05,
        prioritization: 0.03,
        delegation: 0.02,
      }),
      65,
      1,
      "rn",
      true,
    ],
  );
}

async function ensureExamQuestions(client) {
  const { rows } = await client.query(
    `SELECT COUNT(*)::int AS c FROM exam_questions WHERE tier = $1 AND status = 'published'`,
    ["rn"],
  );
  const have = rows[0]?.c ?? 0;
  if (have >= 40) {
    console.log(`[seed-local-verify] exam_questions rn/published: ${have} (ok)`);
    return have;
  }
  const need = 40 - have;
  let inserted = 0;
  const body = "Delegation & Prioritization";
  for (let i = 0; i < need; i++) {
    const stem = `Verify smoke: nursing priority scenario ${i + 1} — which action first?`;
    const hash = stemHash(stem);
    const options = JSON.stringify(["Assess patient", "Call provider", "Administer PRN", "Document"]);
    const correct = JSON.stringify([0]);
    const dup = await client.query(
      `SELECT 1 FROM exam_questions WHERE stem_hash = $1 AND exam = $2 LIMIT 1`,
      [hash, "NCLEX-RN"],
    );
    if (dup.rows.length) continue;
    const r = await client.query(
      `INSERT INTO exam_questions (
         tier, exam, question_type, status, published_at,
         stem, options, correct_answer, rationale, difficulty,
         body_system, topic, subtopic, region_scope, career_type, stem_hash
       ) VALUES ($1,$2,$3,'published',NOW(),$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id`,
      [
        "rn",
        "NCLEX-RN",
        "MCQ_SINGLE",
        stem,
        options,
        correct,
        "Verify seed rationale.",
        2 + (i % 3),
        body,
        "Management of Care",
        "verify-seed",
        "BOTH",
        "nursing",
        hash,
      ],
    );
    if (r.rowCount) inserted++;
  }
  console.log(`[seed-local-verify] inserted ~${inserted} exam_questions (target +${need})`);
  const { rows: r2 } = await client.query(
    `SELECT COUNT(*)::int AS c FROM exam_questions WHERE tier = $1 AND status = 'published'`,
    ["rn"],
  );
  return r2[0]?.c ?? 0;
}

async function resolveDeckOwnerId(client) {
  const nu = await client.query(`SELECT id FROM users WHERE username = $1 LIMIT 1`, ["NurseNest"]);
  if (nu.rows.length) return nu.rows[0].id;
  const any = await client.query(`SELECT id FROM users ORDER BY created_at ASC NULLS LAST LIMIT 1`);
  if (any.rows.length) return any.rows[0].id;
  const id = crypto.randomUUID();
  await client.query(
    `INSERT INTO users (id, username, password, tier, subscription_status)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, "verify-deck-owner", "verify-no-login", "admin", "active"],
  );
  return id;
}

async function ensureDeck(client) {
  const ex = await client.query(`SELECT id FROM flashcard_decks WHERE slug = $1`, [DECK_SLUG]);
  if (ex.rows.length) {
    const deckId = ex.rows[0].id;
    await client.query(
      `UPDATE flashcard_decks SET card_count = (SELECT COUNT(*)::int FROM deck_flashcards WHERE deck_id = $1), updated_at = NOW() WHERE id = $1`,
      [deckId],
    );
    console.log(`[seed-local-verify] deck exists slug=${DECK_SLUG} id=${deckId}`);
    return deckId;
  }
  const ownerId = await resolveDeckOwnerId(client);
  const dr = await client.query(
    `INSERT INTO flashcard_decks (title, slug, description, owner_id, visibility, tags, tier, is_upgraded, upgraded_limit, card_count)
     VALUES ($1, $2, $3, $4, 'public', $5::jsonb, 'rn', true, 500, 0)
     RETURNING id`,
    [
      "Verify smoke deck",
      DECK_SLUG,
      "Minimal deck for local verify-core-api",
      ownerId,
      JSON.stringify(["verify", "smoke"]),
    ],
  );
  const deckId = dr.rows[0].id;
  const cards = [
    { f: "What does the prefix hyper- mean?", b: "Above normal / excessive" },
    { f: "What does the prefix hypo- mean?", b: "Below normal / deficient" },
    { f: "Normal adult pulse range (resting)?", b: "Typically 60–100 bpm (context-dependent)" },
  ];
  for (const c of cards) {
    await client.query(
      `INSERT INTO deck_flashcards (deck_id, front, back) VALUES ($1, $2, $3)`,
      [deckId, c.f, c.b],
    );
  }
  await client.query(
    `UPDATE flashcard_decks SET card_count = $2, updated_at = NOW() WHERE id = $1`,
    [deckId, cards.length],
  );
  console.log(`[seed-local-verify] created deck slug=${DECK_SLUG} id=${deckId} cards=${cards.length}`);
  return deckId;
}

async function ensureFlashcardBankRow(client) {
  const front = "Verify smoke: hyper- means what?";
  const h = stemHash(`bank:${front}`);
  const { rows } = await client.query(`SELECT id FROM flashcard_bank WHERE content_hash = $1`, [h]);
  if (rows.length) return;
  await client.query(
    `INSERT INTO flashcard_bank (
       tier, front, back, status, flashcard_enabled, source_type, category, content_hash, career_type
     ) VALUES ($1, $2, $3, 'published', true, 'manual', 'verify-smoke', $4, 'nursing')`,
    ["rn", front, "Above normal / excessive", h],
  );
  console.log("[seed-local-verify] inserted 1 flashcard_bank row");
}

async function main() {
  const client = await pool.connect();
  try {
    await upsertTemplate(client);
    const nq = await ensureExamQuestions(client);
    if (nq < 25) {
      console.warn(`[seed-local-verify] WARN: only ${nq} rn/published questions; exam assembly may still be empty`);
    }
    const deckId = await ensureDeck(client);
    try {
      await ensureFlashcardBankRow(client);
    } catch (e) {
      console.warn("[seed-local-verify] flashcard_bank skip:", e.message);
    }
    const drow = await client.query(`SELECT id FROM flashcard_decks WHERE slug = $1`, [DECK_SLUG]);
    const resolvedDeckId = drow.rows[0]?.id || deckId;
    console.log("");
    console.log("--- use with verify-core-api ---");
    console.log(`VERIFY_EXAM_TEMPLATE_ID=${TEMPLATE_ID}`);
    console.log(`VERIFY_FLASHCARD_DECK_ID=${resolvedDeckId}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
