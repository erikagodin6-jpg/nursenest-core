import type { Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { BoundedMap } from "./bounded-map";
import crypto from "crypto";

const DB_STATEMENT_TIMEOUT_MS = parseInt(process.env.DB_STATEMENT_TIMEOUT_MS || "30000");
const API_HANDLER_TIMEOUT_MS = parseInt(process.env.API_HANDLER_TIMEOUT_MS || "15000");
const AI_SERVICE_TIMEOUT_MS = parseInt(process.env.AI_SERVICE_TIMEOUT_MS || "60000");

export async function timedDbQuery<T = any>(
  queryText: string,
  params: any[],
  timeoutMs: number = DB_STATEMENT_TIMEOUT_MS,
  requestId?: string
): Promise<T> {
  const start = Date.now();
  const client = await pool.connect();
  try {
    await client.query(`SET LOCAL statement_timeout = '${timeoutMs}'`);
    const result = await client.query(queryText, params);
    const elapsed = Date.now() - start;
    if (elapsed > timeoutMs * 0.8) {
      console.warn(`[DbTimeout] Slow query: ${elapsed}ms / ${timeoutMs}ms limit, requestId=${requestId || "unknown"}`);
    }
    return result as T;
  } catch (err: any) {
    const elapsed = Date.now() - start;
    if (err.message?.includes("statement timeout") || err.code === "57014") {
      console.error(`[DbTimeout] Query timeout: ${elapsed}ms exceeded ${timeoutMs}ms limit, requestId=${requestId || "unknown"}`);
      const timeoutErr = new Error(`Database query timed out`);
      (timeoutErr as any).code = "DB_TIMEOUT";
      (timeoutErr as any).requestId = requestId;
      throw timeoutErr;
    }
    throw err;
  } finally {
    client.release();
  }
}

export function apiHandlerTimeout(timeoutMs: number = API_HANDLER_TIMEOUT_MS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        console.error(`[ApiTimeout] ${req.method} ${req.originalUrl} exceeded ${timeoutMs}ms`);
        res.status(504).json({
          error: "Request timed out",
          timeout: timeoutMs,
          retryable: true,
          reasonCode: "request_timeout",
        });
      }
    }, timeoutMs);
    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));
    next();
  };
}

export async function withAiTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = AI_SERVICE_TIMEOUT_MS,
  fallback?: () => T | Promise<T>
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        if (fallback) {
          Promise.resolve(fallback()).then(resolve).catch(reject);
        } else {
          const err = new Error(`AI service timed out after ${timeoutMs}ms`);
          (err as any).code = "AI_TIMEOUT";
          reject(err);
        }
      }
    }, timeoutMs);

    fn()
      .then((result) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(result);
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      });
  });
}

const perUserRateLimits = new BoundedMap<string, number[]>(2000, 10 * 60 * 1000);

export function perUserExamStartLimiter(maxStarts: number = 3, windowMs: number = 60000) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).authUser?.id || (req as any).user?.id;
      if (!userId) return next();

      const key = `exam_start:${userId}`;
      const now = Date.now();
      let timestamps = perUserRateLimits.get(key) || [];
      timestamps = timestamps.filter((t) => now - t < windowMs);

      if (timestamps.length >= maxStarts) {
        console.warn(`[RateLimit] User ${userId} exceeded exam start limit: ${timestamps.length}/${maxStarts} in ${windowMs}ms`);
        return res.status(429).json({
          error: "Too many exam starts. Please wait before trying again.",
          retryAfter: Math.ceil((windowMs - (now - timestamps[0])) / 1000),
          retryable: true,
          reasonCode: "rate_limited",
        });
      }

      timestamps.push(now);
      perUserRateLimits.set(key, timestamps);
      next();
    } catch {
      next();
    }
  };
}

const requestDedup = new BoundedMap<string, { timestamp: number; processing: boolean }>(1000, 5000);

export function requestDeduplication(keyExtractor: (req: Request) => string | null) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyExtractor(req);
      if (!key) return next();

      const existing = requestDedup.get(key);
      if (existing && existing.processing && Date.now() - existing.timestamp < 5000) {
        return res.status(429).json({
          error: "Duplicate request detected. Please wait for the previous request to complete.",
          retryable: true,
          reasonCode: "duplicate_request",
        });
      }

      requestDedup.set(key, { timestamp: Date.now(), processing: true });
      const cleanup = () => {
        const entry = requestDedup.get(key);
        if (entry) entry.processing = false;
      };
      res.on("finish", cleanup);
      res.on("close", cleanup);
      next();
    } catch {
      next();
    }
  };
}

const mockExamIdempotency = new BoundedMap<string, { attemptId: string; expiresAt: number }>(500, 5 * 60 * 1000);

export function getMockExamIdempotencyCache() {
  return mockExamIdempotency;
}

export interface StructuredExamLog {
  requestId: string;
  userId: string;
  tier: string;
  examId?: string;
  examType: string;
  source: string;
  rowCountsAfterFilters?: Record<string, number>;
  validationRejections?: string[];
  startupDurationMs: number;
  queryDurationMs?: number;
  fallbackUsed?: string;
  errorCode?: string;
  mode?: string;
  questionCount?: number;
  blueprintCode?: string;
}

export function logStructuredExamStart(log: StructuredExamLog): void {
  const parts = [
    `[ExamStartup]`,
    `requestId=${log.requestId}`,
    `userId=${log.userId}`,
    `tier=${log.tier}`,
    `type=${log.examType}`,
    `source=${log.source}`,
    `duration=${log.startupDurationMs}ms`,
  ];
  if (log.examId) parts.push(`examId=${log.examId}`);
  if (log.mode) parts.push(`mode=${log.mode}`);
  if (log.questionCount !== undefined) parts.push(`questions=${log.questionCount}`);
  if (log.blueprintCode) parts.push(`blueprint=${log.blueprintCode}`);
  if (log.fallbackUsed) parts.push(`fallback=${log.fallbackUsed}`);
  if (log.errorCode) parts.push(`error=${log.errorCode}`);
  if (log.validationRejections && log.validationRejections.length > 0) {
    parts.push(`rejections=${log.validationRejections.length}`);
  }
  if (log.rowCountsAfterFilters) {
    for (const [key, count] of Object.entries(log.rowCountsAfterFilters)) {
      parts.push(`${key}=${count}`);
    }
  }
  if (log.queryDurationMs !== undefined) parts.push(`queryMs=${log.queryDurationMs}`);

  console.log(parts.join(" "));
}

export function generateTraceId(): string {
  return `trace-${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}`;
}

export interface ExamDiagnosticStats {
  catStartsAttempted: number;
  catStartsSucceeded: number;
  catStartsFailed: number;
  fallbacksUsed: number;
  failuresByCode: Record<string, number>;
  emptyPoolCounts: number;
  malformedQuestionCounts: number;
  lastUpdated: number;
}

const diagnosticStats: ExamDiagnosticStats = {
  catStartsAttempted: 0,
  catStartsSucceeded: 0,
  catStartsFailed: 0,
  fallbacksUsed: 0,
  failuresByCode: {},
  emptyPoolCounts: 0,
  malformedQuestionCounts: 0,
  lastUpdated: Date.now(),
};

export function recordDiagnostic(event: "cat_start_attempt" | "cat_start_success" | "cat_start_failure" | "fallback_used" | "empty_pool" | "malformed_question", errorCode?: string): void {
  diagnosticStats.lastUpdated = Date.now();
  switch (event) {
    case "cat_start_attempt":
      diagnosticStats.catStartsAttempted++;
      break;
    case "cat_start_success":
      diagnosticStats.catStartsSucceeded++;
      break;
    case "cat_start_failure":
      diagnosticStats.catStartsFailed++;
      if (errorCode) {
        diagnosticStats.failuresByCode[errorCode] = (diagnosticStats.failuresByCode[errorCode] || 0) + 1;
      }
      break;
    case "fallback_used":
      diagnosticStats.fallbacksUsed++;
      break;
    case "empty_pool":
      diagnosticStats.emptyPoolCounts++;
      break;
    case "malformed_question":
      diagnosticStats.malformedQuestionCounts++;
      break;
  }
}

export function getDiagnosticStats(): ExamDiagnosticStats {
  return { ...diagnosticStats };
}

export function resetDiagnosticStats(): void {
  diagnosticStats.catStartsAttempted = 0;
  diagnosticStats.catStartsSucceeded = 0;
  diagnosticStats.catStartsFailed = 0;
  diagnosticStats.fallbacksUsed = 0;
  diagnosticStats.failuresByCode = {};
  diagnosticStats.emptyPoolCounts = 0;
  diagnosticStats.malformedQuestionCounts = 0;
  diagnosticStats.lastUpdated = Date.now();
}

export interface QuestionValidationResult {
  valid: boolean;
  quarantined: boolean;
  reasons: string[];
}

export function validateQuestionForProduction(question: any): QuestionValidationResult {
  const reasons: string[] = [];

  if (!question.id) {
    reasons.push("missing_id");
  }

  if (!question.stem || typeof question.stem !== "string" || question.stem.trim().length < 5) {
    reasons.push("empty_or_short_stem");
  }

  let options = question.options;
  if (typeof options === "string") {
    try { options = JSON.parse(options); } catch { reasons.push("unparseable_options"); }
  }
  if (!Array.isArray(options) || options.length < 2) {
    reasons.push("insufficient_options");
  } else {
    const emptyOptions = options.filter((o: any) => {
      const text = typeof o === "object" && o !== null ? o.text : String(o || "");
      return !text || text.trim().length === 0;
    });
    if (emptyOptions.length > 0) {
      reasons.push("empty_option_text");
    }
  }

  let correctAnswer = question.correct_answer !== undefined && question.correct_answer !== null
    ? question.correct_answer
    : question.correctAnswer;
  if (correctAnswer === undefined || correctAnswer === null || correctAnswer === "") {
    reasons.push("missing_correct_answer");
  } else {
    if (typeof correctAnswer === "string") {
      try {
        const parsed = JSON.parse(correctAnswer);
        correctAnswer = parsed;
      } catch {}
    }
    if (Array.isArray(correctAnswer)) {
      if (correctAnswer.length === 0) reasons.push("empty_correct_answer_array");
    } else if (typeof correctAnswer === "string") {
      const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
      if (letterMap[correctAnswer.toUpperCase()] === undefined && isNaN(Number(correctAnswer))) {
        reasons.push("invalid_correct_answer_format");
      }
    } else if (typeof correctAnswer === "number") {
      if (Array.isArray(options) && (correctAnswer < 0 || correctAnswer >= options.length)) {
        reasons.push("correct_answer_out_of_bounds");
      }
    } else {
      reasons.push("invalid_correct_answer_type");
    }
  }

  if (question.difficulty === undefined || question.difficulty === null) {
    reasons.push("missing_difficulty");
  } else {
    const diff = Number(question.difficulty);
    if (isNaN(diff) || diff < 1 || diff > 5) {
      reasons.push("invalid_difficulty_range");
    }
  }

  if (question.status && question.status !== "published" && question.status !== "active") {
    reasons.push("not_published_or_active");
  }

  if (question.tier) {
    const validTiers = ["free", "rpn", "rn", "np", "admin"];
    if (!validTiers.includes(question.tier)) {
      reasons.push("invalid_tier");
    }
  }

  if (question.region_scope) {
    const validRegions = ["US", "CAN", "BOTH", "UK", "AUS", "GLOBAL"];
    if (!validRegions.includes(question.region_scope)) {
      reasons.push("invalid_region_scope");
    }
  }

  if (question.language_code) {
    const validLanguages = ["en", "fr", "es", "zh", "ar", "hi", "tl", "pt"];
    if (!validLanguages.includes(question.language_code)) {
      reasons.push("invalid_language_code");
    }
  }

  const shouldQuarantine = reasons.some((r) =>
    ["missing_id", "empty_or_short_stem", "insufficient_options", "missing_correct_answer", "unparseable_options"].includes(r)
  );

  return {
    valid: reasons.length === 0,
    quarantined: shouldQuarantine,
    reasons,
  };
}

export function validateQuestionsForExam(questions: any[]): {
  valid: any[];
  rejected: Array<{ question: any; reasons: string[] }>;
  quarantined: Array<{ question: any; reasons: string[] }>;
} {
  const valid: any[] = [];
  const rejected: Array<{ question: any; reasons: string[] }> = [];
  const quarantined: Array<{ question: any; reasons: string[] }> = [];

  for (const q of questions) {
    const result = validateQuestionForProduction(q);
    if (result.valid) {
      valid.push(q);
    } else if (result.quarantined) {
      quarantined.push({ question: q, reasons: result.reasons });
      recordDiagnostic("malformed_question");
    } else {
      rejected.push({ question: q, reasons: result.reasons });
    }
  }

  return { valid, rejected, quarantined };
}

export function pruneHardeningCaches(): void {
  perUserRateLimits.prune();
  requestDedup.prune();
  mockExamIdempotency.prune();
}
