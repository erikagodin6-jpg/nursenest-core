import type { Express, Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { pool } from "./storage";
import { assembleExam } from "./mock-exam-assembly";
import { resolveAuthUser } from "./admin-auth";
import { emitStructuredLog } from "./log-sink";
import { queryParamString, routeParamString } from "./route-params";

/* =========================
   CONFIG
========================= */

const MAX_CONCURRENT_ASSEMBLIES = 5;
const PAGE_SIZE_DEFAULT = 15;
const PAGE_SIZE_MAX = 50;

let activeAssemblies = 0;

/* =========================
   HELPERS
========================= */

function safeParseJSON(val: any) {
  if (!val) return null;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

function logExamIncident(
  category: string,
  route: string,
  meta: Record<string, unknown>,
  level: "warn" | "error" = "error",
): void {
  emitStructuredLog(
    {
      level,
      type: "exam_delivery_failure",
      category,
      route,
      ...meta,
    },
    level === "warn" ? "warn" : "error",
  );
}

/* =========================
   ROUTES
========================= */

let examAttemptsTableEnsured = false;

async function ensureExamAttemptsTable(): Promise<void> {
  if (examAttemptsTableEnsured) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS exam_attempts (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      user_id varchar NOT NULL,
      template_id text NOT NULL,
      exam_code text NOT NULL,
      questions_payload jsonb NOT NULL DEFAULT '[]'::jsonb,
      question_count integer NOT NULL,
      page_size integer NOT NULL,
      answers jsonb NOT NULL DEFAULT '{}'::jsonb,
      status text DEFAULT 'in_progress',
      score integer,
      created_at timestamp DEFAULT now() NOT NULL
    )
  `);
  examAttemptsTableEnsured = true;
}

export async function registerExamDeliveryRoutes(app: Express): Promise<void> {
  await ensureExamAttemptsTable();

  /* =========================
     START EXAM
  ========================= */

  app.post("/api/exam/start", async (req, res) => {
    try {
      if (activeAssemblies >= MAX_CONCURRENT_ASSEMBLIES) {
        logExamIncident("assembly_capacity", "POST /api/exam/start", { message: "max concurrent assemblies" }, "warn");
        return res.status(503).json({
          error: "System busy, try again shortly",
          code: "ASSEMBLY_CAPACITY_EXCEEDED",
        });
      }

      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized", code: "AUTH_REQUIRED" });
      }

      const { templateId, pageSize } = req.body;

      if (!templateId) {
        return res.status(400).json({ error: "templateId required", code: "INVALID_REQUEST" });
      }

      const rawPs =
        typeof pageSize === "number" && Number.isFinite(pageSize)
          ? pageSize
          : parseInt(String(pageSize ?? ""), 10);
      const coercedPs = Number.isFinite(rawPs) && rawPs > 0 ? rawPs : PAGE_SIZE_DEFAULT;
      const ps = Math.min(Math.max(coercedPs, 5), PAGE_SIZE_MAX);

      const templateRes = await pool.query(
        "SELECT * FROM mock_exam_templates WHERE template_id=$1 AND active=true",
        [templateId]
      );

      if (!templateRes.rows.length) {
        return res.status(404).json({
          error: "Template not found or inactive",
          code: "EXAM_TEMPLATE_NOT_FOUND",
          templateId: String(templateId),
        });
      }

      const template = templateRes.rows[0];
      const domainWeights = safeParseJSON(template.domain_weights) || [{ domain: "General", weight: 1 }];
      const difficultyDistribution = safeParseJSON(template.difficulty_distribution) || {
        foundational: 0.3,
        moderate: 0.5,
        difficult: 0.2,
      };
      const formatMix = safeParseJSON(template.format_mix) || {
        mcqSingle: 0.7,
        selectAllThatApply: 0.1,
        scenarioBased: 0.1,
        prioritization: 0.05,
        delegation: 0.05,
      };

      activeAssemblies++;

      try {
        const questions = await assembleExam({
          templateId,
          examCode: template.exam_code,
          questionCount: template.question_count,
          timeLimitMinutes: template.time_limit_minutes,
          domainWeights,
          difficultyDistribution,
          formatMix,
          passingStandard: template.passing_standard,
          seed: Date.now(),
          tier: template.tier || "rn",
        });

        if (!Array.isArray(questions) || questions.length === 0) {
          logExamIncident(
            "empty_question_pool",
            "POST /api/exam/start",
            { templateId: String(templateId), examCode: template.exam_code },
            "warn",
          );
          return res.status(422).json({
            error: "No questions could be assembled for this template",
            code: "QUESTION_POOL_EMPTY",
            templateId: String(templateId),
          });
        }

        const insert = await pool.query(
          `INSERT INTO exam_attempts
          (user_id, template_id, exam_code, questions_payload, question_count, page_size)
          VALUES ($1,$2,$3,$4,$5,$6)
          RETURNING id`,
          [
            user.id,
            templateId,
            template.exam_code,
            JSON.stringify(questions),
            questions.length,
            ps,
          ]
        );

        const attemptId = insert.rows[0].id;

        res.json({
          attemptId,
          totalQuestions: questions.length,
          totalPages: Math.ceil(questions.length / ps),
        });

      } finally {
        activeAssemblies--;
      }

    } catch (err: any) {
      const msg = err?.message || String(err);
      logExamIncident("exam_start_exception", "POST /api/exam/start", { message: msg });
      res.status(500).json({
        error: "Failed to start exam",
        code: "EXAM_START_SERVER_ERROR",
        details: process.env.NODE_ENV === "production" ? undefined : msg,
      });
    }
  });

  /* =========================
     GET QUESTIONS (PAGINATED)
  ========================= */

  app.get("/api/exam/:attemptId/questions", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized", code: "AUTH_REQUIRED" });
      }

      const attemptId = routeParamString(req.params.attemptId);
      if (!attemptId) {
        return res.status(400).json({ error: "attemptId required", code: "INVALID_ATTEMPT_ID" });
      }
      const pageRaw = queryParamString(req.query.page as string | string[] | undefined);
      const pageParsed = parseInt(pageRaw || "1", 10);
      const page = Math.max(1, Number.isFinite(pageParsed) ? pageParsed : 1);

      const result = await pool.query(
        "SELECT questions_payload, page_size FROM exam_attempts WHERE id=$1 AND user_id=$2",
        [attemptId, user.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          error: "Exam attempt not found",
          code: "ATTEMPT_NOT_FOUND",
        });
      }

      const row = result.rows[0];
      const questions = safeParseJSON(row.questions_payload) || [];

      if (!Array.isArray(questions) || questions.length === 0) {
        logExamIncident(
          "empty_attempt_questions",
          "GET /api/exam/:attemptId/questions",
          { attemptId, userId: user.id },
          "warn",
        );
        return res.status(422).json({
          error: "This attempt has no questions loaded",
          code: "EMPTY_QUESTION_SET",
        });
      }

      const ps = row.page_size || PAGE_SIZE_DEFAULT;
      const start = (page - 1) * ps;
      const end = start + ps;

      res.json({
        page,
        totalPages: Math.ceil(questions.length / ps),
        questions: questions.slice(start, end).map((q: any) => ({
          id: q.id,
          stem: q.stem,
          options: q.options,
          domain: q.domain,
        })),
      });

    } catch (err: any) {
      const msg = err?.message || String(err);
      logExamIncident("questions_fetch_exception", "GET /api/exam/:attemptId/questions", { message: msg });
      res.status(500).json({
        error: "Failed to load exam questions",
        code: "EXAM_QUESTIONS_SERVER_ERROR",
      });
    }
  });

  /* =========================
     SAVE ANSWER
  ========================= */

  app.post("/api/exam/:attemptId/answer", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized", code: "AUTH_REQUIRED" });
      }

      const attemptId = routeParamString(req.params.attemptId);
      if (!attemptId) {
        return res.status(400).json({ error: "attemptId required", code: "INVALID_ATTEMPT_ID" });
      }
      const { questionId, selectedIndex } = req.body;

      if (typeof questionId !== "string" || !questionId.trim()) {
        return res.status(400).json({
          error: "questionId is required",
          code: "INVALID_ANSWER_PAYLOAD",
        });
      }

      if (typeof selectedIndex !== "number" || !Number.isFinite(selectedIndex) || selectedIndex < 0) {
        return res.status(400).json({
          error: "selectedIndex must be a non-negative finite number",
          code: "INVALID_ANSWER_PAYLOAD",
        });
      }

      const upd = await pool.query(
        `UPDATE exam_attempts
         SET answers = answers || $1::jsonb
         WHERE id=$2 AND user_id=$3
         RETURNING id`,
        [
          JSON.stringify({
            [questionId]: { selectedIndex },
          }),
          attemptId,
          user.id,
        ]
      );

      if (!upd.rows.length) {
        return res.status(404).json({
          error: "Exam attempt not found",
          code: "ATTEMPT_NOT_FOUND",
        });
      }

      res.json({ success: true });

    } catch (err: any) {
      const msg = err?.message || String(err);
      logExamIncident("answer_save_exception", "POST /api/exam/:attemptId/answer", { message: msg });
      res.status(500).json({
        error: "Failed to save answer",
        code: "EXAM_ANSWER_SERVER_ERROR",
      });
    }
  });

  /* =========================
     SUBMIT EXAM
  ========================= */

  app.post("/api/exam/:attemptId/submit", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized", code: "AUTH_REQUIRED" });
      }

      const attemptId = routeParamString(req.params.attemptId);
      if (!attemptId) {
        return res.status(400).json({ error: "attemptId required", code: "INVALID_ATTEMPT_ID" });
      }

      const result = await pool.query(
        "SELECT questions_payload, answers FROM exam_attempts WHERE id=$1 AND user_id=$2",
        [attemptId, user.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          error: "Exam attempt not found",
          code: "ATTEMPT_NOT_FOUND",
        });
      }

      const row = result.rows[0];

      const questions = safeParseJSON(row.questions_payload) || [];
      const answers = safeParseJSON(row.answers) || {};

      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(422).json({
          error: "Attempt has no questions to score",
          code: "EMPTY_QUESTION_SET",
        });
      }

      let correct = 0;

      for (const q of questions) {
        if (!q || typeof q.id !== "string") continue;
        const sel = answers[q.id]?.selectedIndex;
        const ca = q.correctAnswer;
        if (typeof sel === "number" && Number.isFinite(sel) && sel === ca) {
          correct++;
        }
      }

      const total = questions.length;
      const rawPct = (correct / total) * 100;
      const score = Number.isFinite(rawPct) ? Math.round(Math.min(100, Math.max(0, rawPct))) : 0;

      await pool.query(
        `UPDATE exam_attempts
         SET status='completed', score=$1
         WHERE id=$2`,
        [score, attemptId]
      );

      res.json({
        score,
        correct,
        total,
      });

    } catch (err: any) {
      const msg = err?.message || String(err);
      logExamIncident("submit_exception", "POST /api/exam/:attemptId/submit", { message: msg });
      res.status(500).json({
        error: "Failed to submit exam",
        code: "EXAM_SUBMIT_SERVER_ERROR",
      });
    }
  });

}

/* =========================
   Mock exam delivery helpers (used by routes.ts)
========================= */

const MAX_CONCURRENT_ASSEMBLIES_GLOBAL = 5;
let assemblyInFlight = 0;

export function examRequestIdMiddleware() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const r = req as any;
    r.examRequestId =
      typeof r.requestId === "string" && r.requestId.length > 0
        ? r.requestId
        : randomUUID();
    next();
  };
}

export function getExamRequestId(req: any): string {
  return req.examRequestId || req.requestId || "";
}

export async function withAssemblyConcurrencyLimit<T>(
  fn: () => Promise<T>,
  _examReqId?: string,
): Promise<T> {
  if (assemblyInFlight >= MAX_CONCURRENT_ASSEMBLIES_GLOBAL) {
    const err: any = new Error("Assembly capacity exceeded");
    err.statusCode = 503;
    err.retryAfter = 10;
    throw err;
  }
  assemblyInFlight++;
  try {
    return await fn();
  } finally {
    assemblyInFlight--;
  }
}

export async function timedExamQuery(
  query: string,
  params?: any[],
  _label?: string,
  _requestId?: string,
): Promise<{ rows: any[]; rowCount?: number }> {
  return pool.query(query, params ?? []) as Promise<{ rows: any[]; rowCount?: number }>;
}

export function buildExamShell(row: any) {
  const questions = Array.isArray(row.questions) ? row.questions : [];
  const totalQuestions =
    typeof row.total_questions === "number" && row.total_questions >= 0
      ? row.total_questions
      : questions.length;
  let report = row.report;
  if (typeof report === "string") {
    try {
      report = JSON.parse(report);
    } catch {
      report = {};
    }
  }
  return {
    attemptId: row.id,
    id: row.id,
    user_id: row.user_id,
    status: row.status,
    totalQuestions,
    report: report || {},
    exam_type: row.exam_type,
    blueprint_code: row.blueprint_code,
    blueprint_meta: row.blueprint_meta,
    answers: row.answers,
    flagged: row.flagged,
    cat_state: row.cat_state,
    time_spent: row.time_spent,
    score: row.score,
    started_at: row.started_at,
    completed_at: row.completed_at,
    stopping_rule_status: row.stopping_rule_status,
    career_type: row.career_type,
  };
}

export function examDeliveryLog(
  msg: string,
  meta: Record<string, unknown>,
  requestId?: string,
): void {
  emitStructuredLog({
    level: "info",
    type: "exam_delivery",
    msg,
    requestId: requestId || null,
    ...meta,
  });
}

export function getAssemblyStats() {
  return {
    activeAssemblies: assemblyInFlight,
    maxConcurrent: MAX_CONCURRENT_ASSEMBLIES_GLOBAL,
  };
}
