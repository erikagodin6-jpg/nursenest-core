import fs from "fs";
import path from "path";
import crypto from "crypto";
import mammoth from "mammoth";
import { pool } from "./storage";

/* =========================
   CONSTANTS
========================= */

const BATCH_SIZE = 100;

const DIFFICULTY_MAP: Record<string, number> = {
  easy: 2,
  moderate: 3,
  hard: 4,
};

const ANSWER_INDEX: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
};

/* =========================
   HELPERS
========================= */

function stemHash(text: string): string {
  return crypto
    .createHash("md5")
    .update(text.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex");
}

function safeParseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

/* =========================
   PARSER
========================= */

function parseQuestion(q: any) {
  if (!q?.question || q.question.length < 10) return null;

  const options = [
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
  ].filter(Boolean);

  if (options.length < 4) return null;

  const correct = ANSWER_INDEX[q.correct_answer?.toUpperCase()];
  if (correct === undefined) return null;

  return {
    stem: q.question.trim(),
    options: JSON.stringify(options.map((o: string) => o.trim())),
    correct: JSON.stringify([correct]),
    rationale: q.rationale?.trim() || "",
    difficulty:
      DIFFICULTY_MAP[q.difficulty?.toLowerCase()] || 3,
    exam: q.exam || "NCLEX-PN",
    tier: "rpn",
    region: q.country || "US",
    hash: stemHash(q.question),
  };
}

/* =========================
   MAIN
========================= */

async function seed() {
  const filePath = path.resolve(
    "attached_assets/rpn_questions.docx"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  console.log("[Seed] Extracting DOCX...");
  const raw = await mammoth.extractRawText({ path: filePath });

  const data = safeParseJSON(raw.value);
  if (!data) throw new Error("Invalid JSON in DOCX");

  const rawQuestions = Object.values(data).flat();

  console.log(`[Seed] Raw questions: ${rawQuestions.length}`);

  /* =========================
     PARSE
  ========================= */

  const parsed = rawQuestions
    .map(parseQuestion)
    .filter(Boolean) as any[];

  console.log(`[Seed] Parsed: ${parsed.length}`);

  /* =========================
     DEDUP (IN-MEMORY)
  ========================= */

  const seen = new Set<string>();
  const deduped = parsed.filter((q) => {
    if (seen.has(q.hash)) return false;
    seen.add(q.hash);
    return true;
  });

  console.log(`[Seed] Deduped: ${deduped.length}`);

  /* =========================
     FETCH EXISTING (ONCE)
  ========================= */

  const existingRes = await pool.query(
    `SELECT stem_hash FROM exam_questions WHERE exam='NCLEX-PN'`
  );

  const existing = new Set(
    existingRes.rows.map((r: any) => r.stem_hash)
  );

  /* =========================
     BATCH INSERT
  ========================= */

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < deduped.length; i += BATCH_SIZE) {
    const batch = deduped.slice(i, i + BATCH_SIZE);

    const values = [];
    const params: any[] = [];

    for (const q of batch) {
      if (existing.has(q.hash)) {
        skipped++;
        continue;
      }

      params.push(
        q.tier,
        q.exam,
        "standard",
        q.stem,
        q.options,
        q.correct,
        q.rationale,
        q.difficulty,
        q.region,
        q.hash
      );

      const idx = params.length;

      values.push(
        `($${idx - 9},$${idx - 8},$${idx - 7},$${idx - 6},$${idx - 5},$${idx - 4},$${idx - 3},$${idx - 2},$${idx - 1},$${idx})`
      );

      inserted++;
      existing.add(q.hash);
    }

    if (values.length === 0) continue;

    await pool.query(
      `INSERT INTO exam_questions
      (tier, exam, question_type, stem, options, correct_answer, rationale, difficulty, region_scope, stem_hash)
      VALUES ${values.join(",")}
      ON CONFLICT (stem_hash) DO NOTHING`,
      params
    );

    console.log(`[Seed] Progress: ${inserted}`);
  }

  console.log("\n=== DONE ===");
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped: ${skipped}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Fatal:", err.message);
  process.exit(1);
});