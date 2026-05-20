/**
 * Machine-readable log lines for platform drains (Vercel Log Drains, Axiom, Datadog, etc.).
 * Enable with `NN_STRUCTURED_OBSERVABILITY=1` (recommended in production).
 *
 * @see MONITORING_LOG_SCHEMA_V1 — stable JSON shape for alert queries.
 */
import { redactMetaForLog } from "@/lib/env/redact-secrets";

export const MONITORING_LOG_SCHEMA_V1 = "nn.observability.v1" as const;

export type MonitoringSeverity = "info" | "warn" | "error";

export type MonitoringRecordV1 = {
  schema: typeof MONITORING_LOG_SCHEMA_V1;
  ts: string;
  service: "nursenest-core";
  env: string;
  vercelEnv: string | null;
  nodeEnv: string | null;
  scope: string;
  event: string;
  severity: MonitoringSeverity;
  correlationId?: string;
  route?: string;
  httpStatus?: number;
  durationMs?: number;
  /** Low-cardinality flow label for Sentry / dashboards (e.g. billing, auth, questions). */
  flow?: string;
  meta?: Record<string, string | number | boolean | undefined>;
};

function structuredObservabilityEnabled(): boolean {
  if (process.env.NN_STRUCTURED_OBSERVABILITY === "0" || process.env.NN_STRUCTURED_OBSERVABILITY === "false") {
    return false;
  }
  return (
    process.env.NN_STRUCTURED_OBSERVABILITY === "1" ||
    process.env.NN_STRUCTURED_OBSERVABILITY === "true" ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production"
  );
}

export function emitMonitoringRecord(record: Omit<MonitoringRecordV1, "schema" | "ts" | "service" | "env" | "vercelEnv" | "nodeEnv"> & Partial<Pick<MonitoringRecordV1, "meta">>): void {
  if (!structuredObservabilityEnabled()) return;
  const row: MonitoringRecordV1 = {
    schema: MONITORING_LOG_SCHEMA_V1,
    ts: new Date().toISOString(),
    service: "nursenest-core",
    env: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    ...record,
    meta: record.meta ? (redactMetaForLog(record.meta as Record<string, unknown>) as MonitoringRecordV1["meta"]) : undefined,
  };
  try {
    console.error(JSON.stringify(row));
  } catch {
    /* ignore */
  }
}
