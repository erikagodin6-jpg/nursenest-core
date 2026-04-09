/**
 * Typed models for the admin system status dashboard and `/api/admin/system-status`.
 * Never include secret values — only booleans and safe summaries.
 */

export type OverallSystemStatus = "healthy" | "degraded" | "failed";

export type CheckStatus = "healthy" | "degraded" | "failed";

export type SystemCheckId =
  | "appLiveness"
  | "appReadiness"
  | "database"
  | "auth"
  | "openai"
  | "stripe"
  | "spaces"
  | "queueHealth"
  | "contentHealth"
  | "deployInfo"
  | "envSanity";

export type SystemCheckResult = {
  id: SystemCheckId;
  /** Human-readable label for UI */
  name: string;
  status: CheckStatus;
  summary: string;
  /** Safe structured detail — no secrets */
  details: Record<string, unknown>;
  checkedAt: string;
  responseTimeMs: number;
};

export type SystemStatusPayload = {
  ok: true;
  overall: OverallSystemStatus;
  /** When the snapshot was assembled */
  checkedAt: string;
  /** Wall-clock time to collect all checks (approximate) */
  totalResponseTimeMs: number;
  checks: SystemCheckResult[];
};

export type SystemStatusErrorPayload = {
  ok: false;
  error: string;
};
