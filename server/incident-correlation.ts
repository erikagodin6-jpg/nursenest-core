import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export interface CorrelatedChange {
  id: string;
  changeType: string;
  source: string;
  entityType: string | null;
  entityId: string | null;
  description: string;
  metadata: Record<string, any>;
  changedBy: string | null;
  createdAt: string;
  recencyScore: number;
  relevanceScore: number;
  confidenceScore: number;
}

const CHANGE_TYPE_RELEVANCE: Record<string, number> = {
  deploy: 0.95,
  emergency_mode: 0.95,
  kill_switch_change: 0.9,
  feature_flag_toggle: 0.85,
  circuit_breaker_trip: 0.85,
  feature_auto_disabled: 0.8,
  config_change: 0.75,
  content_publish: 0.6,
  schema_change: 0.7,
  admin_override: 0.7,
  entitlement_change: 0.65,
  billing_config_change: 0.6,
  resilience_event: 0.5,
};

export async function correlateChanges(
  incidentStartTime: Date,
  lookbackMinutes: number = 120,
  impactedFeatures?: string[]
): Promise<CorrelatedChange[]> {
  const lookbackTime = new Date(incidentStartTime.getTime() - lookbackMinutes * 60 * 1000);

  try {
    const result = await pool.query(
      `SELECT * FROM change_log
       WHERE created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC
       LIMIT 100`,
      [lookbackTime, incidentStartTime]
    );

    const changes: CorrelatedChange[] = result.rows.map((row: any) => {
      const minutesBefore = (incidentStartTime.getTime() - new Date(row.created_at).getTime()) / 60000;
      const recencyScore = Math.max(0, 1 - (minutesBefore / lookbackMinutes));

      const baseRelevance = CHANGE_TYPE_RELEVANCE[row.change_type] || 0.3;

      let featureBonus = 0;
      if (impactedFeatures && impactedFeatures.length > 0) {
        let parsedMeta: Record<string, any> = {};
        try {
          parsedMeta = typeof row.metadata === "string" ? JSON.parse(row.metadata) : (row.metadata || {});
        } catch { parsedMeta = {}; }
        const changeFeatures = [
          parsedMeta.feature,
          parsedMeta.route,
          parsedMeta.target,
          row.entity_type,
          row.source,
        ].filter(Boolean).map((f: string) => f.toLowerCase());

        for (const impacted of impactedFeatures) {
          if (changeFeatures.some((cf: string) => cf.includes(impacted.toLowerCase()) || impacted.toLowerCase().includes(cf))) {
            featureBonus = 0.15;
            break;
          }
        }
      }

      const relevanceScore = Math.min(1, baseRelevance + featureBonus);
      const confidenceScore = Math.round((recencyScore * 0.4 + relevanceScore * 0.6) * 100);

      let metadata: Record<string, any> = {};
      try {
        metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : (row.metadata || {});
      } catch { metadata = {}; }

      return {
        id: row.id,
        changeType: row.change_type,
        source: row.source,
        entityType: row.entity_type,
        entityId: row.entity_id,
        description: row.description,
        metadata,
        changedBy: row.changed_by,
        createdAt: new Date(row.created_at).toISOString(),
        recencyScore: Math.round(recencyScore * 100),
        relevanceScore: Math.round(relevanceScore * 100),
        confidenceScore,
      };
    });

    changes.sort((a, b) => b.confidenceScore - a.confidenceScore);

    return changes;
  } catch (e: any) {
    console.error("[Correlation] Failed to correlate changes:", e.message);
    return [];
  }
}

export async function logChange(params: {
  changeType: string;
  source: string;
  entityType?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  changedBy?: string;
}): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO change_log (change_type, source, entity_type, entity_id, description, metadata, changed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        params.changeType,
        params.source,
        params.entityType || null,
        params.entityId || null,
        params.description,
        JSON.stringify(params.metadata || {}),
        params.changedBy || null,
      ]
    );
  } catch (e: any) {
    console.error("[ChangeLog] Failed to log change:", e.message);
  }
}

export async function getRecentChanges(limitOrSince?: number): Promise<any[]> {
  if (limitOrSince !== undefined && limitOrSince > 1e10) {
    return getRecentChangesSince(limitOrSince);
  }
  const limit = limitOrSince || 50;
  try {
    const result = await pool.query(
      `SELECT * FROM change_log ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows.map(mapChangeRow);
  } catch {
    return [];
  }
}

function mapChangeRow(row: any) {
  let metadata: Record<string, any> = {};
  try {
    metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : (row.metadata || {});
  } catch { metadata = {}; }
  return {
    id: row.id,
    changeType: row.change_type,
    source: row.source,
    entityType: row.entity_type,
    entityId: row.entity_id,
    description: row.description,
    metadata,
    changedBy: row.changed_by,
    createdAt: new Date(row.created_at).toISOString(),
  };
}


interface ChangeEvent {
  id: string;
  type: "deploy" | "content_publish" | "feature_flag" | "kill_switch" | "config_change" | "admin_override" | "dependency_update" | "schema_change" | "billing_config";
  source: string;
  description: string;
  entityId: string | null;
  actor: string | null;
  metadata: Record<string, any>;
  timestamp: number;
}

interface CorrelationResult {
  changeEvent: ChangeEvent;
  confidence: number;
  reason: string;
}

interface IncidentDetail {
  id: number;
  userId: string | null;
  examType: string;
  tier: string;
  reasonCode: string;
  reasonDetail: string;
  endpoint: string;
  requestParams: any;
  severity: string;
  resolvedAt: string | null;
  createdAt: string;
  profession: string | null;
  route: string | null;
  fallbackMode: boolean;
  correlations: CorrelationResult[];
  affectedUsersEstimate: number;
  actionsHistory: ActionEntry[];
  recommendedActions: string[];
}

interface ActionEntry {
  action: string;
  actor: string | null;
  timestamp: number;
  details: string;
}

interface WeeklyReportData {
  reportId: string;
  generatedAt: string;
  weekStart: string;
  weekEnd: string;
  incidents: {
    total: number;
    critical: number;
    warning: number;
    info: number;
    topReasonCodes: { code: string; count: number }[];
  };
  fallbackActivations: number;
  rollbackEvents: number;
  quarantinedContent: number;
  circuitBreakerTrips: number;
  featureFlagChanges: number;
  killSwitchActivations: number;
  emergencyModeActivations: number;
  topFailingRoutes: { route: string; count: number }[];
  affectedUsersCount: number;
  healthSummary: { service: string; uptimePercent: number; avgLatencyMs: number }[];
  openRisks: string[];
  recommendedPriorities: string[];
}

const changeEvents: ChangeEvent[] = [];
const MAX_CHANGE_EVENTS = 1000;
const weeklyReports: WeeklyReportData[] = [];
const MAX_REPORTS = 52;

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function trackChange(event: Omit<ChangeEvent, "id" | "timestamp">): void {
  const entry: ChangeEvent = {
    ...event,
    id: genId(),
    timestamp: Date.now(),
  };
  changeEvents.unshift(entry);
  if (changeEvents.length > MAX_CHANGE_EVENTS) {
    changeEvents.length = MAX_CHANGE_EVENTS;
  }
  persistChangeEvent(entry).catch(() => {});
}

async function persistChangeEvent(event: ChangeEvent): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO change_tracking_events (id, type, source, description, entity_id, actor, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, to_timestamp($8::double precision / 1000))`,
      [event.id, event.type, event.source, event.description, event.entityId, event.actor, JSON.stringify(event.metadata), event.timestamp]
    );
  } catch {}
}

async function ensureCorrelationTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS change_tracking_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        source TEXT NOT NULL,
        description TEXT,
        entity_id TEXT,
        actor TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_change_events_created ON change_tracking_events(created_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_change_events_type ON change_tracking_events(type)`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS weekly_resilience_reports (
        id TEXT PRIMARY KEY,
        report_data JSONB NOT NULL,
        week_start DATE NOT NULL,
        week_end DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS incident_actions (
        id SERIAL PRIMARY KEY,
        incident_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        actor TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_incident_actions_incident ON incident_actions(incident_id)`);
  } catch {}
}

function correlateIncident(incident: any, changes: ChangeEvent[]): CorrelationResult[] {
  const incidentTime = new Date(incident.created_at || incident.createdAt).getTime();
  const correlations: CorrelationResult[] = [];

  for (const change of changes) {
    const timeDiff = incidentTime - change.timestamp;
    if (timeDiff < 0 || timeDiff > 3600000) continue;

    let confidence = 0;
    let reason = "";

    const minutesAgo = Math.round(timeDiff / 60000);
    const timeProximityScore = Math.max(0, 1 - timeDiff / 3600000);

    if (change.type === "deploy") {
      confidence = Math.round(70 * timeProximityScore + 15);
      reason = `Deploy "${change.description}" occurred ${minutesAgo}m before incident`;
    } else if (change.type === "content_publish") {
      const sameContent = incident.exam_type === change.metadata?.contentType ||
        incident.endpoint?.includes(change.entityId || "___never___");
      confidence = sameContent
        ? Math.round(65 * timeProximityScore + 20)
        : Math.round(40 * timeProximityScore + 5);
      reason = `Content publish "${change.description}" ${minutesAgo}m before${sameContent ? " (same content type)" : ""}`;
    } else if (change.type === "feature_flag") {
      const flagRelated = incident.reason_code?.includes("feature") ||
        incident.endpoint?.includes(change.entityId || "___never___");
      confidence = flagRelated
        ? Math.round(75 * timeProximityScore + 15)
        : Math.round(35 * timeProximityScore + 5);
      reason = `Feature flag "${change.entityId}" changed ${minutesAgo}m before${flagRelated ? " (related feature)" : ""}`;
    } else if (change.type === "kill_switch") {
      confidence = Math.round(60 * timeProximityScore + 20);
      reason = `Kill switch "${change.entityId}" toggled ${minutesAgo}m before`;
    } else if (change.type === "config_change") {
      confidence = Math.round(50 * timeProximityScore + 10);
      reason = `Config change "${change.description}" ${minutesAgo}m before`;
    } else if (change.type === "admin_override") {
      confidence = Math.round(55 * timeProximityScore + 15);
      reason = `Admin override by ${change.actor || "unknown"} ${minutesAgo}m before`;
    } else if (change.type === "billing_config") {
      const paymentRelated = incident.reason_code?.includes("payment") ||
        incident.reason_code?.includes("stripe") ||
        incident.endpoint?.includes("stripe") ||
        incident.endpoint?.includes("payment");
      confidence = paymentRelated
        ? Math.round(80 * timeProximityScore + 10)
        : Math.round(25 * timeProximityScore + 5);
      reason = `Billing config change ${minutesAgo}m before${paymentRelated ? " (payment-related incident)" : ""}`;
    } else if (change.type === "schema_change") {
      confidence = Math.round(60 * timeProximityScore + 15);
      reason = `Schema/version change "${change.description}" ${minutesAgo}m before`;
    } else if (change.type === "dependency_update") {
      confidence = Math.round(45 * timeProximityScore + 10);
      reason = `Dependency update "${change.description}" ${minutesAgo}m before`;
    }

    if (confidence >= 10) {
      correlations.push({ changeEvent: change, confidence: Math.min(confidence, 99), reason });
    }
  }

  correlations.sort((a, b) => b.confidence - a.confidence);
  return correlations.slice(0, 10);
}

async function getRecentChangesSince(since: number): Promise<ChangeEvent[]> {
  const memoryChanges = changeEvents.filter(e => e.timestamp >= since);
  try {
    const dbResult = await pool.query(
      `SELECT * FROM change_tracking_events WHERE created_at >= to_timestamp($1::double precision / 1000) ORDER BY created_at DESC LIMIT 200`,
      [since]
    );
    const dbChanges: ChangeEvent[] = dbResult.rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      source: r.source,
      description: r.description,
      entityId: r.entity_id,
      actor: r.actor,
      metadata: r.metadata || {},
      timestamp: new Date(r.created_at).getTime(),
    }));
    const ids = new Set(memoryChanges.map(e => e.id));
    for (const c of dbChanges) {
      if (!ids.has(c.id)) memoryChanges.push(c);
    }
  } catch {}
  return memoryChanges.sort((a, b) => b.timestamp - a.timestamp);
}

async function getIncidentActions(incidentId: number): Promise<ActionEntry[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM incident_actions WHERE incident_id = $1 ORDER BY created_at DESC`,
      [incidentId]
    );
    return result.rows.map((r: any) => ({
      action: r.action,
      actor: r.actor,
      timestamp: new Date(r.created_at).getTime(),
      details: r.details,
    }));
  } catch {
    return [];
  }
}

function getRecommendedActions(incident: any): string[] {
  const actions: string[] = [];
  const severity = incident.severity;
  const reasonCode = incident.reason_code || "";

  if (severity === "critical") {
    actions.push("Verify all critical services are operational via health checks");
    actions.push("Check if emergency mode should be activated");
  }

  if (reasonCode.includes("exam_load")) {
    actions.push("Check exam question pool inventory for affected tier");
    actions.push("Verify backup exam payloads are available");
  }

  if (reasonCode.includes("payment") || reasonCode.includes("stripe")) {
    actions.push("Verify Stripe API connectivity and webhook status");
    actions.push("Check for recent billing configuration changes");
  }

  if (reasonCode.includes("crash") || reasonCode.includes("error")) {
    actions.push("Review server error logs for stack traces");
    actions.push("Check circuit breaker status for related services");
  }

  if (incident.fallback_mode) {
    actions.push("Monitor fallback content delivery quality");
    actions.push("Plan restoration of primary service");
  }

  if (!incident.resolved_at) {
    actions.push("Mark incident as resolved when root cause is addressed");
  }

  if (actions.length === 0) {
    actions.push("Review incident details and monitor for recurrence");
  }

  return actions;
}

async function estimateAffectedUsers(incident: any): Promise<number> {
  try {
    const incidentTime = new Date(incident.created_at).getTime();
    const windowMs = 30 * 60 * 1000;
    const result = await pool.query(
      `SELECT COUNT(DISTINCT user_id)::int AS cnt FROM exam_incidents
       WHERE created_at >= to_timestamp($1::double precision / 1000)
       AND created_at <= to_timestamp($2::double precision / 1000)
       AND user_id IS NOT NULL
       AND (endpoint = $3 OR reason_code = $4)`,
      [incidentTime - windowMs, incidentTime + windowMs, incident.endpoint, incident.reason_code]
    );
    return Math.max(result.rows[0]?.cnt || 0, incident.user_id ? 1 : 0);
  } catch {
    return incident.user_id ? 1 : 0;
  }
}

async function generateWeeklyReport(): Promise<WeeklyReportData> {
  const now = new Date();
  const weekEnd = new Date(now);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  const reportId = `report-${weekStart.toISOString().split("T")[0]}-${genId()}`;
  const startTs = weekStart.getTime();
  const endTs = weekEnd.getTime();

  let incidentStats = { total: 0, critical: 0, warning: 0, info: 0, topReasonCodes: [] as { code: string; count: number }[] };
  let topFailingRoutes: { route: string; count: number }[] = [];
  let affectedUsersCount = 0;

  try {
    const incResult = await pool.query(
      `SELECT severity, COUNT(*)::int AS cnt FROM exam_incidents
       WHERE created_at >= $1 AND created_at <= $2
       GROUP BY severity`,
      [weekStart, weekEnd]
    );
    for (const row of incResult.rows) {
      const cnt = row.cnt || 0;
      incidentStats.total += cnt;
      if (row.severity === "critical") incidentStats.critical = cnt;
      else if (row.severity === "warning") incidentStats.warning = cnt;
      else incidentStats.info = cnt;
    }

    const reasonResult = await pool.query(
      `SELECT reason_code, COUNT(*)::int AS cnt FROM exam_incidents
       WHERE created_at >= $1 AND created_at <= $2
       GROUP BY reason_code ORDER BY cnt DESC LIMIT 10`,
      [weekStart, weekEnd]
    );
    incidentStats.topReasonCodes = reasonResult.rows.map((r: any) => ({ code: r.reason_code, count: r.cnt }));

    const routeResult = await pool.query(
      `SELECT endpoint, COUNT(*)::int AS cnt FROM exam_incidents
       WHERE created_at >= $1 AND created_at <= $2 AND endpoint IS NOT NULL
       GROUP BY endpoint ORDER BY cnt DESC LIMIT 10`,
      [weekStart, weekEnd]
    );
    topFailingRoutes = routeResult.rows.map((r: any) => ({ route: r.endpoint, count: r.cnt }));

    const userResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id)::int AS cnt FROM exam_incidents
       WHERE created_at >= $1 AND created_at <= $2 AND user_id IS NOT NULL`,
      [weekStart, weekEnd]
    );
    affectedUsersCount = userResult.rows[0]?.cnt || 0;
  } catch {}

  let quarantinedContent = 0;
  try {
    const qResult = await pool.query(`SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE quarantined_at IS NOT NULL`);
    quarantinedContent = qResult.rows[0]?.cnt || 0;
  } catch {}

  let fallbackActivations = 0;
  let rollbackEvents = 0;
  let circuitBreakerTrips = 0;
  let featureFlagChanges = 0;
  let killSwitchActivations = 0;
  let emergencyModeActivations = 0;

  try {
    const changes = await getRecentChangesSince(startTs);
    for (const c of changes) {
      if (c.timestamp > endTs) continue;
      if (c.type === "feature_flag") featureFlagChanges++;
      if (c.type === "kill_switch") killSwitchActivations++;
    }
  } catch {}

  try {
    const { getResilienceEvents } = await import("./platform-resilience");
    const events = getResilienceEvents(500);
    for (const e of events) {
      if (e.timestamp < startTs || e.timestamp > endTs) continue;
      if (e.type === "circuit_breaker_trip") circuitBreakerTrips++;
      if (e.type === "emergency_mode_activated") emergencyModeActivations++;
    }
  } catch {}

  try {
    const fbResult = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM exam_incidents
       WHERE created_at >= $1 AND created_at <= $2 AND fallback_mode = true`,
      [weekStart, weekEnd]
    );
    fallbackActivations = fbResult.rows[0]?.cnt || 0;
  } catch {}

  try {
    const rollbackResult = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM audit_logs
       WHERE created_at >= $1 AND created_at <= $2
       AND (action ILIKE '%rollback%' OR action ILIKE '%revert%' OR action ILIKE '%restore%')`,
      [weekStart, weekEnd]
    );
    rollbackEvents = rollbackResult.rows[0]?.cnt || 0;
  } catch {}

  const openRisks: string[] = [];

  try {
    const backupResult = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM platform_health_checks
       WHERE checked_at >= $1 AND checked_at <= $2 AND status = 'down'`,
      [weekStart, weekEnd]
    );
    const downChecks = backupResult.rows[0]?.cnt || 0;
    if (downChecks > 10) openRisks.push(`${downChecks} service health check failures detected this week`);
  } catch {}

  let healthSummary: { service: string; uptimePercent: number; avgLatencyMs: number }[] = [];
  try {
    const healthResult = await pool.query(
      `SELECT service,
              ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'healthy') / GREATEST(COUNT(*), 1), 1) AS uptime_pct,
              ROUND(AVG(latency_ms)) AS avg_latency
       FROM platform_health_checks
       WHERE checked_at >= $1 AND checked_at <= $2
       GROUP BY service
       ORDER BY uptime_pct ASC`,
      [weekStart, weekEnd]
    );
    healthSummary = healthResult.rows.map((r: any) => ({
      service: r.service,
      uptimePercent: parseFloat(r.uptime_pct) || 100,
      avgLatencyMs: parseInt(r.avg_latency) || 0,
    }));
  } catch {}

  if (incidentStats.critical > 0) openRisks.push(`${incidentStats.critical} critical incidents this week`);
  if (quarantinedContent > 5) openRisks.push(`${quarantinedContent} quarantined content items need review`);
  if (circuitBreakerTrips > 3) openRisks.push(`${circuitBreakerTrips} circuit breaker trips indicate service instability`);
  if (emergencyModeActivations > 0) openRisks.push(`${emergencyModeActivations} emergency mode activations this week`);
  const lowUptimeServices = healthSummary.filter(h => h.uptimePercent < 95);
  for (const s of lowUptimeServices) {
    openRisks.push(`${s.service} uptime at ${s.uptimePercent}% (below 95% threshold)`);
  }

  const recommendedPriorities: string[] = [];
  if (incidentStats.critical > 0) recommendedPriorities.push("Investigate and address root causes of critical incidents");
  if (quarantinedContent > 0) recommendedPriorities.push("Review and process quarantined content items");
  if (circuitBreakerTrips > 0) recommendedPriorities.push("Investigate services with frequent circuit breaker trips");
  if (lowUptimeServices.length > 0) recommendedPriorities.push(`Improve reliability of: ${lowUptimeServices.map(s => s.service).join(", ")}`);
  if (topFailingRoutes.length > 0) recommendedPriorities.push(`Address top failing route: ${topFailingRoutes[0]?.route}`);
  if (recommendedPriorities.length === 0) recommendedPriorities.push("System operating within normal parameters - continue monitoring");

  const report: WeeklyReportData = {
    reportId,
    generatedAt: now.toISOString(),
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    incidents: incidentStats,
    fallbackActivations,
    rollbackEvents,
    quarantinedContent,
    circuitBreakerTrips,
    featureFlagChanges,
    killSwitchActivations,
    emergencyModeActivations,
    topFailingRoutes,
    affectedUsersCount,
    healthSummary,
    openRisks,
    recommendedPriorities,
  };

  weeklyReports.unshift(report);
  if (weeklyReports.length > MAX_REPORTS) weeklyReports.length = MAX_REPORTS;

  try {
    await pool.query(
      `INSERT INTO weekly_resilience_reports (id, report_data, week_start, week_end)
       VALUES ($1, $2, $3, $4)`,
      [reportId, JSON.stringify(report), weekStart, weekEnd]
    );
  } catch {}

  return report;
}

export function registerIncidentCorrelationRoutes(app: Express): void {
  ensureCorrelationTables().catch(() => {});

  app.get("/api/admin/incidents/:id", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid incident ID" });

      const result = await pool.query(`SELECT * FROM exam_incidents WHERE id = $1`, [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Incident not found" });

      const incident = result.rows[0];
      const incidentTime = new Date(incident.created_at).getTime();
      const changes = await getRecentChangesSince(incidentTime - 3600000);
      const correlations = correlateIncident(incident, changes);
      const actions = await getIncidentActions(id);
      const affectedUsersEstimate = await estimateAffectedUsers(incident);
      const recommendedActions = getRecommendedActions(incident);

      const detail: IncidentDetail = {
        id: incident.id,
        userId: incident.user_id,
        examType: incident.exam_type,
        tier: incident.tier,
        reasonCode: incident.reason_code,
        reasonDetail: incident.reason_detail,
        endpoint: incident.endpoint,
        requestParams: incident.request_params,
        severity: incident.severity,
        resolvedAt: incident.resolved_at,
        createdAt: incident.created_at,
        profession: incident.profession,
        route: incident.route,
        fallbackMode: incident.fallback_mode || false,
        correlations,
        affectedUsersEstimate,
        actionsHistory: actions,
        recommendedActions,
      };

      res.json(detail);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incidents/:id/resolve", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid incident ID" });

      await pool.query(`UPDATE exam_incidents SET resolved_at = NOW() WHERE id = $1`, [id]);
      await pool.query(
        `INSERT INTO incident_actions (incident_id, action, actor, details) VALUES ($1, $2, $3, $4)`,
        [id, "resolved", admin.username || admin.id, req.body?.notes || "Marked as resolved"]
      );

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incidents/:id/action", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid incident ID" });

      const { action, details } = req.body || {};
      if (!action) return res.status(400).json({ error: "Action is required" });

      await pool.query(
        `INSERT INTO incident_actions (incident_id, action, actor, details) VALUES ($1, $2, $3, $4)`,
        [id, action, admin.username || admin.id, details || ""]
      );

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/incidents/:id/correlations", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid incident ID" });

      const result = await pool.query(`SELECT * FROM exam_incidents WHERE id = $1`, [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Incident not found" });

      const incident = result.rows[0];
      const incidentTime = new Date(incident.created_at).getTime();
      const changes = await getRecentChangesSince(incidentTime - 3600000);
      const correlations = correlateIncident(incident, changes);

      res.json({ correlations });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/change-events", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const since = parseInt(req.query.since as string) || Date.now() - 24 * 60 * 60 * 1000;
      const changes = await getRecentChangesSince(since);
      res.json({ changes });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/change-events", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { type, source, description, entityId, metadata } = req.body || {};
      if (!type || !source) return res.status(400).json({ error: "type and source are required" });

      trackChange({
        type,
        source,
        description: description || "",
        entityId: entityId || null,
        actor: admin.username || admin.id,
        metadata: metadata || {},
      });

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/resilience-report/generate", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const report = await generateWeeklyReport();
      res.json(report);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/resilience-report/latest", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (weeklyReports.length > 0) {
        return res.json(weeklyReports[0]);
      }

      try {
        const dbResult = await pool.query(
          `SELECT report_data FROM weekly_resilience_reports ORDER BY created_at DESC LIMIT 1`
        );
        if (dbResult.rows.length > 0) {
          return res.json(dbResult.rows[0].report_data);
        }
      } catch {}

      const report = await generateWeeklyReport();
      res.json(report);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/resilience-report/history", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      try {
        const dbResult = await pool.query(
          `SELECT id, week_start, week_end, created_at, report_data FROM weekly_resilience_reports ORDER BY created_at DESC LIMIT 52`
        );
        return res.json({
          reports: dbResult.rows.map((r: any) => ({
            id: r.id,
            weekStart: r.week_start,
            weekEnd: r.week_end,
            generatedAt: r.created_at,
            summary: {
              totalIncidents: r.report_data?.incidents?.total || 0,
              criticalIncidents: r.report_data?.incidents?.critical || 0,
              affectedUsers: r.report_data?.affectedUsersCount || 0,
              openRisks: r.report_data?.openRisks?.length || 0,
            },
          })),
        });
      } catch {
        return res.json({
          reports: weeklyReports.map(r => ({
            id: r.reportId,
            weekStart: r.weekStart,
            weekEnd: r.weekEnd,
            generatedAt: r.generatedAt,
            summary: {
              totalIncidents: r.incidents.total,
              criticalIncidents: r.incidents.critical,
              affectedUsers: r.affectedUsersCount,
              openRisks: r.openRisks.length,
            },
          })),
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/resilience-report/:id", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const reportId = req.params.id;
      const memReport = weeklyReports.find(r => r.reportId === reportId);
      if (memReport) return res.json(memReport);

      try {
        const dbResult = await pool.query(
          `SELECT report_data FROM weekly_resilience_reports WHERE id = $1`,
          [reportId]
        );
        if (dbResult.rows.length > 0) return res.json(dbResult.rows[0].report_data);
      } catch {}

      res.status(404).json({ error: "Report not found" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
