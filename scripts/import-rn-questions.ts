import { createHash } from "crypto";
import { readFileSync } from "fs";
import { db } from "../server/storage";
import { examQuestions } from "../shared/schema";
import { eq } from "drizzle-orm";

interface ParsedQuestion {
  stem: string;
  questionType: string;
  options: any;
  correctAnswer: any;
  rationale?: string;
  bodySystem?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: number;
  scenario?: string;
  caseId?: string;
  exhibitData?: any;
}

function computeStemHash(stem: string): string {
  const normalized = stem.trim().toLowerCase().replace(/\s+/g, " ");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 32);
}

function mapDifficulty(diff?: string): number {
  if (!diff) return 3;
  const d = diff.toLowerCase();
  if (d === "easy") return 1;
  if (d === "medium" || d === "moderate") return 3;
  if (d === "hard") return 5;
  return 3;
}

function mapQuestionType(type?: string): string {
  if (!type) return "mcq";
  const t = type.toLowerCase().replace(/[_\s-]+/g, "_");
  if (t === "multiple_choice") return "mcq";
  if (t === "select_all_that_apply") return "sata";
  if (t === "ordered_response") return "ordered_response";
  if (t === "case_study") return "case_study";
  if (t === "bowtie" || t === "bow_tie") return "bowtie";
  if (t === "priority") return "priority";
  return "mcq";
}

function mapCategory(category?: string): { bodySystem: string; topic: string } {
  if (!category) return { bodySystem: "General", topic: "General" };
  const c = category.trim();
  const mapping: Record<string, { bodySystem: string; topic: string }> = {
    "Cardiac": { bodySystem: "Cardiovascular", topic: "Cardiac" },
    "Respiratory": { bodySystem: "Respiratory", topic: "Respiratory" },
    "Pharmacology": { bodySystem: "Pharmacology", topic: "Pharmacology" },
    "Emergency Nursing": { bodySystem: "Emergency", topic: "Emergency Nursing" },
    "Emergency": { bodySystem: "Emergency", topic: "Emergency Nursing" },
    "Endocrine": { bodySystem: "Endocrine", topic: "Endocrine" },
    "Neurology": { bodySystem: "Neurological", topic: "Neurology" },
    "Clinical Judgment": { bodySystem: "Clinical Judgment", topic: "Clinical Judgment" },
    "Maternal Health": { bodySystem: "Maternal/Newborn", topic: "Maternal Health" },
    "Heart Failure": { bodySystem: "Cardiovascular", topic: "Heart Failure" },
    "Sepsis": { bodySystem: "Immune/Infection", topic: "Sepsis" },
    "Stroke": { bodySystem: "Neurological", topic: "Stroke" },
    "Pediatrics": { bodySystem: "Pediatrics", topic: "Pediatrics" },
    "Renal": { bodySystem: "Renal/Urinary", topic: "Renal" },
    "Infection Control": { bodySystem: "Immune/Infection", topic: "Infection Control" },
    "CPR": { bodySystem: "Emergency", topic: "CPR" },
    "Fluid and Electrolyte": { bodySystem: "Fluid/Electrolyte", topic: "Fluid and Electrolyte" },
    "Gastrointestinal": { bodySystem: "Gastrointestinal", topic: "Gastrointestinal" },
    "Oncology": { bodySystem: "Oncology", topic: "Oncology" },
    "Mental Health": { bodySystem: "Mental Health", topic: "Mental Health" },
    "Ethics": { bodySystem: "Professional Practice", topic: "Ethics" },
    "Delegation": { bodySystem: "Professional Practice", topic: "Delegation" },
    "Pain Management": { bodySystem: "Pain Management", topic: "Pain Management" },
    "Wound Care": { bodySystem: "Integumentary", topic: "Wound Care" },
    "Perioperative": { bodySystem: "Perioperative", topic: "Perioperative" },
    "IV Therapy": { bodySystem: "Pharmacology", topic: "IV Therapy" },
    "Lab Values": { bodySystem: "Laboratory", topic: "Lab Values" },
    "Diabetes": { bodySystem: "Endocrine", topic: "Diabetes" },
    "Immune": { bodySystem: "Immune/Infection", topic: "Immune" },
    "Musculoskeletal": { bodySystem: "Musculoskeletal", topic: "Musculoskeletal" },
    "Gerontology": { bodySystem: "Gerontology", topic: "Gerontology" },
    "Growth and Development": { bodySystem: "Pediatrics", topic: "Growth and Development" },
    "Legal and Ethical": { bodySystem: "Professional Practice", topic: "Legal and Ethical" },
    "Nutrition": { bodySystem: "Nutrition", topic: "Nutrition" },
    "Blood Disorders": { bodySystem: "Hematologic", topic: "Blood Disorders" },
    "Community Health": { bodySystem: "Community Health", topic: "Community Health" },
    "Postpartum": { bodySystem: "Maternal/Newborn", topic: "Postpartum" },
    "Newborn": { bodySystem: "Maternal/Newborn", topic: "Newborn" },
    "Labor and Delivery": { bodySystem: "Maternal/Newborn", topic: "Labor and Delivery" },
    "Safety": { bodySystem: "Safety", topic: "Safety" },
    "Prioritization": { bodySystem: "Clinical Judgment", topic: "Prioritization" },
    "Cultural Competence": { bodySystem: "Professional Practice", topic: "Cultural Competence" },
  };
  return mapping[c] || { bodySystem: c, topic: c };
}

function mapSystemToBodySystem(system?: string): string {
  if (!system) return "General";
  const s = system.toLowerCase().replace(/[_-]/g, " ");
  const sysMap: Record<string, string> = {
    "respiratory": "Respiratory",
    "cardiac": "Cardiovascular",
    "cardiovascular": "Cardiovascular",
    "endocrine": "Endocrine",
    "pharmacology": "Pharmacology",
    "gi": "Gastrointestinal",
    "gastrointestinal": "Gastrointestinal",
    "neuro": "Neurological",
    "neurological": "Neurological",
    "neurology": "Neurological",
    "renal": "Renal/Urinary",
    "immune": "Immune/Infection",
    "med surg": "Medical-Surgical",
    "mental health": "Mental Health",
    "maternal": "Maternal/Newborn",
    "pediatrics": "Pediatrics",
    "musculoskeletal": "Musculoskeletal",
    "integumentary": "Integumentary",
    "hematologic": "Hematologic",
  };
  return sysMap[s] || system;
}

function parsePlainTextQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const blocks = text.split(/\n---\n/);

  for (const block of blocks) {
    const lines = block.trim().split("\n").filter(l => l.trim());
    if (lines.length < 3) continue;

    let stemLines: string[] = [];
    let options: { label: string; text: string }[] = [];
    let correctAnswer: string[] = [];
    let rationale = "";
    let isSATA = false;

    let mode = "number";
    for (const line of lines) {
      const trimmed = line.trim();

      if (/^\d+\.\s*$/.test(trimmed)) {
        mode = "stem";
        continue;
      }

      if (/^[A-E]\.\s+/.test(trimmed)) {
        mode = "options";
        const label = trimmed[0];
        const text = trimmed.substring(2).trim().replace(/\s+$/, "");
        options.push({ label, text });
        continue;
      }

      if (/^Correct Answers?:\s*(.*)/.test(trimmed)) {
        const match = trimmed.match(/^Correct Answers?:\s*(.*)/);
        if (match && match[1].trim()) {
          correctAnswer = match[1].trim().split(/\s+/).filter(a => /^[A-E]$/.test(a));
        }
        if (trimmed.includes("Answers")) isSATA = true;
        mode = "answer";
        continue;
      }

      if (/^Rationale:?\s*(.*)/.test(trimmed)) {
        const match = trimmed.match(/^Rationale:?\s*(.*)/);
        rationale = match ? match[1].trim() : "";
        mode = "rationale";
        continue;
      }

      if (mode === "stem" || mode === "number") {
        stemLines.push(trimmed);
        mode = "stem";
      } else if (mode === "answer" && /^[A-E]$/.test(trimmed)) {
        correctAnswer.push(trimmed);
      } else if (mode === "rationale") {
        rationale += " " + trimmed;
      }
    }

    const stem = stemLines.join(" ").trim();
    if (!stem || options.length === 0) continue;

    const optionsArr = options.map(o => ({ label: o.label, text: o.text }));
    const qType = isSATA || correctAnswer.length > 1 ? "sata" : "mcq";

    questions.push({
      stem,
      questionType: qType,
      options: optionsArr,
      correctAnswer: correctAnswer.length > 0 ? correctAnswer : ["A"],
      rationale: rationale.trim() || undefined,
      bodySystem: "General",
      topic: "General Nursing",
      difficulty: 3,
    });
  }

  return questions;
}

function parseStructuredQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const questionBlocks = text.split(/(?=^QUESTION\s+\d+)/m);

  for (const block of questionBlocks) {
    if (!block.trim().startsWith("QUESTION")) continue;
    const lines = block.split("\n");

    let type = "";
    let category = "";
    let difficulty = "";
    let stemLines: string[] = [];
    let options: { label: string; text: string }[] = [];
    let correctAnswer: string[] = [];
    let rationale = "";
    let scenario = "";
    let caseText = "";
    let mode = "header";

    let conditionOptions: string[] = [];
    let correctCondition = "";
    let interventions: string[] = [];
    let monitoringParam = "";
    let interventionOptions: string[] = [];
    let monitoringOptions: string[] = [];
    let correctMonitoring = "";
    let correctInterventions: string[] = [];
    let correctOrder: string[] = [];
    let subQuestions: any[] = [];
    let currentSubQ: any = null;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed) continue;

      if (/^QUESTION\s+\d+/.test(trimmed)) continue;

      if (/^TYPE:\s*(.+)/.test(trimmed)) {
        type = trimmed.match(/^TYPE:\s*(.+)/)![1].trim();
        continue;
      }

      if (/^CATEGORY:\s*(.+)/.test(trimmed)) {
        category = trimmed.match(/^CATEGORY:\s*(.+)/)![1].trim();
        continue;
      }

      if (/^DIFFICULTY:\s*(.+)/.test(trimmed)) {
        difficulty = trimmed.match(/^DIFFICULTY:\s*(.+)/)![1].trim();
        continue;
      }

      if (/^TARGET_EXAMS?:/.test(trimmed)) continue;
      if (/^CONTENT_TIER:/.test(trimmed)) continue;

      if (/^SCENARIO:?\s*$/i.test(trimmed)) {
        mode = "scenario";
        continue;
      }

      if (/^STEM:?\s*$/i.test(trimmed)) {
        mode = "stem_block";
        continue;
      }

      if (/^STEM:\s*(.+)/i.test(trimmed)) {
        const m = trimmed.match(/^STEM:\s*(.+)/i);
        if (m) stemLines.push(m[1].trim());
        mode = "stem_after";
        continue;
      }

      if (/^CASE:?\s*$/i.test(trimmed)) {
        mode = "case";
        continue;
      }

      if (/^CONDITION OPTIONS?\s*$/i.test(trimmed)) {
        mode = "condition_options";
        continue;
      }

      if (/^Correct Condition:?\s*$/i.test(trimmed)) {
        mode = "correct_condition";
        continue;
      }

      if (/^Correct Condition:?\s*(.+)/i.test(trimmed)) {
        correctCondition = trimmed.match(/^Correct Condition:?\s*(.+)/i)![1].trim();
        continue;
      }

      if (/^INTERVENTION OPTIONS?\s*$/i.test(trimmed)) {
        mode = "intervention_options";
        continue;
      }

      if (/^INTERVENTIONS?:?\s*$/i.test(trimmed)) {
        mode = "interventions";
        continue;
      }

      if (/^CORRECT INTERVENTIONS?\s*$/i.test(trimmed)) {
        mode = "correct_interventions";
        continue;
      }

      if (/^MONITORING PARAMETER OPTIONS?\s*$/i.test(trimmed)) {
        mode = "monitoring_options";
        continue;
      }

      if (/^MONITORING PARAMETER:?\s*$/i.test(trimmed)) {
        mode = "monitoring";
        continue;
      }

      if (/^CORRECT MONITORING PARAMETER\s*$/i.test(trimmed)) {
        mode = "correct_monitoring";
        continue;
      }

      if (/^Correct Order:?\s*$/i.test(trimmed)) {
        mode = "correct_order";
        continue;
      }

      if (/^Question\s+\d+:?\s*$/i.test(trimmed)) {
        if (currentSubQ) subQuestions.push(currentSubQ);
        currentSubQ = { stem: "", options: [], correctAnswer: [] };
        mode = "subq_stem";
        continue;
      }

      if (/^Correct Answers?:?\s*$/i.test(trimmed)) {
        mode = "answer";
        continue;
      }

      if (/^Correct Answers?:\s*(.+)/i.test(trimmed)) {
        const match = trimmed.match(/^Correct Answers?:\s*(.+)/i)!;
        const ans = match[1].trim().split(/\s+/).filter(a => /^[A-E]$/.test(a));
        if (currentSubQ) {
          currentSubQ.correctAnswer = ans;
        } else {
          correctAnswer = ans;
        }
        mode = "after_answer";
        continue;
      }

      if (/^Rationale:?\s*$/i.test(trimmed)) {
        mode = "rationale";
        continue;
      }

      if (/^Rationale:\s*(.+)/i.test(trimmed)) {
        rationale = trimmed.match(/^Rationale:\s*(.+)/i)![1].trim();
        mode = "rationale";
        continue;
      }

      if (/^RATIONALE\s*$/i.test(trimmed)) {
        mode = "rationale";
        continue;
      }

      if (/^[A-E]\.\s+/.test(trimmed)) {
        const label = trimmed[0];
        const text = trimmed.substring(2).trim().replace(/\s+$/, "");
        if (currentSubQ) {
          currentSubQ.options.push({ label, text });
        } else {
          options.push({ label, text });
        }
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed) && (type.toLowerCase() === "ordered_response" || mode === "correct_order")) {
        if (mode === "correct_order") {
          continue;
        }
        const text = trimmed.replace(/^\d+\.\s+/, "").trim();
        options.push({ label: String(options.length + 1), text });
        continue;
      }

      if (mode === "answer" && /^[A-E]$/.test(trimmed)) {
        if (currentSubQ) {
          currentSubQ.correctAnswer.push(trimmed);
        } else {
          correctAnswer.push(trimmed);
        }
        continue;
      }

      if (mode === "correct_order" && /^\d+$/.test(trimmed)) {
        correctOrder.push(trimmed);
        continue;
      }

      if (mode === "scenario") {
        scenario += (scenario ? " " : "") + trimmed;
        continue;
      }

      if (mode === "stem_block" || mode === "stem_after") {
        stemLines.push(trimmed);
        continue;
      }

      if (mode === "case") {
        caseText += (caseText ? " " : "") + trimmed;
        continue;
      }

      if (mode === "condition_options") {
        conditionOptions.push(trimmed);
        continue;
      }

      if (mode === "correct_condition") {
        correctCondition = trimmed;
        continue;
      }

      if (mode === "intervention_options") {
        interventionOptions.push(trimmed);
        continue;
      }

      if (mode === "interventions") {
        interventions.push(trimmed);
        continue;
      }

      if (mode === "correct_interventions") {
        correctInterventions.push(trimmed);
        continue;
      }

      if (mode === "monitoring_options") {
        monitoringOptions.push(trimmed);
        continue;
      }

      if (mode === "monitoring") {
        monitoringParam = trimmed;
        continue;
      }

      if (mode === "correct_monitoring") {
        correctMonitoring = trimmed;
        continue;
      }

      if (mode === "rationale") {
        rationale += (rationale ? " " : "") + trimmed;
        continue;
      }

      if (mode === "subq_stem") {
        if (currentSubQ) currentSubQ.stem += (currentSubQ.stem ? " " : "") + trimmed;
        continue;
      }

      if (mode === "header" && !type && !category) {
        stemLines.push(trimmed);
      }
    }

    if (currentSubQ) subQuestions.push(currentSubQ);

    const mappedType = mapQuestionType(type);
    const { bodySystem: bs, topic: tp } = mapCategory(category);

    if (mappedType === "bowtie") {
      const stem = scenario || stemLines.join(" ");
      if (!stem.trim()) continue;

      const bowtieOptions: any = {
        conditions: conditionOptions.length > 0 ? conditionOptions : [],
        interventions: interventionOptions.length > 0 ? interventionOptions : interventions,
        monitoringParameters: monitoringOptions.length > 0 ? monitoringOptions : (monitoringParam ? [monitoringParam] : []),
      };
      const bowtieAnswer: any = {
        condition: correctCondition,
        interventions: correctInterventions.length > 0 ? correctInterventions : interventions,
        monitoring: correctMonitoring || monitoringParam,
      };

      questions.push({
        stem,
        questionType: "bowtie",
        options: bowtieOptions,
        correctAnswer: bowtieAnswer,
        rationale: rationale.trim() || undefined,
        bodySystem: bs,
        topic: tp,
        difficulty: mapDifficulty(difficulty),
        scenario: scenario || undefined,
      });
    } else if (mappedType === "case_study") {
      const caseIdVal = `case_${computeStemHash(caseText || stemLines.join(" ")).slice(0, 8)}`;

      for (let qi = 0; qi < subQuestions.length; qi++) {
        const sq = subQuestions[qi];
        if (!sq.stem.trim()) continue;
        questions.push({
          stem: sq.stem,
          questionType: "case_study",
          options: sq.options,
          correctAnswer: sq.correctAnswer.length > 0 ? sq.correctAnswer : ["A"],
          rationale: rationale.trim() || undefined,
          bodySystem: bs,
          topic: tp,
          difficulty: mapDifficulty(difficulty),
          scenario: caseText || undefined,
          caseId: caseIdVal,
        });
      }

      if (subQuestions.length === 0) {
        const stem = stemLines.join(" ").trim();
        if (!stem) continue;
        questions.push({
          stem,
          questionType: "case_study",
          options,
          correctAnswer: correctAnswer.length > 0 ? correctAnswer : ["A"],
          rationale: rationale.trim() || undefined,
          bodySystem: bs,
          topic: tp,
          difficulty: mapDifficulty(difficulty),
          scenario: caseText || undefined,
        });
      }
    } else if (mappedType === "ordered_response") {
      const stem = stemLines.join(" ").trim();
      if (!stem) continue;
      questions.push({
        stem,
        questionType: "ordered_response",
        options: options,
        correctAnswer: correctOrder.length > 0 ? correctOrder : correctAnswer,
        rationale: rationale.trim() || undefined,
        bodySystem: bs,
        topic: tp,
        difficulty: mapDifficulty(difficulty),
      });
    } else {
      const stem = stemLines.join(" ").trim();
      if (!stem) continue;

      const qType = correctAnswer.length > 1 ? "sata" : mappedType;
      questions.push({
        stem,
        questionType: qType,
        options,
        correctAnswer: correctAnswer.length > 0 ? correctAnswer : ["A"],
        rationale: rationale.trim() || undefined,
        bodySystem: bs,
        topic: tp,
        difficulty: mapDifficulty(difficulty),
      });
    }
  }

  return questions;
}

function parseJsonQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const jsonBlockRegex = /\{[\s\S]*?"questions"\s*:\s*\[[\s\S]*?\]\s*\}/g;
  const standaloneArrayRegex = /\[\s*\{[\s\S]*?"question_text"[\s\S]*?\}\s*\]/g;

  let match: RegExpExecArray | null;

  while ((match = jsonBlockRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[0]);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        for (const q of parsed.questions) {
          const pq = convertJsonQuestion(q);
          if (pq) questions.push(pq);
        }
      }
    } catch {
      try {
        const fixed = fixJson(match[0]);
        const parsed = JSON.parse(fixed);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          for (const q of parsed.questions) {
            const pq = convertJsonQuestion(q);
            if (pq) questions.push(pq);
          }
        }
      } catch {}
    }
  }

  while ((match = standaloneArrayRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) {
        for (const q of parsed) {
          const pq = convertJsonQuestion(q);
          if (pq) questions.push(pq);
        }
      }
    } catch {
      try {
        const fixed = fixJson(match[0]);
        const parsed = JSON.parse(fixed);
        if (Array.isArray(parsed)) {
          for (const q of parsed) {
            const pq = convertJsonQuestion(q);
            if (pq) questions.push(pq);
          }
        }
      } catch {}
    }
  }

  return questions;
}

function fixJson(text: string): string {
  return text
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
}

function convertJsonQuestion(q: any): ParsedQuestion | null {
  const stem = q.stem || q.question_text;
  if (!stem) return null;

  let options: any;
  let correctAnswer: any;

  if (q.answer_options && Array.isArray(q.answer_options)) {
    options = q.answer_options.map((text: string, i: number) => ({
      label: String.fromCharCode(65 + i),
      text,
    }));
    if (q.correct_answer) {
      if (Array.isArray(q.correct_answer)) {
        correctAnswer = q.correct_answer;
      } else {
        const idx = q.answer_options.indexOf(q.correct_answer);
        if (idx >= 0) {
          correctAnswer = [String.fromCharCode(65 + idx)];
        } else {
          correctAnswer = [q.correct_answer];
        }
      }
    }
  } else if (q.option_a) {
    options = [];
    for (const letter of ["a", "b", "c", "d", "e"]) {
      if (q[`option_${letter}`]) {
        options.push({ label: letter.toUpperCase(), text: q[`option_${letter}`] });
      }
    }
    correctAnswer = q.correct_answer ? [q.correct_answer] : ["A"];
  } else if (q.options) {
    if (typeof q.options === "object" && !Array.isArray(q.options)) {
      options = Object.entries(q.options).map(([label, text]) => ({ label, text }));
    } else {
      options = q.options;
    }
    correctAnswer = q.correct_answer ? (Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer]) : ["A"];
  } else {
    return null;
  }

  const qType = mapQuestionType(q.question_type || q.interaction_type);
  const sys = q.system || q.category;
  const bodySystem = q.system ? mapSystemToBodySystem(q.system) : mapCategory(q.category || "").bodySystem;
  const topic = q.topic || q.subcategory || q.category || "General";
  const diff = q.difficulty;

  return {
    stem,
    questionType: qType,
    options,
    correctAnswer: correctAnswer || ["A"],
    rationale: q.rationale || undefined,
    bodySystem,
    topic,
    difficulty: mapDifficulty(diff),
    scenario: q.scenario || undefined,
  };
}

async function main() {
  console.log("=== RN Question Import Script ===\n");

  const filePath = "attached_assets/Pasted-RN-Questions-1-A-nurse-is-reviewing-laboratory-values-f_1773241154970.txt";
  const content = readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const firstStructuredIdx = content.indexOf("QUESTION 1\nTYPE:");
  const firstJsonIdx = content.indexOf('{\n"questions":[');
  const firstJsonIdx2 = content.indexOf('{\n  "questions": [');

  const plainTextEnd = Math.min(
    firstStructuredIdx > 0 ? firstStructuredIdx : content.length,
    firstJsonIdx > 0 ? firstJsonIdx : content.length,
    firstJsonIdx2 > 0 ? firstJsonIdx2 : content.length,
  );

  const lines = content.split("\n");
  let plainTextEndLine = 0;
  let charCount = 0;
  for (let i = 0; i < lines.length; i++) {
    charCount += lines[i].length + 1;
    if (charCount >= plainTextEnd) {
      plainTextEndLine = i;
      break;
    }
  }

  const plainTextSection = lines.slice(0, Math.min(plainTextEndLine, 610)).join("\n");
  console.log("Parsing plain text questions...");
  const plainTextQuestions = parsePlainTextQuestions(plainTextSection);
  console.log(`  Found ${plainTextQuestions.length} plain text questions`);

  console.log("Parsing structured questions...");
  const structuredQuestions = parseStructuredQuestions(content);
  console.log(`  Found ${structuredQuestions.length} structured questions`);

  console.log("Parsing JSON questions...");
  const jsonQuestions = parseJsonQuestions(content);
  console.log(`  Found ${jsonQuestions.length} JSON questions`);

  const allQuestions = [...plainTextQuestions, ...structuredQuestions, ...jsonQuestions];
  console.log(`\nTotal parsed: ${allQuestions.length} questions`);

  const uniqueMap = new Map<string, ParsedQuestion>();
  for (const q of allQuestions) {
    const hash = computeStemHash(q.stem);
    if (!uniqueMap.has(hash)) {
      uniqueMap.set(hash, q);
    }
  }
  console.log(`Unique by stemHash: ${uniqueMap.size} questions`);

  const existing = await db.select({ stemHash: examQuestions.stemHash }).from(examQuestions).where(eq(examQuestions.tier, "rn"));
  const existingHashes = new Set(existing.map(e => e.stemHash).filter(Boolean));
  console.log(`Existing RN questions in DB: ${existing.length}`);

  const toInsert: any[] = [];
  for (const [hash, q] of uniqueMap) {
    if (existingHashes.has(hash)) continue;

    toInsert.push({
      tier: "rn",
      exam: "NCLEX-RN",
      questionType: q.questionType,
      status: "published",
      stem: q.stem,
      options: q.options,
      correctAnswer: q.correctAnswer,
      rationale: q.rationale || null,
      difficulty: q.difficulty || 3,
      bodySystem: q.bodySystem || "General",
      topic: q.topic || "General",
      regionScope: "BOTH",
      stemHash: hash,
      careerType: "nursing",
      scenario: q.scenario || null,
      caseId: q.caseId || null,
      tags: [],
    });
  }

  console.log(`\nNew questions to insert: ${toInsert.length}`);
  console.log(`Skipped (already exist): ${uniqueMap.size - toInsert.length}`);

  if (toInsert.length === 0) {
    console.log("\nNo new questions to import. Done.");
    process.exit(0);
  }

  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    try {
      await db.insert(examQuestions).values(batch);
      inserted += batch.length;
      process.stdout.write(`\rInserted ${inserted}/${toInsert.length} questions...`);
    } catch (err: any) {
      console.error(`\nError inserting batch at index ${i}:`, err.message);
      for (const q of batch) {
        try {
          await db.insert(examQuestions).values(q);
          inserted++;
        } catch (e2: any) {
          console.error(`  Failed single insert for: "${q.stem.slice(0, 60)}..." - ${e2.message}`);
        }
      }
    }
  }

  console.log(`\n\nImport complete! Inserted ${inserted} questions.\n`);

  const typeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  for (const q of toInsert) {
    typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
    categoryCounts[q.bodySystem] = (categoryCounts[q.bodySystem] || 0) + 1;
  }

  console.log("=== Import Summary ===");
  console.log("\nBy Question Type:");
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  console.log("\nBy Body System/Category:");
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
