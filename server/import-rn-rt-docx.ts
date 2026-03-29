import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { createLazyPrimaryPoolProxy } from "./db";

const pool = createLazyPrimaryPoolProxy();

function stemHash(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex");
}

function mapDifficulty(d: string | undefined): number {
  if (!d) return 3;
  const lower = d.toLowerCase();
  if (lower === "easy") return 1;
  if (lower === "medium" || lower === "moderate") return 3;
  if (lower === "hard") return 5;
  return 3;
}

interface ParsedQuestion {
  tier: string;
  exam: string;
  questionType: string;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string[];
  rationale: string | null;
  difficulty: number;
  bodySystem: string | null;
  topic: string | null;
  regionScope: string;
  scenario: string | null;
  careerType: string;
  exhibitData: any;
}

async function extractTextFromDocx(docxPath: string): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.default.extractRawText({ path: docxPath });
  return result.value;
}

function parsePlainTextRNQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const blocks = text.split(/\n---\n/).map(b => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const numberMatch = lines[0]?.match(/^(\d+)\.$/);
    if (!numberMatch) continue;

    let stemLines: string[] = [];
    let optionLines: string[] = [];
    let correctLine = "";
    let rationaleText = "";
    let inStem = true;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^[A-E]\.\s/.test(line)) {
        inStem = false;
        optionLines.push(line);
      } else if (/^Correct Answers?:\s*/.test(line)) {
        correctLine = line.replace(/^Correct Answers?:\s*/, "").trim();
      } else if (/^Rationale:\s*/.test(line)) {
        rationaleText = line.replace(/^Rationale:\s*/, "").trim();
      } else if (inStem) {
        stemLines.push(line);
      }
    }

    if (stemLines.length === 0 || optionLines.length === 0) continue;

    const stem = stemLines.join(" ");
    const options = optionLines.map(o => {
      const match = o.match(/^([A-E])\.\s*(.+)$/);
      return match ? { label: match[1], text: match[2].trim() } : null;
    }).filter((o): o is { label: string; text: string } => o !== null);

    const isSATA = stem.toLowerCase().includes("select all that apply") || correctLine.includes(" ");
    const correctAnswers = correctLine.split(/\s+/).map(a => a.trim()).filter(Boolean);

    questions.push({
      tier: "rn",
      exam: "NCLEX-RN",
      questionType: isSATA ? "select_all_that_apply" : "multiple_choice",
      stem,
      options,
      correctAnswer: correctAnswers,
      rationale: rationaleText || null,
      difficulty: 3,
      bodySystem: null,
      topic: null,
      regionScope: "BOTH",
      scenario: null,
      careerType: "nursing",
      exhibitData: null,
    });
  }

  return questions;
}

function parseRRTJsonBlocks(content: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const pattern = /\{\s*"questions"\s*:\s*\[/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const startIdx = match.index;
    let braceCount = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === "{") braceCount++;
      if (content[i] === "}") braceCount--;
      if (braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
    const jsonStr = content.substring(startIdx, endIdx);
    try {
      const data = JSON.parse(jsonStr);
      const items = data.questions || [];
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        if (!item.stem && !item.question_text) continue;
        if (item.option_a === undefined) continue;

        const opts: { label: string; text: string }[] = [];
        if (item.option_a) opts.push({ label: "A", text: item.option_a });
        if (item.option_b) opts.push({ label: "B", text: item.option_b });
        if (item.option_c) opts.push({ label: "C", text: item.option_c });
        if (item.option_d) opts.push({ label: "D", text: item.option_d });
        if (item.option_e) opts.push({ label: "E", text: item.option_e });

        const correctAnswer = typeof item.correct_answer === "string"
          ? [item.correct_answer]
          : Array.isArray(item.correct_answer) ? item.correct_answer : [];

        const tier = item.tier || "rrt";
        questions.push({
          tier,
          exam: tier === "rn" ? "NCLEX-RN" : "RRT Exam",
          questionType: item.question_type || "multiple_choice",
          stem: item.stem || item.question_text,
          options: opts,
          correctAnswer,
          rationale: item.rationale || null,
          difficulty: mapDifficulty(item.difficulty),
          bodySystem: item.category || null,
          topic: item.subcategory || null,
          regionScope: "BOTH",
          scenario: null,
          careerType: tier === "rn" ? "nursing" : "respiratory_therapy",
          exhibitData: null,
        });
      }
    } catch (e) {
    }
  }

  return questions;
}

function parseStructuredJsonRNArrays(content: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const pattern = /\[\s*\{[^[]*?"question_text"/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const startIdx = match.index;
    let bracketCount = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === "[") bracketCount++;
      if (content[i] === "]") bracketCount--;
      if (bracketCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
    const jsonStr = content.substring(startIdx, endIdx);
    try {
      const items = JSON.parse(jsonStr);
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        if (!item.question_text) continue;

        const options = (item.answer_options || []).map((text: string, i: number) => ({
          label: String.fromCharCode(65 + i),
          text,
        }));

        const correctIdx = options.findIndex((o: { label: string; text: string }) => o.text === item.correct_answer);
        const correctAnswer = correctIdx >= 0
          ? [options[correctIdx].label]
          : (item.correct_answer ? [item.correct_answer] : []);

        const regionMap: Record<string, string> = { us: "US", ca: "CA", canada: "CA" };
        const regionScope = item.country ? (regionMap[item.country.toLowerCase()] || "BOTH") : "BOTH";

        questions.push({
          tier: item.tier || "rn",
          exam: "NCLEX-RN",
          questionType: item.question_type || "multiple_choice",
          stem: item.question_text,
          options,
          correctAnswer,
          rationale: item.rationale || null,
          difficulty: mapDifficulty(item.difficulty),
          bodySystem: item.system || null,
          topic: item.topic || null,
          regionScope,
          scenario: null,
          careerType: "nursing",
          exhibitData: null,
        });
      }
    } catch (e) {
    }
  }

  return questions;
}

function parseTextFormatQuestions(content: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const questionPattern = /^QUESTION\s+\d+/gm;
  const positions: number[] = [];
  let qMatch;

  while ((qMatch = questionPattern.exec(content)) !== null) {
    positions.push(qMatch.index);
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : content.length;
    let block = content.substring(start, end).trim();

    if (block.includes('"questions"') && block.indexOf("{") < block.length / 2) {
      const cutIdx = block.indexOf("{");
      if (cutIdx > 0) block = block.substring(0, cutIdx).trim();
    }

    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);

    let questionType = "multiple_choice";
    let category = "";
    let difficulty = "moderate";
    let stemLines: string[] = [];
    let optionLines: string[] = [];
    let correctAnswers: string[] = [];
    let rationaleText = "";
    let scenario = "";
    let isBowtie = false;
    let conditionOptions: string[] = [];
    let correctCondition = "";
    let interventionOptions: string[] = [];
    let correctInterventions: string[] = [];
    let monitoringOptions: string[] = [];
    let correctMonitoring = "";

    let inSection = "header";
    let currentCollector: string[] | null = null;

    for (const line of lines) {
      if (/^QUESTION\s+\d+$/i.test(line)) continue;

      if (/^TYPE:\s*/i.test(line)) {
        questionType = line.replace(/^TYPE:\s*/i, "").trim();
        if (questionType === "bowtie") isBowtie = true;
        continue;
      }
      if (/^CATEGORY:\s*/i.test(line)) {
        category = line.replace(/^CATEGORY:\s*/i, "").trim();
        continue;
      }
      if (/^DIFFICULTY:\s*/i.test(line)) {
        difficulty = line.replace(/^DIFFICULTY:\s*/i, "").trim();
        continue;
      }
      if (/^TARGET_EXAMS?:\s*/i.test(line)) continue;
      if (/^CONTENT_TIER:\s*/i.test(line)) continue;

      if (/^STEM:?\s*$/i.test(line)) {
        inSection = "stem";
        continue;
      }
      if (/^OPTIONS:?\s*$/i.test(line)) {
        inSection = "options";
        continue;
      }
      if (/^SCENARIO:?\s*$/i.test(line) || /^CASE:?\s*$/i.test(line)) {
        inSection = "scenario";
        continue;
      }

      if (/^CONDITION\s+OPTIONS?\s*$/i.test(line)) {
        inSection = "condition_options";
        currentCollector = conditionOptions;
        continue;
      }
      if (/^CORRECT\s+CONDITION\s*$/i.test(line)) {
        inSection = "correct_condition";
        continue;
      }
      if (/^INTERVENTION\s+OPTIONS?\s*$/i.test(line)) {
        inSection = "intervention_options";
        currentCollector = interventionOptions;
        continue;
      }
      if (/^CORRECT\s+INTERVENTIONS?\s*$/i.test(line)) {
        inSection = "correct_interventions";
        continue;
      }
      if (/^MONITORING\s+PARAMETER\s+OPTIONS?\s*$/i.test(line)) {
        inSection = "monitoring_options";
        currentCollector = monitoringOptions;
        continue;
      }
      if (/^CORRECT\s+MONITORING\s+PARAMETERS?\s*$/i.test(line)) {
        inSection = "correct_monitoring";
        continue;
      }

      if (/^Correct\s+(Answer|Order|Condition|Answers):?\s*(.*)/i.test(line)) {
        const m = line.match(/^Correct\s+(?:Answer|Order|Condition|Answers):?\s*(.*)/i);
        const answerPart = m?.[1]?.trim() || "";
        if (answerPart) {
          correctAnswers.push(...answerPart.split(/\s+/).filter(Boolean));
        }
        inSection = "correct_answers";
        continue;
      }
      if (/^CORRECT\s+ANSWERS?:?\s*$/i.test(line)) {
        inSection = "correct_answers";
        continue;
      }
      if (/^CORRECT\s+ORDER:?\s*$/i.test(line)) {
        inSection = "correct_answers";
        continue;
      }
      if (/^RATIONALE:?\s*$/i.test(line) || /^RATIONALE:\s+/i.test(line)) {
        inSection = "rationale";
        const r = line.replace(/^RATIONALE:?\s*/i, "").trim();
        if (r) rationaleText = r;
        continue;
      }

      if (inSection === "correct_answers" && /^[A-E]$/.test(line)) {
        correctAnswers.push(line);
        continue;
      }
      if (inSection === "correct_answers" && /^[1-5]$/.test(line)) {
        correctAnswers.push(line);
        continue;
      }

      if (inSection === "rationale" && line) {
        rationaleText += (rationaleText ? " " : "") + line;
        continue;
      }

      if (inSection === "condition_options" && line) {
        conditionOptions.push(line);
        continue;
      }
      if (inSection === "correct_condition" && line) {
        correctCondition = line;
        inSection = "";
        continue;
      }
      if (inSection === "intervention_options" && line) {
        interventionOptions.push(line);
        continue;
      }
      if (inSection === "correct_interventions" && line) {
        correctInterventions.push(line);
        continue;
      }
      if (inSection === "monitoring_options" && line) {
        monitoringOptions.push(line);
        continue;
      }
      if (inSection === "correct_monitoring" && line) {
        correctMonitoring = line;
        inSection = "";
        continue;
      }

      if (/^[A-E]\.\s/.test(line)) {
        inSection = "options";
        optionLines.push(line);
        continue;
      }
      if (/^\d+\.\s/.test(line) && questionType === "ordered_response") {
        optionLines.push(line);
        continue;
      }

      if (inSection === "scenario") {
        scenario += (scenario ? " " : "") + line;
        continue;
      }

      if (inSection === "stem" || (inSection === "header" && line && !/^(TYPE|CATEGORY|DIFFICULTY|TARGET|CONTENT)/i.test(line))) {
        stemLines.push(line);
        inSection = "stem";
        continue;
      }
    }

    const stem = stemLines.join(" ").trim();
    if (!stem) continue;

    if (isBowtie && conditionOptions.length > 0) {
      const allOpts: { label: string; text: string }[] = [];
      conditionOptions.forEach((t, i) => allOpts.push({ label: `C${i + 1}`, text: t }));
      interventionOptions.forEach((t, i) => allOpts.push({ label: `I${i + 1}`, text: t }));
      monitoringOptions.forEach((t, i) => allOpts.push({ label: `M${i + 1}`, text: t }));

      const bowtieCorrect: string[] = [];
      if (correctCondition) bowtieCorrect.push(correctCondition);
      bowtieCorrect.push(...correctInterventions);
      if (correctMonitoring) bowtieCorrect.push(correctMonitoring);

      questions.push({
        tier: "rn",
        exam: "NCLEX-RN",
        questionType: "bowtie",
        stem: scenario ? `${scenario}\n\n${stem}` : stem,
        options: allOpts,
        correctAnswer: bowtieCorrect,
        rationale: rationaleText || null,
        difficulty: mapDifficulty(difficulty),
        bodySystem: category || null,
        topic: null,
        regionScope: "BOTH",
        scenario: scenario || null,
        careerType: "nursing",
        exhibitData: {
          type: "bowtie",
          condition_options: conditionOptions,
          intervention_options: interventionOptions,
          monitoring_parameter_options: monitoringOptions,
          correct_condition: correctCondition,
          correct_interventions: correctInterventions,
          correct_monitoring_parameter: correctMonitoring,
        },
      });
    } else {
      let options: { label: string; text: string }[] = [];
      if (questionType === "ordered_response") {
        options = optionLines.map(o => {
          const m = o.match(/^(\d+)\.\s*(.+)$/);
          return m ? { label: m[1], text: m[2].trim() } : null;
        }).filter((o): o is { label: string; text: string } => o !== null);
      } else {
        options = optionLines.map(o => {
          const m = o.match(/^([A-E])\.\s*(.+)$/);
          return m ? { label: m[1], text: m[2].trim() } : null;
        }).filter((o): o is { label: string; text: string } => o !== null);
      }

      questions.push({
        tier: "rn",
        exam: "NCLEX-RN",
        questionType,
        stem: scenario ? `${scenario}\n\n${stem}` : stem,
        options,
        correctAnswer: correctAnswers,
        rationale: rationaleText || null,
        difficulty: mapDifficulty(difficulty),
        bodySystem: category || null,
        topic: null,
        regionScope: "BOTH",
        scenario: scenario || null,
        careerType: "nursing",
        exhibitData: null,
      });
    }
  }

  return questions;
}

function isInstructionSection(text: string): boolean {
  const markers = [
    "VISUAL STYLE", "Admin Compatibility", "SYSTEM INSTRUCTION",
    "The UI must work with", "NurseNest brand style", "readiness estimate",
    "recommended next quiz", "build instructions"
  ];
  return markers.some(m => text.includes(m));
}

async function importDocxQuestions() {
  console.log("=== Starting RN & RT Questions Import from DOCX ===\n");

  const docxPath = path.resolve(process.cwd(), "attached_assets/RN_and_RT_Questions_1773276125819.docx");
  if (!fs.existsSync(docxPath)) {
    console.error("DOCX file not found:", docxPath);
    process.exit(1);
  }

  console.log("Extracting text from DOCX...");
  const content = await extractTextFromDocx(docxPath);
  console.log(`Extracted ${content.split("\n").length} lines of text\n`);

  const allQuestions: ParsedQuestion[] = [];
  const stats = {
    plainTextRN: 0,
    rrtJson: 0,
    structuredJsonRN: 0,
    textFormatRN: 0,
    bowtie: 0,
  };

  console.log("--- Parsing plain-text numbered RN questions ---");
  const firstJsonIdx = content.indexOf('\n{');
  const firstQuestionNIdx = content.search(/^QUESTION\s+\d+/m);
  const plainTextEnd = Math.min(
    firstJsonIdx > 0 ? firstJsonIdx : content.length,
    firstQuestionNIdx > 0 ? firstQuestionNIdx : content.length
  );
  const plainTextSection = content.substring(0, plainTextEnd);
  const plainTextQ = parsePlainTextRNQuestions(plainTextSection);
  stats.plainTextRN = plainTextQ.length;
  console.log(`Found ${plainTextQ.length} plain-text RN questions`);
  allQuestions.push(...plainTextQ);

  console.log("\n--- Parsing RRT JSON blocks ---");
  const rrtQ = parseRRTJsonBlocks(content);
  stats.rrtJson = rrtQ.length;
  console.log(`Found ${rrtQ.length} RRT JSON questions`);
  allQuestions.push(...rrtQ);

  console.log("\n--- Parsing structured JSON RN arrays ---");
  const structuredQ = parseStructuredJsonRNArrays(content);
  stats.structuredJsonRN = structuredQ.length;
  console.log(`Found ${structuredQ.length} structured JSON RN questions`);
  allQuestions.push(...structuredQ);

  console.log("\n--- Parsing text-format (QUESTION N) questions ---");
  const textQ = parseTextFormatQuestions(content);
  const bowtieCount = textQ.filter(q => q.questionType === "bowtie").length;
  const nonBowtieCount = textQ.length - bowtieCount;
  stats.textFormatRN = nonBowtieCount;
  stats.bowtie = bowtieCount;
  console.log(`Found ${nonBowtieCount} text-format RN questions and ${bowtieCount} bowtie questions`);
  allQuestions.push(...textQ);

  console.log(`\nTotal parsed across all formats: ${allQuestions.length}`);

  const uniqueMap = new Map<string, ParsedQuestion>();
  let dupeCount = 0;
  for (const q of allQuestions) {
    const hash = stemHash(q.stem);
    if (!uniqueMap.has(hash)) {
      uniqueMap.set(hash, q);
    } else {
      dupeCount++;
    }
  }
  console.log(`In-batch deduplication: ${dupeCount} duplicates removed, ${uniqueMap.size} unique questions`);

  console.log("\nChecking existing questions in DB...");
  const existingHashes = new Set<string>();
  try {
    const result = await pool.query("SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL");
    for (const row of result.rows) {
      existingHashes.add(row.stem_hash);
    }
    console.log(`Found ${existingHashes.size} existing question hashes in DB`);
  } catch (e) {
    console.log("Could not query existing questions (table may not exist yet)");
  }

  let skipCount = 0;
  const toInsert: { hash: string; q: ParsedQuestion }[] = [];
  for (const [hash, q] of uniqueMap) {
    if (existingHashes.has(hash)) {
      skipCount++;
    } else {
      toInsert.push({ hash, q });
    }
  }
  console.log(`Skipping ${skipCount} questions already in DB`);
  console.log(`Inserting ${toInsert.length} new questions\n`);

  const insertStats = { rn: 0, rrt: 0, bowtie: 0, errors: 0 };
  const BATCH_SIZE = 50;

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);

    for (const { hash, q } of batch) {
      try {
        await pool.query(
          `INSERT INTO exam_questions (
            tier, exam, question_type, status, stem, options, correct_answer,
            rationale, difficulty, body_system, topic, region_scope,
            stem_hash, career_type, scenario, exhibit_data, published_at
          ) VALUES ($1, $2, $3, 'published', $4, $5::jsonb, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())`,
          [
            q.tier,
            q.exam,
            q.questionType,
            q.stem,
            JSON.stringify(q.options),
            JSON.stringify(q.correctAnswer),
            q.rationale,
            q.difficulty,
            q.bodySystem,
            q.topic,
            q.regionScope,
            hash,
            q.careerType,
            q.scenario,
            q.exhibitData ? JSON.stringify(q.exhibitData) : null,
          ]
        );
        if (q.questionType === "bowtie") insertStats.bowtie++;
        else if (q.tier === "rrt") insertStats.rrt++;
        else insertStats.rn++;
      } catch (e: any) {
        insertStats.errors++;
        if (insertStats.errors <= 10) {
          console.error(`Error inserting: ${q.stem.substring(0, 60)}... - ${e.message.substring(0, 100)}`);
        }
      }
    }

    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toInsert.length / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches}: processed ${batch.length} questions`);
  }

  console.log("\n=== Import Summary ===");
  console.log(`Parsed by format:`);
  console.log(`  Plain-text RN: ${stats.plainTextRN}`);
  console.log(`  RRT JSON: ${stats.rrtJson}`);
  console.log(`  Structured JSON RN: ${stats.structuredJsonRN}`);
  console.log(`  Text-format RN: ${stats.textFormatRN}`);
  console.log(`  Bowtie: ${stats.bowtie}`);
  console.log(`  Total parsed: ${allQuestions.length}`);
  console.log(`Deduplication:`);
  console.log(`  In-batch duplicates: ${dupeCount}`);
  console.log(`  Already in DB: ${skipCount}`);
  console.log(`Insertion:`);
  console.log(`  RN questions inserted: ${insertStats.rn}`);
  console.log(`  RRT questions inserted: ${insertStats.rrt}`);
  console.log(`  Bowtie questions inserted: ${insertStats.bowtie}`);
  console.log(`  Errors: ${insertStats.errors}`);
  console.log(`  Total inserted: ${insertStats.rn + insertStats.rrt + insertStats.bowtie}`);

}

importDocxQuestions().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
