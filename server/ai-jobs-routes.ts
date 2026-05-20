import { pool } from "./storage";

export interface AuditEntry {
  actorId: string | null;
  actorUsername: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  beforeState?: unknown;
  afterState?: unknown;
  reason?: string;
  severity?: "info" | "warning" | "critical";
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuditQueryFilters {
  action?: string;
  actorId?: string;
  actorUsername?: string;
  entityType?: string;
  entityId?: string;
  severity?: "info" | "warning" | "critical";
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

const ALLOWED_SEVERITIES = new Set(["info", "warning", "critical"]);

function sanitizeString(value: unknown, maxLength = 255): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/[<>]/g, "");
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function sanitizeOptionalText(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function normalizeSeverity(value: unknown): "info" | "warning" | "critical" {
  const severity = sanitizeString(value, 20)?.toLowerCase() || "info";
  if (ALLOWED_SEVERITIES.has(severity)) {
    return severity as "info" | "warning" | "critical";
  }
  return "info";
}

function safeJson(value: unknown): string | null {
  if (value === undefined) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ serializationError: true });
  }
}

function sanitizeDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function clampLimit(value: unknown, fallback = 50, max = 500): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(Math.floor(num), 1), max);
}

function clampOffset(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(Math.floor(num), 0);
}

function extractIpAddress(req: any): string | null {
  const forwarded = req?.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim().slice(0, 100);
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    const first = String(forwarded[0] || "").trim();
    return first ? first.slice(0, 100) : null;
  }

  if (typeof req?.ip === "string" && req.ip.trim()) {
    return req.ip.trim().slice(0, 100);
  }

  return null;
}

function normalizeAuditEntry(entry: AuditEntry): AuditEntry | null {
  const actorId = sanitizeString(entry.actorId, 100);
  const actorUsername = sanitizeString(entry.actorUsername, 150);
  const action = sanitizeString(entry.action, 120);
  const entityType = sanitizeString(entry.entityType, 120);
  const entityId = sanitizeString(entry.entityId, 150);
  const reason = sanitizeOptionalText(entry.reason, 2000);
  const severity = normalizeSeverity(entry.severity);
  const ipAddress = sanitizeString(entry.ipAddress, 100);
  const userAgent = sanitizeString(entry.userAgent, 500);

  if (!action || !entityType) {
    return null;
  }

  return {
    actorId,
    actorUsername,
    action,
    entityType,
    entityId,
    beforeState: entry.beforeState,
    afterState: entry.afterState,
    reason: reason ?? undefined,
    severity,
    ipAddress,
    userAgent,
  };
}

export async function recordAuditLog(entry: AuditEntry): Promise<string | null> {
  try {
    const normalized = normalizeAuditEntry(entry);

    if (!normalized) {
      console.error("[OpsAudit] Refused to record invalid audit log entry");
      return null;
    }

    const result = await pool.query(
      `INSERT INTO audit_logs (
        id,
        actor_id,
        actor_username,
        entity_type,
        entity_id,
        action,
        before_json,
        after_json,
        reason,
        severity,
        ip_address,
        user_agent,
        created_at
      )
      VALUES (
        gen_random_uuid(),
        $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10, $11, NOW()
      )
      RETURNING id`,
      [
        normalized.actorId,
        normalized.actorUsername,
        normalized.entityType,
        normalized.entityId,
        normalized.action,
        safeJson(normalized.beforeState),
        safeJson(normalized.afterState),
        normalized.reason,
        normalized.severity,
        normalized.ipAddress,
        normalized.userAgent,
      ],
    );

    return result.rows[0]?.id || null;
  } catch (e) {
    console.error("[OpsAudit] Failed to record audit log:", e);
    return null;
  }
}

export function extractAuditContext(
  req: any,
  admin: any,
): Pick<AuditEntry, "actorId" | "actorUsername" | "ipAddress" | "userAgent"> {
  return {
    actorId: sanitizeString(admin?.id, 100),
    actorUsername: sanitizeString(admin?.username, 150),
    ipAddress: extractIpAddress(req),
    userAgent: sanitizeString(req?.headers?.["user-agent"], 500),
  };
}

export async function auditAction(
  req: any,
  admin: any,
  action: string,
  entityType: string,
  entityId: string | null,
  opts?: {
    before?: unknown;
    after?: unknown;
    reason?: string;
    severity?: "info" | "warning" | "critical";
  },
): Promise<string | null> {
  const ctx = extractAuditContext(req, admin);

  return recordAuditLog({
    ...ctx,
    action,
    entityType,
    entityId,
    beforeState: opts?.before,
    afterState: opts?.after,
    reason: opts?.reason,
    severity: opts?.severity || "info",
  });
}

export async function queryAuditLogs(
  filters: AuditQueryFilters,
): Promise<{ logs: any[]; total: number }> {
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  const action = sanitizeString(filters.action, 120);
  const actorId = sanitizeString(filters.actorId, 100);
  const actorUsername = sanitizeString(filters.actorUsername, 150);
  const entityType = sanitizeString(filters.entityType, 120);
  const entityId = sanitizeString(filters.entityId, 150);
  const severity = filters.severity ? normalizeSeverity(filters.severity) : null;
  const startDate = sanitizeDate(filters.startDate);
  const endDate = sanitizeDate(filters.endDate);

  if (action) {
    conditions.push(`action = $${idx++}`);
    params.push(action);
  }

  if (actorId) {
    conditions.push(`actor_id = $${idx++}`);
    params.push(actorId);
  }

  if (actorUsername) {
    conditions.push(`actor_username ILIKE $${idx++}`);
    params.push(`%${actorUsername}%`);
  }

  if (entityType) {
    conditions.push(`entity_type = $${idx++}`);
    params.push(entityType);
  }

  if (entityId) {
    conditions.push(`entity_id = $${idx++}`);
    params.push(entityId);
  }

  if (severity) {
    conditions.push(`severity = $${idx++}`);
    params.push(severity);
  }

  if (startDate) {
    conditions.push(`created_at >= $${idx++}`);
    params.push(startDate);
  }

  if (endDate) {
    conditions.push(`created_at <= $${idx++}`);
    params.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = clampLimit(filters.limit, 50, 500);
  const offset = clampOffset(filters.offset);

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM audit_logs ${whereClause}`,
      params,
    );

    const total = countResult.rows[0]?.total || 0;

    const dataResult = await pool.query(
      `SELECT *
       FROM audit_logs
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${idx++}
       OFFSET $${idx++}`,
      [...params, limit, offset],
    );

    return {
      logs: dataResult.rows,
      total,
    };
  } catch (e) {
    console.error("[OpsAudit] Failed to query audit logs:", e);
    return { logs: [], total: 0 };
  }
}

export async function getAuditLogActions(): Promise<string[]> {
  try {
    const result = await pool.query(
      `SELECT DISTINCT action
       FROM audit_logs
       WHERE action IS NOT NULL
       ORDER BY action`,
    );

    return result.rows
      .map((r: any) => r.action)
      .filter((value: unknown): value is string => typeof value === "string" && value.length > 0);
  } catch (e) {
    console.error("[OpsAudit] Failed to load audit actions:", e);
    return [];
  }
}

export async function getAuditLogEntityTypes(): Promise<string[]> {
  try {
    const result = await pool.query(
      `SELECT DISTINCT entity_type
       FROM audit_logs
       WHERE entity_type IS NOT NULL
       ORDER BY entity_type`,
    );

    return result.rows
      .map((r: any) => r.entity_type)
      .filter((value: unknown): value is string => typeof value === "string" && value.length > 0);
  } catch (e) {
    console.error("[OpsAudit] Failed to load audit entity types:", e);
    return [];
  }
}

export async function exportAuditLogs(filters: AuditQueryFilters): Promise<any[]> {
  const allFilters: AuditQueryFilters = {
    ...filters,
    limit: 10000,
    offset: 0,
  };

  const { logs } = await queryAuditLogs(allFilters);
  return logs;
}