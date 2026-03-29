import type { Express, Response } from "express";
import { emitStructuredLog } from "./log-sink";
import { pool } from "./storage";

/**
 * Minimal exam reliability surface used by routes.ts (mock exam assembly / load).
 * Expand with persistence or richer rules when needed.
 */

export function registerExamReliabilityRoutes(_app: Express): void {
  // Optional: mount diagnostics routes later
}

export function validateQuestion(q: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const stem = q?.stem ?? q?.question;
  if (!stem || typeof stem !== "string" || stem.trim().length < 3) {
    issues.push("invalid_stem");
  }
  const opts = q?.options;
  if (!Array.isArray(opts) || opts.length < 2) {
    issues.push("invalid_options");
  }
  if (
    q?.correct_answer === undefined &&
    q?.correctAnswer === undefined &&
    q?.correct === undefined
  ) {
    issues.push("missing_correct");
  }
  return { valid: issues.length === 0, issues };
}

export function logExamLoadError(payload: Record<string, unknown>): void {
  emitStructuredLog(
    {
      level: "warn",
      type: "exam_load_error",
      msg: "exam load failure",
      ...payload,
    },
    "warn",
  );
}

/** In-memory ring buffer for recent exam incidents (also logged structurally). */
export interface ExamIncident {
  userId: string | null;
  examType: string;
  tier: string;
  reasonCode: string;
  reasonDetail: string;
  endpoint: string;
  requestParams: Record<string, unknown>;
  severity: "critical" | "warning" | "info";
  createdAt: string;
}

const incidentRing: ExamIncident[] = [];
const MAX_INCIDENTS = 200;

export function addIncident(inc: ExamIncident): void {
  incidentRing.unshift(inc);
  if (incidentRing.length > MAX_INCIDENTS) incidentRing.pop();
  emitStructuredLog(
    {
      level: inc.severity === "critical" ? "error" : "warn",
      type: "exam_incident",
      msg: inc.reasonDetail,
      reasonCode: inc.reasonCode,
      tier: inc.tier,
      endpoint: inc.endpoint,
    },
    inc.severity === "critical" ? "error" : "warn",
  );
}

export function logExamRequest(phase: string, payload: Record<string, unknown>): void {
  emitStructuredLog(
    {
      level: "info",
      type: "exam_request",
      phase,
      ...payload,
    },
    "info",
  );
}

export async function checkPoolHealth(
  tier: string,
  _filters?: { bodySystems?: string[]; exam?: string | null }
): Promise<{ healthy: boolean; ok: boolean; totalPublished: number }> {
  try {
    const r = await pool.query(
      `SELECT COUNT(*)::int AS c FROM exam_questions WHERE status = 'published' AND tier = $1`,
      [tier]
    );
    const c = r.rows[0]?.c ?? 0;
    const healthy = c > 0;
    return { healthy, ok: healthy, totalPublished: c };
  } catch {
    return { healthy: false, ok: false, totalPublished: 0 };
  }
}

export async function getQuarantinedCount(): Promise<number> {
  try {
    const r = await pool.query(
      `SELECT COUNT(*)::int AS c FROM exam_questions WHERE quarantined_at IS NOT NULL`
    );
    return r.rows[0]?.c ?? 0;
  } catch {
    return 0;
  }
}

/** JSON error body for qbank / exam APIs (status may be 200 for soft-empty responses). */
export function structuredExamError(
  res: Response,
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>
): void {
  res.status(status).json({
    error: message,
    code,
    ...extra,
  });
}
