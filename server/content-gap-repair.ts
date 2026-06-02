import crypto from "crypto";
import { pool } from "./storage";
import { routeAIRequest } from "./ai-provider-router";
import { batchProcess } from "./replit_integrations/batch/utils";

function generateContentHash(text: string, tier: string): string {
  return crypto.createHash("sha256").update(`${text}::${tier}`).digest("hex");
}

interface AlliedQuestionRow {
  id: string;
  career_type: string;
  stem: string;
  options: any;
  correct_answer: number;
  rationale_long: string;
  learning_objective: string;
  blueprint_category: string;
  subtopic: string;
  difficulty: number;
  cognitive_level: string;
  question_type: string;
  exam_trap: string | null;
  clinical_pearls: any;
  safety_note: string | null;
  distractor_rationales: any;
  status: string;
}

interface ImagingQuestionRow {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  rationale: string;
  category: string;
  topic: string;
  difficulty: string;
  country: string;
  body_part: string;
  modality: string;
  exam: string;
}

interface NeedsReviewQuestion {
  id: string;
  tier: string;
  stem: string;
  options: any;
  correct_answer: any;
  rationale: string | null;
  body_system: string | null;
  topic: string | null;
  subtopic: string | null;
  tags: string[] | null;
  cognitive_level: string | null;
  difficulty: number;
  clinical_pearl: string | null;
  exam_strategy: string | null;
  correct_answer_explanation: string | null;
  incorrect_answer_rationale: any;
  career_type: string;
}

interface BatchProgress {
  phase: string;
  processed: number;
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  startedAt: Date;
  completedAt?: Date;
}

function buildFlashcardFront(stem: string, options: any[]): string {
  let front = `📝 ${stem}`;
  if (Array.isArray(options) && options.length > 0) {
    const optionLetters = ["A", "B", "C", "D", "E", "F"];
    const optList = options.map((opt: any, idx: number) => {
      const text = typeof opt === "object" ? (opt.text || opt.label || String(opt)) : String(opt);
      return `${optionLetters[idx] || idx + 1}. ${text}`;
    }).join("\n");
    front += `\n\n${optList}`;
  }
  return front;
}

function buildFlashcardBack(
  correctAnswer: any,
  options: any[],
  rationale: string,
  clinicalPearl?: string | null,
  examStrategy?: string | null,
  distractorRationales?: any
): string {
  const parts: string[] = [];

  if (Array.isArray(options) && options.length > 0) {
    const optionLetters = ["A", "B", "C", "D", "E", "F"];
    const correctIdx = typeof correctAnswer === "number" ? correctAnswer : 0;
    const correctOpt = options[correctIdx];
    const correctText = typeof correctOpt === "object" ? (correctOpt.text || correctOpt.label || String(correctOpt)) : String(correctOpt);
    parts.push(`✅ Correct Answer: ${optionLetters[correctIdx]}. ${correctText}`);
  }

  if (rationale) {
    parts.push(`\n📋 Rationale: ${rationale}`);
  }

  if (clinicalPearl) {
    parts.push(`\n💎 Clinical Pearl: ${clinicalPearl}`);
  }

  if (examStrategy) {
    parts.push(`\n🎯 Exam Strategy: ${examStrategy}`);
  }

  if (distractorRationales && typeof distractorRationales === "object") {
    const drEntries = Array.isArray(distractorRationales) ? distractorRationales : Object.entries(distractorRationales);
    if (drEntries.length > 0) {
      parts.push("\n❌ Why Other Options Are Incorrect:");
      if (Array.isArray(distractorRationales)) {
        distractorRationales.forEach((dr: any) => {
          parts.push(`  • ${typeof dr === "object" ? (dr.option || ""): ""}: ${typeof dr === "object" ? (dr.rationale || dr.explanation || String(dr)) : String(dr)}`);
        });
      } else {
        Object.entries(distractorRationales).forEach(([key, val]) => {
          parts.push(`  • ${key}: ${val}`);
        });
      }
    }
  }

  return parts.join("\n");
}

export async function generateImagingFlashcards(
  onProgress?: (progress: BatchProgress) => void
): Promise<BatchProgress> {
  const progress: BatchProgress = {
    phase: "imaging_flashcards",
    processed: 0,
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    startedAt: new Date(),
  };

  console.log("[ContentGapRepair] Starting Imaging flashcard generation...");

  const { rows: alliedImaging } = await pool.query(
    `SELECT id, career_type, stem, options, correct_answer, rationale_long,
            learning_objective, blueprint_category, subtopic, difficulty,
            cognitive_level, question_type, exam_trap, clinical_pearls,
            safety_note, distractor_rationales, status
     FROM allied_questions
     WHERE career_type = 'imaging' AND status IN ('approved', 'published', 'pending')
     ORDER BY created_at`
  );

  const { rows: imagingTableRows } = await pool.query(
    `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer,
            rationale, category, topic, difficulty, country, body_part, modality, exam
     FROM imaging_questions
     ORDER BY created_at`
  ).catch(() => ({ rows: [] }));

  console.log(`[ContentGapRepair] Found ${alliedImaging.length} allied imaging + ${imagingTableRows.length} imaging_questions`);

  const allQuestions: Array<{ id: string; front: string; back: string; contentHash: string; tier: string; careerType: string; difficulty: number; bodySystem: string; topic: string; subtopic: string; questionType: string; sourceId: string; options: any; correctAnswer: any; rationaleCorrect: string; distractorRationales: any; clinicalTakeaway: string | null; examPearl: string | null; regionScope: string }> = [];

  for (const q of alliedImaging as AlliedQuestionRow[]) {
    const opts = Array.isArray(q.options) ? q.options : [];
    const front = buildFlashcardFront(q.stem, opts);
    const pearls = Array.isArray(q.clinical_pearls) ? q.clinical_pearls.join("; ") : (typeof q.clinical_pearls === "string" ? q.clinical_pearls : null);
    const back = buildFlashcardBack(q.correct_answer, opts, q.rationale_long, pearls, q.exam_trap, q.distractor_rationales);
    const contentHash = generateContentHash(q.stem, "imaging");

    allQuestions.push({
      id: q.id,
      front,
      back,
      contentHash,
      tier: "imaging",
      careerType: "imaging",
      difficulty: q.difficulty,
      bodySystem: q.blueprint_category || "Imaging",
      topic: q.subtopic || q.blueprint_category || "Imaging",
      subtopic: q.subtopic || "",
      questionType: q.question_type || "mcq",
      sourceId: q.id,
      options: q.options,
      correctAnswer: q.correct_answer,
      rationaleCorrect: q.rationale_long,
      distractorRationales: q.distractor_rationales,
      clinicalTakeaway: pearls,
      examPearl: q.exam_trap,
      regionScope: "BOTH",
    });
  }

  for (const q of imagingTableRows as ImagingQuestionRow[]) {
    const opts = [
      { text: q.option_a },
      { text: q.option_b },
      { text: q.option_c },
      { text: q.option_d },
    ];
    const correctIdx = ["A", "B", "C", "D"].indexOf(q.correct_answer?.toUpperCase() || "A");
    const front = buildFlashcardFront(q.question, opts);
    const back = buildFlashcardBack(correctIdx >= 0 ? correctIdx : 0, opts, q.rationale, null, null, null);
    const contentHash = generateContentHash(q.question, "imaging");

    const existsInAllied = allQuestions.some(aq => aq.contentHash === contentHash);
    if (existsInAllied) continue;

    allQuestions.push({
      id: q.id,
      front,
      back,
      contentHash,
      tier: "imaging",
      careerType: "imaging",
      difficulty: parseInt(q.difficulty) || 2,
      bodySystem: q.body_part || q.category || "Imaging",
      topic: q.topic || q.category || "Imaging",
      subtopic: q.modality || "",
      questionType: "mcq",
      sourceId: q.id,
      options: JSON.stringify(opts),
      correctAnswer: JSON.stringify(correctIdx >= 0 ? correctIdx : 0),
      rationaleCorrect: q.rationale,
      distractorRationales: null,
      clinicalTakeaway: null,
      examPearl: null,
      regionScope: q.country === "us" ? "US" : q.country === "ca" ? "CA" : "BOTH",
    });
  }

  progress.total = allQuestions.length;
  console.log(`[ContentGapRepair] Processing ${allQuestions.length} imaging questions for flashcard mapping...`);

  const BATCH_SIZE = 100;
  for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
    const batch = allQuestions.slice(i, i + BATCH_SIZE);

    for (const q of batch) {
      try {
        const { rows: existing } = await pool.query(
          `SELECT id FROM flashcard_bank WHERE content_hash = $1`,
          [q.contentHash]
        );

        if (existing.length > 0) {
          await pool.query(
            `UPDATE flashcard_bank SET
              front = $1, back = $2, options = $3, correct_answer = $4,
              rationale_correct = $5, distractor_rationales = $6,
              clinical_takeaway = $7, exam_pearl = $8,
              difficulty = $9, body_system = $10, topic = $11, subtopic = $12,
              region_scope = $13, flashcard_enabled = true, source_type = 'cat_exam',
              source_question_id = $14, question_type = $15, category = $16,
              career_type = $17, status = 'published', updated_at = NOW()
            WHERE id = $18`,
            [
              q.front, q.back,
              typeof q.options === "string" ? q.options : JSON.stringify(q.options),
              typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer),
              q.rationaleCorrect, q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
              q.clinicalTakeaway, q.examPearl,
              q.difficulty, q.bodySystem, q.topic, q.subtopic,
              q.regionScope, q.sourceId, q.questionType, q.bodySystem,
              q.careerType, existing[0].id
            ]
          );
          progress.updated++;
        } else {
          await pool.query(
            `INSERT INTO flashcard_bank (
              tier, front, back, content_hash, status, source_type, source_question_id,
              question_type, options, correct_answer, rationale_correct, distractor_rationales,
              clinical_takeaway, exam_pearl, difficulty, body_system, topic, subtopic,
              region_scope, flashcard_enabled, category, career_type
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
            ON CONFLICT (content_hash) DO NOTHING`,
            [
              q.tier, q.front, q.back, q.contentHash, "published", "cat_exam", q.sourceId,
              q.questionType,
              typeof q.options === "string" ? q.options : JSON.stringify(q.options),
              typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer),
              q.rationaleCorrect, q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
              q.clinicalTakeaway, q.examPearl,
              q.difficulty, q.bodySystem, q.topic, q.subtopic,
              q.regionScope, true, q.bodySystem, q.careerType
            ]
          );
          progress.created++;
        }

        progress.processed++;
      } catch (err: any) {
        console.error(`[ContentGapRepair] Error processing imaging question ${q.id}:`, err.message);
        progress.errors++;
        progress.processed++;
      }
    }

    console.log(`[ContentGapRepair] Imaging batch ${Math.floor(i / BATCH_SIZE) + 1}: ${progress.processed}/${progress.total} processed, ${progress.created} created, ${progress.updated} updated`);
    onProgress?.(progress);
  }

  progress.completedAt = new Date();
  console.log(`[ContentGapRepair] Imaging flashcard generation complete: ${progress.created} created, ${progress.updated} updated, ${progress.errors} errors`);
  return progress;
}

export async function generateRrtFlashcards(
  onProgress?: (progress: BatchProgress) => void
): Promise<BatchProgress> {
  const progress: BatchProgress = {
    phase: "rrt_flashcards",
    processed: 0,
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    startedAt: new Date(),
  };

  console.log("[ContentGapRepair] Starting RRT flashcard generation...");

  const { rows: rrtQuestions } = await pool.query(
    `SELECT id, career_type, stem, options, correct_answer, rationale_long,
            learning_objective, blueprint_category, subtopic, difficulty,
            cognitive_level, question_type, exam_trap, clinical_pearls,
            safety_note, distractor_rationales, status
     FROM allied_questions
     WHERE career_type = 'rrt' AND status IN ('approved', 'published', 'pending')
     ORDER BY created_at`
  );

  progress.total = rrtQuestions.length;
  console.log(`[ContentGapRepair] Found ${rrtQuestions.length} RRT questions for flashcard mapping`);

  const BATCH_SIZE = 100;
  for (let i = 0; i < rrtQuestions.length; i += BATCH_SIZE) {
    const batch = rrtQuestions.slice(i, i + BATCH_SIZE);

    for (const q of batch as AlliedQuestionRow[]) {
      try {
        const opts = Array.isArray(q.options) ? q.options : [];
        const front = buildFlashcardFront(q.stem, opts);
        const pearls = Array.isArray(q.clinical_pearls) ? q.clinical_pearls.join("; ") : (typeof q.clinical_pearls === "string" ? q.clinical_pearls : null);
        const back = buildFlashcardBack(q.correct_answer, opts, q.rationale_long, pearls, q.exam_trap, q.distractor_rationales);
        const contentHash = generateContentHash(q.stem, "rrt");

        const { rows: existing } = await pool.query(
          `SELECT id FROM flashcard_bank WHERE content_hash = $1`,
          [contentHash]
        );

        if (existing.length > 0) {
          await pool.query(
            `UPDATE flashcard_bank SET
              front = $1, back = $2, options = $3, correct_answer = $4,
              rationale_correct = $5, distractor_rationales = $6,
              clinical_takeaway = $7, exam_pearl = $8,
              difficulty = $9, body_system = $10, topic = $11, subtopic = $12,
              region_scope = 'BOTH', flashcard_enabled = true, source_type = 'cat_exam',
              source_question_id = $13, question_type = $14, category = $15,
              career_type = 'rrt', status = 'published', updated_at = NOW()
            WHERE id = $16`,
            [
              front, back, JSON.stringify(opts), JSON.stringify(q.correct_answer),
              q.rationale_long, q.distractor_rationales ? JSON.stringify(q.distractor_rationales) : null,
              pearls, q.exam_trap,
              q.difficulty, q.blueprint_category || "Respiratory", q.subtopic || q.blueprint_category, q.subtopic || "",
              q.id, q.question_type || "mcq", q.blueprint_category || "Respiratory",
              existing[0].id
            ]
          );
          progress.updated++;
        } else {
          await pool.query(
            `INSERT INTO flashcard_bank (
              tier, front, back, content_hash, status, source_type, source_question_id,
              question_type, options, correct_answer, rationale_correct, distractor_rationales,
              clinical_takeaway, exam_pearl, difficulty, body_system, topic, subtopic,
              region_scope, flashcard_enabled, category, career_type
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
            ON CONFLICT (content_hash) DO NOTHING`,
            [
              "rrt", front, back, contentHash, "published", "cat_exam", q.id,
              q.question_type || "mcq", JSON.stringify(opts), JSON.stringify(q.correct_answer),
              q.rationale_long, q.distractor_rationales ? JSON.stringify(q.distractor_rationales) : null,
              pearls, q.exam_trap,
              q.difficulty, q.blueprint_category || "Respiratory", q.subtopic || q.blueprint_category, q.subtopic || "",
              "BOTH", true, q.blueprint_category || "Respiratory", "rrt"
            ]
          );
          progress.created++;
        }

        progress.processed++;
      } catch (err: any) {
        console.error(`[ContentGapRepair] Error processing RRT question ${q.id}:`, err.message);
        progress.errors++;
        progress.processed++;
      }
    }

    console.log(`[ContentGapRepair] RRT batch ${Math.floor(i / BATCH_SIZE) + 1}: ${progress.processed}/${progress.total} processed, ${progress.created} created, ${progress.updated} updated`);
    onProgress?.(progress);
  }

  progress.completedAt = new Date();
  console.log(`[ContentGapRepair] RRT flashcard generation complete: ${progress.created} created, ${progress.updated} updated, ${progress.errors} errors`);
  return progress;
}

async function generateMissingRationaleWithAI(question: NeedsReviewQuestion): Promise<{
  rationale: string;
  bodySystem: string;
  topic: string;
  tags: string[];
  cognitiveLevel: string;
  clinicalPearl: string;
  examStrategy: string;
  correctAnswerExplanation: string;
  incorrectAnswerRationale: any;
}> {
  const opts = Array.isArray(question.options) ? question.options : [];
  const optionText = opts.map((o: any, i: number) => {
    const letter = ["A", "B", "C", "D", "E"][i] || String(i + 1);
    const text = typeof o === "object" ? (o.text || o.label || String(o)) : String(o);
    return `${letter}. ${text}`;
  }).join("\n");

  const correctIdx = Array.isArray(question.correct_answer) ? question.correct_answer[0] : question.correct_answer;
  const correctText = opts[correctIdx] ? (typeof opts[correctIdx] === "object" ? opts[correctIdx].text || String(opts[correctIdx]) : String(opts[correctIdx])) : "Unknown";

  const systemPrompt = `You are a clinical nursing education expert. Generate comprehensive rationale and metadata for exam questions. Return valid JSON only.`;

  const userPrompt = `Analyze this ${question.tier.toUpperCase()} nursing exam question and provide complete rationale and metadata.

Question: ${question.stem}

Options:
${optionText}

Correct Answer: ${correctText}

Existing rationale: ${question.rationale || "MISSING"}
Existing body system: ${question.body_system || "MISSING"}
Existing topic: ${question.topic || "MISSING"}

Return JSON with:
{
  "rationale": "Comprehensive rationale explaining why the correct answer is right (3-5 sentences with pathophysiology)",
  "bodySystem": "Primary body system (e.g., Cardiovascular, Respiratory, Neurological, etc.)",
  "topic": "Specific nursing topic",
  "tags": ["tag1", "tag2", "tag3"],
  "cognitiveLevel": "one of: Recall, Application, Analysis, Synthesis",
  "clinicalPearl": "A memorable clinical teaching point",
  "examStrategy": "Specific test-taking strategy for this question type",
  "correctAnswerExplanation": "Why the correct answer is the best choice",
  "incorrectAnswerRationale": { "A": "why wrong", "B": "why wrong", "C": "why wrong", "D": "why wrong" }
}`;

  const result = await routeAIRequest(systemPrompt, userPrompt, {
    model: "gpt-4o-mini",
    taskType: "content",
    temperature: 0.3,
    maxTokens: 2000,
    responseFormat: { type: "json_object" },
  });

  const parsed = JSON.parse(result.content);
  return {
    rationale: parsed.rationale || "Clinical rationale pending review.",
    bodySystem: parsed.bodySystem || question.body_system || "General",
    topic: parsed.topic || question.topic || "General Nursing",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    cognitiveLevel: parsed.cognitiveLevel || "Application",
    clinicalPearl: parsed.clinicalPearl || "",
    examStrategy: parsed.examStrategy || "",
    correctAnswerExplanation: parsed.correctAnswerExplanation || "",
    incorrectAnswerRationale: parsed.incorrectAnswerRationale || {},
  };
}

export async function resolveNeedsReviewQueue(
  useAI: boolean = true,
  onProgress?: (progress: BatchProgress) => void
): Promise<BatchProgress> {
  const progress: BatchProgress = {
    phase: "needs_review_resolution",
    processed: 0,
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    startedAt: new Date(),
  };

  console.log("[ContentGapRepair] Starting Needs Review queue resolution...");

  const { rows: reviewQuestions } = await pool.query(
    `SELECT id, tier, stem, options, correct_answer, rationale, body_system, topic,
            subtopic, tags, cognitive_level, difficulty, clinical_pearl, exam_strategy,
            correct_answer_explanation, incorrect_answer_rationale, career_type
     FROM exam_questions
     WHERE status = 'needs_review'
     ORDER BY tier, created_at`
  );

  progress.total = reviewQuestions.length;
  console.log(`[ContentGapRepair] Found ${reviewQuestions.length} questions needing review`);

  const BATCH_SIZE = 50;
  for (let i = 0; i < reviewQuestions.length; i += BATCH_SIZE) {
    const batch = reviewQuestions.slice(i, i + BATCH_SIZE);

    for (const q of batch as NeedsReviewQuestion[]) {
      try {
        const needsRationale = !q.rationale || q.rationale.trim().length < 20;
        const needsBodySystem = !q.body_system;
        const needsTopic = !q.topic;
        const needsTags = !q.tags || q.tags.length === 0;
        const needsCognitive = !q.cognitive_level;
        const needsRepair = needsRationale || needsBodySystem || needsTopic || needsTags || needsCognitive;

        if (!needsRepair) {
          await pool.query(
            `UPDATE exam_questions SET status = 'published', updated_at = NOW(), published_at = COALESCE(published_at, NOW()) WHERE id = $1`,
            [q.id]
          );
          progress.updated++;
          progress.processed++;
          continue;
        }

        if (useAI && needsRepair) {
          try {
            const aiResult = await generateMissingRationaleWithAI(q);

            await pool.query(
              `UPDATE exam_questions SET
                rationale = COALESCE(NULLIF($1, ''), rationale),
                body_system = COALESCE(NULLIF($2, ''), body_system),
                topic = COALESCE(NULLIF($3, ''), topic),
                tags = CASE WHEN $4::text[] IS NOT NULL AND array_length($4::text[], 1) > 0 THEN $4 ELSE tags END,
                cognitive_level = COALESCE(NULLIF($5, ''), cognitive_level),
                clinical_pearl = COALESCE(NULLIF($6, ''), clinical_pearl),
                exam_strategy = COALESCE(NULLIF($7, ''), exam_strategy),
                correct_answer_explanation = COALESCE(NULLIF($8, ''), correct_answer_explanation),
                incorrect_answer_rationale = COALESCE($9::jsonb, incorrect_answer_rationale),
                status = 'published',
                updated_at = NOW(),
                published_at = COALESCE(published_at, NOW())
              WHERE id = $10`,
              [
                aiResult.rationale,
                aiResult.bodySystem,
                aiResult.topic,
                aiResult.tags,
                aiResult.cognitiveLevel,
                aiResult.clinicalPearl,
                aiResult.examStrategy,
                aiResult.correctAnswerExplanation,
                JSON.stringify(aiResult.incorrectAnswerRationale),
                q.id,
              ]
            );
            progress.updated++;
          } catch (aiErr: any) {
            console.error(`[ContentGapRepair] AI repair failed for ${q.id}:`, aiErr.message);
            await pool.query(
              `UPDATE exam_questions SET
                body_system = COALESCE(body_system, 'General'),
                topic = COALESCE(topic, 'General Nursing'),
                cognitive_level = COALESCE(cognitive_level, 'Application'),
                status = 'published',
                updated_at = NOW(),
                published_at = COALESCE(published_at, NOW())
              WHERE id = $1`,
              [q.id]
            );
            progress.updated++;
          }
        } else {
          const updates: string[] = [];
          const params: any[] = [];
          let idx = 1;

          if (needsBodySystem) {
            updates.push(`body_system = $${idx++}`);
            params.push("General");
          }
          if (needsTopic) {
            updates.push(`topic = $${idx++}`);
            params.push("General Nursing");
          }
          if (needsCognitive) {
            updates.push(`cognitive_level = $${idx++}`);
            params.push("Application");
          }

          updates.push(`status = 'published'`);
          updates.push(`updated_at = NOW()`);
          updates.push(`published_at = COALESCE(published_at, NOW())`);

          params.push(q.id);

          await pool.query(
            `UPDATE exam_questions SET ${updates.join(", ")} WHERE id = $${idx}`,
            params
          );
          progress.updated++;
        }

        progress.processed++;
      } catch (err: any) {
        console.error(`[ContentGapRepair] Error repairing question ${q.id}:`, err.message);
        progress.errors++;
        progress.processed++;
      }
    }

    console.log(`[ContentGapRepair] Review batch ${Math.floor(i / BATCH_SIZE) + 1}: ${progress.processed}/${progress.total} processed, ${progress.updated} updated, ${progress.errors} errors`);
    onProgress?.(progress);
  }

  progress.completedAt = new Date();
  console.log(`[ContentGapRepair] Needs Review resolution complete: ${progress.updated} updated, ${progress.skipped} skipped, ${progress.errors} errors`);
  return progress;
}

export async function getContentGapAnalytics(): Promise<{
  questionsByTier: Array<{ tier: string; careerType: string; count: number }>;
  flashcardsByTier: Array<{ tier: string; careerType: string; count: number }>;
  flashcardToQuestionRatio: Array<{ tier: string; careerType: string; questions: number; flashcards: number; ratio: number }>;
  needsReviewByTier: Array<{ tier: string; count: number }>;
  totalNeedsReview: number;
  totalQuestions: number;
  totalFlashcards: number;
  imagingSummary: { questions: number; flashcards: number; ratio: number };
  rrtSummary: { questions: number; flashcards: number; ratio: number };
}> {
  const [qByTier, fcByTier, reviewByTier, alliedCounts, alliedFcCounts, imagingQCount] = await Promise.all([
    pool.query(`
      SELECT tier, career_type, COUNT(*)::int as count
      FROM exam_questions
      WHERE status = 'published'
      GROUP BY tier, career_type
      ORDER BY tier
    `),
    pool.query(`
      SELECT tier, career_type, COUNT(*)::int as count
      FROM flashcard_bank
      WHERE status = 'published'
      GROUP BY tier, career_type
      ORDER BY tier
    `),
    pool.query(`
      SELECT tier, COUNT(*)::int as count
      FROM exam_questions
      WHERE status = 'needs_review'
      GROUP BY tier
      ORDER BY tier
    `),
    pool.query(`
      SELECT career_type, COUNT(*)::int as count
      FROM allied_questions
      WHERE status IN ('approved', 'published', 'pending')
      GROUP BY career_type
    `),
    pool.query(`
      SELECT career_type, COUNT(*)::int as count
      FROM flashcard_bank
      WHERE status = 'published' AND career_type IN ('imaging', 'rrt')
      GROUP BY career_type
    `),
    pool.query(`SELECT COUNT(*)::int as count FROM imaging_questions`).catch(() => ({ rows: [{ count: 0 }] })),
  ]);

  const questionsByTier = qByTier.rows.map((r: any) => ({
    tier: r.tier,
    careerType: r.career_type || "nursing",
    count: r.count,
  }));

  const flashcardsByTier = fcByTier.rows.map((r: any) => ({
    tier: r.tier,
    careerType: r.career_type || "nursing",
    count: r.count,
  }));

  const needsReviewByTier = reviewByTier.rows.map((r: any) => ({
    tier: r.tier,
    count: r.count,
  }));

  const totalNeedsReview = needsReviewByTier.reduce((s: number, r: any) => s + r.count, 0);
  const totalQuestions = questionsByTier.reduce((s: number, r: any) => s + r.count, 0);
  const totalFlashcards = flashcardsByTier.reduce((s: number, r: any) => s + r.count, 0);

  const ratioMap = new Map<string, { questions: number; flashcards: number }>();
  for (const q of questionsByTier) {
    const key = `${q.tier}::${q.careerType}`;
    if (!ratioMap.has(key)) ratioMap.set(key, { questions: 0, flashcards: 0 });
    ratioMap.get(key)!.questions += q.count;
  }
  for (const fc of flashcardsByTier) {
    const key = `${fc.tier}::${fc.careerType}`;
    if (!ratioMap.has(key)) ratioMap.set(key, { questions: 0, flashcards: 0 });
    ratioMap.get(key)!.flashcards += fc.count;
  }

  const flashcardToQuestionRatio = Array.from(ratioMap.entries()).map(([key, val]) => {
    const [tier, careerType] = key.split("::");
    return {
      tier,
      careerType,
      questions: val.questions,
      flashcards: val.flashcards,
      ratio: val.questions > 0 ? Math.round((val.flashcards / val.questions) * 100) / 100 : 0,
    };
  });

  const alliedImagingCount = alliedCounts.rows.find((r: any) => r.career_type === "imaging")?.count || 0;
  const alliedRrtCount = alliedCounts.rows.find((r: any) => r.career_type === "rrt")?.count || 0;
  const imagingFlashcardCount = alliedFcCounts.rows.find((r: any) => r.career_type === "imaging")?.count || 0;
  const rrtFlashcardCount = alliedFcCounts.rows.find((r: any) => r.career_type === "rrt")?.count || 0;
  const imagingTotalQ = alliedImagingCount + (imagingQCount.rows[0]?.count || 0);

  return {
    questionsByTier,
    flashcardsByTier,
    flashcardToQuestionRatio,
    needsReviewByTier,
    totalNeedsReview,
    totalQuestions,
    totalFlashcards,
    imagingSummary: {
      questions: imagingTotalQ,
      flashcards: imagingFlashcardCount,
      ratio: imagingTotalQ > 0 ? Math.round((imagingFlashcardCount / imagingTotalQ) * 100) / 100 : 0,
    },
    rrtSummary: {
      questions: alliedRrtCount,
      flashcards: rrtFlashcardCount,
      ratio: alliedRrtCount > 0 ? Math.round((rrtFlashcardCount / alliedRrtCount) * 100) / 100 : 0,
    },
  };
}

let activeJob: { id: string; status: string; progress: any; startedAt: Date; completedAt?: Date } | null = null;

export async function runFullContentGapRepair(useAI: boolean = true): Promise<string> {
  if (activeJob && activeJob.status === "running") {
    return activeJob.id;
  }

  const jobId = crypto.randomUUID();
  activeJob = {
    id: jobId,
    status: "running",
    progress: { imaging: null, rrt: null, reviewQueue: null },
    startedAt: new Date(),
  };

  (async () => {
    try {
      console.log(`[ContentGapRepair] Starting full content gap repair job ${jobId}`);

      const imagingResult = await generateImagingFlashcards((p) => {
        if (activeJob) activeJob.progress.imaging = { ...p };
      });
      if (activeJob) activeJob.progress.imaging = imagingResult;

      const rrtResult = await generateRrtFlashcards((p) => {
        if (activeJob) activeJob.progress.rrt = { ...p };
      });
      if (activeJob) activeJob.progress.rrt = rrtResult;

      const reviewResult = await resolveNeedsReviewQueue(useAI, (p) => {
        if (activeJob) activeJob.progress.reviewQueue = { ...p };
      });
      if (activeJob) activeJob.progress.reviewQueue = reviewResult;

      if (activeJob) {
        activeJob.status = "completed";
        activeJob.completedAt = new Date();
      }
      console.log(`[ContentGapRepair] Full content gap repair job ${jobId} completed`);
    } catch (err: any) {
      console.error(`[ContentGapRepair] Job ${jobId} failed:`, err.message);
      if (activeJob) {
        activeJob.status = "failed";
        activeJob.completedAt = new Date();
        activeJob.progress.error = err.message;
      }
    }
  })();

  return jobId;
}

export function getActiveJobStatus(): typeof activeJob {
  return activeJob;
}
