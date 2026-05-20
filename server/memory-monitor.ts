import { pool } from "./storage";
import fs from "fs";
import { totalmem } from "os";
import { BoundedMap } from "./bounded-map";
import { emitStructuredLog } from "./log-sink";

/**
 * ------------------------------
 * TYPES
 * ------------------------------
 */

export interface MemoryStatus {
  heapUsedMB: number;
  heapTotalMB: number;
  rssMB: number;
  externalMB: number;
  heapUsagePercent: number;
  level: "normal" | "warning" | "protection" | "critical";
  timestamp: number;
  memoryLimitMB: number;
}

export interface MemoryPressureState {
  isWarning: boolean;
  isProtection: boolean;
  isCritical: boolean;
  level: MemoryStatus["level"];
  lastCheck: MemoryStatus | null;
  activeSince: number | null;
  spikeLog: MemorySpikeEntry[];
}

interface MemorySpikeEntry {
  timestamp: number;
  heapUsedMB: number;
  rssMB: number;
  heapUsagePercent: number;
  route: string | null;
  payloadSizeBytes: number | null;
  activeConnections: number;
}

/**
 * ------------------------------
 * MEMORY LIMIT DETECTION
 * ------------------------------
 */

function detectMemoryLimitMB(): number {
  const env = parseInt(process.env.MEMORY_TOTAL_MB || "");
  if (env > 0) return env;

  try {
    const v2 = "/sys/fs/cgroup/memory.max";
    if (fs.existsSync(v2)) {
      const val = fs.readFileSync(v2, "utf8").trim();
      if (val !== "max") return Math.round(parseInt(val) / 1024 / 1024);
    }
  } catch {}

  try {
    const v1 = "/sys/fs/cgroup/memory/memory.limit_in_bytes";
    if (fs.existsSync(v1)) {
      const bytes = parseInt(fs.readFileSync(v1, "utf8").trim());
      if (bytes > 0 && bytes < 1e15) return Math.round(bytes / 1024 / 1024);
    }
  } catch {}

  const sys = Math.round(totalmem() / 1024 / 1024);
  return Math.min(sys, 512);
}

/**
 * ------------------------------
 * CONSTANTS
 * ------------------------------
 */

const LIMIT = detectMemoryLimitMB();

/** Startup / policy code reads the same detected limit as the monitor (MB). */
export function getDetectedMemoryLimitMB(): number {
  return LIMIT;
}

const WARNING_MB = parseInt(process.env.MEMORY_WARNING_MB || "") || Math.round(LIMIT * 0.7);
const PROTECTION_MB = parseInt(process.env.MEMORY_PROTECTION_MB || "") || Math.round(LIMIT * 0.8);
const CRITICAL_MB = parseInt(process.env.MEMORY_CRITICAL_MB || "") || Math.round(LIMIT * 0.9);
const SAFE_MB = Math.round(CRITICAL_MB * 0.8);

const MONITOR_INTERVAL = 10000;
const CLEANUP_INTERVAL = 60000;
const HYSTERESIS_CHECKS = 12;

/**
 * ------------------------------
 * STATE
 * ------------------------------
 */

let monitorTimer: any = null;
let cleanupTimer: any = null;

let activeConnections = 0;
let consecutiveNormal = 0;
let belowSafeSince: number | null = null;

const pressure: MemoryPressureState = {
  isWarning: false,
  isProtection: false,
  isCritical: false,
  level: "normal",
  lastCheck: null,
  activeSince: null,
  spikeLog: [],
};

/**
 * ------------------------------
 * PUBLIC STATE
 * ------------------------------
 */

export function incrementConnections() { activeConnections++; }
export function decrementConnections() { activeConnections = Math.max(0, activeConnections - 1); }
export function getActiveConnectionCount() { return activeConnections; }
export function getMemoryPressure() { return { ...pressure }; }

export function isMemoryWarning() { return pressure.level !== "normal"; }
export function isMemoryProtectionActive() { return pressure.level === "protection" || pressure.level === "critical"; }
export function isMemoryCritical() { return pressure.level === "critical"; }

/**
 * ------------------------------
 * MEMORY CHECK
 * ------------------------------
 */

export function checkMemoryNow(): MemoryStatus {
  const m = process.memoryUsage();

  const rss = Math.round(m.rss / 1024 / 1024);
  const heapUsed = Math.round(m.heapUsed / 1024 / 1024);
  const heapTotal = Math.round(m.heapTotal / 1024 / 1024);

  let level: MemoryStatus["level"] = "normal";
  if (rss >= CRITICAL_MB) level = "critical";
  else if (rss >= PROTECTION_MB) level = "protection";
  else if (rss >= WARNING_MB) level = "warning";

  return {
    heapUsedMB: heapUsed,
    heapTotalMB: heapTotal,
    rssMB: rss,
    externalMB: Math.round(m.external / 1024 / 1024),
    heapUsagePercent: Math.round((rss / LIMIT) * 100),
    level,
    timestamp: Date.now(),
    memoryLimitMB: LIMIT,
  };
}

/**
 * ------------------------------
 * MAIN LOOP
 * ------------------------------
 */

function runCheck() {
  const status = checkMemoryNow();
  const prev = pressure.level;

  pressure.lastCheck = status;

  if (status.level !== "normal") {
    consecutiveNormal = 0;
    pressure.level = status.level;
    pressure.isWarning = true;
    pressure.isProtection = status.level !== "warning";
    pressure.isCritical = status.level === "critical";

    if (!pressure.activeSince) pressure.activeSince = Date.now();

    if (prev !== status.level) handleTransition(prev, status);

    logSpike(status);

  } else {
    consecutiveNormal++;

    if (consecutiveNormal >= HYSTERESIS_CHECKS) {
      pressure.level = "normal";
      pressure.isWarning = false;
      pressure.isProtection = false;
      pressure.isCritical = false;
      pressure.activeSince = null;

      if (prev !== "normal") handleTransition(prev, status);
    }
  }
}

/**
 * ------------------------------
 * TRANSITIONS
 * ------------------------------
 */

function handleTransition(prev: string, status: MemoryStatus) {
  if (status.level === "warning") {
    console.warn(`[Memory] WARNING ${status.rssMB}MB`);
  }

  if (status.level === "protection") {
    console.error(`[Memory] PROTECTION ${status.rssMB}MB`);
    triggerProtection();
  }

  if (status.level === "critical") {
    console.error(`[Memory] CRITICAL ${status.rssMB}MB`);
    triggerCritical();
  }

  if (status.level === "normal" && prev !== "normal") {
    console.log(`[Memory] NORMAL ${status.rssMB}MB`);
    deactivateProtection();
  }
}

/**
 * ------------------------------
 * ACTIONS
 * ------------------------------
 */

async function triggerProtection() {
  try {
    const { activateMinimalCore } = await import("./platform-resilience");
    activateMinimalCore("memory", "monitor");
  } catch {}
}

async function triggerCritical() {
  try {
    const { activateEmergencyMode } = await import("./platform-resilience");
    activateEmergencyMode("memory", "monitor");
  } catch {}

  try {
    const { clearCache } = await import("./performance");
    clearCache();
  } catch {}

  if (global.gc) {
    try { global.gc(); } catch {}
  }
}

async function deactivateProtection() {
  const status = checkMemoryNow();

  if (status.rssMB > SAFE_MB) {
    belowSafeSince = null;
    return;
  }

  if (!belowSafeSince) {
    belowSafeSince = Date.now();
    return;
  }

  if (Date.now() - belowSafeSince < 60000) return;

  try {
    const { deactivateMinimalCore, deactivateEmergencyMode } = await import("./platform-resilience");
    deactivateMinimalCore("memory");
    deactivateEmergencyMode("memory");
  } catch {}
}

/**
 * ------------------------------
 * SPIKES
 * ------------------------------
 */

export function logSpike(
  status: MemoryStatus,
  route: string | null = null,
  payloadSizeBytes: number | null = null,
) {
  pressure.spikeLog.push({
    timestamp: Date.now(),
    heapUsedMB: status.heapUsedMB,
    rssMB: status.rssMB,
    heapUsagePercent: status.heapUsagePercent,
    route,
    payloadSizeBytes,
    activeConnections,
  });

  if (pressure.spikeLog.length > 30) {
    pressure.spikeLog.splice(0, pressure.spikeLog.length - 30);
  }
}

/**
 * ------------------------------
 * CLEANUP
 * ------------------------------
 */

async function cleanup() {
  try {
    await pool.query(`
      UPDATE mlt_exam_sessions
      SET status='abandoned'
      WHERE status='in_progress'
      AND started_at < NOW() - INTERVAL '6 hours'
    `);
  } catch {}

  if (pressure.isProtection && global.gc) {
    try { global.gc(); } catch {}
  }
}

/**
 * ------------------------------
 * START / STOP
 * ------------------------------
 */

export function startMemoryMonitor() {
  if (monitorTimer) return;

  console.log(`[Memory] Limit ${LIMIT}MB`);

  runCheck();
  monitorTimer = setInterval(runCheck, MONITOR_INTERVAL);
  cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL);
}

export function stopMemoryMonitor() {
  if (monitorTimer) clearInterval(monitorTimer);
  if (cleanupTimer) clearInterval(cleanupTimer);

  monitorTimer = null;
  cleanupTimer = null;
}

/**
 * ------------------------------
 * UTILITIES
 * ------------------------------
 */

export function getMemoryLevel() {
  return pressure.level;
}

export function getMaxPayloadSize(): number {
  if (pressure.isCritical) return 25;
  if (pressure.isProtection) return 50;
  if (pressure.isWarning) return 100;
  return 200;
}

export function shouldReducePayloads() {
  return pressure.level !== "normal";
}

export function shouldPauseBackgroundJobs() {
  return pressure.level === "protection" || pressure.level === "critical";
}

export function shouldRejectHeavyWork() {
  return pressure.level === "critical";
}

/* ----- Route latency + admin health (used by routes.ts) ----- */

const routeLatencyRing: { method: string; path: string; durationMs: number }[] = [];
const ROUTE_LATENCY_CAP = 500;

const HEAVY_ROUTE_PREFIXES = [
  "/api/mock-exams",
  "/api/cat-exams",
  "/api/ai/",
  "/api/admin/ai",
];

export function getMemoryMonitorStatus() {
  const s = checkMemoryNow();
  const p = getMemoryPressure();
  return {
    heapUsedMB: s.heapUsedMB,
    heapTotalMB: s.heapTotalMB,
    rssMB: s.rssMB,
    level: s.level,
    memoryLimitMB: s.memoryLimitMB,
    heapUsagePercent: s.heapUsagePercent,
    pressure: p,
    thresholds: {
      limitMB: LIMIT,
      warningMB: WARNING_MB,
      protectionMB: PROTECTION_MB,
      criticalMB: CRITICAL_MB,
      safeMB: SAFE_MB,
    },
  };
}

export function getMemoryTrend() {
  return { spikes: pressure.spikeLog.slice(-30) };
}

/** Recent memory spike / protection context for admin diagnostics. */
export function getProtectionActions(limit: number) {
  const n = Math.min(Math.max(limit, 1), 200);
  return pressure.spikeLog.slice(-n);
}

export function getRouteLatencyStats(limit: number) {
  const n = Math.min(Math.max(limit, 1), ROUTE_LATENCY_CAP);
  return routeLatencyRing.slice(-n);
}

export function recordRouteLatency(
  method: string,
  path: string,
  durationMs: number,
  _payloadBytes?: number,
) {
  routeLatencyRing.push({ method, path, durationMs });
  while (routeLatencyRing.length > ROUTE_LATENCY_CAP) routeLatencyRing.shift();
}

export function isHeavyRoute(path: string): boolean {
  return HEAVY_ROUTE_PREFIXES.some((p) => path.startsWith(p));
}

export function logHeavyRouteMemory(
  method: string,
  path: string,
  phase: string,
  extra?: Record<string, unknown>,
) {
  emitStructuredLog({
    level: "info",
    type: "heavy_route_memory",
    method,
    path,
    phase,
    ...extra,
  });
}

export function logProtectionAction(action: string, reason: string) {
  emitStructuredLog(
    {
      level: "warn",
      type: "memory_protection",
      action,
      msg: reason,
    },
    "warn",
  );
}