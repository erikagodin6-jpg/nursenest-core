import { pool } from "./storage";
import crypto from "crypto";

export type IncidentCategory =
  | "login_failure"
  | "entitlement_failure"
  | "exam_load_failure"
  | "cat_start_failure"
  | "flashcard_failure"
  | "lesson_load_failure"
  | "download_failure"
  | "fallback_mode"
  | "provisional_access"
  | "quarantined_content"
  | "deployment_rollback"
  | "circuit_breaker_trip"
  | "feature_auto_disabled"
  | "emergency_mode"
  | "health_check_failure"
  | "general";

export type IncidentSeverity = "critical" | "warning" | "info";
export type IncidentStatus = "active" | "acknowledged" | "resolved";

export interface ProductionIncident {
  incidentId: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  errorSignature: string;
  title: string;
  message: string;
  firstOccurrence: number;
  lastOccurrence: number;
  affectedUserIds: string[];
  affectedUserCount: number;
  occurrenceCount: number;
  status: IncidentStatus;
  resolutionNotes: string | null;
  resolvedAt: number | null;
  resolvedBy: string | null;
  acknowledgedAt: number | null;
  acknowledgedBy: string | null;
  metadata: Record<string, any>;
}

const activeIncidents = new Map<string, ProductionIncident>();
const DEDUP_WINDOW_MS = 15 * 60 * 1000;
const MAX_AFFECTED_USERS_TRACKED = 500;
const ALERT_USER_THRESHOLDS = [10, 50, 200];

function generateIncidentId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const hash = crypto.randomBytes(4).toString("hex");
  return `INC-${dateStr}-${hash}`;
}

function computeErrorSignature(category: string, errorKey: string): string {
  return `${category}::${errorKey}`;
}

function findActiveIncident(signature: string): ProductionIncident | null {
  for (const incident of activeIncidents.values()) {
    if (
      incident.errorSignature === signature &&
      incident.status === "active" &&
      Date.now() - incident.lastOccurrence < DEDUP_WINDOW_MS
    ) {
      return incident;
    }
  }
  return null;
}

export function logIncident(params: {
  category: IncidentCategory;
  severity: IncidentSeverity;
  title: string;
  message: string;
  errorKey: string;
  userId?: string | null;
  metadata?: Record<string, any>;
}): ProductionIncident {
  const { category, severity, title, message, errorKey, userId, metadata } = params;
  const signature = computeErrorSignature(category, errorKey);

  const existing = findActiveIncident(signature);

  if (existing) {
    existing.lastOccurrence = Date.now();
    existing.occurrenceCount++;

    if (userId && !existing.affectedUserIds.includes(userId) && existing.affectedUserIds.length < MAX_AFFECTED_USERS_TRACKED) {
      existing.affectedUserIds.push(userId);
      existing.affectedUserCount = existing.affectedUserIds.length;
    }

    if (severityRank(severity) > severityRank(existing.severity)) {
      existing.severity = severity;
    }

    if (metadata) {
      existing.metadata = { ...existing.metadata, ...metadata, lastUpdate: new Date().toISOString() };
    }

    const prevThreshold = ALERT_USER_THRESHOLDS.filter(t => t < existing.affectedUserCount).pop();
    const currThreshold = ALERT_USER_THRESHOLDS.filter(t => t <= existing.affectedUserCount).pop();
    if (currThreshold && currThreshold !== prevThreshold) {
      fireIncidentNotification(existing, "escalated").catch(() => {});
    }

    persistIncidentUpdate(existing).catch(() => {});

    emitStructuredLog(existing, "updated");

    return existing;
  }

  const incident: ProductionIncident = {
    incidentId: generateIncidentId(),
    category,
    severity,
    errorSignature: signature,
    title,
    message,
    firstOccurrence: Date.now(),
    lastOccurrence: Date.now(),
    affectedUserIds: userId ? [userId] : [],
    affectedUserCount: userId ? 1 : 0,
    occurrenceCount: 1,
    status: "active",
    resolutionNotes: null,
    resolvedAt: null,
    resolvedBy: null,
    acknowledgedAt: null,
    acknowledgedBy: null,
    metadata: metadata || {},
  };

  activeIncidents.set(incident.incidentId, incident);

  persistIncidentCreate(incident).catch(() => {});

  emitStructuredLog(incident, "created");

  if (severity === "critical" || severity === "warning") {
    fireIncidentNotification(incident, "created").catch(() => {});
  }

  return incident;
}

function severityRank(severity: IncidentSeverity): number {
  switch (severity) {
    case "critical": return 3;
    case "warning": return 2;
    case "info": return 1;
    default: return 0;
  }
}

function emitStructuredLog(incident: ProductionIncident, action: string): void {
  const logEntry = {
    level: incident.severity === "critical" ? "error" : incident.severity === "warning" ? "warn" : "info",
    service: "incident-monitor",
    action,
    incidentId: incident.incidentId,
    category: incident.category,
    severity: incident.severity,
    title: incident.title,
    message: incident.message,
    errorSignature: incident.errorSignature,
    affectedUserCount: incident.affectedUserCount,
    occurrenceCount: incident.occurrenceCount,
    status: incident.status,
    firstOccurrence: new Date(incident.firstOccurrence).toISOString(),
    lastOccurrence: new Date(incident.lastOccurrence).toISOString(),
    timestamp: new Date().toISOString(),
  };

  if (incident.severity === "critical") {
    console.error(`[IncidentMonitor] ${JSON.stringify(logEntry)}`);
  } else if (incident.severity === "warning") {
    console.warn(`[IncidentMonitor] ${JSON.stringify(logEntry)}`);
  } else {
    console.log(`[IncidentMonitor] ${JSON.stringify(logEntry)}`);
  }
}

async function fireIncidentNotification(incident: ProductionIncident, action: "created" | "escalated"): Promise<void> {
  try {
    const { evaluateAlert, recordEmailSent } = await import("./alert-coordinator");
    const decision = evaluateAlert(
      (incident.category as any) || "general",
      incident.severity as any,
      `${incident.title}: ${incident.message}`,
      incident.incidentId
    );

    if (!decision.shouldSendEmail) {
      console.log(`[IncidentMonitor] Notification suppressed (${decision.reason}): ${incident.title}`);
      return;
    }

    const { getNotificationSettings } = await import("./admin-notifications");
    const settings = await getNotificationSettings(pool);

    const shouldEmail =
      (incident.severity === "critical" && (settings as any).notifyOnCriticalIncident !== false) ||
      (incident.severity === "warning" && (settings as any).notifyOnWarningIncident === true);

    const shouldSms =
      incident.severity === "critical" && (settings as any).notifyOnCriticalIncident !== false;

    if (!shouldEmail && !shouldSms) return;

    const severityColor = incident.severity === "critical" ? "#dc2626" : "#d97706";
    const actionLabel = action === "created" ? "New Incident" : "Incident Escalated";
    const subject = `[${incident.severity.toUpperCase()}] ${actionLabel}: ${incident.title}`;
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <div style="background:${severityColor};padding:16px 20px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;color:white;font-size:16px;">NurseNest ${actionLabel}</h2>
        </div>
        <div style="padding:16px 20px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;">
          <p style="margin:4px 0;"><strong>Incident:</strong> ${incident.incidentId}</p>
          <p style="margin:4px 0;"><strong>Category:</strong> ${incident.category}</p>
          <p style="margin:4px 0;"><strong>Severity:</strong> ${incident.severity}</p>
          <p style="margin:4px 0;"><strong>Title:</strong> ${incident.title}</p>
          <p style="margin:4px 0;"><strong>Message:</strong> ${incident.message}</p>
          <p style="margin:4px 0;"><strong>Affected Users:</strong> ${incident.affectedUserCount}</p>
          <p style="margin:4px 0;"><strong>Occurrences:</strong> ${incident.occurrenceCount}</p>
          <p style="margin:4px 0;font-size:12px;color:#6b7280;">First seen: ${new Date(incident.firstOccurrence).toISOString()}</p>
        </div>
      </div>
    `;

    let emailSent = false;

    if (shouldEmail && settings.emailEnabled) {
      try {
        const { getResendClient } = await import("./resend-client");
        const { client, fromEmail } = await getResendClient();
        await client.emails.send({
          from: fromEmail || "NurseNest <noreply@nursenest.ca>",
          to: settings.adminEmail || "admin@nursenest.ca",
          subject,
          html,
        });
        emailSent = true;
      } catch (e: any) {
        console.error("[IncidentMonitor] Email notification failed:", e.message);
      }
    }

    if (shouldSms && settings.smsEnabled) {
      try {
        const { getTwilioClient, getTwilioFromPhoneNumber } = await import("./twilio-client");
        const twilioClient = await getTwilioClient();
        const fromNumber = await getTwilioFromPhoneNumber();
        await twilioClient.messages.create({
          body: `NurseNest ${actionLabel}: [${incident.severity.toUpperCase()}] ${incident.title} - ${incident.affectedUserCount} users affected (${incident.incidentId})`,
          to: settings.adminPhone,
          from: fromNumber,
        });
        emailSent = true;
      } catch (e: any) {
        console.error("[IncidentMonitor] SMS notification failed:", e.message);
      }
    }

    if (emailSent) {
      recordEmailSent(decision.incidentSignature);
    }
  } catch (e: any) {
    console.error("[IncidentMonitor] Notification dispatch failed:", e.message);
  }
}

async function persistIncidentCreate(incident: ProductionIncident): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO production_incidents (incident_id, category, severity, error_signature, title, message, first_occurrence, last_occurrence, affected_user_ids, affected_user_count, occurrence_count, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7::double precision / 1000), to_timestamp($8::double precision / 1000), $9, $10, $11, $12, $13)`,
      [
        incident.incidentId,
        incident.category,
        incident.severity,
        incident.errorSignature,
        incident.title,
        incident.message,
        incident.firstOccurrence,
        incident.lastOccurrence,
        JSON.stringify(incident.affectedUserIds),
        incident.affectedUserCount,
        incident.occurrenceCount,
        incident.status,
        JSON.stringify(incident.metadata),
      ]
    );
  } catch (e: any) {
    console.error("[IncidentMonitor] Failed to persist incident:", e.message);
  }
}

async function persistIncidentUpdate(incident: ProductionIncident): Promise<void> {
  try {
    await pool.query(
      `UPDATE production_incidents SET severity = $2, last_occurrence = to_timestamp($3::double precision / 1000), affected_user_ids = $4, affected_user_count = $5, occurrence_count = $6, status = $7, resolution_notes = $8, resolved_at = $9, resolved_by = $10, acknowledged_at = $11, acknowledged_by = $12, metadata = $13
       WHERE incident_id = $1`,
      [
        incident.incidentId,
        incident.severity,
        incident.lastOccurrence,
        JSON.stringify(incident.affectedUserIds),
        incident.affectedUserCount,
        incident.occurrenceCount,
        incident.status,
        incident.resolutionNotes,
        incident.resolvedAt ? new Date(incident.resolvedAt) : null,
        incident.resolvedBy,
        incident.acknowledgedAt ? new Date(incident.acknowledgedAt) : null,
        incident.acknowledgedBy,
        JSON.stringify(incident.metadata),
      ]
    );
  } catch (e: any) {
    console.error("[IncidentMonitor] Failed to update incident:", e.message);
  }
}

export function acknowledgeIncident(incidentId: string, actor: string): ProductionIncident | null {
  const incident = activeIncidents.get(incidentId);
  if (!incident) return null;
  incident.status = "acknowledged";
  incident.acknowledgedAt = Date.now();
  incident.acknowledgedBy = actor;
  persistIncidentUpdate(incident).catch(() => {});
  emitStructuredLog(incident, "acknowledged");
  return incident;
}

export function resolveIncident(incidentId: string, actor: string, notes?: string): ProductionIncident | null {
  const incident = activeIncidents.get(incidentId);
  if (!incident) return null;
  incident.status = "resolved";
  incident.resolvedAt = Date.now();
  incident.resolvedBy = actor;
  incident.resolutionNotes = notes || null;
  persistIncidentUpdate(incident).catch(() => {});
  emitStructuredLog(incident, "resolved");
  return incident;
}

export function getActiveIncidents(): ProductionIncident[] {
  return Array.from(activeIncidents.values())
    .filter(i => i.status !== "resolved")
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || b.lastOccurrence - a.lastOccurrence);
}

export function getAllIncidents(): ProductionIncident[] {
  return Array.from(activeIncidents.values())
    .sort((a, b) => b.lastOccurrence - a.lastOccurrence);
}

export function getIncident(incidentId: string): ProductionIncident | null {
  return activeIncidents.get(incidentId) || null;
}

export function getIncidentStats(): {
  totalActive: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  totalAffectedUsers: number;
} {
  let totalActive = 0, criticalCount = 0, warningCount = 0, infoCount = 0;
  let acknowledgedCount = 0, resolvedCount = 0;
  const allAffectedUsers = new Set<string>();

  for (const incident of activeIncidents.values()) {
    if (incident.status === "active") {
      totalActive++;
      if (incident.severity === "critical") criticalCount++;
      else if (incident.severity === "warning") warningCount++;
      else infoCount++;
    } else if (incident.status === "acknowledged") {
      acknowledgedCount++;
    } else {
      resolvedCount++;
    }
    for (const uid of incident.affectedUserIds) {
      allAffectedUsers.add(uid);
    }
  }

  return { totalActive, criticalCount, warningCount, infoCount, acknowledgedCount, resolvedCount, totalAffectedUsers: allAffectedUsers.size };
}

export async function loadIncidentsFromDb(): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT * FROM production_incidents WHERE status != 'resolved' OR last_occurrence > NOW() - INTERVAL '24 hours' ORDER BY last_occurrence DESC LIMIT 500`
    );
    for (const row of result.rows) {
      if (!activeIncidents.has(row.incident_id)) {
        let affectedUserIds: string[] = [];
        try {
          affectedUserIds = typeof row.affected_user_ids === "string" ? JSON.parse(row.affected_user_ids) : (row.affected_user_ids || []);
        } catch { affectedUserIds = []; }
        let metadata: Record<string, any> = {};
        try {
          metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : (row.metadata || {});
        } catch { metadata = {}; }

        activeIncidents.set(row.incident_id, {
          incidentId: row.incident_id,
          category: row.category,
          severity: row.severity,
          errorSignature: row.error_signature,
          title: row.title,
          message: row.message,
          firstOccurrence: new Date(row.first_occurrence).getTime(),
          lastOccurrence: new Date(row.last_occurrence).getTime(),
          affectedUserIds,
          affectedUserCount: row.affected_user_count || 0,
          occurrenceCount: row.occurrence_count || 1,
          status: row.status,
          resolutionNotes: row.resolution_notes,
          resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : null,
          resolvedBy: row.resolved_by,
          acknowledgedAt: row.acknowledged_at ? new Date(row.acknowledged_at).getTime() : null,
          acknowledgedBy: row.acknowledged_by,
          metadata,
        });
      }
    }
    console.log(`[IncidentMonitor] Loaded ${result.rows.length} incidents from database`);
  } catch (e: any) {
    console.warn("[IncidentMonitor] Could not load incidents from DB:", e.message);
  }
}
