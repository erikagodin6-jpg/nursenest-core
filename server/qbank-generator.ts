import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { renderPromptForVariant, getActiveTemplates } from "./prompts/qbank-templates";
import { runContentQualityGate } from "./content-quality-gate";
import { routeAIRequest, getKillSwitch } from "./ai-provider-router";

/* =========================
   CONSTANTS
========================= */

const ALLOWED_QUESTION_TYPES = new Set([
  "MCQ",
  "MCQ_SINGLE",
  "SATA",
  "multiple_choice",
  "select_all_that_apply",
]);

/* =========================
   HELPERS
========================= */

function enforceQuestionType(type: string): string {
  if (ALLOWED_QUESTION_TYPES.has(type)) return type;
  console.warn(`[QBank] Invalid type "${type}" → forced to MCQ`);
  return "MCQ";
}

function safeJsonParse(text: string): any {
  try {
    const match = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

async function aiGenerate(system: string, user: string, model: string, maxTokens: number) {
  const res = await routeAIRequest(system, user, {
    model,
    maxTokens,
    temperature: 0.7,
    taskType: "qbank",
  });

  return { content: res.content, tokens: res.tokensUsed };
}

/* =========================
   VALIDATION
========================= */

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function validateBatch(questions: any[], minWords: number) {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (!q.stem) errors.push(`Q#${i}: Missing stem`);

    const rationale = q.rationale || q.rationaleLong || "";
    if (countWords(rationale) < minWords) {
      warnings.push(`Q#${i}: Short rationale`);
    }

    if (!q.options && q.questionType !== "HIGHLIGHT_TEXT") {
      errors.push(`Q#${i}: Missing options`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/* =========================
   GENERATION CORE
========================= */

async function generateChunks(params: any) {
  const { templateKey, variantKey, count, rationaleMinWords, model } = params;

  let questions: any[] = [];
  let tokens = 0;

  const chunkSize = count <= 25 ? count : 15;
  const totalChunks = Math.ceil(count / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const remaining = count - questions.length;
    if (remaining <= 0) break;

    const size = Math.min(chunkSize, remaining);

    const rendered = await renderPromptForVariant(templateKey, variantKey, {
      count: size,
      rationaleMinWords,
    });

    if (!rendered) break;

    const { content, tokens: used } = await aiGenerate(
      rendered.systemPrompt,
      rendered.userPrompt,
      model,
      Math.min(size * 1500, 32000)
    );

    tokens += used;

    const parsed = safeJsonParse(content);
    if (Array.isArray(parsed)) questions.push(...parsed);
    else if (parsed) questions.push(parsed);
  }

  return { questions, tokens };
}

/* =========================
   MAIN RUNNER
========================= */

export async function runBatchGeneration(params: any) {
  if (getKillSwitch()) throw new Error("Kill switch active");

  const rendered = await renderPromptForVariant(
    params.templateKey,
    params.variantKey,
    {
      count: params.count,
      rationaleMinWords: params.rationaleMinWords,
    }
  );

  if (!rendered) throw new Error("Template/variant not found");

  const run = await pool.query(
    `INSERT INTO qbank_generation_runs (template_key, variant_key, status)
     VALUES ($1,$2,'running') RETURNING id`,
    [params.templateKey, params.variantKey]
  );

  const runId = run.rows[0].id;

  try {
    const { questions, tokens } = await generateChunks(params);

    const validation = validateBatch(
      questions,
      params.rationaleMinWords
    );

    const accepted = questions.filter((q) => {
      const wc = countWords(q.rationale || "");
      return q.stem && wc >= params.rationaleMinWords * 0.7;
    });

    const preview = accepted.slice(0, 5);

    await pool.query(
      `UPDATE qbank_generation_runs
       SET status='completed',
           generated_count=$1,
           accepted_count=$2,
           validation_report=$3,
           token_cost=$4
       WHERE id=$5`,
      [
        questions.length,
        accepted.length,
        JSON.stringify(validation),
        tokens,
        runId,
      ]
    );

    if (params.ingest && validation.valid && !params.dryRun) {
      await ingestQuestions(runId, accepted, rendered.variant);
    }

    return {
      runId,
      totalGenerated: questions.length,
      totalAccepted: accepted.length,
      totalRejected: questions.length - accepted.length,
      validation,
      preview,
      previewItems: preview,
      tokenCost: tokens,
    };
  } catch (err: any) {
    await pool.query(
      `UPDATE qbank_generation_runs SET status='failed' WHERE id=$1`,
      [runId]
    );
    throw err;
  }
}

/* =========================
   INGEST
========================= */

async function ingestQuestions(runId: string, questions: any[], variant: any) {
  for (const q of questions) {
    await pool.query(
      `INSERT INTO exam_questions (exam, question_type, stem, options, correct_answer, rationale)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        variant.examKey,
        enforceQuestionType(q.questionType || "MCQ"),
        q.stem,
        JSON.stringify(q.options || []),
        JSON.stringify(q.correctAnswer || []),
        q.rationale || "",
      ]
    );
  }

  await pool.query(
    `UPDATE qbank_generation_runs SET ingested=true WHERE id=$1`,
    [runId]
  );
}

/* =========================
   ROUTES
========================= */

export function setupQBankGenerator(app: Express): void {
  app.post("/api/admin/qbank/generate", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await runBatchGeneration(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/qbank/templates", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const templates = await getActiveTemplates();
    res.json(templates);
  });
}