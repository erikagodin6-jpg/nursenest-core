import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  getCircuitBreakerStates,
  isEmergencyMode,
  getLastHealthResults,
} from "./platform-resilience";
import { checkPoolHealth } from "./exam-reliability";

interface ReleaseCheck {
  name: string;
  category: "deploy" | "content";
  status: "pass" | "fail" | "warn" | "skip";
  message: string;
  details?: any;
  required: boolean;
}

interface ReleaseGateResult {
  overallStatus: "pass" | "fail" | "warn";
  checks: ReleaseCheck[];
  passCount: number;
  failCount: number;
  warnCount: number;
  skipCount: number;
  timestamp: string;
  canDeploy: boolean;
  canPublish: boolean;
}

const overrideLog: any[] = [];

/* =========================
   CORE CHECK HELPERS
========================= */

const safeQuery = async (query: string) => {
  try {
    return await pool.query(query);
  } catch {
    return null;
  }
};

/* =========================
   DEPLOY CHECKS
========================= */

async function checkDbHealth(): Promise<ReleaseCheck> {
  try {
    const start = Date.now();
    await pool.query("SELECT 1");
    const latency = Date.now() - start;

    if (latency > 5000) {
      return {
        name: "Database Health",
        category: "deploy",
        status: "warn",
        message: `Slow response (${latency}ms)`,
        required: true,
      };
    }

    return {
      name: "Database Health",
      category: "deploy",
      status: "pass",
      message: `Healthy (${latency}ms)`,
      required: true,
    };
  } catch (err: any) {
    return {
      name: "Database Health",
      category: "deploy",
      status: "fail",
      message: err.message,
      required: true,
    };
  }
}

async function checkAuthSystem(): Promise<ReleaseCheck> {
  const r = await safeQuery(
    "SELECT COUNT(*)::int AS cnt FROM users WHERE tier = 'admin'"
  );

  const count = r?.rows?.[0]?.cnt ?? 0;

  return {
    name: "Auth System",
    category: "deploy",
    status: count > 0 ? "pass" : "warn",
    message:
      count > 0 ? `${count} admin users found` : "No admin users found",
    required: true,
  };
}

async function checkExamSystem(): Promise<ReleaseCheck> {
  try {
    const tiers = ["rpn", "rn", "np"];
    let unhealthy = false;

    for (const tier of tiers) {
      const result = await checkPoolHealth(tier);
      if (!result.healthy) unhealthy = true;
    }

    return {
      name: "Exam System",
      category: "deploy",
      status: unhealthy ? "warn" : "pass",
      message: unhealthy
        ? "Some tiers unhealthy"
        : "All exam tiers healthy",
      required: true,
    };
  } catch (err: any) {
    return {
      name: "Exam System",
      category: "deploy",
      status: "fail",
      message: err.message,
      required: true,
    };
  }
}

async function checkExamOpenFlow(): Promise<ReleaseCheck> {
  try {
    const start = Date.now();

    const res = await fetch(`http://localhost:${process.env.PORT || 5000}/api/exams`, {
      signal: AbortSignal.timeout(30_000),
    });

    const latency = Date.now() - start;

    if (!res.ok && res.status !== 401 && res.status !== 403) {
      return {
        name: "Exam Open Flow",
        category: "deploy",
        status: "fail",
        message: `HTTP ${res.status}`,
        required: true,
      };
    }

    if (latency > 5000) {
      return {
        name: "Exam Open Flow",
        category: "deploy",
        status: "warn",
        message: `Slow (${latency}ms)`,
        required: true,
      };
    }

    return {
      name: "Exam Open Flow",
      category: "deploy",
      status: "pass",
      message: `Healthy (${latency}ms)`,
      required: true,
    };
  } catch (err: any) {
    return {
      name: "Exam Open Flow",
      category: "deploy",
      status: "fail",
      message: err.message,
      required: true,
    };
  }
}

function checkMonitoringHealth(): ReleaseCheck {
  const breakers = getCircuitBreakerStates().filter(
    (b) => b.state === "open"
  );

  if (isEmergencyMode()) {
    return {
      name: "Monitoring",
      category: "deploy",
      status: "fail",
      message: "Emergency mode active",
      required: true,
    };
  }

  return {
    name: "Monitoring",
    category: "deploy",
    status: breakers.length > 0 ? "warn" : "pass",
    message:
      breakers.length > 0
        ? `${breakers.length} breakers open`
        : "Healthy",
    required: false,
  };
}

function checkMemory(): ReleaseCheck {
  const rss = process.memoryUsage().rss / 1024 / 1024;

  if (rss > 400) {
    return {
      name: "Memory",
      category: "deploy",
      status: "fail",
      message: `Critical (${rss.toFixed(0)}MB)`,
      required: true,
    };
  }

  if (rss > 300) {
    return {
      name: "Memory",
      category: "deploy",
      status: "warn",
      message: `Elevated (${rss.toFixed(0)}MB)`,
      required: true,
    };
  }

  return {
    name: "Memory",
    category: "deploy",
    status: "pass",
    message: `OK (${rss.toFixed(0)}MB)`,
    required: true,
  };
}

/* =========================
   CONTENT CHECKS
========================= */

async function checkContentSchema(): Promise<ReleaseCheck> {
  const tables = ["exam_questions", "flashcard_decks", "lessons"];
  const missing: string[] = [];

  for (const t of tables) {
    const r = await safeQuery(
      `SELECT to_regclass('${t}') IS NOT NULL AS exists`
    );
    if (!r?.rows?.[0]?.exists) missing.push(t);
  }

  return {
    name: "Content Schema",
    category: "content",
    status: missing.length > 0 ? "fail" : "pass",
    message:
      missing.length > 0
        ? `Missing: ${missing.join(", ")}`
        : "All tables present",
    required: true,
  };
}

async function checkContentValidation(): Promise<ReleaseCheck> {
  try {
    const r = await pool.query(`
      SELECT COUNT(*)::int AS cnt
      FROM exam_questions
      WHERE status = 'published'
      AND (stem IS NULL OR LENGTH(TRIM(stem)) < 10)
    `);

    const count = r.rows[0]?.cnt ?? 0;

    return {
      name: "Content Validation",
      category: "content",
      status: count > 0 ? "fail" : "pass",
      message:
        count > 0
          ? `${count} invalid questions`
          : "Valid",
      required: true,
    };
  } catch (err: any) {
    return {
      name: "Content Validation",
      category: "content",
      status: "fail",
      message: err.message,
      required: true,
    };
  }
}

/* =========================
   RUNNER
========================= */

async function runChecks(type: "deploy" | "content" | "all") {
  const checks: ReleaseCheck[] = [];

  if (type !== "content") {
    checks.push(
      ...(await Promise.all([
        checkDbHealth(),
        checkAuthSystem(),
        checkExamSystem(),
        checkExamOpenFlow(),
        Promise.resolve(checkMonitoringHealth()),
        Promise.resolve(checkMemory()),
      ]))
    );
  }

  if (type !== "deploy") {
    checks.push(
      ...(await Promise.all([
        checkContentSchema(),
        checkContentValidation(),
      ]))
    );
  }

  const fail = checks.filter((c) => c.required && c.status === "fail");

  return {
    overallStatus: fail.length ? "fail" : "pass",
    checks,
    passCount: checks.filter((c) => c.status === "pass").length,
    failCount: checks.filter((c) => c.status === "fail").length,
    warnCount: checks.filter((c) => c.status === "warn").length,
    skipCount: checks.filter((c) => c.status === "skip").length,
    timestamp: new Date().toISOString(),
    canDeploy: !fail.some((c) => c.category === "deploy"),
    canPublish: !fail.some((c) => c.category === "content"),
  };
}

/* =========================
   ROUTES
========================= */

export function registerReleaseGateRoutes(app: Express) {
  app.get("/api/admin/release-gate/check", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const type = (req.query.type as any) || "all";

    const result = await runChecks(type);
    res.json(result);
  });

  app.post("/api/admin/release-gate/override", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { justification, checksOverridden } = req.body;

    if (!justification || justification.length < 10) {
      return res
        .status(400)
        .json({ error: "Justification required (min 10 chars)" });
    }

    if (!Array.isArray(checksOverridden)) {
      return res
        .status(400)
        .json({ error: "checksOverridden must be array" });
    }

    const entry = {
      adminId: admin.id,
      justification,
      checksOverridden,
      timestamp: new Date().toISOString(),
    };

    overrideLog.unshift(entry);

    res.json({ success: true });
  });

  app.get("/api/admin/release-gate/overrides", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json({ overrides: overrideLog });
  });
}