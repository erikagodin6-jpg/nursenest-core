import type { Request, Response, Express } from "express";

/**
 * ------------------------------
 * TYPES
 * ------------------------------
 */

interface RunbookStep {
  id: string;
  title: string;
  description: string;
  type: "diagnosis" | "action" | "verification" | "communication";
  commands?: string[];
  killSwitchRef?: string;
  featureFlagRef?: string;
  apiEndpoint?: string;
  expectedOutcome?: string;
  warningLevel?: "info" | "warning" | "critical";
}

interface Runbook {
  id: string;
  title: string;
  incidentType: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  symptoms: string[];
  likelyCauses: string[];
  diagnosisSteps: RunbookStep[];
  actionSteps: RunbookStep[];
  verificationSteps: RunbookStep[];
  killSwitchRefs: string[];
  featureFlagRefs: string[];
  communicationTemplate: any;
  estimatedResolutionMinutes: number;
  lastUsed: number | null;
  usageCount: number;
  tags: string[];
}

interface RunbookExecution {
  id: string;
  runbookId: string;
  startedAt: number;
  completedAt: number | null;
  executedBy: string;
  completedSteps: string[];
  currentStepId: string | null;
  notes: Record<string, string>;
  status: "in_progress" | "completed" | "aborted";
}

/**
 * ------------------------------
 * STATE
 * ------------------------------
 */

const runbooks = new Map<string, Runbook>();
const runbookExecutions: RunbookExecution[] = [];

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getAllSteps(rb: Runbook): RunbookStep[] {
  return [...rb.diagnosisSteps, ...rb.actionSteps, ...rb.verificationSteps];
}

function safeLimit(val: any, def = 20, max = 50) {
  const n = parseInt(val);
  if (isNaN(n)) return def;
  return Math.min(n, max);
}

async function resolveAdmin(req: Request, res: Response) {
  try {
    const { resolveAuthUser } = await import("./admin-auth");
    const user = await resolveAuthUser(req as any);

    if (!user || user.tier !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return null;
    }

    return user;
  } catch {
    res.status(403).json({ error: "Authentication failed" });
    return null;
  }
}

/**
 * ------------------------------
 * REGISTER ROUTES
 * ------------------------------
 */

export function registerRunbookRoutes(app: Express): void {

  /**
   * LIST
   */
  app.get("/api/admin/runbooks", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    let results = Array.from(runbooks.values());

    const search = (req.query.search as string)?.toLowerCase();
    const category = req.query.category as string;
    const severity = req.query.severity as string;

    if (search) {
      results = results.filter(rb =>
        rb.title.toLowerCase().includes(search) ||
        rb.incidentType.toLowerCase().includes(search) ||
        rb.symptoms.some(s => s.toLowerCase().includes(search)) ||
        rb.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (category) {
      results = results.filter(rb => rb.category === category);
    }

    if (severity) {
      results = results.filter(rb => rb.severity === severity);
    }

    res.json({
      runbooks: results,
      total: results.length,
      timestamp: Date.now(),
    });
  });

  /**
   * GET ONE
   */
  app.get("/api/admin/runbooks/:id", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const rb = runbooks.get(req.params.id);
    if (!rb) return res.status(404).json({ error: "Runbook not found" });

    res.json({ runbook: rb, timestamp: Date.now() });
  });

  /**
   * START EXECUTION
   */
  app.post("/api/admin/runbooks/:id/start-execution", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const rb = runbooks.get(req.params.id);
    if (!rb) return res.status(404).json({ error: "Runbook not found" });

    const steps = getAllSteps(rb);

    const execution: RunbookExecution = {
      id: genId(),
      runbookId: rb.id,
      startedAt: Date.now(),
      completedAt: null,
      executedBy: admin.username || admin.id,
      completedSteps: [],
      currentStepId: steps[0]?.id || null,
      notes: {},
      status: "in_progress",
    };

    runbookExecutions.unshift(execution);
    if (runbookExecutions.length > 100) runbookExecutions.length = 100;

    rb.usageCount++;
    rb.lastUsed = Date.now();

    res.json({ execution, timestamp: Date.now() });
  });

  /**
   * EXECUTE STEP
   */
  app.post("/api/admin/runbooks/:id/execute-step", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const { executionId, stepId, note } = req.body;

    if (!executionId || !stepId) {
      return res.status(400).json({ error: "executionId and stepId required" });
    }

    const exec = runbookExecutions.find(e => e.id === executionId);
    if (!exec) return res.status(404).json({ error: "Execution not found" });

    if (!exec.completedSteps.includes(stepId)) {
      exec.completedSteps.push(stepId);
    }

    if (note) exec.notes[stepId] = note;

    const rb = runbooks.get(exec.runbookId);

    if (rb) {
      const steps = getAllSteps(rb);
      const idx = steps.findIndex(s => s.id === stepId);

      if (idx !== -1 && idx < steps.length - 1) {
        exec.currentStepId = steps[idx + 1].id;
      } else {
        exec.currentStepId = null;
        exec.status = "completed";
        exec.completedAt = Date.now();
      }
    }

    res.json({ execution: exec, timestamp: Date.now() });
  });

  /**
   * ABORT
   */
  app.post("/api/admin/runbooks/:id/abort-execution", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const exec = runbookExecutions.find(e => e.id === req.body.executionId);
    if (!exec) return res.status(404).json({ error: "Execution not found" });

    exec.status = "aborted";
    exec.completedAt = Date.now();

    res.json({ execution: exec, timestamp: Date.now() });
  });

  /**
   * RECENT EXECUTIONS
   */
  app.get("/api/admin/runbooks/executions/recent", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const limit = safeLimit(req.query.limit);

    res.json({
      executions: runbookExecutions.slice(0, limit),
      timestamp: Date.now(),
    });
  });
}