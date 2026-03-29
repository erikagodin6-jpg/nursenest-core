import { db, pool } from "./storage";
import { examQuestions, flashcardBank } from "@shared/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import crypto from "crypto";
import {
  HIGH_END_TARGETS,
  TIER_EXAM_MAP,
  CORE_TOPICS,
  DEFAULT_FORMAT_MIX,
  COGNITIVE_LEVELS,
  DEFAULT_COGNITIVE_DISTRIBUTION,
} from "./qbank-pipeline";
import { startPipelineRun, type PipelineConfig } from "./qbank-pipeline";

const BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
  "Renal/Urinary", "Endocrine", "Musculoskeletal", "Integumentary",
  "Hematological", "Immunological", "Reproductive", "Mental Health",
  "Pediatrics", "Maternal/Newborn",
];

const NGN_FORMATS = ["scenario-based", "bowtie", "progressive-unfolding", "SATA", "prioritization"];

const QUESTION_FORMATS = [
  "MCQ", "SATA", "bowtie", "scenario-based", "prioritization",
  "delegation", "dosage-calculation", "lab-interpretation", "progressive-unfolding",
  "ordered-response", "cloze-dropdown", "safety-infection-control",
];

const TIER_MIN_TARGETS: Record<string, number> = {
  rpn: 8000,
  rn: 12000,
};

const TIER_MIN_PER_EXAM: Record<string, number> = {
  rpn: 2000,
  rn: 4000,
};

const BODY_SYSTEM_RANGE: Record<string, { min: number; max: number }> = {
  rpn: { min: 200, max: 400 },
  rn: { min: 300, max: 600 },
};

const NGN_CASE_TARGETS: Record<string, number> = {
  rpn: 300,
  rn: 500,
};

const BATCH_SIZE = 15;
const INTER_BATCH_DELAY_MS = 1500;
const INTER_EXAM_DELAY_MS = 3000;

export interface BulkOrchestrationStatus {
  id: string;
  status: "queued" | "running" | "completed" | "completed_partial" | "completed_with_warnings" | "failed" | "paused";
  tier: string;
  startedAt?: Date;
  completedAt?: Date;
  totalQuestionsGenerated: number;
  totalFlashcardsGenerated: number;
  totalNGNCaseSetsGenerated: number;
  currentPhase: string;
  progress: BulkProgress[];
  errors: string[];
}

interface BulkProgress {
  exam: string;
  bodySystem: string;
  format: string;
  targetCount: number;
  generatedCount: number;
  status: "pending" | "running" | "completed" | "failed";
}

const activeOrchestrations = new Map<string, BulkOrchestrationStatus>();

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hashStem(stem: string): string {
  const normalized = stem
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return crypto.createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}

async function getPublishedCounts(tier: string): Promise<{
  total: number;
  byExam: Record<string, number>;
  byBodySystem: Record<string, number>;
  ngnCount: number;
  ngnCaseSets: number;
}> {
  const totalResult = await pool.query(
    `SELECT COUNT(*)::int as count FROM exam_questions WHERE tier = $1 AND status = 'published'`,
    [tier]
  );

  const byExamResult = await pool.query(
    `SELECT exam, COUNT(*)::int as count FROM exam_questions WHERE tier = $1 AND status = 'published' GROUP BY exam`,
    [tier]
  );

  const byBodySystemResult = await pool.query(
    `SELECT body_system, COUNT(*)::int as count FROM exam_questions WHERE tier = $1 AND status = 'published' AND body_system IS NOT NULL AND body_system != '' GROUP BY body_system`,
    [tier]
  );

  const ngnResult = await pool.query(
    `SELECT COUNT(*)::int as count FROM exam_questions WHERE tier = $1 AND status = 'published' AND question_type IN ('scenario-based', 'bowtie', 'progressive-unfolding', 'SATA', 'prioritization')`,
    [tier]
  );

  const caseSetResult = await pool.query(
    `SELECT COUNT(DISTINCT case_id)::int as count FROM exam_questions WHERE tier = $1 AND status = 'published' AND case_id IS NOT NULL`,
    [tier]
  );

  const byExam: Record<string, number> = {};
  for (const row of byExamResult.rows) {
    byExam[row.exam] = row.count;
  }

  const byBodySystem: Record<string, number> = {};
  for (const row of byBodySystemResult.rows) {
    byBodySystem[row.body_system] = row.count;
  }

  return {
    total: totalResult.rows[0]?.count || 0,
    byExam,
    byBodySystem,
    ngnCount: ngnResult.rows[0]?.count || 0,
    ngnCaseSets: caseSetResult.rows[0]?.count || 0,
  };
}

async function getExamBodySystemCount(tier: string, exam: string, bodySystem: string): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int as count FROM exam_questions WHERE tier = $1 AND exam = $2 AND body_system = $3 AND status = 'published'`,
    [tier, exam, bodySystem]
  );
  return result.rows[0]?.count || 0;
}

async function getFlashcardCount(tier: string): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int as count FROM flashcard_bank WHERE tier = $1 AND status = 'published'`,
    [tier]
  );
  return result.rows[0]?.count || 0;
}

async function generateLinkedFlashcard(question: any, tier: string, exam: string): Promise<boolean> {
  try {
    const front = question.stem
      ? `What is the key concept tested in: ${question.stem.substring(0, 200)}...?`
      : question.topic || "Clinical Concept";

    const clinicalPearl = question.clinicalPearl || question.clinical_pearl || "";
    const rationale = question.rationale || "";
    const examStrategy = question.examStrategy || question.exam_strategy || "";

    const back = [
      rationale ? `Clinical Reasoning: ${rationale.substring(0, 300)}` : "",
      clinicalPearl ? `Clinical Pearl: ${clinicalPearl}` : "",
      examStrategy ? `Exam Strategy: ${examStrategy}` : "",
    ].filter(Boolean).join("\n\n");

    if (!front || front.length < 10 || !back || back.length < 15) return false;

    const questionId = question.id || question.questionId;

    if (questionId) {
      const existingBySource = await pool.query(
        `SELECT id FROM flashcard_bank WHERE source_question_id = $1 LIMIT 1`,
        [questionId]
      );
      if (existingBySource.rows.length > 0) return false;
    }

    const contentHash = crypto.createHash("sha256")
      .update(`${questionId || ''}:${front.toLowerCase().trim()}`)
      .digest("hex");

    const existingByHash = await pool.query(
      `SELECT id FROM flashcard_bank WHERE content_hash = $1 LIMIT 1`,
      [contentHash]
    );
    if (existingByHash.rows.length > 0) return false;

    const examType = question.exam || exam;
    const tagsArr = [tier, examType, question.bodySystem || question.body_system, question.topic].filter(Boolean);

    await pool.query(
      `INSERT INTO flashcard_bank (id, tier, topic_tag, front, back, status, content_hash, source_type, source_question_id, body_system, topic, subtopic, difficulty, category, tags_json, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'published', $5, 'auto_linked', $6, $7, $8, $9, $10, $11, $12, NOW())
       ON CONFLICT (content_hash) DO NOTHING`,
      [
        tier,
        question.topic || question.bodySystem || exam,
        front,
        back,
        contentHash,
        questionId || null,
        question.bodySystem || question.body_system || null,
        question.topic || null,
        question.subtopic || null,
        question.difficulty || 3,
        examType,
        JSON.stringify(tagsArr),
      ]
    );
    return true;
  } catch (err: any) {
    if (err.code === "23505") return false;
    console.error("[BulkOrchestrator] Flashcard generation error:", err.message);
    return false;
  }
}

async function generateNGNCaseSet(
  tier: string,
  exam: string,
  bodySystem: string,
  topic: string,
  caseId: string,
  questionsPerCase: number = 4
): Promise<number> {
  try {
    const { routeAIRequest } = await import("./ai-provider-router");

    const tierContext = tier === "rpn"
      ? "RPN/PN/LVN scope of practice. Focus on safety, monitoring, basic assessments, and delegation."
      : "RN scope of practice. Focus on clinical judgment, prioritization, complex patient management, and care coordination.";

    const systemPrompt = `You are a senior nursing psychometrician creating NGN (Next Generation NCLEX) case-based question sets for ${exam} exam preparation.

SCOPE: ${tierContext}

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no code fences.
2. Create a single cohesive clinical scenario with ${questionsPerCase} related questions.
3. Questions must progress through the clinical encounter (assessment → planning → intervention → evaluation).
4. Each question tests a different cognitive level and uses a different NGN format.
5. All rationales must be detailed (minimum 100 words).
6. No emoji characters.`;

    const userPrompt = `Create an NGN case-based question set about ${topic} (${bodySystem}) for ${exam}.

Clinical scenario: Create a detailed, realistic patient encounter.

Generate exactly ${questionsPerCase} questions that share this scenario. Each question must:
- Use a different NGN format from: SATA, bowtie, prioritization, scenario-based, progressive-unfolding
- Progress through the clinical encounter
- Have unique clinical focus within the case

Return JSON:
{
  "caseScenario": "Detailed patient scenario (min 200 chars)",
  "questions": [
    {
      "stem": "Question stem referencing the case (min 80 chars)",
      "scenario": "Additional context for this specific question",
      "questionFormat": "SATA|bowtie|prioritization|scenario-based|progressive-unfolding",
      "cognitiveLevel": "application|analysis|synthesis",
      "difficulty": 3-5,
      "blueprintDomain": "relevant domain",
      "topic": "${topic}",
      "subtopic": "specific subtopic",
      "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
      "correctAnswer": ["A"] or ["A","C"],
      "rationale": "Detailed rationale (min 100 words)",
      "clinicalPearl": "Key clinical insight",
      "examStrategy": "Test-taking tip",
      "clinicalTrap": "Common mistake",
      "distractorRationales": {"B": "Why wrong", "C": "Why wrong", "D": "Why wrong"},
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: 16384,
      temperature: 0.5,
      responseFormat: { type: "json_object" },
      taskType: "qbank",
      feature: "bulk-orchestrator-ngn",
    });

    let parsed: any;
    try {
      let cleaned = (result.content || "{}").trim()
        .replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      parsed = JSON.parse(cleaned);
    } catch {
      return 0;
    }

    const questions = parsed.questions || [];
    if (!Array.isArray(questions) || questions.length === 0) return 0;

    const caseScenario = parsed.caseScenario || "";
    let insertedCount = 0;

    for (const q of questions) {
      if (!q.stem || q.stem.length < 40) continue;
      if (!Array.isArray(q.options) || q.options.length < 4) continue;
      if (!q.correctAnswer || !Array.isArray(q.correctAnswer)) continue;
      if (!q.rationale || q.rationale.length < 50) continue;

      const optTexts = q.options.map((o: any) => typeof o === "string" ? o : (o.text || String(o)));
      const uniqueOpts = new Set(optTexts.map((t: string) => t.toLowerCase().trim()));
      if (uniqueOpts.size < optTexts.length) continue;

      const labels = new Set(q.options.map((o: any, i: number) => o.label || String.fromCharCode(65 + i)));
      const validAnswers = (q.correctAnswer || []).every((a: string) => labels.has(a));
      if (!validAnswers) continue;

      const stemHash = hashStem(q.stem);
      const existingCheck = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 LIMIT 1`,
        [stemHash]
      );
      if (existingCheck.rows.length > 0) continue;

      const options = (q.options || []).map((o: any, i: number) => ({
        label: o.label || String.fromCharCode(65 + i),
        text: typeof o === "string" ? o : (o.text || String(o)),
      }));

      const insertResult = await pool.query(
        `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, clinical_trap, distractor_rationales, case_id, case_context, cognitive_level, question_format, is_scenario, career_type, published_at, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'published', $4, $5, $6, $7, $8, $9, $10, $11, $12, 'BOTH', $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, true, 'nursing', NOW(), NOW(), NOW())
         RETURNING id, stem, rationale, clinical_pearl, exam_strategy, topic, subtopic, body_system, difficulty`,
        [
          tier,
          exam,
          q.questionFormat || "scenario-based",
          q.stem,
          JSON.stringify(options),
          JSON.stringify(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]),
          q.rationale || "",
          Math.min(5, Math.max(1, q.difficulty || 3)),
          Array.isArray(q.tags) ? q.tags : [],
          bodySystem,
          q.topic || topic,
          q.subtopic || "",
          stemHash,
          caseScenario ? `${caseScenario}\n\n${q.scenario || ""}` : (q.scenario || ""),
          q.clinicalPearl || "",
          q.examStrategy || "",
          q.clinicalTrap || "",
          q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
          caseId,
          caseScenario,
          q.cognitiveLevel || "analysis",
          q.questionFormat || "scenario-based",
        ]
      );

      if (insertResult.rows.length > 0) {
        insertedCount++;
        const inserted = insertResult.rows[0];
        await generateLinkedFlashcard({
          ...inserted,
          bodySystem,
          clinicalPearl: q.clinicalPearl,
          examStrategy: q.examStrategy,
        }, tier, exam);
      }
    }

    return insertedCount;
  } catch (err: any) {
    console.error(`[BulkOrchestrator] NGN case set error:`, err.message);
    return 0;
  }
}

export async function startBulkOrchestration(tier: string): Promise<BulkOrchestrationStatus> {
  if (tier !== "rpn" && tier !== "rn") {
    throw new Error(`Bulk orchestration only supports 'rpn' and 'rn' tiers, got '${tier}'`);
  }

  const id = `bulk-${tier}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const status: BulkOrchestrationStatus = {
    id,
    status: "queued",
    tier,
    totalQuestionsGenerated: 0,
    totalFlashcardsGenerated: 0,
    totalNGNCaseSetsGenerated: 0,
    currentPhase: "initializing",
    progress: [],
    errors: [],
  };

  activeOrchestrations.set(id, status);

  executeBulkOrchestration(id).catch(err => {
    const s = activeOrchestrations.get(id);
    if (s) {
      s.status = "failed";
      s.errors.push(err.message);
    }
    console.error(`[BulkOrchestrator] Orchestration ${id} failed:`, err.message);
  });

  return status;
}

function isPaused(id: string): boolean {
  const s = activeOrchestrations.get(id);
  return s?.status === "paused";
}

async function executeBulkOrchestration(id: string): Promise<void> {
  const status = activeOrchestrations.get(id);
  if (!status) return;

  status.status = "running";
  status.startedAt = new Date();
  const tier = status.tier;
  const exams = TIER_EXAM_MAP[tier] || [];
  const minTarget = TIER_MIN_TARGETS[tier] || 8000;
  const minPerExam = TIER_MIN_PER_EXAM[tier] || 2000;
  const bodySystemRange = BODY_SYSTEM_RANGE[tier] || { min: 200, max: 400 };
  const ngnCaseTarget = NGN_CASE_TARGETS[tier] || 300;

  console.log(`[BulkOrchestrator] Starting ${tier} orchestration: target=${minTarget}, exams=${exams.join(",")}`);

  status.currentPhase = "phase1_body_system_coverage";
  const counts = await getPublishedCounts(tier);
  console.log(`[BulkOrchestrator] Current ${tier} counts: total=${counts.total}, NGN=${counts.ngnCount}, caseSets=${counts.ngnCaseSets}`);

  for (const exam of exams) {
    const examCountResult = await pool.query(
      `SELECT COUNT(*)::int as count FROM exam_questions WHERE tier = $1 AND exam = $2 AND status = 'published'`,
      [tier, exam]
    );
    const examCount = examCountResult.rows[0]?.count || 0;

    if (examCount >= minPerExam) {
      console.log(`[BulkOrchestrator] ${exam} already has ${examCount}/${minPerExam} questions, skipping standard generation`);
      continue;
    }

    const needed = minPerExam - examCount;
    const perBodySystem = Math.ceil(needed / BODY_SYSTEMS.length);

    for (const bodySystem of BODY_SYSTEMS) {
      const currentBS = await getExamBodySystemCount(tier, exam, bodySystem);
      const bsTarget = Math.max(bodySystemRange.min, Math.min(bodySystemRange.max, perBodySystem));

      if (currentBS >= bsTarget) {
        console.log(`[BulkOrchestrator] ${exam}/${bodySystem} already at ${currentBS}/${bsTarget}, skipping`);
        continue;
      }

      const bsNeeded = bsTarget - currentBS;

      if (isPaused(id)) {
        console.log(`[BulkOrchestrator] Paused during phase 1`);
        return;
      }

      for (const format of QUESTION_FORMATS) {
        if (isPaused(id)) return;
        const formatPct = DEFAULT_FORMAT_MIX[format] || 5;
        const formatCount = Math.max(1, Math.round(bsNeeded * (formatPct / 100)));

        if (formatCount <= 0) continue;

        const progressEntry: BulkProgress = {
          exam,
          bodySystem,
          format,
          targetCount: formatCount,
          generatedCount: 0,
          status: "pending",
        };
        status.progress.push(progressEntry);

        try {
          progressEntry.status = "running";
          console.log(`[BulkOrchestrator] Generating ${formatCount} ${format} questions for ${exam}/${bodySystem}`);

          const run = await startPipelineRun({
            tier,
            examType: exam,
            topic: bodySystem,
            targetCount: Math.min(formatCount, 500),
            questionFormatMix: { [format]: 100 },
            countryCode: "CA",
          });

          let checkCount = 0;
          const maxChecks = 120;
          while (checkCount < maxChecks) {
            await delay(5000);
            checkCount++;

            const runCheck = await pool.query(
              `SELECT status, generated_count FROM generation_jobs WHERE id = $1`,
              [run.id]
            );

            if (runCheck.rows.length > 0) {
              const row = runCheck.rows[0];
              progressEntry.generatedCount = row.generated_count || 0;

              if (row.status === "completed" || row.status === "done" || row.status === "failed") {
                break;
              }
            }
          }

          progressEntry.status = "completed";
          status.totalQuestionsGenerated += progressEntry.generatedCount;

          const newQuestions = await pool.query(
            `SELECT id, stem, rationale, clinical_pearl, exam_strategy, topic, subtopic, body_system, difficulty
             FROM exam_questions WHERE tier = $1 AND exam = $2 AND body_system = $3 AND status = 'published'
             ORDER BY created_at DESC LIMIT $4`,
            [tier, exam, bodySystem, progressEntry.generatedCount]
          );

          for (const q of newQuestions.rows) {
            const created = await generateLinkedFlashcard(q, tier, exam);
            if (created) status.totalFlashcardsGenerated++;
          }

          await delay(INTER_BATCH_DELAY_MS);
        } catch (err: any) {
          progressEntry.status = "failed";
          status.errors.push(`${exam}/${bodySystem}/${format}: ${err.message}`);
          console.error(`[BulkOrchestrator] Error generating ${format} for ${exam}/${bodySystem}:`, err.message);
        }
      }

      await delay(INTER_EXAM_DELAY_MS);
    }
  }

  status.currentPhase = "phase1b_tier_wide_fill";
  const postPhase1Counts = await getPublishedCounts(tier);
  if (postPhase1Counts.total < minTarget) {
    const tierGap = minTarget - postPhase1Counts.total;
    console.log(`[BulkOrchestrator] Phase 1b: Tier-wide fill needed - ${postPhase1Counts.total}/${minTarget}, gap=${tierGap}`);

    const fillPerExam = Math.ceil(tierGap / exams.length);
    for (const exam of exams) {
      const fillPerBS = Math.ceil(fillPerExam / BODY_SYSTEMS.length);
      for (const bodySystem of BODY_SYSTEMS) {
        if (isPaused(id)) return;
        const liveFillCheck = await getPublishedCounts(tier);
        if (liveFillCheck.total >= minTarget) break;

        try {
          console.log(`[BulkOrchestrator] Phase 1b: Filling ${fillPerBS} for ${exam}/${bodySystem}`);
          const run = await startPipelineRun({
            tier,
            examType: exam,
            topic: bodySystem,
            targetCount: Math.min(fillPerBS, 500),
            countryCode: "CA",
          });

          let checkCount = 0;
          while (checkCount < 120) {
            await delay(5000);
            checkCount++;
            const runCheck = await pool.query(
              `SELECT status, generated_count FROM generation_jobs WHERE id = $1`,
              [run.id]
            );
            if (runCheck.rows.length > 0) {
              const row = runCheck.rows[0];
              if (row.status === "completed" || row.status === "done" || row.status === "failed") {
                status.totalQuestionsGenerated += row.generated_count || 0;
                break;
              }
            }
          }

          await delay(INTER_BATCH_DELAY_MS);
        } catch (err: any) {
          status.errors.push(`Phase1b ${exam}/${bodySystem}: ${err.message}`);
        }
      }
    }
  }

  if (isPaused(id)) {
    console.log(`[BulkOrchestrator] Paused before phase 2`);
    return;
  }

  status.currentPhase = "phase2_ngn_case_sets";
  console.log(`[BulkOrchestrator] Phase 2: Generating NGN case-based sets (target: ${ngnCaseTarget})`);

  const updatedCounts = await getPublishedCounts(tier);
  let currentCaseSets = updatedCounts.ngnCaseSets;
  const casesNeeded = Math.max(0, ngnCaseTarget - currentCaseSets);

  if (casesNeeded > 0) {
    const casesPerExam = Math.ceil(casesNeeded / exams.length);
    const casesPerBodySystem = Math.ceil(casesPerExam / BODY_SYSTEMS.length);
    const topics = CORE_TOPICS[tier] || CORE_TOPICS.rpn;

    for (const exam of exams) {
      for (let bsIdx = 0; bsIdx < BODY_SYSTEMS.length && currentCaseSets < ngnCaseTarget; bsIdx++) {
        const bodySystem = BODY_SYSTEMS[bsIdx];
        const topic = topics[bsIdx % topics.length];

        for (let c = 0; c < casesPerBodySystem && currentCaseSets < ngnCaseTarget; c++) {
          const caseId = `case-${tier}-${exam}-${bodySystem}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
          const questionsPerCase = 3 + Math.floor(Math.random() * 4);

          console.log(`[BulkOrchestrator] Generating NGN case set ${currentCaseSets + 1}/${ngnCaseTarget}: ${exam}/${bodySystem}/${topic}`);

          const insertedCount = await generateNGNCaseSet(tier, exam, bodySystem, topic, caseId, questionsPerCase);

          if (insertedCount > 0) {
            currentCaseSets++;
            status.totalNGNCaseSetsGenerated++;
            status.totalQuestionsGenerated += insertedCount;
            status.totalFlashcardsGenerated += insertedCount;
          }

          await delay(INTER_BATCH_DELAY_MS);
        }
      }
    }
  }

  status.currentPhase = "phase3_flashcard_backfill";
  console.log(`[BulkOrchestrator] Phase 3: Backfilling flashcards for questions without linked flashcards`);

  const BACKFILL_BATCH = 2000;
  let totalBackfilled = 0;
  let lastId = '';
  let hasMore = true;

  while (hasMore) {
    const unlinkedQuestions = await pool.query(
      `SELECT eq.id, eq.stem, eq.rationale, eq.clinical_pearl, eq.exam_strategy, eq.topic, eq.subtopic, eq.body_system, eq.difficulty, eq.exam
       FROM exam_questions eq
       LEFT JOIN flashcard_bank fb ON fb.source_question_id = eq.id
       WHERE eq.tier = $1 AND eq.status = 'published' AND fb.id IS NULL AND eq.id > $2
       ORDER BY eq.id
       LIMIT $3`,
      [tier, lastId, BACKFILL_BATCH]
    );

    if (unlinkedQuestions.rows.length === 0) {
      hasMore = false;
      break;
    }

    console.log(`[BulkOrchestrator] Backfilling batch: ${unlinkedQuestions.rows.length} questions without linked flashcards (after ID ${lastId || 'start'})`);

    for (const q of unlinkedQuestions.rows) {
      const created = await generateLinkedFlashcard(q, tier, q.exam);
      if (created) {
        status.totalFlashcardsGenerated++;
        totalBackfilled++;
      }
    }

    lastId = unlinkedQuestions.rows[unlinkedQuestions.rows.length - 1].id;

    if (unlinkedQuestions.rows.length < BACKFILL_BATCH) {
      hasMore = false;
    }
  }

  console.log(`[BulkOrchestrator] Flashcard backfill complete: ${totalBackfilled} flashcards created`);

  status.currentPhase = "phase4_validation";
  console.log(`[BulkOrchestrator] Phase 4: Final validation`);

  const finalCounts = await getPublishedCounts(tier);
  const flashcardCount = await getFlashcardCount(tier);

  const orphanedFlashcards = await pool.query(
    `SELECT COUNT(*)::int as count FROM flashcard_bank fb
     WHERE fb.tier = $1 AND fb.source_question_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM exam_questions eq WHERE eq.id = fb.source_question_id)`,
    [tier]
  );

  const duplicateStems = await pool.query(
    `SELECT stem_hash, COUNT(*)::int as count FROM exam_questions
     WHERE tier = $1 AND status = 'published' AND stem_hash IS NOT NULL
     GROUP BY stem_hash HAVING COUNT(*) > 1`,
    [tier]
  );

  console.log(`[BulkOrchestrator] === FINAL VALIDATION REPORT for ${tier.toUpperCase()} ===`);
  console.log(`Total published questions: ${finalCounts.total} (target: ${minTarget})`);
  console.log(`Questions by exam: ${JSON.stringify(finalCounts.byExam)}`);
  console.log(`Questions by body system: ${JSON.stringify(finalCounts.byBodySystem)}`);
  console.log(`NGN-style questions: ${finalCounts.ngnCount} (${Math.round(finalCounts.ngnCount / Math.max(1, finalCounts.total) * 100)}%)`);
  console.log(`NGN case sets: ${finalCounts.ngnCaseSets} (target: ${ngnCaseTarget})`);
  console.log(`Published flashcards: ${flashcardCount}`);
  console.log(`Orphaned flashcards: ${orphanedFlashcards.rows[0]?.count || 0}`);
  console.log(`Duplicate stem hashes: ${duplicateStems.rows.length}`);

  if (finalCounts.total < minTarget) {
    status.errors.push(`Total published count ${finalCounts.total} below target ${minTarget}`);
  }
  for (const exam of exams) {
    const examCount = finalCounts.byExam[exam] || 0;
    if (examCount < minPerExam) {
      status.errors.push(`${exam} has ${examCount} questions, below minimum ${minPerExam}`);
    }
  }
  if (duplicateStems.rows.length > 0) {
    status.errors.push(`Found ${duplicateStems.rows.length} duplicate stem hashes`);
  }
  if ((orphanedFlashcards.rows[0]?.count || 0) > 0) {
    status.errors.push(`Found ${orphanedFlashcards.rows[0]?.count} orphaned flashcards`);
  }

  const hasBlockingErrors = status.errors.some(e =>
    e.includes("below target") || e.includes("below minimum")
  );
  if (hasBlockingErrors) {
    status.status = "completed_partial";
    console.log(`[BulkOrchestrator] ${tier.toUpperCase()} orchestration completed with unmet targets.`);
  } else if (status.errors.length > 0) {
    status.status = "completed_with_warnings";
    console.log(`[BulkOrchestrator] ${tier.toUpperCase()} orchestration completed with warnings.`);
  } else {
    status.status = "completed";
    console.log(`[BulkOrchestrator] ${tier.toUpperCase()} orchestration completed successfully.`);
  }
  status.completedAt = new Date();
  status.currentPhase = "done";

  console.log(`[BulkOrchestrator] Questions: ${status.totalQuestionsGenerated}, Flashcards: ${status.totalFlashcardsGenerated}, NGN Cases: ${status.totalNGNCaseSetsGenerated}`);
}

export function getOrchestrationStatus(id: string): BulkOrchestrationStatus | undefined {
  return activeOrchestrations.get(id);
}

export function listOrchestrations(): BulkOrchestrationStatus[] {
  return Array.from(activeOrchestrations.values()).sort((a, b) =>
    (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0)
  );
}

export function pauseOrchestration(id: string): boolean {
  const status = activeOrchestrations.get(id);
  if (!status || status.status !== "running") return false;
  status.status = "paused";
  return true;
}

export async function runValidationReport(tier: string): Promise<{
  tier: string;
  totalPublished: number;
  byExam: Record<string, number>;
  byBodySystem: Record<string, number>;
  ngnCount: number;
  ngnPercentage: number;
  ngnCaseSets: number;
  flashcardCount: number;
  orphanedFlashcards: number;
  duplicateStems: number;
  questionsWithoutFlashcards: number;
  meetsMinimumTarget: boolean;
  meetsExamMinimums: boolean;
  meetsBodySystemRanges: boolean;
  meetsNGNTarget: boolean;
  issues: string[];
}> {
  const counts = await getPublishedCounts(tier);
  const flashcardCount = await getFlashcardCount(tier);

  const orphanedResult = await pool.query(
    `SELECT COUNT(*)::int as count FROM flashcard_bank fb
     WHERE fb.tier = $1 AND fb.source_question_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM exam_questions eq WHERE eq.id = fb.source_question_id)`,
    [tier]
  );

  const duplicateResult = await pool.query(
    `SELECT COUNT(*)::int as count FROM (
       SELECT stem_hash FROM exam_questions
       WHERE tier = $1 AND status = 'published' AND stem_hash IS NOT NULL
       GROUP BY stem_hash HAVING COUNT(*) > 1
     ) dupes`,
    [tier]
  );

  const unlinkedResult = await pool.query(
    `SELECT COUNT(*)::int as count FROM exam_questions eq
     LEFT JOIN flashcard_bank fb ON fb.source_question_id = eq.id
     WHERE eq.tier = $1 AND eq.status = 'published' AND fb.id IS NULL`,
    [tier]
  );

  const minTarget = TIER_MIN_TARGETS[tier] || 8000;
  const minPerExam = TIER_MIN_PER_EXAM[tier] || 2000;
  const bsRange = BODY_SYSTEM_RANGE[tier] || { min: 200, max: 400 };
  const ngnCaseTarget = NGN_CASE_TARGETS[tier] || 300;
  const exams = TIER_EXAM_MAP[tier] || [];

  const issues: string[] = [];
  const meetsMinimumTarget = counts.total >= minTarget;
  if (!meetsMinimumTarget) issues.push(`Total ${counts.total} below target ${minTarget}`);

  let meetsExamMinimums = true;
  for (const exam of exams) {
    const c = counts.byExam[exam] || 0;
    if (c < minPerExam) {
      meetsExamMinimums = false;
      issues.push(`${exam}: ${c} below minimum ${minPerExam}`);
    }
  }

  let meetsBodySystemRanges = true;
  for (const bs of BODY_SYSTEMS) {
    const c = counts.byBodySystem[bs] || 0;
    if (c < bsRange.min) {
      meetsBodySystemRanges = false;
      issues.push(`${bs}: ${c} below minimum ${bsRange.min}`);
    }
  }

  const ngnPercentage = counts.total > 0 ? Math.round(counts.ngnCount / counts.total * 100) : 0;
  const meetsNGNTarget = ngnPercentage >= 30 && counts.ngnCaseSets >= ngnCaseTarget;
  if (ngnPercentage < 30) issues.push(`NGN percentage ${ngnPercentage}% below 30% target`);
  if (counts.ngnCaseSets < ngnCaseTarget) issues.push(`NGN case sets ${counts.ngnCaseSets} below target ${ngnCaseTarget}`);

  const orphanedFlashcards = orphanedResult.rows[0]?.count || 0;
  if (orphanedFlashcards > 0) issues.push(`${orphanedFlashcards} orphaned flashcards`);

  const duplicateStems = duplicateResult.rows[0]?.count || 0;
  if (duplicateStems > 0) issues.push(`${duplicateStems} duplicate stem hashes`);

  const questionsWithoutFlashcards = unlinkedResult.rows[0]?.count || 0;
  if (questionsWithoutFlashcards > 0) issues.push(`${questionsWithoutFlashcards} questions without linked flashcards`);

  return {
    tier,
    totalPublished: counts.total,
    byExam: counts.byExam,
    byBodySystem: counts.byBodySystem,
    ngnCount: counts.ngnCount,
    ngnPercentage,
    ngnCaseSets: counts.ngnCaseSets,
    flashcardCount,
    orphanedFlashcards,
    duplicateStems,
    questionsWithoutFlashcards,
    meetsMinimumTarget,
    meetsExamMinimums,
    meetsBodySystemRanges,
    meetsNGNTarget,
    issues,
  };
}
