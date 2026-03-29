import type { AlertSeverity } from "./alerting-engine";

export type AlertCategory =
  | "memory_critical"
  | "emergency_mode_activated"
  | "service_down"
  | "synthetic_test_failure"
  | "content_integrity_failure"
  | "deploy_freeze"
  | "reliability_warning"
  | "circuit_breaker_trip"
  | "failure_rate_spike"
  | "fallback_usage_spike"
  | "quarantine_event"
  | "backup_generation_failure"
  | "entitlement_anomaly"
  | "payment_sync_spike"
  | "zero_valid_items"
  | "lkg_failover_repeated"
  | "protected_recovery_excessive"
  | "general";

interface TrackedIncident {
  signature: string;
  category: AlertCategory;
  severity: AlertSeverity;
  message: string;
  firstSeen: number;
  lastSeen: number;
  emailsSent: number;
  lastEmailAt: number | null;
  occurrenceCount: number;
  resolved: boolean;
  resolvedAt: number | null;
  suppressedCount: number;
}

interface CoordinatorConfig {
  globalRateLimitCount: number;
  globalRateLimitWindowMs: number;
  perIncidentCooldownMs: number;
  escalationCooldownMs: number;
}

const DEFAULT_CONFIG: CoordinatorConfig = {
  globalRateLimitCount: 5,
  globalRateLimitWindowMs: 15 * 60 * 1000,
  perIncidentCooldownMs: 30 * 60 * 1000,
  escalationCooldownMs: 15 * 60 * 1000,
};

const incidents = new Map<string, TrackedIncident>();
const globalEmailTimestamps: number[] = [];
let config: CoordinatorConfig = { ...DEFAULT_CONFIG };
let totalSuppressed = 0;

function computeSignature(category: string, context?: string): string {
  return context ? `${category}::${context}` : category;
}

function isGlobalRateLimited(): boolean {
  const now = Date.now();
  const windowStart = now - config.globalRateLimitWindowMs;
  while (globalEmailTimestamps.length > 0 && globalEmailTimestamps[0] < windowStart) {
    globalEmailTimestamps.shift();
  }
  return globalEmailTimestamps.length >= config.globalRateLimitCount;
}

function recordGlobalEmail(): void {
  globalEmailTimestamps.push(Date.now());
}

export interface AlertDecision {
  shouldSendEmail: boolean;
  reason: string;
  incidentSignature: string;
  isNew: boolean;
  isEscalation: boolean;
}

export function evaluateAlert(
  category: AlertCategory,
  severity: AlertSeverity,
  message: string,
  context?: string
): AlertDecision {
  const signature = computeSignature(category, context);
  const now = Date.now();
  const existing = incidents.get(signature);

  if (!existing) {
    const incident: TrackedIncident = {
      signature,
      category,
      severity,
      message,
      firstSeen: now,
      lastSeen: now,
      emailsSent: 0,
      lastEmailAt: null,
      occurrenceCount: 1,
      resolved: false,
      resolvedAt: null,
      suppressedCount: 0,
    };
    incidents.set(signature, incident);

    if (isGlobalRateLimited()) {
      incident.suppressedCount++;
      totalSuppressed++;
      return { shouldSendEmail: false, reason: "global_rate_limited", incidentSignature: signature, isNew: true, isEscalation: false };
    }

    return { shouldSendEmail: true, reason: "new_incident", incidentSignature: signature, isNew: true, isEscalation: false };
  }

  existing.lastSeen = now;
  existing.occurrenceCount++;
  existing.message = message;

  if (existing.resolved) {
    existing.resolved = false;
    existing.resolvedAt = null;
    existing.emailsSent = 0;
    existing.lastEmailAt = null;

    if (isGlobalRateLimited()) {
      existing.suppressedCount++;
      totalSuppressed++;
      return { shouldSendEmail: false, reason: "global_rate_limited_reopen", incidentSignature: signature, isNew: false, isEscalation: false };
    }

    return { shouldSendEmail: true, reason: "incident_reopened", incidentSignature: signature, isNew: false, isEscalation: false };
  }

  const severityRank = (s: AlertSeverity) => s === "critical" ? 3 : s === "warning" ? 2 : 1;
  const isEscalation = severityRank(severity) > severityRank(existing.severity);

  if (isEscalation) {
    existing.severity = severity;

    const cooldownOk = !existing.lastEmailAt || (now - existing.lastEmailAt > config.escalationCooldownMs);
    if (cooldownOk && !isGlobalRateLimited()) {
      return { shouldSendEmail: true, reason: "severity_escalation", incidentSignature: signature, isNew: false, isEscalation: true };
    }
  }

  const perIncidentCooldownOk = !existing.lastEmailAt || (now - existing.lastEmailAt > config.perIncidentCooldownMs);
  if (perIncidentCooldownOk && existing.occurrenceCount % 50 === 0 && !isGlobalRateLimited()) {
    return { shouldSendEmail: true, reason: "periodic_reminder", incidentSignature: signature, isNew: false, isEscalation: false };
  }

  existing.suppressedCount++;
  totalSuppressed++;
  return { shouldSendEmail: false, reason: "deduplicated", incidentSignature: signature, isNew: false, isEscalation: false };
}

export function recordEmailSent(signature: string): void {
  const incident = incidents.get(signature);
  if (incident) {
    incident.emailsSent++;
    incident.lastEmailAt = Date.now();
  }
  recordGlobalEmail();
}

export function resolveAlert(category: AlertCategory, context?: string): void {
  const signature = computeSignature(category, context);
  const incident = incidents.get(signature);
  if (incident && !incident.resolved) {
    incident.resolved = true;
    incident.resolvedAt = Date.now();
  }
}

export function getCoordinatorStats(): {
  activeIncidents: number;
  totalTracked: number;
  totalSuppressed: number;
  globalEmailsInWindow: number;
  globalRateLimit: number;
  incidents: Array<{
    signature: string;
    category: AlertCategory;
    severity: AlertSeverity;
    occurrenceCount: number;
    suppressedCount: number;
    emailsSent: number;
    resolved: boolean;
    firstSeen: string;
    lastSeen: string;
  }>;
} {
  const now = Date.now();
  const windowStart = now - config.globalRateLimitWindowMs;
  const emailsInWindow = globalEmailTimestamps.filter(t => t >= windowStart).length;

  const incidentList = Array.from(incidents.values())
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .slice(0, 50)
    .map(i => ({
      signature: i.signature,
      category: i.category,
      severity: i.severity,
      occurrenceCount: i.occurrenceCount,
      suppressedCount: i.suppressedCount,
      emailsSent: i.emailsSent,
      resolved: i.resolved,
      firstSeen: new Date(i.firstSeen).toISOString(),
      lastSeen: new Date(i.lastSeen).toISOString(),
    }));

  return {
    activeIncidents: Array.from(incidents.values()).filter(i => !i.resolved).length,
    totalTracked: incidents.size,
    totalSuppressed,
    globalEmailsInWindow: emailsInWindow,
    globalRateLimit: config.globalRateLimitCount,
    incidents: incidentList,
  };
}

export function updateCoordinatorConfig(updates: Partial<CoordinatorConfig>): CoordinatorConfig {
  config = { ...config, ...updates };
  return { ...config };
}

export function cleanupOldIncidents(): void {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [key, incident] of incidents) {
    if (incident.resolved && incident.resolvedAt && incident.resolvedAt < cutoff) {
      incidents.delete(key);
    }
    if (incident.lastSeen < cutoff) {
      incidents.delete(key);
    }
  }
}

setInterval(cleanupOldIncidents, 60 * 60 * 1000);
