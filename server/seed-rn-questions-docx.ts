import crypto from "crypto";
import mammoth from "mammoth";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pool } from "./storage";

const __filename_esm = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

function stemHash(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("md5").update(normalized).digest("hex");
}

interface ParsedQuestion {
  tier: string;
  exam: string;
  questionType: string;
  stem: string;
  options: string[];
  correctAnswer: number[];
  rationale: string;
  difficulty: number;
  bodySystem: string | null;
  topic: string | null;
  scenario: string | null;
  regionScope: string;
  clinicalPearl: string | null;
}

function mapDifficulty(val: string | undefined): number {
  if (!val) return 3;
  const lower = val.toLowerCase();
  if (lower === "easy") return 1;
  if (lower === "moderate" || lower === "medium") return 3;
  if (lower === "hard") return 4;
  return 3;
}

function mapQuestionType(val: string): string {
  const lower = val.toLowerCase().replace(/\s+/g, "_");
  const mapping: Record<string, string> = {
    multiple_choice: "multiple_choice",
    select_all_that_apply: "select_all_that_apply",
    priority: "priority",
    case_study: "case_study",
    bowtie: "bowtie",
    ordered_response: "ordered_response",
    ordering: "ordered_response",
    multiple_response: "select_all_that_apply",
  };
  return mapping[lower] || "multiple_choice";
}

function letterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65;
}

function parsePlainNumberedQuestions(lines: string[]): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  let i = 0;
  const limit = Math.min(lines.length, 1300);

  while (i < limit) {
    const line = lines[i].trim();
    if (!/^\d+\.$/.test(line)) {
      i++;
      continue;
    }

    let j = i + 1;
    while (j < limit && !lines[j].trim()) j++;
    const stem = lines[j]?.trim() || "";
    if (!stem) { i++; continue; }
    j++;

    const options: string[] = [];
    while (j < limit) {
      const optLine = lines[j].trim();
      const optMatch = optLine.match(/^([A-E])\.\s+(.+)/);
      if (optMatch) {
        options.push(optMatch[2].trim());
      } else if (options.length > 0 && optLine && !/^Correct\s/i.test(optLine) && !/^Rationale/i.test(optLine) && optLine !== "---") {
        break;
      }
      j++;
    }

    let correctAnswer: number[] = [];
    let rationale = "";
    while (j < limit) {
      const cl = lines[j].trim();
      if (/^Correct\s+Answers?:\s*(.+)/i.test(cl)) {
        const match = cl.match(/^Correct\s+Answers?:\s*(.+)/i);
        if (match) {
          const letters = match[1].trim().split(/\s+/);
          correctAnswer = letters.map(l => letterToIndex(l)).filter(n => n >= 0 && n < options.length);
        }
        j++;
        continue;
      }
      if (/^Correct\s+Answer$/i.test(cl)) {
        j++;
        while (j < limit && !lines[j].trim()) j++;
        const ansLine = lines[j]?.trim() || "";
        const letters = ansLine.split(/\s+/).filter(l => /^[A-E]$/.test(l));
        correctAnswer = letters.map(l => letterToIndex(l)).filter(n => n >= 0 && n < options.length);
        j++;
        continue;
      }
      if (/^Rationale:\s*(.+)/i.test(cl)) {
        const match = cl.match(/^Rationale:\s*(.+)/i);
        rationale = match ? match[1].trim() : "";
        j++;
        break;
      }
      if (cl === "---") break;
      j++;
    }

    if (stem && options.length >= 2) {
      if (correctAnswer.length === 0) correctAnswer = [0];
      const isSata = stem.toLowerCase().includes("select all that apply") || correctAnswer.length > 1;
      questions.push({
        tier: "rn",
        exam: "NCLEX-RN",
        questionType: isSata ? "select_all_that_apply" : "multiple_choice",
        stem,
        options,
        correctAnswer,
        rationale,
        difficulty: 3,
        bodySystem: null,
        topic: null,
        scenario: null,
        regionScope: "BOTH",
        clinicalPearl: null,
      });
    }

    while (j < limit && lines[j].trim() !== "---" && !/^\d+\.$/.test(lines[j].trim())) j++;
    i = j;
  }

  return questions;
}

function parseStructuredQuestions(lines: string[]): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const questionStarts: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (/^QUESTION\s+\d+$/.test(lines[i].trim())) {
      questionStarts.push(i);
    }
  }

  for (let qi = 0; qi < questionStarts.length; qi++) {
    const start = questionStarts[qi];
    const end = qi + 1 < questionStarts.length ? questionStarts[qi + 1] : Math.min(start + 200, lines.length);

    let questionType = "multiple_choice";
    let category = "";
    let difficulty = "";
    let scenario = "";
    let stem = "";

    let j = start + 1;
    while (j < end) {
      const l = lines[j].trim();
      const typeMatch = l.match(/^TYPE:\s*(.+)/);
      if (typeMatch) { questionType = typeMatch[1].trim(); j++; continue; }
      const catMatch = l.match(/^CATEGORY:\s*(.+)/);
      if (catMatch) { category = catMatch[1].trim(); j++; continue; }
      const diffMatch = l.match(/^DIFFICULTY:\s*(.+)/);
      if (diffMatch) { difficulty = diffMatch[1].trim(); j++; continue; }
      if (/^TARGET_EXAMS:|^CONTENT_TIER:/.test(l)) { j++; continue; }
      if (l) break;
      j++;
    }

    const mappedType = mapQuestionType(questionType);

    if (mappedType === "case_study") {
      let caseText = "";
      while (j < end && !/^CASE$/i.test(lines[j].trim())) j++;
      j++;
      while (j < end) {
        const l = lines[j].trim();
        if (/^Question\s+\d+$/i.test(l)) break;
        if (l) caseText += (caseText ? " " : "") + l;
        j++;
      }

      const subQuestions: { stem: string; options: string[]; correct: number[] }[] = [];
      while (j < end) {
        const l = lines[j].trim();
        if (/^Question\s+\d+$/i.test(l)) {
          j++;
          while (j < end && !lines[j].trim()) j++;
          const subStem = lines[j]?.trim() || "";
          j++;

          const subOptions: string[] = [];
          while (j < end) {
            const ol = lines[j].trim();
            const om = ol.match(/^([A-E])\.\s+(.+)/);
            if (om) {
              subOptions.push(om[2].trim());
            } else if (subOptions.length > 0 && ol && !/^$/.test(ol)) {
              break;
            }
            j++;
          }

          let subCorrect: number[] = [];
          while (j < end) {
            const cl = lines[j].trim();
            if (/^Correct\s+Answer/i.test(cl)) {
              const inline = cl.match(/^Correct\s+Answers?:\s*(.+)/i);
              if (inline) {
                subCorrect = inline[1].trim().split(/\s+/).map(l => letterToIndex(l)).filter(n => n >= 0);
              } else {
                j++;
                while (j < end && !lines[j].trim()) j++;
                const al = lines[j]?.trim() || "";
                if (/^[A-E]$/.test(al)) {
                  subCorrect = [letterToIndex(al)];
                  j++;
                  while (j < end) {
                    const nl = lines[j].trim();
                    if (/^[A-E]$/.test(nl)) {
                      subCorrect.push(letterToIndex(nl));
                      j++;
                    } else break;
                  }
                }
              }
              break;
            }
            if (/^Question\s+\d+$/i.test(cl) || cl === "---") break;
            j++;
          }

          if (subStem && subOptions.length >= 2) {
            if (subCorrect.length === 0) subCorrect = [0];
            subQuestions.push({ stem: subStem, options: subOptions, correct: subCorrect });
          }
          continue;
        }
        if (l === "---" || /^QUESTION\s+\d+$/.test(l)) break;
        j++;
      }

      for (const sq of subQuestions) {
        questions.push({
          tier: "rn",
          exam: "NCLEX-RN",
          questionType: sq.correct.length > 1 ? "select_all_that_apply" : "multiple_choice",
          stem: sq.stem,
          options: sq.options,
          correctAnswer: sq.correct,
          rationale: "",
          difficulty: mapDifficulty(difficulty),
          bodySystem: category || null,
          topic: category || null,
          scenario: caseText || null,
          regionScope: "BOTH",
          clinicalPearl: null,
        });
      }
      continue;
    }

    if (mappedType === "bowtie") {
      while (j < end && !/^SCENARIO:|^STEM:/.test(lines[j].trim())) {
        if (lines[j].trim() && !lines[j].trim().startsWith("TARGET") && !lines[j].trim().startsWith("CONTENT")) {
          break;
        }
        j++;
      }

      let scenarioText = "";
      if (/^SCENARIO:|^STEM:/.test(lines[j]?.trim() || "")) {
        j++;
        while (j < end) {
          const l = lines[j].trim();
          if (/^Condition\s+Options|^CONDITION\s+OPTIONS|^Identify\s/i.test(l)) break;
          if (l) scenarioText += (scenarioText ? " " : "") + l;
          j++;
        }
      } else {
        while (j < end) {
          const l = lines[j].trim();
          if (/^Condition\s+Options|^CONDITION\s+OPTIONS|^Identify\s/i.test(l)) break;
          if (l) scenarioText += (scenarioText ? " " : "") + l;
          j++;
        }
      }

      while (j < end && !/^Identify|^Condition\s+Options|^CONDITION/i.test(lines[j].trim())) j++;
      if (/^Identify/i.test(lines[j]?.trim() || "")) j++;

      let conditionOptions: string[] = [];
      let correctCondition = "";
      let interventionOptions: string[] = [];
      let correctInterventions: string[] = [];
      let monitoringOptions: string[] = [];
      let correctMonitoring = "";
      let rationale = "";

      while (j < end) {
        const l = lines[j].trim();
        if (/^Condition\s+Options:?$/i.test(l) || /^CONDITION\s+OPTIONS$/i.test(l)) {
          j++;
          while (j < end) {
            const cl = lines[j].trim();
            if (!cl || /^Correct\s+Condition|^CORRECT\s+CONDITION/i.test(cl)) break;
            conditionOptions.push(cl);
            j++;
          }
          continue;
        }
        if (/^Correct\s+Condition:?$/i.test(l) || /^CORRECT\s+CONDITION$/i.test(l)) {
          j++;
          while (j < end && !lines[j].trim()) j++;
          correctCondition = lines[j]?.trim() || "";
          j++;
          continue;
        }
        if (/^Intervention\s+Options:?$/i.test(l) || /^INTERVENTION\s+OPTIONS$/i.test(l)) {
          j++;
          while (j < end) {
            const cl = lines[j].trim();
            if (!cl || /^Correct\s+Intervention|^CORRECT\s+INTERVENTION/i.test(cl)) break;
            interventionOptions.push(cl);
            j++;
          }
          continue;
        }
        if (/^Correct\s+Interventions?:?$/i.test(l) || /^CORRECT\s+INTERVENTIONS?$/i.test(l)) {
          j++;
          while (j < end) {
            const cl = lines[j].trim();
            if (!cl || /^Monitoring|^MONITORING|^Rationale|^RATIONALE/i.test(cl)) break;
            correctInterventions.push(cl);
            j++;
          }
          continue;
        }
        if (/^Monitoring\s+Parameter\s+Options?:?$/i.test(l) || /^MONITORING\s+PARAMETER\s+OPTIONS?$/i.test(l)) {
          j++;
          while (j < end) {
            const cl = lines[j].trim();
            if (!cl || /^Correct\s+Monitoring|^CORRECT\s+MONITORING/i.test(cl)) break;
            monitoringOptions.push(cl);
            j++;
          }
          continue;
        }
        if (/^Correct\s+Monitoring|^CORRECT\s+MONITORING/i.test(l)) {
          j++;
          while (j < end && !lines[j].trim()) j++;
          correctMonitoring = lines[j]?.trim() || "";
          j++;
          continue;
        }
        if (/^Rationale:?$/i.test(l) || /^RATIONALE$/i.test(l)) {
          j++;
          while (j < end) {
            const rl = lines[j].trim();
            if (!rl || rl === "---") break;
            rationale += (rationale ? " " : "") + rl;
            j++;
          }
          continue;
        }
        if (l === "---") break;
        j++;
      }

      const allOptions = [...conditionOptions, ...interventionOptions, ...monitoringOptions];
      const correctIndices: number[] = [];
      const correctAnswerText = correctCondition;
      for (let oi = 0; oi < conditionOptions.length; oi++) {
        if (conditionOptions[oi] === correctCondition) correctIndices.push(oi);
      }
      for (const ci of correctInterventions) {
        const idx = interventionOptions.indexOf(ci);
        if (idx >= 0) correctIndices.push(conditionOptions.length + idx);
      }
      const monIdx = monitoringOptions.indexOf(correctMonitoring);
      if (monIdx >= 0) correctIndices.push(conditionOptions.length + interventionOptions.length + monIdx);

      if (scenarioText && allOptions.length > 0) {
        questions.push({
          tier: "rn",
          exam: "NCLEX-RN",
          questionType: "bowtie",
          stem: scenarioText,
          options: allOptions,
          correctAnswer: correctIndices.length > 0 ? correctIndices : [0],
          rationale,
          difficulty: mapDifficulty(difficulty),
          bodySystem: category || null,
          topic: category || null,
          scenario: scenarioText,
          regionScope: "BOTH",
          clinicalPearl: null,
        });
      }
      continue;
    }

    if (mappedType === "ordered_response") {
      while (j < end && !lines[j].trim()) j++;
      let orderStem = "";
      while (j < end) {
        const l = lines[j].trim();
        if (/^\d+\.\s/.test(l)) break;
        if (l) orderStem += (orderStem ? " " : "") + l;
        j++;
      }

      const items: string[] = [];
      while (j < end) {
        const l = lines[j].trim();
        const m = l.match(/^(\d+)\.\s+(.+)/);
        if (m) {
          items.push(m[2].trim());
        } else if (items.length > 0 && l) break;
        j++;
      }

      let correctOrder: number[] = [];
      while (j < end) {
        const l = lines[j].trim();
        if (/^Correct\s+Order/i.test(l)) {
          j++;
          while (j < end) {
            const ol = lines[j].trim();
            if (/^\d+$/.test(ol)) {
              correctOrder.push(parseInt(ol) - 1);
            } else if (ol && !/^$/.test(ol)) break;
            j++;
          }
          break;
        }
        if (l === "---") break;
        j++;
      }

      if (orderStem && items.length >= 2) {
        questions.push({
          tier: "rn",
          exam: "NCLEX-RN",
          questionType: "ordered_response",
          stem: orderStem,
          options: items,
          correctAnswer: correctOrder.length > 0 ? correctOrder : items.map((_, i) => i),
          rationale: "",
          difficulty: mapDifficulty(difficulty),
          bodySystem: category || null,
          topic: category || null,
          scenario: null,
          regionScope: "BOTH",
          clinicalPearl: null,
        });
      }
      continue;
    }

    while (j < end && !lines[j].trim()) j++;
    if (/^STEM:$/i.test(lines[j]?.trim() || "")) j++;
    while (j < end && !lines[j].trim()) j++;
    stem = lines[j]?.trim() || "";
    j++;

    const options: string[] = [];
    while (j < end) {
      const ol = lines[j].trim();
      const om = ol.match(/^([A-E])\.\s+(.+)/);
      if (om) {
        options.push(om[2].trim());
      } else if (options.length > 0 && ol && !/^$/.test(ol)) {
        break;
      }
      j++;
    }

    let correctAnswer: number[] = [];
    let rationale = "";
    while (j < end) {
      const cl = lines[j].trim();
      if (/^Correct\s+Answers?:\s*(.+)/i.test(cl)) {
        const match = cl.match(/^Correct\s+Answers?:\s*(.+)/i);
        if (match) {
          correctAnswer = match[1].trim().split(/\s+/).map(l => letterToIndex(l)).filter(n => n >= 0 && n < options.length);
        }
        j++;
        continue;
      }
      if (/^Correct\s+Answers?$/i.test(cl)) {
        j++;
        while (j < end) {
          const al = lines[j].trim();
          if (/^[A-E]$/.test(al)) {
            correctAnswer.push(letterToIndex(al));
            j++;
          } else if (al) break;
          else j++;
        }
        continue;
      }
      if (/^Rationale:?\s*(.*)/i.test(cl)) {
        const match = cl.match(/^Rationale:?\s*(.*)/i);
        if (match && match[1]) rationale = match[1].trim();
        j++;
        while (j < end) {
          const rl = lines[j].trim();
          if (!rl || rl === "---" || /^QUESTION\s+\d+$/.test(rl)) break;
          rationale += " " + rl;
          j++;
        }
        break;
      }
      if (cl === "---" || /^QUESTION\s+\d+$/.test(cl)) break;
      j++;
    }

    if (stem && options.length >= 2) {
      if (correctAnswer.length === 0) correctAnswer = [0];
      questions.push({
        tier: "rn",
        exam: "NCLEX-RN",
        questionType: mappedType,
        stem,
        options,
        correctAnswer,
        rationale: rationale.trim(),
        difficulty: mapDifficulty(difficulty),
        bodySystem: category || null,
        topic: category || null,
        scenario: null,
        regionScope: "BOTH",
        clinicalPearl: null,
      });
    }
  }

  return questions;
}

function mapSystemToBodySystem(system: string | undefined): string | null {
  if (!system) return null;
  const mapping: Record<string, string> = {
    respiratory: "Respiratory",
    cardiac: "Cardiovascular",
    pharmacology: "Pharmacology",
    neuro: "Neurological",
    gi: "GI",
    renal: "Renal/Urinary",
    endocrine: "Endocrine",
    infectious_disease: "Infection Control",
    mental_health: "Psychiatry",
    maternity: "Obstetrics",
    pediatrics: "Pediatrics",
    med_surg: "Medical-Surgical",
    leadership: "Leadership",
  };
  return mapping[system.toLowerCase()] || system;
}

function parseJsonQuestions(lines: string[]): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  let i = 0;

  while (i < lines.length) {
    const l = lines[i].trim();
    if (!/"question_text"/.test(l)) { i++; continue; }

    const qText = l.match(/"question_text":\s*"(.+?)"/)?.[1] || "";
    if (!qText) { i++; continue; }

    let qType = "";
    let system = "";
    let difficulty = "";
    let tier = "";
    let country = "";
    let answerOptions: string[] = [];
    let correctAnswer: string | string[] = "";
    let rationale = "";
    let topic = "";

    const blockEnd = Math.min(i + 60, lines.length);
    let j = i + 1;
    while (j < blockEnd) {
      const bl = lines[j].trim();
      const typeM = bl.match(/"question_type":\s*"(.+?)"/);
      if (typeM) qType = typeM[1];
      const sysM = bl.match(/"system":\s*"(.+?)"/);
      if (sysM) system = sysM[1];
      const diffM = bl.match(/"difficulty":\s*"(.+?)"/);
      if (diffM) difficulty = diffM[1];
      const tierM = bl.match(/"tier":\s*"(.+?)"/);
      if (tierM) tier = tierM[1];
      const countryM = bl.match(/"country":\s*"(.+?)"/);
      if (countryM) country = countryM[1];
      const topicM = bl.match(/"topic":\s*"(.+?)"/);
      if (topicM) topic = topicM[1];

      if (/"answer_options":\s*\[/.test(bl)) {
        j++;
        while (j < blockEnd) {
          const ol = lines[j].trim();
          if (ol.startsWith("]")) break;
          const optM = ol.match(/^"(.+?)"[,]?$/);
          if (optM) answerOptions.push(optM[1]);
          j++;
        }
      }

      if (/"correct_answer":\s*\[/.test(bl)) {
        const arrItems: string[] = [];
        j++;
        while (j < blockEnd) {
          const ol = lines[j].trim();
          if (ol.startsWith("]")) break;
          const optM = ol.match(/^"(.+?)"[,]?$/);
          if (optM) arrItems.push(optM[1]);
          j++;
        }
        correctAnswer = arrItems;
      } else if (/"correct_answer":\s*"(.+?)"/.test(bl)) {
        const caM = bl.match(/"correct_answer":\s*"(.+?)"/);
        if (caM) correctAnswer = caM[1];
      }

      const ratM = bl.match(/"rationale":\s*"(.+?)"/);
      if (ratM) rationale = ratM[1];

      if (bl.startsWith("}")) break;
      j++;
    }

    if (tier !== "rn") { i = j + 1; continue; }

    let correctIndices: number[] = [];
    if (Array.isArray(correctAnswer)) {
      for (const ca of correctAnswer) {
        const idx = answerOptions.indexOf(ca);
        if (idx >= 0) correctIndices.push(idx);
      }
    } else {
      const idx = answerOptions.indexOf(correctAnswer);
      if (idx >= 0) correctIndices.push(idx);
    }

    if (correctIndices.length === 0) correctIndices = [0];

    const mappedType = mapQuestionType(qType || "multiple_choice");
    let regionScope = "BOTH";
    if (country === "canada") regionScope = "CAN";
    else if (country === "us") regionScope = "US";

    questions.push({
      tier: "rn",
      exam: "NCLEX-RN",
      questionType: mappedType === "select_all_that_apply" ? "select_all_that_apply" : (correctIndices.length > 1 ? "select_all_that_apply" : mappedType),
      stem: qText,
      options: answerOptions,
      correctAnswer: correctIndices,
      rationale,
      difficulty: mapDifficulty(difficulty),
      bodySystem: mapSystemToBodySystem(system),
      topic: topic || null,
      scenario: null,
      regionScope,
      clinicalPearl: null,
    });

    i = j + 1;
  }

  return questions;
}

export async function seedRNQuestionsFromDocx(): Promise<{
  total: number;
  inserted: number;
  skipped: number;
  errors: number;
  details: string[];
}> {
  const existingCount = await pool.query(
    "SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE tier = 'rn'"
  );
  if (existingCount.rows[0].cnt >= 3951) {
    console.log(`[DocxSeed] Fast-path: ${existingCount.rows[0].cnt} RN questions exist (>= expected), skipping docx import`);
    return { total: 483, inserted: 0, skipped: 483, errors: 0, details: [] };
  }

  const details: string[] = [];
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  const candidates = [
    path.resolve(process.cwd(), "attached_assets/RN_Questions_1773276116851.docx"),
    path.resolve(__dirname_esm, "../attached_assets/RN_Questions_1773276116851.docx"),
  ];

  let docxPath = "";
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      docxPath = candidate;
      break;
    }
  }

  if (!docxPath) {
    details.push("DOCX file not found. Searched: " + candidates.join(", "));
    return { total: 0, inserted: 0, skipped: 0, errors: 0, details };
  }

  details.push(`Found DOCX at: ${docxPath}`);

  const result = await mammoth.extractRawText({ path: docxPath });
  const lines = result.value.split("\n");
  details.push(`Extracted ${lines.length} lines from DOCX`);

  const plainQuestions = parsePlainNumberedQuestions(lines);
  details.push(`Parsed ${plainQuestions.length} plain numbered questions`);

  const structuredQuestions = parseStructuredQuestions(lines);
  details.push(`Parsed ${structuredQuestions.length} structured QUESTION N questions`);

  const jsonQuestions = parseJsonQuestions(lines);
  details.push(`Parsed ${jsonQuestions.length} JSON format RN questions`);

  const allQuestions = [...plainQuestions, ...structuredQuestions, ...jsonQuestions];
  details.push(`Total parsed: ${allQuestions.length}`);

  const existingHashes = await pool.query("SELECT stem_hash FROM exam_questions WHERE tier = 'rn'");
  const existingSet = new Set<string>();
  for (const row of existingHashes.rows) {
    existingSet.add(row.stem_hash);
  }
  details.push(`Existing RN questions in DB: ${existingSet.size}`);

  const seenHashes = new Set<string>();
  const toInsert: ParsedQuestion[] = [];
  for (const q of allQuestions) {
    const hash = stemHash(q.stem);
    if (existingSet.has(hash) || seenHashes.has(hash)) {
      skipped++;
      continue;
    }
    seenHashes.add(hash);
    toInsert.push(q);
  }

  details.push(`To insert: ${toInsert.length}, skipped (duplicates): ${skipped}`);

  const BATCH_SIZE = 50;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const q of batch) {
        try {
          const hash = stemHash(q.stem);
          await client.query(
            `INSERT INTO exam_questions (
              tier, exam, question_type, status, published_at, stem, options, correct_answer,
              rationale, difficulty, body_system, topic, region_scope, career_type,
              stem_hash, scenario, clinical_pearl
            ) VALUES ($1, $2, $3, 'published', NOW(), $4, $5, $6, $7, $8, $9, $10, $11, 'nursing', $12, $13, $14)`,
            [
              q.tier,
              q.exam,
              q.questionType,
              q.stem,
              JSON.stringify(q.options),
              JSON.stringify(q.correctAnswer),
              q.rationale || "",
              q.difficulty,
              q.bodySystem,
              q.topic,
              q.regionScope,
              hash,
              q.scenario,
              q.clinicalPearl,
            ]
          );
          inserted++;
        } catch (err: any) {
          errors++;
          if (errors <= 10) {
            details.push(`Insert error: ${err.message.substring(0, 200)}`);
          }
        }
      }
      await client.query("COMMIT");
    } catch (txErr: any) {
      await client.query("ROLLBACK");
      errors += batch.length;
      details.push(`Batch error: ${txErr.message.substring(0, 200)}`);
    } finally {
      client.release();
    }
  }

  details.push(`Complete: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);
  console.log(`[DocxSeed] ${details[details.length - 1]}`);

  return { total: allQuestions.length, inserted, skipped, errors, details };
}
