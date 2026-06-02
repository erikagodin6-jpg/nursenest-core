import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { routeAIRequest, getKillSwitch } from "./ai-provider-router";
import { getLanguageInstructionBlock } from "./medical-terminology-dictionary";
import { validateGeneratedLanguage } from "./language-detector";
import { logTranslationEvent } from "./translation-event-logger";

const PLACEHOLDER_PATTERNS = [
  /^tbd$/i,
  /^coming soon$/i,
  /^placeholder$/i,
  /^n\/a$/i,
  /^none$/i,
  /^-+$/,
  /^\.+$/,
  /^todo$/i,
  /^to be added$/i,
  /^to be determined$/i,
  /^not available$/i,
  /^rationale here$/i,
  /^add rationale$/i,
  /^see rationale$/i,
  /^explanation$/i,
  /^\[.*\]$/,
  /^(x+|test|asdf|qwerty)$/i,
];

const IMAGE_DEPENDENT_FORMATS = [
  "HOTSPOT",
  "IMAGE_HOTSPOT",
  "INSTRUMENT_ID",
];

const IMAGE_DEPENDENT_TOPICS = [
  /anatomy.*identification/i,
  /wound.*identification/i,
  /stoma.*identification/i,
  /skin.*identification/i,
  /ecg.*strip.*interpretation/i,
  /ekg.*strip.*interpretation/i,
  /radiology.*interpretation/i,
  /image.*interpretation/i,
  /visual.*medication.*identification/i,
  /visual.*device.*identification/i,
  /x-ray/i,
  /radiograph/i,
];

const TEXT_ONLY_FORMATS = [
  "MCQ",
  "SATA",
  "ORDERED",
  "FILL_IN_BLANK",
  "BOW_TIE",
  "CASE_STUDY_SERIES",
  "MATRIX_SELECT",
  "TREND_ANALYSIS",
  "MULTIPLE_CHOICE",
];

export function isValidRationale(rationale: string | null | undefined): boolean {
  if (!rationale || typeof rationale !== "string") return false;
  const trimmed = rationale.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length < 20) return false;
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }
  return true;
}

export function classifyRationaleIssue(rationale: string | null | undefined): "missing" | "placeholder" | "short" | "valid" {
  if (!rationale || typeof rationale !== "string" || rationale.trim().length === 0) return "missing";
  const trimmed = rationale.trim();
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(trimmed)) return "placeholder";
  }
  if (trimmed.length < 20) return "short";
  return "valid";
}

export function classifyImageSeverity(
  questionType: string,
  topic: string | null,
  bodySystem: string | null,
): "high" | "low" | "info" {
  const upperType = (questionType || "").toUpperCase();
  if (IMAGE_DEPENDENT_FORMATS.includes(upperType)) return "high";

  const combinedContext = `${topic || ""} ${bodySystem || ""}`;
  for (const pattern of IMAGE_DEPENDENT_TOPICS) {
    if (pattern.test(combinedContext)) return "high";
  }

  if (TEXT_ONLY_FORMATS.includes(upperType)) return "info";

  return "low";
}

async function findQuestionsWithInvalidRationales(): Promise<{
  total: number;
  byTier: Record<string, number>;
  byIssue: Record<string, number>;
  questions: Array<{
    id: string;
    tier: string;
    stem: string;
    questionType: string;
    rationale: string | null;
    rationaleIssue: string;
    topic: string | null;
    bodySystem: string | null;
  }>;
}> {
  const result = await pool.query(
    `SELECT id, tier, stem, question_type, rationale, topic, body_system
     FROM exam_questions
     WHERE status = 'published'
     AND (
       rationale IS NULL
       OR rationale = ''
       OR LENGTH(TRIM(rationale)) < 20
       OR LOWER(TRIM(rationale)) IN ('tbd', 'coming soon', 'placeholder', 'n/a', 'none', 'todo', 'not available', 'rationale here', 'add rationale', 'see rationale', 'explanation', 'to be added', 'to be determined')
       OR TRIM(rationale) ~ '^-+$'
       OR TRIM(rationale) ~ '^\\.+$'
       OR TRIM(rationale) ~ '^\\[.*\\]$'
     )
     ORDER BY tier, created_at`
  );

  const byTier: Record<string, number> = {};
  const byIssue: Record<string, number> = {};
  const questions = result.rows.map((row: any) => {
    const issue = classifyRationaleIssue(row.rationale);
    byTier[row.tier] = (byTier[row.tier] || 0) + 1;
    byIssue[issue] = (byIssue[issue] || 0) + 1;
    return {
      id: row.id,
      tier: row.tier,
      stem: row.stem?.substring(0, 200) || "",
      questionType: row.question_type,
      rationale: row.rationale,
      rationaleIssue: issue,
      topic: row.topic,
      bodySystem: row.body_system,
    };
  });

  return { total: questions.length, byTier, byIssue, questions };
}

function validateGeneratedRationale(
  rationale: string,
  correctAnswer: any,
): { valid: boolean; reason?: string } {
  if (!rationale || typeof rationale !== "string") return { valid: false, reason: "empty" };
  const trimmed = rationale.trim();
  if (trimmed.length < 50) return { valid: false, reason: `too short (${trimmed.length} chars)` };
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(trimmed)) return { valid: false, reason: "placeholder detected" };
  }
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (wordCount < 15) return { valid: false, reason: `too few words (${wordCount})` };
  return { valid: true };
}

async function generateRationalesForBatch(
  questions: Array<{ id: string; stem: string; options: any; correctAnswer: any; questionType: string; tier: string; topic: string | null }>,
  language: string = "en",
): Promise<{
  scanned: number;
  fixed: number;
  skipped: number;
  failed: number;
  results: Array<{ id: string; status: "fixed" | "skipped" | "failed"; reason?: string }>;
}> {
  const report = { scanned: questions.length, fixed: 0, skipped: 0, failed: 0, results: [] as any[] };

  if (getKillSwitch()) {
    for (const q of questions) {
      report.skipped++;
      report.results.push({ id: q.id, status: "skipped", reason: "AI kill switch active" });
    }
    return report;
  }

  for (const q of questions) {
    try {
      const optionsText = Array.isArray(q.options)
        ? q.options.map((o: any, i: number) => {
            const label = o.label || String.fromCharCode(65 + i);
            const text = o.text || o.content || String(o);
            return `${label}) ${text}`;
          }).join("\n")
        : JSON.stringify(q.options);

      const correctLabel = typeof q.correctAnswer === "string"
        ? q.correctAnswer
        : Array.isArray(q.correctAnswer)
        ? q.correctAnswer.join(", ")
        : JSON.stringify(q.correctAnswer);

      const languageBlock = language && language !== "en" ? getLanguageInstructionBlock(language) : "";
      const systemPrompt = `You are a senior nursing educator writing exam rationales. Write a clear, educational rationale for the given exam question. The rationale must:
1. Explain WHY the correct answer is correct with clinical reasoning
2. Briefly explain why each incorrect option is wrong
3. Include relevant clinical pearls or exam tips
4. Be 100-300 words
5. Reference evidence-based nursing practice
Return ONLY the rationale text, no JSON, no markdown fences.
${languageBlock}`;

      const userPrompt = `Question (${q.tier.toUpperCase()} level, ${q.questionType}):
${q.stem}

Options:
${optionsText}

Correct Answer: ${correctLabel}
${q.topic ? `Topic: ${q.topic}` : ""}

Write the educational rationale:`;

      const aiResult = await routeAIRequest(systemPrompt, userPrompt, {
        model: "gpt-4o-mini",
        maxTokens: 1000,
        temperature: 0.5,
        taskType: "content",
        feature: "rationale-remediation",
      });

      const generatedRationale = aiResult.content.trim();
      const validation = validateGeneratedRationale(generatedRationale, q.correctAnswer);

      if (!validation.valid) {
        report.failed++;
        report.results.push({ id: q.id, status: "failed", reason: validation.reason });
        await logTranslationEvent({
          eventType: "ai_generation_failure",
          contentType: "rationale",
          language,
          generatorName: "rationale-remediation",
          severity: "warning",
          details: { questionId: q.id, reason: validation.reason },
        });
        continue;
      }

      if (language && language !== "en") {
        const langCheck = validateGeneratedLanguage(generatedRationale.substring(0, 500), language);
        if (!langCheck.valid) {
          await logTranslationEvent({
            eventType: "language_mismatch",
            contentType: "rationale",
            language,
            generatorName: "rationale-remediation",
            severity: "warning",
            details: { questionId: q.id, expected: language, detected: langCheck.result.detectedLanguage },
          });
        } else {
          await logTranslationEvent({
            eventType: "language_validated",
            contentType: "rationale",
            language,
            generatorName: "rationale-remediation",
            severity: "info",
            details: { questionId: q.id },
          });
        }
      }

      await pool.query(
        `UPDATE exam_questions SET rationale = $1, updated_at = NOW() WHERE id = $2`,
        [generatedRationale, q.id]
      );

      report.fixed++;
      report.results.push({ id: q.id, status: "fixed" });
    } catch (err: any) {
      report.failed++;
      report.results.push({ id: q.id, status: "failed", reason: err.message });
    }
  }

  return report;
}

async function analyzeImageAuditSeverity(): Promise<{
  requiredImages: { count: number; formats: Record<string, number>; questions: Array<{ id: string; questionType: string; topic: string | null; tier: string }> };
  recommendedImages: { count: number; formats: Record<string, number> };
  optionalImages: { count: number; formats: Record<string, number> };
}> {
  const result = await pool.query(
    `SELECT id, question_type, topic, body_system, tier, images
     FROM exam_questions
     WHERE status = 'published'
     AND (images IS NULL OR images::text = 'null' OR images::text = '[]' OR images::text = '{}')`
  );

  const requiredQuestions: Array<{ id: string; questionType: string; topic: string | null; tier: string }> = [];
  const requiredFormats: Record<string, number> = {};
  const recommendedFormats: Record<string, number> = {};
  const optionalFormats: Record<string, number> = {};
  let recommendedCount = 0;
  let optionalCount = 0;

  for (const row of result.rows) {
    const severity = classifyImageSeverity(row.question_type, row.topic, row.body_system);
    const qType = (row.question_type || "unknown").toUpperCase();

    if (severity === "high") {
      requiredQuestions.push({
        id: row.id,
        questionType: qType,
        topic: row.topic,
        tier: row.tier,
      });
      requiredFormats[qType] = (requiredFormats[qType] || 0) + 1;
    } else if (severity === "low") {
      recommendedCount++;
      recommendedFormats[qType] = (recommendedFormats[qType] || 0) + 1;
    } else {
      optionalCount++;
      optionalFormats[qType] = (optionalFormats[qType] || 0) + 1;
    }
  }

  return {
    requiredImages: { count: requiredQuestions.length, formats: requiredFormats, questions: requiredQuestions.slice(0, 100) },
    recommendedImages: { count: recommendedCount, formats: recommendedFormats },
    optionalImages: { count: optionalCount, formats: optionalFormats },
  };
}

async function analyzeFlashcardCoverageGaps(): Promise<{
  totalGaps: number;
  affectedTiers: Record<string, number>;
  affectedTopics: Array<{ tier: string; topic: string; questionCount: number; flashcardCount: number; gap: number }>;
}> {
  const result = await pool.query(
    `SELECT eq.tier, eq.topic, COUNT(DISTINCT eq.id)::int as question_count,
            COALESCE(fc.card_count, 0)::int as flashcard_count
     FROM exam_questions eq
     LEFT JOIN (
       SELECT tier, LOWER(TRIM(topic_tag)) as norm_topic, COUNT(*)::int as card_count
       FROM flashcard_bank
       WHERE status = 'published'
       GROUP BY tier, LOWER(TRIM(topic_tag))
     ) fc ON fc.tier = eq.tier AND fc.norm_topic = LOWER(TRIM(eq.topic))
     WHERE eq.status = 'published'
     AND eq.topic IS NOT NULL
     AND TRIM(eq.topic) != ''
     GROUP BY eq.tier, eq.topic, fc.card_count
     HAVING COALESCE(fc.card_count, 0) = 0
     ORDER BY COUNT(DISTINCT eq.id) DESC`
  );

  const affectedTiers: Record<string, number> = {};
  const affectedTopics = result.rows.map((row: any) => {
    affectedTiers[row.tier] = (affectedTiers[row.tier] || 0) + 1;
    return {
      tier: row.tier,
      topic: row.topic,
      questionCount: row.question_count,
      flashcardCount: row.flashcard_count,
      gap: row.question_count,
    };
  });

  return {
    totalGaps: affectedTopics.length,
    affectedTiers,
    affectedTopics,
  };
}

export function registerRationaleRemediationRoutes(app: Express): void {
  app.get("/api/admin/rationale-audit", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const audit = await findQuestionsWithInvalidRationales();
      res.json(audit);
    } catch (err: any) {
      console.error("[RationaleAudit] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/rationale-audit/generate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { questionIds, batchSize = 5 } = req.body;
      const size = Math.max(1, Math.min(batchSize, 10));

      let targetQuestions: any[];

      if (questionIds && Array.isArray(questionIds) && questionIds.length > 0) {
        const result = await pool.query(
          `SELECT id, stem, options, correct_answer, question_type, tier, topic
           FROM exam_questions WHERE id = ANY($1)`,
          [questionIds.slice(0, size)]
        );
        targetQuestions = result.rows.map((r: any) => ({
          id: r.id,
          stem: r.stem,
          options: r.options,
          correctAnswer: r.correct_answer,
          questionType: r.question_type,
          tier: r.tier,
          topic: r.topic,
        }));
      } else {
        const result = await pool.query(
          `SELECT id, stem, options, correct_answer, question_type, tier, topic
           FROM exam_questions
           WHERE status = 'published'
           AND (
             rationale IS NULL
             OR rationale = ''
             OR LENGTH(TRIM(rationale)) < 20
             OR LOWER(TRIM(rationale)) IN ('tbd', 'coming soon', 'placeholder', 'n/a', 'none', 'todo', 'not available', 'rationale here', 'add rationale', 'see rationale', 'explanation', 'to be added', 'to be determined')
             OR TRIM(rationale) ~ '^-+$'
             OR TRIM(rationale) ~ '^\\.+$'
             OR TRIM(rationale) ~ '^\\[.*\\]$'
             OR LOWER(TRIM(rationale)) ~ '^(x+|test|asdf|qwerty)$'
           )
           ORDER BY created_at
           LIMIT $1`,
          [size]
        );
        targetQuestions = result.rows.map((r: any) => ({
          id: r.id,
          stem: r.stem,
          options: r.options,
          correctAnswer: r.correct_answer,
          questionType: r.question_type,
          tier: r.tier,
          topic: r.topic,
        }));
      }

      if (targetQuestions.length === 0) {
        return res.json({ scanned: 0, fixed: 0, skipped: 0, failed: 0, results: [], message: "No questions need rationale remediation" });
      }

      const report = await generateRationalesForBatch(targetQuestions);
      res.json(report);
    } catch (err: any) {
      console.error("[RationaleRemediation] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/rationale-audit/preview", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { questionId } = req.body;
      if (!questionId) return res.status(400).json({ error: "questionId required" });

      const result = await pool.query(
        `SELECT id, stem, options, correct_answer, question_type, tier, topic, rationale
         FROM exam_questions WHERE id = $1`,
        [questionId]
      );
      if (!result.rows.length) return res.status(404).json({ error: "Question not found" });

      const q = result.rows[0];
      if (getKillSwitch()) return res.status(503).json({ error: "AI generation is currently disabled" });

      const optionsText = Array.isArray(q.options)
        ? q.options.map((o: any, i: number) => {
            const label = o.label || String.fromCharCode(65 + i);
            const text = o.text || o.content || String(o);
            return `${label}) ${text}`;
          }).join("\n")
        : JSON.stringify(q.options);

      const correctLabel = typeof q.correct_answer === "string"
        ? q.correct_answer
        : Array.isArray(q.correct_answer)
        ? q.correct_answer.join(", ")
        : JSON.stringify(q.correct_answer);

      const aiResult = await routeAIRequest(
        `You are a senior nursing educator writing exam rationales. Write a clear, educational rationale. The rationale must:
1. Explain WHY the correct answer is correct with clinical reasoning
2. Briefly explain why each incorrect option is wrong
3. Include relevant clinical pearls
4. Be 100-300 words
Return ONLY the rationale text.`,
        `Question (${q.tier.toUpperCase()} level, ${q.question_type}):
${q.stem}

Options:
${optionsText}

Correct Answer: ${correctLabel}
${q.topic ? `Topic: ${q.topic}` : ""}

Write the educational rationale:`,
        {
          model: "gpt-4o-mini",
          maxTokens: 1000,
          temperature: 0.5,
          taskType: "content",
          feature: "rationale-preview",
        }
      );

      res.json({
        questionId: q.id,
        currentRationale: q.rationale,
        generatedRationale: aiResult.content.trim(),
        stem: q.stem?.substring(0, 200),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/overview", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const [rationaleAudit, imageAudit, flashcardGaps] = await Promise.all([
        findQuestionsWithInvalidRationales(),
        analyzeImageAuditSeverity(),
        analyzeFlashcardCoverageGaps(),
      ]);

      res.json({
        rationales: {
          missingCount: rationaleAudit.total,
          byTier: rationaleAudit.byTier,
          byIssue: rationaleAudit.byIssue,
          severity: rationaleAudit.total > 0 ? "high" : "none",
        },
        images: {
          requiredMissing: imageAudit.requiredImages.count,
          requiredFormats: imageAudit.requiredImages.formats,
          recommendedMissing: imageAudit.recommendedImages.count,
          recommendedFormats: imageAudit.recommendedImages.formats,
          optionalMissing: imageAudit.optionalImages.count,
          optionalFormats: imageAudit.optionalImages.formats,
        },
        flashcardGaps: {
          totalGaps: flashcardGaps.totalGaps,
          affectedTiers: flashcardGaps.affectedTiers,
          topPriority: flashcardGaps.affectedTopics.slice(0, 20),
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("[ContentIntegrity] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/image-audit", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const imageAudit = await analyzeImageAuditSeverity();
      res.json(imageAudit);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/flashcard-gaps", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const gaps = await analyzeFlashcardCoverageGaps();
      res.json(gaps);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/export-rationale-issues", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const audit = await findQuestionsWithInvalidRationales();
      const csv = [
        "id,tier,question_type,issue,topic,body_system,stem_preview",
        ...audit.questions.map(q =>
          `"${q.id}","${q.tier}","${q.questionType}","${q.rationaleIssue}","${(q.topic || "").replace(/"/g, '""')}","${(q.bodySystem || "").replace(/"/g, '""')}","${q.stem.replace(/"/g, '""').substring(0, 100)}"`
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=rationale-issues.csv");
      res.send(csv);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
