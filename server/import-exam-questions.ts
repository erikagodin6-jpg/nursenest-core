import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as crypto from "crypto";
import { createLazyPrimaryPoolProxy } from "./db";

const __filename_esm = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

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

function mapRegionScope(country: string | undefined): string {
  if (!country) return "BOTH";
  const lower = country.toLowerCase();
  if (lower === "us" || lower === "united states") return "US";
  if (lower === "ca" || lower === "canada") return "CA";
  return "BOTH";
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
        const answerPart = line.replace(/^Correct Answers?:\s*/, "").trim();
        correctLine = answerPart;
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

    const isSATA = stem.toLowerCase().includes("select all that apply") ||
      correctLine.includes(" ");
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
    });
  }

  return questions;
}

function parseRRTJsonQuestions(jsonStr: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  try {
    const data = JSON.parse(jsonStr);
    const items = data.questions || data;
    if (!Array.isArray(items)) return questions;

    for (const item of items) {
      if (!item.stem && !item.question_text) continue;
      if (item.option_a !== undefined) {
        const opts: { label: string; text: string }[] = [];
        if (item.option_a) opts.push({ label: "A", text: item.option_a });
        if (item.option_b) opts.push({ label: "B", text: item.option_b });
        if (item.option_c) opts.push({ label: "C", text: item.option_c });
        if (item.option_d) opts.push({ label: "D", text: item.option_d });
        if (item.option_e) opts.push({ label: "E", text: item.option_e });

        const correctAnswer = typeof item.correct_answer === "string"
          ? [item.correct_answer]
          : Array.isArray(item.correct_answer) ? item.correct_answer : [];

        questions.push({
          tier: item.tier || "rrt",
          exam: item.tier === "rn" ? "NCLEX-RN" : "RRT Exam",
          questionType: item.question_type || "multiple_choice",
          stem: item.stem,
          options: opts,
          correctAnswer,
          rationale: item.rationale || null,
          difficulty: mapDifficulty(item.difficulty),
          bodySystem: item.category || null,
          topic: item.subcategory || null,
          regionScope: "BOTH",
          scenario: null,
          careerType: item.tier === "rn" ? "nursing" : "respiratory_therapy",
        });
      }
    }
  } catch (e) {
    // skip malformed JSON
  }
  return questions;
}

function parseStructuredJsonRNQuestions(jsonStr: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  try {
    const items = JSON.parse(jsonStr);
    if (!Array.isArray(items)) return questions;

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
        regionScope: mapRegionScope(item.country),
        scenario: null,
        careerType: "nursing",
      });
    }
  } catch (e) {
    // skip malformed JSON
  }
  return questions;
}

function parseTextFormatRNQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const questionBlocks = text.split(/\n---\n/);

  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^QUESTION\s+\d+\s*\n/m);
    if (!headerMatch) continue;

    const afterHeader = trimmed.substring(headerMatch.index! + headerMatch[0].length);
    const lines = afterHeader.split("\n").map(l => l.trim());

    let questionType = "multiple_choice";
    let category = "";
    let difficulty = "moderate";
    let stemLines: string[] = [];
    let optionLines: string[] = [];
    let correctAnswers: string[] = [];
    let rationaleText = "";
    let scenario = "";
    let inOptions = false;
    let inCorrectAnswers = false;
    let inRationale = false;
    let inScenario = false;
    let inCase = false;
    let caseSubQuestions: any[] = [];
    let currentSubQ: any = null;

    for (const line of lines) {
      if (/^TYPE:\s*/i.test(line)) {
        questionType = line.replace(/^TYPE:\s*/i, "").trim();
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
      if (/^SCENARIO:?\s*$/i.test(line) || /^CASE:?\s*$/i.test(line)) {
        inScenario = true;
        continue;
      }
      if (/^Correct\s+(Answer|Order|Condition):?\s*(.*)/i.test(line)) {
        const match = line.match(/^Correct\s+(?:Answer|Order|Condition):?\s*(.*)/i);
        const answerPart = match?.[1]?.trim() || "";
        if (answerPart) {
          correctAnswers.push(...answerPart.split(/\s+/).filter(Boolean));
        }
        inCorrectAnswers = true;
        inRationale = false;
        inOptions = false;
        continue;
      }
      if (/^Correct\s+Answers:?\s*$/i.test(line)) {
        inCorrectAnswers = true;
        inRationale = false;
        inOptions = false;
        continue;
      }
      if (/^Rationale:?\s*$/i.test(line) || /^Rationale:\s+/i.test(line)) {
        inRationale = true;
        inCorrectAnswers = false;
        const r = line.replace(/^Rationale:?\s*/i, "").trim();
        if (r) rationaleText = r;
        continue;
      }
      if (/^Question\s+\d+:?\s*$/i.test(line)) {
        if (questionType === "case_study") {
          if (currentSubQ) caseSubQuestions.push(currentSubQ);
          currentSubQ = { stem: "", options: [], correctAnswers: [] };
          inCase = true;
        }
        continue;
      }
      if (/^(INTERVENTIONS|MONITORING PARAMETER|CONDITION OPTIONS):?\s*$/i.test(line)) {
        continue;
      }

      if (inCorrectAnswers && /^[A-E]$/.test(line)) {
        correctAnswers.push(line);
        continue;
      }
      if (inCorrectAnswers && /^[1-4]$/.test(line)) {
        correctAnswers.push(line);
        continue;
      }
      if (inRationale && line) {
        rationaleText += (rationaleText ? " " : "") + line;
        continue;
      }

      if (/^[A-E]\.\s/.test(line)) {
        inOptions = true;
        inScenario = false;
        if (inCase && currentSubQ) {
          const match = line.match(/^([A-E])\.\s*(.+)$/);
          if (match) currentSubQ.options.push({ label: match[1], text: match[2].trim() });
        } else {
          optionLines.push(line);
        }
        continue;
      }
      if (/^\d+\.\s/.test(line) && questionType === "ordered_response") {
        optionLines.push(line);
        continue;
      }

      if (inScenario) {
        scenario += (scenario ? " " : "") + line;
        continue;
      }

      if (!inOptions && !inCorrectAnswers && !inRationale && line) {
        stemLines.push(line);
      }
    }

    if (inCase && currentSubQ) caseSubQuestions.push(currentSubQ);

    const stem = stemLines.join(" ").trim();
    if (!stem) continue;

    let options: { label: string; text: string }[] = [];
    if (questionType === "ordered_response") {
      options = optionLines.map(o => {
        const match = o.match(/^(\d+)\.\s*(.+)$/);
        return match ? { label: match[1], text: match[2].trim() } : null;
      }).filter((o): o is { label: string; text: string } => o !== null);
    } else {
      options = optionLines.map(o => {
        const match = o.match(/^([A-E])\.\s*(.+)$/);
        return match ? { label: match[1], text: match[2].trim() } : null;
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
    });
  }

  return questions;
}

function extractSections(content: string): {
  plainTextSection: string;
  rrtJsonBlocks: string[];
  textFormatRNSections: string[];
  structuredJsonBlocks: string[];
} {
  const rrtJsonBlocks: string[] = [];
  const structuredJsonBlocks: string[] = [];
  const textFormatRNSections: string[] = [];

  let remaining = content;
  let plainTextEnd = content.indexOf('\n{');
  if (plainTextEnd < 0) plainTextEnd = content.length;
  const plainTextSection = content.substring(0, plainTextEnd);

  const jsonPattern = /(\{[\s\S]*?"questions"\s*:\s*\[[\s\S]*?\]\s*\})/g;
  let match;
  while ((match = jsonPattern.exec(content)) !== null) {
    const jsonStr = match[1];
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        const firstQ = parsed.questions[0];
        if (firstQ && firstQ.option_a !== undefined) {
          rrtJsonBlocks.push(jsonStr);
        }
      }
    } catch (e) {
      // skip
    }
  }

  const arrayPattern = /(\[[\s\S]*?"question_text"[\s\S]*?\])/g;
  while ((match = arrayPattern.exec(content)) !== null) {
    const jsonStr = match[1];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed[0]?.question_text) {
        structuredJsonBlocks.push(jsonStr);
      }
    } catch (e) {
      // skip - might be malformed
    }
  }

  const textRNPattern = /(?:^|\n)(QUESTION\s+\d+[\s\S]*?)(?=\nQUESTION\s+\d+|\n\{|\n\[|\nSYSTEM\s+INSTRUCTION|$)/gm;
  const allTextQuestionBlocks: string[] = [];
  let searchContent = content;

  const systemInstrPattern = /SYSTEM INSTRUCTION[\s\S]*?(?=QUESTION\s+\d+|$)/g;
  const instructionBlocks = content.match(systemInstrPattern) || [];

  for (const instrBlock of instructionBlocks) {
    const afterInstr = content.indexOf(instrBlock) + instrBlock.length;
    const nextSection = content.substring(afterInstr);
    const questionSection = nextSection.match(/^((?:QUESTION\s+\d+[\s\S]*?)(?=\n\{|\n\[|\nSYSTEM\s+INSTRUCTION|$))/);
    if (questionSection) {
      textFormatRNSections.push(questionSection[1]);
    }
  }

  const firstInstrIdx = content.indexOf("SYSTEM INSTRUCTION");
  if (firstInstrIdx > 0) {
    const beforeFirst = content.substring(plainTextEnd, firstInstrIdx);
    const questionMatch = beforeFirst.match(/(QUESTION\s+\d+[\s\S]*)/);
    if (questionMatch) {
      textFormatRNSections.push(questionMatch[1]);
    }
  }

  return { plainTextSection, rrtJsonBlocks, textFormatRNSections, structuredJsonBlocks };
}

async function importQuestions() {
  console.log("Starting question import...");

  const filePath = path.resolve(
    __dirname_esm,
    "../attached_assets/Pasted-RN-Questions-1-A-nurse-is-reviewing-laboratory-values-f_1773241055916.txt"
  );
  const content = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const allQuestions: ParsedQuestion[] = [];

  console.log("\n--- Parsing plain-text RN questions (section 1) ---");
  const plainTextEnd = content.indexOf('\n{');
  const plainTextSection = plainTextEnd > 0 ? content.substring(0, plainTextEnd) : "";
  const plainTextQ = parsePlainTextRNQuestions(plainTextSection);
  console.log(`Found ${plainTextQ.length} plain-text RN questions`);
  allQuestions.push(...plainTextQ);

  console.log("\n--- Parsing RRT JSON questions ---");
  const rrtJsonPattern = /\{\s*"questions"\s*:\s*\[/g;
  let rrtMatch;
  let rrtTotal = 0;
  while ((rrtMatch = rrtJsonPattern.exec(content)) !== null) {
    const startIdx = rrtMatch.index;
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
    const parsed = parseRRTJsonQuestions(jsonStr);
    rrtTotal += parsed.length;
    allQuestions.push(...parsed);
  }
  console.log(`Found ${rrtTotal} RRT JSON questions`);

  console.log("\n--- Parsing structured JSON RN questions ---");
  const arrayStarts = [4114, 19042, 20279, 20662];
  let structuredTotal = 0;
  for (const lineNum of arrayStarts) {
    const lineOffset = content.split("\n").slice(0, lineNum - 1).join("\n").length + 1;
    let bracketCount = 0;
    let endIdx = lineOffset;
    let started = false;
    for (let i = lineOffset; i < content.length; i++) {
      if (content[i] === "[") { bracketCount++; started = true; }
      if (content[i] === "]") bracketCount--;
      if (started && bracketCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
    let jsonStr = content.substring(lineOffset, endIdx);
    jsonStr = jsonStr.replace(/"\s*\n\s*,/g, '",');
    const parsed = parseStructuredJsonRNQuestions(jsonStr);
    structuredTotal += parsed.length;
    allQuestions.push(...parsed);
  }
  console.log(`Found ${structuredTotal} structured JSON RN questions`);

  console.log("\n--- Parsing text-format RN questions (QUESTION N format) ---");
  const textSections: string[] = [];
  const questionNPattern = /QUESTION\s+\d+/g;
  let qMatch;
  const questionPositions: number[] = [];
  while ((qMatch = questionNPattern.exec(content)) !== null) {
    questionPositions.push(qMatch.index);
  }

  for (let i = 0; i < questionPositions.length; i++) {
    const start = questionPositions[i];
    const end = i + 1 < questionPositions.length
      ? questionPositions[i + 1]
      : content.length;
    let block = content.substring(start, end).trim();

    if (block.includes('"questions"') || block.includes('"question_text"') || block.includes("SYSTEM INSTRUCTION")) {
      const cutIdx = Math.min(
        block.includes('{') ? block.indexOf('{') : Infinity,
        block.includes('[') ? block.indexOf('[') : Infinity,
        block.includes('SYSTEM INSTRUCTION') ? block.indexOf('SYSTEM INSTRUCTION') : Infinity
      );
      if (cutIdx < Infinity) block = block.substring(0, cutIdx).trim();
    }
    textSections.push(block);
  }

  const fullTextContent = textSections.join("\n---\n");
  const textFormatQ = parseTextFormatRNQuestions(fullTextContent);
  console.log(`Found ${textFormatQ.length} text-format RN questions`);
  allQuestions.push(...textFormatQ);

  console.log(`\nTotal parsed: ${allQuestions.length} questions`);

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
  console.log(`Deduplicated: ${dupeCount} duplicates removed, ${uniqueMap.size} unique questions`);

  const existingHashes = new Set<string>();
  try {
    const result = await pool.query("SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL");
    for (const row of result.rows) {
      existingHashes.add(row.stem_hash);
    }
    console.log(`Found ${existingHashes.size} existing questions in DB`);
  } catch (e) {
    console.log("No existing questions found (table may be empty)");
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
  console.log(`Inserting ${toInsert.length} new questions`);

  const stats = { rn: 0, rrt: 0, errors: 0 };
  const BATCH_SIZE = 50;

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);

    for (const { hash, q } of batch) {
      try {
        await pool.query(
          `INSERT INTO exam_questions (
            tier, exam, question_type, status, stem, options, correct_answer,
            rationale, difficulty, body_system, topic, region_scope,
            stem_hash, career_type, scenario
          ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            q.tier,
            q.exam,
            q.questionType,
            "active",
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
          ]
        );
        if (q.tier === "rrt") stats.rrt++;
        else stats.rn++;
      } catch (e: any) {
        stats.errors++;
        console.error(`Error inserting question: ${q.stem.substring(0, 60)}... - ${e.message}`);
      }
    }

    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${batch.length} questions`);
  }

  console.log("\n=== Import Summary ===");
  console.log(`RN questions inserted: ${stats.rn}`);
  console.log(`RRT questions inserted: ${stats.rrt}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Total inserted: ${stats.rn + stats.rrt}`);

}

importQuestions().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
