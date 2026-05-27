/**
 * seed-improved-qbank-content.ts
 *
 * Imports fully developed RPN/RN/NP questions with:
 *   - Rich clinical rationale
 *   - Per-option distractor rationales (distractorRationales)
 *   - 3-level progressive hints
 *   - Clinical pearls, exam strategies, memory hooks
 *
 * Usage (run from repo root):
 *   npx tsx server/seed-improved-qbank-content.ts
 *   npx tsx server/seed-improved-qbank-content.ts --dry-run
 *   npx tsx server/seed-improved-qbank-content.ts --tier rpn
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDryRun = process.argv.includes("--dry-run");
const tierFilter = process.argv.find((a) => a.startsWith("--tier="))?.replace("--tier=", "") || null;

const DATA_DIR = path.resolve(__dirname, "../data/improved-content");

interface RawQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  rationale: string;
  distractor_rationales: Record<string, string>;
  clinical_pearl?: string;
  exam_strategy?: string;
  memory_hook?: string;
  hints: Array<{ level: 1 | 2 | 3; text: string }>;
  difficulty: "easy" | "moderate" | "hard";
  exam: string;
  country: string;
  category: string;
  client_needs: string;
  topic: string;
  question_type?: string;
}

const EXAM_TO_TIER: Record<string, string> = {
  "NCLEX-PN": "rpn",
  "REx-PN":   "rpn",
  "NCLEX-RN": "rn",
  "AANP":     "np",
  "ANCC":     "np",
};

const DIFFICULTY_MAP: Record<string, number> = {
  easy:     2,
  moderate: 3,
  hard:     4,
};

const ANSWER_MAP: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

const COUNTRY_TO_REGION: Record<string, string> = {
  US:     "US",
  Canada: "CAN",
};

function stemHash(stem: string): string {
  return crypto.createHash("md5").update(stem.trim().toLowerCase().replace(/\s+/g, " ")).digest("hex");
}

interface InsertPayload {
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: string;        // JSON
  correctAnswer: string;  // JSON
  rationale: string;
  correctAnswerExplanation: string | null;
  distractorRationales: string; // JSON
  clinicalPearl: string | null;
  examStrategy: string | null;
  memoryHook: string | null;
  hints: string; // JSON
  difficulty: number;
  bodySystem: string;
  topic: string;
  subtopic: string;
  regionScope: string;
  careerType: string;
  stemHash: string;
}

function buildPayload(q: RawQuestion): InsertPayload {
  const tier = EXAM_TO_TIER[q.exam] || "rn";
  const options = [q.option_a.trim(), q.option_b.trim(), q.option_c.trim(), q.option_d.trim()];
  const correctIndex = ANSWER_MAP[q.correct_answer.toUpperCase()];

  return {
    tier,
    exam: q.exam,
    questionType: (q.question_type || "multiple_choice").toLowerCase().replace(/_/g, " "),
    status:   "published",
    stem:     q.question.trim(),
    options:  JSON.stringify(options),
    correctAnswer: JSON.stringify([correctIndex]),
    rationale:     q.rationale.trim(),
    correctAnswerExplanation: null,
    distractorRationales: JSON.stringify(q.distractor_rationales || {}),
    clinicalPearl: q.clinical_pearl?.trim() || null,
    examStrategy:  q.exam_strategy?.trim() || null,
    memoryHook:    q.memory_hook?.trim() || null,
    hints: JSON.stringify(q.hints || []),
    difficulty: DIFFICULTY_MAP[q.difficulty?.toLowerCase() || "moderate"] || 3,
    bodySystem: q.category?.trim() || "General",
    topic:     q.client_needs?.trim() || "General",
    subtopic:  q.topic?.trim() || "",
    regionScope: COUNTRY_TO_REGION[q.country] || "BOTH",
    careerType:  "nursing",
    stemHash:    stemHash(q.question),
  };
}

async function run() {
  const files = [
    { file: "rpn-improved-questions.json",   label: "RPN" },
    { file: "rn-improved-questions.json",    label: "RN" },
    { file: "np-improved-questions.json",    label: "NP" },
    { file: "rpn-improved-questions-2.json", label: "RPN" },
    { file: "rn-improved-questions-2.json",  label: "RN" },
    { file: "np-improved-questions-2.json",  label: "NP" },
  ];

  let totalInserted = 0;
  let totalSkipped  = 0;
  let totalErrors   = 0;

  // Lazy-load DB only when not in dry-run mode
  let pool: any = null;
  if (!isDryRun) {
    const { createLazyPrimaryPoolProxy } = await import("./db");
    pool = createLazyPrimaryPoolProxy();
  }

  for (const { file, label } of files) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[WARN] Missing file: ${filePath} — skipping`);
      continue;
    }

    const raw: RawQuestion[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const tierOfFile = label.toLowerCase();

    if (tierFilter && tierFilter !== tierOfFile) {
      console.log(`[SKIP] Tier filter set to ${tierFilter}, skipping ${label}`);
      continue;
    }

    console.log(`\n── ${label} (${raw.length} questions) ──────────────────────`);

    for (let i = 0; i < raw.length; i++) {
      const q = raw[i];
      const p = buildPayload(q);

      if (isDryRun) {
        console.log(`  [DRY-RUN] Q${i + 1}: "${p.stem.slice(0, 80)}..."  tier=${p.tier}  difficulty=${p.difficulty}`);
        totalInserted++;
        continue;
      }

      try {
        // Check for existing question by stem hash (idempotency)
        const existing = await pool.query(
          `SELECT id FROM exam_questions WHERE stem_hash = $1`,
          [p.stemHash]
        );

        if (existing.rows.length > 0) {
          // Update the educational fields on existing question (upsert behaviour)
          await pool.query(
            `UPDATE exam_questions
             SET distractor_rationales   = $1,
                 clinical_pearl          = $2,
                 exam_strategy           = $3,
                 memory_hook             = $4,
                 hints                   = $5,
                 rationale               = $6,
                 status                  = 'published',
                 published_at            = COALESCE(published_at, NOW()),
                 updated_at              = NOW()
             WHERE stem_hash = $7`,
            [
              p.distractorRationales,
              p.clinicalPearl,
              p.examStrategy,
              p.memoryHook,
              p.hints,
              p.rationale,
              p.stemHash,
            ]
          );
          console.log(`  [UPDATE] Q${i + 1}: "${p.stem.slice(0, 70)}..." (id=${existing.rows[0].id})`);
          totalSkipped++;
          continue;
        }

        // Full insert for new question
        await pool.query(
          `INSERT INTO exam_questions (
            tier, exam, question_type, status, published_at, stem, options,
            correct_answer, rationale, distractor_rationales,
            clinical_pearl, exam_strategy, memory_hook, hints,
            difficulty, body_system, topic, subtopic,
            region_scope, career_type, stem_hash
          ) VALUES (
            $1, $2, $3, 'published', NOW(), $4, $5,
            $6, $7, $8,
            $9, $10, $11, $12,
            $13, $14, $15, $16,
            $17, $18, $19
          )`,
          [
            p.tier, p.exam, p.questionType, p.stem, p.options,
            p.correctAnswer, p.rationale, p.distractorRationales,
            p.clinicalPearl, p.examStrategy, p.memoryHook, p.hints,
            p.difficulty, p.bodySystem, p.topic, p.subtopic,
            p.regionScope, p.careerType, p.stemHash,
          ]
        );

        console.log(`  [INSERT] Q${i + 1}: "${p.stem.slice(0, 70)}..."  tier=${p.tier}`);
        totalInserted++;
      } catch (err: any) {
        console.error(`  [ERROR] Q${i + 1}: ${err.message}`);
        totalErrors++;
      }
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`${isDryRun ? "DRY-RUN " : ""}Seed complete:`);
  console.log(`  Inserted : ${totalInserted}`);
  console.log(`  Updated  : ${totalSkipped}`);
  console.log(`  Errors   : ${totalErrors}`);

  if (!isDryRun && pool?.end) {
    await pool.end().catch(() => {});
  }
}

run().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
