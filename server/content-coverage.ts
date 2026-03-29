import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { routeAIRequest } from "./ai-provider-router";

const DEFAULT_COVERAGE_TARGETS = {
  nursing: {
    questionsPerBodySystem: 300,
    questionsPerSpecialty: 500,
    questionsPerSubtopic: 100,
  },
  allied: {
    questionsPerProfession: 300,
    questionsPerTopic: 75,
  },
  flashcards: {
    cardsPerTopic: 25,
  },
};

const DIFFICULTY_DISTRIBUTION = { easy: 0.3, moderate: 0.5, hard: 0.2 };
const QUESTION_BATCH_SIZE = 50;
const FLASHCARD_BATCH_SIZE = 25;
const DUPLICATE_SIMILARITY_THRESHOLD = 0.75;

async function getCoverageTargets(): Promise<typeof DEFAULT_COVERAGE_TARGETS> {
  try {
    const r = await pool.query("SELECT value FROM system_settings WHERE key = 'coverage_targets'");
    if (r.rows.length > 0 && r.rows[0].value) {
      const stored = r.rows[0].value;
      return {
        nursing: { ...DEFAULT_COVERAGE_TARGETS.nursing, ...(stored.nursing || {}) },
        allied: { ...DEFAULT_COVERAGE_TARGETS.allied, ...(stored.allied || {}) },
        flashcards: { ...DEFAULT_COVERAGE_TARGETS.flashcards, ...(stored.flashcards || {}) },
      };
    }
  } catch {}
  return DEFAULT_COVERAGE_TARGETS;
}

async function saveCoverageTargets(targets: any, updatedBy: string): Promise<void> {
  await pool.query(
    `INSERT INTO system_settings (key, value, updated_at, updated_by)
     VALUES ('coverage_targets', $1, NOW(), $2)
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW(), updated_by = $2`,
    [JSON.stringify(targets), updatedBy]
  );
}

async function getDisabledTopics(): Promise<string[]> {
  try {
    const r = await pool.query("SELECT value FROM system_settings WHERE key = 'coverage_disabled_topics'");
    if (r.rows.length > 0 && r.rows[0].value?.topics) {
      return r.rows[0].value.topics;
    }
  } catch {}
  return [];
}

async function setDisabledTopics(topics: string[], updatedBy: string): Promise<void> {
  await pool.query(
    `INSERT INTO system_settings (key, value, updated_at, updated_by)
     VALUES ('coverage_disabled_topics', $1, NOW(), $2)
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW(), updated_by = $2`,
    [JSON.stringify({ topics }), updatedBy]
  );
}

interface CoverageAnalysis {
  nursing: {
    totalQuestions: number;
    byTier: Record<string, number>;
    byBodySystem: Record<string, { count: number; target: number; deficit: number }>;
    byTopic: Record<string, { count: number; target: number; deficit: number }>;
    bySubtopic: Record<string, { count: number; target: number; deficit: number }>;
    byDifficulty: Record<string, number>;
  };
  allied: {
    totalQuestions: number;
    byCareer: Record<string, { count: number; target: number; deficit: number }>;
    byTopic: Record<string, { count: number; target: number; deficit: number }>;
  };
  flashcards: {
    nursingTotal: number;
    alliedTotal: number;
    nursingByTopic: Record<string, { count: number; target: number; deficit: number }>;
    alliedByTopic: Record<string, { count: number; target: number; deficit: number }>;
  };
  deficits: Array<{
    category: string;
    area: string;
    current: number;
    target: number;
    deficit: number;
    type: "question" | "flashcard";
  }>;
  summary: {
    totalDeficits: number;
    totalQuestionsNeeded: number;
    totalFlashcardsNeeded: number;
    coveragePercent: number;
  };
}

async function runCoverageAnalysis(): Promise<CoverageAnalysis> {
  const targets = await getCoverageTargets();
  const disabledTopics = await getDisabledTopics();

  const [
    nursingByTier,
    nursingByBody,
    nursingByTopic,
    nursingBySubtopic,
    nursingByDifficulty,
    alliedByCareer,
    alliedByTopic,
    flashcardNursingByTopic,
    flashcardAlliedByTopic,
  ] = await Promise.all([
    pool.query(`SELECT tier, COUNT(*)::int as count FROM exam_questions WHERE status IN ('published','draft') GROUP BY tier`),
    pool.query(`SELECT body_system, COUNT(*)::int as count FROM exam_questions WHERE status IN ('published','draft') AND body_system IS NOT NULL GROUP BY body_system`),
    pool.query(`SELECT topic, COUNT(*)::int as count FROM exam_questions WHERE status IN ('published','draft') AND topic IS NOT NULL GROUP BY topic`),
    pool.query(`SELECT subtopic, COUNT(*)::int as count FROM exam_questions WHERE status IN ('published','draft') AND subtopic IS NOT NULL GROUP BY subtopic`),
    pool.query(`SELECT difficulty, COUNT(*)::int as count FROM exam_questions WHERE status IN ('published','draft') GROUP BY difficulty`),
    pool.query(`SELECT career_type, COUNT(*)::int as count FROM allied_questions WHERE status != 'rejected' GROUP BY career_type`),
    pool.query(`SELECT blueprint_category, COUNT(*)::int as count FROM allied_questions WHERE status != 'rejected' AND blueprint_category IS NOT NULL GROUP BY blueprint_category`),
    pool.query(`SELECT COALESCE(topic, topic_tag, body_system, 'uncategorized') as topic, COUNT(*)::int as count FROM flashcard_bank WHERE status IN ('published','draft') GROUP BY COALESCE(topic, topic_tag, body_system, 'uncategorized')`),
    pool.query(`SELECT COALESCE(blueprint_category, 'uncategorized') as topic, COUNT(*)::int as count FROM allied_flashcards GROUP BY COALESCE(blueprint_category, 'uncategorized')`),
  ]);

  const nursingTotal = nursingByTier.rows.reduce((s: number, r: any) => s + r.count, 0);
  const alliedTotal = alliedByCareer.rows.reduce((s: number, r: any) => s + r.count, 0);

  const nursing: CoverageAnalysis["nursing"] = {
    totalQuestions: nursingTotal,
    byTier: {},
    byBodySystem: {},
    byTopic: {},
    bySubtopic: {},
    byDifficulty: {},
  };

  for (const r of nursingByTier.rows) nursing.byTier[r.tier] = r.count;
  for (const r of nursingByBody.rows) {
    const t = targets.nursing.questionsPerBodySystem;
    nursing.byBodySystem[r.body_system] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }
  for (const r of nursingByTopic.rows) {
    const t = targets.nursing.questionsPerSpecialty;
    nursing.byTopic[r.topic] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }
  for (const r of nursingBySubtopic.rows) {
    const t = targets.nursing.questionsPerSubtopic;
    nursing.bySubtopic[r.subtopic] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }
  for (const r of nursingByDifficulty.rows) nursing.byDifficulty[String(r.difficulty)] = r.count;

  const allied: CoverageAnalysis["allied"] = {
    totalQuestions: alliedTotal,
    byCareer: {},
    byTopic: {},
  };

  for (const r of alliedByCareer.rows) {
    const t = targets.allied.questionsPerProfession;
    allied.byCareer[r.career_type] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }
  for (const r of alliedByTopic.rows) {
    const t = targets.allied.questionsPerTopic;
    allied.byTopic[r.blueprint_category] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }

  const nursingFcTotal = flashcardNursingByTopic.rows.reduce((s: number, r: any) => s + r.count, 0);
  const alliedFcTotal = flashcardAlliedByTopic.rows.reduce((s: number, r: any) => s + r.count, 0);

  const flashcards: CoverageAnalysis["flashcards"] = {
    nursingTotal: nursingFcTotal,
    alliedTotal: alliedFcTotal,
    nursingByTopic: {},
    alliedByTopic: {},
  };

  for (const r of flashcardNursingByTopic.rows) {
    const t = targets.flashcards.cardsPerTopic;
    flashcards.nursingByTopic[r.topic] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }
  for (const r of flashcardAlliedByTopic.rows) {
    const t = targets.flashcards.cardsPerTopic;
    flashcards.alliedByTopic[r.topic] = { count: r.count, target: t, deficit: Math.max(0, t - r.count) };
  }

  const [knownBodySystems, knownAlliedCareers] = await Promise.all([
    pool.query(`SELECT DISTINCT body_system FROM exam_questions WHERE body_system IS NOT NULL UNION SELECT DISTINCT body_system FROM flashcard_bank WHERE body_system IS NOT NULL`),
    pool.query(`SELECT DISTINCT career_type FROM allied_questions WHERE career_type IS NOT NULL UNION SELECT DISTINCT career_type FROM allied_flashcards WHERE career_type IS NOT NULL`),
  ]);

  const EXPECTED_BODY_SYSTEMS = [
    "Cardiovascular", "Respiratory", "Neurological", "Musculoskeletal",
    "Gastrointestinal", "Renal/Urinary", "Endocrine", "Integumentary",
    "Hematological", "Immunological", "Reproductive", "Mental Health",
    "Pediatric", "Maternal/Newborn", "Oncology",
  ];
  const EXPECTED_ALLIED_CAREERS = [
    "paramedic", "respiratory_therapist", "surgical_technologist",
    "medical_laboratory", "radiologic_technologist", "phlebotomy",
  ];

  const allBodySystems = new Set([
    ...EXPECTED_BODY_SYSTEMS,
    ...knownBodySystems.rows.map((r: any) => r.body_system),
  ]);
  const allAlliedCareers = new Set([
    ...EXPECTED_ALLIED_CAREERS,
    ...knownAlliedCareers.rows.map((r: any) => r.career_type),
  ]);

  for (const bs of allBodySystems) {
    if (!nursing.byBodySystem[bs]) {
      nursing.byBodySystem[bs] = { count: 0, target: targets.nursing.questionsPerBodySystem, deficit: targets.nursing.questionsPerBodySystem };
    }
  }
  for (const career of allAlliedCareers) {
    if (!allied.byCareer[career]) {
      allied.byCareer[career] = { count: 0, target: targets.allied.questionsPerProfession, deficit: targets.allied.questionsPerProfession };
    }
  }

  const deficits: CoverageAnalysis["deficits"] = [];

  for (const [area, data] of Object.entries(nursing.byBodySystem)) {
    if (data.deficit > 0 && !disabledTopics.includes(`nursing:body_system:${area}`)) {
      deficits.push({ category: "Nursing - Body System", area, current: data.count, target: data.target, deficit: data.deficit, type: "question" });
    }
  }
  for (const [area, data] of Object.entries(nursing.byTopic)) {
    if (data.deficit > 0 && !disabledTopics.includes(`nursing:topic:${area}`)) {
      deficits.push({ category: "Nursing - Topic", area, current: data.count, target: data.target, deficit: data.deficit, type: "question" });
    }
  }
  for (const [area, data] of Object.entries(allied.byCareer)) {
    if (data.deficit > 0 && !disabledTopics.includes(`allied:career:${area}`)) {
      deficits.push({ category: "Allied Health - Career", area, current: data.count, target: data.target, deficit: data.deficit, type: "question" });
    }
  }
  for (const [area, data] of Object.entries(allied.byTopic)) {
    if (data.deficit > 0 && !disabledTopics.includes(`allied:topic:${area}`)) {
      deficits.push({ category: "Allied Health - Topic", area, current: data.count, target: data.target, deficit: data.deficit, type: "question" });
    }
  }
  for (const [area, data] of Object.entries(flashcards.nursingByTopic)) {
    if (data.deficit > 0 && !disabledTopics.includes(`flashcard:nursing:${area}`)) {
      deficits.push({ category: "Flashcard - Nursing", area, current: data.count, target: data.target, deficit: data.deficit, type: "flashcard" });
    }
  }
  for (const [area, data] of Object.entries(flashcards.alliedByTopic)) {
    if (data.deficit > 0 && !disabledTopics.includes(`flashcard:allied:${area}`)) {
      deficits.push({ category: "Flashcard - Allied", area, current: data.count, target: data.target, deficit: data.deficit, type: "flashcard" });
    }
  }

  deficits.sort((a, b) => b.deficit - a.deficit);

  const totalQuestionsNeeded = deficits.filter(d => d.type === "question").reduce((s, d) => s + d.deficit, 0);
  const totalFlashcardsNeeded = deficits.filter(d => d.type === "flashcard").reduce((s, d) => s + d.deficit, 0);
  const totalCurrentQuestions = nursingTotal + alliedTotal;
  const totalCurrentFlashcards = nursingFcTotal + alliedFcTotal;
  const totalTargetQuestions = totalCurrentQuestions + totalQuestionsNeeded;
  const totalTargetFlashcards = totalCurrentFlashcards + totalFlashcardsNeeded;
  const totalCurrent = totalCurrentQuestions + totalCurrentFlashcards;
  const totalTarget = totalTargetQuestions + totalTargetFlashcards;
  const coveragePercent = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 100;

  return {
    nursing,
    allied,
    flashcards,
    deficits,
    summary: {
      totalDeficits: deficits.length,
      totalQuestionsNeeded,
      totalFlashcardsNeeded,
      coveragePercent,
    },
  };
}

function jaccardSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) { if (wordsB.has(w)) intersection++; }
  const union = new Set([...wordsA, ...wordsB]).size;
  return union > 0 ? intersection / union : 0;
}

async function checkDuplicateStem(stem: string, table: "exam_questions" | "allied_questions"): Promise<boolean> {
  const col = "stem";
  const r = await pool.query(
    `SELECT ${col} FROM ${table} WHERE status != 'rejected' ORDER BY created_at DESC LIMIT 500`
  );
  for (const row of r.rows) {
    if (jaccardSimilarity(stem, row[col]) > DUPLICATE_SIMILARITY_THRESHOLD) {
      return true;
    }
  }
  return false;
}

async function checkFlashcardDuplicate(front: string, table: "flashcard_bank" | "allied_flashcards"): Promise<boolean> {
  const r = await pool.query(
    `SELECT front FROM ${table} ORDER BY created_at DESC LIMIT 500`
  );
  for (const row of r.rows) {
    if (jaccardSimilarity(front, row.front) > DUPLICATE_SIMILARITY_THRESHOLD) {
      return true;
    }
  }
  return false;
}

function validateQuestion(q: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!q.stem || q.stem.length < 30) errors.push("Stem too short or missing");
  if (!q.stem || q.stem.length > 3000) errors.push("Stem too long");
  if (!q.rationale && !q.rationaleLong) errors.push("Rationale missing");
  if (!Array.isArray(q.options) || q.options.length < 4) errors.push("Need at least 4 answer options");
  if (q.correctAnswer === undefined && q.correct_answer === undefined) errors.push("No correct answer specified");
  if (!q.topic && !q.bodySystem && !q.blueprintCategory && !q.domain) errors.push("Missing topic/category metadata");
  if (!q.difficulty || q.difficulty < 1 || q.difficulty > 5) errors.push("Invalid difficulty (must be 1-5)");
  return { valid: errors.length === 0, errors };
}

function validateFlashcard(card: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!card.front || card.front.length < 10) errors.push("Front too short or missing");
  if (!card.back || card.back.length < 10) errors.push("Back too short or missing");
  return { valid: errors.length === 0, errors };
}

function parseJsonFromResponse(text: string): any {
  try {
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) return JSON.parse(arrMatch[0]);
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    return null;
  } catch { return null; }
}

async function aiGenerate(systemPrompt: string, userPrompt: string, maxTokens = 16000): Promise<string> {
  const result = await routeAIRequest(systemPrompt, userPrompt, {
    model: "gpt-4o-mini",
    maxTokens,
    temperature: 0.7,
    taskType: "qbank",
    feature: "content-coverage-generator",
  });
  return result.content;
}

function assignDifficulty(index: number, total: number): number {
  const easyCount = Math.round(total * DIFFICULTY_DISTRIBUTION.easy);
  const moderateCount = Math.round(total * DIFFICULTY_DISTRIBUTION.moderate);
  if (index < easyCount) return Math.random() < 0.5 ? 1 : 2;
  if (index < easyCount + moderateCount) return 3;
  return Math.random() < 0.5 ? 4 : 5;
}

interface GenerationReport {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: "running" | "completed" | "failed";
  questionsGenerated: number;
  questionsAccepted: number;
  questionsRejected: number;
  duplicatesSkipped: number;
  flashcardsGenerated: number;
  flashcardsAccepted: number;
  topicsReachedTarget: string[];
  topicsBelowTarget: string[];
  batches: Array<{ topic: string; type: string; generated: number; accepted: number; rejected: number; duplicates: number }>;
  error?: string;
}

async function generateQuestionsForDeficit(
  deficit: CoverageAnalysis["deficits"][0],
  report: GenerationReport
): Promise<void> {
  const count = Math.min(deficit.deficit, QUESTION_BATCH_SIZE);
  const isNursing = deficit.category.startsWith("Nursing");

  const difficultyInstructions = `Difficulty distribution: ${Math.round(count * 0.3)} easy (difficulty 1-2), ${Math.round(count * 0.5)} moderate (difficulty 3), ${Math.round(count * 0.2)} hard (difficulty 4-5).`;

  const systemPrompt = isNursing
    ? `You are an expert NCLEX-style nursing exam question writer. Generate clinical reasoning questions for ${deficit.area}. Each question must include a realistic clinical scenario with patient context.`
    : `You are an expert allied health exam question writer. Generate certification-style questions for ${deficit.area}. Each question must test clinical reasoning with realistic scenarios.`;

  const userPrompt = `Generate exactly ${count} unique exam-style questions for: ${deficit.area}

${difficultyInstructions}

Each question MUST include:
- "stem": clinical scenario with patient context (100-400 words)
- "options": array of 4-5 answer choices (plausible distractors)
- "correctAnswer": array of correct answer indices (0-based)
- "rationale": detailed explanation (200+ words) covering why correct answer is right and why distractors are wrong
- "difficulty": 1-5 rating
- "topic": "${deficit.area}"
- "bodySystem": relevant body system
- "subtopic": specific subtopic within ${deficit.area}
- "clinicalPearls": array of 2-3 exam tips
- "questionType": "MCQ"
- "tags": array of relevant tags

Return ONLY a valid JSON array. No markdown, no explanation.`;

  try {
    const content = await aiGenerate(systemPrompt, userPrompt, Math.min(count * 1500, 32000));
    const questions = parseJsonFromResponse(content);
    if (!Array.isArray(questions) || questions.length === 0) {
      report.batches.push({ topic: deficit.area, type: deficit.category, generated: 0, accepted: 0, rejected: 0, duplicates: 0 });
      return;
    }

    let accepted = 0;
    let rejected = 0;
    let duplicates = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      q.difficulty = q.difficulty || assignDifficulty(i, questions.length);

      const validation = validateQuestion(q);
      if (!validation.valid) { rejected++; continue; }

      const table = isNursing ? "exam_questions" : "allied_questions";
      const isDuplicate = await checkDuplicateStem(q.stem, table);
      if (isDuplicate) { duplicates++; continue; }

      if (isNursing) {
        const tier = q.tier || "rn";
        await pool.query(
          `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, career_type)
           VALUES ($1, $2, $3, 'draft', $4, $5, $6, $7, $8, $9, $10, $11, $12, 'nursing')`,
          [
            tier, q.exam || "NCLEX-RN", q.questionType || "MCQ", q.stem,
            JSON.stringify(q.options || []), JSON.stringify(q.correctAnswer || []),
            q.rationale || q.rationaleLong || "", q.difficulty || 3,
            q.tags || [], q.bodySystem || deficit.area,
            q.topic || deficit.area, q.subtopic || null,
          ]
        );
      } else {
        const isCareerDeficit = deficit.category === "Allied Health - Career";
        const careerType = isCareerDeficit ? deficit.area : (q.careerType || "general");
        const blueprintCategory = isCareerDeficit ? (q.blueprintCategory || "") : deficit.area;
        await pool.query(
          `INSERT INTO allied_questions (career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, clinical_pearls, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')`,
          [
            careerType, q.stem, JSON.stringify(q.options || []),
            typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
            q.rationale || q.rationaleLong || "", q.learningObjective || "",
            blueprintCategory, q.subtopic || "",
            q.difficulty || 3, q.cognitiveLevel || "application",
            q.questionType || "MCQ_SINGLE", JSON.stringify(q.clinicalPearls || []),
          ]
        );
      }
      accepted++;
    }

    report.questionsGenerated += questions.length;
    report.questionsAccepted += accepted;
    report.questionsRejected += rejected;
    report.duplicatesSkipped += duplicates;
    report.batches.push({ topic: deficit.area, type: deficit.category, generated: questions.length, accepted, rejected, duplicates });

    if (accepted >= deficit.deficit) {
      report.topicsReachedTarget.push(deficit.area);
    } else {
      report.topicsBelowTarget.push(deficit.area);
    }
  } catch (err: any) {
    report.batches.push({ topic: deficit.area, type: deficit.category, generated: 0, accepted: 0, rejected: 0, duplicates: 0 });
    console.error(`[Coverage Gen] Error generating for ${deficit.area}:`, err.message);
  }
}

async function generateFlashcardsForDeficit(
  deficit: CoverageAnalysis["deficits"][0],
  report: GenerationReport
): Promise<void> {
  const count = Math.min(deficit.deficit, FLASHCARD_BATCH_SIZE);
  const isNursing = deficit.category.includes("Nursing");

  const systemPrompt = isNursing
    ? "You are an expert nursing education flashcard writer. Create concise, exam-relevant flashcards."
    : "You are an expert allied health education flashcard writer. Create concise, exam-relevant flashcards.";

  const userPrompt = `Generate exactly ${count} educational flashcards for: ${deficit.area}

Include a mix of formats:
- Term-definition cards (clinical terminology)
- Clinical concept cards (pathophysiology, interventions)
- Exam recall cards (high-yield facts for certification exams)

Each card MUST include:
- "front": question or concept prompt (concise, clear)
- "back": answer or explanation (thorough but concise)
- "cardType": one of "definition", "clinical_concept", "exam_recall"
- "topic": "${deficit.area}"
- "difficulty": 1-5
- "examRelevance": brief note on why this is important for exams

Return ONLY a valid JSON array.`;

  try {
    const content = await aiGenerate(systemPrompt, userPrompt, Math.min(count * 800, 16000));
    const cards = parseJsonFromResponse(content);
    if (!Array.isArray(cards) || cards.length === 0) {
      report.batches.push({ topic: deficit.area, type: "Flashcard", generated: 0, accepted: 0, rejected: 0, duplicates: 0 });
      return;
    }

    let accepted = 0;
    let rejected = 0;
    let duplicates = 0;

    for (const card of cards) {
      const validation = validateFlashcard(card);
      if (!validation.valid) { rejected++; continue; }

      const table = isNursing ? "flashcard_bank" : "allied_flashcards";
      const isDuplicate = await checkFlashcardDuplicate(card.front, table);
      if (isDuplicate) { duplicates++; continue; }

      if (isNursing) {
        await pool.query(
          `INSERT INTO flashcard_bank (tier, front, back, topic, topic_tag, status, source_type, difficulty, category)
           VALUES ('rn', $1, $2, $3, $4, 'draft', 'auto_coverage', $5, $6)`,
          [card.front, card.back, deficit.area, deficit.area, card.difficulty || 3, card.cardType || "definition"]
        );
      } else {
        const careerType = deficit.area.split(" - ")[0] || "general";
        await pool.query(
          `INSERT INTO allied_flashcards (career_type, card_type, front, back, blueprint_category, subtopic)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [careerType, card.cardType || "definition", card.front, card.back, deficit.area, card.topic || null]
        );
      }
      accepted++;
    }

    report.flashcardsGenerated += cards.length;
    report.flashcardsAccepted += accepted;
    report.batches.push({ topic: deficit.area, type: "Flashcard", generated: cards.length, accepted, rejected, duplicates });
  } catch (err: any) {
    report.batches.push({ topic: deficit.area, type: "Flashcard", generated: 0, accepted: 0, rejected: 0, duplicates: 0 });
    console.error(`[Coverage Gen] Flashcard error for ${deficit.area}:`, err.message);
  }
}

async function convertFlashcardsToQuestions(
  topic: string,
  isNursing: boolean,
  report: GenerationReport
): Promise<void> {
  const table = isNursing ? "flashcard_bank" : "allied_flashcards";
  const topicCol = isNursing ? "topic" : "blueprint_category";

  const flashcards = await pool.query(
    `SELECT front, back FROM ${table} WHERE ${topicCol} = $1 ORDER BY created_at DESC LIMIT 10`,
    [topic]
  );

  if (flashcards.rows.length === 0) return;

  const conceptList = flashcards.rows.map((fc: any) => `Concept: ${fc.front}\nAnswer: ${fc.back}`).join("\n\n");

  const systemPrompt = "You are an expert exam question writer. Convert flashcard concepts into clinical reasoning exam questions.";
  const userPrompt = `Convert these flashcard concepts into exam-style questions:

${conceptList}

For each concept, generate 1 question with:
- "stem": clinical scenario testing this concept (100+ words)
- "options": array of 4 answer choices
- "correctAnswer": array of correct indices
- "rationale": explanation (150+ words)
- "difficulty": 3
- "topic": "${topic}"
- "questionType": "MCQ"

Return ONLY a valid JSON array.`;

  try {
    const content = await aiGenerate(systemPrompt, userPrompt, 12000);
    const questions = parseJsonFromResponse(content);
    if (!Array.isArray(questions)) return;

    let accepted = 0;
    for (const q of questions) {
      const validation = validateQuestion(q);
      if (!validation.valid) continue;

      const qTable = isNursing ? "exam_questions" : "allied_questions";
      const isDuplicate = await checkDuplicateStem(q.stem, qTable);
      if (isDuplicate) continue;

      if (isNursing) {
        await pool.query(
          `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, career_type)
           VALUES ('rn', 'NCLEX-RN', $1, 'draft', $2, $3, $4, $5, $6, $7, $8, $9, $10, 'nursing')`,
          [
            q.questionType || "MCQ", q.stem, JSON.stringify(q.options || []),
            JSON.stringify(q.correctAnswer || []), q.rationale || "",
            q.difficulty || 3, q.tags || [], q.bodySystem || topic,
            topic, q.subtopic || null,
          ]
        );
      } else {
        const careerFromTopic = topic.split(" - ")[0] || "general";
        await pool.query(
          `INSERT INTO allied_questions (career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'application', 'MCQ_SINGLE', 'pending')`,
          [
            careerFromTopic, q.stem, JSON.stringify(q.options || []),
            typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
            q.rationale || "", q.learningObjective || "",
            topic, q.subtopic || "", q.difficulty || 3,
          ]
        );
      }
      accepted++;
    }

    report.questionsGenerated += questions.length;
    report.questionsAccepted += accepted;
    report.batches.push({ topic, type: "Flashcard-to-Question", generated: questions.length, accepted, rejected: questions.length - accepted, duplicates: 0 });
  } catch (err: any) {
    console.error(`[Coverage Gen] Flashcard-to-question error for ${topic}:`, err.message);
  }
}

async function runAutoGeneration(
  maxBatches: number = 10,
  questionOnly: boolean = false,
  flashcardOnly: boolean = false,
  specificTopics?: string[]
): Promise<GenerationReport> {
  const report: GenerationReport = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    status: "running",
    questionsGenerated: 0,
    questionsAccepted: 0,
    questionsRejected: 0,
    duplicatesSkipped: 0,
    flashcardsGenerated: 0,
    flashcardsAccepted: 0,
    topicsReachedTarget: [],
    topicsBelowTarget: [],
    batches: [],
  };

  try {
    const analysis = await runCoverageAnalysis();
    let deficits = analysis.deficits;

    if (specificTopics && specificTopics.length > 0) {
      deficits = deficits.filter(d => specificTopics.some(t => d.area.toLowerCase().includes(t.toLowerCase())));
    }

    if (questionOnly) {
      deficits = deficits.filter(d => d.type === "question");
    }
    if (flashcardOnly) {
      deficits = deficits.filter(d => d.type === "flashcard");
    }

    const batchesToProcess = deficits.slice(0, maxBatches);
    let batchCount = 0;

    for (const deficit of batchesToProcess) {
      if (batchCount >= maxBatches) break;

      if (deficit.type === "question") {
        await generateQuestionsForDeficit(deficit, report);
      } else {
        await generateFlashcardsForDeficit(deficit, report);
        const isNursing = deficit.category.includes("Nursing");
        await convertFlashcardsToQuestions(deficit.area, isNursing, report);
      }
      batchCount++;
    }

    report.status = "completed";
    report.completedAt = new Date().toISOString();
  } catch (err: any) {
    report.status = "failed";
    report.error = err.message;
    report.completedAt = new Date().toISOString();
  }

  try {
    await pool.query(
      `INSERT INTO system_settings (key, value, updated_at, updated_by)
       VALUES ('coverage_last_report', $1, NOW(), 'system')
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(report)]
    );
  } catch {}

  return report;
}

export function setupContentCoverageRoutes(app: Express): void {
  app.get("/api/admin/content-coverage/analysis", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const analysis = await runCoverageAnalysis();
      res.json(analysis);
    } catch (err: any) {
      console.error("[Content Coverage] Analysis error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-coverage/targets", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const targets = await getCoverageTargets();
      const disabled = await getDisabledTopics();
      res.json({ targets, disabledTopics: disabled });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/content-coverage/targets", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { targets, disabledTopics } = req.body;
      if (targets) {
        await saveCoverageTargets(targets, admin.username || admin.id);
      }
      if (Array.isArray(disabledTopics)) {
        await setDisabledTopics(disabledTopics, admin.username || admin.id);
      }
      const updated = await getCoverageTargets();
      const disabled = await getDisabledTopics();
      res.json({ targets: updated, disabledTopics: disabled });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-coverage/generate", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { maxBatches = 5, questionOnly = false, flashcardOnly = false, topics } = req.body;
      const report = await runAutoGeneration(
        Math.min(maxBatches, 20),
        questionOnly,
        flashcardOnly,
        topics
      );
      res.json(report);
    } catch (err: any) {
      console.error("[Content Coverage] Generation error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-coverage/last-report", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const r = await pool.query("SELECT value FROM system_settings WHERE key = 'coverage_last_report'");
      if (r.rows.length === 0) return res.json(null);
      res.json(r.rows[0].value);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
