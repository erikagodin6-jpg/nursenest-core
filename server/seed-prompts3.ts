import crypto from "crypto";
import fs from "fs";
import path from "path";
import { pool } from "./storage";

/* =========================
   HELPERS
========================= */

function stemHash(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("md5").update(normalized).digest("hex");
}

function difficultyToInt(d: string): number {
  switch (String(d).toLowerCase()) {
    case "easy":
      return 1;
    case "moderate":
    case "medium":
      return 3;
    case "hard":
      return 5;
    default:
      return 3;
  }
}

function letterToIndex(letter: string): number {
  return "ABCDE".indexOf(letter.toUpperCase());
}

async function batchInsert(query: string, valuesArray: unknown[][]) {
  if (valuesArray.length === 0) return;

  const chunks = [];
  const chunkSize = 50;

  for (let i = 0; i < valuesArray.length; i += chunkSize) {
    chunks.push(valuesArray.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const flatValues: unknown[] = [];
    const placeholders: string[] = [];

    chunk.forEach((vals, i) => {
      const offset = i * vals.length;
      const rowPlaceholders = vals.map((_, j) => `$${offset + j + 1}`);
      placeholders.push(`(${rowPlaceholders.join(",")})`);
      flatValues.push(...vals);
    });

    await pool.query(`${query} VALUES ${placeholders.join(",")}`, flatValues);
  }
}

/* =========================
   BUNDLED DATA (optional file)
========================= */

interface BowtieRaw {
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
  client_needs: string;
  topic: string;
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
  questions?: unknown[];
}

interface RRTQuestionRaw {
  category?: string;
  exam_category?: string;
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
}

function loadBundledPrompts3File(): {
  bowtieQuestions: BowtieRaw[];
  rnNgnQuestions: RNQuestionRaw[];
  rrtQuestions: RRTQuestionRaw[];
} {
  const candidates = [
    path.join(__dirname, "../attached_assets/Pasted--question-type-bowtie-scenario-A-postpartum-client-is-s_1773241215445.txt"),
    path.resolve("attached_assets/Pasted--question-type-bowtie-scenario-A-postpartum-client-is-s_1773241215445.txt"),
  ];
  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const lines = rawContent.split("\n");
      const bowtieQuestions = JSON.parse(lines.slice(0, 663).join("\n")) as BowtieRaw[];
      const rnNgnQuestions = JSON.parse(lines.slice(2117, 2311).join("\n")) as RNQuestionRaw[];
      const rrtBlock = JSON.parse(lines.slice(1609, 2055).join("\n")) as { questions: RRTQuestionRaw[] };
      return {
        bowtieQuestions: Array.isArray(bowtieQuestions) ? bowtieQuestions : [],
        rnNgnQuestions: Array.isArray(rnNgnQuestions) ? rnNgnQuestions : [],
        rrtQuestions: Array.isArray(rrtBlock?.questions) ? rrtBlock.questions : [],
      };
    } catch {
      continue;
    }
  }
  return { bowtieQuestions: [], rnNgnQuestions: [], rrtQuestions: [] };
}

/* =========================
   PARSERS → seed row shapes
========================= */

interface SeedExamRow {
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: unknown;
  correctAnswer: unknown;
  rationale: string;
  difficulty: number;
  bodySystem: string | null;
  topic: string | null;
  subtopic: string | null;
  regionScope: string;
  careerType: string;
  stemHash: string;
  scenario: string | null;
  exhibitData: unknown | null;
}

interface SeedAlliedRow {
  careerType: string;
  stem: string;
  options: unknown;
  correctAnswer: number;
  rationaleLong: string;
  learningObjective: string;
  blueprintCategory: string;
  subtopic: string;
  difficulty: number;
  cognitiveLevel: string;
  questionType: string;
  status: string;
}

function parseBowtieForExam(q: BowtieRaw): SeedExamRow | null {
  if (!q?.scenario || !Array.isArray(q.condition_options)) return null;
  const centerCorrectIdx = q.condition_options.indexOf(q.correct_condition);
  const rightCorrectIdx = q.action_options.indexOf(q.correct_action);
  const leftCorrectIdx = q.monitor_options.indexOf(q.correct_monitor);
  const options = {
    centerOptions: q.condition_options,
    leftFindings: q.monitor_options,
    rightActions: q.action_options,
  };
  const correctAnswer = {
    centerCorrect: centerCorrectIdx,
    leftCorrect: [leftCorrectIdx],
    leftSelectCount: 1,
    rightCorrect: [rightCorrectIdx],
    rightSelectCount: 1,
  };
  const h = stemHash(q.scenario);
  const tier = q.exam === "NCLEX-PN" ? "rpn" : "rpn";
  return {
    tier,
    exam: q.exam,
    questionType: "bowtie",
    status: "published",
    stem: q.scenario,
    options,
    correctAnswer,
    rationale: q.rationale || "",
    difficulty: difficultyToInt(q.difficulty),
    bodySystem: q.category || null,
    topic: q.client_needs || null,
    subtopic: q.topic || null,
    regionScope: "BOTH",
    careerType: "nursing",
    stemHash: h,
    scenario: q.scenario,
    exhibitData: q,
  };
}

function parseRnNgn(q: RNQuestionRaw): SeedExamRow | null {
  const stemText = q.question || q.scenario || q.case || "";
  if (!stemText) return null;
  const h = stemHash(stemText);
  let questionType = "multiple_choice";
  let optionsJson: unknown;
  let correctAnswerJson: unknown;

  if (q.type === "multiple_choice") {
    const opts = q.options as Record<string, string>;
    optionsJson = Object.values(opts);
    const idx = letterToIndex(q.correct_answer || "A");
    correctAnswerJson = [idx];
  } else if (q.type === "SATA") {
    questionType = "select_all";
    const opts = q.options as Record<string, string>;
    optionsJson = Object.values(opts);
    const indices = (q.correct_answers || []).map(letterToIndex);
    correctAnswerJson = indices;
  } else if (q.type === "ordered_response") {
    questionType = "ordered_response";
    optionsJson = q.options;
    correctAnswerJson = q.correct_order;
  } else if (q.type === "bowtie") {
    questionType = "bowtie";
    optionsJson = {
      centerOptions: q.condition_options,
      leftFindings: q.parameters_options,
      rightActions: q.actions_options,
    };
    const centerIdx = (q.condition_options || []).indexOf(q.correct_condition!);
    const rightIndices = (q.correct_actions || []).map((a) => (q.actions_options || []).indexOf(a));
    const leftIndices = (q.correct_parameters || []).map((p) => (q.parameters_options || []).indexOf(p));
    correctAnswerJson = {
      centerCorrect: centerIdx,
      leftCorrect: leftIndices,
      leftSelectCount: leftIndices.length,
      rightCorrect: rightIndices,
      rightSelectCount: rightIndices.length,
    };
  } else if (q.type === "matrix") {
    questionType = "matrix";
    optionsJson = { rows: q.rows, columns: q.columns };
    correctAnswerJson = q.correct_matches;
  } else if (q.type === "case_study") {
    questionType = "case_study";
    optionsJson = q.questions;
    correctAnswerJson = (q.questions as { correct_answer?: unknown }[])?.map((sq) => sq.correct_answer);
  } else {
    return null;
  }

  return {
    tier: "rn",
    exam: "NCLEX-RN",
    questionType,
    status: "published",
    stem: stemText,
    options: optionsJson,
    correctAnswer: correctAnswerJson,
    rationale: q.rationale,
    difficulty: 3,
    bodySystem: q.category || null,
    topic: null,
    subtopic: null,
    regionScope: "BOTH",
    careerType: "nursing",
    stemHash: h,
    scenario: stemText,
    exhibitData: null,
  };
}

function parseRrtQuestion(q: RRTQuestionRaw): SeedAlliedRow | null {
  const stemText = q.stem || q.question || "";
  if (!stemText) return null;
  const optionsArr = [q.option_a, q.option_b, q.option_c, q.option_d];
  const correctIdx = letterToIndex(q.correct_answer);
  const category = q.category || q.exam_category || "general";
  const subcategory = q.subcategory || "general";
  return {
    careerType: "rrt",
    stem: stemText,
    options: optionsArr,
    correctAnswer: correctIdx,
    rationaleLong: q.rationale,
    learningObjective: q.learning_objective || "",
    blueprintCategory: category,
    subtopic: subcategory,
    difficulty: difficultyToInt(q.difficulty),
    cognitiveLevel: "application",
    questionType: q.question_type || "multiple_choice",
    status: "approved",
  };
}

/* =========================
   MAIN SEED FUNCTION
========================= */

export async function seedPrompts3Questions() {
  const details: string[] = [];
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  const { bowtieQuestions, rnNgnQuestions, rrtQuestions } = loadBundledPrompts3File();

  const parsedBowtie = bowtieQuestions.map(parseBowtieForExam).filter((x): x is SeedExamRow => Boolean(x));
  const parsedRrt = rrtQuestions.map(parseRrtQuestion).filter((x): x is SeedAlliedRow => Boolean(x));
  const parsedRn = rnNgnQuestions.map(parseRnNgn).filter((x): x is SeedExamRow => Boolean(x));

  const dedupe = <T>(arr: T[], keyFn: (x: T) => string) => {
    const seen = new Set<string>();
    return arr.filter((x) => {
      const key = keyFn(x);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const bowtie = dedupe(parsedBowtie, (q) => `${q.stemHash}_${q.exam}`);
  const rrt = dedupe(parsedRrt, (q) => q.stem);
  const rn = dedupe(parsedRn, (q) => `${q.stemHash}_${q.exam}`);

  details.push(`Bowtie: ${bowtie.length}`);
  details.push(`RRT: ${rrt.length}`);
  details.push(`RN: ${rn.length}`);

  const existingExam = await pool.query(`SELECT stem_hash, exam FROM exam_questions`);

  const existingAllied = await pool.query(`SELECT stem FROM allied_questions WHERE career_type='rrt'`);

  const examSet = new Set(existingExam.rows.map((r: { stem_hash: string; exam: string }) => `${r.stem_hash}_${r.exam}`));
  const alliedSet = new Set(existingAllied.rows.map((r: { stem: string }) => r.stem));

  const examInsertValues: unknown[][] = [];
  const alliedInsertValues: unknown[][] = [];

  for (const q of bowtie) {
    if (examSet.has(`${q.stemHash}_${q.exam}`)) {
      skipped++;
      continue;
    }

    examInsertValues.push([
      q.tier,
      q.exam,
      q.questionType,
      q.status,
      q.stem,
      JSON.stringify(q.options),
      JSON.stringify(q.correctAnswer),
      q.rationale,
      q.difficulty,
      q.bodySystem,
      q.topic,
      q.subtopic,
      q.regionScope,
      q.careerType,
      q.stemHash,
      q.scenario,
      q.exhibitData ? JSON.stringify(q.exhibitData) : null,
    ]);

    inserted++;
  }

  for (const q of rn) {
    if (examSet.has(`${q.stemHash}_${q.exam}`)) {
      skipped++;
      continue;
    }

    examInsertValues.push([
      q.tier,
      q.exam,
      q.questionType,
      q.status,
      q.stem,
      JSON.stringify(q.options),
      JSON.stringify(q.correctAnswer),
      q.rationale,
      q.difficulty,
      q.bodySystem,
      q.topic,
      q.subtopic,
      q.regionScope,
      q.careerType,
      q.stemHash,
      q.scenario,
      q.exhibitData ? JSON.stringify(q.exhibitData) : null,
    ]);

    inserted++;
  }

  for (const q of rrt) {
    if (alliedSet.has(q.stem)) {
      skipped++;
      continue;
    }

    alliedInsertValues.push([
      q.careerType,
      q.stem,
      JSON.stringify(q.options),
      q.correctAnswer,
      q.rationaleLong,
      q.learningObjective,
      q.blueprintCategory,
      q.subtopic,
      q.difficulty,
      q.cognitiveLevel,
      q.questionType,
      q.status,
    ]);

    inserted++;
  }

  try {
    await batchInsert(
      `INSERT INTO exam_questions (
        tier, exam, question_type, status, stem, options, correct_answer,
        rationale, difficulty, body_system, topic, subtopic,
        region_scope, career_type, stem_hash, scenario, exhibit_data
      )`,
      examInsertValues
    );

    await batchInsert(
      `INSERT INTO allied_questions (
        career_type, stem, options, correct_answer, rationale_long,
        learning_objective, blueprint_category, subtopic,
        difficulty, cognitive_level, question_type, status
      )`,
      alliedInsertValues
    );
  } catch (err: unknown) {
    errors++;
    details.push(`Batch insert error: ${err instanceof Error ? err.message : String(err)}`);
  }

  const total = bowtieQuestions.length + rrtQuestions.length + rnNgnQuestions.length;

  details.push(`Total: ${total}`);
  details.push(`Inserted: ${inserted}`);
  details.push(`Skipped: ${skipped}`);
  details.push(`Errors: ${errors}`);

  return { total, inserted, skipped, errors, details };
}
