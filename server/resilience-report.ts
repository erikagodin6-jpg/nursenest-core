import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  getResilienceEvents,
  getCircuitBreakerStates,
  getErrorBudgets,
  getEmergencyModeStatus,
  getLastHealthResults,
} from "./platform-resilience";
import { getVipStatus } from "./vip-prioritization";

interface ResilienceReportSection {
  title: string;
  items: any[];
  count: number;
  summary: string;
}

interface WeeklyResilienceReport {
  reportId: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  sections: {
    incidents: ResilienceReportSection;
    fallbackActivations: ResilienceReportSection;
    rollbackEvents: ResilienceReportSection;
    quarantinedContent: ResilienceReportSection;
    lowHealthContent: ResilienceReportSection;
    entitlementAnomalies: ResilienceReportSection;
    paymentSyncIssues: ResilienceReportSection;
    topFailingRoutes: ResilienceReportSection;
    rescueActions: ResilienceReportSection;
    openRisks: ResilienceReportSection;
  };
  affectedUsersCount: number;
  overallRiskLevel: "low" | "moderate" | "high" | "critical";
  recommendedPriorities: string[];
}

function getWeekBounds(weeksAgo: number = 0): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

async function getIncidents(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT id, exam_type, tier, reason_code, reason_detail, severity, endpoint, created_at
       FROM exam_incidents WHERE created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC LIMIT 200`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  try {
    const r = await pool.query(
      `SELECT id, severity, category, title, message, source, created_at
       FROM platform_alerts WHERE created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC LIMIT 200`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows.map((a: any) => ({
      ...a,
      reason_code: a.category,
      reason_detail: a.message,
      exam_type: a.source,
    })));
  } catch {}

  const critical = items.filter(i => i.severity === "critical").length;
  const warning = items.filter(i => i.severity === "warning").length;

  return {
    title: "Incidents This Week",
    items,
    count: items.length,
    summary: `${items.length} total incidents (${critical} critical, ${warning} warnings)`,
  };
}

async function getFallbackActivations(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT id, user_id, product_type, product_id, has_access, access_source, provisional, decision_reason, created_at
       FROM entitlement_decisions WHERE provisional = true AND created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC LIMIT 200`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  const events = getResilienceEvents(500).filter(e =>
    e.timestamp >= start.getTime() && e.timestamp <= end.getTime() &&
    (e.type === "circuit_breaker_trip" || e.type === "feature_auto_disabled" || e.type === "feature_auto_throttled")
  );
  items.push(...events.map(e => ({ type: e.type, source: e.source, timestamp: new Date(e.timestamp).toISOString(), data: e.data })));

  return {
    title: "Fallback Activations",
    items,
    count: items.length,
    summary: `${items.length} fallback/provisional access events`,
  };
}

async function getRollbackEvents(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT id, action, reason, actor, auto_triggered, created_at
       FROM platform_emergency_log WHERE created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  try {
    const r = await pool.query(
      `SELECT id, actor_id, action, entity_type, entity_id, created_at
       FROM audit_logs WHERE action IN ('rollback', 'content_rollback', 'emergency_mode_activate', 'emergency_mode_deactivate', 'release_gate_override')
       AND created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC LIMIT 100`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  return {
    title: "Rollback Events",
    items,
    count: items.length,
    summary: `${items.length} rollback/emergency events this week`,
  };
}

async function getQuarantinedContent(): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT id, tier, stem, quarantine_reason, quarantined_at FROM exam_questions
       WHERE quarantined_at IS NOT NULL ORDER BY quarantined_at DESC LIMIT 100`
    );
    items.push(...r.rows.map((q: any) => ({
      type: "exam_question",
      id: q.id,
      tier: q.tier,
      reason: q.quarantine_reason,
      quarantinedAt: q.quarantined_at,
      preview: (q.stem || "").substring(0, 80),
    })));
  } catch {}

  return {
    title: "Quarantined Content",
    items,
    count: items.length,
    summary: `${items.length} quarantined items currently`,
  };
}

async function getLowHealthContent(): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const { scoreExamQuestion, scoreLesson } = await import("./content-health-score");

    const questions = await pool.query(
      `SELECT id, stem, options, correct_answer, tier, body_system, topic, rationale, status, tags, difficulty, cognitive_level, quarantined_at, quarantine_reason
       FROM exam_questions WHERE status = 'published' ORDER BY id LIMIT 200`
    );
    for (const q of questions.rows) {
      const score = scoreExamQuestion(q);
      if (score.overallScore < 50) {
        items.push({ type: "exam_question", id: q.id, title: score.title, score: score.overallScore, tier: q.tier });
      }
    }

    const lessons = await pool.query("SELECT * FROM lessons WHERE status = 'published' ORDER BY id LIMIT 200");
    for (const l of lessons.rows) {
      const score = scoreLesson(l);
      if (score.overallScore < 50) {
        items.push({ type: "lesson", id: l.id, title: score.title, score: score.overallScore, tier: l.tier });
      }
    }
  } catch {}

  items.sort((a, b) => a.score - b.score);

  return {
    title: "Low Health Content",
    items: items.slice(0, 50),
    count: items.length,
    summary: `${items.length} content items with health score below 50`,
  };
}

async function getEntitlementAnomalies(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT decision_reason, COUNT(*)::int AS cnt
       FROM entitlement_decisions
       WHERE created_at >= $1 AND created_at <= $2
       AND (provisional = true OR decision_reason IN ('database_unavailable', 'emergency_mode_override', 'provisional_grace_window'))
       GROUP BY decision_reason ORDER BY cnt DESC`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  const total = items.reduce((sum, i) => sum + (i.cnt || 0), 0);
  return {
    title: "Entitlement Anomalies",
    items,
    count: total,
    summary: `${total} anomalous entitlement decisions`,
  };
}

async function getPaymentSyncIssues(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT u.id, u.email, u.tier, u.stripe_customer_id, u.subscription_status
       FROM users u
       WHERE u.tier != 'free' AND u.tier != 'admin' AND u.tier IS NOT NULL
       AND (u.subscription_status IS NULL OR u.subscription_status NOT IN ('active', 'trialing'))
       AND u.created_at <= $1
       LIMIT 50`,
      [end.toISOString()]
    );
    items.push(...r.rows.map((u: any) => ({
      userId: u.id,
      email: u.email,
      tier: u.tier,
      subscriptionStatus: u.subscription_status,
      hasStripeId: !!u.stripe_customer_id,
    })));
  } catch {}

  return {
    title: "Payment Sync Issues",
    items,
    count: items.length,
    summary: `${items.length} users with tier/subscription mismatches`,
  };
}

async function getTopFailingRoutes(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT endpoint, COUNT(*)::int AS cnt, reason_code
       FROM exam_incidents WHERE created_at >= $1 AND created_at <= $2
       GROUP BY endpoint, reason_code ORDER BY cnt DESC LIMIT 20`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  return {
    title: "Top Failing Routes",
    items,
    count: items.length,
    summary: items.length > 0 ? `Top failing: ${items[0]?.endpoint || "unknown"} (${items[0]?.cnt || 0} failures)` : "No route failures recorded",
  };
}

async function getRescueActions(start: Date, end: Date): Promise<ResilienceReportSection> {
  const items: any[] = [];
  try {
    const r = await pool.query(
      `SELECT id, actor_id, actor_username, action, entity_type, entity_id, created_at
       FROM audit_logs
       WHERE action IN ('provisional_access_grant', 'entitlement_cache_clear', 'circuit_breaker_reset', 'error_budget_reset', 'feature_flag_toggle', 'kill_switch_activate', 'kill_switch_deactivate', 'release_gate_override')
       AND created_at >= $1 AND created_at <= $2
       ORDER BY created_at DESC LIMIT 100`,
      [start.toISOString(), end.toISOString()]
    );
    items.push(...r.rows);
  } catch {}

  return {
    title: "Rescue Actions Taken",
    items,
    count: items.length,
    summary: `${items.length} manual interventions this week`,
  };
}

function computeOpenRisks(sections: any): ResilienceReportSection {
  const risks: string[] = [];

  if (sections.incidents.count > 20) risks.push(`High incident volume: ${sections.incidents.count} incidents this week`);
  if (sections.quarantinedContent.count > 10) risks.push(`${sections.quarantinedContent.count} quarantined content items need review`);
  if (sections.lowHealthContent.count > 20) risks.push(`${sections.lowHealthContent.count} content items with low health scores`);
  if (sections.entitlementAnomalies.count > 5) risks.push(`${sections.entitlementAnomalies.count} entitlement anomalies detected`);
  if (sections.paymentSyncIssues.count > 0) risks.push(`${sections.paymentSyncIssues.count} payment sync issues`);

  const cbStates = getCircuitBreakerStates();
  const openBreakers = cbStates.filter(cb => cb.state === "open");
  if (openBreakers.length > 0) risks.push(`${openBreakers.length} circuit breakers currently open`);

  const errorBudgets = getErrorBudgets();
  const exhausted = errorBudgets.filter(b => b.escalationLevel === "exhausted" || b.escalationLevel === "critical");
  if (exhausted.length > 0) risks.push(`${exhausted.length} error budgets at critical/exhausted levels`);

  const emergencyMode = getEmergencyModeStatus();
  if (emergencyMode.active) risks.push("Emergency mode is currently active");

  return {
    title: "Open Risks",
    items: risks.map(r => ({ risk: r })),
    count: risks.length,
    summary: risks.length > 0 ? `${risks.length} open risks identified` : "No significant risks identified",
  };
}

function computeRecommendations(sections: any): string[] {
  const recs: string[] = [];

  if (sections.quarantinedContent.count > 0) recs.push("Review and resolve quarantined content items");
  if (sections.lowHealthContent.count > 10) recs.push("Prioritize improving low-health content (below 50 score)");
  if (sections.paymentSyncIssues.count > 0) recs.push("Audit payment/subscription sync for mismatched users");
  if (sections.entitlementAnomalies.count > 5) recs.push("Investigate entitlement anomalies - provisional access may indicate DB issues");
  if (sections.incidents.count > 20) recs.push("Review incident patterns and consider adding circuit breakers");
  if (sections.topFailingRoutes.items.length > 0) recs.push(`Fix top failing route: ${sections.topFailingRoutes.items[0]?.endpoint || "unknown"}`);
  if (sections.rollbackEvents.count > 0) recs.push("Review rollback events and prevent recurrence");

  if (recs.length === 0) recs.push("No immediate actions required - continue monitoring");

  return recs;
}

function computeRiskLevel(sections: any): "low" | "moderate" | "high" | "critical" {
  const emergencyMode = getEmergencyModeStatus();
  if (emergencyMode.active) return "critical";

  const criticalIncidents = sections.incidents.items.filter((i: any) => i.severity === "critical").length;
  if (criticalIncidents > 5) return "critical";
  if (criticalIncidents > 0 || sections.incidents.count > 30) return "high";
  if (sections.incidents.count > 10 || sections.paymentSyncIssues.count > 5) return "moderate";
  return "low";
}

async function generateReport(weeksAgo: number = 0): Promise<WeeklyResilienceReport> {
  const { start, end } = getWeekBounds(weeksAgo);

  const [incidents, fallbacks, rollbacks, quarantined, lowHealth, entitlementAnomalies, paymentIssues, failingRoutes, rescueActions] = await Promise.all([
    getIncidents(start, end),
    getFallbackActivations(start, end),
    getRollbackEvents(start, end),
    getQuarantinedContent(),
    getLowHealthContent(),
    getEntitlementAnomalies(start, end),
    getPaymentSyncIssues(start, end),
    getTopFailingRoutes(start, end),
    getRescueActions(start, end),
  ]);

  const sections = {
    incidents,
    fallbackActivations: fallbacks,
    rollbackEvents: rollbacks,
    quarantinedContent: quarantined,
    lowHealthContent: lowHealth,
    entitlementAnomalies,
    paymentSyncIssues: paymentIssues,
    topFailingRoutes: failingRoutes,
    rescueActions,
    openRisks: computeOpenRisks({ incidents, quarantinedContent: quarantined, lowHealthContent: lowHealth, entitlementAnomalies, paymentSyncIssues: paymentIssues }),
  };

  let affectedUsersCount = 0;
  try {
    const r = await pool.query(
      `SELECT COUNT(DISTINCT user_id)::int AS cnt FROM exam_incidents WHERE created_at >= $1 AND created_at <= $2 AND user_id IS NOT NULL`,
      [start.toISOString(), end.toISOString()]
    );
    affectedUsersCount = r.rows[0]?.cnt || 0;
  } catch {}

  return {
    reportId: `resilience-${start.toISOString().slice(0, 10)}`,
    weekStart: start.toISOString(),
    weekEnd: end.toISOString(),
    generatedAt: new Date().toISOString(),
    sections,
    affectedUsersCount,
    overallRiskLevel: computeRiskLevel(sections),
    recommendedPriorities: computeRecommendations(sections),
  };
}

export function registerResilienceReportRoutes(app: Express): void {
  app.get("/api/admin/resilience-report", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const weeksAgo = Math.max(0, Math.min(52, parseInt(req.query.weeksAgo as string) || 0));
      const report = await generateReport(weeksAgo);
      res.json(report);
    } catch (err: any) {
      console.error("[ResilienceReport] Error:", err.message);
      res.status(500).json({ error: "Failed to generate resilience report", detail: err.message });
    }
  });

  app.get("/api/admin/resilience-report/summary", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const report = await generateReport(0);
      res.json({
        reportId: report.reportId,
        weekStart: report.weekStart,
        weekEnd: report.weekEnd,
        overallRiskLevel: report.overallRiskLevel,
        affectedUsersCount: report.affectedUsersCount,
        incidentCount: report.sections.incidents.count,
        fallbackCount: report.sections.fallbackActivations.count,
        quarantinedCount: report.sections.quarantinedContent.count,
        lowHealthCount: report.sections.lowHealthContent.count,
        paymentIssueCount: report.sections.paymentSyncIssues.count,
        openRiskCount: report.sections.openRisks.count,
        recommendedPriorities: report.recommendedPriorities,
        generatedAt: report.generatedAt,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
