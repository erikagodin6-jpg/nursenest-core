import fs from "fs";
import path from "path";
import pg from "pg";
import { sendAdminNotification, getNotificationSettings } from "./admin-notifications";
import { evaluateAlert, recordEmailSent, type AlertCategory } from "./alert-coordinator";

/* =========================
   TYPES
========================= */

export type AlertType =
  | "failure_rate_spike"
  | "fallback_usage_spike"
  | "entitlement_anomaly"
  | "backup_generation_failure"
  | "quarantine_event"
  | "protected_recovery_excessive"
  | "synthetic_test_failure"
  | "circuit_breaker_trip"
  | "emergency_mode_activated"
  | "zero_valid_items"
  | "lkg_failover_repeated"
  | "payment_sync_spike"
  | "memory_pressure"
  | "content_validation_failure"
  | "deploy_smoke_failure"
  | "exam_flow_failure"
  | "resource_budget_violation";

export type AlertSeverity = "info" | "warning" | "critical";

/* =========================
   CONFIG
========================= */

const COOLDOWNS: Record<AlertType, number> = {
  failure_rate_spike: 10,
  fallback_usage_spike: 15,
  entitlement_anomaly: 30,
  backup_generation_failure: 20,
  quarantine_event: 5,
  protected_recovery_excessive: 15,
  synthetic_test_failure: 10,
  circuit_breaker_trip: 5,
  emergency_mode_activated: 30,
  zero_valid_items: 60,
  lkg_failover_repeated: 15,
  payment_sync_spike: 20,
  memory_pressure: 10,
  content_validation_failure: 15,
  deploy_smoke_failure: 5,
  exam_flow_failure: 5,
  resource_budget_violation: 10,
};

/* =========================
   STATE
========================= */

const cooldownMap = new Map<AlertType, number>();
const dedupMap = new Map<string, number>();

/** Extra cooldown added on top of per-type + admin floor (e.g. alert-flood runbook). */
let floodCooldownBoostMs = 0;

const THRESHOLDS_PATH = path.join(process.cwd(), "data", "alert-thresholds.json");

export type AlertThresholdConfig = {
  failureRatePercent: number;
  fallbackRatePercent: number;
  quarantineCountPerHour: number;
  protectedRecoveryCountPerHour: number;
  backupFailureCountPerHour: number;
  entitlementMismatchCountPerHour: number;
  /** Minimum spacing between fires of the same alert type (minutes). */
  cooldownMinutes: number;
};

const DEFAULT_THRESHOLDS: AlertThresholdConfig = {
  failureRatePercent: 5,
  fallbackRatePercent: 25,
  quarantineCountPerHour: 10,
  protectedRecoveryCountPerHour: 50,
  backupFailureCountPerHour: 5,
  entitlementMismatchCountPerHour: 20,
  cooldownMinutes: 0,
};

let thresholdSnapshot: AlertThresholdConfig = { ...DEFAULT_THRESHOLDS };

function loadThresholdsFromDisk(): void {
  try {
    const raw = fs.readFileSync(THRESHOLDS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AlertThresholdConfig>;
    thresholdSnapshot = { ...DEFAULT_THRESHOLDS, ...parsed };
  } catch {
    thresholdSnapshot = { ...DEFAULT_THRESHOLDS };
  }
}

function persistThresholdsToDisk(): void {
  try {
    fs.mkdirSync(path.dirname(THRESHOLDS_PATH), { recursive: true });
    fs.writeFileSync(THRESHOLDS_PATH, JSON.stringify(thresholdSnapshot, null, 2), "utf8");
  } catch (e: any) {
    console.error("[Alert] Failed to persist thresholds:", e?.message);
  }
}

loadThresholdsFromDisk();

/* =========================
   HELPERS
========================= */

function now() {
  return Date.now();
}

function effectiveCooldownMs(type: AlertType): number {
  const perTypeMs = (COOLDOWNS[type] || 15) * 60 * 1000;
  const adminFloorMs = Math.max(0, thresholdSnapshot.cooldownMinutes) * 60 * 1000;
  return Math.max(perTypeMs, adminFloorMs) + floodCooldownBoostMs;
}

function isInCooldown(type: AlertType): boolean {
  const last = cooldownMap.get(type);
  if (!last) return false;

  const cooldownMs = effectiveCooldownMs(type);
  return now() - last < cooldownMs;
}

function markCooldown(type: AlertType) {
  cooldownMap.set(type, now());
}

function isDuplicate(type: AlertType, message: string): boolean {
  const key = `${type}:${message.slice(0, 100)}`;
  const last = dedupMap.get(key);

  if (last && now() - last < 5 * 60 * 1000) return true;

  dedupMap.set(key, now());
  return false;
}

/* =========================
   CORE: FIRE ALERT
========================= */

export async function fireAlert(
  pool: pg.Pool,
  type: AlertType,
  severity: AlertSeverity,
  message: string,
  metadata: Record<string, any> = {}
): Promise<string | null> {

  if (isInCooldown(type)) {
    console.log(`[Alert] Suppressed (cooldown): ${type}`);
    return null;
  }

  if (isDuplicate(type, message)) {
    console.log(`[Alert] Suppressed (duplicate): ${type}`);
    return null;
  }

  try {
    const result = await pool.query(
      `INSERT INTO reliability_alerts (alert_type, severity, message, metadata)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [type, severity, message, JSON.stringify(metadata)]
    );

    markCooldown(type);

    console.log(`[Alert] ${severity.toUpperCase()} → ${type}: ${message}`);

    await maybeSendNotification(pool, type, severity, message);

    return result.rows[0]?.id || null;

  } catch (e: any) {
    console.error("[Alert] Failed:", e.message);
    return null;
  }
}

/* =========================
   NOTIFICATIONS
========================= */

async function maybeSendNotification(
  pool: pg.Pool,
  type: AlertType,
  severity: AlertSeverity,
  message: string
) {
  const decision = evaluateAlert(type as AlertCategory, severity, message);

  if (!decision.shouldSendEmail) return;

  const settings = await getNotificationSettings(pool);

  const shouldSend =
    (severity === "critical" && settings.notifyOnCriticalIncident) ||
    (severity === "warning" && settings.notifyOnWarningIncident);

  if (!shouldSend) return;

  try {
    await sendAdminNotification(pool, {
      event: severity === "critical" ? "service_down" : "reliability_alert",
      alertType: type,
      alertSeverity: severity,
      details: `${severity.toUpperCase()}: ${message}`,
    });

    recordEmailSent(decision.incidentSignature);

  } catch (e: any) {
    console.error("[Alert] Notification failed:", e.message);
  }
}

/* =========================
   CHECKS (example)
========================= */

export async function checkFailureRate(pool: pg.Pool) {
  const res = await pool.query(`
    SELECT COUNT(*) FILTER (WHERE status_code >= 500)::int AS errors,
           COUNT(*)::int AS total
    FROM request_logs
    WHERE created_at > NOW() - INTERVAL '15 minutes'
  `);

  const { errors, total } = res.rows[0];

  if (total < 10) return;

  const rate = (errors / total) * 100;

  const warnAt = thresholdSnapshot.failureRatePercent;
  const criticalAt = Math.max(15, warnAt * 3);

  if (rate >= warnAt) {
    await fireAlert(
      pool,
      "failure_rate_spike",
      rate >= criticalAt ? "critical" : "warning",
      `Failure rate ${rate.toFixed(1)}%`
    );
  }
}

/** Synthetic monitoring hook — wraps `fireAlert` with stable metadata shape. */
export async function fireSyntheticTestFailureAlert(
  pool: pg.Pool,
  testName: string,
  errorMessage: string,
  responseTimeMs?: number,
): Promise<string | null> {
  return fireAlert(pool, "synthetic_test_failure", "warning", `${testName}: ${errorMessage}`, {
    testName,
    responseTimeMs: responseTimeMs ?? null,
  });
}

/* =========================
   THRESHOLDS API (admin / dashboard)
========================= */

export function getAlertThresholds(): AlertThresholdConfig {
  return { ...thresholdSnapshot };
}

export async function setAlertThresholds(
  updates: Partial<Record<keyof AlertThresholdConfig, number>>,
  _pool: pg.Pool,
): Promise<AlertThresholdConfig> {
  for (const [key, val] of Object.entries(updates)) {
    if (typeof val !== "number" || val < 0 || !(key in DEFAULT_THRESHOLDS)) continue;
    (thresholdSnapshot as any)[key] = val;
  }
  persistThresholdsToDisk();
  return getAlertThresholds();
}

/**
 * Runbook hook: widen cooldowns during alert floods (sync; persists thresholds file).
 */
export function updateAlertThresholds(updates: { cooldownMs?: number }): void {
  if (typeof updates.cooldownMs !== "number" || updates.cooldownMs < 0) return;
  floodCooldownBoostMs = Math.max(0, updates.cooldownMs - 5 * 60 * 1000);
  thresholdSnapshot.cooldownMinutes = Math.max(
    thresholdSnapshot.cooldownMinutes,
    Math.round(updates.cooldownMs / 60000),
  );
  persistThresholdsToDisk();
}

export interface IncidentGroup {
  id: string;
  name: string;
  alertTypes: AlertType[];
}

export function getIncidentGroups(): IncidentGroup[] {
  return [
    {
      id: "http_platform",
      name: "HTTP / routing",
      alertTypes: ["failure_rate_spike", "fallback_usage_spike", "circuit_breaker_trip"],
    },
    {
      id: "content",
      name: "Content / validation",
      alertTypes: ["quarantine_event", "content_validation_failure", "zero_valid_items"],
    },
    {
      id: "billing",
      name: "Entitlements / payments",
      alertTypes: ["entitlement_anomaly", "payment_sync_spike"],
    },
    {
      id: "ops",
      name: "Deploy / synthetic / backups",
      alertTypes: [
        "deploy_smoke_failure",
        "synthetic_test_failure",
        "backup_generation_failure",
        "memory_pressure",
        "protected_recovery_excessive",
      ],
    },
  ];
}

export async function runAlertingChecks(pool: pg.Pool): Promise<void> {
  await checkFailureRate(pool);
}

export async function fireQuarantineAlert(
  pool: pg.Pool,
  contentId: string,
  contentType: string,
  reason: string,
): Promise<string | null> {
  return fireAlert(
    pool,
    "quarantine_event",
    "warning",
    `Content quarantined: ${contentType} ${contentId} — ${reason}`,
    { contentId, contentType, reason },
  );
}

/* =========================
   BACKGROUND INTERVAL (emergency resume / optional ops)
========================= */

let engineTimer: ReturnType<typeof setInterval> | null = null;
let enginePool: pg.Pool | null = null;

export function startAlertingEngine(pool: pg.Pool, intervalMs: number): void {
  stopAlertingEngine();
  enginePool = pool;
  engineTimer = setInterval(() => {
    const p = enginePool;
    if (!p) return;
    runAlertingChecks(p).catch((e: any) =>
      console.error("[AlertingEngine] check error:", e?.message),
    );
  }, intervalMs);
}

export function stopAlertingEngine(): void {
  if (engineTimer) clearInterval(engineTimer);
  engineTimer = null;
  enginePool = null;
}