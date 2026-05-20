import type { Express, Request, Response } from "express";

/* =========================
   TYPES
========================= */

type ChaosResult = {
  scenario: string;
  status: "pass" | "fail";
  message: string;
  durationMs: number;
};

/* =========================
   SAFE SCENARIOS (READ-ONLY)
========================= */

async function testDatabase(): Promise<ChaosResult> {
  const start = Date.now();

  try {
    const { pool } = await import("./storage");
    await pool.query("SELECT 1");

    return {
      scenario: "database",
      status: "pass",
      message: "Database responsive",
      durationMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      scenario: "database",
      status: "fail",
      message: err.message,
      durationMs: Date.now() - start,
    };
  }
}

async function testExamSystem(): Promise<ChaosResult> {
  const start = Date.now();

  try {
    const { assembleExam } = await import("./mock-exam-assembly");

    await assembleExam({
      templateId: "test",
      examCode: "test",
      questionCount: 5,
      timeLimitMinutes: 60,
      passingStandard: 60,
      seed: 1,
      tier: "rn",
      domainWeights: [{ domain: "general", weight: 1 }],
      difficultyDistribution: { foundational: 0.34, moderate: 0.33, difficult: 0.33 },
      formatMix: {
        mcqSingle: 1,
        selectAllThatApply: 0,
        scenarioBased: 0,
        prioritization: 0,
        delegation: 0,
      },
    });

    return {
      scenario: "exam_system",
      status: "pass",
      message: "Exam assembly working",
      durationMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      scenario: "exam_system",
      status: "fail",
      message: err.message,
      durationMs: Date.now() - start,
    };
  }
}

async function testMemory(): Promise<ChaosResult> {
  const start = Date.now();

  const mem = process.memoryUsage().rss / 1024 / 1024;

  return {
    scenario: "memory",
    status: mem > 400 ? "fail" : "pass",
    message: `Memory usage: ${mem.toFixed(0)}MB`,
    durationMs: Date.now() - start,
  };
}

/* =========================
   RUNNER
========================= */

async function runTests(): Promise<any> {
  const results = await Promise.all([
    testDatabase(),
    testExamSystem(),
    testMemory(),
  ]);

  const failed = results.filter(r => r.status === "fail");

  return {
    overall: failed.length ? "fail" : "pass",
    results,
    timestamp: Date.now(),
  };
}

/* =========================
   ROUTES
========================= */

export function registerChaosRoutes(app: Express) {

  app.get("/api/admin/health-check", async (req: any, res: Response) => {
    try {
      const { requireAdmin } = await import("./admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await runTests();
      res.json(result);

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

}