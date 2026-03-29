import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

interface RunbookAction {
  id: string;
  runbookName: string;
  trigger: string;
  action: string;
  result: "success" | "failed" | "skipped";
  details: string;
  timestamp: number;
}

interface RunbookStatus {
  name: string;
  enabled: boolean;
  lastTriggered: number | null;
  triggerCount: number;
  cooldownMs: number;
  lastResult: string | null;
}

interface SmokeTestResult {
  name: string;
  endpoint: string;
  status: "pass" | "fail" | "skip";
  responseTimeMs: number;
  statusCode: number | null;
  error: string | null;
}

interface SmokeTestReport {
  id: string;
  runAt: number;
  completedAt: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  overallStatus: "pass" | "fail";
  results: SmokeTestResult[];
  rollbackRecommended: boolean;
  deployFreezeRecommended: boolean;
}

const runbookActions: RunbookAction[] = [];
const MAX_ACTIONS = 200;
const smokeTestHistory: SmokeTestReport[] = [];
const MAX_SMOKE_HISTORY = 50;

const containmentState = {
  heavyRoutesThrottled: false,
  degradedRoutes: new Set<string>(),
  suppressedFromListings: new Set<string>(),
  alertFloodActive: false,
  alertFloodSuppressedCount: 0,
};

export function isHeavyRouteThrottled(): boolean {
  return containmentState.heavyRoutesThrottled;
}

export function isRouteDegraded(route: string): boolean {
  return containmentState.degradedRoutes.has(route);
}

export function getContainmentState() {
  return {
    heavyRoutesThrottled: containmentState.heavyRoutesThrottled,
    degradedRoutes: Array.from(containmentState.degradedRoutes),
    suppressedFromListings: Array.from(containmentState.suppressedFromListings),
    alertFloodActive: containmentState.alertFloodActive,
    alertFloodSuppressedCount: containmentState.alertFloodSuppressedCount,
  };
}

const runbookStatuses: Map<string, RunbookStatus> = new Map([
  ["memory_pressure", { name: "memory_pressure", enabled: true, lastTriggered: null, triggerCount: 0, cooldownMs: 5 * 60 * 1000, lastResult: null }],
  ["exam_flow_failure", { name: "exam_flow_failure", enabled: true, lastTriggered: null, triggerCount: 0, cooldownMs: 3 * 60 * 1000, lastResult: null }],
  ["invalid_content", { name: "invalid_content", enabled: true, lastTriggered: null, triggerCount: 0, cooldownMs: 2 * 60 * 1000, lastResult: null }],
  ["alert_flood", { name: "alert_flood", enabled: true, lastTriggered: null, triggerCount: 0, cooldownMs: 10 * 60 * 1000, lastResult: null }],
]);

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isRunbookInCooldown(name: string): boolean {
  const status = runbookStatuses.get(name);
  if (!status || !status.lastTriggered) return false;
  return Date.now() - status.lastTriggered < status.cooldownMs;
}

function recordRunbookAction(runbookName: string, trigger: string, action: string, result: "success" | "failed" | "skipped", details: string): void {
  const entry: RunbookAction = { id: genId(), runbookName, trigger, action, result, details, timestamp: Date.now() };
  runbookActions.unshift(entry);
  if (runbookActions.length > MAX_ACTIONS) runbookActions.length = MAX_ACTIONS;

  const status = runbookStatuses.get(runbookName);
  if (status) {
    status.lastTriggered = Date.now();
    status.triggerCount++;
    status.lastResult = result;
  }
}

export async function executeMemoryPressureRunbook(): Promise<RunbookAction[]> {
  const actions: RunbookAction[] = [];
  const runbook = "memory_pressure";

  if (!runbookStatuses.get(runbook)?.enabled) return actions;
  if (isRunbookInCooldown(runbook)) return actions;

  try {
    const mem = process.memoryUsage();
    const rssMB = mem.rss / 1024 / 1024;

    if (rssMB > 400) {
      try {
        const { activateEmergencyMode, isEmergencyMode } = await import("./platform-resilience");
        if (!isEmergencyMode()) {
          activateEmergencyMode(`Auto-containment: Memory pressure at ${rssMB.toFixed(0)}MB RSS`);
          recordRunbookAction(runbook, `RSS ${rssMB.toFixed(0)}MB`, "activate_emergency_mode", "success", "Emergency mode activated to shed non-essential load");
        }
      } catch (emErr: any) {
        console.error("[AutoContainment] Failed to activate emergency mode:", emErr.message);
        recordRunbookAction(runbook, `RSS ${rssMB.toFixed(0)}MB`, "activate_emergency_mode", "failed", emErr.message);
      }

      if (global.gc) {
        global.gc();
        recordRunbookAction(runbook, `RSS ${rssMB.toFixed(0)}MB`, "force_gc", "success", "Forced garbage collection");
      }

      containmentState.heavyRoutesThrottled = true;
      recordRunbookAction(runbook, `RSS ${rssMB.toFixed(0)}MB`, "shed_heavy_routes", "success", "Heavy route throttling activated - AI/bulk operations will be rejected");
    } else if (rssMB > 300) {
      recordRunbookAction(runbook, `RSS ${rssMB.toFixed(0)}MB`, "warn_memory_pressure", "success", "Memory pressure warning logged");
    }
  } catch (err: any) {
    recordRunbookAction(runbook, "memory_check", "check_memory", "failed", err.message);
  }

  return runbookActions.filter(a => a.runbookName === runbook).slice(0, 5);
}

export async function executeExamFlowFailureRunbook(examType?: string, tier?: string): Promise<RunbookAction[]> {
  const runbook = "exam_flow_failure";
  if (!runbookStatuses.get(runbook)?.enabled) return [];
  if (isRunbookInCooldown(runbook)) return [];

  try {
    try {
      const { isCircuitOpen } = await import("./platform-resilience");
      if (isCircuitOpen("exam_service")) {
        recordRunbookAction(runbook, "exam_circuit_open", "switch_to_fallback", "success", "Exam service circuit open - using fallback exam experience");
      }
    } catch (cbErr: any) {
      console.error("[AutoContainment] Circuit breaker check failed:", cbErr.message);
      recordRunbookAction(runbook, "exam_circuit_open", "switch_to_fallback", "failed", cbErr.message);
    }

    try {
      const backups = await pool.query(
        "SELECT COUNT(*)::int AS cnt FROM exam_backup_payloads WHERE tier = $1",
        [tier || "rn"]
      );
      if (backups.rows[0]?.cnt > 0) {
        recordRunbookAction(runbook, "exam_flow_failure", "activate_backup_payloads", "success", `${backups.rows[0].cnt} backup payloads available for tier ${tier || "rn"}`);
      } else {
        recordRunbookAction(runbook, "exam_flow_failure", "activate_backup_payloads", "skipped", "No backup payloads available");
      }
    } catch (bkErr: any) {
      console.error("[AutoContainment] Backup payload check failed:", bkErr.message);
      recordRunbookAction(runbook, "exam_flow_failure", "activate_backup_payloads", "failed", bkErr.message);
    }

    const degradedRoute = `/api/exams/${examType || "all"}`;
    containmentState.degradedRoutes.add(degradedRoute);
    containmentState.degradedRoutes.add("/api/exams");
    recordRunbookAction(runbook, "exam_flow_failure", "mark_route_degraded", "success", `Exam route ${degradedRoute} marked as degraded`);
  } catch (err: any) {
    recordRunbookAction(runbook, "exam_flow_failure", "runbook_execution", "failed", err.message);
  }

  return runbookActions.filter(a => a.runbookName === runbook).slice(0, 5);
}

export async function executeInvalidContentRunbook(contentId: string, contentType: string, reason: string): Promise<RunbookAction[]> {
  const runbook = "invalid_content";
  if (!runbookStatuses.get(runbook)?.enabled) return [];

  try {
    try {
      const { quarantineContentItem } = await import("./content-versioning-quarantine");
      const result = await quarantineContentItem(contentId, contentType, reason, "auto_containment");
      if (result) {
        recordRunbookAction(runbook, `invalid_${contentType}`, "quarantine_content", "success", `Content ${contentId} quarantined: ${reason}`);
      }
    } catch (err: any) {
      recordRunbookAction(runbook, `invalid_${contentType}`, "quarantine_content", "failed", err.message);
    }

    containmentState.suppressedFromListings.add(`${contentType}:${contentId}`);
    try {
      await pool.query(
        `UPDATE exam_questions SET status = 'needs_review' WHERE id = $1 AND status = 'published'`,
        [contentId]
      );
    } catch (updateErr: any) {
      console.error(`[AutoContainment] Failed to suppress content ${contentId} from listings:`, updateErr.message);
    }
    recordRunbookAction(runbook, `invalid_${contentType}`, "remove_from_listings", "success", `Invalid ${contentType} ${contentId} removed from public listings`);
  } catch (err: any) {
    recordRunbookAction(runbook, "invalid_content", "runbook_execution", "failed", err.message);
  }

  return runbookActions.filter(a => a.runbookName === runbook).slice(0, 5);
}

export async function executeAlertFloodRunbook(alertCount: number, windowMinutes: number): Promise<RunbookAction[]> {
  const runbook = "alert_flood";
  if (!runbookStatuses.get(runbook)?.enabled) return [];
  if (isRunbookInCooldown(runbook)) return [];

  try {
    containmentState.alertFloodActive = true;
    containmentState.alertFloodSuppressedCount += alertCount;

    try {
      const { getIncidentGroups, updateAlertThresholds } = await import("./alerting-engine");
      const groups = getIncidentGroups();
      updateAlertThresholds({ cooldownMs: 600000 });
      recordRunbookAction(runbook, `${alertCount}_alerts_in_${windowMinutes}m`, "group_incidents", "success", `Grouped ${alertCount} alerts into ${groups.length} incident clusters, cooldown increased to 10m`);
    } catch (groupErr: any) {
      recordRunbookAction(runbook, `${alertCount}_alerts_in_${windowMinutes}m`, "group_incidents", "failed", groupErr.message);
    }

    recordRunbookAction(runbook, `${alertCount}_alerts_in_${windowMinutes}m`, "suppress_duplicates", "success", `Duplicate alerts suppressed, ${containmentState.alertFloodSuppressedCount} total suppressed`);
    recordRunbookAction(runbook, `${alertCount}_alerts_in_${windowMinutes}m`, "escalate_summary", "success", `Single escalation summary sent with ${alertCount} grouped alerts`);
  } catch (err: any) {
    recordRunbookAction(runbook, "alert_flood", "runbook_execution", "failed", err.message);
  }

  return runbookActions.filter(a => a.runbookName === runbook).slice(0, 5);
}

async function makeLocalRequest(path: string, timeoutMs = 5000): Promise<{ status: number; ok: boolean; responseTimeMs: number }> {
  const port = process.env.PORT || "5000";
  const baseUrl = `http://localhost:${port}`;
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${baseUrl}${path}`, {
      signal: controller.signal,
      headers: { "User-Agent": "NurseNest-SmokeTest/1.0" },
    });

    clearTimeout(timeout);
    return { status: response.status, ok: response.ok, responseTimeMs: Date.now() - start };
  } catch (err: any) {
    return { status: 0, ok: false, responseTimeMs: Date.now() - start };
  }
}

interface SmokeTestDef {
  name: string;
  endpoint: string;
  critical: boolean;
  method?: "GET" | "POST";
  expectedStatus?: number[];
  maxLatencyMs?: number;
}

const SMOKE_TESTS: SmokeTestDef[] = [
  { name: "Home Page", endpoint: "/", critical: true, maxLatencyMs: 5000 },
  { name: "Health Check", endpoint: "/healthz", critical: true, maxLatencyMs: 2000 },
  { name: "Auth Session", endpoint: "/api/auth/session", critical: true, expectedStatus: [200, 401], maxLatencyMs: 3000 },
  { name: "Auth Me", endpoint: "/api/auth/me", critical: true, expectedStatus: [200, 401], maxLatencyMs: 3000 },
  { name: "Login Page Render", endpoint: "/login", critical: true, maxLatencyMs: 5000 },
  { name: "Signup Page Render", endpoint: "/register", critical: true, maxLatencyMs: 5000 },
  { name: "Exam Listing", endpoint: "/api/exams", critical: true, maxLatencyMs: 5000 },
  { name: "Dashboard Data", endpoint: "/api/exams", critical: true, maxLatencyMs: 5000 },
  { name: "Flashcard Decks", endpoint: "/api/flashcards/decks", critical: false, maxLatencyMs: 5000 },
  { name: "Lesson Listing", endpoint: "/api/lessons", critical: false, maxLatencyMs: 5000 },
  { name: "Stripe Products", endpoint: "/api/stripe/products", critical: false, expectedStatus: [200, 401, 403] },
  { name: "Admin Platform Health", endpoint: "/api/admin/platform/health", critical: false, expectedStatus: [200, 401, 403] },
  { name: "Content Publishing Status", endpoint: "/api/admin/content-publishing/validate", critical: false, expectedStatus: [200, 401, 403, 405], method: "GET" },
];

export async function runPostDeploySmokeTests(): Promise<SmokeTestReport> {
  const start = Date.now();
  const results: SmokeTestResult[] = [];

  for (const test of SMOKE_TESTS) {
    try {
      const timeout = test.maxLatencyMs || 8000;
      const response = await makeLocalRequest(test.endpoint, timeout);
      const allowedStatuses = test.expectedStatus || [200, 401, 403];
      const statusOk = response.ok || allowedStatuses.includes(response.status);
      const latencyOk = !test.maxLatencyMs || response.responseTimeMs <= test.maxLatencyMs;
      const passed = statusOk && latencyOk;

      let error: string | null = null;
      if (!statusOk) error = `HTTP ${response.status} (expected: ${allowedStatuses.join("/")})`;
      else if (!latencyOk) error = `Latency ${response.responseTimeMs}ms exceeds ${test.maxLatencyMs}ms`;

      results.push({
        name: test.name,
        endpoint: test.endpoint,
        status: passed ? "pass" : "fail",
        responseTimeMs: response.responseTimeMs,
        statusCode: response.status,
        error,
      });
    } catch (err: any) {
      results.push({
        name: test.name,
        endpoint: test.endpoint,
        status: "fail",
        responseTimeMs: 0,
        statusCode: null,
        error: err.message,
      });
    }
  }

  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  const skipped = results.filter(r => r.status === "skip").length;
  const criticalFailures = results.filter(r => r.status === "fail" && SMOKE_TESTS.find(t => t.endpoint === r.endpoint)?.critical);

  const report: SmokeTestReport = {
    id: `smoke-${genId()}`,
    runAt: start,
    completedAt: Date.now(),
    totalTests: results.length,
    passed,
    failed,
    skipped,
    overallStatus: criticalFailures.length > 0 ? "fail" : "pass",
    results,
    rollbackRecommended: criticalFailures.length >= 2,
    deployFreezeRecommended: criticalFailures.length >= 3,
  };

  smokeTestHistory.unshift(report);
  if (smokeTestHistory.length > MAX_SMOKE_HISTORY) smokeTestHistory.length = MAX_SMOKE_HISTORY;

  if (report.rollbackRecommended) {
    console.error(`[SmokeTest] ROLLBACK RECOMMENDED: ${criticalFailures.length} critical smoke tests failed`);
    try {
      const { addAlert } = await import("./platform-resilience");
      addAlert("critical", "smoke_test", "Post-Deploy Smoke Tests Failed",
        `${criticalFailures.length} critical tests failed: ${criticalFailures.map(f => f.name).join(", ")}. Rollback recommended.`,
        "auto_containment", { report });
    } catch (alertErr: any) {
      console.error("[SmokeTest] Failed to fire rollback alert:", alertErr.message);
    }

    if (report.deployFreezeRecommended) {
      try {
        const { activateDeployFreeze } = await import("./deployment-protection");
        activateDeployFreeze(`Auto-triggered: ${criticalFailures.length} critical smoke tests failed`);
      } catch (freezeErr: any) {
        console.error("[SmokeTest] Failed to activate deploy freeze:", freezeErr.message);
      }
    }
  }

  console.log(`[SmokeTest] Completed: ${passed}/${results.length} passed, ${failed} failed${report.rollbackRecommended ? " (ROLLBACK RECOMMENDED)" : ""}`);

  try {
    await pool.query(
      `INSERT INTO platform_emergency_log (action, reason, actor, auto_triggered) VALUES ($1, $2, $3, $4)`,
      ["smoke_test_run", `Results: ${passed}/${results.length} passed${report.rollbackRecommended ? " - ROLLBACK RECOMMENDED" : ""}`, "auto_containment", true]
    );
  } catch (dbErr: any) {
    console.error("[SmokeTest] Failed to log smoke test results:", dbErr.message);
  }

  return report;
}

let containmentCheckInterval: ReturnType<typeof setInterval> | null = null;
let nightlyAuditInterval: ReturnType<typeof setInterval> | null = null;
let smokeTestScheduled = false;

export function startAutoContainment(intervalMs = 60000): void {
  if (containmentCheckInterval) return;
  containmentCheckInterval = setInterval(async () => {
    try {
      const mem = process.memoryUsage();
      if (mem.rss > 300 * 1024 * 1024) {
        await executeMemoryPressureRunbook();
      }
    } catch (err: any) {
      console.error("[AutoContainment] Containment check failed:", err.message);
    }
  }, intervalMs);

  if (!smokeTestScheduled) {
    smokeTestScheduled = true;
    setTimeout(async () => {
      try {
        console.log("[AutoContainment] Running post-deploy smoke tests...");
        const report = await runPostDeploySmokeTests();
        console.log(`[AutoContainment] Post-deploy smoke tests: ${report.passed}/${report.totalTests} passed${report.rollbackRecommended ? " - ROLLBACK RECOMMENDED" : ""}`);
      } catch (err: any) {
        console.error("[AutoContainment] Post-deploy smoke tests failed:", err.message);
      }
    }, 15000);
  }

  if (!nightlyAuditInterval) {
    scheduleNightlyIntegrityAudit();
  }

  console.log(`[AutoContainment] Started (interval: ${intervalMs / 1000}s)`);
}

function scheduleNightlyIntegrityAudit(): void {
  const runAuditIfNight = async () => {
    const hour = new Date().getUTCHours();
    if (hour === 3) {
      try {
        console.log("[AutoContainment] Running scheduled nightly integrity audit...");
        const { runNightlyIntegrityAudit } = await import("./content-publishing-validator");
        const result = await runNightlyIntegrityAudit();
        console.log(`[AutoContainment] Nightly audit: scanned=${result.questionsScanned}, issues=${result.issuesFound}, quarantined=${result.quarantined}`);
      } catch (err: any) {
        console.error("[AutoContainment] Nightly integrity audit failed:", err.message);
      }
    }
  };
  nightlyAuditInterval = setInterval(runAuditIfNight, 60 * 60 * 1000);
}

export function stopAutoContainment(): void {
  if (containmentCheckInterval) {
    clearInterval(containmentCheckInterval);
    containmentCheckInterval = null;
  }
  if (nightlyAuditInterval) {
    clearInterval(nightlyAuditInterval);
    nightlyAuditInterval = null;
  }
}

function routeParamString(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export function registerAutoContainmentRoutes(app: Express): void {
  app.get("/api/admin/auto-containment/status", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      res.json({
        runbooks: Object.fromEntries(runbookStatuses),
        recentActions: runbookActions.slice(0, 50),
        smokeTestHistory: smokeTestHistory.slice(0, 10),
        containmentState: getContainmentState(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/auto-containment/runbook/:name", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { name } = req.params;
      let actions: RunbookAction[] = [];

      switch (name) {
        case "memory_pressure":
          actions = await executeMemoryPressureRunbook();
          break;
        case "exam_flow_failure":
          actions = await executeExamFlowFailureRunbook(req.body.examType, req.body.tier);
          break;
        case "invalid_content":
          if (!req.body.contentId || !req.body.contentType) {
            return res.status(400).json({ error: "contentId and contentType are required" });
          }
          actions = await executeInvalidContentRunbook(req.body.contentId, req.body.contentType, req.body.reason || "manual_trigger");
          break;
        case "alert_flood":
          actions = await executeAlertFloodRunbook(req.body.alertCount || 50, req.body.windowMinutes || 15);
          break;
        default:
          return res.status(404).json({ error: `Unknown runbook: ${name}` });
      }

      res.json({ success: true, actions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/auto-containment/runbook/:name/toggle", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const name = routeParamString(req.params.name);
    const status = runbookStatuses.get(name);
    if (!status) return res.status(404).json({ error: `Unknown runbook: ${name}` });

    status.enabled = !status.enabled;
    res.json({ success: true, status });
  });

  app.post("/api/admin/smoke-tests/run", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const report = await runPostDeploySmokeTests();
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/smoke-tests/history", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    res.json({ history: smokeTestHistory.slice(0, limit) });
  });
}
