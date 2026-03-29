import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import {
  getCircuitBreakerStates,
  getResilienceEvents,
  isEmergencyMode,
  activateEmergencyMode,
  addAlert,
} from "./platform-resilience";

interface DeployHealthConfig {
  monitoringWindowMs: number;
  errorRateThreshold: number;
  p95LatencyThresholdMs: number;
  circuitBreakerTripThreshold: number;
  fallbackSpikeThreshold: number;
  checkIntervalMs: number;
  autoRollbackEnabled: boolean;
}

const DEFAULT_CONFIG: DeployHealthConfig = {
  monitoringWindowMs: 5 * 60 * 1000,
  errorRateThreshold: 0.05,
  p95LatencyThresholdMs: 5000,
  circuitBreakerTripThreshold: 2,
  fallbackSpikeThreshold: 10,
  checkIntervalMs: 15000,
  autoRollbackEnabled: true,
};

let deployHealthConfig: DeployHealthConfig = { ...DEFAULT_CONFIG };

interface DeployRecord {
  id: string;
  version: string;
  deployedAt: number;
  status: "monitoring" | "healthy" | "unhealthy" | "rolled_back";
  healthGateResult: DeployHealthGateResult | null;
  monitoringEndAt: number;
}

interface DeployHealthGateResult {
  passed: boolean;
  errorRate: number;
  p95LatencyMs: number;
  circuitBreakerTrips: number;
  fallbackSpikes: number;
  checkedAt: number;
  issues: string[];
}

interface RequestMetric {
  timestamp: number;
  latencyMs: number;
  success: boolean;
  endpoint: string;
  isFallback: boolean;
}

const requestMetrics: RequestMetric[] = [];
const MAX_METRICS = 10000;
let currentDeploy: DeployRecord | null = null;
const deployHistory: DeployRecord[] = [];
const MAX_DEPLOY_HISTORY = 50;
let healthGateInterval: ReturnType<typeof setInterval> | null = null;

let deployFreezeActive = false;
let deployFreezeReason: string | null = null;
let deployFreezeActivatedAt: number | null = null;

export function recordRequestMetric(metric: Omit<RequestMetric, "timestamp">): void {
  requestMetrics.push({ ...metric, timestamp: Date.now() });
  if (requestMetrics.length > MAX_METRICS) {
    requestMetrics.splice(0, requestMetrics.length - MAX_METRICS);
  }
}

function getMetricsInWindow(windowMs: number): RequestMetric[] {
  const cutoff = Date.now() - windowMs;
  return requestMetrics.filter(m => m.timestamp > cutoff);
}

function calculateErrorRate(metrics: RequestMetric[]): number {
  if (metrics.length === 0) return 0;
  const errors = metrics.filter(m => !m.success).length;
  return errors / metrics.length;
}

function calculateP95Latency(metrics: RequestMetric[]): number {
  if (metrics.length === 0) return 0;
  const sorted = metrics.map(m => m.latencyMs).sort((a, b) => a - b);
  const idx = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[Math.max(0, idx)];
}

function countFallbackSpikes(metrics: RequestMetric[]): number {
  return metrics.filter(m => m.isFallback).length;
}

function countOpenCircuitBreakers(): number {
  return getCircuitBreakerStates().filter(cb => cb.state === "open").length;
}

export function runDeployHealthGate(): DeployHealthGateResult {
  const metrics = getMetricsInWindow(deployHealthConfig.monitoringWindowMs);
  const errorRate = calculateErrorRate(metrics);
  const p95Latency = calculateP95Latency(metrics);
  const cbTrips = countOpenCircuitBreakers();
  const fallbackSpikes = countFallbackSpikes(metrics);
  const issues: string[] = [];

  if (errorRate > deployHealthConfig.errorRateThreshold) {
    issues.push(`Error rate ${(errorRate * 100).toFixed(1)}% exceeds threshold ${(deployHealthConfig.errorRateThreshold * 100).toFixed(1)}%`);
  }
  if (p95Latency > deployHealthConfig.p95LatencyThresholdMs) {
    issues.push(`P95 latency ${p95Latency}ms exceeds threshold ${deployHealthConfig.p95LatencyThresholdMs}ms`);
  }
  if (cbTrips >= deployHealthConfig.circuitBreakerTripThreshold) {
    issues.push(`${cbTrips} circuit breakers open (threshold: ${deployHealthConfig.circuitBreakerTripThreshold})`);
  }
  if (fallbackSpikes >= deployHealthConfig.fallbackSpikeThreshold) {
    issues.push(`${fallbackSpikes} fallback activations in window (threshold: ${deployHealthConfig.fallbackSpikeThreshold})`);
  }

  return {
    passed: issues.length === 0,
    errorRate,
    p95LatencyMs: p95Latency,
    circuitBreakerTrips: cbTrips,
    fallbackSpikes,
    checkedAt: Date.now(),
    issues,
  };
}

export function startDeployMonitoring(version: string): DeployRecord {
  const deploy: DeployRecord = {
    id: `deploy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    version,
    deployedAt: Date.now(),
    status: "monitoring",
    healthGateResult: null,
    monitoringEndAt: Date.now() + deployHealthConfig.monitoringWindowMs,
  };

  currentDeploy = deploy;
  deployHistory.unshift(deploy);
  if (deployHistory.length > MAX_DEPLOY_HISTORY) {
    deployHistory.length = MAX_DEPLOY_HISTORY;
  }

  if (healthGateInterval) clearInterval(healthGateInterval);
  healthGateInterval = setInterval(() => {
    checkCurrentDeployHealth();
  }, deployHealthConfig.checkIntervalMs);

  console.log(`[DeployProtection] Monitoring started for deploy ${deploy.id} (version: ${version})`);
  try {
    const { trackChange } = require("./incident-correlation");
    trackChange({ type: "deploy" as const, source: "deployment-protection", description: `Deploy ${version} started monitoring`, entityId: deploy.id, actor: null, metadata: { version, deployId: deploy.id } });
  } catch {}
  return deploy;
}

function checkCurrentDeployHealth(): void {
  if (!currentDeploy || currentDeploy.status !== "monitoring") {
    if (healthGateInterval) {
      clearInterval(healthGateInterval);
      healthGateInterval = null;
    }
    return;
  }

  const result = runDeployHealthGate();
  currentDeploy.healthGateResult = result;

  if (!result.passed && deployHealthConfig.autoRollbackEnabled) {
    currentDeploy.status = "unhealthy";
    triggerRollbackAlert(currentDeploy, result);
    if (healthGateInterval) {
      clearInterval(healthGateInterval);
      healthGateInterval = null;
    }
    return;
  }

  if (Date.now() >= currentDeploy.monitoringEndAt) {
    if (result.passed) {
      currentDeploy.status = "healthy";
      console.log(`[DeployProtection] Deploy ${currentDeploy.id} passed health gate`);
    } else {
      currentDeploy.status = "unhealthy";
      triggerRollbackAlert(currentDeploy, result);
    }
    if (healthGateInterval) {
      clearInterval(healthGateInterval);
      healthGateInterval = null;
    }
  }
}

function triggerRollbackAlert(deploy: DeployRecord, result: DeployHealthGateResult): void {
  const issuesList = result.issues.join("; ");
  console.error(`[DeployProtection] ROLLBACK ALERT for deploy ${deploy.id}: ${issuesList}`);

  addAlert(
    "critical",
    "deployment",
    `Deploy Unhealthy: ${deploy.version}`,
    `Deploy ${deploy.id} failed health gate. Issues: ${issuesList}. Rollback recommended.`,
    "deployment_protection",
    { deployId: deploy.id, version: deploy.version, healthGate: result }
  );

  persistDeployEvent("rollback_alert", deploy.id, deploy.version, issuesList).catch(() => {});
}

async function persistDeployEvent(action: string, deployId: string, version: string, details: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO platform_emergency_log (action, reason, actor, auto_triggered) VALUES ($1, $2, $3, $4)`,
      [action, `Deploy ${version} (${deployId}): ${details}`, "deployment_protection", true]
    );
  } catch {}
}

export function checkDeployFreeze(): { frozen: boolean; reason: string | null; activatedAt: number | null } {
  const openBreakers = countOpenCircuitBreakers();

  if (openBreakers >= 2 && !deployFreezeActive) {
    activateDeployFreeze(`Auto-triggered: ${openBreakers} circuit breakers open`);
  }

  if (isEmergencyMode() && !deployFreezeActive) {
    activateDeployFreeze("Auto-triggered: platform emergency mode active");
  }

  return {
    frozen: deployFreezeActive,
    reason: deployFreezeReason,
    activatedAt: deployFreezeActivatedAt,
  };
}

export function activateDeployFreeze(reason: string): void {
  if (deployFreezeActive) return;
  deployFreezeActive = true;
  deployFreezeReason = reason;
  deployFreezeActivatedAt = Date.now();

  console.error(`[DeployProtection] DEPLOY FREEZE ACTIVATED: ${reason}`);
  addAlert(
    "critical",
    "deploy_freeze",
    "Deploy Freeze Activated",
    `Deployments are frozen. Reason: ${reason}`,
    "deployment_protection",
    { reason }
  );

  persistDeployEvent("deploy_freeze_activated", "system", "system", reason).catch(() => {});
}

export function deactivateDeployFreeze(actor?: string): void {
  if (!deployFreezeActive) return;
  const duration = deployFreezeActivatedAt ? Date.now() - deployFreezeActivatedAt : 0;
  deployFreezeActive = false;
  deployFreezeReason = null;
  deployFreezeActivatedAt = null;

  console.log(`[DeployProtection] Deploy freeze deactivated by ${actor || "system"} after ${Math.round(duration / 1000)}s`);
  persistDeployEvent("deploy_freeze_deactivated", "system", "system", `By ${actor || "system"} after ${Math.round(duration / 1000)}s`).catch(() => {});
}

let deployFreezeCheckInterval: ReturnType<typeof setInterval> | null = null;

export function startDeployFreezeWatcher(): void {
  if (deployFreezeCheckInterval) return;
  deployFreezeCheckInterval = setInterval(() => {
    checkDeployFreeze();
  }, 30000);
  console.log("[DeployProtection] Background deploy freeze watcher started (every 30s)");
}

export function stopDeployFreezeWatcher(): void {
  if (deployFreezeCheckInterval) {
    clearInterval(deployFreezeCheckInterval);
    deployFreezeCheckInterval = null;
  }
}

export function autoStartDeployMonitoring(): void {
  const version = process.env.REPL_SLUG || process.env.REPL_ID || `app-${Date.now()}`;
  startDeployMonitoring(version);
  startDeployFreezeWatcher();
}

export function getDeployHealthConfig(): DeployHealthConfig {
  return { ...deployHealthConfig };
}

export function setDeployHealthConfig(updates: Partial<DeployHealthConfig>): DeployHealthConfig {
  deployHealthConfig = { ...deployHealthConfig, ...updates };
  return { ...deployHealthConfig };
}

export function registerDeploymentProtectionRoutes(app: Express): void {

  app.get("/api/admin/deploy/health", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const result = runDeployHealthGate();
      const freezeStatus = checkDeployFreeze();

      res.json({
        currentDeploy: currentDeploy ? {
          id: currentDeploy.id,
          version: currentDeploy.version,
          deployedAt: currentDeploy.deployedAt,
          status: currentDeploy.status,
          monitoringEndAt: currentDeploy.monitoringEndAt,
          healthGateResult: currentDeploy.healthGateResult,
        } : null,
        liveHealthGate: result,
        deployFreeze: freezeStatus,
        config: deployHealthConfig,
        recentDeploys: deployHistory.slice(0, 10),
        metrics: {
          totalInWindow: getMetricsInWindow(deployHealthConfig.monitoringWindowMs).length,
          openCircuitBreakers: countOpenCircuitBreakers(),
        },
        timestamp: Date.now(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/deploy/start-monitoring", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const freezeStatus = checkDeployFreeze();
      if (freezeStatus.frozen) {
        return res.status(409).json({
          error: "Deploy freeze is active",
          reason: freezeStatus.reason,
          activatedAt: freezeStatus.activatedAt,
        });
      }

      const { version } = req.body;
      if (!version) return res.status(400).json({ error: "version is required" });

      const deploy = startDeployMonitoring(version);
      res.json({ success: true, deploy });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/deploy/rollback-alert", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const { reason } = req.body;
      if (currentDeploy) {
        currentDeploy.status = "rolled_back";
        if (healthGateInterval) {
          clearInterval(healthGateInterval);
          healthGateInterval = null;
        }
      }

      addAlert(
        "critical",
        "deployment",
        "Manual Rollback Triggered",
        `Admin ${user.username || user.id} triggered manual rollback. Reason: ${reason || "Not specified"}`,
        "deployment_protection",
        { actor: user.username || user.id, reason }
      );

      persistDeployEvent("manual_rollback", currentDeploy?.id || "unknown", currentDeploy?.version || "unknown", reason || "Manual trigger").catch(() => {});

      res.json({ success: true, message: "Rollback alert triggered" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/deploy/freeze-status", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const status = checkDeployFreeze();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/deploy/freeze", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const { active, reason } = req.body;
      if (active) {
        activateDeployFreeze(reason || `Manual freeze by ${user.username || user.id}`);
      } else {
        deactivateDeployFreeze(user.username || user.id);
      }

      res.json({ success: true, status: checkDeployFreeze() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/deploy/config", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const updates: Partial<DeployHealthConfig> = {};
      const b = req.body;
      if (typeof b.monitoringWindowMs === "number" && b.monitoringWindowMs > 0) updates.monitoringWindowMs = b.monitoringWindowMs;
      if (typeof b.errorRateThreshold === "number" && b.errorRateThreshold > 0) updates.errorRateThreshold = b.errorRateThreshold;
      if (typeof b.p95LatencyThresholdMs === "number" && b.p95LatencyThresholdMs > 0) updates.p95LatencyThresholdMs = b.p95LatencyThresholdMs;
      if (typeof b.circuitBreakerTripThreshold === "number" && b.circuitBreakerTripThreshold > 0) updates.circuitBreakerTripThreshold = b.circuitBreakerTripThreshold;
      if (typeof b.fallbackSpikeThreshold === "number" && b.fallbackSpikeThreshold > 0) updates.fallbackSpikeThreshold = b.fallbackSpikeThreshold;
      if (typeof b.checkIntervalMs === "number" && b.checkIntervalMs > 0) updates.checkIntervalMs = b.checkIntervalMs;
      if (typeof b.autoRollbackEnabled === "boolean") updates.autoRollbackEnabled = b.autoRollbackEnabled;

      const config = setDeployHealthConfig(updates);
      res.json({ success: true, config });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/deploy/history", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
      res.json({ deploys: deployHistory.slice(0, limit) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

export function requestMetricsMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.path.startsWith("/api/")) {
      next();
      return;
    }
    const start = Date.now();
    const originalEnd = res.end;
    (res as any).end = function (...args: any[]) {
      const latencyMs = Date.now() - start;
      const success = res.statusCode < 500;
      const isFallback = res.getHeader("x-fallback") === "true";
      recordRequestMetric({
        latencyMs,
        success,
        endpoint: req.path,
        isFallback,
      });
      if (res.statusCode >= 400) {
        try {
          const { recordRouteError } = require("./reliability-dashboard-routes");
          recordRouteError(req.path, res.statusCode);
        } catch {}
      }
      return (originalEnd as (...a: unknown[]) => unknown).apply(res, args);
    };
    next();
  };
}
