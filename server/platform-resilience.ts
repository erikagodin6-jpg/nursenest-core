import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { BoundedMap } from "./bounded-map";
import { routeParamString } from "./route-params";

async function auditSensitiveAction(req: any, admin: any, action: string, entityType: string, entityId: string | null, before?: any, after?: any, reason?: string, severity?: string) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, before_json, after_json, reason, severity, ip_address, user_agent, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
      [admin?.id || null, admin?.username || null, entityType, entityId, action,
       before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null,
       reason || null, severity || "info",
       req.ip || req.headers?.["x-forwarded-for"] || null, req.headers?.["user-agent"] || null]
    );
  } catch (e) {
    console.error("[ResilienceAudit] Failed to log:", e);
  }
}

const alertEvents: Array<{
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  message: string;
  source: string;
  acknowledged: boolean;
  createdAt: number;
  data: Record<string, any>;
}> = [];
const MAX_ALERTS = 100;

let failureRateWindow: number[] = [];
const FAILURE_RATE_THRESHOLD = 10;
const FAILURE_RATE_WINDOW_MS = 60000;
let healthCheckTimer: ReturnType<typeof setInterval> | null = null;
const HEALTH_CHECK_INTERVAL_MS = 120000;
const resilienceAuditLog: Array<{ id: string; action: string; entity: string; entityId: string; details: any; actor: string | null; timestamp: number }> = [];
const MAX_AUDIT = 100;

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addAlert(severity: "critical" | "warning" | "info", category: string, title: string, message: string, source: string, data: Record<string, any> = {}) {
  const activeIncident = alertEvents.find(a => a.category === category && a.title === title && !a.acknowledged);
  if (activeIncident) {
    activeIncident.data = { ...activeIncident.data, lastSeenAt: Date.now(), repeatCount: (activeIncident.data.repeatCount || 1) + 1 };
    activeIncident.message = message;
    return;
  }
  const alert = { id: genId(), severity, category, title, message, source, acknowledged: false, createdAt: Date.now(), data: { ...data, repeatCount: 1 } };
  alertEvents.unshift(alert);
  if (alertEvents.length > MAX_ALERTS) alertEvents.length = MAX_ALERTS;
  persistAlert(alert).catch(() => {});
  if (severity === "critical") {
    try {
      const { evaluateAlert, recordEmailSent } = require("./alert-coordinator");
      const decision = evaluateAlert(category as any, severity, message, source);
      if (decision.shouldSendEmail) {
        sendAlertEmail(title, message, severity).then(() => {
          recordEmailSent(decision.incidentSignature);
        }).catch((e: any) => console.error("[Resilience] Alert email failed:", e.message));
      } else {
        console.log(`[Resilience] Alert email suppressed (${decision.reason}): ${title}`);
      }
    } catch {
      sendAlertEmail(title, message, severity).catch(e => console.error("[Resilience] Alert email failed:", e.message));
    }
  }
}

function addResilienceAudit(action: string, entity: string, entityId: string, details: any, actor: string | null) {
  const entry = { id: genId(), action, entity, entityId, details, actor, timestamp: Date.now() };
  resilienceAuditLog.unshift(entry);
  if (resilienceAuditLog.length > MAX_AUDIT) resilienceAuditLog.length = MAX_AUDIT;
  persistResilienceAudit(action, entity, entityId, details, actor).catch(() => {});
}

async function persistResilienceAudit(action: string, entity: string, entityId: string, details: any, actor: string | null) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, severity, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW())`,
      [actor, actor, entity, entityId, action, JSON.stringify(details), "info"]
    );
  } catch {}
}

async function persistAlert(alert: any) {
  try {
    await pool.query(
      `INSERT INTO platform_alerts (id, severity, category, title, message, source, acknowledged, data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9::double precision / 1000))`,
      [alert.id, alert.severity, alert.category, alert.title, alert.message, alert.source, alert.acknowledged, JSON.stringify(alert.data), alert.createdAt]
    ).catch(() => {});
  } catch {}
}

const sendAlertEmailRateLimit = new BoundedMap<string, number>(100, 10 * 60 * 1000);
const SEND_ALERT_EMAIL_RATE_LIMIT_MS = 10 * 60 * 1000;
const MAX_ALERT_EMAIL_ENTRIES = 500;

setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of sendAlertEmailRateLimit) {
    if (now - ts > SEND_ALERT_EMAIL_RATE_LIMIT_MS) {
      sendAlertEmailRateLimit.delete(key);
    }
  }
  if (sendAlertEmailRateLimit.size > MAX_ALERT_EMAIL_ENTRIES) {
    const toDelete = sendAlertEmailRateLimit.size - MAX_ALERT_EMAIL_ENTRIES;
    let deleted = 0;
    for (const key of sendAlertEmailRateLimit.keys()) {
      if (deleted >= toDelete) break;
      sendAlertEmailRateLimit.delete(key);
      deleted++;
    }
  }
}, 5 * 60 * 1000);

async function sendAlertEmail(title: string, message: string, severity: string) {
  try {
    const { getNotificationSettings } = await import("./admin-notifications");
    const settings = await getNotificationSettings(pool);
    if (!settings.emailEnabled) return;

    const recipient = settings.adminEmail || "admin@nursenest.ca";
    const perRecipientKey = `${recipient}:${severity}:${title}`;
    const lastSent = sendAlertEmailRateLimit.get(perRecipientKey);
    if (lastSent && Date.now() - lastSent < SEND_ALERT_EMAIL_RATE_LIMIT_MS) {
      console.log(`[Resilience] Alert email rate-limited for ${recipient}: ${title}`);
      return;
    }

    const { getResendClient } = await import("./resend-client");
    const { client, fromEmail } = await getResendClient();
    await client.emails.send({
      from: fromEmail || "NurseNest <noreply@nursenest.ca>",
      to: recipient,
      subject: `[${severity.toUpperCase()}] NurseNest Alert: ${title}`,
      html: `<h2 style="color: ${severity === 'critical' ? '#dc2626' : '#d97706'}">${title}</h2><p>${message}</p><p style="color: #6b7280; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>`,
    });
    sendAlertEmailRateLimit.set(perRecipientKey, Date.now());
    console.log(`[Resilience] Alert email sent: ${title} -> ${recipient}`);
  } catch (e: any) {
    console.error("[Resilience] Failed to send alert email:", e.message);
  }
}

const MAX_FAILURE_RATE_ENTRIES = 200;

function trackFailureRate(source: string) {
  const now = Date.now();
  failureRateWindow.push(now);
  failureRateWindow = failureRateWindow.filter(t => now - t < FAILURE_RATE_WINDOW_MS);
  if (failureRateWindow.length > MAX_FAILURE_RATE_ENTRIES) {
    failureRateWindow = failureRateWindow.slice(-MAX_FAILURE_RATE_ENTRIES);
  }
  if (failureRateWindow.length >= FAILURE_RATE_THRESHOLD && !emergencyModeActive) {
    activateEmergencyMode(`Auto-triggered: ${failureRateWindow.length} failures in ${FAILURE_RATE_WINDOW_MS / 1000}s from ${source}`);
  }
}

let platformTablesInitialized = false;

async function ensurePlatformTables() {
  if (platformTablesInitialized) return;
  try {
    await pool.query(`UPDATE users SET admin_role = 'super_admin' WHERE tier = 'admin' AND (admin_role IS NULL OR admin_role = '')`);
    platformTablesInitialized = true;
    console.log("[PlatformResilience] Platform tables initialized successfully");
  } catch (e: any) {
    console.error("[PlatformResilience] Table initialization error:", e.message);
  }
}

interface CircuitBreakerState {
  name: string;
  state: "closed" | "open" | "half-open";
  failureCount: number;
  successCount: number;
  lastFailure: number | null;
  lastSuccess: number | null;
  openedAt: number | null;
  tripCount: number;
  cooldownMs: number;
  failureThreshold: number;
  halfOpenMaxAttempts: number;
}

const circuitBreakers = new BoundedMap<string, CircuitBreakerState>(50);

function getOrCreateBreaker(name: string, opts?: { threshold?: number; cooldownMs?: number }): CircuitBreakerState {
  let cb = circuitBreakers.get(name);
  if (!cb) {
    cb = {
      name,
      state: "closed",
      failureCount: 0,
      successCount: 0,
      lastFailure: null,
      lastSuccess: null,
      openedAt: null,
      tripCount: 0,
      cooldownMs: opts?.cooldownMs ?? 30000,
      failureThreshold: opts?.threshold ?? 5,
      halfOpenMaxAttempts: 3,
    };
    circuitBreakers.set(name, cb);
  }
  return cb;
}

export function recordSuccess(serviceName: string): void {
  const cb = getOrCreateBreaker(serviceName);
  cb.successCount++;
  cb.lastSuccess = Date.now();
  if (cb.state === "half-open") {
    cb.state = "closed";
    cb.failureCount = 0;
  }
}

export function recordFailure(serviceName: string): void {
  const cb = getOrCreateBreaker(serviceName);
  cb.failureCount++;
  cb.lastFailure = Date.now();
  recordErrorBudgetEvent(serviceName);
  if (cb.state === "half-open") {
    cb.state = "open";
    cb.openedAt = Date.now();
    cb.tripCount++;
    console.error(`[CircuitBreaker] RE-TRIPPED from half-open: ${serviceName} (trip #${cb.tripCount})`);
    addResilienceEvent("circuit_breaker_trip", serviceName, { failureCount: cb.failureCount, tripCount: cb.tripCount, fromHalfOpen: true });
    addAlert("warning", "circuit_breaker", `Circuit Breaker Tripped: ${serviceName}`, `${serviceName} breaker tripped (trip #${cb.tripCount}) after ${cb.failureCount} failures`, serviceName);
    trackFailureRate(serviceName);
  } else if (cb.state === "closed" && cb.failureCount >= cb.failureThreshold) {
    cb.state = "open";
    cb.openedAt = Date.now();
    cb.tripCount++;
    console.error(`[CircuitBreaker] TRIPPED: ${serviceName} (failures: ${cb.failureCount}, trip #${cb.tripCount})`);
    addResilienceEvent("circuit_breaker_trip", serviceName, { failureCount: cb.failureCount, tripCount: cb.tripCount });
    addAlert("warning", "circuit_breaker", `Circuit Breaker Tripped: ${serviceName}`, `${serviceName} breaker opened after ${cb.failureCount} failures`, serviceName);
    trackFailureRate(serviceName);
  }
}

export function isCircuitOpen(serviceName: string): boolean {
  const cb = circuitBreakers.get(serviceName);
  if (!cb) return false;
  if (cb.state === "closed") return false;
  if (cb.state === "open") {
    if (Date.now() - (cb.openedAt || 0) > cb.cooldownMs) {
      cb.state = "half-open";
      return false;
    }
    return true;
  }
  return false;
}

export function resetCircuitBreaker(serviceName: string): void {
  const cb = circuitBreakers.get(serviceName);
  if (cb) {
    cb.state = "closed";
    cb.failureCount = 0;
    cb.openedAt = null;
    addResilienceEvent("circuit_breaker_reset", serviceName, {});
  }
}

export function getCircuitBreakerStates(): CircuitBreakerState[] {
  return Array.from(circuitBreakers.values());
}

export function initDefaultBreakers(): void {
  getOrCreateBreaker("database", { threshold: 3, cooldownMs: 15000 });
  getOrCreateBreaker("stripe", { threshold: 5, cooldownMs: 60000 });
  getOrCreateBreaker("ai_service", { threshold: 5, cooldownMs: 45000 });
  getOrCreateBreaker("exam_service", { threshold: 3, cooldownMs: 20000 });
  getOrCreateBreaker("auth_service", { threshold: 5, cooldownMs: 30000 });
  getOrCreateBreaker("email_service", { threshold: 5, cooldownMs: 60000 });
  getOrCreateBreaker("sms_service", { threshold: 5, cooldownMs: 60000 });
}

export async function withCircuitBreaker<T>(
  serviceName: string,
  fn: () => Promise<T>,
  fallback?: () => T | Promise<T>
): Promise<T> {
  if (isCircuitOpen(serviceName)) {
    if (fallback) return fallback();
    throw new Error(`Service ${serviceName} is unavailable (circuit open)`);
  }
  try {
    const result = await fn();
    recordSuccess(serviceName);
    return result;
  } catch (err) {
    recordFailure(serviceName);
    if (fallback) return fallback();
    throw err;
  }
}

interface FeatureFlagScope {
  users?: string[];
  regions?: string[];
  professions?: string[];
}

interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  autoDisableOnErrors: boolean;
  errorCount: number;
  errorThreshold: number;
  disabledAt: number | null;
  disabledReason: string | null;
  adminOverride: boolean | null;
  updatedAt: number;
  scope: FeatureFlagScope | null;
  scopeMode: "global" | "include" | "exclude";
}

const featureFlags = new Map<string, FeatureFlag>();

const DEFAULT_FLAGS: Array<{ key: string; description: string; enabled: boolean; autoDisable?: boolean; errorThreshold?: number }> = [
  { key: "mock_exams", description: "Mock exam system", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "cat_engine", description: "Computer Adaptive Testing engine", enabled: true, autoDisable: true, errorThreshold: 5 },
  { key: "flashcards", description: "Flashcard study system", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "ai_tutor", description: "AI tutoring assistant (experimental)", enabled: false, autoDisable: true, errorThreshold: 5 },
  { key: "ai_content_gen", description: "AI content generation (experimental)", enabled: false, autoDisable: true, errorThreshold: 5 },
  { key: "stripe_payments", description: "Stripe payment processing", enabled: true, autoDisable: false },
  { key: "email_notifications", description: "Email notification system", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "sms_notifications", description: "SMS notification system", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "offline_sync", description: "Offline synchronization (experimental)", enabled: false, autoDisable: true, errorThreshold: 15 },
  { key: "seo_generation", description: "SEO content generation", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "question_bank", description: "Question bank service", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "lesson_rendering", description: "Lesson content rendering", enabled: true, autoDisable: true, errorThreshold: 10 },
  { key: "new_ui_components", description: "Experimental UI components (high-risk)", enabled: false, autoDisable: true, errorThreshold: 3 },
  { key: "advanced_analytics", description: "Advanced analytics dashboard (experimental)", enabled: false, autoDisable: true, errorThreshold: 5 },
  { key: "heavy_exports", description: "Heavy data export operations", enabled: true, autoDisable: true, errorThreshold: 5 },
  { key: "expensive_diagnostics", description: "Expensive diagnostic queries and reports", enabled: true, autoDisable: true, errorThreshold: 5 },
  { key: "large_background_jobs", description: "Large background processing jobs", enabled: true, autoDisable: true, errorThreshold: 3 },
];

export function initFeatureFlags(): void {
  for (const def of DEFAULT_FLAGS) {
    featureFlags.set(def.key, {
      key: def.key,
      enabled: def.enabled,
      description: def.description,
      autoDisableOnErrors: def.autoDisable ?? false,
      errorCount: 0,
      errorThreshold: def.errorThreshold ?? 10,
      disabledAt: null,
      disabledReason: null,
      adminOverride: null,
      updatedAt: Date.now(),
      scope: null,
      scopeMode: "global",
    });
  }
}

export function isFeatureEnabled(key: string): boolean {
  if (emergencyModeActive) {
    const safeInEmergency = new Set(["stripe_payments", "email_notifications", "lesson_rendering", "flashcards", "mock_exams", "question_bank"]);
    if (!safeInEmergency.has(key)) return false;
  }
  if (minimalCoreActive) {
    const coreFeatures = new Set(["stripe_payments", "lesson_rendering", "flashcards", "mock_exams", "question_bank", "email_notifications"]);
    if (!coreFeatures.has(key)) return false;
  }
  const flag = featureFlags.get(key);
  if (!flag) return true;
  if (flag.adminOverride !== null) return flag.adminOverride;
  return flag.enabled;
}

export function isFeatureEnabledForContext(key: string, context?: { userId?: string; region?: string; profession?: string }): boolean {
  const baseEnabled = isFeatureEnabled(key);
  const flag = featureFlags.get(key);
  if (!flag || !flag.scope || flag.scopeMode === "global" || !context) return baseEnabled;

  const matchesScope = checkScopeMatch(flag.scope, context);

  if (flag.scopeMode === "include") {
    return baseEnabled && matchesScope;
  }
  if (flag.scopeMode === "exclude") {
    return baseEnabled && !matchesScope;
  }

  return baseEnabled;
}

function checkScopeMatch(scope: FeatureFlagScope, context: { userId?: string; region?: string; profession?: string }): boolean {
  if (scope.users && scope.users.length > 0 && context.userId) {
    if (scope.users.includes(context.userId)) return true;
  }
  if (scope.regions && scope.regions.length > 0 && context.region) {
    if (scope.regions.includes(context.region)) return true;
  }
  if (scope.professions && scope.professions.length > 0 && context.profession) {
    if (scope.professions.includes(context.profession)) return true;
  }
  return false;
}

export function setFeatureFlagScope(key: string, scopeMode: "global" | "include" | "exclude", scope: FeatureFlagScope | null, actor?: string): void {
  const flag = featureFlags.get(key);
  if (!flag) return;
  flag.scopeMode = scopeMode;
  flag.scope = scope;
  flag.updatedAt = Date.now();
  addResilienceEvent("feature_flag_scope_update", key, { scopeMode, scope, actor });
  addResilienceAudit("feature_flag_scope_update", "feature_flag", key, { scopeMode, scope }, actor || null);
}

export function setFeatureFlag(key: string, enabled: boolean, reason?: string, actor?: string): void {
  const flag = featureFlags.get(key);
  if (!flag) return;
  flag.adminOverride = enabled;
  flag.updatedAt = Date.now();
  if (!enabled) {
    flag.disabledAt = Date.now();
    flag.disabledReason = reason || "admin_disabled";
  } else {
    flag.disabledAt = null;
    flag.disabledReason = null;
  }
  addResilienceEvent("feature_flag_toggle", key, { enabled, reason, actor });
  addResilienceAudit("feature_flag_toggle", "feature_flag", key, { enabled, reason }, actor || null);
  try {
    const { trackChange } = require("./incident-correlation");
    trackChange({ type: "feature_flag", source: "platform-resilience", description: `Feature flag "${key}" ${enabled ? "enabled" : "disabled"}${reason ? `: ${reason}` : ""}`, entityId: key, actor: actor || null, metadata: { enabled, reason } });
  } catch {}
}

export function recordFeatureError(key: string): void {
  const flag = featureFlags.get(key);
  if (!flag) return;
  flag.errorCount++;
  if (flag.autoDisableOnErrors && flag.errorCount >= flag.errorThreshold && flag.enabled) {
    flag.enabled = false;
    flag.disabledAt = Date.now();
    flag.disabledReason = `auto_disabled_after_${flag.errorCount}_errors`;
    console.error(`[FeatureFlags] AUTO-DISABLED: ${key} after ${flag.errorCount} errors`);
    addResilienceEvent("feature_auto_disabled", key, { errorCount: flag.errorCount });
    addAlert("warning", "feature_flag", `Feature Auto-Disabled: ${key}`, `Feature "${key}" was automatically disabled after ${flag.errorCount} errors`, key);
    addResilienceAudit("feature_flag_auto_disable", "feature_flag", key, { errorCount: flag.errorCount, threshold: flag.errorThreshold }, null);
    trackFailureRate(`feature_flag:${key}`);
  }
}

export function resetFeatureErrors(key: string): void {
  const flag = featureFlags.get(key);
  if (!flag) return;
  flag.errorCount = 0;
  if (flag.disabledReason?.startsWith("auto_disabled")) {
    flag.enabled = true;
    flag.disabledAt = null;
    flag.disabledReason = null;
  }
}

export function getFeatureFlags(): FeatureFlag[] {
  return Array.from(featureFlags.values());
}

interface KillSwitch {
  key: string;
  active: boolean;
  scope: "global" | "route" | "feature" | "exam" | "language" | "component";
  target: string;
  activatedAt: number | null;
  activatedBy: string | null;
  reason: string | null;
}

const killSwitches = new BoundedMap<string, KillSwitch>(50);

export function activateKillSwitch(key: string, scope: KillSwitch["scope"], target: string, reason: string, activatedBy: string): void {
  killSwitches.set(key, {
    key,
    active: true,
    scope,
    target,
    activatedAt: Date.now(),
    activatedBy,
    reason,
  });
  addResilienceEvent("kill_switch_activated", key, { scope, target, reason });
  try {
    const { trackChange } = require("./incident-correlation");
    trackChange({ type: "kill_switch", source: "platform-resilience", description: `Kill switch "${key}" activated: ${reason}`, entityId: key, actor: activatedBy, metadata: { scope, target, reason } });
  } catch {}
}

export function deactivateKillSwitch(key: string): void {
  const ks = killSwitches.get(key);
  if (ks) {
    ks.active = false;
    ks.activatedAt = null;
    addResilienceEvent("kill_switch_deactivated", key, {});
  }
}

export function isKillSwitchActive(key: string): boolean {
  return killSwitches.get(key)?.active ?? false;
}

export function getKillSwitches(): KillSwitch[] {
  return Array.from(killSwitches.values());
}

interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  lastChecked: number;
  details?: string;
}

const healthCheckResults = new BoundedMap<string, HealthCheckResult>(30);
let lastFullHealthCheck = 0;
let cachedHealthResponse: { status: string; services: HealthCheckResult[]; timestamp: number } | null = null;
const HEALTH_CACHE_TTL = 15000;

async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await pool.query("SELECT 1");
    const latency = Date.now() - start;
    return { service: "database", status: latency > 2000 ? "degraded" : "healthy", latencyMs: latency, lastChecked: Date.now() };
  } catch (err: any) {
    return { service: "database", status: "down", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkAuthHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await pool.query("SELECT id FROM users LIMIT 1");
    const latency = Date.now() - start;
    return { service: "auth", status: latency > 2000 ? "degraded" : "healthy", latencyMs: latency, lastChecked: Date.now() };
  } catch (err: any) {
    return { service: "auth", status: "down", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkExamHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const r = await pool.query("SELECT COUNT(*) as ct FROM exam_questions WHERE status = 'published' LIMIT 1");
    const count = parseInt(r.rows[0]?.ct || "0");
    const latency = Date.now() - start;
    return {
      service: "exams",
      status: count === 0 ? "degraded" : latency > 3000 ? "degraded" : "healthy",
      latencyMs: latency,
      lastChecked: Date.now(),
      details: `${count} published questions`,
    };
  } catch (err: any) {
    return { service: "exams", status: "down", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkFlashcardHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await pool.query("SELECT COUNT(*) FROM flashcard_decks LIMIT 1");
    const latency = Date.now() - start;
    return { service: "flashcards", status: latency > 3000 ? "degraded" : "healthy", latencyMs: latency, lastChecked: Date.now() };
  } catch (err: any) {
    return { service: "flashcards", status: "down", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkSubscriptionValidation(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const r = await pool.query("SELECT id, tier FROM users WHERE tier != 'free' LIMIT 1");
    const latency = Date.now() - start;
    return { service: "subscription_validation", status: r.rows.length > 0 ? (latency > 2000 ? "degraded" : "healthy") : "degraded", latencyMs: latency, lastChecked: Date.now(), details: r.rows.length > 0 ? "Active subscribers found" : "No active subscribers" };
  } catch (err: any) {
    return { service: "subscription_validation", status: "down", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkLessonLoad(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM lessons WHERE status = 'published' LIMIT 1");
    const cnt = r.rows[0]?.cnt || 0;
    const latency = Date.now() - start;
    return { service: "lesson_load", status: cnt > 0 ? (latency > 3000 ? "degraded" : "healthy") : "degraded", latencyMs: latency, lastChecked: Date.now(), details: `${cnt} published lessons` };
  } catch (err: any) {
    return { service: "lesson_load", status: "degraded", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkSessionRestore(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const tableCheck = await pool.query("SELECT to_regclass('exam_sessions') IS NOT NULL AS exists");
    if (!tableCheck.rows[0]?.exists) {
      return { service: "session_restore", status: "healthy", latencyMs: Date.now() - start, lastChecked: Date.now(), details: "Table not created yet (normal)" };
    }
    await pool.query("SELECT id FROM exam_sessions WHERE status = 'in_progress' LIMIT 1");
    const latency = Date.now() - start;
    return { service: "session_restore", status: latency > 3000 ? "degraded" : "healthy", latencyMs: latency, lastChecked: Date.now() };
  } catch (err: any) {
    return { service: "session_restore", status: "healthy", latencyMs: Date.now() - start, lastChecked: Date.now(), details: "Check skipped: " + err.message };
  }
}

async function checkMemory(): Promise<HealthCheckResult> {
  const start = Date.now();
  const mem = process.memoryUsage();
  const rssMB = Math.round(mem.rss / 1024 / 1024);
  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
  let limitMB = 512;
  try { const { getDetectedMemoryLimitMB } = await import("./memory-monitor"); limitMB = getDetectedMemoryLimitMB(); } catch {}
  const warningMB = parseInt(process.env.MEMORY_WARNING_MB || "0") || Math.round(limitMB * 0.70);
  const criticalMB = parseInt(process.env.MEMORY_CRITICAL_MB || "0") || Math.round(limitMB * 0.90);
  const status = rssMB > criticalMB ? "down" : rssMB > warningMB ? "degraded" : "healthy";
  return { service: "memory", status, latencyMs: Date.now() - start, lastChecked: Date.now(), details: `RSS: ${rssMB}MB, Heap: ${heapUsedMB}/${heapTotalMB}MB (limit: ${limitMB}MB, warn: ${warningMB}MB, crit: ${criticalMB}MB)` };
}

async function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)),
  ]);
}

async function checkStripeHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const { validateStripeConnection } = await import("./stripeClient");
    const ok = await withTimeout(() => validateStripeConnection(), 5000, "Stripe");
    const latency = Date.now() - start;
    return { service: "stripe", status: ok ? (latency > 3000 ? "degraded" : "healthy") : "down", latencyMs: latency, lastChecked: Date.now(), details: ok ? "Stripe API reachable" : "Stripe validation failed" };
  } catch (err: any) {
    return { service: "stripe", status: "down", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

async function checkContentDeliveryHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const r = await withTimeout(
      () => pool.query("SELECT COUNT(*)::int AS cnt FROM content_items WHERE status = 'published' LIMIT 1"),
      5000, "ContentDelivery"
    );
    const cnt = r.rows[0]?.cnt || 0;
    const latency = Date.now() - start;
    return {
      service: "content_delivery",
      status: cnt === 0 ? "degraded" : latency > 3000 ? "degraded" : "healthy",
      latencyMs: latency,
      lastChecked: Date.now(),
      details: `${cnt} published content items`,
    };
  } catch (err: any) {
    return { service: "content_delivery", status: "degraded", latencyMs: Date.now() - start, lastChecked: Date.now(), details: err.message };
  }
}

export async function runHealthChecks(): Promise<HealthCheckResult[]> {
  const checks = await Promise.allSettled([
    checkDatabaseHealth(),
    checkAuthHealth(),
    checkExamHealth(),
    checkFlashcardHealth(),
    checkSubscriptionValidation(),
    checkLessonLoad(),
    checkSessionRestore(),
    checkMemory(),
    checkStripeHealth(),
    checkContentDeliveryHealth(),
  ]);

  const results: HealthCheckResult[] = [];
  for (const check of checks) {
    if (check.status === "fulfilled") {
      results.push(check.value);
      healthCheckResults.set(check.value.service, check.value);
    }
  }

  const cbStates = getCircuitBreakerStates();
  for (const cb of cbStates) {
    if (cb.state === "open") {
      results.push({
        service: cb.name,
        status: "down",
        latencyMs: 0,
        lastChecked: Date.now(),
        details: `Circuit breaker open (${cb.failureCount} failures)`,
      });
    }
  }

  lastFullHealthCheck = Date.now();
  const overallStatus = results.some((r) => r.status === "down")
    ? "down"
    : results.some((r) => r.status === "degraded")
    ? "degraded"
    : "healthy";
  cachedHealthResponse = { status: overallStatus, services: results, timestamp: Date.now() };

  const downServices = results.filter(r => r.status === "down");
  const degradedServices = results.filter(r => r.status === "degraded");
  for (const svc of downServices) {
    addAlert("critical", "health_check", `Service Down: ${svc.service}`, `${svc.service} is reporting as down. Details: ${svc.details || "none"}`, svc.service);
    recordErrorBudgetEvent(svc.service, 3);
    try {
      const { logIncident } = require("./incident-monitor");
      logIncident({
        category: "health_check_failure" as any,
        severity: "critical" as const,
        title: `Service Down: ${svc.service}`,
        message: `Health check detected ${svc.service} is down. Latency: ${svc.latencyMs}ms. Details: ${svc.details || "none"}`,
        errorKey: `health_check_down:${svc.service}`,
        metadata: { service: svc.service, status: svc.status, latencyMs: svc.latencyMs, details: svc.details },
      });
    } catch {}
  }
  for (const svc of degradedServices) {
    addAlert("warning", "health_check", `Service Degraded: ${svc.service}`, `${svc.service} is reporting as degraded. Details: ${svc.details || "none"}`, svc.service);
    recordErrorBudgetEvent(svc.service, 1);
  }

  const criticalDown = downServices.filter(s => ["database", "exams", "auth"].includes(s.service));
  if (criticalDown.length >= 2 && !emergencyModeActive) {
    activateEmergencyMode(`Auto-triggered: ${criticalDown.length} critical services down (${criticalDown.map(s => s.service).join(", ")})`);
  } else if (downServices.length >= 3 && !emergencyModeActive) {
    activateEmergencyMode(`Auto-triggered: ${downServices.length} services down (${downServices.map(s => s.service).join(", ")})`);
  }

  const openBreakers = cbStates.filter(cb => cb.state === "open");
  const criticalBreakers = openBreakers.filter(cb => ["database", "exam_service", "auth_service"].includes(cb.name));
  if (criticalBreakers.length >= 2 && !emergencyModeActive) {
    activateEmergencyMode(`Auto-triggered: ${criticalBreakers.length} critical circuit breakers open (${criticalBreakers.map(cb => cb.name).join(", ")})`);
  }

  persistHealthChecks(results).catch(() => {});
  return results;
}

async function persistHealthChecks(checks: HealthCheckResult[]) {
  try {
    for (const check of checks) {
      await pool.query(
        `INSERT INTO platform_health_checks (service, status, latency_ms, details) VALUES ($1, $2, $3, $4)`,
        [check.service, check.status, check.latencyMs, check.details || null]
      );
    }
    await pool.query(`DELETE FROM platform_health_checks WHERE checked_at < NOW() - INTERVAL '7 days'`);
  } catch {}
}

export function getLastHealthResults(): HealthCheckResult[] {
  return Array.from(healthCheckResults.values());
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new BoundedMap<string, RateLimitEntry>(1000, 120000);
const RATE_LIMIT_CLEANUP_INTERVAL = 60000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > 120000) {
      rateLimitStore.delete(key);
    }
  }
  if (rateLimitStore.size > 1000) {
    const toDelete = rateLimitStore.size - 1000;
    let deleted = 0;
    for (const key of rateLimitStore.keys()) {
      if (deleted >= toDelete) break;
      rateLimitStore.delete(key);
      deleted++;
    }
  }
}, RATE_LIMIT_CLEANUP_INTERVAL);

export function rateLimitMiddleware(opts: { windowMs?: number; maxRequests?: number; subscriberMultiplier?: number; keyPrefix?: string } = {}) {
  const windowMs = opts.windowMs ?? 60000;
  const maxRequests = opts.maxRequests ?? 60;
  const subscriberMultiplier = opts.subscriberMultiplier ?? 2;
  const keyPrefix = opts.keyPrefix ?? "global";

  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).authUser;
    const identifier = user?.id || req.ip || "unknown";
    const key = `${keyPrefix}:${identifier}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
      entry = { count: 0, windowStart: now };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    const isPaid = user?.tier && user.tier !== "free";
    const limit = isPaid ? maxRequests * subscriberMultiplier : maxRequests;

    if (entry.count > limit) {
      res.setHeader("Retry-After", String(Math.ceil((entry.windowStart + windowMs - now) / 1000)));
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((entry.windowStart + windowMs - now) / 1000),
      });
    }

    res.setHeader("X-RateLimit-Limit", String(limit));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - entry.count)));
    next();
  };
}

export function loginRateLimitMiddleware() {
  return rateLimitMiddleware({ windowMs: 900000, maxRequests: 10, keyPrefix: "login", subscriberMultiplier: 1 });
}

interface ResilienceEvent {
  id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  timestamp: number;
}

const resilienceEvents: ResilienceEvent[] = [];
const MAX_EVENTS = 100;

function addResilienceEvent(type: string, source: string, data: Record<string, any>): void {
  const event: ResilienceEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    source,
    data,
    timestamp: Date.now(),
  };
  resilienceEvents.unshift(event);
  if (resilienceEvents.length > MAX_EVENTS) {
    resilienceEvents.length = MAX_EVENTS;
  }

  try {
    const { logChange } = require("./incident-correlation");
    const changeTypeMap: Record<string, string> = {
      circuit_breaker_trip: "circuit_breaker_trip",
      circuit_breaker_reset: "circuit_breaker_reset",
      feature_auto_disabled: "feature_auto_disabled",
      emergency_mode_activated: "emergency_mode",
      emergency_mode_deactivated: "emergency_mode",
      kill_switch_activated: "kill_switch_change",
      kill_switch_deactivated: "kill_switch_change",
      feature_flag_toggled: "feature_flag_toggle",
      health_check_degraded: "health_check_change",
    };
    const changeType = changeTypeMap[type] || "resilience_event";
    logChange({
      changeType,
      source: "platform-resilience",
      entityType: type,
      entityId: source,
      description: `${type}: ${source}`,
      metadata: data,
    }).catch(() => {});
  } catch {}

  try {
    const { logIncident } = require("./incident-monitor");
    const eventToIncident: Record<string, { category: string; severity: "critical" | "warning" | "info"; title: string }> = {
      circuit_breaker_trip: { category: "circuit_breaker_trip", severity: "warning", title: `Circuit Breaker Tripped: ${source}` },
      feature_auto_disabled: { category: "feature_auto_disabled", severity: "warning", title: `Feature Auto-Disabled: ${source}` },
      emergency_mode_activated: { category: "emergency_mode", severity: "critical", title: "Emergency Mode Activated" },
      provisional_access_granted: { category: "provisional_access", severity: "info", title: `Provisional Access Granted: ${source}` },
      self_heal_failed: { category: "health_check_failure", severity: "warning", title: `Self-Heal Failed: ${source}` },
      error_budget_escalation: { category: "health_check_failure", severity: "warning", title: `Error Budget Escalation: ${source}` },
      minimal_core_activated: { category: "emergency_mode", severity: "critical", title: "Minimal Core Mode Activated" },
      feature_auto_throttled: { category: "feature_auto_disabled", severity: "warning", title: `Feature Auto-Throttled: ${source}` },
    };
    const mapping = eventToIncident[type];
    if (mapping) {
      logIncident({
        category: mapping.category as any,
        severity: mapping.severity,
        title: mapping.title,
        message: `Resilience event: ${type} from ${source}. ${JSON.stringify(data)}`,
        errorKey: `${type}:${source}`,
        userId: source.match(/^[a-f0-9-]+$/i) ? source : undefined,
        metadata: { resilienceEventType: type, ...data },
      });
    }

    const autoDetectTypes = ["circuit_breaker_trip", "emergency_mode_activated", "feature_auto_disabled"];
    if (autoDetectTypes.includes(type)) {
      try {
        const { pool: dbPool } = require("./storage");
        const severityMap: Record<string, string> = {
          circuit_breaker_trip: "high",
          emergency_mode_activated: "critical",
          feature_auto_disabled: "medium",
        };
        const sev = severityMap[type] || "medium";
        const title = mapping?.title || `Auto-detected: ${type}`;
        dbPool.query(
          `SELECT id FROM incidents WHERE title = $1 AND status IN ('active', 'investigating', 'identified')
           AND created_at > NOW() - INTERVAL '30 minutes' LIMIT 1`,
          [title]
        ).then((existing: any) => {
          if (existing.rows?.length > 0) return;
          dbPool.query(
            `INSERT INTO incidents (title, description, severity, impacted_features, created_by, status)
             VALUES ($1, $2, $3, $4, 'system', 'active') RETURNING id`,
            [title, `Auto-detected from resilience event: ${type} on ${source}`, sev, JSON.stringify([source])]
          ).then((r: any) => {
            if (r.rows?.[0]?.id) {
              dbPool.query(
                `INSERT INTO incident_events (incident_id, event_type, event_data, actor)
                 VALUES ($1, 'created', $2, 'system')`,
                [r.rows[0].id, JSON.stringify({ autoDetected: true, resilienceEventType: type, source })]
              ).catch(() => {});
            }
          }).catch(() => {});
        }).catch(() => {});
      } catch {}
    }
  } catch {}
}

export function getResilienceEvents(limit = 50): ResilienceEvent[] {
  return resilienceEvents.slice(0, limit);
}

let emergencyModeActive = false;
let emergencyModeReason: string | null = null;
let emergencyModeActivatedAt: number | null = null;
let emergencyModeLastDeactivatedAt: number | null = null;
const EMERGENCY_MODE_REACTIVATION_COOLDOWN_MS = 10 * 60 * 1000;

export function isEmergencyMode(): boolean {
  return emergencyModeActive;
}

const emergencyPausedJobs: string[] = [];

export function activateEmergencyMode(reason: string, actor?: string): void {
  if (emergencyModeActive) return;
  if (emergencyModeLastDeactivatedAt && Date.now() - emergencyModeLastDeactivatedAt < EMERGENCY_MODE_REACTIVATION_COOLDOWN_MS) {
    console.log(`[EMERGENCY MODE] Reactivation suppressed (cooldown ${Math.round((EMERGENCY_MODE_REACTIVATION_COOLDOWN_MS - (Date.now() - emergencyModeLastDeactivatedAt)) / 1000)}s remaining): ${reason}`);
    return;
  }
  emergencyModeActive = true;
  emergencyModeReason = reason;
  emergencyModeActivatedAt = Date.now();
  const isAuto = !actor;
  console.error(`[EMERGENCY MODE] ACTIVATED: ${reason}`);
  addResilienceEvent("emergency_mode_activated", "system", { reason, actor, auto: isAuto });
  addAlert("critical", "emergency_mode", "Emergency Mode Activated", `Emergency mode activated. Reason: ${reason}`, "emergency", { reason, actor });

  pauseBackgroundJobs();
  reduceMonitoringFrequency();

  try {
    const { trackChange } = require("./incident-correlation");
    trackChange({ type: "config_change", source: "emergency-mode", description: `Emergency mode activated: ${reason}`, entityId: "emergency_mode", actor: actor || null, metadata: { reason, auto: isAuto } });
  } catch {}
  addResilienceAudit("emergency_mode_activate", "platform", "emergency_mode", { reason, auto: isAuto }, actor || null);
  pool.query(
    `INSERT INTO platform_emergency_log (action, reason, actor, auto_triggered) VALUES ($1, $2, $3, $4)`,
    ["activate", reason, actor || "system", isAuto]
  ).catch(() => {});

  try {
    const { sendAdminNotification } = require("./admin-notifications");
    sendAdminNotification(pool, { event: "emergency_mode_activated", details: reason, alertType: "emergency_mode" }).catch(() => {});
  } catch {}
}

export function deactivateEmergencyMode(actor?: string): void {
  if (!emergencyModeActive) return;
  const duration = emergencyModeActivatedAt ? Date.now() - emergencyModeActivatedAt : 0;
  emergencyModeActive = false;
  emergencyModeReason = null;
  emergencyModeActivatedAt = null;
  emergencyModeLastDeactivatedAt = Date.now();

  resumeBackgroundJobs();
  restoreMonitoringFrequency();

  addResilienceEvent("emergency_mode_deactivated", "system", { actor, durationMs: duration });
  addResilienceAudit("emergency_mode_deactivate", "platform", "emergency_mode", { actor, durationMs: duration }, actor || null);
  pool.query(
    `INSERT INTO platform_emergency_log (action, reason, actor, auto_triggered) VALUES ($1, $2, $3, false)`,
    ["deactivate", `Manual deactivation after ${Math.round(duration / 1000)}s`, actor || "system"]
  ).catch(() => {});
}

export function getEmergencyModeStatus(): { active: boolean; reason: string | null; activatedAt: number | null } {
  return { active: emergencyModeActive, reason: emergencyModeReason, activatedAt: emergencyModeActivatedAt };
}

const NON_ESSENTIAL_ROUTE_PREFIXES = [
  "/api/admin/blog",
  "/api/admin/content-generate",
  "/api/admin/ai-",
  "/api/admin/seo",
  "/api/admin/bulk-generate",
];

const ESSENTIAL_ROUTE_PREFIXES = [
  "/api/auth",
  "/api/user",
  "/api/stripe",
  "/api/content/lessons",
  "/api/content/flashcard-sets",
  "/api/content/exams",
  "/api/content-items",
  "/api/flashcard-bank",
  "/api/exam-questions",
  "/api/mock-exams",
  "/api/admin/resilience",
  "/api/admin/safe-mode",
  "/api/admin/health",
  "/healthz",
];

export function emergencyModeMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!emergencyModeActive) return next();

  if (!req.path.startsWith("/api")) return next();

  for (const prefix of ESSENTIAL_ROUTE_PREFIXES) {
    if (req.path.startsWith(prefix)) return next();
  }

  if (req.method === "GET" || req.method === "HEAD") {
    return next();
  }

  res.status(503).json({
    error: "Service temporarily unavailable - emergency mode active",
    emergencyMode: true,
    reason: emergencyModeReason,
  });
}

let originalHealthCheckInterval: number | null = null;

function pauseBackgroundJobs(): void {
  try {
    const { stopPostPublishAudit } = require("./content-integrity-audit");
    stopPostPublishAudit();
    emergencyPausedJobs.push("post_publish_audit");
    console.log("[EMERGENCY MODE] Paused post-publish audit");
  } catch {}

  try {
    const { stopAlertingEngine } = require("./alerting-engine");
    stopAlertingEngine();
    emergencyPausedJobs.push("alerting_engine");
    console.log("[EMERGENCY MODE] Paused alerting engine");
  } catch {}

  console.log(`[EMERGENCY MODE] Paused ${emergencyPausedJobs.length} background jobs`);
}

function resumeBackgroundJobs(): void {
  try {
    if (emergencyPausedJobs.includes("post_publish_audit")) {
      const { startPostPublishAudit } = require("./content-integrity-audit");
      startPostPublishAudit();
    }
  } catch {}

  try {
    if (emergencyPausedJobs.includes("alerting_engine")) {
      const { startAlertingEngine } = require("./alerting-engine");
      startAlertingEngine(pool, 5 * 60 * 1000);
    }
  } catch {}

  emergencyPausedJobs.length = 0;
  console.log("[EMERGENCY MODE] Resumed background jobs");
}

function reduceMonitoringFrequency(): void {
  if (healthCheckTimer) {
    originalHealthCheckInterval = HEALTH_CHECK_INTERVAL_MS;
    clearInterval(healthCheckTimer);
    healthCheckTimer = setInterval(() => {
      runHealthChecks().catch(e => console.error("[Resilience] Emergency health check error:", e.message));
    }, HEALTH_CHECK_INTERVAL_MS * 3);
    console.log("[EMERGENCY MODE] Reduced monitoring frequency to", HEALTH_CHECK_INTERVAL_MS * 3 / 1000, "s");
  }
}

function restoreMonitoringFrequency(): void {
  if (healthCheckTimer && originalHealthCheckInterval) {
    clearInterval(healthCheckTimer);
    healthCheckTimer = setInterval(() => {
      runHealthChecks().catch(e => console.error("[Resilience] Health check error:", e.message));
    }, originalHealthCheckInterval);
    originalHealthCheckInterval = null;
    console.log("[EMERGENCY MODE] Restored normal monitoring frequency");
  }
}

let selfHealingActive = true;
const selfHealingLog: Array<{ action: string; target: string; result: string; timestamp: number }> = [];

export function attemptSelfHeal(target: string, action: string, fn: () => Promise<void>): void {
  if (!selfHealingActive) return;
  fn()
    .then(() => {
      selfHealingLog.unshift({ action, target, result: "success", timestamp: Date.now() });
      if (selfHealingLog.length > 100) selfHealingLog.length = 100;
      addResilienceEvent("self_heal_success", target, { action });
    })
    .catch((err) => {
      selfHealingLog.unshift({ action, target, result: `failed: ${err.message}`, timestamp: Date.now() });
      if (selfHealingLog.length > 100) selfHealingLog.length = 100;
      addResilienceEvent("self_heal_failed", target, { action, error: err.message });
    });
}

export function getSelfHealingLog(): typeof selfHealingLog {
  return selfHealingLog.slice(0, 50);
}

export function autoHealOnCircuitTrip(serviceName: string): void {
  const cb = circuitBreakers.get(serviceName);
  if (!cb || cb.state !== "open") return;

  if (serviceName === "database") {
    attemptSelfHeal("database", "connection_pool_refresh", async () => {
      await pool.query("SELECT 1");
    });
  }

  if (serviceName === "exam_service") {
    attemptSelfHeal("exam_service", "reset_circuit", async () => {
      await new Promise((r) => setTimeout(r, 5000));
      const testResult = await pool.query("SELECT id FROM exam_questions WHERE status = 'published' LIMIT 1");
      if (testResult.rows.length > 0) {
        resetCircuitBreaker(serviceName);
      }
    });
  }
}

export async function selfHealCacheCorruption(): Promise<{ checked: number; rebuilt: number; errors: string[] }> {
  const result = { checked: 0, rebuilt: 0, errors: [] as string[] };

  try {
    result.checked++;
    const cached = getCachedEntitlement("__test__");
    if (cached === null) {
      result.rebuilt++;
    }
    clearEntitlementCache();

    result.checked++;
    const healthCache = cachedHealthResponse;
    if (healthCache && Date.now() - healthCache.timestamp > HEALTH_CACHE_TTL * 10) {
      cachedHealthResponse = null;
      result.rebuilt++;
      addResilienceEvent("self_heal_cache_rebuild", "health_cache", { reason: "stale_cache_cleared" });
    }

    result.checked++;
    const now = Date.now();
    let staleRateLimits = 0;
    for (const [key, entry] of rateLimitStore) {
      if (now - entry.windowStart > 300000) {
        rateLimitStore.delete(key);
        staleRateLimits++;
      }
    }
    if (staleRateLimits > 0) {
      result.rebuilt++;
      addResilienceEvent("self_heal_cache_rebuild", "rate_limit_store", { staleEntriesCleared: staleRateLimits });
    }
  } catch (err: any) {
    result.errors.push(err.message);
  }

  return result;
}

export async function selfHealMissingBackups(): Promise<{ checked: number; regenerated: number; errors: string[] }> {
  const result = { checked: 0, regenerated: 0, errors: [] as string[] };

  try {
    result.checked++;
    const lessonCheck = await pool.query(
      `SELECT COUNT(*)::int AS total FROM lessons WHERE status = 'published'`
    ).catch(() => ({ rows: [{ total: 0 }] }));

    const backupCheck = await pool.query(
      `SELECT COUNT(*)::int AS total FROM content_revisions WHERE content_id IN (SELECT id FROM lessons WHERE status = 'published')`
    ).catch(() => ({ rows: [{ total: 0 }] }));

    if (lessonCheck.rows[0]?.total > 0 && backupCheck.rows[0]?.total === 0) {
      try {
        const publishedLessons = await pool.query(
          `SELECT id, title, slug FROM lessons WHERE status = 'published' LIMIT 100`
        );
        for (const lesson of publishedLessons.rows) {
          await pool.query(
            `INSERT INTO content_revisions (id, content_id, revision_number, title, content, status, created_at)
             SELECT gen_random_uuid(), $1, 1, l.title, row_to_json(l)::jsonb, l.status, NOW()
             FROM lessons l WHERE l.id = $1
             ON CONFLICT DO NOTHING`,
            [lesson.id]
          ).catch(() => {});
          result.regenerated++;
        }
        addResilienceEvent("self_heal_backup_regen", "lessons", { regenerated: publishedLessons.rows.length });
      } catch (regenErr: any) {
        addAlert("warning", "self_healing", "Missing Lesson Backups", "Published lessons exist but backup regeneration failed: " + regenErr.message, "self_healing");
        result.errors.push("Lesson backup regen: " + regenErr.message);
      }
    }

    result.checked++;
    const questionCheck = await pool.query(
      `SELECT COUNT(*)::int AS total FROM exam_questions WHERE status = 'published'`
    ).catch(() => ({ rows: [{ total: 0 }] }));

    if (questionCheck.rows[0]?.total > 0) {
      const publishedWithoutRationale = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE status = 'published' AND (rationale IS NULL OR rationale = '')`
      ).catch(() => ({ rows: [{ cnt: 0 }] }));

      if (publishedWithoutRationale.rows[0]?.cnt > 10) {
        result.regenerated++;
        addAlert("warning", "self_healing", "Missing Rationales Detected",
          `${publishedWithoutRationale.rows[0].cnt} published questions missing rationales`,
          "self_healing");
      }
    }

    result.checked++;
    const backupPayloadCheck = await pool.query(
      `SELECT COUNT(*)::int AS total FROM exam_backup_payloads`
    ).catch(() => ({ rows: [{ total: 0 }] }));

    const examDefCheck = await pool.query(
      `SELECT COUNT(*)::int AS total FROM mock_exam_definitions`
    ).catch(() => ({ rows: [{ total: 0 }] }));

    if (examDefCheck.rows[0]?.total > 0 && backupPayloadCheck.rows[0]?.total === 0) {
      try {
        const activeDefs = await pool.query(
          `SELECT id, specialty FROM mock_exam_definitions LIMIT 50`
        );
        for (const def of activeDefs.rows) {
          const questions = await pool.query(
            `SELECT id, stem, options, correct_answer, rationale, difficulty FROM exam_questions
             WHERE exam = $1 AND status = 'published' LIMIT 75`,
            [def.specialty]
          ).catch(() => ({ rows: [] }));

          if (questions.rows.length > 0) {
            await pool.query(
              `INSERT INTO exam_backup_payloads (template_id, payload, question_count, created_at)
               VALUES ($1, $2, $3, NOW())
               ON CONFLICT (template_id) DO NOTHING`,
              [def.id, JSON.stringify({ questions: questions.rows, generatedAt: Date.now() }), questions.rows.length]
            ).catch(() => {});
            result.regenerated++;
          }
        }
        addResilienceEvent("self_heal_backup_regen", "exam_backup_payloads", { regenerated: activeDefs.rows.length });
      } catch (regenErr: any) {
        addAlert("warning", "self_healing", "Missing Exam Backup Payloads", "Backup payload regeneration failed: " + regenErr.message, "self_healing");
        result.errors.push("Exam backup regen: " + regenErr.message);
      }
    }
  } catch (err: any) {
    result.errors.push(err.message);
  }

  return result;
}

export async function selfHealSchemaDrift(): Promise<{ checked: number; repaired: number; errors: string[] }> {
  const result = { checked: 0, repaired: 0, errors: [] as string[] };

  try {
    result.checked++;
    const nullDifficulty = await pool.query(
      `UPDATE exam_questions SET difficulty = 3 WHERE difficulty IS NULL AND status = 'published' RETURNING id`
    ).catch(() => ({ rows: [], rowCount: 0 }));
    if (nullDifficulty.rowCount && nullDifficulty.rowCount > 0) {
      result.repaired += nullDifficulty.rowCount;
      addResilienceEvent("self_heal_schema_drift", "exam_questions.difficulty", { repaired: nullDifficulty.rowCount });
    }

    result.checked++;
    const nullTags = await pool.query(
      `UPDATE exam_questions SET tags = '{}'::text[] WHERE tags IS NULL RETURNING id`
    ).catch(() => ({ rows: [], rowCount: 0 }));
    if (nullTags.rowCount && nullTags.rowCount > 0) {
      result.repaired += nullTags.rowCount;
      addResilienceEvent("self_heal_schema_drift", "exam_questions.tags", { repaired: nullTags.rowCount });
    }

    result.checked++;
    const nullLessonKeywords = await pool.query(
      `UPDATE lessons SET seo_keywords = '{}'::text[] WHERE seo_keywords IS NULL RETURNING id`
    ).catch(() => ({ rows: [], rowCount: 0 }));
    if (nullLessonKeywords.rowCount && nullLessonKeywords.rowCount > 0) {
      result.repaired += nullLessonKeywords.rowCount;
      addResilienceEvent("self_heal_schema_drift", "lessons.seo_keywords", { repaired: nullLessonKeywords.rowCount });
    }

    result.checked++;
    const nullRelated = await pool.query(
      `UPDATE lessons SET related_lesson_slugs = '{}'::text[] WHERE related_lesson_slugs IS NULL RETURNING id`
    ).catch(() => ({ rows: [], rowCount: 0 }));
    if (nullRelated.rowCount && nullRelated.rowCount > 0) {
      result.repaired += nullRelated.rowCount;
      addResilienceEvent("self_heal_schema_drift", "lessons.related_lesson_slugs", { repaired: nullRelated.rowCount });
    }

    result.checked++;
    const nullDistractors = await pool.query(
      `UPDATE exam_questions SET distractor_rationales = '{}'::jsonb WHERE distractor_rationales IS NULL RETURNING id`
    ).catch(() => ({ rows: [], rowCount: 0 }));
    if (nullDistractors.rowCount && nullDistractors.rowCount > 0) {
      result.repaired += nullDistractors.rowCount;
      addResilienceEvent("self_heal_schema_drift", "exam_questions.distractor_rationales", { repaired: nullDistractors.rowCount });
    }
  } catch (err: any) {
    result.errors.push(err.message);
  }

  return result;
}

let selfHealingInterval: ReturnType<typeof setInterval> | null = null;
const SELF_HEALING_INTERVAL_MS = 300000;

export function startPeriodicSelfHealing(): void {
  if (selfHealingInterval) return;
  selfHealingInterval = setInterval(async () => {
    if (!selfHealingActive) return;
    try {
      const { shouldPauseBackgroundJobs } = await import("./memory-monitor");
      if (shouldPauseBackgroundJobs()) {
        return;
      }
    } catch {}
    try {
      const cacheResult = await selfHealCacheCorruption();
      const schemaResult = await selfHealSchemaDrift();
      const backupResult = await selfHealMissingBackups();

      if (cacheResult.rebuilt > 0 || schemaResult.repaired > 0 || backupResult.regenerated > 0) {
        selfHealingLog.unshift({
          action: "periodic_self_heal",
          target: "system",
          result: `cache: ${cacheResult.rebuilt} rebuilt, schema: ${schemaResult.repaired} repaired, backups: ${backupResult.regenerated} regenerated`,
          timestamp: Date.now(),
        });
        if (selfHealingLog.length > 100) selfHealingLog.length = 100;
      }
    } catch (err: any) {
      console.error("[SelfHealing] Periodic check error:", err.message);
    }
  }, SELF_HEALING_INTERVAL_MS);
  console.log(`[SelfHealing] Periodic checks started (every ${SELF_HEALING_INTERVAL_MS / 1000}s)`);
}

export function stopPeriodicSelfHealing(): void {
  if (selfHealingInterval) {
    clearInterval(selfHealingInterval);
    selfHealingInterval = null;
  }
}

interface LoadSheddingConfig {
  enabled: boolean;
  heavyOperationQueueMax: number;
  systemLoadThreshold: number;
  criticalPaths: Set<string>;
}

const loadSheddingConfig: LoadSheddingConfig = {
  enabled: true,
  heavyOperationQueueMax: 10,
  systemLoadThreshold: 0.9,
  criticalPaths: new Set(["/api/auth", "/api/login", "/api/stripe", "/api/health", "/api/user", "/api/entitlement", "/api/admin/tester"]),
};

const heavyOperationQueue: Array<{
  id: string;
  operation: string;
  userId: string | null;
  priority: number;
  queuedAt: number;
}> = [];

export function getLoadSheddingStatus(): { enabled: boolean; queueLength: number; config: { heavyOperationQueueMax: number; systemLoadThreshold: number } } {
  return {
    enabled: loadSheddingConfig.enabled,
    queueLength: heavyOperationQueue.length,
    config: {
      heavyOperationQueueMax: loadSheddingConfig.heavyOperationQueueMax,
      systemLoadThreshold: loadSheddingConfig.systemLoadThreshold,
    },
  };
}

export function loadSheddingMiddleware() {
  let detectedLimitMB = 0;
  try {
    const mm = require("./memory-monitor");
    if (typeof mm.getDetectedMemoryLimitMB === "function") {
      detectedLimitMB = mm.getDetectedMemoryLimitMB();
    }
  } catch {}
  if (detectedLimitMB <= 0) detectedLimitMB = 2048;
  const RSS_SHED_THRESHOLD_MB = Math.round(detectedLimitMB * 0.85);
  return (req: Request, res: Response, next: NextFunction) => {
    if (!loadSheddingConfig.enabled) return next();

    const isCritical = loadSheddingConfig.criticalPaths.has(req.path) ||
      Array.from(loadSheddingConfig.criticalPaths).some(p => req.path.startsWith(p + "/"));
    if (isCritical || req.method === "GET") {
      return next();
    }

    const mem = process.memoryUsage();
    const rssMB = mem.rss / (1024 * 1024);

    if (rssMB < RSS_SHED_THRESHOLD_MB) {
      return next();
    }

    const user = (req as any).authUser;
    const isPaid = user?.tier && user.tier !== "free";

    if (isPaid) {
      return next();
    }

    return res.status(503).json({
      error: "Server is under heavy load. Please try again shortly.",
      retryAfter: 30,
      code: "LOAD_SHEDDING",
    });
  };
}

export function queueHeavyOperation(operation: string, userId: string | null, isPaid: boolean): { queued: boolean; position?: number; reason?: string } {
  if (heavyOperationQueue.length >= loadSheddingConfig.heavyOperationQueueMax) {
    if (!isPaid) {
      return { queued: false, reason: "Queue full. Paid subscribers are prioritized." };
    }
    const freeIdx = heavyOperationQueue.findIndex(op => op.priority === 0);
    if (freeIdx >= 0) {
      heavyOperationQueue.splice(freeIdx, 1);
    } else {
      return { queued: false, reason: "Queue full." };
    }
  }

  const entry = {
    id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    operation,
    userId,
    priority: isPaid ? 1 : 0,
    queuedAt: Date.now(),
  };

  if (isPaid) {
    const insertIdx = heavyOperationQueue.findIndex(op => op.priority < 1);
    if (insertIdx >= 0) {
      heavyOperationQueue.splice(insertIdx, 0, entry);
    } else {
      heavyOperationQueue.push(entry);
    }
  } else {
    heavyOperationQueue.push(entry);
  }

  return { queued: true, position: heavyOperationQueue.indexOf(entry) + 1 };
}

export function dequeueHeavyOperation(): typeof heavyOperationQueue[0] | null {
  return heavyOperationQueue.shift() || null;
}

export function examStartRateLimitMiddleware() {
  return rateLimitMiddleware({ windowMs: 60000, maxRequests: 5, keyPrefix: "exam_start", subscriberMultiplier: 3 });
}

export function aiHeavyRateLimitMiddleware() {
  return rateLimitMiddleware({ windowMs: 60000, maxRequests: 10, keyPrefix: "ai_heavy", subscriberMultiplier: 3 });
}

export function adminApiRateLimitMiddleware() {
  return rateLimitMiddleware({ windowMs: 60000, maxRequests: 120, keyPrefix: "admin_api", subscriberMultiplier: 1 });
}

export function sensitiveApiRateLimitMiddleware() {
  return rateLimitMiddleware({ windowMs: 300000, maxRequests: 20, keyPrefix: "sensitive", subscriberMultiplier: 2 });
}

const entitlementCache = new BoundedMap<string, { result: any; expiresAt: number }>(500, 30000);
const ENTITLEMENT_CACHE_TTL = 30000;

export function getCachedEntitlement(userId: string): any | null {
  const cached = entitlementCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.result;
  entitlementCache.delete(userId);
  return null;
}

export function setCachedEntitlement(userId: string, result: any): void {
  entitlementCache.set(userId, { result, expiresAt: Date.now() + ENTITLEMENT_CACHE_TTL });
}

export function clearEntitlementCache(userId?: string): void {
  if (userId) {
    entitlementCache.delete(userId);
  } else {
    entitlementCache.clear();
  }
}

const provisionalAccessGrants = new Map<string, { grantedAt: number; reason: string; expiresAt: number }>();
const PROVISIONAL_ACCESS_DURATION = 3600000;
const MAX_PROVISIONAL_GRANTS = 500;

export function grantProvisionalAccess(userId: string, reason: string): void {
  if (provisionalAccessGrants.size >= MAX_PROVISIONAL_GRANTS) {
    const now = Date.now();
    for (const [key, grant] of provisionalAccessGrants) {
      if (now > grant.expiresAt) {
        provisionalAccessGrants.delete(key);
      }
    }
    if (provisionalAccessGrants.size >= MAX_PROVISIONAL_GRANTS) {
      const firstKey = provisionalAccessGrants.keys().next().value;
      if (firstKey) provisionalAccessGrants.delete(firstKey);
    }
  }
  provisionalAccessGrants.set(userId, {
    grantedAt: Date.now(),
    reason,
    expiresAt: Date.now() + PROVISIONAL_ACCESS_DURATION,
  });
  addResilienceEvent("provisional_access_granted", userId, { reason });
}

export function hasProvisionalAccess(userId: string): boolean {
  const grant = provisionalAccessGrants.get(userId);
  if (!grant) return false;
  if (Date.now() > grant.expiresAt) {
    provisionalAccessGrants.delete(userId);
    return false;
  }
  return true;
}

export function getProvisionalAccessGrants(): Array<{ userId: string; grantedAt: number; reason: string; expiresAt: number }> {
  const result: Array<{ userId: string; grantedAt: number; reason: string; expiresAt: number }> = [];
  for (const [userId, grant] of provisionalAccessGrants) {
    if (Date.now() < grant.expiresAt) {
      result.push({ userId, ...grant });
    }
  }
  return result;
}

export interface EntitlementDecision {
  hasAccess: boolean;
  accessSource: string;
  tier: string;
  fallbackEligible: boolean;
  provisionalAccess: boolean;
  decisionReason: string;
  timestamp: number;
}

export function makeEntitlementDecision(user: any, feature: string): EntitlementDecision {
  const userId = user?.id || "unknown";
  const tier = user?.tier || "free";

  if (!user) {
    return {
      hasAccess: false, accessSource: "none", tier: "free",
      fallbackEligible: false, provisionalAccess: false,
      decisionReason: "not_authenticated", timestamp: Date.now(),
    };
  }

  if (tier === "admin") {
    return {
      hasAccess: true, accessSource: "admin", tier,
      fallbackEligible: true, provisionalAccess: false,
      decisionReason: "admin_bypass", timestamp: Date.now(),
    };
  }

  if (hasProvisionalAccess(userId)) {
    return {
      hasAccess: true, accessSource: "provisional", tier,
      fallbackEligible: true, provisionalAccess: true,
      decisionReason: "provisional_access_active", timestamp: Date.now(),
    };
  }

  if (isEmergencyMode()) {
    return {
      hasAccess: true, accessSource: "emergency_mode", tier,
      fallbackEligible: true, provisionalAccess: false,
      decisionReason: "emergency_mode_active", timestamp: Date.now(),
    };
  }

  const isPaid = tier !== "free";
  return {
    hasAccess: isPaid, accessSource: isPaid ? "subscription" : "none", tier,
    fallbackEligible: isPaid, provisionalAccess: false,
    decisionReason: isPaid ? `tier_${tier}` : "free_tier", timestamp: Date.now(),
  };
}

async function resolveAdmin(req: Request, res: Response): Promise<any | null> {
  try {
    const { requireAdmin } = await import("./admin-auth");
    return await requireAdmin(req as any, res as any);
  } catch {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
}

async function checkAdminPermission(admin: any, actionCategory: string, res: Response): Promise<boolean> {
  const { hasPermission } = await import("./admin-auth");
  const role = admin.admin_role || admin.adminRole || "super_admin";
  if (!hasPermission(role, actionCategory)) {
    res.status(403).json({ error: "Insufficient permissions", requiredPermission: actionCategory, currentRole: role });
    return false;
  }
  return true;
}

async function requireConfirmationToken(req: Request, res: Response, admin: any, actionCategory: string): Promise<boolean> {
  const { issueConfirmationToken, validateConfirmationToken } = await import("./admin-auth");
  const confirmToken = String((req as any).headers?.["x-confirmation-token"] || (req as any).body?.confirmationToken || "");
  if (!confirmToken) {
    const token = issueConfirmationToken(admin.id, actionCategory);
    res.status(428).json({
      error: "Destructive action requires confirmation",
      confirmationToken: token,
      action: actionCategory,
      message: "Re-submit with the provided confirmationToken to proceed",
    });
    return false;
  }
  const validation = validateConfirmationToken(confirmToken, admin.id, actionCategory);
  if (!validation.valid) {
    res.status(403).json({ error: "Invalid or expired confirmation token" });
    return false;
  }
  return true;
}

async function auditOperatorAction(req: Request, admin: any, action: string, actionCategory: string, entityType: string, entityId?: string, opts?: { targetType?: string; targetId?: string; reason?: string; confirmationRequired?: boolean; beforeState?: any; afterState?: any }) {
  const { logOperatorAction } = await import("./admin-auth");
  await logOperatorAction({
    req: req as any,
    actor: admin,
    action,
    actionCategory,
    entityType,
    entityId: entityId || null,
    targetType: opts?.targetType || null,
    targetId: opts?.targetId || null,
    reason: opts?.reason || null,
    confirmationRequired: opts?.confirmationRequired || false,
    beforeState: opts?.beforeState,
    afterState: opts?.afterState,
  });
}

async function resolveAdminWithRole(req: Request, res: Response, ...allowedRoles: string[]): Promise<any | null> {
  try {
    const { requireAdmin } = await import("./admin-auth");
    const admin = await requireAdmin(req as any, res as any);
    if (!admin) return null;

    const userRole: string = admin.admin_role || admin.adminRole || "super_admin";
    if (userRole === "super_admin") {
      (req as any).adminUser = admin;
      return admin;
    }
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: "Insufficient admin permissions", required: allowedRoles, current: userRole });
      return null;
    }
    (req as any).adminUser = admin;
    return admin;
  } catch {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
}

function requireConfirmToken(req: any, res: any, admin: any, action: string): boolean {
  try {
    const { issueConfirmationToken, validateConfirmationToken } = require("./admin-auth");
    const confirmToken = req.headers?.["x-confirm-token"] as string;
    if (!confirmToken || !validateConfirmationToken(confirmToken, admin?.id, action).valid) {
      const token = issueConfirmationToken(admin?.id, action);
      res.status(428).json({
        error: "Confirmation required for this destructive action",
        confirmToken: token,
        action,
      });
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

export const isSafeMode = isEmergencyMode;
export const activateSafeMode = activateEmergencyMode;
export const deactivateSafeMode = deactivateEmergencyMode;
export const getSafeModeStatus = getEmergencyModeStatus;

const SAFE_MODE_CORE_READ_PATHS = new Set([
  "/api/lessons",
  "/api/flashcards",
  "/api/flashcard-decks",
  "/api/mock-exams",
  "/api/exam-questions",
  "/api/question-bank",
  "/api/downloads",
  "/api/verified-snapshots",
  "/api/me/entitlements",
  "/api/me/subscription",
  "/api/entitlement/resolve",
  "/api/billing/plans",
  "/api/pricing/plans",
  "/api/v1/test-banks",
  "/api/v1/cat-exams",
  "/api/v1/mock-exams",
  "/api/v1/lessons",
  "/api/v1/dashboard",
  "/api/v1/question-history",
  "/api/test-banks",
  "/api/cat-exams",
  "/api/exams",
  "/api/kill-switches",
  "/api/hero-stats",
  "/api/site-images",
  "/api/region",
  "/api/public/platform-proof",
  "/api/subscription",
  "/api/daily-goals",
  "/api/dashboard",
  "/api/exam-planner",
  "/api/decks",
  "/api/flashcard-bank",
  "/api/flashcard-preview",
  "/api/progress",
  "/api/flashcard-usage",
]);

const SAFE_MODE_INFRA_PATHS = new Set([
  "/api/health",
  "/api/platform/status",
  "/api/platform/feature-flags",
  "/api/platform/minimal-core",
  "/api/exam-health",
  "/api/admin/resilience",
  "/api/auth/",
  "/api/user/",
  "/api/entitlement/",
]);

const SAFE_MODE_ADMIN_WRITE_EXCEPTIONS = new Set([
  "/api/auth",
  "/api/login",
  "/api/admin/resilience",
  "/api/admin/ops",
  "/api/admin/tester",
  "/api/admin/verify",
  "/api/admin/analytics",
  "/api/admin/users",
  "/api/admin/preview-mode",
  "/api/admin/kill-switch",
  "/api/admin/incidents",
  "/api/admin/memory",
  "/api/admin/health",
  "/api/stripe/webhook",
  "/api/boot-beacon",
  "/api/exam-incident-report",
  "/api/billing/refresh-entitlements",
  "/api/billing/restore-access",
  "/api/v1/cat-exams",
  "/api/v1/mock-exams",
  "/api/v1/lessons",
  "/api/v1/analytics/events",
  "/api/v1/question-history",
  "/api/exam/",
]);

const SAFE_MODE_STATIC_FALLBACKS: Record<string, any> = {
  "/api/lessons": { items: [], message: "Lessons are temporarily unavailable. Please try again shortly.", _static: true },
  "/api/flashcards": { items: [], message: "Flashcards are temporarily unavailable. Please try again shortly.", _static: true },
  "/api/flashcard-decks": { items: [], message: "Flashcard decks are temporarily unavailable. Please try again shortly.", _static: true },
  "/api/mock-exams": { items: [], message: "Mock exams are temporarily unavailable. Please try again shortly.", _static: true },
  "/api/exam-questions": { items: [], count: 0, message: "Exam questions are temporarily unavailable. Please try again shortly.", _static: true },
  "/api/question-bank": { items: [], count: 0, message: "Question bank is temporarily unavailable. Please try again shortly.", _static: true },
  "/api/downloads": { items: [], message: "Downloads are temporarily unavailable. Please try again shortly.", _static: true },
  "/api/verified-snapshots": { items: [], message: "Verified snapshots are temporarily unavailable. Please try again shortly.", _static: true },
};

interface ErrorBudget {
  subsystem: string;
  totalBudget: number;
  consumed: number;
  windowMs: number;
  errors: number[];
  threshold: number;
  escalationLevel: "normal" | "warning" | "critical" | "exhausted";
  autoDisabledFeatures: string[];
  lastEscalation: number | null;
}

const errorBudgets = new Map<string, ErrorBudget>();

const DEFAULT_ERROR_BUDGETS: Array<{
  subsystem: string;
  totalBudget: number;
  windowMs: number;
  threshold: number;
}> = [
  { subsystem: "database", totalBudget: 50, windowMs: 300000, threshold: 0.5 },
  { subsystem: "ai_service", totalBudget: 100, windowMs: 300000, threshold: 0.6 },
  { subsystem: "exam_service", totalBudget: 30, windowMs: 300000, threshold: 0.4 },
  { subsystem: "stripe", totalBudget: 50, windowMs: 300000, threshold: 0.5 },
  { subsystem: "email_service", totalBudget: 80, windowMs: 300000, threshold: 0.6 },
  { subsystem: "sms_service", totalBudget: 80, windowMs: 300000, threshold: 0.6 },
  { subsystem: "content_generation", totalBudget: 100, windowMs: 300000, threshold: 0.6 },
  { subsystem: "seo_generation", totalBudget: 100, windowMs: 300000, threshold: 0.7 },
  { subsystem: "auth_service", totalBudget: 40, windowMs: 300000, threshold: 0.4 },
];

const THROTTLE_PRIORITY: string[][] = [
  ["ai_tutor", "ai_content_gen", "advanced_analytics"],
  ["seo_generation", "new_ui_components"],
  ["email_notifications", "sms_notifications"],
];

export function initErrorBudgets(): void {
  for (const def of DEFAULT_ERROR_BUDGETS) {
    errorBudgets.set(def.subsystem, {
      subsystem: def.subsystem,
      totalBudget: def.totalBudget,
      consumed: 0,
      windowMs: def.windowMs,
      errors: [],
      threshold: def.threshold,
      escalationLevel: "normal",
      autoDisabledFeatures: [],
      lastEscalation: null,
    });
  }
}

const SUBSYSTEM_NAME_MAP: Record<string, string> = {
  "auth": "auth_service",
  "exams": "exam_service",
  "email": "email_service",
  "sms": "sms_service",
  "content": "content_generation",
  "seo": "seo_generation",
};

function normalizeSubsystemName(name: string): string {
  return SUBSYSTEM_NAME_MAP[name] || name;
}

export function recordErrorBudgetEvent(subsystem: string, count: number = 1): void {
  subsystem = normalizeSubsystemName(subsystem);
  let budget = errorBudgets.get(subsystem);
  if (!budget) {
    budget = {
      subsystem,
      totalBudget: 50,
      consumed: 0,
      windowMs: 300000,
      errors: [],
      threshold: 0.5,
      escalationLevel: "normal",
      autoDisabledFeatures: [],
      lastEscalation: null,
    };
    errorBudgets.set(subsystem, budget);
  }

  const now = Date.now();
  for (let i = 0; i < count; i++) {
    budget.errors.push(now);
  }
  budget.errors = budget.errors.filter(t => now - t < budget.windowMs);
  budget.consumed = budget.errors.length;

  const prevLevel = budget.escalationLevel;
  recomputeEscalationLevel(budget);
  const ratio = budget.consumed / budget.totalBudget;

  if (budget.escalationLevel !== prevLevel && budget.escalationLevel !== "normal") {
    budget.lastEscalation = now;
    addResilienceEvent("error_budget_escalation", subsystem, {
      level: budget.escalationLevel,
      consumed: budget.consumed,
      total: budget.totalBudget,
      ratio: Math.round(ratio * 100),
    });

    if (budget.escalationLevel === "warning") {
      addAlert("warning", "error_budget", `Error Budget Warning: ${subsystem}`, `${subsystem} error budget at ${Math.round(ratio * 100)}% (${budget.consumed}/${budget.totalBudget})`, subsystem);
    } else if (budget.escalationLevel === "critical") {
      addAlert("warning", "error_budget", `Error Budget Critical: ${subsystem}`, `${subsystem} error budget at ${Math.round(ratio * 100)}% — auto-throttling non-essential features`, subsystem);
      autoThrottleFeatures(subsystem, 1);
    } else if (budget.escalationLevel === "exhausted") {
      addAlert("critical", "error_budget", `Error Budget Exhausted: ${subsystem}`, `${subsystem} error budget fully consumed — escalating to safe mode`, subsystem);
      autoThrottleFeatures(subsystem, 2);
      const criticalSubsystems = new Set(["database", "exam_service", "auth_service"]);
      if (criticalSubsystems.has(subsystem)) {
        activateEmergencyMode(`Error budget exhausted for critical subsystem: ${subsystem}`);
      }
    }
  }
}

function autoThrottleFeatures(subsystem: string, severity: number): void {
  const budget = errorBudgets.get(subsystem);
  if (!budget) return;

  const maxTier = Math.min(severity, THROTTLE_PRIORITY.length);
  for (let i = 0; i < maxTier; i++) {
    for (const featureKey of THROTTLE_PRIORITY[i]) {
      const flag = featureFlags.get(featureKey);
      if (flag && flag.enabled && flag.adminOverride === null) {
        flag.enabled = false;
        flag.disabledAt = Date.now();
        flag.disabledReason = `auto_throttled_by_error_budget:${subsystem}`;
        budget.autoDisabledFeatures.push(featureKey);
        addResilienceEvent("feature_auto_throttled", featureKey, { subsystem, severity });
        console.warn(`[ErrorBudget] Auto-throttled feature "${featureKey}" due to ${subsystem} budget pressure`);
      }
    }
  }
}

function recomputeEscalationLevel(budget: ErrorBudget): void {
  const ratio = budget.consumed / budget.totalBudget;
  if (ratio >= 1.0) {
    budget.escalationLevel = "exhausted";
  } else if (ratio >= budget.threshold) {
    budget.escalationLevel = "critical";
  } else if (ratio >= budget.threshold * 0.5) {
    budget.escalationLevel = "warning";
  } else {
    budget.escalationLevel = "normal";
  }
}

export function getErrorBudgets(): ErrorBudget[] {
  const now = Date.now();
  for (const budget of errorBudgets.values()) {
    budget.errors = budget.errors.filter(t => now - t < budget.windowMs);
    budget.consumed = budget.errors.length;
    recomputeEscalationLevel(budget);
  }
  return Array.from(errorBudgets.values()).map(b => ({
    ...b,
    errors: [],
  }));
}

export function resetErrorBudget(subsystem: string): void {
  const budget = errorBudgets.get(subsystem);
  if (!budget) return;
  budget.errors = [];
  budget.consumed = 0;
  budget.escalationLevel = "normal";

  for (const featureKey of budget.autoDisabledFeatures) {
    const flag = featureFlags.get(featureKey);
    if (flag && flag.disabledReason?.startsWith("auto_throttled_by_error_budget")) {
      flag.enabled = true;
      flag.disabledAt = null;
      flag.disabledReason = null;
    }
  }
  budget.autoDisabledFeatures = [];
  addResilienceEvent("error_budget_reset", subsystem, {});
}

let minimalCoreActive = false;
let minimalCoreReason: string | null = null;
let minimalCoreActivatedAt: number | null = null;

export function isMinimalCoreMode(): boolean {
  return minimalCoreActive;
}

export function activateMinimalCore(reason: string, actor?: string): void {
  if (minimalCoreActive) return;
  minimalCoreActive = true;
  minimalCoreReason = reason;
  minimalCoreActivatedAt = Date.now();
  console.warn(`[MinimalCore] ACTIVATED: ${reason}`);
  addResilienceEvent("minimal_core_activated", "system", { reason, actor });
  addAlert("warning", "minimal_core", "Minimal Core Mode Activated", `Platform switched to minimal core mode. Reason: ${reason}`, "minimal_core");
  addResilienceAudit("minimal_core_activate", "platform", "minimal_core", { reason }, actor || null);

  const heavyFeatures = ["ai_tutor", "ai_content_gen", "seo_generation", "advanced_analytics", "new_ui_components", "offline_sync"];
  for (const key of heavyFeatures) {
    const flag = featureFlags.get(key);
    if (flag && flag.enabled && flag.adminOverride === null) {
      flag.enabled = false;
      flag.disabledAt = Date.now();
      flag.disabledReason = "minimal_core_mode";
    }
  }
}

export function deactivateMinimalCore(actor?: string): void {
  if (!minimalCoreActive) return;
  const duration = minimalCoreActivatedAt ? Date.now() - minimalCoreActivatedAt : 0;
  minimalCoreActive = false;
  minimalCoreReason = null;
  minimalCoreActivatedAt = null;
  addResilienceEvent("minimal_core_deactivated", "system", { actor, durationMs: duration });
  addResilienceAudit("minimal_core_deactivate", "platform", "minimal_core", { actor, durationMs: duration }, actor || null);

  for (const flag of featureFlags.values()) {
    if (flag.disabledReason === "minimal_core_mode") {
      flag.enabled = true;
      flag.disabledAt = null;
      flag.disabledReason = null;
    }
  }
}

export function getMinimalCoreStatus(): { active: boolean; reason: string | null; activatedAt: number | null } {
  return { active: minimalCoreActive, reason: minimalCoreReason, activatedAt: minimalCoreActivatedAt };
}

interface CacheWarmEntry {
  key: string;
  data: any;
  warmedAt: number;
  ttlMs: number;
  stale: boolean;
}

const warmCache = new BoundedMap<string, CacheWarmEntry>(200, 10 * 60 * 1000);
let cacheWarmStatus: {
  lastWarmAt: number | null;
  routesWarmed: number;
  warming: boolean;
  errors: string[];
} = { lastWarmAt: null, routesWarmed: 0, warming: false, errors: [] };
let keepWarmTimer: ReturnType<typeof setInterval> | null = null;
const KEEP_WARM_INTERVAL_MS = 300000;
const WARM_CACHE_TTL_MS = 600000;

export function getCacheWarmStatus() {
  return {
    ...cacheWarmStatus,
    cachedEntries: warmCache.size,
    entries: Array.from(warmCache.entries()).map(([key, entry]) => ({
      key,
      warmedAt: entry.warmedAt,
      stale: Date.now() - entry.warmedAt > entry.ttlMs,
      hasData: !!entry.data,
    })),
  };
}

export function getWarmCacheEntry(key: string): any | null {
  const entry = warmCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.warmedAt > entry.ttlMs) {
    entry.stale = true;
    return null;
  }
  return entry.data;
}

async function warmCriticalRoute(key: string, queryFn: () => Promise<any>): Promise<void> {
  try {
    const data = await queryFn();
    warmCache.set(key, {
      key,
      data,
      warmedAt: Date.now(),
      ttlMs: WARM_CACHE_TTL_MS,
      stale: false,
    });
  } catch (err: any) {
    cacheWarmStatus.errors.push(`${key}: ${err.message}`);
    console.error(`[ColdStart] Failed to warm "${key}":`, err.message);
  }
}

export async function prewarmCriticalRoutes(): Promise<void> {
  if (cacheWarmStatus.warming) return;
  cacheWarmStatus.warming = true;
  cacheWarmStatus.errors = [];
  const startTime = Date.now();

  try {
    await warmCriticalRoute("published_questions_count", async () => {
      const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE status = 'published'");
      return { count: r.rows[0]?.cnt || 0 };
    });

    await warmCriticalRoute("published_questions_by_tier", async () => {
      const r = await pool.query("SELECT tier, COUNT(*)::int AS cnt FROM exam_questions WHERE status = 'published' GROUP BY tier");
      return r.rows;
    });

    await warmCriticalRoute("flashcard_deck_summary", async () => {
      const r = await pool.query("SELECT id, title, slug, tier, card_count FROM flashcard_decks WHERE visibility = 'public' ORDER BY card_count DESC LIMIT 100");
      return r.rows;
    });

    await warmCriticalRoute("published_lessons_count", async () => {
      const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM lessons WHERE status = 'published'");
      return { count: r.rows[0]?.cnt || 0 };
    });

    await warmCriticalRoute("popular_lessons", async () => {
      const r = await pool.query("SELECT id, title, slug, category, tier FROM lessons WHERE status = 'published' ORDER BY id DESC LIMIT 50");
      return r.rows;
    });

    await warmCriticalRoute("active_users_count", async () => {
      const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM users WHERE tier != 'free' AND tier IS NOT NULL");
      return { count: r.rows[0]?.cnt || 0 };
    });

    cacheWarmStatus.routesWarmed = warmCache.size;
    cacheWarmStatus.lastWarmAt = Date.now();
    console.log(`[ColdStart] Prewarmed ${warmCache.size} critical routes in ${Date.now() - startTime}ms`);
  } catch (err: any) {
    console.error("[ColdStart] Prewarm error:", err.message);
    cacheWarmStatus.errors.push(`prewarm_general: ${err.message}`);
    addAlert("warning", "cold_start", "Prewarm Failed", `Critical route prewarming failed: ${err.message}. Safe mode fallback cache may be empty.`, "prewarm");
  } finally {
    cacheWarmStatus.warming = false;
  }
}

export function startKeepWarmInterval(): void {
  if (keepWarmTimer) return;
  keepWarmTimer = setInterval(async () => {
    try {
      const { shouldPauseBackgroundJobs } = await import("./memory-monitor");
      if (shouldPauseBackgroundJobs()) return;
    } catch {}
    prewarmCriticalRoutes().catch(err => console.error("[KeepWarm] Error:", err.message));
  }, KEEP_WARM_INTERVAL_MS);
  console.log(`[KeepWarm] Started keep-warm interval (${KEEP_WARM_INTERVAL_MS / 1000}s)`);
}

export function stopKeepWarmInterval(): void {
  if (keepWarmTimer) {
    clearInterval(keepWarmTimer);
    keepWarmTimer = null;
  }
}

const SAFE_MODE_ROUTE_CACHE_MAP: Record<string, string> = {
  "/api/lessons": "popular_lessons",
  "/api/flashcards": "flashcard_deck_summary",
  "/api/flashcard-decks": "flashcard_deck_summary",
  "/api/exam-questions": "published_questions_count",
  "/api/question-bank": "published_questions_count",
  "/api/mock-exams": "published_questions_count",
};

function getSafeModeResponse(path: string): any {
  const cached = (() => {
    for (const [routePrefix, cacheKey] of Object.entries(SAFE_MODE_ROUTE_CACHE_MAP)) {
      if (path.startsWith(routePrefix)) {
        return getWarmCacheEntry(cacheKey);
      }
    }
    return null;
  })();

  if (cached) {
    return { data: cached, _safeMode: true, _cached: true };
  }

  for (const [routePrefix, fallback] of Object.entries(SAFE_MODE_STATIC_FALLBACKS)) {
    if (path.startsWith(routePrefix)) {
      return { data: fallback, _safeMode: true, _static: true };
    }
  }

  return null;
}

export function readOnlyEnforcement() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!emergencyModeActive) return next();

    if (req.method === "OPTIONS") {
      return next();
    }

    if (!req.path.startsWith("/api/")) {
      return next();
    }

    const isInfraPath = Array.from(SAFE_MODE_INFRA_PATHS).some(p => req.path.startsWith(p));
    if (isInfraPath) {
      return next();
    }

    const isAdminException = Array.from(SAFE_MODE_ADMIN_WRITE_EXCEPTIONS).some(p => req.path.startsWith(p));

    if (req.method === "GET" || req.method === "HEAD") {
      const isCoreRead = Array.from(SAFE_MODE_CORE_READ_PATHS).some(p => req.path.startsWith(p));

      if (isCoreRead) {
        const fallback = getSafeModeResponse(req.path);
        if (fallback) {
          return res.json(fallback);
        }
        return next();
      }

      if (isAdminException) {
        return next();
      }

      return res.status(503).json({
        error: "This endpoint is unavailable during safe mode.",
        safeMode: true,
        message: "We're running in safe mode. Only core reading features remain available.",
        allowedReadPaths: Array.from(SAFE_MODE_CORE_READ_PATHS),
      });
    }

    if (isAdminException) {
      return next();
    }

    return res.status(503).json({
      error: "Write operations are disabled during safe mode.",
      safeMode: true,
      emergencyMode: true,
      message: "We're running in safe mode. All write operations are temporarily disabled.",
    });
  };
}

const MINIMAL_CORE_BLOCKED_ROUTES = new Set([
  "/api/ai-tutor",
  "/api/ai/tutor",
  "/api/ai/content",
  "/api/ai/generate",
  "/api/seo/generate",
  "/api/analytics/advanced",
  "/api/admin/seo",
]);

const MINIMAL_CORE_HEAVY_FIELDS = new Set([
  "animations", "richMedia", "interactiveWidgets", "videoEmbeds",
  "advancedCharts", "threeDModels", "lottieData", "svgAnimations",
]);

function stripHeavyContent(data: any): any {
  if (data === null || data === undefined || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(stripHeavyContent);
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (MINIMAL_CORE_HEAVY_FIELDS.has(key)) continue;
    result[key] = (typeof value === "object" && value !== null) ? stripHeavyContent(value) : value;
  }
  return result;
}

export function minimalCoreEnforcement() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!minimalCoreActive) return next();

    const isBlocked = Array.from(MINIMAL_CORE_BLOCKED_ROUTES).some(p => req.path.startsWith(p));
    if (isBlocked) {
      return res.status(503).json({
        error: "This feature is disabled during minimal core mode.",
        minimalCore: true,
        message: "Platform is in minimal core mode. Only essential text-first features are active.",
      });
    }

    if (req.path.startsWith("/api/")) {
      res.setHeader("X-Minimal-Core", "true");
      res.setHeader("X-Render-Mode", "text-first");

      const originalJson = res.json.bind(res);
      res.json = function(body: any) {
        const stripped = stripHeavyContent(body);
        if (stripped && typeof stripped === "object" && !Array.isArray(stripped)) {
          stripped._renderMode = "text-first";
          stripped._minimalCore = true;
        }
        return originalJson(stripped);
      };
    }

    return next();
  };
}

// ==========================================
// SCOPE ISOLATION LAYER
// ==========================================

type FailureDomainType = "profession" | "exam_type" | "language" | "region";

interface ScopedFailureDomain {
  type: FailureDomainType;
  value: string;
  errorCount: number;
  errors: number[];
  windowMs: number;
  threshold: number;
  quarantined: boolean;
  quarantinedAt: number | null;
  quarantineReason: string | null;
  killSwitchActive: boolean;
  killSwitchReason: string | null;
  killSwitchBy: string | null;
  lastError: number | null;
}

const scopedFailureDomains = new BoundedMap<string, ScopedFailureDomain>(200, 5 * 60 * 1000);
const SCOPED_WINDOW_MS = 300000;
const SCOPED_THRESHOLD = 15;

function scopeKey(type: FailureDomainType, value: string): string {
  return `${type}:${value}`;
}

function getOrCreateDomain(type: FailureDomainType, value: string): ScopedFailureDomain {
  const key = scopeKey(type, value);
  let domain = scopedFailureDomains.get(key);
  if (!domain) {
    domain = {
      type, value, errorCount: 0, errors: [], windowMs: SCOPED_WINDOW_MS,
      threshold: SCOPED_THRESHOLD, quarantined: false, quarantinedAt: null,
      quarantineReason: null, killSwitchActive: false, killSwitchReason: null,
      killSwitchBy: null, lastError: null,
    };
    scopedFailureDomains.set(key, domain);
  }
  return domain;
}

export function recordScopedError(type: FailureDomainType, value: string, source?: string): void {
  const domain = getOrCreateDomain(type, value);
  const now = Date.now();
  domain.errors.push(now);
  domain.errors = domain.errors.filter(t => now - t < domain.windowMs);
  domain.errorCount = domain.errors.length;
  domain.lastError = now;

  if (domain.errorCount >= domain.threshold && !domain.quarantined) {
    domain.quarantined = true;
    domain.quarantinedAt = now;
    domain.quarantineReason = `Auto-quarantined: ${domain.errorCount} errors in ${domain.windowMs / 1000}s`;
    addResilienceEvent("scope_quarantined", `${type}:${value}`, { errorCount: domain.errorCount, source });
    addAlert("warning", "scope_isolation", `Scope Quarantined: ${type}:${value}`, domain.quarantineReason, `${type}:${value}`);
  }
}

export function isScopeQuarantined(type: FailureDomainType, value: string): boolean {
  const domain = scopedFailureDomains.get(scopeKey(type, value));
  if (!domain) return false;
  return domain.quarantined || domain.killSwitchActive;
}

export function setScopedKillSwitch(type: FailureDomainType, value: string, active: boolean, reason?: string, actor?: string): void {
  const domain = getOrCreateDomain(type, value);
  domain.killSwitchActive = active;
  domain.killSwitchReason = active ? (reason || "admin_action") : null;
  domain.killSwitchBy = active ? (actor || null) : null;
  addResilienceEvent(active ? "scoped_kill_switch_activated" : "scoped_kill_switch_deactivated", `${type}:${value}`, { reason, actor });
  addResilienceAudit(active ? "scoped_kill_switch_on" : "scoped_kill_switch_off", "scope_isolation", `${type}:${value}`, { reason }, actor || null);
}

export function liftScopeQuarantine(type: FailureDomainType, value: string, actor?: string): void {
  const domain = scopedFailureDomains.get(scopeKey(type, value));
  if (!domain) return;
  domain.quarantined = false;
  domain.quarantinedAt = null;
  domain.quarantineReason = null;
  domain.errors = [];
  domain.errorCount = 0;
  addResilienceEvent("scope_quarantine_lifted", `${type}:${value}`, { actor });
}

export function getScopedFailureDomains(): ScopedFailureDomain[] {
  const now = Date.now();
  for (const domain of scopedFailureDomains.values()) {
    domain.errors = domain.errors.filter(t => now - t < domain.windowMs);
    domain.errorCount = domain.errors.length;
  }
  return Array.from(scopedFailureDomains.values()).map(d => ({ ...d, errors: [] }));
}

// ==========================================
// PROGRESSIVE DEGRADATION ENGINE (5 levels)
// ==========================================

type DegradationLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface DegradationState {
  level: DegradationLevel;
  levelName: string;
  activeSince: number | null;
  autoEscalated: boolean;
  manualOverride: DegradationLevel | null;
  errorRateWindow: number[];
  renderFailures: number[];
  latencySpikes: number[];
  escalationHistory: Array<{ from: number; to: number; reason: string; timestamp: number }>;
}

const DEGRADATION_LEVEL_NAMES: Record<DegradationLevel, string> = {
  0: "normal",
  1: "warning",
  2: "high",
  3: "critical",
  4: "emergency",
  5: "substitute_content",
};

const DEGRADATION_LADDER: Record<number, { label: string; disabledFeatures: string[]; enabledAlways: string[] }> = {
  0: { label: "normal", disabledFeatures: [], enabledAlways: [] },
  1: { label: "warning", disabledFeatures: ["ai_generation", "analytics_aggregation"], enabledAlways: ["login", "dashboard", "exam_list", "exam_open", "question_answering", "subscription"] },
  2: { label: "high", disabledFeatures: ["ai_generation", "analytics_aggregation", "content_expansion", "bulk_operations"], enabledAlways: ["login", "dashboard", "exam_list", "exam_open", "question_answering", "subscription"] },
  3: { label: "critical", disabledFeatures: ["ai_generation", "analytics_aggregation", "content_expansion", "bulk_operations", "seo_generation", "blog_automation", "background_jobs"], enabledAlways: ["login", "dashboard", "exam_list", "exam_open", "question_answering", "subscription"] },
  4: { label: "emergency", disabledFeatures: ["ai_generation", "analytics_aggregation", "content_expansion", "bulk_operations", "seo_generation", "blog_automation", "background_jobs", "non_essential_api"], enabledAlways: ["login", "dashboard", "exam_list", "exam_open", "question_answering", "subscription"] },
  5: { label: "substitute_content", disabledFeatures: ["ai_generation", "analytics_aggregation", "content_expansion", "bulk_operations", "seo_generation", "blog_automation", "background_jobs", "non_essential_api", "dynamic_content"], enabledAlways: ["login", "dashboard", "exam_list", "exam_open", "question_answering", "subscription"] },
};

export function getDegradationLadder(): typeof DEGRADATION_LADDER {
  return DEGRADATION_LADDER;
}

export function isFeatureDisabledByDegradation(feature: string): boolean {
  const level = degradationState.manualOverride !== null ? degradationState.manualOverride : degradationState.level;
  const config = DEGRADATION_LADDER[level];
  if (!config) return false;
  return config.disabledFeatures.includes(feature);
}

const DEGRADATION_THRESHOLDS = {
  errorRate: [0, 5, 15, 30, 50, 75],
  renderFailures: [0, 3, 8, 15, 25, 40],
  latencyMs: [0, 2000, 4000, 6000, 8000, 10000],
};

const degradationState: DegradationState = {
  level: 0, levelName: "normal", activeSince: null, autoEscalated: false,
  manualOverride: null, errorRateWindow: [], renderFailures: [], latencySpikes: [],
  escalationHistory: [],
};

const DEGRADATION_WINDOW_MS = 120000;

function computeDegradationLevel(): DegradationLevel {
  const now = Date.now();
  const recentErrors = degradationState.errorRateWindow.filter(t => now - t < DEGRADATION_WINDOW_MS).length;
  const recentRenderFails = degradationState.renderFailures.filter(t => now - t < DEGRADATION_WINDOW_MS).length;
  const recentLatency = degradationState.latencySpikes.filter(t => now - t < DEGRADATION_WINDOW_MS).length;

  let maxLevel: DegradationLevel = 0;
  for (let l = 5; l >= 1; l--) {
    if (recentErrors >= DEGRADATION_THRESHOLDS.errorRate[l] ||
        recentRenderFails >= DEGRADATION_THRESHOLDS.renderFailures[l] ||
        recentLatency >= DEGRADATION_THRESHOLDS.latencyMs[l] / 1000) {
      maxLevel = l as DegradationLevel;
      break;
    }
  }
  return maxLevel;
}

export function recordDegradationError(): void {
  degradationState.errorRateWindow.push(Date.now());
  degradationState.errorRateWindow = degradationState.errorRateWindow.filter(t => Date.now() - t < DEGRADATION_WINDOW_MS);
  checkDegradationEscalation();
}

export function recordRenderFailure(): void {
  degradationState.renderFailures.push(Date.now());
  degradationState.renderFailures = degradationState.renderFailures.filter(t => Date.now() - t < DEGRADATION_WINDOW_MS);
  checkDegradationEscalation();
}

export function recordLatencySpike(): void {
  degradationState.latencySpikes.push(Date.now());
  degradationState.latencySpikes = degradationState.latencySpikes.filter(t => Date.now() - t < DEGRADATION_WINDOW_MS);
  checkDegradationEscalation();
}

function checkDegradationEscalation(): void {
  if (degradationState.manualOverride !== null) return;
  const newLevel = computeDegradationLevel();
  if (newLevel !== degradationState.level) {
    const prev = degradationState.level;
    degradationState.escalationHistory.unshift({ from: prev, to: newLevel, reason: "auto", timestamp: Date.now() });
    if (degradationState.escalationHistory.length > 100) degradationState.escalationHistory.length = 100;
    degradationState.level = newLevel;
    degradationState.levelName = DEGRADATION_LEVEL_NAMES[newLevel];
    degradationState.activeSince = newLevel > 0 ? Date.now() : null;
    degradationState.autoEscalated = newLevel > prev;
    addResilienceEvent("degradation_level_change", "system", { from: prev, to: newLevel, levelName: DEGRADATION_LEVEL_NAMES[newLevel] });
    if (newLevel >= 3) {
      addAlert("warning", "degradation", `Degradation Level ${newLevel}: ${DEGRADATION_LEVEL_NAMES[newLevel]}`, `System degraded to level ${newLevel}`, "degradation");
    }
  }
}

export function setDegradationOverride(level: DegradationLevel | null, actor?: string): void {
  degradationState.manualOverride = level;
  if (level !== null) {
    const prev = degradationState.level;
    degradationState.level = level;
    degradationState.levelName = DEGRADATION_LEVEL_NAMES[level];
    degradationState.activeSince = level > 0 ? Date.now() : null;
    degradationState.escalationHistory.unshift({ from: prev, to: level, reason: `manual_override:${actor || "admin"}`, timestamp: Date.now() });
  } else {
    checkDegradationEscalation();
  }
  addResilienceEvent("degradation_override", "admin", { level, actor });
  addResilienceAudit("degradation_override", "degradation", "level", { level }, actor || null);
}

export function getDegradationState(): DegradationState & { thresholds: typeof DEGRADATION_THRESHOLDS } {
  const now = Date.now();
  degradationState.errorRateWindow = degradationState.errorRateWindow.filter(t => now - t < DEGRADATION_WINDOW_MS);
  degradationState.renderFailures = degradationState.renderFailures.filter(t => now - t < DEGRADATION_WINDOW_MS);
  degradationState.latencySpikes = degradationState.latencySpikes.filter(t => now - t < DEGRADATION_WINDOW_MS);
  return {
    ...degradationState,
    errorRateWindow: [],
    renderFailures: [],
    latencySpikes: [],
    thresholds: DEGRADATION_THRESHOLDS,
  };
}

// ==========================================
// GRACEFUL TIMEOUT SYSTEM
// ==========================================

interface TimeoutConfig {
  operation: string;
  timeoutMs: number;
  fallbackEnabled: boolean;
  fallbackResponse: any;
  totalCalls: number;
  timeouts: number;
  lastTimeout: number | null;
}

const timeoutConfigs = new BoundedMap<string, TimeoutConfig>(30);

const DEFAULT_TIMEOUTS: Array<{ operation: string; timeoutMs: number; fallback: any }> = [
  { operation: "exam_load", timeoutMs: 10000, fallback: { items: [], message: "Exam loading timed out. Please try again.", _timeout: true } },
  { operation: "cat_start", timeoutMs: 15000, fallback: { error: "CAT session start timed out. Please try again.", _timeout: true } },
  { operation: "entitlement_check", timeoutMs: 5000, fallback: { hasAccess: false, accessSource: "timeout_fallback", _timeout: true } },
  { operation: "content_fetch", timeoutMs: 8000, fallback: { content: null, message: "Content loading timed out. Please refresh.", _timeout: true } },
  { operation: "question_bank", timeoutMs: 12000, fallback: { items: [], message: "Question bank timed out.", _timeout: true } },
  { operation: "flashcard_load", timeoutMs: 8000, fallback: { items: [], message: "Flashcards timed out.", _timeout: true } },
];

export function initTimeoutConfigs(): void {
  for (const def of DEFAULT_TIMEOUTS) {
    timeoutConfigs.set(def.operation, {
      operation: def.operation, timeoutMs: def.timeoutMs, fallbackEnabled: true,
      fallbackResponse: def.fallback, totalCalls: 0, timeouts: 0, lastTimeout: null,
    });
  }
}

export async function withGracefulTimeout<T>(operation: string, fn: () => Promise<T>, customTimeoutMs?: number): Promise<T> {
  const config = timeoutConfigs.get(operation);
  const timeoutMs = customTimeoutMs || config?.timeoutMs || 10000;

  if (config) config.totalCalls++;

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      if (config) {
        config.timeouts++;
        config.lastTimeout = Date.now();
      }
      addResilienceEvent("operation_timeout", operation, { timeoutMs });
      recordDegradationError();
      if (config?.fallbackEnabled && config.fallbackResponse) {
        resolve(config.fallbackResponse as T);
      } else {
        reject(new Error(`Operation "${operation}" timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    fn().then(result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    }).catch(err => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
  });
}

export function updateTimeoutConfig(operation: string, updates: { timeoutMs?: number; fallbackEnabled?: boolean }): void {
  const config = timeoutConfigs.get(operation);
  if (!config) return;
  if (updates.timeoutMs !== undefined) config.timeoutMs = updates.timeoutMs;
  if (updates.fallbackEnabled !== undefined) config.fallbackEnabled = updates.fallbackEnabled;
}

export function getTimeoutConfigs(): TimeoutConfig[] {
  return Array.from(timeoutConfigs.values());
}

// ==========================================
// STUCK STATE DETECTOR
// ==========================================

interface StuckStateSession {
  sessionId: string;
  userId: string;
  stuckType: "infinite_loading" | "repeated_retries" | "stalled_session" | "navigation_loop";
  detectedAt: number;
  recoveryAction: string;
  recovered: boolean;
  details: Record<string, any>;
}

const stuckStateSessions: StuckStateSession[] = [];
const MAX_STUCK_SESSIONS = 200;

interface UserActivityTracker {
  userId: string;
  recentRequests: Array<{ path: string; timestamp: number }>;
  retryPatterns: Map<string, number[]>;
  lastActivity: number;
  loadingStarted: number | null;
}

const userActivityTrackers = new BoundedMap<string, UserActivityTracker>(500, 5 * 60 * 1000);

const STUCK_STATE_THRESHOLDS = {
  infiniteLoadingMs: 30000,
  repeatedRetryCount: 5,
  repeatedRetryWindowMs: 30000,
  stalledSessionMs: 120000,
  navigationLoopCount: 8,
  navigationLoopWindowMs: 20000,
};

function getOrCreateTracker(userId: string): UserActivityTracker {
  let tracker = userActivityTrackers.get(userId);
  if (!tracker) {
    tracker = { userId, recentRequests: [], retryPatterns: new Map(), lastActivity: Date.now(), loadingStarted: null };
    userActivityTrackers.set(userId, tracker);
  }
  return tracker;
}

export function trackUserActivity(userId: string, path: string): StuckStateSession | null {
  const tracker = getOrCreateTracker(userId);
  const now = Date.now();
  tracker.recentRequests.push({ path, timestamp: now });
  tracker.lastActivity = now;

  if (tracker.recentRequests.length > 100) {
    tracker.recentRequests = tracker.recentRequests.slice(-50);
  }

  const retries = tracker.retryPatterns.get(path) || [];
  retries.push(now);
  const recentRetries = retries.filter(t => now - t < STUCK_STATE_THRESHOLDS.repeatedRetryWindowMs);
  tracker.retryPatterns.set(path, recentRetries);

  if (recentRetries.length >= STUCK_STATE_THRESHOLDS.repeatedRetryCount) {
    const session = createStuckSession(userId, `sess_${userId}_${now}`, "repeated_retries", "reset_session", { path, retryCount: recentRetries.length });
    tracker.retryPatterns.set(path, []);
    return session;
  }

  const recentPaths = tracker.recentRequests
    .filter(r => now - r.timestamp < STUCK_STATE_THRESHOLDS.navigationLoopWindowMs)
    .map(r => r.path);

  if (recentPaths.length >= STUCK_STATE_THRESHOLDS.navigationLoopCount) {
    const uniquePaths = new Set(recentPaths);
    if (uniquePaths.size <= 3 && recentPaths.length >= STUCK_STATE_THRESHOLDS.navigationLoopCount) {
      const session = createStuckSession(userId, `sess_${userId}_${now}`, "navigation_loop", "suggest_recovery", { paths: Array.from(uniquePaths), loopCount: recentPaths.length });
      tracker.recentRequests = [];
      return session;
    }
  }

  return null;
}

export function reportLoadingState(userId: string, sessionId: string, isLoading: boolean): StuckStateSession | null {
  const tracker = getOrCreateTracker(userId);
  if (isLoading && !tracker.loadingStarted) {
    tracker.loadingStarted = Date.now();
  } else if (!isLoading) {
    tracker.loadingStarted = null;
  }

  if (tracker.loadingStarted && Date.now() - tracker.loadingStarted > STUCK_STATE_THRESHOLDS.infiniteLoadingMs) {
    const durationMs = Date.now() - tracker.loadingStarted;
    tracker.loadingStarted = null;
    return createStuckSession(userId, sessionId, "infinite_loading", "reload_safe_mode", { durationMs });
  }
  return null;
}

export function reportStalledSession(userId: string, sessionId: string, lastActivityMs: number): StuckStateSession | null {
  if (lastActivityMs > STUCK_STATE_THRESHOLDS.stalledSessionMs) {
    return createStuckSession(userId, sessionId, "stalled_session", "reset_session", { stalledMs: lastActivityMs });
  }
  return null;
}

function createStuckSession(userId: string, sessionId: string, stuckType: StuckStateSession["stuckType"], recoveryAction: string, details: Record<string, any>): StuckStateSession {
  const session: StuckStateSession = {
    sessionId, userId, stuckType, detectedAt: Date.now(), recoveryAction, recovered: false, details,
  };
  stuckStateSessions.unshift(session);
  if (stuckStateSessions.length > MAX_STUCK_SESSIONS) stuckStateSessions.length = MAX_STUCK_SESSIONS;
  addResilienceEvent("stuck_state_detected", userId, { stuckType, recoveryAction, sessionId, ...details });
  recordDegradationError();
  return session;
}

export function getStuckStateSessions(limit = 50): StuckStateSession[] {
  return stuckStateSessions.slice(0, limit);
}

export function getStuckStateThresholds(): typeof STUCK_STATE_THRESHOLDS {
  return { ...STUCK_STATE_THRESHOLDS };
}

export function updateStuckStateThresholds(updates: Partial<typeof STUCK_STATE_THRESHOLDS>): void {
  Object.assign(STUCK_STATE_THRESHOLDS, updates);
}

// ==========================================
// PERFORMANCE / SCALE PROTECTION
// ==========================================

interface RouteLatencyTracker {
  route: string;
  samples: number[];
  totalCalls: number;
  totalLatencyMs: number;
  p50: number;
  p95: number;
  p99: number;
  maxLatency: number;
  lastUpdated: number;
}

const routeLatencyTrackers = new BoundedMap<string, RouteLatencyTracker>(200);
const LATENCY_SAMPLE_LIMIT = 500;

const CRITICAL_PATHS = new Set([
  "/api/exam-questions", "/api/mock-exams", "/api/flashcards", "/api/flashcard-decks",
  "/api/lessons", "/api/question-bank", "/api/auth", "/api/login",
  "/api/stripe", "/api/entitlement",
]);

const NONESSENTIAL_PATHS = new Set([
  "/api/seo", "/api/analytics", "/api/social", "/api/blog",
  "/api/admin/seo", "/api/admin/analytics",
]);

interface ScaleProtectionState {
  loadLevel: "normal" | "elevated" | "high" | "critical";
  activeThrottles: string[];
  throttledRequests: number;
  lastEvaluation: number;
  requestsPerMinute: number[];
}

const scaleProtection: ScaleProtectionState = {
  loadLevel: "normal", activeThrottles: [], throttledRequests: 0,
  lastEvaluation: Date.now(), requestsPerMinute: [],
};

const SCALE_THRESHOLDS = {
  elevated: 200,
  high: 400,
  critical: 600,
};

export function recordRouteLatency(route: string, latencyMs: number): void {
  const normalized = normalizeRoutePath(route);
  let tracker = routeLatencyTrackers.get(normalized);
  if (!tracker) {
    tracker = { route: normalized, samples: [], totalCalls: 0, totalLatencyMs: 0, p50: 0, p95: 0, p99: 0, maxLatency: 0, lastUpdated: Date.now() };
    routeLatencyTrackers.set(normalized, tracker);
  }
  tracker.samples.push(latencyMs);
  tracker.totalCalls++;
  tracker.totalLatencyMs += latencyMs;
  tracker.lastUpdated = Date.now();
  if (tracker.samples.length > LATENCY_SAMPLE_LIMIT) {
    tracker.samples = tracker.samples.slice(-LATENCY_SAMPLE_LIMIT);
  }
  const sorted = [...tracker.samples].sort((a, b) => a - b);
  tracker.p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
  tracker.p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
  tracker.p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
  tracker.maxLatency = sorted[sorted.length - 1] || 0;

  if (latencyMs > 5000) {
    recordLatencySpike();
  }

  scaleProtection.requestsPerMinute.push(Date.now());
  scaleProtection.requestsPerMinute = scaleProtection.requestsPerMinute.filter(t => Date.now() - t < 60000);
  evaluateScaleProtection();
}

function normalizeRoutePath(route: string): string {
  return route
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "/:id")
    .replace(/\/\d+/g, "/:id")
    .split("?")[0];
}

function evaluateScaleProtection(): void {
  const rpm = scaleProtection.requestsPerMinute.length;
  let newLevel: ScaleProtectionState["loadLevel"] = "normal";
  if (rpm >= SCALE_THRESHOLDS.critical) newLevel = "critical";
  else if (rpm >= SCALE_THRESHOLDS.high) newLevel = "high";
  else if (rpm >= SCALE_THRESHOLDS.elevated) newLevel = "elevated";

  if (newLevel !== scaleProtection.loadLevel) {
    const prev = scaleProtection.loadLevel;
    scaleProtection.loadLevel = newLevel;
    scaleProtection.lastEvaluation = Date.now();
    addResilienceEvent("scale_level_change", "system", { from: prev, to: newLevel, rpm });

    if (newLevel === "high" || newLevel === "critical") {
      scaleProtection.activeThrottles = [];
      for (const path of NONESSENTIAL_PATHS) {
        scaleProtection.activeThrottles.push(path);
      }
      if (newLevel === "critical") {
        addAlert("warning", "scale_protection", "Critical Load Level", `RPM at ${rpm}, throttling nonessential paths`, "scale");
      }
    } else {
      scaleProtection.activeThrottles = [];
    }
  }
}

export function isPathThrottled(path: string): boolean {
  if (scaleProtection.loadLevel === "normal" || scaleProtection.loadLevel === "elevated") return false;
  for (const throttled of scaleProtection.activeThrottles) {
    if (path.startsWith(throttled)) {
      scaleProtection.throttledRequests++;
      return true;
    }
  }
  return false;
}

export function isCriticalPath(path: string): boolean {
  for (const cp of CRITICAL_PATHS) {
    if (path.startsWith(cp)) return true;
  }
  return false;
}

export function getRouteLatencyStats(): RouteLatencyTracker[] {
  return Array.from(routeLatencyTrackers.values())
    .map(t => ({ ...t, samples: [] }))
    .sort((a, b) => b.p95 - a.p95);
}

export function getScaleProtectionState(): ScaleProtectionState {
  return { ...scaleProtection, requestsPerMinute: [] };
}

export function getScaleThresholds(): typeof SCALE_THRESHOLDS {
  return { ...SCALE_THRESHOLDS };
}

export function updateScaleThresholds(updates: Partial<typeof SCALE_THRESHOLDS>): void {
  Object.assign(SCALE_THRESHOLDS, updates);
}

export function scaleProtectionMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    const start = Date.now();

    res.on("finish", () => {
      const latency = Date.now() - start;
      recordRouteLatency(req.path, latency);
    });

    if (isPathThrottled(req.path)) {
      return res.status(503).json({
        error: "This feature is temporarily throttled due to high load.",
        loadLevel: scaleProtection.loadLevel,
        retryAfter: 30,
      });
    }

    if (isCriticalPath(req.path) && (scaleProtection.loadLevel === "high" || scaleProtection.loadLevel === "critical")) {
      res.setHeader("X-Priority", "critical");
    }

    next();
  };
}

// ==========================================
// REGISTER RESILIENCE ROUTES
// ==========================================

export function pruneResilienceCaches(): void {
  const now = Date.now();
  const MAX_AGE_MS = 300_000;

  while (alertEvents.length > MAX_ALERTS) {
    alertEvents.pop();
  }
  while (resilienceAuditLog.length > MAX_AUDIT) {
    resilienceAuditLog.pop();
  }
  while (resilienceEvents.length > MAX_EVENTS) {
    resilienceEvents.pop();
  }

  for (const [key, entry] of entitlementCache) {
    if (entry.expiresAt < now) {
      entitlementCache.delete(key);
    }
  }

  for (const [key, grant] of provisionalAccessGrants) {
    if (now > grant.expiresAt) {
      provisionalAccessGrants.delete(key);
    }
  }

  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > 120000) {
      rateLimitStore.delete(key);
    }
  }

  for (const [key, ts] of sendAlertEmailRateLimit) {
    if (now - ts > SEND_ALERT_EMAIL_RATE_LIMIT_MS) {
      sendAlertEmailRateLimit.delete(key);
    }
  }

  for (const [key, cb] of circuitBreakers) {
    if (cb.state === "closed" && cb.failureCount === 0 && cb.lastSuccess && now - cb.lastSuccess > MAX_AGE_MS) {
      circuitBreakers.delete(key);
    }
  }

  for (const [key, entry] of warmCache) {
    if (now - entry.warmedAt > entry.ttlMs * 2) {
      warmCache.delete(key);
    }
  }

  while (selfHealingLog.length > 100) {
    selfHealingLog.pop();
  }

  if (circuitBreakers.size > 50) {
    const toDelete: string[] = [];
    for (const [name, cb] of circuitBreakers) {
      if (cb.state === "closed" && cb.failureCount === 0 && cb.lastFailure && now - cb.lastFailure > MAX_AGE_MS) {
        toDelete.push(name);
      }
    }
    for (const key of toDelete) {
      circuitBreakers.delete(key);
    }
  }

  for (const budget of errorBudgets.values()) {
    budget.errors = budget.errors.filter(t => now - t < budget.windowMs);
    budget.consumed = budget.errors.length;
    recomputeEscalationLevel(budget);
  }
}

export function registerResilienceRoutes(app: Express): void {
  ensurePlatformTables().catch(() => {});
  initTimeoutConfigs();

  if (!healthCheckTimer) {
    setTimeout(() => runHealthChecks(), 5000);
    healthCheckTimer = setInterval(() => runHealthChecks(), HEALTH_CHECK_INTERVAL_MS);
  }

  app.get("/api/platform/status", async (_req: Request, res: Response) => {
    let memoryPressure = false;
    let memoryLevel = "normal";
    try {
      const { getMemoryPressure } = await import("./memory-monitor");
      const pressure = getMemoryPressure();
      memoryPressure = pressure.isProtection || pressure.isCritical;
      memoryLevel = pressure.level;
    } catch {}

    const highLoad = emergencyModeActive || minimalCoreActive || memoryPressure;

    res.json({
      emergencyMode: emergencyModeActive,
      safeMode: emergencyModeActive,
      minimalCore: minimalCoreActive,
      memoryPressure,
      memoryLevel,
      highLoad,
      highLoadMessage: highLoad ? "System under high load — running in safe mode" : null,
      renderMode: minimalCoreActive ? "text-first" : emergencyModeActive ? "safe-static" : "full",
      message: emergencyModeActive
        ? "We're running in safe mode. Core reading features remain available."
        : minimalCoreActive
        ? "Platform is in minimal core mode. Only essential features are active."
        : memoryPressure
        ? "System under high load — running in safe mode"
        : null,
      reason: emergencyModeActive ? emergencyModeReason : minimalCoreActive ? minimalCoreReason : null,
    });
  });

  app.get("/api/platform/feature-flags", (_req: Request, res: Response) => {
    const flags: Record<string, boolean> = {};
    const allFlags = getFeatureFlags();
    for (const flag of allFlags) {
      flags[flag.key] = isFeatureEnabled(flag.key);
    }
    res.json({ flags, emergencyMode: emergencyModeActive });
  });

  app.get("/api/health", async (_req: Request, res: Response) => {
    try {
      if (cachedHealthResponse && Date.now() - cachedHealthResponse.timestamp < HEALTH_CACHE_TTL) {
        const status = cachedHealthResponse.status;
        return res.status(status === "down" ? 503 : 200).json({
          status,
          emergency: isEmergencyMode(),
          services: cachedHealthResponse.services,
          timestamp: cachedHealthResponse.timestamp,
          uptime: process.uptime(),
          cached: true,
        });
      }

      const results = await runHealthChecks();
      const overallStatus = results.some((r) => r.status === "down")
        ? "down"
        : results.some((r) => r.status === "degraded")
        ? "degraded"
        : "healthy";

      res.status(overallStatus === "down" ? 503 : 200).json({
        status: overallStatus,
        emergency: isEmergencyMode(),
        services: results,
        timestamp: Date.now(),
        uptime: process.uptime(),
      });
    } catch {
      res.status(503).json({ status: "down", emergency: isEmergencyMode(), services: [], timestamp: Date.now() });
    }
  });

  app.get("/api/health/ready", async (_req: Request, res: Response) => {
    try {
      const checks = await Promise.allSettled([
        withTimeout(() => pool.query("SELECT 1"), 3000, "db"),
        withTimeout(() => pool.query("SELECT id FROM users LIMIT 1"), 3000, "auth"),
        withTimeout(async () => {
          const { validateStripeConnection } = await import("./stripeClient");
          return validateStripeConnection();
        }, 5000, "stripe"),
        withTimeout(() => pool.query("SELECT COUNT(*)::int AS cnt FROM content_items WHERE status = 'published' LIMIT 1"), 3000, "content"),
      ]);
      const labels = ["database", "auth", "stripe", "content_delivery"];
      const results: Record<string, string> = {};
      let allReady = true;
      checks.forEach((c, i) => {
        if (c.status === "fulfilled") {
          results[labels[i]] = "ok";
        } else {
          results[labels[i]] = "failed";
          if (labels[i] !== "stripe") allReady = false;
        }
      });
      const code = allReady ? 200 : 503;
      res.status(code).json({ ready: allReady, checks: results, timestamp: Date.now() });
    } catch {
      res.status(503).json({ ready: false, timestamp: Date.now() });
    }
  });

  app.get("/api/platform/minimal-core", (_req: Request, res: Response) => {
    res.json({
      minimalCore: minimalCoreActive,
      safeMode: emergencyModeActive,
    });
  });

  app.get("/api/admin/resilience/status", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    const healthResults = await runHealthChecks();
    res.json({
      circuitBreakers: getCircuitBreakerStates(),
      featureFlags: getFeatureFlags(),
      killSwitches: getKillSwitches(),
      healthChecks: healthResults,
      emergencyMode: getEmergencyModeStatus(),
      safeMode: getSafeModeStatus(),
      minimalCore: getMinimalCoreStatus(),
      errorBudgets: getErrorBudgets(),
      cacheWarmStatus: getCacheWarmStatus(),
      provisionalAccess: getProvisionalAccessGrants(),
      selfHealingLog: getSelfHealingLog(),
      events: getResilienceEvents(100),
      scopeIsolation: getScopedFailureDomains(),
      degradation: getDegradationState(),
      timeouts: getTimeoutConfigs(),
      stuckStates: getStuckStateSessions(20),
      stuckStateThresholds: getStuckStateThresholds(),
      performance: {
        routeLatency: getRouteLatencyStats().slice(0, 20),
        scaleProtection: getScaleProtectionState(),
        scaleThresholds: getScaleThresholds(),
      },
      timestamp: Date.now(),
    });
  });

  app.get("/api/admin/memory-diagnostics", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "ops_viewer");
    if (!admin) return;
    try {
      const {
        getMemoryMonitorStatus,
        getProtectionActions,
        getActiveConnectionCount,
        shouldReducePayloads,
        shouldPauseBackgroundJobs,
        shouldRejectHeavyWork,
        getMaxPayloadSize,
      } = await import("./memory-monitor");

      const monitorStatus = getMemoryMonitorStatus();
      const actions = getProtectionActions(50);

      const activeExamsResult = await pool.query(
        `SELECT COUNT(*) as count FROM mock_exam_attempts WHERE status = 'in_progress'`
      );
      const activeExamSessions = parseInt(activeExamsResult.rows[0]?.count || "0");

      const mapSizes: Record<string, number> = {};
      try {
        mapSizes.rateLimitStore = rateLimitStore.size;
      } catch {}
      try {
        mapSizes.circuitBreakers = circuitBreakers.size;
      } catch {}
      try {
        mapSizes.featureFlags = featureFlags.size;
      } catch {}

      res.json({
        memory: monitorStatus,
        guards: {
          shouldReducePayloads: shouldReducePayloads(),
          shouldPauseBackgroundJobs: shouldPauseBackgroundJobs(),
          shouldRejectHeavyWork: shouldRejectHeavyWork(),
          maxPayloadSize: getMaxPayloadSize(),
        },
        activeConnections: getActiveConnectionCount(),
        activeExamSessions,
        mapSizes,
        safeMode: emergencyModeActive,
        minimalCore: minimalCoreActive,
        recentProtectionActions: actions,
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/resilience/feature-flags/:key", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "feature_flag", res))) return;
    if (!requireConfirmToken(req, res, admin, "feature_flag_toggle")) return;
    const key = routeParamString(req.params.key);
    const { enabled, reason } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "enabled must be a boolean" });
    }
    const beforeState = featureFlags.get(key);
    setFeatureFlag(key, enabled, reason, admin.username || admin.id);
    auditSensitiveAction(req, admin, "feature_flag_toggle", "feature_flag", key, { enabled: beforeState?.enabled, adminOverride: beforeState?.adminOverride }, { enabled, reason }, reason, "warning");
    res.json({ success: true, flag: featureFlags.get(key) });
  });

  app.post("/api/admin/resilience/feature-flags/:key/reset-errors", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "feature_flag", res))) return;
    const key = routeParamString(req.params.key);
    const beforeState = featureFlags.get(key);
    resetFeatureErrors(key);
    auditSensitiveAction(req, admin, "feature_flag_error_reset", "feature_flag", key, { errorCount: beforeState?.errorCount }, { errorCount: 0 }, "Error count reset");
    res.json({ success: true });
  });

  app.post("/api/admin/resilience/kill-switch", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "safe_mode", res))) return;
    if (!requireConfirmToken(req, res, admin, "kill_switch_toggle")) return;
    const { key, scope, target, reason, active } = req.body;
    if (!key || !scope || !target) {
      return res.status(400).json({ error: "key, scope, and target are required" });
    }
    const wasActive = killSwitches.get(key)?.active;
    if (active === false) {
      deactivateKillSwitch(key);
    } else {
      activateKillSwitch(key, scope, target, reason || "admin_action", admin.username);
    }
    auditSensitiveAction(req, admin, active === false ? "kill_switch_deactivated" : "kill_switch_activated", "kill_switch", key, { active: wasActive }, { active: active !== false, scope, target }, reason, "warning");
    res.json({ success: true, killSwitch: killSwitches.get(key) });
  });

  app.post("/api/admin/resilience/circuit-breaker/:name/reset", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "system_config", res))) return;
    if (!requireConfirmToken(req, res, admin, "circuit_breaker_reset")) return;
    const name = routeParamString(req.params.name);
    const before = circuitBreakers.get(name);
    resetCircuitBreaker(name);
    auditSensitiveAction(req, admin, "circuit_breaker_reset", "circuit_breaker", name, { state: before?.state, failureCount: before?.failureCount }, { state: "closed", failureCount: 0 }, "Manual circuit breaker reset");
    res.json({ success: true });
  });

  app.post("/api/admin/resilience/emergency-mode", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "safe_mode", res))) return;
    if (!requireConfirmToken(req, res, admin, "emergency_mode_toggle")) return;
    const { active, reason } = req.body;
    const wasActive = emergencyModeActive;
    if (active) {
      activateEmergencyMode(reason || "admin_activated", admin.username || admin.id);
    } else {
      deactivateEmergencyMode(admin.username || admin.id);
    }
    auditSensitiveAction(req, admin, active ? "safe_mode_activated" : "safe_mode_deactivated", "emergency_mode", "global", { active: wasActive }, { active }, reason, "critical");
    res.json({ success: true, emergencyMode: getEmergencyModeStatus() });
  });

  app.post("/api/admin/resilience/provisional-access", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "subscriber_management", res))) return;
    const { userId, reason } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    grantProvisionalAccess(userId, reason || "admin_grant");
    auditSensitiveAction(req, admin, "provisional_access_granted", "user", userId, null, { reason }, reason);
    res.json({ success: true });
  });

  app.post("/api/admin/resilience/clear-entitlement-cache", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin");
    if (!admin) return;
    clearEntitlementCache(req.body.userId);
    auditSensitiveAction(req, admin, "entitlement_cache_cleared", "entitlement_cache", req.body.userId || "all", null, { userId: req.body.userId }, "Cache cleared");
    res.json({ success: true });
  });

  app.get("/api/admin/resilience/alerts", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const severity = req.query.severity as string;
    try {
      let query = `SELECT id, severity, category, title, message, source, acknowledged, data, created_at as "createdAt" FROM platform_alerts`;
      const params: any[] = [];
      if (severity) {
        query += ` WHERE severity = $1`;
        params.push(severity);
      }
      query += ` ORDER BY created_at DESC LIMIT ${limit}`;
      const result = await pool.query(query, params);
      const countResult = await pool.query(
        severity ? `SELECT COUNT(*)::int AS total FROM platform_alerts WHERE severity = $1` : `SELECT COUNT(*)::int AS total FROM platform_alerts`,
        severity ? [severity] : []
      );
      res.json({ alerts: result.rows, total: countResult.rows[0]?.total || 0 });
    } catch {
      let filtered = alertEvents;
      if (severity) filtered = filtered.filter(a => a.severity === severity);
      res.json({ alerts: filtered.slice(0, limit), total: filtered.length });
    }
  });

  app.post("/api/admin/resilience/alerts/:id/acknowledge", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin");
    if (!admin) return;
    const alertId = routeParamString(req.params.id);
    const memAlert = alertEvents.find(a => a.id === alertId);
    if (memAlert) memAlert.acknowledged = true;
    try {
      await pool.query(`UPDATE platform_alerts SET acknowledged = true WHERE id = $1`, [alertId]);
    } catch {}
    addResilienceAudit("alert_acknowledged", "alert", alertId, { title: memAlert?.title }, admin.username || admin.id);
    await auditOperatorAction(req, admin, "alert_acknowledged", "system_config", "alert", alertId, {
      targetType: "alert", targetId: alertId,
    });
    res.json({ success: true });
  });

  app.get("/api/admin/resilience/audit-log", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    try {
      const result = await pool.query(
        `SELECT id, actor_id as "actor", entity_type as "entity", entity_id as "entityId", action, after_json as "details", created_at as "timestamp" FROM audit_logs WHERE entity_type IN ('platform', 'feature_flag', 'circuit_breaker', 'kill_switch', 'alert', 'emergency_mode') ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      const countResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM audit_logs WHERE entity_type IN ('platform', 'feature_flag', 'circuit_breaker', 'kill_switch', 'alert', 'emergency_mode')`
      );
      res.json({ entries: result.rows, total: countResult.rows[0]?.total || 0 });
    } catch {
      res.json({ entries: resilienceAuditLog.slice(0, limit), total: resilienceAuditLog.length });
    }
  });

  app.post("/api/admin/resilience/feature-flags/:key/scope", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    const key = routeParamString(req.params.key);
    const { scopeMode, scope } = req.body;
    if (!scopeMode || !["global", "include", "exclude"].includes(scopeMode)) {
      return res.status(400).json({ error: "scopeMode must be global, include, or exclude" });
    }
    setFeatureFlagScope(key, scopeMode, scope || null, admin.username || admin.id);
    res.json({ success: true, flag: featureFlags.get(key) });
  });

  app.post("/api/admin/resilience/self-heal/run", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    try {
      const [cacheResult, backupResult, schemaResult] = await Promise.all([
        selfHealCacheCorruption(),
        selfHealMissingBackups(),
        selfHealSchemaDrift(),
      ]);
      res.json({
        success: true,
        cache: cacheResult,
        backups: backupResult,
        schema: schemaResult,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/resilience/load-shedding", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    res.json(getLoadSheddingStatus());
  });

  app.post("/api/admin/resilience/health-check/run", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin");
    if (!admin) return;
    await runHealthChecks();
    res.json({ success: true, results: getLastHealthResults() });
  });

  app.get("/api/admin/resilience/health-history", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    try {
      const result = await pool.query(
        `SELECT service, status, latency_ms, details, checked_at FROM platform_health_checks ORDER BY checked_at DESC LIMIT 200`
      );
      res.json({ history: result.rows });
    } catch {
      res.json({ history: [] });
    }
  });

  app.get("/api/admin/resilience/error-budgets", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    res.json({ errorBudgets: getErrorBudgets(), timestamp: Date.now() });
  });

  app.post("/api/admin/resilience/error-budgets/:subsystem/reset", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "system_config", res))) return;
    const subsystem = routeParamString(req.params.subsystem);
    resetErrorBudget(subsystem);
    addResilienceAudit("error_budget_reset", "error_budget", subsystem, {}, admin.username || admin.id);
    auditSensitiveAction(req, admin, "error_budget_reset", "error_budget", subsystem, null, { reset: true }, "Error budget manually reset", "warning");
    res.json({ success: true });
  });

  app.post("/api/admin/resilience/minimal-core", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin");
    if (!admin) return;
    if (!(await checkAdminPermission(admin, "safe_mode", res))) return;
    if (!requireConfirmToken(req, res, admin, "minimal_core_toggle")) return;
    const { active, reason } = req.body;
    const wasPreviouslyActive = minimalCoreActive;
    if (active) {
      activateMinimalCore(reason || "admin_activated", admin.username || admin.id);
    } else {
      deactivateMinimalCore(admin.username || admin.id);
    }
    auditSensitiveAction(req, admin, active ? "minimal_core_activated" : "minimal_core_deactivated", "minimal_core", "global", { active: wasPreviouslyActive }, { active }, reason, "critical");
    res.json({ success: true, minimalCore: getMinimalCoreStatus() });
  });

  app.get("/api/admin/resilience/cache-warm", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;
    res.json({ cacheWarmStatus: getCacheWarmStatus(), timestamp: Date.now() });
  });

  app.post("/api/admin/resilience/cache-warm/run", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin");
    if (!admin) return;
    await prewarmCriticalRoutes();
    addResilienceAudit("cache_warm_manual", "platform", "cache_warm", {}, admin.username || admin.id);
    res.json({ success: true, cacheWarmStatus: getCacheWarmStatus() });
  });

  app.get("/api/admin/resilience/memory", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const { getMemoryMonitorStatus } = await import("./memory-monitor");
      res.json(getMemoryMonitorStatus());
    } catch {
      res.json({ error: "Memory monitor not available" });
    }
  });

  app.get("/api/admin/resilience/dashboard", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "content_admin", "ops_viewer");
    if (!admin) return;

    let memoryInfo = null;
    try {
      const { getMemoryMonitorStatus } = await import("./memory-monitor");
      memoryInfo = getMemoryMonitorStatus();
    } catch {}

    res.json({
      safeMode: getSafeModeStatus(),
      minimalCore: getMinimalCoreStatus(),
      errorBudgets: getErrorBudgets(),
      cacheWarmStatus: getCacheWarmStatus(),
      circuitBreakers: getCircuitBreakerStates(),
      memory: memoryInfo,
      featureFlags: getFeatureFlags().map(f => ({
        key: f.key,
        enabled: isFeatureEnabled(f.key),
        description: f.description,
        errorCount: f.errorCount,
        disabledReason: f.disabledReason,
      })),
      healthSummary: {
        lastCheck: cachedHealthResponse?.timestamp || null,
        overallStatus: cachedHealthResponse?.status || "unknown",
        servicesDown: cachedHealthResponse?.services.filter(s => s.status === "down").length || 0,
        servicesDegraded: cachedHealthResponse?.services.filter(s => s.status === "degraded").length || 0,
      },
      timestamp: Date.now(),
    });
  });

  // --- Scope Isolation Routes ---

  app.get("/api/admin/resilience/scope-isolation", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    res.json({ domains: getScopedFailureDomains(), timestamp: Date.now() });
  });

  app.post("/api/admin/resilience/scope-isolation/kill-switch", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const { type, value, active, reason } = req.body;
    const validTypes = ["profession", "exam_type", "language", "region"];
    if (!type || !value) return res.status(400).json({ error: "type and value are required" });
    if (!validTypes.includes(type)) return res.status(400).json({ error: `type must be one of: ${validTypes.join(", ")}` });
    if (typeof value !== "string" || value.length > 100) return res.status(400).json({ error: "value must be a string (max 100 chars)" });
    setScopedKillSwitch(type, value, active !== false, reason, admin.username || admin.id);
    res.json({ success: true });
  });

  app.post("/api/admin/resilience/scope-isolation/lift-quarantine", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const { type, value } = req.body;
    if (!type || !value) return res.status(400).json({ error: "type and value are required" });
    liftScopeQuarantine(type, value, admin.username || admin.id);
    res.json({ success: true });
  });

  // --- Progressive Degradation Routes ---

  app.get("/api/admin/resilience/degradation", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    res.json({ degradation: getDegradationState(), timestamp: Date.now() });
  });

  app.post("/api/admin/resilience/degradation/override", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const { level } = req.body;
    if (level !== null && (typeof level !== "number" || level < 0 || level > 5)) {
      return res.status(400).json({ error: "level must be 0-5 or null" });
    }
    setDegradationOverride(level, admin.username || admin.id);
    res.json({ success: true, degradation: getDegradationState() });
  });

  // --- Timeout Configuration Routes ---

  app.get("/api/admin/resilience/timeouts", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    res.json({ timeouts: getTimeoutConfigs(), timestamp: Date.now() });
  });

  app.post("/api/admin/resilience/timeouts/:operation", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const { timeoutMs, fallbackEnabled } = req.body;
    if (timeoutMs !== undefined && (typeof timeoutMs !== "number" || timeoutMs < 1000 || timeoutMs > 120000)) {
      return res.status(400).json({ error: "timeoutMs must be between 1000 and 120000" });
    }
    if (fallbackEnabled !== undefined && typeof fallbackEnabled !== "boolean") {
      return res.status(400).json({ error: "fallbackEnabled must be a boolean" });
    }
    const operation = routeParamString(req.params.operation);
    updateTimeoutConfig(operation, { timeoutMs, fallbackEnabled });
    addResilienceAudit("timeout_config_update", "timeout", operation, { timeoutMs, fallbackEnabled }, admin.username || admin.id);
    res.json({ success: true, timeouts: getTimeoutConfigs() });
  });

  // --- Stuck State Routes ---

  app.get("/api/admin/resilience/stuck-states", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    res.json({ sessions: getStuckStateSessions(limit), thresholds: getStuckStateThresholds(), timestamp: Date.now() });
  });

  app.post("/api/admin/resilience/stuck-states/thresholds", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const thresholds = req.body;
    for (const [key, val] of Object.entries(thresholds)) {
      if (typeof val !== "number" || val < 1000 || val > 600000) {
        return res.status(400).json({ error: `${key} must be a number between 1000 and 600000` });
      }
    }
    updateStuckStateThresholds(thresholds);
    addResilienceAudit("stuck_state_threshold_update", "stuck_state", "thresholds", thresholds, admin.username || admin.id);
    res.json({ success: true, thresholds: getStuckStateThresholds() });
  });

  app.post("/api/resilience/report-loading", async (req: Request, res: Response) => {
    const { userId, sessionId, isLoading } = req.body;
    if (!userId || !sessionId) return res.status(400).json({ error: "userId and sessionId required" });
    const stuck = reportLoadingState(userId, sessionId, isLoading);
    res.json({ stuck: stuck || null });
  });

  app.post("/api/resilience/report-stalled", async (req: Request, res: Response) => {
    const { userId, sessionId, lastActivityMs } = req.body;
    if (!userId || !sessionId) return res.status(400).json({ error: "userId and sessionId required" });
    const stuck = reportStalledSession(userId, sessionId, lastActivityMs || 0);
    res.json({ stuck: stuck || null });
  });

  app.post("/api/resilience/track-activity", async (req: Request, res: Response) => {
    const { userId, path } = req.body;
    if (!userId || !path) return res.status(400).json({ error: "userId and path required" });
    const stuck = trackUserActivity(userId, path);
    res.json({ stuck: stuck || null });
  });

  // --- Performance / Scale Protection Routes ---

  app.get("/api/admin/resilience/performance", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    res.json({
      routeLatency: getRouteLatencyStats(),
      scaleProtection: getScaleProtectionState(),
      scaleThresholds: getScaleThresholds(),
      timestamp: Date.now(),
    });
  });

  app.post("/api/admin/resilience/scale-thresholds", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    const scaleBody = req.body;
    for (const [key, val] of Object.entries(scaleBody)) {
      if (typeof val !== "number" || val < 0) {
        return res.status(400).json({ error: `${key} must be a non-negative number` });
      }
    }
    updateScaleThresholds(scaleBody);
    addResilienceAudit("scale_threshold_update", "scale_protection", "thresholds", scaleBody, admin.username || admin.id);
    res.json({ success: true, thresholds: getScaleThresholds() });
  });

  // --- Unified Ops Status Dashboard API ---

  app.get("/api/admin/ops/status", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "ops_viewer");
    if (!admin) return;
    try {
      const healthResults = cachedHealthResponse || { status: "unknown", services: [], timestamp: 0 };
      const cbStates = getCircuitBreakerStates();
      const flags = getFeatureFlags();
      const kswitches = getKillSwitches();
      const safeMode = getSafeModeStatus();
      const minCore = getMinimalCoreStatus();
      const budgets = getErrorBudgets();
      const provisionalGrants = getProvisionalAccessGrants();
      const recentAlerts = alertEvents.filter(a => !a.acknowledged).slice(0, 20);
      const selfHealLog = getSelfHealingLog();
      const loadShedding = getLoadSheddingStatus();

      let examHealth: any = null;
      try {
        const { checkPoolHealth, getQuarantinedCount } = await import("./exam-reliability");
        const tiers = ["rpn", "rn", "np"];
        const poolChecks: Record<string, any> = {};
        for (const tier of tiers) { poolChecks[tier] = await checkPoolHealth(tier); }
        const quarantinedCount = await getQuarantinedCount();
        examHealth = { tiers: poolChecks, quarantinedCount };
      } catch {}

      let aiStatus: any = null;
      try {
        const { getAiConfig } = await import("./ai-safety");
        aiStatus = getAiConfig();
      } catch {}

      let dbMetrics: any = null;
      try {
        const userCount = await pool.query("SELECT COUNT(*)::int AS cnt FROM users");
        const activeSubCount = await pool.query("SELECT COUNT(*)::int AS cnt FROM users WHERE tier != 'free' AND tier IS NOT NULL AND tier != ''");
        const recentIncidentCount = await pool.query(
          `SELECT COUNT(*)::int AS cnt FROM exam_incidents WHERE created_at > NOW() - INTERVAL '24 hours'`
        ).catch(() => ({ rows: [{ cnt: 0 }] }));
        dbMetrics = {
          totalUsers: userCount.rows[0]?.cnt || 0,
          activeSubscribers: activeSubCount.rows[0]?.cnt || 0,
          recentIncidents24h: recentIncidentCount.rows[0]?.cnt || 0,
        };
      } catch {}

      let recentAuditActions: any[] = [];
      try {
        const auditResult = await pool.query(
          `SELECT id, actor_username, action, entity_type, entity_id, severity, created_at
           FROM audit_logs ORDER BY created_at DESC LIMIT 10`
        );
        recentAuditActions = auditResult.rows;
      } catch {}

      const servicesDown = healthResults.services.filter((s: any) => s.status === "down");
      const servicesDegraded = healthResults.services.filter((s: any) => s.status === "degraded");
      const servicesHealthy = healthResults.services.filter((s: any) => s.status === "healthy");

      const openBreakers = cbStates.filter(cb => cb.state === "open");
      const halfOpenBreakers = cbStates.filter(cb => cb.state === "half-open");
      const disabledFlags = flags.filter(f => !isFeatureEnabled(f.key));
      const activeKillSwitches = kswitches.filter(ks => ks.active);
      const criticalBudgets = budgets.filter(b => b.escalationLevel === "critical" || b.escalationLevel === "exhausted");

      let overallHealth: "green" | "yellow" | "red" = "green";
      if (safeMode.active || servicesDown.length >= 2 || openBreakers.length >= 2 || criticalBudgets.length >= 2) {
        overallHealth = "red";
      } else if (servicesDegraded.length > 0 || openBreakers.length > 0 || halfOpenBreakers.length > 0 || criticalBudgets.length > 0 || minCore.active) {
        overallHealth = "yellow";
      }

      const overallStatusMap: Record<string, string> = { green: "healthy", yellow: "degraded", red: "down" };

      res.json({
        overallHealth,
        overallStatus: overallStatusMap[overallHealth] || "unknown",
        deploymentVersion: process.env.REPL_SLUG || "development",
        uptime: process.uptime(),
        safeMode,
        emergencyMode: safeMode,
        minimalCore: minCore,
        healthChecks: healthResults.services,
        circuitBreakers: cbStates,
        featureFlags: flags.map(f => ({ key: f.key, enabled: isFeatureEnabled(f.key), description: f.description, errorCount: f.errorCount, errorThreshold: (f as any).errorThreshold || 5, disabledReason: f.disabledReason, adminOverride: f.adminOverride, autoDisableOnErrors: f.autoDisableOnErrors })),
        killSwitches: kswitches,
        errorBudgets: budgets,
        alerts: { unacknowledged: recentAlerts, totalUnack: alertEvents.filter(a => !a.acknowledged).length },
        events: getResilienceEvents(100),
        examHealth,
        aiStatus,
        dbMetrics,
        provisionalAccess: provisionalGrants,
        affectedUsers: dbMetrics?.activeSubscribers || 0,
        fallbackUsageRate: safeMode.active ? 100 : 0,
        loadShedding,
        selfHealing: selfHealLog.slice(0, 10),
        recentAuditActions,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load ops status", detail: err.message });
    }
  });

  app.get("/api/admin/ops/incidents-summary", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "ops_viewer");
    if (!admin) return;
    try {
      const incidents = await pool.query(
        `SELECT severity, COUNT(*)::int AS cnt FROM exam_incidents WHERE created_at > NOW() - INTERVAL '24 hours' GROUP BY severity`
      ).catch(() => ({ rows: [] }));
      const emergencyLog = await pool.query(
        `SELECT action, reason, actor, auto_triggered, created_at FROM platform_emergency_log ORDER BY created_at DESC LIMIT 10`
      ).catch(() => ({ rows: [] }));
      res.json({ incidentsBySeverity: incidents.rows, emergencyLog: emergencyLog.rows, timestamp: Date.now() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Client degradation info endpoint ---

  app.get("/api/platform/degradation", (_req: Request, res: Response) => {
    const state = getDegradationState();
    const ladder = DEGRADATION_LADDER[state.level] || DEGRADATION_LADDER[0];
    res.json({
      level: state.level,
      levelName: state.levelName,
      ladderLabel: ladder.label,
      disabledFeatures: ladder.disabledFeatures,
      enabledAlways: ladder.enabledAlways,
      disableAnimations: state.level >= 1,
      simplifyUi: state.level >= 2,
      safeRenderer: state.level >= 3,
      staticBackup: state.level >= 4,
      substituteContent: state.level >= 5,
    });
  });

  // --- Admin observability dashboard endpoint ---

  app.get("/api/admin/observability", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "support_admin", "ops_viewer");
    if (!admin) return;
    try {
      const mem = process.memoryUsage();
      const rssMB = Math.round(mem.rss / 1024 / 1024);
      const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);

      let memoryTrend: any[] = [];
      try {
        const { getMemoryTrend } = await import("./memory-monitor");
        memoryTrend = getMemoryTrend().spikes.slice(-60);
      } catch {}

      const routeLatency = getRouteLatencyStats().slice(0, 30);
      const degradation = getDegradationState();
      const ladder = DEGRADATION_LADDER[degradation.level] || DEGRADATION_LADDER[0];
      const cbStates = getCircuitBreakerStates();
      const healthResults = cachedHealthResponse || { status: "unknown", services: [], timestamp: 0 };
      const budgets = getErrorBudgets();
      const recentAlerts = alertEvents.filter(a => !a.acknowledged).slice(0, 20);
      const loadShedding = getLoadSheddingStatus();

      const dbPool = {
        totalCount: (pool as any).totalCount || 0,
        idleCount: (pool as any).idleCount || 0,
        waitingCount: (pool as any).waitingCount || 0,
      };

      let activeExams = 0;
      try {
        const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM mock_exam_attempts WHERE status = 'in_progress'");
        activeExams = r.rows[0]?.cnt || 0;
      } catch {}

      let recentIncidents = 0;
      try {
        const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM exam_incidents WHERE created_at > NOW() - INTERVAL '1 hour'");
        recentIncidents = r.rows[0]?.cnt || 0;
      } catch {}

      res.json({
        memory: { rssMB, heapUsedMB, heapTotalMB, trend: memoryTrend },
        routeLatency,
        degradation: {
          level: degradation.level,
          levelName: degradation.levelName,
          ladderLabel: ladder.label,
          disabledFeatures: ladder.disabledFeatures,
          escalationHistory: degradation.escalationHistory.slice(0, 20),
        },
        circuitBreakers: cbStates,
        healthChecks: healthResults.services,
        healthStatus: healthResults.status,
        errorBudgets: budgets,
        alerts: recentAlerts,
        loadShedding,
        dbPool,
        concurrency: { activeExams, recentIncidents1h: recentIncidents },
        uptime: process.uptime(),
        emergencyMode: getEmergencyModeStatus(),
        timestamp: Date.now(),
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load observability data", detail: err.message });
    }
  });

  // --- Growth readiness assessment endpoint ---

  app.get("/api/admin/growth-readiness", async (req: Request, res: Response) => {
    const admin = await resolveAdminWithRole(req, res, "super_admin", "ops_viewer");
    if (!admin) return;
    try {
      const mem = process.memoryUsage();
      const rssMB = Math.round(mem.rss / 1024 / 1024);
      const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
      const memoryLimitMB = parseInt(process.env.MEMORY_TOTAL_MB || "0") || 256;
      const memoryUsagePercent = Math.round((rssMB / memoryLimitMB) * 100);

      const dbPool = {
        totalCount: (pool as any).totalCount || 0,
        idleCount: (pool as any).idleCount || 0,
        waitingCount: (pool as any).waitingCount || 0,
        maxConnections: (pool as any).options?.max || 10,
      };
      const dbPoolUsagePercent = dbPool.maxConnections > 0 ? Math.round(((dbPool.totalCount - dbPool.idleCount) / dbPool.maxConnections) * 100) : 0;

      let totalUsers = 0;
      let activeSubscribers = 0;
      let recentSignups7d = 0;
      try {
        const r1 = await pool.query("SELECT COUNT(*)::int AS cnt FROM users");
        totalUsers = r1.rows[0]?.cnt || 0;
        const r2 = await pool.query("SELECT COUNT(*)::int AS cnt FROM users WHERE tier != 'free' AND tier IS NOT NULL AND tier != ''");
        activeSubscribers = r2.rows[0]?.cnt || 0;
        const r3 = await pool.query("SELECT COUNT(*)::int AS cnt FROM users WHERE created_at > NOW() - INTERVAL '7 days'");
        recentSignups7d = r3.rows[0]?.cnt || 0;
      } catch {}

      const routeLatency = getRouteLatencyStats();
      const slowRoutes = routeLatency.filter((r: any) => (r.avgMs || r.avg || 0) > 2000);
      const cbStates = getCircuitBreakerStates();
      const openBreakers = cbStates.filter(cb => cb.state === "open");
      const healthResults = cachedHealthResponse || { status: "unknown", services: [], timestamp: 0 };
      const downServices = (healthResults.services || []).filter((s: any) => s.status === "down");
      const degradedServices = (healthResults.services || []).filter((s: any) => s.status === "degraded");

      const findings: Array<{ category: string; severity: "ok" | "warning" | "critical"; message: string }> = [];

      if (memoryUsagePercent > 85) {
        findings.push({ category: "memory", severity: "critical", message: `Memory usage at ${memoryUsagePercent}% (${rssMB}/${memoryLimitMB}MB) — near capacity` });
      } else if (memoryUsagePercent > 65) {
        findings.push({ category: "memory", severity: "warning", message: `Memory usage at ${memoryUsagePercent}% — consider scaling before growth` });
      } else {
        findings.push({ category: "memory", severity: "ok", message: `Memory usage at ${memoryUsagePercent}% — healthy headroom` });
      }

      if (dbPoolUsagePercent > 80) {
        findings.push({ category: "database", severity: "critical", message: `DB pool usage at ${dbPoolUsagePercent}% (${dbPool.totalCount - dbPool.idleCount}/${dbPool.maxConnections}) — increase pool size` });
      } else if (dbPoolUsagePercent > 50) {
        findings.push({ category: "database", severity: "warning", message: `DB pool usage at ${dbPoolUsagePercent}% — monitor under growth` });
      } else {
        findings.push({ category: "database", severity: "ok", message: `DB pool usage at ${dbPoolUsagePercent}% — adequate capacity` });
      }

      if (dbPool.waitingCount > 0) {
        findings.push({ category: "database", severity: "warning", message: `${dbPool.waitingCount} queries waiting for DB connections` });
      }

      if (slowRoutes.length > 5) {
        findings.push({ category: "performance", severity: "critical", message: `${slowRoutes.length} routes with avg latency >2s — optimize before scaling` });
      } else if (slowRoutes.length > 0) {
        findings.push({ category: "performance", severity: "warning", message: `${slowRoutes.length} routes with avg latency >2s` });
      } else {
        findings.push({ category: "performance", severity: "ok", message: "All routes within latency targets" });
      }

      if (openBreakers.length > 0) {
        findings.push({ category: "reliability", severity: "critical", message: `${openBreakers.length} circuit breakers open — fix before growth` });
      }
      if (downServices.length > 0) {
        findings.push({ category: "reliability", severity: "critical", message: `${downServices.length} services down` });
      } else if (degradedServices.length > 0) {
        findings.push({ category: "reliability", severity: "warning", message: `${degradedServices.length} services degraded` });
      } else {
        findings.push({ category: "reliability", severity: "ok", message: "All services healthy" });
      }

      const criticalCount = findings.filter(f => f.severity === "critical").length;
      const warningCount = findings.filter(f => f.severity === "warning").length;
      const overallReadiness: "ready" | "caution" | "not_ready" = criticalCount > 0 ? "not_ready" : warningCount > 2 ? "caution" : "ready";
      const score = Math.max(0, 100 - (criticalCount * 25) - (warningCount * 10));

      res.json({
        readiness: overallReadiness,
        score,
        findings,
        metrics: {
          memory: { rssMB, heapTotalMB, limitMB: memoryLimitMB, usagePercent: memoryUsagePercent },
          dbPool: { ...dbPool, usagePercent: dbPoolUsagePercent },
          users: { total: totalUsers, subscribers: activeSubscribers, recentSignups7d },
          performance: { totalRoutes: routeLatency.length, slowRoutes: slowRoutes.length },
          reliability: { downServices: downServices.length, degradedServices: degradedServices.length, openBreakers: openBreakers.length },
        },
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate growth readiness report", detail: err.message });
    }
  });

}

export function degradationLadderMiddleware(req: Request, res: Response, next: NextFunction): void {
  const level = degradationState.manualOverride !== null ? degradationState.manualOverride : degradationState.level;
  if (level === 0) return next();
  if (!req.path.startsWith("/api")) return next();

  const ladder = DEGRADATION_LADDER[level];
  if (!ladder) return next();

  const ESSENTIAL_PATHS = ["/api/auth", "/api/user", "/api/stripe", "/api/mock-exams", "/api/exam-questions", "/api/content/exams", "/api/health", "/api/admin/resilience"];
  for (const prefix of ESSENTIAL_PATHS) {
    if (req.path.startsWith(prefix)) return next();
  }

  if (level >= 4) {
    for (const prefix of NON_ESSENTIAL_ROUTE_PREFIXES) {
      if (req.path.startsWith(prefix)) {
        res.status(503).json({ error: "Feature disabled during emergency degradation", _degraded: true, degradationLevel: level });
        return;
      }
    }
  }

  if (level >= 2 && req.path.includes("bulk")) {
    res.status(503).json({ error: "Bulk operations disabled during degradation", _degraded: true, degradationLevel: level });
    return;
  }

  if (level >= 1 && (req.path.includes("ai-") || req.path.includes("generate"))) {
    if (req.method !== "GET") {
      res.status(503).json({ error: "AI generation disabled during degradation", _degraded: true, degradationLevel: level });
      return;
    }
  }

  next();
}

export function fallbackResponseMiddleware(req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json.bind(res);
  const originalStatus = res.status.bind(res);
  let statusCode = 200;

  res.status = function(code: number) {
    statusCode = code;
    return originalStatus(code);
  } as any;

  res.json = function(body: any) {
    if (statusCode >= 500 && !body?._degraded) {
      const fallback = {
        ...body,
        _degraded: true,
        _fallback: true,
        _originalError: body?.error || "Internal server error",
        error: "Service temporarily degraded — partial data may be shown",
        timestamp: Date.now(),
      };
      return originalJson.call(res, fallback);
    }
    return originalJson.call(res, body);
  } as any;

  next();
}
