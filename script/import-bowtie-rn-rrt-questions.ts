import { pool } from "../server/storage";
import crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hashStem(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex").substring(0, 32);
}

function difficultyToInt(d: string): number {
  switch (d.toLowerCase()) {
    case "easy": return 1;
    case "moderate":
    case "medium": return 3;
    case "hard": return 5;
    default: return 3;
  }
}

function letterToIndex(letter: string): number {
  return "ABCDE".indexOf(letter.toUpperCase());
}

interface BowtieRaw {
  question_type: string;
  scenario: string;
  condition_options: string[];
  action_options: string[];
  monitor_options: string[];
  correct_condition: string;
  correct_action: string;
  correct_monitor: string;
  rationale: string;
  category: string;
  difficulty: string;
  exam: string;
  country: string;
  client_needs: string;
  topic: string;
  status: string;
}

interface RNQuestionRaw {
  id: string;
  type: string;
  category: string;
  question?: string;
  scenario?: string;
  options?: Record<string, string> | string[];
  correct_answer?: string;
  correct_answers?: string[];
  correct_order?: string[];
  rationale: string;
  condition_options?: string[];
  actions_options?: string[];
  parameters_options?: string[];
  correct_condition?: string;
  correct_actions?: string[];
  correct_parameters?: string[];
  rows?: string[];
  columns?: string[];
  correct_matches?: Record<string, string>;
  case?: string;
  questions?: any[];
}

interface RRTQuestionRaw {
  exam_type?: string;
  exam_category?: string;
  category?: string;
  subcategory?: string;
  difficulty: string;
  question_type?: string;
  stem?: string;
  question?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  rationale: string;
  learning_objective?: string;
  tier?: string;
  published?: boolean;
}

async function insertBowtieQuestions(questions: BowtieRaw[]): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const stemHash = hashStem(q.scenario);
    const existing = await pool.query("SELECT id FROM exam_questions WHERE stem_hash = $1", [stemHash]);
    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    const centerCorrectIdx = q.condition_options.indexOf(q.correct_condition);
    const rightCorrectIdx = q.action_options.indexOf(q.correct_action);
    const leftCorrectIdx = q.monitor_options.indexOf(q.correct_monitor);

    const options = JSON.stringify({
      centerOptions: q.condition_options,
      leftFindings: q.monitor_options,
      rightActions: q.action_options,
    });

    const correctAnswer = JSON.stringify({
      centerCorrect: centerCorrectIdx,
      leftCorrect: [leftCorrectIdx],
      leftSelectCount: 1,
      rightCorrect: [rightCorrectIdx],
      rightSelectCount: 1,
    });

    const tier = q.exam === "NCLEX-PN" ? "rpn" : "rpn";

    await pool.query(
      `INSERT INTO exam_questions (tier, exam, question_type, status, stem, scenario, options, correct_answer, rationale, body_system, topic, difficulty, stem_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        tier,
        q.exam,
        "bowtie",
        "published",
        q.scenario,
        q.scenario,
        options,
        correctAnswer,
        q.rationale,
        q.category,
        q.topic,
        difficultyToInt(q.difficulty),
        stemHash,
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

async function insertRNQuestions(questions: RNQuestionRaw[]): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const stemText = q.question || q.scenario || q.case || "";
    if (!stemText) {
      console.log(`  SKIP RN ${q.id}: no stem text`);
      skipped++;
      continue;
    }

    const stemHash = hashStem(stemText);
    const existing = await pool.query("SELECT id FROM exam_questions WHERE stem_hash = $1", [stemHash]);
    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    let questionType = "multiple_choice";
    let optionsJson: string;
    let correctAnswerJson: string;

    if (q.type === "multiple_choice") {
      const opts = q.options as Record<string, string>;
      optionsJson = JSON.stringify(Object.values(opts));
      const idx = letterToIndex(q.correct_answer!);
      correctAnswerJson = JSON.stringify([idx]);
    } else if (q.type === "SATA") {
      questionType = "select_all";
      const opts = q.options as Record<string, string>;
      optionsJson = JSON.stringify(Object.values(opts));
      const indices = (q.correct_answers || []).map(letterToIndex);
      correctAnswerJson = JSON.stringify(indices);
    } else if (q.type === "ordered_response") {
      questionType = "ordered_response";
      optionsJson = JSON.stringify(q.options);
      correctAnswerJson = JSON.stringify(q.correct_order);
    } else if (q.type === "bowtie") {
      questionType = "bowtie";
      optionsJson = JSON.stringify({
        centerOptions: q.condition_options,
        leftFindings: q.parameters_options,
        rightActions: q.actions_options,
      });
      const centerIdx = (q.condition_options || []).indexOf(q.correct_condition!);
      const rightIndices = (q.correct_actions || []).map(a => (q.actions_options || []).indexOf(a));
      const leftIndices = (q.correct_parameters || []).map(p => (q.parameters_options || []).indexOf(p));
      correctAnswerJson = JSON.stringify({
        centerCorrect: centerIdx,
        leftCorrect: leftIndices,
        leftSelectCount: leftIndices.length,
        rightCorrect: rightIndices,
        rightSelectCount: rightIndices.length,
      });
    } else if (q.type === "matrix") {
      questionType = "matrix";
      optionsJson = JSON.stringify({ rows: q.rows, columns: q.columns });
      correctAnswerJson = JSON.stringify(q.correct_matches);
    } else if (q.type === "case_study") {
      questionType = "case_study";
      optionsJson = JSON.stringify(q.questions);
      correctAnswerJson = JSON.stringify(q.questions?.map((sq: any) => sq.correct_answer));
    } else {
      console.log(`  SKIP RN ${q.id}: unknown type ${q.type}`);
      skipped++;
      continue;
    }

    await pool.query(
      `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, body_system, difficulty, stem_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        "rn",
        "NCLEX-RN",
        questionType,
        "published",
        stemText,
        optionsJson,
        correctAnswerJson,
        q.rationale,
        q.category,
        3,
        stemHash,
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

async function insertRRTQuestions(questions: RRTQuestionRaw[]): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const stemText = q.stem || q.question || "";
    if (!stemText) {
      skipped++;
      continue;
    }

    const existingCheck = await pool.query(
      "SELECT id FROM allied_questions WHERE stem = $1 AND career_type = 'rrt'",
      [stemText]
    );
    if (existingCheck.rows.length > 0) {
      skipped++;
      continue;
    }

    const optionsArr = [q.option_a, q.option_b, q.option_c, q.option_d];
    const correctIdx = letterToIndex(q.correct_answer);
    const category = q.category || q.exam_category || "general";
    const subcategory = q.subcategory || "general";

    await pool.query(
      `INSERT INTO allied_questions (
        career_type, stem, options, correct_answer, rationale_long,
        learning_objective, blueprint_category, subtopic, difficulty,
        cognitive_level, question_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        "rrt",
        stemText,
        JSON.stringify(optionsArr),
        correctIdx,
        q.rationale,
        q.learning_objective || "",
        category,
        subcategory,
        difficultyToInt(q.difficulty),
        "application",
        q.question_type || "multiple_choice",
        "approved",
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

async function main() {
  console.log("Starting import of 56 Bowtie, RN & RRT questions...\n");

  const filePath = path.join(__dirname, "../attached_assets/Pasted--question-type-bowtie-scenario-A-postpartum-client-is-s_1773241215445.txt");
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const lines = rawContent.split("\n");

  const bowtieQuestions: BowtieRaw[] = JSON.parse(lines.slice(0, 663).join("\n"));
  console.log(`Parsed ${bowtieQuestions.length} bowtie questions`);

  const rnQuestions: RNQuestionRaw[] = JSON.parse(lines.slice(2117, 2311).join("\n"));
  console.log(`Parsed ${rnQuestions.length} RN questions`);

  const rrtBlock = JSON.parse(lines.slice(1609, 2055).join("\n"));
  const rrtQuestions: RRTQuestionRaw[] = rrtBlock.questions;
  console.log(`Parsed ${rrtQuestions.length} RRT questions`);

  console.log(`\nTotal questions to import: ${bowtieQuestions.length + rnQuestions.length + rrtQuestions.length}\n`);

  console.log("--- Importing Bowtie Questions ---");
  const bowtieResult = await insertBowtieQuestions(bowtieQuestions);
  console.log(`Bowtie: ${bowtieResult.inserted} inserted, ${bowtieResult.skipped} skipped\n`);

  console.log("--- Importing RN Questions ---");
  const rnResult = await insertRNQuestions(rnQuestions);
  console.log(`RN: ${rnResult.inserted} inserted, ${rnResult.skipped} skipped\n`);

  console.log("--- Importing RRT Questions ---");
  const rrtResult = await insertRRTQuestions(rrtQuestions);
  console.log(`RRT: ${rrtResult.inserted} inserted, ${rrtResult.skipped} skipped\n`);

  const totalInserted = bowtieResult.inserted + rnResult.inserted + rrtResult.inserted;
  const totalSkipped = bowtieResult.skipped + rnResult.skipped + rrtResult.skipped;

  console.log("=== SUMMARY ===");
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total skipped: ${totalSkipped}`);

  const examCounts = await pool.query(
    "SELECT question_type, COUNT(*) as cnt FROM exam_questions WHERE question_type = 'bowtie' OR tier = 'rn' GROUP BY question_type ORDER BY question_type"
  );
  console.log("\nExam questions by type:");
  for (const row of examCounts.rows) {
    console.log(`  ${row.question_type}: ${row.cnt}`);
  }

  const alliedCount = await pool.query(
    "SELECT COUNT(*) as cnt FROM allied_questions WHERE career_type = 'rrt'"
  );
  console.log(`\nAllied RRT questions total: ${alliedCount.rows[0].cnt}`);

  await pool.end();
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
